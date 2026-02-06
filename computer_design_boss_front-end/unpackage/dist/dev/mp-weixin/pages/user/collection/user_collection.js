"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      collections: [
        {
          jobTitle: "\u524D\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08",
          company: "\u79D1\u6280\u6709\u9650\u516C\u53F8",
          salary: "15k-25k",
          collectionTime: "2024-01-15 14:30"
        },
        {
          jobTitle: "\u540E\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08",
          company: "\u4E92\u8054\u7F51\u516C\u53F8",
          salary: "20k-30k",
          collectionTime: "2024-01-16 10:20"
        },
        {
          jobTitle: "\u4EA7\u54C1\u7ECF\u7406",
          company: "\u521B\u4E1A\u516C\u53F8",
          salary: "18k-28k",
          collectionTime: "2024-01-17 09:15"
        }
      ]
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    cancelCollection(index) {
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u8981\u53D6\u6D88\u6536\u85CF\u8BE5\u804C\u4F4D\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            this.collections.splice(index, 1);
            common_vendor.index.showToast({
              title: "\u5DF2\u53D6\u6D88\u6536\u85CF",
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
    const savedCollections = common_vendor.index.getStorageSync("collections");
    if (savedCollections) {
      this.collections = savedCollections;
    }
  },
  onUnload() {
    common_vendor.index.setStorageSync("collections", this.collections);
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.collections, (item, index, i0) => {
      return {
        a: common_vendor.t(item.jobTitle),
        b: common_vendor.t(item.company),
        c: common_vendor.t(item.salary),
        d: common_vendor.t(item.collectionTime),
        e: common_vendor.o(($event) => $options.cancelCollection(index)),
        f: common_vendor.o(($event) => $options.viewDetails(item)),
        g: index
      };
    }),
    c: $data.collections.length === 0
  }, $data.collections.length === 0 ? {
    d: common_vendor.p({
      type: "star",
      size: "80",
      color: "#ccc"
    })
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/collection/user_collection.vue"]]);
wx.createPage(MiniProgramPage);
