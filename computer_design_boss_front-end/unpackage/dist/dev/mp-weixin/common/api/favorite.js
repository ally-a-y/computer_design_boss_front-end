"use strict";
var common_api_request = require("./request.js");
const favoriteApi = {
  addFavorite(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/add",
      method: "POST",
      data
    });
  },
  cancelFavorite(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/cancel",
      method: "POST",
      data
    });
  },
  getFavoriteList(user_id, include_canceled = 0) {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/list",
      method: "GET",
      data: {
        user_id,
        include_canceled
      }
    });
  },
  checkFavorite(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/check",
      method: "POST",
      data
    });
  },
  updateRemarks(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/update_remarks",
      method: "POST",
      data
    });
  },
  getFavoriteDetail(user_id, boss_job_id) {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/detail",
      method: "GET",
      data: {
        user_id,
        boss_job_id
      }
    });
  },
  batchCancel(data) {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/batch_cancel",
      method: "POST",
      data
    });
  }
};
exports.favoriteApi = favoriteApi;
