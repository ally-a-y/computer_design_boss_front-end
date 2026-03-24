"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_job = require("../../common/api/job.js");
const common_utils_themeSimple = require("../../common/utils/theme-simple.js");
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
      // 分类常量
      techCategories,
      designCategories,
      manageCategories,
      // 主题相关
      currentTheme: "light",
      isDarkMode: false
    };
  },
  onLoad() {
    this.getRecommendJobs();
    this.getJobCategories();
    this.initTheme();
  },
  onUnload() {
    common_vendor.index.$off("globalThemeChange", this.handleGlobalThemeChange);
  },
  onPullDownRefresh() {
    this.onRefresh();
  },
  methods: {
    /**
     * 初始化主题
     */
    initTheme() {
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    /**
     * 处理全局主题变化
     */
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme;
      this.isDarkMode = data.isDark;
    },
    async getRecommendJobs() {
      try {
        const networkType = await new Promise((resolve) => {
          common_vendor.index.getNetworkType({
            success: (res2) => resolve(res2.networkType)
          });
        });
        if (networkType === "none") {
          common_vendor.index.showToast({
            title: "当前无网络连接",
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
                title: "获取推荐职位失败: 数据格式错误",
                icon: "none"
              });
              jobsData = [];
            }
          } else {
            common_vendor.index.showToast({
              title: "获取推荐职位失败: 数据格式错误",
              icon: "none"
            });
            jobsData = [];
          }
        } else {
          common_vendor.index.showToast({
            title: "获取推荐职位失败: 后端无数据返回",
            icon: "none"
          });
          jobsData = [];
        }
        if (jobsData.length === 0) {
          jobsData = this.getMockJobsData();
        }
        jobsData = jobsData.map((job) => ({
          ...job,
          category_id: job.category_id && job.category_id !== "" ? Number(job.category_id) : null
        }));
        this.allJobs = jobsData;
        this.jobList = jobsData;
      } catch (error) {
        this.allJobs = [];
        this.jobList = [];
        common_vendor.index.__f__("error", "at pages/index/index_index.vue:224", "获取推荐职位失败:", error);
        common_vendor.index.__f__("error", "at pages/index/index_index.vue:225", "错误详情:", error.message, error.stack);
        if (error.message && error.message.includes("Packet sequence number wrong")) {
          common_vendor.index.showToast({
            title: "网络连接异常，请稍后重试",
            icon: "none"
          });
        } else {
          common_vendor.index.showToast({
            title: "获取推荐职位失败",
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
        this.subCategoryList = this.allCategories.filter(
          (category) => this.techCategories.includes(Number(category.id))
        );
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
    // 根据分类获取职位数据
    async getJobsByCategory(categoryId) {
      try {
        const networkType = await new Promise((resolve) => {
          common_vendor.index.getNetworkType({
            success: (res2) => resolve(res2.networkType)
          });
        });
        if (networkType === "none") {
          common_vendor.index.showToast({
            title: "当前无网络连接",
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
                title: "获取职位失败: 数据格式错误",
                icon: "none"
              });
              jobsData = [];
            }
          } else {
            common_vendor.index.showToast({
              title: "获取职位失败: 数据格式错误",
              icon: "none"
            });
            jobsData = [];
          }
        } else {
          common_vendor.index.showToast({
            title: "获取职位失败: 后端无数据返回",
            icon: "none"
          });
          jobsData = [];
        }
        jobsData = jobsData.map((job) => ({
          ...job,
          category_id: job.category_id && job.category_id !== "" ? Number(job.category_id) : null
        }));
        this.allJobs = jobsData;
        this.jobList = jobsData;
      } catch (error) {
        this.allJobs = [];
        this.jobList = [];
        common_vendor.index.__f__("error", "at pages/index/index_index.vue:353", "获取职位失败:", error);
        common_vendor.index.showToast({
          title: "获取职位失败",
          icon: "none"
        });
      }
    },
    // 选择子分类
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
    // 搜索输入事件
    onSearchInput() {
      if (this.allJobs.length === 0) {
        common_vendor.index.__f__("log", "at pages/index/index_index.vue:383", "allJobs为空，使用模拟数据");
        this.allJobs = this.getMockJobsData();
      }
      this.applyFilters();
    },
    // 应用所有筛选条件
    applyFilters() {
      if (this.allJobs.length === 0) {
        common_vendor.index.__f__("log", "at pages/index/index_index.vue:393", "allJobs为空，使用模拟数据");
        this.allJobs = this.getMockJobsData();
      }
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
    getJobCategories() {
      const mainCategories = [
        { id: "100", name: "技术开发", icon: "/static/category/tech.png" },
        { id: "200", name: "产品与设计", icon: "/static/category/design.png" },
        { id: "300", name: "技术管理", icon: "/static/category/product.png" }
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
        common_vendor.index.__f__("error", "at pages/index/index_index.vue:507", "获取职位分类失败:", error);
        this.categoryList = mainCategories;
        this.generateMockSubCategories();
      });
    },
    // 根据技术开发分类ID获取分类名称
    getTechSubCategoryName(categoryId) {
      const nameMap = {
        101: "前端开发",
        102: "后端开发",
        103: "移动开发",
        104: "人工智能",
        105: "大数据",
        106: "云计算",
        107: "网络安全",
        108: "嵌入式开发"
      };
      return nameMap[categoryId] || "未知分类";
    },
    // 确保allCategories包含技术开发的子分类
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
    // 生成模拟的子分类数据（当后端没有返回时使用）
    generateMockSubCategories() {
      this.allCategories = [
        // 技术开发类（101-108）
        { id: 101, name: "前端开发", parent_id: null },
        { id: 102, name: "后端开发", parent_id: null },
        { id: 103, name: "移动开发", parent_id: null },
        { id: 104, name: "人工智能", parent_id: null },
        { id: 105, name: "大数据", parent_id: null },
        { id: 106, name: "云计算", parent_id: null },
        { id: 107, name: "网络安全", parent_id: null },
        { id: 108, name: "嵌入式开发", parent_id: null },
        // 产品与设计类（200系列）
        { id: 200, name: "产品经理", parent_id: null },
        { id: 201, name: "UI设计师", parent_id: null },
        { id: 202, name: "交互设计师", parent_id: null },
        { id: 203, name: "UX研究员", parent_id: null },
        // 技术管理类（300系列）
        { id: 300, name: "技术经理", parent_id: null },
        { id: 301, name: "架构师", parent_id: null },
        { id: 302, name: "研发总监", parent_id: null },
        { id: 303, name: "CTO", parent_id: null }
      ];
    },
    // 生成模拟职位数据
    getMockJobsData() {
      const mockData = [
        // 技术开发类（101-108）
        { id: 1, title: "前端开发工程师", company: "科技有限公司", category_id: 101, emp_type: 1, description: "负责公司网站前端开发，使用Vue框架" },
        { id: 2, title: "后端开发工程师", company: "互联网科技", category_id: 102, emp_type: 1, description: "负责Java后端开发，熟悉Spring框架" },
        { id: 3, title: "移动端开发工程师", company: "移动科技", category_id: 103, emp_type: 1, description: "负责React Native移动应用开发" },
        { id: 4, title: "人工智能工程师", company: "AI科技", category_id: 104, emp_type: 1, description: "负责机器学习模型开发" },
        { id: 5, title: "大数据工程师", company: "数据科技", category_id: 105, emp_type: 1, description: "负责大数据平台开发" },
        { id: 6, title: "云计算工程师", company: "云服务", category_id: 106, emp_type: 1, description: "负责云平台架构设计" },
        { id: 7, title: "网络安全工程师", company: "安全科技", category_id: 107, emp_type: 1, description: "负责网络安全防护" },
        { id: 8, title: "嵌入式开发工程师", company: "硬件科技", category_id: 108, emp_type: 1, description: "负责嵌入式系统开发" },
        // 产品与设计类（200系列）
        { id: 9, title: "产品经理", company: "产品科技", category_id: 200, emp_type: 1, description: "负责产品规划和需求分析" },
        { id: 10, title: "UI设计师", company: "设计工作室", category_id: 201, emp_type: 2, description: "负责产品UI设计，熟悉Figma工具" },
        { id: 11, title: "交互设计师", company: "用户体验", category_id: 202, emp_type: 1, description: "负责交互设计和原型制作" },
        { id: 12, title: "UX研究员", company: "用户研究", category_id: 203, emp_type: 2, description: "负责用户调研和数据分析" },
        // 技术管理类（300系列）
        { id: 13, title: "技术经理", company: "管理团队", category_id: 300, emp_type: 1, description: "负责技术团队管理" },
        { id: 14, title: "架构师", company: "架构团队", category_id: 301, emp_type: 1, description: "负责系统架构设计" },
        { id: 15, title: "研发总监", company: "研发管理", category_id: 302, emp_type: 1, description: "负责研发部门管理" },
        { id: 16, title: "CTO", company: "技术领导", category_id: 303, emp_type: 1, description: "负责公司技术战略" }
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
    a: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    b: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    c: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    d: common_vendor.p({
      type: "search",
      size: "30",
      color: $data.isDarkMode ? "#999" : "#999"
    }),
    e: common_vendor.o([($event) => $data.keyword = $event.detail.value, (...args) => $options.onSearchInput && $options.onSearchInput(...args)]),
    f: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    g: $data.keyword,
    h: $data.isDarkMode ? "#2c2c2c" : "#F2F5F9",
    i: common_vendor.f($data.bannerList, (banner, index, i0) => {
      return {
        a: banner.imageUrl,
        b: index
      };
    }),
    j: common_vendor.f($data.categoryList, (category, k0, i0) => {
      return {
        a: category.icon,
        b: common_vendor.t(category.name),
        c: category.id,
        d: common_vendor.o(($event) => $options.goToCategory(category.id), category.id)
      };
    }),
    k: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    l: $data.isDarkMode ? "#2c2c2c" : "#fff",
    m: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    n: $data.showCategoryTabs && $data.subCategoryList.length > 0
  }, $data.showCategoryTabs && $data.subCategoryList.length > 0 ? {
    o: common_vendor.f($data.subCategoryList, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: common_vendor.o(($event) => $options.selectSubCategory(category.id), category.id),
        d: $data.selectedSubCategories.includes(category.id) ? 1 : ""
      };
    }),
    p: $data.isDarkMode ? "#3a3a3a" : "#F0F4FF"
  } : {}, {
    q: common_vendor.t(_ctx.categoryName || "推荐职位"),
    r: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    s: common_vendor.o((...args) => $options.scrollToJobList && $options.scrollToJobList(...args)),
    t: common_vendor.f($data.jobList, (job, k0, i0) => {
      return {
        a: job.id,
        b: "e1ad9be6-1-" + i0,
        c: common_vendor.p({
          data: job,
          ["is-dark"]: $data.isDarkMode
        })
      };
    }),
    v: $data.hasMore
  }, $data.hasMore ? {
    w: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    x: $data.isDarkMode ? "#999" : "#999"
  } : {}, {
    y: $data.isDarkMode ? "#2c2c2c" : "#fff",
    z: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    A: $data.isDarkMode ? "#1a1a1a" : "#F8FAFD"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index_index.js.map
