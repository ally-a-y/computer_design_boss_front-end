"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_favorite = require("../../../common/api/favorite.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      collections: [],
      userId: 1,
      loading: false
    };
  },
  async onLoad() {
    await this.loadFavorites();
  },
  data() {
    return {
      collections: [],
      userId: 1,
      loading: false,
      isFavorite: false
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    async loadFavorites() {
      try {
        this.loading = true;
        const res = await common_api_favorite.favoriteApi.getFavoriteList(this.userId);
        const rawList = Array.isArray(res) ? res : [];
        this.collections = rawList.map((item) => {
          const snapshot = JSON.parse(item.job_snapshot || "{}");
          return {
            jobTitle: snapshot.title || "",
            company: snapshot.location || "",
            salary: snapshot.salary || "",
            collectionTime: new Date(item.created_at).toLocaleString(),
            boss_job_id: item.boss_job_id
          };
        });
        console.log("\u8F6C\u6362\u540E\u7684collections:", this.collections);
      } catch (err) {
        common_vendor.index.showToast({
          title: err.message || "\u83B7\u53D6\u6536\u85CF\u5931\u8D25",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    async cancelCollection(index) {
      const item = this.collections[index];
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u53D6\u6D88\u6536\u85CF\u5417\uFF1F",
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_api_favorite.favoriteApi.cancelFavorite({
                user_id: this.userId,
                boss_job_id: item.boss_job_id
              });
              this.collections.splice(index, 1);
              common_vendor.index.showToast({
                title: "\u5DF2\u53D6\u6D88\u6536\u85CF",
                icon: "success"
              });
            } catch (err) {
              common_vendor.index.showToast({
                title: err.message || "\u53D6\u6D88\u5931\u8D25",
                icon: "none"
              });
            }
          }
        }
      });
    },
    async addToFavorite(jobId) {
      try {
        await common_api_favorite.favoriteApi.addFavorite({
          user_id: this.userId,
          job_id: jobId
        });
        common_vendor.index.showToast({
          title: "\u6536\u85CF\u6210\u529F",
          icon: "success"
        });
      } catch (err) {
        common_vendor.index.showToast({
          title: err.message || "\u6536\u85CF\u5931\u8D25",
          icon: "none"
        });
      }
    },
    async toggleFavorite() {
      if (this.isFavorite) {
        try {
          await common_api_favorite.favoriteApi.cancelFavorite({ user_id: this.userId, boss_job_id: 1 });
          this.isFavorite = false;
          common_vendor.index.showToast({ title: "\u5DF2\u53D6\u6D88\u6536\u85CF", icon: "none" });
        } catch (err) {
          common_vendor.index.showToast({ title: err.message || "\u53D6\u6D88\u5931\u8D25", icon: "none" });
        }
      } else {
        try {
          await common_api_favorite.favoriteApi.addFavorite({ user_id: this.userId, job_id: 1 });
          this.isFavorite = true;
          common_vendor.index.showToast({ title: "\u6536\u85CF\u6210\u529F", icon: "success" });
        } catch (err) {
          common_vendor.index.showToast({ title: err.message || "\u6536\u85CF\u5931\u8D25", icon: "none" });
        }
      }
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
        f: common_vendor.o(($event) => _ctx.viewDetails(item)),
        g: index
      };
    }),
    c: $data.collections.length === 0
  }, $data.collections.length === 0 ? {
    d: common_vendor.o($options.toggleFavorite),
    e: common_vendor.p({
      type: "star",
      size: "80",
      color: $data.isFavorite ? "#FFD700" : "#ccc"
    }),
    f: common_vendor.t($data.isFavorite ? "\u5DF2\u6536\u85CF\u793A\u4F8B\u804C\u4F4D" : "\u6682\u65E0\u6536\u85CF\u804C\u4F4D")
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/collection/user_collection.vue"]]);
wx.createPage(MiniProgramPage);
