"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_user = require("../../common/api/user.js");
const _sfc_main = {
  data() {
    return {
      // 选项卡状态
      activeTab: "login",
      // login 或 register
      // 登录表单数据
      loginForm: {
        mobile: "",
        password: "",
        sms_code: ""
      },
      // 登录方式
      loginMethod: "sms",
      // sms 或 password
      // 注册表单数据
      registerForm: {
        mobile: "",
        sms_code: "",
        password: "",
        confirm_password: ""
      },
      // 密码显示状态
      showPassword: false,
      // 加载状态
      loading: false,
      // 验证码相关
      isSendingSms: false,
      smsCountdown: 60,
      canSendSms: false,
      // 注册验证码相关
      isSendingRegisterSms: false,
      registerSmsCountdown: 60,
      canSendRegisterSms: false
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
    // 注册验证码按钮文本
    registerSmsBtnText() {
      if (this.isSendingRegisterSms) {
        return `${this.registerSmsCountdown}s后重新发送`;
      }
      return "获取验证码";
    },
    // 登录表单验证
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
    // 注册表单验证（步骤1：账号设置）
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
    // 处理手机号输入
    handleMobileInput() {
      const mobileRegex = /^1[3-9]\d{9}$/;
      this.canSendSms = mobileRegex.test(this.loginForm.mobile);
    },
    // 处理注册手机号输入
    handleRegisterMobileInput() {
      const mobileRegex = /^1[3-9]\d{9}$/;
      this.canSendRegisterSms = mobileRegex.test(this.registerForm.mobile);
    },
    // 切换密码显示/隐藏
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    // 发送登录验证码
    async sendSms() {
      if (!this.canSendSms)
        return;
      try {
        this.isSendingSms = true;
        await new Promise((resolve) => setTimeout(resolve, 500));
        common_vendor.index.showToast({
          title: "验证码发送成功",
          icon: "success"
        });
        this.startSmsCountdown();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:375", "发送验证码失败:", error);
        common_vendor.index.showToast({
          title: "验证码发送失败，请稍后重试",
          icon: "none"
        });
        this.isSendingSms = false;
      }
    },
    // 发送注册验证码
    async sendRegisterSms() {
      if (!this.canSendRegisterSms)
        return;
      try {
        this.isSendingRegisterSms = true;
        await new Promise((resolve) => setTimeout(resolve, 500));
        common_vendor.index.showToast({
          title: "验证码发送成功",
          icon: "success"
        });
        this.startRegisterSmsCountdown();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:402", "发送验证码失败:", error);
        common_vendor.index.showToast({
          title: "验证码发送失败，请稍后重试",
          icon: "none"
        });
        this.isSendingRegisterSms = false;
      }
    },
    // 登录验证码倒计时
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
    // 注册验证码倒计时
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
    // 处理登录
    async handleLogin() {
      if (!this.isLoginFormValid) {
        common_vendor.index.showToast({
          title: "请填写正确的登录信息",
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
        common_vendor.index.__f__("log", "at pages/login/login.vue:468", "登录响应:", res);
        if (res && res.token) {
          common_vendor.index.setStorageSync("token", res.token);
          common_vendor.index.setStorageSync("userInfo", JSON.stringify(res.user_info));
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index_index"
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.message || "登录失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:493", "登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败，请稍后重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 跳转到忘记密码页面
    goToForgetPassword() {
      common_vendor.index.navigateTo({
        url: "/pages/login/forget/login_forget"
      });
    },
    // 跳转到单独的注册页面
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
    a: common_vendor.t($data.activeTab === "login" ? "登录" : "注册"),
    b: common_vendor.t($data.activeTab === "login" ? "欢迎回来" : "创建账号"),
    c: $data.activeTab === "login" ? 1 : "",
    d: common_vendor.o(($event) => $data.activeTab = "login", "e1"),
    e: $data.activeTab === "register" ? 1 : "",
    f: common_vendor.o(($event) => $data.activeTab = "register", "2c"),
    g: $data.activeTab === "login"
  }, $data.activeTab === "login" ? common_vendor.e({
    h: $data.loginMethod === "sms" ? 1 : "",
    i: common_vendor.o(($event) => $data.loginMethod = "sms", "27"),
    j: $data.loginMethod === "password" ? 1 : "",
    k: common_vendor.o(($event) => $data.loginMethod = "password", "8a"),
    l: common_vendor.p({
      type: "phone",
      size: "20",
      color: "#999"
    }),
    m: common_vendor.o([($event) => $data.loginForm.mobile = $event.detail.value, (...args) => $options.handleMobileInput && $options.handleMobileInput(...args)], "58"),
    n: $data.loginForm.mobile,
    o: $data.loginMethod === "sms"
  }, $data.loginMethod === "sms" ? {
    p: common_vendor.p({
      type: "chat",
      size: "20",
      color: "#999"
    }),
    q: $data.loginForm.sms_code,
    r: common_vendor.o(($event) => $data.loginForm.sms_code = $event.detail.value, "48"),
    s: common_vendor.t($options.smsBtnText),
    t: $data.isSendingSms ? 1 : "",
    v: !$data.canSendSms || $data.isSendingSms,
    w: common_vendor.o((...args) => $options.sendSms && $options.sendSms(...args), "1a")
  } : {}, {
    x: $data.loginMethod === "password"
  }, $data.loginMethod === "password" ? {
    y: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    z: $data.loginForm.password,
    A: common_vendor.o(($event) => $data.loginForm.password = $event.detail.value, "87"),
    B: common_vendor.o($options.togglePassword, "5f"),
    C: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#999"
    }),
    D: common_vendor.o((...args) => $options.goToForgetPassword && $options.goToForgetPassword(...args), "8f")
  } : {}, {
    E: !$options.isLoginFormValid,
    F: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args), "43")
  }) : {}, {
    G: $data.activeTab === "register"
  }, $data.activeTab === "register" ? common_vendor.e({
    H: common_vendor.p({
      type: "phone",
      size: "20",
      color: "#999"
    }),
    I: common_vendor.o([($event) => $data.registerForm.mobile = $event.detail.value, (...args) => $options.handleRegisterMobileInput && $options.handleRegisterMobileInput(...args)], "18"),
    J: $data.registerForm.mobile,
    K: common_vendor.p({
      type: "chat",
      size: "20",
      color: "#999"
    }),
    L: $data.registerForm.sms_code,
    M: common_vendor.o(($event) => $data.registerForm.sms_code = $event.detail.value, "9b"),
    N: common_vendor.t($options.registerSmsBtnText),
    O: $data.isSendingRegisterSms ? 1 : "",
    P: !$data.canSendRegisterSms || $data.isSendingRegisterSms,
    Q: common_vendor.o((...args) => $options.sendRegisterSms && $options.sendRegisterSms(...args), "5f"),
    R: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    S: $data.registerForm.password,
    T: common_vendor.o(($event) => $data.registerForm.password = $event.detail.value, "b6"),
    U: common_vendor.o($options.togglePassword, "ee"),
    V: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "20",
      color: "#999"
    }),
    W: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    X: $data.registerForm.confirm_password,
    Y: common_vendor.o(($event) => $data.registerForm.confirm_password = $event.detail.value, "0c"),
    Z: $data.registerForm.confirm_password && $data.registerForm.password !== $data.registerForm.confirm_password
  }, $data.registerForm.confirm_password && $data.registerForm.password !== $data.registerForm.confirm_password ? {} : {}, {
    aa: !$options.isRegisterFormValid,
    ab: common_vendor.o((...args) => $options.goToRegisterPage && $options.goToRegisterPage(...args), "7a"),
    ac: common_vendor.o(($event) => $data.activeTab = "login", "54")
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
