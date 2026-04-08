import config from '../config.js'

// 请求缓存
const requestCache = new Map()
const CACHE_EXPIRY = 5 * 60 * 1000 // 5分钟缓存

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

// 生成缓存键
const generateCacheKey = (url, params) => {
  const fullUrl = buildFullUrl(url, params)
  return fullUrl
}

// 检查缓存是否有效
const getCachedData = (cacheKey) => {
  const cached = requestCache.get(cacheKey)
  if (cached) {
    const { data, timestamp } = cached
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data
    }
    // 缓存过期，删除
    requestCache.delete(cacheKey)
  }
  return null
}

// 设置缓存
const setCachedData = (cacheKey, data) => {
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })
}

// 请求重试机制
const requestWithRetry = (options, retryCount = 3) => {
  return new Promise((resolve, reject) => {
    const isGet = (options.method || 'GET').toUpperCase() === 'GET'
    
    // 检查缓存
    if (isGet && !options.noCache) {
      const cacheKey = generateCacheKey(options.url, options.params || options.data)
      const cachedData = getCachedData(cacheKey)
      if (cachedData) {
        return resolve(cachedData)
      }
    }
    
    const attemptRequest = (attempt) => {
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
          'Cache-Control': 'no-cache',
          ...options.header
        }
      }
      
      // 只有在 token 存在时才设置 Authorization 请求头
      const token = uni.getStorageSync('token')
      if (token) {
        requestConfig.header['Authorization'] = `Bearer ${token}`
      }
      
      // 只有非 GET 请求才设置 data 字段
      if (!isGet && options.data) {
        requestConfig.data = options.data
      }
      
      uni.request({
        ...requestConfig,
        success: (res) => {
          // 只在调试模式下显示响应日志
          const debugMode = false // 关闭调试模式提高性能
          if (debugMode) {
            console.log('【响应】', res.statusCode, res.data)
          }
          
          if (res.statusCode === 200) {
            const data = res.data
            
            if (data && typeof data === 'object' && 'code' in data) {
              if (data.code === 200) {
                const result = data.data !== undefined ? data.data : data
                // 缓存GET请求结果
                if (isGet && !options.noCache) {
                  const cacheKey = generateCacheKey(options.url, options.params || options.data)
                  setCachedData(cacheKey, result)
                }
                resolve(result)
              } else {
                reject(new Error(data.message || `请求失败: ${data.code}`))
              }
            } else {
              // 缓存GET请求结果
              if (isGet && !options.noCache) {
                const cacheKey = generateCacheKey(options.url, options.params || options.data)
                setCachedData(cacheKey, data)
              }
              resolve(data)
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || ''}`))
          }
        },
        fail: (err) => {
          const debugMode = false // 关闭调试模式提高性能
          if (debugMode) {
            console.error(`【请求失败】`, err)
          }
          
          if (attempt < retryCount - 1) {
            const delay = Math.pow(2, attempt) * 500 // 减少重试延迟
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

// 批量请求函数
export const batchRequest = async (requests) => {
  if (!Array.isArray(requests)) {
    throw new Error('requests must be an array')
  }
  
  try {
    const results = await Promise.all(
      requests.map(req => requestWithRetry(req))
    )
    return results
  } catch (error) {
    console.error('批量请求失败:', error)
    throw error
  }
}

// 清除缓存
export const clearCache = (url, params) => {
  if (url) {
    const cacheKey = generateCacheKey(url, params)
    requestCache.delete(cacheKey)
  } else {
    requestCache.clear()
  }
}

export default requestWithRetry