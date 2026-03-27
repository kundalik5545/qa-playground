"use client";

/**
 * AnalyticsPanel
 * ---------------
 * Full-width analytics section shown below the task list.
 *
 * Responsibilities:
 *  - Computes per-period stats (done count, total count, time, completion %)
 *  - Renders 4 summary stat cards
 *  - Renders Weekly / Monthly toggle
 *  - Renders Completion Rate line chart
 *  - Renders Habit Tracker matrix (moved here from the Habits tab)
 *
 * Props:
 *  - state         object    — full tracker state from studyTrackerStorage
 *  - updateState   function  — passed through to HabitMatrix for toggling
 *  - filterMode    "weekly" | "monthly"
 *  - setFilterMode function
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  formatMinutes,
  habitAppliesOnDate,
  getTodayStr,
} from "@/lib/studyTrackerStorage";
import CompletionRateChart from "../charts/CompletionRateChart";
import HabitMatrix from "../habbits/HabitMatrix";

export default function AnalyticsPanel({ state, updateState, selectedDate }) {
  const [viewMode, setViewMode] = useState("month");

  // ── Build the date range for the current view ─────────────────────────────
  const dateRange =
    viewMode === "day"
      ? [selectedDate]
      : Array.from({ length: viewMode === "week" ? 7 : 30 }, (_, i, _arr) => {
          const len = viewMode === "week" ? 7 : 30;
          const d = new Date();
          d.setDate(d.getDate() - (len - 1 - i));
          return d.toISOString().slice(0, 10);
        });

  // ── Build per-day arrays for the chart + stat cards ───────────────────────
  const labels = [];
  const completed = [];
  const totals = [];
  let periodTimeMin = 0;

  for (const str of dateRange) {
    const d = new Date(str + "T00:00:00");
    labels.push(
      viewMode === "month"
        ? d.getDate().toString()
        : d.toLocaleDateString("en-US", { weekday: "short" }),
    );

    const tasks = state.daily[str] || [];
    const habits = state.habits.filter((h) => habitAppliesOnDate(h, str));
    const doneTasks = tasks.filter((t) => t.done);
    const doneHabits = habits.filter((h) => state.habitLog[str]?.[h.id]);

    completed.push(doneTasks.length + doneHabits.length);
    totals.push(tasks.length + habits.length);
    periodTimeMin +=
      doneTasks.reduce((s, t) => s + (t.timeMin || 0), 0) +
      doneHabits.reduce((s, h) => s + (h.timeMin || 0), 0);
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

  const statCards = [
    { val: periodDone, lbl: "Items Done" },
    { val: periodTotal, lbl: "Total Items" },
    { val: periodPct + "%", lbl: "Completion" },
    { val: formatMinutes(periodTimeMin), lbl: "Time Done" },
  ];

  return (
    <div className="bg-white border border-[#e9eaed] rounded-xl p-4">
      {/* Section header + Day/Week/Month toggle */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-[7px]">
        <h3 className="text-sm font-semibold text-[#374151] mb-0 mt-0">
          Analytics
        </h3>
        <div className="flex gap-[2px] bg-gray-100 p-[3px] rounded-lg">
          {["day", "week", "month"].map((mode) => (
            <button
              key={mode}
              className={cn(
                "border-none rounded-[6px] px-3 py-1 font-[inherit] text-[0.78rem] font-medium cursor-pointer transition-all",
                viewMode === mode
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-500 hover:bg-gray-100",
              )}
              onClick={() => setViewMode(mode)}
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

      {/* Habit Tracker matrix */}
      <HabitMatrix
        state={state}
        updateState={updateState}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Completion rate line chart */}
      <CompletionRateChart
        labels={labels}
        ratePct={ratePct}
        viewMode={viewMode}
      />

      {/* Habit Progress section */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-[#374151] mb-3">
          Habit Progress
        </h3>
        {state.habits.length === 0 ? (
          <p className="text-sm text-gray-400">No habits yet.</p>
        ) : (
          <div className="flex flex-col gap-1">
            {state.habits.map((habit) => {
              const today = getTodayStr();
              const applicable = dateRange.filter(
                (d) => d <= today && habitAppliesOnDate(habit, d),
              );
              const done = applicable.filter(
                (d) => state.habitLog[d]?.[habit.id],
              ).length;
              const total = applicable.length;
              const pct = total ? Math.round((done / total) * 100) : 0;

              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="text-sm font-medium text-gray-800 w-40 truncate shrink-0">
                    {habit.title}
                  </div>
                  {habit.timeSlot && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full shrink-0">
                      {habit.timeSlot}
                    </span>
                  )}
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-500",
                        pct === 100 ? "bg-green-500" : "bg-purple-600",
                      )}
                      style={{ width: pct + "%" }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 w-12 text-right font-mono shrink-0">
                    {done}/{total}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
