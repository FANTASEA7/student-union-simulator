// src/data/fpScenes.ts
// First-person dialogue scene data
import { FPDialogueLine, FPDialogueScene } from "../types/game";

/** Week 5: 生活部 — 烟头叔叔带主角查寝 */
export function getDormInspectionLifeScene(): FPDialogueScene {
  return {
    id: "dorm_inspection_life",
    title: "第5周 · 跟着烟头学查寝",
    lines: [
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "周五晚上八点，你正在活动室整理本周的值班记录。门被推开——烟头叔叔叼着半截烟走进来，手里拿着一沓寝室评分表。",
        side: "center",
      },
      {
        speakerId: "yantou",
        speakerName: "烟头叔叔",
        speakerEmoji: "🚬",
        text: "小同志，今晚有事没？没事就跟我走一趟——查寝。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他把评分表往你桌上一放，掏出打火机重新点燃那半截烟。",
        side: "center",
      },
      {
        speakerId: "player",
        speakerName: "你",
        speakerEmoji: "",
        text: "查寝？现在？",
        side: "right",
      },
      {
        speakerId: "yantou",
        speakerName: "烟头叔叔",
        speakerEmoji: "🚬",
        text: "对。你是生活部的新人，早晚得学这个。别紧张——不是让你去抓人。查寝的重点从来不是'查'。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他吐出一口烟，眯着眼睛看你，像是在等你自己琢磨出答案。",
        side: "center",
      },
      {
        speakerId: "player",
        speakerName: "你",
        speakerEmoji: "",
        text: "那重点是什么？",
        side: "right",
      },
      {
        speakerId: "yantou",
        speakerName: "烟头叔叔",
        speakerEmoji: "🚬",
        text: "重点是人。你是去敲门、打招呼、问一句'最近怎么样'。\n\n卫生不合格的，别上来就记——先问原因。有人是懒，有人是忙，有人是真的不会收拾。你得先分清楚。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他把烟灭了，站起来拍了拍你的肩膀。",
        side: "center",
      },
      {
        speakerId: "yantou",
        speakerName: "烟头叔叔",
        speakerEmoji: "🚬",
        text: "慢慢你就明白了，做学生工作最重要的不是执行规则——是让人信你。\n\n走吧，先从二楼开始。前几个寝室我在旁边看着，你来敲。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "跟着烟头叔叔走完一整层楼。他不是在查寝——是在串门。每进一个寝室，他都记得里面住的是谁、哪个专业的、最近有没有困难。\n\n不合格的地方他照样会指出来，但语气像是在提醒朋友，而不是在训人。回活动室的路上，他递给你一支笔。",
        side: "center",
      },
      {
        speakerId: "yantou",
        speakerName: "烟头叔叔",
        speakerEmoji: "🚬",
        text: "这个评分表你收着。下周你自己来。\n\n记住我说的：你是去帮他们的，不是去管他们的。行了，今晚辛苦了，回去早点睡。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他走了两步又回头，补了一句。",
        side: "center",
      },
      {
        speakerId: "yantou",
        speakerName: "烟头叔叔",
        speakerEmoji: "🚬",
        text: "对了——以后别学我抽烟，对身体不好。",
        side: "left",
      },
    ],
    onComplete: {
      flags: ["dorm_inspection_done"],
      meetNpcIds: ["yantou"],
      effects: [
        { stat: "connections", delta: 4 },
        { stat: "organization", delta: 3 },
        { stat: "stress", delta: 3 },
      ],
      setPhase: "game",
    },
  };
}

/** Week 5: 非生活部 — 张艺突击查寝没收吹风机 */
export function getDormInspectionZhangyiScene(): FPDialogueScene {
  return {
    id: "dorm_inspection_zhangyi",
    title: "第5周 · 不速之客",
    lines: [
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "周四晚上十点半，你刚吹完头发准备上床。寝室里其他人都还在下面打游戏、刷手机。\n\n突然——三声急促的敲门。不是室友忘带钥匙那种节奏。",
        side: "center",
      },
      {
        speakerId: "roommate",
        speakerName: "室友",
        speakerEmoji: "😨",
        text: "谁啊这么晚——",
        side: "right",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "门一开，门外站着一个高个子男生。黑色外套，双手插兜，目光冷淡地扫过整个寝室。\n\n你认得他——张艺，大三，在学生会里名声很大。不过不是什么好名声。",
        side: "center",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "查寝。你们寝室几个人？都在吗？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他没有出示任何证件，也没解释为什么晚上十点来查寝。但你注意到他胸前别着学生会的徽章。\n\n他径直走进来，目光在桌上扫了一圈，最后停在你桌上的吹风机上。",
        side: "center",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "这个。违禁电器。不知道规定吗？",
        side: "left",
      },
      {
        speakerId: "player",
        speakerName: "你",
        speakerEmoji: "",
        text: "吹风机也算违禁电器？",
        side: "right",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "宿舍管理条例第三条第十七款：大功率电器一律禁止。超过八百瓦就是违规。你这把多少瓦？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他拿起你的吹风机，翻到底部看了一眼标签，冷笑了一下。",
        side: "center",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "一千二。没收。明天自己来学生会办公室签字。\n\n（他扫了一眼寝室其他人）你们——都注意点。下次就不是没收这么简单了。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他把吹风机装进随身带的帆布袋里，头也不回地走了出去。门在他身后砰地关上。寝室里安静了五秒，你室友才敢出声。",
        side: "center",
      },
      {
        speakerId: "roommate",
        speakerName: "室友",
        speakerEmoji: "😤",
        text: "……他有病吧？？十点了查寝？吹风机也算？？那楼下那些用电磁炉的怎么不见他去收？？",
        side: "right",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "你没说话。但你觉得张艺查的不是电器——他在查人。在找可捏的软柿子。\n\n后来你打听到：他根本不在生活部，查寝不是他的职责范围。他只是想借机在各寝室里立威。\n\n那把吹风机最终没要回来。但这件事让你记住了张艺的做事方式。",
        side: "center",
      },
    ],
    onComplete: {
      flags: ["dorm_inspection_done", "met_zhangyi"],
      meetNpcIds: ["zhangyi"],
      effects: [
        { stat: "connections", delta: 2 },
        { stat: "stress", delta: -5 },
        { stat: "charisma", delta: 2 },
      ],
      setPhase: "game",
    },
  };
}

