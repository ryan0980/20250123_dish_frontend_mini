// app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: "prod-8ghq809e099fda9e", // 云托管环境ID
      traceUser: true,
    });
  },
});
