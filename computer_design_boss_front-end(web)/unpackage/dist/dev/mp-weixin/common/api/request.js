"use strict";
const common_vendor = require("../vendor.js");
const common_config = require("../config.js");
const requestCache = /* @__PURE__ */ new Map();
const CACHE_EXPIRY = 5 * 60 * 1e3;
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
const generateCacheKey = (url, params) => {
  const fullUrl = buildFullUrl(url, params);
  return fullUrl;
};
const getCachedData = (cacheKey) => {
  const cached = requestCache.get(cacheKey);
  if (cached) {
    const { data, timestamp } = cached;
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data;
    }
    requestCache.delete(cacheKey);
  }
  return null;
};
const setCachedData = (cacheKey, data) => {
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};
const requestWithRetry = (options, retryCount = 3) => {
  return new Promise((resolve, reject) => {
    const isGet = (options.method || "GET").toUpperCase() === "GET";
    if (isGet && !options.noCache) {
      const cacheKey = generateCacheKey(options.url, options.params || options.data);
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return resolve(cachedData);
      }
    }
    const attemptRequest = (attempt) => {
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
          "Cache-Control": "no-cache",
          ...options.header
        }
      };
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        requestConfig.header["Authorization"] = `Bearer ${token}`;
      }
      if (!isGet && options.data) {
        requestConfig.data = options.data;
      }
      common_vendor.index.request({
        ...requestConfig,
        success: (res) => {
          var _a;
          if (res.statusCode === 200) {
            const data = res.data;
            if (data && typeof data === "object" && "code" in data) {
              if (data.code === 200) {
                const result = data.data !== void 0 ? data.data : data;
                if (isGet && !options.noCache) {
                  const cacheKey = generateCacheKey(options.url, options.params || options.data);
                  setCachedData(cacheKey, result);
                }
                resolve(result);
              } else {
                reject(new Error(data.message || `请求失败: ${data.code}`));
              }
            } else {
              if (isGet && !options.noCache) {
                const cacheKey = generateCacheKey(options.url, options.params || options.data);
                setCachedData(cacheKey, data);
              }
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${((_a = res.data) == null ? void 0 : _a.message) || ""}`));
          }
        },
        fail: (err) => {
          if (attempt < retryCount - 1) {
            const delay = Math.pow(2, attempt) * 500;
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
