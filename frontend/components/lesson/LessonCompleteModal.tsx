interface Props {
  xpEarned: number;
  onContinue: () => void;
}

export default function LessonCompleteModal({ xpEarned, onContinue }: Props) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 16,
    }}>
      <div style={{
        background: "linear-gradient(160deg, rgba(30,27,60,0.98), rgba(20,18,45,0.98))",
        border: "1.5px solid rgba(255,255,255,0.1)",
        borderRadius: 28, padding: "44px 36px",
        textAlign: "center", maxWidth: 400, width: "100%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(88,204,2,0.1)",
      }} className="animate-pop-in">

        {/* Emoji burst */}
        <div style={{ fontSize: 72, marginBottom: 8, lineHeight: 1, position: "relative" }}
          className="animate-bounce-in">
          🎉
          <span style={{ position: "absolute", top: -8, right: -8, fontSize: 28 }}>⭐</span>
          <span style={{ position: "absolute", bottom: -4, left: -4, fontSize: 22 }}>✨</span>
        </div>

        <h2 style={{
          fontWeight: 900, fontSize: 30,
          background: "linear-gradient(135deg, #58CC02, #89E219)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 6,
        }}>
          Lesson Complete!
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 32, fontSize: 15, fontWeight: 600 }}>
          Amazing work! Keep the streak going!
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          {[
            { icon: "⚡", label: "XP Earned", value: `+${xpEarned}`, color: "#FFC800" },
            { icon: "🔥", label: "Streak", value: "Active", color: "#FF9600" },
            { icon: "💎", label: "Status", value: "Perfect", color: "#CE82FF" },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, padding: "14px 8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontWeight: 900, fontSize: 16, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700, marginTop: 2 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <button onClick={onContinue}
          style={{
            width: "100%", padding: "16px 24px", borderRadius: 16,
            border: "none", borderBottom: "4px solid #46A302",
            background: "linear-gradient(135deg, #58CC02, #46A302)",
            color: "#fff", fontWeight: 800, fontSize: 16,
            letterSpacing: "0.8px", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 0 24px rgba(88,204,2,0.4)",
            transition: "filter 0.1s, transform 0.1s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.filter = "none";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
