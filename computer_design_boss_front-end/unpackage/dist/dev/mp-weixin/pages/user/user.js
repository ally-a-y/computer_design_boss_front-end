"use strict";
var common_vendor = require("../../common/vendor.js");
var common_utils_themeSimple = require("../../common/utils/theme-simple.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        name: "\u5F20\u4E09",
        avatar: "/static/logo.png"
      },
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
    initTheme() {
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme;
      this.isDarkMode = data.isDark;
    },
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
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
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u8981\u9000\u51FA\u767B\u5F55\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.showToast({
              title: "\u5DF2\u9000\u51FA\u767B\u5F55",
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
    b: common_vendor.t($data.userInfo.name || "\u5DF2\u767B\u5F55"),
    c: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    d: common_vendor.o((...args) => $options.navigateToResume && $options.navigateToResume(...args)),
    e: common_vendor.p({
      type: "star",
      size: "40",
      color: "#ff9500"
    }),
    f: common_vendor.o((...args) => $options.navigateToCollection && $options.navigateToCollection(...args)),
    g: $data.isDarkMode ? "#999" : "#6C757D",
    h: common_vendor.p({
      type: "paperplane",
      size: "40",
      color: "#007aff"
    }),
    i: common_vendor.o((...args) => $options.navigateToDeliver && $options.navigateToDeliver(...args)),
    j: $data.isDarkMode ? "#999" : "#6C757D",
    k: common_vendor.p({
      type: "chatbubble",
      size: "40",
      color: "#4cd964"
    }),
    l: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
    m: $data.isDarkMode ? "#999" : "#6C757D",
    n: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    o: $data.isDarkMode ? "#2c2c2c" : "#fff",
    p: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    q: common_vendor.p({
      type: "person",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    r: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    s: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    t: common_vendor.o((...args) => $options.navigateToAccount && $options.navigateToAccount(...args)),
    v: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    w: common_vendor.p({
      type: "phone",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    x: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    y: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    z: common_vendor.o((...args) => $options.navigateToDevice && $options.navigateToDevice(...args)),
    A: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    B: common_vendor.p({
      type: "settings",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    C: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    D: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    E: common_vendor.o((...args) => $options.navigateToDisplay && $options.navigateToDisplay(...args)),
    F: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    G: common_vendor.p({
      type: "color",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    H: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    I: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    J: common_vendor.o((...args) => $options.navigateToThemeDemo && $options.navigateToThemeDemo(...args)),
    K: $data.isDarkMode ? "#2c2c2c" : "#fff",
    L: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    M: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    N: $data.isDarkMode ? "#2c2c2c" : "#fff",
    O: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    P: $data.isDarkMode ? "#1a1a1a" : "#F8FAFD"
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/user.vue"]]);
wx.createPage(MiniProgramPage);
