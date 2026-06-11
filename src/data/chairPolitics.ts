// src/data/chairPolitics.ts
// 学生会政治事件：部长好感度系统
import { ChairPoliticsEvent } from "../types/game";

export const CHAIR_POLITICS_EVENTS: ChairPoliticsEvent[] = [
  // ===== 跨部门冲突 =====
  {
    id: "pol_budget_fight",
    title: "经费争夺战",
    description: "文体部和办公室因为活动经费分配吵起来了！",
    icon: "💰",
    minWeek: 3,
    chairEffects: [
      { chair: "sports", delta: -10 },
      { chair: "office", delta: 10 },
    ],
    statEffects: [
      { stat: "stress", delta: 3 },
      { stat: "organization", delta: 2 },
    ],
    climateEffects: { publicTrust: -3 },
    narrative: "明六六在例会上拍桌子：'文体部的预算申请太离谱了，一个迎新晚会要三千？'小蛋糕不甘示弱：'你办公室连买打印纸都走公账，好意思说我？'烟头叔叔在旁边抽烟看戏，一句话没说。最后你站出来提了一个折中方案——双方各让一步。明六六觉得你懂事，小蛋糕觉得你不够挺她。",
  },
  {
    id: "pol_media_leak",
    title: "新媒体爆料",
    description: "青岛王在公众号上发了一篇暗示学生会财务不透明的推文...",
    icon: "📱",
    minWeek: 5,
    chairEffects: [
      { chair: "media", delta: 5 },
      { chair: "office", delta: -15 },
      { chair: "life", delta: -5 },
    ],
    statEffects: [
      { stat: "connections", delta: 3 },
      { stat: "charisma", delta: 2 },
    ],
    climateEffects: { publicOpinion: 8, publicTrust: -5 },
    narrative: "青岛王那篇推文阅读量一小时内破了两千。明六六脸色铁青地冲进新媒体部办公室——但推文已经发出去了。烟头叔叔觉得这事影响不好，叫你去做和事佬。青岛王其实只是想要更多部门自主权。你选择先听听他的诉求，他表示欣赏你的态度。但明六六觉得你站队不够坚定。",
  },
  {
    id: "pol_social_conflict",
    title: "社管部的秘密",
    description: "丁凯之子在内部会议上暗示社管部有'特殊资金来源'...",
    icon: "🔍",
    minWeek: 7,
    chairEffects: [
      { chair: "social", delta: -10 },
      { chair: "office", delta: 5 },
      { chair: "psychology", delta: 5 },
    ],
    statEffects: [
      { stat: "organization", delta: 3 },
      { stat: "stress", delta: 5 },
    ],
    climateEffects: { schoolPressure: 5 },
    narrative: "丁凯之子在闭门会上轻描淡写地提了一句：'我们社管部有校外赞助渠道——合法的，别紧张。'但所有人都知道，校规明确禁止学生组织接受校外资金。明六六立刻表态反对，心理部负责人温和但坚定地站在了制度一边。丁凯之子看了你一眼——他想知道你的立场。你选择了沉默，这让他不太高兴。",
  },
  // ===== 互助与联盟 =====
  {
    id: "pol_uncle_helps",
    title: "烟头叔叔的咖啡",
    description: "加班到深夜，烟头叔叔突然端了两杯咖啡走进来...",
    icon: "☕",
    minWeek: 2,
    chairEffects: [
      { chair: "life", delta: 10 },
      { chair: "office", delta: -5 },
    ],
    statEffects: [
      { stat: "stress", delta: -8 },
      { stat: "organization", delta: 2 },
    ],
    climateEffects: { clubSatisfaction: 3 },
    narrative: "晚上十一点，活动室只剩下你一个人整理下周的活动方案。门突然被推开——烟头叔叔叼着烟，手里端着两杯咖啡。'就知道你小子还在，别太拼。'他把咖啡放你桌上，拉了把椅子坐下，跟你聊了半小时他在学生会十几年的经历。临走时他说：'有事就来找我，别学某些人——整天算计来算计去。'明六六不知怎么知道了这事，似乎觉得烟头叔叔在拉拢你。",
  },
  {
    id: "pol_cake_alliance",
    title: "小蛋糕的橄榄枝",
    description: "文体部部长小蛋糕主动邀请你一起策划下个月的校园歌手大赛！",
    icon: "🎤",
    minWeek: 4,
    chairEffects: [
      { chair: "sports", delta: 15 },
      { chair: "media", delta: 5 },
    ],
    statEffects: [
      { stat: "charisma", delta: 4 },
      { stat: "connections", delta: 3 },
    ],
    climateEffects: { clubSatisfaction: 5, publicOpinion: 3 },
    narrative: "小蛋糕笑眯眯地坐到你旁边：'听说你最近做活动方案很有一套？下个月的歌手大赛，有没有兴趣一起搞？'这是文体部的招牌活动，往年从不让人插手。小蛋糕能主动邀请你，说明她认可你的能力——也可能想借你抗衡办公室的资源控制。青岛王听说后主动表示可以帮忙宣传。",
  },
  {
    id: "pol_psych_insight",
    title: "心理部的洞察",
    description: "心理部负责人约你喝茶，说想'随便聊聊'——但这显然不是随便的谈话。",
    icon: "🍵",
    minWeek: 6,
    requiredFlags: ["met_zhangyi"],
    chairEffects: [
      { chair: "psychology", delta: 12 },
    ],
    statEffects: [
      { stat: "stress", delta: -10 },
      { stat: "charisma", delta: 2 },
    ],
    climateEffects: { publicTrust: 3 },
    narrative: "心理部负责人给你倒了杯茶，语气一如既往地温和：'张艺最近找过你吗？'她说张艺的做事方式她很了解——先给甜头，再要回报。她提醒你：在学生会中，有些人的友善是因为想从你身上得到什么。她自己不参与权力斗争，但如果你需要中立意见，随时可以找她。这番谈话让你心里踏实了不少。",
  },
  // ===== 负面事件 =====
  {
    id: "pol_rumor_mill",
    title: "流言蜚语",
    description: "有人在背后传你的谣言——说你在活动中收了好处。",
    icon: "🗣️",
    minWeek: 5,
    chairEffects: [
      { chair: "office", delta: -10 },
      { chair: "sports", delta: -5 },
      { chair: "life", delta: 5 },
    ],
    statEffects: [
      { stat: "stress", delta: 8 },
      { stat: "charisma", delta: -2 },
    ],
    climateEffects: { publicTrust: -5, publicOpinion: 5 },
    narrative: "谣言传得很快。明六六在部门长会议上不点名地提了'纪律问题'，小蛋糕看你的眼神变得有些疏远。但烟头叔叔私下跟你说：'这种鬼话我听多了，别当回事。干好自己的活就行。'你需要用实际行动证明自己的清白。",
  },
  {
    id: "pol_sabotage",
    title: "活动被搅黄了",
    description: "你精心策划的活动在最后关头被人动了手脚——物资到了现场才发现少了三分之一。",
    icon: "💢",
    minWeek: 8,
    chairEffects: [
      { chair: "office", delta: -15 },
      { chair: "social", delta: -10 },
    ],
    statEffects: [
      { stat: "stress", delta: 10 },
      { stat: "organization", delta: 3 },
    ],
    climateEffects: { publicTrust: -8, clubSatisfaction: -5 },
    narrative: "你很清楚这是谁干的——但你没有证据。明六六面无表情地说'下次注意检查'，丁凯之子避开了你的目光。你在混乱中靠临场应变硬撑了下来。活动勉强完成，效果打了折扣，但你证明了自己在危机中能保持冷静。不过这两个人显然对你不太友好。",
  },
  {
    id: "pol_betrayal",
    title: "盟友反水",
    description: "你以为站在你这边的人，在关键会议上投了反对票。",
    icon: "🗡️",
    minWeek: 10,
    chairEffects: [
      { chair: "media", delta: -20 },
      { chair: "psychology", delta: 5 },
    ],
    statEffects: [
      { stat: "stress", delta: 12 },
      { stat: "connections", delta: 2 },
    ],
    climateEffects: { publicTrust: -5 },
    narrative: "关于你提出的跨部门合作方案，青岛王在讨论时说'好主意'，投票时却投了反对。你一时语塞——他之前明明支持你的。后来你才从心理部负责人那里得知，青岛王有自己的小算盘：你的方案会削弱新媒体部的独立地位。这次教训让你更懂得分辨真心和假意。",
  },
  // ===== 机遇事件 =====
  {
    id: "pol_media_spotlight",
    title: "校园头条",
    description: "青岛王想做一期'学生会幕后故事'专题，想以你为主角！",
    icon: "📰",
    minWeek: 4,
    chairEffects: [
      { chair: "media", delta: 10 },
      { chair: "sports", delta: -5 },
    ],
    statEffects: [
      { stat: "charisma", delta: 5 },
      { stat: "connections", delta: 4 },
    ],
    climateEffects: { publicOpinion: 10, publicTrust: 3 },
    narrative: "青岛王说你的故事很有感染力——从干事一路做到现在，参与过大型活动，也经历过挫折。他准备用你的视角来讲学生会的工作。这当然能提高你的知名度，但也会让你成为更多人关注的焦点。小蛋糕有点酸：'我们文体部干了那么多活，怎么不拍我们？'",
  },
  {
    id: "pol_dingkai_secret",
    title: "丁凯之子的私聊",
    description: "丁凯之子罕见地主动联系你，说有重要的事要当面谈。",
    icon: "🤫",
    minWeek: 8,
    chairEffects: [
      { chair: "social", delta: 15 },
      { chair: "office", delta: -5 },
    ],
    statEffects: [
      { stat: "connections", delta: 5 },
      { stat: "organization", delta: 3 },
    ],
    climateEffects: { schoolPressure: 3 },
    narrative: "丁凯之子约你在校外一家安静的咖啡馆见面。他罕见地说了很多话：关于社管部的真实运作模式、关于他和明六六之间的暗斗、关于他希望找到一个真正可靠的伙伴。'我看你很久了——你不蠢，也不想害人。有些事我现在不能全说，但如果你想在这个体系里走得更远，你需要知道真相。'这次谈话让你获得了不少内部信息，但明六六似乎察觉到了什么。",
  },
  {
    id: "pol_uncle_backs_you",
    title: "烟头叔叔的背书",
    description: "烟头叔叔在全体例会上公开表扬了你的工作态度！",
    icon: "🌟",
    minWeek: 6,
    requiredFlags: ["pol_uncle_helps"],
    chairEffects: [
      { chair: "life", delta: 10 },
      { chair: "sports", delta: 5 },
      { chair: "media", delta: 5 },
    ],
    statEffects: [
      { stat: "charisma", delta: 5 },
      { stat: "organization", delta: 3 },
      { stat: "stress", delta: -5 },
    ],
    climateEffects: { publicTrust: 8, clubSatisfaction: 3 },
    narrative: "烟头叔叔在例会上难得开了金口：'最近咱们有些干事——我说的是谁大家心里有数——比某些部长还靠谱。'虽然没点名，但所有人都看向了你。小蛋糕对你笑了笑，青岛王给你比了个赞。烟头叔叔的认可本身就是一种力量——在这群人里，他是最不玩心机的一个。",
  },
  // ===== 连锁事件 =====
  {
    id: "pol_ming66_jealous",
    title: "明六六的醋意",
    description: "烟头叔叔对你的支持让明六六感到了威胁...",
    icon: "😒",
    minWeek: 9,
    requiredFlags: ["pol_uncle_backs_you"],
    chairEffects: [
      { chair: "office", delta: -15 },
      { chair: "life", delta: 5 },
    ],
    statEffects: [
      { stat: "stress", delta: 5 },
      { stat: "organization", delta: 4 },
    ],
    climateEffects: { schoolPressure: 3 },
    narrative: "明六六开始在会议上对你的提案格外挑剔。每一个数字都要追问来源，每一个流程都要质疑合理性。烟头叔叔私下跟你说：'别怕她。她越是这样越说明你在做对的事。'你把每一次刁难都变成了展示能力的机会——方案越改越好，连明六六最后都挑不出毛病。但她的脸色更差了。",
  },
  {
    id: "pol_grand_coalition",
    title: "大联盟",
    description: "多个部长同时向你示好——学生会内部正在形成新的权力格局。",
    icon: "🤝",
    minWeek: 11,
    requiredFlags: ["pol_cake_alliance", "pol_uncle_backs_you"],
    chairEffects: [
      { chair: "sports", delta: 10 },
      { chair: "life", delta: 10 },
      { chair: "media", delta: 8 },
      { chair: "psychology", delta: 5 },
      { chair: "office", delta: -5 },
      { chair: "social", delta: -5 },
    ],
    statEffects: [
      { stat: "connections", delta: 8 },
      { stat: "charisma", delta: 5 },
      { stat: "organization", delta: 3 },
    ],
    climateEffects: { publicTrust: 10, clubSatisfaction: 5, schoolPressure: -5 },
    narrative: "小蛋糕、烟头叔叔、青岛王——三个人都向你表达了合作意愿。加上心理部负责人的暗中支持，你突然发现自己拥有了学生会中最大的人脉网络。但这也意味着你站在了明六六和丁凯之子的对立面。一个老干事私下警告你：站得越高，摔得越重。接下来的每一步都要小心。",
  },
  // ===== 独立小事件 =====
  {
    id: "pol_crisis_meeting",
    title: "紧急闭门会",
    description: "学校突然要削减学生会总预算，所有部长被紧急召集开会。",
    icon: "🚨",
    minWeek: 4,
    chairEffects: [
      { chair: "office", delta: 5 },
      { chair: "life", delta: 5 },
      { chair: "sports", delta: -5 },
    ],
    statEffects: [
      { stat: "stress", delta: 5 },
      { stat: "organization", delta: 4 },
    ],
    climateEffects: { schoolPressure: 8, publicTrust: -3 },
    narrative: "哈马面无表情地宣布：下学期预算砍30%。会议室里炸开了锅。小蛋糕最激动——文体部的大型活动最烧钱。你提出了一个分批执行、寻求赞助的方案，明六六难得点头认可，烟头叔叔也觉得务实。但小蛋糕觉得你不够为她争取，有些失望。",
  },
];

