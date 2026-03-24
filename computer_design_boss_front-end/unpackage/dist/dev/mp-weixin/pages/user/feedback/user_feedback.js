"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_feedback = require("../../../common/api/feedback.js");
const _sfc_main = {
  data() {
    return {
      feedbacks: [],
      typeOptions: [],
      typeCodeMap: {},
      // 保存 type_name -> type_code 映射
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
    // ================= 加载投诉类型 =================
    async loadComplaintTypes() {
      try {
        const res = await common_api_feedback.getComplaintTypes();
        common_vendor.index.__f__("log", "at pages/user/feedback/user_feedback.vue:102", "转换后的collections:");
        const types = res || [];
        this.typeOptions = types.map((t) => t.type_name);
        types.forEach((t) => {
          this.typeCodeMap[t.type_name] = t.type_code;
        });
        common_vendor.index.__f__("log", "at pages/user/feedback/user_feedback.vue:111", "转换后的collections:", this.typeOptions);
        if (types.length > 0) {
          this.newFeedback.complaint_type = types[0].type_code;
        }
      } catch (err) {
        common_vendor.index.showToast({
          title: "获取投诉类型失败",
          icon: "none"
        });
      }
    },
    // ================= 加载反馈列表 =================
    async loadFeedbackList() {
      try {
        const res = await common_api_feedback.getFeedbackList({
          page: this.page,
          limit: this.limit
        });
        common_vendor.index.__f__("log", "at pages/user/feedback/user_feedback.vue:135", "转换后的collections:", res);
        const list = res || [];
        common_vendor.index.__f__("log", "at pages/user/feedback/user_feedback.vue:137", "转换后的collections:", list);
        this.feedbacks = list.map((item) => ({
          id: item.id,
          type: this.typeOptions[item.complaint_type - 1],
          // 后端最好返回 type_name
          submitTime: item.create_time,
          status: item.is_resolved === 1 ? "processed" : "pending",
          statusText: item.is_resolved === 1 ? "已处理" : "待处理",
          description: item.description,
          response: item.feedback_content
        }));
      } catch (err) {
        common_vendor.index.showToast({
          title: "获取反馈列表失败",
          icon: "none"
        });
      }
    },
    // ================= 打开弹窗 =================
    addFeedback() {
      this.newFeedback.description = "";
      this.$refs.addPopup.open();
    },
    closePopup() {
      if (this.$refs.addPopup) {
        this.$refs.addPopup.close();
      }
    },
    // ================= 类型切换 =================
    onTypeChange(e) {
      this.typeIndex = e.detail.value;
      const typeName = this.typeOptions[this.typeIndex];
      this.newFeedback.complaint_type = this.typeCodeMap[typeName];
    },
    // ================= 提交反馈 =================
    async submitFeedback() {
      if (!this.newFeedback.description.trim()) {
        common_vendor.index.showToast({
          title: "请输入投诉描述",
          icon: "none"
        });
        return;
      }
      if (this.newFeedback.description.length < 10) {
        common_vendor.index.showToast({
          title: "描述不能少于10个字",
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
            title: "反馈提交成功",
            icon: "success"
          });
          this.closePopup();
          await this.loadFeedbackList();
        }
      } catch (err) {
        common_vendor.index.showToast({
          title: err.message || "提交失败",
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
    n: common_vendor.sr("addPopup", "3fd30a18-1"),
    o: common_vendor.p({
      type: "bottom"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/feedback/user_feedback.js.map
