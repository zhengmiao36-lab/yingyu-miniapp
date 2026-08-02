const { pastDays, scheduleDays } = require('../../utils/mock-data');

Page({
  data: {
    weekLabel: '7.27 - 8.2',
    weekOffset: 0,
    showPast: false,
    scheduleDays,
    pastDays
  },

  changeWeek(event) {
    const direction = Number(event.currentTarget.dataset.direction);
    const nextOffset = Math.max(-1, Math.min(1, this.data.weekOffset + direction));
    const labels = {
      '-1': '7.20 - 7.26',
      0: '7.27 - 8.2',
      1: '8.3 - 8.9'
    };
    this.setData({
      weekOffset: nextOffset,
      weekLabel: labels[nextOffset]
    });
  },

  togglePast() {
    this.setData({ showPast: !this.data.showPast });
  },

  openCast() {
    wx.switchTab({ url: '/pages/cast/index' });
  },

  buyTicket(event) {
    const { date, time } = event.currentTarget.dataset;
    wx.showModal({
      title: '演示购票',
      content: `${date} ${time}\n当前原型未接入票务和支付系统。`,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#8d743d'
    });
  }
});
