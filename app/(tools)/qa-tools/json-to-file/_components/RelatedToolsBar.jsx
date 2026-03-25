"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Bottom callout bar that links the user to the AI Prompt generator
 * if they haven't generated a syllabus yet.
 */
export default function RelatedToolsBar() {
  return (
    <div className="mt-9 bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between flex-wrap gap-3 shadow-sm">
      <span className="text-sm text-slate-500">
        Need to generate a syllabus first?
      </span>
      <Link
        href="/study-tracker/ai-syllabus-prompt"
        prefetch={false}
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-sm font-bold transition-colors no-underline"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Get AI Prompt
      </Link>
    </div>
  );
}
