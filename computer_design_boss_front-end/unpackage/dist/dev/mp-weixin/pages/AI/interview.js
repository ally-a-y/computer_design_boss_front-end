"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      interviewStarted: false,
      currentMethod: "resumeText+positionText",
      formData: {
        resumeText: "",
        resumePdf: null,
        userId: "",
        positionId: "",
        positionText: ""
      },
      interviewMethods: [
        { value: "resumeText+positionText", label: "\u7B80\u5386\u6587\u672C+\u5C97\u4F4D\u6587\u672C" },
        { value: "pdf+positionText", label: "PDF\u7B80\u5386+\u5C97\u4F4D\u6587\u672C" },
        { value: "pdf+position", label: "PDF\u7B80\u5386+\u5C97\u4F4DID" },
        { value: "user+position", label: "\u7528\u6237ID+\u5C97\u4F4DID" },
        { value: "user+positionText", label: "\u7528\u6237ID+\u5C97\u4F4D\u6587\u672C" },
        { value: "resumeText+position", label: "\u7B80\u5386\u6587\u672C+\u5C97\u4F4DID" }
      ],
      currentQuestion: 0,
      totalQuestions: 8,
      currentStage: "\u81EA\u6211\u4ECB\u7ECD",
      isRecording: false,
      isSpeaking: false,
      isAIThinking: false,
      voiceWaveActive: false,
      recordingTime: 0,
      recordingTimer: null,
      interviewMessages: [],
      chatScrollTop: 0,
      tipsCollapsed: false,
      currentTips: [
        "\u4FDD\u6301\u81EA\u4FE1\uFF0C\u8BED\u901F\u9002\u4E2D",
        "\u56DE\u7B54\u95EE\u9898\u8981\u6709\u6761\u7406",
        "\u9002\u5F53\u4F7F\u7528\u4E13\u4E1A\u672F\u8BED",
        "\u6CE8\u610F\u4E0E\u9762\u8BD5\u5B98\u7684\u773C\u795E\u4EA4\u6D41"
      ],
      showReport: false,
      overallScore: 85,
      evaluationItems: [],
      suggestions: []
    };
  },
  computed: {
    progressPercent() {
      return Math.min(this.currentQuestion / this.totalQuestions * 100, 100);
    }
  },
  onLoad() {
    this.initializeInterview();
  },
  onUnload() {
    this.cleanupInterview();
  },
  methods: {
    getInterviewerStatus() {
      if (this.isAIThinking)
        return "\u601D\u8003\u4E2D...";
      if (this.isSpeaking)
        return "\u8BF4\u8BDD\u4E2D...";
      return "\u7B49\u5F85\u4E2D";
    },
    initializeInterview() {
    },
    cleanupInterview() {
      this.resetInterview();
      this.clearRecordingTimer();
    },
    goBack() {
      if (this.interviewStarted) {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: "\u786E\u5B9A\u8981\u7ED3\u675F\u9762\u8BD5\u5417\uFF1F",
          success: (res) => {
            if (res.confirm) {
              this.interviewStarted = false;
              this.resetInterview();
              common_vendor.index.navigateBack();
            }
          }
        });
      } else {
        common_vendor.index.navigateBack();
      }
    },
    selectMethod(method) {
      this.currentMethod = method;
      this.resetForm();
    },
    chooseResumeFile() {
      common_vendor.index.chooseFile({
        count: 1,
        type: "file",
        extension: ["pdf"],
        success: (res) => {
          this.formData.resumePdf = res.tempFiles[0];
        }
      });
    },
    startInterview() {
      if (!this.validateForm()) {
        return;
      }
      this.interviewStarted = true;
      this.currentQuestion = 1;
      this.startFirstQuestion();
    },
    validateForm() {
      const method = this.currentMethod;
      if (method.includes("resumeText") && !this.formData.resumeText.trim()) {
        common_vendor.index.showToast({ title: "\u8BF7\u8F93\u5165\u7B80\u5386\u6587\u672C", icon: "none" });
        return false;
      }
      if (method.includes("pdf") && !this.formData.resumePdf) {
        common_vendor.index.showToast({ title: "\u8BF7\u4E0A\u4F20PDF\u7B80\u5386", icon: "none" });
        return false;
      }
      if (method.includes("user") && !this.formData.userId.trim()) {
        common_vendor.index.showToast({ title: "\u8BF7\u8F93\u5165\u7528\u6237ID", icon: "none" });
        return false;
      }
      if (method.includes("position") && !this.formData.positionId.trim()) {
        common_vendor.index.showToast({ title: "\u8BF7\u8F93\u5165\u804C\u4F4DID", icon: "none" });
        return false;
      }
      if (method.includes("positionText") && !this.formData.positionText.trim()) {
        common_vendor.index.showToast({ title: "\u8BF7\u8F93\u5165\u5C97\u4F4D\u63CF\u8FF0", icon: "none" });
        return false;
      }
      return true;
    },
    startFirstQuestion() {
      setTimeout(() => {
        this.askQuestion("\u8BF7\u5148\u7B80\u5355\u4ECB\u7ECD\u4E00\u4E0B\u60A8\u81EA\u5DF1\u3002");
      }, 1e3);
    },
    askQuestion(question) {
      this.isSpeaking = true;
      this.voiceWaveActive = true;
      setTimeout(() => {
        this.isSpeaking = false;
        this.voiceWaveActive = false;
        this.interviewMessages.push({
          sender: "interviewer",
          content: question,
          timestamp: Date.now()
        });
        this.scrollToBottom();
      }, 2e3);
    },
    startRecording() {
      this.isRecording = true;
      this.recordingTime = 0;
      this.recordingTimer = setInterval(() => {
        this.recordingTime++;
      }, 1e3);
    },
    stopRecording() {
      if (!this.isRecording)
        return;
      this.isRecording = false;
      this.clearRecordingTimer();
      this.interviewMessages.push({
        sender: "candidate",
        content: "\u8FD9\u662F\u6211\u7684\u56DE\u7B54\u5185\u5BB9...\uFF08\u5F55\u97F3\u8F6C\u6587\u5B57\u7ED3\u679C\uFF09",
        timestamp: Date.now()
      });
      this.scrollToBottom();
      this.isAIThinking = true;
      setTimeout(() => {
        this.isAIThinking = false;
        this.nextQuestion();
      }, 2e3);
    },
    nextQuestion() {
      this.currentQuestion++;
      if (this.currentQuestion > this.totalQuestions) {
        this.endInterview();
        return;
      }
      this.updateInterviewStage();
      const questions = [
        "\u60A8\u4E3A\u4EC0\u4E48\u9009\u62E9\u8FD9\u4E2A\u804C\u4F4D\uFF1F",
        "\u8BF7\u4ECB\u7ECD\u4E00\u4E0B\u60A8\u6700\u6EE1\u610F\u7684\u9879\u76EE\u7ECF\u5386\u3002",
        "\u60A8\u5982\u4F55\u5904\u7406\u5DE5\u4F5C\u4E2D\u7684\u538B\u529B\uFF1F",
        "\u60A8\u672A\u6765\u7684\u804C\u4E1A\u89C4\u5212\u662F\u4EC0\u4E48\uFF1F",
        "\u60A8\u6709\u4EC0\u4E48\u95EE\u9898\u60F3\u95EE\u6211\u4EEC\u5417\uFF1F"
      ];
      const questionIndex = this.currentQuestion - 2;
      if (questionIndex < questions.length) {
        this.askQuestion(questions[questionIndex]);
      }
    },
    updateInterviewStage() {
      const stages = ["\u81EA\u6211\u4ECB\u7ECD", "\u6280\u672F\u80FD\u529B", "\u9879\u76EE\u7ECF\u9A8C", "\u804C\u4E1A\u89C4\u5212", "\u7EFC\u5408\u80FD\u529B"];
      const stageIndex = Math.floor((this.currentQuestion - 1) / (this.totalQuestions / stages.length));
      this.currentStage = stages[stageIndex] || "\u7EFC\u5408\u8BC4\u4F30";
    },
    replayQuestion() {
      if (this.interviewMessages.length === 0)
        return;
      const lastQuestion = this.interviewMessages.filter((msg) => msg.sender === "interviewer").pop();
      if (lastQuestion) {
        this.askQuestion(lastQuestion.content);
      }
    },
    endInterview() {
      this.generateReportData();
      this.showReport = true;
      this.$nextTick(() => {
        this.drawRadarChart();
      });
    },
    generateReportData() {
      this.evaluationItems = [
        {
          title: "\u6280\u672F\u80FD\u529B",
          content: "\u57FA\u7840\u624E\u5B9E\uFF0C\u80FD\u591F\u6E05\u6670\u5730\u89E3\u91CA\u6280\u672F\u6982\u5FF5\uFF0C\u4F46\u5728\u67D0\u4E9B\u6DF1\u5EA6\u95EE\u9898\u4E0A\u7565\u663E\u4E0D\u8DB3\u3002"
        },
        {
          title: "\u6C9F\u901A\u80FD\u529B",
          content: "\u8868\u8FBE\u6E05\u6670\uFF0C\u903B\u8F91\u6027\u5F3A\uFF0C\u80FD\u591F\u5F88\u597D\u5730\u7406\u89E3\u95EE\u9898\u5E76\u7ED9\u51FA\u5408\u9002\u7684\u56DE\u7B54\u3002"
        },
        {
          title: "\u9879\u76EE\u7ECF\u9A8C",
          content: "\u9879\u76EE\u7ECF\u5386\u4E30\u5BCC\uFF0C\u80FD\u591F\u8BE6\u7EC6\u63CF\u8FF0\u9879\u76EE\u7EC6\u8282\u548C\u4E2A\u4EBA\u8D21\u732E\u3002"
        }
      ];
      this.suggestions = [
        "\u5EFA\u8BAE\u5728\u6280\u672F\u6DF1\u5EA6\u65B9\u9762\u7EE7\u7EED\u52A0\u5F3A\u5B66\u4E60",
        "\u53EF\u4EE5\u589E\u52A0\u66F4\u591A\u5B9E\u9645\u9879\u76EE\u6848\u4F8B\u7684\u79EF\u7D2F",
        "\u9762\u8BD5\u65F6\u4FDD\u6301\u66F4\u597D\u7684\u773C\u795E\u4EA4\u6D41",
        "\u9002\u5F53\u51C6\u5907\u4E00\u4E9B\u884C\u4E3A\u9762\u8BD5\u95EE\u9898\u7684\u56DE\u7B54"
      ];
    },
    toggleTips() {
      this.tipsCollapsed = !this.tipsCollapsed;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.chatScrollTop = 999999;
      });
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    },
    closeReport() {
      this.showReport = false;
    },
    restartInterview() {
      this.showReport = false;
      this.resetInterview();
      this.startInterview();
    },
    exportReport() {
      common_vendor.index.showToast({
        title: "\u62A5\u544A\u5BFC\u51FA\u529F\u80FD\u5F00\u53D1\u4E2D...",
        icon: "none"
      });
    },
    drawRadarChart() {
      const ctx = common_vendor.index.createCanvasContext("radarChart", this);
      this.drawRadarGrid(ctx);
      this.drawRadarData(ctx);
      ctx.draw();
    },
    drawRadarGrid(ctx) {
      const centerX = 150, centerY = 150, radius = 100, points = 6;
      const angleStep = Math.PI * 2 / points;
      ctx.setStrokeStyle("#e0e0e0");
      ctx.setLineWidth(1);
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        for (let j = 0; j <= points; j++) {
          const angle = j * angleStep - Math.PI / 2;
          const r = radius * i / 5;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      for (let i = 0; i < points; i++) {
        const angle = i * angleStep - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        ctx.stroke();
      }
    },
    drawRadarData(ctx) {
      const centerX = 150, centerY = 150, radius = 100, points = 6;
      const angleStep = Math.PI * 2 / points;
      const data = [0.8, 0.7, 0.9, 0.6, 0.8, 0.75];
      ctx.setFillStyle("rgba(0, 122, 255, 0.3)");
      ctx.setStrokeStyle("#007aff");
      ctx.setLineWidth(2);
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = data[i % points];
        const x = centerX + Math.cos(angle) * (radius * value);
        const y = centerY + Math.sin(angle) * (radius * value);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    },
    resetInterview() {
      this.interviewStarted = false;
      this.currentQuestion = 0;
      this.interviewMessages = [];
      this.isRecording = false;
      this.isSpeaking = false;
      this.isAIThinking = false;
      this.recordingTime = 0;
      this.showReport = false;
      this.clearRecordingTimer();
    },
    clearRecordingTimer() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }
    },
    resetForm() {
      this.formData = {
        resumeText: "",
        resumePdf: null,
        userId: "",
        positionId: "",
        positionText: ""
      };
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: !$data.interviewStarted
  }, !$data.interviewStarted ? common_vendor.e({
    c: common_vendor.f($data.interviewMethods, (method, index, i0) => {
      return {
        a: common_vendor.t(method.label),
        b: index,
        c: common_vendor.n({
          active: $data.currentMethod === method.value
        }),
        d: common_vendor.o(($event) => $options.selectMethod(method.value))
      };
    }),
    d: $data.currentMethod.includes("resumeText")
  }, $data.currentMethod.includes("resumeText") ? {
    e: $data.formData.resumeText,
    f: common_vendor.o(($event) => $data.formData.resumeText = $event.detail.value)
  } : {}, {
    g: $data.currentMethod.includes("pdf")
  }, $data.currentMethod.includes("pdf") ? common_vendor.e({
    h: !$data.formData.resumePdf
  }, !$data.formData.resumePdf ? {} : {}, {
    i: !$data.formData.resumePdf
  }, !$data.formData.resumePdf ? {} : {
    j: common_vendor.t($data.formData.resumePdf.name)
  }, {
    k: common_vendor.o((...args) => $options.chooseResumeFile && $options.chooseResumeFile(...args))
  }) : {}, {
    l: $data.currentMethod.includes("user")
  }, $data.currentMethod.includes("user") ? {
    m: $data.formData.userId,
    n: common_vendor.o(($event) => $data.formData.userId = $event.detail.value)
  } : {}, {
    o: $data.currentMethod.includes("position")
  }, $data.currentMethod.includes("position") ? {
    p: $data.formData.positionId,
    q: common_vendor.o(($event) => $data.formData.positionId = $event.detail.value)
  } : {}, {
    r: $data.currentMethod.includes("positionText")
  }, $data.currentMethod.includes("positionText") ? {
    s: $data.formData.positionText,
    t: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value)
  } : {}, {
    v: common_vendor.o((...args) => $options.startInterview && $options.startInterview(...args))
  }) : common_vendor.e({
    w: common_vendor.t($data.currentQuestion),
    x: common_vendor.t($data.totalQuestions),
    y: $options.progressPercent + "%",
    z: common_vendor.t($data.currentStage),
    A: $data.isSpeaking
  }, $data.isSpeaking ? {
    B: common_vendor.f(5, (i, k0, i0) => {
      return {
        a: i,
        b: i * 0.1 + "s"
      };
    }),
    C: common_vendor.n({
      active: $data.voiceWaveActive
    })
  } : {}, {
    D: common_vendor.t($options.getInterviewerStatus()),
    E: common_vendor.f($data.interviewMessages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.content),
        b: common_vendor.t($options.formatTime(message.timestamp)),
        c: index,
        d: common_vendor.n(message.sender)
      };
    }),
    F: $data.isAIThinking
  }, $data.isAIThinking ? {
    G: common_vendor.f(3, (i, k0, i0) => {
      return {
        a: i,
        b: i * 0.2 + "s"
      };
    })
  } : {}, {
    H: $data.chatScrollTop,
    I: common_vendor.n({
      rotated: $data.tipsCollapsed
    }),
    J: common_vendor.o((...args) => $options.toggleTips && $options.toggleTips(...args)),
    K: !$data.tipsCollapsed
  }, !$data.tipsCollapsed ? {
    L: common_vendor.f($data.currentTips, (tip, index, i0) => {
      return {
        a: common_vendor.t(tip),
        b: index
      };
    })
  } : {}, {
    M: $data.tipsCollapsed ? 1 : "",
    N: common_vendor.o((...args) => $options.replayQuestion && $options.replayQuestion(...args)),
    O: $data.isRecording ? "/static/ai/recording.png" : "/static/ai/mic.png",
    P: common_vendor.t($data.isRecording ? "\u5F55\u97F3\u4E2D..." : "\u6309\u4F4F\u8BF4\u8BDD"),
    Q: $data.isRecording ? 1 : "",
    R: common_vendor.o((...args) => $options.startRecording && $options.startRecording(...args)),
    S: common_vendor.o((...args) => $options.stopRecording && $options.stopRecording(...args)),
    T: $data.isRecording
  }, $data.isRecording ? {
    U: common_vendor.t($data.recordingTime)
  } : {}, {
    V: common_vendor.o((...args) => $options.endInterview && $options.endInterview(...args))
  }), {
    W: $data.showReport
  }, $data.showReport ? {
    X: common_vendor.o((...args) => $options.closeReport && $options.closeReport(...args)),
    Y: common_vendor.t($data.overallScore),
    Z: common_vendor.f($data.evaluationItems, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.content),
        c: index
      };
    }),
    aa: common_vendor.f($data.suggestions, (suggestion, index, i0) => {
      return {
        a: common_vendor.t(suggestion),
        b: index
      };
    }),
    ab: common_vendor.o((...args) => $options.restartInterview && $options.restartInterview(...args)),
    ac: common_vendor.o((...args) => $options.exportReport && $options.exportReport(...args)),
    ad: common_vendor.o(() => {
    }),
    ae: common_vendor.o((...args) => $options.closeReport && $options.closeReport(...args))
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-638c375a"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/AI/interview.vue"]]);
wx.createPage(MiniProgramPage);
