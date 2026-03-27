"use client";

/**
 * HabitsTab
 * ----------
 * Layout wrapper for the "Recurring Habits" tab.
 *
 * Renders three sections top-to-bottom:
 *  1. HabitForm   — create a new habit
 *  2. HabitList   — all existing habits with progress bars
 *  3. HabitMatrix — interactive grid for toggling completions by date
 *
 * Props:
 *  - state         object    — full tracker state
 *  - updateState   function  — persists state changes
 *  - habitForm     object    — controlled form state for HabitForm
 *  - setHabitForm  function  — form state setter
 *  - onAddHabit    function  — handler called when form is submitted
 *  - onDeleteHabit function  — handler called with habit index to remove
 */

import HabitForm from "./HabitForm";
import HabitList from "./HabitList";
import HabitMatrix from "./HabitMatrix";

export default function HabitsTab({
  state,
  updateState,
  habitForm,
  setHabitForm,
  onAddHabit,
  onDeleteHabit,
}) {
  return (
    <div>
      {/* Top row: form + list side by side on xl screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px] mb-[18px] items-start">
        <HabitForm
          habitForm={habitForm}
          setHabitForm={setHabitForm}
          onAddHabit={onAddHabit}
        />
        <HabitList
          habits={state.habits}
          habitLog={state.habitLog}
          onDeleteHabit={onDeleteHabit}
        />
      </div>

      {/* Full-width habit tracker matrix below */}
      <HabitMatrix state={state} updateState={updateState} />
    </div>
  );
}
