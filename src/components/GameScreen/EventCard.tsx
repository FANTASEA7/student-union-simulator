// src/components/GameScreen/EventCard.tsx
import { useState } from "react";
import { useGameDispatch } from "../../context/GameContext";
import { GameEvent } from "../../types/game";
import { createEventNegotiation } from "../../data/negotiation";
import styles from "./EventCard.module.css";

interface Props {
  event: GameEvent;
}

export default function EventCard({ event }: Props) {
  const dispatch = useGameDispatch();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);

  const handleChoice = (index: number) => {
    const choice = event.choices[index];

    if (event.type === "volunteer" && event.miniGame && choice.effects.length === 0) {
      dispatch({
        type: "START_MINIGAME",
        miniGameType: event.miniGame.type,
        config: event.miniGame.config,
        volunteerEventId: event.id,
      });
      return;
    }

    if (choice.negotiation) {
      const neg = createEventNegotiation({
        ...choice.negotiation,
        returnTo: "game",
      });
      dispatch({ type: "START_NEGOTIATION", negotiation: neg });
      dispatch({
        type: "APPLY_CHOICE",
        effects: [],
        feedback: "",
        flags: choice.setFlags,
        eventId: event.id,
        eventTitle: event.title,
      });
      return;
    }

    setFeedback(choice.feedback);
    setExiting(true);
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
    }, 1200);
  };

  const typeLabels: Record<string, string> = {
    daily: "日常事件",
    department: "部门事件",
    relationship: "人际事件",
    crisis: "危机事件",
    opportunity: "机遇事件",
    volunteer: "志愿服务",
  };

  return (
    <div className={`${styles.card} ${exiting ? styles.cardExit : styles.cardEnter}`}>
      <div className={styles.image}>
        <div className={styles.imagePlaceholder}>
          {event.type === "volunteer"
            ? "❤️"
            : event.type === "crisis"
            ? "⚠️"
            : event.type === "opportunity"
            ? "🌟"
            : "📖"}
        </div>
        <span className={styles.typeBadge}>{typeLabels[event.type]}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.desc}>{event.description}</p>

        {feedback ? (
          <div className={styles.feedback}>{feedback}</div>
        ) : (
          <div className={styles.choices}>
            {event.choices.map((choice, i) => (
              <button
                key={i}
                className={styles.choiceBtn}
                onClick={() => handleChoice(i)}
              >
                <span className={styles.choiceLetter}>
                  {String.fromCharCode(65 + i)}.
                </span>{" "}
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
