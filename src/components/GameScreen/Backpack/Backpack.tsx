import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { InventoryItem, ItemCategory } from "../../../types/game";
import styles from "./Backpack.module.css";

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  consumable: "消耗品",
  gift: "礼物",
  tool: "道具",
  special: "特殊",
};

const CATEGORY_ORDER: ItemCategory[] = ["consumable", "tool", "gift", "special"];

export default function Backpack() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const inventory = state.inventory;
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: inventory.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  const handleUse = (item: InventoryItem) => {
    if (item.category === "gift") return; // Gifts used via Contacts
    dispatch({ type: "USE_ITEM", itemId: item.itemId });
  };

  const handleClose = () => {
    dispatch({ type: "SET_PHASE", phase: "game" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🎒 背包</h2>
        <span className={styles.allowance}>💰 ¥{state.stats.allowance}</span>
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
      </div>

      <div className={styles.content}>
        {grouped.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎒</div>
            <div>背包空空如也...</div>
            <div className={styles.emptyHint}>去南苑超市购买一些道具吧！</div>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.category} className={styles.section}>
              <div className={styles.sectionTitle}>{group.label}</div>
              <div className={styles.itemGrid}>
                {group.items.map((item, idx) => (
                  <div key={`${item.itemId}-${idx}`} className={styles.itemCard}>
                    <div className={styles.itemIcon}>{item.icon}</div>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemEffect}>{item.effects.description}</div>
                    </div>
                    <div className={styles.itemQty}>×{item.quantity}</div>
                    {item.category !== "gift" && (
                      <button className={styles.useBtn} onClick={() => handleUse(item)}>
                        使用
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
