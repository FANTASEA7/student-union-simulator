import { useState, useMemo } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import styles from "./LoveConfessScreen.module.css";

function getCharismaTierLabel(charisma: number): { label: string; bonus: number } {
  if (charisma >= 70) return { label: "万众瞩目", bonus: 0.20 };
  if (charisma >= 40) return { label: "颇具魅力", bonus: 0.12 };
  if (charisma >= 15) return { label: "正常", bonus: 0.05 };
  return { label: "不善交际", bonus: -0.10 };
}

function calcSuccessRate(
  affinity: number,
  charisma: number,
  inventoryItemIds: string[],
): { rate: number; parts: { label: string; value: string }[] } {
  const baseRate = Math.min(0.88, Math.max(0.05, 0.20 + (affinity - 50) * 0.017));
  const cha = getCharismaTierLabel(charisma);
  let itemBonus = 0;
  const itemLabels: string[] = [];
  if (inventoryItemIds.includes("obsidian_ring")) {
    itemBonus += 0.10;
    itemLabels.push("黑曜石戒指 +10%");
  }
  if (inventoryItemIds.includes("love_letter_kit")) {
    itemBonus += 0.08;
    itemLabels.push("情书套装 +8%");
  }
  const rate = Math.min(0.95, Math.max(0.05, baseRate + cha.bonus + itemBonus));
  const parts = [
    { label: "好感基础", value: `${Math.round(baseRate * 100)}%` },
    { label: `魅力${cha.label}`, value: `${cha.bonus >= 0 ? '+' : ''}${Math.round(cha.bonus * 100)}%` },
  ];
  for (const il of itemLabels) {
    parts.push({ label: il.replace(/ [+-]\d+%$/, ''), value: il.match(/[+-]\d+%/)![0] });
  }
  return { rate, parts };
}

export default function LoveConfessScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [confessing, setConfessing] = useState(false);

  const confessKey = Object.keys(state.flags).find((k) => k.startsWith("confessing_to_"));
  const npcId = confessKey ? confessKey.slice("confessing_to_".length) : undefined;
  const npc = state.loveNPCs.find((n) => n.id === npcId);

  const inventoryItemIds = useMemo(() => state.inventory.map((i) => i.itemId), [state.inventory]);

  if (!npc) {
    dispatch({ type: "SET_PHASE", phase: "game" });
    return null;
  }

  const { rate: successRate, parts } = calcSuccessRate(npc.affinity, state.stats.charisma, inventoryItemIds);

  const handleConfess = () => {
    if (confessing) return;
    setConfessing(true);
    const success = Math.random() < successRate;
    dispatch({ type: "CONFESS_RESULT", npcId: npc.id, success });
  };

  const handleBack = () => {
    dispatch({ type: "SET_PHASE", phase: "game" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.npcName}>💌 {npc.name}</div>
      <div className={styles.npcInfo}>
        {npc.gender === "male" ? "男" : "女"} · {npc.appearance} · {npc.hobby}
      </div>
      <div className={styles.affinity}>
        好感度: {npc.affinity}%
        <div className={styles.affinityBar}>
          <div className={styles.affinityBarFill} style={{ width: `${npc.affinity}%` }} />
        </div>
      </div>

      <div className={styles.dialogue}>"{npc.dialogues.confess}"</div>
      <div className={styles.rateBreakdown}>
        <div className={styles.rateMain}>成功率 {Math.round(successRate * 100)}%</div>
        <div className={styles.rateParts}>
          {parts.map((p, i) => (
            <span key={i} className={styles.ratePart}>
              {p.label} <span className={p.value.startsWith('+') ? styles.positive : p.value.startsWith('-') ? styles.negative : ''}>{p.value}</span>
            </span>
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.confessBtn} onClick={handleConfess} disabled={confessing}>
          {confessing ? "..." : "表白"}
        </button>
        <button className={styles.backBtn} onClick={handleBack}>
          再想想
        </button>
      </div>
    </div>
  );
}
