import request from './request.js'
import config from '../config.js'

// 用于 API 请求
export const getApiUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const baseURL = config.baseURL || 'http://localhost:5000/api'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseURL}${normalizedPath}`
}

// 用于静态资源
export const getStaticUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const baseURL = config.staticURL || 'http://localhost:5000'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseURL}${normalizedPath}`
}
export const getFullUrl = getApiUrl

/**
 * 将 base64 数据转换为临时文件路径（微信小程序）
 * 或将 base64 转换为 Blob（H5）
 */
const base64ToFile = (base64Data, fileName = 'resume.pdf') => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    const fs = uni.getFileSystemManager()
    const filePath = `${uni.env.USER_DATA_PATH}/${fileName}`
    
    try {
      const base64 = base64Data.replace(/^data:.*;base64,/, '')
      
      fs.writeFile({
        filePath,
        data: base64,
        encoding: 'base64',
        success: () => resolve(filePath),
        fail: reject
      })
    } catch (e) {
      reject(e)
    }
    // #endif

    // #ifdef H5
    try {
      const byteCharacters = atob(base64Data.replace(/^data:.*;base64,/, ''))
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const file = new File([blob], fileName, { type: 'application/pdf' })
      resolve(file)
    } catch (e) {
      reject(e)
    }
    // #endif

    // #ifdef APP-PLUS
    const fs = uni.getFileSystemManager()
    const filePath = `${uni.env.USER_DATA_PATH}/${fileName}`
    
    try {
      const base64 = base64Data.replace(/^data:.*;base64,/, '')
      fs.writeFile({
        filePath,
        data: base64,
        encoding: 'base64',
        success: () => resolve(filePath),
        fail: reject
      })
    } catch (e) {
      reject(e)
    }
    // #endif
  })
}

/**
 * 统一的 PDF 上传方法
 * @param {String} url - 上传接口地址
 * @param {Object} fileData - 文件数据 { name, base64, type }
 * @param {Object} formData - 额外的表单数据
 */
const uploadPdf = async (url, fileData, formData = {}) => {
  const tempPath = await base64ToFile(fileData.base64, fileData.name)
  
  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: getFullUrl(url),
      filePath: tempPath,
      name: 'pdf_file',
	  timeout: 120000,
      formData,
      header: { 
        'Authorization': `Bearer ${uni.getStorageSync('token')}` 
      },
      success: (res) => {
        // #ifdef MP-WEIXIN || APP-PLUS
        try {
          uni.getFileSystemManager().unlink({ filePath: tempPath })
        } catch (e) {}
        // #endif
        
        try {
          const data = JSON.parse(res.data)
          resolve(data)
        } catch (e) {
          resolve({ code: 200, data: res.data })
        }
      },
      fail: reject
    })
  })
}

