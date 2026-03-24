<template>
  <view class="collection-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">收藏职位</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
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
        <uni-icons 
          type="star" 
          size="80" 
          color="#ccc"
        ></uni-icons>
        <text>暂无收藏职位</text>
      </view>
    </view>
  </view>
</template>


<script>
export default {
  data() {
    return {
      collections: []
    }
  },

  onLoad() {
    this.loadFavorites()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    loadFavorites() {
      // 从本地存储获取收藏列表
      let collections = uni.getStorageSync('collections') || []
      // 去重，确保每个职位只出现一次
      const uniqueCollections = []
      const seenIds = new Set()
      
      for (const item of collections) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id)
          uniqueCollections.push(item)
        }
      }
      
      this.collections = uniqueCollections
      // 保存去重后的收藏列表
      uni.setStorageSync('collections', uniqueCollections)
    },
    viewDetails(item) {
      if (!item.id) {
        uni.showToast({
          title: '职位ID不存在',
          icon: 'none'
        })
        return
      }

      uni.navigateTo({
        url: `/pages/job/detail/job_detail_index?id=${item.id}`
      })
    },
    cancelCollection(index) {
      uni.showModal({
        title: '提示',
        content: '确定取消收藏吗？',
        success: (res) => {
          if (res.confirm) {
            // 从本地存储获取收藏列表
            let collections = uni.getStorageSync('collections') || []
            // 移除指定索引的收藏
            collections.splice(index, 1)
            // 保存更新后的收藏列表
            uni.setStorageSync('collections', collections)
            // 更新页面数据
            this.collections = collections
            
            uni.showToast({
              title: '已取消收藏',
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
.collection-page {
  background-color: #F8FAFD;
  min-height: 100vh;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

.nav-bar {
  display: flex;
  align-items: center;
  height: 80px;
  margin-bottom: 12px;
  padding: 0 16px;
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
  font-size: 24px;
  color: #1E1E1E;
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 8px;
}

.nav-back-icon:active {
  color: #007aff;
  background-color: #F0F4FF;
}

.collection-list {
  padding: 16px;
}

.collection-item {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.collection-item:active {
  transform: scale(0.98);
}

.job-info {
  margin-bottom: 16px;
}

.job-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  display: block;
  margin-bottom: 8px;
  line-height: 1.4;
}

.company {
  font-size: 14px;
  color: #6C757D;
  display: block;
  margin-bottom: 8px;
}

.salary {
  font-size: 16px;
  color: #007aff;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}

.collection-time {
  font-size: 12px;
  color: #ADB5BD;
  display: block;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #F2F5F9;
}

.cancel-btn {
  background-color: #F2F5F9;
  color: #6C757D;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.cancel-btn:active {
  background-color: #E9ECEF;
  transform: scale(0.98);
}

.detail-btn {
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.detail-btn:active {
  background-color: #0056b3;
  transform: scale(0.98);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #ADB5BD;
  font-size: 16px;
}

.empty-state text {
  margin-top: 16px;
}
</style>