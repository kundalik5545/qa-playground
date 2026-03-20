"use client";

import { X } from "lucide-react";

const PLACEHOLDER = `Paste the AI output here. Example:\n\nFILENAME: playwright.json\n{\n  "version": 1,\n  "type": "qa-tracker-syllabus",\n  ...\n}`;

/**
 * Dark-themed code editor textarea where the user pastes AI-generated JSON output.
 * Shows a Clear button when content is present.
 */
export default function PasteEditor({ value, onChange, onClear }) {
  const isEmpty = value.trim() === "";

  return (
    <div className="rounded-xl overflow-hidden border border-[#2d2d3e] bg-[#1e1e2e] shadow-md">
      {/* Editor header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#16162a] border-b border-[#2d2d3e]">
        {/* Traffic-light dots for aesthetic */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57] opacity-70" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e] opacity-70" />
          <span className="w-3 h-3 rounded-full bg-[#28c840] opacity-70" />
          <span className="ml-3 text-xs text-slate-400 font-mono">
            Paste AI output here
          </span>
        </div>

        {/* Clear button — only visible when there's content */}
        {!isEmpty && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 border border-[#3d3d4e] hover:border-slate-500 px-2.5 py-1 rounded-md transition-colors bg-transparent cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        rows={12}
        className="w-full min-h-72 bg-transparent border-none outline-none text-slate-200 font-mono text-xs leading-relaxed p-5 resize-y block placeholder:text-slate-600"
      />
    </div>
  );
}
