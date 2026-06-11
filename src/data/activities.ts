// src/data/activities.ts
import { ActivityDef, ActivitySubType, LoveNPC, NPCPersonality } from "../types/game";

export const ACTIVITIES: ActivityDef[] = [
  // ===== 学习 (study) =====
  {
    type: "study", subType: "study_library", label: "图书馆自习",
    icon: "📚", description: "在图书馆安静自习，效率最高",
    rarity: "common",
    apCost: 1, energyCost: 15,
    tags: ["学术", "室内", "图书馆", "专注"],
    statEffects: [{ stat: "academics", min: 4, max: 8 }],
    stressDelta: 3, eventTriggerChance: 0.3, eventCategory: "daily",
  },
  {
    type: "study", subType: "study_group", label: "小组讨论",
    icon: "👥", description: "和同学一起讨论，互相启发",
    rarity: "common",
    apCost: 1, energyCost: 12,
    tags: ["学术", "室内", "团队", "低压"],
    statEffects: [{ stat: "academics", min: 3, max: 6 }, { stat: "connections", min: 1, max: 2 }],
    stressDelta: 1, eventTriggerChance: 0.25, eventCategory: "daily",
  },
  {
    type: "study", subType: "study_cram", label: "考前突击",
    icon: "🔥", description: "熬夜爆肝，高风险高回报",
    rarity: "rare",
    apCost: 1, energyCost: 20,
    tags: ["学术", "室内", "高压"],
    statEffects: [{ stat: "academics", min: 6, max: 10 }],
    stressDelta: 5, eventTriggerChance: 0.2, eventCategory: "daily",
    unlockCondition: { flags: ["exam_week"] },
  },
  {
    type: "study", subType: "study_library", label: "教授答疑",
    icon: "🎓", description: "课后找教授请教难题，豁然开朗",
    rarity: "epic",
    apCost: 1, energyCost: 18,
    tags: ["学术", "室内", "一对一"],
    statEffects: [{ stat: "academics", min: 8, max: 14 }, { stat: "connections", min: 2, max: 4 }],
    stressDelta: 2, eventTriggerChance: 0.4, eventCategory: "opportunity",
    specialEffect: { type: "bonus_stats", value: 3, description: "额外+3学习力" },
  },
  // ===== 社交 (social) =====
  {
    type: "social", subType: "social_meal", label: "约饭聊天",
    icon: "🍜", description: "一起吃顿饭，拉近关系的好方法",
    rarity: "common",
    apCost: 1, energyCost: 10,
    tags: ["社交", "食堂", "低压", "一对一"],
    statEffects: [{ stat: "connections", min: 2, max: 5 }, { stat: "charisma", min: 1, max: 2 }],
    stressDelta: -5, eventTriggerChance: 0.35, eventCategory: "relationship",
  },
  {
    type: "social", subType: "social_club", label: "社团活动",
    icon: "🎯", description: "参加社团活动，认识新朋友",
    rarity: "common",
    apCost: 1, energyCost: 12,
    tags: ["社交", "室内", "团队", "低压"],
    statEffects: [{ stat: "connections", min: 2, max: 4 }, { stat: "organization", min: 1, max: 3 }],
    stressDelta: -3, eventTriggerChance: 0.3, eventCategory: "relationship",
  },
  {
    type: "social", subType: "social_date", label: "联谊交友",
    icon: "💕", description: "跨部门联谊，缘分可能就在其中",
    rarity: "rare",
    apCost: 1, energyCost: 10,
    tags: ["社交", "室内", "跨部门", "低压"],
    statEffects: [{ stat: "charisma", min: 3, max: 5 }, { stat: "connections", min: 1, max: 2 }],
    stressDelta: -3, eventTriggerChance: 0.5, eventCategory: "relationship",
  },
  {
    type: "social", subType: "social_club", label: "部门聚餐",
    icon: "🍻", description: "和部门伙伴们大吃一顿，关系拉满",
    rarity: "epic",
    apCost: 1, energyCost: 14,
    tags: ["社交", "食堂", "团队", "跨部门"],
    statEffects: [{ stat: "connections", min: 4, max: 8 }, { stat: "charisma", min: 2, max: 4 }],
    stressDelta: -8, eventTriggerChance: 0.5, eventCategory: "department",
    specialEffect: { type: "npc_bond", value: 5, description: "所有NPC好感+5" },
  },
  // ===== 工作 (work) =====
  {
    type: "work", subType: "work_plan", label: "策划活动",
    icon: "📋", description: "为学生会策划下一个大型活动",
    rarity: "common",
    apCost: 1, energyCost: 22,
    tags: ["组织", "策划", "办公室", "高压"],
    statEffects: [{ stat: "organization", min: 4, max: 7 }, { stat: "budget", min: 2, max: 5 }],
    stressDelta: 5, eventTriggerChance: 0.4, eventCategory: "department",
  },
  {
    type: "work", subType: "work_paperwork", label: "处理文书",
    icon: "📝", description: "整理文件表格，虽然枯燥但很重要",
    rarity: "common",
    apCost: 1, energyCost: 15,
    tags: ["组织", "文书", "办公室"],
    statEffects: [{ stat: "organization", min: 2, max: 4 }, { stat: "academics", min: 1, max: 3 }],
    stressDelta: 2, eventTriggerChance: 0.2, eventCategory: "daily",
  },
  {
    type: "work", subType: "work_coordinate", label: "部内协调",
    icon: "🤝", description: "协调部门内部事务，锻炼沟通能力",
    rarity: "rare",
    apCost: 1, energyCost: 18,
    tags: ["组织", "室内", "团队"],
    statEffects: [{ stat: "connections", min: 2, max: 4 }, { stat: "organization", min: 2, max: 4 }, { stat: "charisma", min: 1, max: 2 }],
    stressDelta: 3, eventTriggerChance: 0.3, eventCategory: "department",
  },
  {
    type: "work", subType: "work_plan", label: "校际交流策划",
    icon: "🏛️", description: "策划与外校学生会的交流活动，大展身手",
    rarity: "epic",
    apCost: 1, energyCost: 25,
    tags: ["组织", "策划", "跨部门", "高压"],
    statEffects: [{ stat: "organization", min: 6, max: 10 }, { stat: "connections", min: 3, max: 6 }, { stat: "charisma", min: 2, max: 4 }],
    stressDelta: 6, eventTriggerChance: 0.5, eventCategory: "opportunity",
    specialEffect: { type: "bonus_stats", value: 5, description: "额外+5组织力" },
  },
  // ===== 休息 (rest) =====
  {
    type: "rest", subType: "rest_sleep", label: "睡大觉",
    icon: "😴", description: "好好睡一觉，精力充沛",
    rarity: "common",
    apCost: 1, energyCost: -35,
    tags: ["休息", "室内", "低压"],
    statEffects: [],
    stressDelta: -10, eventTriggerChance: 0,
  },
  {
    type: "rest", subType: "rest_game", label: "打游戏",
    icon: "🎮", description: "开黑放松一下...虽然有点废",
    rarity: "common",
    apCost: 1, energyCost: -15,
    tags: ["休息", "室内", "低压"],
    statEffects: [{ stat: "charisma", min: -3, max: -1 }],
    stressDelta: -5, eventTriggerChance: 0,
  },
  {
    type: "rest", subType: "rest_walk", label: "散步发呆",
    icon: "🚶", description: "在校园里走走，放空大脑",
    rarity: "common",
    apCost: 1, energyCost: -25,
    tags: ["休息", "户外", "低压"],
    statEffects: [],
    stressDelta: -8, eventTriggerChance: 0.05, eventCategory: "opportunity",
  },
  {
    type: "rest", subType: "rest_walk", label: "周末踏青",
    icon: "🌿", description: "去郊外呼吸新鲜空气，彻底放松",
    rarity: "rare",
    apCost: 1, energyCost: -40,
    tags: ["休息", "户外", "低压"],
    statEffects: [],
    stressDelta: -15, eventTriggerChance: 0.3, eventCategory: "opportunity",
    specialEffect: { type: "free_rest", description: "下一天精力消耗减半" },
  },
  {
    type: "rest", subType: "rest_sleep", label: "冥想修行",
    icon: "🧘", description: "闭目养神，身心合一",
    rarity: "epic",
    apCost: 1, energyCost: -50,
    tags: ["休息", "室内", "专注"],
    statEffects: [{ stat: "stress", min: -5, max: -3 }],
    stressDelta: -20, eventTriggerChance: 0.1, eventCategory: "opportunity",
    specialEffect: { type: "combo_boost", value: 2, description: "本周Combo加成翻倍" },
  },
  // ===== 志愿 (volunteer) =====
  {
    type: "volunteer", subType: "volunteer" as ActivitySubType, label: "志愿服务",
    icon: "🎪", description: "参加校园志愿活动，奉献爱心",
    rarity: "common",
    apCost: 1, energyCost: 25,
    tags: ["志愿", "服务", "户外"],
    statEffects: [],
    stressDelta: 0, eventTriggerChance: 1.0, eventCategory: "volunteer",
  },
  {
    type: "volunteer", subType: "volunteer" as ActivitySubType, label: "社区义工",
    icon: "🏘️", description: "走进社区，帮助需要帮助的人",
    rarity: "rare",
    apCost: 1, energyCost: 22,
    tags: ["志愿", "服务", "户外", "低压"],
    statEffects: [{ stat: "connections", min: 2, max: 4 }, { stat: "charisma", min: 1, max: 3 }],
    stressDelta: -2, eventTriggerChance: 1.0, eventCategory: "volunteer",
    specialEffect: { type: "bonus_stats", value: 3, description: "志愿时长+3" },
  },
  {
    type: "volunteer", subType: "volunteer" as ActivitySubType, label: "大型赛事志愿者",
    icon: "🏆", description: "担任大型赛事志愿者，开阔眼界",
    rarity: "epic",
    apCost: 1, energyCost: 30,
    tags: ["志愿", "服务", "户外", "竞技", "高压"],
    statEffects: [{ stat: "connections", min: 3, max: 6 }, { stat: "organization", min: 2, max: 5 }, { stat: "charisma", min: 2, max: 4 }],
    stressDelta: 3, eventTriggerChance: 1.0, eventCategory: "volunteer",
    specialEffect: { type: "bonus_stats", value: 5, description: "志愿时长+5 & 额外事件" },
  },
  // ===== 传奇 (legendary) =====
  {
    type: "study", subType: "study_library", label: "学术论坛发言",
    icon: "🎤", description: "代表学生会在学术论坛发表演讲，全面提升！",
    rarity: "legendary",
    apCost: 1, energyCost: 30,
    tags: ["学术", "室内", "竞技", "高压"],
    statEffects: [{ stat: "academics", min: 10, max: 18 }, { stat: "charisma", min: 4, max: 8 }, { stat: "connections", min: 3, max: 6 }],
    stressDelta: 8, eventTriggerChance: 0.6, eventCategory: "opportunity",
    specialEffect: { type: "bonus_stats", value: 8, description: "全部属性额外+3" },
  },
  {
    type: "social", subType: "social_club", label: "校园文化节主持",
    icon: "🎭", description: "担任校园文化节主持人，万众瞩目！",
    rarity: "legendary",
    apCost: 1, energyCost: 28,
    tags: ["社交", "室内", "竞技", "高压"],
    statEffects: [{ stat: "charisma", min: 8, max: 15 }, { stat: "connections", min: 5, max: 10 }, { stat: "organization", min: 3, max: 6 }],
    stressDelta: 8, eventTriggerChance: 0.7, eventCategory: "opportunity",
    specialEffect: { type: "extra_event", description: "必定触发额外事件" },
  },
  {
    type: "work", subType: "work_plan", label: "校际联盟峰会",
    icon: "🌍", description: "代表学校参加全国高校学生会联盟峰会",
    rarity: "legendary",
    apCost: 1, energyCost: 35,
    tags: ["组织", "策划", "跨部门", "高压", "竞技"],
    statEffects: [{ stat: "organization", min: 10, max: 16 }, { stat: "connections", min: 6, max: 12 }, { stat: "budget", min: 5, max: 10 }],
    stressDelta: 10, eventTriggerChance: 0.8, eventCategory: "opportunity",
    specialEffect: { type: "combo_boost", value: 3, description: "本周Combo加成三倍" },
  },
];

