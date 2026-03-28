<template>
  <view class="device-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">设备管理</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 警告提示 -->
    <view class="warning">
      <text>以下是最近登录过您的帐号的设备情况，若您发现非本人操作，请及时删除，以保障您的设备安全。</text>
    </view>
    
    <!-- 设备列表 -->
    <view class="device-list">
      <view v-for="(item, index) in devices" :key="index" class="device-item">
        <view class="device-info">
          <uni-icons type="monitor" size="40" color="#007aff"></uni-icons>
          <view class="device-details">
            <text class="device-name">{{ item.name }}</text>
            <text class="login-time">登录时间：{{ item.loginTime }}</text>
            <text v-if="item.isCurrent" class="current-device">当前设备</text>
          </view>
        </view>
        <view class="actions">
          <button v-if="!item.isCurrent" class="delete-btn" @click="deleteDevice(index)">删除</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      devices: [
        {
          name: 'Windows PC (Chrome)',
          loginTime: '2024-01-18 14:30',
          isCurrent: true
        },
        {
          name: 'iPhone 13 (Safari)',
          loginTime: '2024-01-17 09:15',
          isCurrent: false
        },
        {
          name: 'Android Phone (Chrome)',
          loginTime: '2024-01-16 16:45',
          isCurrent: false
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    deleteDevice(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该设备吗？',
        success: (res) => {
          if (res.confirm) {
            this.devices.splice(index, 1)
            uni.showToast({
              title: '设备已删除',
              icon: 'success'
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.device-page {
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


.warning {
  background-color: #fff3e0;
  padding: 20rpx;
  margin: 20rpx;
  border-radius: 8rpx;
  border-left: 5rpx solid #ff9800;
}

.warning text {
  font-size: 24rpx;
  color: #f57c00;
  line-height: 1.5;
}

.device-list {
  background-color: #fff;
  margin: 0 20rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.device-item:last-child {
  border-bottom: none;
}

.device-info {
  display: flex;
  align-items: center;
}

.device-details {
  margin-left: 20rpx;
}

.device-name {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.login-time {
  font-size: 22rpx;
  color: #999;
  display: block;
}

.current-device {
  font-size: 20rpx;
  color: #007aff;
  background-color: #e3f2fd;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
  margin-top: 10rpx;
  display: inline-block;
}

.actions {
  display: flex;
}

.delete-btn {
  background-color: #ffebee;
  color: #ff3b30;
  border: 1rpx solid #ffcdd2;
  border-radius: 8rpx;
  padding: 0 25rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
}
</style>