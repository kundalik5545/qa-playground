"use client";

import { useState, useEffect, useCallback } from "react";
import { loadSyllabiFromIdb, getDefaultSyllabi, saveSyllabiToIdb, getDefaultOrder } from "@/lib/syllabusManagerDb";
import { getIdbItem, setIdbItem } from "@/lib/indexedDb";
import { cn } from "@/lib/utils";
import { ChevronRight, Plus, Minus, Link, FileText } from "lucide-react";

// ── IDB helpers for study state ────────────────────────────────────────────

const STATE_KEY = "study-tracker-state";

async function loadStudyState() {
  const data = await getIdbItem(STATE_KEY);
  return {
    progress: data?.progress || {},
    custom: data?.custom || {},
    subtopics: data?.subtopics || {},
    log: data?.log || [],
  };
}

async function persistStudyState(next) {
  const existing = (await getIdbItem(STATE_KEY)) || {};
  await setIdbItem(STATE_KEY, { ...existing, ...next });
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ── Progress ring ──────────────────────────────────────────────────────────

function ProgressRing({ pct, color }) {
  const r = 30;
  const circ = Math.round(2 * Math.PI * r);
  const offset = Math.round(circ * (1 - pct / 100));
  return (
    <div className="relative flex items-center justify-center w-[68px] h-[68px]">
      <svg width="68" height="68" viewBox="0 0 72 72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none"
          stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-semibold" style={{ color }}>
        {pct}%
      </span>
    </div>
  );
}

// ── Topic card ─────────────────────────────────────────────────────────────

function TopicCard({ topic, color, isDone, isOpen, customData, subtopicState, onToggle, onCheck, onSubtopicCheck, onNoteSave, onAddResource, onDeleteResource }) {
  const [labelVal, setLabelVal] = useState("");
  const [urlVal, setUrlVal] = useState("");

  const handleAdd = () => {
    if (onAddResource(labelVal, urlVal)) {
      setLabelVal("");
      setUrlVal("");
    }
  };

  return (
    <div className={cn("rounded-lg border transition-colors", isDone ? "bg-muted/40 border-border/60" : "bg-background border-border")}>
      {/* Topic header */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Checkbox */}
        <button
          onClick={() => onCheck(!isDone)}
          className="shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors"
          style={{ borderColor: isDone ? color : undefined, backgroundColor: isDone ? color : undefined }}
        >
          {isDone && (
            <svg viewBox="0 0 12 12" width="10" height="10">
              <polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
          )}
        </button>

        {/* Title */}
        <span
          className={cn("flex-1 text-sm font-medium cursor-pointer select-none", isDone && "line-through text-muted-foreground")}
          onClick={onToggle}
        >
          {topic.title}
        </span>

        {/* Expand */}
        <button onClick={onToggle} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded details */}
      {isOpen && (
        <div className="border-t border-border px-4 py-4 space-y-4">
          {/* Subtopics */}
          {topic.subtopics?.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3 w-3" /> Subtopics
              </p>
              <div className="space-y-1">
                {topic.subtopics.map((st, i) => {
                  const checked = !!subtopicState[i];
                  return (
                    <div key={i} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onSubtopicCheck(i, !checked)}>
                      <div
                        className="shrink-0 h-4 w-4 rounded border flex items-center justify-center transition-colors"
                        style={{ borderColor: checked ? color : undefined, backgroundColor: checked ? color : undefined }}
                      >
                        {checked && (
                          <svg viewBox="0 0 12 12" width="8" height="8">
                            <polyline points="1.5,6 5,9.5 10.5,2.5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <span className={cn("text-sm", checked ? "line-through text-muted-foreground" : "text-foreground")}>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes + Resources two-column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Notes */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3 w-3" /> Notes
              </p>
              <textarea
                className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[100px]"
                placeholder="Add your notes here..."
                defaultValue={customData.notes || ""}
                onBlur={(e) => onNoteSave(e.target.value)}
              />
            </div>

            {/* Resources */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Link className="h-3 w-3" /> Resources
              </p>
              {customData.resources?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {customData.resources.map((r, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs">
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {r.label || r.url}
                      </a>
                      <button onClick={() => onDeleteResource(i)} className="text-muted-foreground hover:text-destructive leading-none">×</button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic mb-2">No resources added yet</p>
              )}
              <div className="flex gap-1.5">
                <input
                  className="flex-1 min-w-0 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Label (e.g. MDN Docs)"
                  value={labelVal}
                  onChange={(e) => setLabelVal(e.target.value)}
                />
                <input
                  className="flex-1 min-w-0 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="URL (https://...)"
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <button
                  onClick={handleAdd}
                  className="shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: color }}
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

// ── Main component ─────────────────────────────────────────────────────────

export default function SyllabusDetailContent({ slug }) {
  const [syllabus, setSyllabus] = useState(null);
  const [studyState, setStudyState] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [openTopics, setOpenTopics] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let { syllabi, order } = await loadSyllabiFromIdb();
      // Seed if empty
      if (!syllabi || Object.keys(syllabi).length === 0) {
        syllabi = getDefaultSyllabi();
        await saveSyllabiToIdb(syllabi, getDefaultOrder());
      }
      const state = await loadStudyState();
      if (cancelled) return;
      const found = syllabi?.[slug];
      if (found) setSyllabus(found);
      else setNotFound(true);
      setStudyState(state);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const updateState = useCallback((key, value) => {
    setStudyState((prev) => {
      const next = { ...prev, [key]: value };
      persistStudyState({ [key]: value });
      return next;
    });
  }, []);

  const handleCheck = useCallback((topicId, checked, topic) => {
    setStudyState((prev) => {
      const newProgress = {
        ...prev.progress,
        [topicId]: { done: checked, date: checked ? getTodayStr() : null },
      };
      let newSubtopics = { ...prev.subtopics };
      if (topic.subtopics?.length) {
        newSubtopics[topicId] = {};
        topic.subtopics.forEach((_, i) => { newSubtopics[topicId][i] = checked; });
      }
      const next = { ...prev, progress: newProgress, subtopics: newSubtopics };
      persistStudyState({ progress: newProgress, subtopics: newSubtopics });
      return next;
    });
  }, []);

  const handleSubtopicCheck = useCallback((topicId, idx, totalSubs, topic, checked) => {
    setStudyState((prev) => {
      const newSubtopics = {
        ...prev.subtopics,
        [topicId]: { ...(prev.subtopics[topicId] || {}), [idx]: checked },
      };
      const allDone = Array.from({ length: totalSubs }, (_, i) => !!newSubtopics[topicId][i]).every(Boolean);
      const newProgress = allDone && !prev.progress[topicId]?.done
        ? { ...prev.progress, [topicId]: { done: true, date: getTodayStr() } }
        : prev.progress;
      const next = { ...prev, subtopics: newSubtopics, progress: newProgress };
      persistStudyState({ subtopics: newSubtopics, progress: newProgress });
      return next;
    });
  }, []);

  const handleNoteSave = useCallback((topicId, value) => {
    setStudyState((prev) => {
      const newCustom = {
        ...prev.custom,
        [topicId]: { ...(prev.custom[topicId] || { resources: [] }), notes: value },
      };
      persistStudyState({ custom: newCustom });
      return { ...prev, custom: newCustom };
    });
  }, []);

  const handleAddResource = useCallback((topicId, label, url) => {
    if (!url.trim()) return false;
    setStudyState((prev) => {
      const existing = prev.custom[topicId] || { notes: "", resources: [] };
      const newCustom = {
        ...prev.custom,
        [topicId]: {
          ...existing,
          resources: [...existing.resources, { label: label.trim() || url.trim(), url: url.trim() }],
        },
      };
      persistStudyState({ custom: newCustom });
      return { ...prev, custom: newCustom };
    });
    return true;
  }, []);

  const handleDeleteResource = useCallback((topicId, idx) => {
    setStudyState((prev) => {
      const existing = prev.custom[topicId];
      if (!existing) return prev;
      const newCustom = {
        ...prev.custom,
        [topicId]: { ...existing, resources: existing.resources.filter((_, i) => i !== idx) },
      };
      persistStudyState({ custom: newCustom });
      return { ...prev, custom: newCustom };
    });
  }, []);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-2xl font-bold">Syllabus not found</p>
        <p className="text-sm text-muted-foreground mt-2">The syllabus &quot;{slug}&quot; does not exist in your library.</p>
      </div>
    );
  }

  if (!syllabus || !studyState) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
        Loading syllabus...
      </div>
    );
  }

  const { progress, custom, subtopics } = studyState;
  const color = syllabus.color;

  let total = 0, done = 0;
  for (const sec of syllabus.sections)
    for (const t of sec.topics) {
      total++;
      if (progress[t.id]?.done) done++;
    }
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* ── Syllabus header ── */}
      <div
        className="rounded-lg border bg-card px-6 py-5"
        style={{ borderLeft: `4px solid ${color}` }}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl leading-none shrink-0">{syllabus.icon}</span>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight">{syllabus.label}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {total} topic{total !== 1 ? "s" : ""} &bull; {done} completed
            </p>
          </div>
          <ProgressRing pct={pct} color={color} />
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="space-y-2">
        {syllabus.sections.map((sec) => {
          const secDone = sec.topics.filter((t) => progress[t.id]?.done).length;
          const isOpen = openSections[sec.id] ?? false;
          return (
            <div key={sec.id} className="rounded-lg border bg-card overflow-hidden">
              {/* Section header */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                onClick={() => setOpenSections((prev) => ({ ...prev, [sec.id]: !prev[sec.id] }))}
              >
                <ChevronRight
                  className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform", isOpen && "rotate-90")}
                />
                <span className="flex-1 font-semibold text-sm">{sec.title}</span>
                <span className="text-xs font-semibold shrink-0" style={{ color }}>
                  {secDone}/{sec.topics.length}
                </span>
              </button>

              {/* Topics */}
              {isOpen && (
                <div className="border-t border-border px-4 py-3 space-y-2">
                  {sec.topics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      color={color}
                      isDone={!!progress[topic.id]?.done}
                      isOpen={!!openTopics[topic.id]}
                      customData={custom[topic.id] || { notes: "", resources: [] }}
                      subtopicState={subtopics[topic.id] || {}}
                      onToggle={() => setOpenTopics((prev) => ({ ...prev, [topic.id]: !prev[topic.id] }))}
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
