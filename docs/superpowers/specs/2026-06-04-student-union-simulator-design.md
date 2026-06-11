# 学生会模拟器 v2 — 完整设计文档

## 概述

卡牌选择+回合排课类单机小游戏，玩法类似《中国式家长》。玩家扮演刚进牛马大学的新生，加入学生会，经历干事→部长→主席三个阶段，通过排课、事件卡选择、考试排名、恋爱社交推动剧情和属性成长。

**技术栈**: React 18 + TypeScript + Vite 5，纯前端单页应用，数据存 localStorage。

---

## 游戏流程

```
片头 → 填写姓名 → 选择部门(6选1) → 部门面试(2问) → 干事工牌CG
→ 第1学期(干事·16周)
│   ├─ 每周排课循环(5AP + 精力管理)
│   ├─ 社交邂逅NPC → 好感培养 → 表白恋爱
│   ├─ 周末自由消费(生活费)
│   ├─ 第14周: 📝 英语四级
│   └─ 第16周: 🏆 期末排名面→ 晋升判定 → 部长CG / 结局
→ 第2学期(部长·16周)
│   ├─ 每周排课循环
│   ├─ 第14周: 📝 四级补考/六级
│   └─ 第16周: 🏆 期末排名 → 晋升判定 → 主席CG / 结局
→ 结局评定 → 成就结算 → NG+继承 → 二周目(可选)
```

---

## 一、属性系统（9维）

| 属性 | 中文名 | 范围 | 说明 |
|---|---|---|---|
| organization | 组织力 | 0-100 | 策划活动、调配资源 |
| connections | 人脉 | 0-100 | 社交网络、认识的人 |
| academics | 学习力 | 0-100 | 绩点、知识储备 |
| charisma | 魅力值 | 0-100 | 演讲说服、个人影响力 |
| stress | 抗压力 | 0-100 | 心理承受（归零触发负面事件） |
| budget | 经费 | 0-100 | 学生会可支配预算 |
| volunteerHours | 志愿时长 | 累计值 | 志愿服务累计小时数 |
| energy | 精力 | 0-100 | 每周可用的行动燃料（周一重置为100） |
| allowance | 生活费 | 累计值 | 个人可支配金额（元），初始800 |

### 属性联动

- **精力归零** → 当日剩余槽位变为"强制休息"，抗压力-10
- **抗压力 ≤ 20** → 进入"焦虑"状态，所有活动效果 -30%
- **抗压力 = 0** → 触发"心理崩溃"事件，强制休息2周
- **生活费 < 50** → "吃土"状态，精力恢复-10/周，抗压力-3/周
- **恋爱中** → 每周抗压力自动恢复+5，精力恢复+5

---

## 二、六大部门（不变）

| 部门 | 负责人 | 性格 | 底色 |
|---|---|---|---|
| 生活部 | 烟头叔叔 | 老烟枪，话糙理不糙 | #e8f4f8 |
| 办公室 | 明六六 | 精致利己，滴水不漏 | #fef3e2 |
| 文体部 | 小蛋糕 | 笑容甜，雷厉风行 | #fde8e8 |
| 新媒体部 | 青岛王 | 网感强，梗多 | #e6f3ec |
| 社管部 | 丁凯之子 | 神秘二代，话少分量重 | #f0e6f6 |
| 心理部 | 心理部负责人 | 温和敏锐，擅长沉默施压 | #e8eaf6 |

---

## 三、排课系统（核心循环）

### 3.1 每周流程

```
周一早晨 — 周报
├─ 精力重置为 100
├─ 显示本周特殊事件预告
└─ 显示当前属性面板

排课阶段 — 分配5天活动
├─ 逐个选择周一~周五的活动类型（每天1AP）
├─ 每选一个，实时预览精力变化
├─ 若精力不足以支撑所选活动 → 红色警告
└─ 确认后排课锁定

执行阶段 — 逐天结算
├─ 播放活动动画 → 结算属性 → 随机事件判定(30-40%)
└─ 触发事件 → 弹出事件卡(2-3选项)

周末结算
├─ 周六上午：自由消费时间（可选1-2项，消耗生活费）
├─ 周六下午：社交/恋爱互动
├─ 周日：精力恢复+40，抗压力+5
├─ 显示本周属性变化汇总
├─ 检查晋升条件
└─ 进入下一周
```

### 3.2 活动类型

