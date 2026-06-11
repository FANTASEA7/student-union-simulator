// src/components/MiniGame/WhackGame.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { MiniGameConfig, MiniGameRating } from "../../types/game";
import styles from "./MiniGame.module.css";

interface Mole {
  id: number;
  row: number;
  col: number;
  visible: boolean;
}

const MOLE_EMOJI = "🐹";
const GRID_SIZE = 3; // 3x3 grid

interface Props {
  config: MiniGameConfig;
  onComplete: (rating: MiniGameRating) => void;
}

export default function WhackGame({ config, onComplete }: Props) {
  const targetCount = config.targetCount || 20;
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [running, setRunning] = useState(true);
  const spawnTimer = useRef<number>(0);

  const spawnMole = useCallback(() => {
    const id = Date.now();
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    setMoles((prev) => [...prev, { id, row, col, visible: true }]);
    // Auto-hide after random delay
    const hideDelay = 600 + Math.random() * 900;
    setTimeout(() => {
      setMoles((prev) => prev.filter((m) => m.id !== id));
    }, hideDelay);
  }, []);

  useEffect(() => {
    if (!running) return;
    spawnTimer.current = window.setInterval(() => {
      spawnMole();
    }, 800);
    return () => clearInterval(spawnTimer.current);
  }, [running, spawnMole]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          clearInterval(spawnTimer.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!running) {
      const total = score + misses;
      const accuracy = total > 0 ? score / total : 0;
      const targetMet = score >= targetCount;
      let rating: MiniGameRating;
      if (targetMet && accuracy >= 0.8) rating = "S";
      else if (targetMet || accuracy >= 0.6) rating = "A";
      else rating = "B";
      setTimeout(() => onComplete(rating), 500);
    }
  }, [running]);

  const handleWhack = (moleId: number) => {
    if (!running) return;
    setScore((s) => s + 1);
    setMoles((prev) => prev.filter((m) => m.id !== moleId));
  };

  const handleMiss = () => {
    if (!running) return;
    setMisses((m) => m + 1);
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>🎯 击中: {score}</span>
        <span>💨 失误: {misses}</span>
        <span>目标: {targetCount}+</span>
      </div>

      <div className={styles.whackBoard} onClick={handleMiss}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const row = Math.floor(i / GRID_SIZE);
          const col = i % GRID_SIZE;
          const moleHere = moles.find((m) => m.row === row && m.col === col && m.visible);
          return (
            <div key={i} className={styles.whackHole}>
              <div className={styles.holeBg}>🕳️</div>
              {moleHere && (
                <div
                  className={styles.mole}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhack(moleHere.id);
                  }}
                >
                  {MOLE_EMOJI}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
