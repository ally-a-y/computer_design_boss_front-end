import request from './request.js'

export const favoriteApi = {

  // 1️⃣ 添加收藏
  addFavorite(data) {
    return request({
      url: '/api/job/favorite/add',
      method: 'POST',
      data
    })
  },

  // 2️⃣ 取消收藏
  cancelFavorite(data) {
    return request({
      url: '/api/job/favorite/cancel',
      method: 'POST',
      data
    })
  },

  // 3️⃣ 获取收藏列表
  getFavoriteList(user_id, include_canceled = 0) {
    return request({
      url: '/api/job/favorite/list',
      method: 'GET',
      data: {
        user_id,
        include_canceled
      }
    })
  },

  // 4️⃣ 检查是否收藏
  checkFavorite(user_id, boss_job_id) {
    return request({
      url: '/api/job/favorite/check',
      method: 'GET',
      data: {
        user_id,
        boss_job_id
      }
    })
  },

  // 5️⃣ 更新备注
  updateRemarks(data) {
    return request({
      url: '/api/job/favorite/update_remarks',
      method: 'POST',
      data
    })
  },

  // 6️⃣ 获取收藏详情
  getFavoriteDetail(user_id, boss_job_id) {
    return request({
      url: '/api/job/favorite/detail',
      method: 'GET',
      data: {
        user_id,
        boss_job_id
      }
    })
  },

  // 7️⃣ 批量取消收藏
  batchCancel(data) {
    return request({
      url: '/api/job/favorite/batch_cancel',
      method: 'POST',
      data
    })
  }

}