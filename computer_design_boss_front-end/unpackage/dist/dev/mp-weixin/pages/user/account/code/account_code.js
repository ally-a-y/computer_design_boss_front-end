"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentPhone: "138****8000",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
      countdown: 0
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    sendCode() {
      common_vendor.index.showToast({
        title: "\u9A8C\u8BC1\u7801\u53D1\u9001\u6210\u529F",
        icon: "success"
      });
      this.countdown = 60;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1e3);
    },
    confirmChange() {
      if (!this.verificationCode) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801",
          icon: "none"
        });
        return;
      }
      if (!this.newPassword) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801",
          icon: "none"
        });
        return;
      }
      if (this.newPassword.length < 6) {
        common_vendor.index.showToast({
          title: "\u5BC6\u7801\u957F\u5EA6\u4E0D\u80FD\u5C11\u4E8E6\u4F4D",
          icon: "none"
        });
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        common_vendor.index.showToast({
          title: "\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "\u5BC6\u7801\u4FEE\u6539\u6210\u529F",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.currentPhone),
    c: $data.verificationCode,
    d: common_vendor.o(($event) => $data.verificationCode = $event.detail.value),
    e: common_vendor.t($data.countdown > 0 ? `${$data.countdown}\u79D2\u540E\u91CD\u65B0\u53D1\u9001` : "\u53D1\u9001\u9A8C\u8BC1\u7801"),
    f: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    g: $data.countdown > 0,
    h: $data.newPassword,
    i: common_vendor.o(($event) => $data.newPassword = $event.detail.value),
    j: $data.confirmPassword,
    k: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    l: common_vendor.o((...args) => $options.confirmChange && $options.confirmChange(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/account/code/account_code.vue"]]);
wx.createPage(MiniProgramPage);
