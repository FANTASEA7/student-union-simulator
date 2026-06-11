// src/components/Recruitment/RecruitmentInterview.tsx
import { useState, useMemo } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { pickQuestions } from "../../data/recruitment";
import type { RecruitQuestion } from "../../data/recruitment";
import type { RecruitApplicant } from "../../types/game";
import styles from "./RecruitmentInterview.module.css";

export default function RecruitmentInterview() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const rs = state.recruitState;

  const [showResume, setShowResume] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<RecruitQuestion[]>([]);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [decision, setDecision] = useState<"pending" | "hired" | "rejected">("pending");
  const [feedback, setFeedback] = useState("");

  if (!rs) return null;

  const applicant = rs.applicants[rs.currentIndex];
  if (!applicant) return null;

  const handleShowResume = () => {
    setShowResume(true);
    setCurrentQuestions(pickQuestions(3));
  };

  const handleAskQuestion = (q: RecruitQuestion) => {
    setCurrentQuestions((prev) => prev.filter((pq) => pq.id !== q.id));
    setQuestionsAsked((n) => n + 1);
    dispatch({ type: "ASK_QUESTION" });
    setFeedback(`你问："${q.text}"\n\n${applicant.name}认真思考后给出了回答。`);
  };

  const handleHire = () => {
    if (rs.hiredCount >= rs.maxHires) return;
    dispatch({ type: "HIRE_APPLICANT" });
    setDecision("hired");
  };

  const handleReject = () => {
    dispatch({ type: "REJECT_APPLICANT" });
    setDecision("rejected");
  };

  const handleNext = () => {
    // Find next unprocessed applicant
    const nextIndex = rs.applicants.findIndex(
      (a, i) => i > rs.currentIndex && a.hired === undefined
    );
    if (nextIndex >= 0) {
      dispatch({ type: "SELECT_APPLICANT", index: nextIndex });
    } else {
      // All done — go back to select view
      dispatch({ type: "SET_RECRUIT_PHASE", recruitPhase: "select" });
    }
    // Reset local state for the watcher
    setShowResume(false);
    setShowTip(false);
    setCurrentQuestions([]);
    setQuestionsAsked(0);
    setDecision("pending");
    setFeedback("");
  };

  const canHire = rs.hiredCount < rs.maxHires;
  const requiredQuestions = 2;

  return (
    <div className={styles.container}>
      {/* 上方：会议室背景条 */}
      <div className={styles.topBar}>
        <span className={styles.topTitle}>🎤 面试现场</span>
        <span className={styles.topInfo}>
          已录用 {rs.hiredCount}/{rs.maxHires} · 当前：{applicant.name}
        </span>
      </div>

      <div className={styles.mainArea}>
        {/* 左：候选人 + 对话框 */}
        <div className={styles.leftPanel}>
          <div className={styles.candidateArea}>
            <button
              className={styles.candidateAvatar}
              onClick={() => setShowTip(!showTip)}
              title="点击查看详细数值"
            >
              <span className={styles.avatarIcon}>
                {applicant.gender === "female" ? "👩" : "👨"}
              </span>
              <span className={styles.avatarHint}>?</span>
            </button>
            {showTip && (
              <div className={styles.tipBox}>
                <button className={styles.tipClose} onClick={() => setShowTip(false)}>✕</button>
                {applicant.tip.split("\n").map((line, i) => (
                  <p key={i} className={styles.tipLine}>{line}</p>
                ))}
              </div>
            )}
            <div className={styles.candidateName}>{applicant.name}</div>
            <div className={styles.candidateQuality} data-quality={applicant.quality}>
              {applicant.quality === "legendary"
                ? "⭐ 传奇"
                : applicant.quality === "epic"
                ? "💎 史诗"
                : applicant.quality === "rare"
                ? "🔷 稀有"
                : "⚪ 普通"}
            </div>
            <div className={styles.candidateEnergy}>精力 ⚡{applicant.energy}</div>
          </div>

          {/* 红色对话框 "查看简历" */}
          {!showResume && decision === "pending" && (
            <button className={styles.resumeBtn} onClick={handleShowResume}>
              📄 查看简历
            </button>
          )}
        </div>

        {/* 右：简历 / 问题 / 反馈 / 决定 */}
        <div className={styles.rightPanel}>
          {/* 简历 */}
          {showResume && decision === "pending" && (
            <div className={styles.resumeCard}>
              <h3 className={styles.resumeTitle}>📋 {applicant.name} 的简历</h3>
              <div className={styles.resumeGrid}>
                <div className={styles.resumeRow}>
                  <span className={styles.resumeLabel}>性别</span>
                  <span>{applicant.gender === "female" ? "女" : "男"}</span>
                </div>
                <div className={styles.resumeRow}>
                  <span className={styles.resumeLabel}>专业</span>
                  <span>{applicant.major}</span>
                </div>
                <div className={styles.resumeRow}>
                  <span className={styles.resumeLabel}>家乡</span>
                  <span>{applicant.hometown}</span>
                </div>
                <div className={styles.resumeRow}>
                  <span className={styles.resumeLabel}>爱好</span>
                  <span>{applicant.hobby}</span>
                </div>
                <div className={styles.resumeRow}>
                  <span className={styles.resumeLabel}>特长</span>
                  <span>{applicant.specialty}</span>
                </div>
                <div className={styles.resumeRow}>
                  <span className={styles.resumeLabel}>座右铭</span>
                  <span className={styles.resumeMotto}>"{applicant.motto}"</span>
                </div>
                <div className={styles.resumeRow}>
                  <span className={styles.resumeLabel}>品质</span>
                  <span className={styles.resumeQuality} data-quality={applicant.quality}>
                    {applicant.quality === "legendary"
                      ? "传奇"
                      : applicant.quality === "epic"
                      ? "史诗"
                      : applicant.quality === "rare"
                      ? "稀有"
                      : "普通"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 面试问题 */}
          {questionsAsked < requiredQuestions && decision === "pending" && showResume && (
            <div className={styles.questionSection}>
              <h4 className={styles.questionTitle}>
                提问 ({questionsAsked + 1}/{requiredQuestions})
              </h4>
              <p className={styles.questionHint}>选择一个你想问的问题：</p>
              <div className={styles.questionList}>
                {currentQuestions.map((q) => (
                  <button
                    key={q.id}
                    className={styles.questionBtn}
                    onClick={() => handleAskQuestion(q)}
                  >
                    <span className={styles.qCategory}>[{q.category}]</span>
                    <span className={styles.qText}>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 反馈 */}
          {feedback && questionsAsked < requiredQuestions && decision === "pending" && (
            <div className={styles.feedbackBox}>
              <p className={styles.feedbackText}>{feedback}</p>
              <button
                className={styles.nextQBtn}
                onClick={() => {
                  setFeedback("");
                  setCurrentQuestions(pickQuestions(3));
                }}
              >
                继续提问 ▶
              </button>
            </div>
          )}

          {/* 决定 */}
          {questionsAsked >= requiredQuestions && decision === "pending" && (
            <div className={styles.decisionSection}>
              <h4 className={styles.decisionTitle}>面试结束 — 你的决定</h4>
              <p className={styles.decisionHint}>
                {applicant.name}已完成{requiredQuestions}个问题的回答。
              </p>
              <div className={styles.decisionBtns}>
                <button
                  className={styles.hireBtn}
                  onClick={handleHire}
                  disabled={!canHire}
                >
                  ✅ 录用 {applicant.name}
                </button>
                <button className={styles.rejectBtn} onClick={handleReject}>
                  ❌ 再考虑一下
                </button>
              </div>
              {!canHire && (
                <p className={styles.maxWarning}>已招满 {rs.maxHires} 人，无法再录用</p>
              )}
            </div>
          )}

          {/* 录用结果 */}
          {decision === "hired" && (
            <div className={styles.resultBox}>
              <div className={styles.resultHired}>
                <span className={styles.resultIcon}>🎉</span>
                <h3 className={styles.resultText}>欢迎加入我们！</h3>
                <p className={styles.resultSub}>
                  {applicant.name} 正式成为你的部门干事！
                </p>
              </div>
              <button className={styles.nextBtn} onClick={handleNext}>
                下一位 ▶
              </button>
            </div>
          )}

          {/* 拒绝结果 */}
          {decision === "rejected" && (
            <div className={styles.resultBox}>
              <div className={styles.resultRejected}>
                <span className={styles.resultIcon}>🤔</span>
                <h3 className={styles.resultText}>我还需要好好考虑一下</h3>
                <p className={styles.resultSub}>
                  你决定暂不录用 {applicant.name}。
                </p>
              </div>
              <button className={styles.nextBtn} onClick={handleNext}>
                下一位 ▶
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
