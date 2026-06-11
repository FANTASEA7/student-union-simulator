// 招干事数据：候选人 + 面试问题

import type { RecruitApplicant, RecruitQuality } from "../types/game";

// ═══ 固定候选人 ═══
export const FIXED_APPLICANTS: RecruitApplicant[] = [
  {
    id: "liu_haibao",
    name: "刘海豹",
    gender: "female",
    quality: "legendary",
    energy: 150,
    major: "人力资源管理",
    hometown: "河北石家庄",
    hobby: "模拟面试",
    specialty: "人才测评 / 团队建设",
    motto: "慧眼识人，用心成事",
    questionsAsked: 0,
    tip: "传奇品质 · 精力150\n入职加成：组织力+8 | 人脉+6\n特质：慧眼识人，录用后可额外获得一次面试机会",
  },
  {
    id: "zhou_feiyu",
    name: "粥飞鱼",
    gender: "female",
    quality: "epic",
    energy: 100,
    major: "电子商务",
    hometown: "湖北荆州",
    hobby: "直播带货",
    specialty: "电商运营 / 数据分析",
    motto: "每一件商品都有一个故事",
    questionsAsked: 0,
    tip: "史诗品质 · 精力100\n入职加成：预算+20 | 魅力值+3\n特质：南苑超市购物永久9折",
  },
  {
    id: "chang_ruihui",
    name: "肠锐悔",
    gender: "male",
    quality: "epic",
    energy: 100,
    major: "物流管理",
    hometown: "山东临沂",
    hobby: "辩论",
    specialty: "PPT制作 / 活动策划",
    motto: "为了深耕物流管理，就是送快递我也愿意",
    questionsAsked: 0,
    tip: "史诗品质 · 精力100\n入职加成：组织力+5 | 人脉+4\n特质：活动策划时精力消耗减半",
  },
];

