"use strict";
var common_vendor = require("../../common/vendor.js");
var _imports_0 = "/static/logo.png";
const _sfc_main = {
  data() {
    return {};
  },
  onLoad() {
    const token = common_vendor.index.getStorageSync("token");
    setTimeout(() => {
      if (token) {
        common_vendor.index.switchTab({
          url: "/pages/index/index_index"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      }
    }, 2e3);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _imports_0
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-30b72be6"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/splash/splash.vue"]]);
wx.createPage(MiniProgramPage);
