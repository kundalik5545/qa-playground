"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check, Copy, ArrowLeft } from "lucide-react";

const THE_PROMPT = `Generate a study syllabus for the topic: [YOUR TOPIC HERE]

Before the JSON, output exactly one line in this format:
FILENAME: <topic-slug>.json
where <topic-slug> is the lowercase, hyphenated version of the topic name (e.g. "playwright.json", "rest-api-testing.json", "docker-for-qa.json"). This is the file name the user should use when saving the output.

Then output the downloadable valid JSON object only. No explanation, no markdown fences, no extra text — just the downloadable JSON File with FILENAME.

Strictly follow this structure:

{
  "version": 1,
  "type": "qa-tracker-syllabus",
  "exportedAt": "<current ISO timestamp>",
  "syllabus": {
    "id": "<short-lowercase-id>",
    "label": "<Display Name>",
    "icon": "<single emoji>",
    "color": "<hex color code>",
    "sections": [
      {
        "id": "<syllabus-id>-s1",
        "title": "<Section Title>",
        "topics": [
          {
            "id": "<syllabus-id>-t1",
            "title": "<Topic Title>",
            "subtopics": [
              "<Subtopic 1>",
              "<Subtopic 2>",
              "<Subtopic 3>"
            ],
            "resources": []
          }
        ]
      }
    ]
  }
}

Rules to follow strictly:
1. "version" must always be 1.
2. "type" must always be exactly "qa-tracker-syllabus".
3. "exportedAt" must be a valid ISO 8601 timestamp (e.g. "2026-03-20T10:00:00.000Z").
4. "id" inside "syllabus" must be a short, lowercase, hyphenated string (e.g. "cypress", "rest-api", "java-basics").
5. Section IDs must follow the pattern: "<syllabus-id>-s1", "<syllabus-id>-s2", etc.
6. Topic IDs must follow the pattern: "<syllabus-id>-t1", "<syllabus-id>-t2", etc. (numbered sequentially across all sections, not resetting per section).
7. Each topic must have 2–5 subtopics as plain strings.
8. "resources" must always be an empty array [].
9. Organize topics into 3–5 logical sections (e.g. Fundamentals, Core Features, Advanced, CI/CD, Best Practices).
10. Each section should have 2–5 topics.
11. Choose a relevant emoji for the icon.
12. Choose a fitting hex color (avoid #ffffff and #000000).
13. Output must be valid JSON — no trailing commas, no comments.
14. Always begin your response with a FILENAME line (e.g. "FILENAME: playwright.json") before the JSON. The filename must be the topic slug with a .json extension — this is what the user will save the file as.`;

const EXAMPLE_JSON = `{
  "version": 1,
  "type": "qa-tracker-syllabus",
  "exportedAt": "2026-03-20T07:01:01.793Z",
  "syllabus": {
    "id": "playwright",
    "label": "Playwright",
    "icon": "🎭",
    "color": "#dc2626",
    "sections": [
      {
        "id": "pw-s1",
        "title": "Playwright Fundamentals",
        "topics": [
          {
            "id": "pw-t1",
            "title": "Setup & Configuration",
            "subtopics": ["Installation", "playwright.config.ts", "Browsers & Devices"],
            "resources": []
          },
          {
            "id": "pw-t2",
            "title": "Playwright Architecture",
            "subtopics": ["Auto-waiting", "Selectors", "Browser Contexts", "Pages"],
            "resources": []
          }
        ]
      },
      {
        "id": "pw-s2",
        "title": "Core Features",
        "topics": [
          {
            "id": "pw-t3",
            "title": "Actions & Assertions",
            "subtopics": ["click, fill, check", "expect() API", "Soft Assertions"],
            "resources": []
          },
          {
            "id": "pw-t4",
            "title": "Fixtures & Hooks",
            "subtopics": ["Built-in Fixtures", "Custom Fixtures", "beforeAll/afterEach"],
            "resources": []
          },
          {
            "id": "pw-t5",
            "title": "Page Object Model",
            "subtopics": ["POM with Playwright", "Component Objects"],
            "resources": []
          },
          {
            "id": "pw-t6",
            "title": "Network Interception",
            "subtopics": ["route.fulfill()", "Mocking APIs", "Request Logging"],
            "resources": []
          }
        ]
      },
      {
        "id": "pw-s3",
        "title": "Advanced Playwright",
        "topics": [
          {
            "id": "pw-t7",
            "title": "Visual Testing",
            "subtopics": ["Screenshot Comparison", "toHaveScreenshot()", "Threshold Config"],
            "resources": []
          },
          {
            "id": "pw-t8",
            "title": "Tracing & Debugging",
            "subtopics": ["Trace Viewer", "UI Mode", "PWDEBUG"],
            "resources": []
          },
          {
            "id": "pw-t9",
            "title": "Parallel Execution",
            "subtopics": ["Workers Config", "Sharding", "Test Grouping"],
            "resources": []
          },
          {
            "id": "pw-t10",
            "title": "CI/CD with Playwright",
            "subtopics": ["GitHub Actions", "HTML Reporter", "Allure Integration"],
            "resources": []
          }
        ]
      }
    ]
  }
}`;

