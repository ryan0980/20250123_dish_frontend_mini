// index.js
Page({
  data: {
    tempImagePath: "", // 临时图片路径
  },

  // 选择图片（点击整个区域时触发）
  chooseImage() {
    wx.showActionSheet({
      itemList: ["拍照", "从相册选择"],
      success: (res) => {
        const sourceType = res.tapIndex === 0 ? ["camera"] : ["album"];
        this.chooseMedia(sourceType);
      },
    });
  },

  // 直接从相册选择（点击相册图标时触发）
  chooseFromAlbum(e) {
    // 阻止事件冒泡，防止触发父元素的点击事件
    e.stopPropagation();
    this.chooseMedia(["album"]);
  },

  // 选择媒体的公共方法
  chooseMedia(sourceType) {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: sourceType,
      success: (res) => {
        this.setData({
          tempImagePath: res.tempFiles[0].tempFilePath,
        });
      },
    });
  },

  // 提交图片
  submitImage() {
    if (!this.data.tempImagePath) {
      return;
    }

    wx.showLoading({
      title: "识别中...",
    });

    // TODO: 这里后续添加上传到后端的逻辑
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: "识别成功",
        icon: "success",
      });
    }, 1500);
  },
});
