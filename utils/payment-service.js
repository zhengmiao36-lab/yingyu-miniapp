const paymentConfig = require('../config/payment');

function getApiBaseUrl() {
  return String(paymentConfig.apiBaseUrl || '').replace(/\/$/, '');
}

function isWechatPayEnabled() {
  return paymentConfig.mode === 'wechat' && Boolean(getApiBaseUrl());
}

function request(options) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('accessToken');
    wx.request({
      ...options,
      header: {
        'content-type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.header || {})
      },
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data && response.data.data ? response.data.data : response.data);
          return;
        }
        reject(new Error(`服务请求失败（${response.statusCode}）`));
      },
      fail(error) {
        reject(new Error(error.errMsg || '网络连接失败'));
      }
    });
  });
}

function requestPayment(paymentParams) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: paymentParams.timeStamp,
      nonceStr: paymentParams.nonceStr,
      package: paymentParams.package,
      signType: paymentParams.signType || 'RSA',
      paySign: paymentParams.paySign,
      success: resolve,
      fail(error) {
        const paymentError = new Error(error.errMsg || '支付未完成');
        paymentError.code = String(error.errMsg || '').includes('cancel')
          ? 'PAYMENT_CANCELLED'
          : 'PAYMENT_FAILED';
        reject(paymentError);
      }
    });
  });
}

async function getWechatOrder(orderId) {
  if (!isWechatPayEnabled()) return null;
  return request({
    url: `${getApiBaseUrl()}/api/orders/${encodeURIComponent(orderId)}`,
    method: 'GET'
  });
}

async function startWechatPayment(payload) {
  if (!isWechatPayEnabled()) {
    return { mode: 'demo' };
  }

  const payment = await request({
    url: `${getApiBaseUrl()}/api/payments/wechat/miniapp/create`,
    method: 'POST',
    data: payload
  });
  await requestPayment(payment);

  let order = null;
  try {
    order = await getWechatOrder(payment.orderId);
  } catch (error) {
    order = null;
  }

  return {
    mode: 'wechat',
    orderId: payment.orderId,
    order
  };
}

module.exports = {
  getWechatOrder,
  isWechatPayEnabled,
  startWechatPayment
};
