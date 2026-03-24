"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_user = require("../../../common/api/user.js");
const _sfc_main = {
  data() {
    return {
      // 从登录页面传递过来的注册数据
      registerForm: {
        mobile: "",
        sms_code: "",
        password: "",
        confirm_password: ""
      },
      // 用户基本信息表单
      basicInfoForm: {
        real_name: "",
        gender: 0,
        birth_date: "",
        city: "",
        email: ""
      },
      // 教育背景表单
      educationForm: {
        degree: "",
        school_name: "",
        major: "",
        graduation_year: ""
      },
      // 求职意向表单
      jobIntentForm: {
        job_direction: "",
        expected_city: "",
        expected_salary_min: "",
        expected_salary_max: "",
        available_time: ""
      },
      // 注册步骤
      registerStep: 2,
      loading: false,
      // ========== 城市选择器数据 ==========
      provinces: ["北京", "上海", "广东", "浙江", "江苏", "四川", "湖北", "陕西", "重庆", "湖南", "河南", "山东", "安徽", "福建", "河北"],
      cities: {
        "北京": ["北京市"],
        "上海": ["上海市"],
        "广东": ["广州", "深圳", "佛山", "东莞", "珠海", "中山", "惠州", "江门", "汕头", "湛江"],
        "浙江": ["杭州", "宁波", "温州", "嘉兴", "绍兴", "金华", "台州", "湖州", "衢州", "丽水"],
        "江苏": ["南京", "苏州", "无锡", "常州", "徐州", "南通", "扬州", "盐城", "淮安", "连云港"],
        "四川": ["成都", "绵阳", "德阳", "乐山", "宜宾", "南充", "泸州", "达州", "眉山", "遂宁"],
        "湖北": ["武汉", "宜昌", "襄阳", "荆州", "黄石", "十堰", "孝感", "荆门", "鄂州", "黄冈"],
        "陕西": ["西安", "宝鸡", "咸阳", "渭南", "汉中", "榆林", "延安", "安康", "商洛", "铜川"],
        "重庆": ["重庆市"],
        "湖南": ["长沙", "株洲", "湘潭", "衡阳", "岳阳", "常德", "邵阳", "郴州", "永州", "怀化"],
        "河南": ["郑州", "洛阳", "开封", "新乡", "许昌", "平顶山", "焦作", "商丘", "安阳", "南阳"],
        "山东": ["济南", "青岛", "烟台", "潍坊", "临沂", "淄博", "威海", "东营", "日照", "德州"],
        "安徽": ["合肥", "芜湖", "蚌埠", "淮南", "马鞍山", "淮北", "铜陵", "安庆", "黄山", "滁州"],
        "福建": ["福州", "厦门", "泉州", "莆田", "漳州", "龙岩", "三明", "南平", "宁德", "武夷山"],
        "河北": ["石家庄", "唐山", "秦皇岛", "邯郸", "邢台", "保定", "张家口", "承德", "沧州", "廊坊"]
      },
      districts: {
        "北京市": ["朝阳区", "海淀区", "东城区", "西城区", "丰台区", "石景山区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云区", "延庆区"],
        "上海市": ["浦东新区", "黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "金山区", "松江区", "青浦区", "奉贤区", "崇明区"],
        "广州": ["天河区", "越秀区", "海珠区", "白云区", "番禺区", "荔湾区", "黄埔区", "花都区", "南沙区", "从化区", "增城区"],
        "深圳": ["福田区", "罗湖区", "南山区", "宝安区", "龙岗区", "盐田区", "龙华区", "坪山区", "光明区"],
        "杭州": ["西湖区", "上城区", "下城区", "江干区", "拱墅区", "滨江区", "萧山区", "余杭区", "富阳区", "临安区", "桐庐县", "淳安县", "建德市"],
        "南京": ["鼓楼区", "玄武区", "秦淮区", "建邺区", "雨花台区", "浦口区", "栖霞区", "江宁区", "六合区", "溧水区", "高淳区"],
        "成都": ["锦江区", "青羊区", "金牛区", "武侯区", "成华区", "龙泉驿区", "青白江区", "新都区", "温江区", "双流区", "郫都区", "新津区", "都江堰市", "彭州市", "邛崃市", "崇州市", "简阳市"],
        "武汉": ["江岸区", "江汉区", "硚口区", "汉阳区", "武昌区", "青山区", "洪山区", "东西湖区", "汉南区", "蔡甸区", "江夏区", "黄陂区", "新洲区"],
        "西安": ["新城区", "碑林区", "莲湖区", "雁塔区", "未央区", "灞桥区", "长安区", "阎良区", "临潼区", "高陵区", "鄠邑区", "蓝田县", "周至县"],
        "重庆市": ["渝中区", "江北区", "南岸区", "九龙坡区", "沙坪坝区", "大渡口区", "北碚区", "渝北区", "巴南区", "涪陵区", "万州区", "黔江区", "长寿区", "江津区", "合川区", "永川区", "南川区", "綦江区", "大足区", "璧山区", "铜梁区", "潼南区", "荣昌区", "开州区", "梁平区", "武隆区"],
        "长沙": ["芙蓉区", "天心区", "岳麓区", "开福区", "雨花区", "望城区", "长沙县", "浏阳市", "宁乡市"],
        "郑州": ["中原区", "二七区", "管城回族区", "金水区", "上街区", "惠济区", "中牟县", "巩义市", "荥阳市", "新密市", "新郑市", "登封市"],
        "济南": ["历下区", "市中区", "槐荫区", "天桥区", "历城区", "长清区", "章丘区", "济阳区", "莱芜区", "钢城区", "平阴县", "商河县"],
        "合肥": ["瑶海区", "庐阳区", "蜀山区", "包河区", "长丰县", "肥东县", "肥西县", "庐江县", "巢湖市"],
        "福州": ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "长乐区", "闽侯县", "连江县", "罗源县", "闽清县", "永泰县", "平潭县", "福清市"],
        "石家庄": ["长安区", "桥西区", "新华区", "井陉矿区", "裕华区", "藁城区", "鹿泉区", "栾城区", "井陉县", "正定县", "行唐县", "灵寿县", "高邑县", "深泽县", "赞皇县", "无极县", "平山县", "元氏县", "赵县", "晋州市", "新乐市"]
      },
      // 城市选择器索引 [省, 市, 区]
      cityIndex: [0, 0, 0],
      expectedCityIndex: [0, 0, 0],
      // ========== 学历选择器数据 ==========
      degreeOptions: [
        { value: "high_school", text: "高中" },
        { value: "college", text: "专科" },
        { value: "bachelor", text: "本科" },
        { value: "master", text: "硕士" },
        { value: "doctor", text: "博士" }
      ],
      degreeIndex: 2,
      // 默认本科
      // ========== 毕业年份数据 ==========
      graduationYears: [],
      yearIndex: 5,
      // 默认当前年份
      // ========== 到岗时间选项 ==========
      availableTimeOptions: ["立即到岗", "一周内到岗", "两周内到岗", "一个月内到岗", "两个月内到岗", "三个月内到岗", "待定"],
      timeIndex: 0
    };
  },
  computed: {
    // 所在城市选择器范围
    cityRange() {
      const province = this.provinces[this.cityIndex[0]] || this.provinces[0];
      const cityList = this.cities[province] || ["其他"];
      const city = cityList[this.cityIndex[1]] || cityList[0];
      const districtList = this.districts[city] || ["其他"];
      return [this.provinces, cityList, districtList];
    },
    // 期望城市选择器范围（独立的计算属性）
    expectedCityRange() {
      const province = this.provinces[this.expectedCityIndex[0]] || this.provinces[0];
      const cityList = this.cities[province] || ["其他"];
      const city = cityList[this.expectedCityIndex[1]] || cityList[0];
      const districtList = this.districts[city] || ["其他"];
      return [this.provinces, cityList, districtList];
    },
    // 学历文本显示
    degreeText() {
      const item = this.degreeOptions[this.degreeIndex];
      return item ? item.text : "";
    },
    // 基本信息表单验证
    isBasicInfoFormValid() {
      const { real_name, birth_date, city, email } = this.basicInfoForm;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const realNameValid = real_name.trim().length > 0;
      const birthDateValid = birth_date.trim().length > 0;
      const cityValid = city.trim().length > 0;
      const emailValid = email.trim() === "" || emailRegex.test(email);
      return realNameValid && birthDateValid && cityValid && emailValid;
    },
    // 教育背景表单验证
    isEducationFormValid() {
      const { degree, school_name, major, graduation_year } = this.educationForm;
      const degreeValid = degree.trim().length > 0;
      const schoolNameValid = school_name.trim().length > 0;
      const majorValid = major.trim().length > 0;
      const graduationYearValid = graduation_year.trim().length === 4 && !isNaN(graduation_year);
      return degreeValid && schoolNameValid && majorValid && graduationYearValid;
    },
    // 求职意向表单验证
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
        common_vendor.index.__f__("log", "at pages/login/register/login_reister.vue:498", "接收到的注册数据:", this.registerForm);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/login/register/login_reister.vue:500", "解析注册数据失败:", e);
      }
    }
    this.initYearData();
  },
  methods: {
    initYearData() {
      this.graduationYears = [];
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        this.graduationYears.push(i + "年");
      }
      this.yearIndex = 5;
    },
    // ========== 出生日期选择 ==========
    onBirthDateChange(e) {
      this.basicInfoForm.birth_date = e.detail.value;
    },
    // ========== 所在城市选择器方法 ==========
    onCityChange(e) {
      const value = e.detail.value;
      const province = this.provinces[value[0]];
      const cityList = this.cities[province] || ["其他"];
      const city = cityList[value[1]];
      const districtList = this.districts[city] || ["其他"];
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
    // ========== 期望城市选择器方法 ==========
    onExpectedCityChange(e) {
      const value = e.detail.value;
      const province = this.provinces[value[0]];
      const cityList = this.cities[province] || ["其他"];
      const city = cityList[value[1]];
      const districtList = this.districts[city] || ["其他"];
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
    // ========== 学历选择 ==========
    onDegreeChange(e) {
      this.degreeIndex = e.detail.value;
      this.educationForm.degree = this.degreeOptions[this.degreeIndex].value;
    },
    // ========== 毕业年份选择 ==========
    onYearChange(e) {
      this.yearIndex = e.detail.value;
      const yearStr = this.graduationYears[this.yearIndex];
      this.educationForm.graduation_year = yearStr.replace("年", "");
    },
    // ========== 到岗时间选择 ==========
    onTimeChange(e) {
      this.timeIndex = e.detail.value;
      this.jobIntentForm.available_time = this.availableTimeOptions[this.timeIndex];
    },
    // ========== 步骤控制方法 ==========
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
    // ========== 完成注册 ==========
    async completeRegister() {
      this.loading = true;
      try {
        const registerData = {
          mobile: this.registerForm.mobile,
          sms_code: this.registerForm.sms_code,
          password: this.registerForm.password,
          // 基本信息
          real_name: this.basicInfoForm.real_name.trim(),
          gender: this.basicInfoForm.gender,
          birth_date: this.basicInfoForm.birth_date,
          city: this.basicInfoForm.city,
          email: this.basicInfoForm.email.trim() || void 0,
          // 教育背景
          education_level: this.educationForm.degree,
          school_name: this.educationForm.school_name.trim(),
          major: this.educationForm.major.trim(),
          graduation_year: this.educationForm.graduation_year
        };
        common_vendor.index.__f__("log", "at pages/login/register/login_reister.vue:634", "发送注册数据:", registerData);
        const res = await common_api_user.userApi.register(registerData);
        common_vendor.index.__f__("log", "at pages/login/register/login_reister.vue:638", "注册响应:", res);
        if (res && res.user_id) {
          common_vendor.index.__f__("log", "at pages/login/register/login_reister.vue:642", "注册成功，开始自动登录");
          const loginRes = await common_api_user.userApi.login({
            mobile: this.registerForm.mobile,
            password: this.registerForm.password
          });
          common_vendor.index.__f__("log", "at pages/login/register/login_reister.vue:649", "登录响应:", loginRes);
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
              title: "注册成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/index/index_index"
              });
            }, 1500);
          } else {
            throw new Error("自动登录失败");
          }
        } else {
          throw new Error("注册失败：未返回用户ID");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/register/login_reister.vue:685", "注册失败:", error);
        common_vendor.index.showToast({
          title: error.message || "注册失败，请稍后重试",
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
    f: common_vendor.t($data.registerStep === 2 ? "完善个人信息" : $data.registerStep === 3 ? "教育经历" : "求职意向"),
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
    Z: $data.educationForm.graduation_year ? $data.educationForm.graduation_year + "年" : "",
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f0d703cf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/login/register/login_reister.js.map
