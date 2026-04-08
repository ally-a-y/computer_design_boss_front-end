"use strict";
const common_vendor = require("../vendor.js");
const THEME_MODE_KEY = "themeMode";
const CURRENT_THEME_KEY = "currentTheme";
class ThemeManager {
  constructor() {
    this.currentTheme = "light";
    this.themeMode = "system";
    this.init();
  }
  /**
   * 初始化主题管理器
   */
  init() {
    this.themeMode = common_vendor.index.getStorageSync(THEME_MODE_KEY) || "system";
    this.currentTheme = common_vendor.index.getStorageSync(CURRENT_THEME_KEY) || "light";
    setTimeout(() => {
      if (this.themeMode === "system") {
        this.detectSystemTheme();
      }
    }, 100);
  }
  /**
   * 检测系统主题（微信小程序支持）
   */
  detectSystemTheme() {
    try {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      const systemTheme = systemInfo.theme || "light";
      this.setTheme(systemTheme === "dark" ? "dark" : "light");
    } catch (error) {
      common_vendor.index.__f__("warn", "at common/utils/theme-simple.js:42", "无法获取系统主题，使用默认浅色主题");
      this.setTheme("light");
    }
  }
  /**
   * 设置主题模式
   * @param {string} mode - 主题模式: light, dark, system
   */
  setThemeMode(mode) {
    if (!["light", "dark", "system"].includes(mode)) {
      common_vendor.index.__f__("warn", "at common/utils/theme-simple.js:53", "Invalid theme mode:", mode);
      return;
    }
    this.themeMode = mode;
    common_vendor.index.setStorageSync(THEME_MODE_KEY, mode);
    if (mode === "system") {
      this.detectSystemTheme();
    } else {
      this.setTheme(mode);
    }
  }
  /**
   * 设置实际主题
   * @param {string} theme - 主题: light, dark
   */
  setTheme(theme) {
    if (!["light", "dark"].includes(theme)) {
      common_vendor.index.__f__("warn", "at common/utils/theme-simple.js:73", "Invalid theme:", theme);
      return;
    }
    this.currentTheme = theme;
    common_vendor.index.setStorageSync(CURRENT_THEME_KEY, theme);
    this.notifyThemeChange(theme);
  }
  /**
   * 通知主题变化
   */
  notifyThemeChange(theme) {
    common_vendor.index.$emit("globalThemeChange", {
      theme,
      isDark: theme === "dark"
    });
  }
  /**
   * 获取主题模式
   */
  getThemeMode() {
    return this.themeMode;
  }
  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  /**
   * 获取主题配置
   */
  getThemeConfig() {
    return {
      light: {
        backgroundColor: "#ffffff",
        textColor: "#333333",
        cardBackground: "#ffffff",
        borderColor: "#eeeeee",
        primaryColor: "#007aff",
        name: "浅色模式"
      },
      dark: {
        backgroundColor: "#1a1a1a",
        textColor: "#ffffff",
        cardBackground: "#2c2c2c",
        borderColor: "#404040",
        primaryColor: "#0a84ff",
        name: "深色模式"
      }
    }[this.currentTheme];
  }
  /**
   * 监听系统主题变化（微信小程序）
   */
  onSystemThemeChange(callback) {
    try {
      if (typeof common_vendor.index.onThemeChange === "function") {
        common_vendor.index.onThemeChange((res) => {
          if (this.themeMode === "system") {
            const newTheme = res.theme === "dark" ? "dark" : "light";
            this.setTheme(newTheme);
            if (callback) {
              callback(newTheme);
            }
          }
        });
      } else {
        common_vendor.index.__f__("log", "at common/utils/theme-simple.js:151", "非微信小程序环境，跳过系统主题监听");
        if (this.themeMode === "system") {
          this.setTheme("light");
        }
      }
    } catch (error) {
      common_vendor.index.__f__("warn", "at common/utils/theme-simple.js:157", "无法监听系统主题变化:", error);
      if (this.themeMode === "system") {
        this.setTheme("light");
      }
    }
  }
}
const themeManager = new ThemeManager();
exports.themeManager = themeManager;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/utils/theme-simple.js.map
