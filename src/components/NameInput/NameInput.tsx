// src/components/NameInput/NameInput.tsx
import { useState } from "react";
import { useGameDispatch } from "../../context/GameContext";
import styles from "./NameInput.module.css";

export default function NameInput() {
  const dispatch = useGameDispatch();
  const [name, setName] = useState("");

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    dispatch({ type: "SET_PLAYER_NAME", name: trimmed });
    dispatch({ type: "SET_PHASE", phase: "department_select" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>请输入你的名字</h2>
        <p className={styles.hint}>这个名字将出现在工牌和学生会剧情中</p>
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          placeholder="输入姓名..."
          maxLength={10}
          autoFocus
        />
        <button
          className={styles.btn}
          onClick={handleConfirm}
          disabled={name.trim().length < 2}
        >
          确认
        </button>
      </div>
    </div>
  );
}
