import request from './request.js'
import config from '../config.js'

// 用于 API 请求
export const getApiUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const baseURL = config.baseURL || 'http://39.106.72.110/api'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${baseURL}${normalizedPath}`
}
export const getFullUrl = getApiUrl

// 用于静态资源
export const getStaticUrl = (path) => {
  if (!path) return ''
  if (typeof path !== 'string') return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const baseURL = config.staticURL || 'http://39.106.72.110'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const fullUrl = `${baseURL}${normalizedPath}`
  console.log('getStaticUrl 生成:', { original: path, baseURL, normalizedPath, fullUrl })
  return fullUrl
}

/**
 * 将 base64 数据转换为临时文件路径（微信小程序/App）
 * 或将 base64 转换为 Blob（H5）
 */
const base64ToFile = (base64Data, fileName = 'resume.pdf') => {
  return new Promise((resolve, reject) => {

    // ==================== 微信小程序 ====================
    // #ifdef MP-WEIXIN
    console.log('【base64ToFile】MP-WEIXIN 开始执行')
    try {
      const fs = wx.getFileSystemManager()
      const filePath = `${wx.env.USER_DATA_PATH}/${Date.now()}_${fileName}`

      let base64 = base64Data
      if (base64.includes(',')) {
        base64 = base64.split(',')[1]
      }
      base64 = base64.replace(/[\s\r\n]/g, '')

      fs.writeFile({
        filePath: filePath,
        data: base64,
        encoding: 'base64',
        success: () => {
          console.log('【base64ToFile】微信文件写入成功:', filePath)
          resolve({ type: 'path', data: filePath })
        },
        fail: (err) => {
          console.error('【base64ToFile】微信文件写入失败:', err)
          reject(new Error('微信文件写入失败: ' + err.errMsg))
        }
      })
    } catch (e) {
      console.error('【base64ToFile】微信小程序异常:', e)
      reject(e)
    }
    // #endif

    // ==================== H5 平台 ====================
    // #ifdef H5
    console.log('【base64ToFile】H5 开始执行')
    try {
      let base64 = base64Data
      if (base64.includes(',')) {
        base64 = base64.split(',')[1]
      }
      base64 = base64.replace(/[\s\r\n]/g, '')

      const padding = base64.length % 4
      if (padding) {
        base64 += '='.repeat(4 - padding)
      }

      const byteCharacters = atob(base64)
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })
      const filePath = URL.createObjectURL(blob)

      console.log('【base64ToFile】H5 Blob 创建成功:', filePath)
      resolve({ type: 'blob', data: filePath, blob: blob, fileName: fileName })

    } catch (e) {
      console.error('【base64ToFile】H5 异常:', e)
      reject(e)
    }
    // #endif

    // ==================== APP-PLUS (Android/iOS) 修复版 ====================
    // #ifdef APP-PLUS
    console.log('【base64ToFile】APP-PLUS 开始执行')
    
    try {
      let base64 = base64Data
      if (base64.includes(',')) {
        base64 = base64.split(',')[1]
      }
      base64 = base64.replace(/[\s\r\n]/g, '')
    
      const padding = base64.length % 4
      if (padding) {
        base64 += '='.repeat(4 - padding)
      }
    
      console.log('【base64ToFile】清理后 base64 长度:', base64.length)
    
      // 检查 atob 函数是否存在
      if (typeof atob === 'undefined') {
        console.error('【base64ToFile】atob 函数不存在，使用替代方案')
        // 使用 Base64 上传方案作为备用
        throw new Error('atob function not available')
      }
    
      // 使用 plus.io 创建临时文件
      const timestamp = Date.now()
      const actualFileName = `${timestamp}_${fileName}`
      const tempPath = `_doc/temp/${actualFileName}`
      
      console.log('【base64ToFile】准备创建临时文件:', tempPath)
      
      // 确保 temp 目录存在
      plus.io.resolveLocalFileSystemURL('_doc/', (docEntry) => {
        console.log('【base64ToFile】访问 _doc 目录成功')
        docEntry.getDirectory('temp', { create: true }, (tempDir) => {
          console.log('【base64ToFile】temp 目录就绪')
          tempDir.getFile(actualFileName, { create: true }, (fileEntry) => {
            console.log('【base64ToFile】文件创建成功:', fileEntry.fullPath)
            
            try {
              // 使用 JS 方式解码 base64 并写入文件
              console.log('【base64ToFile】开始解码 base64...')
              const binaryString = atob(base64)
              console.log('【base64ToFile】base64 解码成功，长度:', binaryString.length)
              
              const bytes = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }
              console.log('【base64ToFile】字节数组创建成功')
              
              fileEntry.createWriter((writer) => {
                console.log('【base64ToFile】Writer 创建成功')
                writer.onwrite = () => {
                  console.log('【base64ToFile】文件写入成功:', fileEntry.fullPath)
                  resolve({ type: 'path', data: fileEntry.fullPath })
                }
                
                writer.onerror = (e) => {
                  console.error('【base64ToFile】写入失败:', e)
                  reject(new Error('文件写入失败: ' + (e.message || '未知错误')))
                }
                
                console.log('【base64ToFile】开始写入文件...')
                writer.write(bytes.buffer)
              }, (err) => {
                console.error('【base64ToFile】创建 Writer 失败:', err)
                reject(new Error('创建 Writer 失败: ' + (err.message || '未知错误')))
              })
            } catch (decodeError) {
              console.error('【base64ToFile】解码或写入过程异常:', decodeError)
              reject(new Error('文件处理失败: ' + (decodeError.message || '未知错误')))
            }
          }, (err) => {
            console.error('【base64ToFile】创建文件失败:', err)
            reject(new Error('创建文件失败: ' + (err.message || '未知错误')))
          })
        }, (err) => {
          console.error('【base64ToFile】创建目录失败:', err)
          reject(new Error('创建目录失败: ' + (err.message || '未知错误')))
        })
      }, (err) => {
        console.error('【base64ToFile】请求文件系统失败:', err)
        reject(new Error('请求文件系统失败: ' + (err.message || '未知错误')))
      })
    
    } catch (e) {
      console.error('【base64ToFile】APP-PLUS 异常:', e)
      console.error('【base64ToFile】错误堆栈:', e?.stack)
      reject(e)
    }
    // #endif
  })
}

/**
 * 使用 Base64 编码方式上传 PDF（优先方案）
 * @param {String} url - 上传接口地址
 * @param {Object} fileData - 文件数据 { name, base64, type }
 * @param {Object} formData - 额外的表单数据
 */
const uploadPdfByBase64 = async (url, fileData, formData = {}) => {
  const apiUrl = getApiUrl(url)
  
  console.log('【uploadPdfByBase64】开始执行，目标URL:', apiUrl)
  
  // 清理 base64 数据
  let base64 = fileData.base64
  if (!base64) {
    throw new Error('缺少 base64 数据')
  }
  if (base64.includes(',')) {
    base64 = base64.split(',')[1]
  }
  base64 = base64.replace(/[\s\r\n]/g, '')
  
  // 补充 padding
  const padding = base64.length % 4
  if (padding) {
    base64 += '='.repeat(4 - padding)
  }

  // 关键修复：后端期望的字段名是 pdf_base64
  const requestData = {
    pdf_base64: base64,
    ...formData
  }

  console.log('【uploadPdfByBase64】请求数据准备完成')
  console.log('【uploadPdfByBase64】请求字段:', Object.keys(requestData))
  console.log('【uploadPdfByBase64】pdf_base64 长度:', base64.length)
  console.log('【uploadPdfByBase64】pdf_base64 前50字符:', base64.substring(0, 50))

  try {
    console.log('【uploadPdfByBase64】开始发送请求...')
    const response = await request({
      url: url,
      method: 'POST',
      data: requestData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 120000,
      noCache: true // 确保不使用缓存
    })
    console.log('【uploadPdfByBase64】请求成功，响应:', response)
    return response
  } catch (error) {
    console.error('【uploadPdfByBase64】请求失败:', error)
    console.error('【uploadPdfByBase64】错误堆栈:', error?.stack)
    throw error
  }
}

/**
 * 使用文件方式上传 PDF（备用方案）
 * @param {String} url - 上传接口地址
 * @param {Object} fileData - 文件数据 { name, base64, type }
 * @param {Object} formData - 额外的表单数据
 */
const uploadPdfByFile = async (url, fileData, formData = {}) => {
  const fileResult = await base64ToFile(fileData.base64, fileData.name)
  
  // #ifdef H5
  return new Promise((resolve, reject) => {
    const uploadFormData = new FormData()
    uploadFormData.append('pdf_file', fileResult.blob, fileData.name)

    Object.keys(formData).forEach(key => {
      uploadFormData.append(key, formData[key])
    })

    const apiUrl = getApiUrl(url)
    console.log('【uploadPdfByFile H5】使用文件方式上传:', apiUrl)

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      body: uploadFormData
    })
    .then(async response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const text = await response.text()
      try {
        const data = JSON.parse(text)
        resolve(data)
      } catch (e) {
        resolve({ code: response.status, data: text })
      }
    })
    .catch(error => {
      console.error('【uploadPdfByFile H5】上传失败:', error)
      reject(error)
    })
  })
  // #endif

  // #ifdef MP-WEIXIN 
  return new Promise((resolve, reject) => {
    const apiUrl = getApiUrl(url)
    console.log('【uploadPdfByFile 微信小程序】使用文件方式上传:', apiUrl)

    uni.uploadFile({
      url: apiUrl,
      filePath: fileResult.data,  
      name: 'pdf_file',
      timeout: 120000,
      formData,
      header: { 
        'Authorization': `Bearer ${uni.getStorageSync('token')}` 
      },
      success: (res) => {
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
        try {
          uni.getFileSystemManager().unlink({ filePath: fileResult.data })
        } catch (e) {}
        reject(err)
      }
    })
  })
  // #endif

  // #ifdef APP-PLUS
  return new Promise((resolve, reject) => {
    const apiUrl = getApiUrl(url)
    console.log('【uploadPdfByFile APP-PLUS】使用文件方式上传:', apiUrl)
    console.log('【uploadPdfByFile APP-PLUS】上传文件路径:', fileResult.data)
    console.log('【uploadPdfByFile APP-PLUS】formData:', formData)
    console.log('【uploadPdfByFile APP-PLUS】token:', uni.getStorageSync('token'))

    // 检查文件是否存在
    plus.io.resolveLocalFileSystemURL(fileResult.data, (entry) => {
      console.log('【uploadPdfByFile APP-PLUS】文件存在:', entry.name, entry.size)
      
      uni.uploadFile({
        url: apiUrl,
        filePath: fileResult.data,
        name: 'pdf_file',
        timeout: 120000,
        formData,
        header: { 
          'Authorization': `Bearer ${uni.getStorageSync('token')}` 
        },
        success: (res) => {
          console.log('【uploadPdfByFile APP-PLUS】上传成功，状态码:', res.statusCode)
          console.log('【uploadPdfByFile APP-PLUS】响应内容:', res.data)
          try {
            entry.remove(() => {
              console.log('【uploadPdfByFile APP-PLUS】临时文件已清理')
            }, (e) => {
              console.log('【uploadPdfByFile APP-PLUS】清理临时文件失败:', e)
            })
          } catch (e) {
            console.log('【uploadPdfByFile APP-PLUS】清理临时文件异常:', e)
          }

          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch (e) {
            resolve({ code: res.statusCode, data: res.data })
          }
        },
        fail: (err) => {
          console.error('【uploadPdfByFile APP-PLUS】上传失败:', err)
          console.error('【uploadPdfByFile APP-PLUS】错误详细信息:', err.errMsg)
          console.error('【uploadPdfByFile APP-PLUS】错误代码:', err.errCode)
          try {
            entry.remove(() => {}, () => {})
          } catch (e) {}
          reject(err)
        }
      })
    }, (err) => {
      console.error('【uploadPdfByFile APP-PLUS】文件不存在:', err)
      reject(new Error('文件不存在: ' + err.message))
    })
  })
  // #endif
}

/**
 * 统一的 PDF 上传方法（优先使用文件上传方式）
 * @param {String} url - 上传接口地址
 * @param {Object} fileData - 文件数据 { name, base64, type }
 * @param {Object} formData - 额外的表单数据
 */
const uploadPdf = async (url, fileData, formData = {}) => {
  // 优先使用文件上传方式，根据后端要求
  try {
    console.log('【uploadPdf】优先使用文件方式上传...')
    const result = await uploadPdfByFile(url, fileData, formData)
    console.log('【uploadPdf】文件方式上传成功')
    return result
  } catch (fileError) {
    console.error('【uploadPdf】文件方式上传失败:', fileError)
    // 降级到 Base64 上传方式
    try {
      console.log('【uploadPdf】降级到 Base64 方式上传...')
      const result = await uploadPdfByBase64(url, fileData, formData)
      console.log('【uploadPdf】Base64 方式上传成功')
      return result
    } catch (base64Error) {
      console.error('【uploadPdf】Base64 方式上传也失败:', base64Error)
      throw base64Error
    }
  }
}

// AI求职助手API
export const aiApi = {
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

  askByPdfJobName: (fileData, jobName) => {
    return uploadPdf('/ai/ask_by_pdf_job_name', fileData, { job_name: jobName })
  },

  askByPdfJobText: (fileData, jobText) => {
    return uploadPdf('/ai/ask_by_pdf_job_text', fileData, { job_text: jobText })
  },

  resumeEvaluation: () => request({
    url: '/ai/resume_evaluation',
    method: 'GET'
  }),

  resumeEvaluationByPdf: (fileData) => {
    return uploadPdf('/ai/resume_evaluation_text', fileData)
  },

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

  successRateByPdfJobName: (fileData, jobName) => {
    return uploadPdf('/ai/success_rate_pdf_job_name', fileData, { job_name: jobName })
  },

  successRateByPdfJobText: (fileData, jobText) => {
    return uploadPdf('/ai/success_rate_pdf_job_text', fileData, { job_text: jobText })
  },

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

  universityPlanByPdfJobName: (fileData, jobName, userGrade) => {
    return uploadPdf('/ai/university_plan_pdf_job_name', fileData, { 
      job_name: jobName, 
      user_grade: userGrade 
    })
  },

  universityPlanByPdfJobText: (fileData, jobText, userGrade) => {
    return uploadPdf('/ai/university_plan_pdf_job_text', fileData, { 
      job_text: jobText, 
      user_grade: userGrade 
    })
  },

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

  transcribe: (sessionId, filePath) => {
    return uni.uploadFile({
      url: getFullUrl(`/ai/interview/${sessionId}/transcribe`),
      filePath,
      name: 'audio_file',
      header: { 'Authorization': `Bearer ${uni.getStorageSync('token')}` }
    })
  },

  answer: (sessionId, userText, endInterview) => request({
    url: `/ai/interview/${sessionId}/answer`,
    method: 'POST',
    data: { user_text: userText, end_interview: endInterview }
  }),

  getReport: (sessionId) => request({
    url: `/ai/interview/${sessionId}/report`,
    method: 'GET'
  }),

  getHistory: (sessionId) => request({
    url: `/ai/interview/${sessionId}/history`,
    method: 'GET'
  })
}

export default { ai: aiApi, interview: interviewApi }