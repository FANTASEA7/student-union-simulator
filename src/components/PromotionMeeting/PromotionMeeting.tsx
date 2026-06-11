import { useState, useMemo } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import {
  PROMOTION_QUESTIONS,
  HAMA_PROFILE,
  ZHANGYI_PROFILE,
  type PromotionQuestion,
} from "../../data/promotionQuestions";
import { DEPARTMENTS } from "../../data/departments";
import { GameStage } from "../../types/game";
import styles from "./PromotionMeeting.module.css";

const STAT_LABELS: Record<string, { name: string; color: string }> = {
  organization: { name: "组织力", color: "#27ae60" },
  connections: { name: "人脉", color: "#2980b9" },
  academics: { name: "学习力", color: "#8e44ad" },
  charisma: { name: "魅力值", color: "#e74c3c" },
  stress: { name: "压力", color: "#e67e22" },
  budget: { name: "经费", color: "#2ecc71" },
  volunteerHours: { name: "志愿时长", color: "#1abc9c" },
};

const STAGE_LABELS: Record<GameStage, string> = {
  staff: "干事 → 部长",
  minister: "部长 → 主席",
  president: "主席",
};

export default function PromotionMeeting() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [result, setResult] = useState<"pass" | "fail" | null>(null);

  const dept = DEPARTMENTS.find((d) => d.id === state.department)!;
  const currentQ = PROMOTION_QUESTIONS[currentIdx];
  const speaker = currentQ?.speaker === "hama" ? HAMA_PROFILE : ZHANGYI_PROFILE;

  const maxPossible = PROMOTION_QUESTIONS.length * 2; // 每题最高2分
  const passThreshold = Math.ceil(maxPossible * 0.6); // 60%及格

  const handleAnswer = (choice: (typeof currentQ.choices)[0]) => {
    setFeedbackText(choice.feedback);
    setShowFeedback(true);
    setTotalScore((prev) => prev + choice.score);

    // 应用属性效果
    for (const eff of choice.effects) {
      // effects will be batched at the end
    }
  };

  const handleNext = () => {
    const choice = currentQ.choices.find(
      (c) => c.feedback === feedbackText
    );
    const effects: { stat: any; delta: number }[] = choice?.effects ?? [];

    if (currentIdx < PROMOTION_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
      setShowFeedback(false);
      setFeedbackText("");
      // Apply incremental effects
      if (effects.length > 0) {
        for (const eff of effects) {
          // Apply via a custom dispatch
        }
      }
    } else {
      // All questions answered - determine result
      const finalScore = totalScore + (choice?.score ?? 0);
      const passed = finalScore >= passThreshold;

      // Batch apply all remaining effects
      setResult(passed ? "pass" : "fail");
    }
  };

  const handleFinish = () => {
    if (result === "pass") {
      const nextStage: GameStage =
        state.stage === "staff"
          ? "minister"
          : state.stage === "minister"
          ? "president"
          : state.stage;
      dispatch({ type: "SET_STAGE", stage: nextStage });
      dispatch({ type: "SET_PHASE", phase: "badge_cg" });
    } else {
      // 晋升失败，回游戏继续积累
      dispatch({ type: "SET_PHASE", phase: "game" });
    }
  };

  return (
    <div className={styles.container}>
      {/* 左栏 - 提问者 */}
      <div className={styles.leftPanel}>
        <div
          className={styles.speakerPortrait}
          style={{ borderColor: speaker.color }}
        >
          {speaker.avatar ? (
            <img src={speaker.avatar} alt={speaker.name} className={styles.speakerAvatar} />
          ) : (
            <span className={styles.speakerIcon}>{speaker.icon}</span>
          )}
        </div>
        <div className={styles.speakerName}>{speaker.name}</div>
        <div className={styles.speakerTitle}>{speaker.title}</div>
        <div className={styles.speakerPersona}>"{speaker.personality}"</div>

        {/* 进度 */}
        <div className={styles.progress}>
          {PROMOTION_QUESTIONS.map((q, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${
                i < currentIdx
                  ? styles.dotDone
                  : i === currentIdx && !result
                  ? styles.dotActive
                  : ""
              }`}
            >
              {q.speaker === "hama" ? "哈" : "艺"}
            </div>
          ))}
        </div>
      </div>

      {/* 右栏 - 问答 */}
      <div className={styles.rightPanel}>
        {result === null && !showFeedback && currentQ && (
          <>
            <div className={styles.meetingHeader}>
              <div className={styles.meetingTitle}>晋升选拔大会</div>
              <div className={styles.meetingSub}>
                第 {currentIdx + 1} / {PROMOTION_QUESTIONS.length} 题 ·{" "}
                {speaker.name} 提问
              </div>
            </div>

            <div className={styles.questionBubble}>
              <div className={styles.questionSpeaker}>{speaker.name}:</div>
              <div className={styles.questionText}>{currentQ.question}</div>
            </div>

            <div className={styles.choices}>
              {currentQ.choices.map((choice, i) => (
                <button
                  key={i}
                  className={styles.choiceBtn}
                  onClick={() => handleAnswer(choice)}
                >
                  <span className={styles.choiceLabel}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className={styles.choiceText}>{choice.text}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {showFeedback && !result && (
          <div className={styles.feedbackArea}>
            <div className={styles.feedbackBubble}>
              <div className={styles.feedbackSpeaker}>{speaker.name}:</div>
              <div className={styles.feedbackText}>{feedbackText}</div>
            </div>
            <button className={styles.nextBtn} onClick={handleNext}>
              {currentIdx < PROMOTION_QUESTIONS.length - 1
                ? "下一题 ▶"
                : "查看结果"}
            </button>
          </div>
        )}

        {result !== null && (
          <div
            className={`${styles.resultArea} ${
              result === "pass" ? styles.resultPass : styles.resultFail
            }`}
          >
            <div className={styles.resultIcon}>
              {result === "pass" ? "🎉" : "😞"}
            </div>
            <div className={styles.resultTitle}>
              {result === "pass" ? "晋升通过！" : "晋升暂缓"}
            </div>
            <div className={styles.resultDetail}>
              {result === "pass" ? (
                <>
                  <p>
                    你在 {PROMOTION_QUESTIONS.length}{" "}
                    道刁钻问题中表现出色，赢得了评审团的认可。
                  </p>
                  <p>
                    得分: {totalScore}/{maxPossible} (阈值: {passThreshold})
                  </p>
                  <p className={styles.resultHint}>
                    哈马在离开时嘀咕了一句："还行吧。"
                    <br />
                    张艺拍了拍你的肩膀："别辜负这个机会。"
                  </p>
                </>
              ) : (
                <>
                  <p>
                    很遗憾，你在本次选拔中得分 {totalScore}/{maxPossible}{" "}
                    （需达到 {passThreshold}
                    ）。评审团认为你还需要更多的锻炼。
                  </p>
                  <p className={styles.resultHint}>
                    哈马哼了一声："回去好好想想——到底哪里做得不够。"
                    <br />
                    回到游戏继续积累属性，下次选拔会再次触发。
                  </p>
                </>
              )}
            </div>
            <button className={styles.finishBtn} onClick={handleFinish}>
              {result === "pass" ? "领取工牌 ▶" : "返回游戏"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
