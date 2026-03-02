"use strict";
var common_vendor = require("../../common/vendor.js");
var common_api_forum = require("../../common/api/forum.js");
require("../../common/api/request.js");
require("../../common/config.js");
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
        { id: "101", name: "\u524D\u7AEF\u5F00\u53D1" },
        { id: "102", name: "\u540E\u7AEF\u5F00\u53D1" },
        { id: "103", name: "\u79FB\u52A8\u7AEF\u5F00\u53D1" },
        { id: "104", name: "\u6570\u636E\u4E0EAI" },
        { id: "105", name: "\u8FD0\u7EF4\u4E0E\u6D4B\u8BD5" },
        { id: "106", name: "\u4EA7\u54C1\u8BBE\u8BA1" },
        { id: "107", name: "\u7F51\u7EDC\u5B89\u5168" },
        { id: "108", name: "\u5D4C\u5165\u5F0F\u5F00\u53D1" },
        { id: "200", name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1\u7C7B" },
        { id: "300", name: "\u6280\u672F\u7BA1\u7406\u7C7B" }
      ]
    };
  },
  computed: {
    canSubmit() {
      return this.postForm.content.trim().length > 0 && this.postForm.category_id;
    }
  },
  methods: {
    onCategoryChange(e) {
      this.categoryIndex = e.detail.value;
      this.postForm.category_id = this.categories[this.categoryIndex].id;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    async submitPost() {
      if (!this.canSubmit)
        return;
      try {
        console.log("=== \u5F00\u59CB\u53D1\u5E03\u8BDD\u9898 ===");
        const token = common_vendor.index.getStorageSync("token");
        console.log("\u5B58\u50A8\u7684token:", token);
        let userInfo = common_vendor.index.getStorageSync("userInfo");
        console.log("\u539F\u59CBuserInfo:", userInfo);
        console.log("userInfo\u7C7B\u578B:", typeof userInfo);
        if (typeof userInfo === "string") {
          try {
            userInfo = JSON.parse(userInfo);
            console.log("\u89E3\u6790\u540E\u7684userInfo:", userInfo);
          } catch (e) {
            console.error("\u89E3\u6790userInfo\u5931\u8D25:", e);
            userInfo = null;
          }
        }
        console.log("\u6700\u7EC8userInfo:", userInfo);
        console.log("\u662F\u5426\u6709user_id:", userInfo && userInfo.user_id);
        if (!userInfo || !userInfo.user_id) {
          console.error("\u767B\u5F55\u72B6\u6001\u68C0\u67E5\u5931\u8D25:", { userInfo, hasUserId: userInfo && userInfo.user_id });
          common_vendor.index.showToast({
            title: "\u8BF7\u5148\u767B\u5F55",
            icon: "none"
          });
          return;
        }
        const postData = {
          category_id: this.postForm.category_id,
          user_id: userInfo.user_id,
          parent_id: "",
          content: this.postForm.content.trim(),
          level: 1,
          sort_order: 0
        };
        console.log("\u53D1\u5E03\u6570\u636E:", postData);
        await common_api_forum.forumApi.addComment(postData);
        common_vendor.index.showToast({
          title: "\u53D1\u5E03\u6210\u529F",
          icon: "success",
          success: () => {
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          }
        });
      } catch (error) {
        console.error("\u53D1\u5E03\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: `\u53D1\u5E03\u5931\u8D25: ${error.message || "\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5"}`,
          icon: "none",
          duration: 3e3
        });
      } finally {
        console.log("=== \u53D1\u5E03\u8BDD\u9898\u7ED3\u675F ===");
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return {
    a: $data.postForm.content,
    b: common_vendor.o(($event) => $data.postForm.content = $event.detail.value),
    c: common_vendor.t($data.postForm.content.length),
    d: common_vendor.t(((_a = $data.categories[$data.categoryIndex]) == null ? void 0 : _a.name) || "\u8BF7\u9009\u62E9\u5206\u7C7B"),
    e: common_vendor.o((...args) => $options.onCategoryChange && $options.onCategoryChange(...args)),
    f: $data.categoryIndex,
    g: $data.categories,
    h: $data.postForm.anonymous,
    i: common_vendor.o(($event) => $data.postForm.anonymous = !$data.postForm.anonymous),
    j: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    k: common_vendor.o((...args) => $options.submitPost && $options.submitPost(...args)),
    l: !$options.canSubmit
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3af6e9f2"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/forum/post.vue"]]);
wx.createPage(MiniProgramPage);
