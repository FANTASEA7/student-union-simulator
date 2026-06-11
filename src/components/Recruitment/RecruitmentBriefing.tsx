// src/components/Recruitment/RecruitmentBriefing.tsx
import { useGameDispatch } from "../../context/GameContext";
import styles from "./RecruitmentBriefing.module.css";

export default function RecruitmentBriefing() {
  const dispatch = useGameDispatch();

  const handleStart = () => {
    dispatch({ type: "SET_RECRUIT_PHASE", recruitPhase: "select" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.icon}>🎖️</div>
        <h1 className={styles.title}>军训开始了！</h1>
        <p className={styles.subtitle}>正是招干事的好时机</p>
        <div className={styles.divider} />
        <p className={styles.desc}>
          作为新任部长，你需要组建自己的干事团队。
          <br />
          你将在10份简历中筛选合适的候选人，
          <br />
          通过面试选出最多5位加入你的部门。
        </p>
        <p className={styles.cost}>消耗精力 20</p>
        <button className={styles.startBtn} onClick={handleStart}>
          开始招聘宣讲
        </button>
      </div>
    </div>
  );
}
