"use client";

/**
 * HabitsTab
 * ----------
 * Layout wrapper for the "Recurring Habits" tab.
 *
 * Renders:
 *  1. HabitForm  — create a new recurring habit
 *  2. HabitList  — table of all existing habits with inline edit + delete
 *
 * Props:
 *  - habitForm       object    — controlled form state for HabitForm
 *  - setHabitForm    function  — form state setter
 *  - onAddHabit      function  — handler called when form is submitted
 *  - onCancel        function  — navigates away from the habits tab
 *  - state           object    — full tracker state (for HabitList)
 *  - onUpdateHabit   function  — (updatedHabit) → saves edit
 *  - onDeleteHabit   function  — (habitId) → removes habit
 */

import HabitForm from "./HabitForm";
import HabitList from "./HabitList";

export default function HabitsTab({
  habitForm,
  setHabitForm,
  onAddHabit,
  onCancel,
  state,
  onUpdateHabit,
  onDeleteHabit,
}) {
  return (
    <div>
      <HabitForm
        habitForm={habitForm}
        setHabitForm={setHabitForm}
        onAddHabit={onAddHabit}
        onCancel={onCancel}
      />
      <HabitList
        state={state}
        onUpdateHabit={onUpdateHabit}
        onDeleteHabit={onDeleteHabit}
      />
    </div>
  );
}
