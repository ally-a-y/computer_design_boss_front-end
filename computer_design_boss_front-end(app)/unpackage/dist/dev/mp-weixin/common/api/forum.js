"use strict";
const common_vendor = require("../vendor.js");
const common_api_request = require("./request.js");
const forumApi = {
  // 获取所有一级评论
  getAllFirstComments: () => {
    return common_api_request.requestWithRetry({
      url: "/forum/forum_all_first_talk",
      method: "GET"
    });
  },
  // 发表评论
  addComment: (commentData) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forums_add",
      method: "POST",
      data: commentData
    });
  },
  // 删除评论
  deleteComment: (commentId) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forum_delete",
      method: "POST",
      data: { id: commentId }
    });
  },
  // 获取评论详情
  getCommentDetail: async (commentId) => {
    try {
      const allComments = await common_api_request.requestWithRetry({
        url: "/forum/forum_all_first_talk",
        method: "GET"
      });
      return allComments.filter((comment) => comment.id == commentId);
    } catch (error) {
      common_vendor.index.__f__("error", "at common/api/forum.js:41", "获取评论详情失败:", error);
      return [];
    }
  },
  // 添加回复
  addReply: (replyData) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forums_add",
      method: "POST",
      data: replyData
    });
  },
  // 获取评论回复列表
  getCommentReplies: (parentId) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forums_back",
      method: "POST",
      data: { parent_id: parentId }
    });
  }
};
exports.forumApi = forumApi;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/api/forum.js.map
