// app.js
App({
  globalData: {
    isCloudInited: false,
  },

  onLaunch: function () {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
      return;
    }

    if (!this.globalData.isCloudInited) {
      wx.cloud.init({
        env: "prod-8ghq809e099fda9e", // 云托管环境ID
        traceUser: true,
      });
      this.globalData.isCloudInited = true;
      console.log("云开发环境初始化成功");
    }

    // 获取系统信息
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      console.log("系统信息:", systemInfo);
    } catch (e) {
      console.error("获取系统信息失败:", e);
    }
  },
});
