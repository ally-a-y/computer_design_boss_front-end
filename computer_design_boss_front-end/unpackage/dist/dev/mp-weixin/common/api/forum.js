"use strict";
var common_api_request = require("./request.js");
const forumApi = {
  getAllFirstComments: () => {
    return common_api_request.requestWithRetry({
      url: "/forum/forum_all_first_talk",
      method: "GET"
    });
  },
  addComment: (commentData) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forums_add",
      method: "POST",
      data: commentData
    });
  },
  deleteComment: (commentId) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forum_delete",
      method: "POST",
      data: { id: commentId }
    });
  },
  getCommentDetail: async (commentId) => {
    try {
      const allComments = await common_api_request.requestWithRetry({
        url: "/forum/forum_all_first_talk",
        method: "GET"
      });
      return allComments.filter((comment) => comment.id == commentId);
    } catch (error) {
      console.error("\u83B7\u53D6\u8BC4\u8BBA\u8BE6\u60C5\u5931\u8D25:", error);
      return [];
    }
  },
  addReply: (replyData) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forums_add",
      method: "POST",
      data: replyData
    });
  },
  getCommentReplies: (parentId) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forums_back",
      method: "POST",
      data: { parent_id: parentId }
    });
  }
};
exports.forumApi = forumApi;
