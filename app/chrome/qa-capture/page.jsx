import Link from "next/link";
import {
  Camera,
  Download,
  FileText,
  History,
  Tag,
  CheckCircle,
  ArrowRight,
  Chrome,
  Layers,
  Clock,
  BookOpen,
  Zap,
  ExternalLink,
  FileImage,
  Code2,
  Globe,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title:
    "QA Capture — Chrome Extension for Continuous Screenshot Documentation",
  description:
    "QA Capture is a free Chrome extension that lets QA engineers capture screenshots continuously, name each step, and export sessions as PDF, Markdown, or HTML. Perfect for documenting test flows and bug reports.",
  keywords: [
    "QA screenshot tool",
    "Chrome extension screenshot",
    "continuous screenshot capture",
    "QA documentation tool",
    "export screenshots to PDF",
    "screenshot to markdown",
    "bug report screenshots",
    "QA process documentation",
    "test step screenshots",
    "QA engineer tools",
  ],
  openGraph: {
    title: "QA Capture — Chrome Extension for Screenshot Documentation",
    description:
      "Capture screenshots continuously, name each step, and export your QA sessions as PDF, Markdown, or HTML. Free Chrome extension for QA engineers.",
    type: "website",
    url: "https://www.qaplayground.com/chrome",
    siteName: "QA PlayGround",
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Capture — Free Chrome Extension for QA Engineers",
    description:
      "Capture, name, and export test flow screenshots as PDF, Markdown, or HTML. Free Chrome extension.",
    site: "@qaplayground",
  },
  alternates: {
    canonical: "https://www.qaplayground.com/chrome",
  },
};

// ── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Camera,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    title: "Continuous Screenshot Capture",
    description:
      "Click once to start a session and capture as many screenshots as you need. Every capture is timestamped and stored in the current session automatically.",
  },
  {
    icon: Tag,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    title: "Name Each Step",
    description:
      "Label every screenshot with a descriptive step name — 'Login Page', 'Error on Submit', 'After API Response'. Makes exported documents readable without extra editing.",
  },
  {
    icon: Download,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    title: "Export in 3 Formats",
    description:
      "Export your session as a PDF report, a Markdown file ready for GitHub or Confluence, or a standalone HTML file you can open anywhere without internet.",
  },
  {
    icon: History,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    title: "Session History",
    description:
      "Every capture session is saved locally. Browse previous sessions by date, reopen them, add more screenshots, or re-export them in a different format anytime.",
  },
  {
    icon: Zap,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    title: "One-Click Workflow",
    description:
      "Pin the extension icon — click to capture, type a name, move on. No popups, no configuration, no slowdowns. Designed to stay out of your way while you test.",
  },
  {
    icon: Layers,
    color: "text-slate-600",
    bg: "bg-slate-100 dark:bg-slate-800/40",
    title: "Full-Page & Viewport Capture",
    description:
      "Capture only the visible viewport for quick step documentation, or enable full-page mode to capture long scrollable pages in one shot for thorough bug reports.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    color: "bg-blue-600",
    title: "Install & Pin the Extension",
    description:
      "Install QA Capture from the Chrome Web Store. Pin it to your toolbar for one-click access while testing.",
  },
  {
    step: "02",
    color: "bg-violet-600",
    title: "Start a Session",
    description:
      "Click the extension icon and hit 'New Session'. Give it a name like 'Login Flow Bug' or 'Checkout Regression'. Your session is ready.",
  },
  {
    step: "03",
    color: "bg-emerald-600",
    title: "Capture & Name Each Step",
    description:
      "Navigate your test flow. Click 'Capture' at each important step and type a step name. Each screenshot is saved instantly — no upload, fully local.",
  },
  {
    step: "04",
    color: "bg-orange-600",
    title: "Export Your Session",
    description:
      "When done, hit Export and choose PDF, Markdown, or HTML. Your complete step-by-step documentation is ready to share with your team or attach to a Jira ticket.",
  },
];

