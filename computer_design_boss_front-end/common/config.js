// 开发环境配置
const config = {
  development: {
    baseURL: 'http://localhost:5000/api',      
    staticURL: 'http://localhost:5000',         
    // 添加兼容命名
    apiBase: 'http://localhost:5000/api',
    fileBase: 'http://localhost:5000'
  },
  production: {
    baseURL: 'https://api.yourdomain.com/api',
    staticURL: 'https://yourdomain.com',
    apiBase: 'https://api.yourdomain.com/api',
    fileBase: 'https://yourdomain.com'
  }
}

// 根据环境选择配置
const env = process.env.NODE_ENV || 'development'
export default config[env]