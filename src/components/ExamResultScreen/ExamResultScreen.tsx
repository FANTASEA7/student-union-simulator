import { useEffect, useState, useMemo } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { generateRanking } from "../../utils/examCalc";
import { CET4_QUESTIONS } from "../../data/examData";
import styles from "./ExamResultScreen.module.css";

const SECTION_META: Record<string, { name: string; icon: string }> = {
  grammar: { name: "语法", icon: "📐" },
  vocabulary: { name: "词汇", icon: "📖" },
  reading: { name: "阅读", icon: "📰" },
  cloze: { name: "完形", icon: "🧩" },
};

const SCORE_EVALUATIONS = [
  { min: 640, label: "卓越", desc: "你的英语水平已经远超同级，大学英语免修非你莫属！", color: "#f39c12" },
  { min: 570, label: "优秀", desc: "实力不俗！拿四级证书基本稳了，保持这个势头。", color: "#27ae60" },
  { min: 500, label: "良好", desc: "中上水平，日常交流和工作够用，继续加油可以冲六级。", color: "#2980b9" },
  { min: 425, label: "合格", desc: "踩线通过也是一种本事。基础还薄弱，多读英文材料巩固。", color: "#8e44ad" },
  { min: 350, label: "差距较小", desc: "差一点就过了，主要是词汇和完形拖了后腿。补考加油！", color: "#e67e22" },
  { min: 0, label: "需努力", desc: "基础还需要大幅提升。建议从背单词开始，每天坚持半小时。", color: "#C0392B" },
];

