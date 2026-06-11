// src/components/GameScreen/TopBar.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import styles from "./TopBar.module.css";

const STAGE_LABELS: Record<string, string> = {
  staff: "干事",
  minister: "部长",
  president: "主席",
};

export default function TopBar() {
  const { playerName, department, stage, week, semester, energy, stats } = useGameState();
  const dispatch = useGameDispatch();
  const dept = DEPARTMENTS.find((d) => d.id === department)!;
  const maxEnergy = 100;
  const energyPct = Math.min(100, Math.max(0, (energy / maxEnergy) * 100));

  const handleEnding = () => {
    dispatch({ type: "SET_ENDING" });
  };

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.logo}>学生会模拟器</span>
        <span className={styles.stageBadge}>{STAGE_LABELS[stage]}</span>
      </div>

      <div className={styles.center}>
        <span className={styles.weekDisplay}>
          第{week}周 · 大{Math.ceil(semester / 2)}
          {semester % 2 === 1 ? "上" : "下"}
        </span>

        <div className={styles.energyWrap}>
          <span className={styles.resourceIcon}>⚡</span>
          <div className={styles.energyBarOuter}>
            <div
              className={styles.energyBarInner}
              style={{ width: `${energyPct}%` }}
            />
          </div>
          <span className={styles.energyText}>{energy}</span>
        </div>

        <span className={styles.moneyDisplay}>
          <span className={styles.resourceIcon}>💰</span>
          ¥{stats.allowance}
        </span>
      </div>

      <div className={styles.right}>
        <span className={styles.playerName}>{playerName}</span>
        <span
          className={styles.deptBadge}
          style={{ backgroundColor: dept.color, color: "#333" }}
        >
          {dept.name}
        </span>
        <button className={styles.endBtn} onClick={handleEnding}>
          结局
        </button>
      </div>
    </div>
  );
}
