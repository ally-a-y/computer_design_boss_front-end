"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var common_vendor = require("./common/vendor.js");
var common_utils_themeSimple = require("./common/utils/theme-simple.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/login/register/login_reister.js";
  "./pages/login/forget/login_forget.js";
  "./pages/index/index_index.js";
  "./pages/job/detail/job_detail_index.js";
  "./pages/job/add/job_add_index.js";
  "./pages/user/user.js";
  "./pages/user/resume/user_resume.js";
  "./pages/user/collection/user_collection.js";
  "./pages/user/deliver/user_deliver.js";
  "./pages/user/feedback/user_feedback.js";
  "./pages/user/account/user_account.js";
  "./pages/user/device/user_device.js";
  "./pages/user/display/user_display.js";
  "./pages/user/account/number/account_number.js";
  "./pages/user/account/number/number_change.js";
  "./pages/user/account/email/account_email.js";
  "./pages/user/account/email/email_change.js";
  "./pages/user/account/code/account_code.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
    this.initAppTheme();
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  methods: {
    initAppTheme() {
      try {
        const currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
        const themeMode = common_utils_themeSimple.themeManager.getThemeMode();
        console.log("\u5F53\u524D\u4E3B\u9898:", currentTheme, "\u4E3B\u9898\u6A21\u5F0F:", themeMode);
        this.applyGlobalTheme(currentTheme);
      } catch (error) {
        console.error("\u521D\u59CB\u5316\u4E3B\u9898\u5931\u8D25:", error);
      }
    },
    applyGlobalTheme(theme) {
      const pageStyle = `
					--bg-primary: ${theme === "dark" ? "#1a1a1a" : "#ffffff"};
					--bg-secondary: ${theme === "dark" ? "#2c2c2c" : "#f5f5f5"};
					--text-primary: ${theme === "dark" ? "#ffffff" : "#333333"};
					--text-secondary: ${theme === "dark" ? "#cccccc" : "#666666"};
					--border-color: ${theme === "dark" ? "#404040" : "#eeeeee"};
					--primary-color: ${theme === "dark" ? "#0a84ff" : "#007aff"};
				`;
      const style = document.createElement("style");
      style.textContent = `:root { ${pageStyle} }`;
      document.head.appendChild(style);
    }
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/App.vue"]]);
const uniIcons = () => "./node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.component("uni-icons", uniIcons);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
