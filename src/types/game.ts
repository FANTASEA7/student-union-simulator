// src/types/game.ts

export type Department =
  | "life"
  | "office"
  | "sports"
  | "media"
  | "social"
  | "psychology";

export type GameStage = "staff" | "minister" | "president";

export type GamePhase =
  | "title" | "name_input" | "department_select" | "interview"
  | "badge_cg" | "meet_npc_cg" | "game" | "event" | "schedule_planning" | "schedule_executing"
  | "weekend_spending" | "minigame" | "exam" | "exam_result"
  | "love_confess" | "ngplus_allocate" | "ending" | "memoir"
  | "supermarket" | "contacts" | "promotion_meeting" | "semester_summary"
  | "first_person_dialogue" | "chair_relations" | "backpack" | "mail"
  | "negotiation" | "event_log"
  | "recruitment_briefing" | "recruitment_select" | "recruitment_interview"
  | "sports_festival_walking" | "sports_festival_game" | "sports_festival_cg" | "sports_festival_stamp"
  | "mysterious_merchant";

export type VolunteerLevel = "school" | "city" | "province" | "national";

export type MiniGameType = "click" | "memory" | "assign" | "whack" | "catch";

export type MiniGameRating = "S" | "A" | "B";

// ===== 招干事系统 =====
export type RecruitQuality = "legendary" | "epic" | "rare" | "common";

export interface RecruitApplicant {
  id: string;
  name: string;
  gender: "male" | "female";
  quality: RecruitQuality;
  energy: number;
  major: string;
  hometown: string;
  hobby: string;
  specialty: string;
  motto: string;
  questionsAsked: number;
  hired?: boolean;
  tip: string; // 点击头像显示的数值提示
}

export interface RecruitState {
  applicants: RecruitApplicant[];
  currentIndex: number;
  phase: "briefing" | "select" | "interview";
  hiredCount: number;
  maxHires: number;
}

// ===== 田径运动会 =====
export type SportsGameType = "archery" | "golf" | "tictactoe" | "gomoku" | "running";

export interface SportsFestivalState {
  phase: "walking" | "playing" | "cg" | "stamp" | "prize";
  playerX: number;
  playerY: number;
  currentGame: SportsGameType | null;
  completedGames: SportsGameType[];
  gameRatings: Partial<Record<SportsGameType, MiniGameRating>>;
  lastGameRating: MiniGameRating | null;
  prizeClaimed: boolean;
}

export interface Stats {
  organization: number;
  connections: number;
  academics: number;
  charisma: number;
  stress: number;
  budget: number;
  volunteerHours: number;
  allowance: number;
}

export interface EventChoice {
  text: string;
  effects: { stat: keyof Stats; delta: number }[];
  feedback: string;
  setFlags?: string[];
  meetNpcId?: string;
  climateEffects?: CampusClimateDelta;
  negotiation?: {
    npcName: string;
    npcEmoji: string;
    npcPersonality: NPCPersonality;
    context: string;
    stakes: { win: string; lose: string };
    onWin: { effects: { stat: keyof Stats; delta: number }[]; flags?: string[] };
    onLose: { effects: { stat: keyof Stats; delta: number }[]; flags?: string[] };
  };
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: "daily" | "department" | "relationship" | "crisis" | "opportunity" | "volunteer" | "love";
  stage: GameStage[];
  department?: Department;
  priority: number;
  condition?: {
    minStats?: Partial<Stats>;
    maxStats?: Partial<Stats>;
    requiredFlags?: string[];
    excludeFlags?: string[];
    hasLover?: boolean;
  };
  choices: EventChoice[];
  volunteerLevel?: VolunteerLevel;
  volunteerName?: string;
  baseHours?: number;
  miniGame?: {
    type: MiniGameType;
    config: MiniGameConfig;
  };
  bonus?: Partial<Pick<Stats, "organization" | "connections" | "charisma" | "academics" | "stress" | "budget">>;
}

export interface MiniGameConfig {
  timeLimit: number;
  targetCount?: number;
  pairCount?: number;
  taskCount?: number;
}

export interface InterviewQuestion {
  question: string;
  choices: {
    text: string;
    effects: { stat: keyof Stats; delta: number }[];
    feedback: string;
  }[];
}

