<template>
  <view class="user-page" :style="{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F8FAFD' }">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <!-- 左侧预留空间 -->
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">我的</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 顶部卡片 -->
    <view class="top-card" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#fff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="user-header">
        <image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ userInfo.name || '已登录' }}</text>
          <text class="edit-resume" @click="navigateToResume" :style="{ color: '#007aff' }">编辑简历</text>
        </view>
      </view>
      
      <!-- 功能图标 -->
      <view class="function-icons" :style="{ borderTop: isDarkMode ? '1px solid #404040' : '1px solid #F2F5F9' }">
        <view class="icon-item" @click="navigateToCollection" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">
          <uni-icons type="star" size="40" color="#ff9500"></uni-icons>
          <text>收藏职位</text>
        </view>
        <view class="icon-item" @click="navigateToDeliver" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">
          <uni-icons type="paperplane" size="40" color="#007aff"></uni-icons>
          <text>投递职位</text>
        </view>
        <view class="icon-item" @click="navigateToFeedback" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">
          <uni-icons type="chatbubble" size="40" color="#4cd964"></uni-icons>
          <text>投诉反馈</text>
        </view>
      </view>
    </view>
    
    <!-- 菜单列表 -->
    <view class="menu-list" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#fff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="menu-item" @click="navigateToAccount" :style="{ borderBottom: isDarkMode ? '1px solid #404040' : '1px solid #F2F5F9' }">
        <uni-icons type="person" size="30" :color="isDarkMode ? '#999' : '#666'"></uni-icons>
        <text class="menu-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">我的账号</text>
        <uni-icons type="right" size="20" :color="isDarkMode ? '#666' : '#999'"></uni-icons>
      </view>
      
      <view class="menu-item" @click="navigateToDevice" :style="{ borderBottom: isDarkMode ? '1px solid #404040' : '1px solid #F2F5F9' }">
        <uni-icons type="phone" size="30" :color="isDarkMode ? '#999' : '#666'"></uni-icons>
        <text class="menu-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">登录设备管理</text>
        <uni-icons type="right" size="20" :color="isDarkMode ? '#666' : '#999'"></uni-icons>
      </view>
      
      <view class="menu-item" @click="navigateToDisplay" :style="{ borderBottom: isDarkMode ? '1px solid #404040' : '1px solid #F2F5F9' }">
        <uni-icons type="settings" size="30" :color="isDarkMode ? '#999' : '#666'"></uni-icons>
        <text class="menu-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">显示设置</text>
        <uni-icons type="right" size="20" :color="isDarkMode ? '#666' : '#999'"></uni-icons>
      </view>
      
      <view class="menu-item" @click="navigateToThemeDemo">
        <uni-icons type="color" size="30" :color="isDarkMode ? '#999' : '#666'"></uni-icons>
        <text class="menu-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">可视化页面</text>
        <uni-icons type="right" size="20" :color="isDarkMode ? '#666' : '#999'"></uni-icons>
      </view>
    </view>
    
    <!-- 退出登录 -->
    <view class="logout-btn" @click="logout" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#fff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <text :style="{ color: '#ff3b30' }">退出登录</text>
    </view>
  </view>
</template>

<script>
import { themeManager } from '@/common/utils/theme-simple.js'

export default {
  data() {
    return {
      userInfo: {
        name: '张三',
        avatar: '/static/logo.png'
      },
      // 主题相关
      currentTheme: 'light',
      isDarkMode: false
    }
  },
  onShow() {
    // 检查用户登录状态
    this.checkLoginStatus()
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
    
    checkLoginStatus() {
      // 这里可以检查用户登录状态
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
      }
    },
    navigateToResume() {
      uni.navigateTo({
        url: '/pages/user/resume/user_resume'
      })
    },
    navigateToCollection() {
      uni.navigateTo({
        url: '/pages/user/collection/user_collection'
      })
    },
    navigateToDeliver() {
      uni.navigateTo({
        url: '/pages/user/deliver/user_deliver'
      })
    },
    navigateToFeedback() {
      uni.navigateTo({
        url: '/pages/user/feedback/user_feedback'
      })
    },
    navigateToAccount() {
      uni.navigateTo({
        url: '/pages/user/account/user_account'
      })
    },
    navigateToDevice() {
      uni.navigateTo({
        url: '/pages/user/device/user_device'
      })
    },
    navigateToDisplay() {
      uni.navigateTo({
        url: '/pages/user/display/user_display'
      })
    },
    navigateToThemeDemo() {
      uni.navigateTo({
        url: '/pages/chart'
      })
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 同时清除token和userInfo
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
            // 跳转到登录页面
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/login/login'
              })
            }, 1500)
          }
        }
      })
    }
  }
}
</script>

<style>
.user-page {
  background-color: #F8FAFD;
  min-height: 100vh;
  padding: 0 16px;
  padding-top: 16px;
  padding-bottom: 40rpx;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  height: 80px;
  margin-bottom: 12px;
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
  color: #1E1E1E;
  transition: all 0.3s ease;
}

.nav-back-icon:active {
  color: #007aff;
}

.top-card {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
  border: 2px solid #F0F4FF;
}

.user-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 8px;
}

.edit-resume {
  font-size: 14px;
  color: #007aff;
  transition: all 0.3s ease;
}

.edit-resume:active {
  opacity: 0.7;
}

.function-icons {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid #F2F5F9;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6C757D;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.icon-item:active {
  background-color: #F0F4FF;
  transform: scale(0.98);
}

.icon-item text {
  margin-top: 8px;
}

.menu-list {
  background-color: #fff;
  margin-bottom: 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #F2F5F9;
  transition: all 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #F8FAFD;
}

.menu-text {
  flex: 1;
  margin-left: 16px;
  font-size: 16px;
  color: #1E1E1E;
}

.logout-btn {
  background-color: #fff;
  padding: 16px;
  text-align: center;
  color: #ff3b30;
  font-size: 16px;
  margin: 12px 0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.logout-btn:active {
  background-color: #F8FAFD;
  transform: scale(0.98);
}
</style>