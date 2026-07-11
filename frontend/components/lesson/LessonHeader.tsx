"use client";
import { useEffect, useState } from "react";

interface Props {
  current: number;
  total: number;
  hearts: number;
  maxHearts: number;
  onQuit: () => void;
}

export default function LessonHeader({ current, total, hearts, maxHearts, onQuit }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  const [prevHearts, setPrevHearts] = useState(hearts);
  const [lostIdx, setLostIdx] = useState<number | null>(null);

  useEffect(() => {
    if (hearts < prevHearts) {
      setLostIdx(hearts); // the heart that just disappeared
      setTimeout(() => setLostIdx(null), 600);
    }
    setPrevHearts(hearts);
  }, [hearts, prevHearts]);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 20px",
      background: "rgba(15,12,41,0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      position: "sticky", top: 0, zIndex: 30,
    }}>
      {/* Quit button */}
      <button onClick={onQuit} style={{
        background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)",
        cursor: "pointer", fontSize: 16, color: "rgba(255,255,255,0.5)",
        padding: "6px 10px", borderRadius: 10, lineHeight: 1,
        transition: "all 0.15s", flexShrink: 0,
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,75,75,0.15)";
          (e.currentTarget as HTMLElement).style.color = "#FF4B4B";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,75,75,0.3)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
        }}
      >✕</button>

      {/* Progress bar */}
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{
          background: "rgba(255,255,255,0.08)", borderRadius: 10,
          height: 14, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: "linear-gradient(90deg, #46A302, #58CC02, #89E219)",
            borderRadius: 10,
            transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: pct > 0 ? "0 0 12px rgba(88,204,2,0.6)" : "none",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "45%",
              background: "rgba(255,255,255,0.25)", borderRadius: "10px 10px 0 0",
            }} />
          </div>
        </div>
        {/* Counter */}
        <div style={{
          position: "absolute", right: 0, top: -18,
          fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.5px",
        }}>
          {current}/{total}
        </div>
      </div>

      {/* Hearts */}
      <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
        {Array.from({ length: maxHearts }).map((_, i) => {
          const active = i < hearts;
          const justLost = i === lostIdx;
          return (
            <span key={i} style={{
              fontSize: 18,
              filter: active ? "none" : "grayscale(1)",
              opacity: active ? 1 : 0.2,
              transition: "all 0.3s",
              transform: justLost ? "scale(1.6)" : "scale(1)",
              display: "inline-block",
            }}>❤️</span>
          );
        })}
      </div>
    </div>
  );
}
