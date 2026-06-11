import { useGameState, useGameDispatch } from "../../context/GameContext";
import { ALL_ACHIEVEMENTS } from "../../data/achievements";
import styles from "./MemoirScreen.module.css";

export default function MemoirScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const previousEndings = state.ngPlus.previousEndings;
  const unlockedAchIds = state.ngPlus.unlockedAchievements;

  const handleBack = () => {
    dispatch({ type: "SET_PHASE", phase: "title" });
  };

  return (
    <div className={styles.container}>
      <h2>📖 回忆录</h2>
      <div className={styles.section}>
        <h3>历史结局</h3>
        {previousEndings.length === 0 ? (
          <p className={styles.empty}>还没有完成过任何结局</p>
        ) : (
          previousEndings.map((entry, i) => (
            <div key={i} className={styles.endingEntry}>
              <span className={styles.weekNum}>第{entry.weekNumber}周目</span>
              <span className={styles.endingTitle}>{entry.ending.title}</span>
              <span className={styles.endingDate}>{entry.date}</span>
            </div>
          ))
        )}
      </div>
      <div className={styles.section}>
        <h3>
          已解锁成就 ({unlockedAchIds.length}/{ALL_ACHIEVEMENTS.length})
        </h3>
        <div className={styles.achievementGrid}>
          {ALL_ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedAchIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`${styles.achievementItem} ${!unlocked ? styles.locked : ""}`}
              >
                <span className={styles.achievementIcon}>
                  {unlocked ? ach.icon : "🔒"}
                </span>
                <span className={styles.achievementName}>{ach.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      <button className={styles.backBtn} onClick={handleBack}>
        返回标题
      </button>
    </div>
  );
}
