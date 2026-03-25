"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LogIn, LogOut } from "lucide-react";
import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getSyllabusStats } from "@/lib/studyTrackerStorage";
import { useTracker } from "./StudyTrackerProvider";
import NavBtn from "./NavBtn";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "📊", href: "/study-tracker/dashboard" },
  { id: "daily",     label: "Daily Tracker", icon: "📅", href: "/study-tracker/daily-tracker" },
  { id: "syllabi",   label: "Syllabus Manager", icon: "📚", href: "/study-tracker/syllabus" },
  { id: "resources", label: "Resources", icon: "🔖", href: "/study-tracker/resources" },
];

export default function Sidebar() {
  const { state, user } = useTracker();
  const pathname = usePathname();
  const router = useRouter();
  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    setProfileOpen(false);
    router.push("/login");
  };

  // Close dropdown on outside click
  const handleProfileBlur = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.relatedTarget)) {
      setProfileOpen(false);
    }
  };

  return (
    <nav className="st-sidebar">
      <ul className="st-nav">
        {/* Main nav items */}
        {NAV_ITEMS.map((item) => (
          <NavBtn
            key={item.id}
            href={item.href}
            label={item.label}
            icon={item.icon}
            pathname={pathname}
          />
        ))}

        {/* Syllabi section */}
        {state && (
          <>
            <li>
              <span className="st-nav-sep">Syllabi</span>
            </li>
            {Object.values(state.syllabi).map((syl) => {
              const stats = getSyllabusStats(state.syllabi, state.progress, syl.id);
              return (
                <NavBtn
                  key={syl.id}
                  href={`/study-tracker/syllabus/${syl.id}`}
                  label={syl.label}
                  icon={syl.icon}
                  pathname={pathname}
                  badge={stats.pct + "%"}
                  badgeStyle={{ background: syl.color + "22", color: syl.color }}
                />
              );
            })}
          </>
        )}
      </ul>

      {/* Sidebar footer — login / user profile */}
      <div className="st-sidebar-footer">
        {user ? (
          <div ref={profileRef} style={{ position: "relative" }} onBlur={handleProfileBlur}>
            <button
              className="st-user-btn"
              onClick={() => setProfileOpen((o) => !o)}
              id="user-profile-btn"
              data-testid="user-profile-btn"
            >
              <div className="st-user-avatar">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="st-user-info">
                <div className="st-user-name">{user.name}</div>
                <div className="st-user-email">{user.email}</div>
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: "#9ca3af",
                  flexShrink: 0,
                  transform: profileOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.15s",
                }}
              />
            </button>

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                  padding: "8px",
                  zIndex: 50,
                }}
                id="user-profile-dropdown"
                data-testid="user-profile-dropdown"
              >
                <div
                  style={{
                    padding: "8px 10px 10px",
                    borderBottom: "1px solid #f3f4f6",
                    marginBottom: "6px",
                  }}
                >
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827" }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>{user.email}</p>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "20px",
                      background: "#eff2ff",
                      color: "#2563eb",
                      display: "inline-block",
                      marginTop: "4px",
                    }}
                  >
                    {user.role ?? "USER"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "8px 10px",
                    border: "none",
                    background: "none",
                    borderRadius: "7px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "#dc2626",
                    fontFamily: "inherit",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  id="logout-btn"
                  data-testid="logout-btn"
                >
                  <LogOut size={14} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <a
            href="/login"
            className="st-login-btn"
            id="sidebar-login-btn"
            data-testid="sidebar-login-btn"
          >
            <LogIn size={15} />
            Sign In
          </a>
        )}
      </div>
    </nav>
  );
}
