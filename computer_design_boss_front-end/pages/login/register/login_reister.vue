<template>
  <view class="register-page">
    <!-- 顶部导航栏 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <uni-icons type="back" size="24" color="#1E1E1E" @click="prevRegisterStep" @touchstart="$event.target.style.color = '#007aff'" @touchend="$event.target.style.color = '#1E1E1E'" @touchcancel="$event.target.style.color = '#1E1E1E'" />
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">{{ registerStep === 2 ? '完善个人信息' : registerStep === 3 ? '教育经历' : '求职意向' }}</text>
      </view>
      <view class="nav-bar-right">
        <!-- 右侧预留空间 -->
      </view>
    </view>
    
    <view class="register-container">
    
    <!-- 注册表单 -->
    <view class="register-form">
      <!-- 基本信息 -->
      <view v-if="registerStep === 2" class="register-step">
        <h3 class="step-title">完善个人信息</h3>
        
        <!-- 真实姓名输入框 -->
        <view class="form-item">
          <view class="form-label">真实姓名</view>
          <view class="form-input-wrapper">
            <uni-icons type="person" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入真实姓名"
              v-model="basicInfoForm.real_name"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 性别选择 -->
        <view class="form-item">
          <view class="form-label">性别</view>
          <view class="gender-selector">
            <view 
              class="gender-item" 
              :class="{ active: basicInfoForm.gender === 0 }"
              @click="basicInfoForm.gender = 0"
            >
              <text class="gender-text">未知</text>
            </view>
            <view 
              class="gender-item" 
              :class="{ active: basicInfoForm.gender === 1 }"
              @click="basicInfoForm.gender = 1"
            >
              <text class="gender-text">男</text>
            </view>
            <view 
              class="gender-item" 
              :class="{ active: basicInfoForm.gender === 2 }"
              @click="basicInfoForm.gender = 2"
            >
              <text class="gender-text">女</text>
            </view>
          </view>
        </view>
        
        <!-- 出生日期选择 -->
        <view class="form-item">
          <view class="form-label">出生日期</view>
          <picker mode="date" :value="basicInfoForm.birth_date" start="1950-01-01" end="2010-12-31" @change="onBirthDateChange">
            <view class="form-input-wrapper picker-wrapper">
              <uni-icons type="calendar" size="24" color="#999"></uni-icons>
              <input 
                type="text" 
                placeholder="请选择出生日期"
                v-model="basicInfoForm.birth_date"
                class="form-input"
                disabled
              />
              <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
            </view>
          </picker>
        </view>
        
        <!-- 所在城市选择 -->
        <view class="form-item">
          <view class="form-label">所在城市</view>
          <picker mode="multiSelector" :range="cityRange" :value="cityIndex" @change="onCityChange" @columnchange="onCityColumnChange">
            <view class="form-input-wrapper picker-wrapper">
              <uni-icons type="location" size="24" color="#999"></uni-icons>
              <input 
                type="text" 
                placeholder="请选择所在城市"
                v-model="basicInfoForm.city"
                class="form-input"
                disabled
              />
              <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
            </view>
          </picker>
        </view>
        
        <!-- 邮箱输入框 -->
        <view class="form-item">
          <view class="form-label">邮箱（可选）</view>
          <view class="form-input-wrapper">
            <uni-icons type="email" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入邮箱"
              v-model="basicInfoForm.email"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 按钮区域 -->
        <view class="register-buttons">
          <button 
            class="back-btn"
            @click="prevRegisterStep"
          >
            上一步
          </button>
          <button 
            class="register-btn"
            :disabled="!isBasicInfoFormValid"
            @click="nextRegisterStep"
          >
            下一步
          </button>
        </view>
      </view>
      
      <!-- 教育背景 -->
      <view v-if="registerStep === 3" class="register-step">
        <h3 class="step-title">教育经历</h3>
        
        <!-- 学历选择 -->
        <view class="form-item">
          <view class="form-label">学历水平</view>
          <picker mode="selector" :range="degreeOptions" range-key="text" :value="degreeIndex" @change="onDegreeChange">
            <view class="form-input-wrapper picker-wrapper">
              <uni-icons type="book" size="24" color="#999"></uni-icons>
              <input 
                type="text" 
                placeholder="请选择学历"
                :value="degreeText"
                class="form-input"
                disabled
              />
              <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
            </view>
          </picker>
        </view>
        
        <!-- 学校名称输入框 -->
        <view class="form-item">
          <view class="form-label">学校名称</view>
          <view class="form-input-wrapper">
            <uni-icons type="office" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入学校名称"
              v-model="educationForm.school_name"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 专业输入框 -->
        <view class="form-item">
          <view class="form-label">专业</view>
          <view class="form-input-wrapper">
            <uni-icons type="compose" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入专业"
              v-model="educationForm.major"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 毕业年份选择 -->
        <view class="form-item">
          <view class="form-label">毕业年份</view>
          <picker mode="selector" :range="graduationYears" :value="yearIndex" @change="onYearChange">
            <view class="form-input-wrapper picker-wrapper">
              <uni-icons type="calendar" size="24" color="#999"></uni-icons>
              <input 
                type="text" 
                placeholder="请选择毕业年份"
                :value="educationForm.graduation_year ? educationForm.graduation_year + '年' : ''"
                class="form-input"
                disabled
              />
              <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
            </view>
          </picker>
        </view>
        
        <!-- 按钮区域 -->
        <view class="register-buttons">
          <button 
            class="back-btn"
            @click="prevRegisterStep"
          >
            上一步
          </button>
          <button 
            class="register-btn"
            :disabled="!isEducationFormValid"
            @click="nextRegisterStep"
          >
            下一步
          </button>
        </view>
      </view>
      
      <!-- 求职意向（可选） -->
      <view v-if="registerStep === 4" class="register-step optional">
        <h3 class="step-title">求职意向 <span class="optional-tag">可选</span></h3>
        
        <!-- 期望职位方向 -->
        <view class="form-item">
          <view class="form-label">期望职位方向</view>
          <view class="form-input-wrapper">
            <uni-icons type="briefcase" size="24" color="#999"></uni-icons>
            <input 
              type="text" 
              placeholder="请输入期望职位方向（如：前端/后端/数据等）"
              v-model="jobIntentForm.job_direction"
              class="form-input"
            />
          </view>
        </view>
        
        <!-- 期望工作城市 -->
        <view class="form-item">
          <view class="form-label">期望工作城市</view>
          <picker mode="multiSelector" :range="expectedCityRange" :value="expectedCityIndex" @change="onExpectedCityChange" @columnchange="onExpectedCityColumnChange">
            <view class="form-input-wrapper picker-wrapper">
              <uni-icons type="location" size="24" color="#999"></uni-icons>
              <input 
                type="text" 
                placeholder="请输入期望工作城市"
                v-model="jobIntentForm.expected_city"
                class="form-input"
                disabled
              />
              <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
            </view>
          </picker>
        </view>
        
        <!-- 期望薪资范围 -->
        <view class="form-item">
          <view class="form-label">期望薪资范围（千/月）</view>
          <view class="salary-range">
            <input 
              type="number" 
              placeholder="最低"
              v-model="jobIntentForm.expected_salary_min"
              class="form-input salary-input"
              min="0"
            />
            <span class="salary-separator">~</span>
            <input 
              type="number" 
              placeholder="最高"
              v-model="jobIntentForm.expected_salary_max"
              class="form-input salary-input"
              min="0"
            />
            <span class="salary-unit">千/月</span>
          </view>
        </view>
        
        <!-- 到岗时间 -->
        <view class="form-item">
          <view class="form-label">到岗时间</view>
          <picker mode="selector" :range="availableTimeOptions" :value="timeIndex" @change="onTimeChange">
            <view class="form-input-wrapper picker-wrapper">
              <uni-icons type="time" size="24" color="#999"></uni-icons>
              <input 
                type="text" 
                placeholder="请选择到岗时间"
                v-model="jobIntentForm.available_time"
                class="form-input"
                disabled
              />
              <uni-icons type="arrowright" size="18" color="#999"></uni-icons>
            </view>
          </picker>
        </view>
        
        <!-- 按钮区域 -->
        <view class="register-buttons">
          <button 
            class="back-btn"
            @click="prevRegisterStep"
          >
            上一步
          </button>
          <button 
            class="skip-btn"
            @click="completeRegister"
          >
            暂时跳过，稍后完善
          </button>
          <button 
            class="register-btn"
            :disabled="!isJobIntentFormValid"
            @click="completeRegister"
          >
            完成注册
          </button>
        </view>
      </view>
    </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '../../../common/api/user.js'

