"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "🏠", label: "Learn" },
  { href: "/leaderboard", icon: "🏆", label: "Leaderboard" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const isLesson = pathname.startsWith("/lesson");
  if (isLesson) return null;

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "white", borderTop: "2px solid #e5e5e5",
      display: "flex", zIndex: 50,
      paddingBottom: "env(safe-area-inset-bottom)",
    }} className="md:hidden">
      {navItems.map(({ href, icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "10px 4px", textDecoration: "none",
            color: active ? "#58CC02" : "#afafaf",
            fontWeight: 700, fontSize: "11px", gap: "2px",
          }}>
            <span style={{ fontSize: "22px" }}>{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
