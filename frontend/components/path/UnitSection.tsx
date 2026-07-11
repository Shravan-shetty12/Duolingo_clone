import { Unit } from "@/lib/types";
import SkillNode from "./SkillNode";

interface Props {
  unit: Unit;
  globalSkillOffset: number;
  onStartSkill: (skillId: number) => void;
}

const DARKEN: Record<string, string> = {
  "#58CC02": "#46A302",
  "#CE82FF": "#9333EA",
  "#FF9600": "#CC7800",
  "#1CB0F6": "#0099D9",
};

export default function UnitSection({ unit, globalSkillOffset, onStartSkill }: Props) {
  const completed = unit.skills.filter(s => s.status === "completed").length;
  const total = unit.skills.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const shadow = DARKEN[unit.color_theme] ?? "#333";

  return (
    <div style={{ marginBottom: "40px" }}>
      {/* Unit banner */}
      <div style={{
        background: unit.color_theme,
        borderRadius: "20px",
        padding: "18px 22px",
        marginBottom: "28px",
        boxShadow: `0 6px 0 ${shadow}`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", right: "-20px", top: "-20px",
          width: "100px", height: "100px", borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
        }} />
        <div style={{
          position: "absolute", right: "40px", bottom: "-30px",
          width: "70px", height: "70px", borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative" }}>
          <div style={{
            width: "48px", height: "48px", borderRadius: "14px",
            background: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px",
          }}>📚</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontWeight: 900, fontSize: "17px", marginBottom: "6px" }}>
              {unit.title}
            </div>
            {/* Mini progress bar */}
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
              <div style={{
                width: `${pct}%`, height: "100%",
                background: "rgba(255,255,255,0.7)",
                borderRadius: "6px", transition: "width 0.6s ease",
              }} />
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: 700, marginTop: "4px" }}>
              {completed}/{total} skills
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {unit.skills.map((skill, i) => (
        <SkillNode
          key={skill.id}
          skill={skill}
          index={globalSkillOffset + i}
          onStart={onStartSkill}
        />
      ))}
    </div>
  );
}
