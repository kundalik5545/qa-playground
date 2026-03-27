"use client";

import { useTracker } from "../_components/StudyTrackerProvider";
import SyllabusManagerView from "./_components/SyllabusManagerView";

export default function SyllabusPage() {
  const { state, updateState, showToast } = useTracker();

  if (!state) return null;

  return (
    <SyllabusManagerView
      state={state}
      updateState={updateState}
      showToast={showToast}
    />
  );
}
