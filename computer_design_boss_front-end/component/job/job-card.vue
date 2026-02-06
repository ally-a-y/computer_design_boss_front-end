<template>
  <view class="job-card">
    <view class="card-content" @click="goToDetail(data)">
      <view class="card-header">
        <text class="job-title">{{ data.title }}</text>
        <text class="salary">{{ formatSalary(data.salary_min, data.salary_max) }}</text>
      </view>
      
      <view class="company-info">
        <text class="company-name">{{ data.company || '未知公司' }}</text>
        <text class="company-tag">{{ data.exp_req || '经验不限' }} | {{ data.edu_req || '学历不限' }}</text>
      </view>
      
      <view class="job-tags">
        <text v-for="tag in getJobTags(data)" :key="tag" class="tag">{{ tag }}</text>
      </view>
      
      <view class="card-footer">
        <text class="location">{{ data.city || '城市' }}</text>
        <text class="time">{{ formatTime(data.publish_time) }}</text>
      </view>
    </view>
    
    <!-- 收藏按钮 -->
    <view class="favorite-btn" @click.stop="toggleFavorite">
      <uni-icons 
        :type="isFavorite ? 'star-filled' : 'star'" 
        :size="30" 
        :color="isFavorite ? '#ff9500' : '#ccc'"
      ></uni-icons>
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
    }
  },
  data() {
    return {
      isFavorite: false
    }
  },
  mounted() {
    // 检查职位是否已收藏
    this.checkIsFavorite()
  },
  methods: {
    checkIsFavorite() {
      // 从本地存储获取收藏列表
      const collections = uni.getStorageSync('collections') || []
      this.isFavorite = collections.some(item => item.id === this.data.id)
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
  background-color: #fff;
  margin: 10rpx 0;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  /* 防止卡片内容被分割到不同列 */
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  position: relative;
}

.card-content {
  /* 卡片内容区域 */
}

.favorite-btn {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10rpx;
  border-radius: 50%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.job-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.salary {
  font-size: 32rpx;
  color: #ff6b35;
  font-weight: bold;
}

.company-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.company-name {
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
}

.company-tag {
  font-size: 24rpx;
  color: #999;
  background-color: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}

.tag {
  font-size: 24rpx;
  color: #007aff;
  background-color: rgba(0, 122, 255, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.location,
.time {
  font-size: 24rpx;
  color: #999;
}
</style>