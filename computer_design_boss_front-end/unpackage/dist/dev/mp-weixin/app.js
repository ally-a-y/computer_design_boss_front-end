"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const common_utils_themeSimple = require("./common/utils/theme-simple.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/splash/splash.js";
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
  "./pages/AI/AI.js";
  "./pages/AI/interview.js";
  "./pages/forum/forum.js";
  "./pages/forum/details/forum_detail.js";
  "./pages/forum/post.js";
  "./pages/chart.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    this.initAppTheme();
    this.listenSystemThemeChange();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:13", "App Show");
    this.initAppTheme();
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:18", "App Hide");
  },
  methods: {
    /**
     * 初始化应用主题
     */
    initAppTheme() {
      try {
        const currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
        const themeMode = common_utils_themeSimple.themeManager.getThemeMode();
        common_vendor.index.__f__("log", "at App.vue:30", "当前主题:", currentTheme, "主题模式:", themeMode);
        this.applyGlobalTheme(currentTheme);
        common_utils_themeSimple.themeManager.notifyThemeChange(currentTheme);
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:39", "初始化主题失败:", error);
      }
    },
    /**
     * 应用全局主题
     */
    applyGlobalTheme(theme) {
      common_vendor.index.__f__("log", "at App.vue:49", "应用主题:", theme);
    },
    /**
     * 监听系统主题变化
     */
    listenSystemThemeChange() {
      common_utils_themeSimple.themeManager.onSystemThemeChange((newTheme) => {
        common_vendor.index.__f__("log", "at App.vue:57", "系统主题变化:", newTheme);
        this.applyGlobalTheme(newTheme);
      });
    }
  }
};
const uniIcons = () => "./node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const uniDrawer = () => "./node-modules/@dcloudio/uni-ui/lib/uni-drawer/uni-drawer.js";
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("uni-icons", uniIcons);
  app.component("uni-drawer", uniDrawer);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
