// src/components/SportsFestival/GolfGame.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { MiniGameRating } from "../../types/game";
import styles from "./SportsMiniGame.module.css";

interface Props { onComplete: (rating: MiniGameRating) => void; }

const PERFECT_MIN = 44;
const PERFECT_MAX = 56;
const GOOD_MIN = 28;
const GOOD_MAX = 72;

export default function GolfGame({ onComplete }: Props) {
  const [power, setPower] = useState(0);
  const [phase, setPhase] = useState<"swinging" | "flying" | "done">("swinging");
  const [ballX, setBallX] = useState(60);
  const dirRef = useRef(1);

  useEffect(() => {
    if (phase !== "swinging") return;
    const anim = setInterval(() => {
      setPower((p) => {
        let np = p + dirRef.current * 2;
        if (np >= 100) { dirRef.current = -1; np = 100; }
        if (np <= 0) { dirRef.current = 1; np = 0; }
        return np;
      });
    }, 20);
    return () => clearInterval(anim);
  }, [phase]);

  const swing = useCallback(() => {
    if (phase !== "swinging") return;
    setPhase("flying");
    let rating: MiniGameRating;
    if (power >= PERFECT_MIN && power <= PERFECT_MAX) rating = "S";
    else if (power >= GOOD_MIN && power <= GOOD_MAX) rating = "A";
    else rating = "B";
    // Calc ball flight
    const target = rating === "S" ? 560 : rating === "A" ? 420 + Math.random() * 80 : 250 + Math.random() * 120;
    setBallX(target);
    setTimeout(() => onComplete(rating), 1200);
  }, [phase, power, onComplete]);

  return (
    <div className={styles.container} onClick={swing}>
      <div className={styles.hud}>
        <span>⛳ 点击挥杆</span>
        <span>力度: {power}%</span>
        <span>🏌️</span>
      </div>
      <h2 className={styles.gameTitle}>⛳ 迷你高尔夫</h2>
      <div className={styles.golfScene}>
        <div className={styles.golfField}>
          <div className={styles.golfBall} style={{ left: `${ballX}px` }}>⚪</div>
          <div className={styles.golfFlag}>🚩</div>
        </div>
        <div className={styles.powerBar}>
          <div className={styles.powerFill} style={{ width: `${power}%` }} />
          <div className={styles.powerMarker} style={{ left: "50%" }} />
          <div className={styles.powerMarker} style={{ left: "28%", opacity: 0.4 }} />
          <div className={styles.powerMarker} style={{ left: "72%", opacity: 0.4 }} />
        </div>
        <div className={styles.powerLabel}>完美区间 44%-56%</div>
      </div>
      {phase === "flying" && (
        <div className={styles.resultOverlay}>
          <div className={styles.resultBadge}>
            {power >= PERFECT_MIN && power <= PERFECT_MAX ? "🏆 S" : power >= GOOD_MIN && power <= GOOD_MAX ? "👏 A" : "🤔 B"}
          </div>
          <div className={styles.resultText}>力度 {power}%</div>
        </div>
      )}
    </div>
  );
}
