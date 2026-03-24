<template>
  <view class="interview-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-content">
        <button class="back-btn" @click="goBack">
          <image src="/static/ai/back.png" mode="aspectFit"></image>
          <text class="back-text">返回</text>
        </button>
        <text class="page-title">AI模拟面试</text>
        <view class="header-right"></view>
      </view>
    </view>

    <!-- 面试信息配置区 -->
    <view v-if="!interviewStarted" class="config-section">
      <view class="config-card">
        <text class="config-title">面试配置</text>

        <!-- 方式选择 -->
        <view class="method-tabs">
          <view v-for="(method, index) in interviewMethods" :key="index"
                :class="['tab-item', { active: currentMethod === method.value }]"
                @click="selectMethod(method.value)">
            <text>{{ method.label }}</text>
          </view>
        </view>

        <!-- 动态表单 -->
        <view class="form-fields">
          <view v-if="currentMethod.includes('resumeText')" class="form-group">
            <text class="form-label">简历文本</text>
            <textarea class="form-textarea" 
                      v-model="formData.resumeText" 
                      placeholder="请粘贴您的简历内容"></textarea>
          </view>

          <view v-if="currentMethod.includes('pdf')" class="form-group">
            <text class="form-label">PDF简历</text>
            <view class="file-upload-area" @click="chooseResumeFile">
              <image v-if="!formData.resumePdf" src="/static/ai/upload.png" mode="aspectFit"></image>
              <text v-if="!formData.resumePdf">点击上传PDF简历</text>
              <text v-else class="file-name">{{ formData.resumePdf.name }}</text>
            </view>
          </view>

          <view v-if="currentMethod.includes('user')" class="form-group">
            <text class="form-label">用户ID</text>
            <view class="user-id-display" :class="{ 'loading': isLoadingUser, 'error': !formData.userId && !isLoadingUser }">
              <text v-if="isLoadingUser" class="loading-text">获取用户信息中...</text>
              <text v-else-if="formData.userId" class="user-id-text">
                {{ formData.userId }}
              </text>
              <text v-else class="error-text">
                未获取到用户信息，请
                <text class="retry-link" @click.stop="fetchUserInfo">点击重试</text>
                或重新登录
              </text>
            </view>
          </view>

          <view v-if="currentMethod.includes('position')" class="form-group">
            <text class="form-label">职位选择</text>
            <view class="cascade-selector" @click="openCascadePicker">
              <view class="selector-content" :class="{ 'placeholder': !selectedPositionId }">
                <text v-if="selectedPositionId">{{ selectedCategoryName }} - {{ selectedPositionName }}</text>
                <text v-else>请选择职位</text>
              </view>
              <text class="arrow-icon">›</text>
            </view>
          </view>

          <view v-if="currentMethod.includes('positionText')" class="form-group">
            <text class="form-label">岗位描述</text>
            <textarea class="form-textarea" 
                      v-model="formData.positionText" 
                      placeholder="请输入岗位描述"></textarea>
          </view>
        </view>

        <button class="start-btn" @click="startInterview" :loading="isStarting">
          {{ isStarting ? '启动中...' : '开始面试' }}
        </button>
      </view>
    </view>

    <!-- 面试交互区 -->
    <view v-else class="interview-area">
      <view class="progress-section">
        <text class="progress-text">面试进度 {{ currentQuestion }}/{{ totalQuestions }}</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
        <text class="stage-text">{{ currentStage }}</text>
      </view>

      <!-- 面试内容区 -->
      <view class="interview-content">
        <view class="interviewer-section">
          <view class="interviewer-avatar">
            <image src="/static/ai/interviewer.png" mode="aspectFit"></image>
          </view>
          <view class="voice-wave" v-if="isSpeaking">
            <view v-for="i in 5" :key="i" 
                  :class="['wave-bar', { active: voiceWaveActive }]"
                  :style="{ animationDelay: (i * 0.1) + 's' }"></view>
          </view>
          <text class="interviewer-status">{{ getInterviewerStatus() }}</text>
        </view>

        <!-- 中间：对话区域 -->
        <view class="chat-section">
          <scroll-view class="chat-messages" scroll-y :scroll-top="chatScrollTop" scroll-with-animation>
            <view v-for="(message, index) in interviewMessages" :key="index"
                  :class="['chat-message', message.sender]">
              <view class="message-bubble">
                <text>{{ message.content }}</text>
              </view>
              <text class="message-time">{{ formatTime(message.timestamp) }}</text>
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

        <!-- 右侧：面试技巧 -->
        <view class="tips-section" :class="{ collapsed: tipsCollapsed }">
          <view class="tips-header" @click="toggleTips">
            <text>面试技巧</text>
            <image :class="['collapse-icon', { rotated: tipsCollapsed }]" 
                   src="/static/ai/arrow-right.png" mode="aspectFit"></image>
          </view>
          <view v-if="!tipsCollapsed" class="tips-content">
            <view v-for="(tip, index) in currentTips" :key="index" class="tip-item">
              <text>• {{ tip }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部控制区 -->
      <view class="control-section">
        <button class="control-btn replay-btn" @click="replayQuestion" :disabled="!currentAudioUrl">
          <image src="/static/ai/replay.png" mode="aspectFit"></image>
          <text>重听问题</text>
        </button>

        <view class="voice-record-area">
          <button class="voice-btn" 
                  :class="{ recording: isRecording, disabled: isProcessing }"
                  @touchstart="startRecording"
                  @touchend="stopRecording"
                  :disabled="isProcessing">
            <image :src="isRecording ? '/static/ai/recording.png' : '/static/ai/mic.png'" mode="aspectFit"></image>
            <text>{{ isRecording ? '录音中...' : (isProcessing ? '处理中...' : '按住说话') }}</text>
          </button>
          <view v-if="isRecording" class="recording-indicator">
            <view class="pulse-ring"></view>
            <text>{{ recordingTime }}s</text>
          </view>
        </view>

        <button class="control-btn end-btn" @click="confirmEndInterview">
          <image src="/static/ai/end.png" mode="aspectFit"></image>
          <text>结束面试</text>
        </button>
      </view>
    </view>

    <!-- 面试报告弹窗  -->
    <view v-if="showReport" class="report-overlay" @click="closeReport">
      <view class="report-modal" @click.stop>
        <view class="report-header">
          <text class="report-title">面试报告</text>
          <image class="close-report" src="/static/ai/close.png" @click="closeReport" mode="aspectFit"></image>
        </view>

        <view class="report-content-wrapper">
          <scroll-view class="report-scroll-view" scroll-y>
            <view class="score-section">
              <text class="score-title">综合评分</text>
              <view class="score-circle">
                <text class="score-number">{{ overallScore }}</text>
                <text class="score-total">/100</text>
              </view>
            </view>

            <!-- 雷达图区域 - -->
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
          </scroll-view>
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
          <!-- 左侧分类列表 -->
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
          <!-- 右侧职位列表 -->
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
import { getStaticUrl, interviewApi } from '@/common/api/ai.js'
const BASE_URL = 'http://localhost:5000'
// 录音管理器
const recorderManager = uni.getRecorderManager()

export default {
  data() {
    return {
      // 页面状态
      interviewStarted: false,
      isStarting: false,
      currentMethod: 'resumeText+positionText',

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

      // 面试配置
      interviewMethods: [
        { value: 'resumeText+positionText', label: '简历文本+岗位文本' },
        { value: 'pdf+positionText', label: 'PDF简历+岗位文本' },
        { value: 'pdf+position', label: 'PDF简历+岗位ID' },
        { value: 'user+position', label: '用户ID+岗位ID' },
        { value: 'user+positionText', label: '用户ID+岗位文本' },
        { value: 'resumeText+position', label: '简历文本+岗位ID' }
      ],

      // 面试流程状态
      sessionId: null,
      currentQuestion: 0,
      totalQuestions: 8,
      currentStage: '自我介绍',
      resumeSource: '',
      jobSource: '',

      // 录音状态
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
      reportData: null
    }
  },

  computed: {
    progressPercent() {
      return Math.min((this.currentQuestion / this.totalQuestions) * 100, 100)
    },
    // 当前分类下的职位列表
    currentPositions() {
      if (!this.selectedCategoryId) return []
      return this.positionDetails[this.selectedCategoryId] || []
    },
    // 判断是否已获取到用户信息
    hasUserInfo() {
      return !!this.formData.userId
    }
  },

  onLoad() {
    this.initializeInterview()
    this.initRecorder()
    this.fetchUserInfo()
    this.resetPositionSelection() 
  },

  onUnload() {
    this.cleanupInterview()
  },

  methods: {
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
      // 表单中无有效职位ID，且当前未选中任何分类，则默认选中第一个分类的第一个职位
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
        uni.showToast({ title: '获取用户信息失败', icon: 'none', duration: 2000 })
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
      recorderManager.onStart(() => {
        console.log('录音开始')
        this.isRecording = true
        this.startRecordingTimer()
      })
      recorderManager.onStop((res) => {
        console.log('录音结束', res)
        this.isRecording = false
        this.clearRecordingTimer()
        this.audioFilePath = res.tempFilePath
        this.processAudio(res.tempFilePath)
      })
      recorderManager.onError((err) => {
        console.error('录音错误', err)
        this.isRecording = false
        this.clearRecordingTimer()
        uni.showToast({ title: '录音失败: ' + err.message, icon: 'none' })
      })
    },
    cleanupInterview() {
      this.resetInterview()
      this.clearRecordingTimer()
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
        this.innerAudioContext = null
      }
      if (this.isRecording) {
        recorderManager.stop()
      }
    },
    getInterviewerStatus() {
      if (this.isAIThinking) return '思考中...'
      if (this.isSpeaking) return '说话中...'
      if (this.isProcessing) return '处理中...'
      return '等待中'
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
      // #ifdef MP-WEIXIN
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['pdf'],
        success: (res) => {
          const file = res.tempFiles[0]
          const fs = uni.getFileSystemManager()
          fs.readFile({
            filePath: file.path,
            encoding: 'base64',
            success: (readRes) => {
              this.formData.resumePdf = {
                name: file.name,
                path: file.path,
                base64: readRes.data
              }
            },
            fail: (err) => {
              console.error('读取文件失败', err)
              uni.showToast({ title: '文件读取失败', icon: 'none' })
            }
          })
        },
        fail: (err) => {
          console.log('选择文件取消或失败', err)
        }
      })
      // #endif

      // #ifdef APP || H5
      uni.chooseFile({
        count: 1,
        type: 'file',
        extension: ['pdf'],
        success: (res) => {
          const file = res.tempFiles[0]
          const fs = uni.getFileSystemManager()
          fs.readFile({
            filePath: file.path,
            encoding: 'base64',
            success: (readRes) => {
              this.formData.resumePdf = {
                name: file.name,
                path: file.path,
                base64: readRes.data
              }
            },
            fail: (err) => {
              console.error('读取文件失败', err)
              uni.showToast({ title: '文件读取失败', icon: 'none' })
            }
          })
        },
        fail: (err) => {
          console.log('选择文件取消或失败', err)
        }
      })
      // #endif
    },

    // ==================== 表单验证 ====================
    validateForm() {
      const method = this.currentMethod

      if (method.includes('resumeText') && !this.formData.resumeText.trim()) {
        uni.showToast({ title: '请输入简历文本', icon: 'none' })
        return false
      }
      if (method.includes('pdf') && !this.formData.resumePdf) {
        uni.showToast({ title: '请上传PDF简历', icon: 'none' })
        return false
      }
      if (method.includes('user')) {
        if (!this.formData.userId) {
          uni.showToast({ title: '未获取到用户信息，请重新登录', icon: 'none', duration: 3000 })
          this.fetchUserInfo()
          return false
        }
      }
      if (method.includes('position')) {
        if (!this.selectedPositionId) {
          uni.showToast({ title: '请选择职位', icon: 'none' })
          return false
        }
      }
      if (method.includes('positionText') && !this.formData.positionText.trim()) {
        uni.showToast({ title: '请输入岗位描述', icon: 'none' })
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
        console.error('启动面试失败', error)
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
      recorderManager.start({ duration: 180000, sampleRate: 16000, numberOfChannels: 1, encodeBitRate: 96000, format: 'mp3' })
    },
    stopRecording() {
      if (!this.isRecording) return
      recorderManager.stop()
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
    async processAudio(filePath) {
      if (!this.sessionId) {
        uni.showToast({ title: '会话异常', icon: 'none' })
        return
      }
      this.isProcessing = true
      try {
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
        uni.showToast({ title: error.message || '语音识别失败', icon: 'none' })
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
    playAudio(url) {
      if (!this.innerAudioContext) return
      this.isSpeaking = true
      this.voiceWaveActive = true
      const fullUrl = getStaticUrl(url)
      console.log('播放音频，完整URL:', fullUrl)
      this.innerAudioContext.offError()
      this.innerAudioContext.offEnded()
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
      this.innerAudioContext.src = fullUrl
      this.innerAudioContext.play()
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
          }, 200)
        })
      } catch (error) {
        console.error('获取报告失败', error)
        this.generateMockReport()
        this.showReport = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.drawRadarChart()
          }, 200)
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
      // 构建报告内容
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
    
      const fs = uni.getFileSystemManager();
      const filePath = `${uni.env.USER_DATA_PATH}/report_${Date.now()}.doc`;
    
      fs.writeFile({
        filePath,
        data: htmlContent,
        encoding: 'utf8',
        success: () => {
          uni.openDocument({
            filePath: filePath,
            success: () => {
              uni.showToast({ title: '报告已保存并打开', icon: 'success' });
            },
            fail: (err) => {
              console.error('打开文件失败', err);
              uni.showToast({ title: '报告已保存，但打开失败', icon: 'none' });
            }
          });
        },
        fail: (err) => {
          console.error('写入文件失败', err);
          uni.showToast({ title: '导出失败', icon: 'none' });
        }
      });
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
      this.currentQuestion = 0
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
  background-color: #f8f8f8;
}

