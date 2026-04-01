<template>
  <view class="login-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <!-- 登录页无返回按钮 -->
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">{{ activeTab === 'login' ? '登录' : '注册' }}</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <view class="login-container">
    <!-- 页面标题 -->
    <view class="login-header">
      <text class="login-title">小菜鸟</text>
      <text class="login-subtitle">{{ activeTab === 'login' ? '欢迎回来' : '创建账号' }}</text>
    </view>
    
    <!-- 顶部选项卡 -->
    <view class="tab-container">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'login' }"
        @click="activeTab = 'login'"
      >
        <text class="tab-text">登录</text>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'register' }"
        @click="activeTab = 'register'"
      >
        <text class="tab-text">注册</text>
      </view>
    </view>
    
    <!-- 登录/注册表单容器 -->
    <view class="form-container">
      <!-- 登录表单 -->
      <view v-if="activeTab === 'login'" class="login-form">
        <!-- 登录方式切换 -->
        <view class="login-method">
          <view 
            class="method-item" 
            :class="{ active: loginMethod === 'sms' }"
            @click="loginMethod = 'sms'"
          >
            <text class="method-text">验证码登录</text>
          </view>
          <view 
            class="method-item" 
            :class="{ active: loginMethod === 'password' }"
            @click="loginMethod = 'password'"
          >
            <text class="method-text">密码登录</text>
          </view>
        </view>
        
        <!-- 手机号输入框 -->
        <view class="form-item">
          <view class="form-input-wrapper">
            <uni-icons type="phone" size="20" color="#999"></uni-icons>
            <input 
              type="number" 
              id="login-mobile"
              name="mobile"
              placeholder="请输入手机号" 
              v-model="loginForm.mobile"
              class="form-input"
              maxlength="11"
              @input="handleMobileInput"
            />
          </view>
        </view>
        
        <!-- 验证码输入框 -->
        <view v-if="loginMethod === 'sms'" class="form-item">
          <view class="form-input-wrapper">
            <uni-icons type="chat" size="20" color="#999"></uni-icons>
            <input 
              type="number" 
              id="login-sms-code"
              name="sms_code"
              placeholder="请输入验证码" 
              v-model="loginForm.sms_code"
              class="form-input"
              maxlength="6"
            />
            <button 
              class="sms-btn"
              :class="{ 'counting': isSendingSms }"
              :disabled="!canSendSms || isSendingSms"
              @click="sendSms"
            >
              {{ smsBtnText }}
            </button>
          </view>
        </view>
        
        <!-- 密码输入框 -->
        <view v-if="loginMethod === 'password'" class="form-item">
          <view class="form-input-wrapper">
            <uni-icons type="locked" size="20" color="#999"></uni-icons>
            <input 
              type="password" 
              id="login-password"
              name="password"
              placeholder="请输入密码" 
              v-model="loginForm.password"
              class="form-input"
            />
            <uni-icons 
              :type="showPassword ? 'eye' : 'eye-slash'" 
              size="20" 
              color="#999"
              @click="togglePassword"
            ></uni-icons>
          </view>
          <view class="forget-password">
            <text class="forget-link" @click="goToForgetPassword">忘记密码？</text>
          </view>
        </view>
        
        <!-- 登录按钮 -->
        <button 
          class="login-btn"
          :disabled="!isLoginFormValid"
          @click="handleLogin"
        >
          登录
        </button>
      </view>
      
      <!-- 注册表单 -->
      <view v-if="activeTab === 'register'" class="register-form">
        <!-- 账号设置 -->
        <view class="register-step active">
          <!-- 手机号输入框 -->
          <view class="form-item">
            <view class="form-input-wrapper">
              <uni-icons type="phone" size="20" color="#999"></uni-icons>
              <input 
                type="number" 
                id="register-mobile"
                name="mobile"
                placeholder="请输入手机号" 
                v-model="registerForm.mobile"
                class="form-input"
                maxlength="11"
                @input="handleRegisterMobileInput"
              />
            </view>
          </view>
          
          <!-- 验证码输入框 -->
          <view class="form-item">
            <view class="form-input-wrapper">
              <uni-icons type="chat" size="20" color="#999"></uni-icons>
              <input 
                type="number" 
                id="register-sms-code"
                name="sms_code"
                placeholder="请输入验证码" 
                v-model="registerForm.sms_code"
                class="form-input"
                maxlength="6"
              />
              <button 
                class="sms-btn"
                :class="{ 'counting': isSendingRegisterSms }"
                :disabled="!canSendRegisterSms || isSendingRegisterSms"
                @click="sendRegisterSms"
              >
                {{ registerSmsBtnText }}
              </button>
            </view>
          </view>
          
          <!-- 密码输入框 -->
          <view class="form-item">
            <view class="form-input-wrapper">
              <uni-icons type="locked" size="20" color="#999"></uni-icons>
              <input 
                type="password" 
                id="register-password"
                name="password"
                placeholder="请设置密码（至少8位）" 
                v-model="registerForm.password"
                class="form-input"
              />
              <uni-icons 
                :type="showPassword ? 'eye' : 'eye-slash'" 
                size="20" 
                color="#999"
                @click="togglePassword"
              ></uni-icons>
            </view>
          </view>
          
          <!-- 确认密码输入框 -->
          <view class="form-item">
            <view class="form-input-wrapper">
              <uni-icons type="locked" size="20" color="#999"></uni-icons>
              <input 
                type="password" 
                id="register-confirm-password"
                name="confirm_password"
                placeholder="请再次输入密码" 
                v-model="registerForm.confirm_password"
                class="form-input"
              />
            </view>
            <text v-if="registerForm.confirm_password && registerForm.password !== registerForm.confirm_password" class="error-text">
              两次输入的密码不一致
            </text>
          </view>
          
          <!-- 下一步按钮 -->
          <button 
            class="register-btn"
            :disabled="!isRegisterFormValid"
            @click="goToRegisterPage"
          >
            下一步
          </button>
          
          <!-- 已有账号链接 -->
          <view class="have-account">
            <text>已有账号？</text>
            <text class="login-link" @click="activeTab = 'login'">立即登录</text>
          </view>
        </view>
      </view>
    </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/common/api/user.js'

