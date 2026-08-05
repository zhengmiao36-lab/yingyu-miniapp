const { playPageEnter } = require('../../utils/motion');
const { getOrder, saveOrder } = require('../../utils/order-store');
const { getWechatOrder, isWechatPayEnabled } = require('../../utils/payment-service');

function money(value) {
  const amount = Number(value || 0);
  return amount.toFixed(amount % 1 === 0 ? 0 : 2);
}

function formatVerificationCode(value) {
  return String(value || '').replace(/(.{4})/g, '$1 ').trim();
}

Page({
  data: {
    pageMotionClass: '',
    orderId: '',
    order: null,
    verificationCodeText: '',
    totalAmountText: '0',
    canRefresh: false
  },

  onLoad(options) {
    this.setData({ orderId: decodeURIComponent(options.id || '') });
  },

  onShow() {
    this.loadLocalOrder();
  },

  loadLocalOrder() {
    const order = getOrder(this.data.orderId);
    if (!order) {
      wx.showModal({
        title: '订单不存在',
        content: '未找到对应的订单记录。',
        showCancel: false,
        success: () => wx.navigateBack()
      });
      return;
    }
    this.presentOrder(order);
  },

  presentOrder(order) {
    this.setData({
      order,
      verificationCodeText: formatVerificationCode(order.verificationCode),
      totalAmountText: money(order.totalAmount),
      canRefresh: !order.demo && !order.verificationCode && isWechatPayEnabled()
    }, () => playPageEnter(this));
  },

  copyCode() {
    wx.setClipboardData({
      data: String(this.data.order.verificationCode),
      success: () => wx.showToast({ title: '核销码已复制', icon: 'success' })
    });
  },

  async refreshOrder() {
    wx.showLoading({ title: '正在刷新', mask: true });
    try {
      const remoteOrder = await getWechatOrder(this.data.orderId);
      if (!remoteOrder) throw new Error('暂未获取到支付结果');
      const order = saveOrder({ ...this.data.order, ...remoteOrder });
      this.presentOrder(order);
    } catch (error) {
      wx.showToast({ title: error.message || '刷新失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  openOrders() {
    wx.redirectTo({ url: '/pages/orders/index' });
  }
});
