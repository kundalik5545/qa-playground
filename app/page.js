import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  statsData,
  featuresData,
  howItWorksData,
  testimonialsData,
} from "@/data/landingPage";
import {
  BookOpen,
  CreditCard,
  LayoutGrid,
  CheckCircle,
  BarChart3,
  BookMarked,
  ClipboardList,
} from "lucide-react";

export const metadata = {
  title:
    "QA Playground — Practice Selenium, Playwright & Cypress Automation Testing",
  description:
    "Free QA automation testing playground with 22+ interactive UI elements, Bank Demo app, and QA Study Tracker. Practice Selenium, Playwright, and Cypress for free.",
  alternates: {
    canonical: "https://www.qaplayground.com",
  },
  keywords: [
    "QA Playground",
    "automation testing practice",
    "Selenium practice site",
    "Playwright testing",
    "Cypress testing",
    "QA engineer practice",
    "test automation playground",
    "QA study tracker",
    "Bank Demo automation",
    "Selenium WebDriver practice",
  ],
  openGraph: {
    type: "website",
    url: "https://www.qaplayground.com",
    title:
      "QA Playground — Practice Selenium, Playwright & Cypress Automation Testing",
    description:
      "Free QA automation testing playground with 22+ interactive UI elements, Bank Demo app, and QA Study Tracker. Practice Selenium, Playwright, and Cypress for free.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QA Playground — Automation Testing Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@qaplayground",
    title:
      "QA Playground — Practice Selenium, Playwright & Cypress Automation Testing",
    description:
      "Free QA automation testing playground with 22+ interactive UI elements, Bank Demo app, and QA Study Tracker.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "QA Playground",
  url: "https://www.qaplayground.com",
  description:
    "Free QA automation testing playground with 22+ interactive UI elements, Bank Demo app, and QA Study Tracker for Selenium, Playwright, and Cypress practice.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.qaplayground.com/practice",
    "query-input": "required name=search_term_string",
  },
};

const studyTrackerSyllabi = [
  {
    label: "Manual Testing",
    badgeClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    barClass: "bg-blue-500",
    accentClass: "border-l-blue-500",
    pct: 65,
  },
  {
    label: "Automation Testing",
    badgeClass:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    barClass: "bg-purple-600",
    accentClass: "border-l-purple-600",
    pct: 40,
  },
  {
    label: "API Testing",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    barClass: "bg-emerald-600",
    accentClass: "border-l-emerald-600",
    pct: 25,
  },
  {
    label: "Playwright",
    badgeClass:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    barClass: "bg-red-600",
    accentClass: "border-l-red-600",
    pct: 15,
  },
];

