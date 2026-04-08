"use strict";
const common_vendor = require("../vendor.js");
const common_api_request = require("./request.js");
const common_config = require("../config.js");
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
const getFullUrl = getApiUrl;
const getStaticUrl = (path) => {
  if (!path)
    return "";
  if (typeof path !== "string")
    return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseURL = common_config.config.staticURL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${baseURL}${normalizedPath}`;
  common_vendor.index.__f__("log", "at common/api/ai.js:27", "getStaticUrl 生成:", { original: path, baseURL, normalizedPath, fullUrl });
  return fullUrl;
};
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
        success: () => resolve({ type: "path", data: filePath }),
        fail: reject
      });
    } catch (e) {
      reject(e);
    }
  });
};
const uploadPdf = async (url, fileData, formData = {}) => {
  const fileResult = await base64ToFile(fileData.base64, fileData.name);
  return new Promise((resolve, reject) => {
    const apiUrl = getApiUrl(url);
    common_vendor.index.__f__("log", "at common/api/ai.js:145", "上传URL:", apiUrl);
    common_vendor.index.uploadFile({
      url: apiUrl,
      filePath: fileResult.data,
      name: "pdf_file",
      timeout: 12e4,
      formData,
      header: {
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
      },
      success: (res) => {
        try {
          common_vendor.index.getFileSystemManager().unlink({ filePath: fileResult.data });
        } catch (e) {
        }
        try {
          const data = JSON.parse(res.data);
          resolve(data);
        } catch (e) {
          resolve({ code: 200, data: res.data });
        }
      },
      fail: (err) => {
        try {
          common_vendor.index.getFileSystemManager().unlink({ filePath: fileResult.data });
        } catch (e) {
        }
        reject(err);
      }
    });
  });
};
const aiApi = {
  // 简历分析
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
  /**
   * PDF + 职位ID 分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobName - 职位ID
   */
  askByPdfJobName: (fileData, jobName) => {
    return uploadPdf("/ai/ask_by_pdf_job_name", fileData, { job_name: jobName });
  },
  /**
   * PDF + 职位文本 分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobText - 职位描述文本
   */
  askByPdfJobText: (fileData, jobText) => {
    return uploadPdf("/ai/ask_by_pdf_job_text", fileData, { job_text: jobText });
  },
  // 简历评估（用户ID）
  resumeEvaluation: () => common_api_request.requestWithRetry({
    url: "/ai/resume_evaluation",
    method: "GET"
  }),
  /**
   * PDF 简历评估
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   */
  resumeEvaluationByPdf: (fileData) => {
    return uploadPdf("/ai/resume_evaluation_text", fileData);
  },
  // 成功率分析
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
  /**
   * PDF + 职位ID 成功率分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobName - 职位ID
   */
  successRateByPdfJobName: (fileData, jobName) => {
    return uploadPdf("/ai/success_rate_pdf_job_name", fileData, { job_name: jobName });
  },
  /**
   * PDF + 职位文本 成功率分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobText - 职位描述文本
   */
  successRateByPdfJobText: (fileData, jobText) => {
    return uploadPdf("/ai/success_rate_pdf_job_text", fileData, { job_text: jobText });
  },
  // 大学生活规划
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
  /**
   * PDF + 职位ID 大学生活规划
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobName - 职位ID
   * @param {String} userGrade - 学生年级
   */
  universityPlanByPdfJobName: (fileData, jobName, userGrade) => {
    return uploadPdf("/ai/university_plan_pdf_job_name", fileData, {
      job_name: jobName,
      user_grade: userGrade
    });
  },
  /**
   * PDF + 职位文本 大学生活规划
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobText - 职位描述文本
   * @param {String} userGrade - 学生年级
   */
  universityPlanByPdfJobText: (fileData, jobText, userGrade) => {
    return uploadPdf("/ai/university_plan_pdf_job_text", fileData, {
      job_text: jobText,
      user_grade: userGrade
    });
  },
  // AI对话
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
  // 语音转文字 
  transcribe: (sessionId, filePath) => {
    return common_vendor.index.uploadFile({
      url: getFullUrl(`/ai/interview/${sessionId}/transcribe`),
      filePath,
      name: "audio_file",
      header: { "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}` }
    });
  },
  // 提交回答
  answer: (sessionId, userText, endInterview) => common_api_request.requestWithRetry({
    url: `/ai/interview/${sessionId}/answer`,
    method: "POST",
    data: { user_text: userText, end_interview: endInterview }
  }),
  // 获取报告
  getReport: (sessionId) => common_api_request.requestWithRetry({
    url: `/ai/interview/${sessionId}/report`,
    method: "GET"
  }),
  // 获取历史
  getHistory: (sessionId) => common_api_request.requestWithRetry({
    url: `/ai/interview/${sessionId}/history`,
    method: "GET"
  })
};
exports.aiApi = aiApi;
exports.getStaticUrl = getStaticUrl;
exports.interviewApi = interviewApi;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/api/ai.js.map
