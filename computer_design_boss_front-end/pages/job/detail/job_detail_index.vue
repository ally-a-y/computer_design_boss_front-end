<template>
  <view class="job-detail-page">
    <!-- 职位基本信息 -->
    <view class="job-header">
      <text class="job-title">{{ jobDetail?.title || '暂无职位信息' }}</text>
      <text class="job-salary">{{ jobDetail?.salary_min ? `${(jobDetail.salary_min/1000).toFixed(0)}k-${jobDetail?.salary_max ? (jobDetail.salary_max/1000).toFixed(0) : '?' }k` : '薪资面议' }}</text>
      
      <view class="job-requirements">
        <text class="req-item">{{ jobDetail?.edu_req || '学历不限' }}</text>
        <text class="req-item">{{ jobDetail?.exp_req || '经验不限' }}</text>
        <text class="req-item">{{ jobDetail?.emp_type ? getEmpTypeText(jobDetail.emp_type) : '全职' }}</text>
      </view>
    </view>
    
    <!-- 职位描述 -->
    <view class="job-section">
      <view class="section-title">职位描述</view>
      <view class="section-content">
        <text>{{ jobDetail?.description || '暂无描述' }}</text>
      </view>
    </view>
    
    <!-- 任职要求 -->
    <view class="job-section">
      <view class="section-title">任职要求</view>
      <view class="section-content">
        <view v-if="Array.isArray(jobDetail?.require_list) && jobDetail.require_list.length > 0">
          <view v-for="(req, index) in jobDetail.require_list" :key="index" class="requirement-item">
            <text class="requirement-number">{{ index + 1 }}. </text>
            <text class="requirement-text">{{ req }}</text>
          </view>
        </view>
        <text v-else>{{ jobDetail?.require_list || '暂无要求' }}</text>
      </view>
    </view>
    
    <!-- 工作地址 -->
    <view class="job-section" v-if="jobDetail?.address">
      <view class="section-title">工作地址</view>
      <view class="section-content">
        <text>{{ jobDetail.district || '' }} {{ jobDetail.address }}</text>
      </view>
    </view>
    
    <!-- 福利待遇 -->
    <view class="job-section" v-if="jobDetail?.welfare_list">
      <view class="section-title">福利待遇</view>
      <view class="section-content">
        <view v-if="Array.isArray(jobDetail?.welfare_list) && jobDetail.welfare_list.length > 0">
          <view v-for="(welfare, index) in jobDetail.welfare_list" :key="index" class="welfare-item">
            <text class="welfare-icon">• </text>
            <text class="welfare-text">{{ welfare }}</text>
          </view>
        </view>
        <text v-else>{{ jobDetail?.welfare_list }}</text>
      </view>
    </view>
    
    <!-- 薪资详情 -->
    <view class="job-section" v-if="jobDetail?.salary_desc">
      <view class="section-title">薪资详情</view>
      <view class="section-content">
        <text>{{ jobDetail.salary_desc }}</text>
      </view>
    </view>
    
    <!-- 发布时间 -->
    <view class="job-section" v-if="jobDetail?.publish_time">
      <view class="section-title">发布时间</view>
      <view class="section-content">
        <text>{{ formatDate(jobDetail.publish_time) }}</text>
      </view>
    </view>
	<view class="apply-button-container">
	  <button 
	    :disabled="isApplied" 
	    :class="['apply-button', { 'disabled': isApplied }]" 
	    @click="applyForJob"
	  >
	    {{ isApplied ? '已加入投递列表' : '投递' }}
	  </button>
	        <!-- 收藏按钮 -->
      <button 
        :disabled="isFavorited" 
        :class="['collect-button', { 'disabled': isFavorited }]" 
        @click="favoriteJob"
      >
        {{ isFavorited ? '已收藏' : '收藏' }}
      </button>
	</view>
  </view>
</template>

<script>
import { jobApi } from '@/common/api/job.js'
import { userApi } from '@/common/api/user.js'
import { favoriteApi } from '@/common/api/favorite.js'
import { deliverApi } from '@/common/api/deliver.js'

