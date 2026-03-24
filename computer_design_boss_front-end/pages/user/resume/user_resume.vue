<template>
  <view class="resume-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-bar-left">
        <text class="nav-back-icon" @click="goBack">←</text>
      </view>
      <view class="nav-bar-center">
        <text class="nav-bar-title">我的简历</text>
      </view>
      <view class="nav-bar-right">
        <text class="save-btn" @click="saveResume">保存</text>
      </view>
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

		  <view class="salary-box">
			<input
			  class="salary-input"
			  type="number"
			  v-model="resume.intention.salary_min"
			  placeholder="最低薪资"
			/>
			
			<text class="wave">~</text>

			<input
			  class="salary-input"
			  type="number"
			  v-model="resume.intention.salary_max"
			  placeholder="最高薪资"
			/>
		  </view>
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
		  
		  <!-- 学生会 -->
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
			<!-- 学生会描述文本框（条件渲染） -->
			<view v-if="resume.campus_experience.student_union" class="campus-desc-box">
			  <textarea 
				class="campus-textarea" 
				v-model="resume.campus_experience.student_union_desc" 
				placeholder="请描述学生会经历（职务、工作内容、成果等）"
			  />
			</view>
		  </view>

		  <!-- 社团 -->
		  <view class="campus-group">
			<view class="campus-item" @click="toggleCampusExperience('club')">
			  <text class="campus-label">社团经历</text>
			  <switch 
				:checked="resume.campus_experience.club" 
				@change="(e) => resume.campus_experience.club = e.detail.value"
				color="#007aff"
				style="transform: scale(0.8);"
			  />
			</view>
			<!-- 社团描述文本框（条件渲染） -->
			<view v-if="resume.campus_experience.club" class="campus-desc-box">
			  <textarea 
				class="campus-textarea" 
				v-model="resume.campus_experience.club_desc" 
				placeholder="请描述社团经历（社团名称、职务、活动等）"
			  />
			</view>
		  </view>

		  <!-- 奖学金 -->
		  <view class="campus-group">
			<view class="campus-item" @click="toggleCampusExperience('scholarship')">
			  <text class="campus-label">奖学金</text>
			  <switch 
				:checked="resume.campus_experience.scholarship" 
				@change="(e) => resume.campus_experience.scholarship = e.detail.value"
				color="#007aff"
				style="transform: scale(0.8);"
			  />
			</view>
			<!-- 奖学金描述文本框（条件渲染） -->
			<view v-if="resume.campus_experience.scholarship" class="campus-desc-box">
			  <textarea 
				class="campus-textarea" 
				v-model="resume.campus_experience.scholarship_desc" 
				placeholder="请描述奖学金情况（奖项名称、等级、时间等）"
			  />
			</view>
		  </view>

		  <!-- 荣誉 -->
		  <view class="campus-group">
			<view class="campus-item" @click="toggleCampusExperience('honor')">
			  <text class="campus-label">荣誉</text>
			  <switch 
				:checked="resume.campus_experience.honor" 
				@change="(e) => resume.campus_experience.honor = e.detail.value"
				color="#007aff"
				style="transform: scale(0.8);"
			  />
			</view>
			<!-- 荣誉描述文本框（条件渲染） -->
			<view v-if="resume.campus_experience.honor" class="campus-desc-box">
			  <textarea 
				class="campus-textarea" 
				v-model="resume.campus_experience.honor_desc" 
				placeholder="请描述获得荣誉（奖项名称、颁发机构、时间等）"
			  />
			</view>
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
        gender: '',
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
          salary_min: '',
          salary_max: '',
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
        student_union_desc: '',        // 学生会详细描述
        club: false,
        club_desc: '',                 // 社团详细描述
        scholarship: false,
        scholarship_desc: '',          // 奖学金详细描述
        honor: false,
        honor_desc: '',                // 荣誉详细描述         
      },

        certificates: [],
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
		console.log("basic",basic)
        const intention = await resumeApi.getIntention()
		console.log("intention",intention)
        const preference = await resumeApi.getPreference()
		console.log("preference",preference)
        const campus = await resumeApi.getCampus()
		console.log("campus",campus)
		const certificates = await resumeApi.getCertificates()
		console.log("certificates",certificates)
		this.companySizeIndex =
		  preference.company_size_preference ?? 0
		console.log('暂无简历',this.resume.intention.city_priority)
		this.workTypeIndex =
		  preference.work_type_preference ?? 0
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
    })
	this.resume.intention= {
	  industry:intention.target_industries,
	  position: intention.target_positions,
	  city: intention.city_priority,
	  salary_min: intention.salary_min,
	  salary_max: intention.salary_max,
	  available_time: intention.availability
	},
    Object.assign(this.resume.preference = {
      internship_conversion: preference.accept_intern_to_full === 1,
      remote_work: preference.accept_remote_city === 1,
      campus_recommendation: preference.need_campus_referral === 1,
      overtime: preference.accept_overtime === 1,
      business_trip: preference.accept_business_trip === 1,
    })
	Object.assign(this.resume.campus_experience, {
	  student_union: campus.has_student_union === 1,
	  student_union_desc: campus.student_union_details || '',
	  club: campus.has_club === 1,
	  club_desc: campus.club_details || '',
	  scholarship: campus.has_scholarship === 1,
	  scholarship_desc: campus.scholarship_details || '',
	  honor: campus.has_honor === 1,
	  honor_desc: campus.honor_details || '',
	})
		this.resume.certificates = certificates || []
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
             gender: this.resume.gender,  // 1=男 2=女
             birth_date: this.resume.birth_date,
             phone: this.resume.phone,    // 修正
             email: this.resume.email,
             wechat: this.resume.wechat,  // 加回
             city: this.resume.city,
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
             city_priority: this.resume.intention.city, // 对应 city_priority
             salary_min: this.resume.intention.salary_min,
             salary_max: this.resume.intention.salary_max,
             availability: this.resume.intention.available_time
           })
       
           // 3️⃣ 保存求职偏好
           await resumeApi.savePreference({
             accept_intern_to_full: this.resume.preference.internship_conversion ? 1 : 0,
             accept_remote_city: this.resume.preference.remote_work ? 1 : 0,
             need_campus_referral: this.resume.preference.campus_recommendation ? 1 : 0,
             accept_overtime: this.resume.preference.overtime ? 1 : 0,
             accept_business_trip: this.resume.preference.business_trip ? 1 : 0,
             company_size_preference: this.companySizeIndex,
             work_type_preference: this.workTypeIndex
           })
       
           // 4️⃣ 保存校园经历
			await resumeApi.saveCampus({
			  has_student_union: this.resume.campus_experience.student_union ? 1 : 0,
			  student_union_details: this.resume.campus_experience.student_union_desc,
			  has_club: this.resume.campus_experience.club ? 1 : 0,
			  club_details: this.resume.campus_experience.club_desc,
			  has_scholarship: this.resume.campus_experience.scholarship ? 1 : 0,
			  scholarship_details: this.resume.campus_experience.scholarship_desc,
			  has_honor: this.resume.campus_experience.honor ? 1 : 0,
			  honor_details: this.resume.campus_experience.honor_desc,
			})

		for (const cert of this.resume.certificates) {
			if (!cert.id) {
			  await resumeApi.saveCertificates({
				cert_name: cert.cert_name,
				cert_type: cert.cert_type,
				issue_date: cert.issue_date,
				expiry_date: cert.expiry_date,
				certificate_no: cert.certificate_no,
				cert_level: cert.cert_level,
				issuing_authority: cert.issuing_authority,
				attachment_url: cert.attachment_url
			  })
			}
		}
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
  background-color: #F8FAFD;
  min-height: 100vh;
  font-family: -apple-system, Helvetica, Roboto, sans-serif;
}

