<template>
  <view class="account-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="title">我的账号</text>
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
export default {
  data() {
    return {
      currentPhone: '138****8000',
      currentEmail: 'zhangsan@example.com'
    }
  },
  methods: {
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