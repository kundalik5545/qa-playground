"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getSyllabusStats, downloadJSON, pickJSONFile } from "@/lib/studyTrackerStorage";

const COLORS = ["#2563eb","#7c3aed","#059669","#dc2626","#f59e0b","#0891b2","#db2777","#ea580c"];

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

  const makeFilename = (label) => {
    const now  = new Date();
    const yyyy = now.getFullYear();
    const mm   = String(now.getMonth() + 1).padStart(2, "0");
    const dd   = String(now.getDate()).padStart(2, "0");
    const uid  = Math.random().toString(36).slice(2, 6);
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `qa-playground-syllabus-${slug}-${yyyy}-${mm}-${dd}-${uid}.json`;
  };

  const exportSyllabus = (syl) => {
    downloadJSON({ version: 1, type: "qa-tracker-syllabus", exportedAt: new Date().toISOString(), syllabus: syl }, makeFilename(syl.label));
    showToast(`"${syl.label}" exported!`);
  };

  const exportAll = () => {
    downloadJSON({ version: 1, type: "qa-tracker-syllabi-bundle", exportedAt: new Date().toISOString(), syllabi: Object.values(state.syllabi) }, makeFilename("all-syllabi"));
    showToast("All syllabi exported!");
  };

  const importSyllabus = () => {
    pickJSONFile((data) => {
      if (data.type === "qa-tracker-syllabus" && data.syllabus) {
        const syl = reIdSyllabus(data.syllabus);
        updateState("syllabi", { ...state.syllabi, [syl.id]: syl });
        showToast(`"${syl.label}" imported!`);
        return;
      }
      if (data.type === "qa-tracker-syllabi-bundle" && Array.isArray(data.syllabi)) {
        const added = {};
        data.syllabi.forEach((s) => { const syl = reIdSyllabus(s); added[syl.id] = syl; });
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
    const id  = "syl-" + Date.now();
    const syl = { id, label: newForm.label.trim(), icon: newForm.icon.trim() || "📝", color: newForm.color, sections: [] };
    updateState("syllabi", { ...state.syllabi, [id]: syl });
    setNewForm({ label: "", icon: "📝", color: "#2563eb" });
    setShowNewForm(false);
    showToast(`"${syl.label}" created!`);
  };

  return (
    <div className="max-w-[860px]">
      {/* Header */}
      <div className="mb-[22px]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-[1.75rem] font-bold tracking-[-0.7px] text-[#111827] m-0">Syllabus Manager</h1>
            <p className="text-gray-500 text-[0.9rem] mt-1 mb-0">Create, edit, and organise your study syllabi</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={importSyllabus} title="Import a syllabus from a .json file">⬆ Import</Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={exportAll} title="Export all syllabi to a single .json file">⬇ Export All</Button>
            <Button size="sm" asChild className="bg-[#eff2ff] text-blue-600 border border-[#c7d2fe] hover:bg-[#e0e7ff]" title="Generate a syllabus using AI">
              <Link href="/study-tracker/ai-syllabus-prompt">✦ AI Prompt</Link>
            </Button>
            <Button size="sm" asChild className="bg-[#f0fdf4] text-green-600 border border-[#bbf7d0] hover:bg-[#dcfce7]" title="Paste AI-generated JSON and download it as a .json file">
              <Link href="/qa-tools/json-to-file">⬇ JSON → File</Link>
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowNewForm((v) => !v)}>+ New Syllabus</Button>
          </div>
        </div>
      </div>

      {/* Tips banner */}
      <div className="bg-[#fffbeb] border border-[#fcd34d] rounded-[10px] px-[14px] py-[11px] mb-[14px] flex gap-[10px]">
        <span className="text-base flex-shrink-0 mt-[1px]">💡</span>
        <div className="text-[0.8rem] text-[#78350f] leading-[1.6]">
          <div><strong>Import:</strong> accepts <code className="bg-[#fef3c7] px-[5px] py-[1px] rounded text-[0.74rem] text-[#92400e]">qa-tracker-syllabus</code> (single) or <code className="bg-[#fef3c7] px-[5px] py-[1px] rounded text-[0.74rem] text-[#92400e]">qa-tracker-syllabi-bundle</code> (multiple) JSON files. Use <strong>Export All</strong> to download the bundle format.</div>
          <div className="mt-1"><strong>Arrange:</strong> drag the <span className="font-bold tracking-[1px]">⠿</span> handle on any card to reorder your syllabi however you like — the order is saved automatically.</div>
        </div>
      </div>

      {/* New syllabus form */}
      {showNewForm && (
        <div className="bg-white border-2 border-dashed border-[#c7d2fe] rounded-[14px] p-5 mb-[14px]">
          <h3 className="text-sm font-semibold text-[#374151] mb-[14px] mt-0">New Syllabus</h3>
          <div className="flex gap-[10px] flex-wrap items-end">
            <div className="flex flex-col gap-1" style={{ flex: 2, minWidth: 140 }}>
              <span className="block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px]">Name</span>
              <input
                className="w-full border border-[#e9eaed] rounded-lg px-[10px] py-[7px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors bg-white"
                placeholder="e.g. SDET Roadmap"
                value={newForm.label}
                onChange={(e) => setNewForm((f) => ({ ...f, label: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1 w-20">
              <span className="block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px]">Icon</span>
              <input
                className="w-full border border-[#e9eaed] rounded-lg px-[10px] py-[7px] font-[inherit] text-[1.2rem] text-center outline-none focus:border-blue-600 transition-colors bg-white"
                maxLength={4}
                value={newForm.icon}
                onChange={(e) => setNewForm((f) => ({ ...f, icon: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px]">Color</span>
              <div className="flex gap-[5px] flex-wrap">
                {COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => setNewForm((f) => ({ ...f, color: c }))}
                    className="w-6 h-6 rounded-[6px] cursor-pointer transition-all"
                    style={{ background: c, border: newForm.color === c ? "3px solid #1f2937" : "2px solid transparent" }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-[14px]">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={createSyllabus}>Create</Button>
            <Button size="sm" variant="outline" onClick={() => setShowNewForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {Object.keys(state.syllabi).length === 0 && (
        <div className="bg-white border-2 border-dashed border-[#e9eaed] rounded-[14px] p-9 text-center text-gray-400 text-[0.88rem]">
          No syllabi yet. Create one above!
        </div>
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
          className={cn("relative transition-all duration-150", dragIdx === idx && "opacity-45 scale-[0.98]")}
        >
          {/* Drop-above indicator */}
          {overIdx === idx && dragIdx !== null && dragIdx > idx && (
            <div className="h-[3px] rounded-full bg-blue-600 mx-1 mb-1" />
          )}
          <SyllabusCard
            syl={syl}
            stats={getSyllabusStats(state.syllabi, state.progress, syl.id)}
            state={state}
            updateState={updateState}
            onExport={() => exportSyllabus(syl)}
            onDelete={() => deleteSyllabus(syl.id)}
            showToast={showToast}
          />
          {/* Drop-below indicator */}
          {overIdx === idx && dragIdx !== null && dragIdx < idx && (
            <div className="h-[3px] rounded-full bg-blue-600 mx-1 mt-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function SyllabusCard({ syl, stats, state, updateState, onExport, onDelete, showToast }) {
  const [expanded, setExpanded]     = useState(false);
  const [editMeta, setEditMeta]     = useState({ label: syl.label, icon: syl.icon, color: syl.color });
  const [newSecTitle, setNewSecTitle] = useState("");

  const saveMeta = () => {
    const next = { ...state.syllabi, [syl.id]: { ...syl, label: editMeta.label.trim() || syl.label, icon: editMeta.icon.trim() || syl.icon, color: editMeta.color } };
    updateState("syllabi", next);
    showToast("Saved!");
  };

  const addSection = () => {
    if (!newSecTitle.trim()) return;
    const sec  = { id: `${syl.id}-s${Date.now()}`, title: newSecTitle.trim(), topics: [] };
    const next = { ...state.syllabi, [syl.id]: { ...syl, sections: [...syl.sections, sec] } };
    updateState("syllabi", next);
    setNewSecTitle("");
  };

  const deleteSection = (secId) => {
    updateState("syllabi", { ...state.syllabi, [syl.id]: { ...syl, sections: syl.sections.filter((s) => s.id !== secId) } });
  };

  const addTopic = (secId, title) => {
    if (!title.trim()) return;
    const topic      = { id: `t-${syl.id}-${Date.now()}`, title: title.trim(), subtopics: [], resources: [] };
    const newSections = syl.sections.map((s) => s.id === secId ? { ...s, topics: [...s.topics, topic] } : s);
    updateState("syllabi", { ...state.syllabi, [syl.id]: { ...syl, sections: newSections } });
  };

  const deleteTopic = (secId, topicId) => {
    const newSections = syl.sections.map((s) => s.id === secId ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) } : s);
    updateState("syllabi", { ...state.syllabi, [syl.id]: { ...syl, sections: newSections } });
  };

  const mgr = "border border-[#e9eaed] bg-white rounded-[7px] px-[10px] py-[5px] font-[inherit] text-[0.76rem] font-semibold text-gray-500 cursor-pointer transition-all hover:bg-gray-100 hover:text-[#374151] whitespace-nowrap";
  const mgrDanger = cn(mgr, "hover:bg-red-50 hover:text-red-600 hover:border-red-300");

  return (
    <div className="bg-white border border-[#e9eaed] rounded-[14px] mb-[10px] overflow-hidden transition-shadow hover:shadow-[0_4px_18px_rgba(0,0,0,0.06)]">
      {/* Card header */}
      <div className="flex items-center gap-[11px] px-[18px] py-[15px]">
        <span className="text-[1.1rem] text-gray-300 cursor-grab px-[2px] flex-shrink-0 select-none hover:text-gray-500 transition-colors leading-none active:cursor-grabbing">⠿</span>
        <span className="text-[1.4rem] flex-shrink-0">{syl.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[0.97rem] font-bold" style={{ color: syl.color }}>{syl.label}</div>
          <div className="text-[0.76rem] text-gray-400 mt-[2px]">{stats.total} topics · {syl.sections.length} sections</div>
        </div>
        <div className="flex gap-[5px] flex-shrink-0 flex-wrap">
          <button className={mgr} onClick={onExport}>⬇ Export</button>
          <button className={mgr} onClick={() => setExpanded((v) => !v)}>{expanded ? "✕ Close" : "✏ Edit"}</button>
          <button className={mgrDanger} onClick={onDelete}>🗑 Delete</button>
        </div>
      </div>

      {/* Edit body */}
      {expanded && (
        <div className="border-t border-[#f0f1f4] p-[18px]">
          {/* Metadata form */}
          <div className="bg-[#f8f9fc] border border-[#e9eaed] rounded-[10px] px-[15px] py-[13px] mb-[18px]">
            <div className="flex gap-[10px] flex-wrap items-end">
              <div className="flex flex-col gap-1" style={{ flex: 2, minWidth: 120 }}>
                <span className="block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px]">Name</span>
                <input
                  className="w-full border border-[#e9eaed] rounded-lg px-[9px] py-[6px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors bg-white"
                  value={editMeta.label}
                  onChange={(e) => setEditMeta((m) => ({ ...m, label: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1 w-[72px]">
                <span className="block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px]">Icon</span>
                <input
                  className="w-full border border-[#e9eaed] rounded-lg px-[9px] py-[6px] font-[inherit] text-[1.1rem] text-center outline-none focus:border-blue-600 transition-colors bg-white"
                  maxLength={4}
                  value={editMeta.icon}
                  onChange={(e) => setEditMeta((m) => ({ ...m, icon: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="block text-[0.72rem] font-semibold text-gray-500 uppercase tracking-[0.5px]">Color</span>
                <div className="flex gap-1 flex-wrap">
                  {COLORS.map((c) => (
                    <div
                      key={c}
                      onClick={() => setEditMeta((m) => ({ ...m, color: c }))}
                      className="w-[22px] h-[22px] rounded-[5px] cursor-pointer transition-all"
                      style={{ background: c, border: editMeta.color === c ? "3px solid #1f2937" : "2px solid transparent" }}
                    />
                  ))}
                </div>
              </div>
              <button
                className="border border-green-500 bg-green-500 text-white rounded-[7px] px-[10px] py-[5px] font-[inherit] text-[0.76rem] font-semibold cursor-pointer hover:bg-green-600 transition-all whitespace-nowrap"
                onClick={saveMeta}
              >
                Save
              </button>
            </div>
          </div>

          {/* Sections */}
          <div className="flex items-center justify-between mb-[9px]">
            <span className="text-[0.82rem] font-semibold text-[#374151]">Sections</span>
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
          <div className="flex gap-[6px] mt-[10px] pt-[10px] border-t border-dashed border-[#e9eaed]">
            <input
              className="flex-1 border border-[#e9eaed] rounded-lg px-[9px] py-[6px] font-[inherit] text-[0.82rem] text-[#374151] outline-none focus:border-blue-600 transition-colors bg-white"
              placeholder="New section title…"
              value={newSecTitle}
              onChange={(e) => setNewSecTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSection()}
            />
            <button
              className="border border-blue-600 bg-blue-600 text-white rounded-[7px] px-[10px] py-[5px] font-[inherit] text-[0.76rem] font-semibold cursor-pointer hover:bg-blue-700 transition-all whitespace-nowrap"
              onClick={addSection}
            >
              + Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionEditor({ sec, sylColor, onDeleteSection, onAddTopic, onDeleteTopic }) {
  const [newTopicTitle, setNewTopicTitle] = useState("");

  return (
    <div className="border border-[#e9eaed] rounded-[10px] mb-[7px] overflow-hidden">
      <div className="flex items-center gap-[9px] px-[11px] py-2 bg-[#f8f9fc] border-b border-[#f0f1f4]">
        <span className="flex-1 text-[0.86rem] font-semibold text-[#1f2937]">{sec.title}</span>
        <span className="text-[0.72rem] text-gray-400 font-mono">{sec.topics.length} topics</span>
        <button
          className="border border-[#e9eaed] bg-white rounded-[7px] px-2 py-[3px] font-[inherit] text-[0.72rem] font-semibold text-gray-500 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
          onClick={onDeleteSection}
        >
          Delete
        </button>
      </div>
      <div className="px-[9px] pt-[7px] pb-[9px]">
        {sec.topics.map((t) => (
          <div key={t.id} className="flex items-center gap-[7px] px-2 py-[5px] rounded-[7px] border border-[#f0f1f4] mb-1 bg-[#fafbfc]">
            <span className="flex-1 text-[0.82rem] text-[#374151]">{t.title}</span>
            <button
              className="bg-transparent border-none cursor-pointer text-gray-300 text-base leading-none px-[2px] hover:text-red-500 transition-colors flex-shrink-0"
              onClick={() => onDeleteTopic(t.id)}
            >
              ×
            </button>
          </div>
        ))}
        <div className="flex gap-[5px] mt-[5px] pt-[6px] border-t border-dashed border-[#e9eaed]">
          <input
            className="flex-1 border border-[#e9eaed] rounded-[7px] px-2 py-[5px] font-[inherit] text-[0.8rem] text-[#374151] outline-none focus:border-blue-600 transition-colors bg-white"
            placeholder="New topic title…"
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { onAddTopic(newTopicTitle); setNewTopicTitle(""); } }}
          />
          <button
            className="border-none rounded-[7px] px-[10px] py-1 font-[inherit] text-[0.76rem] font-semibold text-white cursor-pointer hover:opacity-[0.88] transition-opacity whitespace-nowrap"
            style={{ background: sylColor, borderColor: sylColor }}
            onClick={() => { onAddTopic(newTopicTitle); setNewTopicTitle(""); }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
