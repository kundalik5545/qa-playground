"use client";

import { Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Card row containing:
 * - Filename input (with auto-detected name shown as placeholder)
 * - .json suffix badge
 * - Download button (disabled when JSON is invalid)
 *
 * Props:
 *   displayFilename    — controlled value for the input (without .json)
 *   onFilenameChange   — change handler for the input
 *   detectedFilename   — auto-detected name from FILENAME: prefix
 *   customFilename     — raw user-typed value (used to decide helper text)
 *   isValid            — whether the pasted JSON is valid
 *   downloaded         — whether the file was just downloaded (shows success state)
 *   onDownload         — download handler
 */
export default function FilenameDownload({
  displayFilename,
  onFilenameChange,
  detectedFilename,
  customFilename,
  isValid,
  downloaded,
  onDownload,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex justify-between items-end gap-4 flex-wrap shadow-sm">
      {/* Filename input group */}
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">
          File Name
        </label>

        {/* Input + .json suffix */}
        <div className="flex items-stretch">
          <Input
            value={displayFilename}
            onChange={onFilenameChange}
            placeholder={
              detectedFilename?.replace(/\.json$/i, "") || "syllabus"
            }
            className="flex-1 rounded-r-none border-r-0 font-mono text-sm bg-slate-50 focus-visible:ring-0 focus-visible:border-blue-400"
          />
          <span className="flex items-center px-3 bg-slate-100 border border-slate-200 border-l-0 rounded-r-md text-sm text-slate-400 font-mono whitespace-nowrap">
            .json
          </span>
        </div>

        {/* Auto-detected filename hint */}
        {detectedFilename && !customFilename && (
          <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
            <Check className="w-3 h-3" />
            Auto-detected from FILENAME: prefix
          </p>
        )}
      </div>

      {/* Download button */}
      <Button
        onClick={onDownload}
        disabled={!isValid}
        className={cn(
          "h-10 px-6 font-bold text-sm whitespace-nowrap transition-all gap-2",
          downloaded
            ? "bg-green-600 hover:bg-green-700 text-white"
            : isValid
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed",
        )}
      >
        {downloaded ? (
          <>
            <Check className="w-4 h-4" />
            Downloaded!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download .json
          </>
        )}
      </Button>
    </div>
  );
}
