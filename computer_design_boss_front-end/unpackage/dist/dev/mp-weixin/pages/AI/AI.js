"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_ai = require("../../common/api/ai.js");
const common_assets = require("../../common/assets.js");
const BASE_URL = "http://localhost:5000";
const _sfc_main = {
  data() {
    return {
      messages: [
        {
          sender: "ai",
          content: "您好！我是AI求职助手，可以帮助您分析简历、评估求职成功率，还可以进行模拟面试。请问有什么可以帮助您的？",
          timestamp: Date.now(),
          expanded: false
        }
      ],
      inputText: "",
      scrollTop: 0,
      isLoading: false,
      currentPanel: null,
      currentMethod: "user+position",
      isLoadingUser: false,
      userInfo: null,
      currentUserId: null,
      formData: {
        positionId: "",
        positionText: "",
        pdfFile: null,
        positionName: ""
      },
      gradeIndex: 0,
      gradeOptions: ["大一", "大二", "大三", "大四", "研一", "研二", "研三"],
      // 级联选择
      showCascadePicker: false,
      selectedCategoryId: "",
      selectedCategoryName: "",
      selectedPositionId: "",
      selectedPositionName: "",
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
      analysisMethods: [
        { value: "user+position", label: "我的简历+职位" },
        { value: "user+text", label: "我的简历+职位文本" },
        { value: "pdf+position", label: "PDF+职位" },
        { value: "pdf+text", label: "PDF+职位文本" }
      ]
    };
  },
  computed: {
    panelTitle() {
      const titles = {
        resumeAnalysis: "简历分析",
        resumeEvaluation: "简历评估",
        successRate: "成功率分析",
        studentPlan: "大学生规划"
      };
      return titles[this.currentPanel] || "";
    },
    // 当前分类下的职位列表
    currentPositions() {
      if (!this.selectedCategoryId)
        return [];
      return this.positionDetails[this.selectedCategoryId] || [];
    }
  },
  onLoad() {
    this.initializeChat();
    this.fetchUserInfo();
    this.initializeDefaultSelection();
  },
  onUnload() {
    this.cleanup();
  },
  methods: {
    initializeChat() {
    },
    // 修改初始化方法：不再自动选择默认职位
    initializeDefaultSelection() {
      this.selectedCategoryId = "";
      this.selectedCategoryName = "";
      this.selectedPositionId = "";
      this.selectedPositionName = "";
      this.formData.positionId = "";
      this.formData.positionName = "";
    },
    // MODIFIED: 打开级联选择器，根据表单已选职位初始化，若无则默认选中第一个分类的第一个职位
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
    // MODIFIED: 选择分类时自动选中该分类下第一个职位，但不更新表单
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
    // MODIFIED: 选择职位时仅更新选中变量，不自动关闭弹窗，不更新表单
    selectPosition(position) {
      this.selectedPositionId = position.id;
      this.selectedPositionName = position.name;
    },
    // MODIFIED: 确定选择，将选中职位同步到表单并关闭弹窗
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
    // 获取用户信息
    async fetchUserInfo() {
      this.isLoadingUser = true;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.__f__("log", "at pages/AI/AI.vue:573", "未找到登录token，需要用户登录");
          this.currentUserId = null;
          return;
        }
        const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (cachedUserInfo && cachedUserInfo.user_id) {
          this.userInfo = cachedUserInfo;
          this.currentUserId = String(cachedUserInfo.user_id);
          common_vendor.index.__f__("log", "at pages/AI/AI.vue:582", "从缓存获取用户ID:", this.currentUserId);
          return;
        }
        const res = await this.getUserProfile();
        if (res.code === 200 && res.data) {
          this.userInfo = res.data;
          this.currentUserId = String(res.data.user_id || res.data.userId || res.data.id);
          common_vendor.index.setStorageSync("userInfo", res.data);
          common_vendor.index.__f__("log", "at pages/AI/AI.vue:592", "从后端获取用户ID:", this.currentUserId);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:595", "获取用户信息失败:", error);
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none",
          duration: 2e3
        });
        this.currentUserId = null;
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
    cleanup() {
    },
    goToInterview() {
      common_vendor.index.navigateTo({
        url: "/pages/AI/interview"
      });
    },
    async sendMessage() {
      if (!this.inputText.trim() || this.isLoading)
        return;
      const userMessage = this.inputText.trim();
      this.messages.push({
        sender: "user",
        content: userMessage,
        timestamp: Date.now()
      });
      this.scrollToBottom();
      this.isLoading = true;
      this.inputText = "";
      try {
        const res = await common_api_ai.aiApi.chat(userMessage);
        let aiContent = "";
        if (typeof res === "string") {
          aiContent = this.preprocessContent(res);
        } else if (res && res.response) {
          if (Array.isArray(res.response)) {
            aiContent = res.response.filter((item) => item.role === "assistant").map((item) => item.content).join("\n");
          } else if (typeof res.response === "string") {
            aiContent = this.preprocessContent(res.response);
          } else {
            aiContent = JSON.stringify(res.response);
          }
        } else {
          aiContent = (res == null ? void 0 : res.data) || (res == null ? void 0 : res.message) || JSON.stringify(res) || "AI未返回有效内容";
        }
        this.messages.push({
          sender: "ai",
          content: aiContent || "AI未返回有效内容",
          timestamp: Date.now(),
          expanded: false
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:681", "AI对话失败:", error);
        this.messages.push({
          sender: "ai",
          content: "抱歉，服务暂时不可用，请稍后重试。",
          timestamp: Date.now(),
          expanded: false
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    openPanel(panelType) {
      this.currentPanel = panelType;
      this.currentMethod = this.getDefaultMethod(panelType);
      if (!this.currentUserId && !this.isLoadingUser) {
        this.fetchUserInfo();
      }
      if (!this.selectedCategoryId) {
        this.initializeDefaultSelection();
      }
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
      return defaults[panelType] || "user+position";
    },
    onMethodChange(e) {
      this.currentMethod = e.detail.value;
    },
    onGradeChange(e) {
      this.gradeIndex = parseInt(e.detail.value);
    },
    preprocessContent(text) {
      if (!text)
        return "";
      let processed = text;
      processed = processed.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\t/g, "	").replace(/\\r/g, "").replace(/\\\\/g, "\\");
      processed = processed.replace(/\s*,\s*"role"\s*:\s*"assistant"\s*\]?\}?$/g, "").replace(/\s*,\s*"role"\s*:\s*"user"\s*\]?\}?$/g, "").replace(/\]?\}?\s*$/, "");
      return processed;
    },
    parseMarkdown(text) {
      if (!text)
        return "";
      let html = this.preprocessContent(text);
      html = html.replace(/^\s*#\s*$/gm, "").replace(/^\s*---\s*$/gm, "").replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:600;color:#222;">$1</strong>').replace(/\*([^*\n]+)\*/g, '<em style="font-style:italic;color:#555;">$1</em>').replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2rpx 8rpx;border-radius:4rpx;color:#e83e8c;font-size:28rpx;">$1</code>').replace(/###\s+([^\n]+)/g, '<strong style="font-size:32rpx;font-weight:600;display:block;margin:16rpx 0 8rpx;color:#333;">$1</strong>').replace(/##\s+([^\n]+)/g, '<strong style="font-size:34rpx;font-weight:600;display:block;margin:20rpx 0 12rpx;color:#222;border-bottom:2rpx solid #eee;padding-bottom:6rpx;">$1</strong>').replace(/#\s+([^\n]+)/g, '<strong style="font-size:36rpx;font-weight:600;display:block;margin:24rpx 0 16rpx;color:#111;">$1</strong>');
      html = html.replace(/^\s*[-•]\s+([^\n]+)/gm, ":::li:::$1:::/li:::");
      html = html.replace(/(:::li:::.*?:::\/li:::\s*)+/g, function(match) {
        const items = match.match(/:::li:::(.*?):::\/li:::/g);
        if (items) {
          const listItems = items.map((item) => {
            const content = item.replace(/:::li:::/, "").replace(/:::\/li:::/, "");
            return '<li style="margin:2rpx 0;line-height:1.4;">' + content + "</li>";
          }).join("");
          return '<ul style="padding-left:28rpx;margin:6rpx 0 10rpx;list-style-type:disc;">' + listItems + "</ul>";
        }
        return match;
      });
      html = html.replace(/\n\s*\n/g, "<br>").replace(/\n/g, "<br>");
      html = html.replace(/(<br>\s*){3,}/g, "<br><br>").replace(/^<br\s*\/?>|<br\s*\/?>$/g, "").replace(/<br><\/li>/g, "</li>").replace(/<\/li><br>/g, "</li>").replace(/<ul><br>/g, "<ul>").replace(/<\/ul><br>/g, "</ul>").replace(/<strong><br>/g, "<strong>").replace(/<br><\/strong>/g, "</strong>");
      return html;
    },
    needMarkdownRender(text) {
      if (!text)
        return false;
      const patterns = [
        /\*\*[^*]+\*\*/,
        /\*[^*]+\*/,
        /`[^`]+`/,
        /^#{1,6}\s+/m,
        /^[-•]\s+/m,
        /^\d+\.\s+/m,
        /\\n/,
        /"role"/,
        /\\"/
      ];
      return patterns.some((p) => p.test(text));
    },
    chooseFile() {
      common_vendor.index.chooseMessageFile({
        count: 1,
        type: "file",
        extension: ["pdf"],
        success: (res) => {
          const file = res.tempFiles[0];
          common_vendor.index.getFileSystemManager().readFile({
            filePath: file.path,
            encoding: "base64",
            success: (readRes) => {
              this.formData.pdfFile = {
                name: file.name,
                size: file.size,
                base64: readRes.data
              };
              common_vendor.index.showToast({
                title: "文件选择成功",
                icon: "success",
                duration: 1500
              });
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/AI/AI.vue:831", "读取文件失败:", err);
              common_vendor.index.showToast({
                title: "文件读取失败",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/AI/AI.vue:840", "选择文件失败:", err);
          if (err.errMsg && !err.errMsg.includes("cancel")) {
            common_vendor.index.showToast({
              title: "文件选择失败",
              icon: "none"
            });
          }
        }
      });
    },
    async submitFunction() {
      if (this.currentMethod.includes("user") && !this.currentUserId) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none",
          duration: 2e3
        });
        this.fetchUserInfo();
        return;
      }
      if (!this.validateForm()) {
        return;
      }
      const panelType = this.currentPanel;
      if (!panelType) {
        common_vendor.index.showToast({ title: "操作异常，请重试", icon: "none" });
        return;
      }
      const savedFormData = {
        positionId: this.formData.positionId,
        positionText: this.formData.positionText,
        pdfFile: this.formData.pdfFile ? { ...this.formData.pdfFile } : null,
        positionName: this.formData.positionName,
        userId: this.currentUserId
      };
      const savedMethod = this.currentMethod;
      const userMessage = this.getUserMessageText();
      this.messages.push({
        sender: "user",
        content: userMessage,
        timestamp: Date.now(),
        file: this.formData.pdfFile ? {
          name: this.formData.pdfFile.name,
          size: this.formData.pdfFile.size
        } : null
      });
      this.closePanel();
      this.scrollToBottom();
      this.isLoading = true;
      try {
        let result = null;
        switch (panelType) {
          case "resumeAnalysis":
            result = await this.submitResumeAnalysis(savedFormData, savedMethod);
            break;
          case "resumeEvaluation":
            result = await this.submitResumeEvaluation(savedFormData, savedMethod);
            break;
          case "successRate":
            result = await this.submitSuccessRate(savedFormData, savedMethod);
            break;
          case "studentPlan":
            result = await this.submitStudentPlan(savedFormData, savedMethod);
            break;
          default:
            throw new Error("未知操作类型: " + panelType);
        }
        if (result) {
          this.messages.push({
            sender: "ai",
            content: typeof result === "string" ? result : JSON.stringify(result),
            timestamp: Date.now(),
            expanded: false
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:1016", "提交失败:", error);
        this.messages.push({
          sender: "ai",
          content: "抱歉，分析失败：" + (error.message || "未知错误"),
          timestamp: Date.now(),
          expanded: false
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    async submitResumeAnalysis(formData, method) {
      var _a, _b, _c, _d, _e;
      try {
        let res;
        if (method === "user+position") {
          const jobName = (formData.positionName || "").trim();
          if (!jobName) {
            throw new Error("请选择有效的职位");
          }
          if (!formData.userId) {
            throw new Error("用户未登录");
          }
          res = await common_api_ai.aiApi.askByUserJobName(jobName);
          return (res == null ? void 0 : res.analysis) || ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.analysis) || (res == null ? void 0 : res.data) || res;
        } else if (method === "user+text") {
          if (!formData.positionText.trim()) {
            throw new Error("职位描述不能为空");
          }
          if (!formData.userId) {
            throw new Error("用户未登录");
          }
          res = await common_api_ai.aiApi.askByUserJobText(formData.positionText);
          return (res == null ? void 0 : res.analysis) || ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.analysis) || (res == null ? void 0 : res.data) || res;
        } else if (method === "pdf+position") {
          if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
            throw new Error("PDF 文件没有 base64 数据");
          }
          const jobName = (formData.positionName || "").trim();
          if (!jobName) {
            throw new Error("请选择有效的职位");
          }
          res = await common_api_ai.aiApi.askByPdfJobName(
            { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
            jobName
          );
        } else if (method === "pdf+text") {
          if (!((_d = formData.pdfFile) == null ? void 0 : _d.base64)) {
            throw new Error("PDF 文件没有 base64 数据");
          }
          if (!formData.positionText.trim()) {
            throw new Error("职位描述不能为空");
          }
          res = await common_api_ai.aiApi.askByPdfJobText(
            { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
            formData.positionText
          );
        } else {
          throw new Error(`不支持的简历分析方法: ${method}`);
        }
        return (res == null ? void 0 : res.analysis) || ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.analysis) || (res == null ? void 0 : res.data) || res;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:1086", "简历分析失败:", err);
        throw err;
      }
    },
    async submitResumeEvaluation(formData, method) {
      var _a, _b, _c;
      if (method === "user") {
        const res = await common_api_ai.aiApi.resumeEvaluation();
        return ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.evaluation) || (res == null ? void 0 : res.evaluation) || (res == null ? void 0 : res.data) || res;
      } else if (method === "pdf") {
        if (!((_b = formData.pdfFile) == null ? void 0 : _b.base64)) {
          throw new Error("PDF 文件没有 base64 数据");
        }
        const res = await common_api_ai.aiApi.resumeEvaluationByPdf({
          name: formData.pdfFile.name,
          base64: formData.pdfFile.base64
        });
        return ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.evaluation) || (res == null ? void 0 : res.evaluation) || (res == null ? void 0 : res.data) || res;
      } else {
        throw new Error(`不支持的简历评估方法: ${method}`);
      }
    },
    async submitSuccessRate(formData, method) {
      var _a, _b, _c, _d, _e, _f;
      if (method === "pdf+position") {
        if (!((_a = formData.pdfFile) == null ? void 0 : _a.base64)) {
          throw new Error("PDF 文件没有 base64 数据");
        }
        const jobName = (formData.positionName || "").trim();
        if (!jobName) {
          throw new Error("请选择有效的职位");
        }
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:1118", "调用成功率分析，职位名称:", jobName);
        const res = await common_api_ai.aiApi.successRateByPdfJobName(
          { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
          jobName
        );
        return ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
      } else if (method === "pdf+text") {
        if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
          throw new Error("PDF 文件没有 base64 数据");
        }
        const res = await common_api_ai.aiApi.successRateByPdfJobText(
          { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
          formData.positionText
        );
        return ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
      } else if (method === "user+position") {
        const jobName = (formData.positionName || "").trim();
        if (!jobName) {
          throw new Error("请选择有效的职位");
        }
        const res = await common_api_ai.aiApi.successRateByUserJobName(jobName);
        return ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
      } else if (method === "user+text") {
        const res = await common_api_ai.aiApi.successRateByUserJobText(formData.positionText);
        return ((_f = res == null ? void 0 : res.data) == null ? void 0 : _f.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
      } else {
        throw new Error(`不支持的成功率分析方法: ${method}`);
      }
    },
    async submitStudentPlan(formData, method) {
      var _a, _b, _c, _d, _e, _f;
      const userGrade = this.gradeOptions[this.gradeIndex];
      if (method === "pdf+position") {
        if (!((_a = formData.pdfFile) == null ? void 0 : _a.base64)) {
          throw new Error("PDF 文件没有 base64 数据");
        }
        const jobName = (formData.positionName || "").trim();
        if (!jobName) {
          throw new Error("请选择有效的职位");
        }
        const res = await common_api_ai.aiApi.universityPlanByPdfJobName(
          { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
          jobName,
          userGrade
        );
        return ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
      } else if (method === "pdf+text") {
        if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
          throw new Error("PDF 文件没有 base64 数据");
        }
        const res = await common_api_ai.aiApi.universityPlanByPdfJobText(
          { name: formData.pdfFile.name, base64: formData.pdfFile.base64 },
          formData.positionText,
          userGrade
        );
        return ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
      } else if (method === "user+position") {
        const jobName = (formData.positionName || "").trim();
        if (!jobName) {
          throw new Error("请选择有效的职位");
        }
        const res = await common_api_ai.aiApi.universityPlanByUserJobName(
          jobName,
          userGrade
        );
        return ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
      } else if (method === "user+text") {
        const res = await common_api_ai.aiApi.universityPlanByUserJobText(
          formData.positionText,
          userGrade
        );
        return ((_f = res == null ? void 0 : res.data) == null ? void 0 : _f.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
      } else {
        throw new Error(`不支持的大学生规划方法: ${method}`);
      }
    },
    getUserMessageText() {
      const texts = {
        resumeAnalysis: "请分析这份简历与岗位的匹配度",
        resumeEvaluation: "请评估我的简历",
        successRate: "请分析我的求职成功率",
        studentPlan: "请为我制定大学生活规划"
      };
      let text = texts[this.currentPanel] || "提交分析";
      if (this.currentMethod.includes("position") && this.formData.positionId) {
        if (this.selectedCategoryName && this.selectedPositionName) {
          text += ` [${this.selectedCategoryName} - ${this.selectedPositionName}]`;
        }
      } else if (this.currentMethod.includes("text") && this.formData.positionText) {
        text += ` [${this.formData.positionText}]`;
      }
      if (this.formData.pdfFile) {
        text += `：[${this.formData.pdfFile.name}]`;
      }
      return text;
    },
    validateForm() {
      const method = this.currentMethod;
      if (method.includes("user")) {
        if (!this.currentUserId) {
          common_vendor.index.showToast({
            title: "未获取到用户信息，请重新登录",
            icon: "none",
            duration: 3e3
          });
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
      if (method.includes("text") && !this.formData.positionText.trim()) {
        common_vendor.index.showToast({ title: "请输入职位描述", icon: "none" });
        return false;
      }
      if (method.includes("pdf") && !this.formData.pdfFile) {
        common_vendor.index.showToast({ title: "请上传PDF文件", icon: "none" });
        return false;
      }
      return true;
    },
    toggleCard(index) {
      this.$set(this.messages[index], "expanded", !this.messages[index].expanded);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 999999;
      });
    },
    loadMoreHistory() {
    },
    formatFileSize(size) {
      if (!size)
        return "0B";
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
        positionId: "",
        positionText: "",
        pdfFile: null,
        positionName: ""
      };
      this.gradeIndex = 0;
      this.selectedCategoryId = "";
      this.selectedCategoryName = "";
      this.selectedPositionId = "";
      this.selectedPositionName = "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$1,
    b: common_vendor.o((...args) => $options.goToInterview && $options.goToInterview(...args)),
    c: common_vendor.f($data.messages, (message, index, i0) => {
      return common_vendor.e({
        a: !$options.needMarkdownRender(message.content)
      }, !$options.needMarkdownRender(message.content) ? {
        b: common_vendor.t(message.content)
      } : {
        c: $options.parseMarkdown(message.content)
      }, {
        d: message.file
      }, message.file ? {
        e: common_assets._imports_1,
        f: common_vendor.t(message.file.name),
        g: common_vendor.t($options.formatFileSize(message.file.size))
      } : {}, {
        h: message.analysisResult
      }, message.analysisResult ? common_vendor.e({
        i: common_vendor.t(message.analysisResult.title),
        j: message.expanded ? "/static/ai/collapse.png" : "/static/ai/expand.png",
        k: common_vendor.o(($event) => $options.toggleCard(index), index),
        l: message.expanded
      }, message.expanded ? {
        m: message.analysisResult.content
      } : {}, {
        n: message.expanded ? 1 : ""
      }) : {}, {
        o: message.uploadProgress !== void 0
      }, message.uploadProgress !== void 0 ? {
        p: message.uploadProgress + "%",
        q: common_vendor.t(message.uploadProgress)
      } : {}, {
        r: common_vendor.t($options.formatTime(message.timestamp)),
        s: index,
        t: common_vendor.n(message.sender === "user" ? "user-message" : "ai-message")
      });
    }),
    d: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    e: $data.scrollTop,
    f: common_vendor.o((...args) => $options.loadMoreHistory && $options.loadMoreHistory(...args)),
    g: common_vendor.o(($event) => $options.openPanel("resumeAnalysis")),
    h: common_vendor.o(($event) => $options.openPanel("resumeEvaluation")),
    i: common_vendor.o(($event) => $options.openPanel("successRate")),
    j: common_vendor.o(($event) => $options.openPanel("studentPlan")),
    k: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    l: $data.inputText,
    m: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    n: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    o: !$data.inputText.trim(),
    p: $data.currentPanel
  }, $data.currentPanel ? common_vendor.e({
    q: common_vendor.t($options.panelTitle),
    r: common_assets._imports_6,
    s: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args)),
    t: $data.currentPanel === "resumeAnalysis"
  }, $data.currentPanel === "resumeAnalysis" ? common_vendor.e({
    v: common_vendor.f($data.analysisMethods, (method, k0, i0) => {
      return {
        a: method.value,
        b: $data.currentMethod === method.value,
        c: common_vendor.t(method.label),
        d: method.value
      };
    }),
    w: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    x: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.currentUserId ? {
    z: common_vendor.t($data.currentUserId)
  } : {
    A: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    y: $data.currentUserId,
    B: $data.isLoadingUser ? 1 : "",
    C: !$data.currentUserId && !$data.isLoadingUser ? 1 : "",
    D: $data.currentMethod.includes("user"),
    E: $data.selectedPositionId
  }, $data.selectedPositionId ? {
    F: common_vendor.t($data.selectedCategoryName),
    G: common_vendor.t($data.selectedPositionName)
  } : {}, {
    H: !$data.selectedPositionId ? 1 : "",
    I: common_vendor.o((...args) => $options.openCascadePicker && $options.openCascadePicker(...args)),
    J: $data.currentMethod.includes("position"),
    K: $data.formData.positionText,
    L: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value),
    M: $data.currentMethod.includes("text"),
    N: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
    O: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    P: $data.currentMethod.includes("pdf")
  }) : {}, {
    Q: $data.currentPanel === "resumeEvaluation"
  }, $data.currentPanel === "resumeEvaluation" ? common_vendor.e({
    R: $data.currentMethod,
    S: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    T: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.currentUserId ? {
    V: common_vendor.t($data.currentUserId)
  } : {
    W: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    U: $data.currentUserId,
    X: $data.isLoadingUser ? 1 : "",
    Y: !$data.currentUserId && !$data.isLoadingUser ? 1 : "",
    Z: $data.currentMethod === "user",
    aa: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
    ab: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    ac: $data.currentMethod === "pdf"
  }) : {}, {
    ad: $data.currentPanel === "successRate"
  }, $data.currentPanel === "successRate" ? common_vendor.e({
    ae: $data.currentMethod,
    af: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    ag: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.currentUserId ? {
    ai: common_vendor.t($data.currentUserId)
  } : {
    aj: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    ah: $data.currentUserId,
    ak: $data.isLoadingUser ? 1 : "",
    al: !$data.currentUserId && !$data.isLoadingUser ? 1 : "",
    am: $data.currentMethod.includes("user"),
    an: $data.selectedPositionId
  }, $data.selectedPositionId ? {
    ao: common_vendor.t($data.selectedCategoryName),
    ap: common_vendor.t($data.selectedPositionName)
  } : {}, {
    aq: !$data.selectedPositionId ? 1 : "",
    ar: common_vendor.o((...args) => $options.openCascadePicker && $options.openCascadePicker(...args)),
    as: $data.currentMethod.includes("position"),
    at: $data.formData.positionText,
    av: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value),
    aw: $data.currentMethod.includes("text"),
    ax: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
    ay: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    az: $data.currentMethod.includes("pdf")
  }) : {}, {
    aA: $data.currentPanel === "studentPlan"
  }, $data.currentPanel === "studentPlan" ? common_vendor.e({
    aB: $data.currentMethod,
    aC: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    aD: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.currentUserId ? {
    aF: common_vendor.t($data.currentUserId)
  } : {
    aG: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    aE: $data.currentUserId,
    aH: $data.isLoadingUser ? 1 : "",
    aI: !$data.currentUserId && !$data.isLoadingUser ? 1 : "",
    aJ: $data.currentMethod.includes("user"),
    aK: $data.selectedPositionId
  }, $data.selectedPositionId ? {
    aL: common_vendor.t($data.selectedCategoryName),
    aM: common_vendor.t($data.selectedPositionName)
  } : {}, {
    aN: !$data.selectedPositionId ? 1 : "",
    aO: common_vendor.o((...args) => $options.openCascadePicker && $options.openCascadePicker(...args)),
    aP: $data.currentMethod.includes("position"),
    aQ: $data.formData.positionText,
    aR: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value),
    aS: $data.currentMethod.includes("text"),
    aT: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
    aU: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    aV: $data.currentMethod.includes("pdf")
  }) : {}, {
    aW: common_vendor.o((...args) => $options.submitFunction && $options.submitFunction(...args)),
    aX: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args)),
    aY: common_vendor.o(() => {
    }),
    aZ: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args))
  }) : {}, {
    ba: $data.showCascadePicker
  }, $data.showCascadePicker ? {
    bb: common_vendor.o((...args) => $options.confirmCascadeSelection && $options.confirmCascadeSelection(...args)),
    bc: common_vendor.f($data.mainCategories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: common_vendor.n($data.selectedCategoryId === category.id ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectCategory(category), category.id)
      };
    }),
    bd: common_vendor.f($options.currentPositions, (position, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(position.name),
        b: $data.selectedPositionId === position.id
      }, $data.selectedPositionId === position.id ? {} : {}, {
        c: position.id,
        d: common_vendor.n($data.selectedPositionId === position.id ? "active" : ""),
        e: common_vendor.o(($event) => $options.selectPosition(position), position.id)
      });
    }),
    be: common_vendor.o(() => {
    }),
    bf: common_vendor.o((...args) => _ctx.closeCascadePicker && _ctx.closeCascadePicker(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e2f8c5c5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
