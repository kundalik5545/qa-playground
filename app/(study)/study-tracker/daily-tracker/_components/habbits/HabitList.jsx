"use client";

/**
 * HabitList
 * ----------
 * Card showing all existing recurring habits with progress bars.
 *
 * Props:
 *  - habits        array     — from state.habits
 *  - habitLog      object    — from state.habitLog
 *  - onDeleteHabit function  — called with habit index
 */

import {
  getTodayStr,
  formatMinutes,
  formatHabitRecurrence,
  countHabitScheduled,
  countHabitDone,
} from "@/lib/studyTrackerStorage";
import { CARD_TITLE_CLS } from "../_constants";
import { cn } from "@/lib/utils";

export default function HabitList({ habits, habitLog, onDeleteHabit }) {
  const today = getTodayStr();

  return (
    <div className="bg-white border border-[#e9eaed] rounded-[14px] p-5">
      <h3 className={cn(CARD_TITLE_CLS, "mb-3")}>Your Habits</h3>

      {habits.length === 0 ? (
        <div className="py-[18px] text-center text-gray-400 text-[0.83rem]">
          No habits yet. Create one using the form!
        </div>
      ) : (
        habits.map((habit, index) => {
          const scheduled = countHabitScheduled(habit, today);
          const done = countHabitDone(habit, habitLog);
          const completionRate = scheduled
            ? Math.round((done / scheduled) * 100)
            : 0;

          return (
            <div
              key={habit.id}
              className="flex items-start gap-[10px] py-[11px] border-b border-gray-100 last:border-b-0"
            >
              <div className="text-base flex-shrink-0 mt-[2px]">🔄</div>

              <div className="flex-1 min-w-0">
                {/* Habit title */}
                <div className="text-[0.86rem] font-semibold text-[#1f2937] mb-[2px]">
                  {habit.title}
                </div>

                {/* Meta line: recurrence · time · date range · completion */}
                <div className="text-[0.73rem] text-gray-400 mb-[5px]">
                  {formatHabitRecurrence(habit)}{" "}
                  {habit.timeMin ? "· " + formatMinutes(habit.timeMin) : ""} ·{" "}
                  {habit.startDate} {habit.endDate ? "→ " + habit.endDate : "∞"}{" "}
                  ·{" "}
                  <span className="text-green-600 font-semibold">
                    {done}/{scheduled} ({completionRate}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-[3px] bg-[#f0f1f4] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-700 rounded-full transition-[width] duration-500"
                    style={{ width: completionRate + "%" }}
                  />
                </div>
              </div>

              {/* Delete button */}
              <button
                className="bg-transparent border-none cursor-pointer text-gray-300 text-base leading-none px-[2px] hover:text-red-500 transition-all flex-shrink-0"
                onClick={() => onDeleteHabit(index)}
              >
                ×
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