export default {
  data() {
    return {
      // 从登录页面传递过来的注册数据
      registerForm: {
        mobile: '',
        sms_code: '',
        password: '',
        confirm_password: ''
      },
      
      // 用户基本信息表单
      basicInfoForm: {
        real_name: '',
        gender: 0,
        birth_date: '',
        city: '',
        email: ''
      },
      
      // 教育背景表单
      educationForm: {
        degree: '',
        school_name: '',
        major: '',
        graduation_year: ''
      },
      
      // 求职意向表单
      jobIntentForm: {
        job_direction: '',
        expected_city: '',
        expected_salary_min: '',
        expected_salary_max: '',
        available_time: ''
      },
      
      // 注册步骤
      registerStep: 2,
      loading: false,
      
      // ========== 城市选择器数据 ==========
      provinces: ['北京', '上海', '广东', '浙江', '江苏', '四川', '湖北', '陕西', '重庆', '湖南', '河南', '山东', '安徽', '福建', '河北'],
      cities: {
        '北京': ['北京市'],
        '上海': ['上海市'],
        '广东': ['广州', '深圳', '佛山', '东莞', '珠海', '中山', '惠州', '江门', '汕头', '湛江'],
        '浙江': ['杭州', '宁波', '温州', '嘉兴', '绍兴', '金华', '台州', '湖州', '衢州', '丽水'],
        '江苏': ['南京', '苏州', '无锡', '常州', '徐州', '南通', '扬州', '盐城', '淮安', '连云港'],
        '四川': ['成都', '绵阳', '德阳', '乐山', '宜宾', '南充', '泸州', '达州', '眉山', '遂宁'],
        '湖北': ['武汉', '宜昌', '襄阳', '荆州', '黄石', '十堰', '孝感', '荆门', '鄂州', '黄冈'],
        '陕西': ['西安', '宝鸡', '咸阳', '渭南', '汉中', '榆林', '延安', '安康', '商洛', '铜川'],
        '重庆': ['重庆市'],
        '湖南': ['长沙', '株洲', '湘潭', '衡阳', '岳阳', '常德', '邵阳', '郴州', '永州', '怀化'],
        '河南': ['郑州', '洛阳', '开封', '新乡', '许昌', '平顶山', '焦作', '商丘', '安阳', '南阳'],
        '山东': ['济南', '青岛', '烟台', '潍坊', '临沂', '淄博', '威海', '东营', '日照', '德州'],
        '安徽': ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州'],
        '福建': ['福州', '厦门', '泉州', '莆田', '漳州', '龙岩', '三明', '南平', '宁德', '武夷山'],
        '河北': ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊']
      },
      districts: {
        '北京市': ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
        '上海市': ['浦东新区', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
        '广州': ['天河区', '越秀区', '海珠区', '白云区', '番禺区', '荔湾区', '黄埔区', '花都区', '南沙区', '从化区', '增城区'],
        '深圳': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区'],
        '杭州': ['西湖区', '上城区', '下城区', '江干区', '拱墅区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
        '南京': ['鼓楼区', '玄武区', '秦淮区', '建邺区', '雨花台区', '浦口区', '栖霞区', '江宁区', '六合区', '溧水区', '高淳区'],
        '成都': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区', '新津区', '都江堰市', '彭州市', '邛崃市', '崇州市', '简阳市'],
        '武汉': ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区'],
        '西安': ['新城区', '碑林区', '莲湖区', '雁塔区', '未央区', '灞桥区', '长安区', '阎良区', '临潼区', '高陵区', '鄠邑区', '蓝田县', '周至县'],
        '重庆市': ['渝中区', '江北区', '南岸区', '九龙坡区', '沙坪坝区', '大渡口区', '北碚区', '渝北区', '巴南区', '涪陵区', '万州区', '黔江区', '长寿区', '江津区', '合川区', '永川区', '南川区', '綦江区', '大足区', '璧山区', '铜梁区', '潼南区', '荣昌区', '开州区', '梁平区', '武隆区'],
        '长沙': ['芙蓉区', '天心区', '岳麓区', '开福区', '雨花区', '望城区', '长沙县', '浏阳市', '宁乡市'],
        '郑州': ['中原区', '二七区', '管城回族区', '金水区', '上街区', '惠济区', '中牟县', '巩义市', '荥阳市', '新密市', '新郑市', '登封市'],
        '济南': ['历下区', '市中区', '槐荫区', '天桥区', '历城区', '长清区', '章丘区', '济阳区', '莱芜区', '钢城区', '平阴县', '商河县'],
        '合肥': ['瑶海区', '庐阳区', '蜀山区', '包河区', '长丰县', '肥东县', '肥西县', '庐江县', '巢湖市'],
        '福州': ['鼓楼区', '台江区', '仓山区', '马尾区', '晋安区', '长乐区', '闽侯县', '连江县', '罗源县', '闽清县', '永泰县', '平潭县', '福清市'],
        '石家庄': ['长安区', '桥西区', '新华区', '井陉矿区', '裕华区', '藁城区', '鹿泉区', '栾城区', '井陉县', '正定县', '行唐县', '灵寿县', '高邑县', '深泽县', '赞皇县', '无极县', '平山县', '元氏县', '赵县', '晋州市', '新乐市']
      },
      // 城市选择器索引 [省, 市, 区]
      cityIndex: [0, 0, 0],
      expectedCityIndex: [0, 0, 0],
      
      // ========== 学历选择器数据 ==========
      degreeOptions: [
        { value: 'high_school', text: '高中' },
        { value: 'college', text: '专科' },
        { value: 'bachelor', text: '本科' },
        { value: 'master', text: '硕士' },
        { value: 'doctor', text: '博士' }
      ],
      degreeIndex: 2, // 默认本科
      
      // ========== 毕业年份数据 ==========
      graduationYears: [],
      yearIndex: 5, // 默认当前年份
      
      // ========== 到岗时间选项 ==========
      availableTimeOptions: ['立即到岗', '一周内到岗', '两周内到岗', '一个月内到岗', '两个月内到岗', '三个月内到岗', '待定'],
      timeIndex: 0
    }
  },
  
  computed: {
    // 所在城市选择器范围
    cityRange() {
      const province = this.provinces[this.cityIndex[0]] || this.provinces[0]
      const cityList = this.cities[province] || ['其他']
      const city = cityList[this.cityIndex[1]] || cityList[0]
      const districtList = this.districts[city] || ['其他']
      
      return [this.provinces, cityList, districtList]
    },
    
    // 期望城市选择器范围（独立的计算属性）
    expectedCityRange() {
      const province = this.provinces[this.expectedCityIndex[0]] || this.provinces[0]
      const cityList = this.cities[province] || ['其他']
      const city = cityList[this.expectedCityIndex[1]] || cityList[0]
      const districtList = this.districts[city] || ['其他']
      
      return [this.provinces, cityList, districtList]
    },
    
    // 学历文本显示
    degreeText() {
      const item = this.degreeOptions[this.degreeIndex]
      return item ? item.text : ''
    },
    
    // 基本信息表单验证
    isBasicInfoFormValid() {
      const { real_name, birth_date, city, email } = this.basicInfoForm
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      
      const realNameValid = real_name.trim().length > 0
      const birthDateValid = birth_date.trim().length > 0
      const cityValid = city.trim().length > 0
      const emailValid = email.trim() === '' || emailRegex.test(email)
      
      return realNameValid && birthDateValid && cityValid && emailValid
    },
    
    // 教育背景表单验证
    isEducationFormValid() {
      const { degree, school_name, major, graduation_year } = this.educationForm
      
      const degreeValid = degree.trim().length > 0
      const schoolNameValid = school_name.trim().length > 0
      const majorValid = major.trim().length > 0
      const graduationYearValid = graduation_year.trim().length === 4 && !isNaN(graduation_year)
      
      return degreeValid && schoolNameValid && majorValid && graduationYearValid
    },
    
    // 求职意向表单验证
    isJobIntentFormValid() {
      const { expected_salary_min, expected_salary_max } = this.jobIntentForm
      
      if (expected_salary_min && isNaN(expected_salary_min)) return false
      if (expected_salary_max && isNaN(expected_salary_max)) return false
      
      return true
    }
  },
  
  onLoad(options) {
    // 接收从登录页面传递过来的注册数据
    if (options.registerData) {
      try {
        this.registerForm = JSON.parse(decodeURIComponent(options.registerData))
        console.log('接收到的注册数据:', this.registerForm)
      } catch (e) {
        console.error('解析注册数据失败:', e)
      }
    }
    
    // 初始化年份数据
    this.initYearData()
  },
  
  methods: {
    initYearData() {
      // 生成毕业年份列表（2020-2030）
      this.graduationYears = []
      const currentYear = new Date().getFullYear()
      for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        this.graduationYears.push(i + '年')
      }
      // 默认选中当前年份
      this.yearIndex = 5
    },
    
    // ========== 出生日期选择 ==========
    onBirthDateChange(e) {
      this.basicInfoForm.birth_date = e.detail.value
    },
    
    // ========== 所在城市选择器方法 ==========
    onCityChange(e) {
      const value = e.detail.value
      const province = this.provinces[value[0]]
      const cityList = this.cities[province] || ['其他']
      const city = cityList[value[1]]
      const districtList = this.districts[city] || ['其他']
      const district = districtList[value[2]]
      
      this.basicInfoForm.city = `${province} ${city} ${district}`
      this.cityIndex = value
    },
    
    onCityColumnChange(e) {
      const { column, value } = e.detail
      
      if (column === 0) {
        this.cityIndex = [value, 0, 0]
      } else if (column === 1) {
        this.cityIndex = [this.cityIndex[0], value, 0]
      } else {
        this.cityIndex = [this.cityIndex[0], this.cityIndex[1], value]
      }
    },
    
    // ========== 期望城市选择器方法 ==========
    onExpectedCityChange(e) {
      const value = e.detail.value
      const province = this.provinces[value[0]]
      const cityList = this.cities[province] || ['其他']
      const city = cityList[value[1]]
      const districtList = this.districts[city] || ['其他']
      const district = districtList[value[2]]
      
      this.jobIntentForm.expected_city = `${province} ${city} ${district}`
      this.expectedCityIndex = value
    },
    
    onExpectedCityColumnChange(e) {
      const { column, value } = e.detail
      
      if (column === 0) {
        this.expectedCityIndex = [value, 0, 0]
      } else if (column === 1) {
        this.expectedCityIndex = [this.expectedCityIndex[0], value, 0]
      } else {
        this.expectedCityIndex = [this.expectedCityIndex[0], this.expectedCityIndex[1], value]
      }
    },
    
    // ========== 学历选择 ==========
    onDegreeChange(e) {
      this.degreeIndex = e.detail.value
      this.educationForm.degree = this.degreeOptions[this.degreeIndex].value
    },
    
    // ========== 毕业年份选择 ==========
    onYearChange(e) {
      this.yearIndex = e.detail.value
      const yearStr = this.graduationYears[this.yearIndex]
      this.educationForm.graduation_year = yearStr.replace('年', '')
    },
    
    // ========== 到岗时间选择 ==========
    onTimeChange(e) {
      this.timeIndex = e.detail.value
      this.jobIntentForm.available_time = this.availableTimeOptions[this.timeIndex]
    },
    
    // ========== 步骤控制方法 ==========
    nextRegisterStep() {
      if (this.registerStep === 2 && this.isBasicInfoFormValid) {
        this.registerStep = 3
      } else if (this.registerStep === 3 && this.isEducationFormValid) {
        this.registerStep = 4
      }
    },
    
    prevRegisterStep() {
      if (this.registerStep > 2) {
        this.registerStep--
      } else {
        uni.navigateBack()
      }
    },
    
    // ========== 完成注册 ==========
    async completeRegister() {
      this.loading = true
      
      try {
        // 准备注册数据 
        const registerData = {
          mobile: this.registerForm.mobile,
          sms_code: this.registerForm.sms_code,
          password: this.registerForm.password,
          // 基本信息
          real_name: this.basicInfoForm.real_name.trim(),
          gender: this.basicInfoForm.gender,
          birth_date: this.basicInfoForm.birth_date,
          city: this.basicInfoForm.city,
          email: this.basicInfoForm.email.trim() || undefined,
          // 教育背景
          education_level: this.educationForm.degree,
          school_name: this.educationForm.school_name.trim(),
          major: this.educationForm.major.trim(),
          graduation_year: this.educationForm.graduation_year
        }
        
        console.log('发送注册数据:', registerData)
        
        // 调用注册接口
        const res = await userApi.register(registerData)
        console.log('注册响应:', res)
        
        if (res && res.user_id) {
          // 注册成功，自动登录
          console.log('注册成功，开始自动登录')
          
          const loginRes = await userApi.login({
            mobile: this.registerForm.mobile,
            password: this.registerForm.password
          })
          
          console.log('登录响应:', loginRes)
          
          if (loginRes && loginRes.token) {
            // 保存登录信息
            uni.setStorageSync('token', loginRes.token)
            uni.setStorageSync('userInfo', JSON.stringify(loginRes.user_info))
            
            // 保存求职意向
            if (this.registerStep === 4 && this.jobIntentForm.expected_city) {
              const resumeInfo = {
                job_direction: this.jobIntentForm.job_direction,
                expected_city: this.jobIntentForm.expected_city,
                expected_salary_min: this.jobIntentForm.expected_salary_min,
                expected_salary_max: this.jobIntentForm.expected_salary_max,
                available_time: this.jobIntentForm.available_time
              }
              uni.setStorageSync('resumeInfo', JSON.stringify(resumeInfo))
            }
            
            uni.showToast({
              title: '注册成功',
              icon: 'success'
            })
            
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/index/index_index'
              })
            }, 1500)
          } else {
            throw new Error('自动登录失败')
          }
        } else {
          throw new Error('注册失败：未返回用户ID')
        }
      } catch (error) {
        console.error('注册失败:', error)
        uni.showToast({
          title: error.message || '注册失败，请稍后重试',
          icon: 'none',
          duration: 3000
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
.register-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F8FAFD;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

.register-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
}

/* 导航栏样式 */
.nav-bar {
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
  margin-bottom: 12px;
}

.nav-bar-left {
  flex: 0 0 auto;
  padding: 8px;
}

.nav-bar-center {
  flex: 1;
  text-align: center;
}

.nav-bar-title {
  font-size: 17px;
  font-weight: 600;
  color: #1E1E1E;
}

.nav-bar-right {
  flex: 0 0 auto;
  padding: 8px;
}

/* 注册表单 */
.register-form {
  background-color: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
}

/* 步骤标题 */
.step-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 24px;
  text-align: center;
}

.optional-tag {
  font-size: 14px;
  color: #007aff;
  font-weight: normal;
  margin-left: 8px;
}

/* 表单样式 */
.form-item {
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  color: #6C757D;
  margin-bottom: 8px;
  display: block;
}

.form-input-wrapper {
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 0 12px;
  background-color: #F2F5F9;
  height: 48px;
  transition: all 0.3s ease;
}

.form-input-wrapper:focus-within {
  box-shadow: 0 0 0 2px rgba(0,122,255,0.2);
}

/* picker包装器样式 */
.picker-wrapper {
  width: 100%;
}

/* 确保picker覆盖整个区域 */
picker {
  width: 100%;
}

.form-input {
  flex: 1;
  font-size: 15px;
  color: #1E1E1E;
  padding-left: 12px;
  background-color: transparent;
  border: none;
  outline: none;
}

.form-input::placeholder {
  color: #ADB5BD;
}

.form-input:disabled {
  color: #1E1E1E;
  opacity: 1;
  -webkit-text-fill-color: #1E1E1E;
}

/* 错误提示 */
.error-text {
  font-size: 13px;
  color: #e54d42;
  margin-top: 8px;
  display: block;
}

/* 性别选择器 */
.gender-selector {
  display: flex;
  gap: 12px;
}

.gender-item {
  flex: 1;
  text-align: center;
  padding: 0 16px;
  background-color: #F2F5F9;
  border-radius: 30px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.gender-item:active {
  transform: scale(0.95);
}

.gender-item.active {
  background-color: #007aff;
}

.gender-text {
  font-size: 14px;
  color: #1E1E1E;
  transition: all 0.3s ease;
}

.gender-item.active .gender-text {
  color: #fff;
  font-weight: 600;
}

/* 薪资范围 */
.salary-range {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  background-color: #F2F5F9;
  border-radius: 12px;
  height: 48px;
}

.salary-input {
  flex: 1;
  font-size: 15px;
  color: #1E1E1E;
  background: transparent;
  border: none;
  outline: none;
}

.salary-input::placeholder {
  color: #ADB5BD;
}

.salary-separator {
  font-size: 15px;
  color: #6C757D;
}

.salary-unit {
  font-size: 13px;
  color: #6C757D;
}

/* 按钮区域 */
.register-buttons {
  display: flex;
  gap: 12px;
  margin: 32px 0 16px;
}

.back-btn {
  flex: 1;
  height: 48px;
  background-color: #F2F5F9;
  color: #6C757D;
  font-size: 16px;
  border-radius: 30px;
  transition: all 0.3s ease;
  border: none;
}

.back-btn:active {
  background-color: #E9ECEF;
  transform: scale(0.98);
}

.register-btn {
  flex: 1;
  height: 48px;
  background-color: #007aff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 30px;
  transition: all 0.3s ease;
  border: none;
}

.register-btn:active {
  background-color: #0056b3;
  transform: scale(0.98);
}

.register-btn:disabled {
  background-color: #E9ECEF;
  color: #ADB5BD;
}

/* 跳过按钮 */
.skip-btn {
  flex: 1;
  height: 48px;
  background-color: #F2F5F9;
  color: #6C757D;
  font-size: 16px;
  border-radius: 30px;
  transition: all 0.3s ease;
  border: none;
}

.skip-btn:active {
  background-color: #E9ECEF;
  transform: scale(0.98);
}

/* 注册步骤 */
.register-step {
  display: none;
  animation: fadeIn 0.3s ease-in-out;
}

.register-step.active {
  display: block;
}

.register-step.optional {
  display: block;
  animation: fadeIn 0.3s ease-in-out;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>