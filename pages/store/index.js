const { products } = require('../../utils/mock-data');
const { playPageEnter } = require('../../utils/motion');
const { countPendingOrders } = require('../../utils/order-store');

Page({
  data: {
    pageMotionClass: '',
    products,
    cartCount: 0
  },

  onShow() {
    this.setData({ cartCount: countPendingOrders() }, () => {
      playPageEnter(this);
    });
  },

  buyProduct(event) {
    const productId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/checkout/index?type=product&itemId=${productId}`
    });
  }
});
