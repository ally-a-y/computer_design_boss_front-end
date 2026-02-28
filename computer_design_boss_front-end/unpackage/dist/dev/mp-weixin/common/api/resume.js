"use strict";
var common_api_request = require("./request.js");
const resumeApi = {
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
  saveIntention(data) {
    return common_api_request.requestWithRetry({
      url: "/api/resume/job-intention",
      method: "POST",
      data
    });
  },
  getIntention() {
    return common_api_request.requestWithRetry({
      url: "/api/resume/complete",
      method: "GET"
    });
  },
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
  }
};
exports.resumeApi = resumeApi;
