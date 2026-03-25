"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  loadAllState,
  saveKey,
  getSyllabusStats,
  getAllStats,
  getTodayStr,
  downloadJSON,
  pickJSONFile,
  STORAGE_KEYS,
} from "@/lib/studyTrackerStorage";
import { mergeStates } from "@/lib/trackerDb";
import DEFAULT_SYLLABUS_DATA from "@/data/studyTrackerSyllabi";
import DashboardView from "./DashboardView";
import SyllabusView from "./SyllabusView";
import DailyTrackerView from "./DailyTrackerView";
import SyllabusManagerView from "./SyllabusManagerView";
import ResourcesView from "./ResourcesView";
import { authClient } from "@/lib/auth-client";
import { LogIn, LogOut, ChevronDown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBtn from "./NavBtn";

export default function StudyTrackerApp() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [state, setState] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false, error: false });
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const syncTimers = useRef({});

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setProfileOpen(false);
    router.push("/login");
  };

  // Load state on mount — local first (instant render), then merge DB if logged in
  useEffect(() => {
    async function init() {
      const localState = loadAllState();
      setState(localState);

      if (!user) return;

      try {
        const res = await fetch("/api/tracker/state");
        if (!res.ok) return;
        const dbState = await res.json();

        const hasDbData =
          dbState.habits.length > 0 ||
          Object.keys(dbState.progress).length > 0 ||
          Object.keys(dbState.daily).length > 0 ||
          Object.keys(dbState.subtopics).length > 0 ||
          dbState.syllabi !== null;

        if (hasDbData) {
          // DB has data — merge (DB wins), mirror back to localStorage
          const finalState = mergeStates(localState, {
            ...dbState,
            syllabi: dbState.syllabi || localState.syllabi,
          });
          setState(finalState);
          Object.entries(finalState).forEach(([k, v]) => saveKey(k, v));
        } else {
          // First login — push all localStorage data to DB silently
          fetch("/api/tracker/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullState: localState }),
          }).catch((err) => console.error("[tracker] first-login sync failed", err));
        }
      } catch (err) {
        console.error("[tracker] DB load failed", err);
      }
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const showToast = useCallback((msg, isError = false) => {
    setToast({ msg, show: true, error: isError });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

  // Debounced DB write — progress/subtopics: 1s, syllabi: 2s, others: immediate
  const syncToDb = useCallback(
    (key, value, currentState) => {
      if (!user) return;
      const delay = key === "syllabi" ? 2000 : key === "progress" || key === "subtopics" ? 1000 : 0;
      const fullState =
        key === "habitLog"
          ? { habits: currentState.habits, habitLog: value }
          : { [key]: value };

      if (delay > 0) {
        clearTimeout(syncTimers.current[key]);
        syncTimers.current[key] = setTimeout(() => {
          fetch("/api/tracker/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullState }),
          }).catch((err) => console.error("[tracker sync]", key, err));
        }, delay);
      } else {
        fetch("/api/tracker/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullState }),
        }).catch((err) => console.error("[tracker sync]", key, err));
      }
    },
    [user]
  );

  // Generic state updater — saves to localStorage and (if logged in) syncs to DB
  const updateState = useCallback(
    (key, value) => {
      setState((prev) => {
        const next = { ...prev, [key]: value };
        saveKey(key, value);
        syncToDb(key, value, next);
        return next;
      });
    },
    [syncToDb]
  );

  const handleExport = () => {
    if (!state) return;
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      syllabi: state.syllabi,
      progress: state.progress,
      custom: state.custom,
      log: state.log,
      subtopics: state.subtopics,
      daily: state.daily,
      habits: state.habits,
      habitLog: state.habitLog,
    };
    downloadJSON(payload, `qa-tracker-${getTodayStr()}.json`);
    showToast("Full data exported!");
  };

  const handleClearAll = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    const fresh = {
      syllabi: JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_DATA)),
      progress: {},
      custom: {},
      log: [],
      subtopics: {},
      daily: {},
      habits: [],
      habitLog: {},
    };
    Object.entries(fresh).forEach(([k, v]) => saveKey(k, v));
    setState(fresh);
    setActiveTab("dashboard");
    showToast("All data cleared and reset to default.");

    if (user) {
      fetch("/api/tracker/state", { method: "DELETE" }).catch((err) =>
        console.error("[tracker] clear DB failed", err)
      );
    }
  };

  const handleImport = () => {
    pickJSONFile((data) => {
      const next = {
        syllabi:
          data.syllabi || JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_DATA)),
        progress: data.progress || {},
        custom: data.custom || {},
        log: data.log || [],
        subtopics: data.subtopics || {},
        daily: data.daily || {},
        habits: data.habits || [],
        habitLog: data.habitLog || {},
      };
      Object.entries(next).forEach(([k, v]) => saveKey(k, v));
      setState(next);
      setActiveTab("dashboard");
      showToast("Data imported successfully!");

      if (user) {
        fetch("/api/tracker/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullState: next }),
        }).catch((err) => console.error("[tracker] import sync failed", err));
      }
    });
  };

  if (!state) {
    return (
      <div
        className="st-root"
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <span style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>
          Loading…
        </span>
      </div>
    );
  }

  const allStats = getAllStats(state.syllabi, state.progress);

  return (
    <div className="st-root">
      {/* ── SIDEBAR ── */}
      <nav className="st-sidebar">
        <ul className="st-nav">
          {/* Main nav */}
          <NavBtn
            id="dashboard"
            label="Dashboard"
            icon="📊"
            active={activeTab}
            onClick={setActiveTab}
          />
          <NavBtn
            id="daily"
            label="Daily Tracker"
            icon="📅"
            active={activeTab}
            onClick={setActiveTab}
          />
          <NavBtn
            id="syllabi"
            label="Syllabus Manager"
            icon="📚"
            active={activeTab}
            onClick={setActiveTab}
          />
          <NavBtn
            id="resources"
            label="Resources"
            icon="🔖"
            active={activeTab}
            onClick={setActiveTab}
          />

          {/* Syllabi section */}
          <li>
            <span className="st-nav-sep">Syllabi</span>
          </li>
          {Object.values(state.syllabi).map((syl) => {
            const stats = getSyllabusStats(
              state.syllabi,
              state.progress,
              syl.id,
            );
            return (
              <NavBtn
                key={syl.id}
                id={syl.id}
                label={syl.label}
                icon={syl.icon}
                active={activeTab}
                onClick={setActiveTab}
                badge={stats.pct + "%"}
                badgeStyle={{ background: syl.color + "22", color: syl.color }}
              />
            );
          })}
        </ul>

        {/* ── SIDEBAR FOOTER: login / user profile ── */}
        <div className="st-sidebar-footer">
          {user ? (
            <div ref={profileRef} style={{ position: "relative" }}>
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
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {user.name}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "#6b7280" }}>
                      {user.email}
                    </p>
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
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fee2e2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
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

      {/* ── MAIN ── */}
      <div className="st-main">
        {/* <div className="st-topbar">
          <span className="st-topbar-title">
            {getTabTitle(activeTab, state.syllabi)}
          </span>
        </div> */}

        <div className="st-content">
          {activeTab === "dashboard" && (
            <DashboardView
              state={state}
              allStats={allStats}
              onExport={handleExport}
              onImport={handleImport}
              onClearAll={handleClearAll}
              onNavigate={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === "daily" && (
            <DailyTrackerView
              state={state}
              updateState={updateState}
              showToast={showToast}
            />
          )}

          {activeTab === "syllabi" && (
            <SyllabusManagerView
              state={state}
              updateState={updateState}
              showToast={showToast}
            />
          )}

          {activeTab === "resources" && <ResourcesView showToast={showToast} />}

          {state.syllabi[activeTab] && (
            <SyllabusView
              syllabus={state.syllabi[activeTab]}
              state={state}
              updateState={updateState}
              showToast={showToast}
            />
          )}
        </div>
      </div>

      {/* ── TOAST ── */}
      <div
        className={`st-toast${toast.show ? " show" : ""}${toast.error ? " error" : ""}`}
      >
        {toast.msg}
      </div>
    </div>
  );
}

function getTabTitle(tab, syllabi) {
  const map = {
    dashboard: "QA Study Tracker",
    daily: "Daily Progress Tracker",
    syllabi: "Syllabus Manager",
  };
  return map[tab] || syllabi[tab]?.label || "QA Study Tracker";
}
