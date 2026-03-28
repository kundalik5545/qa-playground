"use client";

import { X, ClipboardPaste } from "lucide-react";

const PLACEHOLDER = `Paste the AI output here. Example:\n\nFILENAME: playwright.json\n{\n  "version": 1,\n  "type": "qa-tracker-syllabus",\n  ...\n}`;

export default function PasteEditor({ value, onChange, onClear }) {
  const isEmpty = value.trim() === "";

  return (
    <div className="rounded-2xl overflow-hidden border border-[#2d2d3e] bg-[#1e1e2e] shadow-lg ring-1 ring-blue-500/10">
      {/* Editor header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#16162a] border-b border-[#2d2d3e]">
        <div className="flex items-center gap-2">
          {/* Traffic-light dots */}
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <ClipboardPaste className="w-3.5 h-3.5 opacity-60" />
            ai-output.json
          </span>
        </div>

        {!isEmpty && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-400 border border-[#3d3d4e] hover:border-red-500/50 px-2.5 py-1 rounded-md transition-colors bg-transparent cursor-pointer"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Glow line */}
      <div className="h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-violet-500/0" />

      {/* Textarea */}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        rows={14}
        className="w-full min-h-[280px] sm:min-h-[320px] bg-transparent border-none outline-none text-slate-200 font-mono text-xs sm:text-sm leading-relaxed p-5 resize-y block placeholder:text-slate-600"
      />

      {/* Bottom status */}
      {!isEmpty && (
        <div className="flex items-center justify-end px-4 py-2 border-t border-[#2d2d3e] bg-[#16162a]">
          <span className="text-xs text-slate-500 font-mono">
            {value.length.toLocaleString()} chars
          </span>
        </div>
      )}
    </div>
  );
}
