# 学生会模拟器 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a card-selection life-sim game "学生会模拟器" where players navigate 3 stages of student union life through event card choices.

**Architecture:** React + TypeScript + Vite SPA. Single `useReducer + Context` state tree drives 8 screen components switched by `gamePhase`. Event data is static TS files; progress is persisted to localStorage (3 slots).

**Tech Stack:** React 18, TypeScript 5, Vite 5, CSS Modules, no external dependencies beyond React.

---

## File Structure

```
D:\XIANGMU\student_union\
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.module.css
│   ├── vite-env.d.ts
│   ├── types/
│   │   └── game.ts
│   ├── data/
│   │   ├── departments.ts
│   │   ├── events.ts
│   │   ├── interviews.ts
│   │   └── volunteers.ts
│   ├── context/
│   │   └── GameContext.tsx
│   ├── reducer/
│   │   └── gameReducer.ts
│   ├── utils/
│   │   ├── eventPicker.ts
│   │   └── saveLoad.ts
│   ├── components/
│   │   ├── TitleScreen/
│   │   │   ├── TitleScreen.tsx
│   │   │   └── TitleScreen.module.css
│   │   ├── NameInput/
│   │   │   ├── NameInput.tsx
│   │   │   └── NameInput.module.css
│   │   ├── DepartmentSelect/
│   │   │   ├── DepartmentSelect.tsx
│   │   │   └── DepartmentSelect.module.css
│   │   ├── InterviewScreen/
│   │   │   ├── InterviewScreen.tsx
│   │   │   └── InterviewScreen.module.css
│   │   ├── WorkBadgeCG/
│   │   │   ├── WorkBadgeCG.tsx
│   │   │   └── WorkBadgeCG.module.css
│   │   ├── GameScreen/
│   │   │   ├── GameScreen.tsx
│   │   │   ├── GameScreen.module.css
│   │   │   ├── TopBar.tsx
│   │   │   ├── TopBar.module.css
│   │   │   ├── StatsPanel.tsx
│   │   │   ├── StatsPanel.module.css
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventCard.module.css
│   │   │   ├── EventLog.tsx
│   │   │   └── EventLog.module.css
│   │   ├── MiniGame/
│   │   │   ├── MiniGame.tsx
│   │   │   ├── MiniGame.module.css
│   │   │   ├── ClickGame.tsx
│   │   │   ├── MemoryGame.tsx
│   │   │   └── AssignGame.tsx
│   │   └── EndingScreen/
│   │       ├── EndingScreen.tsx
│   │       └── EndingScreen.module.css
│   └── styles/
│       └── global.css
```

---

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `src/main.tsx`, `src/vite-env.d.ts`

- [ ] **Step 1: Create project with Vite**

Run: `cd D:\XIANGMU\student_union && npm create vite@latest . -- --template react-ts`

- [ ] **Step 2: Verify scaffold**

Run: `npm install`
Run: `npm run dev` (verify it starts, then Ctrl+C)

- [ ] **Step 3: Clean up defaults**

Delete `src/App.css`, `src/index.css`, `src/assets/react.svg`, `public/vite.svg`.

- [ ] **Step 4: Create minimal main.tsx**

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 5: Create global.css with CSS variables**

```css
/* src/styles/global.css */
:root {
  --bg-warm: #f5f0eb;
  --color-primary: #1a3a5c;
  --color-accent: #c0392b;
  --color-gold: #f0c040;
  --color-warm-brown: #d4a574;
  --text-primary: #333333;
  --text-secondary: #888888;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  color: var(--text-primary);
  background: var(--bg-warm);
}
```

- [ ] **Step 6: Create src/styles/ directory**

Run: `mkdir -p src/styles src/types src/data src/context src/reducer src/utils`

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS project"
```

---

### Task 2: Define all TypeScript types

**Files:**
- Create: `src/types/game.ts`

- [ ] **Step 1: Write types file**

```typescript
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
  | "title"
  | "name_input"
  | "department_select"
  | "interview"
  | "badge_cg"
  | "game"
  | "minigame"
  | "ending";

export type VolunteerLevel = "school" | "city" | "province" | "national";

export type MiniGameType = "click" | "memory" | "assign";

export type MiniGameRating = "S" | "A" | "B";

export interface Stats {
  organization: number;  // 组织力
  connections: number;   // 人脉
  academics: number;     // 学习力
  charisma: number;      // 魅力值
  stress: number;        // 抗压力
  budget: number;        // 经费
  volunteerHours: number;// 志愿时长
}

export interface EventChoice {
  text: string;
  effects: { stat: keyof Stats; delta: number }[];
  feedback: string;
  setFlags?: string[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: "daily" | "department" | "relationship" | "crisis" | "opportunity" | "volunteer";
  stage: GameStage[];
  department?: Department;
  priority: number;
  condition?: {
    minStats?: Partial<Stats>;
    maxStats?: Partial<Stats>;
    requiredFlags?: string[];
    excludeFlags?: string[];
  };
  choices: EventChoice[];
  // volunteer-specific
  volunteerLevel?: VolunteerLevel;
  volunteerName?: string;
  baseHours?: number;
  miniGame?: {
    type: MiniGameType;
    config: MiniGameConfig;
  };
  bonus?: Partial<Pick<Stats, "organization" | "connections" | "charisma">>;
}

export interface MiniGameConfig {
  timeLimit: number;       // seconds
  targetCount?: number;    // for click game
  pairCount?: number;      // for memory game
  taskCount?: number;      // for assign game
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
  // minigame
  activeMiniGame: {
    type: MiniGameType;
    config: MiniGameConfig;
    volunteerEventId: string;
  } | null;
  miniGameResult: MiniGameRating | null;
  // ending
  endingStats: Stats | null;
}

export interface SaveData {
  version: number;
  timestamp: number;
  state: GameState;
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/types/game.ts
git commit -m "feat: define all TypeScript types for game state"
```

---

### Task 3: Game reducer with all actions

**Files:**
- Create: `src/reducer/gameReducer.ts`

- [ ] **Step 1: Write reducer**

```typescript
// src/reducer/gameReducer.ts
import { GameState, GameEvent, Stats, Department, MiniGameRating } from "../types/game";

export type GameAction =
  | { type: "SET_PLAYER_NAME"; name: string }
  | { type: "SET_DEPARTMENT"; department: Department }
  | { type: "SET_PHASE"; phase: GameState["gamePhase"] }
  | { type: "START_INTERVIEW" }
  | { type: "ANSWER_INTERVIEW"; effects: { stat: keyof Stats; delta: number }[] }
  | { type: "SET_STAGE"; stage: GameState["stage"] }
  | { type: "SET_CURRENT_EVENT"; event: GameEvent }
  | { type: "APPLY_CHOICE"; effects: { stat: keyof Stats; delta: number }[]; feedback: string; flags?: string[]; eventId: string; eventTitle: string }
  | { type: "ADVANCE_WEEK" }
  | { type: "START_MINIGAME"; type: GameState["activeMiniGame"]["type"]; config: GameState["activeMiniGame"]["config"]; volunteerEventId: string }
  | { type: "END_MINIGAME"; rating: MiniGameRating; baseHours: number; bonusEffects: { stat: keyof Stats; delta: number }[] }
  | { type: "SET_ENDING" }
  | { type: "LOAD_SAVE"; state: GameState }
  | { type: "RESET_GAME" };

const INITIAL_STATS: Stats = {
  organization: 10,
  connections: 10,
  academics: 20,
  charisma: 10,
  stress: 50,
  budget: 20,
  volunteerHours: 0,
};

export const INITIAL_STATE: GameState = {
  playerName: "",
  department: null,
  stage: "staff",
  week: 0,
  semester: 1,
  stats: { ...INITIAL_STATS },
  gamePhase: "title",
  eventHistory: [],
  currentEvent: null,
  currentInterviewIndex: 0,
  eventLog: [],
  flags: {},
  activeMiniGame: null,
  miniGameResult: null,
  endingStats: null,
};

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function applyEffects(stats: Stats, effects: { stat: keyof Stats; delta: number }[]): Stats {
  const next = { ...stats };
  for (const e of effects) {
    if (e.stat === "volunteerHours") {
      next.volunteerHours += e.delta;
    } else {
      next[e.stat] = clampStat(stats[e.stat] + e.delta);
    }
  }
  return next;
}

function checkPromotion(stats: Stats, stage: GameState["stage"], flags: Record<string, boolean>): boolean {
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

    case "SET_DEPARTMENT":
      return { ...state, department: action.department };

    case "SET_PHASE":
      return { ...state, gamePhase: action.phase };

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
      // check if stress hit 0 → crisis
      const shouldPromote = checkPromotion(newStats, state.stage, newFlags);
      return {
        ...state,
        stats: newStats,
        flags: newFlags,
        eventHistory: newHistory,
        eventLog: newLog,
        currentEvent: null,
        gamePhase: shouldPromote ? "badge_cg" : "game",
      };
    }

    case "ADVANCE_WEEK":
      return {
        ...state,
        week: state.week + 1,
        semester: Math.floor(state.week / 16) + 1,
      };

