/**
 * 微信小程序主题管理工具
 * 简化版本，专为微信小程序优化
 */

const THEME_MODE_KEY = 'themeMode'
const CURRENT_THEME_KEY = 'currentTheme'

class ThemeManager {
  constructor() {
    this.currentTheme = 'light'
    this.themeMode = 'system'
    this.init()
  }

  /**
   * 初始化主题管理器
   */
  init() {
    // 从存储中加载主题设置
    this.themeMode = uni.getStorageSync(THEME_MODE_KEY) || 'system'
    this.currentTheme = uni.getStorageSync(CURRENT_THEME_KEY) || 'light'
    
    // 如果是系统模式，检测系统主题
    if (this.themeMode === 'system') {
      this.detectSystemTheme()
    }
  }

  /**
   * 检测系统主题（微信小程序支持）
   */
  detectSystemTheme() {
    try {
      const systemInfo = uni.getSystemInfoSync()
      const systemTheme = systemInfo.theme || 'light'
      this.setTheme(systemTheme === 'dark' ? 'dark' : 'light')
    } catch (error) {
      console.warn('无法获取系统主题，使用默认浅色主题')
      this.setTheme('light')
    }
  }

  /**
   * 设置主题模式
   * @param {string} mode - 主题模式: light, dark, system
   */
  setThemeMode(mode) {
    if (!['light', 'dark', 'system'].includes(mode)) {
      console.warn('Invalid theme mode:', mode)
      return
    }
    
    this.themeMode = mode
    uni.setStorageSync(THEME_MODE_KEY, mode)
    
    if (mode === 'system') {
      this.detectSystemTheme()
    } else {
      this.setTheme(mode)
    }
  }

  /**
   * 设置实际主题
   * @param {string} theme - 主题: light, dark
   */
  setTheme(theme) {
    if (!['light', 'dark'].includes(theme)) {
      console.warn('Invalid theme:', theme)
      return
    }
    
    this.currentTheme = theme
    uni.setStorageSync(CURRENT_THEME_KEY, theme)
    
    // 通知所有页面更新主题
    this.notifyThemeChange(theme)
  }

  /**
   * 通知主题变化
   */
  notifyThemeChange(theme) {
    // 使用全局事件通知
    uni.$emit('globalThemeChange', {
      theme: theme,
      isDark: theme === 'dark'
    })
  }

  /**
   * 获取主题模式
   */
  getThemeMode() {
    return this.themeMode
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * 获取主题配置
   */
  getThemeConfig() {
    return {
      light: {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        cardBackground: '#ffffff',
        borderColor: '#eeeeee',
        primaryColor: '#007aff',
        name: '浅色模式'
      },
      dark: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        cardBackground: '#2c2c2c',
        borderColor: '#404040',
        primaryColor: '#0a84ff',
        name: '深色模式'
      }
    }[this.currentTheme]
  }

  /**
   * 监听系统主题变化（微信小程序）
   */
  onSystemThemeChange(callback) {
    try {
      // 检查 uni.onThemeChange 是否存在（只在微信小程序环境中存在）
      if (typeof uni.onThemeChange === 'function') {
        uni.onThemeChange((res) => {
          if (this.themeMode === 'system') {
            const newTheme = res.theme === 'dark' ? 'dark' : 'light'
            this.setTheme(newTheme)
            if (callback) {
              callback(newTheme)
            }
          }
        })
      } else {
        // 在非微信小程序环境中，使用默认浅色主题
        console.log('非微信小程序环境，跳过系统主题监听')
        if (this.themeMode === 'system') {
          this.setTheme('light')
        }
      }
    } catch (error) {
      console.warn('无法监听系统主题变化:', error)
      // 出错时使用默认浅色主题
      if (this.themeMode === 'system') {
        this.setTheme('light')
      }
    }
  }
}

// 创建全局主题管理器实例
const themeManager = new ThemeManager()

// 导出主题管理器
export { themeManager }

// 导出默认实例
export default themeManager