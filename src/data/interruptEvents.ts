// src/data/interruptEvents.ts
import { Stats } from "../types/game";

export interface InterruptEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** 该事件在哪些活动类型中可能触发 */
  activityTypes: string[];
  choices: {
    text: string;
    effects: { stat: keyof Stats; delta: number }[];
    feedback: string;
  }[];
}

export const INTERRUPT_EVENTS: InterruptEvent[] = [
  // ===== 学习类突发事件 =====
  {
    id: "int_professor_ask",
    title: "教授突然提问",
    icon: "🎓",
    description: "上课时教授突然点名让你回答问题！",
    activityTypes: ["study"],
    choices: [
      { text: "自信回答", effects: [{ stat: "academics", delta: 3 }, { stat: "charisma", delta: 2 }], feedback: "回答完美，教授满意地点头！" },
      { text: "假装在思考", effects: [{ stat: "stress", delta: -3 }], feedback: "还好混过去了..." },
      { text: "老实说不知道", effects: [{ stat: "charisma", delta: -2 }, { stat: "stress", delta: -5 }], feedback: "诚实是一种美德，虽然有点尴尬" },
    ],
  },
  {
    id: "int_library_book",
    title: "捡到一本笔记",
    icon: "📓",
    description: "在图书馆发现一本被人遗忘的学霸笔记！",
    activityTypes: ["study"],
    choices: [
      { text: "仔细研读", effects: [{ stat: "academics", delta: 5 }], feedback: "笔记内容精妙，收获颇丰！" },
      { text: "交到失物招领处", effects: [{ stat: "connections", delta: 2 }, { stat: "stress", delta: -3 }], feedback: "失主后来专程来感谢你！" },
    ],
  },
  // ===== 社交类突发事件 =====
  {
    id: "int_gossip",
    title: "小道消息",
    icon: "🗣️",
    description: "听到有人在议论学生会的是非...",
    activityTypes: ["social"],
    choices: [
      { text: "加入讨论", effects: [{ stat: "connections", delta: 3 }, { stat: "stress", delta: 5 }], feedback: "和大家打成一片，但好像说了不该说的..." },
      { text: "默默走开", effects: [{ stat: "stress", delta: -3 }], feedback: "远离是非，心安理得" },
      { text: "转移话题", effects: [{ stat: "charisma", delta: 3 }, { stat: "organization", delta: 1 }], feedback: "巧妙地化解了尴尬气氛！" },
    ],
  },
  {
    id: "int_surprise_party",
    title: "惊喜派对",
    icon: "🎉",
    description: "朋友们突然为你准备了一个小惊喜！",
    activityTypes: ["social"],
    choices: [
      { text: "尽情享受", effects: [{ stat: "connections", delta: 5 }, { stat: "stress", delta: -8 }], feedback: "太感动了！和大家的关系更近了！" },
      { text: "害羞但开心", effects: [{ stat: "charisma", delta: 2 }, { stat: "connections", delta: 3 }], feedback: "虽然有点不好意思，但心里暖暖的" },
    ],
  },
  // ===== 工作类突发事件 =====
  {
    id: "int_deadline",
    title: "紧急任务",
    icon: "🚨",
    description: "部长突然布置了一个紧急任务，明天就要交！",
    activityTypes: ["work"],
    choices: [
      { text: "熬夜完成", effects: [{ stat: "organization", delta: 5 }, { stat: "stress", delta: 10 }], feedback: "虽然很累，但完美交差！" },
      { text: "找同学帮忙", effects: [{ stat: "connections", delta: 3 }, { stat: "organization", delta: 2 }], feedback: "团队合作效率高！" },
      { text: "申请延期", effects: [{ stat: "organization", delta: -3 }, { stat: "stress", delta: -5 }], feedback: "部长同意了，但印象分减了点" },
    ],
  },
  {
    id: "int_funding",
    title: "意外经费",
    icon: "💰",
    description: "学校临时拨了一笔活动经费！",
    activityTypes: ["work"],
    choices: [
      { text: "申请用于自己部门", effects: [{ stat: "budget", delta: 8 }], feedback: "经费到手，可以大展拳脚了！" },
      { text: "建议平分给各部门", effects: [{ stat: "connections", delta: 5 }, { stat: "budget", delta: 3 }], feedback: "大家都记着你的好！" },
    ],
  },
  // ===== 志愿类突发事件 =====
  {
    id: "int_grateful",
    title: "感谢信",
    icon: "💌",
    description: "收到上次志愿活动对象的感谢信！",
    activityTypes: ["volunteer"],
    choices: [
      { text: "珍藏起来", effects: [{ stat: "stress", delta: -10 }, { stat: "charisma", delta: 2 }], feedback: "看到自己的付出被认可，心里暖暖的" },
      { text: "分享到朋友圈", effects: [{ stat: "connections", delta: 3 }, { stat: "charisma", delta: 3 }], feedback: "大家纷纷点赞，志愿精神传播开来！" },
    ],
  },
  // ===== 通用突发事件 =====
  {
    id: "int_rain",
    title: "突然下雨",
    icon: "🌧️",
    description: "天空突然下起大雨，你忘带伞了...",
    activityTypes: ["study", "social", "work", "volunteer"],
    choices: [
      { text: "冲过去！", effects: [{ stat: "stress", delta: 5 }], feedback: "全身湿透，有点狼狈..." },
      { text: "找个地方避雨", effects: [{ stat: "stress", delta: -3 }], feedback: "顺便买杯热饮，还挺惬意" },
      { text: "找人借伞", effects: [{ stat: "connections", delta: 2 }], feedback: "邂逅了一个好心人！" },
    ],
  },
  {
    id: "int_free_food",
    title: "免费零食",
    icon: "🍪",
    description: "学生会活动剩下的零食免费发放！",
    activityTypes: ["study", "social", "work", "volunteer"],
    choices: [
      { text: "拿一些吃", effects: [{ stat: "stress", delta: -5 }], feedback: "免费的总是最好吃的！" },
      { text: "多拿点分给朋友", effects: [{ stat: "connections", delta: 3 }, { stat: "stress", delta: -3 }], feedback: "分享快乐！" },
    ],
  },
  {
    id: "int_meeting",
    title: "偶遇熟人",
    icon: "👋",
    description: "路上偶遇了一个好久不见的朋友！",
    activityTypes: ["study", "social", "work"],
    choices: [
      { text: "热情打招呼", effects: [{ stat: "connections", delta: 3 }, { stat: "charisma", delta: 2 }], feedback: "聊得很开心！" },
      { text: "简单寒暄", effects: [{ stat: "connections", delta: 1 }, { stat: "stress", delta: -2 }], feedback: "礼貌而不失温度" },
    ],
  },
  // ===== 学习类新增 =====
  {
    id: "int_sleepy",
    title: "困意来袭",
    icon: "😴",
    description: "看书看到一半，眼皮开始打架...",
    activityTypes: ["study"],
    choices: [
      { text: "趴着睡15分钟", effects: [{ stat: "stress", delta: -5 }, { stat: "academics", delta: -2 }], feedback: "小憩之后精神好多了，但进度落下了" },
      { text: "喝杯咖啡硬撑", effects: [{ stat: "academics", delta: 2 }, { stat: "stress", delta: 3 }], feedback: "咖啡因让你撑了过去，但效率打了折扣" },
      { text: "起来活动一下，换科目学", effects: [{ stat: "academics", delta: 3 }, { stat: "stress", delta: -2 }], feedback: "换了科目后新鲜感上来了，效率反而更高！" },
    ],
  },
  {
    id: "int_study_group_invite",
    title: "学习小组邀请",
    icon: "👥",
    description: "同学邀请你加入临时学习小组，一起复习备考。",
    activityTypes: ["study"],
    choices: [
      { text: "加入，分享笔记互相提问", effects: [{ stat: "academics", delta: 4 }, { stat: "connections", delta: 2 }], feedback: "小组讨论让你理解了之前没搞懂的知识点！" },
      { text: "婉拒，按自己的节奏来", effects: [{ stat: "academics", delta: 2 }, { stat: "stress", delta: -3 }], feedback: "独自学习虽然效率稳定，但错过了一些交流的机会" },
    ],
  },
  // ===== 社交类新增 =====
  {
    id: "int_photo_challenge",
    title: "合影挑战",
    icon: "📸",
    description: "有人在朋友圈发起了一个校园合影挑战，@了你！",
    activityTypes: ["social"],
    choices: [
      { text: "积极参与，拉上朋友一起拍", effects: [{ stat: "connections", delta: 4 }, { stat: "charisma", delta: 3 }], feedback: "照片收获了超多点赞，大家玩得很开心！" },
      { text: "礼貌性回一张自拍", effects: [{ stat: "charisma", delta: 2 }, { stat: "stress", delta: -2 }], feedback: "没有太拼，但也算参与了这场社交狂欢" },
    ],
  },
  {
    id: "int_secret_admirer",
    title: "神秘纸条",
    icon: "💌",
    description: "在社团活动室的桌上发现一张匿名纸条，上面写着：'你很特别'...",
    activityTypes: ["social"],
    choices: [
      { text: "四处打听是谁写的", effects: [{ stat: "connections", delta: 3 }, { stat: "stress", delta: 3 }], feedback: "虽然没有找到纸条的主人，但过程中和很多人聊了天" },
      { text: "收好纸条，不去追问", effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -3 }], feedback: "有些秘密留着反而更美好。你心情莫名地好了一整天" },
    ],
  },
  // ===== 工作类新增 =====
  {
    id: "int_volunteer_help",
    title: "热心帮手",
    icon: "🦸",
    description: "一个学弟主动跑来问你需要不需要帮忙！",
    activityTypes: ["work"],
    choices: [
      { text: "分配任务给他，趁机教他一些东西", effects: [{ stat: "organization", delta: 3 }, { stat: "connections", delta: 4 }], feedback: "学弟干得很认真，你也收获了当'师父'的成就感" },
      { text: "感谢他的好意，但自己来更快", effects: [{ stat: "organization", delta: 2 }, { stat: "stress", delta: 3 }], feedback: "虽然一个人搞定了，但学弟看起来有点失落..." },
    ],
  },
  {
    id: "int_idea_spark",
    title: "灵感闪现",
    icon: "💡",
    description: "正在做方案的时候突然想到了一个绝妙的创意！",
    activityTypes: ["work"],
    choices: [
      { text: "立刻记下来并展开细化", effects: [{ stat: "organization", delta: 5 }, { stat: "charisma", delta: 2 }], feedback: "这个创意让方案上升了一个档次！" },
      { text: "先完成手头的工作再说", effects: [{ stat: "organization", delta: 3 }, { stat: "stress", delta: 3 }], feedback: "等忙完再回想的时候...那个灵感已经模糊了。可惜！" },
    ],
  },
  // ===== 志愿类新增 =====
  {
    id: "int_unexpected_friend",
    title: "意外友谊",
    icon: "🤗",
    description: "志愿服务中遇到了一个特别投缘的同伴！",
    activityTypes: ["volunteer"],
    choices: [
      { text: "主动加微信，约下次一起做志愿", effects: [{ stat: "connections", delta: 5 }, { stat: "charisma", delta: 2 }], feedback: "你们聊了一整天，发现彼此有很多共同点。新朋友get！" },
      { text: "享受当下的相处，随缘就好", effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -3 }], feedback: "虽然没有交换联系方式，但今天的回忆很美好" },
    ],
  },
  // ===== 稀有突发事件 =====
  {
    id: "int_celebrity",
    title: "名人来访",
    icon: "🌟",
    description: "一位知名校友回校演讲，刚好经过你所在的地方！",
    activityTypes: ["study", "social", "work"],
    choices: [
      { text: "上前自我介绍并请教问题", effects: [{ stat: "charisma", delta: 5 }, { stat: "connections", delta: 5 }, { stat: "stress", delta: 3 }], feedback: "校友对你印象深刻，还留了名片！虽然有点紧张但收获巨大" },
      { text: "远远拍张照，不打扰", effects: [{ stat: "stress", delta: -3 }, { stat: "charisma", delta: 1 }], feedback: "你默默发了个朋友圈，配文：今天看到大佬了" },
    ],
  },
  {
    id: "int_lucky_draw",
    title: "幸运抽奖",
    icon: "🎰",
    description: "学校活动抽奖环节，你手里的号码被抽中了！",
    activityTypes: ["study", "social", "work", "volunteer"],
    choices: [
      { text: "选现金红包", effects: [{ stat: "allowance", delta: 80 }], feedback: "200块到手！虽然不多但也是一笔意外之财" },
      { text: "选实物奖品（限量文创）", effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -5 }], feedback: "你拿到的文创礼盒让周围同学羡慕不已" },
    ],
  },
];

/** 根据活动类型随机抽取突发事件 */
export function pickInterruptEvent(activityType: string): InterruptEvent | null {
  const pool = INTERRUPT_EVENTS.filter((e) => e.activityTypes.includes(activityType));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
