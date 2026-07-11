"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LeaderboardEntry } from "@/lib/types";

const AVATAR: Record<string, string> = {
  owl: "🦉", bear: "🐻", fox: "🦊", cat: "🐱", dog: "🐶", star: "⭐",
};

function Skeleton() {
  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
      <div className="skeleton" style={{ height: "80px", marginBottom: "24px" }} />
      {[1,2,3,4,5].map(i => (
        <div key={i} className="skeleton" style={{ height: "68px", marginBottom: "10px" }} />
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaderboard().then(setEntries).finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;

  const myEntry = entries.find(e => e.is_current_user);
  const topEntry = entries[0];

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ fontSize: "56px", marginBottom: "8px" }}>🏆</div>
        <h1 style={{ fontWeight: 900, fontSize: "26px", color: "#3c3c3c", marginBottom: "4px" }}>
          Leaderboard
        </h1>
        <p style={{ color: "#afafaf", fontSize: "14px", fontWeight: 600 }}>
          Weekly XP Rankings
        </p>
      </div>

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          gap: "8px", marginBottom: "28px",
        }}>
          {[entries[1], entries[0], entries[2]].map((e, i) => {
            const heights = [80, 100, 70];
            const colors = ["#afafaf", "#FFC800", "#CD7F32"];
            const medals = ["🥈", "🥇", "🥉"];
            return (
              <div key={e.rank} style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: "28px", marginBottom: "4px" }}>{AVATAR[e.avatar_key] ?? "🦉"}</div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#3c3c3c", marginBottom: "4px" }}>
                  {e.display_name}
                </div>
                <div style={{
                  height: `${heights[i]}px`,
                  background: colors[i],
                  borderRadius: "12px 12px 0 0",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: "2px",
                }}>
                  <span style={{ fontSize: "20px" }}>{medals[i]}</span>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "white" }}>
                    {e.xp_total} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {entries.map((entry, idx) => (
          <div key={entry.rank}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              background: entry.is_current_user ? "#e8ffd4" : "white",
              border: entry.is_current_user ? "2px solid #58CC02" : "2px solid #e5e5e5",
              borderRadius: "18px", padding: "14px 18px",
              transition: "transform 0.1s",
              animation: `fadeInDown 0.3s ease ${idx * 0.04}s both`,
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateX(4px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateX(0)")}
          >
            {/* Rank */}
            <div style={{
              width: "36px", textAlign: "center", fontWeight: 900, fontSize: "18px",
              color: entry.rank <= 3 ? ["#FFC800","#afafaf","#CD7F32"][entry.rank-1] : "#afafaf",
              flexShrink: 0,
            }}>
              {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank-1] : entry.rank}
            </div>

            {/* Avatar */}
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: entry.is_current_user ? "#c3f08a" : "#f0f0f0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px", flexShrink: 0,
            }}>
              {AVATAR[entry.avatar_key] ?? "🦉"}
            </div>

            {/* Name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: "15px", color: "#3c3c3c" }}>
                {entry.display_name}
                {entry.is_current_user && (
                  <span style={{
                    marginLeft: "8px", fontSize: "11px", fontWeight: 700,
                    color: "#58CC02", background: "#e8ffd4",
                    padding: "2px 8px", borderRadius: "10px",
                  }}>You</span>
                )}
              </div>
            </div>

            {/* XP bar + value */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontWeight: 900, fontSize: "16px", color: "#FFC800" }}>
                ⚡ {entry.xp_total}
              </div>
              <div style={{ fontSize: "11px", color: "#afafaf", fontWeight: 600 }}>XP</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
