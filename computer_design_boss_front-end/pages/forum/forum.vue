<template>
  <view class="forum-container" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航 -->
    <view class="nav-bar forum-nav" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="nav-bar-left">
        <!-- 取消返回按钮 -->
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title forum-title" @longpress="toggleDebugMode" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">技术论坛</text>
      </view>
      <view class="nav-bar-right">
        <!-- 移除搜索图标 -->
      </view>
    </view>
    
    <!-- 智能筛选器组 -->
    <view class="filter-section" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <!-- 搜索框 -->
      <view class="search-bar" :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)' }">
        <input class="forum-input" placeholder="搜索话题..." v-model="keyword" @confirm="search" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }" />
        
      </view>
      
      <!-- 筛选器组 -->
      <view class="filter-group">
        <!-- 岗位分类筛选 -->
        <view class="filter-item">
          <view class="filter-label-container">
            <view class="title-dot"></view>
            <text class="filter-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">分类</text>
          </view>
          <view class="filter-options">
            <text 
              class="filter-option" 
              v-for="category in categories.filter(c => c.level === 1)" 
              :key="category.id"
              :class="{active: currentCategory === category.id || (currentCategory === 'all' && categories.filter(c => c.level === 1).indexOf(category) === 0)}"
              @click="switchCategory(category.id)"
              :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)', color: '#007aff' }"
            >{{category.name}}</text>
          </view>
        </view>
        
        <!-- 子分类筛选（当选择技术开发类时显示） -->
        <view class="filter-item" v-if="showCategoryTabs && subCategoryList.length > 0">
          <view class="filter-label-container">
            <view class="title-dot"></view>
            <text class="filter-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">技术方向</text>
          </view>
          <view class="filter-options">
            <text 
              class="filter-option" 
              :class="{active: selectedSubCategories.length === 0}"
              @click="clearSubCategories"
              :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)', color: '#007aff' }"
            >全部</text>
            <text 
              class="filter-option" 
              v-for="category in subCategoryList" 
              :key="category.id"
              :class="{active: selectedSubCategories.includes(Number(category.next_category_id || category.id))}"
              @click="toggleSubCategory(category.id)"
              :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)', color: '#007aff' }"
            >{{category.name}}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 帖子列表 -->
    <scroll-view class="post-list" scroll-y @scrolltolower="loadMore" refresher-enabled @refresherrefresh="onRefresh" :refresher-triggered="isRefreshing">
      <view class="forum-card forum-mb-md" v-for="post in posts" :key="post.id" @click="goToDetail(post)" :style="{ background: isDarkMode ? '#2c2c2c' : 'linear-gradient(135deg, #ffffff, #f8faff)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
        <view class="post-main">
          <!-- 左侧：用户信息区 -->
          <view class="user-section">
            <image class="forum-avatar forum-avatar-md" :src="isValidAvatar(post.user_avatar) ? 'data:image/' + (post.user_avatar_format === 'jpg' ? 'jpeg' : post.user_avatar_format || 'jpeg') + ';base64,' + decodeHtmlEntities(post.user_avatar.replace(/\s+/g, '')) : '/static/default-avatar.png'" mode="aspectFill"></image>
            <text class="username" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">用户{{post.user_id}}</text>
            <text class="user-level" :style="{ background: isDarkMode ? 'rgba(79, 172, 254, 0.2)' : 'rgba(79, 172, 254, 0.1)' }">L1</text>
          </view>  
          <!-- 中部：内容核心区 -->
          <view class="content-section">
            <text class="post-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{post.title || post.content}}</text>
            <text class="post-summary" v-if="post.content.length > 100" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{post.content.substring(0, 100)}}...</text>
            <text class="post-summary" v-else-if="post.content !== post.title" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{post.content}}</text>
            <view class="post-tags">
              <text class="forum-tag forum-tag-primary" :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)', color: '#007aff' }">{{getCategoryName(post.category_id)}}</text>
            </view>
            <view class="post-stats" :style="{ borderTop: isDarkMode ? '1px solid #404040' : '1px solid #E6F0FF' }">
              <text class="stat" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">
                <text class="icon">💬</text>
                {{post.reply_count || 0}}
              </text>
              <text class="stat" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">
                <text class="icon">👁</text>
                {{post.view_count || 0}}
              </text>
              <text class="stat" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">
                <text class="icon">👍</text>
                {{post.like_count || 0}}
              </text>
            </view>
          </view>
          
          <!-- 右侧：时间信息 -->
          <view class="time-section">
            <text class="post-time" :style="{ color: isDarkMode ? '#999' : '#999999' }">{{formatTime(post.created_at)}}</text>
            <text class="reply-time" v-if="post.last_reply_time" :style="{ color: isDarkMode ? '#999' : '#999999' }">最后回复: {{formatTime(post.last_reply_time)}}</text>
          </view>
        </view>
      </view>
      
      <view class="load-more" v-if="loading" :style="{ color: isDarkMode ? '#999' : '#999999' }">加载中...</view>
      <view class="no-more" v-if="!hasMore && posts.length > 0" :style="{ color: isDarkMode ? '#999' : '#999999' }">没有更多了</view>
      <view class="no-data" v-if="posts.length === 0 && !loading" :style="{ color: isDarkMode ? '#999' : '#999999' }">
        <text>暂无帖子，快来发布第一个话题吧！</text>
      </view>
    </scroll-view>
    
    <!-- 快速操作按钮 -->
    <button class="forum-btn forum-btn-primary" style="position: fixed; bottom: 100rpx; right: 40rpx; width: 100rpx; height: 100rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 100;" @click="toggleQuickMenu">
      <text class="plus">+</text>
    </button>
    
    <!-- 快速操作菜单 -->
    <view class="quick-menu" v-if="showQuickMenu" @click="hideQuickMenu">
      <view class="menu-content" @click.stop :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.9)' : 'linear-gradient(135deg, #ffffff, #f8faff)' }">
        <view class="forum-card forum-mb-sm" @click="goToPost" :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #ffffff, #f8faff)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
            <text class="menu-icon">✍️</text>
            <text class="menu-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">发布话题</text>
          </view>
          <view class="forum-card forum-mb-sm" @click="goToAsk" :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #ffffff, #f8faff)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
            <text class="menu-icon">❓</text>
            <text class="menu-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">发布提问</text>
          </view>
          <view class="forum-card" @click="goToShare" :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #ffffff, #f8faff)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
            <text class="menu-icon">📤</text>
            <text class="menu-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">分享资源</text>
          </view>
      </view>
    </view>
  </view>
</template>

<script>
import { forumApi } from '@/common/api/forum.js'
import { themeManager } from '@/common/utils/theme-simple.js'

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
      },
      // 主题相关
      currentTheme: 'light',
      isDarkMode: false
    }
  },
  
  onLoad() {
    this.initDefaultCategory()
    this.initTheme()
  },
  
  onShow() {
    // 重新加载帖子数据，确保新发布的话题显示
    this.loadPosts(true)
  },
  
  onUnload() {
    // 清理定时器
    if (this.loadMoreTimer) {
      clearTimeout(this.loadMoreTimer)
    }
    // 清理主题监听
    uni.$off('globalThemeChange', this.handleGlobalThemeChange)
  },
  
  methods: {
    // 切换调试模式 - 长按标题5次开启/关闭
    toggleDebugMode() {
      this.debugMode = !this.debugMode
      uni.showToast({
        title: this.debugMode ? '调试模式已开启' : '调试模式已关闭',
        icon: 'none',
        duration: 2000
      })
    },
    
    // 解码HTML实体
    decodeHtmlEntities(text) {
      const entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
      }
      return text.replace(/&[#\w]+;/g, (entity) => {
        return entities[entity] || entity
      })
    },
    
    // 检查头像数据是否有效
    isValidAvatar(avatar) {
      if (!avatar || avatar === '') {
        return false
      }
      
      // 清理空白字符
      const cleaned = avatar.replace(/\s+/g, '')
      
      // 检查是否是有效的图片base64编码
      // 有效的JPEG开头: /9j/
      // 有效的PNG开头: iVBOR
      // 有效的GIF开头: R0lG
      // 有效的BMP开头: Qk
      const validPrefixes = ['/9j/', 'iVBOR', 'R0lG', 'Qk']
      
      // 尝试使用后端返回的数据，即使不是标准格式
      // 可能是后端的TO_BASE64函数生成的格式不同
      return cleaned.length > 0
    },
    /**
     * 初始化主题
     */
    initTheme() {
      // 获取当前主题
      this.currentTheme = themeManager.getCurrentTheme()
      this.isDarkMode = this.currentTheme === 'dark'
      
      // 监听全局主题变化
      uni.$on('globalThemeChange', this.handleGlobalThemeChange)
    },
    
    /**
     * 处理全局主题变化
     */
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme
      this.isDarkMode = data.isDark
    },
    
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
        
        // 直接获取所有帖子，然后在前端进行筛选
        res = await forumApi.getAllFirstComments()
        
        // 调试头像数据
        if (res && res.length > 0) {
          console.log('=== 头像数据调试信息 ===')
          res.slice(0, 3).forEach((post, index) => {
            console.log(`帖子 ${index + 1} (用户ID: ${post.user_id}):`)
            console.log('  user_avatar 存在:', !!post.user_avatar)
            console.log('  user_avatar 长度:', post.user_avatar ? post.user_avatar.length : 0)
            console.log('  user_avatar_format:', post.user_avatar_format)
            console.log('  user_avatar 前20字符:', post.user_avatar ? post.user_avatar.substring(0, 20) : '空')
            
            // 构建头像URL
            if (post.user_avatar && post.user_avatar !== '') {
              // 去除空白字符并解码HTML实体
              const cleanedAvatar = post.user_avatar.replace(/\s+/g, '')
              const decodedAvatar = this.decodeHtmlEntities(cleanedAvatar)
              const avatarUrl = 'data:image/' + (post.user_avatar_format === 'jpg' ? 'jpeg' : post.user_avatar_format || 'jpeg') + ';base64,' + decodedAvatar
              console.log('  构建的头像URL长度:', avatarUrl.length)
              console.log('  头像URL前50字符:', avatarUrl.substring(0, 50))
              
              // 检查base64数据是否有效
              console.log('  base64数据开头检查:')
              console.log('    是否以/9j/开头（JPEG）:', decodedAvatar.startsWith('/9j/'))
              console.log('    是否以iVBOR开头（PNG）:', decodedAvatar.startsWith('iVBOR'))
              console.log('    是否以R0lG开头（GIF）:', decodedAvatar.startsWith('R0lG'))
              console.log('    是否以Qk开头（BMP）:', decodedAvatar.startsWith('Qk'))
              
              // 检查是否包含空白字符
              console.log('  空白字符检查:')
              console.log('    原始数据包含空白字符:', /\s/.test(post.user_avatar))
              console.log('    清理后长度:', cleanedAvatar.length)
              console.log('    解码后长度:', decodedAvatar.length)
              console.log('    原始长度:', post.user_avatar.length)
              
              // 检查是否包含HTML实体
              console.log('  HTML实体检查:')
              console.log('    包含&符号:', cleanedAvatar.includes('&'))
              console.log('    解码前后是否不同:', cleanedAvatar !== decodedAvatar)
            }
            console.log('---')
          })
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
          
          // 应用关键词搜索筛选
          if (this.keyword && this.keyword.trim() !== '') {
            const keywordLower = this.keyword.toLowerCase().trim()
            filteredPosts = filteredPosts.filter(post => {
              const titleMatch = post.title && post.title.toLowerCase().includes(keywordLower)
              const contentMatch = post.content && post.content.toLowerCase().includes(keywordLower)
              return titleMatch || contentMatch
            })
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
        // 检查是否为产品设计(200)或项目管理(300)分类
        if ([200, 300].includes(categoryNum)) {
          // 这两个分类没有子分类，不显示子分类标签
          this.showCategoryTabs = false
        } else {
          // 其他一级分类显示子分类标签
          this.showCategoryTabs = true
          
          // 获取该一级分类的子分类
          this.subCategoryList = this.categories.filter(c => {
            return c.parent_id && (c.parent_id.toString() === category || c.parent_id === categoryNum)
          })
        }
      } else {
        this.showCategoryTabs = false
      }
      
      this.page = 1
      this.loadPosts(true)
    },
    
    // 初始化默认分类
    initDefaultCategory() {
      const topLevelCategories = this.categories.filter(c => c.level === 1)
      if (topLevelCategories.length > 0) {
        this.currentCategory = topLevelCategories[0].id
        this.switchCategory(this.currentCategory)
      }
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
    
    // 返回上一页
    goBack() {
      uni.navigateBack()
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
.forum-container {
  min-height: 100vh;
  background-color: #F8FAFD;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}


/* 论坛导航栏样式 */
.forum-nav {
  background: linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8));
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: 80px;
  padding: 0 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.forum-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  text-align: center;
}

/* 标题装饰点 */
.title-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 50%;
  margin-right: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(79, 172, 254, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0);
  }
}

