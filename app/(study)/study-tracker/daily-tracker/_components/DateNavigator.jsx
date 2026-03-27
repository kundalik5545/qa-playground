"use client";

/**
 * DateNavigator
 * -------------
 * The horizontal date-strip bar above the task list.
 *
 * Shows a 7-day window (±3 days from the selected date) with:
 *  - Prev / Next week arrow buttons
 *  - A dot indicator under each day (amber = has tasks, green = all done)
 *  - "Today" shortcut button
 *  - Native date-picker input for jumping to any date
 */

import { cn } from "@/lib/utils";
import { getTodayStr, habitAppliesOnDate } from "@/lib/studyTrackerStorage";

export default function DateNavigator({ state, selectedDate, onSelectDate }) {
  const today = getTodayStr();

  /** Build the 7-day window centred on selectedDate (-3 … +3) */
  const stripDates = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + i);
    stripDates.push(d.toISOString().slice(0, 10));
  }

  /**
   * Returns the dot status for a given day:
   *  "all-done"  — every task and habit completed  (green dot)
   *  "has-tasks" — some tasks exist but not all done (amber dot)
   *  ""          — no tasks or habits (no dot)
   */
  const getDotStatus = (date) => {
    const tasks = state.daily[date] || [];
    const habits = state.habits.filter((h) => habitAppliesOnDate(h, date));
    const doneCount =
      tasks.filter((t) => t.done).length +
      habits.filter((h) => state.habitLog[date]?.[h.id]).length;
    const totalCount = tasks.length + habits.length;

    if (!totalCount) return "";
    return doneCount === totalCount ? "all-done" : "has-tasks";
  };

  /** Jump selected date back by one week */
  const goToPreviousWeek = () => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() - 7);
    onSelectDate(d.toISOString().slice(0, 10));
  };

  /** Jump selected date forward by one week */
  const goToNextWeek = () => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + 7);
    onSelectDate(d.toISOString().slice(0, 10));
  };

  return (
    <div className="flex items-center gap-[10px] bg-white border border-[#e9eaed] rounded-xl px-3 py-[9px] mb-3">
      {/* Date strip with prev/next arrows */}
      <div className="flex items-center gap-[5px] flex-1 min-w-0 overflow-hidden">
        {/* Previous week */}
        <button
          className="bg-gray-100 border-none rounded-[6px] w-7 h-7 cursor-pointer text-[0.7rem] text-[#374151] flex items-center justify-center hover:bg-gray-200 transition-all flex-shrink-0"
          title="Previous week"
          onClick={goToPreviousWeek}
        >
          ◀
        </button>

        {/* 7-day strip */}
        <div className="flex gap-[3px] flex-1 min-w-0 overflow-hidden [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {stripDates.map((date) => {
            const d = new Date(date + "T00:00:00");
            const dot = getDotStatus(date);
            const isSelected = date === selectedDate;
            const isToday = date === today;

            return (
              <div
                key={date}
                className={cn(
                  "flex flex-col items-center py-[5px] rounded-lg cursor-pointer transition-all flex-1 min-w-0 border-2 border-transparent hover:bg-gray-100",
                  isSelected && "bg-[#eff2ff] border-blue-600",
                )}
                onClick={() => onSelectDate(date)}
              >
                {/* Weekday label */}
                <span className="text-[0.6rem] font-semibold text-gray-400 uppercase">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </span>

                {/* Day number */}
                <span
                  className={cn(
                    "text-[0.9rem] font-semibold text-[#1f2937] font-mono",
                    isToday && "text-blue-600 font-bold",
                  )}
                >
                  {d.getDate()}
                </span>

                {/* Status dot */}
                <span
                  className={cn(
                    "w-1 h-1 rounded-full mt-[2px]",
                    dot === "has-tasks" && "bg-amber-400",
                    dot === "all-done" && "bg-green-500",
                    !dot && "bg-transparent",
                  )}
                />
              </div>
            );
          })}
        </div>

        {/* Next week */}
        <button
          className="bg-gray-100 border-none rounded-[6px] w-7 h-7 cursor-pointer text-[0.7rem] text-[#374151] flex items-center justify-center hover:bg-gray-200 transition-all flex-shrink-0"
          title="Next week"
          onClick={goToNextWeek}
        >
          ▶
        </button>
      </div>

      {/* Today shortcut + date picker */}
      <div className="flex items-center gap-[7px] flex-shrink-0">
        <button
          className="bg-blue-600 text-white border-none rounded-[6px] px-[11px] py-[5px] font-[inherit] text-[0.76rem] font-semibold cursor-pointer flex-shrink-0 hover:bg-blue-700 transition-all"
          onClick={() => onSelectDate(today)}
        >
          Today
        </button>
        <input
          type="date"
          className="border border-[#e9eaed] rounded-[6px] px-[7px] py-1 font-[inherit] text-[0.76rem] text-[#374151] cursor-pointer flex-shrink-0 outline-none"
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
        />
      </div>
    </div>
  );
}
