"use strict";
const common_api_request = require("./request.js");
const userApi = {
  // 用户登录
  login: (loginData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/login",
      method: "POST",
      data: loginData
    });
  },
  // 手机号验证码登录
  smsLogin: (loginData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/sms_login",
      method: "POST",
      data: loginData
    });
  },
  // 用户注册
  register: (registerData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/register",
      method: "POST",
      data: registerData
    });
  },
  // 发送验证码
  sendSmsCode: (data) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/send_sms",
      method: "POST",
      data
    });
  },
  // 忘记密码
  forgetPassword: (resetData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/forget_password",
      method: "POST",
      data: resetData
    });
  },
  // 获取用户信息
  getUserProfile: () => {
    return common_api_request.requestWithRetry({
      url: "/api/user/profile",
      method: "GET"
    });
  },
  // 更新用户信息
  updateUserProfile: (profileData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/profile",
      method: "PUT",
      data: profileData
    });
  },
  // 修改密码
  updatePassword: (passwordData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/password",
      method: "PUT",
      data: passwordData
    });
  },
  // 更新头像
  updateAvatar: (avatarData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/avatar",
      method: "POST",
      data: avatarData
    });
  },
  // 获取用户状态
  getUserStatus: () => {
    return common_api_request.requestWithRetry({
      url: "/api/user/status",
      method: "GET"
    });
  },
  // 用户登出
  logout: () => {
    return common_api_request.requestWithRetry({
      url: "/api/user/logout",
      method: "POST"
    });
  }
};
exports.userApi = userApi;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/api/user.js.map
