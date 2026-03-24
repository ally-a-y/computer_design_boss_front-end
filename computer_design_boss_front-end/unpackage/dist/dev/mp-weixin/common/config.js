"use strict";
const config = {
  development: {
    baseURL: "http://localhost:5000/api",
    staticURL: "http://localhost:5000",
    // 添加兼容命名
    apiBase: "http://localhost:5000/api",
    fileBase: "http://localhost:5000"
  },
  production: {
    baseURL: "https://api.yourdomain.com/api",
    staticURL: "https://yourdomain.com",
    apiBase: "https://api.yourdomain.com/api",
    fileBase: "https://yourdomain.com"
  }
};
const env = "development";
const config$1 = config[env];
exports.config = config$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/config.js.map
