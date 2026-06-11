// src/components/SportsFestival/WalkingMap.tsx
import { useEffect, useRef, useCallback } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { BOOTHS } from "../../data/sportsFestival";
import styles from "./WalkingMap.module.css";

const CANVAS_W = 800;
const CANVAS_H = 500;
const PLAYER_SPEED = 3;
const INTERACT_RADIUS = 50;

export default function WalkingMap() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const sf = state.sportsFestival;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const posRef = useRef({ x: sf?.playerX ?? 400, y: sf?.playerY ?? 350 });
  const completed = sf?.completedGames ?? [];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = posRef.current;
    const now = Date.now();

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Sky
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grass field
    ctx.fillStyle = "#6ab04c";
    ctx.fillRect(40, 40, CANVAS_W - 80, CANVAS_H - 80);

    // Track — pixel brick red oval
    ctx.strokeStyle = "#c44d34";
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.ellipse(CANVAS_W / 2, CANVAS_H / 2, 330, 190, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Lane dashes
    ctx.strokeStyle = "#ffffff44";
    ctx.lineWidth = 2;
    ctx.setLineDash([14, 18]);
    ctx.beginPath();
    ctx.ellipse(CANVAS_W / 2, CANVAS_H / 2, 330, 190, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Booths
    for (const booth of BOOTHS) {
      const done = completed.includes(booth.id);
      // Booth body
      ctx.fillStyle = done ? "#4a7c3f" : "#e8b88a";
      ctx.fillRect(booth.x - 28, booth.y - 20, 56, 40);
      ctx.fillStyle = done ? "#3a6c2f" : "#c4885a";
      ctx.fillRect(booth.x - 28, booth.y - 20, 56, 6);
      // Roof
      ctx.fillStyle = done ? "#3a6c2f" : "#a0522d";
      ctx.beginPath();
      ctx.moveTo(booth.x - 34, booth.y - 20);
      ctx.lineTo(booth.x, booth.y - 38);
      ctx.lineTo(booth.x + 34, booth.y - 20);
      ctx.closePath();
      ctx.fill();
      // Checkmark or icon
      ctx.font = done ? "bold 18px sans-serif" : "20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = done ? "#ffd700" : "#fff";
      ctx.fillText(done ? "✓" : booth.icon, booth.x, booth.y + 5);
      // Label
      ctx.font = "12px 'Microsoft YaHei', sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(booth.name, booth.x, booth.y + 46);

      // Glow for nearest incomplete booth
      if (!done) {
        const dx = x - booth.x;
        const dy = y - booth.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < INTERACT_RADIUS) {
          const alpha = 0.35 + 0.25 * Math.sin(now / 300);
          ctx.strokeStyle = `rgba(255,220,80,${alpha})`;
          ctx.lineWidth = 3;
          ctx.strokeRect(booth.x - 32, booth.y - 42, 64, 70);
          ctx.fillStyle = "#fff";
          ctx.font = "bold 14px 'Microsoft YaHei', sans-serif";
          ctx.fillText("按 Enter", booth.x, booth.y - 48);
        }
      }
    }

    // Player sprite
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(x - 6, y - 10, 12, 10);
    ctx.fillStyle = "#ffe0b0";
    ctx.fillRect(x - 4, y - 13, 8, 8);
    ctx.fillStyle = "#333";
    ctx.fillRect(x - 3, y - 11, 2, 2);
    ctx.fillRect(x + 2, y - 11, 2, 2);
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(x - 7, y + 1, 14, 3);
    // Name
    ctx.fillStyle = "#222";
    ctx.font = "11px 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(state.playerName || "你", x, y - 18);
  }, [completed, state.playerName]);

  // Game loop: move + draw
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const keys = keysRef.current;
      let dx = 0, dy = 0;
      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) dx -= 1;
      if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) dx += 1;
      if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) dy -= 1;
      if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) dy += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        let nx = posRef.current.x + (dx / len) * PLAYER_SPEED;
        let ny = posRef.current.y + (dy / len) * PLAYER_SPEED;

        // Clamp to map bounds
        nx = Math.max(20, Math.min(CANVAS_W - 20, nx));
        ny = Math.max(20, Math.min(CANVAS_H - 20, ny));
        posRef.current = { x: nx, y: ny };
      }
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === "Enter") {
        const { x, y } = posRef.current;
        const nearest = BOOTHS.find((b) => {
          if (completed.includes(b.id)) return false;
          return Math.hypot(x - b.x, y - b.y) < INTERACT_RADIUS;
        });
        if (nearest) {
          dispatch({ type: "SELECT_SPORTS_GAME", game: nearest.id, x, y });
        }
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [completed, dispatch]);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className={styles.canvas}
      />
      <div className={styles.hint}>
        ↑↓←→ 或 WASD 移动 · 靠近摊位按 Enter 开始游戏
      </div>
    </div>
  );
}
