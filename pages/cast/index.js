const { actors } = require('../../utils/mock-data');
const { playPageEnter } = require('../../utils/motion');

Page({
  data: {
    pageMotionClass: '',
    actors
  },

  onShow() {
    playPageEnter(this);
  },

  openActor(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/actor-detail/index?id=${id}` });
  }
});
