"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_user = require("../../../common/api/user.js");
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
      common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:66", "======== 开始请求用户信息 ========");
      try {
        const res = await common_api_user.userApi.getUserProfile();
        common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:71", "请求成功，完整响应:", res);
        common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:72", "响应数据:", res.data);
        common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:73", "手机号:", res.mobile);
        common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:74", "邮箱:", res.email);
        if (res) {
          this.currentPhone = res.mobile ? res.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "未绑定";
          this.currentEmail = res.email || "未设置";
          common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:83", "页面显示:", this.currentPhone, this.currentEmail);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/account/user_account.vue:86", "======== 请求失败 ========");
        common_vendor.index.__f__("error", "at pages/user/account/user_account.vue:87", "错误信息:", error.message);
        common_vendor.index.__f__("error", "at pages/user/account/user_account.vue:88", "完整错误:", error);
      }
      common_vendor.index.__f__("log", "at pages/user/account/user_account.vue:91", "======== 请求结束 ========");
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/account/user_account.js.map