| 活动 | AP | 精力 | 主要收益 | 抗压力 | 随机事件概率 |
|---|---|---|---|---|---|
| 📚 学习 | 1 | -15 | 学习力+4~8 | -3 | 30% (日常/机遇) |
| 🤝 社交 | 1 | -10 | 人脉+2~5, 魅力+1~3 | +5 | 35% (人际关系) |
| 📋 工作 | 1 | -20 | 组织力+3~6, 经费+2~5 | -5 | 40% (部门/危机) |
| 😴 休息 | 1 | +30 | 恢复精力 | +8 | 0% (不触发) |
| 🎪 志愿 | 1 | -25 | 志愿时长(小游戏) | ±? | 小游戏评级决定 |

### 3.3 活动子选项

**学习子类：**
- 图书馆自习 → 学习力+6, 无特殊
- 小组讨论 → 学习力+4, 人脉+2
- 考前突击 → 学习力+8, 抗压力-5（仅考试前2周可用）

**社交子类：**
- 约饭聊天 → 人脉+3, 魅力+1, 经费-2, 20%概率邂逅NPC
- 社团活动 → 人脉+2, 组织力+2, 抗压力+3, 30%概率邂逅NPC
- 联谊交友 → 魅力+4, 人脉+1, 50%概率邂逅NPC

**工作子类：**
- 策划活动 → 组织力+5, 经费+3, 高概率触发机遇
- 处理文书 → 组织力+3, 学习力+2, 低风险
- 部内协调 → 人脉+3, 组织力+3, 魅力+1

**休息子类：**
- 睡大觉 → 精力+35, 抗压力+10
- 打游戏 → 精力+15, 抗压力+5, 魅力-2
- 散步发呆 → 精力+25, 抗压力+8, 小概率触发灵感

### 3.4 精力消耗与连续机制

```
连续学习 ≥3天 → "学霸状态"：学习力额外+3/天
连续学习 ≥5天 → "burnout"：抗压力-15，精力恢复减半
连续工作 ≥3天 → "拼命三郎"：组织力额外+2/天，抗压力额外-5/天
连续休息 ≥2天 → "懒散"：魅力-3
```

### 3.5 数据结构

```typescript
type ActivityType = "study" | "social" | "work" | "rest" | "volunteer";

type ActivitySubType =
  | "study_library" | "study_group" | "study_cram"
  | "social_meal" | "social_club" | "social_date"
  | "work_plan" | "work_paperwork" | "work_coordinate"
  | "rest_sleep" | "rest_game" | "rest_walk";

interface ActivityDef {
  type: ActivityType;
  subType: ActivitySubType;
  label: string;
  apCost: number;              // 固定1
  energyCost: number;          // 负值=消耗, 正值=恢复
  statEffects: { stat: keyof Stats; min: number; max: number }[];
  stressDelta: number;
  eventTriggerChance: number;  // 0~1
  eventCategory?: GameEvent["type"];
  unlockCondition?: { stage?: GameStage; minStats?: Partial<Stats>; flags?: string[] };
}

interface WeeklySchedule {
  week: number;
  slots: [ActivitySlot, ActivitySlot, ActivitySlot, ActivitySlot, ActivitySlot];
  forecast: string[];
  state: "planning" | "executing" | "weekend" | "done";
  currentDay: number;          // 0-4
}

interface ActivitySlot {
  activity: ActivityDef | null;
  result?: {
    statChanges: { stat: keyof Stats; delta: number }[];
    triggeredEventId?: string;
    triggeredEvent?: GameEvent;
  };
  status: "pending" | "active" | "complete" | "forced_rest";
}
```

---

## 四、考试系统

### 4.1 考试时间线

| 学期 | 第14周 | 第16周 |
|---|---|---|
| 第1学期(干事) | 📝 英语四级 (CET-4) | 🏆 期末综合排名 |
| 第2学期(部长) | 📝 四级补考/六级 | 🏆 期末综合排名 |

### 4.2 英语四级 (CET-4)

- **题数**: 10道选择题（从30题题库随机抽取）
- **通过**: 答对 ≥6题
- **时间限制**: 25分钟（游戏内计时器）
- **成绩**:
  - 合格: `425 + (correct-6)/4×285 + random(-30,30)`，范围425~710
  - 不合格: `correct/10×420 + random(-30,30)`，范围0~424
- **通过奖励**: 学习力+8, 魅力+3, flag `cet4_passed`，解锁六级
- **未通过惩罚**: 学习力-3, 抗压力-10, flag `cet4_failed`，下学期补考
- **高分奖励**: ≥600分额外 +200生活费

```typescript
interface ExamQuestion {
  id: string;
  stem: string;
  options: string[];          // [A, B, C, D]
  answer: number;             // 0-3
  difficulty: 1 | 2 | 3;
  explanation: string;
}

interface ExamResult {
  examId: string;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  score: number;
  answers: { questionId: string; selected: number; correct: boolean }[];
}
```

