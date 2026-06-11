// src/utils/npcGenerator.ts
import { LoveNPC } from "../types/game";
import { getFixedNPCs } from "../data/fixedNPCs";

/** 返回9个固定NPC（替代随机生成） */
export function generateNPCs(count: number): LoveNPC[] {
  // 忽略 count 参数，始终返回全部9个固定NPC
  return getFixedNPCs();
}
