"use strict";
var common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      newPhone: "",
      verificationCode: "",
      countdown: 0
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    sendCode() {
      if (!this.newPhone || this.newPhone.length !== 11) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u624B\u673A\u53F7",
          icon: "none"
        });
        return;
      }
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
      if (!this.newPhone || this.newPhone.length !== 11) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u624B\u673A\u53F7",
          icon: "none"
        });
        return;
      }
      if (!this.verificationCode || this.verificationCode.length !== 6) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u9A8C\u8BC1\u7801",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "\u624B\u673A\u53F7\u4FEE\u6539\u6210\u529F",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack({
          delta: 2
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.newPhone,
    c: common_vendor.o(($event) => $data.newPhone = $event.detail.value),
    d: $data.verificationCode,
    e: common_vendor.o(($event) => $data.verificationCode = $event.detail.value),
    f: common_vendor.t($data.countdown > 0 ? `${$data.countdown}\u79D2\u540E\u91CD\u65B0\u53D1\u9001` : "\u53D1\u9001\u9A8C\u8BC1\u7801"),
    g: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    h: $data.countdown > 0,
    i: common_vendor.o((...args) => $options.confirmChange && $options.confirmChange(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/account/number/number_change.vue"]]);
wx.createPage(MiniProgramPage);
