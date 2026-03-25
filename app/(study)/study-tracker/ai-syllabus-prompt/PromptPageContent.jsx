"use client";

import { useState } from "react";
import Link from "next/link";

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
    text: 'Go to the JSON → File converter (button below), paste it, and click Download.',
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
      style={{
        padding: "6px 14px",
        borderRadius: 7,
        border: "1px solid #e9eaed",
        background: copied ? "#10b981" : "#fff",
        color: copied ? "#fff" : "#374151",
        fontSize: "0.78rem",
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ Copied!" : `⎘ ${label}`}
    </button>
  );
}

export default function PromptPageContent() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        background: "#f8f9fc",
        fontFamily: "'DM Sans', sans-serif",
        color: "#1a1d23",
      }}
    >
      <div
        style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px 60px" }}
      >
        {/* Back link */}
        <Link
          href="/study-tracker/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "#6b7280",
            textDecoration: "none",
            marginBottom: 28,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
        >
          ← Back to Study Tracker
        </Link>

        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                background: "#eff2ff",
                color: "#2563eb",
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              AI-Powered
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                background: "#f0fdf4",
                color: "#059669",
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              Works with any AI
            </span>
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "#1a1d23",
              margin: "0 0 10px",
              lineHeight: 1.2,
            }}
          >
            AI Syllabus Generator Prompt
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Use this ready-made prompt with ChatGPT, Claude, Gemini, or any AI
            to generate a study syllabus in the exact format the QA Study
            Tracker can import.
          </p>
        </div>

        {/* ── The Prompt ── */}
        <Section
          title="The Prompt"
          hint="Replace [YOUR TOPIC HERE] before using"
        >
          <div
            style={{
              background: "#1e1e2e",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #2d2d3e",
            }}
          >
            {/* Code toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "#16162a",
                borderBottom: "1px solid #2d2d3e",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                prompt.txt
              </span>
              <CopyButton text={THE_PROMPT} label="Copy Prompt" />
            </div>
            <pre
              style={{
                margin: 0,
                padding: "18px 20px",
                fontSize: "0.78rem",
                lineHeight: 1.7,
                color: "#e2e8f0",
                fontFamily: "'DM Mono', monospace",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {THE_PROMPT}
            </pre>
          </div>
        </Section>

        {/* ── Rules ── */}
        <Section
          title="JSON Structure Rules"
          hint="The AI must follow all 13 rules exactly"
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e9eaed",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {RULES.map((rule, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "11px 16px",
                  borderBottom:
                    i < RULES.length - 1 ? "1px solid #f0f1f4" : "none",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#eff2ff",
                    color: "#2563eb",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    fontFamily: "'DM Mono', monospace",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    fontSize: "0.84rem",
                    color: "#374151",
                    lineHeight: 1.55,
                  }}
                >
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
          <div
            style={{
              background: "#1e1e2e",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #2d2d3e",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "#16162a",
                borderBottom: "1px solid #2d2d3e",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1rem" }}>🎭</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  playwright-syllabus.json
                </span>
              </div>
              <CopyButton text={EXAMPLE_JSON} label="Copy JSON" />
            </div>
            <pre
              style={{
                margin: 0,
                padding: "18px 20px",
                fontSize: "0.78rem",
                lineHeight: 1.7,
                color: "#e2e8f0",
                fontFamily: "'DM Mono', monospace",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {EXAMPLE_JSON}
            </pre>
          </div>
        </Section>

        {/* ── How to Use ── */}
        <Section title="How to Use" hint="6 simple steps">
          <div
            style={{
              background: "#fff",
              border: "1px solid #e9eaed",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "13px 16px",
                  borderBottom:
                    i < STEPS.length - 1 ? "1px solid #f0f1f4" : "none",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    minWidth: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    fontFamily: "'DM Mono', monospace",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {step.num}
                </div>
                <span
                  style={{
                    fontSize: "0.88rem",
                    color: "#1f2937",
                    lineHeight: 1.6,
                    paddingTop: 4,
                  }}
                >
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ marginTop: 14, display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <Link
              href="/qa-tools/json-to-file"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                borderRadius: 8,
                background: "#f0fdf4",
                color: "#059669",
                border: "1px solid #bbf7d0",
                fontSize: "0.84rem",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#dcfce7")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdf4")}
            >
              ⬇ JSON → File Converter
            </Link>
            <Link
              href="/study-tracker/dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 18px",
                borderRadius: 8,
                background: "#2563eb",
                color: "#fff",
                fontSize: "0.84rem",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
            >
              Go to Syllabus Manager →
            </Link>
          </div>
        </Section>

        {/* ── Try These Topics ── */}
        <Section
          title="Try These Topics"
          hint="Replace [YOUR TOPIC HERE] with any of these"
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EXAMPLE_TOPICS.map((topic) => (
              <span
                key={topic}
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: 20,
                  background: "#fff",
                  border: "1px solid #e9eaed",
                  color: "#374151",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────────
function Section({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <h2
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#1a1d23",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {hint && (
          <span
            style={{ fontSize: "0.74rem", color: "#9ca3af", fontWeight: 500 }}
          >
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
    "version" must always be{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      1
    </code>
    .
  </>,
  <>
    "type" must always be exactly{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      qa-tracker-syllabus
    </code>
    .
  </>,
  <>
    {"exportedAt"} must be a valid ISO 8601 timestamp (e.g.{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      2026-03-20T10:00:00.000Z
    </code>
    ).
  </>,
  <>
    "id" inside "syllabus" must be a short, lowercase, hyphenated string (e.g.{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      cypress
    </code>
    ,{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      rest-api
    </code>
    ,{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      java-basics
    </code>
    ).
  </>,
  <>
    Section IDs must follow the pattern:{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      &lt;syllabus-id&gt;-s1
    </code>
    ,{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      &lt;syllabus-id&gt;-s2
    </code>
    , etc.
  </>,
  <>
    Topic IDs must follow the pattern:{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      &lt;syllabus-id&gt;-t1
    </code>
    ,{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      &lt;syllabus-id&gt;-t2
    </code>
    , etc. Numbered sequentially across all sections.
  </>,
  <>
    Each topic must have <strong>2–5 subtopics</strong> as plain strings.
  </>,
  <>
    "resources" must always be an empty array{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      []
    </code>
    .
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
    Always begin the response with a{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      FILENAME: &lt;topic-slug&gt;.json
    </code>{" "}
    line before the JSON (e.g.{" "}
    <code
      style={{
        background: "#f3f4f6",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: "0.75rem",
        color: "#dc2626",
      }}
    >
      FILENAME: playwright.json
    </code>
    ). This is the name the user saves the file as.
  </>,
];