const studyTrackerFeatures = [
  {
    icon: <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />,
    text: "Track topic completion across 4 QA syllabi",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-blue-500 flex-shrink-0" />,
    text: "Visual progress charts — donut, radar, and daily activity line chart",
  },
  {
    icon: <BookMarked className="h-5 w-5 text-purple-500 flex-shrink-0" />,
    text: "Add personal notes and resource links per topic",
  },
  {
    icon: <ClipboardList className="h-5 w-5 text-orange-500 flex-shrink-0" />,
    text: "Daily activity log with streak tracking — no login required",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <section
        aria-label="Platform statistics"
        className="py-8 px-4 border-y border-border"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {statsData.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-bold gradient-title">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Three Main Features */}
      <section
        aria-label="Main platform features"
        className="py-14 px-4"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold gradient-title mb-3">
            Everything You Need to Level Up Your QA Career
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three powerful tools in one platform — practice automation, simulate
            real apps, and track your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Practice Elements */}
          <Card className="p-6 shadow-lg rounded-xl border-t-4 border-t-blue-500 flex flex-col">
            <CardContent className="pt-0 flex flex-col flex-1">
              <div className="mb-4">
                <LayoutGrid
                  className="h-10 w-10 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Practice Elements</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">
                22+ interactive UI elements — inputs, tables, drag-drop, alerts,
                iFrames, shadow DOM, and more. Designed specifically for
                Selenium, Playwright, and Cypress practice.
              </p>
              <Link href="/practice" aria-label="Start practicing automation testing elements">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Start Practicing
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bank Demo */}
          <Card className="p-6 shadow-lg rounded-xl border-t-4 border-t-teal-500 flex flex-col">
            <CardContent className="pt-0 flex flex-col flex-1">
              <div className="mb-4">
                <CreditCard
                  className="h-10 w-10 text-teal-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bank Demo App</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">
                A full simulated banking app — login, accounts, dashboard, and
                transaction management. Perfect for building and testing
                end-to-end automation frameworks.
              </p>
              <Link href="/bank" aria-label="Open the Bank Demo application">
                <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white">
                  Open Bank App
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Study Tracker — NEW */}
          <Card className="p-6 shadow-lg rounded-xl border-t-4 border-t-purple-500 relative overflow-hidden flex flex-col">
            <div className="absolute top-3 right-3">
              <Badge className="bg-purple-600 text-white text-xs">
                New Feature
              </Badge>
            </div>
            <CardContent className="pt-0 flex flex-col flex-1">
              <div className="mb-4">
                <BookOpen
                  className="h-10 w-10 text-purple-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">QA Study Tracker</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">
                Track your QA learning journey across Manual Testing,
                Automation, API Testing, and Playwright syllabi with visual
                progress charts and daily activity logs.
              </p>
              <Link href="/study-tracker" aria-label="Open the QA Study Tracker">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Track Your Progress
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Study Tracker Detailed Feature Section */}
      <section
        aria-label="QA Study Tracker feature details"
        className="py-14 px-4 bg-muted/40 rounded-2xl mx-4 my-4"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-purple-600 text-white text-xs">New</Badge>
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              Latest Feature
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left: description */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Track Your QA Learning with{" "}
                <span className="gradient-title">Study Tracker</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                The QA Study Tracker is your personal learning dashboard for
                mastering QA engineering. It covers four complete syllabi —
                Manual Testing, Automation Testing, API Testing, and Playwright.
                Track topic completion, add notes, save resource links, and
                visualize your progress with charts. Everything is saved locally
                in your browser — no login needed.
              </p>

              <ul className="space-y-3 mb-8" aria-label="Study Tracker features">
                {studyTrackerFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    {f.icon}
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link href="/study-tracker" aria-label="Open the QA Study Tracker dashboard">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  Open Study Tracker
                </Button>
              </Link>
            </div>

            {/* Right: syllabus progress cards */}
            <div
              className="grid grid-cols-2 gap-4"
              aria-label="Study Tracker syllabus overview"
            >
              {studyTrackerSyllabi.map((s, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border-l-4 ${s.accentClass} bg-card shadow-sm`}
                >
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${s.badgeClass}`}
                  >
                    {s.label}
                  </span>
                  <div className="mt-3">
                    <div
                      className="h-2 bg-muted rounded-full overflow-hidden"
                      role="progressbar"
                      aria-valuenow={s.pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${s.label} progress`}
                    >
                      <div
                        className={`h-full ${s.barClass} rounded-full`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {s.pct}% complete (demo)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access — Tutorials & Logic */}
      <section
        aria-label="Learning resources and tutorials"
        className="py-12 px-4"
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          More Learning Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 shadow-lg rounded-xl text-center">
            <CardContent>
              <h3 className="text-xl font-semibold text-teal-700">
                Free Tutorials
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Free courses on software testing and automation development.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link href="/learn/courses">
                  <Button className="bg-teal-800 text-white px-4 py-2 rounded-full">
                    Explore Free Courses
                  </Button>
                </Link>
                <Link
                  href="https://github.com/kundalik5545/QA_PlayGround_Automation_Framework"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-teal-800 text-white px-4 py-2 rounded-full">
                    Automation Framework
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 shadow-lg rounded-xl text-center">
            <CardContent>
              <h3 className="text-xl font-semibold text-teal-700">
                Practice Logic
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Solve real QA interview questions and logic programs.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link href="/learn/automation-test-cases">
                  <Button className="bg-teal-800 text-white px-4 py-2 rounded-full">
                    Practice Automation TC
                  </Button>
                </Link>
                <Link href="/learn/logical-programs-list-to-crack-interviews">
                  <Button className="bg-teal-800 text-white px-4 py-2 rounded-full">
                    Logical Programs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section
        aria-label="Practice element categories"
        className="py-12 px-4 bg-muted/30"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-3">
            Practice Any Element, Any Scenario
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
            Every element is purpose-built for automation testing. No distractions — just clean, testable UI.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuresData.map((f, i) => (
              <Link key={i} href={f.to} aria-label={`Practice ${f.title}`}>
                <Card className="p-5 shadow hover:shadow-md transition-shadow rounded-xl h-full">
                  <CardContent className="pt-0">
                    <div className="mb-3" aria-hidden="true">
                      {f.icon}
                    </div>
                    <h3 className="font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        aria-label="How QA Playground works"
        className="py-14 px-4"
      >
        <h2 className="text-2xl font-bold text-center mb-3">How It Works</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Get up and running in minutes — no setup complexity, no paywalls.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {howItWorksData.map((step, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl bg-card border"
              aria-label={step.title}
            >
              <div className="flex justify-center mb-4" aria-hidden="true">
                {step.icon}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        aria-label="Testimonials from QA engineers"
        className="py-14 px-4 bg-muted/30"
      >
        <h2 className="text-2xl font-bold text-center mb-3">
          What QA Engineers Say
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Trusted by thousands of QA professionals worldwide.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonialsData.map((t, i) => (
            <Card key={i} className="p-6 shadow rounded-xl">
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground italic mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={`${t.name}, ${t.role}`}
                    className="w-10 h-10 rounded-full"
                    width="40"
                    height="40"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
