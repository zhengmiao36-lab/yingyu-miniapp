const primaryCastSchedules = [
  { label: '午场', date: '8月2日', time: '14:00', status: '余 12 张' },
  { label: '晚场', date: '8月3日', time: '19:30', status: '余 5 张' }
];

const alternateCastSchedules = [
  { label: '晚场', date: '8月2日', time: '19:30', status: '余 8 张' },
  { label: '晚场', date: '8月4日', time: '19:30', status: '售票中' }
];

const actors = [
  {
    id: 'shen-yan',
    name: '沈砚',
    role: '巡夜司',
    theme: 'wine',
    points: 537200,
    bio: '冷静克制的巡夜司首领，在长安的暮色中追索一封失落密函。',
    schedules: primaryCastSchedules
  },
  {
    id: 'lu-chen',
    name: '陆沉',
    role: '听风客',
    theme: 'blue',
    points: 438160,
    bio: '善听弦外之音的旅人，似乎比任何人都更接近谜底。',
    schedules: primaryCastSchedules
  },
  {
    id: 'su-tang',
    name: '苏棠',
    role: '司灯人',
    theme: 'amber',
    points: 425000,
    bio: '掌灯入梦，以一盏旧灯引观众穿过层层叙事。',
    schedules: primaryCastSchedules
  },
  {
    id: 'pei-xing',
    name: '裴星',
    role: '绣衣使',
    theme: 'jade',
    points: 422000,
    bio: '绣衣之下藏着另一重身份，选择会改变她的去向。',
    schedules: primaryCastSchedules
  },
  {
    id: 'gu-zhao',
    name: '顾昭',
    role: '少司命',
    theme: 'silver',
    points: 371800,
    bio: '以星象解读来路的少司命，每场都有不同的命运签。',
    schedules: primaryCastSchedules
  },
  {
    id: 'lin-ye',
    name: '林野',
    role: '执戟郎',
    theme: 'ember',
    points: 356400,
    bio: '守在城门与旧案之间的执戟郎，沉默但绝不退让。',
    schedules: primaryCastSchedules
  },
  {
    id: 'jiang-yu',
    name: '江屿',
    role: '掌书记',
    theme: 'slate',
    points: 318600,
    bio: '记录每一位来客的决定，也悄悄改写故事的次序。',
    schedules: primaryCastSchedules
  },
  {
    id: 'wen-yu',
    name: '闻雨',
    role: '伶人',
    theme: 'violet',
    points: 294200,
    bio: '台上唱旧曲，台下寻故人，她的支线需要耐心发现。',
    schedules: primaryCastSchedules
  },
  {
    id: 'qin-wu',
    name: '秦雾',
    role: '渡梦师',
    theme: 'teal',
    points: 276900,
    bio: '为来客守住梦境边界的引路人，只回答真正的问题。',
    schedules: primaryCastSchedules
  },
  {
    id: 'xie-lin',
    name: '谢临',
    role: '巡夜司',
    theme: 'slate',
    points: 268800,
    bio: '沉着敏锐的巡夜司副使，在夜巡中寻找被刻意抹去的线索。',
    schedules: alternateCastSchedules
  },
  {
    id: 'cheng-feng',
    name: '程风',
    role: '听风客',
    theme: 'teal',
    points: 258600,
    bio: '随风而来的听风客，擅长从只言片语中辨出人心的方向。',
    schedules: alternateCastSchedules
  },
  {
    id: 'ning-deng',
    name: '宁灯',
    role: '司灯人',
    theme: 'amber',
    points: 249500,
    bio: '守护旧灯的司灯人，用光影为每位来客照亮不同的选择。',
    schedules: alternateCastSchedules
  },
  {
    id: 'chu-yao',
    name: '楚遥',
    role: '绣衣使',
    theme: 'violet',
    points: 238900,
    bio: '行踪难测的绣衣使，言语之间总藏着另一层用意。',
    schedules: alternateCastSchedules
  },
  {
    id: 'yun-chuan',
    name: '云川',
    role: '少司命',
    theme: 'silver',
    points: 229800,
    bio: '观星推演的少司命，会根据来客的抉择给出不同命签。',
    schedules: alternateCastSchedules
  },
  {
    id: 'zhou-lie',
    name: '周烈',
    role: '执戟郎',
    theme: 'ember',
    points: 218600,
    bio: '坚守城门的执戟郎，对旧案有着不肯言明的执念。',
    schedules: alternateCastSchedules
  },
  {
    id: 'wen-ci',
    name: '温辞',
    role: '掌书记',
    theme: 'jade',
    points: 207500,
    bio: '温和谨慎的掌书记，从每一次选择中记录故事的新分支。',
    schedules: alternateCastSchedules
  },
  {
    id: 'liu-sheng',
    name: '柳笙',
    role: '伶人',
    theme: 'wine',
    points: 196300,
    bio: '以新腔唱旧事的伶人，舞台内外都在等一句回答。',
    schedules: alternateCastSchedules
  },
  {
    id: 'bai-zhi',
    name: '白芷',
    role: '渡梦师',
    theme: 'blue',
    points: 184900,
    bio: '穿行梦境边缘的渡梦师，陪来客辨认记忆与幻象。',
    schedules: alternateCastSchedules
  }
];

function makeCastGroup(actorIds) {
  return actorIds.map((id) => {
    const actor = actors.find((item) => item.id === id);
    return {
      id: actor.id,
      role: actor.role,
      actor: actor.name,
      tone: actor.theme
    };
  });
}

const primaryCastGroup = makeCastGroup([
  'shen-yan',
  'lu-chen',
  'su-tang',
  'pei-xing',
  'gu-zhao',
  'lin-ye',
  'jiang-yu',
  'wen-yu',
  'qin-wu'
]);

const alternateCastGroup = makeCastGroup([
  'xie-lin',
  'cheng-feng',
  'ning-deng',
  'chu-yao',
  'yun-chuan',
  'zhou-lie',
  'wen-ci',
  'liu-sheng',
  'bai-zhi'
]);

const scheduleDays = [
  {
    date: '8.2',
    weekday: '周日',
    sessions: [
      { time: '14:00-17:30', status: '售票中', left: 12, cast: primaryCastGroup },
      { time: '19:30-23:00', status: '售票中', left: 8, cast: alternateCastGroup }
    ]
  },
  {
    date: '8.3',
    weekday: '周一',
    sessions: [
      { time: '19:30-23:00', status: '售票中', left: 5, cast: primaryCastGroup }
    ]
  }
];

const pastDays = [
  { date: '7.31', weekday: '周五', sessions: [{ time: '19:30-23:00', status: '已结束', left: 0, cast: primaryCastGroup }] },
  { date: '8.1', weekday: '周六', sessions: [{ time: '19:30-23:00', status: '已结束', left: 0, cast: alternateCastGroup }] }
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

const ticketPrice = 299;

module.exports = {
  actors,
  memberRanking,
  pastDays,
  products,
  scheduleDays,
  ticketPrice
};
