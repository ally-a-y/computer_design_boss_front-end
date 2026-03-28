"use strict";
var common_vendor = require("../../../common/vendor.js");
var common_api_feedback = require("../../../common/api/feedback.js");
require("../../../common/api/request.js");
require("../../../common/config.js");
const _sfc_main = {
  data() {
    return {
      feedbacks: [],
      typeOptions: [],
      typeCodeMap: {},
      typeIndex: 0,
      newFeedback: {
        complaint_type: null,
        description: ""
      },
      page: 1,
      limit: 20
    };
  },
  async onLoad() {
    await this.loadComplaintTypes();
    await this.loadFeedbackList();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    async loadComplaintTypes() {
      try {
        const res = await common_api_feedback.getComplaintTypes();
        console.log("\u8F6C\u6362\u540E\u7684collections:");
        const types = res || [];
        this.typeOptions = types.map((t) => t.type_name);
        types.forEach((t) => {
          this.typeCodeMap[t.type_name] = t.type_code;
        });
        console.log("\u8F6C\u6362\u540E\u7684collections:", this.typeOptions);
        if (types.length > 0) {
          this.newFeedback.complaint_type = types[0].type_code;
        }
      } catch (err) {
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u6295\u8BC9\u7C7B\u578B\u5931\u8D25",
          icon: "none"
        });
      }
    },
    async loadFeedbackList() {
      try {
        const res = await common_api_feedback.getFeedbackList({
          page: this.page,
          limit: this.limit
        });
        console.log("\u8F6C\u6362\u540E\u7684collections:", res);
        const list = res || [];
        console.log("\u8F6C\u6362\u540E\u7684collections:", list);
        this.feedbacks = list.map((item) => ({
          id: item.id,
          type: this.typeOptions[item.complaint_type - 1],
          submitTime: item.create_time,
          status: item.is_resolved === 1 ? "processed" : "pending",
          statusText: item.is_resolved === 1 ? "\u5DF2\u5904\u7406" : "\u5F85\u5904\u7406",
          description: item.description,
          response: item.feedback_content
        }));
      } catch (err) {
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u53CD\u9988\u5217\u8868\u5931\u8D25",
          icon: "none"
        });
      }
    },
    addFeedback() {
      this.newFeedback.description = "";
      this.$refs.addPopup.open();
    },
    closePopup() {
      if (this.$refs.addPopup) {
        this.$refs.addPopup.close();
      }
    },
    onTypeChange(e) {
      this.typeIndex = e.detail.value;
      const typeName = this.typeOptions[this.typeIndex];
      this.newFeedback.complaint_type = this.typeCodeMap[typeName];
    },
    async submitFeedback() {
      if (!this.newFeedback.description.trim()) {
        common_vendor.index.showToast({
          title: "\u8BF7\u8F93\u5165\u6295\u8BC9\u63CF\u8FF0",
          icon: "none"
        });
        return;
      }
      if (this.newFeedback.description.length < 10) {
        common_vendor.index.showToast({
          title: "\u63CF\u8FF0\u4E0D\u80FD\u5C11\u4E8E10\u4E2A\u5B57",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_api_feedback.submitFeedback({
          complaint_type: this.newFeedback.complaint_type,
          description: this.newFeedback.description
        });
        if (res.code === 200) {
          common_vendor.index.showToast({
            title: "\u53CD\u9988\u63D0\u4EA4\u6210\u529F",
            icon: "success"
          });
          this.closePopup();
          await this.loadFeedbackList();
        }
      } catch (err) {
        common_vendor.index.showToast({
          title: err.message || "\u63D0\u4EA4\u5931\u8D25",
          icon: "none"
        });
      }
    }
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
