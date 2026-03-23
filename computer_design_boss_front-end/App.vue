<script>
	import { themeManager } from '@/common/utils/theme-simple.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化应用主题
			this.initAppTheme()
			// 监听系统主题变化
			this.listenSystemThemeChange()
		},
		onShow: function() {
			console.log('App Show')
			// 重新检查主题设置
			this.initAppTheme()
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			/**
			 * 初始化应用主题
			 */
			initAppTheme() {
				try {
					// 获取当前主题设置
					const currentTheme = themeManager.getCurrentTheme()
					const themeMode = themeManager.getThemeMode()
					
					console.log('当前主题:', currentTheme, '主题模式:', themeMode)
					
					// 应用主题到全局
					this.applyGlobalTheme(currentTheme)
					
					// 通知所有页面更新主题
					themeManager.notifyThemeChange(currentTheme)
					
				} catch (error) {
					console.error('初始化主题失败:', error)
				}
			},
			
			/**
			 * 应用全局主题
			 */
			applyGlobalTheme(theme) {
				// 移除所有主题类
				uni.removeClass(document.body, 'light-theme')
				uni.removeClass(document.body, 'dark-theme')
				
				// 添加当前主题类
				uni.addClass(document.body, theme === 'dark' ? 'dark-theme' : 'light-theme')
				
				// 设置页面背景色
				if (theme === 'dark') {
					document.body.style.backgroundColor = '#1a1a1a'
					document.body.style.color = '#ffffff'
				} else {
					document.body.style.backgroundColor = '#f5f5f5'
					document.body.style.color = '#333333'
				}
			},
			
			/**
			 * 监听系统主题变化
			 */
			listenSystemThemeChange() {
				themeManager.onSystemThemeChange((newTheme) => {
					console.log('系统主题变化:', newTheme)
					this.applyGlobalTheme(newTheme)
				})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #f5f5f5;
		transition: background-color 0.3s ease, color 0.3s ease;
	}
	
	/* 主题切换动画 */
	.theme-transition {
		transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
	}
	
	/* 浅色主题 */
	.light-theme {
		--bg-primary: #ffffff;
		--bg-secondary: #f5f5f5;
		--bg-card: #ffffff;
		--text-primary: #333333;
		--text-secondary: #666666;
		--text-tertiary: #999999;
		--border-color: #eeeeee;
		--primary-color: #007aff;
		--success-color: #4cd964;
		--warning-color: #ff9500;
		--error-color: #ff3b30;
	}
	
	/* 深色主题 */
	.dark-theme {
		--bg-primary: #1a1a1a;
		--bg-secondary: #2c2c2c;
		--bg-card: #2a2a2a;
		--text-primary: #ffffff;
		--text-secondary: #cccccc;
		--text-tertiary: #999999;
		--border-color: #404040;
		--primary-color: #0a84ff;
		--success-color: #32d74b;
		--warning-color: #ff9f0a;
		--error-color: #ff453a;
	}
	
	/* 应用主题变量 */
	.light-theme page {
		background-color: var(--bg-secondary);
		color: var(--text-primary);
	}
	
	.dark-theme page {
		background-color: var(--bg-primary);
		color: var(--text-primary);
	}
</style>