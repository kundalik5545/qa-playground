"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumb navigation shown at the top of the JSON → File page.
 */
export default function PageBreadcrumb() {
  return (
    <nav className="flex items-center gap-1 mb-7 text-sm">
      <Link
        href="/qa-tools"
        className="font-semibold text-slate-500 hover:text-blue-600 transition-colors"
      >
        QA Tools
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
      <span className="font-semibold text-slate-800">JSON → File</span>
    </nav>
  );
}
