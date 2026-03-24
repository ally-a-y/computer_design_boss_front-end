"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      delivers: []
    };
  },
  onLoad() {
    this.loadDelivers();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    loadDelivers() {
      const delivers = common_vendor.index.getStorageSync("delivers") || [];
      this.delivers = delivers;
    },
    cancelDeliver(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定取消投递该职位吗？",
        success: (res) => {
          if (res.confirm) {
            let delivers = common_vendor.index.getStorageSync("delivers") || [];
            delivers.splice(index, 1);
            common_vendor.index.setStorageSync("delivers", delivers);
            this.delivers = delivers;
            common_vendor.index.showToast({
              title: "已取消投递",
              icon: "success"
            });
          }
        }
      });
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
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.delivers, (item, index, i0) => {
      return {
        a: common_vendor.t(item.jobTitle),
        b: common_vendor.t(item.company),
        c: common_vendor.t(item.salary),
        d: common_vendor.t(item.deliverTime),
        e: common_vendor.t(item.statusText),
        f: common_vendor.n(item.status),
        g: common_vendor.o(($event) => $options.cancelDeliver(index), index),
        h: common_vendor.o(($event) => $options.viewDetails(item), index),
        i: index
      };
    }),
    c: $data.delivers.length === 0
  }, $data.delivers.length === 0 ? {
    d: common_vendor.p({
      type: "paperplane",
      size: "80",
      color: "#ccc"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/deliver/user_deliver.js.map
