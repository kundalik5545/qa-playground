"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GraduationCap, Clock, ListChecks, Video } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { datePickerTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";

const techMethods = {
  selenium: [
    { name: 'sendKeys("YYYY-MM-DD")', color: "bg-purple-500" },
    { name: "JavascriptExecutor", color: "bg-blue-500" },
    { name: "getAttribute('value')", color: "bg-emerald-500" },
    { name: "WebDriverWait.until()", color: "bg-orange-400" },
    { name: "getText()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: 'fill("2024-01-15")', color: "bg-blue-500" },
    { name: "toHaveValue()", color: "bg-purple-500" },
    { name: "getAttribute('min')", color: "bg-orange-400" },
    { name: "waitForSelector()", color: "bg-emerald-500" },
    { name: "locator.textContent()", color: "bg-red-500" },
  ],
};

const SLUG = "date-picker";

const CalendarPage = () => {
  const [activeTech, setActiveTech] = useState("selenium");

  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

  return (
    <div className="space-y-6">
      {/* A. Hero Section */}
      <div className="px-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badgeClass}`}
          >
            <GraduationCap size={12} /> {res.difficulty}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
            <Clock size={12} /> {res.timeMin} min
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
            <ListChecks size={12} /> {res.scenarioCount} scenarios
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Date Picker Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Practice setting, reading, and validating date inputs — including date
          ranges and min/max constraints — using Selenium &amp; Playwright.
        </p>
      </div>

      {/* B. Main Layout Row */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* B1. Practice Card */}
        <section
          aria-label="Date picker practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

              {/* Scenario 1: Today's date */}
              <div className="space-y-2">
                <Label
                  htmlFor="input-today-date"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Scenario 1: Enter today&apos;s date
                </Label>
                <Input
                  type="date"
                  id="input-today-date"
                  name="input-today-date"
                  data-testid="input-today-date"
                  className="w-48"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 2: Birthday */}
              <div className="space-y-2">
                <Label
                  htmlFor="input-birthday"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Scenario 2: Enter your birthday
                </Label>
                <Input
                  type="date"
                  id="input-birthday"
                  name="input-birthday"
                  data-testid="input-birthday"
                  className="w-48"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 3: Date range */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 3: Select a date range
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="space-y-1">
                    <Label
                      htmlFor="input-date-start"
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Start date
                    </Label>
                    <Input
                      type="date"
                      id="input-date-start"
                      name="input-date-start"
                      data-testid="input-date-start"
                      className="w-44"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="input-date-end"
                      className="text-xs text-gray-500 dark:text-gray-400"
                    >
                      End date
                    </Label>
                    <Input
                      type="date"
                      id="input-date-end"
                      name="input-date-end"
                      data-testid="input-date-end"
                      className="w-44"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 4: Min/max restricted date */}
              <div className="space-y-2">
                <Label
                  htmlFor="input-date-restricted"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Scenario 4: Date with min / max constraint
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Only dates between <strong>2024-01-01</strong> and{" "}
                  <strong>2024-12-31</strong> are accepted.
                </p>
                <Input
                  type="date"
                  id="input-date-restricted"
                  name="input-date-restricted"
                  data-testid="input-date-restricted"
                  min="2024-01-01"
                  max="2024-12-31"
                  className="w-48"
                />
              </div>

            </CardContent>
          </Card>
        </section>

        {/* B2. What You'll Learn */}
        <div className="shrink-0 w-64 md:w-72">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 border-b space-y-0">
              <p className="text-base font-semibold">What You&apos;ll Learn</p>
              <GraduationCap size={18} />
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Tech toggle */}
              <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
                <button
                  onClick={() => setActiveTech("selenium")}
                  className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-colors ${
                    activeTech === "selenium"
                      ? "bg-white dark:bg-gray-700 shadow text-foreground"
                      : "text-gray-500 dark:text-gray-400 hover:text-foreground"
                  }`}
                >
                  Selenium (Java)
                </button>
                <button
                  onClick={() => setActiveTech("playwright")}
                  className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-colors ${
                    activeTech === "playwright"
                      ? "bg-white dark:bg-gray-700 shadow text-foreground"
                      : "text-gray-500 dark:text-gray-400 hover:text-foreground"
                  }`}
                >
                  Playwright (JS/PY)
                </button>
              </div>

              {/* Method list */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
                  {activeTech === "selenium"
                    ? "Selenium (Java)"
                    : "Playwright (JS / Python)"}
                </p>
                <ul className="space-y-1.5">
                  {techMethods[activeTech].map((method) => (
                    <li key={method.name} className="flex items-center gap-2 text-sm">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${method.color}`}
                      />
                      <span className="font-light">{method.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center gap-1.5 p-3 border-t">
              <Video size={14} className="text-gray-400 dark:text-gray-500" />
              {res.youtubeUrl ? (
                <Link
                  href={res.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Watch Tutorial
                </Link>
              ) : (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Tutorial video coming soon
                </span>
              )}
            </CardFooter>
          </Card>

          <NextElementCard currentSlug={SLUG} />
        </div>
      </div>

      {/* C. Test Cases */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Test Cases</h2>
        <Accordion type="multiple" className="space-y-2">
          {datePickerTC.map((tc) => (
            <AccordionItem
              key={tc.TestId}
              value={tc.TestId}
              className="border rounded-lg px-4 bg-background"
            >
              <AccordionTrigger className="text-sm py-3 hover:no-underline">
                <span className="font-medium text-left">
                  {tc.TestId}: {tc.TestCaseName}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <ol className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
                  {tc.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 py-2 text-xs xl:text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="shrink-0 font-medium text-gray-400 dark:text-gray-500 w-4 text-right">
                        {i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CalendarPage;