/** 根据NPC个性生成专属邀约卡牌 */
export function getNPCInviteCard(npc: LoveNPC): ActivityDef {
  // 买单哥专属：请吃饭回血+爆金币
  if (npc.id === "maidan_ge") {
    return {
      type: "social", subType: "social_meal",
      rarity: "epic", apCost: 1, energyCost: 5,
      label: `买单哥请客`,
      icon: "💰",
      description: "买单哥大手一挥：今天全场由我买单！",
      tags: ["社交", "食堂", "低压", "一对一"],
      statEffects: [
        { stat: "connections", min: 2, max: 5 },
        { stat: "allowance", min: 30, max: 60 },
      ],
      stressDelta: -10, eventTriggerChance: 0.5, eventCategory: "relationship",
      specialEffect: { type: "energy_refund", value: 20, description: "生活费+30~60 & 精力+20" },
    } as ActivityDef;
  }
  // 张艺专属：表面温和实则挖坑
  if (npc.id === "zhangyi") {
    return {
      type: "work", subType: "work_coordinate",
      rarity: "epic", apCost: 1, energyCost: 15,
      label: `张艺的"指导"`,
      icon: "🕸️",
      description: "张艺微笑着说要给你一些宝贵建议...但总感觉哪里不对",
      tags: ["组织", "室内", "高压"],
      statEffects: [
        { stat: "organization", min: 2, max: 5 },
        { stat: "connections", min: -2, max: 1 },
        { stat: "charisma", min: -2, max: 1 },
      ],
      stressDelta: 8, eventTriggerChance: 0.7, eventCategory: "crisis",
      specialEffect: { type: "npc_bond", value: 15, description: "张艺好感+15（但你感觉被利用了...）" },
    } as ActivityDef;
  }

  const templates: Record<NPCPersonality, Omit<ActivityDef, "label" | "description" | "icon" | "tags">> = {
    sunny: {
      type: "social", subType: "social_date",
      rarity: "epic", apCost: 1, energyCost: 8,
      statEffects: [{ stat: "charisma", min: 3, max: 6 }, { stat: "connections", min: 2, max: 4 }],
      stressDelta: -10, eventTriggerChance: 0.7, eventCategory: "relationship",
      specialEffect: { type: "npc_bond", value: 10, description: `${npc.name}好感+10` },
    },
    tsundere: {
      type: "study", subType: "study_group",
      rarity: "epic", apCost: 1, energyCost: 10,
      statEffects: [{ stat: "academics", min: 4, max: 8 }, { stat: "connections", min: 1, max: 3 }],
      stressDelta: -5, eventTriggerChance: 0.6, eventCategory: "relationship",
      specialEffect: { type: "npc_bond", value: 10, description: `${npc.name}好感+10` },
    },
    gentle: {
      type: "rest", subType: "rest_walk",
      rarity: "epic", apCost: 1, energyCost: -30,
      statEffects: [],
      stressDelta: -18, eventTriggerChance: 0.5, eventCategory: "relationship",
      specialEffect: { type: "npc_bond", value: 10, description: `${npc.name}好感+10` },
    },
    shy: {
      type: "volunteer", subType: "volunteer" as ActivitySubType,
      rarity: "epic", apCost: 1, energyCost: 22,
      statEffects: [{ stat: "connections", min: 2, max: 5 }, { stat: "charisma", min: 1, max: 3 }],
      stressDelta: -3, eventTriggerChance: 1.0, eventCategory: "volunteer",
      specialEffect: { type: "npc_bond", value: 10, description: `${npc.name}好感+10` },
    },
    mischievous: {
      type: "social", subType: "social_club",
      rarity: "epic", apCost: 1, energyCost: 12,
      statEffects: [{ stat: "connections", min: 3, max: 6 }, { stat: "charisma", min: 2, max: 5 }],
      stressDelta: -8, eventTriggerChance: 0.65, eventCategory: "relationship",
      specialEffect: { type: "npc_bond", value: 10, description: `${npc.name}好感+10` },
    },
  };

  const labels: Record<NPCPersonality, string> = {
    sunny: `${npc.name}的约会邀请`,
    tsundere: `${npc.name}的学习邀约`,
    gentle: `${npc.name}的散步邀请`,
    shy: `${npc.name}的志愿邀请`,
    mischievous: `${npc.name}的社团邀约`,
  };
  const descs: Record<NPCPersonality, string> = {
    sunny: `${npc.name}热情地邀请你一起出去玩！`,
    tsundere: `${npc.name}嘴上说着"只是顺便"，但明显是特地来找你的...`,
    gentle: `${npc.name}温柔地问你要不要一起去校园里走走`,
    shy: `${npc.name}小声地问你能不能一起去参加志愿活动`,
    mischievous: `${npc.name}神秘兮兮地说有好玩的事要找你一起`,
  };
  const icons: Record<NPCPersonality, string> = {
    sunny: "💕", tsundere: "📖", gentle: "🌸", shy: "🎪", mischievous: "🎭",
  };

  const tagMap: Record<NPCPersonality, string[]> = {
    sunny: ["社交", "户外", "低压", "一对一"],
    tsundere: ["学术", "室内", "低压", "一对一"],
    gentle: ["休息", "户外", "低压", "一对一"],
    shy: ["志愿", "服务", "户外", "低压"],
    mischievous: ["社交", "室内", "团队", "低压"],
  };

  const t = templates[npc.personality];
  return {
    ...t,
    label: labels[npc.personality],
    description: descs[npc.personality],
    icon: icons[npc.personality],
    tags: tagMap[npc.personality],
  } as ActivityDef;
}

