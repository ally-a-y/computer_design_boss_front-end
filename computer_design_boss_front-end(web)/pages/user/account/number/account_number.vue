<template>
  <view class="verify-phone-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="title">修改手机</text>
    </view>
    
    <!-- 验证内容 -->
    <view class="verify-content">
      <view class="phone-info">
        <text>当前手机号：</text>
        <text class="current-phone">{{ currentPhone }}</text>
      </view>
      
      <view class="form-item">
        <text class="label">验证码</text>
        <view class="code-input">
          <input type="number" v-model="verificationCode" placeholder="请输入验证码" />
          <button class="send-code-btn" @click="sendCode" :disabled="countdown > 0">
            {{ countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码' }}
          </button>
        </view>
      </view>
      
      <button class="next-btn" @click="verifyCode">下一步</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentPhone: '138****8000',
      verificationCode: '',
      countdown: 0
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    sendCode() {
      // 发送验证码逻辑
      uni.showToast({
        title: '验证码发送成功',
        icon: 'success'
      })
      
      // 开始倒计时
      this.countdown = 60
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    },
    verifyCode() {
      if (!this.verificationCode.trim()) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return
      }
      
      // 验证码验证逻辑（模拟）
      if (this.verificationCode === '123456') {
        uni.navigateTo({
          url: '/pages/user/account/number/number_change'
        })
      } else {
        uni.showToast({
          title: '验证码错误',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style>
.verify-phone-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.nav-bar {
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 16px;
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
  margin-left: 20rpx;
}

.verify-content {
  padding: 40rpx;
  background-color: #fff;
  margin: 20rpx;
  border-radius: 8rpx;
}

.phone-info {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
}

.current-phone {
  color: #007aff;
  font-weight: bold;
}

.form-item {
  margin-bottom: 40rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.code-input {
  display: flex;
  gap: 20rpx;
}

.code-input input {
  flex: 1;
  height: 70rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
}

.send-code-btn {
  width: 200rpx;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 24rpx;
}

.send-code-btn:disabled {
  background-color: #ccc;
}

.next-btn {
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