/** Week 3: 买单哥食堂请客 — 大撒币式社交 */
export function getMaidanFeastScene(): FPDialogueScene {
  return {
    id: "maidan_feast",
    title: "第3周 · 食堂霸王餐",
    lines: [
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "周三中午，食堂人山人海。你端着托盘四处找座，突然一只手从人群里伸出来，精准地拍在你肩上。",
        side: "center",
      },
      {
        speakerId: "maidan",
        speakerName: "买单哥",
        speakerEmoji: "😎",
        avatar: "characters/maidan.png",
        text: "嘿！又碰到你了！端着盘子发什么呆？来来来，跟哥坐！",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "买单哥不由分说把你拽到角落一张大桌前。桌上已经摆了七八个菜——红烧肉、糖醋排骨、水煮鱼、干锅花菜……完全不像一个人的量。",
        side: "center",
      },
      {
        speakerId: "maidan",
        speakerName: "买单哥",
        speakerEmoji: "😎",
        avatar: "characters/maidan.png",
        text: "别客气！哥今天手气好，斗地主赢了隔壁老李五十块。这顿我请，敞开吃！",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他还顺便招呼了几个看起来不太富裕的同学坐下，一人塞了一双筷子。",
        side: "center",
      },
      {
        speakerId: "maidan",
        speakerName: "买单哥",
        speakerEmoji: "😎",
        avatar: "characters/maidan.png",
        text: "都别跟我客气啊！那个谁——阿姨！再加两个菜！对，爆炒牛肉和麻婆豆腐，大份的！",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "一个同学小声说太多了吃不完。买单哥大手一挥。",
        side: "center",
      },
      {
        speakerId: "maidan",
        speakerName: "买单哥",
        speakerEmoji: "😎",
        avatar: "characters/maidan.png",
        text: "吃不完打包！怕什么？我跟你说，钱这个东西嘛——花了还能赚。但是朋友，交一个少一个。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他一边往嘴里塞红烧肉，一边继续滔滔不绝。",
        side: "center",
      },
      {
        speakerId: "maidan",
        speakerName: "买单哥",
        speakerEmoji: "😎",
        avatar: "characters/maidan.png",
        text: "你看咱学生会有些人，天天板着脸，好像全世界欠他二百块。何必呢？开心最重要！来来来，吃肉吃肉！",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "食堂里热气腾腾，桌上的人越来越多。买单哥举着可乐罐到处敬'酒'，跟每个路过的人都要击个掌。",
        side: "center",
      },
      {
        speakerId: "maidan",
        speakerName: "买单哥",
        speakerEmoji: "😎",
        avatar: "characters/maidan.png",
        text: "对了——下周我还请！谁不来谁是看不起我！尤其是你！（指着你）必须来！",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "旁边的同学都笑了。你看着买单哥那张笑嘻嘻的脸，忽然觉得这顿饭可能不只是吃饭那么简单。\n\n有些人喜欢用钱开路。但买单哥——他好像真的只是觉得「大家一起开心」比什么都重要。",
        side: "center",
      },
    ],
    onComplete: {
      flags: ["maidan_feast", "met_maidan"],
      meetNpcIds: ["maidan_ge"],
      effects: [
        { stat: "connections", delta: 8 },
        { stat: "stress", delta: -10 },
        { stat: "charisma", delta: 3 },
      ],
      setPhase: "game",
    },
  };
}

