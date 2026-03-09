"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var common_vendor = require("../../common/vendor.js");
var common_api_ai = require("../../common/api/ai.js");
require("../../common/api/request.js");
require("../../common/config.js");
const BASE_URL = "http://localhost:5000";
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
      currentMethod: "user+position",
      isLoadingUser: false,
      userInfo: null,
      currentUserId: null,
      formData: {
        positionId: "",
        positionText: "",
        pdfFile: null
      },
      gradeIndex: 0,
      gradeOptions: ["\u5927\u4E00", "\u5927\u4E8C", "\u5927\u4E09", "\u5927\u56DB", "\u7814\u4E00", "\u7814\u4E8C", "\u7814\u4E09"],
      categories: [
        { id: "101", name: "\u524D\u7AEF\u5F00\u53D1" },
        { id: "102", name: "\u540E\u7AEF\u5F00\u53D1" },
        { id: "103", name: "\u79FB\u52A8\u7AEF\u5F00\u53D1" },
        { id: "104", name: "\u6570\u636E\u4E0EAI" },
        { id: "105", name: "\u8FD0\u7EF4\u4E0E\u6D4B\u8BD5" },
        { id: "106", name: "\u4EA7\u54C1\u8BBE\u8BA1" },
        { id: "107", name: "\u7F51\u7EDC\u5B89\u5168" },
        { id: "108", name: "\u5D4C\u5165\u5F0F\u5F00\u53D1" },
        { id: "200", name: "\u4EA7\u54C1\u4E0E\u8BBE\u8BA1\u7C7B" },
        { id: "300", name: "\u6280\u672F\u7BA1\u7406\u7C7B" }
      ],
      analysisMethods: [
        { value: "user+position", label: "\u6211\u7684\u7B80\u5386+\u804C\u4F4D\u7C7B\u578B" },
        { value: "user+text", label: "\u6211\u7684\u7B80\u5386+\u804C\u4F4D\u6587\u672C" },
        { value: "pdf+position", label: "PDF+\u804C\u4F4D\u7C7B\u578B" },
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
    this.fetchUserInfo();
  },
  onUnload() {
    this.cleanup();
  },
  methods: {
    initializeChat() {
    },
    async fetchUserInfo() {
      this.isLoadingUser = true;
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          console.log("\u672A\u627E\u5230\u767B\u5F55token\uFF0C\u9700\u8981\u7528\u6237\u767B\u5F55");
          this.currentUserId = null;
          return;
        }
        const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
        if (cachedUserInfo && cachedUserInfo.user_id) {
          this.userInfo = cachedUserInfo;
          this.currentUserId = String(cachedUserInfo.user_id);
          console.log("\u4ECE\u7F13\u5B58\u83B7\u53D6\u7528\u6237ID:", this.currentUserId);
          return;
        }
        const res = await this.getUserProfile();
        if (res.code === 200 && res.data) {
          this.userInfo = res.data;
          this.currentUserId = String(res.data.user_id || res.data.userId || res.data.id);
          common_vendor.index.setStorageSync("userInfo", res.data);
          console.log("\u4ECE\u540E\u7AEF\u83B7\u53D6\u7528\u6237ID:", this.currentUserId);
        }
      } catch (error) {
        console.error("\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25:", error);
        common_vendor.index.showToast({
          title: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25",
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
          aiContent = (res == null ? void 0 : res.data) || (res == null ? void 0 : res.message) || JSON.stringify(res) || "AI\u672A\u8FD4\u56DE\u6709\u6548\u5185\u5BB9";
        }
        this.messages.push({
          sender: "ai",
          content: aiContent || "AI\u672A\u8FD4\u56DE\u6709\u6548\u5185\u5BB9",
          timestamp: Date.now(),
          expanded: false
        });
      } catch (error) {
        console.error("AI\u5BF9\u8BDD\u5931\u8D25:", error);
        this.messages.push({
          sender: "ai",
          content: "\u62B1\u6B49\uFF0C\u670D\u52A1\u6682\u65F6\u4E0D\u53EF\u7528\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
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
    onPositionChange(e) {
      const index = parseInt(e.detail.value);
      if (index >= 0 && index < this.categories.length) {
        this.formData.positionId = this.categories[index].id;
      }
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
                title: "\u6587\u4EF6\u9009\u62E9\u6210\u529F",
                icon: "success",
                duration: 1500
              });
            },
            fail: (err) => {
              console.error("\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25:", err);
              common_vendor.index.showToast({
                title: "\u6587\u4EF6\u8BFB\u53D6\u5931\u8D25",
                icon: "none"
              });
            }
          });
        },
        fail: (err) => {
          console.error("\u9009\u62E9\u6587\u4EF6\u5931\u8D25:", err);
          if (err.errMsg && !err.errMsg.includes("cancel")) {
            common_vendor.index.showToast({
              title: "\u6587\u4EF6\u9009\u62E9\u5931\u8D25",
              icon: "none"
            });
          }
        }
      });
    },
    async submitFunction() {
      if (this.currentMethod.includes("user") && !this.currentUserId) {
        common_vendor.index.showToast({
          title: "\u8BF7\u5148\u767B\u5F55",
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
        common_vendor.index.showToast({ title: "\u64CD\u4F5C\u5F02\u5E38\uFF0C\u8BF7\u91CD\u8BD5", icon: "none" });
        return;
      }
      const savedFormData = {
        positionId: this.formData.positionId,
        positionText: this.formData.positionText,
        pdfFile: this.formData.pdfFile ? __spreadValues({}, this.formData.pdfFile) : null,
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
            throw new Error("\u672A\u77E5\u64CD\u4F5C\u7C7B\u578B: " + panelType);
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
        console.error("\u63D0\u4EA4\u5931\u8D25:", error);
        this.messages.push({
          sender: "ai",
          content: "\u62B1\u6B49\uFF0C\u5206\u6790\u5931\u8D25\uFF1A" + (error.message || "\u672A\u77E5\u9519\u8BEF"),
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
          const jobId = String(formData.positionId || "").trim();
          if (!jobId) {
            throw new Error("\u804C\u4F4DID\u4E0D\u80FD\u4E3A\u7A7A");
          }
          if (!formData.userId) {
            throw new Error("\u7528\u6237\u672A\u767B\u5F55");
          }
          res = await common_api_ai.aiApi.askByUserJobId(jobId);
          return (res == null ? void 0 : res.analysis) || ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.analysis) || (res == null ? void 0 : res.data) || res;
        } else if (method === "user+text") {
          if (!formData.positionText.trim()) {
            throw new Error("\u804C\u4F4D\u63CF\u8FF0\u4E0D\u80FD\u4E3A\u7A7A");
          }
          if (!formData.userId) {
            throw new Error("\u7528\u6237\u672A\u767B\u5F55");
          }
          res = await common_api_ai.aiApi.askByUserJobText(formData.positionText);
          return (res == null ? void 0 : res.analysis) || ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.analysis) || (res == null ? void 0 : res.data) || res;
        } else if (method === "pdf+position") {
          if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
            throw new Error("PDF \u6587\u4EF6\u6CA1\u6709 base64 \u6570\u636E");
          }
          const jobId = String(formData.positionId || "").trim();
          if (!jobId) {
            throw new Error("\u804C\u4F4DID\u4E0D\u80FD\u4E3A\u7A7A");
          }
          res = await common_api_ai.aiApi.askByPdfJobId({ name: formData.pdfFile.name, base64: formData.pdfFile.base64 }, jobId);
        } else if (method === "pdf+text") {
          if (!((_d = formData.pdfFile) == null ? void 0 : _d.base64)) {
            throw new Error("PDF \u6587\u4EF6\u6CA1\u6709 base64 \u6570\u636E");
          }
          if (!formData.positionText.trim()) {
            throw new Error("\u804C\u4F4D\u63CF\u8FF0\u4E0D\u80FD\u4E3A\u7A7A");
          }
          res = await common_api_ai.aiApi.askByPdfJobText({ name: formData.pdfFile.name, base64: formData.pdfFile.base64 }, formData.positionText);
        } else {
          throw new Error(`\u4E0D\u652F\u6301\u7684\u7B80\u5386\u5206\u6790\u65B9\u6CD5: ${method}`);
        }
        return (res == null ? void 0 : res.analysis) || ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.analysis) || (res == null ? void 0 : res.data) || res;
      } catch (err) {
        console.error("\u7B80\u5386\u5206\u6790\u5931\u8D25:", err);
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
          throw new Error("PDF \u6587\u4EF6\u6CA1\u6709 base64 \u6570\u636E");
        }
        const res = await common_api_ai.aiApi.resumeEvaluationByPdf({
          name: formData.pdfFile.name,
          base64: formData.pdfFile.base64
        });
        return ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.evaluation) || (res == null ? void 0 : res.evaluation) || (res == null ? void 0 : res.data) || res;
      } else {
        throw new Error(`\u4E0D\u652F\u6301\u7684\u7B80\u5386\u8BC4\u4F30\u65B9\u6CD5: ${method}`);
      }
    },
    async submitSuccessRate(formData, method) {
      var _a, _b, _c, _d, _e, _f;
      if (method === "pdf+position") {
        if (!((_a = formData.pdfFile) == null ? void 0 : _a.base64)) {
          throw new Error("PDF \u6587\u4EF6\u6CA1\u6709 base64 \u6570\u636E");
        }
        const res = await common_api_ai.aiApi.successRateByPdfJobId({ name: formData.pdfFile.name, base64: formData.pdfFile.base64 }, formData.positionId);
        return ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
      } else if (method === "pdf+text") {
        if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
          throw new Error("PDF \u6587\u4EF6\u6CA1\u6709 base64 \u6570\u636E");
        }
        const res = await common_api_ai.aiApi.successRateByPdfJobText({ name: formData.pdfFile.name, base64: formData.pdfFile.base64 }, formData.positionText);
        return ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
      } else if (method === "user+position") {
        const res = await common_api_ai.aiApi.successRateByUserJobId(formData.positionId);
        return ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
      } else if (method === "user+text") {
        const res = await common_api_ai.aiApi.successRateByUserJobText(formData.positionText);
        return ((_f = res == null ? void 0 : res.data) == null ? void 0 : _f.analysis) || (res == null ? void 0 : res.analysis) || (res == null ? void 0 : res.data) || res;
      } else {
        throw new Error(`\u4E0D\u652F\u6301\u7684\u6210\u529F\u7387\u5206\u6790\u65B9\u6CD5: ${method}`);
      }
    },
    async submitStudentPlan(formData, method) {
      var _a, _b, _c, _d, _e, _f;
      const userGrade = this.gradeOptions[this.gradeIndex];
      if (method === "pdf+position") {
        if (!((_a = formData.pdfFile) == null ? void 0 : _a.base64)) {
          throw new Error("PDF \u6587\u4EF6\u6CA1\u6709 base64 \u6570\u636E");
        }
        const res = await common_api_ai.aiApi.universityPlanByPdfJobId({ name: formData.pdfFile.name, base64: formData.pdfFile.base64 }, formData.positionId, userGrade);
        return ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
      } else if (method === "pdf+text") {
        if (!((_c = formData.pdfFile) == null ? void 0 : _c.base64)) {
          throw new Error("PDF \u6587\u4EF6\u6CA1\u6709 base64 \u6570\u636E");
        }
        const res = await common_api_ai.aiApi.universityPlanByPdfJobText({ name: formData.pdfFile.name, base64: formData.pdfFile.base64 }, formData.positionText, userGrade);
        return ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
      } else if (method === "user+position") {
        const res = await common_api_ai.aiApi.universityPlanByUserJobId(formData.positionId, userGrade);
        return ((_e = res == null ? void 0 : res.data) == null ? void 0 : _e.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
      } else if (method === "user+text") {
        const res = await common_api_ai.aiApi.universityPlanByUserJobText(formData.positionText, userGrade);
        return ((_f = res == null ? void 0 : res.data) == null ? void 0 : _f.plan) || (res == null ? void 0 : res.plan) || (res == null ? void 0 : res.data) || res;
      } else {
        throw new Error(`\u4E0D\u652F\u6301\u7684\u5927\u5B66\u751F\u89C4\u5212\u65B9\u6CD5: ${method}`);
      }
    },
    getUserMessageText() {
      const texts = {
        resumeAnalysis: "\u8BF7\u5206\u6790\u8FD9\u4EFD\u7B80\u5386\u4E0E\u5C97\u4F4D\u7684\u5339\u914D\u5EA6",
        resumeEvaluation: "\u8BF7\u8BC4\u4F30\u6211\u7684\u7B80\u5386",
        successRate: "\u8BF7\u5206\u6790\u6211\u7684\u6C42\u804C\u6210\u529F\u7387",
        studentPlan: "\u8BF7\u4E3A\u6211\u5236\u5B9A\u5927\u5B66\u751F\u6D3B\u89C4\u5212"
      };
      let text = texts[this.currentPanel] || "\u63D0\u4EA4\u5206\u6790";
      if (this.formData.pdfFile) {
        text += `\uFF1A[${this.formData.pdfFile.name}]`;
      }
      return text;
    },
    validateForm() {
      const method = this.currentMethod;
      if (method.includes("user")) {
        if (!this.currentUserId) {
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
        common_vendor.index.showToast({ title: "\u8BF7\u9009\u62E9\u804C\u4F4D\u7C7B\u578B", icon: "none" });
        return false;
      }
      if (method.includes("text") && !this.formData.positionText.trim()) {
        common_vendor.index.showToast({ title: "\u8BF7\u8F93\u5165\u804C\u4F4D\u63CF\u8FF0", icon: "none" });
        return false;
      }
      if (method.includes("pdf") && !this.formData.pdfFile) {
        common_vendor.index.showToast({ title: "\u8BF7\u4E0A\u4F20PDF\u6587\u4EF6", icon: "none" });
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
        pdfFile: null
      };
      this.gradeIndex = 0;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c;
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goToInterview && $options.goToInterview(...args)),
    b: common_vendor.f($data.messages, (message, index, i0) => {
      return common_vendor.e({
        a: !$options.needMarkdownRender(message.content)
      }, !$options.needMarkdownRender(message.content) ? {
        b: common_vendor.t(message.content)
      } : {
        c: $options.parseMarkdown(message.content)
      }, {
        d: message.file
      }, message.file ? {
        e: common_vendor.t(message.file.name),
        f: common_vendor.t($options.formatFileSize(message.file.size))
      } : {}, {
        g: message.analysisResult
      }, message.analysisResult ? common_vendor.e({
        h: common_vendor.t(message.analysisResult.title),
        i: message.expanded ? "/static/ai/collapse.png" : "/static/ai/expand.png",
        j: common_vendor.o(($event) => $options.toggleCard(index)),
        k: message.expanded
      }, message.expanded ? {
        l: message.analysisResult.content
      } : {}, {
        m: message.expanded ? 1 : ""
      }) : {}, {
        n: message.uploadProgress !== void 0
      }, message.uploadProgress !== void 0 ? {
        o: message.uploadProgress + "%",
        p: common_vendor.t(message.uploadProgress)
      } : {}, {
        q: common_vendor.t($options.formatTime(message.timestamp)),
        r: index,
        s: common_vendor.n(message.sender === "user" ? "user-message" : "ai-message")
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
    v: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.currentUserId ? {
    x: common_vendor.t($data.currentUserId)
  } : {
    y: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    w: $data.currentUserId,
    z: $data.isLoadingUser ? 1 : "",
    A: !$data.currentUserId && !$data.isLoadingUser ? 1 : "",
    B: $data.currentMethod.includes("user"),
    C: common_vendor.t($data.formData.positionId ? ((_a = $data.categories.find((c) => c.id === $data.formData.positionId)) == null ? void 0 : _a.name) || "\u8BF7\u9009\u62E9\u804C\u4F4D\u7C7B\u578B" : "\u8BF7\u9009\u62E9\u804C\u4F4D\u7C7B\u578B"),
    D: common_vendor.o((...args) => $options.onPositionChange && $options.onPositionChange(...args)),
    E: $data.categories,
    F: $data.currentMethod.includes("position"),
    G: $data.formData.positionText,
    H: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value),
    I: $data.currentMethod.includes("text"),
    J: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "\u70B9\u51FB\u9009\u62E9PDF\u6587\u4EF6"),
    K: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    L: $data.currentMethod.includes("pdf")
  }) : {}, {
    M: $data.currentPanel === "resumeEvaluation"
  }, $data.currentPanel === "resumeEvaluation" ? common_vendor.e({
    N: $data.currentMethod,
    O: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    P: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.currentUserId ? {
    R: common_vendor.t($data.currentUserId)
  } : {
    S: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    Q: $data.currentUserId,
    T: $data.isLoadingUser ? 1 : "",
    U: !$data.currentUserId && !$data.isLoadingUser ? 1 : "",
    V: $data.currentMethod === "user",
    W: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "\u70B9\u51FB\u9009\u62E9PDF\u6587\u4EF6"),
    X: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    Y: $data.currentMethod === "pdf"
  }) : {}, {
    Z: $data.currentPanel === "successRate"
  }, $data.currentPanel === "successRate" ? common_vendor.e({
    aa: $data.currentMethod,
    ab: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    ac: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.currentUserId ? {
    ae: common_vendor.t($data.currentUserId)
  } : {
    af: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    ad: $data.currentUserId,
    ag: $data.isLoadingUser ? 1 : "",
    ah: !$data.currentUserId && !$data.isLoadingUser ? 1 : "",
    ai: $data.currentMethod.includes("user"),
    aj: common_vendor.t($data.formData.positionId ? ((_b = $data.categories.find((c) => c.id === $data.formData.positionId)) == null ? void 0 : _b.name) || "\u8BF7\u9009\u62E9\u804C\u4F4D\u7C7B\u578B" : "\u8BF7\u9009\u62E9\u804C\u4F4D\u7C7B\u578B"),
    ak: common_vendor.o((...args) => $options.onPositionChange && $options.onPositionChange(...args)),
    al: $data.categories,
    am: $data.currentMethod.includes("position"),
    an: $data.formData.positionText,
    ao: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value),
    ap: $data.currentMethod.includes("text"),
    aq: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "\u70B9\u51FB\u9009\u62E9PDF\u6587\u4EF6"),
    ar: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    as: $data.currentMethod.includes("pdf")
  }) : {}, {
    at: $data.currentPanel === "studentPlan"
  }, $data.currentPanel === "studentPlan" ? common_vendor.e({
    av: $data.currentMethod,
    aw: common_vendor.o((...args) => $options.onMethodChange && $options.onMethodChange(...args)),
    ax: $data.isLoadingUser
  }, $data.isLoadingUser ? {} : $data.currentUserId ? {
    az: common_vendor.t($data.currentUserId)
  } : {
    aA: common_vendor.o((...args) => $options.fetchUserInfo && $options.fetchUserInfo(...args))
  }, {
    ay: $data.currentUserId,
    aB: $data.isLoadingUser ? 1 : "",
    aC: !$data.currentUserId && !$data.isLoadingUser ? 1 : "",
    aD: $data.currentMethod.includes("user"),
    aE: common_vendor.t($data.formData.positionId ? ((_c = $data.categories.find((c) => c.id === $data.formData.positionId)) == null ? void 0 : _c.name) || "\u8BF7\u9009\u62E9\u804C\u4F4D\u7C7B\u578B" : "\u8BF7\u9009\u62E9\u804C\u4F4D\u7C7B\u578B"),
    aF: common_vendor.o((...args) => $options.onPositionChange && $options.onPositionChange(...args)),
    aG: $data.categories,
    aH: $data.currentMethod.includes("position"),
    aI: $data.formData.positionText,
    aJ: common_vendor.o(($event) => $data.formData.positionText = $event.detail.value),
    aK: $data.currentMethod.includes("text"),
    aL: common_vendor.t($data.formData.pdfFile ? $data.formData.pdfFile.name : "\u70B9\u51FB\u9009\u62E9PDF\u6587\u4EF6"),
    aM: common_vendor.o((...args) => $options.chooseFile && $options.chooseFile(...args)),
    aN: $data.currentMethod.includes("pdf")
  }) : {}, {
    aO: common_vendor.o((...args) => $options.submitFunction && $options.submitFunction(...args)),
    aP: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args)),
    aQ: common_vendor.o(() => {
    }),
    aR: common_vendor.o((...args) => $options.closePanel && $options.closePanel(...args))
  }) : {});
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6fa74974"], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/AI/AI.vue"]]);
wx.createPage(MiniProgramPage);
