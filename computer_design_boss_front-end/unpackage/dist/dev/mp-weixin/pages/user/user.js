"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        name: "\u5F20\u4E09",
        avatar: "/static/logo.png"
      }
    };
  },
  onShow() {
    this.checkLoginStatus();
  },
  methods: {
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
        url: "/pages/demo/theme-demo"
      });
    },
    logout() {
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u8981\u9000\u51FA\u767B\u5F55\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.showToast({
              title: "\u5DF2\u9000\u51FA\u767B\u5F55",
              icon: "success"
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
    a: common_vendor.t($data.userInfo.name || "\u672A\u767B\u5F55"),
    b: common_vendor.o((...args) => $options.navigateToResume && $options.navigateToResume(...args)),
    c: common_vendor.p({
      type: "star",
      size: "40",
      color: "#ff9500"
    }),
    d: common_vendor.o((...args) => $options.navigateToCollection && $options.navigateToCollection(...args)),
    e: common_vendor.p({
      type: "paperplane",
      size: "40",
      color: "#007aff"
    }),
    f: common_vendor.o((...args) => $options.navigateToDeliver && $options.navigateToDeliver(...args)),
    g: common_vendor.p({
      type: "chatbubble",
      size: "40",
      color: "#4cd964"
    }),
    h: common_vendor.o((...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
    i: common_vendor.p({
      type: "person",
      size: "30",
      color: "#666"
    }),
    j: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    k: common_vendor.o((...args) => $options.navigateToAccount && $options.navigateToAccount(...args)),
    l: common_vendor.p({
      type: "monitor",
      size: "30",
      color: "#666"
    }),
    m: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    n: common_vendor.o((...args) => $options.navigateToDevice && $options.navigateToDevice(...args)),
    o: common_vendor.p({
      type: "settings",
      size: "30",
      color: "#666"
    }),
    p: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    q: common_vendor.o((...args) => $options.navigateToDisplay && $options.navigateToDisplay(...args)),
    r: common_vendor.p({
      type: "color",
      size: "30",
      color: "#666"
    }),
    s: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    t: common_vendor.o((...args) => $options.navigateToThemeDemo && $options.navigateToThemeDemo(...args)),
    v: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/user.vue"]]);
wx.createPage(MiniProgramPage);
