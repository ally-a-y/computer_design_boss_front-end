"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_forum = require("../../common/api/forum.js");
const common_utils_themeSimple = require("../../common/utils/theme-simple.js");
const _sfc_main = {
  data() {
    return {
      keyword: "",
      currentCategory: "all",
      posts: [],
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
      },
      // 主题相关
      currentTheme: "light",
      isDarkMode: false
    };
  },
  onLoad() {
    this.initDefaultCategory();
    this.initTheme();
  },
  onShow() {
    this.loadPosts(true);
  },
  onUnload() {
    if (this.loadMoreTimer) {
      clearTimeout(this.loadMoreTimer);
    }
    common_vendor.index.$off("globalThemeChange", this.handleGlobalThemeChange);
  },
  // 切换调试模式 - 长按标题5次开启/关闭
  toggleDebugMode() {
    this.debugMode = !this.debugMode;
    common_vendor.index.showToast({
      title: this.debugMode ? "调试模式已开启" : "调试模式已关闭",
      icon: "none",
      duration: 2e3
    });
  },
  methods: {
    /**
     * 初始化主题
     */
    initTheme() {
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    /**
     * 处理全局主题变化
     */
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme;
      this.isDarkMode = data.isDark;
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
        if (this.debugMode) {
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:268", "论坛数据:", res);
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:269", "当前分类:", this.currentCategory);
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:270", "是否一级分类:", isTopLevelCategory);
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:271", "所有分类:", this.categories);
        }
        if (res === null) {
          res = [];
        }
        if (res && res.length > 0 && this.debugMode) {
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:281", "第一条数据示例:", res[0]);
          common_vendor.index.__f__("log", "at pages/forum/forum.vue:282", "数据字段验证:", {
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
                common_vendor.index.__f__("log", "at pages/forum/forum.vue:307", "200/300分类直接使用:", targetCategoryIds);
              }
            } else {
              targetCategoryIds = this.categories.filter((c) => c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum)).map((c) => parseInt(c.next_category_id));
              if (this.debugMode) {
                common_vendor.index.__f__("log", "at pages/forum/forum.vue:316", "子分类ID列表:", targetCategoryIds);
              }
            }
            filteredPosts = filteredPosts.filter((post) => {
              if (!post || post.category_id === null) {
                return false;
              }
              const postCategoryId = post.category_id;
              const isMatch = targetCategoryIds.includes(postCategoryId);
              if (this.debugMode) {
                common_vendor.index.__f__("log", "at pages/forum/forum.vue:330", `帖子${post.id}的分类${postCategoryId}是否匹配:`, isMatch);
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
        common_vendor.index.__f__("error", "at pages/forum/forum.vue:407", "加载帖子失败:", error);
        common_vendor.index.__f__("error", "at pages/forum/forum.vue:408", "错误详情:", error.message, error.stack);
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
                    common_vendor.index.__f__("error", "at pages/forum/forum.vue:443", `获取帖子${post.id}回复数量失败:`, error);
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
              common_vendor.index.__f__("error", "at pages/forum/forum.vue:469", `批量更新回复数量失败:`, error);
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
          this.subCategoryList = this.categories.filter((c) => {
            return c.parent_id && (c.parent_id.toString() === category || c.parent_id === categoryNum);
          });
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
    a: common_vendor.o((...args) => _ctx.toggleDebugMode && _ctx.toggleDebugMode(...args)),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    d: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    e: common_vendor.o((...args) => $options.search && $options.search(...args)),
    f: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    g: $data.keyword,
    h: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    i: $data.isDarkMode ? "#3a3a3a" : "#F2F5F9",
    j: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    k: common_vendor.f($data.categories.filter((c) => c.level === 1), (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: $data.currentCategory === category.id || $data.currentCategory === "all" && $data.categories.filter((c) => c.level === 1).indexOf(category) === 0 ? 1 : "",
        d: common_vendor.o(($event) => $options.switchCategory(category.id), category.id)
      };
    }),
    l: $data.isDarkMode ? "#3a3a3a" : "#F0F4FF",
    m: $data.showCategoryTabs && _ctx.subCategoryList.length > 0
  }, $data.showCategoryTabs && _ctx.subCategoryList.length > 0 ? {
    n: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    o: $data.selectedSubCategories.length === 0 ? 1 : "",
    p: common_vendor.o((...args) => $options.clearSubCategories && $options.clearSubCategories(...args)),
    q: $data.isDarkMode ? "#3a3a3a" : "#F0F4FF",
    r: common_vendor.f(_ctx.subCategoryList, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: $data.selectedSubCategories.includes(Number(category.next_category_id || category.id)) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleSubCategory(category.id), category.id)
      };
    }),
    s: $data.isDarkMode ? "#3a3a3a" : "#F0F4FF"
  } : {}, {
    t: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    v: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    w: common_vendor.f($data.posts, (post, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(post.user_id),
        b: common_vendor.t(post.title || post.content),
        c: post.content.length > 100
      }, post.content.length > 100 ? {
        d: common_vendor.t(post.content.substring(0, 100)),
        e: $data.isDarkMode ? "#999" : "#6C757D"
      } : post.content !== post.title ? {
        g: common_vendor.t(post.content),
        h: $data.isDarkMode ? "#999" : "#6C757D"
      } : {}, {
        f: post.content !== post.title,
        i: common_vendor.t($options.getCategoryName(post.category_id)),
        j: common_vendor.t(post.reply_count || 0),
        k: common_vendor.t(post.view_count || 0),
        l: common_vendor.t(post.like_count || 0),
        m: common_vendor.t($options.formatTime(post.created_at)),
        n: post.last_reply_time
      }, post.last_reply_time ? {
        o: common_vendor.t($options.formatTime(post.last_reply_time)),
        p: $data.isDarkMode ? "#999" : "#999999"
      } : {}, {
        q: post.id,
        r: common_vendor.o(($event) => $options.goToDetail(post), post.id)
      });
    }),
    x: $data.isDarkMode ? "#999" : "#666666",
    y: $data.isDarkMode ? "#3a3a3a" : "#f0f0f0",
    z: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    A: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    B: $data.isDarkMode ? "#3a3a3a" : "#F0F4FF",
    C: $data.isDarkMode ? "#999" : "#6C757D",
    D: $data.isDarkMode ? "#999" : "#6C757D",
    E: $data.isDarkMode ? "#999" : "#6C757D",
    F: $data.isDarkMode ? "1px solid #404040" : "1px solid #f0f0f0",
    G: $data.isDarkMode ? "#999" : "#999999",
    H: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    I: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    J: $data.loading
  }, $data.loading ? {
    K: $data.isDarkMode ? "#999" : "#999999"
  } : {}, {
    L: !$data.hasMore && $data.posts.length > 0
  }, !$data.hasMore && $data.posts.length > 0 ? {
    M: $data.isDarkMode ? "#999" : "#999999"
  } : {}, {
    N: $data.posts.length === 0 && !$data.loading
  }, $data.posts.length === 0 && !$data.loading ? {
    O: $data.isDarkMode ? "#999" : "#999999"
  } : {}, {
    P: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    Q: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    R: $data.isRefreshing,
    S: common_vendor.o((...args) => $options.toggleQuickMenu && $options.toggleQuickMenu(...args)),
    T: $data.showQuickMenu
  }, $data.showQuickMenu ? {
    U: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    V: common_vendor.o((...args) => $options.goToPost && $options.goToPost(...args)),
    W: $data.isDarkMode ? "#3a3a3a" : "#ffffff",
    X: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    Y: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    Z: common_vendor.o((...args) => $options.goToAsk && $options.goToAsk(...args)),
    aa: $data.isDarkMode ? "#3a3a3a" : "#ffffff",
    ab: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    ac: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    ad: common_vendor.o((...args) => $options.goToShare && $options.goToShare(...args)),
    ae: $data.isDarkMode ? "#3a3a3a" : "#ffffff",
    af: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.05)",
    ag: common_vendor.o(() => {
    }),
    ah: $data.isDarkMode ? "#2c2c2c" : "#ffffff",
    ai: common_vendor.o((...args) => $options.hideQuickMenu && $options.hideQuickMenu(...args))
  } : {}, {
    aj: $data.isDarkMode ? "#1a1a1a" : "#F8FAFD"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-aeadbf01"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/forum/forum.js.map