/* 筛选器标签容器 */
.filter-label-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.nav-icon {
  transition: all 0.3s ease;
}

.nav-icon:active {
  color: #007aff;
  transform: scale(0.95);
}

/* 侧边栏样式 */
.drawer-content {
  padding: 0;
  height: 100%;
  overflow-y: auto;
}

.drawer-header {
  padding: 20rpx 30rpx;
  border-bottom: 2rpx solid #eeeeee;
  background: #ffffff;
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
  color: #333333;
  flex: 1;
}

.user-details {
  flex: 1;
}

.user-stats {
  font-size: 22rpx;
  opacity: 0.9;
  margin-top: 10rpx;
  color: #666666;
}

.login-prompt {
  text-align: center;
  padding: 20rpx;
  color: #666666;
}

.nav-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
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
  color: #333333;
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

.rule-text {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

/* 智能筛选器样式 */
.filter-section {
  background: rgba(255, 255, 255, 0.8);
  margin: 12px 0;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.search-bar {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border-radius: 30px;
  height: 44px;
  padding: 0 16px;
  gap: 12px;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  box-shadow: 0 0 0 2px #4facfe;
  background: linear-gradient(135deg, #F0F4FF, #E6F0FF);
}

.forum-input {
  flex: 1;
  font-size: 15px;
  color: #1E1E1E;
  background: transparent;
  border: none;
  outline: none;
}

.forum-input::placeholder {
  color: #ADB5BD;
}

.forum-btn {
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: #ffffff;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
}

.forum-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.4);
}

/* 分类筛选样式 */
.filter-group {
  margin-top: 16px;
}

.filter-item {
  margin-bottom: 16px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #1E1E1E;
  display: block;
}

.filter-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-option {
  padding: 6px 12px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border-radius: 24px;
  font-size: 12px;
  color: #007aff;
  transition: all 0.3s ease;
  position: relative;
  margin-right: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-option.active {
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: #ffffff;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
}

.filter-option:active {
  transform: scale(0.95);
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: #ffffff;
  opacity: 0.8;
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.4);
}

/* 帖子列表样式 */
.post-list {
  flex: 1;
  padding: 0;
}

.forum-card {
  background: linear-gradient(135deg, #ffffff, #f8faff);
  border-radius: 16px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.forum-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4facfe, #00f2fe, transparent);
  border-radius: 0 0 16px 16px;
}

.forum-card:active {
  transform: scale(0.98);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.25);
}

.forum-mb-md {
  margin-bottom: 16px;
}

.forum-mb-sm {
  margin-bottom: 12px;
}

.post-main {
  display: flex;
  gap: 16px;
}

.user-section {
  width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.forum-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.forum-avatar-md {
  width: 48px;
  height: 48px;
}

.avatar-text {
  font-size: 14px;
  font-weight: 600;
  color: #666666;
}

.username {
  font-size: 12px;
  font-weight: 600;
  color: #1E1E1E;
  text-align: center;
}

.user-level {
  font-size: 10px;
  color: #4facfe;
  background: rgba(79, 172, 254, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 500;
}

.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  line-height: 1.4;
  position: relative;
  z-index: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border-radius: 1px;
  z-index: -1;
  opacity: 0.3;
}

.post-summary {
  font-size: 13px;
  color: #6C757D;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.forum-tag {
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  color: #007aff;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.forum-tag:active {
  transform: scale(0.95);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.forum-tag-primary {
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  color: #007aff;
}

.post-stats {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #E6F0FF;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6C757D;
  transition: all 0.3s ease;
}

.stat:active {
  color: #4facfe;
  transform: scale(1.05);
}

.stat .icon {
  font-size: 14px;
  transition: all 0.3s ease;
}

.stat:active .icon {
  transform: scale(1.1);
}

.icon {
  font-size: 12px;
}

.time-section {
  width: 96px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.post-time {
  font-size: 11px;
  color: #999999;
}

.reply-time {
  font-size: 10px;
  color: #999999;
  opacity: 0.8;
}

/* 加载状态样式 */
.load-more, .no-more, .no-data {
  text-align: center;
  padding: 40px;
  color: #999999;
  font-size: 14px;
}

.no-data {
  margin-top: 200px;
}

/* 悬浮发帖按钮 */
.forum-btn.forum-btn-primary {
  position: fixed;
  bottom: 100px;
  right: 40px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
  transition: all 0.3s ease;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
}

.forum-btn.forum-btn-primary:active {
  transform: scale(0.95);
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.5);
}

.plus {
  color: white;
  font-size: 24px;
  font-weight: bold;
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.menu-content {
  background: linear-gradient(135deg, #ffffff, #f8faff);
  border-radius: 30px 30px 0 0;
  padding: 40px 20px;
  width: 100%;
  max-width: 600px;
  animation: slideUp 0.3s ease;
  box-shadow: 0 -6px 20px rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.menu-icon {
  font-size: 20px;
  margin-right: 20px;
  transition: all 0.3s ease;
}

.menu-content .forum-card:active .menu-icon {
  transform: scale(1.1);
}

.menu-text {
  font-size: 14px;
  color: #1E1E1E;
  font-weight: 500;
  transition: all 0.3s ease;
}

.menu-content .forum-card:active .menu-text {
  color: #4facfe;
  transform: translateX(4px);
}
</style>