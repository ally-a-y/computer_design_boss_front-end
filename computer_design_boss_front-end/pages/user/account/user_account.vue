<template>
  <view class="account-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">我的账号</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 账号设置列表 -->
    <view class="account-list">
      <view class="account-item" @click="navigateToNumber">
        <text class="item-text">修改手机</text>
        <view class="item-right">
          <text class="current-info">{{ currentPhone }}</text>
          <uni-icons type="right" size="20" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="account-item" @click="navigateToEmail">
        <text class="item-text">邮箱设置</text>
        <view class="item-right">
          <text class="current-info">{{ currentEmail }}</text>
          <uni-icons type="right" size="20" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="account-item" @click="navigateToPassword">
        <text class="item-text">密码设置</text>
        <view class="item-right">
          <text class="current-info">********</text>
          <uni-icons type="right" size="20" color="#999"></uni-icons>
        </view>
      </view>
      
      <view class="account-item delete-account" @click="deleteAccount">
        <text class="item-text">注销账号</text>
        <uni-icons type="right" size="20" color="#999"></uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
	import { userApi } from '../../../common/api/user.js'
export default {
  data() {
    return {
      currentPhone: '',
      currentEmail: ''
    }
  },
  
  onLoad() {
    this.getUserInfo()
  },
  
  methods: {
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