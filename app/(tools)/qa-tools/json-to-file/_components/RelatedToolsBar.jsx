"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function RelatedToolsBar() {
  return (
    <div className="bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 dark:from-blue-600/20 dark:via-violet-600/20 dark:to-blue-600/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground mb-0.5">
          Need to generate a syllabus first?
        </p>
        <p className="text-xs text-muted-foreground">
          Use the AI Prompt helper to get a ready-to-paste JSON output.
        </p>
      </div>
      <Link
        href="/study-tracker/ai-syllabus-prompt"
        prefetch={false}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline flex-shrink-0 shadow-sm shadow-blue-500/20"
      >
        <Sparkles className="w-4 h-4" />
        Get AI Prompt
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
