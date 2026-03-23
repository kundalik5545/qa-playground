"use client";

import { useState, useEffect, useCallback } from "react";
import {
  loadAllState,
  loadStateFromIdb,
  saveKey,
  clearAllData,
  getAllStats,
  getTodayStr,
  downloadJSON,
  pickJSONFile,
} from "@/lib/studyTrackerStorage";
import DEFAULT_SYLLABUS_DATA from "@/data/studyTrackerSyllabi";
import DashboardView from "./_components/DashboardView";

export default function StudyTrackerPage() {
  const [state, setState] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false, error: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const idbState = await loadStateFromIdb();
      if (cancelled) return;
      setState(idbState ?? loadAllState());
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = useCallback((msg, isError = false) => {
    setToast({ msg, show: true, error: isError });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

  const handleExport = useCallback(() => {
    if (!state) return;
    downloadJSON(
      {
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
      },
      `qa-tracker-${getTodayStr()}.json`,
    );
    showToast("Data exported!");
  }, [state, showToast]);

  const handleClearAll = useCallback(async () => {
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
    showToast("All data cleared and reset to default.");
  }, [showToast]);

  const handleImport = useCallback(() => {
    pickJSONFile((data) => {
      const next = {
        syllabi: data.syllabi || JSON.parse(JSON.stringify(DEFAULT_SYLLABUS_DATA)),
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
      showToast("Data imported successfully!");
    });
  }, [showToast]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  const allStats = getAllStats(state.syllabi, state.progress);

  return (
    <>
      <DashboardView
        state={state}
        allStats={allStats}
        onExport={handleExport}
        onImport={handleImport}
        onClearAll={handleClearAll}
      />
      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg transition-all ${
            toast.error
              ? "bg-destructive text-destructive-foreground"
              : "bg-foreground text-background"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
