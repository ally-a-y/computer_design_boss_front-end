"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      messages: [
        {
          sender: "ai",
          content: "\u60A8\u597D\uFF01\u6211\u662FAI\u6C42\u804C\u52A9\u624B\uFF0C\u53EF\u4EE5\u5E2E\u52A9\u60A8\u5206\u6790\u7B80\u5386\u3001\u8BC4\u4F30\u6C42\u804C\u6210\u529F\u7387\uFF0C\u8FD8\u53EF\u4EE5\u8FDB\u884C\u6A21\u62DF\u9762\u8BD5\u3002\u8BF7\u95EE\u6709\u4EC0\u4E48\u53EF\u4EE5\u5E2E\u52A9\u60A8\u7684\uFF1F",
          timestamp: Date.now(),
          expanded: false
        }
      ],
      inputText: "",
      scrollTop: 0,
      isLoading: false,
      currentPanel: null,
      currentMethod: "pdf+position",
      formData: {
        userId: "",
        positionId: "",
        positionText: "",
        pdfFile: null
      },
      analysisMethods: [
        { value: "user+position", label: "\u7528\u6237ID+\u804C\u4F4DID" },
        { value: "user+text", label: "\u7528\u6237ID+\u804C\u4F4D\u6587\u672C" },
        { value: "pdf+position", label: "PDF+\u804C\u4F4DID" },
        { value: "pdf+text", label: "PDF+\u804C\u4F4D\u6587\u672C" }
      ]
    };
  },
  computed: {
    panelTitle() {
      const titles = {
        resumeAnalysis: "\u7B80\u5386\u5206\u6790",
        resumeEvaluation: "\u7B80\u5386\u8BC4\u4F30",
        successRate: "\u6210\u529F\u7387\u5206\u6790",
        studentPlan: "\u5927\u5B66\u751F\u89C4\u5212"
      };
      return titles[this.currentPanel] || "";
    }
  },
  onLoad() {
    this.initializeChat();
  },
  onUnload() {
    this.cleanup();
  },
  methods: {
    initializeChat() {
    },
    cleanup() {
    },
    goToInterview() {
      common_vendor.index.navigateTo({
        url: "/pages/AI/interview"
      });
    },
    sendMessage() {
      if (!this.inputText.trim())
        return;
      this.messages.push({
        sender: "user",
        content: this.inputText,
        timestamp: Date.now()
      });
      this.scrollToBottom();
      this.isLoading = true;
      this.inputText = "";
      this.simulateAIResponse();
    },
    openPanel(panelType) {
      this.currentPanel = panelType;
      this.currentMethod = this.getDefaultMethod(panelType);
    },
    closePanel() {
      this.currentPanel = null;
      this.resetForm();
    },
    getDefaultMethod(panelType) {
      const defaults = {
        resumeAnalysis: "user+position",
        resumeEvaluation: "user",
        successRate: "pdf+position",
        studentPlan: "pdf+position"
      };
      return defaults[panelType] || "user";
    },
    onMethodChange(e) {
      this.currentMethod = e.detail.value;
    },
    chooseFile() {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: ["pdf"],
        success: (res) => {
          this.formData.pdfFile = res.tempFiles[0];
        }
      });
    },
    submitFunction() {
      let userMessage = "";
      switch (this.currentPanel) {
        case "resumeAnalysis":
          userMessage = "\u8BF7\u5206\u6790\u8FD9\u4EFD\u7B80\u5386";
          break;
        case "resumeEvaluation":
          userMessage = "\u8BF7\u8BC4\u4F30\u6211\u7684\u7B80\u5386";
          break;
        case "successRate":
          userMessage = "\u8BF7\u5206\u6790\u6211\u7684\u6C42\u804C\u6210\u529F\u7387";
          break;
        case "studentPlan":
          userMessage = "\u8BF7\u4E3A\u6211\u5236\u5B9A\u5927\u5B66\u751F\u6D3B\u89C4\u5212";
          break;
      }
      if (this.formData.pdfFile) {
        userMessage += `\uFF1A[${this.formData.pdfFile.name}]`;
      }
      this.messages.push({
        sender: "user",
        content: userMessage,
        timestamp: Date.now(),
        file: this.formData.pdfFile
      });
      this.closePanel();
      this.scrollToBottom();
      this.simulateAnalysisResult();
    },
    toggleCard(index) {
      this.messages[index].expanded = !this.messages[index].expanded;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 999999;
      });
    },
    loadMoreHistory() {
    },
    formatFileSize(size) {
      if (size < 1024)
        return size + "B";
      if (size < 1024 * 1024)
        return (size / 1024).toFixed(1) + "KB";
      return (size / (1024 * 1024)).toFixed(1) + "MB";
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    },
    resetForm() {
      this.formData = {
        userId: "",
        positionId: "",
        positionText: "",
        pdfFile: null
      };
    },
    simulateAIResponse() {
      setTimeout(() => {
        this.isLoading = false;
        this.messages.push({
          sender: "ai",
          content: "\u6211\u5DF2\u7ECF\u6536\u5230\u60A8\u7684\u6D88\u606F\uFF0C\u6B63\u5728\u4E3A\u60A8\u5206\u6790...",
          timestamp: Date.now(),
          expanded: false
        });
        this.scrollToBottom();
      }, 1500);
    },
    simulateAnalysisResult() {
      setTimeout(() => {
        this.messages.push({
          sender: "ai",
          content: "\u5206\u6790\u5B8C\u6210\uFF0C\u4EE5\u4E0B\u662F\u8BE6\u7EC6\u7ED3\u679C\uFF1A",
          timestamp: Date.now(),
          expanded: false,
          analysisResult: {
            title: "\u7B80\u5386\u5206\u6790\u62A5\u544A",
            content: "<p><strong>\u4F18\u52BF\uFF1A</strong></p><ul><li>\u6280\u672F\u80FD\u529B\u7A81\u51FA</li><li>\u9879\u76EE\u7ECF\u9A8C\u4E30\u5BCC</li></ul><p><strong>\u5EFA\u8BAE\uFF1A</strong></p><ul><li>\u53EF\u4EE5\u589E\u52A0\u66F4\u591A\u91CF\u5316\u6210\u679C</li><li>\u4F18\u5316\u5173\u952E\u8BCD\u5339\u914D</li></ul>"
          }
        });
        this.scrollToBottom();
      }, 2e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goToInterview && $options.goToInterview(...args)),
    b: common_vendor.f($data.messages, (message, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(message.content),
        b: message.file
      }, message.file ? {
        c: common_vendor.t(message.file.name),
        d: common_vendor.t($options.formatFileSize(message.file.size))
      } : {}, {
        e: message.analysisResult
      }, message.analysisResult ? common_vendor.e({
        f: common_vendor.t(message.analysisResult.title),
        g: message.expanded ? "/static/ai/collapse.png" : "/static/ai/expand.png",
        h: common_vendor.o(($event) => $options.toggleCard(index)),
        i: message.expanded
      }, message.expanded ? {
        j: message.analysisResult.content
      } : {}, {
        k: message.expanded ? 1 : ""
      }) : {}, {
        l: message.uploadProgress !== void 0
      }, message.uploadProgress !== void 0 ? {
        m: message.uploadProgress + "%",
        n: common_vendor.t(message.uploadProgress)
      } : {}, {
        o: common_vendor.t($options.formatTime(message.timestamp)),
        p: index,
        q: common_vendor.n(message.sender === "user" ? "user-message" : "ai-message")
      });
    }),
    c: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    d: $data.scrollTop,
    e: common_vendor.o((...args) => $options.loadMoreHistory && $options.loadMoreHistory(...args)),
    f: common_vendor.o(($event) => $options.openPanel("resumeAnalysis")),
    g: common_vendor.o(($event) => $options.openPanel("resumeEvaluation")),
    h: common_vendor.o(($event) => $options.openPanel("successRate")),
    i: common_vendor.o(($event) => $options.openPanel("studentPlan")),
    j: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    k: $data.inputText,
    l: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    m: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    n: !$data.inputText.trim(),
    o: $data.currentPanel
  }, $data.currentPanel ? common_vendor.e({
    p: common_vendor.t($options.panelTitle),
    q: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args)),
    r: $data.currentPanel === "resumeAnalysis"
  }, $data.currentPanel === "resumeAnalysis" ? common_vendor.e({
    s: common_vendor.f($data.analysisMethods, (method, k0, i0) => {
      return {
        a: method.value,
        b: $data.currentMethod === method.value,
        c: common_vendor.t(method.label),
        d: method.value
      };
    }),
    t: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    v: $data.currentMethod.includes("user")
  }, $data.currentMethod.includes("user") ? {
    w: $data.formData.userId,
    x: common_vendor.o(($event) => $data.formData.userId = $event.detail.value)
  } : {}, {
    y: $data.currentMethod.includes("position")
  }, $data.currentMethod.includes("position") ? {
    z: $data.formData.positionId,
    A: common_vendor.o(($event) => $data.formData.positionId = $event.detail.value)
  } : {}, {
    B: $data.currentMethod.includes("text")
  }, $data.currentMethod.includes("text") ? {
    C: $data.formData.positionText,
    D: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value)
  } : {}, {
    E: $data.currentMethod.includes("pdf")
  }, $data.currentMethod.includes("pdf") ? {
    F: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "\u70B9\u51FB\u9009\u62E9PDF\u6587\u4EF6"),
    G: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
  } : {}) : {}, {
    H: $data.currentPanel === "resumeEvaluation"
  }, $data.currentPanel === "resumeEvaluation" ? common_vendor.e({
    I: $data.currentMethod === "user",
    J: $data.currentMethod === "pdf",
    K: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    L: $data.currentMethod === "user"
  }, $data.currentMethod === "user" ? {
    M: $data.formData.userId,
    N: common_vendor.o(($event) => $data.formData.userId = $event.detail.value)
  } : {}, {
    O: $data.currentMethod === "pdf"
  }, $data.currentMethod === "pdf" ? {
    P: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "\u70B9\u51FB\u9009\u62E9PDF\u6587\u4EF6"),
    Q: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
  } : {}) : {}, {
    R: $data.currentPanel === "successRate"
  }, $data.currentPanel === "successRate" ? common_vendor.e({
    S: $data.currentMethod === "pdf+position",
    T: $data.currentMethod === "user+text",
    U: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    V: $data.currentMethod === "user+text"
  }, $data.currentMethod === "user+text" ? {
    W: $data.formData.userId,
    X: common_vendor.o(($event) => $data.formData.userId = $event.detail.value)
  } : {}, {
    Y: $data.currentMethod.includes("position")
  }, $data.currentMethod.includes("position") ? {
    Z: $data.formData.positionId,
    aa: common_vendor.o(($event) => $data.formData.positionId = $event.detail.value)
  } : {}, {
    ab: $data.currentMethod.includes("text")
  }, $data.currentMethod.includes("text") ? {
    ac: $data.formData.positionText,
    ad: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value)
  } : {}, {
    ae: $data.currentMethod.includes("pdf")
  }, $data.currentMethod.includes("pdf") ? {
    af: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "\u70B9\u51FB\u9009\u62E9PDF\u6587\u4EF6"),
    ag: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
  } : {}) : {}, {
    ah: $data.currentPanel === "studentPlan"
  }, $data.currentPanel === "studentPlan" ? common_vendor.e({
    ai: $data.currentMethod === "pdf+position",
    aj: $data.currentMethod === "user+text",
    ak: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    al: $data.currentMethod.includes("user")
  }, $data.currentMethod.includes("user") ? {
    am: $data.formData.userId,
    an: common_vendor.o(($event) => $data.formData.userId = $event.detail.value)
  } : {}, {
    ao: $data.currentMethod.includes("position")
  }, $data.currentMethod.includes("position") ? {
    ap: $data.formData.positionId,
    aq: common_vendor.o(($event) => $data.formData.positionId = $event.detail.value)
  } : {}, {
    ar: $data.currentMethod.includes("text")
  }, $data.currentMethod.includes("text") ? {
    as: $data.formData.positionText,
    at: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value)
  } : {}, {
    av: $data.currentMethod.includes("pdf")
  }, $data.currentMethod.includes("pdf") ? {
    aw: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "\u70B9\u51FB\u9009\u62E9PDF\u6587\u4EF6"),
    ax: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args))
  } : {}) : {}, {
    ay: common_vendor.o((...args) => $options.submitFunction && $options.submitFunction(...args)),
    az: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args)),
    aA: common_vendor.o(() => {
    }),
    aB: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args))
  }) : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6fa74974"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/AI/AI.vue"]]);
wx.createPage(MiniProgramPage);