### 4.3 期末综合排名（面子战）

**评分公式：**

```
总分 = 学习力×0.4 + 组织力×0.2 + 魅力值×0.15 + 人脉×0.15 + 经费×0.1
     + 四级加权(通过+50,未通过+0)
     + 志愿加权(min(志愿时长/10, 30))
     范围: 0~750
```

**5个固定对手：**

| 对手 | 人设 | 强项 | 弱项 | 口头禅 |
|---|---|---|---|---|
| 卷王 | 学习狂魔 | 学习力90+ | 人脉低 | "你都学到这个点了？" |
| 社牛 | 社交达人 | 人脉/魅力85+ | 学习力低 | "今晚有个局来不来" |
| 老油条 | 精明算计 | 组织力/经费80+ | 魅力低 | "这个项目我盯着呢" |
| 小透明 | 努力追赶 | 各项均衡60 | 无突出 | "我…我会加油的" |
| 空降兵 | 关系户 | 经费/人脉85+ | 组织力低 | "我爸说…" |

**排名影响：**

| 排名 | 评价 | 属性变化 | 特殊 |
|---|---|---|---|
| 第1名 | "全院之光" | 魅力+10, 经费+10, 抗压力+5 | 奖学金+500, 隐藏事件"校长接见" |
| 第2名 | "优秀骨干" | 魅力+6, 经费+6 | 奖学金+300 |
| 第3名 | "表现出色" | 魅力+3, 经费+3 | 奖学金+150 |
| 第4名 | "中规中矩" | 无变化 | — |
| 第5名 | "还需努力" | 魅力-3, 抗压力-5 | — |
| 第6名 | "垫底警告" | 魅力-6, 抗压力-10 | 部长警告事件 |

**考后社交（面子战）：**
排名低 → 对手"关心"你（抗压力-5）；排名高 → 对手来取经（魅力+3/人脉+3）

### 4.4 晋升条件（排名不卡晋升）

| 晋升 | 条件 |
|---|---|
| 干事→部长 | 组织力≥40 + 魅力值≥30 + 志愿时长≥20h |
| 部长→主席 | 组织力≥65 + 人脉≥50 + 魅力值≥50 + 志愿时长≥50h |

```typescript
interface ExamRival {
  id: string;
  name: string;
  persona: string;
  color: string;
  baseStats: Stats;
  growthRate: number;
  catchphrase: string;
}

interface ExamRanking {
  semester: number;
  rankings: { rivalId?: string; name: string; score: number; breakdown: { stat: keyof Stats; contribution: number }[] }[];
  playerRank: number;
  playerScore: number;
  evaluation: string;
  postExamEvents: GameEvent[];
}
```

---

## 五、恋爱系统

### 5.1 NPC生成

每个存档随机生成 **3-4个可攻略NPC**：

| 属性 | 生成方式 |
|---|---|
| 姓名 | 姓名库随机组合（30姓 × 30名），不重复 |
| 性格 | 5种：元气开朗 / 高冷傲娇 / 温柔体贴 / 社恐害羞 / 腹黑毒舌 |
| 外貌 | 描写库随机组合（发型 × 穿搭 × 气质） |
| 部门 | 6部门 + "其他院系" |
| 年级 | 1-4随机 |
| 爱好 | 摄影/篮球/动漫/烘焙/乐队/志愿/电竞/阅读 随机 |

### 5.2 邂逅

社交活动概率触发结识（约饭20%/社团30%/联谊50%）：

```
结识界面展示NPC信息 → 3个回应选项 → 不同初始好感度
```

### 5.3 好感度培养

| 互动 | 消耗 | 好感度变化 | 备注 |
|---|---|---|---|
| 日常聊天 | 无 | +3~8 | 性格影响效果 |
| 约饭 | 生活费-30 | +5~12 | 余额不足不可用 |
| 送礼物 | 生活费-30~150 | +5~20 | 按礼物价值 |
| 一起志愿 | 额外精力-5 | +6~10 | 需志愿日 |
| 一起自习 | 无 | +3~6 | 学习力额外+2 |
| 看电影(恋人) | 生活费-100 | +12 | 魅力+3, 抗压力+8 |

**性格对互动的影响：**

| 性格 | 约饭 | 送礼 | 聊天 | 偏好 |
|---|---|---|---|---|
| 元气开朗 | +12 | +8 | +8 | 一起志愿额外好感 |
| 高冷傲娇 | +5 | +15 | +3 | 送礼效果最好 |
| 温柔体贴 | +10 | +10 | +8 | 一起自习额外好感 |
| 社恐害羞 | +8 | +5 | +10 | 聊天效果最好 |
| 腹黑毒舌 | +6 | +12 | +6 | 喜欢被怼的选项 |

