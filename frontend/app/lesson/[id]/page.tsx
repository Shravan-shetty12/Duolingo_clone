"use client";
import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Lesson, Attempt, AnswerResult } from "@/lib/types";
import { useStatsStore } from "@/lib/store";
import LessonHeader from "@/components/lesson/LessonHeader";
import ExerciseRenderer from "@/components/lesson/ExerciseRenderer";
import FeedbackBar from "@/components/lesson/FeedbackBar";
import LessonCompleteModal from "@/components/lesson/LessonCompleteModal";
import OutOfHeartsModal from "@/components/lesson/OutOfHeartsModal";

const TYPE_META: Record<string, { label: string; icon: string; color: string }> = {
  mcq:         { label: "Multiple Choice", icon: "🔤", color: "#1CB0F6" },
  translate:   { label: "Tap the Words",   icon: "👆", color: "#CE82FF" },
  fill_blank:  { label: "Fill in the Blank", icon: "✏️", color: "#FF9600" },
  type_answer: { label: "Type the Answer", icon: "⌨️", color: "#58CC02" },
  match:       { label: "Match Pairs",     icon: "🔗", color: "#FFC800" },
};

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const fetchStats = useStatsStore(s => s.fetch);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [showNoHearts, setShowNoHearts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shaking, setShaking] = useState(false);
  const [xpToast, setXpToast] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const [l, stats] = await Promise.all([
        fetch(`${BASE}/lesson/${id}`).then(r => r.json()),
        api.getStats(),
      ]);
      setLesson(l);
      setHearts(stats.hearts);
      const a = await api.startAttempt(l.id);
      setAttempt(a);
      setLoading(false);
    };
    init().catch(() => setLoading(false));
  }, [id]);

  // Enter key to continue
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && feedback && !showNoHearts) handleContinue();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleAnswer = useCallback(async (answer: string) => {
    if (!attempt || !lesson || feedback) return;
    const exercise = lesson.exercises[currentIdx];
    const result = await api.submitAnswer(attempt.id, exercise.id, answer);
    setFeedback(result);
    setHearts(result.hearts_remaining);
    if (!result.correct) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
    if (result.attempt_status === "failed") {
      setTimeout(() => setShowNoHearts(true), 600);
    }
  }, [attempt, lesson, feedback, currentIdx]);

  const handleContinue = useCallback(async () => {
    if (!lesson || !attempt) return;
    const nextIdx = currentIdx + 1;
    setFeedback(null);
    if (nextIdx >= lesson.exercises.length) {
      const completed = await api.completeAttempt(attempt.id);
      await fetchStats();
      setAttempt(completed);
      setXpToast(completed.xp_earned);
      setTimeout(() => setXpToast(null), 2500);
      setTimeout(() => setShowComplete(true), 300);
    } else {
      setCurrentIdx(nextIdx);
    }
  }, [lesson, attempt, currentIdx, fetchStats]);

  const handleRefillHearts = async () => {
    await api.refillHearts();
    await fetchStats();
    setHearts(5);
    setShowNoHearts(false);
    if (lesson) {
      const a = await api.startAttempt(lesson.id);
      setAttempt(a);
      setCurrentIdx(0);
      setFeedback(null);
    }
  };

  if (loading) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      flexDirection: "column", gap: 20,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        border: "4px solid rgba(88,204,2,0.2)",
        borderTop: "4px solid #58CC02",
        animation: "spin 0.8s linear infinite",
      }} />
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: 700, letterSpacing: "0.5px" }}>
        Loading lesson...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!lesson || !attempt) return null;

  const exercise = lesson.exercises[currentIdx];
  const meta = TYPE_META[exercise.type] ?? { label: exercise.type, icon: "📝", color: "#afafaf" };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f0c29 0%, #1a1740 40%, #24243e 100%)",
      display: "flex", flexDirection: "column",
    }}>
      <LessonHeader
        current={currentIdx}
        total={lesson.exercises.length}
        hearts={hearts}
        maxHearts={5}
        onQuit={() => router.push("/")}
      />

      <div style={{
        flex: 1, maxWidth: 640, margin: "0 auto", width: "100%",
        padding: "36px 24px 160px",
        animation: shaking ? "shake 0.4s ease" : undefined,
      }}>
        {/* Exercise type badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: `${meta.color}18`,
          border: `1.5px solid ${meta.color}40`,
          borderRadius: 20, padding: "6px 14px", marginBottom: 28,
          fontSize: 12, fontWeight: 800,
          color: meta.color,
          textTransform: "uppercase", letterSpacing: "0.8px",
          animation: "fadeInDown 0.3s ease both",
        }}>
          <span>{meta.icon}</span>
          {meta.label}
        </div>

        <ExerciseRenderer
          key={`${exercise.id}-${currentIdx}`}
          exercise={exercise}
          onAnswer={handleAnswer}
          disabled={!!feedback}
        />
      </div>

      {feedback && !showNoHearts && (
        <FeedbackBar
          correct={feedback.correct}
          correctAnswer={feedback.correct_answer}
          onContinue={handleContinue}
        />
      )}

      {xpToast !== null && (
        <div className="xp-toast">⚡ +{xpToast} XP</div>
      )}

      {showComplete && attempt && (
        <LessonCompleteModal
          xpEarned={attempt.xp_earned}
          onContinue={() => router.push("/")}
        />
      )}

      {showNoHearts && (
        <OutOfHeartsModal
          onRefill={handleRefillHearts}
          onQuit={() => router.push("/")}
        />
      )}
    </div>
  );
}
