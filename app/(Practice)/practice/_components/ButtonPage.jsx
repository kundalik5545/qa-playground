"use client";
import React, { useCallback, useRef, useState } from "react";
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
import {
  GraduationCap,
  Clock,
  ListChecks,
  Video,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";
import { buttonTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";

const SLUG = "buttons";

const techMethods = {
  selenium: [
    { name: "click()", color: "bg-purple-500" },
    { name: "doubleClick()", color: "bg-blue-500" },
    { name: "contextClick()", color: "bg-orange-400" },
    { name: "isEnabled()", color: "bg-emerald-500" },
    { name: "getLocation()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "click()", color: "bg-blue-500" },
    { name: "dblclick()", color: "bg-purple-500" },
    { name: "click({button:'right'})", color: "bg-orange-400" },
    { name: "isDisabled()", color: "bg-red-500" },
    { name: "boundingBox()", color: "bg-emerald-500" },
  ],
};

const ClickHoldButton = () => {
  const [isHolding, setIsHolding] = useState(false);
  const [holdComplete, setHoldComplete] = useState(false);
  const timerRef = useRef(null);

  const handleMouseDown = () => {
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      setHoldComplete(true);
    }, 1500);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!holdComplete) {
      setHoldComplete(false);
    }
  };

  const buttonClass = holdComplete
    ? "bg-green-500 hover:bg-green-600 text-white"
    : isHolding
    ? "bg-yellow-400 hover:bg-yellow-500 text-gray-800"
    : "bg-blue-500 hover:bg-blue-600 text-white";

  const buttonText = holdComplete
    ? "Hold Complete!"
    : isHolding
    ? "Keep Holding..."
    : "Click and Hold!";

  return (
    <Button
      id="btn-click-hold"
      data-testid="btn-click-hold"
      className={buttonClass}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {buttonText}
    </Button>
  );
};

const ButtonPage = () => {
  const [lastAction, setLastAction] = useState("");
  const [activeTech, setActiveTech] = useState("selenium");

  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

  const handleRightClick = useCallback((e) => {
    e.preventDefault();
    setLastAction("You Right-clicked on button!");
  }, []);

  const handleDoubleClick = useCallback(() => {
    setLastAction("You Double-clicked on button!");
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero section */}
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
          Button Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Master button interactions in Selenium &amp; Playwright — click,
          double-click, right-click, disabled state, click-and-hold, and
          browser navigation.
        </p>
      </div>

      {/* Main layout: Practice card + What You'll Learn */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* Practice Card */}
        <section
          aria-label="Button practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

              {/* Scenario 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 1: Navigate to Home Page
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <Link href="/">
                  <Button
                    variant="destructive"
                    id="btn-goto-home"
                    data-testid="btn-goto-home"
                    className="mt-1"
                  >
                    Go To Home
                  </Button>
                </Link>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 2: Get Button X &amp; Y Coordinates
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <button
                  className="py-2 px-3 bg-teal-300 dark:bg-teal-700 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  id="btn-find-location"
                  data-testid="btn-find-location"
                >
                  Find Location
                </button>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 3 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 3: Get Button Color
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <button
                  className="py-2 px-3 bg-blue-300 dark:bg-blue-700 rounded-lg text-gray-800 dark:text-gray-100 text-sm"
                  id="btn-find-color"
                  data-testid="btn-find-color"
                >
                  Find my color?
                </button>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 4 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 4: Get Button Height &amp; Width
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <Button
                  id="btn-size"
                  data-testid="btn-size"
                  className="mt-1"
                >
                  Do you know my size?
                </Button>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 5 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 5: Disabled Button
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    DISABLED
                  </span>
                </div>
                <Button
                  variant="destructive"
                  disabled
                  className="cursor-not-allowed pointer-events-none mt-1"
                  aria-disabled="true"
                  aria-label="Action Disabled"
                  id="btn-disabled"
                  data-testid="btn-disabled"
                >
                  Disabled
                </Button>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 6 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 6: Click and Hold for 1.5 sec
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <ClickHoldButton />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 7 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 7: Double Click Button
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <Button
                  onDoubleClick={handleDoubleClick}
                  id="btn-double-click"
                  data-testid="btn-double-click"
                  aria-label="Double Click Me"
                  className="mt-1"
                >
                  Double Click Me
                </Button>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 8 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 8: Right Click Button
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <Button
                  onContextMenu={handleRightClick}
                  id="btn-right-click"
                  data-testid="btn-right-click"
                  variant="outline"
                  aria-label="Right Click Me"
                  className="mt-1"
                >
                  Right Click Me
                </Button>
              </div>

              {/* Action feedback */}
              <p
                id="btn-action-result"
                data-testid="btn-action-result"
                className="bg-blue-400 dark:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm"
              >
                {lastAction || "No action performed yet."}
              </p>

            </CardContent>
          </Card>
        </section>

        {/* What You'll Learn + Up Next sidebar */}
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
                    <li
                      key={method.name}
                      className="flex items-center gap-2 text-sm"
                    >
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

      {/* Test Cases */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Test Cases</h2>
        <Accordion type="multiple" className="space-y-2">
          {buttonTC.map((tc) => (
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

export default ButtonPage;
