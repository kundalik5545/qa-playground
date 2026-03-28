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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { tabsWindowsTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";

const techMethods = {
  selenium: [
    { name: "getWindowHandles()", color: "bg-purple-500" },
    { name: "switchTo().window()", color: "bg-blue-500" },
    { name: "getWindowHandle()", color: "bg-emerald-500" },
    { name: "driver.close()", color: "bg-orange-400" },
    { name: "Actions.keyDown(Keys.CONTROL)", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "context.pages()", color: "bg-blue-500" },
    { name: 'waitForEvent("popup")', color: "bg-purple-500" },
    { name: "page.close()", color: "bg-orange-400" },
    { name: "browserContext.newPage()", color: "bg-emerald-500" },
    { name: "page.bringToFront()", color: "bg-red-500" },
  ],
};

const SLUG = "tabs-windows";

const WindowsPage = () => {
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
          Tabs &amp; Windows Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Practice opening new tabs, switching between windows, reading titles,
          and closing child windows — key skills for multi-tab automation in
          Selenium &amp; Playwright.
        </p>
      </div>

      {/* B. Main Layout Row */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* B1. Practice Card */}
        <section
          aria-label="Tabs and windows practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

              {/* Scenario 1: Open new tab */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 1: Open a link in a new tab
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Click the button below — it opens the home page in a new tab.
                  Switch to the new tab and read its title.
                </p>
                <Link href="/" target="_blank" rel="noopener noreferrer">
                  <Button
                    id="btn-open-home-tab"
                    name="btn-open-home-tab"
                    data-testid="btn-open-home-tab"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Open Home Page
                  </Button>
                </Link>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 2: Open multiple windows */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 2: Open multiple windows
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Opens additional browser windows. Iterate all handles and
                  print each window&apos;s title.
                </p>
                <Link
                  href="/practice/dropdowns"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    id="btn-open-multiple-windows"
                    name="btn-open-multiple-windows"
                    data-testid="btn-open-multiple-windows"
                    variant="outline"
                  >
                    Open Multiple Windows
                  </Button>
                </Link>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 3: Switch back to parent */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 3: Switch back to the parent window
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Open a child tab using Scenario 1, then switch back to this
                  parent window and assert the page title.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>Store the parent handle before clicking</li>
                  <li>Click &quot;Open Home Page&quot; to open the child tab</li>
                  <li>Switch to the child tab and read its title</li>
                  <li>Switch back to parent handle and assert the title</li>
                </ol>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 4: Close child window */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 4: Close the child window
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  After switching to the child tab, close it and verify only the
                  parent window remains active.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>Open child tab via Scenario 1</li>
                  <li>Switch to child and call driver.close() / newPage.close()</li>
                  <li>Switch back to parent handle</li>
                  <li>Assert only 1 window handle remains</li>
                </ol>
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
          {tabsWindowsTC.map((tc) => (
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

export default WindowsPage;
