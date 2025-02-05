Page({
  data: {
    images: [],
    currentImageIndex: 0,
    loading: false,
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
    selectedItems: [],
    totalPrice: "0.00",
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

  onCheckboxChange(e) {
    const item = e.currentTarget.dataset.item;
    const checked = e.detail.value.length > 0;

    if (checked) {
      this.data.selectedItems.push(item);
    } else {
      const index = this.data.selectedItems.findIndex((i) => i.name === item.name);
      if (index > -1) {
        this.data.selectedItems.splice(index, 1);
      }
    }

    // 更新选中项和总价
    const total = this.data.selectedItems.reduce((sum, item) => {
      return sum + parseFloat(item.price);
    }, 0);

    this.setData({
      selectedItems: this.data.selectedItems,
      totalPrice: total.toFixed(2),
    });
  },

  generateOrder() {
    if (this.data.selectedItems.length === 0) {
      return;
    }

    // 将选中的菜品传递到订单页面
    wx.navigateTo({
      url: `/pages/order/order?items=${encodeURIComponent(JSON.stringify(this.data.selectedItems))}`,
    });
  },
});
