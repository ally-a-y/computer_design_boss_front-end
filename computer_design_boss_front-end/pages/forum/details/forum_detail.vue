<template>
  <view class="forum-detail-container">
    <!-- 帖子详情 -->
    <view class="post-detail" v-if="post">
      <!-- 头部信息区 -->
      <view class="post-header">
        <view class="avatar" @click="goToUserProfile(post.user_id)"><text class="avatar-text">U</text></view>
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
        <text class="category">{{getCategoryName(post.category_id)}}</text>
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
            <view class="avatar" @click="goToUserProfile(reply.user_id)"><text class="avatar-text">U</text></view>
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
      }
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
    this.loadPostDetail()
    this.loadReplies()
  },
  
  methods: {
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
.forum-detail-container {
  min-height: 100vh;
  background-color: #F8FAFD;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

/* 帖子详情样式 */
.post-detail {
  background: white;
  padding: 16px;
  margin: 12px 0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
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
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 16px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  line-height: 1.4;
}

.post-content {
  margin-bottom: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 12px;
}

.content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.post-stats {
  display: flex;
  gap: 24px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 12px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6C757D;
}

.stat-icon {
  font-size: 12px;
}

.post-actions {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 12px;
  color: #6C757D;
  transition: all 0.3s ease;
  
  &.active {
    color: #007aff;
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.icon {
  font-size: 12px;
}

/* 回复列表样式 */
.replies-section {
  flex: 1;
  background: white;
  padding: 16px;
  margin: 12px 0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
}

.sort-options {
  display: flex;
  gap: 8px;
}

.sort-option {
  padding: 6px 12px;
  background: #F0F4FF;
  border-radius: 24px;
  font-size: 12px;
  color: #007aff;
  transition: all 0.3s ease;
  
  &.active {
    background: #E0E9FF;
    color: #007aff;
  }
  
  &:active {
    transform: scale(0.95);
    background: #E0E9FF;
  }
}

.replies-list {
  flex: 1;
}

.reply-item {
  padding: 16px 0;
  border-bottom: 1px solid #f8f8f8;
  transition: all 0.3s ease;
  
  &:active {
    background: #f9f9f9;
  }
}

.reply-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.floor {
  font-size: 11px;
  color: #999999;
  margin-left: auto;
  margin-top: 8px;
}

.reply-content {
  margin-bottom: 12px;
  padding-left: 64px;
}

.reply-content .content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.reply-actions {
  display: flex;
  gap: 24px;
  padding-left: 64px;
}

.no-replies {
  text-align: center;
  padding: 40px 0;
  color: #999999;
  font-size: 14px;
}

/* 回复输入框样式 */
.reply-input-section {
  background: white;
  padding: 16px;
  margin: 12px 0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.input-title {
  font-size: 14px;
  font-weight: 600;
  color: #1E1E1E;
}

.advanced-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 12px;
  color: #007aff;
}

.input-area {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
}

.reply-textarea {
  flex: 1;
  background: #F2F5F9;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  min-height: 80px;
  max-height: 200px;
  transition: all 0.3s ease;
}

.reply-textarea:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
  outline: none;
}

.submit-btn {
  background: #007aff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:active {
    background-color: #0056b3;
    transform: scale(0.98);
  }
}

.submit-btn:disabled {
  background: #ccc;
}

/* 高级编辑器样式 */
.advanced-editor {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.editor-tools {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
  
  &:active {
    background: #e0e0e0;
    transform: scale(0.95);
  }
}

.tool-btn .icon {
  font-size: 14px;
}
</style>