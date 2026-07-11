const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getPath: () => req<import("./types").PathData>("/course/path"),
  getNextLesson: (skillId: number) => req<import("./types").Lesson>(`/lessons/${skillId}/next`),
  startAttempt: (lessonId: number) =>
    req<import("./types").Attempt>(`/attempts?lesson_id=${lessonId}`, { method: "POST" }),
  submitAnswer: (attemptId: number, exerciseId: number, answer: string) =>
    req<import("./types").AnswerResult>(`/attempts/${attemptId}/answer`, {
      method: "POST",
      body: JSON.stringify({ exercise_id: exerciseId, answer }),
    }),
  completeAttempt: (attemptId: number) =>
    req<import("./types").Attempt>(`/attempts/${attemptId}/complete`, { method: "POST" }),
  getStats: () => req<import("./types").Stats>("/me/stats"),
  getProfile: () => req<import("./types").Profile>("/me/profile"),
  getLeaderboard: () => req<import("./types").LeaderboardEntry[]>("/leaderboard"),
  refillHearts: () => req<{ hearts: number }>("/me/hearts/refill", { method: "POST" }),
};
