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
          
           <!-- 用户ID显示区域：当选择包含user的方式时显示 -->
          <view v-if="currentMethod.includes('user')" class="form-group">
            <text class="form-label">用户ID</text>
            <view class="user-id-display" :class="{ 'loading': isLoadingUser, 'error': !formData.userId }">
              <text v-if="isLoadingUser" class="loading-text">获取用户信息中...</text>
              <text v-else-if="formData.userId" class="user-id-text">
                {{ formData.userId }}
                <text class="auto-tag"></text>
              </text>
              <text v-else class="error-text">
                未获取到用户信息，请
                <text class="retry-link" @click="fetchUserInfo">点击重试</text>
                或重新登录
              </text>
            </view>
          </view>

          
          <!-- 双滚轮职位选择器 -->
          <view v-if="currentMethod.includes('position')" class="form-group">
            <text class="form-label">职位选择</text>
            <view class="dual-picker-container">
              <picker @change="onMainCategoryChange" :range="mainCategories" range-key="name" class="picker-field dual-picker">
                <view class="picker-text">{{ getMainCategoryName() }}</view>
              </picker>
              <picker @change="onDetailPositionChange" :range="getCurrentDetailPositions()" range-key="name" class="picker-field dual-picker" :disabled="!hasSelectedMainCategory()">
                <view class="picker-text">{{ getSelectedPositionName() }}</view>
              </picker>
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
      <!-- 面试进度 -->
      <view class="progress-section">
        <text class="progress-text">面试进度 {{ currentQuestion }}/{{ totalQuestions }}</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
        <text class="stage-text">{{ currentStage }}</text>
      </view>
      
      <!-- 面试内容区 -->
      <view class="interview-content">
        <!-- 左侧：AI面试官 -->
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

    <!-- 面试报告弹窗 -->
    <view v-if="showReport" class="report-overlay" @click="closeReport">
      <view class="report-modal" @click.stop>
        <view class="report-header">
          <text class="report-title">面试报告</text>
          <image class="close-report" src="/static/ai/close.png" @click="closeReport" mode="aspectFit"></image>
        </view>
        
        <scroll-view class="report-content" scroll-y>
          <!-- 综合评分 -->
          <view class="score-section">
            <text class="score-title">综合评分</text>
            <view class="score-circle">
              <text class="score-number">{{ overallScore }}</text>
              <text class="score-total">/100</text>
            </view>
          </view>
          
          <!-- 雷达图 -->
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
        
        <view class="report-footer">
          <button class="report-btn restart-btn" @click="restartInterview">重新面试</button>
          <button class="report-btn export-btn" @click="exportReport">导出报告</button>
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
        positionName: '' // 新增：存储选择的职位名称
      },
      
      // 用户信息
      userInfo: null,
      isLoadingUser: false,
      
      // 双滚轮职位选择数据
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
          { id: '1', name: 'Web前端工程师' }, { id: '2', name: '移动端前端工程师' }, 
          { id: '3', name: '小程序开发工程师' }, { id: '4', name: '跨平台开发工程师' }, 
          { id: '5', name: '前端架构师' }, { id: '6', name: 'Node.js全栈工程师' }
        ],
        '102': [
          { id: '7', name: 'Java开发工程师' }, { id: '8', name: 'Python开发工程师' }, 
          { id: '9', name: 'PHP开发工程师' }, { id: '10', name: 'Go开发工程师' }, 
          { id: '11', name: 'C++开发工程师' }, { id: '12', name: 'C#开发工程师' }
        ],
        '103': [
          { id: '13', name: 'Android开发工程师' }, { id: '14', name: 'iOS开发工程师' }, 
          { id: '15', name: 'React Native开发工程师' }, { id: '16', name: 'Flutter开发工程师' }, 
          { id: '17', name: '移动应用架构师' }, { id: '18', name: 'Unity开发工程师' }
        ],
        '104': [
          { id: '19', name: '数据分析师' }, { id: '20', name: '数据科学家' }, 
          { id: '21', name: '机器学习工程师' }, { id: '22', name: '深度学习工程师' }, 
          { id: '23', name: '算法工程师' }, { id: '24', name: '大数据工程师' }
        ],
        '105': [
          { id: '25', name: '运维工程师' }, { id: '26', name: 'DevOps工程师' }, 
          { id: '27', name: '测试工程师' }, { id: '28', name: '自动化测试工程师' }, 
          { id: '29', name: '性能测试工程师' }, { id: '30', name: '安全测试工程师' }
        ],
        '106': [
          { id: '31', name: 'UI设计师' }, { id: '32', name: 'UX设计师' }, 
          { id: '33', name: '产品经理' }, { id: '34', name: '交互设计师' }, 
          { id: '35', name: '视觉设计师' }, { id: '36', name: '用户研究员' }
        ],
        '107': [
          { id: '37', name: '网络安全工程师' }, { id: '38', name: '信息安全工程师' }, 
          { id: '39', name: '渗透测试工程师' }, { id: '40', name: '安全运维工程师' }, 
          { id: '41', name: '安全架构师' }, { id: '42', name: '风控工程师' }
        ],
        '108': [
          { id: '43', name: '嵌入式软件工程师' }, { id: '44', name: '嵌入式硬件工程师' }, 
          { id: '45', name: '物联网开发工程师' }, { id: '46', name: '单片机开发工程师' }, 
          { id: '47', name: '驱动开发工程师' }, { id: '48', name: 'RTOS开发工程师' }
        ],
        '200': [
          { id: '49', name: '高级产品经理' }, { id: '50', name: '产品总监' }, 
          { id: '51', name: '设计总监' }, { id: '52', name: '用户体验总监' }
        ],
        '300': [
          { id: '53', name: '技术总监' }, { id: '54', name: '技术经理' }, 
          { id: '55', name: '项目经理' }, { id: '56', name: '研发总监' }
        ]
      },
      
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
    
    // 判断是否已获取到用户信息
    hasUserInfo() {
      return !!this.formData.userId
    }
  },
  
  onLoad() {
    this.initializeInterview()
    this.initRecorder()
    // 页面加载时自动获取用户信息
    this.fetchUserInfo()
    // 初始化职位选择
    this.initializePositionSelection()
  },
  
  onUnload() {
    this.cleanupInterview()
  },
  
  methods: {
    // 双滚轮职位选择方法
    onMainCategoryChange(e) {
      const index = parseInt(e.detail.value)
      if (index >= 0 && index < this.mainCategories.length) {
        const selectedCategory = this.mainCategories[index]
        // 自动选择第一个具体职位
        const detailPositions = this.positionDetails[selectedCategory.id]
        if (detailPositions && detailPositions.length > 0) {
          // 存储职位ID和名称
          this.formData.positionId = detailPositions[0].id
          this.formData.positionName = detailPositions[0].name
        } else {
          this.formData.positionId = ''
          this.formData.positionName = ''
        }
      }
    },
    
    // 具体职位选择
    onDetailPositionChange(e) {
      const index = parseInt(e.detail.value)
      const positions = this.getCurrentDetailPositions()
      if (index >= 0 && index < positions.length) {
        const selectedPosition = positions[index]
        // 存储职位ID和名称
        this.formData.positionId = selectedPosition.id
        this.formData.positionName = selectedPosition.name
      }
    },
    
    // 获取当前主分类下的具体职位
    getCurrentDetailPositions() {
      if (!this.formData.positionId) return []
      // 找到当前positionId对应的主分类
      for (const category of this.mainCategories) {
        const positions = this.positionDetails[category.id]
        if (positions && positions.some(p => p.id === this.formData.positionId)) {
          return positions
        }
      }
      return []
    },
    
    // 获取当前主分类
    getCurrentMainCategory() {
      if (!this.formData.positionId) return null
      for (const category of this.mainCategories) {
        const positions = this.positionDetails[category.id]
        if (positions && positions.some(p => p.id === this.formData.positionId)) {
          return category
        }
      }
      return null
    },
    
    // 获取主分类名称（用于显示）
    getMainCategoryName() {
      const category = this.getCurrentMainCategory()
      return category ? category.name : '请选择职位分类'
    },
    
    // 获取选中的职位名称（用于显示）
    getSelectedPositionName() {
      if (!this.formData.positionId) return '请选择具体职位'
      const positions = this.getCurrentDetailPositions()
      const position = positions.find(p => p.id === this.formData.positionId)
      return position ? position.name : '请选择具体职位'
    },
    
    // 检查是否已选择主分类
    hasSelectedMainCategory() {
      return this.getCurrentMainCategory() !== null
    },
    
    // 初始化职位选择
    initializePositionSelection() {
      // 设置默认职位为第一个分类的第一个职位
      if (this.mainCategories.length > 0) {
        const firstCategory = this.mainCategories[0]
        const firstPositions = this.positionDetails[firstCategory.id]
        if (firstPositions && firstPositions.length > 0) {
          this.formData.positionId = firstPositions[0].id
          this.formData.positionName = firstPositions[0].name
        }
      }
    },
    // 获取用户信息（从本地存储或后端）
    async fetchUserInfo() {
      this.isLoadingUser = true
      
      try {
        //从本地存储获取token，然后请求用户信息
        const token = uni.getStorageSync('token')
        
        if (!token) {
          console.log('未找到登录token，需要用户登录')
          // 跳转到登录页面
          // uni.navigateTo({ url: '/pages/login/login' })
          return
        }
        
        // 从本地存储获取缓存的用户信息
        const cachedUserInfo = uni.getStorageSync('userInfo')
        if (cachedUserInfo && cachedUserInfo.user_id) {
          this.userInfo = cachedUserInfo
          this.formData.userId = String(cachedUserInfo.user_id)
          console.log('从缓存获取用户ID:', this.formData.userId)
          return
        }
        
        // 如果本地没有，请求后端API获取用户信息
        const res = await this.getUserProfile()
        
        if (res.code === 200 && res.data) {
          this.userInfo = res.data
          this.formData.userId = String(res.data.user_id || res.data.userId || res.data.id)
          // 缓存到本地
          uni.setStorageSync('userInfo', res.data)
          console.log('从后端获取用户ID:', this.formData.userId)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        uni.showToast({
          title: '获取用户信息失败',
          icon: 'none',
          duration: 2000
        })
      } finally {
        this.isLoadingUser = false
      }
    },
    
    // 请求后端获取用户信息的API
    getUserProfile() {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${BASE_URL}/api/user/profile`,
          method: 'GET',
          header: {
            'Authorization': `Bearer ${uni.getStorageSync('token')}`
          },
          success: (res) => {
            resolve(res.data)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    
    // 初始化录音器
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
    
    getInterviewerStatus() {
      if (this.isAIThinking) return '思考中...'
      if (this.isSpeaking) return '说话中...'
      if (this.isProcessing) return '处理中...'
      return '等待中'
    },
    
    initializeInterview() {
      // 初始化音频播放器
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
    
    cleanupInterview() {
      // 清理面试资源
      this.resetInterview()
      this.clearRecordingTimer()
      
      // 销毁音频播放器
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy()
        this.innerAudioContext = null
      }
      
      // 停止录音
      if (this.isRecording) {
        recorderManager.stop()
      }
    },
    
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
    
    selectMethod(method) {
      this.currentMethod = method
      this.resetForm()
      // 重新填充userId
      if (this.userInfo) {
        this.formData.userId = String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id)
      }
      // 如果新方法包含职位选择，初始化职位
      if (method.includes('position')) {
        this.initializePositionSelection()
      }
    },
    
    // 选择PDF文件并转为Base64
    chooseResumeFile() {
      // #ifdef MP-WEIXIN
      // 微信小程序：使用 chooseMessageFile 从聊天会话中选择文件
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
    
    // 开始面试
    async startInterview() {
      if (!this.validateForm()) {
        return
      }
      
      this.isStarting = true
      
      try {
        let res
        
        // 根据选择的方式调用不同的API
        switch (this.currentMethod) {
          case 'resumeText+positionText':
            res = await interviewApi.startText(
              this.formData.resumeText,
              this.formData.positionText
            )
            break
            
          case 'pdf+positionText':
            if (!this.formData.resumePdf?.base64) {
              throw new Error('PDF文件未准备好')
            }
            res = await interviewApi.startPdfText(
              this.formData.resumePdf.base64,
              this.formData.positionText
            )
            break
            
          case 'pdf+position':
            if (!this.formData.resumePdf?.base64) {
              throw new Error('PDF文件未准备好')
            }
            // 使用职位名称而不是ID
            const jobName = (this.formData.positionName || '').trim()
            if (!jobName) {
              throw new Error('请选择有效的职位')
            }
            res = await interviewApi.startPdfJobName(
              this.formData.resumePdf.base64,
              jobName
            )
            break
            
          case 'user+position':
            // 使用职位名称而不是ID
            const userJobName = (this.formData.positionName || '').trim()
            if (!userJobName) {
              throw new Error('请选择有效的职位')
            }
            res = await interviewApi.startUserIdJobName(
              null, 
              userJobName
            )
            break
            
          case 'user+positionText':
            // userId已从后端自动获取，但API设计需要传入，使用formData中的
            res = await interviewApi.startUserIdText(
              this.formData.userId,
              this.formData.positionText
            )
            break
            
          case 'resumeText+position':
            // 使用职位名称而不是ID
            const textJobName = (this.formData.positionName || '').trim()
            if (!textJobName) {
              throw new Error('请选择有效的职位')
            }
            res = await interviewApi.startTextJobName(
              this.formData.resumeText,
              textJobName
            )
            break
            
          default:
            throw new Error('未知的面试方式')
        }
        
        console.log('面试启动响应', res)
        
        if (res.code === 200 || res.data?.session_id) {
          // 保存会话信息
          this.sessionId = res.session_id || res.data?.session_id
          this.resumeSource = res.resume_source || res.data?.resume_source
          this.jobSource = res.job_source || res.data?.job_source
          this.currentQuestion = res.question_number || res.data?.question_number || 1
          
          // 显示第一个问题
          const firstQuestion = res.question || res.data?.question
          const audioUrl = res.audio_url || res.data?.audio_url
          
          this.interviewStarted = true
          
          // 添加AI消息
          this.addMessage('interviewer', firstQuestion)
          
          // 播放音频
          if (audioUrl) {
            this.currentAudioUrl = audioUrl
            this.playAudio(audioUrl)
          }
          
          // 更新面试阶段
          this.updateInterviewStage()
        } else {
          throw new Error(res.message || '启动面试失败')
        }
      } catch (error) {
        console.error('启动面试失败', error)
        uni.showToast({ 
          title: error.message || '启动面试失败，请重试', 
          icon: 'none',
          duration: 3000
        })
      } finally {
        this.isStarting = false
      }
    },
    
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
      
      // 对于需要userId的方式，检查是否已自动获取
      if (method.includes('user')) {
        if (!this.formData.userId) {
          uni.showToast({ 
            title: '未获取到用户信息，请重新登录', 
            icon: 'none',
            duration: 3000
          })
          // 可以在这里触发重新获取用户信息或跳转登录
          this.fetchUserInfo()
          return false
        }
      }
      
      if (method.includes('position')) {
        if (!this.formData.positionName || !this.formData.positionName.trim()) {
          // 尝试自动初始化
          this.initializePositionSelection()
          
          // 再次检查
          if (!this.formData.positionName || !this.formData.positionName.trim()) {
            uni.showToast({ title: '请选择职位', icon: 'none' })
            return false
          }
        }
      }
      
      if (method.includes('positionText') && !this.formData.positionText.trim()) {
        uni.showToast({ title: '请输入岗位描述', icon: 'none' })
        return false
      }
      
      return true
    },
    
    // 开始录音
    startRecording() {
      if (this.isProcessing || this.isAIThinking) {
        uni.showToast({ title: '请等待AI响应', icon: 'none' })
        return
      }
      
      // 开始录音，最长60秒
      recorderManager.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 96000,
        format: 'mp3'
      })
    },
    
    // 停止录音
    stopRecording() {
      if (!this.isRecording) return
      recorderManager.stop()
    },
    
    startRecordingTimer() {
      this.recordingTime = 0
      this.recordingTimer = setInterval(() => {
        this.recordingTime++
        // 最长60秒自动停止
        if (this.recordingTime >= 60) {
          this.stopRecording()
        }
      }, 1000)
    },
    
    // 处理录音文件（语音识别）
    async processAudio(filePath) {
      if (!this.sessionId) {
        uni.showToast({ title: '会话异常', icon: 'none' })
        return
      }
      
      this.isProcessing = true
      
      try {
        // 上传音频进行语音识别
        const uploadRes = await interviewApi.transcribe(this.sessionId, filePath)
        
        console.log('语音识别结果', uploadRes)
        
        // 解析uploadFile的响应
        let transcribeData
        if (typeof uploadRes.data === 'string') {
          transcribeData = JSON.parse(uploadRes.data)
        } else {
          transcribeData = uploadRes.data
        }
        
        if (transcribeData.code === 200 && transcribeData.text) {
          const userText = transcribeData.text
          
          // 添加用户消息
          this.addMessage('candidate', userText)
          
          // 发送回答给AI
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
    
    // 发送回答并获取下一个问题
    async sendAnswer(userText, endInterview = false) {
      if (!this.sessionId) return
      
      this.isAIThinking = true
      
      try {
        const res = await interviewApi.answer(this.sessionId, userText, endInterview)
        
        console.log('AI响应', res)
        
        if (res.code === 200 || res.data) {
          const data = res.data || res
          
          // 检查是否结束
          if (data.is_ended || data.stage === 'ended') {
            this.finishInterview()
            return
          }
          
          // 更新问题数
          this.currentQuestion = data.question_number || this.currentQuestion + 1
          
          // 添加AI消息
          const question = data.question || data.data?.question
          this.addMessage('interviewer', question)
          
          // 播放音频
          const audioUrl = data.audio_url || data.data?.audio_url
          if (audioUrl) {
            this.currentAudioUrl = audioUrl
            this.playAudio(audioUrl)
          }
          
          // 更新阶段
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
    
    // 播放音频
    playAudio(url) {
      if (!this.innerAudioContext) return
      
      this.isSpeaking = true
      this.voiceWaveActive = true
      
      const fullUrl = getStaticUrl(url)
      console.log('播放音频，完整URL:', fullUrl)
      
      // 先移除之前的事件监听
      this.innerAudioContext.offError()
      this.innerAudioContext.offEnded()
      
      // 绑定错误处理
      this.innerAudioContext.onError((err) => {
        console.error('音频播放错误', err)
        this.isSpeaking = false
        this.voiceWaveActive = false
        
        uni.showToast({ 
          title: '语音加载失败，请阅读文字', 
          icon: 'none',
          duration: 3000
        })
      })
      
      // 绑定播放结束事件
      this.innerAudioContext.onEnded(() => {
        this.isSpeaking = false
        this.voiceWaveActive = false
      })
      
      this.innerAudioContext.src = fullUrl
      this.innerAudioContext.play()
    },
    
    // 重听问题
    replayQuestion() {
      if (this.currentAudioUrl) {
        this.playAudio(this.currentAudioUrl)
      }
    },
    
    // 添加消息到列表
    addMessage(sender, content) {
      this.interviewMessages.push({
        sender,
        content,
        timestamp: Date.now()
      })
      this.scrollToBottom()
    },
    
    updateInterviewStage() {
      const stages = ['自我介绍', '技术能力', '项目经验', '职业规划', '综合能力']
      const stageIndex = Math.floor((this.currentQuestion - 1) / (this.totalQuestions / stages.length))
      this.currentStage = stages[stageIndex] || '综合评估'
    },
    
    confirmEndInterview() {
      uni.showModal({
        title: '结束面试',
        content: '确定要结束面试吗？将生成面试报告。',
        success: (res) => {
          if (res.confirm) {
            this.endInterview()
          }
        }
      })
    },
    
    // 结束面试
    async endInterview() {
      if (!this.sessionId) {
        this.finishInterview()
        return
      }
      
      // 发送结束信号
      try {
        await this.sendAnswer('面试结束', true)
      } catch (error) {
        console.log('发送结束信号失败，直接获取报告', error)
      }
      
      this.finishInterview()
    },
    
    // 完成面试，获取报告
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
          // 如果获取失败，使用模拟数据
          this.generateMockReport()
        }
        
        this.showReport = true
        this.$nextTick(() => {
          this.drawRadarChart()
        })
      } catch (error) {
        console.error('获取报告失败', error)
        this.generateMockReport()
        this.showReport = true
      } finally {
        uni.hideLoading()
      }
    },
    
    // 解析报告数据
    parseReportData(data) {
      // 根据后端返回的数据结构解析
      this.overallScore = data.overall_score || data.score || 85
      
      this.evaluationItems = [
        { 
          title: '技术能力', 
          content: data.tech_evaluation || '基础扎实，能够清晰地解释技术概念。' 
        },
        { 
          title: '沟通能力', 
          content: data.comm_evaluation || '表达清晰，逻辑性强。' 
        },
        { 
          title: '项目经验', 
          content: data.project_evaluation || '项目经历丰富，能够详细描述项目细节。' 
        }
      ]
      
      this.suggestions = data.suggestions || [
        '建议在技术深度方面继续加强学习',
        '可以增加更多实际项目案例的积累'
      ]
    },
    
    // 生成模拟报告数据（备用）
    generateMockReport() {
      this.overallScore = Math.floor(Math.random() * 20) + 75
      
      this.evaluationItems = [
        { 
          title: '技术能力', 
          content: '基础扎实，能够清晰地解释技术概念，但在某些深度问题上略显不足。' 
        },
        { 
          title: '沟通能力', 
          content: '表达清晰，逻辑性强，能够很好地理解问题并给出合适的回答。' 
        },
        { 
          title: '项目经验', 
          content: '项目经历丰富，能够详细描述项目细节和个人贡献。' 
        }
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
    
    scrollToBottom() {
      this.$nextTick(() => {
        this.chatScrollTop = this.interviewMessages.length * 1000
      })
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    },
    
    closeReport() {
      this.showReport = false
    },
    
    restartInterview() {
      this.showReport = false
      this.resetInterview()
      this.interviewStarted = false
    },
    
    exportReport() {
      // 导出报告逻辑
      uni.showModal({
        title: '导出报告',
        content: '是否将面试报告保存到本地？',
        success: (res) => {
          if (res.confirm) {
            // 生成PDF或图片
            uni.showToast({ title: '报告已保存', icon: 'success' })
          }
        }
      })
    },
    
    drawRadarChart() {
      const ctx = uni.createCanvasContext('radarChart', this)
      this.drawRadarGrid(ctx)
      this.drawRadarData(ctx)
      ctx.draw()
    },
    
    drawRadarGrid(ctx) {
      const centerX = 150, centerY = 150, radius = 100, points = 6
      const angleStep = (Math.PI * 2) / points
      
      ctx.setStrokeStyle('#e0e0e0')
      ctx.setLineWidth(1)
      
      // 绘制网格
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath()
        for (let j = 0; j <= points; j++) {
          const angle = j * angleStep - Math.PI / 2
          const r = radius * i / 5
          const x = centerX + Math.cos(angle) * r
          const y = centerY + Math.sin(angle) * r
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
      }
      
      // 绘制轴线
      for (let i = 0; i < points; i++) {
        const angle = i * angleStep - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
        ctx.stroke()
      }
      
      // 绘制标签
      ctx.setFontSize(12)
      ctx.setFillStyle('#666')
      const labels = ['技术', '沟通', '经验', '态度', '潜力', '稳定']
      for (let i = 0; i < points; i++) {
        const angle = i * angleStep - Math.PI / 2
        const x = centerX + Math.cos(angle) * (radius + 20)
        const y = centerY + Math.sin(angle) * (radius + 20)
        ctx.fillText(labels[i], x - 12, y + 6)
      }
    },
    
    drawRadarData(ctx) {
      const centerX = 150, centerY = 150, radius = 100, points = 6
      const angleStep = (Math.PI * 2) / points
      
      // 根据分数生成数据
      const score = this.overallScore / 100
      const data = [
        0.8 * score, 
        0.85 * score, 
        0.75 * score, 
        0.9 * score, 
        0.8 * score, 
        0.85 * score
      ]
      
      ctx.setFillStyle('rgba(0, 122, 255, 0.3)')
      ctx.setStrokeStyle('#007aff')
      ctx.setLineWidth(2)
      
      ctx.beginPath()
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep - Math.PI / 2
        const value = data[i % points]
        const x = centerX + Math.cos(angle) * (radius * value)
        const y = centerY + Math.sin(angle) * (radius * value)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
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
      
      // 停止音频
      if (this.innerAudioContext) {
        this.innerAudioContext.stop()
      }
    },
    
    clearRecordingTimer() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer)
        this.recordingTimer = null
      }
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

/* 双滚轮职位选择器样式 */
.dual-picker-container {
  display: flex;
  gap: 20rpx;
  margin-top: 16rpx;
  
  .dual-picker {
    flex: 1;
    position: relative;
    cursor: pointer;
    
    .picker-text {
      padding: 16rpx 20rpx;
      background: #f8f9fa;
      border-radius: 8rpx;
      font-size: 28rpx;
      color: #333;
      border: 2rpx solid #e1e8ed;
      min-height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      
      &:active {
        background: #e9ecef;
      }
      
      &::after {
        content: '';
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 8rpx solid transparent;
        border-right: 8rpx solid transparent;
        border-top: 12rpx solid #666;
      }
    }
  }
  
  picker[disabled] .picker-text {
    background: #f1f3f4;
    color: #999;
    border-color: #e1e8ed;
    cursor: not-allowed;
    
    &::after {
      border-top-color: #999;
    }
  }
}

.report-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  
  .report-modal {
    width: 90%;
    max-width: 800rpx;
    max-height: 90vh;
    background-color: #fff;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    animation: modalSlideUp 0.3s ease-out;
    
    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 2rpx solid #e0e0e0;
      
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
    
    .report-content {
      flex: 1;
      padding: 30rpx;
      
      .score-section {
        text-align: center;
        margin-bottom: 40rpx;
        
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
        margin-bottom: 40rpx;
        
        .section-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 20rpx;
          display: block;
        }
        
        .radar-chart {
          height: 300rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .radar-canvas {
            width: 300rpx;
            height: 300rpx;
          }
        }
      }
      
      .evaluation-section {
        margin-bottom: 40rpx;
        
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
    }
    
    .report-footer {
      display: flex;
      padding: 30rpx;
      border-top: 2rpx solid #e0e0e0;
      gap: 20rpx;
      
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
</style>