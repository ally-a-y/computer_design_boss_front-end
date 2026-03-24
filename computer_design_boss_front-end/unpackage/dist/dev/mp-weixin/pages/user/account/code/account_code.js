"use strict";
const common_vendor = require("../../../../common/vendor.js");
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
    confirmChange() {
      if (!this.verificationCode) {
        common_vendor.index.showToast({
          title: "请输入验证码",
          icon: "none"
        });
        return;
      }
      if (!this.newPassword) {
        common_vendor.index.showToast({
          title: "请输入新密码",
          icon: "none"
        });
        return;
      }
      if (this.newPassword.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度不能少于6位",
          icon: "none"
        });
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "密码修改成功",
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
    e: common_vendor.t($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"),
    f: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    g: $data.countdown > 0,
    h: $data.newPassword,
    i: common_vendor.o(($event) => $data.newPassword = $event.detail.value),
    j: $data.confirmPassword,
    k: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    l: common_vendor.o((...args) => $options.confirmChange && $options.confirmChange(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/user/account/code/account_code.js.map
