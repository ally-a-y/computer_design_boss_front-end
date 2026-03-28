"use strict";
var common_api_request = require("./request.js");
const userApi = {
  login: (loginData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/login",
      method: "POST",
      data: loginData
    });
  },
  smsLogin: (loginData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/sms_login",
      method: "POST",
      data: loginData
    });
  },
  register: (registerData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/register",
      method: "POST",
      data: registerData
    });
  },
  sendSmsCode: (data) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/send_sms",
      method: "POST",
      data
    });
  },
  forgetPassword: (resetData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/forget_password",
      method: "POST",
      data: resetData
    });
  },
  getUserProfile: () => {
    return common_api_request.requestWithRetry({
      url: "/api/user/profile",
      method: "GET"
    });
  },
  updateUserProfile: (profileData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/profile",
      method: "PUT",
      data: profileData
    });
  },
  updatePassword: (passwordData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/password",
      method: "PUT",
      data: passwordData
    });
  },
  updateAvatar: (avatarData) => {
    return common_api_request.requestWithRetry({
      url: "/api/user/avatar",
      method: "POST",
      data: avatarData
    });
  },
  getUserStatus: () => {
    return common_api_request.requestWithRetry({
      url: "/api/user/status",
      method: "GET"
    });
  },
  logout: () => {
    return common_api_request.requestWithRetry({
      url: "/api/user/logout",
      method: "POST"
    });
  }
};
exports.userApi = userApi;