.header {
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 100;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: calc(var(--status-bar-height) + 20rpx) 30rpx 20rpx;
    max-width: 1200rpx;
    margin: 0 auto;
  }

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16rpx 24rpx;
    border-radius: 24rpx;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1rpx solid #dee2e6;
    transition: all 0.3s ease;
    min-width: 120rpx;
    z-index: 10;

    &:active {
      transform: scale(0.95);
      background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
    }

    image {
      width: 40rpx;
      height: 40rpx;
      margin-right: 12rpx;
    }

    .back-text {
      font-size: 28rpx;
      color: #495057;
      font-weight: 500;
    }
  }

  .page-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
    letter-spacing: 0.5rpx;
    flex: 1;
    text-align: center;
    margin: 0 20rpx;
    pointer-events: none;
  }

  .header-right {
    width: 120rpx;
    height: 56rpx;
    visibility: hidden;
  }
}

.config-section {
  flex: 1;
  padding: 32rpx;
  background-color: #f8f8f8;

  .config-card {
    background-color: #fff;
    border-radius: 24rpx;
    padding: 48rpx 40rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
    border: 1rpx solid rgba(0, 0, 0, 0.05);

    .config-title {
      font-size: 40rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 48rpx;
      display: block;
      text-align: center;
      letter-spacing: 0.5rpx;
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
        border: 2rpx solid #e9ecef;
        border-radius: 20rpx;
        text-align: center;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        transition: all 0.3s ease;
        cursor: pointer;

        &.active {
          border-color: #007aff;
          background: linear-gradient(135deg, #e6f2ff 0%, #cce4ff 100%);
          color: #007aff;
          box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.15);
        }

        &:active {
          transform: scale(0.98);
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
          letter-spacing: 0.3rpx;
        }

        .form-input {
          width: 100%;
          padding: 28rpx 24rpx;
          border: 2rpx solid #e9ecef;
          border-radius: 20rpx;
          font-size: 30rpx;
          background-color: #fff;
          transition: all 0.3s ease;
          box-sizing: border-box;

          &:focus {
            border-color: #007aff;
            box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.1);
          }

          &::placeholder {
            color: #adb5bd;
          }
        }

        .form-textarea {
          width: 100%;
          min-height: 200rpx;
          padding: 28rpx 24rpx;
          border: 2rpx solid #e9ecef;
          border-radius: 20rpx;
          font-size: 30rpx;
          background-color: #fff;
          transition: all 0.3s ease;
          resize: vertical;
          box-sizing: border-box;

          &:focus {
            border-color: #007aff;
            box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.1);
          }

          &::placeholder {
            color: #adb5bd;
          }
        }

        .file-upload-area {
          padding: 60rpx 40rpx;
          border: 2rpx dashed #007aff;
          border-radius: 20rpx;
          text-align: center;
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%);
          transition: all 0.3s ease;
          cursor: pointer;

          &:active {
            transform: scale(0.98);
            background: linear-gradient(135deg, #e6f2ff 0%, #cce4ff 100%);
          }

          image {
            width: 80rpx;
            height: 80rpx;
            margin-bottom: 24rpx;
          }

          text {
            display: block;
            color: #007aff;
            font-size: 30rpx;
            font-weight: 500;
          }

          .file-name {
            color: #28a745;
            font-size: 28rpx;
            word-break: break-all;
          }
        }
        
        .user-id-display {
          width: 90%; 
          padding: 24rpx 28rpx;
          border: 2rpx solid #e9ecef;
          border-radius: 16rpx;
          background-color: #f8f9fa;
          transition: all 0.3s ease;
          
          &.loading {
            background-color: #fffbeb;
            border-color: #f59e0b;
          }
          
          &.error {
            background-color: #fef2f2;
            border-color: #ef4444;
          }
          
          .loading-text {
            font-size: 30rpx;
            color: #d97706;
          }
          
          .user-id-text {
            font-size: 30rpx;
            color: #007aff;
            font-weight: 500;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 16rpx;
            
            .auto-tag {
              display: inline-block;
              font-size: 22rpx;
              color: #fff;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              padding: 4rpx 12rpx;
              border-radius: 8rpx;
              font-weight: 500;
            }
          }
          
          .error-text {
            font-size: 30rpx;
            color: #dc2626;
            
            .retry-link {
              color: #007aff;
              text-decoration: underline;
              font-weight: 500;
              
              &:active {
                opacity: 0.7;
              }
            }
          }
        }

        .cascade-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24rpx 28rpx;
          border: 2rpx solid #e9ecef;
          border-radius: 16rpx;
          background-color: #fff;
          transition: all 0.3s ease;
          cursor: pointer;
          
          &:active {
            background-color: #f8f9fa;
            transform: scale(0.98);
          }
          
          .selector-content {
            flex: 1;
            font-size: 30rpx;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            
            &.placeholder {
              color: #adb5bd;
            }
          }
          
          .arrow-icon {
            font-size: 32rpx;
            color: #999;
            margin-left: 16rpx;
            font-weight: 400;
          }
        }
      }
    }

    .start-btn {
      width: 100%;
      background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
      color: #fff;
      border-radius: 28rpx;
      padding: 32rpx;
      font-size: 36rpx;
      font-weight: 600;
      box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.3);
      transition: all 0.3s ease;
      letter-spacing: 1rpx;

      &:active {
        transform: scale(0.98);
        box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.2);
      }

      &[loading] {
        opacity: 0.8;
      }
    }
  }
}

