"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_utils_themeSimple = require("../../../common/utils/theme-simple.js");
const _sfc_main = {
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
      common_vendor.index.navigateBack({
        delta: 1,
        fail: () => {
          common_vendor.index.switchTab({
            url: "/pages/user/user"
          });
        }
      });
    },
    loadFavorites() {
      let collections = common_vendor.index.getStorageSync("collections") || [];
      const uniqueCollections = [];
      const seenIds = /* @__PURE__ */ new Set();
      for (const item of collections) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          uniqueCollections.push(item);
        }
      }
      this.collections = uniqueCollections;
      common_vendor.index.setStorageSync("collections", uniqueCollections);
    },
    viewDetails(item) {
      if (!item.id) {
        common_vendor.index.showToast({
          title: "职位ID不存在",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/job/detail/job_detail_index?id=${item.id}`
      });
    },
    cancelCollection(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消收藏吗？",
        success: (res) => {
          if (res.confirm) {
            let collections = common_vendor.index.getStorageSync("collections") || [];
            collections.splice(index, 1);
            common_vendor.index.setStorageSync("collections", collections);
            this.collections = collections;
            common_vendor.index.showToast({
              title: "已取消收藏",
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
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "d9"),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    d: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    f: common_vendor.f($data.collections, (item, index, i0) => {
      return {
        a: common_vendor.t(item.jobTitle),
        b: common_vendor.t(item.company),
        c: common_vendor.t(item.salary),
        d: common_vendor.t(item.collectionTime),
        e: common_vendor.o(($event) => $options.cancelCollection(index), index),
        f: common_vendor.o(($event) => $options.viewDetails(item), index),
        g: index
      };
    }),
    g: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    h: $data.isDarkMode ? "#999" : "#6C757D",
    i: $data.isDarkMode ? "#666" : "#ADB5BD",
    j: $data.isDarkMode ? "#404040" : "#F2F5F9",
    k: $data.isDarkMode ? "#999" : "#6C757D",
    l: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    m: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    n: $data.collections.length === 0
  }, $data.collections.length === 0 ? {
    o: common_vendor.p({
      type: "star",
      size: "80",
      color: $data.isDarkMode ? "#404040" : "#ccc"
    }),
    p: $data.isDarkMode ? "#666" : "#ADB5BD"
  } : {}, {
    q: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/collection/user_collection.js.map
