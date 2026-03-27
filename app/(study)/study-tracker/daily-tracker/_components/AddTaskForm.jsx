"use client";

/**
 * AddTaskForm
 * -----------
 * The input row at the bottom of the task panel.
 * Lets the user type a task title, optional time in minutes, and press
 * "+ Add" (or hit Enter) to append a one-off task to the selected day.
 */

const INPUT_CLS =
  "flex-1 min-w-[130px] border border-[#e9eaed] rounded-[7px] px-[10px] py-[6px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors";
const TIME_CLS =
  "w-16 border border-[#e9eaed] rounded-[7px] px-2 py-[6px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors";

export default function AddTaskForm({ title, time, setTitle, setTime, onAdd }) {
  /** Submit on Enter key inside the title field */
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") onAdd();
  };

  return (
    <div className="flex gap-[7px] px-[13px] py-[11px] border-t border-gray-100 flex-wrap">
      {/* Task title */}
      <input
        className={INPUT_CLS}
        placeholder="Add a one-off task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleTitleKeyDown}
      />

      {/* Estimated time in minutes */}
      <input
        type="number"
        className={TIME_CLS}
        placeholder="Min"
        min={1}
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      {/* Submit button */}
      <button
        className="bg-blue-600 text-white border-none rounded-[7px] px-[14px] py-[6px] font-[inherit] text-[0.82rem] font-semibold cursor-pointer whitespace-nowrap hover:bg-blue-700 transition-all"
        onClick={onAdd}
      >
        + Add
      </button>
    </div>
  );
}
