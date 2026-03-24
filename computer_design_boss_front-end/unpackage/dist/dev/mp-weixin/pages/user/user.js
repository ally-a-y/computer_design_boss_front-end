"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils_themeSimple = require("../../common/utils/theme-simple.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        name: "张三",
        avatar: "/static/logo.png"
      },
      // 主题相关
      currentTheme: "light",
      isDarkMode: false
    };
  },
  onShow() {
    this.checkLoginStatus();
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
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        if (typeof userInfo === "string") {
          try {
            this.userInfo = JSON.parse(userInfo);
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/user/user.vue:132", "解析userInfo失败:", e);
            this.userInfo = null;
          }
        } else {
          this.userInfo = userInfo;
        }
      }
    },
    navigateToResume() {
      common_vendor.index.navigateTo({
        url: "/pages/user/resume/user_resume"
      });
    },
    navigateToCollection() {
      common_vendor.index.navigateTo({
        url: "/pages/user/collection/user_collection"
      });
    },
    navigateToDeliver() {
      common_vendor.index.navigateTo({
        url: "/pages/user/deliver/user_deliver"
      });
    },
    navigateToFeedback() {
      common_vendor.index.navigateTo({
        url: "/pages/user/feedback/user_feedback"
      });
    },
    navigateToAccount() {
      common_vendor.index.navigateTo({
        url: "/pages/user/account/user_account"
      });
    },
    navigateToDevice() {
      common_vendor.index.navigateTo({
        url: "/pages/user/device/user_device"
      });
    },
    navigateToDisplay() {
      common_vendor.index.navigateTo({
        url: "/pages/user/display/user_display"
      });
    },
    navigateToThemeDemo() {
      common_vendor.index.navigateTo({
        url: "/pages/chart"
      });
    },
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }, 1500);
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
    a: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    b: $data.isDarkMode ? "#2c2c2c" : "transparent",
    c: common_assets._imports_0,
    d: common_vendor.t($data.userInfo.name || "已登录"),
    e: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    f: common_vendor.o((...args) => $options.navigateToResume && $options.navigateToResume(...args)),
    g: common_vendor.p({
      type: "star",
      size: "40",
      color: $data.isDarkMode ? "#ffb800" : "#ff9500"
    }),
    h: $data.isDarkMode ? "#999" : "#6C757D",
    i: common_vendor.o((...args) => $options.navigateToCollection && $options.navigateToCollection(...args)),
    j: $data.isDarkMode ? "#999" : "#6C757D",
    k: common_vendor.p({
      type: "paperplane",
      size: "40",
      color: "#007aff"
    }),
    l: $data.isDarkMode ? "#999" : "#6C757D",
    m: common_vendor.o((...args) => $options.navigateToDeliver && $options.navigateToDeliver(...args)),
    n: $data.isDarkMode ? "#999" : "#6C757D",
    o: common_vendor.p({
      type: "chatbubble",
      size: "40",
      color: $data.isDarkMode ? "#52c41a" : "#4cd964"
    }),
    p: $data.isDarkMode ? "#999" : "#6C757D",
    q: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
    r: $data.isDarkMode ? "#999" : "#6C757D",
    s: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    t: $data.isDarkMode ? "#2c2c2c" : "#fff",
    v: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    w: common_vendor.p({
      type: "person",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    x: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    y: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    z: common_vendor.o((...args) => $options.navigateToAccount && $options.navigateToAccount(...args)),
    A: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    B: $data.isDarkMode ? "transparent" : "transparent",
    C: common_vendor.p({
      type: "phone",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    D: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    E: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    F: common_vendor.o((...args) => $options.navigateToDevice && $options.navigateToDevice(...args)),
    G: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    H: $data.isDarkMode ? "transparent" : "transparent",
    I: common_vendor.p({
      type: "settings",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    J: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    K: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    L: common_vendor.o((...args) => $options.navigateToDisplay && $options.navigateToDisplay(...args)),
    M: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    N: $data.isDarkMode ? "transparent" : "transparent",
    O: common_vendor.p({
      type: "color",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    P: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    Q: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    R: common_vendor.o((...args) => $options.navigateToThemeDemo && $options.navigateToThemeDemo(...args)),
    S: $data.isDarkMode ? "transparent" : "transparent",
    T: $data.isDarkMode ? "#2c2c2c" : "#fff",
    U: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    V: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    W: $data.isDarkMode ? "#2c2c2c" : "#fff",
    X: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    Y: $data.isDarkMode ? "#1a1a1a" : "#F8FAFD"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
