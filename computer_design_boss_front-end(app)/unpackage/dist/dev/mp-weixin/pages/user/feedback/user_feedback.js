"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_api_feedback = require("../../../common/api/feedback.js");
const common_utils_themeSimple = require("../../../common/utils/theme-simple.js");
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
      limit: 20,
      // 主题相关
      currentTheme: "light",
      isDarkMode: false
    };
  },
  async onLoad() {
    await this.loadComplaintTypes();
    await this.loadFeedbackList();
    this.initTheme();
  },
  onUnload() {
    common_vendor.index.$off("globalThemeChange", this.handleGlobalThemeChange);
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
    goBack() {
      common_vendor.index.navigateBack();
    },
    // ================= 加载投诉类型 =================
    async loadComplaintTypes() {
      try {
        const res = await common_api_feedback.getComplaintTypes();
        common_vendor.index.__f__("log", "at pages/user/feedback/user_feedback.vue:132", "转换后的collections:");
        const types = res || [];
        this.typeOptions = types.map((t) => t.type_name);
        types.forEach((t) => {
          this.typeCodeMap[t.type_name] = t.type_code;
        });
        common_vendor.index.__f__("log", "at pages/user/feedback/user_feedback.vue:141", "转换后的collections:", this.typeOptions);
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
        common_vendor.index.__f__("log", "at pages/user/feedback/user_feedback.vue:165", "转换后的collections:", res);
        const list = res || [];
        common_vendor.index.__f__("log", "at pages/user/feedback/user_feedback.vue:167", "转换后的collections:", list);
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
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "87"),
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    d: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    f: common_vendor.f($data.feedbacks, (item, index, i0) => {
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
    g: $data.isDarkMode ? "#ffffff" : "#333",
    h: $data.isDarkMode ? "#666" : "#999",
    i: $data.isDarkMode ? "#999" : "#666",
    j: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    k: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    l: $data.feedbacks.length === 0
  }, $data.feedbacks.length === 0 ? {
    m: common_vendor.p({
      type: "chatbubble",
      size: "80",
      color: $data.isDarkMode ? "#404040" : "#ccc"
    }),
    n: $data.isDarkMode ? "#666" : "#999"
  } : {}, {
    o: $data.isDarkMode ? "#ffffff" : "#333",
    p: common_vendor.o((...args) => $options.closePopup && $options.closePopup(...args), "a6"),
    q: $data.isDarkMode ? "#666" : "#999",
    r: $data.isDarkMode ? "#ffffff" : "#333",
    s: common_vendor.t($data.typeOptions[$data.typeIndex]),
    t: $data.isDarkMode ? "#ffffff" : "#333",
    v: common_vendor.o((...args) => $options.onTypeChange && $options.onTypeChange(...args), "75"),
    w: $data.typeIndex,
    x: $data.typeOptions,
    y: $data.isDarkMode ? "#404040" : "#f5f5f5",
    z: $data.isDarkMode ? "#404040" : "#eee",
    A: $data.isDarkMode ? "#ffffff" : "#333",
    B: $data.isDarkMode ? "#404040" : "#f5f5f5",
    C: $data.isDarkMode ? "#404040" : "#eee",
    D: $data.isDarkMode ? "#ffffff" : "#333",
    E: $data.newFeedback.description,
    F: common_vendor.o(($event) => $data.newFeedback.description = $event.detail.value, "82"),
    G: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args), "8e"),
    H: $data.isDarkMode ? "#2c2c2c" : "#fff",
    I: common_vendor.sr("addPopup", "c52ca5aa-1"),
    J: common_vendor.p({
      type: "bottom"
    }),
    K: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/feedback/user_feedback.js.map
