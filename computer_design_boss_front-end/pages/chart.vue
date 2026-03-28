<template>
  <view class="chart-page" :style="{ backgroundColor: isDarkMode ? '#1a1a1a' : '#F8FAFD' }">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">竞争力分析</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 用户信息卡片 -->
    <view class="user-card" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="user-header">
        <image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">张三</text>
          <text class="user-title" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">资深产品经理</text>
        </view>
        <view class="competitive-tag" :style="{ backgroundColor: isDarkMode ? '#3a3a3a' : '#E8F0FE' }">
          <text class="tag-text" :style="{ color: '#007AFF' }">竞争力评级 S+</text>
          <text class="arrow-icon" :style="{ color: '#007AFF' }">↑</text>
        </view>
      </view>
    </view>
    
    <!-- 综合竞争力环形图 -->
    <view class="competitive-card" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="ring-chart-container">
        <view class="ring-chart">
          <view class="ring-background" :style="{ borderColor: isDarkMode ? '#404040' : '#E5E5EA' }"></view>
          <view class="ring-progress" :style="{ borderTopColor: '#007AFF', borderRightColor: '#007AFF' }"></view>
          <view class="ring-center">
            <text class="score" :style="{ color: '#007AFF' }">{{ score }}</text>
            <text class="score-label" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">综合竞争力百分位</text>
          </view>
        </view>
        <text class="competitive-desc" :style="{ color: '#007AFF' }">你的竞争力处于市场前 5% 的稀缺区间</text>
      </view>
    </view>
    
    <!-- 关键指标卡片组 -->
    <view class="metrics-container">
      <view class="metric-card" v-for="(metric, index) in metrics" :key="index" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
        <text class="metric-value" :style="{ color: '#007AFF' }">{{ metric.value }} <text class="metric-change" v-if="metric.change">↑ {{ metric.change }}</text></text>
        <text class="metric-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ metric.label }}</text>
        <text class="metric-desc" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{ metric.desc }}</text>
      </view>
    </view>
    
    <!-- 双栏图表区 -->
    <view class="chart-section">
      <!-- 左侧饼图 -->
      <view class="chart-card" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
        <text class="chart-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">技能权重分布</text>
        <view class="pie-chart-container">
          <view class="pie-chart">
            <view class="pie-sector" v-for="(sector, index) in skillDistribution" :key="index" :style="{ '--percentage': sector.percentage, '--color': sector.color, '--offset': sector.offset }"></view>
            <view class="pie-center" :style="{ backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)' }">
              <text class="pie-center-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">技能</text>
              <text class="pie-center-subtext" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">分布</text>
            </view>
          </view>
          <view class="pie-legend">
            <view class="legend-item" v-for="(sector, index) in skillDistribution" :key="index">
              <view class="legend-color" :style="{ backgroundColor: sector.color }"></view>
              <text class="legend-text" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{ sector.name }} {{ sector.percentage }}%</text>
            </view>
          </view>
        </view>
        <text class="chart-insight" :style="{ color: isDarkMode ? '#999' : '#6C757D', backgroundColor: isDarkMode ? '#3a3a3a' : '#F8FAFD' }">产品规划与用户研究构成核心优势，占总技能权重 60%。</text>
      </view>
      
      <!-- 右侧水平堆叠条 -->
      <view class="chart-card" :style="{ backgroundColor: isDarkMode ? '#2c2c2c' : '#ffffff', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
        <text class="chart-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">核心优势对比</text>
        <view class="bar-chart-container">
          <view class="bar-item" v-for="(item, index) in coreAdvantages" :key="index">
            <text class="bar-label" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{ item.label }}</text>
            <view class="bar-wrapper" :style="{ backgroundColor: isDarkMode ? '#404040' : '#E9ECF1' }">
              <view class="bar-fill" :style="{ width: item.value, background: 'linear-gradient(90deg, #007AFF 0%, #5E9EFF 100%)' }"></view>
            </view>
            <text class="bar-value" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ item.score }}</text>
          </view>
        </view>
        <text class="chart-insight" :style="{ color: isDarkMode ? '#999' : '#6C757D', backgroundColor: isDarkMode ? '#3a3a3a' : '#F8FAFD' }">跨部门协同力为最强优势，可重点在面试中举例。</text>
      </view>
    </view>
    
    <!-- 底部区域：机会洞察 + 行动建议 -->
    <view class="insight-section" :style="{ background: isDarkMode ? 'linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 100%)' : 'linear-gradient(180deg, #E8F0FE 0%, #FFFFFF 100%)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }">
      <view class="insight-left">
        <text class="insight-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">机会雷达</text>
        <view class="insight-list">
          <view class="insight-item" v-for="(item, index) in opportunities" :key="index" :style="{ backgroundColor: isDarkMode ? '#3a3a3a' : 'rgba(255,255,255,0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)' }">
            <text class="insight-dot" :style="{ color: '#007AFF' }">{{ item.icon }}</text>
            <text class="insight-text" :style="{ color: isDarkMode ? '#ffffff' : '#3A3A3A' }">{{ item.text }}</text>
          </view>
        </view>
      </view>
      <view class="insight-right">
        <text class="insight-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">行动建议</text>
        <view class="action-list">
          <view class="action-item" v-for="(item, index) in actions" :key="index" :style="{ backgroundColor: isDarkMode ? '#3a3a3a' : 'rgba(255,255,255,0.9)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)' }">
            <text class="action-text" :style="{ color: isDarkMode ? '#ffffff' : '#3A3A3A' }">{{ item }}</text>
          </view>
        </view>
      </view>
      <text class="model-version" :style="{ color: isDarkMode ? '#666' : '#ADB5BD', borderTop: isDarkMode ? '1px solid #404040' : '1px solid #E9ECF1' }">竞争力模型 v3.2 · 基于 2025 年 Q2 市场数据</text>
    </view>
  </view>
