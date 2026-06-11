// src/reducer/gameReducer.ts
import { GameState, GameEvent, Stats, Department, MiniGameRating, MiniGameType, MiniGameConfig, ActivityDef, ExamQuestion, ExamResult, ExamRanking, LoveNPC, WeeklySchedule, ActivitySlot, InventoryItem, NPCInteraction, FPDialogueScene, CampusClimate, CampusMood, CampusClimateDelta, MailMessage, NegotiationState, NegotiationCardType, ShopCard, RecruitApplicant, RecruitState, SportsGameType, SportsFestivalState, MerchantState, TradeStat } from "../types/game";
import { getXiangyuConfessScene, getMaidanFeastScene, getZhangyiPressureScene, getElectionEveScene, getHamaPushPresidentScene, getSunianEncounterScene, getDormInspectionLifeScene, getDormInspectionZhangyiScene, getConfessSuccessScene, getConfessFailScene, getStressCrashScene, getStressInsomniaScene, getStressQuarrelScene, getStressForgetScene, getStressBreakupScene, getClubBreakupScene } from "../data/fpScenes";
import { pickWeeklyPoliticsEvents } from "../data/chairPolitics";
import { detectCombos } from "../data/combos";
import { generateShopCards } from "../data/shopItems";
import { generateAllApplicants } from "../data/recruitment";
import { generateMerchantOffers } from "../data/merchantOffers";
import { saveGame } from "../utils/saveLoad";

export type GameAction =
  | { type: "SET_PLAYER_NAME"; name: string }
  | { type: "SET_DEPARTMENT"; department: Department }
  | { type: "SET_PHASE"; phase: GameState["gamePhase"] }
  | { type: "START_INTERVIEW" }
  | { type: "ANSWER_INTERVIEW"; effects: { stat: keyof Stats; delta: number }[] }
  | { type: "SET_STAGE"; stage: GameState["stage"] }
  | { type: "SET_CURRENT_EVENT"; event: GameEvent }
  | { type: "APPLY_CHOICE"; effects: { stat: keyof Stats; delta: number }[]; feedback: string; flags?: string[]; eventId: string; eventTitle: string; meetNpcId?: string }
  | { type: "ADVANCE_WEEK"; weeks?: number }
  | { type: "START_MINIGAME"; miniGameType: MiniGameType; config: MiniGameConfig; volunteerEventId: string }
  | { type: "END_MINIGAME"; rating: MiniGameRating; baseHours: number; bonusEffects: { stat: keyof Stats; delta: number }[]; catchScore?: number }
  | { type: "SET_ENDING" }
  | { type: "LOAD_SAVE"; state: GameState }
  | { type: "SET_SAVE_SLOT"; slot: number }
  | { type: "RESET_GAME" }
  // === v2 新增 ===
  | { type: "SET_ENERGY"; energy: number }
  | { type: "SET_ALLOWANCE"; delta: number }
  | { type: "START_SCHEDULE_PLANNING" }
  | { type: "SET_SCHEDULE_SLOT"; day: number; activity: ActivityDef }
  | { type: "EXECUTE_DAY"; day: number; statChanges: { stat: keyof Stats; delta: number }[] }
  | { type: "FORCE_REST_DAY"; day: number }
  | { type: "FINISH_WEEK"; statChanges: { stat: keyof Stats; delta: number }[] }
  | { type: "START_EXAM"; examId: string; questions: ExamQuestion[] }
  | { type: "ANSWER_EXAM"; questionId: string; selected: number }
  | { type: "FINISH_EXAM"; result: ExamResult }
  | { type: "ADD_RANKING"; ranking: ExamRanking }
  | { type: "GENERATE_NPCS"; npcs: LoveNPC[] }
  | { type: "MEET_NPC"; npcId: string }
  | { type: "UPDATE_AFFINITY"; npcId: string; delta: number }
  | { type: "CONFESS_RESULT"; npcId: string; success: boolean }
  | { type: "SPEND_MONEY"; amount: number; effects: { stat: keyof Stats; delta: number }[]; currency?: "allowance" | "budget" | "volunteerHours" }
  | { type: "UNLOCK_ACHIEVEMENT"; achievementId: string }
  | { type: "APPLY_INHERITANCE"; allocations: { stat?: keyof Stats; points: number }[]; specials: string[] }
  | { type: "START_NGPLUS" }
  | { type: "ADD_ITEM"; item: InventoryItem }
  | { type: "USE_ITEM"; itemId: string }
  | { type: "REMOVE_ITEM"; itemId: string; count: number }
  | { type: "ENTER_SHOP" }
  | { type: "BUY_SHOP_ITEM"; itemId: string; cost: number; name: string; icon: string; category: InventoryItem["category"]; rarity: InventoryItem["rarity"]; effects: InventoryItem["effects"] }
  | { type: "REROLL_SHOP"; cost: number }
  | { type: "EXIT_SHOP" }
  | { type: "NPC_DIALOGUE"; npcId: string; text: string; speaker: "player" | "npc" }
  | { type: "GIVE_GIFT"; npcId: string; itemId: string; affinityGain: number }
  | { type: "NPC_ASK_FAVOR"; npcId: string }
  | { type: "NPC_SHARE_GOSSIP"; npcId: string }
  | { type: "START_FP_DIALOGUE"; scene: FPDialogueScene }
  | { type: "END_FP_DIALOGUE" }
  // === 政治系统 + 数值闭环 ===
  | { type: "SHIFT_CHAIR_OPINION"; chair: Department; delta: number }
  | { type: "CALL_FAVOR"; chair: Department }
  | { type: "INVEST_BUDGET"; amount: number; project: string; effects: { stat: keyof Stats; delta: number }[]; chairEffects: { chair: Department; delta: number }[] }
  | { type: "CONVERT_VOLUNTEER_HOURS" }
  | { type: "TRADE_CONNECTIONS"; targetStat: keyof Stats }
  | { type: "SHIFT_CLIMATE"; delta: CampusClimateDelta }
  | { type: "APPLY_WEEKLY_COMBOS"; combos: import("../types/game").WeeklyCombo[] }
  | { type: "APPLY_POLITICS_EVENT"; event: import("../types/game").ChairPoliticsEvent }
  | { type: "SEND_MAIL"; mail: MailMessage }
  | { type: "READ_MAIL"; mailId: string }
  | { type: "START_NEGOTIATION"; negotiation: NegotiationState }
  | { type: "PLAY_NEGOTIATION_CARD"; playerCard: NegotiationCardType }
  | { type: "END_NEGOTIATION" }
  | { type: "SET_BARGAIN_TARGET"; target: GameState["bargainTarget"] }
  // === 招干事系统 ===
  | { type: "START_RECRUITMENT"; applicants: RecruitApplicant[] }
  | { type: "SET_RECRUIT_PHASE"; recruitPhase: RecruitState["phase"] }
  | { type: "SELECT_APPLICANT"; index: number }
  | { type: "ASK_QUESTION" }
  | { type: "HIRE_APPLICANT" }
  | { type: "REJECT_APPLICANT" }
  | { type: "FINISH_RECRUITMENT" }
  | { type: "ENTER_SPORTS_FESTIVAL" }
  | { type: "START_SPORTS_FESTIVAL" }
  | { type: "RETURN_SPORTS_WALKING" }
  | { type: "SET_SPORTS_PHASE"; phase: "walking" | "playing" | "cg" | "stamp" | "prize" }
  | { type: "SELECT_SPORTS_GAME"; game: SportsGameType; x: number; y: number }
  | { type: "END_SPORTS_GAME"; game: SportsGameType; rating: MiniGameRating }
  | { type: "CLAIM_SPORTS_PRIZE" }
  // === 神秘商人 ===
  | { type: "ENTER_MERCHANT" }
  | { type: "EXIT_MERCHANT" }
  | { type: "BUY_MERCHANT_OFFER"; offerId: string };

const INITIAL_STATS: Stats = {
  organization: 10,
  connections: 10,
  academics: 20,
  charisma: 10,
  stress: 50,
  budget: 20,
  volunteerHours: 0,
  allowance: 800,  // 新增
};

export const INITIAL_STATE: GameState = {
  playerName: "",
  department: null,
  stage: "staff",
  week: 0,
  semester: 1,
  semesterWeek: 1,
  stats: { ...INITIAL_STATS },
  energy: 100,
  gamePhase: "title",
  eventHistory: [],
  currentEvent: null,
  currentInterviewIndex: 0,
  eventLog: [],
  flags: {},
  activeMiniGame: null,
  miniGameResult: null,
  weeklySchedule: null,
  examRankings: [],
  currentExam: null,
  loveNPCs: [],
  datingNPCId: null,
  loveEventsTriggered: [],
  ngPlus: {
    weekNumber: 1,
    inheritancePoints: 0,
    unlockedAchievements: [],
    previousEndings: [],
    unlockedHiddenContent: [],
  },
  achievements: [],
  currentEnding: null,
  endingStats: null,
  inventory: [],
  mails: [],
  shopState: null,
  npcInteractions: {},
  fpDialogueScene: null,
  negotiation: null,
  bargainTarget: null,
  lastBargainResult: null,
  chairOpinions: {
    life: 0,
    office: 0,
    sports: 0,
    media: 0,
    social: 0,
    psychology: 0,
  },
  chairBonusesUsed: {
    life: false,
    office: false,
    sports: false,
    media: false,
    social: false,
    psychology: false,
  },
  recruitState: null,
  sportsFestival: null,
  merchantState: null,
  meetingNpcId: null,
  saveSlot: 1,
  campusClimate: {
    publicTrust: 50,
    schoolPressure: 30,
    clubSatisfaction: 50,
    publicOpinion: 40,
    dominantMood: "calm",
  },
  lastWeeklyCombos: [],
};

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function clampAllowance(value: number): number {
  return Math.max(0, value);
}

