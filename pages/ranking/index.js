const { actors, memberRanking } = require('../../utils/mock-data');
const { playPageEnter, playContentEnter } = require('../../utils/motion');

const castRanking = actors.map((actor) => ({
  id: actor.id,
  name: actor.name,
  subtitle: actor.role,
  points: actor.points,
  theme: actor.theme
})).sort((a, b) => b.points - a.points);

Page({
  data: {
    pageMotionClass: '',
    contentMotionClass: '',
    activeTab: 'cast',
    ranking: castRanking,
    period: '第二期榜单',
    periodOffset: 0
  },

  onShow() {
    playPageEnter(this);
  },

  switchTab(event) {
    const activeTab = event.currentTarget.dataset.tab;
    this.setData({
      activeTab,
      ranking: activeTab === 'cast' ? castRanking : memberRanking
    }, () => {
      playContentEnter(this);
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
    this.setData({ periodOffset, period: labels[periodOffset] }, () => {
      playContentEnter(this);
    });
  },

  openActor(event) {
    if (this.data.activeTab !== 'cast') return;
    wx.navigateTo({ url: `/pages/actor-detail/index?id=${event.currentTarget.dataset.id}` });
  },

  openGiftDetail() {
    wx.navigateTo({
      url: '/pages/gift-detail/index?itemId=flower'
    });
  }
});
