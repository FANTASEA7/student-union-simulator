// src/components/SportsFestival/TicTacToeGame.tsx
import { useState, useCallback, useEffect } from "react";
import { MiniGameRating } from "../../types/game";
import styles from "./SportsMiniGame.module.css";

interface Props { onComplete: (rating: MiniGameRating) => void; }

type Cell = "X" | "O" | null;
type Board = Cell[];

function checkWin(b: Board, p: "X" | "O"): boolean {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return lines.some(([a, c, d]) => b[a] === p && b[c] === p && b[d] === p);
}

function aiMove(b: Board): number {
  // Win
  for (let i = 0; i < 9; i++) {
    if (!b[i]) { const nb = [...b]; nb[i] = "O"; if (checkWin(nb, "O")) return i; }
  }
  // Block
  for (let i = 0; i < 9; i++) {
    if (!b[i]) { const nb = [...b]; nb[i] = "X"; if (checkWin(nb, "X")) return i; }
  }
  // Center
  if (!b[4]) return 4;
  // Corner
  for (const c of [0, 2, 6, 8]) { if (!b[c]) return c; }
  // Any
  for (let i = 0; i < 9; i++) { if (!b[i]) return i; }
  return -1;
}

export default function TicTacToeGame({ onComplete }: Props) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [done, setDone] = useState(false);

  const end = useCallback((rating: MiniGameRating) => {
    if (done) return;
    setDone(true);
    setTimeout(() => onComplete(rating), 1000);
  }, [done, onComplete]);

  // AI move
  useEffect(() => {
    if (turn !== "O" || done) return;
    const t = setTimeout(() => {
      const idx = aiMove(board);
      if (idx < 0) { end("A"); return; }
      const nb = [...board];
      nb[idx] = "O";
      setBoard(nb);
      if (checkWin(nb, "O")) { end("B"); return; }
      if (nb.every((c) => c !== null)) { end("A"); return; }
      setTurn("X");
    }, 400);
    return () => clearTimeout(t);
  }, [turn, board, done, end]);

  const click = (i: number) => {
    if (turn !== "X" || board[i] !== null || done) return;
    const nb = [...board];
    nb[i] = "X";
    setBoard(nb);
    if (checkWin(nb, "X")) { end("S"); return; }
    if (nb.every((c) => c !== null)) { end("A"); return; }
    setTurn("O");
  };

  return (
    <div className={styles.container}>
      <div className={styles.hud}>
        <span>❌ 你的回合</span>
        <span>{turn === "X" ? "轮到你了" : "AI 思考中..."}</span>
      </div>
      <h2 className={styles.gameTitle}>❌ 井字棋</h2>
      <div className={styles.board3}>
        {board.map((c, i) => (
          <button key={i} className={styles.cell3} onClick={() => click(i)}>
            {c === "X" ? "❌" : c === "O" ? "⭕" : ""}
          </button>
        ))}
      </div>
      {done && (
        <div className={styles.resultOverlay}>
          <div className={styles.resultBadge}>
            {checkWin(board, "X") ? "🏆 S" : board.every((c) => c !== null) ? "🤝 A" : "😅 B"}
          </div>
          <div className={styles.resultText}>点击继续</div>
        </div>
      )}
    </div>
  );
}
