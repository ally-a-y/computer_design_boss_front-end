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
import { deliverApi } from '@/common/api/deliver.js' // 你需要写对应的deliverApi封装
import { jobApi } from '@/common/api/job.js'
export default {
  data() {
    return {
      delivers: [],
      userId: 1, // 实际项目应该从登录信息里拿
      loading: false
    }
  },

  async onLoad() {
    await this.loadDelivers()
  },

  methods: {
    goBack() {
      uni.navigateBack()
    },

	async loadDelivers() {
	  try {
		this.loading = true
		const res = await deliverApi.getDeliverList(this.userId)
		const job = await jobApi.getAllJobs()
		console.log("转换后的id:",job)

		
		const rawList = Array.isArray(res) ? res : []

		this.delivers = rawList.map(item => {
		  // const snapshot = item.job_snapshot || {}
		  const snapshot = JSON.parse(item.job_snapshot || '{}')
			console.log("转换前的delivers:", snapshot)
		  return {
			id: item.id,  // 保存投递记录的 id
			jobTitle: snapshot.title || '',
			company: snapshot.location || '',  // 如果以后有 company_name 再换
			salary: snapshot.salary || '',
			deliverTime: new Date(item.created_at).toLocaleString(),
			status: item.status || 'pending',
			statusText: item.status_text || '待处理',
			boss_job_id: item.boss_job_id,

			// 如果你后面详情页要用，可以一起存
			address: snapshot.address || '',
			eduReq: snapshot.edu_req || '',
			expReq: snapshot.exp_req || ''
		  }
		})
		console.log("转换后的id:",job)
		console.log("转换后的delivers:", this.delivers.jobTitle)
		console.log("转换后的delivers:", this.delivers)
	  } catch (err) {
		uni.showToast({
		  title: err.message || '获取投递失败',
		  icon: 'none'
		})
	  } finally {
		this.loading = false
	  }
	},
    async cancelDeliver(index) {
      const item = this.delivers[index]
      uni.showModal({
        title: '提示',
        content: '确定取消投递该职位吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await deliverApi.cancelDeliver({
                user_id: this.userId,
                boss_job_id: item.boss_job_id
              })

              this.delivers.splice(index, 1)

              uni.showToast({
                title: '已取消投递',
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

	viewDetails(item) {
	  if (!item.id) {
		uni.showToast({
		  title: '职位ID不存在',
		  icon: 'none'
		})
		return
	  }
	console.log("转换后的a:",item)
	  uni.navigateTo({
		  
		url: `/pages/job/detail/job_detail_index?id=${item.id}`
	  }) 
	}
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