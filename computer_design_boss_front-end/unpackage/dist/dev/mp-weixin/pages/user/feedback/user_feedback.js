"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      feedbacks: [
        {
          type: "\u8D26\u53F7\u95EE\u9898",
          submitTime: "2024-01-15 14:30",
          status: "pending",
          statusText: "\u5F85\u5904\u7406",
          description: "\u767B\u5F55\u8D26\u53F7\u9047\u5230\u95EE\u9898\uFF0C\u65E0\u6CD5\u6B63\u5E38\u767B\u5F55"
        },
        {
          type: "\u804C\u4F4D\u4FE1\u606F\u9519\u8BEF",
          submitTime: "2024-01-16 10:20",
          status: "processed",
          statusText: "\u5DF2\u5904\u7406",
          description: "\u67D0\u804C\u4F4D\u7684\u85AA\u8D44\u4FE1\u606F\u663E\u793A\u9519\u8BEF",
          response: "\u5DF2\u6838\u5B9E\u5E76\u4FEE\u6B63\u8BE5\u804C\u4F4D\u7684\u85AA\u8D44\u4FE1\u606F\uFF0C\u611F\u8C22\u60A8\u7684\u53CD\u9988"
        }
      ],
      typeOptions: ["\u8D26\u53F7\u95EE\u9898", "\u804C\u4F4D\u4FE1\u606F\u9519\u8BEF", "\u5E73\u53F0\u529F\u80FD\u95EE\u9898", "\u5176\u4ED6"],
      typeIndex: 0,
      newFeedback: {
        type: "",
        description: ""
      }
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    addFeedback() {
      this.newFeedback = {
        type: this.typeOptions[this.typeIndex],
        description: ""
      };
      this.$refs.addPopup.open();
    },
    closePopup() {
      this.$refs.addPopup.close();
    },
    onTypeChange(e) {
      this.typeIndex = e.detail.value;
      this.newFeedback.type = this.typeOptions[this.typeIndex];
    },
    submitFeedback() {
      if (!this.newFeedback.description.trim()) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u6295\u8BC9\u63CF\u8FF0",
          icon: "none"
        });
        return;
      }
      const feedback = {
        type: this.newFeedback.type,
        submitTime: new Date().toLocaleString(),
        status: "pending",
        statusText: "\u5F85\u5904\u7406",
        description: this.newFeedback.description
      };
      this.feedbacks.unshift(feedback);
      this.closePopup();
      common_vendor.index.showToast({
        title: "\u53CD\u9988\u63D0\u4EA4\u6210\u529F",
        icon: "success"
      });
    }
  },
  onLoad() {
    const savedFeedbacks = common_vendor.index.getStorageSync("feedbacks");
    if (savedFeedbacks) {
      this.feedbacks = savedFeedbacks;
    }
  },
  onUnload() {
    common_vendor.index.setStorageSync("feedbacks", this.feedbacks);
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _component_uni_popup = common_vendor.resolveComponent("uni-popup");
  (_component_uni_icons + _component_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.o((...args) => $options.addFeedback && $options.addFeedback(...args)),
    c: common_vendor.f($data.feedbacks, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.type),
        b: common_vendor.t(item.submitTime),
        c: common_vendor.t(item.statusText),
        d: common_vendor.n(item.status),
        e: common_vendor.t(item.description),
        f: item.response
      }, item.response ? {
        g: common_vendor.t(item.response)
      } : {}, {
        h: index
      });
    }),
    d: $data.feedbacks.length === 0
  }, $data.feedbacks.length === 0 ? {
    e: common_vendor.p({
      type: "chatbubble",
      size: "80",
      color: "#ccc"
    })
  } : {}, {
    f: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args)),
    g: common_vendor.t($data.typeOptions[$data.typeIndex]),
    h: common_vendor.o((...args) => $options.onTypeChange && $options.onTypeChange(...args)),
    i: $data.typeIndex,
    j: $data.typeOptions,
    k: $data.newFeedback.description,
    l: common_vendor.o(($event) => $data.newFeedback.description = $event.detail.value),
    m: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args)),
    n: common_vendor.sr("addPopup", "6551b80e-1"),
    o: common_vendor.p({
      type: "bottom"
    })
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/feedback/user_feedback.vue"]]);
wx.createPage(MiniProgramPage);
