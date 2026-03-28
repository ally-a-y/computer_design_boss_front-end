"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      collections: []
    };
  },
  onLoad() {
    this.loadFavorites();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
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
          title: "\u804C\u4F4DID\u4E0D\u5B58\u5728",
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
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u53D6\u6D88\u6536\u85CF\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            let collections = common_vendor.index.getStorageSync("collections") || [];
            collections.splice(index, 1);
            common_vendor.index.setStorageSync("collections", collections);
            this.collections = collections;
            common_vendor.index.showToast({
              title: "\u5DF2\u53D6\u6D88\u6536\u85CF",
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
