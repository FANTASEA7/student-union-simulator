import { useState } from "react";
import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { EXPENSE_OPTIONS } from "../../../data/expenseOptions";
import { Stats } from "../../../types/game";
import styles from "./WeekendSpending.module.css";

export default function WeekendSpending() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [selected, setSelected] = useState<string[]>([]);

  const allowance = state.stats.allowance;
  const budget = state.stats.budget;
  const volunteerHours = state.stats.volunteerHours;
  const hasLover = state.datingNPCId !== null;
  const hasMetNPC = state.loveNPCs.some((n) => n.met);

  const availableOptions = EXPENSE_OPTIONS.filter((opt) => {
    if (opt.condition?.hasLover && !hasLover) return false;
    if (opt.condition?.minAffinity && !hasMetNPC) return false;
    if (opt.condition?.maxStats?.stress !== undefined && state.stats.stress > opt.condition.maxStats.stress) return false;
    if (opt.condition?.maxStats?.allowance !== undefined && state.stats.allowance > opt.condition.maxStats.allowance) return false;
    // Check min stats conditions
    if (opt.condition?.minStats) {
      for (const [stat, minVal] of Object.entries(opt.condition.minStats)) {
        if ((state.stats as any)[stat] < minVal) return false;
      }
    }
    // Check affordability based on currency
    const currency = opt.currency ?? "allowance";
    if (currency === "budget" && budget < opt.cost) return false;
    if (currency === "volunteerHours" && volunteerHours < opt.cost) return false;
    if (currency === "allowance" && allowance < opt.cost) return false;
    return true;
  });

  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    }
  };

  const selectedTotal = selected.reduce((sum, id) => {
    const opt = EXPENSE_OPTIONS.find((o) => o.id === id);
    return sum + (opt?.cost ?? 0);
  }, 0);

  const handleConfirm = () => {
    // Group selected options by currency
    const allowanceTotal = selected.reduce((sum, id) => {
      const opt = EXPENSE_OPTIONS.find((o) => o.id === id);
      return sum + ((opt?.currency ?? "allowance") === "allowance" ? (opt?.cost ?? 0) : 0);
    }, 0);
    const budgetTotal = selected.reduce((sum, id) => {
      const opt = EXPENSE_OPTIONS.find((o) => o.id === id);
      return sum + (opt?.currency === "budget" ? (opt?.cost ?? 0) : 0);
    }, 0);
    const volunteerTotal = selected.reduce((sum, id) => {
      const opt = EXPENSE_OPTIONS.find((o) => o.id === id);
      return sum + (opt?.currency === "volunteerHours" ? (opt?.cost ?? 0) : 0);
    }, 0);

    // Dispatch each currency spend separately
    if (allowanceTotal > 0) {
      const allowEffects: { stat: any; delta: number }[] = [];
      for (const id of selected) {
        const opt = EXPENSE_OPTIONS.find((o) => o.id === id);
        if (opt && (opt.currency ?? "allowance") === "allowance") {
          allowEffects.push(...opt.effects);
        }
      }
      dispatch({ type: "SPEND_MONEY", amount: allowanceTotal, effects: allowEffects, currency: "allowance" });
    }
    if (budgetTotal > 0) {
      const budgetEffects: { stat: any; delta: number }[] = [];
      for (const id of selected) {
        const opt = EXPENSE_OPTIONS.find((o) => o.id === id);
        if (opt && opt.currency === "budget") {
          budgetEffects.push(...opt.effects);
        }
      }
      dispatch({ type: "SPEND_MONEY", amount: budgetTotal, effects: budgetEffects, currency: "budget" });
      // Budget investment also shifts chair opinions
      for (const id of selected) {
        const opt = EXPENSE_OPTIONS.find((o) => o.id === id);
        if (opt && opt.currency === "budget" && state.department) {
          dispatch({ type: "SHIFT_CHAIR_OPINION", chair: state.department, delta: 10 });
        }
      }
    }
    if (volunteerTotal > 0) {
      const volEffects: { stat: any; delta: number }[] = [];
      for (const id of selected) {
        const opt = EXPENSE_OPTIONS.find((o) => o.id === id);
        if (opt && opt.currency === "volunteerHours") {
          volEffects.push(...opt.effects);
        }
      }
      dispatch({ type: "SPEND_MONEY", amount: volunteerTotal, effects: volEffects, currency: "volunteerHours" });
    }

    // 消费减压: 每¥10降低1点压力
    const stressReduction = -Math.floor(allowanceTotal / 10);
    const finishChanges: { stat: keyof Stats; delta: number }[] = [];
    if (stressReduction < 0) {
      finishChanges.push({ stat: "stress", delta: stressReduction });
    }
    dispatch({ type: "FINISH_WEEK", statChanges: finishChanges });
  };

  const handleSkip = () => {
    dispatch({ type: "FINISH_WEEK", statChanges: [] });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>💰 周末自由活动</div>
      <div className={styles.balance}>余额: ¥{allowance}</div>
      <div className={styles.options}>
        {availableOptions.map((opt) => {
          const currency = opt.currency ?? "allowance";
          const canAfford = currency === "budget" ? budget >= opt.cost :
                            currency === "volunteerHours" ? volunteerHours >= opt.cost :
                            allowance >= opt.cost;
          const costLabel = currency === "budget" ? `经费 ${opt.cost}` :
                            currency === "volunteerHours" ? `志愿时长 ${opt.cost}h` :
                            `¥${opt.cost}`;
          const isSelected = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              className={`${styles.option} ${!canAfford ? styles.optionDisabled : ""} ${isSelected ? styles.optionSelected : ""}`}
              onClick={() => canAfford && toggleOption(opt.id)}
              disabled={!canAfford && !isSelected}
            >
              <span className={styles.optionIcon}>{opt.icon}</span>
              <div className={styles.optionInfo}>
                <div className={styles.optionLabel}>{opt.label}</div>
                <div className={styles.optionCost}>{costLabel}</div>
                <div className={styles.optionDesc}>{opt.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: 13, color: "#888" }}>
        已选: {selectedTotal > 0 ? `¥${selectedTotal}` : "无"} ({selected.length}/2)
      </div>
      <div className={styles.actions}>
        <button className={styles.skipBtn} onClick={handleSkip}>不消费，省钱</button>
        <button className={styles.confirmBtn} onClick={handleConfirm} disabled={selected.length === 0}>
          确认消费
        </button>
      </div>
    </div>
  );
}
