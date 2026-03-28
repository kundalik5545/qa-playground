"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function PageBreadcrumb() {
  return (
    <nav className="flex items-center gap-1 mb-6 text-sm">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-border flex-shrink-0" />
      <Link
        href="/qa-tools"
        className="text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        QA Tools
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-border flex-shrink-0" />
      <span className="font-semibold text-foreground">JSON → File</span>
    </nav>
  );
}
