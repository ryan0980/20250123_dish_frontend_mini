Page({
  data: {
    pingStatus: "", // 百度连接状态
    serverStatus: "", // 本地服务器状态
    cloudStatus: "", // 云托管状态
    containerStatus: "", // 添加 Container 测试状态
    useCallContainer: true, // 添加请求方式开关状态
  },

  // 测试连接百度
  testPingBaidu() {
    wx.showLoading({
      title: "测试中...",
    });

    wx.request({
      url: "https://www.baidu.com",
      timeout: 5000,
      success: (res) => {
        this.setData({
          pingStatus: "连接正常",
        });
        wx.showToast({
          title: "连接成功",
          icon: "success",
        });
      },
      fail: (err) => {
        this.setData({
          pingStatus: "连接失败",
        });
        wx.showToast({
          title: "连接失败",
          icon: "error",
        });
        console.error("百度连接测试失败:", err);
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  },

  // 测试本地服务器
  testLocalServer() {
    wx.showLoading({
      title: "测试中...",
    });

    wx.request({
      url: "http://127.0.0.1:5000/health", // 假设有一个健康检查接口
      timeout: 5000,
      success: (res) => {
        this.setData({
          serverStatus: "服务正常",
        });
        wx.showToast({
          title: "连接成功",
          icon: "success",
        });
      },
      fail: (err) => {
        this.setData({
          serverStatus: "服务异常",
        });
        wx.showToast({
          title: "连接失败",
          icon: "error",
        });
        console.error("本地服务器测试失败:", err);
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  },
  // 测试云托管连接
  testCloudService() {
    wx.showLoading({
      title: "测试中...",
    });

    wx.request({
      url: "https://flask-fbj3-138928-10-1339459170.sh.run.tcloudbase.com/api/health",
      method: "GET",
      success: ({ data }) => {
        const { status } = data.data;
        console.log("服务状态:", status);
        console.log("完整响应:", data);

        if (status === "running") {
          this.setData({ cloudStatus: "服务正常" });
          wx.showToast({
            title: "连接成功",
            icon: "success",
          });
        } else {
          console.error("‼️ 服务异常");
          this.setData({ cloudStatus: "服务异常" });
          wx.showToast({
            title: "服务异常",
            icon: "error",
          });
        }
      },
      fail: (err) => {
        console.error("请求失败:", err.errMsg);
        this.setData({ cloudStatus: "服务异常" });
        wx.showToast({
          title: "连接失败",
          icon: "error",
        });
      },
      complete: wx.hideLoading,
    });
  },

  // 测试获取用户信息
  testGetUserInfo() {
    wx.cloud.callContainer({
      config: {
        env: "prod-7gnktgn569fb17fd",
      },
      path: "/api/user/info", // 假设这是获取用户信息的接口
      method: "GET",
      header: {
        "X-WX-SERVICE": "flask-fbj3",
      },
      success: (res) => {
        this.setData({
          cloudStatus: "服务正常",
        });
        wx.showToast({
          title: "连接成功",
          icon: "success",
        });
        console.log("用户信息:", res.data);
      },
      fail: (err) => {
        this.setData({
          cloudStatus: "服务异常",
        });
        wx.showToast({
          title: "获取信息失败",
          icon: "error",
        });
        console.error("获取用户信息失败:", err);
      },
      complete: () => {
        wx.hideLoading();
      },
    });
  },

  // 测试云托管 callContainer
  testCloudContainer() {
    wx.showLoading({
      title: "测试中...",
    });

    wx.cloud.callContainer({
      config: {
        env: "prod-7gnktgn569fb17fd",
      },
      path: "/api/count",
      method: "POST",
      header: {
        "X-WX-SERVICE": "flask-fbj3",
      },
      data: {
        action: "inc",
      },
      success: ({ data }) => {
        console.log("=== Container 测试响应 ===");
        console.log("状态码:", data.code);
        console.log("计数:", data.count);
        console.log("完整数据:", JSON.stringify(data, null, 2));
        console.log("========================");

        if (data && data.code === 0) {
          this.setData({ containerStatus: "服务正常" });
          wx.showToast({
            title: "连接成功",
            icon: "success",
          });
        } else {
          console.error("‼️ Container异常");
          this.setData({ containerStatus: "服务异常" });
          wx.showToast({
            title: "服务异常",
            icon: "error",
          });
        }
      },
      fail: (err) => {
        console.error("请求失败:", err.errMsg);
        this.setData({ containerStatus: "服务异常" });
        wx.showToast({
          title: "连接失败",
          icon: "error",
        });
      },
      complete: wx.hideLoading,
    });
  },

  // 上传文件
  uploadFile() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const filePath = res.tempFilePaths[0];
        wx.showLoading({
          title: "上传中...",
        });

        wx.cloud.uploadFile({
          cloudPath: `uploads/${new Date().getTime()}.png`, // 生成唯一文件名
          filePath: filePath,
          config: {
            env: "prod-7gnktgn569fb17fd", // 替换为你的环境ID
          },
          success: (uploadRes) => {
            console.log("上传成功:", uploadRes.fileID);
            wx.showToast({
              title: "上传成功",
              icon: "success",
            });
          },
          fail: (err) => {
            console.error("上传失败:", err);
            wx.showToast({
              title: "上传失败",
              icon: "error",
            });
          },
          complete: () => {
            wx.hideLoading();
          },
        });
      },
      fail: (err) => {
        console.error("选择图片失败:", err);
      },
    });
  },

  // 切换请求方式
  onRequestMethodChange(e) {
    const useCallContainer = e.detail.value;
    this.setData({ useCallContainer });
    // 保存到本地存储
    wx.setStorageSync("useCallContainer", useCallContainer);
    wx.showToast({
      title: `已切换为${useCallContainer ? "Container" : "Request"}`,
      icon: "none",
    });
  },

  onLoad() {
    // 读取本地存储的请求方式设置
    const useCallContainer = wx.getStorageSync("useCallContainer");
    if (typeof useCallContainer === "boolean") {
      this.setData({ useCallContainer });
    }
  },
});
