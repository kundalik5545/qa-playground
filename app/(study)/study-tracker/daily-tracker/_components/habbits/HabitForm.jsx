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
 *  - onCancel      function  — called when "Cancel" is clicked
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { computeHabitEndDate } from "@/lib/studyTrackerStorage";
import { CARD_TITLE_CLS } from "../_constants";
import TimeSlotPicker, { computeToTime } from "../TimeSlotPicker";

const FIELD_CLS =
  "w-full border border-[#e9eaed] rounded-lg px-[10px] py-[7px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

const LABEL_CLS =
  "block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px] mb-1";

const pillCls = (active) =>
  cn(
    "border border-[#e9eaed] bg-white rounded-full px-3 py-1 font-[inherit] text-[0.77rem] font-medium text-gray-500 cursor-pointer hover:bg-gray-100 transition-all",
    active && "bg-blue-600 text-white border-blue-600",
  );

export default function HabitForm({
  habitForm,
  setHabitForm,
  onAddHabit,
  onCancel,
}) {
  const [nameError, setNameError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [slotError, setSlotError] = useState(false);

  const timeMin = parseInt(habitForm.time) || 0;
  const timeEmpty = !habitForm.time || timeMin <= 0;

  /** Auto-computed "To" time — derived from From + timeMin */
  const toData = computeToTime(
    habitForm.fromHour,
    habitForm.fromMin,
    habitForm.fromPeriod,
    timeMin,
  );
  const computedTo = toData?.str ?? "";

  const computedEnd =
    habitForm.duration === "custom"
      ? habitForm.endDate
      : computeHabitEndDate(habitForm.startDate, habitForm.duration);

  function handleCreate() {
    const hasNameErr = !habitForm.title.trim();
    const hasTimeErr = !habitForm.time || timeMin <= 0;
    const hasSlotErr = !habitForm.fromHour;

    setNameError(hasNameErr);
    setTimeError(hasTimeErr);
    setSlotError(hasSlotErr);

    if (hasNameErr || hasTimeErr || hasSlotErr) return;
    onAddHabit();
  }

  return (
    <div className="bg-white border border-[#e9eaed] rounded-[14px] p-5">
      <h3 className={cn(CARD_TITLE_CLS, "mb-4")}>➕ New Recurring Habit</h3>

      {/* Row 1: Habit Name + Time (Min) */}
      <div className="flex gap-3 mb-5 flex-wrap sm:flex-nowrap">
        {/* Habit Name */}
        <div className="flex flex-col w-full sm:flex-1">
          <label className={LABEL_CLS}>
            Habit Name <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            className={cn(
              FIELD_CLS,
              nameError && "border-red-400 focus:border-red-500",
            )}
            placeholder="e.g. Morning Review"
            value={habitForm.title}
            onChange={(e) => {
              setNameError(false);
              setHabitForm((f) => ({ ...f, title: e.target.value }));
            }}
          />
          {nameError && (
            <span className="text-[0.68rem] text-red-500 mt-[3px]">
              Required
            </span>
          )}
        </div>

        {/* Time (Min) — fill this BEFORE choosing Time Slot */}
        <div className="flex flex-col w-full sm:w-28 shrink-0">
          <label className={LABEL_CLS}>
            Time (min) <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            type="number"
            className={cn(
              FIELD_CLS,
              timeError && "border-red-400 focus:border-red-500",
            )}
            placeholder="30"
            min={1}
            value={habitForm.time}
            onChange={(e) => {
              setTimeError(false);
              setHabitForm((f) => ({ ...f, time: e.target.value }));
            }}
          />
          {timeError && (
            <span className="text-[0.68rem] text-red-500 mt-[3px]">
              Required
            </span>
          )}
        </div>
      </div>

      {/* Row 2 + 3: Time Slot and Duration — justify-between on lg+ */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-5">
        {/* Time Slot (required) */}
        <div className="flex flex-col gap-[6px]">
          <label className={LABEL_CLS}>
            Time Slot <span className="text-red-500 font-bold">*</span>
            {timeEmpty && (
              <span className="ml-2 text-[0.68rem] text-amber-500 normal-case font-medium tracking-normal">
                ⚠ Fill Time (min) first
              </span>
            )}
          </label>

          <TimeSlotPicker
            fromHour={habitForm.fromHour}
            fromMin={habitForm.fromMin}
            fromPeriod={habitForm.fromPeriod}
            computedTo={computedTo}
            disabled={timeEmpty}
            onChange={(parts) => {
              setSlotError(false);
              setHabitForm((f) => ({ ...f, ...parts }));
            }}
          />

          {slotError && (
            <span className="text-[0.68rem] text-red-500">
              Select a start time
            </span>
          )}
        </div>

        {/* Duration pills */}
        <div className="flex flex-col gap-[6px]">
          <label className={LABEL_CLS}>Duration</label>
          <div className="flex flex-wrap gap-[5px]">
            {[
              ["1week", "1 Week"],
              ["2weeks", "2 Weeks"],
              ["3weeks", "3 Weeks"],
              ["1month", "1 Month"],
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
      </div>

      {/* Row 4: Start Date + End Date */}
      <div className="flex gap-3 items-end mb-4 flex-wrap sm:flex-nowrap">
        <div className="flex flex-col gap-1 w-full sm:w-44 shrink-0">
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
        <div className="flex flex-col gap-1 w-full sm:w-44 shrink-0">
          <label className={LABEL_CLS}>
            End Date{" "}
            {computedEnd && (
              <span className="text-[0.7rem] text-green-600 font-semibold ml-1 normal-case tracking-normal">
                → {computedEnd}
              </span>
            )}
          </label>
          <input
            type="date"
            className={FIELD_CLS}
            value={computedEnd || habitForm.endDate || ""}
            disabled={habitForm.duration !== "custom"}
            onChange={(e) =>
              setHabitForm((f) => ({ ...f, endDate: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <button
          className="px-4 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 font-[inherit] cursor-pointer transition-all"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-1.5 text-sm bg-blue-600 text-white border-none rounded font-[inherit] font-semibold cursor-pointer hover:bg-blue-700 transition-all"
          onClick={handleCreate}
        >
          Create Habit
        </button>
      </div>
    </div>
  );
}
