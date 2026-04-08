"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_forum = require("../../common/api/forum.js");
const common_mixins_themeMixin = require("../../common/mixins/themeMixin.js");
const _sfc_main = {
  mixins: [common_mixins_themeMixin.themeMixin],
  data() {
    return {
      keyword: "",
      currentCategory: "all",
      posts: [],
      allPosts: [],
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 20,
      isRefreshing: false,
      showQuickMenu: false,
      loadMoreTimer: null,
      isLoadingReplies: false,
      debugMode: false,
      // 手动控制调试模式
      categories: [
        { id: "100", name: "技术开发类", parent_id: null, level: 1, next_category_id: 100 },
        { id: "101", name: "前端开发", parent_id: 100, level: 2, next_category_id: 101 },
        { id: "102", name: "后端开发", parent_id: 100, level: 2, next_category_id: 102 },
        { id: "103", name: "移动端开发", parent_id: 100, level: 2, next_category_id: 103 },
        { id: "104", name: "数据与AI", parent_id: 100, level: 2, next_category_id: 104 },
        { id: "105", name: "运维与测试", parent_id: 100, level: 2, next_category_id: 105 },
        { id: "106", name: "产品设计", parent_id: 100, level: 2, next_category_id: 106 },
        { id: "107", name: "网络安全", parent_id: 100, level: 2, next_category_id: 107 },
        { id: "108", name: "嵌入式开发", parent_id: 100, level: 2, next_category_id: 108 },
        { id: "200", name: "产品与设计类", parent_id: null, level: 1, next_category_id: 200 },
        { id: "300", name: "技术管理类", parent_id: null, level: 1, next_category_id: 300 }
      ],
      showCategoryTabs: false,
      selectedSubCategories: [],
      categoryMap: {
        "101": "前端",
        "102": "后端",
        "103": "移动端",
        "104": "数据与AI",
        "105": "运维与测试",
        "106": "产品设计",
        "107": "网络安全",
        "108": "嵌入式",
        "200": "产品设计",
        "300": "技术管理"
      }
    };
  },
  computed: {
    // 计算筛选后的帖子
    filteredPosts() {
      let result = [...this.allPosts];
      if (this.currentCategory !== "all") {
        const currentCategoryNum = Number(this.currentCategory);
        const isTopLevelCategory = this.categories.some((c) => Number(c.id) === currentCategoryNum && c.level === 1);
        if (isTopLevelCategory) {
          let targetCategoryIds = [];
          if ([200, 300].includes(currentCategoryNum)) {
            targetCategoryIds = [currentCategoryNum];
          } else {
            targetCategoryIds = this.categories.filter((c) => c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum)).map((c) => parseInt(c.next_category_id));
          }
          result = result.filter((post) => {
            if (!post || post.category_id === null) {
              return false;
            }
            return targetCategoryIds.includes(post.category_id);
          });
          if (this.selectedSubCategories.length > 0) {
            if ([200, 300].includes(currentCategoryNum)) {
              result = result.filter((post) => {
                if (!post || post.category_id === null) {
                  return false;
                }
                return post.category_id === currentCategoryNum;
              });
            } else {
              result = result.filter((post) => {
                if (!post || post.category_id === null) {
                  return false;
                }
                return this.selectedSubCategories.includes(post.category_id);
              });
            }
          }
        } else {
          const currentCategoryObj = this.categories.find((c) => c.id === this.currentCategory);
          if (currentCategoryObj) {
            const targetCategoryId = currentCategoryObj.next_category_id;
            result = result.filter((post) => {
              if (!post || post.category_id === null) {
                return false;
              }
              return post.category_id === targetCategoryId;
            });
          }
        }
      }
      if (this.keyword && this.keyword.trim() !== "") {
        const keywordLower = this.keyword.toLowerCase().trim();
        result = result.filter((post) => {
          const titleMatch = post.title && post.title.toLowerCase().includes(keywordLower);
          const contentMatch = post.content && post.content.toLowerCase().includes(keywordLower);
          return titleMatch || contentMatch;
        });
      }
      return result;
    },
    // 计算子分类列表
    subCategoryList() {
      if (this.currentCategory === "all")
        return [];
      const currentCategoryNum = Number(this.currentCategory);
      const isTopLevelCategory = this.categories.some((c) => Number(c.id) === currentCategoryNum && c.level === 1);
      if (isTopLevelCategory && ![200, 300].includes(currentCategoryNum)) {
        return this.categories.filter((c) => {
          return c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum);
        });
      }
      return [];
    }
  },
  onLoad() {
    this.initDefaultCategory();
  },
  onShow() {
    this.loadPosts(true);
  },
  onUnload() {
    if (this.loadMoreTimer) {
      clearTimeout(this.loadMoreTimer);
    }
  },
  methods: {
    // 切换调试模式 - 长按标题5次开启/关闭
    toggleDebugMode() {
      this.debugMode = !this.debugMode;
      common_vendor.index.showToast({
        title: this.debugMode ? "调试模式已开启" : "调试模式已关闭",
        icon: "none",
        duration: 2e3
      });
    },
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
    // 加载帖子数据
    async loadPosts(reset = false) {
      if (reset) {
        this.page = 1;
        this.hasMore = true;
      }
      if (this.loading || !reset && !this.hasMore) {
        return;
      }
      this.loading = true;
      try {
        let res;
        const currentCategoryNum = Number(this.currentCategory);
        const isTopLevelCategory = this.categories.some((c) => Number(c.id) === currentCategoryNum && c.level === 1);
        res = await common_api_forum.forumApi.getAllFirstComments();
        if (res && res.length > 0) {
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:372", "=== 头像数据调试信息 ===");
          res.slice(0, 3).forEach((post, index) => {
            common_vendor.index.__f__("log", "at pages/forum/forum.vue:374", `帖子 ${index + 1} (用户ID: ${post.user_id}):`);
            common_vendor.index.__f__("log", "at pages/forum/forum.vue:375", "  user_avatar 存在:", !!post.user_avatar);
            common_vendor.index.__f__("log", "at pages/forum/forum.vue:376", "  user_avatar 长度:", post.user_avatar ? post.user_avatar.length : 0);
            common_vendor.index.__f__("log", "at pages/forum/forum.vue:377", "  user_avatar_format:", post.user_avatar_format);
            common_vendor.index.__f__("log", "at pages/forum/forum.vue:378", "  user_avatar 前20字符:", post.user_avatar ? post.user_avatar.substring(0, 20) : "空");
            if (post.user_avatar && post.user_avatar !== "") {
              const cleanedAvatar = post.user_avatar.replace(/\s+/g, "");
              const decodedAvatar = this.decodeHtmlEntities(cleanedAvatar);
              const avatarUrl = "data:image/" + (post.user_avatar_format === "jpg" ? "jpeg" : post.user_avatar_format || "jpeg") + ";base64," + decodedAvatar;
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:386", "  构建的头像URL长度:", avatarUrl.length);
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:387", "  头像URL前50字符:", avatarUrl.substring(0, 50));
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:390", "  base64数据开头检查:");
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:391", "    是否以/9j/开头（JPEG）:", decodedAvatar.startsWith("/9j/"));
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:392", "    是否以iVBOR开头（PNG）:", decodedAvatar.startsWith("iVBOR"));
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:393", "    是否以R0lG开头（GIF）:", decodedAvatar.startsWith("R0lG"));
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:394", "    是否以Qk开头（BMP）:", decodedAvatar.startsWith("Qk"));
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:397", "  空白字符检查:");
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:398", "    原始数据包含空白字符:", /\s/.test(post.user_avatar));
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:399", "    清理后长度:", cleanedAvatar.length);
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:400", "    解码后长度:", decodedAvatar.length);
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:401", "    原始长度:", post.user_avatar.length);
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:404", "  HTML实体检查:");
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:405", "    包含&符号:", cleanedAvatar.includes("&"));
              common_vendor.index.__f__("log", "at pages/forum/forum.vue:406", "    解码前后是否不同:", cleanedAvatar !== decodedAvatar);
            }
            common_vendor.index.__f__("log", "at pages/forum/forum.vue:408", "---");
          });
        }
        if (this.debugMode) {
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:414", "论坛数据:", res);
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:415", "当前分类:", this.currentCategory);
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:416", "是否一级分类:", isTopLevelCategory);
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:417", "所有分类:", this.categories);
        }
        if (res === null) {
          res = [];
        }
        if (res && res.length > 0 && this.debugMode) {
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:427", "第一条数据示例:", res[0]);
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:428", "数据字段验证:", {
            hasId: res[0].hasOwnProperty("id"),
            hasContent: res[0].hasOwnProperty("content"),
            hasCategoryId: res[0].hasOwnProperty("category_id"),
            hasUserId: res[0].hasOwnProperty("user_id"),
            hasCreatedAt: res[0].hasOwnProperty("created_at")
          });
        }
        if (res && res.length > 0) {
          let filteredPosts = [...res];
          if (this.currentCategory === "all") {
          } else if (isTopLevelCategory) {
            let targetCategoryIds = [];
            if ([200, 300].includes(currentCategoryNum)) {
              targetCategoryIds = [currentCategoryNum];
              if (this.debugMode) {
                common_vendor.index.__f__("log", "at pages/forum/forum.vue:453", "200/300分类直接使用:", targetCategoryIds);
              }
            } else {
              targetCategoryIds = this.categories.filter((c) => c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum)).map((c) => parseInt(c.next_category_id));
              if (this.debugMode) {
                common_vendor.index.__f__("log", "at pages/forum/forum.vue:462", "子分类ID列表:", targetCategoryIds);
              }
            }
            filteredPosts = filteredPosts.filter((post) => {
              if (!post || post.category_id === null) {
                return false;
              }
              const postCategoryId = post.category_id;
              const isMatch = targetCategoryIds.includes(postCategoryId);
              if (this.debugMode) {
                common_vendor.index.__f__("log", "at pages/forum/forum.vue:476", `帖子${post.id}的分类${postCategoryId}是否匹配:`, isMatch);
              }
              return isMatch;
            });
            if (this.selectedSubCategories.length > 0) {
              if ([200, 300].includes(currentCategoryNum)) {
                filteredPosts = filteredPosts.filter((post) => {
                  if (!post || post.category_id === null) {
                    return false;
                  }
                  return post.category_id === currentCategoryNum;
                });
              } else {
                filteredPosts = filteredPosts.filter((post) => {
                  if (!post || post.category_id === null) {
                    return false;
                  }
                  const postCategoryId = post.category_id;
                  return this.selectedSubCategories.includes(postCategoryId);
                });
              }
            }
          } else {
            const currentCategoryObj = this.categories.find((c) => c.id === this.currentCategory);
            if (currentCategoryObj) {
              const targetCategoryId = currentCategoryObj.next_category_id;
              filteredPosts = filteredPosts.filter((post) => {
                if (!post || post.category_id === null) {
                  return false;
                }
                return post.category_id === targetCategoryId;
              });
            }
          }
          if (this.keyword && this.keyword.trim() !== "") {
            const keywordLower = this.keyword.toLowerCase().trim();
            filteredPosts = filteredPosts.filter((post) => {
              const titleMatch = post.title && post.title.toLowerCase().includes(keywordLower);
              const contentMatch = post.content && post.content.toLowerCase().includes(keywordLower);
              return titleMatch || contentMatch;
            });
          }
          let postsWithReplyCount = filteredPosts.map((post) => ({
            ...post,
            reply_count: 0
            // 初始化为0，后续异步更新
          }));
          setTimeout(() => {
            this.updateReplyCounts(filteredPosts);
          }, 500);
          if (reset) {
            this.posts = postsWithReplyCount;
          } else {
            this.posts = [...this.posts, ...postsWithReplyCount];
          }
          this.hasMore = filteredPosts.length >= this.pageSize;
          this.page++;
        } else {
          this.hasMore = false;
          if (reset) {
            this.posts = [];
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forum/forum.vue:553", "加载帖子失败:", error);
        common_vendor.index.__f__("error", "at pages/forum/forum.vue:554", "错误详情:", error.message, error.stack);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
        this.isRefreshing = false;
      }
    },
    // 异步更新回复数量 - 分批处理，避免一次性请求过多
    async updateReplyCounts(posts) {
      if (!posts || posts.length === 0 || this.isLoadingReplies)
        return;
      this.isLoadingReplies = true;
      try {
        const batchSize = 3;
        for (let i = 0; i < posts.length; i += batchSize) {
          const batch = posts.slice(i, i + batchSize);
          try {
            const batchResults = await Promise.all(
              batch.map(async (post) => {
                try {
                  const replies = await common_api_forum.forumApi.getCommentReplies(post.id);
                  return {
                    id: post.id,
                    reply_count: replies && replies.length ? replies.length : 0
                  };
                } catch (error) {
                  if (this.debugMode) {
                    common_vendor.index.__f__("error", "at pages/forum/forum.vue:589", `获取帖子${post.id}回复数量失败:`, error);
                  }
                  return {
                    id: post.id,
                    reply_count: 0
                  };
                }
              })
            );
            batchResults.forEach((result) => {
              const postIndex = this.posts.findIndex((p) => p.id === result.id);
              if (postIndex !== -1) {
                this.$set(this.posts[postIndex], "reply_count", result.reply_count);
              }
            });
            if (i + batchSize < posts.length) {
              await new Promise((resolve) => setTimeout(resolve, 300));
            }
          } catch (error) {
            if (this.debugMode) {
              common_vendor.index.__f__("error", "at pages/forum/forum.vue:615", `批量更新回复数量失败:`, error);
            }
          }
        }
      } finally {
        this.isLoadingReplies = false;
      }
    },
    // 搜索
    search() {
      this.page = 1;
      this.loadPosts(true);
    },
    // 切换分类
    switchCategory(category) {
      this.currentCategory = category;
      const categoryNum = Number(category);
      const isTopLevelCategory = this.categories.some((c) => Number(c.id) === categoryNum && c.level === 1);
      if (isTopLevelCategory) {
        if ([200, 300].includes(categoryNum)) {
          this.showCategoryTabs = false;
        } else {
          this.showCategoryTabs = true;
        }
      } else {
        this.showCategoryTabs = false;
      }
      this.page = 1;
      this.loadPosts(true);
    },
    // 初始化默认分类
    initDefaultCategory() {
      const topLevelCategories = this.categories.filter((c) => c.level === 1);
      if (topLevelCategories.length > 0) {
        this.currentCategory = topLevelCategories[0].id;
        this.switchCategory(this.currentCategory);
      }
    },
    // 切换子分类
    toggleSubCategory(categoryId) {
      const category = this.categories.find((c) => c.id === categoryId);
      const numCategoryId = category ? Number(category.next_category_id) : Number(categoryId);
      const index = this.selectedSubCategories.indexOf(numCategoryId);
      if (index === -1) {
        this.selectedSubCategories.push(numCategoryId);
      } else {
        this.selectedSubCategories.splice(index, 1);
      }
      this.page = 1;
      this.loadPosts(true);
    },
    // 清空子分类筛选
    clearSubCategories() {
      this.selectedSubCategories = [];
      this.page = 1;
      this.loadPosts(true);
    },
    // 下拉刷新
    onRefresh() {
      this.isRefreshing = true;
      this.loadPosts(true);
    },
    // 加载更多
    loadMore() {
      if (this.loading || !this.hasMore)
        return;
      if (this.loadMoreTimer) {
        clearTimeout(this.loadMoreTimer);
      }
      this.loadMoreTimer = setTimeout(() => {
        this.loadPosts();
      }, 300);
    },
    // 跳转到详情页
    goToDetail(post) {
      common_vendor.index.navigateTo({
        url: `/pages/forum/details/forum_detail?id=${post.id}`
      });
    },
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 跳转到发帖页
    goToPost() {
      common_vendor.index.navigateTo({
        url: "/pages/forum/post"
      });
    },
    // 切换快速菜单
    toggleQuickMenu() {
      this.showQuickMenu = !this.showQuickMenu;
    },
    // 隐藏快速菜单
    hideQuickMenu() {
      this.showQuickMenu = false;
    },
    // 跳转到提问页
    goToAsk() {
      this.hideQuickMenu();
      common_vendor.index.navigateTo({
        url: "/pages/forum/post?type=ask"
      });
    },
    // 跳转到分享资源页
    goToShare() {
      this.hideQuickMenu();
      common_vendor.index.navigateTo({
        url: "/pages/forum/post?type=share"
      });
    },
    // 获取分类名称
    getCategoryName(categoryId) {
      const category = this.categories.find((c) => Number(c.next_category_id) === Number(categoryId));
      if (!category) {
        return "其他";
      }
      if (category.level === 1) {
        return category.name;
      }
      const parentCategory = this.categories.find((c) => Number(c.id) === Number(category.parent_id));
      if (parentCategory) {
        return `${parentCategory.name}-${category.name}`;
      }
      return category.name || "其他";
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
    a: common_vendor.o((...args) => $options.toggleDebugMode && $options.toggleDebugMode(...args), "fa"),
    b: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    d: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    e: common_vendor.o((...args) => $options.search && $options.search(...args), "10"),
    f: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    g: $data.keyword,
    h: common_vendor.o(($event) => $data.keyword = $event.detail.value, "09"),
    i: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)",
    j: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    k: common_vendor.f($data.categories.filter((c) => c.level === 1), (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: $data.currentCategory === category.id || $data.currentCategory === "all" && $data.categories.filter((c) => c.level === 1).indexOf(category) === 0 ? 1 : "",
        d: common_vendor.o(($event) => $options.switchCategory(category.id), category.id)
      };
    }),
    l: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)",
    m: $data.showCategoryTabs && $options.subCategoryList.length > 0
  }, $data.showCategoryTabs && $options.subCategoryList.length > 0 ? {
    n: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    o: $data.selectedSubCategories.length === 0 ? 1 : "",
    p: common_vendor.o((...args) => $options.clearSubCategories && $options.clearSubCategories(...args), "71"),
    q: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)",
    r: common_vendor.f($options.subCategoryList, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: $data.selectedSubCategories.includes(Number(category.next_category_id || category.id)) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleSubCategory(category.id), category.id)
      };
    }),
    s: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)"
  } : {}, {
    t: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    v: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    w: common_vendor.f($data.posts, (post, k0, i0) => {
      return common_vendor.e({
        a: $options.isValidAvatar(post.user_avatar) ? "data:image/" + (post.user_avatar_format === "jpg" ? "jpeg" : post.user_avatar_format || "jpeg") + ";base64," + $options.decodeHtmlEntities(post.user_avatar.replace(/\s+/g, "")) : "/static/default-avatar.png",
        b: common_vendor.t(post.user_id),
        c: common_vendor.t(post.title || post.content),
        d: post.content.length > 100
      }, post.content.length > 100 ? {
        e: common_vendor.t(post.content.substring(0, 100)),
        f: _ctx.isDarkMode ? "#999" : "#6C757D"
      } : post.content !== post.title ? {
        h: common_vendor.t(post.content),
        i: _ctx.isDarkMode ? "#999" : "#6C757D"
      } : {}, {
        g: post.content !== post.title,
        j: common_vendor.t($options.getCategoryName(post.category_id)),
        k: common_vendor.t(post.reply_count || 0),
        l: common_vendor.t(post.view_count || 0),
        m: common_vendor.t(post.like_count || 0),
        n: common_vendor.t($options.formatTime(post.created_at)),
        o: post.last_reply_time
      }, post.last_reply_time ? {
        p: common_vendor.t($options.formatTime(post.last_reply_time)),
        q: _ctx.isDarkMode ? "#999" : "#999999"
      } : {}, {
        r: post.id,
        s: common_vendor.o(($event) => $options.goToDetail(post), post.id)
      });
    }),
    x: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    y: _ctx.isDarkMode ? "rgba(79, 172, 254, 0.2)" : "rgba(79, 172, 254, 0.1)",
    z: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    A: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #E6F0FF, #F0F4FF)",
    B: _ctx.isDarkMode ? "#999" : "#6C757D",
    C: _ctx.isDarkMode ? "#999" : "#6C757D",
    D: _ctx.isDarkMode ? "#999" : "#6C757D",
    E: _ctx.isDarkMode ? "1px solid #404040" : "1px solid #E6F0FF",
    F: _ctx.isDarkMode ? "#999" : "#999999",
    G: _ctx.isDarkMode ? "#2c2c2c" : "linear-gradient(135deg, #ffffff, #f8faff)",
    H: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    I: $data.loading
  }, $data.loading ? {
    J: _ctx.isDarkMode ? "#999" : "#999999"
  } : {}, {
    K: !$data.hasMore && $data.posts.length > 0
  }, !$data.hasMore && $data.posts.length > 0 ? {
    L: _ctx.isDarkMode ? "#999" : "#999999"
  } : {}, {
    M: $data.posts.length === 0 && !$data.loading
  }, $data.posts.length === 0 && !$data.loading ? {
    N: _ctx.isDarkMode ? "#999" : "#999999"
  } : {}, {
    O: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args), "91"),
    P: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args), "d3"),
    Q: $data.isRefreshing,
    R: common_vendor.o((...args) => $options.toggleQuickMenu && $options.toggleQuickMenu(...args), "1b"),
    S: $data.showQuickMenu
  }, $data.showQuickMenu ? {
    T: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    U: common_vendor.o((...args) => $options.goToPost && $options.goToPost(...args), "7c"),
    V: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #ffffff, #f8faff)",
    W: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    X: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    Y: common_vendor.o((...args) => $options.goToAsk && $options.goToAsk(...args), "96"),
    Z: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #ffffff, #f8faff)",
    aa: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    ab: _ctx.isDarkMode ? "#ffffff" : "#1E1E1E",
    ac: common_vendor.o((...args) => $options.goToShare && $options.goToShare(...args), "64"),
    ad: _ctx.isDarkMode ? "#3a3a3a" : "linear-gradient(135deg, #ffffff, #f8faff)",
    ae: _ctx.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    af: common_vendor.o(() => {
    }, "51"),
    ag: _ctx.isDarkMode ? "rgba(44, 44, 44, 0.9)" : "linear-gradient(135deg, #ffffff, #f8faff)",
    ah: common_vendor.o((...args) => $options.hideQuickMenu && $options.hideQuickMenu(...args), "c8")
  } : {}, {
    ai: _ctx.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-aeadbf01"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/forum/forum.js.map
