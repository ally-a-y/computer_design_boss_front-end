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
            <text class="message-text">{{ message.content }}</text>
            
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
              <view v-if="currentMethod.includes('user')" class="input-group">
                <text class="input-label">用户ID</text>
                <input class="input-field" v-model="formData.userId" placeholder="请输入用户ID" />
              </view>
              
              <view v-if="currentMethod.includes('position')" class="input-group">
                <text class="input-label">职位ID</text>
                <input class="input-field" v-model="formData.positionId" placeholder="请输入职位ID" />
              </view>
              
              <view v-if="currentMethod.includes('text')" class="input-group">
                <text class="input-label">职位描述</text>
                <textarea class="input-field" v-model="formData.positionText" placeholder="请输入职位描述"></textarea>
              </view>
              
              <view v-if="currentMethod.includes('pdf')" class="input-group">
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
              <radio-group @change="onMethodChange">
                <label class="radio-item">
                  <radio value="user" :checked="currentMethod === 'user'" />
                  <text>用户ID</text>
                </label>
                <label class="radio-item">
                  <radio value="pdf" :checked="currentMethod === 'pdf'" />
                  <text>PDF上传</text>
                </label>
              </radio-group>
            </view>
            
            <view class="input-fields">
              <view v-if="currentMethod === 'user'" class="input-group">
                <text class="input-label">用户ID</text>
                <input class="input-field" v-model="formData.userId" placeholder="请输入用户ID" />
              </view>
              <view v-if="currentMethod === 'pdf'" class="input-group">
                <text class="input-label">PDF文件</text>
                <view class="file-upload" @click="chooseFile">
                  <text>{{ formData.pdfFile ? formData.pdfFile.name : '点击选择PDF文件' }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <view v-if="currentPanel === 'successRate'">
            <view class="method-selector">
              <radio-group @change="onMethodChange">
                <label class="radio-item">
                  <radio value="pdf+position" :checked="currentMethod === 'pdf+position'" />
                  <text>PDF+职位ID</text>
                </label>
                <label class="radio-item">
                  <radio value="user+text" :checked="currentMethod === 'user+text'" />
                  <text>用户ID+职位描述</text>
                </label>
              </radio-group>
            </view>
            
            <view class="input-fields">
              <view v-if="currentMethod === 'user+text'" class="input-group">
                <text class="input-label">用户ID</text>
                <input class="input-field" v-model="formData.userId" placeholder="请输入用户ID" />
              </view>
              
              <view v-if="currentMethod.includes('position')" class="input-group">
                <text class="input-label">职位ID</text>
                <input class="input-field" v-model="formData.positionId" placeholder="请输入职位ID" />
              </view>
              
              <view v-if="currentMethod.includes('text')" class="input-group">
                <text class="input-label">职位描述</text>
                <textarea class="input-field" v-model="formData.positionText" placeholder="请输入职位描述"></textarea>
              </view>
              
              <view v-if="currentMethod.includes('pdf')" class="input-group">
                <text class="input-label">PDF文件</text>
                <view class="file-upload" @click="chooseFile">
                  <text>{{ formData.pdfFile ? formData.pdfFile.name : '点击选择PDF文件' }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <view v-if="currentPanel === 'studentPlan'">
            <view class="method-selector">
              <radio-group @change="onMethodChange">
                <label class="radio-item">
                  <radio value="pdf+position" :checked="currentMethod === 'pdf+position'" />
                  <text>PDF+职位ID</text>
                </label>
                <label class="radio-item">
                  <radio value="user+text" :checked="currentMethod === 'user+text'" />
                  <text>用户ID+职位描述</text>
                </label>
              </radio-group>
            </view>
            
            <view class="input-fields">
              <view v-if="currentMethod.includes('user')" class="input-group">
                <text class="input-label">用户ID</text>
                <input class="input-field" v-model="formData.userId" placeholder="请输入用户ID" />
              </view>
              
              <view v-if="currentMethod.includes('position')" class="input-group">
                <text class="input-label">职位ID</text>
                <input class="input-field" v-model="formData.positionId" placeholder="请输入职位ID" />
              </view>
              
              <view v-if="currentMethod.includes('text')" class="input-group">
                <text class="input-label">职位描述</text>
                <textarea class="input-field" v-model="formData.positionText" placeholder="请输入职位描述"></textarea>
              </view>
              
              <view v-if="currentMethod.includes('pdf')" class="input-group">
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
      currentMethod: 'pdf+position',
      formData: {
        userId: '',
        positionId: '',
        positionText: '',
        pdfFile: null
      },
      
      analysisMethods: [
        { value: 'user+position', label: '用户ID+职位ID' },
        { value: 'user+text', label: '用户ID+职位文本' },
        { value: 'pdf+position', label: 'PDF+职位ID' },
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
    // 页面加载初始化
    this.initializeChat()
  },
  
  onUnload() {
    // 页面卸载清理
    this.cleanup()
  },
  
  methods: {
    initializeChat() {
      // 初始化聊天数据
    },
    
    cleanup() {
      // 清理资源
    },
    
    goToInterview() {
      uni.navigateTo({
        url: '/pages/AI/interview'
      })
    },
    
    sendMessage() {
      if (!this.inputText.trim()) return
      
      // 添加用户消息
      this.messages.push({
        sender: 'user',
        content: this.inputText,
        timestamp: Date.now()
      })
      
      this.scrollToBottom()
      this.isLoading = true
      this.inputText = ''
      
      // 模拟AI回复
      this.simulateAIResponse()
    },
    
    openPanel(panelType) {
      this.currentPanel = panelType
      this.currentMethod = this.getDefaultMethod(panelType)
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
      return defaults[panelType] || 'user'
    },
    
    onMethodChange(e) {
      this.currentMethod = e.detail.value
    },
    
    
    
    chooseFile() {
      uni.chooseFile({
        count: 1,
        type: 'file',
        extension: ['pdf'],
        success: (res) => {
          this.formData.pdfFile = res.tempFiles[0]
        }
      })
    },
    
    submitFunction() {
      // 添加用户消息
      let userMessage = ''
      switch (this.currentPanel) {
        case 'resumeAnalysis':
          userMessage = '请分析这份简历'
          break
        case 'resumeEvaluation':
          userMessage = '请评估我的简历'
          break
        case 'successRate':
          userMessage = '请分析我的求职成功率'
          break
        case 'studentPlan':
          userMessage = '请为我制定大学生活规划'
          break
      }
      
      if (this.formData.pdfFile) {
        userMessage += `：[${this.formData.pdfFile.name}]`
      }
      
      this.messages.push({
        sender: 'user',
        content: userMessage,
        timestamp: Date.now(),
        file: this.formData.pdfFile
      })
      
      this.closePanel()
      this.scrollToBottom()
      
      // 模拟AI分析结果
      this.simulateAnalysisResult()
    },
    
    toggleCard(index) {
      this.messages[index].expanded = !this.messages[index].expanded
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 999999
      })
    },
    
    loadMoreHistory() {
      // 加载更多历史消息
      // TODO: 实现历史消息加载功能
    },
    
    formatFileSize(size) {
      if (size < 1024) return size + 'B'
      if (size < 1024 * 1024) return (size / 1024).toFixed(1) + 'KB'
      return (size / (1024 * 1024)).toFixed(1) + 'MB'
    },
    
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString()
    },
    
    resetForm() {
      this.formData = {
        userId: '',
        positionId: '',
        positionText: '',
        pdfFile: null
      }
    },
    
    simulateAIResponse() {
      setTimeout(() => {
        this.isLoading = false
        this.messages.push({
          sender: 'ai',
          content: '我已经收到您的消息，正在为您分析...',
          timestamp: Date.now(),
          expanded: false
        })
        this.scrollToBottom()
      }, 1500)
    },
    
    simulateAnalysisResult() {
      setTimeout(() => {
        this.messages.push({
          sender: 'ai',
          content: '分析完成，以下是详细结果：',
          timestamp: Date.now(),
          expanded: false,
          analysisResult: {
            title: '简历分析报告',
            content: '<p><strong>优势：</strong></p><ul><li>技术能力突出</li><li>项目经验丰富</li></ul><p><strong>建议：</strong></p><ul><li>可以增加更多量化成果</li><li>优化关键词匹配</li></ul>'
          }
        })
        this.scrollToBottom()
      }, 2000)
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
        
        .progress-bar {
          margin-top: 24rpx;
          height: 12rpx;
          background-color: #f0f0f0;
          border-radius: 6rpx;
          position: relative;
          overflow: hidden;
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #007aff 0%, #00d4ff 100%);
            border-radius: 6rpx;
            transition: width 0.4s ease;
          }
          
          .progress-text {
            position: absolute;
            right: 0;
            top: -36rpx;
            font-size: 24rpx;
            color: #666;
            font-weight: 500;
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