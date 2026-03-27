"use client";

import { useRouter } from "next/navigation";
import { useTracker } from "../_components/StudyTrackerProvider";
import DashboardView from "./_components/DashboardView";

export default function DashboardPage() {
  const {
    state,
    allStats,
    handleExport,
    handleImport,
    handleClearAll,
    showToast,
  } = useTracker();
  const router = useRouter();

  if (!state) return null;

  const navigate = (tabId) => {
    const routes = {
      dashboard: "/study-tracker/dashboard",
      daily: "/study-tracker/daily-tracker",
      syllabi: "/study-tracker/syllabus",
      resources: "/study-tracker/resources",
    };
    router.push(routes[tabId] ?? `/study-tracker/syllabus/${tabId}`);
  };

  return (
    <DashboardView
      state={state}
      allStats={allStats}
      onExport={handleExport}
      onImport={handleImport}
      onClearAll={handleClearAll}
      onNavigate={navigate}
      showToast={showToast}
    />
  );
}