export default {
  data() {
    return {
      jobId: '',
      jobDetail: {},
      userProfile: null,

      isApplied: false,
      isFavorited: false
    }
  },

  async onLoad(options) {
    if (!options.id) return

    this.jobId = options.id

    // 1️⃣ 获取职位详情
    await this.getJobDetail()

    // 2️⃣ 获取用户信息
    await this.getUserProfile()

    // 3️⃣ 检查收藏状态
    await this.checkFavoriteStatus()

    // 4️⃣ 检查投递状态
    await this.checkDeliverStatus()
  },

  methods: {

    /* ================= 获取职位详情 ================= */
    async getJobDetail() {
      try {
        const res = await jobApi.getJobDetail(this.jobId)
		console.log("转换后的delivers:", res)
		this.jobDetail = res
        if (Array.isArray(res) && res.length > 0) {
          this.jobDetail = res[0]
        } else if (res && typeof res === 'object') {
          this.jobDetail = res
        } else {
          this.jobDetail = {}
        }

        // 解析 JSON 字段
        if (typeof this.jobDetail.require_list === 'string') {
          this.jobDetail.require_list = JSON.parse(this.jobDetail.require_list)
        }

        if (typeof this.jobDetail.welfare_list === 'string') {
          this.jobDetail.welfare_list = JSON.parse(this.jobDetail.welfare_list)
        }

      } catch (error) {
        console.error('获取职位详情失败:', error)
        uni.showToast({ title: '获取详情失败', icon: 'none' })
      }
    },

    /* ================= 获取用户信息 ================= */
    async getUserProfile() {
      try {
        const user = await userApi.getUserProfile()
        
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    },

    /* ================= 点击投递 ================= */
    async applyForJob() {
      if (this.isApplied) return

      if (!this.jobDetail?.boss_job_id) {
        uni.showToast({ title: '职位信息不完整', icon: 'none' })
        return
      }

      try {
        await deliverApi.addDeliver({
          job_id: this.jobDetail.boss_job_id
        })

        this.isApplied = true

        uni.showToast({
          title: '投递成功',
          icon: 'success'
        })

      } catch (error) {
        console.error('投递失败:', error)
        uni.showToast({
          title: error?.data?.message || '投递失败',
          icon: 'none'
        })
      }
    },

    /* ================= 点击收藏 ================= */
    async favoriteJob() {
      if (this.isFavorited) return

      if (!this.jobDetail?.boss_job_id) {
        uni.showToast({ title: '职位信息不完整', icon: 'none' })
        return
      }
		
      try {
        await favoriteApi.addFavorite({
          job_id: this.jobDetail.boss_job_id
        })
		
        
        this.isFavorited = true

        uni.showToast({
          title: '收藏成功',
          icon: 'success'
        })

      } catch (error) {
		  console.log("转换后的collections:",this.jobDetail.boss_job_id)
        console.error('收藏失败:', error)
        uni.showToast({
          title: error?.data?.message || '收藏失败',
          icon: 'none'
        })
      }
    },

    /* ================= 检查收藏状态 ================= */
    async checkFavoriteStatus() {
      if (!this.jobDetail?.boss_job_id) return

      try {
        const res = await favoriteApi.checkFavorite({
          boss_job_id: this.jobDetail.boss_job_id
        })
		
        this.isFavorited = res.is_favorite
		console.log("转换后的collections:")
      } catch (error) {
		  console.log("转换后的collections:",this.jobDetail.boss_job_id)
        console.error('检查收藏状态失败:', error)
      }
    },

    /* ================= 检查投递状态 ================= */
    async checkDeliverStatus() {
      if (!this.jobDetail?.boss_job_id) return

      try {
        const res = await deliverApi.checkDeliver({
          boss_job_id: this.jobDetail.boss_job_id
        })

        this.isApplied = res.is_deliver

      } catch (error) {
        console.error('检查投递状态失败:', error)
      }
    },

    /* ================= 工具方法 ================= */
    getEmpTypeText(type) {
      const map = {
        '1': '全职',
        '2': '兼职',
        '3': '实习'
      }
      return map[type] || '全职'
    },

    formatDate(dateString) {
      if (!dateString) return ''

      const date = new Date(dateString)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const min = String(date.getMinutes()).padStart(2, '0')

      return `${y}-${m}-${d} ${h}:${min}`
    }
  }
}

</script>

<style>
.job-detail-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.job-header {
  background-color: #fff;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
}

.job-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.job-salary {
  font-size: 32rpx;
  color: #ff6b35;
  display: block;
  margin-bottom: 20rpx;
}

.job-requirements {
  display: flex;
  gap: 30rpx;
}

.req-item {
  font-size: 28rpx;
  color: #666;
}

.job-section {
  background-color: #fff;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.comment-count {
  font-size: 24rpx;
  font-weight: normal;
  color: #999;
  margin-left: 10rpx;
}

.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 45rpx;
}/* 任职要求列表 */
.requirement-item {
  display: flex;
  margin-bottom: 10rpx;
  align-items: flex-start;
}

.requirement-number {
  font-weight: bold;
  color: #333;
  margin-right: 10rpx;
  min-width: 30rpx;
}

.requirement-text {
  flex: 1;
  text-align: justify;
}

/* 福利待遇列表 */
.welfare-item {
  display: flex;
  margin-bottom: 10rpx;
  align-items: flex-start;
}

.welfare-icon {
  color: #007aff;
  margin-right: 10rpx;
  min-width: 20rpx;
}

.welfare-text {
  flex: 1;
  text-align: justify;
}

/* 评论计数（已保留但不显示） */
.comment-count {
  display: none;
}

.apply-button-container {
  position: fixed;
  bottom: 20rpx;
  left: 20rpx;
  right: 20rpx;
  padding: 20rpx;
}

.apply-button {
  width: 100%;
  height: 60rpx;
  background-color: #ff6b35;
  color: #fff;
  font-size: 32rpx;
  border: none;
  border-radius: 10rpx;
}

.apply-button.disabled {
  background-color: #ccc;
}

.apply-button:disabled {
  cursor: not-allowed;
}

.apply-collect-buttons {
  display: flex;
  position: fixed;
  bottom: 20rpx;
  left: 20rpx;
  right: 20rpx;
  gap: 10rpx;
}

.apply-button, .collect-button {
  flex: 1;
  height: 60rpx;
  background-color: #ff6b35;
  color: #fff;
  font-size: 32rpx;
  border: none;
  border-radius: 10rpx;
}

.apply-button.disabled, .collect-button.disabled {
  background-color: #ccc;
}

.apply-button:disabled, .collect-button:disabled {
  cursor: not-allowed;
}
</style>