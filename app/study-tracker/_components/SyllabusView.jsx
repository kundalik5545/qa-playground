"use client";

import { useState, useCallback } from "react";
import { getTodayStr } from "@/lib/studyTrackerStorage";
import { cn } from "@/lib/utils";

const CHECK_SVG = (
  <svg viewBox="0 0 12 12" width={11} height={11}>
    <polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

const SMALL_CHECK_SVG = (
  <svg viewBox="0 0 12 12" width={10} height={10}>
    <polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

export default function SyllabusView({ syllabus, state, updateState, showToast }) {
  const [openSections, setOpenSections] = useState({});
  const [openTopics, setOpenTopics] = useState({});

  const color = syllabus.color;
  const progress = state.progress;
  const custom = state.custom;
  const subtopics = state.subtopics;

  let total = 0, done = 0;
  for (const sec of syllabus.sections)
    for (const t of sec.topics) {
      total++;
      if (progress[t.id]?.done) done++;
    }
  const pct = total ? Math.round((done / total) * 100) : 0;
  const circumference = Math.round(2 * Math.PI * 30);
  const offset = Math.round(circumference * (1 - pct / 100));

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleTopic = (id) =>
    setOpenTopics((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCheck = useCallback(
    (topicId, checked, topic) => {
      const newProgress = {
        ...state.progress,
        [topicId]: { done: checked, date: checked ? getTodayStr() : null },
      };
      let newSubtopics = { ...state.subtopics };
      if (topic.subtopics?.length) {
        newSubtopics[topicId] = {};
        topic.subtopics.forEach((_, i) => { newSubtopics[topicId][i] = checked; });
      }
      if (checked) {
        const today = getTodayStr();
        const log = [...state.log];
        const last = log[log.length - 1];
        if (last && last.date === today && last.tabId === syllabus.id) last.count += 1;
        else log.push({ date: today, tabId: syllabus.id, count: 1 });
        updateState("log", log);
      }
      updateState("progress", newProgress);
      updateState("subtopics", newSubtopics);
    },
    [state, syllabus.id, updateState],
  );

  const handleSubtopicCheck = useCallback(
    (topicId, idx, totalSubs, topic, checked) => {
      const newSubtopics = {
        ...state.subtopics,
        [topicId]: { ...(state.subtopics[topicId] || {}), [idx]: checked },
      };
      updateState("subtopics", newSubtopics);
      const allDone = Array.from({ length: totalSubs }, (_, i) => !!newSubtopics[topicId][i]).every(Boolean);
      if (allDone && !state.progress[topicId]?.done) handleCheck(topicId, true, topic);
    },
    [state, updateState, handleCheck],
  );

  const handleNoteSave = useCallback(
    (topicId, value) => {
      const newCustom = {
        ...state.custom,
        [topicId]: { ...(state.custom[topicId] || { resources: [] }), notes: value },
      };
      updateState("custom", newCustom);
    },
    [state.custom, updateState],
  );

  const handleAddResource = useCallback(
    (topicId, label, url) => {
      if (!url.trim()) return false;
      const existing = state.custom[topicId] || { notes: "", resources: [] };
      const newCustom = {
        ...state.custom,
        [topicId]: {
          ...existing,
          resources: [...existing.resources, { label: label.trim() || url.trim(), url: url.trim() }],
        },
      };
      updateState("custom", newCustom);
      return true;
    },
    [state.custom, updateState],
  );

  const handleDeleteResource = useCallback(
    (topicId, idx) => {
      const existing = state.custom[topicId];
      if (!existing) return;
      const newCustom = {
        ...state.custom,
        [topicId]: { ...existing, resources: existing.resources.filter((_, i) => i !== idx) },
      };
      updateState("custom", newCustom);
    },
    [state.custom, updateState],
  );

  return (
    <div>
      {/* Syllabus header */}
      <div
        className="mb-5 rounded-xl border border-border bg-card p-4"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-3xl leading-none">{syllabus.icon}</span>
          <div>
            <h1 className="text-xl font-bold">{syllabus.label}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {total} topics &bull; {done} completed
            </p>
          </div>
          <div className="relative ml-auto flex shrink-0 items-center justify-center">
            <svg width="68" height="68" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="#e5e7eb" strokeWidth="6" />
              <circle
                cx="36" cy="36" r="30" fill="none"
                stroke={color} strokeWidth="6"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 36 36)"
              />
            </svg>
            <span className="absolute text-sm font-bold" style={{ color }}>{pct}%</span>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full transition-all duration-500" style={{ background: color, width: `${pct}%` }} />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {syllabus.sections.map((sec) => {
          const secDone = sec.topics.filter((t) => progress[t.id]?.done).length;
          const isOpen = openSections[sec.id] ?? false;
          return (
            <div key={sec.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <button
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                onClick={() => toggleSection(sec.id)}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "inline-block text-[10px] text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-90",
                  )}>
                    ▶
                  </span>
                  <h2 className="text-sm font-semibold">{sec.title}</h2>
                </div>
                <span className="text-xs font-semibold" style={{ color }}>
                  {secDone}/{sec.topics.length}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-border divide-y divide-border">
                  {sec.topics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      color={color}
                      isDone={!!progress[topic.id]?.done}
                      isOpen={!!openTopics[topic.id]}
                      customData={custom[topic.id] || { notes: "", resources: [] }}
                      subtopicState={subtopics[topic.id] || {}}
                      onToggle={() => toggleTopic(topic.id)}
                      onCheck={(checked) => handleCheck(topic.id, checked, topic)}
                      onSubtopicCheck={(idx, checked) =>
                        handleSubtopicCheck(topic.id, idx, topic.subtopics.length, topic, checked)
                      }
                      onNoteSave={(val) => handleNoteSave(topic.id, val)}
                      onAddResource={(label, url) => handleAddResource(topic.id, label, url)}
                      onDeleteResource={(idx) => handleDeleteResource(topic.id, idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopicCard({
  topic, color, isDone, isOpen, customData, subtopicState,
  onToggle, onCheck, onSubtopicCheck, onNoteSave, onAddResource, onDeleteResource,
}) {
  const [labelVal, setLabelVal] = useState("");
  const [urlVal, setUrlVal] = useState("");

  const handleAddRes = () => {
    if (onAddResource(labelVal, urlVal)) {
      setLabelVal("");
      setUrlVal("");
    }
  };

  return (
    <div
      className={cn("px-4 py-3", isDone && "bg-muted/20")}
      style={{ "--syl-color": color }}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors",
            isDone
              ? "border-[var(--syl-color)] bg-[var(--syl-color)]"
              : "border-border hover:border-[var(--syl-color)]",
          )}
          onClick={() => onCheck(!isDone)}
        >
          {isDone && CHECK_SVG}
        </div>

        <span
          className={cn(
            "flex-1 cursor-pointer select-none text-sm transition-colors hover:text-primary",
            isDone && "line-through text-muted-foreground",
          )}
          onClick={onToggle}
        >
          {topic.title}
        </span>

        <button
          className="flex h-6 w-6 items-center justify-center rounded text-lg leading-none text-muted-foreground hover:bg-muted transition-colors"
          onClick={onToggle}
        >
          {isOpen ? "－" : "＋"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 border-t border-border pt-3">
          {topic.subtopics?.length > 0 && (
            <div className="mb-3">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">📋 Subtopics</span>
              <div className="space-y-1.5">
                {topic.subtopics.map((st, i) => {
                  const checked = !!subtopicState[i];
                  return (
                    <div
                      key={i}
                      className="flex cursor-pointer items-center gap-2"
                      onClick={() => onSubtopicCheck(i, !checked)}
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                          checked
                            ? "border-[var(--syl-color)] bg-[var(--syl-color)]"
                            : "border-border",
                        )}
                        style={{ "--syl-color": color }}
                      >
                        {checked && SMALL_CHECK_SVG}
                      </div>
                      <span className={cn("text-xs text-muted-foreground", checked && "line-through")}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">📝 Notes</span>
              <textarea
                className="h-24 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Add your notes here..."
                defaultValue={customData.notes || ""}
                onBlur={(e) => onNoteSave(e.target.value)}
              />
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">🔗 Resources</span>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {customData.resources?.length > 0 ? (
                  customData.resources.map((r, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.label || r.url}
                      </a>
                      <button
                        className="leading-none text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => onDeleteResource(i)}
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No resources added yet</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <input
                  className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Label (e.g. MDN Docs)"
                  value={labelVal}
                  onChange={(e) => setLabelVal(e.target.value)}
                />
                <input
                  className="rounded-md border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="URL (https://...)"
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRes()}
                />
                <button
                  className="rounded-md px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: color }}
                  onClick={handleAddRes}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