### 5.4 表白机制

好感度 ≥66% 时解锁"💌表白"选项：

```
成功率 = 30% + (好感度 - 60) × 1.75%
已有恋人时不可表白
```

| 好感度 | 成功率 |
|---|---|
| 66% | ~40% |
| 75% | ~56% |
| 85% | ~74% |
| 95%+ | ~91% |

- **成功**: 确立恋爱关系，魅力+10, 抗压力+15, 解锁情侣专属事件
- **失败**: 好感度-15, 抗压力-10, 状态变为"被拒"（好感度恢复到66%后可重试）

### 5.5 恋爱状态

- 每周抗压力自动恢复 +5
- 每周精力恢复 +5
- 社交活动魅力+人脉额外+1
- 解锁恋爱专属事件(5个): 第一次约会/对方生日/雨天送伞/小争吵/一起规划未来

### 5.6 数据结构

```typescript
type NPCPersonality = "sunny" | "tsundere" | "gentle" | "shy" | "mischievous";

interface LoveNPC {
  id: string;
  name: string;
  gender: "male" | "female";
  personality: NPCPersonality;
  appearance: string;
  department: Department | "other";
  year: 1 | 2 | 3 | 4;
  hobby: string;
  affinity: number;          // 0-100
  met: boolean;
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
```

---

## 六、生活费系统

### 6.1 与"经费"的区别

| | 经费 (budget) | 生活费 (allowance) |
|---|---|---|
| 来源 | 学生会拨款、拉赞助 | 家长打款、兼职、奖学金 |
| 用途 | 策划活动、部内开销 | 个人消费（吃喝玩学） |
| 范围 | 0-100 | 累计金额 |
| 消耗 | 事件选项中扣除 | 周末自由消费 + 事件扣除 |

### 6.2 收入来源

| 来源 | 金额 | 条件 |
|---|---|---|
| 家长打款 | +800/月 | 自动（每4周） |
| 奖学金第1名 | +500 | 期末排名第1 |
| 奖学金第2名 | +300 | 期末排名第2 |
| 奖学金第3名 | +150 | 期末排名第3 |
| 四级高分 | +200 | 四级≥600分 |
| 勤工俭学 | +150 | 消耗1AP, 学习力-2 |
| 志愿补贴 | +100 | S级志愿评价 |
| 学生会津贴 | +100/月(部长) +200/月(主席) | 晋升自动发放 |

### 6.3 周末消费选项

| 消费项 | 费用 | 效果 | 条件 |
|---|---|---|---|
| 改善伙食 | ¥30 | 精力+15, 抗压力+5 | — |
| 网吧开黑 | ¥50 | 精力+5, 抗压力+10, 魅力-2 | — |
| 逛街购物 | ¥80 | 魅力+3, 抗压力+8, 可能邂逅 | — |
| 买辅导资料 | ¥40 | 学习力+4 | — |
| 给NPC买礼物 | ¥30~150 | 好感度+5~20 | 有已结识NPC |
| 泡咖啡馆自习 | ¥25 | 学习力+3, 精力+10 | — |
| 约NPC看电影 | ¥100 | 好感度+12, 魅力+3, 抗压力+8 | 已有恋人 |
| 买药调理 | ¥60 | 抗压力+15, 精力+10 | 抗压力≤30 |

### 6.4 吃土状态

```
余额 < 50元:
├─ 精力恢复 -10/周
├─ 抗压力 -3/周
├─ 魅力值 -1/周
└─ "约饭/逛街/送礼物/看电影"不可用

余额 = 0:
└─ 触发借钱事件：
    ├─ 找家里要 → 抗压力-5, +500元（每学期1次）
    ├─ 找同学借 → 人脉-5, +300元（可能被拒）
    └─ 硬扛 → 吃土持续
```

---

## 七、事件卡系统（扩充）

保留原有事件类型，新增15个事件：

### 7.1 机遇事件 (5个)

| 事件 | 触发条件 | 核心选择 |
|---|---|---|
| 省级竞赛通知 | 学习力≥45 | A.备赛(+12学-30精) B.组队(+8人+6学) C.放弃 |
| 大型活动主持招募 | 魅力≥35, ≤部长 | A.报名(+10魅+5人) B.推荐(+8人) C.观众(+5抗) |
| 校外企业参观 | 人脉≥40, ≥部长 | A.带队(+8组+6人) B.让学弟妹(+5魅) C.拒绝 |
| 校媒采访 | 魅力/组织力≥50 | A.接受(+8魅, 全校flag) B.推掉(+5组) C.婉拒 |
| 交换生推荐 | 学习力≥55, 人脉≥40, 部长 | A.争取(+15学+5人, 错过期中) B.推荐(+12人) C.放弃(+5抗) |

