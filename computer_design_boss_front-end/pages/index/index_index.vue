<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-bar">
      <uni-icons type="search" size="30" color="#999"></uni-icons>
      <input type="text" placeholder="搜索职位、公司名称" v-model="keyword" @input="onSearchInput" />
    </view>
    
    <!-- 轮播图 -->
    <swiper :autoplay="true" :interval="3000" :duration="1000" indicator-dots circular>
      <swiper-item v-for="(banner, index) in bannerList" :key="index">
        <image :src="banner.imageUrl" class="banner-img"></image>
      </swiper-item>
    </swiper>
    
    <!-- 分类入口 -->
    <view class="category-section">
      <view class="category-item" v-for="category in categoryList" :key="category.id" @click="goToCategory(category.id)">
        <image :src="category.icon" class="category-icon"></image>
        <text class="category-name">{{ category.name }}</text>
      </view>
    </view>
    
    <!-- 子分类标签区域 -->
    <view v-if="showCategoryTabs && subCategoryList.length > 0" class="sub-category-tabs">
      <view
        class="sub-category-tab"
        v-for="category in subCategoryList"
        :key="category.id"
        @click="selectSubCategory(category.id)"
        :class="{ active: selectedSubCategories.includes(category.id) }"
      >
        <text>{{ category.name }}</text>
      </view>
    </view>
    
    <!-- 推荐职位区域 -->
    <view class="job-section">
      <view class="section-header">
        <text class="section-title">推荐职位</text>
        <text class="more-btn" @click="scrollToJobList">查看更多</text>
      </view>
      
      <!-- 职位列表 -->
      <view class="job-list" ref="jobList">
        <job-card v-for="job in jobList" :key="job.id" :data="job"></job-card>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore" @click="loadMore">
        <text>加载更多</text>
      </view>
    </view>
    
    <!-- 发布职位按钮 -->
    <view class="add-job-btn" @click="goToAddJob">
      <text>+</text>
    </view>
  </view>
</template>

<script>
import jobCard from '@/component/job/job-card.vue'
import { jobApi } from '@/common/api/job.js'

