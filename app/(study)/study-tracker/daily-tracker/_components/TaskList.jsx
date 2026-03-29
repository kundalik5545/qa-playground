"use client";

/**
 * TaskList
 * --------
 * Two side-by-side cards:
 *  Left  → Daily Tasks  (AddTaskForm at top + task rows)
 *  Right → Recurring Habits (habit rows for the selected day)
 *
 * Single column on mobile/tablet → two columns from lg (1024px) upward.
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
import { parseTimeSlot } from "./TimeSlotPicker";

// ── small helpers ────────────────────────────────────────────────────────────

/** Convert a timeSlot string to minutes-since-midnight for sorting. No slot → Infinity (goes last). */
function timeSlotToMin(timeSlot) {
  if (!timeSlot) return Infinity;
  const { fromHour, fromMin, fromPeriod } = parseTimeSlot(timeSlot);
  if (!fromHour) return Infinity;
  let h = parseInt(fromHour);
  const m = parseInt(fromMin || "0");
  if (fromPeriod === "PM" && h !== 12) h += 12;
  if (fromPeriod === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function ProgressBar({ done, total, color = "#2563eb" }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="w-full h-1 bg-[#f0f1f4] rounded-full overflow-hidden mt-2">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: pct + "%", background: color }}
      />
    </div>
  );
}

