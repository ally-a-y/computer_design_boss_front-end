// 论坛相关工具函数

/**
 * 格式化时间戳为相对时间
 * @param {string|number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串
 */
export function formatTimeAgo(timestamp) {
  if (!timestamp) return ''
  
  const now = new Date().getTime()
  const time = new Date(timestamp).getTime()
  const diff = now - time
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute)
    return `${minutes}分钟前`
  } else if (diff < day) {
    const hours = Math.floor(diff / hour)
    return `${hours}小时前`
  } else if (diff < week) {
    const days = Math.floor(diff / day)
    return `${days}天前`
  } else if (diff < month) {
    const weeks = Math.floor(diff / week)
    return `${weeks}周前`
  } else if (diff < year) {
    const months = Math.floor(diff / month)
    return `${months}个月前`
  } else {
    const years = Math.floor(diff / year)
    return `${years}年前`
  }
}

/**
 * 格式化富文本内容
 * @param {string} content - 原始内容
 * @returns {string} 格式化后的富文本
 */
export function formatRichText(content) {
  if (!content) return ''
  
  // 转义HTML特殊字符
  content = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
  
  // 处理代码块
  content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  
  // 处理行内代码
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // 处理粗体
  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  
  // 处理斜体
  content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  
  // 处理链接
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
  
  // 处理换行
  content = content.replace(/\n/g, '<br>')
  
  return content
}

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀字符串
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
  if (!text) return ''
  if (text.length <= maxLength) return text
  
  return text.substring(0, maxLength) + suffix
}

/**
 * 提取文本中的图片URL
 * @param {string} content - 文本内容
 * @returns {string[]} 图片URL数组
 */
export function extractImages(content) {
  if (!content) return []
  
  const imgRegex = /!\[.*?\]\((.*?)\)/g
  const images = []
  let match
  
  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1])
  }
  
  return images
}

/**
 * 提取文本中的@用户
 * @param {string} content - 文本内容
 * @returns {string[]} @用户名数组
 */
export function extractMentions(content) {
  if (!content) return []
  
  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1])
  }
  
  return [...new Set(mentions)] // 去重
}

/**
 * 生成帖子摘要
 * @param {string} content - 帖子内容
 * @param {number} maxLength - 最大长度
 * @returns {string} 帖子摘要
 */
export function generateSummary(content, maxLength = 100) {
  if (!content) return ''
  
  // 移除Markdown标记
  let plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/\*\*[^*]*\*\*/g, '') // 移除粗体
    .replace(/\*[^*]*\*/g, '') // 移除斜体
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 提取链接文本
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 移除图片
    .replace(/\n/g, ' ') // 替换换行为空格
    .replace(/\s+/g, ' ') // 合并多余空格
    .trim()
  
  return truncateText(plainText, maxLength)
}

/**
 * 验证帖子内容
 * @param {Object} post - 帖子数据
 * @returns {Object} 验证结果
 */
export function validatePost(post) {
  const errors = []
  
  if (!post.title || post.title.trim().length === 0) {
    errors.push('标题不能为空')
  } else if (post.title.length > 100) {
    errors.push('标题长度不能超过100字符')
  }
  
  if (!post.content || post.content.trim().length === 0) {
    errors.push('内容不能为空')
  } else if (post.content.length < 10) {
    errors.push('内容长度不能少于10字符')
  } else if (post.content.length > 10000) {
    errors.push('内容长度不能超过10000字符')
  }
  
  if (!post.category_id) {
    errors.push('请选择分类')
  }
  
  if (post.tags && post.tags.length > 5) {
    errors.push('标签数量不能超过5个')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 验证回复内容
 * @param {string} content - 回复内容
 * @returns {Object} 验证结果
 */
export function validateReply(content) {
  const errors = []
  
  if (!content || content.trim().length === 0) {
    errors.push('回复内容不能为空')
  } else if (content.length < 2) {
    errors.push('回复内容长度不能少于2字符')
  } else if (content.length > 2000) {
    errors.push('回复内容长度不能超过2000字符')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 检测敏感词
 * @param {string} text - 待检测文本
 * @param {string[]} sensitiveWords - 敏感词列表
 * @returns {Object} 检测结果
 */
export function detectSensitiveWords(text, sensitiveWords = []) {
  const foundWords = []
  
  if (!text || sensitiveWords.length === 0) {
    return {
      hasSensitiveWords: false,
      foundWords: []
    }
  }
  
  const lowerText = text.toLowerCase()
  
  sensitiveWords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      foundWords.push(word)
    }
  })
  
  return {
    hasSensitiveWords: foundWords.length > 0,
    foundWords
  }
}

/**
 * 计算用户等级
 * @param {number} postCount - 发帖数
 * @param {number} replyCount - 回复数
 * @param {number} likeCount - 获赞数
 * @returns {number} 用户等级
 */
export function calculateUserLevel(postCount = 0, replyCount = 0, likeCount = 0) {
  const experience = postCount * 10 + replyCount * 2 + likeCount * 1
  
  if (experience < 50) return 1
  if (experience < 150) return 2
  if (experience < 300) return 3
  if (experience < 500) return 4
  if (experience < 800) return 5
  if (experience < 1200) return 6
  if (experience < 1700) return 7
  if (experience < 2300) return 8
  if (experience < 3000) return 9
  return 10
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 检测是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export function isMobile() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
}

/**
 * 检测是否为微信环境
 * @returns {boolean} 是否为微信环境
 */
export function isWeChat() {
  const userAgent = navigator.userAgent.toLowerCase()
  return userAgent.indexOf('micromessenger') !== -1
}

export default {
  formatTimeAgo,
  formatRichText,
  truncateText,
  extractImages,
  extractMentions,
  generateSummary,
  validatePost,
  validateReply,
  detectSensitiveWords,
  calculateUserLevel,
  debounce,
  throttle,
  generateUniqueId,
  deepClone,
  formatFileSize,
  isMobile,
  isWeChat
}