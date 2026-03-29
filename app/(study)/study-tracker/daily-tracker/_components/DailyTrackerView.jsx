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
import { buildTimeSlot } from "./TimeSlotPicker";
import { useTracker } from "@/app/(study)/study-tracker/_components/StudyTrackerProvider";

import { LIGHT_MODE_STYLE } from "./_constants";
import DateNavigator from "./DateNavigator";
import TaskList from "./TaskList";
import AnalyticsPanel from "./analytics/AnalyticsPanel";
import HabitsTab from "./habbits/HabitsTab";
import { Import } from "lucide-react";
import { ArrowBigUp } from "lucide-react";
import { ArrowBigDown } from "lucide-react";
import { Trash2 } from "lucide-react";

export default function DailyTrackerView({ state, updateState, showToast }) {
  const { user } = useTracker();

  // ── UI state ───────────────────────────────────────────────────────────────
  const [view, setView] = useState("tasks");
  const [selectedDate, setSelectedDate] = useState(getTodayStr());

  // ── Add-task form state ────────────────────────────────────────────────────
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");

  // ── Add-habit form state ───────────────────────────────────────────────────
  const [habitForm, setHabitForm] = useState({
    title: "",
    time: "",
    duration: "1month",
    startDate: getTodayStr(),
    endDate: "",
    fromHour: "",
    fromMin: "00",
    fromPeriod: "AM",
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
  // formatTimeTo12h is no longer needed — formatTimeSlot from TimeSlotPicker handles it
  const toggleHabit = (habitId) => {
    const dayLog = { ...(state.habitLog[selectedDate] || {}) };
    dayLog[habitId] = !dayLog[habitId];
    updateState("habitLog", { ...state.habitLog, [selectedDate]: dayLog });
  };

  /** Create a new recurring habit from the form state */
  const addHabit = () => {
    if (!habitForm.title.trim()) return;

    // Resolve end date: custom string or computed from duration
    const endDate =
      habitForm.duration === "custom"
        ? habitForm.endDate || null
        : computeHabitEndDate(habitForm.startDate, habitForm.duration);

    // Derive timeSlot: auto-compute "To" from From + timeMin
    const timeSlot = buildTimeSlot(
      habitForm.fromHour,
      habitForm.fromMin,
      habitForm.fromPeriod,
      parseInt(habitForm.time),
    );

    const habit = {
      id: "h-" + Date.now(),
      title: habitForm.title.trim(),
      timeMin: parseInt(habitForm.time) || 0,
      recurrence: "daily",
      customDays: [],
      startDate: habitForm.startDate,
      endDate,
      timeSlot: timeSlot || null,
      active: true,
    };

    updateState("habits", [...state.habits, habit]);
    setHabitForm((f) => ({
      ...f,
      title: "",
      time: "",
      fromHour: "",
      fromMin: "00",
      fromPeriod: "AM",
    }));
    showToast(`Habit "${habit.title}" created!`);
  };

  /** Update an existing habit (localStorage + DB if logged in) */
  const updateHabit = (updatedHabit) => {
    updateState(
      "habits",
      state.habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
    );
    if (user) {
      fetch("/api/tracker/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habit: updatedHabit }),
      }).catch((err) => console.error("[tracker] update habit failed", err));
    }
    showToast(`Habit "${updatedHabit.title}" updated!`);
  };

  /** Remove a habit by its ID (localStorage + DB if logged in) */
  const deleteHabit = (habitId) => {
    updateState(
      "habits",
      state.habits.filter((h) => h.id !== habitId),
    );
    if (user) {
      fetch("/api/tracker/habits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId }),
      }).catch((err) => console.error("[tracker] delete habit failed", err));
    }
    showToast("Habit deleted");
  };

  // ── Clear all daily data ────────────────────────────────────────────────────

  const clearAllData = () => {
    if (
      !window.confirm(
        "This will permanently delete all your daily tasks, habits, and habit logs. Are you sure?",
      )
    )
      return;

    updateState("daily", {});
    updateState("habits", []);
    updateState("habitLog", {});

    if (user) {
      fetch("/api/tracker/clear", { method: "DELETE" }).catch((err) =>
        console.error("[tracker] clear daily data failed", err),
      );
    }

    showToast("All daily tracker data cleared");
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
    <div style={LIGHT_MODE_STYLE} className="w-full">
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
            <Button size="sm" variant="exportBtn" onClick={exportTasks}>
              <ArrowBigUp /> Export
            </Button>
            <Button size="sm" variant="importBtn" onClick={importTasks}>
              <ArrowBigDown /> Import
            </Button>
            <Button size="sm" variant="clearBtn" onClick={clearAllData}>
              <Trash2 />
              Clear Data
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
          <div className="flex flex-col gap-4">
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
            <AnalyticsPanel
              state={state}
              updateState={updateState}
              selectedDate={selectedDate}
            />
          </div>
        </TabsContent>

        {/* ── Habits tab ── */}
        <TabsContent value="habits" className="mt-4">
          <HabitsTab
            habitForm={habitForm}
            setHabitForm={setHabitForm}
            onAddHabit={addHabit}
            onCancel={() => setView("tasks")}
            state={state}
            onUpdateHabit={updateHabit}
            onDeleteHabit={deleteHabit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
