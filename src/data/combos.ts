// src/data/combos.ts
import { ActivityDef, ActivityType, Stats, WeeklyCombo, CampusClimateDelta } from "../types/game";

type ComboCategory = "tag" | "streak" | "rarity" | "risk";

interface ComboPattern {
  /** All tags that must be present (any order, across all 5 cards) */
  requireTags?: string[];
  /** At least this many cards with any of these tags */
  requireTagCount?: { tags: string[]; min: number };
  /** Consecutive same-type streak required */
  streakType?: string;
  streakMin?: number;
  /** Rarity pattern */
  minRare?: number;        // minimum rare+ cards
  minEpic?: number;        // minimum epic+ cards
  hasLegendary?: boolean;
  /** All 5 types present */
  allTypes?: boolean;
  /** Rest between two specific-tag cards (positional) */
  restBetween?: string;    // tag that must appear on both sides of a rest card
  /** Min cards with a tag */
  minTagCount?: { tag: string; count: number };
}

interface ComboDef {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: ComboCategory;
  pattern: ComboPattern;
  statEffects: { stat: keyof Stats; delta: number }[];
  climateEffects: CampusClimateDelta;
}

const COMBO_DEFS: ComboDef[] = [
  // ===== Tag-based cross-type combos =====
  {
    id: "triple_crown",
    label: "三冠王",
    description: "学术、社交、组织三线并进，全面发展的典范！",
    icon: "👑",
    category: "tag",
    pattern: { requireTags: ["学术", "社交", "组织"] },
    statEffects: [
      { stat: "academics", delta: 3 },
      { stat: "connections", delta: 3 },
      { stat: "organization", delta: 3 },
      { stat: "charisma", delta: 3 },
    ],
    climateEffects: { publicTrust: 5 },
  },
  {
    id: "project_defense",
    label: "项目答辩",
    description: "学术+组织+策划三合一，完美的项目答辩准备！",
    icon: "🎓",
    category: "tag",
    pattern: { requireTags: ["学术", "组织", "策划"] },
    statEffects: [
      { stat: "academics", delta: 8 },
      { stat: "organization", delta: 5 },
    ],
    climateEffects: { publicTrust: 3, publicOpinion: 2 },
  },
  {
    id: "stress_management",
    label: "劳逸结合",
    description: "在高压活动之间安排休息，事半功倍",
    icon: "⚖️",
    category: "tag",
    pattern: { restBetween: "高压" },
    statEffects: [
      { stat: "stress", delta: -5 },
      { stat: "organization", delta: 2 },
    ],
    climateEffects: {},
  },
  {
    id: "outdoor_week",
    label: "阳光周",
    description: "多在户外活动，心情舒畅",
    icon: "☀️",
    category: "tag",
    pattern: { requireTagCount: { tags: ["户外"], min: 3 } },
    statEffects: [
      { stat: "charisma", delta: 5 },
      { stat: "stress", delta: 3 },
    ],
    climateEffects: { clubSatisfaction: 3 },
  },
  {
    id: "team_player",
    label: "团队协作者",
    description: "多次团队合作，默契十足",
    icon: "🤝",
    category: "tag",
    pattern: { requireTagCount: { tags: ["团队"], min: 3 } },
    statEffects: [
      { stat: "connections", delta: 5 },
      { stat: "organization", delta: 3 },
    ],
    climateEffects: { clubSatisfaction: 2, publicTrust: 2 },
  },
  {
    id: "paperwork_marathon",
    label: "文书马拉松",
    description: "连续处理文书工作，效率提升",
    icon: "📑",
    category: "tag",
    pattern: { minTagCount: { tag: "文书", count: 2 } },
    statEffects: [
      { stat: "organization", delta: 6 },
      { stat: "academics", delta: 2 },
    ],
    climateEffects: { schoolPressure: -2 },
  },
  {
    id: "social_butterfly",
    label: "社交蝴蝶",
    description: "食堂、社交、低压三合一，轻松扩展人脉",
    icon: "🦋",
    category: "tag",
    pattern: { requireTags: ["社交", "食堂", "低压"] },
    statEffects: [
      { stat: "charisma", delta: 5 },
      { stat: "connections", delta: 3 },
    ],
    climateEffects: { clubSatisfaction: 3, publicOpinion: 2 },
  },
  {
    id: "strategic_rest",
    label: "战略性休息",
    description: "专注学习后安排充分休息，恢复效率最大化",
    icon: "🎯",
    category: "tag",
    pattern: { requireTags: ["休息", "专注"] },
    statEffects: [
      { stat: "organization", delta: 2 },
      { stat: "academics", delta: 2 },
      { stat: "stress", delta: -3 },
    ],
    climateEffects: {},
  },
  {
    id: "cross_dept_alliance",
    label: "跨部门联盟",
    description: "跨部门+策划+社交，学生会外交大成功",
    icon: "🏛️",
    category: "tag",
    pattern: { requireTags: ["跨部门", "策划", "社交"] },
    statEffects: [
      { stat: "connections", delta: 8 },
      { stat: "charisma", delta: 3 },
    ],
    climateEffects: { publicTrust: 5, clubSatisfaction: 3 },
  },
  {
    id: "service_marathon",
    label: "志愿马拉松",
    description: "爱心接力，志愿服务加倍",
    icon: "💝",
    category: "tag",
    pattern: { minTagCount: { tag: "志愿", count: 2 } },
    statEffects: [
      { stat: "volunteerHours", delta: 5 },
      { stat: "charisma", delta: 2 },
    ],
    climateEffects: { publicTrust: 4, publicOpinion: 3 },
  },
  {
    id: "study_group_plus",
    label: "学霸小组",
    description: "学术+社交+图书馆，学习社交两不误",
    icon: "📖",
    category: "tag",
    pattern: { requireTags: ["学术", "社交", "图书馆"] },
    statEffects: [
      { stat: "academics", delta: 6 },
      { stat: "connections", delta: 3 },
    ],
    climateEffects: { publicOpinion: 2, schoolPressure: -3 },
  },
  {
    id: "focus_carousel",
    label: "专注轮转",
    description: "多张专注卡片，深度投入学习与修炼",
    icon: "🔬",
    category: "tag",
    pattern: { requireTagCount: { tags: ["专注"], min: 3 } },
    statEffects: [
      { stat: "academics", delta: 4 },
      { stat: "stress", delta: -2 },
    ],
    climateEffects: { schoolPressure: -2 },
  },

  // ===== Same-type streaks =====
  {
    id: "study_streak_3",
    label: "学海无涯",
    description: "连续三天学习，知识积累爆发",
    icon: "📚",
    category: "streak",
    pattern: { streakType: "study", streakMin: 3 },
    statEffects: [
      { stat: "academics", delta: 3 },
    ],
    climateEffects: { schoolPressure: -3, publicOpinion: 1 },
  },
  {
    id: "study_streak_4",
    label: "学术狂人",
    description: "连续四天学习！学术力大幅提升，但有 burnout 风险",
    icon: "🤓",
    category: "streak",
    pattern: { streakType: "study", streakMin: 4 },
    statEffects: [
      { stat: "academics", delta: 5 },
      { stat: "stress", delta: 5 },
    ],
    climateEffects: { schoolPressure: -5, publicOpinion: 3 },
  },
  {
    id: "work_streak_3",
    label: "工作狂",
    description: "连续三天高强度工作，产出惊人但也消耗巨大",
    icon: "💼",
    category: "streak",
    pattern: { streakType: "work", streakMin: 3 },
    statEffects: [
      { stat: "organization", delta: 3 },
      { stat: "budget", delta: 3 },
      { stat: "stress", delta: 3 },
    ],
    climateEffects: { publicTrust: 2, schoolPressure: 2 },
  },
  {
    id: "work_streak_4",
    label: "过劳危机",
    description: "连续四天工作！组织力暴涨但身体发出警报",
    icon: "⚠️",
    category: "streak",
    pattern: { streakType: "work", streakMin: 4 },
    statEffects: [
      { stat: "organization", delta: 8 },
      { stat: "stress", delta: 10 },
    ],
    climateEffects: { publicTrust: 5, schoolPressure: 5 },
  },
  {
    id: "social_streak_3",
    label: "社交达人",
    description: "连续三天社交活动，人脉飞速扩张",
    icon: "🎉",
    category: "streak",
    pattern: { streakType: "social", streakMin: 3 },
    statEffects: [
      { stat: "connections", delta: 3 },
      { stat: "charisma", delta: 2 },
    ],
    climateEffects: { clubSatisfaction: 3, publicOpinion: 2 },
  },
  {
    id: "rest_streak_2",
    label: "摸鱼两天",
    description: "连续休息两天...虽然放松了，但被人说偷懒",
    icon: "🦥",
    category: "streak",
    pattern: { streakType: "rest", streakMin: 2 },
    statEffects: [
      { stat: "stress", delta: -5 },
      { stat: "organization", delta: -3 },
    ],
    climateEffects: { publicTrust: -2 },
  },

  // ===== Rarity-based combos =====
  {
    id: "rare_duo",
    label: "珍稀搭配",
    description: "两张稀有以上卡牌产生共鸣",
    icon: "💎",
    category: "rarity",
    pattern: { minRare: 2 },
    statEffects: [
      { stat: "academics", delta: 2 },
      { stat: "connections", delta: 2 },
      { stat: "organization", delta: 2 },
    ],
    climateEffects: { publicOpinion: 2 },
  },
  {
    id: "epic_moment",
    label: "史诗时刻",
    description: "史诗卡牌与同类型卡牌搭配，效果翻倍！",
    icon: "✨",
    category: "rarity",
    pattern: { minEpic: 1, streakMin: 2 },
    statEffects: [
      { stat: "academics", delta: 3 },
      { stat: "connections", delta: 3 },
      { stat: "organization", delta: 3 },
      { stat: "charisma", delta: 3 },
    ],
    climateEffects: { publicOpinion: 5, publicTrust: 3 },
  },
  {
    id: "legendary_week",
    label: "传奇一周",
    description: "传奇卡牌降临！所有卡牌获得额外加成",
    icon: "🌟",
    category: "rarity",
    pattern: { hasLegendary: true },
    statEffects: [
      { stat: "academics", delta: 2 },
      { stat: "connections", delta: 2 },
      { stat: "organization", delta: 2 },
      { stat: "charisma", delta: 2 },
      { stat: "stress", delta: -2 },
    ],
    climateEffects: { publicOpinion: 8, publicTrust: 5, clubSatisfaction: 5 },
  },

  // ===== Risk/reward combos =====
  {
    id: "high_risk_high_return",
    label: "高风险周",
    description: "三张以上高压活动，全力以赴但压力陡增",
    icon: "🎢",
    category: "risk",
    pattern: { requireTagCount: { tags: ["高压"], min: 3 } },
    statEffects: [
      { stat: "academics", delta: 3 },
      { stat: "organization", delta: 3 },
      { stat: "connections", delta: 3 },
      { stat: "stress", delta: 10 },
    ],
    climateEffects: { publicTrust: 3, schoolPressure: 5 },
  },
  {
    id: "balanced_life",
    label: "均衡生活",
    description: "五种活动类型齐全——完美的一周！",
    icon: "☯️",
    category: "risk",
    pattern: { allTypes: true },
    statEffects: [
      { stat: "academics", delta: 3 },
      { stat: "connections", delta: 3 },
      { stat: "organization", delta: 3 },
      { stat: "charisma", delta: 3 },
      { stat: "stress", delta: -5 },
    ],
    climateEffects: { publicTrust: 3, clubSatisfaction: 3, schoolPressure: -3, publicOpinion: 3 },
  },
  {
    id: "indoor_hermit",
    label: "宅男/宅女周",
    description: "全周都在室内活动，舒适但缺乏外向性",
    icon: "🏠",
    category: "risk",
    pattern: { requireTagCount: { tags: ["室内"], min: 5 } },
    statEffects: [
      { stat: "academics", delta: 3 },
      { stat: "stress", delta: -3 },
      { stat: "charisma", delta: -2 },
    ],
    climateEffects: { clubSatisfaction: -3 },
  },
  {
    id: "low_pressure_week",
    label: "躺平周",
    description: "全周低压活动，身心放松但进步缓慢",
    icon: "😌",
    category: "risk",
    pattern: { requireTagCount: { tags: ["低压"], min: 4 } },
    statEffects: [
      { stat: "stress", delta: -8 },
      { stat: "organization", delta: -2 },
      { stat: "academics", delta: -1 },
    ],
    climateEffects: { schoolPressure: -5, publicTrust: -2 },
  },
];