export interface DepartmentInfo {
  id: Department;
  name: string;
  headName: string;
  headTagline: string;
  personality: string;
  color: string;
  questions: InterviewQuestion[];
}

export interface GameState {
  playerName: string;
  department: Department | null;
  stage: GameStage;
  week: number;
  semester: number;
  stats: Stats;
  gamePhase: GamePhase;
  eventHistory: string[];
  currentEvent: GameEvent | null;
  currentInterviewIndex: number;
  eventLog: { week: number; title: string; result: string }[];
  flags: Record<string, boolean>;
  activeMiniGame: {
    type: MiniGameType;
    config: MiniGameConfig;
    volunteerEventId: string;
  } | null;
  miniGameResult: MiniGameRating | null;
  semesterWeek: number;
  energy: number;
  weeklySchedule: WeeklySchedule | null;
  examRankings: ExamRanking[];
  currentExam: {
    examId: string;
    questions: ExamQuestion[];
    currentIndex: number;
    answers: { questionId: string; selected: number }[];
    timeRemaining: number;
  } | null;
  loveNPCs: LoveNPC[];
  datingNPCId: string | null;
  loveEventsTriggered: string[];
  ngPlus: NGPlusData;
  achievements: Achievement[];
  currentEnding: Ending | null;
  endingStats: Stats | null;
  inventory: InventoryItem[];
  mails: MailMessage[];
  shopState: ShopState | null;
  npcInteractions: Record<string, NPCInteraction>;
  fpDialogueScene: FPDialogueScene | null;
  negotiation: NegotiationState | null;
  bargainTarget: { itemId: string; itemName: string; price: number; discountPercent: number } | null;
  lastBargainResult: { itemName: string; success: boolean; discount: number } | null;
  campusClimate: CampusClimate;
  lastWeeklyCombos: WeeklyCombo[];
  // 政治系统
  chairOpinions: Record<Department, number>;
  chairBonusesUsed: Record<Department, boolean>;
  recruitState: RecruitState | null;
  sportsFestival: SportsFestivalState | null;
  merchantState: MerchantState | null;
  meetingNpcId: string | null;
  saveSlot: number;
}

export interface SaveData {
  version: number;
  timestamp: number;
  state: GameState;
}

// ===== 排课系统类型 =====
export type ActivityType = "study" | "social" | "work" | "rest" | "volunteer";

export type CardRarity = "common" | "rare" | "epic" | "legendary";

export type ActivitySubType =
  | "study_library" | "study_group" | "study_cram"
  | "social_meal" | "social_club" | "social_date"
  | "work_plan" | "work_paperwork" | "work_coordinate"
  | "rest_sleep" | "rest_game" | "rest_walk";

export interface SpecialEffect {
  type: "bonus_stats" | "extra_event" | "free_rest" | "npc_bond" | "combo_boost" | "energy_refund";
  value?: number;
  description: string;
}

export interface ActivityDef {
  type: ActivityType;
  subType: ActivitySubType;
  label: string;
  icon: string;
  description: string;
  rarity: CardRarity;
  apCost: number;
  energyCost: number;
  tags: string[];
  statEffects: { stat: keyof Stats; min: number; max: number }[];
  stressDelta: number;
  eventTriggerChance: number;
  eventCategory?: GameEvent["type"];
  unlockCondition?: { stage?: GameStage; minStats?: Partial<Stats>; flags?: string[] };
  specialEffect?: SpecialEffect;
}

export interface ActivitySlot {
  activity: ActivityDef | null;
  result?: {
    statChanges: { stat: keyof Stats; delta: number }[];
    triggeredEventId?: string;
    triggeredEvent?: GameEvent;
  };
  status: "pending" | "active" | "complete" | "forced_rest";
}

export interface WeeklySchedule {
  week: number;
  slots: [ActivitySlot, ActivitySlot, ActivitySlot, ActivitySlot, ActivitySlot];
  forecast: string[];
  state: "planning" | "executing" | "weekend" | "done";
  currentDay: number;
}

// ===== Campus situation and schedule combo systems =====
export type CampusMood = "calm" | "busy" | "tense" | "thriving" | "crisis";

