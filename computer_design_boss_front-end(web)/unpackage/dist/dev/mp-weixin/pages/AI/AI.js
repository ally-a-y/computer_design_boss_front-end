"use strict";
const common_vendor = require("../../common/vendor.js");
const common_api_ai = require("../../common/api/ai.js");
const common_utils_themeSimple = require("../../common/utils/theme-simple.js");
const common_assets = require("../../common/assets.js");
const BASE_URL = "http://39.106.72.110";
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
      currentTheme: common_utils_themeSimple.themeManager.getCurrentTheme(),
      isDarkMode: false,
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
        { value: "user+position", label: "职位" },
        { value: "user+text", label: "职位文本" },
        { value: "pdf+position", label: "PDF简历+职位" },
        { value: "pdf+text", label: "PDF简历+职位文本" }
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
    this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
    this.isDarkMode = this.currentTheme === "dark";
    this.themeChangeHandler = (data) => {
      this.currentTheme = data.theme;
      this.isDarkMode = data.isDark;
    };
    common_vendor.index.$on("globalThemeChange", this.themeChangeHandler);
  },
  onUnload() {
    this.cleanup();
    common_vendor.index.$off("globalThemeChange", this.themeChangeHandler);
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
    closeCascadePicker() {
      this.showCascadePicker = false;
    },
    // 获取用户信息
    async fetchUserInfo() {
      this.isLoadingUser = true;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.__f__("log", "at pages/AI/AI.vue:533", "未找到登录token，需要用户登录");
          this.currentUserId = null;
          return;
        }
        const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (cachedUserInfo && cachedUserInfo.user_id) {
          this.userInfo = cachedUserInfo;
          this.currentUserId = String(cachedUserInfo.user_id);
          common_vendor.index.__f__("log", "at pages/AI/AI.vue:542", "从缓存获取用户ID:", this.currentUserId);
          return;
        }
        const res = await this.getUserProfile();
        if (res.code === 200 && res.data) {
          this.userInfo = res.data;
          this.currentUserId = String(res.data.user_id || res.data.userId || res.data.id);
          common_vendor.index.setStorageSync("userInfo", res.data);
          common_vendor.index.__f__("log", "at pages/AI/AI.vue:552", "从后端获取用户ID:", this.currentUserId);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:555", "获取用户信息失败:", error);
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
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:641", "AI对话失败:", error);
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
        resumeEvaluation: "pdf",
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
              common_vendor.index.__f__("error", "at pages/AI/AI.vue:791", "读取文件失败:", err);
              common_vendor.index.showToast({
                title: "文件读取失败",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/AI/AI.vue:800", "选择文件失败:", err);
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
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:1037", "提交失败:", error);
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
        common_vendor.index.__f__("error", "at pages/AI/AI.vue:1107", "简历分析失败:", err);
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
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:1139", "调用成功率分析，职位名称:", jobName);
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
      if (!this.formData.pdfFile) {
        const pdf = this.formData.pdfFile;
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:1279", pdf);
        common_vendor.index.__f__("log", "at pages/AI/AI.vue:1280", this.formData.pdfFile);
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
    b: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    c: common_vendor.o((...args) => $options.goToInterview && $options.goToInterview(...args), "82"),
    d: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "linear-gradient(135deg, rgba(230, 240, 255, 0.8), rgba(255, 255, 255, 0.8))",
    e: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)",
    f: common_vendor.f($data.messages, (message, index, i0) => {
      return common_vendor.e({
        a: !$options.needMarkdownRender(message.content)
      }, !$options.needMarkdownRender(message.content) ? {
        b: common_vendor.t(message.content)
      } : {
        c: $options.parseMarkdown(message.content)
      }, {
        d: message.file
      }, message.file ? {
        e: common_assets._imports_1$1,
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
        r: common_vendor.s(message.sender === "user" ? {
          background: "linear-gradient(120deg, #4facfe, #00f2fe)",
          color: "#ffffff"
        } : {
          background: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
          color: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
          boxShadow: $data.isDarkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 4px 16px rgba(79, 172, 254, 0.15)"
        }),
        s: common_vendor.t($options.formatTime(message.timestamp)),
        t: index,
        v: common_vendor.n(message.sender === "user" ? "user-message" : "ai-message")
      });
    }),
    g: $data.isLoading
  }, $data.isLoading ? {} : {}, {
    h: $data.scrollTop,
    i: common_vendor.o((...args) => $options.loadMoreHistory && $options.loadMoreHistory(...args), "61"),
    j: common_vendor.o(($event) => $options.openPanel("resumeAnalysis"), "bf"),
    k: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)",
    l: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    m: $data.isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.15)",
    n: common_vendor.o(($event) => $options.openPanel("resumeEvaluation"), "c7"),
    o: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)",
    p: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    q: $data.isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.15)",
    r: common_vendor.o(($event) => $options.openPanel("successRate"), "3c"),
    s: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)",
    t: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    v: $data.isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.15)",
    w: common_vendor.o(($event) => $options.openPanel("studentPlan"), "c1"),
    x: $data.isDarkMode ? "rgba(64, 64, 64, 0.8)" : "rgba(255, 255, 255, 0.8)",
    y: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    z: $data.isDarkMode ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 8px rgba(79, 172, 254, 0.15)",
    A: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args), "2b"),
    B: $data.isLoading,
    C: $data.isDarkMode ? "#404040" : "#fff",
    D: $data.isDarkMode ? "#404040" : "#eee",
    E: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    F: $data.inputText,
    G: common_vendor.o(($event) => $data.inputText = $event.detail.value, "e0"),
    H: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args), "ac"),
    I: !$data.inputText.trim() || $data.isLoading ? 1 : "",
    J: !$data.inputText.trim() || $data.isLoading ? "#ccc" : "linear-gradient(120deg, #4facfe, #00f2fe)",
    K: $data.isDarkMode ? "rgba(44, 44, 44, 0.8)" : "rgba(255, 255, 255, 0.8)",
    L: $data.isDarkMode ? "0 -2px 8px rgba(0,0,0,0.3)" : "0 -4px 16px rgba(79, 172, 254, 0.15)",
    M: $data.currentPanel
  }, $data.currentPanel ? common_vendor.e({
    N: common_vendor.t($options.panelTitle),
    O: $data.isDarkMode ? "#ffffff" : "#1E1E1E",
    P: common_assets._imports_1,
    Q: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args), "dc"),
    R: $data.isDarkMode ? "1px solid #404040" : "1px solid #eee",
    S: $data.currentPanel === "resumeAnalysis"
  }, $data.currentPanel === "resumeAnalysis" ? common_vendor.e({
    T: common_vendor.f($data.analysisMethods, (method, k0, i0) => {
      return {
        a: method.value,
        b: $data.currentMethod === method.value,
        c: common_vendor.t(method.label),
        d: method.value
      };
    }),
    U: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args), "4d"),
    V: $data.selectedPositionId
  }, $data.selectedPositionId ? {
    W: common_vendor.t($data.selectedCategoryName),
    X: common_vendor.t($data.selectedPositionName)
  } : {}, {
    Y: !$data.selectedPositionId ? 1 : "",
    Z: common_vendor.o((...args) => $options.openCascadePicker && $options.openCascadePicker(...args), "26"),
    aa: $data.currentMethod.includes("position"),
    ab: $data.formData.positionText,
    ac: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value, "02"),
    ad: $data.currentMethod.includes("text"),
    ae: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
    af: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args), "c2"),
    ag: $data.currentMethod.includes("pdf")
  }) : {}, {
    ah: $data.currentPanel === "resumeEvaluation"
  }, $data.currentPanel === "resumeEvaluation" ? {
    ai: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
    aj: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args), "de"),
    ak: $data.currentMethod === "pdf"
  } : {}, {
    al: $data.currentPanel === "successRate"
  }, $data.currentPanel === "successRate" ? common_vendor.e({
    am: $data.currentMethod,
    an: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args), "ac"),
    ao: $data.selectedPositionId
  }, $data.selectedPositionId ? {
    ap: common_vendor.t($data.selectedCategoryName),
    aq: common_vendor.t($data.selectedPositionName)
  } : {}, {
    ar: !$data.selectedPositionId ? 1 : "",
    as: common_vendor.o((...args) => $options.openCascadePicker && $options.openCascadePicker(...args), "34"),
    at: $data.currentMethod.includes("position"),
    av: $data.formData.positionText,
    aw: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value, "cf"),
    ax: $data.currentMethod.includes("text"),
    ay: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
    az: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args), "72"),
    aA: $data.currentMethod.includes("pdf")
  }) : {}, {
    aB: $data.currentPanel === "studentPlan"
  }, $data.currentPanel === "studentPlan" ? common_vendor.e({
    aC: $data.currentMethod,
    aD: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args), "ca"),
    aE: $data.selectedPositionId
  }, $data.selectedPositionId ? {
    aF: common_vendor.t($data.selectedCategoryName),
    aG: common_vendor.t($data.selectedPositionName)
  } : {}, {
    aH: !$data.selectedPositionId ? 1 : "",
    aI: common_vendor.o((...args) => $options.openCascadePicker && $options.openCascadePicker(...args), "c8"),
    aJ: $data.currentMethod.includes("position"),
    aK: $data.formData.positionText,
    aL: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value, "cf"),
    aM: $data.currentMethod.includes("text"),
    aN: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "点击选择PDF文件"),
    aO: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args), "b9"),
    aP: $data.currentMethod.includes("pdf")
  }) : {}, {
    aQ: common_vendor.o((...args) => $options.submitFunction && $options.submitFunction(...args), "52"),
    aR: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args), "50"),
    aS: common_vendor.o(() => {
    }, "6d"),
    aT: $data.isDarkMode ? "rgba(44, 44, 44, 0.95)" : "rgba(255, 255, 255, 0.95)",
    aU: $data.isDarkMode ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(79, 172, 254, 0.2)",
    aV: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args), "7b")
  }) : {}, {
    aW: $data.showCascadePicker
  }, $data.showCascadePicker ? {
    aX: common_vendor.o((...args) => $options.confirmCascadeSelection && $options.confirmCascadeSelection(...args), "ab"),
    aY: common_vendor.f($data.mainCategories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: category.id,
        c: common_vendor.n($data.selectedCategoryId === category.id ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectCategory(category), category.id)
      };
    }),
    aZ: common_vendor.f($options.currentPositions, (position, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(position.name),
        b: $data.selectedPositionId === position.id
      }, $data.selectedPositionId === position.id ? {} : {}, {
        c: position.id,
        d: common_vendor.n($data.selectedPositionId === position.id ? "active" : ""),
        e: common_vendor.o(($event) => $options.selectPosition(position), position.id)
      });
    }),
    ba: common_vendor.o(() => {
    }, "31"),
    bb: common_vendor.o((...args) => $options.closeCascadePicker && $options.closeCascadePicker(...args), "73")
  } : {}, {
    bc: common_vendor.n($data.currentTheme + "-theme"),
    bd: $data.isDarkMode ? "#1a1a1a" : "linear-gradient(135deg, #e6f0ff 0%, #ffffff 100%)"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e2f8c5c5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AI/AI.js.map
