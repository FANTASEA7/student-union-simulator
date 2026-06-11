// src/data/merchantOffers.ts
import { MerchantOffer } from "../types/game";

const ALL_OFFERS: Omit<MerchantOffer, "sold">[] = [
  {
    id: "merchant_obsidian_ring",
    item: {
      id: "obsidian_ring",
      name: "黑曜石戒指",
      icon: "💍",
      description: "送给NPC好感+45。表白成功率额外+10%（持有时生效）",
      category: "gift",
      rarity: "legendary",
      effects: { affinityBonus: 45, description: "好感+45" },
    },
    costStat: "connections",
    costAmount: 20,
  },
  {
    id: "merchant_energy_crystal",
    item: {
      id: "energy_crystal",
      name: "精力水晶",
      icon: "💎",
      description: "永久提升精力上限+20",
      category: "tool",
      rarity: "legendary",
      effects: { energyRestore: 0, description: "精力上限+20（一次性）" },
    },
    costStat: "organization",
    costAmount: 27,
  },
  {
    id: "merchant_old_camera",
    item: {
      id: "old_camera",
      name: "老式相机",
      icon: "📷",
      description: "胶卷已经停产了，拍出来的照片特别有味道。魅力值+12",
      category: "tool",
      rarity: "epic",
      effects: { stat: "charisma", delta: 12, description: "魅力值+12" },
    },
    costStat: "connections",
    costAmount: 16,
  },
  {
    id: "merchant_mystery_key",
    item: {
      id: "mystery_key",
      name: "神秘钥匙",
      icon: "🗝️",
      description: "一把老钥匙，据说能打开学生会档案室的一个旧柜子。解锁隐藏事件。",
      category: "special",
      rarity: "legendary",
      effects: { description: "解锁隐藏剧情" },
    },
    costStat: "organization",
    costAmount: 32,
  },
  {
    id: "merchant_cupid_arrow",
    item: {
      id: "cupid_arrow",
      name: "丘比特之箭",
      icon: "🏹",
      description: "能让一个人对你好感大增的神秘道具。送给NPC好感+35",
      category: "gift",
      rarity: "epic",
      effects: { affinityBonus: 35, description: "好感+35" },
    },
    costStat: "charisma",
    costAmount: 20,
  },
  {
    id: "merchant_love_letter",
    item: {
      id: "love_letter_kit",
      name: "情书套装",
      icon: "✉️",
      description: "复古信纸+火漆印章+花体字模板。表白成功率额外+8%（持有时生效）",
      category: "special",
      rarity: "epic",
      effects: { description: "表白成功率+8%" },
    },
    costStat: "charisma",
    costAmount: 16,
  },
  {
    id: "merchant_mirror",
    item: {
      id: "vanity_mirror",
      name: "虚荣之镜",
      icon: "🪞",
      description: "照过这面镜子的人都说自己变好看了。魅力值+15",
      category: "tool",
      rarity: "legendary",
      effects: { stat: "charisma", delta: 15, description: "魅力值+15" },
    },
    costStat: "academics",
    costAmount: 25,
  },
  {
    id: "merchant_contacts_book",
    item: {
      id: "contacts_black_book",
      name: "黑皮通讯录",
      icon: "📇",
      description: "某位前辈留下的关系网。人脉+15",
      category: "tool",
      rarity: "legendary",
      effects: { stat: "connections", delta: 15, description: "人脉+15" },
    },
    costStat: "connections",
    costAmount: 25,
  },
  {
    id: "merchant_club_ticket",
    item: {
      id: "club_vip_ticket",
      name: "俱乐部贵宾券",
      icon: "🎫",
      description: "顶级会所的体验券，极致放松。压力-30（使用时有30%概率触发分手事件）",
      category: "special",
      rarity: "legendary",
      effects: { stressRestore: 30, description: "压力-30" },
    },
    costStat: "charisma",
    costAmount: 18,
  },
];

/** Generate 4 random offers for a merchant visit */
export function generateMerchantOffers(): Omit<MerchantOffer, "sold">[] {
  const shuffled = [...ALL_OFFERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).map((o) => ({ ...o, sold: false }));
}
