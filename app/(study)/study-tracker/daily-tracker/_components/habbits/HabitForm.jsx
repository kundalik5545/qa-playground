"use client";

/**
 * HabitForm
 * ----------
 * Form card for creating a new recurring habit.
 *
 * Props:
 *  - habitForm     object    — controlled form state
 *  - setHabitForm  function  — state setter
 *  - onAddHabit    function  — called when "Create Habit" is clicked
 */

import { cn } from "@/lib/utils";
import { computeHabitEndDate } from "@/lib/studyTrackerStorage";
import { DAYS, CARD_TITLE_CLS } from "../_constants";

/** Shared input class for the habit form fields */
const FIELD_CLS =
  "w-full border border-[#e9eaed] rounded-lg px-[10px] py-[7px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

/** Shared label class for the habit form fields */
const LABEL_CLS =
  "block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px]";

/** Returns active/inactive pill class for recurrence & duration buttons */
const pillCls = (active) =>
  cn(
    "border border-[#e9eaed] bg-white rounded-full px-3 py-1 font-[inherit] text-[0.77rem] font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-all",
    active && "bg-blue-600 text-white border-blue-600",
  );

export default function HabitForm({ habitForm, setHabitForm, onAddHabit }) {
  /** The computed or custom end date shown in the End Date label */
  const computedEnd =
    habitForm.duration === "indefinite"
      ? null
      : habitForm.duration === "custom"
        ? habitForm.endDate
        : computeHabitEndDate(habitForm.startDate, habitForm.duration);

  return (
    <div className="bg-white border border-[#e9eaed] rounded-[14px] p-5">
      <h3 className={cn(CARD_TITLE_CLS, "mb-[14px]")}>
        ➕ New Recurring Habit
      </h3>

      {/* Title + time row */}
      <div className="flex gap-[10px]">
        <div className="flex flex-col gap-1 mb-3" style={{ flex: 2 }}>
          <label className={LABEL_CLS}>Habit Name</label>
          <input
            className={FIELD_CLS}
            placeholder="e.g. Morning Review"
            value={habitForm.title}
            onChange={(e) =>
              setHabitForm((f) => ({ ...f, title: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-1 mb-3 flex-1">
          <label className={LABEL_CLS}>Time (min)</label>
          <input
            type="number"
            className={FIELD_CLS}
            placeholder="30"
            min={1}
            value={habitForm.time}
            onChange={(e) =>
              setHabitForm((f) => ({ ...f, time: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Repeat pattern */}
      <div className="flex flex-col gap-1 mb-3">
        <label className={LABEL_CLS}>Repeat Pattern</label>
        <div className="flex flex-wrap gap-[5px]">
          {[
            ["daily", "Daily"],
            ["weekdays", "Weekdays"],
            ["weekends", "Weekends"],
            ["custom", "Custom Days"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={pillCls(habitForm.recurrence === value)}
              onClick={() => setHabitForm((f) => ({ ...f, recurrence: value }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom day-of-week selector — shown only when recurrence = "custom" */}
      {habitForm.recurrence === "custom" && (
        <div className="flex flex-col gap-1 mb-3">
          <label className={LABEL_CLS}>Select Days</label>
          <div className="flex gap-1 flex-wrap">
            {DAYS.map((dayLabel, dayIndex) => (
              <button
                key={dayIndex}
                className={cn(
                  "w-[38px] h-[34px] border border-[#e9eaed] bg-white rounded-lg font-[inherit] text-[0.73rem] font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 transition-all",
                  habitForm.customDays.includes(dayIndex) &&
                    "bg-purple-700 text-white border-purple-700",
                )}
                onClick={() =>
                  setHabitForm((f) => ({
                    ...f,
                    customDays: f.customDays.includes(dayIndex)
                      ? f.customDays.filter((x) => x !== dayIndex)
                      : [...f.customDays, dayIndex],
                  }))
                }
              >
                {dayLabel}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Duration pills */}
      <div className="flex flex-col gap-1 mb-3">
        <label className={LABEL_CLS}>Duration</label>
        <div className="flex flex-wrap gap-[5px]">
          {[
            ["1week", "1 Week"],
            ["2weeks", "2 Weeks"],
            ["3weeks", "3 Weeks"],
            ["1month", "1 Month"],
            ["2months", "2 Months"],
            ["indefinite", "Indefinite"],
            ["custom", "Custom"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={pillCls(habitForm.duration === value)}
              onClick={() => setHabitForm((f) => ({ ...f, duration: value }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Start + end date row */}
      <div className="flex gap-[10px]">
        <div className="flex flex-col gap-1 mb-3 flex-1">
          <label className={LABEL_CLS}>Start Date</label>
          <input
            type="date"
            className={FIELD_CLS}
            value={habitForm.startDate}
            onChange={(e) =>
              setHabitForm((f) => ({ ...f, startDate: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col gap-1 mb-3 flex-1">
          <label className={LABEL_CLS}>
            End Date{" "}
            {computedEnd && (
              <span className="text-[0.7rem] text-green-600 font-semibold ml-1">
                (→ {computedEnd})
              </span>
            )}
          </label>
          <input
            type="date"
            className={FIELD_CLS}
            value={computedEnd || habitForm.endDate || ""}
            disabled={
              habitForm.duration !== "indefinite" &&
              habitForm.duration !== "custom"
            }
            onChange={(e) =>
              setHabitForm((f) => ({ ...f, endDate: e.target.value }))
            }
          />
        </div>
      </div>

      <button
        className="w-full bg-blue-600 text-white border-none rounded-[9px] py-[9px] font-[inherit] text-[0.86rem] font-semibold cursor-pointer hover:bg-blue-700 transition-all mt-1"
        onClick={onAddHabit}
      >
        Create Habit
      </button>
    </div>
  );
}
