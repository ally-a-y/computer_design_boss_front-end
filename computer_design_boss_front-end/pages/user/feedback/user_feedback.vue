<template>
  <view class="feedback-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="title">投诉反馈</text>
      <text class="add-btn" @click="addFeedback">+</text>
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
export default {
  data() {
    return {
      feedbacks: [
        {
          type: '账号问题',
          submitTime: '2024-01-15 14:30',
          status: 'pending',
          statusText: '待处理',
          description: '登录账号遇到问题，无法正常登录'
        },
        {
          type: '职位信息错误',
          submitTime: '2024-01-16 10:20',
          status: 'processed',
          statusText: '已处理',
          description: '某职位的薪资信息显示错误',
          response: '已核实并修正该职位的薪资信息，感谢您的反馈'
        }
      ],
      typeOptions: ['账号问题', '职位信息错误', '平台功能问题', '其他'],
      typeIndex: 0,
      newFeedback: {
        type: '',
        description: ''
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    addFeedback() {
      this.newFeedback = {
        type: this.typeOptions[this.typeIndex],
        description: ''
      }
      this.$refs.addPopup.open()
    },
    closePopup() {
      this.$refs.addPopup.close()
    },
    onTypeChange(e) {
      this.typeIndex = e.detail.value
      this.newFeedback.type = this.typeOptions[this.typeIndex]
    },
    submitFeedback() {
      if (!this.newFeedback.description.trim()) {
        uni.showToast({
          title: '请输入投诉描述',
          icon: 'none'
        })
        return
      }
      
      const feedback = {
        type: this.newFeedback.type,
        submitTime: new Date().toLocaleString(),
        status: 'pending',
        statusText: '待处理',
        description: this.newFeedback.description
      }
      
      this.feedbacks.unshift(feedback)
      this.closePopup()
      uni.showToast({
        title: '反馈提交成功',
        icon: 'success'
      })
    }
  },
  onLoad() {
    // 从存储中加载反馈数据
    const savedFeedbacks = uni.getStorageSync('feedbacks')
    if (savedFeedbacks) {
      this.feedbacks = savedFeedbacks
    }
  },
  onUnload() {
    // 保存反馈数据
    uni.setStorageSync('feedbacks', this.feedbacks)
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
  justify-content: space-between;
  padding: 30rpx 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.back-btn {
  font-size: 36rpx;
  color: #333;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.add-btn {
  font-size: 40rpx;
  color: #007aff;
  font-weight: bold;
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