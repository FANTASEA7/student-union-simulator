import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { NegotiationCardType } from "../../../types/game";
import styles from "./Negotiation.module.css";

const CARD_INFO: Record<NegotiationCardType, { emoji: string; label: string; desc: string; color: string }> = {
  logic: {
    emoji: "📜",
    label: "据理力争",
    desc: "用事实、数据和规则说服对方",
    color: "#c0392b",
  },
  pressure: {
    emoji: "👊",
    label: "强硬施压",
    desc: "用权威、职位和后果迫使对方让步",
    color: "#2471a3",
  },
  charm: {
    emoji: "🎭",
    label: "巧妙斡旋",
    desc: "用人情、魅力和话术引导对方",
    color: "#7d3c98",
  },
};

const COUNTERS: Record<NegotiationCardType, NegotiationCardType> = {
  logic: "pressure",
  pressure: "charm",
  charm: "logic",
};

export default function Negotiation() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const neg = state.negotiation;

  if (!neg) return null;

  const isFinished = neg.playerScore > neg.maxRounds / 2 || neg.npcScore > neg.maxRounds / 2 || neg.round > neg.maxRounds;
  const playerWon = isFinished ? neg.playerScore > neg.npcScore : false;

  const handlePlay = (card: NegotiationCardType) => {
    if (isFinished) return;
    dispatch({ type: "PLAY_NEGOTIATION_CARD", playerCard: card });
  };

  const handleEnd = () => {
    dispatch({ type: "END_NEGOTIATION" });
  };

  // Build player card power values from stats
  const getCardPower = (type: NegotiationCardType): number => {
    switch (type) {
      case "logic":
        return Math.floor((state.stats.organization + state.stats.academics) / 2);
      case "pressure":
        return Math.floor((state.stats.charisma + state.stats.budget / 10));
      case "charm":
        return Math.floor((state.stats.connections + state.stats.charisma) / 2);
    }
  };

  const roundsWon = neg.playerScore;
  const roundsLost = neg.npcScore;

  return (
    <div className={styles.container}>
      <div className={styles.backdrop} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.contextLabel}>交涉中</div>
        <div className={styles.contextTitle}>{neg.context}</div>
      </div>

      {/* Opponent */}
      <div className={styles.opponentArea}>
        {neg.chairId ? (
          <img
            className={styles.opponentAvatar}
            src={`/characters/${neg.chairId}_head.png`}
            alt={neg.npcName}
          />
        ) : (
          <div className={styles.opponentEmoji}>{neg.npcEmoji}</div>
        )}
        <div className={styles.opponentName}>{neg.npcName}</div>
        <div className={styles.scoreRow}>
          <span className={styles.scoreBadge}>胜 {roundsWon}</span>
          <span className={styles.scoreVs}>VS</span>
          <span className={`${styles.scoreBadge} ${styles.scoreBadgeNpc}`}>胜 {roundsLost}</span>
        </div>
        <div className={styles.roundInfo}>
          第 {neg.round} / {neg.maxRounds} 回合
        </div>
      </div>

      {/* Last round result */}
      {neg.lastResult && (
        <div className={`${styles.resultBanner} ${styles[neg.lastResult]}`}>
          {neg.lastResult === "win" && "✅ 这回合你赢了！"}
          {neg.lastResult === "lose" && "❌ 这回合你输了！"}
          {neg.lastResult === "draw" && "🤝 平局"}
          {neg.resultMessage && <div className={styles.resultDetail}>{neg.resultMessage}</div>}
        </div>
      )}

      {/* Cards */}
      {!isFinished ? (
        <div className={styles.cardsArea}>
          <div className={styles.cardsHint}>选择一张牌出招</div>
          <div className={styles.cardsRow}>
            {(Object.keys(CARD_INFO) as NegotiationCardType[]).map((type) => (
              <button
                key={type}
                className={styles.cardBtn}
                style={{ borderColor: CARD_INFO[type].color }}
                onClick={() => handlePlay(type)}
              >
                <div className={styles.cardEmoji}>{CARD_INFO[type].emoji}</div>
                <div className={styles.cardLabel} style={{ color: CARD_INFO[type].color }}>
                  {CARD_INFO[type].label}
                </div>
                <div className={styles.cardPower}>力量: {getCardPower(type)}</div>
                <div className={styles.cardDesc}>{CARD_INFO[type].desc}</div>
                <div className={styles.cardCounter} style={{ background: CARD_INFO[type].color }}>
                  克 {CARD_INFO[COUNTERS[type]].label}
                </div>
              </button>
            ))}
          </div>
          <div className={styles.rulesHint}>
            🟥 据理力争 克 🟦 强硬施压 克 ⬛ 巧妙斡旋 克 🟥 据理力争
          </div>
        </div>
      ) : (
        /* End screen */
        <div className={`${styles.endScreen} ${playerWon ? styles.won : styles.lost}`}>
          <div className={styles.endEmoji}>{playerWon ? "🎉" : "😞"}</div>
          <div className={styles.endTitle}>
            {playerWon ? "交涉成功！" : "交涉失败…"}
          </div>
          <div className={styles.endStakes}>
            {playerWon ? neg.stakes.win : neg.stakes.lose}
          </div>
          <button className={styles.endBtn} onClick={handleEnd}>
            继续
          </button>
        </div>
      )}
    </div>
  );
}
