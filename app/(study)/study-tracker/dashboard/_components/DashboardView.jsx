"use client";

import { useEffect, useRef, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import {
  getSyllabusStats,
  getLast14Days,
  getTodayStr,
} from "@/lib/studyTrackerStorage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

Chart.register(...registerables);

export default function DashboardView({
  state,
  allStats,
  onExport,
  onImport,
  onClearAll,
  onNavigate,
}) {
  const pieRef = useRef(null); // Today's Tasks doughnut
  const overallRef = useRef(null); // Overall Progress doughnut
  const lineRef = useRef(null); // Topics Completed line
  const barRef = useRef(null); // Progress by Syllabus bar
  const doughnutRef = useRef(null); // Completion Breakdown doughnut
  const taskChartRef = useRef(null); // Daily Task Completion % line
  const charts = useRef({});

  const today = getTodayStr();
  const todayTasks = useMemo(
    () => state.daily[today] || [],
    [state.daily, today],
  );
  const todayTaskDone = todayTasks.filter((t) => t.done).length;

  // Scope effect to only the state keys charts actually read
  const syllabi = state.syllabi;
  const progress = state.progress;
  const daily = state.daily;

  useEffect(() => {
    destroyAll();
    renderCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syllabi, progress, daily]);

  function destroyAll() {
    Object.values(charts.current).forEach((c) => {
      try {
        c.destroy();
      } catch (_) {}
    });
    charts.current = {};
  }

  function renderCharts() {
    const syllabusIds = Object.keys(syllabi);
    const syllabusLabels = syllabusIds.map((id) => syllabi[id].label);
    const syllabusColors = syllabusIds.map((id) => syllabi[id].color);
    const sylStats = syllabusIds.map((id) =>
      getSyllabusStats(syllabi, progress, id),
    );
    const days = getLast14Days();
    const todayTasksNow = daily[today] || [];
    const doneTasks = todayTasksNow.filter((t) => t.done).length;

    // ── Today's Tasks doughnut ──
    if (pieRef.current) {
      const total = todayTasksNow.length;
      const remaining = Math.max(total - doneTasks, 0);
      charts.current.pie = new Chart(pieRef.current, {
        type: "doughnut",
        data: {
          labels: ["Done", "Remaining"],
          datasets: [
            {
              data: [doneTasks, remaining || (doneTasks ? 0 : 1)],
              backgroundColor: ["#10b981", "#e5e7eb"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: "74%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "Inter, sans-serif", size: 12 },
                boxWidth: 12,
                padding: 14,
              },
            },
            title: {
              display: true,
              text: total ? `${doneTasks}/${total} today` : "No tasks today",
              font: { family: "Inter, sans-serif", size: 13, weight: "600" },
              color: "#374151",
              padding: { top: 10 },
            },
          },
        },
      });
    }

    // ── Overall Progress doughnut ──
    if (overallRef.current) {
      const { total, done } = allStats;
      charts.current.overall = new Chart(overallRef.current, {
        type: "doughnut",
        data: {
          labels: ["Completed", "Remaining"],
          datasets: [
            {
              data: [done, Math.max(total - done, 0) || (done ? 0 : 1)],
              backgroundColor: ["#2563eb", "#e5e7eb"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: "74%",
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "Inter, sans-serif", size: 12 },
                boxWidth: 12,
                padding: 14,
              },
            },
            title: {
              display: true,
              text: `${done} / ${total} topics`,
              font: { family: "Inter, sans-serif", size: 13, weight: "600" },
              color: "#374151",
              padding: { top: 10 },
            },
          },
        },
      });
    }

    // ── Topics completed line (last 14 days) ──
    if (lineRef.current) {
      const datasets = syllabusIds.map((id) => {
        const syl = syllabi[id];
        const data = days.map((day) => {
          let count = 0;
          for (const sec of syl.sections)
            for (const topic of sec.topics)
              if (progress[topic.id]?.done && progress[topic.id]?.date === day)
                count++;
          return count;
        });
        return {
          label: syl.label,
          data,
          borderColor: syl.color,
          backgroundColor: syl.color + "18",
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.35,
          spanGaps: true,
        };
      });
      charts.current.line = new Chart(lineRef.current, {
        type: "line",
        data: { labels: days.map((d) => d.slice(5)), datasets },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "Inter, sans-serif", size: 11 },
                boxWidth: 12,
                padding: 14,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1, font: { family: "Inter" } },
              grid: { color: "#f3f4f6" },
            },
            x: {
              ticks: { font: { family: "Inter", size: 10 } },
              grid: { display: false },
            },
          },
        },
      });
    }

    // ── Progress by syllabus bar ──
    if (barRef.current) {
      charts.current.bar = new Chart(barRef.current, {
        type: "bar",
        data: {
          labels: syllabusLabels,
          datasets: [
            {
              label: "Completed",
              data: sylStats.map((s) => s.done),
              backgroundColor: syllabusColors,
              borderColor: syllabusColors,
              borderWidth: 0,
              borderRadius: 0,
              borderSkipped: "bottom",
              barPercentage: 0.55,
              categoryPercentage: 0.65,
            },
            {
              label: "Remaining",
              data: sylStats.map((s) => Math.max(s.total - s.done, 0)),
              backgroundColor: syllabusColors.map((c) => c + "33"),
              borderColor: syllabusColors.map((c) => c + "55"),
              borderWidth: 0,
              borderRadius: { topLeft: 6, topRight: 6 },
              borderSkipped: "bottom",
              barPercentage: 0.55,
              categoryPercentage: 0.65,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "Inter, sans-serif", size: 11 },
                boxWidth: 10,
                padding: 12,
                usePointStyle: true,
                pointStyle: "rectRounded",
              },
            },
            tooltip: {
              callbacks: {
                label: (item) => {
                  const s = sylStats[item.dataIndex];
                  if (item.datasetIndex === 0)
                    return ` Completed: ${s.done} (${s.pct}%)`;
                  return ` Remaining: ${Math.max(s.total - s.done, 0)}`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                font: { family: "Inter", size: 12 },
                maxRotation: 40,
                minRotation: 30,
                autoSkip: false,
              },
              grid: { display: false },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { stepSize: 5, font: { family: "Inter", size: 10 } },
              grid: { color: "#f3f4f6" },
            },
          },
        },
      });
    }

    // ── Completion breakdown doughnut (per syllabus) ──
    if (doughnutRef.current) {
      charts.current.doughnut = new Chart(doughnutRef.current, {
        type: "doughnut",
        data: {
          labels: syllabusLabels,
          datasets: [
            {
              data: sylStats.map((s) => s.done || 0),
              backgroundColor: syllabusColors,
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "Inter, sans-serif", size: 12 },
                boxWidth: 12,
                padding: 14,
              },
            },
          },
        },
      });
    }

    // ── Daily task completion % line (last 14 days) ──
    if (taskChartRef.current) {
      const taskData = days.map((day) => {
        const tasks = daily[day] || [];
        const done = tasks.filter((t) => t.done).length;
        const total = tasks.length;
        return {
          pct: total > 0 ? Math.round((done / total) * 100) : null,
          done,
          total,
        };
      });
      charts.current.taskChart = new Chart(taskChartRef.current, {
        type: "line",
        data: {
          labels: days.map((d) => d.slice(5)),
          datasets: [
            {
              label: "Completion %",
              data: taskData.map((d) => d.pct),
              borderColor: "#f59e0b",
              backgroundColor: "#f59e0b22",
              borderWidth: 2.5,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: "#f59e0b",
              fill: true,
              tension: 0.35,
              spanGaps: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: { family: "Inter, sans-serif", size: 12 },
                boxWidth: 12,
                padding: 14,
              },
            },
            tooltip: {
              callbacks: {
                label: (item) => {
                  const d = taskData[item.dataIndex];
                  return d.total
                    ? `${d.pct}% (${d.done}/${d.total} tasks)`
                    : "No tasks";
                },
              },
            },
          },
          scales: {
            x: {
              ticks: { font: { family: "Inter", size: 10 } },
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              min: 0,
              max: 100,
              ticks: {
                stepSize: 10,
                font: { family: "Inter" },
                callback: (v) => v + "%",
              },
              grid: { color: "#f3f4f6" },
            },
          },
        },
      });
    }
  }

  // Group log entries by date, most recent first, max 7 days
  const recentByDate = [];
  const seen = new Map();
  for (const entry of [...state.log].reverse()) {
    if (!seen.has(entry.date)) {
      seen.set(entry.date, []);
      recentByDate.push({ date: entry.date, entries: seen.get(entry.date) });
    }
    seen.get(entry.date).push(entry);
    if (recentByDate.length >= 7 && seen.has(entry.date)) {
      if (recentByDate[recentByDate.length - 1].date !== entry.date) break;
    }
  }
  const recentLog = recentByDate.slice(0, 7);

  return (
    <div>
      {/* Header */}
      <div className="mb-[22px]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-[1.75rem] font-bold tracking-[-0.7px] text-[#111827] m-0">
              QA Study Tracker
            </h1>
            <p className="text-gray-500 text-[0.9rem] mt-1 mb-0">
              Your personal learning progress dashboard
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onExport}
              className="bg-blue-600 hover:bg-blue-700  dark:text-white text-[0.82rem]"
            >
              ⬇ Export
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onImport}
              className="text-[0.82rem] dark:text-white"
            >
              ⬆ Import
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-[0.82rem]"
                >
                  🗑 Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your progress, tasks,
                    habits, and custom syllabi, and reset everything back to the
                    default state. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={onClearAll}
                  >
                    Yes, clear all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Syllabus overview cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 mb-[22px]">
        <OverviewCard
          icon="🎯"
          label="Overall"
          pct={allStats.pct}
          sub={`${allStats.done} / ${allStats.total} topics`}
          color="#1f2937"
        />
        {Object.values(state.syllabi).map((syl) => {
          const s = getSyllabusStats(state.syllabi, state.progress, syl.id);
          return (
            <OverviewCard
              key={syl.id}
              icon={syl.icon}
              label={syl.label}
              pct={s.pct}
              sub={`${s.done} / ${s.total} topics`}
              color={syl.color}
              onClick={() => onNavigate(syl.id)}
            />
          );
        })}
      </div>

      {/* Row 1: Today's Tasks doughnut + Daily Task Completion % line */}
      <div className="grid grid-cols-[1fr_2fr] gap-[14px] mb-[14px]">
        <div className="bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]">
          <h3 className="text-sm font-semibold text-[#374151] mb-[14px] mt-0">
            Today's Tasks
          </h3>
          <div className="max-w-[260px] mx-auto">
            <canvas ref={pieRef} />
          </div>
        </div>
        <div className="bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]">
          <h3 className="text-sm font-semibold text-[#374151] mb-[14px] mt-0">
            Daily Task Completion %{" "}
            <span className="text-[0.73rem] font-normal text-gray-400 ml-[5px]">
              (last 14 days)
            </span>
          </h3>
          <canvas ref={taskChartRef} height={110} />
        </div>
      </div>

      {/* Row 2: Overall Progress doughnut + Topics Completed line */}
      <div className="grid grid-cols-[1fr_2fr] gap-[14px] mb-[14px]">
        <div className="bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]">
          <h3 className="text-sm font-semibold text-[#374151] mb-[14px] mt-0">
            Overall Progress
          </h3>
          <div className="max-w-[260px] mx-auto">
            <canvas ref={overallRef} />
          </div>
        </div>
        <div className="bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]">
          <h3 className="text-sm font-semibold text-[#374151] mb-[14px] mt-0">
            Topics Completed{" "}
            <span className="text-[0.73rem] font-normal text-gray-400 ml-[5px]">
              (last 14 days)
            </span>
          </h3>
          <canvas ref={lineRef} height={110} />
        </div>
      </div>

      {/* Row 3: Progress by Syllabus + Completion Breakdown */}
      <div className="grid grid-cols-[2fr_1fr] gap-[14px] mb-[14px]">
        <div className="bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]">
          <h3 className="text-sm font-semibold text-[#374151] mb-[14px] mt-0">
            Progress by Syllabus
          </h3>
          <canvas ref={barRef} height={100} />
        </div>
        <div className="bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px]">
          <h3 className="text-sm font-semibold text-[#374151] mb-[14px] mt-0">
            Completion Breakdown
          </h3>
          <div className="max-w-[260px] mx-auto">
            <canvas ref={doughnutRef} />
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-[#e9eaed] rounded-[14px] p-[18px_20px] mt-[14px]">
        <h3 className="text-sm font-semibold text-[#374151] mb-[14px] mt-0">
          Recent Activity
        </h3>
        {recentLog.length === 0 ? (
          <div className="text-gray-400 text-[0.86rem] text-center py-[18px]">
            No activity yet. Start checking off topics!
          </div>
        ) : (
          recentLog.map(({ date, entries }) => {
            const d = new Date(date + "T00:00:00");
            const label = d.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
            return (
              <div
                key={date}
                className="flex flex-nowrap items-center gap-3 py-[9px] border-b border-gray-100 last:border-b-0"
              >
                <span className="text-[0.76rem] font-semibold text-gray-500 min-w-[96px] flex-shrink-0">
                  {label}
                </span>
                <div className="flex flex-wrap gap-[6px] flex-1">
                  {entries.map((entry, i) => {
                    const syl = state.syllabi[entry.tabId];
                    if (!syl) return null;
                    return (
                      <span
                        key={i}
                        className="text-[0.72rem] font-medium px-[10px] py-[3px] rounded-full whitespace-nowrap"
                        style={{
                          background: syl.color + "18",
                          color: syl.color,
                        }}
                      >
                        {syl.icon} +{entry.count} in {syl.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function OverviewCard({ icon, label, pct, sub, color, onClick }) {
  return (
    <div
      className="bg-white rounded-xl px-[14px] pt-4 pb-[14px] border border-[#e9eaed] border-t-[3px] cursor-pointer transition-all hover:shadow-[0_4px_18px_rgba(0,0,0,0.09)] hover:-translate-y-0.5"
      style={{ borderTopColor: color }}
      onClick={onClick}
    >
      <div className="text-[1.6rem] mb-[10px]">{icon}</div>
      <div className="text-[0.68rem] font-semibold text-gray-400 uppercase tracking-[0.8px] mb-[3px]">
        {label}
      </div>
      <div
        className="text-[1.9rem] font-bold tracking-[-1px] leading-[1.1] mb-[3px] font-mono"
        style={{ color }}
      >
        {pct}%
      </div>
      <div className="text-[0.73rem] text-gray-400 mb-[10px]">{sub}</div>
      <div className="h-1 bg-[#f0f1f4] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