export default {
  components: {
    jobCard
  },
  data() {
    return {
      bannerList: [
        { id: 1, imageUrl: '/static/banner1.png' },
        { id: 2, imageUrl: '/static/banner2.png' },
        { id: 3, imageUrl: '/static/banner3.png' }
      ],
      categoryList: [],
      allCategories: [],
      subCategoryList: [],
      jobList: [],
      allJobs: [],
      hasMore: true,
      currentPage: 1,
      pageSize: 10,
      currentCategory: '',
      currentEmpType: '',
      keyword: '',
      selectedSubCategories: [],
      showCategoryTabs: false
    }
  },
  onLoad() {
    this.getRecommendJobs()
    this.getJobCategories()
  },
  onPullDownRefresh() {
    this.onRefresh()
  },
  methods: {
    async getRecommendJobs() {
      try {
        // 检查网络状态
        const networkType = await new Promise((resolve) => {
          uni.getNetworkType({
            success: (res) => resolve(res.networkType)
          })
        })
        
        if (networkType === 'none') {
          uni.showToast({
            title: '当前无网络连接',
            icon: 'none'
          })
          return
        }
        
        const res = await jobApi.getAllJobs()
        
        let jobsData = []
        
        if (res !== null && res !== undefined) {
            if (Array.isArray(res)) {
                // 如果是数组，直接使用
                jobsData = res
            } else if (typeof res === 'object' && Object.keys(res).length > 0) {
                // 如果是对象，尝试提取其中的数组数据
                if (res.list && Array.isArray(res.list)) {
                    jobsData = res.list
                } else if (res.data && Array.isArray(res.data)) {
                    jobsData = res.data
                } else if (res.jobs && Array.isArray(res.jobs)) {
                    jobsData = res.jobs
                } else {
                    // 如果无法提取数组数据，显示错误信息
                    uni.showToast({
                        title: '获取推荐职位失败: 数据格式错误',
                        icon: 'none'
                    })
                    jobsData = []
                }
            } else {
                // 其他情况显示错误信息
                uni.showToast({
                    title: '获取推荐职位失败: 数据格式错误',
                    icon: 'none'
                })
                jobsData = []
            }
        } else {
            // 没有数据返回，显示错误信息
            uni.showToast({
                title: '获取推荐职位失败: 后端无数据返回',
                icon: 'none'
            })
            jobsData = []
        }
        
        // 如果从后端获取的数据为空，使用模拟数据
        if (jobsData.length === 0) {
            console.log('从后端获取的数据为空，使用模拟数据')
            jobsData = this.getMockJobsData()
        }
        
        // 检查数据情况
        console.log('jobsData的类型:', typeof jobsData)
        console.log('jobsData是否为数组:', Array.isArray(jobsData))
        console.log('jobsData的长度:', jobsData.length)
        
        // 处理职位数据，确保category_id为数字类型
        jobsData = jobsData.map(job => ({
            ...job,
            category_id: job.category_id && job.category_id !== '' ? Number(job.category_id) : null
        }))
        
        // 存储所有职位数据，用于本地搜索和筛选
        this.allJobs = jobsData
        this.jobList = jobsData
        
        // 添加更多调试信息
        console.log('存储的所有职位:', this.allJobs)
        console.log('allJobs的类型:', typeof this.allJobs)
        console.log('allJobs是否为数组:', Array.isArray(this.allJobs))
        console.log('allJobs的长度:', this.allJobs.length)
        console.log('jobList的长度:', this.jobList.length)
        if (this.allJobs.length > 0) {
          console.log('第一个职位的数据结构:', this.allJobs[0])
          console.log('第一个职位的分类ID:', this.allJobs[0].category_id)
          console.log('分类ID类型:', typeof this.allJobs[0].category_id)
        }
        
      } catch (error) {
        this.allJobs = []
        this.jobList = []
        console.error('获取推荐职位失败:', error)
        console.error('错误详情:', error.message, error.stack)
        
        // 根据错误类型显示不同的提示信息
        if (error.message && error.message.includes('Packet sequence number wrong')) {
          uni.showToast({
            title: '网络连接异常，请稍后重试',
            icon: 'none'
          })
        } else {
          uni.showToast({
            title: '获取推荐职位失败',
            icon: 'none'
          })
        }
      }
    },
    
    goToCategory(categoryId) {
        this.currentCategory = categoryId
        
        // 根据实际数据库结构重新定义大类映射
        // 101-108: 技术开发类, 200系列: 产品与设计类, 300系列: 技术管理类
        const techCategories = [101, 102, 103, 104, 105, 106, 107, 108]
        const designCategories = [200, 201, 202, 203, 204, 205] // 根据数据库实际数据
        const manageCategories = [300, 301, 302, 303] // 根据数据库实际数据
        
        // 检查是否为技术开发类（包括主分类101）
        if (categoryId === '101' || techCategories.includes(Number(categoryId))) {
            this.showCategoryTabs = true
            // 获取技术开发的子分类（实际数据库中的具体分类）
            this.subCategoryList = this.allCategories.filter(category => 
                techCategories.includes(Number(category.id))
            )
            console.log('技术开发子分类:', this.subCategoryList)
        } else {
            this.showCategoryTabs = false
            this.subCategoryList = []
        }
        
        // 重置筛选条件
        this.selectedSubCategories = []
        this.keyword = ''
        
        // 调用后端API获取对应分类的职位数据
        this.getJobsByCategory(categoryId)
    },
    
    // 根据分类获取职位数据
    async getJobsByCategory(categoryId) {
        try {
            // 检查网络状态
            const networkType = await new Promise((resolve) => {
                uni.getNetworkType({
                    success: (res) => resolve(res.networkType)
                })
            })
            
            if (networkType === 'none') {
                uni.showToast({
                    title: '当前无网络连接',
                    icon: 'none'
                })
                return
            }
            
            // 直接调用后端API获取职位数据
            const res = await jobApi.getJobsByCategory(categoryId)
            
            let jobsData = []
            
            if (res !== null && res !== undefined) {
                if (Array.isArray(res)) {
                    // 如果是数组，直接使用
                    jobsData = res
                } else if (typeof res === 'object' && Object.keys(res).length > 0) {
                    // 如果是对象，尝试提取其中的数组数据
                    if (res.list && Array.isArray(res.list)) {
                        jobsData = res.list
                    } else if (res.data && Array.isArray(res.data)) {
                        jobsData = res.data
                    } else if (res.jobs && Array.isArray(res.jobs)) {
                        jobsData = res.jobs
                    } else {
                        // 如果无法提取数组数据，显示错误信息
                        uni.showToast({
                            title: '获取职位失败: 数据格式错误',
                            icon: 'none'
                        })
                        jobsData = []
                    }
                } else {
                    // 其他情况显示错误信息
                    uni.showToast({
                        title: '获取职位失败: 数据格式错误',
                        icon: 'none'
                    })
                    jobsData = []
                }
            } else {
                // 没有数据返回，显示错误信息
                uni.showToast({
                    title: '获取职位失败: 后端无数据返回',
                    icon: 'none'
                })
                jobsData = []
            }
            
            // 处理职位数据，确保category_id为数字类型
            jobsData = jobsData.map(job => ({
                ...job,
                category_id: job.category_id && job.category_id !== '' ? Number(job.category_id) : null
            }))
            
            // 存储所有职位数据，用于本地搜索和筛选
            this.allJobs = jobsData
            this.jobList = jobsData
            
            console.log('获取到的职位数据:', jobsData.length, '条')
            if (jobsData.length > 0) {
                console.log('示例职位:', jobsData[0])
            }
            
        } catch (error) {
            this.allJobs = []
            this.jobList = []
            console.error('获取职位失败:', error)
            
            // 显示错误信息
            uni.showToast({
                title: '获取职位失败',
                icon: 'none'
            })
        }
    },
    
    // 选择子分类
    selectSubCategory(categoryId) {
      // 将categoryId转换为数字类型，确保类型一致
      const numCategoryId = Number(categoryId)
      const index = this.selectedSubCategories.indexOf(numCategoryId)
      
      if (index === -1) {
        this.selectedSubCategories.push(numCategoryId)
      } else {
        this.selectedSubCategories.splice(index, 1)
      }
      
      console.log('选择的子分类:', this.selectedSubCategories)
      // 应用筛选
      this.applyFilters()
    },
    
    // 搜索输入事件
    onSearchInput() {
      this.applyFilters()
    },
    
    // 应用所有筛选条件
    applyFilters() {
      let filteredJobs = [...this.allJobs]
      
      // 应用分类筛选
      if (this.currentCategory) {
        // 根据实际数据库结构处理分类筛选
        const currentCatNum = Number(this.currentCategory)
        
        // 定义实际的大类分组（基于数据库中的真实分类ID）
        const techCategories = [101, 102, 103, 104, 105, 106, 107, 108] // 技术开发类
        const designCategories = [200, 201, 202, 203, 204, 205] // 产品与设计类  
        const manageCategories = [300, 301, 302, 303] // 技术管理类
        
        filteredJobs = filteredJobs.filter(job => {
          // 确保job存在且有有效的category_id
          if (!job || job.category_id === null) {
            return false
          }
          
          const jobCategoryId = job.category_id
          
          // 如果选择了技术开发类且有子分类筛选
          if (techCategories.includes(currentCatNum) && this.selectedSubCategories.length > 0) {
            return this.selectedSubCategories.includes(jobCategoryId)
          } else {
            // 检查是否是大类ID或其子分类ID
            // 对于大类分组，检查职位分类是否属于该分组
            if (techCategories.includes(currentCatNum)) {
              return techCategories.includes(jobCategoryId)
            } else if (designCategories.includes(currentCatNum)) {
              return designCategories.includes(jobCategoryId)
            } else if (manageCategories.includes(currentCatNum)) {
              return manageCategories.includes(jobCategoryId)
            } else {
              // 对于具体分类ID，直接匹配
              return jobCategoryId === currentCatNum
            }
          }
        })
      }
      
      // 应用关键词搜索
      console.log('=== 应用关键词搜索 ===')
      console.log('当前关键词:', this.keyword)
      if (this.keyword) {
        const beforeCount = filteredJobs.length
        const keywordLower = this.keyword.toLowerCase()
        filteredJobs = filteredJobs.filter(job => {
          const titleMatch = job.title && job.title.toLowerCase().includes(keywordLower)
          const companyMatch = job.company && job.company.toLowerCase().includes(keywordLower)
          const descriptionMatch = job.description && job.description.toLowerCase().includes(keywordLower)
          const isMatch = titleMatch || companyMatch || descriptionMatch
          console.log('职位:', job.title, '匹配结果:', isMatch)
          return isMatch
        })
        console.log(`关键词搜索后职位数: ${beforeCount} → ${filteredJobs.length}`)
      }
      
      // 更新职位列表
      console.log('=== 更新职位列表 ===')
      console.log('最终筛选结果:', filteredJobs.length)
      this.jobList = filteredJobs
      console.log('jobList长度:', this.jobList.length)
      console.log('=== 应用筛选结束 ===')
    },
    
    scrollToJobList() {
      uni.pageScrollTo({
        selector: '.job-list',
        duration: 300
      })
    },
    
    loadMore() {
      // 加载更多逻辑
      this.currentPage++
      // 这里可以实现分页加载
    },
    
    onRefresh() {
      // 下拉刷新逻辑
      this.currentPage = 1
      this.getRecommendJobs()
      this.getJobCategories()
      uni.stopPullDownRefresh()
    },
    
    // 跳转到发布职位页面
    goToAddJob() {
      uni.navigateTo({
        url: '/pages/job/add/job_add_index'
      })
    },
    
    getJobCategories() {
      // 根据实际数据库结构定义主分类
      // 注意：数据库中的分类是扁平的，我们需要将相关的分类组合成大类
      const mainCategories = [
        { id: '101', name: '技术开发', icon: '/static/category/tech.png' },
        { id: '200', name: '产品与设计', icon: '/static/category/design.png' },
        { id: '300', name: '技术管理', icon: '/static/category/product.png' }
      ]
      
      // 尝试从后端获取数据，如果成功则处理后使用，否则使用固定数据
      jobApi.getJobCategories()
        .then(res => {
          if (res && Array.isArray(res)) {
            // 存储所有分类数据
            this.allCategories = res
            
            // 由于数据库中的分类是扁平的，我们直接使用主分类
            this.categoryList = mainCategories
            
            // 确保allCategories包含技术开发的子分类
            this.ensureTechSubCategories()
          } else {
            // 如果后端API有问题，使用固定数据
            this.categoryList = mainCategories
            
            // 生成模拟的子分类数据
            this.generateMockSubCategories()
          }
        })
        .catch(error => {
          console.error('获取职位分类失败:', error)
          // 使用固定数据作为备选方案
          this.categoryList = mainCategories
          
          // 生成模拟的子分类数据
          this.generateMockSubCategories()
        })
    },
    
    // 确保allCategories包含技术开发的子分类
    ensureTechSubCategories() {
      // 技术开发的子分类
      const techSubCategories = [
        { id: 101, name: '前端开发', parent_id: null },
        { id: 102, name: '后端开发', parent_id: null },
        { id: 103, name: '移动开发', parent_id: null },
        { id: 104, name: '人工智能', parent_id: null },
        { id: 105, name: '大数据', parent_id: null },
        { id: 106, name: '云计算', parent_id: null },
        { id: 107, name: '网络安全', parent_id: null },
        { id: 108, name: '嵌入式开发', parent_id: null }
      ]
      
      // 检查是否已包含这些分类
      const existingIds = this.allCategories.map(cat => Number(cat.id))
      
      // 添加缺失的技术开发子分类
      techSubCategories.forEach(subCat => {
        if (!existingIds.includes(subCat.id)) {
          this.allCategories.push(subCat)
        }
      })
    },
    
    // 生成模拟的子分类数据（当后端没有返回时使用）
    generateMockSubCategories() {
      // 根据实际数据库结构生成模拟数据
      this.allCategories = [
        // 技术开发类（101-108）
        { id: 101, name: '前端开发', parent_id: null },
        { id: 102, name: '后端开发', parent_id: null },
        { id: 103, name: '移动开发', parent_id: null },
        { id: 104, name: '人工智能', parent_id: null },
        { id: 105, name: '大数据', parent_id: null },
        { id: 106, name: '云计算', parent_id: null },
        { id: 107, name: '网络安全', parent_id: null },
        { id: 108, name: '嵌入式开发', parent_id: null },
        // 产品与设计类（200系列）
        { id: 200, name: '产品经理', parent_id: null },
        { id: 201, name: 'UI设计师', parent_id: null },
        { id: 202, name: '交互设计师', parent_id: null },
        { id: 203, name: 'UX研究员', parent_id: null },
        // 技术管理类（300系列）
        { id: 300, name: '技术经理', parent_id: null },
        { id: 301, name: '架构师', parent_id: null },
        { id: 302, name: '研发总监', parent_id: null },
        { id: 303, name: 'CTO', parent_id: null }
      ]
    },
    
    getCategoryIcon(categoryId) {
      // 根据实际分类ID返回对应的图标名称
      const iconMap = {
        // 技术开发类（101-108）
        '101': 'tech',     // 前端开发
        '102': 'tech',     // 后端开发  
        '103': 'tech',     // 移动开发
        '104': 'tech',     // 人工智能
        '105': 'tech',     // 大数据
        '106': 'tech',     // 云计算
        '107': 'tech',     // 网络安全
        '108': 'tech',     // 嵌入式开发
        // 产品与设计类（200系列）
        '200': 'design',   // 产品经理
        '201': 'design',   // UI设计师
        '202': 'design',   // 交互设计师
        '203': 'design',   // UX研究员
        // 技术管理类（300系列）
        '300': 'product',  // 技术经理
        '301': 'product',  // 架构师
        '302': 'product',  // 研发总监
        '303': 'product',  // CTO
        // 兼容旧的小类ID
        '1001': 'tech',    // 技术小类
        '1002': 'design',  // 设计小类
        '1003': 'market'   // 市场小类
      }
      return iconMap[categoryId] || 'tech'
    },
    
    // 生成模拟职位数据
    getMockJobsData() {
      console.log('调用getMockJobsData方法')
      const mockData = [
        // 技术开发类（101-108）
        { id: 1, title: '前端开发工程师', company: '科技有限公司', category_id: 101, emp_type: 1, description: '负责公司网站前端开发，使用Vue框架' },
        { id: 2, title: '后端开发工程师', company: '互联网科技', category_id: 102, emp_type: 1, description: '负责Java后端开发，熟悉Spring框架' },
        { id: 3, title: '移动端开发工程师', company: '移动科技', category_id: 103, emp_type: 1, description: '负责React Native移动应用开发' },
        { id: 4, title: '人工智能工程师', company: 'AI科技', category_id: 104, emp_type: 1, description: '负责机器学习模型开发' },
        { id: 5, title: '大数据工程师', company: '数据科技', category_id: 105, emp_type: 1, description: '负责大数据平台开发' },
        { id: 6, title: '云计算工程师', company: '云服务', category_id: 106, emp_type: 1, description: '负责云平台架构设计' },
        { id: 7, title: '网络安全工程师', company: '安全科技', category_id: 107, emp_type: 1, description: '负责网络安全防护' },
        { id: 8, title: '嵌入式开发工程师', company: '硬件科技', category_id: 108, emp_type: 1, description: '负责嵌入式系统开发' },
        // 产品与设计类（200系列）
        { id: 9, title: '产品经理', company: '产品科技', category_id: 200, emp_type: 1, description: '负责产品规划和需求分析' },
        { id: 10, title: 'UI设计师', company: '设计工作室', category_id: 201, emp_type: 2, description: '负责产品UI设计，熟悉Figma工具' },
        { id: 11, title: '交互设计师', company: '用户体验', category_id: 202, emp_type: 1, description: '负责交互设计和原型制作' },
        { id: 12, title: 'UX研究员', company: '用户研究', category_id: 203, emp_type: 2, description: '负责用户调研和数据分析' },
        // 技术管理类（300系列）
        { id: 13, title: '技术经理', company: '管理团队', category_id: 300, emp_type: 1, description: '负责技术团队管理' },
        { id: 14, title: '架构师', company: '架构团队', category_id: 301, emp_type: 1, description: '负责系统架构设计' },
        { id: 15, title: '研发总监', company: '研发管理', category_id: 302, emp_type: 1, description: '负责研发部门管理' },
        { id: 16, title: 'CTO', company: '技术领导', category_id: 303, emp_type: 1, description: '负责公司技术战略' }
      ]
      console.log('模拟数据生成成功，长度:', mockData.length)
      console.log('模拟数据:', mockData)
      return mockData
    }
  }
}
</script>

