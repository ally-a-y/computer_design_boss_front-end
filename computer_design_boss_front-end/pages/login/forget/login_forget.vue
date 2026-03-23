<template>
  <view class="forget-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <uni-icons type="back" size="24" color="#1E1E1E" @click="goToLogin" @touchstart="$event.target.style.color = '#007aff'" @touchend="$event.target.style.color = '#1E1E1E'" @touchcancel="$event.target.style.color = '#1E1E1E'" />
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">忘记密码</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <view class="forget-container">
    
    <!-- 忘记密码表单 -->
    <view class="forget-form">
      <!-- 步骤1：身份验证 -->
      <view v-if="resetStep === 1" class="step-content">
        <!-- 验证方式选择 -->
        <view class="auth-method">
          <view 
            class="method-item" 
            :class="{ active: authMethod === 'mobile' }"
            @click="authMethod = 'mobile'"
          >
            <text class="method-text">手机号验证</text>
          </view>
          <view 
            class="method-item" 
            :class="{ active: authMethod === 'email' }"
            @click="authMethod = 'email'"
          >
            <text class="method-text">邮箱验证</text>
          </view>
        </view>
        
        <!-- 手机号输入框 -->
        <view v-if="authMethod === 'mobile'" class="form-item">
          <view class="form-label">手机号</view>
          <view class="form-input-wrapper">
            <uni-icons type="phone" size="24" color="#999"></uni-icons>
            <input 
              type="number" 
              placeholder="请输入手机号" 
              v-model="forgetForm.mobile"
              class="form-input"
              maxlength="11"
              @input="handleInput"
            />
          </view>
        </view>
        
        <!-- 邮箱输入框 -->
        <view v-else class="form-item">
          <view class="form-label">邮箱</view>
          <view class="form-input-wrapper">
            <uni-icons type="email" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入邮箱" 
              v-model="forgetForm.email"
              class="form-input"
              @input="handleInput"
            />
          </view>
        </view>
        
        <!-- 验证码输入框 -->
        <view class="form-item">
          <view class="form-label">验证码</view>
          <view class="form-input-wrapper">
            <uni-icons type="chat" size="24" color="#999"></uni-icons>
            <input 
              type="number" 
              placeholder="请输入验证码" 
              v-model="forgetForm.sms_code"
              class="form-input"
              maxlength="6"
            />
            <button 
              class="sms-btn"
              :disabled="!canSendSms || isSendingSms"
              @click="sendSms"
            >
              {{ smsBtnText }}
            </button>
          </view>
        </view>
        
        <!-- 下一步按钮 -->
        <button 
          class="confirm-btn"
          :disabled="!isAuthFormValid"
          @click="nextResetStep"
        >
          下一步
        </button>
      </view>
      
      <!-- 步骤2：重置密码 -->
      <view v-if="resetStep === 2" class="step-content">
        <!-- 新密码输入框 -->
        <view class="form-item">
          <view class="form-label">新密码</view>
          <view class="form-input-wrapper">
            <uni-icons type="locked" size="24" color="#999"></uni-icons>
            <input 
              type="password" 
              placeholder="请设置新密码（至少8位）" 
              v-model="forgetForm.new_password"
              class="form-input"
            />
            <uni-icons 
              :type="showPassword ? 'eye' : 'eye-slash'" 
              size="24" 
              color="#999"
              @click="togglePassword"
            ></uni-icons>
          </view>
        </view>
        
        <!-- 确认新密码输入框 -->
        <view class="form-item">
          <view class="form-label">确认新密码</view>
          <view class="form-input-wrapper">
            <uni-icons type="locked" size="24" color="#999"></uni-icons>
            <input 
              type="password" 
              placeholder="请再次输入新密码" 
              v-model="forgetForm.confirm_password"
              class="form-input"
            />
          </view>
          <text v-if="forgetForm.confirm_password && forgetForm.new_password !== forgetForm.confirm_password" class="error-text">
            两次输入的密码不一致
          </text>
        </view>
        
        <!-- 按钮区域 -->
        <view class="reset-buttons">
          <button 
            class="back-btn"
            @click="prevResetStep"
          >
            上一步
          </button>
          <button 
            class="confirm-btn"
            :disabled="!isPasswordFormValid"
            @click="handleResetPassword"
          >
            确认重置
          </button>
        </view>
      </view>
      
      <!-- 登录链接 -->
      <view class="login-link">
        <text>返回</text>
        <text class="login-text" @click="goToLogin">立即登录</text>
      </view>
    </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '../../../common/api/user.js'

