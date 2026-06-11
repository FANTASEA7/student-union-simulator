import { useState } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { Stats } from "../../types/game";
import styles from "./NGPlusScreen.module.css";

const STATS_LIST: { key: keyof Stats; label: string }[] = [
  { key: "organization", label: "组织力" },
  { key: "connections", label: "人脉" },
  { key: "academics", label: "学习力" },
  { key: "charisma", label: "魅力值" },
  { key: "stress", label: "压力" },
  { key: "budget", label: "经费" },
  { key: "volunteerHours", label: "志愿时长" },
];

const SPECIAL_OPTIONS = [
  { id: "npc_keep", label: "保留NPC好感度(50%)", cost: 3 },
  { id: "hidden_dept", label: "解锁隐藏部门\"主席团\"", cost: 5 },
  { id: "rare_card", label: "开局多一张稀有事件卡", cost: 1 },
];

export default function NGPlusScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const points = state.ngPlus.inheritancePoints;

  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [specials, setSpecials] = useState<string[]>([]);

  const usedPoints =
    Object.values(allocations).reduce((a, b) => a + b, 0) +
    specials.reduce((sum, id) => {
      const opt = SPECIAL_OPTIONS.find((o) => o.id === id);
      return sum + (opt?.cost ?? 0);
    }, 0);

  const remaining = points - usedPoints;

  const handleAllocate = (key: string, delta: number) => {
    const current = allocations[key] ?? 0;
    const next = current + delta;
    if (next < 0 || next > 3) return;
    const newAlloc = { ...allocations };
    if (next === 0) {
      delete newAlloc[key];
    } else {
      newAlloc[key] = next;
    }
    // Check if we have enough points
    const newUsed =
      Object.values(newAlloc).reduce((a, b) => a + b, 0) +
      specials.reduce((sum, id) => {
        const opt = SPECIAL_OPTIONS.find((o) => o.id === id);
        return sum + (opt?.cost ?? 0);
      }, 0);
    if (newUsed > points) return;
    setAllocations(newAlloc);
  };

  const toggleSpecial = (id: string) => {
    if (specials.includes(id)) {
      setSpecials(specials.filter((s) => s !== id));
    } else {
      const cost = SPECIAL_OPTIONS.find((o) => o.id === id)?.cost ?? 99;
      if (usedPoints + cost <= points) {
        setSpecials([...specials, id]);
      }
    }
  };

  const handleConfirm = () => {
    const allocationList = Object.entries(allocations).map(([stat, pts]) => ({
      stat: stat as keyof Stats,
      points: pts,
    }));
    dispatch({ type: "APPLY_INHERITANCE", allocations: allocationList, specials });
  };

  const handleSkip = () => {
    dispatch({ type: "START_NGPLUS" });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🔄 二周目 · 继承选择</h2>
      <p className={styles.points}>可分配继承点数: {remaining}</p>

      <div className={styles.section}>
        <h3>📊 属性继承 (每项最多3点, 每点+5)</h3>
        {STATS_LIST.map((stat) => (
          <div key={stat.key} className={styles.statRow}>
            <span className={styles.statLabel}>{stat.label}</span>
            <div className={styles.statControls}>
              <button
                onClick={() => handleAllocate(stat.key, -1)}
                disabled={(allocations[stat.key] ?? 0) <= 0}
              >
                −
              </button>
              <span className={styles.statDots}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={i < (allocations[stat.key] ?? 0) ? styles.dotFilled : styles.dotEmpty}
                  >
                    ●
                  </span>
                ))}
              </span>
              <button
                onClick={() => handleAllocate(stat.key, 1)}
                disabled={(allocations[stat.key] ?? 0) >= 3 || usedPoints >= points}
              >
                ＋
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3>🎁 特殊继承</h3>
        {SPECIAL_OPTIONS.map((opt) => (
          <label key={opt.id} className={styles.specialOption}>
            <input
              type="checkbox"
              checked={specials.includes(opt.id)}
              onChange={() => toggleSpecial(opt.id)}
              disabled={!specials.includes(opt.id) && usedPoints + opt.cost > points}
            />
            {opt.label} — {opt.cost}点
          </label>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.confirmBtn} onClick={handleConfirm}>
          确认开始二周目
        </button>
        <button className={styles.skipBtn} onClick={handleSkip}>
          放弃继承，全新开始
        </button>
      </div>
    </div>
  );
}
