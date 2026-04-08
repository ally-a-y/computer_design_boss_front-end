"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_user = require("../../../common/api/user.js");
const common_utils_themeSimple = require("../../../common/utils/theme-simple.js");
const _sfc_main = {
  data() {
    return {
      currentPhone: "",
      currentEmail: "",
      // 主题相关
      currentTheme: "light",
      isDarkMode: false
    };
  },
  onLoad() {
    this.getUserInfo();
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
    async getUserInfo() {
      common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:97", "======== 开始请求用户信息 ========");
      try {
        const res = await common_api_user.userApi.getUserProfile();
        common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:102", "请求成功，完整响应:", res);
        common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:103", "响应数据:", res.data);
        common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:104", "手机号:", res.mobile);
        common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:105", "邮箱:", res.email);
        if (res) {
          this.currentPhone = res.mobile ? res.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "未绑定";
          this.currentEmail = res.email || "未设置";
          common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:114", "页面显示:", this.currentPhone, this.currentEmail);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/account/user_account.vue:117", "======== 请求失败 ========");
        common_vendor.index.__f__("error", "at pages/user/account/user_account.vue:118", "错误信息:", error.message);
        common_vendor.index.__f__("error", "at pages/user/account/user_account.vue:119", "完整错误:", error);
      }
      common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:122", "======== 请求结束 ========");
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    navigateToNumber() {
      common_vendor.index.navigateTo({
        url: "/pages/user/account/number/account_number"
      });
    },
    navigateToEmail() {
      common_vendor.index.navigateTo({
        url: "/pages/user/account/email/account_email"
      });
    },
    navigateToPassword() {
      common_vendor.index.navigateTo({
        url: "/pages/user/account/code/account_code"
      });
    },
    deleteAccount() {
      common_vendor.index.showModal({
        title: "注销账号",
        content: "注销账号后，您的所有数据将被永久删除，且无法恢复。确定要注销账号吗？",
        confirmText: "确定注销",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "账号注销功能开发中",
              icon: "none"
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "0e"),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    d: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    f: $data.isDarkMode ? "#ffffff" : "#333",
    g: common_vendor.t($data.currentPhone),
    h: $data.isDarkMode ? "#666" : "#999",
    i: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    j: common_vendor.o((...args) => $options.navigateToNumber && $options.navigateToNumber(...args), "a6"),
    k: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee",
    l: $data.isDarkMode ? "#ffffff" : "#333",
    m: common_vendor.t($data.currentEmail),
    n: $data.isDarkMode ? "#666" : "#999",
    o: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    p: common_vendor.o((...args) => $options.navigateToEmail && $options.navigateToEmail(...args), "a7"),
    q: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee",
    r: $data.isDarkMode ? "#ffffff" : "#333",
    s: $data.isDarkMode ? "#666" : "#999",
    t: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    v: common_vendor.o((...args) => $options.navigateToPassword && $options.navigateToPassword(...args), "9b"),
    w: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee",
    x: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    y: common_vendor.o((...args) => $options.deleteAccount && $options.deleteAccount(...args), "e8"),
    z: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    A: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    B: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/account/user_account.js.map
