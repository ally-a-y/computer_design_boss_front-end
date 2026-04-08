import { themeManager } from '@/common/utils/theme-simple.js'

export const themeMixin = {
  data() {
    return {
      currentTheme: 'light',
      isDarkMode: false
    }
  },
  mounted() {
    this.initTheme()
  },
  beforeUnmount() {
    uni.$off('globalThemeChange', this.handleGlobalThemeChange)
  },
  methods: {
    initTheme() {
      this.currentTheme = themeManager.getCurrentTheme()
      this.isDarkMode = this.currentTheme === 'dark'
      uni.$on('globalThemeChange', this.handleGlobalThemeChange)
    },
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme
      this.isDarkMode = data.isDark
    }
  }
}