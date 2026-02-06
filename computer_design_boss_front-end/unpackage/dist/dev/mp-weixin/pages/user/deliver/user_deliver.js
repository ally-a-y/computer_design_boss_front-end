"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      delivers: [
        {
          jobTitle: "\u524D\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08",
          company: "\u79D1\u6280\u6709\u9650\u516C\u53F8",
          salary: "15k-25k",
          deliverTime: "2024-01-15 14:30",
          status: "pending",
          statusText: "\u5F85\u5904\u7406"
        },
        {
          jobTitle: "\u540E\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08",
          company: "\u4E92\u8054\u7F51\u516C\u53F8",
          salary: "20k-30k",
          deliverTime: "2024-01-16 10:20",
          status: "reviewing",
          statusText: "\u5BA1\u6838\u4E2D"
        },
        {
          jobTitle: "\u4EA7\u54C1\u7ECF\u7406",
          company: "\u521B\u4E1A\u516C\u53F8",
          salary: "18k-28k",
          deliverTime: "2024-01-17 09:15",
          status: "rejected",
          statusText: "\u5DF2\u62D2\u7EDD"
        },
        {
          jobTitle: "UI\u8BBE\u8BA1\u5E08",
          company: "\u8BBE\u8BA1\u516C\u53F8",
          salary: "12k-20k",
          deliverTime: "2024-01-18 16:45",
          status: "accepted",
          statusText: "\u5DF2\u901A\u8FC7"
        }
      ]
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    cancelDeliver(index) {
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u8981\u53D6\u6D88\u6295\u9012\u8BE5\u804C\u4F4D\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            this.delivers.splice(index, 1);
            common_vendor.index.showToast({
              title: "\u5DF2\u53D6\u6D88\u6295\u9012",
              icon: "success"
            });
          }
        }
      });
    },
    viewDetails(item) {
      common_vendor.index.showToast({
        title: `\u67E5\u770B${item.jobTitle}\u8BE6\u60C5`,
        icon: "none"
      });
    }
  },
  onLoad() {
    const savedDelivers = common_vendor.index.getStorageSync("delivers");
    if (savedDelivers) {
      this.delivers = savedDelivers;
    }
  },
  onUnload() {
    common_vendor.index.setStorageSync("delivers", this.delivers);
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
