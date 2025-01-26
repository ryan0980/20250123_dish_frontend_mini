Page({
  data: {
    images: [],
    currentImageIndex: 0,
    loading: false,
    isFavorite: false,
    message: "",
    resultList: [],
    categories: {},
    processingTime: "",
    timestamp: "",
    totalItems: 0,
    categoryNames: {
      1: "前菜/凉菜",
      2: "主菜/热菜",
      3: "汤类",
      4: "主食/面食",
      5: "甜点",
      6: "饮品",
      7: "其他",
    },
  },

  onLoad(options) {
    const { images, result } = options;
    if (images) {
      const parsedResult = JSON.parse(decodeURIComponent(result));

      // 处理菜品名称，移除*号和多余的引号
      Object.keys(parsedResult.categories).forEach((key) => {
        if (parsedResult.categories[key].items) {
          parsedResult.categories[key].items = parsedResult.categories[key].items.map((item) => ({
            ...item,
            name: item.name
              .replace(/[*"]/g, "") // 移除所有*号和引号
              .replace(/^\s*\*+\s*|\s*\*+\s*$/g, "") // 移除开头和结尾的*号和空格
              .trim(), // 清理多余空格
            description: item.description?.replace(/[*"]/g, "").trim(),
          }));
        }
      });

      this.setData({
        images: JSON.parse(images),
        categories: parsedResult.categories,
        processingTime: parsedResult.processing_time,
        timestamp: parsedResult.timestamp,
        totalItems: parsedResult.total_items,
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
