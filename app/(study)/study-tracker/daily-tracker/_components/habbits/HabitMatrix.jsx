"use client";

/**
 * HabitMatrix
 * ------------
 * Interactive grid table showing habit completion across days.
 *
 * Features:
 *  - Day / Week / Month view toggle
 *  - Date navigation (prev/next arrows, today shortcut, month picker)
 *  - Each cell is a toggleable checkbox (future dates are disabled)
 *  - Progress bar + done/total count in the last column
 *
 * Props:
 *  - state        object   — full tracker state (habits, habitLog)
 *  - updateState  function — persists habitLog changes
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  getTodayStr,
  habitAppliesOnDate,
  formatHabitRecurrence,
} from "@/lib/studyTrackerStorage";
import { CHECK_SVG } from "../_constants";

export default function HabitMatrix({ state, updateState }) {
  const [viewMode, setViewMode] = useState("week");
  const [anchorDate, setAnchorDate] = useState(getTodayStr());

  const today = getTodayStr();

  // ── Build the list of date strings for the current view ───────────────────
  function buildDates() {
    if (viewMode === "day") return [anchorDate];

    if (viewMode === "week") {
      const base = new Date(anchorDate + "T00:00:00");
      // Start from Sunday of the anchor's week
      const sun = new Date(base);
      sun.setDate(base.getDate() - base.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sun);
        d.setDate(sun.getDate() + i);
        return d.toISOString().slice(0, 10);
      });
    }

    // month view
    const [y, m] = anchorDate.slice(0, 7).split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dd = String(i + 1).padStart(2, "0");
      return `${y}-${String(m).padStart(2, "0")}-${dd}`;
    });
  }

  const dates = buildDates();

  /** Move the anchor date by delta periods (weeks, months, or days) */
  function shiftAnchor(delta) {
    const d = new Date(anchorDate + "T00:00:00");
    if (viewMode === "week") d.setDate(d.getDate() + delta * 7);
    if (viewMode === "month") d.setMonth(d.getMonth() + delta);
    if (viewMode === "day") d.setDate(d.getDate() + delta);
    setAnchorDate(d.toISOString().slice(0, 10));
  }

  /** Toggle a habit's done state for a specific date */
  function toggleHabit(habitId, date) {
    const dayLog = { ...(state.habitLog[date] || {}) };
    dayLog[habitId] = !dayLog[habitId];
    updateState("habitLog", { ...state.habitLog, [date]: dayLog });
  }

  /** Calculate done / total for a habit over the visible period (past + today) */
  function getHabitProgress(habit) {
    const applicable = dates.filter(
      (d) => d <= today && habitAppliesOnDate(habit, d),
    );
    const done = applicable.filter((d) => state.habitLog[d]?.[habit.id]).length;
    return { done, total: applicable.length };
  }

  /** Class for the view-mode toggle buttons */
  const modeBtnCls = (mode) =>
    cn(
      "border-none rounded-[6px] px-3 py-1 font-[inherit] text-[0.78rem] font-medium cursor-pointer transition-all",
      viewMode === mode
        ? "bg-blue-600 text-white"
        : "bg-transparent text-gray-500 hover:bg-gray-100",
    );

  /** Class for column header cells */
  const colHeaderCls = (date) =>
    cn(
      "text-center pb-2 px-2 text-[0.7rem] font-semibold uppercase whitespace-nowrap",
      date === today
        ? "text-blue-600"
        : date > today
          ? "text-gray-300"
          : "text-gray-400",
    );

  return (
    <div className="bg-white border border-[#e9eaed] rounded-[14px] p-5 mt-[18px]">
      {/* Header: title + view mode toggle + date navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="text-sm font-semibold text-[#374151] m-0">
          Habit Tracker
        </h3>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Day / Week / Month toggle */}
          <div className="flex gap-[2px] bg-gray-100 p-[3px] rounded-lg">
            {["day", "week", "month"].map((mode) => (
              <button
                key={mode}
                className={modeBtnCls(mode)}
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Date navigation controls — differ by view mode */}
          <div className="flex items-center gap-[6px]">
            {viewMode === "day" && (
              <>
                <button
                  className="bg-blue-600 text-white border-none rounded-[6px] px-[10px] py-[5px] font-[inherit] text-[0.75rem] font-semibold cursor-pointer hover:bg-blue-700 transition-all"
                  onClick={() => setAnchorDate(today)}
                >
                  Today
                </button>
                <input
                  type="date"
                  className="border border-[#e9eaed] rounded-[6px] px-[7px] py-1 font-[inherit] text-[0.76rem] text-[#374151] cursor-pointer outline-none"
                  value={anchorDate}
                  onChange={(e) => setAnchorDate(e.target.value)}
                />
              </>
            )}

            {viewMode === "week" && (
              <>
                <button
                  className="bg-gray-100 border-none rounded-[6px] w-7 h-7 cursor-pointer text-[0.7rem] text-[#374151] flex items-center justify-center hover:bg-gray-200 transition-all"
                  onClick={() => shiftAnchor(-1)}
                >
                  ◀
                </button>
                <button
                  className="border-none bg-transparent text-[0.76rem] font-semibold text-blue-600 cursor-pointer hover:underline px-1 py-0"
                  onClick={() => setAnchorDate(today)}
                >
                  This Week
                </button>
                <button
                  className="bg-gray-100 border-none rounded-[6px] w-7 h-7 cursor-pointer text-[0.7rem] text-[#374151] flex items-center justify-center hover:bg-gray-200 transition-all"
                  onClick={() => shiftAnchor(1)}
                >
                  ▶
                </button>
              </>
            )}

            {viewMode === "month" && (
              <input
                type="month"
                className="border border-[#e9eaed] rounded-[6px] px-[7px] py-1 font-[inherit] text-[0.76rem] text-[#374151] cursor-pointer outline-none"
                value={anchorDate.slice(0, 7)}
                onChange={(e) => setAnchorDate(e.target.value + "-01")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {state.habits.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-[0.83rem]">
          No habits yet. Create one using the form above!
        </div>
      ) : (
        <div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <table
            className="w-full border-collapse"
            style={{
              minWidth: viewMode === "month" ? dates.length * 38 + 200 : "auto",
            }}
          >
            <thead>
              <tr className="border-b border-[#e9eaed]">
                {/* Habit name column header */}
                <th
                  className="text-left pb-2 px-2 text-[0.72rem] font-semibold text-gray-500 uppercase whitespace-nowrap"
                  style={{ minWidth: 140 }}
                >
                  Habit
                </th>

                {/* Date column headers */}
                {dates.map((date) => {
                  const d = new Date(date + "T00:00:00");
                  return (
                    <th key={date} className={colHeaderCls(date)}>
                      {viewMode === "month" ? (
                        d.getDate()
                      ) : (
                        <>
                          {d.toLocaleDateString("en-US", { weekday: "short" })}
                          <br />
                          <span
                            className={cn(
                              "font-bold",
                              date === today && "text-blue-600",
                            )}
                          >
                            {d.getDate()}
                          </span>
                        </>
                      )}
                    </th>
                  );
                })}

                {/* Progress column header */}
                <th
                  className="text-center pb-2 px-2 text-[0.72rem] font-semibold text-gray-500 uppercase whitespace-nowrap"
                  style={{ minWidth: 80 }}
                >
                  Progress
                </th>
              </tr>
            </thead>

            <tbody>
              {state.habits.map((habit) => {
                const { done, total } = getHabitProgress(habit);
                const pct = total ? Math.round((done / total) * 100) : 0;

                return (
                  <tr
                    key={habit.id}
                    className="border-b border-gray-50 hover:bg-[#faf5ff] transition-colors"
                  >
                    {/* Habit name + recurrence label */}
                    <td className="px-2 py-[8px] text-left">
                      <div className="text-[0.82rem] font-semibold text-[#1f2937] max-w-[140px] truncate">
                        {habit.title}
                      </div>
                      <div className="text-[0.68rem] text-gray-400 capitalize">
                        {formatHabitRecurrence(habit)}
                      </div>
                    </td>

                    {/* One checkbox cell per date */}
                    {dates.map((date) => {
                      const applies = habitAppliesOnDate(habit, date);
                      const isFuture = date > today;
                      const isToday = date === today;
                      const isDone = !!state.habitLog[date]?.[habit.id];

                      // Habit doesn't apply this day — empty cell
                      if (!applies)
                        return (
                          <td
                            key={date}
                            className="text-center px-2 py-[8px]"
                          />
                        );

                      return (
                        <td key={date} className="text-center px-2 py-[8px]">
                          <div
                            className={cn(
                              "w-[18px] h-[18px] border-2 rounded-[4px] flex items-center justify-center mx-auto transition-all",
                              isFuture
                                ? "border-gray-200 bg-gray-50 opacity-40 cursor-not-allowed"
                                : isDone
                                  ? "bg-purple-700 border-purple-700 cursor-pointer"
                                  : cn(
                                      "border-gray-300 cursor-pointer hover:border-purple-400",
                                      isToday &&
                                        "border-blue-500 ring-2 ring-blue-200",
                                    ),
                            )}
                            onClick={() =>
                              !isFuture && toggleHabit(habit.id, date)
                            }
                          >
                            {isDone && !isFuture && CHECK_SVG}
                          </div>
                        </td>
                      );
                    })}

                    {/* Progress bar + done/total */}
                    <td className="px-2 py-[8px]">
                      <div className="min-w-[60px]">
                        <div className="h-[5px] bg-[#f0f1f4] rounded-full overflow-hidden mb-[3px]">
                          <div
                            className={cn(
                              "h-full rounded-full transition-[width] duration-500",
                              pct === 100 ? "bg-green-500" : "bg-purple-700",
                            )}
                            style={{ width: pct + "%" }}
                          />
                        </div>
                        <div className="text-[0.65rem] font-mono text-gray-400 text-center">
                          {done}/{total}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
