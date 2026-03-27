"use client";

/**
 * TaskList
 * --------
 * The main task panel for a selected day.
 *
 * Shows three sections in order:
 *  1. Recurring Habits section — habits that apply on this day
 *  2. Daily Tasks section — one-off tasks for this day
 *  3. AddTaskForm — input row to add a new one-off task
 *
 * Also displays a header with the date label and a progress summary pill.
 */

import { cn } from "@/lib/utils";
import {
  getTodayStr,
  formatMinutes,
  habitAppliesOnDate,
  formatHabitRecurrence,
} from "@/lib/studyTrackerStorage";
import { CHECK_SVG } from "./_constants";
import AddTaskForm from "./AddTaskForm";

export default function TaskList({
  state,
  selectedDate,
  onToggleHabit,
  onToggleTask,
  onDeleteTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskTime,
  setNewTaskTime,
  onAddTask,
}) {
  const today = getTodayStr();

  // ── Derived data for the selected date ──────────────────────────────────────

  const tasksForSelectedDate = state.daily[selectedDate] || [];
  const habitsForSelectedDate = state.habits.filter((h) =>
    habitAppliesOnDate(h, selectedDate),
  );

  const completedTaskCount = tasksForSelectedDate.filter((t) => t.done).length;
  const completedHabitCount = habitsForSelectedDate.filter(
    (h) => state.habitLog[selectedDate]?.[h.id],
  ).length;

  const totalMinutes =
    tasksForSelectedDate.reduce((sum, t) => sum + (t.timeMin || 0), 0) +
    habitsForSelectedDate.reduce((sum, h) => sum + (h.timeMin || 0), 0);

  const completedMinutes =
    tasksForSelectedDate
      .filter((t) => t.done)
      .reduce((sum, t) => sum + (t.timeMin || 0), 0) +
    habitsForSelectedDate
      .filter((h) => state.habitLog[selectedDate]?.[h.id])
      .reduce((sum, h) => sum + (h.timeMin || 0), 0);

  const totalItemCount = tasksForSelectedDate.length + habitsForSelectedDate.length;
  const totalDoneCount = completedTaskCount + completedHabitCount;

  /** Short progress string shown in the header pill */
  const summaryText = totalItemCount
    ? `${totalDoneCount}/${totalItemCount} done · ${formatMinutes(completedMinutes)}/${formatMinutes(totalMinutes)}`
    : "No tasks";

  /** Human-readable date label for the panel header */
  const buildDateLabel = () => {
    const d = new Date(selectedDate + "T00:00:00");
    const formatted = d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return selectedDate === today ? "Today — " + formatted : formatted;
  };

  return (
    <div className="bg-white border border-[#e9eaed] rounded-xl overflow-hidden">
      {/* Panel header: date label + summary pill */}
      <div className="flex justify-between items-center px-4 py-[13px] border-b border-gray-100 flex-wrap gap-[7px]">
        <span className="text-[0.83rem] font-semibold text-[#374151]">
          {buildDateLabel()}
        </span>
        <span className="text-[0.72rem] font-medium text-gray-500 bg-gray-100 px-[9px] py-[2px] rounded-full whitespace-nowrap">
          {summaryText}
        </span>
      </div>

      {/* Scrollable list area */}
      <div className="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">

        {/* ── Recurring Habits section ── */}
        {habitsForSelectedDate.length > 0 && (
          <>
            <div className="text-[0.7rem] font-bold uppercase tracking-[0.7px] text-purple-700 px-[14px] pt-[7px] pb-1 bg-[#f5f3ff] border-b border-purple-100 flex items-center gap-[5px]">
              🔄 Recurring Habits
              <span className="ml-auto text-[0.67rem] font-bold font-mono">
                {completedHabitCount}/{habitsForSelectedDate.length}
              </span>
            </div>

            {habitsForSelectedDate.map((habit) => {
              const isDone = !!state.habitLog[selectedDate]?.[habit.id];
              return (
                <div
                  key={habit.id}
                  className={cn(
                    "flex items-center gap-[9px] px-[14px] py-[10px] border-b border-gray-100 last:border-b-0 transition-all",
                    isDone ? "bg-green-50" : "bg-[#faf5ff] hover:bg-[#f3eeff]",
                  )}
                >
                  {/* Toggle checkbox */}
                  <div
                    className={cn(
                      "w-[18px] h-[18px] border-2 rounded-[4px] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer",
                      isDone ? "bg-purple-700 border-purple-700" : "border-purple-300",
                    )}
                    onClick={() => onToggleHabit(habit.id)}
                  >
                    {isDone && CHECK_SVG}
                  </div>

                  {/* Title */}
                  <span
                    className={cn(
                      "flex-1 text-[0.84rem] font-medium text-[#1f2937]",
                      isDone && "line-through text-gray-400",
                    )}
                  >
                    {habit.title}
                  </span>

                  {/* Time badge */}
                  {habit.timeMin > 0 && (
                    <span className="text-[0.69rem] font-semibold bg-amber-50 text-amber-600 px-[7px] py-[2px] rounded-full whitespace-nowrap font-mono">
                      {formatMinutes(habit.timeMin)}
                    </span>
                  )}

                  {/* Recurrence badge */}
                  <span className="text-[0.65rem] font-semibold bg-[#ede9fe] text-purple-700 px-[6px] py-[2px] rounded-full whitespace-nowrap flex-shrink-0">
                    {formatHabitRecurrence(habit)}
                  </span>
                </div>
              );
            })}
          </>
        )}

        {/* ── Daily Tasks section header ── */}
        {(tasksForSelectedDate.length > 0 || habitsForSelectedDate.length > 0) && (
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.7px] text-gray-400 px-[14px] pt-[7px] pb-1 bg-[#f8f9fc] border-b border-[#f0f1f4] flex items-center gap-[5px]">
            📋 Daily Tasks
            <span className="ml-auto text-[0.67rem] font-bold font-mono">
              {completedTaskCount}/{tasksForSelectedDate.length}
            </span>
          </div>
        )}

        {/* Empty state */}
        {tasksForSelectedDate.length === 0 && (
          <div className="py-[12px] px-4 text-center text-gray-400 text-[0.83rem]">
            {habitsForSelectedDate.length
              ? "No one-off tasks. Add one below."
              : "No tasks or habits for this day."}
          </div>
        )}

        {/* ── Task rows ── */}
        {tasksForSelectedDate.map((task, index) => (
          <div
            key={task.id || index}
            className={cn(
              "flex items-center gap-[9px] px-[14px] py-[10px] border-b border-gray-100 last:border-b-0 hover:bg-[#fafafa] transition-all",
              task.done && "bg-green-50",
            )}
          >
            {/* Toggle checkbox */}
            <div
              className={cn(
                "w-[18px] h-[18px] border-2 border-gray-300 rounded-[4px] flex items-center justify-center transition-all flex-shrink-0 cursor-pointer",
                task.done && "bg-green-500 border-green-500",
              )}
              onClick={() => onToggleTask(index)}
            >
              {task.done && CHECK_SVG}
            </div>

            {/* Title */}
            <span
              className={cn(
                "flex-1 text-[0.84rem] font-medium text-[#1f2937]",
                task.done && "line-through text-gray-400",
              )}
            >
              {task.title}
            </span>

            {/* Time badge */}
            {task.timeMin > 0 && (
              <span className="text-[0.69rem] font-semibold bg-amber-50 text-amber-600 px-[7px] py-[2px] rounded-full whitespace-nowrap font-mono">
                {formatMinutes(task.timeMin)}
              </span>
            )}

            {/* Delete button */}
            <button
              className="bg-transparent border-none cursor-pointer text-gray-300 text-base leading-none px-[2px] hover:text-red-500 transition-all flex-shrink-0"
              onClick={() => onDeleteTask(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add task input row */}
      <AddTaskForm
        title={newTaskTitle}
        time={newTaskTime}
        setTitle={setNewTaskTitle}
        setTime={setNewTaskTime}
        onAdd={onAddTask}
      />
    </div>
  );
}
