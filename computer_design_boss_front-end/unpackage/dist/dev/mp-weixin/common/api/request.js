"use strict";
const common_vendor = require("../vendor.js");
const common_config = require("../config.js");
const buildFullUrl = (path, params) => {
  if (!path)
    return common_config.config.baseURL;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  let baseUrl = common_config.config.baseURL;
  let finalPath = normalizedPath;
  if (baseUrl.endsWith("/api") && normalizedPath.startsWith("/api/")) {
    finalPath = normalizedPath.substring(4);
  }
  let url = baseUrl + finalPath;
  if (params && typeof params === "object" && Object.keys(params).length > 0) {
    const queryString = Object.keys(params).filter((key) => params[key] !== void 0 && params[key] !== null && params[key] !== "").map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }
  return url;
};
const requestWithRetry = (options, retryCount = 3) => {
  return new Promise((resolve, reject) => {
    const attemptRequest = (attempt) => {
      const isGet = (options.method || "GET").toUpperCase() === "GET";
      const queryParams = isGet ? { ...options.params || {}, ...options.data || {} } : options.params || {};
      const fullUrl = buildFullUrl(options.url, queryParams);
      const urlWithTimestamp = fullUrl + (fullUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
      const requestConfig = {
        url: urlWithTimestamp,
        method: options.method || "GET",
        timeout: 6e4,
        sslVerify: false,
        header: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${common_vendor.index.getStorageSync("token") || ""}`,
          "Cache-Control": "no-cache",
          ...options.header
        }
      };
      if (!isGet && options.data) {
        requestConfig.data = options.data;
      }
      common_vendor.index.request({
        ...requestConfig,
        success: (res) => {
          var _a;
          {
            common_vendor.index.__f__("log", "at common/api/request.js:77", "【响应】", res.statusCode, res.data);
          }
          if (res.statusCode === 200) {
            const data = res.data;
            if (data && typeof data === "object" && "code" in data) {
              if (data.code === 200) {
                resolve(data.data !== void 0 ? data.data : data);
              } else {
                reject(new Error(data.message || `请求失败: ${data.code}`));
              }
            } else {
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${((_a = res.data) == null ? void 0 : _a.message) || ""}`));
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at common/api/request.js:97", `【请求失败】`, err);
          if (attempt < retryCount - 1) {
            const delay = Math.pow(2, attempt) * 1e3;
            setTimeout(() => attemptRequest(attempt + 1), delay);
          } else {
            reject(new Error(err.errMsg || "网络请求失败"));
          }
        }
      });
    };
    attemptRequest(0);
  });
};
exports.requestWithRetry = requestWithRetry;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/api/request.js.map
