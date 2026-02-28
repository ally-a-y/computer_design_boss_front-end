"use strict";
var common_vendor = require("../../common/vendor.js");
var common_api_user = require("../../common/api/user.js");
require("../../common/api/request.js");
require("../../common/config.js");
const _sfc_main = {
  data() {
    return {
      activeTab: "login",
      loginForm: {
        mobile: "",
        password: "",
        sms_code: ""
      },
      loginMethod: "sms",
      registerForm: {
        mobile: "",
        sms_code: "",
        password: "",
        confirm_password: ""
      },
      showPassword: false,
      loading: false,
      isSendingSms: false,
      smsCountdown: 60,
      canSendSms: false,
      isSendingRegisterSms: false,
      registerSmsCountdown: 60,
      canSendRegisterSms: false
    };
  },
  computed: {
    smsBtnText() {
      if (this.isSendingSms) {
        return `${this.smsCountdown}s\u540E\u91CD\u65B0\u53D1\u9001`;
      }
      return "\u83B7\u53D6\u9A8C\u8BC1\u7801";
    },
    registerSmsBtnText() {
      if (this.isSendingRegisterSms) {
        return `${this.registerSmsCountdown}s\u540E\u91CD\u65B0\u53D1\u9001`;
      }
      return "\u83B7\u53D6\u9A8C\u8BC1\u7801";
    },
    isLoginFormValid() {
      const { mobile, password, sms_code } = this.loginForm;
      const mobileRegex = /^1[3-9]\d{9}$/;
      if (!mobileRegex.test(mobile)) {
        return false;
      }
      if (this.loginMethod === "sms") {
        const smsRegex = /^\d{6}$/;
        return smsRegex.test(sms_code);
      } else {
        return password.length >= 8;
      }
    },
    isRegisterFormValid() {
      const { mobile, sms_code, password, confirm_password } = this.registerForm;
      const mobileRegex = /^1[3-9]\d{9}$/;
      const smsRegex = /^\d{6}$/;
      const passwordValid = password.length >= 8;
      const passwordMatch = password === confirm_password;
      return mobileRegex.test(mobile) && smsRegex.test(sms_code) && passwordValid && passwordMatch;
    }
  },
  methods: {
    handleMobileInput() {
      const mobileRegex = /^1[3-9]\d{9}$/;
      this.canSendSms = mobileRegex.test(this.loginForm.mobile);
    },
    handleRegisterMobileInput() {
      const mobileRegex = /^1[3-9]\d{9}$/;
      this.canSendRegisterSms = mobileRegex.test(this.registerForm.mobile);
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async sendSms() {
      if (!this.canSendSms)
        return;
      try {
        this.isSendingSms = true;
        await new Promise((resolve) => setTimeout(resolve, 500));
        common_vendor.index.showToast({
          title: "\u9A8C\u8BC1\u7801\u53D1\u9001\u6210\u529F",
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
    async sendRegisterSms() {
      if (!this.canSendRegisterSms)
        return;
      try {
        this.isSendingRegisterSms = true;
        await new Promise((resolve) => setTimeout(resolve, 500));
        common_vendor.index.showToast({
          title: "\u9A8C\u8BC1\u7801\u53D1\u9001\u6210\u529F",
          icon: "success"
        });
        this.startRegisterSmsCountdown();
      } catch (error) {
        console.error("\u53D1\u9001\u9A8C\u8BC1\u7801\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u9A8C\u8BC1\u7801\u53D1\u9001\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
          icon: "none"
        });
        this.isSendingRegisterSms = false;
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
    startRegisterSmsCountdown() {
      const countdownTimer = setInterval(() => {
        this.registerSmsCountdown--;
        if (this.registerSmsCountdown <= 0) {
          clearInterval(countdownTimer);
          this.isSendingRegisterSms = false;
          this.registerSmsCountdown = 60;
        }
      }, 1e3);
    },
    async handleLogin() {
      if (!this.isLoginFormValid) {
        common_vendor.index.showToast({
          title: "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u767B\u5F55\u4FE1\u606F",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        let res;
        if (this.loginMethod === "sms") {
          const loginData = {
            mobile: this.loginForm.mobile,
            sms_code: this.loginForm.sms_code
          };
          res = await common_api_user.userApi.smsLogin(loginData);
        } else {
          const loginData = {
            mobile: this.loginForm.mobile,
            password: this.loginForm.password
          };
          res = await common_api_user.userApi.login(loginData);
        }
        console.log("\u767B\u5F55\u54CD\u5E94:", res);
        if (res && res.token) {
          common_vendor.index.setStorageSync("token", res.token);
          common_vendor.index.setStorageSync("userInfo", JSON.stringify(res.user_info));
          common_vendor.index.showToast({
            title: "\u767B\u5F55\u6210\u529F",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index_index"
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.message || "\u767B\u5F55\u5931\u8D25",
            icon: "none"
          });
        }
      } catch (error) {
        console.error("\u767B\u5F55\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: error.message || "\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    goToForgetPassword() {
      common_vendor.index.navigateTo({
        url: "/pages/login/forget/login_forget"
      });
    },
    goToRegisterPage() {
      common_vendor.index.navigateTo({
        url: "/pages/login/register/login_reister?registerData=" + encodeURIComponent(JSON.stringify(this.registerForm))
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
    a: $data.activeTab === "login" ? 1 : "",
    b: common_vendor.o(($event) => $data.activeTab = "login"),
    c: $data.activeTab === "register" ? 1 : "",
    d: common_vendor.o(($event) => $data.activeTab = "register"),
    e: $data.activeTab === "login"
  }, $data.activeTab === "login" ? common_vendor.e({
    f: $data.loginMethod === "sms" ? 1 : "",
    g: common_vendor.o(($event) => $data.loginMethod = "sms"),
    h: $data.loginMethod === "password" ? 1 : "",
    i: common_vendor.o(($event) => $data.loginMethod = "password"),
    j: common_vendor.p({
      type: "phone",
      size: "24",
      color: "#999"
    }),
    k: common_vendor.o([($event) => $data.loginForm.mobile = $event.detail.value, (...args) => $options.handleMobileInput && $options.handleMobileInput(...args)]),
    l: $data.loginForm.mobile,
    m: $data.loginMethod === "sms"
  }, $data.loginMethod === "sms" ? {
    n: common_vendor.p({
      type: "chat",
      size: "24",
      color: "#999"
    }),
    o: $data.loginForm.sms_code,
    p: common_vendor.o(($event) => $data.loginForm.sms_code = $event.detail.value),
    q: common_vendor.t($options.smsBtnText),
    r: !$data.canSendSms || $data.isSendingSms,
    s: common_vendor.o((...args) => $options.sendSms && $options.sendSms(...args))
  } : {}, {
    t: $data.loginMethod === "password"
  }, $data.loginMethod === "password" ? {
    v: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    w: $data.loginForm.password,
    x: common_vendor.o(($event) => $data.loginForm.password = $event.detail.value),
    y: common_vendor.o($options.togglePassword),
    z: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    })
  } : {}, {
    A: !$options.isLoginFormValid,
    B: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    C: common_vendor.o((...args) => $options.goToForgetPassword && $options.goToForgetPassword(...args))
  }) : {}, {
    D: $data.activeTab === "register"
  }, $data.activeTab === "register" ? common_vendor.e({
    E: common_vendor.p({
      type: "phone",
      size: "24",
      color: "#999"
    }),
    F: common_vendor.o([($event) => $data.registerForm.mobile = $event.detail.value, (...args) => $options.handleRegisterMobileInput && $options.handleRegisterMobileInput(...args)]),
    G: $data.registerForm.mobile,
    H: common_vendor.p({
      type: "chat",
      size: "24",
      color: "#999"
    }),
    I: $data.registerForm.sms_code,
    J: common_vendor.o(($event) => $data.registerForm.sms_code = $event.detail.value),
    K: common_vendor.t($options.registerSmsBtnText),
    L: !$data.canSendRegisterSms || $data.isSendingRegisterSms,
    M: common_vendor.o((...args) => $options.sendRegisterSms && $options.sendRegisterSms(...args)),
    N: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    O: $data.registerForm.password,
    P: common_vendor.o(($event) => $data.registerForm.password = $event.detail.value),
    Q: common_vendor.o($options.togglePassword),
    R: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    }),
    S: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#999"
    }),
    T: $data.registerForm.confirm_password,
    U: common_vendor.o(($event) => $data.registerForm.confirm_password = $event.detail.value),
    V: $data.registerForm.confirm_password && $data.registerForm.password !== $data.registerForm.confirm_password
  }, $data.registerForm.confirm_password && $data.registerForm.password !== $data.registerForm.confirm_password ? {} : {}, {
    W: !$options.isRegisterFormValid,
    X: common_vendor.o((...args) => $options.goToRegisterPage && $options.goToRegisterPage(...args))
  }) : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b237504c"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
