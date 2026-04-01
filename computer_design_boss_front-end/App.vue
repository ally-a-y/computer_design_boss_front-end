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
				// 在微信小程序环境中，document对象不存在，所以我们不需要操作DOM
				// 主题切换通过CSS变量和页面内的动态样式来实现
				console.log('应用主题:', theme)
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
		--primary-color: #4facfe;
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
	
	/* 底部导航栏毛玻璃效果 */
	.uni-tabbar {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(230, 240, 255, 0.8)) !important;
		backdrop-filter: blur(10px) !important;
		-webkit-backdrop-filter: blur(10px) !important;
		border-top: 1px solid rgba(79, 172, 254, 0.1) !important;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05) !important;
	}
	

	
	/* 导航栏图标颜色 */
	.uni-tabbar__icon {
		filter: brightness(1) saturate(1);
		transition: all 0.3s ease;
	}
	
	.uni-tabbar__item--active .uni-tabbar__icon {
		filter: brightness(1.2) saturate(1.5);
	}
</style>