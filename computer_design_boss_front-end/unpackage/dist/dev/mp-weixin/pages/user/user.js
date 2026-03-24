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
        if (typeof userInfo === "string") {
          try {
            this.userInfo = JSON.parse(userInfo);
          } catch (e) {
            console.error("\u89E3\u6790userInfo\u5931\u8D25:", e);
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
    b: $data.isDarkMode ? "#2c2c2c" : "transparent",
    c: common_vendor.t($data.userInfo.name || "\u5DF2\u767B\u5F55"),
    d: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    e: common_vendor.o((...args) => $options.navigateToResume && $options.navigateToResume(...args)),
    f: common_vendor.p({
      type: "star",
      size: "40",
      color: $data.isDarkMode ? "#ffb800" : "#ff9500"
    }),
    g: $data.isDarkMode ? "#999" : "#6C757D",
    h: common_vendor.o((...args) => $options.navigateToCollection && $options.navigateToCollection(...args)),
    i: $data.isDarkMode ? "#999" : "#6C757D",
    j: common_vendor.p({
      type: "paperplane",
      size: "40",
      color: "#007aff"
    }),
    k: $data.isDarkMode ? "#999" : "#6C757D",
    l: common_vendor.o((...args) => $options.navigateToDeliver && $options.navigateToDeliver(...args)),
    m: $data.isDarkMode ? "#999" : "#6C757D",
    n: common_vendor.p({
      type: "chatbubble",
      size: "40",
      color: $data.isDarkMode ? "#52c41a" : "#4cd964"
    }),
    o: $data.isDarkMode ? "#999" : "#6C757D",
    p: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
    q: $data.isDarkMode ? "#999" : "#6C757D",
    r: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    s: $data.isDarkMode ? "#2c2c2c" : "#fff",
    t: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    v: common_vendor.p({
      type: "person",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    w: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    x: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    y: common_vendor.o((...args) => $options.navigateToAccount && $options.navigateToAccount(...args)),
    z: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    A: $data.isDarkMode ? "transparent" : "transparent",
    B: common_vendor.p({
      type: "phone",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    C: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    D: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    E: common_vendor.o((...args) => $options.navigateToDevice && $options.navigateToDevice(...args)),
    F: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    G: $data.isDarkMode ? "transparent" : "transparent",
    H: common_vendor.p({
      type: "settings",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    I: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    J: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    K: common_vendor.o((...args) => $options.navigateToDisplay && $options.navigateToDisplay(...args)),
    L: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    M: $data.isDarkMode ? "transparent" : "transparent",
    N: common_vendor.p({
      type: "color",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    O: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    P: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    Q: common_vendor.o((...args) => $options.navigateToThemeDemo && $options.navigateToThemeDemo(...args)),
    R: $data.isDarkMode ? "transparent" : "transparent",
    S: $data.isDarkMode ? "#2c2c2c" : "#fff",
    T: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    U: common_vendor.o((...args) => $options.logout && $options.logout(...args)),
    V: $data.isDarkMode ? "#2c2c2c" : "#fff",
    W: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    X: $data.isDarkMode ? "#1a1a1a" : "#F8FAFD"
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/user.vue"]]);
wx.createPage(MiniProgramPage);
