import Link from "next/link";
import {
  Bookmark,
  Key,
  Tag,
  CheckCircle,
  ArrowRight,
  Chrome,
  Zap,
  ExternalLink,
  Settings,
  Globe,
  BookOpen,
  Video,
  Code2,
  FileText,
  ShieldCheck,
  UserCheck,
  LogIn,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "QA Playground Clipper — Save Any Webpage to Your Study Tracker",
  description:
    "QA Playground Clipper is a free Chrome extension that lets QA engineers clip any webpage — articles, videos, courses, and docs — directly into their QA Playground Study Tracker with one click.",
  keywords: [
    "QA learning resources",
    "Chrome extension bookmark",
    "save webpage to study tracker",
    "QA resource manager",
    "clip articles for QA",
    "QA Playground extension",
    "learning library chrome extension",
    "QA engineer tools",
    "save videos for QA learning",
    "automation testing resources",
  ],
  openGraph: {
    title: "QA Playground Clipper — Clip Any Webpage to Your Study Tracker",
    description:
      "One-click Chrome extension to save articles, videos, courses, and docs directly into your QA Playground Study Tracker. Smart type detection. Zero copy-pasting.",
    type: "website",
    url: "https://www.qaplayground.com/chrome/qa-clipper",
    siteName: "QA PlayGround",
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Playground Clipper — Free Chrome Extension for QA Engineers",
    description:
      "Clip any webpage to your QA Playground Study Tracker in one click. Smart resource type detection included.",
    site: "@qaplayground",
  },
  alternates: {
    canonical: "https://www.qaplayground.com/chrome/qa-clipper",
  },
};

// ── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    title: "One-Click Clip",
    description:
      "Click the extension icon on any tab and your resource is ready to save. Title, description, and image are auto-extracted from the page — no copy-pasting required.",
  },
  {
    icon: Globe,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    title: "Smart Resource Type Detection",
    description:
      "Automatically identifies YouTube and Vimeo as VIDEO, GitHub as TOOL, Udemy/Coursera as COURSE, /docs/ paths as DOCUMENTATION, and everything else as ARTICLE. Override any time.",
  },
  {
    icon: Tag,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    title: "Review & Edit Before Saving",
    description:
      "Every field is editable before you hit Save — title, type, description, tags, and image URL. Add tags with Enter or comma to organise your library exactly the way you want.",
  },
  {
    icon: Key,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    title: "API Key Connection",
    description:
      "Uses your personal API key (qapg_...) generated from your QA Playground Study Tracker. Clips appear instantly in your tracker — no sync delay, no third-party cloud.",
  },
  {
    icon: Settings,
    color: "text-slate-600",
    bg: "bg-slate-100 dark:bg-slate-800/40",
    title: "Settings with Connection Test",
    description:
      "Enter your name and API key once and you're set. Use the Test Connection button to verify your key is valid — shows your connected account name on success.",
  },
  {
    icon: ShieldCheck,
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    title: "Privacy First",
    description:
      "Your API key is stored in chrome.storage.local — isolated from page scripts and never logged or sent anywhere except the QA Playground API. No analytics, no telemetry.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    color: "bg-blue-600",
    title: "Install & Sign In",
    description:
      "Install QA Playground Clipper from the Chrome Web Store. Sign in or create a free account at qaplayground.com if you haven't already.",
  },
  {
    step: "02",
    color: "bg-violet-600",
    title: "Generate Your API Key",
    description:
      "Go to QA Playground → Study Tracker → Resources → Settings → API Keys. Generate a new key (starts with qapg_). Copy it.",
  },
  {
    step: "03",
    color: "bg-emerald-600",
    title: "Paste Key into Extension",
    description:
      "Open the extension and click the gear icon to open Settings. Paste your API key and hit Test Connection — you'll see your account name on success.",
  },
  {
    step: "04",
    color: "bg-orange-600",
    title: "Clip Anything, Instantly",
    description:
      "Browse any page — article, video, course, or docs. Click the extension icon, review the auto-filled fields, add tags, and hit Save. Done.",
  },
];

const RESOURCE_TYPES = [
  {
    icon: Video,
    label: "VIDEO",
    color: "text-red-600",
    border: "border-red-200 dark:border-red-800",
    bg: "bg-red-50 dark:bg-red-950/30",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    description:
      "YouTube, Vimeo, and other video platforms are automatically detected. Perfect for saving tutorial videos, conference talks, and screencasts.",
    sites: ["YouTube", "Vimeo", "Loom"],
  },
  {
    icon: BookOpen,
    label: "COURSE",
    color: "text-violet-600",
    border: "border-violet-200 dark:border-violet-800",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    description:
      "Udemy, Coursera, Pluralsight, and Frontend Masters are recognised as courses automatically. Save your entire learning roadmap in one place.",
    sites: ["Udemy", "Coursera", "Pluralsight", "Frontend Masters"],
  },
  {
    icon: Code2,
    label: "TOOL",
    color: "text-slate-600",
    border: "border-slate-200 dark:border-slate-700",
    bg: "bg-slate-100 dark:bg-slate-800/40",
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    description:
      "GitHub repos and tool pages are detected as TOOL resources. Keep a curated list of frameworks, libraries, and utilities you rely on.",
    sites: ["GitHub", "npm", "PyPI"],
  },
  {
    icon: FileText,
    label: "DOCUMENTATION",
    color: "text-blue-600",
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    description:
      "URLs containing /docs/, /documentation, or /api-reference are auto-tagged as DOCUMENTATION — official Playwright, Selenium, and Cypress docs land here.",
    sites: ["Playwright Docs", "Selenium Docs", "Cypress Docs"],
  },
];

