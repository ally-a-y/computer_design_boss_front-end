<template>
  <view class="container" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航 -->
    <view class="nav-bar" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="nav-bar-left">
        <!-- 左侧预留空间 -->
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">首页</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 顶部搜索栏 -->
    <view class="search-bar" :style="{ background: isDarkMode ? '#2c2c2c' : 'rgba(255, 255, 255, 0.8)' }">
      <uni-icons type="search" size="30" :color="isDarkMode ? '#999' : '#999'"></uni-icons>
      <input type="text" id="search-keyword" name="keyword" placeholder="搜索职位、公司名称" v-model="keyword" @input="onSearchInput" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }" />
    </view>
    
    <!-- 轮播图 -->
    <swiper :autoplay="true" :interval="3000" :duration="1000" indicator-dots circular>
      <swiper-item v-for="(banner, index) in bannerList" :key="index">
        <image :src="banner.imageUrl" class="banner-img"></image>
      </swiper-item>
    </swiper>
    
    <!-- 分类入口 -->
    <view class="category-section" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="category-item" v-for="category in categoryList" :key="category.id" @click="goToCategory(category.id)">
        <image :src="category.icon" class="category-icon"></image>
        <text class="category-name" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ category.name }}</text>
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
        :style="{ background: isDarkMode ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)', color: '#007aff' }"
      >
        <text>{{ category.name }}</text>
      </view>
    </view>
    
    <!-- 推荐职位区域 -->
    <view class="job-section" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="section-header">
        <view class="title-container">
          <view class="title-dot"></view>
          <text class="section-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ categoryName || '推荐职位' }}</text>
        </view>
        <text class="more-btn" @click="scrollToJobList">查看更多</text>
      </view>
      
      <!-- 职位列表 -->
      <view class="job-list" ref="jobList">
        <job-card v-for="job in jobList" :key="job.id" :data="job" :is-dark="isDarkMode"></job-card>
      </view>
      
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore" @click="loadMore" :style="{ color: isDarkMode ? '#999' : '#999' }">
        <text>加载更多</text>
      </view>
    </view>
    
    
  </view>
</template>

<script>
import jobCard from '@/component/job/job-card.vue'
import { jobApi } from '@/common/api/job.js'
import { themeMixin } from '@/common/mixins/themeMixin.js'

