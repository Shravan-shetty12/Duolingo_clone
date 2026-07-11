"use client";
import { useState, useEffect } from "react";
import { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

export default function ExerciseRenderer({ exercise, onAnswer, disabled }: Props) {
  const options: string[] = JSON.parse(exercise.options_json || "[]");

  if (exercise.type === "mcq") {
    return <MCQ exercise={exercise} options={options} onAnswer={onAnswer} disabled={disabled} />;
  }
  if (exercise.type === "translate") {
    return <TapWords exercise={exercise} options={options} onAnswer={onAnswer} disabled={disabled} />;
  }
  if (exercise.type === "fill_blank") {
    return <FillBlank exercise={exercise} options={options} onAnswer={onAnswer} disabled={disabled} />;
  }
  return <TypeAnswer exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
}

/* ── MCQ ── */
function MCQ({ exercise, options, onAnswer, disabled }: Props & { options: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (opt: string) => {
    if (disabled) return;
    setSelected(opt);
    onAnswer(opt);
  };

  return (
    <div style={{ animation: "fadeInDown 0.3s ease" }}>
      <p style={{ fontSize: "22px", fontWeight: 800, marginBottom: "32px", color: "#3c3c3c", lineHeight: 1.4 }}>
        {exercise.prompt}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        {options.map((opt, i) => (
          <button key={opt} disabled={disabled} onClick={() => handleClick(opt)}
            style={{
              padding: "18px 14px", borderRadius: "16px",
              border: selected === opt ? "3px solid #1CB0F6" : "2px solid #e5e5e5",
              borderBottom: selected === opt ? "5px solid #0099D9" : "4px solid #d0d0d0",
              background: selected === opt ? "#E8F8FF" : "white",
              fontWeight: 700, fontSize: "15px",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.12s", color: "#3c3c3c",
              textAlign: "left",
              animation: `fadeInDown 0.3s ease ${i * 0.05}s both`,
            }}
            onMouseEnter={e => {
              if (!disabled && selected !== opt) {
                (e.currentTarget as HTMLElement).style.borderColor = "#84D8FF";
                (e.currentTarget as HTMLElement).style.background = "#f0fbff";
              }
            }}
            onMouseLeave={e => {
              if (selected !== opt) {
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e5e5";
                (e.currentTarget as HTMLElement).style.background = "white";
              }
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Tap Words ── */
function TapWords({ exercise, options, onAnswer, disabled }: Props & { options: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>([...options]);

  const addWord = (word: string) => {
    if (disabled) return;
    setRemaining(r => r.filter(w => w !== word));
    setSelected(s => [...s, word]);
  };

  const removeWord = (word: string) => {
    if (disabled) return;
    setSelected(s => s.filter(w => w !== word));
    setRemaining(r => [...r, word]);
  };

  return (
    <div style={{ animation: "fadeInDown 0.3s ease" }}>
      <p style={{ fontSize: "22px", fontWeight: 800, marginBottom: "24px", color: "#3c3c3c", lineHeight: 1.4 }}>
        {exercise.prompt}
      </p>

      {/* Answer tray */}
      <div style={{
        minHeight: "64px", border: "2px dashed #c0c0c0", borderRadius: "16px",
        padding: "10px 14px", marginBottom: "20px",
        display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "flex-start",
        background: "#fafafa",
      }}>
        {selected.length === 0 && (
          <span style={{ color: "#c0c0c0", fontSize: "14px", fontWeight: 600, alignSelf: "center" }}>
            Tap words to build your answer
          </span>
        )}
        {selected.map(w => (
          <button key={w} onClick={() => removeWord(w)} disabled={disabled}
            style={{
              padding: "8px 16px", borderRadius: "10px",
              border: "2px solid #1CB0F6", borderBottom: "3px solid #0099D9",
              background: "#E8F8FF", fontWeight: 700, cursor: "pointer",
              fontSize: "14px", color: "#0099D9", transition: "all 0.1s",
            }}>
            {w}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: "2px", background: "#e5e5e5", marginBottom: "20px", borderRadius: "2px" }} />

      {/* Word bank */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
        {remaining.map(w => (
          <button key={w} onClick={() => addWord(w)} disabled={disabled}
            style={{
              padding: "10px 18px", borderRadius: "10px",
              border: "2px solid #e5e5e5", borderBottom: "3px solid #d0d0d0",
              background: "white", fontWeight: 700, cursor: "pointer",
              fontSize: "14px", color: "#3c3c3c", transition: "all 0.1s",
            }}
            onMouseEnter={e => {
              if (!disabled) {
                (e.currentTarget as HTMLElement).style.borderColor = "#84D8FF";
                (e.currentTarget as HTMLElement).style.background = "#f0fbff";
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "#e5e5e5";
              (e.currentTarget as HTMLElement).style.background = "white";
            }}
          >{w}</button>
        ))}
      </div>

      <button onClick={() => onAnswer(selected.join(" "))}
        disabled={disabled || selected.length === 0}
        className="btn-primary">
        Check
      </button>
    </div>
  );
}

/* ── Fill Blank ── */
function FillBlank({ exercise, options, onAnswer, disabled }: Props & { options: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const parts = exercise.prompt.split("_____");

  const handleClick = (opt: string) => {
    if (disabled) return;
    setSelected(opt);
    onAnswer(opt);
  };

  return (
    <div style={{ animation: "fadeInDown 0.3s ease" }}>
      {/* Sentence with blank */}
      <div style={{
        fontSize: "22px", fontWeight: 800, marginBottom: "32px",
        color: "#3c3c3c", lineHeight: 1.6, display: "flex", flexWrap: "wrap",
        alignItems: "center", gap: "8px",
      }}>
        <span>{parts[0]}</span>
        <span style={{
          display: "inline-block", minWidth: "100px", borderBottom: "3px solid #1CB0F6",
          padding: "2px 8px", color: "#1CB0F6", fontWeight: 900,
          textAlign: "center",
        }}>
          {selected ?? "______"}
        </span>
        {parts[1] && <span>{parts[1]}</span>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        {options.map((opt, i) => (
          <button key={opt} disabled={disabled} onClick={() => handleClick(opt)}
            style={{
              padding: "14px 22px", borderRadius: "14px",
              border: selected === opt ? "3px solid #1CB0F6" : "2px solid #e5e5e5",
              borderBottom: selected === opt ? "5px solid #0099D9" : "4px solid #d0d0d0",
              background: selected === opt ? "#E8F8FF" : "white",
              fontWeight: 700, fontSize: "15px",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.12s", color: "#3c3c3c",
              animation: `fadeInDown 0.3s ease ${i * 0.06}s both`,
            }}
            onMouseEnter={e => {
              if (!disabled && selected !== opt) {
                (e.currentTarget as HTMLElement).style.borderColor = "#84D8FF";
                (e.currentTarget as HTMLElement).style.background = "#f0fbff";
              }
            }}
            onMouseLeave={e => {
              if (selected !== opt) {
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e5e5";
                (e.currentTarget as HTMLElement).style.background = "white";
              }
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Type Answer ── */
function TypeAnswer({ exercise, onAnswer, disabled }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => { setValue(""); }, [exercise.id]);

  return (
    <div style={{ animation: "fadeInDown 0.3s ease" }}>
      <p style={{ fontSize: "22px", fontWeight: 800, marginBottom: "32px", color: "#3c3c3c", lineHeight: 1.4 }}>
        {exercise.prompt}
      </p>

      <div style={{ position: "relative", marginBottom: "24px" }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && value.trim() && !disabled) onAnswer(value.trim()); }}
          disabled={disabled}
          placeholder="Type your answer here..."
          style={{
            width: "100%", padding: "16px 18px", borderRadius: "16px",
            border: "2px solid #e5e5e5", borderBottom: "4px solid #d0d0d0",
            fontSize: "17px", outline: "none", fontWeight: 600,
            fontFamily: "inherit", color: "#3c3c3c",
            transition: "border-color 0.15s",
            background: disabled ? "#fafafa" : "white",
          }}
          onFocus={e => {
            e.target.style.borderColor = "#1CB0F6";
            e.target.style.borderBottomColor = "#0099D9";
          }}
          onBlur={e => {
            e.target.style.borderColor = "#e5e5e5";
            e.target.style.borderBottomColor = "#d0d0d0";
          }}
          autoFocus
        />
      </div>

      <button onClick={() => onAnswer(value.trim())}
        disabled={disabled || !value.trim()}
        className="btn-primary">
        Check
      </button>
    </div>
  );
}
