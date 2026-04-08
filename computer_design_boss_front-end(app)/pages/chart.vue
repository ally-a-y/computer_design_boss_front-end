<template>
  <view class="chart-page" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航栏 -->
    <view class="nav-bar" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">&lt;</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">竞争力分析</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <!-- 用户信息卡片 -->
    <view class="user-card" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="user-header-center">
        <image class="avatar-large" :src="userInfo.avatar ? 'data:image/jpeg;base64,' + userInfo.avatar.replace(/\s+/g, '') : 'https://a0ai.marscode.cn/api/ide/v1/text_to_image?prompt=professional%20profile%20avatar%20portrait&image_size=square'" mode="aspectFill"></image>
        <text class="user-name-large" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ userInfo.nickname || '加载中...' }}</text>
        <view v-if="userInfo.positions" class="user-positions">
          <text v-for="(position, index) in userInfo.positions" :key="index" class="user-title-large" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">
            {{ position }}{{ index < userInfo.positions.length - 1 ? ' ' : '' }}
          </text>
        </view>
        <text v-else class="user-title-large" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{ userInfo.position || '加载中...' }}</text>
        <view class="competitive-tag-large" :style="{ background: isDarkMode ? 'linear-gradient(120deg, #3a3a3a, #4a4a4a)' : 'linear-gradient(120deg, #4facfe, #00f2fe)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(79, 172, 254, 0.3)' }">
          <text class="tag-text-large" :style="{ color: '#ffffff' }">竞争力评级 {{ userInfo.competitiveLevel || 'A+' }}</text>
          <text class="arrow-icon-large" :style="{ color: '#ffffff' }">↑</text>
        </view>
      </view>
    </view>
    
    <!-- 综合竞争力环形图 -->
    <view class="competitive-card" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="competitive-header">
        <view class="ring-chart-container">
          <view class="ring-chart">
            <view class="ring-background" :style="{ borderColor: isDarkMode ? '#404040' : '#E5E5EA' }"></view>
            <view class="ring-progress" :style="{ borderTopColor: '#4facfe', borderRightColor: '#00f2fe' }"></view>
            <view class="ring-center" :style="{ background: isDarkMode ? 'rgba(58, 58, 58, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }">
              <text class="score" :style="{ color: '#007AFF' }">{{ score }}</text>
              <text class="score-label" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">综合竞争力百分位</text>
            </view>
          </view>
          <text class="competitive-desc" :style="{ color: '#007AFF' }">{{ competitiveDesc }}</text>
        </view>
        <view class="position-selector-container">
          <text class="input-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">职位选择</text>
          <view class="cascade-selector" @click="openCascadePicker" :style="{ background: isDarkMode ? '#404040' : 'linear-gradient(135deg, #E6F0FF, #F0F4FF)', borderColor: isDarkMode ? '#404040' : 'transparent' }">
            <view class="selector-content" :class="{ 'placeholder': !selectedPositionId }" :style="{ color: !selectedPositionId ? '#999' : (isDarkMode ? '#ffffff' : '#1E1E1E') }">
              <text v-if="selectedPositionId">{{ selectedCategoryName }} - {{ selectedPositionName }}</text>
              <text v-else>请选择职位</text>
            </view>
            <text class="arrow-icon" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">›</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 关键指标卡片组 -->
    <view class="metrics-container">
      <view class="metric-card" v-for="(metric, index) in metrics" :key="index" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
        <text class="metric-value" :style="{ color: '#007AFF' }">{{ metric.value }} <text class="metric-change" v-if="metric.change">↑ {{ metric.change }}</text></text>
        <text class="metric-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ metric.label }}</text>
        <text class="metric-desc" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{ metric.desc }}</text>
      </view>
    </view>
    
    <!-- 双栏图表区 -->
    <view class="chart-section">
      <!-- 左侧饼图 -->
      <view class="chart-card" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
        <text class="chart-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">技能权重分布</text>
        <view class="pie-chart-container">
          <view class="pie-chart">
            <view class="pie-sector" v-for="(sector, index) in skillDistribution" :key="index" :style="{ '--percentage': sector.percentage, '--color': sector.color, '--offset': sector.offset }"></view>
            <view class="pie-center" :style="{ background: isDarkMode ? 'rgba(58, 58, 58, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)' }">
              <text class="pie-center-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">技能</text>
              <text class="pie-center-subtext" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">分布</text>
            </view>
          </view>
          <view class="pie-legend">
            <view class="legend-item" v-for="(sector, index) in skillDistribution" :key="index">
              <view class="legend-color" :style="{ background: 'linear-gradient(120deg, ' + sector.color + ', ' + sector.color + '80)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }"></view>
              <text class="legend-text" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{ sector.name }} {{ sector.percentage }}%</text>
            </view>
          </view>
        </view>
        <text class="chart-insight" :style="{ color: isDarkMode ? '#999' : '#6C757D', background: isDarkMode ? 'rgba(58, 58, 58, 0.8)' : 'rgba(248, 250, 253, 0.8)', backdropFilter: 'blur(10px)' }">{{ skillInsight }}</text>
      </view>
      
      <!-- 右侧水平堆叠条 -->
      <view class="chart-card" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
        <text class="chart-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">核心优势对比</text>
        <view class="bar-chart-container">
          <view class="bar-item" v-for="(item, index) in coreAdvantages" :key="index">
            <text class="bar-label" :style="{ color: isDarkMode ? '#999' : '#6C757D' }">{{ item.label }}</text>
            <view class="bar-wrapper" :style="{ background: isDarkMode ? 'rgba(64, 64, 64, 0.8)' : 'rgba(233, 236, 241, 0.8)', backdropFilter: 'blur(10px)' }">
              <view class="bar-fill" :style="{ width: item.value, background: 'linear-gradient(90deg, #4facfe, #00f2fe)' }"></view>
            </view>
            <text class="bar-value" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ item.score }}</text>
          </view>
        </view>
        <text class="chart-insight" :style="{ color: isDarkMode ? '#999' : '#6C757D', background: isDarkMode ? 'rgba(58, 58, 58, 0.8)' : 'rgba(248, 250, 253, 0.8)', backdropFilter: 'blur(10px)' }">跨部门协同力为最强优势，可重点在面试中举例。</text>
      </view>
    </view>
    
    <!-- 底部区域：机会洞察 + 行动建议 -->
    <view class="insight-section" :style="{ background: isDarkMode ? 'linear-gradient(180deg, rgba(44, 44, 44, 0.8), rgba(26, 26, 26, 0.8))' : 'linear-gradient(180deg, rgba(232, 240, 254, 0.8), rgba(255, 255, 255, 0.8))', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
      <view class="insight-left">
        <text class="insight-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">机会雷达</text>
        <view class="insight-list">
          <view class="insight-item" v-for="(item, index) in opportunities" :key="index" :style="{ background: isDarkMode ? 'rgba(58, 58, 58, 0.8)' : 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)' }">
            <text class="insight-dot" :style="{ color: '#007AFF' }">{{ item.icon }}</text>
            <text class="insight-text" :style="{ color: isDarkMode ? '#ffffff' : '#3A3A3A' }">{{ item.text }}</text>
          </view>
        </view>
      </view>
      <view class="insight-right">
        <text class="insight-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">行动建议</text>
        <view class="action-list">
          <view class="action-item" v-for="(item, index) in actions" :key="index" :style="{ background: isDarkMode ? 'rgba(58, 58, 58, 0.8)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)' }">
            <text class="action-text" :style="{ color: isDarkMode ? '#ffffff' : '#3A3A3A' }">{{ item }}</text>
          </view>
        </view>
      </view>
      <text class="model-version" :style="{ color: isDarkMode ? '#666' : '#ADB5BD', borderTop: isDarkMode ? '1px solid #404040' : '1px solid #E9ECF1' }">竞争力模型 v3.2 · 基于 2026 年招聘软件市场数据 | 覆盖全国31个主要城市</text>
    </view>
    
    <!-- 职位选择器模态框 -->
    <view v-if="showCascadePicker" class="cascade-overlay" @click="closeCascadePicker">
      <view class="cascade-modal" @click.stop>
        <view class="cascade-header">
          <text class="cascade-title">选择职位</text>
          <text class="cascade-close" @click="confirmCascadeSelection">确定</text>
        </view>
        <view class="cascade-body">
          <scroll-view class="category-list" scroll-y>
            <view 
              v-for="category in mainCategories" 
              :key="category.id"
              :class="['category-item', selectedCategoryId === category.id ? 'active' : '']"
              @click="selectCategory(category)"
            >
              <text>{{ category.name }}</text>
            </view>
          </scroll-view>
          <scroll-view class="position-list" scroll-y>
            <view 
              v-for="position in currentPositions" 
              :key="position.id"
              :class="['position-item', selectedPositionId === position.id ? 'active' : '']"
              @click="selectPosition(position)"
            >
              <text>{{ position.name }}</text>
              <text v-if="selectedPositionId === position.id" class="check-icon">✓</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { themeManager } from '@/common/utils/theme-simple.js'