    case "START_MINIGAME":
      return {
        ...state,
        gamePhase: "minigame",
        activeMiniGame: {
          type: action.type,
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
      const newStats = applyEffects(state.stats, allEffects);
      return {
        ...state,
        stats: newStats,
        gamePhase: "game",
        activeMiniGame: null,
        miniGameResult: null,
        eventHistory: [...state.eventHistory, state.activeMiniGame!.volunteerEventId],
        eventLog: [
          ...state.eventLog,
          {
            week: state.week,
            title: `志愿服务 (${action.rating}级)`,
            result: `志愿时长 +${earnedHours}h`,
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

    default:
      return state;
  }
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/reducer/gameReducer.ts
git commit -m "feat: add game reducer with all action handlers"
```

---

### Task 4: Game context provider

**Files:**
- Create: `src/context/GameContext.tsx`

- [ ] **Step 1: Write context**

```tsx
// src/context/GameContext.tsx
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { GameState } from "../types/game";
import { gameReducer, GameAction, INITIAL_STATE } from "../reducer/gameReducer";

const GameStateContext = createContext<GameState>(INITIAL_STATE);
const GameDispatchContext = createContext<Dispatch<GameAction>>(() => {});

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  return useContext(GameStateContext);
}

export function useGameDispatch() {
  return useContext(GameDispatchContext);
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/context/GameContext.tsx
git commit -m "feat: add game context provider with useReducer"
```

---

### Task 5: Static data — departments and interviews

**Files:**
- Create: `src/data/departments.ts`
- Create: `src/data/interviews.ts`

- [ ] **Step 1: Write departments data**

```typescript
// src/data/departments.ts
import { DepartmentInfo } from "../types/game";

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: "life",
    name: "生活部",
    headName: "烟头叔叔",
    headTagline: "来，别紧张，随便聊聊",
    personality: "老烟枪，话糙理不糙的务实派",
    color: "#e8f4f8",
    questions: [], // filled by interviews.ts
  },
  {
    id: "office",
    name: "办公室",
    headName: "明六六",
    headTagline: "请坐，我们简单聊两句",
    personality: "精致的利己主义者，问题滴水不漏",
    color: "#fef3e2",
    questions: [],
  },
  {
    id: "sports",
    name: "文体部",
    headName: "小蛋糕",
    headTagline: "嗨～放轻松啦",
    personality: "笑容甜的社恐杀手，雷厉风行",
    color: "#fde8e8",
    questions: [],
  },
  {
    id: "media",
    name: "新媒体部",
    headName: "青岛王",
    headTagline: "哟，来面试啊，坐",
    personality: "网感超强的冲浪达人，开口就是梗",
    color: "#e6f3ec",
    questions: [],
  },
  {
    id: "social",
    name: "社管部",
    headName: "丁凯之子",
    headTagline: "...（打量了你一眼）",
    personality: "神秘二代，话少分量重",
    color: "#f0e6f6",
    questions: [],
  },
  {
    id: "psychology",
    name: "心理部",
    headName: "心理部负责人",
    headTagline: "你好，我们开始吧",
    personality: "温和而敏锐，擅长用沉默制造压力",
    color: "#e8eaf6",
    questions: [],
  },
];
```

- [ ] **Step 2: Write interviews data**

```typescript
// src/data/interviews.ts
import { InterviewQuestion } from "../types/game";

export const INTERVIEWS: Record<string, InterviewQuestion[]> = {
  life: [
    {
      question: "假如寝室有个同学天天半夜打游戏还开外放，室友们都对你有意见让你去说，你怎么办？",
      choices: [
        {
          text: "直接找那个同学严肃谈话，立规矩",
          effects: [{ stat: "organization", delta: 3 }, { stat: "charisma", delta: 1 }],
          feedback: "嗯，有魄力。生活部就需要敢管事的人。",
        },
        {
          text: "先私下请他吃顿饭，聊熟了再委婉提",
          effects: [{ stat: "connections", delta: 3 }, { stat: "charisma", delta: 1 }],
          feedback: "圆滑。不过有时候太圆滑事情推进得慢啊。",
        },
        {
          text: "写个匿名字条贴他桌上，给彼此留面子",
          effects: [{ stat: "stress", delta: 3 }, { stat: "academics", delta: 1 }],
          feedback: "哈哈，有点意思。不过生活部的事不能总靠匿名纸条。",
        },
      ],
    },
    {
      question: "学校要查寝室卫生评比，但你知道很多同学都在赶期末作业，你会怎么安排？",
      choices: [
        {
          text: "提前通知，给足准备时间，严格检查",
          effects: [{ stat: "organization", delta: 3 }, { stat: "stress", delta: -1 }],
          feedback: "行，安排得挺明白。生活部的活就是要提前想。",
        },
        {
          text: "放宽标准，期末了大家都忙，走个过场",
          effects: [{ stat: "connections", delta: 3 }, { stat: "stress", delta: 1 }],
          feedback: "你这倒是会做人情...不过上面查下来可不好交代。",
        },
        {
          text: "组织志愿者帮大家打扫，既完成评比又减轻负担",
          effects: [{ stat: "volunteerHours", delta: 5 }, { stat: "organization", delta: 2 }],
          feedback: "好小子，脑子转得快！这个思路我喜欢。",
        },
      ],
    },
  ],
  office: [
    {
      question: "一份重要的活动申请表，截止时间只剩两小时了，但你发现内容有几处明显错误，怎么办？",
      choices: [
        {
          text: "先提交，之后找机会补交修正版",
          effects: [{ stat: "stress", delta: 3 }, { stat: "charisma", delta: -1 }],
          feedback: "风险很大。这种侥幸心理在办公室可要不得。",
        },
        {
          text: "马上联系申请人修改，同时跟审批方说明情况争取延期",
          effects: [{ stat: "organization", delta: 3 }, { stat: "connections", delta: 2 }],
          feedback: "可以。办公室做事就是要周全，两边都要顾到。",
        },
        {
          text: "亲自动手改了，保证格式正确先交上去",
          effects: [{ stat: "academics", delta: 3 }, { stat: "organization", delta: 2 }],
          feedback: "执行力不错。不过下次最好让当事人自己改，这是规矩。",
        },
      ],
    },
    {
      question: "学生会经费有限，三个部门同时申请活动资金，总额超出预算三分之一，你作为办公室怎么处理？",
      choices: [
        {
          text: "按申请顺序先到先得",
          effects: [{ stat: "stress", delta: 2 }, { stat: "organization", delta: 1 }],
          feedback: "简单粗暴，但公平性存疑。",
        },
        {
          text: "召集三个部门开会协商，按活动影响力和紧急程度分配",
          effects: [{ stat: "organization", delta: 3 }, { stat: "connections", delta: 2 }],
          feedback: "很好，办公室就该是协调者的角色，不是裁判。",
        },
        {
          text: "砍掉最贵的那个，其他两个全额批",
          effects: [{ stat: "budget", delta: 3 }, { stat: "charisma", delta: -1 }],
          feedback: "有点得罪人...但有时候就得做这种决定。",
        },
      ],
    },
  ],
  sports: [
    {
      question: "校运动会开幕式，你负责的方阵表演还有三天就要上场了，但一半的人连动作都没记住，怎么办？",
      choices: [
        {
          text: "取消复杂动作，改简单队形，保住整体效果",
          effects: [{ stat: "organization", delta: 3 }, { stat: "stress", delta: 1 }],
          feedback: "务实！舞台上没有人知道你的原计划，只看最终效果。",
        },
        {
          text: "连续三天加练，不练好不休息",
          effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -3 }],
          feedback: "你是真的有激情...但同学们可能撑不住啊。",
        },
        {
          text: "让练得好的站前面，没记住的站后排凑个人数",
          effects: [{ stat: "stress", delta: 3 }, { stat: "connections", delta: 1 }],
          feedback: "哈哈，这也是一种智慧。文体部的传统艺能了属于是。",
        },
      ],
    },
    {
      question: "你想办一场校园音乐节，但场地和音响设备都需要审批，上级觉得太麻烦建议缩小规模，你怎么办？",
      choices: [
        {
          text: "听建议缩小规模，先办起来再说",
          effects: [{ stat: "organization", delta: 2 }, { stat: "stress", delta: 2 }],
          feedback: "稳妥的选择。小蛋糕以前也是这么过来的。",
        },
        {
          text: "做一份详细方案再次争取，用专业度说服上级",
          effects: [{ stat: "organization", delta: 3 }, { stat: "charisma", delta: 3 }],
          feedback: "有冲劲！文体部就需要你这种不被轻易劝退的人。",
        },
        {
          text: "拉赞助自己搞，不占学校资源",
          effects: [{ stat: "budget", delta: 5 }, { stat: "connections", delta: 3 }],
          feedback: "野心不小！如果你真能拉到赞助，我全力支持。",
        },
      ],
    },
  ],
  media: [
    {
      question: "学生会公众号阅读量一直很低，前任小编只会发活动通知，你觉得问题出在哪？",
      choices: [
        {
          text: "内容太官方了，应该用更接地气的语言和表情包",
          effects: [{ stat: "charisma", delta: 3 }, { stat: "academics", delta: 1 }],
          feedback: "对味儿！新媒体不网感就等于没做。",
        },
        {
          text: "发得太少了，应该提高更新频率，天天刷存在感",
          effects: [{ stat: "organization", delta: 3 }, { stat: "stress", delta: -1 }],
          feedback: "量很重要，但没质的内容再多也是骚扰。不过有这个意识可以。",
        },
        {
          text: "应该做互动选题，投票、征集、话题讨论，让用户参与进来",
          effects: [{ stat: "connections", delta: 3 }, { stat: "organization", delta: 2 }],
          feedback: "懂行！新媒体不是广播站，是双向的。你小子有东西。",
        },
      ],
    },
    {
      question: "学校出了个负面新闻，有人在网上带节奏，评论区已经吵翻天了，你作为新媒体部的人怎么办？",
      choices: [
        {
          text: "关闭评论区，冷处理等事情过去",
          effects: [{ stat: "stress", delta: 3 }, { stat: "connections", delta: -1 }],
          feedback: "鸵鸟战术...有时候确实管用，但不长久。",
        },
        {
          text: "写一篇客观说明，澄清事实，正面回应",
          effects: [{ stat: "charisma", delta: 3 }, { stat: "academics", delta: 2 }],
          feedback: "有担当！新媒体最怕的不是被骂，而是不说话。",
        },
        {
          text: "找当事人了解情况，拿到一手信息再做回应",
          effects: [{ stat: "connections", delta: 3 }, { stat: "organization", delta: 2 }],
          feedback: "严谨！信息核实是底线，不愧是我看上的人。",
        },
      ],
    },
  ],
  social: [
    {
      question: "你需要审核一个校外社团的注册申请，材料看起来齐全，但你隐约觉得这个社团的目的不太对，怎么办？",
      choices: [
        {
          text: "按规定办事，材料齐全就给过",
          effects: [{ stat: "stress", delta: 3 }, { stat: "organization", delta: 1 }],
          feedback: "合规。但合规不等于负责。",
        },
        {
          text: "约社团发起人面谈，深入了解后再决定",
          effects: [{ stat: "connections", delta: 3 }, { stat: "charisma", delta: 2 }],
          feedback: "聪明。丁凯当年也是这么做的，直觉加上验证。",
        },
        {
          text: "直接拒绝，宁可不批也不能埋雷",
          effects: [{ stat: "organization", delta: 2 }, { stat: "charisma", delta: -1 }],
          feedback: "谨慎是好事。但太过谨慎会扼杀好东西，记住。",
        },
      ],
    },
    {
      question: "两个学生社团因为活动场地起了冲突，都找到社管部评理，你判断两边都有道理，怎么办？",
      choices: [
        {
          text: "先到先得，按申请时间判定",
          effects: [{ stat: "organization", delta: 2 }, { stat: "connections", delta: -1 }],
          feedback: "简单。但输的一方不会服气。",
        },
        {
          text: "提出合办方案，两个社团一起搞，场地共享",
          effects: [{ stat: "connections", delta: 4 }, { stat: "organization", delta: 2 }],
          feedback: "格局。社管部不是判官，是桥梁。你懂了。",
        },
        {
          text: "把事情汇报给主席团，让他们定",
          effects: [{ stat: "stress", delta: 3 }, { stat: "charisma", delta: -1 }],
          feedback: "......我不评价这个选择，但你自己想想。",
        },
      ],
    },
  ],
  psychology: [
    {
      question: "你发现一个同学最近状态很差，经常独来独往，成绩也下滑了。你会怎么接近他？",
      choices: [
        {
          text: "直接找他聊聊，开门见山问是不是遇到困难了",
          effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -1 }],
          feedback: "勇气可嘉。但不是每个人都准备好了被直接问。",
        },
        {
          text: "先通过他身边的朋友了解情况，再慢慢找机会接触",
          effects: [{ stat: "connections", delta: 3 }, { stat: "stress", delta: 2 }],
          feedback: "很细腻的方式。探路而不冒犯，这是心理工作的基本功。",
        },
        {
          text: "组织一个轻松的小活动，自然地把他拉进来",
          effects: [{ stat: "organization", delta: 3 }, { stat: "connections", delta: 2 }],
          feedback: "好方法。有时候最好的关心是不让对方觉得在被关心。",
        },
      ],
    },
    {
      question: "一次心理沙龙上，有个同学突然情绪崩溃开始哭，全场安静，所有人都看着你，你会？",
      choices: [
        {
          text: "暂停活动，单独带他去隔壁教室安抚",
          effects: [{ stat: "stress", delta: 3 }, { stat: "connections", delta: 2 }],
          feedback: "处理得很快。保护当事人是第一位的。",
        },
        {
          text: "给他递纸巾，轻声说没关系，让其他同学继续分享",
          effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: 1 }],
          feedback: "自然的处理。把眼泪当成正常的事，而不是事故。",
        },
        {
          text: "停下来等他自己平静，然后让大家一个一个说想对他说的话",
          effects: [{ stat: "connections", delta: 4 }, { stat: "stress", delta: -2 }],
          feedback: "很大胆的做法。搞不好会变成集体PUA。但你这份想让大家连接的心，我看到了。",
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/data/departments.ts src/data/interviews.ts
git commit -m "feat: add department data and interview questions"
```

---

### Task 6: Static data — events and volunteers

**Files:**
- Create: `src/data/events.ts`
- Create: `src/data/volunteers.ts`

- [ ] **Step 1: Write events data (create 15+ events across all types)**

```typescript
// src/data/events.ts
import { GameEvent } from "../types/game";

export const EVENTS: GameEvent[] = [
  // === DAILY EVENTS ===
  {
    id: "borrow_money",
    title: "同学借钱",
    description: "室友找你借200块钱，说是月底还，但你听说他最近在氪金抽卡...",
    type: "daily",
    stage: ["staff", "minister"],
    priority: 3,
    choices: [
      {
        text: "爽快借了，都是兄弟",
        effects: [{ stat: "connections", delta: 8 }, { stat: "budget", delta: -5 }],
        feedback: "室友拍着胸脯保证下月一定还。",
      },
      {
        text: "婉拒，说自己也穷",
        effects: [{ stat: "connections", delta: -3 }, { stat: "budget", delta: 5 }],
        feedback: "室友嘴上说没事，但眼神有点微妙。",
      },
      {
        text: "不借钱，但帮他找份兼职",
        effects: [{ stat: "organization", delta: 5 }, { stat: "connections", delta: 3 }],
        feedback: "你给他推了学校勤工俭学的群，他愣了一下说谢谢。",
      },
    ],
  },
  {
    id: "teacher_task",
    title: "导员交办任务",
    description: "辅导员突然让你帮忙整理全年级300份学生档案，说后天要交。你打开一看，格式乱得让人窒息...",
    type: "daily",
    stage: ["staff", "minister", "president"],
    priority: 4,
    choices: [
      {
        text: "熬夜加班独自搞定",
        effects: [{ stat: "organization", delta: 5 }, { stat: "stress", delta: -10 }],
        feedback: "你熬了两个大夜终于搞定，导员说了一句辛苦了。",
      },
      {
        text: "叫上几个同学一起分担，请他们喝奶茶",
        effects: [{ stat: "connections", delta: 5 }, { stat: "budget", delta: -3 }],
        feedback: "三个臭皮匠顶个诸葛亮，一天就弄完了，大家还聊得很开心。",
      },
      {
        text: "写个脚本自动整理格式",
        effects: [{ stat: "academics", delta: 5 }, { stat: "organization", delta: 3 }],
        feedback: "Python大法好。以后再也不用手动填表了，导员对你刮目相看。",
      },
    ],
  },
  {
    id: "club_conflict",
    title: "社团场地冲突",
    description: "动漫社和街舞社因为周五晚上的活动室吵起来了，两边都不肯让。你刚好路过...",
    type: "daily",
    stage: ["staff", "minister"],
    priority: 3,
    choices: [
      {
        text: "装没看见，快步走开",
        effects: [{ stat: "stress", delta: 5 }, { stat: "connections", delta: -2 }],
        feedback: "你快步走开了。身后还在吵，但你耳机一戴谁都不爱。",
      },
      {
        text: "上前调解，提出一边用上半场一边用下半场",
        effects: [{ stat: "charisma", delta: 5 }, { stat: "organization", delta: 3 }],
        feedback: "虽然不是完美的方案，但两边都给了你面子接受了。",
      },
      {
        text: "建议他们合办一个'二次元宅舞之夜'",
        effects: [{ stat: "connections", delta: 5 }, { stat: "charisma", delta: 2 }],
        feedback: "这个神奇的点子居然被采纳了，两个社团现在称你为'和平大使'。",
      },
    ],
  },
  {
    id: "morning_class",
    title: "早八的诱惑",
    description: "闹钟响了第三遍，窗外飘着小雨。第一节是水课，但老师说今天可能点名...",
    type: "daily",
    stage: ["staff", "minister"],
    priority: 2,
    choices: [
      {
        text: "翻身继续睡，命要紧",
        effects: [{ stat: "stress", delta: 10 }, { stat: "academics", delta: -3 }],
        feedback: "你睡到了十一点。老师果然点名了，你被记了一次缺勤。",
      },
      {
        text: "挣扎起床，冲去教室",
        effects: [{ stat: "academics", delta: 5 }, { stat: "stress", delta: -5 }],
        feedback: "你坐在最后一排哈欠连天，但至少名字在签到表上。",
      },
      {
        text: "让室友帮你喊'到'，自己看网课回放",
        effects: [{ stat: "academics", delta: 3 }, { stat: "connections", delta: 3 }],
        feedback: "室友不负所托，你收到一条微信：'帮你喊了，欠我一顿饭'。",
      },
    ],
  },
  {
    id: "lost_found",
    title: "失物招领",
    description: "你在食堂捡到一个钱包，里面有身份证和五百块钱。没有联系方式...",
    type: "daily",
    stage: ["staff", "minister", "president"],
    priority: 2,
    choices: [
      {
        text: "交到学校失物招领处",
        effects: [{ stat: "stress", delta: 3 }, { stat: "charisma", delta: 2 }],
        feedback: "失物招领处的大爷说你是这个月第一个来交东西的人。",
      },
      {
        text: "根据身份证信息在校园墙上发帖找人",
        effects: [{ stat: "connections", delta: 5 }, { stat: "organization", delta: 2 }],
        feedback: "帖子半小时就被顶上了热门，失主两小时后就联系你了。",
      },
      {
        text: "放回原处，装作没看到",
        effects: [{ stat: "stress", delta: -5 }, { stat: "charisma", delta: -3 }],
        feedback: "你快步离开了食堂，但心里老是惦记着。",
      },
    ],
  },

  // === DEPARTMENT EVENTS ===
  {
    id: "life_dorm_check",
    title: "突击查寝",
    description: "烟头叔叔说这周要突击检查寝室卫生，让你带队。你知道有些寝室...嗯，不太好描述。",
    type: "department",
    department: "life",
    stage: ["staff", "minister"],
    priority: 5,
    choices: [
      {
        text: "严格按照标准查，不合格的如实上报",
        effects: [{ stat: "organization", delta: 6 }, { stat: "connections", delta: -3 }],
        feedback: "查出了三个'垃圾场'级别的寝室，同学对你又爱又恨。",
      },
      {
        text: "提前挨个通知，让大家有时间收拾",
        effects: [{ stat: "connections", delta: 6 }, { stat: "stress", delta: 2 }],
        feedback: "各寝室感恩戴德，你收获了六个寝室的好友位。",
      },
      {
        text: "只查有问题的，干净的寝室直接跳过",
        effects: [{ stat: "organization", delta: 3 }, { stat: "charisma", delta: 3 }],
        feedback: "效率极高。烟头叔叔看了看报告说：'还行，比我当年强。'",
      },
    ],
  },
  {
    id: "media_viral",
    title: "一条爆款",
    description: "你发的一篇学生会招新推文突然火了，阅读量破万，评论区有人骂有人夸，青岛王让你看着办。",
    type: "department",
    department: "media",
    stage: ["staff", "minister"],
    priority: 5,
    choices: [
      {
        text: "趁热打铁，再出一篇跟进内容保持热度",
        effects: [{ stat: "charisma", delta: 6 }, { stat: "organization", delta: 3 }],
        feedback: "第二篇也爆了。你成了校园流量担当。",
      },
      {
        text: "在评论区认真回复每一条，不论好评差评",
        effects: [{ stat: "connections", delta: 6 }, { stat: "stress", delta: -3 }],
        feedback: "你的真诚打动了不少路人，评论区风向慢慢变了。",
      },
      {
        text: "不管它，流量来了又走，做自己的事",
        effects: [{ stat: "stress", delta: 5 }, { stat: "academics", delta: 3 }],
        feedback: "热度果然三天就散了，但你手头的正经工作没耽误。",
      },
    ],
  },
  {
    id: "office_budget",
    title: "年度预算会",
    description: "明六六让你代表办公室参加年度预算分配会议。每个部门都想多要钱，会议室里火药味十足。",
    type: "department",
    department: "office",
    stage: ["minister"],
    priority: 5,
    choices: [
      {
        text: "拿出详细数据，用表格说话，谁也别想多占",
        effects: [{ stat: "organization", delta: 6 }, { stat: "budget", delta: 3 }],
        feedback: "各部长看着你投影的Excel哑口无言。明六六微微点头。",
      },
      {
        text: "给每个部门都留一点面子，皆大欢喜但总额超了",
        effects: [{ stat: "connections", delta: 6 }, { stat: "budget", delta: -3 }],
        feedback: "大家脸上笑嘻嘻，但明六六的白眼快翻到后脑勺了。",
      },
      {
        text: "重点支持最有影响力的活动，把钱花在刀刃上",
        effects: [{ stat: "charisma", delta: 4 }, { stat: "organization", delta: 4 }],
        feedback: "有人欢喜有人愁，但你立了一个'做事'的人设。",
      },
    ],
  },

  // === CRISIS EVENTS ===
  {
    id: "crisis_scandal",
    title: "学生会丑闻",
    description: "有人匿名发帖爆料说学生会有干部挪用活动经费吃火锅。舆论炸了，虽然不是你，但整个学生会的公信力都在动摇...",
    type: "crisis",
    stage: ["minister", "president"],
    priority: 9,
    choices: [
      {
        text: "主动发起透明审计，公开所有账目",
        effects: [{ stat: "organization", delta: 8 }, { stat: "charisma", delta: 5 }, { stat: "stress", delta: -8 }],
        feedback: "审计结果证明那个帖子是造谣。透明是最好的公关，舆论反转了。",
        setFlags: ["handled_crisis_well"],
      },
      {
        text: "找发帖人私下聊聊，希望删帖息事",
        effects: [{ stat: "connections", delta: 4 }, { stat: "stress", delta: 3 }, { stat: "charisma", delta: -3 }],
        feedback: "帖子确实删了。但'被公关'的传言又起来了...",
      },
      {
        text: "跟帖回复，用事实一条条反驳",
        effects: [{ stat: "charisma", delta: 6 }, { stat: "stress", delta: -5 }],
        feedback: "你对线到凌晨三点。虽然累，但不少路人被你摆出的事实说服了。",
      },
    ],
  },
  {
    id: "crisis_deadline",
    title: "Deadline灾难",
    description: "明天就是校级活动的审批截止日，而你负责的方案还是一片空白。不是偷懒，是三份需求改了又改...",
    type: "crisis",
    stage: ["staff", "minister"],
    priority: 8,
    choices: [
      {
        text: "通宵赶出一份你觉得最好的方案",
        effects: [{ stat: "organization", delta: 6 }, { stat: "stress", delta: -15 }],
        feedback: "天亮了，方案交了。你趴在桌上睡了一个小时，质量还行。",
      },
      {
        text: "找学长要了一份去年的模板，改了改交上去",
        effects: [{ stat: "stress", delta: 5 }, { stat: "organization", delta: 2 }],
        feedback: "方案是交了，但跟去年的几乎一样。审批的老师看出来了，但懒得说。",
      },
      {
        text: "跟审批方实话实说，争取两个工作日的延期",
        effects: [{ stat: "connections", delta: 5 }, { stat: "charisma", delta: 3 }],
        feedback: "没想到审批老师很通情达理，给了你三天延期。人品守恒。",
      },
    ],
  },

  // === OPPORTUNITY EVENTS ===
  {
    id: "opportunity_scholarship",
    title: "交换生名额",
    description: "学院突然放出一个学期交换名额，去新加坡。要求绩点3.5以上且有学生会经历。你的条件刚好够...但只有一周时间准备材料。",
    type: "opportunity",
    stage: ["minister"],
    priority: 7,
    choices: [
      {
        text: "全力准备申请材料，学生会工作先放一放",
        effects: [{ stat: "academics", delta: 10 }, { stat: "connections", delta: 5 }, { stat: "organization", delta: -3 }],
        feedback: "申请成功了！新学期你带着交换经历回到学校，眼界大开。",
        setFlags: ["exchange_student"],
      },
      {
        text: "放弃申请，手头的工作离不开你",
        effects: [{ stat: "organization", delta: 8 }, { stat: "charisma", delta: 3 }, { stat: "academics", delta: -2 }],
        feedback: "你留下来了，把活动办得漂漂亮亮。有时放弃也是一种选择。",
      },
      {
        text: "两手准备，白天搞活动晚上写材料",
        effects: [{ stat: "organization", delta: 4 }, { stat: "academics", delta: 5 }, { stat: "stress", delta: -10 }],
        feedback: "你几乎累垮了，但两边都勉强及格。也许有些东西不能两全。",
      },
    ],
  },
  {
    id: "opportunity_speech",
    title: "代表发言机会",
    description: "校长要来参加学生座谈会，需要一个学生代表做五分钟发言。这个机会落到了你头上。",
    type: "opportunity",
    stage: ["staff", "minister", "president"],
    priority: 6,
    choices: [
      {
        text: "精心准备发言稿，反复练习，力求完美",
        effects: [{ stat: "charisma", delta: 8 }, { stat: "academics", delta: 3 }],
        feedback: "你的发言被校报全文转载。校长握手时说'年轻人有想法'。",
      },
      {
        text: "即兴发挥，说真心话比念稿子强",
        effects: [{ stat: "charisma", delta: 5 }, { stat: "stress", delta: 3 }],
        feedback: "有几句不够流畅，但真实的表达反而打动了在场的人。",
      },
      {
        text: "婉拒，把机会让给更需要锻炼的同学",
        effects: [{ stat: "connections", delta: 8 }, { stat: "charisma", delta: -2 }],
        feedback: "那个被你推荐的同学后来成了你的铁杆盟友。",
      },
    ],
  },

  // === RELATIONSHIP EVENTS ===
  {
    id: "relationship_rival",
    title: "竞争对手",
    description: "你发现同部门的小李总是在背后说你的坏话，还抢你的功劳。今天他又在群里把你做的东西说成自己的...",
    type: "relationship",
    stage: ["staff", "minister"],
    priority: 5,
    choices: [
      {
        text: "在群里直接晒出聊天记录怼回去",
        effects: [{ stat: "charisma", delta: 5 }, { stat: "connections", delta: -5 }],
        feedback: "群里安静了。你赢了，但很多人觉得你太刚了。",
      },
      {
        text: "私下约他谈谈，看能不能化解矛盾",
        effects: [{ stat: "connections", delta: 5 }, { stat: "stress", delta: 3 }],
        feedback: "长谈之后发现他是因为自卑才这样。你们达成了和解。",
        setFlags: ["resolved_rivalry"],
      },
      {
        text: "默默截图存证，以后再说",
        effects: [{ stat: "stress", delta: 3 }, { stat: "organization", delta: 2 }],
        feedback: "你存好了证据。君子报仇，十年不晚？但仇恨也在消耗你自己。",
      },
    ],
  },
  {
    id: "relationship_graduation",
    title: "学长毕业",
    description: "一直照顾你的大四学长要毕业了，他帮过你很多。临走前约你吃最后一顿饭。",
    type: "relationship",
    stage: ["staff", "minister"],
    priority: 4,
    choices: [
      {
        text: "请他吃顿好的，好好道谢",
        effects: [{ stat: "connections", delta: 8 }, { stat: "budget", delta: -5 }],
        feedback: "饭桌上学长给了你很多掏心窝子的建议。有些东西，课堂上听不到。",
      },
      {
        text: "拉上一帮人给他办个惊喜欢送会",
        effects: [{ stat: "organization", delta: 5 }, { stat: "connections", delta: 5 }],
        feedback: "学长感动得差点哭了。他说这是他大学四年最好的告别。",
      },
      {
        text: "送他一本自己写的祝福册，里面是每个人的留言",
        effects: [{ stat: "charisma", delta: 5 }, { stat: "connections", delta: 4 }],
        feedback: "学长翻看的时候眼眶红了。有些东西比吃饭更珍贵。",
      },
    ],
  },

  // === VOLUNTEER EVENTS (detailed in volunteers.ts) ===
  // Placeholder entries — actual volunteer events defined in volunteers.ts
];
```

- [ ] **Step 2: Write volunteers data**

```typescript
// src/data/volunteers.ts
import { GameEvent } from "../types/game";

export const VOLUNTEER_EVENTS: GameEvent[] = [
  {
    id: "volunteer_nursing_home",
    title: "敬老院慰问",
    description: "生活部组织的敬老院慰问活动。陪老人们聊聊天，帮忙打扫卫生，听听他们讲过去的故事。",
    type: "volunteer",
    volunteerLevel: "school",
    volunteerName: "敬老院慰问",
    baseHours: 8,
    stage: ["staff"],
    priority: 4,
    miniGame: {
      type: "memory",
      config: { timeLimit: 30, pairCount: 6 },
    },
    bonus: { connections: 3, charisma: 2 },
    choices: [
      {
        text: "报名参加",
        effects: [],
        feedback: "你走进了敬老院的大门...",
      },
      {
        text: "下次再去",
        effects: [{ stat: "stress", delta: 3 }],
        feedback: "你说下次再去。但'下次'是什么时候呢？",
      },
    ],
  },
  {
    id: "volunteer_expo",
    title: "消博会志愿者",
    description: "市级消博会在会展中心举办，需要大学生志愿者协助引导、翻译和秩序维护。能接触到很多企业和外宾。",
    type: "volunteer",
    volunteerLevel: "city",
    volunteerName: "消博会志愿服务",
    baseHours: 15,
    stage: ["staff", "minister"],
    priority: 5,
    miniGame: {
      type: "assign",
      config: { timeLimit: 20, taskCount: 6 },
    },
    bonus: { connections: 5, organization: 3 },
    choices: [
      {
        text: "立刻报名",
        effects: [],
        feedback: "你穿上了志愿者的红马甲...",
      },
      {
        text: "考虑考虑",
        effects: [{ stat: "stress", delta: 2 }],
        feedback: "名额很快就被抢光了。下次手快点吧。",
      },
    ],
  },
  {
    id: "volunteer_sports_meet",
    title: "运动会志愿者",
    description: "校运动会需要大量志愿者：检录、计时、维持秩序、急救协助。虽然辛苦但是志愿时长给得很足。",
    type: "volunteer",
    volunteerLevel: "city",
    volunteerName: "运动会志愿服务",
    baseHours: 12,
    stage: ["staff", "minister"],
    priority: 5,
    miniGame: {
      type: "click",
      config: { timeLimit: 15, targetCount: 20 },
    },
    bonus: { organization: 4, stress: 3 },
    choices: [
      {
        text: "报名参加",
        effects: [],
        feedback: "你站在操场边上，比赛马上开始...",
      },
      {
        text: "太累了，算了",
        effects: [{ stat: "stress", delta: 5 }],
        feedback: "你选择在寝室吹空调。但看到别人秀志愿证书时有点后悔。",
      },
    ],
  },
  {
    id: "volunteer_teaching",
    title: "山区支教",
    description: "省级支教项目，去偏远山区小学支教一个暑假。条件艰苦但意义深远，这段经历会让你成长很多。",
    type: "volunteer",
    volunteerLevel: "province",
    volunteerName: "山区支教",
    baseHours: 30,
    stage: ["minister", "president"],
    priority: 6,
    miniGame: {
      type: "memory",
      config: { timeLimit: 25, pairCount: 8 },
    },
    bonus: { charisma: 6, academics: 4 },
    choices: [
      {
        text: "背上行囊出发",
        effects: [],
        feedback: "你坐上了去山区的绿皮火车...",
      },
      {
        text: "暑假有安排了",
        effects: [{ stat: "stress", delta: 3 }, { stat: "connections", delta: -2 }],
        feedback: "你婉拒了。但听去的同学说那是他们大学最难忘的经历。",
      },
    ],
  },
  {
    id: "volunteer_summit",
    title: "国际峰会服务",
    description: "国家级国际青年峰会在你所在的城市举办，招募大学生志愿者。能见到各国青年领袖，机会难得。",
    type: "volunteer",
    volunteerLevel: "national",
    volunteerName: "国际峰会志愿服务",
    baseHours: 40,
    stage: ["president"],
    priority: 8,
    miniGame: {
      type: "assign",
      config: { timeLimit: 18, taskCount: 8 },
    },
    bonus: { connections: 8, charisma: 5, stress: 4 },
    choices: [
      {
        text: "全力以赴争取名额",
        effects: [],
        feedback: "你通过了层层筛选，穿上了峰会的蓝色制服...",
      },
      {
        text: "太远太麻烦",
        effects: [{ stat: "connections", delta: -3 }],
        feedback: "你放弃了。后来在新闻上看到峰会报道，心里有一丝遗憾。",
      },
    ],
  },
];
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/data/events.ts src/data/volunteers.ts
git commit -m "feat: add game events and volunteer event data"
```

---

### Task 7: Utility functions — event picker and save/load

**Files:**
- Create: `src/utils/eventPicker.ts`
- Create: `src/utils/saveLoad.ts`

- [ ] **Step 1: Write event picker**

```typescript
// src/utils/eventPicker.ts
import { GameEvent, GameState } from "../types/game";
import { EVENTS } from "../data/events";
import { VOLUNTEER_EVENTS } from "../data/volunteers";

const ALL_EVENTS = [...EVENTS, ...VOLUNTEER_EVENTS];

export function pickEvent(state: GameState): GameEvent | null {
  const { stage, department, stats, eventHistory, flags } = state;

  const candidates = ALL_EVENTS.filter((event) => {
    // Stage match
    if (!event.stage.includes(stage)) return false;
    // Already seen
    if (eventHistory.includes(event.id)) return false;
    // Department filter
    if (event.department && event.department !== department) return false;
    // Conditions
    if (event.condition) {
      if (event.condition.minStats) {
        for (const [key, val] of Object.entries(event.condition.minStats)) {
          if ((stats as any)[key] < val!) return false;
        }
      }
      if (event.condition.maxStats) {
        for (const [key, val] of Object.entries(event.condition.maxStats)) {
          if ((stats as any)[key] > val!) return false;
        }
      }
      if (event.condition.requiredFlags) {
        for (const f of event.condition.requiredFlags) {
          if (!flags[f]) return false;
        }
      }
      if (event.condition.excludeFlags) {
        for (const f of event.condition.excludeFlags) {
          if (flags[f]) return false;
        }
      }
    }
    return true;
  });

  if (candidates.length === 0) return null;

  // Weight by priority, then random pick
  const weighted = candidates.flatMap((e) => Array(e.priority).fill(e));
  return weighted[Math.floor(Math.random() * weighted.length)];
}
```

- [ ] **Step 2: Write save/load**

```typescript
// src/utils/saveLoad.ts
import { GameState } from "../types/game";
import { SaveData } from "../types/game";

const SAVE_PREFIX = "student_union_save_";

export function saveGame(state: GameState, slot: number): boolean {
  try {
    const data: SaveData = {
      version: 1,
      timestamp: Date.now(),
      state,
    };
    localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadGame(slot: number): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_PREFIX + slot);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function deleteSave(slot: number): void {
  localStorage.removeItem(SAVE_PREFIX + slot);
}

export function getSaveSlots(): { slot: number; data: SaveData | null }[] {
  return [1, 2, 3].map((slot) => ({
    slot,
    data: loadGame(slot),
  }));
}
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/utils/eventPicker.ts src/utils/saveLoad.ts
git commit -m "feat: add event picker and save/load utilities"
```

---

### Task 8: App component and phase routing

**Files:**
- Create: `src/App.tsx`
- Create: `src/App.module.css`

- [ ] **Step 1: Write App.tsx**

```tsx
// src/App.tsx
import { useGameState } from "./context/GameContext";
import { GameProvider } from "./context/GameContext";
import TitleScreen from "./components/TitleScreen/TitleScreen";
import NameInput from "./components/NameInput/NameInput";
import DepartmentSelect from "./components/DepartmentSelect/DepartmentSelect";
import InterviewScreen from "./components/InterviewScreen/InterviewScreen";
import WorkBadgeCG from "./components/WorkBadgeCG/WorkBadgeCG";
import GameScreen from "./components/GameScreen/GameScreen";
import MiniGame from "./components/MiniGame/MiniGame";
import EndingScreen from "./components/EndingScreen/EndingScreen";
import styles from "./App.module.css";

function AppRouter() {
  const { gamePhase } = useGameState();

  switch (gamePhase) {
    case "title":
      return <TitleScreen />;
    case "name_input":
      return <NameInput />;
    case "department_select":
      return <DepartmentSelect />;
    case "interview":
      return <InterviewScreen />;
    case "badge_cg":
      return <WorkBadgeCG />;
    case "game":
      return <GameScreen />;
    case "minigame":
      return <MiniGame />;
    case "ending":
      return <EndingScreen />;
    default:
      return <TitleScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <div className={styles.app}>
        <AppRouter />
      </div>
    </GameProvider>
  );
}
```

- [ ] **Step 2: Write App.module.css**

```css
/* src/App.module.css */
.app {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
```

- [ ] **Step 3: Verify compiles (will fail until components exist — that's fine for now)**

Run: `npx tsc --noEmit` (expect errors about missing component modules)

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/App.module.css
git commit -m "feat: add App component with phase-based routing"
```

---

### Task 9: TitleScreen component

**Files:**
- Create: `src/components/TitleScreen/TitleScreen.tsx`
- Create: `src/components/TitleScreen/TitleScreen.module.css`

- [ ] **Step 1: Write TitleScreen**

```tsx
// src/components/TitleScreen/TitleScreen.tsx
import { useGameDispatch } from "../../context/GameContext";
import { loadGame } from "../../utils/saveLoad";
import styles from "./TitleScreen.module.css";

export default function TitleScreen() {
  const dispatch = useGameDispatch();

  const handleNewGame = () => {
    dispatch({ type: "SET_PHASE", phase: "name_input" });
  };

  const handleContinue = () => {
    const save = loadGame(1);
    if (save) {
      dispatch({ type: "LOAD_SAVE", state: save.state });
    }
  };

  const hasSave = loadGame(1) !== null;

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.emblem}>NM</div>
        <h1 className={styles.title}>学生会模拟器</h1>
        <p className={styles.subtitle}>牛马大学 · 命运的十字路口</p>
        <div className={styles.buttons}>
          <button className={styles.btnPrimary} onClick={handleNewGame}>
            开始游戏
          </button>
          {hasSave && (
            <button className={styles.btnSecondary} onClick={handleContinue}>
              继续游戏
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write TitleScreen.module.css**

```css
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(240, 192, 64, 0.05) 0%, transparent 60%);
}

.content {
  position: relative;
  text-align: center;
  z-index: 1;
}

.emblem {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-gold);
  color: var(--color-primary);
  font-size: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.title {
  font-size: 36px;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: 4px;
}

.subtitle {
  font-size: var(--font-size-base);
  color: #999;
  margin-bottom: 40px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btnPrimary {
  padding: 12px 48px;
  border: 2px solid var(--color-gold);
  background: transparent;
  color: var(--color-gold);
  font-size: 16px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.btnPrimary:hover {
  background: var(--color-gold);
  color: var(--color-primary);
}

.btnSecondary {
  padding: 10px 32px;
  border: 1px solid #666;
  background: transparent;
  color: #999;
  font-size: var(--font-size-base);
  border-radius: 20px;
  cursor: pointer;
}

.btnSecondary:hover {
  border-color: #999;
  color: #fff;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TitleScreen/
git commit -m "feat: add TitleScreen with new game and continue"
```

---

### Task 10: NameInput component

**Files:**
- Create: `src/components/NameInput/NameInput.tsx`
- Create: `src/components/NameInput/NameInput.module.css`

- [ ] **Step 1: Write NameInput**

```tsx
// src/components/NameInput/NameInput.tsx
import { useState } from "react";
import { useGameDispatch } from "../../context/GameContext";
import styles from "./NameInput.module.css";

export default function NameInput() {
  const dispatch = useGameDispatch();
  const [name, setName] = useState("");
  const MIN_LENGTH = 2;

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (trimmed.length < MIN_LENGTH) return;
    dispatch({ type: "SET_PLAYER_NAME", name: trimmed });
    dispatch({ type: "SET_PHASE", phase: "department_select" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>请输入你的名字</h2>
        <p className={styles.hint}>这个名字将出现在工牌和学生会剧情中</p>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          placeholder="输入姓名..."
          maxLength={10}
          autoFocus
        />
        <button
          className={styles.btn}
          onClick={handleConfirm}
          disabled={name.trim().length < MIN_LENGTH}
        >
          确认
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write NameInput.module.css**

```css
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-warm);
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  width: 380px;
}

.title {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  margin-bottom: 8px;
}

.hint {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0d5c5;
  border-radius: 8px;
  font-size: 18px;
  text-align: center;
  outline: none;
  margin-bottom: 20px;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--color-gold);
}

.btn {
  padding: 10px 40px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/NameInput/
git commit -m "feat: add NameInput component"
```

---

### Task 11: DepartmentSelect component

**Files:**
- Create: `src/components/DepartmentSelect/DepartmentSelect.tsx`
- Create: `src/components/DepartmentSelect/DepartmentSelect.module.css`

- [ ] **Step 1: Write DepartmentSelect**

```tsx
// src/components/DepartmentSelect/DepartmentSelect.tsx
import { useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { Department } from "../../types/game";
import styles from "./DepartmentSelect.module.css";

export default function DepartmentSelect() {
  const dispatch = useGameDispatch();

  const handleSelect = (dept: Department) => {
    dispatch({ type: "SET_DEPARTMENT", department: dept });
    dispatch({ type: "SET_PHASE", phase: "interview" });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>选择你的部门</h2>
      <p className={styles.subtitle}>点击部门卡牌，开始面试</p>
      <div className={styles.grid}>
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className={styles.card}
            style={{ backgroundColor: dept.color }}
            onClick={() => handleSelect(dept.id)}
          >
            <svg
              className={styles.silhouette}
              width="48"
              height="56"
              viewBox="0 0 64 64"
            >
              <ellipse cx="32" cy="20" rx="14" ry="14" fill="#1a1a1a" />
              <path
                d="M8 58c0-16 10.7-28 24-28s24 12 24 28"
                fill="#1a1a1a"
              />
            </svg>
            <div className={styles.deptName}>{dept.name}</div>
            <div className={styles.headName}>{dept.headName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write DepartmentSelect.module.css**

```css
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-warm);
  padding: 40px;
}

.title {
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  margin-bottom: 8px;
}

.subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 540px;
  width: 100%;
}

.card {
  border-radius: 12px;
  padding: 20px 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.silhouette {
  display: block;
  margin: 0 auto 8px;
}

.deptName {
  font-size: var(--font-size-base);
  font-weight: bold;
  color: var(--text-primary);
}

.headName {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 2px;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DepartmentSelect/
git commit -m "feat: add DepartmentSelect with 2x3 card grid"
```

---

### Task 12: InterviewScreen component

**Files:**
- Create: `src/components/InterviewScreen/InterviewScreen.tsx`
- Create: `src/components/InterviewScreen/InterviewScreen.module.css`

- [ ] **Step 1: Write InterviewScreen**

```tsx
// src/components/InterviewScreen/InterviewScreen.tsx
import { useState } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { INTERVIEWS } from "../../data/interviews";
import { Department } from "../../types/game";
import styles from "./InterviewScreen.module.css";

export default function InterviewScreen() {
  const { department, currentInterviewIndex } = useGameState();
  const dispatch = useGameDispatch();
  const [feedback, setFeedback] = useState<string | null>(null);

  const dept = DEPARTMENTS.find((d) => d.id === department)!;
  const questions = INTERVIEWS[department as Exclude<Department, null>] || [];
  const currentQ = questions[currentInterviewIndex];

  if (!currentQ) {
    dispatch({ type: "SET_PHASE", phase: "badge_cg" });
    return null;
  }

  const handleChoice = (index: number) => {
    const choice = currentQ.choices[index];
    setFeedback(choice.feedback);
    setTimeout(() => {
      setFeedback(null);
      dispatch({ type: "ANSWER_INTERVIEW", effects: choice.effects });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      {/* Left: Character silhouette */}
      <div className={styles.leftPanel}>
        <svg width="120" height="160" viewBox="0 0 140 180">
          <ellipse cx="70" cy="48" rx="36" ry="36" fill="#0a0a0a" />
          <path d="M20 160c0-44 22-72 50-72s50 28 50 72" fill="#0a0a0a" />
          <ellipse cx="70" cy="90" rx="55" ry="18" fill="#0a0a0a" />
        </svg>
        <div className={styles.headName}>{dept.headName}</div>
        <div className={styles.headRole}>{dept.name} · 部长</div>
        <div className={styles.headTagline}>"{dept.headTagline}"</div>
      </div>

      {/* Right: Dialog */}
      <div className={styles.rightPanel}>
        {feedback ? (
          <div className={styles.feedback}>{feedback}</div>
        ) : (
          <>
            <div className={styles.questionBubble}>
              <div className={styles.questionNum}>
                问题 {currentInterviewIndex + 1}/2
              </div>
              <div className={styles.questionText}>{currentQ.question}</div>
            </div>
            <div className={styles.choices}>
              {currentQ.choices.map((c, i) => (
                <button
                  key={i}
                  className={styles.choiceBtn}
                  onClick={() => handleChoice(i)}
                >
                  <span className={styles.choiceLabel}>
                    {String.fromCharCode(65 + i)}.
                  </span>{" "}
                  {c.text}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write InterviewScreen.module.css**

```css
.container {
  width: 100%;
  height: 100%;
  display: flex;
  background: linear-gradient(180deg, #3a3028, #5a4a38);
}

.leftPanel {
  width: 35%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.headName {
  color: #e8d5b0;
  font-weight: bold;
  font-size: 18px;
  margin-top: 16px;
}

.headRole {
  color: #b8a088;
  font-size: 12px;
  margin-top: 4px;
}

.headTagline {
  color: #8b7b6b;
  font-size: 11px;
  margin-top: 6px;
  font-style: italic;
}

.rightPanel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 48px;
  justify-content: center;
}

.questionBubble {
  background: #fff;
  border-radius: 8px 8px 8px 0;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.questionNum {
  font-size: 11px;
  color: #999;
  margin-bottom: 8px;
}

.questionText {
  font-size: 16px;
  color: #333;
  line-height: 1.7;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.choiceBtn {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
}

.choiceBtn:hover {
  background: #fff;
  border-color: #d4a574;
  transform: translateX(4px);
}

.choiceLabel {
  color: #8b7355;
  font-weight: bold;
}

.feedback {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 32px;
  font-size: 18px;
  color: #333;
  text-align: center;
  line-height: 1.8;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/InterviewScreen/
git commit -m "feat: add InterviewScreen with left silhouette + right dialog"
```

---

### Task 13: WorkBadgeCG component

**Files:**
- Create: `src/components/WorkBadgeCG/WorkBadgeCG.tsx`
- Create: `src/components/WorkBadgeCG/WorkBadgeCG.module.css`

- [ ] **Step 1: Write WorkBadgeCG**

```tsx
// src/components/WorkBadgeCG/WorkBadgeCG.tsx
import { useState, useEffect } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { GameStage } from "../../types/game";
import styles from "./WorkBadgeCG.module.css";

const STAGE_LABELS: Record<GameStage, string> = {
  staff: "干事",
  minister: "部长",
  president: "主席",
};

const STAGE_MATERIAL: Record<GameStage, string> = {
  staff: "普通白卡纸",
  minister: "哑光覆膜",
  president: "烫金压纹",
};

const STAGE_BORDER: Record<GameStage, string> = {
  staff: "#bdc3c7",
  minister: "#3498db",
  president: "#f0c040",
};

const getStageAfter = (stage: GameStage): GameStage => {
  if (stage === "staff") return "minister";
  return "president";
};

export default function WorkBadgeCG() {
  const { playerName, department, stage } = useGameState();
  const dispatch = useGameDispatch();
  const [animationPhase, setAnimationPhase] = useState<"enter" | "show" | "exit">("enter");

  const dept = DEPARTMENTS.find((d) => d.id === department)!;
  const badgeStage: GameStage = stage === "staff" && animationPhase !== "enter" ? "staff" : stage;
  const nextStage = stage === "president" ? null : getStageAfter(stage);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimationPhase("show"), 800);
    const t2 = setTimeout(() => {
      if (nextStage) {
        dispatch({ type: "SET_STAGE", stage: nextStage });
      }
      dispatch({ type: "SET_PHASE", phase: "game" });
      dispatch({ type: "ADVANCE_WEEK" });
    }, 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.badge} ${styles[animationPhase]}`}>
        {/* Header */}
        <div className={styles.badgeHeader}>
          <div className={styles.emblem}>NM</div>
          <div>
            <div className={styles.uniName}>牛马大学学生会</div>
            <div className={styles.uniSub}>NIU MA UNIVERSITY STUDENT UNION</div>
          </div>
        </div>

        {/* Body */}
        <div className={styles.badgeBody}>
          <div className={styles.photoSlot}>证件照</div>
          <div className={styles.info}>
            <div className={styles.field}>
              <span className={styles.label}>姓名 / NAME</span>
              <span className={styles.value}>{playerName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>部门 / DEPARTMENT</span>
              <span className={styles.value} style={{ color: "#c0392b" }}>
                {dept.name}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>职位 / POSITION</span>
              <span className={styles.value} style={{ color: "#27ae60" }}>
                {STAGE_LABELS[badgeStage]}
              </span>
            </div>
            <div className={styles.badgeId}>
              工号: NMU-SU-{String(Date.now()).slice(-7)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.badgeFooter}>
          <div>有效期至 {new Date().getFullYear() + 1}年6月</div>
          <div>材质: {STAGE_MATERIAL[badgeStage]} | 牛马大学学生会监制</div>
        </div>
      </div>

      <p className={styles.stageText}>
        {badgeStage === "staff" ? "欢迎加入学生会！" : badgeStage === "minister" ? "恭喜晋升部长！" : "恭喜当选主席！"}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Write WorkBadgeCG.module.css**

```css
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, #1a1a2e 0%, #0a0a14 100%);
  gap: 24px;
}

.badge {
  width: 380px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 80px rgba(240, 192, 64, 0.2);
}

.enter {
  animation: slideUp 0.8s ease-out;
}

.show {
  animation: glow 1.5s ease-in-out infinite alternate;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(60px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glow {
  from { box-shadow: 0 0 40px rgba(240, 192, 64, 0.15); }
  to { box-shadow: 0 0 80px rgba(240, 192, 64, 0.35); }
}

.badgeHeader {
  background: #1a3a5c;
  color: #fff;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.emblem {
  width: 44px;
  height: 44px;
  background: #f0c040;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #1a3a5c;
}

.uniName { font-size: 15px; font-weight: bold; }
.uniSub { font-size: 10px; opacity: 0.7; }

.badgeBody {
  padding: 24px 20px;
  display: flex;
  gap: 16px;
}

.photoSlot {
  width: 80px;
  height: 100px;
  background: #e8edf2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #999;
  border: 1px dashed #ccc;
}

.info { flex: 1; }
.field { margin-bottom: 12px; }
.label { display: block; font-size: 10px; color: #999; margin-bottom: 2px; }
.value { font-size: 18px; font-weight: bold; color: #1a3a5c; }
.badgeId { font-size: 10px; color: #999; margin-top: 8px; }

.badgeFooter {
  background: #f0f4f8;
  padding: 8px 20px;
  font-size: 10px;
  color: #999;
  text-align: center;
  line-height: 1.6;
}

.stageText {
  color: #f0c040;
  font-size: 20px;
  font-weight: bold;
  animation: fadeIn 0.8s ease 0.5s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/WorkBadgeCG/
git commit -m "feat: add WorkBadgeCG with stage-based badge animation"
```

---

### Task 14: GameScreen — TopBar

**Files:**
- Create: `src/components/GameScreen/TopBar.tsx`
- Create: `src/components/GameScreen/TopBar.module.css`

- [ ] **Step 1: Write TopBar**

```tsx
// src/components/GameScreen/TopBar.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { saveGame } from "../../utils/saveLoad";
import styles from "./TopBar.module.css";

const STAGE_LABELS: Record<string, string> = {
  staff: "干事",
  minister: "部长",
  president: "主席",
};

export default function TopBar() {
  const { playerName, department, stage, week, semester } = useGameState();
  const dispatch = useGameDispatch();
  const dept = DEPARTMENTS.find((d) => d.id === department)!;

  const handleSave = () => {
    // We need the full state — accessed via a workaround
    // Actually let's use a ref pattern or just save from GameScreen
  };

  const handleEnding = () => {
    dispatch({ type: "SET_ENDING" });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.logo}>学生会模拟器</span>
        <span className={styles.stageBadge}>{STAGE_LABELS[stage]}</span>
      </div>
      <div className={styles.center}>
        <span>第{week}周 · 大{Math.ceil(semester / 2)}{semester % 2 === 1 ? "上" : "下"}</span>
      </div>
      <div className={styles.right}>
        <span>{playerName}</span>
        <span className={styles.deptBadge} style={{ backgroundColor: dept.color, color: "#333" }}>
          {dept.name}
        </span>
        <button className={styles.endBtn} onClick={handleEnding}>
          结局
        </button>
      </div>
    </div>
  );
}
```

**Note:** The save button will be deferred to GameScreen where full state is accessible.

- [ ] **Step 2: Write TopBar.module.css**

```css
.bar {
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px;
  font-size: 13px;
  height: 44px;
}

.left, .center, .right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo { font-weight: bold; }

.stageBadge {
  background: #2ecc71;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
}

.deptBadge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
}

.endBtn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.6);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 11px;
  cursor: pointer;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GameScreen/TopBar.tsx src/components/GameScreen/TopBar.module.css
git commit -m "feat: add TopBar with stage/week/name display"
```

---

### Task 15: GameScreen — StatsPanel

**Files:**
- Create: `src/components/GameScreen/StatsPanel.tsx`
- Create: `src/components/GameScreen/StatsPanel.module.css`

- [ ] **Step 1: Write StatsPanel**

```tsx
// src/components/GameScreen/StatsPanel.tsx
import { useGameState } from "../../context/GameContext";
import styles from "./StatsPanel.module.css";

interface StatItem {
  key: string;
  label: string;
  color: string;
  max: number;
}

const STATS: StatItem[] = [
  { key: "organization", label: "组织力", color: "#3498db", max: 100 },
  { key: "connections", label: "人脉", color: "#2ecc71", max: 100 },
  { key: "academics", label: "学习力", color: "#e67e22", max: 100 },
  { key: "charisma", label: "魅力值", color: "#9b59b6", max: 100 },
  { key: "stress", label: "抗压力", color: "#e74c3c", max: 100 },
  { key: "budget", label: "经费", color: "#f39c12", max: 100 },
  { key: "volunteerHours", label: "志愿时长", color: "#e91e63", max: 100 },
];

export default function StatsPanel() {
  const { stats, stage } = useGameState();

  const promotionCheck = () => {
    if (stage === "president") return null;
    const nextStage = stage === "staff" ? "部长" : "主席";
    const conditions =
      stage === "staff"
        ? [
            { label: "组织力", current: stats.organization, target: 40 },
            { label: "魅力值", current: stats.charisma, target: 30 },
            { label: "志愿时长", current: stats.volunteerHours, target: 20 },
          ]
        : [
            { label: "组织力", current: stats.organization, target: 65 },
            { label: "人脉", current: stats.connections, target: 50 },
            { label: "魅力值", current: stats.charisma, target: 50 },
            { label: "志愿时长", current: stats.volunteerHours, target: 50 },
          ];

    return { nextStage, conditions };
  };

  const promo = promotionCheck();

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>属性面板</h3>
      {STATS.map((s) => {
        const value = stats[s.key as keyof typeof stats];
        const pct = (value / s.max) * 100;
        return (
          <div key={s.key} className={styles.statRow}>
            <div className={styles.statLabel}>
              <span>{s.label}</span>
              <span className={styles.statValue}>
                {s.key === "volunteerHours" ? `${value}h` : value}
              </span>
            </div>
            <div className={styles.barBg}>
              <div
                className={styles.barFill}
                style={{ width: `${pct}%`, backgroundColor: s.color }}
              />
            </div>
          </div>
        );
      })}

      {promo && (
        <div className={styles.promoBox}>
          <div className={styles.promoTitle}>晋升{promo.nextStage}条件</div>
          {promo.conditions.map((c) => (
            <div
              key={c.label}
              className={styles.promoCond}
              style={{ color: c.current >= c.target ? "#2ecc71" : "#e74c3c" }}
            >
              {c.label}: {c.current}/{c.target}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write StatsPanel.module.css**

```css
.panel {
  width: 260px;
  background: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 1px solid #e8e0d5;
  overflow-y: auto;
}

.title {
  font-size: 13px;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 12px;
}

.statRow { margin-bottom: 6px; }

.statLabel {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 2px;
}

.statValue { font-weight: bold; }

.barBg {
  height: 5px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.barFill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.promoBox {
  margin-top: auto;
  border: 1px dashed #ccc;
  border-radius: 8px;
  padding: 10px;
  font-size: 11px;
}

.promoTitle {
  text-align: center;
  color: #999;
  margin-bottom: 4px;
}

.promoCond {
  font-size: 10px;
  line-height: 1.6;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GameScreen/StatsPanel.tsx src/components/GameScreen/StatsPanel.module.css
git commit -m "feat: add StatsPanel with 7 stat bars and promotion tracker"
```

---

### Task 16: GameScreen — EventCard and EventLog

**Files:**
- Create: `src/components/GameScreen/EventCard.tsx`
- Create: `src/components/GameScreen/EventCard.module.css`
- Create: `src/components/GameScreen/EventLog.tsx`
- Create: `src/components/GameScreen/EventLog.module.css`

- [ ] **Step 1: Write EventCard**

```tsx
// src/components/GameScreen/EventCard.tsx
import { useState } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { GameEvent } from "../../types/game";
import styles from "./EventCard.module.css";

interface Props {
  event: GameEvent;
}

export default function EventCard({ event }: Props) {
  const dispatch = useGameDispatch();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);

  const handleChoice = (index: number) => {
    const choice = event.choices[index];

    // If it's a volunteer event with mini-game
    if (event.type === "volunteer" && event.miniGame && choice.effects.length === 0) {
      dispatch({
        type: "START_MINIGAME",
        type: event.miniGame.type,
        config: event.miniGame.config,
        volunteerEventId: event.id,
      });
      return;
    }

    setFeedback(choice.feedback);
    setExiting(true);
    setTimeout(() => {
      dispatch({
        type: "APPLY_CHOICE",
        effects: choice.effects,
        feedback: choice.feedback,
        flags: choice.setFlags,
        eventId: event.id,
        eventTitle: event.title,
      });
      dispatch({ type: "ADVANCE_WEEK" });
    }, 1200);
  };

  const typeLabels: Record<string, string> = {
    daily: "日常事件",
    department: "部门事件",
    relationship: "人际事件",
    crisis: "危机事件",
    opportunity: "机遇事件",
    volunteer: "志愿服务",
  };

  return (
    <div className={`${styles.card} ${exiting ? styles.cardExit : styles.cardEnter}`}>
      <div className={styles.image}>
        <div className={styles.imagePlaceholder}>
          {event.type === "volunteer" ? "❤️" : event.type === "crisis" ? "⚠️" : event.type === "opportunity" ? "🌟" : "📖"}
        </div>
        <span className={styles.typeBadge}>{typeLabels[event.type]}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.desc}>{event.description}</p>

        {feedback ? (
          <div className={styles.feedback}>{feedback}</div>
        ) : (
          <div className={styles.choices}>
            {event.choices.map((choice, i) => (
              <button
                key={i}
                className={styles.choiceBtn}
                onClick={() => handleChoice(i)}
              >
                <span className={styles.choiceLetter}>
                  {String.fromCharCode(65 + i)}.
                </span>{" "}
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write EventCard.module.css**

```css
.card {
  width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.cardEnter {
  animation: slideIn 0.4s ease-out;
}

.cardExit {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes slideOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

.image {
  height: 140px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.imagePlaceholder {
  font-size: 56px;
}

.typeBadge {
  position: absolute;
  top: 10px;
  left: 14px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 10px;
}

.body {
  padding: 20px;
}

.title {
  font-size: 18px;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.desc {
  font-size: 13px;
  color: #666;
  line-height: 1.7;
  margin-bottom: 20px;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.choiceBtn {
  border: 2px solid #e0d5c5;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  text-align: left;
  background: #fefefe;
  cursor: pointer;
  transition: all 0.2s;
}

.choiceBtn:hover {
  border-color: var(--color-warm-brown);
  background: #fdfaf7;
  transform: translateX(4px);
}

.choiceLetter {
  color: var(--color-accent);
  font-weight: bold;
}

.feedback {
  font-size: 15px;
  color: #333;
  text-align: center;
  padding: 20px;
  line-height: 1.8;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 3: Write EventLog**

```tsx
// src/components/GameScreen/EventLog.tsx
import { useGameState } from "../../context/GameContext";
import styles from "./EventLog.module.css";

export default function EventLog() {
  const { eventLog } = useGameState();
  const recent = [...eventLog].reverse().slice(0, 5);

  return (
    <div className={styles.log}>
      <h3 className={styles.title}>近期事件</h3>
      {recent.length === 0 ? (
        <p className={styles.empty}>尚未发生任何事件</p>
      ) : (
        recent.map((entry, i) => (
          <div key={i} className={styles.entry}>
            <span className={styles.week}>第{entry.week}周</span>
            <span className={styles.text}>
              {entry.title} — {entry.result}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
```

- [ ] **Step 4: Write EventLog.module.css**

```css
.log {
  padding: 8px 0;
}

.title {
  font-size: 11px;
  color: #999;
  margin-bottom: 8px;
}

.entry {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
  line-height: 1.5;
}

.week {
  color: var(--color-primary);
  margin-right: 6px;
  font-weight: bold;
}

.text { color: #888; }
.empty { font-size: 10px; color: #ccc; }
```

- [ ] **Step 5: Commit**

```bash
git add src/components/GameScreen/EventCard.tsx src/components/GameScreen/EventCard.module.css src/components/GameScreen/EventLog.tsx src/components/GameScreen/EventLog.module.css
git commit -m "feat: add EventCard and EventLog components"
```

---

### Task 17: GameScreen — main layout

**Files:**
- Create: `src/components/GameScreen/GameScreen.tsx`
- Create: `src/components/GameScreen/GameScreen.module.css`

- [ ] **Step 1: Write GameScreen**

```tsx
// src/components/GameScreen/GameScreen.tsx
import { useEffect, useCallback } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { pickEvent } from "../../utils/eventPicker";
import { saveGame } from "../../utils/saveLoad";
import TopBar from "./TopBar";
import StatsPanel from "./StatsPanel";
import EventCard from "./EventCard";
import EventLog from "./EventLog";
import styles from "./GameScreen.module.css";

export default function GameScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const drawEvent = useCallback(() => {
    if (!state.currentEvent) {
      const event = pickEvent(state);
      if (event) {
        dispatch({ type: "SET_CURRENT_EVENT", event });
      } else {
        // No more events — go to ending
        dispatch({ type: "SET_ENDING" });
      }
    }
  }, [state.currentEvent, state.week]);

  useEffect(() => {
    drawEvent();
  }, [state.week]);

  const handleSave = (slot: number) => {
    saveGame(state, slot);
    alert(`已保存到存档位 ${slot}`);
  };

  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.main}>
        <div className={styles.eventArea}>
          {state.currentEvent ? (
            <EventCard event={state.currentEvent} />
          ) : (
            <div className={styles.noEvent}>加载中...</div>
          )}
        </div>
        <div className={styles.sidebar}>
          <StatsPanel />
          <div className={styles.saveSection}>
            <span className={styles.saveLabel}>存档</span>
            <div className={styles.saveBtns}>
              {[1, 2, 3].map((slot) => (
                <button
                  key={slot}
                  className={styles.saveBtn}
                  onClick={() => handleSave(slot)}
                >
                  位{slot}
                </button>
              ))}
            </div>
          </div>
          <EventLog />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write GameScreen.module.css**

```css
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-warm);
}

.main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.eventArea {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 1px solid #e8e0d5;
}

.noEvent {
  font-size: 18px;
  color: #999;
}

.saveSection {
  padding: 8px 16px;
  border-top: 1px solid #eee;
}

.saveLabel {
  font-size: 11px;
  color: #999;
}

.saveBtns {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.saveBtn {
  flex: 1;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  font-size: 10px;
  cursor: pointer;
}

.saveBtn:hover {
  background: #f8f8f8;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GameScreen/GameScreen.tsx src/components/GameScreen/GameScreen.module.css
git commit -m "feat: add GameScreen main layout with sidebar"
```

---

### Task 18: MiniGame components — ClickGame, MemoryGame, AssignGame

**Files:**
- Create: `src/components/MiniGame/MiniGame.tsx`
- Create: `src/components/MiniGame/MiniGame.module.css`
- Create: `src/components/MiniGame/ClickGame.tsx`
- Create: `src/components/MiniGame/MemoryGame.tsx`
- Create: `src/components/MiniGame/AssignGame.tsx`

- [ ] **Step 1: Write ClickGame**

```tsx
// src/components/MiniGame/ClickGame.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { MiniGameConfig, MiniGameRating } from "../../types/game";
import styles from "./MiniGame.module.css";

interface Props {
  config: MiniGameConfig;
  onComplete: (rating: MiniGameRating) => void;
}

export default function ClickGame({ config, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<number>(0);

  const moveTarget = useCallback(() => {
    setTargetPos({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    });
  }, []);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!running) {
      const total = hits + misses;
      const accuracy = total > 0 ? hits / total : 0;
      const rating: MiniGameRating = accuracy >= 0.85 ? "S" : accuracy >= 0.6 ? "A" : "B";
      setTimeout(() => onComplete(rating), 500);
    }
  }, [running]);

  const handleTarget = () => {
    if (!running) return;
    setHits((h) => h + 1);
    moveTarget();
  };

  const handleMiss = () => {
    if (!running) return;
    setMisses((m) => m + 1);
    moveTarget();
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>命中: {hits}</span>
        <span>失误: {misses}</span>
      </div>
      <div className={styles.playArea} onClick={handleMiss}>
        <div
          className={styles.target}
          style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
          onClick={(e) => {
            e.stopPropagation();
            handleTarget();
          }}
        ></div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write MemoryGame**

```tsx
// src/components/MiniGame/MemoryGame.tsx
import { useState, useEffect } from "react";
import { MiniGameConfig, MiniGameRating } from "../../types/game";
import styles from "./MiniGame.module.css";

interface Card {
  id: number;
  pairId: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ["🌸", "⭐", "🎈", "🎵", "🌈", "🍀", "💎", "🔥", "🎯", "🦊"];

interface Props {
  config: MiniGameConfig;
  onComplete: (rating: MiniGameRating) => void;
}

export default function MemoryGame({ config, onComplete }: Props) {
  const pairCount = config.pairCount || 6;
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);

  useEffect(() => {
    const pairs = EMOJIS.slice(0, pairCount);
    const deck: Card[] = [];
    pairs.forEach((emoji, i) => {
      deck.push({ id: i * 2, pairId: i, emoji, flipped: false, matched: false });
      deck.push({ id: i * 2 + 1, pairId: i, emoji, flipped: false, matched: false });
    });
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
  }, [pairCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          const minMoves = pairCount;
          const rating: MiniGameRating = moves <= minMoves + 4 ? "S" : moves <= minMoves + 8 ? "A" : "B";
          setTimeout(() => onComplete(rating), 500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [moves, pairCount]);

  const handleFlip = (id: number) => {
    if (locked || timeLeft <= 0) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      const c1 = cards.find((c) => c.id === first)!;
      const c2 = cards.find((c) => c.id === second)!;

      if (c1.pairId === c2.pairId) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          )
        );
        setMatched((m) => {
          const newM = m + 1;
          if (newM >= pairCount) {
            const minMoves = pairCount;
            const rating: MiniGameRating = moves + 1 <= minMoves + 4 ? "S" : moves + 1 <= minMoves + 8 ? "A" : "B";
            setTimeout(() => onComplete(rating), 500);
          }
          return newM;
        });
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, flipped: false } : c
            )
          );
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>步数: {moves}</span>
        <span>配对: {matched}/{pairCount}</span>
      </div>
      <div
        className={styles.memoryGrid}
        style={{
          gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(pairCount * 2))}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.memoryCard} ${card.flipped || card.matched ? styles.flipped : ""}`}
            onClick={() => handleFlip(card.id)}
          >
            <span>{card.flipped || card.matched ? card.emoji : "?"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Write AssignGame**

```tsx
// src/components/MiniGame/AssignGame.tsx
import { useState, useEffect } from "react";
import { MiniGameConfig, MiniGameRating } from "../../types/game";
import styles from "./MiniGame.module.css";

interface Task {
  id: number;
  label: string;
  correctZone: number;
}

interface Zone {
  id: number;
  label: string;
}

const ZONES: Zone[] = [
  { id: 0, label: "接待组" },
  { id: 1, label: "后勤组" },
  { id: 2, label: "宣传组" },
  { id: 3, label: "安保组" },
];

const TASK_POOL: Task[] = [
  { id: 1, label: "引导来宾入座", correctZone: 0 },
  { id: 2, label: "分发饮用水", correctZone: 1 },
  { id: 3, label: "拍摄活动照片", correctZone: 2 },
  { id: 4, label: "维护现场秩序", correctZone: 3 },
  { id: 5, label: "签到登记", correctZone: 0 },
  { id: 6, label: "搬桌椅布置场地", correctZone: 1 },
  { id: 7, label: "发公众号推文", correctZone: 2 },
  { id: 8, label: "检查安全隐患", correctZone: 3 },
  { id: 9, label: "翻译外宾对话", correctZone: 0 },
  { id: 10, label: "清点物资数量", correctZone: 1 },
];

interface Props {
  config: MiniGameConfig;
  onComplete: (rating: MiniGameRating) => void;
}

export default function AssignGame({ config, onComplete }: Props) {
  const taskCount = config.taskCount || 6;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const shuffled = [...TASK_POOL].sort(() => Math.random() - 0.5).slice(0, taskCount);
    setTasks(shuffled);
  }, [taskCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          const total = correct + wrong + (currentTask < taskCount ? taskCount - currentTask : 0);
          const accuracy = total > 0 ? correct / total : 0;
          const rating: MiniGameRating = accuracy >= 0.85 ? "S" : accuracy >= 0.6 ? "A" : "B";
          setTimeout(() => onComplete(rating), 500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [correct, wrong, currentTask, taskCount]);

  const handleAssign = (zoneId: number) => {
    if (currentTask >= taskCount) return;
    const task = tasks[currentTask];
    const isCorrect = task.correctZone === zoneId;

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setFeedback(`✅ 正确！"${task.label}" → ${ZONES.find((z) => z.id === zoneId)!.label}`);
    } else {
      setWrong((w) => w + 1);
      setFeedback(
        `❌ 不对。"${task.label}" 应该分配给 ${ZONES.find((z) => z.id === task.correctZone)!.label}`
      );
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentTask((c) => {
        const next = c + 1;
        if (next >= taskCount) {
          setTimeout(() => {
            const total = correct + wrong + 1;
            const accuracy = isCorrect ? (correct + 1) / total : correct / total;
            const rating: MiniGameRating = accuracy >= 0.85 ? "S" : accuracy >= 0.6 ? "A" : "B";
            onComplete(rating);
          }, 400);
        }
        return next;
      });
    }, 800);
  };

  if (tasks.length === 0) return null;

  return (
    <div className={styles.gameContainer}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>进度: {currentTask}/{taskCount}</span>
        <span>正确: {correct}</span>
      </div>
      <div className={styles.assignArea}>
        <div className={styles.taskCard}>{tasks[currentTask]?.label || "完成!"}</div>
        {feedback && <div className={styles.assignFeedback}>{feedback}</div>}
        <div className={styles.zoneGrid}>
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              className={styles.zoneBtn}
              onClick={() => handleAssign(zone.id)}
              disabled={currentTask >= taskCount}
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write MiniGame wrapper**

```tsx
// src/components/MiniGame/MiniGame.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { MiniGameRating } from "../../types/game";
import { VOLUNTEER_EVENTS } from "../../data/volunteers";
import ClickGame from "./ClickGame";
import MemoryGame from "./MemoryGame";
import AssignGame from "./AssignGame";

export default function MiniGame() {
  const { activeMiniGame } = useGameState();
  const dispatch = useGameDispatch();

  if (!activeMiniGame) return null;

  const volunteerEvent = VOLUNTEER_EVENTS.find((e) => e.id === activeMiniGame.volunteerEventId);

  const handleComplete = (rating: MiniGameRating) => {
    dispatch({
      type: "END_MINIGAME",
      rating,
      baseHours: volunteerEvent?.baseHours || 0,
      bonusEffects: volunteerEvent?.bonus
        ? (Object.entries(volunteerEvent.bonus)
            .filter(([, v]) => v !== undefined)
            .map(([stat, delta]) => ({ stat: stat as any, delta: delta as number })))
        : [],
    });
  };

  switch (activeMiniGame.type) {
    case "click":
      return <ClickGame config={activeMiniGame.config} onComplete={handleComplete} />;
    case "memory":
      return <MemoryGame config={activeMiniGame.config} onComplete={handleComplete} />;
    case "assign":
      return <AssignGame config={activeMiniGame.config} onComplete={handleComplete} />;
    default:
      return null;
  }
}
```

- [ ] **Step 5: Write MiniGame.module.css**

```css
.gameContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
  color: #fff;
}

.hud {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.playArea {
  flex: 1;
  position: relative;
  cursor: crosshair;
}

.target {
  position: absolute;
  width: 60px;
  height: 60px;
  background: #e74c3c;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
  transition: all 0.3s;
}

.target:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.memoryGrid {
  display: grid;
  gap: 10px;
  padding: 40px;
  max-width: 500px;
  margin: 0 auto;
}

.memoryCard {
  aspect-ratio: 1;
  background: #2c3e50;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  transition: all 0.3s;
}

.memoryCard.flipped {
  background: #fff;
  color: #333;
}

.assignArea {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.taskCard {
  background: #fff;
  color: #333;
  padding: 20px 32px;
  border-radius: 12px;
  font-size: 20px;
  font-weight: bold;
}

.assignFeedback {
  font-size: 14px;
  color: #f0c040;
  animation: fadeIn 0.3s;
}

.zoneGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.zoneBtn {
  padding: 16px 32px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.zoneBtn:hover { background: rgba(255, 255, 255, 0.15); }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/MiniGame/
git commit -m "feat: add ClickGame, MemoryGame, AssignGame mini-games"
```

---

### Task 19: EndingScreen component

**Files:**
- Create: `src/components/EndingScreen/EndingScreen.tsx`
- Create: `src/components/EndingScreen/EndingScreen.module.css`

- [ ] **Step 1: Write EndingScreen**

```tsx
// src/components/EndingScreen/EndingScreen.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { saveGame } from "../../utils/saveLoad";
import styles from "./EndingScreen.module.css";

const STAGE_LABELS: Record<string, string> = {
  staff: "干事",
  minister: "部长",
  president: "主席",
};

export default function EndingScreen() {
  const { playerName, department, stage, stats, endingStats, eventLog } = useGameState();
  const dispatch = useGameDispatch();
  const dept = DEPARTMENTS.find((d) => d.id === department)!;
  const finalStats = endingStats || stats;

  const handleRestart = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const handleSave = () => {
    // Save current state for later review
    saveGame({ playerName, department, stage, week: 0, semester: 1, stats: finalStats, gamePhase: "ending", eventHistory: [], currentEvent: null, currentInterviewIndex: 0, eventLog: [], flags: {}, activeMiniGame: null, miniGameResult: null, endingStats: finalStats } as any, 2);
    alert("已保存结局记录");
  };

  const getEndingTitle = (): string => {
    const avg = Object.values(finalStats).reduce((a, b) => a + (typeof b === "number" ? b : 0), 0) / 7;
    if (stage === "president") return "登顶之人";
    if (avg >= 70) return "校园风云人物";
    if (avg >= 50) return "稳步前行的学生会成员";
    return "平凡而真实的大学时光";
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.endingTitle}>{getEndingTitle()}</h1>
        <div className={styles.divider} />

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>姓名</span>
            <span>{playerName}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>部门</span>
            <span>{dept.name}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>最高职位</span>
            <span>{STAGE_LABELS[stage]}</span>
          </div>
        </div>

        <h3 className={styles.statsTitle}>最终属性</h3>
        <div className={styles.finalStats}>
          {[
            { label: "组织力", value: finalStats.organization },
            { label: "人脉", value: finalStats.connections },
            { label: "学习力", value: finalStats.academics },
            { label: "魅力值", value: finalStats.charisma },
            { label: "抗压力", value: finalStats.stress },
            { label: "经费", value: finalStats.budget },
            { label: "志愿时长", value: finalStats.volunteerHours, suffix: "h" },
          ].map((s) => (
            <div key={s.label} className={styles.finalStat}>
              <span>{s.label}</span>
              <span className={styles.finalValue}>
                {s.value}{s.suffix || ""}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <button className={styles.btnPrimary} onClick={handleRestart}>
            重新开始
          </button>
          <button className={styles.btnSecondary} onClick={handleSave}>
            保存结局
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write EndingScreen.module.css**

```css
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fce4d6, #f8d5bc, #f0c040);
}

.content {
  text-align: center;
  max-width: 480px;
}

.endingTitle {
  font-size: 32px;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.divider {
  width: 60px;
  height: 2px;
  background: var(--color-accent);
  margin: 0 auto 24px;
}

.summary {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 32px;
}

.summaryItem {
  display: flex;
  flex-direction: column;
  font-size: 14px;
}

.summaryLabel {
  font-size: 11px;
  color: #999;
}

.statsTitle {
  font-size: 16px;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.finalStats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  text-align: left;
  margin-bottom: 32px;
}

.finalStat {
  display: flex;
  justify-content: space-between;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  font-size: 13px;
}

.finalValue { font-weight: bold; }

.buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btnPrimary {
  padding: 10px 36px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

.btnSecondary {
  padding: 10px 24px;
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/EndingScreen/
git commit -m "feat: add EndingScreen with final stats and restart"
```

---

### Task 20: Wire everything together and verify

- [ ] **Step 1: Run TypeScript check**

Run: `cd D:\XIANGMU\student_union && npx tsc --noEmit`

Fix any type errors by adjusting imports and type references.

- [ ] **Step 2: Start dev server and verify**

Run: `npm run dev`

Verify the following flow works:
1. Title screen loads
2. Click "开始游戏" → name input
3. Enter name → department select
4. Click a department → interview
5. Answer 2 questions → badge CG
6. Auto-transition to game screen
7. Event card appears with choices
8. Make a choice → feedback → next event
9. Click "结局" button → ending
10. Click "重新开始" → title screen

- [ ] **Step 3: Fix any issues found**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete game loop, all screens wired"
```

---

### Task 21: Polish — background effects and transitions

**Files:**
- Modify: `src/components/GameScreen/GameScreen.module.css`

- [ ] **Step 1: Add particle background effect**

```css
/* Add to GameScreen.module.css */
.eventArea::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(1px 1px at 20% 30%, rgba(180, 150, 120, 0.3), transparent),
    radial-gradient(1px 1px at 40% 70%, rgba(180, 150, 120, 0.2), transparent),
    radial-gradient(1.5px 1.5px at 60% 20%, rgba(200, 170, 140, 0.25), transparent),
    radial-gradient(1px 1px at 80% 50%, rgba(180, 150, 120, 0.2), transparent),
    radial-gradient(1.5px 1.5px at 10% 80%, rgba(200, 170, 140, 0.25), transparent);
  pointer-events: none;
  z-index: 0;
}
```

- [ ] **Step 2: Add crisis event dark background**

In `EventCard.tsx`, add conditional class based on `event.type === "crisis"`:

```tsx
// In GameScreen.tsx, wrap eventArea:
<div className={`${styles.eventArea} ${state.currentEvent?.type === "crisis" ? styles.crisisBg : ""}`}>
```

And in CSS:
```css
.crisisBg {
  background: radial-gradient(ellipse at center, rgba(40,45,60,0.3), rgba(10,12,18,0.95));
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/GameScreen/
git commit -m "feat: add background particle effects and crisis dark mode"
```

---

## Summary

21 tasks total. After completion, you'll have:
- Full game loop (title → name → department → interview → badge → game → ending)
- 7-stat system with promotion checks
- 15+ events across 5 types
- 5 volunteer events with 3 mini-game types
- Save/load with 3 slots
- CSS animations and particle background effects
