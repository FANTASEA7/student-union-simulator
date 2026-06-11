// src/components/EndingScreen/EndingScreen.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { ENDINGS } from "../../data/endings";
import styles from "./EndingScreen.module.css";

const STAGE_LABELS: Record<string, string> = {
  staff: "干事",
  minister: "部长",
  president: "主席",
};

export default function EndingScreen() {
  const { playerName, department, stage, stats, endingStats, flags } = useGameState();
  const dispatch = useGameDispatch();
  const dept = DEPARTMENTS.find((d) => d.id === department)!;
  const finalStats = endingStats || stats;

  const handleRestart = () => {
    dispatch({ type: "RESET_GAME" });
  };

  // 张艺坏结局
  if (flags["zhangyi_bad_end"]) {
    const ending = ENDINGS.cheat_expelled;
    return (
      <div className={styles.container}>
        <div className={`${styles.content} ${styles.badEnding}`}>
          <h1 className={styles.endingTitle} style={{ color: "#8b0000" }}>{ending.title}</h1>
          <div className={styles.divider} style={{ borderColor: "#8b0000" }} />
          <p className={styles.endingSubtitle}>{ending.subtitle}</p>
          <p className={styles.endingDesc}>{ending.description}</p>

          <div className={styles.badEndCG}>
            <div className={styles.cgFrame}>
              <div className={styles.cgScene}>
                <div className={styles.cgText}>🚫 处分通知书</div>
                <div className={styles.cgDetail}>
                  查学生张艺在期末考试中利用职务之便获取试题，
                  严重违反校规校纪，给予开除学籍处分。
                </div>
                <div className={styles.cgStamp}>开除</div>
              </div>
            </div>
          </div>

          <div className={styles.buttons}>
            <button className={styles.btnPrimary} onClick={handleRestart}>
              重新开始
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getEndingTitle = (): string => {
    const vals = Object.values(finalStats);
    const avg = vals.reduce((a, b) => a + (typeof b === "number" ? b : 0), 0) / vals.length;
    if (stage === "president") return "登顶之人";
    if (avg >= 70) return "校园风云人物";
    if (avg >= 50) return "稳步前行的学生会成员";
    return "平凡而真实的大学时光";
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.endingTitle}>{getEndingTitle()}</h1>
        <div className={styles.divider} />

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>姓名</span>
            <span>{playerName}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>部门</span>
            <span>{dept.name}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>最高职位</span>
            <span>{STAGE_LABELS[stage]}</span>
          </div>
        </div>

        <h3 className={styles.statsTitle}>最终属性</h3>
        <div className={styles.finalStats}>
          {[
            { label: "组织力", value: finalStats.organization },
            { label: "人脉", value: finalStats.connections },
            { label: "学习力", value: finalStats.academics },
            { label: "魅力值", value: finalStats.charisma },
            { label: "压力", value: finalStats.stress },
            { label: "经费", value: finalStats.budget },
            { label: "志愿时长", value: finalStats.volunteerHours, suffix: "h" },
          ].map((s) => (
            <div key={s.label} className={styles.finalStat}>
              <span>{s.label}</span>
              <span className={styles.finalValue}>
                {s.value}
                {s.suffix || ""}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <button className={styles.btnPrimary} onClick={handleRestart}>
            重新开始
          </button>
        </div>
      </div>
    </div>
  );
}
