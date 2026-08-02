const { products } = require('../../utils/mock-data');

Page({
  data: {
    products,
    cartCount: 0
  },

  onShow() {
    this.setData({ cartCount: wx.getStorageSync('demoCartCount') || 0 });
  },

  buyProduct(event) {
    const product = products.find((item) => item.id === event.currentTarget.dataset.id);
    wx.showModal({
      title: product.name,
      content: `演示价格 ¥${product.price}\n当前原型不会发起真实支付。`,
      cancelText: '取消',
      confirmText: '加入演示订单',
      confirmColor: '#8d743d',
      success: ({ confirm }) => {
        if (!confirm) return;
        const cartCount = this.data.cartCount + 1;
        wx.setStorageSync('demoCartCount', cartCount);
        this.setData({ cartCount });
        wx.showToast({ title: '已加入演示订单', icon: 'success' });
      }
    });
  }
});
