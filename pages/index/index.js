// index.js
Page({
  data: {
    imageList: [], // 存储多张图片路径
    imageBase64List: [], // 存储base64编码
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

        // 转换新选择的图片为base64
        newImages.forEach((path) => {
          this.imageToBase64(path);
        });

        this.setData({
          imageList: [...this.data.imageList, ...newImages],
        });
      },
    });
  },

  // 图片转base64
  imageToBase64(filePath) {
    const fs = wx.getFileSystemManager();
    try {
      // 添加图片压缩
      wx.compressImage({
        src: filePath,
        quality: 80,
        success: (res) => {
          const base64 = fs.readFileSync(res.tempFilePath, "base64");
          const newBase64List = [...this.data.imageBase64List, base64];
          this.setData({
            imageBase64List: newBase64List,
          });
          console.log("转换成功，当前base64数量:", newBase64List.length);
        },
        fail: (err) => {
          console.error("压缩失败:", err);
        },
      });
    } catch (error) {
      console.error("转base64失败:", error);
      wx.showToast({
        title: "图片处理失败",
        icon: "error",
      });
    }
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const newList = [...this.data.imageList];
    const newBase64List = [...this.data.imageBase64List];

    newList.splice(index, 1);
    newBase64List.splice(index, 1);

    this.setData({
      imageList: newList,
      imageBase64List: newBase64List,
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
      title: "上传中...",
      mask: true, // 添加遮罩防止重复点击
    });

    // 发送第一张图片测试
    wx.request({
      url: "http://127.0.0.1:5000/api/upload_base64", // 改回本地测试地址
      method: "POST",
      header: {
        "content-type": "application/json",
        // 移除 X-WX-SERVICE 头部
      },
      data: JSON.stringify({
        image: this.data.imageBase64List[0],
      }),
      success: (res) => {
        console.log("上传响应:", res);
        if (res.data && res.data.code === 0) {
          wx.showToast({
            title: "上传成功",
            icon: "success",
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.navigateTo({
                  url: `/pages/result/result?images=${JSON.stringify(this.data.imageList)}&message=${res.data.data.message}`,
                });
              }, 1500);
            },
          });
        } else {
          console.error("上传失败响应:", res.data);
          wx.showToast({
            title: "上传失败",
            icon: "error",
          });
        }
      },
      fail: (err) => {
        console.error("请求失败:", err);
        wx.showToast({
          title: "上传失败",
          icon: "error",
        });
      },
      complete: () => {
        setTimeout(() => {
          // 延迟关闭loading
          wx.hideLoading();
        }, 100);
      },
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
