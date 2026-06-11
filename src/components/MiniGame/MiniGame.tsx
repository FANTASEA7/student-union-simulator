// src/components/MiniGame/MiniGame.tsx
import { useState } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { MiniGameRating } from "../../types/game";
import { VOLUNTEER_EVENTS } from "../../data/volunteers";
import ClickGame from "./ClickGame";
import MemoryGame from "./MemoryGame";
import AssignGame from "./AssignGame";
import WhackGame from "./WhackGame";
import CatchGame from "./CatchGame";
import styles from "./MiniGame.module.css";

export default function MiniGame() {
  const { activeMiniGame } = useGameState();
  const dispatch = useGameDispatch();
  const [showInvite, setShowInvite] = useState(true);

  if (!activeMiniGame) return null;

  const volunteerEvent = VOLUNTEER_EVENTS.find((e) => e.id === activeMiniGame.volunteerEventId);
  const baseHours = volunteerEvent?.baseHours || 0;
  const volunteerName = volunteerEvent?.volunteerName || "志愿活动";

  const handleComplete = (rating: MiniGameRating, catchScore?: number) => {
    dispatch({
      type: "END_MINIGAME",
      rating,
      baseHours,
      bonusEffects: volunteerEvent?.bonus
        ? (Object.entries(volunteerEvent.bonus)
            .filter(([, v]) => v !== undefined)
            .map(([stat, delta]) => ({ stat: stat as any, delta: delta as number })))
        : [],
      catchScore: catchScore ?? 0,
    });
  };

  const handleAccept = () => {
    setShowInvite(false);
  };

  const handleDecline = () => {
    handleComplete("B");
  };

  if (showInvite) {
    return (
      <div className={styles.inviteOverlay}>
        <div className={styles.inviteCard}>
          <div className={styles.inviteAvatar}>🙋</div>
          <div className={styles.inviteTitle}>{volunteerName}</div>
          <div className={styles.inviteText}>
            要不要玩个小游戏？玩好了能拿到更多志愿时长哦！
          </div>
          <div className={styles.invitePreview}>
            基础时长：{baseHours}h | S级评价可得 {baseHours}h（全额）
          </div>
          <div className={styles.inviteButtons}>
            <button className={styles.inviteAcceptBtn} onClick={handleAccept}>
              🎮 玩玩看！
            </button>
            <button className={styles.inviteDeclineBtn} onClick={handleDecline}>
              算了吧
            </button>
          </div>
          <div className={styles.inviteDeclineHint}>
            放弃游戏只能获得 {(baseHours * 0.4).toFixed(0)}h 志愿时长
          </div>
        </div>
      </div>
    );
  }

  switch (activeMiniGame.type) {
    case "click":
      return <ClickGame config={activeMiniGame.config} onComplete={handleComplete} />;
    case "memory":
      return <MemoryGame config={activeMiniGame.config} onComplete={handleComplete} />;
    case "assign":
      return <AssignGame config={activeMiniGame.config} onComplete={handleComplete} />;
    case "whack":
      return <WhackGame config={activeMiniGame.config} onComplete={handleComplete} />;
    case "catch":
      return <CatchGame config={activeMiniGame.config} onComplete={handleComplete} />;
    default:
      return null;
  }
}
