"use strict";
var common_vendor = require("../vendor.js");
const THEME_MODE_KEY = "themeMode";
const CURRENT_THEME_KEY = "currentTheme";
class ThemeManager {
  constructor() {
    this.currentTheme = "light";
    this.themeMode = "system";
    this.init();
  }
  init() {
    this.themeMode = common_vendor.index.getStorageSync(THEME_MODE_KEY) || "system";
    this.currentTheme = common_vendor.index.getStorageSync(CURRENT_THEME_KEY) || "light";
    if (this.themeMode === "system") {
      this.detectSystemTheme();
    }
  }
  detectSystemTheme() {
    try {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      const systemTheme = systemInfo.theme || "light";
      this.setTheme(systemTheme === "dark" ? "dark" : "light");
    } catch (error) {
      console.warn("\u65E0\u6CD5\u83B7\u53D6\u7CFB\u7EDF\u4E3B\u9898\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u6D45\u8272\u4E3B\u9898");
      this.setTheme("light");
    }
  }
  setThemeMode(mode) {
    if (!["light", "dark", "system"].includes(mode)) {
      console.warn("Invalid theme mode:", mode);
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
  setTheme(theme) {
    if (!["light", "dark"].includes(theme)) {
      console.warn("Invalid theme:", theme);
      return;
    }
    this.currentTheme = theme;
    common_vendor.index.setStorageSync(CURRENT_THEME_KEY, theme);
    this.notifyThemeChange(theme);
  }
  notifyThemeChange(theme) {
    common_vendor.index.$emit("globalThemeChange", {
      theme,
      isDark: theme === "dark"
    });
  }
  getThemeMode() {
    return this.themeMode;
  }
  getCurrentTheme() {
    return this.currentTheme;
  }
  getThemeConfig() {
    return {
      light: {
        backgroundColor: "#ffffff",
        textColor: "#333333",
        cardBackground: "#ffffff",
        borderColor: "#eeeeee",
        primaryColor: "#007aff",
        name: "\u6D45\u8272\u6A21\u5F0F"
      },
      dark: {
        backgroundColor: "#1a1a1a",
        textColor: "#ffffff",
        cardBackground: "#2c2c2c",
        borderColor: "#404040",
        primaryColor: "#0a84ff",
        name: "\u6DF1\u8272\u6A21\u5F0F"
      }
    }[this.currentTheme];
  }
  onSystemThemeChange(callback) {
    try {
      common_vendor.index.onThemeChange((res) => {
        if (this.themeMode === "system") {
          const newTheme = res.theme === "dark" ? "dark" : "light";
          this.setTheme(newTheme);
          if (callback) {
            callback(newTheme);
          }
        }
      });
    } catch (error) {
      console.warn("\u65E0\u6CD5\u76D1\u542C\u7CFB\u7EDF\u4E3B\u9898\u53D8\u5316:", error);
    }
  }
}
const themeManager = new ThemeManager();
exports.themeManager = themeManager;
