// src/data/shopItems.ts
import { ShopItem, CardRarity } from "../types/game";

export const SHOP_ITEMS: ShopItem[] = [
  // ===== 消耗品 — 恢复精力/减压 =====
  {
    id: "energy_drink",
    name: "能量饮料",
    icon: "🥤",
    description: "一口气喝完，精力充沛！恢复30点精力",
    category: "consumable",
    rarity: "common",
    price: 29,
    effects: { energyRestore: 30, description: "精力+30" },
  },
  {
    id: "coffee",
    name: "现磨咖啡",
    icon: "☕",
    description: "南苑特调，醇香提神。恢复20点精力，抗压+3",
    category: "consumable",
    rarity: "common",
    price: 23,
    effects: { energyRestore: 20, stressRestore: -3, description: "精力+20, 抗压+3" },
  },
  {
    id: "instant_noodle",
    name: "泡面套餐",
    icon: "🍜",
    description: "深夜必备。恢复15点精力",
    category: "consumable",
    rarity: "common",
    price: 14,
    effects: { energyRestore: 15, description: "精力+15" },
  },
  {
    id: "premium_energy",
    name: "红牛Pro",
    icon: "🔋",
    description: "进口能量饮料，效果拔群！恢复50点精力",
    category: "consumable",
    rarity: "rare",
    price: 58,
    effects: { energyRestore: 50, description: "精力+50" },
  },
  {
    id: "herbal_tea",
    name: "养生花茶",
    icon: "🍵",
    description: "舒缓身心，减压神器。抗压+8，精力+10",
    category: "consumable",
    rarity: "rare",
    price: 40,
    effects: { energyRestore: 10, stressRestore: -8, description: "精力+10, 抗压+8" },
  },
  {
    id: "full_rest",
    name: "温泉体验券",
    icon: "♨️",
    description: "学校附近温泉的体验券。精力全恢复，抗压+15",
    category: "consumable",
    rarity: "epic",
    price: 115,
    effects: { energyRestore: 100, stressRestore: -15, description: "精力回满, 抗压+15" },
  },

  // ===== 礼物 — 送NPC加好感 =====
  {
    id: "chocolate",
    name: "手工巧克力",
    icon: "🍫",
    description: "甜蜜的心意。送给NPC好感+8",
    category: "gift",
    rarity: "common",
    price: 23,
    effects: { affinityBonus: 8, description: "好感+8" },
  },
  {
    id: "flowers",
    name: "小花束",
    icon: "💐",
    description: "一束鲜花，温暖人心。送给NPC好感+12",
    category: "gift",
    rarity: "common",
    price: 35,
    effects: { affinityBonus: 12, description: "好感+12" },
  },
  {
    id: "book_gift",
    name: "精装笔记本",
    icon: "📓",
    description: "文艺青年的最爱。送给NPC好感+10，学习力+1",
    category: "gift",
    rarity: "rare",
    price: 46,
    effects: { affinityBonus: 10, stat: "academics", delta: 1, description: "好感+10, 学习力+1" },
  },
  {
    id: "perfume",
    name: "小众香水",
    icon: "✨",
    description: "独特的气息，令人难忘。送给NPC好感+20",
    category: "gift",
    rarity: "epic",
    price: 92,
    effects: { affinityBonus: 20, description: "好感+20" },
  },
  {
    id: "concert_ticket",
    name: "演唱会门票",
    icon: "🎫",
    description: "两张连座，一起去看！送给NPC好感+25",
    category: "gift",
    rarity: "legendary",
    price: 173,
    effects: { affinityBonus: 25, description: "好感+25" },
  },

  // ===== 工具 — 属性加成 =====
  {
    id: "study_guide",
    name: "学霸笔记",
    icon: "📖",
    description: "某位学霸的独家笔记。学习力+5",
    category: "tool",
    rarity: "rare",
    price: 52,
    effects: { stat: "academics", delta: 5, description: "学习力+5" },
  },
  {
    id: "networking_guide",
    name: "社交秘籍",
    icon: "🗣️",
    description: "教你如何成为社交达人。人脉+5",
    category: "tool",
    rarity: "rare",
    price: 52,
    effects: { stat: "connections", delta: 5, description: "人脉+5" },
  },
  {
    id: "planner",
    name: "效率手册",
    icon: "📋",
    description: "科学规划每一天。组织力+5",
    category: "tool",
    rarity: "rare",
    price: 52,
    effects: { stat: "organization", delta: 5, description: "组织力+5" },
  },
  {
    id: "makeup_kit",
    name: "形象设计套装",
    icon: "💄",
    description: "提升个人形象。魅力值+5",
    category: "tool",
    rarity: "rare",
    price: 52,
    effects: { stat: "charisma", delta: 5, description: "魅力值+5" },
  },

  // ===== 特殊道具 =====
  {
    id: "lucky_charm",
    name: "幸运符",
    icon: "🍀",
    description: "据说能带来好运。本周事件触发率翻倍",
    category: "special",
    rarity: "epic",
    price: 69,
    effects: { eventLuck: 2, description: "事件触发率×2" },
  },
  {
    id: "golden_ticket",
    name: "金色传说兑换券",
    icon: "🎟️",
    description: "下次排课必定出现一张传奇卡",
    category: "special",
    rarity: "legendary",
    price: 230,
    effects: { eventLuck: 3, description: "下次排课必出传奇卡" },
  },
];

/** 按稀有度权重随机选商品 */
export function generateShopCards(count: number): { id: string; item: ShopItem; flipped: boolean; sold: boolean }[] {
  const rarityWeights: Record<CardRarity, number> = {
    common: 50,
    rare: 30,
    epic: 15,
    legendary: 5,
  };

  const weighted: ShopItem[] = [];
  for (const item of SHOP_ITEMS) {
    const weight = rarityWeights[item.rarity] ?? 10;
    for (let i = 0; i < weight; i++) weighted.push(item);
  }

  const selected: ShopItem[] = [];
  const usedIds = new Set<string>();
  while (selected.length < count && weighted.length > 0) {
    const idx = Math.floor(Math.random() * weighted.length);
    const item = weighted[idx];
    if (!usedIds.has(item.id)) {
      selected.push(item);
      usedIds.add(item.id);
    }
    // Remove all instances of this item to avoid re-pick
    for (let i = weighted.length - 1; i >= 0; i--) {
      if (weighted[i].id === item.id) weighted.splice(i, 1);
    }
  }

  return selected.map((item, i) => ({
    id: `shop_card_${i}`,
    item,
    flipped: true,
    sold: false,
  }));
}
