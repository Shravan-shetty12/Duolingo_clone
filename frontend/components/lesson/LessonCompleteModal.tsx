interface Props {
  xpEarned: number;
  onContinue: () => void;
}

export default function LessonCompleteModal({ xpEarned, onContinue }: Props) {
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
        <div style={{ fontSize: "80px", marginBottom: "8px", lineHeight: 1 }}
          className="animate-bounce-in">🎉</div>

        <h2 style={{ fontWeight: 900, fontSize: "30px", color: "#58CC02", marginBottom: "6px" }}>
          Lesson Complete!
        </h2>
        <p style={{ color: "#afafaf", marginBottom: "28px", fontSize: "15px", fontWeight: 600 }}>
          Amazing work! Keep the streak going!
        </p>

        {/* XP card */}
        <div style={{
          background: "linear-gradient(135deg, #FFF9E6, #FFF3CC)",
          border: "2px solid #FFC800",
          borderRadius: "20px", padding: "20px", marginBottom: "28px",
          boxShadow: "0 4px 0 #E6A800",
        }}>
          <div style={{ fontSize: "40px", fontWeight: 900, color: "#FFC800", lineHeight: 1 }}>
            +{xpEarned} XP
          </div>
          <div style={{ fontSize: "13px", color: "#7A5800", fontWeight: 700, marginTop: "4px" }}>
            Experience Points Earned
          </div>
        </div>

        <button onClick={onContinue} className="btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}
