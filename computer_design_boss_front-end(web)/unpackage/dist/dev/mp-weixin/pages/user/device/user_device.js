"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_utils_themeSimple = require("../../../common/utils/theme-simple.js");
const _sfc_main = {
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
    },
    deleteDevice(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该设备吗？",
        success: (res) => {
          if (res.confirm) {
            this.devices.splice(index, 1);
            common_vendor.index.showToast({
              title: "设备已删除",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "8c"),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    d: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    f: $data.isDarkMode ? "#ffb74d" : "#f57c00",
    g: $data.isDarkMode ? "rgba(66, 33, 0, 0.3)" : "#fff3e0",
    h: $data.isDarkMode ? "#ff9800" : "#ff9800",
    i: common_vendor.f($data.devices, (item, index, i0) => {
      return common_vendor.e({
        a: "f01c3666-0-" + i0,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.loginTime),
        d: item.isCurrent
      }, item.isCurrent ? {
        e: $data.isDarkMode ? "rgba(26, 32, 44, 0.8)" : "#e3f2fd"
      } : {}, {
        f: !item.isCurrent
      }, !item.isCurrent ? {
        g: common_vendor.o(($event) => $options.deleteDevice(index), index),
        h: $data.isDarkMode ? "rgba(66, 0, 0, 0.3)" : "#ffebee",
        i: $data.isDarkMode ? "#ff3b30" : "#ffcdd2"
      } : {}, {
        j: index
      });
    }),
    j: common_vendor.p({
      type: "monitor",
      size: "40",
      color: "#007aff"
    }),
    k: $data.isDarkMode ? "#ffffff" : "#333",
    l: $data.isDarkMode ? "#666" : "#999",
    m: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee",
    n: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    o: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    p: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/device/user_device.js.map