/** Week 10: 张艺在空教室胁迫学弟 — 权力的阴暗面 */
export function getZhangyiPressureScene(): FPDialogueScene {
  return {
    id: "zhangyi_pressure",
    title: "第10周 · 空教室里的交易",
    lines: [
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "周四晚上，自习结束。你路过综合楼三楼，发现走廊尽头那间教室还亮着灯。\n\n你本打算直接走过——直到听见一个熟悉的声音。",
        side: "center",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "……所以你想清楚了没有？你那个社团活动的申请，在我手上压了三天。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "另一个声音很年轻，带着一点怯。",
        side: "center",
      },
      {
        speakerId: "kohai",
        speakerName: "学弟",
        speakerEmoji: "😰",
        text: "张、张艺学长……我不太明白。材料我都交齐了，为什么要——",
        side: "right",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "齐全？（轻笑）学弟，你还太年轻。在学生会，'齐全'是相对的。我说它齐，它就齐。我说不齐——那就还有缺的东西。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "张艺站起身，踱步到窗边，月光把他的影子拉得很长。他语气平静，但每一个字都像钉在墙上。",
        side: "center",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "你知道上届文体部的圆子吗？跟你一样，交了一份'齐全'的材料。后来他的活动批下来了——预算砍了一半，场地换到了地下室。",
        side: "left",
      },
      {
        speakerId: "kohai",
        speakerName: "学弟",
        speakerEmoji: "😰",
        text: "可是圆子学长他……他没做错什么啊……",
        side: "right",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "错就错在他以为按流程走就够了。流程是给不懂事的人看的。懂事的人，知道额外的诚意应该放在哪里。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "张艺转过身，居高临下地看着学弟。他的嘴角微微上扬，但眼睛里没有任何笑意。",
        side: "center",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "我不是在为难你。我是在教你。\n\n你的活动方案写得不错——大学生音乐节，2000预算，500人规模。如果批下来，你就是下届文体部部长的有力人选。",
        side: "left",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "但是呢……如果批不下来，你连报名竞选的资格都没有。这条线，我刚好管着。",
        side: "left",
      },
      {
        speakerId: "kohai",
        speakerName: "学弟",
        speakerEmoji: "😰",
        text: "学长……你到底要我做什么？",
        side: "right",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "很简单。以后每次缴费，多交三百。不用开发票的那种。三百块钱买一个部长候选资格——贵吗？不贵。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "教室里安静得可怕。学弟低着头，手指攥得发白。窗外的风吹得窗帘轻轻晃动。",
        side: "center",
      },
      {
        speakerId: "kohai",
        speakerName: "学弟",
        speakerEmoji: "😰",
        text: "……我每个月生活费只有一千。三百块，我拿不出来。",
        side: "right",
      },
      {
        speakerId: "zhangyi",
        speakerName: "张艺",
        speakerEmoji: "😐",
        avatar: "characters/zhangyi.png",
        text: "那就想办法。兼职、借钱、省饭钱——那是你的事。我只负责告诉你规则。\n\n（他拿起桌上那份活动申请表，轻轻折了一下）\n\n这个我先拿回去。你想好了，下周同一时间来这找我。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "张艺走出了教室。经过门口时，他转头朝你藏身的楼梯口看了一眼——那一眼很短，但你确信他看见你了。\n\n他什么都没说，只是微微一笑，消失在走廊尽头。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "学弟还坐在教室里，一动不动。桌上的申请表折痕清晰可见。\n\n你忽然意识到——在这个学生会里，有些人的权力，远比你想的要黑暗。",
        side: "center",
      },
    ],
    choices: [
      {
        text: "走进去安慰学弟，告诉他不必屈服",
        effects: [
          { stat: "charisma", delta: 5 },
          { stat: "connections", delta: 5 },
        ],
        feedback: "学弟抬起头，眼睛红红的。你拍了拍他的肩，说了些话。他点了点头。但你知道，张艺不会善罢甘休。",
        setFlags: ["zhangyi_confronted"],
      },
      {
        text: "悄悄离开，把这件事记在心里",
        effects: [
          { stat: "stress", delta: -5 },
          { stat: "organization", delta: 3 },
        ],
        feedback: "你悄悄退后几步，无声地离开了。但你记住了张艺说的每一个字。总有一天，这些东西会有用的。",
        setFlags: ["zhangyi_witnessed"],
      },
      {
        text: "直接推门进去质问张艺——但他已经走了",
        effects: [
          { stat: "stress", delta: 8 },
          { stat: "charisma", delta: 3 },
        ],
        feedback: "你推开门，但张艺已经不在。学弟抬起头看着你，眼眶微红。你没有证据，但至少让他知道——有人看见了。",
        setFlags: ["zhangyi_confronted"],
      },
    ],
    onComplete: {
      flags: ["zhangyi_pressure_seen", "met_zhangyi"],
      meetNpcIds: ["zhangyi"],
      effects: [
        { stat: "connections", delta: 6 },
        { stat: "organization", delta: 4 },
        { stat: "stress", delta: 5 },
      ],
      setPhase: "game",
    },
  };
}

/** Week 7: 香芋向桃子表白被拒 → 恼羞成怒恶意诋毁 → 桃子崩溃 */
export function getXiangyuConfessScene(): FPDialogueScene {
  return {
    id: "xiangyu_confess_to_taozi",
    title: "第7周 · 破碎的告白",
    lines: [
      // ===== 告白 =====
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "第7周，周三傍晚。你抄近路穿过樱花大道，远远看到两个熟悉的身影——香芋和桃子站在樱花树下。",
        side: "center",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😊",
        avatar: "characters/xiangyu.png",
        text: "桃子学姐！我今天一定要说出来——我从大一第一天就喜欢你了。迎新那天你帮我指路的时候，我就……",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "香芋的声音有些发抖，手指紧张地绞在一起。",
        side: "center",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😊",
        avatar: "characters/xiangyu.png",
        text: "我知道我不太靠谱，部长骂我，学弟也不把我当回事。但我对你是认真的！桃子学姐，你愿意和我在一起吗？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "长长的沉默。桃子低下了头。",
        side: "center",
      },
      {
        speakerId: "taozi",
        speakerName: "桃子",
        speakerEmoji: "😔",
        avatar: "characters/taozi.png",
        text: "香芋……谢谢你。但对不起，我不能答应你。",
        side: "right",
      },
      // ===== 崩坏：诋毁与恶意 =====
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "香芋脸上的笑容凝固了。片刻之后，他的表情彻底变了。",
        side: "center",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😤",
        avatar: "characters/xiangyu.png",
        text: "……呵。不能答应？就这样？",
        side: "left",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😤",
        avatar: "characters/xiangyu.png",
        text: "你知道我等了多久吗？两年。我给你送了多少东西，帮你做了多少事——每次你都笑眯眯地接受，给我希望，让我觉得我还有机会。",
        side: "left",
      },
      {
        speakerId: "taozi",
        speakerName: "桃子",
        speakerEmoji: "😥",
        avatar: "characters/taozi.png",
        text: "我……我没有那个意思，我只是——",
        side: "right",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😠",
        avatar: "characters/xiangyu.png",
        text: "只是什么？只是享受被人喜欢的感觉是吧？对谁都笑眯眯，对谁都温柔——你就是用这副嘴脸让人围着你转的吧？",
        side: "left",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😡",
        avatar: "characters/xiangyu.png",
        text: "你知不知道别人背地里怎么说你？绿茶、白莲花——我现在终于信了。你这种人最恶心了。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "每一个字都像一把刀。桃子的脸一下子白了，嘴唇发抖，眼眶瞬间泛红。",
        side: "center",
      },
      {
        speakerId: "taozi",
        speakerName: "桃子",
        speakerEmoji: "😢",
        avatar: "characters/taozi.png",
        text: "绿茶……白莲花……你是这样看我的？",
        side: "right",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😤",
        avatar: "characters/xiangyu.png",
        text: "不然呢？收我的礼物的时候怎么不说'不能答应'？让我半夜帮你改PPT的时候怎么不说？哦对，你还会说'谢谢你香芋你真好'——真好是吧？好骗是吧？",
        side: "left",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😡",
        avatar: "characters/xiangyu.png",
        text: "两年。我花了两年时间，给你当狗。结果呢？一句'不能答应'就打发了。你知道我现在想什么吗？我想把送你的东西全要回来。",
        side: "left",
      },
      {
        speakerId: "taozi",
        speakerName: "桃子",
        speakerEmoji: "😭",
        avatar: "characters/taozi.png",
        text: "……够了。香芋，你别说了。",
        side: "right",
      },
      {
        speakerId: "xiangyu",
        speakerName: "香芋",
        speakerEmoji: "😤",
        avatar: "characters/xiangyu.png",
        text: "怎么，说到痛处了？桃子学姐，我终于看清楚了。你就是那种——把别人的真心当柴烧的人。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "桃子没有再说话。泪水从她眼睛里涌出来，顺着脸颊往下淌。她用手死死捂住嘴，肩膀剧烈地颤抖。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "香芋看了她一眼——眼神里没有歉意，只有冰冷的厌恶。他转身走开了，没有回头。",
        side: "center",
      },
      // ===== 收束 =====
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "桃子独自站在樱花树下，肩膀一抽一抽的，拼命忍住哭声。花瓣落在她头发上，她浑然不觉。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "你站在远处，不知道该说什么。\n\n有些话一旦说出口，就再也回不去了。",
        side: "center",
      },
    ],
    onComplete: {
      flags: ["xiangyu_confessed", "met_xiangyu", "met_taozi"],
      meetNpcIds: ["xiangyu", "taozi"],
      effects: [
        { stat: "charisma", delta: 5 },
        { stat: "connections", delta: 8 },
        { stat: "stress", delta: 10 },
      ],
      setPhase: "game",
    },
  };
}

