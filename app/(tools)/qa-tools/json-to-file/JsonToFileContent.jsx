"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

function parseAiOutput(raw) {
  const trimmed = raw.trim();
  let filename = "";
  let jsonText = trimmed;

  // Detect FILENAME: <name>.json on the first line
  const filenameMatch = trimmed.match(/^FILENAME:\s*(.+\.json)/i);
  if (filenameMatch) {
    filename = filenameMatch[1].trim();
    jsonText = trimmed.slice(filenameMatch[0].length).trim();
  }

  // Validate JSON
  let parsed = null;
  let error = "";
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    error = e.message;
  }

  // Auto-derive filename from syllabus id if not provided
  if (!filename && parsed?.syllabus?.id) {
    filename = `${parsed.syllabus.id}.json`;
  }

  return { filename, jsonText, parsed, error };
}

function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function JsonToFileContent() {
  const [raw, setRaw] = useState("");
  const [customFilename, setCustomFilename] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  const { filename: detectedFilename, jsonText, parsed, error } = parseAiOutput(raw);

  const effectiveFilename = customFilename.trim() || detectedFilename || "syllabus.json";
  const isValid = !!parsed && !error;
  const isEmpty = raw.trim() === "";

  const handleDownload = useCallback(() => {
    if (!isValid) return;
    const pretty = JSON.stringify(parsed, null, 2);
    downloadFile(pretty, effectiveFilename);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  }, [isValid, parsed, effectiveFilename]);

  const handleClear = () => {
    setRaw("");
    setCustomFilename("");
    setDownloaded(false);
  };

  // Status badge
  let statusBadge = null;
  if (!isEmpty) {
    if (isValid) {
      const sections = parsed?.syllabus?.sections?.length ?? 0;
      const topics = parsed?.syllabus?.sections?.reduce((acc, s) => acc + (s.topics?.length ?? 0), 0) ?? 0;
      statusBadge = (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={badge("#f0fdf4", "#059669")}>✓ Valid JSON</span>
          {parsed?.syllabus?.label && (
            <span style={badge("#eff2ff", "#2563eb")}>
              {parsed.syllabus.icon} {parsed.syllabus.label}
            </span>
          )}
          <span style={badge("#f8f9fc", "#6b7280")}>{sections} sections · {topics} topics</span>
        </div>
      );
    } else {
      statusBadge = (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={badge("#fef2f2", "#dc2626")}>✗ Invalid JSON</span>
          <span style={{ fontSize: "0.75rem", color: "#dc2626", fontFamily: "'DM Mono', monospace" }}>
            {error}
          </span>
        </div>
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        background: "#f8f9fc",
        fontFamily: "'DM Sans', sans-serif",
        color: "#1a1d23",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 28 }}>
          <NavLink href="/qa-tools">← QA Tools</NavLink>
          <span style={{ color: "#d1d5db", fontSize: "0.82rem" }}>/</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1a1d23" }}>JSON → File</span>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={badge("#eff2ff", "#2563eb")}>Converter</span>
            <span style={badge("#fefce8", "#ca8a04")}>Paste → Download</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: "0 0 10px", lineHeight: 1.2 }}>
            JSON to Downloadable File
          </h1>
          <p style={{ fontSize: "1rem", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            Paste the AI-generated output here. The filename is auto-detected from the{" "}
            <code style={inlineCode()}>FILENAME:</code> prefix — then download your{" "}
            <code style={inlineCode()}>.json</code> file ready to import into the Study Tracker.
          </p>
        </div>

        {/* ── Paste area ── */}
        <div
          style={{
            background: "#1e1e2e",
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid #2d2d3e",
            marginBottom: 20,
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              background: "#16162a",
              borderBottom: "1px solid #2d2d3e",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontFamily: "'DM Mono', monospace" }}>
              Paste AI output here
            </span>
            {!isEmpty && (
              <button
                onClick={handleClear}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  border: "1px solid #3d3d4e",
                  background: "transparent",
                  color: "#9ca3af",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Clear
              </button>
            )}
          </div>

          <textarea
            value={raw}
            onChange={(e) => { setRaw(e.target.value); setDownloaded(false); }}
            placeholder={`Paste the AI output here. Example:\n\nFILENAME: playwright.json\n{\n  "version": 1,\n  "type": "qa-tracker-syllabus",\n  ...\n}`}
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: 320,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              lineHeight: 1.7,
              padding: "18px 20px",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* ── Status ── */}
        {!isEmpty && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e9eaed",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 16,
            }}
          >
            {statusBadge}
          </div>
        )}

        {/* ── Filename + Download row ── */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e9eaed",
            borderRadius: 12,
            padding: "18px 20px",
            display: "flex",
            gap: 12,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {/* Filename field */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: 6,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              File Name
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                value={customFilename}
                onChange={(e) => setCustomFilename(e.target.value)}
                placeholder={detectedFilename || "syllabus.json"}
                style={{
                  flex: 1,
                  border: "1px solid #e9eaed",
                  borderRadius: "7px 0 0 7px",
                  padding: "8px 12px",
                  fontSize: "0.84rem",
                  fontFamily: "'DM Mono', monospace",
                  color: "#1a1d23",
                  background: "#f8f9fc",
                  outline: "none",
                }}
              />
              <span
                style={{
                  padding: "8px 12px",
                  background: "#f3f4f6",
                  border: "1px solid #e9eaed",
                  borderLeft: "none",
                  borderRadius: "0 7px 7px 0",
                  fontSize: "0.78rem",
                  color: "#9ca3af",
                  fontFamily: "'DM Mono', monospace",
                  whiteSpace: "nowrap",
                }}
              >
                {effectiveFilename.endsWith(".json") ? "" : ".json"}
              </span>
            </div>
            {detectedFilename && !customFilename && (
              <div style={{ fontSize: "0.72rem", color: "#059669", marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>
                ✓ Auto-detected from FILENAME: prefix
              </div>
            )}
          </div>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={!isValid}
            style={{
              padding: "9px 24px",
              borderRadius: 8,
              border: "none",
              background: downloaded ? "#059669" : isValid ? "#2563eb" : "#e5e7eb",
              color: isValid ? "#fff" : "#9ca3af",
              fontSize: "0.88rem",
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              cursor: isValid ? "pointer" : "not-allowed",
              transition: "background 0.15s",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 7,
              height: 38,
            }}
          >
            {downloaded ? "✓ Downloaded!" : "⬇ Download .json"}
          </button>
        </div>

        {/* ── Next step hint ── */}
        {downloaded && (
          <div
            style={{
              marginTop: 16,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 10,
              padding: "13px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={{ fontSize: "0.84rem", color: "#166534", fontWeight: 500 }}>
              File downloaded! Now import it into the Study Tracker.
            </span>
            <Link
              href="/study-tracker"
              style={{
                padding: "7px 16px",
                borderRadius: 7,
                background: "#059669",
                color: "#fff",
                fontSize: "0.8rem",
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Go to Syllabus Manager →
            </Link>
          </div>
        )}

        {/* ── How it works ── */}
        <div style={{ marginTop: 36 }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 12px" }}>How it works</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e9eaed",
                  borderRadius: 10,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#eff2ff",
                    color: "#2563eb",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "#1f2937", marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.55 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Related ── */}
        <div
          style={{
            marginTop: 36,
            background: "#fff",
            border: "1px solid #e9eaed",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span style={{ fontSize: "0.84rem", color: "#6b7280" }}>
            Need to generate a syllabus first?
          </span>
          <Link
            href="/study-tracker/ai-syllabus-prompt"
            style={{
              padding: "7px 16px",
              borderRadius: 7,
              background: "#eff2ff",
              color: "#2563eb",
              border: "1px solid #c7d2fe",
              fontSize: "0.8rem",
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ✦ Get AI Prompt →
          </Link>
        </div>

      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function badge(bg, color) {
  return {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    background: bg,
    color,
    padding: "3px 9px",
    borderRadius: 20,
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: "nowrap",
  };
}

function inlineCode() {
  return {
    background: "#f3f4f6",
    padding: "1px 5px",
    borderRadius: 4,
    fontSize: "0.88rem",
    color: "#dc2626",
    fontFamily: "'DM Mono', monospace",
  };
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "#6b7280",
        textDecoration: "none",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
    >
      {children}
    </Link>
  );
}

const HOW_IT_WORKS = [
  {
    title: "Get the AI output",
    desc: 'Use the AI Prompt page to generate a syllabus. The AI will respond with a "FILENAME: ..." line followed by JSON.',
  },
  {
    title: "Paste it here",
    desc: "Copy the entire AI response and paste it into the text area above — FILENAME line and all.",
  },
  {
    title: "Filename auto-detected",
    desc: "The FILENAME prefix is parsed automatically. You can also override the filename manually.",
  },
  {
    title: "Download & import",
    desc: 'Click "Download .json", then import the file via Syllabus Manager → Import.',
  },
];
