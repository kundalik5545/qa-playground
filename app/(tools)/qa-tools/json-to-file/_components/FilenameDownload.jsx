"use client";

import { Download, Check, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
        {/* Filename input group */}
        <div className="flex-1 min-w-0">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
            Output Filename
          </label>

          <div className="flex items-stretch">
            <Input
              value={displayFilename}
              onChange={onFilenameChange}
              placeholder={
                detectedFilename?.replace(/\.json$/i, "") || "syllabus"
              }
              className="flex-1 rounded-r-none border-r-0 font-mono text-sm bg-background focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-400 h-11"
            />
            <span className="flex items-center px-3 bg-muted border border-border border-l-0 rounded-r-lg text-sm text-muted-foreground font-mono whitespace-nowrap">
              .json
            </span>
          </div>

          {detectedFilename && !customFilename && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1.5">
              <Wand2 className="w-3 h-3" />
              Auto-detected from{" "}
              <code className="font-mono">FILENAME:</code> prefix
            </p>
          )}
        </div>

        {/* Download button */}
        <button
          onClick={onDownload}
          disabled={!isValid}
          className={cn(
            "h-11 px-7 font-bold text-sm whitespace-nowrap rounded-xl transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer",
            downloaded
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
              : isValid
                ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md shadow-blue-500/20"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
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
        </button>
      </div>

      {/* Helper text when invalid */}
      {!isValid && (
        <p className="mt-3 text-xs text-muted-foreground">
          Paste valid JSON above to enable the download button.
        </p>
      )}
    </div>
  );
}
