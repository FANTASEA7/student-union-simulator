// src/components/SportsFestival/GameCG.tsx
import { useEffect, useState } from "react";
import { useGameDispatch } from "../../context/GameContext";
import { SportsGameType, MiniGameRating } from "../../types/game";
import { CG_DATA } from "../../data/sportsFestival";
import styles from "./GameCG.module.css";

interface Props {
  game: SportsGameType;
  rating: MiniGameRating;
  completedCount: number;
}

const RATING_LABEL: Record<MiniGameRating, { text: string; color: string }> = {
  S: { text: "完美！", color: "#f0c040" },
  A: { text: "不错！", color: "#5b9bd5" },
  B: { text: "继续加油！", color: "#999" },
};

export default function GameCG({ game, rating, completedCount }: Props) {
  const dispatch = useGameDispatch();
  const [phase, setPhase] = useState<"show" | "stamp" | "done">("show");
  const cg = CG_DATA[game];
  const rl = RATING_LABEL[rating];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("stamp"), 1800);
    const t2 = setTimeout(() => {
      dispatch({ type: "RETURN_SPORTS_WALKING" });
    }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={`${styles.card} ${phase !== "show" ? styles.stampPhase : ""}`}>
        {phase === "show" && (
          <>
            <div className={styles.cgEmoji}>{game === "archery" ? "🏹" : game === "golf" ? "⛳" : game === "tictactoe" ? "❌" : game === "gomoku" ? "♟️" : "🏃"}</div>
            <h2 className={styles.title}>{cg.title}</h2>
            <p className={styles.scene}>{cg.scene}</p>
            <div className={styles.rating} style={{ color: rl.color }}>
              {rl.text} ({rating}级)
            </div>
          </>
        )}
        {phase === "stamp" && (
          <div className={styles.stampContainer}>
            <div className={styles.stampLabel}>印章收集 {completedCount}/5</div>
            <div className={`${styles.stamp} ${styles.stampAnim}`}>
              <span className={styles.stampIcon}>{game === "archery" ? "🎯" : game === "golf" ? "⛳" : game === "tictactoe" ? "✖️" : game === "gomoku" ? "⚫" : "👟"}</span>
              <span className={styles.stampText}>{cg.stampText}</span>
            </div>
            <div className={styles.stampStars}>
              {rating === "S" ? "★★★" : rating === "A" ? "★★☆" : "★☆☆"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
