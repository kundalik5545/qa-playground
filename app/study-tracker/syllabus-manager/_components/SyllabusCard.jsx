"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { GripVertical, Download, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { countTopics } from "@/lib/syllabusManagerDb";
import EditSyllabusPanel from "./EditSyllabusPanel";

export default function SyllabusCard({
  syllabus,
  progressPct,
  isEditing,
  onToggleEdit,
  onSave,
  onExport,
  onDelete,
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: syllabus.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const topicCount = countTopics(syllabus);
  const sectionCount = syllabus.sections.length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-card transition-shadow",
        isDragging && "shadow-lg opacity-80 z-50",
      )}
    >
      {/* ── Card header row ── */}
      <div className="flex items-center gap-3 px-5 py-4">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none shrink-0"
          tabIndex={-1}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Icon + label (colored) */}
        <span className="text-xl leading-none shrink-0">{syllabus.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold text-base leading-tight truncate"
              style={{ color: syllabus.color }}
            >
              {syllabus.label}
            </span>
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded-full shrink-0"
              style={{
                color: syllabus.color,
                backgroundColor: `${syllabus.color}18`,
              }}
            >
              {progressPct ?? 0}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {topicCount} topic{topicCount !== 1 ? "s" : ""} &middot;{" "}
            {sectionCount} section{sectionCount !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1 text-xs"
            onClick={() => onExport(syllabus)}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <Button
            size="sm"
            variant={isEditing ? "secondary" : "ghost"}
            className="h-8 gap-1 text-xs"
            onClick={() => onToggleEdit(syllabus.id)}
          >
            {isEditing ? (
              <>
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Close</span>
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(syllabus.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* ── Inline edit panel ── */}
      {isEditing && (
        <EditSyllabusPanel
          syllabus={syllabus}
          onSave={onSave}
          onClose={() => onToggleEdit(syllabus.id)}
        />
      )}
    </div>
  );
}