const EXPORT_FORMATS = [
  {
    icon: FileImage,
    label: "PDF",
    color: "text-red-600",
    border: "border-red-200 dark:border-red-800",
    bg: "bg-red-50 dark:bg-red-950/30",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    description:
      "Professional report layout. One screenshot per page with step name, timestamp, and session metadata. Ready to attach to tickets or emails.",
    useCases: ["Bug reports", "Stakeholder sign-off", "Email attachments"],
  },
  {
    icon: Code2,
    label: "Markdown",
    color: "text-violet-600",
    border: "border-violet-200 dark:border-violet-800",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    badge:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    description:
      "GitHub-flavoured Markdown with base64 inline images. Paste straight into a GitHub issue, Confluence page, or Notion doc — no image hosting needed.",
    useCases: ["GitHub Issues", "Confluence docs", "Notion pages"],
  },
  {
    icon: Globe,
    label: "HTML",
    color: "text-blue-600",
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    description:
      "Standalone HTML file with all images embedded. Open in any browser offline, share as a single file, or host on any static server.",
    useCases: ["Offline sharing", "Static hosting", "Team archives"],
  },
];

const USE_CASES = [
  {
    icon: CheckCircle,
    color: "text-emerald-600",
    title: "Document a Bug Step-by-Step",
    description:
      "Reproduce the bug, capture each click and error state with a label, export as PDF, and attach directly to your Jira ticket. Zero manual editing required.",
  },
  {
    icon: BookOpen,
    color: "text-blue-600",
    title: "Write Test Case Documentation",
    description:
      "Walk through a test case in your browser, name each step screenshot, and export as Markdown. Instant living documentation that always matches the current UI.",
  },
  {
    icon: Clock,
    color: "text-orange-600",
    title: "Onboard a New QA Engineer",
    description:
      "Capture a complete walkthrough of a complex flow — login, dashboard, edge cases — with named steps and export as HTML. A self-contained guide anyone can open.",
  },
  {
    icon: FileText,
    color: "text-violet-600",
    title: "Regression Testing Evidence",
    description:
      "Capture before-and-after screenshots for regression runs. Session history means you can always pull up last sprint's session and compare side-by-side.",
  },
];

