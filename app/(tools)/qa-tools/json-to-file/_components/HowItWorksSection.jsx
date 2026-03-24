"use client";

/**
 * Static "How it works" section — four numbered step cards.
 * Data is co-located here since it only belongs to this section.
 */

const STEPS = [
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

export default function HowItWorksSection() {
  return (
    <div className="mt-10">
      <h2 className="text-base font-bold mb-3 text-slate-800">How it works</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {STEPS.map((step, i) => (
          <StepCard key={i} step={step} index={i} />
        ))}
      </div>
    </div>
  );
}

/** Single numbered step card */
function StepCard({ step, index }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
      {/* Step number badge */}
      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-bold font-mono flex items-center justify-center mb-3">
        {index + 1}
      </div>

      <p className="text-sm font-semibold text-slate-800 mb-1">{step.title}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
    </div>
  );
}