export default {
  data() {
    return {
      // 重置步骤
      resetStep: 1, // 1: 身份验证, 2: 密码重置
      
      // 验证方式
      authMethod: 'mobile', // mobile 或 email
      
      // 表单数据
      forgetForm: {
        mobile: '',
        email: '',
        sms_code: '',
        new_password: '',
        confirm_password: ''
      },
      
      // 密码显示状态
      showPassword: false,
      
      // 加载状态
      loading: false,
      
      // 验证码相关
      isSendingSms: false,
      smsCountdown: 60,
      canSendSms: false
    }
  },
  computed: {
    // 验证码按钮文本
    smsBtnText() {
      if (this.isSendingSms) {
        return `${this.smsCountdown}s后重新发送`
      }
      return '获取验证码'
    },
    
    // 身份验证表单验证
    isAuthFormValid() {
      const { mobile, email, sms_code } = this.forgetForm
      // 手机号验证（11位数字）
      const mobileRegex = /^1[3-9]\d{9}$/
      // 邮箱验证
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      // 验证码验证（6位数字）
      const smsRegex = /^\d{6}$/
      
      // 根据不同验证方式进行验证
      if (this.authMethod === 'mobile') {
        return mobileRegex.test(mobile) && smsRegex.test(sms_code)
      } else {
        return emailRegex.test(email) && smsRegex.test(sms_code)
      }
    },
    
    // 密码表单验证
    isPasswordFormValid() {
      const { new_password, confirm_password } = this.forgetForm
      // 密码验证（至少8位）
      const passwordValid = new_password.length >= 8
      // 密码一致性验证
      const passwordMatch = new_password === confirm_password
      
      return passwordValid && passwordMatch
    }
  },
  methods: {
    // 处理输入
    handleInput() {
      if (this.authMethod === 'mobile') {
        const mobileRegex = /^1[3-9]\d{9}$/
        this.canSendSms = mobileRegex.test(this.forgetForm.mobile)
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        this.canSendSms = emailRegex.test(this.forgetForm.email)
      }
    },
    
    // 切换密码显示/隐藏
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    // 发送验证码
    async sendSms() {
      if (!this.canSendSms) return
      
      try {
        this.isSendingSms = true
        
        // 准备发送验证码的数据
        const smsData = {
          type: this.authMethod,
          value: this.authMethod === 'mobile' ? this.forgetForm.mobile : this.forgetForm.email
        }
        
        // 模拟发送验证码
        await new Promise(resolve => setTimeout(resolve, 500))
        
        uni.showToast({
          title: `${this.authMethod === 'mobile' ? '手机' : '邮箱'}验证码发送成功`,
          icon: 'success'
        })
        
        // 开始倒计时
        this.startSmsCountdown()
      } catch (error) {
        console.error('发送验证码失败:', error)
        uni.showToast({
          title: '验证码发送失败，请稍后重试',
          icon: 'none'
        })
        this.isSendingSms = false
      }
    },
    
    // 验证码倒计时
    startSmsCountdown() {
      const countdownTimer = setInterval(() => {
        this.smsCountdown--
        
        if (this.smsCountdown <= 0) {
          clearInterval(countdownTimer)
          this.isSendingSms = false
          this.smsCountdown = 60
        }
      }, 1000)
    },
    
    // 进入下一步
    nextResetStep() {
      if (this.resetStep === 1 && this.isAuthFormValid) {
        this.resetStep = 2
      }
    },
    
    // 返回上一步
    prevResetStep() {
      if (this.resetStep === 2) {
        this.resetStep = 1
      }
    },
    
    // 处理密码重置
    async handleResetPassword() {
      if (!this.isPasswordFormValid) {
        uni.showToast({
          title: '请填写正确的密码信息',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      
      try {
        // 准备重置密码数据
        const resetData = {
          ...(this.authMethod === 'mobile' ? { mobile: this.forgetForm.mobile } : { email: this.forgetForm.email }),
          sms_code: this.forgetForm.sms_code,
          new_password: this.forgetForm.new_password
        }
        
        // 调用后端接口
        const res = await userApi.forgetPassword(resetData)
        
        // 处理成功
        if (res) {
          uni.showToast({
            title: '密码重置成功',
            icon: 'success'
          })
          
          // 跳转到登录页面
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }, 1500)
        }
      } catch (error) {
        console.error('密码重置失败:', error)
        uni.showToast({
          title: error.message || '密码重置失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    // 跳转到登录页面
    goToLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.forget-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F8FAFD;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

.forget-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
}

/* 导航栏样式 */
.nav-bar {
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
  margin-bottom: 12px;
}

.nav-bar-left {
  flex: 0 0 auto;
  padding: 8px;
}

.nav-bar-center {
  flex: 1;
  text-align: center;
}

.nav-bar-title {
  font-size: 17px;
  font-weight: 600;
  color: #1E1E1E;
}

.nav-bar-right {
  flex: 0 0 auto;
  padding: 8px;
}

/* 忘记密码表单 */
.forget-form {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

/* 验证方式选择 */
.auth-method {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #F0F2F5;
}

.method-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  position: relative;
  transition: all 0.3s ease;
}

.method-item:active {
  background-color: #F0F4FF;
}

.method-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  background-color: #007aff;
  border-radius: 1px;
  transition: all 0.3s ease;
  width: 60px;
}

.method-text {
  font-size: 14px;
  color: #6C757D;
  transition: all 0.3s ease;
}

.method-item.active .method-text {
  color: #007aff;
  font-weight: 600;
}

/* 表单样式 */
.form-item {
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  color: #6C757D;
  margin-bottom: 8px;
  display: block;
}

.form-input-wrapper {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 0 12px;
  background-color: #F2F5F9;
  height: 48px;
  transition: all 0.3s ease;
}

.form-input-wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(0,122,255,0.2);
}

.form-input {
  flex: 1;
  font-size: 15px;
  color: #1E1E1E;
  padding-left: 12px;
  background: transparent;
  border: none;
  outline: none;
}

.form-input::placeholder {
  color: #ADB5BD;
}

/* 验证码按钮 */
.sms-btn {
  height: 40px;
  background-color: #F0F4FF;
  color: #007aff;
  font-size: 13px;
  border-radius: 20px;
  margin-left: 12px;
  padding: 0 16px;
  transition: all 0.3s ease;
  border: none;
}

.sms-btn:active {
  background-color: #E0E9FF;
  transform: scale(0.95);
}

.sms-btn:disabled {
  background-color: #E9ECEF;
  color: #ADB5BD;
}

/* 错误提示 */
.error-text {
  font-size: 13px;
  color: #e54d42;
  margin-top: 8px;
  display: block;
}

/* 按钮区域 */
.reset-buttons {
  display: flex;
  gap: 12px;
  margin: 32px 0 16px;
}

.back-btn {
  flex: 1;
  height: 48px;
  background-color: #F2F5F9;
  color: #6C757D;
  font-size: 16px;
  border-radius: 30px;
  transition: all 0.3s ease;
  border: none;
}

.back-btn:active {
  background-color: #E9ECEF;
  transform: scale(0.98);
}

.confirm-btn {
  flex: 1;
  height: 48px;
  background-color: #007aff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 30px;
  transition: all 0.3s ease;
  border: none;
}

.confirm-btn:active {
  background-color: #0056b3;
  transform: scale(0.98);
}

.confirm-btn:disabled {
  background-color: #E9ECEF;
  color: #ADB5BD;
}

/* 登录链接 */
.login-link {
  text-align: center;
  font-size: 13px;
  color: #6C757D;
  margin-top: 16px;
}

.login-text {
  color: #007aff;
  margin-left: 4px;
  transition: all 0.3s ease;
}

.login-text:active {
  opacity: 0.7;
}
</style>