<template>
  <view class="login-container">
    <!-- 页面标题 -->
    <view class="login-header">
      <text class="login-title">职位招聘</text>
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
          <view class="form-label">手机号</view>
          <view class="form-input-wrapper">
            <uni-icons type="phone" size="24" color="#999"></uni-icons>
            <input 
              type="number" 
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
          <view class="form-label">验证码</view>
          <view class="form-input-wrapper">
            <uni-icons type="chat" size="24" color="#999"></uni-icons>
            <input 
              type="number" 
              placeholder="请输入验证码" 
              v-model="loginForm.sms_code"
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
        
        <!-- 密码输入框 -->
        <view v-if="loginMethod === 'password'" class="form-item">
          <view class="form-label">密码</view>
          <view class="form-input-wrapper">
            <uni-icons type="locked" size="24" color="#999"></uni-icons>
            <input 
              type="password" 
              placeholder="请输入密码" 
              v-model="loginForm.password"
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
        
        <!-- 登录按钮 -->
        <button 
          class="login-btn"
          :disabled="!isLoginFormValid"
          @click="handleLogin"
        >
          登录
        </button>
        
        <!-- 忘记密码链接 -->
        <view class="forget-link" @click="goToForgetPassword">
          忘记密码？
        </view>
      </view>
      
      <!-- 注册表单 -->
      <view v-if="activeTab === 'register'" class="register-form">
        <!-- 账号设置 -->
        <view class="register-step active">
          <h3 class="step-title">创建账号</h3>
          
          <!-- 手机号输入框 -->
          <view class="form-item">
            <view class="form-label">手机号</view>
            <view class="form-input-wrapper">
              <uni-icons type="phone" size="24" color="#999"></uni-icons>
              <input 
                type="number" 
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
            <view class="form-label">验证码</view>
            <view class="form-input-wrapper">
              <uni-icons type="chat" size="24" color="#999"></uni-icons>
              <input 
                type="number" 
                placeholder="请输入验证码" 
                v-model="registerForm.sms_code"
                class="form-input"
                maxlength="6"
              />
              <button 
                class="sms-btn"
                :disabled="!canSendRegisterSms || isSendingRegisterSms"
                @click="sendRegisterSms"
              >
                {{ registerSmsBtnText }}
              </button>
            </view>
          </view>
          
          <!-- 密码输入框 -->
          <view class="form-item">
            <view class="form-label">密码</view>
            <view class="form-input-wrapper">
              <uni-icons type="locked" size="24" color="#999"></uni-icons>
              <input 
                type="password" 
                placeholder="请设置密码（至少8位）" 
                v-model="registerForm.password"
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
          
          <!-- 确认密码输入框 -->
          <view class="form-item">
            <view class="form-label">确认密码</view>
            <view class="form-input-wrapper">
              <uni-icons type="locked" size="24" color="#999"></uni-icons>
              <input 
                type="password" 
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
        const loginData = {
          mobile: this.loginForm.mobile
        }
        
        if (this.loginMethod === 'sms') {
          loginData.sms_code = this.loginForm.sms_code
        } else {
          loginData.password = this.loginForm.password
        }
        
        // 调用登录接口
        const res = await userApi.login(loginData)
        
        console.log('登录响应:', res)
        
        // 判断是否有 token（
        if (res && res.token) {
          // 保存登录状态
          uni.setStorageSync('token', res.token)
          uni.setStorageSync('userInfo', res.user_info)
          
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
          title: '登录失败，请稍后重试',
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
.login-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 40rpx;
}

.login-header {
  margin: 80rpx 0 60rpx 0;
  text-align: center;
}

.login-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

/* 选项卡样式 */
.tab-container {
  display: flex;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 30rpx 0;
  position: relative;
}

.tab-item.active {
  color: #007aff;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 4rpx;
  background-color: #007aff;
  border-radius: 2rpx;
}

.tab-text {
  font-size: 32rpx;
  color: #666;
}

