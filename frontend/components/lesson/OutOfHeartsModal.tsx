interface Props {
  onRefill: () => void;
  onQuit: () => void;
}

export default function OutOfHeartsModal({ onRefill, onQuit }: Props) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: "16px",
    }}>
      <div style={{
        background: "white", borderRadius: "28px", padding: "44px 36px",
        textAlign: "center", maxWidth: "380px", width: "100%",
      }} className="animate-pop-in">
        <div style={{ fontSize: "80px", marginBottom: "8px", lineHeight: 1 }}>💔</div>

        <h2 style={{ fontWeight: 900, fontSize: "26px", color: "#FF4B4B", marginBottom: "8px" }}>
          Out of Hearts!
        </h2>
        <p style={{ color: "#afafaf", marginBottom: "28px", fontSize: "15px", fontWeight: 600, lineHeight: 1.5 }}>
          You ran out of hearts. Practice to refill and try again!
        </p>

        {/* Hearts display */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "8px",
          marginBottom: "28px",
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize: "28px", opacity: 0.2 }}>❤️</span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button onClick={onRefill} className="btn-primary">
            ❤️ Refill Hearts &amp; Retry
          </button>
          <button onClick={onQuit} className="btn-secondary">
            Quit Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
