// src/data/negotiation.ts
// Factory functions for creating NegotiationState
import { NegotiationState, Stats, GamePhase, Department } from "../types/game";

interface NegotiationConfig {
  npcName: string;
  npcEmoji: string;
  npcPersonality: "gentle" | "mischievous" | "sunny" | "shy";
  context: string;
  stakes: { win: string; lose: string };
  onWin: { effects: { stat: keyof Stats; delta: number }[]; flags?: string[] };
  onLose: { effects: { stat: keyof Stats; delta: number }[]; flags?: string[] };
  maxRounds?: number;
  returnTo: GamePhase;
  chairId?: Department;
}

export function createNegotiation(config: NegotiationConfig): NegotiationState {
  return {
    npcName: config.npcName,
    npcEmoji: config.npcEmoji,
    npcPersonality: config.npcPersonality,
    playerScore: 0,
    npcScore: 0,
    round: 1,
    maxRounds: config.maxRounds ?? 3,
    context: config.context,
    stakes: config.stakes,
    onWin: config.onWin,
    onLose: config.onLose,
    returnTo: config.returnTo,
    chairId: config.chairId,
  };
}

/** Supermarket bargaining with 南苑阿姨 */
export function createBargainNegotiation(itemName: string, price: number): NegotiationState {
  const discount = Math.floor(price * 0.3);
  return createNegotiation({
    npcName: "南苑阿姨",
    npcEmoji: "👩‍🍳",
    npcPersonality: "sunny",
    context: `讨价还价: ${itemName} (原价 ¥${price})`,
    stakes: {
      win: `砍价成功！节省 ¥${discount}，实际支付 ¥${price - discount}`,
      lose: `砍价失败…阿姨态度强硬，原价购买 ¥${price}`,
    },
    onWin: {
      effects: [
        { stat: "allowance", delta: 0 },
        { stat: "charisma", delta: 2 },
      ],
      flags: ["bargain_won"],
    },
    onLose: {
      effects: [
        { stat: "charisma", delta: 1 },
        { stat: "stress", delta: -3 },
      ],
    },
    returnTo: "supermarket",
  });
}

/** Chairperson negotiation: convince them to support you */
export function createChairNegotiation(
  chairName: string,
  chairEmoji: string,
  chairId: Department,
  chairPersonality: "gentle" | "mischievous" | "sunny" | "shy",
  returnTo: GamePhase = "chair_relations"
): NegotiationState {
  return createNegotiation({
    npcName: chairName,
    npcEmoji: chairEmoji,
    npcPersonality: chairPersonality,
    context: `说服${chairName}部长支持你的提案`,
    stakes: {
      win: `${chairName}部长被你说服了！好感大幅提升。`,
      lose: `${chairName}部长不为所动，反而觉得你不够格。`,
    },
    onWin: {
      effects: [
        { stat: "connections", delta: 5 },
        { stat: "charisma", delta: 3 },
      ],
    },
    onLose: {
      effects: [
        { stat: "stress", delta: -5 },
        { stat: "connections", delta: -2 },
      ],
    },
    returnTo,
    chairId,
  });
}

/** Event-based negotiation */
export function createEventNegotiation(config: NegotiationConfig): NegotiationState {
  return createNegotiation(config);
}
