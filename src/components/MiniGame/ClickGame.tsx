// src/components/MiniGame/ClickGame.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { MiniGameConfig, MiniGameRating } from "../../types/game";
import styles from "./MiniGame.module.css";

interface Props {
  config: MiniGameConfig;
  onComplete: (rating: MiniGameRating) => void;
}

export default function ClickGame({ config, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<number>(0);

  const moveTarget = useCallback(() => {
    setTargetPos({
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    });
  }, []);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (!running) {
      const total = hits + misses;
      const accuracy = total > 0 ? hits / total : 0;
      const rating: MiniGameRating = accuracy >= 0.85 ? "S" : accuracy >= 0.6 ? "A" : "B";
      setTimeout(() => onComplete(rating), 500);
    }
  }, [running]);

  const handleTarget = () => {
    if (!running) return;
    setHits((h) => h + 1);
    moveTarget();
  };

  const handleMiss = () => {
    if (!running) return;
    setMisses((m) => m + 1);
    moveTarget();
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>命中: {hits}</span>
        <span>失误: {misses}</span>
      </div>
      <div className={styles.playArea} onClick={handleMiss}>
        <div
          className={styles.target}
          style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
          onClick={(e) => {
            e.stopPropagation();
            handleTarget();
          }}
        />
      </div>
    </div>
  );
}
