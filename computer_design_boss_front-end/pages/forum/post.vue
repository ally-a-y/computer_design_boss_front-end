<template>
  <view class="post-container" :style="{ background: 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航 -->
    <view class="nav-bar" :style="{ background: 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="nav-left">
        <text class="nav-back" @click="goBack">←</text>
      </view>
      <view class="nav-center">
        <text class="nav-title">发布话题</text>
      </view>
      <view class="nav-right"></view>
    </view>
    
    <view class="form-section" :style="{ background: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="form-item">
        <view class="label-container">
          <view class="title-dot"></view>
          <text class="label">话题内容</text>
        </view>
        <textarea 
          class="content-input" 
          placeholder="分享你的技术心得、项目经验或提出问题..." 
          v-model="postForm.content"
          maxlength="500"
        />
        <text class="char-count">{{postForm.content.length}}/500</text>
      </view>
      
      <view class="form-item">
        <view class="label-container">
          <view class="title-dot"></view>
          <text class="label">选择分类</text>
        </view>
        <picker @change="onCategoryChange" :value="categoryIndex" :range="categories" range-key="name">
          <view class="picker" :style="{ background: 'linear-gradient(135deg, #E6F0FF, #F0F4FF)' }">
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
  background: linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%);
  padding: 0;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

/* 顶部导航 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  padding: 0 16px;
  background: linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8));
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-left {
  width: 40px;
}

.nav-back {
  font-size: 24px;
  color: #4facfe;
  font-weight: bold;
  transition: all 0.3s ease;
}

.nav-back:active {
  transform: scale(0.9);
  color: #00f2fe;
}

.nav-center {
  flex: 1;
  text-align: center;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  position: relative;
  display: inline-block;
}

.nav-title::after {
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

.nav-right {
  width: 40px;
}

.form-section {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 24px 16px;
  margin: 16px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.form-item {
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
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

/* 标签容器 */
.label-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1E1E1E;
}

.content-input {
  width: 100%;
  min-height: 200px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border: 1px solid #e6f0ff;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.content-input:focus {
  box-shadow: 0 0 0 2px #4facfe, 0 4px 16px rgba(79, 172, 254, 0.2);
  outline: none;
  background: linear-gradient(135deg, #F0F4FF, #E6F0FF);
}

.char-count {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #999999;
  margin-top: 8px;
  transition: all 0.3s ease;
}

.content-input:focus + .char-count {
  color: #4facfe;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border: 1px solid #e6f0ff;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.picker:focus-within {
  box-shadow: 0 0 0 2px #4facfe, 0 4px 16px rgba(79, 172, 254, 0.2);
  background: linear-gradient(135deg, #F0F4FF, #E6F0FF);
}

.picker-arrow {
  color: #4facfe;
  transition: all 0.3s ease;
}

.picker:active .picker-arrow {
  transform: rotate(180deg);
  color: #00f2fe;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #1E1E1E;
  transition: all 0.3s ease;
}

.checkbox-item:active {
  color: #4facfe;
  transform: translateX(4px);
}

/* 自定义复选框样式 */
checkbox {
  transform: scale(1.2);
  transition: all 0.3s ease;
}

checkbox:active {
  transform: scale(1.3);
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin: 16px;
  padding-bottom: 24px;
}

.btn-secondary {
  flex: 1;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  color: #6C757D;
  border: none;
  padding: 14px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    color: #4facfe;
  }
}

.btn-primary {
  flex: 1;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.3);
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(79, 172, 254, 0.4);
  }
  
  &:disabled {
    background: #ccc;
    box-shadow: none;
  }
}
</style>