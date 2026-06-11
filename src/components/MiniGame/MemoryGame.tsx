// src/components/MiniGame/MemoryGame.tsx
import { useState, useEffect, useRef } from "react";
import { MiniGameConfig, MiniGameRating } from "../../types/game";
import styles from "./MiniGame.module.css";

interface Card {
  id: number;
  pairId: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ["🌸", "⭐", "🎈", "🎵", "🌈", "🍀", "💎", "🔥", "🎯", "🦊"];

interface Props {
  config: MiniGameConfig;
  onComplete: (rating: MiniGameRating) => void;
}

export default function MemoryGame({ config, onComplete }: Props) {
  const pairCount = config.pairCount || 6;
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const gameOverRef = useRef(false);

  useEffect(() => {
    const pairs = EMOJIS.slice(0, pairCount);
    const deck: Card[] = [];
    pairs.forEach((emoji, i) => {
      deck.push({ id: i * 2, pairId: i, emoji, flipped: false, matched: false });
      deck.push({ id: i * 2 + 1, pairId: i, emoji, flipped: false, matched: false });
    });
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
  }, [pairCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          if (!gameOverRef.current) {
            gameOverRef.current = true;
            const minMoves = pairCount;
            const rating: MiniGameRating =
              moves <= minMoves + 4 ? "S" : moves <= minMoves + 8 ? "A" : "B";
            setTimeout(() => onComplete(rating), 500);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [moves, pairCount]);

  const handleFlip = (id: number) => {
    if (locked || timeLeft <= 0) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      const c1 = cards.find((c) => c.id === first)!;
      const c2 = cards.find((c) => c.id === second)!;

      if (c1.pairId === c2.pairId) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          )
        );
        setMatched((m) => {
          const newM = m + 1;
          if (newM >= pairCount && !gameOverRef.current) {
            gameOverRef.current = true;
            const minMoves = pairCount;
            const totalMoves = moves + 1;
            const rating: MiniGameRating =
              totalMoves <= minMoves + 4 ? "S" : totalMoves <= minMoves + 8 ? "A" : "B";
            setTimeout(() => onComplete(rating), 500);
          }
          return newM;
        });
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, flipped: false } : c
            )
          );
          setFlipped([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  const cols = Math.ceil(Math.sqrt(pairCount * 2));

  return (
    <div className={styles.gameContainer}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>步数: {moves}</span>
        <span>配对: {matched}/{pairCount}</span>
      </div>
      <div
        className={styles.memoryGrid}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.memoryCard} ${card.flipped || card.matched ? styles.flipped : ""}`}
            onClick={() => handleFlip(card.id)}
          >
            <span>{card.flipped || card.matched ? card.emoji : "?"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
