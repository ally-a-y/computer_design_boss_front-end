<template>
  <view class="account-page" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航 -->
    <view class="nav-bar" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">我的账号</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 账号设置列表 -->
    <view class="account-list" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="account-item" @click="navigateToNumber" :style="{ borderBottom: isDarkMode ? '1px solid #404040' : '1px solid #eee' }">
        <text class="item-text" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">修改手机</text>
        <view class="item-right">
          <text class="current-info" :style="{ color: isDarkMode ? '#666' : '#999' }">{{ currentPhone }}</text>
          <uni-icons type="right" size="20" :color="isDarkMode ? '#666' : '#999'"></uni-icons>
        </view>
      </view>
      
      <view class="account-item" @click="navigateToEmail" :style="{ borderBottom: isDarkMode ? '1px solid #404040' : '1px solid #eee' }">
        <text class="item-text" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">邮箱设置</text>
        <view class="item-right">
          <text class="current-info" :style="{ color: isDarkMode ? '#666' : '#999' }">{{ currentEmail }}</text>
          <uni-icons type="right" size="20" :color="isDarkMode ? '#666' : '#999'"></uni-icons>
        </view>
      </view>
      
      <view class="account-item" @click="navigateToPassword" :style="{ borderBottom: isDarkMode ? '1px solid #404040' : '1px solid #eee' }">
        <text class="item-text" :style="{ color: isDarkMode ? '#ffffff' : '#333' }">密码设置</text>
        <view class="item-right">
          <text class="current-info" :style="{ color: isDarkMode ? '#666' : '#999' }">********</text>
          <uni-icons type="right" size="20" :color="isDarkMode ? '#666' : '#999'"></uni-icons>
        </view>
      </view>
      
      <view class="account-item delete-account" @click="deleteAccount">
        <text class="item-text" :style="{ color: '#ff3b30' }">注销账号</text>
        <uni-icons type="right" size="20" :color="isDarkMode ? '#666' : '#999'"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
	import { userApi } from '../../../common/api/user.js'
import { themeManager } from '@/common/utils/theme-simple.js'
export default {
  data() {
    return {
      currentPhone: '',
      currentEmail: '',
      // 主题相关
      currentTheme: 'light',
      isDarkMode: false
    }
  },
  
  onLoad() {
    this.getUserInfo()
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
    
    async getUserInfo() {
  console.log('======== 开始请求用户信息 ========')
  
  try {
    const res = await userApi.getUserProfile()
    
    console.log('请求成功，完整响应:', res)
    console.log('响应数据:', res.data)
    console.log('手机号:', res.mobile)
    console.log('邮箱:', res.email)
    

    if (res) {
      this.currentPhone = res.mobile 
        ? res.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') 
        : '未绑定'
      this.currentEmail = res.email || '未设置'
      
      console.log('页面显示:', this.currentPhone, this.currentEmail)
    }
  } catch (error) {
    console.error('======== 请求失败 ========')
    console.error('错误信息:', error.message)
    console.error('完整错误:', error)
  }
  
  console.log('======== 请求结束 ========')
},
    goBack() {
      uni.navigateBack()
    },
    navigateToNumber() {
      uni.navigateTo({
        url: '/pages/user/account/number/account_number'
      })
    },
    navigateToEmail() {
      uni.navigateTo({
        url: '/pages/user/account/email/account_email'
      })
    },
    navigateToPassword() {
      uni.navigateTo({
        url: '/pages/user/account/code/account_code'
      })
    },
    deleteAccount() {
      uni.showModal({
        title: '注销账号',
        content: '注销账号后，您的所有数据将被永久删除，且无法恢复。确定要注销账号吗？',
        confirmText: '确定注销',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 注销账号逻辑
            uni.showToast({
              title: '账号注销功能开发中',
              icon: 'none'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.account-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-top: 80px;
  box-sizing: border-box;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  height: 80px;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  margin: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
}

.nav-bar-left {
  width: 40px;
}

.nav-bar-center {
  flex: 1;
  text-align: center;
}

.nav-bar-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
}

.nav-bar-right {
  width: 40px;
}

.nav-back-icon {
  font-size: 24px;
  color: #1E1E1E;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-back-icon:active {
  color: #007AFF;
}


.account-list {
  background-color: #fff;
  margin-top: 20rpx;
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 20rpx;
  border-bottom: 1rpx solid #eee;
}

.item-text {
  font-size: 28rpx;
  color: #333;
}

.item-right {
  display: flex;
  align-items: center;
}

.current-info {
  font-size: 26rpx;
  color: #999;
  margin-right: 10rpx;
}

.account-item.delete-account {
  margin-top: 40rpx;
  border-bottom: none;
}

.account-item.delete-account .item-text {
  color: #ff3b30;
}
</style>