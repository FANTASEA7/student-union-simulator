import { useState, useEffect, useRef } from "react";
import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { LoveNPC, NPCPersonality, InventoryItem } from "../../../types/game";
import styles from "./ContactsPanel.module.css";

const PERSONALITY_LABELS: Record<NPCPersonality, string> = {
  sunny: "☀️ 阳光", tsundere: "😤 傲娇", gentle: "🌸 温柔", shy: "😳 害羞", mischievous: "😏 调皮",
};

const AFFINITY_TIER: { min: number; label: string; color: string }[] = [
  { min: 0, label: "陌生人", color: "#999" },
  { min: 10, label: "认识", color: "#5b9bd5" },
  { min: 30, label: "朋友", color: "#27ae60" },
  { min: 60, label: "好友", color: "#f39c12" },
  { min: 85, label: "挚友", color: "#e74c3c" },
  { min: 95, label: "心动", color: "#e91e63" },
];

function getAffinityTier(affinity: number) {
  return [...AFFINITY_TIER].reverse().find((t) => affinity >= t.min) ?? AFFINITY_TIER[0];
}

// Dialogue topics based on affinity tier — 5 topics per tier, 4 replies per personality
const DIALOGUE_TOPICS: Record<string, { label: string; replies: Record<NPCPersonality, string[]> }[]> = {
  stranger: [
    {
      label: "打招呼",
      replies: {
        sunny: ["嗨！你是新来的吧？我是买单哥！", "哟！又见面了！", "哈哈，我就喜欢交新朋友！", "来学生会多久了？我罩着你！"],
        tsundere: ["哼，你是谁啊？", "...有事吗？", "又来了个新人？", "我不认识你"],
        gentle: ["你好呀，很高兴认识你~", "初次见面，请多关照", "欢迎来到学生会！", "有什么需要帮忙的吗？"],
        shy: ["啊...你好...", "那个...我叫...", "你、你好...", "我是新来的..."],
        mischievous: ["嘿嘿，新面孔！", "你也是学生会的？", "我认识好多人，就是不认识你~", "要不要听个学生会的小秘密？"],
      },
    },
    {
      label: "聊学生会",
      replies: {
        sunny: ["学生会超有意思的！", "我在体育部，有空来玩！", "我们部门活动最多啦！", "学生会让我的大学生活充实多了"],
        tsundere: ["学生会...还行吧", "反正就是干活呗", "别以为学生会很好混", "我可是被拉进来的"],
        gentle: ["学生会大家都很好相处的", "有什么不懂的可以问我", "每个部门都有自己的特色呢", "你会喜欢这里的"],
        shy: ["我...我就负责打杂", "大家都很厉害呢", "我还在学习怎么做事", "希望能帮上忙"],
        mischievous: ["学生会秘密可多了，你想听哪个？", "嘿嘿，我认识好多人", "有些部门的八卦特别精彩", "想知道主席的秘密吗？"],
      },
    },
    {
      label: "聊学校",
      replies: {
        sunny: ["我们学校食堂还不错！", "你最喜欢哪门课？", "南苑后面有个很棒的奶茶店", "操场晚上特别热闹"],
        tsundere: ["学校就那样吧...", "课业还挺重的", "图书馆占座太难了", "习惯就好"],
        gentle: ["校园很漂亮呢，特别是春天", "图书馆是个好地方", "学校的樱花道特别美", "体育馆设施也很全"],
        shy: ["学校...挺大的", "有时候会迷路...", "食堂人好多...", "教室不太好找"],
        mischievous: ["我知道学校好几个秘密基地！", "南苑超市的关东煮超好吃", "有个天台可以偷偷上去", "学校的樱花树有秘密"],
      },
    },
    {
      label: "聊聊天气",
      replies: {
        sunny: ["今天天气真好！适合出去浪~", "下雨天最适合在寝室打游戏了", "春天来了心情就是好！", "最喜欢秋天的阳光"],
        tsundere: ["热死了...烦", "下雨天真麻烦", "天气跟我有什么关系", "哼，不过今天确实挺舒服"],
        gentle: ["今天天气很适合散步呢", "阳光暖暖的很舒服~", "下雨天在家看书也很有意境", "每个季节都有它的美好"],
        shy: ["今、今天有点热...", "下雨了...没带伞", "天气...挺好的", "风有点大..."],
        mischievous: ["这种天气最适合搞事情了！", "下雨天？那去踩水坑啊~", "天气好就是出去玩的日子！", "台风天才有意思呢"],
      },
    },
    {
      label: "问个问题",
      replies: {
        sunny: ["随便问！我啥都知道！", "哈哈你这个问题问对人了", "有问必答，我就是活字典", "说吧说吧，别客气"],
        tsundere: ["...什么事？快点说", "问吧，但我可不保证回答", "你问题真多", "简短的可以"],
        gentle: ["请说吧，我会认真回答的~", "什么问题都可以问哦", "很高兴能帮到你", "不用客气，说吧"],
        shy: ["啊...什么问题...", "我...我尽量回答", "不要太难的问题...", "你想问什么？"],
        mischievous: ["哦？想知道什么？", "问得好！我最喜欢回答问题", "随便问，但答案可能有惊喜~", "你想问正经的还是不正经的？"],
      },
    },
  ],
  acquaintance: [
    {
      label: "聊聊近况",
      replies: {
        sunny: ["最近还不错！又蹭了几顿饭", "哈哈，天天开心就是最好的", "刚打完球，一身汗！", "最近在策划一个新活动"],
        tsundere: ["还行吧...你倒是挺关心我的嘛", "最近？没什么特别的", "忙死了，别问", "还算可以吧"],
        gentle: ["最近在忙部门的事，不过还好", "你看起来状态不错呢", "一切都挺顺利的，谢谢关心", "最近天气好了心情也好"],
        shy: ["还、还好...", "最近...社团活动挺多的", "有点忙...但是还行", "谢谢关心..."],
        mischievous: ["嘿嘿，你猜我最近干了什么？", "发现了一个好玩的地方！", "最近在筹备一个大计划~", "你绝对想不到我上周做了什么"],
      },
    },
    {
      label: "聊聊爱好",
      replies: {
        sunny: ["当然是找人请客吃饭啊！", "打球也不错，不过我更喜欢看别人打", "我的爱好就是交朋友！", "最近迷上了桌游"],
        tsundere: ["我的爱好？...不告诉你", "哼，其实我喜欢看小说", "听歌吧...偶尔", "画画，但画得不好"],
        gentle: ["我喜欢听音乐，特别是安静的曲子", "养花是我最大的爱好", "看书和泡茶，很老派吧？", "喜欢在校园里散步拍照"],
        shy: ["我喜欢...看书", "偶尔画点画...", "喜欢一个人听歌", "做手工..."],
        mischievous: ["我的爱好是发掘别人的秘密！", "恶作剧算爱好吗？😏", "收集各种有意思的小玩意", "我爱好可多了，每天换一个"],
      },
    },
    {
      label: "八卦一下",
      replies: {
        sunny: ["你听说了吗？新媒体部那个事...", "学生会八卦可多了！", "我知道的可不止一点半点", "这种事我最清楚了！"],
        tsundere: ["我才不八卦呢...不过你想知道什么？", "有些事还是不知道比较好", "我确实听说过一些...", "你倒是挺八卦的"],
        gentle: ["不太喜欢说别人的事呢...", "不过有些传闻确实挺有意思的", "还是多关心自己的事比较好", "每个人都有自己的难处"],
        shy: ["我...我不太知道这些", "他们说的我也不太懂", "八卦不太好吧...", "但是有听说过一些..."],
        mischievous: ["哈哈，你可算问对人了！", "想知道谁的？我都有料！", "我这儿的八卦比校报还全", "你请我喝奶茶我就告诉你"],
      },
    },
    {
      label: "推荐美食",
      replies: {
        sunny: ["南苑食堂二楼的麻辣香锅绝了！", "门口那家烤鱼店你去了吗？", "学校后街的煎饼果子我的最爱", "今天我请你！想吃什么？"],
        tsundere: ["食堂...就那样吧", "门口有家面馆还不错", "我对吃的不太挑剔", "那个新开的店？还行"],
        gentle: ["食堂一楼的粥很好喝呢", "南苑超市旁边有家面包店", "后街有家很有格调的咖啡馆", "自己做的饭菜最香啦"],
        shy: ["我...我一般都吃食堂", "有一家店还不错...但忘了名字", "泡面...也挺好的", "不太敢去人多的地方吃饭"],
        mischievous: ["我知道一家隐藏的深夜烧烤摊！", "食堂阿姨的秘密菜单你知道吗？", "有家店的老板特别有意思", "后街第三家，去了报我名字~"],
      },
    },
    {
      label: "聊聊课程",
      replies: {
        sunny: ["高数太难了！但我有学霸笔记！", "选课就是一场战争啊", "我选的课都挺好过的", "体育课最好玩了"],
        tsundere: ["专业课还好，选修课麻烦", "有些老师讲得真不行", "你选了什么课？", "作业太多了"],
        gentle: ["我很喜欢我们专业课的老师", "选修了一门心理学，很有意思", "课业虽然重但很有收获", "图书馆学习效率最高"],
        shy: ["课、课程还好...", "有些课听不懂...", "我不敢在课上发言", "作业好多..."],
        mischievous: ["我知道哪些课最好混学分！", "有些老师的课一定要去蹭", "逃课的秘诀想不想听？", "选课系统有漏洞，嘿嘿"],
      },
    },
  ],
  friend: [
    {
      label: "吐槽学生会",
      replies: {
        sunny: ["唉，经费又砍了，真是的", "张艺那个人...你懂的", "每次开会都有人迟到，烦死了", "不过总体还是挺好玩的"],
        tsundere: ["终于有人跟我一样了！那个检查真是烦死了", "每次例会都开那么久，浪费时间", "有些部长真的是...", "别提了，一堆破事"],
        gentle: ["大家都不容易呢...互相理解吧", "有时候确实会觉得累就是了", "但一起努力的感觉也很好", "吐槽归吐槽，还是要好好干"],
        shy: ["我...我不敢说什么", "其实也有点想吐槽...", "有好多事情...但不敢说", "你在听吗？"],
        mischievous: ["哈哈哈！我有一堆料，来，我慢慢跟你说", "最烦的就是查寝了，每次都突击", "有个部长特别爱开会，说半小时能说完的事能说两小时", "你知道办公室的咖啡机是谁弄坏的吗？"],
      },
    },
    {
      label: "分享心情",
      replies: {
        sunny: ["跟你聊天就是开心！", "今天心情不错，请你喝奶茶！", "有你这个朋友真好", "心情好，世界都亮了"],
        tsundere: ["...其实最近有点烦", "能有人听我说这些，挺好的", "也不是什么大事...算了", "谢谢你听我发牢骚"],
        gentle: ["和你聊天很放松呢", "谢谢你能听我说这些", "心情不好的时候想到你，就会好很多", "你总是很温暖"],
        shy: ["我...其实挺开心的", "因为可以和你聊天...", "最近心情好了很多", "谢谢你..."],
        mischievous: ["心情？当然是超——好！", "因为又有好玩的事要发生了~", "跟你聊天总是很愉快", "我心情不好的时候就去搞事情"],
      },
    },
    {
      label: "聊未来",
      replies: {
        sunny: ["走一步看一步呗，开心最重要！", "说不定以后开个饭店，天天请客", "未来太远了，先把这周过了", "想当个体育老师，天天玩"],
        tsundere: ["未来？考研吧...你呢？", "其实也有点迷茫", "走一步看一步吧", "希望能找到好工作"],
        gentle: ["希望能一直做自己喜欢的事", "未来的事，慢慢来就好", "想考个研究生，继续读书", "只要和重要的人在一起就好"],
        shy: ["我...想变得自信一点", "希望能交到更多朋友", "未来...还不敢想", "想找一份安稳的工作"],
        mischievous: ["我的未来？当然是当校长！开玩笑的", "其实想创业，做点有意思的事", "反正不会按部就班地过", "我要把大学生活过得超级精彩"],
      },
    },
    {
      label: "社团秘密",
      replies: {
        sunny: ["你知道社管部有个隐藏的储物间吗？", "体育部的器材库里有好多好东西", "其实学生会经费没他们说的那么少", "有些部门的活动根本没人去"],
        tsundere: ["有些事知道太多对你不好", "反正学生会水深得很", "各种圈子，各种人", "你还是少打听这些"],
        gentle: ["每个社团都有自己的小秘密", "其实大家都是好人，只是表达方式不同", "有些温暖的秘密倒是可以分享", "最好不要到处传这些事"],
        shy: ["我...我知道一个...但不敢说", "有些事还是不知道比较好", "有人让我保密...", "但我可以给你一点提示..."],
        mischievous: ["哈哈终于有人问我这个了！", "你想先听哪个部门的秘密？", "我知道的事够写一本书了", "学生会的地下势力图你要不要看？"],
      },
    },
    {
      label: "求助帮忙",
      replies: {
        sunny: ["说！什么事？能力范围内绝对帮！", "没问题，包在我身上！", "朋友的事就是我的事", "来来来，不用客气"],
        tsundere: ["...说吧，但我不保证能帮", "我考虑一下", "帮你是可以，但别到处说", "这次帮你，下次帮我"],
        gentle: ["当然可以，你说吧", "能帮上忙我很开心", "不用客气，尽管说", "只要我能做到的都行"],
        shy: ["我...我试试看", "不一定能帮上...", "但我会尽力的", "你相信我吗？"],
        mischievous: ["帮你可以，但要欠我一个人情哦~", "什么事？我先听听看", "好说好说，咱们谁跟谁", "需要我动用特殊关系吗？"],
      },
    },
  ],
  close: [
    {
      label: "倾诉心事",
      replies: {
        sunny: ["其实...有时候我也会觉得孤单", "还好有你这样的朋友", "大家都觉得我整天嘻嘻哈哈的", "其实我也会难过"],
        tsundere: ["跟你说这些...是因为信任你", "不要告诉别人哦", "其实我没有看起来那么坚强", "谢谢你愿意听"],
        gentle: ["有些事只能跟你说呢", "你是我很重要的朋友", "能遇见你是件很幸运的事", "我会一直珍惜我们的友谊"],
        shy: ["那个...我只跟你说", "谢谢你一直这么温柔", "从来没有人这么认真地听我说话", "你真的很重要"],
        mischievous: ["好吧，说真的...其实我有时候也挺没安全感的", "你是少数几个知道我真面目的人", "大家以为我什么都不在乎，其实不是", "谢谢你没有讨厌真实的我"],
      },
    },
    {
      label: "深聊人生",
      replies: {
        sunny: ["人生嘛，开心一天是一天", "不过有朋友在，什么都不怕", "想那么多干嘛，活在当下", "最重要的就是每天开心"],
        tsundere: ["有时候想，人活着到底为了什么", "...大概是有人在乎吧", "人生的意义可能需要慢慢找", "至少现在觉得还不错"],
        gentle: ["每个人都有自己的路要走", "能遇到你，是件很幸运的事", "人生的意义就是这些美好的相遇", "且行且珍惜"],
        shy: ["我...以前从来没想过这些", "谢谢你让我愿意去想", "人生真的好复杂...", "但有你陪着就很好了"],
        mischievous: ["严肃话题！好吧，其实我觉得人活着就是要留下点什么", "哪怕只是让别人笑一笑", "人生苦短，必须精彩", "我认真的时候是不是很可怕？"],
      },
    },
    {
      label: "关于我们",
      replies: {
        sunny: ["咱们的关系还用说？铁！", "以后不管怎样，都是兄弟！", "认识你是我大学最赚的事", "别忘了常联系啊"],
        tsundere: ["哼...你算是我少数认可的人了", "好好珍惜吧，我不轻易认可人的", "这段友谊...还不错", "别告诉别人我说过这些"],
        gentle: ["能和你成为朋友，真的很开心", "希望这份友谊能一直延续", "你是少数让我觉得安心的人", "谢谢你一直以来的陪伴"],
        shy: ["我...很珍惜和你的关系", "你对我很重要", "不要离开...", "能遇到你，我很幸运"],
        mischievous: ["咱们俩？最佳搭档！", "以后还要一起干很多坏事呢😏", "你是我见过最有趣的人", "别想甩掉我，嘿嘿"],
      },
    },
    {
      label: "家庭往事",
      replies: {
        sunny: ["我家其实条件一般，所以我很早就学会自己赚钱了", "家里人虽然不太理解我，但还是很支持", "说这些有点肉麻，但家就是港湾啊", "我有三个姐姐，所以性格比较开朗"],
        tsundere: ["...家里对我期望很高", "有时候觉得压力很大", "我不太想提家里的事...但不是不信任你", "其实我很想证明给他们看"],
        gentle: ["我家在一个小镇上，很安静的地方", "从小父母就教我多关心别人", "家里虽然不富裕但很温暖", "每次回家妈妈都会做一大桌子菜"],
        shy: ["我、我家里就我一个...", "父母很忙...", "但我理解他们", "偶尔会想家..."],
        mischievous: ["我家可热闹了，亲戚特别多！", "小时候我可是村里最调皮的那个", "我爸说我天生就是搞事情的料", "家族聚会永远是我主持~"],
      },
    },
    {
      label: "真心话",
      replies: {
        sunny: ["说真的，我最怕的不是没钱，是没朋友", "其实我很大方是因为小时候被分享过", "我对你可是100%真心的", "这些话我只跟你说"],
        tsundere: ["好吧...其实我很感激你在身边", "虽然我嘴上不饶人，但心里很珍惜", "你可能是最了解我的人了", "...谢谢"],
        gentle: ["其实我没有看起来那么完美", "我也有脆弱的时候，只是不想让别人担心", "在你面前，我可以做真实的自己", "这对我来说很珍贵"],
        shy: ["我...其实有很多话想跟你说", "但是每次都不知道怎么开口", "你对我来说很特别", "谢谢你没有放弃我"],
        mischievous: ["其实我搞那么多事情，只是想被关注", "认真说，有你这样的朋友太幸运了", "我开玩笑的时候，其实也很认真", "好了好了，太肉麻了，换个话题！"],
      },
    },
  ],
  dating: [
    {
      label: "撒个娇",
      replies: {
        sunny: ["嘿嘿，你今天怎么这么可爱~", "过来让我抱一下！", "有你真好，每天都很开心", "我就是想听你声音了"],
        tsundere: ["哼...今天怎么主动来找我了？", "我才不是想你了呢...好吧有一点", "你最近表现还不错...继续保持", "笨蛋，你知道我在等你吗？"],
        gentle: ["看到你的消息我就很开心呀", "你今天过得怎么样？想你了", "和你在一起的每一天都很珍贵", "谢谢你来陪我聊天~"],
        shy: ["我...我就是想你了", "你来找我我好开心...", "今天特别想见你...", "脸红...你不要逗我啦"],
        mischievous: ["哟，今天主动来找我，想我了吧~", "嘿嘿，我正在想你呢你就来了", "我们是不是心有灵犀？", "过来过来，我跟你说个秘密"],
      },
    },
    {
      label: "聊聊约会",
      replies: {
        sunny: ["周末我们去吃那家新开的火锅吧！", "操场晚上散步超舒服的！", "我找到一个超棒的地方，下次带你去", "你喜欢看电影还是逛夜市？"],
        tsundere: ["...你想去哪？我都行", "上次那家店还不错...可以再去", "哼，你安排吧，我跟你走", "别去太吵的地方就行"],
        gentle: ["最近樱花开了，要不要一起去看？", "我知道一家安静的咖啡馆", "只要和你在一起，去哪里都好", "周末有空吗？一起去图书馆吧"],
        shy: ["去、去人少一点的地方...", "你决定就好...我都可以", "能和你一起出去就很开心", "上次的地方...我很喜欢"],
        mischievous: ["我想到一个超刺激的地方！", "约会必须要有惊喜！交给我安排", "上次你是不是被吓到了？哈哈哈", "下次去密室逃脱，敢不敢？"],
      },
    },
    {
      label: "关于未来",
      replies: {
        sunny: ["以后不管做什么，有你在就行", "等毕业了一起去旅行吧！", "只要两个人在一起，什么都不怕", "未来肯定会更好的！"],
        tsundere: ["...你想过以后的事吗？", "我也在认真考虑我们的未来", "希望毕业以后还能像现在这样", "我会努力的...为了我们"],
        gentle: ["能和你一起规划未来，是很幸福的事", "不管距离多远，心在一起就好", "我相信我们会一直走下去的", "一起努力，一起成长吧"],
        shy: ["以后...你还会像现在这样对我好吗？", "我不敢想太远...但希望能一直在一起", "有你在的未来...我很期待", "请一定不要离开我..."],
        mischievous: ["我们一起创业吧！开个奶茶店怎么样？", "未来的事谁也说不准，但此刻我在乎你", "我给你画个大饼——不对，是真饼！", "不管做什么，只要是和你一起就够啦"],
      },
    },
    {
      label: "甜蜜告白",
      replies: {
        sunny: ["我爱你！每天都要说一遍！", "你是世界上最棒的人！", "和你在一起的每一天都是礼物", "喜欢你已经不够用了，是超级喜欢！"],
        tsundere: ["...其实我很喜欢你，你知道的吧？", "虽然我不常说，但你是特别的", "能遇到你...我很幸运", "笨蛋，我爱你"],
        gentle: ["和你在一起的每一刻都很珍贵", "谢谢你出现在我的生命里", "爱你是我做过最好的决定", "余生请多指教"],
        shy: ["喜、喜欢你...好害羞", "每次说喜欢你都会心跳加速", "我真的很喜欢你...不要笑我", "有你在的世界真好"],
        mischievous: ["我一定是上辈子拯救了银河系才遇到你", "对你的喜欢已经溢出屏幕了！", "你猜我今天有多喜欢你？比昨天多一点~", "你是我的，谁也别想抢走😏"],
      },
    },
  ],
};