/** Week 13: 竞选前夜 — 权力的岔路口 */
export function getElectionEveScene(): FPDialogueScene {
  return {
    id: "election_eve",
    title: "第13周 · 竞选前夜",
    lines: [
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "第13周，周日深夜。明天就是学生会主席竞选报名截止日。你坐在活动室里，面前摊着那张空白的报名表。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "这学期你做了很多事，攒了不少成绩。但竞选主席——那意味着更多责任、更多目光、更多暗流。\n\n你拿起笔又放下。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "门被推开了。是同部门最资深的干事，也是和你一起熬过无数夜的老搭档。",
        side: "center",
      },
      {
        speakerId: "partner",
        speakerName: "搭档",
        speakerEmoji: "🤔",
        text: "我就知道你还在这儿。怎么，报名表还没填？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他/她拉了把椅子坐到对面，看着你面前空白的表格，叹了口气。",
        side: "center",
      },
      {
        speakerId: "partner",
        speakerName: "搭档",
        speakerEmoji: "😟",
        text: "我跟你说实话——外面已经有人在传了。说你要是不参选，隔壁部的某某就要上台。那人什么德性你清楚。",
        side: "left",
      },
      {
        speakerId: "partner",
        speakerName: "搭档",
        speakerEmoji: "😤",
        text: "你要是上，兄弟们拼了命也帮你拉票。你要是不上……咱也不怪你。这事确实不是谁都扛得住的。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "搭档说完就安静了。活动室里只有老空调嗡嗡作响。窗外是沉沉的夜色。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "你想起这学期经历的一切——食堂里的热闹、空教室里的暗影、樱花树下的眼泪。\n\n权力可以成就很多事，也可以毁掉很多人。关键是谁在用。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "搭档站起身，走到门口，回头看了你一眼。",
        side: "center",
      },
      {
        speakerId: "partner",
        speakerName: "搭档",
        speakerEmoji: "🤝",
        text: "不管你做什么决定——反正我认你。明天见。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "门轻轻关上了。活动室里又只剩下你和那张报名表。\n\n窗外有风吹进来，表格的一角被掀起，又落下。\n\n你最终拿起了笔。",
        side: "center",
      },
    ],
    choices: [
      {
        text: "填上名字，参选主席",
        effects: [
          { stat: "charisma", delta: 8 },
          { stat: "organization", delta: 5 },
          { stat: "stress", delta: 5 },
        ],
        feedback: "你端端正正地写下了自己的名字。不管结果如何，这是你给自己的答卷。",
        setFlags: ["election_committed"],
      },
      {
        text: "放下笔——时机未到",
        effects: [
          { stat: "stress", delta: -10 },
          { stat: "connections", delta: 5 },
          { stat: "organization", delta: 3 },
        ],
        feedback: "你把表格收进了抽屉。不是放弃——是知道自己还需要更多准备。退一步，有时候是为了跳得更远。",
        setFlags: ["election_deferred"],
      },
    ],
    onComplete: {
      flags: ["election_eve_seen"],
      effects: [
        { stat: "connections", delta: 8 },
        { stat: "organization", delta: 6 },
        { stat: "stress", delta: 3 },
      ],
      setPhase: "game",
    },
  };
}