### 7.2 危机事件 (5个)

| 事件 | 触发条件 | 核心选择 |
|---|---|---|
| 活动经费被砍半 | 组织过活动 | A.补缺口(-15费+5组) B.拉赞助(魅测试) C.缩减(-3组-5抗) |
| 部员突然辞职 | ≥部长, 人脉≥30 | A.挽留(魅测试) B.招新人(+3人-3组) C.自己扛(+5组-10抗) |
| 社团评级降级 | 主席, 组织大活动 | A.申诉(组测试, 成功+8组) B.重新规划(+5组-5抗) C.推卸(-8魅) |
| 流感季部门全倒 | 有部员 | A.照顾(+10人-40精) B.安排替补(+5组-5抗) C.延期(-5组) |
| 派系斗争 | 部长, 人脉≥45 | A.站队(+8人-5魅) B.调停(魅测试) C.旁观(+5抗-5人) |

### 7.3 人际关系事件 (5个)

| 事件 | 触发条件 | 核心选择 |
|---|---|---|
| 深夜食堂偶遇学长 | 抗压力≤40, 干事 | A.倾诉(+15抗+5人) B.吐槽(+10抗+3魅) C.默默(+5抗) |
| 部员生日派对 | 有部员 | A.策划惊喜(+5组+8人-5费) B.小礼物(+5人+3魅) C.红包(-3费+2人) |
| 跨部门合作摩擦 | 跨部门事件后 | A.沟通(+8魅+6人) B.找上级(+5组) C.强硬(+5组-8人) |
| 表白墙被挂 | 魅力≥40 | A.幽默回应(+8魅, 全校flag) B.认真澄清(+4魅) C.无视(+5抗) |
| 前辈传帮带 | 干事 | A.认真请教(+8对应属性+5人) B.请吃饭(-5费+8人) C.婉拒 |

### 7.4 恋爱专属事件 (5个)

| 事件 | 触发条件 | 内容 |
|---|---|---|
| 第一次约会 | 确立关系后2周内 | 选地点, 不同选择不同好感 |
| 对方生日 | 好感度≥70 | 选礼物, 影响好感度和魅力 |
| 雨天送伞 | 随机 | 温馨事件, 好感+8, 抗压力+5 |
| 小争吵 | 抗压力≤30 | 道歉/冷战/沟通, 影响后续 |
| 一起规划未来 | 好感度≥85, 学期末 | 深刻对话, 魅力+5, 抗压力+10 |

---

## 八、多周目继承 (NG+)

### 8.1 结局类型

```typescript
type EndingType =
  | "president_great"   // 主席·卓越（晋升主席且排名第1）
  | "president_good"    // 主席·合格（晋升主席）
  | "minister_end"      // 部长·止步（未晋升主席但排名≥4）
  | "staff_end"         // 干事·平凡（未晋升部长）
  | "burnout"           // 心理崩溃（抗压力归零≥3次）
  | "love_end";         // 恋爱结局（好感度≥95且表白成功）
```

### 8.2 成就与继承点数

| 成就 | 条件 | 点数 |
|---|---|---|
| 🏆 学生会主席 | 晋升主席 | 3 |
| 🎓 学霸 | 学习力≥80 | 2 |
| 🤝 社交达人 | 人脉≥70 | 2 |
| 💰 理财能手 | 经费≥60 | 1 |
| ❤️ 校园恋爱 | 成功表白 | 2 |
| 🎪 志愿之星 | 志愿时长≥80h | 2 |
| 🥇 全院第一 | 期末排名第1 | 3 |
| 😰 压力怪 | 抗压力归零过 | 1 |
| 📝 四级高分 | 四级≥600分 | 1 |
| 🔄 跨部门 | 二周目选不同部门 | 2 |

### 8.3 继承兑换

```
继承点数 = 成就点数总和

属性继承：每投入1点 → 对应属性初始值+5（上限3点/+15）
  ├─ 组织力/人脉/学习力/魅力/抗压力/经费/志愿时长（每项最多3点）

特殊继承：
  ├─ 保留NPC好感度50%           [3点]
  ├─ 解锁隐藏部门"主席团"        [5点，一周目需晋升主席]
  ├─ 开局多一张稀有事件卡        [1点]
  └─ 保留上周目生活费50%         [2点]
```

### 8.4 二周目专属内容

