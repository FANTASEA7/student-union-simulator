// src/data/expenseOptions.ts
import { ExpenseOption } from "../types/game";

export const EXPENSE_OPTIONS: ExpenseOption[] = [
  {
    id: "good_food", label: "改善伙食", icon: "🍜", cost: 30,
    description: "吃顿好的犒劳自己",
    effects: [{ stat: "stress", delta: -5 }],
  },
  {
    id: "internet_cafe", label: "网吧开黑", icon: "🎮", cost: 50,
    description: "和朋友开黑放松",
    effects: [{ stat: "stress", delta: -10 }, { stat: "charisma", delta: -2 }],
  },
  {
    id: "shopping", label: "逛街购物", icon: "🛍️", cost: 80,
    description: "买点新衣服提升形象",
    effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -8 }],
  },
  {
    id: "books", label: "买辅导资料", icon: "📚", cost: 40,
    description: "为考试做准备",
    effects: [{ stat: "academics", delta: 4 }],
  },
  {
    id: "gift", label: "给NPC买礼物", icon: "🎁", cost: 60,
    description: "增进感情的好方法",
    effects: [],
    condition: { minAffinity: 1 },
  },
  {
    id: "cafe_study", label: "泡咖啡馆自习", icon: "☕", cost: 25,
    description: "换个环境学习效率更高",
    effects: [{ stat: "academics", delta: 3 }, { stat: "stress", delta: -5 }],
  },
  {
    id: "movie_date", label: "约会看电影", icon: "🎬", cost: 100,
    description: "和恋人共度美好时光",
    effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -8 }],
    condition: { hasLover: true },
  },
  {
    id: "medicine", label: "买药调理", icon: "🏥", cost: 60,
    description: "调理身体恢复状态",
    effects: [{ stat: "stress", delta: -15 }],
    condition: { minStats: { stress: 30 } },
  },
  // ===== 新增消费选项 =====
  {
    id: "gym", label: "健身房撸铁", icon: "🏋️", cost: 40,
    description: "去学校健身房出一身汗",
    effects: [{ stat: "stress", delta: -8 }, { stat: "organization", delta: 1 }],
  },
  {
    id: "concert", label: "看live演出", icon: "🎸", cost: 120,
    description: "学校附近Livehouse有乐队演出",
    effects: [{ stat: "charisma", delta: 4 }, { stat: "stress", delta: -12 }, { stat: "connections", delta: 2 }],
  },
  {
    id: "snacks_party", label: "宿舍零食趴", icon: "🍿", cost: 35,
    description: "买一堆零食叫上室友一起嗨",
    effects: [{ stat: "connections", delta: 4 }, { stat: "stress", delta: -6 }],
  },
  {
    id: "skill_workshop", label: "技能工作坊", icon: "🔧", cost: 55,
    description: "参加周末技能培训（PS/PPT/演讲）",
    effects: [{ stat: "academics", delta: 5 }, { stat: "organization", delta: 2 }],
  },
  {
    id: "volunteer_weekend", label: "周末志愿", icon: "🤲", cost: 0,
    description: "用周末时间做志愿服务",
    effects: [{ stat: "volunteerHours", delta: 4 }],
  },
  {
    id: "treat_npc", label: "请NPC吃饭", icon: "🍽️", cost: 50,
    description: "请某个NPC吃顿饭，拉近关系",
    effects: [],
    condition: { minAffinity: 1 },
  },
  {
    id: "save_money", label: "省着点花", icon: "🐷", cost: 0,
    description: "这周不乱花钱，存起来",
    effects: [{ stat: "stress", delta: 3 }, { stat: "allowance", delta: 30 }],
  },
  // ===== 数值闭环新增 =====
  {
    id: "invest_department_50", label: "部门小额投资", icon: "📊", cost: 50,
    description: "投入50经费到部门项目，获得组织力提升和部长好感",
    currency: "budget",
    effects: [
      { stat: "organization", delta: 4 },
      { stat: "connections", delta: 2 },
    ],
    condition: { minStats: { budget: 50 } },
  },
  {
    id: "invest_department_100", label: "部门大额投资", icon: "🏗️", cost: 100,
    description: "投入100经费升级部门设备/活动，大幅提升部长好感",
    currency: "budget",
    effects: [
      { stat: "organization", delta: 8 },
      { stat: "connections", delta: 3 },
      { stat: "charisma", delta: 2 },
    ],
    condition: { minStats: { budget: 100 } },
  },
  {
    id: "tutoring", label: "做家教兼职", icon: "✏️", cost: 0,
    description: "用自己的学习能力赚点零花钱",
    effects: [
      { stat: "allowance", delta: 150 },
      { stat: "stress", delta: 3 },
    ],
    condition: { minStats: { academics: 50 } },
  },
  {
    id: "broke_hustle", label: "吃土求生", icon: "🍞", cost: 0,
    description: "生活费见底了，只能啃馒头...但也是一种体验",
    effects: [
      { stat: "stress", delta: 5 },
      { stat: "allowance", delta: 20 },
    ],
    condition: { maxStats: { allowance: 100 } },
  },
  {
    id: "volunteer_convert", label: "志愿服务转学分", icon: "🎓", cost: 40,
    description: "用40小时志愿时长换取实践学分（+5学习力）",
    currency: "volunteerHours",
    effects: [
      { stat: "academics", delta: 5 },
    ],
    condition: { minStats: { volunteerHours: 40 } },
  },
];
