"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_user = require("../../../common/api/user.js");
const _sfc_main = {
  data() {
    return {
      // 重置步骤
      resetStep: 1,
      // 1: 身份验证, 2: 密码重置
      // 验证方式
      authMethod: "mobile",
      // mobile 或 email
      // 表单数据
      forgetForm: {
        mobile: "",
        email: "",
        sms_code: "",
        new_password: "",
        confirm_password: ""
      },
      // 密码显示状态
      showPassword: false,
      // 加载状态
      loading: false,
      // 验证码相关
      isSendingSms: false,
      smsCountdown: 60,
      canSendSms: false
    };
  },
  computed: {
    // 验证码按钮文本
    smsBtnText() {
      if (this.isSendingSms) {
        return `${this.smsCountdown}s后重新发送`;
      }
      return "获取验证码";
    },
    // 身份验证表单验证
    isAuthFormValid() {
      const { mobile, email, sms_code } = this.forgetForm;
      const mobileRegex = /^1[3-9]\d{9}$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const smsRegex = /^\d{6}$/;
      if (this.authMethod === "mobile") {
        return mobileRegex.test(mobile) && smsRegex.test(sms_code);
      } else {
        return emailRegex.test(email) && smsRegex.test(sms_code);
      }
    },
    // 密码表单验证
    isPasswordFormValid() {
      const { new_password, confirm_password } = this.forgetForm;
      const passwordValid = new_password.length >= 8;
      const passwordMatch = new_password === confirm_password;
      return passwordValid && passwordMatch;
    }
  },
  methods: {
    // 处理输入
    handleInput() {
      if (this.authMethod === "mobile") {
        const mobileRegex = /^1[3-9]\d{9}$/;
        this.canSendSms = mobileRegex.test(this.forgetForm.mobile);
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.canSendSms = emailRegex.test(this.forgetForm.email);
      }
    },
    // 切换密码显示/隐藏
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    // 发送验证码
    async sendSms() {
      if (!this.canSendSms)
        return;
      try {
        this.isSendingSms = true;
        const smsData = {
          type: this.authMethod,
          value: this.authMethod === "mobile" ? this.forgetForm.mobile : this.forgetForm.email
        };
        await new Promise((resolve) => setTimeout(resolve, 500));
        common_vendor.index.showToast({
          title: `${this.authMethod === "mobile" ? "手机" : "邮箱"}验证码发送成功`,
          icon: "success"
        });
        this.startSmsCountdown();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/forget/login_forget.vue:282", "发送验证码失败:", error);
        common_vendor.index.showToast({
          title: "验证码发送失败，请稍后重试",
          icon: "none"
        });
        this.isSendingSms = false;
      }
    },
    // 验证码倒计时
    startSmsCountdown() {
      const countdownTimer = setInterval(() => {
        this.smsCountdown--;
        if (this.smsCountdown <= 0) {
          clearInterval(countdownTimer);
          this.isSendingSms = false;
          this.smsCountdown = 60;
        }
      }, 1e3);
    },
    // 进入下一步
    nextResetStep() {
      if (this.resetStep === 1 && this.isAuthFormValid) {
        this.resetStep = 2;
      }
    },
    // 返回上一步
    prevResetStep() {
      if (this.resetStep === 2) {
        this.resetStep = 1;
      }
    },
    // 处理密码重置
    async handleResetPassword() {
      if (!this.isPasswordFormValid) {
        common_vendor.index.showToast({
          title: "请填写正确的密码信息",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        const resetData = {
          ...this.authMethod === "mobile" ? { mobile: this.forgetForm.mobile } : { email: this.forgetForm.email },
          sms_code: this.forgetForm.sms_code,
          new_password: this.forgetForm.new_password
        };
        const res = await common_api_user.userApi.forgetPassword(resetData);
        if (res) {
          common_vendor.index.showToast({
            title: "密码重置成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/forget/login_forget.vue:356", "密码重置失败:", error);
        common_vendor.index.showToast({
          title: error.message || "密码重置失败，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 跳转到登录页面
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.goToLogin, "34"),
    b: common_vendor.o(($event) => $event.target.style.color = "#007aff", "32"),
    c: common_vendor.o(($event) => $event.target.style.color = "#1E1E1E", "0c"),
    d: common_vendor.o(($event) => $event.target.style.color = "#1E1E1E", "14"),
    e: common_vendor.p({
      type: "back",
      size: "24",
      color: "#1E1E1E"
    }),
    f: $data.resetStep === 1
  }, $data.resetStep === 1 ? common_vendor.e({
    g: $data.authMethod === "mobile" ? 1 : "",
    h: common_vendor.o(($event) => $data.authMethod = "mobile", "62"),
    i: $data.authMethod === "email" ? 1 : "",
    j: common_vendor.o(($event) => $data.authMethod = "email", "5e"),
    k: $data.authMethod === "mobile"
  }, $data.authMethod === "mobile" ? {
    l: common_vendor.p({
      type: "phone",
      size: "24",
      color: "#999"
    }),
    m: common_vendor.o([($event) => $data.forgetForm.mobile = $event.detail.value, (...args) => $options.handleInput && $options.handleInput(...args)], "23"),
    n: $data.forgetForm.mobile
  } : {
    o: common_vendor.p({
      type: "email",
      size: "24",
      color: "#999"
    }),
    p: common_vendor.o([($event) => $data.forgetForm.email = $event.detail.value, (...args) => $options.handleInput && $options.handleInput(...args)], "a9"),
    q: $data.forgetForm.email
  }, {
    r: common_vendor.p({
      type: "chat",
      size: "24",
      color: "#999"
    }),
    s: $data.forgetForm.sms_code,
    t: common_vendor.o(($event) => $data.forgetForm.sms_code = $event.detail.value, "2d"),
    v: common_vendor.t($options.smsBtnText),
    w: !$data.canSendSms || $data.isSendingSms,
    x: common_vendor.o((...args) => $options.sendSms && $options.sendSms(...args), "32"),
    y: !$options.isAuthFormValid,
    z: common_vendor.o((...args) => $options.nextResetStep && $options.nextResetStep(...args), "38")
  }) : {}, {
    A: $data.resetStep === 2
  }, $data.resetStep === 2 ? common_vendor.e({
    B: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    C: $data.forgetForm.new_password,
    D: common_vendor.o(($event) => $data.forgetForm.new_password = $event.detail.value, "1e"),
    E: common_vendor.o($options.togglePassword, "41"),
    F: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    }),
    G: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    H: $data.forgetForm.confirm_password,
    I: common_vendor.o(($event) => $data.forgetForm.confirm_password = $event.detail.value, "ad"),
    J: $data.forgetForm.confirm_password && $data.forgetForm.new_password !== $data.forgetForm.confirm_password
  }, $data.forgetForm.confirm_password && $data.forgetForm.new_password !== $data.forgetForm.confirm_password ? {} : {}, {
    K: common_vendor.o((...args) => $options.prevResetStep && $options.prevResetStep(...args), "bc"),
    L: !$options.isPasswordFormValid,
    M: common_vendor.o((...args) => $options.handleResetPassword && $options.handleResetPassword(...args), "5f")
  }) : {}, {
    N: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args), "31")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-30052982"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/login/forget/login_forget.js.map
