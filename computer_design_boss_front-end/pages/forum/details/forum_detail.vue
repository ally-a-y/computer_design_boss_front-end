<template>
  <view class="forum-detail-container" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航 -->
    <view class="nav-bar forum-nav" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="nav-bar-left">
        <text class="nav-icon" @click="goBack">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title forum-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">帖子详情</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧空白区域，保持布局对称 -->
      </view>
    </view>
    
    <!-- 帖子详情 -->
    <view class="post-detail" v-if="post" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)' }">
      <!-- 头部信息区 -->
      <view class="post-header">
        <image class="avatar" @click="goToUserProfile(post.user_id)" :src="isValidAvatar(post.user_avatar) ? 'data:image/' + (post.user_avatar_format === 'jpg' ? 'jpeg' : post.user_avatar_format || 'jpeg') + ';base64,' + decodeHtmlEntities(post.user_avatar.replace(/\s+/g, '')) : '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-info">
          <view class="user-main-info">
            <text class="username" @click="goToUserProfile(post.user_id)">用户{{post.user_id}}</text>
            <text class="user-badge" v-if="isOriginalAuthor">楼主</text>
          </view>
          <view class="time-info">
            <text class="time">{{formatTime(post.created_at)}}</text>
            <text class="edit-time" v-if="post.updated_at && post.updated_at !== post.created_at">最后编辑: {{formatTime(post.updated_at)}}</text>
          </view>
        </view>
        <text class="category" :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)', color: '#007aff' }">{{getCategoryName(post.category_id)}}</text>
      </view>
      
      <!-- 帖子标题 -->
      <view class="post-title-section">
        <text class="post-title">{{post.title || post.content}}</text>
      </view>
      
      <!-- 内容展示区 -->
      <view class="post-content">
        <text class="content">{{post.content}}</text>
      </view>
      
      <!-- 互动数据 -->
      <view class="post-stats">
        <text class="stat-item">
          <text class="stat-icon">👁</text>
          {{post.view_count || 0}}浏览
        </text>
        <text class="stat-item">
          <text class="stat-icon">💬</text>
          {{post.reply_count || 0}}回复
        </text>
        <text class="stat-item">
          <text class="stat-icon">⭐</text>
          {{post.favorite_count || 0}}收藏
        </text>
      </view>
      
      <!-- 操作按钮 -->
      <view class="post-actions">
        <button class="action-btn" @click="toggleLike" :class="{active: post.is_liked}">
          <text class="icon">👍</text>
          <text>{{post.like_count || 0}}</text>
        </button>
        <button class="action-btn" @click="toggleFavorite" :class="{active: post.is_favorited}">
          <text class="icon">⭐</text>
          <text>{{post.favorite_count || 0}}</text>
        </button>
        <button class="action-btn" @click="sharePost">
          <text class="icon">📤</text>
          <text>分享</text>
        </button>
        <button class="action-btn" @click="reportPost">
          <text class="icon">⚠️</text>
          <text>举报</text>
        </button>
      </view>
    </view>
    
    <!-- 回复列表 -->
    <view class="replies-section" v-if="true">
      <view class="section-header">
        <text class="section-title">全部回复 ({{replies.length}})</text>
        <view class="sort-options">
          <text 
            class="sort-option" 
            :class="{active: replySort === 'time_asc'}"
            @click="switchReplySort('time_asc')"
          >时间正序</text>
          <text 
            class="sort-option" 
            :class="{active: replySort === 'time_desc'}"
            @click="switchReplySort('time_desc')"
          >时间倒序</text>
          <text 
            class="sort-option" 
            :class="{active: replySort === 'likes'}"
            @click="switchReplySort('likes')"
          >按点赞数</text>
        </view>
      </view>
      
      <scroll-view class="replies-list" scroll-y>
        <view class="reply-item" v-for="(reply, index) in replies" :key="reply.id">
          <view class="reply-header">
            <image class="avatar" @click="goToUserProfile(reply.user_id)" :src="isValidAvatar(reply.user_avatar) ? 'data:image/' + (reply.user_avatar_format === 'jpg' ? 'jpeg' : reply.user_avatar_format || 'jpeg') + ';base64,' + decodeHtmlEntities(reply.user_avatar.replace(/\s+/g, '')) : '/static/default-avatar.png'" mode="aspectFill"></image>
            <view class="user-info">
              <view class="user-main-info">
                <text class="username" @click="goToUserProfile(reply.user_id)">用户{{reply.user_id}}</text>
                <text class="user-badge" v-if="isOriginalAuthor && reply.user_id === post.user_id">楼主</text>
                <text class="user-badge best-answer" v-if="reply.is_best_answer">最佳答案</text>
              </view>
              <text class="time">{{formatTime(reply.created_at)}}</text>
            </view>
            <text class="floor">#{{index + 1}}</text>
          </view>
          
          <view class="reply-content">
            <text class="content">{{reply.content}}</text>
          </view>
          
          <view class="reply-actions">
            <button class="action-btn" @click="replyToReply(reply)">
              <text class="icon">💬</text>
              <text>回复</text>
            </button>
            <button class="action-btn" @click="toggleReplyLike(reply)" :class="{active: reply.is_liked}">
              <text class="icon">👍</text>
              <text>{{reply.like_count || 0}}</text>
            </button>
            <button class="action-btn" @click="reportReply(reply)">
              <text class="icon">⚠️</text>
              <text>举报</text>
            </button>
          </view>
        </view>
        
        <view class="no-replies" v-if="replies.length === 0">
          <text>暂无回复，快来发表第一个回复吧！</text>
        </view>
      </scroll-view>
    </view>
    
    <!-- 回复输入框 -->
    <view class="reply-input-section" v-if="true">
      <view class="input-header">
        <text class="input-title">快速回复</text>
        <button class="advanced-btn" @click="toggleAdvancedEditor">
          <text class="icon">📝</text>
          <text>高级编辑</text>
        </button>
      </view>
      <view class="input-area">
        <textarea 
          class="reply-textarea" 
          placeholder="写下你的回复..." 
          v-model="newReply.content"
          auto-height
        />
        <button class="submit-btn" @click="submitReply" :disabled="!newReply.content.trim()">
          发布
        </button>
      </view>
      <!-- 高级编辑器选项 -->
      <view class="advanced-editor" v-if="showAdvancedEditor">
        <view class="editor-tools">
          <button class="tool-btn" @click="insertBold">
            <text class="icon">B</text>
          </button>
          <button class="tool-btn" @click="insertItalic">
            <text class="icon">I</text>
          </button>
          <button class="tool-btn" @click="insertLink">
            <text class="icon">🔗</text>
          </button>
          <button class="tool-btn" @click="insertCode">
            <text class="icon">{}</text>
          </button>
          <button class="tool-btn" @click="uploadImage">
            <text class="icon">🖼</text>
          </button>
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
      postId: null,
      post: null,
      replies: [],
      newReply: {
        content: '',
        parent_id: null
      },
      replySort: 'time_asc',
      showAdvancedEditor: false,
      categoryMap: {
        '101': '前端',
        '102': '后端', 
        '103': '移动端',
        '104': '数据与AI',
        '105': '运维与测试'
      },
      // 主题相关
      currentTheme: 'light',
      isDarkMode: false
    }
  },
  
  computed: {
    isOriginalAuthor() {
      const userInfo = uni.getStorageSync('userInfo')
      return userInfo && userInfo.user_id && this.post && this.post.user_id === userInfo.user_id
    }
  },
  
  onLoad(options) {
    // 确保postId是整数类型
    this.postId = parseInt(options.id) || null
    console.log('帖子ID (整数):', this.postId)
    this.initTheme()
    this.loadPostDetail()
    this.loadReplies()
  },
  
  onUnload() {
    // 清理主题监听
    uni.$off('globalThemeChange', this.handleGlobalThemeChange)
  },
  
  methods: {
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
    
    // 返回上一页
    goBack() {
      uni.navigateBack()
    },
    
    // 加载帖子详情
    async loadPostDetail() {
      try {
        console.log('=== 开始加载帖子详情 ===')
        console.log('帖子ID:', this.postId)
        
        const res = await forumApi.getCommentDetail(this.postId)
        console.log('getCommentDetail返回结果:', res)
        
        if (res && res.length > 0) {
          console.log('帖子详情:', res[0])
          this.post = res[0]
        } else {
          console.log('未找到帖子详情')
        }
      } catch (error) {
        console.error('加载帖子详情失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        console.log('=== 加载帖子详情结束 ===')
      }
    },
    
    // 加载回复列表
    async loadReplies() {
      try {
        console.log('=== 开始加载回复列表 ===')
        console.log('帖子ID:', this.postId)
        
        const res = await forumApi.getCommentReplies(this.postId)
        console.log('getCommentReplies返回结果:', res)
        
        if (res) {
          console.log('回复列表长度:', res.length)
          this.replies = res
        } else {
          console.log('getCommentReplies返回null或undefined')
        }
      } catch (error) {
        console.error('加载回复失败:', error)
      } finally {
        console.log('=== 加载回复列表结束 ===')
      }
    },
    
    // 提交回复
    async submitReply() {
      if (!this.newReply.content.trim()) {
        uni.showToast({
          title: '请输入回复内容',
          icon: 'none'
        })
        return
      }
      
      try {
        console.log('=== 开始提交回复 ===')
        
        let userInfo = uni.getStorageSync('userInfo')
        // 处理userInfo可能是JSON字符串的情况
        if (typeof userInfo === 'string') {
          try {
            userInfo = JSON.parse(userInfo)
          } catch (e) {
            userInfo = null
          }
        }
        if (!userInfo || !userInfo.user_id) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          return
        }
        
        const replyData = {
          category_id: this.post.category_id,
          user_id: userInfo.user_id,
          parent_id: this.postId,
          content: this.newReply.content.trim(),
          level: 2,
          sort_order: 0
        }
        
        console.log('提交的回复数据:', replyData)
        
        const addReplyResult = await forumApi.addReply(replyData)
        console.log('addReply返回结果:', addReplyResult)
        
        uni.showToast({
          title: '回复成功',
          icon: 'success'
        })
        
        // 清空输入框
        this.newReply.content = ''
        
        // 重新加载回复列表
        console.log('开始重新加载回复列表...')
        await this.loadReplies()
        console.log('回复列表加载完成，当前回复数:', this.replies.length)
        
      } catch (error) {
        console.error('提交回复失败:', error)
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        })
      } finally {
        console.log('=== 提交回复结束 ===')
      }
    },
    
    // 回复某个回复
    replyToReply(reply) {
      this.newReply.content = `@用户${reply.user_id} `
    },
    
    // 点赞帖子
    async toggleLike() {
      try {
        let userInfo = uni.getStorageSync('userInfo')
        // 处理userInfo可能是JSON字符串的情况
        if (typeof userInfo === 'string') {
          try {
            userInfo = JSON.parse(userInfo)
          } catch (e) {
            userInfo = null
          }
        }
        if (!userInfo || !userInfo.user_id) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          return
        }
        
        await forumApi.toggleLike({
          user_id: userInfo.user_id,
          comment_id: this.postId,
          action: this.post.is_liked ? 'unlike' : 'like'
        })
        
        // 更新点赞数
        if (this.post.is_liked) {
          this.post.like_count--
          this.post.is_liked = false
        } else {
          this.post.like_count++
          this.post.is_liked = true
        }
        
      } catch (error) {
        console.error('点赞失败:', error)
      }
    },
    
    // 收藏帖子
    async toggleFavorite() {
      try {
        let userInfo = uni.getStorageSync('userInfo')
        // 处理userInfo可能是JSON字符串的情况
        if (typeof userInfo === 'string') {
          try {
            userInfo = JSON.parse(userInfo)
          } catch (e) {
            userInfo = null
          }
        }
        if (!userInfo || !userInfo.user_id) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          return
        }
        
        await forumApi.toggleFavorite({
          user_id: userInfo.user_id,
          comment_id: this.postId,
          action: this.post.is_favorited ? 'unfavorite' : 'favorite'
        })
        
        // 更新收藏数
        if (this.post.is_favorited) {
          this.post.favorite_count--
          this.post.is_favorited = false
        } else {
          this.post.favorite_count++
          this.post.is_favorited = true
        }
        
      } catch (error) {
        console.error('收藏失败:', error)
      }
    },
    
    // 点赞回复
    async toggleReplyLike(reply) {
      try {
        let userInfo = uni.getStorageSync('userInfo')
        // 处理userInfo可能是JSON字符串的情况
        if (typeof userInfo === 'string') {
          try {
            userInfo = JSON.parse(userInfo)
          } catch (e) {
            userInfo = null
          }
        }
        if (!userInfo || !userInfo.user_id) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          return
        }
        
        await forumApi.toggleLike({
          user_id: userInfo.user_id,
          comment_id: reply.id,
          action: reply.is_liked ? 'unlike' : 'like'
        })
        
        // 更新点赞数
        if (reply.is_liked) {
          reply.like_count--
          reply.is_liked = false
        } else {
          reply.like_count++
          reply.is_liked = true
        }
        
      } catch (error) {
        console.error('点赞失败:', error)
      }
    },
    
    // 分享帖子
    sharePost() {
      uni.showShareMenu({
        title: this.post.content,
        path: `/pages/forum/details/forum_detail?id=${this.postId}`
      })
    },
    
    // 切换回复排序
    switchReplySort(sortBy) {
      this.replySort = sortBy
      // 这里应该调用API重新加载排序后的回复
      // 暂时使用前端排序模拟
      this.sortReplies()
    },
    
    // 前端排序回复
    sortReplies() {
      const sortedReplies = [...this.replies]
      
      switch (this.replySort) {
        case 'time_asc':
          sortedReplies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          break
        case 'time_desc':
          sortedReplies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          break
        case 'likes':
          sortedReplies.sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
          break
      }
      
      this.replies = sortedReplies
    },
    
    // 切换高级编辑器
    toggleAdvancedEditor() {
      this.showAdvancedEditor = !this.showAdvancedEditor
    },
    
    // 插入粗体
    insertBold() {
      this.newReply.content += '**粗体文本**'
    },
    
    // 插入斜体
    insertItalic() {
      this.newReply.content += '*斜体文本*'
    },
    
    // 插入链接
    insertLink() {
      uni.prompt({
        title: '插入链接',
        message: '请输入链接地址',
        success: (res) => {
          if (res.confirm) {
            this.newReply.content += `[链接](${res.value})`
          }
        }
      })
    },
    
    // 插入代码
    insertCode() {
      this.newReply.content += '```\n代码\n```'
    },
    
    // 上传图片
    uploadImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          // 这里应该上传图片到服务器
          // 暂时使用本地路径模拟
          this.newReply.content += `![图片](${res.tempFilePaths[0]})`
        }
      })
    },
    
    // 跳转到用户个人主页
    goToUserProfile(userId) {
      uni.showToast({
        title: '用户个人主页功能暂未实现',
        icon: 'none'
      })
    },
    
    // 举报帖子
    reportPost() {
      uni.showModal({
        title: '举报帖子',
        content: '确定要举报这个帖子吗？',
        success: (res) => {
          if (res.confirm) {
            // 这里应该调用举报API
            uni.showToast({
              title: '举报成功，我们会尽快处理',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 举报回复
    reportReply(reply) {
      uni.showModal({
        title: '举报回复',
        content: '确定要举报这个回复吗？',
        success: (res) => {
          if (res.confirm) {
            // 这里应该调用举报API
            uni.showToast({
              title: '举报成功，我们会尽快处理',
              icon: 'success'
            })
          }
        }
      })
    },
    
    // 获取分类名称
    getCategoryName(categoryId) {
      return this.categoryMap[categoryId] || '其他'
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
.forum-detail-container {
  min-height: 100vh;
  background-color: #F8FAFD;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

/* 论坛导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 16px;
  position: relative;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.nav-bar-left,
.nav-bar-right {
  width: 80rpx;
  display: flex;
  align-items: center;
}

.nav-bar-left {
  justify-content: flex-start;
}

.nav-bar-right {
  justify-content: flex-end;
}

.nav-bar-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}

.forum-nav {
  height: 80px;
  padding: 0 16px;
}

.forum-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  text-align: center;
  position: relative;
  display: inline-block;
}

.forum-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border-radius: 1px;
}

.nav-icon {
  font-size: 24px;
  color: #4facfe;
  font-weight: bold;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-icon:active {
  color: #00f2fe;
  transform: scale(0.9);
}

/* 帖子详情样式 */
.post-detail {
  background: rgba(255, 255, 255, 0.8);
  padding: 24px 16px;
  margin: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.post-detail::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4facfe, #00f2fe, transparent);
  border-radius: 0 0 16px 16px;
}

.post-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-text {
  color: #666666;
  font-size: 14px;
  font-weight: 600;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-main-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 12px;
  font-weight: 600;
  color: #1E1E1E;
}

.user-badge {
  background: rgba(0, 122, 255, 0.1);
  color: #007aff;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
}

.user-badge.best-answer {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.time-info {
  display: flex;
  gap: 16px;
  font-size: 11px;
  color: #999999;
}

.time {
  font-size: 11px;
  color: #999999;
}

.edit-time {
  font-size: 10px;
  color: #999999;
  opacity: 0.8;
}

.category {
  background: #F0F4FF;
  color: #007aff;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  margin-top: 8px;
}

.post-title-section {
  margin-bottom: 20px;
  position: relative;
  padding-left: 12px;
}

.post-title-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #4facfe, #00f2fe);
  border-radius: 3px;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E1E1E;
  line-height: 1.4;
  position: relative;
  z-index: 1;
  display: inline-block;
}

.post-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border-radius: 1px;
  z-index: -1;
  opacity: 0.3;
}

.post-content {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.post-content::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #4facfe, transparent);
  border-radius: 0 0 12px 12px;
}

.content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  position: relative;
  z-index: 1;
}

.post-stats {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.post-stats::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #4facfe, transparent);
  border-radius: 0 0 12px 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6C757D;
  transition: all 0.3s ease;
  padding: 6px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
}

.stat-item:active {
  background: rgba(79, 172, 254, 0.1);
  color: #4facfe;
  transform: scale(0.95);
}

.stat-icon {
  font-size: 14px;
  transition: all 0.3s ease;
}

.stat-item:active .stat-icon {
  transform: scale(1.1);
}

.post-actions {
  display: flex;
  gap: 24px;
  padding: 16px 0;
  border-top: 1px solid #e6f0ff;
  justify-content: space-around;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border: none;
  font-size: 11px;
  color: #6C757D;
  padding: 6px 12px;
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &.active {
    background: linear-gradient(120deg, #4facfe, #00f2fe);
    color: white;
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.2);
  }
}

.icon {
  font-size: 14px;
  transition: all 0.3s ease;
}

.action-btn:active .icon {
  transform: scale(1.1);
}

/* 回复列表样式 */
.replies-section {
  flex: 1;
  background: rgba(255, 255, 255, 0.8);
  padding: 24px 16px;
  margin: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.replies-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4facfe, #00f2fe, transparent);
  border-radius: 0 0 16px 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e6f0ff;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border-radius: 1px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border-radius: 1px;
}

.sort-options {
  display: flex;
  gap: 8px;
}

.sort-option {
  padding: 6px 12px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border-radius: 16px;
  font-size: 11px;
  color: #007aff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &.active {
    background: linear-gradient(120deg, #4facfe, #00f2fe);
    color: white;
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.2);
  }
}

.replies-list {
  flex: 1;
}

.reply-item {
  padding: 20px 0;
  border-bottom: 1px solid #e6f0ff;
  transition: all 0.3s ease;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(180deg, #4facfe, #00f2fe);
    border-radius: 2px;
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: rgba(79, 172, 254, 0.05);
    transform: translateX(4px);
  }
  
  &:hover:before {
    opacity: 1;
  }
  
  &:active {
    background: rgba(79, 172, 254, 0.1);
  }
}

.reply-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.floor {
  font-size: 11px;
  color: #999999;
  margin-left: auto;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.reply-content {
  margin-bottom: 16px;
  padding-left: 64px;
  position: relative;
}

.reply-content::before {
  content: '';
  position: absolute;
  left: 32px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: linear-gradient(180deg, #4facfe, #00f2fe);
  border-radius: 1px;
  opacity: 0.3;
}

.reply-content .content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background: rgba(255, 255, 255, 0.6);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reply-actions {
  display: flex;
  gap: 12px;
  padding-left: 64px;
  justify-content: flex-start;
}

.no-replies {
  text-align: center;
  padding: 40px 0;
  color: #999999;
  font-size: 14px;
}

/* 回复输入框样式 */
.reply-input-section {
  background: rgba(255, 255, 255, 0.8);
  padding: 16px 12px;
  margin: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.reply-input-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4facfe, #00f2fe, transparent);
  border-radius: 0 0 12px 12px;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e6f0ff;
  position: relative;
}

.input-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border-radius: 1px;
}

.input-title {
  font-size: 13px;
  font-weight: 600;
  color: #1E1E1E;
  position: relative;
  display: inline-block;
}

.input-title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  border-radius: 1px;
}

.advanced-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border: none;
  font-size: 11px;
  color: #007aff;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:active {
    background: linear-gradient(120deg, #4facfe, #00f2fe);
    color: white;
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.2);
  }
}

.input-area {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 12px;
}

.reply-textarea {
  flex: 1;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border: 1px solid #e6f0ff;
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  min-height: 80px;
  max-height: 150px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.reply-textarea:focus {
  box-shadow: 0 0 0 2px #4facfe, 0 4px 16px rgba(79, 172, 254, 0.2);
  outline: none;
  background: linear-gradient(135deg, #F0F4FF, #E6F0FF);
}

.submit-btn {
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
  align-self: flex-end;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.4);
  }
}

.submit-btn:disabled {
  background: #ccc;
  box-shadow: none;
}

/* 高级编辑器样式 */
.advanced-editor {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e6f0ff;
}

.editor-tools {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border: none;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:active {
    background: linear-gradient(120deg, #4facfe, #00f2fe);
    color: white;
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.2);
  }
}

.tool-btn .icon {
  font-size: 12px;
  transition: all 0.3s ease;
}

.tool-btn:active .icon {
  transform: scale(1.1);
}
</style>