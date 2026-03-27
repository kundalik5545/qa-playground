"use client";

/**
 * DailyTrackerView
 * -----------------
 * Root orchestrator for the Daily Progress Tracker page.
 *
 * Owns top-level state:
 *  - selectedDate   — which day the task panel is focused on
 *  - view           — active tab ("tasks" | "habits")
 *  - filterMode     — analytics period ("weekly" | "monthly")
 *  - newTask*       — controlled inputs for the add-task form
 *  - habitForm      — controlled inputs for the add-habit form
 *
 * Owns business-logic handlers:
 *  - addTask / toggleTask / deleteTask
 *  - addHabit / deleteHabit / toggleHabit  (passed down to HabitsTab)
 *  - exportTasks / importTasks
 *
 * Renders:
 *  - Page header (title + export/import buttons)
 *  - Tabs: "📋 Daily Tasks" | "🔄 Recurring Habits"
 *    - Tasks tab  → DateNavigator + TaskList (left) + AnalyticsPanel (right)
 *    - Habits tab → HabitsTab (HabitForm + HabitList + HabitMatrix)
 *
 * Props:
 *  - state        object    — tracker state from studyTrackerStorage
 *  - updateState  function  — persists a single key change
 *  - showToast    function  — displays a toast notification
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  getTodayStr,
  downloadJSON,
  pickJSONFile,
  computeHabitEndDate,
} from "@/lib/studyTrackerStorage";

import { LIGHT_MODE_STYLE } from "./_constants";
import DateNavigator from "./DateNavigator";
import TaskList from "./TaskList";
import AnalyticsPanel from "./analytics/AnalyticsPanel";
import HabitsTab from "./habbits/HabitsTab";

export default function DailyTrackerView({ state, updateState, showToast }) {
  // ── UI state ───────────────────────────────────────────────────────────────
  const [view, setView] = useState("tasks");
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [filterMode, setFilterMode] = useState("weekly");

  // ── Add-task form state ────────────────────────────────────────────────────
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");

  // ── Add-habit form state ───────────────────────────────────────────────────
  const [habitForm, setHabitForm] = useState({
    title: "",
    time: "",
    recurrence: "daily",
    customDays: [],
    duration: "1month",
    startDate: getTodayStr(),
    endDate: "",
  });

  // ── Task handlers ──────────────────────────────────────────────────────────

  /** Append a new one-off task to the selected date */
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      timeMin: parseInt(newTaskTime) || 0,
      done: false,
    };
    const existing = state.daily[selectedDate] || [];
    updateState("daily", {
      ...state.daily,
      [selectedDate]: [...existing, task],
    });
    setNewTaskTitle("");
    setNewTaskTime("");
  };

  /** Toggle the done state of a task by its list index */
  const toggleTask = (index) => {
    const tasks = (state.daily[selectedDate] || []).map((t, i) =>
      i === index ? { ...t, done: !t.done } : t,
    );
    updateState("daily", { ...state.daily, [selectedDate]: tasks });
  };

  /** Remove a task by its list index */
  const deleteTask = (index) => {
    const tasks = (state.daily[selectedDate] || []).filter(
      (_, i) => i !== index,
    );
    updateState("daily", { ...state.daily, [selectedDate]: tasks });
  };

  // ── Habit handlers ─────────────────────────────────────────────────────────

  /** Toggle a recurring habit's done state for the selected date */
  const toggleHabit = (habitId) => {
    const dayLog = { ...(state.habitLog[selectedDate] || {}) };
    dayLog[habitId] = !dayLog[habitId];
    updateState("habitLog", { ...state.habitLog, [selectedDate]: dayLog });
  };

  /** Create a new recurring habit from the form state */
  const addHabit = () => {
    if (!habitForm.title.trim()) return;
    if (habitForm.recurrence === "custom" && !habitForm.customDays.length) {
      showToast("Select at least one day", true);
      return;
    }

    // Resolve the end date: null = indefinite, custom string, or computed
    let endDate;
    if (habitForm.duration === "indefinite") {
      endDate = null;
    } else if (habitForm.duration === "custom") {
      endDate = habitForm.endDate || null;
    } else {
      endDate = computeHabitEndDate(habitForm.startDate, habitForm.duration);
    }

    const habit = {
      id: "h-" + Date.now(),
      title: habitForm.title.trim(),
      timeMin: parseInt(habitForm.time) || 0,
      recurrence: habitForm.recurrence,
      customDays: [...habitForm.customDays],
      startDate: habitForm.startDate,
      endDate,
      active: true,
    };

    updateState("habits", [...state.habits, habit]);
    setHabitForm((f) => ({ ...f, title: "", time: "" }));
    showToast(`Habit "${habit.title}" created!`);
  };

  /** Remove a habit by its list index */
  const deleteHabit = (index) => {
    updateState(
      "habits",
      state.habits.filter((_, i) => i !== index),
    );
  };

  // ── Import / Export ────────────────────────────────────────────────────────

  const exportTasks = () => {
    downloadJSON(
      {
        version: 1,
        type: "qa-tracker-tasks",
        exportedAt: new Date().toISOString(),
        data: {
          daily: state.daily,
          habits: state.habits,
          habitLog: state.habitLog,
        },
      },
      `qa-tasks-${getTodayStr()}.json`,
    );
    showToast("Tasks exported!");
  };

  const importTasks = () => {
    pickJSONFile((data) => {
      if (data.type !== "qa-tracker-tasks") {
        showToast("Not a tasks export file", true);
        return;
      }
      const d = data.data || {};
      if (d.daily) updateState("daily", d.daily);
      if (d.habits) updateState("habits", d.habits);
      if (d.habitLog) updateState("habitLog", d.habitLog);
      showToast("Tasks imported!");
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    // Force light mode regardless of the site-wide dark/light theme
    <div style={LIGHT_MODE_STYLE}>
      {/* Page header */}
      <div className="mb-[22px]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-[1.75rem] font-bold tracking-[-0.7px] text-[#111827] m-0">
              Daily Progress Tracker
            </h1>
            <p className="text-gray-500 text-[0.9rem] mt-1 mb-0">
              Daily tasks &amp; recurring habits with time tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={exportTasks}
            >
              ⬇ Export Tasks
            </Button>
            <Button size="sm" variant="outline" onClick={importTasks}>
              ⬆ Import Tasks
            </Button>
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <Tabs value={view} onValueChange={setView} className="mb-4">
        <TabsList>
          <TabsTrigger value="tasks">📋 Daily Tasks</TabsTrigger>
          <TabsTrigger value="habits">🔄 Recurring Habits</TabsTrigger>
        </TabsList>

        {/* ── Tasks tab ── */}
        <TabsContent value="tasks" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[18px] items-start">
            {/* Left column: date strip + task panel */}
            <div>
              <DateNavigator
                state={state}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              <TaskList
                state={state}
                selectedDate={selectedDate}
                onToggleHabit={toggleHabit}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                newTaskTime={newTaskTime}
                setNewTaskTime={setNewTaskTime}
                onAddTask={addTask}
              />
            </div>

            {/* Right column: analytics charts */}
            <AnalyticsPanel
              state={state}
              selectedDate={selectedDate}
              filterMode={filterMode}
              setFilterMode={setFilterMode}
            />
          </div>
        </TabsContent>

        {/* ── Habits tab ── */}
        <TabsContent value="habits" className="mt-4">
          <HabitsTab
            state={state}
            updateState={updateState}
            habitForm={habitForm}
            setHabitForm={setHabitForm}
            onAddHabit={addHabit}
            onDeleteHabit={deleteHabit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
