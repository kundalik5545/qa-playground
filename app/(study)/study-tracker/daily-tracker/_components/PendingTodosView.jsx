"use client";

/**
 * PendingTodosView
 * ----------------
 * Table of all incomplete todos across all dates.
 *
 * Features:
 *  - Date filter (All, Today, Yesterday, This Week, Older)
 *  - Title text search
 *  - Inline editable "Reason" field (optional)
 *  - Checkbox to mark a todo as done
 *  - Sorted today → yesterday → older
 *
 * Props:
 *  - state        object    — tracker state (state.daily)
 *  - updateState  function  — persists a key change to localStorage + DB
 *  - showToast    function  — displays a toast notification
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getTodayStr } from "@/lib/studyTrackerStorage";
import { useTracker } from "@/app/(study)/study-tracker/_components/StudyTrackerProvider";
import { X } from "lucide-react";

const CHECK_SVG = (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path
      d="M1 4L3.5 6.5L9 1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DATE_FILTER_OPTIONS = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This Week" },
  { value: "older", label: "Older" },
];

function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function getWeekAgoStr() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(dateStr, today, yesterday) {
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PendingTodosView({ state, updateState, showToast }) {
  const { user } = useTracker();
  const [dateFilter, setDateFilter] = useState("all");
  const [titleFilter, setTitleFilter] = useState("");
  const [editingReason, setEditingReason] = useState(null); // { date, taskId }
  const [reasonDraft, setReasonDraft] = useState("");

  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  const weekAgo = getWeekAgoStr();

  // ── Build flat list of all pending (undone) tasks ──────────────────────────
  const allPending = [];
  for (const [date, tasks] of Object.entries(state.daily || {})) {
    if (!Array.isArray(tasks)) continue;
    for (const task of tasks) {
      if (!task.done) {
        allPending.push({ date, task });
      }
    }
  }

  // Sort: today first, then descending by date
  allPending.sort((a, b) => {
    if (a.date === b.date) return 0;
    return a.date > b.date ? -1 : 1;
  });

  // ── Apply filters ─────────────────────────────────────────────────────────
  const filtered = allPending.filter(({ date, task }) => {
    if (dateFilter === "today" && date !== today) return false;
    if (dateFilter === "yesterday" && date !== yesterday) return false;
    if (dateFilter === "week" && (date < weekAgo || date > today)) return false;
    if (dateFilter === "older" && date >= weekAgo) return false;
    if (
      titleFilter.trim() &&
      !task.title.toLowerCase().includes(titleFilter.trim().toLowerCase())
    )
      return false;
    return true;
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const markDone = (date, taskId) => {
    const tasks = (state.daily[date] || []).map((t) =>
      String(t.id) === String(taskId) ? { ...t, done: true } : t,
    );
    updateState("daily", { ...state.daily, [date]: tasks });
    showToast("Task marked as done!");
  };

  const startEditReason = (date, taskId, currentReason) => {
    setEditingReason({ date, taskId: String(taskId) });
    setReasonDraft(currentReason || "");
  };

  const saveReason = (date, taskId, reason) => {
    const trimmed = reason.trim();
    const tasks = (state.daily[date] || []).map((t) =>
      String(t.id) === String(taskId)
        ? { ...t, ...(trimmed ? { reason: trimmed } : { reason: undefined }) }
        : t,
    );
    updateState("daily", { ...state.daily, [date]: tasks });
    setEditingReason(null);
    setReasonDraft("");
  };

  const cancelEditReason = () => {
    setEditingReason(null);
    setReasonDraft("");
  };

  const deleteTask = (date, taskId) => {
    const tasks = (state.daily[date] || []).filter(
      (t) => String(t.id) !== String(taskId),
    );
    updateState("daily", { ...state.daily, [date]: tasks });
    // Also remove from DB so it doesn't come back on next refresh
    if (user) {
      fetch(`/api/tracker/daily/${encodeURIComponent(String(taskId))}`, {
        method: "DELETE",
      }).catch((err) => console.error("[tracker] delete task failed", err));
    }
    showToast("Todo deleted");
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Header + filters */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[1rem] font-semibold text-[#1f2937] m-0">
              Pending Todos
            </h3>
            {allPending.length > 0 && (
              <span className="text-[0.72rem] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                {allPending.length} pending
              </span>
            )}
          </div>
          <p className="text-[0.78rem] text-gray-400 mt-0.5 mb-0">
            All incomplete tasks across all dates
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-[#e9eaed] rounded-lg px-3 py-[6px] text-[0.78rem] text-[#374151] outline-none focus:border-blue-400 font-[inherit] bg-white cursor-pointer transition-colors"
          >
            {DATE_FILTER_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Filter by name..."
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="border border-[#e9eaed] rounded-lg px-3 py-[6px] text-[0.78rem] text-[#374151] outline-none focus:border-blue-400 font-[inherit] w-44 transition-colors"
          />

          {(dateFilter !== "all" || titleFilter) && (
            <button
              onClick={() => {
                setDateFilter("all");
                setTitleFilter("");
              }}
              className="text-[0.72rem] text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer font-[inherit] px-1 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white border border-[#e9eaed] rounded-[14px] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
            <span className="text-3xl mb-2 opacity-30">
              {allPending.length === 0 ? "✅" : "🔍"}
            </span>
            <p className="text-[0.84rem] font-medium text-gray-400 mb-1">
              {allPending.length === 0
                ? "All caught up!"
                : "No todos match your filters"}
            </p>
            <p className="text-[0.75rem] text-gray-300">
              {allPending.length === 0
                ? "No pending todos found. Great work!"
                : "Try adjusting the date or name filter above"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            <table className="w-full border-collapse min-w-[520px]">
              <thead>
                <tr className="border-b border-[#e9eaed] bg-[#f9fafb]">
                  <th className="text-left py-2.5 px-3 text-[0.68rem] font-semibold text-gray-400 uppercase tracking-[0.5px] w-28">
                    Date
                  </th>
                  <th className="text-left py-2.5 px-3 text-[0.68rem] font-semibold text-gray-400 uppercase tracking-[0.5px] w-80">
                    Todo
                  </th>
                  <th className="text-left py-2.5 px-3 text-[0.68rem] font-semibold text-gray-400 uppercase tracking-[0.5px] w-56">
                    Reason{" "}
                    <span className="normal-case font-normal text-gray-300">
                      (opt)
                    </span>
                  </th>
                  <th className="text-center py-2.5 px-3 text-[0.68rem] font-semibold text-gray-400 uppercase tracking-[0.5px] w-24">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(({ date, task }) => {
                  const isEditingThis =
                    editingReason?.date === date &&
                    editingReason?.taskId === String(task.id);

                  return (
                    <tr
                      key={`${date}-${task.id}`}
                      className="border-b border-gray-50 last:border-0 hover:bg-[#fafbff] transition-colors group"
                    >
                      {/* Date */}
                      <td className="px-3 py-[10px] whitespace-nowrap align-middle">
                        <span
                          className={cn(
                            "text-[0.72rem] font-semibold px-2 py-0.5 rounded-full",
                            date === today
                              ? "bg-blue-50 text-blue-700"
                              : date === yesterday
                                ? "bg-amber-50 text-amber-700"
                                : "bg-gray-100 text-gray-500",
                          )}
                        >
                          {formatDateLabel(date, today, yesterday)}
                        </span>
                      </td>

                      {/* Todo title */}
                      <td className="px-3 py-[10px] align-middle max-w-[240px]">
                        <div className="text-[0.83rem] font-medium text-[#1f2937] truncate">
                          {task.title}
                        </div>
                        {task.timeMin > 0 && (
                          <span className="text-[0.65rem] font-mono text-amber-600 bg-amber-50 px-1.5 py-px rounded-full mt-0.5 inline-block">
                            {task.timeMin}m
                          </span>
                        )}
                      </td>

                      {/* Reason */}
                      <td className="px-3 py-[10px] align-middle">
                        {isEditingThis ? (
                          <input
                            autoFocus
                            value={reasonDraft}
                            onChange={(e) => setReasonDraft(e.target.value)}
                            onBlur={() =>
                              saveReason(date, task.id, reasonDraft)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                saveReason(date, task.id, reasonDraft);
                              if (e.key === "Escape") cancelEditReason();
                            }}
                            placeholder="Why is this pending? (Enter to save)"
                            className="w-full min-w-[200px] border border-blue-300 rounded-[6px] px-3 py-[6px] text-[0.82rem] text-[#374151] outline-none font-[inherit] focus:border-blue-500 transition-colors"
                          />
                        ) : (
                          <button
                            onClick={() =>
                              startEditReason(date, task.id, task.reason)
                            }
                            className="w-full text-left flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 font-[inherit]"
                          >
                            {task.reason ? (
                              <span className="text-[0.78rem] text-gray-600 leading-snug break-words">
                                {task.reason}
                              </span>
                            ) : (
                              <span className="text-[0.75rem] text-gray-300 italic group-hover:text-gray-400 transition-colors">
                                Add reason...
                              </span>
                            )}
                            <span className="text-[0.7rem] text-gray-300 group-hover:text-blue-400 transition-colors shrink-0">
                              ✏️
                            </span>
                          </button>
                        )}
                      </td>

                      {/* Actions: mark done + delete */}
                      <td className="px-3 py-[10px] text-center align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Mark done */}
                          <button
                            onClick={() => markDone(date, task.id)}
                            title="Mark as done"
                            className={cn(
                              "w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all cursor-pointer bg-transparent",
                              "border-gray-300 hover:border-green-500 hover:bg-green-500 hover:text-white text-transparent",
                            )}
                          >
                            {CHECK_SVG}
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => deleteTask(date, task.id)}
                            title="Delete todo"
                            className="w-[18px] h-[18px] flex items-center justify-center rounded text-gray-300 hover:text-red-500 hover:bg-red-50 bg-transparent border-none cursor-pointer transition-all"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer count */}
      {filtered.length > 0 && filtered.length < allPending.length && (
        <p className="text-[0.72rem] text-gray-400 mt-2 text-right">
          Showing {filtered.length} of {allPending.length} pending todos
        </p>
      )}
    </div>
  );
}
