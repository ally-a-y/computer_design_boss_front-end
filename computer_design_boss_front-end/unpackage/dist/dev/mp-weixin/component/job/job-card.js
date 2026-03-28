"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "JobCard",
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFavorite: false,
      isApplied: false
    };
  },
  mounted() {
    this.checkIsFavorite();
    this.checkIsApplied();
  },
  onShow() {
    this.checkIsFavorite();
    this.checkIsApplied();
  },
  methods: {
    checkIsFavorite() {
      const collections = common_vendor.index.getStorageSync("collections") || [];
      this.isFavorite = collections.some((item) => item.id === this.data.id);
    },
    checkIsApplied() {
      const delivers = common_vendor.index.getStorageSync("delivers") || [];
      this.isApplied = delivers.some((item) => item.id === this.data.id);
    },
    toggleFavorite() {
      let collections = common_vendor.index.getStorageSync("collections") || [];
      if (this.isFavorite) {
        collections = collections.filter((item) => item.id !== this.data.id);
        this.isFavorite = false;
        common_vendor.index.showToast({
          title: "\u5DF2\u53D6\u6D88\u6536\u85CF",
          icon: "success"
        });
      } else {
        const newCollection = {
          id: this.data.id,
          jobTitle: this.data.title,
          company: this.data.company || "\u672A\u77E5\u516C\u53F8",
          salary: this.formatSalary(this.data.salary_min, this.data.salary_max),
          collectionTime: new Date().toLocaleString()
        };
        collections.push(newCollection);
        this.isFavorite = true;
        common_vendor.index.showToast({
          title: "\u6536\u85CF\u6210\u529F",
          icon: "success"
        });
      }
      common_vendor.index.setStorageSync("collections", collections);
    },
    applyForJob() {
      let delivers = common_vendor.index.getStorageSync("delivers") || [];
      const isApplied = delivers.some((item) => item.id === this.data.id);
      if (isApplied) {
        delivers = delivers.filter((item) => item.id !== this.data.id);
        this.isApplied = false;
        common_vendor.index.showToast({
          title: "\u5DF2\u53D6\u6D88\u6295\u9012",
          icon: "success"
        });
      } else {
        const newDeliver = {
          id: this.data.id,
          jobTitle: this.data.title,
          company: this.data.company || "\u672A\u77E5\u516C\u53F8",
          salary: this.formatSalary(this.data.salary_min, this.data.salary_max),
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
    formatSalary(min, max) {
      if (min && max) {
        const minNum = typeof min === "number" ? min : parseFloat(min);
        const maxNum = typeof max === "number" ? max : parseFloat(max);
        return `${(minNum / 1e3).toFixed(0)}-${(maxNum / 1e3).toFixed(0)}K`;
      }
      return "\u85AA\u8D44\u9762\u8BAE";
    },
    goToDetail(data) {
      console.log("\u8F6C\u6362\u540E\u7684b:", data.id);
      common_vendor.index.navigateTo({
        url: `/pages/job/detail/job_detail_index?id=${data.id}`
      });
    },
    getCompanyName(data) {
      const companyMap = {
        "1": "\u82B1\u65D7\u91D1\u878D\u4FE1\u606F\u670D\u52A1\uFF08\u4E2D\u56FD\uFF09\u6709\u9650\u516C\u53F8",
        "2": "\u4E2D\u56FD\u79FB\u52A8\u901A\u4FE1\u6709\u9650\u516C\u53F8\u5728\u7EBF\u8425\u9500\u670D\u52A1\u4E2D\u5FC3",
        "3": "Victoria's Secret"
      };
      return companyMap[data.company_id] || "\u672A\u77E5\u516C\u53F8";
    },
    getJobTags(data) {
      if (data.welfare_list) {
        return Array.isArray(data.welfare_list) ? data.welfare_list : JSON.parse(data.welfare_list);
      }
      return ["\u4E94\u9669\u4E00\u91D1", "\u5F39\u6027\u5DE5\u4F5C", "\u5E26\u85AA\u5E74\u5047"];
    },
    formatTime(publishTime) {
      if (!publishTime)
        return "\u4ECA\u5929";
      try {
        const date = new Date(publishTime);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
        if (days === 0) {
          return "\u4ECA\u5929";
        } else if (days === 1) {
          return "\u6628\u5929";
        } else if (days < 7) {
          return `${days}\u5929\u524D`;
        } else {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
      } catch (error) {
        console.error("\u65E5\u671F\u683C\u5F0F\u5316\u5931\u8D25:", error);
        return "\u4ECA\u5929";
      }
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.data.title),
    b: $props.isDark ? "#ffffff" : "#1E1E1E",
    c: common_vendor.t($options.formatSalary($props.data.salary_min, $props.data.salary_max)),
    d: common_vendor.t($props.data.company || "\u672A\u77E5\u516C\u53F8"),
    e: $props.isDark ? "#ffffff" : "#1E1E1E",
    f: common_vendor.t($props.data.exp_req || "\u7ECF\u9A8C\u4E0D\u9650"),
    g: common_vendor.t($props.data.edu_req || "\u5B66\u5386\u4E0D\u9650"),
    h: $props.isDark ? "#999" : "#6C757D",
    i: common_vendor.f($options.getJobTags($props.data), (tag, k0, i0) => {
      return {
        a: common_vendor.t(tag),
        b: tag
      };
    }),
    j: $props.isDark ? "#3a3a3a" : "#F2F5F9",
    k: $props.isDark ? "#ccc" : "#6C757D",
    l: common_vendor.t($props.data.city || "\u57CE\u5E02"),
    m: $props.isDark ? "#ffffff" : "#1E1E1E",
    n: common_vendor.t($options.formatTime($props.data.publish_time)),
    o: $props.isDark ? "#999" : "#6C757D",
    p: $props.isDark ? "1px solid #404040" : "1px solid #F0F2F5",
    q: common_vendor.o(($event) => $options.goToDetail($props.data)),
    r: common_vendor.p({
      type: $data.isFavorite ? "star-filled" : "star",
      size: 30,
      color: $data.isFavorite ? "#ff9500" : $props.isDark ? "#666" : "#ccc"
    }),
    s: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args)),
    t: $props.isDark ? "rgba(42, 42, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
    v: common_vendor.t($data.isApplied ? "\u5DF2\u6295\u9012" : "\u6295\u9012"),
    w: $data.isApplied ? 1 : "",
    x: common_vendor.o((...args) => $options.applyForJob && $options.applyForJob(...args)),
    y: $data.isApplied ? $props.isDark ? "#3a3a3a" : "#F2F5F9" : "#007aff",
    z: $data.isApplied ? $props.isDark ? "#999" : "#6C757D" : "white",
    A: $props.isDark ? "#2c2c2c" : "#fff",
    B: $props.isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)"
  };
}
var Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0b59c612"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/component/job/job-card.vue"]]);
wx.createComponent(Component);
