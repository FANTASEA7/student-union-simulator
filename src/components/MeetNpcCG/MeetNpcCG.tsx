// src/components/MeetNpcCG/MeetNpcCG.tsx
import { useEffect, useState } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import styles from "./MeetNpcCG.module.css";

const PERSONALITY_EMOJI: Record<string, string> = {
  sunny: "☀️",
  tsundere: "😤",
  gentle: "🌸",
  shy: "😳",
  mischievous: "😏",
};

const PERSONALITY_LABEL: Record<string, string> = {
  sunny: "阳光开朗",
  tsundere: "傲娇别扭",
  gentle: "温柔体贴",
  shy: "害羞内向",
  mischievous: "古灵精怪",
};

export default function MeetNpcCG() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [phase, setPhase] = useState<"show" | "intro" | "done">("show");

  const npcId = state.meetingNpcId;
  const npc = npcId ? state.loveNPCs.find((n) => n.id === npcId) : null;

  useEffect(() => {
    if (!npc) {
      dispatch({ type: "SET_PHASE", phase: "game" });
      return;
    }
    const t1 = setTimeout(() => setPhase("intro"), 600);
    const t2 = setTimeout(() => dispatch({ type: "SET_PHASE", phase: "game" }), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!npc) return null;

  const departmentLabels: Record<string, string> = {
    life: "生活部", office: "办公室", sports: "体育部",
    media: "媒体部", social: "社联部", psychology: "心理部", other: "",
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />

      <div className={`${styles.card} ${styles[phase]}`}>
        {/* 头像区 */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarRing}>
            {npc.avatar ? (
              <img src={npc.avatar} alt={npc.name} className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarPlaceholder}>
                {npc.gender === "female" ? "👩" : "👨"}
              </span>
            )}
          </div>
          <div className={styles.sparkle}>
            {PERSONALITY_EMOJI[npc.personality] ?? "✨"}
          </div>
        </div>

        {/* 信息区 */}
        <div className={styles.infoSection}>
          <div className={styles.meetLabel}>— 结识了新朋友 —</div>
          <h1 className={styles.npcName}>{npc.name}</h1>

          <div className={styles.tags}>
            {npc.personality && (
              <span className={styles.tag}>
                {PERSONALITY_EMOJI[npc.personality]} {PERSONALITY_LABEL[npc.personality]}
              </span>
            )}
            {npc.department !== "other" && (
              <span className={styles.tag}>
                🏢 {departmentLabels[npc.department] ?? npc.department}
              </span>
            )}
            <span className={styles.tag}>
              🎓 大{npc.year === 1 ? "一" : npc.year === 2 ? "二" : npc.year === 3 ? "三" : "四"}
            </span>
            <span className={styles.tag}>💝 {npc.hobby}</span>
          </div>

          <div className={styles.appearance}>外表：{npc.appearance}</div>

          <div className={styles.firstMeet}>
            "{npc.dialogues.firstMeet}"
          </div>
        </div>
      </div>

      <p className={styles.hint}>将在通讯录中解锁此联系人</p>
    </div>
  );
}
