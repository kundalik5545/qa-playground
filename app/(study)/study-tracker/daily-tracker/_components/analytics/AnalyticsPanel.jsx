"use client";

/**
 * AnalyticsPanel
 * ---------------
 * The right-side analytics column shown alongside the task list.
 *
 * Responsibilities:
 *  - Computes per-period stats (done count, total count, time, completion %)
 *  - Renders 4 summary stat cards
 *  - Renders Weekly / Monthly toggle
 *  - Passes pre-computed arrays to the three chart sub-components
 *
 * Props:
 *  - state         object  — full tracker state from studyTrackerStorage
 *  - selectedDate  string  — YYYY-MM-DD, used for the time-allocation doughnut
 *  - filterMode    "weekly" | "monthly"
 *  - setFilterMode function
 */

import { cn } from "@/lib/utils";
import { formatMinutes, habitAppliesOnDate } from "@/lib/studyTrackerStorage";
import CompletionRateChart from "../charts/CompletionRateChart";
import TimeAllocationChart from "../charts/TimeAllocationChart";
import TasksPerDayChart from "../charts/TasksPerDayChart";

export default function AnalyticsPanel({
  state,
  selectedDate,
  filterMode,
  setFilterMode,
}) {
  const days = filterMode === "weekly" ? 7 : 30;

  // ── Build per-day arrays for the line + bar charts ────────────────────────
  const labels = [];
  const completed = [];
  const totals = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const str = d.toISOString().slice(0, 10);

    labels.push(
      filterMode === "weekly"
        ? d.toLocaleDateString("en-US", { weekday: "short" })
        : d.getDate().toString(),
    );

    const tasks = state.daily[str] || [];
    const habits = state.habits.filter((h) => habitAppliesOnDate(h, str));
    completed.push(
      tasks.filter((t) => t.done).length +
        habits.filter((h) => state.habitLog[str]?.[h.id]).length,
    );
    totals.push(tasks.length + habits.length);
  }

  /** Completion % per day — null means no items that day (chart spans gap) */
  const ratePct = totals.map((t, i) =>
    t ? Math.round((completed[i] / t) * 100) : null,
  );

  // ── Summary stat cards (aggregate over period) ────────────────────────────
  const periodDone = completed.reduce((a, b) => a + b, 0);
  const periodTotal = totals.reduce((a, b) => a + b, 0);
  const periodPct = periodTotal
    ? Math.round((periodDone / periodTotal) * 100)
    : 0;

  let periodTimeMin = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const str = d.toISOString().slice(0, 10);
    const tasks = state.daily[str] || [];
    const habits = state.habits.filter((h) => habitAppliesOnDate(h, str));
    periodTimeMin +=
      tasks.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
      habits
        .filter((h) => state.habitLog[str]?.[h.id])
        .reduce((s, h) => s + (h.timeMin || 0), 0);
  }

  const statCards = [
    { val: periodDone, lbl: "Items Done" },
    { val: periodTotal, lbl: "Total Items" },
    { val: periodPct + "%", lbl: "Completion" },
    { val: formatMinutes(periodTimeMin), lbl: "Time Done" },
  ];

  // ── Time-allocation data for the selected day (doughnut chart) ───────────
  const selTasks = state.daily[selectedDate] || [];
  const selHabits = state.habits.filter((h) =>
    habitAppliesOnDate(h, selectedDate),
  );
  const selDoneMin =
    selTasks.filter((t) => t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
    selHabits
      .filter((h) => state.habitLog[selectedDate]?.[h.id])
      .reduce((s, h) => s + (h.timeMin || 0), 0);
  const selRemainingMin =
    selTasks.filter((t) => !t.done).reduce((s, t) => s + (t.timeMin || 0), 0) +
    selHabits
      .filter((h) => !state.habitLog[selectedDate]?.[h.id])
      .reduce((s, h) => s + (h.timeMin || 0), 0);

  return (
    <div className="bg-white border border-[#e9eaed] rounded-xl p-4">
      {/* Section header + Weekly/Monthly toggle */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-[7px]">
        <h3 className="text-sm font-semibold text-[#374151] mb-0 mt-0">
          Analytics
        </h3>
        <div className="flex gap-[2px] bg-gray-100 p-[3px] rounded-lg">
          {["weekly", "monthly"].map((mode) => (
            <button
              key={mode}
              className={cn(
                "border-none bg-transparent rounded-[6px] px-3 py-1 font-[inherit] text-[0.78rem] font-medium text-gray-500 cursor-pointer transition-all",
                filterMode === mode && "bg-white text-[#1f2937] shadow-sm",
              )}
              onClick={() => setFilterMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* 4 summary stat cards */}
      <div className="grid grid-cols-4 gap-[7px] mb-3">
        {statCards.map(({ val, lbl }) => (
          <div
            key={lbl}
            className="bg-[#f8f9fc] border border-[#e9eaed] rounded-[10px] px-[6px] py-[10px] text-center"
          >
            <div className="text-[1.15rem] font-bold text-[#111827] font-mono">
              {val}
            </div>
            <div className="text-[0.64rem] font-semibold text-gray-400 uppercase tracking-[0.4px] mt-[2px]">
              {lbl}
            </div>
          </div>
        ))}
      </div>

      {/* Completion rate line chart */}
      <CompletionRateChart
        labels={labels}
        ratePct={ratePct}
        filterMode={filterMode}
      />

      {/* Time-allocation doughnut + Tasks-per-day bar chart side by side */}
      <div className="grid grid-cols-2 gap-[10px] mt-[10px]">
        <TimeAllocationChart
          doneMinutes={selDoneMin}
          remainingMinutes={selRemainingMin}
        />
        <TasksPerDayChart
          labels={labels}
          completed={completed}
          totals={totals}
        />
      </div>
    </div>
  );
}
