// src/components/MysteriousMerchant/MysteriousMerchant.tsx
import { useGameState, useGameDispatch } from "../../context/GameContext";
import styles from "./MysteriousMerchant.module.css";

const RARITY_GLOW: Record<string, string> = {
  common: "rgba(170,170,170,0.3)",
  rare: "rgba(91,155,213,0.5)",
  epic: "rgba(155,89,182,0.6)",
  legendary: "rgba(243,156,18,0.7)",
};

const RARITY_LABEL: Record<string, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传奇",
};

const STAT_NAMES: Record<string, string> = {
  organization: "组织力",
  connections: "人脉",
  academics: "学习力",
  charisma: "魅力值",
  stress: "压力",
};

export default function MysteriousMerchant() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const ms = state.merchantState;
  if (!ms) return null;

  const canVisitThisWeek = ms.lastVisitWeek < state.semesterWeek;

  const handleBuy = (offerId: string) => {
    dispatch({ type: "BUY_MERCHANT_OFFER", offerId });
  };

  const handleLeave = () => {
    dispatch({ type: "EXIT_MERCHANT" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <div className={styles.shop}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>🕯️ 神秘商人</h2>
            <p className={styles.subtitle}>
              深夜的校园角落，一个戴兜帽的人朝你招了招手……
            </p>
          </div>
          <button className={styles.exitBtn} onClick={handleLeave}>✕</button>
        </div>

        <div className={styles.offers}>
          {ms.offers.map((offer) => {
            const glow = RARITY_GLOW[offer.item.rarity] || "none";
            const label = RARITY_LABEL[offer.item.rarity] || "???";
            const afford = state.stats[offer.costStat] >= offer.costAmount;

            return (
              <div
                key={offer.id}
                className={`${styles.card} ${offer.sold ? styles.sold : ""}`}
                style={{ borderColor: glow, boxShadow: `0 0 16px ${glow}` }}
              >
                {offer.sold ? (
                  <div className={styles.soldOverlay}>已售罄</div>
                ) : (
                  <>
                    <div className={styles.rarityTag} style={{ color: glow }}>
                      {label}
                    </div>
                    <div className={styles.icon}>{offer.item.icon}</div>
                    <div className={styles.name}>{offer.item.name}</div>
                    <div className={styles.desc}>{offer.item.description}</div>
                    <div className={styles.cost}>
                      代价：{STAT_NAMES[offer.costStat]} -{offer.costAmount}
                      <span className={afford ? styles.afford : styles.cantAfford}>
                        {afford ? ` (当前: ${state.stats[offer.costStat]})` : ` (不足，当前: ${state.stats[offer.costStat]})`}
                      </span>
                    </div>
                    <button
                      className={`${styles.buyBtn} ${!afford ? styles.buyDisabled : ""}`}
                      onClick={() => handleBuy(offer.id)}
                      disabled={!afford}
                    >
                      {afford ? "交易" : "不足"}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {ms.offers.every((o) => o.sold) && (
          <div className={styles.emptyMsg}>
            "货都出完了。下次再来吧。"
          </div>
        )}

        <div className={styles.footer}>
          <p className={styles.visits}>本周已访问 · 每周仅可访问一次</p>
          <button className={styles.leaveBtn} onClick={handleLeave}>
            离开
          </button>
        </div>
      </div>
    </div>
  );
}
