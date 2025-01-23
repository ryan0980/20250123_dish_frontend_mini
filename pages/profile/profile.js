Page({
  data: {},

  onTapItem(e) {
    const type = e.currentTarget.dataset.type;
    switch (type) {
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
});
