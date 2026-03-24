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
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    d: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    f: common_assets._imports_0,
    g: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    h: $data.isDarkMode ? "#999" : "#6C757D",
    i: $data.isDarkMode ? "#3a3a3a" : "#E8F0FE",
    j: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    k: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    l: $data.isDarkMode ? "#404040" : "#E5E5EA",
    m: common_vendor.t($data.score),
    n: $data.isDarkMode ? "#999" : "#6C757D",
    o: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    p: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    q: common_vendor.f($data.metrics, (metric, index, i0) => {
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
    r: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    s: $data.isDarkMode ? "#999" : "#6C757D",
    t: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    v: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    w: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    x: common_vendor.f($data.skillDistribution, (sector, index, i0) => {
      return {
        a: index,
        b: sector.percentage,
        c: sector.color,
        d: sector.offset
      };
    }),
    y: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    z: $data.isDarkMode ? "#999" : "#6C757D",
    A: $data.isDarkMode ? "#3a3a3a" : "#ffffff",
    B: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
    C: common_vendor.f($data.skillDistribution, (sector, index, i0) => {
      return {
        a: sector.color,
        b: common_vendor.t(sector.name),
        c: common_vendor.t(sector.percentage),
        d: index
      };
    }),
    D: $data.isDarkMode ? "#999" : "#6C757D",
    E: $data.isDarkMode ? "#999" : "#6C757D",
    F: $data.isDarkMode ? "#3a3a3a" : "#F8FAFD",
    G: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    H: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    I: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    J: common_vendor.f($data.coreAdvantages, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: item.value,
        c: common_vendor.t(item.score),
        d: index
      };
    }),
    K: $data.isDarkMode ? "#999" : "#6C757D",
    L: $data.isDarkMode ? "#404040" : "#E9ECF1",
    M: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    N: $data.isDarkMode ? "#999" : "#6C757D",
    O: $data.isDarkMode ? "#3a3a3a" : "#F8FAFD",
    P: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    Q: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    R: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    S: common_vendor.f($data.opportunities, (item, index, i0) => {
      return {
        a: common_vendor.t(item.icon),
        b: common_vendor.t(item.text),
        c: index
      };
    }),
    T: $data.isDarkMode ? "#ffffff" : "#3A3A3A",
    U: $data.isDarkMode ? "#3a3a3a" : "rgba(255,255,255,0.8)",
    V: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
    W: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    X: common_vendor.f($data.actions, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    Y: $data.isDarkMode ? "#ffffff" : "#3A3A3A",
    Z: $data.isDarkMode ? "#3a3a3a" : "rgba(255,255,255,0.9)",
    aa: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
    ab: $data.isDarkMode ? "#666" : "#ADB5BD",
    ac: $data.isDarkMode ? "1px solid #404040" : "1px solid #E9ECF1",
    ad: $data.isDarkMode ? "linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 100%)" : "linear-gradient(180deg, #E8F0FE 0%, #FFFFFF 100%)",
    ae: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    af: $data.isDarkMode ? "#1a1a1a" : "#F8FAFD"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../.sourcemap/mp-weixin/pages/chart.js.map
