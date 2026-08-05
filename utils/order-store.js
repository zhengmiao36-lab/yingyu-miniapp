const STORAGE_KEY = 'yingyuDemoOrders';

function pad(value, length = 2) {
  return String(value).padStart(length, '0');
}

function createOrderNo(now) {
  const stamp = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('');
  return `YY${stamp}${pad(Math.floor(Math.random() * 10000), 4)}`;
}

function createVerificationCode() {
  return pad(Math.floor(Math.random() * 100000000), 8);
}

function formatCreatedAt(now) {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function getOrders() {
  const stored = wx.getStorageSync(STORAGE_KEY);
  return Array.isArray(stored) ? stored : [];
}

function saveOrder(order) {
  const orders = getOrders();
  const index = orders.findIndex((item) => item.id === order.id);
  const nextOrder = index >= 0 ? { ...orders[index], ...order } : order;

  if (index >= 0) orders.splice(index, 1);
  orders.unshift(nextOrder);
  wx.setStorageSync(STORAGE_KEY, orders);
  return nextOrder;
}

function createDemoOrder(payload) {
  const now = new Date();
  const orderNo = createOrderNo(now);
  return saveOrder({
    id: orderNo,
    orderNo,
    orderType: payload.orderType,
    typeText: payload.typeText || (payload.orderType === 'ticket' ? '演出票' : '商城商品'),
    title: payload.title,
    subtitle: payload.subtitle,
    quantity: payload.quantity,
    unitText: payload.unitText || (payload.orderType === 'ticket' ? '张' : '件'),
    unitPrice: payload.unitPrice,
    totalAmount: Number((payload.unitPrice * payload.quantity).toFixed(2)),
    fulfillmentLabel: payload.fulfillmentLabel,
    validUntil: payload.validUntil,
    fulfillmentMode: payload.fulfillmentMode || 'store',
    status: 'paid',
    statusText: payload.fulfillmentMode === 'ranking' ? '待计入榜单' : '待核销',
    verificationCode: createVerificationCode(),
    verificationQrUrl: '',
    createdAt: formatCreatedAt(now),
    demo: true
  });
}

function getOrder(orderId) {
  return getOrders().find((item) => item.id === orderId || item.orderNo === orderId) || null;
}

function countPendingOrders() {
  return getOrders().filter((item) => item.status === 'paid').length;
}

module.exports = {
  countPendingOrders,
  createDemoOrder,
  getOrder,
  getOrders,
  saveOrder
};
