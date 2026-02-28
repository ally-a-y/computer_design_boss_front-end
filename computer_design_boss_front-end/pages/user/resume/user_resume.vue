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
import { resumeApi } from '@/common/api/resume.js'

export default {
  data() {
    return {
      genderOptions: ['男', '女'],
      genderIndex: 0,

      companySizeOptions: ['不限', '小型', '中型', '大型'],
      companySizeIndex: 0,

      workTypeOptions: ['全职', '兼职', '实习'],
      workTypeIndex: 0,

      certTypeOptions: ['技能类', '资格类', '语言类', '其他'],

      resume: {
        real_name: '',
        gender: 1,
        birth_date: '',
        phone: '',
        email: '',
        wechat: '',
        city: '',
        education_level: '',
        school_name: '',
        major: '',
        graduation_year: '',
        gpa: '',
        self_introduction: '',

        intention: {
          industry: '',
          position: '',
          city: '',
          salary: '',
          available_time: ''
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
          description: ''
        },

        certificates: []
      }
    }
  },

  async onLoad() {
    await this.loadResume()
  },

  methods: {

    goBack() {
      uni.navigateBack()
    },

    /* =============================
       加载完整简历
    ============================= */
    async loadResume() {
      try {
        const basic = await resumeApi.getBasic()
        //const intention = await resumeApi.getIntention()
        const preference = await resumeApi.getPreference()
        const campus = await resumeApi.getCampus()

        this.resume = {
          ...this.resume,
          ...basic.data,
          intention: intention.data || {},
          preference: preference.data || {},
          campus_experience: campus.data || {},
          certificates: certificates.data || []
        }

        // 设置选择器索引
        this.genderIndex = this.resume.gender === 2 ? 1 : 0
      } catch (err) {
        console.log('暂无简历')
      }
    },

    /* =============================
       保存简历
    ============================= */
    async saveResume() {
      try {
       // 1️⃣ 保存基本信息
        await resumeApi.saveBasic({
          real_name: this.resume.real_name,
          phone: this.resume.gender,
          birth_date: this.resume.birth_date,
          //phone: this.resume.phone,
          email: this.resume.email,
          //wechat: this.resume.wechat,
          //city: this.resume.city,
          education_level: this.resume.education_level,
          school_name: this.resume.school_name,
          major: this.resume.major,
          graduation_year: this.resume.graduation_year,
          gpa: this.resume.gpa,
          self_introduction: this.resume.self_introduction
        })

        // 2️⃣ 保存求职意向
        await resumeApi.saveIntention({
          target_industries: this.resume.intention.industry,
          target_positions: this.resume.intention.position,
          salary_min: 100,
          salary_max: 10000,
          target_city: this.resume.intention.city,
          available_time: this.resume.intention.available_time
        })

        // 3️⃣ 保存求职偏好
        await resumeApi.savePreference(this.resume.preference)

        // 4️⃣ 保存校园经历
        await resumeApi.saveCampus(this.resume.campus_experience)

        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })

      } catch (err) {
        uni.showToast({
          title: err.message || '保存失败',
          icon: 'none'
        })
      }
    },

    /* =============================
       选择器事件处理
    ============================= */
    onGenderChange(e) {
      this.genderIndex = e.detail.value
      this.resume.gender = this.genderIndex === 1 ? 2 : 1
    },

    onCompanySizeChange(e) {
      this.companySizeIndex = e.detail.value
    },

    onWorkTypeChange(e) {
      this.workTypeIndex = e.detail.value
    },

    /* =============================
       证书操作
    ============================= */
    addCertificate() {
      this.resume.certificates.push({
        cert_name: '',
        cert_type: 0,
        cert_level: '',
        issue_date: '',
        expiry_date: '',
        issuing_authority: '',
        certificate_no: '',
        attachment_url: ''
      })
    },

    deleteCertificate(index) {
      const cert = this.resume.certificates[index]
      if (!cert.id) {
        this.resume.certificates.splice(index, 1)
        return
      }
      uni.showModal({
        title: '删除证书',
        content: '确定删除此证书吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await resumeApi.deleteCertificate(cert.id)
              this.resume.certificates.splice(index, 1)
              uni.showToast({ title: '删除成功', icon: 'success' })
            } catch (err) {
              uni.showToast({ title: '删除失败', icon: 'none' })
            }
          }
        }
      })
    },

    getCertTypeIndex(type) {
      return this.certTypeOptions.indexOf(type)
    },

    onCertTypeChange(e, index) {
      const val = e.detail.value
      this.resume.certificates[index].cert_type = this.certTypeOptions[val]
    },

    onCertDateChange(e, index, field) {
      this.resume.certificates[index][field] = e.detail.value
    },

    getFileName(url) {
      if (!url) return ''
      const parts = url.split('/')
      return parts[parts.length - 1]
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