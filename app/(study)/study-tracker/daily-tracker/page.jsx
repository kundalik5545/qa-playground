"use client";

import { useTracker } from "../_components/StudyTrackerProvider";
import DailyTrackerView from "./_components/DailyTrackerView";

export default function DailyTrackerPage() {
  const { state, updateState, showToast } = useTracker();

  if (!state) return null;

  return (
    <DailyTrackerView
      state={state}
      updateState={updateState}
      showToast={showToast}
    />
  );
}