</template>

<script>
import { themeManager } from '@/common/utils/theme-simple.js'

export default {
  data() {
    return {
      // 主题相关
      currentTheme: 'light',
      isDarkMode: false,
      
      // 数据
      score: 96,
      
      // 关键指标
      metrics: [
        {
          value: '94%',
          change: '3%',
          label: '岗位匹配度',
          desc: '与"资深产品经理"高度契合'
        },
        {
          value: '8.6 / 10.0',
          label: '技能广度',
          desc: '覆盖 5 大核心能力域，高于行业平均 1.2'
        },
        {
          value: '极热 🔥',
          label: '市场热度',
          desc: '近7日被搜索 24 次，简历查看率 +28%'
        }
      ],
      
      // 技能分布
      skillDistribution: [
        { name: '产品规划', percentage: 32, color: '#007AFF', offset: 0 },
        { name: '用户研究', percentage: 28, color: '#5E9EFF', offset: 32 },
        { name: '数据分析', percentage: 22, color: '#8EB9FF', offset: 60 },
        { name: '沟通协调', percentage: 18, color: '#C0D6FF', offset: 82 }
      ],
      
      // 核心优势
      coreAdvantages: [
        { label: '全链路产品经验', value: '92%', score: '9.2' },
        { label: '数据驱动决策', value: '89%', score: '8.9' },
        { label: '跨部门协同力', value: '95%', score: '9.5' }
      ],
      
      // 机会洞察
      opportunities: [
        { icon: '•', text: '头部大厂机会：3 家（字节跳动、美团、滴滴）岗位匹配度 > 85%' },
        { icon: '•', text: '高潜赛道：AI 应用层产品岗位，你的技能匹配度 A+' },
        { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +15%~20%' }
      ],
      
      // 行动建议
      actions: [
        '优先更新"项目成果"模块，增加具体增长数据',
        '开启"暗聘模式"，定向接收目标企业直推'
      ]
    }
  },
  onLoad() {
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
    }
  }
}
</script>

<style>
.chart-page {
  background-color: #F8FAFD;
  min-height: 100vh;
  padding: 80px 16px 0;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* 顶部导航栏 */
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

.nav-back-icon {
  font-size: 24px;
  color: #1E1E1E;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-back-icon:active {
  color: #007AFF;
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

/* 用户信息卡片 */
.user-card {
  background-color: #fff;
  padding: 20px 16px;
  margin: 0 0 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-radius: 16px;
  box-sizing: border-box;
}

.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin-right: 16px;
  border: 2px solid #F0F4FF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 4px;
}

.user-title {
  font-size: 14px;
  color: #6C757D;
}

.competitive-tag {
  display: flex;
  align-items: center;
  background-color: #E8F0FE;
  padding: 8px 16px;
  border-radius: 24px;
  box-shadow: 0 2px 4px rgba(0,122,255,0.1);
}

.tag-text {
  font-size: 14px;
  font-weight: 600;
  color: #007AFF;
  margin-right: 4px;
}

.arrow-icon {
  font-size: 12px;
  color: #007AFF;
  font-weight: bold;
}

/* 综合竞争力环形图 */
.competitive-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  margin: 0 0 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.competitive-card:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.ring-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ring-chart {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 16px;
}

.ring-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 14px solid #E5E5EA;
  box-sizing: border-box;
}

.ring-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 14px solid transparent;
  border-top: 14px solid #007AFF;
  border-right: 14px solid #007AFF;
  box-sizing: border-box;
  transform: rotate(45deg);
  animation: rotate 2s ease-in-out;
}

