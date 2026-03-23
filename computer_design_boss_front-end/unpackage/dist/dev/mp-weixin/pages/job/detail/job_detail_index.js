"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_job = require("../../../common/api/job.js");
var common_api_user = require("../../../common/api/user.js");
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
    goBack() {
      common_vendor.index.navigateBack();
    },
    shareJob() {
      common_vendor.index.showShareMenu({
        withShareTicket: true
      });
    },
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
        if (!this.jobDetail.boss_job_id && this.jobDetail.id) {
          this.jobDetail.boss_job_id = this.jobDetail.id;
        }
      } catch (error) {
        console.error("\u83B7\u53D6\u804C\u4F4D\u8BE6\u60C5\u5931\u8D25:", error);
        common_vendor.index.showToast({ title: "\u83B7\u53D6\u8BE6\u60C5\u5931\u8D25", icon: "none" });
      }
    },
    async getUserProfile() {
      try {
        const user = await common_api_user.userApi.getUserProfile();
        console.log("\u4ECEAPI\u83B7\u53D6\u7528\u6237\u4FE1\u606F:", user);
        this.userProfile = user;
      } catch (error) {
        console.error("\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25:", error);
        const userInfoStr = common_vendor.index.getStorageSync("userInfo");
        console.log("\u4ECE\u672C\u5730\u5B58\u50A8\u83B7\u53D6\u7528\u6237\u4FE1\u606F:", userInfoStr);
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            console.log("\u89E3\u6790\u540E\u7684\u7528\u6237\u4FE1\u606F:", userInfo);
            this.userProfile = userInfo;
          } catch (parseError) {
            console.error("\u89E3\u6790\u7528\u6237\u4FE1\u606F\u5931\u8D25:", parseError);
          }
        }
      }
      console.log("\u6700\u7EC8\u7528\u6237\u4FE1\u606F:", this.userProfile);
    },
    applyForJob() {
      var _a, _b;
      const jobId = ((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id) || ((_b = this.jobDetail) == null ? void 0 : _b.id);
      if (!jobId) {
        common_vendor.index.showToast({ title: "\u804C\u4F4D\u4FE1\u606F\u4E0D\u5B8C\u6574", icon: "none" });
        return;
      }
      let delivers = common_vendor.index.getStorageSync("delivers") || [];
      if (this.isApplied) {
        delivers = delivers.filter((item) => item.id !== jobId);
        this.isApplied = false;
        common_vendor.index.showToast({
          title: "\u5DF2\u53D6\u6D88\u6295\u9012",
          icon: "success"
        });
      } else {
        const newDeliver = {
          id: jobId,
          jobTitle: this.jobDetail.title,
          company: this.jobDetail.company || "\u672A\u77E5\u516C\u53F8",
          salary: this.jobDetail.salary || "",
          deliverTime: new Date().toLocaleString(),
          status: "pending",
          statusText: "\u5F85\u5904\u7406"
        };
        delivers.push(newDeliver);
        this.isApplied = true;
        common_vendor.index.showToast({
          title: "\u6295\u9012\u6210\u529F",
          icon: "success"
        });
      }
      common_vendor.index.setStorageSync("delivers", delivers);
    },
    favoriteJob() {
      var _a;
      if (!((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id)) {
        common_vendor.index.showToast({ title: "\u804C\u4F4D\u4FE1\u606F\u4E0D\u5B8C\u6574", icon: "none" });
        return;
      }
      let collections = common_vendor.index.getStorageSync("collections") || [];
      if (this.isFavorited) {
        collections = collections.filter((item) => item.id !== this.jobDetail.boss_job_id);
        this.isFavorited = false;
        common_vendor.index.showToast({
          title: "\u5DF2\u53D6\u6D88\u6536\u85CF",
          icon: "success"
        });
      } else {
        const isAlreadyFavorited = collections.some((item) => item.id === this.jobDetail.boss_job_id);
        if (isAlreadyFavorited) {
          common_vendor.index.showToast({
            title: "\u8BE5\u804C\u4F4D\u5DF2\u6536\u85CF",
            icon: "none"
          });
          return;
        }
        const newCollection = {
          id: this.jobDetail.boss_job_id,
          jobTitle: this.jobDetail.title,
          company: this.jobDetail.company || "\u672A\u77E5\u516C\u53F8",
          salary: this.jobDetail.salary || "",
          collectionTime: new Date().toLocaleString()
        };
        collections.push(newCollection);
        this.isFavorited = true;
        common_vendor.index.showToast({
          title: "\u6536\u85CF\u6210\u529F",
          icon: "success"
        });
      }
      common_vendor.index.setStorageSync("collections", collections);
      this.$emit("update:favorited", this.isFavorited);
    },
    checkFavoriteStatus() {
      var _a;
      if (!((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id))
        return;
      const collections = common_vendor.index.getStorageSync("collections") || [];
      this.isFavorited = collections.some((item) => item.id === this.jobDetail.boss_job_id);
    },
    checkDeliverStatus() {
      var _a, _b;
      const jobId = ((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id) || ((_b = this.jobDetail) == null ? void 0 : _b.id);
      if (!jobId)
        return;
      const delivers = common_vendor.index.getStorageSync("delivers") || [];
      this.isApplied = delivers.some((item) => item.id === jobId);
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
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  return common_vendor.e({
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      type: "back",
      size: "28"
    }),
    c: common_vendor.t(((_a = $data.jobDetail) == null ? void 0 : _a.title) || "\u6682\u65E0\u804C\u4F4D\u4FE1\u606F"),
    d: common_vendor.t(((_b = $data.jobDetail) == null ? void 0 : _b.salary_min) ? `${($data.jobDetail.salary_min / 1e3).toFixed(0)}k-${((_c = $data.jobDetail) == null ? void 0 : _c.salary_max) ? ($data.jobDetail.salary_max / 1e3).toFixed(0) : "?"}k` : "\u85AA\u8D44\u9762\u8BAE"),
    e: common_vendor.t(((_d = $data.jobDetail) == null ? void 0 : _d.company) || "\u672A\u77E5\u516C\u53F8"),
    f: common_vendor.t(((_e = $data.jobDetail) == null ? void 0 : _e.edu_req) || "\u5B66\u5386\u4E0D\u9650"),
    g: common_vendor.t(((_f = $data.jobDetail) == null ? void 0 : _f.exp_req) || "\u7ECF\u9A8C\u4E0D\u9650"),
    h: common_vendor.t(((_g = $data.jobDetail) == null ? void 0 : _g.emp_type) ? $options.getEmpTypeText($data.jobDetail.emp_type) : "\u5168\u804C"),
    i: (_h = $data.jobDetail) == null ? void 0 : _h.address
  }, ((_i = $data.jobDetail) == null ? void 0 : _i.address) ? {
    j: common_vendor.p({
      type: "location",
      size: "24",
      color: "#007aff"
    }),
    k: common_vendor.t($data.jobDetail.district || ""),
    l: common_vendor.t($data.jobDetail.address),
    m: common_vendor.p({
      type: "copy",
      size: "20",
      color: "#6C757D"
    })
  } : {}, {
    n: common_vendor.t(((_j = $data.jobDetail) == null ? void 0 : _j.description) || "\u6682\u65E0\u63CF\u8FF0"),
    o: Array.isArray((_k = $data.jobDetail) == null ? void 0 : _k.require_list) && $data.jobDetail.require_list.length > 0
  }, Array.isArray((_l = $data.jobDetail) == null ? void 0 : _l.require_list) && $data.jobDetail.require_list.length > 0 ? {
    p: common_vendor.f($data.jobDetail.require_list, (req, index, i0) => {
      return {
        a: common_vendor.t(req),
        b: index
      };
    })
  } : {
    q: common_vendor.t(((_m = $data.jobDetail) == null ? void 0 : _m.require_list) || "\u6682\u65E0\u8981\u6C42")
  }, {
    r: (_n = $data.jobDetail) == null ? void 0 : _n.welfare_list
  }, ((_o = $data.jobDetail) == null ? void 0 : _o.welfare_list) ? common_vendor.e({
    s: Array.isArray((_p = $data.jobDetail) == null ? void 0 : _p.welfare_list) && $data.jobDetail.welfare_list.length > 0
  }, Array.isArray((_q = $data.jobDetail) == null ? void 0 : _q.welfare_list) && $data.jobDetail.welfare_list.length > 0 ? {
    t: common_vendor.f($data.jobDetail.welfare_list, (welfare, index, i0) => {
      return {
        a: common_vendor.t(welfare),
        b: index
      };
    })
  } : {
    v: common_vendor.t((_r = $data.jobDetail) == null ? void 0 : _r.welfare_list)
  }) : {}, {
    w: (_s = $data.jobDetail) == null ? void 0 : _s.salary_desc
  }, ((_t = $data.jobDetail) == null ? void 0 : _t.salary_desc) ? {
    x: common_vendor.t($data.jobDetail.salary_desc)
  } : {}, {
    y: (_u = $data.jobDetail) == null ? void 0 : _u.publish_time
  }, ((_v = $data.jobDetail) == null ? void 0 : _v.publish_time) ? {
    z: common_vendor.t($options.formatDate($data.jobDetail.publish_time))
  } : {}, {
    A: common_vendor.p({
      type: $data.isFavorited ? "star-filled" : "star",
      size: "24",
      color: $data.isFavorited ? "#007aff" : "#6C757D"
    }),
    B: common_vendor.t($data.isFavorited ? "\u5DF2\u6536\u85CF" : "\u6536\u85CF"),
    C: common_vendor.n({
      "collected": $data.isFavorited
    }),
    D: common_vendor.n({
      "collected": $data.isFavorited
    }),
    E: common_vendor.o((...args) => $options.favoriteJob && $options.favoriteJob(...args)),
    F: common_vendor.t($data.isApplied ? "\u5DF2\u6295\u9012" : "\u6295\u9012"),
    G: common_vendor.n({
      "applied": $data.isApplied
    }),
    H: $data.isApplied,
    I: common_vendor.o((...args) => $options.applyForJob && $options.applyForJob(...args))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/job/detail/job_detail_index.vue"]]);
wx.createPage(MiniProgramPage);
