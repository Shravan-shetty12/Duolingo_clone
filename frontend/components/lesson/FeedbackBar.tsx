interface Props {
  correct: boolean;
  correctAnswer: string;
  onContinue: () => void;
}

export default function FeedbackBar({ correct, correctAnswer, onContinue }: Props) {
  const bg = correct ? "#D7FFB8" : "#FFE0E0";
  const border = correct ? "#58CC02" : "#FF4B4B";
  const color = correct ? "#3C7A00" : "#9B1C1C";

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: bg, borderTop: `4px solid ${border}`,
      padding: "20px 24px", zIndex: 50,
    }} className="animate-slide-up">
      <div style={{
        maxWidth: "640px", margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "32px" }}>{correct ? "🎉" : "❌"}</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: "18px", color, marginBottom: "2px" }}>
              {correct ? "Correct!" : "Incorrect"}
            </div>
            {!correct && (
              <div style={{ fontSize: "14px", color, fontWeight: 600 }}>
                Correct answer: <strong>{correctAnswer}</strong>
              </div>
            )}
          </div>
        </div>
        <button onClick={onContinue}
          style={{
            background: correct ? "#58CC02" : "#FF4B4B",
            border: "none",
            borderBottom: `4px solid ${correct ? "#46A302" : "#EA2B2B"}`,
            color: "white", fontWeight: 800, fontSize: "15px",
            letterSpacing: "0.8px", textTransform: "uppercase",
            borderRadius: "16px", padding: "14px 32px",
            cursor: "pointer", minWidth: "140px",
            fontFamily: "inherit", transition: "filter 0.1s",
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.06)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "none")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
