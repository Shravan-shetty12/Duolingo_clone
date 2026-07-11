interface Props {
  current: number;
  total: number;
  hearts: number;
  maxHearts: number;
  onQuit: () => void;
}

export default function LessonHeader({ current, total, hearts, maxHearts, onQuit }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "16px",
      padding: "14px 20px", borderBottom: "2px solid #e5e5e5",
      background: "white", position: "sticky", top: 0, zIndex: 30,
    }}>
      <button onClick={onQuit} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: "22px", color: "#afafaf", padding: "4px 8px",
        borderRadius: "8px", transition: "background 0.1s", lineHeight: 1,
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "#f0f0f0")}
        onMouseLeave={e => (e.currentTarget.style.background = "none")}
      >✕</button>

      {/* Progress bar */}
      <div style={{
        flex: 1, background: "#e5e5e5", borderRadius: "10px",
        height: "16px", overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%",
          background: "linear-gradient(90deg, #58CC02, #89E219)",
          borderRadius: "10px", transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Shine effect */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "50%",
            background: "rgba(255,255,255,0.3)", borderRadius: "10px 10px 0 0",
          }} />
        </div>
      </div>

      {/* Hearts */}
      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
        {Array.from({ length: maxHearts }).map((_, i) => (
          <span key={i} style={{
            fontSize: "20px",
            opacity: i < hearts ? 1 : 0.2,
            transition: "opacity 0.3s, transform 0.3s",
            transform: i === hearts ? "scale(0.7)" : "scale(1)",
            display: "inline-block",
          }}>❤️</span>
        ))}
      </div>
    </div>
  );
}
