"use strict";
var common_api_request = require("./request.js");
const jobApi = {
  getAllJobs: () => {
    return common_api_request.requestWithRetry({
      url: "/job/Job_List_all",
      method: "GET"
    });
  },
  getJobsByCategory: (categoryId) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_lis_one_type",
      method: "POST",
      data: { category_id: categoryId.toString() }
    });
  },
  getJobsByCategoryAndType: (categoryId, empType) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_list_two_given",
      method: "POST",
      data: { category_id: categoryId.toString(), emp_type: empType.toString() }
    });
  },
  searchJobs: (keyword) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_search",
      method: "POST",
      data: { user_input: keyword }
    });
  },
  getJobDetail: (jobId) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_details",
      method: "POST",
      data: { id: jobId }
    });
  },
  getJobCategories: () => {
    return common_api_request.requestWithRetry({
      url: "/job_intro/job_intro_list",
      method: "GET"
    });
  },
  addJob: (jobData) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_add",
      method: "POST",
      data: jobData
    });
  },
  addFavorite: (Favoriteadd) => {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/add",
      method: "POST",
      data: Favoriteadd
    });
  },
  cancelFavorite: (Favoritecancel) => {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/cancel",
      method: "POST",
      data: Favoritecancel
    });
  },
  getUserFavorites: () => {
    return common_api_request.requestWithRetry({
      url: "/api/job/favorite/list",
      method: "GET"
    });
  }
};
exports.jobApi = jobApi;
