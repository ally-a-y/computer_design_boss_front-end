"use strict";
const common_vendor = require("../vendor.js");
const common_utils_themeSimple = require("../utils/theme-simple.js");
const themeMixin = {
  data() {
    return {
      currentTheme: "light",
      isDarkMode: false
    };
  },
  mounted() {
    this.initTheme();
  },
  beforeUnmount() {
    common_vendor.index.$off("globalThemeChange", this.handleGlobalThemeChange);
  },
  methods: {
    initTheme() {
      this.currentTheme = common_utils_themeSimple.themeManager.getCurrentTheme();
      this.isDarkMode = this.currentTheme === "dark";
      common_vendor.index.$on("globalThemeChange", this.handleGlobalThemeChange);
    },
    handleGlobalThemeChange(data) {
      this.currentTheme = data.theme;
      this.isDarkMode = data.isDark;
    }
  }
};
exports.themeMixin = themeMixin;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/mixins/themeMixin.js.map