/** 检查事件是否满足触发条件 */
export function canTriggerPoliticsEvent(
  event: ChairPoliticsEvent,
  week: number,
  flags: Record<string, boolean>,
  eventHistory: string[]
): boolean {
  if (event.minWeek && week < event.minWeek) return false;
  if (event.requiredFlags && !event.requiredFlags.every((f) => flags[f])) return false;
  if (event.excludeFlags && event.excludeFlags.some((f) => flags[f])) return false;
  if (eventHistory.includes(event.id)) return false; // 已触发过
  return true;
}

/** 根据当前周数和旗标随机抽取1-2个政治事件 */
export function pickWeeklyPoliticsEvents(
  week: number,
  flags: Record<string, boolean>,
  eventHistory: string[]
): ChairPoliticsEvent[] {
  const pool = CHAIR_POLITICS_EVENTS.filter((e) =>
    canTriggerPoliticsEvent(e, week, flags, eventHistory)
  );
  if (pool.length === 0) return [];

  // 每周1-2个事件
  const count = Math.random() < 0.4 ? 2 : 1;
  const result: ChairPoliticsEvent[] = [];
  const remaining = [...pool];

  for (let i = 0; i < count && remaining.length > 0; i++) {
    const idx = Math.floor(Math.random() * remaining.length);
    result.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return result;
}
