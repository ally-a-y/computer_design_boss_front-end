"use strict";
const common_api_request = require("./request.js");
const jobApi = {
  // 获取全部职位列表
  getAllJobs: () => {
    return common_api_request.requestWithRetry({
      url: "/job/Job_List_all",
      method: "GET"
    });
  },
  // 根据类别获取职位列表
  getJobsByCategory: (categoryId) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_lis_one_type",
      method: "POST",
      data: { category_id: categoryId.toString() }
    });
  },
  // 根据类别和就业类型获取职位列表
  getJobsByCategoryAndType: (categoryId, empType) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_list_two_given",
      method: "POST",
      data: { category_id: categoryId.toString(), emp_type: empType.toString() }
    });
  },
  // 搜索职位
  searchJobs: (keyword) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_search",
      method: "POST",
      data: { user_input: keyword }
    });
  },
  // 获取职位详情
  getJobDetail: (jobId) => {
    return common_api_request.requestWithRetry({
      url: "/job/job_details",
      method: "POST",
      data: { id: jobId }
    });
  },
  // 获取职位分类列表
  getJobCategories: () => {
    return common_api_request.requestWithRetry({
      url: "/job_intro/job_intro_list",
      method: "GET"
    });
  }
};
exports.jobApi = jobApi;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/api/job.js.map
