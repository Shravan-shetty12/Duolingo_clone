import { Skill } from "@/lib/types";

interface Props {
  skill: Skill;
  index: number;
  onStart: (skillId: number) => void;
}

const X_PATTERN = [0, 60, 100, 60, 0, -60, -100, -60];

function ProgressRing({ crowns, total, color }: { crowns: number; total: number; color: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const filled = total > 0 ? (crowns / total) * circ : 0;
  return (
    <svg width="76" height="76" style={{ position: "absolute", top: -6, left: -6, pointerEvents: "none" }}>
      <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="5" />
      {crowns > 0 && (
        <circle cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 38 38)"
          style={{ transition: "stroke-dasharray 0.5s ease" }}
        />
      )}
    </svg>
  );
}

export default function SkillNode({ skill, index, onStart }: Props) {
  const xOffset = X_PATTERN[index % X_PATTERN.length];
  const isLocked = skill.status === "locked";
  const isCompleted = skill.status === "completed";
  const isAvailable = skill.status === "available";

  const bgColor = isLocked ? "#e5e5e5" : isCompleted ? "#FFC800" : "#58CC02";
  const shadowColor = isLocked ? "#c0c0c0" : isCompleted ? "#E6A800" : "#46A302";
  const ringColor = isCompleted ? "#FF9600" : "#FFC800";

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
      <div style={{ transform: `translateX(${xOffset}px)`, position: "relative", textAlign: "center" }}>
        {/* Pulse ring for available skill */}
        {isAvailable && (
          <div style={{
            position: "absolute", inset: "-8px", borderRadius: "50%",
            border: "3px solid #58CC02", opacity: 0.4,
            animation: "pulse 2s ease-in-out infinite",
          }} />
        )}

        <button
          disabled={isLocked}
          onClick={() => !isLocked && onStart(skill.id)}
          style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: bgColor,
            border: "none",
            boxShadow: `0 6px 0 ${shadowColor}`,
            cursor: isLocked ? "not-allowed" : "pointer",
            fontSize: "26px",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            transition: "transform 0.15s, box-shadow 0.15s",
            outline: "none",
          }}
          onMouseEnter={e => {
            if (!isLocked) {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1) translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 0 ${shadowColor}`;
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1) translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 0 ${shadowColor}`;
          }}
          onMouseDown={e => {
            if (!isLocked) {
              (e.currentTarget as HTMLElement).style.transform = "scale(0.96) translateY(4px)";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 0 ${shadowColor}`;
            }
          }}
          onMouseUp={e => {
            if (!isLocked) {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1) translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 0 ${shadowColor}`;
            }
          }}
          title={skill.title}
        >
          {isLocked ? "🔒" : skill.icon_key}
          <ProgressRing crowns={skill.crowns} total={skill.total_levels} color={ringColor} />
        </button>

        {/* Crown badge */}
        {!isLocked && skill.crowns > 0 && (
          <div style={{
            position: "absolute", top: "-6px", right: "-10px",
            background: "#FFC800", borderRadius: "12px",
            fontSize: "10px", fontWeight: 900, padding: "2px 6px",
            color: "#7A5800", border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}>
            {skill.crowns}/{skill.total_levels}
          </div>
        )}

        {/* Label */}
        <div style={{
          marginTop: "8px", fontSize: "12px", fontWeight: 800,
          color: isLocked ? "#afafaf" : "#3c3c3c",
          maxWidth: "88px", lineHeight: "1.3",
          textShadow: isLocked ? "none" : "0 1px 0 rgba(255,255,255,0.8)",
        }}>
          {skill.title}
        </div>
      </div>
    </div>
  );
}
