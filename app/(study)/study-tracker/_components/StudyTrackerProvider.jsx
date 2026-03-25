"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  loadAllState,
  saveKey,
  getAllStats,
  getTodayStr,
  downloadJSON,
  pickJSONFile,
  STORAGE_KEYS,
} from "@/lib/studyTrackerStorage";
import { mergeStates } from "@/lib/trackerDb";
import DEFAULT_SYLLABUS_DATA from "@/data/studyTrackerSyllabi";
import { authClient } from "@/lib/auth-client";

const StudyTrackerContext = createContext(null);
export const useTracker = () => useContext(StudyTrackerContext);

export default function StudyTrackerProvider({ children }) {
  const [state, setState] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false, error: false });
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const syncTimers = useRef({});

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
          const finalState = mergeStates(localState, {
            ...dbState,
            syllabi: dbState.syllabi || localState.syllabi,
          });
          setState(finalState);
          Object.entries(finalState).forEach(([k, v]) => saveKey(k, v));
        } else {
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
      const delay =
        key === "syllabi" ? 2000 : key === "progress" || key === "subtopics" ? 1000 : 0;
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

  const handleExport = useCallback(() => {
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
  }, [state, showToast]);

  const handleClearAll = useCallback(() => {
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
    showToast("All data cleared and reset to default.");

    if (user) {
      fetch("/api/tracker/state", { method: "DELETE" }).catch((err) =>
        console.error("[tracker] clear DB failed", err)
      );
    }
  }, [user, showToast]);

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

      if (user) {
        fetch("/api/tracker/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullState: next }),
        }).catch((err) => console.error("[tracker] import sync failed", err));
      }
    });
  }, [user, showToast]);

  const allStats = state ? getAllStats(state.syllabi, state.progress) : null;

  return (
    <StudyTrackerContext.Provider
      value={{
        state,
        updateState,
        showToast,
        handleExport,
        handleImport,
        handleClearAll,
        allStats,
        user,
      }}
    >
      {children}

      {/* Toast — migrated to sonner in Phase 5 */}
      <div className={`st-toast${toast.show ? " show" : ""}${toast.error ? " error" : ""}`}>
        {toast.msg}
      </div>
    </StudyTrackerContext.Provider>
  );
}
