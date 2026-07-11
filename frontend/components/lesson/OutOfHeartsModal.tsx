interface Props {
  onRefill: () => void;
  onQuit: () => void;
}

export default function OutOfHeartsModal({ onRefill, onQuit }: Props) {
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
        border: "1.5px solid rgba(255,75,75,0.2)",
        borderRadius: 28, padding: "44px 36px",
        textAlign: "center", maxWidth: 380, width: "100%",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,75,75,0.08)",
      }} className="animate-pop-in">

        <div style={{ fontSize: 72, marginBottom: 8, lineHeight: 1 }}
          className="animate-bounce-in">💔</div>

        <h2 style={{
          fontWeight: 900, fontSize: 26,
          color: "#FF6B6B", marginBottom: 8,
        }}>
          Out of Hearts!
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.4)", marginBottom: 28,
          fontSize: 15, fontWeight: 600, lineHeight: 1.6,
        }}>
          You ran out of hearts. Refill and try again!
        </p>

        {/* Empty hearts */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 8, marginBottom: 32,
          padding: "16px", background: "rgba(255,75,75,0.06)",
          borderRadius: 16, border: "1px solid rgba(255,75,75,0.1)",
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{
              fontSize: 28, filter: "grayscale(1)", opacity: 0.2,
              animation: `fadeInDown 0.3s ease ${i * 0.08}s both`,
              display: "inline-block",
            }}>❤️</span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={onRefill}
            style={{
              width: "100%", padding: "16px 24px", borderRadius: 16,
              border: "none", borderBottom: "4px solid #C41E1E",
              background: "linear-gradient(135deg, #FF4B4B, #EA2B2B)",
              color: "#fff", fontWeight: 800, fontSize: 15,
              letterSpacing: "0.8px", textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 0 20px rgba(255,75,75,0.3)",
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
            ❤️ Refill Hearts & Retry
          </button>
          <button onClick={onQuit}
            style={{
              width: "100%", padding: "14px 24px", borderRadius: 16,
              border: "1.5px solid rgba(255,255,255,0.1)",
              borderBottom: "3px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.4)", fontWeight: 800, fontSize: 15,
              letterSpacing: "0.8px", textTransform: "uppercase",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
            }}
          >
            Quit Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
