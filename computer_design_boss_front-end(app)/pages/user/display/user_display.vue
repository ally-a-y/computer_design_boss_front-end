<template>
  <view class="display-page" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)', color: pageTextColor }">
    <!-- 顶部导航 -->
    <view class="nav-bar" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">显示设置</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 设置内容 -->
    <view class="setting-content" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <!-- 主题模式 -->
      <view class="setting-item" :style="{ borderBottomColor: isDarkMode ? '#404040' : '#eee' }">
        <text class="setting-title" :style="{ color: pageTextColor }">主题模式</text>
        <text class="setting-desc" :style="{ color: isDarkMode ? '#cccccc' : '#999' }">选择您喜欢的界面主题</text>
        <view class="theme-options">
          <view 
            class="theme-option" 
            :class="{ 'theme-option-active': themeMode === theme.key }" 
            @click="setTheme(theme.key)"
            v-for="theme in availableThemes"
            :key="theme.key"
            :style="{ 
              backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
              borderColor: isDarkMode ? '#404040' : '#e0e0e0'
            }"
          >
            <text class="theme-option-icon" :style="{ color: pageTextColor }">{{ theme.icon }}</text>
            <text class="theme-option-name" :style="{ color: pageTextColor }">{{ theme.name }}</text>
            <text class="theme-option-check" v-if="themeMode === theme.key" :style="{ color: '#007aff' }">✓</text>
          </view>
        </view>
        <view class="current-theme-info" :style="{ backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f8ff' }">
          <text class="current-theme-text" :style="{ color: isDarkMode ? '#0a84ff' : '#007aff' }">当前主题: {{ getThemeText(currentTheme) }}</text>
          <text class="theme-mode-text" v-if="themeMode === 'system'" :style="{ color: isDarkMode ? '#cccccc' : '#666' }">（跟随系统）</text>
        </view>
        <view class="theme-preview" v-if="themeMode !== 'system'">
          <text class="preview-title" :style="{ color: pageTextColor }">预览效果</text>
          <view class="preview-card" :class="'preview-card-' + themeMode" :style="{ 
            background: isDarkMode 
              ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)' 
              : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            borderColor: isDarkMode ? '#404040' : '#eeeeee',
            color: pageTextColor
          }">
            <text class="preview-text" :style="{ color: pageTextColor }">这是{{ getThemeText(themeMode) }}的预览效果</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { themeManager } from '@/common/utils/theme-simple.js'

export default {
  data() {
    return {
      themeMode: 'system', // 默认跟随系统
      availableThemes: [
        { key: 'light', name: '浅色模式', icon: '☀️' },
        { key: 'dark', name: '深色模式', icon: '🌙' },
        { key: 'system', name: '跟随系统', icon: '⚙️' }
      ],
      currentTheme: 'light',
      isDarkMode: false,
      pageBackground: '#f5f5f5',
      pageTextColor: '#333333'
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    setTheme(mode) {
      this.themeMode = mode
      
      // 使用主题管理器设置主题
      themeManager.setThemeMode(mode)
      
      // 更新当前主题状态
      this.currentTheme = themeManager.getCurrentTheme()
      this.isDarkMode = this.currentTheme === 'dark'
      
      // 更新页面样式
      this.updatePageTheme()
      
      // 显示切换成功提示
      const themeName = this.getThemeText(mode)
      uni.showToast({
        title: `已切换到${themeName}`,
        icon: 'success',
        duration: 1500
      })
    },
    getThemeText(mode) {
      const theme = this.availableThemes.find(t => t.key === mode)
      return theme ? theme.name : ''
    },
    updateTheme(theme) {
      // 更新页面主题状态
      this.currentTheme = theme
      this.isDarkMode = theme === 'dark'
    },
    updatePageTheme() {
      // 根据当前主题更新页面样式
      if (this.isDarkMode) {
        this.pageBackground = '#1a1a1a'
        this.pageTextColor = '#ffffff'
      } else {
        this.pageBackground = '#f5f5f5'
        this.pageTextColor = '#333333'
      }
    },
    handleGlobalThemeChange(data) {
      // 处理全局主题变化
      this.updateTheme(data.theme)
      this.updatePageTheme()
    }
  },
  onLoad() {
    // 从主题管理器加载当前主题设置
    this.themeMode = themeManager.getThemeMode()
    this.currentTheme = themeManager.getCurrentTheme()
    this.isDarkMode = this.currentTheme === 'dark'
    
    // 初始化页面主题
    this.updatePageTheme()
    
    // 监听全局主题变化
    uni.$on('globalThemeChange', this.handleGlobalThemeChange)
  },
  onUnload() {
    // 清理主题监听
    uni.$off('globalThemeChange', this.handleGlobalThemeChange)
  }
} 
</script>

<style>
.display-page {
  background-color: #f5f5f5;
  min-height: 100vh;
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


.setting-content {
  background-color: #fff;
  margin-top: 20rpx;
  padding: 20rpx;
}

.setting-item {
  padding: 30rpx 0;
  border-bottom: 1rpx solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
  font-weight: bold;
}

.setting-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
  display: block;
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.theme-option {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  background-color: #fff;
  position: relative;
  transition: all 0.3s ease;
  margin-bottom: 20rpx;
}

.theme-option:last-child {
  margin-bottom: 0;
}

.theme-option-active {
  border-color: #007aff;
  background-color: #f0f8ff;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.1);
}

.theme-option-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.theme-option-name {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.theme-option-check {
  font-size: 32rpx;
  color: #007aff;
  font-weight: bold;
}

.theme-preview {
  margin-top: 30rpx;
  padding: 20rpx;
  background-color: #f8f9fa;
  border-radius: 8rpx;
}

.preview-title {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: block;
}

.preview-card {
  padding: 30rpx;
  border-radius: 8rpx;
  text-align: center;
  transition: all 0.3s ease;
}

.preview-card-light {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  color: #333333;
  border: 1rpx solid #eeeeee;
}

.preview-card-dark {
  background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%);
  color: #ffffff;
  border: 1rpx solid #404040;
}

.preview-text {
  font-size: 26rpx;
  font-weight: 500;
}

.current-theme-info {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #f0f8ff;
  border-radius: 8rpx;
  text-align: center;
}

.current-theme-text {
  font-size: 28rpx;
  color: #007aff;
  font-weight: 500;
}

.theme-mode-text {
  font-size: 24rpx;
  color: #666;
  margin-left: 10rpx;
}
</style>