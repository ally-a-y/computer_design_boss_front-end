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
        <uni-icons 
          type="star" 
          size="80" 
          :color="isFavorite ? '#FFD700' : '#ccc'" 
          @click="toggleFavorite"
        ></uni-icons>
        <text>{{ isFavorite ? '已收藏示例职位' : '暂无收藏职位' }}</text>
      </view>
    </view>
  </view>
</template>


<script>
import {favoriteApi} from '@/common/api/favorite.js'
import { jobApi } from '@/common/api/job.js'
export default {
  data() {
    return {
      collections: [],
      userId: 1,  // 实际项目应该从登录信息里拿
      loading: false
    }
  },

  async onLoad() {
    await this.loadFavorites()
  },
	data() {
	  return {
	    collections: [],
	    userId: 1,
	    loading: false,
	    isFavorite: false // 新增
	  }
	},
  methods: {
	goBack() {
	  uni.navigateBack()
	},
	async loadFavorites() {
	  try {
		this.loading = true
		const res = await favoriteApi.getFavoriteList(this.userId)
		console.log("转换后的collections:", res)
		const job = await jobApi.getAllJobs()
		const rawList = Array.isArray(res) ? res : []

		this.collections = rawList.map(item => {
		  const snapshot = JSON.parse(item.job_snapshot || '{}')
		  return {
			id: item.id, 
			jobTitle: snapshot.title || '',
			company: snapshot.location || '',
			salary: snapshot.salary || '',
			collectionTime: new Date(item.created_at).toLocaleString(),
			boss_job_id: item.boss_job_id
		  }
		})

		console.log("转换后的collections:", this.collections)

	  } catch (err) {
		uni.showToast({
		  title: err.message || '获取收藏失败',
		  icon: 'none'
		})
	  } finally {
		this.loading = false
	  }
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
    async cancelCollection(index) {
      const item = this.collections[index]

      uni.showModal({
        title: '提示',
        content: '确定取消收藏吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await favoriteApi.cancelFavorite({
                user_id: this.userId,
                boss_job_id: item.boss_job_id
              })

              this.collections.splice(index, 1)

              uni.showToast({
                title: '已取消收藏',
                icon: 'success'
              })

            } catch (err) {
              uni.showToast({
                title: err.message || '取消失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },
	async addToFavorite(jobId) {
	  try {
	    await favoriteApi.addFavorite({
	      user_id: this.userId,
	      job_id: jobId
	    })
	
	    uni.showToast({
	      title: '收藏成功',
	      icon: 'success'
	    })
	
	  } catch (err) {
	    uni.showToast({
	      title: err.message || '收藏失败',
	      icon: 'none'
	    })
	  }
	},
	async toggleFavorite() {
	    if (this.isFavorite) {
	      try {
	        await favoriteApi.cancelFavorite({ user_id: this.userId, boss_job_id: 1 })
	        this.isFavorite = false
	        uni.showToast({ title: '已取消收藏', icon: 'none' })
	      } catch (err) {
	        uni.showToast({ title: err.message || '取消失败', icon: 'none' })
	      }
	    } else {
	      try {
	        await favoriteApi.addFavorite({ user_id: this.userId, job_id: 1 })
	        this.isFavorite = true
	        uni.showToast({ title: '收藏成功', icon: 'success' })
	      } catch (err) {
	        uni.showToast({ title: err.message || '收藏失败', icon: 'none' })
	      }
	    }
	  }
	
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