"use client";

import { useState, useEffect, useCallback } from "react";
import {
  loadAllState,
  loadStateFromIdb,
  saveKey,
} from "@/lib/studyTrackerStorage";
import DailyTrackerView from "../_components/DailyTrackerView";

export default function DailyTrackerPage() {
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

  const updateState = useCallback((key, value) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      saveKey(key, value);
      return next;
    });
  }, []);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <>
      <DailyTrackerView
        state={state}
        updateState={updateState}
        showToast={showToast}
      />
      {/* Toast */}
      <div
        className={`st-toast${toast.show ? " show" : ""}${toast.error ? " error" : ""}`}
      >
        {toast.msg}
      </div>
    </>
  );
}
