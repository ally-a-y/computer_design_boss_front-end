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
        success: () => resolve({ type: 'path', data: filePath }),
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
      // H5 环境下返回 File 对象，但不使用 uni.uploadFile
      resolve({ type: 'file', data: file, blob: blob })
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
        success: () => resolve({ type: 'path', data: filePath }),
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
  const fileResult = await base64ToFile(fileData.base64, fileData.name)
  
  // #ifdef H5
  // H5 环境下，使用 fetch 或 XMLHttpRequest 上传
  return new Promise((resolve, reject) => {
    const uploadFormData = new FormData()
    uploadFormData.append('pdf_file', fileResult.data)
    
    // 添加额外的表单字段
    Object.keys(formData).forEach(key => {
      uploadFormData.append(key, formData[key])
    })
    
    fetch(getFullUrl(url), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      body: uploadFormData
    })
    .then(async response => {
      const text = await response.text()
      try {
        const data = JSON.parse(text)
        resolve(data)
      } catch (e) {
        resolve({ code: response.status, data: text })
      }
    })
    .catch(error => {
      console.error('上传失败:', error)
      reject(error)
    })
  })
  // #endif

  // #ifdef MP-WEIXIN || APP-PLUS
  // 小程序和App环境下，使用 uni.uploadFile
  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: getFullUrl(url),
      filePath: fileResult.data,  
      name: 'pdf_file',
      timeout: 120000,
      formData,
      header: { 
        'Authorization': `Bearer ${uni.getStorageSync('token')}` 
      },
      success: (res) => {
        // 清理临时文件
        try {
          uni.getFileSystemManager().unlink({ filePath: fileResult.data })
        } catch (e) {}
        
        try {
          const data = JSON.parse(res.data)
          resolve(data)
        } catch (e) {
          resolve({ code: 200, data: res.data })
        }
      },
      fail: (err) => {
        // 清理临时文件
        try {
          uni.getFileSystemManager().unlink({ filePath: fileResult.data })
        } catch (e) {}
        reject(err)
      }
    })
  })
  // #endif
}

// AI求职助手API
export const aiApi = {
  // 简历分析
  askByUserJobName: (jobName) => request({
    url: '/ai/ask_by_user_job_name',
    method: 'GET',
    params: { job_name: jobName }
  }),
  
  askByUserJobText: (jobText) => request({
    url: '/ai/ask_by_user_job_text',
    method: 'POST',
    data: { job_text: jobText }
  }),
  
  /**
   * PDF + 职位ID 分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobName - 职位ID
   */
  askByPdfJobName: (fileData, jobName) => {
    return uploadPdf('/ai/ask_by_pdf_job_name', fileData, { job_name: jobName })
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
  successRateByUserJobName: (jobName) => request({
    url: '/ai/success_rate_user_job_name',
    method: 'GET',
    params: { job_name: jobName }
  }),
  
  successRateByUserJobText: (jobText) => request({
    url: '/ai/success_rate_user_job_text',
    method: 'POST',
    data: { job_text: jobText }
  }),
  
  /**
   * PDF + 职位ID 成功率分析
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobName - 职位ID
   */
  successRateByPdfJobName: (fileData, jobName) => {
    return uploadPdf('/ai/success_rate_pdf_job_name', fileData, { job_name: jobName })
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
  universityPlanByUserJobName: (jobName, userGrade) => request({
    url: '/ai/university_plan_user_job_name',
    method: 'GET',
    params: { job_name: jobName, user_grade: userGrade }
  }),
  
  universityPlanByUserJobText: (jobText, userGrade) => request({
    url: '/ai/university_plan_user_job_text',
    method: 'POST',
    data: { job_text: jobText, user_grade: userGrade }
  }),
  
  /**
   * PDF + 职位ID 大学生活规划
   * @param {Object} fileData - { name, base64 } base64 编码的PDF
   * @param {String} jobName - 职位ID
   * @param {String} userGrade - 学生年级
   */
  universityPlanByPdfJobName: (fileData, jobName, userGrade) => {
    return uploadPdf('/ai/university_plan_pdf_job_name', fileData, { 
      job_name: jobName, 
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
  
  startPdfJobName: (pdfBase64, jobName) => request({
    url: '/ai/interview/start/pdf-job_name',
    method: 'POST',
    data: { 
      resume_file: pdfBase64, 
      job_name: jobName 
    }
  }),
  
  startUserIdJobName: (userId, jobName) => request({
    url: '/ai/interview/start/userid-job_name',
    method: 'POST',
    data: { 
      user_id: userId,      
      job_name: jobName 
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
  
  startTextJobName: (resumeText, jobName) => request({
    url: '/ai/interview/start/text-job_name',
    method: 'POST',
    data: { 
      resume_text: resumeText, 
      job_name: jobName 
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