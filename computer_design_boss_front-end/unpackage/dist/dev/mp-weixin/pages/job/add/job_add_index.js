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
var common_vendor = require("../../../common/vendor.js");
var common_api_job = require("../../../common/api/job.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
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
        { id: 1001, name: "\u6280\u672F" },
        { id: 1002, name: "\u4EA7\u54C1" },
        { id: 1003, name: "\u8BBE\u8BA1" },
        { id: 1004, name: "\u8FD0\u8425" },
        { id: 1005, name: "\u5E02\u573A" }
      ],
      empTypeList: [
        { id: 1, name: "\u5168\u804C" },
        { id: 2, name: "\u517C\u804C" },
        { id: 3, name: "\u5B9E\u4E60" }
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
    getCategoryIndex() {
      return this.categoryList.findIndex((c) => c.id === this.jobData.category_id);
    },
    onCategoryChange(e) {
      const index = e.detail.value;
      this.jobData.category_id = this.categoryList[index].id;
    },
    getEmpTypeIndex() {
      return this.empTypeList.findIndex((t) => t.id === this.jobData.emp_type);
    },
    onEmpTypeChange(e) {
      const index = e.detail.value;
      this.jobData.emp_type = this.empTypeList[index].id;
    },
    async onSubmit() {
      if (!this.jobData.title || !this.jobData.company_id || !this.jobData.city_id || !this.jobData.category_id) {
        common_vendor.index.showToast({
          title: "\u8BF7\u586B\u5199\u5FC5\u586B\u9879",
          icon: "none"
        });
        return;
      }
      try {
        const submitData = __spreadProps(__spreadValues({}, this.jobData), {
          boss_job_id: Date.now().toString(),
          company_id: parseInt(this.jobData.company_id),
          city_id: parseInt(this.jobData.city_id),
          category_id: parseInt(this.jobData.category_id),
          emp_type: parseInt(this.jobData.emp_type),
          salary_min: parseFloat(this.jobData.salary_min) * 1e3,
          salary_max: parseFloat(this.jobData.salary_max) * 1e3,
          publish_time: new Date().toISOString(),
          refresh_time: new Date().toISOString()
        });
        await common_api_job.jobApi.addJob(submitData);
        common_vendor.index.showToast({
          title: "\u53D1\u5E03\u6210\u529F",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack({
            delta: 1
          });
        }, 1500);
      } catch (error) {
        console.error("\u53D1\u5E03\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u53D1\u5E03\u5931\u8D25",
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
    i: common_vendor.t($options.selectedCategoryName || "\u8BF7\u9009\u62E9\u804C\u4F4D\u5206\u7C7B"),
    j: $data.categoryList,
    k: $options.getCategoryIndex(),
    l: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    m: common_vendor.t($options.selectedEmpTypeName || "\u8BF7\u9009\u62E9\u5C31\u4E1A\u7C7B\u578B"),
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
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/job/add/job_add_index.vue"]]);
wx.createPage(MiniProgramPage);
