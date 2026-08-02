const { actors } = require('../../utils/mock-data');

Page({
  data: {
    actor: null
  },

  onLoad(options) {
    const actor = actors.find((item) => item.id === options.id) || actors[0];
    this.setData({ actor });
    wx.setNavigationBarTitle({ title: `${actor.name} · 演员详情` });
  },

  reserve(event) {
    const { date, time, status } = event.currentTarget.dataset;
    if (status === '已售罄') {
      wx.showToast({ title: '本场已售罄', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '演示预约',
      content: `${date} ${time}\n当前原型未接入正式票务。`,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#8d743d'
    });
  }
});
