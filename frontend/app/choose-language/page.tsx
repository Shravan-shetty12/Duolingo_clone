"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Course } from "@/lib/types";
import { useStatsStore } from "@/lib/store";

const LANG_DESCRIPTIONS: Record<string, string> = {
  English: "1.5B+ speakers · Global language",
  Spanish: "500M+ speakers · Latin America & Spain",
  French: "300M+ speakers · Europe & Africa",
  Japanese: "125M+ speakers · Japan",
  German: "100M+ speakers · Europe",
};

const LANG_BG: Record<string, string> = {
  English: "linear-gradient(135deg,#58CC02,#46A302)",
  Spanish: "linear-gradient(135deg,#FF9600,#FF6B00)",
  French: "linear-gradient(135deg,#1CB0F6,#0099D9)",
  Japanese: "linear-gradient(135deg,#FF4B4B,#CC0000)",
  German: "linear-gradient(135deg,#3C3C3C,#1a1a1a)",
};

export default function ChooseLanguagePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<number | null>(null);
  const router = useRouter();
  const { fetch: fetchStats, setActiveCourse } = useStatsStore();

  useEffect(() => {
    api.getCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  const handleSelect = async (course: Course) => {
    setSelecting(course.id);
    await api.setActiveCourse(course.id);
    setActiveCourse(course);
    await fetchStats();
    router.push("/");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(160deg,#f0fff4,#e8f4ff)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-start", padding: "48px 16px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{ fontSize: "64px", marginBottom: "12px" }}>🦉</div>
        <h1 style={{ fontWeight: 900, fontSize: "32px", color: "#3c3c3c", marginBottom: "8px" }}>
          What do you want to learn?
        </h1>
        <p style={{ color: "#afafaf", fontSize: "16px", fontWeight: 600 }}>
          Choose a language to start your journey
        </p>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px", maxWidth: "600px", width: "100%" }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: "140px", borderRadius: "20px" }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px", maxWidth: "640px", width: "100%",
        }}>
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => handleSelect(course)}
              disabled={selecting !== null}
              style={{
                background: selecting === course.id
                  ? LANG_BG[course.language_name] ?? "linear-gradient(135deg,#58CC02,#46A302)"
                  : "white",
                border: course.enrolled ? "3px solid #58CC02" : "2px solid #e5e5e5",
                borderBottom: course.enrolled ? "5px solid #46A302" : "4px solid #d0d0d0",
                borderRadius: "20px",
                padding: "24px 20px",
                cursor: selecting !== null ? "not-allowed" : "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                if (selecting === null) {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Enrolled badge */}
              {course.enrolled && (
                <div style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: "#58CC02", color: "white", fontSize: "11px",
                  fontWeight: 800, padding: "3px 10px", borderRadius: "20px",
                }}>
                  {course.xp_in_course > 0 ? `${course.xp_in_course} XP` : "Enrolled"}
                </div>
              )}

              <div style={{ fontSize: "48px", marginBottom: "10px" }}>{course.flag_emoji}</div>
              <div style={{
                fontWeight: 900, fontSize: "20px",
                color: selecting === course.id ? "white" : "#3c3c3c",
                marginBottom: "4px",
              }}>
                {course.language_name}
              </div>
              <div style={{
                fontSize: "12px", fontWeight: 600,
                color: selecting === course.id ? "rgba(255,255,255,0.8)" : "#afafaf",
              }}>
                {LANG_DESCRIPTIONS[course.language_name] ?? ""}
              </div>

              {selecting === course.id && (
                <div style={{
                  marginTop: "12px", color: "white", fontWeight: 800,
                  fontSize: "13px", display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <span style={{ animation: "pulse 1s infinite" }}>⏳</span> Starting...
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <p style={{ marginTop: "40px", color: "#afafaf", fontSize: "13px", fontWeight: 600 }}>
        You can switch languages anytime from the sidebar
      </p>
    </div>
  );
}
