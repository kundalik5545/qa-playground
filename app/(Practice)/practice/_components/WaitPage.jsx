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
import { GraduationCap, Clock, ListChecks, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { dynamicWaitsTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";

const techMethods = {
  selenium: [
    { name: "WebDriverWait.until()", color: "bg-purple-500" },
    { name: "ExpectedConditions.visibilityOf()", color: "bg-blue-500" },
    { name: "ExpectedConditions.elementToBeClickable()", color: "bg-emerald-500" },
    { name: "FluentWait", color: "bg-orange-400" },
    { name: "implicitlyWait()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "page.waitForSelector()", color: "bg-blue-500" },
    { name: "page.waitForTimeout()", color: "bg-purple-500" },
    { name: "expect(locator).toBeVisible()", color: "bg-emerald-500" },
    { name: "waitForResponse()", color: "bg-orange-400" },
    { name: "waitForLoadState()", color: "bg-red-500" },
  ],
};

const SLUG = "dynamic-waits";

const WaitPage = () => {
  const [activeTech, setActiveTech] = useState("selenium");

  // Scenario 2 — delayed element
  const [showDelayed, setShowDelayed] = useState(false);
  const [scenario2Loading, setScenario2Loading] = useState(false);

  // Scenario 3 — enable button after delay
  const [btnEnabled, setBtnEnabled] = useState(false);
  const [activating, setActivating] = useState(false);

  // Scenario 4 — load data / text change
  const [loadStatus, setLoadStatus] = useState("idle"); // idle | loading | loaded

  // Scenario 5 — spinner
  const [spinnerActive, setSpinnerActive] = useState(false);
  const [spinnerDone, setSpinnerDone] = useState(false);

  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

  function handleDelayedAlert() {
    setTimeout(() => {
      alert("✅ Appreciate you waiting! I had to negotiate a peace treaty with my 🕓 alarm clock.");
    }, 2000);
  }

  function handleShowElement() {
    setShowDelayed(false);
    setScenario2Loading(true);
    setTimeout(() => {
      setScenario2Loading(false);
      setShowDelayed(true);
    }, 3000);
  }

  function handleActivateButton() {
    setBtnEnabled(false);
    setActivating(true);
    setTimeout(() => {
      setActivating(false);
      setBtnEnabled(true);
    }, 3000);
  }

  function handleLoadData() {
    setLoadStatus("loading");
    setTimeout(() => setLoadStatus("loaded"), 3000);
  }

  function handleStartSpinner() {
    setSpinnerDone(false);
    setSpinnerActive(true);
    setTimeout(() => {
      setSpinnerActive(false);
      setSpinnerDone(true);
    }, 3000);
  }

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
          Dynamic Waits Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Practice explicit waits, implicit waits, and Playwright auto-waiting —
          handling delayed alerts, lazy elements, spinners, and state changes in
          real automation scenarios.
        </p>
      </div>

      {/* B. Main Layout Row */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* B1. Practice Card */}
        <section
          aria-label="Dynamic waits practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

              {/* Scenario 1: Delayed alert */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 1: Wait for a delayed alert (2 seconds)
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Click the button — a browser alert fires after a 2-second delay.
                  Use explicit wait for <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">alertIsPresent()</code>.
                </p>
                <Button
                  id="btn-delayed-alert"
                  name="btn-delayed-alert"
                  data-testid="btn-delayed-alert"
                  onClick={handleDelayedAlert}
                >
                  Trigger Delayed Alert
                </Button>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 2: Wait for element to appear */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 2: Wait for hidden element to appear (3 seconds)
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Element is hidden until the delay completes. Wait for
                  visibility before asserting its text.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    id="btn-show-element"
                    name="btn-show-element"
                    data-testid="btn-show-element"
                    variant="outline"
                    onClick={handleShowElement}
                    disabled={scenario2Loading}
                  >
                    {scenario2Loading ? "Waiting..." : "Show Element"}
                  </Button>
                  {showDelayed && !scenario2Loading && (
                    <span
                      id="delayed-element"
                      data-testid="delayed-element"
                      className="text-sm font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      Element is now visible!
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 3: Wait for button to enable */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 3: Wait for disabled button to become enabled (3 seconds)
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Click &quot;Activate Button&quot; to start the countdown. Wait for
                  the target button to become clickable before interacting.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    id="btn-activate-trigger"
                    name="btn-activate-trigger"
                    data-testid="btn-activate-trigger"
                    variant="outline"
                    onClick={handleActivateButton}
                    disabled={activating}
                  >
                    {activating ? "Activating..." : "Activate Button"}
                  </Button>
                  <Button
                    id="btn-enable-after-delay"
                    name="btn-enable-after-delay"
                    data-testid="btn-enable-after-delay"
                    disabled={!btnEnabled}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40"
                  >
                    {btnEnabled ? "Now Clickable!" : "Waiting to Enable"}
                  </Button>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 4: Text changes */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 4: Wait for loading text to change (3 seconds)
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Status text transitions from <em>idle</em> → <em>Loading...</em> →{" "}
                  <em>Data Loaded!</em>. Assert the final text after the delay.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    id="btn-load-data"
                    name="btn-load-data"
                    data-testid="btn-load-data"
                    variant="outline"
                    onClick={handleLoadData}
                    disabled={loadStatus === "loading"}
                  >
                    {loadStatus === "loading" ? "Loading..." : "Load Data"}
                  </Button>
                  {loadStatus !== "idle" && (
                    <span
                      id="load-status"
                      data-testid="load-status"
                      className={`text-sm font-medium ${
                        loadStatus === "loaded"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {loadStatus === "loaded" ? "Data Loaded!" : "Loading..."}
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 5: Spinner */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 5: Wait for spinner to disappear (3 seconds)
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  A spinner appears on click and vanishes after 3 seconds. Wait
                  for it to become hidden before asserting the done state.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    id="btn-start-spinner"
                    name="btn-start-spinner"
                    data-testid="btn-start-spinner"
                    variant="outline"
                    onClick={handleStartSpinner}
                    disabled={spinnerActive}
                  >
                    Start Spinner
                  </Button>
                  {spinnerActive && (
                    <Loader2
                      id="spinner"
                      data-testid="spinner"
                      size={20}
                      className="animate-spin text-blue-500"
                    />
                  )}
                  {spinnerDone && !spinnerActive && (
                    <span
                      id="spinner-done"
                      data-testid="spinner-done"
                      className="text-sm font-medium text-emerald-600 dark:text-emerald-400"
                    >
                      Done! Spinner gone.
                    </span>
                  )}
                </div>
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
          {dynamicWaitsTC.map((tc) => (
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

export default WaitPage;
