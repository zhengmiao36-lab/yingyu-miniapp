const { playPageEnter } = require('../../utils/motion');
const { getOrders } = require('../../utils/order-store');

function money(value) {
  const amount = Number(value || 0);
  return amount.toFixed(amount % 1 === 0 ? 0 : 2);
}

Page({
  data: {
    pageMotionClass: '',
    orders: []
  },

  onShow() {
    const orders = getOrders().map((order) => ({
      ...order,
      totalAmountText: money(order.totalAmount)
    }));
    this.setData({ orders }, () => playPageEnter(this));
  },

  openOrder(event) {
    wx.navigateTo({
      url: `/pages/order-detail/index?id=${encodeURIComponent(event.currentTarget.dataset.id)}`
    });
  },

  openStore() {
    wx.switchTab({ url: '/pages/store/index' });
  }
});