export interface CampusClimate {
  publicTrust: number;
  schoolPressure: number;
  clubSatisfaction: number;
  publicOpinion: number;
  dominantMood?: CampusMood;
}

export type CampusClimateDelta = Partial<Omit<CampusClimate, "dominantMood">>;

export interface WeeklyCombo {
  id: string;
  label: string;
  description: string;
  icon: string;
  statEffects: { stat: keyof Stats; delta: number }[];
  climateEffects: CampusClimateDelta;
}

// ===== 考试系统类型 =====
export interface ExamQuestion {
  id: string;
  stem: string;
  options: string[];
  answer: number;
  difficulty: 1 | 2 | 3;
  explanation: string;
  section: "grammar" | "vocabulary" | "reading" | "cloze";
}

export interface ExamDef {
  id: string;
  name: string;
  icon: string;
  semesterWeek: number;
  semester: number;
  questionCount: number;
  passThreshold: number;
  timeLimit: number;
  passEffects: { stat: keyof Stats; delta: number }[];
  failEffects: { stat: keyof Stats; delta: number }[];
}

export interface ExamResult {
  examId: string;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  score: number;
  answers: { questionId: string; selected: number; correct: boolean }[];
}

export interface ExamRival {
  id: string;
  name: string;
  persona: string;
  color: string;
  baseStats: Stats;
  growthRate: number;
  catchphrase: string;
}

export interface ExamRanking {
  semester: number;
  rankings: { rivalId?: string; name: string; score: number; breakdown: { stat: keyof Stats; contribution: number }[] }[];
  playerRank: number;
  playerScore: number;
  evaluation: string;
  postExamEvents: GameEvent[];
}

// ===== 恋爱系统类型 =====
export type NPCPersonality = "sunny" | "tsundere" | "gentle" | "shy" | "mischievous";

export interface LoveNPC {
  id: string;
  name: string;
  gender: "male" | "female";
  personality: NPCPersonality;
  appearance: string;
  department: Department | "other";
  year: 1 | 2 | 3 | 4;
  hobby: string;
  affinity: number;
  met: boolean;
  canRomance: boolean;
  avatar?: string;
  status: "stranger" | "friend" | "close" | "dating" | "rejected";
  dialogues: {
    firstMeet: string;
    friend: string;
    close: string;
    confess: string;
    accept: string;
    reject: string;
  };
}

// ===== 第一人称对话系统类型 =====
export interface FPDialogueLine {
  speakerId: string;
  speakerName: string;
  speakerEmoji: string;
  avatar?: string;
  text: string;
  side?: "left" | "right" | "center";
}

export interface FPDialogueScene {
  id: string;
  title: string;
  background?: string;
  lines: FPDialogueLine[];
  choices?: {
    text: string;
    nextLineIndex?: number;
    effects?: { stat: keyof Stats; delta: number }[];
    feedback?: string;
    setFlags?: string[];
    meetNpcId?: string;
  }[];
  onComplete?: {
    flags?: string[];
    effects?: { stat: keyof Stats; delta: number }[];
    setPhase?: GamePhase;
    meetNpcIds?: string[];
    affinityGain?: { npcId: string; delta: number };
  };
}

// ===== 生活费系统类型 =====
export interface ExpenseOption {
  id: string;
  label: string;
  icon: string;
  cost: number;
  description: string;
  effects: { stat: keyof Stats; delta: number }[];
  currency?: "allowance" | "budget" | "volunteerHours";
  condition?: {
    minStats?: Partial<Stats>;
    maxStats?: Partial<Stats>;
    flags?: string[];
    hasLover?: boolean;
    minAffinity?: number;
  };
}

// ===== NG+系统类型 =====
export type EndingType =
  | "president_great" | "president_good" | "minister_end"
  | "staff_end" | "burnout" | "love_end"
  | "cheat_expelled";

export interface Ending {
  type: EndingType;
  title: string;
  subtitle: string;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
}

export interface NGPlusData {
  weekNumber: number;
  inheritancePoints: number;
  unlockedAchievements: string[];
  previousEndings: { weekNumber: number; ending: Ending; date: string }[];
  unlockedHiddenContent: string[];
}

