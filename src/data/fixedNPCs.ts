// src/data/fixedNPCs.ts
import { LoveNPC, Department, NPCPersonality } from "../types/game";

// ===== 4个固定特殊NPC =====

/** 买单哥 — 大一生活部，时不时爆金币 */
export const MAIDAN: LoveNPC = {
  id: "maidan_ge",
  name: "买单哥",
  gender: "male",
  personality: "mischievous",
  appearance: "短发利落，运动休闲，蹦蹦跳跳",
  department: "sports",
  year: 1,
  hobby: "请客吃饭",
  affinity: 0,
  met: false,
  canRomance: false,
  avatar: "characters/maidan.png",
  status: "stranger",
  dialogues: {
    firstMeet: "哟！新来的？我叫买单哥，以后吃饭找我，哥请客！",
    friend: "今天又赢了点零花钱，走，食堂随便点！别跟哥客气～",
    close: "说实话，钱不钱的都是小事。能交到你这个朋友，值了。",
    confess: "其实...我请你那么多次，不是因为钱多。是因为想和你多待一会儿。",
    accept: "哈哈！那以后我的钱包就是你的钱包！",
    reject: "没事没事，饭还是照请的！朋友嘛。",
  },
};

/** 香芋 — 大二男，极其不靠谱 */
export const XIANGYU: LoveNPC = {
  id: "xiangyu",
  name: "香芋",
  gender: "male",
  personality: "sunny",
  appearance: "刘海遮眉，工装风，说话带笑",
  department: "other",
  year: 2,
  hobby: "吹牛",
  affinity: 0,
  met: false,
  canRomance: false,
  avatar: "characters/xiangyu.png",
  status: "stranger",
  dialogues: {
    firstMeet: "嘿！我叫香芋！跟你说，这学校没有我搞不定的事——呃，大部分吧。",
    friend: "上次跟你说那事？快了快了马上就好！...好吧其实还没开始。",
    close: "其实我知道自己不太靠谱...但你每次都还愿意信我，谢谢啊。",
    confess: "那个...桃子学姐她...你觉得我有戏吗？唉，我自己都觉得悬。",
    accept: "...（香芋的剧情中不会被表白）",
    reject: "...（香芋的剧情中不会被表白）",
  },
};

/** 桃子 — 大二女，香芋的表白对象 */
export const TAOZI: LoveNPC = {
  id: "taozi",
  name: "桃子",
  gender: "female",
  personality: "gentle",
  appearance: "微卷披肩，日系文艺范，安静如水",
  department: "other",
  year: 2,
  hobby: "养花",
  affinity: 0,
  met: false,
  canRomance: false,
  avatar: "characters/taozi.png",
  status: "stranger",
  dialogues: {
    firstMeet: "你好呀，我叫桃子。有什么需要帮忙的可以找我～",
    friend: "最近养的多肉开花了，好开心。你要不要来看看？",
    close: "你是个很温柔的人呢。和你做朋友真的很舒服。",
    confess: "其实我心里一直有一个人...但不是香芋。对不起。",
    accept: "真的吗？我其实也喜欢你很久了...",
    reject: "抱歉...我们还是做好朋友吧。你值得更好的人。",
  },
};

/** 苏念 — 大二女，心理部，樱花树下的邂逅 */
export const SUNIAN: LoveNPC = {
  id: "sunian",
  name: "苏念",
  gender: "female",
  personality: "gentle",
  appearance: "栗色短发，日系文艺范，眼神温柔",
  department: "psychology",
  year: 2,
  hobby: "摄影",
  affinity: 0,
  met: false,
  canRomance: true,
  avatar: "characters/sunian.png",
  status: "stranger",
  dialogues: {
    firstMeet: "啊，你好...我是苏念，心理部的。刚才不小心看入神了，没注意到你。",
    friend: "和你聊天总是很舒服呢。要不要一起去拍照？我知道学校里几个很美的地方。",
    close: "有些话藏了很久...你对我来说，已经不只是普通朋友了。",
    confess: "其实我一直在等你说这句话。从樱花树下的那天起，我就注意到了你。",
    accept: "嗯！以后请多指教啦~",
    reject: "这样啊...那这些照片，就当是美好的回忆吧。",
  },
};

/** 张艺 — 大三男，阴险狡诈，关系越好越危险 */
export const ZHANGYI: LoveNPC = {
  id: "zhangyi",
  name: "张艺",
  gender: "male",
  personality: "gentle",
  appearance: "马尾辫，韩系穿搭，高冷气场",
  department: "other",
  year: 3,
  hobby: "权力博弈",
  affinity: 0,
  met: false,
  canRomance: false,
  avatar: "characters/zhangyi.png",
  status: "stranger",
  dialogues: {
    firstMeet: "呵呵，新人？很好。记住，在这个地方，站对位置比能力重要一万倍。",
    friend: "你最近表现不错。不过有没有想过...为什么有些人在学生会爬得那么快？（意味深长地笑）",
    close: "我越来越欣赏你了。跟我合作，保你平步青云。当然，你得懂事。",
    confess: "别天真了。在这个世界上，感情是最不值钱的东西。权力才是。",
    accept: "......（张艺的剧情中不会被表白）",
    reject: "......（张艺的剧情中不会被表白）",
  },
};

// ===== 随机生成大一女生 =====

