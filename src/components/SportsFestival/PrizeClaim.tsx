// src/components/SportsFestival/PrizeClaim.tsx
import { useGameState } from "../../context/GameContext";
import { PRIZE_DATA } from "../../data/sportsFestival";
import type { MiniGameRating } from "../../types/game";
import styles from "./PrizeClaim.module.css";

interface Props { onClaim: () => void; }

function getRewardText(ratings: Partial<Record<string, MiniGameRating>>): { tier: string; effects: string } {
  const sCount = Object.values(ratings).filter((r) => r === "S").length;
  const saCount = Object.values(ratings).filter((r) => r === "S" || r === "A").length;
  if (sCount >= 5) return { tier: "🏆 全 S 通关！", effects: "组织力 +8 · 魅力值 +5 · 公信力 +5" };
  if (saCount >= 3) return { tier: "🥈 表现优异", effects: "组织力 +4 · 魅力值 +2" };
  return { tier: "🎖️ 顺利完赛", effects: "魅力值 +2" };
}

export default function PrizeClaim({ onClaim }: Props) {
  const state = useGameState();
  const ratings = state.sportsFestival?.gameRatings ?? {};
  const { tier, effects } = getRewardText(ratings);

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.card}>
        <h2 className={styles.title}>🎉 恭喜通关！</h2>
        <p className={styles.subtitle}>你完成了田径运动会的全部5个项目！</p>
        <div className={styles.rewardTier}>{tier}</div>
        <p className={styles.rewardEffects}>{effects}</p>
        <div className={styles.prizes}>
          <div className={styles.prizeItem}>
            <span className={styles.prizeIcon}>{PRIZE_DATA.lotion.icon}</span>
            <h3 className={styles.prizeName}>{PRIZE_DATA.lotion.name}</h3>
            <p className={styles.prizeDesc}>{PRIZE_DATA.lotion.description}</p>
          </div>
          <div className={styles.divider}>+</div>
          <div className={styles.prizeItem}>
            <span className={styles.prizeIcon}>{PRIZE_DATA.mystery.icon}</span>
            <h3 className={styles.prizeName}>{PRIZE_DATA.mystery.name}</h3>
            <p className={styles.prizeDesc}>{PRIZE_DATA.mystery.description}</p>
          </div>
        </div>
        <button className={styles.claimBtn} onClick={onClaim}>
          收下奖品
        </button>
      </div>
    </div>
  );
}
