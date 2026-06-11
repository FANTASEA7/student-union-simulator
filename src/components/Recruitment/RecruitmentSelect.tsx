// src/components/Recruitment/RecruitmentSelect.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import type { RecruitApplicant } from "../../types/game";
import styles from "./RecruitmentSelect.module.css";

const QUALITY_CONFIG: Record<string, { label: string; color: string; glow: string }> = {
  legendary: { label: "传奇", color: "#f0c040", glow: "0 0 20px rgba(240,192,64,0.5)" },
  epic: { label: "史诗", color: "#a855f7", glow: "0 0 16px rgba(168,85,247,0.4)" },
  rare: { label: "稀有", color: "#3b82f6", glow: "0 0 12px rgba(59,130,246,0.3)" },
  common: { label: "普通", color: "#9ca3af", glow: "none" },
};

export default function RecruitmentSelect() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const rs = state.recruitState;

  if (!rs) return null;

  const handleSelect = (index: number) => {
    dispatch({ type: "SELECT_APPLICANT", index });
  };

  const handleFinish = () => {
    dispatch({ type: "FINISH_RECRUITMENT" });
  };

  const hiredList = rs.applicants.filter((a) => a.hired === true);
  const rejectedList = rs.applicants.filter((a) => a.hired === false);
  const pendingList = rs.applicants.filter((a) => a.hired === undefined);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>📋 浏览简历</h2>
        <p className={styles.headerSub}>
          已录用 {rs.hiredCount}/{rs.maxHires} 人 · 点击候选人进入面试
        </p>
      </div>

      {/* 已录用的干事 */}
      {hiredList.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>✅ 已录用</h3>
          <div className={styles.grid}>
            {hiredList.map((app) => (
              <ApplicantCard key={app.id} applicant={app} disabled />
            ))}
          </div>
        </div>
      )}

      {/* 已拒绝 */}
      {rejectedList.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>❌ 已拒绝</h3>
          <div className={styles.grid}>
            {rejectedList.map((app) => (
              <ApplicantCard key={app.id} applicant={app} disabled />
            ))}
          </div>
        </div>
      )}

      {/* 待面试 */}
      {pendingList.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>📝 待面试</h3>
          <div className={styles.grid}>
            {pendingList.map((app, i) => {
              const originalIndex = rs.applicants.indexOf(app);
              return (
                <ApplicantCard
                  key={app.id}
                  applicant={app}
                  onClick={() => handleSelect(originalIndex)}
                  disabled={rs.hiredCount >= rs.maxHires && app.hired !== true}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <button className={styles.finishBtn} onClick={handleFinish}>
          {hiredList.length > 0 ? "完成招聘" : "跳过招聘"}
        </button>
      </div>
    </div>
  );
}

function ApplicantCard({
  applicant,
  onClick,
  disabled,
}: {
  applicant: RecruitApplicant;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const qc = QUALITY_CONFIG[applicant.quality] ?? QUALITY_CONFIG.common;
  const isHired = applicant.hired === true;
  const isRejected = applicant.hired === false;

  return (
    <button
      className={`${styles.card} ${disabled ? styles.cardDisabled : ""} ${
        isHired ? styles.cardHired : ""
      } ${isRejected ? styles.cardRejected : ""}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        borderColor: qc.color,
        boxShadow: isHired
          ? `0 0 20px rgba(39,174,96,0.3)`
          : isRejected
          ? "none"
          : qc.glow,
      }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardQuality} style={{ color: qc.color }}>
          {qc.label}
        </span>
        <span className={styles.cardEnergy}>⚡{applicant.energy}</span>
      </div>
      <div className={styles.cardName}>
        {applicant.gender === "female" ? "♀ " : "♂ "}
        {applicant.name}
      </div>
      <div className={styles.cardInfo}>
        <span>{applicant.major}</span>
        <span>{applicant.hometown}</span>
      </div>
      <div className={styles.cardTags}>
        <span className={styles.cardTag}>{applicant.hobby}</span>
        <span className={styles.cardTag}>{applicant.specialty}</span>
      </div>
      {isHired && <div className={styles.cardBadge}>已录用</div>}
      {isRejected && <div className={styles.cardBadgeReject}>已拒绝</div>}
    </button>
  );
}
