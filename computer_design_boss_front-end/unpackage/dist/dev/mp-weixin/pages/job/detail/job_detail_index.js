"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_job = require("../../../common/api/job.js");
const common_api_user = require("../../../common/api/user.js");
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
    /* ================= 导航方法 ================= */
    goBack() {
      common_vendor.index.navigateBack();
    },
    shareJob() {
      common_vendor.index.showShareMenu({
        withShareTicket: true
      });
    },
    /* ================= 获取职位详情 ================= */
    async getJobDetail() {
      try {
        const res = await common_api_job.jobApi.getJobDetail(this.jobId);
        common_vendor.index.__f__("log", "at pages/job/detail/job_detail_index.vue:170", "转换后的delivers:", res);
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
        common_vendor.index.__f__("error", "at pages/job/detail/job_detail_index.vue:195", "获取职位详情失败:", error);
        common_vendor.index.showToast({ title: "获取详情失败", icon: "none" });
      }
    },
    /* ================= 获取用户信息 ================= */
    async getUserProfile() {
      try {
        const user = await common_api_user.userApi.getUserProfile();
        common_vendor.index.__f__("log", "at pages/job/detail/job_detail_index.vue:204", "从API获取用户信息:", user);
        this.userProfile = user;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/job/detail/job_detail_index.vue:207", "获取用户信息失败:", error);
        const userInfoStr = common_vendor.index.getStorageSync("userInfo");
        common_vendor.index.__f__("log", "at pages/job/detail/job_detail_index.vue:210", "从本地存储获取用户信息:", userInfoStr);
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            common_vendor.index.__f__("log", "at pages/job/detail/job_detail_index.vue:214", "解析后的用户信息:", userInfo);
            this.userProfile = userInfo;
          } catch (parseError) {
            common_vendor.index.__f__("error", "at pages/job/detail/job_detail_index.vue:217", "解析用户信息失败:", parseError);
          }
        }
      }
      common_vendor.index.__f__("log", "at pages/job/detail/job_detail_index.vue:221", "最终用户信息:", this.userProfile);
    },
    /* ================= 点击投递 ================= */
    applyForJob() {
      var _a, _b;
      const jobId = ((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id) || ((_b = this.jobDetail) == null ? void 0 : _b.id);
      if (!jobId) {
        common_vendor.index.showToast({ title: "职位信息不完整", icon: "none" });
        return;
      }
      let delivers = common_vendor.index.getStorageSync("delivers") || [];
      if (this.isApplied) {
        delivers = delivers.filter((item) => item.id !== jobId);
        this.isApplied = false;
        common_vendor.index.showToast({
          title: "已取消投递",
          icon: "success"
        });
      } else {
        const newDeliver = {
          id: jobId,
          jobTitle: this.jobDetail.title,
          company: this.jobDetail.company || "未知公司",
          salary: this.jobDetail.salary || "",
          deliverTime: (/* @__PURE__ */ new Date()).toLocaleString(),
          status: "pending",
          statusText: "待处理"
        };
        delivers.push(newDeliver);
        this.isApplied = true;
        common_vendor.index.showToast({
          title: "投递成功",
          icon: "success"
        });
      }
      common_vendor.index.setStorageSync("delivers", delivers);
    },
    /* ================= 点击收藏 ================= */
    favoriteJob() {
      var _a;
      if (!((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id)) {
        common_vendor.index.showToast({ title: "职位信息不完整", icon: "none" });
        return;
      }
      let collections = common_vendor.index.getStorageSync("collections") || [];
      if (this.isFavorited) {
        collections = collections.filter((item) => item.id !== this.jobDetail.boss_job_id);
        this.isFavorited = false;
        common_vendor.index.showToast({
          title: "已取消收藏",
          icon: "success"
        });
      } else {
        const isAlreadyFavorited = collections.some((item) => item.id === this.jobDetail.boss_job_id);
        if (isAlreadyFavorited) {
          common_vendor.index.showToast({
            title: "该职位已收藏",
            icon: "none"
          });
          return;
        }
        const newCollection = {
          id: this.jobDetail.boss_job_id,
          jobTitle: this.jobDetail.title,
          company: this.jobDetail.company || "未知公司",
          salary: this.jobDetail.salary || "",
          collectionTime: (/* @__PURE__ */ new Date()).toLocaleString()
        };
        collections.push(newCollection);
        this.isFavorited = true;
        common_vendor.index.showToast({
          title: "收藏成功",
          icon: "success"
        });
      }
      common_vendor.index.setStorageSync("collections", collections);
      this.$emit("update:favorited", this.isFavorited);
    },
    /* ================= 检查收藏状态 ================= */
    checkFavoriteStatus() {
      var _a;
      if (!((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id))
        return;
      const collections = common_vendor.index.getStorageSync("collections") || [];
      this.isFavorited = collections.some((item) => item.id === this.jobDetail.boss_job_id);
    },
    /* ================= 检查投递状态 ================= */
    checkDeliverStatus() {
      var _a, _b;
      const jobId = ((_a = this.jobDetail) == null ? void 0 : _a.boss_job_id) || ((_b = this.jobDetail) == null ? void 0 : _b.id);
      if (!jobId)
        return;
      const delivers = common_vendor.index.getStorageSync("delivers") || [];
      this.isApplied = delivers.some((item) => item.id === jobId);
    },
    /* ================= 工具方法 ================= */
    getEmpTypeText(type) {
      const map = {
        "1": "全职",
        "2": "兼职",
        "3": "实习"
      };
      return map[type] || "全职";
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
    c: common_vendor.t(((_a = $data.jobDetail) == null ? void 0 : _a.title) || "暂无职位信息"),
    d: common_vendor.t(((_b = $data.jobDetail) == null ? void 0 : _b.salary_min) ? `${($data.jobDetail.salary_min / 1e3).toFixed(0)}k-${((_c = $data.jobDetail) == null ? void 0 : _c.salary_max) ? ($data.jobDetail.salary_max / 1e3).toFixed(0) : "?"}k` : "薪资面议"),
    e: common_vendor.t(((_d = $data.jobDetail) == null ? void 0 : _d.company) || "未知公司"),
    f: common_vendor.t(((_e = $data.jobDetail) == null ? void 0 : _e.edu_req) || "学历不限"),
    g: common_vendor.t(((_f = $data.jobDetail) == null ? void 0 : _f.exp_req) || "经验不限"),
    h: common_vendor.t(((_g = $data.jobDetail) == null ? void 0 : _g.emp_type) ? $options.getEmpTypeText($data.jobDetail.emp_type) : "全职"),
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
    n: common_vendor.t(((_j = $data.jobDetail) == null ? void 0 : _j.description) || "暂无描述"),
    o: Array.isArray((_k = $data.jobDetail) == null ? void 0 : _k.require_list) && $data.jobDetail.require_list.length > 0
  }, Array.isArray((_l = $data.jobDetail) == null ? void 0 : _l.require_list) && $data.jobDetail.require_list.length > 0 ? {
    p: common_vendor.f($data.jobDetail.require_list, (req, index, i0) => {
      return {
        a: common_vendor.t(req),
        b: index
      };
    })
  } : {
    q: common_vendor.t(((_m = $data.jobDetail) == null ? void 0 : _m.require_list) || "暂无要求")
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
    B: common_vendor.t($data.isFavorited ? "已收藏" : "收藏"),
    C: common_vendor.n({
      "collected": $data.isFavorited
    }),
    D: common_vendor.n({
      "collected": $data.isFavorited
    }),
    E: common_vendor.o((...args) => $options.favoriteJob && $options.favoriteJob(...args)),
    F: common_vendor.t($data.isApplied ? "已投递" : "投递"),
    G: common_vendor.n({
      "applied": $data.isApplied
    }),
    H: $data.isApplied,
    I: common_vendor.o((...args) => $options.applyForJob && $options.applyForJob(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/job/detail/job_detail_index.js.map
