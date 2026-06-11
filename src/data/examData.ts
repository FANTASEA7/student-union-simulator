// src/data/examData.ts
import { ExamQuestion, ExamDef, ExamRival } from "../types/game";

export const CET4_QUESTIONS: ExamQuestion[] = [
  // ===== GRAMMAR (语法) =====
  {
    id: "cet4_003", difficulty: 3, section: "grammar",
    stem: "It is essential that every child ___ the same educational opportunities.",
    options: ["has", "have", "had", "will have"], answer: 1,
    explanation: "It is essential/important/necessary that 后用虚拟语气(should) have。",
  },
  {
    id: "cet4_006", difficulty: 1, section: "grammar",
    stem: "Neither the teacher nor the students ___ satisfied with the result.",
    options: ["is", "are", "was", "has been"], answer: 1,
    explanation: "neither...nor... 就近原则，students 是复数用 are。",
  },
  {
    id: "cet4_009", difficulty: 3, section: "grammar",
    stem: "Were it not for your help, I ___ the project on time.",
    options: ["couldn't finish", "couldn't have finished", "didn't finish", "hadn't finished"], answer: 1,
    explanation: "虚拟语气倒装：Were it not for = If it were not for，主句用 couldn't have done。",
  },
  {
    id: "cet4_011", difficulty: 2, section: "grammar",
    stem: "He insisted that the meeting ___ until next week.",
    options: ["put off", "be put off", "will be put off", "would put off"], answer: 1,
    explanation: "insist 后用虚拟语气 (should) be put off。",
  },
  {
    id: "cet4_014", difficulty: 2, section: "grammar",
    stem: "Only after the accident ___ the importance of safety.",
    options: ["he realized", "did he realize", "he had realized", "realized he"], answer: 1,
    explanation: "Only + 状语置于句首，主句要部分倒装。",
  },
  {
    id: "cet4_016", difficulty: 2, section: "grammar",
    stem: "Not until the teacher came in ___ the noise.",
    options: ["did the students stop", "the students stopped", "stopped the students", "the students did stop"], answer: 0,
    explanation: "Not until 置于句首，主句部分倒装。",
  },
  {
    id: "cet4_024", difficulty: 2, section: "grammar",
    stem: "He speaks English as if he ___ a native speaker.",
    options: ["is", "were", "had been", "will be"], answer: 1,
    explanation: "as if 后用虚拟语气 were。",
  },
  {
    id: "cet4_026", difficulty: 2, section: "grammar",
    stem: "Hardly ___ the airport when the plane took off.",
    options: ["I had reached", "had I reached", "I reached", "did I reach"], answer: 1,
    explanation: "Hardly...when... 句型，主句用 had + 主语 + done 倒装。",
  },

  // ===== VOCABULARY (词汇) =====
  {
    id: "cet4_002", difficulty: 2, section: "vocabulary",
    stem: "She was so ___ in her book that she didn't hear the doorbell.",
    options: ["absorbed", "attracted", "drawn", "concentrated"], answer: 0,
    explanation: "be absorbed in = 全神贯注于，固定搭配。concentrated 应用 on。",
  },
  {
    id: "cet4_004", difficulty: 1, section: "vocabulary",
    stem: "I'm looking forward to ___ from you soon.",
    options: ["hear", "hearing", "heard", "be heard"], answer: 1,
    explanation: "look forward to + doing，to 是介词。",
  },
  {
    id: "cet4_008", difficulty: 1, section: "vocabulary",
    stem: "You'd better ___ late for class again.",
    options: ["not be", "not to be", "don't be", "not being"], answer: 0,
    explanation: "had better (not) + 动词原形。",
  },
  {
    id: "cet4_023", difficulty: 1, section: "vocabulary",
    stem: "Would you mind ___ the window?",
    options: ["open", "to open", "opening", "opened"], answer: 2,
    explanation: "mind + doing，固定搭配。",
  },
  {
    id: "cet4_027", difficulty: 1, section: "vocabulary",
    stem: "The teacher asked us ___ in class.",
    options: ["not talk", "not to talk", "don't talk", "not talking"], answer: 1,
    explanation: "ask sb (not) to do sth。",
  },
  {
    id: "cet4_028", difficulty: 2, section: "vocabulary",
    stem: "There is no point ___ about the result.",
    options: ["to worry", "worrying", "worried", "worry"], answer: 1,
    explanation: "There is no point (in) doing sth = 做某事没有意义。",
  },
  {
    id: "cet4_029", difficulty: 1, section: "vocabulary",
    stem: "He is ___ honest boy that everyone trusts him.",
    options: ["so", "such", "such an", "so an"], answer: 2,
    explanation: "such + a/an + adj + noun that... 固定句型。",
  },

  // ===== READING (阅读理解) =====
  {
    id: "cet4_001", difficulty: 2, section: "reading",
    stem: "The committee members ___ arrived at the decision after three hours of discussion.",
    options: ["is", "are", "has", "have"], answer: 3,
    explanation: "committee members 强调成员个体，用复数 have arrived。",
  },
  {
    id: "cet4_005", difficulty: 2, section: "reading",
    stem: "By the time he arrives, we ___ for two hours.",
    options: ["will wait", "will have been waiting", "are waiting", "have waited"], answer: 1,
    explanation: "将来完成进行时：by the time + 将来动作，主句用 will have been doing。",
  },
  {
    id: "cet4_007", difficulty: 2, section: "reading",
    stem: "The house ___ roof is red belongs to my uncle.",
    options: ["which", "whose", "that", "whom"], answer: 1,
    explanation: "whose 表示所属关系，「那栋屋顶是红色的房子」。",
  },
  {
    id: "cet4_012", difficulty: 2, section: "reading",
    stem: "___ is known to all, the earth moves around the sun.",
    options: ["As", "Which", "That", "What"], answer: 0,
    explanation: "As is known to all 是固定表达，「众所周知」。",
  },
  {
    id: "cet4_013", difficulty: 1, section: "reading",
    stem: "I have two brothers, both of ___ are doctors.",
    options: ["who", "whom", "them", "which"], answer: 1,
    explanation: "介词 of 后用宾格 whom 引导定语从句。",
  },
  {
    id: "cet4_015", difficulty: 1, section: "reading",
    stem: "The more you practice, ___ you will become.",
    options: ["the more skillful", "more skillful", "the skillful", "most skillful"], answer: 0,
    explanation: "the more... the more... 句型，「越...越...」。",
  },
  {
    id: "cet4_019", difficulty: 1, section: "reading",
    stem: "The cake ___ by my mother tastes delicious.",
    options: ["making", "made", "is made", "was made"], answer: 1,
    explanation: "过去分词 made 作后置定语，表被动。",
  },
  {
    id: "cet4_022", difficulty: 2, section: "reading",
    stem: "The question ___ tomorrow is very important.",
    options: ["discussed", "to be discussed", "discussing", "being discussed"], answer: 1,
    explanation: "不定式 to be discussed 表将来和被动。",
  },

  // ===== CLOZE (完形填空) =====
  {
    id: "cet4_010", difficulty: 1, section: "cloze",
    stem: "The number of students in this school ___ increased greatly.",
    options: ["have", "has", "are", "were"], answer: 1,
    explanation: "the number of + 复数名词作主语，谓语用单数 has。",
  },
  {
    id: "cet4_017", difficulty: 1, section: "cloze",
    stem: "She is one of the students who ___ always on time.",
    options: ["is", "are", "was", "has been"], answer: 1,
    explanation: "who 指代 students（复数），用 are。",
  },
  {
    id: "cet4_018", difficulty: 2, section: "cloze",
    stem: "I wish I ___ harder when I was in college.",
    options: ["studied", "had studied", "would study", "study"], answer: 1,
    explanation: "wish + 过去完成时表示对过去的虚拟。",
  },
  {
    id: "cet4_020", difficulty: 3, section: "cloze",
    stem: "But for the heavy traffic, we ___ the airport on time.",
    options: ["could reach", "could have reached", "reach", "reached"], answer: 1,
    explanation: "But for = 要不是，虚拟语气用 could have done。",
  },
  {
    id: "cet4_021", difficulty: 1, section: "cloze",
    stem: "It was in this room ___ the important meeting was held.",
    options: ["where", "that", "which", "in which"], answer: 1,
    explanation: "It is/was...that... 强调句型。",
  },
  {
    id: "cet4_025", difficulty: 1, section: "cloze",
    stem: "This is the best movie ___ I have ever seen.",
    options: ["which", "that", "what", "who"], answer: 1,
    explanation: "先行词有最高级修饰时，关系代词只能用 that。",
  },
  {
    id: "cet4_030", difficulty: 2, section: "cloze",
    stem: "The reason ___ he was late was ___ he missed the bus.",
    options: ["why; because", "that; that", "why; that", "that; because"], answer: 2,
    explanation: "the reason why... is that...「…的原因是…」。",
  },
];

