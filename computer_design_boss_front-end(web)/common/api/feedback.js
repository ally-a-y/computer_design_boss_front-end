import request from './request.js'

// 投诉类型
export const getComplaintTypes = () => {
  return request({
    url: '/api/complaint/types',
    method: 'GET'
  })
}

// 获取反馈列表
export const getFeedbackList = (params) => {
  return request({
    url: '/api/feedback/list',
    method: 'GET',
    data: params
  })
}

// 提交反馈
export const submitFeedback = (data) => {
  return request({
    url: '/api/feedback/submit',
    method: 'POST',
    data
  })
}