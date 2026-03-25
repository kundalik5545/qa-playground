"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavBtn({ href, label, icon, pathname, badge, badgeStyle }) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <li className="mb-[1px]">
      <Link
        href={href}
        className={cn(
          "flex items-center gap-[9px] px-[10px] py-[9px] rounded-lg text-sm font-medium transition-all w-full no-underline",
          active
            ? "bg-[#eff2ff] text-blue-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-[#1a1d23]"
        )}
      >
        <span className="text-base flex-shrink-0">{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && (
          <span
            className="text-[0.68rem] font-semibold px-[7px] py-[2px] rounded-full flex-shrink-0 font-mono"
            style={badgeStyle}
          >
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}
