import { useGameState } from "../../../context/GameContext";
import { CampusClimate, CampusMood } from "../../../types/game";
import styles from "./SituationBars.module.css";

interface BarDef {
  key: keyof Omit<CampusClimate, "dominantMood">;
  label: string;
  icon: string;
  color: string;
  highIsGood: boolean;
}

const BARS: BarDef[] = [
  { key: "publicTrust", label: "学生会公信力", icon: "🏛️", color: "#27ae60", highIsGood: true },
  { key: "clubSatisfaction", label: "社团满意度", icon: "🎯", color: "#2980b9", highIsGood: true },
  { key: "publicOpinion", label: "舆论热度", icon: "📢", color: "#e67e22", highIsGood: false },
  { key: "schoolPressure", label: "校方压力", icon: "🏫", color: "#e74c3c", highIsGood: false },
];

const MOOD_LABELS: Record<CampusMood, { label: string; icon: string; color: string }> = {
  calm: { label: "风平浪静", icon: "🟢", color: "#27ae60" },
  busy: { label: "忙碌时期", icon: "🟡", color: "#f39c12" },
  tense: { label: "暗流涌动", icon: "🟠", color: "#e67e22" },
  thriving: { label: "繁荣兴旺", icon: "🔵", color: "#2980b9" },
  crisis: { label: "危机四伏", icon: "🔴", color: "#e74c3c" },
};

function getTooltipHint(key: string, value: number): string {
  switch (key) {
    case "publicTrust":
      if (value >= 70) return "学生会深受信任，行动顺利";
      if (value <= 25) return "信任度低：可能出现投诉和抗议事件";
      if (value <= 40) return "信任度偏低：有些同学质疑学生会";
      return "信任度正常";
    case "clubSatisfaction":
      if (value >= 80) return "社团满意度高：可能出现庆祝活动";
      if (value <= 30) return "满意度低：可能出现社团投诉";
      return "满意度正常";
    case "publicOpinion":
      if (value >= 70) return "舆论热度高：可能出现采访和曝光";
      if (value >= 50) return "舆论关注度上升";
      return "舆论平静";
    case "schoolPressure":
      if (value >= 60) return "校方压力大：可能出现预算审计和检查";
      if (value >= 40) return "校方开始关注学生会";
      return "校方压力正常";
    default:
      return "";
  }
}

export default function SituationBars() {
  const { campusClimate } = useGameState();
  const climate = campusClimate ?? {
    publicTrust: 50,
    schoolPressure: 30,
    clubSatisfaction: 50,
    publicOpinion: 40,
    dominantMood: "calm",
  };

  const mood = MOOD_LABELS[climate.dominantMood ?? "calm"];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>校园局势</span>
        <span className={styles.mood} style={{ color: mood.color }}>
          {mood.icon} {mood.label}
        </span>
      </div>

      {BARS.map((bar) => {
        const val = climate[bar.key];
        const pct = val;
        const barColor =
          bar.highIsGood
            ? val >= 55 ? "#27ae60" : val >= 35 ? "#f39c12" : "#e74c3c"
            : val >= 60 ? "#e74c3c" : val >= 35 ? "#f39c12" : "#27ae60";

        return (
          <div key={bar.key} className={styles.barRow} title={getTooltipHint(bar.key, val)}>
            <span className={styles.barIcon}>{bar.icon}</span>
            <span className={styles.barLabel}>{bar.label}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${pct}%`,
                  background: barColor,
                }}
              />
            </div>
            <span className={styles.barVal} style={{ color: barColor }}>
              {val}
            </span>
          </div>
        );
      })}
    </div>
  );
}
