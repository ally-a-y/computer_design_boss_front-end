<template>
  <view class="user-page">
    <!-- 顶部卡片 -->
    <view class="top-card">
      <view class="user-header">
        <image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ userInfo.name || '已登录' }}</text>
          <text class="edit-resume" @click="navigateToResume">编辑简历</text>
        </view>
      </view>
      
      <!-- 功能图标 -->
      <view class="function-icons">
        <view class="icon-item" @click="navigateToCollection">
          <uni-icons type="star" size="40" color="#ff9500"></uni-icons>
          <text>收藏职位</text>
        </view>
        <view class="icon-item" @click="navigateToDeliver">
          <uni-icons type="paperplane" size="40" color="#007aff"></uni-icons>
          <text>投递职位</text>
        </view>
        <view class="icon-item" @click="navigateToFeedback">
          <uni-icons type="chatbubble" size="40" color="#4cd964"></uni-icons>
          <text>投诉反馈</text>
        </view>
      </view>
    </view>
    
    <!-- 菜单列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="navigateToAccount">
        <uni-icons type="person" size="30" color="#666"></uni-icons>
        <text class="menu-text">我的账号</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
      
      <view class="menu-item" @click="navigateToDevice">
        <uni-icons type="monitor" size="30" color="#666"></uni-icons>
        <text class="menu-text">登录设备管理</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
      
      <view class="menu-item" @click="navigateToDisplay">
        <uni-icons type="settings" size="30" color="#666"></uni-icons>
        <text class="menu-text">显示设置</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
      
      <view class="menu-item" @click="navigateToThemeDemo">
        <uni-icons type="color" size="30" color="#666"></uni-icons>
        <text class="menu-text">主题演示</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
    </view>
    
    <!-- 退出登录 -->
    <view class="logout-btn" @click="logout">
      <text>退出登录</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        name: '张三',
        avatar: '/static/logo.png'
      }
    }
  },
  onShow() {
    // 检查用户登录状态
    this.checkLoginStatus()
  },
  methods: {
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
        url: '/pages/demo/theme-demo'
      })
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('userInfo')
            uni.showToast({
              title: '已退出登录',
              icon: 'success'
            })
            // 可以跳转到登录页面
          }
        }
      })
    }
  }
}
</script>

<style>
.user-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

.top-card {
  background-color: #fff;
  padding: 40rpx;
  margin-bottom: 20rpx;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.edit-resume {
  font-size: 24rpx;
  color: #007aff;
}

.function-icons {
  display: flex;
  justify-content: space-around;
  padding-top: 30rpx;
  border-top: 1rpx solid #eee;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
  font-size: 26rpx;
}

.icon-item text {
  margin-top: 10rpx;
}

.menu-list {
  background-color: #fff;
  margin-bottom: 20rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 20rpx;
  border-bottom: 1rpx solid #eee;
}

.menu-text {
  flex: 1;
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.logout-btn {
  background-color: #fff;
  padding: 30rpx 20rpx;
  text-align: center;
  color: #ff3b30;
  font-size: 28rpx;
  margin: 0 20rpx;
  border-radius: 8rpx;
}
</style>