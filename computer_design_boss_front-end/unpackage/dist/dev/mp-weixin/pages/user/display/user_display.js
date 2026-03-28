"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_utils_themeSimple = require("../../../common/utils/theme-simple.js");
const _sfc_main = {
  data() {
    return {
      themeMode: "system",
      availableThemes: [
        { key: "light", name: "\u6D45\u8272\u6A21\u5F0F", icon: "\u2600\uFE0F" },
        { key: "dark", name: "\u6DF1\u8272\u6A21\u5F0F", icon: "\u{1F319}" },
        { key: "system", name: "\u8DDF\u968F\u7CFB\u7EDF", icon: "\u2699\uFE0F" }
      ],
      currentTheme: "light",
      isDarkMode: false,
      pageBackground: "#f5f5f5",
      pageTextColor: "#333333"
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    setTheme(mode) {
      this.themeMode = mode;
      common_utils_themeSimple.themeManager.setThemeMode(mode);
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      this.updatePageTheme();
      const themeName = this.getThemeText(mode);
      common_vendor.index.showToast({
        title: `\u5DF2\u5207\u6362\u5230${themeName}`,
        icon: "success",
        duration: 1500
      });
    },
    getThemeText(mode) {
      const theme = this.availableThemes.find((t) => t.key === mode);
      return theme ? theme.name : "";
    },
    updateTheme(theme) {
      this.currentTheme = theme;
      this.isDarkMode = theme === "dark";
    },
    updatePageTheme() {
      if (this.isDarkMode) {
        this.pageBackground = "#1a1a1a";
        this.pageTextColor = "#ffffff";
      } else {
        this.pageBackground = "#f5f5f5";
        this.pageTextColor = "#333333";
      }
    },
    handleGlobalThemeChange(data) {
      this.updateTheme(data.theme);
      this.updatePageTheme();
    }
  },
  onLoad() {
    this.themeMode = common_utils_themeSimple.themeManager.getThemeMode();
    this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
    this.isDarkMode = this.currentTheme === "dark";
    this.updatePageTheme();
    common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
  },
  onUnload() {
    common_vendor.index.$off("globalThemeChange", this.handleGlobalThemeChange);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.pageTextColor,
    c: $data.pageTextColor,
    d: $data.isDarkMode ? "#2c2c2c" : "#fff",
    e: $data.isDarkMode ? "#404040" : "#eee",
    f: $data.pageTextColor,
    g: $data.isDarkMode ? "#cccccc" : "#999",
    h: common_vendor.f($data.availableThemes, (theme, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(theme.icon),
        b: common_vendor.t(theme.name),
        c: $data.themeMode === theme.key
      }, $data.themeMode === theme.key ? {} : {}, {
        d: $data.themeMode === theme.key ? 1 : "",
        e: common_vendor.o(($event) => $options.setTheme(theme.key), theme.key),
        f: theme.key
      });
    }),
    i: $data.pageTextColor,
    j: $data.pageTextColor,
    k: $data.isDarkMode ? "#2c2c2c" : "#fff",
    l: $data.isDarkMode ? "#404040" : "#e0e0e0",
    m: common_vendor.t($options.getThemeText($data.currentTheme)),
    n: $data.isDarkMode ? "#0a84ff" : "#007aff",
    o: $data.themeMode === "system"
  }, $data.themeMode === "system" ? {
    p: $data.isDarkMode ? "#cccccc" : "#666"
  } : {}, {
    q: $data.isDarkMode ? "#1a1a1a" : "#f0f8ff",
    r: $data.themeMode !== "system"
  }, $data.themeMode !== "system" ? {
    s: $data.pageTextColor,
    t: common_vendor.t($options.getThemeText($data.themeMode)),
    v: $data.pageTextColor,
    w: common_vendor.n("preview-card-" + $data.themeMode),
    x: $data.isDarkMode ? "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)" : "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
    y: $data.isDarkMode ? "#404040" : "#eeeeee",
    z: $data.pageTextColor
  } : {}, {
    A: $data.isDarkMode ? "#404040" : "#eee",
    B: $data.isDarkMode ? "#2a2a2a" : "#fff",
    C: $data.pageBackground,
    D: $data.pageTextColor
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/display/user_display.vue"]]);
wx.createPage(MiniProgramPage);
