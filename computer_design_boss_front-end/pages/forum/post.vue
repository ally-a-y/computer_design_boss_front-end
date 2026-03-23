<template>
  <view class="post-container">
    <view class="form-section">
      <view class="form-item">
        <text class="label">话题内容</text>
        <textarea 
          class="content-input" 
          placeholder="分享你的技术心得、项目经验或提出问题..." 
          v-model="postForm.content"
          maxlength="500"
        />
        <text class="char-count">{{postForm.content.length}}/500</text>
      </view>
      
      <view class="form-item">
        <text class="label">选择分类</text>
        <picker @change="onCategoryChange" :value="categoryIndex" :range="categories" range-key="name">
          <view class="picker">
            <text>{{categories[categoryIndex]?.name || '请选择分类'}}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>
      
      <view class="form-item">
        <label class="checkbox-item">
          <checkbox :checked="postForm.anonymous" @click="postForm.anonymous = !postForm.anonymous" />
          <text>匿名发帖</text>
        </label>
      </view>
    </view>
    
    <view class="action-buttons">
      <button class="btn-secondary" @click="goBack">取消</button>
      <button class="btn-primary" @click="submitPost" :disabled="!canSubmit">发布</button>
    </view>
  </view>
</template>

<script>
import { forumApi } from '@/common/api/forum.js'

export default {
  data() {
    return {
      postForm: {
        content: '',
        category_id: '101',
        anonymous: false
      },
      categoryIndex: 0,
      categories: [
        { id: '101', name: '前端开发' },
        { id: '102', name: '后端开发' },
        { id: '103', name: '移动端开发' },
        { id: '104', name: '数据与AI' },
        { id: '105', name: '运维与测试' },
        { id: '106', name: '产品设计' },
        { id: '107', name: '网络安全' },
        { id: '108', name: '嵌入式开发' },
        { id: '200', name: '产品与设计类' },
        { id: '300', name: '技术管理类' }
      ]
    }
  },
  
  computed: {
    canSubmit() {
      return this.postForm.content.trim().length > 0 && this.postForm.category_id
    }
  },
  
  methods: {
    // 选择分类
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value
      this.postForm.category_id = this.categories[this.categoryIndex].id
    },
    
    // 返回
    goBack() {
      uni.navigateBack()
    },
    
    // 提交帖子
    async submitPost() {
      if (!this.canSubmit) return
      
      try {
        console.log('=== 开始发布话题 ===')
        
        // 检查存储的所有数据
        const token = uni.getStorageSync('token')
        console.log('存储的token:', token)
        
        let userInfo = uni.getStorageSync('userInfo')
        console.log('原始userInfo:', userInfo)
        console.log('userInfo类型:', typeof userInfo)
        
        // 处理userInfo可能是JSON字符串的情况
        if (typeof userInfo === 'string') {
          try {
            userInfo = JSON.parse(userInfo)
            console.log('解析后的userInfo:', userInfo)
          } catch (e) {
            console.error('解析userInfo失败:', e)
            userInfo = null
          }
        }
        
        console.log('最终userInfo:', userInfo)
        console.log('是否有user_id:', userInfo && userInfo.user_id)
        
        if (!userInfo || !userInfo.user_id) {
          console.error('登录状态检查失败:', { userInfo, hasUserId: userInfo && userInfo.user_id })
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          })
          return
        }
        
        const postData = {
          category_id: this.postForm.category_id,
          user_id: userInfo.user_id,
          parent_id: '', // 一级评论
          content: this.postForm.content.trim(),
          level: 1,
          sort_order: 0
        }
        
        console.log('发布数据:', postData)
        
        await forumApi.addComment(postData)
        
        uni.showToast({
          title: '发布成功',
          icon: 'success',
          success: () => {
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        })
        
      } catch (error) {
        console.error('发布失败:', error)
        uni.showToast({
          title: `发布失败: ${error.message || '请检查网络连接'}`,
          icon: 'none',
          duration: 3000
        })
      } finally {
        console.log('=== 发布话题结束 ===')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.post-container {
  min-height: 100vh;
  background-color: #F8FAFD;
  padding: 16px;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.form-item {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 12px;
}

.content-input {
  width: 100%;
  min-height: 200px;
  background: #F2F5F9;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.content-input:focus {
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
  outline: none;
}

.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #999999;
  margin-top: 8px;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #F2F5F9;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.picker:focus-within {
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.picker-arrow {
  color: #999999;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #1E1E1E;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.btn-secondary {
  flex: 1;
  background: #F2F5F9;
  color: #6C757D;
  border: none;
  padding: 12px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:active {
    background-color: #E9ECEF;
    transform: scale(0.98);
  }
}

.btn-primary {
  flex: 1;
  background: #007aff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:active {
    background-color: #0056b3;
    transform: scale(0.98);
  }
  
  &:disabled {
    background: #ccc;
  }
}
</style>