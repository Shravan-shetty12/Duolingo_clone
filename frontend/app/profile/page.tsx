"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Profile } from "@/lib/types";

function Skeleton() {
  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div className="skeleton" style={{ width: "88px", height: "88px", borderRadius: "50%", margin: "0 auto 12px" }} />
        <div className="skeleton" style={{ height: "24px", width: "140px", margin: "0 auto 8px" }} />
        <div className="skeleton" style={{ height: "16px", width: "100px", margin: "0 auto" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: "90px" }} />)}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile().then(setProfile).finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;
  if (!profile) return null;

  const { stats, achievements } = profile;
  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
      {/* Profile header */}
      <div style={{
        background: "linear-gradient(135deg, #58CC02, #46A302)",
        borderRadius: "24px", padding: "28px 24px",
        textAlign: "center", marginBottom: "20px",
        boxShadow: "0 6px 0 #3A8A00", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: "-20px", top: "-20px",
          width: "120px", height: "120px", borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }} />
        <div style={{
          width: "88px", height: "88px", borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
          border: "4px solid rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "44px", margin: "0 auto 14px",
        }}>🦉</div>
        <h1 style={{ fontWeight: 900, fontSize: "24px", color: "white", marginBottom: "4px" }}>
          {profile.username}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 600 }}>
          🇪🇸 Spanish Learner
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        <StatCard icon="🔥" label="Day Streak" value={stats.streak_count} color="#FF9600" bg="#FFF3E0" />
        <StatCard icon="⚡" label="Total XP" value={stats.xp_total} color="#FFC800" bg="#FFF9E6" />
        <StatCard icon="🏆" label="Best Streak" value={stats.longest_streak} color="#CE82FF" bg="#F5EEFF" />
        <StatCard icon="❤️" label="Hearts" value={`${stats.hearts}/${stats.max_hearts}`} color="#FF4B4B" bg="#FFE8E8" />
      </div>

      {/* Daily goal */}
      <div style={{
        background: "white", borderRadius: "20px", padding: "18px 20px",
        marginBottom: "20px", border: "2px solid #e5e5e5",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🎯</span>
            <span style={{ fontWeight: 800, fontSize: "14px", color: "#3c3c3c" }}>Daily Goal</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: "14px", color: "#58CC02" }}>
            {stats.daily_xp_today}/{stats.daily_goal_xp} XP
          </span>
        </div>
        <div style={{ background: "#e5e5e5", borderRadius: "10px", height: "14px", overflow: "hidden" }}>
          <div style={{
            width: `${Math.min(100, (stats.daily_xp_today / stats.daily_goal_xp) * 100)}%`,
            height: "100%",
            background: "linear-gradient(90deg, #58CC02, #89E219)",
            borderRadius: "10px", transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* Achievements */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "14px",
      }}>
        <h2 style={{ fontWeight: 900, fontSize: "18px", color: "#3c3c3c" }}>Achievements</h2>
        <span style={{
          background: "#e8ffd4", color: "#46A302", fontWeight: 800,
          fontSize: "13px", padding: "4px 12px", borderRadius: "20px",
          border: "2px solid #c3f08a",
        }}>
          {earnedCount}/{achievements.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {achievements.map((a, i) => (
          <div key={a.key} style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: a.earned ? "white" : "#fafafa",
            border: a.earned ? "2px solid #FFC800" : "2px solid #e5e5e5",
            borderRadius: "18px", padding: "16px 18px",
            opacity: a.earned ? 1 : 0.55,
            transition: "transform 0.1s",
            animation: `fadeInDown 0.3s ease ${i * 0.05}s both`,
          }}
            onMouseEnter={e => { if (a.earned) (e.currentTarget.style.transform = "translateX(4px)"); }}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateX(0)")}
          >
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px",
              background: a.earned ? "#FFF9E6" : "#f0f0f0",
              border: a.earned ? "2px solid #FFC800" : "2px solid #e5e5e5",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px", flexShrink: 0,
            }}>
              {a.icon_key}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "14px", color: "#3c3c3c" }}>{a.title}</div>
              <div style={{ fontSize: "12px", color: "#afafaf", marginTop: "2px" }}>{a.description}</div>
            </div>
            {a.earned && (
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "#FFC800", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "14px", flexShrink: 0,
              }}>✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: {
  icon: string; label: string; value: string | number; color: string; bg: string;
}) {
  return (
    <div style={{
      background: bg, border: `2px solid ${color}22`,
      borderRadius: "20px", padding: "18px 16px", textAlign: "center",
    }}>
      <div style={{ fontSize: "30px", marginBottom: "6px" }}>{icon}</div>
      <div style={{ fontWeight: 900, fontSize: "24px", color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#afafaf", fontWeight: 700, marginTop: "4px" }}>{label}</div>
    </div>
  );
}
