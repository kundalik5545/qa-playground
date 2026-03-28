"use client";

import { CheckCircle2, XCircle, FileJson, LayoutList, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JsonStatusBar({ isValid, error, parsed, sections, topics }) {
  return (
    <div
      className={cn(
        "rounded-xl px-4 py-3.5 flex items-center gap-2.5 flex-wrap border",
        isValid
          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
          : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
      )}
    >
      {isValid ? (
        <>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Valid JSON
          </span>

          {parsed?.syllabus?.label && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-700">
              <FileJson className="w-3.5 h-3.5" />
              {parsed.syllabus.icon} {parsed.syllabus.label}
            </span>
          )}

          {sections > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
              <LayoutList className="w-3.5 h-3.5" />
              {sections} sections
            </span>
          )}

          {topics > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
              <Hash className="w-3.5 h-3.5" />
              {topics} topics
            </span>
          )}
        </>
      ) : (
        <>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full border border-red-200 dark:border-red-700">
            <XCircle className="w-3.5 h-3.5" />
            Invalid JSON
          </span>
          <span className="text-xs text-red-500 dark:text-red-400 font-mono break-all">
            {error}
          </span>
        </>
      )}
    </div>
  );
}
