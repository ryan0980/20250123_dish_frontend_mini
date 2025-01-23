// index.js
Page({
  data: {
    imageList: [], // 存储多张图片
    maxCount: 9, // 最大可选择图片数
  },

  // 选择图片（点击整个区域时触发）
  chooseImage() {
    const remainCount = this.data.maxCount - this.data.imageList.length;
    if (remainCount <= 0) {
      wx.showToast({
        title: "最多选择9张图片",
        icon: "none",
      });
      return;
    }

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
    e.stopPropagation();
    const remainCount = this.data.maxCount - this.data.imageList.length;
    if (remainCount <= 0) {
      wx.showToast({
        title: "最多选择9张图片",
        icon: "none",
      });
      return;
    }
    this.chooseMedia(["album"]);
  },

  // 选择媒体的公共方法
  chooseMedia(sourceType) {
    const remainCount = this.data.maxCount - this.data.imageList.length;
    wx.chooseMedia({
      count: remainCount,
      mediaType: ["image"],
      sourceType: sourceType,
      success: (res) => {
        const newImages = res.tempFiles.map((file) => file.tempFilePath);
        this.setData({
          imageList: [...this.data.imageList, ...newImages],
        });
      },
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const newList = [...this.data.imageList];
    newList.splice(index, 1);
    this.setData({
      imageList: newList,
    });
  },

  // 预览图片
  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.imageList[index],
      urls: this.data.imageList,
    });
  },

  // 提交图片
  submitImage() {
    if (this.data.imageList.length === 0) {
      return;
    }

    wx.showLoading({
      title: "识别中...",
    });

    // 跳转到结果页面
    wx.hideLoading();
    wx.navigateTo({
      url: `/pages/result/result?images=${JSON.stringify(this.data.imageList)}`,
    });
  },

  // 点击设置按钮
  onSettingsTap() {
    wx.navigateTo({
      url: "/pages/settings/settings",
    });
  },

  // 点击个人资料按钮
  onProfileTap() {
    wx.navigateTo({
      url: "/pages/profile/profile",
    });
  },
});