export const CET4_EXAM: ExamDef = {
  id: "cet4",
  name: "英语四级 (CET-4)",
  icon: "📝",
  semesterWeek: 14,
  semester: 1,
  questionCount: 20,
  passThreshold: 12,
  timeLimit: 30 * 60,
  passEffects: [
    { stat: "academics", delta: 8 },
    { stat: "charisma", delta: 3 },
  ],
  failEffects: [
    { stat: "academics", delta: -3 },
    { stat: "stress", delta: 10 },
  ],
};

export const RIVALS: ExamRival[] = [
  {
    id: "rival_juanwang", name: "卷王", persona: "学习狂魔", color: "#e74c3c",
    baseStats: { organization: 40, connections: 25, academics: 85, charisma: 35, stress: 50, budget: 30, volunteerHours: 10, allowance: 500 },
    growthRate: 2.5, catchphrase: "你都学到这个点了？",
  },
  {
    id: "rival_sheniu", name: "社牛", persona: "社交达人", color: "#f39c12",
    baseStats: { organization: 45, connections: 80, academics: 35, charisma: 82, stress: 40, budget: 40, volunteerHours: 15, allowance: 600 },
    growthRate: 2.0, catchphrase: "今晚有个局来不来",
  },
  {
    id: "rival_laoyoutiao", name: "老油条", persona: "精明算计", color: "#8e44ad",
    baseStats: { organization: 75, connections: 55, academics: 45, charisma: 30, stress: 60, budget: 75, volunteerHours: 20, allowance: 700 },
    growthRate: 1.8, catchphrase: "这个项目我盯着呢",
  },
  {
    id: "rival_xiaotouming", name: "小透明", persona: "努力追赶", color: "#95a5a6",
    baseStats: { organization: 30, connections: 25, academics: 40, charisma: 25, stress: 70, budget: 20, volunteerHours: 5, allowance: 400 },
    growthRate: 2.2, catchphrase: "我…我会加油的",
  },
  {
    id: "rival_kongjiangbing", name: "空降兵", persona: "关系户", color: "#1abc9c",
    baseStats: { organization: 30, connections: 70, academics: 40, charisma: 55, stress: 40, budget: 80, volunteerHours: 5, allowance: 900 },
    growthRate: 1.5, catchphrase: "我爸说…",
  },
];

export function pickCET4Questions(count: number): ExamQuestion[] {
  // Pick balanced mix from each section
  const sections = ["grammar", "vocabulary", "reading", "cloze"] as const;
  const perSection = Math.floor(count / sections.length);
  const remainder = count % sections.length;

  const picked: ExamQuestion[] = [];
  for (let i = 0; i < sections.length; i++) {
    const pool = CET4_QUESTIONS.filter((q) => q.section === sections[i]);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const take = perSection + (i < remainder ? 1 : 0);
    picked.push(...shuffled.slice(0, take));
  }

  // Shuffle the final selection
  return picked.sort(() => Math.random() - 0.5);
}
