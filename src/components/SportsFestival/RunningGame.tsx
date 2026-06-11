// src/components/SportsFestival/RunningGame.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { MiniGameRating } from "../../types/game";
import styles from "./SportsMiniGame.module.css";

interface Props { onComplete: (rating: MiniGameRating) => void; }

const TOTAL_TIME = 10;
const TARGET_STEPS = 30;

export default function RunningGame({ onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [steps, setSteps] = useState(0);
  const [lastKey, setLastKey] = useState<"L" | "R" | null>(null);
  const [phase, setPhase] = useState<"running" | "done">("running");
  const keysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (phase !== "running") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setPhase("done"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") return;
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      const isLeft = e.key === "ArrowLeft" || e.key === "a" || e.key === "A";
      const isRight = e.key === "ArrowRight" || e.key === "d" || e.key === "D";
      if (isLeft && lastKey !== "L") {
        setLastKey("L");
        setSteps((s) => s + 1);
      } else if (isRight && lastKey !== "R") {
        setLastKey("R");
        setSteps((s) => s + 1);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [phase, lastKey]);

  useEffect(() => {
    if (phase !== "done") return;
    let rating: MiniGameRating;
    if (steps >= 24) rating = "S";
    else if (steps >= 16) rating = "A";
    else rating = "B";
    const t = setTimeout(() => onComplete(rating), 1200);
    return () => clearTimeout(t);
  }, [phase, steps, onComplete]);

  const progress = Math.min(100, (steps / TARGET_STEPS) * 100);
  const runnerLeft = Math.min(90, (steps / TARGET_STEPS) * 90);

  return (
    <div className={styles.container}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>🏃 步数: {steps}</span>
        <span>目标: {TARGET_STEPS}</span>
      </div>
      <h2 className={styles.gameTitle}>🏃 百米冲刺</h2>
      <div className={styles.runningScene}>
        <div className={styles.runningTrack}>
          <div className={styles.runner} style={{ left: `${runnerLeft}%` }}>🏃‍♂️</div>
          <div className={styles.finishLine} />
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.keyHint}>
          交替按 <span className={lastKey === "R" ? styles.keyPressed : ""}>← / A</span> 和{" "}
          <span className={lastKey === "L" ? styles.keyPressed : ""}>→ / D</span> 加速冲刺！
        </div>
      </div>
      {phase === "done" && (
        <div className={styles.resultOverlay}>
          <div className={styles.resultBadge}>
            {steps >= 24 ? "⚡ S" : steps >= 16 ? "💨 A" : "🏃 B"}
          </div>
          <div className={styles.resultText}>
            {steps} 步 / {TOTAL_TIME}秒
          </div>
        </div>
      )}
    </div>
  );
}