const CATEGORY_COLORS: Record<ComboCategory, string> = {
  tag: "#5b9bd5",
  streak: "#e67e22",
  rarity: "#9b59b6",
  risk: "#e74c3c",
};

export function getComboCategoryColor(category: ComboCategory): string {
  return CATEGORY_COLORS[category];
}

/** Detect all combos triggered by a 5-slot arrangement */
export function detectCombos(slots: (ActivityDef | null)[]): WeeklyCombo[] {
  const cards = slots.filter((s): s is ActivityDef => s !== null);
  if (cards.length === 0) return [];

  const allTags = cards.flatMap((c) => c.tags);
  const allTypes = cards.map((c) => c.type);
  const tagSet = new Set(allTags);

  const results: WeeklyCombo[] = [];
  const triggered = new Set<string>();

  for (const def of COMBO_DEFS) {
    if (triggered.has(def.id)) continue;

    let matched = false;

    // Tag-based: all requireTags present
    if (def.pattern.requireTags) {
      if (def.pattern.requireTags.every((t) => tagSet.has(t))) {
        matched = true;
      }
    }

    // Tag count: at least min cards with any of these tags
    if (def.pattern.requireTagCount && !matched) {
      const { tags, min } = def.pattern.requireTagCount;
      const count = cards.filter((c) => c.tags.some((t) => tags.includes(t))).length;
      if (count >= min) matched = true;
    }

    // Min tag count (single tag)
    if (def.pattern.minTagCount && !matched) {
      const count = cards.filter((c) => c.tags.includes(def.pattern.minTagCount!.tag)).length;
      if (count >= def.pattern.minTagCount!.count) matched = true;
    }

    // Streak-based
    if (def.pattern.streakType && def.pattern.streakMin && !matched) {
      const target = def.pattern.streakType;
      let maxStreak = 0;
      let current = 0;
      for (const t of allTypes) {
        if (t === target) {
          current++;
          maxStreak = Math.max(maxStreak, current);
        } else {
          current = 0;
        }
      }
      if (maxStreak >= def.pattern.streakMin) matched = true;
    }

    // Rarity-based
    if ((def.pattern.minRare || def.pattern.minEpic || def.pattern.hasLegendary) && !matched) {
      const rareCount = cards.filter((c) => c.rarity === "rare" || c.rarity === "epic" || c.rarity === "legendary").length;
      const epicCount = cards.filter((c) => c.rarity === "epic" || c.rarity === "legendary").length;
      const hasLeg = cards.some((c) => c.rarity === "legendary");

      if (def.pattern.minRare && rareCount >= def.pattern.minRare) {
        // Epic moment also checks for streak
        if (def.pattern.streakMin) {
          // Check if there's a same-type streak of the right length
          let maxStreak2 = 0;
          let curr2 = 0;
          let lastType2 = "";
          for (const t of allTypes) {
            if (t === lastType2 && t !== "rest") {
              curr2++;
              maxStreak2 = Math.max(maxStreak2, curr2);
            } else {
              curr2 = 1;
              lastType2 = t;
            }
          }
          if (maxStreak2 >= def.pattern.streakMin && epicCount >= def.pattern.minEpic!) {
            matched = true;
          }
        } else {
          matched = true;
        }
      }
      if (def.pattern.minEpic && epicCount >= def.pattern.minEpic && !def.pattern.streakMin) {
        matched = true;
      }
      if (def.pattern.hasLegendary && hasLeg) {
        matched = true;
      }
    }

    // All types present
    if (def.pattern.allTypes && !matched) {
      const typeSet = new Set(allTypes);
      if (typeSet.size >= 5) matched = true;
    }

    // Rest between two specific-tag cards (positional)
    if (def.pattern.restBetween && !matched) {
      const tag = def.pattern.restBetween;
      for (let i = 1; i < slots.length - 1; i++) {
        if (slots[i]?.type === "rest" && slots[i - 1]?.tags.includes(tag) && slots[i + 1]?.tags.includes(tag)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      triggered.add(def.id);
      results.push({
        id: def.id,
        label: def.label,
        description: def.description,
        icon: def.icon,
        statEffects: def.statEffects,
        climateEffects: def.climateEffects,
      });
    }
  }

  return results;
}

/** Find "potential" combos — combos that would trigger if the player filled their last empty slot with a matching card */
export function findPotentialCombos(
  slots: (ActivityDef | null)[],
  hand: ActivityDef[],
): { combo: ComboDef; missingCard: ActivityDef | null; needsTag: string | null }[] {
  const emptySlots = slots.reduce<number[]>((acc, s, i) => (s === null ? [...acc, i] : acc), []);
  if (emptySlots.length === 0) return [];

  const results: { combo: ComboDef; missingCard: ActivityDef | null; needsTag: string | null }[] = [];

  for (const def of COMBO_DEFS) {
    // Check if already complete
    const testSlots = [...slots];
    // Try each hand card in each empty slot
    let foundInHand = false;
    let bestCard: ActivityDef | null = null;
    let bestTag: string | null = null;

    for (const emptyIdx of emptySlots) {
      for (const card of hand) {
        testSlots[emptyIdx] = card;
        const detected = detectCombos(testSlots);
        if (detected.some((d) => d.id === def.id)) {
          foundInHand = true;
          bestCard = card;
          break;
        }
        testSlots[emptyIdx] = null;
      }
      if (foundInHand) break;
    }

    if (!foundInHand) {
      // Determine what tag is missing
      if (def.pattern.requireTags) {
        const allTags = testSlots.flatMap((s) => s?.tags ?? []);
        const tagSet = new Set(allTags);
        for (const t of def.pattern.requireTags) {
          if (!tagSet.has(t)) {
            bestTag = t;
            break;
          }
        }
      }
      if (def.pattern.requireTagCount) {
        const count = testSlots.filter((s) => s?.tags.some((t) => def.pattern.requireTagCount!.tags.includes(t))).length;
        if (count === def.pattern.requireTagCount.min - 1) {
          bestTag = def.pattern.requireTagCount.tags[0];
        }
      }
      if (def.pattern.allTypes) {
        const typeSet = new Set(testSlots.filter(Boolean).map((s) => s!.type));
        if (typeSet.size === 4) {
          const all = ["study", "social", "work", "rest", "volunteer"];
          for (const t of all) {
            if (!typeSet.has(t as ActivityType)) {
              bestTag = t;
              break;
            }
          }
        }
      }

      if (bestTag || bestCard) {
        results.push({ combo: def, missingCard: bestCard, needsTag: bestTag });
      }
    }
  }

  return results;
}
