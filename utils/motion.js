function playMotion(page, dataKey, className) {
  page.setData({ [dataKey]: '' }, () => {
    wx.nextTick(() => {
      page.setData({ [dataKey]: className });
    });
  });
}

function playPageEnter(page) {
  playMotion(page, 'pageMotionClass', 'page-shell--entering');
}

function playContentEnter(page, dataKey = 'contentMotionClass') {
  playMotion(page, dataKey, 'content-motion--enter');
}

module.exports = {
  playPageEnter,
  playContentEnter
};
