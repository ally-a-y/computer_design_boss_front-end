"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_ai = require("../../common/api/ai.js");
const common_assets = require("../../common/assets.js");
const BASE_URL = "http://localhost:5000";
const recorderManager = common_vendor.index.getRecorderManager();
const _sfc_main = {
  data() {
    return {
      // 页面状态
      interviewStarted: false,
      isStarting: false,
      currentMethod: "resumeText+positionText",
      // 表单数据
      formData: {
        resumeText: "",
        resumePdf: null,
        userId: "",
        positionId: "",
        positionText: "",
        positionName: ""
      },
      // 用户信息
      userInfo: null,
      isLoadingUser: false,
      // 职位数据
      mainCategories: [
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
      ],
      positionDetails: {
        "101": [
          { id: "1", name: "Web前端工程师" },
          { id: "2", name: "移动端前端工程师" },
          { id: "3", name: "小程序开发工程师" },
          { id: "4", name: "跨平台开发工程师" },
          { id: "5", name: "前端架构师" },
          { id: "6", name: "Node.js全栈工程师" }
        ],
        "102": [
          { id: "7", name: "Java开发工程师" },
          { id: "8", name: "Python开发工程师" },
          { id: "9", name: "Go开发工程师" },
          { id: "10", name: "C++开发工程师" },
          { id: "11", name: "PHP开发工程师" },
          { id: "12", name: "微服务架构师" }
        ],
        "103": [
          { id: "13", name: "Android开发工程师" },
          { id: "14", name: "iOS开发工程师" },
          { id: "15", name: "鸿蒙开发工程师" },
          { id: "16", name: "移动游戏开发工程师" }
        ],
        "104": [
          { id: "17", name: "大数据开发工程师" },
          { id: "18", name: "数据仓库工程师" },
          { id: "19", name: "机器学习工程师" },
          { id: "20", name: "深度学习工程师" },
          { id: "21", name: "算法工程师（推荐/广告）" },
          { id: "22", name: "自然语言处理工程师" },
          { id: "23", name: "计算机视觉工程师" },
          { id: "24", name: "数据分析师" },
          { id: "25", name: "数据产品经理" }
        ],
        "105": [
          { id: "26", name: "测试工程师" },
          { id: "27", name: "自动化测试工程师" },
          { id: "28", name: "性能测试工程师" },
          { id: "29", name: "测试开发工程师" },
          { id: "30", name: "安全测试工程师" }
        ],
        "106": [
          { id: "31", name: "运维工程师" },
          { id: "32", name: "DevOps工程师" },
          { id: "33", name: "SRE工程师" },
          { id: "34", name: "云原生工程师" },
          { id: "35", name: "数据库管理员(DBA)" },
          { id: "36", name: "网络工程师" }
        ],
        "107": [
          { id: "37", name: "网络安全工程师" },
          { id: "38", name: "渗透测试工程师" },
          { id: "39", name: "安全运维工程师" },
          { id: "40", name: "逆向工程师" },
          { id: "41", name: "安全架构师" }
        ],
        "108": [
          { id: "42", name: "嵌入式软件工程师" },
          { id: "43", name: "Linux驱动工程师" },
          { id: "44", name: "物联网(IoT)工程师" },
          { id: "45", name: "FPGA工程师" }
        ],
        "200": [
          { id: "46", name: "产品经理（技术型）" },
          { id: "47", name: "UI设计师" },
          { id: "48", name: "交互设计师(IXD)" },
          { id: "49", name: "UX研究员" }
        ],
        "300": [
          { id: "50", name: "技术经理/组长" },
          { id: "51", name: "架构师" },
          { id: "52", name: "研发总监" },
          { id: "53", name: "CTO/技术VP" }
        ]
      },
      // 级联选择器状态
      showCascadePicker: false,
      selectedCategoryId: "",
      selectedCategoryName: "",
      selectedPositionId: "",
      selectedPositionName: "",
      // 面试配置
      interviewMethods: [
        { value: "resumeText+positionText", label: "简历文本+岗位文本" },
        { value: "pdf+positionText", label: "PDF简历+岗位文本" },
        { value: "pdf+position", label: "PDF简历+岗位ID" },
        { value: "user+position", label: "用户ID+岗位ID" },
        { value: "user+positionText", label: "用户ID+岗位文本" },
        { value: "resumeText+position", label: "简历文本+岗位ID" }
      ],
      // 面试流程状态
      sessionId: null,
      currentQuestion: 0,
      totalQuestions: 8,
      currentStage: "自我介绍",
      resumeSource: "",
      jobSource: "",
      // 录音状态
      isRecording: false,
      isSpeaking: false,
      isAIThinking: false,
      isProcessing: false,
      voiceWaveActive: false,
      recordingTime: 0,
      recordingTimer: null,
      audioFilePath: "",
      // 音频播放
      currentAudioUrl: "",
      innerAudioContext: null,
      // 对话数据
      interviewMessages: [],
      chatScrollTop: 0,
      // 面试技巧
      tipsCollapsed: false,
      currentTips: [
        "保持自信，语速适中",
        "回答问题要有条理，使用STAR法则",
        "适当使用专业术语展示能力",
        "注意与面试官的眼神交流",
        "遇到不会的问题诚实回答"
      ],
      // 面试报告数据
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
    // 当前分类下的职位列表
    currentPositions() {
      if (!this.selectedCategoryId)
        return [];
      return this.positionDetails[this.selectedCategoryId] || [];
    },
    // 判断是否已获取到用户信息
    hasUserInfo() {
      return !!this.formData.userId;
    }
  },
  onLoad() {
    this.initializeInterview();
    this.initRecorder();
    this.fetchUserInfo();
    this.resetPositionSelection();
  },
  onUnload() {
    this.cleanupInterview();
  },
  methods: {
    // ==================== 职位选择（级联弹窗） ====================
    openCascadePicker() {
      var _a;
      this.showCascadePicker = true;
      if (this.formData.positionId) {
        let foundCategoryId = null;
        let foundCategoryName = null;
        let foundPositionName = null;
        for (const [catId, positions] of Object.entries(this.positionDetails)) {
          const pos = positions.find((p) => p.id === this.formData.positionId);
          if (pos) {
            foundCategoryId = catId;
            foundCategoryName = ((_a = this.mainCategories.find((c) => c.id === catId)) == null ? void 0 : _a.name) || "";
            foundPositionName = pos.name;
            break;
          }
        }
        if (foundCategoryId) {
          this.selectedCategoryId = foundCategoryId;
          this.selectedCategoryName = foundCategoryName;
          this.selectedPositionId = this.formData.positionId;
          this.selectedPositionName = foundPositionName;
          return;
        }
      }
      if (!this.selectedCategoryId) {
        const firstCategory = this.mainCategories[0];
        if (firstCategory) {
          this.selectedCategoryId = firstCategory.id;
          this.selectedCategoryName = firstCategory.name;
          const positions = this.positionDetails[firstCategory.id] || [];
          if (positions.length > 0) {
            const firstPosition = positions[0];
            this.selectedPositionId = firstPosition.id;
            this.selectedPositionName = firstPosition.name;
          }
        }
      }
    },
    closeCascadePicker() {
      this.showCascadePicker = false;
    },
    selectCategory(category) {
      this.selectedCategoryId = category.id;
      this.selectedCategoryName = category.name;
      const positions = this.positionDetails[category.id] || [];
      if (positions.length > 0) {
        const firstPosition = positions[0];
        this.selectedPositionId = firstPosition.id;
        this.selectedPositionName = firstPosition.name;
      } else {
        this.selectedPositionId = "";
        this.selectedPositionName = "";
      }
    },
    selectPosition(position) {
      this.selectedPositionId = position.id;
      this.selectedPositionName = position.name;
    },
    confirmCascadeSelection() {
      if (!this.selectedPositionId) {
        common_vendor.index.showToast({ title: "请选择职位", icon: "none" });
        return;
      }
      this.formData.positionId = this.selectedPositionId;
      this.formData.positionName = this.selectedPositionName;
      this.showCascadePicker = false;
      common_vendor.index.showToast({
        title: `已选择: ${this.selectedCategoryName} - ${this.selectedPositionName}`,
        icon: "none",
        duration: 1500
      });
    },
    resetPositionSelection() {
      this.selectedCategoryId = "";
      this.selectedCategoryName = "";
      this.selectedPositionId = "";
      this.selectedPositionName = "";
      this.formData.positionId = "";
      this.formData.positionName = "";
    },
    // ==================== 用户信息 ====================
    async fetchUserInfo() {
      this.isLoadingUser = true;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.__f__("log", "at pages/AI/interview.vue:533", "未找到登录token，需要用户登录");
          this.formData.userId = null;
          return;
        }
        const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (cachedUserInfo && cachedUserInfo.user_id) {
          this.userInfo = cachedUserInfo;
          this.formData.userId = String(cachedUserInfo.user_id);
          common_vendor.index.__f__("log", "at pages/AI/interview.vue:541", "从缓存获取用户ID:", this.formData.userId);
          return;
        }
        const res = await this.getUserProfile();
        if (res.code === 200 && res.data) {
          this.userInfo = res.data;
          this.formData.userId = String(res.data.user_id || res.data.userId || res.data.id);
          common_vendor.index.setStorageSync("userInfo", res.data);
          common_vendor.index.__f__("log", "at pages/AI/interview.vue:549", "从后端获取用户ID:", this.formData.userId);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/interview.vue:552", "获取用户信息失败:", error);
        common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none", duration: 2e3 });
        this.formData.userId = null;
      } finally {
        this.isLoadingUser = false;
      }
    },
    getUserProfile() {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: `${BASE_URL}/api/user/profile`,
          method: "GET",
          header: { "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}` },
          success: (res) => resolve(res.data),
          fail: (err) => reject(err)
        });
      });
    },
    // ==================== 初始化 ====================
    initializeInterview() {
      this.innerAudioContext = common_vendor.index.createInnerAudioContext();
      this.innerAudioContext.onEnded(() => {
        this.isSpeaking = false;
        this.voiceWaveActive = false;
      });
      this.innerAudioContext.onError((err) => {
        common_vendor.index.__f__("error", "at pages/AI/interview.vue:580", "音频播放错误", err);
        this.isSpeaking = false;
        this.voiceWaveActive = false;
      });
    },
    initRecorder() {
      recorderManager.onStart(() => {
        common_vendor.index.__f__("log", "at pages/AI/interview.vue:587", "录音开始");
        this.isRecording = true;
        this.startRecordingTimer();
      });
      recorderManager.onStop((res) => {
        common_vendor.index.__f__("log", "at pages/AI/interview.vue:592", "录音结束", res);
        this.isRecording = false;
        this.clearRecordingTimer();
        this.audioFilePath = res.tempFilePath;
        this.processAudio(res.tempFilePath);
      });
      recorderManager.onError((err) => {
        common_vendor.index.__f__("error", "at pages/AI/interview.vue:599", "录音错误", err);
        this.isRecording = false;
        this.clearRecordingTimer();
        common_vendor.index.showToast({ title: "录音失败: " + err.message, icon: "none" });
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
    getInterviewerStatus() {
      if (this.isAIThinking)
        return "思考中...";
      if (this.isSpeaking)
        return "说话中...";
      if (this.isProcessing)
        return "处理中...";
      return "等待中";
    },
    // ==================== 导航 ====================
    goBack() {
      if (this.interviewStarted) {
        common_vendor.index.showModal({
          title: "提示",
          content: "确定要结束面试吗？当前进度将不会保存。",
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
    // ==================== 配置切换 ====================
    selectMethod(method) {
      this.currentMethod = method;
      this.resetForm();
      if (this.userInfo) {
        this.formData.userId = String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id);
      }
      if (method.includes("position")) {
        this.resetPositionSelection();
      }
    },
    // ==================== 文件上传 ====================
    chooseResumeFile() {
      common_vendor.wx$1.chooseMessageFile({
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
              common_vendor.index.__f__("error", "at pages/AI/interview.vue:675", "读取文件失败", err);
              common_vendor.index.showToast({ title: "文件读取失败", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/AI/interview.vue:681", "选择文件取消或失败", err);
        }
      });
    },
    // ==================== 表单验证 ====================
    validateForm() {
      const method = this.currentMethod;
      if (method.includes("resumeText") && !this.formData.resumeText.trim()) {
        common_vendor.index.showToast({ title: "请输入简历文本", icon: "none" });
        return false;
      }
      if (method.includes("pdf") && !this.formData.resumePdf) {
        common_vendor.index.showToast({ title: "请上传PDF简历", icon: "none" });
        return false;
      }
      if (method.includes("user")) {
        if (!this.formData.userId) {
          common_vendor.index.showToast({ title: "未获取到用户信息，请重新登录", icon: "none", duration: 3e3 });
          this.fetchUserInfo();
          return false;
        }
      }
      if (method.includes("position")) {
        if (!this.selectedPositionId) {
          common_vendor.index.showToast({ title: "请选择职位", icon: "none" });
          return false;
        }
      }
      if (method.includes("positionText") && !this.formData.positionText.trim()) {
        common_vendor.index.showToast({ title: "请输入岗位描述", icon: "none" });
        return false;
      }
      return true;
    },
    // ==================== 开始面试 ====================
    async startInterview() {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      if (!this.validateForm())
        return;
      this.isStarting = true;
      try {
        let res;
        switch (this.currentMethod) {
          case "resumeText+positionText":
            res = await common_api_ai.interviewApi.startText(this.formData.resumeText, this.formData.positionText);
            break;
          case "pdf+positionText":
            if (!((_a = this.formData.resumePdf) == null ? void 0 : _a.base64))
              throw new Error("PDF文件未准备好");
            res = await common_api_ai.interviewApi.startPdfText(this.formData.resumePdf.base64, this.formData.positionText);
            break;
          case "pdf+position":
            if (!((_b = this.formData.resumePdf) == null ? void 0 : _b.base64))
              throw new Error("PDF文件未准备好");
            if (!this.formData.positionName)
              throw new Error("请选择有效的职位");
            res = await common_api_ai.interviewApi.startPdfJobName(this.formData.resumePdf.base64, this.formData.positionName);
            break;
          case "user+position":
            if (!this.formData.positionName)
              throw new Error("请选择有效的职位");
            res = await common_api_ai.interviewApi.startUserIdJobName(this.formData.userId, this.formData.positionName);
            break;
          case "user+positionText":
            res = await common_api_ai.interviewApi.startUserIdText(this.formData.userId, this.formData.positionText);
            break;
          case "resumeText+position":
            if (!this.formData.positionName)
              throw new Error("请选择有效的职位");
            res = await common_api_ai.interviewApi.startTextJobName(this.formData.resumeText, this.formData.positionName);
            break;
          default:
            throw new Error("未知的面试方式");
        }
        common_vendor.index.__f__("log", "at pages/AI/interview.vue:786", "面试启动响应", res);
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
          throw new Error(res.message || "启动面试失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/interview.vue:808", "启动面试失败", error);
        common_vendor.index.showToast({ title: error.message || "启动面试失败，请重试", icon: "none", duration: 3e3 });
      } finally {
        this.isStarting = false;
      }
    },
    // ==================== 录音相关 ====================
    startRecording() {
      if (this.isProcessing || this.isAIThinking) {
        common_vendor.index.showToast({ title: "请等待AI响应", icon: "none" });
        return;
      }
      recorderManager.start({ duration: 18e4, sampleRate: 16e3, numberOfChannels: 1, encodeBitRate: 96e3, format: "mp3" });
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
        if (this.recordingTime >= 180)
          this.stopRecording();
      }, 1e3);
    },
    clearRecordingTimer() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }
    },
    async processAudio(filePath) {
      if (!this.sessionId) {
        common_vendor.index.showToast({ title: "会话异常", icon: "none" });
        return;
      }
      this.isProcessing = true;
      try {
        const uploadRes = await common_api_ai.interviewApi.transcribe(this.sessionId, filePath);
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
          throw new Error(transcribeData.message || "语音识别失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/interview.vue:862", "处理录音失败", error);
        common_vendor.index.showToast({ title: error.message || "语音识别失败", icon: "none" });
      } finally {
        this.isProcessing = false;
      }
    },
    // ==================== 对话交互 ====================
    async sendAnswer(userText, endInterview = false) {
      var _a, _b;
      if (!this.sessionId)
        return;
      this.isAIThinking = true;
      try {
        const res = await common_api_ai.interviewApi.answer(this.sessionId, userText, endInterview);
        common_vendor.index.__f__("log", "at pages/AI/interview.vue:875", "AI响应", res);
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
          throw new Error(res.message || "获取回复失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/interview.vue:896", "发送回答失败", error);
        common_vendor.index.showToast({ title: error.message || "获取回复失败", icon: "none" });
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
      common_vendor.index.__f__("log", "at pages/AI/interview.vue:907", "播放音频，完整URL:", fullUrl);
      this.innerAudioContext.offError();
      this.innerAudioContext.offEnded();
      this.innerAudioContext.onError((err) => {
        common_vendor.index.__f__("error", "at pages/AI/interview.vue:911", "音频播放错误", err);
        this.isSpeaking = false;
        this.voiceWaveActive = false;
        common_vendor.index.showToast({ title: "语音加载失败，请阅读文字", icon: "none", duration: 3e3 });
      });
      this.innerAudioContext.onEnded(() => {
        this.isSpeaking = false;
        this.voiceWaveActive = false;
      });
      this.innerAudioContext.src = fullUrl;
      this.innerAudioContext.play();
    },
    replayQuestion() {
      if (this.currentAudioUrl)
        this.playAudio(this.currentAudioUrl);
    },
    addMessage(sender, content) {
      this.interviewMessages.push({ sender, content, timestamp: Date.now() });
      this.scrollToBottom();
    },
    updateInterviewStage() {
      const stages = ["自我介绍", "技术能力", "项目经验", "职业规划", "综合能力"];
      const stageIndex = Math.floor((this.currentQuestion - 1) / (this.totalQuestions / stages.length));
      this.currentStage = stages[stageIndex] || "综合评估";
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
    // ==================== 面试结束与报告 ====================
    confirmEndInterview() {
      common_vendor.index.showModal({
        title: "结束面试",
        content: "确定要结束面试吗？将生成面试报告。",
        success: (res) => {
          if (res.confirm)
            this.endInterview();
        }
      });
    },
    async endInterview() {
      if (!this.sessionId) {
        this.finishInterview();
        return;
      }
      try {
        await this.sendAnswer("面试结束", true);
      } catch (error) {
        common_vendor.index.__f__("log", "at pages/AI/interview.vue:959", "发送结束信号失败，直接获取报告", error);
      }
      this.finishInterview();
    },
    async finishInterview() {
      if (!this.sessionId) {
        this.generateMockReport();
        this.showReport = true;
        return;
      }
      common_vendor.index.showLoading({ title: "生成报告中..." });
      try {
        const res = await common_api_ai.interviewApi.getReport(this.sessionId);
        common_vendor.index.__f__("log", "at pages/AI/interview.vue:972", "面试报告", res);
        if (res.code === 200 || res.data) {
          this.reportData = res.data || res;
          this.parseReportData(this.reportData);
        } else {
          this.generateMockReport();
        }
        this.showReport = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.drawRadarChart();
          }, 200);
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/interview.vue:986", "获取报告失败", error);
        this.generateMockReport();
        this.showReport = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.drawRadarChart();
          }, 200);
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    parseReportData(data) {
      this.overallScore = data.overall_score || data.score || 85;
      this.evaluationItems = [
        { title: "技术能力", content: data.tech_evaluation || "基础扎实，能够清晰地解释技术概念。" },
        { title: "沟通能力", content: data.comm_evaluation || "表达清晰，逻辑性强。" },
        { title: "项目经验", content: data.project_evaluation || "项目经历丰富，能够详细描述项目细节。" }
      ];
      this.suggestions = data.suggestions || [
        "建议在技术深度方面继续加强学习",
        "可以增加更多实际项目案例的积累"
      ];
    },
    generateMockReport() {
      this.overallScore = Math.floor(Math.random() * 20) + 75;
      this.evaluationItems = [
        { title: "技术能力", content: "基础扎实，能够清晰地解释技术概念，但在某些深度问题上略显不足。" },
        { title: "沟通能力", content: "表达清晰，逻辑性强，能够很好地理解问题并给出合适的回答。" },
        { title: "项目经验", content: "项目经历丰富，能够详细描述项目细节和个人贡献。" }
      ];
      this.suggestions = [
        "建议在技术深度方面继续加强学习",
        "可以增加更多实际项目案例的积累",
        "面试时保持更好的眼神交流",
        "适当准备一些行为面试问题的回答"
      ];
    },
    toggleTips() {
      this.tipsCollapsed = !this.tipsCollapsed;
    },
    closeReport() {
      this.showReport = false;
    },
    restartInterview() {
      this.showReport = false;
      this.resetInterview();
      this.interviewStarted = false;
    },
    async exportReport() {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>面试报告</title>
          <style>
            body { font-family: '微软雅黑', '宋体', Arial, sans-serif; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #007aff; padding-bottom: 10px; }
            .score { font-size: 48px; color: #007aff; font-weight: bold; margin: 20px 0; }
            .section { margin: 30px 0; }
            .section-title { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 15px; }
            .item { margin-bottom: 20px; }
            .item-title { font-size: 18px; font-weight: bold; color: #007aff; }
            .item-content { margin-top: 5px; line-height: 1.6; }
            .suggestion { margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>AI 模拟面试报告</h1>
          <div class="section">
            <div class="section-title">综合评分</div>
            <div class="score">${this.overallScore} / 100</div>
          </div>
          <div class="section">
            <div class="section-title">详细评价</div>
            ${this.evaluationItems.map((item) => `
              <div class="item">
                <div class="item-title">${item.title}</div>
                <div class="item-content">${item.content}</div>
              </div>
            `).join("")}
          </div>
          <div class="section">
            <div class="section-title">改进建议</div>
            ${this.suggestions.map((s) => `<div class="suggestion">• ${s}</div>`).join("")}
          </div>
          <p style="margin-top: 40px; color: #999; font-size: 12px;">生成时间：${(/* @__PURE__ */ new Date()).toLocaleString()}</p>
        </body>
        </html>
      `;
      const fs = common_vendor.index.getFileSystemManager();
      const filePath = `${common_vendor.index.env.USER_DATA_PATH}/report_${Date.now()}.doc`;
      fs.writeFile({
        filePath,
        data: htmlContent,
        encoding: "utf8",
        success: () => {
          common_vendor.index.openDocument({
            filePath,
            success: () => {
              common_vendor.index.showToast({ title: "报告已保存并打开", icon: "success" });
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/AI/interview.vue:1093", "打开文件失败", err);
              common_vendor.index.showToast({ title: "报告已保存，但打开失败", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/AI/interview.vue:1099", "写入文件失败", err);
          common_vendor.index.showToast({ title: "导出失败", icon: "none" });
        }
      });
    },
    drawRadarChart() {
      const query = common_vendor.index.createSelectorQuery().in(this);
      query.select(".radar-canvas").boundingClientRect((rect) => {
        if (!rect || rect.width === 0 || rect.height === 0) {
          setTimeout(() => this.drawRadarChart(), 100);
          return;
        }
        const canvasWidth = rect.width;
        const canvasHeight = rect.height;
        const ctx = common_vendor.index.createCanvasContext("radarChart", this);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const radius = Math.min(canvasWidth, canvasHeight) * 0.35;
        const points = 6;
        const angleStep = Math.PI * 2 / points;
        this.drawRadarGrid(ctx, centerX, centerY, radius, points, angleStep);
        const score = this.overallScore / 100;
        const data = [0.8 * score, 0.85 * score, 0.75 * score, 0.9 * score, 0.8 * score, 0.85 * score];
        this.drawRadarData(ctx, centerX, centerY, radius, points, angleStep, data);
        const labels = ["技术", "沟通", "经验", "态度", "潜力", "稳定"];
        this.drawRadarLabels(ctx, centerX, centerY, radius, points, angleStep, labels);
        ctx.draw();
      }).exec();
    },
    drawRadarGrid(ctx, centerX, centerY, radius, points, angleStep) {
      ctx.setStrokeStyle("#e0e0e0");
      ctx.setLineWidth(1);
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        const r = radius * i / 5;
        for (let j = 0; j <= points; j++) {
          const angle = j * angleStep - Math.PI / 2;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          if (j === 0)
            ctx.moveTo(x, y);
          else
            ctx.lineTo(x, y);
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
    drawRadarData(ctx, centerX, centerY, radius, points, angleStep, data) {
      ctx.setFillStyle("rgba(0, 122, 255, 0.3)");
      ctx.setStrokeStyle("#007aff");
      ctx.setLineWidth(2);
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = data[i % points];
        const x = centerX + Math.cos(angle) * (radius * value);
        const y = centerY + Math.sin(angle) * (radius * value);
        if (i === 0)
          ctx.moveTo(x, y);
        else
          ctx.lineTo(x, y);
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
    drawRadarLabels(ctx, centerX, centerY, radius, points, angleStep, labels) {
      ctx.setFontSize(12);
      ctx.setFillStyle("#666");
      const labelRadius = radius + 18;
      for (let i = 0; i < points; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        ctx.fillText(labels[i], x - 12, y + 6);
      }
    },
    // ==================== 重置 ====================
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
      if (this.innerAudioContext)
        this.innerAudioContext.stop();
    },
    resetForm() {
      this.formData = {
        resumeText: "",
        resumePdf: null,
        userId: this.userInfo ? String(this.userInfo.user_id || this.userInfo.userId || this.userInfo.id) : "",
        positionId: "",
        positionText: "",
        positionName: ""
      };
      this.resetPositionSelection();
    }
  }
};
const __injectCSSVars__ = () => {
  common_vendor.useCssVars((_ctx) => ({
    "b122b140": _ctx.overallScore
  }));
};
const __setup__ = _sfc_main.setup;
_sfc_main.setup = __setup__ ? (props, ctx) => {
  __injectCSSVars__();
  return __setup__(props, ctx);
} : __injectCSSVars__;
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$2,
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: !$data.interviewStarted
  }, !$data.interviewStarted ? common_vendor.e({
    d: common_vendor.f($data.interviewMethods, (method, index, i0) => {
      return {
        a: common_vendor.t(method.label),
        b: index,
        c: common_vendor.n({
          active: $data.currentMethod === method.value
        }),
        d: common_vendor.o(($event) => $options.selectMethod(method.value), index)
      };
    }),
    e: $data.currentMethod.includes("resumeText")
  }, $data.currentMethod.includes("resumeText") ? {
    f: $data.formData.resumeText,
    g: common_vendor.o(($event) => $data.formData.resumeText = $event.detail.value)
  } : {}, {
    h: $data.currentMethod.includes("pdf")
  }, $data.currentMethod.includes("pdf") ? common_vendor.e({
    i: !$data.formData.resumePdf
  }, !$data.formData.resumePdf ? {
    j: common_assets._imports_1$1
  } : {}, {
    k: !$data.formData.resumePdf
  }, !$data.formData.resumePdf ? {} : {
    l: common_vendor.t($data.formData.resumePdf.name)
  }, {
    m: common_vendor.o((...args) => $options.chooseResumeFile && $options.chooseResumeFile(...args))
  }) : {}, {
    n: $data.currentMethod.includes("user")
  }, $data.currentMethod.includes("user") ? common_vendor.e({
    o: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.formData.userId ? {
    q: common_vendor.t($data.formData.userId)
  } : {
    r: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    p: $data.formData.userId,
    s: $data.isLoadingUser ? 1 : "",
    t: !$data.formData.userId && !$data.isLoadingUser ? 1 : ""
  }) : {}, {
    v: $data.currentMethod.includes("position")
  }, $data.currentMethod.includes("position") ? common_vendor.e({
    w: $data.selectedPositionId
  }, $data.selectedPositionId ? {
    x: common_vendor.t($data.selectedCategoryName),
    y: common_vendor.t($data.selectedPositionName)
  } : {}, {
    z: !$data.selectedPositionId ? 1 : "",
    A: common_vendor.o((...args) => $options.openCascadePicker && $options.openCascadePicker(...args))
  }) : {}, {
    B: $data.currentMethod.includes("positionText")
  }, $data.currentMethod.includes("positionText") ? {
    C: $data.formData.positionText,
    D: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value)
  } : {}, {
    E: common_vendor.t($data.isStarting ? "启动中..." : "开始面试"),
    F: common_vendor.o((...args) => $options.startInterview && $options.startInterview(...args)),
    G: $data.isStarting
  }) : common_vendor.e({
    H: common_vendor.t($data.currentQuestion),
    I: common_vendor.t($data.totalQuestions),
    J: $options.progressPercent + "%",
    K: common_vendor.t($data.currentStage),
    L: common_assets._imports_2,
    M: $data.isSpeaking
  }, $data.isSpeaking ? {
    N: common_vendor.f(5, (i, k0, i0) => {
      return {
        a: i,
        b: i * 0.1 + "s"
      };
    }),
    O: common_vendor.n({
      active: $data.voiceWaveActive
    })
  } : {}, {
    P: common_vendor.t($options.getInterviewerStatus()),
    Q: common_vendor.f($data.interviewMessages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.content),
        b: common_vendor.t($options.formatTime(message.timestamp)),
        c: index,
        d: common_vendor.n(message.sender)
      };
    }),
    R: $data.isAIThinking
  }, $data.isAIThinking ? {
    S: common_vendor.f(3, (i, k0, i0) => {
      return {
        a: i,
        b: i * 0.2 + "s"
      };
    })
  } : {}, {
    T: $data.chatScrollTop,
    U: common_vendor.n({
      rotated: $data.tipsCollapsed
    }),
    V: common_assets._imports_3,
    W: common_vendor.o((...args) => $options.toggleTips && $options.toggleTips(...args)),
    X: !$data.tipsCollapsed
  }, !$data.tipsCollapsed ? {
    Y: common_vendor.f($data.currentTips, (tip, index, i0) => {
      return {
        a: common_vendor.t(tip),
        b: index
      };
    })
  } : {}, {
    Z: $data.tipsCollapsed ? 1 : "",
    aa: common_assets._imports_4,
    ab: common_vendor.o((...args) => $options.replayQuestion && $options.replayQuestion(...args)),
    ac: !$data.currentAudioUrl,
    ad: $data.isRecording ? "/static/ai/recording.png" : "/static/ai/mic.png",
    ae: common_vendor.t($data.isRecording ? "录音中..." : $data.isProcessing ? "处理中..." : "按住说话"),
    af: $data.isRecording ? 1 : "",
    ag: $data.isProcessing ? 1 : "",
    ah: common_vendor.o((...args) => $options.startRecording && $options.startRecording(...args)),
    ai: common_vendor.o((...args) => $options.stopRecording && $options.stopRecording(...args)),
    aj: $data.isProcessing,
    ak: $data.isRecording
  }, $data.isRecording ? {
    al: common_vendor.t($data.recordingTime)
  } : {}, {
    am: common_assets._imports_5,
    an: common_vendor.o((...args) => $options.confirmEndInterview && $options.confirmEndInterview(...args))
  }), {
    ao: $data.showReport
  }, $data.showReport ? {
    ap: common_assets._imports_6,
    aq: common_vendor.o((...args) => $options.closeReport && $options.closeReport(...args)),
    ar: common_vendor.t($data.overallScore),
    as: common_vendor.f($data.evaluationItems, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.content),
        c: index
      };
    }),
    at: common_vendor.f($data.suggestions, (suggestion, index, i0) => {
      return {
        a: common_vendor.t(suggestion),
        b: index
      };
    }),
    av: common_vendor.o((...args) => $options.restartInterview && $options.restartInterview(...args)),
    aw: common_vendor.o((...args) => $options.exportReport && $options.exportReport(...args)),
    ax: common_vendor.o(() => {
    }),
    ay: common_vendor.o((...args) => $options.closeReport && $options.closeReport(...args))
  } : {}, {
    az: $data.showCascadePicker
  }, $data.showCascadePicker ? {
    aA: common_vendor.o((...args) => $options.confirmCascadeSelection && $options.confirmCascadeSelection(...args)),
    aB: common_vendor.f($data.mainCategories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: common_vendor.n($data.selectedCategoryId === category.id ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectCategory(category), category.id)
      };
    }),
    aC: common_vendor.f($options.currentPositions, (position, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(position.name),
        b: $data.selectedPositionId === position.id
      }, $data.selectedPositionId === position.id ? {} : {}, {
        c: position.id,
        d: common_vendor.n($data.selectedPositionId === position.id ? "active" : ""),
        e: common_vendor.o(($event) => $options.selectPosition(position), position.id)
      });
    }),
    aD: common_vendor.o(() => {
    }),
    aE: common_vendor.o((...args) => $options.closeCascadePicker && $options.closeCascadePicker(...args))
  } : {}, {
    aF: common_vendor.s(_ctx.__cssVars())
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c7f67547"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/interview.js.map
