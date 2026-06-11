import { useState, useEffect, useRef, useCallback } from "react";
import { useGameState, useGameDispatch } from "../../context/GameContext";
import { ExamResult, ExamQuestion } from "../../types/game";
import styles from "./ExamScreen.module.css";

const SECTION_LABELS: Record<string, { name: string; icon: string }> = {
  grammar: { name: "语法", icon: "📐" },
  vocabulary: { name: "词汇", icon: "📖" },
  reading: { name: "阅读", icon: "📰" },
  cloze: { name: "完形", icon: "🧩" },
};

function generateScore(correct: number, total: number, passed: boolean): number {
  if (passed) {
    const minPass = Math.ceil(total * 0.6);
    const base = 425 + Math.floor(((correct - minPass) / (total - minPass)) * 285);
    return Math.min(710, Math.max(425, base + Math.floor(Math.random() * 40 - 20)));
  } else {
    return Math.max(200, Math.min(424, Math.floor((correct / total) * 420) + Math.floor(Math.random() * 40 - 20)));
  }
}

function getSectionStats(questions: ExamQuestion[], answers: { questionId: string; selected: number }[]) {
  const sections: Record<string, { total: number; correct: number }> = {};
  for (const q of questions) {
    if (!sections[q.section]) sections[q.section] = { total: 0, correct: 0 };
    sections[q.section].total++;
    const ans = answers.find((a) => a.questionId === q.id);
    if (ans && ans.selected === q.answer) sections[q.section].correct++;
  }
  return sections;
}

export default function ExamScreen() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const exam = state.currentExam;
  const [timeLeft, setTimeLeft] = useState<number>(exam?.timeRemaining ?? 1800);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const timerStartedRef = useRef(false);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(timerRef.current);

    if (!exam) return;

    const answers = exam.answers.map((a) => {
      const q = exam.questions.find((q) => q.id === a.questionId)!;
      return { questionId: a.questionId, selected: a.selected, correct: a.selected === q.answer };
    });
    const correct = answers.filter((a) => a.correct).length;
    const passed = correct >= 6;
    const score = generateScore(correct, exam.questions.length, passed);

    const result: ExamResult = {
      examId: exam.examId,
      correctCount: correct,
      totalCount: exam.questions.length,
      passed,
      score,
      answers,
    };

    setTimeout(() => {
      dispatch({ type: "FINISH_EXAM", result });
    }, 500);
  }, [submitted, exam, dispatch]);

  useEffect(() => {
    if (timerStartedRef.current) return;
    timerStartedRef.current = true;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted, handleSubmit]);

  if (!exam) {
    dispatch({ type: "SET_PHASE", phase: "game" });
    return null;
  }

  const { questions, answers } = exam;
  const currentIndex = answers.length; // Show the next unanswered question
  const safeIndex = Math.min(currentIndex, questions.length - 1);
  const currentQ = questions[safeIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQ?.id);
  const selectedAnswer = currentAnswer?.selected;

  const correctCount = answers.filter((a) => {
    const q = questions.find((q) => q.id === a.questionId);
    return q && a.selected === q.answer;
  }).length;

  const sectionStats = getSectionStats(questions, answers);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPct = (answers.length / questions.length) * 100;

  const handleSelect = (index: number) => {
    if (submitted) return;
    dispatch({ type: "ANSWER_EXAM", questionId: currentQ.id, selected: index });
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.submittedCard}>
          <div className={styles.submittedIcon}>📝</div>
          <div className={styles.submittedTitle}>考试结束</div>
          <div className={styles.submittedSub}>
            共作答 {answers.length}/{questions.length} 题，正在批改试卷...
          </div>
          <div className={styles.submittedBar}>
            <div className={styles.submittedBarFill} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <span className={styles.examName}>📝 英语四级 · CET-4</span>
          {currentQ && (
            <span className={styles.sectionTag}>
              {SECTION_LABELS[currentQ.section]?.icon} {SECTION_LABELS[currentQ.section]?.name}
            </span>
          )}
        </div>
        <span className={`${styles.timer} ${timeLeft < 300 ? styles.timerLow : ""}`}>
          ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>
      <div className={styles.progress}>
        第 {Math.min(answers.length + 1, questions.length)}/{questions.length} 题
        <span className={styles.progressRight}>
          已答 {answers.length} | 正确 {correctCount}
        </span>
      </div>

      {/* Section progress */}
      <div className={styles.sectionProgress}>
        {Object.entries(sectionStats).map(([key, stats]) => (
          <span key={key} className={styles.sectionDot}>
            {SECTION_LABELS[key]?.icon} {stats.correct}/{stats.total}
          </span>
        ))}
      </div>

      {/* Question card */}
      {currentQ && (
        <div className={styles.questionCard}>
          <div className={styles.questionMeta}>
            <span className={styles.questionSection}>
              {SECTION_LABELS[currentQ.section]?.icon} {SECTION_LABELS[currentQ.section]?.name}
            </span>
            <span className={styles.questionDiff}>
              {"⭐".repeat(currentQ.difficulty)}
            </span>
          </div>
          <div className={styles.stem}>{currentQ.stem}</div>
          <div className={styles.options}>
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                className={`${styles.option} ${selectedAnswer === i ? styles.optionSelected : ""}`}
                onClick={() => handleSelect(i)}
              >
                <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question navigator */}
      <div className={styles.questionGrid}>
        {questions.map((q, i) => {
          const a = answers.find((a) => a.questionId === q.id);
          const isCurrent = i === safeIndex;
          const isCorrect = a && a.selected === q.answer;
          return (
            <div
              key={q.id}
              className={`${styles.qGridItem} ${isCurrent ? styles.qGridCurrent : ""} ${
                a ? (isCorrect ? styles.qGridCorrect : styles.qGridWrong) : styles.qGridPending
              }`}
            >
              {i + 1}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      <div className={styles.footer}>
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={answers.length < questions.length}
        >
          {answers.length < questions.length
            ? `还差 ${questions.length - answers.length} 题未答`
            : "交卷"}
        </button>
      </div>
    </div>
  );
}
