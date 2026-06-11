// src/components/MiniGame/AssignGame.tsx
import { useState, useEffect } from "react";
import { MiniGameConfig, MiniGameRating } from "../../types/game";
import styles from "./MiniGame.module.css";

interface Task {
  id: number;
  label: string;
  correctZone: number;
}

interface Zone {
  id: number;
  label: string;
}

const ZONES: Zone[] = [
  { id: 0, label: "接待组" },
  { id: 1, label: "后勤组" },
  { id: 2, label: "宣传组" },
  { id: 3, label: "安保组" },
];

const TASK_POOL: Task[] = [
  { id: 1, label: "引导来宾入座", correctZone: 0 },
  { id: 2, label: "分发饮用水", correctZone: 1 },
  { id: 3, label: "拍摄活动照片", correctZone: 2 },
  { id: 4, label: "维护现场秩序", correctZone: 3 },
  { id: 5, label: "签到登记", correctZone: 0 },
  { id: 6, label: "搬桌椅布置场地", correctZone: 1 },
  { id: 7, label: "发公众号推文", correctZone: 2 },
  { id: 8, label: "检查安全隐患", correctZone: 3 },
  { id: 9, label: "翻译外宾对话", correctZone: 0 },
  { id: 10, label: "清点物资数量", correctZone: 1 },
];

interface Props {
  config: MiniGameConfig;
  onComplete: (rating: MiniGameRating) => void;
}

export default function AssignGame({ config, onComplete }: Props) {
  const taskCount = config.taskCount || 6;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const shuffled = [...TASK_POOL].sort(() => Math.random() - 0.5).slice(0, taskCount);
    setTasks(shuffled);
  }, [taskCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          const total = correct + wrong + (currentTask < taskCount ? taskCount - currentTask : 0);
          const accuracy = total > 0 ? correct / total : 0;
          const rating: MiniGameRating = accuracy >= 0.85 ? "S" : accuracy >= 0.6 ? "A" : "B";
          setTimeout(() => onComplete(rating), 500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [correct, wrong, currentTask, taskCount]);

  const handleAssign = (zoneId: number) => {
    if (currentTask >= taskCount) return;
    const task = tasks[currentTask];
    const isCorrect = task.correctZone === zoneId;

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setFeedback(`✅ 正确！"${task.label}" → ${ZONES.find((z) => z.id === zoneId)!.label}`);
    } else {
      setWrong((w) => w + 1);
      setFeedback(
        `❌ 不对。"${task.label}" 应该分配给 ${ZONES.find((z) => z.id === task.correctZone)!.label}`
      );
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentTask((c) => {
        const next = c + 1;
        if (next >= taskCount) {
          setTimeout(() => {
            const total = correct + wrong + 1;
            const accuracy = isCorrect ? (correct + 1) / total : correct / total;
            const rating: MiniGameRating = accuracy >= 0.85 ? "S" : accuracy >= 0.6 ? "A" : "B";
            onComplete(rating);
          }, 400);
        }
        return next;
      });
    }, 800);
  };

  if (tasks.length === 0) return null;

  return (
    <div className={styles.gameContainer}>
      <div className={styles.hud}>
        <span>⏱ {timeLeft}s</span>
        <span>进度: {currentTask}/{taskCount}</span>
        <span>正确: {correct}</span>
      </div>
      <div className={styles.assignArea}>
        <div className={styles.taskCard}>{tasks[currentTask]?.label || "完成!"}</div>
        {feedback && <div className={styles.assignFeedback}>{feedback}</div>}
        <div className={styles.zoneGrid}>
          {ZONES.map((zone) => (
            <button
              key={zone.id}
              className={styles.zoneBtn}
              onClick={() => handleAssign(zone.id)}
              disabled={currentTask >= taskCount}
            >
              {zone.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
