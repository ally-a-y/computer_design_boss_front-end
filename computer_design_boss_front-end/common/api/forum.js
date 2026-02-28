import request from './request.js'

// 论坛相关API
export const forumApi = {
  // 获取所有评论
  getAllComments: () => {
    return request({
      url: '/forum/all_forum_data',
      method: 'GET'
    })
  },
  
  // 根据职位分类获取评论
  getCommentsByCategory: (categoryId) => {
    return request({
      url: '/forum/forum_one_category',
      method: 'POST',
      data: { category_id: categoryId }
    })
  },
  
  // 获取所有一级评论
  getAllFirstComments: () => {
    return request({
      url: '/forum/forum_all_first_talk',
      method: 'GET'
    })
  },
  
  
  
  // 发表评论
  addComment: (commentData) => {
    return request({
      url: '/forum/forums_add',
      method: 'POST',
      data: commentData
    })
  },
  
  // 删除评论
  deleteComment: (commentId) => {
    return request({
      url: '/forum/forum_delete',
      method: 'POST',
      data: { id: commentId }
    })
  },
  
  // 统计评论数量
  countComments: (params) => {
    return request({
      url: '/forum/forum_count',
      method: 'POST',
      data: params
    })
  },
  
  // 获取评论详情
  getCommentDetail: async (commentId) => {
    // 由于后端没有专门的获取评论详情接口，我们从所有评论中过滤
    try {
      const allComments = await request({
        url: '/forum/all_forum_data',
        method: 'GET'
      })
      return allComments.filter(comment => comment.id == commentId)
    } catch (error) {
      console.error('获取评论详情失败:', error)
      return []
    }
  },
  
  // 添加回复
  addReply: (replyData) => {
    return request({
      url: '/forum/forums_add',
      method: 'POST',
      data: replyData
    })
  },
  
  // 获取评论回复列表
  getCommentReplies: (parentId) => {
    return request({
      url: '/forum/forums_back',
      method: 'POST',
      data: { parent_id: parentId }
    })
  },
  
  // 点赞/取消点赞
  toggleLike: (params) => {
    return new Promise((resolve, reject) => {
      uni.showToast({
        title: '点赞功能暂未实现',
        icon: 'none'
      })
      reject(new Error('点赞功能暂未实现'))
    })
  },

  // 收藏/取消收藏
  toggleFavorite: (params) => {
    return new Promise((resolve, reject) => {
      uni.showToast({
        title: '收藏功能暂未实现',
        icon: 'none'
      })
      reject(new Error('收藏功能暂未实现'))
    })
  },

  // 标记最佳答案
  markBestAnswer: (params) => {
    return new Promise((resolve, reject) => {
      uni.showToast({
        title: '标记最佳答案功能暂未实现',
        icon: 'none'
      })
      reject(new Error('标记最佳答案功能暂未实现'))
    })
  }
}