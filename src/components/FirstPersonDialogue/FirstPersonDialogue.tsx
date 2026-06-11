// src/components/FirstPersonDialogue/FirstPersonDialogue.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { FPDialogueLine } from "../../types/game";
import styles from "./FirstPersonDialogue.module.css";

export default function FirstPersonDialogue() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const scene = state.fpDialogueScene;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const lastClickRef = useRef(0);

  useEffect(() => {
    if (!scene) return;
    setCurrentIndex(0);
    setDisplayedText("");
    setCharIndex(0);
    setIsTyping(true);
    setShowChoices(false);
    setFeedback(null);
  }, [scene?.id]);

  // Typewriter effect
  useEffect(() => {
    if (!scene || currentIndex >= scene.lines.length) return;
    const line = scene.lines[currentIndex];
    if (charIndex < line.text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(line.text.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 40);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [scene, currentIndex, charIndex]);

  // Show choices after last line
  useEffect(() => {
    if (!scene) return;
    if (currentIndex >= scene.lines.length && scene.choices && scene.choices.length > 0) {
      setShowChoices(true);
    }
  }, [currentIndex, scene]);

  const handleAdvance = useCallback(() => {
    if (!scene) return;
    // Debounce: prevent rapid multi-clicks
    const now = Date.now();
    if (now - lastClickRef.current < 300) return;
    lastClickRef.current = now;

    if (isTyping) {
      // Skip to end of current text
      const line = scene.lines[currentIndex];
      setDisplayedText(line.text);
      setCharIndex(line.text.length);
      setIsTyping(false);
      return;
    }
    if (currentIndex < scene.lines.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDisplayedText("");
      setCharIndex(0);
      setIsTyping(true);
    } else {
      setCurrentIndex(scene.lines.length);
    }
  }, [scene, currentIndex, isTyping]);

  const handleChoice = useCallback(
    (choiceIndex: number) => {
      if (!scene || !scene.choices) return;
      const choice = scene.choices[choiceIndex];
      setFeedback(choice.feedback ?? null);
      setShowChoices(false);

      dispatch({
        type: "APPLY_CHOICE",
        effects: choice.effects ?? [],
        feedback: choice.feedback ?? "",
        flags: choice.setFlags,
        eventId: scene.id,
        eventTitle: scene.title,
        meetNpcId: choice.meetNpcId,
      });

      setTimeout(() => {
        handleComplete();
      }, 1500);
    },
    [scene, dispatch]
  );

  const handleComplete = useCallback(() => {
    if (!scene || !scene.onComplete) {
      dispatch({ type: "END_FP_DIALOGUE" });
      return;
    }
    const { flags, effects, meetNpcIds } = scene.onComplete;
    const primaryMeetNpcId = meetNpcIds?.[0];

    dispatch({
      type: "APPLY_CHOICE",
      effects: effects ?? [],
      feedback: "",
      flags: flags ?? [],
      eventId: scene.id,
      eventTitle: scene.title,
      meetNpcId: primaryMeetNpcId,
    });

    // Remaining NPCs marked as met without individual CG
    if (meetNpcIds && meetNpcIds.length > 1) {
      meetNpcIds.slice(1).forEach((id) => {
        dispatch({ type: "MEET_NPC", npcId: id });
      });
    }

    // Affinity gain
    if (scene.onComplete.affinityGain) {
      dispatch({
        type: "UPDATE_AFFINITY",
        npcId: scene.onComplete.affinityGain.npcId,
        delta: scene.onComplete.affinityGain.delta,
      });
    }

    dispatch({ type: "END_FP_DIALOGUE" });
  }, [scene, dispatch]);

  useEffect(() => {
    if (!scene) {
      dispatch({ type: "END_FP_DIALOGUE" });
    }
  }, [scene, dispatch]);

  if (!scene) {
    return null;
  }

  const currentLine: FPDialogueLine | null =
    currentIndex < scene.lines.length ? scene.lines[currentIndex] : null;

  const isNarrator = currentLine?.side === "center";
  const isFinished = currentIndex >= scene.lines.length;

  return (
    <div className={styles.container} onClick={handleAdvance}>
      {/* Background */}
      <div className={styles.background}>
        <div className={styles.bgGradient} />
        <div className={styles.sakuraParticles}>
          <span className={styles.petal1}>🌸</span>
          <span className={styles.petal2}>🌸</span>
          <span className={styles.petal3}>🌸</span>
          <span className={styles.petal4}>💮</span>
          <span className={styles.petal5}>🌸</span>
        </div>
      </div>

      {/* Scene title */}
      <div className={styles.sceneTitle}>{scene.title}</div>

      {/* Character portrait area */}
      {currentLine && !isNarrator && (
        <div
          className={`${styles.portraitArea} ${
            currentLine.side === "left" ? styles.portraitLeft : styles.portraitRight
          }`}
        >
          <div className={styles.portrait}>
            {currentLine.avatar ? (
              <img src={`${import.meta.env.BASE_URL}${currentLine.avatar}`} alt={currentLine.speakerName} className={styles.portraitImg} />
            ) : (
              <div className={styles.portraitEmoji}>{currentLine.speakerEmoji}</div>
            )}
            <div className={styles.portraitName}>{currentLine.speakerName}</div>
          </div>
        </div>
      )}

      {isNarrator && currentLine && (
        <div className={styles.narratorCenter}>
          <div className={styles.narratorText}>{displayedText}</div>
        </div>
      )}

      {/* Dialogue box */}
      {currentLine && !isNarrator && (
        <div className={styles.dialogueBox}>
          <div className={styles.speakerTag}>
            <span className={styles.speakerEmoji}>{currentLine.speakerEmoji}</span>
            {currentLine.speakerName}
          </div>
          <div className={styles.dialogueText}>
            {displayedText}
            {isTyping && <span className={styles.cursor}>|</span>}
          </div>
          {!isTyping && (
            <div className={styles.continueHint}>▼ 点击继续</div>
          )}
        </div>
      )}

      {/* End of scene */}
      {isFinished && !showChoices && !feedback && (
        <div className={styles.dialogueBox}>
          <div className={styles.dialogueText} style={{ textAlign: "center" }}>
            点击继续……
          </div>
          <div className={styles.continueHint}>▼</div>
        </div>
      )}

      {/* Choices */}
      {showChoices && scene.choices && (
        <div className={styles.choicesOverlay}>
          <div className={styles.choicesTitle}>—— 你的选择 ——</div>
          <div className={styles.choicesList}>
            {scene.choices.map((choice, i) => (
              <button
                key={i}
                className={styles.choiceBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChoice(i);
                }}
              >
                <span className={styles.choiceLabel}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={styles.feedbackOverlay}>
          <div className={styles.feedbackText}>{feedback}</div>
        </div>
      )}

      {/* End-of-scene click-to-continue */}
      {isFinished && !showChoices && !feedback && (
        <button
          className={styles.continueBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
        >
          继续
        </button>
      )}
    </div>
  );
}