@keyframes rotate {
  from {
    transform: rotate(-45deg);
    border-top: 14px solid transparent;
    border-right: 14px solid transparent;
  }
  to {
    transform: rotate(45deg);
    border-top: 14px solid #007AFF;
    border-right: 14px solid #007AFF;
  }
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

.score {
  font-size: 42px;
  font-weight: 700;
  color: #007AFF;
  display: block;
  line-height: 1;
}

.score-label {
  font-size: 14px;
  color: #6C757D;
  margin-top: 8px;
}

.competitive-desc {
  font-size: 14px;
  font-weight: 600;
  color: #007AFF;
  margin-top: 12px;
  line-height: 1.4;
}

/* 关键指标卡片组 */
.metrics-container {
  display: flex;
  gap: 12px;
  padding: 0;
  margin-bottom: 16px;
}

.metric-card {
  flex: 1;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.metric-card:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.metric-value {
  font-size: 22px;
  font-weight: 700;
  color: #007AFF;
  display: block;
  margin-bottom: 8px;
  line-height: 1;
}

.metric-change {
  font-size: 14px;
  font-weight: 500;
}

.metric-label {
  font-size: 14px;
  font-weight: 500;
  color: #1E1E1E;
  margin-bottom: 6px;
  display: block;
}

.metric-desc {
  font-size: 12px;
  color: #6C757D;
  line-height: 1.4;
}

/* 双栏图表区 */
.chart-section {
  display: flex;
  gap: 12px;
  padding: 0;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.chart-card {
  flex: 1;
  background-color: #fff;
  border-radius: 16px;
  padding: 20px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  min-width: 0;
}

.chart-card:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 16px;
}

.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.pie-chart {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}

.pie-sector {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform: rotate(calc(var(--offset, 0) * 3.6deg));
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
  background-color: var(--color);
}

.pie-sector::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  transform: rotate(calc(var(--percentage) * 3.6deg));
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%);
  background-color: #fff;
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pie-legend {
  margin-top: 20px;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.legend-text {
  font-size: 13px;
  color: #6C757D;
  flex: 1;
}

.bar-chart-container {
  margin-bottom: 16px;
}

.bar-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.bar-label {
  width: 110px;
  font-size: 13px;
  color: #6C757D;
  flex-shrink: 0;
  line-height: 1.3;
}

.bar-wrapper {
  flex: 1;
  height: 14px;
  background-color: #E9ECF1;
  border-radius: 7px;
  margin: 0 12px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #007AFF 0%, #5E9EFF 100%);
  border-radius: 7px;
  transition: width 1s ease-in-out;
  box-shadow: 0 1px 3px rgba(0,122,255,0.3);
}

.bar-value {
  font-size: 13px;
  font-weight: 600;
  color: #1E1E1E;
  width: 35px;
  text-align: right;
}

.chart-insight {
  font-size: 13px;
  color: #6C757D;
  line-height: 1.4;
  margin-top: 12px;
  padding: 12px;
  background-color: #F8FAFD;
  border-radius: 8px;
  border-left: 3px solid #007AFF;
}

/* 底部区域：机会洞察 + 行动建议 */
.insight-section {
  background: linear-gradient(180deg, #E8F0FE 0%, #FFFFFF 100%);
  border-radius: 24px;
  padding: 24px 20px;
  margin: 0 0 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  box-sizing: border-box;
}

.insight-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 16px;
}

.insight-list {
  margin-bottom: 20px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 12px;
  background-color: rgba(255,255,255,0.8);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.insight-dot {
  font-size: 18px;
  color: #007AFF;
  margin-right: 12px;
  line-height: 1.4;
  flex-shrink: 0;
}

.insight-text {
  flex: 1;
  font-size: 14px;
  color: #3A3A3A;
  line-height: 1.4;
}

.action-list {
  margin-bottom: 20px;
}

.action-item {
  background-color: rgba(255,255,255,0.9);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border-left: 4px solid #007AFF;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.action-item:active {
  transform: translateX(4px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.action-text {
  font-size: 14px;
  color: #3A3A3A;
  line-height: 1.4;
}

.model-version {
  font-size: 12px;
  color: #ADB5BD;
  text-align: center;
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid #E9ECF1;
}

/* 动画效果 */
.progress-ring {
  transition: stroke-dashoffset 2s ease-in-out;
}

.pie-slice {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.pie-slice:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.pie-center-text {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
}

.pie-center-subtext {
  font-size: 14px;
  color: #6C757D;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .metrics-container {
    flex-direction: column;
  }
  
  .metric-card {
    width: 100%;
  }
  
  .chart-section {
    flex-direction: column;
  }
  
  .chart-card {
    width: 100%;
  }
  
  .bar-label {
    width: 90px;
    font-size: 12px;
  }
  
  .user-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .competitive-tag {
    margin-top: 12px;
  }
}
</style>