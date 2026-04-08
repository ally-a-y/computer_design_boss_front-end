"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_forum = require("../../common/api/forum.js");
const _sfc_main = {
  data() {
    return {
      postForm: {
        content: "",
        category_id: "101",
        anonymous: false
      },
      categoryIndex: 0,
      categories: [
        { id: "101", name: "前端开发" },
        { id: "102", name: "后端开发" },
        { id: "103", name: "移动端开发" },
        { id: "104", name: "数据与AI" },
        { id: "105", name: "运维与测试" },
        { id: "106", name: "产品设计" },
        { id: "107", name: "网络安全" },
        { id: "108", name: "嵌入式开发" },
        { id: "200", name: "产品与设计类" },
        { id: "300", name: "技术管理类" }
      ]
    };
  },
  computed: {
    canSubmit() {
      return this.postForm.content.trim().length > 0 && this.postForm.category_id;
    }
  },
  methods: {
    // 选择分类
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value;
      this.postForm.category_id = this.categories[this.categoryIndex].id;
    },
    // 返回
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 提交帖子
    async submitPost() {
      if (!this.canSubmit)
        return;
      try {
        common_vendor.index.__f__("log", "at pages/forum/post.vue:107", "=== 开始发布话题 ===");
        const token = common_vendor.index.getStorageSync("token");
        common_vendor.index.__f__("log", "at pages/forum/post.vue:111", "存储的token:", token);
        let userInfo = common_vendor.index.getStorageSync("userInfo");
        common_vendor.index.__f__("log", "at pages/forum/post.vue:114", "原始userInfo:", userInfo);
        common_vendor.index.__f__("log", "at pages/forum/post.vue:115", "userInfo类型:", typeof userInfo);
        if (typeof userInfo === "string") {
          try {
            userInfo = JSON.parse(userInfo);
            common_vendor.index.__f__("log", "at pages/forum/post.vue:121", "解析后的userInfo:", userInfo);
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/forum/post.vue:123", "解析userInfo失败:", e);
            userInfo = null;
          }
        }
        common_vendor.index.__f__("log", "at pages/forum/post.vue:128", "最终userInfo:", userInfo);
        common_vendor.index.__f__("log", "at pages/forum/post.vue:129", "是否有user_id:", userInfo && userInfo.user_id);
        if (!userInfo || !userInfo.user_id) {
          common_vendor.index.__f__("error", "at pages/forum/post.vue:132", "登录状态检查失败:", { userInfo, hasUserId: userInfo && userInfo.user_id });
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        const postData = {
          category_id: this.postForm.category_id,
          user_id: userInfo.user_id,
          parent_id: "",
          // 一级评论
          content: this.postForm.content.trim(),
          level: 1,
          sort_order: 0
        };
        common_vendor.index.__f__("log", "at pages/forum/post.vue:149", "发布数据:", postData);
        await common_api_forum.forumApi.addComment(postData);
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success",
          success: () => {
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/forum/post.vue:164", "发布失败:", error);
        common_vendor.index.showToast({
          title: `发布失败: ${error.message || "请检查网络连接"}`,
          icon: "none",
          duration: 3e3
        });
      } finally {
        common_vendor.index.__f__("log", "at pages/forum/post.vue:171", "=== 发布话题结束 ===");
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "be"),
    b: $data.postForm.content,
    c: common_vendor.o(($event) => $data.postForm.content = $event.detail.value, "16"),
    d: common_vendor.t($data.postForm.content.length),
    e: common_vendor.t(((_a = $data.categories[$data.categoryIndex]) == null ? void 0 : _a.name) || "请选择分类"),
    f: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args), "d5"),
    g: $data.categoryIndex,
    h: $data.categories,
    i: $data.postForm.anonymous,
    j: common_vendor.o(($event) => $data.postForm.anonymous = !$data.postForm.anonymous, "a0"),
    k: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "e4"),
    l: common_vendor.o((...args) => $options.submitPost && $options.submitPost(...args), "f2"),
    m: !$options.canSubmit
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3ffb5f08"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/forum/post.js.map