/** Week 8: 樱花树下的邂逅 — 认识苏念 */
export function getSunianEncounterScene(): FPDialogueScene {
  return {
    id: "sunian_encounter",
    title: "第8周 · 樱花树下的邂逅",
    lines: [
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "第八周的周三傍晚，你从图书馆出来，决定走一条不常走的小路回宿舍。\n\n夕阳把整条樱花道染成了金色。四月的风轻轻吹过，花瓣像雪一样飘落。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "就在这时，你看见樱花树下站着一个女生。\n\n她举着相机，正对着满树樱花专注地取景。栗色的短发被风吹得微微扬起，夕阳在她身上镀了一层柔光。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "你不由得放慢了脚步。她似乎察觉到了什么，相机缓缓放下，朝你的方向看了过来。",
        side: "center",
      },
      {
        speakerId: "sunian",
        speakerName: "苏念",
        speakerEmoji: "📷",
        avatar: "characters/sunian.png",
        text: "啊……你好。抱歉，我刚才是不是挡到路了？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "她的声音很轻，像这四月的风。眼神温柔之中带着一丝慌乱——显然不太习惯被陌生人看着。",
        side: "center",
      },
      {
        speakerId: "sunian",
        speakerName: "苏念",
        speakerEmoji: "📷",
        avatar: "characters/sunian.png",
        text: "我在拍樱花……这个角度的光线特别好。你要不要看看？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "她把相机屏幕转向你。构图很美——逆光的樱花像被点燃了一样，每一片花瓣都透着光。\n\n你看着照片，她也看着你，嘴角微微上扬，像是在等一个评价。",
        side: "center",
      },
      {
        speakerId: "sunian",
        speakerName: "苏念",
        speakerEmoji: "📷",
        avatar: "characters/sunian.png",
        text: "我是苏念，心理部的。平时喜欢拍拍照……虽然拍得不算好。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "她的微笑很真诚，像是一个人不经意间流露出的温柔。风吹过樱花树，又落了一阵花瓣雨。\n\n这一刻安静得刚刚好。",
        side: "center",
      },
    ],
    choices: [
      {
        text: "「拍得真好，你是摄影社的吗？」",
        effects: [
          { stat: "charisma", delta: 2 },
          { stat: "connections", delta: 1 },
        ],
        feedback: "她眼睛亮了起来，开心地摇头说只是爱好。你们从相机型号聊到拍摄地点，不知不觉聊了很久。",
        setFlags: ["sunian_photo"],
      },
      {
        text: "「嗯，这个光影确实很特别。」",
        effects: [
          { stat: "academics", delta: 2 },
          { stat: "connections", delta: 1 },
        ],
        feedback: "她微微一愣，然后笑了——「你懂摄影？」你们从构图聊到了光影美学，她越说越投入。",
        setFlags: ["sunian_art"],
      },
      {
        text: "「这棵树在这儿好多年了吧……你也经常来？」",
        effects: [
          { stat: "connections", delta: 2 },
          { stat: "charisma", delta: 1 },
        ],
        feedback: "她轻轻点头，说这是她最喜欢的角落。每次心情不好的时候就会来这儿坐一会儿，看看花开。",
        setFlags: ["sunian_tree"],
      },
    ],
    onComplete: {
      flags: ["sunian_encounter_done"],
      meetNpcIds: ["sunian"],
      affinityGain: { npcId: "sunian", delta: 25 },
      effects: [
        { stat: "charisma", delta: 3 },
        { stat: "connections", delta: 4 },
        { stat: "stress", delta: 5 },
      ],
      setPhase: "game",
    },
  };
}

// ===== 告白CG场景 =====

const CONFESS_EMOJI: Record<string, string> = {
  sunny: "☀️", tsundere: "😤", gentle: "🌸", shy: "😳", mischievous: "😏",
};

interface ConfessNPCBrief {
  id: string;
  name: string;
  gender: "male" | "female";
  personality?: string;
}

const CONFESS_TA = (g: "male" | "female") => g === "male" ? "他" : "她";

function confessSharedIntro(npc: ConfessNPCBrief): FPDialogueLine[] {
  const ta = CONFESS_TA(npc.gender);
  const emoji = CONFESS_EMOJI[npc.personality ?? ""] ?? "💕";
  return [
    {
      speakerId: "narrator", speakerName: "", speakerEmoji: "",
      text: `你深吸一口气，把练习了好几天的话在心里又过了一遍。\n\n${npc.name}就站在你面前，歪着头看你，似乎察觉到了什么不一样的气氛。`,
      side: "center",
    },
    {
      speakerId: "player", speakerName: "你", speakerEmoji: "",
      text: `${npc.name}，我……我有话想跟你说。`,
      side: "right",
    },
    {
      speakerId: npc.id, speakerName: npc.name, speakerEmoji: emoji,
      text: "嗯？怎么突然这么认真……你说吧，我在听。",
      side: "left",
    },
    {
      speakerId: "narrator", speakerName: "", speakerEmoji: "",
      text: `你的心跳声大得几乎盖过了周围的一切。风从走廊尽头吹过来，带着楼下食堂晚饭的味道。但此刻你什么都感觉不到——眼里只有${ta}。`,
      side: "center",
    },
    {
      speakerId: "player", speakerName: "你", speakerEmoji: "",
      text: "我喜欢你。不是普通的那种喜欢。是想每天都能见到你、想和你一起走过大学剩下的每一个季节的那种喜欢。",
      side: "right",
    },
    {
      speakerId: "narrator", speakerName: "", speakerEmoji: "",
      text: `${npc.name}愣住了。${ta}的眼睛微微睁大，嘴唇动了动，却没有立刻发出声音。\n\n那短暂的沉默像被拉长了无数倍。`,
      side: "center",
    },
  ];
}

export function getConfessSuccessScene(npc: ConfessNPCBrief): FPDialogueScene {
  const ta = CONFESS_TA(npc.gender);
  return {
    id: `confess_success_${npc.id}`,
    title: `告白 · ${npc.name}`,
    lines: [
      ...confessSharedIntro(npc),
      {
        speakerId: npc.id, speakerName: npc.name,
        speakerEmoji: CONFESS_EMOJI[npc.personality ?? ""] ?? "💕",
        text: npc.gender === "male"
          ? "……我也喜欢你。从很早之前就开始了。只是一直没敢说。"
          : "……嗯。其实我也……喜欢你很久了。一直在等你说这句话。",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `${ta}说完这句话，脸一下子红到了耳根。${ta}低下头，但嘴角的弧度怎么都藏不住。\n\n你轻轻握住了${ta}的手。这一次，${ta}没有躲开。\n\n——从今天起，有些东西不一样了。`,
        side: "center",
      },
    ],
    onComplete: {
      setPhase: "game",
    },
  };
}