/* 导航栏样式 */
.nav-bar {
  display: flex;
  align-items: center;
  height: 80px;
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
  font-size: 18px;
  font-weight: 600;
  color: #1E1E1E;
}

.nav-bar-right {
  flex: 0 0 auto;
  padding: 8px;
}

.nav-back-icon {
  color: #1E1E1E;
  transition: all 0.3s ease;
}

.nav-back-icon:active {
  color: #007aff;
}

.save-btn {
  font-size: 16px;
  color: #007aff;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 8px;
}

.save-btn:active {
  background-color: #F0F4FF;
  transform: scale(0.98);
}

.resume-content {
  padding: 16px;
  height: calc(100vh - 64px);
}

.section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 12px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1E1E1E;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid #007aff;
}

.add-btn {
  font-size: 14px;
  color: #007aff;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 4px 8px;
  border-radius: 8px;
}

.add-btn:active {
  background-color: #F0F4FF;
  transform: scale(0.98);
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-item.checkbox {
  justify-content: space-between;
}

.label {
  width: 80px;
  font-size: 14px;
  color: #6C757D;
  flex-shrink: 0;
}

.input {
  flex: 1;
  height: 48px;
  background-color: #F2F5F9;
  border: none;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  color: #1E1E1E;
  transition: all 0.3s ease;
}

.input:active,
.input:focus {
  background-color: #E9ECEF;
  box-shadow: 0 0 0 2px rgba(0,122,255,0.2);
}

.textarea {
  flex: 1;
  min-height: 120px;
  background-color: #F2F5F9;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  color: #1E1E1E;
  resize: none;
  transition: all 0.3s ease;
}

.textarea:active,
.textarea:focus {
  background-color: #E9ECEF;
  box-shadow: 0 0 0 2px rgba(0,122,255,0.2);
}

.certificate-item {
  background-color: #F8FAFD;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #F0F4FF;
}

.certificate-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #F2F5F9;
}

