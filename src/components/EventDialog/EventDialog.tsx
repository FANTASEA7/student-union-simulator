import { useState, useEffect, useMemo } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { pickEvent } from "../../utils/eventPicker";
import { DEPARTMENTS } from "../../data/departments";
import { GameEvent } from "../../types/game";
import styles from "./EventDialog.module.css";

const STAT_LABELS: Record<string, { name: string; color: string }> = {
  organization: { name: "组织力", color: "#27ae60" },
  connections: { name: "人脉", color: "#2980b9" },
  academics: { name: "学习力", color: "#8e44ad" },
  charisma: { name: "魅力值", color: "#e74c3c" },
  stress: { name: "压力", color: "#e67e22" },
  budget: { name: "经费", color: "#2ecc71" },
  volunteerHours: { name: "志愿时长", color: "#1abc9c" },
  allowance: { name: "生活费", color: "#f39c12" },
};

const SCENE_BG: Record<string, string> = {
  daily: "linear-gradient(180deg, #2c3e50, #34495e)",
  department: "linear-gradient(180deg, #1a3a2a, #2d5a3e)",
  relationship: "linear-gradient(180deg, #3a1a2a, #5a2d3e)",
  crisis: "linear-gradient(180deg, #3a1a1a, #5a2020)",
  opportunity: "linear-gradient(180deg, #1a2a3a, #2d405a)",
  volunteer: "linear-gradient(180deg, #1a3a2a, #2a5a3a)",
  love: "linear-gradient(180deg, #3a1a2a, #5a2d4a)",
};

export default function EventDialog() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [phase, setPhase] = useState<"narration" | "choices" | "feedback">("narration");
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);

  const event: GameEvent | null = useMemo(() => pickEvent(state), [state.week]);

  useEffect(() => {
    if (!event) {
      dispatch({ type: "SET_PHASE", phase: "game" });
      return;
    }
    const timer = setTimeout(() => setPhase("choices"), 1200);
    return () => clearTimeout(timer);
  }, [event]);

  if (!event) return null;

  const dept = event.department ? DEPARTMENTS.find((d) => d.id === event.department) : null;
  const bgStyle = SCENE_BG[event.type] || SCENE_BG.daily;

  const handleChoice = (index: number) => {
    const choice = event.choices[index];
    setSelectedChoiceIdx(index);
    setFeedbackText(choice.feedback);
    setPhase("feedback");
    setTimeout(() => {
      dispatch({
        type: "APPLY_CHOICE",
        effects: choice.effects,
        feedback: choice.feedback,
        flags: choice.setFlags,
        eventId: event.id,
        eventTitle: event.title,
        meetNpcId: choice.meetNpcId,
      });
      // If this is a volunteer event with a mini-game, start it
      if (event.miniGame) {
        dispatch({
          type: "START_MINIGAME",
          miniGameType: event.miniGame.type,
          config: event.miniGame.config,
          volunteerEventId: event.id,
        });
      }
    }, 2000);
  };

  return (
    <div className={styles.container} style={{ background: bgStyle }}>
      <div className={styles.overlay} />

      {/* 左栏 - 角色立绘 */}
      <div className={styles.leftPanel}>
        {dept ? (
          <>
            <img
              className={styles.portrait}
              src={`/characters/${dept.id}_head.png`}
              alt={dept.headName}
            />
            <div className={styles.charName}>{dept.headName}</div>
            <div className={styles.charRole}>{dept.name}·部长</div>
          </>
        ) : (
          <>
            <div className={styles.genericPortrait}>
              {event.type === "love" ? "💕" :
               event.type === "crisis" ? "⚠️" :
               event.type === "opportunity" ? "🌟" :
               event.type === "volunteer" ? "🎪" :
               event.type === "relationship" ? "👥" : "📋"}
            </div>
            <div className={styles.charName}>
              {event.type === "crisis" ? "紧急状况" :
               event.type === "opportunity" ? "机遇来临" :
               event.type === "love" ? "恋爱事件" :
               event.type === "volunteer" ? "志愿活动" :
               event.type === "relationship" ? "人际交往" : "日常事件"}
            </div>
          </>
        )}
      </div>

      {/* 右栏 - 剧情文本 */}
      <div className={styles.rightPanel}>
        {phase === "narration" && (
          <div className={styles.narrationBox}>
            <div className={styles.eventType}>
              {event.type === "crisis" ? "🔴 危机" :
               event.type === "opportunity" ? "🟡 机遇" :
               event.type === "love" ? "💗 恋爱" :
               event.type === "volunteer" ? "🟢 志愿" :
               event.type === "relationship" ? "🔵 人际" :
               event.type === "department" ? "🟤 部门" : "⚪ 日常"}
            </div>
            <div className={styles.eventTitle}>{event.title}</div>
            <div className={styles.eventDesc}>{event.description}</div>
          </div>
        )}

        {phase === "choices" && (
          <>
            <div className={styles.narrationBoxMini}>
              <div className={styles.eventTitle}>{event.title}</div>
              <div className={styles.eventDesc}>{event.description}</div>
            </div>
            <div className={styles.choices}>
              {event.choices.map((choice, i) => (
                <button
                  key={i}
                  className={styles.choiceBtn}
                  onClick={() => handleChoice(i)}
                >
                  <span className={styles.choiceLabel}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  <span className={styles.choiceText}>{choice.text}</span>
                  <span className={styles.choiceEffects}>
                    {choice.effects.map((eff, j) => (
                      <span
                        key={j}
                        className={eff.delta >= 0 ? styles.effectPos : styles.effectNeg}
                      >
                        {STAT_LABELS[eff.stat]?.name ?? eff.stat} {eff.delta >= 0 ? "+" : ""}{eff.delta}
                      </span>
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {phase === "feedback" && (
          <div className={styles.feedbackBox}>
            {selectedChoiceIdx !== null && (
              <div className={styles.chosenText}>
                "{event.choices[selectedChoiceIdx].text}"
              </div>
            )}
            <div className={styles.feedbackText}>{feedbackText}</div>
            <div className={styles.feedbackEffects}>
              {selectedChoiceIdx !== null && event.choices[selectedChoiceIdx].effects.map((eff, i) => (
                <span
                  key={i}
                  className={`${styles.fxBadge} ${eff.delta >= 0 ? styles.fxPos : styles.fxNeg}`}
                >
                  {STAT_LABELS[eff.stat]?.name ?? eff.stat} {eff.delta >= 0 ? "+" : ""}{eff.delta}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
