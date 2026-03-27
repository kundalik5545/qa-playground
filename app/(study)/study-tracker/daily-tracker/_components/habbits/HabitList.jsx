"use client";

/**
 * HabitList
 * ----------
 * Table of all recurring habits with inline edit and delete.
 *
 * Props:
 *  - state           object    — tracker state (habits array)
 *  - onUpdateHabit   function  — (updatedHabit) → persists to localStorage + DB
 *  - onDeleteHabit   function  — (habitId) → removes from localStorage + DB
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import TimeSlotPicker, { buildTimeSlot, computeToTime, parseTimeSlot } from "../TimeSlotPicker";

const CELL_INPUT =
  "w-full border border-[#e9eaed] rounded-[6px] px-2 py-[5px] font-[inherit] text-[0.8rem] text-[#374151] outline-none focus:border-blue-500 transition-colors bg-white";

export default function HabitList({ state, onUpdateHabit, onDeleteHabit }) {
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const habits = state.habits || [];

  function startEdit(habit) {
    // parseTimeSlot only returns from* — To is always re-derived from From + timeMin
    const { fromHour, fromMin, fromPeriod } = parseTimeSlot(habit.timeSlot ?? "");
    setEditId(habit.id);
    setEditValues({
      title: habit.title,
      timeMin: habit.timeMin ?? "",
      startDate: habit.startDate ?? "",
      endDate: habit.endDate ?? "",
      fromHour,
      fromMin,
      fromPeriod,
    });
    setEditErrors({});
  }

  function cancelEdit() {
    setEditId(null);
    setEditValues({});
    setEditErrors({});
  }

  function saveEdit(habit) {
    const errors = {};
    if (!editValues.title.trim()) errors.title = true;
    if (!editValues.timeMin || Number(editValues.timeMin) <= 0) errors.timeMin = true;
    if (Object.keys(errors).length) {
      setEditErrors(errors);
      return;
    }

    // Build timeSlot: auto-compute To from From + timeMin
    const timeSlot = buildTimeSlot(
      editValues.fromHour,
      editValues.fromMin,
      editValues.fromPeriod,
      parseInt(editValues.timeMin),
    );

    onUpdateHabit({
      ...habit,
      title:     editValues.title.trim(),
      timeMin:   parseInt(editValues.timeMin),
      timeSlot:  timeSlot || null,
      startDate: editValues.startDate || habit.startDate,
      endDate:   editValues.endDate || null,
    });
    cancelEdit();
  }

  if (habits.length === 0) {
    return (
      <div className="bg-white border border-[#e9eaed] rounded-[14px] p-5 mt-4">
        <h3 className="text-sm font-semibold text-[#374151] mb-3">All Recurring Habits</h3>
        <p className="text-sm text-gray-400 text-center py-6">
          No habits yet. Create one using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e9eaed] rounded-[14px] p-5 mt-4">
      <h3 className="text-sm font-semibold text-[#374151] mb-3">
        All Recurring Habits
        <span className="ml-2 text-xs font-normal text-gray-400">
          ({habits.length} total)
        </span>
      </h3>

      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        <table className="w-full border-collapse min-w-[540px]">
          <thead>
            <tr className="border-b border-[#e9eaed]">
              <th className="text-left pb-2 px-2 text-[0.7rem] font-semibold text-gray-400 uppercase tracking-[0.5px] min-w-[140px]">
                Name
              </th>
              <th className="text-left pb-2 px-2 text-[0.7rem] font-semibold text-gray-400 uppercase tracking-[0.5px] min-w-[130px]">
                Time Slot
              </th>
              <th className="text-center pb-2 px-2 text-[0.7rem] font-semibold text-gray-400 uppercase tracking-[0.5px] w-20">
                Min
              </th>
              <th className="text-left pb-2 px-2 text-[0.7rem] font-semibold text-gray-400 uppercase tracking-[0.5px] min-w-[170px]">
                Period
              </th>
              <th className="text-right pb-2 px-2 text-[0.7rem] font-semibold text-gray-400 uppercase tracking-[0.5px] w-28">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {habits.map((habit) => {
              const isEditing = editId === habit.id;

              if (isEditing) {
                return (
                  <tr key={habit.id} className="border-b border-gray-100 bg-blue-50/40">
                    {/* Name edit */}
                    <td className="px-2 py-2 align-top">
                      <input
                        className={cn(CELL_INPUT, editErrors.title && "border-red-400")}
                        value={editValues.title}
                        onChange={(e) => {
                          setEditErrors((prev) => ({ ...prev, title: false }));
                          setEditValues((v) => ({ ...v, title: e.target.value }));
                        }}
                        placeholder="Habit name *"
                        autoFocus
                      />
                      {editErrors.title && (
                        <span className="text-[0.63rem] text-red-500">Required</span>
                      )}
                    </td>

                    {/* Time Slot edit — From only; To is auto-computed */}
                    <td className="px-2 py-2 align-top">
                      {(() => {
                        const toData = computeToTime(
                          editValues.fromHour,
                          editValues.fromMin,
                          editValues.fromPeriod,
                          parseInt(editValues.timeMin),
                        );
                        return (
                          <TimeSlotPicker
                            fromHour={editValues.fromHour}
                            fromMin={editValues.fromMin}
                            fromPeriod={editValues.fromPeriod}
                            computedTo={toData?.str ?? ""}
                            disabled={!editValues.timeMin || Number(editValues.timeMin) <= 0}
                            onChange={(parts) =>
                              setEditValues((v) => ({ ...v, ...parts }))
                            }
                          />
                        );
                      })()}
                    </td>

                    {/* Time Min edit */}
                    <td className="px-2 py-2 align-top">
                      <input
                        type="number"
                        min={1}
                        className={cn(
                          CELL_INPUT,
                          "text-center",
                          editErrors.timeMin && "border-red-400",
                        )}
                        value={editValues.timeMin}
                        onChange={(e) => {
                          setEditErrors((prev) => ({ ...prev, timeMin: false }));
                          setEditValues((v) => ({ ...v, timeMin: e.target.value }));
                        }}
                        placeholder="30"
                      />
                      {editErrors.timeMin && (
                        <span className="text-[0.63rem] text-red-500">Required</span>
                      )}
                    </td>

                    {/* Period edit */}
                    <td className="px-2 py-2 align-top">
                      <div className="flex items-center gap-1">
                        <input
                          type="date"
                          className={cn(CELL_INPUT, "flex-1 min-w-0")}
                          value={editValues.startDate}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, startDate: e.target.value }))
                          }
                        />
                        <span className="text-gray-300 text-xs shrink-0">→</span>
                        <input
                          type="date"
                          className={cn(CELL_INPUT, "flex-1 min-w-0")}
                          value={editValues.endDate}
                          onChange={(e) =>
                            setEditValues((v) => ({ ...v, endDate: e.target.value }))
                          }
                        />
                      </div>
                    </td>

                    {/* Save / Cancel */}
                    <td className="px-2 py-2 align-top text-right">
                      <div className="flex gap-1 justify-end">
                        <button
                          className="text-[0.72rem] px-2 py-1 bg-blue-600 text-white rounded cursor-pointer border-none font-[inherit] font-semibold hover:bg-blue-700 transition-all"
                          onClick={() => saveEdit(habit)}
                        >
                          Save
                        </button>
                        <button
                          className="text-[0.72rem] px-2 py-1 border border-gray-200 text-gray-500 rounded cursor-pointer font-[inherit] hover:bg-gray-50 transition-all"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }

              /* ── Read-only row ── */
              return (
                <tr
                  key={habit.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  {/* Name */}
                  <td className="px-2 py-[10px]">
                    <div className="text-[0.83rem] font-semibold text-[#1f2937] truncate max-w-[180px]">
                      {habit.title}
                    </div>
                    <div className="text-[0.67rem] text-purple-500 mt-[1px]">Daily</div>
                  </td>

                  {/* Time Slot */}
                  <td className="px-2 py-[10px]">
                    {habit.timeSlot ? (
                      <span className="text-[0.73rem] bg-purple-50 text-purple-700 px-2 py-[2px] rounded-full font-medium whitespace-nowrap">
                        {habit.timeSlot}
                      </span>
                    ) : (
                      <span className="text-[0.75rem] text-gray-300">—</span>
                    )}
                  </td>

                  {/* Time Min */}
                  <td className="px-2 py-[10px] text-center">
                    <span className="text-[0.78rem] font-mono font-semibold text-amber-600 bg-amber-50 px-2 py-[2px] rounded-full">
                      {habit.timeMin ?? 0}m
                    </span>
                  </td>

                  {/* Period */}
                  <td className="px-2 py-[10px]">
                    <span className="text-[0.75rem] text-gray-500">
                      {habit.startDate || "—"}
                      {habit.endDate ? ` → ${habit.endDate}` : ""}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-2 py-[10px] text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        className="text-[0.72rem] px-2 py-[4px] border border-blue-200 text-blue-600 rounded cursor-pointer font-[inherit] hover:bg-blue-50 transition-all"
                        onClick={() => startEdit(habit)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-[0.72rem] px-2 py-[4px] border border-red-200 text-red-500 rounded cursor-pointer font-[inherit] hover:bg-red-50 transition-all"
                        onClick={() => {
                          if (window.confirm(`Delete habit "${habit.title}"?`))
                            onDeleteHabit(habit.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
