"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/lib/api";
import { Course } from "@/lib/types";
import { useStatsStore } from "@/lib/store";

const FLAG_CODES: Record<string, string> = {
  "English": "gb",
  "Spanish": "es",
  "French": "fr",
  "Japanese": "jp",
  "German": "de",
  "Kannada": "in",
  "Hindi": "in",
};

const LANGUAGE_META: Record<string, { tagline: string; speakers: string; color: string }> = {
  "English":  { tagline: "The world's lingua franca", speakers: "1.5B speakers", color: "#1CB0F6" },
  "Spanish":  { tagline: "Vibrant & widely spoken",   speakers: "500M speakers", color: "#FF9600" },
  "French":   { tagline: "The language of love",       speakers: "280M speakers", color: "#CE82FF" },
  "Japanese": { tagline: "Ancient meets modern",       speakers: "125M speakers", color: "#FF4B4B" },
  "German":   { tagline: "Precise & powerful",         speakers: "130M speakers", color: "#58CC02" },
  "Kannada":  { tagline: "Classical Dravidian tongue", speakers: "50M speakers",  color: "#FFC800" },
  "Hindi":    { tagline: "Heart of Indian culture",    speakers: "600M speakers", color: "#FF6B35" },
};

export default function ChooseLanguagePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { fetch: fetchStats, setActiveCourse } = useStatsStore();

  useEffect(() => {
    api.getCourses().then(setCourses).finally(() => setLoading(false));
  }, []);

  const handleSelect = async (course: Course) => {
    if (selecting !== null) return;
    setSelecting(course.id);
    await api.setActiveCourse(course.id);
    setActiveCourse(course);
    await fetchStats();
    router.push("/");
  };

  const filtered = courses.filter(c =>
    c.language_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "56px 20px 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{
        position: "absolute", top: "-120px", left: "-120px",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(88,204,2,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-80px", right: "-80px",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(28,176,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", animation: "fadeInDown 0.5s ease both" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
          border: "2px solid rgba(255,255,255,0.15)",
          fontSize: 40, marginBottom: 20,
        }}>🦉</div>
        <h1 style={{
          fontWeight: 900, fontSize: "clamp(26px, 5vw, 38px)",
          color: "#ffffff", marginBottom: 10, letterSpacing: "-0.5px",
        }}>
          What do you want to learn?
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: 600 }}>
          Join millions of learners worldwide
        </p>
      </div>

      {/* Search bar */}
      <div style={{
        width: "100%", maxWidth: 480, marginBottom: 36,
        animation: "fadeInDown 0.5s ease 0.1s both",
        position: "relative",
      }}>
        <span style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          fontSize: 18, pointerEvents: "none",
        }}>🔍</span>
        <input
          type="text"
          placeholder="Search a language..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "14px 16px 14px 46px",
            borderRadius: 16, border: "2px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
            color: "#fff", fontSize: 15, fontWeight: 600,
            outline: "none", fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
          onFocus={e => (e.target.style.borderColor = "rgba(88,204,2,0.6)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 20, maxWidth: 900, width: "100%" }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 20, background: "rgba(255,255,255,0.08)" }} />
          ))}
        </div>
      ) : (
        <>
          {filtered.length === 0 ? (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, fontWeight: 700, marginTop: 40 }}>
              No languages found for &quot;{search}&quot;
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
              gap: 20, maxWidth: 900, width: "100%",
            }}>
              {filtered.map((course, idx) => {
                const meta = LANGUAGE_META[course.language_name];
                const isSelecting = selecting === course.id;
                const isHovered = hovered === course.id;
                const accentColor = meta?.color ?? "#58CC02";

                return (
                  <button
                    key={course.id}
                    onClick={() => handleSelect(course)}
                    disabled={selecting !== null}
                    onMouseEnter={() => setHovered(course.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      position: "relative", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 12,
                      padding: "28px 20px 22px",
                      borderRadius: 20, cursor: selecting !== null ? "not-allowed" : "pointer",
                      textAlign: "center", fontFamily: "inherit",
                      border: isSelecting
                        ? `2px solid ${accentColor}`
                        : isHovered
                          ? `2px solid rgba(255,255,255,0.3)`
                          : "2px solid rgba(255,255,255,0.08)",
                      background: isSelecting
                        ? `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`
                        : isHovered
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(12px)",
                      boxShadow: isSelecting
                        ? `0 0 0 4px ${accentColor}33, 0 20px 40px rgba(0,0,0,0.3)`
                        : isHovered
                          ? "0 16px 40px rgba(0,0,0,0.35)"
                          : "0 4px 16px rgba(0,0,0,0.2)",
                      transform: isSelecting ? "scale(1.04)" : isHovered ? "translateY(-6px)" : "translateY(0)",
                      transition: "all 0.2s cubic-bezier(0.34,1.3,0.64,1)",
                      animation: `fadeInDown 0.4s ease ${idx * 0.07}s both`,
                    }}
                  >
                    {/* Enrolled badge */}
                    {course.enrolled && (
                      <div style={{
                        position: "absolute", top: 12, right: 12,
                        background: accentColor, color: "#fff",
                        fontSize: 10, fontWeight: 800,
                        padding: "3px 8px", borderRadius: 20,
                        letterSpacing: "0.5px",
                      }}>
                        {course.xp_in_course > 0 ? `${course.xp_in_course} XP` : "✓ ENROLLED"}
                      </div>
                    )}

                    {/* Flag */}
                    <div style={{
                      width: 80, height: 60, borderRadius: 10,
                      overflow: "hidden",
                      boxShadow: isHovered || isSelecting
                        ? `0 8px 24px rgba(0,0,0,0.4)`
                        : "0 4px 12px rgba(0,0,0,0.3)",
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                      transition: "all 0.2s ease",
                      border: "2px solid rgba(255,255,255,0.15)",
                    }}>
                      <Image
                        src={`https://flagcdn.com/w80/${FLAG_CODES[course.language_name] ?? "un"}.png`}
                        alt={course.language_name}
                        width={80} height={60}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        unoptimized
                      />
                    </div>

                    {/* Language name */}
                    <span style={{
                      fontWeight: 900, fontSize: 17,
                      color: isSelecting ? accentColor : "#ffffff",
                      letterSpacing: "-0.3px",
                      transition: "color 0.2s",
                    }}>
                      {course.language_name}
                    </span>

                    {/* Tagline */}
                    {meta && (
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.3,
                      }}>
                        {meta.tagline}
                      </span>
                    )}

                    {/* Speakers pill */}
                    {meta && (
                      <div style={{
                        background: isSelecting ? `${accentColor}33` : "rgba(255,255,255,0.08)",
                        border: `1px solid ${isSelecting ? accentColor : "rgba(255,255,255,0.12)"}`,
                        borderRadius: 20, padding: "4px 10px",
                        fontSize: 11, fontWeight: 700,
                        color: isSelecting ? accentColor : "rgba(255,255,255,0.5)",
                        transition: "all 0.2s",
                      }}>
                        {meta.speakers}
                      </div>
                    )}

                    {/* Loading spinner or arrow */}
                    {isSelecting ? (
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        border: `3px solid ${accentColor}44`,
                        borderTop: `3px solid ${accentColor}`,
                        animation: "spin 0.7s linear infinite",
                      }} />
                    ) : (
                      <div style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "translateX(0)" : "translateX(-6px)",
                        transition: "all 0.2s ease",
                        fontSize: 13, fontWeight: 800,
                        color: "rgba(255,255,255,0.6)",
                      }}>
                        Start learning →
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      <p style={{
        marginTop: 44, color: "rgba(255,255,255,0.25)",
        fontSize: 13, fontWeight: 600,
        animation: "fadeInDown 0.5s ease 0.5s both",
      }}>
        You can switch languages anytime from the sidebar
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}
