"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_deliver = require("../../../common/api/deliver.js");
var common_api_job = require("../../../common/api/job.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      delivers: [],
      userId: 1,
      loading: false
    };
  },
  async onLoad() {
    await this.loadDelivers();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    async loadDelivers() {
      try {
        this.loading = true;
        const res = await common_api_deliver.deliverApi.getDeliverList(this.userId);
        const job = await common_api_job.jobApi.getAllJobs();
        console.log("\u8F6C\u6362\u540E\u7684id:", job);
        const rawList = Array.isArray(res) ? res : [];
        this.delivers = rawList.map((item) => {
          const snapshot = JSON.parse(item.job_snapshot || "{}");
          console.log("\u8F6C\u6362\u524D\u7684delivers:", snapshot);
          return {
            id: item.id,
            jobTitle: snapshot.title || "",
            company: snapshot.location || "",
            salary: snapshot.salary || "",
            deliverTime: new Date(item.created_at).toLocaleString(),
            status: item.status || "pending",
            statusText: item.status_text || "\u5F85\u5904\u7406",
            boss_job_id: item.boss_job_id,
            address: snapshot.address || "",
            eduReq: snapshot.edu_req || "",
            expReq: snapshot.exp_req || ""
          };
        });
        console.log("\u8F6C\u6362\u540E\u7684id:", job);
        console.log("\u8F6C\u6362\u540E\u7684delivers:", this.delivers.jobTitle);
        console.log("\u8F6C\u6362\u540E\u7684delivers:", this.delivers);
      } catch (err) {
        common_vendor.index.showToast({
          title: err.message || "\u83B7\u53D6\u6295\u9012\u5931\u8D25",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    async cancelDeliver(index) {
      const item = this.delivers[index];
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u53D6\u6D88\u6295\u9012\u8BE5\u804C\u4F4D\u5417\uFF1F",
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_api_deliver.deliverApi.cancelDeliver({
                user_id: this.userId,
                boss_job_id: item.boss_job_id
              });
              this.delivers.splice(index, 1);
              common_vendor.index.showToast({
                title: "\u5DF2\u53D6\u6D88\u6295\u9012",
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
    viewDetails(item) {
      if (!item.id) {
        common_vendor.index.showToast({
          title: "\u804C\u4F4DID\u4E0D\u5B58\u5728",
          icon: "none"
        });
        return;
      }
      console.log("\u8F6C\u6362\u540E\u7684a:", item);
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
