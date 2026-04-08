<template>
  <view class="deliver-page" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航 -->
    <view class="nav-bar" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">投递职位</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>

    <!-- 投递列表 -->
    <view class="deliver-list">
      <view v-for="(item, index) in delivers" :key="index" class="deliver-item" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
        <view class="job-info">
          <text class="job-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ item.jobTitle }}</text>
          <text class="company" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{ item.company }}</text>
          <text class="salary">{{ item.salary }}</text>
          <text class="deliver-time" :style="{ color: isDarkMode ? '#666' : '#ADB5BD' }">{{ item.deliverTime }}</text>
          <view class="status">
            <text class="status-text" :class="item.status">{{ item.statusText }}</text>
          </view>
        </view>
        <view class="actions">
          <button class="cancel-btn" @click="cancelDeliver(index)" :style="{ background: isDarkMode ? '#404040' : '#F2F5F9', color: isDarkMode ? '#999' : '#6C757D' }">取消投递</button>
          <button class="detail-btn" @click="viewDetails(item)">查看详情</button>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="delivers.length === 0" class="empty-state">
        <uni-icons type="paperplane" size="80" :color="isDarkMode ? '#404040' : '#ccc'"></uni-icons>
        <text :style="{ color: isDarkMode ? '#666' : '#ADB5BD' }">暂无投递记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { themeManager } from '@/common/utils/theme-simple.js'

export default {
  data() {
    return {
      delivers: [],
      // 主题相关
      currentTheme: 'light',
      isDarkMode: false
    }
  },

  onLoad() {
    this.loadDelivers()
    // 初始化主题
    this.initTheme()
  },
  
  onUnload() {
    // 清理主题监听
    uni.$off('globalThemeChange', this.handleGlobalThemeChange)
  },
  
  methods: {
    /**
     * 初始化主题
     */
    initTheme() {
      // 获取当前主题
      this.currentTheme = themeManager.getCurrentTheme()
      this.isDarkMode = this.currentTheme === 'dark'
      
      // 监听全局主题变化
      uni.$on('globalThemeChange', this.handleGlobalThemeChange)
    },
    
    /**
     * 处理全局主题变化
     */
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme
      this.isDarkMode = data.isDark
    },
    
    goBack() {
      uni.navigateBack()
    },

    loadDelivers() {
      // 从本地存储获取投递列表
      const delivers = uni.getStorageSync('delivers') || []
      this.delivers = delivers
    },
    cancelDeliver(index) {
      uni.showModal({
        title: '提示',
        content: '确定取消投递该职位吗？',
        success: (res) => {
          if (res.confirm) {
            // 从本地存储获取投递列表
            let delivers = uni.getStorageSync('delivers') || []
            // 移除指定索引的投递
            delivers.splice(index, 1)
            // 保存更新后的投递列表
            uni.setStorageSync('delivers', delivers)
            // 更新页面数据
            this.delivers = delivers
            
            uni.showToast({
              title: '已取消投递',
              icon: 'success'
            })
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
      uni.navigateTo({
        url: `/pages/job/detail/job_detail_index?id=${item.id}`
      }) 
    }
  }
}
</script>

<style>
.deliver-page {
  background-color: #F8FAFD;
  min-height: 100vh;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
  padding-top: 80px;
  box-sizing: border-box;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
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
  color: #007AFF;
}

.deliver-list {
  padding: 16px;
}

.deliver-item {
  background-color: #fff;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.deliver-item:active {
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

.deliver-time {
  font-size: 12px;
  color: #ADB5BD;
  display: block;
  margin-bottom: 12px;
}

.status {
  display: inline-block;
}

.status-text {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.status-text.pending {
  background-color: #E3F2FD;
  color: #1976D2;
}

.status-text.reviewing {
  background-color: #FFF3E0;
  color: #F57C00;
}

.status-text.accepted {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.status-text.rejected {
  background-color: #FFEBEE;
  color: #C62828;
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