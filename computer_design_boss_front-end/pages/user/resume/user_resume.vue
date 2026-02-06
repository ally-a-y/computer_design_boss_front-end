<template>
  <view class="resume-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <text class="back-btn" @click="goBack">←</text>
      <text class="title">我的简历</text>
      <text class="save-btn" @click="saveResume">保存</text>
    </view>
    
    <!-- 简历内容 -->
    <scroll-view scroll-y class="resume-content">
      <!-- 基本信息 -->
      <view class="section">
        <text class="section-title">基本信息</text>
        <view class="form-item">
          <text class="label">姓名</text>
          <input class="input" v-model="resume.real_name" placeholder="请输入姓名" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <picker class="input" @change="onGenderChange" :value="genderIndex" :range="genderOptions">
            <view>{{ genderOptions[genderIndex] }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">出生日期</text>
          <picker class="input" mode="date" @change="(e) => resume.birth_date = e.detail.value" :value="resume.birth_date">
            <view>{{ resume.birth_date || '请选择出生日期' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">电话</text>
          <input class="input" v-model="resume.phone" placeholder="请输入手机号" type="number" />
        </view>
        <view class="form-item">
          <text class="label">邮箱</text>
          <input class="input" v-model="resume.email" placeholder="请输入邮箱" type="email" />
        </view>
        <view class="form-item">
          <text class="label">微信</text>
          <input class="input" v-model="resume.wechat" placeholder="请输入微信号" />
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <input class="input" v-model="resume.city" placeholder="请输入所在城市" />
        </view>
        <view class="form-item">
          <text class="label">教育水平</text>
          <input class="input" v-model="resume.education_level" placeholder="请输入教育水平" />
        </view>
        <view class="form-item">
          <text class="label">学校</text>
          <input class="input" v-model="resume.school_name" placeholder="请输入学校名称" />
        </view>
        <view class="form-item">
          <text class="label">专业</text>
          <input class="input" v-model="resume.major" placeholder="请输入专业" />
        </view>
        <view class="form-item">
          <text class="label">毕业年份</text>
          <picker class="input" mode="date" fields="year" @change="(e) => resume.graduation_year = e.detail.value.substring(0,4)" :value="resume.graduation_year">
            <view>{{ resume.graduation_year || '请选择毕业年份' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">GPA</text>
          <input class="input" v-model="resume.gpa" placeholder="请输入GPA" type="number" step="0.01" />
        </view>
        <view class="form-item">
          <text class="label">自我介绍</text>
          <textarea class="textarea" v-model="resume.self_introduction" placeholder="请输入自我介绍" />
        </view>
      </view>
      
      <!-- 求职意向 -->
      <view class="section">
        <text class="section-title">求职意向</text>
        <view class="form-item">
          <text class="label">期望行业</text>
          <input class="input" v-model="resume.intention.industry" placeholder="请输入期望行业" />
        </view>
        <view class="form-item">
          <text class="label">期望职位</text>
          <input class="input" v-model="resume.intention.position" placeholder="请输入期望职位" />
        </view>
        <view class="form-item">
          <text class="label">期望城市</text>
          <input class="input" v-model="resume.intention.city" placeholder="请输入期望城市" />
        </view>
        <view class="form-item">
          <text class="label">薪资范围</text>
          <input class="input" v-model="resume.intention.salary" placeholder="请输入期望薪资范围" />
        </view>
        <view class="form-item">
          <text class="label">到岗时间</text>
          <input class="input" v-model="resume.intention.available_time" placeholder="请输入到岗时间" />
        </view>
      </view>
      
      <!-- 求职偏好 -->
      <view class="section">
        <text class="section-title">求职偏好</text>
        <view class="preference-group">
          <view class="preference-item" @click="togglePreference('internship_conversion')">
            <text class="preference-label">接受实习转正</text>
            <switch 
              :checked="resume.preference.internship_conversion" 
              @change="(e) => resume.preference.internship_conversion = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
          <view class="preference-item" @click="togglePreference('remote_work')">
            <text class="preference-label">接受远程工作</text>
            <switch 
              :checked="resume.preference.remote_work" 
              @change="(e) => resume.preference.remote_work = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
          <view class="preference-item" @click="togglePreference('campus_recommendation')">
            <text class="preference-label">需要校园推荐</text>
            <switch 
              :checked="resume.preference.campus_recommendation" 
              @change="(e) => resume.preference.campus_recommendation = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
          <view class="preference-item" @click="togglePreference('overtime')">
            <text class="preference-label">接受加班</text>
            <switch 
              :checked="resume.preference.overtime" 
              @change="(e) => resume.preference.overtime = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
          <view class="preference-item" @click="togglePreference('business_trip')">
            <text class="preference-label">接受出差</text>
            <switch 
              :checked="resume.preference.business_trip" 
              @change="(e) => resume.preference.business_trip = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
        </view>
        <view class="form-item">
          <text class="label">公司规模偏好</text>
          <picker class="input" @change="onCompanySizeChange" :value="companySizeIndex" :range="companySizeOptions">
            <view>{{ companySizeOptions[companySizeIndex] }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">工作类型偏好</text>
          <picker class="input" @change="onWorkTypeChange" :value="workTypeIndex" :range="workTypeOptions">
            <view>{{ workTypeOptions[workTypeIndex] }}</view>
          </picker>
        </view>
      </view>
      
      <!-- 校园经历 -->
      <view class="section">
        <text class="section-title">校园经历</text>
        <view class="campus-group">
          <view class="campus-item" @click="toggleCampusExperience('student_union')">
            <text class="campus-label">学生会经历</text>
            <switch 
              :checked="resume.campus_experience.student_union" 
              @change="(e) => resume.campus_experience.student_union = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
          <view class="campus-item" @click="toggleCampusExperience('club')">
            <text class="campus-label">社团经历</text>
            <switch 
              :checked="resume.campus_experience.club" 
              @change="(e) => resume.campus_experience.club = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
          <view class="campus-item" @click="toggleCampusExperience('scholarship')">
            <text class="campus-label">奖学金</text>
            <switch 
              :checked="resume.campus_experience.scholarship" 
              @change="(e) => resume.campus_experience.scholarship = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
          <view class="campus-item" @click="toggleCampusExperience('honor')">
            <text class="campus-label">荣誉</text>
            <switch 
              :checked="resume.campus_experience.honor" 
              @change="(e) => resume.campus_experience.honor = e.detail.value"
              color="#007aff"
              style="transform: scale(0.8);"
            />
          </view>
        </view>
        <view class="form-item">
          <text class="label">详细描述</text>
          <textarea class="textarea" v-model="resume.campus_experience.description" placeholder="请输入详细描述" />
        </view>
      </view>
      
      <!-- 证书管理 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">证书管理</text>
          <text class="add-btn" @click="addCertificate">+ 添加证书</text>
        </view>
        
        <view v-for="(certificate, index) in resume.certificates" :key="index" class="certificate-item">
          <view class="form-item">
            <text class="label">证书类型</text>
            <picker class="input" @change="(e) => onCertTypeChange(e, index)" :value="getCertTypeIndex(certificate.cert_type)" :range="certTypeOptions">
              <view>{{ certTypeOptions[getCertTypeIndex(certificate.cert_type)] || '请选择证书类型' }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">证书名称</text>
            <input class="input" v-model="certificate.cert_name" placeholder="请输入证书名称" />
          </view>
          <view class="form-item">
            <text class="label">等级/分数</text>
            <input class="input" v-model="certificate.cert_level" placeholder="请输入证书级别或分数" />
          </view>
          <view class="form-item">
            <text class="label">颁发日期</text>
            <picker class="input" mode="date" @change="(e) => onCertDateChange(e, index, 'issue_date')" :value="certificate.issue_date">
              <view>{{ certificate.issue_date || '请选择颁发日期' }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">有效期</text>
            <picker class="input" mode="date" @change="(e) => onCertDateChange(e, index, 'expiry_date')" :value="certificate.expiry_date">
              <view>{{ certificate.expiry_date || '请选择有效期（可选）' }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="label">发证机构</text>
            <input class="input" v-model="certificate.issuing_authority" placeholder="请输入发证机构" />
          </view>
          <view class="form-item">
            <text class="label">证书编号</text>
            <input class="input" v-model="certificate.certificate_no" placeholder="请输入证书编号" />
          </view>
          <view class="form-item">
            <text class="label">证书附件</text>
            <view class="file-upload">
              <text class="upload-btn" @click="uploadCertificateFile(index)">上传PDF证书</text>
              <text class="file-name" v-if="certificate.attachment_url">{{ getFileName(certificate.attachment_url) }}</text>
            </view>
          </view>
          <view class="certificate-actions">
            <text class="action-btn edit" @click="editCertificate(index)">编辑</text>
            <text class="action-btn delete" @click="deleteCertificate(index)">删除</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      genderOptions: ['男', '女'],
      genderIndex: 0,
      certTypeOptions: ['english', 'computer', 'professional'],
      certTypeDisplayOptions: ['英语证书', '计算机证书', '职业资格证书'],
      companySizeOptions: ['1-50人', '51-200人', '201-500人', '501-1000人', '1001-5000人', '5000人以上'],
      companySizeIndex: 4, // 默认1001-5000人
      workTypeOptions: ['全职', '兼职', '实习', '远程工作', '自由职业'],
      workTypeIndex: 0, // 默认全职
      resume: {
        real_name: '张三',
        gender: 1,
        birth_date: '2000-01-01',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        wechat: 'zhangsan123',
        city: '北京',
        education_level: '本科',
        school_name: '北京大学',
        major: '计算机科学与技术',
        graduation_year: '2022',
        gpa: '3.8',
        self_introduction: '我是一名计算机专业的毕业生，具有扎实的专业基础和较强的学习能力...',
        intention: {
          industry: '互联网',
          position: '前端开发工程师',
          city: '北京',
          salary: '15k-25k',
          available_time: '立即到岗'
        },
        preference: {
          internship_conversion: true,
          remote_work: false,
          campus_recommendation: true,
          overtime: true,
          business_trip: false,
          company_size: '1000-5000人',
          work_type: '全职'
        },
        campus_experience: {
          student_union: true,
          club: true,
          scholarship: true,
          honor: false,
          description: '曾担任学生会宣传部部长，组织过多次校园活动...'
        },
        certificates: [
          {
            cert_type: 'computer',
            cert_name: '计算机二级证书',
            cert_level: '二级',
            issue_date: '2021-03-15',
            expiry_date: null,
            issuing_authority: '教育部考试中心',
            certificate_no: 'NCRE20210315001',
            attachment_url: null
          }
        ]
      }
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    saveResume() {
      // 保存简历逻辑 - 转换为后端格式
      const backendResume = this.convertToBackendFormat()
      uni.setStorageSync('resume', this.resume)
      uni.setStorageSync('backend_resume', backendResume)
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    },
    onGenderChange(e) {
      this.genderIndex = e.detail.value
      this.resume.gender = this.genderIndex + 1 // 1-男，2-女
    },
    onCompanySizeChange(e) {
      this.companySizeIndex = parseInt(e.detail.value)
      this.resume.preference.company_size = this.companySizeOptions[this.companySizeIndex]
    },
    onWorkTypeChange(e) {
      this.workTypeIndex = parseInt(e.detail.value)
      this.resume.preference.work_type = this.workTypeOptions[this.workTypeIndex]
    },
    togglePreference(preferenceKey) {
      // 点击整行切换开关状态
      this.resume.preference[preferenceKey] = !this.resume.preference[preferenceKey]
    },
    toggleCampusExperience(experienceKey) {
      // 点击整行切换校园经历开关状态
      this.resume.campus_experience[experienceKey] = !this.resume.campus_experience[experienceKey]
    },
    onCertTypeChange(e, index) {
      const certTypeIndex = parseInt(e.detail.value)
      this.resume.certificates[index].cert_type = this.certTypeOptions[certTypeIndex]
    },
    onCertDateChange(e, index, field) {
      this.resume.certificates[index][field] = e.detail.value
    },
    getCertTypeIndex(certType) {
      return this.certTypeOptions.indexOf(certType)
    },
    addCertificate() {
      this.resume.certificates.push({
        cert_type: 'professional',
        cert_name: '',
        cert_level: '',
        issue_date: '',
        expiry_date: null,
        issuing_authority: '',
        certificate_no: '',
        attachment_url: null
      })
    },
    editCertificate(index) {
      // 编辑证书逻辑
      uni.showToast({
        title: '编辑证书功能开发中',
        icon: 'none'
      })
    },
    deleteCertificate(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该证书吗？',
        success: (res) => {
          if (res.confirm) {
            this.resume.certificates.splice(index, 1)
          }
        }
      })
    },
    uploadCertificateFile(index) {
      // 上传PDF证书文件
      uni.chooseFile({
        count: 1,
        type: 'file',
        extension: ['.pdf'],
        success: (res) => {
          const file = res.tempFiles[0]
          if (file && file.name.toLowerCase().endsWith('.pdf')) {
            // 模拟文件上传
            const mockFileUrl = `https://cert-bucket.com/${file.name}`
            this.resume.certificates[index].attachment_url = mockFileUrl
            uni.showToast({
              title: '文件上传成功',
              icon: 'success'
            })
          } else {
            uni.showToast({
              title: '请选择PDF文件',
              icon: 'none'
            })
          }
        },
        fail: () => {
          uni.showToast({
            title: '文件选择失败',
            icon: 'none'
          })
        }
      })
    },
    getFileName(url) {
      if (!url) return ''
      return url.split('/').pop()
    },
    convertToBackendFormat() {
      // 转换为后端数据格式
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
        certificates: this.resume.certificates.map(cert => ({
          cert_type: cert.cert_type,
          cert_name: cert.cert_name,
          cert_level: cert.cert_level,
          issue_date: cert.issue_date,
          expiry_date: cert.expiry_date,
          issuing_authority: cert.issuing_authority,
          certificate_no: cert.certificate_no,
          attachment_url: cert.attachment_url
        }))
      }
    }
  },
  onLoad() {
    // 从存储中加载简历数据
    const savedResume = uni.getStorageSync('resume')
    if (savedResume) {
      this.resume = savedResume
      this.genderIndex = this.resume.gender === 1 ? 0 : 1
      this.companySizeIndex = this.companySizeOptions.indexOf(this.resume.preference.company_size) || 4
      this.workTypeIndex = this.workTypeOptions.indexOf(this.resume.preference.work_type) || 0
    }
  }
}
</script>

<style>
.resume-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.back-btn {
  font-size: 36rpx;
  color: #333;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.save-btn {
  font-size: 28rpx;
  color: #007aff;
}

.resume-content {
  padding: 20rpx;
  height: calc(100vh - 100rpx);
}

.section {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.add-btn {
  font-size: 24rpx;
  color: #007aff;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.form-item.checkbox {
  justify-content: space-between;
}

.label {
  width: 150rpx;
  font-size: 26rpx;
  color: #666;
}

.input {
  flex: 1;
  height: 70rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 26rpx;
}

.textarea {
  flex: 1;
  height: 150rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 26rpx;
  resize: none;
}

.certificate-item {
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.certificate-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10rpx;
}

.action-btn {
  font-size: 24rpx;
  margin-left: 20rpx;
}

.action-btn.edit {
  color: #007aff;
}

.action-btn.delete {
  color: #ff3b30;
}

.file-upload {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.upload-btn {
  padding: 10rpx 20rpx;
  background-color: #007aff;
  color: white;
  border-radius: 6rpx;
  font-size: 24rpx;
}

.file-name {
  font-size: 24rpx;
  color: #666;
  flex: 1;
}

.preference-group {
  background-color: #fafafa;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-label {
  font-size: 26rpx;
  color: #333;
}

.campus-group {
  background-color: #fafafa;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.campus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.campus-item:last-child {
  border-bottom: none;
}

.campus-label {
  font-size: 26rpx;
  color: #333;
}
</style>