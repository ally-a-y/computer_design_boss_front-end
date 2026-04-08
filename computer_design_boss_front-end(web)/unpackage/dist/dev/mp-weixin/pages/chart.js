"use strict";
const common_vendor = require("../common/vendor.js");
const common_utils_themeSimple = require("../common/utils/theme-simple.js");
const common_assets = require("../common/assets.js");
const _sfc_main = {
  data() {
    return {
      // 主题相关
      currentTheme: "light",
      isDarkMode: false,
      // 数据
      score: 96,
      // 关键指标
      metrics: [
        {
          value: "94%",
          change: "3%",
          label: "岗位匹配度",
          desc: '与"资深产品经理"高度契合'
        },
        {
          value: "8.6 / 10.0",
          label: "技能广度",
          desc: "覆盖 5 大核心能力域，高于行业平均 1.2"
        },
        {
          value: "极热 🔥",
          label: "市场热度",
          desc: "近7日被搜索 24 次，简历查看率 +28%"
        }
      ],
      // 技能分布
      skillDistribution: [
        { name: "产品规划", percentage: 32, color: "#007AFF", offset: 0 },
        { name: "用户研究", percentage: 28, color: "#5E9EFF", offset: 32 },
        { name: "数据分析", percentage: 22, color: "#8EB9FF", offset: 60 },
        { name: "沟通协调", percentage: 18, color: "#C0D6FF", offset: 82 }
      ],
      // 核心优势
      coreAdvantages: [
        { label: "全链路产品经验", value: "92%", score: "9.2" },
        { label: "数据驱动决策", value: "89%", score: "8.9" },
        { label: "跨部门协同力", value: "95%", score: "9.5" }
      ],
      // 机会洞察
      opportunities: [
        { icon: "•", text: "头部大厂机会：3 家（字节跳动、美团、滴滴）岗位匹配度 > 85%" },
        { icon: "•", text: "高潜赛道：AI 应用层产品岗位，你的技能匹配度 A+" },
        { icon: "•", text: "薪资溢价区间：基于竞争力模型，当前市场溢价 +15%~20%" }
      ],
      // 行动建议
      actions: [
        '优先更新"项目成果"模块，增加具体增长数据',
        '开启"暗聘模式"，定向接收目标企业直推'
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
    /**
     * 初始化主题
     */
    initTheme() {
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    /**
     * 处理全局主题变化
     */
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
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "79"),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    d: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    f: common_assets._imports_0,
    g: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    h: $data.isDarkMode ? "#999" : "#6C757D",
    i: $data.isDarkMode ? "linear-gradient(120deg, #3a3a3a, #4a4a4a)" : "linear-gradient(120deg, #4facfe, #00f2fe)",
    j: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.3)",
    k: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    l: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    m: $data.isDarkMode ? "#404040" : "#E5E5EA",
    n: common_vendor.t($data.score),
    o: $data.isDarkMode ? "#999" : "#6C757D",
    p: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(255, 255, 255, 0.8)",
    q: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    r: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    s: common_vendor.f($data.metrics, (metric, index, i0) => {
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
    t: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    v: $data.isDarkMode ? "#999" : "#6C757D",
    w: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    x: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    y: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    z: common_vendor.f($data.skillDistribution, (sector, index, i0) => {
      return {
        a: index,
        b: sector.percentage,
        c: sector.color,
        d: sector.offset
      };
    }),
    A: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    B: $data.isDarkMode ? "#999" : "#6C757D",
    C: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(255, 255, 255, 0.8)",
    D: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
    E: common_vendor.f($data.skillDistribution, (sector, index, i0) => {
      return {
        a: "linear-gradient(120deg, " + sector.color + ", " + sector.color + "80)",
        b: common_vendor.t(sector.name),
        c: common_vendor.t(sector.percentage),
        d: index
      };
    }),
    F: $data.isDarkMode ? "#999" : "#6C757D",
    G: $data.isDarkMode ? "#999" : "#6C757D",
    H: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(248, 250, 253, 0.8)",
    I: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    J: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    K: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    L: common_vendor.f($data.coreAdvantages, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: item.value,
        c: common_vendor.t(item.score),
        d: index
      };
    }),
    M: $data.isDarkMode ? "#999" : "#6C757D",
    N: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(233, 236, 241, 0.8)",
    O: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    P: $data.isDarkMode ? "#999" : "#6C757D",
    Q: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(248, 250, 253, 0.8)",
    R: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    S: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    T: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    U: common_vendor.f($data.opportunities, (item, index, i0) => {
      return {
        a: common_vendor.t(item.icon),
        b: common_vendor.t(item.text),
        c: index
      };
    }),
    V: $data.isDarkMode ? "#ffffff" : "#3A3A3A",
    W: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(255,255,255,0.8)",
    X: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
    Y: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    Z: common_vendor.f($data.actions, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    aa: $data.isDarkMode ? "#ffffff" : "#3A3A3A",
    ab: $data.isDarkMode ? "rgba(58, 58, 58, 0.8)" : "rgba(255,255,255,0.9)",
    ac: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
    ad: $data.isDarkMode ? "#666" : "#ADB5BD",
    ae: $data.isDarkMode ? "1px solid #404040" : "1px solid #E9ECF1",
    af: $data.isDarkMode ? "linear-gradient(180deg, rgba(44, 44, 44, 0.8), rgba(26, 26, 26, 0.8))" : "linear-gradient(180deg, rgba(232, 240, 254, 0.8), rgba(255, 255, 255, 0.8))",
    ag: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    ah: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../.sourcemap/mp-weixin/pages/chart.js.map
