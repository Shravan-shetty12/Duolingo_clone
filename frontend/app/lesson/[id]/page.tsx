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
      background: "#F7F7F7", flexDirection: "column", gap: "16px"
    }}>
      <div style={{ fontSize: "48px", animation: "pulse 1.5s ease-in-out infinite" }}>🦉</div>
      <div style={{ color: "#58CC02", fontSize: "16px", fontWeight: 800 }}>Loading lesson...</div>
    </div>
  );

  if (!lesson || !attempt) return null;

  const exercise = lesson.exercises[currentIdx];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F7", display: "flex", flexDirection: "column" }}>
      <LessonHeader
        current={currentIdx}
        total={lesson.exercises.length}
        hearts={hearts}
        maxHearts={5}
        onQuit={() => router.push("/")}
      />

      <div style={{
        flex: 1, maxWidth: "640px", margin: "0 auto", width: "100%",
        padding: "40px 24px 140px",
        animation: shaking ? "shake 0.4s ease" : undefined,
      }}>
        {/* Exercise type badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "white", border: "2px solid #e5e5e5", borderRadius: "20px",
          padding: "5px 14px", marginBottom: "28px",
          fontSize: "12px", fontWeight: 800, color: "#afafaf",
          textTransform: "uppercase", letterSpacing: "0.8px",
        }}>
          <span>{typeIcon(exercise.type)}</span>
          {typeLabel(exercise.type)}
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

function typeLabel(type: string) {
  const map: Record<string, string> = {
    mcq: "Multiple Choice",
    translate: "Tap the Words",
    fill_blank: "Fill in the Blank",
    type_answer: "Type the Answer",
    match: "Match Pairs",
  };
  return map[type] ?? type;
}

function typeIcon(type: string) {
  const map: Record<string, string> = {
    mcq: "🔤", translate: "👆", fill_blank: "✏️", type_answer: "⌨️", match: "🔗",
  };
  return map[type] ?? "📝";
}
