const { actors, products, ticketPrice } = require('../../utils/mock-data');
const { playPageEnter } = require('../../utils/motion');
const { createDemoOrder, saveOrder } = require('../../utils/order-store');
const { isWechatPayEnabled, startWechatPayment } = require('../../utils/payment-service');

function readOption(value) {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

function money(value) {
  return Number(value).toFixed(Number(value) % 1 === 0 ? 0 : 2);
}

function makeClientRequestId() {
  return `miniapp-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function formatCreatedAt(now) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

Page({
  data: {
    pageMotionClass: '',
    orderType: '',
    itemId: '',
    actorId: '',
    performanceDate: '',
    performanceTime: '',
    clientRequestId: '',
    itemTitle: '',
    itemSubtitle: '',
    typeText: '',
    fulfillmentLabel: '',
    fulfillmentMode: 'store',
    validUntil: '',
    unitPrice: 0,
    unitPriceText: '0',
    quantity: 1,
    maxQuantity: 9,
    unitText: '件',
    totalAmountText: '0',
    isDemoPayment: !isWechatPayEnabled(),
    submitting: false,
    submitButtonText: ''
  },

  onLoad(options) {
    const orderType = options.type === 'ticket' ? 'ticket' : 'product';
    const checkoutItem = orderType === 'ticket'
      ? this.buildTicketItem(options)
      : this.buildProductItem(options);

    if (!checkoutItem) {
      wx.showToast({ title: '订单信息无效', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    this.setData({
      orderType,
      clientRequestId: makeClientRequestId(),
      unitText: orderType === 'ticket' ? '张' : '件',
      ...checkoutItem
    }, () => {
      this.updateTotal();
      playPageEnter(this);
    });
  },

  buildProductItem(options) {
    const product = products.find((item) => item.id === options.itemId);
    const actor = actors.find((item) => item.id === options.actorId);
    if (!product) return null;
    const isRankingGift = options.source === 'ranking' && Boolean(actor);
    return {
      itemId: product.id,
      actorId: actor ? actor.id : '',
      itemTitle: isRankingGift ? `${product.name} · 赠予${actor.name}` : product.name,
      itemSubtitle: isRankingGift
        ? `${actor.role} ${actor.name} · 卡司积分 +${product.points}`
        : `卡司积分 +${product.points} · 会员积分 +${product.memberPoints}`,
      typeText: isRankingGift ? '送花打榜' : '商城商品',
      fulfillmentLabel: isRankingGift ? '支付后自动计入演员榜单' : product.label,
      validUntil: isRankingGift ? '订单生成后 24 小时内' : '购买后 30 天内',
      fulfillmentMode: isRankingGift ? 'ranking' : 'store',
      unitPrice: product.price,
      unitPriceText: money(product.price),
      quantity: Math.max(1, Math.min(9, Number(options.quantity) || 1)),
      maxQuantity: 9
    };
  },

  buildTicketItem(options) {
    const actor = actors.find((item) => item.id === options.actorId);
    const date = readOption(options.date);
    const time = readOption(options.time);
    if (!date || !time) return null;
    return {
      itemId: `show-${date}-${time}`,
      actorId: actor ? actor.id : '',
      performanceDate: date,
      performanceTime: time,
      itemTitle: '雾隐长安',
      itemSubtitle: `${date} ${time}${actor ? ` · 卡司 ${actor.name}` : ''}`,
      typeText: '沉浸式演出票',
      fulfillmentLabel: '入场前到店核销',
      validUntil: `${date} ${time} 场次`,
      fulfillmentMode: 'store',
      unitPrice: ticketPrice,
      unitPriceText: money(ticketPrice),
      maxQuantity: 6
    };
  },

  changeQuantity(event) {
    const quantity = Math.max(1, Math.min(
      this.data.maxQuantity,
      this.data.quantity + Number(event.currentTarget.dataset.delta)
    ));
    this.setData({ quantity }, () => this.updateTotal());
  },

  updateTotal() {
    const totalAmountText = money(this.data.unitPrice * this.data.quantity);
    const prefix = this.data.isDemoPayment ? '生成演示凭证' : '微信支付';
    this.setData({
      totalAmountText,
      submitButtonText: `${prefix} ¥${totalAmountText}`
    });
  },

  submitOrder() {
    if (this.data.submitting) return;
    if (this.data.isDemoPayment) {
      wx.showModal({
        title: '确认生成演示订单',
        content: `合计 ¥${this.data.totalAmountText}\n此操作仅生成演示核销凭证，不会扣款。`,
        cancelText: '返回修改',
        confirmText: '确认生成',
        confirmColor: '#8d743d',
        success: ({ confirm }) => {
          if (confirm) this.completeDemoOrder();
        }
      });
      return;
    }
    this.completeWechatPayment();
  },

  completeDemoOrder() {
    this.setData({ submitting: true, submitButtonText: '正在生成凭证' });
    const order = createDemoOrder(this.buildOrderPayload());
    wx.redirectTo({ url: `/pages/order-detail/index?id=${encodeURIComponent(order.id)}` });
  },

  async completeWechatPayment() {
    this.setData({ submitting: true, submitButtonText: '正在唤起微信支付' });
    wx.showLoading({ title: '正在支付', mask: true });
    try {
      const result = await startWechatPayment({
        clientRequestId: this.data.clientRequestId,
        orderType: this.data.orderType,
        itemId: this.data.itemId,
        actorId: this.data.actorId,
        fulfillmentMode: this.data.fulfillmentMode,
        performanceDate: this.data.performanceDate,
        performanceTime: this.data.performanceTime,
        quantity: this.data.quantity
      });
      const baseOrder = this.buildOrderPayload();
      const remoteOrder = result.order || {};
      const order = saveOrder({
        ...baseOrder,
        ...remoteOrder,
        id: remoteOrder.id || result.orderId,
        orderNo: remoteOrder.orderNo || result.orderId,
        status: remoteOrder.status || 'paid',
        statusText: remoteOrder.statusText || '支付结果确认中',
        verificationCode: remoteOrder.verificationCode || '',
        verificationQrUrl: remoteOrder.verificationQrUrl || '',
        demo: false
      });
      wx.redirectTo({ url: `/pages/order-detail/index?id=${encodeURIComponent(order.id)}` });
    } catch (error) {
      if (error.code !== 'PAYMENT_CANCELLED') {
        wx.showToast({ title: error.message || '支付未完成', icon: 'none' });
      }
      this.setData({ submitting: false }, () => this.updateTotal());
    } finally {
      wx.hideLoading();
    }
  },

  buildOrderPayload() {
    return {
      orderType: this.data.orderType,
      typeText: this.data.typeText || (this.data.orderType === 'ticket' ? '演出票' : '商城商品'),
      title: this.data.itemTitle,
      subtitle: this.data.itemSubtitle,
      quantity: this.data.quantity,
      unitText: this.data.unitText,
      unitPrice: this.data.unitPrice,
      totalAmount: Number((this.data.unitPrice * this.data.quantity).toFixed(2)),
      fulfillmentLabel: this.data.fulfillmentLabel,
      validUntil: this.data.validUntil,
      fulfillmentMode: this.data.fulfillmentMode || 'store',
      createdAt: formatCreatedAt(new Date())
    };
  }
});
