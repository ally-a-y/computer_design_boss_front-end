"use strict";
const common_vendor = require("../../common/vendor.js");
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
          title: "已取消收藏",
          icon: "success"
        });
      } else {
        const newCollection = {
          id: this.data.id,
          jobTitle: this.data.title,
          company: this.data.company || "未知公司",
          salary: this.formatSalary(this.data.salary_min, this.data.salary_max),
          collectionTime: (/* @__PURE__ */ new Date()).toLocaleString()
        };
        collections.push(newCollection);
        this.isFavorite = true;
        common_vendor.index.showToast({
          title: "收藏成功",
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
          title: "已取消投递",
          icon: "success"
        });
      } else {
        const newDeliver = {
          id: this.data.id,
          jobTitle: this.data.title,
          company: this.data.company || "未知公司",
          salary: this.formatSalary(this.data.salary_min, this.data.salary_max),
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
    // 格式化薪资
    formatSalary(min, max) {
      if (min && max) {
        const minNum = typeof min === "number" ? min : parseFloat(min);
        const maxNum = typeof max === "number" ? max : parseFloat(max);
        return `${(minNum / 1e3).toFixed(0)}-${(maxNum / 1e3).toFixed(0)}K`;
      }
      return "薪资面议";
    },
    goToDetail(data) {
      common_vendor.index.__f__("log", "at component/job/job-card.vue:166", "转换后的b:", data.id);
      common_vendor.index.navigateTo({
        url: `/pages/job/detail/job_detail_index?id=${data.id}`
      });
    },
    // 获取公司名称
    getCompanyName(data) {
      const companyMap = {
        "1": "花旗金融信息服务（中国）有限公司",
        "2": "中国移动通信有限公司在线营销服务中心",
        "3": "Victoria's Secret"
      };
      return companyMap[data.company_id] || "未知公司";
    },
    // 获取职位标签
    getJobTags(data) {
      if (data.welfare_list) {
        return Array.isArray(data.welfare_list) ? data.welfare_list : JSON.parse(data.welfare_list);
      }
      return ["五险一金", "弹性工作", "带薪年假"];
    },
    // 格式化发布时间
    formatTime(publishTime) {
      if (!publishTime)
        return "今天";
      try {
        const date = new Date(publishTime);
        const now = /* @__PURE__ */ new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
        if (days === 0) {
          return "今天";
        } else if (days === 1) {
          return "昨天";
        } else if (days < 7) {
          return `${days}天前`;
        } else {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at component/job/job-card.vue:220", "日期格式化失败:", error);
        return "今天";
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
    d: common_vendor.t($props.data.company || "未知公司"),
    e: $props.isDark ? "#ffffff" : "#1E1E1E",
    f: common_vendor.t($props.data.exp_req || "经验不限"),
    g: common_vendor.t($props.data.edu_req || "学历不限"),
    h: $props.isDark ? "#999" : "#6C757D",
    i: common_vendor.f($options.getJobTags($props.data), (tag, k0, i0) => {
      return {
        a: common_vendor.t(tag),
        b: tag
      };
    }),
    j: $props.isDark ? "#3a3a3a" : "#F2F5F9",
    k: $props.isDark ? "#ccc" : "#6C757D",
    l: common_vendor.t($props.data.city || "城市"),
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
    v: common_vendor.t($data.isApplied ? "已投递" : "投递"),
    w: $data.isApplied ? 1 : "",
    x: common_vendor.o((...args) => $options.applyForJob && $options.applyForJob(...args)),
    y: $data.isApplied ? $props.isDark ? "#3a3a3a" : "#F2F5F9" : "#007aff",
    z: $data.isApplied ? $props.isDark ? "#999" : "#6C757D" : "white",
    A: $props.isDark ? "#2c2c2c" : "#fff",
    B: $props.isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)"
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8b16e01f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/component/job/job-card.js.map
