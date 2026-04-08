import request from './request.js'

// 用户相关API
export const userApi = {
  // 用户登录
  login: (loginData) => {
    return request({
      url: '/api/user/login',
      method: 'POST',
      data: loginData
    })
  },
  
  // 手机号验证码登录
  smsLogin: (loginData) => {
    return request({
      url: '/api/user/sms_login',
      method: 'POST',
      data: loginData
    })
  },
  
  // 用户注册
  register: (registerData) => {
    return request({
      url: '/api/user/register',
      method: 'POST',
      data: registerData
    })
  },
  
  // 发送验证码
  sendSmsCode: (data) => {
    return request({
      url: '/api/user/send_sms',
      method: 'POST',
      data: data
    })
  },
  
  // 忘记密码
  forgetPassword: (resetData) => {
    return request({
      url: '/api/user/forget_password',
      method: 'POST',
      data: resetData
    })
  },
  
  // 获取用户信息
  getUserProfile: () => {
    return request({
      url: '/api/user/profile',
      method: 'GET'
    })
  },
  
  // 获取用户名称和头像
  getUserNameAndAvatar: () => {
    return request({
      url: '/api/user/get_name_and_avatar',
      method: 'GET'
    })
  },
  
  // 更新用户信息
  updateUserProfile: (profileData) => {
    return request({
      url: '/api/user/profile',
      method: 'PUT',
      data: profileData
    })
  },
  
  // 修改密码
  updatePassword: (passwordData) => {
    return request({
      url: '/api/user/password',
      method: 'PUT',
      data: passwordData
    })
  },
  
  // 更新头像
  updateAvatar: (avatarData) => {
    return request({
      url: '/api/user/avatar',
      method: 'POST',
      data: avatarData
    })
  },
  
  // 获取用户状态
  getUserStatus: () => {
    return request({
      url: '/api/user/status',
      method: 'GET'
    })
  },
  
  // 用户登出
  logout: () => {
    return request({
      url: '/api/user/logout',
      method: 'POST'
    })
  }
}