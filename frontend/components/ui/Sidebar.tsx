"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStatsStore } from "@/lib/store";
import FlagImage from "@/components/ui/FlagImage";

const navItems = [
  { href: "/", icon: "🏠", label: "Learn" },
  { href: "/leaderboard", icon: "🏆", label: "Leaderboard" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeCourse } = useStatsStore();
  const isLesson = pathname.startsWith("/lesson");
  const isChoose = pathname.startsWith("/choose-language");

  if (isChoose) return null;

  return (
    <aside style={{
      borderRight: isLesson ? "1px solid rgba(255,255,255,0.08)" : "2px solid #e5e5e5",
      background: isLesson ? "rgba(15,12,41,0.97)" : "white",
      width: "240px", minHeight: "100vh", position: "sticky", top: 0,
      height: "100vh", display: "flex", flexDirection: "column",
      paddingTop: "24px", paddingLeft: "12px", paddingRight: "12px",
    }} className="hidden md:flex">
      {/* Logo */}
      <Link href="/" style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "8px 12px", marginBottom: "32px", textDecoration: "none",
      }}>
        <span style={{ fontSize: "36px" }}>🦉</span>
        <span style={{ fontWeight: 900, fontSize: "22px", color: "#58CC02", letterSpacing: "-0.5px" }}>
          duolingo
        </span>
      </Link>

      <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map(({ href, icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              borderRadius: "14px", padding: "13px 16px", fontWeight: 800,
              fontSize: "15px", display: "flex", alignItems: "center", gap: "14px",
              textDecoration: "none",
              color: active ? "#58CC02" : isLesson ? "rgba(255,255,255,0.5)" : "#6b7280",
              background: active ? (isLesson ? "rgba(88,204,2,0.15)" : "#e8ffd4") : "transparent",
              border: active ? (isLesson ? "2px solid rgba(88,204,2,0.3)" : "2px solid #c3f08a") : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: "22px" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Active course + switcher */}
      <div style={{ marginTop: "auto", paddingBottom: "16px" }}>
        {activeCourse ? (
          <div style={{
            background: "#fff9e6", border: "2px solid #ffc800",
            borderRadius: "16px", padding: "14px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <FlagImage languageName={activeCourse.language_name} width={40} height={30} borderRadius={6} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "14px", color: "#3c3c3c" }}>
                  {activeCourse.language_name}
                </div>
                <div style={{ fontSize: "11px", color: "#afafaf" }}>
                  {activeCourse.xp_in_course} XP earned
                </div>
              </div>
            </div>
            <button onClick={() => router.push("/choose-language")} style={{
              width: "100%", background: "white", border: "2px solid #e5e5e5",
              borderBottom: "3px solid #d0d0d0", borderRadius: "12px",
              padding: "8px", fontWeight: 800, fontSize: "12px",
              color: "#3c3c3c", cursor: "pointer", letterSpacing: "0.5px",
              textTransform: "uppercase", fontFamily: "inherit",
              transition: "background 0.1s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f0f0f0")}
              onMouseLeave={e => (e.currentTarget.style.background = "white")}
            >
              Switch Language
            </button>
          </div>
        ) : (
          <button onClick={() => router.push("/choose-language")} style={{
            width: "100%", background: "#58CC02", border: "none",
            borderBottom: "3px solid #46A302", borderRadius: "14px",
            padding: "13px", fontWeight: 800, fontSize: "13px",
            color: "white", cursor: "pointer", letterSpacing: "0.5px",
            textTransform: "uppercase", fontFamily: "inherit",
          }}>
            Choose a Language
          </button>
        )}
      </div>
    </aside>
  );
}
