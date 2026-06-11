import { useEffect, useState } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { generateRanking } from "../../utils/examCalc";
import { DEPARTMENTS } from "../../data/departments";
import { Stats } from "../../types/game";
import { getVolunteerTier } from "../../reducer/gameReducer";
import styles from "./SemesterSummary.module.css";

const STAT_LABELS: Record<string, { name: string; icon: string; color: string }> = {
  organization: { name: "组织力", icon: "📋", color: "#27ae60" },
  connections: { name: "人脉", icon: "🤝", color: "#2980b9" },
  academics: { name: "学习力", icon: "📚", color: "#8e44ad" },
  charisma: { name: "魅力值", icon: "💬", color: "#e74c3c" },
  stress: { name: "压力", icon: "🛡️", color: "#e67e22" },
  budget: { name: "经费", icon: "💰", color: "#2ecc71" },
  volunteerHours: { name: "志愿时长", icon: "⏱️", color: "#1abc9c" },
  allowance: { name: "生活费", icon: "💵", color: "#f39c12" },
};

const STAGE_LABELS: Record<string, string> = {
  staff: "干事",
  minister: "部长",
  president: "主席",
};

export default function SemesterSummary() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [showDetail, setShowDetail] = useState(false);

  const cet4Passed = state.flags["cet4_passed"] ?? false;
  const dept = DEPARTMENTS.find((d) => d.id === state.department);

  // Generate a ranking if not already present for this semester
  const ranking = (() => {
    const lastRanking = state.examRankings[state.examRankings.length - 1];
    if (lastRanking && lastRanking.semester === state.semester - 1) {
      return lastRanking;
    }
    // Generate on-the-fly
    return generateRanking(state.stats, state.playerName, state.week, state.semester - 1, cet4Passed);
  })();

  // Recent events from this semester
  const semesterEvents = state.eventLog.filter(
    (e) => e.week > Math.max(0, state.week - 16)
  ).slice(-6);

  // NPC affinity changes
  const knownNPCs = state.loveNPCs.filter((n) => n.met);

  const handleContinue = () => {
    dispatch({ type: "SET_PHASE", phase: "event" });
  };

  const statKeys = Object.keys(STAT_LABELS) as (keyof Stats)[];

  return (
    <div className={styles.container}>
      <div className={styles.bg} />

      {!showDetail ? (
        /* ===== 概览页 ===== */
        <div className={styles.overview}>
          <div className={styles.badge}>
            <div className={styles.semesterLabel}>
              第 {Math.max(1, state.semester - 1)} 学期
            </div>
            <div className={styles.semesterTitle}>学期结束</div>
            <div className={styles.semesterSub}>
              {dept?.name} · {STAGE_LABELS[state.stage] || state.stage}
            </div>
          </div>

          <div className={styles.rankingPreview}>
            <div className={styles.rankIcon}>
              {ranking.playerRank === 1 ? "🥇" :
               ranking.playerRank <= 3 ? "🥈" :
               ranking.playerRank <= 5 ? "🥉" : "📊"}
            </div>
            <div className={styles.rankText}>
              综合排名: 第 {ranking.playerRank} 名
            </div>
            <div className={styles.rankEval}>{ranking.evaluation}</div>
          </div>

          {/* 奖学金 & 志愿等级 */}
          <div className={styles.awardsList}>
            {state.flags["scholarship_awarded"] && (
              <div className={styles.awardCard}>
                <span className={styles.awardIcon}>🎓</span>
                <div>
                  <div className={styles.awardTitle}>学业奖学金</div>
                  <div className={styles.awardDesc}>学习力≥70 → +300生活费 +5魅力值</div>
                </div>
              </div>
            )}
            {(() => {
              const vt = getVolunteerTier(state.stats.volunteerHours);
              if (vt.tier !== "novice") {
                return (
                  <div className={styles.awardCard}>
                    <span className={styles.awardIcon}>⏱️</span>
                    <div>
                      <div className={styles.awardTitle}>志愿等级：{vt.title}</div>
                      <div className={styles.awardDesc}>
                        累计 {state.stats.volunteerHours} 小时
                        {vt.nextAt < Infinity ? ` (距离下一级还需 ${vt.nextAt - state.stats.volunteerHours}h)` : " (已达最高等级!)"}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
            {state.stats.volunteerHours >= 50 && !state.flags["volunteer_cert_50"] && (
              <div className={styles.awardCard}>
                <span className={styles.awardIcon}>📜</span>
                <div>
                  <div className={styles.awardTitle}>志愿服务证书 (50h)</div>
                  <div className={styles.awardDesc}>魅力值永久 +2</div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.statBars}>
            {statKeys.map((key) => {
              const val = state.stats[key] as number;
              const displayVal = key === "volunteerHours" ? val : Math.min(100, val);
              const pct = key === "volunteerHours" ? Math.min(100, (val / 50) * 100) :
                          key === "allowance" ? Math.min(100, (val / 1500) * 100) :
                          displayVal;
              return (
                <div key={key} className={styles.statBar}>
                  <span className={styles.statIcon}>{STAT_LABELS[key].icon}</span>
                  <span className={styles.statName}>{STAT_LABELS[key].name}</span>
                  <div className={styles.statTrack}>
                    <div
                      className={styles.statFill}
                      style={{
                        width: `${pct}%`,
                        background: STAT_LABELS[key].color,
                      }}
                    />
                  </div>
                  <span className={styles.statVal}>{val}</span>
                </div>
              );
            })}
          </div>

          <button className={styles.detailBtn} onClick={() => setShowDetail(true)}>
            查看详情 ▶
          </button>

          {/* 校园局势摘要 */}
          {state.campusClimate && (
            <div className={styles.climateSummary}>
              <div className={styles.climateLabel}>校园氛围</div>
              <div className={styles.climateMood}>
                {(() => {
                  const moodMap: Record<string, { icon: string; label: string }> = {
                    calm: { icon: "🟢", label: "风平浪静" },
                    busy: { icon: "🟡", label: "忙碌时期" },
                    tense: { icon: "🟠", label: "暗流涌动" },
                    thriving: { icon: "🔵", label: "繁荣兴旺" },
                    crisis: { icon: "🔴", label: "危机四伏" },
                  };
                  const m = moodMap[state.campusClimate.dominantMood ?? "calm"];
                  return <>{m?.icon ?? "🟢"} {m?.label ?? "风平浪静"}</>;
                })()}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ===== 详情页 ===== */
        <div className={styles.detail}>
          <h2 className={styles.detailTitle}>
            第 {Math.max(1, state.semester - 1)} 学期 · 回顾
          </h2>

          {/* 排名 */}
          <div className={styles.rankingDetail}>
            <h3>🏆 综合排名</h3>
            <div className={styles.rankList}>
              {ranking.rankings.slice(0, 5).map((entry, i) => {
                const isPlayer = entry.name === state.playerName;
                const maxScore = ranking.rankings[0]?.score || 1;
                return (
                  <div
                    key={i}
                    className={`${styles.rankItem} ${isPlayer ? styles.rankItemPlayer : ""}`}
                  >
                    <span className={styles.rankNum}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span className={styles.rankName}>
                      {entry.name}{isPlayer ? " (你)" : ""}
                    </span>
                    <div className={styles.rankBar}>
                      <div
                        className={styles.rankBarFill}
                        style={{ width: `${(entry.score / maxScore) * 100}%` }}
                      />
                    </div>
                    <span className={styles.rankScore}>{entry.score}分</span>
                  </div>
                );
              })}
            </div>
            <div className={styles.rankEval}>"{ranking.evaluation}"</div>
          </div>

          {/* 事件回顾 */}
          {semesterEvents.length > 0 && (
            <div className={styles.eventReview}>
              <h3>📜 关键事件</h3>
              <div className={styles.eventList}>
                {semesterEvents.map((e, i) => (
                  <div key={i} className={styles.eventItem}>
                    <span className={styles.eventWeek}>第{e.week}周</span>
                    <span className={styles.eventTitle}>{e.title}</span>
                    <span className={styles.eventResult}>{e.result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NPC */}
          {knownNPCs.length > 0 && (
            <div className={styles.npcReview}>
              <h3>💕 人际关系</h3>
              <div className={styles.npcList}>
                {knownNPCs.map((npc) => (
                  <div key={npc.id} className={styles.npcItem}>
                    <span className={styles.npcName}>{npc.name}</span>
                    <div className={styles.npcAffinityBar}>
                      <div
                        className={styles.npcAffinityFill}
                        style={{ width: `${npc.affinity}%` }}
                      />
                    </div>
                    <span className={styles.npcStatus}>
                      {npc.status === "dating" ? "❤️" :
                       npc.status === "close" ? "🤝" :
                       npc.status === "friend" ? "👋" :
                       npc.status === "rejected" ? "💔" : "?"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Combo 历史 */}
          {state.lastWeeklyCombos && state.lastWeeklyCombos.length > 0 && (
            <div className={styles.npcReview}>
              <h3>🔥 最佳 Combo</h3>
              <div className={styles.eventList}>
                {state.lastWeeklyCombos.slice(0, 5).map((combo, i) => (
                  <div key={i} className={styles.eventItem}>
                    <span className={styles.eventWeek}>{combo.icon}</span>
                    <span className={styles.eventTitle}>{combo.label}</span>
                    <span className={styles.eventResult}>{combo.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className={styles.continueBtn} onClick={handleContinue}>
            开始新学期 ▶
          </button>
        </div>
      )}
    </div>
  );
}
