import { useGameState, useGameDispatch } from "../../../context/GameContext";
import { MailMessage } from "../../../types/game";
import styles from "./Mail.module.css";

export default function Mail() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  const mails = [...state.mails].reverse();

  const unreadCount = state.mails.filter((m) => !m.read).length;

  const handleOpen = (mail: MailMessage) => {
    if (!mail.read) {
      dispatch({ type: "READ_MAIL", mailId: mail.id });
    }
  };

  const handleClose = () => {
    dispatch({ type: "SET_PHASE", phase: "game" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📬 邮件</h2>
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}封未读</span>}
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
      </div>

      <div className={styles.content}>
        {mails.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📭</div>
            <div>收件箱空空如也...</div>
            <div className={styles.emptyHint}>随着剧情推进，你会收到各种消息</div>
          </div>
        ) : (
          mails.map((mail) => (
            <div
              key={mail.id}
              className={`${styles.mailCard} ${!mail.read ? styles.unread : ""}`}
              onClick={() => handleOpen(mail)}
            >
              <div className={styles.mailHeader}>
                <span className={styles.fromEmoji}>{mail.fromEmoji}</span>
                <div className={styles.mailMeta}>
                  <div className={styles.from}>{mail.from}</div>
                  <div className={styles.subject}>{mail.subject}</div>
                </div>
                <div className={styles.mailRight}>
                  <span className={styles.week}>第{mail.week}周</span>
                  {!mail.read && <span className={styles.dot} />}
                </div>
              </div>
              {mail.read && (
                <div className={styles.body}>
                  {mail.body.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  {mail.giftItemId && (
                    <div className={styles.giftTag}>📎 附件: 礼物</div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
