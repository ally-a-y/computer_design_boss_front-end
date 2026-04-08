<template>
  <view class="interview-container" :style="{ background: isDarkMode ? '#1a1a1a' : 'linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)' }">
    <!-- 顶部导航栏 (fixed) -->
    <view class="header" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)', paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="nav-bar-left">
          <text class="nav-back-icon" @click="goBack" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">←</text>
        </view>
        <text class="page-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">AI模拟面试</text>
        <view class="header-right"></view>
      </view>
    </view>

    <!-- 面试信息配置区 - 动态 padding-top 避免遮挡 -->
    <view v-if="!interviewStarted" class="config-section" :style="{ paddingTop: configTopPadding + 'rpx' }">
      <view class="config-card" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
        <text class="config-title" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">面试配置</text>

        <!-- 方式选择 -->
        <view class="method-tabs">
          <view v-for="(method, index) in interviewMethods" :key="index"
                :class="['tab-item', { active: currentMethod === method.value }]"
                @click="selectMethod(method.value)"
                :style="{ background: currentMethod === method.value ? 'linear-gradient(120deg, #4facfe, #00f2fe)' : (isDarkMode ? 'rgba(64, 64, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)'), color: currentMethod === method.value ? '#ffffff' : (isDarkMode ? '#ffffff' : '#1E1E1E') }">
            <text>{{ method.label }}</text>
          </view>
        </view>

        <!-- 动态表单 -->
        <view class="form-fields">
		  
          <view v-if="currentMethod.includes('resumeText')" class="form-group">
            <text class="form-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">简历文本</text>
            <textarea class="form-textarea" 
                      v-model="formData.resumeText" 
                      placeholder="请粘贴您的简历内容"
                      placeholder-style="color: #999"
                      :style="{ background: isDarkMode ? '#404040' : '#fff', borderColor: isDarkMode ? '#404040' : '#eee', color: isDarkMode ? '#ffffff' : '#1E1E1E' }"></textarea>
          </view>

          <view v-if="currentMethod.includes('pdf')" class="form-group">
            <text class="form-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">PDF简历</text>
            <view class="file-upload-area" @click="chooseResumeFile" :style="{ background: isDarkMode ? 'rgba(64, 64, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderColor: isDarkMode ? '#404040' : '#eee' }">
              <text v-if="!formData.resumePdf" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">点击上传PDF简历</text>
              <text v-else class="file-name" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ formData.resumePdf.name }}</text>
            </view>
          </view>
		 
          <view v-if="currentMethod.includes('position') && !currentMethod.includes('positionText')" class="form-group">
            <text class="form-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">职位选择</text>
            <view class="cascade-selector" @click="openCascadePicker" :style="{ background: isDarkMode ? '#404040' : '#fff', borderColor: isDarkMode ? '#404040' : '#eee' }">
              <view class="selector-content" :class="{ 'placeholder': !selectedPositionId }" :style="{ color: !selectedPositionId ? '#999' : (isDarkMode ? '#ffffff' : '#1E1E1E') }">
                <text v-if="selectedPositionId">{{ selectedCategoryName }} - {{ selectedPositionName }}</text>
                <text v-else>请选择职位</text>
              </view>
              <text class="arrow-icon" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">›</text>
            </view>
          </view>

          <view v-if="currentMethod.includes('positionText')" class="form-group">
            <text class="form-label" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">职位描述</text>
            <textarea class="form-textarea" 
                      v-model="formData.positionText" 
                      placeholder="请输入职位描述"
                      placeholder-style="color: #999"
                      :style="{ background: isDarkMode ? '#404040' : '#fff', borderColor: isDarkMode ? '#404040' : '#eee', color: isDarkMode ? '#ffffff' : '#1E1E1E' }"></textarea>
          </view>
        </view>

        <button class="start-btn" @click="startInterview" :loading="isStarting" :style="{ background: 'linear-gradient(120deg, #4facfe, #00f2fe)', color: '#ffffff' }">
          {{ isStarting ? '启动中...' : '开始面试' }}
        </button>
      </view>
    </view>

    <!-- 面试交互区 - 动态 padding-top 避免遮挡 -->
    <view v-else class="interview-area" :style="{ paddingTop: contentTopPadding + 'rpx' }">
      <view class="progress-section" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
        <text class="progress-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">面试进度 {{ currentQuestion }}/{{ totalQuestions }}</text>
        <view class="progress-bar" :style="{ background: isDarkMode ? '#404040' : '#eee' }">
          <view class="progress-fill" :style="{ width: progressPercent + '%', background: 'linear-gradient(120deg, #4facfe, #00f2fe)' }"></view>
        </view>
        <text class="stage-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ currentStage }}</text>
      </view>

      <!-- 顶部面试官状态条 -->
      <view class="interviewer-status-bar" :style="{ background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
        <view class="status-left">
          <view class="avatar-small">
            <view class="avatar-gradient">
              <text class="avatar-emoji">🤖</text>
            </view>
          </view>
          <text class="interviewer-name" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">AI面试官</text>
        </view>
        <view class="status-right">
          <view class="voice-wave-mini" v-if="isSpeaking">
            <view v-for="i in 4" :key="i" 
                  :class="['wave-bar-mini', { active: voiceWaveActive }]"
                  :style="{ animationDelay: (i * 0.1) + 's' }"></view>
          </view>
          <text class="interviewer-status-text" :style="{ color: isDarkMode ? '#ffffff' : '#1E1E1E' }">{{ getInterviewerStatus() }}</text>
        </view>
      </view>

      <!-- 聊天区 - 主区域 -->
      <view class="chat-section-main">
        <scroll-view class="chat-messages" scroll-y :scroll-top="chatScrollTop" scroll-with-animation>
          <view v-for="(message, index) in interviewMessages" :key="index"
                :class="['chat-message', message.sender]">
            <view class="message-bubble" :style="message.sender === 'user' ? { background: 'linear-gradient(120deg, #4facfe, #00f2fe)', color: '#ffffff' } : { background: isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)', color: isDarkMode ? '#ffffff' : '#1E1E1E', boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 16px rgba(79, 172, 254, 0.15)' }">
              <text>{{ message.content }}</text>
            </view>
            <text class="message-time" :style="{ color: isDarkMode ? '#999' : '#999' }">{{ formatTime(message.timestamp) }}</text>
          </view>

          <!-- AI思考中 -->
          <view v-if="isAIThinking" class="thinking-indicator">
            <view class="thinking-dots">
              <view v-for="i in 3" :key="i" class="dot" :style="{ animationDelay: (i * 0.2) + 's' }"></view>
            </view>
            <text>AI正在思考中...</text>
          </view>
        </scroll-view>
      </view>

      <!-- 底部面板 - H5环境下特殊布局 -->
      <view class="bottom-panel" :class="{ 'h5-bottom-panel': isH5 }">
        <!-- 面试技巧卡片 -->
        <view class="tips-card" :class="{ collapsed: tipsCollapsed }">
          <view class="tips-header" @click="toggleTips">
            <text class="tips-title">面试技巧</text>
            <image :class="['collapse-icon', { rotated: tipsCollapsed }]" 
                   src="/static/ai/arrow-right.png" mode="aspectFit"></image>
          </view>
          <view v-if="!tipsCollapsed" class="tips-content">
            <view v-for="(tip, index) in currentTips" :key="index" class="tip-item">
              <text>• {{ tip }}</text>
            </view>
          </view>
        </view>

        <view v-if="isH5" class="h5-control-area">
          <div class="h5-ctrl-btn replay-btn" @click="replayQuestion" :class="{ disabled: !currentAudioUrl }">
            <span class="ctrl-text">重听</span>
          </div>
          
          <div class="h5-text-input-wrapper">
            <input 
              type="text" 
              class="h5-text-input"
              v-model="tempAnswer"
              placeholder="输入你的回答..."
              :disabled="isProcessing || isAIThinking"
			  maxlength="500"
              @keyup.enter="submitTextAnswer"
            />
            <div class="h5-send-btn" @click="submitTextAnswer" :class="{ disabled: !tempAnswer.trim() || isProcessing || isAIThinking }">
              <span class="send-text">发送</span>
            </div>
          </div>
          
          <div class="h5-ctrl-btn end-btn" @click="confirmEndInterview">
            <span class="ctrl-text">结束</span>
          </div>
        </view>

        <!-- 非H5环境：原有触摸录音布局 -->
        <view v-else class="control-buttons">
          <button class="ctrl-btn replay-btn" @click="replayQuestion" :disabled="!currentAudioUrl">
            <text>重听</text>
          </button>

          <view class="voice-record-wrapper">
            <button 
              class="voice-main-btn" 
              :class="{ recording: isRecording, disabled: isProcessing }"
              @touchstart="startRecording"
              @touchend="stopRecording"
              @touchcancel="stopRecording"
              :disabled="isProcessing">
              <image :src="isRecording ? '/static/ai/recording.png' : '/static/ai/mic.png'" mode="aspectFit"></image>
              <text>{{ isRecording ? '录音中' : (isProcessing ? '处理中' : '按住  说话') }}</text>
            </button>
            
            <view v-if="isRecording" class="recording-tip">
              <view class="pulse-ring-mini"></view>
              <text>{{ recordingTime }}s</text>
            </view>
          </view>

          <button class="ctrl-btn end-btn" @click="confirmEndInterview">
            <text>结束</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 面试报告弹窗 -->
    <view v-if="showReport" class="report-overlay" @click="closeReport">
      <view class="report-modal" @click.stop>
        <view class="report-header">
          <text class="report-title">面试报告</text>
          <image class="close-report" src="/static/ai/close.png" @click="closeReport" mode="aspectFit"></image>
        </view>

        <view class="report-content-wrapper">
          <view class="report-content">
            <view class="score-section">
              <text class="score-title">综合评分</text>
              <view class="score-circle">
                <text class="score-number">{{ overallScore }}</text>
                <text class="score-total">/100</text>
              </view>
            </view>

            <!-- 雷达图区域 -->
            <view class="radar-section">
              <text class="section-title">能力雷达图</text>
              <view class="radar-chart">
                <canvas canvas-id="radarChart" class="radar-canvas"></canvas>
              </view>
            </view>

            <!-- 详细评价 -->
            <view class="evaluation-section">
              <text class="section-title">详细评价</text>
              <view class="evaluation-item" v-for="(item, index) in evaluationItems" :key="index">
                <text class="item-title">{{ item.title }}</text>
                <text class="item-content">{{ item.content }}</text>
              </view>
            </view>

            <!-- 改进建议 -->
            <view class="suggestions-section">
              <text class="section-title">改进建议</text>
              <view class="suggestion-item" v-for="(suggestion, index) in suggestions" :key="index">
                <text>• {{ suggestion }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="report-footer">
          <button class="report-btn restart-btn" @click="restartInterview">重新面试</button>
          <button class="report-btn export-btn" @click="exportReport">导出报告</button>
        </view>
      </view>
    </view>

    <!-- 级联选择器弹窗 -->
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
              @click="selectCategory(category)">
              <text>{{ category.name }}</text>
            </view>
          </scroll-view>
          <scroll-view class="position-list" scroll-y>
            <view 
              v-for="position in currentPositions" 
              :key="position.id"
              :class="['position-item', selectedPositionId === position.id ? 'active' : '']"
              @click="selectPosition(position)">
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
import { getStaticUrl, interviewApi } from '@/common/api/ai.js'
import { themeManager } from '@/common/utils/theme-simple.js'
const BASE_URL = 'http://39.106.72.1100'

export default {
  data() {
    return {
      // 环境判断
      isH5: false,
      isMP: false,
      
      // 动态顶部内边距
      statusBarHeight: 0,          // 状态栏高度(px)
      navBarHeight: 44,            // 自定义导航栏高度(px) - 固定44px
      contentTopPadding: 0,        // 面试区顶部内边距(rpx)
      configTopPadding: 0,         // 配置区顶部内边距(rpx)
      
      // 页面状态
      interviewStarted: false,
      isStarting: false,
      currentMethod: 'user+position',

      // 表单数据
      formData: {
        resumeText: '',
        resumePdf: null,
        userId: '',
        positionId: '',
        positionText: '',
        positionName: ''
      },

      // 用户信息
      userInfo: null,
      isLoadingUser: false,

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
          { id: '17', name: '大数据开发工程师' }, { id: '18', name: '数据仓库工程师' }, { id: '19', name: '机器学习工程师' },
          { id: '20', name: '深度学习工程师' }, { id: '21', name: '算法工程师（推荐/广告）' }, { id: '22', name: '自然语言处理工程师' },
          { id: '23', name: '计算机视觉工程师' }, { id: '24', name: '数据分析师' }, { id: '25', name: '数据产品经理' }
        ],
        '105': [
          { id: '26', name: '测试工程师' }, { id: '27', name: '自动化测试工程师' }, { id: '28', name: '性能测试工程师' },
          { id: '29', name: '测试开发工程师' }, { id: '30', name: '安全测试工程师' }
        ],
        '106': [
          { id: '31', name: '运维工程师' }, { id: '32', name: 'DevOps工程师' }, { id: '33', name: 'SRE工程师' },
          { id: '34', name: '云原生工程师' }, { id: '35', name: '数据库管理员(DBA)' }, { id: '36', name: '网络工程师' }
        ],
        '107': [
          { id: '37', name: '网络安全工程师' }, { id: '38', name: '渗透测试工程师' }, { id: '39', name: '安全运维工程师' },
          { id: '40', name: '逆向工程师' }, { id: '41', name: '安全架构师' }
        ],
        '108': [
          { id: '42', name: '嵌入式软件工程师' }, { id: '43', name: 'Linux驱动工程师' }, { id: '44', name: '物联网(IoT)工程师' },
          { id: '45', name: 'FPGA工程师' }
        ],
        '200': [
          { id: '46', name: '产品经理（技术型）' }, { id: '47', name: 'UI设计师' }, { id: '48', name: '交互设计师(IXD)' },
          { id: '49', name: 'UX研究员' }
        ],
        '300': [
          { id: '50', name: '技术经理/组长' }, { id: '51', name: '架构师' }, { id: '52', name: '研发总监' },
          { id: '53', name: 'CTO/技术VP' }
        ]
      },
      
      // 级联选择器状态
      showCascadePicker: false,
      selectedCategoryId: '',
      selectedCategoryName: '',
      selectedPositionId: '',
      selectedPositionName: '',
      
      // 主题相关
      currentTheme: themeManager.getCurrentTheme(),
      isDarkMode: false,

      // 面试配置
      interviewMethods: [
		{ value: 'user+position', label: '职位' },
		{ value: 'user+positionText', label: '职位文本' },
		{ value: 'pdf+position', label: 'PDF简历+职位' },
		{ value: 'pdf+positionText', label: 'PDF简历+职位文本' },
      ],

      // 面试流程状态
      sessionId: null,
      currentQuestion: 1,
      totalQuestions: 8,
      currentStage: '自我介绍',
      resumeSource: '',
      jobSource: '',

      // 录音状态
      recorderManager: null,
      isRecording: false,
      isSpeaking: false,
      isAIThinking: false,
      isProcessing: false,
      voiceWaveActive: false,
      recordingTime: 0,
      recordingTimer: null,
      audioFilePath: '',

      // 音频播放
      currentAudioUrl: '',
      innerAudioContext: null,

      // 对话数据
      interviewMessages: [],
      chatScrollTop: 0,

      // 面试技巧
      tipsCollapsed: false,
      currentTips: [
        '保持自信，语速适中',
        '回答问题要有条理，使用STAR法则',
        '适当使用专业术语展示能力',
        '注意与面试官的眼神交流',
        '遇到不会的问题诚实回答'
      ],

      // 面试报告数据
      showReport: false,
      overallScore: 85,
      evaluationItems: [],
      suggestions: [],
      reportData: null,
      
      // H5文本输入
      tempAnswer: ''
    }
  },

  computed: {
    progressPercent() {
      return Math.min((this.currentQuestion / this.totalQuestions) * 100, 100)
    },
    currentPositions() {
      if (!this.selectedCategoryId) return []
      return this.positionDetails[this.selectedCategoryId] || []
    },
    hasUserInfo() {
      return !!this.formData.userId
    }
  },

  onLoad() {
    // 判断运行环境
    // #ifdef H5
    this.isH5 = true
    // #endif
    // #ifdef MP-WEIXIN
    this.isMP = true
    // #endif
    
    // 计算动态顶部内边距（解决头部遮挡问题）
    this.calculateTopPadding()
    
    this.initializeInterview()
    this.initRecorder()
    this.fetchUserInfo()
    this.resetPositionSelection()
    
    // 初始化主题
    this.currentTheme = themeManager.getCurrentTheme()
    this.isDarkMode = this.currentTheme === 'dark'
    // 监听主题变化
    this.themeChangeHandler = (data) => {
      this.currentTheme = data.theme
      this.isDarkMode = data.isDark
    }
    uni.$on('globalThemeChange', this.themeChangeHandler)
    
    // 调试输出
    console.log('当前环境:', this.isH5 ? 'H5' : (this.isMP ? '小程序' : 'App'))
  },

  onUnload() {
    this.cleanupInterview()
    // 移除主题监听
    uni.$off('globalThemeChange', this.themeChangeHandler)
  },

  methods: {
    // ==================== 动态计算顶部内边距 ====================
    calculateTopPadding() {
      const systemInfo = uni.getSystemInfoSync()
      // 状态栏高度（单位 px）
      this.statusBarHeight = systemInfo.statusBarHeight || 20
      // 导航栏高度固定 44px（与 CSS 中 .header 的实际内容高度一致）
      const totalPx = this.statusBarHeight + this.navBarHeight
      // 将 px 转换为 rpx，公式：rpx = (750 / windowWidth) * px
      const windowWidth = systemInfo.windowWidth
      const pxToRpx = (px) => (750 / windowWidth) * px
      const totalRpx = pxToRpx(totalPx)
      // 面试区和配置区顶部内边距 = 总高度 + 额外间距（可选）
      this.contentTopPadding = totalRpx
      this.configTopPadding = totalRpx + 20 // 配置区多加一点间距更美观
    },

    // ==================== 职位选择（级联弹窗） ====================
    openCascadePicker() {
      this.showCascadePicker = true
      if (this.formData.positionId) {
        let foundCategoryId = null
        let foundCategoryName = null
        let foundPositionName = null
        for (const [catId, positions] of Object.entries(this.positionDetails)) {
          const pos = positions.find(p => p.id === this.formData.positionId)
          if (pos) {
            foundCategoryId = catId
            foundCategoryName = this.mainCategories.find(c => c.id === catId)?.name || ''
            foundPositionName = pos.name
            break
          }
        }
        if (foundCategoryId) {
          this.selectedCategoryId = foundCategoryId
          this.selectedCategoryName = foundCategoryName
          this.selectedPositionId = this.formData.positionId
          this.selectedPositionName = foundPositionName
          return
        }
      }
      if (!this.selectedCategoryId) {
        const firstCategory = this.mainCategories[0]
        if (firstCategory) {
          this.selectedCategoryId = firstCategory.id
          this.selectedCategoryName = firstCategory.name
          const positions = this.positionDetails[firstCategory.id] || []
          if (positions.length > 0) {
            const firstPosition = positions[0]
            this.selectedPositionId = firstPosition.id
            this.selectedPositionName = firstPosition.name
          }
        }
      }
    },
    
    closeCascadePicker() {
      this.showCascadePicker = false
    },
    
    selectCategory(category) {
      this.selectedCategoryId = category.id
      this.selectedCategoryName = category.name
      const positions = this.positionDetails[category.id] || []
      if (positions.length > 0) {
        const firstPosition = positions[0]
        this.selectedPositionId = firstPosition.id
        this.selectedPositionName = firstPosition.name
      } else {
        this.selectedPositionId = ''
        this.selectedPositionName = ''
      }
    },
    
    selectPosition(position) {
      this.selectedPositionId = position.id
      this.selectedPositionName = position.name
    },
    
    confirmCascadeSelection() {
      if (!this.selectedPositionId) {
        uni.showToast({ title: '请选择职位', icon: 'none' })
        return
      }
      this.formData.positionId = this.selectedPositionId
      this.formData.positionName = this.selectedPositionName
      this.showCascadePicker = false
      uni.showToast({
        title: `已选择: ${this.selectedCategoryName} - ${this.selectedPositionName}`,
        icon: 'none',
        duration: 1500
      })
    },
    
    resetPositionSelection() {
      this.selectedCategoryId = ''
      this.selectedCategoryName = ''
      this.selectedPositionId = ''
      this.selectedPositionName = ''
      this.formData.positionId = ''
      this.formData.positionName = ''
    },

    // ==================== 用户信息 ====================
    async fetchUserInfo() {
      this.isLoadingUser = true
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          console.log('未找到登录token，需要用户登录')
          this.formData.userId = null
          return
        }
        const cachedUserInfo = uni.getStorageSync('userInfo')
        if (cachedUserInfo && cachedUserInfo.user_id) {
          this.userInfo = cachedUserInfo
          this.formData.userId = String(cachedUserInfo.user_id)
          console.log('从缓存获取用户ID:', this.formData.userId)
          return
        }
        const res = await this.getUserProfile()
        if (res.code === 200 && res.data) {
          this.userInfo = res.data
          this.formData.userId = String(res.data.user_id || res.data.userId || res.data.id)
          uni.setStorageSync('userInfo', res.data)
          console.log('从后端获取用户ID:', this.formData.userId)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        uni.showToast({ title: '获取用户信息失败', icon: 'none', duration: 4000 })
        this.formData.userId = null
      } finally {
        this.isLoadingUser = false
      }
    },
    
    getUserProfile() {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${BASE_URL}/api/user/profile`,
          method: 'GET',
          header: { 'Authorization': `Bearer ${uni.getStorageSync('token')}` },
          success: (res) => resolve(res.data),
          fail: (err) => reject(err)
        })
      })
    },

    // ==================== 初始化 ====================
    initializeInterview() {
      this.innerAudioContext = uni.createInnerAudioContext()
      this.innerAudioContext.onEnded(() => {
        this.isSpeaking = false
        this.voiceWaveActive = false
      })
      this.innerAudioContext.onError((err) => {
        console.error('音频播放错误', err)
        this.isSpeaking = false
        this.voiceWaveActive = false
      })
    },
    
    initRecorder() {
      // 只在非H5环境初始化录音
      if (!this.isH5) {
        try {
          this.recorderManager = uni.getRecorderManager()
          if (this.recorderManager) {
            this.recorderManager.onStart(() => {
              console.log('录音开始')
              this.isRecording = true
              this.startRecordingTimer()
            })
            this.recorderManager.onStop((res) => {
              console.log('录音结束', res)
              this.isRecording = false
              this.clearRecordingTimer()
              if (res.tempFilePath) {
                this.audioFilePath = res.tempFilePath
                this.processAudio(res.tempFilePath)
              }
            })
            this.recorderManager.onError((err) => {
              console.error('录音错误', err)
              this.isRecording = false
              this.clearRecordingTimer()
              uni.showToast({ title: '录音失败: ' + (err.errMsg || '未知错误'), icon: 'none' })
            })
          } else {
            console.warn('当前环境不支持录音功能')
          }
        } catch (e) {
          console.error('初始化录音失败:', e)
        }
      }
    },
    
    cleanupInterview() {
      this.resetInterview()
      this.clearRecordingTimer()
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
        this.innerAudioContext = null
      }
      if (this.isRecording && this.recorderManager) {
        this.recorderManager.stop()
      }
    },
    
    getInterviewerStatus() {
      if (this.isAIThinking) return '思考中...'
      if (this.isSpeaking) return '说话中...'
      if (this.isProcessing) return '处理中...'
      return '等待回答'
    },

    // ==================== 导航 ====================
    goBack() {
      if (this.interviewStarted) {
        uni.showModal({
          title: '提示',
          content: '确定要结束面试吗？当前进度将不会保存。',
          success: (res) => {
            if (res.confirm) {
              this.interviewStarted = false
              this.resetInterview()
              uni.navigateBack()
            }
          }
        })
      } else {
        uni.navigateBack()
      }
    },

    // ==================== 配置切换 ====================
    selectMethod(method) {
      this.currentMethod = method
      this.resetForm()
      if (this.userInfo) {
        this.formData.userId = String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id)
      }
      if (method.includes('position')) {
        this.resetPositionSelection()
      }
    },

   // ==================== 文件上传 ====================
   chooseResumeFile() {
     // #ifdef APP-PLUS
     this.chooseFileWithPromise().then(fileInfo => {
       // 使用 plus.io.FileReader 读取文件为 base64
       plus.io.resolveLocalFileSystemURL(fileInfo.path, (entry) => {
         entry.file((file) => {
           const fileReader = new plus.io.FileReader()
           fileReader.onloadend = (evt) => {
             // evt.target.result 包含 data:application/pdf;base64,xxx 格式
             const base64Full = evt.target.result
             const base64 = base64Full.split(',')[1]
   
             this.formData.resumePdf = {
               name: fileInfo.name,
               size: fileInfo.size,
               path: fileInfo.path,
               base64: base64
             }
   
             uni.showToast({ 
               title: '已选择: ' + fileInfo.name, 
               icon: 'none',
               duration: 1500 
             })
   
             console.log('PDF文件已选择:', {
               name: fileInfo.name,
               size: fileInfo.size,
               base64Length: base64?.length
             })
           }
           fileReader.onerror = (err) => {
             console.error('FileReader 错误:', err)
             uni.showToast({ 
               title: '文件读取失败', 
               icon: 'none',
               duration: 2000 
             })
           }
           fileReader.readAsDataURL(file)
         }, (err) => {
           console.error('获取文件对象失败:', err)
           uni.showToast({ 
             title: '文件访问失败', 
             icon: 'none',
             duration: 2000 
           })
         })
       }, (err) => {
         console.error('解析文件路径失败:', err)
         uni.showToast({ 
           title: '文件路径解析失败', 
           icon: 'none',
           duration: 2000 
         })
       })
     }).catch(err => {
       console.error('选择失败:', err)
       uni.showToast({ 
         title: '选择失败: ' + err, 
         icon: 'none',
         duration: 2000 
       })
     })
     // #endif
   
     // #ifdef H5
     // H5 端使用 input 元素选择文件
     const input = document.createElement('input')
     input.type = 'file'
     input.accept = '.pdf,application/pdf'
     input.onchange = (e) => {
       const file = e.target.files[0]
       if (!file) return
   
       // 验证文件类型
       if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
         uni.showToast({ 
           title: '请选择PDF格式的文件', 
           icon: 'none',
           duration: 2000
         })
         return
       }
   
       // 验证文件大小（限制10MB）
       if (file.size > 10 * 1024 * 1024) {
         uni.showToast({ 
           title: '文件不能超过10MB', 
           icon: 'none',
           duration: 2000
         })
         return
       }
   
       const reader = new FileReader()
       reader.onload = (event) => {
         // 获取完整的 base64 数据（包含前缀）
         const fullBase64 = event.target.result
         // 提取纯 base64 部分（去掉 data:application/pdf;base64, 前缀）
         const base64 = fullBase64.split(',')[1]
   
         this.formData.resumePdf = {
           name: file.name,
           size: file.size,
           base64: base64,
           fullBase64: fullBase64,
           file: file
         }
   
         uni.showToast({ 
           title: '文件选择成功', 
           icon: 'success', 
           duration: 1500 
         })
   
         console.log('PDF文件已选择:', {
           name: file.name,
           size: file.size,
           base64Length: base64?.length
         })
       }
       reader.onerror = (err) => {
         console.error('文件读取失败:', err)
         uni.showToast({ 
           title: '文件读取失败，请重试', 
           icon: 'none',
           duration: 2000
         })
       }
       reader.readAsDataURL(file)
     }
     input.click()
     // #endif
   
     // #ifdef MP-WEIXIN
     // 微信小程序端选择文件
     // 先检查 API 是否可用
     if (typeof wx === 'undefined' || !wx.chooseMessageFile) {
       uni.showToast({ 
         title: '当前环境不支持文件选择', 
         icon: 'none',
         duration: 2000
       })
       return
     }
   
     wx.chooseMessageFile({
       count: 1,
       type: 'file',
       extension: ['pdf'],
       success: (res) => {
         const file = res.tempFiles[0]
         console.log('选择的文件:', file)
   
         // 验证文件大小
         if (file.size > 10 * 1024 * 1024) {
           uni.showToast({ 
             title: '文件不能超过10MB', 
             icon: 'none',
             duration: 2000
           })
           return
         }
   
         const fs = uni.getFileSystemManager()
         if (!fs) {
           uni.showToast({ 
             title: '文件系统不可用', 
             icon: 'none',
             duration: 2000
           })
           return
         }
   
         // 读取文件为 base64
         fs.readFile({
           filePath: file.path,
           encoding: 'base64',
           success: (readRes) => {
             this.formData.resumePdf = {
               name: file.name,
               size: file.size,
               path: file.path,
               base64: readRes.data
             }
   
             uni.showToast({ 
               title: '文件选择成功', 
               icon: 'success', 
               duration: 1500 
             })
   
             console.log('PDF文件已选择:', {
               name: file.name,
               size: file.size,
               base64Length: readRes.data?.length
             })
           },
           fail: (err) => {
             console.error('读取文件失败:', err)
             uni.showToast({ 
               title: '文件读取失败: ' + (err.errMsg || '未知错误'), 
               icon: 'none',
               duration: 2000
             })
           }
         })
       },
       fail: (err) => {
         console.log('选择文件取消或失败:', err)
         if (err.errMsg && !err.errMsg.includes('cancel')) {
           uni.showToast({ 
             title: '文件选择失败: ' + (err.errMsg || '请重试'), 
             icon: 'none',
             duration: 2000
           })
         }
       }
     })
     // #endif
   },
   
   // ==================== Android原生文件选择（来自AI.vue） ====================
   chooseFileWithPromise() {
     return new Promise((resolve, reject) => {
       try {
         const main = plus.android.runtimeMainActivity()
         const Intent = plus.android.importClass('android.content.Intent')
   
         const intent = new Intent(Intent.ACTION_GET_CONTENT)
         intent.addCategory(Intent.CATEGORY_OPENABLE)
         intent.setType('application/pdf')
   
         const requestCode = 1001
         const originalCallback = main.onActivityResult
   
         main.onActivityResult = (requestCodeResult, resultCode, data) => {
           main.onActivityResult = originalCallback
   
           if (requestCodeResult === requestCode) {
             if (resultCode === -1 && data) {
               const uri = data.getData()
               this.resolveFileFromUri(uri).then(fileInfo => {
                 resolve(fileInfo)
               }).catch(reject)
             } else {
               reject('用户取消选择')
             }
           } else if (originalCallback) {
             originalCallback(requestCodeResult, resultCode, data)
           }
         }
   
         main.startActivityForResult(intent, requestCode)
   
       } catch (e) {
         reject('启动选择器失败: ' + e.message)
       }
     })
   },
   
   resolveFileFromUri(uri) {
     return new Promise((resolve, reject) => {
       try {
         const main = plus.android.runtimeMainActivity()
         const contentResolver = main.getContentResolver()
   
         let fileName = 'resume.pdf'
         const cursor = plus.android.invoke(contentResolver, 'query', uri, null, null, null, null)
   
         if (cursor) {
           const hasData = plus.android.invoke(cursor, 'moveToFirst')
           if (hasData) {
             const nameIndex = plus.android.invoke(cursor, 'getColumnIndex', '_display_name')
             if (nameIndex >= 0) {
               fileName = plus.android.invoke(cursor, 'getString', nameIndex)
             }
           }
           plus.android.invoke(cursor, 'close')
         }
   
         const inputStream = plus.android.invoke(contentResolver, 'openInputStream', uri)
   
         const File = plus.android.importClass('java.io.File')
         const FileOutputStream = plus.android.importClass('java.io.FileOutputStream')
   
         const cachePath = plus.io.convertLocalFileSystemURL('_doc/cache/')
         const cacheDir = new File(cachePath)
         if (!cacheDir.exists()) {
           cacheDir.mkdirs()
         }
   
         const targetFile = new File(cacheDir, fileName)
         const outputStream = new FileOutputStream(targetFile)
   
         const bufferSize = 4096
         const ByteArray = plus.android.importClass('java.lang.reflect.Array')
         const Byte = plus.android.importClass('java.lang.Byte')
         const buffer = ByteArray.newInstance(Byte.TYPE, bufferSize)
   
         let totalBytes = 0
         let length
   
         while (true) {
           length = plus.android.invoke(inputStream, 'read', buffer)
           if (length === -1 || length === null) break
   
           plus.android.invoke(outputStream, 'write', buffer, 0, length)
           totalBytes += length
         }
   
         plus.android.invoke(inputStream, 'close')
         plus.android.invoke(outputStream, 'close')
   
         const filePath = 'file://' + targetFile.getAbsolutePath()
   
         resolve({
           name: fileName,
           path: filePath,
           size: totalBytes
         })
   
       } catch (e) {
         reject('文件处理失败: ' + (e.message || e))
       }
     })
   },
   

    // ==================== 表单验证 ====================
    validateForm() {
      const method = this.currentMethod
	  console.log('验证表单，当前方法:', method)
	  console.log('PDF 数据:', this.formData.resumePdf)

      if (method.includes('resumeText') && !this.formData.resumeText.trim()) {
        uni.showToast({ title: '请输入简历文本', icon: 'none' })
        return false
      }
      if (method.includes('pdf')) {
          if (!this.formData.resumePdf) {
            console.log('PDF 数据为空')
            uni.showToast({ title: '请上传PDF简历', icon: 'none' })
            return false
          }
          // 额外检查 base64 是否存在
          if (!this.formData.resumePdf.base64) {
            console.log('PDF base64 为空')
            uni.showToast({ title: 'PDF文件读取不完整，请重新上传', icon: 'none' })
            return false
          }
      }
      if (method.includes('user')) {
        if (!this.formData.userId) {
          uni.showToast({ title: '正在获取...', icon: 'none', duration: 3000 })
          this.fetchUserInfo()
          return false
        }
      }
      if (method.includes('position')&& !method.includes('positionText')) {
        if (!this.selectedPositionId) {
          uni.showToast({ title: '请选择职位', icon: 'none' })
          return false
        }
      }
      if (method.includes('positionText') && !this.formData.positionText.trim()) {
        uni.showToast({ title: '请输入职位描述', icon: 'none' })
        return false
      }
      return true
    },

    // ==================== 开始面试 ====================
    async startInterview() {
      if (!this.validateForm()) return

      this.isStarting = true

      try {
        let res

        switch (this.currentMethod) {
          case 'resumeText+positionText':
            res = await interviewApi.startText(this.formData.resumeText, this.formData.positionText)
            break
          case 'pdf+positionText':
            if (!this.formData.resumePdf?.base64) throw new Error('PDF文件未准备好')
            res = await interviewApi.startPdfText(this.formData.resumePdf.base64, this.formData.positionText)
            break
          case 'pdf+position':
            if (!this.formData.resumePdf?.base64) throw new Error('PDF文件未准备好')
            if (!this.formData.positionName) throw new Error('请选择有效的职位')
            res = await interviewApi.startPdfJobName(this.formData.resumePdf.base64, this.formData.positionName)
            break
          case 'user+position':
            if (!this.formData.positionName) throw new Error('请选择有效的职位')
            res = await interviewApi.startUserIdJobName(this.formData.userId, this.formData.positionName)
            break
          case 'user+positionText':
            res = await interviewApi.startUserIdText(this.formData.userId, this.formData.positionText)
            break
          case 'resumeText+position':
            if (!this.formData.positionName) throw new Error('请选择有效的职位')
            res = await interviewApi.startTextJobName(this.formData.resumeText, this.formData.positionName)
            break
          default:
            throw new Error('未知的面试方式')
        }

        console.log('面试启动响应', res)

        if (res.code === 200 || res.data?.session_id) {
          this.sessionId = res.session_id || res.data?.session_id
          this.resumeSource = res.resume_source || res.data?.resume_source
          this.jobSource = res.job_source || res.data?.job_source
          this.currentQuestion = res.question_number || res.data?.question_number || 1

          const firstQuestion = res.question || res.data?.question
          const audioUrl = res.audio_url || res.data?.audio_url

          this.interviewStarted = true
          this.addMessage('interviewer', firstQuestion)
          if (audioUrl) {
            this.currentAudioUrl = audioUrl
            this.playAudio(audioUrl)
          }
          this.updateInterviewStage()
        } else {
          throw new Error(res.message || '启动面试失败')
        }
      } catch (error) {
        uni.showToast({ title: error.message || '启动面试失败，请重试', icon: 'none', duration: 3000 })
      } finally {
        this.isStarting = false
      }
    },

    // ==================== 录音相关 ====================
    startRecording() {
      if (this.isProcessing || this.isAIThinking) {
        uni.showToast({ title: '请等待AI响应', icon: 'none' })
        return
      }
      
      if (this.recorderManager) {
        this.recorderManager.start({ 
          duration: 180000, 
          sampleRate: 16000, 
          numberOfChannels: 1, 
          encodeBitRate: 96000, 
          format: 'mp3' 
        })
      } else {
        uni.showToast({ title: '录音功能不可用', icon: 'none' })
      }
    },
    
    stopRecording() {
      if (!this.isRecording) return
      if (this.recorderManager) {
        this.recorderManager.stop()
      }
    },
    
    startRecordingTimer() {
      this.recordingTime = 0
      this.recordingTimer = setInterval(() => {
        this.recordingTime++
        if (this.recordingTime >= 180) this.stopRecording()
      }, 1000)
    },
    
    clearRecordingTimer() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer)
        this.recordingTimer = null
      }
    },
    
    submitTextAnswer() {
      if (this.tempAnswer.trim()) {
        console.log('提交文本回答:', this.tempAnswer.trim())
        this.addMessage('candidate', this.tempAnswer.trim())
        this.sendAnswer(this.tempAnswer.trim())
        this.tempAnswer = ''
      } else {
        uni.showToast({ title: '请输入回答内容', icon: 'none' })
      }
    },
    
    async processAudio(filePath) {
      if (!this.sessionId) {
        uni.showToast({ title: '会话异常', icon: 'none' })
        return
      }
      
      this.isProcessing = true
      try {
        if (!interviewApi.transcribe) {
          throw new Error('语音识别功能不可用')
        }
        
        const uploadRes = await interviewApi.transcribe(this.sessionId, filePath)
        let transcribeData
        
        if (typeof uploadRes.data === 'string') {
          transcribeData = JSON.parse(uploadRes.data)
        } else {
          transcribeData = uploadRes.data
        }
        
        if (transcribeData.code === 200 && transcribeData.text) {
          const userText = transcribeData.text
          this.addMessage('candidate', userText)
          await this.sendAnswer(userText)
        } else {
          throw new Error(transcribeData.message || '语音识别失败')
        }
      } catch (error) {
        console.error('处理录音失败', error)
        uni.showToast({ title: error.message || '语音识别失败，请使用文本输入', icon: 'none', duration: 3000 })
      } finally {
        this.isProcessing = false
      }
    },

    // ==================== 对话交互 ====================
    async sendAnswer(userText, endInterview = false) {
      if (!this.sessionId) return
      this.isAIThinking = true
      try {
        const res = await interviewApi.answer(this.sessionId, userText, endInterview)
        console.log('AI响应', res)
        if (res.code === 200 || res.data) {
          const data = res.data || res
          if (data.is_ended || data.stage === 'ended') {
            this.finishInterview()
            return
          }
          this.currentQuestion = data.question_number || this.currentQuestion + 1
          const question = data.question || data.data?.question
          this.addMessage('interviewer', question)
          const audioUrl = data.audio_url || data.data?.audio_url
          if (audioUrl) {
            this.currentAudioUrl = audioUrl
            this.playAudio(audioUrl)
          }
          this.currentStage = data.stage || this.currentStage
          this.updateInterviewStage()
        } else {
          throw new Error(res.message || '获取回复失败')
        }
      } catch (error) {
        console.error('发送回答失败', error)
        uni.showToast({ title: error.message || '获取回复失败', icon: 'none' })
      } finally {
        this.isAIThinking = false
      }
    },
    
    // ==================== 音频播放 ====================
        playAudio(url) {
          if (!this.innerAudioContext) {
            console.warn('音频上下文未初始化')
            return
          }
          
          if (!url) {
            console.warn('音频URL为空')
            return
          }
          
          this.isSpeaking = true
          this.voiceWaveActive = true
          
          const fullUrl = getStaticUrl(url)
          console.log('播放音频，完整URL:', fullUrl)
          
          // 先停止当前播放
          this.innerAudioContext.stop()
          
          // 移除旧的事件监听（仅在支持的平台）
          // #ifdef MP-WEIXIN
          this.innerAudioContext.offError()
          this.innerAudioContext.offEnded()
          // #endif
          
          // 设置新的事件监听
          this.innerAudioContext.onError((err) => {
            console.error('音频播放错误', err)
            this.isSpeaking = false
            this.voiceWaveActive = false
            uni.showToast({ title: '语音加载失败，请阅读文字', icon: 'none', duration: 3000 })
          })
          
          this.innerAudioContext.onEnded(() => {
            this.isSpeaking = false
            this.voiceWaveActive = false
          })
          
          // 设置音频源并播放
          this.innerAudioContext.src = fullUrl
          
          // 使用 setTimeout 确保 src 设置完成后再播放（App端需要）
          setTimeout(() => {
            this.innerAudioContext.play()
          }, 100)
        },
    
    replayQuestion() {
      if (this.currentAudioUrl) this.playAudio(this.currentAudioUrl)
    },
    
    addMessage(sender, content) {
      this.interviewMessages.push({ sender, content, timestamp: Date.now() })
      this.scrollToBottom()
    },
    
    updateInterviewStage() {
      const stages = ['自我介绍', '技术能力', '项目经验', '职业规划', '综合能力']
      const stageIndex = Math.floor((this.currentQuestion - 1) / (this.totalQuestions / stages.length))
      this.currentStage = stages[stageIndex] || '综合评估'
    },
    
    scrollToBottom() {
      this.$nextTick(() => { this.chatScrollTop = this.interviewMessages.length * 1000 })
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    },

    // ==================== 面试结束与报告 ====================
    confirmEndInterview() {
      uni.showModal({
        title: '结束面试',
        content: '确定要结束面试吗？将生成面试报告。',
        success: (res) => { if (res.confirm) this.endInterview() }
      })
    },
    
    async endInterview() {
      if (!this.sessionId) {
        this.finishInterview()
        return
      }
      try {
        await this.sendAnswer('面试结束', true)
      } catch (error) {
        console.log('发送结束信号失败，直接获取报告', error)
      }
      this.finishInterview()
    },
    
    async finishInterview() {
      if (!this.sessionId) {
        this.generateMockReport()
        this.showReport = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.drawRadarChart()
          }, 300)
        })
        return
      }
      uni.showLoading({ title: '生成报告中...' })
      try {
        const res = await interviewApi.getReport(this.sessionId)
        console.log('面试报告', res)
        if (res.code === 200 || res.data) {
          this.reportData = res.data || res
          this.parseReportData(this.reportData)
        } else {
          this.generateMockReport()
        }
        this.showReport = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.drawRadarChart()
          }, 300)
        })
      } catch (error) {
        console.error('获取报告失败', error)
        this.generateMockReport()
        this.showReport = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.drawRadarChart()
          }, 300)
        })
      } finally {
        uni.hideLoading()
      }
    },
    
    parseReportData(data) {
      this.overallScore = data.overall_score || data.score || 85
      this.evaluationItems = [
        { title: '技术能力', content: data.tech_evaluation || '基础扎实，能够清晰地解释技术概念。' },
        { title: '沟通能力', content: data.comm_evaluation || '表达清晰，逻辑性强。' },
        { title: '项目经验', content: data.project_evaluation || '项目经历丰富，能够详细描述项目细节。' }
      ]
      this.suggestions = data.suggestions || [
        '建议在技术深度方面继续加强学习',
        '可以增加更多实际项目案例的积累'
      ]
    },
    
    generateMockReport() {
      this.overallScore = Math.floor(Math.random() * 20) + 75
      this.evaluationItems = [
        { title: '技术能力', content: '基础扎实，能够清晰地解释技术概念，但在某些深度问题上略显不足。' },
        { title: '沟通能力', content: '表达清晰，逻辑性强，能够很好地理解问题并给出合适的回答。' },
        { title: '项目经验', content: '项目经历丰富，能够详细描述项目细节和个人贡献。' }
      ]
      this.suggestions = [
        '建议在技术深度方面继续加强学习',
        '可以增加更多实际项目案例的积累',
        '面试时保持更好的眼神交流',
        '适当准备一些行为面试问题的回答'
      ]
    },
    
    toggleTips() {
      this.tipsCollapsed = !this.tipsCollapsed
    },
    
    closeReport() {
      this.showReport = false
    },
    
    restartInterview() {
      this.showReport = false
      this.resetInterview()
      this.interviewStarted = false
    },
    
    async exportReport() {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>面试报告</title>
          <style>
            body { font-family: '微软雅黑', '宋体', Arial, sans-serif; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #007aff; padding-bottom: 10px; }
            .score { font-size: 48px; color: #007aff; font-weight: bold; margin: 20px 0; }
            .section { margin: 30px 0; }
            .section-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 15px; }
            .item { margin-bottom: 20px; }
            .item-title { font-size: 18px; font-weight: bold; color: #007aff; }
            .item-content { margin-top: 5px; line-height: 1.6; }
            .suggestion { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>AI 模拟面试报告</h1>
          <div class="section">
            <div class="section-title">综合评分</div>
            <div class="score">${this.overallScore} / 100</div>
          </div>
          <div class="section">
            <div class="section-title">详细评价</div>
            ${this.evaluationItems.map(item => `
              <div class="item">
                <div class="item-title">${item.title}</div>
                <div class="item-content">${item.content}</div>
              </div>
            `).join('')}
          </div>
          <div class="section">
            <div class="section-title">改进建议</div>
            ${this.suggestions.map(s => `<div class="suggestion">• ${s}</div>`).join('')}
          </div>
          <p style="margin-top: 40px; color: #999; font-size: 12px;">生成时间：${new Date().toLocaleString()}</p>
        </body>
        </html>
      `;
    
      // #ifdef MP-WEIXIN || APP-PLUS
      this.chooseFileWithAndroidIntent()
      // #endif
      
      // #ifdef H5
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `面试报告_${Date.now()}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      uni.showToast({ title: '报告导出成功', icon: 'success' });
      // #endif
    },
    
	// Android 原生 Intent 选择文件（从 AI.vue 完整复制）
	chooseFileWithAndroidIntent() {
	  console.log('========== chooseFileWithAndroidIntent 开始 ==========')
	  
	  try {
	    const main = plus.android.runtimeMainActivity()
	    const Intent = plus.android.importClass('android.content.Intent')
	    const intent = new Intent(Intent.ACTION_GET_CONTENT)
	    
	    // 设置选择 PDF 类型
	    intent.setType('application/pdf')
	    intent.addCategory(Intent.CATEGORY_OPENABLE)
	    
	    console.log('【Intent】Intent 创建成功')
	    
	    // 启动文件选择器
	    main.startActivityForResult(intent, 10001)
	    console.log('【Intent】startActivityForResult 已调用')
	    
	    // 监听 Activity 结果
	    const that = this
	    main.onActivityResult = function(requestCode, resultCode, data) {
	      console.log('========== onActivityResult 回调 ==========')
	      console.log('【Intent】requestCode:', requestCode)
	      console.log('【Intent】resultCode:', resultCode)
	      console.log('【Intent】data:', data)
	      
	      if (requestCode !== 10001) {
	        console.log('【Intent】requestCode 不匹配，忽略')
	        return
	      }
	      
	      // RESULT_OK = -1
	      if (resultCode !== -1 || !data) {
	        console.log('【Intent】用户取消或返回无效')
	        return
	      }
	      
	      const uri = data.getData()
	      console.log('【Intent】获取到 URI:', uri?.toString())
	      
	      if (!uri) {
	        console.error('【Intent】URI 为空')
	        uni.showToast({ title: '文件选择失败', icon: 'none' })
	        return
	      }
	      
	      // 解析 URI 获取文件路径
	      that.resolveUriToPathForInterview(uri)
	    }
	    
	  } catch (e) {
	    console.error('【Intent】创建 Intent 失败:', e)
	    console.error('【Intent】错误堆栈:', e?.stack)
	    // 降级到 plus.io.chooseFile
	    this.chooseFileWithPlusIO()
	  }
	},
	// 降级方案：使用 plus.io.chooseFile
	chooseFileWithPlusIO() {
	  console.log('========== chooseFileWithPlusIO 降级方案 ==========')
	  
	  plus.io.chooseFile({
	    title: '选择PDF简历',
	    filetypes: ['pdf'],
	    multiple: false,
	    success: (res) => {
	      console.log('【PlusIO】选择成功:', res)
	      if (res.files && res.files.length > 0) {
	        const filePath = res.files[0]
	        const fileName = filePath.match(/[^/\\]+\.pdf$/i)?.[0] || `file_${Date.now()}.pdf`
	        this.readInterviewFile(filePath, fileName)
	      }
	    },
	    fail: (err) => {
	      console.error('【PlusIO】选择失败:', err)
	      uni.showToast({ title: '文件选择失败', icon: 'none' })
	    }
	  })
	},
	
	// 解析 URI 为文件路径（interview.vue 专用版本）
	resolveUriToPathForInterview(uri) {
	  console.log('========== resolveUriToPathForInterview 开始 ==========')
	  
	  const uriString = uri.toString()
	  // **关键修复：URL 解码**
	  const decodedUri = decodeURIComponent(uriString)
	  console.log('【Resolve】原始 URI:', uriString)
	  console.log('【Resolve】解码后 URI:', decodedUri)
	  
	  let filePath = null
	  let fileName = `file_${Date.now()}.pdf`
	  
	  // 处理不同格式的 URI
	  if (decodedUri.startsWith('file://')) {
	    // 直接文件路径，去掉 file:// 前缀
	    filePath = decodedUri.replace('file://', '')
	    console.log('【Resolve】file:// 路径:', filePath)
	    
	    // **关键修复：从路径中提取真实文件名**
	    const pathParts = filePath.split('/')
	    const lastPart = pathParts[pathParts.length - 1]
	    if (lastPart && lastPart.endsWith('.pdf')) {
	      fileName = lastPart
	      console.log('【Resolve】提取的文件名:', fileName)
	    }
	    
	  } else if (decodedUri.startsWith('content://')) {
	    // Content URI，需要查询或复制
	    console.log('【Resolve】Content URI，需要特殊处理')
	    this.copyContentUriToPrivateForInterview(uri, fileName)
	    return
	  }
	  
	  console.log('【Resolve】最终 filePath:', filePath)
	  console.log('【Resolve】最终 fileName:', fileName)
	  
	  if (!filePath) {
	    console.log('【Resolve】无法获取路径，尝试复制到私有目录')
	    this.copyContentUriToPrivateForInterview(uri, fileName)
	    return
	  }
	  
	  // 读取文件
	  this.readInterviewFile(filePath, fileName)
	},
	
	// 读取面试页面文件
	readInterviewFile(filePath, fileName) {
	  console.log('========== readInterviewFile 开始 ==========')
	  
	  const File = plus.android.importClass('java.io.File')
	  const javaFile = new File(filePath)
	  
	  console.log('【Read】文件是否存在:', javaFile.exists())
	  console.log('【Read】文件大小:', javaFile.length())
	  
	  if (!javaFile.exists()) {
	    uni.showToast({ title: '文件不存在', icon: 'none' })
	    return
	  }
	  
	  // 复制到私有目录后读取
	  this.copyAndReadInterviewFile(filePath, fileName, javaFile.length())
	},
	
	// 复制到私有目录后读取（interview.vue 专用）
	copyAndReadInterviewFile(sourcePath, fileName, fileSize) {
	  console.log('========== copyAndReadInterviewFile 开始 ==========')
	  
	  // 目标路径：应用私有目录
	  const destPath = `_doc/resume/${Date.now()}_${fileName}`
	  console.log('【Copy】目标路径:', destPath)
	  
	  plus.io.resolveLocalFileSystemURL(sourcePath, (srcEntry) => {
	    console.log('【Copy】源文件 entry 获取成功')
	    
	    // 确保目标目录存在
	    plus.io.resolveLocalFileSystemURL('_doc/', (docEntry) => {
	      docEntry.getDirectory('resume', { create: true }, (resumeDir) => {
	        console.log('【Copy】resume 目录确保存在')
	        
	        srcEntry.copyTo(resumeDir, `${Date.now()}_${fileName}`, (destEntry) => {
	          console.log('【Copy】复制成功:', destEntry.fullPath)
	          
	          // 现在读取复制后的文件
	          destEntry.file((file) => {
	            const reader = new plus.io.FileReader()
	            
	            reader.onload = (e) => {
	              console.log('【Copy】FileReader onload')
	              const fullBase64 = e.target.result
	              const base64 = fullBase64.includes(',') 
	                ? fullBase64.split(',')[1] 
	                : fullBase64
	                
	              console.log('【Copy】base64 长度:', base64?.length)
	              
	              // 设置数据（注意：interview.vue 中使用的是 resumePdf 而不是 pdfFile）
	              this.$set(this.formData, 'resumePdf', {
	                name: fileName,
	                size: fileSize,
	                base64: base64,
	                fullBase64: fullBase64,
	                path: plus.io.convertLocalFileSystemURL(destEntry.fullPath)
	              })
	              
	              console.log('【Copy】设置 formData.resumePdf 成功:', this.formData.resumePdf)
	              uni.showToast({
	                title: '文件选择成功',
	                icon: 'success',
	                duration: 1500
	              })
	            }
	            
	            reader.onerror = (e) => {
	              console.error('【Copy】FileReader error:', e)
	              uni.showToast({ title: '文件读取失败', icon: 'none' })
	            }
	            
	            reader.readAsDataURL(file)
	          })
	          
	        }, (err) => {
	          console.error('【Copy】复制失败:', err)
	          uni.showToast({ title: '文件复制失败', icon: 'none' })
	        })
	        
	      }, (err) => {
	        console.error('【Copy】创建目录失败:', err)
	      })
	    })
	    
	  }, (err) => {
	    console.error('【Copy】获取源文件失败:', err)
	    uni.showToast({ title: '无法访问文件', icon: 'none' })
	  })
	},
	
	// Content URI 复制到私有目录（interview.vue 专用）
	copyContentUriToPrivateForInterview(uri, defaultFileName) {
	  console.log('========== copyContentUriToPrivateForInterview 开始 ==========')
	  
	  try {
	    const main = plus.android.runtimeMainActivity()
	    const ContentResolver = plus.android.importClass('android.content.ContentResolver')
	    const resolver = main.getContentResolver()
	    
	    // 查询文件名
	    let fileName = defaultFileName
	    const cursor = resolver.query(uri, null, null, null, null)
	    if (cursor && cursor.moveToFirst()) {
	      const displayNameIndex = cursor.getColumnIndex('_display_name')
	      if (displayNameIndex >= 0) {
	        fileName = cursor.getString(displayNameIndex)
	        console.log('【Content】从 URI 获取文件名:', fileName)
	      }
	      cursor.close()
	    }
	    
	    // 创建临时文件
	    const tempFileName = `temp_${Date.now()}_${fileName}`
	    const tempPath = `${uni.env.USER_DATA_PATH}/${tempFileName}`
	    console.log('【Content】临时文件路径:', tempPath)
	    
	    // 打开输入流
	    const inputStream = resolver.openInputStream(uri)
	    const FileOutputStream = plus.android.importClass('java.io.FileOutputStream')
	    const outputStream = new FileOutputStream(tempPath)
	    
	    // 复制数据
	    const buffer = plus.android.newArray('byte', 1024)
	    let length = 0
	    let totalSize = 0
	    
	    while ((length = inputStream.read(buffer)) > 0) {
	      outputStream.write(buffer, 0, length)
	      totalSize += length
	    }
	    
	    outputStream.close()
	    inputStream.close()
	    
	    console.log('【Content】复制完成，大小:', totalSize)
	    
	    // 现在读取这个临时文件
	    this.readInterviewFile(tempPath, fileName)
	    
	  } catch (e) {
	    console.error('【Content】复制 Content URI 失败:', e)
	    uni.showToast({ title: '文件读取失败', icon: 'none' })
	  }
	},
	
	drawRadarChart() {
          const query = uni.createSelectorQuery().in(this)
          query.select('.radar-canvas').boundingClientRect(rect => {
            if (!rect || rect.width === 0 || rect.height === 0) {
              setTimeout(() => this.drawRadarChart(), 100)
              return
            }
            const canvasWidth = rect.width
            const canvasHeight = rect.height
            const ctx = uni.createCanvasContext('radarChart', this)
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            
            // 定义雷达图参数
            const centerX = canvasWidth / 2
            const centerY = canvasHeight / 2
            const radius = Math.min(canvasWidth, canvasHeight) * 0.35 
            const points = 6
            const angleStep = (Math.PI * 2) / points
            this.drawRadarGrid(ctx, centerX, centerY, radius, points, angleStep)
            
            // 绘制数据区域
            const score = this.overallScore / 100
            const data = [0.8 * score, 0.85 * score, 0.75 * score, 0.9 * score, 0.8 * score, 0.85 * score]
            this.drawRadarData(ctx, centerX, centerY, radius, points, angleStep, data)
            
            // 绘制标签
            const labels = ['技术', '沟通', '经验', '态度', '潜力', '稳定']
            this.drawRadarLabels(ctx, centerX, centerY, radius, points, angleStep, labels)
            
            ctx.draw()
          }).exec()
        },
        drawRadarGrid(ctx, centerX, centerY, radius, points, angleStep) {
          ctx.setStrokeStyle('#e0e0e0')
          ctx.setLineWidth(1)
          // 绘制同心圆网格（5层）
          for (let i = 1; i <= 5; i++) {
            ctx.beginPath()
            const r = radius * i / 5
            for (let j = 0; j <= points; j++) {
              const angle = j * angleStep - Math.PI / 2
              const x = centerX + Math.cos(angle) * r
              const y = centerY + Math.sin(angle) * r
              if (j === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.closePath()
            ctx.stroke()
          }
          // 绘制从中心到顶点的连线
          for (let i = 0; i < points; i++) {
            const angle = i * angleStep - Math.PI / 2
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
            ctx.stroke()
          }
        },
        drawRadarData(ctx, centerX, centerY, radius, points, angleStep, data) {
          ctx.setFillStyle('rgba(0, 122, 255, 0.3)')
          ctx.setStrokeStyle('#007aff')
          ctx.setLineWidth(2)
          ctx.beginPath()
          for (let i = 0; i <= points; i++) {
            const angle = i * angleStep - Math.PI / 2
            const value = data[i % points]
            const x = centerX + Math.cos(angle) * (radius * value)
            const y = centerY + Math.sin(angle) * (radius * value)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
          // 绘制数据点
          ctx.setFillStyle('#007aff')
          for (let i = 0; i < points; i++) {
            const angle = i * angleStep - Math.PI / 2
            const value = data[i]
            const x = centerX + Math.cos(angle) * (radius * value)
            const y = centerY + Math.sin(angle) * (radius * value)
            ctx.beginPath()
            ctx.arc(x, y, 4, 0, Math.PI * 2)
            ctx.fill()
          }
        },
        drawRadarLabels(ctx, centerX, centerY, radius, points, angleStep, labels) {
          ctx.setFontSize(12)
          ctx.setFillStyle('#666')
          const labelRadius = radius + 18
          for (let i = 0; i < points; i++) {
            const angle = i * angleStep - Math.PI / 2
            const x = centerX + Math.cos(angle) * labelRadius
            const y = centerY + Math.sin(angle) * labelRadius
            ctx.fillText(labels[i], x - 12, y + 6)
          }
        },


    // ==================== 重置 ====================
    resetInterview() {
      this.sessionId = null
      this.currentQuestion = 1
      this.interviewMessages = []
      this.isRecording = false
      this.isSpeaking = false
      this.isAIThinking = false
      this.isProcessing = false
      this.voiceWaveActive = false
      this.recordingTime = 0
      this.currentAudioUrl = ''
      this.audioFilePath = ''
      this.reportData = null
      this.showReport = false
      this.tempAnswer = ''
      this.clearRecordingTimer()
      if (this.innerAudioContext) this.innerAudioContext.stop()
    },
    
    resetForm() {
      this.formData = {
        resumeText: '',
        resumePdf: null,
        userId: this.userInfo ? String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id) : '',
        positionId: '',
        positionText: '',
        positionName: ''
      }
      this.resetPositionSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
.interview-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, #eef5ff 0%, #ffffff 100%);
  position: relative;
}

/* 装饰性元素 */
.interview-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 300rpx;
  height: 300rpx;
  background: radial-gradient(circle, rgba(43, 110, 240, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8));
  box-shadow: 0 4rpx 16rpx rgba(79, 172, 254, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  /* 高度由内容撑开，不固定，动态 paddingTop 已处理状态栏 */
  display: flex;
  align-items: center;
  padding-left: 28rpx;
  padding-right: 28rpx;
  padding-bottom: 20rpx;
  box-sizing: border-box;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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

  .page-title {
    font-size: 36rpx;
    font-weight: 600;
    flex: 1;
    text-align: center;
    background: linear-gradient(120deg, #2b6ef0, #00b4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header-right {
    width: 40px;
  }
}

.config-section {
  flex: 1;
  padding: 0 32rpx 32rpx 32rpx;
  /* padding-top 动态绑定，避免遮挡 */
  overflow-y: auto;

  .config-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 24px;
    padding: 48px 40px;
    box-shadow: 0 8px 32px rgba(79, 172, 254, 0.15);

    .config-title {
      font-size: 40rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 48rpx;
      display: block;
      text-align: center;
    }

    .method-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 24rpx;
      margin-bottom: 48rpx;

      .tab-item {
        flex: 1;
        min-width: 280rpx;
        padding: 24rpx 20rpx;
        border: 2rpx solid transparent;
        border-radius: 20rpx;
        text-align: center;
        background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
        border-image: linear-gradient(120deg, #a0c4ff, #cfe2ff) 1;
        transition: all 0.3s ease;

        &.active {
          border-color: #007aff;
          background: linear-gradient(135deg, #e6f2ff 0%, #cce4ff 100%);
          color: #007aff;
        }

        text {
          font-size: 28rpx;
          font-weight: 500;
        }
      }
    }

    .form-fields {
      margin-bottom: 48rpx;

      .form-group {
        margin-bottom: 36rpx;

        .form-label {
          display: block;
          font-size: 32rpx;
          color: #495057;
          margin-bottom: 24rpx;
          font-weight: 500;
        }

        .form-textarea {
          width: 100%;
          min-height: 200rpx;
          padding: 28rpx 24rpx;
          border: 2rpx solid transparent;
          border-radius: 20rpx;
          font-size: 30rpx;
          background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
          border-image: linear-gradient(120deg, #a0c4ff, #cfe2ff) 1;
          box-sizing: border-box;

          &:focus {
            border-color: transparent;
            border-image: linear-gradient(120deg, #4f9eff, #a0d0ff) 1;
            box-shadow: 0 0 12px rgba(79, 158, 255, 0.3);
          }
        }

        .file-upload-area {
          padding: 40rpx;
          border: 2rpx dashed transparent;
		  border-radius: 16rpx;
          text-align: center;
          color: #007aff;
          font-size: 30rpx;
          background: linear-gradient(135deg, #f0f8ff, #e6f2ff);
          border-image: linear-gradient(120deg, #4facfe, #00f2fe) 1;
          transition: all 0.3s ease;
          font-weight: 500;
          box-shadow: 0 4rpx 12rpx rgba(79, 172, 254, 0.15);
            
            &:active {
              background: linear-gradient(135deg, #e6f2ff, #f0f8ff);
              transform: scale(0.98);
              box-shadow: 0 2rpx 8rpx rgba(79, 172, 254, 0.2);
            }
          }
		  
        .user-id-display {
          padding: 24rpx 28rpx;
          border: 2rpx solid transparent;
          border-radius: 16rpx;
          background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
          border-image: linear-gradient(120deg, #a0c4ff, #cfe2ff) 1;
          
          &.loading {
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border-image: linear-gradient(120deg, #fcd34d, #fbbf24) 1;
          }
          
          &.error {
            background: linear-gradient(135deg, #fef2f2, #fee2e2);
            border-image: linear-gradient(120deg, #fca5a5, #f87171) 1;
          }
          
          .loading-text {
            font-size: 30rpx;
            color: #d97706;
          }
          
          .user-id-text {
            font-size: 30rpx;
            color: #007aff;
            font-weight: 500;
          }
          
          .error-text {
            font-size: 30rpx;
            color: #dc2626;
            
            .retry-link {
              color: #007aff;
              text-decoration: underline;
            }
          }
        }

        .cascade-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24rpx 28rpx;
          border: 2rpx solid transparent;
          border-radius: 16rpx;
          background: linear-gradient(135deg, #E6F0FF, #F0F4FF);
          border-image: linear-gradient(120deg, #a0c4ff, #cfe2ff) 1;
          transition: all 0.3s ease;
          
          &:focus {
            border-color: transparent;
            border-image: linear-gradient(120deg, #4f9eff, #a0d0ff) 1;
            box-shadow: 0 0 12px rgba(79, 158, 255, 0.3);
          }
          
          .selector-content {
            flex: 1;
            font-size: 30rpx;
            color: #333;
            
            &.placeholder {
              color: #94a3b8;
            }
          }
          
          .arrow-icon {
            font-size: 32rpx;
            color: #999;
          }
        }
      }

      .divider {
        height: 2rpx;
        background: linear-gradient(90deg, transparent, #a0c4ff, transparent);
        margin: 40rpx 0;
      }
    }

    .start-btn {
      width: 100%;
      background: linear-gradient(135deg, #2b6ef0, #0099ff);
      color: #fff;
      border-radius: 16px;
      padding: 32rpx;
      font-size: 36rpx;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 0 12px rgba(43, 110, 240, 0.4);
      animation: breathe 3s infinite ease-in-out;
      
      &:active {
        background: linear-gradient(135deg, #0099ff, #2b6ef0);
        box-shadow: 0 0 16px rgba(43, 110, 240, 0.6);
      }
    }

    @keyframes breathe {
      0%, 100% {
        box-shadow: 0 0 12px rgba(43, 110, 240, 0.4);
      }
      50% {
        box-shadow: 0 0 20px rgba(43, 110, 240, 0.6);
      }
    }
  }
}

.interview-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  overflow: hidden;
  /* padding-top 动态绑定，避免固定值遮挡 */
}

.progress-section {
  padding: 24rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eef2f6;
  flex-shrink: 0;

  .progress-text {
    font-size: 26rpx;
    color: #6c7a8a;
    margin-bottom: 12rpx;
    display: block;
  }

  .progress-bar {
    height: 8rpx;
    background-color: #e4e9f0;
    border-radius: 4rpx;
    overflow: hidden;
    margin-bottom: 12rpx;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #007aff, #00c6ff);
      transition: width 0.3s ease;
    }
  }

  .stage-text {
    font-size: 28rpx;
    color: #1f2a3e;
    font-weight: 500;
  }
}

.interviewer-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eef2f6;
  flex-shrink: 0;

  .status-left {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .avatar-small {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #eef2ff, #e0e7ff);
      display: flex;
      align-items: center;
      justify-content: center;
      
      .avatar-emoji {
        font-size: 36rpx;
      }
    }

    .interviewer-name {
      font-size: 30rpx;
      font-weight: 600;
      color: #1f2a3e;
    }
  }

  .status-right {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .voice-wave-mini {
      display: flex;
      align-items: center;
      gap: 6rpx;

      .wave-bar-mini {
        width: 4rpx;
        height: 24rpx;
        background-color: #007aff;
        border-radius: 2rpx;
        
        &.active {
          animation: waveMini 0.6s infinite ease-in-out;
        }
      }
    }

    .interviewer-status-text {
      font-size: 26rpx;
      color: #6c7a8a;
      background-color: #f0f3f8;
      padding: 8rpx 20rpx;
      border-radius: 40rpx;
    }
  }
}

.chat-section-main {
  flex: 1;
  overflow: hidden;
  
  .chat-messages {
    height: 100%;
    padding: 20rpx;
    
    .chat-message {
      margin-bottom: 30rpx;

      &.interviewer {
        .message-bubble {
          background-color: #fff;
          border: 1rpx solid #e9edf2;
          border-radius: 24rpx 24rpx 24rpx 12rpx;
          margin-right: 80rpx;
        }
      }

      &.candidate {
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .message-bubble {
          background: linear-gradient(135deg, #007aff, #0066cc);
          color: #fff;
          border-radius: 24rpx 24rpx 12rpx 24rpx;
          margin-left: 80rpx;
        }
      }

      .message-bubble {
        padding: 20rpx 24rpx;
        margin-bottom: 8rpx;
        display: inline-block;
        max-width: 85%;
        
        text {
          font-size: 30rpx;
          line-height: 1.45;
        }
      }

      .message-time {
        font-size: 22rpx;
        color: #9aa6b5;
        margin-top: 6rpx;
        display: block;
      }
    }

    .thinking-indicator {
      display: flex;
      align-items: center;
      padding: 16rpx 0;

      .thinking-dots {
        display: flex;
        margin-right: 16rpx;
        .dot {
          width: 12rpx;
          height: 12rpx;
          background-color: #007aff;
          border-radius: 50%;
          margin: 0 4rpx;
          animation: thinking 1.2s infinite;
        }
      }
      text {
        font-size: 26rpx;
        color: #8f9bb3;
      }
    }
  }
}

.bottom-panel {
  flex-shrink: 0;
  display: flex;
  gap: 24rpx;
  padding: 20rpx 30rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #eef2f6;
  
  .tips-card {
    flex: 1.2;
    background-color: #f8fafd;
    border-radius: 24rpx;
    padding: 20rpx 24rpx;
    
    &.collapsed {
      flex: 0.4;
    }
    
    .tips-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .tips-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #1f2a3e;
      }
      
      .collapse-icon {
        width: 32rpx;
        height: 32rpx;
        transition: transform 0.2s ease;
        &.rotated {
          transform: rotate(180deg);
        }
      }
    }
    
    .tips-content {
      margin-top: 20rpx;
      .tip-item {
        margin-bottom: 16rpx;
        text {
          font-size: 26rpx;
          color: #5e6f8d;
        }
      }
    }
  }
  
  .control-buttons {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 24rpx;
    
    .ctrl-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: transparent;
      border: 3rpx solid #e0e0e0;
      padding: 12rpx 20rpx;
      border-radius: 40rpx;
      
      image {
        width: 44rpx;
        height: 44rpx;
        margin-bottom: 8rpx;
      }
      
      text {
        font-size: 24rpx;
        color: #5e6f8d;
      }
      
      &.end-btn {
        border: 3rpx solid #ff6b6b;
        text {
          color: #ff6b6b;
        }
      }
      
      &.replay-btn {
        border: 3rpx solid #007aff;
        text {
          color: #007aff;
        }
      }
      
      &[disabled] {
        opacity: 0.5;
      }
    }
    
    .voice-record-wrapper {
      position: relative;
      
      .voice-main-btn {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        background: linear-gradient(135deg, #007aff, #0051d5);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        
        &.recording {
          background: linear-gradient(135deg, #ff4757, #e33e4c);
          animation: pulse 1s infinite;
        }
        
        &.disabled {
          opacity: 0.6;
        }
        
        image {
          width: 52rpx;
          height: 52rpx;
          margin-bottom: 8rpx;
        }
        
        text {
          color: #fff;
          font-size: 22rpx;
          font-weight: 500;
        }
        
        &:active {
          transform: scale(0.95);
        }
      }
      
      .recording-tip {
        position: absolute;
        top: -56rpx;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0,0,0,0.7);
        padding: 8rpx 20rpx;
        border-radius: 60rpx;
        display: flex;
        align-items: center;
        gap: 12rpx;
        white-space: nowrap;
        
        .pulse-ring-mini {
          width: 20rpx;
          height: 20rpx;
          background-color: #ff4757;
          border-radius: 50%;
          animation: pulse-ring 0.8s infinite;
        }
        
        text {
          font-size: 24rpx;
          color: #fff;
        }
      }
    }
  }
  
  &.h5-bottom-panel {
    flex-direction: column;
    
    .tips-card {
      flex: none;
      margin-bottom: 16rpx;
    }
  }
  
  .h5-control-area {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    
    .h5-ctrl-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 70px;
      height: 70px;
      border-radius: 35px;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      cursor: pointer;
      transition: all 0.2s;
      
      &:active {
        transform: scale(0.95);
      }
      
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      &.replay-btn {
        border-color: #007aff;
        background: rgba(0, 122, 255, 0.1);
      }
      
      &.end-btn {
        border-color: #ff6b6b;
        background: rgba(255, 107, 107, 0.1);
      }
      
      .ctrl-icon {
        width: 28px;
        height: 28px;
        margin-bottom: 4px;
      }
      
      .ctrl-text {
        font-size: 12px;
        font-weight: 500;
        color: #333;
      }
      
      &.replay-btn .ctrl-text {
        color: #007aff;
      }
      
      &.end-btn .ctrl-text {
        color: #ff6b6b;
      }
    }
    
    .h5-text-input-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f5f7fa;
      border-radius: 40px;
      padding: 4px 4px 4px 16px;
      border: 1px solid #e9ecef;
      
      .h5-text-input {
        flex: 1;
        height: 44px;
        font-size: 15px;
        background: transparent;
        border: none;
        outline: none;
        padding: 0;
        font-family: inherit;
        
        &::placeholder {
          color: #adb5bd;
        }
        
        &:disabled {
          opacity: 0.6;
        }
      }
      
      .h5-send-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 70px;
        height: 44px;
        border-radius: 22px;
        background: linear-gradient(135deg, #007aff, #0051d5);
        cursor: pointer;
        transition: all 0.2s;
        
        &:active {
          transform: scale(0.95);
        }
        
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #adb5bd;
        }
        
        .send-icon {
          width: 20px;
          height: 20px;
          margin-bottom: 2px;
        }
        
        .send-text {
          font-size: 11px;
          font-weight: 500;
          color: #fff;
        }
      }
    }
  }
}

.report-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.report-modal {
  width: 90%;
  max-width: 700rpx;
  max-height: 85vh;
  background-color: #fff;
  border-radius: 32rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.2);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 32rpx;
  border-bottom: 2rpx solid #eef2f6;
  flex-shrink: 0;
  background: #fff;
  
  .report-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
  
  .close-report {
    width: 40rpx;
    height: 40rpx;
    padding: 10rpx;
    opacity: 0.6;
    
    &:active {
      opacity: 1;
    }
  }
}

.report-content-wrapper {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background-color: #fff;
  
  &::-webkit-scrollbar {
    width: 6px;
    background: #f0f0f0;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
}

.report-content {
  padding: 0 32rpx 32rpx 32rpx;
}

.score-section {
      text-align: center;
      margin-bottom: 30rpx;
      padding-top: 20rpx;

      .score-title {
        font-size: 32rpx;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }

      .score-circle {
        width: 200rpx;
        height: 200rpx;
        border-radius: 50%;
        background: conic-gradient(#007aff 0deg, #007aff calc(v-bind(overallScore) * 3.6deg), #e0e0e0 calc(v-bind(overallScore) * 3.6deg));
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          width: 160rpx;
          height: 160rpx;
          background-color: #fff;
          border-radius: 50%;
        }

        .score-number {
          font-size: 48rpx;
          font-weight: bold;
          color: #007aff;
          position: relative;
          z-index: 1;
        }

        .score-total {
          font-size: 32rpx;
          color: #666;
          position: relative;
          z-index: 1;
        }
      }
    }

.radar-section {
  margin: 40rpx 0 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
    text-align: center;
  }
  
  .radar-chart {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 350px;
    padding: 20rpx;
    background: #fafbfc;  
    border-radius: 24rpx;
    margin-top: 10rpx;
    
    .radar-canvas {
      width: 300px;
      height: 300px;
      max-width: 100%;
      background: transparent;  
      border-radius: 16rpx;
      display: block;
    }
  }
}

.evaluation-section {
  margin: 40rpx 0 30rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
    padding-left: 8rpx;
  }
  
  .evaluation-item {
    margin-bottom: 24rpx;
    padding: 28rpx 24rpx;
    background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
    border-radius: 20rpx;
    border: 1rpx solid #eef2f6;
    
    .item-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #007aff;
      margin-bottom: 16rpx;
      display: block;
    }
    
    .item-content {
      font-size: 28rpx;
      color: #555;
      line-height: 1.5;
    }
  }
}

.suggestions-section {
  margin: 40rpx 0 30rpx;
  padding-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
    padding-left: 8rpx;
  }
  
  .suggestion-item {
    margin-bottom: 20rpx;
    padding: 16rpx 24rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    
    text {
      font-size: 28rpx;
      color: #555;
      line-height: 1.5;
    }
  }
}

.report-footer {
  display: flex;
  padding: 24rpx 32rpx;
  border-top: 2rpx solid #eef2f6;
  gap: 24rpx;
  flex-shrink: 0;
  background: #fff;
  
  .report-btn {
    flex: 1;
    padding: 28rpx;
    border-radius: 60rpx;
    font-size: 30rpx;
    font-weight: 500;
    text-align: center;
    transition: all 0.2s ease;
    
    &:active {
      transform: scale(0.98);
    }
    
    &.restart-btn {
      background: #f8f9fa;
      color: #007aff;
      border: 2rpx solid #e9ecef;
      
      &:active {
        background: #e9ecef;
      }
    }
    
    &.export-btn {
      background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
      color: #fff;
      border: none;
      
      &:active {
        opacity: 0.9;
      }
    }
  }
}

.cascade-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: flex-end;
  z-index: 2000;
}

.cascade-modal {
  width: 100%;
  height: 70vh;
  background-color: #fff;
  border-radius: 32rpx 32rpx 0 0;
  display: flex;
  flex-direction: column;
  
  .cascade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx 36rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .cascade-title {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
    }
    
    .cascade-close {
      font-size: 30rpx;
      color: #007aff;
      padding: 12rpx 20rpx;
    }
  }
  
  .cascade-body {
    flex: 1;
    display: flex;
    overflow: hidden;
    
    .category-list {
      width: 35%;
      background-color: #f8f9fa;
      border-right: 1rpx solid #e9ecef;
      
      .category-item {
        padding: 28rpx 24rpx;
        font-size: 28rpx;
        color: #666;
        border-left: 4rpx solid transparent;
        
        &.active {
          background-color: #fff;
          color: #007aff;
          font-weight: 600;
          border-left-color: #007aff;
        }
      }
    }
    
    .position-list {
      flex: 1;
      
      .position-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 28rpx 32rpx;
        font-size: 30rpx;
        color: #333;
        border-bottom: 1rpx solid #f5f5f5;
        
        &.active {
          color: #007aff;
          font-weight: 500;
          background-color: #f0f8ff;
        }
        
        .check-icon {
          font-size: 28rpx;
          color: #007aff;
        }
      }
    }
  }
}

@keyframes waveMini {
  0%, 100% { height: 16rpx; }
  50% { height: 32rpx; }
}

@keyframes thinking {
  0%, 60%, 100% { transform: scale(1); opacity: 0.5; }
  30% { transform: scale(1.3); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}

// 响应式
@media (max-width: 768px) {
  .interview-area .bottom-panel {
    flex-direction: column;
    
    .tips-card.collapsed {
      flex: auto;
    }
    
    .control-buttons {
      justify-content: space-around;
    }
  }
}

// 暗黑模式
@media (prefers-color-scheme: dark) {
  .interview-container {
    background-color: #1a1a1a;
  }
  
  .header, .progress-section, .interviewer-status-bar, .bottom-panel {
    background-color: #2d2d2d;
  }
  
  .config-card, .report-modal, .cascade-modal {
    background-color: #2d2d2d;
  }
  
  .page-title, .config-title, .form-label, .report-title, .section-title, .score-title,
  .tips-title, .interviewer-name {
    color: #fff;
  }
  
  .message-bubble {
    background-color: #3d3d3d;
    color: #fff;
  }
  
  .form-textarea, .cascade-selector, .user-id-display {
    background-color: #3d3d3d;
    border-color: #4d4d4d;
    color: #fff;
  }
  
  .evaluation-item {
    background-color: #1e1e1e;
  }
  
  .h5-text-input-wrapper {
    background: #3d3d3d !important;
    border-color: #4d4d4d !important;
    
    .h5-text-input {
      color: #fff;
      
      &::placeholder {
        color: #8f9bb3;
      }
    }
  }
  
  .h5-ctrl-btn {
    background: #3d3d3d !important;
    border-color: #4d4d4d !important;
    
    .ctrl-text {
      color: #fff !important;
    }
    
    &.replay-btn .ctrl-text {
      color: #007aff !important;
    }
    
    &.end-btn .ctrl-text {
      color: #ff6b6b !important;
    }
  }
}
</style>