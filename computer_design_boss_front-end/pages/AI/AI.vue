<template>
  <view class="ai-chat-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="logo-section">
        <image class="logo" src="/static/ai/logo.png" mode="aspectFit"></image>
        <text class="app-title">AI求职助手</text>
      </view>
      <button class="interview-btn" @click="goToInterview">模拟面试</button>
    </view>

    <!-- 对话区域 -->
    <scroll-view class="chat-area" scroll-y :scroll-top="scrollTop" @scrolltoupper="loadMoreHistory">
      <view class="message-list">
        <view v-for="(message, index) in messages" :key="index" 
              :class="['message-item', message.sender === 'user' ? 'user-message' : 'ai-message']">
          <view class="message-bubble">
            <view v-if="!needMarkdownRender(message.content)" class="message-text">
                <text>{{ message.content }}</text>
              </view>
              
              <rich-text 
                v-else 
                class="markdown-content"
                :nodes="parseMarkdown(message.content)"
              ></rich-text>
            
            <!-- 文件消息 -->
            <view v-if="message.file" class="file-card">
              <image class="file-icon" src="/static/ai/file-icon.png" mode="aspectFit"></image>
              <view class="file-info">
                <text class="file-name">{{ message.file.name }}</text>
                <text class="file-size">{{ formatFileSize(message.file.size) }}</text>
              </view>
            </view>
            
            <!-- AI分析结果卡片 -->
            <view v-if="message.analysisResult" class="analysis-card" 
                  :class="{ expanded: message.expanded }">
              <view class="card-header" @click="toggleCard(index)">
                <text class="card-title">{{ message.analysisResult.title }}</text>
                <image class="expand-icon" 
                       :src="message.expanded ? '/static/ai/collapse.png' : '/static/ai/expand.png'"
                       mode="aspectFit"></image>
              </view>
              <view v-if="message.expanded" class="card-content">
                <rich-text :nodes="message.analysisResult.content"></rich-text>
              </view>
            </view>
            
            <!-- 进度条 -->
            <view v-if="message.uploadProgress !== undefined" class="progress-bar">
              <view class="progress-fill" :style="{ width: message.uploadProgress + '%' }"></view>
              <text class="progress-text">{{ message.uploadProgress }}%</text>
            </view>
          </view>
          <text class="message-time">{{ formatTime(message.timestamp) }}</text>
        </view>
        
        <!-- 加载骨架屏 -->
        <view v-if="isLoading" class="skeleton-message">
          <view class="skeleton-bubble"></view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-area">
      <view class="function-buttons">
        <button class="func-btn" @click="openPanel('resumeAnalysis')">简历分析</button>
        <button class="func-btn" @click="openPanel('resumeEvaluation')">简历评估</button>
        <button class="func-btn" @click="openPanel('successRate')">成功率分析</button>
        <button class="func-btn" @click="openPanel('studentPlan')">大学生规划</button>
      </view>
      
      <view class="input-container">
        <textarea class="text-input" 
                  v-model="inputText" 
                  placeholder="请输入您的问题..."
                  :auto-height="true"
                  @confirm="sendMessage"></textarea>
        <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim()">发送</button>
      </view>
    </view>

    <!-- 功能面板 -->
    <view v-if="currentPanel" class="panel-overlay" @click="closePanel">
      <view class="function-panel" @click.stop>
        <view class="panel-header">
          <text class="panel-title">{{ panelTitle }}</text>
          <image class="close-btn" src="/static/ai/close.png" @click="closePanel" mode="aspectFit"></image>
        </view>
        
        <view class="panel-content">
          <!-- 简历分析面板 -->
          <view v-if="currentPanel === 'resumeAnalysis'">
            <view class="method-selector">
              <radio-group @change="onMethodChange">
                <label v-for="method in analysisMethods" :key="method.value" class="radio-item">
                  <radio :value="method.value" :checked="currentMethod === method.value" />
                  <text>{{ method.label }}</text>
                </label>
              </radio-group>
            </view>
            
            <view class="input-fields">
              <view v-show="currentMethod.includes('user')" class="input-group user-id-group">
                <text class="input-label">用户ID</text>
                <view class="user-id-display" :class="{ 'loading': isLoadingUser, 'error': !currentUserId && !isLoadingUser }">
                  <text v-if="isLoadingUser" class="loading-text">获取用户信息中...</text>
                  <text v-else-if="currentUserId" class="user-id-text">
                    {{ currentUserId }}
                  </text>
                  <text v-else class="error-text">
                    未获取到用户信息，请
                    <text class="retry-link" @click.stop="fetchUserInfo">点击重试</text>
                    或重新登录
                  </text>
                </view>
              </view>
              
              <view v-show="currentMethod.includes('position')" class="input-group">
                <text class="input-label">职位选择</text>
                <view class="dual-picker-container">
                  <picker @change="onMainCategoryChange" :range="mainCategories" range-key="name" class="picker-field dual-picker">
                    <view class="picker-text">{{ getMainCategoryName() }}</view>
                  </picker>
                  <picker @change="onDetailPositionChange" :range="getCurrentDetailPositions()" range-key="name" class="picker-field dual-picker" :disabled="!hasSelectedMainCategory()">
                    <view class="picker-text">{{ getSelectedPositionName() }}</view>
                  </picker>
                </view>
              </view>
              
              <view v-show="currentMethod.includes('text')" class="input-group">
                <text class="input-label">职位描述</text>
                <textarea class="input-field" v-model="formData.positionText" placeholder="请输入职位描述"></textarea>
              </view>
              
              <view v-show="currentMethod.includes('pdf')" class="input-group">
                <text class="input-label">PDF文件</text>
                <view class="file-upload" @click="chooseFile">
                  <text>{{ formData.pdfFile ? formData.pdfFile.name : '点击选择PDF文件' }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 其他面板类似结构 -->
          <view v-if="currentPanel === 'resumeEvaluation'">
            <view class="method-selector">
              <radio-group :value="currentMethod" @change="onMethodChange">
                <label class="radio-item">
                  <radio value="user" />
                  <text>用户ID</text>
                </label>
                <label class="radio-item">
                  <radio value="pdf" />
                  <text>PDF上传</text>
                </label>
              </radio-group>
            </view>
            
            <view class="input-fields">
              <view v-show="currentMethod === 'user'" class="input-group" key="user-group">
                <text class="input-label">用户ID</text>
                <view class="user-id-display" :class="{ 'loading': isLoadingUser, 'error': !currentUserId && !isLoadingUser }">
                  <text v-if="isLoadingUser" class="loading-text">获取用户信息中...</text>
                  <text v-else-if="currentUserId" class="user-id-text">
                    {{ currentUserId }}
                  </text>
                  <text v-else class="error-text">
                    未获取到用户信息，请
                    <text class="retry-link" @click.stop="fetchUserInfo">点击重试</text>
                    或重新登录
                  </text>
                </view>
              </view>
              <view v-show="currentMethod === 'pdf'" class="input-group" key="pdf-group">
                <text class="input-label">PDF文件</text>
                <view class="file-upload" @click="chooseFile">
                  <text>{{ formData.pdfFile ? formData.pdfFile.name : '点击选择PDF文件' }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <view v-if="currentPanel === 'successRate'">
            <view class="method-selector">
              <radio-group :value="currentMethod" @change="onMethodChange">
                <label class="radio-item">
                  <radio value="pdf+position" />
                  <text>PDF+职位ID</text>
                </label>
                <label class="radio-item">
                  <radio value="user+text" />
                  <text>用户ID+职位描述</text>
                </label>
              </radio-group>
            </view>
            
            <view class="input-fields">
              <view v-show="currentMethod.includes('user')" class="input-group" key="user-group">
                <text class="input-label">用户ID</text>
                <view class="user-id-display" :class="{ 'loading': isLoadingUser, 'error': !currentUserId && !isLoadingUser }">
                  <text v-if="isLoadingUser" class="loading-text">获取用户信息中...</text>
                  <text v-else-if="currentUserId" class="user-id-text">
                    {{ currentUserId }}
                  </text>
                  <text v-else class="error-text">
                    未获取到用户信息，请
                    <text class="retry-link" @click.stop="fetchUserInfo">点击重试</text>
                    或重新登录
                  </text>
                </view>
              </view>
              
              <view v-show="currentMethod.includes('position')" class="input-group" key="position-group">
                <text class="input-label">职位选择</text>
                <view class="dual-picker-container">
                  <picker @change="onMainCategoryChange" :range="mainCategories" range-key="name" class="picker-field dual-picker">
                    <view class="picker-text">{{ getMainCategoryName() }}</view>
                  </picker>
                  <picker @change="onDetailPositionChange" :range="getCurrentDetailPositions()" range-key="name" class="picker-field dual-picker" :disabled="!hasSelectedMainCategory()">
                    <view class="picker-text">{{ getSelectedPositionName() }}</view>
                  </picker>
                </view>
              </view>
              
              <view v-show="currentMethod.includes('text')" class="input-group" key="text-group">
                <text class="input-label">职位描述</text>
                <textarea class="input-field" v-model="formData.positionText" placeholder="请输入职位描述"></textarea>
              </view>
              
              <view v-show="currentMethod.includes('pdf')" class="input-group" key="pdf-group">
                <text class="input-label">PDF文件</text>
                <view class="file-upload" @click="chooseFile">
                  <text>{{ formData.pdfFile ? formData.pdfFile.name : '点击选择PDF文件' }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <view v-if="currentPanel === 'studentPlan'">
            <view class="method-selector">
              <radio-group :value="currentMethod" @change="onMethodChange">
                <label class="radio-item">
                  <radio value="pdf+position" />
                  <text>PDF+职位ID</text>
                </label>
                <label class="radio-item">
                  <radio value="user+text" />
                  <text>用户ID+职位描述</text>
                </label>
              </radio-group>
            </view>
            
            <view class="input-fields">
              <view v-show="currentMethod.includes('user')" class="input-group" key="user-group">
                <text class="input-label">用户ID</text>
                <view class="user-id-display" :class="{ 'loading': isLoadingUser, 'error': !currentUserId && !isLoadingUser }">
                  <text v-if="isLoadingUser" class="loading-text">获取用户信息中...</text>
                  <text v-else-if="currentUserId" class="user-id-text">
                    {{ currentUserId }}
                  </text>
                  <text v-else class="error-text">
                    未获取到用户信息，请
                    <text class="retry-link" @click.stop="fetchUserInfo">点击重试</text>
                    或重新登录
                  </text>
                </view>
              </view>
              
              <view v-show="currentMethod.includes('position')" class="input-group" key="position-group">
                <text class="input-label">职位选择</text>
                <view class="dual-picker-container">
                  <picker @change="onMainCategoryChange" :range="mainCategories" range-key="name" class="picker-field dual-picker">
                    <view class="picker-text">{{ getMainCategoryName() }}</view>
                  </picker>
                  <picker @change="onDetailPositionChange" :range="getCurrentDetailPositions()" range-key="name" class="picker-field dual-picker" :disabled="!hasSelectedMainCategory()">
                    <view class="picker-text">{{ getSelectedPositionName() }}</view>
                  </picker>
                </view>
              </view>
              
              <view v-show="currentMethod.includes('text')" class="input-group" key="text-group">
                <text class="input-label">职位描述</text>
                <textarea class="input-field" v-model="formData.positionText" placeholder="请输入职位描述"></textarea>
              </view>
              
              <view v-show="currentMethod.includes('pdf')" class="input-group" key="pdf-group">
                <text class="input-label">PDF文件</text>
                <view class="file-upload" @click="chooseFile">
                  <text>{{ formData.pdfFile ? formData.pdfFile.name : '点击选择PDF文件' }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        
        <view class="panel-footer">
          <button class="submit-btn" @click="submitFunction">提交</button>
          <button class="cancel-btn" @click="closePanel">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import { aiApi } from '@/common/api/ai.js'
const BASE_URL = 'http://localhost:5000'

export default {
  data() {
    return {
      messages: [
        {
          sender: 'ai',
          content: '您好！我是AI求职助手，可以帮助您分析简历、评估求职成功率，还可以进行模拟面试。请问有什么可以帮助您的？',
          timestamp: Date.now(),
          expanded: false
        }
      ],
      inputText: '',
      scrollTop: 0,
      isLoading: false,
      currentPanel: null,
      currentMethod: 'user+position',
	  isLoadingUser: false,
      userInfo: null, 
	  currentUserId: null,
      formData: {
        positionId: '',
        positionText: '',
        pdfFile: null,
        positionName: '' // 新增：存储选择的职位名称
      },
      gradeIndex: 0,
      gradeOptions: ['大一', '大二', '大三', '大四', '研一', '研二', '研三'],
      
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
      
      analysisMethods: [
        { value: 'user+position', label: '我的简历+职位' },
        { value: 'user+text', label: '我的简历+职位文本' },
        { value: 'pdf+position', label: 'PDF+职位' },
        { value: 'pdf+text', label: 'PDF+职位文本' }
      ]
    }
  },
  
  computed: {
    panelTitle() {
      const titles = {
        resumeAnalysis: '简历分析',
        resumeEvaluation: '简历评估',
        successRate: '成功率分析',
        studentPlan: '大学生规划'
      }
      return titles[this.currentPanel] || ''
    }
  },
  
  onLoad() {
    this.initializeChat()
	this.fetchUserInfo()
	
	// 延迟初始化，确保数据完全加载
	setTimeout(() => {
		this.initializePositionSelection()
	}, 100)
  },
  
  onUnload() {
    this.cleanup()
  },
  
  methods: {
      initializeChat() {
      },
      
      // 初始化职位选择
      initializePositionSelection() {
        // 确保数据存在
        if (!this.mainCategories || !this.positionDetails) {
          return
        }
        
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
      
      // 获取用户信息
      async fetchUserInfo() {
        this.isLoadingUser = true
        
        try {
          //从本地存储获取token，然后请求用户信息
          const token = uni.getStorageSync('token')
          
          if (!token) {
            console.log('未找到登录token，需要用户登录')
            // 跳转到登录页面
            // uni.navigateTo({ url: '/pages/login/login' })
            this.currentUserId = null
            return
          }
          
          // 从本地存储获取缓存的用户信息
          const cachedUserInfo = uni.getStorageSync('userInfo')
          if (cachedUserInfo && cachedUserInfo.user_id) {
            this.userInfo = cachedUserInfo
            this.currentUserId = String(cachedUserInfo.user_id)
            console.log('从缓存获取用户ID:', this.currentUserId)
            return
          }
          
          // 如果本地没有，请求后端API获取用户信息
          const res = await this.getUserProfile()
          
          if (res.code === 200 && res.data) {
            this.userInfo = res.data
            this.currentUserId = String(res.data.user_id || res.data.userId || res.data.id)
            // 缓存到本地
            uni.setStorageSync('userInfo', res.data)
            console.log('从后端获取用户ID:', this.currentUserId)
          }
        } catch (error) {
          console.error('获取用户信息失败:', error)
          uni.showToast({
            title: '获取用户信息失败',
            icon: 'none',
            duration: 2000
          })
          this.currentUserId = null
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
    
    cleanup() {
      // 清理资源
    },
    
    goToInterview() {
      uni.navigateTo({
        url: '/pages/AI/interview'
      })
    },
    
    // 发送普通消息（AI对话）
    async sendMessage() {
      if (!this.inputText.trim() || this.isLoading) return
      
      const userMessage = this.inputText.trim()
      
      // 添加用户消息
      this.messages.push({
        sender: 'user',
        content: userMessage,
        timestamp: Date.now()
      })
      
      this.scrollToBottom()
      this.isLoading = true
      this.inputText = ''
      
      try {
        const res = await aiApi.chat(userMessage)
       
        let aiContent = ''
        
        if (typeof res === 'string') {
          aiContent = this.preprocessContent(res)
        } 
        else if (res && res.response) {
          if (Array.isArray(res.response)) {
            aiContent = res.response
              .filter(item => item.role === 'assistant')
              .map(item => item.content)
              .join('\n')
          } else if (typeof res.response === 'string') {
            aiContent = this.preprocessContent(res.response)
          } else {
            aiContent = JSON.stringify(res.response)
          }
        }
        else {
          aiContent = res?.data || res?.message || JSON.stringify(res) || 'AI未返回有效内容'
        }
        
        this.messages.push({
          sender: 'ai',
          content: aiContent || 'AI未返回有效内容',
          timestamp: Date.now(),
          expanded: false
        })
          
      } catch (error) {
        console.error('AI对话失败:', error)
        
        this.messages.push({
          sender: 'ai',
          content: '抱歉，服务暂时不可用，请稍后重试。',
          timestamp: Date.now(),
          expanded: false
        })
      } finally {
        this.isLoading = false
        this.scrollToBottom()
      }
    },
    
    openPanel(panelType) {
      this.currentPanel = panelType
      this.currentMethod = this.getDefaultMethod(panelType)
	  // 打开面板时确保用户信息已加载
      if (!this.currentUserId && !this.isLoadingUser) {
        this.fetchUserInfo()
      }
      // 确保职位选择器初始化
      this.ensurePositionSelection()
      
      // 强制初始化职位选择
      if (this.currentMethod.includes('position') && !this.formData.positionName) {
        setTimeout(() => {
          this.initializePositionSelection()
        }, 200)
      }
    },
    
    // 确保职位选择器有正确的状态
    ensurePositionSelection() {
      if (this.currentMethod.includes('position')) {
        if (!this.formData.positionName && this.mainCategories && this.mainCategories.length > 0) {
          // 如果没有选择职位，使用默认的第一个
          const firstCategory = this.mainCategories[0]
          const firstPositions = this.positionDetails[firstCategory.id]
          if (firstPositions && firstPositions.length > 0) {
            this.formData.positionId = firstPositions[0].id
            this.formData.positionName = firstPositions[0].name
          }
        }
      }
    },
    
    closePanel() {
      this.currentPanel = null
      this.resetForm()
    },
    
    getDefaultMethod(panelType) {
      const defaults = {
        resumeAnalysis: 'user+position',
        resumeEvaluation: 'user',
        successRate: 'pdf+position',
        studentPlan: 'pdf+position'
      }
      return defaults[panelType] || 'user+position'
    },
    
    onMethodChange(e) {
      this.currentMethod = e.detail.value
    },
    
    onGradeChange(e) {
      this.gradeIndex = parseInt(e.detail.value)
    },

  // 预处理内容：处理 JSON 转义字符和清理残留
  preprocessContent(text) {
    if (!text) return ''
    
    let processed = text
    
    // 处理 JSON 转义字符
    processed = processed
      .replace(/\\n/g, '\n')      // 将 \n 转为实际换行符
      .replace(/\\"/g, '"')       // 将 \" 转为 "
      .replace(/\\'/g, "'")       // 将 \' 转为 '
      .replace(/\\t/g, '\t')      // 将 \t 转为制表符
      .replace(/\\r/g, '')        // 移除 \r
      .replace(/\\\\/g, '\\')     // 将 \\ 转为 \
    
    processed = processed
      .replace(/\s*,\s*"role"\s*:\s*"assistant"\s*\]?\}?$/g, '') 
      .replace(/\s*,\s*"role"\s*:\s*"user"\s*\]?\}?$/g, '')       
      .replace(/\]?\}?\s*$/, '')  
    
    return processed
  },

  // 解析 Markdown 文本为 HTML
  parseMarkdown(text) {
    if (!text) return ''
    
    // 先预处理
    let html = this.preprocessContent(text)
    
    // 清理特殊标记并转换格式
    html = html
      .replace(/^\s*#\s*$/gm, '')
      .replace(/^\s*---\s*$/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:600;color:#222;">$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em style="font-style:italic;color:#555;">$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2rpx 8rpx;border-radius:4rpx;color:#e83e8c;font-size:28rpx;">$1</code>')
      .replace(/###\s+([^\n]+)/g, '<strong style="font-size:32rpx;font-weight:600;display:block;margin:16rpx 0 8rpx;color:#333;">$1</strong>')
      .replace(/##\s+([^\n]+)/g, '<strong style="font-size:34rpx;font-weight:600;display:block;margin:20rpx 0 12rpx;color:#222;border-bottom:2rpx solid #eee;padding-bottom:6rpx;">$1</strong>')
      .replace(/#\s+([^\n]+)/g, '<strong style="font-size:36rpx;font-weight:600;display:block;margin:24rpx 0 16rpx;color:#111;">$1</strong>')
    
    // 先标记列表项
    html = html.replace(/^\s*[-•]\s+([^\n]+)/gm, ':::li:::$1:::/li:::')
    
    // 将连续的列表项组合成 ul
    html = html.replace(/(:::li:::.*?:::\/li:::\s*)+/g, function(match) {
      const items = match.match(/:::li:::(.*?):::\/li:::/g)
      if (items) {
        const listItems = items.map(item => {
          const content = item.replace(/:::li:::/, '').replace(/:::\/li:::/, '')
          return '<li style="margin:2rpx 0;line-height:1.4;">' + content + '</li>'
        }).join('')
        return '<ul style="padding-left:28rpx;margin:6rpx 0 10rpx;list-style-type:disc;">' + listItems + '</ul>'
      }
      return match
    })
    
    // 处理换行：段落之间保留适当间距
    html = html
      .replace(/\n\s*\n/g, '<br>')      
      .replace(/\n/g, '<br>')           
    
    // 清理多余的 <br> 和空标签
    html = html
      .replace(/(<br>\s*){3,}/g, '<br><br>')     
      .replace(/^<br\s*\/?>|<br\s*\/?>$/g, '')   
      .replace(/<br><\/li>/g, '</li>')           
      .replace(/<\/li><br>/g, '</li>')          
      .replace(/<ul><br>/g, '<ul>')              
      .replace(/<\/ul><br>/g, '</ul>')          
      .replace(/<strong><br>/g, '<strong>')      
      .replace(/<br><\/strong>/g, '</strong>')   
    
    return html
  },

  // 判断是否需要 Markdown 渲染
  needMarkdownRender(text) {
    if (!text) return false
    const patterns = [
      /\*\*[^*]+\*\*/, /\*[^*]+\*/, /`[^`]+`/,
      /^#{1,6}\s+/m, /^[-•]\s+/m, /^\d+\.\s+/m,
      /\\n/, /"role"/, /\\"/
    ]
    return patterns.some(p => p.test(text))
  },
    
    chooseFile() {
      // #ifdef MP-WEIXIN
      uni.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['pdf'],
        success: (res) => {
          const file = res.tempFiles[0]
          
          // 读取文件为 base64
          uni.getFileSystemManager().readFile({
            filePath: file.path,
            encoding: 'base64',
            success: (readRes) => {
              this.formData.pdfFile = {
                name: file.name,
                size: file.size,
                base64: readRes.data
              }
              uni.showToast({
                title: '文件选择成功',
                icon: 'success',
                duration: 1500
              })
            },
            fail: (err) => {
              console.error('读取文件失败:', err)
              uni.showToast({
                title: '文件读取失败',
                icon: 'none'
              })
            }
          })
        },
        fail: (err) => {
          console.error('选择文件失败:', err)
          if (err.errMsg && !err.errMsg.includes('cancel')) {
            uni.showToast({
              title: '文件选择失败',
              icon: 'none'
            })
          }
        }
      })
      // #endif

      // #ifdef H5
      // H5：创建input元素选择文件
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.pdf,application/pdf'
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        // 检查文件类型
        if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
          uni.showToast({
            title: '请选择PDF文件',
            icon: 'none'
          })
          return
        }

        // 读取为base64
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target.result.split(',')[1] 
          this.formData.pdfFile = {
            name: file.name,
            size: file.size,
            base64: base64
          }
          uni.showToast({
            title: '文件选择成功',
            icon: 'success',
            duration: 1500
          })
        }
        reader.onerror = () => {
          uni.showToast({
            title: '文件读取失败',
            icon: 'none'
          })
        }
        reader.readAsDataURL(file)
      }
      input.click()
      // #endif

      // #ifdef APP-PLUS
      // App端
      uni.chooseFile({
        count: 1,
        type: 'all',
        extension: ['pdf'],
        success: (res) => {
          const filePath = res.tempFilePaths[0]
          // 获取文件信息
          uni.getFileInfo({
            filePath: filePath,
            success: (info) => {
              // 读取为base64
              uni.getFileSystemManager().readFile({
                filePath: filePath,
                encoding: 'base64',
                success: (readRes) => {
                  this.formData.pdfFile = {
                    name: res.tempFiles[0]?.name || filePath.substring(filePath.lastIndexOf('/') + 1),
                    size: info.size,
                    base64: readRes.data
                  }
                  uni.showToast({
                    title: '文件选择成功',
                    icon: 'success',
                    duration: 1500
                  })
                },
                fail: (err) => {
                  console.error('读取文件失败:', err)
                  uni.showToast({
                    title: '文件读取失败',
                    icon: 'none'
                  })
                }
              })
            },
            fail: (err) => {
              console.error('获取文件信息失败:', err)
            }
          })
        },
        fail: (err) => {
          console.error('选择文件失败:', err)
          if (err.errMsg && !err.errMsg.includes('cancel')) {
            uni.showToast({
              title: '文件选择失败',
              icon: 'none'
            })
          }
        }
      })
      // #endif
    },
    
    async submitFunction() {
	  // 检查用户是否已登录（仅当需要user时）
      if (this.currentMethod.includes('user') && !this.currentUserId) {
        uni.showToast({ 
          title: '请先登录', 
          icon: 'none',
          duration: 2000
        })
        // 尝试重新获取用户信息
        this.fetchUserInfo()
        return
      }
      if (!this.validateForm()) {
        return
      }
      const panelType = this.currentPanel
      if (!panelType) {
        uni.showToast({ title: '操作异常，请重试', icon: 'none' })
        return
      }
    
      const savedFormData = {
        positionId: this.formData.positionId,
        positionText: this.formData.positionText,
        pdfFile: this.formData.pdfFile ? { ...this.formData.pdfFile } : null,
		positionName: this.formData.positionName, // 添加职位名称
		userId: this.currentUserId
      }
      const savedMethod = this.currentMethod
      
      // 添加用户消息
      const userMessage = this.getUserMessageText()
      this.messages.push({
        sender: 'user',
        content: userMessage,
        timestamp: Date.now(),
        file: this.formData.pdfFile ? {
          name: this.formData.pdfFile.name,
          size: this.formData.pdfFile.size
        } : null
      })
      
      // 关闭面板
      this.closePanel()
      this.scrollToBottom()
      this.isLoading = true
      
      try {
        let result = null
        switch (panelType) {  
          case 'resumeAnalysis':
            result = await this.submitResumeAnalysis(savedFormData, savedMethod)
            break
          case 'resumeEvaluation':
            result = await this.submitResumeEvaluation(savedFormData, savedMethod)
            break
          case 'successRate':
            result = await this.submitSuccessRate(savedFormData, savedMethod)
            break
          case 'studentPlan':
            result = await this.submitStudentPlan(savedFormData, savedMethod)
            break
          default:
            throw new Error('未知操作类型: ' + panelType)
        }
        
        // 处理成功结果，添加到消息列表
        if (result) {
          this.messages.push({
            sender: 'ai',
            content: typeof result === 'string' ? result : JSON.stringify(result),
            timestamp: Date.now(),
            expanded: false
          })
        }
        
      } catch (error) {
        console.error('提交失败:', error)
        this.messages.push({
          sender: 'ai',
          content: '抱歉，分析失败：' + (error.message || '未知错误'),
          timestamp: Date.now(),
          expanded: false
        })
      } finally {
        this.isLoading = false
        this.scrollToBottom()
      }
    },
    
    // 简历分析
    async submitResumeAnalysis(formData, method) {
      try {
        let res;
        
        if (method === 'user+position') {
          // 直接使用存储的职位名称
          const jobName = (formData.positionName || '').trim()
          if (!jobName) {
            throw new Error('请选择有效的职位')
          }
		  // 使用当前用户ID（已从formData自动填充）
          if (!formData.userId) {
            throw new Error('用户未登录')
          }
          res = await aiApi.askByUserJobName(jobName)
                return res?.analysis || res?.data?.analysis || res?.data || res
          
        } else if (method === 'user+text') {
          if (!formData.positionText.trim()) {
            throw new Error('职位描述不能为空')
          }
		  if (!formData.userId) {
            throw new Error('用户未登录')
          }
          res = await aiApi.askByUserJobText(formData.positionText)
                return res?.analysis || res?.data?.analysis || res?.data || res
          
        } else if (method === 'pdf+position') {
          if (!formData.pdfFile?.base64) {
            throw new Error('PDF 文件没有 base64 数据')
          }
          // 直接使用存储的职位名称
          const jobName = (formData.positionName || '').trim()
          if (!jobName) {
            throw new Error('请选择有效的职位')
          }
          res = await aiApi.askByPdfJobName(
            { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
            jobName
          )
          
        } else if (method === 'pdf+text') {
          if (!formData.pdfFile?.base64) {
            throw new Error('PDF 文件没有 base64 数据')
          }
          if (!formData.positionText.trim()) {
            throw new Error('职位描述不能为空')
          }
          res = await aiApi.askByPdfJobText(
            { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
            formData.positionText
          )
          
        } else {
          throw new Error(`不支持的简历分析方法: ${method}`)
        }
        
        // 统一处理返回结果
        return res?.analysis || res?.data?.analysis || res?.data || res
        
      } catch (err) {
        console.error('简历分析失败:', err)
        throw err  
      }
    },
    
    // 简历评估
    async submitResumeEvaluation(formData, method) {
      if (method === 'user') {
        const res = await aiApi.resumeEvaluation()
        return res?.data?.evaluation || res?.evaluation || res?.data || res
      } else if (method === 'pdf') {
        if (!formData.pdfFile?.base64) {
          throw new Error('PDF 文件没有 base64 数据')
        }
        const res = await aiApi.resumeEvaluationByPdf({
          name: formData.pdfFile.name,
          base64: formData.pdfFile.base64
        })
        return res?.data?.evaluation || res?.evaluation || res?.data || res
      } else {
        throw new Error(`不支持的简历评估方法: ${method}`)
      }
    },
    
    // 成功率分析
    async submitSuccessRate(formData, method) {
      if (method === 'pdf+position') {
        if (!formData.pdfFile?.base64) {
          throw new Error('PDF 文件没有 base64 数据')
        }
        // 使用职位名称而不是ID
        const jobName = (formData.positionName || '').trim()
        if (!jobName) {
          throw new Error('请选择有效的职位')
        }
        console.log('调用成功率分析，职位名称:', jobName)
        const res = await aiApi.successRateByPdfJobName(
          { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
          jobName
        )
        return res?.data?.analysis || res?.analysis || res?.data || res
        
      } else if (method === 'pdf+text') {
        if (!formData.pdfFile?.base64) {
          throw new Error('PDF 文件没有 base64 数据')
        }
        const res = await aiApi.successRateByPdfJobText(
          { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
          formData.positionText
        )
        return res?.data?.analysis || res?.analysis || res?.data || res
        
      } else if (method === 'user+position') {
        // 使用职位名称而不是ID
        const jobName = (formData.positionName || '').trim()
        if (!jobName) {
          throw new Error('请选择有效的职位')
        }
        const res = await aiApi.successRateByUserJobName(jobName)
        return res?.data?.analysis || res?.analysis || res?.data || res
        
      } else if (method === 'user+text') {
        const res = await aiApi.successRateByUserJobText(formData.positionText)
        return res?.data?.analysis || res?.analysis || res?.data || res
        
      } else {
        throw new Error(`不支持的成功率分析方法: ${method}`)
      }
    },
    
    // 大学生规划
    async submitStudentPlan(formData, method) {
      const userGrade = this.gradeOptions[this.gradeIndex]
      
      if (method === 'pdf+position') {
        if (!formData.pdfFile?.base64) {
          throw new Error('PDF 文件没有 base64 数据')
        }
        // 使用职位名称而不是ID
        const jobName = (formData.positionName || '').trim()
        if (!jobName) {
          throw new Error('请选择有效的职位')
        }
        const res = await aiApi.universityPlanByPdfJobName(
          { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
          jobName,
          userGrade
        )
        return res?.data?.plan || res?.plan || res?.data || res
        
      } else if (method === 'pdf+text') {
        if (!formData.pdfFile?.base64) {
          throw new Error('PDF 文件没有 base64 数据')
        }
        const res = await aiApi.universityPlanByPdfJobText(
          { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
          formData.positionText,
          userGrade
        )
        return res?.data?.plan || res?.plan || res?.data || res
        
      } else if (method === 'user+position') {
        // 使用职位名称而不是ID
        const jobName = (formData.positionName || '').trim()
        if (!jobName) {
          throw new Error('请选择有效的职位')
        }
        const res = await aiApi.universityPlanByUserJobName(
          jobName,
          userGrade
        )
        return res?.data?.plan || res?.plan || res?.data || res
        
      } else if (method === 'user+text') {
        const res = await aiApi.universityPlanByUserJobText(
          formData.positionText,
          userGrade
        )
        return res?.data?.plan || res?.plan || res?.data || res
        
      } else {
        throw new Error(`不支持的大学生规划方法: ${method}`)
      }
    },
	
    getUserMessageText() {
      const texts = {
        resumeAnalysis: '请分析这份简历与岗位的匹配度',
        resumeEvaluation: '请评估我的简历',
        successRate: '请分析我的求职成功率',
        studentPlan: '请为我制定大学生活规划'
      }
      let text = texts[this.currentPanel] || '提交分析'
      
      // 添加职位信息
      if (this.currentMethod.includes('position') && this.formData.positionId) {
        const mainCategory = this.getCurrentMainCategory()
        const positions = this.getCurrentDetailPositions()
        const detailPosition = positions.find(p => p.id === this.formData.positionId)
        if (mainCategory && detailPosition) {
          text += ` [${mainCategory.name} - ${detailPosition.name}]`
        }
      } else if (this.currentMethod.includes('text') && this.formData.positionText) {
        text += ` [${this.formData.positionText}]`
      }
      
      if (this.formData.pdfFile) {
        text += `：[${this.formData.pdfFile.name}]`
      }
      return text
    },
    
    validateForm() {
      const method = this.currentMethod
     
      // 对于需要userId的方式，检查是否已自动获取
      if (method.includes('user')) {
        if (!this.currentUserId) {
          uni.showToast({ 
            title: '未获取到用户信息，请重新登录', 
            icon: 'none',
            duration: 3000
          })
          // 触发重新获取用户信息
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
      
      if (method.includes('text') && !this.formData.positionText.trim()) {
        uni.showToast({ title: '请输入职位描述', icon: 'none' })
        return false
      }
      
      if (method.includes('pdf') && !this.formData.pdfFile) {
        uni.showToast({ title: '请上传PDF文件', icon: 'none' })
        return false
      }
      
      return true
    },
    
    toggleCard(index) {
      this.$set(this.messages[index], 'expanded', !this.messages[index].expanded)
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 999999
      })
    },
    
    loadMoreHistory() {
      // TODO: 实现历史消息加载功能
    },
    
    formatFileSize(size) {
      if (!size) return '0B'
      if (size < 1024) return size + 'B'
      if (size < 1024 * 1024) return (size / 1024).toFixed(1) + 'KB'
      return (size / (1024 * 1024)).toFixed(1) + 'MB'
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString()
    },
    
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
    
    resetForm() {
      this.formData = {
        positionId: '',
        positionText: '',
        pdfFile: null,
        positionName: ''
      }
      this.gradeIndex = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.ai-chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: calc(var(--status-bar-height) + 20rpx) 30rpx 30rpx;
    height: 120rpx;
    background-color: #fff;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    position: relative;
    z-index: 100;
  
  .logo-section {
    display: flex;
    align-items: center;
    
    .logo {
      width: 56rpx;
      height: 56rpx;
      margin-right: 16rpx;
    }
    
    .app-title {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
      letter-spacing: 1rpx;
    }
  }
  
  .interview-btn {
    background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
    color: #fff;
    border-radius: 24rpx;
    padding: 16rpx 28rpx;
    font-size: 26rpx;
    font-weight: 500;
    box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.2);
    }
  }
}

.chat-area {
  flex: 1;
  padding: 20rpx;
  background-color: #f8f8f8;
  
  .message-list {
    .message-item {
      margin-bottom: 32rpx;
      display: flex;
      
      &.user-message {
        justify-content: flex-end;
        
        .message-bubble {
          background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
          color: #fff;
          border-bottom-right-radius: 12rpx;
          box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.25);
        }
      }
      
      &.ai-message {
        justify-content: flex-start;
        
        .message-bubble {
          background-color: #fff;
          color: #333;
          border-bottom-left-radius: 12rpx;
          box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
        }
      }
      
      .message-bubble {
        max-width: 72%;
        padding: 24rpx 28rpx;
        border-radius: 24rpx;
        animation: slideIn 0.4s ease-out;
        
        .message-text {
          font-size: 32rpx;
          line-height: 1.6;
          word-break: break-word;
        }
        
        .file-card {
          display: flex;
          align-items: center;
          margin-top: 24rpx;
          padding: 24rpx;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 16rpx;
          
          .file-icon {
            width: 48rpx;
            height: 48rpx;
            margin-right: 20rpx;
            flex-shrink: 0;
          }
          
          .file-info {
            flex: 1;
            min-width: 0;
            
            .file-name {
              display: block;
              font-size: 28rpx;
              margin-bottom: 8rpx;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            
            .file-size {
              display: block;
              font-size: 24rpx;
              color: #999;
            }
          }
        }
        
        .analysis-card {
          margin-top: 24rpx;
          background-color: #fff;
          border-radius: 20rpx;
          overflow: hidden;
          box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
          border: 1rpx solid rgba(0, 122, 255, 0.1);
          
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24rpx 28rpx;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            cursor: pointer;
            
            .card-title {
              font-size: 30rpx;
              font-weight: 600;
              color: #333;
            }
            
            .expand-icon {
              width: 32rpx;
              height: 32rpx;
              transition: transform 0.3s ease;
            }
          }
          
          .card-content {
            padding: 24rpx 28rpx;
            background-color: #fff;
            
            rich-text {
              font-size: 28rpx;
              line-height: 1.8;
              color: #555;
              
              &::v-deep {
                p {
                  margin-bottom: 16rpx;
                }
                
                ul, ol {
                  margin: 16rpx 0;
                  padding-left: 40rpx;
                }
                
                li {
                  margin-bottom: 8rpx;
                  line-height: 1.6;
                }
                
                strong {
                  color: #333;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
	  
	  .markdown-content {
	    font-size: 32rpx;
	    line-height: 1.8;
	    color: #333;
	    
	    // 确保 rich-text 内的样式生效
	    ::v-deep {
	      p {
	        margin: 16rpx 0;
	        line-height: 1.8;
	      }
	      
	      strong {
	        font-weight: 600;
	        color: #222;
	      }
	      
	      em {
	        font-style: italic;
	        color: #555;
	      }
	      
	      h1, h2, h3 {
	        font-weight: 600;
	        margin: 24rpx 0 16rpx;
	      }
	      
	      ul, ol {
	        margin: 16rpx 0;
	        padding-left: 40rpx;
	      }
	      
	      li {
	        margin: 12rpx 0;
	      }
	      
	      pre {
	        background: #f8f9fa;
	        padding: 20rpx;
	        border-radius: 12rpx;
	        overflow-x: auto;
	        margin: 16rpx 0;
	      }
	      
	      code {
	        font-family: monospace;
	        font-size: 28rpx;
	      }
	      
	      blockquote {
	        border-left: 8rpx solid #007aff;
	        padding: 16rpx 24rpx;
	        margin: 16rpx 0;
	        background: #f8f9fa;
	      }
	      
	      a {
	        color: #007aff;
	        text-decoration: none;
	      }
	      
	      hr {
	        border: none;
	        border-top: 2rpx solid #e9ecef;
	        margin: 32rpx 0;
	      }
	    }
	  }
      
      .message-time {
        font-size: 24rpx;
        color: #999;
        margin-top: 12rpx;
        padding: 0 8rpx;
      }
    }
    
    .skeleton-message {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 32rpx;
      
      .skeleton-bubble {
        width: 240rpx;
        height: 72rpx;
        background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 24rpx;
      }
    }
  }
}

.input-area {
  background-color: #fff;
  padding: 24rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.06);
  border-top: 1rpx solid #f0f0f0;
  
  .function-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24rpx;
    gap: 16rpx;
    
    .func-btn {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      color: #495057;
      border: 1rpx solid #dee2e6;
      border-radius: 20rpx;
      padding: 18rpx 16rpx;
      font-size: 24rpx;
      flex: 1;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.95);
        background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
      }
      
      &:first-child {
        margin-left: 0;
      }
      
      &:last-child {
        margin-right: 0;
      }
    }
  }
  
  .input-container {
    display: flex;
    align-items: flex-end;
    gap: 16rpx;
    
    .text-input {
      flex: 1;
      min-height: 88rpx;
      max-height: 240rpx;
      padding: 24rpx;
      border: 2rpx solid #e9ecef;
      border-radius: 24rpx;
      font-size: 32rpx;
      background-color: #f8f9fa;
      transition: all 0.3s ease;
      
      &:focus {
        border-color: #007aff;
        background-color: #fff;
        box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.1);
      }
      
      &::placeholder {
        color: #adb5bd;
        font-size: 30rpx;
      }
    }
    
    .send-btn {
      background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
      color: #fff;
      border-radius: 24rpx;
      padding: 24rpx 36rpx;
      font-size: 28rpx;
      font-weight: 500;
      min-width: 120rpx;
      transition: all 0.3s ease;
      box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
      
      &:active {
        transform: scale(0.95);
        box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.2);
      }
      
      &:disabled {
        background: #dee2e6;
        box-shadow: none;
        color: #adb5bd;
      }
    }
  }
}

.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  
  .function-panel {
    width: 100%;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 32rpx 32rpx 0 0;
    animation: slideUp 0.4s ease-out;
    box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.1);
    
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32rpx 36rpx;
      border-bottom: 1rpx solid #f0f0f0;
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
      
      .panel-title {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
        letter-spacing: 0.5rpx;
      }
      
      .close-btn {
        width: 48rpx;
        height: 48rpx;
        padding: 8rpx;
        transition: transform 0.3s ease;
        
        &:active {
          transform: scale(0.9);
        }
      }
    }
    
    .panel-content {
      padding: 32rpx 36rpx;
      max-height: 50vh;
      overflow-y: auto;
      background-color: #fafbfc;
      
      .method-selector {
        margin-bottom: 32rpx;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 24rpx;
        box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
        
        .radio-item {
          display: flex;
          align-items: center;
          margin-bottom: 24rpx;
          padding: 16rpx 0;
          transition: background-color 0.3s ease;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          &:active {
            background-color: #f8f9fa;
            border-radius: 12rpx;
          }
          
          text {
            margin-left: 20rpx;
            font-size: 30rpx;
            color: #495057;
            font-weight: 500;
          }
        }
      }
      
      .input-fields {
        .input-group {
          margin-bottom: 32rpx;
          
          .input-label {
            display: block;
            font-size: 30rpx;
            color: #495057;
            margin-bottom: 16rpx;
            font-weight: 500;
          }
          
          .input-field {
            width: 100%;
            padding: 24rpx 28rpx;
            border: 2rpx solid #e9ecef;
            border-radius: 16rpx;
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
		  
		  // 用户信息展示样式（参照interview.vue）
          .user-id-display {
            width: 100%;
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
          
          .file-upload {
            padding: 40rpx;
            border: 2rpx dashed #007aff;
            border-radius: 16rpx;
            text-align: center;
            color: #007aff;
            font-size: 30rpx;
            background-color: #f0f8ff;
            transition: all 0.3s ease;
            font-weight: 500;
            
            &:active {
              background-color: #e6f2ff;
              transform: scale(0.98);
            }
          }
          
          .picker-field {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24rpx 28rpx;
            border: 2rpx solid #e9ecef;
            border-radius: 16rpx;
            background-color: #fff;
            transition: all 0.3s ease;
            
            &:active {
              background-color: #f8f9fa;
            }
            
            .picker-arrow {
              width: 32rpx;
              height: 32rpx;
              transition: transform 0.3s ease;
            }
          }
        }
      }
    }
    
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
    
    .panel-footer {
      display: flex;
      padding: 32rpx 36rpx;
      border-top: 1rpx solid #f0f0f0;
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
      gap: 20rpx;
      
      .submit-btn {
        flex: 1;
        background: linear-gradient(135deg, #007aff 0%, #0051d5 100%);
        color: #fff;
        border-radius: 24rpx;
        padding: 28rpx;
        font-size: 32rpx;
        font-weight: 500;
        box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.3);
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.95);
          box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.2);
        }
      }
      
      .cancel-btn {
        flex: 1;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        color: #6c757d;
        border-radius: 24rpx;
        padding: 28rpx;
        font-size: 32rpx;
        font-weight: 500;
        border: 1rpx solid #dee2e6;
        transition: all 0.3s ease;
        
        &:active {
          transform: scale(0.95);
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        }
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 80%;
  }
  
  .function-panel {
    max-height: 90vh;
    
    .panel-content {
      max-height: 60vh;
    }
  }
}

/* iOS安全区域适配 */
.safe-area-padding {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .ai-chat-container {
    background-color: #1a1a1a;
  }
  
  .header {
    background-color: #2d2d2d;
    
    .app-title {
      color: #ffffff;
    }
  }
  
  .chat-area {
    background-color: #1a1a1a;
  }
  
  .message-bubble {
    &.ai-message {
      background-color: #2d2d2d;
      color: #ffffff;
    }
  }
  
  .input-area {
    background-color: #2d2d2d;
    
    .text-input {
      background-color: #3d3d3d;
      border-color: #4d4d4d;
      color: #ffffff;
    }
  }
}
</style>