const SURNAMES_F = ["林", "苏", "沈", "白", "江", "顾", "叶", "陈", "李", "周"];
const GIVEN_F = ["小雨", "念念", "小艺", "晓月", "若兰", "思雨", "悦然", "佳怡", "欣怡", "梓涵", "雨涵", "梦琪", "诗涵", "雅婷"];
const HAIR_STYLES = ["长发及腰", "栗色短发", "丸子头", "微卷披肩", "齐耳短发", "马尾辫"];
const CLOTHES = ["简约学院风", "日系文艺范", "运动休闲", "复古港风", "韩系穿搭"];
const AURAS = ["笑起来有酒窝", "眼神温柔", "说话带笑", "安静如水", "蹦蹦跳跳"];
const HOBBIES_F = ["摄影", "烘焙", "画画", "阅读", "电影", "旅行", "手账", "追剧", "尤克里里", "跳舞", "写小说", "养猫"];

const ALL_DEPARTMENTS: Department[] = ["life", "office", "sports", "media", "social", "psychology"];
const PERSONALITIES: NPCPersonality[] = ["sunny", "gentle", "shy", "mischievous"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateFemaleFreshman(dept: Department, index: number): LoveNPC {
  const surname = pick(SURNAMES_F);
  const given = pick(GIVEN_F);
  const name = surname + given;
  const personality = pick(PERSONALITIES);
  const appearance = `${pick(HAIR_STYLES)}，${pick(CLOTHES)}，${pick(AURAS)}`;
  const hobby = pick(HOBBIES_F);

  const firstMeets: Record<NPCPersonality, string> = {
    sunny: `嗨！我是${name}～以后一起加油吧！`,
    gentle: `你好呀，我是${name}。很高兴认识你～`,
    shy: `那个...我叫${name}。请、请多关照...`,
    mischievous: `嘿！${name}参上！以后多多关照啦～`,
    tsundere: `哼，${name}。别拖我后腿。`, // won't be used but included for type safety
  };

  return {
    id: `freshman_${index}`,
    name,
    gender: "female",
    personality,
    appearance,
    department: dept,
    year: 1,
    hobby,
    affinity: 0,
    met: false,
    canRomance: true,
    status: "stranger",
    dialogues: {
      firstMeet: firstMeets[personality],
      friend: getRandomFriendLine(personality),
      close: getRandomCloseLine(personality),
      confess: getRandomConfessLine(personality),
      accept: getRandomAcceptLine(personality),
      reject: getRandomRejectLine(personality),
    },
  };
}

function getRandomFriendLine(p: NPCPersonality): string {
  const lines: Record<NPCPersonality, string[]> = {
    sunny: ["最近怎么样？我发现一家超棒的店！", "今天天气真好，要不要一起出去走走？"],
    gentle: ["最近还好吗？要注意休息哦。", "我今天做了些小点心，要不要尝尝？"],
    shy: ["那个...我给你发了条消息...没别的意思！", "今、今天能见到你很开心..."],
    mischievous: ["嘿，我又发现了一个好玩的事！", "猜猜我今天干了什么？"],
    tsundere: [""],
  };
  return pick(lines[p]);
}

function getRandomCloseLine(p: NPCPersonality): string {
  const lines: Record<NPCPersonality, string[]> = {
    sunny: ["和你在一起的时候最开心了。", "其实我有些话一直想对你说..."],
    gentle: ["你对我而言，已经是很重要的人了。", "每次看到你，心都会跳得快一些。"],
    shy: ["我...我把想说的话都写在日记里了。", "你是为数不多让我觉得安心的人。"],
    mischievous: ["虽然我平时爱开玩笑，但对你是认真的。", "没想到有一天我会这么在意一个人。"],
    tsundere: [""],
  };
  return pick(lines[p]);
}

function getRandomConfessLine(p: NPCPersonality): string {
  const lines: Record<NPCPersonality, string[]> = {
    sunny: ["我喜欢你！从很久以前就开始了！", "忍不住了——我真的很喜欢你！"],
    gentle: ["这份心意藏了很久了...我喜欢你。", "我想和你在一起，不只是朋友。"],
    shy: ["那个...我...我喜欢你！（闭眼大喊）", "我把信塞给你然后跑掉了。"],
    mischievous: ["好吧我认输了——我栽在你手里了。", "这次不是开玩笑！我真的喜欢你！"],
    tsundere: [""],
  };
  return pick(lines[p]);
}

function getRandomAcceptLine(p: NPCPersonality): string {
  const lines: Record<NPCPersonality, string[]> = {
    sunny: ["太好了！！我好开心！！", "嗯！我们在一起吧！"],
    gentle: ["谢谢你选择了我...我会好好珍惜的。", "我也喜欢你很久了..."],
    shy: ["真、真的吗？我不是在做梦吧...", "呜...谢谢你..."],
    mischievous: ["哈哈！终于等到你这句话了！", "这波血赚！"],
    tsundere: [""],
  };
  return pick(lines[p]);
}

function getRandomRejectLine(p: NPCPersonality): string {
  const lines: Record<NPCPersonality, string[]> = {
    sunny: ["啊...没关系！我们还是朋友对吧？", "好吧。我会调整一下的。"],
    gentle: ["这样啊...你的幸福比什么都重要。", "没关系。能遇见你就很好了。"],
    shy: ["嗯...没、没事...（眼眶红了）", "谢谢你温柔地拒绝我..."],
    mischievous: ["哈哈...好吧。至少我试过了！", "好吧好吧，算我输。还是朋友？"],
    tsundere: [""],
  };
  return pick(lines[p]);
}

/** 获取完整NPC列表：4固定 + 5随机大一女生 */
export function getFixedNPCs(): LoveNPC[] {
  // 买单哥占了 文体部，其余5个部门给大一女生
  const deptsForFreshmen: Department[] = ["life", "office", "media", "social", "psychology"];

  const randomFreshmen = deptsForFreshmen.map((dept, i) =>
    generateFemaleFreshman(dept, i)
  );

  return [MAIDAN, XIANGYU, TAOZI, ZHANGYI, SUNIAN, ...randomFreshmen];
}