function CET4Report({ passed, onContinue }: { passed: boolean; onContinue: () => void }) {
  const [showReview, setShowReview] = useState(false);

  const estimatedScores = useMemo(() => {
    const total = passed ? 445 + Math.floor(Math.random() * 175) : 280 + Math.floor(Math.random() * 140);
    return {
      total,
      grammar: passed ? 55 + Math.floor(Math.random() * 35) : 30 + Math.floor(Math.random() * 30),
      vocabulary: passed ? 50 + Math.floor(Math.random() * 40) : 25 + Math.floor(Math.random() * 35),
      reading: passed ? 60 + Math.floor(Math.random() * 35) : 30 + Math.floor(Math.random() * 30),
      cloze: passed ? 50 + Math.floor(Math.random() * 40) : 25 + Math.floor(Math.random() * 30),
    };
  }, [passed]);

  const evalData = SCORE_EVALUATIONS.find((e) => estimatedScores.total >= e.min) ?? SCORE_EVALUATIONS[5];

  return (
    <div className={styles.cet4Container}>
      <div className={styles.cet4Bg} />

      {/* Score hero */}
      <div className={styles.scoreHero}>
        <div className={styles.cet4Label}>CET-4 · 大学英语四级考试</div>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreNumber}>{estimatedScores.total}</span>
          <span className={styles.scoreMax}>/ 710</span>
        </div>
        <div className={`${styles.passBadge} ${passed ? styles.passed : styles.failed}`}>
          {passed ? "✅ 合格" : "❌ 不合格"}
        </div>
        <div className={styles.evalLabel} style={{ color: evalData.color }}>
          {evalData.label}
        </div>
        <div className={styles.evalDesc}>"{evalData.desc}"</div>
      </div>

      {/* Section breakdown */}
      <div className={styles.sectionCard}>
        <h3>📊 各模块得分率</h3>
        <div className={styles.sectionList}>
          {[
            { key: "grammar", score: estimatedScores.grammar, icon: "📐", name: "语法" },
            { key: "vocabulary", score: estimatedScores.vocabulary, icon: "📖", name: "词汇" },
            { key: "reading", score: estimatedScores.reading, icon: "📰", name: "阅读" },
            { key: "cloze", score: estimatedScores.cloze, icon: "🧩", name: "完形" },
          ].map((sec) => (
            <div key={sec.key} className={styles.sectionRow}>
              <span className={styles.sectionIcon}>{sec.icon}</span>
              <span className={styles.sectionName}>{sec.name}</span>
              <div className={styles.sectionBar}>
                <div
                  className={styles.sectionBarFill}
                  style={{
                    width: `${sec.score}%`,
                    background: sec.score >= 70 ? "#27ae60" : sec.score >= 50 ? "#f39c12" : "#e74c3c",
                  }}
                />
              </div>
              <span className={styles.sectionScore}>{sec.score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{passed ? "425+" : "<425"}</span>
          <span className={styles.statLabel}>合格线</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>710</span>
          <span className={styles.statLabel}>满分</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{passed ? `前${Math.floor(30 + Math.random() * 40)}%` : "—"}</span>
          <span className={styles.statLabel}>全校排名</span>
        </div>
      </div>

      {/* Question review toggle */}
      {showReview && (
        <div className={styles.reviewCard}>
          <h3>📝 题库预览</h3>
          <p className={styles.reviewHint}>四级考试共30题题库，随机抽取20题，覆盖四个模块：</p>
          <div className={styles.reviewGrid}>
            {(["grammar", "vocabulary", "reading", "cloze"] as const).map((section) => {
              const questions = CET4_QUESTIONS.filter((q) => q.section === section);
              return (
                <div key={section} className={styles.reviewSection}>
                  <div className={styles.reviewSectionHeader}>
                    {SECTION_META[section].icon} {SECTION_META[section].name}
                    <span className={styles.reviewCount}>{questions.length}题题库</span>
                  </div>
                  <div className={styles.reviewItems}>
                    {questions.slice(0, 4).map((q) => (
                      <div key={q.id} className={styles.reviewItem}>
                        <span className={styles.reviewQ}>{q.stem.slice(0, 28)}...</span>
                        <span className={styles.reviewDiff}>{"⭐".repeat(q.difficulty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button className={styles.reviewToggle} onClick={() => setShowReview(!showReview)}>
        {showReview ? "收起题库预览 ▲" : "查看题库预览 ▼"}
      </button>

      <button className={styles.continueBtn} onClick={onContinue}>
        继续 ▶
      </button>
    </div>
  );
}

export default function ExamResultScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const cet4Passed = state.flags["cet4_passed"] ?? false;
  const cet4Failed = state.flags["cet4_failed"] ?? false;
  const cet4Taken = state.flags["cet4_taken"] ?? false;
  const showCET4Result = (cet4Passed || cet4Failed) && cet4Taken && state.semesterWeek === 14;

  const hasRanking = state.examRankings.length > 0 &&
    state.examRankings[state.examRankings.length - 1].semester === state.semester;

  useEffect(() => {
    if (!hasRanking && !showCET4Result) {
      const ranking = generateRanking(
        state.stats,
        state.playerName,
        state.week,
        state.semester,
        cet4Passed
      );
      dispatch({ type: "ADD_RANKING", ranking });
    }
  }, []);

  const lastRanking = state.examRankings[state.examRankings.length - 1];

  const handleContinue = () => {
    dispatch({ type: "FINISH_WEEK", statChanges: [] });
  };

  if (showCET4Result) {
    return <CET4Report passed={cet4Passed} onContinue={handleContinue} />;
  }

  if (!lastRanking) {
    return <div className={styles.container}><p>计算排名中...</p></div>;
  }

  const maxScore = Math.max(...lastRanking.rankings.map((r) => r.score));
  const rankEmojis: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div className={styles.container}>
      <h2>🏆 第{lastRanking.semester}学期 · 期末综合排名</h2>
      <div className={styles.ranking}>
        <div className={styles.rankList}>
          {lastRanking.rankings.map((entry, i) => {
            const isPlayer = entry.name === state.playerName;
            return (
              <div key={i} className={`${styles.rankItem} ${isPlayer ? styles.rankItemPlayer : ""}`}>
                <span className={`${styles.rankNum} ${i === 0 ? styles.rankGold : i === 1 ? styles.rankSilver : i === 2 ? styles.rankBronze : ""}`}>
                  {rankEmojis[i + 1] ?? i + 1}
                </span>
                <span className={styles.rankName}>
                  {entry.name}{isPlayer ? " (你)" : ""}
                </span>
                <div className={styles.rankBar}>
                  <div className={styles.rankBarFill} style={{ width: `${(entry.score / maxScore) * 100}%` }} />
                </div>
                <span className={styles.rankScore}>{entry.score}分</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.evaluation}>
        排名第{lastRanking.playerRank} · {lastRanking.evaluation}
      </div>
      <button className={styles.continueBtn} onClick={handleContinue}>继续</button>
    </div>
  );
}
