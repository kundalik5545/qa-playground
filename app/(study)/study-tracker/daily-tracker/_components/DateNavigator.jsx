"use client";

/**
 * DateNavigator
 * -------------
 * Single-row layout:
 *   [←]  March 2026  [→]  | day pills (flex-1) |  Today  [date input]
 */

import { cn } from "@/lib/utils";
import { getTodayStr, habitAppliesOnDate } from "@/lib/studyTrackerStorage";

export default function DateNavigator({ state, selectedDate, onSelectDate }) {
  const today = getTodayStr();

  const stripDates = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + i);
    stripDates.push(d.toISOString().slice(0, 10));
  }

  const getDotStatus = (date) => {
    const tasks  = state.daily[date] || [];
    const habits = state.habits.filter((h) => habitAppliesOnDate(h, date));
    const done   = tasks.filter((t) => t.done).length + habits.filter((h) => state.habitLog[date]?.[h.id]).length;
    const total  = tasks.length + habits.length;
    if (!total) return "";
    return done === total ? "all-done" : "has-tasks";
  };

  const goToPrev = () => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() - 7);
    onSelectDate(d.toISOString().slice(0, 10));
  };
  const goToNext = () => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + 7);
    onSelectDate(d.toISOString().slice(0, 10));
  };

  const monthLabel = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-[#e9eaed] rounded-2xl w-full mb-4 flex items-center gap-3 px-4 py-3">

      {/* ── Left: prev arrow + month label + next arrow ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={goToPrev}
          title="Previous week"
          className="w-8 h-8 rounded-lg bg-[#f3f4f6] border-none cursor-pointer text-[#374151] text-sm flex items-center justify-center hover:bg-[#e9eaed] transition-colors"
        >
          ←
        </button>
        <span className="text-[0.88rem] font-bold text-[#1a1d23] tracking-[-0.3px] whitespace-nowrap">
          {monthLabel}
        </span>
        <button
          onClick={goToNext}
          title="Next week"
          className="w-8 h-8 rounded-lg bg-[#f3f4f6] border-none cursor-pointer text-[#374151] text-sm flex items-center justify-center hover:bg-[#e9eaed] transition-colors"
        >
          →
        </button>
      </div>

      {/* ── Centre: 7 day pills ── */}
      <div className="flex flex-1 min-w-0 gap-1">
        {stripDates.map((date) => {
          const d          = new Date(date + "T00:00:00");
          const dot        = getDotStatus(date);
          const isSelected = date === selectedDate;
          const isToday    = date === today;

          return (
            <div
              key={date}
              onClick={() => onSelectDate(date)}
              className={cn(
                "flex flex-col items-center py-2 flex-1 rounded-xl cursor-pointer transition-all select-none",
                isSelected ? "bg-blue-600 shadow-sm" : "hover:bg-[#f3f4f6]",
              )}
            >
              <span className={cn(
                "text-[0.6rem] font-bold uppercase tracking-[0.4px]",
                isSelected ? "text-blue-200" : "text-gray-400",
              )}>
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </span>

              <span className={cn(
                "text-[0.95rem] font-extrabold mt-0.5 leading-none",
                isSelected ? "text-white" : isToday ? "text-blue-600" : "text-[#1f2937]",
              )}>
                {d.getDate()}
              </span>

              <span className={cn(
                "w-1.5 h-1.5 rounded-full mt-1",
                isSelected
                  ? dot === "all-done" ? "bg-green-300" : dot === "has-tasks" ? "bg-amber-300" : "bg-blue-400"
                  : dot === "all-done" ? "bg-green-500" : dot === "has-tasks" ? "bg-amber-400" : "bg-transparent",
              )} />
            </div>
          );
        })}
      </div>

      {/* ── Right: Today button + date input ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onSelectDate(today)}
          className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg px-3 py-1.5 text-[0.76rem] font-semibold cursor-pointer transition-colors whitespace-nowrap"
        >
          Today
        </button>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
          className="border border-[#e9eaed] rounded-lg px-2 py-1.5 text-[0.76rem] text-[#374151] cursor-pointer outline-none font-[inherit] hover:border-blue-400 transition-colors"
        />
      </div>

    </div>
  );
}
