"use strict";
var common_vendor = require("../../common/vendor.js");
var common_api_ai = require("../../common/api/ai.js");
require("../../common/api/request.js");
require("../../common/config.js");
const BASE_URL = "http://localhost:5000";
const recorderManager = common_vendor.index.getRecorderManager();
const __default__ = {
  data() {
    return {
      interviewStarted: false,
      isStarting: false,
      currentMethod: "resumeText+positionText",
      formData: {
        resumeText: "",
        resumePdf: null,
        userId: "",
        positionId: "",
        positionText: ""
      },
      userInfo: null,
      isLoadingUser: false,
      interviewMethods: [
        { value: "resumeText+positionText", label: "\u7B80\u5386\u6587\u672C+\u5C97\u4F4D\u6587\u672C" },
        { value: "pdf+positionText", label: "PDF\u7B80\u5386+\u5C97\u4F4D\u6587\u672C" },
        { value: "pdf+position", label: "PDF\u7B80\u5386+\u5C97\u4F4DID" },
        { value: "user+position", label: "\u7528\u6237ID+\u5C97\u4F4DID" },
        { value: "user+positionText", label: "\u7528\u6237ID+\u5C97\u4F4D\u6587\u672C" },
        { value: "resumeText+position", label: "\u7B80\u5386\u6587\u672C+\u5C97\u4F4DID" }
      ],
      sessionId: null,
      currentQuestion: 0,
      totalQuestions: 8,
      currentStage: "\u81EA\u6211\u4ECB\u7ECD",
      resumeSource: "",
      jobSource: "",
      isRecording: false,
      isSpeaking: false,
      isAIThinking: false,
      isProcessing: false,
      voiceWaveActive: false,
      recordingTime: 0,
      recordingTimer: null,
      audioFilePath: "",
      currentAudioUrl: "",
      innerAudioContext: null,
      interviewMessages: [],
      chatScrollTop: 0,
      tipsCollapsed: false,
      currentTips: [
        "\u4FDD\u6301\u81EA\u4FE1\uFF0C\u8BED\u901F\u9002\u4E2D",
        "\u56DE\u7B54\u95EE\u9898\u8981\u6709\u6761\u7406\uFF0C\u4F7F\u7528STAR\u6CD5\u5219",
        "\u9002\u5F53\u4F7F\u7528\u4E13\u4E1A\u672F\u8BED\u5C55\u793A\u80FD\u529B",
        "\u6CE8\u610F\u4E0E\u9762\u8BD5\u5B98\u7684\u773C\u795E\u4EA4\u6D41",
        "\u9047\u5230\u4E0D\u4F1A\u7684\u95EE\u9898\u8BDA\u5B9E\u56DE\u7B54"
      ],
      showReport: false,
      overallScore: 85,
      evaluationItems: [],
      suggestions: [],
      reportData: null
    };
  },
  computed: {
    progressPercent() {
      return Math.min(this.currentQuestion / this.totalQuestions * 100, 100);
    },
    hasUserInfo() {
      return !!this.formData.userId;
    }
  },
  onLoad() {
    this.initializeInterview();
    this.initRecorder();
    this.fetchUserInfo();
  },
  onUnload() {
    this.cleanupInterview();
  },
  methods: {
    async fetchUserInfo() {
      this.isLoadingUser = true;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          console.log("\u672A\u627E\u5230\u767B\u5F55token\uFF0C\u9700\u8981\u7528\u6237\u767B\u5F55");
          return;
        }
        const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (cachedUserInfo && cachedUserInfo.user_id) {
          this.userInfo = cachedUserInfo;
          this.formData.userId = String(cachedUserInfo.user_id);
          console.log("\u4ECE\u7F13\u5B58\u83B7\u53D6\u7528\u6237ID:", this.formData.userId);
          return;
        }
        const res = await this.getUserProfile();
        if (res.code === 200 && res.data) {
          this.userInfo = res.data;
          this.formData.userId = String(res.data.user_id || res.data.userId || res.data.id);
          common_vendor.index.setStorageSync("userInfo", res.data);
          console.log("\u4ECE\u540E\u7AEF\u83B7\u53D6\u7528\u6237ID:", this.formData.userId);
        }
      } catch (error) {
        console.error("\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25",
          icon: "none",
          duration: 2e3
        });
      } finally {
        this.isLoadingUser = false;
      }
    },
    getUserProfile() {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: `${BASE_URL}/api/user/profile`,
          method: "GET",
          header: {
            "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
          },
          success: (res) => {
            resolve(res.data);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    },
    initRecorder() {
      recorderManager.onStart(() => {
        console.log("\u5F55\u97F3\u5F00\u59CB");
        this.isRecording = true;
        this.startRecordingTimer();
      });
      recorderManager.onStop((res) => {
        console.log("\u5F55\u97F3\u7ED3\u675F", res);
        this.isRecording = false;
        this.clearRecordingTimer();
        this.audioFilePath = res.tempFilePath;
        this.processAudio(res.tempFilePath);
      });
      recorderManager.onError((err) => {
        console.error("\u5F55\u97F3\u9519\u8BEF", err);
        this.isRecording = false;
        this.clearRecordingTimer();
        common_vendor.index.showToast({ title: "\u5F55\u97F3\u5931\u8D25: " + err.message, icon: "none" });
      });
    },
    getInterviewerStatus() {
      if (this.isAIThinking)
        return "\u601D\u8003\u4E2D...";
      if (this.isSpeaking)
        return "\u8BF4\u8BDD\u4E2D...";
      if (this.isProcessing)
        return "\u5904\u7406\u4E2D...";
      return "\u7B49\u5F85\u4E2D";
    },
    initializeInterview() {
      this.innerAudioContext = common_vendor.index.createInnerAudioContext();
      this.innerAudioContext.onEnded(() => {
        this.isSpeaking = false;
        this.voiceWaveActive = false;
      });
      this.innerAudioContext.onError((err) => {
        console.error("\u97F3\u9891\u64AD\u653E\u9519\u8BEF", err);
        this.isSpeaking = false;
        this.voiceWaveActive = false;
      });
    },
    cleanupInterview() {
      this.resetInterview();
      this.clearRecordingTimer();
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy();
        this.innerAudioContext = null;
      }
      if (this.isRecording) {
        recorderManager.stop();
      }
    },
    goBack() {
      if (this.interviewStarted) {
        common_vendor.index.showModal({
          title: "\u63D0\u793A",
          content: "\u786E\u5B9A\u8981\u7ED3\u675F\u9762\u8BD5\u5417\uFF1F\u5F53\u524D\u8FDB\u5EA6\u5C06\u4E0D\u4F1A\u4FDD\u5B58\u3002",
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
      if (this.userInfo) {
        this.formData.userId = String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id);
      }
    },
    chooseResumeFile() {
      wx.chooseMessageFile({
        count: 1,
        type: "file",
        extension: ["pdf"],
        success: (res) => {
          const file = res.tempFiles[0];
          const fs = common_vendor.index.getFileSystemManager();
          fs.readFile({
            filePath: file.path,
            encoding: "base64",
            success: (readRes) => {
              this.formData.resumePdf = {
                name: file.name,
                path: file.path,
                base64: readRes.data
              };
            },
            fail: (err) => {
              console.error("\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25", err);
              common_vendor.index.showToast({ title: "\u6587\u4EF6\u8BFB\u53D6\u5931\u8D25", icon: "none" });
            }
          });
        },
        fail: (err) => {
          console.log("\u9009\u62E9\u6587\u4EF6\u53D6\u6D88\u6216\u5931\u8D25", err);
        }
      });
    },
    async startInterview() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      if (!this.validateForm()) {
        return;
      }
      this.isStarting = true;
      try {
        let res;
        switch (this.currentMethod) {
          case "resumeText+positionText":
            res = await common_api_ai.interviewApi.startText(this.formData.resumeText, this.formData.positionText);
            break;
          case "pdf+positionText":
            if (!((_a = this.formData.resumePdf) == null ? void 0 : _a.base64)) {
              throw new Error("PDF\u6587\u4EF6\u672A\u51C6\u5907\u597D");
            }
            res = await common_api_ai.interviewApi.startPdfText(this.formData.resumePdf.base64, this.formData.positionText);
            break;
          case "pdf+position":
            if (!((_b = this.formData.resumePdf) == null ? void 0 : _b.base64)) {
              throw new Error("PDF\u6587\u4EF6\u672A\u51C6\u5907\u597D");
            }
            res = await common_api_ai.interviewApi.startPdfJobId(this.formData.resumePdf.base64, this.formData.positionId);
            break;
          case "user+position":
            res = await common_api_ai.interviewApi.startUserIdJobId(null, this.formData.positionId);
            break;
          case "user+positionText":
            res = await common_api_ai.interviewApi.startUserIdText(this.formData.userId, this.formData.positionText);
            break;
          case "resumeText+position":
            res = await common_api_ai.interviewApi.startTextJobId(this.formData.resumeText, this.formData.positionId);
            break;
          default:
            throw new Error("\u672A\u77E5\u7684\u9762\u8BD5\u65B9\u5F0F");
        }
        console.log("\u9762\u8BD5\u542F\u52A8\u54CD\u5E94", res);
        if (res.code === 200 || ((_c = res.data) == null ? void 0 : _c.session_id)) {
          this.sessionId = res.session_id || ((_d = res.data) == null ? void 0 : _d.session_id);
          this.resumeSource = res.resume_source || ((_e = res.data) == null ? void 0 : _e.resume_source);
          this.jobSource = res.job_source || ((_f = res.data) == null ? void 0 : _f.job_source);
          this.currentQuestion = res.question_number || ((_g = res.data) == null ? void 0 : _g.question_number) || 1;
          const firstQuestion = res.question || ((_h = res.data) == null ? void 0 : _h.question);
          const audioUrl = res.audio_url || ((_i = res.data) == null ? void 0 : _i.audio_url);
          this.interviewStarted = true;
          this.addMessage("interviewer", firstQuestion);
          if (audioUrl) {
            this.currentAudioUrl = audioUrl;
            this.playAudio(audioUrl);
          }
          this.updateInterviewStage();
        } else {
          throw new Error(res.message || "\u542F\u52A8\u9762\u8BD5\u5931\u8D25");
        }
      } catch (error) {
        console.error("\u542F\u52A8\u9762\u8BD5\u5931\u8D25", error);
        common_vendor.index.showToast({
          title: error.message || "\u542F\u52A8\u9762\u8BD5\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
          icon: "none",
          duration: 3e3
        });
      } finally {
        this.isStarting = false;
      }
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
      if (method.includes("user")) {
        if (!this.formData.userId) {
          common_vendor.index.showToast({
            title: "\u672A\u83B7\u53D6\u5230\u7528\u6237\u4FE1\u606F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55",
            icon: "none",
            duration: 3e3
          });
          this.fetchUserInfo();
          return false;
        }
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
    startRecording() {
      if (this.isProcessing || this.isAIThinking) {
        common_vendor.index.showToast({ title: "\u8BF7\u7B49\u5F85AI\u54CD\u5E94", icon: "none" });
        return;
      }
      recorderManager.start({
        duration: 6e4,
        sampleRate: 16e3,
        numberOfChannels: 1,
        encodeBitRate: 96e3,
        format: "mp3"
      });
    },
    stopRecording() {
      if (!this.isRecording)
        return;
      recorderManager.stop();
    },
    startRecordingTimer() {
      this.recordingTime = 0;
      this.recordingTimer = setInterval(() => {
        this.recordingTime++;
        if (this.recordingTime >= 60) {
          this.stopRecording();
        }
      }, 1e3);
    },
    async processAudio(filePath) {
      if (!this.sessionId) {
        common_vendor.index.showToast({ title: "\u4F1A\u8BDD\u5F02\u5E38", icon: "none" });
        return;
      }
      this.isProcessing = true;
      try {
        const uploadRes = await common_api_ai.interviewApi.transcribe(this.sessionId, filePath);
        console.log("\u8BED\u97F3\u8BC6\u522B\u7ED3\u679C", uploadRes);
        let transcribeData;
        if (typeof uploadRes.data === "string") {
          transcribeData = JSON.parse(uploadRes.data);
        } else {
          transcribeData = uploadRes.data;
        }
        if (transcribeData.code === 200 && transcribeData.text) {
          const userText = transcribeData.text;
          this.addMessage("candidate", userText);
          await this.sendAnswer(userText);
        } else {
          throw new Error(transcribeData.message || "\u8BED\u97F3\u8BC6\u522B\u5931\u8D25");
        }
      } catch (error) {
        console.error("\u5904\u7406\u5F55\u97F3\u5931\u8D25", error);
        common_vendor.index.showToast({ title: error.message || "\u8BED\u97F3\u8BC6\u522B\u5931\u8D25", icon: "none" });
      } finally {
        this.isProcessing = false;
      }
    },
    async sendAnswer(userText, endInterview = false) {
      var _a, _b;
      if (!this.sessionId)
        return;
      this.isAIThinking = true;
      try {
        const res = await common_api_ai.interviewApi.answer(this.sessionId, userText, endInterview);
        console.log("AI\u54CD\u5E94", res);
        if (res.code === 200 || res.data) {
          const data = res.data || res;
          if (data.is_ended || data.stage === "ended") {
            this.finishInterview();
            return;
          }
          this.currentQuestion = data.question_number || this.currentQuestion + 1;
          const question = data.question || ((_a = data.data) == null ? void 0 : _a.question);
          this.addMessage("interviewer", question);
          const audioUrl = data.audio_url || ((_b = data.data) == null ? void 0 : _b.audio_url);
          if (audioUrl) {
            this.currentAudioUrl = audioUrl;
            this.playAudio(audioUrl);
          }
          this.currentStage = data.stage || this.currentStage;
          this.updateInterviewStage();
        } else {
          throw new Error(res.message || "\u83B7\u53D6\u56DE\u590D\u5931\u8D25");
        }
      } catch (error) {
        console.error("\u53D1\u9001\u56DE\u7B54\u5931\u8D25", error);
        common_vendor.index.showToast({ title: error.message || "\u83B7\u53D6\u56DE\u590D\u5931\u8D25", icon: "none" });
      } finally {
        this.isAIThinking = false;
      }
    },
    playAudio(url) {
      if (!this.innerAudioContext)
        return;
      this.isSpeaking = true;
      this.voiceWaveActive = true;
      const fullUrl = common_api_ai.getStaticUrl(url);
      console.log("\u64AD\u653E\u97F3\u9891\uFF0C\u5B8C\u6574URL:", fullUrl);
      this.innerAudioContext.offError();
      this.innerAudioContext.offEnded();
      this.innerAudioContext.onError((err) => {
        console.error("\u97F3\u9891\u64AD\u653E\u9519\u8BEF", err);
        this.isSpeaking = false;
        this.voiceWaveActive = false;
        common_vendor.index.showToast({
          title: "\u8BED\u97F3\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u9605\u8BFB\u6587\u5B57",
          icon: "none",
          duration: 3e3
        });
      });
      this.innerAudioContext.onEnded(() => {
        this.isSpeaking = false;
        this.voiceWaveActive = false;
      });
      this.innerAudioContext.src = fullUrl;
      this.innerAudioContext.play();
    },
    replayQuestion() {
      if (this.currentAudioUrl) {
        this.playAudio(this.currentAudioUrl);
      }
    },
    addMessage(sender, content) {
      this.interviewMessages.push({
        sender,
        content,
        timestamp: Date.now()
      });
      this.scrollToBottom();
    },
    updateInterviewStage() {
      const stages = ["\u81EA\u6211\u4ECB\u7ECD", "\u6280\u672F\u80FD\u529B", "\u9879\u76EE\u7ECF\u9A8C", "\u804C\u4E1A\u89C4\u5212", "\u7EFC\u5408\u80FD\u529B"];
      const stageIndex = Math.floor((this.currentQuestion - 1) / (this.totalQuestions / stages.length));
      this.currentStage = stages[stageIndex] || "\u7EFC\u5408\u8BC4\u4F30";
    },
    confirmEndInterview() {
      common_vendor.index.showModal({
        title: "\u7ED3\u675F\u9762\u8BD5",
        content: "\u786E\u5B9A\u8981\u7ED3\u675F\u9762\u8BD5\u5417\uFF1F\u5C06\u751F\u6210\u9762\u8BD5\u62A5\u544A\u3002",
        success: (res) => {
          if (res.confirm) {
            this.endInterview();
          }
        }
      });
    },
    async endInterview() {
      if (!this.sessionId) {
        this.finishInterview();
        return;
      }
      try {
        await this.sendAnswer("\u9762\u8BD5\u7ED3\u675F", true);
      } catch (error) {
        console.log("\u53D1\u9001\u7ED3\u675F\u4FE1\u53F7\u5931\u8D25\uFF0C\u76F4\u63A5\u83B7\u53D6\u62A5\u544A", error);
      }
      this.finishInterview();
    },
    async finishInterview() {
      if (!this.sessionId) {
        this.generateMockReport();
        this.showReport = true;
        return;
      }
      common_vendor.index.showLoading({ title: "\u751F\u6210\u62A5\u544A\u4E2D..." });
      try {
        const res = await common_api_ai.interviewApi.getReport(this.sessionId);
        console.log("\u9762\u8BD5\u62A5\u544A", res);
        if (res.code === 200 || res.data) {
          this.reportData = res.data || res;
          this.parseReportData(this.reportData);
        } else {
          this.generateMockReport();
        }
        this.showReport = true;
        this.$nextTick(() => {
          this.drawRadarChart();
        });
      } catch (error) {
        console.error("\u83B7\u53D6\u62A5\u544A\u5931\u8D25", error);
        this.generateMockReport();
        this.showReport = true;
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    parseReportData(data) {
      this.overallScore = data.overall_score || data.score || 85;
      this.evaluationItems = [
        {
          title: "\u6280\u672F\u80FD\u529B",
          content: data.tech_evaluation || "\u57FA\u7840\u624E\u5B9E\uFF0C\u80FD\u591F\u6E05\u6670\u5730\u89E3\u91CA\u6280\u672F\u6982\u5FF5\u3002"
        },
        {
          title: "\u6C9F\u901A\u80FD\u529B",
          content: data.comm_evaluation || "\u8868\u8FBE\u6E05\u6670\uFF0C\u903B\u8F91\u6027\u5F3A\u3002"
        },
        {
          title: "\u9879\u76EE\u7ECF\u9A8C",
          content: data.project_evaluation || "\u9879\u76EE\u7ECF\u5386\u4E30\u5BCC\uFF0C\u80FD\u591F\u8BE6\u7EC6\u63CF\u8FF0\u9879\u76EE\u7EC6\u8282\u3002"
        }
      ];
      this.suggestions = data.suggestions || [
        "\u5EFA\u8BAE\u5728\u6280\u672F\u6DF1\u5EA6\u65B9\u9762\u7EE7\u7EED\u52A0\u5F3A\u5B66\u4E60",
        "\u53EF\u4EE5\u589E\u52A0\u66F4\u591A\u5B9E\u9645\u9879\u76EE\u6848\u4F8B\u7684\u79EF\u7D2F"
      ];
    },
    generateMockReport() {
      this.overallScore = Math.floor(Math.random() * 20) + 75;
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
        this.chatScrollTop = this.interviewMessages.length * 1e3;
      });
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    },
    closeReport() {
      this.showReport = false;
    },
    restartInterview() {
      this.showReport = false;
      this.resetInterview();
      this.interviewStarted = false;
    },
    exportReport() {
      common_vendor.index.showModal({
        title: "\u5BFC\u51FA\u62A5\u544A",
        content: "\u662F\u5426\u5C06\u9762\u8BD5\u62A5\u544A\u4FDD\u5B58\u5230\u672C\u5730\uFF1F",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({ title: "\u62A5\u544A\u5DF2\u4FDD\u5B58", icon: "success" });
          }
        }
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
      ctx.setFontSize(12);
      ctx.setFillStyle("#666");
      const labels = ["\u6280\u672F", "\u6C9F\u901A", "\u7ECF\u9A8C", "\u6001\u5EA6", "\u6F5C\u529B", "\u7A33\u5B9A"];
      for (let i = 0; i < points; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 20);
        const y = centerY + Math.sin(angle) * (radius + 20);
        ctx.fillText(labels[i], x - 12, y + 6);
      }
    },
    drawRadarData(ctx) {
      const centerX = 150, centerY = 150, radius = 100, points = 6;
      const angleStep = Math.PI * 2 / points;
      const score = this.overallScore / 100;
      const data = [
        0.8 * score,
        0.85 * score,
        0.75 * score,
        0.9 * score,
        0.8 * score,
        0.85 * score
      ];
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
      ctx.setFillStyle("#007aff");
      for (let i = 0; i < points; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = data[i];
        const x = centerX + Math.cos(angle) * (radius * value);
        const y = centerY + Math.sin(angle) * (radius * value);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    resetInterview() {
      this.sessionId = null;
      this.currentQuestion = 0;
      this.interviewMessages = [];
      this.isRecording = false;
      this.isSpeaking = false;
      this.isAIThinking = false;
      this.isProcessing = false;
      this.voiceWaveActive = false;
      this.recordingTime = 0;
      this.currentAudioUrl = "";
      this.audioFilePath = "";
      this.reportData = null;
      this.showReport = false;
      this.clearRecordingTimer();
      if (this.innerAudioContext) {
        this.innerAudioContext.stop();
      }
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
        userId: this.userInfo ? String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id) : "",
        positionId: "",
        positionText: ""
      };
    }
  }
};
const __injectCSSVars__ = () => {
  common_vendor.useCssVars((_ctx) => ({
    "638c375a-overallScore": _ctx.overallScore
  }));
};
const __setup__ = __default__.setup;
__default__.setup = __setup__ ? (props, ctx) => {
  __injectCSSVars__();
  return __setup__(props, ctx);
} : __injectCSSVars__;
const _sfc_main = __default__;
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
  }, $data.currentMethod.includes("user") ? common_vendor.e({
    m: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.formData.userId ? {
    o: common_vendor.t($data.formData.userId)
  } : {
    p: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    n: $data.formData.userId,
    q: $data.isLoadingUser ? 1 : "",
    r: !$data.formData.userId ? 1 : ""
  }) : {}, {
    s: $data.currentMethod.includes("position")
  }, $data.currentMethod.includes("position") ? {
    t: $data.formData.positionId,
    v: common_vendor.o(($event) => $data.formData.positionId = $event.detail.value)
  } : {}, {
    w: $data.currentMethod.includes("positionText")
  }, $data.currentMethod.includes("positionText") ? {
    x: $data.formData.positionText,
    y: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value)
  } : {}, {
    z: common_vendor.t($data.isStarting ? "\u542F\u52A8\u4E2D..." : "\u5F00\u59CB\u9762\u8BD5"),
    A: common_vendor.o((...args) => $options.startInterview && $options.startInterview(...args)),
    B: $data.isStarting
  }) : common_vendor.e({
    C: common_vendor.t($data.currentQuestion),
    D: common_vendor.t($data.totalQuestions),
    E: $options.progressPercent + "%",
    F: common_vendor.t($data.currentStage),
    G: $data.isSpeaking
  }, $data.isSpeaking ? {
    H: common_vendor.f(5, (i, k0, i0) => {
      return {
        a: i,
        b: i * 0.1 + "s"
      };
    }),
    I: common_vendor.n({
      active: $data.voiceWaveActive
    })
  } : {}, {
    J: common_vendor.t($options.getInterviewerStatus()),
    K: common_vendor.f($data.interviewMessages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.content),
        b: common_vendor.t($options.formatTime(message.timestamp)),
        c: index,
        d: common_vendor.n(message.sender)
      };
    }),
    L: $data.isAIThinking
  }, $data.isAIThinking ? {
    M: common_vendor.f(3, (i, k0, i0) => {
      return {
        a: i,
        b: i * 0.2 + "s"
      };
    })
  } : {}, {
    N: $data.chatScrollTop,
    O: common_vendor.n({
      rotated: $data.tipsCollapsed
    }),
    P: common_vendor.o((...args) => $options.toggleTips && $options.toggleTips(...args)),
    Q: !$data.tipsCollapsed
  }, !$data.tipsCollapsed ? {
    R: common_vendor.f($data.currentTips, (tip, index, i0) => {
      return {
        a: common_vendor.t(tip),
        b: index
      };
    })
  } : {}, {
    S: $data.tipsCollapsed ? 1 : "",
    T: common_vendor.o((...args) => $options.replayQuestion && $options.replayQuestion(...args)),
    U: !$data.currentAudioUrl,
    V: $data.isRecording ? "/static/ai/recording.png" : "/static/ai/mic.png",
    W: common_vendor.t($data.isRecording ? "\u5F55\u97F3\u4E2D..." : $data.isProcessing ? "\u5904\u7406\u4E2D..." : "\u6309\u4F4F\u8BF4\u8BDD"),
    X: $data.isRecording ? 1 : "",
    Y: $data.isProcessing ? 1 : "",
    Z: common_vendor.o((...args) => $options.startRecording && $options.startRecording(...args)),
    aa: common_vendor.o((...args) => $options.stopRecording && $options.stopRecording(...args)),
    ab: $data.isProcessing,
    ac: $data.isRecording
  }, $data.isRecording ? {
    ad: common_vendor.t($data.recordingTime)
  } : {}, {
    ae: common_vendor.o((...args) => $options.confirmEndInterview && $options.confirmEndInterview(...args))
  }), {
    af: $data.showReport
  }, $data.showReport ? {
    ag: common_vendor.o((...args) => $options.closeReport && $options.closeReport(...args)),
    ah: common_vendor.t($data.overallScore),
    ai: common_vendor.f($data.evaluationItems, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.content),
        c: index
      };
    }),
    aj: common_vendor.f($data.suggestions, (suggestion, index, i0) => {
      return {
        a: common_vendor.t(suggestion),
        b: index
      };
    }),
    ak: common_vendor.o((...args) => $options.restartInterview && $options.restartInterview(...args)),
    al: common_vendor.o((...args) => $options.exportReport && $options.exportReport(...args)),
    am: common_vendor.o(() => {
    }),
    an: common_vendor.o((...args) => $options.closeReport && $options.closeReport(...args))
  } : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-638c375a"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/AI/interview.vue"]]);
wx.createPage(MiniProgramPage);
