"use strict";
var common_vendor = require("../vendor.js");
var common_api_request = require("./request.js");
var common_config = require("../config.js");
const getApiUrl = (path) => {
  if (!path)
    return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseURL = common_config.config.baseURL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseURL}${normalizedPath}`;
};
const getStaticUrl = (path) => {
  if (!path)
    return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseURL = common_config.config.staticURL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseURL}${normalizedPath}`;
};
const getFullUrl = getApiUrl;
const base64ToFile = (base64Data, fileName = "resume.pdf") => {
  return new Promise((resolve, reject) => {
    const fs = common_vendor.index.getFileSystemManager();
    const filePath = `${common_vendor.index.env.USER_DATA_PATH}/${fileName}`;
    try {
      const base64 = base64Data.replace(/^data:.*;base64,/, "");
      fs.writeFile({
        filePath,
        data: base64,
        encoding: "base64",
        success: () => resolve(filePath),
        fail: reject
      });
    } catch (e) {
      reject(e);
    }
  });
};
const uploadPdf = async (url, fileData, formData = {}) => {
  const tempPath = await base64ToFile(fileData.base64, fileData.name);
  return new Promise((resolve, reject) => {
    common_vendor.index.uploadFile({
      url: getFullUrl(url),
      filePath: tempPath,
      name: "pdf_file",
      timeout: 12e4,
      formData,
      header: {
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
      },
      success: (res) => {
        try {
          common_vendor.index.getFileSystemManager().unlink({ filePath: tempPath });
        } catch (e) {
        }
        try {
          const data = JSON.parse(res.data);
          resolve(data);
        } catch (e) {
          resolve({ code: 200, data: res.data });
        }
      },
      fail: reject
    });
  });
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
  askByPdfJobName: (fileData, jobName) => {
    return uploadPdf("/ai/ask_by_pdf_job_name", fileData, { job_name: jobName });
  },
  askByPdfJobText: (fileData, jobText) => {
    return uploadPdf("/ai/ask_by_pdf_job_text", fileData, { job_text: jobText });
  },
  resumeEvaluation: () => common_api_request.requestWithRetry({
    url: "/ai/resume_evaluation",
    method: "GET"
  }),
  resumeEvaluationByPdf: (fileData) => {
    return uploadPdf("/ai/resume_evaluation_text", fileData);
  },
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
  successRateByPdfJobName: (fileData, jobName) => {
    return uploadPdf("/ai/success_rate_pdf_job_name", fileData, { job_name: jobName });
  },
  successRateByPdfJobText: (fileData, jobText) => {
    return uploadPdf("/ai/success_rate_pdf_job_text", fileData, { job_text: jobText });
  },
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
  universityPlanByPdfJobName: (fileData, jobName, userGrade) => {
    return uploadPdf("/ai/university_plan_pdf_job_name", fileData, {
      job_name: jobName,
      user_grade: userGrade
    });
  },
  universityPlanByPdfJobText: (fileData, jobText, userGrade) => {
    return uploadPdf("/ai/university_plan_pdf_job_text", fileData, {
      job_text: jobText,
      user_grade: userGrade
    });
  },
  chat: (message) => common_api_request.requestWithRetry({
    url: "/ai/chat",
    method: "POST",
    data: { message }
  })
};
const interviewApi = {
  startText: (resumeText, jobText) => common_api_request.requestWithRetry({
    url: "/ai/interview/start/text",
    method: "POST",
    data: {
      resume_text: resumeText,
      job_text: jobText
    }
  }),
  startPdfText: (pdfBase64, jobText) => common_api_request.requestWithRetry({
    url: "/ai/interview/start/pdf-text",
    method: "POST",
    data: {
      resume_file: pdfBase64,
      job_text: jobText
    }
  }),
  startPdfJobName: (pdfBase64, jobName) => common_api_request.requestWithRetry({
    url: "/ai/interview/start/pdf-job_name",
    method: "POST",
    data: {
      resume_file: pdfBase64,
      job_name: jobName
    }
  }),
  startUserIdJobName: (userId, jobName) => common_api_request.requestWithRetry({
    url: "/ai/interview/start/userid-job_name",
    method: "POST",
    data: {
      user_id: userId,
      job_name: jobName
    }
  }),
  startUserIdText: (userId, jobText) => common_api_request.requestWithRetry({
    url: "/ai/interview/start/userid-text",
    method: "POST",
    data: {
      user_id: userId,
      job_text: jobText
    }
  }),
  startTextJobName: (resumeText, jobName) => common_api_request.requestWithRetry({
    url: "/ai/interview/start/text-job_name",
    method: "POST",
    data: {
      resume_text: resumeText,
      job_name: jobName
    }
  }),
  transcribe: (sessionId, filePath) => {
    return common_vendor.index.uploadFile({
      url: getFullUrl(`/ai/interview/${sessionId}/transcribe`),
      filePath,
      name: "audio_file",
      header: { "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}` }
    });
  },
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
