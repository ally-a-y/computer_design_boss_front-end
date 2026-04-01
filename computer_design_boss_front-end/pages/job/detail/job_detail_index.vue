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
      <view class="section-title">
        <view class="title-dot"></view>
        <text>职位描述</text>
      </view>
      <view class="section-content">
        <text>{{ jobDetail?.description || '暂无描述' }}</text>
      </view>
    </view>
    
    <!-- 任职要求 -->
    <view class="job-section">
      <view class="section-title">
        <view class="title-dot"></view>
        <text>任职要求</text>
      </view>
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
      <view class="section-title">
        <view class="title-dot"></view>
        <text>福利待遇</text>
      </view>
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
      <view class="section-title">
        <view class="title-dot"></view>
        <text>薪资详情</text>
      </view>
      <view class="section-content">
        <text>{{ jobDetail.salary_desc }}</text>
      </view>
    </view>
    
    <!-- 发布时间 -->
    <view class="job-section" v-if="jobDetail?.publish_time">
      <view class="section-title">
        <view class="title-dot"></view>
        <text>发布时间</text>
      </view>
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
      // 统一使用id作为职位标识，与职位列表页面保持一致
      const jobId = this.jobDetail?.id
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
        // 检查是否已经投递
        const isAlreadyApplied = delivers.some(item => item.id === jobId)
        if (isAlreadyApplied) {
          uni.showToast({
            title: '该职位已投递',
            icon: 'none'
          })
          return
        }
        // 添加投递
        const newDeliver = {
          id: jobId,
          jobTitle: this.jobDetail.title,
          company: this.jobDetail.company || '未知公司',
          salary: this.formatSalary(this.jobDetail.salary_min, this.jobDetail.salary_max),
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
      // 统一使用id作为职位标识，与职位列表页面保持一致
      const jobId = this.jobDetail?.id
      if (!jobId) {
        uni.showToast({ title: '职位信息不完整', icon: 'none' })
        return
      }
		
      // 获取当前收藏列表
      let collections = uni.getStorageSync('collections') || []
      
      if (this.isFavorited) {
        // 取消收藏
        collections = collections.filter(item => item.id !== jobId)
        this.isFavorited = false
        uni.showToast({
          title: '已取消收藏',
          icon: 'success'
        })
      } else {
        // 检查是否已经收藏
        const isAlreadyFavorited = collections.some(item => item.id === jobId)
        if (isAlreadyFavorited) {
          uni.showToast({
            title: '该职位已收藏',
            icon: 'none'
          })
          return
        }
        // 添加收藏
        const newCollection = {
          id: jobId,
          jobTitle: this.jobDetail.title,
          company: this.jobDetail.company || '未知公司',
          salary: this.formatSalary(this.jobDetail.salary_min, this.jobDetail.salary_max),
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
      const jobId = this.jobDetail?.id
      if (!jobId) return

      // 从本地存储获取收藏列表
      const collections = uni.getStorageSync('collections') || []
      this.isFavorited = collections.some(item => item.id === jobId)
    },

    /* ================= 检查投递状态 ================= */
    checkDeliverStatus() {
      const jobId = this.jobDetail?.id
      if (!jobId) return

      // 从本地存储获取投递列表
      const delivers = uni.getStorageSync('delivers') || []
      this.isApplied = delivers.some(item => item.id === jobId)
    },

    /* ================= 格式化薪资 ================= */
    formatSalary(min, max) {
      if (min && max) {
        // 处理后端返回的Decimal类型数据，转换为数字
        const minNum = typeof min === 'number' ? min : parseFloat(min)
        const maxNum = typeof max === 'number' ? max : parseFloat(max)
        return `${(minNum/1000).toFixed(0)}-${(maxNum/1000).toFixed(0)}K`
      }
      return '薪资面议'
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
  background: linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 80px 0 100rpx 0;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
  box-sizing: border-box;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8));
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
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  color: #4facfe;
}



/* 职位核心信息区 */
.job-header {
  background: linear-gradient(135deg, #ffffff, #f8faff);
  padding: 20px;
  margin-bottom: 12px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  margin: 12px 12px 0 12px;
  position: relative;
  overflow: hidden;
}

.job-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, #4facfe, #00f2fe, transparent);
  border-radius: 0 0 16px 16px;
}

.job-title {
  font-size: 20px;
  font-weight: bold;
  color: #1E1E1E;
  line-height: 1.3;
  margin-bottom: 12px;
  display: block;
  background: linear-gradient(90deg, #1E1E1E, #4a4a4a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.salary-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
}

.job-salary {
  font-size: 24px;
  font-weight: bold;
  margin-right: 8px;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  font-size: 14px;
  padding: 6px 10px;
  border-radius: 16px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.job-tag:nth-child(1) {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  color: #fff;
}

.job-tag:nth-child(2) {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #333;
}

.job-tag:nth-child(3) {
  background: linear-gradient(135deg, #fad0c4, #ffd1ff);
  color: #333;
}

/* 工作地址 */
.address-section {
  background: rgba(255, 255, 255, 0.8);
  margin: 12px;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.address-content {
  display: flex;
  align-items: center;
}

.address-icon {
  margin-right: 12px;
  color: #4facfe;
}

.address-text {
  flex: 1;
  font-size: 15px;
  color: #1E1E1E;
  line-height: 1.4;
}

.address-action {
  margin-left: 12px;
  color: #4facfe;
}

.address-action:active {
  opacity: 0.7;
  transform: scale(0.95);
}

/* 通用卡片样式 */
.job-section {
  background: rgba(255, 255, 255, 0.8);
  margin: 12px;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.job-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4facfe, #00f2fe, transparent);
  border-radius: 0 0 16px 16px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
}

.title-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 50%;
  margin-right: 8px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(79, 172, 254, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0);
  }
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
  background: linear-gradient(135deg, #4facfe, #00f2fe);
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
  background: linear-gradient(135deg, #4facfe, #00f2fe);
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(230, 240, 255, 0.8));
  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 100;
  border-top: 1px solid rgba(79, 172, 254, 0.1);
  gap: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.collect-button {
  flex: 0 0 120px;
  height: 52px;
  background: linear-gradient(135deg, #ffffff, #f8faff);
  border: none;
  border-radius: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.collect-button:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.collect-button.collected {
  background: linear-gradient(135deg, #E3F2FD, #F0F8FF);
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
  color: #4facfe;
}

.apply-button {
  flex: 1;
  height: 52px;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
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
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
}

.apply-button:active:not(.applied) {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.4);
}

.apply-button.applied {
  background: linear-gradient(135deg, #E3F2FD, #F0F8FF);
  color: #4facfe;
  box-shadow: none;
}

.apply-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>