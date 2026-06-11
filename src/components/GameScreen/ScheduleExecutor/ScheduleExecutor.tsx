import { useState, useEffect, useMemo, useRef } from "react";
import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { Stats, ActivityType, ActivityDef, WeeklyCombo } from "../../../types/game";
import { pickInterruptEvent, InterruptEvent } from "../../../data/interruptEvents";
import { VOLUNTEER_EVENTS } from "../../../data/volunteers";
import { getStressTier, getCharismaMultiplier, getConnectionsTier } from "../../../reducer/gameReducer";
import { detectCombos, getComboCategoryColor } from "../../../data/combos";
import styles from "./ScheduleExecutor.module.css";

const DAY_LABELS = ["周一", "周二", "周三", "周四", "周五"];

function randomInRange(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** 计算相邻同类型活动的combo加成 */
function calcComboBonus(slots: (ActivityDef | null)[], currentDay: number): { type: ActivityType; count: number; bonusStats: { stat: keyof Stats; delta: number }[] } | null {
  const current = slots[currentDay];
  if (!current || current.type === "rest") return null;

  // 向前找连续同类型
  let count = 1;
  for (let i = currentDay - 1; i >= 0; i--) {
    if (slots[i]?.type === current.type) count++;
    else break;
  }
  // 向后找
  for (let i = currentDay + 1; i < 5; i++) {
    if (slots[i]?.type === current.type) count++;
    else break;
  }

  if (count < 2) return null;

  // Combo加成：2连+1，3连+3，4连+5，5连+8
  const bonusMap: Record<number, number> = { 2: 1, 3: 3, 4: 5, 5: 8 };
  const bonus = bonusMap[count] ?? 0;

  // 根据类型决定加成属性
  const statMap: Record<ActivityType, keyof Stats> = {
    study: "academics",
    social: "connections",
    work: "organization",
    rest: "stress",
    volunteer: "volunteerHours",
  };

  return {
    type: current.type,
    count,
    bonusStats: [{ stat: statMap[current.type], delta: bonus }],
  };
}

export default function ScheduleExecutor() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const schedule = state.weeklySchedule;
  const [dayResult, setDayResult] = useState<{ stat: string; delta: number }[] | null>(null);
  const [comboResult, setComboResult] = useState<{ type: ActivityType; count: number; bonusStats: { stat: keyof Stats; delta: number }[] } | null>(null);
  const [executed, setExecuted] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [interruptEvent, setInterruptEvent] = useState<InterruptEvent | null>(null);
  const [metNpcName, setMetNpcName] = useState<string | null>(null);
  const [showWeekSummary, setShowWeekSummary] = useState(false);
  const [weekCombos, setWeekCombos] = useState<WeeklyCombo[]>([]);

  const currentDay = schedule?.currentDay ?? 0;

  // 用ref存储计算好的属性变化，避免展示值与实际应用值不一致
  const pendingStatChanges = useRef<{ stat: string; delta: number }[]>([]);
  const pendingCombo = useRef<{ type: ActivityType; count: number; bonusStats: { stat: keyof Stats; delta: number }[] } | null>(null);

  // 从schedule提取活动数组用于combo计算
  const activitySlots = useMemo(() => {
    if (!schedule) return [null, null, null, null, null];
    return schedule.slots.map((s) => s.activity) as (ActivityDef | null)[];
  }, [schedule]);

  useEffect(() => {
    if (!schedule || currentDay >= 5 || executed) return;
    setDayResult(null);
    setComboResult(null);
    setShowAnimation(false);
    setMetNpcName(null);
    setExecuted(true);

    const slot = schedule.slots[currentDay];
    const activity = slot?.activity;

    if (!activity) {
      pendingStatChanges.current = [];
      pendingCombo.current = null;
      const timer = setTimeout(() => {
        dispatch({ type: "EXECUTE_DAY", day: currentDay, statChanges: [] });
        setExecuted(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // 志愿活动 → 触发小游戏
    if (activity.type === "volunteer") {
      const vEvent = VOLUNTEER_EVENTS.find(
        (e) =>
          e.stage.includes(state.stage) &&
          !state.eventHistory.includes(e.id)
      );
      if (vEvent?.miniGame) {
        // 当天完成 + 立即触发小游戏（同步dispatch避免currentDay变化导致timer被清除）
        dispatch({ type: "EXECUTE_DAY", day: currentDay, statChanges: [] });
        dispatch({
          type: "START_MINIGAME",
          miniGameType: vEvent.miniGame!.type,
          config: vEvent.miniGame!.config,
          volunteerEventId: vEvent.id,
        });
        return;
      }
      // Fallback: no mini-game found, execute normally
      const statChanges: { stat: string; delta: number }[] = [
        { stat: "volunteerHours", delta: 5 },
        { stat: "connections", delta: 2 },
      ];
      pendingStatChanges.current = statChanges;
      pendingCombo.current = null;
      setDayResult(statChanges);
      const timer = setTimeout(() => setShowAnimation(true), 300);
      return () => clearTimeout(timer);
    }

    // 计算combo
    const combo = calcComboBonus(activitySlots, currentDay);

    // 计算属性变化
    const statChanges: { stat: string; delta: number }[] = activity.statEffects.map((eff) => ({
      stat: eff.stat,
      delta: randomInRange(eff.min, eff.max),
    }));
    if (activity.stressDelta !== 0) {
      statChanges.push({ stat: "stress", delta: activity.stressDelta });
    }

    // 魅力值加成：社交活动获得额外收益
    if (activity.type === "social") {
      const chaMult = getCharismaMultiplier(state.stats.charisma);
      if (chaMult !== 1.0) {
        // Apply multiplier to social stat gains
        for (const sc of statChanges) {
          if (sc.stat === "connections" || sc.stat === "charisma") {
            sc.delta = Math.round(sc.delta * chaMult);
          }
        }
      }
    }

    // 人脉等级加成：社交活动获得固定额外人脉
    if (activity.type === "social") {
      const connTier = getConnectionsTier(state.stats.connections);
      if (connTier.socialBonus > 0) {
        const existing = statChanges.find((s) => s.stat === "connections");
        if (existing) {
          existing.delta += connTier.socialBonus;
        } else {
          statChanges.push({ stat: "connections", delta: connTier.socialBonus });
        }
      }
    }

    // 压力等级影响：高压力降低活动效果
    const stressTier = getStressTier(state.stats.stress);
    if (stressTier.effectiveness !== 1.0) {
      for (const sc of statChanges) {
        if (sc.stat !== "stress") {
          sc.delta = Math.round(sc.delta * stressTier.effectiveness);
        }
      }
    }

    // 社交活动：有机会结识新NPC
    if (activity.type === "social") {
      const unmetNPCs = state.loveNPCs.filter((n) => !n.met);
      if (unmetNPCs.length > 0 && Math.random() < 0.6) {
        const npc = unmetNPCs[Math.floor(Math.random() * unmetNPCs.length)];
        dispatch({ type: "MEET_NPC", npcId: npc.id });
        setMetNpcName(npc.name);
        statChanges.push({ stat: "connections", delta: 3 });
      }
    }

    // 应用特殊效果
    if (activity.specialEffect) {
      if (activity.specialEffect.type === "bonus_stats") {
        const mainStat = activity.statEffects[0]?.stat ?? "academics";
        statChanges.push({ stat: mainStat, delta: activity.specialEffect.value ?? 2 });
      } else if (activity.specialEffect.type === "combo_boost" && combo) {
        combo.bonusStats = combo.bonusStats.map((b) => ({ ...b, delta: b.delta * 2 }));
      }
    }

    // 存入ref，供handleContinue使用
    pendingStatChanges.current = statChanges;
    pendingCombo.current = combo;

    setDayResult(statChanges);
    if (combo) setComboResult(combo);

    // 检查突发事件
    if (activity.eventTriggerChance > 0 && Math.random() < activity.eventTriggerChance) {
      const evt = pickInterruptEvent(activity.type);
      if (evt) {
        setInterruptEvent(evt);
        return; // 等待玩家做出选择
      }
    }

    // 动画延迟
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentDay]);

  const handleInterruptChoice = (choice: InterruptEvent["choices"][0]) => {
    if (!interruptEvent) return;
    // 把事件选择的效果追加到pendingStatChanges中
    pendingStatChanges.current = [
      ...pendingStatChanges.current,
      ...choice.effects.map((e) => ({ stat: e.stat, delta: e.delta })),
    ];
    setDayResult((prev) => [
      ...(prev ?? []),
      ...choice.effects.map((e) => ({ stat: e.stat, delta: e.delta })),
    ]);
    setInterruptEvent(null);
    // 继续执行动画
    const timer = setTimeout(() => setShowAnimation(true), 300);
    return () => clearTimeout(timer);
  };

  const handleContinue = () => {
    if (!schedule) return;

    // 使用ref中预先计算好的值（与展示一致）
    const statChanges = [...pendingStatChanges.current];
    if (pendingCombo.current) {
      statChanges.push(...pendingCombo.current.bonusStats.map((b) => ({ stat: b.stat, delta: b.delta })));
    }

    dispatch({ type: "EXECUTE_DAY", day: currentDay, statChanges: statChanges as { stat: keyof Stats; delta: number }[] });
    setDayResult(null);
    setComboResult(null);
    setShowAnimation(false);
    setExecuted(false);
  };

  const handleWeekSummaryContinue = () => {
    setShowWeekSummary(false);
    setWeekCombos([]);
    dispatch({ type: "SET_PHASE", phase: "weekend_spending" });
  };

  if (!schedule) {
    dispatch({ type: "SET_PHASE", phase: "game" });
    return null;
  }

  if (currentDay >= 5) {
    // All days done — show week summary with combos before weekend
    if (state.gamePhase === "schedule_executing" && !showWeekSummary) {
      const combos = detectCombos(activitySlots);
      setWeekCombos(combos);
      setShowWeekSummary(true);
    }
    if (!showWeekSummary) return null;
    // showWeekSummary is true — fall through to render the summary overlay
  }

  const slot = schedule.slots[currentDay];
  const activity = slot?.activity;
  const isNpcCard = activity?.specialEffect?.type === "npc_bond";

  return (
    <div className={styles.container}>
      {/* 进度条 */}
      <div className={styles.progressBar}>
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            className={`${styles.progressDot} ${i < currentDay ? styles.dotDone : ""} ${i === currentDay ? styles.dotActive : ""}`}
          >
            <span className={styles.dotLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.progress}>
        第 {state.semesterWeek} 周 · {DAY_LABELS[currentDay]} ({currentDay + 1}/5)
      </div>

      {/* 突发事件弹窗 */}
      {interruptEvent && (
        <div className={styles.interruptOverlay}>
          <div className={styles.interruptCard}>
            <div className={styles.interruptIcon}>{interruptEvent.icon}</div>
            <div className={styles.interruptTitle}>{interruptEvent.title}</div>
            <div className={styles.interruptDesc}>{interruptEvent.description}</div>
            <div className={styles.interruptChoices}>
              {interruptEvent.choices.map((choice, i) => (
                <button
                  key={i}
                  className={styles.interruptChoice}
                  onClick={() => handleInterruptChoice(choice)}
                >
                  <span className={styles.choiceText}>{choice.text}</span>
                  <span className={styles.choiceEffects}>
                    {choice.effects.map((e, j) => (
                      <span key={j} className={e.delta >= 0 ? styles.effectPos : styles.effectNeg}>
                        {STAT_NAME[e.stat] ?? e.stat} {e.delta >= 0 ? "+" : ""}{e.delta}
                      </span>
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 周总结 Combo 展示 */}
      {showWeekSummary && (
        <div className={styles.weekSummaryOverlay}>
          <div className={styles.weekSummaryCard}>
            <div className={styles.weekSummaryIcon}>📊</div>
            <div className={styles.weekSummaryTitle}>一周总结</div>
            <div className={styles.weekSummarySub}>
              第 {state.semesterWeek} 周 · 活动全部完成
            </div>
            {weekCombos.length > 0 ? (
              <div className={styles.weekComboList}>
                {weekCombos.map((combo, i) => (
                  <div
                    key={i}
                    className={styles.weekComboItem}
                    style={{ borderColor: getComboCategoryColor("tag") }}
                  >
                    <span className={styles.weekComboIcon}>{combo.icon}</span>
                    <div className={styles.weekComboInfo}>
                      <div className={styles.weekComboName}>{combo.label}</div>
                      <div className={styles.weekComboDesc}>{combo.description}</div>
                      <div className={styles.weekComboEffects}>
                        {combo.statEffects.map((e, j) => (
                          <span key={j} className={e.delta >= 0 ? styles.effectPos : styles.effectNeg}>
                            {STAT_NAME[e.stat] ?? e.stat} {e.delta >= 0 ? "+" : ""}{e.delta}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noComboText}>
                本周没有触发特殊 Combo<br />
                <span className={styles.noComboHint}>试试搭配不同类型的活动卡牌？</span>
              </div>
            )}
            <button className={styles.weekSummaryBtn} onClick={handleWeekSummaryContinue}>
              进入周末 🎉
            </button>
          </div>
        </div>
      )}

      {/* 主画面 */}
      <div className={`${styles.dayAnimation} ${showAnimation ? styles.animateIn : ""}`}>
        <div className={styles.dayTitle}>{DAY_LABELS[currentDay]}</div>

        {/* NPC客串特殊画面 */}
        {isNpcCard && (
          <div className={styles.npcCameo}>
            <div className={styles.npcCameoIcon}>💫</div>
            <div className={styles.npcCameoText}>
              和 ta 在一起的时光格外珍贵...
            </div>
          </div>
        )}

        {/* Combo触发特效 */}
        {comboResult && showAnimation && (
          <div className={styles.comboEffect}>
            <div className={styles.comboIcon}>
              {comboResult.count >= 4 ? "💥" : comboResult.count >= 3 ? "🔥" : "⚡"}
            </div>
            <div className={styles.comboText}>
              {TYPE_NAME[comboResult.type]} ×{comboResult.count} COMBO!
            </div>
            <div className={styles.comboBonus}>
              {comboResult.bonusStats.map((b, i) => (
                <span key={i}>{STAT_NAME[b.stat] ?? b.stat} +{b.delta}</span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.activityDisplay}>
          {activity ? activity.icon : "💤"}
        </div>
        <div className={styles.activityName}>
          {activity?.label ?? "强制休息"}
        </div>
        {metNpcName && showAnimation && (
          <div className={styles.specialEffectLabel} style={{ background: "rgba(255,182,193,0.2)", color: "#c0392b" }}>
            💕 结识了新朋友：{metNpcName}！
          </div>
        )}
        {activity?.specialEffect && (
          <div className={styles.specialEffectLabel}>
            ✨ {activity.specialEffect.description}
          </div>
        )}

        {/* 属性变化 */}
        {dayResult && dayResult.length > 0 && showAnimation && (
          <div className={styles.statChanges}>
            {dayResult.map((sc, i) => (
              <span
                key={i}
                className={`${styles.statChange} ${sc.delta >= 0 ? styles.positive : styles.negative}`}
              >
                {STAT_NAME[sc.stat] ?? sc.stat} {sc.delta >= 0 ? "+" : ""}{sc.delta}
              </span>
            ))}
          </div>
        )}

        <button className={styles.continueBtn} onClick={handleContinue}>
          {currentDay < 4 ? "继续下一天 ▶" : "进入周末 🎉"}
        </button>
      </div>

      {/* 本周安排总览 */}
      <div className={styles.weekOverview}>
        {DAY_LABELS.map((label, i) => {
          const a = activitySlots[i];
          return (
            <div key={i} className={`${styles.overviewDay} ${i === currentDay ? styles.overviewActive : ""} ${i < currentDay ? styles.overviewDone : ""}`}>
              <div className={styles.overviewLabel}>{label}</div>
              <div className={styles.overviewIcon}>{a?.icon ?? (i < currentDay ? "✅" : "⬜")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TYPE_NAME: Record<ActivityType, string> = {
  study: "学习", social: "社交", work: "工作", rest: "休息", volunteer: "志愿",
};

const STAT_NAME: Record<string, string> = {
  organization: "组织力", connections: "人脉", academics: "学习力",
  charisma: "魅力值", stress: "压力", budget: "经费", volunteerHours: "志愿时长",
  allowance: "生活费",
};
