const { actors, memberRanking } = require('../../utils/mock-data');

const castRanking = actors.map((actor) => ({
  id: actor.id,
  name: actor.name,
  subtitle: actor.role,
  points: actor.points,
  theme: actor.theme
}));

Page({
  data: {
    activeTab: 'cast',
    ranking: castRanking,
    period: '第二期榜单',
    periodOffset: 0
  },

  switchTab(event) {
    const activeTab = event.currentTarget.dataset.tab;
    this.setData({
      activeTab,
      ranking: activeTab === 'cast' ? castRanking : memberRanking
    });
  },

  changePeriod(event) {
    const direction = Number(event.currentTarget.dataset.direction);
    const periodOffset = Math.max(-1, Math.min(1, this.data.periodOffset + direction));
    const labels = {
      '-1': '第一期榜单',
      0: '第二期榜单',
      1: '第三期榜单'
    };
    this.setData({ periodOffset, period: labels[periodOffset] });
  },

  openActor(event) {
    if (this.data.activeTab !== 'cast') return;
    wx.navigateTo({ url: `/pages/actor-detail/index?id=${event.currentTarget.dataset.id}` });
  },

  openStore() {
    wx.switchTab({ url: '/pages/store/index' });
  }
});
