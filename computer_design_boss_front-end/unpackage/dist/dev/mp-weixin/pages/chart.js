"use strict";
var common_vendor = require("../common/vendor.js");
var common_utils_themeSimple = require("../common/utils/theme-simple.js");
const _sfc_main = {
  data() {
    return {
      currentTheme: "light",
      isDarkMode: false,
      score: 96,
      metrics: [
        {
          value: "94%",
          change: "3%",
          label: "\u5C97\u4F4D\u5339\u914D\u5EA6",
          desc: '\u4E0E"\u8D44\u6DF1\u4EA7\u54C1\u7ECF\u7406"\u9AD8\u5EA6\u5951\u5408'
        },
        {
          value: "8.6 / 10.0",
          label: "\u6280\u80FD\u5E7F\u5EA6",
          desc: "\u8986\u76D6 5 \u5927\u6838\u5FC3\u80FD\u529B\u57DF\uFF0C\u9AD8\u4E8E\u884C\u4E1A\u5E73\u5747 1.2"
        },
        {
          value: "\u6781\u70ED \u{1F525}",
          label: "\u5E02\u573A\u70ED\u5EA6",
          desc: "\u8FD17\u65E5\u88AB\u641C\u7D22 24 \u6B21\uFF0C\u7B80\u5386\u67E5\u770B\u7387 +28%"
        }
      ],
      skillDistribution: [
        { name: "\u4EA7\u54C1\u89C4\u5212", percentage: 32, color: "#007AFF", offset: 0 },
        { name: "\u7528\u6237\u7814\u7A76", percentage: 28, color: "#5E9EFF", offset: 32 },
        { name: "\u6570\u636E\u5206\u6790", percentage: 22, color: "#8EB9FF", offset: 60 },
        { name: "\u6C9F\u901A\u534F\u8C03", percentage: 18, color: "#C0D6FF", offset: 82 }
      ],
      coreAdvantages: [
        { label: "\u5168\u94FE\u8DEF\u4EA7\u54C1\u7ECF\u9A8C", value: "92%", score: "9.2" },
        { label: "\u6570\u636E\u9A71\u52A8\u51B3\u7B56", value: "89%", score: "8.9" },
        { label: "\u8DE8\u90E8\u95E8\u534F\u540C\u529B", value: "95%", score: "9.5" }
      ],
      opportunities: [
        { icon: "\u2022", text: "\u5934\u90E8\u5927\u5382\u673A\u4F1A\uFF1A3 \u5BB6\uFF08\u5B57\u8282\u8DF3\u52A8\u3001\u7F8E\u56E2\u3001\u6EF4\u6EF4\uFF09\u5C97\u4F4D\u5339\u914D\u5EA6 > 85%" },
        { icon: "\u2022", text: "\u9AD8\u6F5C\u8D5B\u9053\uFF1AAI \u5E94\u7528\u5C42\u4EA7\u54C1\u5C97\u4F4D\uFF0C\u4F60\u7684\u6280\u80FD\u5339\u914D\u5EA6 A+" },
        { icon: "\u2022", text: "\u85AA\u8D44\u6EA2\u4EF7\u533A\u95F4\uFF1A\u57FA\u4E8E\u7ADE\u4E89\u529B\u6A21\u578B\uFF0C\u5F53\u524D\u5E02\u573A\u6EA2\u4EF7 +15%~20%" }
      ],
      actions: [
        '\u4F18\u5148\u66F4\u65B0"\u9879\u76EE\u6210\u679C"\u6A21\u5757\uFF0C\u589E\u52A0\u5177\u4F53\u589E\u957F\u6570\u636E',
        '\u5F00\u542F"\u6697\u8058\u6A21\u5F0F"\uFF0C\u5B9A\u5411\u63A5\u6536\u76EE\u6807\u4F01\u4E1A\u76F4\u63A8'
      ]
    };
  },
  onLoad() {
    this.initTheme();
  },
  onUnload() {
    common_vendor.index.$off("globalThemeChange", this.handleGlobalThemeChange);
  },
  methods: {
    initTheme() {
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme;
      this.isDarkMode = data.isDark;
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    d: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    f: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    g: $data.isDarkMode ? "#999" : "#6C757D",
    h: $data.isDarkMode ? "#3a3a3a" : "#E8F0FE",
    i: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    j: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    k: $data.isDarkMode ? "#404040" : "#E5E5EA",
    l: common_vendor.t($data.score),
    m: $data.isDarkMode ? "#999" : "#6C757D",
    n: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    o: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    p: common_vendor.f($data.metrics, (metric, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(metric.value),
        b: metric.change
      }, metric.change ? {
        c: common_vendor.t(metric.change)
      } : {}, {
        d: common_vendor.t(metric.label),
        e: common_vendor.t(metric.desc),
        f: index
      });
    }),
    q: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    r: $data.isDarkMode ? "#999" : "#6C757D",
    s: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    t: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    v: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    w: common_vendor.f($data.skillDistribution, (sector, index, i0) => {
      return {
        a: index,
        b: sector.percentage,
        c: sector.color,
        d: sector.offset
      };
    }),
    x: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    y: $data.isDarkMode ? "#999" : "#6C757D",
    z: $data.isDarkMode ? "#3a3a3a" : "#ffffff",
    A: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
    B: common_vendor.f($data.skillDistribution, (sector, index, i0) => {
      return {
        a: sector.color,
        b: common_vendor.t(sector.name),
        c: common_vendor.t(sector.percentage),
        d: index
      };
    }),
    C: $data.isDarkMode ? "#999" : "#6C757D",
    D: $data.isDarkMode ? "#999" : "#6C757D",
    E: $data.isDarkMode ? "#3a3a3a" : "#F8FAFD",
    F: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    G: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    H: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    I: common_vendor.f($data.coreAdvantages, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: item.value,
        c: common_vendor.t(item.score),
        d: index
      };
    }),
    J: $data.isDarkMode ? "#999" : "#6C757D",
    K: $data.isDarkMode ? "#404040" : "#E9ECF1",
    L: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    M: $data.isDarkMode ? "#999" : "#6C757D",
    N: $data.isDarkMode ? "#3a3a3a" : "#F8FAFD",
    O: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    P: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    Q: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    R: common_vendor.f($data.opportunities, (item, index, i0) => {
      return {
        a: common_vendor.t(item.icon),
        b: common_vendor.t(item.text),
        c: index
      };
    }),
    S: $data.isDarkMode ? "#ffffff" : "#3A3A3A",
    T: $data.isDarkMode ? "#3a3a3a" : "rgba(255,255,255,0.8)",
    U: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
    V: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    W: common_vendor.f($data.actions, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    X: $data.isDarkMode ? "#ffffff" : "#3A3A3A",
    Y: $data.isDarkMode ? "#3a3a3a" : "rgba(255,255,255,0.9)",
    Z: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
    aa: $data.isDarkMode ? "#666" : "#ADB5BD",
    ab: $data.isDarkMode ? "1px solid #404040" : "1px solid #E9ECF1",
    ac: $data.isDarkMode ? "linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 100%)" : "linear-gradient(180deg, #E8F0FE 0%, #FFFFFF 100%)",
    ad: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    ae: $data.isDarkMode ? "#1a1a1a" : "#F8FAFD"
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/chart.vue"]]);
wx.createPage(MiniProgramPage);
