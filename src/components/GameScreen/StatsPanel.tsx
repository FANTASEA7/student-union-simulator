// src/components/GameScreen/StatsPanel.tsx
import { useGameState } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { getConnectionsTier, getStressTier } from "../../reducer/gameReducer";
import styles from "./StatsPanel.module.css";

interface StatItem {
  key: string;
  label: string;
  color: string;
  max: number;
  suffix?: string;
  desc: string;
}

const STATS: StatItem[] = [
  { key: "organization", label: "组织力", color: "#4a9eda", max: 100, desc: "学生会内部的组织协调能力，影响工作效率和晋升评估。通过工作类活动获取。" },
  { key: "connections", label: "人脉", color: "#45b97c", max: 100, desc: "你在校内的人脉网络，影响社交机会和NPC互动。通过社交活动获取。" },
  { key: "academics", label: "学习力", color: "#e88d3f", max: 100, desc: "学术能力和成绩水平，影响考试排名和评优。通过学习活动获取。" },
  { key: "charisma", label: "魅力值", color: "#a569bd", max: 100, desc: "个人魅力和影响力，影响人际交往和竞选。通过社交和特长活动获取。" },
  { key: "stress", label: "压力", color: "#e0554a", max: 100, desc: "当前承受的压力水平。过高会消耗精力，过低则会缺少动力。通过休息和消费可缓解。" },
  { key: "budget", label: "经费", color: "#f0a830", max: 100, desc: "部门可用经费，用于部门投资和发展项目。通过申请和活动获取。" },
  { key: "volunteerHours", label: "志愿", color: "#e8739a", max: 100, suffix: "h", desc: "累计志愿服务时长，是评选和晋升的重要条件。通过志愿活动获取。" },
];

const STAGE_LABELS: Record<string, string> = {
  staff: "干事",
  minister: "部长",
  president: "主席",
};

export default function StatsPanel() {
  const { playerName, department, stage, stats, energy } = useGameState();
  const dept = DEPARTMENTS.find((d) => d.id === department)!;

  const promo =
    stage === "president"
      ? null
      : stage === "staff"
        ? {
            nextStage: "部长",
            conditions: [
              { label: "组织力", current: stats.organization, target: 40 },
              { label: "魅力值", current: stats.charisma, target: 30 },
              { label: "志愿时长", current: stats.volunteerHours, target: 20 },
            ],
          }
        : {
            nextStage: "主席",
            conditions: [
              { label: "组织力", current: stats.organization, target: 65 },
              { label: "人脉", current: stats.connections, target: 50 },
              { label: "魅力值", current: stats.charisma, target: 50 },
              { label: "志愿时长", current: stats.volunteerHours, target: 50 },
            ],
          };

  return (
    <div className={styles.panel}>
      {/* RPG 角色卡片 */}
      <div className={styles.heroCard}>
        <div className={styles.avatarFrame}>
          <img className={styles.avatarImg} src={`${import.meta.env.BASE_URL}avatar.png`} alt="证件照" />
        </div>
        <div className={styles.playerName}>{playerName}</div>
        <div className={styles.playerTitle}>{STAGE_LABELS[stage]}</div>
        <span
          className={styles.deptTag}
          style={{ backgroundColor: dept.color, color: "#333" }}
        >
          {dept.name}
        </span>
      </div>

      {/* 资源条 */}
      <div className={styles.resourceRow}>
        <div className={styles.resourceCard}>
          <div className={styles.resourceLabel}>⚡ 精力</div>
          <div className={styles.energyValue}>{energy}</div>
        </div>
        <div className={styles.resourceCard}>
          <div className={styles.resourceLabel}>💰 生活费</div>
          <div className={styles.moneyValue}>¥{stats.allowance}</div>
        </div>
      </div>

      {/* 属性网格 */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => {
          const value = stats[s.key as keyof typeof stats];
          return (
            <div key={s.key} className={styles.statItem}>
              <span
                className={styles.statDot}
                style={{ backgroundColor: s.color, color: s.color }}
              />
              <span className={styles.statNum}>
                {value}{s.suffix ?? ""}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.statTooltip}>{s.desc}</span>
            </div>
          );
        })}
      </div>

      {/* 等级徽章 */}
      <div className={styles.tierRow}>
        <span className={styles.tierBadge} style={{ background: "#45b97c22", borderColor: "#45b97c" }}>
          🕸️ {getConnectionsTier(stats.connections).label}
        </span>
        <span
          className={styles.tierBadge}
          style={{
            background:
              stats.stress <= 20 ? "#4a9eda22" :
              stats.stress <= 50 ? "#45b97c22" :
              stats.stress <= 75 ? "#e88d3f22" :
              "#e0554a22",
            borderColor:
              stats.stress <= 20 ? "#4a9eda" :
              stats.stress <= 50 ? "#45b97c" :
              stats.stress <= 75 ? "#e88d3f" :
              "#e0554a",
          }}
        >
          {stats.stress <= 20 ? "😌" : stats.stress <= 50 ? "😐" : stats.stress <= 75 ? "😰" : "🤯"} {getStressTier(stats.stress).label}
        </span>
      </div>

      {/* 晋升条件 */}
      {promo && (
        <div className={styles.promoBox}>
          <div className={styles.promoHeader}>
            ⬆ 晋升{promo.nextStage}条件
          </div>
          {promo.conditions.map((c) => (
            <div key={c.label} className={styles.promoCond}>
              <span className={styles.promoCondLabel}>{c.label}</span>
              <span
                className={
                  c.current >= c.target
                    ? styles.promoCondMet
                    : styles.promoCondUnmet
                }
              >
                {c.current}/{c.target}
                {c.current >= c.target ? " ✓" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
