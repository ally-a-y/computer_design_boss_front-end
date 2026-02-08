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
              <text v-else>{{ formData.resumePdf.name }}</text>
            </view>
          </view>
          
          <view v-if="currentMethod.includes('user')" class="form-group">
            <text class="form-label">用户ID</text>
            <input class="form-input" v-model="formData.userId" placeholder="请输入用户ID" />
          </view>
          
          <view v-if="currentMethod.includes('position')" class="form-group">
            <text class="form-label">职位ID</text>
            <input class="form-input" v-model="formData.positionId" placeholder="请输入职位ID" />
          </view>
          
          <view v-if="currentMethod.includes('positionText')" class="form-group">
            <text class="form-label">岗位描述</text>
            <textarea class="form-textarea" 
                      v-model="formData.positionText" 
                      placeholder="请输入岗位描述"></textarea>
          </view>
        </view>
        
        <button class="start-btn" @click="startInterview">开始面试</button>
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
          <scroll-view class="chat-messages" scroll-y :scroll-top="chatScrollTop">
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
        <button class="control-btn replay-btn" @click="replayQuestion">
          <image src="/static/ai/replay.png" mode="aspectFit"></image>
          <text>重听问题</text>
        </button>
        
        <view class="voice-record-area">
          <button class="voice-btn" 
                  :class="{ recording: isRecording }"
                  @touchstart="startRecording"
                  @touchend="stopRecording">
            <image :src="isRecording ? '/static/ai/recording.png' : '/static/ai/mic.png'" mode="aspectFit"></image>
            <text>{{ isRecording ? '录音中...' : '按住说话' }}</text>
          </button>
          <view v-if="isRecording" class="recording-indicator">
            <view class="pulse-ring"></view>
            <text>{{ recordingTime }}s</text>
          </view>
        </view>
        
        <button class="control-btn end-btn" @click="endInterview">
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
export default {
  data() {
    return {
      // 页面状态
      interviewStarted: false,
      currentMethod: 'resumeText+positionText',
      
      // 表单数据
      formData: {
        resumeText: '',
        resumePdf: null,
        userId: '',
        positionId: '',
        positionText: ''
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
      currentQuestion: 0,
      totalQuestions: 8,
      currentStage: '自我介绍',
      
      // 录音状态
      isRecording: false,
      isSpeaking: false,
      isAIThinking: false,
      voiceWaveActive: false,
      recordingTime: 0,
      recordingTimer: null,
      
      // 对话数据
      interviewMessages: [],
      chatScrollTop: 0,
      
      // 面试技巧
      tipsCollapsed: false,
      currentTips: [
        '保持自信，语速适中',
        '回答问题要有条理',
        '适当使用专业术语',
        '注意与面试官的眼神交流'
      ],
      
      // 面试报告数据
      showReport: false,
      overallScore: 85,
      evaluationItems: [],
      suggestions: []
    }
  },
  
  computed: {
    progressPercent() {
      return Math.min((this.currentQuestion / this.totalQuestions) * 100, 100)
    }
  },
  
  onLoad() {
    // 页面加载初始化
    this.initializeInterview()
  },
  
  onUnload() {
    // 页面卸载清理
    this.cleanupInterview()
  },
  
  methods: {
    getInterviewerStatus() {
      if (this.isAIThinking) return '思考中...'
      if (this.isSpeaking) return '说话中...'
      return '等待中'
    },
    
    initializeInterview() {
      // 初始化面试页面
    },
    
    cleanupInterview() {
      // 清理面试资源
      this.resetInterview()
      this.clearRecordingTimer()
    },
    
    goBack() {
      if (this.interviewStarted) {
        uni.showModal({
          title: '提示',
          content: '确定要结束面试吗？',
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
    },
    
    chooseResumeFile() {
      uni.chooseFile({
        count: 1,
        type: 'file',
        extension: ['pdf'],
        success: (res) => {
          this.formData.resumePdf = res.tempFiles[0]
        }
      })
    },
    
    startInterview() {
      // 验证表单
      if (!this.validateForm()) {
        return
      }
      
      this.interviewStarted = true
      this.currentQuestion = 1
      this.startFirstQuestion()
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
      
      if (method.includes('user') && !this.formData.userId.trim()) {
        uni.showToast({ title: '请输入用户ID', icon: 'none' })
        return false
      }
      
      if (method.includes('position') && !this.formData.positionId.trim()) {
        uni.showToast({ title: '请输入职位ID', icon: 'none' })
        return false
      }
      
      if (method.includes('positionText') && !this.formData.positionText.trim()) {
        uni.showToast({ title: '请输入岗位描述', icon: 'none' })
        return false
      }
      
      return true
    },
    
    startFirstQuestion() {
      // TODO: 调用后端API获取第一个问题
      setTimeout(() => {
        this.askQuestion('请先简单介绍一下您自己。')
      }, 1000)
    },
    
    askQuestion(question) {
      this.isSpeaking = true
      this.voiceWaveActive = true
      
      // 模拟语音播放
      setTimeout(() => {
        this.isSpeaking = false
        this.voiceWaveActive = false
        
        this.interviewMessages.push({
          sender: 'interviewer',
          content: question,
          timestamp: Date.now()
        })
        
        this.scrollToBottom()
      }, 2000)
    },
    
    startRecording() {
      this.isRecording = true
      this.recordingTime = 0
      
      // 开始录音计时
      this.recordingTimer = setInterval(() => {
        this.recordingTime++
      }, 1000)
    },
    
    stopRecording() {
      if (!this.isRecording) return
      
      this.isRecording = false
      this.clearRecordingTimer()
      
      // TODO: 调用后端API进行语音识别和处理
      
      // 模拟用户回答（后续对接语音识别API）
      this.interviewMessages.push({
        sender: 'candidate',
        content: '这是我的回答内容...（录音转文字结果）',
        timestamp: Date.now()
      })
      
      this.scrollToBottom()
      
      // 模拟AI思考
      this.isAIThinking = true
      
      setTimeout(() => {
        this.isAIThinking = false
        this.nextQuestion()
      }, 2000)
    },
    
    nextQuestion() {
      this.currentQuestion++
      
      if (this.currentQuestion > this.totalQuestions) {
        this.endInterview()
        return
      }
      
      // 更新面试阶段
      this.updateInterviewStage()
      
      // 模拟下一个问题（后续对接后端API）
      const questions = [
        '您为什么选择这个职位？',
        '请介绍一下您最满意的项目经历。',
        '您如何处理工作中的压力？',
        '您未来的职业规划是什么？',
        '您有什么问题想问我们吗？'
      ]
      
      const questionIndex = this.currentQuestion - 2
      if (questionIndex < questions.length) {
        // TODO: 调用后端API获取下一个问题
        this.askQuestion(questions[questionIndex])
      }
    },
    
    updateInterviewStage() {
      const stages = ['自我介绍', '技术能力', '项目经验', '职业规划', '综合能力']
      const stageIndex = Math.floor((this.currentQuestion - 1) / (this.totalQuestions / stages.length))
      this.currentStage = stages[stageIndex] || '综合评估'
    },
    
    replayQuestion() {
      if (this.interviewMessages.length === 0) return
      
      const lastQuestion = this.interviewMessages
        .filter(msg => msg.sender === 'interviewer')
        .pop()
      
      if (lastQuestion) {
        this.askQuestion(lastQuestion.content)
      }
    },
    
    endInterview() {
      // 生成面试报告数据
      this.generateReportData()
      this.showReport = true
      this.$nextTick(() => {
        this.drawRadarChart()
      })
    },
    
    generateReportData() {
      // 模拟生成报告数据，实际应该从后端获取
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
        this.chatScrollTop = 999999
      })
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString()
    },
    
    closeReport() {
      this.showReport = false
    },
    
    restartInterview() {
      this.showReport = false
      this.resetInterview()
      this.startInterview()
    },
    
    exportReport() {
      uni.showToast({
        title: '报告导出功能开发中...',
        icon: 'none'
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
    },
    
    drawRadarData(ctx) {
      const centerX = 150, centerY = 150, radius = 100, points = 6
      const angleStep = (Math.PI * 2) / points
      const data = [0.8, 0.7, 0.9, 0.6, 0.8, 0.75]
      
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
    },
    
    resetInterview() {
      this.interviewStarted = false
      this.currentQuestion = 0
      this.interviewMessages = []
      this.isRecording = false
      this.isSpeaking = false
      this.isAIThinking = false
      this.recordingTime = 0
      this.showReport = false
      this.clearRecordingTimer()
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
        userId: '',
        positionId: '',
        positionText: ''
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
          background: conic-gradient(#007aff 0deg, #007aff 306deg, #e0e0e0 306deg);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          
          .score-number {
            font-size: 48rpx;
            font-weight: bold;
            color: #007aff;
          }
          
          .score-total {
            font-size: 32rpx;
            color: #666;
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