// NPC-specific unique topics
const NPC_SPECIAL_TOPICS: Record<string, { label: string; minAffinity: number; replies: string[] }[]> = {
  maidan_ge: [
    {
      label: "聊聊请客",
      minAffinity: 5,
      replies: [
        "今天食堂有红烧肉，我请！来不来？",
        "你还没吃饭吧？走，我认识食堂阿姨，多打点",
        "我这周请了5个人吃饭了，你也算一个！",
        "下次轮到谁请客了？哦对了，还是我！",
      ],
    },
    {
      label: "食堂攻略",
      minAffinity: 10,
      replies: [
        "周二的红烧肉最正宗！那天掌勺的是王师傅",
        "阿姨打饭看脸的，我帮你去打能多一倍",
        "千万别点周四的鱼，别问我为什么...",
        "一楼最左边的窗口量最大，记住这个秘密",
      ],
    },
    {
      label: "借钱经验",
      minAffinity: 20,
      replies: [
        "借钱？我从来只借不还——开玩笑的哈哈",
        "其实我请客的钱都是做兼职赚的",
        "缺钱跟我说，多了没有，一两百还是有的",
        "记住，钱是王八蛋，花了还能赚！",
      ],
    },
  ],
  xiangyu: [
    {
      label: "关于桃子",
      minAffinity: 30,
      replies: [
        "她...她真的很特别，对我特别好",
        "我不知道该怎么跟她说...有些话说不出口",
        "你觉得她会喜欢什么样的人？",
        "每次看到她，我就紧张得说不出话...",
      ],
    },
    {
      label: "关于表白",
      minAffinity: 50,
      replies: [
        "我想了很久了...但每次都退缩",
        "我怕说了之后连朋友都做不了",
        "你能给我一点建议吗？",
        "你是第一个知道我喜欢她的人...",
      ],
    },
  ],
  zhangyi: [
    {
      label: "部门工作",
      minAffinity: 10,
      replies: [
        "效率！效率懂吗？这批新人太慢了",
        "你倒是不错，比他们强",
        "我要求高是因为不想部门丢脸",
        "做好工作是本分，做不好就得出局",
      ],
    },
    {
      label: "私下聊聊",
      minAffinity: 40,
      replies: [
        "...其实我也不想这么严厉",
        "学生会就是这样，你不强就被人踩",
        "我看好你，别让我失望",
        "有些事不能公开说，但你可以信任我",
      ],
    },
  ],
  sunian: [
    {
      label: "聊聊摄影",
      minAffinity: 10,
      replies: [
        "你喜欢拍照吗？我可以教你一些构图技巧~",
        "学校的樱花道在傍晚的光线下最美了",
        "我最近在学人像摄影，还不太熟练呢",
        "这张是我上周拍的夕阳，你觉得怎么样？",
      ],
    },
    {
      label: "关于樱花",
      minAffinity: 25,
      replies: [
        "那颗樱花树是我来这个学校发现的第一个秘密基地",
        "春天的时候，花瓣飘落的样子怎么都看不腻",
        "你知道吗，樱花的花期只有两周……所以才格外珍贵",
        "下次樱花开了，一起去看吧。我帮你拍照~",
      ],
    },
    {
      label: "心理部日常",
      minAffinity: 40,
      replies: [
        "心理部其实挺安静的，很适合我",
        "有时候同学们来咨询，能帮到他们我就很开心",
        "其实我学心理学，最初是想更了解自己",
        "你遇到过什么烦恼吗？我可以当个倾听者",
      ],
    },
    {
      label: "深聊艺术",
      minAffinity: 50,
      replies: [
        "我觉得艺术不是技巧，是你怎么看待这个世界",
        "你知道吗，每个人拍出来的照片都不一样——因为每个人看到的都不一样",
        "有时候我会想，美到底是什么……后来发现，答案不重要，感受才重要",
        "如果你愿意，下次我可以带你去一个地方——那里的光很美",
      ],
    },
  ],
  taozi: [
    {
      label: "校园趣事",
      minAffinity: 10,
      replies: [
        "昨天看到一只超可爱的猫在图书馆门口！",
        "图书馆三楼有个超安静的位置，一般人我不告诉他",
        "南苑的樱花开了，要不要一起去看？",
        "有个学弟每天在操场跑步，坚持了好久，好佩服他",
      ],
    },
    {
      label: "学习搭档",
      minAffinity: 30,
      replies: [
        "要不要一起去图书馆学习？",
        "我有一个超好用的笔记方法，教你",
        "考试周一起复习吧，互相监督",
        "你学习挺认真的，我很欣赏",
      ],
    },
    {
      label: "香芋的事",
      minAffinity: 50,
      replies: [
        "香芋他...最近有点奇怪。你有没有觉得？",
        "他对我挺好的，但我不知道该怎么回应...",
        "你喜欢一个人会直接说吗？还是像香芋那样憋着？",
        "其实我知道的...我不傻。只是在等他说出来。",
      ],
    },
  ],
};

