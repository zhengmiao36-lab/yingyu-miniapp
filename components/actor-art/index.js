Component({
  properties: {
    name: { type: String, value: '' },
    role: { type: String, value: '' },
    theme: { type: String, value: 'wine' },
    size: { type: String, value: 'card' }
  },
  data: {
    initial: ''
  },
  observers: {
    name(value) {
      this.setData({ initial: value ? value.slice(0, 1) : '影' });
    }
  }
});