function EmptyState({ icon, message, sub }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <span className="text-3xl mb-2 opacity-40">{icon}</span>
      <p className="text-[0.84rem] font-medium text-gray-400 mb-1">{message}</p>
      {sub && <p className="text-[0.75rem] text-gray-300">{sub}</p>}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

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

  const tasks = state.daily[selectedDate] || [];
  const habits = state.habits
    .filter((h) => habitAppliesOnDate(h, selectedDate))
    .sort((a, b) => timeSlotToMin(a.timeSlot) - timeSlotToMin(b.timeSlot));

  const completedTasks = tasks.filter((t) => t.done).length;
  const completedHabits = habits.filter(
    (h) => state.habitLog[selectedDate]?.[h.id],
  ).length;

  const totalTaskMin = tasks.reduce((s, t) => s + (t.timeMin || 0), 0);
  const completedTaskMin = tasks
    .filter((t) => t.done)
    .reduce((s, t) => s + (t.timeMin || 0), 0);
  const totalHabitMin = habits.reduce((s, h) => s + (h.timeMin || 0), 0);
  const completedHabitMin = habits
    .filter((h) => state.habitLog[selectedDate]?.[h.id])
    .reduce((s, h) => s + (h.timeMin || 0), 0);

  const dateLabel = (() => {
    const d = new Date(selectedDate + "T00:00:00");
    const fmt = d.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return selectedDate === today ? "Today · " + fmt : fmt;
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ════════════════════════════════════════
          LEFT CARD — Daily Tasks
      ════════════════════════════════════════ */}
      <div className="bg-white border border-[#e9eaed] rounded-2xl overflow-hidden flex flex-col shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        {/* Card header */}
        <div className="px-5 pt-4 pb-3 border-b border-[#f0f1f4]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.6px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  📋 Tasks
                </span>
                {tasks.length > 0 && (
                  <span className="text-[0.68rem] font-semibold text-gray-400">
                    {completedTasks}/{tasks.length} done
                    {totalTaskMin > 0 &&
                      ` · ${formatMinutes(completedTaskMin)}/${formatMinutes(totalTaskMin)}`}
                  </span>
                )}
              </div>
              {/* <h2 className="text-[0.9rem] font-bold text-[#1a1d23] truncate m-0">
                {dateLabel}
              </h2> */}
            </div>

            {/* Completion badge */}
            {tasks.length > 0 && (
              <span
                className={cn(
                  "text-[0.72rem] font-bold px-2.5 py-1 rounded-full flex-shrink-0",
                  completedTasks === tasks.length
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500",
                )}
              >
                {tasks.length > 0
                  ? Math.round((completedTasks / tasks.length) * 100)
                  : 0}
                %
              </span>
            )}
          </div>

          {/* Progress bar */}
          {tasks.length > 0 && (
            <ProgressBar
              done={completedTasks}
              total={tasks.length}
              color="#2563eb"
            />
          )}
        </div>

        {/* Add task input — pinned below header */}
        <div className="border-b border-[#f0f1f4]">
          <AddTaskForm
            title={newTaskTitle}
            time={newTaskTime}
            setTitle={setNewTaskTitle}
            setTime={setNewTaskTime}
            onAdd={onAddTask}
          />
        </div>

        {/* Task list */}
        <div className="flex-1 min-h-[120px] max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {tasks.length === 0 ? (
            <EmptyState
              icon="✅"
              message="No tasks yet"
              sub="Type a task above and press Enter or + Add"
            />
          ) : (
            tasks.map((task, index) => (
              <TaskRow
                key={task.id || index}
                task={task}
                onToggle={() => onToggleTask(index)}
                onDelete={() => onDeleteTask(index)}
              />
            ))
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT CARD — Recurring Habits
      ════════════════════════════════════════ */}
      <div className="bg-white border border-[#e9eaed] rounded-2xl overflow-hidden flex flex-col shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        {/* Card header */}
        <div className="px-5 pt-4 pb-3 border-b border-[#f0f1f4]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.6px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  🔄 Habits
                </span>
                {habits.length > 0 && (
                  <span className="text-[0.68rem] font-semibold text-gray-400">
                    {completedHabits}/{habits.length} done
                    {totalHabitMin > 0 &&
                      ` · ${formatMinutes(completedHabitMin)}/${formatMinutes(totalHabitMin)}`}
                  </span>
                )}
              </div>
              {/* <h2 className="text-[0.9rem] font-bold text-[#1a1d23] m-0">
                Recurring Habits
              </h2> */}
            </div>

            {/* Completion badge */}
            {habits.length > 0 && (
              <span
                className={cn(
                  "text-[0.72rem] font-bold px-2.5 py-1 rounded-full flex-shrink-0",
                  completedHabits === habits.length
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-50 text-purple-600",
                )}
              >
                {habits.length > 0
                  ? Math.round((completedHabits / habits.length) * 100)
                  : 0}
                %
              </span>
            )}
          </div>

          {/* Progress bar */}
          {habits.length > 0 && (
            <ProgressBar
              done={completedHabits}
              total={habits.length}
              color="#7c3aed"
            />
          )}
        </div>

        {/* Habit list */}
        <div className="flex-1 min-h-[120px] max-h-[460px] overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-purple-100 [&::-webkit-scrollbar-thumb]:rounded-full">
          {habits.length === 0 ? (
            <EmptyState
              icon="🔄"
              message="No habits scheduled today"
              sub="Add recurring habits from the Recurring Habits tab"
            />
          ) : (
            habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                isDone={!!state.habitLog[selectedDate]?.[habit.id]}
                onToggle={() => onToggleHabit(habit.id)}
              />
            ))
          )}
        </div>

        {/* Bottom hint */}
        {habits.length > 0 && (
          <div className="px-5 py-2.5 border-t border-[#f0f1f4] bg-[#faf8ff]">
            <p className="text-[0.71rem] text-purple-400 m-0">
              Manage habits in the{" "}
              <span className="font-semibold text-purple-600">
                🔄 Recurring Habits
              </span>{" "}
              tab.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Task row ─────────────────────────────────────────────────────────────────

function TaskRow({ task, onToggle, onDelete }) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-5 py-3 border-b border-[#f5f6f8] last:border-b-0 transition-colors",
        task.done ? "bg-[#f9fafb]" : "hover:bg-[#fafbff]",
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          "w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer bg-transparent",
          task.done
            ? "bg-green-500 border-green-500"
            : "border-gray-300 hover:border-blue-400",
        )}
      >
        {task.done && CHECK_SVG}
      </button>

      {/* Title */}
      <span
        className={cn(
          "flex-1 text-[0.84rem] font-medium leading-snug",
          task.done ? "line-through text-gray-350" : "text-[#1f2937]",
        )}
        style={{ color: task.done ? "#b0b7c3" : undefined }}
      >
        {task.title}
      </span>

      {/* Time badge */}
      {task.timeMin > 0 && (
        <span className="text-[0.68rem] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-mono whitespace-nowrap flex-shrink-0">
          {formatMinutes(task.timeMin)}
        </span>
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 bg-transparent border-none cursor-pointer transition-all flex-shrink-0 text-base leading-none"
      >
        ×
      </button>
    </div>
  );
}

// ── Habit row ─────────────────────────────────────────────────────────────────

function HabitRow({ habit, isDone, onToggle }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-5 py-3 border-b border-[#f5f6f8] last:border-b-0 transition-colors",
        isDone ? "bg-[#f9fafb]" : "hover:bg-[#fdf8ff]",
      )}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={cn(
          "w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer bg-transparent",
          isDone
            ? "bg-purple-600 border-purple-600"
            : "border-purple-200 hover:border-purple-400",
        )}
      >
        {isDone && CHECK_SVG}
      </button>

      {/* Title */}
      <span
        className={cn(
          "flex-1 text-[0.84rem] font-medium leading-snug",
          isDone ? "line-through" : "text-[#1f2937]",
        )}
        style={{ color: isDone ? "#b0b7c3" : undefined }}
      >
        {habit.title}
      </span>

      {/* Time badge */}
      {habit.timeMin > 0 && (
        <span className="text-[0.68rem] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-mono whitespace-nowrap flex-shrink-0">
          {formatMinutes(habit.timeMin)}
        </span>
      )}

      {/* Recurrence badge */}
      <span className="text-[0.64rem] font-semibold bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
        {formatHabitRecurrence(habit)}
      </span>
    </div>
  );
}
