import Link from "next/link";
import ToolCard from "./ToolCard";

export const metadata = {
  title: "QA Tools | QA PlayGround",
  description:
    "Free online tools for QA engineers — JSON converters, formatters, Base64 encoders, JWT decoders, regex testers and more. Built for daily automation testing workflows.",
  keywords: [
    "QA tools online",
    "JSON to file converter",
    "JSON formatter QA",
    "Base64 encoder decoder",
    "JWT token decoder",
    "regex tester QA",
    "QA automation tools",
    "free testing tools",
  ],
  openGraph: {
    title: "QA Tools | QA PlayGround",
    description:
      "Free online tools for QA engineers — JSON converters, formatters, encoders, and more for daily automation workflows.",
    type: "website",
    url: "https://www.qaplayground.com/qa-tools",
    siteName: "QA PlayGround",
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Tools | QA PlayGround",
    description:
      "Free online tools built for QA engineers — JSON converters, JWT decoders, regex testers and more.",
    site: "@qaplayground",
  },
  alternates: {
    canonical: "https://www.qaplayground.com/qa-tools",
  },
};

const TOOLS = [
  {
    id: "json-to-file",
    icon: "⬇",
    iconBg: "#eff2ff",
    iconColor: "#2563eb",
    accentColor: "#2563eb",
    label: "JSON → Downloadable File",
    category: "Converter",
    categoryBg: "#eff2ff",
    categoryColor: "#2563eb",
    description:
      "Paste AI-generated syllabus JSON (with FILENAME prefix) and instantly download it as a ready-to-import .json file.",
    href: "/qa-tools/json-to-file",
    status: "live",
  },
  {
    id: "json-formatter",
    icon: "{}",
    iconBg: "#f0fdf4",
    iconColor: "#059669",
    accentColor: "#059669",
    label: "JSON Formatter & Validator",
    category: "Formatter",
    categoryBg: "#f0fdf4",
    categoryColor: "#059669",
    description:
      "Paste raw JSON to format, prettify, and validate it. Instant error highlighting for malformed responses from APIs.",
    href: null,
    status: "soon",
  },
  {
    id: "base64",
    icon: "B64",
    iconBg: "#fefce8",
    iconColor: "#ca8a04",
    accentColor: "#f59e0b",
    label: "Base64 Encoder / Decoder",
    category: "Encoder",
    categoryBg: "#fefce8",
    categoryColor: "#ca8a04",
    description:
      "Encode strings or decode Base64 values instantly. Useful for handling auth headers and encoded payloads in API testing.",
    href: null,
    status: "soon",
  },
  {
    id: "jwt-decoder",
    icon: "JWT",
    iconBg: "#fdf4ff",
    iconColor: "#9333ea",
    accentColor: "#9333ea",
    label: "JWT Token Decoder",
    category: "API Testing",
    categoryBg: "#fdf4ff",
    categoryColor: "#9333ea",
    description:
      "Decode and inspect JWT token headers and payloads without any verification. Perfect for debugging auth flows.",
    href: null,
    status: "soon",
  },
  {
    id: "regex-tester",
    icon: ".*",
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    accentColor: "#ea580c",
    label: "Regex Tester for QA",
    category: "Testing",
    categoryBg: "#fff7ed",
    categoryColor: "#ea580c",
    description:
      "Write and test regex patterns against sample strings. Great for building robust locator strategies and input validations.",
    href: null,
    status: "soon",
  },
];

const liveCount = TOOLS.filter((t) => t.status === "live").length;
const soonCount = TOOLS.filter((t) => t.status === "soon").length;

export default function QaToolsPage() {
  return (
    <div className="min-h-screen" style={{ background: "#f8f9fc", fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* ── Hero ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={pill("#eff2ff", "#2563eb")}>{liveCount} Live</span>
            <span style={pill("#f3f4f6", "#6b7280")}>{soonCount} Coming Soon</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 800,
              color: "#1a1d23",
              margin: "0 0 12px",
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
            }}
          >
            QA Tools
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#6b7280", margin: 0, maxWidth: 560, lineHeight: 1.65 }}>
            Free online tools built for QA engineers — converters, formatters, encoders, and
            decoders for your daily automation testing workflow.
          </p>
        </div>

        {/* ── Tool cards grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* ── Bottom callout ── */}
        <div
          style={{
            marginTop: 56,
            background: "#fff",
            border: "1px solid #e9eaed",
            borderRadius: 16,
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1d23", marginBottom: 4 }}>
              Have a tool idea?
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Suggest tools that would make your QA workflow faster on GitHub.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link
              href="/study-tracker/dashboard"
              style={{
                padding: "9px 18px",
                borderRadius: 8,
                background: "#f3f4f6",
                color: "#374151",
                fontSize: "0.84rem",
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid #e9eaed",
              }}
            >
              ← Study Tracker
            </Link>
            <Link
              href="/practice"
              style={{
                padding: "9px 18px",
                borderRadius: 8,
                background: "#2563eb",
                color: "#fff",
                fontSize: "0.84rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Practice Elements →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function pill(bg, color) {
  return {
    display: "inline-block",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    background: bg,
    color,
    padding: "3px 10px",
    borderRadius: 20,
  };
}
