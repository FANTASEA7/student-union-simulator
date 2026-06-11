// src/data/events.ts
import { GameEvent } from "../types/game";

export const EVENTS: GameEvent[] = [
  // === NPC INTRODUCTION EVENTS ===
  {
    id: "meet_maidan",
    title: "食堂偶遇",
    description: "中午在食堂排队打饭时，一个蹦蹦跳跳的男生突然拍了拍你的肩膀：'哟！新面孔！'他看起来特别自来熟。",
    type: "relationship",
    stage: ["staff", "minister"],
    priority: 8,
    condition: { excludeFlags: ["met_maidan"] },
    choices: [
      {
        text: "热情回应：'你好！我是新来的'",
        effects: [{ stat: "connections", delta: 5 }, { stat: "charisma", delta: 3 }],
        feedback: "'哈哈！我叫买单哥！以后吃饭找我，哥请客！'他拍着胸脯说。你隐约觉得这人以后能处。",
        setFlags: ["met_maidan"],
        meetNpcId: "maidan_ge",
      },
      {
        text: "礼貌微笑，保持距离",
        effects: [{ stat: "connections", delta: 2 }],
        feedback: "'哎呀别害羞嘛！'他哈哈大笑，'下次见下次见！'虽然没深交，但总算认识了一张新面孔。",
        setFlags: ["met_maidan"],
        meetNpcId: "maidan_ge",
      },
    ],
  },
  {
    id: "meet_xiangyu",
    title: "社团宣传",
    description: "走在新天地的路上，一个刘海遮眉的男生热情地塞给你一张传单，上面写着'加入我们，改变世界！'。他自己倒是笑得一脸天真。",
    type: "relationship",
    stage: ["staff", "minister"],
    priority: 8,
    condition: { excludeFlags: ["met_xiangyu"] },
    choices: [
      {
        text: "接过传单认真看：'这是什么社团？'",
        effects: [{ stat: "connections", delta: 4 }, { stat: "organization", delta: 3 }],
        feedback: "'我叫香芋！跟你说，这学校没有我搞不定的事——呃，大部分吧。'虽然他说话不太靠谱的样子，但莫名让人想信任他。",
        setFlags: ["met_xiangyu"],
        meetNpcId: "xiangyu",
      },
      {
        text: "'不好意思，我赶时间'",
        effects: [{ stat: "stress", delta: -3 }],
        feedback: "'那下次再聊！'他把传单塞到你手里，跑开了。传单背面手写了一行字：'有事找我，香芋，电话138xxxx'",
        setFlags: ["met_xiangyu"],
        meetNpcId: "xiangyu",
      },
    ],
  },
  {
    id: "meet_classmate",
    title: "部门迎新",
    description: "部门第一次例会，部长让大家做自我介绍。轮到你的时候，台下有个同学特别认真地听着，还对你笑了笑。",
    type: "department",
    stage: ["staff"],
    priority: 9,
    choices: [
      {
        text: "大方介绍自己，和大家打成一片",
        effects: [{ stat: "connections", delta: 6 }, { stat: "charisma", delta: 2 }],
        feedback: "自我介绍很成功！会后好几个人主动来加你微信，部门的氛围一下子变亲切了。",
      },
      {
        text: "简短说完就坐下，观察周围的反应",
        effects: [{ stat: "organization", delta: 3 }],
        feedback: "虽然话不多，但散会后还是有几个人过来打招呼。有个同学说很喜欢你干脆的风格。",
      },
    ],
  },
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
        effects: [{ stat: "organization", delta: 5 }, { stat: "stress", delta: 10 }],
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
        effects: [{ stat: "stress", delta: -5 }, { stat: "connections", delta: -2 }],
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
        effects: [{ stat: "stress", delta: -10 }, { stat: "academics", delta: -3 }],
        feedback: "你睡到了十一点。老师果然点名了，你被记了一次缺勤。",
      },
      {
        text: "挣扎起床，冲去教室",
        effects: [{ stat: "academics", delta: 5 }, { stat: "stress", delta: 5 }],
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
        effects: [{ stat: "stress", delta: -3 }, { stat: "charisma", delta: 2 }],
        feedback: "失物招领处的大爷说你是这个月第一个来交东西的人。",
      },
      {
        text: "根据身份证信息在校园墙上发帖找人",
        effects: [{ stat: "connections", delta: 5 }, { stat: "organization", delta: 2 }],
        feedback: "帖子半小时就被顶上了热门，失主两小时后就联系你了。",
      },
      {
        text: "放回原处，装作没看到",
        effects: [{ stat: "stress", delta: 5 }, { stat: "charisma", delta: -3 }],
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
        effects: [{ stat: "connections", delta: 6 }, { stat: "stress", delta: -2 }],
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
        effects: [{ stat: "connections", delta: 6 }, { stat: "stress", delta: 3 }],
        feedback: "你的真诚打动了不少路人，评论区风向慢慢变了。",
      },
      {
        text: "不管它，流量来了又走，做自己的事",
        effects: [{ stat: "stress", delta: -5 }, { stat: "academics", delta: 3 }],
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
        effects: [{ stat: "organization", delta: 8 }, { stat: "charisma", delta: 5 }, { stat: "stress", delta: 8 }],
        feedback: "审计结果证明那个帖子是造谣。透明是最好的公关，舆论反转了。",
        setFlags: ["handled_crisis_well"],
      },
      {
        text: "找发帖人私下聊聊，希望删帖息事",
        effects: [{ stat: "connections", delta: 4 }, { stat: "stress", delta: -3 }, { stat: "charisma", delta: -3 }],
        feedback: "帖子确实删了。但'被公关'的传言又起来了...",
      },
      {
        text: "跟帖回复，用事实一条条反驳",
        effects: [{ stat: "charisma", delta: 6 }, { stat: "stress", delta: 5 }],
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
        effects: [{ stat: "organization", delta: 6 }, { stat: "stress", delta: 15 }],
        feedback: "天亮了，方案交了。你趴在桌上睡了一个小时，质量还行。",
      },
      {
        text: "找学长要了一份去年的模板，改了改交上去",
        effects: [{ stat: "stress", delta: -5 }, { stat: "organization", delta: 2 }],
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
        effects: [{ stat: "organization", delta: 4 }, { stat: "academics", delta: 5 }, { stat: "stress", delta: 10 }],
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
        effects: [{ stat: "charisma", delta: 5 }, { stat: "stress", delta: -3 }],
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
        effects: [{ stat: "connections", delta: 5 }, { stat: "stress", delta: -3 }],
        feedback: "长谈之后发现他是因为自卑才这样。你们达成了和解。",
        setFlags: ["resolved_rivalry"],
      },
      {
        text: "默默截图存证，以后再说",
        effects: [{ stat: "stress", delta: -3 }, { stat: "organization", delta: 2 }],
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

  // === OPPORTUNITY EVENTS (新增) ===
  {
    id: "province_contest",
    title: "省级竞赛",
    description: "学院通知有一个省级大学生创新创业大赛，需要组队参加。你的GPA和学生会经历让你成了同学们眼中的最佳队长人选...",
    type: "opportunity",
    stage: ["staff", "minister", "president"],
    priority: 6,
    choices: [
      {
        text: "亲自带队参赛，全力以赴冲击名次",
        effects: [{ stat: "academics", delta: 10 }, { stat: "organization", delta: 5 }, { stat: "stress", delta: 8 }],
        feedback: "你和团队熬了无数个夜晚，最终拿下了省级二等奖！证书到手的那一刻，一切都值了。",
      },
      {
        text: "帮忙组队但不参加，推荐其他有能力的同学",
        effects: [{ stat: "connections", delta: 8 }, { stat: "charisma", delta: 3 }],
        feedback: "同学们很感激你的推荐。最后队伍拿了奖，大家都说'军功章有你一半'。",
      },
      {
        text: "专心学业和学生会工作，婉拒参赛",
        effects: [{ stat: "organization", delta: 5 }, { stat: "stress", delta: -5 }],
        feedback: "你把精力花在了手头的事情上。虽然错过了一个奖，但工作做得井井有条。",
      },
    ],
  },
  {
    id: "host_recruitment",
    title: "主持招募",
    description: "学校年度文艺晚会正在招募主持人，校文艺部看中了你的气质和口才，向你发出了试镜邀请。",
    type: "opportunity",
    stage: ["staff", "minister"],
    priority: 5,
    choices: [
      {
        text: "积极准备，参加试镜，争取拿下C位主持",
        effects: [{ stat: "charisma", delta: 8 }, { stat: "connections", delta: 5 }, { stat: "stress", delta: 5 }],
        feedback: "试镜很成功！你站在聚光灯下主持了一场两千人的晚会，从此校园里多了不少认识你的人。",
      },
      {
        text: "去试镜但表示更愿意做幕后策划",
        effects: [{ stat: "organization", delta: 8 }, { stat: "charisma", delta: 3 }],
        feedback: "文艺部的同学很欣赏你对全局的把控，邀请你加入了晚会的策划组。",
      },
      {
        text: "婉拒，舞台太让人紧张了",
        effects: [{ stat: "stress", delta: -8 }, { stat: "charisma", delta: -2 }],
        feedback: "你松了一口气。但晚上躺在床上的时候，不禁想如果上了台会是什么感觉呢？",
      },
    ],
  },
  {
    id: "company_visit",
    title: "企业参观",
    description: "学校组织了去本地知名互联网公司参观的机会，名额有限。作为学生会的骨干，你有优先报名权。",
    type: "opportunity",
    stage: ["staff", "minister", "president"],
    priority: 5,
    choices: [
      {
        text: "主动报名，还帮其他同学争取了名额",
        effects: [{ stat: "connections", delta: 10 }, { stat: "academics", delta: 3 }],
        feedback: "你不仅自己去参观了，还用学生会的人脉多要了五个名额。大家对你的好感度飙升。",
      },
      {
        text: "自己报名参加，认真做好笔记",
        effects: [{ stat: "academics", delta: 8 }, { stat: "organization", delta: 3 }],
        feedback: "你详细记录了企业的运作模式，回来后还在部门的分享会上做了汇报。眼界开阔了不少。",
      },
      {
        text: "把名额让给更需要就业指导的同学",
        effects: [{ stat: "charisma", delta: 6 }, { stat: "connections", delta: 4 }],
        feedback: "你推荐的那个大四学长后来真的拿到了这家公司的offer，专门跑来感谢你。",
      },
    ],
  },
  {
    id: "media_interview",
    title: "校媒采访",
    description: "校报和广播站联合想做一期'学生会人物专访'，他们第一个想到的就是你。据说这期会在全校推送...",
    type: "opportunity",
    stage: ["staff", "minister", "president"],
    priority: 4,
    choices: [
      {
        text: "认真准备采访内容，在采访中展现学生会风采",
        effects: [{ stat: "charisma", delta: 8 }, { stat: "organization", delta: 3 }],
        feedback: "采访推文阅读量破了校媒纪录。你成了不少学弟学妹眼中的偶像。",
      },
      {
        text: "借机推广自己部门的活动和招新",
        effects: [{ stat: "connections", delta: 6 }, { stat: "charisma", delta: 4 }],
        feedback: "效果拔群！采访发出后一周内，你部门的报名表翻了三倍。",
      },
      {
        text: "把采访机会让给部门里默默付出的干事",
        effects: [{ stat: "connections", delta: 8 }, { stat: "stress", delta: -3 }],
        feedback: "那个平时不怎么说话的干事在采访中发光了。他激动地说这是他大学最难忘的经历。",
      },
    ],
  },
  {
    id: "exchange_recommend",
    title: "交换生推荐",
    description: "一位和你很熟的教授主动提出可以推荐你参加下学期的国际交换项目。他知道你的英语不错，而且学生工作经历也是加分项。",
    type: "opportunity",
    stage: ["minister"],
    priority: 7,
    choices: [
      {
        text: "全力争取，准备雅思和申请材料",
        effects: [{ stat: "academics", delta: 12 }, { stat: "connections", delta: 5 }, { stat: "organization", delta: -3 }],
        feedback: "你拿到了交换名额！虽然学生会工作要暂时放手，但这可能是改变人生的一段经历。",
        setFlags: ["exchange_recommended"],
      },
      {
        text: "感谢教授赏识，但选择留在学生会继续发光",
        effects: [{ stat: "organization", delta: 8 }, { stat: "charisma", delta: 5 }, { stat: "academics", delta: -2 }],
        feedback: "教授虽然惋惜但表示理解。他说真正优秀的人在哪里都会发光。",
      },
      {
        text: "两面兼顾：申请交换的同时做好工作交接",
        effects: [{ stat: "organization", delta: 5 }, { stat: "academics", delta: 6 }, { stat: "stress", delta: 10 }],
        feedback: "你几乎累到崩溃，但最终两边都没落下。不过你暗暗发誓再也不这么拼了。",
      },
    ],
  },

  // === CRISIS EVENTS (新增) ===
  {
    id: "budget_cut",
    title: "经费砍半",
    description: "学校突然通知：下学期的学生活动经费统一砍掉一半。你手里已经规划好的三个大型活动眼看就要泡汤了...",
    type: "crisis",
    stage: ["minister", "president"],
    priority: 8,
    choices: [
      {
        text: "紧急缩减活动规模，用创意替代预算",
        effects: [{ stat: "organization", delta: 8 }, { stat: "charisma", delta: 5 }, { stat: "stress", delta: 8 }],
        feedback: "你硬是把三个活动精简成了小而美的版本，虽然规模小了但口碑意外地好。",
      },
      {
        text: "去校外拉赞助，找商家合作填补缺口",
        effects: [{ stat: "connections", delta: 8 }, { stat: "budget", delta: 5 }, { stat: "charisma", delta: 3 }],
        feedback: "你磨破了嘴皮子，居然真的拉到了两家赞助商。虽然很累，但活动保住了。",
      },
      {
        text: "集中资源办最重要的一场，其他两个取消",
        effects: [{ stat: "organization", delta: 5 }, { stat: "budget", delta: 3 }, { stat: "connections", delta: -4 }],
        feedback: "那场活动办得很成功。但另外两个活动的参与者对你的怨气不小。",
      },
    ],
  },
  {
    id: "member_resign",
    title: "部员辞职",
    description: "连着三天，三个部门骨干先后提交了辞职申请。一个说考研，一个说太累，还有一个...说被你管得太严了。",
    type: "crisis",
    stage: ["minister"],
    priority: 7,
    choices: [
      {
        text: "逐个谈心，了解真实想法，能挽留就挽留",
        effects: [{ stat: "connections", delta: 8 }, { stat: "stress", delta: 8 }],
        feedback: "和每个人深谈后发现，两个是因为个人原因确实没法继续了，但那个说太累的愿意再试试。",
      },
      {
        text: "理解尊重，帮他们办好交接，同时火速招新",
        effects: [{ stat: "organization", delta: 8 }, { stat: "connections", delta: 3 }],
        feedback: "交接很顺利。一周后你招到了三个充满热情的新人，部门反而更有活力了。",
      },
      {
        text: "感到很失落，也开始怀疑自己是不是不适合当部长",
        effects: [{ stat: "stress", delta: 10 }, { stat: "charisma", delta: -3 }, { stat: "academics", delta: 3 }],
        feedback: "你消沉了两天。但室友安慰你说：哪有不散的宴席，重要的是你问心无愧。",
      },
    ],
  },
  {
    id: "rating_downgrade",
    title: "评级降级",
    description: "学校发布了上学期各部门工作评级，你所在的部门从A级掉到了B级。指导老师在群里发了一段意味深长的话...",
    type: "crisis",
    stage: ["minister", "president"],
    priority: 9,
    choices: [
      {
        text: "立即召开部门会议，复盘问题制定改进方案",
        effects: [{ stat: "organization", delta: 10 }, { stat: "charisma", delta: 5 }, { stat: "stress", delta: 8 }],
        feedback: "你带着大家一条一条过扣分项，制定了详细改进表。指导老师说这是他见过最认真的复盘。",
        setFlags: ["handled_rating_crisis"],
      },
      {
        text: "去找评级老师沟通，了解具体扣分原因",
        effects: [{ stat: "connections", delta: 6 }, { stat: "charisma", delta: 4 }],
        feedback: "原来扣分是因为去年的遗留问题，不全是你任期内的事。但你决定承担下来。",
      },
      {
        text: "先安抚部员情绪，告诉大家这不是任何人的错",
        effects: [{ stat: "connections", delta: 8 }, { stat: "organization", delta: 3 }],
        feedback: "你的担当让大家很感动。一个干事说：部长别怕，下个学期我们冲回A级。",
      },
    ],
  },
  {
    id: "flu_outbreak",
    title: "流感爆发",
    description: "换季流感突然爆发，你们部门十二个人倒了八个，包括负责下周活动的核心骨干。下周的活动怎么办？！",
    type: "crisis",
    stage: ["staff", "minister"],
    priority: 6,
    choices: [
      {
        text: "亲自上阵，带着仅剩的几人和志愿者把活动扛下来",
        effects: [{ stat: "organization", delta: 8 }, { stat: "stress", delta: 12 }],
        feedback: "你一个人干了三个人的活，发着烧把活动搞完了。虽然累瘫了，但你赢得了所有人的尊重。",
      },
      {
        text: "申请活动延期，让大家好好休息养病",
        effects: [{ stat: "connections", delta: 6 }, { stat: "stress", delta: -8 }],
        feedback: "你顶住了审批方的压力争取到了一周延期。生病的部员们感动得给你发了一连串表情包。",
      },
      {
        text: "把任务拆解后外包给其他友好部门帮忙",
        effects: [{ stat: "connections", delta: 8 }, { stat: "budget", delta: -3 }],
        feedback: "外联部和新媒体部伸出了援手。请他们喝了奶茶当做答谢，友情无价。",
      },
    ],
  },
  {
    id: "faction_fight",
    title: "派系斗争",
    description: "不知从什么时候开始，部门里悄悄分成了两派：一派支持你的改革方案，另一派觉得你步子迈得太大。今天的例会上两边差点吵起来...",
    type: "crisis",
    stage: ["minister", "president"],
    priority: 8,
    choices: [
      {
        text: "分别找两派的代表私下沟通，寻找折中方案",
        effects: [{ stat: "connections", delta: 8 }, { stat: "stress", delta: 8 }],
        feedback: "经过一周的穿梭外交，你找到了一个两边都能接受的方案。虽然不完美，但至少没有分裂。",
      },
      {
        text: "召开公开讨论会，让大家面对面把话说清楚",
        effects: [{ stat: "charisma", delta: 8 }, { stat: "organization", delta: 5 }, { stat: "stress", delta: 5 }],
        feedback: "讨论会开了三个小时，虽然过程激烈，但大家终于理解了彼此的顾虑。分歧还在，信任回来了。",
      },
      {
        text: "坚持自己的方案，用结果证明一切",
        effects: [{ stat: "organization", delta: 8 }, { stat: "connections", delta: -5 }],
        feedback: "方案执行得不错，确实有说服力。但反对派虽然不说话了，心里未必服气。",
      },
    ],
  },

  // === LOVE EVENTS (新增) ===
  {
    id: "love_first_date",
    title: "首次约会",
    description: "你和TA终于确认关系后的第一个正式约会。你紧张得翻遍了小红书找攻略，又怕太刻意又怕不够用心...",
    type: "love",
    stage: ["staff", "minister", "president"],
    priority: 5,
    condition: {
      hasLover: true,
    },
    choices: [
      {
        text: "精心策划了一天的行程：看电影、逛书店、天台看星星",
        effects: [{ stat: "charisma", delta: 8 }, { stat: "stress", delta: -10 }, { stat: "budget", delta: -4 }],
        feedback: "TA笑着说你还挺会的嘛。天台上的晚风吹过，你觉得这可能就是大学最好的一天了。",
      },
      {
        text: "顺其自然，一起去食堂吃饭然后压操场",
        effects: [{ stat: "connections", delta: 8 }, { stat: "stress", delta: -8 }],
        feedback: "最简单的约会反而最真实。你们从操场这头走到那头，聊了很多平时不会聊的话。",
      },
      {
        text: "约在图书馆一起自习，然后去学校咖啡厅聊天",
        effects: [{ stat: "academics", delta: 5 }, { stat: "charisma", delta: 5 }, { stat: "budget", delta: -2 }],
        feedback: "在咖啡厅里，TA突然说很喜欢和你一起学习的感觉。你差点把手里的拿铁打翻。",
      },
    ],
  },
  {
    id: "love_birthday",
    title: "对方生日",
    description: "打开手机日历时你突然发现——后天就是TA的生日了。而你差点忘了准备礼物！",
    type: "love",
    stage: ["staff", "minister", "president"],
    priority: 6,
    condition: {
      hasLover: true,
    },
    choices: [
      {
        text: "连夜手作一本相册，把你们一起的照片和回忆全放进去",
        effects: [{ stat: "charisma", delta: 10 }, { stat: "stress", delta: 8 }],
        feedback: "TA翻看相册的时候眼眶红了。没有什么比用心制作的礼物更珍贵。",
      },
      {
        text: "订了一个蛋糕，叫上TA的好朋友们一起给惊喜",
        effects: [{ stat: "connections", delta: 8 }, { stat: "charisma", delta: 6 }, { stat: "budget", delta: -5 }],
        feedback: "你在TA推门进来的那一刻带头唱起了生日快乐歌。TA先是被吓到，然后笑着笑着就哭了。",
      },
      {
        text: "买了一个TA之前无意中提到过的礼物",
        effects: [{ stat: "charisma", delta: 8 }, { stat: "budget", delta: -3 }],
        feedback: "TA惊喜地看着礼物说：你怎么知道我想要这个？你笑而不语——其实你一直都很用心在听。",
      },
    ],
  },
  {
    id: "love_rain_umbrella",
    title: "雨天送伞",
    description: "下课铃响起的时候窗外突然下起了倾盆大雨。你想起TA今天没带伞，而且TA的教学楼离宿舍有十五分钟路程...",
    type: "love",
    stage: ["staff", "minister", "president"],
    priority: 4,
    condition: {
      hasLover: true,
    },
    choices: [
      {
        text: "借两把伞，亲自去TA的教学楼下接",
        effects: [{ stat: "charisma", delta: 8 }, { stat: "connections", delta: 5 }, { stat: "stress", delta: -5 }],
        feedback: "TA看到你撑着伞站在雨里的样子，愣了一秒，然后笑着钻进了你的伞下。雨很大，但心很暖。",
      },
      {
        text: "给TA发消息让TA先别动，自己跑过去送伞",
        effects: [{ stat: "charisma", delta: 6 }, { stat: "stress", delta: 5 }],
        feedback: "你淋了半身雨跑过去，到达的时候气喘吁吁。TA嘴上说你怎么这么傻，手上却在给你擦脸上的雨水。",
      },
      {
        text: "帮TA叫了校内摆渡车，自己在手机上陪TA聊天等车",
        effects: [{ stat: "connections", delta: 5 }, { stat: "stress", delta: -8 }],
        feedback: "虽然没能亲自去接，但TA说隔着屏幕都能感觉到你的关心。摆渡车到了，TA拍了张窗外雨景发给你。",
      },
    ],
  },
  {
    id: "love_argument",
    title: "小争吵",
    description: "就因为你在部门群里多回了几条工作消息，TA觉得你最近总是忽略TA。一场不大不小的争吵就这么开始了...",
    type: "love",
    stage: ["staff", "minister", "president"],
    priority: 4,
    condition: {
      hasLover: true,
    },
    choices: [
      {
        text: "冷静下来后主动找TA好好沟通，认真道歉",
        effects: [{ stat: "charisma", delta: 6 }, { stat: "connections", delta: 5 }, { stat: "stress", delta: -5 }],
        feedback: "你说出了心里话，也听了TA的委屈。有时候争吵反而让彼此更了解对方。",
      },
      {
        text: "买杯TA最爱的奶茶，用行动表达歉意",
        effects: [{ stat: "charisma", delta: 5 }, { stat: "stress", delta: -8 }, { stat: "budget", delta: -2 }],
        feedback: "TA接过奶茶的时候嘴还在撅着，但抿了一口后嘴角偷偷上扬了。有些道歉不需要太多言语。",
      },
      {
        text: "给彼此一点冷静的时间，过后再聊",
        effects: [{ stat: "stress", delta: -5 }, { stat: "charisma", delta: -2 }],
        feedback: "冷静了两天再聊的时候，你们发现其实争执的源头只是一些小误会。TA说：下次别冷我这么久。",
      },
    ],
  },
  {
    id: "love_future_plan",
    title: "未来规划",
    description: "在图书馆里TA突然合上书，认真地看着你说：你有没有想过，我们毕业以后怎么办？",
    type: "love",
    stage: ["minister", "president"],
    priority: 5,
    condition: {
      hasLover: true,
    },
    choices: [
      {
        text: "认真聊聊彼此的目标，尝试找到共同的未来方向",
        effects: [{ stat: "charisma", delta: 8 }, { stat: "academics", delta: 5 }, { stat: "stress", delta: 5 }],
        feedback: "你们聊到图书馆闭馆。虽然未来充满了不确定，但确定的是你们都想把对方写进计划里。",
      },
      {
        text: "安抚TA的情绪，但也坦诚说未来谁也无法保证",
        effects: [{ stat: "charisma", delta: 6 }, { stat: "stress", delta: -3 }],
        feedback: "TA沉默了一会儿说：至少现在是真的。你握紧了TA的手。",
      },
      {
        text: "制定一个两人一起奋斗的学习和工作计划",
        effects: [{ stat: "organization", delta: 6 }, { stat: "academics", delta: 5 }, { stat: "connections", delta: 3 }],
        feedback: "你们定下了考研同一所城市的目标。从那天起你们成了学习搭子，互相督促互相鼓励。",
      },
    ],
  },
  // ===== 特殊NPC事件 =====
  {
    id: "xiangyu_confess",
    title: "💔 香芋的表白",
    description: "香芋找到你，一脸紧张地说他想跟桃子学姐表白，问你能不能帮忙出出主意。你还没来得及开口，他已经拉着你冲到了桃子面前...",
    type: "relationship",
    stage: ["staff", "minister"],
    priority: 8,
    condition: {
      requiredFlags: ["met_xiangyu", "met_taozi"],
      excludeFlags: ["xiangyu_confessed"],
    },
    choices: [
      {
        text: "帮他打气加油",
        effects: [{ stat: "connections", delta: 3 }, { stat: "charisma", delta: 2 }],
        feedback: "你站在一旁给他比了个加油的手势。香芋鼓足勇气：桃子学姐！我...我喜欢你！\n\n桃子愣了一下，有些尴尬地低下头：香芋，你很好...但我心里已经有喜欢的人了。对不起。\n\n香芋的笑容僵在脸上，过了好几秒才挤出一句：没、没事！哈哈...那我先走了！（转身差点撞到门框）",
        setFlags: ["xiangyu_confessed"],
      },
      {
        text: "劝他再考虑考虑",
        effects: [{ stat: "charisma", delta: 3 }, { stat: "stress", delta: -5 }],
        feedback: "你试图拉住他让他冷静一下，但香芋已经热血上头：不行！今天我一定要说出来！\n\n结果和你预想的一样——桃子委婉地拒绝了他。不过至少香芋没有太尴尬，毕竟你提前给他打过预防针了。",
        setFlags: ["xiangyu_confessed"],
      },
    ],
  },
  {
    id: "zhangyi_trap",
    title: "🕸️ 张艺的「好意」",
    description: "张艺找到你，递给你一份活动方案的草稿。他说这个方案能让你的部门在学生会里大出风头，只要你按他说的做...但他提议的方法似乎有些投机取巧。",
    type: "crisis",
    stage: ["staff", "minister"],
    priority: 8,
    condition: {
      requiredFlags: ["met_zhangyi"],
      minStats: { connections: 20 },
    },
    choices: [
      {
        text: "接受他的方案",
        effects: [{ stat: "organization", delta: 5 }, { stat: "connections", delta: -3 }, { stat: "stress", delta: 8 }, { stat: "charisma", delta: -2 }],
        feedback: "方案确实让你出了风头...但你后来发现张艺在背后把功劳都归到了他自己头上，还顺带让你背了一口黑锅。你觉得好像被当枪使了。",
        setFlags: ["zhangyi_used_me"],
      },
      {
        text: "委婉拒绝，说自己再想想",
        effects: [{ stat: "stress", delta: -5 }, { stat: "organization", delta: 2 }],
        feedback: "张艺的笑容微微一僵，但很快恢复了正常：没关系，你自己决定。不过机会这种东西，可不等人。你感觉他似乎不太高兴，但也松了一口气。",
      },
    ],
  },
  {
    id: "zhangyi_betrayal",
    title: "🐍 真相大白",
    description: "学生会突然传出一个惊人的消息：有人在期末考试中作弊被抓，而且还是利用学生会职务之便偷看了试卷！当你听到那个名字的时候，整个人都愣住了——张艺。",
    type: "crisis",
    stage: ["minister", "president"],
    priority: 10,
    condition: {
      requiredFlags: ["met_zhangyi", "zhangyi_used_me"],
      excludeFlags: ["zhangyi_exposed"],
    },
    choices: [
      {
        text: "站出举报他",
        effects: [{ stat: "organization", delta: 10 }, { stat: "charisma", delta: 5 }, { stat: "stress", delta: -5 }],
        feedback: "你整理了张艺之前利用你做的那些小动作的证据，交给了指导老师。一周后张艺被通报开除，学生会进行了大整顿。虽然过程很痛苦，但你坚持了原则。",
        setFlags: ["zhangyi_exposed", "zhangyi_bad_end"],
      },
      {
        text: "保持沉默",
        effects: [{ stat: "connections", delta: -5 }, { stat: "stress", delta: 15 }, { stat: "charisma", delta: -8 }],
        feedback: "你选择了沉默。但调查还是牵连到了你——毕竟你和张艺关系密切。虽然没有被处分，但你在学生会的声誉受到了不可挽回的损害。你终于明白了：和张艺走得近，本身就是最大的错误。",
        setFlags: ["zhangyi_exposed", "zhangyi_bad_end"],
      },
    ],
  },
  {
    id: "budget_negotiation",
    title: "💰 预算争夺战",
    description: "社管部想从你的部门预算里抽走2000块补贴其他社团。丁凯之子亲自来找你谈这件事...",
    type: "crisis",
    stage: ["minister", "president"],
    priority: 6,
    condition: {
      requiredFlags: ["entered_semester2"],
    },
    choices: [
      {
        text: "直接拒绝，这是我的预算",
        effects: [{ stat: "organization", delta: 3 }, { stat: "connections", delta: -3 }],
        feedback: "你硬气地拒绝了，但丁凯之子走的时候脸色很不好看。",
      },
      {
        text: "乖乖交出去",
        effects: [{ stat: "budget", delta: -2000 }, { stat: "stress", delta: 10 }],
        feedback: "你妥协了。虽然破财消灾，但部门成员对你的软弱颇有微词。",
      },
      {
        text: "坐下来交涉，争取折中方案",
        effects: [],
        feedback: "",
        negotiation: {
          npcName: "丁凯之子",
          npcEmoji: "🔗",
          npcPersonality: "shy",
          context: "说服丁凯之子放弃抽走部门预算",
          stakes: {
            win: "丁凯之子被你说服了，不仅不抽你的预算，还从社管部拨了1000块支持你！",
            lose: "丁凯之子态度强硬，最终还是抽走了1000块...",
          },
          onWin: {
            effects: [
              { stat: "connections", delta: 8 },
              { stat: "charisma", delta: 5 },
              { stat: "budget", delta: 1000 },
            ],
            flags: ["negotiation_budget_won"],
          },
          onLose: {
            effects: [
              { stat: "budget", delta: -1000 },
              { stat: "stress", delta: -8 },
              { stat: "connections", delta: -3 },
            ],
          },
        },
      },
    ],
  },
  {
    id: "event_sponsor_negotiation",
    title: "🤝 拉赞助",
    description: "校外奶茶店'茶小仙'有意赞助学生会的活动，但老板的条件很苛刻：要在活动上挂满广告横幅，还包括在主席台放一个巨大的奶茶杯模型...",
    type: "opportunity",
    stage: ["minister", "president"],
    priority: 5,
    choices: [
      {
        text: "全部答应，钱最重要",
        effects: [{ stat: "budget", delta: 3000 }, { stat: "organization", delta: -3 }],
        feedback: "活动当天到处都是奶茶广告，同学们吐槽说学生会的活动变成了'茶小仙新品发布会'。",
        climateEffects: { clubSatisfaction: -10 },
      },
      {
        text: "拒绝赞助，保持独立性",
        effects: [{ stat: "organization", delta: 3 }, { stat: "charisma", delta: 2 }],
        feedback: "你礼貌拒绝了。虽然资金紧张，但你保住了学生会的面子。",
      },
      {
        text: "和老板交涉，争取更好的条件",
        effects: [],
        feedback: "",
        negotiation: {
          npcName: "奶茶店老板",
          npcEmoji: "🧋",
          npcPersonality: "mischievous",
          context: "和茶小仙老板交涉赞助条件",
          stakes: {
            win: "老板被你说服了！只放一个小立牌，但赞助金额不变，还额外送你一年免费奶茶券！",
            lose: "老板寸步不让，最后只给了一半赞助费还要求挂满广告...",
          },
          onWin: {
            effects: [
              { stat: "budget", delta: 3000 },
              { stat: "charisma", delta: 5 },
              { stat: "connections", delta: 3 },
            ],
            flags: ["sponsor_negotiation_won"],
          },
          onLose: {
            effects: [
              { stat: "budget", delta: 1500 },
              { stat: "organization", delta: -5 },
              { stat: "stress", delta: -5 },
            ],
          },
        },
      },
    ],
  },
];
