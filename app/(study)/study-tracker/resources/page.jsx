"use client";

import { useTracker } from "../_components/StudyTrackerProvider";
import ResourcesView from "./_components/ResourcesView";

export default function ResourcesPage() {
  const { showToast } = useTracker();

  return <ResourcesView showToast={showToast} />;
}
