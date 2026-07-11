interface Props {
  correct: boolean;
  correctAnswer: string;
  onContinue: () => void;
}

export default function FeedbackBar({ correct, correctAnswer, onContinue }: Props) {
  const green = "#58CC02";
  const red = "#FF4B4B";
  const color = correct ? green : red;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: correct
        ? "linear-gradient(135deg, rgba(88,204,2,0.15), rgba(88,204,2,0.08))"
        : "linear-gradient(135deg, rgba(255,75,75,0.15), rgba(255,75,75,0.08))",
      borderTop: `2px solid ${correct ? "rgba(88,204,2,0.4)" : "rgba(255,75,75,0.4)"}`,
      backdropFilter: "blur(16px)",
      padding: "20px 24px 24px",
      zIndex: 50,
    }} className="animate-slide-up">
      <div style={{
        maxWidth: 640, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Icon */}
          <div style={{
            width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
            background: correct ? "rgba(88,204,2,0.2)" : "rgba(255,75,75,0.2)",
            border: `2px solid ${correct ? "rgba(88,204,2,0.5)" : "rgba(255,75,75,0.5)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
          }}>
            {correct ? "✓" : "✗"}
          </div>
          <div>
            <div style={{
              fontWeight: 900, fontSize: 18,
              color: correct ? "#89E219" : "#FF6B6B",
              marginBottom: 3,
            }}>
              {correct ? "Correct! 🎉" : "Incorrect"}
            </div>
            {!correct && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                Correct answer:{" "}
                <span style={{ color: "#FF9999", fontWeight: 800 }}>{correctAnswer}</span>
              </div>
            )}
            {correct && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                Keep it up!
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <button onClick={onContinue}
            style={{
              background: correct
                ? "linear-gradient(135deg, #58CC02, #46A302)"
                : "linear-gradient(135deg, #FF4B4B, #EA2B2B)",
              border: "none",
              borderBottom: `4px solid ${correct ? "#3A8A00" : "#C41E1E"}`,
              color: "white", fontWeight: 800, fontSize: 15,
              letterSpacing: "0.8px", textTransform: "uppercase",
              borderRadius: 16, padding: "14px 36px",
              cursor: "pointer", minWidth: 150,
              fontFamily: "inherit",
              boxShadow: correct
                ? "0 0 20px rgba(88,204,2,0.35)"
                : "0 0 20px rgba(255,75,75,0.35)",
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
            Continue
          </button>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
            or press Enter
          </span>
        </div>
      </div>
    </div>
  );
}
