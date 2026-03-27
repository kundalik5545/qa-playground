"use client";

/**
 * AddTaskForm
 * -----------
 * The input row at the bottom of the task panel.
 * Task name and time (min) are both required.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";

const INPUT_CLS =
  "flex-1 min-w-[130px] border border-[#e9eaed] rounded-[7px] px-[10px] py-[6px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors";
const TIME_CLS =
  "w-20 border border-[#e9eaed] rounded-[7px] px-2 py-[6px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors";

export default function AddTaskForm({ title, time, setTitle, setTime, onAdd }) {
  const [titleError, setTitleError] = useState(false);
  const [timeError, setTimeError] = useState(false);

  function handleAdd() {
    const hasTitleErr = !title.trim();
    const hasTimeErr = !time || Number(time) <= 0;
    setTitleError(hasTitleErr);
    setTimeError(hasTimeErr);
    if (hasTitleErr || hasTimeErr) return;
    onAdd();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="border-t border-gray-100 px-[13px] pt-[10px] pb-[11px]">
      {/* Input row */}
      <div className="flex gap-[7px] flex-wrap items-start">
        {/* Task title */}
        <div className="flex flex-col flex-1 min-w-[130px]">
          <div className="flex items-center gap-1 mb-[3px]">
            <span className="text-[0.67rem] font-semibold text-gray-400 uppercase tracking-[0.4px]">
              Task Name
            </span>
            <span className="text-red-500 text-[0.67rem] font-bold">*</span>
          </div>
          <input
            className={cn(INPUT_CLS, titleError && "border-red-400 focus:border-red-400")}
            placeholder="Add a one-off task..."
            value={title}
            onChange={(e) => {
              setTitleError(false);
              setTitle(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          {titleError && (
            <span className="text-[0.65rem] text-red-500 mt-[2px]">Required</span>
          )}
        </div>

        {/* Time in minutes */}
        <div className="flex flex-col w-20 shrink-0">
          <div className="flex items-center gap-1 mb-[3px]">
            <span className="text-[0.67rem] font-semibold text-gray-400 uppercase tracking-[0.4px]">
              Min
            </span>
            <span className="text-red-500 text-[0.67rem] font-bold">*</span>
          </div>
          <input
            type="number"
            className={cn(TIME_CLS, timeError && "border-red-400 focus:border-red-400")}
            placeholder="30"
            min={1}
            value={time}
            onChange={(e) => {
              setTimeError(false);
              setTime(e.target.value);
            }}
          />
          {timeError && (
            <span className="text-[0.65rem] text-red-500 mt-[2px]">Required</span>
          )}
        </div>

        {/* Submit button — aligned to input row */}
        <div className="flex flex-col">
          <div className="mb-[3px] invisible text-[0.67rem]">x</div>
          <button
            className="bg-blue-600 text-white border-none rounded-[7px] px-[14px] py-[6px] font-[inherit] text-[0.82rem] font-semibold cursor-pointer whitespace-nowrap hover:bg-blue-700 transition-all"
            onClick={handleAdd}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
