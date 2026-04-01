"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var common_vendor = require("../vendor.js");
var common_config = require("../config.js");
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
      const queryParams = isGet ? __spreadValues(__spreadValues({}, options.params || {}), options.data || {}) : options.params || {};
      const fullUrl = buildFullUrl(options.url, queryParams);
      const urlWithTimestamp = fullUrl + (fullUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
      const requestConfig = {
        url: urlWithTimestamp,
        method: options.method || "GET",
        timeout: 6e4,
        sslVerify: false,
        header: __spreadValues({
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }, options.header)
      };
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        requestConfig.header["Authorization"] = `Bearer ${token}`;
      }
      if (!isGet && options.data) {
        requestConfig.data = options.data;
      }
      common_vendor.index.request(__spreadProps(__spreadValues({}, requestConfig), {
        success: (res) => {
          var _a;
          {
            console.log("\u3010\u54CD\u5E94\u3011", res.statusCode, res.data);
          }
          if (res.statusCode === 200) {
            const data = res.data;
            if (data && typeof data === "object" && "code" in data) {
              if (data.code === 200) {
                resolve(data.data !== void 0 ? data.data : data);
              } else {
                reject(new Error(data.message || `\u8BF7\u6C42\u5931\u8D25: ${data.code}`));
              }
            } else {
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${((_a = res.data) == null ? void 0 : _a.message) || ""}`));
          }
        },
        fail: (err) => {
          console.error(`\u3010\u8BF7\u6C42\u5931\u8D25\u3011`, err);
          if (attempt < retryCount - 1) {
            const delay = Math.pow(2, attempt) * 1e3;
            setTimeout(() => attemptRequest(attempt + 1), delay);
          } else {
            reject(new Error(err.errMsg || "\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25"));
          }
        }
      }));
    };
    attemptRequest(0);
  });
};
exports.requestWithRetry = requestWithRetry;
