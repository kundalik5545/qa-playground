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
import {
  GraduationCap,
  Clock,
  Lock,
  Eye,
  CheckCircle2,
  ListChecks,
  BookOpen,
  Video,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { inputFieldTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";

const techMethods = {
  selenium: [
    { name: "sendKeys()", color: "bg-purple-500" },
    { name: "clear()", color: "bg-red-400" },
    { name: "getAttribute()", color: "bg-blue-500" },
    { name: "isEnabled()", color: "bg-emerald-500" },
    { name: "Keys.TAB", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "fill()", color: "bg-blue-500" },
    { name: 'press("Tab")', color: "bg-orange-400" },
    { name: "inputValue()", color: "bg-purple-500" },
    { name: "toBeDisabled()", color: "bg-red-500" },
    { name: "toHaveAttribute()", color: "bg-emerald-500" },
  ],
};

const SLUG = "input-fields";

const InputPage = () => {
  const [text, setText] = useState("QA PlayGround Clear Me");
  const [activeTech, setActiveTech] = useState("selenium");

  const res = practiceResources[SLUG];
  const badgeClass = difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="px-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badgeClass}`}>
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
          Input Field Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Master text input interactions in Selenium &amp; Playwright — typing,
          clearing, reading values, and detecting disabled/readonly states.
        </p>
      </div>

      {/* Main layout: Practice card (wider) + What You'll Learn (narrower) */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* Practice Card */}
        <section
          aria-label="Input field practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

              {/* Scenario 1: Movie Name Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 1: Movie Name Input
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <Input
                  id="movieName"
                  name="movieName"
                  data-testid="input-movie-name"
                  placeholder="Enter hollywood movie name"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 2: Append & Tab */}
              <div className="space-y-2">
                <Label
                  htmlFor="appendText"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Scenario 2: Append a text and press keyboard tab
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="appendText"
                    name="appendText"
                    data-testid="input-append-text"
                    defaultValue="I am good"
                  />
                  <span className="shrink-0 inline-flex items-center px-2.5 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
                    Tab
                  </span>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 3: Verify text present */}
              <div className="space-y-2">
                <Label
                  htmlFor="insideText"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Scenario 3: Verify text present inside input field
                </Label>
                <div className="relative">
                  <Input
                    id="insideText"
                    name="insideText"
                    data-testid="input-verify-text"
                    defaultValue="QA PlayGround"
                    className="pr-9 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/20"
                  />
                  <CheckCircle2
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none"
                  />
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 4: Clear the text */}
              <div className="space-y-2">
                <Label
                  htmlFor="clearText"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Scenario 4: Clear the text
                </Label>
                <Input
                  id="clearText"
                  name="clearText"
                  data-testid="input-clear-text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 5: Disabled */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="disabledInput"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Scenario 5: Check edit field is disabled
                  </Label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    <Lock size={9} /> DISABLED
                  </span>
                </div>
                <Input
                  id="disabledInput"
                  name="disabledInput"
                  data-testid="input-disabled"
                  value="Enter"
                  disabled
                  className="border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20"
                />
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 6: Readonly */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="readonlyInput"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Scenario 6: Check text is readonly
                  </Label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    <Eye size={9} /> READ-ONLY
                  </span>
                </div>
                <Input
                  id="readonlyInput"
                  name="readonlyInput"
                  data-testid="input-readonly"
                  value="This text is readonly"
                  readOnly
                  className="border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/20"
                />
              </div>

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
          {inputFieldTC.map((tc) => (
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

export default InputPage;