export function getConfessFailScene(npc: ConfessNPCBrief): FPDialogueScene {
  const ta = CONFESS_TA(npc.gender);
  return {
    id: `confess_fail_${npc.id}`,
    title: `告白 · ${npc.name}`,
    lines: [
      ...confessSharedIntro(npc),
      {
        speakerId: npc.id, speakerName: npc.name,
        speakerEmoji: CONFESS_EMOJI[npc.personality ?? ""] ?? "💕",
        text: npc.gender === "male"
          ? "……对不起。你是个很好的人，但我……还没有准备好。我们还是朋友，好吗？"
          : "……对不起。我很珍惜你，但不是那种感情。我不想骗你。",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `${ta}的声音很轻，却像一块石头沉进了湖底。\n\n你努力挤出一个笑容，说了声"没关系"。但其实你知道——有些话说出口，就再也回不去了。\n\n也许不是你的问题。也许只是时机不对。`,
        side: "center",
      },
    ],
    onComplete: {
      setPhase: "game",
    },
  };
}

// ===== 压力系统场景 =====

/** 压力 ≥ 80：崩溃场景 */
export function getStressCrashScene(): FPDialogueScene {
  return {
    id: "stress_crash",
    title: "压力崩溃",
    lines: [
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "你已经连续好几天没什么像样的睡眠了。脑子里嗡嗡作响，眼前的东西时不时出现重影。\n\n这天下午，你正在办公室整理文件，突然一阵强烈的眩晕袭来。",
        side: "center",
      },
      {
        speakerId: "player", speakerName: "你", speakerEmoji: "",
        text: "（……不行，得坐一下——）",
        side: "right",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "你伸手去扶桌子，却抓了个空。身体像被抽走了所有的力气，直直地倒了下去。\n\n文件散落一地，椅子被撞开，发出了巨大的声响。",
        side: "center",
      },
      {
        speakerId: "yantou", speakerName: "烟头叔", speakerEmoji: "🚬",
        text: "哎哟！小伙子！来人——快来人！……喂，你醒醒，别吓我啊！",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "后来你才知道，是烟头叔和隔壁办公室的干事一起把你搬到了医务室。\n\n你在病床上醒来的时候，医生说了一句话——",
        side: "center",
      },
      {
        speakerId: "doctor", speakerName: "校医", speakerEmoji: "👨‍⚕️",
        text: "没啥大问题，就是过度疲劳加精神紧张。好好歇两天，别折腾自己了。年轻也不是这么个熬法。",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "你躺在病床上，盯着天花板，第一次认真问自己——\n\n这么拼，到底是为了什么？",
        side: "center",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "在床上躺了一天一夜之后，你感觉身体终于缓过来了一些。\n\n但回去后你会发现——错过了重要的例会，几个本该你负责的任务被分给了别人。一切都需要重新收拾。",
        side: "center",
      },
    ],
    onComplete: {
      effects: [
        { stat: "stress", delta: 25 },
        { stat: "organization", delta: -5 },
        { stat: "connections", delta: -3 },
        { stat: "academics", delta: -3 },
      ],
      setPhase: "game",
    },
  };
}

/** 压力 ≥60 随机事件：失眠 */
export function getStressInsomniaScene(): FPDialogueScene {
  return {
    id: "stress_insomnia",
    title: "失眠",
    lines: [
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "凌晨三点，你已经翻来覆去了快两个小时。\n\n脑子里全是白天没做完的事——下周的策划案、部长交代的物资清单、还有那篇下周一就要交的选修课论文……",
        side: "center",
      },
      {
        speakerId: "player", speakerName: "你", speakerEmoji: "",
        text: "（数羊也不管用……明天还有早课。烦死了。）",
        side: "right",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "你索性拿起手机漫无目的地刷了起来，屏幕蓝光照得眼睛发酸。\n\n等终于迷迷糊糊地睡过去时，窗外已经泛起灰白色的光。闹钟在两个小时后就会响。",
        side: "center",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "第二天的课程可想而知——你眼皮打架，什么都听不进去。晚上翻开作业一个字也写不出来。\n\n又困又烦躁，恶性循环。",
        side: "center",
      },
    ],
    onComplete: {
      effects: [
        { stat: "academics", delta: -5 },
        { stat: "stress", delta: -3 },
      ],
      setPhase: "game",
    },
  };
}

/** 压力 ≥60 随机事件：口角 */
export function getStressQuarrelScene(): FPDialogueScene {
  return {
    id: "stress_quarrel",
    title: "口角",
    lines: [
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "也许是因为最近压力太大，你变得比平时更容易烦躁。\n\n今天在群里讨论活动分工的时候，一个同僚轻飘飘地说了一句——",
        side: "center",
      },
      {
        speakerId: "colleague", speakerName: "同僚", speakerEmoji: "😅",
        text: "这个你多担一下呗？你不是一直做这个嘛，应该很快吧~",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "那句话像一根针扎进了已经快到极限的气球。你几乎是下意识地——",
        side: "center",
      },
      {
        speakerId: "player", speakerName: "你", speakerEmoji: "",
        text: "每次都这样？我手上已经四个活了，什么叫「多担一下」——你们倒是也担一下啊！",
        side: "right",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "群里一下子安静了。\n\n过了很久才有人出来打圆场。事后你冷静下来，知道自己话说重了——但道歉的话到了嘴边，又咽了回去。\n\n之后的几天，大家对你明显疏远了些。",
        side: "center",
      },
    ],
    onComplete: {
      effects: [
        { stat: "connections", delta: -6 },
        { stat: "stress", delta: -5 },
      ],
      setPhase: "game",
    },
  };
}

