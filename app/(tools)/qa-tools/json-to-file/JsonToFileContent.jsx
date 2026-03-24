"use client";

import { useState, useCallback } from "react";

// Sub-components
import PageBreadcrumb from "./_components/PageBreadcrumb";
import PasteEditor from "./_components/PasteEditor";
import JsonStatusBar from "./_components/JsonStatusBar";
import FilenameDownload from "./_components/FilenameDownload";
import SuccessBanner from "./_components/SuccessBanner";
import HowItWorksSection from "./_components/HowItWorksSection";
import RelatedToolsBar from "./_components/RelatedToolsBar";

// ─── Utilities ────────────────────────────────────────────────────────────────

/**
 * Parses raw AI output that may start with a "FILENAME: foo.json" prefix.
 * Returns the detected filename, raw JSON text, parsed object, and any error.
 */
function parseAiOutput(raw) {
  const trimmed = raw.trim();
  let filename = "";
  let jsonText = trimmed;

  const filenameMatch = trimmed.match(/^FILENAME:\s*(.+\.json)/i);
  if (filenameMatch) {
    filename = filenameMatch[1].trim();
    jsonText = trimmed.slice(filenameMatch[0].length).trim();
  }

  let parsed = null;
  let error = "";
  try {
    parsed = JSON.parse(jsonText);
  } catch (e) {
    error = e.message;
  }

  // Fallback: derive filename from syllabus id
  if (!filename && parsed?.syllabus?.id) {
    filename = `${parsed.syllabus.id}.json`;
  }

  return { filename, jsonText, parsed, error };
}

/**
 * Triggers a browser file download for the given JSON content.
 */
function downloadFile(content, filename) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JsonToFileContent() {
  const [raw, setRaw] = useState("");
  const [customFilename, setCustomFilename] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  // Derived state from parsed output
  const { filename: detectedFilename, parsed, error } = parseAiOutput(raw);
  const effectiveFilename =
    customFilename.trim() || detectedFilename || "syllabus.json";
  const isValid = !!parsed && !error;
  const isEmpty = raw.trim() === "";

  // Syllabus stats (only available when JSON is valid and matches expected shape)
  const sections = parsed?.syllabus?.sections?.length ?? 0;
  const topics =
    parsed?.syllabus?.sections?.reduce(
      (acc, s) => acc + (s.topics?.length ?? 0),
      0,
    ) ?? 0;

  // Strip .json suffix from display value so the ".json" suffix tag stays visible
  const displayFilename = customFilename.replace(/\.json$/i, "");

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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-16">

        {/* ── Breadcrumb ── */}
        <PageBreadcrumb />

        {/* ── Page hero ── */}
        <div className="mb-8">
          {/* Category badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
              Converter
            </span>
            <span className="text-xs font-bold uppercase tracking-wide bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full">
              Paste → Download
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2.5 leading-tight text-slate-900">
            JSON to Downloadable File
          </h1>

          <p className="text-slate-500 leading-relaxed">
            Paste the AI-generated output here. The filename is auto-detected
            from the{" "}
            <code className="bg-slate-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">
              FILENAME:
            </code>{" "}
            prefix — then download your{" "}
            <code className="bg-slate-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">
              .json
            </code>{" "}
            file ready to import into the Study Tracker.
          </p>
        </div>

        {/* ── Paste area ── */}
        <div className="mb-5">
          <PasteEditor
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setDownloaded(false);
            }}
            onClear={handleClear}
          />
        </div>

        {/* ── JSON validation status (only shown when content is present) ── */}
        {!isEmpty && (
          <JsonStatusBar
            isValid={isValid}
            error={error}
            parsed={parsed}
            sections={sections}
            topics={topics}
          />
        )}

        {/* ── Filename input + Download button ── */}
        <FilenameDownload
          displayFilename={displayFilename}
          onFilenameChange={(e) => setCustomFilename(e.target.value)}
          detectedFilename={detectedFilename}
          customFilename={customFilename}
          isValid={isValid}
          downloaded={downloaded}
          onDownload={handleDownload}
        />

        {/* ── Post-download success banner ── */}
        {downloaded && <SuccessBanner />}

        {/* ── How it works steps ── */}
        <HowItWorksSection />

        {/* ── Related tool CTA ── */}
        <RelatedToolsBar />
      </div>
    </div>
  );
}