.interview-area {
  flex: 1;
  display: flex;
  flex-direction: column;

  .progress-section {
    padding: 30rpx;
    background-color: #fff;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);

    .progress-text {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 15rpx;
    }

    .progress-bar {
      height: 12rpx;
      background-color: #e0e0e0;
      border-radius: 6rpx;
      overflow: hidden;
      margin-bottom: 15rpx;

      .progress-fill {
        height: 100%;
        background-color: #007aff;
        transition: width 0.3s ease;
      }
    }

    .stage-text {
      font-size: 32rpx;
      color: #333;
      font-weight: 600;
    }
  }

  .interview-content {
    flex: 1;
    display: flex;
    padding: 30rpx;
    gap: 30rpx;

    .interviewer-section {
      width: 200rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .interviewer-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 20rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .voice-wave {
        display: flex;
        align-items: center;
        height: 40rpx;
        margin-bottom: 16rpx;

        .wave-bar {
          width: 6rpx;
          height: 16rpx;
          background-color: #ccc;
          margin: 0 3rpx;
          border-radius: 3rpx;
          transition: all 0.3s ease;

          &.active {
            animation: wave 1s infinite;
          }

          &:nth-child(2) { animation-delay: 0.1s; }
          &:nth-child(3) { animation-delay: 0.2s; }
          &:nth-child(4) { animation-delay: 0.3s; }
          &:nth-child(5) { animation-delay: 0.4s; }
        }
      }

      .interviewer-status {
        font-size: 24rpx;
        color: #666;
        text-align: center;
      }
    }

    .chat-section {
      flex: 1;
      background-color: #fff;
      border-radius: 20rpx;
      padding: 30rpx;
      box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);

      .chat-messages {
        height: 100%;

        .chat-message {
          margin-bottom: 30rpx;

          &.interviewer {
            .message-bubble {
              background-color: #f0f8ff;
              border: 2rpx solid #007aff;
              margin-right: 100rpx;
            }
          }

          &.candidate {
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            .message-bubble {
              background-color: #e6f7ff;
              margin-left: 100rpx;
            }
          }

          .message-bubble {
            padding: 20rpx;
            border-radius: 15rpx;
            margin-bottom: 10rpx;

            text {
              font-size: 30rpx;
              line-height: 1.5;
            }
          }

          .message-time {
            font-size: 24rpx;
            color: #999;
          }
        }

        .thinking-indicator {
          display: flex;
          align-items: center;
          margin-bottom: 30rpx;

          text {
            font-size: 28rpx;
            color: #666;
            margin-left: 20rpx;
          }

          .thinking-dots {
            display: flex;

            .dot {
              width: 12rpx;
              height: 12rpx;
              background-color: #007aff;
              border-radius: 50%;
              margin: 0 6rpx;
              animation: thinking 1.4s infinite;

              &:nth-child(2) { animation-delay: 0.2s; }
              &:nth-child(3) { animation-delay: 0.4s; }
            }
          }
        }
      }
    }

    .tips-section {
      width: 250rpx;
      background-color: #fff;
      border-radius: 20rpx;
      padding: 30rpx;
      box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
      transition: all 0.3s ease;

      &.collapsed {
        width: 80rpx;

        .tips-content {
          display: none;
        }
      }

      .tips-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        cursor: pointer;

        text {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
        }

        .collapse-icon {
          width: 30rpx;
          height: 30rpx;
          transition: transform 0.3s ease;

          &.rotated {
            transform: rotate(180deg);
          }
        }
      }

      .tips-content {
        .tip-item {
          margin-bottom: 15rpx;

          text {
            font-size: 26rpx;
            color: #666;
            line-height: 1.4;
          }
        }
      }
    }
  }

  .control-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);

    .control-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: transparent;
      border: none;

      &[disabled] {
        opacity: 0.5;
      }

      image {
        width: 50rpx;
        height: 50rpx;
        margin-bottom: 10rpx;
      }

      text {
        font-size: 24rpx;
        color: #666;
      }

      &.end-btn {
        text {
          color: #ff4757;
        }
      }
    }

    .voice-record-area {
      position: relative;

      .voice-btn {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background-color: #007aff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: none;

        &.recording {
          background-color: #ff4757;
          animation: pulse 1s infinite;
        }

        &.disabled {
          background-color: #ccc;
        }

        &[disabled] {
          opacity: 0.6;
        }

        image {
          width: 50rpx;
          height: 50rpx;
          margin-bottom: 10rpx;
        }

        text {
          color: #fff;
          font-size: 22rpx;
        }
      }

      .recording-indicator {
        position: absolute;
        top: -60rpx;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;

        .pulse-ring {
          width: 60rpx;
          height: 60rpx;
          border: 4rpx solid #ff4757;
          border-radius: 50%;
          animation: pulse-ring 1s infinite;
        }

        text {
          font-size: 24rpx;
          color: #ff4757;
          margin-top: 10rpx;
        }
      }
    }
  }
}

