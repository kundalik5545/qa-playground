"use client";

import { Sparkles, ClipboardPaste, Wand2, FolderDown } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200 dark:border-violet-800",
    num: "01",
    title: "Get the AI output",
    desc: 'Use the AI Prompt page to generate a syllabus. The AI will respond with a "FILENAME: ..." line followed by JSON.',
  },
  {
    icon: ClipboardPaste,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    num: "02",
    title: "Paste it here",
    desc: "Copy the entire AI response — FILENAME line and all — and paste it into the editor above.",
  },
  {
    icon: Wand2,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800",
    num: "03",
    title: "Filename auto-detected",
    desc: "The FILENAME prefix is parsed automatically. Override the filename manually if needed.",
  },
  {
    icon: FolderDown,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    num: "04",
    title: "Download & import",
    desc: 'Click "Download .json", then import the file in Syllabus Manager → Import.',
  },
];

export default function HowItWorksSection() {
  return (
    <div className="mt-10">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
          Simple Workflow
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          How It Works
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map(({ icon: Icon, color, bg, border, num, title, desc }) => (
          <div
            key={num}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Step number watermark */}
            <span className="absolute top-3 right-4 text-4xl font-black text-muted/20 font-mono select-none group-hover:text-muted/30 transition-colors">
              {num}
            </span>

            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}
            >
              <Icon className={`w-5 h-5 ${color}`} />
            </div>

            <p className="text-sm font-semibold text-foreground mb-1.5">
              {title}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
