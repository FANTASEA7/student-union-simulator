// src/components/SportsFestival/GomokuGame.tsx
import { useState, useCallback, useEffect } from "react";
import { MiniGameRating } from "../../types/game";
import styles from "./SportsMiniGame.module.css";

interface Props { onComplete: (rating: MiniGameRating) => void; }

const SIZE = 15;
type Stone = "B" | "W" | null;
type Board = Stone[][];

function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null) as Stone[]);
}

const DIRS = [[1,0],[0,1],[1,1],[1,-1]];

function countLine(b: Board, r: number, c: number, dr: number, dc: number, p: Stone): number {
  let cnt = 0;
  for (let i = 1; i < 5; i++) {
    const nr = r + dr * i, nc = c + dc * i;
    if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && b[nr][nc] === p) cnt++;
    else break;
  }
  return cnt;
}

function checkWinAt(b: Board, r: number, c: number): Stone {
  const p = b[r][c];
  if (!p) return null;
  for (const [dr, dc] of DIRS) {
    const total = 1 + countLine(b, r, c, dr, dc, p) + countLine(b, r, c, -dr, -dc, p);
    if (total >= 5) return p;
  }
  return null;
}

function scorePos(b: Board, r: number, c: number, p: Stone): number {
  if (b[r][c]) return -1;
  let s = 0;
  for (const [dr, dc] of DIRS) {
    const forward = countLine(b, r, c, dr, dc, p);
    const backward = countLine(b, r, c, -dr, -dc, p);
    const total = forward + backward;
    const openF = r + dr * (forward + 1) >= 0 && r + dr * (forward + 1) < SIZE &&
      c + dc * (forward + 1) >= 0 && c + dc * (forward + 1) < SIZE &&
      b[r + dr * (forward + 1)]?.[c + dc * (forward + 1)] === null;
    const openB = r - dr * (backward + 1) >= 0 && r - dr * (backward + 1) < SIZE &&
      c - dc * (backward + 1) >= 0 && c - dc * (backward + 1) < SIZE &&
      b[r - dr * (backward + 1)]?.[c - dc * (backward + 1)] === null;
    const openness = (openF ? 1 : 0) + (openB ? 1 : 0);
    if (total >= 4) s += 1000;
    else if (total === 3) s += openness === 2 ? 120 : 60;
    else if (total === 2) s += openness === 2 ? 30 : 15;
    else if (total === 1) s += openness === 2 ? 8 : 4;
  }
  // Bonus for center proximity
  const centerDist = Math.abs(r - 7) + Math.abs(c - 7);
  s += (14 - centerDist) * 0.5;
  return s;
}

function aiBestMove(b: Board): [number, number] {
  let bestScore = -1, bestR = 7, bestC = 7;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c]) continue;
      const attack = scorePos(b, r, c, "W");
      const defense = scorePos(b, r, c, "B") * 0.9;
      const s = Math.max(attack, defense);
      if (s > bestScore) { bestScore = s; bestR = r; bestC = c; }
    }
  }
  return [bestR, bestC];
}

export default function GomokuGame({ onComplete }: Props) {
  const [board, setBoard] = useState<Board>(emptyBoard());
  const [turn, setTurn] = useState<"B" | "W">("B");
  const [done, setDone] = useState(false);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);

  const end = useCallback((rating: MiniGameRating) => {
    if (done) return;
    setDone(true);
    setTimeout(() => onComplete(rating), 1000);
  }, [done, onComplete]);

  useEffect(() => {
    if (turn !== "W" || done) return;
    const t = setTimeout(() => {
      const [r, c] = aiBestMove(board);
      const nb = board.map((row) => [...row]);
      nb[r][c] = "W";
      setBoard(nb);
      setLastMove([r, c]);
      if (checkWinAt(nb, r, c) === "W") { end("B"); return; }
      setTurn("B");
    }, 300);
    return () => clearTimeout(t);
  }, [turn, board, done, end]);

  const click = (r: number, c: number) => {
    if (turn !== "B" || board[r][c] !== null || done) return;
    const nb = board.map((row) => [...row]);
    nb[r][c] = "B";
    setBoard(nb);
    setLastMove([r, c]);
    if (checkWinAt(nb, r, c) === "B") { end("S"); return; }
    // Check draw
    if (nb.every((row) => row.every((cell) => cell !== null))) { end("A"); return; }
    setTurn("W");
  };

  const isLast = (r: number, c: number) => lastMove && lastMove[0] === r && lastMove[1] === c;

  return (
    <div className={styles.container}>
      <div className={styles.hud}>
        <span>⚫ 你的回合</span>
        <span>{turn === "B" ? "轮到你了" : "AI 思考中..."}</span>
      </div>
      <h2 className={styles.gameTitle}>♟️ 五子棋</h2>
      <div className={styles.gomokuBoard}>
        <div className={styles.gomokuGrid}>
          {Array.from({ length: SIZE * SIZE }, (_, i) => {
            const r = Math.floor(i / SIZE);
            const c = i % SIZE;
            const stone = board[r][c];
            return (
              <button key={i} className={styles.gomokuCell} onClick={() => click(r, c)}>
                {stone && (
                  <span className={`${styles.gomokuStone} ${stone === "B" ? styles.blackStone : styles.whiteStone} ${isLast(r, c) ? "" : ""}`}
                    style={isLast(r, c) ? { boxShadow: "0 0 8px #f0c040, 1px 2px 4px rgba(0,0,0,0.4)" } : {}}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      {done && (
        <div className={styles.resultOverlay}>
          <div className={styles.resultBadge}>
            {board.some((row, r) => row.some((cell, c) => cell === "B" && checkWinAt(board, r, c) === "B")) ? "🏆 S" :
             board.every((row) => row.every((c) => c !== null)) ? "🤝 A" : "😅 B"}
          </div>
          <div className={styles.resultText}>点击继续</div>
        </div>
      )}
    </div>
  );
}