export default {
  mixins: [themeMixin],
  components: {
    jobCard
  },
  data() {
    // 定义分类常量，避免重复定义
    const techCategories = [101, 102, 103, 104, 105, 106, 107, 108] // 技术开发类
    const designCategories = [200, 201, 202, 203, 204, 205] // 产品与设计类
    const manageCategories = [300, 301, 302, 303] // 技术管理类
    
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
      showCategoryTabs: false,
      categoryName: '',
      // 分类常量
      techCategories,
      designCategories,
      manageCategories
    }
  },
  onLoad() {
    // 优先加载职位数据，保证首屏内容尽快显示
    this.getRecommendJobs()
    // 延迟加载分类数据，避免阻塞首屏渲染
    setTimeout(() => {
      this.getJobCategories()
    }, 100)
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
            jobsData = this.getMockJobsData()
        }
        
        // 处理职位数据，确保category_id为数字类型
        jobsData = jobsData.map(job => ({
            ...job,
            category_id: job.category_id && job.category_id !== '' ? Number(job.category_id) : null
        }))
        
        // 存储所有职位数据，用于本地搜索和筛选
        this.allJobs = jobsData
        this.jobList = jobsData
        
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
        // 如果是技术开发类的子分类，保持currentCategory为'100'
        if (this.techCategories.includes(Number(categoryId))) {
            this.currentCategory = '100'
        } else {
            this.currentCategory = categoryId
        }
        
        // 检查是否为技术开发类（包括主分类100）
        if (this.currentCategory === '100' || this.techCategories.includes(Number(categoryId))) {
            this.showCategoryTabs = true
            // 获取技术开发的子分类（实际数据库中的具体分类）
            this.subCategoryList = this.allCategories.filter(category => 
                this.techCategories.includes(Number(category.id))
            )
        } else {
            this.showCategoryTabs = false
            this.subCategoryList = []
        }
        
        // 重置筛选条件
        this.selectedSubCategories = []
        this.keyword = '' // 清空关键词搜索
        
        // 只有当点击的是主分类时，才调用后端API获取职位数据
        // 当点击的是技术开发的子分类时，不调用API，而是使用allJobs数组进行筛选
        if (categoryId === '100' || !this.techCategories.includes(Number(categoryId))) {
            this.getJobsByCategory(categoryId)
        } else {
            // 当点击的是技术开发的子分类时，将该子分类ID添加到selectedSubCategories数组中
            this.selectedSubCategories = [Number(categoryId)]
            // 应用筛选
            this.applyFilters()
        }
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
            
            // 职位数据已成功获取
            
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
      
      // 应用筛选
      this.applyFilters()
    },
    
    // 搜索输入事件
    onSearchInput() {
      // 确保allJobs有数据
      if (this.allJobs.length === 0) {
        console.log('allJobs为空，使用模拟数据')
        this.allJobs = this.getMockJobsData()
      }
      this.applyFilters()
    },
    
    // 应用所有筛选条件
    applyFilters() {
      // 确保allJobs有数据
      if (this.allJobs.length === 0) {
        console.log('allJobs为空，使用模拟数据')
        this.allJobs = this.getMockJobsData()
      }
      
      let filteredJobs = [...this.allJobs]
      
      // 应用分类筛选
      if (this.currentCategory) {
        // 根据实际数据库结构处理分类筛选
        const currentCatNum = Number(this.currentCategory)
        
        // 将Proxy对象转换为普通数组，并确保所有元素为数字类型
        const selectedSubCats = Array.from(this.selectedSubCategories).map(id => Number(id))
        
        filteredJobs = filteredJobs.filter(job => {
          // 确保job存在且有有效的category_id
          if (!job || job.category_id === null) {
            return false
          }
          
          // 确保jobCategoryId为数字类型
          const jobCategoryId = Number(job.category_id)
          
          // 如果选择了技术开发类主分类（100）
          if (currentCatNum === 100) {
            if (selectedSubCats.length > 0) {
              // 使用OR逻辑：职位属于任意一个选择的子分类
              return selectedSubCats.some(catId => catId === jobCategoryId)
            } else {
              return this.techCategories.includes(jobCategoryId)
            }
          } else if (this.techCategories.includes(currentCatNum)) {
            // 如果点击的是技术开发的子分类
            return jobCategoryId === currentCatNum
          } else if (this.designCategories.includes(currentCatNum)) {
            return this.designCategories.includes(jobCategoryId)
          } else if (this.manageCategories.includes(currentCatNum)) {
            return this.manageCategories.includes(jobCategoryId)
          } else {
            // 对于具体分类ID，直接匹配
            return jobCategoryId === currentCatNum
          }
        })
      }
      
      // 应用关键词搜索
      if (this.keyword && this.keyword.trim() !== '') {
        const keywordLower = this.keyword.toLowerCase().trim()
        filteredJobs = filteredJobs.filter(job => {
          const titleMatch = job.title && job.title.toLowerCase().includes(keywordLower)
          const companyMatch = job.company && job.company.toLowerCase().includes(keywordLower)
          const descriptionMatch = job.description && job.description.toLowerCase().includes(keywordLower)
          const isMatch = titleMatch || companyMatch || descriptionMatch
          return isMatch
        })
      }
      
      // 更新职位列表
      this.jobList = filteredJobs
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
    
    
    
    getJobCategories() {
      // 根据实际数据库结构定义主分类
      // 注意：数据库中的分类是扁平的，我们需要将相关的分类组合成大类
      const mainCategories = [
        { id: '100', name: '技术开发', icon: '/static/category/tech.png' },
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
    
    // 根据技术开发分类ID获取分类名称
    getTechSubCategoryName(categoryId) {
      const nameMap = {
        101: '前端开发',
        102: '后端开发',
        103: '移动开发',
        104: '人工智能',
        105: '大数据',
        106: '云计算',
        107: '网络安全',
        108: '嵌入式开发'
      }
      return nameMap[categoryId] || '未知分类'
    },
    
    // 确保allCategories包含技术开发的子分类
    ensureTechSubCategories() {
      // 使用已定义的分类常量
      const techSubCategories = this.techCategories.map(id => ({
        id,
        name: this.getTechSubCategoryName(id),
        parent_id: null
      }))
      
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
    

    
    // 生成模拟职位数据
    getMockJobsData() {
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
      return mockData
    }
  }
}
</script>

<style>
.container {
  background: linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%);
  min-height: 100vh;
  padding: 80px 16px 0;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
  box-sizing: border-box;
}

/* 导航栏样式 */
.nav-bar {
  background: linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8));
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  margin: 0 0 12rpx;
  left: 0;
  right: 0;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  height: 44px;
  padding: 0 16px;
  margin: 12px 0;
  transition: all 0.3s ease;
  border: 1px solid rgba(230, 240, 255, 0.5);
}