function getTopicsForNpc(npc: LoveNPC): { label: string; replies: Record<NPCPersonality, string[]> }[] {
  const affinity = npc.affinity;
  let tierTopics: { label: string; replies: Record<NPCPersonality, string[]> }[];
  if (npc.status === "dating") {
    tierTopics = DIALOGUE_TOPICS.dating;
  } else if (affinity >= 60) {
    tierTopics = DIALOGUE_TOPICS.close;
  } else if (affinity >= 30) {
    tierTopics = DIALOGUE_TOPICS.friend;
  } else if (affinity >= 10) {
    tierTopics = DIALOGUE_TOPICS.acquaintance;
  } else {
    tierTopics = DIALOGUE_TOPICS.stranger;
  }

  // Add NPC-specific topics
  const specialTopics = (NPC_SPECIAL_TOPICS[npc.id] || [])
    .filter((t) => affinity >= t.minAffinity)
    .map((t) => ({
      label: t.label,
      replies: {
        sunny: t.replies,
        tsundere: t.replies,
        gentle: t.replies,
        shy: t.replies,
        mischievous: t.replies,
      } as Record<NPCPersonality, string[]>,
    }));

  return [...specialTopics, ...tierTopics];
}

function getNpcAvatar(personality: NPCPersonality): string {
  const map: Record<NPCPersonality, string> = {
    sunny: "😄", tsundere: "😤", gentle: "🌸", shy: "😳", mischievous: "😏",
  };
  return map[personality];
}

