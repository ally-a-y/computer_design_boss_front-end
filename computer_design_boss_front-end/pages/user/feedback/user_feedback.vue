xu<template>
  <view class="feedback-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">投诉反馈</text>
      </view>
      <view class="nav-bar-right">
        <text class="add-btn" @click="addFeedback">+</text>
      </view>
    </view>
    
    <!-- 反馈列表 -->
    <view class="feedback-list">
      <view v-for="(item, index) in feedbacks" :key="index" class="feedback-item">
        <view class="feedback-info">
          <text class="feedback-type">类型：{{ item.type }}</text>
          <text class="feedback-time">提交时间：{{ item.submitTime }}</text>
          <view class="status">
            <text class="status-text" :class="item.status">{{ item.statusText }}</text>
          </view>
          <text class="description">描述：{{ item.description }}</text>
          <text v-if="item.response" class="response">处理反馈：{{ item.response }}</text>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="feedbacks.length === 0" class="empty-state">
        <uni-icons type="chatbubble" size="80" color="#ccc"></uni-icons>
        <text>暂无反馈记录</text>
      </view>
    </view>
    
    <!-- 添加反馈弹窗 -->
    <uni-popup ref="addPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">添加投诉反馈</text>
          <text class="close-btn" @click="closePopup">×</text>
        </view>
        <view class="popup-body">
          <view class="form-item">
            <text class="label">投诉类型</text>
            <picker class="input" @change="onTypeChange" :value="typeIndex" :range="typeOptions">
              <view>{{ typeOptions[typeIndex] }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">投诉描述</text>
            <textarea class="textarea" v-model="newFeedback.description" placeholder="请详细描述您的问题" />
          </view>
        </view>
        <view class="popup-footer">
          <button class="submit-btn" @click="submitFeedback">提交</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {
  getComplaintTypes,
  getFeedbackList,
  submitFeedback
} from '@/common/api/feedback.js'

export default {
  data() {
    return {
      feedbacks: [],
      typeOptions: [],
      typeCodeMap: {},   // 保存 type_name -> type_code 映射
      typeIndex: 0,
      newFeedback: {
        complaint_type: null,
        description: ''
      },
      page: 1,
      limit: 20
    }
  },

  async onLoad() {
    await this.loadComplaintTypes()
    await this.loadFeedbackList()
  },

  methods: {
    goBack() {
      uni.navigateBack()
    },

    // ================= 加载投诉类型 =================
    async loadComplaintTypes() {
      try {
        const res = await getComplaintTypes()
        
		console.log("转换后的collections:")
			
        const types = res || []
        this.typeOptions = types.map(t => t.type_name)

          // 建立映射关系
        types.forEach(t => {
			this.typeCodeMap[t.type_name] = t.type_code
        })
		console.log("转换后的collections:",this.typeOptions)

        // 默认选第一个
        if (types.length > 0) {
            this.newFeedback.complaint_type = types[0].type_code
        }
        
      } catch (err) {
		  
        uni.showToast({
          title: '获取投诉类型失败',
          icon: 'none'
        })
      }
    },

    // ================= 加载反馈列表 =================
    async loadFeedbackList() {
      try {
        const res = await getFeedbackList({
          page: this.page,
          limit: this.limit
        })
		
		console.log("转换后的collections:",res)
        const list = res || []
		console.log("转换后的collections:",list)
        this.feedbacks = list.map(item => ({
            id: item.id,
            type: this.typeOptions[item.complaint_type - 1] ,   // 后端最好返回 type_name
            submitTime: item.create_time,
            status: item.is_resolved === 1 ? 'processed' : 'pending',
            statusText: item.is_resolved === 1 ? '已处理' : '待处理',
            description: item.description,
            response: item.feedback_content
          }))
        
      } catch (err) {
        uni.showToast({
          title: '获取反馈列表失败',
          icon: 'none'
        })
      }
    },

    // ================= 打开弹窗 =================
    addFeedback() {
      this.newFeedback.description = ''
      this.$refs.addPopup.open()
    },

    closePopup() {
      if (this.$refs.addPopup) {
        this.$refs.addPopup.close()
      }
    },

    // ================= 类型切换 =================
    onTypeChange(e) {
      this.typeIndex = e.detail.value
      const typeName = this.typeOptions[this.typeIndex]
      this.newFeedback.complaint_type = this.typeCodeMap[typeName]
    },

    // ================= 提交反馈 =================
    async submitFeedback() {
      if (!this.newFeedback.description.trim()) {
        uni.showToast({
          title: '请输入投诉描述',
          icon: 'none'
        })
        return
      }

      if (this.newFeedback.description.length < 10) {
        uni.showToast({
          title: '描述不能少于10个字',
          icon: 'none'
        })
        return
      }

      try {
        const res = await submitFeedback({
          complaint_type: this.newFeedback.complaint_type,
          description: this.newFeedback.description
        })

        if (res.code === 200) {
          uni.showToast({
            title: '反馈提交成功',
            icon: 'success'
          })

          this.closePopup()
          await this.loadFeedbackList()
        }
      } catch (err) {
        uni.showToast({
          title: err.message || '提交失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style>
.feedback-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.nav-bar {
  display: flex;
  align-items: center;
  height: 80px;
  margin-bottom: 12px;
  padding: 0 16px;
}

.nav-bar-left {
  flex: 0 0 auto;
  padding: 8px;
}

.nav-bar-center {
  flex: 1;
  text-align: center;
}

.nav-bar-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E1E1E;
}

.nav-bar-right {
  flex: 0 0 auto;
  padding: 8px;
}

.nav-back-icon {
  font-size: 24px;
  color: #1E1E1E;
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 8px;
}

.nav-back-icon:active {
  color: #007aff;
  background-color: #F0F4FF;
}

.add-btn {
  font-size: 16px;
  color: #007aff;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 8px;
}

.add-btn:active {
  background-color: #F0F4FF;
  transform: scale(0.98);
}

.feedback-list {
  padding: 20rpx;
}

.feedback-item {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.feedback-info {
  display: flex;
  flex-direction: column;
}

.feedback-type {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.feedback-time {
  font-size: 22rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.status {
  display: inline-block;
  margin-bottom: 15rpx;
}

.status-text {
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.status-text.pending {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-text.processed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.description {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 15rpx;
  line-height: 1.5;
}

.response {
  font-size: 24rpx;
  color: #007aff;
  line-height: 1.5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.empty-state text {
  margin-top: 20rpx;
}

.popup-content {
  background-color: #fff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  padding: 30rpx;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 40rpx;
  color: #999;
}

.form-item {
  margin-bottom: 30rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.input {
  height: 70rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
  background-color: #f5f5f5;
}

.textarea {
  height: 150rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 26rpx;
  resize: none;
  background-color: #f5f5f5;
}

.popup-footer {
  margin-top: 40rpx;
}

.submit-btn {
  width: 100%;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
}
</style>