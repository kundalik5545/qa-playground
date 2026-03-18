"use client";

import { useState, useCallback } from "react";
import { getTodayStr } from "@/lib/studyTrackerStorage";

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
  const [openTopics, setOpenTopics]     = useState({});

  const color    = syllabus.color;
  const progress = state.progress;
  const custom   = state.custom;
  const subtopics = state.subtopics;

  // Compute stats
  let total = 0, done = 0;
  for (const sec of syllabus.sections)
    for (const t of sec.topics) { total++; if (progress[t.id]?.done) done++; }
  const pct = total ? Math.round((done / total) * 100) : 0;
  const circumference = Math.round(2 * Math.PI * 30);
  const offset = Math.round(circumference * (1 - pct / 100));

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleTopic = (id) =>
    setOpenTopics((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleCheck = useCallback((topicId, checked, topic) => {
    const newProgress = { ...state.progress, [topicId]: { done: checked, date: checked ? getTodayStr() : null } };

    // Sync subtopics
    let newSubtopics = { ...state.subtopics };
    if (topic.subtopics?.length) {
      newSubtopics[topicId] = {};
      topic.subtopics.forEach((_, i) => { newSubtopics[topicId][i] = checked; });
    }

    // Log activity
    if (checked) {
      const today = getTodayStr();
      const log   = [...state.log];
      const last  = log[log.length - 1];
      if (last && last.date === today && last.tabId === syllabus.id) last.count += 1;
      else log.push({ date: today, tabId: syllabus.id, count: 1 });
      updateState("log", log);
    }

    updateState("progress", newProgress);
    updateState("subtopics", newSubtopics);
  }, [state, syllabus.id, updateState]);

  const handleSubtopicCheck = useCallback((topicId, idx, totalSubs, topic, checked) => {
    const newSubtopics = {
      ...state.subtopics,
      [topicId]: { ...(state.subtopics[topicId] || {}), [idx]: checked },
    };
    updateState("subtopics", newSubtopics);

    // Auto-check main topic if all subtopics done
    const allDone = Array.from({ length: totalSubs }, (_, i) => !!newSubtopics[topicId][i]).every(Boolean);
    if (allDone && !state.progress[topicId]?.done) {
      handleCheck(topicId, true, topic);
    }
  }, [state, updateState, handleCheck]);

  const handleNoteSave = useCallback((topicId, value) => {
    const newCustom = {
      ...state.custom,
      [topicId]: { ...(state.custom[topicId] || { resources: [] }), notes: value },
    };
    updateState("custom", newCustom);
  }, [state.custom, updateState]);

  const handleAddResource = useCallback((topicId, label, url) => {
    if (!url.trim()) return false;
    const existing = state.custom[topicId] || { notes: "", resources: [] };
    const newCustom = {
      ...state.custom,
      [topicId]: { ...existing, resources: [...existing.resources, { label: label.trim() || url.trim(), url: url.trim() }] },
    };
    updateState("custom", newCustom);
    return true;
  }, [state.custom, updateState]);

  const handleDeleteResource = useCallback((topicId, idx) => {
    const existing = state.custom[topicId];
    if (!existing) return;
    const newCustom = {
      ...state.custom,
      [topicId]: { ...existing, resources: existing.resources.filter((_, i) => i !== idx) },
    };
    updateState("custom", newCustom);
  }, [state.custom, updateState]);

  return (
    <div>
      {/* Syllabus header */}
      <div className="st-syl-header" style={{ borderLeft: `4px solid ${color}` }}>
        <div className="st-syl-title-row">
          <span className="st-syl-icon">{syllabus.icon}</span>
          <div>
            <h1 className="st-syl-title">{syllabus.label}</h1>
            <p className="st-syl-meta">{total} topics &bull; {done} completed</p>
          </div>
          <div className="st-syl-ring-wrap">
            <svg width="68" height="68" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="#e5e7eb" strokeWidth="6" />
              <circle
                cx="36" cy="36" r="30" fill="none" stroke={color} strokeWidth="6"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 36 36)"
              />
            </svg>
            <span className="st-ring-pct" style={{ color }}>{pct}%</span>
          </div>
        </div>
        <div className="st-syl-bar-wrap">
          <div className="st-syl-bar" style={{ background: color, width: `${pct}%` }} />
        </div>
      </div>

      {/* Sections */}
      <div className="st-section-list">
        {syllabus.sections.map((sec) => {
          const secDone  = sec.topics.filter((t) => progress[t.id]?.done).length;
          const isOpen   = openSections[sec.id] ?? false;
          return (
            <div className="st-section-card" key={sec.id}>
              <button className="st-section-header" onClick={() => toggleSection(sec.id)}>
                <div className="st-sec-title-wrap">
                  <span className={`st-sec-chevron${isOpen ? " open" : ""}`}>▶</span>
                  <h2 className="st-sec-title">{sec.title}</h2>
                </div>
                <span className="st-sec-count" style={{ color }}>
                  {secDone}/{sec.topics.length}
                </span>
              </button>

              {isOpen && (
                <div className="st-section-body">
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
                      onSubtopicCheck={(idx, checked) => handleSubtopicCheck(topic.id, idx, topic.subtopics.length, topic, checked)}
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

function TopicCard({ topic, color, isDone, isOpen, customData, subtopicState, onToggle, onCheck, onSubtopicCheck, onNoteSave, onAddResource, onDeleteResource }) {
  const [labelVal, setLabelVal] = useState("");
  const [urlVal, setUrlVal]     = useState("");

  const handleAddRes = () => {
    if (onAddResource(labelVal, urlVal)) {
      setLabelVal(""); setUrlVal("");
    }
  };

  return (
    <div className={`st-topic-card${isDone ? " done" : ""}`} style={{ "--syl-color": color }}>
      <div className="st-topic-top">
        {/* Checkbox */}
        <div
          className={`st-custom-check${isDone ? " checked" : ""}`}
          onClick={() => onCheck(!isDone)}
        >
          {isDone && CHECK_SVG}
        </div>

        {/* Title */}
        <span
          className={`st-topic-title${isDone ? " done" : ""}`}
          onClick={onToggle}
        >
          {topic.title}
        </span>

        {/* Expand btn */}
        <button className="st-topic-expand-btn" onClick={onToggle}>
          {isOpen ? "－" : "＋"}
        </button>
      </div>

      {/* Details panel */}
      {isOpen && (
        <div className="st-topic-details">
          {/* Subtopics */}
          {topic.subtopics?.length > 0 && (
            <div className="st-subtopics-section">
              <span className="st-notes-label">📋 Subtopics</span>
              <div className="st-subtopics-checklist">
                {topic.subtopics.map((st, i) => {
                  const checked = !!subtopicState[i];
                  return (
                    <div
                      key={i}
                      className="st-subtopic-item"
                      onClick={() => onSubtopicCheck(i, !checked)}
                    >
                      <div className={`st-subtopic-check${checked ? " checked" : ""}`} style={{ "--syl-color": color }}>
                        {checked && SMALL_CHECK_SVG}
                      </div>
                      <span className={`st-subtopic-label${checked ? " done" : ""}`}>{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes + Resources */}
          <div className="st-det-cols">
            <div>
              <span className="st-notes-label">📝 Notes</span>
              <textarea
                className="st-notes-input"
                placeholder="Add your notes here..."
                defaultValue={customData.notes || ""}
                onBlur={(e) => onNoteSave(e.target.value)}
              />
            </div>
            <div>
              <span className="st-notes-label">🔗 Resources</span>
              <div className="st-res-list">
                {customData.resources?.length > 0
                  ? customData.resources.map((r, i) => (
                    <span key={i} className="st-res-chip">
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.label || r.url}
                      </a>
                      <button className="st-res-del" onClick={() => onDeleteResource(i)}>×</button>
                    </span>
                  ))
                  : <span className="st-no-res">No resources added yet</span>
                }
              </div>
              <div className="st-res-form">
                <input
                  className="st-res-input"
                  placeholder="Label (e.g. MDN Docs)"
                  value={labelVal}
                  onChange={(e) => setLabelVal(e.target.value)}
                />
                <input
                  className="st-res-input"
                  placeholder="URL (https://...)"
                  value={urlVal}
                  onChange={(e) => setUrlVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddRes()}
                />
                <button
                  className="st-res-add-btn"
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
