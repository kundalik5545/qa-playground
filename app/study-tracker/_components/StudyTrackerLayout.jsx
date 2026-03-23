"use client";

import { useState } from "react";
import StudySidebar from "./StudySidebar";

export default function StudyTrackerLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex w-full py-10">
      <StudySidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />
      <main className="flex-1 overflow-auto transition-all duration-300 ml-0">
        <div className="p-6 container mx-auto">{children}</div>
      </main>
    </div>
  );
}
