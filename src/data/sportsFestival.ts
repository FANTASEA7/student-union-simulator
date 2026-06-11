// src/data/sportsFestival.ts
import { SportsGameType } from "../types/game";

export interface BoothDef {
  id: SportsGameType;
  name: string;
  icon: string;
  x: number;
  y: number;
  description: string;
}

export const BOOTHS: BoothDef[] = [
  { id: "archery", name: "射箭", icon: "🏹", x: 400, y: 80, description: "瞄准靶心，一击必中！" },
  { id: "golf", name: "迷你高尔夫", icon: "⛳", x: 680, y: 250, description: "控制力度，一杆进洞！" },
  { id: "tictactoe", name: "井字棋", icon: "❌", x: 400, y: 420, description: "三子连珠，智胜AI！" },
  { id: "gomoku", name: "五子棋", icon: "♟️", x: 80, y: 250, description: "五子连珠，棋盘博弈！" },
  { id: "running", name: "百米冲刺", icon: "🏃", x: 400, y: 250, description: "交替按键，极速狂奔！" },
];

export const CG_DATA: Record<SportsGameType, { title: string; scene: string; stampText: string }> = {
  archery: {
    title: "🏹 射箭 · 百步穿杨",
    scene: "你屏息凝神，弓弦紧绷——\n嗖！箭矢划破长空，正中靶心！\n场边响起一片掌声。",
    stampText: "射箭达人",
  },
  golf: {
    title: "⛳ 迷你高尔夫 · 一杆进洞",
    scene: "你轻轻挥杆，小白球沿着草坪\n缓缓滚动……精准落洞！\n完美的一击！",
    stampText: "高尔夫之星",
  },
  tictactoe: {
    title: "❌ 井字棋 · 智慧对决",
    scene: "你沉着应对AI的每一步，\n三子连成一线！\n智慧的火花在棋盘上绽放。",
    stampText: "棋艺精湛",
  },
  gomoku: {
    title: "♟️ 五子棋 · 黑白博弈",
    scene: "黑子白子在木纹棋盘上交错落下，\n你冷静思考，步步为营——\n五子连珠，胜负已分！",
    stampText: "五子连珠",
  },
  running: {
    title: "🏃 百米冲刺 · 风驰电掣",
    scene: "你双臂猛摆，双腿如飞，\n在跑道上划出一道闪电！\n冲刺吧，少年！",
    stampText: "飞毛腿",
  },
};

export const PRIZE_DATA = {
  lotion: {
    itemId: "oulaya_lotion",
    name: "藕濑雅乳液",
    icon: "🧴",
    description: "高端护肤乳液，送给NPC好感+30，对方会害羞地感谢你。",
    category: "gift" as const,
    rarity: "legendary" as const,
    effects: { affinityBonus: 30, description: "好感+30，NPC会害羞" },
  },
  mystery: {
    itemId: "durex_mystery",
    name: "肚雷斯",
    icon: "🎁",
    description: "？？？\n神秘物品，不可赠送。\n获得恋爱关系后会自动消失……",
    category: "special" as const,
    rarity: "legendary" as const,
    effects: { description: "？？？" },
  },
};
