// src/components/WorkBadgeCG/WorkBadgeCG.tsx
import { useState, useEffect } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { GameStage } from "../../types/game";
import styles from "./WorkBadgeCG.module.css";

const STAGE_LABELS: Record<GameStage, string> = {
  staff: "干事",
  minister: "部长",
  president: "主席",
};

const STAGE_MATERIAL: Record<GameStage, string> = {
  staff: "普通白卡纸",
  minister: "哑光覆膜",
  president: "烫金压纹",
};

export default function WorkBadgeCG() {
  const { playerName, department, stage } = useGameState();
  const dispatch = useGameDispatch();
  const [animationPhase, setAnimationPhase] = useState<"enter" | "show">("enter");

  const dept = DEPARTMENTS.find((d) => d.id === department);
  if (!dept) return null;

  useEffect(() => {
    const t1 = setTimeout(() => setAnimationPhase("show"), 800);
    const t2 = setTimeout(() => {
      dispatch({ type: "SET_PHASE", phase: "game" });
      // Jump to appropriate semester based on new stage
      if (stage === "minister") {
        // 干事→部长: 跳到大一下 (week 17 = semester 2)
        dispatch({ type: "ADVANCE_WEEK", weeks: 17 });
      } else if (stage === "president") {
        // 部长→主席: 跳到大二上 (week 33 = semester 3)
        dispatch({ type: "ADVANCE_WEEK", weeks: 33 });
      } else {
        dispatch({ type: "ADVANCE_WEEK" });
      }
    }, 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={`${styles.badge} ${styles[animationPhase]}`}>
        <div className={styles.badgeHeader}>
          <div className={styles.emblem}>NM</div>
          <div>
            <div className={styles.uniName}>牛马大学学生会</div>
            <div className={styles.uniSub}>NIU MA UNIVERSITY STUDENT UNION</div>
          </div>
        </div>

        <div className={styles.badgeBody}>
          <div className={styles.photoSlot}>
            <img
              className={styles.photoImg}
              src={`${import.meta.env.BASE_URL}avatar.png`}
              alt="证件照"
            />
          </div>
          <div className={styles.info}>
            <div className={styles.field}>
              <span className={styles.label}>姓名 / NAME</span>
              <span className={styles.value}>{playerName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>部门 / DEPARTMENT</span>
              <span className={styles.value} style={{ color: "#c0392b" }}>
                {dept.name}
              </span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>职位 / POSITION</span>
              <span className={styles.value} style={{ color: "#27ae60" }}>
                {STAGE_LABELS[stage]}
              </span>
            </div>
            <div className={styles.badgeId}>
              工号: NMU-SU-{String(Date.now()).slice(-7)}
            </div>
          </div>
        </div>

        <div className={styles.badgeFooter}>
          <div>有效期至 {new Date().getFullYear() + 1}年6月</div>
          <div>材质: {STAGE_MATERIAL[stage]} | 牛马大学学生会监制</div>
        </div>
      </div>

      <p className={styles.stageText}>
        {stage === "staff"
          ? "欢迎加入学生会！"
          : stage === "minister"
          ? "恭喜晋升部长！"
          : "恭喜当选主席！"}
      </p>
    </div>
  );
}
