<template>
  <view class="change-password-page" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航 -->
    <view class="nav-bar" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <text class="back-btn" @click="goBack" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">←</text>
      <text class="title" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">密码设置</text>
    </view>
    
    <!-- 修改内容 -->
    <view class="change-content" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="form-item">
        <text class="label" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">当前手机号</text>
        <text class="current-phone">{{ currentPhone }}</text>
      </view>
      
      <view class="form-item">
        <text class="label" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">验证码</text>
        <view class="code-input">
          <input type="number" v-model="verificationCode" placeholder="请输入验证码" placeholder-style="color: #999" :style="{ background: isDarkMode ? '#404040' : '#fff', borderColor: isDarkMode ? '#404040' : '#eee', color: isDarkMode ? '#ffffff' : '#333' }" />
          <button class="send-code-btn" @click="sendCode" :disabled="countdown > 0">
            {{ countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码' }}
          </button>
        </view>
      </view>
      
      <view class="form-item">
        <text class="label" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">新密码</text>
        <input type="password" v-model="newPassword" placeholder="请输入新密码" placeholder-style="color: #999" :style="{ background: isDarkMode ? '#404040' : '#fff', borderColor: isDarkMode ? '#404040' : '#eee', color: isDarkMode ? '#ffffff' : '#333' }" />
      </view>
      
      <view class="form-item">
        <text class="label" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">确认密码</text>
        <input type="password" v-model="confirmPassword" placeholder="请再次输入新密码" placeholder-style="color: #999" :style="{ background: isDarkMode ? '#404040' : '#fff', borderColor: isDarkMode ? '#404040' : '#eee', color: isDarkMode ? '#ffffff' : '#333' }" />
      </view>
      
      <button class="confirm-btn" @click="confirmChange">确认修改</button>
    </view>
  </view>
</template>

<script>
import { themeManager } from '@/common/utils/theme-simple.js'

export default {
  data() {
    return {
      currentPhone: '138****8000',
      verificationCode: '',
      newPassword: '',
      confirmPassword: '',
      countdown: 0,
      // 主题相关
      currentTheme: 'light',
      isDarkMode: false
    }
  },
  
  onLoad() {
    // 初始化主题
    this.initTheme()
  },
  
  onUnload() {
    // 清理主题监听
    uni.$off('globalThemeChange', this.handleGlobalThemeChange)
  },
  
  methods: {
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
    confirmChange() {
      // 验证表单
      if (!this.verificationCode) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return
      }
      
      if (!this.newPassword) {
        uni.showToast({
          title: '请输入新密码',
          icon: 'none'
        })
        return
      }
      
      if (this.newPassword.length < 6) {
        uni.showToast({
          title: '密码长度不能少于6位',
          icon: 'none'
        })
        return
      }
      
      if (this.newPassword !== this.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        })
        return
      }
      
      // 确认修改逻辑
      uni.showToast({
        title: '密码修改成功',
        icon: 'success'
      })
      
      // 修改成功后返回账号页面
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  }
}
</script>

<style>
.change-password-page {
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

.current-phone {
  font-size: 26rpx;
  color: #007aff;
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