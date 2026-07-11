"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Course } from "@/lib/types";
import { useStatsStore } from "@/lib/store";

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
      minHeight: "100vh",
      background: "linear-gradient(160deg,#f0fff4 0%,#e8f4ff 50%,#fff9e6 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "48px 16px 80px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{ fontSize: "72px", marginBottom: "12px", lineHeight: 1 }}>🦉</div>
        <h1 style={{ fontWeight: 900, fontSize: "34px", color: "#3c3c3c", marginBottom: "10px" }}>
          What do you want to learn?
        </h1>
        <p style={{ color: "#afafaf", fontSize: "16px", fontWeight: 600 }}>
          Choose a language to start your journey
        </p>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "16px", maxWidth: "900px", width: "100%" }}>
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="skeleton" style={{ height: "140px", borderRadius: "20px" }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: "16px", maxWidth: "900px", width: "100%",
        }}>
          {courses.map((course, idx) => {
            const isSelecting = selecting === course.id;
            return (
              <button
                key={course.id}
                onClick={() => handleSelect(course)}
                disabled={selecting !== null}
                style={{
                  background: isSelecting ? "#58CC02" : "white",
                  border: course.enrolled ? "3px solid #58CC02" : "2px solid #e5e5e5",
                  borderBottom: course.enrolled ? "5px solid #46A302" : "4px solid #d0d0d0",
                  borderRadius: "20px",
                  padding: "24px 16px 20px",
                  cursor: selecting !== null ? "not-allowed" : "pointer",
                  textAlign: "center",
                  transition: "all 0.15s",
                  position: "relative",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "10px",
                  animation: `fadeInDown 0.35s ease ${idx * 0.06}s both`,
                }}
                onMouseEnter={e => {
                  if (!selecting) {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-5px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
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
                    position: "absolute", top: "10px", right: "10px",
                    background: "#e8ffd4", color: "#46A302",
                    fontSize: "10px", fontWeight: 800,
                    padding: "2px 8px", borderRadius: "20px",
                    border: "2px solid #c3f08a",
                  }}>
                    {course.xp_in_course > 0 ? `${course.xp_in_course} XP` : "✓"}
                  </div>
                )}

                {/* Flag emoji */}
                <span style={{ fontSize: "52px", lineHeight: 1 }}>{course.flag_emoji}</span>

                {/* Language name */}
                <span style={{
                  fontWeight: 800, fontSize: "15px",
                  color: isSelecting ? "white" : "#3c3c3c",
                  lineHeight: 1.2,
                }}>
                  {course.language_name}
                </span>

                {isSelecting && (
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
                    Starting...
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <p style={{ marginTop: "40px", color: "#afafaf", fontSize: "13px", fontWeight: 600 }}>
        You can switch languages anytime from the sidebar
      </p>
    </div>
  );
}
