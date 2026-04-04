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
    id: "markdown-html-convertor",
    icon: "M⬇",
    iconBg: "#f5f3ff",
    iconColor: "#7c3aed",
    accentColor: "#7c3aed",
    label: "Markdown HTML Converter",
    category: "Converter",
    categoryBg: "#f5f3ff",
    categoryColor: "#7c3aed",
    description:
      "Paste your Markdown text or upload a file. Convert it instantly to beautifully formatted HTML, ready for download.",
    href: "/qa-tools/markdown-html-convertor",
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

const CHROME_EXTENSIONS = [
  {
    id: "qa-capture",
    accentColor: "#2563eb",
    accentBg: "#eff2ff",
    label: "QA Capture",
    tagline: "Screenshot Every Test Step",
    description:
      "Continuously capture screenshots during testing, name each step, and export your complete session as PDF, Markdown, or HTML — in one click. No account required.",
    features: [
      "Continuous screenshot sessions",
      "Name each step with a label",
      "Export as PDF, Markdown, or HTML",
      "Full session history — locally stored",
    ],
    stats: [
      { value: "3", label: "Export Formats" },
      { value: "∞", label: "Sessions" },
      { value: "Free", label: "Forever" },
    ],
    href: "/chrome/qa-capture",
    storeHref:
      "https://chromewebstore.google.com/detail/jhgkhnokloeklnagbkgkgcfphafifefg?utm_source=item-share-cb",
  },
  {
    id: "qa-clipper",
    accentColor: "#7c3aed",
    accentBg: "#f5f3ff",
    label: "QA Playground Clipper",
    tagline: "Clip Any Webpage to Your Study Tracker",
    description:
      "Spot a great testing article, Playwright tutorial, or automation course? Clip it instantly to your QA Playground Study Tracker without breaking your flow.",
    features: [
      "One-click clip from any webpage",
      "Smart resource type auto-detection",
      "Edit title, tags & type before saving",
      "Connects via personal API key",
    ],
    stats: [
      { value: "7", label: "Resource Types" },
      { value: "1-Click", label: "To Clip" },
      { value: "Free", label: "To Install" },
    ],
    href: "/chrome/qa-clipper",
    storeHref:
      "https://chromewebstore.google.com/detail/jegdkegbomfbmhhimfjgacdblcoodfpd?utm_source=item-share-cb",
  },
];

const liveCount = TOOLS.filter((t) => t.status === "live").length;
const soonCount = TOOLS.filter((t) => t.status === "soon").length;

export default function QaToolsPage() {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-border mb-12">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-16">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={pill("#eff2ff", "#2563eb")}>{liveCount} Live</span>
            <span style={pill("#f3f4f6", "#6b7280")}>{soonCount} Coming Soon</span>
            <span style={pill("#f0fdf4", "#059669")}>{CHROME_EXTENSIONS.length} Chrome Extensions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400">QA Tools</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed m-0">
            Free online tools and Chrome extensions built for QA engineers — converters, formatters,
            encoders, screenshot tools, and resource clippers for your daily workflow.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">

        {/* ── Online Tools section header ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "#6b7280" }}>
              Online Tools
            </span>
            <div style={{ flex: 1, height: 1, background: "#e9eaed" }} />
          </div>
          <p style={{ fontSize: "0.84rem", color: "#9ca3af", margin: 0 }}>
            Browser-based utilities — no install needed
          </p>
        </div>

        {/* ── Tool cards grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 56,
          }}
        >
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* ── Chrome Extensions section ── */}
        <div style={{ marginBottom: 56 }}>
          {/* Section divider header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "#6b7280" }}>
              Chrome Extensions
            </span>
            <div style={{ flex: 1, height: 1, background: "#e9eaed" }} />
            <span style={pill("#eff2ff", "#2563eb")}>{CHROME_EXTENSIONS.length} Available</span>
          </div>
          <p style={{ fontSize: "0.84rem", color: "#9ca3af", margin: "0 0 20px" }}>
            Install once, use everywhere — purpose-built for QA engineers
          </p>

          {/* Extension cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 20,
            }}
          >
            {CHROME_EXTENSIONS.map((ext) => (
              <ChromeExtCard key={ext.id} ext={ext} />
            ))}
          </div>
        </div>

        {/* ── Bottom callout ── */}
        <div className="bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 dark:from-blue-600/20 dark:via-violet-600/20 dark:to-blue-600/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-base font-bold text-foreground mb-1">
              Have a tool idea?
            </p>
            <p className="text-sm text-muted-foreground">
              Suggest tools that would make your QA workflow faster on GitHub.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/study-tracker/dashboard"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-background border border-border hover:bg-muted text-foreground text-sm font-semibold transition-colors no-underline"
            >
              ← Study Tracker
            </Link>
            <Link
              href="/practice"
              prefetch={false}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline shadow-sm shadow-blue-500/20"
            >
              Practice Elements →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function ChromeExtCard({ ext }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1.5px solid ${ext.accentColor}30`,
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 2px 12px ${ext.accentColor}12`,
      }}
    >
      {/* Accent top bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${ext.accentColor}, ${ext.accentColor}99)` }} />

      <div style={{ padding: "22px 22px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 15 }}>

        {/* Header row: icon badge + category pill */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          {/* Icon */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: ext.accentBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              flexShrink: 0,
            }}
          >
            🧩
          </div>
          {/* Category pill */}
          <span
            style={{
              fontSize: "0.67rem",
              fontWeight: 700,
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              background: ext.accentBg,
              color: ext.accentColor,
              padding: "3px 10px",
              borderRadius: 20,
              whiteSpace: "nowrap",
            }}
          >
            Chrome Extension
          </span>
        </div>

        {/* Title + tagline */}
        <div>
          <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1a1d23", marginBottom: 3, lineHeight: 1.25 }}>
            {ext.label}
          </div>
          <div style={{ fontSize: "0.8rem", color: ext.accentColor, fontWeight: 600 }}>
            {ext.tagline}
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: "0.83rem", color: "#6b7280", margin: 0, lineHeight: 1.65 }}>
          {ext.description}
        </p>

        {/* Features */}
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
          {ext.features.map((f) => (
            <li key={f} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: "0.81rem", color: "#374151" }}>
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: ext.accentBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "0.6rem",
                  color: ext.accentColor,
                  fontWeight: 900,
                }}
              >
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "#f8f9fc",
            borderRadius: 10,
            padding: "10px 12px",
            border: "1px solid #e9eaed",
          }}
        >
          {ext.stats.map(({ value, label }, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                textAlign: "center",
                borderRight: i < ext.stats.length - 1 ? "1px solid #e9eaed" : "none",
              }}
            >
              <div style={{ fontSize: "1rem", fontWeight: 800, color: ext.accentColor, lineHeight: 1.1 }}>{value}</div>
              <div style={{ fontSize: "0.65rem", color: "#9ca3af", marginTop: 2, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <Link
            href={ext.href}
            prefetch={false}
            style={{
              flex: 1,
              padding: "9px 14px",
              borderRadius: 9,
              background: "#f3f4f6",
              color: "#374151",
              fontSize: "0.81rem",
              fontWeight: 600,
              textDecoration: "none",
              textAlign: "center",
              border: "1px solid #e9eaed",
            }}
          >
            Learn More
          </Link>
          <a
            href={ext.storeHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: "9px 14px",
              borderRadius: 9,
              background: ext.accentColor,
              color: "#fff",
              fontSize: "0.81rem",
              fontWeight: 700,
              textDecoration: "none",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            Add to Chrome →
          </a>
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
