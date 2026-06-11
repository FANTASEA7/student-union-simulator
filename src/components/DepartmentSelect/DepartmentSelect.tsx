// src/components/DepartmentSelect/DepartmentSelect.tsx
import { useGameDispatch } from "../../context/GameContext";
import { DEPARTMENTS } from "../../data/departments";
import { Department } from "../../types/game";
import styles from "./DepartmentSelect.module.css";

export default function DepartmentSelect() {
  const dispatch = useGameDispatch();

  const handleSelect = (dept: Department) => {
    dispatch({ type: "SET_DEPARTMENT", department: dept });
    dispatch({ type: "SET_PHASE", phase: "interview" });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>选择你的部门</h2>
      <p className={styles.subtitle}>点击部门卡牌，开始面试</p>
      <div className={styles.grid}>
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className={styles.card}
            onClick={() => handleSelect(dept.id)}
          >
            <img
              className={styles.portrait}
              src={`/characters/${dept.id}_head.png`}
              alt={dept.headName}
            />
            <div className={styles.deptName}>{dept.name}</div>
            <div className={styles.headName}>{dept.headName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