/** 压力 ≥60 随机事件：遗忘 */
export function getStressForgetScene(): FPDialogueScene {
  return {
    id: "stress_forget",
    title: "遗忘",
    lines: [
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "事情太多了——你要上课、要开会、要写材料、要回消息。\n\n有一件事不知不觉从你的待办列表上滑了出去。直到——",
        side: "center",
      },
      {
        speakerId: "chair", speakerName: "部长", speakerEmoji: "😠",
        text: "上周让你去交的那个场地申请表，交了吗？学院那边来催了。",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "你脑袋嗡地一下——完全忘了。\n\n那张申请表现在还躺在你书包最底下的那个文件夹里，皱巴巴的。",
        side: "center",
      },
      {
        speakerId: "player", speakerName: "你", speakerEmoji: "",
        text: "（完了……）",
        side: "right",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: "部长叹了口气，没再多说什么，但你看到他转身的时候摇了摇头。\n\n最后场地被另一个社团拿走了。你负责的活动不得不推迟，之前的准备工作全都白费。\n\n以后在部里你得多花些功夫才能挽回信任了。",
        side: "center",
      },
    ],
    onComplete: {
      effects: [
        { stat: "organization", delta: -5 },
        { stat: "stress", delta: -3 },
      ],
      setPhase: "game",
    },
  };
}

/** 压力 ≥88 且恋爱中：分手场景 */
export function getStressBreakupScene(npc: ConfessNPCBrief): FPDialogueScene {
  const ta = CONFESS_TA(npc.gender);
  const emoji = CONFESS_EMOJI[npc.personality ?? ""] ?? "💕";
  return {
    id: "stress_breakup",
    title: "裂痕",
    lines: [
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `你已经三周没有好好陪过${npc.name}了。\n\n每次${ta}约你，你的回答都是"这周太忙了""等这个活动搞完""周末一定"——但周末从来不会真的轻松。`,
        side: "center",
      },
      {
        speakerId: npc.id, speakerName: npc.name, speakerEmoji: emoji,
        text: "你最近每次回消息都是'嗯''好''知道了'……你是不是已经不想见到我了？",
        side: "left",
      },
      {
        speakerId: "player", speakerName: "你", speakerEmoji: "",
        text: "不是……我是真的忙。你也要体谅我一下吧！",
        side: "right",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `话一出口你就后悔了——声音比预想的大了太多。\n\n${npc.name}被你吼得愣住了，眼眶一下子红了。`,
        side: "center",
      },
      {
        speakerId: npc.id, speakerName: npc.name, speakerEmoji: emoji,
        text: npc.gender === "male"
          ? "……我体谅你，谁来体谅我？你忙是你选的，我呢？我只是想跟你说几句话而已。"
          : "……我体谅你？每次都是我在等，每次都是我一个人吃饭。你的世界里好像从来就没有我的位置。",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `你想解释，却发现张不开口——因为${ta}说的每一个字都是真的。`,
        side: "center",
      },
      {
        speakerId: npc.id, speakerName: npc.name, speakerEmoji: emoji,
        text: "要不……我们先冷静一下吧。",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `${ta}转过身去，没有再看你。你想追上去，脚却像钉在了原地。\n\n桌上的手机亮了——是部长的新消息。但此刻你突然觉得，那些永远也做不完的任务，好像没那么重要了。\n\n可惜已经晚了。`,
        side: "center",
      },
    ],
    onComplete: {
      setPhase: "game",
    },
  };
}

/** 俱乐部门票触发分手 */
export function getClubBreakupScene(npc: ConfessNPCBrief): FPDialogueScene {
  const ta = CONFESS_TA(npc.gender);
  const emoji = CONFESS_EMOJI[npc.personality ?? ""] ?? "💕";
  return {
    id: "club_breakup",
    title: "败露",
    lines: [
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `会所的体验确实不错——按摩、香薰、无边泳池。你觉得压在肩上的东西终于轻了一点。\n\n直到三天后，${npc.name}在刷你手机相册的时候翻到了一张灯光暧昧的会所走廊照。`,
        side: "center",
      },
      {
        speakerId: npc.id, speakerName: npc.name, speakerEmoji: emoji,
        text: "……你上周不是说加班到很晚吗？这是哪儿？",
        side: "left",
      },
      {
        speakerId: "player", speakerName: "你", speakerEmoji: "",
        text: "不是你想的那样！就是太累了想去放松一下——真的就是按摩和泡澡。",
        side: "right",
      },
      {
        speakerId: npc.id, speakerName: npc.name, speakerEmoji: emoji,
        text: npc.gender === "male"
          ? "放松？你去这种地方都不跟我说一声？一个人偷偷摸摸去，回来也没提过一个字……你让我怎么信你？"
          : "你觉得我会信？你要是问心无愧干嘛不告诉我？为什么要删和我的聊天记录？",
        side: "left",
      },
      {
        speakerId: "player", speakerName: "你", speakerEmoji: "",
        text: "我只是不想让你多想……",
        side: "right",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `${ta}没有再说话，只是把手机放回了桌上——动作很轻，但比任何摔东西都让人心寒。`,
        side: "center",
      },
      {
        speakerId: npc.id, speakerName: npc.name, speakerEmoji: emoji,
        text: "你知道吗……最让我难过的不是你去哪了。是你根本没把我当成可以商量的人。两个人在一起，连这点信任都没有——那还是算了吧。",
        side: "left",
      },
      {
        speakerId: "narrator", speakerName: "", speakerEmoji: "",
        text: `${ta}站起来，头也不回地走了。\n\n你看着桌上那半杯已经凉透的咖啡，和安静得像死了一样的对话框。\n\n有些裂缝，一旦裂开，就再也补不回来了。`,
        side: "center",
      },
    ],
    onComplete: {
      setPhase: "game",
    },
  };
}

