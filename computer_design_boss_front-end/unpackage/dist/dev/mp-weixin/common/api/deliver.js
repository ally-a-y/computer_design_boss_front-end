"use strict";
var common_api_request = require("./request.js");
const deliverApi = {
  getDeliverList(user_id) {
    return common_api_request.requestWithRetry({
      url: "/api/job/deliver/list",
      method: "GET",
      data: {
        user_id
      }
    });
  },
  cancelDeliver(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/deliver/cancel",
      method: "POST",
      data
    });
  },
  getDeliverDetail(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/deliver/detail",
      method: "GET",
      data
    });
  },
  addDeliver(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/deliver/add",
      method: "POST",
      data
    });
  },
  checkDeliver(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/deliver/check",
      method: "POST",
      data
    });
  }
};
exports.deliverApi = deliverApi;
