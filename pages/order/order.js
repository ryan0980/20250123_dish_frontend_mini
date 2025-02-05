Page({
  data: {
    items: [],
    totalPrice: 0,
  },

  onLoad(options) {
    if (options.items) {
      const items = JSON.parse(decodeURIComponent(options.items));
      this.setData({ items });
      this.calculateTotal();
    }
  },

  calculateTotal() {
    const total = this.data.items.reduce((sum, item) => {
      return sum + parseFloat(item.price);
    }, 0);

    this.setData({
      totalPrice: total.toFixed(2),
    });
  },
});
