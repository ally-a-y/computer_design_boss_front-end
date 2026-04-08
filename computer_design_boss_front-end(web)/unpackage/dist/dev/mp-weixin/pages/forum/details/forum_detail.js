"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_forum = require("../../../common/api/forum.js");
const common_mixins_themeMixin = require("../../../common/mixins/themeMixin.js");
const _sfc_main = {
  mixins: [common_mixins_themeMixin.themeMixin],
  data() {
    return {
      postId: null,
      post: null,
      replies: [],
      newReply: {
        content: "",
        parent_id: null
      },
      replySort: "time_asc",
      showAdvancedEditor: false,
      categoryMap: {
        "101": "前端",
        "102": "后端",
        "103": "移动端",
        "104": "数据与AI",
        "105": "运维与测试"
      }
    };
  },
  computed: {
    isOriginalAuthor() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      return userInfo && userInfo.user_id && this.post && this.post.user_id === userInfo.user_id;
    }
  },
  onLoad(options) {
    this.postId = parseInt(options.id) || null;
    common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:226", "帖子ID (整数):", this.postId);
    this.loadPostDetail();
    this.loadReplies();
  },
  methods: {
    // 解码HTML实体
    decodeHtmlEntities(text) {
      const entities = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      };
      return text.replace(/&[#\w]+;/g, (entity) => {
        return entities[entity] || entity;
      });
    },
    // 检查头像数据是否有效
    isValidAvatar(avatar) {
      if (!avatar || avatar === "") {
        return false;
      }
      const cleaned = avatar.replace(/\s+/g, "");
      return cleaned.length > 0;
    },
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 加载帖子详情
    async loadPostDetail() {
      try {
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:275", "=== 开始加载帖子详情 ===");
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:276", "帖子ID:", this.postId);
        const res = await common_api_forum.forumApi.getCommentDetail(this.postId);
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:279", "getCommentDetail返回结果:", res);
        if (res && res.length > 0) {
          common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:282", "帖子详情:", res[0]);
          this.post = res[0];
        } else {
          common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:285", "未找到帖子详情");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forum/details/forum_detail.vue:288", "加载帖子详情失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:294", "=== 加载帖子详情结束 ===");
      }
    },
    // 加载回复列表
    async loadReplies() {
      try {
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:301", "=== 开始加载回复列表 ===");
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:302", "帖子ID:", this.postId);
        const res = await common_api_forum.forumApi.getCommentReplies(this.postId);
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:305", "getCommentReplies返回结果:", res);
        if (res) {
          common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:308", "回复列表长度:", res.length);
          this.replies = res;
        } else {
          common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:311", "getCommentReplies返回null或undefined");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forum/details/forum_detail.vue:314", "加载回复失败:", error);
      } finally {
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:316", "=== 加载回复列表结束 ===");
      }
    },
    // 提交回复
    async submitReply() {
      if (!this.newReply.content.trim()) {
        common_vendor.index.showToast({
          title: "请输入回复内容",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:331", "=== 开始提交回复 ===");
        let userInfo = common_vendor.index.getStorageSync("userInfo");
        if (typeof userInfo === "string") {
          try {
            userInfo = JSON.parse(userInfo);
          } catch (e) {
            userInfo = null;
          }
        }
        if (!userInfo || !userInfo.user_id) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        const replyData = {
          category_id: this.post.category_id,
          user_id: userInfo.user_id,
          parent_id: this.postId,
          content: this.newReply.content.trim(),
          level: 2,
          sort_order: 0
        };
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:359", "提交的回复数据:", replyData);
        const addReplyResult = await common_api_forum.forumApi.addReply(replyData);
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:362", "addReply返回结果:", addReplyResult);
        common_vendor.index.showToast({
          title: "回复成功",
          icon: "success"
        });
        this.newReply.content = "";
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:373", "开始重新加载回复列表...");
        await this.loadReplies();
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:375", "回复列表加载完成，当前回复数:", this.replies.length);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forum/details/forum_detail.vue:378", "提交回复失败:", error);
        common_vendor.index.showToast({
          title: "提交失败，请重试",
          icon: "none"
        });
      } finally {
        common_vendor.index.__f__("log", "at pages/forum/details/forum_detail.vue:384", "=== 提交回复结束 ===");
      }
    },
    // 回复某个回复
    replyToReply(reply) {
      this.newReply.content = `@用户${reply.user_id} `;
    },
    // 点赞帖子
    async toggleLike() {
      try {
        let userInfo = common_vendor.index.getStorageSync("userInfo");
        if (typeof userInfo === "string") {
          try {
            userInfo = JSON.parse(userInfo);
          } catch (e) {
            userInfo = null;
          }
        }
        if (!userInfo || !userInfo.user_id) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        await common_api_forum.forumApi.toggleLike({
          user_id: userInfo.user_id,
          comment_id: this.postId,
          action: this.post.is_liked ? "unlike" : "like"
        });
        if (this.post.is_liked) {
          this.post.like_count--;
          this.post.is_liked = false;
        } else {
          this.post.like_count++;
          this.post.is_liked = true;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forum/details/forum_detail.vue:429", "点赞失败:", error);
      }
    },
    // 收藏帖子
    async toggleFavorite() {
      try {
        let userInfo = common_vendor.index.getStorageSync("userInfo");
        if (typeof userInfo === "string") {
          try {
            userInfo = JSON.parse(userInfo);
          } catch (e) {
            userInfo = null;
          }
        }
        if (!userInfo || !userInfo.user_id) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        await common_api_forum.forumApi.toggleFavorite({
          user_id: userInfo.user_id,
          comment_id: this.postId,
          action: this.post.is_favorited ? "unfavorite" : "favorite"
        });
        if (this.post.is_favorited) {
          this.post.favorite_count--;
          this.post.is_favorited = false;
        } else {
          this.post.favorite_count++;
          this.post.is_favorited = true;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forum/details/forum_detail.vue:469", "收藏失败:", error);
      }
    },
    // 点赞回复
    async toggleReplyLike(reply) {
      try {
        let userInfo = common_vendor.index.getStorageSync("userInfo");
        if (typeof userInfo === "string") {
          try {
            userInfo = JSON.parse(userInfo);
          } catch (e) {
            userInfo = null;
          }
        }
        if (!userInfo || !userInfo.user_id) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        await common_api_forum.forumApi.toggleLike({
          user_id: userInfo.user_id,
          comment_id: reply.id,
          action: reply.is_liked ? "unlike" : "like"
        });
        if (reply.is_liked) {
          reply.like_count--;
          reply.is_liked = false;
        } else {
          reply.like_count++;
          reply.is_liked = true;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forum/details/forum_detail.vue:509", "点赞失败:", error);
      }
    },
    // 分享帖子
    sharePost() {
      common_vendor.index.showShareMenu({
        title: this.post.content,
        path: `/pages/forum/details/forum_detail?id=${this.postId}`
      });
    },
    // 切换回复排序
    switchReplySort(sortBy) {
      this.replySort = sortBy;
      this.sortReplies();
    },
    // 前端排序回复
    sortReplies() {
      const sortedReplies = [...this.replies];
      switch (this.replySort) {
        case "time_asc":
          sortedReplies.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          break;
        case "time_desc":
          sortedReplies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case "likes":
          sortedReplies.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
          break;
      }
      this.replies = sortedReplies;
    },
    // 切换高级编辑器
    toggleAdvancedEditor() {
      this.showAdvancedEditor = !this.showAdvancedEditor;
    },
    // 插入粗体
    insertBold() {
      this.newReply.content += "**粗体文本**";
    },
    // 插入斜体
    insertItalic() {
      this.newReply.content += "*斜体文本*";
    },
    // 插入链接
    insertLink() {
      common_vendor.index.prompt({
        title: "插入链接",
        message: "请输入链接地址",
        success: (res) => {
          if (res.confirm) {
            this.newReply.content += `[链接](${res.value})`;
          }
        }
      });
    },
    // 插入代码
    insertCode() {
      this.newReply.content += "```\n代码\n```";
    },
    // 上传图片
    uploadImage() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.newReply.content += `![图片](${res.tempFilePaths[0]})`;
        }
      });
    },
    // 跳转到用户个人主页
    goToUserProfile(userId) {
      common_vendor.index.showToast({
        title: "用户个人主页功能暂未实现",
        icon: "none"
      });
    },
    // 举报帖子
    reportPost() {
      common_vendor.index.showModal({
        title: "举报帖子",
        content: "确定要举报这个帖子吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "举报成功，我们会尽快处理",
              icon: "success"
            });
          }
        }
      });
    },
    // 举报回复
    reportReply(reply) {
      common_vendor.index.showModal({
        title: "举报回复",
        content: "确定要举报这个回复吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "举报成功，我们会尽快处理",
              icon: "success"
            });
          }
        }
      });
    },
    // 获取分类名称
    getCategoryName(categoryId) {
      return this.categoryMap[categoryId] || "其他";
    },
    // 格式化时间
    formatTime(timeStr) {
      if (!timeStr)
        return "未知时间";
      try {
        const date = new Date(timeStr.replace(/-/g, "/"));
        const now = /* @__PURE__ */ new Date();
        const diff = now - date;
        const minute = 60 * 1e3;
        const hour = 60 * minute;
        const day = 24 * hour;
        if (diff < minute) {
          return "刚刚";
        } else if (diff < hour) {
          return Math.floor(diff / minute) + "分钟前";
        } else if (diff < day) {
          return Math.floor(diff / hour) + "小时前";
        } else {
          return Math.floor(diff / day) + "天前";
        }
      } catch (e) {
        return timeStr;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "33"),
    b: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    d: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    e: $data.post
  }, $data.post ? common_vendor.e({
    f: common_vendor.o(($event) => $options.goToUserProfile($data.post.user_id), "49"),
    g: $options.isValidAvatar($data.post.user_avatar) ? "data:image/" + ($data.post.user_avatar_format === "jpg" ? "jpeg" : $data.post.user_avatar_format || "jpeg") + ";base64," + $options.decodeHtmlEntities($data.post.user_avatar.replace(/\s+/g, "")) : "/static/default-avatar.png",
    h: common_vendor.t($data.post.user_id),
    i: common_vendor.o(($event) => $options.goToUserProfile($data.post.user_id), "ae"),
    j: $options.isOriginalAuthor
  }, $options.isOriginalAuthor ? {} : {}, {
    k: common_vendor.t($options.formatTime($data.post.created_at)),
    l: $data.post.updated_at && $data.post.updated_at !== $data.post.created_at
  }, $data.post.updated_at && $data.post.updated_at !== $data.post.created_at ? {
    m: common_vendor.t($options.formatTime($data.post.updated_at))
  } : {}, {
    n: common_vendor.t($options.getCategoryName($data.post.category_id)),
    o: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)",
    p: common_vendor.t($data.post.title || $data.post.content),
    q: common_vendor.t($data.post.content),
    r: common_vendor.t($data.post.view_count || 0),
    s: common_vendor.t($data.post.reply_count || 0),
    t: common_vendor.t($data.post.favorite_count || 0),
    v: common_vendor.t($data.post.like_count || 0),
    w: common_vendor.o((...args) => $options.toggleLike && $options.toggleLike(...args), "bf"),
    x: $data.post.is_liked ? 1 : "",
    y: common_vendor.t($data.post.favorite_count || 0),
    z: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args), "0d"),
    A: $data.post.is_favorited ? 1 : "",
    B: common_vendor.o((...args) => $options.sharePost && $options.sharePost(...args), "51"),
    C: common_vendor.o((...args) => $options.reportPost && $options.reportPost(...args), "45"),
    D: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)"
  }) : {}, common_vendor.e({
    E: common_vendor.t($data.replies.length),
    F: $data.replySort === "time_asc" ? 1 : "",
    G: common_vendor.o(($event) => $options.switchReplySort("time_asc"), "1d"),
    H: $data.replySort === "time_desc" ? 1 : "",
    I: common_vendor.o(($event) => $options.switchReplySort("time_desc"), "19"),
    J: $data.replySort === "likes" ? 1 : "",
    K: common_vendor.o(($event) => $options.switchReplySort("likes"), "0c"),
    L: common_vendor.f($data.replies, (reply, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.goToUserProfile(reply.user_id), reply.id),
        b: $options.isValidAvatar(reply.user_avatar) ? "data:image/" + (reply.user_avatar_format === "jpg" ? "jpeg" : reply.user_avatar_format || "jpeg") + ";base64," + $options.decodeHtmlEntities(reply.user_avatar.replace(/\s+/g, "")) : "/static/default-avatar.png",
        c: common_vendor.t(reply.user_id),
        d: common_vendor.o(($event) => $options.goToUserProfile(reply.user_id), reply.id),
        e: $options.isOriginalAuthor && reply.user_id === $data.post.user_id
      }, $options.isOriginalAuthor && reply.user_id === $data.post.user_id ? {} : {}, {
        f: reply.is_best_answer
      }, reply.is_best_answer ? {} : {}, {
        g: common_vendor.t($options.formatTime(reply.created_at)),
        h: common_vendor.t(index + 1),
        i: common_vendor.t(reply.content),
        j: common_vendor.o(($event) => $options.replyToReply(reply), reply.id),
        k: common_vendor.t(reply.like_count || 0),
        l: common_vendor.o(($event) => $options.toggleReplyLike(reply), reply.id),
        m: reply.is_liked ? 1 : "",
        n: common_vendor.o(($event) => $options.reportReply(reply), reply.id),
        o: reply.id
      });
    }),
    M: $data.replies.length === 0
  }, $data.replies.length === 0 ? {} : {}), common_vendor.e({
    N: common_vendor.o((...args) => $options.toggleAdvancedEditor && $options.toggleAdvancedEditor(...args), "6f"),
    O: $data.newReply.content,
    P: common_vendor.o(($event) => $data.newReply.content = $event.detail.value, "9a"),
    Q: common_vendor.o((...args) => $options.submitReply && $options.submitReply(...args), "e4"),
    R: !$data.newReply.content.trim(),
    S: $data.showAdvancedEditor
  }, $data.showAdvancedEditor ? {
    T: common_vendor.o((...args) => $options.insertBold && $options.insertBold(...args), "0a"),
    U: common_vendor.o((...args) => $options.insertItalic && $options.insertItalic(...args), "34"),
    V: common_vendor.o((...args) => $options.insertLink && $options.insertLink(...args), "45"),
    W: common_vendor.o((...args) => $options.insertCode && $options.insertCode(...args), "8b"),
    X: common_vendor.o((...args) => $options.uploadImage && $options.uploadImage(...args), "24")
  } : {}), {
    Y: _ctx.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0616a583"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/forum/details/forum_detail.js.map
