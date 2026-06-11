// src/components/GameScreen/EventLog.tsx
import { useGameState } from "../../context/GameContext";
import styles from "./EventLog.module.css";

interface Props {
  limit?: number; // 0 = show all, default = 5
  fullPage?: boolean; // true = light theme for center area display
}

export default function EventLog({ limit = 5, fullPage = false }: Props) {
  const { eventLog } = useGameState();
  const recent = [...eventLog].reverse();
  const display = limit > 0 ? recent.slice(0, limit) : recent;

  return (
    <div className={`${styles.log} ${fullPage ? styles.fullPage : ""}`}>
      <h3 className={`${styles.title} ${fullPage ? styles.titleFull : ""}`}>
        📜 近期事件
      </h3>
      {display.length === 0 ? (
        <p className={`${styles.empty} ${fullPage ? styles.emptyFull : ""}`}>
          尚未发生任何事件
        </p>
      ) : (
        display.map((entry, i) => (
          <div key={i} className={`${styles.entry} ${fullPage ? styles.entryFull : ""}`}>
            <span className={styles.week}>第{entry.week}周</span>
            <span className={`${styles.text} ${fullPage ? styles.textFull : ""}`}>
              {entry.title} — {entry.result}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
