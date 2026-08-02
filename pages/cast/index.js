const { actors } = require('../../utils/mock-data');

Page({
  data: {
    actors
  },

  openActor(event) {
    const { id } = event.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/actor-detail/index?id=${id}` });
  }
});
