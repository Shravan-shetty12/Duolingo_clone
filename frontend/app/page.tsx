"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { PathData } from "@/lib/types";
import UnitSection from "@/components/path/UnitSection";
import { useStatsStore } from "@/lib/store";
import FlagImage from "@/components/ui/FlagImage";

function PathSkeleton() {
  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
      <div className="skeleton" style={{ height: "72px", marginBottom: "24px" }} />
      <div className="skeleton" style={{ height: "110px", marginBottom: "28px" }} />
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div className="skeleton" style={{ width: "64px", height: "64px", borderRadius: "50%" }} />
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [path, setPath] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [noActiveCourse, setNoActiveCourse] = useState(false);
  const router = useRouter();
  const { fetch: fetchStats, activeCourse } = useStatsStore();

  useEffect(() => {
    const init = async () => {
      await fetchStats();
      try {
        const p = await api.getPath();
        setPath(p);
      } catch {
        setNoActiveCourse(true);
      }
      setLoading(false);
    };
    init();
  }, [fetchStats]);

  useEffect(() => {
    if (noActiveCourse) router.replace("/choose-language");
  }, [noActiveCourse, router]);

  const handleStartSkill = async (skillId: number) => {
    try {
      const lesson = await api.getNextLesson(skillId);
      router.push(`/lesson/${lesson.id}`);
    } catch {
      alert("No lesson available for this skill.");
    }
  };

  if (loading || noActiveCourse) return <PathSkeleton />;
  if (!path) return null;

  let globalOffset = 0;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
      {/* Active course banner */}
      {activeCourse && (
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          background: "white", border: "2px solid #e5e5e5", borderRadius: "20px",
          padding: "14px 18px", marginBottom: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <FlagImage languageName={activeCourse.language_name} width={40} height={30} borderRadius={6} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: "16px", color: "#3c3c3c" }}>
              {activeCourse.language_name}
            </div>
            <div style={{ fontSize: "12px", color: "#afafaf", fontWeight: 600 }}>Current course</div>
          </div>
          <button onClick={() => router.push("/choose-language")} style={{
            background: "#f0f0f0", border: "none", borderRadius: "12px",
            padding: "8px 14px", fontWeight: 800, fontSize: "12px",
            color: "#3c3c3c", cursor: "pointer", transition: "background 0.1s",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#e5e5e5")}
            onMouseLeave={e => (e.currentTarget.style.background = "#f0f0f0")}
          >
            Switch
          </button>
        </div>
      )}

      <DailyGoalBar />

      {path.units.map((unit) => {
        const section = (
          <UnitSection
            key={unit.id}
            unit={unit}
            globalSkillOffset={globalOffset}
            onStartSkill={handleStartSkill}
          />
        );
        globalOffset += unit.skills.length;
        return section;
      })}

      <div style={{ textAlign: "center", padding: "32px 0 16px", color: "#afafaf" }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🦉</div>
        <div style={{ fontWeight: 700, fontSize: "14px" }}>You've reached the end!</div>
        <div style={{ fontSize: "13px", marginTop: "4px" }}>More content coming soon.</div>
      </div>
    </div>
  );
}

function DailyGoalBar() {
  const stats = useStatsStore(s => s.stats);
  if (!stats) return null;
  const pct = Math.min(100, Math.round((stats.daily_xp_today / stats.daily_goal_xp) * 100));
  const done = pct >= 100;

  return (
    <div style={{
      background: "white", borderRadius: "20px", padding: "18px 20px",
      marginBottom: "28px", border: "2px solid #e5e5e5",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>{done ? "🏆" : "🎯"}</span>
          <span style={{ fontWeight: 800, fontSize: "14px", color: "#3c3c3c" }}>Daily Goal</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: "14px", color: done ? "#58CC02" : "#FF9600" }}>
          {stats.daily_xp_today} / {stats.daily_goal_xp} XP
        </span>
      </div>
      <div style={{ background: "#e5e5e5", borderRadius: "10px", height: "14px", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: done ? "linear-gradient(90deg,#FFC800,#FFE066)" : "linear-gradient(90deg,#58CC02,#89E219)",
          borderRadius: "10px", transition: "width 0.6s ease",
        }} />
      </div>
      {done && (
        <div style={{ textAlign: "center", marginTop: "8px", fontSize: "12px", fontWeight: 700, color: "#58CC02" }}>
          🎉 Daily goal reached!
        </div>
      )}
    </div>
  );
}
