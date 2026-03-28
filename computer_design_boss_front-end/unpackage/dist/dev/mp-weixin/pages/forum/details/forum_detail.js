"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_forum = require("../../../common/api/forum.js");
var common_utils_themeSimple = require("../../../common/utils/theme-simple.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
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
        "101": "\u524D\u7AEF",
        "102": "\u540E\u7AEF",
        "103": "\u79FB\u52A8\u7AEF",
        "104": "\u6570\u636E\u4E0EAI",
        "105": "\u8FD0\u7EF4\u4E0E\u6D4B\u8BD5"
      },
      currentTheme: "light",
      isDarkMode: false
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
    console.log("\u5E16\u5B50ID (\u6574\u6570):", this.postId);
    this.initTheme();
    this.loadPostDetail();
    this.loadReplies();
  },
  onUnload() {
    common_vendor.index.$off("globalThemeChange", this.handleGlobalThemeChange);
  },
  methods: {
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
    isValidAvatar(avatar) {
      if (!avatar || avatar === "") {
        return false;
      }
      const cleaned = avatar.replace(/\s+/g, "");
      return cleaned.length > 0;
    },
    initTheme() {
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme;
      this.isDarkMode = data.isDark;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    async loadPostDetail() {
      try {
        console.log("=== \u5F00\u59CB\u52A0\u8F7D\u5E16\u5B50\u8BE6\u60C5 ===");
        console.log("\u5E16\u5B50ID:", this.postId);
        const res = await common_api_forum.forumApi.getCommentDetail(this.postId);
        console.log("getCommentDetail\u8FD4\u56DE\u7ED3\u679C:", res);
        if (res && res.length > 0) {
          console.log("\u5E16\u5B50\u8BE6\u60C5:", res[0]);
          this.post = res[0];
        } else {
          console.log("\u672A\u627E\u5230\u5E16\u5B50\u8BE6\u60C5");
        }
      } catch (error) {
        console.error("\u52A0\u8F7D\u5E16\u5B50\u8BE6\u60C5\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u52A0\u8F7D\u5931\u8D25",
          icon: "none"
        });
      } finally {
        console.log("=== \u52A0\u8F7D\u5E16\u5B50\u8BE6\u60C5\u7ED3\u675F ===");
      }
    },
    async loadReplies() {
      try {
        console.log("=== \u5F00\u59CB\u52A0\u8F7D\u56DE\u590D\u5217\u8868 ===");
        console.log("\u5E16\u5B50ID:", this.postId);
        const res = await common_api_forum.forumApi.getCommentReplies(this.postId);
        console.log("getCommentReplies\u8FD4\u56DE\u7ED3\u679C:", res);
        if (res) {
          console.log("\u56DE\u590D\u5217\u8868\u957F\u5EA6:", res.length);
          this.replies = res;
        } else {
          console.log("getCommentReplies\u8FD4\u56DEnull\u6216undefined");
        }
      } catch (error) {
        console.error("\u52A0\u8F7D\u56DE\u590D\u5931\u8D25:", error);
      } finally {
        console.log("=== \u52A0\u8F7D\u56DE\u590D\u5217\u8868\u7ED3\u675F ===");
      }
    },
    async submitReply() {
      if (!this.newReply.content.trim()) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u56DE\u590D\u5185\u5BB9",
          icon: "none"
        });
        return;
      }
      try {
        console.log("=== \u5F00\u59CB\u63D0\u4EA4\u56DE\u590D ===");
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
            title: "\u8BF7\u5148\u767B\u5F55",
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
        console.log("\u63D0\u4EA4\u7684\u56DE\u590D\u6570\u636E:", replyData);
        const addReplyResult = await common_api_forum.forumApi.addReply(replyData);
        console.log("addReply\u8FD4\u56DE\u7ED3\u679C:", addReplyResult);
        common_vendor.index.showToast({
          title: "\u56DE\u590D\u6210\u529F",
          icon: "success"
        });
        this.newReply.content = "";
        console.log("\u5F00\u59CB\u91CD\u65B0\u52A0\u8F7D\u56DE\u590D\u5217\u8868...");
        await this.loadReplies();
        console.log("\u56DE\u590D\u5217\u8868\u52A0\u8F7D\u5B8C\u6210\uFF0C\u5F53\u524D\u56DE\u590D\u6570:", this.replies.length);
      } catch (error) {
        console.error("\u63D0\u4EA4\u56DE\u590D\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u63D0\u4EA4\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
          icon: "none"
        });
      } finally {
        console.log("=== \u63D0\u4EA4\u56DE\u590D\u7ED3\u675F ===");
      }
    },
    replyToReply(reply) {
      this.newReply.content = `@\u7528\u6237${reply.user_id} `;
    },
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
            title: "\u8BF7\u5148\u767B\u5F55",
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
        console.error("\u70B9\u8D5E\u5931\u8D25:", error);
      }
    },
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
            title: "\u8BF7\u5148\u767B\u5F55",
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
        console.error("\u6536\u85CF\u5931\u8D25:", error);
      }
    },
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
            title: "\u8BF7\u5148\u767B\u5F55",
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
        console.error("\u70B9\u8D5E\u5931\u8D25:", error);
      }
    },
    sharePost() {
      common_vendor.index.showShareMenu({
        title: this.post.content,
        path: `/pages/forum/details/forum_detail?id=${this.postId}`
      });
    },
    switchReplySort(sortBy) {
      this.replySort = sortBy;
      this.sortReplies();
    },
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
    toggleAdvancedEditor() {
      this.showAdvancedEditor = !this.showAdvancedEditor;
    },
    insertBold() {
      this.newReply.content += "**\u7C97\u4F53\u6587\u672C**";
    },
    insertItalic() {
      this.newReply.content += "*\u659C\u4F53\u6587\u672C*";
    },
    insertLink() {
      common_vendor.index.prompt({
        title: "\u63D2\u5165\u94FE\u63A5",
        message: "\u8BF7\u8F93\u5165\u94FE\u63A5\u5730\u5740",
        success: (res) => {
          if (res.confirm) {
            this.newReply.content += `[\u94FE\u63A5](${res.value})`;
          }
        }
      });
    },
    insertCode() {
      this.newReply.content += "```\n\u4EE3\u7801\n```";
    },
    uploadImage() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.newReply.content += `![\u56FE\u7247](${res.tempFilePaths[0]})`;
        }
      });
    },
    goToUserProfile(userId) {
      common_vendor.index.showToast({
        title: "\u7528\u6237\u4E2A\u4EBA\u4E3B\u9875\u529F\u80FD\u6682\u672A\u5B9E\u73B0",
        icon: "none"
      });
    },
    reportPost() {
      common_vendor.index.showModal({
        title: "\u4E3E\u62A5\u5E16\u5B50",
        content: "\u786E\u5B9A\u8981\u4E3E\u62A5\u8FD9\u4E2A\u5E16\u5B50\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "\u4E3E\u62A5\u6210\u529F\uFF0C\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u5904\u7406",
              icon: "success"
            });
          }
        }
      });
    },
    reportReply(reply) {
      common_vendor.index.showModal({
        title: "\u4E3E\u62A5\u56DE\u590D",
        content: "\u786E\u5B9A\u8981\u4E3E\u62A5\u8FD9\u4E2A\u56DE\u590D\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "\u4E3E\u62A5\u6210\u529F\uFF0C\u6211\u4EEC\u4F1A\u5C3D\u5FEB\u5904\u7406",
              icon: "success"
            });
          }
        }
      });
    },
    getCategoryName(categoryId) {
      return this.categoryMap[categoryId] || "\u5176\u4ED6";
    },
    formatTime(timeStr) {
      if (!timeStr)
        return "\u672A\u77E5\u65F6\u95F4";
      try {
        const date = new Date(timeStr.replace(/-/g, "/"));
        const now = new Date();
        const diff = now - date;
        const minute = 60 * 1e3;
        const hour = 60 * minute;
        const day = 24 * hour;
        if (diff < minute) {
          return "\u521A\u521A";
        } else if (diff < hour) {
          return Math.floor(diff / minute) + "\u5206\u949F\u524D";
        } else if (diff < day) {
          return Math.floor(diff / hour) + "\u5C0F\u65F6\u524D";
        } else {
          return Math.floor(diff / day) + "\u5929\u524D";
        }
      } catch (e) {
        return timeStr;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    d: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    e: $data.post
  }, $data.post ? common_vendor.e({
    f: common_vendor.o(($event) => $options.goToUserProfile($data.post.user_id)),
    g: $options.isValidAvatar($data.post.user_avatar) ? "data:image/" + ($data.post.user_avatar_format === "jpg" ? "jpeg" : $data.post.user_avatar_format || "jpeg") + ";base64," + $options.decodeHtmlEntities($data.post.user_avatar.replace(/\s+/g, "")) : "/static/default-avatar.png",
    h: common_vendor.t($data.post.user_id),
    i: common_vendor.o(($event) => $options.goToUserProfile($data.post.user_id)),
    j: $options.isOriginalAuthor
  }, $options.isOriginalAuthor ? {} : {}, {
    k: common_vendor.t($options.formatTime($data.post.created_at)),
    l: $data.post.updated_at && $data.post.updated_at !== $data.post.created_at
  }, $data.post.updated_at && $data.post.updated_at !== $data.post.created_at ? {
    m: common_vendor.t($options.formatTime($data.post.updated_at))
  } : {}, {
    n: common_vendor.t($options.getCategoryName($data.post.category_id)),
    o: common_vendor.t($data.post.title || $data.post.content),
    p: common_vendor.t($data.post.content),
    q: common_vendor.t($data.post.view_count || 0),
    r: common_vendor.t($data.post.reply_count || 0),
    s: common_vendor.t($data.post.favorite_count || 0),
    t: common_vendor.t($data.post.like_count || 0),
    v: common_vendor.o((...args) => $options.toggleLike && $options.toggleLike(...args)),
    w: $data.post.is_liked ? 1 : "",
    x: common_vendor.t($data.post.favorite_count || 0),
    y: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args)),
    z: $data.post.is_favorited ? 1 : "",
    A: common_vendor.o((...args) => $options.sharePost && $options.sharePost(...args)),
    B: common_vendor.o((...args) => $options.reportPost && $options.reportPost(...args))
  }) : {}, common_vendor.e({
    C: common_vendor.t($data.replies.length),
    D: $data.replySort === "time_asc" ? 1 : "",
    E: common_vendor.o(($event) => $options.switchReplySort("time_asc")),
    F: $data.replySort === "time_desc" ? 1 : "",
    G: common_vendor.o(($event) => $options.switchReplySort("time_desc")),
    H: $data.replySort === "likes" ? 1 : "",
    I: common_vendor.o(($event) => $options.switchReplySort("likes")),
    J: common_vendor.f($data.replies, (reply, index, i0) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => $options.goToUserProfile(reply.user_id)),
        b: $options.isValidAvatar(reply.user_avatar) ? "data:image/" + (reply.user_avatar_format === "jpg" ? "jpeg" : reply.user_avatar_format || "jpeg") + ";base64," + $options.decodeHtmlEntities(reply.user_avatar.replace(/\s+/g, "")) : "/static/default-avatar.png",
        c: common_vendor.t(reply.user_id),
        d: common_vendor.o(($event) => $options.goToUserProfile(reply.user_id)),
        e: $options.isOriginalAuthor && reply.user_id === $data.post.user_id
      }, $options.isOriginalAuthor && reply.user_id === $data.post.user_id ? {} : {}, {
        f: reply.is_best_answer
      }, reply.is_best_answer ? {} : {}, {
        g: common_vendor.t($options.formatTime(reply.created_at)),
        h: common_vendor.t(index + 1),
        i: common_vendor.t(reply.content),
        j: common_vendor.o(($event) => $options.replyToReply(reply)),
        k: common_vendor.t(reply.like_count || 0),
        l: common_vendor.o(($event) => $options.toggleReplyLike(reply)),
        m: reply.is_liked ? 1 : "",
        n: common_vendor.o(($event) => $options.reportReply(reply)),
        o: reply.id
      });
    }),
    K: $data.replies.length === 0
  }, $data.replies.length === 0 ? {} : {}), common_vendor.e({
    L: common_vendor.o((...args) => $options.toggleAdvancedEditor && $options.toggleAdvancedEditor(...args)),
    M: $data.newReply.content,
    N: common_vendor.o(($event) => $data.newReply.content = $event.detail.value),
    O: common_vendor.o((...args) => $options.submitReply && $options.submitReply(...args)),
    P: !$data.newReply.content.trim(),
    Q: $data.showAdvancedEditor
  }, $data.showAdvancedEditor ? {
    R: common_vendor.o((...args) => $options.insertBold && $options.insertBold(...args)),
    S: common_vendor.o((...args) => $options.insertItalic && $options.insertItalic(...args)),
    T: common_vendor.o((...args) => $options.insertLink && $options.insertLink(...args)),
    U: common_vendor.o((...args) => $options.insertCode && $options.insertCode(...args)),
    V: common_vendor.o((...args) => $options.uploadImage && $options.uploadImage(...args))
  } : {}), {
    W: $data.isDarkMode ? "#1a1a1a" : "#F8FAFD"
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2f1ba243"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/forum/details/forum_detail.vue"]]);
wx.createPage(MiniProgramPage);
