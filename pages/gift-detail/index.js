const { actors, products } = require('../../utils/mock-data');
const { playPageEnter } = require('../../utils/motion');

const roles = [...new Set(actors.map((actor) => actor.role))];

function actorsForRole(role) {
  return actors.filter((actor) => actor.role === role);
}

function money(value) {
  return Number(value).toFixed(Number(value) % 1 === 0 ? 0 : 2);
}

Page({
  data: {
    pageMotionClass: '',
    product: null,
    priceText: '0',
    roles,
    selectedRole: '',
    visibleActors: [],
    selectedActorId: '',
    selectedActorName: '',
    quantity: 1,
    maxQuantity: 9,
    totalAmountText: '0'
  },

  onLoad(options) {
    const product = products.find((item) => item.id === options.itemId) || products.find((item) => item.id === 'flower');

    this.setData({
      product,
      priceText: money(product.price),
      selectedRole: '',
      visibleActors: [],
      selectedActorId: '',
      selectedActorName: ''
    }, () => this.updateTotal());
  },

  onShow() {
    playPageEnter(this);
  },

  selectRole(event) {
    const selectedRole = event.currentTarget.dataset.role;
    const visibleActors = actorsForRole(selectedRole);
    this.setData({
      selectedRole,
      visibleActors,
      selectedActorId: '',
      selectedActorName: ''
    });
  },

  selectActor(event) {
    const selectedActorId = event.currentTarget.dataset.id;
    const selectedActor = this.data.visibleActors.find((actor) => actor.id === selectedActorId);
    if (!selectedActor) return;
    this.setData({
      selectedActorId,
      selectedActorName: selectedActor.name
    });
  },

  changeQuantity(event) {
    const quantity = Math.max(1, Math.min(
      this.data.maxQuantity,
      this.data.quantity + Number(event.currentTarget.dataset.delta)
    ));
    this.setData({ quantity }, () => this.updateTotal());
  },

  updateTotal() {
    this.setData({
      totalAmountText: money(this.data.product.price * this.data.quantity)
    });
  },

  continueCheckout() {
    if (!this.data.selectedActorId) {
      wx.showToast({ title: '请先选择卡司', icon: 'none' });
      return;
    }
    const { product, selectedActorId, quantity } = this.data;
    wx.navigateTo({
      url: `/pages/checkout/index?type=product&itemId=${product.id}&actorId=${selectedActorId}&source=ranking&quantity=${quantity}`
    });
  }
});
