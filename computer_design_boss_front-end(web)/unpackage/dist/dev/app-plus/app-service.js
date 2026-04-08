if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _imports_0$2 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$t = {
    data() {
      return {};
    },
    onLoad() {
      const token = uni.getStorageSync("token");
      setTimeout(() => {
        if (token) {
          uni.switchTab({
            url: "/pages/index/index_index"
          });
        } else {
          uni.navigateTo({
            url: "/pages/login/login"
          });
        }
      }, 2e3);
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "splash-container" }, [
      vue.createElementVNode("view", { class: "splash-content" }, [
        vue.createElementVNode("image", {
          src: _imports_0$2,
          class: "splash-logo",
          mode: "aspectFit"
        }),
        vue.createElementVNode("text", { class: "splash-text" }, "小菜鸟")
      ])
    ]);
  }
  const PagesSplashSplash = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-b5d3b004"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/splash/splash.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const config = {
    development: {
      baseURL: "http://39.106.72.110/api",
      staticURL: "http://39.106.72.110",
      // 添加兼容命名
      apiBase: "http://39.106.72.110/api",
      fileBase: "http://39.106.72.110"
    },
    production: {
      baseURL: "https://39.106.72.110/api",
      staticURL: "https://39.106.72.110",
      apiBase: "https://39.106.72.110/api",
      fileBase: "https://39.106.72.110"
    }
  };
  const env = "development";
  const config$1 = config[env];
  const requestCache = /* @__PURE__ */ new Map();
  const CACHE_EXPIRY = 5 * 60 * 1e3;
  const buildFullUrl = (path, params) => {
    if (!path)
      return config$1.baseURL;
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    let baseUrl = config$1.baseURL;
    let finalPath = normalizedPath;
    if (baseUrl.endsWith("/api") && normalizedPath.startsWith("/api/")) {
      finalPath = normalizedPath.substring(4);
    }
    let url = baseUrl + finalPath;
    if (params && typeof params === "object" && Object.keys(params).length > 0) {
      const queryString = Object.keys(params).filter((key) => params[key] !== void 0 && params[key] !== null && params[key] !== "").map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    return url;
  };
  const generateCacheKey = (url, params) => {
    const fullUrl = buildFullUrl(url, params);
    return fullUrl;
  };
  const getCachedData = (cacheKey) => {
    const cached = requestCache.get(cacheKey);
    if (cached) {
      const { data, timestamp } = cached;
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
      requestCache.delete(cacheKey);
    }
    return null;
  };
  const setCachedData = (cacheKey, data) => {
    requestCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  };
  const requestWithRetry = (options, retryCount = 3) => {
    return new Promise((resolve, reject) => {
      const isGet = (options.method || "GET").toUpperCase() === "GET";
      if (isGet && !options.noCache) {
        const cacheKey = generateCacheKey(options.url, options.params || options.data);
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
          return resolve(cachedData);
        }
      }
      const attemptRequest = (attempt) => {
        const queryParams = isGet ? { ...options.params || {}, ...options.data || {} } : options.params || {};
        const fullUrl = buildFullUrl(options.url, queryParams);
        const urlWithTimestamp = fullUrl + (fullUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
        const requestConfig = {
          url: urlWithTimestamp,
          method: options.method || "GET",
          timeout: 6e4,
          sslVerify: false,
          header: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            ...options.header
          }
        };
        const token = uni.getStorageSync("token");
        if (token) {
          requestConfig.header["Authorization"] = `Bearer ${token}`;
        }
        if (!isGet && options.data) {
          requestConfig.data = options.data;
        }
        uni.request({
          ...requestConfig,
          success: (res) => {
            var _a;
            if (res.statusCode === 200) {
              const data = res.data;
              if (data && typeof data === "object" && "code" in data) {
                if (data.code === 200) {
                  const result = data.data !== void 0 ? data.data : data;
                  if (isGet && !options.noCache) {
                    const cacheKey = generateCacheKey(options.url, options.params || options.data);
                    setCachedData(cacheKey, result);
                  }
                  resolve(result);
                } else {
                  reject(new Error(data.message || `请求失败: ${data.code}`));
                }
              } else {
                if (isGet && !options.noCache) {
                  const cacheKey = generateCacheKey(options.url, options.params || options.data);
                  setCachedData(cacheKey, data);
                }
                resolve(data);
              }
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${((_a = res.data) == null ? void 0 : _a.message) || ""}`));
            }
          },
          fail: (err) => {
            if (attempt < retryCount - 1) {
              const delay = Math.pow(2, attempt) * 500;
              setTimeout(() => attemptRequest(attempt + 1), delay);
            } else {
              reject(new Error(err.errMsg || "网络请求失败"));
            }
          }
        });
      };
      attemptRequest(0);
    });
  };
  const userApi = {
    // 用户登录
    login: (loginData) => {
      return requestWithRetry({
        url: "/api/user/login",
        method: "POST",
        data: loginData
      });
    },
    // 手机号验证码登录
    smsLogin: (loginData) => {
      return requestWithRetry({
        url: "/api/user/sms_login",
        method: "POST",
        data: loginData
      });
    },
    // 用户注册
    register: (registerData) => {
      return requestWithRetry({
        url: "/api/user/register",
        method: "POST",
        data: registerData
      });
    },
    // 发送验证码
    sendSmsCode: (data) => {
      return requestWithRetry({
        url: "/api/user/send_sms",
        method: "POST",
        data
      });
    },
    // 忘记密码
    forgetPassword: (resetData) => {
      return requestWithRetry({
        url: "/api/user/forget_password",
        method: "POST",
        data: resetData
      });
    },
    // 获取用户信息
    getUserProfile: () => {
      return requestWithRetry({
        url: "/api/user/profile",
        method: "GET"
      });
    },
    // 获取用户名称和头像
    getUserNameAndAvatar: () => {
      return requestWithRetry({
        url: "/api/user/get_name_and_avatar",
        method: "GET"
      });
    },
    // 更新用户信息
    updateUserProfile: (profileData) => {
      return requestWithRetry({
        url: "/api/user/profile",
        method: "PUT",
        data: profileData
      });
    },
    // 修改密码
    updatePassword: (passwordData) => {
      return requestWithRetry({
        url: "/api/user/password",
        method: "PUT",
        data: passwordData
      });
    },
    // 更新头像
    updateAvatar: (avatarData) => {
      return requestWithRetry({
        url: "/api/user/avatar",
        method: "POST",
        data: avatarData
      });
    },
    // 获取用户状态
    getUserStatus: () => {
      return requestWithRetry({
        url: "/api/user/status",
        method: "GET"
      });
    },
    // 用户登出
    logout: () => {
      return requestWithRetry({
        url: "/api/user/logout",
        method: "POST"
      });
    }
  };
  const _sfc_main$s = {
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
          uni.showToast({
            title: "验证码发送成功",
            icon: "success"
          });
          this.startSmsCountdown();
        } catch (error) {
          formatAppLog("error", "at pages/login/login.vue:375", "发送验证码失败:", error);
          uni.showToast({
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
          uni.showToast({
            title: "验证码发送成功",
            icon: "success"
          });
          this.startRegisterSmsCountdown();
        } catch (error) {
          formatAppLog("error", "at pages/login/login.vue:402", "发送验证码失败:", error);
          uni.showToast({
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
          uni.showToast({
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
            res = await userApi.smsLogin(loginData);
          } else {
            const loginData = {
              mobile: this.loginForm.mobile,
              password: this.loginForm.password
            };
            res = await userApi.login(loginData);
          }
          formatAppLog("log", "at pages/login/login.vue:468", "登录响应:", res);
          if (res && res.token) {
            uni.setStorageSync("token", res.token);
            uni.setStorageSync("userInfo", JSON.stringify(res.user_info));
            uni.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              uni.switchTab({
                url: "/pages/index/index_index"
              });
            }, 1500);
          } else {
            uni.showToast({
              title: res.message || "登录失败",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/login/login.vue:493", "登录失败:", error);
          uni.showToast({
            title: error.message || "登录失败，请稍后重试",
            icon: "none"
          });
        } finally {
          this.loading = false;
        }
      },
      // 跳转到忘记密码页面
      goToForgetPassword() {
        uni.navigateTo({
          url: "/pages/login/forget/login_forget"
        });
      },
      // 跳转到单独的注册页面
      goToRegisterPage() {
        uni.navigateTo({
          url: "/pages/login/register/login_reister?registerData=" + encodeURIComponent(JSON.stringify(this.registerForm))
        });
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("view", { class: "nav-bar-left" }),
        vue.createElementVNode("view", { class: "nav-bar-center" }, [
          vue.createElementVNode(
            "text",
            { class: "nav-bar-title" },
            vue.toDisplayString($data.activeTab === "login" ? "登录" : "注册"),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "nav-bar-right" })
      ]),
      vue.createElementVNode("view", { class: "login-container" }, [
        vue.createElementVNode("view", { class: "login-header" }, [
          vue.createElementVNode("text", { class: "login-title" }, "小菜鸟"),
          vue.createElementVNode(
            "text",
            { class: "login-subtitle" },
            vue.toDisplayString($data.activeTab === "login" ? "欢迎回来" : "创建账号"),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "tab-container" }, [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "login" }]),
              onClick: _cache[0] || (_cache[0] = ($event) => $data.activeTab = "login")
            },
            [
              vue.createElementVNode("text", { class: "tab-text" }, "登录")
            ],
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["tab-item", { active: $data.activeTab === "register" }]),
              onClick: _cache[1] || (_cache[1] = ($event) => $data.activeTab = "register")
            },
            [
              vue.createElementVNode("text", { class: "tab-text" }, "注册")
            ],
            2
            /* CLASS */
          )
        ]),
        vue.createElementVNode("view", { class: "form-container" }, [
          $data.activeTab === "login" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "login-form"
          }, [
            vue.createElementVNode("view", { class: "login-method" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["method-item", { active: $data.loginMethod === "sms" }]),
                  onClick: _cache[2] || (_cache[2] = ($event) => $data.loginMethod = "sms")
                },
                [
                  vue.createElementVNode("text", { class: "method-text" }, "验证码登录")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["method-item", { active: $data.loginMethod === "password" }]),
                  onClick: _cache[3] || (_cache[3] = ($event) => $data.loginMethod = "password")
                },
                [
                  vue.createElementVNode("text", { class: "method-text" }, "密码登录")
                ],
                2
                /* CLASS */
              )
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "phone",
                  size: "20",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    id: "login-mobile",
                    name: "mobile",
                    placeholder: "请输入手机号",
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.loginForm.mobile = $event),
                    class: "form-input",
                    maxlength: "11",
                    onInput: _cache[5] || (_cache[5] = (...args) => $options.handleMobileInput && $options.handleMobileInput(...args))
                  },
                  null,
                  544
                  /* NEED_HYDRATION, NEED_PATCH */
                ), [
                  [vue.vModelText, $data.loginForm.mobile]
                ])
              ])
            ]),
            $data.loginMethod === "sms" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "form-item"
            }, [
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "chat",
                  size: "20",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    id: "login-sms-code",
                    name: "sms_code",
                    placeholder: "请输入验证码",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.loginForm.sms_code = $event),
                    class: "form-input",
                    maxlength: "6"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.loginForm.sms_code]
                ]),
                vue.createElementVNode("button", {
                  class: vue.normalizeClass(["sms-btn", { "counting": $data.isSendingSms }]),
                  disabled: !$data.canSendSms || $data.isSendingSms,
                  onClick: _cache[7] || (_cache[7] = (...args) => $options.sendSms && $options.sendSms(...args))
                }, vue.toDisplayString($options.smsBtnText), 11, ["disabled"])
              ])
            ])) : vue.createCommentVNode("v-if", true),
            $data.loginMethod === "password" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "form-item"
            }, [
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "locked",
                  size: "20",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "password",
                    id: "login-password",
                    name: "password",
                    placeholder: "请输入密码",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.loginForm.password = $event),
                    class: "form-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.loginForm.password]
                ]),
                vue.createVNode(_component_uni_icons, {
                  type: $data.showPassword ? "eye" : "eye-slash",
                  size: "20",
                  color: "#999",
                  onClick: $options.togglePassword
                }, null, 8, ["type", "onClick"])
              ]),
              vue.createElementVNode("view", { class: "forget-password" }, [
                vue.createElementVNode("text", {
                  class: "forget-link",
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.goToForgetPassword && $options.goToForgetPassword(...args))
                }, "忘记密码？")
              ])
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("button", {
              class: "login-btn",
              disabled: !$options.isLoginFormValid,
              onClick: _cache[10] || (_cache[10] = (...args) => $options.handleLogin && $options.handleLogin(...args))
            }, " 登录 ", 8, ["disabled"])
          ])) : vue.createCommentVNode("v-if", true),
          $data.activeTab === "register" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "register-form"
          }, [
            vue.createElementVNode("view", { class: "register-step active" }, [
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "phone",
                    size: "20",
                    color: "#999"
                  }),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "number",
                      id: "register-mobile",
                      name: "mobile",
                      placeholder: "请输入手机号",
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.registerForm.mobile = $event),
                      class: "form-input",
                      maxlength: "11",
                      onInput: _cache[12] || (_cache[12] = (...args) => $options.handleRegisterMobileInput && $options.handleRegisterMobileInput(...args))
                    },
                    null,
                    544
                    /* NEED_HYDRATION, NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.registerForm.mobile]
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "chat",
                    size: "20",
                    color: "#999"
                  }),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "number",
                      id: "register-sms-code",
                      name: "sms_code",
                      placeholder: "请输入验证码",
                      "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.registerForm.sms_code = $event),
                      class: "form-input",
                      maxlength: "6"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.registerForm.sms_code]
                  ]),
                  vue.createElementVNode("button", {
                    class: vue.normalizeClass(["sms-btn", { "counting": $data.isSendingRegisterSms }]),
                    disabled: !$data.canSendRegisterSms || $data.isSendingRegisterSms,
                    onClick: _cache[14] || (_cache[14] = (...args) => $options.sendRegisterSms && $options.sendRegisterSms(...args))
                  }, vue.toDisplayString($options.registerSmsBtnText), 11, ["disabled"])
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "locked",
                    size: "20",
                    color: "#999"
                  }),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "password",
                      id: "register-password",
                      name: "password",
                      placeholder: "请设置密码（至少8位）",
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.registerForm.password = $event),
                      class: "form-input"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.registerForm.password]
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    type: $data.showPassword ? "eye" : "eye-slash",
                    size: "20",
                    color: "#999",
                    onClick: $options.togglePassword
                  }, null, 8, ["type", "onClick"])
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "locked",
                    size: "20",
                    color: "#999"
                  }),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "password",
                      id: "register-confirm-password",
                      name: "confirm_password",
                      placeholder: "请再次输入密码",
                      "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.registerForm.confirm_password = $event),
                      class: "form-input"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.registerForm.confirm_password]
                  ])
                ]),
                $data.registerForm.confirm_password && $data.registerForm.password !== $data.registerForm.confirm_password ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "error-text"
                }, " 两次输入的密码不一致 ")) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("button", {
                class: "register-btn",
                disabled: !$options.isRegisterFormValid,
                onClick: _cache[17] || (_cache[17] = (...args) => $options.goToRegisterPage && $options.goToRegisterPage(...args))
              }, " 下一步 ", 8, ["disabled"]),
              vue.createElementVNode("view", { class: "have-account" }, [
                vue.createElementVNode("text", null, "已有账号？"),
                vue.createElementVNode("text", {
                  class: "login-link",
                  onClick: _cache[18] || (_cache[18] = ($event) => $data.activeTab = "login")
                }, "立即登录")
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-e4e4508d"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/login/login.vue"]]);
  const _sfc_main$r = {
    data() {
      return {
        // 从登录页面传递过来的注册数据
        registerForm: {
          mobile: "",
          sms_code: "",
          password: "",
          confirm_password: ""
        },
        // 用户基本信息表单
        basicInfoForm: {
          real_name: "",
          gender: 0,
          birth_date: "",
          city: "",
          email: ""
        },
        // 教育背景表单
        educationForm: {
          degree: "",
          school_name: "",
          major: "",
          graduation_year: ""
        },
        // 求职意向表单
        jobIntentForm: {
          job_direction: "",
          expected_city: "",
          expected_salary_min: "",
          expected_salary_max: "",
          available_time: ""
        },
        // 注册步骤
        registerStep: 2,
        loading: false,
        // ========== 城市选择器数据 ==========
        provinces: ["北京", "上海", "广东", "浙江", "江苏", "四川", "湖北", "陕西", "重庆", "湖南", "河南", "山东", "安徽", "福建", "河北"],
        cities: {
          "北京": ["北京市"],
          "上海": ["上海市"],
          "广东": ["广州", "深圳", "佛山", "东莞", "珠海", "中山", "惠州", "江门", "汕头", "湛江"],
          "浙江": ["杭州", "宁波", "温州", "嘉兴", "绍兴", "金华", "台州", "湖州", "衢州", "丽水"],
          "江苏": ["南京", "苏州", "无锡", "常州", "徐州", "南通", "扬州", "盐城", "淮安", "连云港"],
          "四川": ["成都", "绵阳", "德阳", "乐山", "宜宾", "南充", "泸州", "达州", "眉山", "遂宁"],
          "湖北": ["武汉", "宜昌", "襄阳", "荆州", "黄石", "十堰", "孝感", "荆门", "鄂州", "黄冈"],
          "陕西": ["西安", "宝鸡", "咸阳", "渭南", "汉中", "榆林", "延安", "安康", "商洛", "铜川"],
          "重庆": ["重庆市"],
          "湖南": ["长沙", "株洲", "湘潭", "衡阳", "岳阳", "常德", "邵阳", "郴州", "永州", "怀化"],
          "河南": ["郑州", "洛阳", "开封", "新乡", "许昌", "平顶山", "焦作", "商丘", "安阳", "南阳"],
          "山东": ["济南", "青岛", "烟台", "潍坊", "临沂", "淄博", "威海", "东营", "日照", "德州"],
          "安徽": ["合肥", "芜湖", "蚌埠", "淮南", "马鞍山", "淮北", "铜陵", "安庆", "黄山", "滁州"],
          "福建": ["福州", "厦门", "泉州", "莆田", "漳州", "龙岩", "三明", "南平", "宁德", "武夷山"],
          "河北": ["石家庄", "唐山", "秦皇岛", "邯郸", "邢台", "保定", "张家口", "承德", "沧州", "廊坊"]
        },
        districts: {
          "北京市": ["朝阳区", "海淀区", "东城区", "西城区", "丰台区", "石景山区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云区", "延庆区"],
          "上海市": ["浦东新区", "黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "金山区", "松江区", "青浦区", "奉贤区", "崇明区"],
          "广州": ["天河区", "越秀区", "海珠区", "白云区", "番禺区", "荔湾区", "黄埔区", "花都区", "南沙区", "从化区", "增城区"],
          "深圳": ["福田区", "罗湖区", "南山区", "宝安区", "龙岗区", "盐田区", "龙华区", "坪山区", "光明区"],
          "杭州": ["西湖区", "上城区", "下城区", "江干区", "拱墅区", "滨江区", "萧山区", "余杭区", "富阳区", "临安区", "桐庐县", "淳安县", "建德市"],
          "南京": ["鼓楼区", "玄武区", "秦淮区", "建邺区", "雨花台区", "浦口区", "栖霞区", "江宁区", "六合区", "溧水区", "高淳区"],
          "成都": ["锦江区", "青羊区", "金牛区", "武侯区", "成华区", "龙泉驿区", "青白江区", "新都区", "温江区", "双流区", "郫都区", "新津区", "都江堰市", "彭州市", "邛崃市", "崇州市", "简阳市"],
          "武汉": ["江岸区", "江汉区", "硚口区", "汉阳区", "武昌区", "青山区", "洪山区", "东西湖区", "汉南区", "蔡甸区", "江夏区", "黄陂区", "新洲区"],
          "西安": ["新城区", "碑林区", "莲湖区", "雁塔区", "未央区", "灞桥区", "长安区", "阎良区", "临潼区", "高陵区", "鄠邑区", "蓝田县", "周至县"],
          "重庆市": ["渝中区", "江北区", "南岸区", "九龙坡区", "沙坪坝区", "大渡口区", "北碚区", "渝北区", "巴南区", "涪陵区", "万州区", "黔江区", "长寿区", "江津区", "合川区", "永川区", "南川区", "綦江区", "大足区", "璧山区", "铜梁区", "潼南区", "荣昌区", "开州区", "梁平区", "武隆区"],
          "长沙": ["芙蓉区", "天心区", "岳麓区", "开福区", "雨花区", "望城区", "长沙县", "浏阳市", "宁乡市"],
          "郑州": ["中原区", "二七区", "管城回族区", "金水区", "上街区", "惠济区", "中牟县", "巩义市", "荥阳市", "新密市", "新郑市", "登封市"],
          "济南": ["历下区", "市中区", "槐荫区", "天桥区", "历城区", "长清区", "章丘区", "济阳区", "莱芜区", "钢城区", "平阴县", "商河县"],
          "合肥": ["瑶海区", "庐阳区", "蜀山区", "包河区", "长丰县", "肥东县", "肥西县", "庐江县", "巢湖市"],
          "福州": ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "长乐区", "闽侯县", "连江县", "罗源县", "闽清县", "永泰县", "平潭县", "福清市"],
          "石家庄": ["长安区", "桥西区", "新华区", "井陉矿区", "裕华区", "藁城区", "鹿泉区", "栾城区", "井陉县", "正定县", "行唐县", "灵寿县", "高邑县", "深泽县", "赞皇县", "无极县", "平山县", "元氏县", "赵县", "晋州市", "新乐市"]
        },
        // 城市选择器索引 [省, 市, 区]
        cityIndex: [0, 0, 0],
        expectedCityIndex: [0, 0, 0],
        // ========== 学历选择器数据 ==========
        degreeOptions: [
          { value: "high_school", text: "高中" },
          { value: "college", text: "专科" },
          { value: "bachelor", text: "本科" },
          { value: "master", text: "硕士" },
          { value: "doctor", text: "博士" }
        ],
        degreeIndex: 2,
        // 默认本科
        // ========== 毕业年份数据 ==========
        graduationYears: [],
        yearIndex: 5,
        // 默认当前年份
        // ========== 到岗时间选项 ==========
        availableTimeOptions: ["立即到岗", "一周内到岗", "两周内到岗", "一个月内到岗", "两个月内到岗", "三个月内到岗", "待定"],
        timeIndex: 0
      };
    },
    computed: {
      // 所在城市选择器范围
      cityRange() {
        const province = this.provinces[this.cityIndex[0]] || this.provinces[0];
        const cityList = this.cities[province] || ["其他"];
        const city = cityList[this.cityIndex[1]] || cityList[0];
        const districtList = this.districts[city] || ["其他"];
        return [this.provinces, cityList, districtList];
      },
      // 期望城市选择器范围（独立的计算属性）
      expectedCityRange() {
        const province = this.provinces[this.expectedCityIndex[0]] || this.provinces[0];
        const cityList = this.cities[province] || ["其他"];
        const city = cityList[this.expectedCityIndex[1]] || cityList[0];
        const districtList = this.districts[city] || ["其他"];
        return [this.provinces, cityList, districtList];
      },
      // 学历文本显示
      degreeText() {
        const item = this.degreeOptions[this.degreeIndex];
        return item ? item.text : "";
      },
      // 基本信息表单验证
      isBasicInfoFormValid() {
        const { real_name, birth_date, city, email } = this.basicInfoForm;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const realNameValid = real_name.trim().length > 0;
        const birthDateValid = birth_date.trim().length > 0;
        const cityValid = city.trim().length > 0;
        const emailValid = email.trim() === "" || emailRegex.test(email);
        return realNameValid && birthDateValid && cityValid && emailValid;
      },
      // 教育背景表单验证
      isEducationFormValid() {
        const { degree, school_name, major, graduation_year } = this.educationForm;
        const degreeValid = degree.trim().length > 0;
        const schoolNameValid = school_name.trim().length > 0;
        const majorValid = major.trim().length > 0;
        const graduationYearValid = graduation_year.trim().length === 4 && !isNaN(graduation_year);
        return degreeValid && schoolNameValid && majorValid && graduationYearValid;
      },
      // 求职意向表单验证
      isJobIntentFormValid() {
        const { expected_salary_min, expected_salary_max } = this.jobIntentForm;
        if (expected_salary_min && isNaN(expected_salary_min))
          return false;
        if (expected_salary_max && isNaN(expected_salary_max))
          return false;
        return true;
      }
    },
    onLoad(options) {
      if (options.registerData) {
        try {
          this.registerForm = JSON.parse(decodeURIComponent(options.registerData));
          formatAppLog("log", "at pages/login/register/login_reister.vue:498", "接收到的注册数据:", this.registerForm);
        } catch (e) {
          formatAppLog("error", "at pages/login/register/login_reister.vue:500", "解析注册数据失败:", e);
        }
      }
      this.initYearData();
    },
    methods: {
      initYearData() {
        this.graduationYears = [];
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
          this.graduationYears.push(i + "年");
        }
        this.yearIndex = 5;
      },
      // ========== 出生日期选择 ==========
      onBirthDateChange(e) {
        this.basicInfoForm.birth_date = e.detail.value;
      },
      // ========== 所在城市选择器方法 ==========
      onCityChange(e) {
        const value = e.detail.value;
        const province = this.provinces[value[0]];
        const cityList = this.cities[province] || ["其他"];
        const city = cityList[value[1]];
        const districtList = this.districts[city] || ["其他"];
        const district = districtList[value[2]];
        this.basicInfoForm.city = `${province} ${city} ${district}`;
        this.cityIndex = value;
      },
      onCityColumnChange(e) {
        const { column, value } = e.detail;
        if (column === 0) {
          this.cityIndex = [value, 0, 0];
        } else if (column === 1) {
          this.cityIndex = [this.cityIndex[0], value, 0];
        } else {
          this.cityIndex = [this.cityIndex[0], this.cityIndex[1], value];
        }
      },
      // ========== 期望城市选择器方法 ==========
      onExpectedCityChange(e) {
        const value = e.detail.value;
        const province = this.provinces[value[0]];
        const cityList = this.cities[province] || ["其他"];
        const city = cityList[value[1]];
        const districtList = this.districts[city] || ["其他"];
        const district = districtList[value[2]];
        this.jobIntentForm.expected_city = `${province} ${city} ${district}`;
        this.expectedCityIndex = value;
      },
      onExpectedCityColumnChange(e) {
        const { column, value } = e.detail;
        if (column === 0) {
          this.expectedCityIndex = [value, 0, 0];
        } else if (column === 1) {
          this.expectedCityIndex = [this.expectedCityIndex[0], value, 0];
        } else {
          this.expectedCityIndex = [this.expectedCityIndex[0], this.expectedCityIndex[1], value];
        }
      },
      // ========== 学历选择 ==========
      onDegreeChange(e) {
        this.degreeIndex = e.detail.value;
        this.educationForm.degree = this.degreeOptions[this.degreeIndex].value;
      },
      // ========== 毕业年份选择 ==========
      onYearChange(e) {
        this.yearIndex = e.detail.value;
        const yearStr = this.graduationYears[this.yearIndex];
        this.educationForm.graduation_year = yearStr.replace("年", "");
      },
      // ========== 到岗时间选择 ==========
      onTimeChange(e) {
        this.timeIndex = e.detail.value;
        this.jobIntentForm.available_time = this.availableTimeOptions[this.timeIndex];
      },
      // ========== 步骤控制方法 ==========
      nextRegisterStep() {
        if (this.registerStep === 2 && this.isBasicInfoFormValid) {
          this.registerStep = 3;
        } else if (this.registerStep === 3 && this.isEducationFormValid) {
          this.registerStep = 4;
        }
      },
      prevRegisterStep() {
        if (this.registerStep > 2) {
          this.registerStep--;
        } else {
          uni.navigateBack();
        }
      },
      // ========== 完成注册 ==========
      async completeRegister() {
        this.loading = true;
        try {
          const registerData = {
            mobile: this.registerForm.mobile,
            sms_code: this.registerForm.sms_code,
            password: this.registerForm.password,
            // 基本信息
            real_name: this.basicInfoForm.real_name.trim(),
            gender: this.basicInfoForm.gender,
            birth_date: this.basicInfoForm.birth_date,
            city: this.basicInfoForm.city,
            email: this.basicInfoForm.email.trim() || void 0,
            // 教育背景
            education_level: this.educationForm.degree,
            school_name: this.educationForm.school_name.trim(),
            major: this.educationForm.major.trim(),
            graduation_year: this.educationForm.graduation_year
          };
          formatAppLog("log", "at pages/login/register/login_reister.vue:634", "发送注册数据:", registerData);
          const res = await userApi.register(registerData);
          formatAppLog("log", "at pages/login/register/login_reister.vue:638", "注册响应:", res);
          if (res && res.user_id) {
            formatAppLog("log", "at pages/login/register/login_reister.vue:642", "注册成功，开始自动登录");
            const loginRes = await userApi.login({
              mobile: this.registerForm.mobile,
              password: this.registerForm.password
            });
            formatAppLog("log", "at pages/login/register/login_reister.vue:649", "登录响应:", loginRes);
            if (loginRes && loginRes.token) {
              uni.setStorageSync("token", loginRes.token);
              uni.setStorageSync("userInfo", JSON.stringify(loginRes.user_info));
              if (this.registerStep === 4 && this.jobIntentForm.expected_city) {
                const resumeInfo = {
                  job_direction: this.jobIntentForm.job_direction,
                  expected_city: this.jobIntentForm.expected_city,
                  expected_salary_min: this.jobIntentForm.expected_salary_min,
                  expected_salary_max: this.jobIntentForm.expected_salary_max,
                  available_time: this.jobIntentForm.available_time
                };
                uni.setStorageSync("resumeInfo", JSON.stringify(resumeInfo));
              }
              uni.showToast({
                title: "注册成功",
                icon: "success"
              });
              setTimeout(() => {
                uni.switchTab({
                  url: "/pages/index/index_index"
                });
              }, 1500);
            } else {
              throw new Error("自动登录失败");
            }
          } else {
            throw new Error("注册失败：未返回用户ID");
          }
        } catch (error) {
          formatAppLog("error", "at pages/login/register/login_reister.vue:685", "注册失败:", error);
          uni.showToast({
            title: error.message || "注册失败，请稍后重试",
            icon: "none",
            duration: 3e3
          });
        } finally {
          this.loading = false;
        }
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock("view", { class: "register-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("view", { class: "nav-bar-left" }, [
          vue.createVNode(_component_uni_icons, {
            type: "back",
            size: "24",
            color: "#1E1E1E",
            onClick: $options.prevRegisterStep,
            onTouchstart: _cache[0] || (_cache[0] = ($event) => $event.target.style.color = "#007aff"),
            onTouchend: _cache[1] || (_cache[1] = ($event) => $event.target.style.color = "#1E1E1E"),
            onTouchcancel: _cache[2] || (_cache[2] = ($event) => $event.target.style.color = "#1E1E1E")
          }, null, 8, ["onClick"])
        ]),
        vue.createElementVNode("view", { class: "nav-bar-center" }, [
          vue.createElementVNode(
            "text",
            { class: "nav-bar-title" },
            vue.toDisplayString($data.registerStep === 2 ? "完善个人信息" : $data.registerStep === 3 ? "教育经历" : "求职意向"),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "nav-bar-right" })
      ]),
      vue.createElementVNode("view", { class: "register-container" }, [
        vue.createElementVNode("view", { class: "register-form" }, [
          $data.registerStep === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "register-step"
          }, [
            vue.createElementVNode("h3", { class: "step-title" }, "完善个人信息"),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "真实姓名"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "person",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请输入真实姓名",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.basicInfoForm.real_name = $event),
                    class: "form-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.basicInfoForm.real_name]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "性别"),
              vue.createElementVNode("view", { class: "gender-selector" }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["gender-item", { active: $data.basicInfoForm.gender === 0 }]),
                    onClick: _cache[4] || (_cache[4] = ($event) => $data.basicInfoForm.gender = 0)
                  },
                  [
                    vue.createElementVNode("text", { class: "gender-text" }, "未知")
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["gender-item", { active: $data.basicInfoForm.gender === 1 }]),
                    onClick: _cache[5] || (_cache[5] = ($event) => $data.basicInfoForm.gender = 1)
                  },
                  [
                    vue.createElementVNode("text", { class: "gender-text" }, "男")
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["gender-item", { active: $data.basicInfoForm.gender === 2 }]),
                    onClick: _cache[6] || (_cache[6] = ($event) => $data.basicInfoForm.gender = 2)
                  },
                  [
                    vue.createElementVNode("text", { class: "gender-text" }, "女")
                  ],
                  2
                  /* CLASS */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "出生日期"),
              vue.createElementVNode("picker", {
                mode: "date",
                value: $data.basicInfoForm.birth_date,
                start: "1950-01-01",
                end: "2010-12-31",
                onChange: _cache[8] || (_cache[8] = (...args) => $options.onBirthDateChange && $options.onBirthDateChange(...args))
              }, [
                vue.createElementVNode("view", { class: "form-input-wrapper picker-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "calendar",
                    size: "24",
                    color: "#999"
                  }),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "text",
                      placeholder: "请选择出生日期",
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.basicInfoForm.birth_date = $event),
                      class: "form-input",
                      disabled: ""
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.basicInfoForm.birth_date]
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    type: "arrowright",
                    size: "18",
                    color: "#999"
                  })
                ])
              ], 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "所在城市"),
              vue.createElementVNode("picker", {
                mode: "multiSelector",
                range: $options.cityRange,
                value: $data.cityIndex,
                onChange: _cache[10] || (_cache[10] = (...args) => $options.onCityChange && $options.onCityChange(...args)),
                onColumnchange: _cache[11] || (_cache[11] = (...args) => $options.onCityColumnChange && $options.onCityColumnChange(...args))
              }, [
                vue.createElementVNode("view", { class: "form-input-wrapper picker-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "location",
                    size: "24",
                    color: "#999"
                  }),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "text",
                      placeholder: "请选择所在城市",
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.basicInfoForm.city = $event),
                      class: "form-input",
                      disabled: ""
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.basicInfoForm.city]
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    type: "arrowright",
                    size: "18",
                    color: "#999"
                  })
                ])
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "邮箱（可选）"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "email",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请输入邮箱",
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.basicInfoForm.email = $event),
                    class: "form-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.basicInfoForm.email]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "register-buttons" }, [
              vue.createElementVNode("button", {
                class: "back-btn",
                onClick: _cache[13] || (_cache[13] = (...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args))
              }, " 上一步 "),
              vue.createElementVNode("button", {
                class: "register-btn",
                disabled: !$options.isBasicInfoFormValid,
                onClick: _cache[14] || (_cache[14] = (...args) => $options.nextRegisterStep && $options.nextRegisterStep(...args))
              }, " 下一步 ", 8, ["disabled"])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          $data.registerStep === 3 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "register-step"
          }, [
            vue.createElementVNode("h3", { class: "step-title" }, "教育经历"),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "学历水平"),
              vue.createElementVNode("picker", {
                mode: "selector",
                range: $data.degreeOptions,
                "range-key": "text",
                value: $data.degreeIndex,
                onChange: _cache[15] || (_cache[15] = (...args) => $options.onDegreeChange && $options.onDegreeChange(...args))
              }, [
                vue.createElementVNode("view", { class: "form-input-wrapper picker-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "book",
                    size: "24",
                    color: "#999"
                  }),
                  vue.createElementVNode("input", {
                    type: "text",
                    placeholder: "请选择学历",
                    value: $options.degreeText,
                    class: "form-input",
                    disabled: ""
                  }, null, 8, ["value"]),
                  vue.createVNode(_component_uni_icons, {
                    type: "arrowright",
                    size: "18",
                    color: "#999"
                  })
                ])
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "学校名称"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "office",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请输入学校名称",
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.educationForm.school_name = $event),
                    class: "form-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.educationForm.school_name]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "专业"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "compose",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请输入专业",
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.educationForm.major = $event),
                    class: "form-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.educationForm.major]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "毕业年份"),
              vue.createElementVNode("picker", {
                mode: "selector",
                range: $data.graduationYears,
                value: $data.yearIndex,
                onChange: _cache[18] || (_cache[18] = (...args) => $options.onYearChange && $options.onYearChange(...args))
              }, [
                vue.createElementVNode("view", { class: "form-input-wrapper picker-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "calendar",
                    size: "24",
                    color: "#999"
                  }),
                  vue.createElementVNode("input", {
                    type: "text",
                    placeholder: "请选择毕业年份",
                    value: $data.educationForm.graduation_year ? $data.educationForm.graduation_year + "年" : "",
                    class: "form-input",
                    disabled: ""
                  }, null, 8, ["value"]),
                  vue.createVNode(_component_uni_icons, {
                    type: "arrowright",
                    size: "18",
                    color: "#999"
                  })
                ])
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "register-buttons" }, [
              vue.createElementVNode("button", {
                class: "back-btn",
                onClick: _cache[19] || (_cache[19] = (...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args))
              }, " 上一步 "),
              vue.createElementVNode("button", {
                class: "register-btn",
                disabled: !$options.isEducationFormValid,
                onClick: _cache[20] || (_cache[20] = (...args) => $options.nextRegisterStep && $options.nextRegisterStep(...args))
              }, " 下一步 ", 8, ["disabled"])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          $data.registerStep === 4 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "register-step optional"
          }, [
            vue.createElementVNode("h3", { class: "step-title" }, [
              vue.createTextVNode("求职意向 "),
              vue.createElementVNode("span", { class: "optional-tag" }, "可选")
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "期望职位方向"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "briefcase",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请输入期望职位方向（如：前端/后端/数据等）",
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.jobIntentForm.job_direction = $event),
                    class: "form-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.jobIntentForm.job_direction]
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "期望工作城市"),
              vue.createElementVNode("picker", {
                mode: "multiSelector",
                range: $options.expectedCityRange,
                value: $data.expectedCityIndex,
                onChange: _cache[23] || (_cache[23] = (...args) => $options.onExpectedCityChange && $options.onExpectedCityChange(...args)),
                onColumnchange: _cache[24] || (_cache[24] = (...args) => $options.onExpectedCityColumnChange && $options.onExpectedCityColumnChange(...args))
              }, [
                vue.createElementVNode("view", { class: "form-input-wrapper picker-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "location",
                    size: "24",
                    color: "#999"
                  }),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "text",
                      placeholder: "请输入期望工作城市",
                      "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => $data.jobIntentForm.expected_city = $event),
                      class: "form-input",
                      disabled: ""
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.jobIntentForm.expected_city]
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    type: "arrowright",
                    size: "18",
                    color: "#999"
                  })
                ])
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "期望薪资范围（千/月）"),
              vue.createElementVNode("view", { class: "salary-range" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    placeholder: "最低",
                    "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => $data.jobIntentForm.expected_salary_min = $event),
                    class: "form-input salary-input",
                    min: "0"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.jobIntentForm.expected_salary_min]
                ]),
                vue.createElementVNode("span", { class: "salary-separator" }, "~"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    placeholder: "最高",
                    "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => $data.jobIntentForm.expected_salary_max = $event),
                    class: "form-input salary-input",
                    min: "0"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.jobIntentForm.expected_salary_max]
                ]),
                vue.createElementVNode("span", { class: "salary-unit" }, "千/月")
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "到岗时间"),
              vue.createElementVNode("picker", {
                mode: "selector",
                range: $data.availableTimeOptions,
                value: $data.timeIndex,
                onChange: _cache[28] || (_cache[28] = (...args) => $options.onTimeChange && $options.onTimeChange(...args))
              }, [
                vue.createElementVNode("view", { class: "form-input-wrapper picker-wrapper" }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "time",
                    size: "24",
                    color: "#999"
                  }),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      type: "text",
                      placeholder: "请选择到岗时间",
                      "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => $data.jobIntentForm.available_time = $event),
                      class: "form-input",
                      disabled: ""
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.jobIntentForm.available_time]
                  ]),
                  vue.createVNode(_component_uni_icons, {
                    type: "arrowright",
                    size: "18",
                    color: "#999"
                  })
                ])
              ], 40, ["range", "value"])
            ]),
            vue.createElementVNode("view", { class: "register-buttons" }, [
              vue.createElementVNode("button", {
                class: "back-btn",
                onClick: _cache[29] || (_cache[29] = (...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args))
              }, " 上一步 "),
              vue.createElementVNode("button", {
                class: "skip-btn",
                onClick: _cache[30] || (_cache[30] = (...args) => $options.completeRegister && $options.completeRegister(...args))
              }, " 暂时跳过，稍后完善 "),
              vue.createElementVNode("button", {
                class: "register-btn",
                disabled: !$options.isJobIntentFormValid,
                onClick: _cache[31] || (_cache[31] = (...args) => $options.completeRegister && $options.completeRegister(...args))
              }, " 完成注册 ", 8, ["disabled"])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const PagesLoginRegisterLoginReister = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-f0d703cf"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/login/register/login_reister.vue"]]);
  const _sfc_main$q = {
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
          uni.showToast({
            title: `${this.authMethod === "mobile" ? "手机" : "邮箱"}验证码发送成功`,
            icon: "success"
          });
          this.startSmsCountdown();
        } catch (error) {
          formatAppLog("error", "at pages/login/forget/login_forget.vue:282", "发送验证码失败:", error);
          uni.showToast({
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
          uni.showToast({
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
          const res = await userApi.forgetPassword(resetData);
          if (res) {
            uni.showToast({
              title: "密码重置成功",
              icon: "success"
            });
            setTimeout(() => {
              uni.navigateTo({
                url: "/pages/login/login"
              });
            }, 1500);
          }
        } catch (error) {
          formatAppLog("error", "at pages/login/forget/login_forget.vue:356", "密码重置失败:", error);
          uni.showToast({
            title: error.message || "密码重置失败，请稍后重试",
            icon: "none"
          });
        } finally {
          this.loading = false;
        }
      },
      // 跳转到登录页面
      goToLogin() {
        uni.navigateTo({
          url: "/pages/login/login"
        });
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock("view", { class: "forget-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("view", { class: "nav-bar-left" }, [
          vue.createVNode(_component_uni_icons, {
            type: "back",
            size: "24",
            color: "#1E1E1E",
            onClick: $options.goToLogin,
            onTouchstart: _cache[0] || (_cache[0] = ($event) => $event.target.style.color = "#007aff"),
            onTouchend: _cache[1] || (_cache[1] = ($event) => $event.target.style.color = "#1E1E1E"),
            onTouchcancel: _cache[2] || (_cache[2] = ($event) => $event.target.style.color = "#1E1E1E")
          }, null, 8, ["onClick"])
        ]),
        vue.createElementVNode("view", { class: "nav-bar-center" }, [
          vue.createElementVNode("text", { class: "nav-bar-title" }, "忘记密码")
        ]),
        vue.createElementVNode("view", { class: "nav-bar-right" })
      ]),
      vue.createElementVNode("view", { class: "forget-container" }, [
        vue.createElementVNode("view", { class: "forget-form" }, [
          $data.resetStep === 1 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "step-content"
          }, [
            vue.createElementVNode("view", { class: "auth-method" }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["method-item", { active: $data.authMethod === "mobile" }]),
                  onClick: _cache[3] || (_cache[3] = ($event) => $data.authMethod = "mobile")
                },
                [
                  vue.createElementVNode("text", { class: "method-text" }, "手机号验证")
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["method-item", { active: $data.authMethod === "email" }]),
                  onClick: _cache[4] || (_cache[4] = ($event) => $data.authMethod = "email")
                },
                [
                  vue.createElementVNode("text", { class: "method-text" }, "邮箱验证")
                ],
                2
                /* CLASS */
              )
            ]),
            $data.authMethod === "mobile" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "form-item"
            }, [
              vue.createElementVNode("view", { class: "form-label" }, "手机号"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "phone",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    placeholder: "请输入手机号",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.forgetForm.mobile = $event),
                    class: "form-input",
                    maxlength: "11",
                    onInput: _cache[6] || (_cache[6] = (...args) => $options.handleInput && $options.handleInput(...args))
                  },
                  null,
                  544
                  /* NEED_HYDRATION, NEED_PATCH */
                ), [
                  [vue.vModelText, $data.forgetForm.mobile]
                ])
              ])
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "form-item"
            }, [
              vue.createElementVNode("view", { class: "form-label" }, "邮箱"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "email",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "text",
                    placeholder: "请输入邮箱",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.forgetForm.email = $event),
                    class: "form-input",
                    onInput: _cache[8] || (_cache[8] = (...args) => $options.handleInput && $options.handleInput(...args))
                  },
                  null,
                  544
                  /* NEED_HYDRATION, NEED_PATCH */
                ), [
                  [vue.vModelText, $data.forgetForm.email]
                ])
              ])
            ])),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "验证码"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "chat",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    placeholder: "请输入验证码",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.forgetForm.sms_code = $event),
                    class: "form-input",
                    maxlength: "6"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.forgetForm.sms_code]
                ]),
                vue.createElementVNode("button", {
                  class: "sms-btn",
                  disabled: !$data.canSendSms || $data.isSendingSms,
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.sendSms && $options.sendSms(...args))
                }, vue.toDisplayString($options.smsBtnText), 9, ["disabled"])
              ])
            ]),
            vue.createElementVNode("button", {
              class: "confirm-btn",
              disabled: !$options.isAuthFormValid,
              onClick: _cache[11] || (_cache[11] = (...args) => $options.nextResetStep && $options.nextResetStep(...args))
            }, " 下一步 ", 8, ["disabled"])
          ])) : vue.createCommentVNode("v-if", true),
          $data.resetStep === 2 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "step-content"
          }, [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "新密码"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "locked",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "password",
                    placeholder: "请设置新密码（至少8位）",
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.forgetForm.new_password = $event),
                    class: "form-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.forgetForm.new_password]
                ]),
                vue.createVNode(_component_uni_icons, {
                  type: $data.showPassword ? "eye" : "eye-slash",
                  size: "24",
                  color: "#999",
                  onClick: $options.togglePassword
                }, null, 8, ["type", "onClick"])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "form-label" }, "确认新密码"),
              vue.createElementVNode("view", { class: "form-input-wrapper" }, [
                vue.createVNode(_component_uni_icons, {
                  type: "locked",
                  size: "24",
                  color: "#999"
                }),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "password",
                    placeholder: "请再次输入新密码",
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.forgetForm.confirm_password = $event),
                    class: "form-input"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.forgetForm.confirm_password]
                ])
              ]),
              $data.forgetForm.confirm_password && $data.forgetForm.new_password !== $data.forgetForm.confirm_password ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "error-text"
              }, " 两次输入的密码不一致 ")) : vue.createCommentVNode("v-if", true)
            ]),
            vue.createElementVNode("view", { class: "reset-buttons" }, [
              vue.createElementVNode("button", {
                class: "back-btn",
                onClick: _cache[14] || (_cache[14] = (...args) => $options.prevResetStep && $options.prevResetStep(...args))
              }, " 上一步 "),
              vue.createElementVNode("button", {
                class: "confirm-btn",
                disabled: !$options.isPasswordFormValid,
                onClick: _cache[15] || (_cache[15] = (...args) => $options.handleResetPassword && $options.handleResetPassword(...args))
              }, " 确认重置 ", 8, ["disabled"])
            ])
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "login-link" }, [
            vue.createElementVNode("text", null, "返回"),
            vue.createElementVNode("text", {
              class: "login-text",
              onClick: _cache[16] || (_cache[16] = (...args) => $options.goToLogin && $options.goToLogin(...args))
            }, "立即登录")
          ])
        ])
      ])
    ]);
  }
  const PagesLoginForgetLoginForget = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-30052982"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/login/forget/login_forget.vue"]]);
  const _sfc_main$p = {
    name: "JobCard",
    props: {
      data: {
        type: Object,
        default: () => ({})
      },
      isDark: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isFavorite: false,
        isApplied: false
      };
    },
    mounted() {
      this.checkIsFavorite();
      this.checkIsApplied();
    },
    onShow() {
      this.checkIsFavorite();
      this.checkIsApplied();
    },
    methods: {
      checkIsFavorite() {
        const collections = uni.getStorageSync("collections") || [];
        this.isFavorite = collections.some((item) => item.id === this.data.id);
      },
      checkIsApplied() {
        const delivers = uni.getStorageSync("delivers") || [];
        this.isApplied = delivers.some((item) => item.id === this.data.id);
      },
      toggleFavorite() {
        let collections = uni.getStorageSync("collections") || [];
        if (this.isFavorite) {
          collections = collections.filter((item) => item.id !== this.data.id);
          this.isFavorite = false;
          uni.showToast({
            title: "已取消收藏",
            icon: "success"
          });
        } else {
          const newCollection = {
            id: this.data.id,
            jobTitle: this.data.title,
            company: this.data.company || "未知公司",
            salary: this.formatSalary(this.data.salary_min, this.data.salary_max),
            collectionTime: (/* @__PURE__ */ new Date()).toLocaleString()
          };
          collections.push(newCollection);
          this.isFavorite = true;
          uni.showToast({
            title: "收藏成功",
            icon: "success"
          });
        }
        uni.setStorageSync("collections", collections);
      },
      applyForJob() {
        let delivers = uni.getStorageSync("delivers") || [];
        const isApplied = delivers.some((item) => item.id === this.data.id);
        if (isApplied) {
          delivers = delivers.filter((item) => item.id !== this.data.id);
          this.isApplied = false;
          uni.showToast({
            title: "已取消投递",
            icon: "success"
          });
        } else {
          const newDeliver = {
            id: this.data.id,
            jobTitle: this.data.title,
            company: this.data.company || "未知公司",
            salary: this.formatSalary(this.data.salary_min, this.data.salary_max),
            deliverTime: (/* @__PURE__ */ new Date()).toLocaleString(),
            status: "pending",
            statusText: "待处理"
          };
          delivers.push(newDeliver);
          this.isApplied = true;
          uni.showToast({
            title: "投递成功",
            icon: "success"
          });
        }
        uni.setStorageSync("delivers", delivers);
      },
      // 格式化薪资
      formatSalary(min, max) {
        if (min && max) {
          const minNum = typeof min === "number" ? min : parseFloat(min);
          const maxNum = typeof max === "number" ? max : parseFloat(max);
          return `${(minNum / 1e3).toFixed(0)}-${(maxNum / 1e3).toFixed(0)}K`;
        }
        return "薪资面议";
      },
      goToDetail(data) {
        formatAppLog("log", "at component/job/job-card.vue:166", "转换后的b:", data.id);
        uni.navigateTo({
          url: `/pages/job/detail/job_detail_index?id=${data.id}`
        });
      },
      // 获取公司名称
      getCompanyName(data) {
        const companyMap = {
          "1": "花旗金融信息服务（中国）有限公司",
          "2": "中国移动通信有限公司在线营销服务中心",
          "3": "Victoria's Secret"
        };
        return companyMap[data.company_id] || "未知公司";
      },
      // 获取职位标签
      getJobTags(data) {
        if (data.welfare_list) {
          return Array.isArray(data.welfare_list) ? data.welfare_list : JSON.parse(data.welfare_list);
        }
        return ["五险一金", "弹性工作", "带薪年假"];
      },
      // 格式化发布时间
      formatTime(publishTime) {
        if (!publishTime)
          return "今天";
        try {
          const date = new Date(publishTime);
          const now = /* @__PURE__ */ new Date();
          const diff = now - date;
          const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
          if (days === 0) {
            return "今天";
          } else if (days === 1) {
            return "昨天";
          } else if (days < 7) {
            return `${days}天前`;
          } else {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          }
        } catch (error) {
          formatAppLog("error", "at component/job/job-card.vue:220", "日期格式化失败:", error);
          return "今天";
        }
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "job-card",
        style: vue.normalizeStyle({ background: $props.isDark ? "#2c2c2c" : "linear-gradient(135deg, #ffffff, #f8faff)", boxShadow: $props.isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
      },
      [
        vue.createElementVNode("view", {
          class: "card-content",
          onClick: _cache[0] || (_cache[0] = ($event) => $options.goToDetail($props.data))
        }, [
          vue.createElementVNode("view", { class: "card-header" }, [
            vue.createElementVNode(
              "text",
              {
                class: "job-title",
                style: vue.normalizeStyle({ color: $props.isDark ? "#ffffff" : "#1E1E1E" })
              },
              vue.toDisplayString($props.data.title),
              5
              /* TEXT, STYLE */
            ),
            vue.createElementVNode(
              "text",
              { class: "salary" },
              vue.toDisplayString($options.formatSalary($props.data.salary_min, $props.data.salary_max)),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "company-info" }, [
            vue.createElementVNode(
              "text",
              {
                class: "company-name",
                style: vue.normalizeStyle({ color: $props.isDark ? "#ffffff" : "#1E1E1E" })
              },
              vue.toDisplayString($props.data.company || "未知公司"),
              5
              /* TEXT, STYLE */
            ),
            vue.createElementVNode(
              "text",
              {
                class: "company-tag",
                style: vue.normalizeStyle({ color: $props.isDark ? "#999" : "#6C757D" })
              },
              vue.toDisplayString($props.data.exp_req || "经验不限") + " | " + vue.toDisplayString($props.data.edu_req || "学历不限"),
              5
              /* TEXT, STYLE */
            )
          ]),
          vue.createElementVNode("view", { class: "job-tags" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.getJobTags($props.data), (tag) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: tag,
                    class: "tag",
                    style: vue.normalizeStyle({ background: $props.isDark ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)", color: $props.isDark ? "#ccc" : "#6C757D" })
                  },
                  vue.toDisplayString(tag),
                  5
                  /* TEXT, STYLE */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode(
            "view",
            {
              class: "card-footer",
              style: vue.normalizeStyle({ borderTop: $props.isDark ? "1px solid #404040" : "1px solid #E6F0FF" })
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "location",
                  style: vue.normalizeStyle({ color: $props.isDark ? "#ffffff" : "#1E1E1E" })
                },
                vue.toDisplayString($props.data.city || "城市"),
                5
                /* TEXT, STYLE */
              ),
              vue.createElementVNode(
                "text",
                {
                  class: "time",
                  style: vue.normalizeStyle({ color: $props.isDark ? "#999" : "#6C757D" })
                },
                vue.toDisplayString($options.formatTime($props.data.publish_time)),
                5
                /* TEXT, STYLE */
              )
            ],
            4
            /* STYLE */
          )
        ]),
        vue.createElementVNode("view", { class: "right-buttons" }, [
          vue.createElementVNode(
            "view",
            {
              class: "favorite-btn",
              onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.toggleFavorite && $options.toggleFavorite(...args), ["stop"])),
              style: vue.normalizeStyle({ background: $props.isDark ? "rgba(42, 42, 42, 0.8)" : "linear-gradient(135deg, #ffffff, #f8faff)" })
            },
            [
              vue.createVNode(_component_uni_icons, {
                type: $data.isFavorite ? "star-filled" : "star",
                size: 30,
                color: $data.isFavorite ? "#ff9500" : $props.isDark ? "#666" : "#ccc"
              }, null, 8, ["type", "color"])
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["apply-btn", { "applied": $data.isApplied }]),
              onClick: _cache[2] || (_cache[2] = vue.withModifiers((...args) => $options.applyForJob && $options.applyForJob(...args), ["stop"])),
              style: vue.normalizeStyle({ background: $data.isApplied ? $props.isDark ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)" : "linear-gradient(120deg, #4facfe, #00f2fe)", color: $data.isApplied ? $props.isDark ? "#999" : "#6C757D" : "white" })
            },
            vue.toDisplayString($data.isApplied ? "已投递" : "投递"),
            7
            /* TEXT, CLASS, STYLE */
          )
        ])
      ],
      4
      /* STYLE */
    );
  }
  const jobCard = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-8b16e01f"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/component/job/job-card.vue"]]);
  const jobApi = {
    // 获取全部职位列表
    getAllJobs: () => {
      return requestWithRetry({
        url: "/job/Job_List_all",
        method: "GET"
      });
    },
    // 根据类别获取职位列表
    getJobsByCategory: (categoryId) => {
      return requestWithRetry({
        url: "/job/job_lis_one_type",
        method: "POST",
        data: { category_id: categoryId.toString() }
      });
    },
    // 根据类别和就业类型获取职位列表
    getJobsByCategoryAndType: (categoryId, empType) => {
      return requestWithRetry({
        url: "/job/job_list_two_given",
        method: "POST",
        data: { category_id: categoryId.toString(), emp_type: empType.toString() }
      });
    },
    // 搜索职位
    searchJobs: (keyword) => {
      return requestWithRetry({
        url: "/job/job_search",
        method: "POST",
        data: { user_input: keyword }
      });
    },
    // 获取职位详情
    getJobDetail: (jobId) => {
      return requestWithRetry({
        url: "/job/job_details",
        method: "POST",
        data: { id: jobId }
      });
    },
    // 获取职位分类列表
    getJobCategories: () => {
      return requestWithRetry({
        url: "/job_intro/job_intro_list",
        method: "GET"
      });
    }
  };
  const THEME_MODE_KEY = "themeMode";
  const CURRENT_THEME_KEY = "currentTheme";
  class ThemeManager {
    constructor() {
      this.currentTheme = "light";
      this.themeMode = "system";
      this.init();
    }
    /**
     * 初始化主题管理器
     */
    init() {
      this.themeMode = uni.getStorageSync(THEME_MODE_KEY) || "system";
      this.currentTheme = uni.getStorageSync(CURRENT_THEME_KEY) || "light";
      setTimeout(() => {
        if (this.themeMode === "system") {
          this.detectSystemTheme();
        }
      }, 100);
    }
    /**
     * 检测系统主题（微信小程序支持）
     */
    detectSystemTheme() {
      try {
        const systemInfo = uni.getSystemInfoSync();
        const systemTheme = systemInfo.theme || "light";
        this.setTheme(systemTheme === "dark" ? "dark" : "light");
      } catch (error) {
        formatAppLog("warn", "at common/utils/theme-simple.js:42", "无法获取系统主题，使用默认浅色主题");
        this.setTheme("light");
      }
    }
    /**
     * 设置主题模式
     * @param {string} mode - 主题模式: light, dark, system
     */
    setThemeMode(mode) {
      if (!["light", "dark", "system"].includes(mode)) {
        formatAppLog("warn", "at common/utils/theme-simple.js:53", "Invalid theme mode:", mode);
        return;
      }
      this.themeMode = mode;
      uni.setStorageSync(THEME_MODE_KEY, mode);
      if (mode === "system") {
        this.detectSystemTheme();
      } else {
        this.setTheme(mode);
      }
    }
    /**
     * 设置实际主题
     * @param {string} theme - 主题: light, dark
     */
    setTheme(theme) {
      if (!["light", "dark"].includes(theme)) {
        formatAppLog("warn", "at common/utils/theme-simple.js:73", "Invalid theme:", theme);
        return;
      }
      this.currentTheme = theme;
      uni.setStorageSync(CURRENT_THEME_KEY, theme);
      this.notifyThemeChange(theme);
    }
    /**
     * 通知主题变化
     */
    notifyThemeChange(theme) {
      uni.$emit("globalThemeChange", {
        theme,
        isDark: theme === "dark"
      });
    }
    /**
     * 获取主题模式
     */
    getThemeMode() {
      return this.themeMode;
    }
    /**
     * 获取当前主题
     */
    getCurrentTheme() {
      return this.currentTheme;
    }
    /**
     * 获取主题配置
     */
    getThemeConfig() {
      return {
        light: {
          backgroundColor: "#ffffff",
          textColor: "#333333",
          cardBackground: "#ffffff",
          borderColor: "#eeeeee",
          primaryColor: "#007aff",
          name: "浅色模式"
        },
        dark: {
          backgroundColor: "#1a1a1a",
          textColor: "#ffffff",
          cardBackground: "#2c2c2c",
          borderColor: "#404040",
          primaryColor: "#0a84ff",
          name: "深色模式"
        }
      }[this.currentTheme];
    }
    /**
     * 监听系统主题变化（微信小程序）
     */
    onSystemThemeChange(callback) {
      try {
        if (typeof uni.onThemeChange === "function") {
          uni.onThemeChange((res) => {
            if (this.themeMode === "system") {
              const newTheme = res.theme === "dark" ? "dark" : "light";
              this.setTheme(newTheme);
              if (callback) {
                callback(newTheme);
              }
            }
          });
        } else {
          formatAppLog("log", "at common/utils/theme-simple.js:151", "非微信小程序环境，跳过系统主题监听");
          if (this.themeMode === "system") {
            this.setTheme("light");
          }
        }
      } catch (error) {
        formatAppLog("warn", "at common/utils/theme-simple.js:157", "无法监听系统主题变化:", error);
        if (this.themeMode === "system") {
          this.setTheme("light");
        }
      }
    }
  }
  const themeManager = new ThemeManager();
  const themeMixin = {
    data() {
      return {
        currentTheme: "light",
        isDarkMode: false
      };
    },
    mounted() {
      this.initTheme();
    },
    beforeUnmount() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      }
    }
  };
  const _sfc_main$o = {
    mixins: [themeMixin],
    components: {
      jobCard
    },
    data() {
      const techCategories = [101, 102, 103, 104, 105, 106, 107, 108];
      const designCategories = [200, 201, 202, 203, 204, 205];
      const manageCategories = [300, 301, 302, 303];
      return {
        bannerList: [
          { id: 1, imageUrl: "/static/banner1.png" },
          { id: 2, imageUrl: "/static/banner2.png" },
          { id: 3, imageUrl: "/static/banner3.png" }
        ],
        categoryList: [],
        allCategories: [],
        subCategoryList: [],
        jobList: [],
        allJobs: [],
        hasMore: true,
        currentPage: 1,
        pageSize: 10,
        currentCategory: "",
        currentEmpType: "",
        keyword: "",
        selectedSubCategories: [],
        showCategoryTabs: false,
        categoryName: "",
        // 分类常量
        techCategories,
        designCategories,
        manageCategories
      };
    },
    onLoad() {
      this.getRecommendJobs();
      setTimeout(() => {
        this.getJobCategories();
      }, 100);
    },
    onPullDownRefresh() {
      this.onRefresh();
    },
    methods: {
      async getRecommendJobs() {
        try {
          const networkType = await new Promise((resolve) => {
            uni.getNetworkType({
              success: (res2) => resolve(res2.networkType)
            });
          });
          if (networkType === "none") {
            uni.showToast({
              title: "当前无网络连接",
              icon: "none"
            });
            return;
          }
          const res = await jobApi.getAllJobs();
          let jobsData = [];
          if (res !== null && res !== void 0) {
            if (Array.isArray(res)) {
              jobsData = res;
            } else if (typeof res === "object" && Object.keys(res).length > 0) {
              if (res.list && Array.isArray(res.list)) {
                jobsData = res.list;
              } else if (res.data && Array.isArray(res.data)) {
                jobsData = res.data;
              } else if (res.jobs && Array.isArray(res.jobs)) {
                jobsData = res.jobs;
              } else {
                uni.showToast({
                  title: "获取推荐职位失败: 数据格式错误",
                  icon: "none"
                });
                jobsData = [];
              }
            } else {
              uni.showToast({
                title: "获取推荐职位失败: 数据格式错误",
                icon: "none"
              });
              jobsData = [];
            }
          } else {
            uni.showToast({
              title: "获取推荐职位失败: 后端无数据返回",
              icon: "none"
            });
            jobsData = [];
          }
          if (jobsData.length === 0) {
            jobsData = this.getMockJobsData();
          }
          jobsData = jobsData.map((job) => ({
            ...job,
            category_id: job.category_id && job.category_id !== "" ? Number(job.category_id) : null
          }));
          this.allJobs = jobsData;
          this.jobList = jobsData;
        } catch (error) {
          this.allJobs = [];
          this.jobList = [];
          formatAppLog("error", "at pages/index/index_index.vue:206", "获取推荐职位失败:", error);
          formatAppLog("error", "at pages/index/index_index.vue:207", "错误详情:", error.message, error.stack);
          if (error.message && error.message.includes("Packet sequence number wrong")) {
            uni.showToast({
              title: "网络连接异常，请稍后重试",
              icon: "none"
            });
          } else {
            uni.showToast({
              title: "获取推荐职位失败",
              icon: "none"
            });
          }
        }
      },
      goToCategory(categoryId) {
        if (this.techCategories.includes(Number(categoryId))) {
          this.currentCategory = "100";
        } else {
          this.currentCategory = categoryId;
        }
        if (this.currentCategory === "100" || this.techCategories.includes(Number(categoryId))) {
          this.showCategoryTabs = true;
          this.subCategoryList = this.allCategories.filter(
            (category) => this.techCategories.includes(Number(category.id))
          );
        } else {
          this.showCategoryTabs = false;
          this.subCategoryList = [];
        }
        this.selectedSubCategories = [];
        this.keyword = "";
        if (categoryId === "100" || !this.techCategories.includes(Number(categoryId))) {
          this.getJobsByCategory(categoryId);
        } else {
          this.selectedSubCategories = [Number(categoryId)];
          this.applyFilters();
        }
      },
      // 根据分类获取职位数据
      async getJobsByCategory(categoryId) {
        try {
          const networkType = await new Promise((resolve) => {
            uni.getNetworkType({
              success: (res2) => resolve(res2.networkType)
            });
          });
          if (networkType === "none") {
            uni.showToast({
              title: "当前无网络连接",
              icon: "none"
            });
            return;
          }
          const res = await jobApi.getJobsByCategory(categoryId);
          let jobsData = [];
          if (res !== null && res !== void 0) {
            if (Array.isArray(res)) {
              jobsData = res;
            } else if (typeof res === "object" && Object.keys(res).length > 0) {
              if (res.list && Array.isArray(res.list)) {
                jobsData = res.list;
              } else if (res.data && Array.isArray(res.data)) {
                jobsData = res.data;
              } else if (res.jobs && Array.isArray(res.jobs)) {
                jobsData = res.jobs;
              } else {
                uni.showToast({
                  title: "获取职位失败: 数据格式错误",
                  icon: "none"
                });
                jobsData = [];
              }
            } else {
              uni.showToast({
                title: "获取职位失败: 数据格式错误",
                icon: "none"
              });
              jobsData = [];
            }
          } else {
            uni.showToast({
              title: "获取职位失败: 后端无数据返回",
              icon: "none"
            });
            jobsData = [];
          }
          jobsData = jobsData.map((job) => ({
            ...job,
            category_id: job.category_id && job.category_id !== "" ? Number(job.category_id) : null
          }));
          this.allJobs = jobsData;
          this.jobList = jobsData;
        } catch (error) {
          this.allJobs = [];
          this.jobList = [];
          formatAppLog("error", "at pages/index/index_index.vue:335", "获取职位失败:", error);
          uni.showToast({
            title: "获取职位失败",
            icon: "none"
          });
        }
      },
      // 选择子分类
      selectSubCategory(categoryId) {
        const numCategoryId = Number(categoryId);
        const index = this.selectedSubCategories.indexOf(numCategoryId);
        if (index === -1) {
          this.selectedSubCategories.push(numCategoryId);
        } else {
          this.selectedSubCategories.splice(index, 1);
        }
        this.applyFilters();
      },
      // 搜索输入事件
      onSearchInput() {
        if (this.allJobs.length === 0) {
          formatAppLog("log", "at pages/index/index_index.vue:365", "allJobs为空，使用模拟数据");
          this.allJobs = this.getMockJobsData();
        }
        this.applyFilters();
      },
      // 应用所有筛选条件
      applyFilters() {
        if (this.allJobs.length === 0) {
          formatAppLog("log", "at pages/index/index_index.vue:375", "allJobs为空，使用模拟数据");
          this.allJobs = this.getMockJobsData();
        }
        let filteredJobs = [...this.allJobs];
        if (this.currentCategory) {
          const currentCatNum = Number(this.currentCategory);
          const selectedSubCats = Array.from(this.selectedSubCategories).map((id) => Number(id));
          filteredJobs = filteredJobs.filter((job) => {
            if (!job || job.category_id === null) {
              return false;
            }
            const jobCategoryId = Number(job.category_id);
            if (currentCatNum === 100) {
              if (selectedSubCats.length > 0) {
                return selectedSubCats.some((catId) => catId === jobCategoryId);
              } else {
                return this.techCategories.includes(jobCategoryId);
              }
            } else if (this.techCategories.includes(currentCatNum)) {
              return jobCategoryId === currentCatNum;
            } else if (this.designCategories.includes(currentCatNum)) {
              return this.designCategories.includes(jobCategoryId);
            } else if (this.manageCategories.includes(currentCatNum)) {
              return this.manageCategories.includes(jobCategoryId);
            } else {
              return jobCategoryId === currentCatNum;
            }
          });
        }
        if (this.keyword && this.keyword.trim() !== "") {
          const keywordLower = this.keyword.toLowerCase().trim();
          filteredJobs = filteredJobs.filter((job) => {
            const titleMatch = job.title && job.title.toLowerCase().includes(keywordLower);
            const companyMatch = job.company && job.company.toLowerCase().includes(keywordLower);
            const descriptionMatch = job.description && job.description.toLowerCase().includes(keywordLower);
            const isMatch = titleMatch || companyMatch || descriptionMatch;
            return isMatch;
          });
        }
        this.jobList = filteredJobs;
      },
      scrollToJobList() {
        uni.pageScrollTo({
          selector: ".job-list",
          duration: 300
        });
      },
      loadMore() {
        this.currentPage++;
      },
      onRefresh() {
        this.currentPage = 1;
        this.getRecommendJobs();
        this.getJobCategories();
        uni.stopPullDownRefresh();
      },
      getJobCategories() {
        const mainCategories = [
          { id: "100", name: "技术开发", icon: "/static/category/tech.png" },
          { id: "200", name: "产品与设计", icon: "/static/category/design.png" },
          { id: "300", name: "技术管理", icon: "/static/category/product.png" }
        ];
        jobApi.getJobCategories().then((res) => {
          if (res && Array.isArray(res)) {
            this.allCategories = res;
            this.categoryList = mainCategories;
            this.ensureTechSubCategories();
          } else {
            this.categoryList = mainCategories;
            this.generateMockSubCategories();
          }
        }).catch((error) => {
          formatAppLog("error", "at pages/index/index_index.vue:489", "获取职位分类失败:", error);
          this.categoryList = mainCategories;
          this.generateMockSubCategories();
        });
      },
      // 根据技术开发分类ID获取分类名称
      getTechSubCategoryName(categoryId) {
        const nameMap = {
          101: "前端开发",
          102: "后端开发",
          103: "移动开发",
          104: "人工智能",
          105: "大数据",
          106: "云计算",
          107: "网络安全",
          108: "嵌入式开发"
        };
        return nameMap[categoryId] || "未知分类";
      },
      // 确保allCategories包含技术开发的子分类
      ensureTechSubCategories() {
        const techSubCategories = this.techCategories.map((id) => ({
          id,
          name: this.getTechSubCategoryName(id),
          parent_id: null
        }));
        const existingIds = this.allCategories.map((cat) => Number(cat.id));
        techSubCategories.forEach((subCat) => {
          if (!existingIds.includes(subCat.id)) {
            this.allCategories.push(subCat);
          }
        });
      },
      // 生成模拟的子分类数据（当后端没有返回时使用）
      generateMockSubCategories() {
        this.allCategories = [
          // 技术开发类（101-108）
          { id: 101, name: "前端开发", parent_id: null },
          { id: 102, name: "后端开发", parent_id: null },
          { id: 103, name: "移动开发", parent_id: null },
          { id: 104, name: "人工智能", parent_id: null },
          { id: 105, name: "大数据", parent_id: null },
          { id: 106, name: "云计算", parent_id: null },
          { id: 107, name: "网络安全", parent_id: null },
          { id: 108, name: "嵌入式开发", parent_id: null },
          // 产品与设计类（200系列）
          { id: 200, name: "产品经理", parent_id: null },
          { id: 201, name: "UI设计师", parent_id: null },
          { id: 202, name: "交互设计师", parent_id: null },
          { id: 203, name: "UX研究员", parent_id: null },
          // 技术管理类（300系列）
          { id: 300, name: "技术经理", parent_id: null },
          { id: 301, name: "架构师", parent_id: null },
          { id: 302, name: "研发总监", parent_id: null },
          { id: 303, name: "CTO", parent_id: null }
        ];
      },
      // 生成模拟职位数据
      getMockJobsData() {
        const mockData = [
          // 技术开发类（101-108）
          { id: 1, title: "前端开发工程师", company: "科技有限公司", category_id: 101, emp_type: 1, description: "负责公司网站前端开发，使用Vue框架" },
          { id: 2, title: "后端开发工程师", company: "互联网科技", category_id: 102, emp_type: 1, description: "负责Java后端开发，熟悉Spring框架" },
          { id: 3, title: "移动端开发工程师", company: "移动科技", category_id: 103, emp_type: 1, description: "负责React Native移动应用开发" },
          { id: 4, title: "人工智能工程师", company: "AI科技", category_id: 104, emp_type: 1, description: "负责机器学习模型开发" },
          { id: 5, title: "大数据工程师", company: "数据科技", category_id: 105, emp_type: 1, description: "负责大数据平台开发" },
          { id: 6, title: "云计算工程师", company: "云服务", category_id: 106, emp_type: 1, description: "负责云平台架构设计" },
          { id: 7, title: "网络安全工程师", company: "安全科技", category_id: 107, emp_type: 1, description: "负责网络安全防护" },
          { id: 8, title: "嵌入式开发工程师", company: "硬件科技", category_id: 108, emp_type: 1, description: "负责嵌入式系统开发" },
          // 产品与设计类（200系列）
          { id: 9, title: "产品经理", company: "产品科技", category_id: 200, emp_type: 1, description: "负责产品规划和需求分析" },
          { id: 10, title: "UI设计师", company: "设计工作室", category_id: 201, emp_type: 2, description: "负责产品UI设计，熟悉Figma工具" },
          { id: 11, title: "交互设计师", company: "用户体验", category_id: 202, emp_type: 1, description: "负责交互设计和原型制作" },
          { id: 12, title: "UX研究员", company: "用户研究", category_id: 203, emp_type: 2, description: "负责用户调研和数据分析" },
          // 技术管理类（300系列）
          { id: 13, title: "技术经理", company: "管理团队", category_id: 300, emp_type: 1, description: "负责技术团队管理" },
          { id: 14, title: "架构师", company: "架构团队", category_id: 301, emp_type: 1, description: "负责系统架构设计" },
          { id: 15, title: "研发总监", company: "研发管理", category_id: 302, emp_type: 1, description: "负责研发部门管理" },
          { id: 16, title: "CTO", company: "技术领导", category_id: 303, emp_type: 1, description: "负责公司技术战略" }
        ];
        return mockData;
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    const _component_job_card = vue.resolveComponent("job-card");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "container",
        style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "首页",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "search-bar",
            style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#2c2c2c" : "rgba(255, 255, 255, 0.8)" })
          },
          [
            vue.createVNode(_component_uni_icons, {
              type: "search",
              size: "30",
              color: _ctx.isDarkMode ? "#999" : "#999"
            }, null, 8, ["color"]),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "text",
                id: "search-keyword",
                name: "keyword",
                placeholder: "搜索职位、公司名称",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.keyword = $event),
                onInput: _cache[1] || (_cache[1] = (...args) => $options.onSearchInput && $options.onSearchInput(...args)),
                style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
              },
              null,
              36
              /* STYLE, NEED_HYDRATION */
            ), [
              [vue.vModelText, $data.keyword]
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("swiper", {
          autoplay: true,
          interval: 3e3,
          duration: 1e3,
          "indicator-dots": "",
          circular: ""
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.bannerList, (banner, index) => {
              return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
                vue.createElementVNode("image", {
                  src: banner.imageUrl,
                  class: "banner-img"
                }, null, 8, ["src"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode(
          "view",
          {
            class: "category-section",
            style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)" })
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.categoryList, (category) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "category-item",
                  key: category.id,
                  onClick: ($event) => $options.goToCategory(category.id)
                }, [
                  vue.createElementVNode("image", {
                    src: category.icon,
                    class: "category-icon"
                  }, null, 8, ["src"]),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "category-name",
                      style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    vue.toDisplayString(category.name),
                    5
                    /* TEXT, STYLE */
                  )
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        ),
        $data.showCategoryTabs && $data.subCategoryList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "sub-category-tabs"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.subCategoryList, (category) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["sub-category-tab", { active: $data.selectedSubCategories.includes(category.id) }]),
                key: category.id,
                onClick: ($event) => $options.selectSubCategory(category.id),
                style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)", color: "#007aff" })
              }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString(category.name),
                  1
                  /* TEXT */
                )
              ], 14, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            class: "job-section",
            style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)" })
          },
          [
            vue.createElementVNode("view", { class: "section-header" }, [
              vue.createElementVNode("view", { class: "title-container" }, [
                vue.createElementVNode("view", { class: "title-dot" }),
                vue.createElementVNode(
                  "text",
                  {
                    class: "section-title",
                    style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  vue.toDisplayString($data.categoryName || "推荐职位"),
                  5
                  /* TEXT, STYLE */
                )
              ]),
              vue.createElementVNode("text", {
                class: "more-btn",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.scrollToJobList && $options.scrollToJobList(...args))
              }, "查看更多")
            ]),
            vue.createElementVNode(
              "view",
              {
                class: "job-list",
                ref: "jobList"
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.jobList, (job) => {
                    return vue.openBlock(), vue.createBlock(_component_job_card, {
                      key: job.id,
                      data: job,
                      "is-dark": _ctx.isDarkMode
                    }, null, 8, ["data", "is-dark"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              512
              /* NEED_PATCH */
            ),
            $data.hasMore ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "load-more",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.loadMore && $options.loadMore(...args)),
                style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#999" })
              },
              [
                vue.createElementVNode("text", null, "加载更多")
              ],
              4
              /* STYLE */
            )) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesIndexIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/index/index_index.vue"]]);
  const _sfc_main$n = {
    data() {
      return {
        jobId: "",
        jobDetail: {},
        userProfile: null,
        isApplied: false,
        isFavorited: false
      };
    },
    async onLoad(options) {
      if (!options.id)
        return;
      this.jobId = options.id;
      await this.getJobDetail();
      await this.getUserProfile();
      await this.checkFavoriteStatus();
      await this.checkDeliverStatus();
    },
    methods: {
      /* ================= 导航方法 ================= */
      goBack() {
        uni.navigateBack();
      },
      shareJob() {
        uni.showShareMenu({
          withShareTicket: true
        });
      },
      /* ================= 获取职位详情 ================= */
      async getJobDetail() {
        try {
          const res = await jobApi.getJobDetail(this.jobId);
          formatAppLog("log", "at pages/job/detail/job_detail_index.vue:185", "转换后的delivers:", res);
          this.jobDetail = res;
          if (Array.isArray(res) && res.length > 0) {
            this.jobDetail = res[0];
          } else if (res && typeof res === "object") {
            this.jobDetail = res;
          } else {
            this.jobDetail = {};
          }
          if (typeof this.jobDetail.require_list === "string") {
            this.jobDetail.require_list = JSON.parse(this.jobDetail.require_list);
          }
          if (typeof this.jobDetail.welfare_list === "string") {
            this.jobDetail.welfare_list = JSON.parse(this.jobDetail.welfare_list);
          }
          if (!this.jobDetail.boss_job_id && this.jobDetail.id) {
            this.jobDetail.boss_job_id = this.jobDetail.id;
          }
        } catch (error) {
          formatAppLog("error", "at pages/job/detail/job_detail_index.vue:210", "获取职位详情失败:", error);
          uni.showToast({ title: "获取详情失败", icon: "none" });
        }
      },
      /* ================= 获取用户信息 ================= */
      async getUserProfile() {
        try {
          const user = await userApi.getUserProfile();
          formatAppLog("log", "at pages/job/detail/job_detail_index.vue:219", "从API获取用户信息:", user);
          this.userProfile = user;
        } catch (error) {
          formatAppLog("error", "at pages/job/detail/job_detail_index.vue:222", "获取用户信息失败:", error);
          const userInfoStr = uni.getStorageSync("userInfo");
          formatAppLog("log", "at pages/job/detail/job_detail_index.vue:225", "从本地存储获取用户信息:", userInfoStr);
          if (userInfoStr) {
            try {
              const userInfo = JSON.parse(userInfoStr);
              formatAppLog("log", "at pages/job/detail/job_detail_index.vue:229", "解析后的用户信息:", userInfo);
              this.userProfile = userInfo;
            } catch (parseError) {
              formatAppLog("error", "at pages/job/detail/job_detail_index.vue:232", "解析用户信息失败:", parseError);
            }
          }
        }
        formatAppLog("log", "at pages/job/detail/job_detail_index.vue:236", "最终用户信息:", this.userProfile);
      },
      /* ================= 点击投递 ================= */
      applyForJob() {
        var _a;
        const jobId = (_a = this.jobDetail) == null ? void 0 : _a.id;
        if (!jobId) {
          uni.showToast({ title: "职位信息不完整", icon: "none" });
          return;
        }
        let delivers = uni.getStorageSync("delivers") || [];
        if (this.isApplied) {
          delivers = delivers.filter((item) => item.id !== jobId);
          this.isApplied = false;
          uni.showToast({
            title: "已取消投递",
            icon: "success"
          });
        } else {
          const isAlreadyApplied = delivers.some((item) => item.id === jobId);
          if (isAlreadyApplied) {
            uni.showToast({
              title: "该职位已投递",
              icon: "none"
            });
            return;
          }
          const newDeliver = {
            id: jobId,
            jobTitle: this.jobDetail.title,
            company: this.jobDetail.company || "未知公司",
            salary: this.formatSalary(this.jobDetail.salary_min, this.jobDetail.salary_max),
            deliverTime: (/* @__PURE__ */ new Date()).toLocaleString(),
            status: "pending",
            statusText: "待处理"
          };
          delivers.push(newDeliver);
          this.isApplied = true;
          uni.showToast({
            title: "投递成功",
            icon: "success"
          });
        }
        uni.setStorageSync("delivers", delivers);
      },
      /* ================= 点击收藏 ================= */
      favoriteJob() {
        var _a;
        const jobId = (_a = this.jobDetail) == null ? void 0 : _a.id;
        if (!jobId) {
          uni.showToast({ title: "职位信息不完整", icon: "none" });
          return;
        }
        let collections = uni.getStorageSync("collections") || [];
        if (this.isFavorited) {
          collections = collections.filter((item) => item.id !== jobId);
          this.isFavorited = false;
          uni.showToast({
            title: "已取消收藏",
            icon: "success"
          });
        } else {
          const isAlreadyFavorited = collections.some((item) => item.id === jobId);
          if (isAlreadyFavorited) {
            uni.showToast({
              title: "该职位已收藏",
              icon: "none"
            });
            return;
          }
          const newCollection = {
            id: jobId,
            jobTitle: this.jobDetail.title,
            company: this.jobDetail.company || "未知公司",
            salary: this.formatSalary(this.jobDetail.salary_min, this.jobDetail.salary_max),
            collectionTime: (/* @__PURE__ */ new Date()).toLocaleString()
          };
          collections.push(newCollection);
          this.isFavorited = true;
          uni.showToast({
            title: "收藏成功",
            icon: "success"
          });
        }
        uni.setStorageSync("collections", collections);
        this.$emit("update:favorited", this.isFavorited);
      },
      /* ================= 检查收藏状态 ================= */
      checkFavoriteStatus() {
        var _a;
        const jobId = (_a = this.jobDetail) == null ? void 0 : _a.id;
        if (!jobId)
          return;
        const collections = uni.getStorageSync("collections") || [];
        this.isFavorited = collections.some((item) => item.id === jobId);
      },
      /* ================= 检查投递状态 ================= */
      checkDeliverStatus() {
        var _a;
        const jobId = (_a = this.jobDetail) == null ? void 0 : _a.id;
        if (!jobId)
          return;
        const delivers = uni.getStorageSync("delivers") || [];
        this.isApplied = delivers.some((item) => item.id === jobId);
      },
      /* ================= 格式化薪资 ================= */
      formatSalary(min, max) {
        if (min && max) {
          const minNum = typeof min === "number" ? min : parseFloat(min);
          const maxNum = typeof max === "number" ? max : parseFloat(max);
          return `${(minNum / 1e3).toFixed(0)}-${(maxNum / 1e3).toFixed(0)}K`;
        }
        return "薪资面议";
      },
      /* ================= 工具方法 ================= */
      getEmpTypeText(type) {
        const map = {
          "1": "全职",
          "2": "兼职",
          "3": "实习"
        };
        return map[type] || "全职";
      },
      formatDate(dateString) {
        if (!dateString)
          return "";
        const date = new Date(dateString);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const h = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        return `${y}-${m}-${d} ${h}:${min}`;
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock("view", { class: "job-detail-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("view", { class: "nav-bar-left" }, [
          vue.createVNode(_component_uni_icons, {
            type: "back",
            size: "28",
            class: "nav-back-icon",
            onClick: $options.goBack
          }, null, 8, ["onClick"])
        ]),
        vue.createElementVNode("view", { class: "nav-bar-center" }, [
          vue.createElementVNode("text", { class: "nav-bar-title" }, "职位详情")
        ]),
        vue.createElementVNode("view", { class: "nav-bar-right" })
      ]),
      vue.createElementVNode("view", { class: "job-header" }, [
        vue.createElementVNode(
          "text",
          { class: "job-title" },
          vue.toDisplayString(((_a = $data.jobDetail) == null ? void 0 : _a.title) || "暂无职位信息"),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "salary-container" }, [
          vue.createElementVNode(
            "text",
            { class: "job-salary" },
            vue.toDisplayString(((_b = $data.jobDetail) == null ? void 0 : _b.salary_min) ? `${($data.jobDetail.salary_min / 1e3).toFixed(0)}k-${((_c = $data.jobDetail) == null ? void 0 : _c.salary_max) ? ($data.jobDetail.salary_max / 1e3).toFixed(0) : "?"}k` : "薪资面议"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "salary-unit" }, "· 每月")
        ]),
        vue.createElementVNode("view", { class: "company-info" }, [
          vue.createElementVNode(
            "text",
            { class: "company-name" },
            vue.toDisplayString(((_d = $data.jobDetail) == null ? void 0 : _d.company) || "未知公司"),
            1
            /* TEXT */
          ),
          vue.createElementVNode("text", { class: "company-separator" }, "·"),
          vue.createElementVNode("text", { class: "company-tag" }, "已认证")
        ]),
        vue.createElementVNode("view", { class: "job-tags" }, [
          vue.createElementVNode(
            "text",
            { class: "job-tag" },
            vue.toDisplayString(((_e = $data.jobDetail) == null ? void 0 : _e.edu_req) || "学历不限"),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "job-tag" },
            vue.toDisplayString(((_f = $data.jobDetail) == null ? void 0 : _f.exp_req) || "经验不限"),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "job-tag" },
            vue.toDisplayString(((_g = $data.jobDetail) == null ? void 0 : _g.emp_type) ? $options.getEmpTypeText($data.jobDetail.emp_type) : "全职"),
            1
            /* TEXT */
          )
        ])
      ]),
      ((_h = $data.jobDetail) == null ? void 0 : _h.address) ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "address-section"
      }, [
        vue.createElementVNode("view", { class: "address-content" }, [
          vue.createVNode(_component_uni_icons, {
            type: "location",
            size: "24",
            color: "#007aff",
            class: "address-icon"
          }),
          vue.createElementVNode(
            "text",
            { class: "address-text" },
            vue.toDisplayString($data.jobDetail.district || "") + " " + vue.toDisplayString($data.jobDetail.address),
            1
            /* TEXT */
          ),
          vue.createVNode(_component_uni_icons, {
            type: "copy",
            size: "20",
            color: "#6C757D",
            class: "address-action"
          })
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "job-section" }, [
        vue.createElementVNode("view", { class: "section-title" }, [
          vue.createElementVNode("view", { class: "title-dot" }),
          vue.createElementVNode("text", null, "职位描述")
        ]),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString(((_i = $data.jobDetail) == null ? void 0 : _i.description) || "暂无描述"),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "job-section" }, [
        vue.createElementVNode("view", { class: "section-title" }, [
          vue.createElementVNode("view", { class: "title-dot" }),
          vue.createElementVNode("text", null, "任职要求")
        ]),
        vue.createElementVNode("view", { class: "section-content" }, [
          Array.isArray((_j = $data.jobDetail) == null ? void 0 : _j.require_list) && $data.jobDetail.require_list.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.jobDetail.require_list, (req, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "requirement-item"
                }, [
                  vue.createElementVNode("text", { class: "requirement-dot" }),
                  vue.createElementVNode(
                    "text",
                    { class: "requirement-text" },
                    vue.toDisplayString(req),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock(
            "text",
            { key: 1 },
            vue.toDisplayString(((_k = $data.jobDetail) == null ? void 0 : _k.require_list) || "暂无要求"),
            1
            /* TEXT */
          ))
        ])
      ]),
      ((_l = $data.jobDetail) == null ? void 0 : _l.welfare_list) ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "job-section"
      }, [
        vue.createElementVNode("view", { class: "section-title" }, [
          vue.createElementVNode("view", { class: "title-dot" }),
          vue.createElementVNode("text", null, "福利待遇")
        ]),
        vue.createElementVNode("view", { class: "section-content" }, [
          Array.isArray((_m = $data.jobDetail) == null ? void 0 : _m.welfare_list) && $data.jobDetail.welfare_list.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.jobDetail.welfare_list, (welfare, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: "welfare-item"
                }, [
                  vue.createElementVNode("text", { class: "welfare-dot" }),
                  vue.createElementVNode(
                    "text",
                    { class: "welfare-text" },
                    vue.toDisplayString(welfare),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])) : (vue.openBlock(), vue.createElementBlock(
            "text",
            { key: 1 },
            vue.toDisplayString((_n = $data.jobDetail) == null ? void 0 : _n.welfare_list),
            1
            /* TEXT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      ((_o = $data.jobDetail) == null ? void 0 : _o.salary_desc) ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "job-section"
      }, [
        vue.createElementVNode("view", { class: "section-title" }, [
          vue.createElementVNode("view", { class: "title-dot" }),
          vue.createElementVNode("text", null, "薪资详情")
        ]),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($data.jobDetail.salary_desc),
            1
            /* TEXT */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true),
      ((_p = $data.jobDetail) == null ? void 0 : _p.publish_time) ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "job-section"
      }, [
        vue.createElementVNode("view", { class: "section-title" }, [
          vue.createElementVNode("view", { class: "title-dot" }),
          vue.createElementVNode("text", null, "发布时间")
        ]),
        vue.createElementVNode("view", { class: "section-content" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($options.formatDate($data.jobDetail.publish_time)),
            1
            /* TEXT */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "bottom-bar" }, [
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass(["collect-button", { "collected": $data.isFavorited }]),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.favoriteJob && $options.favoriteJob(...args))
          },
          [
            vue.createVNode(_component_uni_icons, {
              type: $data.isFavorited ? "star-filled" : "star",
              size: "24",
              color: $data.isFavorited ? "#007aff" : "#6C757D",
              class: "collect-icon"
            }, null, 8, ["type", "color"]),
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["collect-text", { "collected": $data.isFavorited }])
              },
              vue.toDisplayString($data.isFavorited ? "已收藏" : "收藏"),
              3
              /* TEXT, CLASS */
            )
          ],
          2
          /* CLASS */
        ),
        vue.createElementVNode("button", {
          class: vue.normalizeClass(["apply-button", { "applied": $data.isApplied }]),
          disabled: $data.isApplied,
          onClick: _cache[1] || (_cache[1] = (...args) => $options.applyForJob && $options.applyForJob(...args))
        }, vue.toDisplayString($data.isApplied ? "已投递" : "投递"), 11, ["disabled"])
      ])
    ]);
  }
  const PagesJobDetailJobDetailIndex = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/job/detail/job_detail_index.vue"]]);
  const _sfc_main$m = {
    data() {
      return {
        jobData: {
          boss_job_id: "",
          title: "",
          company_id: "",
          city_id: "",
          category_id: 0,
          emp_type: 0,
          salary_min: "",
          salary_max: "",
          salary_desc: "",
          edu_req: "",
          exp_req: "",
          district: "",
          address: "",
          recruiter_id: "",
          description: "",
          require_list: [],
          welfare_list: [],
          publish_time: "",
          refresh_time: "",
          status: 1
        },
        categoryList: [
          { id: 1001, name: "技术" },
          { id: 1002, name: "产品" },
          { id: 1003, name: "设计" },
          { id: 1004, name: "运营" },
          { id: 1005, name: "市场" }
        ],
        empTypeList: [
          { id: 1, name: "全职" },
          { id: 2, name: "兼职" },
          { id: 3, name: "实习" }
        ]
      };
    },
    computed: {
      selectedCategoryName() {
        const category = this.categoryList.find((c) => c.id === this.jobData.category_id);
        return category ? category.name : "";
      },
      selectedEmpTypeName() {
        const type = this.empTypeList.find((t) => t.id === this.jobData.emp_type);
        return type ? type.name : "";
      }
    },
    methods: {
      onCancel() {
        uni.navigateBack();
      },
      // 获取职位分类在picker中的索引
      getCategoryIndex() {
        return this.categoryList.findIndex((c) => c.id === this.jobData.category_id);
      },
      // 职位分类选择变化处理
      onCategoryChange(e) {
        const index = e.detail.value;
        this.jobData.category_id = this.categoryList[index].id;
      },
      // 获取就业类型在picker中的索引
      getEmpTypeIndex() {
        return this.empTypeList.findIndex((t) => t.id === this.jobData.emp_type);
      },
      // 就业类型选择变化处理
      onEmpTypeChange(e) {
        const index = e.detail.value;
        this.jobData.emp_type = this.empTypeList[index].id;
      },
      async onSubmit() {
        if (!this.jobData.title || !this.jobData.company_id || !this.jobData.city_id || !this.jobData.category_id) {
          uni.showToast({
            title: "请填写必填项",
            icon: "none"
          });
          return;
        }
        try {
          const submitData = {
            ...this.jobData,
            boss_job_id: Date.now().toString(),
            company_id: parseInt(this.jobData.company_id),
            city_id: parseInt(this.jobData.city_id),
            category_id: parseInt(this.jobData.category_id),
            emp_type: parseInt(this.jobData.emp_type),
            salary_min: parseFloat(this.jobData.salary_min) * 1e3,
            salary_max: parseFloat(this.jobData.salary_max) * 1e3,
            publish_time: (/* @__PURE__ */ new Date()).toISOString(),
            refresh_time: (/* @__PURE__ */ new Date()).toISOString()
          };
          await jobApi.addJob(submitData);
          uni.showToast({
            title: "发布成功",
            icon: "success"
          });
          setTimeout(() => {
            uni.navigateBack({
              delta: 1
            });
          }, 1500);
        } catch (error) {
          formatAppLog("error", "at pages/job/add/job_add_index.vue:194", "发布失败:", error);
          uni.showToast({
            title: "发布失败",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "job-add-page" }, [
      vue.createElementVNode("view", { class: "page-header" }, [
        vue.createElementVNode("text", {
          class: "cancel-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.onCancel && $options.onCancel(...args))
        }, "取消"),
        vue.createElementVNode("text", { class: "title" }, "发布职位"),
        vue.createElementVNode("text", {
          class: "save-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.onSubmit && $options.onSubmit(...args))
        }, "发布")
      ]),
      vue.createElementVNode("view", { class: "form-container" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "职位名称"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              placeholder: "请输入职位名称",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.jobData.title = $event)
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.jobData.title]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "公司ID"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              placeholder: "请输入公司ID",
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.jobData.company_id = $event)
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.jobData.company_id]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "城市ID"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              placeholder: "请输入城市ID",
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.jobData.city_id = $event)
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.jobData.city_id]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "职位分类"),
          vue.createElementVNode("picker", {
            range: $data.categoryList,
            "range-key": "name",
            value: $options.getCategoryIndex(),
            onChange: _cache[5] || (_cache[5] = (...args) => $options.onCategoryChange && $options.onCategoryChange(...args))
          }, [
            vue.createElementVNode(
              "view",
              { class: "picker-value" },
              vue.toDisplayString($options.selectedCategoryName || "请选择职位分类"),
              1
              /* TEXT */
            )
          ], 40, ["range", "value"])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "就业类型"),
          vue.createElementVNode("picker", {
            range: $data.empTypeList,
            "range-key": "name",
            value: $options.getEmpTypeIndex(),
            onChange: _cache[6] || (_cache[6] = (...args) => $options.onEmpTypeChange && $options.onEmpTypeChange(...args))
          }, [
            vue.createElementVNode(
              "view",
              { class: "picker-value" },
              vue.toDisplayString($options.selectedEmpTypeName || "请选择就业类型"),
              1
              /* TEXT */
            )
          ], 40, ["range", "value"])
        ]),
        vue.createElementVNode("view", { class: "form-item salary-item" }, [
          vue.createElementVNode("text", { class: "label" }, "薪资范围"),
          vue.createElementVNode("view", { class: "salary-inputs" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                placeholder: "最低",
                "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.jobData.salary_min = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.jobData.salary_min]
            ]),
            vue.createElementVNode("text", { class: "salary-divider" }, "-"),
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                placeholder: "最高",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.jobData.salary_max = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.jobData.salary_max]
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "学历要求"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              placeholder: "请输入学历要求",
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.jobData.edu_req = $event)
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.jobData.edu_req]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "经验要求"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              placeholder: "请输入经验要求",
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.jobData.exp_req = $event)
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.jobData.exp_req]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "职位描述"),
          vue.withDirectives(vue.createElementVNode(
            "textarea",
            {
              placeholder: "请输入职位描述",
              "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.jobData.description = $event),
              rows: "4"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.jobData.description]
          ])
        ])
      ])
    ]);
  }
  const PagesJobAddJobAddIndex = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/job/add/job_add_index.vue"]]);
  const _sfc_main$l = {
    data() {
      return {
        userInfo: {
          name: "张三",
          avatar: ""
        },
        // 主题相关
        currentTheme: "light",
        isDarkMode: false
      };
    },
    onShow() {
      this.checkLoginStatus();
      this.initTheme();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      async checkLoginStatus() {
        formatAppLog("log", "at pages/user/user.vue:126", "开始检查用户登录状态");
        const userInfo = uni.getStorageSync("userInfo");
        formatAppLog("log", "at pages/user/user.vue:128", "从本地存储获取userInfo:", userInfo);
        if (userInfo) {
          if (typeof userInfo === "string") {
            try {
              this.userInfo = JSON.parse(userInfo);
              formatAppLog("log", "at pages/user/user.vue:134", "解析userInfo成功:", this.userInfo);
            } catch (e) {
              formatAppLog("error", "at pages/user/user.vue:136", "解析userInfo失败:", e);
              this.userInfo = null;
            }
          } else {
            this.userInfo = userInfo;
            formatAppLog("log", "at pages/user/user.vue:141", "直接使用userInfo:", this.userInfo);
          }
          try {
            formatAppLog("log", "at pages/user/user.vue:147", "开始获取用户名称和头像");
            const res = await userApi.getUserNameAndAvatar();
            formatAppLog("log", "at pages/user/user.vue:149", "获取用户名称和头像成功:", res);
            if (res) {
              this.userInfo.name = res.user_name;
              this.userInfo.real_name = res.user_name;
              this.userInfo.avatar = res.user_avatar;
              this.userInfo.avatar_format = res.user_avatar_format;
              this.userInfo.avatar_size = res.user_avatar_size;
              formatAppLog("log", "at pages/user/user.vue:157", "更新用户信息成功:", this.userInfo);
              const userInfoToSave = {
                name: res.user_name,
                real_name: res.user_name,
                avatar: res.user_avatar,
                avatar_format: res.user_avatar_format,
                avatar_size: res.user_avatar_size
              };
              uni.setStorageSync("userInfo", JSON.stringify(userInfoToSave));
              formatAppLog("log", "at pages/user/user.vue:167", "保存用户信息到本地存储成功");
            }
          } catch (error) {
            formatAppLog("error", "at pages/user/user.vue:170", "获取用户名称和头像失败:", error);
            try {
              formatAppLog("log", "at pages/user/user.vue:173", "开始获取用户信息");
              const res = await userApi.getUserProfile();
              formatAppLog("log", "at pages/user/user.vue:175", "获取用户信息成功:", res);
              if (res) {
                this.userInfo = res;
                formatAppLog("log", "at pages/user/user.vue:178", "更新用户信息成功:", this.userInfo);
                const userInfoToSave = {
                  name: res.name || res.real_name,
                  real_name: res.real_name,
                  avatar: res.avatar,
                  avatar_format: res.avatar_format,
                  avatar_size: res.avatar_size
                };
                uni.setStorageSync("userInfo", JSON.stringify(userInfoToSave));
                formatAppLog("log", "at pages/user/user.vue:188", "保存用户信息到本地存储成功");
              }
            } catch (error2) {
              formatAppLog("error", "at pages/user/user.vue:191", "获取用户信息失败:", error2);
            }
          }
        } else {
          formatAppLog("log", "at pages/user/user.vue:195", "本地存储中没有userInfo");
        }
      },
      // 检查头像数据是否有效
      isValidAvatar(avatar) {
        if (!avatar || avatar === "") {
          return false;
        }
        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
          return false;
        }
        const cleaned = avatar.replace(/\s+/g, "");
        return cleaned.length > 0;
      },
      // 解码HTML实体
      decodeHtmlEntities(text) {
        const entities = {
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": '"',
          "&#39;": "'"
        };
        return text.replace(/&[#\w]+;/g, (entity) => {
          return entities[entity] || entity;
        });
      },
      navigateToResume() {
        uni.navigateTo({
          url: "/pages/user/resume/user_resume"
        });
      },
      navigateToCollection() {
        uni.navigateTo({
          url: "/pages/user/collection/user_collection"
        });
      },
      navigateToDeliver() {
        uni.navigateTo({
          url: "/pages/user/deliver/user_deliver"
        });
      },
      navigateToFeedback() {
        uni.navigateTo({
          url: "/pages/user/feedback/user_feedback"
        });
      },
      navigateToAccount() {
        uni.navigateTo({
          url: "/pages/user/account/user_account"
        });
      },
      navigateToDevice() {
        uni.navigateTo({
          url: "/pages/user/device/user_device"
        });
      },
      navigateToDisplay() {
        uni.navigateTo({
          url: "/pages/user/display/user_display"
        });
      },
      navigateToThemeDemo() {
        uni.navigateTo({
          url: "/pages/chart"
        });
      },
      logout() {
        uni.showModal({
          title: "提示",
          content: "确定要退出登录吗？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("token");
              uni.removeStorageSync("userInfo");
              uni.showToast({
                title: "已退出登录",
                icon: "success"
              });
              setTimeout(() => {
                uni.navigateTo({
                  url: "/pages/login/login"
                });
              }, 1500);
            }
          }
        });
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "user-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "我的",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "top-card",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "user-header" }, [
              vue.createElementVNode("image", {
                class: "avatar",
                src: $data.userInfo.avatar ? "data:image/jpeg;base64," + $data.userInfo.avatar.replace(/\s+/g, "") : "/static/default-avatar.png",
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "user-info" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: "user-name",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  vue.toDisplayString($data.userInfo.name || "已登录"),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode("text", {
                  class: "edit-resume",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToResume && $options.navigateToResume(...args)),
                  style: { color: "#007aff" }
                }, "编辑简历")
              ])
            ]),
            vue.createElementVNode(
              "view",
              {
                class: "function-icons",
                style: vue.normalizeStyle({ borderTop: $data.isDarkMode ? "1px solid #404040" : "1px solid #E6F0FF" })
              },
              [
                vue.createElementVNode(
                  "view",
                  {
                    class: "icon-item",
                    onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToCollection && $options.navigateToCollection(...args)),
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                  },
                  [
                    vue.createVNode(_component_uni_icons, {
                      type: "star",
                      size: "40",
                      color: $data.isDarkMode ? "#ffb800" : "#ff9500"
                    }, null, 8, ["color"]),
                    vue.createElementVNode(
                      "text",
                      {
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                      },
                      "收藏职位",
                      4
                      /* STYLE */
                    )
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: "icon-item",
                    onClick: _cache[2] || (_cache[2] = (...args) => $options.navigateToDeliver && $options.navigateToDeliver(...args)),
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                  },
                  [
                    vue.createVNode(_component_uni_icons, {
                      type: "paperplane",
                      size: "40",
                      color: "#007aff"
                    }),
                    vue.createElementVNode(
                      "text",
                      {
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                      },
                      "投递职位",
                      4
                      /* STYLE */
                    )
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: "icon-item",
                    onClick: _cache[3] || (_cache[3] = (...args) => $options.navigateToFeedback && $options.navigateToFeedback(...args)),
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                  },
                  [
                    vue.createVNode(_component_uni_icons, {
                      type: "chatbubble",
                      size: "40",
                      color: $data.isDarkMode ? "#52c41a" : "#4cd964"
                    }, null, 8, ["color"]),
                    vue.createElementVNode(
                      "text",
                      {
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                      },
                      "投诉反馈",
                      4
                      /* STYLE */
                    )
                  ],
                  4
                  /* STYLE */
                )
              ],
              4
              /* STYLE */
            )
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "menu-list",
            style: vue.normalizeStyle({ backgroundColor: $data.isDarkMode ? "#2c2c2c" : "#fff", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)" })
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: "menu-item",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.navigateToAccount && $options.navigateToAccount(...args)),
                style: vue.normalizeStyle({ borderBottom: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9", backgroundColor: $data.isDarkMode ? "transparent" : "transparent" })
              },
              [
                vue.createVNode(_component_uni_icons, {
                  type: "person",
                  size: "30",
                  color: $data.isDarkMode ? "#999" : "#666"
                }, null, 8, ["color"]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "menu-text",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  "我的账号",
                  4
                  /* STYLE */
                ),
                vue.createVNode(_component_uni_icons, {
                  type: "right",
                  size: "20",
                  color: $data.isDarkMode ? "#666" : "#999"
                }, null, 8, ["color"])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "menu-item",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.navigateToDevice && $options.navigateToDevice(...args)),
                style: vue.normalizeStyle({ borderBottom: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9", backgroundColor: $data.isDarkMode ? "transparent" : "transparent" })
              },
              [
                vue.createVNode(_component_uni_icons, {
                  type: "phone",
                  size: "30",
                  color: $data.isDarkMode ? "#999" : "#666"
                }, null, 8, ["color"]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "menu-text",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  "登录设备管理",
                  4
                  /* STYLE */
                ),
                vue.createVNode(_component_uni_icons, {
                  type: "right",
                  size: "20",
                  color: $data.isDarkMode ? "#666" : "#999"
                }, null, 8, ["color"])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "menu-item",
                onClick: _cache[6] || (_cache[6] = (...args) => $options.navigateToDisplay && $options.navigateToDisplay(...args)),
                style: vue.normalizeStyle({ borderBottom: $data.isDarkMode ? "1px solid #404040" : "1px solid #F2F5F9", backgroundColor: $data.isDarkMode ? "transparent" : "transparent" })
              },
              [
                vue.createVNode(_component_uni_icons, {
                  type: "settings",
                  size: "30",
                  color: $data.isDarkMode ? "#999" : "#666"
                }, null, 8, ["color"]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "menu-text",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  "显示设置",
                  4
                  /* STYLE */
                ),
                vue.createVNode(_component_uni_icons, {
                  type: "right",
                  size: "20",
                  color: $data.isDarkMode ? "#666" : "#999"
                }, null, 8, ["color"])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "menu-item",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.navigateToThemeDemo && $options.navigateToThemeDemo(...args)),
                style: vue.normalizeStyle({ backgroundColor: $data.isDarkMode ? "transparent" : "transparent" })
              },
              [
                vue.createVNode(_component_uni_icons, {
                  type: "color",
                  size: "30",
                  color: $data.isDarkMode ? "#999" : "#666"
                }, null, 8, ["color"]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "menu-text",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  "竞争力分析",
                  4
                  /* STYLE */
                ),
                vue.createVNode(_component_uni_icons, {
                  type: "right",
                  size: "20",
                  color: $data.isDarkMode ? "#666" : "#999"
                }, null, 8, ["color"])
              ],
              4
              /* STYLE */
            )
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "logout-btn",
            onClick: _cache[8] || (_cache[8] = (...args) => $options.logout && $options.logout(...args)),
            style: vue.normalizeStyle({ backgroundColor: $data.isDarkMode ? "#2c2c2c" : "#fff", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)" })
          },
          [
            vue.createElementVNode("text", { style: { color: "#ff3b30" } }, "退出登录")
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserUser = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/user.vue"]]);
  const resumeApi = {
    // 基本信息
    saveBasic(data) {
      return requestWithRetry({
        url: "/api/resume/basic",
        method: "POST",
        data
      });
    },
    getBasic() {
      return requestWithRetry({
        url: "/api/resume/basic",
        method: "GET"
      });
    },
    // 求职意向
    saveIntention(data) {
      return requestWithRetry({
        url: "/api/resume/job-intention",
        method: "POST",
        data
      });
    },
    getIntention() {
      return requestWithRetry({
        url: "/api/resume/job-intention",
        method: "GET"
      });
    },
    // 求职偏好
    savePreference(data) {
      return requestWithRetry({
        url: "/api/resume/job-preference",
        method: "POST",
        data
      });
    },
    getPreference() {
      return requestWithRetry({
        url: "/api/resume/job-preference",
        method: "GET"
      });
    },
    // 校园经历
    saveCampus(data) {
      return requestWithRetry({
        url: "/api/resume/campus-experience",
        method: "POST",
        data
      });
    },
    getCampus() {
      return requestWithRetry({
        url: "/api/resume/campus-experience",
        method: "GET"
      });
    },
    // 校园经历
    saveCertificates(data) {
      return requestWithRetry({
        url: "/api/resume/certificates",
        method: "POST",
        data
      });
    },
    getCertificates() {
      return requestWithRetry({
        url: "/api/resume/certificates",
        method: "GET"
      });
    }
  };
  const _sfc_main$k = {
    data() {
      return {
        genderOptions: ["男", "女"],
        genderIndex: 0,
        companySizeOptions: ["不限", "小型", "中型", "大型"],
        companySizeIndex: 0,
        workTypeOptions: ["全职", "兼职", "实习"],
        workTypeIndex: 0,
        certTypeOptions: ["技能类", "资格类", "语言类", "其他"],
        // 主题相关
        currentTheme: "light",
        isDarkMode: false,
        resume: {
          real_name: "",
          gender: "",
          birth_date: "",
          phone: "",
          email: "",
          wechat: "",
          city: "",
          education_level: "",
          school_name: "",
          major: "",
          graduation_year: "",
          gpa: "",
          self_introduction: "",
          intention: {
            industry: "",
            position: "",
            city: "",
            salary_min: "",
            salary_max: "",
            available_time: ""
          },
          preference: {
            internship_conversion: false,
            remote_work: false,
            campus_recommendation: false,
            overtime: false,
            business_trip: false
          },
          campus_experience: {
            student_union: false,
            student_union_desc: "",
            // 学生会详细描述
            club: false,
            club_desc: "",
            // 社团详细描述
            scholarship: false,
            scholarship_desc: "",
            // 奖学金详细描述
            honor: false,
            honor_desc: ""
            // 荣誉详细描述         
          },
          certificates: []
        }
      };
    },
    async onLoad() {
      await this.loadResume();
      this.initTheme();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      goBack() {
        uni.navigateBack();
      },
      /* =============================
         加载完整简历
      ============================= */
      async loadResume() {
        try {
          const basic = await resumeApi.getBasic();
          formatAppLog("log", "at pages/user/resume/user_resume.vue:435", "basic", basic);
          const intention = await resumeApi.getIntention();
          formatAppLog("log", "at pages/user/resume/user_resume.vue:437", "intention", intention);
          const preference = await resumeApi.getPreference();
          formatAppLog("log", "at pages/user/resume/user_resume.vue:439", "preference", preference);
          const campus = await resumeApi.getCampus();
          formatAppLog("log", "at pages/user/resume/user_resume.vue:441", "campus", campus);
          const certificates = await resumeApi.getCertificates();
          formatAppLog("log", "at pages/user/resume/user_resume.vue:443", "certificates", certificates);
          this.companySizeIndex = preference.company_size_preference ?? 0;
          formatAppLog("log", "at pages/user/resume/user_resume.vue:446", "暂无简历", this.resume.intention.city_priority);
          this.workTypeIndex = preference.work_type_preference ?? 0;
          Object.assign(this.resume, {
            real_name: basic.real_name,
            gender: basic.gender,
            birth_date: basic.birth_date,
            phone: basic.mobile,
            email: basic.email,
            wechat: basic.wechat,
            city: basic.city,
            education_level: basic.education_level,
            school_name: basic.school_name,
            major: basic.major,
            graduation_year: basic.graduation_year,
            gpa: basic.gpa,
            self_introduction: basic.self_introduction
          });
          this.resume.intention = {
            industry: intention.target_industries,
            position: intention.target_positions,
            city: intention.city_priority,
            salary_min: intention.salary_min,
            salary_max: intention.salary_max,
            available_time: intention.availability
          }, Object.assign(this.resume.preference = {
            internship_conversion: preference.accept_intern_to_full === 1,
            remote_work: preference.accept_remote_city === 1,
            campus_recommendation: preference.need_campus_referral === 1,
            overtime: preference.accept_overtime === 1,
            business_trip: preference.accept_business_trip === 1
          });
          Object.assign(this.resume.campus_experience, {
            student_union: campus.has_student_union === 1,
            student_union_desc: campus.student_union_details || "",
            club: campus.has_club === 1,
            club_desc: campus.club_details || "",
            scholarship: campus.has_scholarship === 1,
            scholarship_desc: campus.scholarship_details || "",
            honor: campus.has_honor === 1,
            honor_desc: campus.honor_details || ""
          });
          this.resume.certificates = certificates || [];
          this.genderIndex = this.resume.gender === 2 ? 1 : 0;
        } catch (err) {
          formatAppLog("log", "at pages/user/resume/user_resume.vue:493", "暂无简历");
        }
      },
      /* =============================
         保存简历
      ============================= */
      async saveResume() {
        try {
          await resumeApi.saveBasic({
            real_name: this.resume.real_name,
            gender: this.resume.gender,
            // 1=男 2=女
            birth_date: this.resume.birth_date,
            phone: this.resume.phone,
            // 修正
            email: this.resume.email,
            wechat: this.resume.wechat,
            // 加回
            city: this.resume.city,
            education_level: this.resume.education_level,
            school_name: this.resume.school_name,
            major: this.resume.major,
            graduation_year: this.resume.graduation_year,
            gpa: this.resume.gpa,
            self_introduction: this.resume.self_introduction
          });
          await resumeApi.saveIntention({
            target_industries: this.resume.intention.industry,
            target_positions: this.resume.intention.position,
            city_priority: this.resume.intention.city,
            // 对应 city_priority
            salary_min: this.resume.intention.salary_min,
            salary_max: this.resume.intention.salary_max,
            availability: this.resume.intention.available_time
          });
          await resumeApi.savePreference({
            accept_intern_to_full: this.resume.preference.internship_conversion ? 1 : 0,
            accept_remote_city: this.resume.preference.remote_work ? 1 : 0,
            need_campus_referral: this.resume.preference.campus_recommendation ? 1 : 0,
            accept_overtime: this.resume.preference.overtime ? 1 : 0,
            accept_business_trip: this.resume.preference.business_trip ? 1 : 0,
            company_size_preference: this.companySizeIndex,
            work_type_preference: this.workTypeIndex
          });
          await resumeApi.saveCampus({
            has_student_union: this.resume.campus_experience.student_union ? 1 : 0,
            student_union_details: this.resume.campus_experience.student_union_desc,
            has_club: this.resume.campus_experience.club ? 1 : 0,
            club_details: this.resume.campus_experience.club_desc,
            has_scholarship: this.resume.campus_experience.scholarship ? 1 : 0,
            scholarship_details: this.resume.campus_experience.scholarship_desc,
            has_honor: this.resume.campus_experience.honor ? 1 : 0,
            honor_details: this.resume.campus_experience.honor_desc
          });
          for (const cert of this.resume.certificates) {
            if (!cert.id) {
              await resumeApi.saveCertificates({
                cert_name: cert.cert_name,
                cert_type: cert.cert_type,
                issue_date: cert.issue_date,
                expiry_date: cert.expiry_date,
                certificate_no: cert.certificate_no,
                cert_level: cert.cert_level,
                issuing_authority: cert.issuing_authority,
                attachment_url: cert.attachment_url
              });
            }
          }
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
        } catch (err) {
          uni.showToast({
            title: err.message || "保存失败",
            icon: "none"
          });
        }
      },
      /* =============================
         选择器事件处理
      ============================= */
      onGenderChange(e) {
        this.genderIndex = e.detail.value;
        this.resume.gender = this.genderIndex === 1 ? 2 : 1;
      },
      onCompanySizeChange(e) {
        this.companySizeIndex = e.detail.value;
      },
      onWorkTypeChange(e) {
        this.workTypeIndex = e.detail.value;
      },
      /* =============================
         证书操作
      ============================= */
      addCertificate() {
        this.resume.certificates.push({
          cert_name: "",
          cert_type: 0,
          cert_level: "",
          issue_date: "",
          expiry_date: "",
          issuing_authority: "",
          certificate_no: "",
          attachment_url: ""
        });
      },
      deleteCertificate(index) {
        const cert = this.resume.certificates[index];
        if (!cert.id) {
          this.resume.certificates.splice(index, 1);
          return;
        }
        uni.showModal({
          title: "删除证书",
          content: "确定删除此证书吗？",
          success: async (res) => {
            if (res.confirm) {
              try {
                await resumeApi.deleteCertificate(cert.id);
                this.resume.certificates.splice(index, 1);
                uni.showToast({ title: "删除成功", icon: "success" });
              } catch (err) {
                uni.showToast({ title: "删除失败", icon: "none" });
              }
            }
          }
        });
      },
      getCertTypeIndex(type) {
        return this.certTypeOptions.indexOf(type);
      },
      onCertTypeChange(e, index) {
        const val = e.detail.value;
        this.resume.certificates[index].cert_type = this.certTypeOptions[val];
      },
      onCertDateChange(e, index, field) {
        this.resume.certificates[index][field] = e.detail.value;
      },
      getFileName(url) {
        if (!url)
          return "";
        const parts = url.split("/");
        return parts[parts.length - 1];
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "resume-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-back-icon",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "←",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "我的简历",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" }, [
              vue.createElementVNode("text", {
                class: "save-btn",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.saveResume && $options.saveResume(...args)),
                style: { color: "#007aff" }
              }, "保存")
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("scroll-view", {
          "scroll-y": "",
          class: "resume-content"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "section",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode("text", { class: "section-title" }, "基本信息"),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "姓名"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.resume.real_name = $event),
                    placeholder: "请输入姓名"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.real_name]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "性别"),
                vue.createElementVNode("picker", {
                  class: "input",
                  onChange: _cache[3] || (_cache[3] = (...args) => $options.onGenderChange && $options.onGenderChange(...args)),
                  value: $data.genderIndex,
                  range: $data.genderOptions
                }, [
                  vue.createElementVNode(
                    "view",
                    null,
                    vue.toDisplayString($data.genderOptions[$data.genderIndex]),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "出生日期"),
                vue.createElementVNode("picker", {
                  class: "input",
                  mode: "date",
                  onChange: _cache[4] || (_cache[4] = (e) => $data.resume.birth_date = e.detail.value),
                  value: $data.resume.birth_date
                }, [
                  vue.createElementVNode(
                    "view",
                    null,
                    vue.toDisplayString($data.resume.birth_date || "请选择出生日期"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value"])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "电话"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.resume.phone = $event),
                    placeholder: "请输入手机号",
                    type: "number"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.phone]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "邮箱"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.resume.email = $event),
                    placeholder: "请输入邮箱",
                    type: "email"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.email]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "微信"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.resume.wechat = $event),
                    placeholder: "请输入微信号"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.wechat]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "城市"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.resume.city = $event),
                    placeholder: "请输入所在城市"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.city]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "教育水平"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.resume.education_level = $event),
                    placeholder: "请输入教育水平"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.education_level]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "学校"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.resume.school_name = $event),
                    placeholder: "请输入学校名称"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.school_name]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "专业"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.resume.major = $event),
                    placeholder: "请输入专业"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.major]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "毕业年份"),
                vue.createElementVNode("picker", {
                  class: "input",
                  mode: "date",
                  fields: "year",
                  onChange: _cache[12] || (_cache[12] = (e) => $data.resume.graduation_year = e.detail.value.substring(0, 4)),
                  value: $data.resume.graduation_year
                }, [
                  vue.createElementVNode(
                    "view",
                    null,
                    vue.toDisplayString($data.resume.graduation_year || "请选择毕业年份"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value"])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "GPA"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.resume.gpa = $event),
                    placeholder: "请输入GPA",
                    type: "number",
                    step: "0.01"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.gpa]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "自我介绍"),
                vue.withDirectives(vue.createElementVNode(
                  "textarea",
                  {
                    class: "textarea",
                    "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.resume.self_introduction = $event),
                    placeholder: "请输入自我介绍"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.self_introduction]
                ])
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "section",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "section-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "求职意向",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "期望行业"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.resume.intention.industry = $event),
                    placeholder: "请输入期望行业"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.intention.industry]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "期望职位"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.resume.intention.position = $event),
                    placeholder: "请输入期望职位"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.intention.position]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "期望城市"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.resume.intention.city = $event),
                    placeholder: "请输入期望城市"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.intention.city]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "薪资范围"),
                vue.createElementVNode("view", { class: "salary-box" }, [
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "salary-input",
                      type: "number",
                      "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.resume.intention.salary_min = $event),
                      placeholder: "最低薪资"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.resume.intention.salary_min]
                  ]),
                  vue.createElementVNode("text", { class: "wave" }, "~"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      class: "salary-input",
                      type: "number",
                      "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.resume.intention.salary_max = $event),
                      placeholder: "最高薪资"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.resume.intention.salary_max]
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "到岗时间"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "input",
                    "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => $data.resume.intention.available_time = $event),
                    placeholder: "请输入到岗时间"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.resume.intention.available_time]
                ])
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "section",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "section-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "求职偏好",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "preference-group" }, [
                vue.createElementVNode("view", {
                  class: "preference-item",
                  onClick: _cache[22] || (_cache[22] = ($event) => _ctx.togglePreference("internship_conversion"))
                }, [
                  vue.createElementVNode("text", { class: "preference-label" }, "接受实习转正"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.preference.internship_conversion,
                    onChange: _cache[21] || (_cache[21] = (e) => $data.resume.preference.internship_conversion = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ]),
                vue.createElementVNode("view", {
                  class: "preference-item",
                  onClick: _cache[24] || (_cache[24] = ($event) => _ctx.togglePreference("remote_work"))
                }, [
                  vue.createElementVNode("text", { class: "preference-label" }, "接受远程工作"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.preference.remote_work,
                    onChange: _cache[23] || (_cache[23] = (e) => $data.resume.preference.remote_work = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ]),
                vue.createElementVNode("view", {
                  class: "preference-item",
                  onClick: _cache[26] || (_cache[26] = ($event) => _ctx.togglePreference("campus_recommendation"))
                }, [
                  vue.createElementVNode("text", { class: "preference-label" }, "需要校园推荐"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.preference.campus_recommendation,
                    onChange: _cache[25] || (_cache[25] = (e) => $data.resume.preference.campus_recommendation = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ]),
                vue.createElementVNode("view", {
                  class: "preference-item",
                  onClick: _cache[28] || (_cache[28] = ($event) => _ctx.togglePreference("overtime"))
                }, [
                  vue.createElementVNode("text", { class: "preference-label" }, "接受加班"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.preference.overtime,
                    onChange: _cache[27] || (_cache[27] = (e) => $data.resume.preference.overtime = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ]),
                vue.createElementVNode("view", {
                  class: "preference-item",
                  onClick: _cache[30] || (_cache[30] = ($event) => _ctx.togglePreference("business_trip"))
                }, [
                  vue.createElementVNode("text", { class: "preference-label" }, "接受出差"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.preference.business_trip,
                    onChange: _cache[29] || (_cache[29] = (e) => $data.resume.preference.business_trip = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "公司规模偏好"),
                vue.createElementVNode("picker", {
                  class: "input",
                  onChange: _cache[31] || (_cache[31] = (...args) => $options.onCompanySizeChange && $options.onCompanySizeChange(...args)),
                  value: $data.companySizeIndex,
                  range: $data.companySizeOptions
                }, [
                  vue.createElementVNode(
                    "view",
                    null,
                    vue.toDisplayString($data.companySizeOptions[$data.companySizeIndex]),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ]),
              vue.createElementVNode("view", { class: "form-item" }, [
                vue.createElementVNode("text", { class: "label" }, "工作类型偏好"),
                vue.createElementVNode("picker", {
                  class: "input",
                  onChange: _cache[32] || (_cache[32] = (...args) => $options.onWorkTypeChange && $options.onWorkTypeChange(...args)),
                  value: $data.workTypeIndex,
                  range: $data.workTypeOptions
                }, [
                  vue.createElementVNode(
                    "view",
                    null,
                    vue.toDisplayString($data.workTypeOptions[$data.workTypeIndex]),
                    1
                    /* TEXT */
                  )
                ], 40, ["value", "range"])
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "section",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "section-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "校园经历",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "campus-group" }, [
                vue.createElementVNode("view", {
                  class: "campus-item",
                  onClick: _cache[34] || (_cache[34] = ($event) => _ctx.toggleCampusExperience("student_union"))
                }, [
                  vue.createElementVNode("text", { class: "campus-label" }, "学生会经历"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.campus_experience.student_union,
                    onChange: _cache[33] || (_cache[33] = (e) => $data.resume.campus_experience.student_union = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ]),
                $data.resume.campus_experience.student_union ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "campus-desc-box"
                }, [
                  vue.withDirectives(vue.createElementVNode(
                    "textarea",
                    {
                      class: "campus-textarea",
                      "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => $data.resume.campus_experience.student_union_desc = $event),
                      placeholder: "请描述学生会经历（职务、工作内容、成果等）"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.resume.campus_experience.student_union_desc]
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "campus-group" }, [
                vue.createElementVNode("view", {
                  class: "campus-item",
                  onClick: _cache[37] || (_cache[37] = ($event) => _ctx.toggleCampusExperience("club"))
                }, [
                  vue.createElementVNode("text", { class: "campus-label" }, "社团经历"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.campus_experience.club,
                    onChange: _cache[36] || (_cache[36] = (e) => $data.resume.campus_experience.club = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ]),
                $data.resume.campus_experience.club ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "campus-desc-box"
                }, [
                  vue.withDirectives(vue.createElementVNode(
                    "textarea",
                    {
                      class: "campus-textarea",
                      "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => $data.resume.campus_experience.club_desc = $event),
                      placeholder: "请描述社团经历（社团名称、职务、活动等）"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.resume.campus_experience.club_desc]
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "campus-group" }, [
                vue.createElementVNode("view", {
                  class: "campus-item",
                  onClick: _cache[40] || (_cache[40] = ($event) => _ctx.toggleCampusExperience("scholarship"))
                }, [
                  vue.createElementVNode("text", { class: "campus-label" }, "奖学金"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.campus_experience.scholarship,
                    onChange: _cache[39] || (_cache[39] = (e) => $data.resume.campus_experience.scholarship = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ]),
                $data.resume.campus_experience.scholarship ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "campus-desc-box"
                }, [
                  vue.withDirectives(vue.createElementVNode(
                    "textarea",
                    {
                      class: "campus-textarea",
                      "onUpdate:modelValue": _cache[41] || (_cache[41] = ($event) => $data.resume.campus_experience.scholarship_desc = $event),
                      placeholder: "请描述奖学金情况（奖项名称、等级、时间等）"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.resume.campus_experience.scholarship_desc]
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("view", { class: "campus-group" }, [
                vue.createElementVNode("view", {
                  class: "campus-item",
                  onClick: _cache[43] || (_cache[43] = ($event) => _ctx.toggleCampusExperience("honor"))
                }, [
                  vue.createElementVNode("text", { class: "campus-label" }, "荣誉"),
                  vue.createElementVNode("switch", {
                    checked: $data.resume.campus_experience.honor,
                    onChange: _cache[42] || (_cache[42] = (e) => $data.resume.campus_experience.honor = e.detail.value),
                    color: "#007aff",
                    style: { "transform": "scale(0.8)" }
                  }, null, 40, ["checked"])
                ]),
                $data.resume.campus_experience.honor ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "campus-desc-box"
                }, [
                  vue.withDirectives(vue.createElementVNode(
                    "textarea",
                    {
                      class: "campus-textarea",
                      "onUpdate:modelValue": _cache[44] || (_cache[44] = ($event) => $data.resume.campus_experience.honor_desc = $event),
                      placeholder: "请描述获得荣誉（奖项名称、颁发机构、时间等）"
                    },
                    null,
                    512
                    /* NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.resume.campus_experience.honor_desc]
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "section",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode("view", { class: "section-header" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: "section-title",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  "证书管理",
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("text", {
                  class: "add-btn",
                  onClick: _cache[45] || (_cache[45] = (...args) => $options.addCertificate && $options.addCertificate(...args)),
                  style: { color: "#007aff" }
                }, "+ 添加证书")
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.resume.certificates, (certificate, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "certificate-item"
                  }, [
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode("text", { class: "label" }, "证书类型"),
                      vue.createElementVNode("picker", {
                        class: "input",
                        onChange: (e) => $options.onCertTypeChange(e, index),
                        value: $options.getCertTypeIndex(certificate.cert_type),
                        range: $data.certTypeOptions
                      }, [
                        vue.createElementVNode(
                          "view",
                          null,
                          vue.toDisplayString($data.certTypeOptions[$options.getCertTypeIndex(certificate.cert_type)] || "请选择证书类型"),
                          1
                          /* TEXT */
                        )
                      ], 40, ["onChange", "value", "range"])
                    ]),
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode("text", { class: "label" }, "证书名称"),
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "input",
                        "onUpdate:modelValue": ($event) => certificate.cert_name = $event,
                        placeholder: "请输入证书名称"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vue.vModelText, certificate.cert_name]
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode("text", { class: "label" }, "等级/分数"),
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "input",
                        "onUpdate:modelValue": ($event) => certificate.cert_level = $event,
                        placeholder: "请输入证书级别或分数"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vue.vModelText, certificate.cert_level]
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode("text", { class: "label" }, "颁发日期"),
                      vue.createElementVNode("picker", {
                        class: "input",
                        mode: "date",
                        onChange: (e) => $options.onCertDateChange(e, index, "issue_date"),
                        value: certificate.issue_date
                      }, [
                        vue.createElementVNode(
                          "view",
                          null,
                          vue.toDisplayString(certificate.issue_date || "请选择颁发日期"),
                          1
                          /* TEXT */
                        )
                      ], 40, ["onChange", "value"])
                    ]),
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode("text", { class: "label" }, "有效期"),
                      vue.createElementVNode("picker", {
                        class: "input",
                        mode: "date",
                        onChange: (e) => $options.onCertDateChange(e, index, "expiry_date"),
                        value: certificate.expiry_date
                      }, [
                        vue.createElementVNode(
                          "view",
                          null,
                          vue.toDisplayString(certificate.expiry_date || "请选择有效期（可选）"),
                          1
                          /* TEXT */
                        )
                      ], 40, ["onChange", "value"])
                    ]),
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode("text", { class: "label" }, "发证机构"),
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "input",
                        "onUpdate:modelValue": ($event) => certificate.issuing_authority = $event,
                        placeholder: "请输入发证机构"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vue.vModelText, certificate.issuing_authority]
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode("text", { class: "label" }, "证书编号"),
                      vue.withDirectives(vue.createElementVNode("input", {
                        class: "input",
                        "onUpdate:modelValue": ($event) => certificate.certificate_no = $event,
                        placeholder: "请输入证书编号"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vue.vModelText, certificate.certificate_no]
                      ])
                    ])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            4
            /* STYLE */
          )
        ])
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserResumeUserResume = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/resume/user_resume.vue"]]);
  const _sfc_main$j = {
    data() {
      return {
        collections: [],
        // 主题相关
        currentTheme: "light",
        isDarkMode: false
      };
    },
    onLoad() {
      this.loadFavorites();
      this.initTheme();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      goBack() {
        uni.navigateBack({
          delta: 1,
          fail: () => {
            uni.switchTab({
              url: "/pages/user/user"
            });
          }
        });
      },
      loadFavorites() {
        let collections = uni.getStorageSync("collections") || [];
        const uniqueCollections = [];
        const seenIds = /* @__PURE__ */ new Set();
        for (const item of collections) {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueCollections.push(item);
          }
        }
        this.collections = uniqueCollections;
        uni.setStorageSync("collections", uniqueCollections);
      },
      viewDetails(item) {
        if (!item.id) {
          uni.showToast({
            title: "职位ID不存在",
            icon: "none"
          });
          return;
        }
        uni.navigateTo({
          url: `/pages/job/detail/job_detail_index?id=${item.id}`
        });
      },
      cancelCollection(index) {
        uni.showModal({
          title: "提示",
          content: "确定取消收藏吗？",
          success: (res) => {
            if (res.confirm) {
              let collections = uni.getStorageSync("collections") || [];
              collections.splice(index, 1);
              uni.setStorageSync("collections", collections);
              this.collections = collections;
              uni.showToast({
                title: "已取消收藏",
                icon: "success"
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "collection-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-back-icon",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "←",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "收藏职位",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("view", { class: "collection-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.collections, (item, index) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: index,
                  class: "collection-item",
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                },
                [
                  vue.createElementVNode("view", { class: "job-info" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "job-title",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                      },
                      vue.toDisplayString(item.jobTitle),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "company",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                      },
                      vue.toDisplayString(item.company),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "salary" },
                      vue.toDisplayString(item.salary),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "collection-time",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#ADB5BD" })
                      },
                      vue.toDisplayString(item.collectionTime),
                      5
                      /* TEXT, STYLE */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "actions" }, [
                    vue.createElementVNode("button", {
                      class: "cancel-btn",
                      onClick: ($event) => $options.cancelCollection(index),
                      style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#F2F5F9", color: $data.isDarkMode ? "#999" : "#6C757D" })
                    }, "取消收藏", 12, ["onClick"]),
                    vue.createElementVNode("button", {
                      class: "detail-btn",
                      onClick: ($event) => $options.viewDetails(item)
                    }, "查看详情", 8, ["onClick"])
                  ])
                ],
                4
                /* STYLE */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $data.collections.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "star",
              size: "80",
              color: $data.isDarkMode ? "#404040" : "#ccc"
            }, null, 8, ["color"]),
            vue.createElementVNode(
              "text",
              {
                style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#ADB5BD" })
              },
              "暂无收藏职位",
              4
              /* STYLE */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserCollectionUserCollection = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/collection/user_collection.vue"]]);
  const _sfc_main$i = {
    data() {
      return {
        delivers: [],
        // 主题相关
        currentTheme: "light",
        isDarkMode: false
      };
    },
    onLoad() {
      this.loadDelivers();
      this.initTheme();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      goBack() {
        uni.navigateBack();
      },
      loadDelivers() {
        const delivers = uni.getStorageSync("delivers") || [];
        this.delivers = delivers;
      },
      cancelDeliver(index) {
        uni.showModal({
          title: "提示",
          content: "确定取消投递该职位吗？",
          success: (res) => {
            if (res.confirm) {
              let delivers = uni.getStorageSync("delivers") || [];
              delivers.splice(index, 1);
              uni.setStorageSync("delivers", delivers);
              this.delivers = delivers;
              uni.showToast({
                title: "已取消投递",
                icon: "success"
              });
            }
          }
        });
      },
      viewDetails(item) {
        if (!item.id) {
          uni.showToast({
            title: "职位ID不存在",
            icon: "none"
          });
          return;
        }
        uni.navigateTo({
          url: `/pages/job/detail/job_detail_index?id=${item.id}`
        });
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "deliver-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-back-icon",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "←",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "投递职位",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("view", { class: "deliver-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.delivers, (item, index) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: index,
                  class: "deliver-item",
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                },
                [
                  vue.createElementVNode("view", { class: "job-info" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "job-title",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                      },
                      vue.toDisplayString(item.jobTitle),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "company",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                      },
                      vue.toDisplayString(item.company),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "salary" },
                      vue.toDisplayString(item.salary),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "deliver-time",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#ADB5BD" })
                      },
                      vue.toDisplayString(item.deliverTime),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode("view", { class: "status" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["status-text", item.status])
                        },
                        vue.toDisplayString(item.statusText),
                        3
                        /* TEXT, CLASS */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "actions" }, [
                    vue.createElementVNode("button", {
                      class: "cancel-btn",
                      onClick: ($event) => $options.cancelDeliver(index),
                      style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#F2F5F9", color: $data.isDarkMode ? "#999" : "#6C757D" })
                    }, "取消投递", 12, ["onClick"]),
                    vue.createElementVNode("button", {
                      class: "detail-btn",
                      onClick: ($event) => $options.viewDetails(item)
                    }, "查看详情", 8, ["onClick"])
                  ])
                ],
                4
                /* STYLE */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $data.delivers.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "paperplane",
              size: "80",
              color: $data.isDarkMode ? "#404040" : "#ccc"
            }, null, 8, ["color"]),
            vue.createElementVNode(
              "text",
              {
                style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#ADB5BD" })
              },
              "暂无投递记录",
              4
              /* STYLE */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserDeliverUserDeliver = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/deliver/user_deliver.vue"]]);
  const getComplaintTypes = () => {
    return requestWithRetry({
      url: "/api/complaint/types",
      method: "GET"
    });
  };
  const getFeedbackList = (params) => {
    return requestWithRetry({
      url: "/api/feedback/list",
      method: "GET",
      data: params
    });
  };
  const submitFeedback = (data) => {
    return requestWithRetry({
      url: "/api/feedback/submit",
      method: "POST",
      data
    });
  };
  const _sfc_main$h = {
    data() {
      return {
        feedbacks: [],
        typeOptions: [],
        typeCodeMap: {},
        // 保存 type_name -> type_code 映射
        typeIndex: 0,
        newFeedback: {
          complaint_type: null,
          description: ""
        },
        page: 1,
        limit: 20,
        // 主题相关
        currentTheme: "light",
        isDarkMode: false
      };
    },
    async onLoad() {
      await this.loadComplaintTypes();
      await this.loadFeedbackList();
      this.initTheme();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      goBack() {
        uni.navigateBack();
      },
      // ================= 加载投诉类型 =================
      async loadComplaintTypes() {
        try {
          const res = await getComplaintTypes();
          formatAppLog("log", "at pages/user/feedback/user_feedback.vue:132", "转换后的collections:");
          const types = res || [];
          this.typeOptions = types.map((t) => t.type_name);
          types.forEach((t) => {
            this.typeCodeMap[t.type_name] = t.type_code;
          });
          formatAppLog("log", "at pages/user/feedback/user_feedback.vue:141", "转换后的collections:", this.typeOptions);
          if (types.length > 0) {
            this.newFeedback.complaint_type = types[0].type_code;
          }
        } catch (err) {
          uni.showToast({
            title: "获取投诉类型失败",
            icon: "none"
          });
        }
      },
      // ================= 加载反馈列表 =================
      async loadFeedbackList() {
        try {
          const res = await getFeedbackList({
            page: this.page,
            limit: this.limit
          });
          formatAppLog("log", "at pages/user/feedback/user_feedback.vue:165", "转换后的collections:", res);
          const list = res || [];
          formatAppLog("log", "at pages/user/feedback/user_feedback.vue:167", "转换后的collections:", list);
          this.feedbacks = list.map((item) => ({
            id: item.id,
            type: this.typeOptions[item.complaint_type - 1],
            // 后端最好返回 type_name
            submitTime: item.create_time,
            status: item.is_resolved === 1 ? "processed" : "pending",
            statusText: item.is_resolved === 1 ? "已处理" : "待处理",
            description: item.description,
            response: item.feedback_content
          }));
        } catch (err) {
          uni.showToast({
            title: "获取反馈列表失败",
            icon: "none"
          });
        }
      },
      // ================= 打开弹窗 =================
      addFeedback() {
        this.newFeedback.description = "";
        this.$refs.addPopup.open();
      },
      closePopup() {
        if (this.$refs.addPopup) {
          this.$refs.addPopup.close();
        }
      },
      // ================= 类型切换 =================
      onTypeChange(e) {
        this.typeIndex = e.detail.value;
        const typeName = this.typeOptions[this.typeIndex];
        this.newFeedback.complaint_type = this.typeCodeMap[typeName];
      },
      // ================= 提交反馈 =================
      async submitFeedback() {
        if (!this.newFeedback.description.trim()) {
          uni.showToast({
            title: "请输入投诉描述",
            icon: "none"
          });
          return;
        }
        if (this.newFeedback.description.length < 10) {
          uni.showToast({
            title: "描述不能少于10个字",
            icon: "none"
          });
          return;
        }
        try {
          const res = await submitFeedback({
            complaint_type: this.newFeedback.complaint_type,
            description: this.newFeedback.description
          });
          if (res.code === 200) {
            uni.showToast({
              title: "反馈提交成功",
              icon: "success"
            });
            this.closePopup();
            await this.loadFeedbackList();
          }
        } catch (err) {
          uni.showToast({
            title: err.message || "提交失败",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    const _component_uni_popup = vue.resolveComponent("uni-popup");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "feedback-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-back-icon",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "←",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "投诉反馈",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("view", { class: "feedback-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.feedbacks, (item, index) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: index,
                  class: "feedback-item",
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                },
                [
                  vue.createElementVNode("view", { class: "feedback-info" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "feedback-type",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                      },
                      "类型：" + vue.toDisplayString(item.type),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "feedback-time",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#999" })
                      },
                      "提交时间：" + vue.toDisplayString(item.submitTime),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode("view", { class: "status" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: vue.normalizeClass(["status-text", item.status])
                        },
                        vue.toDisplayString(item.statusText),
                        3
                        /* TEXT, CLASS */
                      )
                    ]),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "description",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#666" })
                      },
                      "描述：" + vue.toDisplayString(item.description),
                      5
                      /* TEXT, STYLE */
                    ),
                    item.response ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "response",
                        style: { color: "#007aff" }
                      },
                      "处理反馈：" + vue.toDisplayString(item.response),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true)
                  ])
                ],
                4
                /* STYLE */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $data.feedbacks.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "chatbubble",
              size: "80",
              color: $data.isDarkMode ? "#404040" : "#ccc"
            }, null, 8, ["color"]),
            vue.createElementVNode(
              "text",
              {
                style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#999" })
              },
              "暂无反馈记录",
              4
              /* STYLE */
            )
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createVNode(
          _component_uni_popup,
          {
            ref: "addPopup",
            type: "bottom"
          },
          {
            default: vue.withCtx(() => [
              vue.createElementVNode(
                "view",
                {
                  class: "popup-content",
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "#2c2c2c" : "#fff" })
                },
                [
                  vue.createElementVNode("view", { class: "popup-header" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "popup-title",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                      },
                      "添加投诉反馈",
                      4
                      /* STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "close-btn",
                        onClick: _cache[1] || (_cache[1] = (...args) => $options.closePopup && $options.closePopup(...args)),
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#999" })
                      },
                      "×",
                      4
                      /* STYLE */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "popup-body" }, [
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "label",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                        },
                        "投诉类型",
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode("picker", {
                        class: "input",
                        onChange: _cache[2] || (_cache[2] = (...args) => $options.onTypeChange && $options.onTypeChange(...args)),
                        value: $data.typeIndex,
                        range: $data.typeOptions,
                        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#f5f5f5", borderColor: $data.isDarkMode ? "#404040" : "#eee" })
                      }, [
                        vue.createElementVNode(
                          "view",
                          {
                            style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                          },
                          vue.toDisplayString($data.typeOptions[$data.typeIndex]),
                          5
                          /* TEXT, STYLE */
                        )
                      ], 44, ["value", "range"])
                    ]),
                    vue.createElementVNode("view", { class: "form-item" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "label",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                        },
                        "投诉描述",
                        4
                        /* STYLE */
                      ),
                      vue.withDirectives(vue.createElementVNode(
                        "textarea",
                        {
                          class: "textarea",
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.newFeedback.description = $event),
                          placeholder: "请详细描述您的问题",
                          "placeholder-style": "color: #999",
                          style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#f5f5f5", borderColor: $data.isDarkMode ? "#404040" : "#eee", color: $data.isDarkMode ? "#ffffff" : "#333" })
                        },
                        null,
                        4
                        /* STYLE */
                      ), [
                        [vue.vModelText, $data.newFeedback.description]
                      ])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "popup-footer" }, [
                    vue.createElementVNode(
                      "button",
                      {
                        class: "submit-btn",
                        onClick: _cache[4] || (_cache[4] = (...args) => $options.submitFeedback && $options.submitFeedback(...args)),
                        style: vue.normalizeStyle({ background: "linear-gradient(120deg, #4facfe, #00f2fe)", color: "#ffffff" })
                      },
                      "提交",
                      4
                      /* STYLE */
                    )
                  ])
                ],
                4
                /* STYLE */
              )
            ]),
            _: 1
            /* STABLE */
          },
          512
          /* NEED_PATCH */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserFeedbackUserFeedback = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/feedback/user_feedback.vue"]]);
  const _sfc_main$g = {
    data() {
      return {
        currentPhone: "",
        currentEmail: "",
        // 主题相关
        currentTheme: "light",
        isDarkMode: false
      };
    },
    onLoad() {
      this.getUserInfo();
      this.initTheme();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      async getUserInfo() {
        formatAppLog("log", "at pages/user/account/user_account.vue:97", "======== 开始请求用户信息 ========");
        try {
          const res = await userApi.getUserProfile();
          formatAppLog("log", "at pages/user/account/user_account.vue:102", "请求成功，完整响应:", res);
          formatAppLog("log", "at pages/user/account/user_account.vue:103", "响应数据:", res.data);
          formatAppLog("log", "at pages/user/account/user_account.vue:104", "手机号:", res.mobile);
          formatAppLog("log", "at pages/user/account/user_account.vue:105", "邮箱:", res.email);
          if (res) {
            this.currentPhone = res.mobile ? res.mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "未绑定";
            this.currentEmail = res.email || "未设置";
            formatAppLog("log", "at pages/user/account/user_account.vue:114", "页面显示:", this.currentPhone, this.currentEmail);
          }
        } catch (error) {
          formatAppLog("error", "at pages/user/account/user_account.vue:117", "======== 请求失败 ========");
          formatAppLog("error", "at pages/user/account/user_account.vue:118", "错误信息:", error.message);
          formatAppLog("error", "at pages/user/account/user_account.vue:119", "完整错误:", error);
        }
        formatAppLog("log", "at pages/user/account/user_account.vue:122", "======== 请求结束 ========");
      },
      goBack() {
        uni.navigateBack();
      },
      navigateToNumber() {
        uni.navigateTo({
          url: "/pages/user/account/number/account_number"
        });
      },
      navigateToEmail() {
        uni.navigateTo({
          url: "/pages/user/account/email/account_email"
        });
      },
      navigateToPassword() {
        uni.navigateTo({
          url: "/pages/user/account/code/account_code"
        });
      },
      deleteAccount() {
        uni.showModal({
          title: "注销账号",
          content: "注销账号后，您的所有数据将被永久删除，且无法恢复。确定要注销账号吗？",
          confirmText: "确定注销",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: "账号注销功能开发中",
                icon: "none"
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "account-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-back-icon",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "←",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "我的账号",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "account-list",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: "account-item",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToNumber && $options.navigateToNumber(...args)),
                style: vue.normalizeStyle({ borderBottom: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee" })
              },
              [
                vue.createElementVNode(
                  "text",
                  {
                    class: "item-text",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                  },
                  "修改手机",
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", { class: "item-right" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "current-info",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#999" })
                    },
                    vue.toDisplayString($data.currentPhone),
                    5
                    /* TEXT, STYLE */
                  ),
                  vue.createVNode(_component_uni_icons, {
                    type: "right",
                    size: "20",
                    color: $data.isDarkMode ? "#666" : "#999"
                  }, null, 8, ["color"])
                ])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "account-item",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.navigateToEmail && $options.navigateToEmail(...args)),
                style: vue.normalizeStyle({ borderBottom: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee" })
              },
              [
                vue.createElementVNode(
                  "text",
                  {
                    class: "item-text",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                  },
                  "邮箱设置",
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", { class: "item-right" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "current-info",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#999" })
                    },
                    vue.toDisplayString($data.currentEmail),
                    5
                    /* TEXT, STYLE */
                  ),
                  vue.createVNode(_component_uni_icons, {
                    type: "right",
                    size: "20",
                    color: $data.isDarkMode ? "#666" : "#999"
                  }, null, 8, ["color"])
                ])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "view",
              {
                class: "account-item",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.navigateToPassword && $options.navigateToPassword(...args)),
                style: vue.normalizeStyle({ borderBottom: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee" })
              },
              [
                vue.createElementVNode(
                  "text",
                  {
                    class: "item-text",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                  },
                  "密码设置",
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", { class: "item-right" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "current-info",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#999" })
                    },
                    "********",
                    4
                    /* STYLE */
                  ),
                  vue.createVNode(_component_uni_icons, {
                    type: "right",
                    size: "20",
                    color: $data.isDarkMode ? "#666" : "#999"
                  }, null, 8, ["color"])
                ])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode("view", {
              class: "account-item delete-account",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.deleteAccount && $options.deleteAccount(...args))
            }, [
              vue.createElementVNode("text", {
                class: "item-text",
                style: { color: "#ff3b30" }
              }, "注销账号"),
              vue.createVNode(_component_uni_icons, {
                type: "right",
                size: "20",
                color: $data.isDarkMode ? "#666" : "#999"
              }, null, 8, ["color"])
            ])
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserAccountUserAccount = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/account/user_account.vue"]]);
  const _sfc_main$f = {
    data() {
      return {
        devices: [
          {
            name: "Windows PC (Chrome)",
            loginTime: "2024-01-18 14:30",
            isCurrent: true
          },
          {
            name: "iPhone 13 (Safari)",
            loginTime: "2024-01-17 09:15",
            isCurrent: false
          },
          {
            name: "Android Phone (Chrome)",
            loginTime: "2024-01-16 16:45",
            isCurrent: false
          }
        ],
        // 主题相关
        currentTheme: "light",
        isDarkMode: false
      };
    },
    onLoad() {
      this.initTheme();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      goBack() {
        uni.navigateBack();
      },
      deleteDevice(index) {
        uni.showModal({
          title: "提示",
          content: "确定要删除该设备吗？",
          success: (res) => {
            if (res.confirm) {
              this.devices.splice(index, 1);
              uni.showToast({
                title: "设备已删除",
                icon: "success"
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = vue.resolveComponent("uni-icons");
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "device-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-back-icon",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "←",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "设备管理",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "warning",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(66, 33, 0, 0.3)" : "#fff3e0", borderLeftColor: $data.isDarkMode ? "#ff9800" : "#ff9800" })
          },
          [
            vue.createElementVNode(
              "text",
              {
                style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffb74d" : "#f57c00" })
              },
              "以下是最近登录过您的帐号的设备情况，若您发现非本人操作，请及时删除，以保障您的设备安全。",
              4
              /* STYLE */
            )
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "device-list",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.devices, (item, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: index,
                    class: "device-item",
                    style: vue.normalizeStyle({ borderBottom: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee" })
                  },
                  [
                    vue.createElementVNode("view", { class: "device-info" }, [
                      vue.createVNode(_component_uni_icons, {
                        type: "monitor",
                        size: "40",
                        color: "#007aff"
                      }),
                      vue.createElementVNode("view", { class: "device-details" }, [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "device-name",
                            style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                          },
                          vue.toDisplayString(item.name),
                          5
                          /* TEXT, STYLE */
                        ),
                        vue.createElementVNode(
                          "text",
                          {
                            class: "login-time",
                            style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#999" })
                          },
                          vue.toDisplayString(item.loginTime),
                          5
                          /* TEXT, STYLE */
                        ),
                        item.isCurrent ? (vue.openBlock(), vue.createElementBlock(
                          "text",
                          {
                            key: 0,
                            class: "current-device",
                            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(26, 32, 44, 0.8)" : "#e3f2fd", color: "#007aff" })
                          },
                          "当前设备",
                          4
                          /* STYLE */
                        )) : vue.createCommentVNode("v-if", true)
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "actions" }, [
                      !item.isCurrent ? (vue.openBlock(), vue.createElementBlock("button", {
                        key: 0,
                        class: "delete-btn",
                        onClick: ($event) => $options.deleteDevice(index),
                        style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(66, 0, 0, 0.3)" : "#ffebee", color: "#ff3b30", borderColor: $data.isDarkMode ? "#ff3b30" : "#ffcdd2" })
                      }, "删除", 12, ["onClick"])) : vue.createCommentVNode("v-if", true)
                    ])
                  ],
                  4
                  /* STYLE */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserDeviceUserDevice = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/device/user_device.vue"]]);
  const _sfc_main$e = {
    data() {
      return {
        themeMode: "system",
        // 默认跟随系统
        availableThemes: [
          { key: "light", name: "浅色模式", icon: "☀️" },
          { key: "dark", name: "深色模式", icon: "🌙" },
          { key: "system", name: "跟随系统", icon: "⚙️" }
        ],
        currentTheme: "light",
        isDarkMode: false,
        pageBackground: "#f5f5f5",
        pageTextColor: "#333333"
      };
    },
    methods: {
      goBack() {
        uni.navigateBack();
      },
      setTheme(mode) {
        this.themeMode = mode;
        themeManager.setThemeMode(mode);
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        this.updatePageTheme();
        const themeName = this.getThemeText(mode);
        uni.showToast({
          title: `已切换到${themeName}`,
          icon: "success",
          duration: 1500
        });
      },
      getThemeText(mode) {
        const theme = this.availableThemes.find((t) => t.key === mode);
        return theme ? theme.name : "";
      },
      updateTheme(theme) {
        this.currentTheme = theme;
        this.isDarkMode = theme === "dark";
      },
      updatePageTheme() {
        if (this.isDarkMode) {
          this.pageBackground = "#1a1a1a";
          this.pageTextColor = "#ffffff";
        } else {
          this.pageBackground = "#f5f5f5";
          this.pageTextColor = "#333333";
        }
      },
      handleGlobalThemeChange(data) {
        this.updateTheme(data.theme);
        this.updatePageTheme();
      }
    },
    onLoad() {
      this.themeMode = themeManager.getThemeMode();
      this.currentTheme = themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      this.updatePageTheme();
      uni.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "display-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)", color: $data.pageTextColor })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-back-icon",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "←",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "显示设置",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "setting-content",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: "setting-item",
                style: vue.normalizeStyle({ borderBottomColor: $data.isDarkMode ? "#404040" : "#eee" })
              },
              [
                vue.createElementVNode(
                  "text",
                  {
                    class: "setting-title",
                    style: vue.normalizeStyle({ color: $data.pageTextColor })
                  },
                  "主题模式",
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "text",
                  {
                    class: "setting-desc",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#cccccc" : "#999" })
                  },
                  "选择您喜欢的界面主题",
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", { class: "theme-options" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.availableThemes, (theme) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: vue.normalizeClass(["theme-option", { "theme-option-active": $data.themeMode === theme.key }]),
                        onClick: ($event) => $options.setTheme(theme.key),
                        key: theme.key,
                        style: vue.normalizeStyle({
                          backgroundColor: $data.isDarkMode ? "#2c2c2c" : "#fff",
                          borderColor: $data.isDarkMode ? "#404040" : "#e0e0e0"
                        })
                      }, [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "theme-option-icon",
                            style: vue.normalizeStyle({ color: $data.pageTextColor })
                          },
                          vue.toDisplayString(theme.icon),
                          5
                          /* TEXT, STYLE */
                        ),
                        vue.createElementVNode(
                          "text",
                          {
                            class: "theme-option-name",
                            style: vue.normalizeStyle({ color: $data.pageTextColor })
                          },
                          vue.toDisplayString(theme.name),
                          5
                          /* TEXT, STYLE */
                        ),
                        $data.themeMode === theme.key ? (vue.openBlock(), vue.createElementBlock("text", {
                          key: 0,
                          class: "theme-option-check",
                          style: { color: "#007aff" }
                        }, "✓")) : vue.createCommentVNode("v-if", true)
                      ], 14, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: "current-theme-info",
                    style: vue.normalizeStyle({ backgroundColor: $data.isDarkMode ? "#1a1a1a" : "#f0f8ff" })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "current-theme-text",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#0a84ff" : "#007aff" })
                      },
                      "当前主题: " + vue.toDisplayString($options.getThemeText($data.currentTheme)),
                      5
                      /* TEXT, STYLE */
                    ),
                    $data.themeMode === "system" ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "theme-mode-text",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#cccccc" : "#666" })
                      },
                      "（跟随系统）",
                      4
                      /* STYLE */
                    )) : vue.createCommentVNode("v-if", true)
                  ],
                  4
                  /* STYLE */
                ),
                $data.themeMode !== "system" ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "theme-preview"
                }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "preview-title",
                      style: vue.normalizeStyle({ color: $data.pageTextColor })
                    },
                    "预览效果",
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["preview-card", "preview-card-" + $data.themeMode]),
                      style: vue.normalizeStyle({
                        background: $data.isDarkMode ? "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)" : "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                        borderColor: $data.isDarkMode ? "#404040" : "#eeeeee",
                        color: $data.pageTextColor
                      })
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "preview-text",
                          style: vue.normalizeStyle({ color: $data.pageTextColor })
                        },
                        "这是" + vue.toDisplayString($options.getThemeText($data.themeMode)) + "的预览效果",
                        5
                        /* TEXT, STYLE */
                      )
                    ],
                    6
                    /* CLASS, STYLE */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ],
              4
              /* STYLE */
            )
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserDisplayUserDisplay = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/display/user_display.vue"]]);
  const _sfc_main$d = {
    data() {
      return {
        currentPhone: "138****8000",
        verificationCode: "",
        countdown: 0
      };
    },
    methods: {
      goBack() {
        uni.navigateBack();
      },
      sendCode() {
        uni.showToast({
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
          uni.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return;
        }
        if (this.verificationCode === "123456") {
          uni.navigateTo({
            url: "/pages/user/account/number/number_change"
          });
        } else {
          uni.showToast({
            title: "验证码错误",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "verify-phone-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("text", {
          class: "back-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, "←"),
        vue.createElementVNode("text", { class: "title" }, "修改手机")
      ]),
      vue.createElementVNode("view", { class: "verify-content" }, [
        vue.createElementVNode("view", { class: "phone-info" }, [
          vue.createElementVNode("text", null, "当前手机号："),
          vue.createElementVNode(
            "text",
            { class: "current-phone" },
            vue.toDisplayString($data.currentPhone),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "验证码"),
          vue.createElementVNode("view", { class: "code-input" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.verificationCode = $event),
                placeholder: "请输入验证码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.verificationCode]
            ]),
            vue.createElementVNode("button", {
              class: "send-code-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.sendCode && $options.sendCode(...args)),
              disabled: $data.countdown > 0
            }, vue.toDisplayString($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"), 9, ["disabled"])
          ])
        ]),
        vue.createElementVNode("button", {
          class: "next-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.verifyCode && $options.verifyCode(...args))
        }, "下一步")
      ])
    ]);
  }
  const PagesUserAccountNumberAccountNumber = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/account/number/account_number.vue"]]);
  const _sfc_main$c = {
    data() {
      return {
        newPhone: "",
        verificationCode: "",
        countdown: 0
      };
    },
    methods: {
      goBack() {
        uni.navigateBack();
      },
      sendCode() {
        if (!this.newPhone || this.newPhone.length !== 11) {
          uni.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
          return;
        }
        uni.showToast({
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
        if (!this.newPhone || this.newPhone.length !== 11) {
          uni.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
          return;
        }
        if (!this.verificationCode || this.verificationCode.length !== 6) {
          uni.showToast({
            title: "请输入正确的验证码",
            icon: "none"
          });
          return;
        }
        uni.showToast({
          title: "手机号修改成功",
          icon: "success"
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 2
            // 返回两级，回到账号页面
          });
        }, 1500);
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "change-phone-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("text", {
          class: "back-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, "←"),
        vue.createElementVNode("text", { class: "title" }, "修改手机号")
      ]),
      vue.createElementVNode("view", { class: "change-content" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "新手机号"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.newPhone = $event),
              placeholder: "请输入新手机号"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.newPhone]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "验证码"),
          vue.createElementVNode("view", { class: "code-input" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                type: "number",
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.verificationCode = $event),
                placeholder: "请输入验证码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.verificationCode]
            ]),
            vue.createElementVNode("button", {
              class: "send-code-btn",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.sendCode && $options.sendCode(...args)),
              disabled: $data.countdown > 0
            }, vue.toDisplayString($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"), 9, ["disabled"])
          ])
        ]),
        vue.createElementVNode("button", {
          class: "confirm-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.confirmChange && $options.confirmChange(...args))
        }, "确认修改")
      ])
    ]);
  }
  const PagesUserAccountNumberNumberChange = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/account/number/number_change.vue"]]);
  const _sfc_main$b = {
    data() {
      return {
        currentEmail: "zhangsan@example.com",
        verificationCode: "",
        countdown: 0
      };
    },
    methods: {
      goBack() {
        uni.navigateBack();
      },
      sendCode() {
        uni.showToast({
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
          uni.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return;
        }
        if (this.verificationCode === "123456") {
          uni.navigateTo({
            url: "/pages/user/account/email/email_change"
          });
        } else {
          uni.showToast({
            title: "验证码错误",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "verify-email-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("text", {
          class: "back-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, "←"),
        vue.createElementVNode("text", { class: "title" }, "邮箱设置")
      ]),
      vue.createElementVNode("view", { class: "verify-content" }, [
        vue.createElementVNode("view", { class: "email-info" }, [
          vue.createElementVNode("text", null, "当前邮箱："),
          vue.createElementVNode(
            "text",
            { class: "current-email" },
            vue.toDisplayString($data.currentEmail),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "验证码"),
          vue.createElementVNode("view", { class: "code-input" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.verificationCode = $event),
                placeholder: "请输入验证码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.verificationCode]
            ]),
            vue.createElementVNode("button", {
              class: "send-code-btn",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.sendCode && $options.sendCode(...args)),
              disabled: $data.countdown > 0
            }, vue.toDisplayString($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"), 9, ["disabled"])
          ])
        ]),
        vue.createElementVNode("button", {
          class: "next-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.verifyCode && $options.verifyCode(...args))
        }, "下一步")
      ])
    ]);
  }
  const PagesUserAccountEmailAccountEmail = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/account/email/account_email.vue"]]);
  const _sfc_main$a = {
    data() {
      return {
        newEmail: "",
        verificationCode: "",
        countdown: 0
      };
    },
    methods: {
      goBack() {
        uni.navigateBack();
      },
      sendCode() {
        if (!this.newEmail) {
          uni.showToast({
            title: "请输入正确的邮箱地址",
            icon: "none"
          });
          return;
        }
        uni.showToast({
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
          uni.showToast({
            title: "请输入正确的邮箱地址",
            icon: "none"
          });
          return;
        }
        if (!this.verificationCode) {
          uni.showToast({
            title: "请输入正确的验证码",
            icon: "none"
          });
          return;
        }
        uni.showToast({
          title: "邮箱修改成功",
          icon: "success"
        });
        setTimeout(() => {
          uni.navigateBack({
            delta: 2
            // 返回两级，回到账号页面
          });
        }, 1500);
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "change-email-page" }, [
      vue.createElementVNode("view", { class: "nav-bar" }, [
        vue.createElementVNode("text", {
          class: "back-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, "←"),
        vue.createElementVNode("text", { class: "title" }, "修改邮箱")
      ]),
      vue.createElementVNode("view", { class: "change-content" }, [
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "新邮箱"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "email",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.newEmail = $event),
              placeholder: "请输入新邮箱"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.newEmail]
          ])
        ]),
        vue.createElementVNode("view", { class: "form-item" }, [
          vue.createElementVNode("text", { class: "label" }, "验证码"),
          vue.createElementVNode("view", { class: "code-input" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.verificationCode = $event),
                placeholder: "请输入验证码"
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.verificationCode]
            ]),
            vue.createElementVNode("button", {
              class: "send-code-btn",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.sendCode && $options.sendCode(...args)),
              disabled: $data.countdown > 0
            }, vue.toDisplayString($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"), 9, ["disabled"])
          ])
        ]),
        vue.createElementVNode("button", {
          class: "confirm-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.confirmChange && $options.confirmChange(...args))
        }, "确认修改")
      ])
    ]);
  }
  const PagesUserAccountEmailEmailChange = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/account/email/email_change.vue"]]);
  const _sfc_main$9 = {
    data() {
      return {
        currentPhone: "138****8000",
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
        countdown: 0,
        // 主题相关
        currentTheme: "light",
        isDarkMode: false
      };
    },
    onLoad() {
      this.initTheme();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      goBack() {
        uni.navigateBack();
      },
      sendCode() {
        uni.showToast({
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
          uni.showToast({
            title: "请输入验证码",
            icon: "none"
          });
          return;
        }
        if (!this.newPassword) {
          uni.showToast({
            title: "请输入新密码",
            icon: "none"
          });
          return;
        }
        if (this.newPassword.length < 6) {
          uni.showToast({
            title: "密码长度不能少于6位",
            icon: "none"
          });
          return;
        }
        if (this.newPassword !== this.confirmPassword) {
          uni.showToast({
            title: "两次输入的密码不一致",
            icon: "none"
          });
          return;
        }
        uni.showToast({
          title: "密码修改成功",
          icon: "success"
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "change-password-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode(
              "text",
              {
                class: "back-btn",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
              },
              "←",
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "text",
              {
                class: "title",
                style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
              },
              "密码设置",
              4
              /* STYLE */
            )
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "change-content",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "label",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                },
                "当前手机号",
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "text",
                { class: "current-phone" },
                vue.toDisplayString($data.currentPhone),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "label",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                },
                "验证码",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "code-input" }, [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    type: "number",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.verificationCode = $event),
                    placeholder: "请输入验证码",
                    "placeholder-style": "color: #999",
                    style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#fff", borderColor: $data.isDarkMode ? "#404040" : "#eee", color: $data.isDarkMode ? "#ffffff" : "#333" })
                  },
                  null,
                  4
                  /* STYLE */
                ), [
                  [vue.vModelText, $data.verificationCode]
                ]),
                vue.createElementVNode("button", {
                  class: "send-code-btn",
                  onClick: _cache[2] || (_cache[2] = (...args) => $options.sendCode && $options.sendCode(...args)),
                  disabled: $data.countdown > 0
                }, vue.toDisplayString($data.countdown > 0 ? `${$data.countdown}秒后重新发送` : "发送验证码"), 9, ["disabled"])
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "label",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                },
                "新密码",
                4
                /* STYLE */
              ),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "password",
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.newPassword = $event),
                  placeholder: "请输入新密码",
                  "placeholder-style": "color: #999",
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#fff", borderColor: $data.isDarkMode ? "#404040" : "#eee", color: $data.isDarkMode ? "#ffffff" : "#333" })
                },
                null,
                4
                /* STYLE */
              ), [
                [vue.vModelText, $data.newPassword]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "label",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#333" })
                },
                "确认密码",
                4
                /* STYLE */
              ),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  type: "password",
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.confirmPassword = $event),
                  placeholder: "请再次输入新密码",
                  "placeholder-style": "color: #999",
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#fff", borderColor: $data.isDarkMode ? "#404040" : "#eee", color: $data.isDarkMode ? "#ffffff" : "#333" })
                },
                null,
                4
                /* STYLE */
              ), [
                [vue.vModelText, $data.confirmPassword]
              ])
            ]),
            vue.createElementVNode("button", {
              class: "confirm-btn",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.confirmChange && $options.confirmChange(...args))
            }, "确认修改")
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const PagesUserAccountCodeAccountCode = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/user/account/code/account_code.vue"]]);
  const getApiUrl = (path) => {
    if (!path)
      return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const baseURL = config$1.baseURL;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseURL}${normalizedPath}`;
  };
  const getFullUrl = getApiUrl;
  const getStaticUrl = (path) => {
    if (!path)
      return "";
    if (typeof path !== "string")
      return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const baseURL = config$1.staticURL;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const fullUrl = `${baseURL}${normalizedPath}`;
    formatAppLog("log", "at common/api/ai.js:27", "getStaticUrl 生成:", { original: path, baseURL, normalizedPath, fullUrl });
    return fullUrl;
  };
  const base64ToFile = (base64Data, fileName = "resume.pdf") => {
    return new Promise((resolve, reject) => {
      const fs = uni.getFileSystemManager();
      const filePath = `${uni.env.USER_DATA_PATH}/${fileName}`;
      try {
        const base64 = base64Data.replace(/^data:.*;base64,/, "");
        fs.writeFile({
          filePath,
          data: base64,
          encoding: "base64",
          success: () => resolve({ type: "path", data: filePath }),
          fail: reject
        });
      } catch (e) {
        reject(e);
      }
    });
  };
  const uploadPdf = async (url, fileData, formData = {}) => {
    const fileResult = await base64ToFile(fileData.base64, fileData.name);
    return new Promise((resolve, reject) => {
      const apiUrl = getApiUrl(url);
      formatAppLog("log", "at common/api/ai.js:145", "上传URL:", apiUrl);
      uni.uploadFile({
        url: apiUrl,
        filePath: fileResult.data,
        name: "pdf_file",
        timeout: 12e4,
        formData,
        header: {
          "Authorization": `Bearer ${uni.getStorageSync("token")}`
        },
        success: (res) => {
          try {
            uni.getFileSystemManager().unlink({ filePath: fileResult.data });
          } catch (e) {
          }
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch (e) {
            resolve({ code: 200, data: res.data });
          }
        },
        fail: (err) => {
          try {
            uni.getFileSystemManager().unlink({ filePath: fileResult.data });
          } catch (e) {
          }
          reject(err);
        }
      });
    });
  };
  const aiApi = {
    // 简历分析
    askByUserJobName: (jobName) => requestWithRetry({
      url: "/ai/ask_by_user_job_name",
      method: "GET",
      params: { job_name: jobName }
    }),
    askByUserJobText: (jobText) => requestWithRetry({
      url: "/ai/ask_by_user_job_text",
      method: "POST",
      data: { job_text: jobText }
    }),
    /**
     * PDF + 职位ID 分析
     * @param {Object} fileData - { name, base64 } base64 编码的PDF
     * @param {String} jobName - 职位ID
     */
    askByPdfJobName: (fileData, jobName) => {
      return uploadPdf("/ai/ask_by_pdf_job_name", fileData, { job_name: jobName });
    },
    /**
     * PDF + 职位文本 分析
     * @param {Object} fileData - { name, base64 } base64 编码的PDF
     * @param {String} jobText - 职位描述文本
     */
    askByPdfJobText: (fileData, jobText) => {
      return uploadPdf("/ai/ask_by_pdf_job_text", fileData, { job_text: jobText });
    },
    // 简历评估（用户ID）
    resumeEvaluation: () => requestWithRetry({
      url: "/ai/resume_evaluation",
      method: "GET"
    }),
    /**
     * PDF 简历评估
     * @param {Object} fileData - { name, base64 } base64 编码的PDF
     */
    resumeEvaluationByPdf: (fileData) => {
      return uploadPdf("/ai/resume_evaluation_text", fileData);
    },
    // 成功率分析
    successRateByUserJobName: (jobName) => requestWithRetry({
      url: "/ai/success_rate_user_job_name",
      method: "GET",
      params: { job_name: jobName }
    }),
    successRateByUserJobText: (jobText) => requestWithRetry({
      url: "/ai/success_rate_user_job_text",
      method: "POST",
      data: { job_text: jobText }
    }),
    /**
     * PDF + 职位ID 成功率分析
     * @param {Object} fileData - { name, base64 } base64 编码的PDF
     * @param {String} jobName - 职位ID
     */
    successRateByPdfJobName: (fileData, jobName) => {
      return uploadPdf("/ai/success_rate_pdf_job_name", fileData, { job_name: jobName });
    },
    /**
     * PDF + 职位文本 成功率分析
     * @param {Object} fileData - { name, base64 } base64 编码的PDF
     * @param {String} jobText - 职位描述文本
     */
    successRateByPdfJobText: (fileData, jobText) => {
      return uploadPdf("/ai/success_rate_pdf_job_text", fileData, { job_text: jobText });
    },
    // 大学生活规划
    universityPlanByUserJobName: (jobName, userGrade) => requestWithRetry({
      url: "/ai/university_plan_user_job_name",
      method: "GET",
      params: { job_name: jobName, user_grade: userGrade }
    }),
    universityPlanByUserJobText: (jobText, userGrade) => requestWithRetry({
      url: "/ai/university_plan_user_job_text",
      method: "POST",
      data: { job_text: jobText, user_grade: userGrade }
    }),
    /**
     * PDF + 职位ID 大学生活规划
     * @param {Object} fileData - { name, base64 } base64 编码的PDF
     * @param {String} jobName - 职位ID
     * @param {String} userGrade - 学生年级
     */
    universityPlanByPdfJobName: (fileData, jobName, userGrade) => {
      return uploadPdf("/ai/university_plan_pdf_job_name", fileData, {
        job_name: jobName,
        user_grade: userGrade
      });
    },
    /**
     * PDF + 职位文本 大学生活规划
     * @param {Object} fileData - { name, base64 } base64 编码的PDF
     * @param {String} jobText - 职位描述文本
     * @param {String} userGrade - 学生年级
     */
    universityPlanByPdfJobText: (fileData, jobText, userGrade) => {
      return uploadPdf("/ai/university_plan_pdf_job_text", fileData, {
        job_text: jobText,
        user_grade: userGrade
      });
    },
    // AI对话
    chat: (message) => requestWithRetry({
      url: "/ai/chat",
      method: "POST",
      data: { message }
    })
  };
  const interviewApi = {
    startText: (resumeText, jobText) => requestWithRetry({
      url: "/ai/interview/start/text",
      method: "POST",
      data: {
        resume_text: resumeText,
        job_text: jobText
      }
    }),
    startPdfText: (pdfBase64, jobText) => requestWithRetry({
      url: "/ai/interview/start/pdf-text",
      method: "POST",
      data: {
        resume_file: pdfBase64,
        job_text: jobText
      }
    }),
    startPdfJobName: (pdfBase64, jobName) => requestWithRetry({
      url: "/ai/interview/start/pdf-job_name",
      method: "POST",
      data: {
        resume_file: pdfBase64,
        job_name: jobName
      }
    }),
    startUserIdJobName: (userId, jobName) => requestWithRetry({
      url: "/ai/interview/start/userid-job_name",
      method: "POST",
      data: {
        user_id: userId,
        job_name: jobName
      }
    }),
    startUserIdText: (userId, jobText) => requestWithRetry({
      url: "/ai/interview/start/userid-text",
      method: "POST",
      data: {
        user_id: userId,
        job_text: jobText
      }
    }),
    startTextJobName: (resumeText, jobName) => requestWithRetry({
      url: "/ai/interview/start/text-job_name",
      method: "POST",
      data: {
        resume_text: resumeText,
        job_name: jobName
      }
    }),
    // 语音转文字 
    transcribe: (sessionId, filePath) => {
      return uni.uploadFile({
        url: getFullUrl(`/ai/interview/${sessionId}/transcribe`),
        filePath,
        name: "audio_file",
        header: { "Authorization": `Bearer ${uni.getStorageSync("token")}` }
      });
    },
    // 提交回答
    answer: (sessionId, userText, endInterview) => requestWithRetry({
      url: `/ai/interview/${sessionId}/answer`,
      method: "POST",
      data: { user_text: userText, end_interview: endInterview }
    }),
    // 获取报告
    getReport: (sessionId) => requestWithRetry({
      url: `/ai/interview/${sessionId}/report`,
      method: "GET"
    }),
    // 获取历史
    getHistory: (sessionId) => requestWithRetry({
      url: `/ai/interview/${sessionId}/history`,
      method: "GET"
    })
  };
  const _imports_0$1 = "/static/ai/logo.png";
  const _imports_1$1 = "/static/ai/file-icon.png";
  const _imports_1 = "/static/ai/close.png";
  const BASE_URL$1 = "http://39.106.72.110";
  const _sfc_main$8 = {
    data() {
      return {
        messages: [
          {
            sender: "ai",
            content: "您好！我是AI求职助手，可以帮助您分析简历、评估求职成功率，还可以进行模拟面试。请问有什么可以帮助您的？",
            timestamp: Date.now(),
            expanded: false
          }
        ],
        inputText: "",
        scrollTop: 0,
        isLoading: false,
        currentPanel: null,
        currentMethod: "user+position",
        isLoadingUser: false,
        userInfo: null,
        currentUserId: null,
        currentTheme: themeManager.getCurrentTheme(),
        isDarkMode: false,
        formData: {
          positionId: "",
          positionText: "",
          pdfFile: null,
          positionName: ""
        },
        gradeIndex: 0,
        gradeOptions: ["大一", "大二", "大三", "大四", "研一", "研二", "研三"],
        // 级联选择
        showCascadePicker: false,
        selectedCategoryId: "",
        selectedCategoryName: "",
        selectedPositionId: "",
        selectedPositionName: "",
        // 职位数据
        mainCategories: [
          { id: "101", name: "前端开发" },
          { id: "102", name: "后端开发" },
          { id: "103", name: "移动端开发" },
          { id: "104", name: "数据与AI" },
          { id: "105", name: "运维与测试" },
          { id: "106", name: "产品设计" },
          { id: "107", name: "网络安全" },
          { id: "108", name: "嵌入式开发" },
          { id: "200", name: "产品与设计类" },
          { id: "300", name: "技术管理类" }
        ],
        positionDetails: {
          "101": [
            { id: "1", name: "Web前端工程师" },
            { id: "2", name: "移动端前端工程师" },
            { id: "3", name: "小程序开发工程师" },
            { id: "4", name: "跨平台开发工程师" },
            { id: "5", name: "前端架构师" },
            { id: "6", name: "Node.js全栈工程师" }
          ],
          "102": [
            { id: "7", name: "Java开发工程师" },
            { id: "8", name: "Python开发工程师" },
            { id: "9", name: "Go开发工程师" },
            { id: "10", name: "C++开发工程师" },
            { id: "11", name: "PHP开发工程师" },
            { id: "12", name: "微服务架构师" }
          ],
          "103": [
            { id: "13", name: "Android开发工程师" },
            { id: "14", name: "iOS开发工程师" },
            { id: "15", name: "鸿蒙开发工程师" },
            { id: "16", name: "移动游戏开发工程师" }
          ],
          "104": [
            { id: "17", name: "大数据开发工程师" },
            { id: "18", name: "数据仓库工程师" },
            { id: "19", name: "机器学习工程师" },
            { id: "20", name: "深度学习工程师" },
            { id: "21", name: "算法工程师（推荐/广告）" },
            { id: "22", name: "自然语言处理工程师" },
            { id: "23", name: "计算机视觉工程师" },
            { id: "24", name: "数据分析师" },
            { id: "25", name: "数据产品经理" }
          ],
          "105": [
            { id: "26", name: "测试工程师" },
            { id: "27", name: "自动化测试工程师" },
            { id: "28", name: "性能测试工程师" },
            { id: "29", name: "测试开发工程师" },
            { id: "30", name: "安全测试工程师" }
          ],
          "106": [
            { id: "31", name: "运维工程师" },
            { id: "32", name: "DevOps工程师" },
            { id: "33", name: "SRE工程师" },
            { id: "34", name: "云原生工程师" },
            { id: "35", name: "数据库管理员(DBA)" },
            { id: "36", name: "网络工程师" }
          ],
          "107": [
            { id: "37", name: "网络安全工程师" },
            { id: "38", name: "渗透测试工程师" },
            { id: "39", name: "安全运维工程师" },
            { id: "40", name: "逆向工程师" },
            { id: "41", name: "安全架构师" }
          ],
          "108": [
            { id: "42", name: "嵌入式软件工程师" },
            { id: "43", name: "Linux驱动工程师" },
            { id: "44", name: "物联网(IoT)工程师" },
            { id: "45", name: "FPGA工程师" }
          ],
          "200": [
            { id: "46", name: "产品经理（技术型）" },
            { id: "47", name: "UI设计师" },
            { id: "48", name: "交互设计师(IXD)" },
            { id: "49", name: "UX研究员" }
          ],
          "300": [
            { id: "50", name: "技术经理/组长" },
            { id: "51", name: "架构师" },
            { id: "52", name: "研发总监" },
            { id: "53", name: "CTO/技术VP" }
          ]
        },
        analysisMethods: [
          { value: "user+position", label: "职位" },
          { value: "user+text", label: "职位文本" },
          { value: "pdf+position", label: "PDF简历+职位" },
          { value: "pdf+text", label: "PDF简历+职位文本" }
        ]
      };
    },
    computed: {
      panelTitle() {
        const titles = {
          resumeAnalysis: "简历分析",
          resumeEvaluation: "简历评估",
          successRate: "成功率分析",
          studentPlan: "大学生规划"
        };
        return titles[this.currentPanel] || "";
      },
      // 当前分类下的职位列表
      currentPositions() {
        if (!this.selectedCategoryId)
          return [];
        return this.positionDetails[this.selectedCategoryId] || [];
      }
    },
    onLoad() {
      this.initializeChat();
      this.fetchUserInfo();
      this.initializeDefaultSelection();
      this.currentTheme = themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      this.themeChangeHandler = (data) => {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      };
      uni.$on("globalThemeChange", this.themeChangeHandler);
    },
    onUnload() {
      this.cleanup();
      uni.$off("globalThemeChange", this.themeChangeHandler);
    },
    methods: {
      initializeChat() {
      },
      // 修改初始化方法：不再自动选择默认职位
      initializeDefaultSelection() {
        this.selectedCategoryId = "";
        this.selectedCategoryName = "";
        this.selectedPositionId = "";
        this.selectedPositionName = "";
        this.formData.positionId = "";
        this.formData.positionName = "";
      },
      // MODIFIED: 打开级联选择器，根据表单已选职位初始化，若无则默认选中第一个分类的第一个职位
      openCascadePicker() {
        var _a;
        this.showCascadePicker = true;
        if (this.formData.positionId) {
          let foundCategoryId = null;
          let foundCategoryName = null;
          let foundPositionName = null;
          for (const [catId, positions] of Object.entries(this.positionDetails)) {
            const pos = positions.find((p) => p.id === this.formData.positionId);
            if (pos) {
              foundCategoryId = catId;
              foundCategoryName = ((_a = this.mainCategories.find((c) => c.id === catId)) == null ? void 0 : _a.name) || "";
              foundPositionName = pos.name;
              break;
            }
          }
          if (foundCategoryId) {
            this.selectedCategoryId = foundCategoryId;
            this.selectedCategoryName = foundCategoryName;
            this.selectedPositionId = this.formData.positionId;
            this.selectedPositionName = foundPositionName;
            return;
          }
        }
        if (!this.selectedCategoryId) {
          const firstCategory = this.mainCategories[0];
          if (firstCategory) {
            this.selectedCategoryId = firstCategory.id;
            this.selectedCategoryName = firstCategory.name;
            const positions = this.positionDetails[firstCategory.id] || [];
            if (positions.length > 0) {
              const firstPosition = positions[0];
              this.selectedPositionId = firstPosition.id;
              this.selectedPositionName = firstPosition.name;
            }
          }
        }
      },
      // MODIFIED: 选择分类时自动选中该分类下第一个职位，但不更新表单
      selectCategory(category) {
        this.selectedCategoryId = category.id;
        this.selectedCategoryName = category.name;
        const positions = this.positionDetails[category.id] || [];
        if (positions.length > 0) {
          const firstPosition = positions[0];
          this.selectedPositionId = firstPosition.id;
          this.selectedPositionName = firstPosition.name;
        } else {
          this.selectedPositionId = "";
          this.selectedPositionName = "";
        }
      },
      // MODIFIED: 选择职位时仅更新选中变量，不自动关闭弹窗，不更新表单
      selectPosition(position) {
        this.selectedPositionId = position.id;
        this.selectedPositionName = position.name;
      },
      // MODIFIED: 确定选择，将选中职位同步到表单并关闭弹窗
      confirmCascadeSelection() {
        if (!this.selectedPositionId) {
          uni.showToast({ title: "请选择职位", icon: "none" });
          return;
        }
        this.formData.positionId = this.selectedPositionId;
        this.formData.positionName = this.selectedPositionName;
        this.showCascadePicker = false;
        uni.showToast({
          title: `已选择: ${this.selectedCategoryName} - ${this.selectedPositionName}`,
          icon: "none",
          duration: 1500
        });
      },
      closeCascadePicker() {
        this.showCascadePicker = false;
      },
      // 获取用户信息
      async fetchUserInfo() {
        this.isLoadingUser = true;
        try {
          const token = uni.getStorageSync("token");
          if (!token) {
            formatAppLog("log", "at pages/AI/AI.vue:533", "未找到登录token，需要用户登录");
            this.currentUserId = null;
            return;
          }
          const cachedUserInfo = uni.getStorageSync("userInfo");
          if (cachedUserInfo && cachedUserInfo.user_id) {
            this.userInfo = cachedUserInfo;
            this.currentUserId = String(cachedUserInfo.user_id);
            formatAppLog("log", "at pages/AI/AI.vue:542", "从缓存获取用户ID:", this.currentUserId);
            return;
          }
          const res = await this.getUserProfile();
          if (res.code === 200 && res.data) {
            this.userInfo = res.data;
            this.currentUserId = String(res.data.user_id || res.data.userId || res.data.id);
            uni.setStorageSync("userInfo", res.data);
            formatAppLog("log", "at pages/AI/AI.vue:552", "从后端获取用户ID:", this.currentUserId);
          }
        } catch (error) {
          formatAppLog("error", "at pages/AI/AI.vue:555", "获取用户信息失败:", error);
          uni.showToast({
            title: "获取用户信息失败",
            icon: "none",
            duration: 2e3
          });
          this.currentUserId = null;
        } finally {
          this.isLoadingUser = false;
        }
      },
      getUserProfile() {
        return new Promise((resolve, reject) => {
          uni.request({
            url: `${BASE_URL$1}/api/user/profile`,
            method: "GET",
            header: {
              "Authorization": `Bearer ${uni.getStorageSync("token")}`
            },
            success: (res) => {
              resolve(res.data);
            },
            fail: (err) => {
              reject(err);
            }
          });
        });
      },
      cleanup() {
      },
      goToInterview() {
        uni.navigateTo({
          url: "/pages/AI/interview"
        });
      },
      async sendMessage() {
        if (!this.inputText.trim() || this.isLoading)
          return;
        const userMessage = this.inputText.trim();
        this.messages.push({
          sender: "user",
          content: userMessage,
          timestamp: Date.now()
        });
        this.scrollToBottom();
        this.isLoading = true;
        this.inputText = "";
        try {
          const res = await aiApi.chat(userMessage);
          let aiContent = "";
          if (typeof res === "string") {
            aiContent = this.preprocessContent(res);
          } else if (res && res.response) {
            if (Array.isArray(res.response)) {
              aiContent = res.response.filter((item) => item.role === "assistant").map((item) => item.content).join("\n");
            } else if (typeof res.response === "string") {
              aiContent = this.preprocessContent(res.response);
            } else {
              aiContent = JSON.stringify(res.response);
            }
          } else {
            aiContent = (res == null ? void 0 : res.data) || (res == null ? void 0 : res.message) || JSON.stringify(res) || "AI未返回有效内容";
          }
          this.messages.push({
            sender: "ai",
            content: aiContent || "AI未返回有效内容",
            timestamp: Date.now(),
            expanded: false
          });
        } catch (error) {
          formatAppLog("error", "at pages/AI/AI.vue:641", "AI对话失败:", error);
          this.messages.push({
            sender: "ai",
            content: "抱歉，服务暂时不可用，请稍后重试。",
            timestamp: Date.now(),
            expanded: false
          });
        } finally {
          this.isLoading = false;
          this.scrollToBottom();
        }
      },
      openPanel(panelType) {
        this.currentPanel = panelType;
        this.currentMethod = this.getDefaultMethod(panelType);
        if (!this.currentUserId && !this.isLoadingUser) {
          this.fetchUserInfo();
        }
        if (!this.selectedCategoryId) {
          this.initializeDefaultSelection();
        }
      },
      closePanel() {
        this.currentPanel = null;
        this.resetForm();
      },
      getDefaultMethod(panelType) {
        const defaults = {
          resumeAnalysis: "user+position",
          resumeEvaluation: "pdf",
          successRate: "pdf+position",
          studentPlan: "pdf+position"
        };
        return defaults[panelType] || "user+position";
      },
      onMethodChange(e) {
        this.currentMethod = e.detail.value;
      },
      onGradeChange(e) {
        this.gradeIndex = parseInt(e.detail.value);
      },
      preprocessContent(text) {
        if (!text)
          return "";
        let processed = text;
        processed = processed.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\t/g, "	").replace(/\\r/g, "").replace(/\\\\/g, "\\");
        processed = processed.replace(/\s*,\s*"role"\s*:\s*"assistant"\s*\]?\}?$/g, "").replace(/\s*,\s*"role"\s*:\s*"user"\s*\]?\}?$/g, "").replace(/\]?\}?\s*$/, "");
        return processed;
      },
      parseMarkdown(text) {
        if (!text)
          return "";
        let html = this.preprocessContent(text);
        html = html.replace(/^\s*#\s*$/gm, "").replace(/^\s*---\s*$/gm, "").replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:600;color:#222;">$1</strong>').replace(/\*([^*\n]+)\*/g, '<em style="font-style:italic;color:#555;">$1</em>').replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2rpx 8rpx;border-radius:4rpx;color:#e83e8c;font-size:28rpx;">$1</code>').replace(/###\s+([^\n]+)/g, '<strong style="font-size:32rpx;font-weight:600;display:block;margin:16rpx 0 8rpx;color:#333;">$1</strong>').replace(/##\s+([^\n]+)/g, '<strong style="font-size:34rpx;font-weight:600;display:block;margin:20rpx 0 12rpx;color:#222;border-bottom:2rpx solid #eee;padding-bottom:6rpx;">$1</strong>').replace(/#\s+([^\n]+)/g, '<strong style="font-size:36rpx;font-weight:600;display:block;margin:24rpx 0 16rpx;color:#111;">$1</strong>');
        html = html.replace(/^\s*[-•]\s+([^\n]+)/gm, ":::li:::$1:::/li:::");
        html = html.replace(/(:::li:::.*?:::\/li:::\s*)+/g, function(match) {
          const items = match.match(/:::li:::(.*?):::\/li:::/g);
          if (items) {
            const listItems = items.map((item) => {
              const content = item.replace(/:::li:::/, "").replace(/:::\/li:::/, "");
              return '<li style="margin:2rpx 0;line-height:1.4;">' + content + "</li>";
            }).join("");
            return '<ul style="padding-left:28rpx;margin:6rpx 0 10rpx;list-style-type:disc;">' + listItems + "</ul>";
          }
          return match;
        });
        html = html.replace(/\n\s*\n/g, "<br>").replace(/\n/g, "<br>");
        html = html.replace(/(<br>\s*){3,}/g, "<br><br>").replace(/^<br\s*\/?>|<br\s*\/?>$/g, "").replace(/<br><\/li>/g, "</li>").replace(/<\/li><br>/g, "</li>").replace(/<ul><br>/g, "<ul>").replace(/<\/ul><br>/g, "</ul>").replace(/<strong><br>/g, "<strong>").replace(/<br><\/strong>/g, "</strong>");
        return html;
      },
      needMarkdownRender(text) {
        if (!text)
          return false;
        const patterns = [
          /\*\*[^*]+\*\*/,
          /\*[^*]+\*/,
          /`[^`]+`/,
          /^#{1,6}\s+/m,
          /^[-•]\s+/m,
          /^\d+\.\s+/m,
          /\\n/,
          /"role"/,
          /\\"/
        ];
        return patterns.some((p) => p.test(text));
      },
      chooseFile() {
        if (typeof plus !== "undefined" && plus.io) {
          plus.io.chooseFile({
            title: "选择PDF文件",
            filetypes: ["pdf"],
            success: (res) => {
              var _a;
              const filePath = res.path || res.uri || res.fullPath;
              if (!filePath)
                return;
              const fileName = ((_a = String(filePath).match(/[^/\\]+\.pdf$/i)) == null ? void 0 : _a[0]) || `file_${Date.now()}.pdf`;
              plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
                entry.getMetadata((metadata) => {
                  const fileSize = metadata.size;
                  uni.getFileSystemManager().readFile({
                    filePath,
                    encoding: "base64",
                    success: (readRes) => {
                      this.formData.pdfFile = {
                        name: fileName,
                        size: fileSize,
                        base64: readRes.data
                      };
                      uni.showToast({
                        title: "文件选择成功",
                        icon: "success",
                        duration: 1500
                      });
                    },
                    fail: (err) => {
                      formatAppLog("error", "at pages/AI/AI.vue:889", "读取文件失败:", err);
                      uni.showToast({
                        title: "文件读取失败",
                        icon: "none"
                      });
                    }
                  });
                }, (err) => {
                  formatAppLog("error", "at pages/AI/AI.vue:897", "获取文件大小失败:", err);
                  this.handleFileRead(filePath, fileName, 0);
                });
              }, (err) => {
                formatAppLog("error", "at pages/AI/AI.vue:902", "解析文件路径失败:", err);
                this.handleFileRead(filePath, fileName, 0);
              });
            },
            fail: (err) => {
              formatAppLog("error", "at pages/AI/AI.vue:907", "选择文件失败:", err);
              if (!err.message || !err.message.includes("cancel")) {
                uni.showToast({
                  title: "文件选择失败",
                  icon: "none"
                });
              }
            }
          });
        } else {
          uni.chooseFile({
            count: 1,
            type: "all",
            extension: ["pdf"],
            success: (res) => {
              var _a;
              const filePath = res.tempFilePaths[0];
              const fileName = ((_a = String(filePath).match(/[^/\\]+\.pdf$/i)) == null ? void 0 : _a[0]) || `file_${Date.now()}.pdf`;
              uni.getFileSystemManager().readFile({
                filePath,
                encoding: "base64",
                success: (readRes) => {
                  this.formData.pdfFile = {
                    name: fileName,
                    size: res.tempFiles ? res.tempFiles[0].size : 0,
                    base64: readRes.data
                  };
                  uni.showToast({
                    title: "文件选择成功",
                    icon: "success",
                    duration: 1500
                  });
                },
                fail: (err) => {
                  formatAppLog("error", "at pages/AI/AI.vue:942", "读取文件失败:", err);
                  uni.showToast({
                    title: "文件读取失败",
                    icon: "none"
                  });
                }
              });
            },
            fail: (err) => {
              formatAppLog("error", "at pages/AI/AI.vue:951", "选择文件失败:", err);
              if (err.errMsg && !err.errMsg.includes("cancel")) {
                uni.showToast({
                  title: "文件选择失败",
                  icon: "none"
                });
              }
            }
          });
        }
      },
      async submitFunction() {
        if (this.currentMethod.includes("user") && !this.currentUserId) {
          uni.showToast({
            title: "请先登录",
            icon: "none",
            duration: 2e3
          });
          this.fetchUserInfo();
          return;
        }
        if (!this.validateForm()) {
          return;
        }
        const panelType = this.currentPanel;
        if (!panelType) {
          uni.showToast({ title: "操作异常，请重试", icon: "none" });
          return;
        }
        const savedFormData = {
          positionId: this.formData.positionId,
          positionText: this.formData.positionText,
          pdfFile: this.formData.pdfFile ? { ...this.formData.pdfFile } : null,
          positionName: this.formData.positionName,
          userId: this.currentUserId
        };
        const savedMethod = this.currentMethod;
        const userMessage = this.getUserMessageText();
        this.messages.push({
          sender: "user",
          content: userMessage,
          timestamp: Date.now(),
          file: this.formData.pdfFile ? {
            name: this.formData.pdfFile.name,
            size: this.formData.pdfFile.size
          } : null
        });
        this.closePanel();
        this.scrollToBottom();
        this.isLoading = true;
        try {
          let result = null;
          switch (panelType) {
            case "resumeAnalysis":
              result = await this.submitResumeAnalysis(savedFormData, savedMethod);
              break;
            case "resumeEvaluation":
              result = await this.submitResumeEvaluation(savedFormData, savedMethod);
              break;
            case "successRate":
              result = await this.submitSuccessRate(savedFormData, savedMethod);
              break;
            case "studentPlan":
              result = await this.submitStudentPlan(savedFormData, savedMethod);
              break;
            default:
              throw new Error("未知操作类型: " + panelType);
          }
          if (result) {
            this.messages.push({
              sender: "ai",
              content: typeof result === "string" ? result : JSON.stringify(result),
              timestamp: Date.now(),
              expanded: false
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/AI/AI.vue:1037", "提交失败:", error);
          this.messages.push({
            sender: "ai",
            content: "抱歉，分析失败：" + (error.message || "未知错误"),
            timestamp: Date.now(),
            expanded: false
          });
        } finally {
          this.isLoading = false;
          this.scrollToBottom();
        }
      },
      async submitResumeAnalysis(formData, method) {
        var _a, _b, _c, _d, _e;
        try {
          let res;
          if (method === "user+position") {
            const jobName = (formData.positionName || "").trim();
            if (!jobName) {
              throw new Error("请选择有效的职位");
            }
            if (!formData.userId) {
              throw new Error("用户未登录");
            }
            res = await aiApi.askByUserJobName(jobName);
            return (res == null ? void 0 : res.analysis) || ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.analysis) || (res == null ? void 0 : res.data) || res;
          } else if (method === "user+text") {
            if (!formData.positionText.trim()) {
              throw new Error("职位描述不能为空");
            }
            if (!formData.userId) {
              throw new Error("用户未登录");
            }
            res = await aiApi.askByUserJobText(formData.positionText);
            return (res == null ? void 0 : res.analysis) || ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.analysis) || (res == null ? void 0 : res.data) || res;
          } else if (method === "pdf+position") {
            if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
              throw new Error("PDF 文件没有 base64 数据");
            }
            const jobName = (formData.positionName || "").trim();
            if (!jobName) {
              throw new Error("请选择有效的职位");
            }
            res = await aiApi.askByPdfJobName(
              { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
              jobName
            );
          } else if (method === "pdf+text") {
            if (!((_d = formData.pdfFile) == null ? void 0 : _d.base64)) {
              throw new Error("PDF 文件没有 base64 数据");
            }
            if (!formData.positionText.trim()) {
              throw new Error("职位描述不能为空");
            }
            res = await aiApi.askByPdfJobText(
              { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
              formData.positionText
            );
          } else {
            throw new Error(`不支持的简历分析方法: ${method}`);
          }
          return (res == null ? void 0 : res.analysis) || ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.analysis) || (res == null ? void 0 : res.data) || res;
        } catch (err) {
          formatAppLog("error", "at pages/AI/AI.vue:1107", "简历分析失败:", err);
          throw err;
        }
      },
      async submitResumeEvaluation(formData, method) {
        var _a, _b, _c;
        if (method === "user") {
          const res = await aiApi.resumeEvaluation();
          return ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.evaluation) || (res == null ? void 0 : res.evaluation) || (res == null ? void 0 : res.data) || res;
        } else if (method === "pdf") {
          if (!((_b = formData.pdfFile) == null ? void 0 : _b.base64)) {
            throw new Error("PDF 文件没有 base64 数据");
          }
          const res = await aiApi.resumeEvaluationByPdf({
            name: formData.pdfFile.name,
            base64: formData.pdfFile.base64
          });
          return ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.evaluation) || (res == null ? void 0 : res.evaluation) || (res == null ? void 0 : res.data) || res;
        } else {
          throw new Error(`不支持的简历评估方法: ${method}`);
        }
      },
      async submitSuccessRate(formData, method) {
        var _a, _b, _c, _d, _e, _f;
        if (method === "pdf+position") {
          if (!((_a = formData.pdfFile) == null ? void 0 : _a.base64)) {
            throw new Error("PDF 文件没有 base64 数据");
          }
          const jobName = (formData.positionName || "").trim();
          if (!jobName) {
            throw new Error("请选择有效的职位");
          }
          formatAppLog("log", "at pages/AI/AI.vue:1139", "调用成功率分析，职位名称:", jobName);
          const res = await aiApi.successRateByPdfJobName(
            { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
            jobName
          );
          return ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
        } else if (method === "pdf+text") {
          if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
            throw new Error("PDF 文件没有 base64 数据");
          }
          const res = await aiApi.successRateByPdfJobText(
            { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
            formData.positionText
          );
          return ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
        } else if (method === "user+position") {
          const jobName = (formData.positionName || "").trim();
          if (!jobName) {
            throw new Error("请选择有效的职位");
          }
          const res = await aiApi.successRateByUserJobName(jobName);
          return ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
        } else if (method === "user+text") {
          const res = await aiApi.successRateByUserJobText(formData.positionText);
          return ((_f = res == null ? void 0 : res.data) == null ? void 0 : _f.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
        } else {
          throw new Error(`不支持的成功率分析方法: ${method}`);
        }
      },
      async submitStudentPlan(formData, method) {
        var _a, _b, _c, _d, _e, _f;
        const userGrade = this.gradeOptions[this.gradeIndex];
        if (method === "pdf+position") {
          if (!((_a = formData.pdfFile) == null ? void 0 : _a.base64)) {
            throw new Error("PDF 文件没有 base64 数据");
          }
          const jobName = (formData.positionName || "").trim();
          if (!jobName) {
            throw new Error("请选择有效的职位");
          }
          const res = await aiApi.universityPlanByPdfJobName(
            { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
            jobName,
            userGrade
          );
          return ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
        } else if (method === "pdf+text") {
          if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
            throw new Error("PDF 文件没有 base64 数据");
          }
          const res = await aiApi.universityPlanByPdfJobText(
            { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
            formData.positionText,
            userGrade
          );
          return ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
        } else if (method === "user+position") {
          const jobName = (formData.positionName || "").trim();
          if (!jobName) {
            throw new Error("请选择有效的职位");
          }
          const res = await aiApi.universityPlanByUserJobName(
            jobName,
            userGrade
          );
          return ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
        } else if (method === "user+text") {
          const res = await aiApi.universityPlanByUserJobText(
            formData.positionText,
            userGrade
          );
          return ((_f = res == null ? void 0 : res.data) == null ? void 0 : _f.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
        } else {
          throw new Error(`不支持的大学生规划方法: ${method}`);
        }
      },
      getUserMessageText() {
        const texts = {
          resumeAnalysis: "请分析这份简历与岗位的匹配度",
          resumeEvaluation: "请评估我的简历",
          successRate: "请分析我的求职成功率",
          studentPlan: "请为我制定大学生活规划"
        };
        let text = texts[this.currentPanel] || "提交分析";
        if (this.currentMethod.includes("position") && this.formData.positionId) {
          if (this.selectedCategoryName && this.selectedPositionName) {
            text += ` [${this.selectedCategoryName} - ${this.selectedPositionName}]`;
          }
        } else if (this.currentMethod.includes("text") && this.formData.positionText) {
          text += ` [${this.formData.positionText}]`;
        }
        if (this.formData.pdfFile) {
          text += `：[${this.formData.pdfFile.name}]`;
        }
        return text;
      },
      validateForm() {
        const method = this.currentMethod;
        if (method.includes("user")) {
          if (!this.currentUserId) {
            uni.showToast({
              title: "未获取到用户信息，请重新登录",
              icon: "none",
              duration: 3e3
            });
            this.fetchUserInfo();
            return false;
          }
        }
        if (method.includes("position")) {
          if (!this.selectedPositionId) {
            uni.showToast({ title: "请选择职位", icon: "none" });
            return false;
          }
        }
        if (method.includes("text") && !this.formData.positionText.trim()) {
          uni.showToast({ title: "请输入职位描述", icon: "none" });
          return false;
        }
        if (method.includes("pdf") && !this.formData.pdfFile) {
          const pdf = this.formData.pdfFile;
          formatAppLog("log", "at pages/AI/AI.vue:1279", pdf);
          formatAppLog("log", "at pages/AI/AI.vue:1280", this.formData.pdfFile);
          uni.showToast({ title: "请上传PDF文件", icon: "none" });
          return false;
        }
        return true;
      },
      toggleCard(index) {
        this.$set(this.messages[index], "expanded", !this.messages[index].expanded);
      },
      scrollToBottom() {
        this.$nextTick(() => {
          this.scrollTop = 999999;
        });
      },
      loadMoreHistory() {
      },
      formatFileSize(size) {
        if (!size)
          return "0B";
        if (size < 1024)
          return size + "B";
        if (size < 1024 * 1024)
          return (size / 1024).toFixed(1) + "KB";
        return (size / (1024 * 1024)).toFixed(1) + "MB";
      },
      formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
      },
      resetForm() {
        this.formData = {
          positionId: "",
          positionText: "",
          pdfFile: null,
          positionName: ""
        };
        this.gradeIndex = 0;
        this.selectedCategoryId = "";
        this.selectedCategoryName = "";
        this.selectedPositionId = "";
        this.selectedPositionName = "";
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["ai-chat-container", $data.currentTheme + "-theme"]),
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "header header-fixed",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "logo-section" }, [
              vue.createElementVNode("image", {
                class: "logo",
                src: _imports_0$1,
                mode: "aspectFit"
              }),
              vue.createElementVNode(
                "text",
                {
                  class: "app-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "AI求职助手",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-actions" }, [
              vue.createElementVNode(
                "button",
                {
                  class: "interview-btn",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goToInterview && $options.goToInterview(...args)),
                  style: vue.normalizeStyle({ background: "linear-gradient(120deg, #4facfe, #00f2fe)", color: "#ffffff" })
                },
                "模拟面试",
                4
                /* STYLE */
              )
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("scroll-view", {
          class: "chat-area",
          "scroll-y": "",
          "scroll-top": $data.scrollTop,
          onScrolltoupper: _cache[1] || (_cache[1] = (...args) => $options.loadMoreHistory && $options.loadMoreHistory(...args)),
          style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
        }, [
          vue.createElementVNode("view", { class: "message-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.messages, (message, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: index,
                    class: vue.normalizeClass(["message-item", message.sender === "user" ? "user-message" : "ai-message"])
                  },
                  [
                    vue.createElementVNode(
                      "view",
                      {
                        class: "message-bubble",
                        style: vue.normalizeStyle(message.sender === "user" ? { background: "linear-gradient(120deg, #4facfe, #00f2fe)", color: "#ffffff" } : { background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                      },
                      [
                        !$options.needMarkdownRender(message.content) ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 0,
                          class: "message-text"
                        }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(message.content),
                            1
                            /* TEXT */
                          )
                        ])) : (vue.openBlock(), vue.createElementBlock("rich-text", {
                          key: 1,
                          class: "markdown-content",
                          nodes: $options.parseMarkdown(message.content)
                        }, null, 8, ["nodes"])),
                        message.file ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 2,
                          class: "file-card"
                        }, [
                          vue.createElementVNode("image", {
                            class: "file-icon",
                            src: _imports_1$1,
                            mode: "aspectFit"
                          }),
                          vue.createElementVNode("view", { class: "file-info" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "file-name" },
                              vue.toDisplayString(message.file.name),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "file-size" },
                              vue.toDisplayString($options.formatFileSize(message.file.size)),
                              1
                              /* TEXT */
                            )
                          ])
                        ])) : vue.createCommentVNode("v-if", true),
                        message.analysisResult ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 3,
                            class: vue.normalizeClass(["analysis-card", { expanded: message.expanded }])
                          },
                          [
                            vue.createElementVNode("view", {
                              class: "card-header",
                              onClick: ($event) => $options.toggleCard(index)
                            }, [
                              vue.createElementVNode(
                                "text",
                                { class: "card-title" },
                                vue.toDisplayString(message.analysisResult.title),
                                1
                                /* TEXT */
                              ),
                              vue.createElementVNode("image", {
                                class: "expand-icon",
                                src: message.expanded ? "/static/ai/collapse.png" : "/static/ai/expand.png",
                                mode: "aspectFit"
                              }, null, 8, ["src"])
                            ], 8, ["onClick"]),
                            message.expanded ? (vue.openBlock(), vue.createElementBlock("view", {
                              key: 0,
                              class: "card-content"
                            }, [
                              vue.createElementVNode("rich-text", {
                                nodes: message.analysisResult.content
                              }, null, 8, ["nodes"])
                            ])) : vue.createCommentVNode("v-if", true)
                          ],
                          2
                          /* CLASS */
                        )) : vue.createCommentVNode("v-if", true),
                        message.uploadProgress !== void 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                          key: 4,
                          class: "progress-bar"
                        }, [
                          vue.createElementVNode(
                            "view",
                            {
                              class: "progress-fill",
                              style: vue.normalizeStyle({ width: message.uploadProgress + "%" })
                            },
                            null,
                            4
                            /* STYLE */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "progress-text" },
                            vue.toDisplayString(message.uploadProgress) + "%",
                            1
                            /* TEXT */
                          )
                        ])) : vue.createCommentVNode("v-if", true)
                      ],
                      4
                      /* STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "message-time" },
                      vue.toDisplayString($options.formatTime(message.timestamp)),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "skeleton-message"
            }, [
              vue.createElementVNode("view", { class: "skeleton-bubble" })
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ], 44, ["scroll-top"]),
        vue.createElementVNode(
          "view",
          {
            class: "input-area input-fixed",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 -2px 8px rgba(0,0,0,0.3)" : "0 -4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "function-buttons" }, [
              vue.createElementVNode(
                "button",
                {
                  class: "func-btn",
                  onClick: _cache[2] || (_cache[2] = ($event) => $options.openPanel("resumeAnalysis")),
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E", boxShadow: $data.isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.15)" })
                },
                "简历分析",
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: "func-btn",
                  onClick: _cache[3] || (_cache[3] = ($event) => $options.openPanel("resumeEvaluation")),
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E", boxShadow: $data.isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.15)" })
                },
                "简历评估",
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: "func-btn",
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.openPanel("successRate")),
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E", boxShadow: $data.isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.15)" })
                },
                "成功率分析",
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "button",
                {
                  class: "func-btn",
                  onClick: _cache[5] || (_cache[5] = ($event) => $options.openPanel("studentPlan")),
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E", boxShadow: $data.isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.15)" })
                },
                "大学生规划",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "input-container-merged" }, [
              vue.withDirectives(vue.createElementVNode("textarea", {
                class: "text-input-merged",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.inputText = $event),
                placeholder: "输入您的问题...",
                "placeholder-style": "color: #999",
                "auto-height": true,
                onConfirm: _cache[7] || (_cache[7] = (...args) => $options.sendMessage && $options.sendMessage(...args)),
                disabled: $data.isLoading,
                style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#fff", borderColor: $data.isDarkMode ? "#404040" : "#eee", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
              }, null, 44, ["disabled"]), [
                [vue.vModelText, $data.inputText]
              ]),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["send-icon", { "disabled": !$data.inputText.trim() || $data.isLoading }]),
                  onClick: _cache[8] || (_cache[8] = (...args) => $options.sendMessage && $options.sendMessage(...args)),
                  style: vue.normalizeStyle({ background: !$data.inputText.trim() || $data.isLoading ? "#ccc" : "linear-gradient(120deg, #4facfe, #00f2fe)", color: "#ffffff" })
                },
                [
                  vue.createElementVNode("span", { class: "send-text" }, "发送")
                ],
                6
                /* CLASS, STYLE */
              )
            ])
          ],
          4
          /* STYLE */
        ),
        $data.currentPanel ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "panel-overlay",
            onClick: _cache[26] || (_cache[26] = (...args) => $options.closePanel && $options.closePanel(...args)),
            style: vue.normalizeStyle({ background: "rgba(0, 0, 0, 0.5)" })
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: "function-panel",
                onClick: _cache[25] || (_cache[25] = vue.withModifiers(() => {
                }, ["stop"])),
                style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.95)" : "rgba(255, 255, 255, 0.95)", boxShadow: $data.isDarkMode ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(79, 172, 254, 0.2)" })
              },
              [
                vue.createElementVNode(
                  "view",
                  {
                    class: "panel-header",
                    style: vue.normalizeStyle({ borderBottom: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee" })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "panel-title",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                      },
                      vue.toDisplayString($options.panelTitle),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode("image", {
                      class: "close-btn",
                      src: _imports_1,
                      onClick: _cache[9] || (_cache[9] = (...args) => $options.closePanel && $options.closePanel(...args)),
                      mode: "aspectFit"
                    })
                  ],
                  4
                  /* STYLE */
                ),
                vue.createElementVNode("view", { class: "panel-content" }, [
                  $data.currentPanel === "resumeAnalysis" ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                    vue.createElementVNode("view", { class: "method-selector" }, [
                      vue.createElementVNode(
                        "radio-group",
                        {
                          onChange: _cache[10] || (_cache[10] = (...args) => $options.onMethodChange && $options.onMethodChange(...args))
                        },
                        [
                          (vue.openBlock(true), vue.createElementBlock(
                            vue.Fragment,
                            null,
                            vue.renderList($data.analysisMethods, (method) => {
                              return vue.openBlock(), vue.createElementBlock("label", {
                                key: method.value,
                                class: "radio-item"
                              }, [
                                vue.createElementVNode("radio", {
                                  value: method.value,
                                  checked: $data.currentMethod === method.value
                                }, null, 8, ["value", "checked"]),
                                vue.createElementVNode(
                                  "text",
                                  null,
                                  vue.toDisplayString(method.label),
                                  1
                                  /* TEXT */
                                )
                              ]);
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ],
                        32
                        /* NEED_HYDRATION */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "input-fields" }, [
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        { class: "input-group" },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "职位选择"),
                          vue.createElementVNode("view", {
                            class: "cascade-selector",
                            onClick: _cache[11] || (_cache[11] = (...args) => $options.openCascadePicker && $options.openCascadePicker(...args))
                          }, [
                            vue.createElementVNode(
                              "view",
                              {
                                class: vue.normalizeClass(["selector-content", { "placeholder": !$data.selectedPositionId }])
                              },
                              [
                                $data.selectedPositionId ? (vue.openBlock(), vue.createElementBlock(
                                  "text",
                                  { key: 0 },
                                  vue.toDisplayString($data.selectedCategoryName) + " - " + vue.toDisplayString($data.selectedPositionName),
                                  1
                                  /* TEXT */
                                )) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "请选择职位"))
                              ],
                              2
                              /* CLASS */
                            ),
                            vue.createElementVNode("text", { class: "arrow-icon" }, "›")
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("position")]
                      ]),
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        { class: "input-group" },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "职位描述"),
                          vue.withDirectives(vue.createElementVNode(
                            "textarea",
                            {
                              class: "input-field",
                              "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.formData.positionText = $event),
                              placeholder: "请输入职位描述"
                            },
                            null,
                            512
                            /* NEED_PATCH */
                          ), [
                            [vue.vModelText, $data.formData.positionText]
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("text")]
                      ]),
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        { class: "input-group" },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "PDF文件"),
                          vue.createElementVNode("view", {
                            class: "file-upload",
                            onClick: _cache[13] || (_cache[13] = (...args) => $options.chooseFile && $options.chooseFile(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
                              1
                              /* TEXT */
                            )
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("pdf")]
                      ])
                    ])
                  ])) : vue.createCommentVNode("v-if", true),
                  $data.currentPanel === "resumeEvaluation" ? (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
                    vue.createElementVNode("view", { class: "input-fields" }, [
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        {
                          class: "input-group",
                          key: "pdf-group"
                        },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "请上传PDF简历"),
                          vue.createElementVNode("view", {
                            class: "file-upload",
                            onClick: _cache[14] || (_cache[14] = (...args) => $options.chooseFile && $options.chooseFile(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
                              1
                              /* TEXT */
                            )
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod === "pdf"]
                      ])
                    ])
                  ])) : vue.createCommentVNode("v-if", true),
                  $data.currentPanel === "successRate" ? (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
                    vue.createElementVNode("view", { class: "method-selector" }, [
                      vue.createElementVNode("radio-group", {
                        value: $data.currentMethod,
                        onChange: _cache[15] || (_cache[15] = (...args) => $options.onMethodChange && $options.onMethodChange(...args))
                      }, [
                        vue.createElementVNode("label", { class: "radio-item" }, [
                          vue.createElementVNode("radio", { value: "pdf+position" }),
                          vue.createElementVNode("text", null, "PDF简历+职位")
                        ]),
                        vue.createElementVNode("label", { class: "radio-item" }, [
                          vue.createElementVNode("radio", { value: "user+text" }),
                          vue.createElementVNode("text", null, "职位描述")
                        ])
                      ], 40, ["value"])
                    ]),
                    vue.createElementVNode("view", { class: "input-fields" }, [
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        {
                          class: "input-group",
                          key: "position-group"
                        },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "职位选择"),
                          vue.createElementVNode("view", {
                            class: "cascade-selector",
                            onClick: _cache[16] || (_cache[16] = (...args) => $options.openCascadePicker && $options.openCascadePicker(...args))
                          }, [
                            vue.createElementVNode(
                              "view",
                              {
                                class: vue.normalizeClass(["selector-content", { "placeholder": !$data.selectedPositionId }])
                              },
                              [
                                $data.selectedPositionId ? (vue.openBlock(), vue.createElementBlock(
                                  "text",
                                  { key: 0 },
                                  vue.toDisplayString($data.selectedCategoryName) + " - " + vue.toDisplayString($data.selectedPositionName),
                                  1
                                  /* TEXT */
                                )) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "请选择职位"))
                              ],
                              2
                              /* CLASS */
                            ),
                            vue.createElementVNode("text", { class: "arrow-icon" }, "›")
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("position")]
                      ]),
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        {
                          class: "input-group",
                          key: "text-group"
                        },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "职位描述"),
                          vue.withDirectives(vue.createElementVNode(
                            "textarea",
                            {
                              class: "input-field",
                              "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.formData.positionText = $event),
                              placeholder: "请输入职位描述"
                            },
                            null,
                            512
                            /* NEED_PATCH */
                          ), [
                            [vue.vModelText, $data.formData.positionText]
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("text")]
                      ]),
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        {
                          class: "input-group",
                          key: "pdf-group"
                        },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "PDF文件"),
                          vue.createElementVNode("view", {
                            class: "file-upload",
                            onClick: _cache[18] || (_cache[18] = (...args) => $options.chooseFile && $options.chooseFile(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
                              1
                              /* TEXT */
                            )
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("pdf")]
                      ])
                    ])
                  ])) : vue.createCommentVNode("v-if", true),
                  $data.currentPanel === "studentPlan" ? (vue.openBlock(), vue.createElementBlock("view", { key: 3 }, [
                    vue.createElementVNode("view", { class: "method-selector" }, [
                      vue.createElementVNode("radio-group", {
                        value: $data.currentMethod,
                        onChange: _cache[19] || (_cache[19] = (...args) => $options.onMethodChange && $options.onMethodChange(...args))
                      }, [
                        vue.createElementVNode("label", { class: "radio-item" }, [
                          vue.createElementVNode("radio", { value: "pdf+position" }),
                          vue.createElementVNode("text", null, "PDF简历+职位")
                        ]),
                        vue.createElementVNode("label", { class: "radio-item" }, [
                          vue.createElementVNode("radio", { value: "user+text" }),
                          vue.createElementVNode("text", null, "职位描述")
                        ])
                      ], 40, ["value"])
                    ]),
                    vue.createElementVNode("view", { class: "input-fields" }, [
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        {
                          class: "input-group",
                          key: "position-group"
                        },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "职位选择"),
                          vue.createElementVNode("view", {
                            class: "cascade-selector",
                            onClick: _cache[20] || (_cache[20] = (...args) => $options.openCascadePicker && $options.openCascadePicker(...args))
                          }, [
                            vue.createElementVNode(
                              "view",
                              {
                                class: vue.normalizeClass(["selector-content", { "placeholder": !$data.selectedPositionId }])
                              },
                              [
                                $data.selectedPositionId ? (vue.openBlock(), vue.createElementBlock(
                                  "text",
                                  { key: 0 },
                                  vue.toDisplayString($data.selectedCategoryName) + " - " + vue.toDisplayString($data.selectedPositionName),
                                  1
                                  /* TEXT */
                                )) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "请选择职位"))
                              ],
                              2
                              /* CLASS */
                            ),
                            vue.createElementVNode("text", { class: "arrow-icon" }, "›")
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("position")]
                      ]),
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        {
                          class: "input-group",
                          key: "text-group"
                        },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "职位描述"),
                          vue.withDirectives(vue.createElementVNode(
                            "textarea",
                            {
                              class: "input-field",
                              "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.formData.positionText = $event),
                              placeholder: "请输入职位描述"
                            },
                            null,
                            512
                            /* NEED_PATCH */
                          ), [
                            [vue.vModelText, $data.formData.positionText]
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("text")]
                      ]),
                      vue.withDirectives(vue.createElementVNode(
                        "view",
                        {
                          class: "input-group",
                          key: "pdf-group"
                        },
                        [
                          vue.createElementVNode("text", { class: "input-label" }, "PDF文件"),
                          vue.createElementVNode("view", {
                            class: "file-upload",
                            onClick: _cache[22] || (_cache[22] = (...args) => $options.chooseFile && $options.chooseFile(...args))
                          }, [
                            vue.createElementVNode(
                              "text",
                              null,
                              vue.toDisplayString($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
                              1
                              /* TEXT */
                            )
                          ])
                        ],
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vShow, $data.currentMethod.includes("pdf")]
                      ])
                    ])
                  ])) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "panel-footer" }, [
                  vue.createElementVNode("button", {
                    class: "submit-btn",
                    onClick: _cache[23] || (_cache[23] = (...args) => $options.submitFunction && $options.submitFunction(...args))
                  }, "提交"),
                  vue.createElementVNode("button", {
                    class: "cancel-btn",
                    onClick: _cache[24] || (_cache[24] = (...args) => $options.closePanel && $options.closePanel(...args))
                  }, "取消")
                ])
              ],
              4
              /* STYLE */
            )
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        $data.showCascadePicker ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "cascade-overlay",
          onClick: _cache[29] || (_cache[29] = (...args) => $options.closeCascadePicker && $options.closeCascadePicker(...args))
        }, [
          vue.createElementVNode("view", {
            class: "cascade-modal",
            onClick: _cache[28] || (_cache[28] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("view", { class: "cascade-header" }, [
              vue.createElementVNode("text", { class: "cascade-title" }, "选择职位"),
              vue.createElementVNode("text", {
                class: "cascade-close",
                onClick: _cache[27] || (_cache[27] = (...args) => $options.confirmCascadeSelection && $options.confirmCascadeSelection(...args))
              }, "确定")
            ]),
            vue.createElementVNode("view", { class: "cascade-body" }, [
              vue.createElementVNode("scroll-view", {
                class: "category-list",
                "scroll-y": ""
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.mainCategories, (category) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: category.id,
                      class: vue.normalizeClass(["category-item", $data.selectedCategoryId === category.id ? "active" : ""]),
                      onClick: ($event) => $options.selectCategory(category)
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(category.name),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("scroll-view", {
                class: "position-list",
                "scroll-y": ""
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.currentPositions, (position) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: position.id,
                      class: vue.normalizeClass(["position-item", $data.selectedPositionId === position.id ? "active" : ""]),
                      onClick: ($event) => $options.selectPosition(position)
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(position.name),
                        1
                        /* TEXT */
                      ),
                      $data.selectedPositionId === position.id ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        class: "check-icon"
                      }, "✓")) : vue.createCommentVNode("v-if", true)
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const PagesAIAI = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-e2f8c5c5"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/AI/AI.vue"]]);
  const _imports_0 = "/static/ai/arrow-right.png";
  const BASE_URL = "http://39.106.72.110";
  const _sfc_main$7 = {
    data() {
      return {
        // 环境判断
        isH5: false,
        isMP: false,
        // 页面状态
        interviewStarted: false,
        isStarting: false,
        currentMethod: "user+position",
        // 表单数据
        formData: {
          resumeText: "",
          resumePdf: null,
          userId: "",
          positionId: "",
          positionText: "",
          positionName: ""
        },
        // 用户信息
        userInfo: null,
        isLoadingUser: false,
        // 职位数据
        mainCategories: [
          { id: "101", name: "前端开发" },
          { id: "102", name: "后端开发" },
          { id: "103", name: "移动端开发" },
          { id: "104", name: "数据与AI" },
          { id: "105", name: "运维与测试" },
          { id: "106", name: "产品设计" },
          { id: "107", name: "网络安全" },
          { id: "108", name: "嵌入式开发" },
          { id: "200", name: "产品与设计类" },
          { id: "300", name: "技术管理类" }
        ],
        positionDetails: {
          "101": [
            { id: "1", name: "Web前端工程师" },
            { id: "2", name: "移动端前端工程师" },
            { id: "3", name: "小程序开发工程师" },
            { id: "4", name: "跨平台开发工程师" },
            { id: "5", name: "前端架构师" },
            { id: "6", name: "Node.js全栈工程师" }
          ],
          "102": [
            { id: "7", name: "Java开发工程师" },
            { id: "8", name: "Python开发工程师" },
            { id: "9", name: "Go开发工程师" },
            { id: "10", name: "C++开发工程师" },
            { id: "11", name: "PHP开发工程师" },
            { id: "12", name: "微服务架构师" }
          ],
          "103": [
            { id: "13", name: "Android开发工程师" },
            { id: "14", name: "iOS开发工程师" },
            { id: "15", name: "鸿蒙开发工程师" },
            { id: "16", name: "移动游戏开发工程师" }
          ],
          "104": [
            { id: "17", name: "大数据开发工程师" },
            { id: "18", name: "数据仓库工程师" },
            { id: "19", name: "机器学习工程师" },
            { id: "20", name: "深度学习工程师" },
            { id: "21", name: "算法工程师（推荐/广告）" },
            { id: "22", name: "自然语言处理工程师" },
            { id: "23", name: "计算机视觉工程师" },
            { id: "24", name: "数据分析师" },
            { id: "25", name: "数据产品经理" }
          ],
          "105": [
            { id: "26", name: "测试工程师" },
            { id: "27", name: "自动化测试工程师" },
            { id: "28", name: "性能测试工程师" },
            { id: "29", name: "测试开发工程师" },
            { id: "30", name: "安全测试工程师" }
          ],
          "106": [
            { id: "31", name: "运维工程师" },
            { id: "32", name: "DevOps工程师" },
            { id: "33", name: "SRE工程师" },
            { id: "34", name: "云原生工程师" },
            { id: "35", name: "数据库管理员(DBA)" },
            { id: "36", name: "网络工程师" }
          ],
          "107": [
            { id: "37", name: "网络安全工程师" },
            { id: "38", name: "渗透测试工程师" },
            { id: "39", name: "安全运维工程师" },
            { id: "40", name: "逆向工程师" },
            { id: "41", name: "安全架构师" }
          ],
          "108": [
            { id: "42", name: "嵌入式软件工程师" },
            { id: "43", name: "Linux驱动工程师" },
            { id: "44", name: "物联网(IoT)工程师" },
            { id: "45", name: "FPGA工程师" }
          ],
          "200": [
            { id: "46", name: "产品经理（技术型）" },
            { id: "47", name: "UI设计师" },
            { id: "48", name: "交互设计师(IXD)" },
            { id: "49", name: "UX研究员" }
          ],
          "300": [
            { id: "50", name: "技术经理/组长" },
            { id: "51", name: "架构师" },
            { id: "52", name: "研发总监" },
            { id: "53", name: "CTO/技术VP" }
          ]
        },
        // 级联选择器状态
        showCascadePicker: false,
        selectedCategoryId: "",
        selectedCategoryName: "",
        selectedPositionId: "",
        selectedPositionName: "",
        // 主题相关
        currentTheme: themeManager.getCurrentTheme(),
        isDarkMode: false,
        // 面试配置
        interviewMethods: [
          { value: "user+position", label: "职位" },
          { value: "user+positionText", label: "职位文本" },
          { value: "pdf+position", label: "PDF简历+职位" },
          { value: "pdf+positionText", label: "PDF简历+职位文本" }
        ],
        // 面试流程状态
        sessionId: null,
        currentQuestion: 1,
        totalQuestions: 8,
        currentStage: "自我介绍",
        resumeSource: "",
        jobSource: "",
        // 录音状态
        recorderManager: null,
        isRecording: false,
        isSpeaking: false,
        isAIThinking: false,
        isProcessing: false,
        voiceWaveActive: false,
        recordingTime: 0,
        recordingTimer: null,
        audioFilePath: "",
        // 音频播放
        currentAudioUrl: "",
        innerAudioContext: null,
        // 对话数据
        interviewMessages: [],
        chatScrollTop: 0,
        // 面试技巧
        tipsCollapsed: false,
        currentTips: [
          "保持自信，语速适中",
          "回答问题要有条理，使用STAR法则",
          "适当使用专业术语展示能力",
          "注意与面试官的眼神交流",
          "遇到不会的问题诚实回答"
        ],
        // 面试报告数据
        showReport: false,
        overallScore: 85,
        evaluationItems: [],
        suggestions: [],
        reportData: null,
        // H5文本输入
        tempAnswer: ""
      };
    },
    computed: {
      progressPercent() {
        return Math.min(this.currentQuestion / this.totalQuestions * 100, 100);
      },
      currentPositions() {
        if (!this.selectedCategoryId)
          return [];
        return this.positionDetails[this.selectedCategoryId] || [];
      },
      hasUserInfo() {
        return !!this.formData.userId;
      }
    },
    onLoad() {
      this.initializeInterview();
      this.initRecorder();
      this.fetchUserInfo();
      this.resetPositionSelection();
      this.currentTheme = themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      this.themeChangeHandler = (data) => {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      };
      uni.$on("globalThemeChange", this.themeChangeHandler);
      formatAppLog("log", "at pages/AI/interview.vue:479", "当前环境:", this.isH5 ? "H5" : this.isMP ? "小程序" : "App");
    },
    onUnload() {
      this.cleanupInterview();
      uni.$off("globalThemeChange", this.themeChangeHandler);
    },
    methods: {
      // ==================== 职位选择（级联弹窗） ====================
      openCascadePicker() {
        var _a;
        this.showCascadePicker = true;
        if (this.formData.positionId) {
          let foundCategoryId = null;
          let foundCategoryName = null;
          let foundPositionName = null;
          for (const [catId, positions] of Object.entries(this.positionDetails)) {
            const pos = positions.find((p) => p.id === this.formData.positionId);
            if (pos) {
              foundCategoryId = catId;
              foundCategoryName = ((_a = this.mainCategories.find((c) => c.id === catId)) == null ? void 0 : _a.name) || "";
              foundPositionName = pos.name;
              break;
            }
          }
          if (foundCategoryId) {
            this.selectedCategoryId = foundCategoryId;
            this.selectedCategoryName = foundCategoryName;
            this.selectedPositionId = this.formData.positionId;
            this.selectedPositionName = foundPositionName;
            return;
          }
        }
        if (!this.selectedCategoryId) {
          const firstCategory = this.mainCategories[0];
          if (firstCategory) {
            this.selectedCategoryId = firstCategory.id;
            this.selectedCategoryName = firstCategory.name;
            const positions = this.positionDetails[firstCategory.id] || [];
            if (positions.length > 0) {
              const firstPosition = positions[0];
              this.selectedPositionId = firstPosition.id;
              this.selectedPositionName = firstPosition.name;
            }
          }
        }
      },
      closeCascadePicker() {
        this.showCascadePicker = false;
      },
      selectCategory(category) {
        this.selectedCategoryId = category.id;
        this.selectedCategoryName = category.name;
        const positions = this.positionDetails[category.id] || [];
        if (positions.length > 0) {
          const firstPosition = positions[0];
          this.selectedPositionId = firstPosition.id;
          this.selectedPositionName = firstPosition.name;
        } else {
          this.selectedPositionId = "";
          this.selectedPositionName = "";
        }
      },
      selectPosition(position) {
        this.selectedPositionId = position.id;
        this.selectedPositionName = position.name;
      },
      confirmCascadeSelection() {
        if (!this.selectedPositionId) {
          uni.showToast({ title: "请选择职位", icon: "none" });
          return;
        }
        this.formData.positionId = this.selectedPositionId;
        this.formData.positionName = this.selectedPositionName;
        this.showCascadePicker = false;
        uni.showToast({
          title: `已选择: ${this.selectedCategoryName} - ${this.selectedPositionName}`,
          icon: "none",
          duration: 1500
        });
      },
      resetPositionSelection() {
        this.selectedCategoryId = "";
        this.selectedCategoryName = "";
        this.selectedPositionId = "";
        this.selectedPositionName = "";
        this.formData.positionId = "";
        this.formData.positionName = "";
      },
      // ==================== 用户信息 ====================
      async fetchUserInfo() {
        this.isLoadingUser = true;
        try {
          const token = uni.getStorageSync("token");
          if (!token) {
            formatAppLog("log", "at pages/AI/interview.vue:581", "未找到登录token，需要用户登录");
            this.formData.userId = null;
            return;
          }
          const cachedUserInfo = uni.getStorageSync("userInfo");
          if (cachedUserInfo && cachedUserInfo.user_id) {
            this.userInfo = cachedUserInfo;
            this.formData.userId = String(cachedUserInfo.user_id);
            formatAppLog("log", "at pages/AI/interview.vue:589", "从缓存获取用户ID:", this.formData.userId);
            return;
          }
          const res = await this.getUserProfile();
          if (res.code === 200 && res.data) {
            this.userInfo = res.data;
            this.formData.userId = String(res.data.user_id || res.data.userId || res.data.id);
            uni.setStorageSync("userInfo", res.data);
            formatAppLog("log", "at pages/AI/interview.vue:597", "从后端获取用户ID:", this.formData.userId);
          }
        } catch (error) {
          formatAppLog("error", "at pages/AI/interview.vue:600", "获取用户信息失败:", error);
          uni.showToast({ title: "获取用户信息失败", icon: "none", duration: 2e3 });
          this.formData.userId = null;
        } finally {
          this.isLoadingUser = false;
        }
      },
      getUserProfile() {
        return new Promise((resolve, reject) => {
          uni.request({
            url: `${BASE_URL}/api/user/profile`,
            method: "GET",
            header: { "Authorization": `Bearer ${uni.getStorageSync("token")}` },
            success: (res) => resolve(res.data),
            fail: (err) => reject(err)
          });
        });
      },
      // ==================== 初始化 ====================
      initializeInterview() {
        this.innerAudioContext = uni.createInnerAudioContext();
        this.innerAudioContext.onEnded(() => {
          this.isSpeaking = false;
          this.voiceWaveActive = false;
        });
        this.innerAudioContext.onError((err) => {
          formatAppLog("error", "at pages/AI/interview.vue:628", "音频播放错误", err);
          this.isSpeaking = false;
          this.voiceWaveActive = false;
        });
      },
      initRecorder() {
        if (!this.isH5) {
          try {
            this.recorderManager = uni.getRecorderManager();
            if (this.recorderManager) {
              this.recorderManager.onStart(() => {
                formatAppLog("log", "at pages/AI/interview.vue:641", "录音开始");
                this.isRecording = true;
                this.startRecordingTimer();
              });
              this.recorderManager.onStop((res) => {
                formatAppLog("log", "at pages/AI/interview.vue:646", "录音结束", res);
                this.isRecording = false;
                this.clearRecordingTimer();
                if (res.tempFilePath) {
                  this.audioFilePath = res.tempFilePath;
                  this.processAudio(res.tempFilePath);
                }
              });
              this.recorderManager.onError((err) => {
                formatAppLog("error", "at pages/AI/interview.vue:655", "录音错误", err);
                this.isRecording = false;
                this.clearRecordingTimer();
                uni.showToast({ title: "录音失败: " + (err.errMsg || "未知错误"), icon: "none" });
              });
            } else {
              formatAppLog("warn", "at pages/AI/interview.vue:661", "当前环境不支持录音功能");
            }
          } catch (e) {
            formatAppLog("error", "at pages/AI/interview.vue:664", "初始化录音失败:", e);
          }
        }
      },
      cleanupInterview() {
        this.resetInterview();
        this.clearRecordingTimer();
        if (this.innerAudioContext) {
          this.innerAudioContext.destroy();
          this.innerAudioContext = null;
        }
        if (this.isRecording && this.recorderManager) {
          this.recorderManager.stop();
        }
      },
      getInterviewerStatus() {
        if (this.isAIThinking)
          return "思考中...";
        if (this.isSpeaking)
          return "说话中...";
        if (this.isProcessing)
          return "处理中...";
        return "等待回答";
      },
      // ==================== 导航 ====================
      goBack() {
        if (this.interviewStarted) {
          uni.showModal({
            title: "提示",
            content: "确定要结束面试吗？当前进度将不会保存。",
            success: (res) => {
              if (res.confirm) {
                this.interviewStarted = false;
                this.resetInterview();
                uni.navigateBack();
              }
            }
          });
        } else {
          uni.navigateBack();
        }
      },
      // ==================== 配置切换 ====================
      selectMethod(method) {
        this.currentMethod = method;
        this.resetForm();
        if (this.userInfo) {
          this.formData.userId = String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id);
        }
        if (method.includes("position")) {
          this.resetPositionSelection();
        }
      },
      // ==================== 文件上传 ====================
      chooseResumeFile() {
        if (typeof plus !== "undefined" && plus.io && plus.io.chooseFile) {
          plus.io.chooseFile({
            title: "选择PDF文件",
            filetypes: ["pdf"],
            success: (res) => {
              var _a;
              const filePath = res.path || res.uri || res.fullPath;
              if (!filePath)
                return;
              const fileName = ((_a = String(filePath).match(/[^/\\]+\.pdf$/i)) == null ? void 0 : _a[0]) || `file_${Date.now()}.pdf`;
              plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
                entry.getMetadata((metadata) => {
                  const fileSize = metadata.size;
                  if (fileSize > 10 * 1024 * 1024) {
                    uni.showToast({
                      title: "文件不能超过10MB",
                      icon: "none",
                      duration: 2e3
                    });
                    return;
                  }
                  const fs = uni.getFileSystemManager();
                  if (fs && fs.readFile) {
                    fs.readFile({
                      filePath,
                      encoding: "base64",
                      success: (readRes) => {
                        var _a2;
                        this.formData.resumePdf = {
                          name: fileName,
                          size: fileSize,
                          path: filePath,
                          base64: readRes.data
                        };
                        uni.showToast({
                          title: "文件选择成功",
                          icon: "success",
                          duration: 1500
                        });
                        formatAppLog("log", "at pages/AI/interview.vue:923", "PDF文件已选择:", {
                          name: fileName,
                          size: fileSize,
                          base64Length: (_a2 = readRes.data) == null ? void 0 : _a2.length
                        });
                      },
                      fail: (err) => {
                        formatAppLog("error", "at pages/AI/interview.vue:930", "读取文件失败:", err);
                        uni.showToast({
                          title: "文件读取失败",
                          icon: "none",
                          duration: 2e3
                        });
                      }
                    });
                  } else {
                    uni.showToast({
                      title: "文件系统不可用",
                      icon: "none",
                      duration: 2e3
                    });
                  }
                }, (err) => {
                  formatAppLog("error", "at pages/AI/interview.vue:946", "获取文件信息失败:", err);
                  uni.showToast({
                    title: "获取文件信息失败",
                    icon: "none",
                    duration: 2e3
                  });
                });
              }, (err) => {
                formatAppLog("error", "at pages/AI/interview.vue:954", "获取文件失败:", err);
                uni.showToast({
                  title: "文件访问失败",
                  icon: "none",
                  duration: 2e3
                });
              });
            },
            fail: (err) => {
              formatAppLog("log", "at pages/AI/interview.vue:963", "选择文件取消或失败:", err);
              if (!err.message || !err.message.includes("cancel")) {
                uni.showToast({
                  title: "文件选择失败: " + (err.message || "请重试"),
                  icon: "none",
                  duration: 2e3
                });
              }
            }
          });
        } else {
          uni.chooseFile({
            count: 1,
            type: "all",
            extension: ["pdf"],
            success: (res) => {
              var _a;
              const filePath = res.tempFilePaths[0];
              const tempFile = res.tempFiles && res.tempFiles[0];
              const fileName = ((_a = String(filePath).match(/[^/\\]+\.pdf$/i)) == null ? void 0 : _a[0]) || `file_${Date.now()}.pdf`;
              const fileSize = tempFile ? tempFile.size : 0;
              if (fileSize > 10 * 1024 * 1024) {
                uni.showToast({
                  title: "文件不能超过10MB",
                  icon: "none",
                  duration: 2e3
                });
                return;
              }
              const fs = uni.getFileSystemManager();
              if (fs && fs.readFile) {
                fs.readFile({
                  filePath,
                  encoding: "base64",
                  success: (readRes) => {
                    var _a2;
                    this.formData.resumePdf = {
                      name: fileName,
                      size: fileSize,
                      path: filePath,
                      base64: readRes.data
                    };
                    uni.showToast({
                      title: "文件选择成功",
                      icon: "success",
                      duration: 1500
                    });
                    formatAppLog("log", "at pages/AI/interview.vue:1014", "PDF文件已选择:", {
                      name: fileName,
                      size: fileSize,
                      base64Length: (_a2 = readRes.data) == null ? void 0 : _a2.length
                    });
                  },
                  fail: (err) => {
                    formatAppLog("error", "at pages/AI/interview.vue:1021", "读取文件失败:", err);
                    uni.showToast({
                      title: "文件读取失败",
                      icon: "none",
                      duration: 2e3
                    });
                  }
                });
              } else {
                uni.showToast({
                  title: "文件系统不可用",
                  icon: "none",
                  duration: 2e3
                });
              }
            },
            fail: (err) => {
              formatAppLog("log", "at pages/AI/interview.vue:1038", "选择文件取消或失败:", err);
              if (err.errMsg && !err.errMsg.includes("cancel")) {
                uni.showToast({
                  title: "文件选择失败: " + (err.errMsg || "请重试"),
                  icon: "none",
                  duration: 2e3
                });
              }
            }
          });
        }
      },
      // ==================== 表单验证 ====================
      validateForm() {
        const method = this.currentMethod;
        if (method.includes("resumeText") && !this.formData.resumeText.trim()) {
          uni.showToast({ title: "请输入简历文本", icon: "none" });
          return false;
        }
        if (method.includes("pdf") && !this.formData.resumePdf) {
          uni.showToast({ title: "请上传PDF简历", icon: "none" });
          return false;
        }
        if (method.includes("user")) {
          if (!this.formData.userId) {
            uni.showToast({ title: "正在获取...", icon: "none", duration: 3e3 });
            this.fetchUserInfo();
            return false;
          }
        }
        if (method.includes("position") && !method.includes("positionText")) {
          if (!this.selectedPositionId) {
            uni.showToast({ title: "请选择职位", icon: "none" });
            return false;
          }
        }
        if (method.includes("positionText") && !this.formData.positionText.trim()) {
          uni.showToast({ title: "请输入职位描述", icon: "none" });
          return false;
        }
        return true;
      },
      // ==================== 开始面试 ====================
      async startInterview() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i;
        if (!this.validateForm())
          return;
        this.isStarting = true;
        try {
          let res;
          switch (this.currentMethod) {
            case "resumeText+positionText":
              res = await interviewApi.startText(this.formData.resumeText, this.formData.positionText);
              break;
            case "pdf+positionText":
              if (!((_a = this.formData.resumePdf) == null ? void 0 : _a.base64))
                throw new Error("PDF文件未准备好");
              res = await interviewApi.startPdfText(this.formData.resumePdf.base64, this.formData.positionText);
              break;
            case "pdf+position":
              if (!((_b = this.formData.resumePdf) == null ? void 0 : _b.base64))
                throw new Error("PDF文件未准备好");
              if (!this.formData.positionName)
                throw new Error("请选择有效的职位");
              res = await interviewApi.startPdfJobName(this.formData.resumePdf.base64, this.formData.positionName);
              break;
            case "user+position":
              if (!this.formData.positionName)
                throw new Error("请选择有效的职位");
              res = await interviewApi.startUserIdJobName(this.formData.userId, this.formData.positionName);
              break;
            case "user+positionText":
              res = await interviewApi.startUserIdText(this.formData.userId, this.formData.positionText);
              break;
            case "resumeText+position":
              if (!this.formData.positionName)
                throw new Error("请选择有效的职位");
              res = await interviewApi.startTextJobName(this.formData.resumeText, this.formData.positionName);
              break;
            default:
              throw new Error("未知的面试方式");
          }
          formatAppLog("log", "at pages/AI/interview.vue:1121", "面试启动响应", res);
          if (res.code === 200 || ((_c = res.data) == null ? void 0 : _c.session_id)) {
            this.sessionId = res.session_id || ((_d = res.data) == null ? void 0 : _d.session_id);
            this.resumeSource = res.resume_source || ((_e = res.data) == null ? void 0 : _e.resume_source);
            this.jobSource = res.job_source || ((_f = res.data) == null ? void 0 : _f.job_source);
            this.currentQuestion = res.question_number || ((_g = res.data) == null ? void 0 : _g.question_number) || 1;
            const firstQuestion = res.question || ((_h = res.data) == null ? void 0 : _h.question);
            const audioUrl = res.audio_url || ((_i = res.data) == null ? void 0 : _i.audio_url);
            this.interviewStarted = true;
            this.addMessage("interviewer", firstQuestion);
            if (audioUrl) {
              this.currentAudioUrl = audioUrl;
              this.playAudio(audioUrl);
            }
            this.updateInterviewStage();
          } else {
            throw new Error(res.message || "启动面试失败");
          }
        } catch (error) {
          uni.showToast({ title: error.message || "启动面试失败，请重试", icon: "none", duration: 3e3 });
        } finally {
          this.isStarting = false;
        }
      },
      // ==================== 录音相关 ====================
      startRecording() {
        if (this.isProcessing || this.isAIThinking) {
          uni.showToast({ title: "请等待AI响应", icon: "none" });
          return;
        }
        if (this.recorderManager) {
          this.recorderManager.start({
            duration: 18e4,
            sampleRate: 16e3,
            numberOfChannels: 1,
            encodeBitRate: 96e3,
            format: "mp3"
          });
        } else {
          uni.showToast({ title: "录音功能不可用", icon: "none" });
        }
      },
      stopRecording() {
        if (!this.isRecording)
          return;
        if (this.recorderManager) {
          this.recorderManager.stop();
        }
      },
      startRecordingTimer() {
        this.recordingTime = 0;
        this.recordingTimer = setInterval(() => {
          this.recordingTime++;
          if (this.recordingTime >= 180)
            this.stopRecording();
        }, 1e3);
      },
      clearRecordingTimer() {
        if (this.recordingTimer) {
          clearInterval(this.recordingTimer);
          this.recordingTimer = null;
        }
      },
      submitTextAnswer() {
        if (this.tempAnswer.trim()) {
          formatAppLog("log", "at pages/AI/interview.vue:1193", "提交文本回答:", this.tempAnswer.trim());
          this.addMessage("candidate", this.tempAnswer.trim());
          this.sendAnswer(this.tempAnswer.trim());
          this.tempAnswer = "";
        } else {
          uni.showToast({ title: "请输入回答内容", icon: "none" });
        }
      },
      async processAudio(filePath) {
        if (!this.sessionId) {
          uni.showToast({ title: "会话异常", icon: "none" });
          return;
        }
        this.isProcessing = true;
        try {
          if (!interviewApi.transcribe) {
            throw new Error("语音识别功能不可用");
          }
          const uploadRes = await interviewApi.transcribe(this.sessionId, filePath);
          let transcribeData;
          if (typeof uploadRes.data === "string") {
            transcribeData = JSON.parse(uploadRes.data);
          } else {
            transcribeData = uploadRes.data;
          }
          if (transcribeData.code === 200 && transcribeData.text) {
            const userText = transcribeData.text;
            this.addMessage("candidate", userText);
            await this.sendAnswer(userText);
          } else {
            throw new Error(transcribeData.message || "语音识别失败");
          }
        } catch (error) {
          formatAppLog("error", "at pages/AI/interview.vue:1231", "处理录音失败", error);
          uni.showToast({ title: error.message || "语音识别失败，请使用文本输入", icon: "none", duration: 3e3 });
        } finally {
          this.isProcessing = false;
        }
      },
      // ==================== 对话交互 ====================
      async sendAnswer(userText, endInterview = false) {
        var _a, _b;
        if (!this.sessionId)
          return;
        this.isAIThinking = true;
        try {
          const res = await interviewApi.answer(this.sessionId, userText, endInterview);
          formatAppLog("log", "at pages/AI/interview.vue:1244", "AI响应", res);
          if (res.code === 200 || res.data) {
            const data = res.data || res;
            if (data.is_ended || data.stage === "ended") {
              this.finishInterview();
              return;
            }
            this.currentQuestion = data.question_number || this.currentQuestion + 1;
            const question = data.question || ((_a = data.data) == null ? void 0 : _a.question);
            this.addMessage("interviewer", question);
            const audioUrl = data.audio_url || ((_b = data.data) == null ? void 0 : _b.audio_url);
            if (audioUrl) {
              this.currentAudioUrl = audioUrl;
              this.playAudio(audioUrl);
            }
            this.currentStage = data.stage || this.currentStage;
            this.updateInterviewStage();
          } else {
            throw new Error(res.message || "获取回复失败");
          }
        } catch (error) {
          formatAppLog("error", "at pages/AI/interview.vue:1265", "发送回答失败", error);
          uni.showToast({ title: error.message || "获取回复失败", icon: "none" });
        } finally {
          this.isAIThinking = false;
        }
      },
      // ==================== 音频播放 ====================
      playAudio(url) {
        if (!this.innerAudioContext) {
          formatAppLog("warn", "at pages/AI/interview.vue:1275", "音频上下文未初始化");
          return;
        }
        if (!url) {
          formatAppLog("warn", "at pages/AI/interview.vue:1280", "音频URL为空");
          return;
        }
        this.isSpeaking = true;
        this.voiceWaveActive = true;
        const fullUrl = getStaticUrl(url);
        formatAppLog("log", "at pages/AI/interview.vue:1288", "播放音频，完整URL:", fullUrl);
        this.innerAudioContext.stop();
        this.innerAudioContext.onError((err) => {
          formatAppLog("error", "at pages/AI/interview.vue:1301", "音频播放错误", err);
          this.isSpeaking = false;
          this.voiceWaveActive = false;
          uni.showToast({ title: "语音加载失败，请阅读文字", icon: "none", duration: 3e3 });
        });
        this.innerAudioContext.onEnded(() => {
          this.isSpeaking = false;
          this.voiceWaveActive = false;
        });
        this.innerAudioContext.src = fullUrl;
        setTimeout(() => {
          this.innerAudioContext.play();
        }, 100);
      },
      replayQuestion() {
        if (this.currentAudioUrl)
          this.playAudio(this.currentAudioUrl);
      },
      addMessage(sender, content) {
        this.interviewMessages.push({ sender, content, timestamp: Date.now() });
        this.scrollToBottom();
      },
      updateInterviewStage() {
        const stages = ["自我介绍", "技术能力", "项目经验", "职业规划", "综合能力"];
        const stageIndex = Math.floor((this.currentQuestion - 1) / (this.totalQuestions / stages.length));
        this.currentStage = stages[stageIndex] || "综合评估";
      },
      scrollToBottom() {
        this.$nextTick(() => {
          this.chatScrollTop = this.interviewMessages.length * 1e3;
        });
      },
      formatTime(timestamp) {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      },
      // ==================== 面试结束与报告 ====================
      confirmEndInterview() {
        uni.showModal({
          title: "结束面试",
          content: "确定要结束面试吗？将生成面试报告。",
          success: (res) => {
            if (res.confirm)
              this.endInterview();
          }
        });
      },
      async endInterview() {
        if (!this.sessionId) {
          this.finishInterview();
          return;
        }
        try {
          await this.sendAnswer("面试结束", true);
        } catch (error) {
          formatAppLog("log", "at pages/AI/interview.vue:1362", "发送结束信号失败，直接获取报告", error);
        }
        this.finishInterview();
      },
      async finishInterview() {
        if (!this.sessionId) {
          this.generateMockReport();
          this.showReport = true;
          this.$nextTick(() => {
            setTimeout(() => {
              this.drawRadarChart();
            }, 300);
          });
          return;
        }
        uni.showLoading({ title: "生成报告中..." });
        try {
          const res = await interviewApi.getReport(this.sessionId);
          formatAppLog("log", "at pages/AI/interview.vue:1381", "面试报告", res);
          if (res.code === 200 || res.data) {
            this.reportData = res.data || res;
            this.parseReportData(this.reportData);
          } else {
            this.generateMockReport();
          }
          this.showReport = true;
          this.$nextTick(() => {
            setTimeout(() => {
              this.drawRadarChart();
            }, 300);
          });
        } catch (error) {
          formatAppLog("error", "at pages/AI/interview.vue:1395", "获取报告失败", error);
          this.generateMockReport();
          this.showReport = true;
          this.$nextTick(() => {
            setTimeout(() => {
              this.drawRadarChart();
            }, 300);
          });
        } finally {
          uni.hideLoading();
        }
      },
      parseReportData(data) {
        this.overallScore = data.overall_score || data.score || 85;
        this.evaluationItems = [
          { title: "技术能力", content: data.tech_evaluation || "基础扎实，能够清晰地解释技术概念。" },
          { title: "沟通能力", content: data.comm_evaluation || "表达清晰，逻辑性强。" },
          { title: "项目经验", content: data.project_evaluation || "项目经历丰富，能够详细描述项目细节。" }
        ];
        this.suggestions = data.suggestions || [
          "建议在技术深度方面继续加强学习",
          "可以增加更多实际项目案例的积累"
        ];
      },
      generateMockReport() {
        this.overallScore = Math.floor(Math.random() * 20) + 75;
        this.evaluationItems = [
          { title: "技术能力", content: "基础扎实，能够清晰地解释技术概念，但在某些深度问题上略显不足。" },
          { title: "沟通能力", content: "表达清晰，逻辑性强，能够很好地理解问题并给出合适的回答。" },
          { title: "项目经验", content: "项目经历丰富，能够详细描述项目细节和个人贡献。" }
        ];
        this.suggestions = [
          "建议在技术深度方面继续加强学习",
          "可以增加更多实际项目案例的积累",
          "面试时保持更好的眼神交流",
          "适当准备一些行为面试问题的回答"
        ];
      },
      toggleTips() {
        this.tipsCollapsed = !this.tipsCollapsed;
      },
      closeReport() {
        this.showReport = false;
      },
      restartInterview() {
        this.showReport = false;
        this.resetInterview();
        this.interviewStarted = false;
      },
      async exportReport() {
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>面试报告</title>
          <style>
            body { font-family: '微软雅黑', '宋体', Arial, sans-serif; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #007aff; padding-bottom: 10px; }
            .score { font-size: 48px; color: #007aff; font-weight: bold; margin: 20px 0; }
            .section { margin: 30px 0; }
            .section-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 15px; }
            .item { margin-bottom: 20px; }
            .item-title { font-size: 18px; font-weight: bold; color: #007aff; }
            .item-content { margin-top: 5px; line-height: 1.6; }
            .suggestion { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>AI 模拟面试报告</h1>
          <div class="section">
            <div class="section-title">综合评分</div>
            <div class="score">${this.overallScore} / 100</div>
          </div>
          <div class="section">
            <div class="section-title">详细评价</div>
            ${this.evaluationItems.map((item) => `
              <div class="item">
                <div class="item-title">${item.title}</div>
                <div class="item-content">${item.content}</div>
              </div>
            `).join("")}
          </div>
          <div class="section">
            <div class="section-title">改进建议</div>
            ${this.suggestions.map((s) => `<div class="suggestion">• ${s}</div>`).join("")}
          </div>
          <p style="margin-top: 40px; color: #999; font-size: 12px;">生成时间：${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
        </body>
        </html>
      `;
        const fs = uni.getFileSystemManager();
        const filePath = `${uni.env.USER_DATA_PATH}/report_${Date.now()}.doc`;
        if (fs && fs.writeFile) {
          fs.writeFile({
            filePath,
            data: htmlContent,
            encoding: "utf8",
            success: () => {
              uni.openDocument({
                filePath,
                success: () => {
                  uni.showToast({ title: "报告已保存并打开", icon: "success" });
                },
                fail: (err) => {
                  formatAppLog("error", "at pages/AI/interview.vue:1509", "打开文件失败", err);
                  uni.showToast({ title: "报告已保存，但打开失败", icon: "none" });
                }
              });
            },
            fail: (err) => {
              formatAppLog("error", "at pages/AI/interview.vue:1515", "写入文件失败", err);
              uni.showToast({ title: "导出失败", icon: "none" });
            }
          });
        }
      },
      drawRadarChart() {
        const query = uni.createSelectorQuery().in(this);
        query.select(".radar-canvas").boundingClientRect((rect) => {
          if (!rect || rect.width === 0 || rect.height === 0) {
            setTimeout(() => this.drawRadarChart(), 100);
            return;
          }
          const canvasWidth = rect.width;
          const canvasHeight = rect.height;
          const ctx = uni.createCanvasContext("radarChart", this);
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          const centerX = canvasWidth / 2;
          const centerY = canvasHeight / 2;
          const radius = Math.min(canvasWidth, canvasHeight) * 0.35;
          const points = 6;
          const angleStep = Math.PI * 2 / points;
          this.drawRadarGrid(ctx, centerX, centerY, radius, points, angleStep);
          const score = this.overallScore / 100;
          const data = [0.8 * score, 0.85 * score, 0.75 * score, 0.9 * score, 0.8 * score, 0.85 * score];
          this.drawRadarData(ctx, centerX, centerY, radius, points, angleStep, data);
          const labels = ["技术", "沟通", "经验", "态度", "潜力", "稳定"];
          this.drawRadarLabels(ctx, centerX, centerY, radius, points, angleStep, labels);
          ctx.draw();
        }).exec();
      },
      drawRadarGrid(ctx, centerX, centerY, radius, points, angleStep) {
        ctx.setStrokeStyle("#e0e0e0");
        ctx.setLineWidth(1);
        for (let i = 1; i <= 5; i++) {
          ctx.beginPath();
          const r = radius * i / 5;
          for (let j = 0; j <= points; j++) {
            const angle = j * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (j === 0)
              ctx.moveTo(x, y);
            else
              ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }
        for (let i = 0; i < points; i++) {
          const angle = i * angleStep - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
          ctx.stroke();
        }
      },
      drawRadarData(ctx, centerX, centerY, radius, points, angleStep, data) {
        ctx.setFillStyle("rgba(0, 122, 255, 0.3)");
        ctx.setStrokeStyle("#007aff");
        ctx.setLineWidth(2);
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const value = data[i % points];
          const x = centerX + Math.cos(angle) * (radius * value);
          const y = centerY + Math.sin(angle) * (radius * value);
          if (i === 0)
            ctx.moveTo(x, y);
          else
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.setFillStyle("#007aff");
        for (let i = 0; i < points; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const value = data[i];
          const x = centerX + Math.cos(angle) * (radius * value);
          const y = centerY + Math.sin(angle) * (radius * value);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      },
      drawRadarLabels(ctx, centerX, centerY, radius, points, angleStep, labels) {
        ctx.setFontSize(12);
        ctx.setFillStyle("#666");
        const labelRadius = radius + 18;
        for (let i = 0; i < points; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const x = centerX + Math.cos(angle) * labelRadius;
          const y = centerY + Math.sin(angle) * labelRadius;
          ctx.fillText(labels[i], x - 12, y + 6);
        }
      },
      // ==================== 重置 ====================
      resetInterview() {
        this.sessionId = null;
        this.currentQuestion = 1;
        this.interviewMessages = [];
        this.isRecording = false;
        this.isSpeaking = false;
        this.isAIThinking = false;
        this.isProcessing = false;
        this.voiceWaveActive = false;
        this.recordingTime = 0;
        this.currentAudioUrl = "";
        this.audioFilePath = "";
        this.reportData = null;
        this.showReport = false;
        this.tempAnswer = "";
        this.clearRecordingTimer();
        if (this.innerAudioContext)
          this.innerAudioContext.stop();
      },
      resetForm() {
        this.formData = {
          resumeText: "",
          resumePdf: null,
          userId: this.userInfo ? String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id) : "",
          positionId: "",
          positionText: "",
          positionName: ""
        };
        this.resetPositionSelection();
      }
    }
  };
  const __injectCSSVars__ = () => {
    vue.useCssVars((_ctx) => ({
      "c7f67547-overallScore": _ctx.overallScore
    }));
  };
  const __setup__ = _sfc_main$7.setup;
  _sfc_main$7.setup = __setup__ ? (props, ctx) => {
    __injectCSSVars__();
    return __setup__(props, ctx);
  } : __injectCSSVars__;
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "interview-container",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "header",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "header-content" }, [
              vue.createElementVNode("view", { class: "nav-bar-left" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: "nav-back-icon",
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  "←",
                  4
                  /* STYLE */
                )
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: "page-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "AI模拟面试",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "header-right" })
            ])
          ],
          4
          /* STYLE */
        ),
        !$data.interviewStarted ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "config-section"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "config-card",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "config-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "面试配置",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "method-tabs" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.interviewMethods, (method, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      class: vue.normalizeClass(["tab-item", { active: $data.currentMethod === method.value }]),
                      onClick: ($event) => $options.selectMethod(method.value),
                      style: vue.normalizeStyle({ background: $data.currentMethod === method.value ? "linear-gradient(120deg, #4facfe, #00f2fe)" : $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)", color: $data.currentMethod === method.value ? "#ffffff" : $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(method.label),
                        1
                        /* TEXT */
                      )
                    ], 14, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("view", { class: "form-fields" }, [
                $data.currentMethod.includes("resumeText") ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "form-group"
                }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "form-label",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "简历文本",
                    4
                    /* STYLE */
                  ),
                  vue.withDirectives(vue.createElementVNode(
                    "textarea",
                    {
                      class: "form-textarea",
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.formData.resumeText = $event),
                      placeholder: "请粘贴您的简历内容",
                      "placeholder-style": "color: #999",
                      style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#fff", borderColor: $data.isDarkMode ? "#404040" : "#eee", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    null,
                    4
                    /* STYLE */
                  ), [
                    [vue.vModelText, $data.formData.resumeText]
                  ])
                ])) : vue.createCommentVNode("v-if", true),
                $data.currentMethod.includes("pdf") ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "form-group"
                }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "form-label",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "PDF简历",
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "file-upload-area",
                      onClick: _cache[2] || (_cache[2] = (...args) => $options.chooseResumeFile && $options.chooseResumeFile(...args)),
                      style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)", borderColor: $data.isDarkMode ? "#404040" : "#eee" })
                    },
                    [
                      !$data.formData.resumePdf ? (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 0,
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                        },
                        "点击上传PDF简历",
                        4
                        /* STYLE */
                      )) : (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 1,
                          class: "file-name",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                        },
                        vue.toDisplayString($data.formData.resumePdf.name),
                        5
                        /* TEXT, STYLE */
                      ))
                    ],
                    4
                    /* STYLE */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                $data.currentMethod.includes("position") && !$data.currentMethod.includes("positionText") ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  class: "form-group"
                }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "form-label",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "职位选择",
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "cascade-selector",
                      onClick: _cache[3] || (_cache[3] = (...args) => $options.openCascadePicker && $options.openCascadePicker(...args)),
                      style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#fff", borderColor: $data.isDarkMode ? "#404040" : "#eee" })
                    },
                    [
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["selector-content", { "placeholder": !$data.selectedPositionId }]),
                          style: vue.normalizeStyle({ color: !$data.selectedPositionId ? "#999" : $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                        },
                        [
                          $data.selectedPositionId ? (vue.openBlock(), vue.createElementBlock(
                            "text",
                            { key: 0 },
                            vue.toDisplayString($data.selectedCategoryName) + " - " + vue.toDisplayString($data.selectedPositionName),
                            1
                            /* TEXT */
                          )) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "请选择职位"))
                        ],
                        6
                        /* CLASS, STYLE */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: "arrow-icon",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                        },
                        "›",
                        4
                        /* STYLE */
                      )
                    ],
                    4
                    /* STYLE */
                  )
                ])) : vue.createCommentVNode("v-if", true),
                $data.currentMethod.includes("positionText") ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 3,
                  class: "form-group"
                }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "form-label",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "职位描述",
                    4
                    /* STYLE */
                  ),
                  vue.withDirectives(vue.createElementVNode(
                    "textarea",
                    {
                      class: "form-textarea",
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.formData.positionText = $event),
                      placeholder: "请输入职位描述",
                      "placeholder-style": "color: #999",
                      style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#fff", borderColor: $data.isDarkMode ? "#404040" : "#eee", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    null,
                    4
                    /* STYLE */
                  ), [
                    [vue.vModelText, $data.formData.positionText]
                  ])
                ])) : vue.createCommentVNode("v-if", true)
              ]),
              vue.createElementVNode("button", {
                class: "start-btn",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.startInterview && $options.startInterview(...args)),
                loading: $data.isStarting,
                style: vue.normalizeStyle({ background: "linear-gradient(120deg, #4facfe, #00f2fe)", color: "#ffffff" })
              }, vue.toDisplayString($data.isStarting ? "启动中..." : "开始面试"), 13, ["loading"])
            ],
            4
            /* STYLE */
          )
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "interview-area"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "progress-section",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "progress-text",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "面试进度 " + vue.toDisplayString($data.currentQuestion) + "/" + vue.toDisplayString($data.totalQuestions),
                5
                /* TEXT, STYLE */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: "progress-bar",
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "#eee" })
                },
                [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "progress-fill",
                      style: vue.normalizeStyle({ width: $options.progressPercent + "%", background: "linear-gradient(120deg, #4facfe, #00f2fe)" })
                    },
                    null,
                    4
                    /* STYLE */
                  )
                ],
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "text",
                {
                  class: "stage-text",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                vue.toDisplayString($data.currentStage),
                5
                /* TEXT, STYLE */
              )
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "interviewer-status-bar",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode("view", { class: "status-left" }, [
                vue.createElementVNode("view", { class: "avatar-small" }, [
                  vue.createElementVNode("view", { class: "avatar-gradient" }, [
                    vue.createElementVNode("text", { class: "avatar-emoji" }, "🤖")
                  ])
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "interviewer-name",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  "AI面试官",
                  4
                  /* STYLE */
                )
              ]),
              vue.createElementVNode("view", { class: "status-right" }, [
                $data.isSpeaking ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "voice-wave-mini"
                }, [
                  (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(4, (i) => {
                      return vue.createElementVNode(
                        "view",
                        {
                          key: i,
                          class: vue.normalizeClass(["wave-bar-mini", { active: $data.voiceWaveActive }]),
                          style: vue.normalizeStyle({ animationDelay: i * 0.1 + "s" })
                        },
                        null,
                        6
                        /* CLASS, STYLE */
                      );
                    }),
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode(
                  "text",
                  {
                    class: "interviewer-status-text",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  vue.toDisplayString($options.getInterviewerStatus()),
                  5
                  /* TEXT, STYLE */
                )
              ])
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode("view", { class: "chat-section-main" }, [
            vue.createElementVNode("scroll-view", {
              class: "chat-messages",
              "scroll-y": "",
              "scroll-top": $data.chatScrollTop,
              "scroll-with-animation": ""
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.interviewMessages, (message, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: index,
                      class: vue.normalizeClass(["chat-message", message.sender])
                    },
                    [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "message-bubble",
                          style: vue.normalizeStyle(message.sender === "user" ? { background: "linear-gradient(120deg, #4facfe, #00f2fe)", color: "#ffffff" } : { background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", color: $data.isDarkMode ? "#ffffff" : "#1E1E1E", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                        },
                        [
                          vue.createElementVNode(
                            "text",
                            null,
                            vue.toDisplayString(message.content),
                            1
                            /* TEXT */
                          )
                        ],
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: "message-time",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#999" })
                        },
                        vue.toDisplayString($options.formatTime(message.timestamp)),
                        5
                        /* TEXT, STYLE */
                      )
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $data.isAIThinking ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "thinking-indicator"
              }, [
                vue.createElementVNode("view", { class: "thinking-dots" }, [
                  (vue.openBlock(), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList(3, (i) => {
                      return vue.createElementVNode(
                        "view",
                        {
                          key: i,
                          class: "dot",
                          style: vue.normalizeStyle({ animationDelay: i * 0.2 + "s" })
                        },
                        null,
                        4
                        /* STYLE */
                      );
                    }),
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode("text", null, "AI正在思考中...")
              ])) : vue.createCommentVNode("v-if", true)
            ], 8, ["scroll-top"])
          ]),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["bottom-panel", { "h5-bottom-panel": $data.isH5 }])
            },
            [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["tips-card", { collapsed: $data.tipsCollapsed }])
                },
                [
                  vue.createElementVNode("view", {
                    class: "tips-header",
                    onClick: _cache[6] || (_cache[6] = (...args) => $options.toggleTips && $options.toggleTips(...args))
                  }, [
                    vue.createElementVNode("text", { class: "tips-title" }, "面试技巧"),
                    vue.createElementVNode(
                      "image",
                      {
                        class: vue.normalizeClass(["collapse-icon", { rotated: $data.tipsCollapsed }]),
                        src: _imports_0,
                        mode: "aspectFit"
                      },
                      null,
                      2
                      /* CLASS */
                    )
                  ]),
                  !$data.tipsCollapsed ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "tips-content"
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.currentTips, (tip, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: index,
                          class: "tip-item"
                        }, [
                          vue.createElementVNode(
                            "text",
                            null,
                            "• " + vue.toDisplayString(tip),
                            1
                            /* TEXT */
                          )
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])) : vue.createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              ),
              $data.isH5 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "h5-control-area"
              }, [
                vue.createElementVNode(
                  "div",
                  {
                    class: vue.normalizeClass(["h5-ctrl-btn replay-btn", { disabled: !$data.currentAudioUrl }]),
                    onClick: _cache[7] || (_cache[7] = (...args) => $options.replayQuestion && $options.replayQuestion(...args))
                  },
                  [
                    vue.createElementVNode("span", { class: "ctrl-text" }, "重听")
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode("div", { class: "h5-text-input-wrapper" }, [
                  vue.withDirectives(vue.createElementVNode("input", {
                    type: "text",
                    class: "h5-text-input",
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.tempAnswer = $event),
                    placeholder: "输入你的回答...",
                    disabled: $data.isProcessing || $data.isAIThinking,
                    maxlength: "500",
                    onKeyup: _cache[9] || (_cache[9] = vue.withKeys((...args) => $options.submitTextAnswer && $options.submitTextAnswer(...args), ["enter"]))
                  }, null, 40, ["disabled"]), [
                    [vue.vModelText, $data.tempAnswer]
                  ]),
                  vue.createElementVNode(
                    "div",
                    {
                      class: vue.normalizeClass(["h5-send-btn", { disabled: !$data.tempAnswer.trim() || $data.isProcessing || $data.isAIThinking }]),
                      onClick: _cache[10] || (_cache[10] = (...args) => $options.submitTextAnswer && $options.submitTextAnswer(...args))
                    },
                    [
                      vue.createElementVNode("span", { class: "send-text" }, "发送")
                    ],
                    2
                    /* CLASS */
                  )
                ]),
                vue.createElementVNode("div", {
                  class: "h5-ctrl-btn end-btn",
                  onClick: _cache[11] || (_cache[11] = (...args) => $options.confirmEndInterview && $options.confirmEndInterview(...args))
                }, [
                  vue.createElementVNode("span", { class: "ctrl-text" }, "结束")
                ])
              ])) : (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "control-buttons"
              }, [
                vue.createElementVNode("button", {
                  class: "ctrl-btn replay-btn",
                  onClick: _cache[12] || (_cache[12] = (...args) => $options.replayQuestion && $options.replayQuestion(...args)),
                  disabled: !$data.currentAudioUrl
                }, [
                  vue.createElementVNode("text", null, "重听")
                ], 8, ["disabled"]),
                vue.createElementVNode("view", { class: "voice-record-wrapper" }, [
                  vue.createElementVNode("button", {
                    class: vue.normalizeClass(["voice-main-btn", { recording: $data.isRecording, disabled: $data.isProcessing }]),
                    onTouchstart: _cache[13] || (_cache[13] = (...args) => $options.startRecording && $options.startRecording(...args)),
                    onTouchend: _cache[14] || (_cache[14] = (...args) => $options.stopRecording && $options.stopRecording(...args)),
                    onTouchcancel: _cache[15] || (_cache[15] = (...args) => $options.stopRecording && $options.stopRecording(...args)),
                    disabled: $data.isProcessing
                  }, [
                    vue.createElementVNode("image", {
                      src: $data.isRecording ? "/static/ai/recording.png" : "/static/ai/mic.png",
                      mode: "aspectFit"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.isRecording ? "录音中" : $data.isProcessing ? "处理中" : "按住  说话"),
                      1
                      /* TEXT */
                    )
                  ], 42, ["disabled"]),
                  $data.isRecording ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "recording-tip"
                  }, [
                    vue.createElementVNode("view", { class: "pulse-ring-mini" }),
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString($data.recordingTime) + "s",
                      1
                      /* TEXT */
                    )
                  ])) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("button", {
                  class: "ctrl-btn end-btn",
                  onClick: _cache[16] || (_cache[16] = (...args) => $options.confirmEndInterview && $options.confirmEndInterview(...args))
                }, [
                  vue.createElementVNode("text", null, "结束")
                ])
              ]))
            ],
            2
            /* CLASS */
          )
        ])),
        $data.showReport ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "report-overlay",
          onClick: _cache[21] || (_cache[21] = (...args) => $options.closeReport && $options.closeReport(...args))
        }, [
          vue.createElementVNode("view", {
            class: "report-modal",
            onClick: _cache[20] || (_cache[20] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("view", { class: "report-header" }, [
              vue.createElementVNode("text", { class: "report-title" }, "面试报告"),
              vue.createElementVNode("image", {
                class: "close-report",
                src: _imports_1,
                onClick: _cache[17] || (_cache[17] = (...args) => $options.closeReport && $options.closeReport(...args)),
                mode: "aspectFit"
              })
            ]),
            vue.createElementVNode("view", { class: "report-content-wrapper" }, [
              vue.createElementVNode("view", { class: "report-content" }, [
                vue.createElementVNode("view", { class: "score-section" }, [
                  vue.createElementVNode("text", { class: "score-title" }, "综合评分"),
                  vue.createElementVNode("view", { class: "score-circle" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "score-number" },
                      vue.toDisplayString($data.overallScore),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "score-total" }, "/100")
                  ])
                ]),
                vue.createElementVNode("view", { class: "radar-section" }, [
                  vue.createElementVNode("text", { class: "section-title" }, "能力雷达图"),
                  vue.createElementVNode("view", { class: "radar-chart" }, [
                    vue.createElementVNode("canvas", {
                      "canvas-id": "radarChart",
                      class: "radar-canvas"
                    })
                  ])
                ]),
                vue.createElementVNode("view", { class: "evaluation-section" }, [
                  vue.createElementVNode("text", { class: "section-title" }, "详细评价"),
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.evaluationItems, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "evaluation-item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "item-title" },
                          vue.toDisplayString(item.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "item-content" },
                          vue.toDisplayString(item.content),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                vue.createElementVNode("view", { class: "suggestions-section" }, [
                  vue.createElementVNode("text", { class: "section-title" }, "改进建议"),
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.suggestions, (suggestion, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "suggestion-item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          "• " + vue.toDisplayString(suggestion),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ]),
            vue.createElementVNode("view", { class: "report-footer" }, [
              vue.createElementVNode("button", {
                class: "report-btn restart-btn",
                onClick: _cache[18] || (_cache[18] = (...args) => $options.restartInterview && $options.restartInterview(...args))
              }, "重新面试"),
              vue.createElementVNode("button", {
                class: "report-btn export-btn",
                onClick: _cache[19] || (_cache[19] = (...args) => $options.exportReport && $options.exportReport(...args))
              }, "导出报告")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true),
        $data.showCascadePicker ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 3,
          class: "cascade-overlay",
          onClick: _cache[24] || (_cache[24] = (...args) => $options.closeCascadePicker && $options.closeCascadePicker(...args))
        }, [
          vue.createElementVNode("view", {
            class: "cascade-modal",
            onClick: _cache[23] || (_cache[23] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("view", { class: "cascade-header" }, [
              vue.createElementVNode("text", { class: "cascade-title" }, "选择职位"),
              vue.createElementVNode("text", {
                class: "cascade-close",
                onClick: _cache[22] || (_cache[22] = (...args) => $options.confirmCascadeSelection && $options.confirmCascadeSelection(...args))
              }, "确定")
            ]),
            vue.createElementVNode("view", { class: "cascade-body" }, [
              vue.createElementVNode("scroll-view", {
                class: "category-list",
                "scroll-y": ""
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.mainCategories, (category) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: category.id,
                      class: vue.normalizeClass(["category-item", $data.selectedCategoryId === category.id ? "active" : ""]),
                      onClick: ($event) => $options.selectCategory(category)
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(category.name),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("scroll-view", {
                class: "position-list",
                "scroll-y": ""
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.currentPositions, (position) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: position.id,
                      class: vue.normalizeClass(["position-item", $data.selectedPositionId === position.id ? "active" : ""]),
                      onClick: ($event) => $options.selectPosition(position)
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(position.name),
                        1
                        /* TEXT */
                      ),
                      $data.selectedPositionId === position.id ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        class: "check-icon"
                      }, "✓")) : vue.createCommentVNode("v-if", true)
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const PagesAIInterview = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-c7f67547"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/AI/interview.vue"]]);
  const forumApi = {
    // 获取所有一级评论
    getAllFirstComments: () => {
      return requestWithRetry({
        url: "/forum/forum_all_first_talk",
        method: "GET"
      });
    },
    // 发表评论
    addComment: (commentData) => {
      return requestWithRetry({
        url: "/forum/forums_add",
        method: "POST",
        data: commentData
      });
    },
    // 删除评论
    deleteComment: (commentId) => {
      return requestWithRetry({
        url: "/forum/forum_delete",
        method: "POST",
        data: { id: commentId }
      });
    },
    // 获取评论详情
    getCommentDetail: async (commentId) => {
      try {
        const allComments = await requestWithRetry({
          url: "/forum/forum_all_first_talk",
          method: "GET"
        });
        return allComments.filter((comment) => comment.id == commentId);
      } catch (error) {
        formatAppLog("error", "at common/api/forum.js:41", "获取评论详情失败:", error);
        return [];
      }
    },
    // 添加回复
    addReply: (replyData) => {
      return requestWithRetry({
        url: "/forum/forums_add",
        method: "POST",
        data: replyData
      });
    },
    // 获取评论回复列表
    getCommentReplies: (parentId) => {
      return requestWithRetry({
        url: "/forum/forums_back",
        method: "POST",
        data: { parent_id: parentId }
      });
    }
  };
  const _sfc_main$6 = {
    mixins: [themeMixin],
    data() {
      return {
        keyword: "",
        currentCategory: "all",
        posts: [],
        allPosts: [],
        loading: false,
        hasMore: true,
        page: 1,
        pageSize: 20,
        isRefreshing: false,
        showQuickMenu: false,
        loadMoreTimer: null,
        isLoadingReplies: false,
        debugMode: false,
        // 手动控制调试模式
        categories: [
          { id: "100", name: "技术开发类", parent_id: null, level: 1, next_category_id: 100 },
          { id: "101", name: "前端开发", parent_id: 100, level: 2, next_category_id: 101 },
          { id: "102", name: "后端开发", parent_id: 100, level: 2, next_category_id: 102 },
          { id: "103", name: "移动端开发", parent_id: 100, level: 2, next_category_id: 103 },
          { id: "104", name: "数据与AI", parent_id: 100, level: 2, next_category_id: 104 },
          { id: "105", name: "运维与测试", parent_id: 100, level: 2, next_category_id: 105 },
          { id: "106", name: "产品设计", parent_id: 100, level: 2, next_category_id: 106 },
          { id: "107", name: "网络安全", parent_id: 100, level: 2, next_category_id: 107 },
          { id: "108", name: "嵌入式开发", parent_id: 100, level: 2, next_category_id: 108 },
          { id: "200", name: "产品与设计类", parent_id: null, level: 1, next_category_id: 200 },
          { id: "300", name: "技术管理类", parent_id: null, level: 1, next_category_id: 300 }
        ],
        showCategoryTabs: false,
        selectedSubCategories: [],
        categoryMap: {
          "101": "前端",
          "102": "后端",
          "103": "移动端",
          "104": "数据与AI",
          "105": "运维与测试",
          "106": "产品设计",
          "107": "网络安全",
          "108": "嵌入式",
          "200": "产品设计",
          "300": "技术管理"
        }
      };
    },
    computed: {
      // 计算筛选后的帖子
      filteredPosts() {
        let result = [...this.allPosts];
        if (this.currentCategory !== "all") {
          const currentCategoryNum = Number(this.currentCategory);
          const isTopLevelCategory = this.categories.some((c) => Number(c.id) === currentCategoryNum && c.level === 1);
          if (isTopLevelCategory) {
            let targetCategoryIds = [];
            if ([200, 300].includes(currentCategoryNum)) {
              targetCategoryIds = [currentCategoryNum];
            } else {
              targetCategoryIds = this.categories.filter((c) => c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum)).map((c) => parseInt(c.next_category_id));
            }
            result = result.filter((post) => {
              if (!post || post.category_id === null) {
                return false;
              }
              return targetCategoryIds.includes(post.category_id);
            });
            if (this.selectedSubCategories.length > 0) {
              if ([200, 300].includes(currentCategoryNum)) {
                result = result.filter((post) => {
                  if (!post || post.category_id === null) {
                    return false;
                  }
                  return post.category_id === currentCategoryNum;
                });
              } else {
                result = result.filter((post) => {
                  if (!post || post.category_id === null) {
                    return false;
                  }
                  return this.selectedSubCategories.includes(post.category_id);
                });
              }
            }
          } else {
            const currentCategoryObj = this.categories.find((c) => c.id === this.currentCategory);
            if (currentCategoryObj) {
              const targetCategoryId = currentCategoryObj.next_category_id;
              result = result.filter((post) => {
                if (!post || post.category_id === null) {
                  return false;
                }
                return post.category_id === targetCategoryId;
              });
            }
          }
        }
        if (this.keyword && this.keyword.trim() !== "") {
          const keywordLower = this.keyword.toLowerCase().trim();
          result = result.filter((post) => {
            const titleMatch = post.title && post.title.toLowerCase().includes(keywordLower);
            const contentMatch = post.content && post.content.toLowerCase().includes(keywordLower);
            return titleMatch || contentMatch;
          });
        }
        return result;
      },
      // 计算子分类列表
      subCategoryList() {
        if (this.currentCategory === "all")
          return [];
        const currentCategoryNum = Number(this.currentCategory);
        const isTopLevelCategory = this.categories.some((c) => Number(c.id) === currentCategoryNum && c.level === 1);
        if (isTopLevelCategory && ![200, 300].includes(currentCategoryNum)) {
          return this.categories.filter((c) => {
            return c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum);
          });
        }
        return [];
      }
    },
    onLoad() {
      this.initDefaultCategory();
    },
    onShow() {
      this.loadPosts(true);
    },
    onUnload() {
      if (this.loadMoreTimer) {
        clearTimeout(this.loadMoreTimer);
      }
    },
    methods: {
      // 切换调试模式 - 长按标题5次开启/关闭
      toggleDebugMode() {
        this.debugMode = !this.debugMode;
        uni.showToast({
          title: this.debugMode ? "调试模式已开启" : "调试模式已关闭",
          icon: "none",
          duration: 2e3
        });
      },
      // 解码HTML实体
      decodeHtmlEntities(text) {
        const entities = {
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": '"',
          "&#39;": "'"
        };
        return text.replace(/&[#\w]+;/g, (entity) => {
          return entities[entity] || entity;
        });
      },
      // 检查头像数据是否有效
      isValidAvatar(avatar) {
        if (!avatar || avatar === "") {
          return false;
        }
        const cleaned = avatar.replace(/\s+/g, "");
        return cleaned.length > 0;
      },
      // 加载帖子数据
      async loadPosts(reset = false) {
        if (reset) {
          this.page = 1;
          this.hasMore = true;
        }
        if (this.loading || !reset && !this.hasMore) {
          return;
        }
        this.loading = true;
        try {
          let res;
          const currentCategoryNum = Number(this.currentCategory);
          const isTopLevelCategory = this.categories.some((c) => Number(c.id) === currentCategoryNum && c.level === 1);
          res = await forumApi.getAllFirstComments();
          if (res && res.length > 0) {
            formatAppLog("log", "at pages/forum/forum.vue:372", "=== 头像数据调试信息 ===");
            res.slice(0, 3).forEach((post, index) => {
              formatAppLog("log", "at pages/forum/forum.vue:374", `帖子 ${index + 1} (用户ID: ${post.user_id}):`);
              formatAppLog("log", "at pages/forum/forum.vue:375", "  user_avatar 存在:", !!post.user_avatar);
              formatAppLog("log", "at pages/forum/forum.vue:376", "  user_avatar 长度:", post.user_avatar ? post.user_avatar.length : 0);
              formatAppLog("log", "at pages/forum/forum.vue:377", "  user_avatar_format:", post.user_avatar_format);
              formatAppLog("log", "at pages/forum/forum.vue:378", "  user_avatar 前20字符:", post.user_avatar ? post.user_avatar.substring(0, 20) : "空");
              if (post.user_avatar && post.user_avatar !== "") {
                const cleanedAvatar = post.user_avatar.replace(/\s+/g, "");
                const decodedAvatar = this.decodeHtmlEntities(cleanedAvatar);
                const avatarUrl = "data:image/" + (post.user_avatar_format === "jpg" ? "jpeg" : post.user_avatar_format || "jpeg") + ";base64," + decodedAvatar;
                formatAppLog("log", "at pages/forum/forum.vue:386", "  构建的头像URL长度:", avatarUrl.length);
                formatAppLog("log", "at pages/forum/forum.vue:387", "  头像URL前50字符:", avatarUrl.substring(0, 50));
                formatAppLog("log", "at pages/forum/forum.vue:390", "  base64数据开头检查:");
                formatAppLog("log", "at pages/forum/forum.vue:391", "    是否以/9j/开头（JPEG）:", decodedAvatar.startsWith("/9j/"));
                formatAppLog("log", "at pages/forum/forum.vue:392", "    是否以iVBOR开头（PNG）:", decodedAvatar.startsWith("iVBOR"));
                formatAppLog("log", "at pages/forum/forum.vue:393", "    是否以R0lG开头（GIF）:", decodedAvatar.startsWith("R0lG"));
                formatAppLog("log", "at pages/forum/forum.vue:394", "    是否以Qk开头（BMP）:", decodedAvatar.startsWith("Qk"));
                formatAppLog("log", "at pages/forum/forum.vue:397", "  空白字符检查:");
                formatAppLog("log", "at pages/forum/forum.vue:398", "    原始数据包含空白字符:", /\s/.test(post.user_avatar));
                formatAppLog("log", "at pages/forum/forum.vue:399", "    清理后长度:", cleanedAvatar.length);
                formatAppLog("log", "at pages/forum/forum.vue:400", "    解码后长度:", decodedAvatar.length);
                formatAppLog("log", "at pages/forum/forum.vue:401", "    原始长度:", post.user_avatar.length);
                formatAppLog("log", "at pages/forum/forum.vue:404", "  HTML实体检查:");
                formatAppLog("log", "at pages/forum/forum.vue:405", "    包含&符号:", cleanedAvatar.includes("&"));
                formatAppLog("log", "at pages/forum/forum.vue:406", "    解码前后是否不同:", cleanedAvatar !== decodedAvatar);
              }
              formatAppLog("log", "at pages/forum/forum.vue:408", "---");
            });
          }
          if (this.debugMode) {
            formatAppLog("log", "at pages/forum/forum.vue:414", "论坛数据:", res);
            formatAppLog("log", "at pages/forum/forum.vue:415", "当前分类:", this.currentCategory);
            formatAppLog("log", "at pages/forum/forum.vue:416", "是否一级分类:", isTopLevelCategory);
            formatAppLog("log", "at pages/forum/forum.vue:417", "所有分类:", this.categories);
          }
          if (res === null) {
            res = [];
          }
          if (res && res.length > 0 && this.debugMode) {
            formatAppLog("log", "at pages/forum/forum.vue:427", "第一条数据示例:", res[0]);
            formatAppLog("log", "at pages/forum/forum.vue:428", "数据字段验证:", {
              hasId: res[0].hasOwnProperty("id"),
              hasContent: res[0].hasOwnProperty("content"),
              hasCategoryId: res[0].hasOwnProperty("category_id"),
              hasUserId: res[0].hasOwnProperty("user_id"),
              hasCreatedAt: res[0].hasOwnProperty("created_at")
            });
          }
          if (res && res.length > 0) {
            let filteredPosts = [...res];
            if (this.currentCategory === "all") {
            } else if (isTopLevelCategory) {
              let targetCategoryIds = [];
              if ([200, 300].includes(currentCategoryNum)) {
                targetCategoryIds = [currentCategoryNum];
                if (this.debugMode) {
                  formatAppLog("log", "at pages/forum/forum.vue:453", "200/300分类直接使用:", targetCategoryIds);
                }
              } else {
                targetCategoryIds = this.categories.filter((c) => c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum)).map((c) => parseInt(c.next_category_id));
                if (this.debugMode) {
                  formatAppLog("log", "at pages/forum/forum.vue:462", "子分类ID列表:", targetCategoryIds);
                }
              }
              filteredPosts = filteredPosts.filter((post) => {
                if (!post || post.category_id === null) {
                  return false;
                }
                const postCategoryId = post.category_id;
                const isMatch = targetCategoryIds.includes(postCategoryId);
                if (this.debugMode) {
                  formatAppLog("log", "at pages/forum/forum.vue:476", `帖子${post.id}的分类${postCategoryId}是否匹配:`, isMatch);
                }
                return isMatch;
              });
              if (this.selectedSubCategories.length > 0) {
                if ([200, 300].includes(currentCategoryNum)) {
                  filteredPosts = filteredPosts.filter((post) => {
                    if (!post || post.category_id === null) {
                      return false;
                    }
                    return post.category_id === currentCategoryNum;
                  });
                } else {
                  filteredPosts = filteredPosts.filter((post) => {
                    if (!post || post.category_id === null) {
                      return false;
                    }
                    const postCategoryId = post.category_id;
                    return this.selectedSubCategories.includes(postCategoryId);
                  });
                }
              }
            } else {
              const currentCategoryObj = this.categories.find((c) => c.id === this.currentCategory);
              if (currentCategoryObj) {
                const targetCategoryId = currentCategoryObj.next_category_id;
                filteredPosts = filteredPosts.filter((post) => {
                  if (!post || post.category_id === null) {
                    return false;
                  }
                  return post.category_id === targetCategoryId;
                });
              }
            }
            if (this.keyword && this.keyword.trim() !== "") {
              const keywordLower = this.keyword.toLowerCase().trim();
              filteredPosts = filteredPosts.filter((post) => {
                const titleMatch = post.title && post.title.toLowerCase().includes(keywordLower);
                const contentMatch = post.content && post.content.toLowerCase().includes(keywordLower);
                return titleMatch || contentMatch;
              });
            }
            let postsWithReplyCount = filteredPosts.map((post) => ({
              ...post,
              reply_count: 0
              // 初始化为0，后续异步更新
            }));
            setTimeout(() => {
              this.updateReplyCounts(filteredPosts);
            }, 500);
            if (reset) {
              this.posts = postsWithReplyCount;
            } else {
              this.posts = [...this.posts, ...postsWithReplyCount];
            }
            this.hasMore = filteredPosts.length >= this.pageSize;
            this.page++;
          } else {
            this.hasMore = false;
            if (reset) {
              this.posts = [];
            }
          }
        } catch (error) {
          formatAppLog("error", "at pages/forum/forum.vue:553", "加载帖子失败:", error);
          formatAppLog("error", "at pages/forum/forum.vue:554", "错误详情:", error.message, error.stack);
          uni.showToast({
            title: "加载失败，请重试",
            icon: "none"
          });
        } finally {
          this.loading = false;
          this.isRefreshing = false;
        }
      },
      // 异步更新回复数量 - 分批处理，避免一次性请求过多
      async updateReplyCounts(posts) {
        if (!posts || posts.length === 0 || this.isLoadingReplies)
          return;
        this.isLoadingReplies = true;
        try {
          const batchSize = 3;
          for (let i = 0; i < posts.length; i += batchSize) {
            const batch = posts.slice(i, i + batchSize);
            try {
              const batchResults = await Promise.all(
                batch.map(async (post) => {
                  try {
                    const replies = await forumApi.getCommentReplies(post.id);
                    return {
                      id: post.id,
                      reply_count: replies && replies.length ? replies.length : 0
                    };
                  } catch (error) {
                    if (this.debugMode) {
                      formatAppLog("error", "at pages/forum/forum.vue:589", `获取帖子${post.id}回复数量失败:`, error);
                    }
                    return {
                      id: post.id,
                      reply_count: 0
                    };
                  }
                })
              );
              batchResults.forEach((result) => {
                const postIndex = this.posts.findIndex((p) => p.id === result.id);
                if (postIndex !== -1) {
                  this.$set(this.posts[postIndex], "reply_count", result.reply_count);
                }
              });
              if (i + batchSize < posts.length) {
                await new Promise((resolve) => setTimeout(resolve, 300));
              }
            } catch (error) {
              if (this.debugMode) {
                formatAppLog("error", "at pages/forum/forum.vue:615", `批量更新回复数量失败:`, error);
              }
            }
          }
        } finally {
          this.isLoadingReplies = false;
        }
      },
      // 搜索
      search() {
        this.page = 1;
        this.loadPosts(true);
      },
      // 切换分类
      switchCategory(category) {
        this.currentCategory = category;
        const categoryNum = Number(category);
        const isTopLevelCategory = this.categories.some((c) => Number(c.id) === categoryNum && c.level === 1);
        if (isTopLevelCategory) {
          if ([200, 300].includes(categoryNum)) {
            this.showCategoryTabs = false;
          } else {
            this.showCategoryTabs = true;
          }
        } else {
          this.showCategoryTabs = false;
        }
        this.page = 1;
        this.loadPosts(true);
      },
      // 初始化默认分类
      initDefaultCategory() {
        const topLevelCategories = this.categories.filter((c) => c.level === 1);
        if (topLevelCategories.length > 0) {
          this.currentCategory = topLevelCategories[0].id;
          this.switchCategory(this.currentCategory);
        }
      },
      // 切换子分类
      toggleSubCategory(categoryId) {
        const category = this.categories.find((c) => c.id === categoryId);
        const numCategoryId = category ? Number(category.next_category_id) : Number(categoryId);
        const index = this.selectedSubCategories.indexOf(numCategoryId);
        if (index === -1) {
          this.selectedSubCategories.push(numCategoryId);
        } else {
          this.selectedSubCategories.splice(index, 1);
        }
        this.page = 1;
        this.loadPosts(true);
      },
      // 清空子分类筛选
      clearSubCategories() {
        this.selectedSubCategories = [];
        this.page = 1;
        this.loadPosts(true);
      },
      // 下拉刷新
      onRefresh() {
        this.isRefreshing = true;
        this.loadPosts(true);
      },
      // 加载更多
      loadMore() {
        if (this.loading || !this.hasMore)
          return;
        if (this.loadMoreTimer) {
          clearTimeout(this.loadMoreTimer);
        }
        this.loadMoreTimer = setTimeout(() => {
          this.loadPosts();
        }, 300);
      },
      // 跳转到详情页
      goToDetail(post) {
        uni.navigateTo({
          url: `/pages/forum/details/forum_detail?id=${post.id}`
        });
      },
      // 返回上一页
      goBack() {
        uni.navigateBack();
      },
      // 跳转到发帖页
      goToPost() {
        uni.navigateTo({
          url: "/pages/forum/post"
        });
      },
      // 切换快速菜单
      toggleQuickMenu() {
        this.showQuickMenu = !this.showQuickMenu;
      },
      // 隐藏快速菜单
      hideQuickMenu() {
        this.showQuickMenu = false;
      },
      // 跳转到提问页
      goToAsk() {
        this.hideQuickMenu();
        uni.navigateTo({
          url: "/pages/forum/post?type=ask"
        });
      },
      // 跳转到分享资源页
      goToShare() {
        this.hideQuickMenu();
        uni.navigateTo({
          url: "/pages/forum/post?type=share"
        });
      },
      // 获取分类名称
      getCategoryName(categoryId) {
        const category = this.categories.find((c) => Number(c.next_category_id) === Number(categoryId));
        if (!category) {
          return "其他";
        }
        if (category.level === 1) {
          return category.name;
        }
        const parentCategory = this.categories.find((c) => Number(c.id) === Number(category.parent_id));
        if (parentCategory) {
          return `${parentCategory.name}-${category.name}`;
        }
        return category.name || "其他";
      },
      // 格式化时间
      formatTime(timeStr) {
        if (!timeStr)
          return "未知时间";
        try {
          const date = new Date(timeStr.replace(/-/g, "/"));
          const now = /* @__PURE__ */ new Date();
          const diff = now - date;
          const minute = 60 * 1e3;
          const hour = 60 * minute;
          const day = 24 * hour;
          if (diff < minute) {
            return "刚刚";
          } else if (diff < hour) {
            return Math.floor(diff / minute) + "分钟前";
          } else if (diff < day) {
            return Math.floor(diff / hour) + "小时前";
          } else {
            return Math.floor(diff / day) + "天前";
          }
        } catch (e) {
          return timeStr;
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "forum-container",
        style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar forum-nav",
            style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title forum-title",
                  onLongpress: _cache[0] || (_cache[0] = (...args) => $options.toggleDebugMode && $options.toggleDebugMode(...args)),
                  style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "技术论坛",
                36
                /* STYLE, NEED_HYDRATION */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "filter-section",
            style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode(
              "view",
              {
                class: "search-bar",
                style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)" })
              },
              [
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "forum-input",
                    placeholder: "搜索话题...",
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.keyword = $event),
                    onConfirm: _cache[2] || (_cache[2] = (...args) => $options.search && $options.search(...args)),
                    style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  null,
                  36
                  /* STYLE, NEED_HYDRATION */
                ), [
                  [vue.vModelText, $data.keyword]
                ])
              ],
              4
              /* STYLE */
            ),
            vue.createElementVNode("view", { class: "filter-group" }, [
              vue.createElementVNode("view", { class: "filter-item" }, [
                vue.createElementVNode("view", { class: "filter-label-container" }, [
                  vue.createElementVNode("view", { class: "title-dot" }),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "filter-label",
                      style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "分类",
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode("view", { class: "filter-options" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.categories.filter((c) => c.level === 1), (category) => {
                      return vue.openBlock(), vue.createElementBlock("text", {
                        class: vue.normalizeClass(["filter-option", { active: $data.currentCategory === category.id || $data.currentCategory === "all" && $data.categories.filter((c) => c.level === 1).indexOf(category) === 0 }]),
                        key: category.id,
                        onClick: ($event) => $options.switchCategory(category.id),
                        style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)", color: "#007aff" })
                      }, vue.toDisplayString(category.name), 15, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ]),
              $data.showCategoryTabs && $options.subCategoryList.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "filter-item"
              }, [
                vue.createElementVNode("view", { class: "filter-label-container" }, [
                  vue.createElementVNode("view", { class: "title-dot" }),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "filter-label",
                      style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "技术方向",
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode("view", { class: "filter-options" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["filter-option", { active: $data.selectedSubCategories.length === 0 }]),
                      onClick: _cache[3] || (_cache[3] = (...args) => $options.clearSubCategories && $options.clearSubCategories(...args)),
                      style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)", color: "#007aff" })
                    },
                    "全部",
                    6
                    /* CLASS, STYLE */
                  ),
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($options.subCategoryList, (category) => {
                      return vue.openBlock(), vue.createElementBlock("text", {
                        class: vue.normalizeClass(["filter-option", { active: $data.selectedSubCategories.includes(Number(category.next_category_id || category.id)) }]),
                        key: category.id,
                        onClick: ($event) => $options.toggleSubCategory(category.id),
                        style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)", color: "#007aff" })
                      }, vue.toDisplayString(category.name), 15, ["onClick"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("scroll-view", {
          class: "post-list",
          "scroll-y": "",
          onScrolltolower: _cache[4] || (_cache[4] = (...args) => $options.loadMore && $options.loadMore(...args)),
          "refresher-enabled": "",
          onRefresherrefresh: _cache[5] || (_cache[5] = (...args) => $options.onRefresh && $options.onRefresh(...args)),
          "refresher-triggered": $data.isRefreshing
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.posts, (post) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "forum-card forum-mb-md",
                key: post.id,
                onClick: ($event) => $options.goToDetail(post),
                style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#2c2c2c" : "linear-gradient(135deg, #ffffff, #f8faff)", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
              }, [
                vue.createElementVNode("view", { class: "post-main" }, [
                  vue.createElementVNode("view", { class: "user-section" }, [
                    vue.createElementVNode("image", {
                      class: "forum-avatar forum-avatar-md",
                      src: $options.isValidAvatar(post.user_avatar) ? "data:image/" + (post.user_avatar_format === "jpg" ? "jpeg" : post.user_avatar_format || "jpeg") + ";base64," + $options.decodeHtmlEntities(post.user_avatar.replace(/\s+/g, "")) : "/static/default-avatar.png",
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "username",
                        style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                      },
                      "用户" + vue.toDisplayString(post.user_id),
                      5
                      /* TEXT, STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "user-level",
                        style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(79, 172, 254, 0.2)" : "rgba(79, 172, 254, 0.1)" })
                      },
                      "L1",
                      4
                      /* STYLE */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "content-section" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "post-title",
                        style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                      },
                      vue.toDisplayString(post.title || post.content),
                      5
                      /* TEXT, STYLE */
                    ),
                    post.content.length > 100 ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "post-summary",
                        style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#6C757D" })
                      },
                      vue.toDisplayString(post.content.substring(0, 100)) + "...",
                      5
                      /* TEXT, STYLE */
                    )) : post.content !== post.title ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 1,
                        class: "post-summary",
                        style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#6C757D" })
                      },
                      vue.toDisplayString(post.content),
                      5
                      /* TEXT, STYLE */
                    )) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode("view", { class: "post-tags" }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "forum-tag forum-tag-primary",
                          style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)", color: "#007aff" })
                        },
                        vue.toDisplayString($options.getCategoryName(post.category_id)),
                        5
                        /* TEXT, STYLE */
                      )
                    ]),
                    vue.createElementVNode(
                      "view",
                      {
                        class: "post-stats",
                        style: vue.normalizeStyle({ borderTop: _ctx.isDarkMode ? "1px solid #404040" : "1px solid #E6F0FF" })
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "stat",
                            style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#6C757D" })
                          },
                          [
                            vue.createElementVNode("text", { class: "icon" }, "💬"),
                            vue.createTextVNode(
                              " " + vue.toDisplayString(post.reply_count || 0),
                              1
                              /* TEXT */
                            )
                          ],
                          4
                          /* STYLE */
                        ),
                        vue.createElementVNode(
                          "text",
                          {
                            class: "stat",
                            style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#6C757D" })
                          },
                          [
                            vue.createElementVNode("text", { class: "icon" }, "👁"),
                            vue.createTextVNode(
                              " " + vue.toDisplayString(post.view_count || 0),
                              1
                              /* TEXT */
                            )
                          ],
                          4
                          /* STYLE */
                        ),
                        vue.createElementVNode(
                          "text",
                          {
                            class: "stat",
                            style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#6C757D" })
                          },
                          [
                            vue.createElementVNode("text", { class: "icon" }, "⚠"),
                            vue.createTextVNode(
                              " " + vue.toDisplayString(post.like_count || 0),
                              1
                              /* TEXT */
                            )
                          ],
                          4
                          /* STYLE */
                        )
                      ],
                      4
                      /* STYLE */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "time-section" }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: "post-time",
                        style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#999999" })
                      },
                      vue.toDisplayString($options.formatTime(post.created_at)),
                      5
                      /* TEXT, STYLE */
                    ),
                    post.last_reply_time ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "reply-time",
                        style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#999999" })
                      },
                      "最后回复: " + vue.toDisplayString($options.formatTime(post.last_reply_time)),
                      5
                      /* TEXT, STYLE */
                    )) : vue.createCommentVNode("v-if", true)
                  ])
                ])
              ], 12, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $data.loading ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "load-more",
              style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#999999" })
            },
            "加载中...",
            4
            /* STYLE */
          )) : vue.createCommentVNode("v-if", true),
          !$data.hasMore && $data.posts.length > 0 ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 1,
              class: "no-more",
              style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#999999" })
            },
            "没有更多了",
            4
            /* STYLE */
          )) : vue.createCommentVNode("v-if", true),
          $data.posts.length === 0 && !$data.loading ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 2,
              class: "no-data",
              style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#999" : "#999999" })
            },
            [
              vue.createElementVNode("text", null, "暂无帖子，快来发布第一个话题吧！")
            ],
            4
            /* STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ], 40, ["refresher-triggered"]),
        vue.createElementVNode("button", {
          class: "forum-btn forum-btn-primary",
          style: { "position": "fixed", "bottom": "100rpx", "right": "40rpx", "width": "100rpx", "height": "100rpx", "border-radius": "50%", "display": "flex", "align-items": "center", "justify-content": "center", "z-index": "100" },
          onClick: _cache[6] || (_cache[6] = (...args) => $options.toggleQuickMenu && $options.toggleQuickMenu(...args))
        }, [
          vue.createElementVNode("text", { class: "plus" }, "+")
        ]),
        $data.showQuickMenu ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "quick-menu",
          onClick: _cache[11] || (_cache[11] = (...args) => $options.hideQuickMenu && $options.hideQuickMenu(...args))
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "menu-content",
              onClick: _cache[10] || (_cache[10] = vue.withModifiers(() => {
              }, ["stop"])),
              style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.9)" : "linear-gradient(135deg, #ffffff, #f8faff)" })
            },
            [
              vue.createElementVNode(
                "view",
                {
                  class: "forum-card forum-mb-sm",
                  onClick: _cache[7] || (_cache[7] = (...args) => $options.goToPost && $options.goToPost(...args)),
                  style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #ffffff, #f8faff)", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                },
                [
                  vue.createElementVNode("text", { class: "menu-icon" }, "✍️"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "menu-text",
                      style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "发布话题",
                    4
                    /* STYLE */
                  )
                ],
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: "forum-card forum-mb-sm",
                  onClick: _cache[8] || (_cache[8] = (...args) => $options.goToAsk && $options.goToAsk(...args)),
                  style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #ffffff, #f8faff)", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                },
                [
                  vue.createElementVNode("text", { class: "menu-icon" }, "❓"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "menu-text",
                      style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "发布提问",
                    4
                    /* STYLE */
                  )
                ],
                4
                /* STYLE */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: "forum-card",
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.goToShare && $options.goToShare(...args)),
                  style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #ffffff, #f8faff)", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                },
                [
                  vue.createElementVNode("text", { class: "menu-icon" }, "📤"),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "menu-text",
                      style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    "分享资源",
                    4
                    /* STYLE */
                  )
                ],
                4
                /* STYLE */
              )
            ],
            4
            /* STYLE */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const PagesForumForum = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-aeadbf01"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/forum/forum.vue"]]);
  const _sfc_main$5 = {
    mixins: [themeMixin],
    data() {
      return {
        postId: null,
        post: null,
        replies: [],
        newReply: {
          content: "",
          parent_id: null
        },
        replySort: "time_asc",
        showAdvancedEditor: false,
        categoryMap: {
          "101": "前端",
          "102": "后端",
          "103": "移动端",
          "104": "数据与AI",
          "105": "运维与测试"
        }
      };
    },
    computed: {
      isOriginalAuthor() {
        const userInfo = uni.getStorageSync("userInfo");
        return userInfo && userInfo.user_id && this.post && this.post.user_id === userInfo.user_id;
      }
    },
    onLoad(options) {
      this.postId = parseInt(options.id) || null;
      formatAppLog("log", "at pages/forum/details/forum_detail.vue:206", "帖子ID (整数):", this.postId);
      this.loadPostDetail();
      this.loadReplies();
    },
    methods: {
      // 解码HTML实体
      decodeHtmlEntities(text) {
        const entities = {
          "&amp;": "&",
          "&lt;": "<",
          "&gt;": ">",
          "&quot;": '"',
          "&#39;": "'"
        };
        return text.replace(/&[#\w]+;/g, (entity) => {
          return entities[entity] || entity;
        });
      },
      // 检查头像数据是否有效
      isValidAvatar(avatar) {
        if (!avatar || avatar === "") {
          return false;
        }
        const cleaned = avatar.replace(/\s+/g, "");
        return cleaned.length > 0;
      },
      // 返回上一页
      goBack() {
        uni.navigateBack();
      },
      // 加载帖子详情
      async loadPostDetail() {
        try {
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:255", "=== 开始加载帖子详情 ===");
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:256", "帖子ID:", this.postId);
          const res = await forumApi.getCommentDetail(this.postId);
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:259", "getCommentDetail返回结果:", res);
          if (res && res.length > 0) {
            formatAppLog("log", "at pages/forum/details/forum_detail.vue:262", "帖子详情:", res[0]);
            this.post = res[0];
          } else {
            formatAppLog("log", "at pages/forum/details/forum_detail.vue:265", "未找到帖子详情");
          }
        } catch (error) {
          formatAppLog("error", "at pages/forum/details/forum_detail.vue:268", "加载帖子详情失败:", error);
          uni.showToast({
            title: "加载失败",
            icon: "none"
          });
        } finally {
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:274", "=== 加载帖子详情结束 ===");
        }
      },
      // 加载回复列表
      async loadReplies() {
        try {
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:281", "=== 开始加载回复列表 ===");
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:282", "帖子ID:", this.postId);
          const res = await forumApi.getCommentReplies(this.postId);
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:285", "getCommentReplies返回结果:", res);
          if (res) {
            formatAppLog("log", "at pages/forum/details/forum_detail.vue:288", "回复列表长度:", res.length);
            this.replies = res;
          } else {
            formatAppLog("log", "at pages/forum/details/forum_detail.vue:291", "getCommentReplies返回null或undefined");
          }
        } catch (error) {
          formatAppLog("error", "at pages/forum/details/forum_detail.vue:294", "加载回复失败:", error);
        } finally {
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:296", "=== 加载回复列表结束 ===");
        }
      },
      // 提交回复
      async submitReply() {
        if (!this.newReply.content.trim()) {
          uni.showToast({
            title: "请输入回复内容",
            icon: "none"
          });
          return;
        }
        try {
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:311", "=== 开始提交回复 ===");
          let userInfo = uni.getStorageSync("userInfo");
          if (typeof userInfo === "string") {
            try {
              userInfo = JSON.parse(userInfo);
            } catch (e) {
              userInfo = null;
            }
          }
          if (!userInfo || !userInfo.user_id) {
            uni.showToast({
              title: "请先登录",
              icon: "none"
            });
            return;
          }
          const replyData = {
            category_id: this.post.category_id,
            user_id: userInfo.user_id,
            parent_id: this.postId,
            content: this.newReply.content.trim(),
            level: 2,
            sort_order: 0
          };
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:339", "提交的回复数据:", replyData);
          const addReplyResult = await forumApi.addReply(replyData);
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:342", "addReply返回结果:", addReplyResult);
          uni.showToast({
            title: "回复成功",
            icon: "success"
          });
          this.newReply.content = "";
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:353", "开始重新加载回复列表...");
          await this.loadReplies();
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:355", "回复列表加载完成，当前回复数:", this.replies.length);
        } catch (error) {
          formatAppLog("error", "at pages/forum/details/forum_detail.vue:358", "提交回复失败:", error);
          uni.showToast({
            title: "提交失败，请重试",
            icon: "none"
          });
        } finally {
          formatAppLog("log", "at pages/forum/details/forum_detail.vue:364", "=== 提交回复结束 ===");
        }
      },
      // 回复某个回复
      replyToReply(reply) {
        this.newReply.content = `@用户${reply.user_id} `;
      },
      // 点赞帖子
      async toggleLike() {
        try {
          let userInfo = uni.getStorageSync("userInfo");
          if (typeof userInfo === "string") {
            try {
              userInfo = JSON.parse(userInfo);
            } catch (e) {
              userInfo = null;
            }
          }
          if (!userInfo || !userInfo.user_id) {
            uni.showToast({
              title: "请先登录",
              icon: "none"
            });
            return;
          }
          await forumApi.toggleLike({
            user_id: userInfo.user_id,
            comment_id: this.postId,
            action: this.post.is_liked ? "unlike" : "like"
          });
          if (this.post.is_liked) {
            this.post.like_count--;
            this.post.is_liked = false;
          } else {
            this.post.like_count++;
            this.post.is_liked = true;
          }
        } catch (error) {
          formatAppLog("error", "at pages/forum/details/forum_detail.vue:409", "点赞失败:", error);
        }
      },
      // 收藏帖子
      async toggleFavorite() {
        try {
          let userInfo = uni.getStorageSync("userInfo");
          if (typeof userInfo === "string") {
            try {
              userInfo = JSON.parse(userInfo);
            } catch (e) {
              userInfo = null;
            }
          }
          if (!userInfo || !userInfo.user_id) {
            uni.showToast({
              title: "请先登录",
              icon: "none"
            });
            return;
          }
          await forumApi.toggleFavorite({
            user_id: userInfo.user_id,
            comment_id: this.postId,
            action: this.post.is_favorited ? "unfavorite" : "favorite"
          });
          if (this.post.is_favorited) {
            this.post.favorite_count--;
            this.post.is_favorited = false;
          } else {
            this.post.favorite_count++;
            this.post.is_favorited = true;
          }
        } catch (error) {
          formatAppLog("error", "at pages/forum/details/forum_detail.vue:449", "收藏失败:", error);
        }
      },
      // 点赞回复
      async toggleReplyLike(reply) {
        try {
          let userInfo = uni.getStorageSync("userInfo");
          if (typeof userInfo === "string") {
            try {
              userInfo = JSON.parse(userInfo);
            } catch (e) {
              userInfo = null;
            }
          }
          if (!userInfo || !userInfo.user_id) {
            uni.showToast({
              title: "请先登录",
              icon: "none"
            });
            return;
          }
          await forumApi.toggleLike({
            user_id: userInfo.user_id,
            comment_id: reply.id,
            action: reply.is_liked ? "unlike" : "like"
          });
          if (reply.is_liked) {
            reply.like_count--;
            reply.is_liked = false;
          } else {
            reply.like_count++;
            reply.is_liked = true;
          }
        } catch (error) {
          formatAppLog("error", "at pages/forum/details/forum_detail.vue:489", "点赞失败:", error);
        }
      },
      // 分享帖子
      sharePost() {
        uni.showShareMenu({
          title: this.post.content,
          path: `/pages/forum/details/forum_detail?id=${this.postId}`
        });
      },
      // 切换回复排序
      switchReplySort(sortBy) {
        this.replySort = sortBy;
        this.sortReplies();
      },
      // 前端排序回复
      sortReplies() {
        const sortedReplies = [...this.replies];
        switch (this.replySort) {
          case "time_asc":
            sortedReplies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
          case "time_desc":
            sortedReplies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          case "likes":
            sortedReplies.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
            break;
        }
        this.replies = sortedReplies;
      },
      // 切换高级编辑器
      toggleAdvancedEditor() {
        this.showAdvancedEditor = !this.showAdvancedEditor;
      },
      // 插入粗体
      insertBold() {
        this.newReply.content += "**粗体文本**";
      },
      // 插入斜体
      insertItalic() {
        this.newReply.content += "*斜体文本*";
      },
      // 插入链接
      insertLink() {
        uni.prompt({
          title: "插入链接",
          message: "请输入链接地址",
          success: (res) => {
            if (res.confirm) {
              this.newReply.content += `[链接](${res.value})`;
            }
          }
        });
      },
      // 插入代码
      insertCode() {
        this.newReply.content += "```\n代码\n```";
      },
      // 上传图片
      uploadImage() {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            this.newReply.content += `![图片](${res.tempFilePaths[0]})`;
          }
        });
      },
      // 跳转到用户个人主页
      goToUserProfile(userId) {
        uni.showToast({
          title: "用户个人主页功能暂未实现",
          icon: "none"
        });
      },
      // 举报帖子
      reportPost() {
        uni.showModal({
          title: "举报帖子",
          content: "确定要举报这个帖子吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: "举报成功，我们会尽快处理",
                icon: "success"
              });
            }
          }
        });
      },
      // 举报回复
      reportReply(reply) {
        uni.showModal({
          title: "举报回复",
          content: "确定要举报这个回复吗？",
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: "举报成功，我们会尽快处理",
                icon: "success"
              });
            }
          }
        });
      },
      // 获取分类名称
      getCategoryName(categoryId) {
        return this.categoryMap[categoryId] || "其他";
      },
      // 格式化时间
      formatTime(timeStr) {
        if (!timeStr)
          return "未知时间";
        try {
          const date = new Date(timeStr.replace(/-/g, "/"));
          const now = /* @__PURE__ */ new Date();
          const diff = now - date;
          const minute = 60 * 1e3;
          const hour = 60 * minute;
          const day = 24 * hour;
          if (diff < minute) {
            return "刚刚";
          } else if (diff < hour) {
            return Math.floor(diff / minute) + "分钟前";
          } else if (diff < day) {
            return Math.floor(diff / hour) + "小时前";
          } else {
            return Math.floor(diff / day) + "天前";
          }
        } catch (e) {
          return timeStr;
        }
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "forum-detail-container",
        style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar forum-nav",
            style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode("text", {
                class: "nav-icon",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
              }, "←")
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title forum-title",
                  style: vue.normalizeStyle({ color: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "帖子详情",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        $data.post ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "post-detail",
            style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)" })
          },
          [
            vue.createElementVNode("view", { class: "post-header" }, [
              vue.createElementVNode("image", {
                class: "avatar",
                onClick: _cache[1] || (_cache[1] = ($event) => $options.goToUserProfile($data.post.user_id)),
                src: $options.isValidAvatar($data.post.user_avatar) ? "data:image/" + ($data.post.user_avatar_format === "jpg" ? "jpeg" : $data.post.user_avatar_format || "jpeg") + ";base64," + $options.decodeHtmlEntities($data.post.user_avatar.replace(/\s+/g, "")) : "/static/default-avatar.png",
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode("view", { class: "user-info" }, [
                vue.createElementVNode("view", { class: "user-main-info" }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "username",
                      onClick: _cache[2] || (_cache[2] = ($event) => $options.goToUserProfile($data.post.user_id))
                    },
                    "用户" + vue.toDisplayString($data.post.user_id),
                    1
                    /* TEXT */
                  ),
                  $options.isOriginalAuthor ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "user-badge"
                  }, "楼主")) : vue.createCommentVNode("v-if", true)
                ]),
                vue.createElementVNode("view", { class: "time-info" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "time" },
                    vue.toDisplayString($options.formatTime($data.post.created_at)),
                    1
                    /* TEXT */
                  ),
                  $data.post.updated_at && $data.post.updated_at !== $data.post.created_at ? (vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: 0,
                      class: "edit-time"
                    },
                    "最后编辑: " + vue.toDisplayString($options.formatTime($data.post.updated_at)),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ])
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: "category",
                  style: vue.normalizeStyle({ background: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)", color: "#007aff" })
                },
                vue.toDisplayString($options.getCategoryName($data.post.category_id)),
                5
                /* TEXT, STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "post-title-section" }, [
              vue.createElementVNode(
                "text",
                { class: "post-title" },
                vue.toDisplayString($data.post.title || $data.post.content),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "post-content" }, [
              vue.createElementVNode(
                "text",
                { class: "content" },
                vue.toDisplayString($data.post.content),
                1
                /* TEXT */
              )
            ])
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "replies-section"
        }, [
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode(
              "text",
              { class: "section-title" },
              "全部回复 (" + vue.toDisplayString($data.replies.length) + ")",
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "sort-options" }, [
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["sort-option", { active: $data.replySort === "time_asc" }]),
                  onClick: _cache[3] || (_cache[3] = ($event) => $options.switchReplySort("time_asc"))
                },
                "时间正序",
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "text",
                {
                  class: vue.normalizeClass(["sort-option", { active: $data.replySort === "time_desc" }]),
                  onClick: _cache[4] || (_cache[4] = ($event) => $options.switchReplySort("time_desc"))
                },
                "时间倒序",
                2
                /* CLASS */
              )
            ])
          ]),
          vue.createElementVNode("scroll-view", {
            class: "replies-list",
            "scroll-y": ""
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.replies, (reply, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "reply-item",
                  key: reply.id
                }, [
                  vue.createElementVNode("view", { class: "reply-header" }, [
                    vue.createElementVNode("image", {
                      class: "avatar",
                      onClick: ($event) => $options.goToUserProfile(reply.user_id),
                      src: $options.isValidAvatar(reply.user_avatar) ? "data:image/" + (reply.user_avatar_format === "jpg" ? "jpeg" : reply.user_avatar_format || "jpeg") + ";base64," + $options.decodeHtmlEntities(reply.user_avatar.replace(/\s+/g, "")) : "/static/default-avatar.png",
                      mode: "aspectFill"
                    }, null, 8, ["onClick", "src"]),
                    vue.createElementVNode("view", { class: "user-info" }, [
                      vue.createElementVNode("view", { class: "user-main-info" }, [
                        vue.createElementVNode("text", {
                          class: "username",
                          onClick: ($event) => $options.goToUserProfile(reply.user_id)
                        }, "用户" + vue.toDisplayString(reply.user_id), 9, ["onClick"]),
                        $options.isOriginalAuthor && reply.user_id === $data.post.user_id ? (vue.openBlock(), vue.createElementBlock("text", {
                          key: 0,
                          class: "user-badge"
                        }, "楼主")) : vue.createCommentVNode("v-if", true),
                        reply.is_best_answer ? (vue.openBlock(), vue.createElementBlock("text", {
                          key: 1,
                          class: "user-badge best-answer"
                        }, "最佳答案")) : vue.createCommentVNode("v-if", true)
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "time" },
                        vue.toDisplayString($options.formatTime(reply.created_at)),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode(
                      "text",
                      { class: "floor" },
                      "#" + vue.toDisplayString(index + 1),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "reply-content" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "content" },
                      vue.toDisplayString(reply.content),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "reply-actions" }, [
                    vue.createElementVNode("button", {
                      class: "action-btn",
                      onClick: ($event) => $options.replyToReply(reply)
                    }, [
                      vue.createElementVNode("text", { class: "icon" }, "💬"),
                      vue.createElementVNode("text", null, "回复")
                    ], 8, ["onClick"]),
                    vue.createElementVNode("button", {
                      class: "action-btn",
                      onClick: ($event) => $options.reportReply(reply)
                    }, [
                      vue.createElementVNode("text", { class: "icon" }, "⚠️"),
                      vue.createElementVNode("text", null, "举报")
                    ], 8, ["onClick"])
                  ])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            $data.replies.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "no-replies"
            }, [
              vue.createElementVNode("text", null, "暂无回复，快来发表第一个回复吧！")
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])),
        (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "reply-input-section"
        }, [
          vue.createElementVNode("view", { class: "input-header" }, [
            vue.createElementVNode("text", { class: "input-title" }, "快速回复"),
            vue.createElementVNode("button", {
              class: "advanced-btn",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.toggleAdvancedEditor && $options.toggleAdvancedEditor(...args))
            }, [
              vue.createElementVNode("text", { class: "icon" }, "📝"),
              vue.createElementVNode("text", null, "高级编辑")
            ])
          ]),
          vue.createElementVNode("view", { class: "input-area" }, [
            vue.withDirectives(vue.createElementVNode(
              "textarea",
              {
                class: "reply-textarea",
                placeholder: "写下你的回复...",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.newReply.content = $event),
                "auto-height": ""
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.newReply.content]
            ]),
            vue.createElementVNode("button", {
              class: "submit-btn",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.submitReply && $options.submitReply(...args)),
              disabled: !$data.newReply.content.trim()
            }, " 发布 ", 8, ["disabled"])
          ]),
          $data.showAdvancedEditor ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "advanced-editor"
          }, [
            vue.createElementVNode("view", { class: "editor-tools" }, [
              vue.createElementVNode("button", {
                class: "tool-btn",
                onClick: _cache[8] || (_cache[8] = (...args) => $options.insertBold && $options.insertBold(...args))
              }, [
                vue.createElementVNode("text", { class: "icon" }, "B")
              ]),
              vue.createElementVNode("button", {
                class: "tool-btn",
                onClick: _cache[9] || (_cache[9] = (...args) => $options.insertItalic && $options.insertItalic(...args))
              }, [
                vue.createElementVNode("text", { class: "icon" }, "I")
              ]),
              vue.createElementVNode("button", {
                class: "tool-btn",
                onClick: _cache[10] || (_cache[10] = (...args) => $options.insertLink && $options.insertLink(...args))
              }, [
                vue.createElementVNode("text", { class: "icon" }, "🔗")
              ]),
              vue.createElementVNode("button", {
                class: "tool-btn",
                onClick: _cache[11] || (_cache[11] = (...args) => $options.insertCode && $options.insertCode(...args))
              }, [
                vue.createElementVNode("text", { class: "icon" }, "{}")
              ]),
              vue.createElementVNode("button", {
                class: "tool-btn",
                onClick: _cache[12] || (_cache[12] = (...args) => $options.uploadImage && $options.uploadImage(...args))
              }, [
                vue.createElementVNode("text", { class: "icon" }, "🖼")
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ]))
      ],
      4
      /* STYLE */
    );
  }
  const PagesForumDetailsForumDetail = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-0616a583"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/forum/details/forum_detail.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        postForm: {
          content: "",
          category_id: "101",
          anonymous: false
        },
        categoryIndex: 0,
        categories: [
          { id: "101", name: "前端开发" },
          { id: "102", name: "后端开发" },
          { id: "103", name: "移动端开发" },
          { id: "104", name: "数据与AI" },
          { id: "105", name: "运维与测试" },
          { id: "106", name: "产品设计" },
          { id: "107", name: "网络安全" },
          { id: "108", name: "嵌入式开发" },
          { id: "200", name: "产品与设计类" },
          { id: "300", name: "技术管理类" }
        ]
      };
    },
    computed: {
      canSubmit() {
        return this.postForm.content.trim().length > 0 && this.postForm.category_id;
      }
    },
    methods: {
      // 选择分类
      onCategoryChange(e) {
        this.categoryIndex = e.detail.value;
        this.postForm.category_id = this.categories[this.categoryIndex].id;
      },
      // 返回
      goBack() {
        uni.navigateBack();
      },
      // 提交帖子
      async submitPost() {
        if (!this.canSubmit)
          return;
        try {
          formatAppLog("log", "at pages/forum/post.vue:107", "=== 开始发布话题 ===");
          const token = uni.getStorageSync("token");
          formatAppLog("log", "at pages/forum/post.vue:111", "存储的token:", token);
          let userInfo = uni.getStorageSync("userInfo");
          formatAppLog("log", "at pages/forum/post.vue:114", "原始userInfo:", userInfo);
          formatAppLog("log", "at pages/forum/post.vue:115", "userInfo类型:", typeof userInfo);
          if (typeof userInfo === "string") {
            try {
              userInfo = JSON.parse(userInfo);
              formatAppLog("log", "at pages/forum/post.vue:121", "解析后的userInfo:", userInfo);
            } catch (e) {
              formatAppLog("error", "at pages/forum/post.vue:123", "解析userInfo失败:", e);
              userInfo = null;
            }
          }
          formatAppLog("log", "at pages/forum/post.vue:128", "最终userInfo:", userInfo);
          formatAppLog("log", "at pages/forum/post.vue:129", "是否有user_id:", userInfo && userInfo.user_id);
          if (!userInfo || !userInfo.user_id) {
            formatAppLog("error", "at pages/forum/post.vue:132", "登录状态检查失败:", { userInfo, hasUserId: userInfo && userInfo.user_id });
            uni.showToast({
              title: "请先登录",
              icon: "none"
            });
            return;
          }
          const postData = {
            category_id: this.postForm.category_id,
            user_id: userInfo.user_id,
            parent_id: "",
            // 一级评论
            content: this.postForm.content.trim(),
            level: 1,
            sort_order: 0
          };
          formatAppLog("log", "at pages/forum/post.vue:149", "发布数据:", postData);
          await forumApi.addComment(postData);
          uni.showToast({
            title: "发布成功",
            icon: "success",
            success: () => {
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            }
          });
        } catch (error) {
          formatAppLog("error", "at pages/forum/post.vue:164", "发布失败:", error);
          uni.showToast({
            title: `发布失败: ${error.message || "请检查网络连接"}`,
            icon: "none",
            duration: 3e3
          });
        } finally {
          formatAppLog("log", "at pages/forum/post.vue:171", "=== 发布话题结束 ===");
        }
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "post-container",
        style: vue.normalizeStyle({ background: "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", boxShadow: "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-left" }, [
              vue.createElementVNode("text", {
                class: "nav-back",
                onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
              }, "←")
            ]),
            vue.createElementVNode("view", { class: "nav-center" }, [
              vue.createElementVNode("text", { class: "nav-title" }, "发布话题")
            ]),
            vue.createElementVNode("view", { class: "nav-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "form-section",
            style: vue.normalizeStyle({ background: "rgba(255, 255, 255, 0.8)", boxShadow: "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "label-container" }, [
                vue.createElementVNode("view", { class: "title-dot" }),
                vue.createElementVNode("text", { class: "label" }, "话题内容")
              ]),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  class: "content-input",
                  placeholder: "分享你的技术心得、项目经验或提出问题...",
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.postForm.content = $event),
                  maxlength: "500"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.postForm.content]
              ]),
              vue.createElementVNode(
                "text",
                { class: "char-count" },
                vue.toDisplayString($data.postForm.content.length) + "/500",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("view", { class: "label-container" }, [
                vue.createElementVNode("view", { class: "title-dot" }),
                vue.createElementVNode("text", { class: "label" }, "选择分类")
              ]),
              vue.createElementVNode("picker", {
                onChange: _cache[2] || (_cache[2] = (...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
                value: $data.categoryIndex,
                range: $data.categories,
                "range-key": "name"
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: "picker",
                    style: vue.normalizeStyle({ background: "linear-gradient(135deg, #E6F0FF, #F0F4FF)" })
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      null,
                      vue.toDisplayString(((_a = $data.categories[$data.categoryIndex]) == null ? void 0 : _a.name) || "请选择分类"),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                  ],
                  4
                  /* STYLE */
                )
              ], 40, ["value", "range"])
            ]),
            vue.createElementVNode("view", { class: "form-item" }, [
              vue.createElementVNode("label", { class: "checkbox-item" }, [
                vue.createElementVNode("checkbox", {
                  checked: $data.postForm.anonymous,
                  onClick: _cache[3] || (_cache[3] = ($event) => $data.postForm.anonymous = !$data.postForm.anonymous)
                }, null, 8, ["checked"]),
                vue.createElementVNode("text", null, "匿名发帖")
              ])
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("view", { class: "action-buttons" }, [
          vue.createElementVNode("button", {
            class: "btn-secondary",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.goBack && $options.goBack(...args))
          }, "取消"),
          vue.createElementVNode("button", {
            class: "btn-primary",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.submitPost && $options.submitPost(...args)),
            disabled: !$options.canSubmit
          }, "发布", 8, ["disabled"])
        ])
      ],
      4
      /* STYLE */
    );
  }
  const PagesForumPost = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-3ffb5f08"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/forum/post.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        // 主题相关
        currentTheme: "light",
        isDarkMode: false,
        // 用户信息
        userInfo: {
          avatar: "/static/logo.png",
          nickname: "张三",
          position: "资深产品经理",
          competitiveLevel: "S+"
        },
        // 当前显示的竞争力数据
        score: 96,
        competitiveDesc: "你的竞争力处于市场前 5% 的稀缺区间",
        metrics: [],
        skillDistribution: [],
        coreAdvantages: [],
        opportunities: [],
        actions: [],
        skillInsight: "",
        // 职位选择相关
        showCascadePicker: false,
        selectedCategoryId: "",
        selectedCategoryName: "",
        selectedPositionId: "",
        selectedPositionName: "",
        // 职位数据
        mainCategories: [
          { id: "101", name: "前端开发" },
          { id: "102", name: "后端开发" },
          { id: "103", name: "移动端开发" },
          { id: "104", name: "数据与AI" },
          { id: "105", name: "运维与测试" },
          { id: "106", name: "产品设计" },
          { id: "107", name: "网络安全" },
          { id: "108", name: "嵌入式开发" },
          { id: "200", name: "产品与设计类" },
          { id: "300", name: "技术管理类" }
        ],
        positionDetails: {
          "101": [
            { id: "1", name: "Web前端工程师" },
            { id: "2", name: "移动端前端工程师" },
            { id: "3", name: "小程序开发工程师" },
            { id: "4", name: "跨平台开发工程师" },
            { id: "5", name: "前端架构师" },
            { id: "6", name: "Node.js全栈工程师" }
          ],
          "102": [
            { id: "7", name: "Java开发工程师" },
            { id: "8", name: "Python开发工程师" },
            { id: "9", name: "Go开发工程师" },
            { id: "10", name: "C++开发工程师" },
            { id: "11", name: "PHP开发工程师" },
            { id: "12", name: "微服务架构师" }
          ],
          "103": [
            { id: "13", name: "Android开发工程师" },
            { id: "14", name: "iOS开发工程师" },
            { id: "15", name: "鸿蒙开发工程师" },
            { id: "16", name: "移动游戏开发工程师" }
          ],
          "104": [
            { id: "17", name: "数据分析师" },
            { id: "18", name: "数据挖掘工程师" },
            { id: "19", name: "机器学习工程师" },
            { id: "20", name: "深度学习工程师" },
            { id: "21", name: "AI算法工程师" },
            { id: "22", name: "大数据工程师" }
          ],
          "105": [
            { id: "23", name: "DevOps工程师" },
            { id: "24", name: "SRE工程师" },
            { id: "25", name: "测试工程师" },
            { id: "26", name: "自动化测试工程师" },
            { id: "27", name: "性能测试工程师" }
          ],
          "106": [
            { id: "28", name: "产品经理" },
            { id: "29", name: "产品设计师" },
            { id: "30", name: "UX设计师" },
            { id: "31", name: "UI设计师" },
            { id: "32", name: "交互设计师" }
          ],
          "107": [
            { id: "33", name: "网络安全工程师" },
            { id: "34", name: "渗透测试工程师" },
            { id: "35", name: "安全运维工程师" },
            { id: "36", name: "安全架构师" }
          ],
          "108": [
            { id: "37", name: "嵌入式开发工程师" },
            { id: "38", name: "FPGA工程师" },
            { id: "39", name: "硬件工程师" },
            { id: "40", name: "物联网工程师" }
          ],
          "200": [
            { id: "41", name: "产品经理（技术型）" },
            { id: "42", name: "UI设计师" },
            { id: "43", name: "交互设计师(IXD)" },
            { id: "44", name: "UX研究员" }
          ],
          "300": [
            { id: "45", name: "技术经理/组长" },
            { id: "46", name: "架构师" },
            { id: "47", name: "研发总监" },
            { id: "48", name: "CTO/技术VP" }
          ]
        },
        // 静态职位数据映射表 - 每个职位ID对应完整的数据内容
        positionDataMap: {
          // 前端开发 - Web前端工程师
          "1": {
            score: 78,
            competitiveDesc: "你的React前端开发竞争力处于市场前 22% 的区间",
            metrics: [
              { value: "73%", change: "2%", label: "岗位匹配度", desc: '与"Web前端工程师"基本契合' },
              { value: "7.8 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.5" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 18 次，简历查看率 +15%" }
            ],
            skillDistribution: [
              { name: "React框架", percentage: 35, color: "#007AFF", offset: 0 },
              { name: "状态管理", percentage: 20, color: "#5E9EFF", offset: 35 },
              { name: "前端工程化", percentage: 25, color: "#8EB9FF", offset: 55 },
              { name: "性能优化", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "React生态熟悉", value: "75%", score: "7.5" },
              { label: "前端工程化", value: "73%", score: "7.3" },
              { label: "性能优化", value: "74%", score: "7.4" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 68%" },
              { icon: "•", text: "高潜赛道：AI 前端应用，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +8%~12%" },
              { icon: "•", text: "技术栈匹配：75% 以上的React岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新React相关项目经验，突出状态管理和前端工程化能力",
              '开启"暗聘模式"，定向接收大厂前端团队直推',
              "学习Next.js等服务端渲染技术，提升全栈能力",
              "参与开源项目，增加技术影响力"
            ],
            skillInsight: "React框架和前端工程化构成核心优势，占总技能权重 60%。"
          },
          // 移动端前端工程师
          "2": {
            score: 76,
            competitiveDesc: "你的移动端/跨平台前端开发竞争力处于市场前 24% 的区间",
            metrics: [
              { value: "70%", change: "1%", label: "岗位匹配度", desc: '与"移动端前端工程师"基本契合' },
              { value: "7.6 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.4" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 16 次，简历查看率 +12%" }
            ],
            skillDistribution: [
              { name: "Vue框架", percentage: 35, color: "#007AFF", offset: 0 },
              { name: "响应式设计", percentage: 25, color: "#5E9EFF", offset: 35 },
              { name: "前端工程化", percentage: 20, color: "#8EB9FF", offset: 60 },
              { name: "性能优化", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "移动端开发", value: "72%", score: "7.2" },
              { label: "响应式设计", value: "70%", score: "7.0" },
              { label: "跨平台技术", value: "71%", score: "7.1" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（美团）岗位匹配度 > 64%" },
              { icon: "•", text: "高潜赛道：企业级应用开发，你的技能匹配度 B" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +6%~10%" },
              { icon: "•", text: "技术栈匹配：70% 以上的移动端/跨平台前端岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新移动端/跨平台前端相关项目经验，突出响应式设计和组件化开发能力",
              '开启"暗聘模式"，定向接收企业级应用开发团队直推',
              "学习Flutter、React Native等跨平台技术，提升全栈能力",
              "参与移动端前端开源项目，增加技术影响力"
            ],
            skillInsight: "移动端开发和响应式设计构成核心优势，占总技能权重 60%。"
          },
          // 小程序开发工程师
          "3": {
            score: 75,
            competitiveDesc: "你的小程序开发竞争力处于市场前 25% 的区间",
            metrics: [
              { value: "69%", change: "1%", label: "岗位匹配度", desc: '与"小程序开发工程师"基本契合' },
              { value: "7.5 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.3" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 15 次，简历查看率 +11%" }
            ],
            skillDistribution: [
              { name: "小程序框架", percentage: 35, color: "#007AFF", offset: 0 },
              { name: "组件化", percentage: 25, color: "#5E9EFF", offset: 35 },
              { name: "云开发", percentage: 20, color: "#8EB9FF", offset: 60 },
              { name: "性能优化", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "小程序开发", value: "72%", score: "7.2" },
              { label: "组件化设计", value: "70%", score: "7.0" },
              { label: "云开发能力", value: "69%", score: "6.9" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（腾讯）岗位匹配度 > 63%" },
              { icon: "•", text: "高潜赛道：小程序生态，你的技能匹配度 B" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +5%~9%" },
              { icon: "•", text: "技术栈匹配：68% 以上的小程序岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新小程序项目经验，突出组件化和云开发能力",
              '开启"暗聘模式"，定向接收小程序开发团队直推',
              "学习跨平台小程序框架，提升开发效率",
              "参与小程序开源项目，增加技术影响力"
            ],
            skillInsight: "小程序框架和组件化构成核心优势，占总技能权重 60%。"
          },
          // 跨平台开发工程师
          "4": {
            score: 77,
            competitiveDesc: "你的跨平台开发竞争力处于市场前 23% 的区间",
            metrics: [
              { value: "71%", change: "2%", label: "岗位匹配度", desc: '与"跨平台开发工程师"基本契合' },
              { value: "7.7 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.5" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 17 次，简历查看率 +14%" }
            ],
            skillDistribution: [
              { name: "Flutter/RN", percentage: 35, color: "#007AFF", offset: 0 },
              { name: "原生交互", percentage: 25, color: "#5E9EFF", offset: 35 },
              { name: "状态管理", percentage: 20, color: "#8EB9FF", offset: 60 },
              { name: "性能优化", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "跨平台框架", value: "74%", score: "7.4" },
              { label: "原生交互", value: "72%", score: "7.2" },
              { label: "状态管理", value: "71%", score: "7.1" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 65%" },
              { icon: "•", text: "高潜赛道：跨端应用，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +7%~11%" },
              { icon: "•", text: "技术栈匹配：72% 以上的跨平台岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新跨平台项目经验，突出框架和原生交互能力",
              '开启"暗聘模式"，定向接收大厂移动团队直推',
              "学习新跨平台技术，保持技术领先",
              "参与跨平台开源项目，增加技术影响力"
            ],
            skillInsight: "跨平台框架和原生交互构成核心优势，占总技能权重 60%。"
          },
          // 前端架构师
          "5": {
            score: 80,
            competitiveDesc: "你的前端架构师/全栈开发竞争力处于市场前 20% 的区间",
            metrics: [
              { value: "75%", change: "2%", label: "岗位匹配度", desc: '与"前端架构师"基本契合' },
              { value: "8.0 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.7" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 19 次，简历查看率 +16%" }
            ],
            skillDistribution: [
              { name: "前端架构", percentage: 35, color: "#007AFF", offset: 0 },
              { name: "全栈开发", percentage: 25, color: "#5E9EFF", offset: 35 },
              { name: "性能优化", percentage: 20, color: "#8EB9FF", offset: 60 },
              { name: "团队管理", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "前端架构设计", value: "77%", score: "7.7" },
              { label: "全栈开发能力", value: "76%", score: "7.6" },
              { label: "性能优化", value: "75%", score: "7.5" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：2 家（字节跳动、阿里）岗位匹配度 > 70%" },
              { icon: "•", text: "高潜赛道：AI 前端应用，你的技能匹配度 A-" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +10%~15%" },
              { icon: "•", text: "技术栈匹配：80% 以上的前端架构师岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新前端架构相关项目经验，突出全栈开发和性能优化能力",
              '开启"暗聘模式"，定向接收大厂前端架构团队直推',
              "学习Serverless等云原生技术，提升架构能力",
              "参与前端开源项目，增加技术影响力"
            ],
            skillInsight: "前端架构和全栈开发构成核心优势，占总技能权重 60%。"
          },
          // Node.js全栈工程师
          "6": {
            score: 79,
            competitiveDesc: "你的Node.js全栈开发竞争力处于市场前 21% 的区间",
            metrics: [
              { value: "74%", change: "2%", label: "岗位匹配度", desc: '与"Node.js全栈工程师"基本契合' },
              { value: "7.9 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.6" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 18 次，简历查看率 +15%" }
            ],
            skillDistribution: [
              { name: "Node.js", percentage: 35, color: "#007AFF", offset: 0 },
              { name: "数据库", percentage: 25, color: "#5E9EFF", offset: 35 },
              { name: "前端框架", percentage: 20, color: "#8EB9FF", offset: 60 },
              { name: "部署运维", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "Node.js开发", value: "76%", score: "7.6" },
              { label: "数据库设计", value: "74%", score: "7.4" },
              { label: "全栈能力", value: "75%", score: "7.5" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 68%" },
              { icon: "•", text: "高潜赛道：BFF架构，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +9%~13%" },
              { icon: "•", text: "技术栈匹配：76% 以上的全栈岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新Node.js项目经验，突出数据库和全栈能力",
              '开启"暗聘模式"，定向接收全栈团队直推',
              "学习微服务架构，提升后端能力",
              "参与Node.js开源项目，增加技术影响力"
            ],
            skillInsight: "Node.js和数据库构成核心优势，占总技能权重 60%。"
          },
          // Java开发工程师
          "7": {
            score: 79,
            competitiveDesc: "你的Java后端开发竞争力处于市场前 21% 的区间",
            metrics: [
              { value: "74%", change: "2%", label: "岗位匹配度", desc: '与"Java开发工程师"基本契合' },
              { value: "7.9 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.6" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 20 次，简历查看率 +18%" }
            ],
            skillDistribution: [
              { name: "Java核心", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "Spring生态", percentage: 25, color: "#5E9EFF", offset: 30 },
              { name: "数据库", percentage: 20, color: "#8EB9FF", offset: 55 },
              { name: "微服务", percentage: 25, color: "#C0D6FF", offset: 75 }
            ],
            coreAdvantages: [
              { label: "Java核心技术", value: "76%", score: "7.6" },
              { label: "Spring生态", value: "75%", score: "7.5" },
              { label: "微服务架构", value: "74%", score: "7.4" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（阿里）岗位匹配度 > 69%" },
              { icon: "•", text: "高潜赛道：云原生应用，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +8%~12%" },
              { icon: "•", text: "技术栈匹配：75% 以上的Java岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新Java核心项目经验，突出Spring生态和微服务架构能力",
              '开启"暗聘模式"，定向接收大厂后端团队直推',
              "学习云原生技术（Docker、Kubernetes），提升部署能力",
              "参与Java开源项目，增加技术影响力"
            ],
            skillInsight: "Java核心和Spring生态构成核心优势，占总技能权重 55%。"
          },
          // Python开发工程师
          "8": {
            score: 77,
            competitiveDesc: "你的Python后端开发竞争力处于市场前 23% 的区间",
            metrics: [
              { value: "72%", change: "2%", label: "岗位匹配度", desc: '与"Python开发工程师"基本契合' },
              { value: "7.7 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.5" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 17 次，简历查看率 +16%" }
            ],
            skillDistribution: [
              { name: "Python核心", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "Web框架", percentage: 25, color: "#5E9EFF", offset: 30 },
              { name: "数据处理", percentage: 25, color: "#8EB9FF", offset: 55 },
              { name: "DevOps", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "Python核心技术", value: "74%", score: "7.4" },
              { label: "数据处理", value: "73%", score: "7.3" },
              { label: "Web开发", value: "72%", score: "7.2" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 67%" },
              { icon: "•", text: "高潜赛道：AI 后端服务，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +7%~11%" },
              { icon: "•", text: "技术栈匹配：72% 以上的Python岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新Python核心项目经验，突出数据处理和Web框架能力",
              '开启"暗聘模式"，定向接收AI相关团队直推',
              "学习机器学习和深度学习框架，提升AI应用能力",
              "参与Python开源项目，增加技术影响力"
            ],
            skillInsight: "Python核心和数据处理构成核心优势，占总技能权重 55%。"
          },
          // Go开发工程师
          "9": {
            score: 76,
            competitiveDesc: "你的Go后端开发竞争力处于市场前 24% 的区间",
            metrics: [
              { value: "71%", change: "2%", label: "岗位匹配度", desc: '与"Go开发工程师"基本契合' },
              { value: "7.6 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.4" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 16 次，简历查看率 +14%" }
            ],
            skillDistribution: [
              { name: "Go核心", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "并发编程", percentage: 25, color: "#5E9EFF", offset: 30 },
              { name: "微服务", percentage: 25, color: "#8EB9FF", offset: 55 },
              { name: "DevOps", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "Go核心技术", value: "73%", score: "7.3" },
              { label: "并发编程", value: "72%", score: "7.2" },
              { label: "微服务架构", value: "71%", score: "7.1" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 66%" },
              { icon: "•", text: "高潜赛道：云原生应用，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +6%~10%" },
              { icon: "•", text: "技术栈匹配：70% 以上的Go岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新Go核心项目经验，突出并发编程和微服务架构能力",
              '开启"暗聘模式"，定向接收大厂后端团队直推',
              "学习云原生技术（Docker、Kubernetes），提升部署能力",
              "参与Go开源项目，增加技术影响力"
            ],
            skillInsight: "Go核心和并发编程构成核心优势，占总技能权重 55%。"
          },
          // C++开发工程师
          "10": {
            score: 75,
            competitiveDesc: "你的C++后端开发竞争力处于市场前 25% 的区间",
            metrics: [
              { value: "69%", change: "1%", label: "岗位匹配度", desc: '与"C++开发工程师"基本契合' },
              { value: "7.5 / 10.0", label: "技能广度", desc: "覆盖 3 大核心能力域，高于行业平均 0.3" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 14 次，简历查看率 +12%" }
            ],
            skillDistribution: [
              { name: "C++核心", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "性能优化", percentage: 25, color: "#5E9EFF", offset: 30 },
              { name: "系统编程", percentage: 25, color: "#8EB9FF", offset: 55 },
              { name: "网络编程", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "C++核心技术", value: "72%", score: "7.2" },
              { label: "性能优化", value: "71%", score: "7.1" },
              { label: "系统编程", value: "70%", score: "7.0" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（腾讯）岗位匹配度 > 63%" },
              { icon: "•", text: "高潜赛道：游戏开发，你的技能匹配度 B" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +5%~9%" },
              { icon: "•", text: "技术栈匹配：68% 以上的C++岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新C++核心项目经验，突出性能优化和系统编程能力",
              '开启"暗聘模式"，定向接收大厂后端团队直推',
              "学习游戏开发或嵌入式系统开发，提升专业领域能力",
              "参与C++开源项目，增加技术影响力"
            ],
            skillInsight: "C++核心和性能优化构成核心优势，占总技能权重 55%。"
          },
          // PHP开发工程师
          "11": {
            score: 74,
            competitiveDesc: "你的PHP后端开发竞争力处于市场前 26% 的区间",
            metrics: [
              { value: "68%", change: "1%", label: "岗位匹配度", desc: '与"PHP开发工程师"基本契合' },
              { value: "7.4 / 10.0", label: "技能广度", desc: "覆盖 3 大核心能力域，高于行业平均 0.2" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 13 次，简历查看率 +10%" }
            ],
            skillDistribution: [
              { name: "PHP核心", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "Web框架", percentage: 25, color: "#5E9EFF", offset: 30 },
              { name: "数据库", percentage: 25, color: "#8EB9FF", offset: 55 },
              { name: "前端集成", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "PHP核心技术", value: "71%", score: "7.1" },
              { label: "Web框架", value: "70%", score: "7.0" },
              { label: "数据库", value: "69%", score: "6.9" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（阿里）岗位匹配度 > 62%" },
              { icon: "•", text: "高潜赛道：电商系统开发，你的技能匹配度 B" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +4%~8%" },
              { icon: "•", text: "技术栈匹配：65% 以上的PHP岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新PHP核心项目经验，突出Web框架和数据库能力",
              '开启"暗聘模式"，定向接收电商企业直推',
              "学习现代前端框架，提升全栈开发能力",
              "参与PHP开源项目，增加技术影响力"
            ],
            skillInsight: "PHP核心和Web框架构成核心优势，占总技能权重 55%。"
          },
          // 微服务架构师
          "12": {
            score: 79,
            competitiveDesc: "你的微服务架构师竞争力处于市场前 21% 的区间",
            metrics: [
              { value: "74%", change: "2%", label: "岗位匹配度", desc: '与"微服务架构师"基本契合' },
              { value: "7.9 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.5" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 19 次，简历查看率 +17%" }
            ],
            skillDistribution: [
              { name: "微服务架构", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "云原生", percentage: 25, color: "#5E9EFF", offset: 30 },
              { name: "分布式系统", percentage: 25, color: "#8EB9FF", offset: 55 },
              { name: "DevOps", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "微服务架构", value: "76%", score: "7.6" },
              { label: "云原生", value: "75%", score: "7.5" },
              { label: "分布式系统", value: "74%", score: "7.4" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 69%" },
              { icon: "•", text: "高潜赛道：云原生架构，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +8%~12%" },
              { icon: "•", text: "技术栈匹配：75% 以上的微服务架构师岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新微服务架构项目经验，突出云原生和分布式系统能力",
              '开启"暗聘模式"，定向接收大厂架构团队直推',
              "学习Kubernetes和服务网格技术，提升云原生架构能力",
              "参与微服务相关开源项目，增加技术影响力"
            ],
            skillInsight: "微服务架构和云原生构成核心优势，占总技能权重 55%。"
          },
          // 产品经理
          "28": {
            score: 78,
            competitiveDesc: "你的产品经理竞争力处于市场前 22% 的区间",
            metrics: [
              { value: "73%", change: "2%", label: "岗位匹配度", desc: '与"产品经理"基本契合' },
              { value: "7.8 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.5" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 16 次，简历查看率 +14%" }
            ],
            skillDistribution: [
              { name: "产品规划", percentage: 32, color: "#007AFF", offset: 0 },
              { name: "用户研究", percentage: 28, color: "#5E9EFF", offset: 32 },
              { name: "数据分析", percentage: 22, color: "#8EB9FF", offset: 60 },
              { name: "沟通协调", percentage: 18, color: "#C0D6FF", offset: 82 }
            ],
            coreAdvantages: [
              { label: "产品规划", value: "75%", score: "7.5" },
              { label: "用户研究", value: "74%", score: "7.4" },
              { label: "数据分析", value: "73%", score: "7.3" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 68%" },
              { icon: "•", text: "高潜赛道：AI 产品经理，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +8%~12%" },
              { icon: "•", text: "行业经验：覆盖电商、社交等领域" }
            ],
            actions: [
              "优先更新产品规划项目经验，突出用户研究和数据分析能力",
              '开启"暗聘模式"，定向接收大厂产品团队直推',
              "学习AI产品设计，提升AI应用场景理解能力",
              "参与产品社区活动，增加产品思维影响力"
            ],
            skillInsight: "产品规划与用户研究构成核心优势，占总技能权重 60%。"
          },
          // UI设计师
          "31": {
            score: 75,
            competitiveDesc: "你的UI设计竞争力处于市场前 25% 的区间",
            metrics: [
              { value: "69%", change: "1%", label: "岗位匹配度", desc: '与"UI设计师"基本契合' },
              { value: "7.5 / 10.0", label: "技能广度", desc: "覆盖 3 大核心能力域，高于行业平均 0.3" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 14 次，简历查看率 +12%" }
            ],
            skillDistribution: [
              { name: "UI设计", percentage: 40, color: "#007AFF", offset: 0 },
              { name: "交互设计", percentage: 30, color: "#5E9EFF", offset: 40 },
              { name: "用户研究", percentage: 15, color: "#8EB9FF", offset: 70 },
              { name: "动效设计", percentage: 15, color: "#C0D6FF", offset: 85 }
            ],
            coreAdvantages: [
              { label: "UI设计", value: "71%", score: "7.1" },
              { label: "交互设计", value: "70%", score: "7.0" },
              { label: "视觉美感", value: "72%", score: "7.2" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 63%" },
              { icon: "•", text: "高潜赛道：AI 产品界面设计，你的技能匹配度 B" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +5%~9%" },
              { icon: "•", text: "设计工具：熟悉Figma、Sketch等主流设计工具" }
            ],
            actions: [
              "优先更新UI设计项目经验，突出视觉美感和交互设计能力",
              '开启"暗聘模式"，定向接收大厂设计团队直推',
              "学习AI产品界面设计，提升AI交互体验设计能力",
              "参与设计社区活动，增加设计作品影响力"
            ],
            skillInsight: "UI设计和交互设计构成核心优势，占总技能权重 70%。"
          },
          // 数据分析师
          "17": {
            score: 80,
            competitiveDesc: "你的数据/AI竞争力处于市场前 20% 的区间",
            metrics: [
              { value: "75%", change: "2%", label: "岗位匹配度", desc: '与"数据分析师"基本契合' },
              { value: "8.0 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.6" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 22 次，简历查看率 +18%" }
            ],
            skillDistribution: [
              { name: "数据处理", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "算法能力", percentage: 30, color: "#5E9EFF", offset: 30 },
              { name: "模型训练", percentage: 25, color: "#8EB9FF", offset: 60 },
              { name: "业务理解", percentage: 15, color: "#C0D6FF", offset: 85 }
            ],
            coreAdvantages: [
              { label: "算法能力", value: "77%", score: "7.7" },
              { label: "数据处理", value: "76%", score: "7.6" },
              { label: "模型训练", value: "75%", score: "7.5" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 70%" },
              { icon: "•", text: "高潜赛道：大模型应用开发，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +9%~13%" },
              { icon: "•", text: "技术栈匹配：78% 以上的数据/AI岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新数据处理和算法项目经验，突出模型训练和业务理解能力",
              '开启"暗聘模式"，定向接收AI相关团队直推',
              "学习大模型应用开发，提升AI落地能力",
              "参与AI开源项目，增加技术影响力"
            ],
            skillInsight: "数据处理和算法能力构成核心优势，占总技能权重 60%。"
          },
          // 测试工程师
          "25": {
            score: 74,
            competitiveDesc: "你的测试竞争力处于市场前 26% 的区间",
            metrics: [
              { value: "68%", change: "1%", label: "岗位匹配度", desc: '与"测试工程师"基本契合' },
              { value: "7.4 / 10.0", label: "技能广度", desc: "覆盖 3 大核心能力域，高于行业平均 0.3" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 12 次，简历查看率 +10%" }
            ],
            skillDistribution: [
              { name: "功能测试", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "自动化测试", percentage: 25, color: "#5E9EFF", offset: 30 },
              { name: "性能测试", percentage: 20, color: "#8EB9FF", offset: 55 },
              { name: "安全测试", percentage: 25, color: "#C0D6FF", offset: 75 }
            ],
            coreAdvantages: [
              { label: "功能测试", value: "70%", score: "7.0" },
              { label: "自动化测试", value: "69%", score: "6.9" },
              { label: "性能测试", value: "68%", score: "6.8" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 62%" },
              { icon: "•", text: "高潜赛道：AI 测试，你的技能匹配度 B" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +4%~8%" },
              { icon: "•", text: "测试工具：熟悉Selenium、Jmeter等主流测试工具" }
            ],
            actions: [
              "优先更新功能测试和自动化测试项目经验，突出性能测试和安全测试能力",
              '开启"暗聘模式"，定向接收大厂测试团队直推',
              "学习AI测试方法，提升AI产品测试能力",
              "参与测试社区活动，增加测试经验分享"
            ],
            skillInsight: "功能测试和自动化测试构成核心优势，占总技能权重 55%。"
          },
          // Android开发工程师
          "13": {
            score: 76,
            competitiveDesc: "你的移动端开发竞争力处于市场前 24% 的区间",
            metrics: [
              { value: "71%", change: "2%", label: "岗位匹配度", desc: '与"Android开发工程师"基本契合' },
              { value: "7.6 / 10.0", label: "技能广度", desc: "覆盖 4 大核心能力域，高于行业平均 0.4" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 17 次，简历查看率 +14%" }
            ],
            skillDistribution: [
              { name: "移动开发", percentage: 35, color: "#007AFF", offset: 0 },
              { name: "UI/UX", percentage: 25, color: "#5E9EFF", offset: 35 },
              { name: "性能优化", percentage: 20, color: "#8EB9FF", offset: 60 },
              { name: "跨平台", percentage: 20, color: "#C0D6FF", offset: 80 }
            ],
            coreAdvantages: [
              { label: "移动开发", value: "73%", score: "7.3" },
              { label: "UI/UX设计", value: "72%", score: "7.2" },
              { label: "性能优化", value: "71%", score: "7.1" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 66%" },
              { icon: "•", text: "高潜赛道：AI 移动应用，你的技能匹配度 B+" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +6%~10%" },
              { icon: "•", text: "技术栈匹配：70% 以上的移动端岗位要求与你的技能基本匹配" }
            ],
            actions: [
              "优先更新移动端开发项目经验，突出UI/UX设计和性能优化能力",
              '开启"暗聘模式"，定向接收大厂移动开发团队直推',
              "学习跨平台技术（Flutter、React Native），提升全栈能力",
              "参与移动开发开源项目，增加技术影响力"
            ],
            skillInsight: "移动开发和UI/UX设计构成核心优势，占总技能权重 60%。"
          },
          // 默认数据（用于未定义的职位）
          "default": {
            score: 72,
            competitiveDesc: "你的竞争力处于市场前 28% 的区间",
            metrics: [
              { value: "66%", change: "1%", label: "岗位匹配度", desc: "与当前职位基本契合" },
              { value: "7.2 / 10.0", label: "技能广度", desc: "覆盖 3 大核心能力域，高于行业平均 0.2" },
              { value: "温 🌡️", label: "市场热度", desc: "近7日被搜索 10 次，简历查看率 +8%" }
            ],
            skillDistribution: [
              { name: "专业技能", percentage: 30, color: "#007AFF", offset: 0 },
              { name: "项目经验", percentage: 25, color: "#5E9EFF", offset: 30 },
              { name: "沟通能力", percentage: 20, color: "#8EB9FF", offset: 55 },
              { name: "学习能力", percentage: 25, color: "#C0D6FF", offset: 75 }
            ],
            coreAdvantages: [
              { label: "专业技能", value: "68%", score: "6.8" },
              { label: "项目经验", value: "67%", score: "6.7" },
              { label: "沟通能力", value: "66%", score: "6.6" }
            ],
            opportunities: [
              { icon: "•", text: "头部大厂机会：1 家（字节跳动）岗位匹配度 > 60%" },
              { icon: "•", text: "高潜赛道：数字化转型，你的技能匹配度 B" },
              { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +2%~6%" }
            ],
            actions: [
              "优先更新专业技能和项目经验，突出沟通能力和学习能力",
              '开启"暗聘模式"，定向接收相关企业直推',
              "学习数字化转型相关技能，提升职场竞争力",
              "参与行业社区活动，增加行业经验分享"
            ],
            skillInsight: "专业技能和项目经验构成核心优势，占总技能权重 55%。"
          }
        }
      };
    },
    computed: {
      // 当前分类下的职位列表
      currentPositions() {
        if (!this.selectedCategoryId)
          return [];
        return this.positionDetails[this.selectedCategoryId] || [];
      }
    },
    onLoad() {
      this.initTheme();
      this.initializeDefaultSelection();
      this.fetchUserInfo();
    },
    onUnload() {
      uni.$off("globalThemeChange", this.handleGlobalThemeChange);
    },
    methods: {
      /**
       * 初始化主题
       */
      initTheme() {
        this.currentTheme = themeManager.getCurrentTheme();
        this.isDarkMode = this.currentTheme === "dark";
        uni.$on("globalThemeChange", this.handleGlobalThemeChange);
      },
      /**
       * 处理全局主题变化
       */
      handleGlobalThemeChange(data) {
        this.currentTheme = data.theme;
        this.isDarkMode = data.isDark;
      },
      goBack() {
        uni.navigateBack();
      },
      // 初始化默认选择
      initializeDefaultSelection() {
        const backendCategory = this.mainCategories.find((cat) => cat.name === "后端开发");
        if (backendCategory) {
          this.selectedCategoryId = backendCategory.id;
          this.selectedCategoryName = backendCategory.name;
          const positions = this.positionDetails[backendCategory.id] || [];
          if (positions.length > 0) {
            const pythonDeveloper = positions.find((pos) => pos.name === "Python开发工程师");
            if (pythonDeveloper) {
              this.selectedPositionId = pythonDeveloper.id;
              this.selectedPositionName = pythonDeveloper.name;
            } else {
              this.selectedPositionId = positions[0].id;
              this.selectedPositionName = positions[0].name;
            }
            this.loadPositionData(this.selectedPositionId);
          }
        }
      },
      // 加载职位数据（从静态映射表）
      loadPositionData(positionId) {
        const positionData = this.positionDataMap[positionId] || this.positionDataMap["default"];
        if (positionData) {
          this.score = positionData.score;
          this.competitiveDesc = positionData.competitiveDesc;
          this.metrics = positionData.metrics;
          this.skillDistribution = positionData.skillDistribution;
          this.coreAdvantages = positionData.coreAdvantages;
          this.opportunities = positionData.opportunities;
          this.actions = positionData.actions;
          this.skillInsight = positionData.skillInsight;
        }
      },
      // 打开级联选择器
      openCascadePicker() {
        this.showCascadePicker = true;
      },
      // 关闭级联选择器
      closeCascadePicker() {
        this.showCascadePicker = false;
      },
      // 选择分类
      selectCategory(category) {
        this.selectedCategoryId = category.id;
        this.selectedCategoryName = category.name;
        const positions = this.positionDetails[category.id] || [];
        if (positions.length > 0) {
          this.selectedPositionId = positions[0].id;
          this.selectedPositionName = positions[0].name;
          this.loadPositionData(this.selectedPositionId);
        } else {
          this.selectedPositionId = "";
          this.selectedPositionName = "";
        }
      },
      // 选择职位
      selectPosition(position) {
        this.selectedPositionId = position.id;
        this.selectedPositionName = position.name;
        this.loadPositionData(this.selectedPositionId);
      },
      // 确认选择
      confirmCascadeSelection() {
        this.showCascadePicker = false;
        if (this.selectedPositionId) {
          this.loadPositionData(this.selectedPositionId);
        }
      },
      // 检查头像数据是否有效
      isValidAvatar(avatar) {
        if (!avatar || avatar === "") {
          return false;
        }
        if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
          return false;
        }
        const cleaned = avatar.replace(/\s+/g, "");
        return cleaned.length > 0;
      },
      // 获取用户信息
      async fetchUserInfo() {
        try {
          const userInfo = uni.getStorageSync("userInfo");
          if (userInfo) {
            if (typeof userInfo === "string") {
              try {
                this.userInfo = JSON.parse(userInfo);
              } catch (e) {
                formatAppLog("error", "at pages/chart.vue:1030", "解析userInfo失败:", e);
                this.userInfo = null;
              }
            } else {
              this.userInfo = userInfo;
            }
          }
          try {
            const res = await userApi.getUserNameAndAvatar();
            if (res) {
              this.userInfo.nickname = res.user_name || res.real_name;
              if (this.isValidAvatar(res.user_avatar)) {
                this.userInfo.avatar = res.user_avatar;
              }
              const userInfoToSave = {
                nickname: res.user_name || res.real_name,
                avatar: this.userInfo.avatar
              };
              uni.setStorageSync("userInfo", JSON.stringify(userInfoToSave));
            }
          } catch (error) {
            formatAppLog("error", "at pages/chart.vue:1056", "获取用户名称和头像失败:", error);
            try {
              const res = await userApi.getUserProfile();
              if (res) {
                this.userInfo.nickname = res.real_name || res.name;
                if (this.isValidAvatar(res.avatar_url || res.avatar)) {
                  this.userInfo.avatar = res.avatar_url || res.avatar;
                }
                const userInfoToSave = {
                  nickname: res.real_name || res.name,
                  avatar: this.userInfo.avatar
                };
                uni.setStorageSync("userInfo", JSON.stringify(userInfoToSave));
              }
            } catch (error2) {
              formatAppLog("error", "at pages/chart.vue:1073", "获取用户信息失败:", error2);
            }
          }
          try {
            const intention = await resumeApi.getIntention();
            if (intention && intention.target_positions) {
              if (Array.isArray(intention.target_positions)) {
                this.userInfo.positions = intention.target_positions;
              } else if (intention.target_positions) {
                this.userInfo.positions = [intention.target_positions];
              }
            }
          } catch (error) {
            formatAppLog("error", "at pages/chart.vue:1090", "获取用户期望职位失败:", error);
          }
        } catch (error) {
          formatAppLog("error", "at pages/chart.vue:1093", "获取用户信息失败:", error);
        }
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "chart-page",
        style: vue.normalizeStyle({ background: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)" })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "nav-bar",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "nav-bar-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-back-icon",
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args)),
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "<",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-center" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "nav-bar-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "竞争力分析",
                4
                /* STYLE */
              )
            ]),
            vue.createElementVNode("view", { class: "nav-bar-right" })
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "user-card",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "user-header-center" }, [
              vue.createElementVNode("image", {
                class: "avatar-large",
                src: $data.userInfo.avatar ? "data:image/jpeg;base64," + $data.userInfo.avatar.replace(/\s+/g, "") : "https://a0ai.marscode.cn/api/ide/v1/text_to_image?prompt=professional%20profile%20avatar%20portrait&image_size=square",
                mode: "aspectFill"
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "text",
                {
                  class: "user-name-large",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                vue.toDisplayString($data.userInfo.nickname || "加载中..."),
                5
                /* TEXT, STYLE */
              ),
              $data.userInfo.positions ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "user-positions"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.userInfo.positions, (position, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: index,
                        class: "user-title-large",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                      },
                      vue.toDisplayString(position) + vue.toDisplayString(index < $data.userInfo.positions.length - 1 ? " " : ""),
                      5
                      /* TEXT, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 1,
                  class: "user-title-large",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                },
                vue.toDisplayString($data.userInfo.position || "加载中..."),
                5
                /* TEXT, STYLE */
              )),
              vue.createElementVNode(
                "view",
                {
                  class: "competitive-tag-large",
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "linear-gradient(120deg, #3a3a3a, #4a4a4a)" : "linear-gradient(120deg, #4facfe, #00f2fe)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.3)" })
                },
                [
                  vue.createElementVNode(
                    "text",
                    {
                      class: "tag-text-large",
                      style: { color: "#ffffff" }
                    },
                    "竞争力评级 " + vue.toDisplayString($data.userInfo.competitiveLevel || "A+"),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", {
                    class: "arrow-icon-large",
                    style: { color: "#ffffff" }
                  }, "↑")
                ],
                4
                /* STYLE */
              )
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "competitive-card",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "competitive-header" }, [
              vue.createElementVNode("view", { class: "ring-chart-container" }, [
                vue.createElementVNode("view", { class: "ring-chart" }, [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "ring-background",
                      style: vue.normalizeStyle({ borderColor: $data.isDarkMode ? "#404040" : "#E5E5EA" })
                    },
                    null,
                    4
                    /* STYLE */
                  ),
                  vue.createElementVNode("view", {
                    class: "ring-progress",
                    style: { borderTopColor: "#4facfe", borderRightColor: "#00f2fe" }
                  }),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "ring-center",
                      style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)" })
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "score",
                          style: { color: "#007AFF" }
                        },
                        vue.toDisplayString($data.score),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: "score-label",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                        },
                        "综合竞争力百分位",
                        4
                        /* STYLE */
                      )
                    ],
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode(
                  "text",
                  {
                    class: "competitive-desc",
                    style: { color: "#007AFF" }
                  },
                  vue.toDisplayString($data.competitiveDesc),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "position-selector-container" }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: "input-label",
                    style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                  },
                  "职位选择",
                  4
                  /* STYLE */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: "cascade-selector",
                    onClick: _cache[1] || (_cache[1] = (...args) => $options.openCascadePicker && $options.openCascadePicker(...args)),
                    style: vue.normalizeStyle({ background: $data.isDarkMode ? "#404040" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)", borderColor: $data.isDarkMode ? "#404040" : "transparent" })
                  },
                  [
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["selector-content", { "placeholder": !$data.selectedPositionId }]),
                        style: vue.normalizeStyle({ color: !$data.selectedPositionId ? "#999" : $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                      },
                      [
                        $data.selectedPositionId ? (vue.openBlock(), vue.createElementBlock(
                          "text",
                          { key: 0 },
                          vue.toDisplayString($data.selectedCategoryName) + " - " + vue.toDisplayString($data.selectedPositionName),
                          1
                          /* TEXT */
                        )) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "请选择职位"))
                      ],
                      6
                      /* CLASS, STYLE */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "arrow-icon",
                        style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                      },
                      "›",
                      4
                      /* STYLE */
                    )
                  ],
                  4
                  /* STYLE */
                )
              ])
            ])
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("view", { class: "metrics-container" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.metrics, (metric, index) => {
              return vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  class: "metric-card",
                  key: index,
                  style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
                },
                [
                  vue.createElementVNode("text", {
                    class: "metric-value",
                    style: { color: "#007AFF" }
                  }, [
                    vue.createTextVNode(
                      vue.toDisplayString(metric.value) + " ",
                      1
                      /* TEXT */
                    ),
                    metric.change ? (vue.openBlock(), vue.createElementBlock(
                      "text",
                      {
                        key: 0,
                        class: "metric-change"
                      },
                      "↑ " + vue.toDisplayString(metric.change),
                      1
                      /* TEXT */
                    )) : vue.createCommentVNode("v-if", true)
                  ]),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "metric-label",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                    },
                    vue.toDisplayString(metric.label),
                    5
                    /* TEXT, STYLE */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: "metric-desc",
                      style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                    },
                    vue.toDisplayString(metric.desc),
                    5
                    /* TEXT, STYLE */
                  )
                ],
                4
                /* STYLE */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createElementVNode("view", { class: "chart-section" }, [
          vue.createElementVNode(
            "view",
            {
              class: "chart-card",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "chart-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "技能权重分布",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "pie-chart-container" }, [
                vue.createElementVNode("view", { class: "pie-chart" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.skillDistribution, (sector, index) => {
                      return vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          class: "pie-sector",
                          key: index,
                          style: vue.normalizeStyle({ "--percentage": sector.percentage, "--color": sector.color, "--offset": sector.offset })
                        },
                        null,
                        4
                        /* STYLE */
                      );
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  )),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "pie-center",
                      style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)" })
                    },
                    [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "pie-center-text",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                        },
                        "技能",
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: "pie-center-subtext",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                        },
                        "分布",
                        4
                        /* STYLE */
                      )
                    ],
                    4
                    /* STYLE */
                  )
                ]),
                vue.createElementVNode("view", { class: "pie-legend" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.skillDistribution, (sector, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "legend-item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: "legend-color",
                            style: vue.normalizeStyle({ background: "linear-gradient(120deg, " + sector.color + ", " + sector.color + "80)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" })
                          },
                          null,
                          4
                          /* STYLE */
                        ),
                        vue.createElementVNode(
                          "text",
                          {
                            class: "legend-text",
                            style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                          },
                          vue.toDisplayString(sector.name) + " " + vue.toDisplayString(sector.percentage) + "%",
                          5
                          /* TEXT, STYLE */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: "chart-insight",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D", background: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(248, 250, 253, 0.8)", backdropFilter: "blur(10px)" })
                },
                vue.toDisplayString($data.skillInsight),
                5
                /* TEXT, STYLE */
              )
            ],
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "chart-card",
              style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
            },
            [
              vue.createElementVNode(
                "text",
                {
                  class: "chart-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "核心优势对比",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "bar-chart-container" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.coreAdvantages, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      class: "bar-item",
                      key: index
                    }, [
                      vue.createElementVNode(
                        "text",
                        {
                          class: "bar-label",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D" })
                        },
                        vue.toDisplayString(item.label),
                        5
                        /* TEXT, STYLE */
                      ),
                      vue.createElementVNode(
                        "view",
                        {
                          class: "bar-wrapper",
                          style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(233, 236, 241, 0.8)", backdropFilter: "blur(10px)" })
                        },
                        [
                          vue.createElementVNode(
                            "view",
                            {
                              class: "bar-fill",
                              style: vue.normalizeStyle({ width: item.value, background: "linear-gradient(90deg, #4facfe, #00f2fe)" })
                            },
                            null,
                            4
                            /* STYLE */
                          )
                        ],
                        4
                        /* STYLE */
                      ),
                      vue.createElementVNode(
                        "text",
                        {
                          class: "bar-value",
                          style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                        },
                        vue.toDisplayString(item.score),
                        5
                        /* TEXT, STYLE */
                      )
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode(
                "text",
                {
                  class: "chart-insight",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#999" : "#6C757D", background: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(248, 250, 253, 0.8)", backdropFilter: "blur(10px)" })
                },
                "跨部门协同力为最强优势，可重点在面试中举例。",
                4
                /* STYLE */
              )
            ],
            4
            /* STYLE */
          )
        ]),
        vue.createElementVNode(
          "view",
          {
            class: "insight-section",
            style: vue.normalizeStyle({ background: $data.isDarkMode ? "linear-gradient(180deg, rgba(44, 44, 44, 0.8), rgba(26, 26, 26, 0.8))" : "linear-gradient(180deg, rgba(232, 240, 254, 0.8), rgba(255, 255, 255, 0.8))", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)" })
          },
          [
            vue.createElementVNode("view", { class: "insight-left" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "insight-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "机会雷达",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "insight-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.opportunities, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        class: "insight-item",
                        key: index,
                        style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)" })
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "insight-dot",
                            style: { color: "#007AFF" }
                          },
                          vue.toDisplayString(item.icon),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          {
                            class: "insight-text",
                            style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#3A3A3A" })
                          },
                          vue.toDisplayString(item.text),
                          5
                          /* TEXT, STYLE */
                        )
                      ],
                      4
                      /* STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            vue.createElementVNode("view", { class: "insight-right" }, [
              vue.createElementVNode(
                "text",
                {
                  class: "insight-title",
                  style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#1E1E1E" })
                },
                "行动建议",
                4
                /* STYLE */
              ),
              vue.createElementVNode("view", { class: "action-list" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.actions, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "view",
                      {
                        class: "action-item",
                        key: index,
                        style: vue.normalizeStyle({ background: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)" })
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          {
                            class: "action-text",
                            style: vue.normalizeStyle({ color: $data.isDarkMode ? "#ffffff" : "#3A3A3A" })
                          },
                          vue.toDisplayString(item),
                          5
                          /* TEXT, STYLE */
                        )
                      ],
                      4
                      /* STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            vue.createElementVNode(
              "text",
              {
                class: "model-version",
                style: vue.normalizeStyle({ color: $data.isDarkMode ? "#666" : "#ADB5BD", borderTop: $data.isDarkMode ? "1px solid #404040" : "1px solid #E9ECF1" })
              },
              "竞争力模型 v3.2 · 基于 2026 年招聘软件市场数据 | 覆盖全国31个主要城市",
              4
              /* STYLE */
            )
          ],
          4
          /* STYLE */
        ),
        $data.showCascadePicker ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "cascade-overlay",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.closeCascadePicker && $options.closeCascadePicker(...args))
        }, [
          vue.createElementVNode("view", {
            class: "cascade-modal",
            onClick: _cache[3] || (_cache[3] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("view", { class: "cascade-header" }, [
              vue.createElementVNode("text", { class: "cascade-title" }, "选择职位"),
              vue.createElementVNode("text", {
                class: "cascade-close",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.confirmCascadeSelection && $options.confirmCascadeSelection(...args))
              }, "确定")
            ]),
            vue.createElementVNode("view", { class: "cascade-body" }, [
              vue.createElementVNode("scroll-view", {
                class: "category-list",
                "scroll-y": ""
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.mainCategories, (category) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: category.id,
                      class: vue.normalizeClass(["category-item", $data.selectedCategoryId === category.id ? "active" : ""]),
                      onClick: ($event) => $options.selectCategory(category)
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(category.name),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ]),
              vue.createElementVNode("scroll-view", {
                class: "position-list",
                "scroll-y": ""
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($options.currentPositions, (position) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: position.id,
                      class: vue.normalizeClass(["position-item", $data.selectedPositionId === position.id ? "active" : ""]),
                      onClick: ($event) => $options.selectPosition(position)
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString(position.name),
                        1
                        /* TEXT */
                      ),
                      $data.selectedPositionId === position.id ? (vue.openBlock(), vue.createElementBlock("text", {
                        key: 0,
                        class: "check-icon"
                      }, "✓")) : vue.createCommentVNode("v-if", true)
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ],
      4
      /* STYLE */
    );
  }
  const PagesChart = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/pages/chart.vue"]]);
  __definePage("pages/splash/splash", PagesSplashSplash);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/login/register/login_reister", PagesLoginRegisterLoginReister);
  __definePage("pages/login/forget/login_forget", PagesLoginForgetLoginForget);
  __definePage("pages/index/index_index", PagesIndexIndexIndex);
  __definePage("pages/job/detail/job_detail_index", PagesJobDetailJobDetailIndex);
  __definePage("pages/job/add/job_add_index", PagesJobAddJobAddIndex);
  __definePage("pages/user/user", PagesUserUser);
  __definePage("pages/user/resume/user_resume", PagesUserResumeUserResume);
  __definePage("pages/user/collection/user_collection", PagesUserCollectionUserCollection);
  __definePage("pages/user/deliver/user_deliver", PagesUserDeliverUserDeliver);
  __definePage("pages/user/feedback/user_feedback", PagesUserFeedbackUserFeedback);
  __definePage("pages/user/account/user_account", PagesUserAccountUserAccount);
  __definePage("pages/user/device/user_device", PagesUserDeviceUserDevice);
  __definePage("pages/user/display/user_display", PagesUserDisplayUserDisplay);
  __definePage("pages/user/account/number/account_number", PagesUserAccountNumberAccountNumber);
  __definePage("pages/user/account/number/number_change", PagesUserAccountNumberNumberChange);
  __definePage("pages/user/account/email/account_email", PagesUserAccountEmailAccountEmail);
  __definePage("pages/user/account/email/email_change", PagesUserAccountEmailEmailChange);
  __definePage("pages/user/account/code/account_code", PagesUserAccountCodeAccountCode);
  __definePage("pages/AI/AI", PagesAIAI);
  __definePage("pages/AI/interview", PagesAIInterview);
  __definePage("pages/forum/forum", PagesForumForum);
  __definePage("pages/forum/details/forum_detail", PagesForumDetailsForumDetail);
  __definePage("pages/forum/post", PagesForumPost);
  __definePage("pages/chart", PagesChart);
  const _sfc_main$2 = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:6", "App Launch");
      setTimeout(() => {
        this.initAppTheme();
        this.listenSystemThemeChange();
      }, 50);
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:16", "App Show");
      setTimeout(() => {
        this.initAppTheme();
      }, 50);
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:24", "App Hide");
    },
    methods: {
      /**
       * 初始化应用主题
       */
      initAppTheme() {
        try {
          const currentTheme = themeManager.getCurrentTheme();
          const themeMode = themeManager.getThemeMode();
          formatAppLog("log", "at App.vue:36", "当前主题:", currentTheme, "主题模式:", themeMode);
          this.applyGlobalTheme(currentTheme);
          themeManager.notifyThemeChange(currentTheme);
        } catch (error) {
          formatAppLog("error", "at App.vue:45", "初始化主题失败:", error);
        }
      },
      /**
       * 应用全局主题
       */
      applyGlobalTheme(theme) {
        formatAppLog("log", "at App.vue:55", "应用主题:", theme);
      },
      /**
       * 监听系统主题变化
       */
      listenSystemThemeChange() {
        themeManager.onSystemThemeChange((newTheme) => {
          formatAppLog("log", "at App.vue:63", "系统主题变化:", newTheme);
          this.applyGlobalTheme(newTheme);
        });
      }
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/App.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$1 = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick(e) {
        this.$emit("click", e);
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const uniIcons = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-946bce22"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/node_modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue"]]);
  const _sfc_main = {
    name: "UniDrawer",
    components: {},
    emits: ["change"],
    props: {
      /**
       * 显示模式（左、右），只在初始化生效
       */
      mode: {
        type: String,
        default: ""
      },
      /**
       * 蒙层显示状态
       */
      mask: {
        type: Boolean,
        default: true
      },
      /**
       * 遮罩是否可点击关闭
       */
      maskClick: {
        type: Boolean,
        default: true
      },
      /**
       * 抽屉宽度
       */
      width: {
        type: Number,
        default: 220
      }
    },
    data() {
      return {
        visibleSync: false,
        showDrawer: false,
        rightMode: false,
        watchTimer: null,
        drawerWidth: 220
      };
    },
    created() {
      this.drawerWidth = this.width;
      this.rightMode = this.mode === "right";
    },
    methods: {
      clear() {
      },
      close(type) {
        if (type === "mask" && !this.maskClick || !this.visibleSync)
          return;
        this._change("showDrawer", "visibleSync", false);
      },
      open() {
        if (this.visibleSync)
          return;
        this._change("visibleSync", "showDrawer", true);
      },
      _change(param1, param2, status) {
        this[param1] = status;
        if (this.watchTimer) {
          clearTimeout(this.watchTimer);
        }
        this.watchTimer = setTimeout(() => {
          this[param2] = status;
          this.$emit("change", status);
        }, status ? 50 : 300);
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.visibleSync ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass([{ "uni-drawer--visible": $data.showDrawer }, "uni-drawer"]),
        onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.clear && $options.clear(...args), ["stop", "prevent"]))
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-drawer__mask", { "uni-drawer__mask--visible": $data.showDrawer && $props.mask }]),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.close("mask"))
          },
          null,
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-drawer__content", { "uni-drawer--right": $data.rightMode, "uni-drawer--left": !$data.rightMode, "uni-drawer__content--visible": $data.showDrawer }]),
            style: vue.normalizeStyle({ width: $data.drawerWidth + "px" })
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      34
      /* CLASS, NEED_HYDRATION */
    )) : vue.createCommentVNode("v-if", true);
  }
  const uniDrawer = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-183a7e94"], ["__file", "D:/HBuilderX/HBuilderProjects/computer_design_boss_front-end/computer_design_boss_front-end/node_modules/@dcloudio/uni-ui/lib/uni-drawer/uni-drawer.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    app.component("uni-icons", uniIcons);
    app.component("uni-drawer", uniDrawer);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
