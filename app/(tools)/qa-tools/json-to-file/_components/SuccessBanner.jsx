"use client";

import Link from "next/link";
import { PartyPopper, ArrowRight } from "lucide-react";

/**
 * Shown after the user successfully downloads the JSON file.
 * Prompts them to go to the Study Tracker to import it.
 */
export default function SuccessBanner() {
  return (
    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <PartyPopper className="w-4 h-4 text-green-600 flex-shrink-0" />
        <span className="text-sm text-green-800 font-medium">
          File downloaded! Now import it into the Study Tracker.
        </span>
      </div>
      <Link
        href="/study-tracker/syllabus"
        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors no-underline"
      >
        Go to Syllabus Manager
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