const STEPS = [
  { num: "1", text: "Copy the prompt above." },
  {
    num: "2",
    text: 'Replace [YOUR TOPIC HERE] with your desired topic (e.g. "Cypress", "REST API Testing with Postman").',
  },
  {
    num: "3",
    text: "Paste it into any AI chat — ChatGPT, Claude, Gemini, or any other.",
  },
  {
    num: "4",
    text: 'Copy the full AI response (the "FILENAME: ..." line + the JSON).',
  },
  {
    num: "5",
    text: "Go to the JSON → File converter (button below), paste it, and click Download.",
  },
  {
    num: "6",
    text: "Open QA Study Tracker → Syllabus Manager → Import — and import your file.",
  },
];

const EXAMPLE_TOPICS = [
  "Cypress automation testing",
  "REST API Testing with Postman",
  "Selenium WebDriver with Java",
  "Docker for QA Engineers",
  "Java programming for beginners",
  "Git and GitHub for testers",
  "Performance Testing with k6",
  "SQL for QA Engineers",
  "CI/CD with GitHub Actions",
  "Appium Mobile Testing",
];

// ── Inline code chip ──────────────────────────────────────────────────────────
function IC({ children }) {
  return (
    <code className="bg-[#fef3c7] text-amber-700 border border-amber-200 px-[5px] py-[1px] rounded text-[0.74rem] font-mono">
      {children}
    </code>
  );
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: do nothing */
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border text-[0.78rem] font-semibold cursor-pointer transition-all whitespace-nowrap flex-shrink-0",
        copied
          ? "bg-emerald-500 border-emerald-500 text-white"
          : "bg-white border-[#e9eaed] text-[#374151] hover:bg-gray-50 hover:border-gray-300",
      )}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

