"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      genderOptions: ["\u7537", "\u5973"],
      genderIndex: 0,
      certTypeOptions: ["english", "computer", "professional"],
      certTypeDisplayOptions: ["\u82F1\u8BED\u8BC1\u4E66", "\u8BA1\u7B97\u673A\u8BC1\u4E66", "\u804C\u4E1A\u8D44\u683C\u8BC1\u4E66"],
      companySizeOptions: ["1-50\u4EBA", "51-200\u4EBA", "201-500\u4EBA", "501-1000\u4EBA", "1001-5000\u4EBA", "5000\u4EBA\u4EE5\u4E0A"],
      companySizeIndex: 4,
      workTypeOptions: ["\u5168\u804C", "\u517C\u804C", "\u5B9E\u4E60", "\u8FDC\u7A0B\u5DE5\u4F5C", "\u81EA\u7531\u804C\u4E1A"],
      workTypeIndex: 0,
      resume: {
        real_name: "\u5F20\u4E09",
        gender: 1,
        birth_date: "2000-01-01",
        phone: "13800138000",
        email: "zhangsan@example.com",
        wechat: "zhangsan123",
        city: "\u5317\u4EAC",
        education_level: "\u672C\u79D1",
        school_name: "\u5317\u4EAC\u5927\u5B66",
        major: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F",
        graduation_year: "2022",
        gpa: "3.8",
        self_introduction: "\u6211\u662F\u4E00\u540D\u8BA1\u7B97\u673A\u4E13\u4E1A\u7684\u6BD5\u4E1A\u751F\uFF0C\u5177\u6709\u624E\u5B9E\u7684\u4E13\u4E1A\u57FA\u7840\u548C\u8F83\u5F3A\u7684\u5B66\u4E60\u80FD\u529B...",
        intention: {
          industry: "\u4E92\u8054\u7F51",
          position: "\u524D\u7AEF\u5F00\u53D1\u5DE5\u7A0B\u5E08",
          city: "\u5317\u4EAC",
          salary: "15k-25k",
          available_time: "\u7ACB\u5373\u5230\u5C97"
        },
        preference: {
          internship_conversion: true,
          remote_work: false,
          campus_recommendation: true,
          overtime: true,
          business_trip: false,
          company_size: "1000-5000\u4EBA",
          work_type: "\u5168\u804C"
        },
        campus_experience: {
          student_union: true,
          club: true,
          scholarship: true,
          honor: false,
          description: "\u66FE\u62C5\u4EFB\u5B66\u751F\u4F1A\u5BA3\u4F20\u90E8\u90E8\u957F\uFF0C\u7EC4\u7EC7\u8FC7\u591A\u6B21\u6821\u56ED\u6D3B\u52A8..."
        },
        certificates: [
          {
            cert_type: "computer",
            cert_name: "\u8BA1\u7B97\u673A\u4E8C\u7EA7\u8BC1\u4E66",
            cert_level: "\u4E8C\u7EA7",
            issue_date: "2021-03-15",
            expiry_date: null,
            issuing_authority: "\u6559\u80B2\u90E8\u8003\u8BD5\u4E2D\u5FC3",
            certificate_no: "NCRE20210315001",
            attachment_url: null
          }
        ]
      }
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    saveResume() {
      const backendResume = this.convertToBackendFormat();
      common_vendor.index.setStorageSync("resume", this.resume);
      common_vendor.index.setStorageSync("backend_resume", backendResume);
      common_vendor.index.showToast({
        title: "\u4FDD\u5B58\u6210\u529F",
        icon: "success"
      });
    },
    onGenderChange(e) {
      this.genderIndex = e.detail.value;
      this.resume.gender = this.genderIndex + 1;
    },
    onCompanySizeChange(e) {
      this.companySizeIndex = parseInt(e.detail.value);
      this.resume.preference.company_size = this.companySizeOptions[this.companySizeIndex];
    },
    onWorkTypeChange(e) {
      this.workTypeIndex = parseInt(e.detail.value);
      this.resume.preference.work_type = this.workTypeOptions[this.workTypeIndex];
    },
    togglePreference(preferenceKey) {
      this.resume.preference[preferenceKey] = !this.resume.preference[preferenceKey];
    },
    toggleCampusExperience(experienceKey) {
      this.resume.campus_experience[experienceKey] = !this.resume.campus_experience[experienceKey];
    },
    onCertTypeChange(e, index) {
      const certTypeIndex = parseInt(e.detail.value);
      this.resume.certificates[index].cert_type = this.certTypeOptions[certTypeIndex];
    },
    onCertDateChange(e, index, field) {
      this.resume.certificates[index][field] = e.detail.value;
    },
    getCertTypeIndex(certType) {
      return this.certTypeOptions.indexOf(certType);
    },
    addCertificate() {
      this.resume.certificates.push({
        cert_type: "professional",
        cert_name: "",
        cert_level: "",
        issue_date: "",
        expiry_date: null,
        issuing_authority: "",
        certificate_no: "",
        attachment_url: null
      });
    },
    editCertificate(index) {
      common_vendor.index.showToast({
        title: "\u7F16\u8F91\u8BC1\u4E66\u529F\u80FD\u5F00\u53D1\u4E2D",
        icon: "none"
      });
    },
    deleteCertificate(index) {
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u8BC1\u4E66\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            this.resume.certificates.splice(index, 1);
          }
        }
      });
    },
    uploadCertificateFile(index) {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: [".pdf"],
        success: (res) => {
          const file = res.tempFiles[0];
          if (file && file.name.toLowerCase().endsWith(".pdf")) {
            const mockFileUrl = `https://cert-bucket.com/${file.name}`;
            this.resume.certificates[index].attachment_url = mockFileUrl;
            common_vendor.index.showToast({
              title: "\u6587\u4EF6\u4E0A\u4F20\u6210\u529F",
              icon: "success"
            });
          } else {
            common_vendor.index.showToast({
              title: "\u8BF7\u9009\u62E9PDF\u6587\u4EF6",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "\u6587\u4EF6\u9009\u62E9\u5931\u8D25",
            icon: "none"
          });
        }
      });
    },
    getFileName(url) {
      if (!url)
        return "";
      return url.split("/").pop();
    },
    convertToBackendFormat() {
      return {
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
        self_introduction: this.resume.self_introduction,
        intention: {
          industry: this.resume.intention.industry,
          position: this.resume.intention.position,
          city: this.resume.intention.city,
          salary: this.resume.intention.salary,
          available_time: this.resume.intention.available_time
        },
        preference: {
          internship_conversion: this.resume.preference.internship_conversion,
          remote_work: this.resume.preference.remote_work,
          campus_recommendation: this.resume.preference.campus_recommendation,
          overtime: this.resume.preference.overtime,
          business_trip: this.resume.preference.business_trip,
          company_size: this.resume.preference.company_size,
          work_type: this.resume.preference.work_type
        },
        campus_experience: {
          has_student_union: this.resume.campus_experience.student_union ? 1 : 0,
          student_union_details: this.resume.campus_experience.student_union ? this.resume.campus_experience.description : null,
          has_club: this.resume.campus_experience.club ? 1 : 0,
          club_details: this.resume.campus_experience.club ? this.resume.campus_experience.description : null,
          has_scholarship: this.resume.campus_experience.scholarship ? 1 : 0,
          scholarship_details: this.resume.campus_experience.scholarship ? this.resume.campus_experience.description : null,
          has_honor: this.resume.campus_experience.honor ? 1 : 0,
          honor_details: this.resume.campus_experience.honor ? this.resume.campus_experience.description : null
        },
        certificates: this.resume.certificates.map((cert) => ({
          cert_type: cert.cert_type,
          cert_name: cert.cert_name,
          cert_level: cert.cert_level,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
          issuing_authority: cert.issuing_authority,
          certificate_no: cert.certificate_no,
          attachment_url: cert.attachment_url
        }))
      };
    }
  },
  onLoad() {
    const savedResume = common_vendor.index.getStorageSync("resume");
    if (savedResume) {
      this.resume = savedResume;
      this.genderIndex = this.resume.gender === 1 ? 0 : 1;
      this.companySizeIndex = this.companySizeOptions.indexOf(this.resume.preference.company_size) || 4;
      this.workTypeIndex = this.workTypeOptions.indexOf(this.resume.preference.work_type) || 0;
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
    T: common_vendor.o(($event) => $options.togglePreference("internship_conversion")),
    U: $data.resume.preference.remote_work,
    V: common_vendor.o((e) => $data.resume.preference.remote_work = e.detail.value),
    W: common_vendor.o(($event) => $options.togglePreference("remote_work")),
    X: $data.resume.preference.campus_recommendation,
    Y: common_vendor.o((e) => $data.resume.preference.campus_recommendation = e.detail.value),
    Z: common_vendor.o(($event) => $options.togglePreference("campus_recommendation")),
    aa: $data.resume.preference.overtime,
    ab: common_vendor.o((e) => $data.resume.preference.overtime = e.detail.value),
    ac: common_vendor.o(($event) => $options.togglePreference("overtime")),
    ad: $data.resume.preference.business_trip,
    ae: common_vendor.o((e) => $data.resume.preference.business_trip = e.detail.value),
    af: common_vendor.o(($event) => $options.togglePreference("business_trip")),
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
    aq: common_vendor.o(($event) => $options.toggleCampusExperience("student_union")),
    ar: $data.resume.campus_experience.club,
    as: common_vendor.o((e) => $data.resume.campus_experience.club = e.detail.value),
    at: common_vendor.o(($event) => $options.toggleCampusExperience("club")),
    av: $data.resume.campus_experience.scholarship,
    aw: common_vendor.o((e) => $data.resume.campus_experience.scholarship = e.detail.value),
    ax: common_vendor.o(($event) => $options.toggleCampusExperience("scholarship")),
    ay: $data.resume.campus_experience.honor,
    az: common_vendor.o((e) => $data.resume.campus_experience.honor = e.detail.value),
    aA: common_vendor.o(($event) => $options.toggleCampusExperience("honor")),
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
        r: common_vendor.o(($event) => $options.uploadCertificateFile(index)),
        s: certificate.attachment_url
      }, certificate.attachment_url ? {
        t: common_vendor.t($options.getFileName(certificate.attachment_url))
      } : {}, {
        v: common_vendor.o(($event) => $options.editCertificate(index)),
        w: common_vendor.o(($event) => $options.deleteCertificate(index)),
        x: index
      });
    }),
    aF: $data.certTypeOptions
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/resume/user_resume.vue"]]);
wx.createPage(MiniProgramPage);