export interface PersistentData {
  previousEndings: { weekNumber: number; ending: Ending; date: string }[];
  unlockedAchievements: string[];
  unlockedHiddenContent: string[];
  memoirUnlocked: boolean;
}

// ===== 道具 & 背包系统 =====
export type ItemCategory = "consumable" | "gift" | "tool" | "special";

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: ItemCategory;
  rarity: CardRarity;
  price: number;
  effects: {
    stat?: keyof Stats;
    delta?: number;
    energyRestore?: number;
    stressRestore?: number;
    affinityBonus?: number;
    eventLuck?: number;
    description: string;
  };
}

export interface InventoryItem {
  itemId: string;
  name: string;
  icon: string;
  category: ItemCategory;
  rarity: CardRarity;
  quantity: number;
  effects: ShopItem["effects"];
}

// ===== 邮件系统 =====
export interface MailMessage {
  id: string;
  from: string;
  fromEmoji: string;
  subject: string;
  body: string;
  week: number;
  read: boolean;
  giftItemId?: string;
}

// ===== 交涉辩论系统 =====
export type NegotiationCardType = "logic" | "pressure" | "charm";

export interface NegotiationCardDef {
  type: NegotiationCardType;
  emoji: string;
  label: string;
  description: string;
}

export interface NegotiationState {
  npcName: string;
  npcEmoji: string;
  npcPersonality: NPCPersonality;
  playerScore: number;
  npcScore: number;
  round: number;
  maxRounds: number;
  context: string;
  stakes: { win: string; lose: string };
  lastPlayerCard?: NegotiationCardType;
  lastNpcCard?: NegotiationCardType;
  lastResult?: "win" | "lose" | "draw";
  resultMessage?: string;
  onWin: { effects: { stat: keyof Stats; delta: number }[]; flags?: string[] };
  onLose: { effects: { stat: keyof Stats; delta: number }[]; flags?: string[] };
  returnTo: GamePhase;
  chairId?: Department;
}

// ===== 超市翻卡系统 =====
export interface ShopCard {
  id: string;
  item: ShopItem;
  flipped: boolean;
  sold: boolean;
  discountedPrice?: number; // set after successful bargain
}

export interface ShopState {
  cards: ShopCard[];
  flipsRemaining: number;
  maxFlips: number;
  rerollCost: number;
  bargainedItemIds: string[];  // items already bargained for this visit
  lastBargainWeek: number;     // semester week of last bargain (for daily limit)
}

// ===== 神秘商人 =====
export type TradeStat = "organization" | "connections" | "academics" | "charisma" | "stress";

export interface MerchantOffer {
  id: string;
  item: {
    id: string;
    name: string;
    icon: string;
    description: string;
    category: ItemCategory;
    rarity: CardRarity;
    effects: ShopItem["effects"];
  };
  /** Which stat does this offer cost */
  costStat: TradeStat;
  costAmount: number;
  sold: boolean;
}

export interface MerchantState {
  offers: MerchantOffer[];
  visits: number;  // track weekly visits — max 1 per week
  lastVisitWeek: number;
}

// ===== NPC通讯录 & 互动 =====
export interface NPCDialogueLine {
  text: string;
  affinityRequired: number;
  response?: string;
  effects?: { stat?: keyof Stats; delta?: number; affinity?: number }[];
}

export interface NPCInteraction {
  npcId: string;
  dialogueHistory: { date: number; text: string; speaker: "player" | "npc" }[];
  giftsGiven: { itemId: string; date: number; reaction: string }[];
  lastInteractionWeek: number;
}

// ===== 政治系统 =====
export interface ChairPoliticsEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** 触发条件：需要的最小周数 */
  minWeek?: number;
  /** 触发条件：需要的旗标 */
  requiredFlags?: string[];
  /** 触发条件：排除的旗标 */
  excludeFlags?: string[];
  /** 影响的部长及其好感变化 */
  chairEffects: { chair: Department; delta: number }[];
  /** 玩家属性变化 */
  statEffects: { stat: keyof Stats; delta: number }[];
  /** 局势变化 */
  climateEffects?: CampusClimateDelta;
  /** 事件描述文本 */
  narrative: string;
}