export default {
  data() {
    return {
      // 选项卡状态
      activeTab: 'login', // login 或 register
      
      // 登录表单数据
      loginForm: {
        mobile: '',
        password: '',
        sms_code: ''
      },
      
      // 登录方式
      loginMethod: 'sms', // sms 或 password
      
      // 注册表单数据
      registerForm: {
        mobile: '',
        sms_code: '',
        password: '',
        confirm_password: ''
      },
      
      // 密码显示状态
      showPassword: false,
      
      // 加载状态
      loading: false,
      
      // 验证码相关
      isSendingSms: false,
      smsCountdown: 60,
      canSendSms: false,
      
      // 注册验证码相关
      isSendingRegisterSms: false,
      registerSmsCountdown: 60,
      canSendRegisterSms: false
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
    
    // 注册验证码按钮文本
    registerSmsBtnText() {
      if (this.isSendingRegisterSms) {
        return `${this.registerSmsCountdown}s后重新发送`
      }
      return '获取验证码'
    },
    
    // 登录表单验证
    isLoginFormValid() {
      const { mobile, password, sms_code } = this.loginForm
      // 手机号验证（11位数字）
      const mobileRegex = /^1[3-9]\d{9}$/
      
      if (!mobileRegex.test(mobile)) {
        return false
      }
      
      if (this.loginMethod === 'sms') {
        // 验证码验证（6位数字）
        const smsRegex = /^\d{6}$/
        return smsRegex.test(sms_code)
      } else {
        // 密码验证（至少8位）
        return password.length >= 8
      }
    },
    
    // 注册表单验证（步骤1：账号设置）
    isRegisterFormValid() {
      const { mobile, sms_code, password, confirm_password } = this.registerForm
      // 手机号验证（11位数字）
      const mobileRegex = /^1[3-9]\d{9}$/
      // 验证码验证（6位数字）
      const smsRegex = /^\d{6}$/
      // 密码验证（至少8位）
      const passwordValid = password.length >= 8
      // 密码一致性验证
      const passwordMatch = password === confirm_password
      
      return mobileRegex.test(mobile) && smsRegex.test(sms_code) && passwordValid && passwordMatch
    }
  },
  methods: {
    // 处理手机号输入
    handleMobileInput() {
      const mobileRegex = /^1[3-9]\d{9}$/
      this.canSendSms = mobileRegex.test(this.loginForm.mobile)
    },
    
    // 处理注册手机号输入
    handleRegisterMobileInput() {
      const mobileRegex = /^1[3-9]\d{9}$/
      this.canSendRegisterSms = mobileRegex.test(this.registerForm.mobile)
    },
    
    // 切换密码显示/隐藏
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    // 发送登录验证码
    async sendSms() {
      if (!this.canSendSms) return
      
      try {
        this.isSendingSms = true
        
        // 模拟发送验证码
        await new Promise(resolve => setTimeout(resolve, 500))
        
        uni.showToast({
          title: '验证码发送成功',
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
    
    // 发送注册验证码
    async sendRegisterSms() {
      if (!this.canSendRegisterSms) return
      
      try {
        this.isSendingRegisterSms = true
        
        // 模拟发送验证码
        await new Promise(resolve => setTimeout(resolve, 500))
        
        uni.showToast({
          title: '验证码发送成功',
          icon: 'success'
        })
        
        // 开始倒计时
        this.startRegisterSmsCountdown()
      } catch (error) {
        console.error('发送验证码失败:', error)
        uni.showToast({
          title: '验证码发送失败，请稍后重试',
          icon: 'none'
        })
        this.isSendingRegisterSms = false
      }
    },
    
    // 登录验证码倒计时
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
    
    // 注册验证码倒计时
    startRegisterSmsCountdown() {
      const countdownTimer = setInterval(() => {
        this.registerSmsCountdown--
        
        if (this.registerSmsCountdown <= 0) {
          clearInterval(countdownTimer)
          this.isSendingRegisterSms = false
          this.registerSmsCountdown = 60
        }
      }, 1000)
    },
    
    // 处理登录
    async handleLogin() {
      if (!this.isLoginFormValid) {
        uni.showToast({
          title: '请填写正确的登录信息',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      
      try {
        let res
        
        if (this.loginMethod === 'sms') {
          // 验证码登录
          const loginData = {
            mobile: this.loginForm.mobile,
            sms_code: this.loginForm.sms_code
          }
          res = await userApi.smsLogin(loginData)
        } else {
          // 密码登录
          const loginData = {
            mobile: this.loginForm.mobile,
            password: this.loginForm.password
          }
          res = await userApi.login(loginData)
        }
        
        console.log('登录响应:', res)
        
        // 判断是否有 token
        if (res && res.token) {
          // 保存登录状态
          uni.setStorageSync('token', res.token)
          uni.setStorageSync('userInfo', JSON.stringify(res.user_info))
          
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
          
          setTimeout(() => {
            uni.switchTab({
              url: '/pages/index/index_index'
            })
          }, 1500)
        } else {
          uni.showToast({
            title: res.message || '登录失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('登录失败:', error)
        uni.showToast({
          title: error.message || '登录失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
	
    // 跳转到忘记密码页面
    goToForgetPassword() {
      uni.navigateTo({
        url: '/pages/login/forget/login_forget'
      })
    },
    
    // 跳转到单独的注册页面
    goToRegisterPage() {
      // 将注册数据传递到下一个页面
      uni.navigateTo({
        url: '/pages/login/register/login_reister?registerData=' + encodeURIComponent(JSON.stringify(this.registerForm))
      })
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F8FAFD;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

.login-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
}

/* 导航栏样式 */
.nav-bar {
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  height: 80px;
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

/* 页面标题 */
.login-header {
  margin: 24px 0 16px 0;
  text-align: center;
}

.login-title {
  font-size: 28px;
  font-weight: bold;
  color: #1E1E1E;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #6C757D;
}

/* 选项卡样式 */
.tab-container {
  display: flex;
  background-color: #fff;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 16px 0;
  position: relative;
  transition: all 0.3s ease;
}

.tab-item:active {
  background-color: #F0F4FF;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  background-color: #007aff;
  border-radius: 1px;
  transition: all 0.3s ease;
  /* 宽度与文字等宽 */
  width: 24px;
}

.tab-text {
  font-size: 15px;
  color: #6C757D;
  transition: all 0.3s ease;
}

.tab-item.active .tab-text {
  color: #007aff;
  font-weight: 600;
}

/* 表单容器 */
.form-container {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

/* 登录方式切换 */
.login-method {
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
  /* 宽度与文字等宽 */
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

.sms-btn.counting {
  background-color: #E9ECEF;
  color: #ADB5BD;
}

.sms-btn:disabled {
  background-color: #E9ECEF;
  color: #ADB5BD;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 48px;
  background-color: #007aff;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 30px;
  margin: 24px 0 16px;
  transition: all 0.3s ease;
  border: none;
}

.login-btn:active {
  background-color: #0056b3;
  transform: scale(0.98);
}

.login-btn:disabled {
  background-color: #E9ECEF;
  color: #ADB5BD;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  height: 48px;
  background-color: #007aff;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 30px;
  margin: 32px 0 16px;
  transition: all 0.3s ease;
  border: none;
}

.register-btn:active {
  background-color: #0056b3;
  transform: scale(0.98);
}

.register-btn:disabled {
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

/* 忘记密码链接 */
.forget-password {
  text-align: right;
  margin-top: 8px;
}

.forget-link {
  font-size: 13px;
  color: #007aff;
  transition: all 0.3s ease;
}

.forget-link:active {
  opacity: 0.7;
}

/* 已有账号链接 */
.have-account {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: #6C757D;
}

.login-link {
  color: #007aff;
  margin-left: 4px;
  transition: all 0.3s ease;
}

.login-link:active {
  opacity: 0.7;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 注册步骤 */
.register-step {
  display: none;
  animation: fadeIn 0.3s ease-in-out;
}

.register-step.active {
  display: block;
}
</style>