"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Download, Upload, Trash2 } from "lucide-react";
import { getSyllabusStats, getLast14Days, getTodayStr } from "@/lib/studyTrackerStorage";
import TodaysTasksChart from "./charts/TodaysTasksChart";
import DailyTaskCompletionChart from "./charts/DailyTaskCompletionChart";
import OverallProgressChart from "./charts/OverallProgressChart";
import TopicsCompletedChart from "./charts/TopicsCompletedChart";
import ProgressBySyllabusChart from "./charts/ProgressBySyllabusChart";
import CompletionBreakdownChart from "./charts/CompletionBreakdownChart";

export default function DashboardView({ state, allStats, onExport, onImport, onClearAll }) {
  const router = useRouter();
  const today = getTodayStr();
  const days = getLast14Days();
  const syllabusIds = useMemo(
    () => Object.keys(state?.syllabi || {}),
    [state?.syllabi],
  );

  // ── Today's Tasks donut ─────────────────────────────────────────────────────
  const todayTasks = state?.daily?.[today] || [];
  const todayDone = todayTasks.filter((t) => t.done).length;
  const todayRemaining = Math.max(todayTasks.length - todayDone, 0);
  const hasTasksToday = todayTasks.length > 0;
  const taskPieData = [
    { name: "Done", value: todayDone },
    { name: "Remaining", value: todayRemaining || (todayDone ? 0 : 1) },
  ];

  // ── Daily Task Completion % line ────────────────────────────────────────────
  const taskCompData = useMemo(
    () =>
      days.map((day) => {
        const tasks = state?.daily?.[day] || [];
        const done = tasks.filter((t) => t.done).length;
        const total = tasks.length;
        return {
          date: day.slice(5),
          pct: total > 0 ? Math.round((done / total) * 100) : null,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state?.daily],
  );

  // ── Overall Progress donut ──────────────────────────────────────────────────
  const overallPieData = [
    { name: "Completed", value: allStats.done },
    {
      name: "Remaining",
      value: Math.max(allStats.total - allStats.done, 0) || (allStats.done ? 0 : 1),
    },
  ];

  // ── Topics Completed per day (multi-line) ───────────────────────────────────
  const topicsLineData = useMemo(() => {
    if (!state?.syllabi || !state?.progress) return [];
    return days.map((day) => {
      const entry = { date: day.slice(5) };
      for (const id of syllabusIds) {
        const syl = state.syllabi[id];
        let count = 0;
        for (const sec of syl.sections)
          for (const topic of sec.topics)
            if (
              state.progress[topic.id]?.done &&
              state.progress[topic.id]?.date === day
            )
              count++;
        entry[syl.label] = count;
      }
      return entry;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.syllabi, state?.progress]);

  // ── Progress by Syllabus stacked bar ────────────────────────────────────────
  const barData = useMemo(
    () =>
      syllabusIds.map((id) => {
        const syl = state.syllabi[id];
        const s = getSyllabusStats(state.syllabi, state.progress, id);
        return {
          name: syl.label,
          Completed: s.done,
          Remaining: Math.max(s.total - s.done, 0),
          color: syl.color,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state?.syllabi, state?.progress, syllabusIds],
  );

  // ── Completion Breakdown donut ──────────────────────────────────────────────
  const completionPieData = useMemo(
    () =>
      syllabusIds.map((id) => {
        const syl = state.syllabi[id];
        const s = getSyllabusStats(state.syllabi, state.progress, id);
        return { name: syl.label, value: s.done, color: syl.color };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state?.syllabi, state?.progress, syllabusIds],
  );
  const hasCompletionData = completionPieData.some((d) => d.value > 0);

  // ── Recent Activity ─────────────────────────────────────────────────────────
  const recentLog = useMemo(() => {
    const byDate = [];
    const seen = new Map();
    for (const entry of [...(state?.log || [])].reverse()) {
      if (!seen.has(entry.date)) {
        seen.set(entry.date, []);
        byDate.push({ date: entry.date, entries: seen.get(entry.date) });
      }
      seen.get(entry.date).push(entry);
      if (byDate.length >= 7) break;
    }
    return byDate;
  }, [state?.log]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">QA Study Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your personal learning progress dashboard
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={onExport}>
            <Download className="mr-1.5 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" variant="outline" onClick={onImport}>
            <Upload className="mr-1.5 h-4 w-4" />
            Import
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 className="mr-1.5 h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes all progress, tasks, habits, and
                  resets everything to defaults. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onClearAll}
                >
                  Yes, clear all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* ── Overview Cards ── */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        <OverviewCard
          icon="🎯"
          label="Overall"
          pct={allStats.pct}
          sub={`${allStats.done} / ${allStats.total} topics`}
          color="#1f2937"
        />
        {syllabusIds.map((id) => {
          const syl = state.syllabi[id];
          const s = getSyllabusStats(state.syllabi, state.progress, id);
          return (
            <OverviewCard
              key={id}
              icon={syl.icon}
              label={syl.label}
              pct={s.pct}
              sub={`${s.done} / ${s.total} topics`}
              color={syl.color}
              onClick={() => router.push(`/study-tracker/syllabus/${id}`)}
            />
          );
        })}
      </div>

      {/* ── Row 1: Today's Tasks | Daily Task Completion % ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodaysTasksChart
          taskPieData={taskPieData}
          hasTasksToday={hasTasksToday}
          todayDone={todayDone}
          todayTasksLength={todayTasks.length}
        />
        <DailyTaskCompletionChart taskCompData={taskCompData} />
      </div>

      {/* ── Row 2: Overall Progress | Topics Completed ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OverallProgressChart overallPieData={overallPieData} allStats={allStats} />
        <TopicsCompletedChart
          topicsLineData={topicsLineData}
          syllabi={state.syllabi}
          syllabusIds={syllabusIds}
        />
      </div>

      {/* ── Row 3: Progress by Syllabus | Completion Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        <ProgressBySyllabusChart barData={barData} />
        <CompletionBreakdownChart
          completionPieData={completionPieData}
          hasCompletionData={hasCompletionData}
        />
      </div>

      {/* ── Recent Activity ── */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="font-semibold text-base">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          {recentLog.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-6">
              No activity yet. Start checking off topics!
            </p>
          ) : (
            <div className="space-y-3">
              {recentLog.map(({ date, entries }) => {
                const d = new Date(date + "T00:00:00");
                const label = d.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                });
                return (
                  <div key={date} className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20 shrink-0">
                      {label}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {entries.map((entry, i) => {
                        const syl = state.syllabi?.[entry.tabId];
                        if (!syl) return null;
                        return (
                          <span
                            key={i}
                            className="text-xs font-medium px-2.5 py-1 rounded-full"
                            style={{
                              background: syl.color + "18",
                              color: syl.color,
                            }}
                          >
                            {syl.icon} +{entry.count} in {syl.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OverviewCard({ icon, label, pct, sub, color, onClick }) {
  return (
    <div
      className={`shrink-0 w-48 rounded-xl bg-card p-4 flex flex-col gap-1.5 shadow-sm transition-shadow duration-200${onClick ? " cursor-pointer hover:shadow-lg" : ""}`}
      style={{
        borderTop: `4px solid ${color}`,
        boxShadow: `0 2px 8px 0 ${color}18, 0 1px 3px 0 rgba(0,0,0,0.08)`,
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <span className="text-2xl leading-none">{icon}</span>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
        {label}
      </p>
      <p className="text-[2rem] font-bold leading-none mt-0.5" style={{ color }}>
        {pct}%
      </p>
      <p className="text-xs text-muted-foreground">{sub}</p>
      <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: pct > 0 ? `${pct}%` : "0%",
            backgroundColor: color,
            minWidth: pct > 0 ? "4px" : "0",
          }}
        />
      </div>
    </div>
  );
}