// ── Light code block ──────────────────────────────────────────────────────────
function CodeBlock({ filename, icon, copyText, children }) {
  return (
    <div className="bg-[#f6f8fa] border border-[#e2e8f0] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          <span className="text-[0.74rem] font-mono font-medium text-gray-500">
            {filename}
          </span>
        </div>
        <CopyButton
          text={copyText}
          label={`Copy${filename ? " " + filename.split(".").pop().toUpperCase() : ""}`}
        />
      </div>
      <pre className="m-0 px-5 py-4 text-[0.88rem] leading-[1.75] text-[#24292e] font-mono overflow-x-auto whitespace-pre-wrap break-words">
        {children}
      </pre>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, hint, children }) {
  return (
    <div className="mb-9">
      <div className="flex items-baseline gap-2 mb-3">
        <h2 className="text-[1.05rem] font-bold text-[#1a1d23] m-0">{title}</h2>
        {hint && (
          <span className="text-[0.74rem] text-gray-400 font-medium">
            — {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Rules data ────────────────────────────────────────────────────────────────
const RULES = [
  <>
    "version" must always be <IC>1</IC>.
  </>,
  <>
    "type" must always be exactly <IC>qa-tracker-syllabus</IC>.
  </>,
  <>
    {"exportedAt"} must be a valid ISO 8601 timestamp (e.g.{" "}
    <IC>2026-03-20T10:00:00.000Z</IC>).
  </>,
  <>
    "id" inside "syllabus" must be a short, lowercase, hyphenated string (e.g.{" "}
    <IC>cypress</IC>, <IC>rest-api</IC>, <IC>java-basics</IC>).
  </>,
  <>
    Section IDs must follow the pattern: <IC>&lt;syllabus-id&gt;-s1</IC>,{" "}
    <IC>&lt;syllabus-id&gt;-s2</IC>, etc.
  </>,
  <>
    Topic IDs must follow the pattern: <IC>&lt;syllabus-id&gt;-t1</IC>,{" "}
    <IC>&lt;syllabus-id&gt;-t2</IC>, etc. Numbered sequentially across all
    sections.
  </>,
  <>
    Each topic must have <strong>2–5 subtopics</strong> as plain strings.
  </>,
  <>
    "resources" must always be an empty array <IC>[]</IC>.
  </>,
  <>
    Organize topics into <strong>3–5 logical sections</strong> (e.g.
    Fundamentals, Core Features, Advanced, CI/CD, Best Practices).
  </>,
  <>
    Each section should have <strong>2–5 topics</strong>.
  </>,
  <>
    Choose a relevant <strong>emoji</strong> for the icon.
  </>,
  <>
    Choose a fitting <strong>hex color</strong> (avoid #ffffff and #000000).
  </>,
  <>
    Output must be <strong>valid JSON</strong> — no trailing commas, no
    comments.
  </>,
  <>
    Always begin the response with a <IC>FILENAME: &lt;topic-slug&gt;.json</IC>{" "}
    line before the JSON (e.g. <IC>FILENAME: playwright.json</IC>). This is the
    name the user saves the file as.
  </>,
];

// ── Prompt renderer with highlighted topic slot ───────────────────────────────
function PromptWithHighlight({ topic }) {
  const placeholder = "[YOUR TOPIC HERE]";
  const idx = THE_PROMPT.indexOf(placeholder);
  const before = THE_PROMPT.slice(0, idx);
  const after = THE_PROMPT.slice(idx + placeholder.length);

  return (
    <>
      {before}
      <mark
        className={cn(
          "rounded px-[3px] not-italic font-semibold",
          topic
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700",
        )}
      >
        {topic || placeholder}
      </mark>
      {after}
    </>
  );
}

export default function PromptPageContent() {
  const [topic, setTopic] = useState("");

  const trimmed = topic.trim();
  const promptText = trimmed
    ? THE_PROMPT.replace("[YOUR TOPIC HERE]", trimmed)
    : THE_PROMPT;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f9fc] text-[#1a1d23]">
      <div className="max-w-[820px] mx-auto px-6 pt-8 pb-16">
        {/* Back link */}
        <Link
          href="/study-tracker/syllabus"
          prefetch={false}
          className="inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-gray-500 no-underline mb-7 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Study Tracker
        </Link>

        {/* Hero */}
        <div className="mb-9">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[0.7rem] font-bold tracking-[0.8px] uppercase bg-[#eff2ff] text-blue-600 px-[10px] py-[3px] rounded-full">
              AI-Powered
            </span>
            <span className="text-[0.7rem] font-bold tracking-[0.8px] uppercase bg-[#f0fdf4] text-emerald-600 px-[10px] py-[3px] rounded-full">
              Works with any AI
            </span>
          </div>
          <h1 className="text-[2rem] font-bold text-[#1a1d23] leading-[1.2] mb-[10px] m-0">
            AI Syllabus Generator Prompt
          </h1>
          <p className="text-base text-gray-500 m-0 leading-relaxed">
            Use this ready-made prompt with ChatGPT, Claude, Gemini, or any AI
            to generate a study syllabus in the exact format the QA Study
            Tracker can import.
          </p>
        </div>

        {/* ── Topic Input ── */}
        <div className="mb-9">
          <div className="bg-white border border-[#e9eaed] rounded-xl px-5 py-5">
            <label className="block text-[0.82rem] font-semibold text-[#374151] mb-[10px]">
              ✦ Enter your topic — it will be placed in the prompt automatically
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder='e.g. "Cypress automation testing" or "Docker for QA Engineers"'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="flex-1 border border-[#e9eaed] rounded-lg px-4 py-[10px] text-sm text-[#1f2937] bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
              {topic && (
                <button
                  onClick={() => setTopic("")}
                  className="px-3 py-[10px] rounded-lg border border-[#e9eaed] bg-white text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors text-sm"
                >
                  Clear
                </button>
              )}
            </div>
            {/* Quick-pick chips */}
            <div className="flex flex-wrap gap-[6px] mt-3">
              {EXAMPLE_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={cn(
                    "text-[0.74rem] font-medium px-[10px] py-[4px] rounded-full border transition-colors cursor-pointer",
                    trimmed === t
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-[#f8f9fc] border-[#e9eaed] text-[#374151] hover:border-blue-300 hover:text-blue-600 hover:bg-[#eff2ff]",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── The Prompt ── */}
        <Section
          title="The Prompt"
          hint={
            trimmed
              ? `Topic set to "${trimmed}"`
              : "Enter a topic above to auto-fill"
          }
        >
          <CodeBlock filename="prompt.txt" copyText={promptText}>
            <PromptWithHighlight topic={trimmed} />
          </CodeBlock>
        </Section>

        {/* ── Rules ── */}
        <Section
          title="JSON Structure Rules"
          hint="The AI must follow all 14 rules exactly"
        >
          <div className="bg-white border border-[#e9eaed] rounded-xl overflow-hidden">
            {RULES.map((rule, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 px-4 py-[11px] items-start",
                  i < RULES.length - 1 && "border-b border-[#f0f1f4]",
                )}
              >
                <span className="min-w-[22px] h-[22px] rounded-full bg-[#eff2ff] text-blue-600 text-[0.68rem] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-[1px]">
                  {i + 1}
                </span>
                <span className="text-[0.84rem] text-[#374151] leading-[1.55]">
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Example Output ── */}
        <Section
          title="Example Output (Playwright)"
          hint="This is what a correctly generated syllabus looks like"
        >
          <CodeBlock
            filename="playwright-syllabus.json"
            icon="🎭"
            copyText={EXAMPLE_JSON}
          >
            {EXAMPLE_JSON}
          </CodeBlock>
        </Section>

        {/* ── How to Use ── */}
        <Section title="How to Use" hint="6 simple steps">
          <div className="bg-white border border-[#e9eaed] rounded-xl overflow-hidden">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-[14px] px-4 py-[13px] items-start",
                  i < STEPS.length - 1 && "border-b border-[#f0f1f4]",
                )}
              >
                <div className="min-w-[28px] h-[28px] rounded-full bg-blue-600 text-white text-[0.75rem] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-[1px]">
                  {step.num}
                </div>
                <span className="text-[0.88rem] text-[#1f2937] leading-[1.6] pt-1">
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-4 flex gap-3 justify-end flex-wrap">
            <Link
              href="/qa-tools/json-to-file"
              prefetch={false}
              className="inline-flex items-center gap-1.5 px-[18px] py-[9px] rounded-lg bg-[#f0fdf4] text-emerald-600 border border-[#bbf7d0] text-[0.84rem] font-semibold no-underline hover:bg-[#dcfce7] transition-colors"
            >
              ⬇ JSON → File Converter
            </Link>
            <Link
              href="/study-tracker/dashboard"
              prefetch={false}
              className="inline-flex items-center gap-1.5 px-[18px] py-[9px] rounded-lg bg-blue-600 text-white text-[0.84rem] font-semibold no-underline hover:bg-blue-700 transition-colors"
            >
              Go to Syllabus Manager →
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
}
