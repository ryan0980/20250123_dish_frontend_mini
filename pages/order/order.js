Page({
  data: {
    items: [],
  },

  onLoad(options) {
    if (options.items) {
      const items = JSON.parse(decodeURIComponent(options.items));
      this.setData({ items });
    }
  },
});
