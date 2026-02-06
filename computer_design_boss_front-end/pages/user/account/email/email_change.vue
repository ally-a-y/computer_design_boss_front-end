<template>
  <view class="change-email-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="title">修改邮箱</text>
    </view>
    
    <!-- 修改内容 -->
    <view class="change-content">
      <view class="form-item">
        <text class="label">新邮箱</text>
        <input type="email" v-model="newEmail" placeholder="请输入新邮箱" />
      </view>
      
      <view class="form-item">
        <text class="label">验证码</text>
        <view class="code-input">
          <input v-model="verificationCode" placeholder="请输入验证码" />
          <button class="send-code-btn" @click="sendCode" :disabled="countdown > 0">
            {{ countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码' }}
          </button>
        </view>
      </view>
      
      <button class="confirm-btn" @click="confirmChange">确认修改</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      newEmail: '',
      verificationCode: '',
      countdown: 0
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    sendCode() {
      if (!this.newEmail) {
        uni.showToast({
          title: '请输入正确的邮箱地址',
          icon: 'none'
        })
        return
      }
      
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
    confirmChange() {
      if (!this.newEmail) {
        uni.showToast({
          title: '请输入正确的邮箱地址',
          icon: 'none'
        })
        return
      }
      
      if (!this.verificationCode) {
        uni.showToast({
          title: '请输入正确的验证码',
          icon: 'none'
        })
        return
      }
      
      // 确认修改逻辑
      uni.showToast({
        title: '邮箱修改成功',
        icon: 'success'
      })
      
      // 修改成功后返回账号页面
      setTimeout(() => {
        uni.navigateBack({
          delta: 2 // 返回两级，回到账号页面
        })
      }, 1500)
    }
  }
}
</script>

<style>
.change-email-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.nav-bar {
  display: flex;
  align-items: center;
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
  margin-left: 20rpx;
}

.change-content {
  padding: 40rpx;
  background-color: #fff;
  margin: 20rpx;
  border-radius: 8rpx;
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

.form-item input {
  width: 100%;
  height: 70rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
}

.code-input {
  display: flex;
  gap: 20rpx;
}

.code-input input {
  flex: 1;
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

.confirm-btn {
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