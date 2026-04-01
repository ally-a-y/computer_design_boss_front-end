"use strict";
var common_vendor = require("../../common/vendor.js");
var common_utils_themeSimple = require("../../common/utils/theme-simple.js");
var common_api_user = require("../../common/api/user.js");
require("../../common/api/request.js");
require("../../common/config.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        name: "\u5F20\u4E09",
        avatar: ""
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
    async checkLoginStatus() {
      console.log("\u5F00\u59CB\u68C0\u67E5\u7528\u6237\u767B\u5F55\u72B6\u6001");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      console.log("\u4ECE\u672C\u5730\u5B58\u50A8\u83B7\u53D6userInfo:", userInfo);
      if (userInfo) {
        if (typeof userInfo === "string") {
          try {
            this.userInfo = JSON.parse(userInfo);
            console.log("\u89E3\u6790userInfo\u6210\u529F:", this.userInfo);
          } catch (e) {
            console.error("\u89E3\u6790userInfo\u5931\u8D25:", e);
            this.userInfo = null;
          }
        } else {
          this.userInfo = userInfo;
          console.log("\u76F4\u63A5\u4F7F\u7528userInfo:", this.userInfo);
        }
        try {
          console.log("\u5F00\u59CB\u83B7\u53D6\u7528\u6237\u540D\u79F0\u548C\u5934\u50CF");
          const res = await common_api_user.userApi.getUserNameAndAvatar();
          console.log("\u83B7\u53D6\u7528\u6237\u540D\u79F0\u548C\u5934\u50CF\u6210\u529F:", res);
          if (res) {
            this.userInfo.name = res.user_name;
            this.userInfo.real_name = res.user_name;
            this.userInfo.avatar = res.user_avatar;
            this.userInfo.avatar_format = res.user_avatar_format;
            this.userInfo.avatar_size = res.user_avatar_size;
            console.log("\u66F4\u65B0\u7528\u6237\u4FE1\u606F\u6210\u529F:", this.userInfo);
            const userInfoToSave = {
              name: res.user_name,
              real_name: res.user_name,
              avatar: res.user_avatar,
              avatar_format: res.user_avatar_format,
              avatar_size: res.user_avatar_size
            };
            common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfoToSave));
            console.log("\u4FDD\u5B58\u7528\u6237\u4FE1\u606F\u5230\u672C\u5730\u5B58\u50A8\u6210\u529F");
          }
        } catch (error) {
          console.error("\u83B7\u53D6\u7528\u6237\u540D\u79F0\u548C\u5934\u50CF\u5931\u8D25:", error);
          try {
            console.log("\u5F00\u59CB\u83B7\u53D6\u7528\u6237\u4FE1\u606F");
            const res = await common_api_user.userApi.getUserProfile();
            console.log("\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u6210\u529F:", res);
            if (res) {
              this.userInfo = res;
              console.log("\u66F4\u65B0\u7528\u6237\u4FE1\u606F\u6210\u529F:", this.userInfo);
              const userInfoToSave = {
                name: res.name || res.real_name,
                real_name: res.real_name,
                avatar: res.avatar,
                avatar_format: res.avatar_format,
                avatar_size: res.avatar_size
              };
              common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfoToSave));
              console.log("\u4FDD\u5B58\u7528\u6237\u4FE1\u606F\u5230\u672C\u5730\u5B58\u50A8\u6210\u529F");
            }
          } catch (error2) {
            console.error("\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25:", error2);
          }
        }
      } else {
        console.log("\u672C\u5730\u5B58\u50A8\u4E2D\u6CA1\u6709userInfo");
      }
    },
    isValidAvatar(avatar) {
      if (!avatar || avatar === "") {
        return false;
      }
      if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
        return false;
      }
      const cleaned = avatar.replace(/\s+/g, "");
      return cleaned.length > 0;
    },
    decodeHtmlEntities(text) {
      const entities = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      };
      return text.replace(/&[#\w]+;/g, (entity) => {
        return entities[entity] || entity;
      });
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
    c: $data.userInfo.avatar ? "data:image/jpeg;base64," + $data.userInfo.avatar.replace(/\s+/g, "") : "/static/default-avatar.png",
    d: common_vendor.t($data.userInfo.name || "\u5DF2\u767B\u5F55"),
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
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/user.vue"]]);
wx.createPage(MiniProgramPage);
