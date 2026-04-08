"use strict";
const config = {
  development: {
    baseURL: "http://39.106.72.110/api",
    staticURL: "http://39.106.72.110",
    // 添加兼容命名
    apiBase: "http://39.106.72.110/api",
    fileBase: "http://39.106.72.110"
  },
  production: {
    baseURL: "http://39.106.72.110/api",
    staticURL: "http://39.106.72.110",
    apiBase: "http://39.106.72.110/api",
    fileBase: "http://39.106.72.110"
  }
};
const env = "development";
const config$1 = config[env];
exports.config = config$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/config.js.map
