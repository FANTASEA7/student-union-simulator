// src/components/MiniGame/CatchGame.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { MiniGameConfig, MiniGameRating } from "../../types/game";
import styles from "./MiniGame.module.css";

interface FallingItem {
  id: number;
  x: number;       // 0-100 %
  type: "star" | "bomb";
  speed: number;   // animation duration in ms
}

const STAR_EMOJI = "⭐";
const BOMB_EMOJI = "💣";

interface Props {
  config: MiniGameConfig;
  onComplete: (rating: MiniGameRating, catchScore?: number) => void;
}

export default function CatchGame({ config, onComplete }: Props) {
  const targetCount = config.targetCount || 15;
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [score, setScore] = useState(0);
  const [missedStars, setMissedStars] = useState(0);
  const [basketPos, setBasketPos] = useState(50); // 0-100%
  const basketPosRef = useRef(basketPos);
  basketPosRef.current = basketPos;
  const [items, setItems] = useState<FallingItem[]>([]);
  const [running, setRunning] = useState(true);
  const [hitBomb, setHitBomb] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const spawnTimer = useRef<number>(0);

  const spawnItem = useCallback(() => {
    const isBomb = Math.random() < 0.2; // 20% chance of bomb
    const item: FallingItem = {
      id: Date.now(),
      x: 5 + Math.random() * 90,
      type: isBomb ? "bomb" : "star",
      speed: 2000 + Math.random() * 2000,
    };
    setItems((prev) => [...prev, item]);
    // Remove item after it falls
    setTimeout(() => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing && existing.type === "star") {
          setMissedStars((ms) => ms + 1);
        }
        return prev.filter((i) => i.id !== item.id);
      });
    }, item.speed);
  }, []);

  useEffect(() => {
    if (!running) return;
    spawnTimer.current = window.setInterval(() => {
      spawnItem();
    }, 900);
    return () => clearInterval(spawnTimer.current);
  }, [running, spawnItem]);

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
      const totalStars = score + missedStars;
      const accuracy = totalStars > 0 ? score / totalStars : 0;
      const targetMet = score >= targetCount;
      let rating: MiniGameRating;
      if (hitBomb) {
        rating = "B"; // Hit a bomb = max B
      } else if (targetMet && accuracy >= 0.8) {
        rating = "S";
      } else if (targetMet || accuracy >= 0.55) {
        rating = "A";
      } else {
        rating = "B";
      }
      setTimeout(() => onComplete(rating, score), 500);
    }
  }, [running]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!running) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        setBasketPos((p) => Math.max(5, p - 12));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setBasketPos((p) => Math.min(95, p + 12));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running]);

  const handleBoardMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!running || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    setBasketPos(Math.max(5, Math.min(95, xPercent)));
  };

  const handleCatch = (itemId: number, type: "star" | "bomb") => {
    if (!running) return;
    if (type === "star") {
      setScore((s) => s + 1);
    } else {
      setHitBomb(true);
      setScore((s) => Math.max(0, s - 2)); // Penalty
    }
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>⭐ 接住: {score}</span>
        <span>💨 漏掉: {missedStars}</span>
        <span>🎯 目标: {targetCount}+</span>
      </div>

      <div
        ref={boardRef}
        className={styles.catchBoard}
        onMouseMove={handleBoardMove}
        onTouchMove={handleBoardMove}
      >
        {/* Falling items */}
        {items.map((item) => (
          <div
            key={item.id}
            className={`${styles.fallingItem} ${item.type === "bomb" ? styles.bombItem : styles.starItem}`}
            style={{
              left: `${item.x}%`,
              animationDuration: `${item.speed}ms`,
            }}
          >
            {item.type === "star" ? STAR_EMOJI : BOMB_EMOJI}
          </div>
        ))}

        {/* Basket */}
        <div className={styles.basket} style={{ left: `${basketPos}%` }}>
          <div className={styles.basketEmoji}>🧺</div>
        </div>

        {/* Catch zone — catches items that fall into it */}
        <div
          className={styles.catchZone}
          style={{ left: `${basketPos - 6}%`, width: "12%" }}
          onClick={() => {
            if (!running) return;
            const pos = basketPosRef.current;
            const catchLeft = pos - 6;
            const catchRight = pos + 6;
            const inRange = items.filter(
              (item) => item.x >= catchLeft && item.x <= catchRight
            );
            if (inRange.length === 0) return;
            // Prefer stars over bombs
            const star = inRange.find((i) => i.type === "star");
            if (star) {
              handleCatch(star.id, star.type);
            } else {
              // Only bombs in range — catch the first one
              handleCatch(inRange[0].id, inRange[0].type);
            }
          }}
        >
          {/* Visual indicator that items are in range */}
          {items.filter((item) => {
            const pos = basketPosRef.current;
            const catchLeft = pos - 6;
            const catchRight = pos + 6;
            return item.x >= catchLeft && item.x <= catchRight;
          }).length > 0 && (
            <div className={styles.catchIndicator} />
          )}
        </div>
      </div>

      <div className={styles.catchHint}>
        ← 鼠标/手指移动 →  | 或 A/D 键盘移动
      </div>
    </div>
  );
}