const USE_CASES = [
  {
    icon: CheckCircle,
    color: "text-emerald-600",
    title: "Build Your QA Learning Library",
    description:
      "Spot a great Playwright tutorial mid-test? Clip it in one click. Your Study Tracker becomes the single source of truth for every resource you've ever found valuable.",
  },
  {
    icon: BookOpen,
    color: "text-blue-600",
    title: "Curate a Tag-Based Reference System",
    description:
      "Add tags like 'selenium', 'api-testing', or 'ci-cd' to every clip. When you need resources for a specific topic, your tagged library surfaces them instantly.",
  },
  {
    icon: Video,
    color: "text-red-600",
    title: "Save Videos for Later, Not Browser Tabs",
    description:
      "Stop living with 40 browser tabs open. Clip YouTube tutorials and course pages to your tracker so you can close the tab and come back when you're ready to learn.",
  },
  {
    icon: Globe,
    color: "text-violet-600",
    title: "Never Lose a Good Doc Page Again",
    description:
      "Found a perfect Cypress API reference or a tricky Selenium Grid config guide? Clip it to Documentation in your tracker and it's searchable and accessible forever.",
  },
];

const FAQ = [
  {
    q: "Do I need a QA Playground account to use this extension?",
    a: "Yes — a free QA Playground account is required. The extension saves your clipped resources directly to your Study Tracker via the API, so it needs a verified account to associate resources with.",
  },
  {
    q: "Where do I get my API key?",
    a: "Log in to QA Playground, go to Study Tracker → Resources, and look for the Settings or API Keys section. Generate a new key there — it starts with 'qapg_'. Copy and paste it into the extension's Settings page.",
  },
  {
    q: "Is the API key stored securely?",
    a: "Yes. The key is stored in chrome.storage.local, which is isolated from page scripts and cannot be accessed by websites you visit. It is only sent to the QA Playground API (qaplayground.com) when you save a resource.",
  },
  {
    q: "Can I edit the auto-detected fields before saving?",
    a: "Yes — every field is editable in the extension popup before you hit Save. Title, description, resource type, tags, and image URL can all be changed. The auto-extracted values are just a starting point.",
  },
  {
    q: "What happens if the extension can't detect the resource type?",
    a: "It defaults to ARTICLE — the most common type. You can override it to VIDEO, COURSE, TOOL, DOCUMENTATION, BOOK, or OTHER from the type dropdown before saving.",
  },
  {
    q: "Where do my clipped resources appear?",
    a: "They appear immediately in the Resources section of your QA Playground Study Tracker at qaplayground.com/study-tracker. No sync delay — the resource is saved directly via the API on click.",
  },
  {
    q: "Does this work on all websites?",
    a: "The extension works on all standard HTTPS and HTTP pages. It cannot operate on browser-native pages (chrome://, chrome-extension://, or the Chrome Web Store) due to Chrome's security restrictions. All regular websites including localhost work normally.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function QAClipperPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
          {/* Badges */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full">
              <Chrome className="h-3.5 w-3.5" />
              Chrome Extension
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full">
              <CheckCircle className="h-3.5 w-3.5" />
              Free to Install
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800 px-3 py-1 rounded-full">
              <Bookmark className="h-3.5 w-3.5" />
              Study Tracker Connected
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
            <span className="gradient-title">QA Playground Clipper</span>
            <br />
            <span className="text-foreground text-3xl sm:text-4xl md:text-5xl font-bold">
              Clip Any Webpage to Your Study Tracker
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Spot a great testing article, Playwright tutorial, or automation
            course? Clip it instantly to your{" "}
            <span className="font-semibold text-foreground">
              QA Playground Study Tracker
            </span>{" "}
            without breaking your flow — one click, zero copy-pasting.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://chromewebstore.google.com/detail/jegdkegbomfbmhhimfjgacdblcoodfpd?utm_source=item-share-cb"
              target="_blank"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg text-base transition-colors shadow-sm"
            >
              <Chrome className="h-5 w-5" />
              Add to Chrome — It&apos;s Free
              <ExternalLink className="h-4 w-4 opacity-70" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground font-semibold px-6 py-3 rounded-lg text-base transition-colors border border-border"
            >
              See How It Works
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { value: "7", label: "Resource Types" },
              { value: "1", label: "Click to Clip" },
              { value: "0", label: "Third-Party Cloud" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-xl px-4 py-4 shadow-sm"
              >
                <div className="text-2xl font-extrabold text-foreground">
                  {value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Simple Setup
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From install to your first clip in four steps. Requires a free QA
              Playground account.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HOW_IT_WORKS.map(({ step, color, title, description }) => (
              <div
                key={step}
                className="bg-card border border-border rounded-xl p-6 shadow-sm flex gap-4"
              >
                <div
                  className={`${color} text-white text-xs font-extrabold w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  {step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Account required callout */}
          <div className="mt-8 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex items-start gap-3">
            <UserCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-0.5">
                Free Account Required
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                The extension connects directly to your personal Study Tracker
                via an API key. You&apos;ll need a free account at{" "}
                <Link
                  href="/signup"
                  className="underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-200"
                >
                  qaplayground.com/signup
                </Link>{" "}
                to generate your key.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Everything You Need
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Built for QA Engineers
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every feature was designed to help QA engineers build a personal
              learning library without ever leaving the page they&apos;re on.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, color, bg, title, description }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`${bg} ${color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-1.5">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESOURCE TYPES ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Smart Detection
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Auto-Detected Resource Types
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The extension reads the URL and page content to identify what
              you&apos;re saving. Override the detected type any time before
              saving.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {RESOURCE_TYPES.map(
              ({
                icon: Icon,
                label,
                color,
                border,
                bg,
                badge,
                description,
                sites,
              }) => (
                <div
                  key={label}
                  className={`bg-card border ${border} rounded-xl p-6 shadow-sm`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`${bg} ${color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge} ${border}`}
                    >
                      {label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {description}
                  </p>
                  <ul className="space-y-1">
                    {sites.map((site) => (
                      <li
                        key={site}
                        className="text-xs text-muted-foreground flex items-center gap-1.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        {site}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>

          {/* Fallback note */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Everything else defaults to{" "}
            <span className="font-semibold text-foreground">ARTICLE</span>. You
            can also save as{" "}
            <span className="font-semibold text-foreground">BOOK</span> or{" "}
            <span className="font-semibold text-foreground">OTHER</span> by
            changing the type dropdown before saving.
          </p>
        </div>
      </section>

      {/* ── API KEY SETUP ────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                API Key Setup
              </p>
              <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                Your Key.
                <br />
                Your Data.
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                QA Playground Clipper connects to your account using a personal
                API key you generate inside the Study Tracker. Paste it once —
                the extension remembers it. Your clips go directly to your
                library with no intermediary.
              </p>
              <ul className="space-y-3">
                {[
                  "API key starts with qapg_ for easy identification",
                  "Stored only in chrome.storage.local on your device",
                  "Test Connection verifies the key before you start clipping",
                  "Revoke and regenerate keys any time from Study Tracker",
                  "Never sent to any server except qaplayground.com",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual mock — settings panel */}
            <div className="bg-card border border-border rounded-2xl shadow-md overflow-hidden">
              {/* Header bar */}
              <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  Extension Settings
                </span>
              </div>
              {/* Fields */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Your Name
                  </label>
                  <div className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground">
                    Jane QA Engineer
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                    API Key
                  </label>
                  <div className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-mono text-muted-foreground tracking-wide">
                    qapg_••••••••••••••••••••
                  </div>
                </div>
                {/* Connection status */}
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg px-4 py-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      Connected
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Signed in as Jane QA Engineer
                    </p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
                  Test Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Real QA Workflows
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              How QA Engineers Use It
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {USE_CASES.map(({ icon: Icon, color, title, description }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 ${color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1.5">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              FAQ
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-3">
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
      </section>

      {/* ── CTA BOTTOM ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-10 shadow-xl text-white">
            <Bookmark className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Start Clipping in Minutes
            </h2>
            <p className="text-blue-100 mb-7 max-w-md mx-auto leading-relaxed">
              Install the extension, connect your API key, and clip your first
              resource. Your QA learning library builds itself as you browse.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://chromewebstore.google.com/detail/jegdkegbomfbmhhimfjgacdblcoodfpd?utm_source=item-share-cb"
                target="_blank"
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl text-base transition-colors shadow-sm"
              >
                <Chrome className="h-5 w-5" />
                Add to Chrome — Free
                <ExternalLink className="h-4 w-4 opacity-60" />
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-base transition-colors border border-white/20"
              >
                <LogIn className="h-4 w-4" />
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BACK LINKS ──────────────────────────────────────────────────── */}
      <div className="py-6 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← QA Playground Home
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/study-tracker"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Study Tracker
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/chrome/qa-capture"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            QA Capture Extension
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/qa-tools"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            QA Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