export function getActivityBySubType(subType: string): ActivityDef | undefined {
  return ACTIVITIES.find((a) => a.subType === subType);
}

export function getActivitiesByType(type: string): ActivityDef[] {
  return ACTIVITIES.filter((a) => a.type === type);
}

/** 根据稀有度权重抽卡 */
export function drawCards(count: number, week: number, flags: Record<string, boolean>): ActivityDef[] {
  // 筛选可用卡池
  const available = ACTIVITIES.filter((a) => {
    if (!a.unlockCondition) return true;
    const cond = a.unlockCondition;
    if (cond.flags && !cond.flags.some((f) => flags[f])) return false;
    return true;
  });

  // 按稀有度分组
  const commons = available.filter((a) => a.rarity === "common");
  const rares = available.filter((a) => a.rarity === "rare");
  const epics = available.filter((a) => a.rarity === "epic");
  const legendaries = available.filter((a) => a.rarity === "legendary");

  const drawn: ActivityDef[] = [];
  const usedSubTypes = new Set<string>();

  for (let i = 0; i < count; i++) {
    // 保证至少1张休息卡
    if (i === count - 1 && !drawn.some((c) => c.type === "rest")) {
      const restCards = commons.filter((c) => c.type === "rest");
      const pick = restCards[Math.floor(Math.random() * restCards.length)];
      if (pick) {
        drawn.push(pick);
        continue;
      }
    }

    const roll = Math.random();
    let pool: ActivityDef[];
    if (roll < 0.55) {
      pool = commons;
    } else if (roll < 0.82) {
      pool = rares.length > 0 ? rares : commons;
    } else if (roll < 0.96) {
      pool = epics.length > 0 ? epics : (rares.length > 0 ? rares : commons);
    } else {
      pool = legendaries.length > 0 ? legendaries : (epics.length > 0 ? epics : (rares.length > 0 ? rares : commons));
    }

    // 避免重复子类型（除非池子太小）
    let candidates = pool.filter((a) => !usedSubTypes.has(a.subType));
    if (candidates.length === 0) candidates = pool;

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    if (pick) {
      drawn.push(pick);
      usedSubTypes.add(pick.subType);
    }
  }

  return drawn;
}
