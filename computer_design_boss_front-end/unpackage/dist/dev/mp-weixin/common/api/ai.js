"use strict";
var common_api_request = require("./request.js");
const getStaticUrl = (url) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const baseUrl = "http://localhost:5000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};
const aiApi = {
  askByUserJobName: (jobName) => common_api_request.requestWithRetry({
    url: "/ai/ask_by_user_job_name",
    method: "GET",
    params: { job_name: jobName }
  }),
  askByUserJobText: (jobText) => common_api_request.requestWithRetry({
    url: "/ai/ask_by_user_job_text",
    method: "POST",
    data: { job_text: jobText }
  }),
  resumeEvaluation: () => common_api_request.requestWithRetry({
    url: "/ai/resume_evaluation",
    method: "GET"
  }),
  successRateByUserJobName: (jobName) => common_api_request.requestWithRetry({
    url: "/ai/success_rate_user_job_name",
    method: "GET",
    params: { job_name: jobName }
  }),
  successRateByUserJobText: (jobText) => common_api_request.requestWithRetry({
    url: "/ai/success_rate_user_job_text",
    method: "POST",
    data: { job_text: jobText }
  }),
  universityPlanByUserJobName: (jobName, userGrade) => common_api_request.requestWithRetry({
    url: "/ai/university_plan_user_job_name",
    method: "GET",
    params: { job_name: jobName, user_grade: userGrade }
  }),
  universityPlanByUserJobText: (jobText, userGrade) => common_api_request.requestWithRetry({
    url: "/ai/university_plan_user_job_text",
    method: "POST",
    data: { job_text: jobText, user_grade: userGrade }
  }),
  chat: (message) => common_api_request.requestWithRetry({
    url: "/ai/chat",
    method: "POST",
    data: { message }
  })
};
const interviewApi = {
  answer: (sessionId, userText, endInterview) => common_api_request.requestWithRetry({
    url: `/ai/interview/${sessionId}/answer`,
    method: "POST",
    data: { user_text: userText, end_interview: endInterview }
  }),
  getReport: (sessionId) => common_api_request.requestWithRetry({
    url: `/ai/interview/${sessionId}/report`,
    method: "GET"
  }),
  getHistory: (sessionId) => common_api_request.requestWithRetry({
    url: `/ai/interview/${sessionId}/history`,
    method: "GET"
  })
};
exports.aiApi = aiApi;
exports.getStaticUrl = getStaticUrl;
exports.interviewApi = interviewApi;
