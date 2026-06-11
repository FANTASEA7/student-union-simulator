import { useState, useEffect } from "react";
import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { createBargainNegotiation } from "../../../data/negotiation";
import { CardRarity } from "../../../types/game";
import styles from "./Supermarket.module.css";

const RARITY_COLORS: Record<CardRarity, { border: string; bg: string; glow: string; label: string }> = {
  common: { border: "#aaa", bg: "#f5f5f0", glow: "none", label: "普通" },
  rare: { border: "#5b9bd5", bg: "#e8f0fa", glow: "0 0 8px rgba(91,155,213,0.4)", label: "稀有" },
  epic: { border: "#9b59b6", bg: "#f3eef8", glow: "0 0 12px rgba(155,89,182,0.5)", label: "史诗" },
  legendary: { border: "#f39c12", bg: "#fef9e7", glow: "0 0 16px rgba(243,156,18,0.6), 0 0 32px rgba(155,89,182,0.3)", label: "传奇" },
};

const REROLL_COST = 30;

export default function Supermarket() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const [message, setMessage] = useState<string | null>(null);

  const shopState = state.shopState;
  const cards = shopState?.cards ?? [];

  // Initialize shop on mount
  useEffect(() => {
    if (!shopState) {
      dispatch({ type: "ENTER_SHOP" });
    }
  }, []);

  // Show bargain result message when returning from negotiation
  useEffect(() => {
    if (state.lastBargainResult) {
      const r = state.lastBargainResult;
      if (r.success) {
        setMessage(`🎉 砍价成功！${r.itemName} 打7折，省了 ¥${r.discount}`);
      } else {
        setMessage(`😞 砍价失败…${r.itemName} 维持原价`);
      }
    }
  }, [state.lastBargainResult]);

  const handleBuy = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.sold) return;

    // Use discounted price if bargained successfully
    const finalPrice = card.discountedPrice ?? card.item.price;

    if (state.stats.allowance < finalPrice) {
      setMessage("💰 生活费不足！");
      return;
    }
    dispatch({
      type: "BUY_SHOP_ITEM",
      itemId: card.id,
      cost: finalPrice,
      name: card.item.name,
      icon: card.item.icon,
      category: card.item.category,
      rarity: card.item.rarity,
      effects: card.item.effects,
    });
    const isBargained = finalPrice < card.item.price;
    setMessage(
      isBargained
        ? `✅ 砍价购买 ${card.item.name}！-¥${finalPrice} (原价 ¥${card.item.price})`
        : `✅ 购买了 ${card.item.name}！-¥${finalPrice}`
    );
  };

  const handleBargain = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.sold) return;

    // Daily limit: only one bargain per week
    if (shopState && shopState.lastBargainWeek >= state.semesterWeek) {
      setMessage("⏰ 今天已经砍过价了，明天再来吧！");
      return;
    }

    // Already bargained
    if (shopState?.bargainedItemIds.includes(cardId)) {
      setMessage("🗣️ 这个商品已经砍过价了");
      return;
    }

    const neg = createBargainNegotiation(card.item.name, card.item.price);
    dispatch({
      type: "SET_BARGAIN_TARGET",
      target: {
        itemId: card.id,
        itemName: card.item.name,
        price: card.item.price,
        discountPercent: 30,
      },
    });
    dispatch({ type: "START_NEGOTIATION", negotiation: neg });
  };

  const handleReroll = () => {
    if (state.stats.allowance < REROLL_COST) {
      setMessage("💰 生活费不足，无法刷新！");
      return;
    }
    dispatch({ type: "REROLL_SHOP", cost: REROLL_COST });
    setMessage("🔄 商品已刷新！-¥30");
  };

  const handleExit = () => {
    dispatch({ type: "EXIT_SHOP" });
  };

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 2500);
      return () => clearTimeout(t);
    }
  }, [message]);

  if (!shopState) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>🏪 南苑超市</h2>
          <span className={styles.subtitle}>选购心仪的道具吧</span>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.allowance}>💰 ¥{state.stats.allowance}</span>
          <button className={styles.exitBtn} onClick={handleExit}>✕</button>
        </div>
      </div>

      <div className={styles.cardGrid}>
        {cards.map((card) => {
          const style = RARITY_COLORS[card.item.rarity];
          const isBargained = shopState.bargainedItemIds.includes(card.id);
          const displayPrice = card.discountedPrice ?? card.item.price;
          const hasDiscount = card.discountedPrice !== undefined && card.discountedPrice < card.item.price;

          return (
            <div
              key={card.id}
              className={`${styles.card} ${styles.cardFlipped} ${card.sold ? styles.cardSold : ""}`}
              style={!card.sold ? {
                borderColor: style?.border,
                background: style?.bg,
                boxShadow: hasDiscount ? `0 0 12px rgba(39,174,96,0.5), ${style?.glow}` : style?.glow,
              } : undefined}
            >
              {card.sold ? (
                <div className={styles.soldOverlay}>
                  <div className={styles.soldStamp}>已售</div>
                </div>
              ) : (
                <div className={styles.cardFront}>
                  <div className={styles.itemRarity} style={{ color: style?.border, borderColor: style?.border }}>
                    {style?.label}
                  </div>
                  <div className={styles.itemIcon}>{card.item.icon}</div>
                  <div className={styles.itemName}>{card.item.name}</div>
                  <div className={styles.itemDesc}>{card.item.description}</div>
                  <div className={styles.itemPrice}>
                    {hasDiscount ? (
                      <>
                        <span className={styles.originalPrice}>¥{card.item.price}</span>
                        <span className={styles.discountPrice}>¥{displayPrice}</span>
                      </>
                    ) : (
                      `¥${displayPrice}`
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.buyBtn}
                      onClick={(e) => { e.stopPropagation(); handleBuy(card.id); }}
                      disabled={state.stats.allowance < displayPrice}
                    >
                      {state.stats.allowance < displayPrice ? "余额不足" : "购买"}
                    </button>
                    <button
                      className={`${styles.bargainBtn} ${isBargained ? styles.bargainedBtn : ""}`}
                      onClick={(e) => { e.stopPropagation(); handleBargain(card.id); }}
                      disabled={isBargained}
                    >
                      {isBargained ? (hasDiscount ? "✅ 已砍" : "已砍") : "🗣️ 砍价"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        {message && <div className={styles.message}>{message}</div>}
        <div className={styles.footerBtns}>
          <button className={styles.rerollBtn} onClick={handleReroll}>
            🔄 刷新商品 (¥{REROLL_COST})
          </button>
          <button className={styles.leaveBtn} onClick={handleExit}>
            离开超市
          </button>
        </div>
      </div>
    </div>
  );
}
