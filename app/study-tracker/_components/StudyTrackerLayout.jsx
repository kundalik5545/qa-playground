"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import StudySidebar from "./StudySidebar";

export default function StudyTrackerLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex py-16">
      <StudySidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />
      <main
        className={cn(
          "flex-1 min-w-0 transition-all duration-300 man-class",
          collapsed ? "ml-14" : "ml-14 sm:ml-20 md:ml-24 lg:ml-24",
        )}
      >
        {children}
      </main>
    </div>
  );
}