| 内容 | 条件 |
|---|---|
| 隐藏部门"主席团"(直接从部长开始) | 一周目晋升主席 + 花费5点 |
| NPC"神秘学长"(额外帮助) | 二周目自动出现 |
| 隐藏结局"传奇"(主席+排名第1+恋爱成功) | 二周目达成 |
| 回忆录(标题画面永久解锁) | 完成任意结局 |

### 8.5 数据结构

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
}

interface NGPlusData {
  weekNumber: number;
  inheritancePoints: number;
  unlockedAchievements: string[];
  previousEndings: { weekNumber: number; ending: Ending; date: string }[];
  unlockedHiddenContent: string[];
}

interface Ending {
  type: EndingType;
  title: string;
  subtitle: string;
  description: string;
  stats: Stats;
  achievements: Achievement[];
}
```

---

## 九、GamePhase 完整列表

```typescript
type GamePhase =
  | "title"              // 片头
  | "name_input"         // 姓名输入
  | "department_select"  // 部门选择(6选1)
  | "interview"          // 部门面试(2问)
  | "badge_cg"           // 工牌CG(共用,参数区分阶段)
  | "schedule_planning"  // 每周排课(新)
  | "schedule_executing" // 逐日执行(新)
  | "weekend_spending"   // 周末消费(新)
  | "minigame"           // 小游戏(点击/记忆/分配)
  | "exam"               // 考试答题界面(新)
  | "exam_result"        // 排名揭晓(新)
  | "love_confess"       // 表白界面(新)
  | "ngplus_allocate"    // NG+继承分配(新)
  | "ending"             // 结局
  | "memoir";            // 回忆录(新)
