"use client";

import { useState, useCallback } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sub-components
import PageBreadcrumb from "./_components/PageBreadcrumb";
import PasteEditor from "./_components/PasteEditor";
import JsonStatusBar from "./_components/JsonStatusBar";
import FilenameDownload from "./_components/FilenameDownload";
import SuccessBanner from "./_components/SuccessBanner";
import HowItWorksSection from "./_components/HowItWorksSection";
import RelatedToolsBar from "./_components/RelatedToolsBar";

// ─── Utilities ────────────────────────────────────────────────────────────────

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

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "What is the FILENAME: prefix and do I need it?",
    a: 'The FILENAME: prefix is a convention used by the QA Playground AI Prompt page. When you ask the AI to generate a syllabus, it responds with "FILENAME: your-syllabus.json" on the first line, followed by the JSON. This tool auto-detects that line and uses it as the download filename. If your JSON doesn\'t have it, you can type a filename manually — the tool works either way.',
  },
  {
    q: "Can I paste any JSON here, or only AI-generated syllabi?",
    a: "You can paste any valid JSON. The filename auto-detection and syllabus stats (sections, topics count) only activate if the JSON matches the QA Study Tracker syllabus format — but the download itself works for any valid JSON you paste.",
  },
  {
    q: "Why is my JSON showing as invalid?",
    a: "The most common cause is a truncated AI response — the model stopped before finishing the JSON. Try regenerating the output with a longer max-token limit, or copy-paste the AI output more carefully to make sure nothing is cut off. The error message shown below the editor points to the exact line and character causing the issue.",
  },
  {
    q: "Does this tool send my data anywhere?",
    a: "No. Everything happens 100% in your browser. The JSON you paste is never sent to any server — parsing, validation, and file download are all client-side JavaScript operations. Nothing leaves your device.",
  },
  {
    q: "What do I do with the downloaded .json file?",
    a: "Go to QA Playground → Study Tracker → Syllabus Manager → Import. Choose the downloaded file and it will load your syllabus complete with all sections and topics. You can then start tracking progress against it.",
  },
  {
    q: "Can I rename the file before downloading?",
    a: "Yes. The filename input (above the Download button) is fully editable. The auto-detected name from the FILENAME: prefix is used as the default, but you can type any name you want. The .json extension is always appended automatically.",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function JsonToFileContent() {
  const [raw, setRaw] = useState("");
  const [customFilename, setCustomFilename] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  const { filename: detectedFilename, parsed, error } = parseAiOutput(raw);
  const effectiveFilename =
    customFilename.trim() || detectedFilename || "syllabus.json";
  const isValid = !!parsed && !error;
  const isEmpty = raw.trim() === "";

  const sections = parsed?.syllabus?.sections?.length ?? 0;
  const topics =
    parsed?.syllabus?.sections?.reduce(
      (acc, s) => acc + (s.topics?.length ?? 0),
      0
    ) ?? 0;

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
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-border">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-10">
          <PageBreadcrumb />

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
              ✦ AI-Ready
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800 px-3 py-1 rounded-full">
              Paste → Download
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
              100% Client-Side
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            <span className="gradient-title">JSON to File</span>
            <span className="block text-foreground text-2xl sm:text-3xl font-bold mt-1">
              Converter
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Paste AI-generated syllabus JSON. The filename is auto-detected from
            the{" "}
            <code className="bg-muted text-orange-500 dark:text-orange-400 px-1.5 py-0.5 rounded text-sm font-mono">
              FILENAME:
            </code>{" "}
            prefix — then download your{" "}
            <code className="bg-muted text-orange-500 dark:text-orange-400 px-1.5 py-0.5 rounded text-sm font-mono">
              .json
            </code>{" "}
            file ready to import into the Study Tracker.
          </p>
        </div>
      </div>

      {/* ── Main tool area ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-6 space-y-4">
        {/* Paste area */}
        <PasteEditor
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value);
            setDownloaded(false);
          }}
          onClear={handleClear}
        />

        {/* JSON validation status */}
        {!isEmpty && (
          <JsonStatusBar
            isValid={isValid}
            error={error}
            parsed={parsed}
            sections={sections}
            topics={topics}
          />
        )}

        {/* Filename + Download */}
        <FilenameDownload
          displayFilename={displayFilename}
          onFilenameChange={(e) => setCustomFilename(e.target.value)}
          detectedFilename={detectedFilename}
          customFilename={customFilename}
          isValid={isValid}
          downloaded={downloaded}
          onDownload={handleDownload}
        />

        {/* Success banner */}
        {downloaded && <SuccessBanner />}
      </div>

      {/* ── How it works ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
        <HowItWorksSection />
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
        <div className="mt-10">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
              FAQ
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Common Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {FAQ.map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card border border-border rounded-xl px-5 data-[state=open]:border-blue-300 dark:data-[state=open]:border-blue-700 transition-colors"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground text-left hover:no-underline py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* ── Related tools ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <RelatedToolsBar />
      </div>
    </div>
  );
}
