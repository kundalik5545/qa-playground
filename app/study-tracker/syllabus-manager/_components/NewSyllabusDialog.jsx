"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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

const EMPTY_FORM = { label: "", icon: "📝", color: PRESET_COLORS[0] };

export default function NewSyllabusDialog({ open, onOpenChange, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const handleCreate = () => {
    const label = form.label.trim();
    if (!label) {
      setError("Please enter a syllabus name.");
      return;
    }
    onCreate({ label, icon: form.icon || "📝", color: form.color });
    setForm(EMPTY_FORM);
    setError("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Syllabus</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Give it a name, icon, and colour to get started.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="sm-new-name">Name</Label>
            <Input
              id="sm-new-name"
              placeholder="e.g. Cypress Automation"
              value={form.label}
              onChange={(e) => {
                setForm((f) => ({ ...f, label: e.target.value }));
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Icon */}
          <div className="space-y-1.5">
            <Label htmlFor="sm-new-icon">Icon (emoji)</Label>
            <Input
              id="sm-new-icon"
              placeholder="📝"
              maxLength={4}
              className="w-24 text-xl text-center"
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
            />
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <Label>Colour</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  style={{ backgroundColor: color }}
                  onClick={() => setForm((f) => ({ ...f, color }))}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                    form.color === color
                      ? "border-foreground scale-110"
                      : "border-transparent",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-1 h-4 w-4" />
            Create Syllabus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
