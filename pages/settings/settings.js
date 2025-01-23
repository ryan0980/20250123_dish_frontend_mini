Page({
  data: {
    version: "1.0.0",
  },

  onThemeChange(e) {
    wx.showToast({
      title: "主题切换开发中",
      icon: "none",
    });
  },

  onNotificationChange(e) {
    wx.showToast({
      title: "通知设置开发中",
      icon: "none",
    });
  },

  clearCache() {
    wx.showModal({
      title: "提示",
      content: "确定要清除缓存吗？",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: "清除成功",
            icon: "success",
          });
        }
      },
    });
  },

  checkUpdate() {
    wx.showToast({
      title: "已是最新版本",
      icon: "success",
    });
  },
});
