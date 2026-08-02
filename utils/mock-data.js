const actors = [
  {
    id: 'shen-yan',
    name: '沈砚',
    role: '巡夜司',
    theme: 'wine',
    points: 537200,
    bio: '冷静克制的巡夜司首领，在长安的暮色中追索一封失落密函。',
    schedules: [
      { label: '午场', date: '8月2日', time: '14:00', status: '余 6 张' },
      { label: '晚场', date: '8月4日', time: '19:30', status: '已售罄' }
    ]
  },
  {
    id: 'lu-chen',
    name: '陆沉',
    role: '听风客',
    theme: 'blue',
    points: 438160,
    bio: '善听弦外之音的旅人，似乎比任何人都更接近谜底。',
    schedules: [
      { label: '晚场', date: '8月2日', time: '19:30', status: '余 12 张' },
      { label: '午场', date: '8月5日', time: '14:00', status: '售票中' }
    ]
  },
  {
    id: 'su-tang',
    name: '苏棠',
    role: '司灯人',
    theme: 'amber',
    points: 425000,
    bio: '掌灯入梦，以一盏旧灯引观众穿过层层叙事。',
    schedules: [
      { label: '午场', date: '8月3日', time: '14:00', status: '售票中' },
      { label: '晚场', date: '8月6日', time: '19:30', status: '余 9 张' }
    ]
  },
  {
    id: 'pei-xing',
    name: '裴星',
    role: '绣衣使',
    theme: 'jade',
    points: 422000,
    bio: '绣衣之下藏着另一重身份，选择会改变她的去向。',
    schedules: [
      { label: '晚场', date: '8月3日', time: '19:30', status: '余 4 张' }
    ]
  },
  {
    id: 'gu-zhao',
    name: '顾昭',
    role: '少司命',
    theme: 'silver',
    points: 371800,
    bio: '以星象解读来路的少司命，每场都有不同的命运签。',
    schedules: [
      { label: '午场', date: '8月4日', time: '14:00', status: '已售罄' },
      { label: '晚场', date: '8月8日', time: '19:30', status: '售票中' }
    ]
  },
  {
    id: 'lin-ye',
    name: '林野',
    role: '执戟郎',
    theme: 'ember',
    points: 356400,
    bio: '守在城门与旧案之间的执戟郎，沉默但绝不退让。',
    schedules: [
      { label: '晚场', date: '8月5日', time: '19:30', status: '售票中' }
    ]
  },
  {
    id: 'jiang-yu',
    name: '江屿',
    role: '掌书记',
    theme: 'slate',
    points: 318600,
    bio: '记录每一位来客的决定，也悄悄改写故事的次序。',
    schedules: [
      { label: '午场', date: '8月6日', time: '14:00', status: '余 8 张' }
    ]
  },
  {
    id: 'wen-yu',
    name: '闻雨',
    role: '伶人',
    theme: 'violet',
    points: 294200,
    bio: '台上唱旧曲，台下寻故人，她的支线需要耐心发现。',
    schedules: [
      { label: '晚场', date: '8月6日', time: '19:30', status: '余 5 张' }
    ]
  },
  {
    id: 'qin-wu',
    name: '秦雾',
    role: '渡梦师',
    theme: 'teal',
    points: 276900,
    bio: '为来客守住梦境边界的引路人，只回答真正的问题。',
    schedules: [
      { label: '午场', date: '8月8日', time: '14:00', status: '售票中' }
    ]
  }
];

const castGroups = [
  { role: '巡夜司', actor: '沈砚', tone: 'wine' },
  { role: '听风客', actor: '陆沉', tone: 'wine' },
  { role: '司灯人', actor: '苏棠', tone: 'wine' },
  { role: '绣衣使', actor: '裴星', tone: 'blue' },
  { role: '少司命', actor: '顾昭', tone: 'blue' },
  { role: '执戟郎', actor: '林野', tone: 'blue' },
  { role: '掌书记', actor: '江屿', tone: 'slate' },
  { role: '伶人', actor: '闻雨', tone: 'slate' },
  { role: '渡梦师', actor: '秦雾', tone: 'slate' }
];

const scheduleDays = [
  {
    date: '8.2',
    weekday: '周日',
    sessions: [
      { time: '14:00-17:30', status: '售票中', left: 12, cast: castGroups },
      { time: '19:30-23:00', status: '售票中', left: 8, cast: castGroups.slice().reverse() }
    ]
  },
  {
    date: '8.3',
    weekday: '周一',
    sessions: [
      { time: '19:30-23:00', status: '售票中', left: 5, cast: castGroups }
    ]
  }
];

const pastDays = [
  { date: '7.31', weekday: '周五', sessions: [{ time: '19:30-23:00', status: '已结束', left: 0, cast: castGroups }] },
  { date: '8.1', weekday: '周六', sessions: [{ time: '19:30-23:00', status: '已结束', left: 0, cast: castGroups.slice().reverse() }] }
];

const memberRanking = [
  { name: '观众 081', subtitle: '会员消费积分', points: 240000, theme: 'violet' },
  { name: '云栖', subtitle: '会员消费积分', points: 112550, theme: 'silver' },
  { name: 'E', subtitle: '会员消费积分', points: 102000, theme: 'ember' },
  { name: '甜', subtitle: '会员消费积分', points: 100050, theme: 'wine' },
  { name: '长街', subtitle: '会员消费积分', points: 100000, theme: 'amber' }
];

const products = [
  { id: 'flower', name: '小红花', label: '自动核销', points: 80, memberPoints: 50, price: 1 },
  { id: 'solo', name: '单人拍立得', label: '客服核销', points: 2000, memberPoints: 2000, price: 85 },
  { id: 'candle', name: '萤光烛', label: '自动核销', points: 300, memberPoints: 900, price: 10 },
  { id: 'bouquet', name: '花束', label: '客服核销', points: 5000, memberPoints: 20000, price: 298 }
];

module.exports = {
  actors,
  memberRanking,
  pastDays,
  products,
  scheduleDays
};