/** Week 30: 哈马办公室劝进 — 威逼利诱，不了了之 */
export function getHamaPushPresidentScene(): FPDialogueScene {
  return {
    id: "hama_push_president",
    title: "第30周 · 指导老师的\"建议\"",
    lines: [
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "周三下午，你收到一条短信——哈马让你放学后去他办公室一趟。「有事跟你谈谈。」\n\n短信只有这六个字。但哈马找你\"谈谈\"，从来不是什么好事。",
        side: "center",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "放学后你推开指导老师办公室的门。哈马正坐在那张老旧的办公桌后面，面前摊着几份文件。他没有抬头看你，只是用笔敲了敲对面的椅子。",
        side: "center",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "坐。别站着——你又不是来挨训的。至少现在还不是。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "你坐下，等他开口。哈马终于抬起眼皮看了你一眼，然后从文件堆里抽出一张纸——是学生会主席换届选举的通知。",
        side: "center",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "换届选举，知道吧？这学期末。现在主席团那几个人——你自己看看，一个能打的都没有。要么做事没脑子，要么有脑子不做事。",
        side: "left",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "我在这学校管了八年学生会了。你以为我看不出来谁行谁不行？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他把通知翻过来，背面是用红笔圈出来的几个名字。你看到了自己的名字——排在最上面，画了两个圈。",
        side: "center",
      },
      {
        speakerId: "player",
        speakerName: "你",
        speakerEmoji: "",
        text: "……哈老师，您找我到底什么事？",
        side: "right",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "别跟我装傻。你在这个位置上待了多久了？部长干得不错——组织力、人脉、活动，该有的你都有了。但你不会打算一辈子当部长吧？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他摘下眼镜擦了擦，动作不紧不慢，但眼睛始终盯着你。",
        side: "center",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "我跟你说实话——学校那边已经在考虑主席人选了。有领导提了别人。你知道别人是谁吗？你自己想想，这学期跟你明里暗里不对付的那几个人里，有没有名字出现在讨论桌上？",
        side: "left",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "要是他们上去了——你的预算、你的活动、你手下那帮干事，你觉得还能保住多少？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他说这话的时候语气很平淡，像是在播报天气。但每一个字都精准地落在你最担心的点上。",
        side: "center",
      },
      {
        speakerId: "player",
        speakerName: "你",
        speakerEmoji: "",
        text: "……您在威胁我？",
        side: "right",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "威胁？我这叫陈述事实。你爱听不听。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "哈马哼了一声，从抽屉里又拿出一份文件，推到桌子中间。你看了一眼——是一份学生会主席参选推荐表，指导老师签字栏已经盖好了章。",
        side: "center",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "不过呢，我也不是只来给你压力的。你看这个——参选推荐表。指导老师签字，我已经提前给你签了。别人想拿都拿不到。",
        side: "left",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "你要是参选，经费审批我给你开绿灯。第一个学期的活动预算，我至少批你比别人多三成。办公室——现在主席团那间小的，我帮你换到东楼那间大的。",
        side: "left",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "你要人手？我可以帮你协调——跨部门调动，只要你说个名字。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他往后一靠，双手交叉放在肚子上，表情里多了一丝不易察觉的满意。",
        side: "center",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "怎么样？我这人虽然抠门，但看准了的人，从来不亏待。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "办公室里安静了几秒。墙上挂钟的秒针一格一格跳动着。你看着桌上那张盖好章的推荐表——只差你的名字了。\n\n哈马说得没错。这确实是一个机会。但你也清楚，他从来不做亏本的交易。",
        side: "center",
      },
      {
        speakerId: "player",
        speakerName: "你",
        speakerEmoji: "",
        text: "哈老师……您为什么这么想让我参选？",
        side: "right",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "为什么？因为把这届学生会交给外面那些废物，我的年终考核也跟着完蛋！你以为我管学生会是为了什么——好玩吗？",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他说完倒笑了——那种笑不是开心，更像是一种自嘲。",
        side: "center",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "不过话又说回来……我带过的学生里，你算是有脑子的。不光是会做事——关键是会想事。这种人不多。",
        side: "left",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "当然，你要是觉得当部长挺好，那你就继续当。反正——选不选是你自己的事。我只是觉得，有些人站在该站的位置上，对大家都好。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他说完这话，罕见地没有再逼你。起身走到窗边，背对着你，点了支烟。\n\n窗外是傍晚的校园，操场上有人在跑步，远远地传来笑声。",
        side: "center",
      },
      {
        speakerId: "player",
        speakerName: "你",
        speakerEmoji: "",
        text: "…………",
        side: "right",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "你沉默了很久。哈马也不说话，就那样看着窗外抽烟。\n\n推荐表还摊在桌上。章已经盖好了。但填不填名字——是你的事。",
        side: "center",
      },
      {
        speakerId: "hama",
        speakerName: "哈马",
        speakerEmoji: "👨‍🏫",
        avatar: "characters/hama.png",
        text: "行了，不用现在就回答我。回去想想。但记住——报名截止日不等人。",
        side: "left",
      },
      {
        speakerId: "narrator",
        speakerName: "",
        speakerEmoji: "",
        text: "他弹掉烟灰，头也没回地朝门口的方向摆了摆手——意思是你可以走了。\n\n你站起来，最后看了一眼桌上的推荐表，然后转身离开。\n\n走出办公室的时候，走廊里的风很凉。你心里乱糟糟的——不是因为哈马说了什么，而是因为他说的每一句，你都知道是真的。",
        side: "center",
      },
    ],
    onComplete: {
      flags: ["hama_push_president_seen"],
      effects: [
        { stat: "stress", delta: 8 },
        { stat: "connections", delta: 5 },
      ],
      setPhase: "game",
    },
  };
}
