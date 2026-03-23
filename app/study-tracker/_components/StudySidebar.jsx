"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  loadSyllabiFromIdb,
  saveSyllabiToIdb,
  getDefaultSyllabi,
  getDefaultOrder,
  calcProgress,
} from "@/lib/syllabusManagerDb";
import { getIdbItem } from "@/lib/indexedDb";

const navItems = [
  { label: "Dashboard", href: "/study-tracker", icon: LayoutDashboard },
  {
    label: "Daily Tracker",
    href: "/study-tracker/daily-tracker",
    icon: CalendarDays,
  },
  {
    label: "Syllabus Manager",
    href: "/study-tracker/syllabus-manager",
    icon: BookOpen,
  },
];

export default function StudySidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const [syllabiList, setSyllabiList] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  const reloadSyllabi = useCallback(async () => {
    const [{ syllabi, order }, studyState] = await Promise.all([
      loadSyllabiFromIdb(),
      getIdbItem("study-tracker-state"),
    ]);
    setProgressMap(studyState?.progress || {});
    if (syllabi && Object.keys(syllabi).length > 0) {
      const orderedIds =
        Array.isArray(order) && order.length > 0
          ? order
          : Object.keys(syllabi);
      setSyllabiList(
        orderedIds.filter((id) => syllabi[id]).map((id) => syllabi[id]),
      );
    } else {
      const defaults = getDefaultSyllabi();
      const defaultOrder = getDefaultOrder();
      await saveSyllabiToIdb(defaults, defaultOrder);
      setSyllabiList(defaultOrder.map((id) => defaults[id]));
    }
  }, []);

  useEffect(() => {
    reloadSyllabi();
    window.addEventListener("syllabi-updated", reloadSyllabi);
    return () => window.removeEventListener("syllabi-updated", reloadSyllabi);
  }, [reloadSyllabi]);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] border-r border-border bg-background flex flex-col z-40 transition-all duration-300",
          collapsed ? "w-14" : "w-64",
        )}
      >
        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-4 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>

        {/* Main nav */}
        <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <NavItem
                key={href}
                label={label}
                href={href}
                icon={Icon}
                isActive={isActive}
                collapsed={collapsed}
              />
            );
          })}

          {/* Syllabi section label */}
          {!collapsed && (
            <p className="mt-4 mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Syllabi
            </p>
          )}
          {collapsed && (
            <div className="mt-3 mb-1 mx-auto h-px w-6 bg-border" />
          )}

          {syllabiList.map((syl) => {
            const href = `/study-tracker/syllabus/${syl.id}`;
            const isActive = pathname === href;
            return (
              <SyllabusItem
                key={syl.id}
                label={syl.label}
                href={href}
                emoji={syl.icon}
                color={syl.color}
                progressPct={calcProgress(syl, progressMap)}
                isActive={isActive}
                collapsed={collapsed}
              />
            );
          })}
        </nav>

        {/* User avatar */}
        <div className="border-t border-border p-2">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-slate-700 text-white text-xs font-bold">
                      N
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">My Profile</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2 px-1">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-slate-700 text-white text-xs font-bold">
                  N
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground truncate">
                My Profile
              </span>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

function NavItem({ label, href, icon: Icon, isActive, collapsed }) {
  const link = (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
        collapsed ? "justify-center px-2" : "gap-3 px-3",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "")}
      />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

function SyllabusItem({ label, href, emoji, color, progressPct, isActive, collapsed }) {
  const link = (
    <Link
      href={href}
      className={cn(
        "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
        collapsed ? "justify-center px-2" : "gap-3 px-3",
        isActive
          ? "bg-primary/10"
          : "hover:bg-muted",
      )}
    >
      <span
        className="h-4 w-4 shrink-0 flex items-center justify-center text-sm leading-none"
      >
        {emoji}
      </span>
      {!collapsed && (
        <span className="flex-1 truncate font-medium" style={{ color }}>
          {label}
        </span>
      )}
      {!collapsed && (
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
          style={{ color, backgroundColor: `${color}18` }}
        >
          {progressPct ?? 0}%
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}
