// src/components/SportsFestival/ArcheryGame.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { MiniGameRating } from "../../types/game";
import styles from "./SportsMiniGame.module.css";

interface Props { onComplete: (rating: MiniGameRating) => void; }

export default function ArcheryGame({ onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(8);
  const [cursorX, setCursorX] = useState(50);
  const [shots, setShots] = useState<number[]>([]);
  const [phase, setPhase] = useState<"aiming" | "result">("aiming");
  const dirRef = useRef(1);

  useEffect(() => {
    if (phase !== "aiming") return;
    const anim = setInterval(() => {
      setCursorX((x) => {
        let nx = x + dirRef.current * 1.2;
        if (nx > 90) { dirRef.current = -1; nx = 90; }
        if (nx < 10) { dirRef.current = 1; nx = 10; }
        return nx;
      });
    }, 30);
    return () => clearInterval(anim);
  }, [phase]);

  useEffect(() => {
    if (phase !== "aiming") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const shoot = useCallback(() => {
    if (phase !== "aiming") return;
    const dist = Math.abs(cursorX - 50);
    setShots((s) => [...s, dist]);
    setPhase("result");
  }, [phase, cursorX]);

  useEffect(() => {
    if (phase !== "result") return;
    const last = shots[shots.length - 1] ?? 50;
    let rating: MiniGameRating;
    if (last < 8) rating = "S";
    else if (last < 20) rating = "A";
    else rating = "B";
    const t = setTimeout(() => onComplete(rating), 1200);
    return () => clearTimeout(t);
  }, [phase, shots, onComplete]);

  return (
    <div className={styles.container} onClick={shoot}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>🎯 点击射箭</span>
        <span>距靶心: {Math.abs(cursorX - 50).toFixed(0)}</span>
      </div>
      <h2 className={styles.gameTitle}>🏹 射箭</h2>
      <div className={styles.archeryArea}>
        <div className={`${styles.target} ${styles.targetOuter}`} />
        <div className={`${styles.target} ${styles.targetMid}`} />
        <div className={`${styles.target} ${styles.targetIn}`} />
        <div className={`${styles.target} ${styles.targetBull}`} />
        <div className={styles.crosshair} style={{ left: `${cursorX}%` }} />
      </div>
      {phase === "result" && (
        <div className={styles.resultOverlay}>
          <div className={styles.resultBadge}>
            {shots[shots.length - 1]! < 8 ? "🎯 S" : shots[shots.length - 1]! < 20 ? "🏹 A" : "💨 B"}
          </div>
          <div className={styles.resultText}>
            偏差 {shots[shots.length - 1]!.toFixed(0)} 像素
          </div>
        </div>
      )}
    </div>
  );
}
