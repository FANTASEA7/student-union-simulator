// src/components/TitleScreen/TitleScreen.tsx
import { useState } from "react";
import { useGameDispatch } from "../../context/GameContext";
import { loadGame, getSaveSlots, deleteSave } from "../../utils/saveLoad";
import styles from "./TitleScreen.module.css";

type View = "main" | "new_save" | "load_save";

export default function TitleScreen() {
  const dispatch = useGameDispatch();
  const [view, setView] = useState<View>("main");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const slots = getSaveSlots();

  const handleNewSave = (slot: number) => {
    dispatch({ type: "SET_SAVE_SLOT", slot });
    dispatch({ type: "SET_PHASE", phase: "name_input" });
  };

  const handleLoadSave = (slot: number) => {
    const save = loadGame(slot);
    if (save) {
      dispatch({ type: "LOAD_SAVE", state: save.state });
    }
  };

  const handleDeleteSave = (slot: number) => {
    deleteSave(slot);
    setConfirmDelete(null);
  };

  const hasAnySave = slots.some((s) => s.data !== null);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const getDepartmentName = (dept: string | null) => {
    const map: Record<string, string> = {
      life: "生活部", office: "办公室", sports: "文体部",
      media: "新媒体部", social: "社管部", psychology: "心理部",
    };
    return dept ? map[dept] ?? dept : "未选择";
  };

  if (view === "new_save") {
    return (
      <div className={styles.container}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h2 className={styles.slotTitle}>选择存档位</h2>
          <p className={styles.slotSubtitle}>选择空白存档位开始新游戏</p>
          <div className={styles.slotList}>
            {slots.map(({ slot, data }) => (
              <div
                key={slot}
                className={`${styles.slotCard} ${data ? styles.slotUsed : styles.slotEmpty}`}
                onClick={data ? undefined : () => handleNewSave(slot)}
              >
                <div className={styles.slotNumber}>存档位 {slot}</div>
                {data ? (
                  <div className={styles.slotInfo}>
                    <div className={styles.slotName}>{data.state.playerName}</div>
                    <div className={styles.slotMeta}>
                      第{data.state.semester}学期 · 第{data.state.week}周 · {getDepartmentName(data.state.department)}
                    </div>
                    <div className={styles.slotTime}>{formatDate(data.timestamp)}</div>
                    <div className={styles.slotOccupied}>已有存档</div>
                  </div>
                ) : (
                  <div className={styles.slotEmptyHint}>点击创建新存档</div>
                )}
              </div>
            ))}
          </div>
          <button className={styles.backBtn} onClick={() => setView("main")}>返回</button>
        </div>
      </div>
    );
  }

  if (view === "load_save") {
    return (
      <div className={styles.container}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h2 className={styles.slotTitle}>读取存档</h2>
          <p className={styles.slotSubtitle}>选择一个存档继续游戏</p>
          <div className={styles.slotList}>
            {slots.map(({ slot, data }) => (
              <div
                key={slot}
                className={`${styles.slotCard} ${data ? styles.slotUsed : styles.slotEmptyDisabled}`}
                onClick={data ? () => handleLoadSave(slot) : undefined}
              >
                <div className={styles.slotNumber}>存档位 {slot}</div>
                {data ? (
                  <div className={styles.slotInfo}>
                    <div className={styles.slotName}>{data.state.playerName}</div>
                    <div className={styles.slotMeta}>
                      第{data.state.semester}学期 · 第{data.state.week}周 · {getDepartmentName(data.state.department)}
                    </div>
                    <div className={styles.slotTime}>{formatDate(data.timestamp)}</div>
                    {confirmDelete === slot ? (
                      <div className={styles.deleteConfirm}>
                        <span>确认删除？</span>
                        <button className={styles.confirmYes} onClick={(e) => { e.stopPropagation(); handleDeleteSave(slot); }}>是</button>
                        <button className={styles.confirmNo} onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}>否</button>
                      </div>
                    ) : (
                      <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); setConfirmDelete(slot); }}>删除</button>
                    )}
                  </div>
                ) : (
                  <div className={styles.slotEmptyHint}>空存档位</div>
                )}
              </div>
            ))}
          </div>
          <button className={styles.backBtn} onClick={() => { setView("main"); setConfirmDelete(null); }}>返回</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <img className={styles.emblem} src="/characters/school_logo.png" alt="牛马大学" />
        <h1 className={styles.title}>学生会模拟器</h1>
        <p className={styles.subtitle}>牛马大学 · 命运的十字路口</p>
        <div className={styles.buttons}>
          <button className={styles.btnPrimary} onClick={() => setView("new_save")}>
            新的故事
          </button>
          <button
            className={`${styles.btnSecondary} ${!hasAnySave ? styles.btnDisabled : ""}`}
            onClick={() => hasAnySave && setView("load_save")}
            disabled={!hasAnySave}
          >
            读取存档
          </button>
        </div>
      </div>
    </div>
  );
}
