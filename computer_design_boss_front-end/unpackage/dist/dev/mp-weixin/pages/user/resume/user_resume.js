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
var common_api_resume = require("../../../common/api/resume.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      genderOptions: ["\u7537", "\u5973"],
      genderIndex: 0,
      companySizeOptions: ["\u4E0D\u9650", "\u5C0F\u578B", "\u4E2D\u578B", "\u5927\u578B"],
      companySizeIndex: 0,
      workTypeOptions: ["\u5168\u804C", "\u517C\u804C", "\u5B9E\u4E60"],
      workTypeIndex: 0,
      certTypeOptions: ["\u6280\u80FD\u7C7B", "\u8D44\u683C\u7C7B", "\u8BED\u8A00\u7C7B", "\u5176\u4ED6"],
      resume: {
        real_name: "",
        gender: 1,
        birth_date: "",
        phone: "",
        email: "",
        wechat: "",
        city: "",
        education_level: "",
        school_name: "",
        major: "",
        graduation_year: "",
        gpa: "",
        self_introduction: "",
        intention: {
          industry: "",
          position: "",
          city: "",
          salary: "",
          available_time: ""
        },
        preference: {
          internship_conversion: false,
          remote_work: false,
          campus_recommendation: false,
          overtime: false,
          business_trip: false
        },
        campus_experience: {
          student_union: false,
          club: false,
          scholarship: false,
          honor: false,
          description: ""
        },
        certificates: []
      }
    };
  },
  async onLoad() {
    await this.loadResume();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    async loadResume() {
      try {
        const basic = await common_api_resume.resumeApi.getBasic();
        const preference = await common_api_resume.resumeApi.getPreference();
        const campus = await common_api_resume.resumeApi.getCampus();
        this.resume = __spreadProps(__spreadValues(__spreadValues({}, this.resume), basic.data), {
          intention: intention.data || {},
          preference: preference.data || {},
          campus_experience: campus.data || {},
          certificates: certificates.data || []
        });
        this.genderIndex = this.resume.gender === 2 ? 1 : 0;
      } catch (err) {
        console.log("\u6682\u65E0\u7B80\u5386");
      }
    },
    async saveResume() {
      try {
        await common_api_resume.resumeApi.saveBasic({
          real_name: this.resume.real_name,
          phone: this.resume.gender,
          birth_date: this.resume.birth_date,
          email: this.resume.email,
          education_level: this.resume.education_level,
          school_name: this.resume.school_name,
          major: this.resume.major,
          graduation_year: this.resume.graduation_year,
          gpa: this.resume.gpa,
          self_introduction: this.resume.self_introduction
        });
        await common_api_resume.resumeApi.saveIntention({
          target_industries: this.resume.intention.industry,
          target_positions: this.resume.intention.position,
          salary_min: 100,
          salary_max: 1e4,
          target_city: this.resume.intention.city,
          available_time: this.resume.intention.available_time
        });
        await common_api_resume.resumeApi.savePreference(this.resume.preference);
        await common_api_resume.resumeApi.saveCampus(this.resume.campus_experience);
        common_vendor.index.showToast({
          title: "\u4FDD\u5B58\u6210\u529F",
          icon: "success"
        });
      } catch (err) {
        common_vendor.index.showToast({
          title: err.message || "\u4FDD\u5B58\u5931\u8D25",
          icon: "none"
        });
      }
    },
    onGenderChange(e) {
      this.genderIndex = e.detail.value;
      this.resume.gender = this.genderIndex === 1 ? 2 : 1;
    },
    onCompanySizeChange(e) {
      this.companySizeIndex = e.detail.value;
    },
    onWorkTypeChange(e) {
      this.workTypeIndex = e.detail.value;
    },
    addCertificate() {
      this.resume.certificates.push({
        cert_name: "",
        cert_type: 0,
        cert_level: "",
        issue_date: "",
        expiry_date: "",
        issuing_authority: "",
        certificate_no: "",
        attachment_url: ""
      });
    },
    deleteCertificate(index) {
      const cert = this.resume.certificates[index];
      if (!cert.id) {
        this.resume.certificates.splice(index, 1);
        return;
      }
      common_vendor.index.showModal({
        title: "\u5220\u9664\u8BC1\u4E66",
        content: "\u786E\u5B9A\u5220\u9664\u6B64\u8BC1\u4E66\u5417\uFF1F",
        success: async (res) => {
          if (res.confirm) {
            try {
              await common_api_resume.resumeApi.deleteCertificate(cert.id);
              this.resume.certificates.splice(index, 1);
              common_vendor.index.showToast({ title: "\u5220\u9664\u6210\u529F", icon: "success" });
            } catch (err) {
              common_vendor.index.showToast({ title: "\u5220\u9664\u5931\u8D25", icon: "none" });
            }
          }
        }
      });
    },
    getCertTypeIndex(type) {
      return this.certTypeOptions.indexOf(type);
    },
    onCertTypeChange(e, index) {
      const val = e.detail.value;
      this.resume.certificates[index].cert_type = this.certTypeOptions[val];
    },
    onCertDateChange(e, index, field) {
      this.resume.certificates[index][field] = e.detail.value;
    },
    getFileName(url) {
      if (!url)
        return "";
      const parts = url.split("/");
      return parts[parts.length - 1];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o((...args) => $options.saveResume && $options.saveResume(...args)),
    c: $data.resume.real_name,
    d: common_vendor.o(($event) => $data.resume.real_name = $event.detail.value),
    e: common_vendor.t($data.genderOptions[$data.genderIndex]),
    f: common_vendor.o((...args) => $options.onGenderChange && $options.onGenderChange(...args)),
    g: $data.genderIndex,
    h: $data.genderOptions,
    i: common_vendor.t($data.resume.birth_date || "\u8BF7\u9009\u62E9\u51FA\u751F\u65E5\u671F"),
    j: common_vendor.o((e) => $data.resume.birth_date = e.detail.value),
    k: $data.resume.birth_date,
    l: $data.resume.phone,
    m: common_vendor.o(($event) => $data.resume.phone = $event.detail.value),
    n: $data.resume.email,
    o: common_vendor.o(($event) => $data.resume.email = $event.detail.value),
    p: $data.resume.wechat,
    q: common_vendor.o(($event) => $data.resume.wechat = $event.detail.value),
    r: $data.resume.city,
    s: common_vendor.o(($event) => $data.resume.city = $event.detail.value),
    t: $data.resume.education_level,
    v: common_vendor.o(($event) => $data.resume.education_level = $event.detail.value),
    w: $data.resume.school_name,
    x: common_vendor.o(($event) => $data.resume.school_name = $event.detail.value),
    y: $data.resume.major,
    z: common_vendor.o(($event) => $data.resume.major = $event.detail.value),
    A: common_vendor.t($data.resume.graduation_year || "\u8BF7\u9009\u62E9\u6BD5\u4E1A\u5E74\u4EFD"),
    B: common_vendor.o((e) => $data.resume.graduation_year = e.detail.value.substring(0, 4)),
    C: $data.resume.graduation_year,
    D: $data.resume.gpa,
    E: common_vendor.o(($event) => $data.resume.gpa = $event.detail.value),
    F: $data.resume.self_introduction,
    G: common_vendor.o(($event) => $data.resume.self_introduction = $event.detail.value),
    H: $data.resume.intention.industry,
    I: common_vendor.o(($event) => $data.resume.intention.industry = $event.detail.value),
    J: $data.resume.intention.position,
    K: common_vendor.o(($event) => $data.resume.intention.position = $event.detail.value),
    L: $data.resume.intention.city,
    M: common_vendor.o(($event) => $data.resume.intention.city = $event.detail.value),
    N: $data.resume.intention.salary,
    O: common_vendor.o(($event) => $data.resume.intention.salary = $event.detail.value),
    P: $data.resume.intention.available_time,
    Q: common_vendor.o(($event) => $data.resume.intention.available_time = $event.detail.value),
    R: $data.resume.preference.internship_conversion,
    S: common_vendor.o((e) => $data.resume.preference.internship_conversion = e.detail.value),
    T: common_vendor.o(($event) => _ctx.togglePreference("internship_conversion")),
    U: $data.resume.preference.remote_work,
    V: common_vendor.o((e) => $data.resume.preference.remote_work = e.detail.value),
    W: common_vendor.o(($event) => _ctx.togglePreference("remote_work")),
    X: $data.resume.preference.campus_recommendation,
    Y: common_vendor.o((e) => $data.resume.preference.campus_recommendation = e.detail.value),
    Z: common_vendor.o(($event) => _ctx.togglePreference("campus_recommendation")),
    aa: $data.resume.preference.overtime,
    ab: common_vendor.o((e) => $data.resume.preference.overtime = e.detail.value),
    ac: common_vendor.o(($event) => _ctx.togglePreference("overtime")),
    ad: $data.resume.preference.business_trip,
    ae: common_vendor.o((e) => $data.resume.preference.business_trip = e.detail.value),
    af: common_vendor.o(($event) => _ctx.togglePreference("business_trip")),
    ag: common_vendor.t($data.companySizeOptions[$data.companySizeIndex]),
    ah: common_vendor.o((...args) => $options.onCompanySizeChange && $options.onCompanySizeChange(...args)),
    ai: $data.companySizeIndex,
    aj: $data.companySizeOptions,
    ak: common_vendor.t($data.workTypeOptions[$data.workTypeIndex]),
    al: common_vendor.o((...args) => $options.onWorkTypeChange && $options.onWorkTypeChange(...args)),
    am: $data.workTypeIndex,
    an: $data.workTypeOptions,
    ao: $data.resume.campus_experience.student_union,
    ap: common_vendor.o((e) => $data.resume.campus_experience.student_union = e.detail.value),
    aq: common_vendor.o(($event) => _ctx.toggleCampusExperience("student_union")),
    ar: $data.resume.campus_experience.club,
    as: common_vendor.o((e) => $data.resume.campus_experience.club = e.detail.value),
    at: common_vendor.o(($event) => _ctx.toggleCampusExperience("club")),
    av: $data.resume.campus_experience.scholarship,
    aw: common_vendor.o((e) => $data.resume.campus_experience.scholarship = e.detail.value),
    ax: common_vendor.o(($event) => _ctx.toggleCampusExperience("scholarship")),
    ay: $data.resume.campus_experience.honor,
    az: common_vendor.o((e) => $data.resume.campus_experience.honor = e.detail.value),
    aA: common_vendor.o(($event) => _ctx.toggleCampusExperience("honor")),
    aB: $data.resume.campus_experience.description,
    aC: common_vendor.o(($event) => $data.resume.campus_experience.description = $event.detail.value),
    aD: common_vendor.o((...args) => $options.addCertificate && $options.addCertificate(...args)),
    aE: common_vendor.f($data.resume.certificates, (certificate, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t($data.certTypeOptions[$options.getCertTypeIndex(certificate.cert_type)] || "\u8BF7\u9009\u62E9\u8BC1\u4E66\u7C7B\u578B"),
        b: common_vendor.o((e) => $options.onCertTypeChange(e, index)),
        c: $options.getCertTypeIndex(certificate.cert_type),
        d: certificate.cert_name,
        e: common_vendor.o(($event) => certificate.cert_name = $event.detail.value),
        f: certificate.cert_level,
        g: common_vendor.o(($event) => certificate.cert_level = $event.detail.value),
        h: common_vendor.t(certificate.issue_date || "\u8BF7\u9009\u62E9\u9881\u53D1\u65E5\u671F"),
        i: common_vendor.o((e) => $options.onCertDateChange(e, index, "issue_date")),
        j: certificate.issue_date,
        k: common_vendor.t(certificate.expiry_date || "\u8BF7\u9009\u62E9\u6709\u6548\u671F\uFF08\u53EF\u9009\uFF09"),
        l: common_vendor.o((e) => $options.onCertDateChange(e, index, "expiry_date")),
        m: certificate.expiry_date,
        n: certificate.issuing_authority,
        o: common_vendor.o(($event) => certificate.issuing_authority = $event.detail.value),
        p: certificate.certificate_no,
        q: common_vendor.o(($event) => certificate.certificate_no = $event.detail.value),
        r: common_vendor.o(($event) => _ctx.uploadCertificateFile(index)),
        s: certificate.attachment_url
      }, certificate.attachment_url ? {
        t: common_vendor.t($options.getFileName(certificate.attachment_url))
      } : {}, {
        v: common_vendor.o(($event) => _ctx.editCertificate(index)),
        w: common_vendor.o(($event) => $options.deleteCertificate(index)),
        x: index
      });
    }),
    aF: $data.certTypeOptions
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/resume/user_resume.vue"]]);
wx.createPage(MiniProgramPage);
