// 开发环境配置
const config = {
  development: {
    baseURL: 'http://39.106.72.110/api',      
    staticURL: 'http://39.106.72.110',         
    // 添加兼容命名
    apiBase: 'http://39.106.72.110/api',
    fileBase: 'http://39.106.72.110'
  },
  production: {
    baseURL: 'http://39.106.72.110/api',
    staticURL: 'http://39.106.72.110',
    apiBase: 'http://39.106.72.110/api',
    fileBase: 'http://39.106.72.110'
  }
}

// 根据环境选择配置
const env = process.env.NODE_ENV || 'development'
export default config[env]