import { userApi } from '@/common/api/user.js'
import { resumeApi } from '@/common/api/resume.js'

export default {
  data() {
    return {
      // 主题相关
      currentTheme: 'light',
      isDarkMode: false,
      
      // 用户信息
      userInfo: {
        avatar: '/static/logo.png',
        nickname: '张三',
        position: '资深产品经理',
        competitiveLevel: 'S+'
      },
      
      // 当前显示的竞争力数据
      score: 96,
      competitiveDesc: '你的竞争力处于市场前 5% 的稀缺区间',
      metrics: [],
      skillDistribution: [],
      coreAdvantages: [],
      opportunities: [],
      actions: [],
      skillInsight: '',
      
      // 职位选择相关
      showCascadePicker: false,
      selectedCategoryId: '',
      selectedCategoryName: '',
      selectedPositionId: '',
      selectedPositionName: '',
      
      // 职位数据
      mainCategories: [
        { id: '101', name: '前端开发' }, 
        { id: '102', name: '后端开发' }, 
        { id: '103', name: '移动端开发' }, 
        { id: '104', name: '数据与AI' }, 
        { id: '105', name: '运维与测试' }, 
        { id: '106', name: '产品设计' }, 
        { id: '107', name: '网络安全' }, 
        { id: '108', name: '嵌入式开发' }, 
        { id: '200', name: '产品与设计类' }, 
        { id: '300', name: '技术管理类' }
      ],
      
      positionDetails: {
        '101': [
          { id: '1', name: 'Web前端工程师' }, { id: '2', name: '移动端前端工程师' }, { id: '3', name: '小程序开发工程师' },
          { id: '4', name: '跨平台开发工程师' }, { id: '5', name: '前端架构师' }, { id: '6', name: 'Node.js全栈工程师' }
        ],
        '102': [
          { id: '7', name: 'Java开发工程师' }, { id: '8', name: 'Python开发工程师' }, { id: '9', name: 'Go开发工程师' },
          { id: '10', name: 'C++开发工程师' }, { id: '11', name: 'PHP开发工程师' }, { id: '12', name: '微服务架构师' }
        ],
        '103': [
          { id: '13', name: 'Android开发工程师' }, { id: '14', name: 'iOS开发工程师' }, { id: '15', name: '鸿蒙开发工程师' },
          { id: '16', name: '移动游戏开发工程师' }
        ],
        '104': [
          { id: '17', name: '数据分析师' }, { id: '18', name: '数据挖掘工程师' }, { id: '19', name: '机器学习工程师' },
          { id: '20', name: '深度学习工程师' }, { id: '21', name: 'AI算法工程师' }, { id: '22', name: '大数据工程师' }
        ],
        '105': [
          { id: '23', name: 'DevOps工程师' }, { id: '24', name: 'SRE工程师' }, { id: '25', name: '测试工程师' },
          { id: '26', name: '自动化测试工程师' }, { id: '27', name: '性能测试工程师' }
        ],
        '106': [
          { id: '28', name: '产品经理' }, { id: '29', name: '产品设计师' }, { id: '30', name: 'UX设计师' },
          { id: '31', name: 'UI设计师' }, { id: '32', name: '交互设计师' }
        ],
        '107': [
          { id: '33', name: '网络安全工程师' }, { id: '34', name: '渗透测试工程师' }, { id: '35', name: '安全运维工程师' },
          { id: '36', name: '安全架构师' }
        ],
        '108': [
          { id: '37', name: '嵌入式开发工程师' }, { id: '38', name: 'FPGA工程师' }, { id: '39', name: '硬件工程师' },
          { id: '40', name: '物联网工程师' }
        ],
        '200': [
          { id: '41', name: '产品经理（技术型）' }, { id: '42', name: 'UI设计师' }, { id: '43', name: '交互设计师(IXD)' },
          { id: '44', name: 'UX研究员' }
        ],
        '300': [
          { id: '45', name: '技术经理/组长' }, { id: '46', name: '架构师' }, { id: '47', name: '研发总监' },
          { id: '48', name: 'CTO/技术VP' }
        ]
      },
      
      // 静态职位数据映射表 - 每个职位ID对应完整的数据内容
      positionDataMap: {
        // 前端开发 - Web前端工程师
        '1': {
          score: 78,
          competitiveDesc: '你的React前端开发竞争力处于市场前 22% 的区间',
          metrics: [
            { value: '73%', change: '2%', label: '岗位匹配度', desc: '与"Web前端工程师"基本契合' },
            { value: '7.8 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.5' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 18 次，简历查看率 +15%' }
          ],
          skillDistribution: [
            { name: 'React框架', percentage: 35, color: '#007AFF', offset: 0 },
            { name: '状态管理', percentage: 20, color: '#5E9EFF', offset: 35 },
            { name: '前端工程化', percentage: 25, color: '#8EB9FF', offset: 55 },
            { name: '性能优化', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: 'React生态熟悉', value: '75%', score: '7.5' },
            { label: '前端工程化', value: '73%', score: '7.3' },
            { label: '性能优化', value: '74%', score: '7.4' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 68%' },
            { icon: '•', text: '高潜赛道：AI 前端应用，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +8%~12%' },
            { icon: '•', text: '技术栈匹配：75% 以上的React岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新React相关项目经验，突出状态管理和前端工程化能力',
            '开启"暗聘模式"，定向接收大厂前端团队直推',
            '学习Next.js等服务端渲染技术，提升全栈能力',
            '参与开源项目，增加技术影响力'
          ],
          skillInsight: 'React框架和前端工程化构成核心优势，占总技能权重 60%。'
        },
        // 移动端前端工程师
        '2': {
          score: 76,
          competitiveDesc: '你的移动端/跨平台前端开发竞争力处于市场前 24% 的区间',
          metrics: [
            { value: '70%', change: '1%', label: '岗位匹配度', desc: '与"移动端前端工程师"基本契合' },
            { value: '7.6 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.4' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 16 次，简历查看率 +12%' }
          ],
          skillDistribution: [
            { name: 'Vue框架', percentage: 35, color: '#007AFF', offset: 0 },
            { name: '响应式设计', percentage: 25, color: '#5E9EFF', offset: 35 },
            { name: '前端工程化', percentage: 20, color: '#8EB9FF', offset: 60 },
            { name: '性能优化', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: '移动端开发', value: '72%', score: '7.2' },
            { label: '响应式设计', value: '70%', score: '7.0' },
            { label: '跨平台技术', value: '71%', score: '7.1' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（美团）岗位匹配度 > 64%' },
            { icon: '•', text: '高潜赛道：企业级应用开发，你的技能匹配度 B' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +6%~10%' },
            { icon: '•', text: '技术栈匹配：70% 以上的移动端/跨平台前端岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新移动端/跨平台前端相关项目经验，突出响应式设计和组件化开发能力',
            '开启"暗聘模式"，定向接收企业级应用开发团队直推',
            '学习Flutter、React Native等跨平台技术，提升全栈能力',
            '参与移动端前端开源项目，增加技术影响力'
          ],
          skillInsight: '移动端开发和响应式设计构成核心优势，占总技能权重 60%。'
        },
        // 小程序开发工程师
        '3': {
          score: 75,
          competitiveDesc: '你的小程序开发竞争力处于市场前 25% 的区间',
          metrics: [
            { value: '69%', change: '1%', label: '岗位匹配度', desc: '与"小程序开发工程师"基本契合' },
            { value: '7.5 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.3' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 15 次，简历查看率 +11%' }
          ],
          skillDistribution: [
            { name: '小程序框架', percentage: 35, color: '#007AFF', offset: 0 },
            { name: '组件化', percentage: 25, color: '#5E9EFF', offset: 35 },
            { name: '云开发', percentage: 20, color: '#8EB9FF', offset: 60 },
            { name: '性能优化', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: '小程序开发', value: '72%', score: '7.2' },
            { label: '组件化设计', value: '70%', score: '7.0' },
            { label: '云开发能力', value: '69%', score: '6.9' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（腾讯）岗位匹配度 > 63%' },
            { icon: '•', text: '高潜赛道：小程序生态，你的技能匹配度 B' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +5%~9%' },
            { icon: '•', text: '技术栈匹配：68% 以上的小程序岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新小程序项目经验，突出组件化和云开发能力',
            '开启"暗聘模式"，定向接收小程序开发团队直推',
            '学习跨平台小程序框架，提升开发效率',
            '参与小程序开源项目，增加技术影响力'
          ],
          skillInsight: '小程序框架和组件化构成核心优势，占总技能权重 60%。'
        },
        // 跨平台开发工程师
        '4': {
          score: 77,
          competitiveDesc: '你的跨平台开发竞争力处于市场前 23% 的区间',
          metrics: [
            { value: '71%', change: '2%', label: '岗位匹配度', desc: '与"跨平台开发工程师"基本契合' },
            { value: '7.7 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.5' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 17 次，简历查看率 +14%' }
          ],
          skillDistribution: [
            { name: 'Flutter/RN', percentage: 35, color: '#007AFF', offset: 0 },
            { name: '原生交互', percentage: 25, color: '#5E9EFF', offset: 35 },
            { name: '状态管理', percentage: 20, color: '#8EB9FF', offset: 60 },
            { name: '性能优化', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: '跨平台框架', value: '74%', score: '7.4' },
            { label: '原生交互', value: '72%', score: '7.2' },
            { label: '状态管理', value: '71%', score: '7.1' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 65%' },
            { icon: '•', text: '高潜赛道：跨端应用，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +7%~11%' },
            { icon: '•', text: '技术栈匹配：72% 以上的跨平台岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新跨平台项目经验，突出框架和原生交互能力',
            '开启"暗聘模式"，定向接收大厂移动团队直推',
            '学习新跨平台技术，保持技术领先',
            '参与跨平台开源项目，增加技术影响力'
          ],
          skillInsight: '跨平台框架和原生交互构成核心优势，占总技能权重 60%。'
        },
        // 前端架构师
        '5': {
          score: 80,
          competitiveDesc: '你的前端架构师/全栈开发竞争力处于市场前 20% 的区间',
          metrics: [
            { value: '75%', change: '2%', label: '岗位匹配度', desc: '与"前端架构师"基本契合' },
            { value: '8.0 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.7' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 19 次，简历查看率 +16%' }
          ],
          skillDistribution: [
            { name: '前端架构', percentage: 35, color: '#007AFF', offset: 0 },
            { name: '全栈开发', percentage: 25, color: '#5E9EFF', offset: 35 },
            { name: '性能优化', percentage: 20, color: '#8EB9FF', offset: 60 },
            { name: '团队管理', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: '前端架构设计', value: '77%', score: '7.7' },
            { label: '全栈开发能力', value: '76%', score: '7.6' },
            { label: '性能优化', value: '75%', score: '7.5' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：2 家（字节跳动、阿里）岗位匹配度 > 70%' },
            { icon: '•', text: '高潜赛道：AI 前端应用，你的技能匹配度 A-' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +10%~15%' },
            { icon: '•', text: '技术栈匹配：80% 以上的前端架构师岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新前端架构相关项目经验，突出全栈开发和性能优化能力',
            '开启"暗聘模式"，定向接收大厂前端架构团队直推',
            '学习Serverless等云原生技术，提升架构能力',
            '参与前端开源项目，增加技术影响力'
          ],
          skillInsight: '前端架构和全栈开发构成核心优势，占总技能权重 60%。'
        },
        // Node.js全栈工程师
        '6': {
          score: 79,
          competitiveDesc: '你的Node.js全栈开发竞争力处于市场前 21% 的区间',
          metrics: [
            { value: '74%', change: '2%', label: '岗位匹配度', desc: '与"Node.js全栈工程师"基本契合' },
            { value: '7.9 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.6' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 18 次，简历查看率 +15%' }
          ],
          skillDistribution: [
            { name: 'Node.js', percentage: 35, color: '#007AFF', offset: 0 },
            { name: '数据库', percentage: 25, color: '#5E9EFF', offset: 35 },
            { name: '前端框架', percentage: 20, color: '#8EB9FF', offset: 60 },
            { name: '部署运维', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: 'Node.js开发', value: '76%', score: '7.6' },
            { label: '数据库设计', value: '74%', score: '7.4' },
            { label: '全栈能力', value: '75%', score: '7.5' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 68%' },
            { icon: '•', text: '高潜赛道：BFF架构，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +9%~13%' },
            { icon: '•', text: '技术栈匹配：76% 以上的全栈岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新Node.js项目经验，突出数据库和全栈能力',
            '开启"暗聘模式"，定向接收全栈团队直推',
            '学习微服务架构，提升后端能力',
            '参与Node.js开源项目，增加技术影响力'
          ],
          skillInsight: 'Node.js和数据库构成核心优势，占总技能权重 60%。'
        },
        // Java开发工程师
        '7': {
          score: 79,
          competitiveDesc: '你的Java后端开发竞争力处于市场前 21% 的区间',
          metrics: [
            { value: '74%', change: '2%', label: '岗位匹配度', desc: '与"Java开发工程师"基本契合' },
            { value: '7.9 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.6' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 20 次，简历查看率 +18%' }
          ],
          skillDistribution: [
            { name: 'Java核心', percentage: 30, color: '#007AFF', offset: 0 },
            { name: 'Spring生态', percentage: 25, color: '#5E9EFF', offset: 30 },
            { name: '数据库', percentage: 20, color: '#8EB9FF', offset: 55 },
            { name: '微服务', percentage: 25, color: '#C0D6FF', offset: 75 }
          ],
          coreAdvantages: [
            { label: 'Java核心技术', value: '76%', score: '7.6' },
            { label: 'Spring生态', value: '75%', score: '7.5' },
            { label: '微服务架构', value: '74%', score: '7.4' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（阿里）岗位匹配度 > 69%' },
            { icon: '•', text: '高潜赛道：云原生应用，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +8%~12%' },
            { icon: '•', text: '技术栈匹配：75% 以上的Java岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新Java核心项目经验，突出Spring生态和微服务架构能力',
            '开启"暗聘模式"，定向接收大厂后端团队直推',
            '学习云原生技术（Docker、Kubernetes），提升部署能力',
            '参与Java开源项目，增加技术影响力'
          ],
          skillInsight: 'Java核心和Spring生态构成核心优势，占总技能权重 55%。'
        },
        // Python开发工程师
        '8': {
          score: 77,
          competitiveDesc: '你的Python后端开发竞争力处于市场前 23% 的区间',
          metrics: [
            { value: '72%', change: '2%', label: '岗位匹配度', desc: '与"Python开发工程师"基本契合' },
            { value: '7.7 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.5' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 17 次，简历查看率 +16%' }
          ],
          skillDistribution: [
            { name: 'Python核心', percentage: 30, color: '#007AFF', offset: 0 },
            { name: 'Web框架', percentage: 25, color: '#5E9EFF', offset: 30 },
            { name: '数据处理', percentage: 25, color: '#8EB9FF', offset: 55 },
            { name: 'DevOps', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: 'Python核心技术', value: '74%', score: '7.4' },
            { label: '数据处理', value: '73%', score: '7.3' },
            { label: 'Web开发', value: '72%', score: '7.2' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 67%' },
            { icon: '•', text: '高潜赛道：AI 后端服务，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +7%~11%' },
            { icon: '•', text: '技术栈匹配：72% 以上的Python岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新Python核心项目经验，突出数据处理和Web框架能力',
            '开启"暗聘模式"，定向接收AI相关团队直推',
            '学习机器学习和深度学习框架，提升AI应用能力',
            '参与Python开源项目，增加技术影响力'
          ],
          skillInsight: 'Python核心和数据处理构成核心优势，占总技能权重 55%。'
        },
        // Go开发工程师
        '9': {
          score: 76,
          competitiveDesc: '你的Go后端开发竞争力处于市场前 24% 的区间',
          metrics: [
            { value: '71%', change: '2%', label: '岗位匹配度', desc: '与"Go开发工程师"基本契合' },
            { value: '7.6 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.4' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 16 次，简历查看率 +14%' }
          ],
          skillDistribution: [
            { name: 'Go核心', percentage: 30, color: '#007AFF', offset: 0 },
            { name: '并发编程', percentage: 25, color: '#5E9EFF', offset: 30 },
            { name: '微服务', percentage: 25, color: '#8EB9FF', offset: 55 },
            { name: 'DevOps', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: 'Go核心技术', value: '73%', score: '7.3' },
            { label: '并发编程', value: '72%', score: '7.2' },
            { label: '微服务架构', value: '71%', score: '7.1' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 66%' },
            { icon: '•', text: '高潜赛道：云原生应用，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +6%~10%' },
            { icon: '•', text: '技术栈匹配：70% 以上的Go岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新Go核心项目经验，突出并发编程和微服务架构能力',
            '开启"暗聘模式"，定向接收大厂后端团队直推',
            '学习云原生技术（Docker、Kubernetes），提升部署能力',
            '参与Go开源项目，增加技术影响力'
          ],
          skillInsight: 'Go核心和并发编程构成核心优势，占总技能权重 55%。'
        },
        // C++开发工程师
        '10': {
          score: 75,
          competitiveDesc: '你的C++后端开发竞争力处于市场前 25% 的区间',
          metrics: [
            { value: '69%', change: '1%', label: '岗位匹配度', desc: '与"C++开发工程师"基本契合' },
            { value: '7.5 / 10.0', label: '技能广度', desc: '覆盖 3 大核心能力域，高于行业平均 0.3' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 14 次，简历查看率 +12%' }
          ],
          skillDistribution: [
            { name: 'C++核心', percentage: 30, color: '#007AFF', offset: 0 },
            { name: '性能优化', percentage: 25, color: '#5E9EFF', offset: 30 },
            { name: '系统编程', percentage: 25, color: '#8EB9FF', offset: 55 },
            { name: '网络编程', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: 'C++核心技术', value: '72%', score: '7.2' },
            { label: '性能优化', value: '71%', score: '7.1' },
            { label: '系统编程', value: '70%', score: '7.0' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（腾讯）岗位匹配度 > 63%' },
            { icon: '•', text: '高潜赛道：游戏开发，你的技能匹配度 B' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +5%~9%' },
            { icon: '•', text: '技术栈匹配：68% 以上的C++岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新C++核心项目经验，突出性能优化和系统编程能力',
            '开启"暗聘模式"，定向接收大厂后端团队直推',
            '学习游戏开发或嵌入式系统开发，提升专业领域能力',
            '参与C++开源项目，增加技术影响力'
          ],
          skillInsight: 'C++核心和性能优化构成核心优势，占总技能权重 55%。'
        },
        // PHP开发工程师
        '11': {
          score: 74,
          competitiveDesc: '你的PHP后端开发竞争力处于市场前 26% 的区间',
          metrics: [
            { value: '68%', change: '1%', label: '岗位匹配度', desc: '与"PHP开发工程师"基本契合' },
            { value: '7.4 / 10.0', label: '技能广度', desc: '覆盖 3 大核心能力域，高于行业平均 0.2' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 13 次，简历查看率 +10%' }
          ],
          skillDistribution: [
            { name: 'PHP核心', percentage: 30, color: '#007AFF', offset: 0 },
            { name: 'Web框架', percentage: 25, color: '#5E9EFF', offset: 30 },
            { name: '数据库', percentage: 25, color: '#8EB9FF', offset: 55 },
            { name: '前端集成', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: 'PHP核心技术', value: '71%', score: '7.1' },
            { label: 'Web框架', value: '70%', score: '7.0' },
            { label: '数据库', value: '69%', score: '6.9' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（阿里）岗位匹配度 > 62%' },
            { icon: '•', text: '高潜赛道：电商系统开发，你的技能匹配度 B' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +4%~8%' },
            { icon: '•', text: '技术栈匹配：65% 以上的PHP岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新PHP核心项目经验，突出Web框架和数据库能力',
            '开启"暗聘模式"，定向接收电商企业直推',
            '学习现代前端框架，提升全栈开发能力',
            '参与PHP开源项目，增加技术影响力'
          ],
          skillInsight: 'PHP核心和Web框架构成核心优势，占总技能权重 55%。'
        },
        // 微服务架构师
        '12': {
          score: 79,
          competitiveDesc: '你的微服务架构师竞争力处于市场前 21% 的区间',
          metrics: [
            { value: '74%', change: '2%', label: '岗位匹配度', desc: '与"微服务架构师"基本契合' },
            { value: '7.9 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.5' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 19 次，简历查看率 +17%' }
          ],
          skillDistribution: [
            { name: '微服务架构', percentage: 30, color: '#007AFF', offset: 0 },
            { name: '云原生', percentage: 25, color: '#5E9EFF', offset: 30 },
            { name: '分布式系统', percentage: 25, color: '#8EB9FF', offset: 55 },
            { name: 'DevOps', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: '微服务架构', value: '76%', score: '7.6' },
            { label: '云原生', value: '75%', score: '7.5' },
            { label: '分布式系统', value: '74%', score: '7.4' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 69%' },
            { icon: '•', text: '高潜赛道：云原生架构，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +8%~12%' },
            { icon: '•', text: '技术栈匹配：75% 以上的微服务架构师岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新微服务架构项目经验，突出云原生和分布式系统能力',
            '开启"暗聘模式"，定向接收大厂架构团队直推',
            '学习Kubernetes和服务网格技术，提升云原生架构能力',
            '参与微服务相关开源项目，增加技术影响力'
          ],
          skillInsight: '微服务架构和云原生构成核心优势，占总技能权重 55%。'
        },
        // 产品经理
        '28': {
          score: 78,
          competitiveDesc: '你的产品经理竞争力处于市场前 22% 的区间',
          metrics: [
            { value: '73%', change: '2%', label: '岗位匹配度', desc: '与"产品经理"基本契合' },
            { value: '7.8 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.5' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 16 次，简历查看率 +14%' }
          ],
          skillDistribution: [
            { name: '产品规划', percentage: 32, color: '#007AFF', offset: 0 },
            { name: '用户研究', percentage: 28, color: '#5E9EFF', offset: 32 },
            { name: '数据分析', percentage: 22, color: '#8EB9FF', offset: 60 },
            { name: '沟通协调', percentage: 18, color: '#C0D6FF', offset: 82 }
          ],
          coreAdvantages: [
            { label: '产品规划', value: '75%', score: '7.5' },
            { label: '用户研究', value: '74%', score: '7.4' },
            { label: '数据分析', value: '73%', score: '7.3' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 68%' },
            { icon: '•', text: '高潜赛道：AI 产品经理，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +8%~12%' },
            { icon: '•', text: '行业经验：覆盖电商、社交等领域' }
          ],
          actions: [
            '优先更新产品规划项目经验，突出用户研究和数据分析能力',
            '开启"暗聘模式"，定向接收大厂产品团队直推',
            '学习AI产品设计，提升AI应用场景理解能力',
            '参与产品社区活动，增加产品思维影响力'
          ],
          skillInsight: '产品规划与用户研究构成核心优势，占总技能权重 60%。'
        },
        // UI设计师
        '31': {
          score: 75,
          competitiveDesc: '你的UI设计竞争力处于市场前 25% 的区间',
          metrics: [
            { value: '69%', change: '1%', label: '岗位匹配度', desc: '与"UI设计师"基本契合' },
            { value: '7.5 / 10.0', label: '技能广度', desc: '覆盖 3 大核心能力域，高于行业平均 0.3' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 14 次，简历查看率 +12%' }
          ],
          skillDistribution: [
            { name: 'UI设计', percentage: 40, color: '#007AFF', offset: 0 },
            { name: '交互设计', percentage: 30, color: '#5E9EFF', offset: 40 },
            { name: '用户研究', percentage: 15, color: '#8EB9FF', offset: 70 },
            { name: '动效设计', percentage: 15, color: '#C0D6FF', offset: 85 }
          ],
          coreAdvantages: [
            { label: 'UI设计', value: '71%', score: '7.1' },
            { label: '交互设计', value: '70%', score: '7.0' },
            { label: '视觉美感', value: '72%', score: '7.2' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 63%' },
            { icon: '•', text: '高潜赛道：AI 产品界面设计，你的技能匹配度 B' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +5%~9%' },
            { icon: '•', text: '设计工具：熟悉Figma、Sketch等主流设计工具' }
          ],
          actions: [
            '优先更新UI设计项目经验，突出视觉美感和交互设计能力',
            '开启"暗聘模式"，定向接收大厂设计团队直推',
            '学习AI产品界面设计，提升AI交互体验设计能力',
            '参与设计社区活动，增加设计作品影响力'
          ],
          skillInsight: 'UI设计和交互设计构成核心优势，占总技能权重 70%。'
        },
        // 数据分析师
        '17': {
          score: 80,
          competitiveDesc: '你的数据/AI竞争力处于市场前 20% 的区间',
          metrics: [
            { value: '75%', change: '2%', label: '岗位匹配度', desc: '与"数据分析师"基本契合' },
            { value: '8.0 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.6' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 22 次，简历查看率 +18%' }
          ],
          skillDistribution: [
            { name: '数据处理', percentage: 30, color: '#007AFF', offset: 0 },
            { name: '算法能力', percentage: 30, color: '#5E9EFF', offset: 30 },
            { name: '模型训练', percentage: 25, color: '#8EB9FF', offset: 60 },
            { name: '业务理解', percentage: 15, color: '#C0D6FF', offset: 85 }
          ],
          coreAdvantages: [
            { label: '算法能力', value: '77%', score: '7.7' },
            { label: '数据处理', value: '76%', score: '7.6' },
            { label: '模型训练', value: '75%', score: '7.5' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 70%' },
            { icon: '•', text: '高潜赛道：大模型应用开发，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +9%~13%' },
            { icon: '•', text: '技术栈匹配：78% 以上的数据/AI岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新数据处理和算法项目经验，突出模型训练和业务理解能力',
            '开启"暗聘模式"，定向接收AI相关团队直推',
            '学习大模型应用开发，提升AI落地能力',
            '参与AI开源项目，增加技术影响力'
          ],
          skillInsight: '数据处理和算法能力构成核心优势，占总技能权重 60%。'
        },
        // 测试工程师
        '25': {
          score: 74,
          competitiveDesc: '你的测试竞争力处于市场前 26% 的区间',
          metrics: [
            { value: '68%', change: '1%', label: '岗位匹配度', desc: '与"测试工程师"基本契合' },
            { value: '7.4 / 10.0', label: '技能广度', desc: '覆盖 3 大核心能力域，高于行业平均 0.3' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 12 次，简历查看率 +10%' }
          ],
          skillDistribution: [
            { name: '功能测试', percentage: 30, color: '#007AFF', offset: 0 },
            { name: '自动化测试', percentage: 25, color: '#5E9EFF', offset: 30 },
            { name: '性能测试', percentage: 20, color: '#8EB9FF', offset: 55 },
            { name: '安全测试', percentage: 25, color: '#C0D6FF', offset: 75 }
          ],
          coreAdvantages: [
            { label: '功能测试', value: '70%', score: '7.0' },
            { label: '自动化测试', value: '69%', score: '6.9' },
            { label: '性能测试', value: '68%', score: '6.8' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 62%' },
            { icon: '•', text: '高潜赛道：AI 测试，你的技能匹配度 B' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +4%~8%' },
            { icon: '•', text: '测试工具：熟悉Selenium、Jmeter等主流测试工具' }
          ],
          actions: [
            '优先更新功能测试和自动化测试项目经验，突出性能测试和安全测试能力',
            '开启"暗聘模式"，定向接收大厂测试团队直推',
            '学习AI测试方法，提升AI产品测试能力',
            '参与测试社区活动，增加测试经验分享'
          ],
          skillInsight: '功能测试和自动化测试构成核心优势，占总技能权重 55%。'
        },
        // Android开发工程师
        '13': {
          score: 76,
          competitiveDesc: '你的移动端开发竞争力处于市场前 24% 的区间',
          metrics: [
            { value: '71%', change: '2%', label: '岗位匹配度', desc: '与"Android开发工程师"基本契合' },
            { value: '7.6 / 10.0', label: '技能广度', desc: '覆盖 4 大核心能力域，高于行业平均 0.4' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 17 次，简历查看率 +14%' }
          ],
          skillDistribution: [
            { name: '移动开发', percentage: 35, color: '#007AFF', offset: 0 },
            { name: 'UI/UX', percentage: 25, color: '#5E9EFF', offset: 35 },
            { name: '性能优化', percentage: 20, color: '#8EB9FF', offset: 60 },
            { name: '跨平台', percentage: 20, color: '#C0D6FF', offset: 80 }
          ],
          coreAdvantages: [
            { label: '移动开发', value: '73%', score: '7.3' },
            { label: 'UI/UX设计', value: '72%', score: '7.2' },
            { label: '性能优化', value: '71%', score: '7.1' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 66%' },
            { icon: '•', text: '高潜赛道：AI 移动应用，你的技能匹配度 B+' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +6%~10%' },
            { icon: '•', text: '技术栈匹配：70% 以上的移动端岗位要求与你的技能基本匹配' }
          ],
          actions: [
            '优先更新移动端开发项目经验，突出UI/UX设计和性能优化能力',
            '开启"暗聘模式"，定向接收大厂移动开发团队直推',
            '学习跨平台技术（Flutter、React Native），提升全栈能力',
            '参与移动开发开源项目，增加技术影响力'
          ],
          skillInsight: '移动开发和UI/UX设计构成核心优势，占总技能权重 60%。'
        },
        // 默认数据（用于未定义的职位）
        'default': {
          score: 72,
          competitiveDesc: '你的竞争力处于市场前 28% 的区间',
          metrics: [
            { value: '66%', change: '1%', label: '岗位匹配度', desc: '与当前职位基本契合' },
            { value: '7.2 / 10.0', label: '技能广度', desc: '覆盖 3 大核心能力域，高于行业平均 0.2' },
            { value: '温 🌡️', label: '市场热度', desc: '近7日被搜索 10 次，简历查看率 +8%' }
          ],
          skillDistribution: [
            { name: '专业技能', percentage: 30, color: '#007AFF', offset: 0 },
            { name: '项目经验', percentage: 25, color: '#5E9EFF', offset: 30 },
            { name: '沟通能力', percentage: 20, color: '#8EB9FF', offset: 55 },
            { name: '学习能力', percentage: 25, color: '#C0D6FF', offset: 75 }
          ],
          coreAdvantages: [
            { label: '专业技能', value: '68%', score: '6.8' },
            { label: '项目经验', value: '67%', score: '6.7' },
            { label: '沟通能力', value: '66%', score: '6.6' }
          ],
          opportunities: [
            { icon: '•', text: '头部大厂机会：1 家（字节跳动）岗位匹配度 > 60%' },
            { icon: '•', text: '高潜赛道：数字化转型，你的技能匹配度 B' },
            { icon: '•', text: '薪资溢价区间：基于竞争力模型，当前市场溢价 +2%~6%' }
          ],
          actions: [
            '优先更新专业技能和项目经验，突出沟通能力和学习能力',
            '开启"暗聘模式"，定向接收相关企业直推',
            '学习数字化转型相关技能，提升职场竞争力',
            '参与行业社区活动，增加行业经验分享'
          ],
          skillInsight: '专业技能和项目经验构成核心优势，占总技能权重 55%。'
        }
      }
    }
  },
  computed: {
    // 当前分类下的职位列表
    currentPositions() {
      if (!this.selectedCategoryId) return []
      return this.positionDetails[this.selectedCategoryId] || []
    }
  },
  onLoad() {
    this.initTheme()
    this.initializeDefaultSelection()
    this.fetchUserInfo()
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
    
    // 初始化默认选择
    initializeDefaultSelection() {
      // 默认选中后端开发分类
      const backendCategory = this.mainCategories.find(cat => cat.name === '后端开发')
      if (backendCategory) {
        this.selectedCategoryId = backendCategory.id
        this.selectedCategoryName = backendCategory.name
        const positions = this.positionDetails[backendCategory.id] || []
        if (positions.length > 0) {
          const pythonDeveloper = positions.find(pos => pos.name === 'Python开发工程师')
          if (pythonDeveloper) {
            this.selectedPositionId = pythonDeveloper.id
            this.selectedPositionName = pythonDeveloper.name
          } else {
            // 如果没有Python开发工程师职位，选择第一个职位
            this.selectedPositionId = positions[0].id
            this.selectedPositionName = positions[0].name
          }
          // 加载职位数据
          this.loadPositionData(this.selectedPositionId)
        }
      }
    },
    
    // 加载职位数据（从静态映射表）
    loadPositionData(positionId) {
      const positionData = this.positionDataMap[positionId] || this.positionDataMap['default']
      if (positionData) {
        this.score = positionData.score
        this.competitiveDesc = positionData.competitiveDesc
        this.metrics = positionData.metrics
        this.skillDistribution = positionData.skillDistribution
        this.coreAdvantages = positionData.coreAdvantages
        this.opportunities = positionData.opportunities
        this.actions = positionData.actions
        this.skillInsight = positionData.skillInsight
      }
    },
    
    // 打开级联选择器
    openCascadePicker() {
      this.showCascadePicker = true
    },
    
    // 关闭级联选择器
    closeCascadePicker() {
      this.showCascadePicker = false
    },
    
    // 选择分类
    selectCategory(category) {
      this.selectedCategoryId = category.id
      this.selectedCategoryName = category.name
      const positions = this.positionDetails[category.id] || []
      if (positions.length > 0) {
        this.selectedPositionId = positions[0].id
        this.selectedPositionName = positions[0].name
        // 加载职位数据
        this.loadPositionData(this.selectedPositionId)
      } else {
        this.selectedPositionId = ''
        this.selectedPositionName = ''
      }
    },
    
    // 选择职位
    selectPosition(position) {
      this.selectedPositionId = position.id
      this.selectedPositionName = position.name
      // 加载职位数据
      this.loadPositionData(this.selectedPositionId)
    },
    
    // 确认选择
    confirmCascadeSelection() {
      this.showCascadePicker = false
      // 再次加载确保数据正确
      if (this.selectedPositionId) {
        this.loadPositionData(this.selectedPositionId)
      }
    },
    
    // 检查头像数据是否有效
    isValidAvatar(avatar) {
      if (!avatar || avatar === '') {
        return false
      }
      
      // 检查是否是URL格式（以http://或https://开头）
      if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return false
      }
      
      // 清理空白字符
      const cleaned = avatar.replace(/\s+/g, '')
      
      // 尝试使用后端返回的数据，即使不是标准格式
      return cleaned.length > 0
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      try {
        // 首先从本地存储获取用户信息
        const userInfo = uni.getStorageSync('userInfo')
        if (userInfo) {
          // 处理userInfo可能是JSON字符串的情况
          if (typeof userInfo === 'string') {
            try {
              this.userInfo = JSON.parse(userInfo)
            } catch (e) {
              console.error('解析userInfo失败:', e)
              this.userInfo = null
            }
          } else {
            this.userInfo = userInfo
          }
        }
        
        // 尝试从后端获取最新的用户信息
        try {
          // 首先尝试使用专门的获取名称和头像的接口
          const res = await userApi.getUserNameAndAvatar()
          if (res) {
            // 更新用户信息
            this.userInfo.nickname = res.user_name || res.real_name
            if (this.isValidAvatar(res.user_avatar)) {
              this.userInfo.avatar = res.user_avatar
            }
            // 保存到本地存储
            const userInfoToSave = {
              nickname: res.user_name || res.real_name,
              avatar: this.userInfo.avatar
            }
            uni.setStorageSync('userInfo', JSON.stringify(userInfoToSave))
          }
        } catch (error) {
          console.error('获取用户名称和头像失败:', error)
          // 如果失败，尝试使用通用的用户信息接口
          try {
            const res = await userApi.getUserProfile()
            if (res) {
              this.userInfo.nickname = res.real_name || res.name
              if (this.isValidAvatar(res.avatar_url || res.avatar)) {
                this.userInfo.avatar = res.avatar_url || res.avatar
              }
              // 保存到本地存储
              const userInfoToSave = {
                nickname: res.real_name || res.name,
                avatar: this.userInfo.avatar
              }
              uni.setStorageSync('userInfo', JSON.stringify(userInfoToSave))
            }
          } catch (error) {
            console.error('获取用户信息失败:', error)
          }
        }
        
        // 获取用户的期望职位信息
        try {
          const intention = await resumeApi.getIntention()
          if (intention && intention.target_positions) {
            // 确保target_positions是数组
            if (Array.isArray(intention.target_positions)) {
              this.userInfo.positions = intention.target_positions
            } else if (intention.target_positions) {
              // 如果不是数组，转换为数组
              this.userInfo.positions = [intention.target_positions]
            }
          }
        } catch (error) {
          console.error('获取用户期望职位失败:', error)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
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
  padding: 32px 24px;
  margin: 0 0 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-radius: 16px;
  box-sizing: border-box;
}

.user-header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 16px;
  border: 3px solid #F0F4FF;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.user-name-large {
  font-size: 24px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 8px;
}

.user-title-large {
  font-size: 16px;
  color: #6C757D;
  margin-bottom: 16px;
}

.user-positions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.user-positions .user-title-large {
  margin: 0 8px;
  margin-bottom: 0;
}

.competitive-tag-large {
  display: flex;
  align-items: center;
  background-color: #E8F0FE;
  padding: 10px 20px;
  border-radius: 28px;
  box-shadow: 0 2px 8px rgba(0,122,255,0.2);
}

.tag-text-large {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-right: 6px;
}

.arrow-icon-large {
  font-size: 14px;
  color: #ffffff;
  font-weight: bold;
}

/* 综合竞争力环形图 */
.competitive-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  margin: 0 0 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
}

.competitive-card:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.competitive-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.ring-chart-container {
  flex: 1;
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
  text-align: center;
}

/* 职位选择器容器 */
.position-selector-container {
  flex: 1;
  min-width: 0;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 12px;
}

/* 级联选择器 */
.cascade-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
  border-image: linear-gradient(120deg, #a0c4ff, #cfe2ff) 1;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.15);
}

.cascade-selector:active {
  background: linear-gradient(135deg, #cfe2ff, #E6F0FF);
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(79, 172, 254, 0.2);
}

.selector-content {
  flex: 1;
  font-size: 16px;
  color: #495057;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.selector-content.placeholder {
  color: #94a3b8;
}

.arrow-icon {
  font-size: 20px;
  color: #64748b;
  margin-left: 12px;
  font-weight: 400;
}

/* 级联选择器模态框 */
.cascade-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: flex-end;
  z-index: 2000;
}

.cascade-modal {
  width: 100%;
  height: 70vh;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx 32rpx 0 0;
  animation: slideUp 0.3s ease-out;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8rpx 32rpx rgba(79, 172, 254, 0.2);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.cascade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1rpx solid rgba(160, 196, 255, 0.3);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(230, 240, 255, 0.8));
}

.cascade-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  background: linear-gradient(120deg, #2b6ef0, #00b4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cascade-close {
  font-size: 16px;
  color: #007aff;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.cascade-close:active {
  opacity: 0.7;
  background-color: rgba(0, 122, 255, 0.1);
}

.cascade-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.category-list {
  width: 35%;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-right: 1rpx solid rgba(160, 196, 255, 0.3);
}

.category-item {
  padding: 16px 12px;
  font-size: 14px;
  color: #666;
  transition: all 0.2s ease;
  border-left: 4rpx solid transparent;
}

.category-item:active {
  background-color: #e9ecef;
}

.category-item.active {
  background: linear-gradient(135deg, #fff, #f0f8ff);
  color: #007aff;
  font-weight: 600;
  border-left-color: #007aff;
}

.category-item text {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.position-list {
  flex: 1;
  background: linear-gradient(135deg, #fff, #f8f9fa);
}

.position-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  font-size: 14px;
  color: #333;
  border-bottom: 1rpx solid rgba(160, 196, 255, 0.2);
  transition: all 0.2s ease;
}

.position-item:active {
  background-color: #f8f9fa;
}

.position-item.active {
  color: #007aff;
  font-weight: 500;
  background: linear-gradient(135deg, #f0f8ff, #e6f2ff);
}

.position-item text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.check-icon {
  font-size: 14px;
  color: #007aff;
  margin-left: 12px;
  font-weight: 600;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
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
  word-wrap: break-word;
  white-space: normal;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  z-index: 1;
  display: block;
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
  
  .competitive-header {
    flex-direction: column;
    align-items: center;
  }
  
  .position-selector-container {
    width: 100%;
    margin-top: 20px;
  }
  
  .user-header-center {
    padding: 0 16px;
  }
  
  .avatar-large {
    width: 64px;
    height: 64px;
  }
  
  .user-name-large {
    font-size: 20px;
  }
  
  .user-title-large {
    font-size: 14px;
  }
  
  .competitive-tag-large {
    padding: 8px 16px;
  }
  
  .tag-text-large {
    font-size: 14px;
  }
  
  .ring-chart {
    width: 160px;
    height: 160px;
  }
  
  .ring-background {
    border-width: 12px;
  }
  
  .ring-progress {
    border-width: 12px;
  }
  
  .score {
    font-size: 32px;
  }
  
  .cascade-modal {
    height: 80vh;
  }
  
  .category-list {
    width: 40%;
  }
  
  .category-item {
    padding: 14px 10px;
    font-size: 13px;
  }
  
  .position-item {
    padding: 14px 16px;
    font-size: 13px;
  }
}
</style>