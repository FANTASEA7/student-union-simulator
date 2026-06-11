// src/data/promotionQuestions.ts
// 晋升选拔大会：哈马(老师)与张艺(大三学长)轮流提问

export interface PromotionQuestion {
  id: string;
  speaker: "hama" | "zhangyi";
  question: string;
  choices: {
    text: string;
    score: number;       // 隐藏分数 2=最佳 1=尚可 0=踩雷
    effects: { stat: string; delta: number }[];
    feedback: string;    // NPC的反应
  }[];
}

export const PROMOTION_QUESTIONS: PromotionQuestion[] = [
  {
    id: "pq1",
    speaker: "hama",
    question: "你觉得你有资格当部长？就凭你那点志愿时长？我看隔壁部门的同学一学期做了五十个小时，你呢？",
    choices: [
      {
        text: "志愿时长不代表一切，我在其他方面有更出色的表现",
        score: 2,
        effects: [
          { stat: "charisma", delta: 5 },
          { stat: "organization", delta: 3 },
        ],
        feedback: "哈马冷哼一声：行，至少你还敢顶嘴。比那些只会低头认错的有意思。",
      },
      {
        text: "我会在接下来的时间里加倍补上志愿时长",
        score: 1,
        effects: [
          { stat: "organization", delta: 4 },
          { stat: "stress", delta: 3 },
        ],
        feedback: "哈马推了推眼镜：表态谁都会。我要看的是行动，不是嘴皮子。",
      },
      {
        text: "志愿者活动确实不是我擅长的领域，但我可以调动更多人参与",
        score: 2,
        effects: [
          { stat: "connections", delta: 4 },
          { stat: "charisma", delta: 4 },
        ],
        feedback: "哈马愣了一下：...调动别人？你倒挺会使唤人。不过管理岗确实需要这个。",
      },
    ],
  },
  {
    id: "pq2",
    speaker: "zhangyi",
    question: "如果你当了部长，前任部长留下来的那些人你打算怎么处理？有些人资历比你老，有些人是前任的死忠，你压得住吗？",
    choices: [
      {
        text: "用人不疑，我会尊重每个人的贡献，靠能力服人而不是靠职位压人",
        score: 2,
        effects: [
          { stat: "charisma", delta: 5 },
          { stat: "connections", delta: 4 },
        ],
        feedback: "张艺意味深长地笑了笑：说得好听。不过...我倒是挺期待看你实践的。",
      },
      {
        text: "能者上，平者让，不适应新团队的我可以帮忙找其他部门",
        score: 1,
        effects: [
          { stat: "organization", delta: 6 },
          { stat: "connections", delta: -2 },
        ],
        feedback: "张艺嘴角微扬：啧啧，还没上任就开始清理门户了？够狠。不过学生会确实需要这种魄力...",
      },
      {
        text: "我会和他们一一沟通，了解每个人的想法再做决定",
        score: 2,
        effects: [
          { stat: "connections", delta: 5 },
          { stat: "stress", delta: 3 },
        ],
        feedback: "张艺点点头：沟通很重要。但小心——有时候你听到的不一定是真话。这个道理，我深有体会。",
      },
    ],
  },
  {
    id: "pq3",
    speaker: "hama",
    question: "活动经费砍半，你怎么搞？别跟我说又要来求我批钱。上次有个人在我办公室门口站了三个小时，你知道后来怎么了吗？",
    choices: [
      {
        text: "缩减不必要的开支，用创意弥补预算的不足",
        score: 2,
        effects: [
          { stat: "organization", delta: 5 },
          { stat: "budget", delta: 3 },
        ],
        feedback: "哈马嗤笑一声：创意？上次有人说用纸箱子搞舞台，结果台塌了。不过...你敢想总是好的。",
      },
      {
        text: "出去拉赞助，不能什么都指望学校拨款",
        score: 2,
        effects: [
          { stat: "connections", delta: 5 },
          { stat: "charisma", delta: 3 },
        ],
        feedback: "哈马眯起眼：拉赞助？你以为容易？不过你愿意去试，我倒是省心了。记住——别丢学校的脸。",
      },
      {
        text: "如果有必要，我会据理力争申请追加经费",
        score: 0,
        effects: [
          { stat: "stress", delta: 5 },
          { stat: "charisma", delta: -2 },
        ],
        feedback: "哈马的脸沉了下来：你知道全校有多少个社团在排队等经费吗？（把笔往桌上一摔）你啊，还是太年轻。",
      },
    ],
  },
  {
    id: "pq4",
    speaker: "zhangyi",
    question: "有人说你在部门里拉帮结派，搞小圈子。别紧张——我不是来审你的。我只是好奇，你怎么看这种说法？",
    choices: [
      {
        text: "这是无稽之谈。我和每个人关系都很好，不存在拉帮结派",
        score: 1,
        effects: [
          { stat: "charisma", delta: 3 },
          { stat: "connections", delta: 3 },
        ],
        feedback: "张艺笑意更浓了：和每个人都很好？那也就是说...和谁都不是真正的盟友咯？这个位置，没有自己人可不行。",
      },
      {
        text: "我有亲密的合作伙伴，但决策上我始终保持公正",
        score: 2,
        effects: [
          { stat: "organization", delta: 4 },
          { stat: "charisma", delta: 4 },
        ],
        feedback: "张艺若有所思：亲密的伙伴...公正的决策...有意思。看来你不是什么都不懂。但有些坑，还是要自己掉进去才知道。",
      },
      {
        text: "与其说拉帮结派，不如说是志同道合的人自然走到了一起",
        score: 2,
        effects: [
          { stat: "connections", delta: 4 },
          { stat: "charisma", delta: 3 },
        ],
        feedback: "张艺轻轻鼓了两下掌：这话说得漂亮。我当年也这么说过。不过后来我发现——志同道合也会变成各怀鬼胎。你多保重。",
      },
    ],
  },
  {
    id: "pq5",
    speaker: "hama",
    question: "上学期你们部门的评级才拿了个B！评级的扣分项我一个个看了——活动参与率低、报销单填错三次、总结报告迟交了五天。你觉得是谁的锅？",
    choices: [
      {
        text: "是我的责任，作为团队一员我难辞其咎。我会针对性改进每一项",
        score: 2,
        effects: [
          { stat: "organization", delta: 6 },
          { stat: "charisma", delta: 3 },
        ],
        feedback: "哈马微微点了下头：肯认就好。最烦那种出了事就推来推去的。不过光认没用——你给我把改进方案写出来，下周一前放到我桌上。",
      },
      {
        text: "评级只是数字，我们部门做的很多工作是无法量化的",
        score: 0,
        effects: [
          { stat: "charisma", delta: 2 },
          { stat: "organization", delta: -3 },
        ],
        feedback: "哈马脸色一黑：无法量化？你当这是搞艺术呢！（指着评级表）这是制度！制度懂不懂？不想遵守制度就趁早别干！",
      },
      {
        text: "报销单和总结报告我可以改进流程，但活动参与率需要全部门一起努力",
        score: 1,
        effects: [
          { stat: "organization", delta: 4 },
          { stat: "connections", delta: 2 },
        ],
        feedback: "哈马推了推眼镜：流程改进？这个思路可以。但你最好说到做到，下次再看到填错的报销单，我直接给你打回去。",
      },
    ],
  },
  {
    id: "pq6",
    speaker: "hama",
    question: "假如——我是说假如——你当了部长，手头有八千块经费。文艺部要三千搞晚会，体育部要两千五买器材，宣传部要一千五印海报。还剩一千，你给谁？",
    choices: [
      {
        text: "合理分配，把剩余一千作为应急备用金，有紧急需求再批",
        score: 2,
        effects: [
          { stat: "organization", delta: 5 },
          { stat: "budget", delta: 3 },
        ],
        feedback: "哈马难得露出了一丝认可：备用金？嗯...这么多年了，终于遇到一个知道留后手的。我批了——但这笔钱的每一分花在哪里，我要看到记录。明白了？",
      },
      {
        text: "优先保障影响力最大的活动，宣传工作做好了大家都有利",
        score: 1,
        effects: [
          { stat: "connections", delta: 4 },
          { stat: "budget", delta: 2 },
        ],
        feedback: "哈马哼了一声：宣传做好了大家都有利？宣传部的人都不好意思这么夸自己。不过也算是一种思路。",
      },
      {
        text: "我自己写一份详细预算分析，谁花得合理给谁",
        score: 2,
        effects: [
          { stat: "academics", delta: 5 },
          { stat: "organization", delta: 3 },
        ],
        feedback: "哈马嘴角抽了抽：预算分析？你这是当部长还是当审计？不过...我喜欢。数据说话永远是最有说服力的。",
      },
    ],
  },
  {
    id: "pq7",
    speaker: "zhangyi",
    question: "最后一个问题。（停顿了很久，直直地盯着你）你觉得——你配吗？",
    choices: [
      {
        text: "我配。不是因为我完美无缺，而是因为我有面对的勇气和改变的决心",
        score: 2,
        effects: [
          { stat: "charisma", delta: 8 },
          { stat: "organization", delta: 4 },
        ],
        feedback: "张艺沉默了很久。然后他笑了——不是平时那种虚假的笑，而是一个很淡、很真诚的弧度。他说：...也许你是对的。也许有些事，不需要算计那么多。好好干吧。",
      },
      {
        text: "我不知道。但我可以保证，我会尽全力做到问心无愧",
        score: 2,
        effects: [
          { stat: "charisma", delta: 5 },
          { stat: "connections", delta: 5 },
        ],
        feedback: "张艺轻轻叹了口气：不知道...真是个诚实的回答。你知道吗？我问过很多人这个问题，你是第一个说不知道的人。这种坦率...比那些满口大话的强。",
      },
      {
        text: "学生会需要的不是配不配的问题，而是愿不愿意付出的人",
        score: 1,
        effects: [
          { stat: "charisma", delta: 5 },
          { stat: "organization", delta: 3 },
        ],
        feedback: "张艺若有所思：回避问题的艺术...你学得不错。不过确实——比起资格，态度更重要。但你记住：光有态度没有能力，迟早摔跟头。",
      },
    ],
  },
];

export const HAMA_PROFILE = {
  id: "hama",
  name: "哈马",
  title: "学生会指导老师",
  personality: "刻薄抠门，掌握经费审批和人事大权。说话阴阳怪气，但心底其实希望学生成长——只是从不直接说出口。",
  color: "#8b4513",
  icon: "👨‍🏫",
  avatar: "/characters/hama.png",
};

export const ZHANGYI_PROFILE = {
  id: "zhangyi",
  name: "张艺",
  title: "大三学长",
  personality: "心机深沉，说话滴水不漏。曾在学生会爬到高位又被拉下来，对权力有执念。",
  color: "#6c3483",
  icon: "🎭",
  avatar: "/characters/zhangyi.png",
};