<style>
.container {
  padding: 0 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 15rpx 20rpx;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.search-text {
  margin-left: 15rpx;
  color: #999;
  font-size: 28rpx;
}

.banner-img {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
}

.category-section {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 30rpx 0;
  margin: 20rpx 0;
  border-radius: 10rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
}

.category-name {
  font-size: 26rpx;
  color: #333;
}

.job-section {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.more-btn {
  font-size: 26rpx;
  color: #999;
}

.job-list {
  margin-bottom: 20rpx;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999;
}

/* 子分类标签区域 */
.sub-category-tabs {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.sub-category-tab {
  padding: 15rpx 30rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.sub-category-tab.active {
  background-color: #007aff;
  color: #fff;
}

/* 就业类型筛选区域 */
.emp-type-section {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
  display: flex;
  justify-content: space-around;
}

.emp-type-item {
  padding: 15rpx 30rpx;
  font-size: 28rpx;
  color: #333;
}

.emp-type-item.active {
  color: #007aff;
  border-bottom: 2rpx solid #007aff;
}

/* 搜索栏样式 */
.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 15rpx 20rpx;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.search-bar input {
  flex: 1;
  margin-left: 15rpx;
  font-size: 28rpx;
}

/* 发布职位按钮 */
.add-job-btn {
  position: fixed;
  bottom: 80rpx;
  right: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120rpx;
  height: 120rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 60rpx;
  border-radius: 50%;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.3);
  z-index: 999;
}

.btn-text {
  font-size: 20rpx;
  position: absolute;
  bottom: 15rpx;
}
</style>