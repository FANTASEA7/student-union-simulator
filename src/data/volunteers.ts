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
      type: "catch",
      config: { timeLimit: 25, targetCount: 12 },
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
        effects: [{ stat: "stress", delta: -3 }],
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
        effects: [{ stat: "stress", delta: -2 }],
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
      type: "whack",
      config: { timeLimit: 20, targetCount: 15 },
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
        effects: [{ stat: "stress", delta: -5 }],
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
        effects: [{ stat: "stress", delta: -3 }, { stat: "connections", delta: -2 }],
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
  // ===== 新增志愿事件 =====
  {
    id: "volunteer_blood_drive",
    title: "献血活动志愿者",
    description: "学校组织的无偿献血活动需要志愿者协助登记、引导和分发营养品。帮助别人也是在帮助自己。",
    type: "volunteer",
    volunteerLevel: "school",
    volunteerName: "献血志愿服务",
    baseHours: 6,
    stage: ["staff", "minister"],
    priority: 4,
    miniGame: {
      type: "click",
      config: { timeLimit: 20, targetCount: 30 },
    },
    bonus: { connections: 2, charisma: 3 },
    choices: [
      {
        text: "报名志愿者",
        effects: [],
        feedback: "你穿上了志愿者马甲，准备引导献血的同学...",
      },
      {
        text: "有点怕针，算了",
        effects: [{ stat: "stress", delta: -3 }],
        feedback: "虽然不是让你献血，但你还是选择绕道走。",
      },
    ],
  },
  {
    id: "volunteer_campus_clean",
    title: "校园环保日",
    description: "校环保协会发起了'美丽校园'清扫行动，需要志愿者分组清理校园各个角落的垃圾。",
    type: "volunteer",
    volunteerLevel: "school",
    volunteerName: "校园环保行动",
    baseHours: 5,
    stage: ["staff", "minister"],
    priority: 3,
    miniGame: {
      type: "catch",
      config: { timeLimit: 20, targetCount: 15 },
    },
    bonus: { organization: 2, stress: 2 },
    choices: [
      {
        text: "拿起扫帚出发",
        effects: [],
        feedback: "戴上手套拿起垃圾袋，你化身校园清洁卫士...",
      },
      {
        text: "周末想睡懒觉",
        effects: [{ stat: "stress", delta: -2 }],
        feedback: "你在床上翻了个身。窗外的阳光很好，校园也很干净——大概吧。",
      },
    ],
  },
  {
    id: "volunteer_library",
    title: "图书馆义工",
    description: "校图书馆正在整理老旧藏书，需要志愿者帮忙分类、录入和上架。爱书人的天堂！",
    type: "volunteer",
    volunteerLevel: "school",
    volunteerName: "图书馆整理",
    baseHours: 10,
    stage: ["staff", "minister", "president"],
    priority: 4,
    miniGame: {
      type: "memory",
      config: { timeLimit: 25, pairCount: 10 },
    },
    bonus: { academics: 4, organization: 2 },
    choices: [
      {
        text: "走进书海",
        effects: [],
        feedback: "你推着满满一车书走进了图书馆深处...",
      },
      {
        text: "我对灰尘过敏",
        effects: [{ stat: "academics", delta: -1 }],
        feedback: "你走开了。但听说参加的同学在旧书堆里发现了一本绝版书...",
      },
    ],
  },
  {
    id: "volunteer_marathon",
    title: "城市马拉松志愿者",
    description: "一年一度的城市马拉松需要大量志愿者负责补给站、路线引导和急救协助。全城盛事！",
    type: "volunteer",
    volunteerLevel: "city",
    volunteerName: "马拉松志愿服务",
    baseHours: 14,
    stage: ["staff", "minister", "president"],
    priority: 6,
    miniGame: {
      type: "whack",
      config: { timeLimit: 22, targetCount: 18 },
    },
    bonus: { connections: 5, organization: 3, stress: 3 },
    choices: [
      {
        text: "凌晨四点起床集合",
        effects: [],
        feedback: "天还没亮你就到了集合点。虽然困，但大家的热情让你精神起来...",
      },
      {
        text: "起太早了，拒绝",
        effects: [{ stat: "stress", delta: -5 }, { stat: "connections", delta: -1 }],
        feedback: "你选择了温暖的被窝。但看到朋友圈刷屏的马拉松照片时，还是有点后悔。",
      },
    ],
  },
];
