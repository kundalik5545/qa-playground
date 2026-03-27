"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function StudyTrackerShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) setCollapsed(true);
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f8f9fc] text-[#1a1d23] text-[15px] overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 min-w-0 h-full overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#d1d5db] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#9ca3af]">
        <div className="px-7 py-[26px]">{children}</div>
      </div>
    </div>
  );
}
