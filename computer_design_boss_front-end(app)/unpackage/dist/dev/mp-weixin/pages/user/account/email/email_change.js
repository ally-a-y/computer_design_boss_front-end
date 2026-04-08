"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      newEmail: "",
      verificationCode: "",
      countdown: 0
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    sendCode() {
      if (!this.newEmail) {
        common_vendor.index.showToast({
          title: "请输入正确的邮箱地址",
          icon: "none"
        });
        return;
      }
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
      if (!this.newEmail) {
        common_vendor.index.showToast({
          title: "请输入正确的邮箱地址",
          icon: "none"
        });
        return;
      }
      if (!this.verificationCode) {
        common_vendor.index.showToast({
          title: "请输入正确的验证码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "邮箱修改成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack({
          delta: 2
          // 返回两级，回到账号页面
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "56"),
    b: $data.newEmail,
    c: common_vendor.o(($event) => $data.newEmail = $event.detail.value, "bb"),
    d: $data.verificationCode,
    e: common_vendor.o(($event) => $data.verificationCode = $event.detail.value, "1b"),
    f: common_vendor.t($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"),
    g: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args), "45"),
    h: $data.countdown > 0,
    i: common_vendor.o((...args) => $options.confirmChange && $options.confirmChange(...args), "b5")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/user/account/email/email_change.js.map
