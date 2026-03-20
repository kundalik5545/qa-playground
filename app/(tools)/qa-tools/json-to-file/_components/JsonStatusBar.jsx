"use client";

import { CheckCircle2, XCircle, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shows the JSON validation result after the user pastes content.
 * - Valid: green badge + syllabus label + sections/topics count
 * - Invalid: red badge + error message
 */
export default function JsonStatusBar({ isValid, error, parsed, sections, topics }) {
  return (
    <div
      className={cn(
        "border rounded-lg px-4 py-3 mb-4 flex items-center gap-2 flex-wrap",
        isValid
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200",
      )}
    >
      {isValid ? (
        <>
          {/* Valid JSON indicator */}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Valid JSON
          </span>

          {/* Syllabus label if available */}
          {parsed?.syllabus?.label && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
              <FileJson className="w-3.5 h-3.5" />
              {parsed.syllabus.icon} {parsed.syllabus.label}
            </span>
          )}

          {/* Sections & topics count */}
          <span className="inline-flex items-center text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
            {sections} sections · {topics} topics
          </span>
        </>
      ) : (
        <>
          {/* Invalid JSON indicator */}
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            Invalid JSON
          </span>

          {/* Error message */}
          <span className="text-xs text-red-500 font-mono">{error}</span>
        </>
      )}
    </div>
  );
}
