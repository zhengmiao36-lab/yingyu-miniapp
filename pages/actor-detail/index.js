const { actors } = require('../../utils/mock-data');
const { playPageEnter } = require('../../utils/motion');

Page({
  data: {
    pageMotionClass: '',
    actor: null
  },

  onShow() {
    playPageEnter(this);
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
    wx.navigateTo({
      url: `/pages/checkout/index?type=ticket&actorId=${this.data.actor.id}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`
    });
  }
});
