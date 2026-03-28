"use strict";
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
        gender: "",
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
          salary_min: "",
          salary_max: "",
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
          student_union_desc: "",
          club: false,
          club_desc: "",
          scholarship: false,
          scholarship_desc: "",
          honor: false,
          honor_desc: ""
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
      var _a, _b;
      try {
        const basic = await common_api_resume.resumeApi.getBasic();
        console.log("basic", basic);
        const intention = await common_api_resume.resumeApi.getIntention();
        console.log("intention", intention);
        const preference = await common_api_resume.resumeApi.getPreference();
        console.log("preference", preference);
        const campus = await common_api_resume.resumeApi.getCampus();
        console.log("campus", campus);
        const certificates = await common_api_resume.resumeApi.getCertificates();
        console.log("certificates", certificates);
        this.companySizeIndex = (_a = preference.company_size_preference) != null ? _a : 0;
        console.log("\u6682\u65E0\u7B80\u5386", this.resume.intention.city_priority);
        this.workTypeIndex = (_b = preference.work_type_preference) != null ? _b : 0;
        Object.assign(this.resume, {
          real_name: basic.real_name,
          gender: basic.gender,
          birth_date: basic.birth_date,
          phone: basic.mobile,
          email: basic.email,
          wechat: basic.wechat,
          city: basic.city,
          education_level: basic.education_level,
          school_name: basic.school_name,
          major: basic.major,
          graduation_year: basic.graduation_year,
          gpa: basic.gpa,
          self_introduction: basic.self_introduction
        });
        this.resume.intention = {
          industry: intention.target_industries,
          position: intention.target_positions,
          city: intention.city_priority,
          salary_min: intention.salary_min,
          salary_max: intention.salary_max,
          available_time: intention.availability
        }, Object.assign(this.resume.preference = {
          internship_conversion: preference.accept_intern_to_full === 1,
          remote_work: preference.accept_remote_city === 1,
          campus_recommendation: preference.need_campus_referral === 1,
          overtime: preference.accept_overtime === 1,
          business_trip: preference.accept_business_trip === 1
        });
        Object.assign(this.resume.campus_experience, {
          student_union: campus.has_student_union === 1,
          student_union_desc: campus.student_union_details || "",
          club: campus.has_club === 1,
          club_desc: campus.club_details || "",
          scholarship: campus.has_scholarship === 1,
          scholarship_desc: campus.scholarship_details || "",
          honor: campus.has_honor === 1,
          honor_desc: campus.honor_details || ""
        });
        this.resume.certificates = certificates || [];
        this.genderIndex = this.resume.gender === 2 ? 1 : 0;
      } catch (err) {
        console.log("\u6682\u65E0\u7B80\u5386");
      }
    },
    async saveResume() {
      try {
        await common_api_resume.resumeApi.saveBasic({
          real_name: this.resume.real_name,
          gender: this.resume.gender,
          birth_date: this.resume.birth_date,
          phone: this.resume.phone,
          email: this.resume.email,
          wechat: this.resume.wechat,
          city: this.resume.city,
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
          city_priority: this.resume.intention.city,
          salary_min: this.resume.intention.salary_min,
          salary_max: this.resume.intention.salary_max,
          availability: this.resume.intention.available_time
        });
        await common_api_resume.resumeApi.savePreference({
          accept_intern_to_full: this.resume.preference.internship_conversion ? 1 : 0,
          accept_remote_city: this.resume.preference.remote_work ? 1 : 0,
          need_campus_referral: this.resume.preference.campus_recommendation ? 1 : 0,
          accept_overtime: this.resume.preference.overtime ? 1 : 0,
          accept_business_trip: this.resume.preference.business_trip ? 1 : 0,
          company_size_preference: this.companySizeIndex,
          work_type_preference: this.workTypeIndex
        });
        await common_api_resume.resumeApi.saveCampus({
          has_student_union: this.resume.campus_experience.student_union ? 1 : 0,
          student_union_details: this.resume.campus_experience.student_union_desc,
          has_club: this.resume.campus_experience.club ? 1 : 0,
          club_details: this.resume.campus_experience.club_desc,
          has_scholarship: this.resume.campus_experience.scholarship ? 1 : 0,
          scholarship_details: this.resume.campus_experience.scholarship_desc,
          has_honor: this.resume.campus_experience.honor ? 1 : 0,
          honor_details: this.resume.campus_experience.honor_desc
        });
        for (const cert of this.resume.certificates) {
          if (!cert.id) {
            await common_api_resume.resumeApi.saveCertificates({
              cert_name: cert.cert_name,
              cert_type: cert.cert_type,
              issue_date: cert.issue_date,
              expiry_date: cert.expiry_date,
              certificate_no: cert.certificate_no,
              cert_level: cert.cert_level,
              issuing_authority: cert.issuing_authority,
              attachment_url: cert.attachment_url
            });
          }
        }
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
  return common_vendor.e({
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
    N: $data.resume.intention.salary_min,
    O: common_vendor.o(($event) => $data.resume.intention.salary_min = $event.detail.value),
    P: $data.resume.intention.salary_max,
    Q: common_vendor.o(($event) => $data.resume.intention.salary_max = $event.detail.value),
    R: $data.resume.intention.available_time,
    S: common_vendor.o(($event) => $data.resume.intention.available_time = $event.detail.value),
    T: $data.resume.preference.internship_conversion,
    U: common_vendor.o((e) => $data.resume.preference.internship_conversion = e.detail.value),
    V: common_vendor.o(($event) => _ctx.togglePreference("internship_conversion")),
    W: $data.resume.preference.remote_work,
    X: common_vendor.o((e) => $data.resume.preference.remote_work = e.detail.value),
    Y: common_vendor.o(($event) => _ctx.togglePreference("remote_work")),
    Z: $data.resume.preference.campus_recommendation,
    aa: common_vendor.o((e) => $data.resume.preference.campus_recommendation = e.detail.value),
    ab: common_vendor.o(($event) => _ctx.togglePreference("campus_recommendation")),
    ac: $data.resume.preference.overtime,
    ad: common_vendor.o((e) => $data.resume.preference.overtime = e.detail.value),
    ae: common_vendor.o(($event) => _ctx.togglePreference("overtime")),
    af: $data.resume.preference.business_trip,
    ag: common_vendor.o((e) => $data.resume.preference.business_trip = e.detail.value),
    ah: common_vendor.o(($event) => _ctx.togglePreference("business_trip")),
    ai: common_vendor.t($data.companySizeOptions[$data.companySizeIndex]),
    aj: common_vendor.o((...args) => $options.onCompanySizeChange && $options.onCompanySizeChange(...args)),
    ak: $data.companySizeIndex,
    al: $data.companySizeOptions,
    am: common_vendor.t($data.workTypeOptions[$data.workTypeIndex]),
    an: common_vendor.o((...args) => $options.onWorkTypeChange && $options.onWorkTypeChange(...args)),
    ao: $data.workTypeIndex,
    ap: $data.workTypeOptions,
    aq: $data.resume.campus_experience.student_union,
    ar: common_vendor.o((e) => $data.resume.campus_experience.student_union = e.detail.value),
    as: common_vendor.o(($event) => _ctx.toggleCampusExperience("student_union")),
    at: $data.resume.campus_experience.student_union
  }, $data.resume.campus_experience.student_union ? {
    av: $data.resume.campus_experience.student_union_desc,
    aw: common_vendor.o(($event) => $data.resume.campus_experience.student_union_desc = $event.detail.value)
  } : {}, {
    ax: $data.resume.campus_experience.club,
    ay: common_vendor.o((e) => $data.resume.campus_experience.club = e.detail.value),
    az: common_vendor.o(($event) => _ctx.toggleCampusExperience("club")),
    aA: $data.resume.campus_experience.club
  }, $data.resume.campus_experience.club ? {
    aB: $data.resume.campus_experience.club_desc,
    aC: common_vendor.o(($event) => $data.resume.campus_experience.club_desc = $event.detail.value)
  } : {}, {
    aD: $data.resume.campus_experience.scholarship,
    aE: common_vendor.o((e) => $data.resume.campus_experience.scholarship = e.detail.value),
    aF: common_vendor.o(($event) => _ctx.toggleCampusExperience("scholarship")),
    aG: $data.resume.campus_experience.scholarship
  }, $data.resume.campus_experience.scholarship ? {
    aH: $data.resume.campus_experience.scholarship_desc,
    aI: common_vendor.o(($event) => $data.resume.campus_experience.scholarship_desc = $event.detail.value)
  } : {}, {
    aJ: $data.resume.campus_experience.honor,
    aK: common_vendor.o((e) => $data.resume.campus_experience.honor = e.detail.value),
    aL: common_vendor.o(($event) => _ctx.toggleCampusExperience("honor")),
    aM: $data.resume.campus_experience.honor
  }, $data.resume.campus_experience.honor ? {
    aN: $data.resume.campus_experience.honor_desc,
    aO: common_vendor.o(($event) => $data.resume.campus_experience.honor_desc = $event.detail.value)
  } : {}, {
    aP: common_vendor.o((...args) => $options.addCertificate && $options.addCertificate(...args)),
    aQ: common_vendor.f($data.resume.certificates, (certificate, index, i0) => {
      return {
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
        r: index
      };
    }),
    aR: $data.certTypeOptions
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/resume/user_resume.vue"]]);
wx.createPage(MiniProgramPage);
