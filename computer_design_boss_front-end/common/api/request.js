import config from '../config.js'

// 构建完整 URL 的辅助函数
const buildFullUrl = (path, params) => {
  if (!path) return config.baseURL
  
  // 如果已经是完整 URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  // 处理 baseURL 和 path 的 /api 重复问题
  let baseUrl = config.baseURL || 'http://localhost:5000/api'
  let finalPath = normalizedPath
  
  if (baseUrl.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    finalPath = normalizedPath.substring(4) 
  }
  
  let url = baseUrl + finalPath
  
  // 将查询参数转换为查询字符串（GET请求）
  if (params && typeof params === 'object' && Object.keys(params).length > 0) {
    const queryString = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }
  }
  
  return url
}

// 请求重试机制
const requestWithRetry = (options, retryCount = 3) => {
  return new Promise((resolve, reject) => {
    const attemptRequest = (attempt) => {
      const isGet = (options.method || 'GET').toUpperCase() === 'GET'
     
      const queryParams = isGet 
        ? { ...(options.params || {}), ...(options.data || {}) }
        : (options.params || {})
      
      const fullUrl = buildFullUrl(options.url, queryParams)
      const urlWithTimestamp = fullUrl + (fullUrl.includes('?') ? '&' : '?') + 't=' + Date.now()
      
      // 构造请求配置
      const requestConfig = {
        url: urlWithTimestamp,
        method: options.method || 'GET',
        timeout: 60000,
        sslVerify: false,
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${uni.getStorageSync('token') || ''}`,
          'Cache-Control': 'no-cache',
          ...options.header
        }
      }
      
      // 只有非 GET 请求才设置 data 字段
      if (!isGet && options.data) {
        requestConfig.data = options.data
      }
      
      uni.request({
        ...requestConfig,
        success: (res) => {
          // 只在调试模式下显示响应日志
          const debugMode = false // 可以在这里设置为true来开启调试
          if (debugMode) {
            console.log('【响应】', res.statusCode, res.data)
          }
          
          if (res.statusCode === 200) {
            const data = res.data
            
            if (data && typeof data === 'object' && 'code' in data) {
              if (data.code === 200) {
                resolve(data.data !== undefined ? data.data : data)
              } else {
                reject(new Error(data.message || `请求失败: ${data.code}`))
              }
            } else {
              resolve(data)
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || ''}`))
          }
        },
        fail: (err) => {
          console.error(`【请求失败】`, err)
          
          if (attempt < retryCount - 1) {
            const delay = Math.pow(2, attempt) * 1000
            setTimeout(() => attemptRequest(attempt + 1), delay)
          } else {
            reject(new Error(err.errMsg || '网络请求失败'))
          }
        }
      })
    }
    
    attemptRequest(0)
  })
}

export default requestWithRetry