```

---

## 十、UI 布局总览

### 10.1 排课界面 (1280×720)

```
┌──────────────────────────────────────────────────────────────┐
│  📅 第5周 · 干事 · 张三 · 生活部           精力: 85/100 💰¥1,250│
├──────────────────────────────────────────────────────────────┤
│   📋 预告：周五部门例会                                       │
│                                                              │
│   ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│   │   Mon    │   Tue    │   Wed    │   Thu    │   Fri    │   │
│   │  📚学习  │  🤝社交  │  📋工作  │  ❓待定  │  ❓待定  │   │
│   │  -15精   │  -10精   │  -20精   │          │          │   │
│   │  确认✓   │  确认✓   │  确认✓   │ [选择]   │ [选择]   │   │
│   └──────────┴──────────┴──────────┴──────────┴──────────┘   │
│                                                              │
│   ┌── 选择活动 ──────────────────────────────────────────┐   │
│   │ ○ 📚 学习(-15精)  ○ 🤝 社交(-10精)                    │   │
│   │ ○ 📋 工作(-20精)  ○ 😴 休息(+30精)                    │   │
│   │ ○ 🎪 志愿(-25精)                                      │   │
│   │ 剩余精力预测: 50/100      [确认] [重排]                │   │
│   └──────────────────────────────────────────────────────┘   │
│                                                              │
│   ┌── 属性 ────────────┐  ┌── 事件日志 ──┐  ┌── 晋升条件 ──┐  │
│   │ 组织力 42   人脉 35 │  │ W4: 策划迎新  │  │ 组织力≥40 ✓  │  │
│   │ 学习力 58   魅力 28 │  │ W4: 食堂冲突  │  │ 魅力≥30  ✗   │  │
│   │ 抗压力 65   经费 22 │  │ W3: 部门聚餐  │  │ 志愿≥20h ✗   │  │
│   │ 志愿 18h  精力  85  │  └──────────────┘  └──────────────┘  │
│   └────────────────────┘                                      │
└──────────────────────────────────────────────────────────────┘
```

### 10.2 考试界面

```
┌─────────────────────────────────────────────┐
│  📝 英语四级 (CET-4)        ⏱️ 22:15         │
│                                             │
│  第 3/10 题                                 │
│                                             │
│  The committee members ___ arrived          │
│  at the decision after three hours          │
│  of heated discussion.                      │
│                                             │
│  ○ A. is    ○ B. are    ● C. has    ○ D. have│
│                                             │
│  已答: ✅✅❌✅    正确率: 3/4               │
│  [上一题]                          [下一题]  │
└─────────────────────────────────────────────┘
```

### 10.3 排名揭晓界面

```
┌──────────────────────────────────────────────┐
│          🏆 第1学期 · 期末综合排名              │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │  🥇 卷王         687分  ██████████████│   │
│   │  🥈 老油条       621分  ████████████  │   │
│   │  🥉 社牛         598分  ███████████   │   │
│   │   4 你(张三)     572分  ██████████    │   │
│   │   5 空降兵       543分  ██████████    │   │
│   │   6 小透明       489分  █████████     │   │
│   └──────────────────────────────────────┘   │
│                                              │
│   排名第4 · 评价：中规中矩，继续努力！         │
│   [详细]              [继续]                  │
└──────────────────────────────────────────────┘
```

### 10.4 周末消费界面

```
┌─────────────────────────────────────────────┐
│  💰 周末自由活动 · 余额: ¥1,250               │
│                                             │
│  ○ 🍜 改善伙食      ¥30   精力+15 抗压力+5    │
│  ○ 🎮 网吧开黑      ¥50   抗压力+10 魅力-2    │
│  ○ 🛍️ 逛街购物      ¥80   魅力+3 可能邂逅     │
│  ○ 📚 买辅导资料    ¥40   学习力+4            │
│  ○ 🎁 给NPC买礼物   ¥80   好感度+10          │
│  ○ ☕ 泡咖啡馆自习  ¥25   学习力+3 精力+10    │
│  ○ 🏥 买药调理      ¥60   抗压力+15          │
│                                             │
│  [不消费，省钱]     [确认消费(最多2项)]        │
└─────────────────────────────────────────────┘
```

### 10.5 NG+继承界面

```
┌────────────────────────────────────────────┐
│        🔄 二周目 · 继承选择                  │
│                                            │
│  可分配点数: 12                             │
│                                            │
│  📊 属性继承 (每项最多3点)                   │
│  ├─ 组织力  +5   [➕][➕][➕]  2点          │
│  ├─ 人脉    +5   [➕][➕][ ]   1点          │
│  ├─ 学习力  +5   [➕][ ][ ]   0点          │
│  ├─ 魅力值  +5   [➕][➕][➕]  2点          │
│  ├─ 抗压力  +5   [➕][ ][ ]   0点          │
│  ├─ 经费    +5   [➕][➕][ ]   1点          │
│  └─ 志愿时长 +5h  [➕][➕][➕]  2点          │
│                                            │
│  🎁 特殊继承                               │
│  ├─ 👤 保留NPC好感度(50%)     [x] 3点      │
│  ├─ 📋 解锁隐藏部门"主席团"    [ ] 5点      │
│  └─ 🃏 开局多一张稀有卡        [ ] 1点      │
│                                            │
│  剩余: 1点    [确认] [重分配] [放弃继承]    │
└────────────────────────────────────────────┘
```

---

## 十一、组件树（更新）

```
App
├── TitleScreen              — 片头
├── NameInput                — 姓名输入
├── DepartmentSelect         — 部门卡牌选择(2×3)
├── InterviewScreen          — 面试(左立绘+右对话)
├── WorkBadgeCG              — 工牌CG(共用,参数区分)
├── GameScreen               — 主游戏容器(新结构)
│   ├── TopBar               — 阶段/周数/姓名/部门/余额
│   ├── SchedulePlanner      — 排课面板(新)
│   │   ├── WeekSlots        — 5天槽位
│   │   ├── ActivityPicker   — 活动选择器
│   │   └── EnergyPreview    — 精力预览条
│   ├── ScheduleExecutor     — 逐日执行视图(新)
│   │   ├── DayAnimation     — 每日活动动画
│   │   └── EventCard        — 事件卡(嵌入)
│   ├── WeekendSpending      — 周末消费(新)
│   ├── StatsPanel           — 9维属性条
│   ├── NPCPanel              — NPC列表+好感度(新)
│   ├── EventLog             — 历史事件
│   └── PromotionHint        — 晋升条件提示
├── ExamScreen               — 考试答题(新)
├── ExamResultScreen         — 排名揭晓(新)
├── LoveConfessScreen        — 表白界面(新)
├── MiniGame                 — 小游戏(点击/记忆/分配)
├── NGPlusScreen             — NG+继承分配(新)
├── EndingScreen             — 结局
└── MemoirScreen             — 回忆录(新)
```

---

## 十二、GameState 完整类型

```typescript
interface GameState {
  // 基础信息
  playerName: string;
  department: Department | null;
  stage: GameStage;            // "staff" | "minister" | "president"
  gamePhase: GamePhase;
  
  // 时间
  week: number;                // 总周数
  semesterWeek: number;        // 学期内周数(1-16)
  semester: number;            // 第几学期(1-2)
  
  // 属性(9维)
  stats: Stats;
  energy: number;              // 精力 0-100
  allowance: number;           // 生活费(元)
  
  // 事件
  eventHistory: string[];
  currentEvent: GameEvent | null;
  eventLog: { week: number; title: string; result: string }[];
  flags: Record<string, boolean>;
  
  // 面试
  currentInterviewIndex: number;
  
  // 小游戏
  activeMiniGame: {
    type: MiniGameType;
    config: MiniGameConfig;
    volunteerEventId: string;
  } | null;
  miniGameResult: MiniGameRating | null;
  