/* 修复报告弹窗布局：解决遮挡和滚动问题 */
.report-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;

  .report-modal {
    width: 90%;
    max-width: 700rpx;
    height: 85vh;
    max-height: 85vh;
    background-color: #fff;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalSlideUp 0.3s ease-out;

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 2rpx solid #e0e0e0;
      flex-shrink: 0;

      .report-title {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
      }

      .close-report {
        width: 40rpx;
        height: 40rpx;
      }
    }

    .report-content-wrapper {
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .report-scroll-view {
      height: 100%;
      padding: 0 30rpx;
    }

    .report-content {
      padding-bottom: 20rpx;
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
      margin-bottom: 30rpx;
      flex-shrink: 0;

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }

      .radar-chart {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 320rpx;
        
        .radar-canvas {
          width: 300rpx;
          height: 300rpx;
        }
      }
    }

    .evaluation-section {
      margin-bottom: 30rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }

      .evaluation-item {
        margin-bottom: 20rpx;
        padding: 20rpx;
        background-color: #f8f9fa;
        border-radius: 12rpx;

        .item-title {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
          margin-bottom: 10rpx;
          display: block;
        }

        .item-content {
          font-size: 26rpx;
          color: #666;
          line-height: 1.5;
        }
      }
    }

    .suggestions-section {
      margin-bottom: 30rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
        display: block;
      }

      .suggestion-item {
        margin-bottom: 15rpx;

        text {
          font-size: 26rpx;
          color: #666;
          line-height: 1.5;
        }
      }
    }

    .report-footer {
      display: flex;
      padding: 20rpx 30rpx;
      border-top: 2rpx solid #e0e0e0;
      gap: 20rpx;
      flex-shrink: 0;
      background-color: #fff;

      .report-btn {
        flex: 1;
        padding: 24rpx;
        border-radius: 20rpx;
        font-size: 30rpx;
        font-weight: 500;

        &.restart-btn {
          background: linear-gradient(135deg, #f0f8ff 0%, #e6f2ff 100%);
          color: #007aff;
          border: 2rpx solid #007aff;
        }

        &.export-btn {
          background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
          color: #fff;
        }
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
  
  .cascade-modal {
    width: 100%;
    height: 70vh;
    background-color: #fff;
    border-radius: 32rpx 32rpx 0 0;
    animation: slideUp 0.3s ease-out;
    display: flex;
    flex-direction: column;
    
    .cascade-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 36rpx;
      border-bottom: 1rpx solid #f0f0f0;
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
      
      .cascade-title {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
      }
      
      .cascade-close {
        font-size: 30rpx;
        color: #007aff;
        padding: 12rpx 20rpx;
        
        &:active {
          opacity: 0.7;
        }
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
          transition: all 0.2s ease;
          border-left: 4rpx solid transparent;
          
          &:active {
            background-color: #e9ecef;
          }
          
          &.active {
            background-color: #fff;
            color: #007aff;
            font-weight: 600;
            border-left-color: #007aff;
          }
          
          text {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      
      .position-list {
        flex: 1;
        background-color: #fff;
        
        .position-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28rpx 32rpx;
          font-size: 30rpx;
          color: #333;
          border-bottom: 1rpx solid #f5f5f5;
          transition: all 0.2s ease;
          
          &:active {
            background-color: #f8f9fa;
          }
          
          &.active {
            color: #007aff;
            font-weight: 500;
            background-color: #f0f8ff;
          }
          
          text {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .check-icon {
            font-size: 28rpx;
            color: #007aff;
            margin-left: 16rpx;
            font-weight: 600;
          }
        }
      }
    }
  }
}

@keyframes wave {
  0%, 100% { height: 20rpx; }
  50% { height: 40rpx; }
}

@keyframes thinking {
  0%, 60%, 100% { transform: scale(1); }
  30% { transform: scale(1.3); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.3); opacity: 0; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes modalSlideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .interview-content {
    flex-direction: column;

    .interviewer-section {
      width: 100%;
      flex-direction: row;
      justify-content: center;
      margin-bottom: 20rpx;
    }

    .tips-section {
      width: 100%;
      margin-top: 20rpx;
    }
  }

  .control-section {
    flex-direction: column;
    gap: 20rpx;

    .voice-record-area {
      order: -1;
    }
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .interview-container {
    background-color: #1a1a1a;
  }
  
  .header {
    background-color: #2d2d2d;
    
    .page-title {
      color: #ffffff;
    }
    
    .back-btn {
      background: linear-gradient(135deg, #3d3d3d 0%, #2d2d2d 100%);
      border-color: #4d4d4d;
      
      .back-text {
        color: #ffffff;
      }
    }
  }
  
  .config-card {
    background-color: #2d2d2d !important;
    
    .config-title {
      color: #ffffff !important;
    }
    
    .form-label {
      color: #e0e0e0 !important;
    }
    
    .form-textarea {
      background-color: #3d3d3d !important;
      border-color: #4d4d4d !important;
      color: #ffffff !important;
    }
    
    .user-id-display {
      background-color: #3d3d3d !important;
      border-color: #4d4d4d !important;
      
      .user-id-text {
        color: #007aff !important;
      }
    }
    
    .cascade-selector {
      background-color: #3d3d3d !important;
      border-color: #4d4d4d !important;
      
      .selector-content {
        color: #ffffff !important;
        
        &.placeholder {
          color: #adb5bd !important;
        }
      }
    }
  }
  
  .cascade-modal {
    background-color: #2d2d2d !important;
    
    .cascade-header {
      background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
      border-bottom-color: #4d4d4d;
      
      .cascade-title {
        color: #ffffff;
      }
    }
    
    .category-list {
      background-color: #1a1a1a;
      border-right-color: #4d4d4d;
      
      .category-item {
        color: #999;
        
        &.active {
          background-color: #2d2d2d;
          color: #007aff;
        }
      }
    }
    
    .position-list {
      background-color: #2d2d2d;
      
      .position-item {
        color: #ffffff;
        border-bottom-color: #4d4d4d;
        
        &.active {
          background-color: #1a1a1a;
        }
      }
    }
  }
  
  .progress-section {
    background-color: #2d2d2d !important;
    
    .progress-text, .stage-text {
      color: #ffffff !important;
    }
  }
  
  .chat-section {
    background-color: #2d2d2d !important;
    
    .chat-message {
      &.interviewer .message-bubble {
        background-color: #1a1a1a !important;
        color: #ffffff !important;
      }
      
      &.candidate .message-bubble {
        background-color: #007aff !important;
        color: #ffffff !important;
      }
    }
  }
  
  .tips-section {
    background-color: #2d2d2d !important;
    
    .tips-header text {
      color: #ffffff !important;
    }
    
    .tip-item text {
      color: #e0e0e0 !important;
    }
  }
  
  .control-section {
    background-color: #2d2d2d !important;
    
    .control-btn text {
      color: #ffffff !important;
    }
  }
  
  .report-modal {
    background-color: #2d2d2d !important;
    
    .report-header {
      border-bottom-color: #4d4d4d;
      
      .report-title {
        color: #ffffff;
      }
    }
    
    .score-section .score-title,
    .radar-section .section-title,
    .evaluation-section .section-title,
    .suggestions-section .section-title {
      color: #ffffff !important;
    }
    
    .evaluation-item {
      background-color: #1a1a1a !important;
      
      .item-title {
        color: #ffffff !important;
      }
      
      .item-content {
        color: #cccccc !important;
      }
    }
    
    .suggestion-item text {
      color: #cccccc !important;
    }
    
    .report-footer {
      border-top-color: #4d4d4d;
      background-color: #2d2d2d;
    }
  }
}
</style>