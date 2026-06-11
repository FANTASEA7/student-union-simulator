import { useState, useMemo } from "react";
import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { ActivityDef, ActivityType, CardRarity } from "../../../types/game";
import { drawCards, getNPCInviteCard } from "../../../data/activities";
import { detectCombos, findPotentialCombos, getComboCategoryColor } from "../../../data/combos";
import styles from "./SchedulePlanner.module.css";

const DAY_LABELS = ["周一", "周二", "周三", "周四", "周五"];

const RARITY_STYLE: Record<CardRarity, { border: string; bg: string; glow: string; label: string }> = {
  common: { border: "#ccc", bg: "#fafaf8", glow: "none", label: "普通" },
  rare: { border: "#5b9bd5", bg: "#e8f0fa", glow: "0 0 6px rgba(91,155,213,0.3)", label: "稀有" },
  epic: { border: "#9b59b6", bg: "#f3eef8", glow: "0 0 12px rgba(155,89,182,0.5)", label: "史诗" },
  legendary: { border: "#f39c12", bg: "linear-gradient(135deg, #fef9e7, #fdebd0)", glow: "0 0 16px rgba(243,156,18,0.6), 0 0 32px rgba(155,89,182,0.3)", label: "传奇" },
};

export default function SchedulePlanner() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [slots, setSlots] = useState<(ActivityDef | null)[]>([null, null, null, null, null]);
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
  const [npcInvite, setNpcInvite] = useState<{ npcId: string; card: ActivityDef } | null>(null);

  // 每进入排课阶段重新抽卡
  const [hand, setHand] = useState<ActivityDef[]>(() => {
    const cards = drawCards(6, state.semesterWeek, state.flags);

    // 随机NPC邀约 (概率随周数增加)
    const npcs = state.loveNPCs.filter((n) => n.met && n.affinity >= 10);
    if (npcs.length > 0 && Math.random() < 0.25 + state.semesterWeek * 0.02) {
      const npc = npcs[Math.floor(Math.random() * npcs.length)];
      const inviteCard = getNPCInviteCard(npc);
      if (inviteCard && cards.length < 10) {
        setNpcInvite({ npcId: npc.id, card: inviteCard });
      }
    }
    return cards;
  });

  const filledCount = slots.filter(Boolean).length;
  const estimatedEnergy = slots.reduce((sum, a) => sum - (a?.energyCost ?? 0), state.energy);

  // 计算combo预览
  const comboPreview = useMemo(() => {
    const detected = detectCombos(slots);
    const potential = filledCount >= 3 && filledCount < 5 ? findPotentialCombos(slots, hand) : [];
    return { detected, potential };
  }, [slots, hand, filledCount]);

  const handleCardClick = (idx: number) => {
    if (selectedCardIdx === idx) {
      setSelectedCardIdx(null);
    } else {
      setSelectedCardIdx(idx);
    }
  };

  const handleSlotClick = (day: number) => {
    // 如果格子已有卡，退回手牌
    if (slots[day]) {
      const newSlots = [...slots];
      const returnedCard = newSlots[day];
      newSlots[day] = null;
      setSlots(newSlots);
      setHand([...hand, returnedCard!]);
      setSelectedCardIdx(null);
      return;
    }
    // 如果有选中的卡，放入格子
    if (selectedCardIdx !== null && hand[selectedCardIdx]) {
      const newSlots = [...slots];
      newSlots[day] = hand[selectedCardIdx];
      setSlots(newSlots);
      // 从手牌移除
      const newHand = hand.filter((_, i) => i !== selectedCardIdx);
      setHand(newHand);
      setSelectedCardIdx(null);
    }
  };

  const handleAcceptInvite = () => {
    if (npcInvite) {
      setHand([...hand, npcInvite.card]);
      setNpcInvite(null);
    }
  };

  const handleDeclineInvite = () => {
    setNpcInvite(null);
  };

  const handleRedraw = () => {
    setHand(drawCards(6, state.semesterWeek, state.flags));
    setSlots([null, null, null, null, null]);
    setSelectedCardIdx(null);
  };

  const handleConfirm = () => {
    if (filledCount < 5) return;
    for (let i = 0; i < 5; i++) {
      if (slots[i]) {
        dispatch({ type: "SET_SCHEDULE_SLOT", day: i, activity: slots[i]! });
      }
    }
    dispatch({ type: "SET_PHASE", phase: "schedule_executing" });
  };

  const handleReset = () => {
    // 把已放的卡退回手牌
    const returned = slots.filter(Boolean) as ActivityDef[];
    setHand([...hand, ...returned]);
    setSlots([null, null, null, null, null]);
    setSelectedCardIdx(null);
  };

  const isEnergyOk = estimatedEnergy >= 0;

  return (
    <div className={styles.container}>
      {/* NPC邀约弹窗 */}
      {npcInvite && (
        <div className={styles.inviteOverlay}>
          <div className={styles.inviteCard}>
            <div className={styles.inviteIcon}>{npcInvite.card.icon}</div>
            <div className={styles.inviteTitle}>邀约！</div>
            <div className={styles.inviteDesc}>{npcInvite.card.description}</div>
            <div className={styles.inviteEffects}>
              {npcInvite.card.statEffects.map((e, i) => (
                <span key={i} className={styles.inviteEffect}>
                  {STAT_NAME[e.stat] ?? e.stat}: +{e.min}~{e.max}
                </span>
              ))}
              <span className={styles.inviteSpecial}>{npcInvite.card.specialEffect?.description}</span>
            </div>
            <div className={styles.inviteActions}>
              <button className={styles.inviteAccept} onClick={handleAcceptInvite}>
                接受邀请
              </button>
              <button className={styles.inviteDecline} onClick={handleDeclineInvite}>
                婉拒
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 标题 */}
      <div className={styles.header}>
        <h2>第 {state.semesterWeek} 周 — 安排课表</h2>
        <span className={styles.energyTag}>当前精力: {state.energy}/100</span>
      </div>

      {/* 五天槽位 */}
      <div className={styles.weekSlots}>
        {DAY_LABELS.map((label, i) => {
          const card = slots[i];
          const style = card ? RARITY_STYLE[card.rarity] : null;
          return (
            <div
              key={i}
              className={`${styles.slot} ${card ? styles.slotFilled : ""} ${selectedCardIdx !== null && !card ? styles.slotTarget : ""}`}
              style={card ? {
                borderColor: style?.border,
                background: style?.bg,
                boxShadow: style?.glow,
              } : undefined}
              onClick={() => handleSlotClick(i)}
            >
              <div className={styles.dayLabel}>{label}</div>
              {card ? (
                <>
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <div className={styles.cardLabel}>{card.label}</div>
                  <div className={styles.cardRarity} style={{ color: style?.border }}>
                    {style?.label}
                  </div>
                  <div className={card.energyCost < 0 ? styles.energyGain : styles.energyCost}>
                    {card.energyCost < 0 ? `+${-card.energyCost}精` : `-${card.energyCost}精`}
                  </div>
                </>
              ) : (
                <div className={styles.emptySlot}>
                  {selectedCardIdx !== null ? "👇 放入" : "空"}
                </div>
              )}
              {card?.specialEffect && (
                <div className={styles.specialBadge}>✨{card.specialEffect.description}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Combo预览 */}
      {(comboPreview.detected.length > 0 || comboPreview.potential.length > 0) && (
        <div className={styles.comboPreview}>
          {comboPreview.detected.map((c, i) => (
            <span
              key={i}
              className={styles.comboBadge}
              style={{ borderColor: getComboCategoryColor("tag") }}
            >
              {c.icon} {c.label} — {c.description}
            </span>
          ))}
          {comboPreview.potential.map((p, i) => (
            <span
              key={`pot-${i}`}
              className={`${styles.comboBadge} ${styles.comboPotential}`}
              title={`需要: ${p.needsTag ?? p.missingCard?.label ?? "?"}`}
            >
              🔒 {p.combo.label} — 缺少: {p.needsTag ?? p.missingCard?.label ?? "?"}
            </span>
          ))}
        </div>
      )}

      {/* 手牌区域 */}
      <div className={styles.handSection}>
        <div className={styles.handTitle}>
          手牌 ({hand.length}张)
          <span className={styles.hint}>点击卡牌选中，再点击上方格子放入</span>
        </div>
        <div className={styles.handCards}>
          {hand.map((card, idx) => {
            const style = RARITY_STYLE[card.rarity];
            const isSelected = selectedCardIdx === idx;
            return (
              <div
                key={`${card.subType}-${idx}`}
                className={`${styles.handCard} ${isSelected ? styles.handCardSelected : ""}`}
                style={{
                  borderColor: style.border,
                  background: style.bg,
                  boxShadow: isSelected ? `0 0 0 3px #C0392B, ${style.glow}` : style.glow,
                }}
                onClick={() => handleCardClick(idx)}
              >
                <div className={styles.handCardIcon}>{card.icon}</div>
                <div className={styles.handCardLabel}>{card.label}</div>
                <div className={styles.handCardDesc}>{card.description}</div>
                <div className={styles.handCardStats}>
                  {card.statEffects.slice(0, 2).map((e, i) => (
                    <span key={i} className={styles.handStat}>
                      {STAT_ICON[e.stat] ?? ""}+{e.min}~{e.max}
                    </span>
                  ))}
                </div>
                <div className={card.energyCost < 0 ? styles.handEnergyGain : styles.handEnergyCost}>
                  {card.energyCost < 0 ? `+${-card.energyCost}` : `-${card.energyCost}`}精
                </div>
                <div className={styles.handRarity} style={{ color: style.border }}>
                  {style.label}
                </div>
                {card.specialEffect && (
                  <div className={styles.handSpecial}>✨</div>
                )}
                <div className={styles.handTags}>
                  {card.tags?.slice(0, 2).map((tag, ti) => (
                    <span key={ti} className={styles.handTag}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
          {hand.length === 0 && (
            <div className={styles.noCards}>手牌已用完，请从格子里退回或重新抽卡</div>
          )}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className={styles.footer}>
        <div className={`${styles.energyPreview} ${!isEnergyOk ? styles.energyLow : ""}`}>
          预计剩余精力: {Math.max(0, estimatedEnergy)}/100
          {!isEnergyOk && " ⚠️ 精力不足！"}
        </div>
        <div className={styles.actions}>
          <button className={styles.confirmBtn} disabled={filledCount < 5} onClick={handleConfirm}>
            确认本周安排 ({filledCount}/5)
          </button>
          <button className={styles.redrawBtn} onClick={handleRedraw}>
            🔄 重新抽卡
          </button>
          <button className={styles.resetBtn} onClick={handleReset}>
            退回全部
          </button>
        </div>
      </div>
    </div>
  );
}

const STAT_NAME: Record<string, string> = {
  organization: "组织力", connections: "人脉", academics: "学习力",
  charisma: "魅力值", stress: "压力", budget: "经费", volunteerHours: "志愿时长",
};

const STAT_ICON: Record<string, string> = {
  organization: "📋", connections: "🤝", academics: "📚",
  charisma: "💬", stress: "🛡️", budget: "💰", volunteerHours: "⏱️",
};
