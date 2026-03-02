import request from './request.js'

export const deliverApi = {

  // 1️⃣ 获取投递列表
  getDeliverList(user_id) {
    return request({
      url: '/api/job/deliver/list',
      method: 'GET',
      data: {
        user_id
      }
    })
  },

  // 2️⃣ 取消投递
  cancelDeliver(data) {
    return request({
      url: '/api/job/deliver/cancel',
      method: 'POST',
      data
    })
  },

  // 3️⃣ 获取投递详情
  getDeliverDetail(data) {
    return request({
      url: '/api/job/deliver/detail',
      method: 'GET',
      data
    })
  },

  // 4️⃣ 添加投递
  addDeliver(data) {
    return request({
      url: '/api/job/deliver/add',
      method: 'POST',
      data
    })
  },
  
  checkDeliver(data) {
    return request({
      url: '/api/job/deliver/check',
      method: 'POST',
      data
    })
  }

}