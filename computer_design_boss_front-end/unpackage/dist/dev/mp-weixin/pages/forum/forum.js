"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var common_vendor = require("../../common/vendor.js");
var common_api_forum = require("../../common/api/forum.js");
require("../../common/api/request.js");
require("../../common/config.js");
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
      userInfo: null,
      userPostCount: 0,
      loadMoreTimer: null,
      isLoadingReplies: false,
      debugMode: false,
      categories: [
        { id: "100", name: "\u6280\u672F\u5F00\u53D1\u7C7B", parent_id: null, level: 1, next_category_id: 100 },
        { id: "101", name: "\u524D\u7AEF\u5F00\u53D1", parent_id: 100, level: 2, next_category_id: 101 },
        { id: "102", name: "\u540E\u7AEF\u5F00\u53D1", parent_id: 100, level: 2, next_category_id: 102 },
        { id: "103", name: "\u79FB\u52A8\u7AEF\u5F00\u53D1", parent_id: 100, level: 2, next_category_id: 103 },
        { id: "104", name: "\u6570\u636E\u4E0EAI", parent_id: 100, level: 2, next_category_id: 104 },
        { id: "105", name: "\u8FD0\u7EF4\u4E0E\u6D4B\u8BD5", parent_id: 100, level: 2, next_category_id: 105 },
        { id: "106", name: "\u4EA7\u54C1\u8BBE\u8BA1", parent_id: 100, level: 2, next_category_id: 106 },
        { id: "107", name: "\u7F51\u7EDC\u5B89\u5168", parent_id: 100, level: 2, next_category_id: 107 },
        { id: "108", name: "\u5D4C\u5165\u5F0F\u5F00\u53D1", parent_id: 100, level: 2, next_category_id: 108 },
        { id: "200", name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1\u7C7B", parent_id: null, level: 1, next_category_id: 200 },
        { id: "300", name: "\u6280\u672F\u7BA1\u7406\u7C7B", parent_id: null, level: 1, next_category_id: 300 }
      ],
      showCategoryTabs: false,
      selectedSubCategories: [],
      categoryMap: {
        "101": "\u524D\u7AEF",
        "102": "\u540E\u7AEF",
        "103": "\u79FB\u52A8\u7AEF",
        "104": "\u6570\u636E\u4E0EAI",
        "105": "\u8FD0\u7EF4\u4E0E\u6D4B\u8BD5",
        "106": "\u4EA7\u54C1\u8BBE\u8BA1",
        "107": "\u7F51\u7EDC\u5B89\u5168",
        "108": "\u5D4C\u5165\u5F0F",
        "200": "\u4EA7\u54C1\u8BBE\u8BA1",
        "300": "\u6280\u672F\u7BA1\u7406"
      }
    };
  },
  onLoad() {
    this.loadUserInfo();
    this.loadUserPostCount();
    this.loadPosts();
  },
  onShow() {
    this.loadUserInfo();
    this.loadPosts(true);
  },
  onUnload() {
    if (this.loadMoreTimer) {
      clearTimeout(this.loadMoreTimer);
    }
  },
  toggleDebugMode() {
    this.debugMode = !this.debugMode;
    common_vendor.index.showToast({
      title: this.debugMode ? "\u8C03\u8BD5\u6A21\u5F0F\u5DF2\u5F00\u542F" : "\u8C03\u8BD5\u6A21\u5F0F\u5DF2\u5173\u95ED",
      icon: "none",
      duration: 2e3
    });
  },
  methods: {
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
        if (this.currentCategory === "all") {
          res = await common_api_forum.forumApi.getAllFirstComments();
        } else if (isTopLevelCategory) {
          res = await common_api_forum.forumApi.getAllFirstComments();
        } else {
          try {
            res = await common_api_forum.forumApi.getCommentsByCategory(this.currentCategory);
            if (!res || res.length === 0) {
              res = await common_api_forum.forumApi.getAllFirstComments();
            }
          } catch (error) {
            if (this.debugMode) {
              console.log("\u5206\u7C7B\u67E5\u8BE2\u5931\u8D25\uFF0C\u4F7F\u7528\u6240\u6709\u6570\u636E:", error);
            }
            res = await common_api_forum.forumApi.getAllFirstComments();
          }
        }
        if (this.debugMode) {
          console.log("\u8BBA\u575B\u6570\u636E:", res);
          console.log("\u5F53\u524D\u5206\u7C7B:", this.currentCategory);
          console.log("\u662F\u5426\u4E00\u7EA7\u5206\u7C7B:", isTopLevelCategory);
          console.log("\u6240\u6709\u5206\u7C7B:", this.categories);
        }
        if (res === null) {
          res = [];
        }
        if (res && res.length > 0 && this.debugMode) {
          console.log("\u7B2C\u4E00\u6761\u6570\u636E\u793A\u4F8B:", res[0]);
          console.log("\u6570\u636E\u5B57\u6BB5\u9A8C\u8BC1:", {
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
                console.log("200/300\u5206\u7C7B\u76F4\u63A5\u4F7F\u7528:", targetCategoryIds);
              }
            } else {
              targetCategoryIds = this.categories.filter((c) => c.parent_id && (c.parent_id.toString() === this.currentCategory || c.parent_id === currentCategoryNum)).map((c) => parseInt(c.next_category_id));
              if (this.debugMode) {
                console.log("\u5B50\u5206\u7C7BID\u5217\u8868:", targetCategoryIds);
              }
            }
            filteredPosts = filteredPosts.filter((post) => {
              if (!post || post.category_id === null) {
                return false;
              }
              const postCategoryId = post.category_id;
              const isMatch = targetCategoryIds.includes(postCategoryId);
              if (this.debugMode) {
                console.log(`\u5E16\u5B50${post.id}\u7684\u5206\u7C7B${postCategoryId}\u662F\u5426\u5339\u914D:`, isMatch);
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
          let postsWithReplyCount = filteredPosts.map((post) => __spreadProps(__spreadValues({}, post), {
            reply_count: 0
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
        console.error("\u52A0\u8F7D\u5E16\u5B50\u5931\u8D25:", error);
        console.error("\u9519\u8BEF\u8BE6\u60C5:", error.message, error.stack);
        common_vendor.index.showToast({
          title: "\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
          icon: "none"
        });
      } finally {
        this.loading = false;
        this.isRefreshing = false;
      }
    },
    async updateReplyCounts(posts) {
      if (!posts || posts.length === 0 || this.isLoadingReplies)
        return;
      this.isLoadingReplies = true;
      try {
        const batchSize = 3;
        for (let i = 0; i < posts.length; i += batchSize) {
          const batch = posts.slice(i, i + batchSize);
          try {
            const batchResults = await Promise.all(batch.map(async (post) => {
              try {
                const replies = await common_api_forum.forumApi.getCommentReplies(post.id);
                return {
                  id: post.id,
                  reply_count: replies && replies.length ? replies.length : 0
                };
              } catch (error) {
                if (this.debugMode) {
                  console.error(`\u83B7\u53D6\u5E16\u5B50${post.id}\u56DE\u590D\u6570\u91CF\u5931\u8D25:`, error);
                }
                return {
                  id: post.id,
                  reply_count: 0
                };
              }
            }));
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
              console.error(`\u6279\u91CF\u66F4\u65B0\u56DE\u590D\u6570\u91CF\u5931\u8D25:`, error);
            }
          }
        }
      } finally {
        this.isLoadingReplies = false;
      }
    },
    search() {
      this.page = 1;
      this.loadPosts(true);
    },
    switchCategory(category) {
      var _a;
      this.currentCategory = category;
      const categoryNum = Number(category);
      const isTopLevelCategory = this.categories.some((c) => Number(c.id) === categoryNum && c.level === 1);
      if (isTopLevelCategory) {
        this.showCategoryTabs = true;
        this.subCategoryList = this.categories.filter((c) => {
          if ([200, 300].includes(categoryNum)) {
            return false;
          }
          return c.parent_id && (c.parent_id.toString() === category || c.parent_id === categoryNum);
        });
        if ([200, 300].includes(categoryNum)) {
          this.subCategoryList = [{
            id: category,
            name: ((_a = this.categories.find((c) => c.id === category)) == null ? void 0 : _a.name) || category
          }];
        }
      } else {
        this.showCategoryTabs = false;
      }
      this.page = 1;
      this.loadPosts(true);
    },
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
    clearSubCategories() {
      this.selectedSubCategories = [];
      this.page = 1;
      this.loadPosts(true);
    },
    onRefresh() {
      this.isRefreshing = true;
      this.loadPosts(true);
    },
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
    goToDetail(post) {
      common_vendor.index.navigateTo({
        url: `/pages/forum/details/forum_detail?id=${post.id}`
      });
    },
    goToPost() {
      common_vendor.index.navigateTo({
        url: "/pages/forum/post"
      });
    },
    toggleQuickMenu() {
      this.showQuickMenu = !this.showQuickMenu;
    },
    hideQuickMenu() {
      this.showQuickMenu = false;
    },
    goToAsk() {
      this.hideQuickMenu();
      common_vendor.index.navigateTo({
        url: "/pages/forum/post?type=ask"
      });
    },
    goToShare() {
      this.hideQuickMenu();
      common_vendor.index.navigateTo({
        url: "/pages/forum/post?type=share"
      });
    },
    loadUserInfo() {
      let userInfo = common_vendor.index.getStorageSync("userInfo");
      if (typeof userInfo === "string") {
        try {
          userInfo = JSON.parse(userInfo);
        } catch (e) {
          userInfo = null;
        }
      }
      this.userInfo = userInfo;
    },
    async loadUserPostCount() {
      if (!this.userInfo)
        return;
      try {
        this.userPostCount = 0;
      } catch (error) {
        console.error("\u52A0\u8F7D\u7528\u6237\u53D1\u5E16\u6570\u5931\u8D25:", error);
      }
    },
    getCategoryName(categoryId) {
      const category = this.categories.find((c) => Number(c.next_category_id) === Number(categoryId));
      if (!category) {
        return "\u5176\u4ED6";
      }
      if (category.level === 1) {
        return category.name;
      }
      const parentCategory = this.categories.find((c) => Number(c.id) === Number(category.parent_id));
      if (parentCategory) {
        return `${parentCategory.name}-${category.name}`;
      }
      return category.name || "\u5176\u4ED6";
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
    a: common_vendor.o((...args) => _ctx.toggleDebugMode && _ctx.toggleDebugMode(...args)),
    b: common_vendor.o((...args) => $options.search && $options.search(...args)),
    c: $data.keyword,
    d: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    e: common_vendor.o((...args) => $options.search && $options.search(...args)),
    f: $data.currentCategory === "all" ? 1 : "",
    g: common_vendor.o(($event) => $options.switchCategory("all")),
    h: common_vendor.f($data.categories.filter((c) => c.level === 1), (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: $data.currentCategory === category.id ? 1 : "",
        d: common_vendor.o(($event) => $options.switchCategory(category.id), category.id)
      };
    }),
    i: $data.showCategoryTabs && _ctx.subCategoryList.length > 0
  }, $data.showCategoryTabs && _ctx.subCategoryList.length > 0 ? {
    j: $data.selectedSubCategories.length === 0 ? 1 : "",
    k: common_vendor.o((...args) => $options.clearSubCategories && $options.clearSubCategories(...args)),
    l: common_vendor.f(_ctx.subCategoryList, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: $data.selectedSubCategories.includes(Number(category.next_category_id || category.id)) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleSubCategory(category.id), category.id)
      };
    })
  } : {}, {
    m: common_vendor.f($data.posts, (post, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(post.user_id),
        b: common_vendor.t(post.title || post.content),
        c: post.content.length > 100
      }, post.content.length > 100 ? {
        d: common_vendor.t(post.content.substring(0, 100))
      } : post.content !== post.title ? {
        f: common_vendor.t(post.content)
      } : {}, {
        e: post.content !== post.title,
        g: common_vendor.t($options.getCategoryName(post.category_id)),
        h: common_vendor.t(post.reply_count || 0),
        i: common_vendor.t(post.view_count || 0),
        j: common_vendor.t(post.like_count || 0),
        k: common_vendor.t($options.formatTime(post.created_at)),
        l: post.last_reply_time
      }, post.last_reply_time ? {
        m: common_vendor.t($options.formatTime(post.last_reply_time))
      } : {}, {
        n: post.id,
        o: common_vendor.o(($event) => $options.goToDetail(post), post.id)
      });
    }),
    n: $data.loading
  }, $data.loading ? {} : {}, {
    o: !$data.hasMore && $data.posts.length > 0
  }, !$data.hasMore && $data.posts.length > 0 ? {} : {}, {
    p: $data.posts.length === 0 && !$data.loading
  }, $data.posts.length === 0 && !$data.loading ? {} : {}, {
    q: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    r: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    s: $data.isRefreshing,
    t: common_vendor.o((...args) => $options.toggleQuickMenu && $options.toggleQuickMenu(...args)),
    v: $data.showQuickMenu
  }, $data.showQuickMenu ? {
    w: common_vendor.o((...args) => $options.goToPost && $options.goToPost(...args)),
    x: common_vendor.o((...args) => $options.goToAsk && $options.goToAsk(...args)),
    y: common_vendor.o((...args) => $options.goToShare && $options.goToShare(...args)),
    z: common_vendor.o(() => {
    }),
    A: common_vendor.o((...args) => $options.hideQuickMenu && $options.hideQuickMenu(...args))
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7386314a"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/forum/forum.vue"]]);
wx.createPage(MiniProgramPage);
