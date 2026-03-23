"use strict";
var common_vendor = require("../../../common/vendor.js");
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
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u53D6\u6D88\u6295\u9012\u8BE5\u804C\u4F4D\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            let delivers = common_vendor.index.getStorageSync("delivers") || [];
            delivers.splice(index, 1);
            common_vendor.index.setStorageSync("delivers", delivers);
            this.delivers = delivers;
            common_vendor.index.showToast({
              title: "\u5DF2\u53D6\u6D88\u6295\u9012",
              icon: "success"
            });
          }
        }
      });
    },
    viewDetails(item) {
      if (!item.id) {
        common_vendor.index.showToast({
          title: "\u804C\u4F4DID\u4E0D\u5B58\u5728",
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
        g: common_vendor.o(($event) => $options.cancelDeliver(index)),
        h: common_vendor.o(($event) => $options.viewDetails(item)),
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
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/deliver/user_deliver.vue"]]);
wx.createPage(MiniProgramPage);
