<template>
  <view class="job-add-page">
    <view class="page-header">
      <text class="cancel-btn" @click="onCancel">取消</text>
      <text class="title">发布职位</text>
      <text class="save-btn" @click="onSubmit">发布</text>
    </view>
    
    <view class="form-container">
      <!-- 职位名称 -->
      <view class="form-item">
        <text class="label">职位名称</text>
        <input type="text" placeholder="请输入职位名称" v-model="jobData.title" />
      </view>
      
      <!-- 公司ID -->
      <view class="form-item">
        <text class="label">公司ID</text>
        <input type="number" placeholder="请输入公司ID" v-model="jobData.company_id" />
      </view>
      
      <!-- 城市ID -->
      <view class="form-item">
        <text class="label">城市ID</text>
        <input type="number" placeholder="请输入城市ID" v-model="jobData.city_id" />
      </view>
      
      <!-- 职位分类 -->
      <view class="form-item">
        <text class="label">职位分类</text>
        <picker :range="categoryList" :range-key="'name'" :value="getCategoryIndex()" @change="onCategoryChange">
          <view class="picker-value">{{ selectedCategoryName || '请选择职位分类' }}</view>
        </picker>
      </view>
      
      <!-- 就业类型 -->
      <view class="form-item">
        <text class="label">就业类型</text>
        <picker :range="empTypeList" :range-key="'name'" :value="getEmpTypeIndex()" @change="onEmpTypeChange">
          <view class="picker-value">{{ selectedEmpTypeName || '请选择就业类型' }}</view>
        </picker>
      </view>
      
      <!-- 薪资范围 -->
      <view class="form-item salary-item">
        <text class="label">薪资范围</text>
        <view class="salary-inputs">
          <input type="number" placeholder="最低" v-model="jobData.salary_min" />
          <text class="salary-divider">-</text>
          <input type="number" placeholder="最高" v-model="jobData.salary_max" />
        </view>
      </view>
      
      <!-- 学历要求 -->
      <view class="form-item">
        <text class="label">学历要求</text>
        <input type="text" placeholder="请输入学历要求" v-model="jobData.edu_req" />
      </view>
      
      <!-- 经验要求 -->
      <view class="form-item">
        <text class="label">经验要求</text>
        <input type="text" placeholder="请输入经验要求" v-model="jobData.exp_req" />
      </view>
      
      <!-- 职位描述 -->
      <view class="form-item">
        <text class="label">职位描述</text>
        <textarea placeholder="请输入职位描述" v-model="jobData.description" rows="4"></textarea>
      </view>
    </view>
  </view>
</template>

<script>
import { jobApi } from '@/common/api/job.js'

export default {
  data() {
    return {
      jobData: {
        boss_job_id: '',
        title: '',
        company_id: '',
        city_id: '',
        category_id: 0,
        emp_type: 0,
        salary_min: '',
        salary_max: '',
        salary_desc: '',
        edu_req: '',
        exp_req: '',
        district: '',
        address: '',
        recruiter_id: '',
        description: '',
        require_list: [],
        welfare_list: [],
        publish_time: '',
        refresh_time: '',
        status: 1
      },
      categoryList: [
        { id: 1001, name: '技术' },
        { id: 1002, name: '产品' },
        { id: 1003, name: '设计' },
        { id: 1004, name: '运营' },
        { id: 1005, name: '市场' }
      ],
      empTypeList: [
        { id: 1, name: '全职' },
        { id: 2, name: '兼职' },
        { id: 3, name: '实习' }
      ]
    }
  },
  computed: {
    selectedCategoryName() {
      const category = this.categoryList.find(c => c.id === this.jobData.category_id)
      return category ? category.name : ''
    },
    selectedEmpTypeName() {
      const type = this.empTypeList.find(t => t.id === this.jobData.emp_type)
      return type ? type.name : ''
    }
  },
  methods: {
    onCancel() {
      uni.navigateBack()
    },
    
    // 获取职位分类在picker中的索引
    getCategoryIndex() {
      return this.categoryList.findIndex(c => c.id === this.jobData.category_id)
    },
    
    // 职位分类选择变化处理
    onCategoryChange(e) {
      const index = e.detail.value
      this.jobData.category_id = this.categoryList[index].id
    },
    
    // 获取就业类型在picker中的索引
    getEmpTypeIndex() {
      return this.empTypeList.findIndex(t => t.id === this.jobData.emp_type)
    },
    
    // 就业类型选择变化处理
    onEmpTypeChange(e) {
      const index = e.detail.value
      this.jobData.emp_type = this.empTypeList[index].id
    },
    
    async onSubmit() {
      // 表单验证
      if (!this.jobData.title || !this.jobData.company_id || !this.jobData.city_id || !this.jobData.category_id) {
        uni.showToast({
          title: '请填写必填项',
          icon: 'none'
        })
        return
      }
      
      try {
        // 格式化数据
        const submitData = {
          ...this.jobData,
          boss_job_id: Date.now().toString(),
          company_id: parseInt(this.jobData.company_id),
          city_id: parseInt(this.jobData.city_id),
          category_id: parseInt(this.jobData.category_id),
          emp_type: parseInt(this.jobData.emp_type),
          salary_min: parseFloat(this.jobData.salary_min) * 1000,
          salary_max: parseFloat(this.jobData.salary_max) * 1000,
          publish_time: new Date().toISOString(),
          refresh_time: new Date().toISOString()
        }
        
        // 提交数据
        await jobApi.addJob(submitData)
        
        uni.showToast({
          title: '发布成功',
          icon: 'success'
        })
        
        // 返回上一页并刷新数据
        setTimeout(() => {
          uni.navigateBack({
            delta: 1
          })
        }, 1500)
      } catch (error) {
        console.error('发布失败:', error)
        uni.showToast({
          title: '发布失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style>
.job-add-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 16px;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.cancel-btn,
.save-btn {
  font-size: 28rpx;
  color: #007aff;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.form-container {
  padding: 20rpx;
}

.form-item {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-radius: 10rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
}

input, textarea {
  width: 100%;
  font-size: 28rpx;
  padding: 15rpx;
  border: 1rpx solid #eee;
  border-radius: 6rpx;
  background-color: #f9f9f9;
}

textarea {
  min-height: 150rpx;
  resize: none;
}

.salary-item {
  padding-bottom: 20rpx;
}

.salary-inputs {
  display: flex;
  align-items: center;
}

.salary-inputs input {
  flex: 1;
}

.salary-divider {
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #999;
}

.picker-value {
  width: 100%;
  padding: 15rpx;
  border: 1rpx solid #eee;
  border-radius: 6rpx;
  background-color: #f9f9f9;
  font-size: 28rpx;
  color: #999;
}
</style>