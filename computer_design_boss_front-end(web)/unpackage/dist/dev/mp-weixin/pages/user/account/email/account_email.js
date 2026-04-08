"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentEmail: "zhangsan@example.com",
      verificationCode: "",
      countdown: 0
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    sendCode() {
      common_vendor.index.showToast({
        title: "验证码发送成功",
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
    verifyCode() {
      if (!this.verificationCode.trim()) {
        common_vendor.index.showToast({
          title: "请输入验证码",
          icon: "none"
        });
        return;
      }
      if (this.verificationCode === "123456") {
        common_vendor.index.navigateTo({
          url: "/pages/user/account/email/email_change"
        });
      } else {
        common_vendor.index.showToast({
          title: "验证码错误",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "56"),
    b: common_vendor.t($data.currentEmail),
    c: $data.verificationCode,
    d: common_vendor.o(($event) => $data.verificationCode = $event.detail.value, "f8"),
    e: common_vendor.t($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"),
    f: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args), "5a"),
    g: $data.countdown > 0,
    h: common_vendor.o((...args) => $options.verifyCode && $options.verifyCode(...args), "15")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/user/account/email/account_email.js.map