// AI求职助手API
export const aiApi = {
  // 简历分析
  askByUserJobId: (jobId) => request({
    url: '/ai/ask_by_user_job_id',
    method: 'GET',
    params: { job_id: jobId }
  }),
  
  askByUserJobText: (jobText) => request({
    url: '/ai/ask_by_user_job_text',
    method: 'POST',
    data: { job_text: jobText }
  }),
  
  /**
   * PDF + 职位ID 分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobId - 职位ID
   */
  askByPdfJobId: (fileData, jobId) => {
    return uploadPdf('/ai/ask_by_pdf_job_id', fileData, { job_id: jobId })
  },
  
  /**
   * PDF + 职位文本 分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobText - 职位描述文本
   */
  askByPdfJobText: (fileData, jobText) => {
    return uploadPdf('/ai/ask_by_pdf_job_text', fileData, { job_text: jobText })
  },
  
  // 简历评估（用户ID）
  resumeEvaluation: () => request({
    url: '/ai/resume_evaluation',
    method: 'GET'
  }),
  
  /**
   * PDF 简历评估
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   */
  resumeEvaluationByPdf: (fileData) => {
    return uploadPdf('/ai/resume_evaluation_text', fileData)
  },
  
  // 成功率分析
  successRateByUserJobId: (jobId) => request({
    url: '/ai/success_rate_user_job_id',
    method: 'GET',
    params: { job_id: jobId }
  }),
  
  successRateByUserJobText: (jobText) => request({
    url: '/ai/success_rate_user_job_text',
    method: 'POST',
    data: { job_text: jobText }
  }),
  
  /**
   * PDF + 职位ID 成功率分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobId - 职位ID
   */
  successRateByPdfJobId: (fileData, jobId) => {
    return uploadPdf('/ai/success_rate_pdf_job_id', fileData, { job_id: jobId })
  },
  
  /**
   * PDF + 职位文本 成功率分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobText - 职位描述文本
   */
  successRateByPdfJobText: (fileData, jobText) => {
    return uploadPdf('/ai/success_rate_pdf_job_text', fileData, { job_text: jobText })
  },
  
  // 大学生活规划
  universityPlanByUserJobId: (jobId, userGrade) => request({
    url: '/ai/university_plan_user_job_id',
    method: 'GET',
    params: { job_id: jobId, user_grade: userGrade }
  }),
  
  universityPlanByUserJobText: (jobText, userGrade) => request({
    url: '/ai/university_plan_user_job_text',
    method: 'POST',
    data: { job_text: jobText, user_grade: userGrade }
  }),
  
  /**
   * PDF + 职位ID 大学生活规划
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobId - 职位ID
   * @param {String} userGrade - 学生年级
   */
  universityPlanByPdfJobId: (fileData, jobId, userGrade) => {
    return uploadPdf('/ai/university_plan_pdf_job_id', fileData, { 
      job_id: jobId, 
      user_grade: userGrade 
    })
  },
  
  /**
   * PDF + 职位文本 大学生活规划
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobText - 职位描述文本
   * @param {String} userGrade - 学生年级
   */
  universityPlanByPdfJobText: (fileData, jobText, userGrade) => {
    return uploadPdf('/ai/university_plan_pdf_job_text', fileData, { 
      job_text: jobText, 
      user_grade: userGrade 
    })
  },
  
  // AI对话
  chat: (message) => request({
    url: '/ai/chat',
    method: 'POST',
    data: { message }
  })
}

// 模拟面试API 
export const interviewApi = {
  startText: (resumeText, jobText) => request({
    url: '/ai/interview/start/text',
    method: 'POST',
    data: { 
      resume_text: resumeText, 
      job_text: jobText 
    }
  }),
  
  startPdfText: (pdfBase64, jobText) => request({
    url: '/ai/interview/start/pdf-text',
    method: 'POST',
    data: { 
      resume_file: pdfBase64, 
      job_text: jobText 
    }
  }),
  
  startPdfJobId: (pdfBase64, jobId) => request({
    url: '/ai/interview/start/pdf-jobid',
    method: 'POST',
    data: { 
      resume_file: pdfBase64, 
      job_id: jobId 
    }
  }),
  
  startUserIdJobId: (userId, jobId) => request({
    url: '/ai/interview/start/userid-jobid',
    method: 'POST',
    data: { 
      user_id: userId,      
      job_id: jobId 
    }
  }),
  
  startUserIdText: (userId, jobText) => request({
    url: '/ai/interview/start/userid-text',
    method: 'POST',
    data: { 
      user_id: userId,      
      job_text: jobText     
    }
  }),
  
  startTextJobId: (resumeText, jobId) => request({
    url: '/ai/interview/start/text-jobid',
    method: 'POST',
    data: { 
      resume_text: resumeText, 
      job_id: jobId 
    }
  }),
  
  // 语音转文字 
  transcribe: (sessionId, filePath) => {
    return uni.uploadFile({
      url: getFullUrl(`/ai/interview/${sessionId}/transcribe`),
      filePath,
      name: 'audio_file',
      header: { 'Authorization': `Bearer ${uni.getStorageSync('token')}` }
    })
  },
  
  // 提交回答
  answer: (sessionId, userText, endInterview) => request({
    url: `/ai/interview/${sessionId}/answer`,
    method: 'POST',
    data: { user_text: userText, end_interview: endInterview }
  }),
  
  // 获取报告
  getReport: (sessionId) => request({
    url: `/ai/interview/${sessionId}/report`,
    method: 'GET'
  }),
  
  // 获取历史
  getHistory: (sessionId) => request({
    url: `/ai/interview/${sessionId}/history`,
    method: 'GET'
  })
}

export default { ai: aiApi, interview: interviewApi }