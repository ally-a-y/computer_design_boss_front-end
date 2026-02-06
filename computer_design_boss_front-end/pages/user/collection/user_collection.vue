<template>
  <view class="collection-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="title">收藏职位</text>
    </view>
    
    <!-- 收藏列表 -->
    <view class="collection-list">
      <view v-for="(item, index) in collections" :key="index" class="collection-item">
        <view class="job-info">
          <text class="job-title">{{ item.jobTitle }}</text>
          <text class="company">{{ item.company }}</text>
          <text class="salary">{{ item.salary }}</text>
          <text class="collection-time">收藏时间：{{ item.collectionTime }}</text>
        </view>
        <view class="actions">
          <button class="cancel-btn" @click="cancelCollection(index)">取消收藏</button>
          <button class="detail-btn" @click="viewDetails(item)">查看详情</button>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="collections.length === 0" class="empty-state">
        <uni-icons type="star" size="80" color="#ccc"></uni-icons>
        <text>暂无收藏职位</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      collections: [
        {
          jobTitle: '前端开发工程师',
          company: '科技有限公司',
          salary: '15k-25k',
          collectionTime: '2024-01-15 14:30'
        },
        {
          jobTitle: '后端开发工程师',
          company: '互联网公司',
          salary: '20k-30k',
          collectionTime: '2024-01-16 10:20'
        },
        {
          jobTitle: '产品经理',
          company: '创业公司',
          salary: '18k-28k',
          collectionTime: '2024-01-17 09:15'
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    cancelCollection(index) {
      uni.showModal({
        title: '提示',
        content: '确定要取消收藏该职位吗？',
        success: (res) => {
          if (res.confirm) {
            this.collections.splice(index, 1)
            uni.showToast({
              title: '已取消收藏',
              icon: 'success'
            })
          }
        }
      })
    },
    viewDetails(item) {
      // 查看详情逻辑
      uni.showToast({
        title: `查看${item.jobTitle}详情`,
        icon: 'none'
      })
    }
  },
  onLoad() {
    // 从存储中加载收藏数据
    const savedCollections = uni.getStorageSync('collections')
    if (savedCollections) {
      this.collections = savedCollections
    }
  },
  onUnload() {
    // 保存收藏数据
    uni.setStorageSync('collections', this.collections)
  }
}
</script>

<style>
.collection-page {
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

.collection-list {
  padding: 20rpx;
}

.collection-item {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.job-info {
  margin-bottom: 20rpx;
}

.job-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.company {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.salary {
  font-size: 30rpx;
  color: #ff9500;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.collection-time {
  font-size: 22rpx;
  color: #999;
  display: block;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 0 30rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
}

.detail-btn {
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 8rpx;
  padding: 0 30rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.empty-state text {
  margin-top: 20rpx;
}
</style>