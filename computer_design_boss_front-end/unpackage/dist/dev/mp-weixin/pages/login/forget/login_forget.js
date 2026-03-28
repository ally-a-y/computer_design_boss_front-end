"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var common_vendor = require("../../../common/vendor.js");
var common_api_user = require("../../../common/api/user.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      resetStep: 1,
      authMethod: "mobile",
      forgetForm: {
        mobile: "",
        email: "",
        sms_code: "",
        new_password: "",
        confirm_password: ""
      },
      showPassword: false,
      loading: false,
      isSendingSms: false,
      smsCountdown: 60,
      canSendSms: false
    };
  },
  computed: {
    smsBtnText() {
      if (this.isSendingSms) {
        return `${this.smsCountdown}s\u540E\u91CD\u65B0\u53D1\u9001`;
      }
      return "\u83B7\u53D6\u9A8C\u8BC1\u7801";
    },
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
    isPasswordFormValid() {
      const { new_password, confirm_password } = this.forgetForm;
      const passwordValid = new_password.length >= 8;
      const passwordMatch = new_password === confirm_password;
      return passwordValid && passwordMatch;
    }
  },
  methods: {
    handleInput() {
      if (this.authMethod === "mobile") {
        const mobileRegex = /^1[3-9]\d{9}$/;
        this.canSendSms = mobileRegex.test(this.forgetForm.mobile);
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.canSendSms = emailRegex.test(this.forgetForm.email);
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
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
          title: `${this.authMethod === "mobile" ? "\u624B\u673A" : "\u90AE\u7BB1"}\u9A8C\u8BC1\u7801\u53D1\u9001\u6210\u529F`,
          icon: "success"
        });
        this.startSmsCountdown();
      } catch (error) {
        console.error("\u53D1\u9001\u9A8C\u8BC1\u7801\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u9A8C\u8BC1\u7801\u53D1\u9001\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
          icon: "none"
        });
        this.isSendingSms = false;
      }
    },
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
    nextResetStep() {
      if (this.resetStep === 1 && this.isAuthFormValid) {
        this.resetStep = 2;
      }
    },
    prevResetStep() {
      if (this.resetStep === 2) {
        this.resetStep = 1;
      }
    },
    async handleResetPassword() {
      if (!this.isPasswordFormValid) {
        common_vendor.index.showToast({
          title: "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u5BC6\u7801\u4FE1\u606F",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        const resetData = __spreadProps(__spreadValues({}, this.authMethod === "mobile" ? { mobile: this.forgetForm.mobile } : { email: this.forgetForm.email }), {
          sms_code: this.forgetForm.sms_code,
          new_password: this.forgetForm.new_password
        });
        const res = await common_api_user.userApi.forgetPassword(resetData);
        if (res) {
          common_vendor.index.showToast({
            title: "\u5BC6\u7801\u91CD\u7F6E\u6210\u529F",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
          }, 1500);
        }
      } catch (error) {
        console.error("\u5BC6\u7801\u91CD\u7F6E\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: error.message || "\u5BC6\u7801\u91CD\u7F6E\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
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
    a: common_vendor.o($options.goToLogin),
    b: common_vendor.o(($event) => $event.target.style.color = "#007aff"),
    c: common_vendor.o(($event) => $event.target.style.color = "#1E1E1E"),
    d: common_vendor.o(($event) => $event.target.style.color = "#1E1E1E"),
    e: common_vendor.p({
      type: "back",
      size: "24",
      color: "#1E1E1E"
    }),
    f: $data.resetStep === 1
  }, $data.resetStep === 1 ? common_vendor.e({
    g: $data.authMethod === "mobile" ? 1 : "",
    h: common_vendor.o(($event) => $data.authMethod = "mobile"),
    i: $data.authMethod === "email" ? 1 : "",
    j: common_vendor.o(($event) => $data.authMethod = "email"),
    k: $data.authMethod === "mobile"
  }, $data.authMethod === "mobile" ? {
    l: common_vendor.p({
      type: "phone",
      size: "24",
      color: "#999"
    }),
    m: common_vendor.o([($event) => $data.forgetForm.mobile = $event.detail.value, (...args) => $options.handleInput && $options.handleInput(...args)]),
    n: $data.forgetForm.mobile
  } : {
    o: common_vendor.p({
      type: "email",
      size: "24",
      color: "#999"
    }),
    p: common_vendor.o([($event) => $data.forgetForm.email = $event.detail.value, (...args) => $options.handleInput && $options.handleInput(...args)]),
    q: $data.forgetForm.email
  }, {
    r: common_vendor.p({
      type: "chat",
      size: "24",
      color: "#999"
    }),
    s: $data.forgetForm.sms_code,
    t: common_vendor.o(($event) => $data.forgetForm.sms_code = $event.detail.value),
    v: common_vendor.t($options.smsBtnText),
    w: !$data.canSendSms || $data.isSendingSms,
    x: common_vendor.o((...args) => $options.sendSms && $options.sendSms(...args)),
    y: !$options.isAuthFormValid,
    z: common_vendor.o((...args) => $options.nextResetStep && $options.nextResetStep(...args))
  }) : {}, {
    A: $data.resetStep === 2
  }, $data.resetStep === 2 ? common_vendor.e({
    B: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    C: $data.forgetForm.new_password,
    D: common_vendor.o(($event) => $data.forgetForm.new_password = $event.detail.value),
    E: common_vendor.o($options.togglePassword),
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
    I: common_vendor.o(($event) => $data.forgetForm.confirm_password = $event.detail.value),
    J: $data.forgetForm.confirm_password && $data.forgetForm.new_password !== $data.forgetForm.confirm_password
  }, $data.forgetForm.confirm_password && $data.forgetForm.new_password !== $data.forgetForm.confirm_password ? {} : {}, {
    K: common_vendor.o((...args) => $options.prevResetStep && $options.prevResetStep(...args)),
    L: !$options.isPasswordFormValid,
    M: common_vendor.o((...args) => $options.handleResetPassword && $options.handleResetPassword(...args))
  }) : {}, {
    N: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-93dfe9d4"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/login/forget/login_forget.vue"]]);
wx.createPage(MiniProgramPage);
