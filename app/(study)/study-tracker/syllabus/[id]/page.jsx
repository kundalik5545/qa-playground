"use client";

import { useParams } from "next/navigation";
import { useTracker } from "../../_components/StudyTrackerProvider";
import SyllabusView from "../../_components/SyllabusView";

export default function SyllabusDetailPage() {
  const { id } = useParams();
  const { state, updateState, showToast } = useTracker();

  if (!state) return null;

  const syllabus = state.syllabi[id];
  if (!syllabus) {
    return (
      <div style={{ padding: "40px", color: "#6b7280", textAlign: "center" }}>
        Syllabus not found.
      </div>
    );
  }

  return (
    <SyllabusView
      syllabus={syllabus}
      state={state}
      updateState={updateState}
      showToast={showToast}
    />
  );
}
