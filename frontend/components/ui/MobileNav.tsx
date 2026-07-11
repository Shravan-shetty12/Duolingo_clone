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

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeCourse } = useStatsStore();
  const isLesson = pathname.startsWith("/lesson");
  const isChoose = pathname.startsWith("/choose-language");
  if (isChoose) return null;

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
      {/* Language switcher tab */}
      <button onClick={() => router.push("/choose-language")} style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "10px 4px", background: "none", border: "none",
        color: "#afafaf", fontWeight: 700, fontSize: "11px", gap: "2px",
        cursor: "pointer",
      }}>
        {activeCourse
          ? <FlagImage languageName={activeCourse.language_name} width={28} height={21} borderRadius={4} />
          : <span style={{ fontSize: "22px" }}>🌍</span>}
        {activeCourse?.language_name ?? "Language"}
      </button>
    </nav>
  );
}