  // 排课(新)
  weeklySchedule: WeeklySchedule | null;
  
  // 考试(新)
  examRankings: ExamRanking[];
  currentExam: {
    examId: string;
    questions: ExamQuestion[];
    currentIndex: number;
    answers: { questionId: string; selected: number }[];
    timeRemaining: number;
  } | null;
  
  // 恋爱(新)
  loveNPCs: LoveNPC[];
  datingNPCId: string | null;
  loveEventsTriggered: string[];
  
  // NG+(新)
  ngPlus: NGPlusData;
  achievements: Achievement[];
  currentEnding: Ending | null;
  
  // 结局
  endingStats: Stats | null;
}

interface Stats {
  organization: number;
  connections: number;
  academics: number;
  charisma: number;
  stress: number;
  budget: number;
  volunteerHours: number;
}
```

---

## 十三、数据文件清单

```
src/
├── types/
│   └── game.ts              — 所有类型定义(大幅扩展)
├── data/
│   ├── departments.ts       — 6部门信息(不变)
│   ├── interviews.ts        — 面试题库(不变)
│   ├── events.ts            — 事件卡(扩充至30+)
│   ├── volunteers.ts        — 志愿活动(不变)
│   ├── activities.ts        — 活动定义(新)
│   ├── exams.ts             — 考试题库(新)
│   │   ├── cet4Questions    — 四级30题
│   │   └── rivals           — 5个对手数据
│   ├── npcNames.ts          — NPC姓名库(新)
│   ├── npcDialogues.ts      — NPC对话库(新)
│   ├── achievements.ts      — 成就定义(新)
│   ├── endings.ts           — 结局定义(新)
│   └── expenseOptions.ts    — 消费选项(新)
├── reducer/
│   └── gameReducer.ts       — Reducer(大幅扩展)
├── utils/
│   ├── eventPicker.ts       — 事件选择(扩展)
│   ├── saveLoad.ts          — 存档(扩展至NG+)
│   ├── npcGenerator.ts      — NPC随机生成(新)
│   ├── examScoreCalc.ts     — 成绩计算(新)
│   ├── rankingCalc.ts       — 排名计算(新)
│   ├── loveCalc.ts          — 表白成功率(新)
│   └── ngPlusCalc.ts        — 继承点数计算(新)
├── context/
│   └── GameContext.tsx       — Context(扩展)
└── components/
    ├── TitleScreen/         — (不变)
    ├── NameInput/           — (不变)
    ├── DepartmentSelect/    — (不变)
    ├── InterviewScreen/     — (不变)
    ├── WorkBadgeCG/         — (不变)
    ├── GameScreen/          — 主游戏(重构)
    │   ├── TopBar           — (扩展: 余额/精力)
    │   ├── StatsPanel       — (扩展: 9维)
    │   ├── SchedulePlanner/ — (新)
    │   ├── ScheduleExecutor/— (新)
    │   ├── WeekendSpending/ — (新)
    │   ├── EventCard        — (基本不变)
    │   ├── NPCPanel/        — (新)
    │   ├── EventLog         — (不变)
    │   └── PromotionHint    — (不变)
    ├── ExamScreen/          — (新)
    ├── ExamResultScreen/    — (新)
    ├── LoveConfessScreen/   — (新)
    ├── MiniGame/            — (不变)
    ├── NGPlusScreen/        — (新)
    ├── EndingScreen/        — (扩展)
    └── MemoirScreen/        — (新)
```

---

## 十四、存档结构（扩展）

```typescript
interface SaveData {
  version: number;           // v2
  timestamp: number;
  state: GameState;
}

// localStorage key: "student_union_save_{slot}"  (slot: 0-2)
// localStorage key: "student_union_ngplus" — 跨周目持久化数据
interface PersistentData {
  previousEndings: { weekNumber: number; ending: Ending; date: string }[];
  unlockedAchievements: string[];
  unlockedHiddenContent: string[];
  memoirUnlocked: boolean;
}
```

---

## 十五、动画 & 视觉

- 统一使用 CSS Animations + CSS Transitions
- 考试/排名界面：数字滚动动画
- 表白界面：心跳动画 + 粒子效果
- 工牌CG：保持原有三段式
- 排课执行：简约的日升日落过渡
- 结局：暖色日出渐变 + 成就解锁弹出

---

## 十六、开发优先级

1. **排课系统** — 核心循环，工作量最大
2. **考试系统** — 四级+期末排名
3. **生活费系统** — 周末消费融入排课流程
4. **恋爱系统** — NPC生成+互动
5. **NG+系统** — 结局+成就+继承
