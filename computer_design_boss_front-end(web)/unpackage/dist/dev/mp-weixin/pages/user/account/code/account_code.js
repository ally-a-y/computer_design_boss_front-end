"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_utils_themeSimple = require("../../../../common/utils/theme-simple.js");
const _sfc_main = {
  data() {
    return {
      currentPhone: "138****8000",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
      countdown: 0,
      // 主题相关
      currentTheme: "light",
      isDarkMode: false
    };
  },
  onLoad() {
    this.initTheme();
  },
  onUnload() {
    common_vendor.index.$off("globalThemeChange", this.handleGlobalThemeChange);
  },
  methods: {
    /**
     * 初始化主题
     */
    initTheme() {
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    /**
     * 处理全局主题变化
     */
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme;
      this.isDarkMode = data.isDark;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    sendCode() {
      common_vendor.index.showToast({
        title: "验证码发送成功",
        icon: "success"
      });
      this.countdown = 60;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1e3);
    },
    confirmChange() {
      if (!this.verificationCode) {
        common_vendor.index.showToast({
          title: "请输入验证码",
          icon: "none"
        });
        return;
      }
      if (!this.newPassword) {
        common_vendor.index.showToast({
          title: "请输入新密码",
          icon: "none"
        });
        return;
      }
      if (this.newPassword.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度不能少于6位",
          icon: "none"
        });
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "密码修改成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "e2"),
    b: $data.isDarkMode ? "#ffffff" : "#333",
    c: $data.isDarkMode ? "#ffffff" : "#333",
    d: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    f: $data.isDarkMode ? "#ffffff" : "#333",
    g: common_vendor.t($data.currentPhone),
    h: $data.isDarkMode ? "#ffffff" : "#333",
    i: $data.isDarkMode ? "#404040" : "#fff",
    j: $data.isDarkMode ? "#404040" : "#eee",
    k: $data.isDarkMode ? "#ffffff" : "#333",
    l: $data.verificationCode,
    m: common_vendor.o(($event) => $data.verificationCode = $event.detail.value, "ea"),
    n: common_vendor.t($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"),
    o: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args), "23"),
    p: $data.countdown > 0,
    q: $data.isDarkMode ? "#ffffff" : "#333",
    r: $data.isDarkMode ? "#404040" : "#fff",
    s: $data.isDarkMode ? "#404040" : "#eee",
    t: $data.isDarkMode ? "#ffffff" : "#333",
    v: $data.newPassword,
    w: common_vendor.o(($event) => $data.newPassword = $event.detail.value, "42"),
    x: $data.isDarkMode ? "#ffffff" : "#333",
    y: $data.isDarkMode ? "#404040" : "#fff",
    z: $data.isDarkMode ? "#404040" : "#eee",
    A: $data.isDarkMode ? "#ffffff" : "#333",
    B: $data.confirmPassword,
    C: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value, "52"),
    D: common_vendor.o((...args) => $options.confirmChange && $options.confirmChange(...args), "fc"),
    E: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    F: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    G: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/user/account/code/account_code.js.map
