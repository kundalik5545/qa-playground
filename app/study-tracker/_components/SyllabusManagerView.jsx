"use client";

import { useState } from "react";
import { getSyllabusStats, downloadJSON, pickJSONFile } from "@/lib/studyTrackerStorage";

const COLORS = ["#2563eb","#7c3aed","#059669","#dc2626","#f59e0b","#0891b2","#db2777","#ea580c"];

// Regenerate all IDs in a syllabus so imported copies don't collide with existing ones
function reIdSyllabus(syl) {
  const newId = "syl-" + Date.now();
  const sections = (syl.sections || []).map((sec) => {
    const secId = `${newId}-s${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const topics = (sec.topics || []).map((t) => ({
      ...t,
      id: `t-${newId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      subtopics: Array.isArray(t.subtopics) ? [...t.subtopics] : [],
      resources: Array.isArray(t.resources) ? [...t.resources] : [],
    }));
    return { ...sec, id: secId, topics };
  });
  return { ...syl, id: newId, sections };
}

export default function SyllabusManagerView({ state, updateState, showToast }) {
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({ label: "", icon: "📝", color: "#2563eb" });

  // ── Filename helper: qa-playground-syllabus-subjectName-dd-mm-yyyy-HHmm.json ──
  const makeFilename = (label) => {
    const now  = new Date();
    const yyyy = now.getFullYear();
    const mm   = String(now.getMonth() + 1).padStart(2, "0");
    const dd   = String(now.getDate()).padStart(2, "0");
    const uid  = Math.random().toString(36).slice(2, 6);
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `qa-playground-syllabus-${slug}-${yyyy}-${mm}-${dd}-${uid}.json`;
  };

  // ── Export single syllabus (standardised envelope) ──
  const exportSyllabus = (syl) => {
    const payload = {
      version: 1,
      type: "qa-tracker-syllabus",
      exportedAt: new Date().toISOString(),
      syllabus: syl,
    };
    downloadJSON(payload, makeFilename(syl.label));
    showToast(`"${syl.label}" exported!`);
  };

  // ── Export ALL syllabi ──
  const exportAll = () => {
    const payload = {
      version: 1,
      type: "qa-tracker-syllabi-bundle",
      exportedAt: new Date().toISOString(),
      syllabi: Object.values(state.syllabi),
    };
    downloadJSON(payload, makeFilename("all-syllabi"));
    showToast("All syllabi exported!");
  };

  // ── Import syllabus from JSON file ──
  const importSyllabus = () => {
    pickJSONFile((data) => {
      // Support both single and bundle format
      if (data.type === "qa-tracker-syllabus" && data.syllabus) {
        const syl = reIdSyllabus(data.syllabus);
        updateState("syllabi", { ...state.syllabi, [syl.id]: syl });
        showToast(`"${syl.label}" imported!`);
        return;
      }
      if (data.type === "qa-tracker-syllabi-bundle" && Array.isArray(data.syllabi)) {
        const added = {};
        data.syllabi.forEach((s) => {
          const syl = reIdSyllabus(s);
          added[syl.id] = syl;
        });
        updateState("syllabi", { ...state.syllabi, ...added });
        showToast(`${data.syllabi.length} syllabus(es) imported!`);
        return;
      }
      showToast("Invalid file — expected a qa-tracker-syllabus export.", true);
    });
  };

  const deleteSyllabus = (id) => {
    const next = { ...state.syllabi };
    delete next[id];
    updateState("syllabi", next);
    showToast("Syllabus deleted.");
  };

  const createSyllabus = () => {
    if (!newForm.label.trim()) return;
    const id = "syl-" + Date.now();
    const syl = {
      id,
      label: newForm.label.trim(),
      icon:  newForm.icon.trim() || "📝",
      color: newForm.color,
      sections: [],
    };
    updateState("syllabi", { ...state.syllabi, [id]: syl });
    setNewForm({ label: "", icon: "📝", color: "#2563eb" });
    setShowNewForm(false);
    showToast(`"${syl.label}" created!`);
  };

  return (
    <div style={{ maxWidth: 860 }}>
      {/* Header */}
      <div className="st-dash-header">
        <div className="st-dash-header-row">
          <div>
            <h1 className="st-dash-title">Syllabus Manager</h1>
            <p className="st-dash-subtitle">Create, edit, and organise your study syllabi</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="st-action-btn st-import-btn" onClick={importSyllabus} title="Import a syllabus from a .json file">⬆ Import</button>
            <button className="st-action-btn st-export-btn" onClick={exportAll} title="Export all syllabi to a single .json file">⬇ Export All</button>
            <button className="st-new-syl-btn" onClick={() => setShowNewForm((v) => !v)}>+ New Syllabus</button>
          </div>
        </div>
      </div>

      {/* Tips banner */}
      <div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 10, padding: "11px 14px", marginBottom: 14, display: "flex", gap: 10 }}>
        <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>💡</span>
        <div style={{ fontSize: "0.8rem", color: "#78350f", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
          <div><strong>Import:</strong> accepts <code style={{ background: "#fef3c7", padding: "1px 5px", borderRadius: 4, fontSize: "0.74rem", color: "#92400e" }}>qa-tracker-syllabus</code> (single) or <code style={{ background: "#fef3c7", padding: "1px 5px", borderRadius: 4, fontSize: "0.74rem", color: "#92400e" }}>qa-tracker-syllabi-bundle</code> (multiple) JSON files. Use <strong>Export All</strong> to download the bundle format.</div>
          <div style={{ marginTop: 4 }}><strong>Arrange:</strong> drag the <span style={{ fontWeight: 700, letterSpacing: 1 }}>⠿</span> handle on any card to reorder your syllabi however you like — the order is saved automatically.</div>
        </div>
      </div>

      {/* New syllabus form */}
      {showNewForm && (
        <div style={{ background: "#fff", border: "2px dashed #c7d2fe", borderRadius: 14, padding: 20, marginBottom: 14 }}>
          <h3 className="st-chart-title" style={{ marginBottom: 14 }}>New Syllabus</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 2, minWidth: 140 }}>
              <span className="st-notes-label">Name</span>
              <input className="st-notes-input" style={{ minHeight: "unset", padding: "7px 10px" }} placeholder="e.g. SDET Roadmap" value={newForm.label} onChange={(e) => setNewForm((f) => ({ ...f, label: e.target.value }))} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 80 }}>
              <span className="st-notes-label">Icon</span>
              <input className="st-notes-input" style={{ minHeight: "unset", padding: "7px 10px", textAlign: "center", fontSize: "1.2rem" }} maxLength={4} value={newForm.icon} onChange={(e) => setNewForm((f) => ({ ...f, icon: e.target.value }))} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span className="st-notes-label">Color</span>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {COLORS.map((c) => (
                  <div key={c} onClick={() => setNewForm((f) => ({ ...f, color: c }))} style={{ width: 24, height: 24, borderRadius: 6, background: c, cursor: "pointer", border: newForm.color === c ? "3px solid #1f2937" : "2px solid transparent" }} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="st-new-syl-btn" onClick={createSyllabus}>Create</button>
            <button className="st-syl-mgr-btn" onClick={() => setShowNewForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Syllabi list */}
      {Object.keys(state.syllabi).length === 0 && (
        <div className="st-syl-mgr-empty">No syllabi yet. Create one above!</div>
      )}

      <SyllabusList
        state={state}
        updateState={updateState}
        exportSyllabus={exportSyllabus}
        deleteSyllabus={deleteSyllabus}
        showToast={showToast}
      />
    </div>
  );
}

// ── Drag-and-drop ordered list ────────────────────────────────────────────────
function SyllabusList({ state, updateState, exportSyllabus, deleteSyllabus, showToast }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const sylList = Object.values(state.syllabi);

  const reorder = (fromIdx, toIdx) => {
    if (fromIdx === toIdx) return;
    const list = [...sylList];
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    const reordered = {};
    list.forEach((s) => { reordered[s.id] = s; });
    updateState("syllabi", reordered);
  };

  return (
    <div>
      {sylList.map((syl, idx) => (
        <div
          key={syl.id}
          draggable
          onDragStart={() => setDragIdx(idx)}
          onDragOver={(e) => { e.preventDefault(); setOverIdx(idx); }}
          onDrop={() => { reorder(dragIdx, idx); setDragIdx(null); setOverIdx(null); }}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          className={`st-syl-drag-wrap${overIdx === idx && dragIdx !== idx ? (dragIdx < idx ? " drop-below" : " drop-above") : ""}${dragIdx === idx ? " dragging" : ""}`}
        >
          <SyllabusCard
            syl={syl}
            stats={getSyllabusStats(state.syllabi, state.progress, syl.id)}
            state={state}
            updateState={updateState}
            onExport={() => exportSyllabus(syl)}
            onDelete={() => deleteSyllabus(syl.id)}
            showToast={showToast}
          />
        </div>
      ))}
    </div>
  );
}

function SyllabusCard({ syl, stats, state, updateState, onExport, onDelete, showToast }) {
  const [expanded, setExpanded] = useState(false);
  const [editMeta, setEditMeta] = useState({ label: syl.label, icon: syl.icon, color: syl.color });
  const [newSecTitle, setNewSecTitle] = useState("");

  const saveMeta = () => {
    const next = { ...state.syllabi, [syl.id]: { ...syl, label: editMeta.label.trim() || syl.label, icon: editMeta.icon.trim() || syl.icon, color: editMeta.color } };
    updateState("syllabi", next);
    showToast("Saved!");
  };

  const addSection = () => {
    if (!newSecTitle.trim()) return;
    const sec = { id: `${syl.id}-s${Date.now()}`, title: newSecTitle.trim(), topics: [] };
    const next = { ...state.syllabi, [syl.id]: { ...syl, sections: [...syl.sections, sec] } };
    updateState("syllabi", next);
    setNewSecTitle("");
  };

  const deleteSection = (secId) => {
    const next = { ...state.syllabi, [syl.id]: { ...syl, sections: syl.sections.filter((s) => s.id !== secId) } };
    updateState("syllabi", next);
  };

  const addTopic = (secId, title) => {
    if (!title.trim()) return;
    const topic = { id: `t-${syl.id}-${Date.now()}`, title: title.trim(), subtopics: [], resources: [] };
    const newSections = syl.sections.map((s) => s.id === secId ? { ...s, topics: [...s.topics, topic] } : s);
    updateState("syllabi", { ...state.syllabi, [syl.id]: { ...syl, sections: newSections } });
  };

  const deleteTopic = (secId, topicId) => {
    const newSections = syl.sections.map((s) => s.id === secId ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) } : s);
    updateState("syllabi", { ...state.syllabi, [syl.id]: { ...syl, sections: newSections } });
  };

  return (
    <div className="st-syl-mgr-card">
      {/* Card header */}
      <div className="st-syl-mgr-hdr">
        <span className="st-drag-handle" title="Drag to reorder">⠿</span>
        <span className="st-syl-mgr-icon">{syl.icon}</span>
        <div className="st-syl-mgr-info">
          <div className="st-syl-mgr-name" style={{ color: syl.color }}>{syl.label}</div>
          <div className="st-syl-mgr-meta">{stats.total} topics · {syl.sections.length} sections</div>
        </div>
        <div className="st-syl-mgr-actions">
          <button className="st-syl-mgr-btn" onClick={onExport}>⬇ Export</button>
          <button className="st-syl-mgr-btn" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "✕ Close" : "✏ Edit"}
          </button>
          <button className="st-syl-mgr-btn danger" onClick={onDelete}>🗑 Delete</button>
        </div>
      </div>

      {/* Edit body */}
      {expanded && (
        <div style={{ borderTop: "1px solid #f0f1f4", padding: 18 }}>
          {/* Metadata form */}
          <div style={{ background: "#f8f9fc", border: "1px solid #e9eaed", borderRadius: 10, padding: "13px 15px", marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 2, minWidth: 120 }}>
                <span className="st-notes-label">Name</span>
                <input className="st-notes-input" style={{ minHeight: "unset", padding: "6px 9px" }} value={editMeta.label} onChange={(e) => setEditMeta((m) => ({ ...m, label: e.target.value }))} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 72 }}>
                <span className="st-notes-label">Icon</span>
                <input className="st-notes-input" style={{ minHeight: "unset", padding: "6px 9px", textAlign: "center", fontSize: "1.1rem" }} maxLength={4} value={editMeta.icon} onChange={(e) => setEditMeta((m) => ({ ...m, icon: e.target.value }))} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span className="st-notes-label">Color</span>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {COLORS.map((c) => (
                    <div key={c} onClick={() => setEditMeta((m) => ({ ...m, color: c }))} style={{ width: 22, height: 22, borderRadius: 5, background: c, cursor: "pointer", border: editMeta.color === c ? "3px solid #1f2937" : "2px solid transparent" }} />
                  ))}
                </div>
              </div>
              <button className="st-syl-mgr-btn" style={{ background: "#10b981", color: "#fff", borderColor: "#10b981" }} onClick={saveMeta}>Save</button>
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>Sections</span>
          </div>

          {syl.sections.map((sec) => (
            <SectionEditor
              key={sec.id}
              sec={sec}
              sylColor={syl.color}
              onDeleteSection={() => deleteSection(sec.id)}
              onAddTopic={(title) => addTopic(sec.id, title)}
              onDeleteTopic={(topicId) => deleteTopic(sec.id, topicId)}
            />
          ))}

          {/* Add section */}
          <div style={{ display: "flex", gap: 6, marginTop: 10, paddingTop: 10, borderTop: "1px dashed #e9eaed" }}>
            <input
              className="st-notes-input"
              style={{ minHeight: "unset", padding: "6px 9px", flex: 1 }}
              placeholder="New section title…"
              value={newSecTitle}
              onChange={(e) => setNewSecTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSection()}
            />
            <button className="st-syl-mgr-btn" style={{ background: "#2563eb", color: "#fff", borderColor: "#2563eb" }} onClick={addSection}>+ Add</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionEditor({ sec, sylColor, onDeleteSection, onAddTopic, onDeleteTopic }) {
  const [newTopicTitle, setNewTopicTitle] = useState("");

  return (
    <div style={{ border: "1px solid #e9eaed", borderRadius: 10, marginBottom: 7, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", background: "#f8f9fc", borderBottom: "1px solid #f0f1f4" }}>
        <span style={{ flex: 1, fontSize: "0.86rem", fontWeight: 600, color: "#1f2937", fontFamily: "'DM Sans', sans-serif" }}>{sec.title}</span>
        <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>{sec.topics.length} topics</span>
        <button className="st-syl-mgr-btn danger" style={{ padding: "3px 8px", fontSize: "0.72rem" }} onClick={onDeleteSection}>Delete</button>
      </div>
      <div style={{ padding: "7px 9px 9px" }}>
        {sec.topics.map((t) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 8px", borderRadius: 7, border: "1px solid #f0f1f4", marginBottom: 4, background: "#fafbfc" }}>
            <span style={{ flex: 1, fontSize: "0.82rem", color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>{t.title}</span>
            <button className="st-task-del-btn" onClick={() => onDeleteTopic(t.id)}>×</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 5, marginTop: 5, paddingTop: 6, borderTop: "1px dashed #e9eaed" }}>
          <input
            className="st-notes-input"
            style={{ minHeight: "unset", padding: "5px 8px", flex: 1, fontSize: "0.8rem" }}
            placeholder="New topic title…"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { onAddTopic(newTopicTitle); setNewTopicTitle(""); } }}
          />
          <button
            className="st-syl-mgr-btn"
            style={{ padding: "4px 10px", background: sylColor, color: "#fff", borderColor: sylColor }}
            onClick={() => { onAddTopic(newTopicTitle); setNewTopicTitle(""); }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
