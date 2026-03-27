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
  ListChecks,
  Video,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";
import { radioBoxTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";

const SLUG = "radio-checkbox";

const techMethods = {
  selenium: [
    { name: "click()", color: "bg-purple-500" },
    { name: "isSelected()", color: "bg-emerald-500" },
    { name: 'getAttribute("checked")', color: "bg-blue-500" },
    { name: "findElements()", color: "bg-slate-500" },
    { name: "isEnabled()", color: "bg-amber-500" },
  ],
  playwright: [
    { name: "check()", color: "bg-blue-500" },
    { name: "uncheck()", color: "bg-red-400" },
    { name: "isChecked()", color: "bg-emerald-500" },
    { name: "locator.all()", color: "bg-purple-500" },
    { name: "toBeChecked()", color: "bg-orange-400" },
  ],
};

const RadioButtonPage = () => {
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [activeTech, setActiveTech] = useState("selenium");

  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

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
          Radio &amp; Checkbox Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Master radio button and checkbox interactions in Selenium &amp;
          Playwright — selecting, verifying state, detecting disabled elements,
          and spotting bugs in grouped inputs.
        </p>
      </div>

      {/* Main layout: Practice card + What You'll Learn */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* Practice Card */}
        <section
          aria-label="Radio and checkbox practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

              {/* Scenario 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 1: Select Any One Radio Button
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="selectOne"
                      value="yes"
                      id="radio-yes-1"
                      data-testid="radio-yes-1"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="selectOne"
                      value="no"
                      id="radio-no-1"
                      data-testid="radio-no-1"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">No</span>
                  </label>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 2 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 2: Confirm Only One Radio Can Be Selected
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="confirm"
                      value="yes"
                      id="radio-yes-2"
                      data-testid="radio-yes-2"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="confirm"
                      value="no"
                      id="radio-no-2"
                      data-testid="radio-no-2"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">No</span>
                  </label>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 3 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 3: Find the Bug
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    {/* Intentional bug: these two radios are in different groups */}
                    <input
                      type="radio"
                      name="nobug"
                      value="yes"
                      id="radio-bug-yes"
                      data-testid="radio-bug-yes"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="bug"
                      value="no"
                      id="radio-bug-no"
                      data-testid="radio-bug-no"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">No</span>
                  </label>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 4 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 4: Find Which Radio Is Selected
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="find"
                      value="foo"
                      id="radio-foo"
                      data-testid="radio-foo"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Foo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="find"
                      value="bar"
                      id="radio-bar"
                      data-testid="radio-bar"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Bar</span>
                  </label>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 5 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 5: Disabled Radio Button
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    DISABLED
                  </span>
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="disabled"
                      value="going"
                      id="radio-going"
                      data-testid="radio-going"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Going</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="disabled"
                      value="not-going"
                      id="radio-not-going"
                      data-testid="radio-not-going"
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Not going</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-not-allowed opacity-50">
                    <input
                      type="radio"
                      name="disabled"
                      value="maybe"
                      id="radio-maybe"
                      data-testid="radio-maybe"
                      disabled
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Maybe</span>
                  </label>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 6 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 6: Check If Checkbox Is Selected
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    id="checkbox-remember-me"
                    data-testid="checkbox-remember-me"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <span className="text-gray-700 dark:text-gray-300">Remember me</span>
                </label>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 7 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Scenario 7: Accept Terms and Conditions
                  </span>
                  <BookOpen size={15} className="text-gray-400 shrink-0" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    id="checkbox-terms"
                    data-testid="checkbox-terms"
                    checked={acceptTerms}
                    onCheckedChange={setAcceptTerms}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    I agree to the FAKE terms and conditions
                  </span>
                </label>
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
          {radioBoxTC.map((tc) => (
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

export default RadioButtonPage;
