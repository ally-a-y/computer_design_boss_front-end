<template>
  <view class="deliver-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="title">投递职位</text>
    </view>
    
    <!-- 投递列表 -->
    <view class="deliver-list">
      <view v-for="(item, index) in delivers" :key="index" class="deliver-item">
        <view class="job-info">
          <text class="job-title">{{ item.jobTitle }}</text>
          <text class="company">{{ item.company }}</text>
          <text class="salary">{{ item.salary }}</text>
          <text class="deliver-time">投递时间：{{ item.deliverTime }}</text>
          <view class="status">
            <text class="status-text" :class="item.status">{{ item.statusText }}</text>
          </view>
        </view>
        <view class="actions">
          <button class="cancel-btn" @click="cancelDeliver(index)">取消投递</button>
          <button class="detail-btn" @click="viewDetails(item)">查看详情</button>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="delivers.length === 0" class="empty-state">
        <uni-icons type="paperplane" size="80" color="#ccc"></uni-icons>
        <text>暂无投递记录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      delivers: [
        {
          jobTitle: '前端开发工程师',
          company: '科技有限公司',
          salary: '15k-25k',
          deliverTime: '2024-01-15 14:30',
          status: 'pending',
          statusText: '待处理'
        },
        {
          jobTitle: '后端开发工程师',
          company: '互联网公司',
          salary: '20k-30k',
          deliverTime: '2024-01-16 10:20',
          status: 'reviewing',
          statusText: '审核中'
        },
        {
          jobTitle: '产品经理',
          company: '创业公司',
          salary: '18k-28k',
          deliverTime: '2024-01-17 09:15',
          status: 'rejected',
          statusText: '已拒绝'
        },
        {
          jobTitle: 'UI设计师',
          company: '设计公司',
          salary: '12k-20k',
          deliverTime: '2024-01-18 16:45',
          status: 'accepted',
          statusText: '已通过'
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    cancelDeliver(index) {
      uni.showModal({
        title: '提示',
        content: '确定要取消投递该职位吗？',
        success: (res) => {
          if (res.confirm) {
            this.delivers.splice(index, 1)
            uni.showToast({
              title: '已取消投递',
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
    // 从存储中加载投递数据
    const savedDelivers = uni.getStorageSync('delivers')
    if (savedDelivers) {
      this.delivers = savedDelivers
    }
  },
  onUnload() {
    // 保存投递数据
    uni.setStorageSync('delivers', this.delivers)
  }
}
</script>

<style>
.deliver-page {
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

.deliver-list {
  padding: 20rpx;
}

.deliver-item {
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

.deliver-time {
  font-size: 22rpx;
  color: #999;
  display: block;
  margin-bottom: 10rpx;
}

.status {
  display: inline-block;
}

.status-text {
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
}

.status-text.pending {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-text.reviewing {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-text.accepted {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-text.rejected {
  background-color: #ffebee;
  color: #c62828;
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