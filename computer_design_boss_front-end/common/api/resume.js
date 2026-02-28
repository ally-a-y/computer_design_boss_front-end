import request from './request.js'

export const resumeApi = {

  // 基本信息
  saveBasic(data) {
    return request({
      url: '/api/resume/basic',
      method: 'POST',
      data
    })
  },

  getBasic() {
    return request({
      url: '/api/resume/basic',
      method: 'GET'
    })
  },

  // 求职意向
  saveIntention(data) {
    return request({
      url: '/api/resume/job-intention',
      method: 'POST',
      data
    })
  },

  getIntention() {
    return request({
      url: '/api/resume/complete',
      method: 'GET'
    })
  },

  // 求职偏好
  savePreference(data) {
    return request({
      url: '/api/resume/job-preference',
      method: 'POST',
      data
    })
  },

  getPreference() {
    return request({
      url: '/api/resume/job-preference',
      method: 'GET'
    })
  },

  // 校园经历
  saveCampus(data) {
    return request({
      url: '/api/resume/campus-experience',
      method: 'POST',
      data
    })
  },

  getCampus() {
    return request({
      url: '/api/resume/campus-experience',
      method: 'GET'
    })
  }

}