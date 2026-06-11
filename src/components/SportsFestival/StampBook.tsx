// src/components/SportsFestival/StampBook.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { BOOTHS, CG_DATA } from "../../data/sportsFestival";
import styles from "./StampBook.module.css";

export default function StampBook() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const sf = state.sportsFestival;
  const completed = sf?.completedGames ?? [];
  const allDone = completed.length >= 5;

  const handleClaim = () => {
    dispatch({ type: "SET_SPORTS_PHASE", phase: "prize" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.book}>
        <div className={styles.bookCover}>
          <h2 className={styles.title}>🏟️ 田径运动会 · 集邮册</h2>
          <p className={styles.subtitle}>
            完成所有5个项目，集齐印章兑换奖品！
          </p>
        </div>
        <div className={styles.stampsGrid}>
          {BOOTHS.map((booth) => {
            const done = completed.includes(booth.id);
            const cg = CG_DATA[booth.id];
            return (
              <div key={booth.id} className={`${styles.stampSlot} ${done ? styles.done : ""}`}>
                {done ? (
                  <div className={styles.stampMark}>
                    <span className={styles.stampMarkIcon}>{booth.icon}</span>
                    <span className={styles.stampMarkText}>{cg.stampText}</span>
                    <div className={styles.stampMarkBorder} />
                  </div>
                ) : (
                  <div className={styles.emptySlot}>
                    <span className={styles.emptyIcon}>{booth.icon}</span>
                    <span className={styles.emptyText}>{booth.name}</span>
                    <div className={styles.dashed}>&nbsp;</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {allDone && (
          <button className={styles.claimBtn} onClick={handleClaim}>
            🎁 集齐了！领取奖品
          </button>
        )}
        {!allDone && (
          <button className={styles.backBtn} onClick={() => dispatch({ type: "RETURN_SPORTS_WALKING" })}>
            ← 继续挑战
          </button>
        )}
      </div>
    </div>
  );
}
