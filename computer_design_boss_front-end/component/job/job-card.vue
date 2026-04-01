<template>
  <view class="job-card" :style="{ background: isDark ? '#2c2c2c' : 'linear-gradient(135deg, #ffffff, #f8faff)', boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
    <view class="card-content" @click="goToDetail(data)">
      <view class="card-header">
        <text class="job-title" :style="{ color: isDark ? '#ffffff' : '#1E1E1E' }">{{ data.title }}</text>
        <text class="salary">{{ formatSalary(data.salary_min, data.salary_max) }}</text>
      </view>
      
      <view class="company-info">
        <text class="company-name" :style="{ color: isDark ? '#ffffff' : '#1E1E1E' }">{{ data.company || '未知公司' }}</text>
        <text class="company-tag" :style="{ color: isDark ? '#999' : '#6C757D' }">{{ data.exp_req || '经验不限' }} | {{ data.edu_req || '学历不限' }}</text>
      </view>
      
      <view class="job-tags">
        <text v-for="tag in getJobTags(data)" :key="tag" class="tag" :style="{ background: isDark ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)', color: isDark ? '#ccc' : '#6C757D' }">{{ tag }}</text>
      </view>
      
      <view class="card-footer" :style="{ borderTop: isDark ? '1px solid #404040' : '1px solid #E6F0FF' }">
        <text class="location" :style="{ color: isDark ? '#ffffff' : '#1E1E1E' }">{{ data.city || '城市' }}</text>
        <text class="time" :style="{ color: isDark ? '#999' : '#6C757D' }">{{ formatTime(data.publish_time) }}</text>
      </view>
    </view>
    
    <!-- 右侧按钮组 -->
    <view class="right-buttons">
      <!-- 收藏按钮 -->
      <view class="favorite-btn" @click.stop="toggleFavorite" :style="{ background: isDark ? 'rgba(42, 42, 42, 0.8)' : 'linear-gradient(135deg, #ffffff, #f8faff)' }">
        <uni-icons 
          :type="isFavorite ? 'star-filled' : 'star'" 
          :size="30" 
          :color="isFavorite ? '#ff9500' : isDark ? '#666' : '#ccc'"
        ></uni-icons>
      </view>
      
      <!-- 投递按钮 -->
      <view class="apply-btn" :class="{ 'applied': isApplied }" @click.stop="applyForJob" :style="{ background: isApplied ? (isDark ? '#3a3a3a' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)') : 'linear-gradient(120deg, #4facfe, #00f2fe)', color: isApplied ? (isDark ? '#999' : '#6C757D') : 'white' }">
        {{ isApplied ? '已投递' : '投递' }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'JobCard',
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFavorite: false,
      isApplied: false
    }
  },
  mounted() {
    // 检查职位是否已收藏
    this.checkIsFavorite()
    // 检查职位是否已投递
    this.checkIsApplied()
  },
  onShow() {
    // 页面显示时检查收藏状态
    this.checkIsFavorite()
    // 页面显示时检查投递状态
    this.checkIsApplied()
  },
  methods: {
    checkIsFavorite() {
      // 从本地存储获取收藏列表
      const collections = uni.getStorageSync('collections') || []
      this.isFavorite = collections.some(item => item.id === this.data.id)
    },
    checkIsApplied() {
      // 从本地存储获取投递列表
      const delivers = uni.getStorageSync('delivers') || []
      this.isApplied = delivers.some(item => item.id === this.data.id)
    },
    toggleFavorite() {
      // 获取当前收藏列表
      let collections = uni.getStorageSync('collections') || []
      
      if (this.isFavorite) {
        // 取消收藏
        collections = collections.filter(item => item.id !== this.data.id)
        this.isFavorite = false
        uni.showToast({
          title: '已取消收藏',
          icon: 'success'
        })
      } else {
        // 添加收藏
        const newCollection = {
          id: this.data.id,
          jobTitle: this.data.title,
          company: this.data.company || '未知公司',
          salary: this.formatSalary(this.data.salary_min, this.data.salary_max),
          collectionTime: new Date().toLocaleString()
        }
        collections.push(newCollection)
        this.isFavorite = true
        uni.showToast({
          title: '收藏成功',
          icon: 'success'
        })
      }
      
      // 保存收藏列表
      uni.setStorageSync('collections', collections)
    },
    
    applyForJob() {
      // 获取当前投递列表
      let delivers = uni.getStorageSync('delivers') || []
      
      // 检查是否已经投递
      const isApplied = delivers.some(item => item.id === this.data.id)
      
      if (isApplied) {
        // 取消投递
        delivers = delivers.filter(item => item.id !== this.data.id)
        this.isApplied = false
        uni.showToast({
          title: '已取消投递',
          icon: 'success'
        })
      } else {
        // 添加投递
        const newDeliver = {
          id: this.data.id,
          jobTitle: this.data.title,
          company: this.data.company || '未知公司',
          salary: this.formatSalary(this.data.salary_min, this.data.salary_max),
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
    // 格式化薪资
    formatSalary(min, max) {
      if (min && max) {
        // 处理后端返回的Decimal类型数据，转换为数字
        const minNum = typeof min === 'number' ? min : parseFloat(min)
        const maxNum = typeof max === 'number' ? max : parseFloat(max)
        return `${(minNum/1000).toFixed(0)}-${(maxNum/1000).toFixed(0)}K`
      }
      return '薪资面议'
    },
    goToDetail(data) {
		console.log("转换后的b:",data.id)
	  uni.navigateTo({
		url: `/pages/job/detail/job_detail_index?id=${data.id}`
	  })
	},
    // 获取公司名称
    getCompanyName(data) {
      // 后端目前没有返回公司名称，需要根据company_id查询，这里暂时返回默认值
     const companyMap = {
        '1': '花旗金融信息服务（中国）有限公司',
        '2': '中国移动通信有限公司在线营销服务中心',
        '3': 'Victoria\'s Secret'
      }
      return companyMap[data.company_id] || '未知公司'
    },
    
    // 获取职位标签
    getJobTags(data) {
      // 后端返回的福利标签可能在welfare_list中
      if (data.welfare_list) {
        return Array.isArray(data.welfare_list) ? data.welfare_list : JSON.parse(data.welfare_list)
      }
      // 默认标签
      return ['五险一金', '弹性工作', '带薪年假']
    },
    
    // 格式化发布时间
    formatTime(publishTime) {
      if (!publishTime) return '今天'
      
      try {
        const date = new Date(publishTime)
        const now = new Date()
        
        // 计算时间差（毫秒）
        const diff = now - date
        
        // 计算天数差
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        
        if (days === 0) {
          return '今天'
        } else if (days === 1) {
          return '昨天'
        } else if (days < 7) {
          return `${days}天前`
        } else {
          // 格式化日期为 YYYY-MM-DD
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }
      } catch (error) {
        console.error('日期格式化失败:', error)
        return '今天'
      }
    }
  }
}
</script>

<style scoped>
.job-card {
  background: linear-gradient(135deg, #ffffff, #f8faff);
  margin: 0;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(79, 172, 254, 0.15);
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.job-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.05), rgba(0, 242, 254, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.job-card:hover::after {
  opacity: 1;
}

.job-card:active {
  transform: scale(0.98);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.25);
}

.right-buttons {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 10;
}

.favorite-btn {
  background: linear-gradient(135deg, #ffffff, #f8faff);
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn:active {
  transform: scale(0.9);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-right: 80px;
}

.job-title {
  font-size: 17px;
  font-weight: 600;
  color: #1E1E1E;
  flex: 1;
  background: linear-gradient(90deg, #1E1E1E, #4a4a4a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.salary {
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.company-info {
  margin-bottom: 12px;
  padding-right: 80px;
}

.company-name {
  font-size: 15px;
  font-weight: 500;
  color: #1E1E1E;
  margin-bottom: 8px;
  display: block;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
  gap: 6px;
  padding-right: 80px;
}

.tag {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 8px;
  margin-right: 6px;
  margin-bottom: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tag:nth-child(1) {
  background: linear-gradient(135deg, #ff9a9e, #fad0c4);
  color: #fff;
}

.tag:nth-child(2) {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #333;
}

.tag:nth-child(3) {
  background: linear-gradient(135deg, #fad0c4, #ffd1ff);
  color: #333;
}

.tag:nth-child(4) {
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
  color: #333;
}

.tag:active {
  transform: scale(0.95);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #E6F0FF;
  margin-top: 8px;
  padding-right: 80px;
}

.location {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #1E1E1E;
}

.location::before {
  content: "📍";
  margin-right: 4px;
  color: #007aff;
}

.time {
  font-size: 13px;
  color: #6C757D;
}

/* 投递按钮 */
.apply-btn {
  background: linear-gradient(120deg, #4facfe, #00f2fe);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 20px;
  height: 32px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
}

.apply-btn.applied {
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  color: #6C757D;
  box-shadow: none;
}

.apply-btn:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(79, 172, 254, 0.4);
}

.apply-btn.applied:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, #D6E8FF, #E6F0FF);
}
</style>