.action-btn {
  font-size: 14px;
  margin-left: 16px;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:active {
  transform: scale(0.98);
}

.action-btn.edit {
  color: #007aff;
}

.action-btn.edit:active {
  background-color: #F0F4FF;
}

.action-btn.delete {
  color: #ff3b30;
}

.action-btn.delete:active {
  background-color: #FFEBEE;
}

.file-upload {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-btn {
  padding: 8px 16px;
  background-color: #007aff;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-btn:active {
  background-color: #0056b3;
  transform: scale(0.98);
}

.file-name {
  font-size: 14px;
  color: #6C757D;
  flex: 1;
}

.preference-group {
  background-color: #F8FAFD;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #F0F4FF;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F2F5F9;
  transition: all 0.3s ease;
}

.preference-item:last-child {
  border-bottom: none;
}

.preference-item:active {
  background-color: #F0F4FF;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 8px;
}

.preference-label {
  font-size: 14px;
  color: #1E1E1E;
}

.campus-group {
  background-color: #F8FAFD;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #F0F4FF;
}

.campus-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F2F5F9;
  transition: all 0.3s ease;
}

.campus-item:last-child {
  border-bottom: none;
}

.campus-item:active {
  background-color: #F0F4FF;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 8px;
}

.campus-label {
  font-size: 14px;
  color: #1E1E1E;
}

.salary-box {
  display: flex;
  align-items: center;
  flex: 1;
}

.salary-input {
  flex: 1;
  background-color: #F2F5F9;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #1E1E1E;
  transition: all 0.3s ease;
}

.salary-input:active,
.salary-input:focus {
  background-color: #E9ECEF;
  box-shadow: 0 0 0 2px rgba(0,122,255,0.2);
}

.wave {
  margin: 0 16px;
  font-size: 16px;
  color: #6C757D;
}

.campus-desc-box {
  padding: 16px;
  background-color: #F2F5F9;
  border-radius: 12px;
  margin-top: 8px;
  animation: slideDown 0.3s ease;
}

.campus-textarea {
  width: 100%;
  min-height: 100px;
  background-color: #fff;
  border: 1px solid #F0F4FF;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  color: #1E1E1E;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.campus-textarea:active,
.campus-textarea:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 2px rgba(0,122,255,0.2);
}

/* 展开动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 选择器样式 */
.picker {
  flex: 1;
}

.picker view {
  font-size: 14px;
  color: #1E1E1E;
}

/* 开关样式 */
switch {
  transform: scale(0.8);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #F8FAFD;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #C4C9D0;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #A5A9AD;
}

</style>