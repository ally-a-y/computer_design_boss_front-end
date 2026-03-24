"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_job = require("../../../common/api/job.js");
const _sfc_main = {
  data() {
    return {
      jobData: {
        boss_job_id: "",
        title: "",
        company_id: "",
        city_id: "",
        category_id: 0,
        emp_type: 0,
        salary_min: "",
        salary_max: "",
        salary_desc: "",
        edu_req: "",
        exp_req: "",
        district: "",
        address: "",
        recruiter_id: "",
        description: "",
        require_list: [],
        welfare_list: [],
        publish_time: "",
        refresh_time: "",
        status: 1
      },
      categoryList: [
        { id: 1001, name: "技术" },
        { id: 1002, name: "产品" },
        { id: 1003, name: "设计" },
        { id: 1004, name: "运营" },
        { id: 1005, name: "市场" }
      ],
      empTypeList: [
        { id: 1, name: "全职" },
        { id: 2, name: "兼职" },
        { id: 3, name: "实习" }
      ]
    };
  },
  computed: {
    selectedCategoryName() {
      const category = this.categoryList.find((c) => c.id === this.jobData.category_id);
      return category ? category.name : "";
    },
    selectedEmpTypeName() {
      const type = this.empTypeList.find((t) => t.id === this.jobData.emp_type);
      return type ? type.name : "";
    }
  },
  methods: {
    onCancel() {
      common_vendor.index.navigateBack();
    },
    // 获取职位分类在picker中的索引
    getCategoryIndex() {
      return this.categoryList.findIndex((c) => c.id === this.jobData.category_id);
    },
    // 职位分类选择变化处理
    onCategoryChange(e) {
      const index = e.detail.value;
      this.jobData.category_id = this.categoryList[index].id;
    },
    // 获取就业类型在picker中的索引
    getEmpTypeIndex() {
      return this.empTypeList.findIndex((t) => t.id === this.jobData.emp_type);
    },
    // 就业类型选择变化处理
    onEmpTypeChange(e) {
      const index = e.detail.value;
      this.jobData.emp_type = this.empTypeList[index].id;
    },
    async onSubmit() {
      if (!this.jobData.title || !this.jobData.company_id || !this.jobData.city_id || !this.jobData.category_id) {
        common_vendor.index.showToast({
          title: "请填写必填项",
          icon: "none"
        });
        return;
      }
      try {
        const submitData = {
          ...this.jobData,
          boss_job_id: Date.now().toString(),
          company_id: parseInt(this.jobData.company_id),
          city_id: parseInt(this.jobData.city_id),
          category_id: parseInt(this.jobData.category_id),
          emp_type: parseInt(this.jobData.emp_type),
          salary_min: parseFloat(this.jobData.salary_min) * 1e3,
          salary_max: parseFloat(this.jobData.salary_max) * 1e3,
          publish_time: (/* @__PURE__ */ new Date()).toISOString(),
          refresh_time: (/* @__PURE__ */ new Date()).toISOString()
        };
        await common_api_job.jobApi.addJob(submitData);
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack({
            delta: 1
          });
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/job/add/job_add_index.vue:194", "发布失败:", error);
        common_vendor.index.showToast({
          title: "发布失败",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.onCancel && $options.onCancel(...args)),
    b: common_vendor.o((...args) => $options.onSubmit && $options.onSubmit(...args)),
    c: $data.jobData.title,
    d: common_vendor.o(($event) => $data.jobData.title = $event.detail.value),
    e: $data.jobData.company_id,
    f: common_vendor.o(($event) => $data.jobData.company_id = $event.detail.value),
    g: $data.jobData.city_id,
    h: common_vendor.o(($event) => $data.jobData.city_id = $event.detail.value),
    i: common_vendor.t($options.selectedCategoryName || "请选择职位分类"),
    j: $data.categoryList,
    k: $options.getCategoryIndex(),
    l: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    m: common_vendor.t($options.selectedEmpTypeName || "请选择就业类型"),
    n: $data.empTypeList,
    o: $options.getEmpTypeIndex(),
    p: common_vendor.o((...args) => $options.onEmpTypeChange && $options.onEmpTypeChange(...args)),
    q: $data.jobData.salary_min,
    r: common_vendor.o(($event) => $data.jobData.salary_min = $event.detail.value),
    s: $data.jobData.salary_max,
    t: common_vendor.o(($event) => $data.jobData.salary_max = $event.detail.value),
    v: $data.jobData.edu_req,
    w: common_vendor.o(($event) => $data.jobData.edu_req = $event.detail.value),
    x: $data.jobData.exp_req,
    y: common_vendor.o(($event) => $data.jobData.exp_req = $event.detail.value),
    z: $data.jobData.description,
    A: common_vendor.o(($event) => $data.jobData.description = $event.detail.value)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/job/add/job_add_index.js.map