function clampClimate(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function computeDominantMood(climate: CampusClimate): CampusMood {
  const { publicTrust, schoolPressure, clubSatisfaction, publicOpinion } = climate;
  if (publicTrust < 20 || schoolPressure > 80) return "crisis";
  if (publicTrust > 70 && clubSatisfaction > 60) return "thriving";
  if (schoolPressure > 60 || publicTrust < 30) return "tense";
  const highCount = [publicTrust, schoolPressure, clubSatisfaction, publicOpinion].filter((v) => v > 60).length;
  if (highCount >= 2) return "busy";
  return "calm";
}

export function applyClimateDelta(climate: CampusClimate, delta: CampusClimateDelta): CampusClimate {
  const next = {
    publicTrust: clampClimate(climate.publicTrust + (delta.publicTrust ?? 0)),
    schoolPressure: clampClimate(climate.schoolPressure + (delta.schoolPressure ?? 0)),
    clubSatisfaction: clampClimate(climate.clubSatisfaction + (delta.clubSatisfaction ?? 0)),
    publicOpinion: clampClimate(climate.publicOpinion + (delta.publicOpinion ?? 0)),
  };
  return { ...next, dominantMood: computeDominantMood(next) };
}

function applySingleEffect(stats: Stats, stat: keyof Stats, delta: number): Stats {
  const next = { ...stats };
  if (stat === "volunteerHours") {
    next.volunteerHours += delta;
  } else if (stat === "allowance") {
    next.allowance = clampAllowance(stats.allowance + delta);
  } else {
    next[stat] = clampStat(stats[stat] + delta);
  }
  return next;
}

/** Negotiation: rock-paper-scissors resolution */
function resolveRound(player: NegotiationCardType, npc: NegotiationCardType): "win" | "lose" | "draw" {
  if (player === npc) return "draw";
  if (player === "logic" && npc === "pressure") return "win";
  if (player === "pressure" && npc === "charm") return "win";
  if (player === "charm" && npc === "logic") return "win";
  return "lose";
}

/** NPC card selection based on personality */
function pickNpcCard(personality: string, lastPlayerCard?: NegotiationCardType): NegotiationCardType {
  const cards: NegotiationCardType[] = ["logic", "pressure", "charm"];
  const r = Math.random();
  switch (personality) {
    case "gentle":
      // Prefers logic, avoids pressure
      return r < 0.45 ? "logic" : r < 0.75 ? "charm" : "pressure";
    case "mischievous":
      // Unpredictable, often plays what beats the player's last move
      if (lastPlayerCard && r < 0.55) {
        if (lastPlayerCard === "logic") return "charm";
        if (lastPlayerCard === "pressure") return "logic";
        return "pressure";
      }
      return cards[Math.floor(r * 3)];
    case "sunny":
      // Favors charm
      return r < 0.4 ? "charm" : r < 0.7 ? "logic" : "pressure";
    case "shy":
      // Avoids pressure, more logic
      return r < 0.5 ? "logic" : r < 0.8 ? "charm" : "pressure";
    default:
      return cards[Math.floor(r * 3)];
  }
}

function applyEffects(stats: Stats, effects: { stat: keyof Stats; delta: number }[]): Stats {
  const next = { ...stats };
  for (const e of effects) {
    if (e.stat === "volunteerHours") {
      next.volunteerHours += e.delta;
    } else if (e.stat === "allowance") {
      next.allowance = clampAllowance(next.allowance + e.delta);
    } else {
      next[e.stat] = clampStat(next[e.stat] + e.delta);
    }
  }
  return next;
}

/** Stress tier: returns multiplier for activity effectiveness */
export function getStressTier(stress: number): { tier: string; effectiveness: number; label: string; energyCostReduction: number } {
  if (stress <= 15) return { tier: "composed", effectiveness: 1.1, label: "从容不迫", energyCostReduction: 2 };
  if (stress <= 30) return { tier: "relaxed", effectiveness: 1.05, label: "轻松", energyCostReduction: 1 };
  if (stress <= 55) return { tier: "normal", effectiveness: 1.0, label: "正常", energyCostReduction: 0 };
  if (stress <= 78) return { tier: "strained", effectiveness: 0.85, label: "压力过大", energyCostReduction: 0 };
  return { tier: "burnout", effectiveness: 0.55, label: "濒临崩溃", energyCostReduction: 0 };
}

/** Volunteer tier based on total hours */
export function getVolunteerTier(hours: number): { tier: string; title: string; nextAt: number } {
  if (hours >= 200) return { tier: "legend", title: "校园楷模", nextAt: Infinity };
  if (hours >= 100) return { tier: "master", title: "公益达人", nextAt: 200 };
  if (hours >= 50) return { tier: "star", title: "志愿者之星", nextAt: 100 };
  if (hours >= 20) return { tier: "helper", title: "热心人", nextAt: 50 };
  return { tier: "novice", title: "新手", nextAt: 20 };
}

/** Charisma multiplier for social activities */
export function getCharismaMultiplier(charisma: number): number {
  if (charisma >= 70) return 1.6;
  if (charisma >= 40) return 1.3;
  if (charisma >= 15) return 1.0;
  return 0.5;
}

export interface ConnectionsTier {
  tier: string;
  label: string;
  /** Social activity bonus connections per day */
  socialBonus: number;
  /** Cost to trade connections → another stat */
  tradeCost: number;
  tradeGain: number;
}

/** Connections tier: unlocks systems and bonuses */
export function getConnectionsTier(connections: number): ConnectionsTier {
  if (connections >= 90) return { tier: "celebrity", label: "一呼百应", socialBonus: 3, tradeCost: 3, tradeGain: 7 };
  if (connections >= 70) return { tier: "influential", label: "校园风云", socialBonus: 2, tradeCost: 5, tradeGain: 6 };
  if (connections >= 40) return { tier: "connected", label: "人脉广泛", socialBonus: 1, tradeCost: 5, tradeGain: 5 };
  if (connections >= 15) return { tier: "acquainted", label: "略有耳闻", socialBonus: 0, tradeCost: 10, tradeGain: 5 };
  return { tier: "unknown", label: "默默无闻", socialBonus: 0, tradeCost: 0, tradeGain: 0 };
}

function checkPromotion(stats: Stats, stage: GameState["stage"], flags: Record<string, boolean>, chairOpinions: Record<string, number>): boolean {
  // 至少2位部长好感度 >= 0
  const supportiveChairs = Object.values(chairOpinions).filter((o) => o >= 0).length;
  if (supportiveChairs < 2) return false;

  if (stage === "staff") {
    return stats.organization >= 40 && stats.charisma >= 30 && stats.volunteerHours >= 20;
  }
  if (stage === "minister") {
    return (
      stats.organization >= 65 &&
      stats.connections >= 50 &&
      stats.charisma >= 50 &&
      stats.volunteerHours >= 50 &&
      flags["election_won"]
    );
  }
  return false;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PLAYER_NAME":
      return { ...state, playerName: action.name };

    case "SET_DEPARTMENT": {
      const deptOpinions = { ...state.chairOpinions };
      deptOpinions[action.department] = 20;
      return { ...state, department: action.department, chairOpinions: deptOpinions };
    }

    case "SET_PHASE":
      return { ...state, gamePhase: action.phase };

    case "SET_SAVE_SLOT":
      return { ...state, saveSlot: action.slot };

    case "START_INTERVIEW":
      return { ...state, gamePhase: "interview", currentInterviewIndex: 0 };

    case "ANSWER_INTERVIEW": {
      const newStats = applyEffects(state.stats, action.effects);
      const nextIndex = state.currentInterviewIndex + 1;
      if (nextIndex >= 2) {
        return {
          ...state,
          stats: newStats,
          gamePhase: "badge_cg",
          currentInterviewIndex: 0,
        };
      }
      return { ...state, stats: newStats, currentInterviewIndex: nextIndex };
    }

    case "SET_STAGE":
      return { ...state, stage: action.stage };

    case "SET_CURRENT_EVENT":
      return { ...state, currentEvent: action.event };

    case "APPLY_CHOICE": {
      const newStats = applyEffects(state.stats, action.effects);
      const newFlags = { ...state.flags };
      if (action.flags) {
        for (const f of action.flags) newFlags[f] = true;
      }
      const newHistory = [...state.eventHistory, action.eventId];
      const newLog = [
        ...state.eventLog,
        { week: state.week, title: action.eventTitle, result: action.feedback },
      ];
      // Defer promotion to the end of semester (week 16/32)
      const eligible = checkPromotion(newStats, state.stage, newFlags, state.chairOpinions);
      if (eligible) newFlags["promotion_ready"] = true;

      // 结识新NPC → 跳CG
      if (action.meetNpcId) {
        const meetNpcs = state.loveNPCs.map((npc) =>
          npc.id === action.meetNpcId ? { ...npc, met: true, status: "friend" as const, affinity: 5 } : npc
        );
        const specialNpcFlags: Record<string, string> = {
          xiangyu: "met_xiangyu", taozi: "met_taozi", zhangyi: "met_zhangyi",
          maidan_ge: "met_maidan", sunian: "met_sunian",
        };
        const flagKey = specialNpcFlags[action.meetNpcId!];
        if (flagKey) newFlags[flagKey] = true;
        return {
          ...state,
          stats: newStats,
          flags: newFlags,
          eventHistory: newHistory,
          eventLog: newLog,
          currentEvent: null,
          loveNPCs: meetNpcs,
          gamePhase: "meet_npc_cg",
          meetingNpcId: action.meetNpcId,
        };
      }
      return {
        ...state,
        stats: newStats,
        flags: newFlags,
        eventHistory: newHistory,
        eventLog: newLog,
        currentEvent: null,
        gamePhase: "game",
      };
    }

    case "ADVANCE_WEEK": {
      const newWeek = state.week + (action.weeks ?? 1);
      const newSemester = Math.floor(newWeek / 16) + 1;
      const newSemesterWeek = newWeek === 0 ? 1 : ((newWeek - 1) % 16) + 1;
      // Trigger promotion meeting at week 15 of each semester
      const isPromotionWeek = newWeek % 16 === 14;
      const shouldTriggerPromotion =
        isPromotionWeek &&
        state.flags["promotion_ready"] &&
        state.stage !== "president";
      return {
        ...state,
        week: newWeek,
        semester: newSemester,
        semesterWeek: newSemesterWeek,
        gamePhase: shouldTriggerPromotion ? "promotion_meeting" : state.gamePhase,
        flags: shouldTriggerPromotion
          ? { ...state.flags, promotion_ready: false }
          : state.flags,
      };
    }

    case "START_MINIGAME":
      return {
        ...state,
        gamePhase: "minigame",
        activeMiniGame: {
          type: action.miniGameType,
          config: action.config,
          volunteerEventId: action.volunteerEventId,
        },
      };

    case "END_MINIGAME": {
      const ratingMultiplier = action.rating === "S" ? 1.0 : action.rating === "A" ? 0.7 : 0.4;
      const earnedHours = Math.round(action.baseHours * ratingMultiplier);
      const allEffects = [
        ...action.bonusEffects,
        { stat: "volunteerHours" as keyof Stats, delta: earnedHours },
      ];
      const allowanceBonus = (action.catchScore ?? 0) * 10;
      if (allowanceBonus > 0) {
        allEffects.push({ stat: "allowance" as keyof Stats, delta: allowanceBonus });
      }
      const newStats = applyEffects(state.stats, allEffects);
      // 如果玩家正在排课执行中，小游戏结束后回到执行流程
      // 但如果当前天已全部完成（最后一天的志愿小游戏），应进入周末
      const allDaysDone = state.weeklySchedule && state.weeklySchedule.currentDay >= 5;
      const returnPhase = allDaysDone ? "weekend_spending" :
                          state.weeklySchedule ? "schedule_executing" : "game";
      return {
        ...state,
        stats: newStats,
        gamePhase: returnPhase,
        activeMiniGame: null,
        miniGameResult: null,
        eventHistory: [...state.eventHistory, ...(state.activeMiniGame ? [state.activeMiniGame.volunteerEventId] : [])],
        eventLog: [
          ...state.eventLog,
          {
            week: state.week,
            title: `志愿服务 (${action.rating}级)`,
            result: allowanceBonus > 0
              ? `志愿时长 +${earnedHours}h，生活费 +${allowanceBonus}元 (接住${action.catchScore}颗星)`
              : `志愿时长 +${earnedHours}h`,
          },
        ],
      };
    }

    case "SET_ENDING":
      return { ...state, gamePhase: "ending", endingStats: { ...state.stats } };

    case "LOAD_SAVE":
      return { ...action.state };

    case "RESET_GAME":
      return { ...INITIAL_STATE };

    case "SET_ENERGY":
      return { ...state, energy: Math.max(0, Math.min(100, action.energy)) };

    case "SET_ALLOWANCE":
      return { ...state, stats: { ...state.stats, allowance: state.stats.allowance + action.delta } };

    case "START_SCHEDULE_PLANNING": {
      const emptySlots: ActivitySlot[] = Array.from({ length: 5 }, () => ({
        activity: null,
        status: "pending" as const,
      }));
      return {
        ...state,
        gamePhase: "schedule_planning",
        energy: 100,
        weeklySchedule: {
          week: state.week,
          slots: emptySlots as [ActivitySlot, ActivitySlot, ActivitySlot, ActivitySlot, ActivitySlot],
          forecast: [],
          state: "planning",
          currentDay: 0,
        },
      };
    }

    case "SET_SCHEDULE_SLOT": {
      if (!state.weeklySchedule) return state;
      const newSlots = [...state.weeklySchedule.slots] as WeeklySchedule["slots"];
      newSlots[action.day] = { activity: action.activity, status: "pending" };
      return {
        ...state,
        weeklySchedule: { ...state.weeklySchedule, slots: newSlots },
      };
    }

    case "EXECUTE_DAY": {
      if (!state.weeklySchedule) return state;
      const execSlots = [...state.weeklySchedule.slots] as WeeklySchedule["slots"];
      const slot = execSlots[action.day];
      execSlots[action.day] = {
        ...slot,
        status: "complete",
        result: { statChanges: action.statChanges },
      };
      const newStats = applyEffects(state.stats, action.statChanges);
      const nextDay = action.day + 1;
      const isWeekend = nextDay >= 5;

      // Daily climate shift based on activity type
      let dayClimateDelta: CampusClimateDelta = {};
      if (slot.activity) {
        switch (slot.activity.type) {
          case "study": dayClimateDelta = { publicOpinion: 1, schoolPressure: -1 }; break;
          case "social": dayClimateDelta = { clubSatisfaction: 1 }; break;
          case "work": dayClimateDelta = { publicTrust: 2, schoolPressure: 1 }; break;
          case "volunteer": dayClimateDelta = { publicTrust: 3, publicOpinion: 2 }; break;
        }
      }
      const newClimate = applyClimateDelta(state.campusClimate, dayClimateDelta);

      // 压力等级影响：低压时精力消耗减少
      const stressTier = getStressTier(newStats.stress);
      const effectiveCost = Math.max(0, (slot.activity?.energyCost ?? 0) - stressTier.energyCostReduction);

      return {
        ...state,
        stats: newStats,
        energy: Math.min(100, Math.max(0, state.energy - effectiveCost)),
        campusClimate: newClimate,
        weeklySchedule: {
          ...state.weeklySchedule,
          slots: execSlots,
          currentDay: nextDay,
          state: isWeekend ? "weekend" : "executing",
        },
        gamePhase: isWeekend ? "weekend_spending" : "schedule_executing",
      };
    }

    case "FORCE_REST_DAY": {
      if (!state.weeklySchedule) return state;
      const restSlots = [...state.weeklySchedule.slots] as WeeklySchedule["slots"];
      restSlots[action.day] = { activity: null, status: "forced_rest" };
      return {
        ...state,
        weeklySchedule: { ...state.weeklySchedule, slots: restSlots },
      };
    }

    case "FINISH_WEEK": {
      const finishStats = applyEffects(state.stats, action.statChanges);
      const doSave = (ns: GameState) => { saveGame(ns, ns.saveSlot); return ns; };
      // Stress decay: drift toward 50 by 5 each week
      let decayedStress = finishStats.stress;
      if (finishStats.stress > 50) {
        decayedStress = Math.max(50, finishStats.stress - 5);
      } else if (finishStats.stress < 50) {
        decayedStress = Math.min(50, finishStats.stress + 5);
      }
      const decayedStats = { ...finishStats, stress: decayedStress };
      const nextWeek = state.week + 1;
      const nextSemesterWeek = state.semesterWeek >= 16 ? 1 : state.semesterWeek + 1;
      const nextSemester = state.semesterWeek >= 16 ? state.semester + 1 : state.semester;
      const isSemesterEnd = state.semesterWeek >= 16;
      // Burnout flag
      const burnoutFlag = decayedStats.stress > 75 ? { burnout_warning: true } : {};
      // Allowance payout: every 4 weeks
      const allowancePayout = state.semesterWeek % 4 === 0 ? 800 : 0;
      const withAllowance = allowancePayout
        ? { ...decayedStats, allowance: decayedStats.allowance + allowancePayout }
        : decayedStats;
      // Scholarship: academics >= 70 at semester end
      const scholarshipBonus = isSemesterEnd && withAllowance.academics >= 70;
      const finalStats = scholarshipBonus
        ? { ...withAllowance, allowance: withAllowance.allowance + 300, charisma: clampStat(withAllowance.charisma + 5) }
        : withAllowance;
      const weekFlags = { ...state.flags, ...burnoutFlag };
      if (scholarshipBonus) weekFlags["scholarship_awarded"] = true;
      // Semester end: reset chair bonus usage
      const resetBonuses = isSemesterEnd
        ? { life: false, office: false, sports: false, media: false, social: false, psychology: false } as Record<string, boolean>
        : state.chairBonusesUsed;

      // Fire political events (1-2 per week)
      const politicsEvents = pickWeeklyPoliticsEvents(state.semesterWeek, weekFlags, state.eventHistory);
      let politicsStats = finalStats;
      let politicsOpinions = { ...state.chairOpinions };
      let weekClimate = applyClimateDelta(state.campusClimate, decayedStats.stress > 75 ? { publicTrust: -5 } : {});
      for (const pe of politicsEvents) {
        politicsStats = applyEffects(politicsStats, pe.statEffects);
        for (const ce of pe.chairEffects) {
          politicsOpinions[ce.chair] = Math.max(-100, Math.min(100, (politicsOpinions[ce.chair] ?? 0) + ce.delta));
        }
        if (pe.climateEffects) {
          weekClimate = applyClimateDelta(weekClimate, pe.climateEffects);
        }
      }

      // Climate-based forced events
      const climateFlags = { ...weekFlags };
      if (weekClimate.schoolPressure >= 70 && Math.random() < 0.3) {
        politicsStats = applyEffects(politicsStats, [{ stat: "budget", delta: -15 }]);
        climateFlags["budget_audited"] = true;
      }
      if (weekClimate.publicOpinion >= 80 && Math.random() < 0.4) {
        climateFlags["media_spotlight"] = true;
      }
      if (weekClimate.publicTrust <= 20 && Math.random() < 0.5) {
        climateFlags["crisis_meeting"] = true;
      }
      if (weekClimate.clubSatisfaction <= 20 && Math.random() < 0.4) {
        climateFlags["club_complaint"] = true;
      }

      // Detect weekly combos from the completed schedule
      const weekComboSlots = state.weeklySchedule?.slots.map((s) => s.activity) ?? [null, null, null, null, null];
      const weekCombos = detectCombos(weekComboSlots as (import("../types/game").ActivityDef | null)[]);
      let comboClimateDelta: CampusClimateDelta = {};
      for (const combo of weekCombos) {
        politicsStats = applyEffects(politicsStats, combo.statEffects as { stat: keyof Stats; delta: number }[]);
        if (combo.climateEffects) {
          comboClimateDelta = {
            publicTrust: (comboClimateDelta.publicTrust ?? 0) + (combo.climateEffects.publicTrust ?? 0),
            schoolPressure: (comboClimateDelta.schoolPressure ?? 0) + (combo.climateEffects.schoolPressure ?? 0),
            clubSatisfaction: (comboClimateDelta.clubSatisfaction ?? 0) + (combo.climateEffects.clubSatisfaction ?? 0),
            publicOpinion: (comboClimateDelta.publicOpinion ?? 0) + (combo.climateEffects.publicOpinion ?? 0),
          };
        }
      }
      weekClimate = applyClimateDelta(weekClimate, comboClimateDelta);

      // Week 3: 买单哥食堂请客
      if (state.semesterWeek === 3 && !state.flags["maidan_feast"]) {
        const maidanScene = getMaidanFeastScene();
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: maidanScene,
          flags: { ...weekFlags, ...climateFlags, met_maidan: true },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }
      // Week 5: 查寝 — 生活部跟烟头学，否则被张艺突击
      if (state.semesterWeek === 5 && !state.flags["dorm_inspection_done"]) {
        const dormScene = state.department === "life"
          ? getDormInspectionLifeScene()
          : getDormInspectionZhangyiScene();
        const dormFlags: Record<string, boolean> = { ...weekFlags, ...climateFlags };
        if (state.department !== "life") dormFlags["met_zhangyi"] = true;
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: dormScene,
          flags: dormFlags,
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }
      // Week 7: 香芋→桃子表白失败剧情
      if (state.semesterWeek === 7 && !state.flags["xiangyu_confessed"]) {
        const scene = getXiangyuConfessScene();
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: scene,
          flags: { ...weekFlags, ...climateFlags, met_xiangyu: true, met_taozi: true },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }
      // Week 8: 樱花树下邂逅苏念
      if (state.semesterWeek === 8 && !state.flags["sunian_encounter_done"]) {
        const sunianScene = getSunianEncounterScene();
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: sunianScene,
          flags: { ...weekFlags, ...climateFlags },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }
      // Week 9: 田径运动会
      if (state.semesterWeek === 9 && !state.flags["sports_festival_done"]) {
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "sports_festival_walking",
          sportsFestival: {
            phase: "walking",
            playerX: 400,
            playerY: 350,
            currentGame: null,
            completedGames: [],
            gameRatings: {},
            lastGameRating: null,
            prizeClaimed: false,
          },
          flags: weekFlags,
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }
      // Week 10: 张艺胁迫学弟
      if (state.semesterWeek === 10 && !state.flags["zhangyi_pressure_seen"]) {
        const zhangyiScene = getZhangyiPressureScene();
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: zhangyiScene,
          flags: { ...weekFlags, ...climateFlags, met_zhangyi: true },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }
      // Week 13: 竞选前夜
      if (state.semesterWeek === 13 && !state.flags["election_eve_seen"] && state.stage === "minister") {
        const electionScene = getElectionEveScene();
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: electionScene,
          flags: { ...weekFlags, ...climateFlags },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }
      // Week 30: 哈马劝进主席CG
      if (state.week === 29 && !state.flags["hama_push_president_seen"] && state.stage === "minister") {
        const hamaScene = getHamaPushPresidentScene();
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: hamaScene,
          flags: { ...weekFlags, ...climateFlags },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }
      // Week 18: 招干事 — 晋升部长后第18周触发
      if (state.semesterWeek === 18 && state.stage === "minister" && !state.flags["recruitment_done"]) {
        const applicants = generateAllApplicants();
        return doSave({
          ...state,
          stats: politicsStats,
          gamePhase: "recruitment_briefing",
          recruitState: {
            applicants,
            currentIndex: 0,
            phase: "briefing",
            hiredCount: 0,
            maxHires: 5,
          },
          flags: { ...weekFlags, ...climateFlags },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: Math.max(0, state.energy - 20),
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }

      // === 压力系统检查 ===
      const finalStress = politicsStats.stress;

      // 压力 ≥88 且恋爱中：分手
      if (finalStress >= 88 && state.datingNPCId) {
        const datingNpc = state.loveNPCs.find((n) => n.id === state.datingNPCId);
        const breakupScene = getStressBreakupScene({
          id: datingNpc?.id ?? "",
          name: datingNpc?.name ?? "",
          gender: datingNpc?.gender ?? "female",
          personality: datingNpc?.personality,
        });
        const breakupEffects: { stat: keyof Stats; delta: number }[] = [
          { stat: "stress", delta: 15 },
          { stat: "connections", delta: -8 },
          { stat: "charisma", delta: -5 },
        ];
        const breakupStats = applyEffects(politicsStats, breakupEffects);
        const breakupNPCs = state.loveNPCs.map((npc) =>
          npc.id === state.datingNPCId
            ? { ...npc, status: "stranger" as const, affinity: 20 }
            : npc
        );
        return doSave({
          ...state,
          loveNPCs: breakupNPCs,
          stats: breakupStats,
          datingNPCId: null,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: breakupScene,
          flags: { ...weekFlags, ...climateFlags },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }

      // 压力 ≥80：必定触发崩溃
      if (finalStress >= 80) {
        const crashScene = getStressCrashScene();
        const crashEffects = crashScene.onComplete?.effects ?? [];
        const crashStats = applyEffects(politicsStats, crashEffects);
        return doSave({
          ...state,
          stats: crashStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: crashScene,
          flags: { ...weekFlags, ...climateFlags },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }

      // 压力 60–79：40%概率触发随机事件
      if (finalStress >= 60 && Math.random() < 0.4) {
        const scenes = [getStressInsomniaScene, getStressQuarrelScene, getStressForgetScene];
        const pickScene = scenes[Math.floor(Math.random() * scenes.length)]();
        const randEffects = pickScene.onComplete?.effects ?? [];
        const randStats = applyEffects(politicsStats, randEffects);
        return doSave({
          ...state,
          stats: randStats,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: pickScene,
          flags: { ...weekFlags, ...climateFlags },
          chairOpinions: politicsOpinions,
          chairBonusesUsed: resetBonuses,
          campusClimate: weekClimate,
          lastWeeklyCombos: weekCombos,
          weeklySchedule: null,
          energy: 100,
          week: nextWeek,
          semesterWeek: nextSemesterWeek,
          semester: nextSemester,
        });
      }

      return doSave({
        ...state,
        stats: politicsStats,
        gamePhase: isSemesterEnd ? "semester_summary" : "event",
        flags: { ...weekFlags, ...climateFlags },
        chairOpinions: politicsOpinions,
        chairBonusesUsed: resetBonuses,
        campusClimate: weekClimate,
        lastWeeklyCombos: weekCombos,
        weeklySchedule: null,
        energy: 100,
        week: nextWeek,
        semesterWeek: nextSemesterWeek,
        semester: nextSemester,
      });
    }

    case "START_EXAM":
      return {
        ...state,
        gamePhase: "exam",
        currentExam: {
          examId: action.examId,
          questions: action.questions,
          currentIndex: 0,
          answers: [],
          timeRemaining: 900,
        },
      };

    case "ANSWER_EXAM": {
      if (!state.currentExam) return state;
      const existingIdx = state.currentExam.answers.findIndex(
        (a) => a.questionId === action.questionId
      );
      let newAnswers: { questionId: string; selected: number }[];
      if (existingIdx >= 0) {
        newAnswers = state.currentExam.answers.map((a, i) =>
          i === existingIdx ? { questionId: action.questionId, selected: action.selected } : a
        );
        return { ...state, currentExam: { ...state.currentExam, answers: newAnswers } };
      } else {
        newAnswers = [...state.currentExam.answers, { questionId: action.questionId, selected: action.selected }];
        return {
          ...state,
          currentExam: {
            ...state.currentExam,
            currentIndex: state.currentExam.currentIndex + 1,
            answers: newAnswers,
          },
        };
      }
    }

    case "FINISH_EXAM": {
      const examEffects = action.result.passed
        ? [
            { stat: "academics" as keyof Stats, delta: 8 },
            { stat: "charisma" as keyof Stats, delta: 3 },
          ]
        : [
            { stat: "academics" as keyof Stats, delta: -3 },
            { stat: "stress" as keyof Stats, delta: 10 },
          ];
      const examStats = applyEffects(state.stats, examEffects);
      const examFlags = { ...state.flags };
      examFlags[action.result.passed ? "cet4_passed" : "cet4_failed"] = true;
      examFlags["cet4_taken"] = true;
      return {
        ...state,
        stats: examStats,
        flags: examFlags,
        currentExam: null,
        gamePhase: "exam_result",
      };
    }

    case "ADD_RANKING":
      return { ...state, examRankings: [...state.examRankings, action.ranking] };

    case "GENERATE_NPCS":
      return { ...state, loveNPCs: action.npcs };

    case "MEET_NPC": {
      const meetNPCs = state.loveNPCs.map((npc) =>
        npc.id === action.npcId ? { ...npc, met: true, status: "friend" as const, affinity: 5 } : npc
      );
      // 为特殊NPC设置标记用于事件触发
      const specialNpcFlags: Record<string, string> = {
        xiangyu: "met_xiangyu",
        taozi: "met_taozi",
        zhangyi: "met_zhangyi",
        maidan_ge: "met_maidan",
        sunian: "met_sunian",
      };
      const flagKey = specialNpcFlags[action.npcId];
      const newFlags = flagKey ? { ...state.flags, [flagKey]: true } : state.flags;
      return { ...state, loveNPCs: meetNPCs, flags: newFlags };
    }

    case "UPDATE_AFFINITY": {
      const affNPCs = state.loveNPCs.map((npc) =>
        npc.id === action.npcId
          ? {
              ...npc,
              affinity: Math.max(0, Math.min(100, npc.affinity + action.delta)),
              status: npc.affinity + action.delta >= 80 && npc.status === "friend" ? ("close" as const) : npc.status,
            }
          : npc
      );
      return { ...state, loveNPCs: affNPCs };
    }

    case "CONFESS_RESULT": {
      const confNPC = state.loveNPCs.find((n) => n.id === action.npcId);
      const confNPCs = state.loveNPCs.map((npc) => {
        if (npc.id !== action.npcId) return npc;
        if (action.success) return { ...npc, status: "dating" as const, affinity: 100 };
        return { ...npc, status: "rejected" as const, affinity: Math.max(0, npc.affinity - 15) };
      });
      const confStatEffects: { stat: keyof Stats; delta: number }[] = action.success
        ? [{ stat: "charisma", delta: 10 }, { stat: "stress", delta: -15 }]
        : [{ stat: "stress", delta: 10 }];
      const confStats = applyEffects(state.stats, confStatEffects);
      const durexFree = action.success
        ? state.inventory.filter((i) => i.itemId !== "durex_mystery")
        : state.inventory;
      // Generate the confess CG dialogue scene
      const cgScene = confNPC
        ? (action.success
            ? getConfessSuccessScene({ id: confNPC.id, name: confNPC.name, gender: confNPC.gender, personality: confNPC.personality })
            : getConfessFailScene({ id: confNPC.id, name: confNPC.name, gender: confNPC.gender, personality: confNPC.personality }))
        : null;
      return {
        ...state,
        loveNPCs: confNPCs,
        stats: confStats,
        inventory: durexFree,
        datingNPCId: action.success ? action.npcId : state.datingNPCId,
        gamePhase: cgScene ? "first_person_dialogue" : "game",
        fpDialogueScene: cgScene,
      };
    }

    case "SPEND_MONEY": {
      const currency = action.currency ?? "allowance";
      const costEffect: { stat: keyof Stats; delta: number } =
        currency === "budget" ? { stat: "budget", delta: -action.amount } :
        currency === "volunteerHours" ? { stat: "volunteerHours", delta: -action.amount } :
        { stat: "allowance", delta: -action.amount };
      const spendEffects = [costEffect, ...action.effects];
      const spendStats = applyEffects(state.stats, spendEffects);
      return { ...state, stats: spendStats, gamePhase: "game" };
    }

    case "UNLOCK_ACHIEVEMENT":
      return {
        ...state,
        ngPlus: {
          ...state.ngPlus,
          unlockedAchievements: [
            ...state.ngPlus.unlockedAchievements,
            action.achievementId,
          ],
        },
      };

    case "APPLY_INHERITANCE": {
      const inheritStats = { ...state.stats };
      for (const alloc of action.allocations) {
        if (alloc.stat && alloc.stat !== "volunteerHours" && alloc.stat !== "allowance") {
          inheritStats[alloc.stat] = Math.min(100, inheritStats[alloc.stat] + alloc.points * 5);
        }
        if (alloc.stat === "volunteerHours") {
          inheritStats.volunteerHours += alloc.points * 5;
        }
      }
      return {
        ...state,
        stats: inheritStats,
        gamePhase: "name_input",
      };
    }

    case "START_NGPLUS":
      return {
        ...INITIAL_STATE,
        ngPlus: {
          ...state.ngPlus,
          weekNumber: state.ngPlus.weekNumber + 1,
        },
        gamePhase: "name_input",
      };

    // ===== 背包 & 商店 =====
    case "ADD_ITEM": {
      const existing = state.inventory.find((i) => i.itemId === action.item.itemId);
      if (existing) {
        return {
          ...state,
          inventory: state.inventory.map((i) =>
            i.itemId === action.item.itemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, inventory: [...state.inventory, { ...action.item, quantity: 1 }] };
    }

    case "USE_ITEM": {
      const item = state.inventory.find((i) => i.itemId === action.itemId);
      if (!item || item.quantity <= 0) return state;
      const newInventory = item.quantity <= 1
        ? state.inventory.filter((i) => i.itemId !== action.itemId)
        : state.inventory.map((i) => i.itemId === action.itemId ? { ...i, quantity: i.quantity - 1 } : i);

      const effects: { stat: keyof Stats; delta: number }[] = [];
      if (item.effects.energyRestore) {
        effects.push({ stat: "allowance" as keyof Stats, delta: 0 }); // no-op, handled below
      }

      let newEnergy = state.energy;
      if (item.effects.energyRestore) {
        newEnergy = Math.min(100, state.energy + item.effects.energyRestore);
      }

      let newStats = state.stats;
      if (item.effects.stat && item.effects.delta) {
        newStats = applyEffects(state.stats, [{ stat: item.effects.stat, delta: item.effects.delta }]);
      }
      if (item.effects.stressRestore) {
        newStats = applyEffects(newStats, [{ stat: "stress", delta: item.effects.stressRestore }]);
      }

      // 俱乐部门票：30%概率在恋爱状态下触发分手
      if (item.itemId === "club_vip_ticket" && state.datingNPCId && Math.random() < 0.3) {
        const datingNpc = state.loveNPCs.find((n) => n.id === state.datingNPCId);
        const clubBreakupScene = getClubBreakupScene({
          id: datingNpc?.id ?? "",
          name: datingNpc?.name ?? "",
          gender: datingNpc?.gender ?? "female",
          personality: datingNpc?.personality,
        });
        const breakupNPCs = state.loveNPCs.map((npc) =>
          npc.id === state.datingNPCId
            ? { ...npc, status: "stranger" as const, affinity: 15 }
            : npc
        );
        const clubBreakupEffects: { stat: keyof Stats; delta: number }[] = [
          { stat: "charisma", delta: -8 },
          { stat: "connections", delta: -5 },
        ];
        const clubBreakupStats = applyEffects(newStats, clubBreakupEffects);
        return {
          ...state,
          inventory: newInventory,
          energy: newEnergy,
          stats: clubBreakupStats,
          loveNPCs: breakupNPCs,
          datingNPCId: null,
          gamePhase: "first_person_dialogue",
          fpDialogueScene: clubBreakupScene,
        };
      }

      return { ...state, inventory: newInventory, energy: newEnergy, stats: newStats };
    }

    case "REMOVE_ITEM": {
      const remItem = state.inventory.find((i) => i.itemId === action.itemId);
      if (!remItem) return state;
      const newQty = remItem.quantity - action.count;
      return {
        ...state,
        inventory: newQty <= 0
          ? state.inventory.filter((i) => i.itemId !== action.itemId)
          : state.inventory.map((i) => i.itemId === action.itemId ? { ...i, quantity: newQty } : i),
      };
    }

    case "ENTER_SHOP": {
      return {
        ...state,
        gamePhase: "supermarket",
        shopState: {
          cards: generateShopCards(4),
          flipsRemaining: 4,
          maxFlips: 4,
          rerollCost: 30,
          bargainedItemIds: [],
          lastBargainWeek: state.semesterWeek,
        },
        lastBargainResult: null,
      };
    }

    case "BUY_SHOP_ITEM": {
      if (state.stats.allowance < action.cost) return state;
      const newStats = applyEffects(state.stats, [{ stat: "allowance", delta: -action.cost }]);
      const newItem: InventoryItem = {
        itemId: action.itemId,
        name: action.name,
        icon: action.icon,
        category: action.category,
        rarity: action.rarity,
        quantity: 1,
        effects: action.effects,
      };
      const existItem = state.inventory.find((i) => i.itemId === newItem.itemId);
      // Mark card as sold in shopState
      const newShopState = state.shopState
        ? {
            ...state.shopState,
            cards: state.shopState.cards.map((c) => c.id === action.itemId ? { ...c, sold: true } : c),
          }
        : null;
      return {
        ...state,
        stats: newStats,
        shopState: newShopState,
        inventory: existItem
          ? state.inventory.map((i) => i.itemId === newItem.itemId ? { ...i, quantity: i.quantity + 1 } : i)
          : [...state.inventory, newItem],
      };
    }

    case "REROLL_SHOP": {
      if (state.stats.allowance < action.cost) return state;
      return {
        ...state,
        stats: applyEffects(state.stats, [{ stat: "allowance", delta: -action.cost }]),
        shopState: {
          ...state.shopState!,
          cards: generateShopCards(4),
          bargainedItemIds: [],
          lastBargainWeek: state.semesterWeek,
        },
        lastBargainResult: null,
      };
    }

    case "EXIT_SHOP": {
      return { ...state, shopState: null, gamePhase: "game" };
    }

    // ===== NPC互动 =====
    case "NPC_DIALOGUE": {
      const npcInter = state.npcInteractions[action.npcId] ?? {
        npcId: action.npcId,
        dialogueHistory: [],
        giftsGiven: [],
        lastInteractionWeek: state.semesterWeek,
      };
      // Count player messages this week (excluding system/npc)
      const thisWeekPlayerMessages = npcInter.dialogueHistory.filter(
        (d) => d.date === state.semesterWeek && d.speaker === "player"
      ).length;
      const overLimit = thisWeekPlayerMessages >= 3;
      const energyCost = (action.speaker === "player" && !overLimit) ? 3 : 0;
      return {
        ...state,
        energy: Math.max(0, state.energy - energyCost),
        npcInteractions: {
          ...state.npcInteractions,
          [action.npcId]: {
            ...npcInter,
            dialogueHistory: [
              ...npcInter.dialogueHistory,
              { date: state.semesterWeek, text: action.text, speaker: action.speaker },
            ],
            lastInteractionWeek: state.semesterWeek,
          },
        },
      };
    }

    case "GIVE_GIFT": {
      const giftInter = state.npcInteractions[action.npcId] ?? {
        npcId: action.npcId,
        dialogueHistory: [],
        giftsGiven: [],
        lastInteractionWeek: state.semesterWeek,
      };
      const giftItem = state.inventory.find((i) => i.itemId === action.itemId);
      // Remove one gift from inventory
      const newInv = giftItem && giftItem.quantity > 1
        ? state.inventory.map((i) => i.itemId === action.itemId ? { ...i, quantity: i.quantity - 1 } : i)
        : state.inventory.filter((i) => i.itemId !== action.itemId);
      // Increase NPC affinity
      const npcs = state.loveNPCs.map((n) =>
        n.id === action.npcId ? { ...n, affinity: Math.min(100, n.affinity + action.affinityGain) } : n
      );
      const isLotionGift = action.itemId === "oulaya_lotion";
      const shyReaction = isLotionGift ? "这……这个是藕濑雅乳液？！你……你怎么知道我想要这个……谢谢你……///" : "谢谢！很喜欢！";
      const lotionFlags = isLotionGift ? { [`oulaya_gifted_to_${action.npcId}`]: true } : {};
      return {
        ...state,
        inventory: newInv,
        loveNPCs: npcs,
        flags: { ...state.flags, ...lotionFlags },
        npcInteractions: {
          ...state.npcInteractions,
          [action.npcId]: {
            ...giftInter,
            dialogueHistory: [
              ...giftInter.dialogueHistory,
              { date: state.semesterWeek, text: shyReaction, speaker: "npc" },
            ],
            giftsGiven: [
              ...giftInter.giftsGiven,
              { itemId: action.itemId, date: state.semesterWeek, reaction: shyReaction },
            ],
            lastInteractionWeek: state.semesterWeek,
          },
        },
      };
    }

    // NPC请教帮忙：根据好感度决定成功率
    case "NPC_ASK_FAVOR": {
      const npc = state.loveNPCs.find((n) => n.id === action.npcId);
      if (!npc) return state;
      const favorInter = state.npcInteractions[action.npcId] ?? {
        npcId: action.npcId,
        dialogueHistory: [],
        giftsGiven: [],
        lastInteractionWeek: 0,
      };
      // 每周限1次
      if (favorInter.dialogueHistory.some(d => d.text === "你能帮我一个忙吗？" && d.date === state.semesterWeek)) {
        return state;
      }
      const successRate = npc.affinity >= 60 ? 1.0 : npc.affinity >= 30 ? 0.6 : 0.3;
      const success = Math.random() < successRate;
      const effects: { stat: keyof Stats; delta: number }[] = success
        ? [{ stat: "stress", delta: -5 }, { stat: "connections", delta: 2 }]
        : [{ stat: "stress", delta: 3 }];
      const newFavorStats = applyEffects(state.stats, effects);
      const newFavorNPCs = state.loveNPCs.map((n) =>
        n.id === action.npcId
          ? { ...n, affinity: Math.max(0, n.affinity + (success ? 0 : -3)) }
          : n
      );
      return {
        ...state,
        stats: newFavorStats,
        loveNPCs: newFavorNPCs,
        npcInteractions: {
          ...state.npcInteractions,
          [action.npcId]: {
            ...favorInter,
            dialogueHistory: [
              ...favorInter.dialogueHistory,
              { date: state.semesterWeek, text: success ? "没问题，交给我吧！" : "抱歉，这次帮不了你...", speaker: "npc" },
            ],
            lastInteractionWeek: state.semesterWeek,
          },
        },
      };
    }

    // NPC分享八卦：根据好感度决定成功率
    case "NPC_SHARE_GOSSIP": {
      const gossipNpc = state.loveNPCs.find((n) => n.id === action.npcId);
      if (!gossipNpc) return state;
      const gossipInter = state.npcInteractions[action.npcId] ?? {
        npcId: action.npcId,
        dialogueHistory: [],
        giftsGiven: [],
        lastInteractionWeek: 0,
      };
      // 每周限1次
      if (gossipInter.dialogueHistory.some(d => d.text.includes("八卦") && d.date === state.semesterWeek)) {
        return state;
      }
      const gSuccessRate = gossipNpc.affinity >= 60 ? 1.0 : gossipNpc.affinity >= 30 ? 0.6 : 0.3;
      const gSuccess = Math.random() < gSuccessRate;
      const gEffects: { stat: keyof Stats; delta: number }[] = gSuccess
        ? [{ stat: "connections", delta: 3 }, { stat: "charisma", delta: 1 }]
        : [];
      const newGossipStats = applyEffects(state.stats, gEffects);
      const newGossipNPCs = state.loveNPCs.map((n) =>
        n.id === action.npcId
          ? { ...n, affinity: Math.max(0, n.affinity + (gSuccess ? 3 : -5)) }
          : n
      );
      return {
        ...state,
        stats: newGossipStats,
        loveNPCs: newGossipNPCs,
        npcInteractions: {
          ...state.npcInteractions,
          [action.npcId]: {
            ...gossipInter,
            dialogueHistory: [
              ...gossipInter.dialogueHistory,
              { date: state.semesterWeek, text: gSuccess ? "哈哈，这个八卦太劲爆了！" : "这种事还是别乱传了...", speaker: "npc" },
            ],
            lastInteractionWeek: state.semesterWeek,
          },
        },
      };
    }

    case "START_FP_DIALOGUE":
      return {
        ...state,
        gamePhase: "first_person_dialogue",
        fpDialogueScene: action.scene,
      };

    case "END_FP_DIALOGUE":
      return {
        ...state,
        gamePhase: state.gamePhase === "first_person_dialogue" ? "game" : state.gamePhase,
        fpDialogueScene: null,
      };

    // ===== 政治系统 + 数值闭环 =====
    case "SHIFT_CHAIR_OPINION": {
      const newOpinions = { ...state.chairOpinions };
      newOpinions[action.chair] = Math.max(-100, Math.min(100, (newOpinions[action.chair] ?? 0) + action.delta));
      return { ...state, chairOpinions: newOpinions };
    }

    case "CALL_FAVOR": {
      const bonusUsed = { ...state.chairBonusesUsed, [action.chair]: true };
      const chairBonuses: Record<string, { stat: keyof Stats; delta: number }[]> = {
        life: [{ stat: "stress", delta: -15 }, { stat: "allowance", delta: 20 }],
        office: [{ stat: "organization", delta: 8 }],
        sports: [{ stat: "charisma", delta: 8 }, { stat: "connections", delta: 5 }],
        media: [{ stat: "connections", delta: 5 }, { stat: "charisma", delta: 3 }],
        social: [{ stat: "connections", delta: 8 }],
        psychology: [{ stat: "stress", delta: -10 }],
      };
      const effects = chairBonuses[action.chair] ?? [];
      const favorStats = applyEffects(state.stats, effects);
      const favorFlags = action.chair === "media" ? { ...state.flags, media_exposure: true } : state.flags;
      return { ...state, stats: favorStats, chairBonusesUsed: bonusUsed, flags: favorFlags };
    }

    case "INVEST_BUDGET": {
      const investStats = applyEffects(state.stats, [
        { stat: "budget", delta: -action.amount },
        ...action.effects,
      ]);
      const investOpinions = { ...state.chairOpinions };
      for (const ce of action.chairEffects) {
        investOpinions[ce.chair] = Math.max(-100, Math.min(100, (investOpinions[ce.chair] ?? 0) + ce.delta));
      }
      return { ...state, stats: investStats, chairOpinions: investOpinions };
    }

    case "CONVERT_VOLUNTEER_HOURS": {
      if (state.stats.volunteerHours < 40) return state;
      return {
        ...state,
        stats: {
          ...state.stats,
          volunteerHours: state.stats.volunteerHours - 40,
          academics: clampStat(state.stats.academics + 5),
        },
        flags: { ...state.flags, volunteer_converted: true },
      };
    }

    case "TRADE_CONNECTIONS": {
      const tier = getConnectionsTier(state.stats.connections);
      if (tier.tradeCost === 0) return state;
      const tradeStats = applyEffects(state.stats, [
        { stat: "connections", delta: -tier.tradeCost },
        { stat: action.targetStat, delta: tier.tradeGain },
      ]);
      return { ...state, stats: tradeStats };
    }

    case "APPLY_POLITICS_EVENT": {
      const polStats = applyEffects(state.stats, action.event.statEffects);
      const polOpinions = { ...state.chairOpinions };
      for (const ce of action.event.chairEffects) {
        polOpinions[ce.chair] = Math.max(-100, Math.min(100, (polOpinions[ce.chair] ?? 0) + ce.delta));
      }
      return { ...state, stats: polStats, chairOpinions: polOpinions };
    }

    case "SHIFT_CLIMATE":
      return { ...state, campusClimate: applyClimateDelta(state.campusClimate, action.delta) };

    case "APPLY_WEEKLY_COMBOS": {
      let comboStats = state.stats;
      let comboClimate = state.campusClimate;
      for (const combo of action.combos) {
        comboStats = applyEffects(comboStats, combo.statEffects as { stat: keyof Stats; delta: number }[]);
        if (combo.climateEffects) {
          comboClimate = applyClimateDelta(comboClimate, combo.climateEffects);
        }
      }
      return {
        ...state,
        stats: comboStats,
        campusClimate: comboClimate,
        lastWeeklyCombos: action.combos,
      };
    }

    case "SEND_MAIL": {
      const exists = state.mails.find((m) => m.id === action.mail.id);
      if (exists) return state;
      return { ...state, mails: [...state.mails, action.mail] };
    }
    case "READ_MAIL": {
      return {
        ...state,
        mails: state.mails.map((m) => (m.id === action.mailId ? { ...m, read: true } : m)),
      };
    }

    case "START_NEGOTIATION": {
      return { ...state, gamePhase: "negotiation", negotiation: action.negotiation };
    }

    case "PLAY_NEGOTIATION_CARD": {
      if (!state.negotiation) return state;
      const neg = state.negotiation;

      // NPC picks a card based on personality + strategy
      const npcCard = pickNpcCard(neg.npcPersonality, neg.lastPlayerCard);

      // Determine winner
      const result = resolveRound(action.playerCard, npcCard);
      const newPlayerScore = result === "win" ? neg.playerScore + 1 : neg.playerScore;
      const newNpcScore = result === "lose" ? neg.npcScore + 1 : neg.npcScore;

      const CARDS: Record<NegotiationCardType, string> = {
        logic: "🟥 据理力争",
        pressure: "🟦 强硬施压",
        charm: "⬛ 巧妙斡旋",
      };

      const messages: Record<string, string> = {
        win: `你出 ${CARDS[action.playerCard]}，对方出 ${CARDS[npcCard]} —— 克制成功！`,
        lose: `你出 ${CARDS[action.playerCard]}，对方出 ${CARDS[npcCard]} —— 被克制了！`,
        draw: `你出 ${CARDS[action.playerCard]}，对方出 ${CARDS[npcCard]} —— 同类型，力量强的获胜！`,
      };

      return {
        ...state,
        negotiation: {
          ...neg,
          playerScore: newPlayerScore,
          npcScore: newNpcScore,
          round: neg.round + 1,
          lastPlayerCard: action.playerCard,
          lastNpcCard: npcCard,
          lastResult: result,
          resultMessage: messages[result],
        },
      };
    }

    case "END_NEGOTIATION": {
      if (!state.negotiation) return state;
      const neg = state.negotiation;
      const playerWon = neg.playerScore > neg.npcScore;

      let newStats = state.stats;
      let newFlags = { ...state.flags };
      let newOpinions = { ...state.chairOpinions };
      let newShopState = state.shopState;

      if (playerWon) {
        for (const e of neg.onWin.effects) {
          newStats = applySingleEffect(newStats, e.stat, e.delta);
        }
        if (neg.onWin.flags) {
          for (const f of neg.onWin.flags) {
            newFlags[f] = true;
          }
        }
      } else {
        for (const e of neg.onLose.effects) {
          newStats = applySingleEffect(newStats, e.stat, e.delta);
        }
        if (neg.onLose.flags) {
          for (const f of neg.onLose.flags) {
            newFlags[f] = true;
          }
        }
      }

      // Apply chair opinion change if this was a chair negotiation
      if (neg.chairId) {
        const opinionDelta = playerWon ? 25 : -15;
        newOpinions[neg.chairId] = Math.max(-100, Math.min(100, (newOpinions[neg.chairId] ?? 0) + opinionDelta));
      }

      // Apply bargain discount if applicable — mark card & update price in shopState
      let lastBargainResult = state.lastBargainResult;
      if (state.bargainTarget && newShopState) {
        const bt = state.bargainTarget;
        const cardIdx = newShopState.cards.findIndex((c) => c.id === bt.itemId);
        if (cardIdx >= 0) {
          const newCards = newShopState.cards.map((c, i) => {
            if (i !== cardIdx) return c;
            if (playerWon) {
              const discounted = Math.floor(bt.price * (100 - bt.discountPercent) / 100);
              return { ...c, discountedPrice: discounted };
            }
            return c; // fail: keep original price
          });
          newShopState = {
            ...newShopState,
            cards: newCards,
            bargainedItemIds: [...newShopState.bargainedItemIds, bt.itemId],
            lastBargainWeek: state.semesterWeek,
          };
        }
        lastBargainResult = {
          itemName: bt.itemName,
          success: playerWon,
          discount: playerWon ? Math.floor(bt.price * bt.discountPercent / 100) : 0,
        };
      }

      return {
        ...state,
        stats: newStats,
        flags: newFlags,
        chairOpinions: newOpinions,
        shopState: newShopState,
        gamePhase: neg.returnTo,
        negotiation: null,
        bargainTarget: null,
        lastBargainResult,
        eventLog: [
          ...state.eventLog,
          {
            week: state.semesterWeek,
            title: `交涉: ${neg.context}`,
            result: playerWon ? "交涉成功 ✓" : "交涉失败 ✗",
          },
        ],
      };
    }

    case "SET_BARGAIN_TARGET": {
      return { ...state, bargainTarget: action.target };
    }

    // ═══ 招干事系统 ═══
    case "START_RECRUITMENT": {
      return {
        ...state,
        gamePhase: "recruitment_briefing",
        recruitState: {
          applicants: action.applicants,
          currentIndex: 0,
          phase: "briefing",
          hiredCount: 0,
          maxHires: 5,
        },
      };
    }

    case "SET_RECRUIT_PHASE": {
      if (!state.recruitState) return state;
      return {
        ...state,
        gamePhase: action.recruitPhase === "briefing" ? "recruitment_briefing"
          : action.recruitPhase === "select" ? "recruitment_select"
          : "recruitment_interview",
        recruitState: { ...state.recruitState, phase: action.recruitPhase },
      };
    }

    case "SELECT_APPLICANT": {
      if (!state.recruitState) return state;
      return {
        ...state,
        gamePhase: "recruitment_interview",
        recruitState: {
          ...state.recruitState,
          currentIndex: action.index,
          phase: "interview",
        },
      };
    }

    case "ASK_QUESTION": {
      if (!state.recruitState) return state;
      const apps = [...state.recruitState.applicants];
      const cur = apps[state.recruitState.currentIndex];
      apps[state.recruitState.currentIndex] = {
        ...cur,
        questionsAsked: cur.questionsAsked + 1,
      };
      return {
        ...state,
        energy: Math.max(0, state.energy - 5),
        recruitState: { ...state.recruitState, applicants: apps },
      };
    }

    case "HIRE_APPLICANT": {
      if (!state.recruitState) return state;
      if (state.recruitState.hiredCount >= state.recruitState.maxHires) return state;
      const apps = [...state.recruitState.applicants];
      apps[state.recruitState.currentIndex] = {
        ...apps[state.recruitState.currentIndex],
        hired: true,
      };
      return {
        ...state,
        recruitState: {
          ...state.recruitState,
          applicants: apps,
          hiredCount: state.recruitState.hiredCount + 1,
        },
      };
    }

    case "REJECT_APPLICANT": {
      if (!state.recruitState) return state;
      const apps = [...state.recruitState.applicants];
      apps[state.recruitState.currentIndex] = {
        ...apps[state.recruitState.currentIndex],
        hired: false,
      };
      return {
        ...state,
        recruitState: { ...state.recruitState, applicants: apps },
      };
    }

    case "FINISH_RECRUITMENT": {
      return {
        ...state,
        gamePhase: "game",
        recruitState: null,
        flags: { ...state.flags, recruitment_done: true },
      };
    }

    // ===== 田径运动会 =====
    case "ENTER_SPORTS_FESTIVAL": {
      return {
        ...state,
        gamePhase: "sports_festival_walking",
        sportsFestival: {
          phase: "walking", playerX: 400, playerY: 350,
          currentGame: null, completedGames: [],
          gameRatings: {}, lastGameRating: null, prizeClaimed: false,
        },
      };
    }

    case "START_SPORTS_FESTIVAL": {
      if (!state.sportsFestival) return state;
      return {
        ...state,
        sportsFestival: { ...state.sportsFestival, phase: "playing" },
      };
    }

    case "RETURN_SPORTS_WALKING": {
      if (!state.sportsFestival) return state;
      return {
        ...state,
        sportsFestival: { ...state.sportsFestival, phase: "walking", currentGame: null },
      };
    }

    case "SET_SPORTS_PHASE": {
      if (!state.sportsFestival) return state;
      return {
        ...state,
        sportsFestival: { ...state.sportsFestival, phase: action.phase },
      };
    }

    case "SELECT_SPORTS_GAME": {
      if (!state.sportsFestival) return state;
      return {
        ...state,
        sportsFestival: {
          ...state.sportsFestival,
          phase: "playing",
          currentGame: action.game,
          playerX: action.x,
          playerY: action.y,
        },
      };
    }

    case "END_SPORTS_GAME": {
      if (!state.sportsFestival) return state;
      const completed = [...state.sportsFestival.completedGames, action.game];
      const ratings = { ...state.sportsFestival.gameRatings, [action.game]: action.rating };
      const allDone = completed.length >= 5;
      return {
        ...state,
        sportsFestival: {
          ...state.sportsFestival,
          completedGames: completed,
          gameRatings: ratings,
          currentGame: null,
          lastGameRating: action.rating,
          phase: allDone ? "stamp" : "cg",
        },
      };
    }

    case "CLAIM_SPORTS_PRIZE": {
      const lotion = {
        itemId: "oulaya_lotion",
        name: "藕濑雅乳液",
        icon: "🧴",
        category: "gift" as const,
        rarity: "legendary" as const,
        quantity: 1,
        effects: { affinityBonus: 30, description: "好感+30，NPC会害羞" },
      };
      const mystery = {
        itemId: "durex_mystery",
        name: "肚雷斯",
        icon: "🎁",
        category: "special" as const,
        rarity: "legendary" as const,
        quantity: 1,
        effects: { description: "？？？" },
      };
      const nextWeek = state.week + 1;
      const nextSemesterWeek = state.semesterWeek >= 16 ? 1 : state.semesterWeek + 1;
      const nextSemester = state.semesterWeek >= 16 ? state.semester + 1 : state.semester;

      // Calculate performance rewards
      const ratings = state.sportsFestival?.gameRatings ?? {};
      const sCount = Object.values(ratings).filter((r) => r === "S").length;
      const saCount = Object.values(ratings).filter((r) => r === "S" || r === "A").length;

      let bonusEffects: { stat: keyof Stats; delta: number }[] = [];
      let climateBonus: CampusClimateDelta = {};

      if (sCount >= 5) {
        bonusEffects = [
          { stat: "organization", delta: 8 },
          { stat: "charisma", delta: 5 },
        ];
        climateBonus = { publicTrust: 5 };
      } else if (saCount >= 3) {
        bonusEffects = [
          { stat: "organization", delta: 4 },
          { stat: "charisma", delta: 2 },
        ];
      } else {
        bonusEffects = [
          { stat: "charisma", delta: 2 },
        ];
      }

      return {
        ...state,
        gamePhase: "game",
        sportsFestival: null,
        week: nextWeek,
        semesterWeek: nextSemesterWeek,
        semester: nextSemester,
        energy: 100,
        weeklySchedule: null,
        stats: applyEffects(state.stats, bonusEffects),
        campusClimate: applyClimateDelta(state.campusClimate, climateBonus),
        inventory: [...state.inventory, lotion, mystery],
        flags: { ...state.flags, sports_festival_done: true },
      };
    }

    // ===== 神秘商人 =====
    case "ENTER_MERCHANT": {
      if (state.stats.connections < 88) return state;
      if (state.merchantState && state.merchantState.lastVisitWeek >= state.semesterWeek) return state;
      const offers = generateMerchantOffers().map((o) => ({ ...o, sold: false }));
      const visits = (state.merchantState?.visits ?? 0) + 1;
      return {
        ...state,
        gamePhase: "mysterious_merchant",
        merchantState: { offers, visits, lastVisitWeek: state.semesterWeek },
      };
    }

    case "EXIT_MERCHANT": {
      return { ...state, gamePhase: "game" };
    }

    case "BUY_MERCHANT_OFFER": {
      if (!state.merchantState) return state;
      const offerIdx = state.merchantState.offers.findIndex((o) => o.id === action.offerId);
      if (offerIdx === -1) return state;
      const offer = state.merchantState.offers[offerIdx];
      if (offer.sold) return state;

      // Check stat cost
      const currentVal = state.stats[offer.costStat];
      if (currentVal < offer.costAmount) return state;

      // Deduct stat
      const statDelta: { stat: keyof Stats; delta: number } = {
        stat: offer.costStat,
        delta: -offer.costAmount,
      } as { stat: keyof Stats; delta: number };
      const newStats = applyEffects(state.stats, [statDelta]);

      // Add item to inventory
      const newItem: InventoryItem = {
        itemId: offer.item.id,
        name: offer.item.name,
        icon: offer.item.icon,
        category: offer.item.category,
        rarity: offer.item.rarity,
        quantity: 1,
        effects: offer.item.effects,
      };

      // Mark offer as sold
      const newOffers = [...state.merchantState.offers];
      newOffers[offerIdx] = { ...offer, sold: true };

      return {
        ...state,
        stats: newStats,
        inventory: [...state.inventory, newItem],
        merchantState: { ...state.merchantState, offers: newOffers },
      };
    }

    default:
      return state;
  }
}
