"use client";

import Link from "next/link";

export default function NavBtn({ href, label, icon, pathname, badge, badgeStyle }) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <li>
      <Link href={href} className={`st-nav-btn${active ? " active" : ""}`}>
        <span className="st-nav-icon">{icon}</span>
        <span className="st-nav-label">{label}</span>
        {badge && (
          <span className="st-nav-badge" style={badgeStyle}>
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}
