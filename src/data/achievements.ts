// src/data/achievements.ts
import { Achievement } from "../types/game";

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // ===== 晋升成就 =====
  { id: "president", name: "学生会主席", description: "晋升为学生会主席", icon: "🏆", points: 3 },
  { id: "minister", name: "部长大人", description: "晋升为部长", icon: "📋", points: 2 },

  // ===== 属性阈值成就 =====
  { id: "scholar", name: "学霸", description: "学习力达到80", icon: "🎓", points: 2 },
  { id: "scholar_elite", name: "学神", description: "学习力达到95", icon: "🧠", points: 3 },
  { id: "social_butterfly", name: "社交达人", description: "人脉达到70", icon: "🤝", points: 2 },
  { id: "social_king", name: "人脉之王", description: "人脉达到90", icon: "👑", points: 3 },
  { id: "organizer", name: "组织能手", description: "组织力达到70", icon: "📊", points: 2 },
  { id: "organizer_pro", name: "统筹大师", description: "组织力达到90", icon: "🏗️", points: 3 },
  { id: "charisma_star", name: "魅力之星", description: "魅力值达到70", icon: "✨", points: 2 },
  { id: "charisma_icon", name: "校园偶像", description: "魅力值达到90", icon: "🌟", points: 3 },
  { id: "stress_master", name: "钢铁意志", description: "压力达到90", icon: "🛡️", points: 2 },
  { id: "money_manager", name: "理财能手", description: "经费达到60", icon: "💰", points: 1 },
  { id: "money_boss", name: "财务自由", description: "经费达到90", icon: "💎", points: 2 },

  // ===== 志愿成就 =====
  { id: "volunteer_star", name: "志愿之星", description: "志愿时长达到80h", icon: "🎪", points: 2 },
  { id: "volunteer_hero", name: "志愿先锋", description: "志愿时长达到150h", icon: "🏅", points: 3 },

  // ===== 恋爱成就 =====
  { id: "campus_love", name: "校园恋爱", description: "成功表白并交往", icon: "❤️", points: 2 },
  { id: "heartbreaker", name: "心碎时刻", description: "表白被拒", icon: "💔", points: 1 },
  { id: "love_full", name: "情圣", description: "与NPC好感度达到100", icon: "💝", points: 2 },

  // ===== 考试成就 =====
  { id: "first_place", name: "全院第一", description: "期末综合排名第1名", icon: "🥇", points: 3 },
  { id: "top_three", name: "名列前茅", description: "期末综合排名前3名", icon: "🥈", points: 2 },
  { id: "cet4_pass", name: "四级通过", description: "通过英语四级考试", icon: "📝", points: 1 },
  { id: "cet4_high", name: "四级高分", description: "四级分数≥600", icon: "📜", points: 2 },

  // ===== 小游戏成就 =====
  { id: "mini_game_s", name: "完美操作", description: "小游戏获得S评价", icon: "💯", points: 2 },
  { id: "mini_game_all_s", name: "游戏高手", description: "所有类型小游戏都获得过S评价", icon: "🎮", points: 3 },

  // ===== NPC相关成就 =====
  { id: "met_all_npc", name: "交际花", description: "结识所有固定NPC", icon: "🌐", points: 2 },
  { id: "maidan_bestie", name: "买单哥的铁哥们", description: "与买单哥好感度达到80", icon: "🍻", points: 1 },
  { id: "zhangyi_rival", name: "与狼共舞", description: "揭发张艺的恶行", icon: "🐺", points: 2 },

  // ===== 事件成就 =====
  { id: "crisis_handler", name: "危机处理专家", description: "成功处理3次危机事件", icon: "🚨", points: 2 },
  { id: "opportunity_seeker", name: "机会捕手", description: "触发并完成5次机会事件", icon: "🎯", points: 2 },
  { id: "exchange_done", name: "国际视野", description: "完成交换生项目", icon: "✈️", points: 2 },

  // ===== 负面/趣味成就 =====
  { id: "stress_monster", name: "压力怪", description: "压力降到0过", icon: "😰", points: 1 },
  { id: "broke", name: "囊中羞涩", description: "生活费降到100以下", icon: "🪙", points: 1 },
  { id: "all_nighter", name: "熬夜冠军", description: "精力降到0过", icon: "🌙", points: 1 },
  { id: "shopaholic", name: "购物狂", description: "在超市累计消费超过500", icon: "🛒", points: 1 },

  // ===== 部门专属成就 =====
  { id: "life_dept_star", name: "生活标兵", description: "在生活部任职期间组织力达到60", icon: "🏠", points: 1 },
  { id: "office_dept_star", name: "办公室精英", description: "在办公室任职期间经费达到50", icon: "💼", points: 1 },
  { id: "media_dept_star", name: "新媒体之星", description: "在新媒体部任职期间魅力值达到60", icon: "📱", points: 1 },
  { id: "sports_dept_star", name: "体育健将", description: "在体育部任职期间压力达到70", icon: "⚽", points: 1 },
  { id: "social_dept_star", name: "外联达人", description: "在外联部任职期间人脉达到60", icon: "🔗", points: 1 },

  // ===== NG+ / 隐藏成就 =====
  { id: "cross_dept", name: "跨部门", description: "二周目选择与一周目不同的部门", icon: "🔄", points: 2 },
  { id: "hidden_maidan", name: "散财童子", description: "触发买单哥食堂请客事件", icon: "🎉", points: 1 },
  { id: "hidden_xiangyu", name: "樱花树下的眼泪", description: "目睹香芋对桃子的表白", icon: "🌸", points: 1 },
  { id: "hidden_zhangyi", name: "权力的阴影", description: "目睹张艺胁迫学弟的场景", icon: "🌑", points: 1 },

  // ===== 综合成就 =====
  { id: "all_rounder", name: "六边形战士", description: "所有属性均达到60以上", icon: "⬡", points: 3 },
  { id: "rich_life", name: "人生赢家", description: "同时拥有恋人和主席职位", icon: "👑❤️", points: 3 },
  { id: "survivor", name: "幸存者", description: "完成三个完整学期", icon: "🎓", points: 2 },
];
