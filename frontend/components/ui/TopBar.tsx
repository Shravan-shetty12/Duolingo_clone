"use client";
import { useEffect } from "react";
import { useStatsStore } from "@/lib/store";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const { stats, fetch } = useStatsStore();
  const pathname = usePathname();
  const isLesson = pathname.startsWith("/lesson");
  const isChoose = pathname.startsWith("/choose-language");

  useEffect(() => { fetch(); }, [fetch]);

  if (isChoose) return null;

  return (
    <header style={{
      borderBottom: isLesson ? "1px solid rgba(255,255,255,0.08)" : "2px solid #e5e5e5",
      background: isLesson ? "rgba(15,12,41,0.97)" : "white",
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

function StatChip({ icon, value, color, dark }: { icon: string; value: string | number; color: string; dark?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "5px",
      padding: "6px 12px", borderRadius: "20px",
      background: dark ? "rgba(255,255,255,0.06)" : "#f7f7f7",
      border: dark ? "1.5px solid rgba(255,255,255,0.1)" : "2px solid #e5e5e5",
      fontWeight: 800, fontSize: "14px", color,
      transition: "transform 0.1s",
    }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span>{value}</span>
    </div>
  );
}
