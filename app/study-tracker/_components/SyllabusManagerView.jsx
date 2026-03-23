"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  downloadJSON,
  pickJSONFile,
  getSyllabusStats,
} from "@/lib/studyTrackerStorage";
import { FolderOpen, Sparkles, Trash2, Copy, Plus, X } from "lucide-react";

const PRESET_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#f59e0b",
  "#0891b2",
  "#db2777",
  "#ea580c",
];

const makeFilename = (label) => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const id4 = Math.random().toString(36).slice(2, 6);
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `qa-playground-syllabus-${slug}-${yyyy}-${mm}-${dd}-${id4}.json`;
};

function reIdSyllabus(syl) {
  const base = `syl-${Date.now()}-${Math.random().toString(36).slice(2, 4)}`;
  const next = { ...syl, id: base };
  next.sections = (syl.sections || []).map((sec, i) => ({
    ...sec,
    id: `${base}-s${i}-${Date.now()}`,
    topics: (sec.topics || []).map((topic, j) => ({
      ...topic,
      id: `${base}-s${i}-t${j}-${Date.now()}`,
      subtopics: Array.isArray(topic.subtopics) ? topic.subtopics : [],
      resources: Array.isArray(topic.resources) ? topic.resources : [],
    })),
  }));
  return next;
}

function SortableSyllabusCard({
  syl,
  stats,
  onExport,
  onDelete,
  onToggleEdit,
  active,
  listeners,
  attributes,
  setNodeRef,
  style,
}) {
  return (
    <Card ref={setNodeRef} className="border" style={style}>
      <CardHeader className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="text-slate-400 hover:text-slate-700"
          >
            ⠿
          </button>
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: syl.color }}
          />
          <div>
            <div className="font-semibold">
              {syl.icon} {syl.label}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total} topics • {syl.sections.length} sections
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => onExport(syl)}>
            <FolderOpen size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleEdit(syl.id)}
          >
            {active === syl.id ? <X size={14} /> : <Plus size={14} />}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(syl.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export default function SyllabusManagerView({ state, updateState, showToast }) {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [form, setForm] = useState({
    label: "",
    icon: "📝",
    color: PRESET_COLORS[0],
  });
  const [activeEditor, setActiveEditor] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);

  const syllabusOrder =
    state?.syllabusOrder || Object.keys(state?.syllabi || {});
  const syllabiList = useMemo(
    () =>
      syllabusOrder
        .filter((id) => state.syllabi[id])
        .map((id) => state.syllabi[id]),
    [state.syllabi, syllabusOrder],
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = syllabusOrder.indexOf(active.id);
    const newIndex = syllabusOrder.indexOf(over.id);
    const nextOrder = arrayMove(syllabusOrder, oldIndex, newIndex);
    updateState("syllabusOrder", nextOrder);
    showToast("Syllabus order updated.");
  };

  const createSyllabus = () => {
    const label = form.label.trim();
    if (!label) {
      showToast("Please enter a syllabus name", true);
      return;
    }
    const id = `syl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newSyl = {
      id,
      label,
      icon: form.icon || "📝",
      color: form.color,
      sections: [],
    };
    updateState("syllabi", { ...state.syllabi, [id]: newSyl });
    updateState("syllabusOrder", [...syllabusOrder, id]);
    setForm({ label: "", icon: "📝", color: PRESET_COLORS[0] });
    setIsNewOpen(false);
    showToast(`Created syllabus ${label}`);
  };

  const importSyllabus = () => {
    pickJSONFile((data) => {
      if (!data || !data.type || !data.syllabus) {
        showToast("Invalid syllabus JSON", true);
        return;
      }
      const syl = reIdSyllabus(data.syllabus);
      updateState("syllabi", { ...state.syllabi, [syl.id]: syl });
      updateState("syllabusOrder", [...syllabusOrder, syl.id]);
      showToast(`Imported syllabus ${syl.label}`);
    });
  };

  const exportAll = () => {
    const payload = {
      version: 1,
      type: "qa-tracker-syllabi-bundle",
      exportedAt: new Date().toISOString(),
      syllabi: syllabiList,
    };
    downloadJSON(payload, makeFilename("all-syllabi"));
    showToast("Exported all syllabi.");
  };

  const exportSingle = (syl) => {
    const payload = {
      version: 1,
      type: "qa-tracker-syllabus",
      exportedAt: new Date().toISOString(),
      syllabus: syl,
    };
    downloadJSON(payload, makeFilename(syl.label));
    showToast(`Exported ${syl.label}`);
  };

  const deleteSyllabus = (id) => {
    const next = { ...state.syllabi };
    delete next[id];
    const order = syllabusOrder.filter((sid) => sid !== id);
    updateState("syllabi", next);
    updateState("syllabusOrder", order);
    if (activeEditor === id) setActiveEditor(null);
    showToast("Syllabus deleted.");
  };

  const promptText = `Generate QA syllabus JSON using qa-tracker-syllabus schema...`;

  const copyPrompt = () => {
    navigator.clipboard
      .writeText(promptText)
      .then(() => showToast("Prompt copied to clipboard."));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <CardTitle>Syllabus Manager</CardTitle>
            <p className="text-sm text-muted-foreground">
              Build your QA syllabi and reorder them for the left menu.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setIsNewOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              New Syllabus
            </Button>
            <Button variant="outline" onClick={importSyllabus}>
              <FolderOpen className="mr-1 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" onClick={exportAll}>
              <Trash2 className="mr-1 h-4 w-4" />
              Export All
            </Button>
            <Button variant="ghost" onClick={() => setAiOpen(true)}>
              <Sparkles className="mr-1 h-4 w-4" />
              AI Prompt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Drag the handle to reorder syllabi. Order persists and appears in
            the sidebar.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={syllabusOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {syllabiList.map((syl) => {
                  const stats = getSyllabusStats(
                    state.syllabi,
                    state.progress,
                    syl.id,
                  );
                  return (
                    <SortableItem key={syl.id} id={syl.id}>
                      <SortableSyllabusCard
                        syl={syl}
                        stats={stats}
                        onExport={exportSingle}
                        onDelete={deleteSyllabus}
                        onToggleEdit={(id) =>
                          setActiveEditor((prev) => (prev === id ? null : id))
                        }
                        active={activeEditor}
                      />
                    </SortableItem>
                  );
                })}
                {syllabiList.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No syllabi yet.
                  </p>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Syllabus</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Create a new syllabus entry.
            </p>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="syl-title">Title</Label>
                <Input
                  id="syl-title"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  placeholder="Manual Testing"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="syl-icon">Icon</Label>
                <Input
                  id="syl-icon"
                  value={form.icon}
                  maxLength={4}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-8 w-8 rounded-full border ${form.color === color ? "border-black" : "border-transparent"}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setForm({ ...form, color })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsNewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createSyllabus}>
              <Plus className="mr-1 h-4 w-4" />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Prompt</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Copy this prompt into your AI tool (ChatGPT, Claude, Gemini).
            </p>
          </DialogHeader>
          <div className="space-y-2">
            <textarea
              readOnly
              className="w-full h-56 rounded-md border p-3 text-sm"
              value={promptText}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={copyPrompt}>
                <Copy className="mr-1 h-4 w-4" />
                Copy
              </Button>
              <Button onClick={() => setAiOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableItem({ id, children }) {
  const { setNodeRef, transform, transition, listeners, attributes } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
