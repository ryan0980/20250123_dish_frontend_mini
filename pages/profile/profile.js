Page({
  data: {
    avatarUrl: "/assets/icons/user-settings-line.svg",
    showModal: false,
    modalType: "", // 'allergy' 或 'dislike'
    inputValue: "",
    allergyTags: [],
    dislikeTags: [],
    currentTags: [], // 当前显示的标签列表
  },

  onLoad() {
    // 页面加载时读取本地存储的头像
    const savedAvatar = wx.getStorageSync("userAvatar");
    if (savedAvatar) {
      this.setData({
        avatarUrl: savedAvatar,
      });
    }

    // 读取保存的标签
    const allergyTags = wx.getStorageSync("allergyTags") || [];
    const dislikeTags = wx.getStorageSync("dislikeTags") || [];
    this.setData({ allergyTags, dislikeTags });
  },

  changeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      camera: "back",
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;

        // 将图片保存到本地文件系统
        const fs = wx.getFileSystemManager();
        const fileName = `avatar_${new Date().getTime()}.jpg`;
        const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;

        fs.copyFile({
          srcPath: tempFilePath,
          destPath: filePath,
          success: () => {
            // 保存永久路径到本地存储
            wx.setStorageSync("userAvatar", filePath);

            this.setData({
              avatarUrl: filePath,
            });

            wx.showToast({
              title: "头像已保存",
              icon: "success",
            });
          },
          fail: (err) => {
            wx.showToast({
              title: "保存失败",
              icon: "error",
            });
            console.error("保存头像失败:", err);
          },
        });
      },
    });
  },

  onTapItem(e) {
    const type = e.currentTarget.dataset.type;
    switch (type) {
      case "allergy":
      case "dislike":
        this.showModal(type);
        break;
      case "history":
        wx.showToast({
          title: "历史记录开发中",
          icon: "none",
        });
        break;
      case "favorite":
        wx.showToast({
          title: "收藏功能开发中",
          icon: "none",
        });
        break;
      case "about":
        wx.showToast({
          title: "关于页面开发中",
          icon: "none",
        });
        break;
    }
  },

  showModal(type) {
    this.setData({
      showModal: true,
      modalType: type,
      currentTags: type === "allergy" ? this.data.allergyTags : this.data.dislikeTags,
      inputValue: "",
    });
  },

  hideModal() {
    this.setData({
      showModal: false,
    });
  },

  preventTouchMove() {
    // 阻止背景滚动
    return;
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value.trim(),
    });
  },

  addTag() {
    const { inputValue, modalType, allergyTags, dislikeTags } = this.data;
    if (!inputValue) return;

    const tags = modalType === "allergy" ? allergyTags : dislikeTags;
    if (tags.includes(inputValue)) {
      wx.showToast({
        title: "该标签已存在",
        icon: "none",
      });
      return;
    }

    const newTags = [...tags, inputValue];
    const updateData = {
      inputValue: "",
      currentTags: newTags,
    };

    if (modalType === "allergy") {
      updateData.allergyTags = newTags;
      wx.setStorageSync("allergyTags", newTags);
    } else {
      updateData.dislikeTags = newTags;
      wx.setStorageSync("dislikeTags", newTags);
    }

    this.setData(updateData);
  },

  deleteTag(e) {
    const { index } = e.currentTarget.dataset;
    const { modalType, allergyTags, dislikeTags } = this.data;

    const tags = modalType === "allergy" ? allergyTags : dislikeTags;
    const newTags = tags.filter((_, i) => i !== index);

    const updateData = {
      currentTags: newTags,
    };

    if (modalType === "allergy") {
      updateData.allergyTags = newTags;
      wx.setStorageSync("allergyTags", newTags);
    } else {
      updateData.dislikeTags = newTags;
      wx.setStorageSync("dislikeTags", newTags);
    }

    this.setData(updateData);
  },
});
