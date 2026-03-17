"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var common_vendor = require("../../common/vendor.js");
var common_api_job = require("../../common/api/job.js");
require("../../common/api/request.js");
require("../../common/config.js");
const jobCard = () => "../../component/job/job-card.js";
const _sfc_main = {
  components: {
    jobCard
  },
  data() {
    const techCategories = [101, 102, 103, 104, 105, 106, 107, 108];
    const designCategories = [200, 201, 202, 203, 204, 205];
    const manageCategories = [300, 301, 302, 303];
    return {
      bannerList: [
        { id: 1, imageUrl: "/static/banner1.png" },
        { id: 2, imageUrl: "/static/banner2.png" },
        { id: 3, imageUrl: "/static/banner3.png" }
      ],
      categoryList: [],
      allCategories: [],
      subCategoryList: [],
      jobList: [],
      allJobs: [],
      hasMore: true,
      currentPage: 1,
      pageSize: 10,
      currentCategory: "",
      currentEmpType: "",
      keyword: "",
      selectedSubCategories: [],
      showCategoryTabs: false,
      techCategories,
      designCategories,
      manageCategories
    };
  },
  onLoad() {
    this.getRecommendJobs();
    this.getJobCategories();
  },
  onPullDownRefresh() {
    this.onRefresh();
  },
  methods: {
    async getRecommendJobs() {
      try {
        const networkType = await new Promise((resolve) => {
          common_vendor.index.getNetworkType({
            success: (res2) => resolve(res2.networkType)
          });
        });
        if (networkType === "none") {
          common_vendor.index.showToast({
            title: "\u5F53\u524D\u65E0\u7F51\u7EDC\u8FDE\u63A5",
            icon: "none"
          });
          return;
        }
        const res = await common_api_job.jobApi.getAllJobs();
        let jobsData = [];
        if (res !== null && res !== void 0) {
          if (Array.isArray(res)) {
            jobsData = res;
          } else if (typeof res === "object" && Object.keys(res).length > 0) {
            if (res.list && Array.isArray(res.list)) {
              jobsData = res.list;
            } else if (res.data && Array.isArray(res.data)) {
              jobsData = res.data;
            } else if (res.jobs && Array.isArray(res.jobs)) {
              jobsData = res.jobs;
            } else {
              common_vendor.index.showToast({
                title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
                icon: "none"
              });
              jobsData = [];
            }
          } else {
            common_vendor.index.showToast({
              title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
              icon: "none"
            });
            jobsData = [];
          }
        } else {
          common_vendor.index.showToast({
            title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25: \u540E\u7AEF\u65E0\u6570\u636E\u8FD4\u56DE",
            icon: "none"
          });
          jobsData = [];
        }
        if (jobsData.length === 0) {
          jobsData = this.getMockJobsData();
        }
        jobsData = jobsData.map((job) => __spreadProps(__spreadValues({}, job), {
          category_id: job.category_id && job.category_id !== "" ? Number(job.category_id) : null
        }));
        this.allJobs = jobsData;
        this.jobList = jobsData;
      } catch (error) {
        this.allJobs = [];
        this.jobList = [];
        console.error("\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25:", error);
        console.error("\u9519\u8BEF\u8BE6\u60C5:", error.message, error.stack);
        if (error.message && error.message.includes("Packet sequence number wrong")) {
          common_vendor.index.showToast({
            title: "\u7F51\u7EDC\u8FDE\u63A5\u5F02\u5E38\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
            icon: "none"
          });
        } else {
          common_vendor.index.showToast({
            title: "\u83B7\u53D6\u63A8\u8350\u804C\u4F4D\u5931\u8D25",
            icon: "none"
          });
        }
      }
    },
    goToCategory(categoryId) {
      if (this.techCategories.includes(Number(categoryId))) {
        this.currentCategory = "100";
      } else {
        this.currentCategory = categoryId;
      }
      if (this.currentCategory === "100" || this.techCategories.includes(Number(categoryId))) {
        this.showCategoryTabs = true;
        this.subCategoryList = this.allCategories.filter((category) => this.techCategories.includes(Number(category.id)));
      } else {
        this.showCategoryTabs = false;
        this.subCategoryList = [];
      }
      this.selectedSubCategories = [];
      this.keyword = "";
      if (categoryId === "100" || !this.techCategories.includes(Number(categoryId))) {
        this.getJobsByCategory(categoryId);
      } else {
        this.selectedSubCategories = [Number(categoryId)];
        this.applyFilters();
      }
    },
    async getJobsByCategory(categoryId) {
      try {
        const networkType = await new Promise((resolve) => {
          common_vendor.index.getNetworkType({
            success: (res2) => resolve(res2.networkType)
          });
        });
        if (networkType === "none") {
          common_vendor.index.showToast({
            title: "\u5F53\u524D\u65E0\u7F51\u7EDC\u8FDE\u63A5",
            icon: "none"
          });
          return;
        }
        const res = await common_api_job.jobApi.getJobsByCategory(categoryId);
        let jobsData = [];
        if (res !== null && res !== void 0) {
          if (Array.isArray(res)) {
            jobsData = res;
          } else if (typeof res === "object" && Object.keys(res).length > 0) {
            if (res.list && Array.isArray(res.list)) {
              jobsData = res.list;
            } else if (res.data && Array.isArray(res.data)) {
              jobsData = res.data;
            } else if (res.jobs && Array.isArray(res.jobs)) {
              jobsData = res.jobs;
            } else {
              common_vendor.index.showToast({
                title: "\u83B7\u53D6\u804C\u4F4D\u5931\u8D25: \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
                icon: "none"
              });
              jobsData = [];
            }
          } else {
            common_vendor.index.showToast({
              title: "\u83B7\u53D6\u804C\u4F4D\u5931\u8D25: \u6570\u636E\u683C\u5F0F\u9519\u8BEF",
              icon: "none"
            });
            jobsData = [];
          }
        } else {
          common_vendor.index.showToast({
            title: "\u83B7\u53D6\u804C\u4F4D\u5931\u8D25: \u540E\u7AEF\u65E0\u6570\u636E\u8FD4\u56DE",
            icon: "none"
          });
          jobsData = [];
        }
        jobsData = jobsData.map((job) => __spreadProps(__spreadValues({}, job), {
          category_id: job.category_id && job.category_id !== "" ? Number(job.category_id) : null
        }));
        this.allJobs = jobsData;
        this.jobList = jobsData;
      } catch (error) {
        this.allJobs = [];
        this.jobList = [];
        console.error("\u83B7\u53D6\u804C\u4F4D\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u804C\u4F4D\u5931\u8D25",
          icon: "none"
        });
      }
    },
    selectSubCategory(categoryId) {
      const numCategoryId = Number(categoryId);
      const index = this.selectedSubCategories.indexOf(numCategoryId);
      if (index === -1) {
        this.selectedSubCategories.push(numCategoryId);
      } else {
        this.selectedSubCategories.splice(index, 1);
      }
      this.applyFilters();
    },
    onSearchInput() {
      this.applyFilters();
    },
    applyFilters() {
      let filteredJobs = [...this.allJobs];
      if (this.currentCategory) {
        const currentCatNum = Number(this.currentCategory);
        const selectedSubCats = Array.from(this.selectedSubCategories).map((id) => Number(id));
        filteredJobs = filteredJobs.filter((job) => {
          if (!job || job.category_id === null) {
            return false;
          }
          const jobCategoryId = Number(job.category_id);
          if (currentCatNum === 100) {
            if (selectedSubCats.length > 0) {
              return selectedSubCats.some((catId) => catId === jobCategoryId);
            } else {
              return this.techCategories.includes(jobCategoryId);
            }
          } else if (this.techCategories.includes(currentCatNum)) {
            return jobCategoryId === currentCatNum;
          } else if (this.designCategories.includes(currentCatNum)) {
            return this.designCategories.includes(jobCategoryId);
          } else if (this.manageCategories.includes(currentCatNum)) {
            return this.manageCategories.includes(jobCategoryId);
          } else {
            return jobCategoryId === currentCatNum;
          }
        });
      }
      if (this.keyword && this.keyword.trim() !== "") {
        const keywordLower = this.keyword.toLowerCase().trim();
        filteredJobs = filteredJobs.filter((job) => {
          const titleMatch = job.title && job.title.toLowerCase().includes(keywordLower);
          const companyMatch = job.company && job.company.toLowerCase().includes(keywordLower);
          const descriptionMatch = job.description && job.description.toLowerCase().includes(keywordLower);
          const isMatch = titleMatch || companyMatch || descriptionMatch;
          return isMatch;
        });
      }
      this.jobList = filteredJobs;
    },
    scrollToJobList() {
      common_vendor.index.pageScrollTo({
        selector: ".job-list",
        duration: 300
      });
    },
    loadMore() {
      this.currentPage++;
    },
    onRefresh() {
      this.currentPage = 1;
      this.getRecommendJobs();
      this.getJobCategories();
      common_vendor.index.stopPullDownRefresh();
    },
    goToAddJob() {
      common_vendor.index.navigateTo({
        url: "/pages/job/add/job_add_index"
      });
    },
    getJobCategories() {
      const mainCategories = [
        { id: "100", name: "\u6280\u672F\u5F00\u53D1", icon: "/static/category/tech.png" },
        { id: "200", name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1", icon: "/static/category/design.png" },
        { id: "300", name: "\u6280\u672F\u7BA1\u7406", icon: "/static/category/product.png" }
      ];
      common_api_job.jobApi.getJobCategories().then((res) => {
        if (res && Array.isArray(res)) {
          this.allCategories = res;
          this.categoryList = mainCategories;
          this.ensureTechSubCategories();
        } else {
          this.categoryList = mainCategories;
          this.generateMockSubCategories();
        }
      }).catch((error) => {
        console.error("\u83B7\u53D6\u804C\u4F4D\u5206\u7C7B\u5931\u8D25:", error);
        this.categoryList = mainCategories;
        this.generateMockSubCategories();
      });
    },
    getTechSubCategoryName(categoryId) {
      const nameMap = {
        101: "\u524D\u7AEF\u5F00\u53D1",
        102: "\u540E\u7AEF\u5F00\u53D1",
        103: "\u79FB\u52A8\u5F00\u53D1",
        104: "\u4EBA\u5DE5\u667A\u80FD",
        105: "\u5927\u6570\u636E",
        106: "\u4E91\u8BA1\u7B97",
        107: "\u7F51\u7EDC\u5B89\u5168",
        108: "\u5D4C\u5165\u5F0F\u5F00\u53D1"
      };
      return nameMap[categoryId] || "\u672A\u77E5\u5206\u7C7B";
    },
    ensureTechSubCategories() {
      const techSubCategories = this.techCategories.map((id) => ({
        id,
        name: this.getTechSubCategoryName(id),
        parent_id: null
      }));
      const existingIds = this.allCategories.map((cat) => Number(cat.id));
      techSubCategories.forEach((subCat) => {
        if (!existingIds.includes(subCat.id)) {
          this.allCategories.push(subCat);
        }
      });
    },
    generateMockSubCategories() {
      this.allCategories = [
        { id: 101, name: "\u524D\u7AEF\u5F00\u53D1", parent_id: null },
        { id: 102, name: "\u540E\u7AEF\u5F00\u53D1", parent_id: null },
        { id: 103, name: "\u79FB\u52A8\u5F00\u53D1", parent_id: null },
        { id: 104, name: "\u4EBA\u5DE5\u667A\u80FD", parent_id: null },
        { id: 105, name: "\u5927\u6570\u636E", parent_id: null },
        { id: 106, name: "\u4E91\u8BA1\u7B97", parent_id: null },
        { id: 107, name: "\u7F51\u7EDC\u5B89\u5168", parent_id: null },
        { id: 108, name: "\u5D4C\u5165\u5F0F\u5F00\u53D1", parent_id: null },
        { id: 200, name: "\u4EA7\u54C1\u7ECF\u7406", parent_id: null },
        { id: 201, name: "UI\u8BBE\u8BA1\u5E08", parent_id: null },
        { id: 202, name: "\u4EA4\u4E92\u8BBE\u8BA1\u5E08", parent_id: null },
        { id: 203, name: "UX\u7814\u7A76\u5458", parent_id: null },
        { id: 300, name: "\u6280\u672F\u7ECF\u7406", parent_id: null },
        { id: 301, name: "\u67B6\u6784\u5E08", parent_id: null },
        { id: 302, name: "\u7814\u53D1\u603B\u76D1", parent_id: null },
        { id: 303, name: "CTO", parent_id: null }
      ];
    },
    getMockJobsData() {
      const mockData = [
        { id: 1, title: "\u524D\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08", company: "\u79D1\u6280\u6709\u9650\u516C\u53F8", category_id: 101, emp_type: 1, description: "\u8D1F\u8D23\u516C\u53F8\u7F51\u7AD9\u524D\u7AEF\u5F00\u53D1\uFF0C\u4F7F\u7528Vue\u6846\u67B6" },
        { id: 2, title: "\u540E\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08", company: "\u4E92\u8054\u7F51\u79D1\u6280", category_id: 102, emp_type: 1, description: "\u8D1F\u8D23Java\u540E\u7AEF\u5F00\u53D1\uFF0C\u719F\u6089Spring\u6846\u67B6" },
        { id: 3, title: "\u79FB\u52A8\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08", company: "\u79FB\u52A8\u79D1\u6280", category_id: 103, emp_type: 1, description: "\u8D1F\u8D23React Native\u79FB\u52A8\u5E94\u7528\u5F00\u53D1" },
        { id: 4, title: "\u4EBA\u5DE5\u667A\u80FD\u5DE5\u7A0B\u5E08", company: "AI\u79D1\u6280", category_id: 104, emp_type: 1, description: "\u8D1F\u8D23\u673A\u5668\u5B66\u4E60\u6A21\u578B\u5F00\u53D1" },
        { id: 5, title: "\u5927\u6570\u636E\u5DE5\u7A0B\u5E08", company: "\u6570\u636E\u79D1\u6280", category_id: 105, emp_type: 1, description: "\u8D1F\u8D23\u5927\u6570\u636E\u5E73\u53F0\u5F00\u53D1" },
        { id: 6, title: "\u4E91\u8BA1\u7B97\u5DE5\u7A0B\u5E08", company: "\u4E91\u670D\u52A1", category_id: 106, emp_type: 1, description: "\u8D1F\u8D23\u4E91\u5E73\u53F0\u67B6\u6784\u8BBE\u8BA1" },
        { id: 7, title: "\u7F51\u7EDC\u5B89\u5168\u5DE5\u7A0B\u5E08", company: "\u5B89\u5168\u79D1\u6280", category_id: 107, emp_type: 1, description: "\u8D1F\u8D23\u7F51\u7EDC\u5B89\u5168\u9632\u62A4" },
        { id: 8, title: "\u5D4C\u5165\u5F0F\u5F00\u53D1\u5DE5\u7A0B\u5E08", company: "\u786C\u4EF6\u79D1\u6280", category_id: 108, emp_type: 1, description: "\u8D1F\u8D23\u5D4C\u5165\u5F0F\u7CFB\u7EDF\u5F00\u53D1" },
        { id: 9, title: "\u4EA7\u54C1\u7ECF\u7406", company: "\u4EA7\u54C1\u79D1\u6280", category_id: 200, emp_type: 1, description: "\u8D1F\u8D23\u4EA7\u54C1\u89C4\u5212\u548C\u9700\u6C42\u5206\u6790" },
        { id: 10, title: "UI\u8BBE\u8BA1\u5E08", company: "\u8BBE\u8BA1\u5DE5\u4F5C\u5BA4", category_id: 201, emp_type: 2, description: "\u8D1F\u8D23\u4EA7\u54C1UI\u8BBE\u8BA1\uFF0C\u719F\u6089Figma\u5DE5\u5177" },
        { id: 11, title: "\u4EA4\u4E92\u8BBE\u8BA1\u5E08", company: "\u7528\u6237\u4F53\u9A8C", category_id: 202, emp_type: 1, description: "\u8D1F\u8D23\u4EA4\u4E92\u8BBE\u8BA1\u548C\u539F\u578B\u5236\u4F5C" },
        { id: 12, title: "UX\u7814\u7A76\u5458", company: "\u7528\u6237\u7814\u7A76", category_id: 203, emp_type: 2, description: "\u8D1F\u8D23\u7528\u6237\u8C03\u7814\u548C\u6570\u636E\u5206\u6790" },
        { id: 13, title: "\u6280\u672F\u7ECF\u7406", company: "\u7BA1\u7406\u56E2\u961F", category_id: 300, emp_type: 1, description: "\u8D1F\u8D23\u6280\u672F\u56E2\u961F\u7BA1\u7406" },
        { id: 14, title: "\u67B6\u6784\u5E08", company: "\u67B6\u6784\u56E2\u961F", category_id: 301, emp_type: 1, description: "\u8D1F\u8D23\u7CFB\u7EDF\u67B6\u6784\u8BBE\u8BA1" },
        { id: 15, title: "\u7814\u53D1\u603B\u76D1", company: "\u7814\u53D1\u7BA1\u7406", category_id: 302, emp_type: 1, description: "\u8D1F\u8D23\u7814\u53D1\u90E8\u95E8\u7BA1\u7406" },
        { id: 16, title: "CTO", company: "\u6280\u672F\u9886\u5BFC", category_id: 303, emp_type: 1, description: "\u8D1F\u8D23\u516C\u53F8\u6280\u672F\u6218\u7565" }
      ];
      return mockData;
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _component_job_card = common_vendor.resolveComponent("job-card");
  (_component_uni_icons + _component_job_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "search",
      size: "30",
      color: "#999"
    }),
    b: common_vendor.o([($event) => $data.keyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    c: $data.keyword,
    d: common_vendor.f($data.bannerList, (banner, index, i0) => {
      return {
        a: banner.imageUrl,
        b: index
      };
    }),
    e: common_vendor.f($data.categoryList, (category, k0, i0) => {
      return {
        a: category.icon,
        b: common_vendor.t(category.name),
        c: category.id,
        d: common_vendor.o(($event) => $options.goToCategory(category.id), category.id)
      };
    }),
    f: $data.showCategoryTabs && $data.subCategoryList.length > 0
  }, $data.showCategoryTabs && $data.subCategoryList.length > 0 ? {
    g: common_vendor.f($data.subCategoryList, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: common_vendor.o(($event) => $options.selectSubCategory(category.id), category.id),
        d: $data.selectedSubCategories.includes(category.id) ? 1 : ""
      };
    })
  } : {}, {
    h: common_vendor.o((...args) => $options.scrollToJobList && $options.scrollToJobList(...args)),
    i: common_vendor.f($data.jobList, (job, k0, i0) => {
      return {
        a: job.id,
        b: "fd2dfda4-1-" + i0,
        c: common_vendor.p({
          data: job
        })
      };
    }),
    j: $data.hasMore
  }, $data.hasMore ? {
    k: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    l: common_vendor.o((...args) => $options.goToAddJob && $options.goToAddJob(...args))
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/index/index_index.vue"]]);
wx.createPage(MiniProgramPage);