// ═══ 随机候选人名字池 ═══
const SURNAMES = ["李", "王", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴", "徐", "孙", "马", "朱", "胡", "林", "何", "高", "罗", "郑"];
const GIVEN_NAMES_MALE = ["明", "伟", "强", "磊", "涛", "浩", "鹏", "杰", "飞", "宇", "轩", "然", "博", "文", "睿", "晨", "阳", "宁", "逸", "恒"];
const GIVEN_NAMES_FEMALE = ["婷", "静", "敏", "雪", "芳", "琳", "瑶", "颖", "妍", "珊", "怡", "萱", "琪", "慧", "雯", "娟", "萍", "莉", "洁", "思"];

const MAJORS = [
  "金融学", "会计学", "市场营销", "人力资源管理",
  "英语语言文学", "法学", "社会学", "心理学",
  "电子信息工程", "机械工程", "土木工程", "环境科学",
  "数学与应用数学", "物理学", "化学", "生物技术",
  "视觉传达设计", "音乐学", "体育教育", "历史学",
];

const HOMETOWNS = [
  "北京", "上海", "广州", "成都", "武汉", "南京", "西安", "重庆",
  "长沙", "青岛", "大连", "厦门", "苏州", "郑州", "哈尔滨", "昆明",
];

const HOBBIES = [
  "篮球", "羽毛球", "跑步", "游泳", "阅读", "写作",
  "摄影", "绘画", "吉他", "钢琴", "编程", "骑行",
  "动漫", "电影", "旅行", "烘焙", "园艺", "书法",
  "桌游", "电竞",
];

const SPECIALTIES = [
  "文案撰写", "视频剪辑", "活动主持", "海报设计",
  "数据分析", "外联沟通", "物资统筹", "现场执行",
  "公众号运营", "摄影后期",
];

const MOTTOS = [
  "脚踏实地，仰望星空", "行动胜于空谈", "每天进步一点点",
  "做最好的自己", "不负青春，不负韶华", "努力是唯一的捷径",
  "心有猛虎，细嗅蔷薇", "天道酬勤", "知行合一",
  "让优秀成为一种习惯", "心之所向，素履以往", "厚积薄发",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomName(gender: "male" | "female"): string {
  const surname = pickRandom(SURNAMES);
  const pool = gender === "male" ? GIVEN_NAMES_MALE : GIVEN_NAMES_FEMALE;
  const given = pickRandom(pool);
  // 50% chance of 2-character given name
  if (Math.random() < 0.5) {
    const given2 = pickRandom(pool);
    return surname + given + given2;
  }
  return surname + given;
}

/** 生成随机候选人 */
function generateRandomApplicant(index: number): RecruitApplicant {
  const qualities: RecruitQuality[] = ["common", "common", "common", "rare", "rare"];
  const quality = pickRandom(qualities);
  const gender = Math.random() < 0.5 ? "male" : "female";
  const baseEnergy = quality === "rare" ? 70 + Math.floor(Math.random() * 20) : 40 + Math.floor(Math.random() * 40);
  const qualityLabel = quality === "rare" ? "稀有品质" : "普通品质";
  const energyTips = energy >= 80 ? "精力充沛，能承担较多工作任务" : energy >= 60 ? "精力尚可，合理分配能胜任日常工作" : "精力偏低，适合轻量级辅助工作";
  return {
    id: `random_recruit_${index}`,
    name: generateRandomName(gender),
    gender,
    quality,
    energy: Math.min(90, baseEnergy),
    major: pickRandom(MAJORS),
    hometown: pickRandom(HOMETOWNS),
    hobby: pickRandom(HOBBIES),
    specialty: pickRandom(SPECIALTIES),
    motto: pickRandom(MOTTOS),
    questionsAsked: 0,
    tip: `${qualityLabel} · 精力${energy}\n入职加成：${quality === "rare" ? "随机两项属性+2" : "随机一项属性+1"}\n特质：${energyTips}`,
  };
}

/** 生成全部10位候选人: 3固定 + 7随机 */
export function generateAllApplicants(): RecruitApplicant[] {
  const randoms: RecruitApplicant[] = [];
  for (let i = 0; i < 7; i++) {
    randoms.push(generateRandomApplicant(i));
  }
  // 洗牌：固定候选人混在随机候选人中
  const all = [...FIXED_APPLICANTS, ...randoms];
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

// ═══ 面试问题池 ═══
export interface RecruitQuestion {
  id: string;
  text: string;
  category: string; // "压力测试" | "情景模拟" | "自我认知" | "动机考察"
}

export const RECRUIT_QUESTIONS: RecruitQuestion[] = [
  { id: "q1", text: "如果学生会活动和你的课业冲突了，你会怎么处理？", category: "情景模拟" },
  { id: "q2", text: "你觉得学生会最吸引你的是什么？", category: "动机考察" },
  { id: "q3", text: "假如部长交给你一项任务，但你不太认同他的做法，你会怎么办？", category: "情景模拟" },
  { id: "q4", text: "你觉得自己最大的优点和缺点分别是什么？", category: "自我认知" },
  { id: "q5", text: "如果你和部门里的其他干事发生矛盾，你会怎么解决？", category: "情景模拟" },
  { id: "q6", text: "描述一次你带领团队完成任务的经历。", category: "自我认知" },
  { id: "q7", text: "你对学生会的未来发展有什么想法或建议？", category: "动机考察" },
  { id: "q8", text: "如果需要在三天内完成一个大型活动的策划，你的第一步会做什么？", category: "压力测试" },
  { id: "q9", text: "用一个词形容你自己，并解释为什么。", category: "自我认知" },
  { id: "q10", text: "如果你没有被录用，你觉得可能是什么原因？", category: "压力测试" },
  { id: "q11", text: "你认为一个好的学生会干事需要具备哪些品质？", category: "动机考察" },
  { id: "q12", text: "假设活动当天突然下雨，户外活动无法进行，你作为负责人会怎么做？", category: "压力测试" },
];

/** 随机抽取 n 个不重复的问题 */
export function pickQuestions(n: number): RecruitQuestion[] {
  const pool = [...RECRUIT_QUESTIONS];
  const result: RecruitQuestion[] = [];
  for (let i = 0; i < n && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}
