// src/components/GameScreen/ChairRelationsPanel/ChairRelationsPanel.tsx
import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { DEPARTMENTS } from "../../../data/departments";
import { createChairNegotiation } from "../../../data/negotiation";
import { Department, NPCPersonality } from "../../../types/game";
import styles from "./ChairRelationsPanel.module.css";

const CHAIR_BONUSES: Record<Department, { name: string; desc: string; icon: string }> = {
  life: { name: "烟头叔叔的关照", desc: "压力+15, 生活费+20", icon: "☕" },
  office: { name: "明六六的效率", desc: "组织力+8", icon: "📋" },
  sports: { name: "小蛋糕的人气", desc: "魅力值+8, 人脉+5", icon: "🎤" },
  media: { name: "青岛王的曝光", desc: "人脉+5, 魅力值+3, 媒体曝光", icon: "📱" },
  social: { name: "丁凯之子的人脉", desc: "人脉+8, 隐藏NPC", icon: "🔗" },
  psychology: { name: "心理部的疏导", desc: "压力+10, 隐藏对话", icon: "🍵" },
};

const CHAIR_PERSONALITIES: Record<Department, { emoji: string; personality: NPCPersonality }> = {
  life: { emoji: "🚬", personality: "sunny" },
  office: { emoji: "📋", personality: "mischievous" },
  sports: { emoji: "🎤", personality: "sunny" },
  media: { emoji: "📱", personality: "mischievous" },
  social: { emoji: "🔗", personality: "shy" },
  psychology: { emoji: "🍵", personality: "gentle" },
};

function OpinionBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, ((value + 100) / 200) * 100));
  const color = value >= 30 ? "#27ae60" : value >= 0 ? "#f0c040" : value >= -30 ? "#e67e22" : "#e74c3c";
  return (
    <div className={styles.barTrack}>
      <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function ChairRelationsPanel() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  return (
    <div className={styles.container}>
      {/* Header with back button */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "game" })}>
          ← 返回
        </button>
        <div>
          <h3 className={styles.title}>🏛️ 部长关系</h3>
          <p className={styles.subtitle}>好感度影响晋升和可获得的支持</p>
        </div>
        <div className={styles.headerSpacer} />
      </div>

      <div className={styles.chairList}>
        {DEPARTMENTS.map((dept) => {
          const opinion = state.chairOpinions[dept.id] ?? 0;
          const bonusUsed = state.chairBonusesUsed[dept.id];
          const canCallFavor = opinion >= 60 && !bonusUsed;
          const bonus = CHAIR_BONUSES[dept.id];

          return (
            <div key={dept.id} className={styles.chairCard}>
              <div className={styles.chairHeader}>
                <img
                  className={styles.chairAvatar}
                  src={`/characters/${dept.id}_head.png`}
                  alt={dept.headName}
                />
                <div className={styles.chairInfo}>
                  <div className={styles.chairName}>{dept.headName}</div>
                  <div className={styles.chairDept}>{dept.name}</div>
                </div>
                <div className={styles.opinionValue} style={{ color: opinion >= 0 ? "#27ae60" : "#e74c3c" }}>
                  {opinion > 0 ? "+" : ""}{opinion}
                </div>
              </div>

              <OpinionBar value={opinion} />

              <div className={styles.chairPersona}>"{dept.personality}"</div>

              {canCallFavor && (
                <button
                  className={styles.favorBtn}
                  onClick={() => dispatch({ type: "CALL_FAVOR", chair: dept.id })}
                >
                  {bonus.icon} 请求支持：{bonus.desc}
                </button>
              )}
              {bonusUsed && (
                <div className={styles.favorUsed}>✅ 本学期的支持已使用</div>
              )}
              {opinion < 60 && !bonusUsed && (
                <div className={styles.favorLocked}>🔒 好感度60以上可请求支持</div>
              )}

              <button
                className={styles.negotiateBtn}
                onClick={() => {
                  const cp = CHAIR_PERSONALITIES[dept.id];
                  const neg = createChairNegotiation(dept.headName, cp.emoji, dept.id, cp.personality);
                  dispatch({ type: "START_NEGOTIATION", negotiation: neg });
                }}
              >
                🗣️ 说服部长
              </button>
            </div>
          );
        })}
      </div>

      {state.flags["burnout_warning"] && (
        <div className={styles.burnoutWarning}>
          ⚠️ 压力过高！活动效率降低50%，建议休息减压
        </div>
      )}
    </div>
  );
}