.tab-item.active .tab-text {
  color: #007aff;
  font-weight: bold;
}

/* 表单容器 */
.form-container {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}

/* 登录方式切换 */
.login-method {
  display: flex;
  margin-bottom: 40rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.method-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  position: relative;
}

.method-item.active {
  color: #007aff;
}

.method-item.active::after {
  content: '';
  position: absolute;
  bottom: -2rpx;
  left: 30%;
  width: 40%;
  height: 4rpx;
  background-color: #007aff;
  border-radius: 2rpx;
}

.method-text {
  font-size: 28rpx;
  color: #666;
}

.method-item.active .method-text {
  color: #007aff;
  font-weight: bold;
}

/* 表单样式 */
.form-item {
  margin-bottom: 40rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.form-input-wrapper {
  display: flex;
  align-items: center;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  background-color: #fafafa;
}

.form-input {
  flex: 1;
  height: 88rpx;
  font-size: 32rpx;
  color: #333;
  padding-left: 16rpx;
}

.form-input:focus {
  outline: none;
}

/* 验证码按钮 */
.sms-btn {
  width: 160rpx;
  height: 64rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 24rpx;
  border-radius: 32rpx;
  margin-left: 20rpx;
}

.sms-btn:disabled {
  background-color: #ccc;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 96rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
  margin: 40rpx 0;
}

.login-btn:disabled {
  background-color: #ccc;
}

/* 步骤标题 */
.step-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 40rpx;
  text-align: center;
}

/* 注册步骤 */
.register-step {
  display: none;
  animation: fadeIn 0.3s ease-in-out;
}

.register-step.active {
  display: block;
}

/* 可选步骤标记 */
.optional-tag {
  font-size: 24rpx;
  color: #007aff;
  font-weight: normal;
  margin-left: 10rpx;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  height: 96rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
  margin: 40rpx 0;
}

.register-btn:disabled {
  background-color: #ccc;
}

/* 跳过按钮 */
.skip-btn {
  flex: 1;
  height: 96rpx;
  background-color: #f5f5f5;
  color: #333;
  font-size: 32rpx;
  border-radius: 48rpx;
  border: 2rpx solid #e5e5e5;
  margin: 40rpx 10rpx;
}

/* Picker组件样式 */
.picker-input {
  flex: 1;
  padding-right: 40rpx;
  background-color: transparent;
  border: none;
}

.picker-arrow {
  position: absolute;
  right: 20rpx;
}

/* 薪资范围 */
.salary-range {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 0 20rpx;
  background-color: #fafafa;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
}

.salary-input {
  flex: 1;
  height: 88rpx;
  font-size: 32rpx;
  color: #333;
}

.salary-separator {
  font-size: 32rpx;
  color: #999;
}

.salary-unit {
  font-size: 28rpx;
  color: #999;
}

/* 错误提示 */
.error-text {
  font-size: 24rpx;
  color: #e54d42;
  margin-top: 12rpx;
  display: block;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 忘记密码链接 */
.forget-link {
  text-align: center;
  font-size: 28rpx;
  color: #007aff;
  margin-top: 20rpx;
  display: block;
}

/* 性别选择器 */
.gender-selector {
  display: flex;
  gap: 20rpx;
}

.gender-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  background-color: #fafafa;
}

.gender-item.active {
  border-color: #007aff;
  background-color: #e6f2ff;
}

.gender-text {
  font-size: 32rpx;
  color: #333;
}

.gender-item.active .gender-text {
  color: #007aff;
  font-weight: bold;
}

/* 注册按钮区域 */
.register-buttons {
  display: flex;
  gap: 20rpx;
  margin: 40rpx 0;
}

.back-btn {
  flex: 1;
  height: 96rpx;
  background-color: #f5f5f5;
  color: #333;
  font-size: 32rpx;
  border-radius: 48rpx;
  border: 2rpx solid #e5e5e5;
}

.register-btn {
  flex: 1;
  height: 96rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
}

.register-btn:disabled {
  background-color: #ccc;
}
</style>