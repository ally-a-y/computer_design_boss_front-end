"use strict";
var common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      devices: [
        {
          name: "Windows PC (Chrome)",
          loginTime: "2024-01-18 14:30",
          isCurrent: true
        },
        {
          name: "iPhone 13 (Safari)",
          loginTime: "2024-01-17 09:15",
          isCurrent: false
        },
        {
          name: "Android Phone (Chrome)",
          loginTime: "2024-01-16 16:45",
          isCurrent: false
        }
      ]
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    deleteDevice(index) {
      common_vendor.index.showModal({
        title: "\u63D0\u793A",
        content: "\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u8BBE\u5907\u5417\uFF1F",
        success: (res) => {
          if (res.confirm) {
            this.devices.splice(index, 1);
            common_vendor.index.showToast({
              title: "\u8BBE\u5907\u5DF2\u5220\u9664",
              icon: "success"
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.devices, (item, index, i0) => {
      return common_vendor.e({
        a: "6fd6f29b-0-" + i0,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.loginTime),
        d: item.isCurrent
      }, item.isCurrent ? {} : {}, {
        e: !item.isCurrent
      }, !item.isCurrent ? {
        f: common_vendor.o(($event) => $options.deleteDevice(index))
      } : {}, {
        g: index
      });
    }),
    c: common_vendor.p({
      type: "monitor",
      size: "40",
      color: "#007aff"
    })
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/.aboss_init(\u672C\u5730)/computer_design_boss_front-end/pages/user/device/user_device.vue"]]);
wx.createPage(MiniProgramPage);