.search-bar:focus-within {
  box-shadow: 0 0 20px rgba(79, 172, 254, 0.3);
  border: 1px solid transparent;
  background: linear-gradient(135deg, #ffffff, #f8faff);
}

.search-bar input {
  flex: 1;
  margin-left: 12px;
  font-size: 15px;
  color: #1E1E1E;
  background: transparent;
  border: none;
  outline: none;
}

.search-bar input::placeholder {
  color: #ADB5BD;
}

.banner-img {
  width: 100%;
  height: 300rpx;
  border-radius: 16px;
  margin: 12px 0;
}

.category-section {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.8);
  padding: 30rpx 0;
  margin: 16rpx 0;
  border-radius: 16rpx;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx;
  transition: all 0.3s ease;
}

.category-item:active {
  transform: scale(0.95);
}

.category-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 10rpx;
  display: block;
}

.category-name {
  font-size: 26rpx;
  color: #1E1E1E;
}

.job-section {
  background: rgba(255, 255, 255, 0.8);
  padding: 16px;
  border-radius: 16px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.job-section::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, #4facfe, #00f2fe, transparent);
  border-radius: 0 0 16px 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
  position: relative;
}

.title-container {
  display: flex;
  align-items: center;
  position: relative;
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

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E1E1E;
  position: relative;
}

.more-btn {
  font-size: 13px;
  color: #007aff;
  transition: all 0.3s ease;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.more-btn:active {
  opacity: 0.7;
  transform: scale(0.95);
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.load-more {
  text-align: center;
  padding: 20rpx;
  color: #999999;
  font-size: 28rpx;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.load-more:active {
  opacity: 0.7;
  transform: scale(0.95);
}

/* 子分类标签区域 */
.sub-category-tabs {
  background: transparent;
  padding: 12px 0;
  margin: 0;
  border-radius: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  box-shadow: none;
}

.sub-category-tab {
  padding: 8px 16px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border-radius: 30px;
  font-size: 14px;
  color: #007aff;
  transition: all 0.3s ease;
  margin-right: 8px;
  margin-bottom: 8px;
}

.sub-category-tab.active {
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: #ffffff;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

.sub-category-tab:active {
  transform: scale(0.95);
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: #ffffff;
  opacity: 0.8;
}

/* 就业类型筛选区域 */
.emp-type-section {
  background: rgba(255, 255, 255, 0.8);
  padding: 20rpx;
  margin: 0 16rpx 16rpx;
  border-radius: 16rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.emp-type-item {
  padding: 15rpx 30rpx;
  font-size: 28rpx;
  color: #6C757D;
  transition: all 0.3s ease;
  position: relative;
}

.emp-type-item.active {
  color: #007aff;
  border-bottom: 2rpx solid transparent;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.emp-type-item:active {
  color: #007aff;
}

/* 分割线 */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e6f0ff, transparent);
  margin: 16px 0;
}


</style>