const FAQ = [
  {
    q: "Is QA Capture free to use?",
    a: "Yes — QA Capture is completely free. No subscription, no account required, no usage limits. All screenshots and sessions are stored locally in your browser — nothing is sent to any server.",
  },
  {
    q: "Where are my screenshots and sessions stored?",
    a: "Everything is stored locally in Chrome's extension storage (chrome.storage.local). Your screenshots never leave your device. This means sessions persist across browser restarts but are tied to the browser profile — use the export feature to back up important sessions.",
  },
  {
    q: "How many screenshots can I capture in one session?",
    a: "There is no hard limit enforced by the extension. Very large sessions (100+ full-page screenshots) may be slower to export as PDF due to image size. For long testing sessions, consider splitting into multiple sessions by feature area or flow.",
  },
  {
    q: "Can I edit or delete a screenshot after capturing it?",
    a: "Yes. Inside a session you can rename any step, reorder screenshots, and delete individual captures before exporting. You can also delete an entire session from the history view.",
  },
  {
    q: "Does QA Capture work on all websites?",
    a: "QA Capture works on all standard HTTPS and HTTP pages. It cannot capture screenshots on browser-native pages (chrome://, chrome-extension://, or the Chrome Web Store) due to Chrome's extension security restrictions. All other websites — including local development servers on localhost — work normally.",
  },
  {
    q: "Can I re-export a past session in a different format?",
    a: "Yes. Open any previous session from the history view and use the Export button to choose a different format. The original screenshots and step names are preserved, so you can export the same session as PDF, Markdown, and HTML as many times as you want.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChromeExtensionPage() {
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
              Free Forever
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">
              No Account Needed
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
            <span className="gradient-title">QA Capture</span>
            <br />
            <span className="text-foreground text-3xl sm:text-4xl md:text-5xl font-bold">
              Screenshot Every Test Step
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Continuously capture screenshots during testing, name each step, and
            export your complete session as{" "}
            <span className="font-semibold text-foreground">PDF</span>,{" "}
            <span className="font-semibold text-foreground">Markdown</span>, or{" "}
            <span className="font-semibold text-foreground">HTML</span> — in one
            click.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://chromewebstore.google.com/detail/jhgkhnokloeklnagbkgkgcfphafifefg?utm_source=item-share-cb"
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
              { value: "3", label: "Export Formats" },
              { value: "∞", label: "Sessions Stored" },
              { value: "0", label: "Data Sent to Server" },
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
              Simple Workflow
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From install to exported report in four steps. No configuration,
              no learning curve.
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
              Every feature was designed around a real documentation pain point
              QA engineers face daily.
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

      {/* ── EXPORT FORMATS ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Export Options
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Three Formats, One Session
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Export the same session in different formats depending on where
              it&apos;s going — ticket, docs, or archive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {EXPORT_FORMATS.map(
              ({
                icon: Icon,
                label,
                color,
                border,
                bg,
                badge,
                description,
                useCases,
              }) => (
                <div
                  key={label}
                  className={`bg-card border ${border} rounded-xl p-6 shadow-sm`}
                >
                  <div
                    className={`${bg} ${color} w-11 h-11 rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-3 ${badge} ${border}`}
                  >
                    {label}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {description}
                  </p>
                  <ul className="space-y-1">
                    {useCases.map((uc) => (
                      <li
                        key={uc}
                        className="text-xs text-muted-foreground flex items-center gap-1.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        {uc}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── SESSION HISTORY ─────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Session History
              </p>
              <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                Every Session Saved.
                <br />
                Nothing Ever Lost.
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                QA Capture stores all your sessions locally in your browser.
                Browse your complete capture history by date — reopen any old
                session, rename steps, add new captures, or re-export in a
                different format.
              </p>
              <ul className="space-y-3">
                {[
                  "Browse sessions by date or custom name",
                  "Reopen and continue any previous session",
                  "Re-export old sessions in PDF, MD, or HTML",
                  "Delete sessions individually to free up space",
                  "All data stored locally — no cloud sync required",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual mock */}
            <div className="bg-card border border-border rounded-2xl shadow-md overflow-hidden">
              {/* Header bar */}
              <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  Session History
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  3 sessions
                </span>
              </div>
              {/* Session rows */}
              <div className="divide-y divide-border">
                {[
                  {
                    name: "Login Flow — Bug #1204",
                    date: "Today, 2:14 PM",
                    count: 8,
                    badge:
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                    label: "PDF",
                  },
                  {
                    name: "Checkout Regression",
                    date: "Yesterday, 11:30 AM",
                    count: 14,
                    badge:
                      "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
                    label: "MD",
                  },
                  {
                    name: "Dashboard Onboarding Guide",
                    date: "Mar 25, 9:05 AM",
                    count: 11,
                    badge:
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                    label: "HTML",
                  },
                ].map(({ name, date, count, badge, label }) => (
                  <div
                    key={name}
                    className="px-4 py-3.5 hover:bg-muted/40 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Camera className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {date} · {count} screenshots
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${badge}`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
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
            <Chrome className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Start Capturing in 30 Seconds
            </h2>
            <p className="text-blue-100 mb-7 max-w-md mx-auto leading-relaxed">
              Install QA Capture, pin it to your toolbar, and you&apos;re ready.
              No configuration, no account, no cost.
            </p>
            <a
              href="https://chromewebstore.google.com/detail/jhgkhnokloeklnagbkgkgcfphafifefg?utm_source=item-share-cb"
              target="_blank"
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl text-base transition-colors shadow-sm"
            >
              <Chrome className="h-5 w-5" />
              Add to Chrome — Free
              <ExternalLink className="h-4 w-4 opacity-60" />
            </a>
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
            href="/practice"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Practice Elements
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/qa-tools"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            QA Tools
          </Link>
          <span className="text-border">|</span>
          <Link
            href="/study-tracker"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Study Tracker
          </Link>
        </div>
      </div>
    </div>
  );
}
