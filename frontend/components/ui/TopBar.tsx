"use client";
import { useEffect } from "react";
import { useStatsStore } from "@/lib/store";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const { stats, fetch } = useStatsStore();
  const pathname = usePathname();
  const isLesson = pathname.startsWith("/lesson");

  useEffect(() => { fetch(); }, [fetch]);

  if (isLesson) return null;

  return (
    <header style={{
      borderBottom: "2px solid #e5e5e5",
      background: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "4px",
      padding: "0 20px",
      height: "64px",
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      <StatChip icon="🔥" value={stats?.streak_count ?? 0} color="#FF9600" />
      <StatChip icon="❤️" value={stats?.hearts ?? 5} color="#FF4B4B" />
      <StatChip icon="💎" value={stats?.gems ?? 500} color="#1CB0F6" />
      <StatChip icon="⚡" value={`${stats?.xp_total ?? 0} XP`} color="#58CC02" />
    </header>
  );
}

function StatChip({ icon, value, color }: { icon: string; value: string | number; color: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "5px",
      padding: "6px 12px", borderRadius: "20px",
      background: "#f7f7f7", border: "2px solid #e5e5e5",
      fontWeight: 800, fontSize: "14px", color,
      transition: "transform 0.1s",
    }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span>{value}</span>
    </div>
  );
}
