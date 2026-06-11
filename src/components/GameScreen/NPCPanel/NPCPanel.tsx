import { useGameState, useGameDispatch } from "../../../context/GameContext";
import styles from "./NPCPanel.module.css";

const PERSONALITY_EMOJI: Record<string, string> = {
  sunny: "☀️", tsundere: "😤", gentle: "🌸", shy: "😳", mischievous: "😏",
};

export default function NPCPanel() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const knownNPCs = state.loveNPCs.filter((n) => n.met);

  if (knownNPCs.length === 0) return null;

  const handleInteract = (npcId: string) => {
    dispatch({ type: "UPDATE_AFFINITY", npcId, delta: 3 + Math.floor(Math.random() * 6) });
  };

  const handleConfess = (npcId: string) => {
    // Set a flag to indicate which NPC to confess to
    // LoveConfessScreen looks for "confessing_to_<npcId>" key
    dispatch({
      type: "APPLY_CHOICE",
      effects: [],
      feedback: "",
      flags: [`confessing_to_${npcId}`],
      eventId: `confess_${npcId}`,
      eventTitle: `向某人表白`,
    });
    // Then navigate to confess screen
    dispatch({ type: "SET_PHASE", phase: "love_confess" });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.title}>👥 认识的人</div>
      {knownNPCs.map((npc) => (
        <div key={npc.id} className={styles.npcItem}>
          <span className={styles.npcAvatar}>
            {npc.avatar ? (
              <img src={npc.avatar} alt={npc.name} className={styles.avatarImg} />
            ) : (
              PERSONALITY_EMOJI[npc.personality] ?? "👤"
            )}
          </span>
          <div className={styles.npcInfo}>
            <div className={styles.npcName}>{npc.name}</div>
            <div className={styles.npcStatus}>
              {npc.status === "dating"
                ? "❤️ 恋人"
                : npc.status === "rejected"
                ? "💔"
                : npc.status === "close"
                ? "好友"
                : "朋友"}
            </div>
          </div>
          <span className={styles.affinityMini}>{npc.affinity}%</span>
          {npc.status !== "rejected" && npc.status !== "dating" && (
            <button
              className={styles.interactBtn}
              onClick={() => handleInteract(npc.id)}
            >
              聊天
            </button>
          )}
          {npc.affinity >= 66 && npc.canRomance && npc.status !== "dating" && npc.status !== "rejected" && (
            <button
              className={styles.interactBtn}
              style={{ borderColor: "#e74c3c", color: "#e74c3c" }}
              onClick={() => handleConfess(npc.id)}
            >
              表白
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
