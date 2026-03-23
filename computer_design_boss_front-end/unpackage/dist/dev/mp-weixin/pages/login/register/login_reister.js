"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_user = require("../../../common/api/user.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      registerForm: {
        mobile: "",
        sms_code: "",
        password: "",
        confirm_password: ""
      },
      basicInfoForm: {
        real_name: "",
        gender: 0,
        birth_date: "",
        city: "",
        email: ""
      },
      educationForm: {
        degree: "",
        school_name: "",
        major: "",
        graduation_year: ""
      },
      jobIntentForm: {
        job_direction: "",
        expected_city: "",
        expected_salary_min: "",
        expected_salary_max: "",
        available_time: ""
      },
      registerStep: 2,
      loading: false,
      provinces: ["\u5317\u4EAC", "\u4E0A\u6D77", "\u5E7F\u4E1C", "\u6D59\u6C5F", "\u6C5F\u82CF", "\u56DB\u5DDD", "\u6E56\u5317", "\u9655\u897F", "\u91CD\u5E86", "\u6E56\u5357", "\u6CB3\u5357", "\u5C71\u4E1C", "\u5B89\u5FBD", "\u798F\u5EFA", "\u6CB3\u5317"],
      cities: {
        "\u5317\u4EAC": ["\u5317\u4EAC\u5E02"],
        "\u4E0A\u6D77": ["\u4E0A\u6D77\u5E02"],
        "\u5E7F\u4E1C": ["\u5E7F\u5DDE", "\u6DF1\u5733", "\u4F5B\u5C71", "\u4E1C\u839E", "\u73E0\u6D77", "\u4E2D\u5C71", "\u60E0\u5DDE", "\u6C5F\u95E8", "\u6C55\u5934", "\u6E5B\u6C5F"],
        "\u6D59\u6C5F": ["\u676D\u5DDE", "\u5B81\u6CE2", "\u6E29\u5DDE", "\u5609\u5174", "\u7ECD\u5174", "\u91D1\u534E", "\u53F0\u5DDE", "\u6E56\u5DDE", "\u8862\u5DDE", "\u4E3D\u6C34"],
        "\u6C5F\u82CF": ["\u5357\u4EAC", "\u82CF\u5DDE", "\u65E0\u9521", "\u5E38\u5DDE", "\u5F90\u5DDE", "\u5357\u901A", "\u626C\u5DDE", "\u76D0\u57CE", "\u6DEE\u5B89", "\u8FDE\u4E91\u6E2F"],
        "\u56DB\u5DDD": ["\u6210\u90FD", "\u7EF5\u9633", "\u5FB7\u9633", "\u4E50\u5C71", "\u5B9C\u5BBE", "\u5357\u5145", "\u6CF8\u5DDE", "\u8FBE\u5DDE", "\u7709\u5C71", "\u9042\u5B81"],
        "\u6E56\u5317": ["\u6B66\u6C49", "\u5B9C\u660C", "\u8944\u9633", "\u8346\u5DDE", "\u9EC4\u77F3", "\u5341\u5830", "\u5B5D\u611F", "\u8346\u95E8", "\u9102\u5DDE", "\u9EC4\u5188"],
        "\u9655\u897F": ["\u897F\u5B89", "\u5B9D\u9E21", "\u54B8\u9633", "\u6E2D\u5357", "\u6C49\u4E2D", "\u6986\u6797", "\u5EF6\u5B89", "\u5B89\u5EB7", "\u5546\u6D1B", "\u94DC\u5DDD"],
        "\u91CD\u5E86": ["\u91CD\u5E86\u5E02"],
        "\u6E56\u5357": ["\u957F\u6C99", "\u682A\u6D32", "\u6E58\u6F6D", "\u8861\u9633", "\u5CB3\u9633", "\u5E38\u5FB7", "\u90B5\u9633", "\u90F4\u5DDE", "\u6C38\u5DDE", "\u6000\u5316"],
        "\u6CB3\u5357": ["\u90D1\u5DDE", "\u6D1B\u9633", "\u5F00\u5C01", "\u65B0\u4E61", "\u8BB8\u660C", "\u5E73\u9876\u5C71", "\u7126\u4F5C", "\u5546\u4E18", "\u5B89\u9633", "\u5357\u9633"],
        "\u5C71\u4E1C": ["\u6D4E\u5357", "\u9752\u5C9B", "\u70DF\u53F0", "\u6F4D\u574A", "\u4E34\u6C82", "\u6DC4\u535A", "\u5A01\u6D77", "\u4E1C\u8425", "\u65E5\u7167", "\u5FB7\u5DDE"],
        "\u5B89\u5FBD": ["\u5408\u80A5", "\u829C\u6E56", "\u868C\u57E0", "\u6DEE\u5357", "\u9A6C\u978D\u5C71", "\u6DEE\u5317", "\u94DC\u9675", "\u5B89\u5E86", "\u9EC4\u5C71", "\u6EC1\u5DDE"],
        "\u798F\u5EFA": ["\u798F\u5DDE", "\u53A6\u95E8", "\u6CC9\u5DDE", "\u8386\u7530", "\u6F33\u5DDE", "\u9F99\u5CA9", "\u4E09\u660E", "\u5357\u5E73", "\u5B81\u5FB7", "\u6B66\u5937\u5C71"],
        "\u6CB3\u5317": ["\u77F3\u5BB6\u5E84", "\u5510\u5C71", "\u79E6\u7687\u5C9B", "\u90AF\u90F8", "\u90A2\u53F0", "\u4FDD\u5B9A", "\u5F20\u5BB6\u53E3", "\u627F\u5FB7", "\u6CA7\u5DDE", "\u5ECA\u574A"]
      },
      districts: {
        "\u5317\u4EAC\u5E02": ["\u671D\u9633\u533A", "\u6D77\u6DC0\u533A", "\u4E1C\u57CE\u533A", "\u897F\u57CE\u533A", "\u4E30\u53F0\u533A", "\u77F3\u666F\u5C71\u533A", "\u95E8\u5934\u6C9F\u533A", "\u623F\u5C71\u533A", "\u901A\u5DDE\u533A", "\u987A\u4E49\u533A", "\u660C\u5E73\u533A", "\u5927\u5174\u533A", "\u6000\u67D4\u533A", "\u5E73\u8C37\u533A", "\u5BC6\u4E91\u533A", "\u5EF6\u5E86\u533A"],
        "\u4E0A\u6D77\u5E02": ["\u6D66\u4E1C\u65B0\u533A", "\u9EC4\u6D66\u533A", "\u5F90\u6C47\u533A", "\u957F\u5B81\u533A", "\u9759\u5B89\u533A", "\u666E\u9640\u533A", "\u8679\u53E3\u533A", "\u6768\u6D66\u533A", "\u95F5\u884C\u533A", "\u5B9D\u5C71\u533A", "\u5609\u5B9A\u533A", "\u91D1\u5C71\u533A", "\u677E\u6C5F\u533A", "\u9752\u6D66\u533A", "\u5949\u8D24\u533A", "\u5D07\u660E\u533A"],
        "\u5E7F\u5DDE": ["\u5929\u6CB3\u533A", "\u8D8A\u79C0\u533A", "\u6D77\u73E0\u533A", "\u767D\u4E91\u533A", "\u756A\u79BA\u533A", "\u8354\u6E7E\u533A", "\u9EC4\u57D4\u533A", "\u82B1\u90FD\u533A", "\u5357\u6C99\u533A", "\u4ECE\u5316\u533A", "\u589E\u57CE\u533A"],
        "\u6DF1\u5733": ["\u798F\u7530\u533A", "\u7F57\u6E56\u533A", "\u5357\u5C71\u533A", "\u5B9D\u5B89\u533A", "\u9F99\u5C97\u533A", "\u76D0\u7530\u533A", "\u9F99\u534E\u533A", "\u576A\u5C71\u533A", "\u5149\u660E\u533A"],
        "\u676D\u5DDE": ["\u897F\u6E56\u533A", "\u4E0A\u57CE\u533A", "\u4E0B\u57CE\u533A", "\u6C5F\u5E72\u533A", "\u62F1\u5885\u533A", "\u6EE8\u6C5F\u533A", "\u8427\u5C71\u533A", "\u4F59\u676D\u533A", "\u5BCC\u9633\u533A", "\u4E34\u5B89\u533A", "\u6850\u5E90\u53BF", "\u6DF3\u5B89\u53BF", "\u5EFA\u5FB7\u5E02"],
        "\u5357\u4EAC": ["\u9F13\u697C\u533A", "\u7384\u6B66\u533A", "\u79E6\u6DEE\u533A", "\u5EFA\u90BA\u533A", "\u96E8\u82B1\u53F0\u533A", "\u6D66\u53E3\u533A", "\u6816\u971E\u533A", "\u6C5F\u5B81\u533A", "\u516D\u5408\u533A", "\u6EA7\u6C34\u533A", "\u9AD8\u6DF3\u533A"],
        "\u6210\u90FD": ["\u9526\u6C5F\u533A", "\u9752\u7F8A\u533A", "\u91D1\u725B\u533A", "\u6B66\u4FAF\u533A", "\u6210\u534E\u533A", "\u9F99\u6CC9\u9A7F\u533A", "\u9752\u767D\u6C5F\u533A", "\u65B0\u90FD\u533A", "\u6E29\u6C5F\u533A", "\u53CC\u6D41\u533A", "\u90EB\u90FD\u533A", "\u65B0\u6D25\u533A", "\u90FD\u6C5F\u5830\u5E02", "\u5F6D\u5DDE\u5E02", "\u909B\u5D03\u5E02", "\u5D07\u5DDE\u5E02", "\u7B80\u9633\u5E02"],
        "\u6B66\u6C49": ["\u6C5F\u5CB8\u533A", "\u6C5F\u6C49\u533A", "\u785A\u53E3\u533A", "\u6C49\u9633\u533A", "\u6B66\u660C\u533A", "\u9752\u5C71\u533A", "\u6D2A\u5C71\u533A", "\u4E1C\u897F\u6E56\u533A", "\u6C49\u5357\u533A", "\u8521\u7538\u533A", "\u6C5F\u590F\u533A", "\u9EC4\u9642\u533A", "\u65B0\u6D32\u533A"],
        "\u897F\u5B89": ["\u65B0\u57CE\u533A", "\u7891\u6797\u533A", "\u83B2\u6E56\u533A", "\u96C1\u5854\u533A", "\u672A\u592E\u533A", "\u705E\u6865\u533A", "\u957F\u5B89\u533A", "\u960E\u826F\u533A", "\u4E34\u6F7C\u533A", "\u9AD8\u9675\u533A", "\u9120\u9091\u533A", "\u84DD\u7530\u53BF", "\u5468\u81F3\u53BF"],
        "\u91CD\u5E86\u5E02": ["\u6E1D\u4E2D\u533A", "\u6C5F\u5317\u533A", "\u5357\u5CB8\u533A", "\u4E5D\u9F99\u5761\u533A", "\u6C99\u576A\u575D\u533A", "\u5927\u6E21\u53E3\u533A", "\u5317\u789A\u533A", "\u6E1D\u5317\u533A", "\u5DF4\u5357\u533A", "\u6DAA\u9675\u533A", "\u4E07\u5DDE\u533A", "\u9ED4\u6C5F\u533A", "\u957F\u5BFF\u533A", "\u6C5F\u6D25\u533A", "\u5408\u5DDD\u533A", "\u6C38\u5DDD\u533A", "\u5357\u5DDD\u533A", "\u7DA6\u6C5F\u533A", "\u5927\u8DB3\u533A", "\u74A7\u5C71\u533A", "\u94DC\u6881\u533A", "\u6F7C\u5357\u533A", "\u8363\u660C\u533A", "\u5F00\u5DDE\u533A", "\u6881\u5E73\u533A", "\u6B66\u9686\u533A"],
        "\u957F\u6C99": ["\u8299\u84C9\u533A", "\u5929\u5FC3\u533A", "\u5CB3\u9E93\u533A", "\u5F00\u798F\u533A", "\u96E8\u82B1\u533A", "\u671B\u57CE\u533A", "\u957F\u6C99\u53BF", "\u6D4F\u9633\u5E02", "\u5B81\u4E61\u5E02"],
        "\u90D1\u5DDE": ["\u4E2D\u539F\u533A", "\u4E8C\u4E03\u533A", "\u7BA1\u57CE\u56DE\u65CF\u533A", "\u91D1\u6C34\u533A", "\u4E0A\u8857\u533A", "\u60E0\u6D4E\u533A", "\u4E2D\u725F\u53BF", "\u5DE9\u4E49\u5E02", "\u8365\u9633\u5E02", "\u65B0\u5BC6\u5E02", "\u65B0\u90D1\u5E02", "\u767B\u5C01\u5E02"],
        "\u6D4E\u5357": ["\u5386\u4E0B\u533A", "\u5E02\u4E2D\u533A", "\u69D0\u836B\u533A", "\u5929\u6865\u533A", "\u5386\u57CE\u533A", "\u957F\u6E05\u533A", "\u7AE0\u4E18\u533A", "\u6D4E\u9633\u533A", "\u83B1\u829C\u533A", "\u94A2\u57CE\u533A", "\u5E73\u9634\u53BF", "\u5546\u6CB3\u53BF"],
        "\u5408\u80A5": ["\u7476\u6D77\u533A", "\u5E90\u9633\u533A", "\u8700\u5C71\u533A", "\u5305\u6CB3\u533A", "\u957F\u4E30\u53BF", "\u80A5\u4E1C\u53BF", "\u80A5\u897F\u53BF", "\u5E90\u6C5F\u53BF", "\u5DE2\u6E56\u5E02"],
        "\u798F\u5DDE": ["\u9F13\u697C\u533A", "\u53F0\u6C5F\u533A", "\u4ED3\u5C71\u533A", "\u9A6C\u5C3E\u533A", "\u664B\u5B89\u533A", "\u957F\u4E50\u533A", "\u95FD\u4FAF\u53BF", "\u8FDE\u6C5F\u53BF", "\u7F57\u6E90\u53BF", "\u95FD\u6E05\u53BF", "\u6C38\u6CF0\u53BF", "\u5E73\u6F6D\u53BF", "\u798F\u6E05\u5E02"],
        "\u77F3\u5BB6\u5E84": ["\u957F\u5B89\u533A", "\u6865\u897F\u533A", "\u65B0\u534E\u533A", "\u4E95\u9649\u77FF\u533A", "\u88D5\u534E\u533A", "\u85C1\u57CE\u533A", "\u9E7F\u6CC9\u533A", "\u683E\u57CE\u533A", "\u4E95\u9649\u53BF", "\u6B63\u5B9A\u53BF", "\u884C\u5510\u53BF", "\u7075\u5BFF\u53BF", "\u9AD8\u9091\u53BF", "\u6DF1\u6CFD\u53BF", "\u8D5E\u7687\u53BF", "\u65E0\u6781\u53BF", "\u5E73\u5C71\u53BF", "\u5143\u6C0F\u53BF", "\u8D75\u53BF", "\u664B\u5DDE\u5E02", "\u65B0\u4E50\u5E02"]
      },
      cityIndex: [0, 0, 0],
      expectedCityIndex: [0, 0, 0],
      degreeOptions: [
        { value: "high_school", text: "\u9AD8\u4E2D" },
        { value: "college", text: "\u4E13\u79D1" },
        { value: "bachelor", text: "\u672C\u79D1" },
        { value: "master", text: "\u7855\u58EB" },
        { value: "doctor", text: "\u535A\u58EB" }
      ],
      degreeIndex: 2,
      graduationYears: [],
      yearIndex: 5,
      availableTimeOptions: ["\u7ACB\u5373\u5230\u5C97", "\u4E00\u5468\u5185\u5230\u5C97", "\u4E24\u5468\u5185\u5230\u5C97", "\u4E00\u4E2A\u6708\u5185\u5230\u5C97", "\u4E24\u4E2A\u6708\u5185\u5230\u5C97", "\u4E09\u4E2A\u6708\u5185\u5230\u5C97", "\u5F85\u5B9A"],
      timeIndex: 0
    };
  },
  computed: {
    cityRange() {
      const province = this.provinces[this.cityIndex[0]] || this.provinces[0];
      const cityList = this.cities[province] || ["\u5176\u4ED6"];
      const city = cityList[this.cityIndex[1]] || cityList[0];
      const districtList = this.districts[city] || ["\u5176\u4ED6"];
      return [this.provinces, cityList, districtList];
    },
    expectedCityRange() {
      const province = this.provinces[this.expectedCityIndex[0]] || this.provinces[0];
      const cityList = this.cities[province] || ["\u5176\u4ED6"];
      const city = cityList[this.expectedCityIndex[1]] || cityList[0];
      const districtList = this.districts[city] || ["\u5176\u4ED6"];
      return [this.provinces, cityList, districtList];
    },
    degreeText() {
      const item = this.degreeOptions[this.degreeIndex];
      return item ? item.text : "";
    },
    isBasicInfoFormValid() {
      const { real_name, birth_date, city, email } = this.basicInfoForm;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const realNameValid = real_name.trim().length > 0;
      const birthDateValid = birth_date.trim().length > 0;
      const cityValid = city.trim().length > 0;
      const emailValid = email.trim() === "" || emailRegex.test(email);
      return realNameValid && birthDateValid && cityValid && emailValid;
    },
    isEducationFormValid() {
      const { degree, school_name, major, graduation_year } = this.educationForm;
      const degreeValid = degree.trim().length > 0;
      const schoolNameValid = school_name.trim().length > 0;
      const majorValid = major.trim().length > 0;
      const graduationYearValid = graduation_year.trim().length === 4 && !isNaN(graduation_year);
      return degreeValid && schoolNameValid && majorValid && graduationYearValid;
    },
    isJobIntentFormValid() {
      const { expected_salary_min, expected_salary_max } = this.jobIntentForm;
      if (expected_salary_min && isNaN(expected_salary_min))
        return false;
      if (expected_salary_max && isNaN(expected_salary_max))
        return false;
      return true;
    }
  },
  onLoad(options) {
    if (options.registerData) {
      try {
        this.registerForm = JSON.parse(decodeURIComponent(options.registerData));
        console.log("\u63A5\u6536\u5230\u7684\u6CE8\u518C\u6570\u636E:", this.registerForm);
      } catch (e) {
        console.error("\u89E3\u6790\u6CE8\u518C\u6570\u636E\u5931\u8D25:", e);
      }
    }
    this.initYearData();
  },
  methods: {
    initYearData() {
      this.graduationYears = [];
      const currentYear = new Date().getFullYear();
      for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        this.graduationYears.push(i + "\u5E74");
      }
      this.yearIndex = 5;
    },
    onBirthDateChange(e) {
      this.basicInfoForm.birth_date = e.detail.value;
    },
    onCityChange(e) {
      const value = e.detail.value;
      const province = this.provinces[value[0]];
      const cityList = this.cities[province] || ["\u5176\u4ED6"];
      const city = cityList[value[1]];
      const districtList = this.districts[city] || ["\u5176\u4ED6"];
      const district = districtList[value[2]];
      this.basicInfoForm.city = `${province} ${city} ${district}`;
      this.cityIndex = value;
    },
    onCityColumnChange(e) {
      const { column, value } = e.detail;
      if (column === 0) {
        this.cityIndex = [value, 0, 0];
      } else if (column === 1) {
        this.cityIndex = [this.cityIndex[0], value, 0];
      } else {
        this.cityIndex = [this.cityIndex[0], this.cityIndex[1], value];
      }
    },
    onExpectedCityChange(e) {
      const value = e.detail.value;
      const province = this.provinces[value[0]];
      const cityList = this.cities[province] || ["\u5176\u4ED6"];
      const city = cityList[value[1]];
      const districtList = this.districts[city] || ["\u5176\u4ED6"];
      const district = districtList[value[2]];
      this.jobIntentForm.expected_city = `${province} ${city} ${district}`;
      this.expectedCityIndex = value;
    },
    onExpectedCityColumnChange(e) {
      const { column, value } = e.detail;
      if (column === 0) {
        this.expectedCityIndex = [value, 0, 0];
      } else if (column === 1) {
        this.expectedCityIndex = [this.expectedCityIndex[0], value, 0];
      } else {
        this.expectedCityIndex = [this.expectedCityIndex[0], this.expectedCityIndex[1], value];
      }
    },
    onDegreeChange(e) {
      this.degreeIndex = e.detail.value;
      this.educationForm.degree = this.degreeOptions[this.degreeIndex].value;
    },
    onYearChange(e) {
      this.yearIndex = e.detail.value;
      const yearStr = this.graduationYears[this.yearIndex];
      this.educationForm.graduation_year = yearStr.replace("\u5E74", "");
    },
    onTimeChange(e) {
      this.timeIndex = e.detail.value;
      this.jobIntentForm.available_time = this.availableTimeOptions[this.timeIndex];
    },
    nextRegisterStep() {
      if (this.registerStep === 2 && this.isBasicInfoFormValid) {
        this.registerStep = 3;
      } else if (this.registerStep === 3 && this.isEducationFormValid) {
        this.registerStep = 4;
      }
    },
    prevRegisterStep() {
      if (this.registerStep > 2) {
        this.registerStep--;
      } else {
        common_vendor.index.navigateBack();
      }
    },
    async completeRegister() {
      this.loading = true;
      try {
        const registerData = {
          mobile: this.registerForm.mobile,
          sms_code: this.registerForm.sms_code,
          password: this.registerForm.password,
          real_name: this.basicInfoForm.real_name.trim(),
          gender: this.basicInfoForm.gender,
          birth_date: this.basicInfoForm.birth_date,
          city: this.basicInfoForm.city,
          email: this.basicInfoForm.email.trim() || void 0,
          education_level: this.educationForm.degree,
          school_name: this.educationForm.school_name.trim(),
          major: this.educationForm.major.trim(),
          graduation_year: this.educationForm.graduation_year
        };
        console.log("\u53D1\u9001\u6CE8\u518C\u6570\u636E:", registerData);
        const res = await common_api_user.userApi.register(registerData);
        console.log("\u6CE8\u518C\u54CD\u5E94:", res);
        if (res && res.user_id) {
          console.log("\u6CE8\u518C\u6210\u529F\uFF0C\u5F00\u59CB\u81EA\u52A8\u767B\u5F55");
          const loginRes = await common_api_user.userApi.login({
            mobile: this.registerForm.mobile,
            password: this.registerForm.password
          });
          console.log("\u767B\u5F55\u54CD\u5E94:", loginRes);
          if (loginRes && loginRes.token) {
            common_vendor.index.setStorageSync("token", loginRes.token);
            common_vendor.index.setStorageSync("userInfo", JSON.stringify(loginRes.user_info));
            if (this.registerStep === 4 && this.jobIntentForm.expected_city) {
              const resumeInfo = {
                job_direction: this.jobIntentForm.job_direction,
                expected_city: this.jobIntentForm.expected_city,
                expected_salary_min: this.jobIntentForm.expected_salary_min,
                expected_salary_max: this.jobIntentForm.expected_salary_max,
                available_time: this.jobIntentForm.available_time
              };
              common_vendor.index.setStorageSync("resumeInfo", JSON.stringify(resumeInfo));
            }
            common_vendor.index.showToast({
              title: "\u6CE8\u518C\u6210\u529F",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/index/index_index"
              });
            }, 1500);
          } else {
            throw new Error("\u81EA\u52A8\u767B\u5F55\u5931\u8D25");
          }
        } else {
          throw new Error("\u6CE8\u518C\u5931\u8D25\uFF1A\u672A\u8FD4\u56DE\u7528\u6237ID");
        }
      } catch (error) {
        console.error("\u6CE8\u518C\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: error.message || "\u6CE8\u518C\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5",
          icon: "none",
          duration: 3e3
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.prevRegisterStep),
    b: common_vendor.o(($event) => $event.target.style.color = "#007aff"),
    c: common_vendor.o(($event) => $event.target.style.color = "#1E1E1E"),
    d: common_vendor.o(($event) => $event.target.style.color = "#1E1E1E"),
    e: common_vendor.p({
      type: "back",
      size: "24",
      color: "#1E1E1E"
    }),
    f: common_vendor.t($data.registerStep === 2 ? "\u5B8C\u5584\u4E2A\u4EBA\u4FE1\u606F" : $data.registerStep === 3 ? "\u6559\u80B2\u7ECF\u5386" : "\u6C42\u804C\u610F\u5411"),
    g: $data.registerStep === 2
  }, $data.registerStep === 2 ? {
    h: common_vendor.p({
      type: "person",
      size: "24",
      color: "#999"
    }),
    i: $data.basicInfoForm.real_name,
    j: common_vendor.o(($event) => $data.basicInfoForm.real_name = $event.detail.value),
    k: $data.basicInfoForm.gender === 0 ? 1 : "",
    l: common_vendor.o(($event) => $data.basicInfoForm.gender = 0),
    m: $data.basicInfoForm.gender === 1 ? 1 : "",
    n: common_vendor.o(($event) => $data.basicInfoForm.gender = 1),
    o: $data.basicInfoForm.gender === 2 ? 1 : "",
    p: common_vendor.o(($event) => $data.basicInfoForm.gender = 2),
    q: common_vendor.p({
      type: "calendar",
      size: "24",
      color: "#999"
    }),
    r: $data.basicInfoForm.birth_date,
    s: common_vendor.o(($event) => $data.basicInfoForm.birth_date = $event.detail.value),
    t: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    v: $data.basicInfoForm.birth_date,
    w: common_vendor.o((...args) => $options.onBirthDateChange && $options.onBirthDateChange(...args)),
    x: common_vendor.p({
      type: "location",
      size: "24",
      color: "#999"
    }),
    y: $data.basicInfoForm.city,
    z: common_vendor.o(($event) => $data.basicInfoForm.city = $event.detail.value),
    A: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    B: $options.cityRange,
    C: $data.cityIndex,
    D: common_vendor.o((...args) => $options.onCityChange && $options.onCityChange(...args)),
    E: common_vendor.o((...args) => $options.onCityColumnChange && $options.onCityColumnChange(...args)),
    F: common_vendor.p({
      type: "email",
      size: "24",
      color: "#999"
    }),
    G: $data.basicInfoForm.email,
    H: common_vendor.o(($event) => $data.basicInfoForm.email = $event.detail.value),
    I: common_vendor.o((...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args)),
    J: !$options.isBasicInfoFormValid,
    K: common_vendor.o((...args) => $options.nextRegisterStep && $options.nextRegisterStep(...args))
  } : {}, {
    L: $data.registerStep === 3
  }, $data.registerStep === 3 ? {
    M: common_vendor.p({
      type: "book",
      size: "24",
      color: "#999"
    }),
    N: $options.degreeText,
    O: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    P: $data.degreeOptions,
    Q: $data.degreeIndex,
    R: common_vendor.o((...args) => $options.onDegreeChange && $options.onDegreeChange(...args)),
    S: common_vendor.p({
      type: "office",
      size: "24",
      color: "#999"
    }),
    T: $data.educationForm.school_name,
    U: common_vendor.o(($event) => $data.educationForm.school_name = $event.detail.value),
    V: common_vendor.p({
      type: "compose",
      size: "24",
      color: "#999"
    }),
    W: $data.educationForm.major,
    X: common_vendor.o(($event) => $data.educationForm.major = $event.detail.value),
    Y: common_vendor.p({
      type: "calendar",
      size: "24",
      color: "#999"
    }),
    Z: $data.educationForm.graduation_year ? $data.educationForm.graduation_year + "\u5E74" : "",
    aa: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    ab: $data.graduationYears,
    ac: $data.yearIndex,
    ad: common_vendor.o((...args) => $options.onYearChange && $options.onYearChange(...args)),
    ae: common_vendor.o((...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args)),
    af: !$options.isEducationFormValid,
    ag: common_vendor.o((...args) => $options.nextRegisterStep && $options.nextRegisterStep(...args))
  } : {}, {
    ah: $data.registerStep === 4
  }, $data.registerStep === 4 ? {
    ai: common_vendor.p({
      type: "briefcase",
      size: "24",
      color: "#999"
    }),
    aj: $data.jobIntentForm.job_direction,
    ak: common_vendor.o(($event) => $data.jobIntentForm.job_direction = $event.detail.value),
    al: common_vendor.p({
      type: "location",
      size: "24",
      color: "#999"
    }),
    am: $data.jobIntentForm.expected_city,
    an: common_vendor.o(($event) => $data.jobIntentForm.expected_city = $event.detail.value),
    ao: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    ap: $options.expectedCityRange,
    aq: $data.expectedCityIndex,
    ar: common_vendor.o((...args) => $options.onExpectedCityChange && $options.onExpectedCityChange(...args)),
    as: common_vendor.o((...args) => $options.onExpectedCityColumnChange && $options.onExpectedCityColumnChange(...args)),
    at: $data.jobIntentForm.expected_salary_min,
    av: common_vendor.o(($event) => $data.jobIntentForm.expected_salary_min = $event.detail.value),
    aw: $data.jobIntentForm.expected_salary_max,
    ax: common_vendor.o(($event) => $data.jobIntentForm.expected_salary_max = $event.detail.value),
    ay: common_vendor.p({
      type: "time",
      size: "24",
      color: "#999"
    }),
    az: $data.jobIntentForm.available_time,
    aA: common_vendor.o(($event) => $data.jobIntentForm.available_time = $event.detail.value),
    aB: common_vendor.p({
      type: "arrowright",
      size: "18",
      color: "#999"
    }),
    aC: $data.availableTimeOptions,
    aD: $data.timeIndex,
    aE: common_vendor.o((...args) => $options.onTimeChange && $options.onTimeChange(...args)),
    aF: common_vendor.o((...args) => $options.prevRegisterStep && $options.prevRegisterStep(...args)),
    aG: common_vendor.o((...args) => $options.completeRegister && $options.completeRegister(...args)),
    aH: !$options.isJobIntentFormValid,
    aI: common_vendor.o((...args) => $options.completeRegister && $options.completeRegister(...args))
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1776d0fe"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/login/register/login_reister.vue"]]);
wx.createPage(MiniProgramPage);
