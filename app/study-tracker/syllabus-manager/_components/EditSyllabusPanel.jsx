"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { makeSectionId, makeTopicId } from "@/lib/syllabusManagerDb";

const PRESET_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#f59e0b",
  "#0891b2",
  "#db2777",
  "#ea580c",
  "#6366f1",
  "#10b981",
];

export default function EditSyllabusPanel({ syllabus, onSave, onClose }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(syllabus)));
  const [newTopicInputs, setNewTopicInputs] = useState({});

  // ── Meta ──────────────────────────────────────────────────────────────

  const setMeta = (field, value) =>
    setDraft((d) => ({ ...d, [field]: value }));

  // ── Sections ──────────────────────────────────────────────────────────

  const addSection = () => {
    const id = makeSectionId(draft.id, draft.sections.length);
    setDraft((d) => ({
      ...d,
      sections: [...d.sections, { id, title: "New Section", topics: [] }],
    }));
  };

  const updateSectionTitle = (secId, title) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) => (s.id === secId ? { ...s, title } : s)),
    }));
  };

  const deleteSection = (secId) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.filter((s) => s.id !== secId),
    }));
  };

  // ── Topics ────────────────────────────────────────────────────────────

  const addTopic = (secId) => {
    const title = (newTopicInputs[secId] || "").trim();
    if (!title) return;
    setDraft((d) => {
      const secIdx = d.sections.findIndex((s) => s.id === secId);
      const sec = d.sections[secIdx];
      const topicId = makeTopicId(d.id, secIdx, sec.topics.length);
      const updatedSec = {
        ...sec,
        topics: [
          ...sec.topics,
          { id: topicId, title, subtopics: [], resources: [] },
        ],
      };
      const sections = [...d.sections];
      sections[secIdx] = updatedSec;
      return { ...d, sections };
    });
    setNewTopicInputs((prev) => ({ ...prev, [secId]: "" }));
  };

  const deleteTopic = (secId, topicId) => {
    setDraft((d) => ({
      ...d,
      sections: d.sections.map((s) =>
        s.id === secId
          ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
          : s,
      ),
    }));
  };

  const handleSave = () => {
    const label = draft.label.trim();
    if (!label) return;
    onSave({ ...draft, label });
  };

  return (
    <div className="border-t mt-0 bg-muted/30 rounded-b-lg px-5 py-4 space-y-5">
      {/* ── Meta row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Name */}
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor={`sm-edit-name-${draft.id}`}>Name</Label>
          <Input
            id={`sm-edit-name-${draft.id}`}
            value={draft.label}
            onChange={(e) => setMeta("label", e.target.value)}
          />
        </div>

        {/* Icon */}
        <div className="space-y-1.5">
          <Label htmlFor={`sm-edit-icon-${draft.id}`}>Icon</Label>
          <Input
            id={`sm-edit-icon-${draft.id}`}
            value={draft.icon}
            maxLength={4}
            className="w-20 text-xl text-center"
            onChange={(e) => setMeta("icon", e.target.value)}
          />
        </div>

        {/* Color */}
        <div className="space-y-1.5">
          <Label>Colour</Label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                style={{ backgroundColor: color }}
                onClick={() => setMeta("color", color)}
                className={cn(
                  "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                  draft.color === color
                    ? "border-foreground scale-110"
                    : "border-transparent",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Sections ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Sections</h4>
          <Button size="sm" variant="outline" onClick={addSection}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Section
          </Button>
        </div>

        {draft.sections.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No sections yet. Add one above.
          </p>
        )}

        {draft.sections.map((sec) => (
          <div
            key={sec.id}
            className="rounded-md border bg-background p-3 space-y-2"
          >
            {/* Section header */}
            <div className="flex items-center gap-2">
              <Input
                value={sec.title}
                onChange={(e) => updateSectionTitle(sec.id, e.target.value)}
                className="h-8 text-sm font-medium flex-1"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => deleteSection(sec.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Topic count */}
            <p className="text-xs text-muted-foreground">
              {sec.topics.length} topic{sec.topics.length !== 1 ? "s" : ""}
            </p>

            {/* Topics list */}
            {sec.topics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center gap-2 pl-2 group"
              >
                <span className="flex-1 text-sm truncate">{topic.title}</span>
                <button
                  type="button"
                  onClick={() => deleteTopic(sec.id, topic.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {/* Add topic inline */}
            <div className="flex gap-2 pt-1">
              <Input
                placeholder="New topic title..."
                value={newTopicInputs[sec.id] || ""}
                className="h-8 text-sm flex-1"
                onChange={(e) =>
                  setNewTopicInputs((prev) => ({
                    ...prev,
                    [sec.id]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTopic(sec.id);
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => addTopic(sec.id)}
              >
                Add
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="ghost" onClick={onClose}>
          <X className="mr-1 h-4 w-4" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-1 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
