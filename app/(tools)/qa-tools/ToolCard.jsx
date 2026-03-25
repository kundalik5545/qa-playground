"use client";

import Link from "next/link";

export default function ToolCard({ tool }) {
  const isLive = tool.status === "live";

  const cardInner = (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e9eaed",
        borderRadius: 14,
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.18s, transform 0.18s",
        cursor: isLive ? "pointer" : "default",
        opacity: isLive ? 1 : 0.82,
      }}
      onMouseEnter={(e) => {
        if (!isLive) return;
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 4, background: tool.accentColor, flexShrink: 0 }} />

      {/* Body */}
      <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Icon + category row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: tool.iconBg,
              color: tool.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: typeof tool.icon === "string" && tool.icon.length <= 2 ? "1.4rem" : "0.72rem",
              fontWeight: 800,
              fontFamily: "'DM Mono', 'Courier New', monospace",
              letterSpacing: "-0.5px",
              flexShrink: 0,
            }}
          >
            {tool.icon}
          </div>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              background: tool.categoryBg,
              color: tool.categoryColor,
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            {tool.category}
          </span>
        </div>

        {/* Title + description */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1d23", marginBottom: 6, lineHeight: 1.3 }}>
            {tool.label}
          </div>
          <p style={{ fontSize: "0.84rem", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            {tool.description}
          </p>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: 4 }}>
          {isLive ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 16px",
                borderRadius: 8,
                background: tool.accentColor,
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: 700,
              }}
            >
              Open Tool →
            </div>
          ) : (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 8,
                background: "#f3f4f6",
                color: "#9ca3af",
                fontSize: "0.78rem",
                fontWeight: 600,
                border: "1px dashed #d1d5db",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#d1d5db",
                  display: "inline-block",
                }}
              />
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (isLive) {
    return (
      <Link href={tool.href} prefetch={false} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        {cardInner}
      </Link>
    );
  }
  return <div style={{ height: "100%" }}>{cardInner}</div>;
}
