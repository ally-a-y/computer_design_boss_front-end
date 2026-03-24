"use strict";
const common_api_request = require("./request.js");
const getComplaintTypes = () => {
  return common_api_request.requestWithRetry({
    url: "/api/complaint/types",
    method: "GET"
  });
};
const getFeedbackList = (params) => {
  return common_api_request.requestWithRetry({
    url: "/api/feedback/list",
    method: "GET",
    data: params
  });
};
const submitFeedback = (data) => {
  return common_api_request.requestWithRetry({
    url: "/api/feedback/submit",
    method: "POST",
    data
  });
};
exports.getComplaintTypes = getComplaintTypes;
exports.getFeedbackList = getFeedbackList;
exports.submitFeedback = submitFeedback;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/api/feedback.js.map
