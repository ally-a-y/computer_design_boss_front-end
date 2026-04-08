"use strict";
const common_api_request = require("./request.js");
const resumeApi = {
  // 基本信息
  saveBasic(data) {
    return common_api_request.requestWithRetry({
      url: "/api/resume/basic",
      method: "POST",
      data
    });
  },
  getBasic() {
    return common_api_request.requestWithRetry({
      url: "/api/resume/basic",
      method: "GET"
    });
  },
  // 求职意向
  saveIntention(data) {
    return common_api_request.requestWithRetry({
      url: "/api/resume/job-intention",
      method: "POST",
      data
    });
  },
  getIntention() {
    return common_api_request.requestWithRetry({
      url: "/api/resume/job-intention",
      method: "GET"
    });
  },
  // 求职偏好
  savePreference(data) {
    return common_api_request.requestWithRetry({
      url: "/api/resume/job-preference",
      method: "POST",
      data
    });
  },
  getPreference() {
    return common_api_request.requestWithRetry({
      url: "/api/resume/job-preference",
      method: "GET"
    });
  },
  // 校园经历
  saveCampus(data) {
    return common_api_request.requestWithRetry({
      url: "/api/resume/campus-experience",
      method: "POST",
      data
    });
  },
  getCampus() {
    return common_api_request.requestWithRetry({
      url: "/api/resume/campus-experience",
      method: "GET"
    });
  },
  // 校园经历
  saveCertificates(data) {
    return common_api_request.requestWithRetry({
      url: "/api/resume/certificates",
      method: "POST",
      data
    });
  },
  getCertificates() {
    return common_api_request.requestWithRetry({
      url: "/api/resume/certificates",
      method: "GET"
    });
  }
};
exports.resumeApi = resumeApi;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/api/resume.js.map
