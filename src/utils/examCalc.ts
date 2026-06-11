// src/utils/examCalc.ts
import { Stats, ExamRival, ExamRanking } from "../types/game";
import { RIVALS } from "../data/examData";

export function calculateScore(stats: Stats, cet4Passed: boolean): number {
  let score = stats.academics * 0.4 + stats.organization * 0.2
    + stats.charisma * 0.15 + stats.connections * 0.15 + stats.budget * 0.1;
  if (cet4Passed) score += 50;
  score += Math.min(stats.volunteerHours / 10, 30);
  return Math.round(score);
}

export function calculateRivalScore(rival: ExamRival, week: number): number {
  const grownStats: Stats = { ...rival.baseStats };
  const growth = Math.floor(week * rival.growthRate);
  const keys: (keyof Stats)[] = ["academics", "organization", "connections", "charisma"];
  for (const key of keys) {
    if (typeof grownStats[key] === "number") {
      (grownStats as any)[key] = Math.min(100, (grownStats[key] as number) + Math.floor(growth * (0.3 + Math.random() * 0.4)));
    }
  }
  return calculateScore(grownStats as Stats, Math.random() > 0.3);
}

export function generateRanking(
  playerStats: Stats,
  playerName: string,
  week: number,
  semester: number,
  cet4Passed: boolean
): ExamRanking {
  const playerScore = calculateScore(playerStats, cet4Passed);

  const entries = RIVALS.map((rival) => ({
    rivalId: rival.id,
    name: rival.name,
    score: calculateRivalScore(rival, week),
  }));

  entries.push({ rivalId: "", name: playerName, score: playerScore });
  entries.sort((a, b) => b.score - a.score);

  const playerRank = entries.findIndex((e) => e.rivalId === "") + 1;

  const evaluations: Record<number, string> = {
    1: "全院之光！你是所有人的榜样。",
    2: "优秀骨干，继续保持！",
    3: "表现出色，潜力无限。",
    4: "中规中矩，还需努力。",
    5: "排名靠后，该加把劲了。",
    6: "垫底警告！再这样下去部长要找你谈话了。",
  };

  return {
    semester,
    rankings: entries.map((e) => ({
      rivalId: e.rivalId || undefined,
      name: e.name,
      score: e.score,
      breakdown: [],
    })),
    playerRank,
    playerScore,
    evaluation: evaluations[playerRank] ?? "还行吧。",
    postExamEvents: [],
  };
}
