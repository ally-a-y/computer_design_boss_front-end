"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_job = require("../../../common/api/job.js");
var common_api_user = require("../../../common/api/user.js");
var common_api_favorite = require("../../../common/api/favorite.js");
var common_api_deliver = require("../../../common/api/deliver.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      jobId: "",
      jobDetail: {},
      userProfile: null,
      isApplied: false,
      isFavorited: false
    };
  },
  async onLoad(options) {
    if (!options.id)
      return;
    this.jobId = options.id;
    await this.getJobDetail();
    await this.getUserProfile();
    await this.checkFavoriteStatus();
    await this.checkDeliverStatus();
  },
  methods: {
    async getJobDetail() {
      try {
        const res = await common_api_job.jobApi.getJobDetail(this.jobId);
        console.log("\u8F6C\u6362\u540E\u7684delivers:", res);
        this.jobDetail = res;
        if (Array.isArray(res) && res.length > 0) {
          this.jobDetail = res[0];
        } else if (res && typeof res === "object") {
          this.jobDetail = res;
        } else {
          this.jobDetail = {};
        }
        if (typeof this.jobDetail.require_list === "string") {
          this.jobDetail.require_list = JSON.parse(this.jobDetail.require_list);
        }
        if (typeof this.jobDetail.welfare_list === "string") {
          this.jobDetail.welfare_list = JSON.parse(this.jobDetail.welfare_list);
        }
      } catch (error) {
        console.error("\u83B7\u53D6\u804C\u4F4D\u8BE6\u60C5\u5931\u8D25:", error);
        common_vendor.index.showToast({ title: "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25", icon: "none" });
      }
    },
    async getUserProfile() {
      try {
        const user = await common_api_user.userApi.getUserProfile();
      } catch (error) {
        console.error("\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25:", error);
      }
    },
    async applyForJob() {
      var _a, _b;
      if (this.isApplied)
        return;
      if (!((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id)) {
        common_vendor.index.showToast({ title: "\u804C\u4F4D\u4FE1\u606F\u4E0D\u5B8C\u6574", icon: "none" });
        return;
      }
      try {
        await common_api_deliver.deliverApi.addDeliver({
          job_id: this.jobDetail.boss_job_id
        });
        this.isApplied = true;
        common_vendor.index.showToast({
          title: "\u6295\u9012\u6210\u529F",
          icon: "success"
        });
      } catch (error) {
        console.error("\u6295\u9012\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) || "\u6295\u9012\u5931\u8D25",
          icon: "none"
        });
      }
    },
    async favoriteJob() {
      var _a, _b;
      if (this.isFavorited)
        return;
      if (!((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id)) {
        common_vendor.index.showToast({ title: "\u804C\u4F4D\u4FE1\u606F\u4E0D\u5B8C\u6574", icon: "none" });
        return;
      }
      try {
        await common_api_favorite.favoriteApi.addFavorite({
          job_id: this.jobDetail.boss_job_id
        });
        this.isFavorited = true;
        common_vendor.index.showToast({
          title: "\u6536\u85CF\u6210\u529F",
          icon: "success"
        });
      } catch (error) {
        console.log("\u8F6C\u6362\u540E\u7684collections:", this.jobDetail.boss_job_id);
        console.error("\u6536\u85CF\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: ((_b = error == null ? void 0 : error.data) == null ? void 0 : _b.message) || "\u6536\u85CF\u5931\u8D25",
          icon: "none"
        });
      }
    },
    async checkFavoriteStatus() {
      var _a;
      if (!((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id))
        return;
      try {
        const res = await common_api_favorite.favoriteApi.checkFavorite({
          boss_job_id: this.jobDetail.boss_job_id
        });
        this.isFavorited = res.is_favorite;
        console.log("\u8F6C\u6362\u540E\u7684collections:");
      } catch (error) {
        console.log("\u8F6C\u6362\u540E\u7684collections:", this.jobDetail.boss_job_id);
        console.error("\u68C0\u67E5\u6536\u85CF\u72B6\u6001\u5931\u8D25:", error);
      }
    },
    async checkDeliverStatus() {
      var _a;
      if (!((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id))
        return;
      try {
        const res = await common_api_deliver.deliverApi.checkDeliver({
          boss_job_id: this.jobDetail.boss_job_id
        });
        this.isApplied = res.is_deliver;
      } catch (error) {
        console.error("\u68C0\u67E5\u6295\u9012\u72B6\u6001\u5931\u8D25:", error);
      }
    },
    getEmpTypeText(type) {
      const map = {
        "1": "\u5168\u804C",
        "2": "\u517C\u804C",
        "3": "\u5B9E\u4E60"
      };
      return map[type] || "\u5168\u804C";
    },
    formatDate(dateString) {
      if (!dateString)
        return "";
      const date = new Date(dateString);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const h = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      return `${y}-${m}-${d} ${h}:${min}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
  return common_vendor.e({
    a: common_vendor.t(((_a = $data.jobDetail) == null ? void 0 : _a.title) || "\u6682\u65E0\u804C\u4F4D\u4FE1\u606F"),
    b: common_vendor.t(((_b = $data.jobDetail) == null ? void 0 : _b.salary_min) ? `${($data.jobDetail.salary_min / 1e3).toFixed(0)}k-${((_c = $data.jobDetail) == null ? void 0 : _c.salary_max) ? ($data.jobDetail.salary_max / 1e3).toFixed(0) : "?"}k` : "\u85AA\u8D44\u9762\u8BAE"),
    c: common_vendor.t(((_d = $data.jobDetail) == null ? void 0 : _d.edu_req) || "\u5B66\u5386\u4E0D\u9650"),
    d: common_vendor.t(((_e = $data.jobDetail) == null ? void 0 : _e.exp_req) || "\u7ECF\u9A8C\u4E0D\u9650"),
    e: common_vendor.t(((_f = $data.jobDetail) == null ? void 0 : _f.emp_type) ? $options.getEmpTypeText($data.jobDetail.emp_type) : "\u5168\u804C"),
    f: common_vendor.t(((_g = $data.jobDetail) == null ? void 0 : _g.description) || "\u6682\u65E0\u63CF\u8FF0"),
    g: Array.isArray((_h = $data.jobDetail) == null ? void 0 : _h.require_list) && $data.jobDetail.require_list.length > 0
  }, Array.isArray((_i = $data.jobDetail) == null ? void 0 : _i.require_list) && $data.jobDetail.require_list.length > 0 ? {
    h: common_vendor.f($data.jobDetail.require_list, (req, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(req),
        c: index
      };
    })
  } : {
    i: common_vendor.t(((_j = $data.jobDetail) == null ? void 0 : _j.require_list) || "\u6682\u65E0\u8981\u6C42")
  }, {
    j: (_k = $data.jobDetail) == null ? void 0 : _k.address
  }, ((_l = $data.jobDetail) == null ? void 0 : _l.address) ? {
    k: common_vendor.t($data.jobDetail.district || ""),
    l: common_vendor.t($data.jobDetail.address)
  } : {}, {
    m: (_m = $data.jobDetail) == null ? void 0 : _m.welfare_list
  }, ((_n = $data.jobDetail) == null ? void 0 : _n.welfare_list) ? common_vendor.e({
    n: Array.isArray((_o = $data.jobDetail) == null ? void 0 : _o.welfare_list) && $data.jobDetail.welfare_list.length > 0
  }, Array.isArray((_p = $data.jobDetail) == null ? void 0 : _p.welfare_list) && $data.jobDetail.welfare_list.length > 0 ? {
    o: common_vendor.f($data.jobDetail.welfare_list, (welfare, index, i0) => {
      return {
        a: common_vendor.t(welfare),
        b: index
      };
    })
  } : {
    p: common_vendor.t((_q = $data.jobDetail) == null ? void 0 : _q.welfare_list)
  }) : {}, {
    q: (_r = $data.jobDetail) == null ? void 0 : _r.salary_desc
  }, ((_s = $data.jobDetail) == null ? void 0 : _s.salary_desc) ? {
    r: common_vendor.t($data.jobDetail.salary_desc)
  } : {}, {
    s: (_t = $data.jobDetail) == null ? void 0 : _t.publish_time
  }, ((_u = $data.jobDetail) == null ? void 0 : _u.publish_time) ? {
    t: common_vendor.t($options.formatDate($data.jobDetail.publish_time))
  } : {}, {
    v: common_vendor.t($data.isApplied ? "\u5DF2\u52A0\u5165\u6295\u9012\u5217\u8868" : "\u6295\u9012"),
    w: $data.isApplied,
    x: common_vendor.n({
      "disabled": $data.isApplied
    }),
    y: common_vendor.o((...args) => $options.applyForJob && $options.applyForJob(...args)),
    z: common_vendor.t($data.isFavorited ? "\u5DF2\u6536\u85CF" : "\u6536\u85CF"),
    A: $data.isFavorited,
    B: common_vendor.n({
      "disabled": $data.isFavorited
    }),
    C: common_vendor.o((...args) => $options.favoriteJob && $options.favoriteJob(...args))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/job/detail/job_detail_index.vue"]]);
wx.createPage(MiniProgramPage);