function deptName(d: string): string {
  const map: Record<string, string> = {
    life: "生活部", office: "办公室", sports: "文体部", media: "新媒体部", social: "社管部", psychology: "心理部",
  };
  return map[d] ?? d;
}

export default function ContactsPanel() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selectedNpc, setSelectedNpc] = useState<LoveNPC | null>(null);
  const [chatLog, setChatLog] = useState<{ speaker: string; text: string; isPlayer: boolean }[]>([]);
  const [giftMode, setGiftMode] = useState(false);
  const [freeTalkMode, setFreeTalkMode] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [topics, setTopics] = useState<{ label: string; replies: Record<NPCPersonality, string[]> }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const npcs = state.loveNPCs.filter((n) => n.met);
  const gifts = state.inventory.filter((i) => i.category === "gift" && i.quantity > 0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    if (selectedNpc) {
      const interaction = state.npcInteractions[selectedNpc.id];
      if (interaction && interaction.dialogueHistory.length > 0) {
        setChatLog(interaction.dialogueHistory.map((d) => ({
          speaker: d.speaker === "player" ? "你" : selectedNpc.name,
          text: d.text,
          isPlayer: d.speaker === "player",
        })));
      } else {
        setChatLog([]);
      }
      setTopics(getTopicsForNpc(selectedNpc));
      setFreeTalkMode(false);
      setFreeText("");
    }
  }, [selectedNpc?.id]);

  const handleSelectNpc = (npc: LoveNPC) => {
    setSelectedNpc(npc);
    setGiftMode(false);
    setFreeTalkMode(false);
  };

  const handlePickTopic = (topic: { label: string; replies: Record<NPCPersonality, string[]> }) => {
    if (!selectedNpc) return;
    // Check weekly chat limit
    const inter = state.npcInteractions[selectedNpc.id];
    const thisWeekCount = inter?.dialogueHistory.filter(
      (d) => d.date === state.semesterWeek && d.speaker === "player"
    ).length ?? 0;
    if (thisWeekCount >= 3) return;

    const playerText = topic.label;
    dispatch({ type: "NPC_DIALOGUE", npcId: selectedNpc.id, text: playerText, speaker: "player" });
    setChatLog((prev) => [...prev, { speaker: "你", text: playerText, isPlayer: true }]);

    setTimeout(() => {
      const personalityReplies = topic.replies[selectedNpc.personality];
      const reply = personalityReplies[Math.floor(Math.random() * personalityReplies.length)];
      dispatch({ type: "NPC_DIALOGUE", npcId: selectedNpc.id, text: reply, speaker: "npc" });
      setChatLog((prev) => [...prev, { speaker: selectedNpc.name, text: reply, isPlayer: false }]);
      if (thisWeekCount < 3) {
        dispatch({ type: "UPDATE_AFFINITY", npcId: selectedNpc.id, delta: 1 });
      }
      setTopics(getTopicsForNpc(selectedNpc));
    }, 600 + Math.random() * 800);
  };

  const handleFreeTalk = () => {
    if (!selectedNpc || !freeText.trim()) return;
    const inter = state.npcInteractions[selectedNpc.id];
    const thisWeekCount = inter?.dialogueHistory.filter(
      (d) => d.date === state.semesterWeek && d.speaker === "player"
    ).length ?? 0;
    if (thisWeekCount >= 3) return;
    dispatch({ type: "NPC_DIALOGUE", npcId: selectedNpc.id, text: freeText, speaker: "player" });
    setChatLog((prev) => [...prev, { speaker: "你", text: freeText, isPlayer: true }]);
    setFreeText("");

    setTimeout(() => {
      const genericReplies: Record<NPCPersonality, string[]> = {
        sunny: ["哈哈有意思！", "说得好！", "嗯嗯，有道理~", "你说话真有趣！", "对对对！我也这么想"],
        tsundere: ["...哼，说的还有点道理", "还行吧", "我可没说要同意你", "啧，勉强认可", "随你怎么说"],
        gentle: ["嗯，我理解你的意思", "说得真好呢", "谢谢你和我说这些", "有道理~", "我也觉得很对"],
        shy: ["啊...是、是这样吗", "嗯...你说的对", "我...我也这么觉得", "好的...", "你说得很有道理"],
        mischievous: ["哦？有意思！", "嘿嘿，你是第一个这么说的", "我懂我懂~", "展开说说！", "这个角度我没想过"],
      };
      const replies = genericReplies[selectedNpc.personality];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      dispatch({ type: "NPC_DIALOGUE", npcId: selectedNpc.id, text: reply, speaker: "npc" });
      setChatLog((prev) => [...prev, { speaker: selectedNpc.name, text: reply, isPlayer: false }]);
      if (thisWeekCount < 3) {
        dispatch({ type: "UPDATE_AFFINITY", npcId: selectedNpc.id, delta: 1 });
      }
    }, 600 + Math.random() * 800);
  };

  const handleGiveGift = (item: InventoryItem) => {
    if (!selectedNpc) return;
    const bonus = item.effects.affinityBonus ?? 5;
    dispatch({ type: "GIVE_GIFT", npcId: selectedNpc.id, itemId: item.itemId, affinityGain: bonus });
    setChatLog((prev) => [...prev, { speaker: "系统", text: `送出 ${item.icon} ${item.name}，好感 +${bonus}`, isPlayer: false }]);
    setGiftMode(false);
  };

  const handleAskFavor = () => {
    if (!selectedNpc) return;
    dispatch({ type: "NPC_DIALOGUE", npcId: selectedNpc.id, text: "你能帮我一个忙吗？", speaker: "player" });
    setChatLog((prev) => [...prev, { speaker: "你", text: "你能帮我一个忙吗？", isPlayer: true }]);
    dispatch({ type: "NPC_ASK_FAVOR", npcId: selectedNpc.id });
    // Refetch topics after stats change
    setTimeout(() => setTopics(getTopicsForNpc(selectedNpc)), 300);
  };

  const handleShareGossip = () => {
    if (!selectedNpc) return;
    dispatch({ type: "NPC_DIALOGUE", npcId: selectedNpc.id, text: "我听说了一个八卦...", speaker: "player" });
    setChatLog((prev) => [...prev, { speaker: "你", text: "我听说了一个八卦...", isPlayer: true }]);
    dispatch({ type: "NPC_SHARE_GOSSIP", npcId: selectedNpc.id });
    setTimeout(() => setTopics(getTopicsForNpc(selectedNpc)), 300);
  };

  const handleBack = () => {
    setSelectedNpc(null);
    setChatLog([]);
    setGiftMode(false);
    setFreeTalkMode(false);
  };

  const handleClose = () => {
    dispatch({ type: "SET_PHASE", phase: "game" });
  };

  const handleConfess = () => {
    if (!selectedNpc) return;
    dispatch({
      type: "APPLY_CHOICE",
      effects: [],
      feedback: "",
      flags: [`confessing_to_${selectedNpc.id}`],
      eventId: `confess_${selectedNpc.id}`,
      eventTitle: `向${selectedNpc.name}表白`,
    });
    dispatch({ type: "SET_PHASE", phase: "love_confess" });
  };

  // NPC list
  if (!selectedNpc) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>通讯录</h2>
          <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        </div>
        {npcs.length === 0 ? (
          <div className={styles.empty}>还没有认识任何人...多参加社交活动吧！</div>
        ) : (
          <div className={styles.npcList}>
            {npcs.map((npc) => {
              const tier = getAffinityTier(npc.affinity);
              return (
                <div key={npc.id} className={styles.npcCard} onClick={() => handleSelectNpc(npc)}>
                  <div className={styles.npcAvatar}>
                    {npc.avatar ? (
                      <img src={npc.avatar} alt={npc.name} className={styles.avatarImg} />
                    ) : (
                      getNpcAvatar(npc.personality)
                    )}
                  </div>
                  <div className={styles.npcInfo}>
                    <div className={styles.npcName}>{npc.name}</div>
                    <div className={styles.npcMeta}>
                      {PERSONALITY_LABELS[npc.personality]} · {deptName(npc.department)}
                    </div>
                    <div className={styles.affinityBar}>
                      <div className={styles.affinityFill} style={{ width: `${npc.affinity}%`, background: tier.color }} />
                    </div>
                  </div>
                  <div className={styles.npcAffinity} style={{ color: tier.color }}>
                    {tier.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Chat view
  const tier = getAffinityTier(selectedNpc.affinity);
  const chatInter = state.npcInteractions[selectedNpc.id];
  const weeklyChatCount = chatInter?.dialogueHistory.filter(
    (d) => d.date === state.semesterWeek && d.speaker === "player"
  ).length ?? 0;
  const chatLimitReached = weeklyChatCount >= 3;
  return (
    <div className={styles.container}>
      {/* Chat header */}
      <div className={styles.chatHeader}>
        <button className={styles.backBtn} onClick={handleBack}>←</button>
        <div className={styles.chatAvatar}>
          {selectedNpc.avatar ? (
            <img src={selectedNpc.avatar} alt={selectedNpc.name} className={styles.avatarImg} />
          ) : (
            getNpcAvatar(selectedNpc.personality)
          )}
        </div>
        <div className={styles.chatHeaderInfo}>
          <div className={styles.chatName}>{selectedNpc.name}</div>
          <div className={styles.chatStatus} style={{ color: tier.color }}>
            {selectedNpc.status === "dating" ? "❤️ 恋人" : selectedNpc.status === "rejected" ? "💔 已拒绝" : `${tier.label} · 好感 ${selectedNpc.affinity}`}
          </div>
        </div>
        {selectedNpc.affinity >= 40 && selectedNpc.status !== "rejected" && (
          <button className={styles.actionBtn} onClick={handleAskFavor} title="请帮忙">🤝</button>
        )}
        {selectedNpc.affinity >= 50 && selectedNpc.status !== "rejected" && (
          <button className={styles.actionBtn} onClick={handleShareGossip} title="分享八卦">🗣️</button>
        )}
        {selectedNpc.affinity >= 60 && selectedNpc.canRomance && selectedNpc.status !== "dating" && selectedNpc.status !== "rejected" && (
          <button className={styles.loveBtn} onClick={handleConfess} title="表白">💌</button>
        )}
        <button className={styles.giftBtn} onClick={() => { setGiftMode(!giftMode); setFreeTalkMode(false); }} title="送礼物">🎁</button>
        <button className={styles.freeTalkBtn} onClick={() => { setFreeTalkMode(!freeTalkMode); setGiftMode(false); }} title="自由聊天">{freeTalkMode ? "📋" : "💬"}</button>
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
      </div>

      {/* Chat messages */}
      <div className={styles.chatArea}>
        <div className={styles.chatLog}>
          {chatLog.length === 0 && (
            <div className={styles.chatHint}>
              <div className={styles.chatHintAvatar}>
                {selectedNpc.avatar ? (
                  <img src={selectedNpc.avatar} alt={selectedNpc.name} className={styles.avatarImg} />
                ) : (
                  getNpcAvatar(selectedNpc.personality)
                )}
              </div>
              <div className={styles.chatHintText}>"{selectedNpc.dialogues.firstMeet}"</div>
              <div className={styles.chatHintSub}>选择一个话题开始聊天吧</div>
            </div>
          )}
          {chatLog.map((msg, i) => (
            <div key={i} className={`${styles.chatBubble} ${msg.isPlayer ? styles.bubbleSelf : msg.speaker === "系统" ? styles.bubbleSystem : styles.bubbleNpc}`}>
              {!msg.isPlayer && msg.speaker !== "系统" && (
                <div className={styles.bubbleAvatar}>
                  {selectedNpc.avatar ? (
                    <img src={selectedNpc.avatar} alt={selectedNpc.name} className={styles.avatarImg} />
                  ) : (
                    getNpcAvatar(selectedNpc.personality)
                  )}
                </div>
              )}
              <div className={styles.bubbleContent}>
                {!msg.isPlayer && msg.speaker !== "系统" && (
                  <div className={styles.bubbleName}>{msg.speaker}</div>
                )}
                <div className={styles.bubbleText}>{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Gift panel overlay */}
        {giftMode && (
          <div className={styles.giftOverlay}>
            <div className={styles.giftTitle}>选择礼物送给 {selectedNpc.name}</div>
            {gifts.length === 0 ? (
              <div className={styles.noGifts}>背包中没有礼物，去南苑超市购买吧！</div>
            ) : (
              <div className={styles.giftList}>
                {gifts.map((item) => (
                  <div key={item.itemId} className={styles.giftItem} onClick={() => handleGiveGift(item)}>
                    <span className={styles.giftIcon}>{item.icon}</span>
                    <span className={styles.giftName}>{item.name}</span>
                    <span className={styles.giftQty}>×{item.quantity}</span>
                    <span className={styles.giftBonus}>+{item.effects.affinityBonus ?? 5}</span>
                  </div>
                ))}
              </div>
            )}
            <button className={styles.cancelGiftBtn} onClick={() => setGiftMode(false)}>收起</button>
          </div>
        )}

        {/* Free talk input */}
        {freeTalkMode && (
          <div className={styles.freeTalkArea}>
            <input
              className={styles.freeTalkInput}
              type="text"
              placeholder="输入你想说的话..."
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleFreeTalk(); }}
            />
            <button className={styles.freeTalkSend} onClick={handleFreeTalk}>发送</button>
          </div>
        )}

        {/* Dialogue topic buttons */}
        {!giftMode && !freeTalkMode && (
          <div className={styles.topicArea}>
            <div className={styles.topicHeader}>
              💬 聊天话题
              <span className={styles.chatLimit}>
                {chatLimitReached ? " 今天聊够了~" : ` 剩余${3 - weeklyChatCount}次`}
              </span>
            </div>
            <div className={styles.topicGrid}>
              {topics.map((topic, i) => (
                <button
                  key={i}
                  className={`${styles.topicBtn} ${chatLimitReached ? styles.topicBtnDisabled : ""}`}
                  onClick={() => handlePickTopic(topic)}
                  disabled={chatLimitReached}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
