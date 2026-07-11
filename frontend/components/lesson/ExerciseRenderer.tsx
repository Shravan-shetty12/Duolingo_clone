"use client";
import { useState, useEffect } from "react";
import { Exercise } from "@/lib/types";

interface Props {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled: boolean;
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

export default function ExerciseRenderer({ exercise, onAnswer, disabled }: Props) {
  const options: string[] = JSON.parse(exercise.options_json || "[]");

  if (exercise.type === "mcq")
    return <MCQ exercise={exercise} options={options} onAnswer={onAnswer} disabled={disabled} />;
  if (exercise.type === "translate")
    return <TapWords exercise={exercise} options={options} onAnswer={onAnswer} disabled={disabled} />;
  if (exercise.type === "fill_blank")
    return <FillBlank exercise={exercise} options={options} onAnswer={onAnswer} disabled={disabled} />;
  return <TypeAnswer exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
}

/* ── Shared prompt ── */
function Prompt({ text }: { text: string }) {
  return (
    <p style={{
      fontSize: "clamp(18px,3vw,24px)", fontWeight: 800,
      color: "#ffffff", lineHeight: 1.5, marginBottom: 32,
      animation: "fadeInDown 0.35s ease both",
    }}>{text}</p>
  );
}

/* ── MCQ ── */
function MCQ({ exercise, options, onAnswer, disabled }: Props & { options: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (opt: string) => {
    if (disabled || selected) return;
    setSelected(opt);
    onAnswer(opt);
  };

  return (
    <div style={{ animation: "fadeInDown 0.3s ease" }}>
      <Prompt text={exercise.prompt} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <button key={opt} disabled={disabled} onClick={() => handleClick(opt)}
              style={{
                padding: "16px 14px", borderRadius: 16, textAlign: "left",
                border: isSelected ? "2px solid #1CB0F6" : "1.5px solid rgba(255,255,255,0.1)",
                borderBottom: isSelected ? "4px solid #0099D9" : "3px solid rgba(255,255,255,0.06)",
                background: isSelected
                  ? "rgba(28,176,246,0.15)"
                  : "rgba(255,255,255,0.05)",
                backdropFilter: "blur(8px)",
                fontWeight: 700, fontSize: 15,
                cursor: disabled ? "default" : "pointer",
                transition: "all 0.15s",
                color: isSelected ? "#1CB0F6" : "rgba(255,255,255,0.85)",
                display: "flex", alignItems: "center", gap: 12,
                animation: `fadeInDown 0.3s ease ${i * 0.06}s both`,
                boxShadow: isSelected ? "0 0 16px rgba(28,176,246,0.2)" : "none",
              }}
              onMouseEnter={e => {
                if (!disabled && !selected) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isSelected ? "#1CB0F6" : "rgba(255,255,255,0.08)",
                color: isSelected ? "white" : "rgba(255,255,255,0.4)",
                fontSize: 12, fontWeight: 900, letterSpacing: "0.5px",
                transition: "all 0.15s",
              }}>{OPTION_LETTERS[i]}</span>
              {opt}
            </button>
          );
        })}
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
      <Prompt text={exercise.prompt} />

      {/* Answer tray */}
      <div style={{
        minHeight: 68,
        border: "2px dashed rgba(28,176,246,0.3)",
        borderRadius: 16, padding: "12px 14px", marginBottom: 16,
        display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start",
        background: "rgba(28,176,246,0.04)",
        transition: "border-color 0.2s",
      }}>
        {selected.length === 0 ? (
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, fontWeight: 600, alignSelf: "center" }}>
            Tap words below to build your answer
          </span>
        ) : selected.map((w, i) => (
          <button key={`${w}-${i}`} onClick={() => removeWord(w)} disabled={disabled}
            style={{
              padding: "8px 14px", borderRadius: 10,
              border: "1.5px solid #1CB0F6", borderBottom: "3px solid #0099D9",
              background: "rgba(28,176,246,0.18)", fontWeight: 700,
              cursor: disabled ? "default" : "pointer",
              fontSize: 14, color: "#7DD8FF",
              transition: "all 0.12s",
              animation: "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
            onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.background = "rgba(28,176,246,0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(28,176,246,0.18)"; }}
          >{w}</button>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 16 }} />

      {/* Word bank */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
        {remaining.map(w => (
          <button key={w} onClick={() => addWord(w)} disabled={disabled}
            style={{
              padding: "10px 18px", borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderBottom: "3px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.07)", fontWeight: 700,
              cursor: disabled ? "default" : "pointer",
              fontSize: 14, color: "rgba(255,255,255,0.8)",
              transition: "all 0.12s",
            }}
            onMouseEnter={e => {
              if (!disabled) {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >{w}</button>
        ))}
      </div>

      <button onClick={() => onAnswer(selected.join(" "))}
        disabled={disabled || selected.length === 0}
        style={checkBtnStyle(selected.length > 0 && !disabled)}>
        Check Answer
      </button>
    </div>
  );
}

/* ── Fill Blank ── */
function FillBlank({ exercise, options, onAnswer, disabled }: Props & { options: string[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const parts = exercise.prompt.split("_____");

  const handleClick = (opt: string) => {
    if (disabled || selected) return;
    setSelected(opt);
    onAnswer(opt);
  };

  return (
    <div style={{ animation: "fadeInDown 0.3s ease" }}>
      {/* Sentence with blank */}
      <div style={{
        fontSize: "clamp(18px,3vw,22px)", fontWeight: 800,
        color: "#ffffff", lineHeight: 1.8, marginBottom: 36,
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8,
      }}>
        <span>{parts[0]}</span>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          minWidth: 110, padding: "4px 14px",
          borderBottom: `3px solid ${selected ? "#1CB0F6" : "rgba(255,255,255,0.3)"}`,
          color: selected ? "#7DD8FF" : "rgba(255,255,255,0.25)",
          fontWeight: 900, fontSize: "clamp(18px,3vw,22px)",
          transition: "all 0.2s",
          background: selected ? "rgba(28,176,246,0.1)" : "transparent",
          borderRadius: "4px 4px 0 0",
        }}>
          {selected ?? "______"}
        </span>
        {parts[1] && <span>{parts[1]}</span>}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {options.map((opt, i) => {
          const isSelected = selected === opt;
          return (
            <button key={opt} disabled={disabled} onClick={() => handleClick(opt)}
              style={{
                padding: "14px 22px", borderRadius: 14,
                border: isSelected ? "2px solid #1CB0F6" : "1.5px solid rgba(255,255,255,0.1)",
                borderBottom: isSelected ? "4px solid #0099D9" : "3px solid rgba(255,255,255,0.06)",
                background: isSelected ? "rgba(28,176,246,0.15)" : "rgba(255,255,255,0.05)",
                fontWeight: 700, fontSize: 15,
                cursor: disabled ? "default" : "pointer",
                transition: "all 0.15s",
                color: isSelected ? "#7DD8FF" : "rgba(255,255,255,0.8)",
                animation: `fadeInDown 0.3s ease ${i * 0.07}s both`,
                boxShadow: isSelected ? "0 0 14px rgba(28,176,246,0.2)" : "none",
              }}
              onMouseEnter={e => {
                if (!disabled && !isSelected) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }
              }}
            >{opt}</button>
          );
        })}
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
      <Prompt text={exercise.prompt} />

      <div style={{ position: "relative", marginBottom: 24 }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && value.trim() && !disabled) onAnswer(value.trim()); }}
          disabled={disabled}
          placeholder="Type your answer here..."
          style={{
            width: "100%", padding: "16px 18px 16px 50px",
            borderRadius: 16,
            border: "1.5px solid rgba(255,255,255,0.12)",
            borderBottom: "3px solid rgba(255,255,255,0.06)",
            fontSize: 17, outline: "none", fontWeight: 600,
            fontFamily: "inherit", color: "#ffffff",
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s",
          }}
          onFocus={e => {
            e.target.style.borderColor = "#1CB0F6";
            e.target.style.borderBottomColor = "#0099D9";
            e.target.style.background = "rgba(28,176,246,0.08)";
            e.target.style.boxShadow = "0 0 0 3px rgba(28,176,246,0.15)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(255,255,255,0.12)";
            e.target.style.borderBottomColor = "rgba(255,255,255,0.06)";
            e.target.style.background = "rgba(255,255,255,0.06)";
            e.target.style.boxShadow = "none";
          }}
          autoFocus
        />
        <span style={{
          position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
          fontSize: 20, pointerEvents: "none",
        }}>⌨️</span>
      </div>

      <button onClick={() => onAnswer(value.trim())}
        disabled={disabled || !value.trim()}
        style={checkBtnStyle(!!value.trim() && !disabled)}>
        Check Answer
      </button>
    </div>
  );
}

function checkBtnStyle(active: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "16px 24px", borderRadius: 16,
    border: "none",
    borderBottom: active ? "4px solid #46A302" : "4px solid rgba(255,255,255,0.06)",
    background: active
      ? "linear-gradient(135deg, #58CC02, #46A302)"
      : "rgba(255,255,255,0.06)",
    color: active ? "#fff" : "rgba(255,255,255,0.25)",
    fontWeight: 800, fontSize: 16, letterSpacing: "0.8px",
    textTransform: "uppercase" as const,
    cursor: active ? "pointer" : "not-allowed",
    fontFamily: "inherit",
    transition: "all 0.2s",
    boxShadow: active ? "0 0 20px rgba(88,204,2,0.3)" : "none",
  };
}
