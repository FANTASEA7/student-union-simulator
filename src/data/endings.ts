// src/data/endings.ts
import { Ending } from "../types/game";

export const ENDINGS: Record<string, Ending> = {
  president_great: {
    type: "president_great",
    title: "主席·卓越",
    subtitle: "你带领学生会走向了新的高度",
    description: "在你的带领下，学生会成为全校最具影响力的组织。你被推荐参加全国学联会议，毕业后收到了多家名企的offer。牛马大学的学生们至今传颂着你的传说。",
  },
  president_good: {
    type: "president_good",
    title: "主席·合格",
    subtitle: "你完成了主席的使命",
    description: "你成功当选主席并完成任期。虽然有些波折，但总体平稳。毕业典礼上，你在学生代表席中看到了自己曾经帮助过的学弟学妹们。",
  },
  minister_end: {
    type: "minister_end",
    title: "部长·止步",
    subtitle: "你在部长的位置上发光发热",
    description: "虽然没有走到主席的位置，但你在部长任期内办成了几件漂亮的事。你学会了管理的艺术，也收获了真挚的友谊。大学生活不就是这样吗？",
  },
  staff_end: {
    type: "staff_end",
    title: "干事·平凡",
    subtitle: "你体验了学生会，然后选择离开",
    description: "你试过了，体验过了。学生会不是你的全部。你把更多的时间花在了图书馆、社团和朋友身上。平凡而真实的大学时光，一样值得怀念。",
  },
  burnout: {
    type: "burnout",
    title: "心理崩溃",
    subtitle: "你承受了太多",
    description: "压力太大，你倒下了。休学半年后，你学会了与自己和解。有时候，退一步不是认输，而是为了更好地前进。",
  },
  love_end: {
    type: "love_end",
    title: "校园之恋",
    subtitle: "你收获了爱情",
    description: "在充满竞争与压力的学生会之外，你找到了属于自己的温暖。多年以后，你依然记得那个在校园里一起走过的身影。",
  },
  cheat_expelled: {
    type: "cheat_expelled",
    title: "牵连之祸",
    subtitle: "近墨者黑，你被张艺拖下了水",
    description: "你和张艺走得太近了。当他东窗事发时，调查发现你也间接参与了其中一些不光彩的事。虽然没有被开除，但你在档案上留下了难以抹去的污点。学生会的大门永远对你关闭了。你终于明白——有些人，离得越远越好。",
  },
};
