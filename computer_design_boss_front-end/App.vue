<script>
	import { themeManager } from '@/common/utils/theme-simple.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 初始化应用主题
			this.initAppTheme()
		},
		onShow: function() {
			console.log('App Show')
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
					
				} catch (error) {
					console.error('初始化主题失败:', error)
				}
			},
			
			/**
			 * 应用全局主题
			 */
			applyGlobalTheme(theme) {
				// 设置页面基础样式
				const pageStyle = `
					--bg-primary: ${theme === 'dark' ? '#1a1a1a' : '#ffffff'};
					--bg-secondary: ${theme === 'dark' ? '#2c2c2c' : '#f5f5f5'};
					--text-primary: ${theme === 'dark' ? '#ffffff' : '#333333'};
					--text-secondary: ${theme === 'dark' ? '#cccccc' : '#666666'};
					--border-color: ${theme === 'dark' ? '#404040' : '#eeeeee'};
					--primary-color: ${theme === 'dark' ? '#0a84ff' : '#007aff'};
				`
				
				// 添加到页面样式
				const style = document.createElement('style')
				style.textContent = `:root { ${pageStyle} }`
				document.head.appendChild(style)
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