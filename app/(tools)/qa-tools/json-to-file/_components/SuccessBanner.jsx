"use client";

import Link from "next/link";
import { PartyPopper, ArrowRight } from "lucide-react";

export default function SuccessBanner() {
  return (
    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
          <PartyPopper className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            File downloaded successfully!
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
            Now head to the Syllabus Manager to import it into your tracker.
          </p>
        </div>
      </div>
      <Link
        href="/study-tracker/syllabus"
        prefetch={false}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors no-underline flex-shrink-0 shadow-sm shadow-emerald-500/20"
      >
        Open Syllabus Manager
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
