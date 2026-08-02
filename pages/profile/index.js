const avatarThemes = ['wine', 'blue', 'amber', 'jade', 'silver'];

Page({
  data: {
    loggedIn: true,
    nickname: '观演者 021',
    savedNickname: '观演者 021',
    accountId: 'demo-02u9n4e',
    avatarTheme: 'wine',
    cartCount: 0
  },

  onShow() {
    const profile = wx.getStorageSync('demoProfile');
    const storageKeys = wx.getStorageInfoSync().keys || [];
    const hasLoginPreference = storageKeys.includes('demoLoggedIn');
    this.setData({
      cartCount: wx.getStorageSync('demoCartCount') || 0,
      ...(profile || {}),
      loggedIn: hasLoginPreference ? Boolean(wx.getStorageSync('demoLoggedIn')) : true
    });
  },

  updateNickname(event) {
    this.setData({ nickname: event.detail.value });
  },

  saveProfile() {
    const nickname = this.data.nickname.trim();
    if (!nickname) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    }
    const profile = {
      nickname,
      savedNickname: nickname,
      avatarTheme: this.data.avatarTheme,
      loggedIn: this.data.loggedIn
    };
    wx.setStorageSync('demoProfile', profile);
    this.setData(profile);
    wx.showToast({ title: '资料已保存', icon: 'success' });
  },

  changeAvatar() {
    const current = avatarThemes.indexOf(this.data.avatarTheme);
    const avatarTheme = avatarThemes[(current + 1) % avatarThemes.length];
    this.setData({ avatarTheme });
  },

  toggleLogin() {
    if (this.data.loggedIn) {
      wx.setStorageSync('demoLoggedIn', false);
      this.setData({ loggedIn: false });
      return;
    }
    wx.setStorageSync('demoLoggedIn', true);
    this.setData({ loggedIn: true });
    wx.showToast({ title: '已进入体验账号', icon: 'success' });
  },

  openSection(event) {
    const section = event.currentTarget.dataset.section;
    if (section === 'ranking') {
      wx.switchTab({ url: '/pages/ranking/index' });
      return;
    }
    wx.showModal({
      title: section === 'orders' ? '我的订单' : '我的权益',
      content: section === 'orders'
        ? `演示订单 ${this.data.cartCount} 件，正式版需连接订单服务。`
        : '演示权益：优先购票、积分累积、专属活动。',
      showCancel: false,
      confirmColor: '#8d743d'
    });
  }
});
