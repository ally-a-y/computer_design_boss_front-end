<template>
  <view class="splash-container">
    <view class="splash-content">
      <image src="@/static/logo.png" class="splash-logo" mode="aspectFit"></image>
      <text class="splash-text">小菜鸟</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  onLoad() {
    // 检查用户是否已登录
    const token = uni.getStorageSync('token');
    
    // 延迟跳转
    setTimeout(() => {
      if (token) {
        // 已登录，跳转到首页
        uni.switchTab({
          url: '/pages/index/index_index'
        });
      } else {
        // 未登录，跳转到登录页面
        uni.navigateTo({
          url: '/pages/login/login'
        });
      }
    }, 2000);
  }
};
</script>

<style scoped>
.splash-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #F8FAFD;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.splash-logo {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 40rpx;
  animation: pulse 1.5s ease-in-out infinite;
}

.splash-text {
  font-size: 20px;
  font-weight: 600;
  color: #1E1E1E;
  animation: fadeIn 1s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>