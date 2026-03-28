"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_user = require("../../../common/api/user.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      currentPhone: "",
      currentEmail: ""
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      console.log("======== \u5F00\u59CB\u8BF7\u6C42\u7528\u6237\u4FE1\u606F ========");
      try {
        const res = await common_api_user.userApi.getUserProfile();
        console.log("\u8BF7\u6C42\u6210\u529F\uFF0C\u5B8C\u6574\u54CD\u5E94:", res);
        console.log("\u54CD\u5E94\u6570\u636E:", res.data);
        console.log("\u624B\u673A\u53F7:", res.mobile);
        console.log("\u90AE\u7BB1:", res.email);
        if (res) {
          this.currentPhone = res.mobile ? res.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "\u672A\u7ED1\u5B9A";
          this.currentEmail = res.email || "\u672A\u8BBE\u7F6E";
          console.log("\u9875\u9762\u663E\u793A:", this.currentPhone, this.currentEmail);
        }
      } catch (error) {
        console.error("======== \u8BF7\u6C42\u5931\u8D25 ========");
        console.error("\u9519\u8BEF\u4FE1\u606F:", error.message);
        console.error("\u5B8C\u6574\u9519\u8BEF:", error);
      }
      console.log("======== \u8BF7\u6C42\u7ED3\u675F ========");
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
        title: "\u6CE8\u9500\u8D26\u53F7",
        content: "\u6CE8\u9500\u8D26\u53F7\u540E\uFF0C\u60A8\u7684\u6240\u6709\u6570\u636E\u5C06\u88AB\u6C38\u4E45\u5220\u9664\uFF0C\u4E14\u65E0\u6CD5\u6062\u590D\u3002\u786E\u5B9A\u8981\u6CE8\u9500\u8D26\u53F7\u5417\uFF1F",
        confirmText: "\u786E\u5B9A\u6CE8\u9500",
        cancelText: "\u53D6\u6D88",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "\u8D26\u53F7\u6CE8\u9500\u529F\u80FD\u5F00\u53D1\u4E2D",
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
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.currentPhone),
    c: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    d: common_vendor.o((...args) => $options.navigateToNumber && $options.navigateToNumber(...args)),
    e: common_vendor.t($data.currentEmail),
    f: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    g: common_vendor.o((...args) => $options.navigateToEmail && $options.navigateToEmail(...args)),
    h: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    i: common_vendor.o((...args) => $options.navigateToPassword && $options.navigateToPassword(...args)),
    j: common_vendor.p({
      type: "right",
      size: "20",
      color: "#999"
    }),
    k: common_vendor.o((...args) => $options.deleteAccount && $options.deleteAccount(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/account/user_account.vue"]]);
wx.createPage(MiniProgramPage);
