<template>
  <view class="forum-container">
    <!-- 顶部导航 -->
    <view class="header">
      <text class="title" @longpress="toggleDebugMode">技术论坛</text>
    </view>
    
    <!-- 智能筛选器组 -->
    <view class="filter-section">
      <!-- 搜索框 -->
      <view class="search-bar">
        <input class="forum-input" placeholder="搜索话题..." v-model="keyword" @confirm="search" />
        <button class="forum-btn forum-btn-primary" @click="search">搜索</button>
      </view>
      
      <!-- 筛选器组 -->
      <view class="filter-group">
        <!-- 岗位分类筛选 -->
        <view class="filter-item">
          <text class="filter-label">分类</text>
          <view class="filter-options">
            <text 
              class="filter-option" 
              :class="{active: currentCategory === 'all'}"
              @click="switchCategory('all')"
            >全部</text>
            <text 
              class="filter-option" 
              v-for="category in categories.filter(c => c.level === 1)" 
              :key="category.id"
              :class="{active: currentCategory === category.id}"
              @click="switchCategory(category.id)"
            >{{category.name}}</text>
          </view>
        </view>
        
        <!-- 子分类筛选（当选择技术开发类时显示） -->
        <view class="filter-item" v-if="showCategoryTabs && subCategoryList.length > 0">
          <text class="filter-label">技术方向</text>
          <view class="filter-options">
            <text 
              class="filter-option" 
              :class="{active: selectedSubCategories.length === 0}"
              @click="clearSubCategories"
            >全部</text>
            <text 
              class="filter-option" 
              v-for="category in subCategoryList" 
              :key="category.id"
              :class="{active: selectedSubCategories.includes(Number(category.next_category_id || category.id))}"
              @click="toggleSubCategory(category.id)"
            >{{category.name}}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 帖子列表 -->
    <scroll-view class="post-list" scroll-y @scrolltolower="loadMore" refresher-enabled @refresherrefresh="onRefresh" :refresher-triggered="isRefreshing">
      <view class="forum-card forum-mb-md" v-for="post in posts" :key="post.id" @click="goToDetail(post)">
        <view class="post-main">
          <!-- 左侧：用户信息区 -->
          <view class="user-section">
            <view class="forum-avatar forum-avatar-md"><text class="avatar-text">U</text></view>
            <text class="username">用户{{post.user_id}}</text>
            <text class="user-level">L1</text>
          </view>
          
          <!-- 中部：内容核心区 -->
          <view class="content-section">
            <text class="post-title">{{post.title || post.content}}</text>
            <text class="post-summary" v-if="post.content.length > 100">{{post.content.substring(0, 100)}}...</text>
            <text class="post-summary" v-else-if="post.content !== post.title">{{post.content}}</text>
            <view class="post-tags">
              <text class="forum-tag forum-tag-primary">{{getCategoryName(post.category_id)}}</text>
            </view>
            <view class="post-stats">
              <text class="stat">
                <text class="icon">💬</text>
                {{post.reply_count || 0}}
              </text>
              <text class="stat">
                <text class="icon">👁</text>
                {{post.view_count || 0}}
              </text>
              <text class="stat">
                <text class="icon">👍</text>
                {{post.like_count || 0}}
              </text>
            </view>
          </view>
          
          <!-- 右侧：时间信息 -->
          <view class="time-section">
            <text class="post-time">{{formatTime(post.created_at)}}</text>
            <text class="reply-time" v-if="post.last_reply_time">最后回复: {{formatTime(post.last_reply_time)}}</text>
          </view>
        </view>
      </view>
      
      <view class="load-more" v-if="loading">加载中...</view>
      <view class="no-more" v-if="!hasMore && posts.length > 0">没有更多了</view>
      <view class="no-data" v-if="posts.length === 0 && !loading">
        <text>暂无帖子，快来发布第一个话题吧！</text>
      </view>
    </scroll-view>
    
    <!-- 快速操作按钮 -->
    <button class="forum-btn forum-btn-primary" style="position: fixed; bottom: 100rpx; right: 40rpx; width: 100rpx; height: 100rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 100;" @click="toggleQuickMenu">
      <text class="plus">+</text>
    </button>
    
    <!-- 快速操作菜单 -->
    <view class="quick-menu" v-if="showQuickMenu" @click="hideQuickMenu">
      <view class="menu-content" @click.stop>
        <view class="forum-card forum-mb-sm" @click="goToPost">
            <text class="menu-icon">✍️</text>
            <text class="menu-text">发布话题</text>
          </view>
          <view class="forum-card forum-mb-sm" @click="goToAsk">
            <text class="menu-icon">❓</text>
            <text class="menu-text">发布提问</text>
          </view>
          <view class="forum-card" @click="goToShare">
            <text class="menu-icon">📤</text>
            <text class="menu-text">分享资源</text>
          </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forumApi } from '@/common/api/forum.js'

