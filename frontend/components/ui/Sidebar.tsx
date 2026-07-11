"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "🏠", label: "Learn" },
  { href: "/leaderboard", icon: "🏆", label: "Leaderboard" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isLesson = pathname.startsWith("/lesson");

  if (isLesson) return null;

  return (
    <aside style={{
      borderRight: "2px solid #e5e5e5",
      background: "white",
      width: "240px",
      minHeight: "100vh",
      position: "sticky",
      top: 0,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      paddingTop: "24px",
      paddingLeft: "12px",
      paddingRight: "12px",
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
              borderRadius: "14px",
              padding: "13px 16px",
              fontWeight: 800,
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              textDecoration: "none",
              color: active ? "#58CC02" : "#6b7280",
              background: active ? "#e8ffd4" : "transparent",
              border: active ? "2px solid #c3f08a" : "2px solid transparent",
              transition: "all 0.15s",
              letterSpacing: "0.2px",
            }}>
              <span style={{ fontSize: "22px" }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ marginTop: "auto", padding: "16px 12px", borderTop: "2px solid #e5e5e5" }}>
        <div style={{
          background: "#fff9e6", border: "2px solid #ffc800", borderRadius: "14px",
          padding: "14px", textAlign: "center"
        }}>
          <div style={{ fontSize: "24px", marginBottom: "4px" }}>🇪🇸</div>
          <div style={{ fontWeight: 800, fontSize: "13px", color: "#3c3c3c" }}>Spanish</div>
          <div style={{ fontSize: "11px", color: "#afafaf", marginTop: "2px" }}>Current course</div>
        </div>
      </div>
    </aside>
  );
}
