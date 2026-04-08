"use strict";
const common_vendor = require("../../common/vendor.js");
const common_utils_themeSimple = require("../../common/utils/theme-simple.js");
const common_api_user = require("../../common/api/user.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        name: "张三",
        avatar: ""
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
    async checkLoginStatus() {
      common_vendor.index.__f__("log", "at pages/user/user.vue:126", "开始检查用户登录状态");
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      common_vendor.index.__f__("log", "at pages/user/user.vue:128", "从本地存储获取userInfo:", userInfo);
      if (userInfo) {
        if (typeof userInfo === "string") {
          try {
            this.userInfo = JSON.parse(userInfo);
            common_vendor.index.__f__("log", "at pages/user/user.vue:134", "解析userInfo成功:", this.userInfo);
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/user/user.vue:136", "解析userInfo失败:", e);
            this.userInfo = null;
          }
        } else {
          this.userInfo = userInfo;
          common_vendor.index.__f__("log", "at pages/user/user.vue:141", "直接使用userInfo:", this.userInfo);
        }
        try {
          common_vendor.index.__f__("log", "at pages/user/user.vue:147", "开始获取用户名称和头像");
          const res = await common_api_user.userApi.getUserNameAndAvatar();
          common_vendor.index.__f__("log", "at pages/user/user.vue:149", "获取用户名称和头像成功:", res);
          if (res) {
            this.userInfo.name = res.user_name;
            this.userInfo.real_name = res.user_name;
            this.userInfo.avatar = res.user_avatar;
            this.userInfo.avatar_format = res.user_avatar_format;
            this.userInfo.avatar_size = res.user_avatar_size;
            common_vendor.index.__f__("log", "at pages/user/user.vue:157", "更新用户信息成功:", this.userInfo);
            const userInfoToSave = {
              name: res.user_name,
              real_name: res.user_name,
              avatar: res.user_avatar,
              avatar_format: res.user_avatar_format,
              avatar_size: res.user_avatar_size
            };
            common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfoToSave));
            common_vendor.index.__f__("log", "at pages/user/user.vue:167", "保存用户信息到本地存储成功");
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/user/user.vue:170", "获取用户名称和头像失败:", error);
          try {
            common_vendor.index.__f__("log", "at pages/user/user.vue:173", "开始获取用户信息");
            const res = await common_api_user.userApi.getUserProfile();
            common_vendor.index.__f__("log", "at pages/user/user.vue:175", "获取用户信息成功:", res);
            if (res) {
              this.userInfo = res;
              common_vendor.index.__f__("log", "at pages/user/user.vue:178", "更新用户信息成功:", this.userInfo);
              const userInfoToSave = {
                name: res.name || res.real_name,
                real_name: res.real_name,
                avatar: res.avatar,
                avatar_format: res.avatar_format,
                avatar_size: res.avatar_size
              };
              common_vendor.index.setStorageSync("userInfo", JSON.stringify(userInfoToSave));
              common_vendor.index.__f__("log", "at pages/user/user.vue:188", "保存用户信息到本地存储成功");
            }
          } catch (error2) {
            common_vendor.index.__f__("error", "at pages/user/user.vue:191", "获取用户信息失败:", error2);
          }
        }
      } else {
        common_vendor.index.__f__("log", "at pages/user/user.vue:195", "本地存储中没有userInfo");
      }
    },
    // 检查头像数据是否有效
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
    // 解码HTML实体
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
    b: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    c: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    d: $data.userInfo.avatar ? "data:image/jpeg;base64," + $data.userInfo.avatar.replace(/\s+/g, "") : "/static/default-avatar.png",
    e: common_vendor.t($data.userInfo.name || "已登录"),
    f: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    g: common_vendor.o((...args) => $options.navigateToResume && $options.navigateToResume(...args), "e9"),
    h: common_vendor.p({
      type: "star",
      size: "40",
      color: $data.isDarkMode ? "#ffb800" : "#ff9500"
    }),
    i: $data.isDarkMode ? "#999" : "#6C757D",
    j: common_vendor.o((...args) => $options.navigateToCollection && $options.navigateToCollection(...args), "4b"),
    k: $data.isDarkMode ? "#999" : "#6C757D",
    l: common_vendor.p({
      type: "paperplane",
      size: "40",
      color: "#007aff"
    }),
    m: $data.isDarkMode ? "#999" : "#6C757D",
    n: common_vendor.o((...args) => $options.navigateToDeliver && $options.navigateToDeliver(...args), "65"),
    o: $data.isDarkMode ? "#999" : "#6C757D",
    p: common_vendor.p({
      type: "chatbubble",
      size: "40",
      color: $data.isDarkMode ? "#52c41a" : "#4cd964"
    }),
    q: $data.isDarkMode ? "#999" : "#6C757D",
    r: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args), "08"),
    s: $data.isDarkMode ? "#999" : "#6C757D",
    t: $data.isDarkMode ? "1px solid #404040" : "1px solid #E6F0FF",
    v: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    w: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    x: common_vendor.p({
      type: "person",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    y: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    z: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    A: common_vendor.o((...args) => $options.navigateToAccount && $options.navigateToAccount(...args), "54"),
    B: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    C: $data.isDarkMode ? "transparent" : "transparent",
    D: common_vendor.p({
      type: "phone",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    E: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    F: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    G: common_vendor.o((...args) => $options.navigateToDevice && $options.navigateToDevice(...args), "53"),
    H: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    I: $data.isDarkMode ? "transparent" : "transparent",
    J: common_vendor.p({
      type: "settings",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    K: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    L: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    M: common_vendor.o((...args) => $options.navigateToDisplay && $options.navigateToDisplay(...args), "45"),
    N: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9",
    O: $data.isDarkMode ? "transparent" : "transparent",
    P: common_vendor.p({
      type: "color",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#666"
    }),
    Q: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    R: common_vendor.p({
      type: "right",
      size: "20",
      color: $data.isDarkMode ? "#666" : "#999"
    }),
    S: common_vendor.o((...args) => $options.navigateToThemeDemo && $options.navigateToThemeDemo(...args), "1e"),
    T: $data.isDarkMode ? "transparent" : "transparent",
    U: $data.isDarkMode ? "#2c2c2c" : "#fff",
    V: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    W: common_vendor.o((...args) => $options.logout && $options.logout(...args), "6e"),
    X: $data.isDarkMode ? "#2c2c2c" : "#fff",
    Y: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    Z: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
