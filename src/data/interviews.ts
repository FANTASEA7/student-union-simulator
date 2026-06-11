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
          effects: [{ stat: "stress", delta: -3 }, { stat: "academics", delta: 1 }],
          feedback: "哈哈，有点意思。不过生活部的事不能总靠匿名纸条。",
        },
      ],
    },
    {
      question: "学校要查寝室卫生评比，但你知道很多同学都在赶期末作业，你会怎么安排？",
      choices: [
        {
          text: "提前通知，给足准备时间，严格检查",
          effects: [{ stat: "organization", delta: 3 }, { stat: "stress", delta: 1 }],
          feedback: "行，安排得挺明白。生活部的活就是要提前想。",
        },
        {
          text: "放宽标准，期末了大家都忙，走个过场",
          effects: [{ stat: "connections", delta: 3 }, { stat: "stress", delta: -1 }],
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
          effects: [{ stat: "stress", delta: -3 }, { stat: "charisma", delta: -1 }],
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
          effects: [{ stat: "stress", delta: -2 }, { stat: "organization", delta: 1 }],
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
          effects: [{ stat: "organization", delta: 3 }, { stat: "stress", delta: -1 }],
          feedback: "务实！舞台上没有人知道你的原计划，只看最终效果。",
        },
        {
          text: "连续三天加练，不练好不休息",
          effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: 3 }],
          feedback: "你是真的有激情...但同学们可能撑不住啊。",
        },
        {
          text: "让练得好的站前面，没记住的站后排凑个人数",
          effects: [{ stat: "stress", delta: -3 }, { stat: "connections", delta: 1 }],
          feedback: "哈哈，这也是一种智慧。文体部的传统艺能了属于是。",
        },
      ],
    },
    {
      question: "你想办一场校园音乐节，但场地和音响设备都需要审批，上级觉得太麻烦建议缩小规模，你怎么办？",
      choices: [
        {
          text: "听建议缩小规模，先办起来再说",
          effects: [{ stat: "organization", delta: 2 }, { stat: "stress", delta: -2 }],
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
          effects: [{ stat: "organization", delta: 3 }, { stat: "stress", delta: 1 }],
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
          effects: [{ stat: "stress", delta: -3 }, { stat: "connections", delta: -1 }],
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
          effects: [{ stat: "stress", delta: -3 }, { stat: "organization", delta: 1 }],
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
          effects: [{ stat: "stress", delta: -3 }, { stat: "charisma", delta: -1 }],
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
          effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: 1 }],
          feedback: "勇气可嘉。但不是每个人都准备好了被直接问。",
        },
        {
          text: "先通过他身边的朋友了解情况，再慢慢找机会接触",
          effects: [{ stat: "connections", delta: 3 }, { stat: "stress", delta: -2 }],
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
          effects: [{ stat: "stress", delta: -3 }, { stat: "connections", delta: 2 }],
          feedback: "处理得很快。保护当事人是第一位的。",
        },
        {
          text: "给他递纸巾，轻声说没关系，让其他同学继续分享",
          effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -1 }],
          feedback: "自然的处理。把眼泪当成正常的事，而不是事故。",
        },
        {
          text: "停下来等他自己平静，然后让大家一个一个说想对他说的话",
          effects: [{ stat: "connections", delta: 4 }, { stat: "stress", delta: 2 }],
          feedback: "很大胆的做法。搞不好会变成集体PUA。但你这份想让大家连接的心，我看到了。",
        },
      ],
    },
  ],
};