export default {
  data() {
    return {
      keyword: '',
      currentCategory: 'all',
      posts: [],
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 20,
      isRefreshing: false,
      showQuickMenu: false,
      userInfo: null,
      userPostCount: 0,
      loadMoreTimer: null,
      isLoadingReplies: false,
      debugMode: false, // 手动控制调试模式
      categories: [
        { id: '100', name: '技术开发类', parent_id: null, level: 1, next_category_id: 100 },
        { id: '101', name: '前端开发', parent_id: 100, level: 2, next_category_id: 101 },
        { id: '102', name: '后端开发', parent_id: 100, level: 2, next_category_id: 102 },
        { id: '103', name: '移动端开发', parent_id: 100, level: 2, next_category_id: 103 },
        { id: '104', name: '数据与AI', parent_id: 100, level: 2, next_category_id: 104 },
        { id: '105', name: '运维与测试', parent_id: 100, level: 2, next_category_id: 105 },
        { id: '106', name: '产品设计', parent_id: 100, level: 2, next_category_id: 106 },
        { id: '107', name: '网络安全', parent_id: 100, level: 2, next_category_id: 107 },
        { id: '108', name: '嵌入式开发', parent_id: 100, level: 2, next_category_id: 108 },
        { id: '200', name: '产品与设计类', parent_id: null, level: 1, next_category_id: 200 },
        { id: '300', name: '技术管理类', parent_id: null, level: 1, next_category_id: 300 }
      ],
      
      showCategoryTabs: false,
      selectedSubCategories: [],
      categoryMap: {
        '101': '前端',
        '102': '后端', 
        '103': '移动端',
        '104': '数据与AI',
        '105': '运维与测试',
        '106': '产品设计',
        '107': '网络安全',
        '108': '嵌入式',
        '200': '产品设计',
        '300': '技术管理'
      }
    }
  },
  
  onLoad() {
    this.loadUserInfo()
    this.loadUserPostCount()
    this.loadPosts()
  },
  
  onShow() {
    this.loadUserInfo()
    // 重新加载帖子数据，确保新发布的话题显示
    this.loadPosts(true)
  },
  
  onUnload() {
    // 清理定时器
    if (this.loadMoreTimer) {
      clearTimeout(this.loadMoreTimer)
    }
  },
  
  // 切换调试模式 - 长按标题5次开启/关闭
  toggleDebugMode() {
    this.debugMode = !this.debugMode
    uni.showToast({
      title: this.debugMode ? '调试模式已开启' : '调试模式已关闭',
      icon: 'none',
      duration: 2000
    })
  },
  
  methods: {
    // 加载帖子数据
    async loadPosts(reset = false) {
      if (reset) {
        this.page = 1
        this.hasMore = true
      }
      
      // 添加加载锁，防止重复调用
      if (this.loading || (!reset && !this.hasMore)) {
        return
      }
      
      this.loading = true
      
      try {
        let res
        
        // 检查当前分类是否为一级分类
        const currentCategoryNum = Number(this.currentCategory)
        const isTopLevelCategory = this.categories.some(c => Number(c.id) === currentCategoryNum && c.level === 1)
        
        if (this.currentCategory === 'all') {
          // 获取所有帖子
          res = await forumApi.getAllFirstComments()
        } else if (isTopLevelCategory) {
          // 一级分类，需要获取所有子分类的帖子
          // 获取所有帖子，然后在前端筛选
          res = await forumApi.getAllFirstComments()
        } else {
          // 获取特定分类的帖子
          try {
            res = await forumApi.getCommentsByCategory(this.currentCategory)
            // 如果分类查询返回null或空，尝试获取所有数据然后前端筛选
            if (!res || res.length === 0) {
              res = await forumApi.getAllFirstComments()
            }
          } catch (error) {
            // 只在调试模式下显示错误
            if (this.debugMode) {
              console.log('分类查询失败，使用所有数据:', error)
            }
            res = await forumApi.getAllFirstComments()
          }
        }
        
        // 减少日志输出，只在调试模式下显示
        if (this.debugMode) {
          console.log('论坛数据:', res)
          console.log('当前分类:', this.currentCategory)
          console.log('是否一级分类:', isTopLevelCategory)
          console.log('所有分类:', this.categories)
        }
        
        // 处理null响应
        if (res === null) {
          res = []
        }
        
        // 验证数据格式（只在调试模式下显示）
        if (res && res.length > 0 && this.debugMode) {
          console.log('第一条数据示例:', res[0])
          console.log('数据字段验证:', {
            hasId: res[0].hasOwnProperty('id'),
            hasContent: res[0].hasOwnProperty('content'),
            hasCategoryId: res[0].hasOwnProperty('category_id'),
            hasUserId: res[0].hasOwnProperty('user_id'),
            hasCreatedAt: res[0].hasOwnProperty('created_at')
          })
        }
        
        if (res && res.length > 0) {
          // 应用多级分类筛选逻辑
          let filteredPosts = [...res]
          
          // 如果选择"全部"分类，不需要筛选
          if (this.currentCategory === 'all') {
            // 不筛选
          }
          // 如果选择了一级分类
          else if (isTopLevelCategory) {
            let targetCategoryIds = []
            
            // 处理200和300分类（没有子分类）
            if ([200, 300].includes(currentCategoryNum)) {
              targetCategoryIds = [currentCategoryNum]
              if (this.debugMode) {
                console.log('200/300分类直接使用:', targetCategoryIds)
              }
            } else {
              // 获取该一级分类的所有子分类ID（使用next_category_id）
              targetCategoryIds = this.categories
                .filter(c => c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum))
                .map(c => parseInt(c.next_category_id))
              
              if (this.debugMode) {
                console.log('子分类ID列表:', targetCategoryIds)
              }
            }
            
            // 筛选该一级分类下的帖子
            filteredPosts = filteredPosts.filter(post => {
              if (!post || post.category_id === null) {
                return false
              }
              
              const postCategoryId = post.category_id
              const isMatch = targetCategoryIds.includes(postCategoryId)
              // 只在调试模式下显示详细匹配信息
              if (this.debugMode) {
                console.log(`帖子${post.id}的分类${postCategoryId}是否匹配:`, isMatch)
              }
              return isMatch
            })
            
            // 如果有子分类筛选
            if (this.selectedSubCategories.length > 0) {
              // 对于200和300分类，子分类筛选就是自身分类筛选
              if ([200, 300].includes(currentCategoryNum)) {
                filteredPosts = filteredPosts.filter(post => {
                  if (!post || post.category_id === null) {
                    return false
                  }
                  return post.category_id === currentCategoryNum
                })
              } else {
                // 对于其他分类，使用正常的子分类筛选
                filteredPosts = filteredPosts.filter(post => {
                  if (!post || post.category_id === null) {
                    return false
                  }
                  
                  const postCategoryId = post.category_id
                  return this.selectedSubCategories.includes(postCategoryId)
                })
              }
            }
          } else {
            // 处理二级分类筛选
            const currentCategoryObj = this.categories.find(c => c.id === this.currentCategory)
            if (currentCategoryObj) {
              const targetCategoryId = currentCategoryObj.next_category_id
              filteredPosts = filteredPosts.filter(post => {
                if (!post || post.category_id === null) {
                  return false
                }
                return post.category_id === targetCategoryId
              })
            }
          }
          
          // 为每个帖子添加回复数量统计 - 延迟获取，减少初始加载压力
          let postsWithReplyCount = filteredPosts.map(post => ({
            ...post,
            reply_count: 0 // 初始化为0，后续异步更新
          }))
          
          // 延迟获取回复数量，避免阻塞主流程
          setTimeout(() => {
            this.updateReplyCounts(filteredPosts)
          }, 500)
          
          if (reset) {
            this.posts = postsWithReplyCount
          } else {
            this.posts = [...this.posts, ...postsWithReplyCount]
          }
          
          this.hasMore = filteredPosts.length >= this.pageSize
          this.page++
        } else {
          this.hasMore = false
          if (reset) {
            this.posts = []
          }
        }
      } catch (error) {
        console.error('加载帖子失败:', error)
        console.error('错误详情:', error.message, error.stack)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
        this.isRefreshing = false
      }
    },
    
    // 异步更新回复数量 - 分批处理，避免一次性请求过多
    async updateReplyCounts(posts) {
      if (!posts || posts.length === 0 || this.isLoadingReplies) return
      
      this.isLoadingReplies = true
      
      try {
        // 分批处理，每批3个，减少并发
        const batchSize = 3
        for (let i = 0; i < posts.length; i += batchSize) {
          const batch = posts.slice(i, i + batchSize)
          
          try {
            const batchResults = await Promise.all(
              batch.map(async (post) => {
                try {
                  const replies = await forumApi.getCommentReplies(post.id)
                  return {
                    id: post.id,
                    reply_count: replies && replies.length ? replies.length : 0
                  }
                } catch (error) {
                  // 只在调试模式下显示错误
                  if (this.debugMode) {
                    console.error(`获取帖子${post.id}回复数量失败:`, error)
                  }
                  return {
                    id: post.id,
                    reply_count: 0
                  }
                }
              })
            )
            
            // 更新本地数据
            batchResults.forEach(result => {
              const postIndex = this.posts.findIndex(p => p.id === result.id)
              if (postIndex !== -1) {
                this.$set(this.posts[postIndex], 'reply_count', result.reply_count)
              }
            })
            
            // 每批之间稍作延迟，避免请求过于频繁
            if (i + batchSize < posts.length) {
              await new Promise(resolve => setTimeout(resolve, 300))
            }
            
          } catch (error) {
              // 只在调试模式下显示错误
              if (this.debugMode) {
                console.error(`批量更新回复数量失败:`, error)
              }
            }
        }
      } finally {
        this.isLoadingReplies = false
      }
    },
    
    // 搜索
    search() {
      this.page = 1
      this.loadPosts(true)
    },
    
    // 切换分类
    switchCategory(category) {
      this.currentCategory = category
      const categoryNum = Number(category)
      
      // 检查是否为一级分类
      const isTopLevelCategory = this.categories.some(c => Number(c.id) === categoryNum && c.level === 1)
      
      if (isTopLevelCategory) {
        this.showCategoryTabs = true
        
        // 获取该一级分类的子分类
        this.subCategoryList = this.categories.filter(c => {
          // 处理200和300分类（没有子分类）
          if ([200, 300].includes(categoryNum)) {
            return false
          }
          return c.parent_id && (c.parent_id.toString() === category || c.parent_id === categoryNum)
        })
        
        // 如果是200或300分类，直接使用当前分类ID
        if ([200, 300].includes(categoryNum)) {
          this.subCategoryList = [{ 
            id: category, 
            name: this.categories.find(c => c.id === category)?.name || category 
          }]
        }
        
        // 移除日志输出
      } else {
        this.showCategoryTabs = false
      }
      
      this.page = 1
      this.loadPosts(true)
    },
    
    // 切换子分类
    toggleSubCategory(categoryId) {
      // 查找对应的分类，获取其next_category_id
      const category = this.categories.find(c => c.id === categoryId)
      const numCategoryId = category ? Number(category.next_category_id) : Number(categoryId)
      const index = this.selectedSubCategories.indexOf(numCategoryId)
      
      if (index === -1) {
        this.selectedSubCategories.push(numCategoryId)
      } else {
        this.selectedSubCategories.splice(index, 1)
      }
      
      this.page = 1
      this.loadPosts(true)
    },
    
    // 清空子分类筛选
    clearSubCategories() {
      this.selectedSubCategories = []
      this.page = 1
      this.loadPosts(true)
    },
    
    // 下拉刷新
    onRefresh() {
      this.isRefreshing = true
      this.loadPosts(true)
    },
    
    // 加载更多
    loadMore() {
      if (this.loading || !this.hasMore) return
      
      // 清除之前的定时器
      if (this.loadMoreTimer) {
        clearTimeout(this.loadMoreTimer)
      }
      
      // 设置防抖，防止快速滚动触发多次
      this.loadMoreTimer = setTimeout(() => {
        this.loadPosts()
      }, 300)
    },
    
    // 跳转到详情页
    goToDetail(post) {
      uni.navigateTo({
        url: `/pages/forum/details/forum_detail?id=${post.id}`
      })
    },
    
    
    
    // 跳转到发帖页
    goToPost() {
      uni.navigateTo({
        url: '/pages/forum/post'
      })
    },
    
    // 切换快速菜单
    toggleQuickMenu() {
      this.showQuickMenu = !this.showQuickMenu
    },
    
    // 隐藏快速菜单
    hideQuickMenu() {
      this.showQuickMenu = false
    },
    
    // 跳转到提问页
    goToAsk() {
      this.hideQuickMenu()
      // 目前先跳转到发帖页，后续可以扩展为专门的提问页面
      uni.navigateTo({
        url: '/pages/forum/post?type=ask'
      })
    },
    
    // 跳转到分享资源页
    goToShare() {
      this.hideQuickMenu()
      // 目前先跳转到发帖页，后续可以扩展为专门的分享页面
      uni.navigateTo({
        url: '/pages/forum/post?type=share'
      })
    },
    
    // 加载用户信息
    loadUserInfo() {
      let userInfo = uni.getStorageSync('userInfo')
      // 处理userInfo可能是JSON字符串的情况
      if (typeof userInfo === 'string') {
        try {
          userInfo = JSON.parse(userInfo)
        } catch (e) {
          userInfo = null
        }
      }
      this.userInfo = userInfo
    },
    
    // 加载用户发帖数
    async loadUserPostCount() {
      if (!this.userInfo) return
      
      try {
        // 这里应该调用实际的API
        // const res = await forumApi.getUserPostCount(this.userInfo.user_id)
        // this.userPostCount = res.count || 0
        this.userPostCount = 0 // 模拟数据
      } catch (error) {
        console.error('加载用户发帖数失败:', error)
      }
    },
    
    // 获取分类名称
    getCategoryName(categoryId) {
      // 首先查找当前分类（根据next_category_id匹配）
      const category = this.categories.find(c => Number(c.next_category_id) === Number(categoryId))
      if (!category) {
        return '其他'
      }
      
      // 如果是一级分类，直接返回名称
      if (category.level === 1) {
        return category.name
      }
      
      // 如果是二级分类，查找父分类并返回层次结构
      const parentCategory = this.categories.find(c => Number(c.id) === Number(category.parent_id))
      if (parentCategory) {
        return `${parentCategory.name}-${category.name}`
      }
      
      return category.name || '其他'
    },
    
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr) return '未知时间'
      
      try {
        const date = new Date(timeStr.replace(/-/g, '/'))
        const now = new Date()
        const diff = now - date
        
        const minute = 60 * 1000
        const hour = 60 * minute
        const day = 24 * hour
        
        if (diff < minute) {
          return '刚刚'
        } else if (diff < hour) {
          return Math.floor(diff / minute) + '分钟前'
        } else if (diff < day) {
          return Math.floor(diff / hour) + '小时前'
        } else {
          return Math.floor(diff / day) + '天前'
        }
      } catch (e) {
        return timeStr
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/common/styles/theme.css';
@import '@/common/styles/forum.scss';
.forum-container {
  min-height: 100vh;
  background: var(--bg-secondary, #f5f5f5);
  display: flex;
  flex-direction: column;
}

/* 侧边栏样式 */
.drawer-content {
  padding: 0;
  height: 100%;
  overflow-y: auto;
}

.drawer-header {
  padding: 20rpx 30rpx;
  border-bottom: 2rpx solid var(--border-color, #eeeeee);
  background: var(--bg-card, #ffffff);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.close-icon {
  font-size: 28rpx;
  line-height: 1;
  font-weight: 500;
}

.drawer-title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--text-primary, #333333);
  flex: 1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.user-details {
  flex: 1;
}

.user-stats {
  font-size: 22rpx;
  opacity: 0.9;
  margin-top: 10rpx;
  color: var(--text-secondary, #666666);
}

.login-prompt {
  text-align: center;
  padding: 20rpx;
  color: var(--text-secondary, #666666);
}

.nav-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-primary, #333333);
  margin-bottom: 20rpx;
  display: block;
}

.category-tree {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.category-name {
  font-size: 26rpx;
  color: var(--text-primary, #333333);
}

.action-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-radius: 10rpx;
  transition: all 0.3s ease;
  
  &:active {
    background: #f0f0f0;
  }
}

.action-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.action-text {
  font-size: 26rpx;
  color: var(--text-primary, #333333);
}

.rule-text {
  font-size: 24rpx;
  color: var(--text-secondary, #666666);
  line-height: 1.5;
  margin-bottom: 20rpx;
}

/* 顶部导航样式 */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60rpx 30rpx 30rpx;
  background: var(--primary-color, #007aff);
  color: white;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  color: white;
}

/* 智能筛选器样式 */
.filter-section {
  background: var(--bg-card, #ffffff);
  border-bottom: 2rpx solid var(--border-color, #eeeeee);
}

.search-bar {
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: var(--bg-card, #ffffff);
}

.filter-group {
  padding: 0 20rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.filter-label {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-primary, #333333);
}

.filter-options {
  display: flex;
  gap: 15rpx;
  flex-wrap: wrap;
}

.filter-option {
  padding: 15rpx 25rpx;
  background: var(--bg-secondary, #f5f5f5);
  border-radius: 50rpx;
  font-size: 24rpx;
  color: var(--text-secondary, #666666);
  transition: all 0.3s ease;
  
  &.active {
    background: var(--primary-color, #007aff);
    color: white;
  }
}

/* 帖子列表样式 */
.post-list {
  flex: 1;
  padding: 20rpx;
}

.post-main {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
}

.user-section {
  width: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.username {
  font-size: 24rpx;
  font-weight: 600;
  color: var(--text-primary, #333333);
  text-align: center;
}

.user-level {
  font-size: 20rpx;
  color: var(--primary-color, #007aff);
  background: rgba(0, 122, 255, 0.1);
  padding: 5rpx 10rpx;
  border-radius: 10rpx;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.post-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--text-primary, #333333);
  line-height: 1.4;
}

.post-summary {
  font-size: 26rpx;
  color: var(--text-secondary, #666666);
  line-height: 1.5;
}

.post-tags {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}

.post-stats {
  display: flex;
  gap: 30rpx;
  padding-top: 15rpx;
  border-top: 2rpx solid var(--border-color-light, #f0f0f0);
}

.stat {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: var(--text-secondary, #666666);
}

.icon {
  font-size: 24rpx;
}

.time-section {
  width: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10rpx;
}

.post-time {
  font-size: 22rpx;
  color: var(--text-tertiary, #999999);
}

.reply-time {
  font-size: 20rpx;
  color: var(--text-tertiary, #999999);
  opacity: 0.8;
}

/* 加载状态样式 */
.load-more, .no-more, .no-data {
  text-align: center;
  padding: 40rpx;
  color: var(--text-tertiary, #999999);
  font-size: 28rpx;
}

.no-data {
  margin-top: 200rpx;
}

/* 快速操作菜单样式 */
.quick-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
}

.menu-content {
  background-color: var(--bg-card, #ffffff);
  border-radius: 30rpx 30rpx 0 0;
  padding: 40rpx 20rpx;
  width: 100%;
  max-width: 600rpx;
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.menu-text {
  font-size: 28rpx;
  color: var(--text-primary, #333333);
  font-weight: 500;
}

.plus {
  color: white;
  font-size: 48rpx;
  font-weight: bold;
}
</style>