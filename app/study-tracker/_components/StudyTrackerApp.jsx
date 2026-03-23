"use client";

import { useState, useEffect, useCallback } from "react";
import {
  loadAllState,
  loadStateFromIdb,
  saveKey,
  clearAllData,
  getSyllabusStats,
  getAllStats,
  getTodayStr,
  downloadJSON,
  pickJSONFile,
  STORAGE_KEYS,
} from "@/lib/studyTrackerStorage";
import DEFAULT_SYLLABUS_DATA from "@/data/studyTrackerSyllabi";
import DashboardView from "./DashboardView";
import SyllabusView from "./SyllabusView";
import DailyTrackerView from "./DailyTrackerView";
import SyllabusManagerView from "./SyllabusManagerView";

export default function StudyTrackerApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [state, setState] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false, error: false });

  // Load state on mount (IndexedDB priority)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const idbState = await loadStateFromIdb();
      if (cancelled) return;
      if (idbState) {
        setState(idbState);
      } else {
        setState(loadAllState());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = useCallback((msg, isError = false) => {
    setToast({ msg, show: true, error: isError });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

  // Generic state updater that also persists
  const updateState = useCallback((key, value) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      saveKey(key, value);
      if (key === "syllabi" && prev.syllabusOrder) {
        const currentOrder = prev.syllabusOrder || Object.keys(value);
        const filtered = currentOrder.filter((id) => value[id]);
        const newIds = Object.keys(value).filter(
          (id) => !filtered.includes(id),
        );
        next.syllabusOrder = [...filtered, ...newIds];
        saveKey("order", next.syllabusOrder);
      }
      if (key === "syllabusOrder") {
        saveKey("order", value);
      }
      return next;
    });
  }, []);

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

  const handleClearAll = async () => {
    await clearAllData();
    const fresh = {
      syllabi: JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_DATA)),
      syllabusOrder: Object.keys(DEFAULT_SYLLABUS_DATA),
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

          {/* Syllabi section */}
          <li>
            <span className="st-nav-sep">Syllabi</span>
          </li>
          {(state.syllabusOrder || Object.keys(state.syllabi || {})).map(
            (sylId) => {
              const syl = state.syllabi[sylId];
              if (!syl) return null;
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
                  badgeStyle={{
                    background: syl.color + "22",
                    color: syl.color,
                  }}
                />
              );
            },
          )}
        </ul>
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

          {state.syllabi && state.syllabi[activeTab] && (
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

function NavBtn({ id, label, icon, active, onClick, badge, badgeStyle }) {
  return (
    <li>
      <button
        className={`st-nav-btn${active === id ? " active" : ""}`}
        onClick={() => onClick(id)}
      >
        <span className="st-nav-icon">{icon}</span>
        <span className="st-nav-label">{label}</span>
        {badge && (
          <span className="st-nav-badge" style={badgeStyle}>
            {badge}
          </span>
        )}
      </button>
    </li>
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
