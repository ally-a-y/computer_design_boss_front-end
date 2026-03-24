<template>
  <view class="job-detail-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <uni-icons type="back" size="28" class="nav-back-icon" @click="goBack"></uni-icons>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">职位详情</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 职位核心信息区 -->
    <view class="job-header">
      <text class="job-title">{{ jobDetail?.title || '暂无职位信息' }}</text>
      <view class="salary-container">
        <text class="job-salary">{{ jobDetail?.salary_min ? `${(jobDetail.salary_min/1000).toFixed(0)}k-${jobDetail?.salary_max ? (jobDetail.salary_max/1000).toFixed(0) : '?' }k` : '薪资面议' }}</text>
        <text class="salary-unit">· 每月</text>
      </view>
      
      <view class="company-info">
        <text class="company-name">{{ jobDetail?.company || '未知公司' }}</text>
        <text class="company-separator">·</text>
        <text class="company-tag">已认证</text>
      </view>
      
      <view class="job-tags">
        <text class="job-tag">{{ jobDetail?.edu_req || '学历不限' }}</text>
        <text class="job-tag">{{ jobDetail?.exp_req || '经验不限' }}</text>
        <text class="job-tag">{{ jobDetail?.emp_type ? getEmpTypeText(jobDetail.emp_type) : '全职' }}</text>
      </view>
    </view>
    
    <!-- 工作地址 -->
    <view class="address-section" v-if="jobDetail?.address">
      <view class="address-content">
        <uni-icons type="location" size="24" color="#007aff" class="address-icon"></uni-icons>
        <text class="address-text">{{ jobDetail.district || '' }} {{ jobDetail.address }}</text>
        <uni-icons type="copy" size="20" color="#6C757D" class="address-action"></uni-icons>
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
            <text class="requirement-dot"></text>
            <text class="requirement-text">{{ req }}</text>
          </view>
        </view>
        <text v-else>{{ jobDetail?.require_list || '暂无要求' }}</text>
      </view>
    </view>
    
    <!-- 福利待遇 -->
    <view class="job-section" v-if="jobDetail?.welfare_list">
      <view class="section-title">福利待遇</view>
      <view class="section-content">
        <view v-if="Array.isArray(jobDetail?.welfare_list) && jobDetail.welfare_list.length > 0">
          <view v-for="(welfare, index) in jobDetail.welfare_list" :key="index" class="welfare-item">
            <text class="welfare-dot"></text>
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
    
    <!-- 底部固定操作栏 -->
    <view class="bottom-bar">
      <button 
        :class="['collect-button', { 'collected': isFavorited }]" 
        @click="favoriteJob"
      >
        <uni-icons :type="isFavorited ? 'star-filled' : 'star'" size="24" :color="isFavorited ? '#007aff' : '#6C757D'" class="collect-icon"></uni-icons>
        <text :class="['collect-text', { 'collected': isFavorited }]">{{ isFavorited ? '已收藏' : '收藏' }}</text>
      </button>
      <button 
        :class="['apply-button', { 'applied': isApplied }]" 
        :disabled="isApplied"
        @click="applyForJob"
      >
        {{ isApplied ? '已投递' : '投递' }}
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
    /* ================= 导航方法 ================= */
    goBack() {
      uni.navigateBack()
    },
    
    shareJob() {
      uni.showShareMenu({
        withShareTicket: true
      })
    },

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
        
        // 确保boss_job_id存在，使用id作为备选
        if (!this.jobDetail.boss_job_id && this.jobDetail.id) {
          this.jobDetail.boss_job_id = this.jobDetail.id
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
        console.log('从API获取用户信息:', user)
        this.userProfile = user
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 尝试从本地存储获取用户信息
        const userInfoStr = uni.getStorageSync('userInfo')
        console.log('从本地存储获取用户信息:', userInfoStr)
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr)
            console.log('解析后的用户信息:', userInfo)
            this.userProfile = userInfo
          } catch (parseError) {
            console.error('解析用户信息失败:', parseError)
          }
        }
      }
      console.log('最终用户信息:', this.userProfile)
    },

    /* ================= 点击投递 ================= */
    applyForJob() {
      // 使用boss_job_id作为主要ID，如果不存在则使用id
      const jobId = this.jobDetail?.boss_job_id || this.jobDetail?.id
      if (!jobId) {
        uni.showToast({ title: '职位信息不完整', icon: 'none' })
        return
      }

      // 获取当前投递列表
      let delivers = uni.getStorageSync('delivers') || []
      
      if (this.isApplied) {
        // 取消投递
        delivers = delivers.filter(item => item.id !== jobId)
        this.isApplied = false
        uni.showToast({
          title: '已取消投递',
          icon: 'success'
        })
      } else {
        // 添加投递
        const newDeliver = {
          id: jobId,
          jobTitle: this.jobDetail.title,
          company: this.jobDetail.company || '未知公司',
          salary: this.jobDetail.salary || '',
          deliverTime: new Date().toLocaleString(),
          status: 'pending',
          statusText: '待处理'
        }
        delivers.push(newDeliver)
        this.isApplied = true
        uni.showToast({
          title: '投递成功',
          icon: 'success'
        })
      }
      
      // 保存投递列表
      uni.setStorageSync('delivers', delivers)
    },

    /* ================= 点击收藏 ================= */
    favoriteJob() {
      if (!this.jobDetail?.boss_job_id) {
        uni.showToast({ title: '职位信息不完整', icon: 'none' })
        return
      }
		
      // 获取当前收藏列表
      let collections = uni.getStorageSync('collections') || []
      
      if (this.isFavorited) {
        // 取消收藏
        collections = collections.filter(item => item.id !== this.jobDetail.boss_job_id)
        this.isFavorited = false
        uni.showToast({
          title: '已取消收藏',
          icon: 'success'
        })
      } else {
        // 检查是否已经收藏
        const isAlreadyFavorited = collections.some(item => item.id === this.jobDetail.boss_job_id)
        if (isAlreadyFavorited) {
          uni.showToast({
            title: '该职位已收藏',
            icon: 'none'
          })
          return
        }
        // 添加收藏
        const newCollection = {
          id: this.jobDetail.boss_job_id,
          jobTitle: this.jobDetail.title,
          company: this.jobDetail.company || '未知公司',
          salary: this.jobDetail.salary || '',
          collectionTime: new Date().toLocaleString()
        }
        collections.push(newCollection)
        this.isFavorited = true
        uni.showToast({
          title: '收藏成功',
          icon: 'success'
        })
      }
      
      // 保存收藏列表
      uni.setStorageSync('collections', collections)
      
      // 触发自定义事件，通知父组件更新收藏状态
      this.$emit('update:favorited', this.isFavorited)
    },

    /* ================= 检查收藏状态 ================= */
    checkFavoriteStatus() {
      if (!this.jobDetail?.boss_job_id) return

      // 从本地存储获取收藏列表
      const collections = uni.getStorageSync('collections') || []
      this.isFavorited = collections.some(item => item.id === this.jobDetail.boss_job_id)
    },

    /* ================= 检查投递状态 ================= */
    checkDeliverStatus() {
      // 使用boss_job_id作为主要ID，如果不存在则使用id
      const jobId = this.jobDetail?.boss_job_id || this.jobDetail?.id
      if (!jobId) return

      // 从本地存储获取投递列表
      const delivers = uni.getStorageSync('delivers') || []
      this.isApplied = delivers.some(item => item.id === jobId)
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
/* 全局样式 */
.job-detail-page {
  background-color: #F8FAFD;
  min-height: 100vh;
  padding: 0 0 100rpx 0;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

/* 导航栏样式 */
.nav-bar {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
  margin-bottom: 12rpx;
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
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
}

.nav-bar-right {
  flex: 0 0 auto;
  padding: 8px;
}

.nav-back-icon {
  color: #1E1E1E;
  transition: all 0.3s ease;
}

.nav-back-icon:active {
  color: #007aff;
}



/* 职位核心信息区 */
.job-header {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin: 12px 12px 0 12px;
}

.job-title {
  font-size: 20px;
  font-weight: bold;
  color: #1E1E1E;
  line-height: 1.3;
  margin-bottom: 12px;
  display: block;
}

.salary-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
}

.job-salary {
  font-size: 24px;
  font-weight: bold;
  color: #007aff;
  margin-right: 8px;
}

.salary-unit {
  font-size: 12px;
  color: #6C757D;
}

.company-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.company-name {
  font-size: 16px;
  font-weight: 500;
  color: #1E1E1E;
  margin-right: 8px;
}

.company-separator {
  margin: 0 8px;
  color: #6C757D;
}

.company-tag {
  font-size: 14px;
  color: #6C757D;
}

.job-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.job-tag {
  background-color: #F0F4FF;
  color: #007aff;
  font-size: 14px;
  padding: 6px 10px;
  border-radius: 16px;
}

/* 工作地址 */
.address-section {
  background-color: #F2F5F9;
  margin: 12px;
  border-radius: 12px;
  padding: 16px;
}

.address-content {
  display: flex;
  align-items: center;
}

.address-icon {
  margin-right: 12px;
}

.address-text {
  flex: 1;
  font-size: 15px;
  color: #1E1E1E;
  line-height: 1.4;
}

.address-action {
  margin-left: 12px;
}

.address-action:active {
  opacity: 0.7;
}

/* 通用卡片样式 */
.job-section {
  background-color: #fff;
  margin: 12px;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 8px;
  padding-left: 12px;
  border-left: 3px solid #007aff;
  display: block;
}

.section-content {
  font-size: 15px;
  color: #3A3A3A;
  line-height: 1.6;
}

/* 任职要求列表 */
.requirement-item {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.requirement-dot {
  width: 6px;
  height: 6px;
  background-color: #007aff;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 6px;
  flex-shrink: 0;
}

.requirement-text {
  flex: 1;
  text-align: justify;
}

/* 福利待遇列表 */
.welfare-item {
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
}

.welfare-dot {
  width: 6px;
  height: 6px;
  background-color: #007aff;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 6px;
  flex-shrink: 0;
}

.welfare-text {
  flex: 1;
  text-align: justify;
}

/* 底部固定操作栏 */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: #fff;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 100;
  border-top: 1px solid #F0F0F0;
  gap: 16px;
}

.collect-button {
  flex: 0 0 120px;
  height: 52px;
  background-color: #F5F5F5;
  border: none;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.collect-button:active {
  background-color: #E8E8E8;
  transform: scale(0.98);
}

.collect-button.collected {
  background-color: #E3F2FD;
}

.collect-icon {
  margin-right: 2px;
}

.collect-text {
  font-size: 14px;
  color: #6C757D;
  font-weight: 500;
}

.collect-button.collected .collect-text {
  color: #007aff;
}

.apply-button {
  flex: 1;
  height: 52px;
  background-color: #007aff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.apply-button:active:not(.applied) {
  background-color: #0056b3;
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.apply-button.applied {
  background-color: #E3F2FD;
  color: #007aff;
  box-shadow: none;
}

.apply-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>