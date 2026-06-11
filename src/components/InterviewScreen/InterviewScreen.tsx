// src/components/InterviewScreen/InterviewScreen.tsx
import { useState } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { INTERVIEWS } from "../../data/interviews";
import { Department } from "../../types/game";
import styles from "./InterviewScreen.module.css";

export default function InterviewScreen() {
  const { department, currentInterviewIndex } = useGameState();
  const dispatch = useGameDispatch();
  const [feedback, setFeedback] = useState<string | null>(null);

  const dept = DEPARTMENTS.find((d) => d.id === department)!;
  const questions = INTERVIEWS[department as Exclude<Department, null>] || [];
  const currentQ = questions[currentInterviewIndex];

  if (!currentQ) {
    dispatch({ type: "SET_PHASE", phase: "badge_cg" });
    return null;
  }

  const handleChoice = (index: number) => {
    const choice = currentQ.choices[index];
    setFeedback(choice.feedback);
    setTimeout(() => {
      setFeedback(null);
      dispatch({ type: "ANSWER_INTERVIEW", effects: choice.effects });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <img
          className={styles.portrait}
          src={`${import.meta.env.BASE_URL}characters/${department}_head.png`}
          alt={dept.headName}
        />
        <div className={styles.headName}>{dept.headName}</div>
        <div className={styles.headRole}>{dept.name} · 部长</div>
        <div className={styles.headTagline}>"{dept.headTagline}"</div>
      </div>

      <div className={styles.rightPanel}>
        {feedback ? (
          <div className={styles.feedback}>{feedback}</div>
        ) : (
          <>
            <div className={styles.questionBubble}>
              <div className={styles.questionNum}>
                问题 {currentInterviewIndex + 1}/2
              </div>
              <div className={styles.questionText}>{currentQ.question}</div>
            </div>
            <div className={styles.choices}>
              {currentQ.choices.map((c, i) => (
                <button
                  key={i}
                  className={styles.choiceBtn}
                  onClick={() => handleChoice(i)}
                >
                  <span className={styles.choiceLabel}>
                    {String.fromCharCode(65 + i)}.
                  </span>{" "}
                  {c.text}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
