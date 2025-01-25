Page({
  data: {
    images: [],
    currentImageIndex: 0,
    loading: false,
    isFavorite: false,
    message: "",
    resultList: [],
  },

  onLoad(options) {
    const { images, message } = options;
    if (images) {
      this.setData({
        images: JSON.parse(images),
        message: message || "暂无识别结果",
      });
      this.startRecognition();
    }
  },

  onSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current,
    });
  },

  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images,
    });
  },

  startRecognition() {
    // TODO: 调用后端识别接口
    setTimeout(() => {
      this.setData({
        loading: false,
        resultList: [
          { name: "宫保鸡丁", price: "38" },
          { name: "麻婆豆腐", price: "28" },
          { name: "水煮鱼", price: "58" },
          { name: "青椒肉丝", price: "32" },
        ],
      });
    }, 2000);
  },

  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
  },

  onFavorite() {
    this.setData({
      isFavorite: !this.data.isFavorite,
    });
    wx.showToast({
      title: this.data.isFavorite ? "已收藏" : "已取消收藏",
      icon: "success",
    });
  },
});
