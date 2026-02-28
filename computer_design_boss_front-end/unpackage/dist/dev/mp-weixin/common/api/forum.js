"use strict";
var common_vendor = require("../vendor.js");
var common_api_request = require("./request.js");
const forumApi = {
  getAllComments: () => {
    return common_api_request.requestWithRetry({
      url: "/forum/all_forum_data",
      method: "GET"
    });
  },
  getCommentsByCategory: (categoryId) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forum_one_category",
      method: "POST",
      data: { category_id: categoryId }
    });
  },
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
  countComments: (params) => {
    return common_api_request.requestWithRetry({
      url: "/forum/forum_count",
      method: "POST",
      data: params
    });
  },
  getCommentDetail: async (commentId) => {
    try {
      const allComments = await common_api_request.requestWithRetry({
        url: "/forum/all_forum_data",
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
  },
  toggleLike: (params) => {
    return new Promise((resolve, reject) => {
      common_vendor.index.showToast({
        title: "\u70B9\u8D5E\u529F\u80FD\u6682\u672A\u5B9E\u73B0",
        icon: "none"
      });
      reject(new Error("\u70B9\u8D5E\u529F\u80FD\u6682\u672A\u5B9E\u73B0"));
    });
  },
  toggleFavorite: (params) => {
    return new Promise((resolve, reject) => {
      common_vendor.index.showToast({
        title: "\u6536\u85CF\u529F\u80FD\u6682\u672A\u5B9E\u73B0",
        icon: "none"
      });
      reject(new Error("\u6536\u85CF\u529F\u80FD\u6682\u672A\u5B9E\u73B0"));
    });
  },
  markBestAnswer: (params) => {
    return new Promise((resolve, reject) => {
      common_vendor.index.showToast({
        title: "\u6807\u8BB0\u6700\u4F73\u7B54\u6848\u529F\u80FD\u6682\u672A\u5B9E\u73B0",
        icon: "none"
      });
      reject(new Error("\u6807\u8BB0\u6700\u4F73\u7B54\u6848\u529F\u80FD\u6682\u672A\u5B9E\u73B0"));
    });
  }
};
exports.forumApi = forumApi;
