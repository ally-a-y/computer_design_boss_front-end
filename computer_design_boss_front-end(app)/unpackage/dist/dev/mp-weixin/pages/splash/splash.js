"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
    a: common_assets._imports_0
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-b5d3b004"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/splash/splash.js.map
