// src/components/GameScreen/GameScreen.tsx
import { useEffect } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { saveGame } from "../../utils/saveLoad";
import { generateNPCs } from "../../utils/npcGenerator";
import { pickCET4Questions } from "../../data/examData";
import TopBar from "./TopBar";
import StatsPanel from "./StatsPanel";
import EventLog from "./EventLog";
import SchedulePlanner from "./SchedulePlanner/SchedulePlanner";
import ScheduleExecutor from "./ScheduleExecutor/ScheduleExecutor";
import WeekendSpending from "./WeekendSpending/WeekendSpending";
import ChairRelationsPanel from "./ChairRelationsPanel/ChairRelationsPanel";
import SituationBars from "./SituationBars/SituationBars";
import styles from "./GameScreen.module.css";

export default function GameScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  // Generate NPCs on first game load
  useEffect(() => {
    if (state.loveNPCs.length === 0 && state.gamePhase === "game") {
      const npcs = generateNPCs(9);
      dispatch({ type: "GENERATE_NPCS", npcs });
    }
  }, [state.gamePhase]);

  const handleSave = (slot: number) => {
    saveGame(state, slot);
    alert(`已保存到存档位 ${slot}`);
  };

  const handleStartWeek = () => {
    dispatch({ type: "START_SCHEDULE_PLANNING" });
  };

  const isExamWeek = state.semesterWeek === 14 || state.semesterWeek === 16;
  const isSportsFestivalWeek = state.semesterWeek === 9 && !state.flags["sports_festival_done"];

  // Render the scheduler sub-components inside the main area
  const renderMainContent = () => {
    switch (state.gamePhase) {
      case "schedule_planning":
        return (
          <div className={styles.main}>
            <div className={styles.eventArea}>
              <SchedulePlanner />
            </div>
            <div className={styles.sidebar}>
              <StatsPanel />
              <SituationBars />
              <div className={styles.quickActions}>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "contacts" })}>
                  📋 通讯录
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "mail" })}>
                  📧 邮件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "supermarket" })}>
                  🏪 南苑超市
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "backpack" })}>
                  🎒 背包
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "event_log" })}>
                  📜 近期事件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "chair_relations" })}>
                  🏛️ 部长关系
                </button>
                {state.stats.connections >= 88 && (
                  <button
                    className={styles.quickBtn}
                    style={{ borderColor: "rgba(168,85,247,0.4)", color: "#c8a0f0" }}
                    onClick={() => {
                      dispatch({ type: "ENTER_MERCHANT" });
                    }}
                  >
                    🕯️ 神秘商人
                  </button>
                )}
              </div>
              <div className={styles.saveSection}>
                <span className={styles.saveLabel}>存档</span>
                <div className={styles.saveBtns}>
                  {[1, 2, 3].map((slot) => (
                    <button key={slot} className={styles.saveBtn} onClick={() => handleSave(slot)}>
                      位{slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "schedule_executing":
        return (
          <div className={styles.main}>
            <div className={styles.eventArea}>
              <ScheduleExecutor />
            </div>
            <div className={styles.sidebar}>
              <StatsPanel />
              <SituationBars />
              <div className={styles.quickActions}>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "contacts" })}>
                  📋 通讯录
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "mail" })}>
                  📧 邮件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "supermarket" })}>
                  🏪 南苑超市
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "backpack" })}>
                  🎒 背包
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "event_log" })}>
                  📜 近期事件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "chair_relations" })}>
                  🏛️ 部长关系
                </button>
                {state.stats.connections >= 88 && (
                  <button
                    className={styles.quickBtn}
                    style={{ borderColor: "rgba(168,85,247,0.4)", color: "#c8a0f0" }}
                    onClick={() => {
                      dispatch({ type: "ENTER_MERCHANT" });
                    }}
                  >
                    🕯️ 神秘商人
                  </button>
                )}
              </div>
              <div className={styles.saveSection}>
                <span className={styles.saveLabel}>存档</span>
                <div className={styles.saveBtns}>
                  {[1, 2, 3].map((slot) => (
                    <button key={slot} className={styles.saveBtn} onClick={() => handleSave(slot)}>
                      位{slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "weekend_spending":
        return (
          <div className={styles.main}>
            <div className={styles.eventArea}>
              <WeekendSpending />
            </div>
            <div className={styles.sidebar}>
              <StatsPanel />
              <SituationBars />
              <div className={styles.quickActions}>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "contacts" })}>
                  📋 通讯录
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "mail" })}>
                  📧 邮件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "supermarket" })}>
                  🏪 南苑超市
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "backpack" })}>
                  🎒 背包
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "event_log" })}>
                  📜 近期事件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "chair_relations" })}>
                  🏛️ 部长关系
                </button>
                {state.stats.connections >= 88 && (
                  <button
                    className={styles.quickBtn}
                    style={{ borderColor: "rgba(168,85,247,0.4)", color: "#c8a0f0" }}
                    onClick={() => {
                      dispatch({ type: "ENTER_MERCHANT" });
                    }}
                  >
                    🕯️ 神秘商人
                  </button>
                )}
              </div>
              <div className={styles.saveSection}>
                <span className={styles.saveLabel}>存档</span>
                <div className={styles.saveBtns}>
                  {[1, 2, 3].map((slot) => (
                    <button key={slot} className={styles.saveBtn} onClick={() => handleSave(slot)}>
                      位{slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "chair_relations":
        return (
          <div className={styles.main}>
            <div className={styles.eventArea}>
              <ChairRelationsPanel />
            </div>
            <div className={styles.sidebar}>
              <StatsPanel />
              <EventLog />
            </div>
          </div>
        );
      case "event_log":
        return (
          <div className={styles.main}>
            <div className={styles.eventArea}>
              <EventLog limit={0} fullPage />
            </div>
            <div className={styles.sidebar}>
              <StatsPanel />
              <EventLog />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <TopBar />
      {state.gamePhase === "game" ? (
        isExamWeek && !state.flags["cet4_taken"] && state.semesterWeek === 14 ? (
          <div className={styles.examNotice}>
            <h2>📝 考试周！</h2>
            <p>第 {state.semesterWeek} 周 — 四级考试</p>
            <button
              className={styles.startExamBtn}
              onClick={() => {
                const questions = pickCET4Questions(10);
                dispatch({ type: "START_EXAM", examId: "cet4", questions });
              }}
            >
              开始考试
            </button>
          </div>
        ) : isExamWeek && state.semesterWeek === 16 ? (
          <div className={styles.examNotice}>
            <h2>📊 期末考核周</h2>
            <p>第 16 周 — 查看你的综合排名</p>
            <button
              className={styles.startExamBtn}
              onClick={() =>
                dispatch({ type: "SET_PHASE", phase: "exam_result" })
              }
            >
              查看排名
            </button>
          </div>
        ) : isSportsFestivalWeek ? (
          <div className={styles.main}>
            <div className={styles.eventArea}>
              <div className={styles.weekStart}>
                <h2>🏟️ 田径运动会</h2>
                <p style={{ fontSize: 16, color: "#c44d34", marginTop: 8 }}>
                  第 {state.semesterWeek} 周 — 一年一度的田径运动会开幕！
                </p>
                <p style={{ fontSize: 14, color: "#888", marginTop: 6 }}>
                  这一周不用排课，前往运动场参加 5 个项目，集齐印章可兑换特别奖品。
                </p>
                <button
                  className={styles.startWeekBtn}
                  style={{ background: "#c44d34" }}
                  onClick={() => dispatch({ type: "ENTER_SPORTS_FESTIVAL" })}
                >
                  前往运动场
                </button>
              </div>
            </div>
            <div className={styles.sidebar}>
              <StatsPanel />
              <SituationBars />
              <div className={styles.quickActions}>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "contacts" })}>
                  📋 通讯录
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "mail" })}>
                  📧 邮件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "supermarket" })}>
                  🏪 南苑超市
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "backpack" })}>
                  🎒 背包
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "event_log" })}>
                  📜 近期事件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "chair_relations" })}>
                  🏛️ 部长关系
                </button>
                {state.stats.connections >= 88 && (
                  <button
                    className={styles.quickBtn}
                    style={{ borderColor: "rgba(168,85,247,0.4)", color: "#c8a0f0" }}
                    onClick={() => {
                      dispatch({ type: "ENTER_MERCHANT" });
                    }}
                  >
                    🕯️ 神秘商人
                  </button>
                )}
              </div>
              <div className={styles.saveSection}>
                <span className={styles.saveLabel}>存档</span>
                <div className={styles.saveBtns}>
                  {[1, 2, 3].map((slot) => (
                    <button key={slot} className={styles.saveBtn} onClick={() => handleSave(slot)}>
                      位{slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.main}>
            <div className={styles.eventArea}>
              <div className={styles.weekStart}>
                <h2>第 {state.semesterWeek} 周</h2>
                <p>精力: {state.energy}/100 | 生活费: ¥{state.stats.allowance}</p>
                <button className={styles.startWeekBtn} onClick={handleStartWeek}>
                  开始本周排课
                </button>
              </div>
            </div>
            <div className={styles.sidebar}>
              <StatsPanel />
              <SituationBars />
              <div className={styles.quickActions}>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "contacts" })}>
                  📋 通讯录
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "mail" })}>
                  📧 邮件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "supermarket" })}>
                  🏪 南苑超市
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "backpack" })}>
                  🎒 背包
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "event_log" })}>
                  📜 近期事件
                </button>
                <button className={styles.quickBtn} onClick={() => dispatch({ type: "SET_PHASE", phase: "chair_relations" })}>
                  🏛️ 部长关系
                </button>
                {state.stats.connections >= 88 && (
                  <button
                    className={styles.quickBtn}
                    style={{ borderColor: "rgba(168,85,247,0.4)", color: "#c8a0f0" }}
                    onClick={() => {
                      dispatch({ type: "ENTER_MERCHANT" });
                    }}
                  >
                    🕯️ 神秘商人
                  </button>
                )}
              </div>
              <div className={styles.saveSection}>
                <span className={styles.saveLabel}>存档</span>
                <div className={styles.saveBtns}>
                  {[1, 2, 3].map((slot) => (
                    <button
                      key={slot}
                      className={styles.saveBtn}
                      onClick={() => handleSave(slot)}
                    >
                      位{slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        renderMainContent()
      )}
    </div>
  );
}
