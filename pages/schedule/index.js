const { pastDays, scheduleDays } = require('../../utils/mock-data');
const { playPageEnter, playContentEnter } = require('../../utils/motion');

Page({
  data: {
    pageMotionClass: '',
    weekMotionClass: '',
    weekLabel: '7.27 - 8.2',
    weekOffset: 0,
    showPast: false,
    scheduleDays,
    pastDays
  },

  onShow() {
    playPageEnter(this);
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
    }, () => {
      playContentEnter(this, 'weekMotionClass');
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
    wx.navigateTo({
      url: `/pages/checkout/index?type=ticket&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`
    });
  }
});
