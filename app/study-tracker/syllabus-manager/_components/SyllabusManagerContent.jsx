"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Upload, Download, Plus, Sparkles, Info } from "lucide-react";
import {
  loadSyllabiFromIdb,
  saveSyllabiToIdb,
  getDefaultSyllabi,
  getDefaultOrder,
  reIdSyllabus,
  downloadJson,
  pickJsonFile,
  makeExportFilename,
  makeSyllabusId,
} from "@/lib/syllabusManagerDb";
import SyllabusCard from "./SyllabusCard";
import NewSyllabusDialog from "./NewSyllabusDialog";
import AiPromptDialog from "./AiPromptDialog";

// ── Toast ──────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false, error: false });

  const show = useCallback((msg, isError = false) => {
    setToast({ msg, show: true, error: isError });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  }, []);

  return { toast, show };
}

// ── Main component ─────────────────────────────────────────────────────────

export default function SyllabusManagerContent() {
  const [syllabi, setSyllabi] = useState(null); // { [id]: syllabus }
  const [order, setOrder] = useState(null); // [id, id, ...]
  const [editingId, setEditingId] = useState(null);
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const { toast, show: showToast } = useToast();

  // ── Load on mount (IDB → seed defaults) ───────────────────────────────

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { syllabi: idbSyllabi, order: idbOrder } = await loadSyllabiFromIdb();
      if (cancelled) return;

      if (idbSyllabi && Object.keys(idbSyllabi).length > 0) {
        setSyllabi(idbSyllabi);
        setOrder(
          Array.isArray(idbOrder) && idbOrder.length > 0
            ? idbOrder
            : Object.keys(idbSyllabi),
        );
      } else {
        const defaults = getDefaultSyllabi();
        const defaultOrder = getDefaultOrder();
        setSyllabi(defaults);
        setOrder(defaultOrder);
        await saveSyllabiToIdb(defaults, defaultOrder);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Persist helper ─────────────────────────────────────────────────────

  const persist = useCallback((nextSyllabi, nextOrder) => {
    setSyllabi(nextSyllabi);
    setOrder(nextOrder);
    saveSyllabiToIdb(nextSyllabi, nextOrder);
  }, []);

  // ── Sorted list for rendering ──────────────────────────────────────────

  const syllabiList = useMemo(() => {
    if (!syllabi || !order) return [];
    return order.filter((id) => syllabi[id]).map((id) => syllabi[id]);
  }, [syllabi, order]);

  // ── Drag & drop ────────────────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = order.indexOf(active.id);
    const newIdx = order.indexOf(over.id);
    const nextOrder = arrayMove(order, oldIdx, newIdx);
    persist(syllabi, nextOrder);
    showToast("Order saved.");
  };

  // ── CRUD ───────────────────────────────────────────────────────────────

  const handleCreate = ({ label, icon, color }) => {
    const id = makeSyllabusId();
    const newSyl = { id, label, icon, color, sections: [] };
    const nextSyllabi = { ...syllabi, [id]: newSyl };
    const nextOrder = [...order, id];
    persist(nextSyllabi, nextOrder);
    showToast(`"${label}" created.`);
  };

  const handleSaveEdit = (updated) => {
    const nextSyllabi = { ...syllabi, [updated.id]: updated };
    persist(nextSyllabi, order);
    setEditingId(null);
    showToast(`"${updated.label}" saved.`);
  };

  const handleDelete = (id) => {
    const label = syllabi[id]?.label || "Syllabus";
    const nextSyllabi = { ...syllabi };
    delete nextSyllabi[id];
    const nextOrder = order.filter((sid) => sid !== id);
    persist(nextSyllabi, nextOrder);
    if (editingId === id) setEditingId(null);
    showToast(`"${label}" deleted.`);
  };

  // ── Export ─────────────────────────────────────────────────────────────

  const handleExportSingle = (syl) => {
    downloadJson(
      {
        version: 1,
        type: "qa-tracker-syllabus",
        exportedAt: new Date().toISOString(),
        syllabus: syl,
      },
      makeExportFilename(syl.label),
    );
    showToast(`Exported "${syl.label}".`);
  };

  const handleExportAll = () => {
    downloadJson(
      {
        version: 1,
        type: "qa-tracker-syllabi-bundle",
        exportedAt: new Date().toISOString(),
        syllabi: syllabiList,
      },
      makeExportFilename("all-syllabi"),
    );
    showToast("All syllabi exported.");
  };

  // ── Import ─────────────────────────────────────────────────────────────

  const handleImport = () => {
    pickJsonFile(
      (data) => {
        if (!data || !data.type) {
          showToast("Unrecognised file format.", true);
          return;
        }

        let incoming = [];

        if (data.type === "qa-tracker-syllabus" && data.syllabus) {
          incoming = [reIdSyllabus(data.syllabus)];
        } else if (
          data.type === "qa-tracker-syllabi-bundle" &&
          Array.isArray(data.syllabi)
        ) {
          incoming = data.syllabi.map(reIdSyllabus);
        } else {
          showToast("Unrecognised file format.", true);
          return;
        }

        const nextSyllabi = { ...syllabi };
        const nextOrder = [...order];
        incoming.forEach((syl) => {
          nextSyllabi[syl.id] = syl;
          nextOrder.push(syl.id);
        });
        persist(nextSyllabi, nextOrder);
        showToast(`Imported ${incoming.length} syllabus${incoming.length > 1 ? "i" : ""}.`);
      },
      (err) => showToast(err, true),
    );
  };

  // ── Toggle edit ────────────────────────────────────────────────────────

  const handleToggleEdit = (id) =>
    setEditingId((prev) => (prev === id ? null : id));

  // ── Loading ────────────────────────────────────────────────────────────

  if (!syllabi) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
        Loading syllabi...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Syllabus Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and organise your study syllabi
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="mr-1.5 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="mr-1.5 h-4 w-4" />
            Export All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAiDialogOpen(true)}
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            AI Prompt
          </Button>
          <Button size="sm" onClick={() => setNewDialogOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Syllabus
          </Button>
        </div>
      </div>

      {/* ── Info banner ── */}
      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3 text-sm">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="text-amber-800 dark:text-amber-300 space-y-1">
          <p>
            <strong>Import</strong> accepts{" "}
            <code className="rounded bg-amber-100 dark:bg-amber-900 px-1 text-xs">
              qa-tracker-syllabus
            </code>{" "}
            (single) or{" "}
            <code className="rounded bg-amber-100 dark:bg-amber-900 px-1 text-xs">
              qa-tracker-syllabi-bundle
            </code>{" "}
            (multiple) JSON files. Use <strong>Export All</strong> to download
            the bundle format.
          </p>
          <p>
            <strong>Arrange:</strong> drag the{" "}
            <GripIcon /> handle on any card to reorder — order is saved
            automatically.
          </p>
        </div>
      </div>

      {/* ── Syllabus list ── */}
      {syllabiList.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">
            No syllabi yet. Create one or import a JSON file.
          </p>
          <Button
            size="sm"
            className="mt-4"
            onClick={() => setNewDialogOpen(true)}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Syllabus
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {syllabiList.map((syl) => (
                <SyllabusCard
                  key={syl.id}
                  syllabus={syl}
                  isEditing={editingId === syl.id}
                  onToggleEdit={handleToggleEdit}
                  onSave={handleSaveEdit}
                  onExport={handleExportSingle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* ── Dialogs ── */}
      <NewSyllabusDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
        onCreate={handleCreate}
      />
      <AiPromptDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
      />

      {/* ── Toast ── */}
      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg transition-all ${
            toast.error
              ? "bg-destructive text-destructive-foreground"
              : "bg-foreground text-background"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function GripIcon() {
  return (
    <svg
      className="inline h-3.5 w-3.5 mx-0.5 align-middle text-amber-600 dark:text-amber-400"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <circle cx="5" cy="4" r="1.2" />
      <circle cx="5" cy="8" r="1.2" />
      <circle cx="5" cy="12" r="1.2" />
      <circle cx="11" cy="4" r="1.2" />
      <circle cx="11" cy="8" r="1.2" />
      <circle cx="11" cy="12" r="1.2" />
    </svg>
  );
}
