"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { GraduationCap, Clock, ListChecks, Video, BookOpen } from "lucide-react";
import Link from "next/link";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";
import { dropdownTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";

const SLUG = "dropdowns";

const techMethods = {
  selenium: [
    { name: "Select.selectByVisibleText()", color: "bg-purple-500" },
    { name: "Select.selectByValue()", color: "bg-blue-500" },
    { name: "Select.getOptions()", color: "bg-orange-400" },
    { name: "Select.getAllSelectedOptions()", color: "bg-emerald-500" },
    { name: "Select.deselectAll()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "selectOption()", color: "bg-blue-500" },
    { name: "selectOption({ label })", color: "bg-purple-500" },
    { name: "locator.inputValue()", color: "bg-orange-400" },
    { name: "locator.allInnerTexts()", color: "bg-emerald-500" },
    { name: "toHaveValue()", color: "bg-red-500" },
  ],
};

// ─── Dropdown Practice Scenarios ─────────────────────────────────────────────

const DropdownPractice = () => {
  const [selectedFruit, setSelectedFruit] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedHeroes, setSelectedHeroes] = useState([]);

  return (
    <div className="space-y-5">

      {/* Scenario 1 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 1: Select by Visible Text
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Select &ldquo;Apple&rdquo; from the fruit dropdown using visible text.
        </p>
        <Select
          onValueChange={setSelectedFruit}
          name="fruit"
        >
          <SelectTrigger
            id="dropdown-fruit"
            data-testid="dropdown-fruit"
            className="w-full"
            aria-label="Fruit dropdown"
          >
            <SelectValue placeholder="Select Fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
          </SelectContent>
        </Select>
        {selectedFruit && (
          <p
            data-testid="result-fruit"
            className="text-xs bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md px-3 py-1.5"
          >
            Selected: <span className="font-semibold capitalize">{selectedFruit}</span>
          </p>
        )}
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 2 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 2: Select by Value Attribute
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Select &ldquo;India&rdquo; using its <code className="bg-muted px-1 rounded text-[11px]">value</code> attribute, not visible text.
        </p>
        <Select
          onValueChange={setSelectedCountry}
          name="country"
        >
          <SelectTrigger
            id="dropdown-country"
            data-testid="dropdown-country"
            className="w-full"
            aria-label="Country dropdown"
          >
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="india">India</SelectItem>
            <SelectItem value="usa">USA</SelectItem>
            <SelectItem value="uk">UK</SelectItem>
            <SelectItem value="argentina">Argentina</SelectItem>
          </SelectContent>
        </Select>
        {selectedCountry && (
          <p
            data-testid="result-country"
            className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md px-3 py-1.5"
          >
            Value: <span className="font-semibold">{selectedCountry}</span>
          </p>
        )}
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 3 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 3: Select Last Option &amp; Get All Options
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Select the last programming language, then retrieve all available options.
        </p>
        <Select
          onValueChange={setSelectedLanguage}
          name="language"
        >
          <SelectTrigger
            id="dropdown-language"
            data-testid="dropdown-language"
            className="w-full"
            aria-label="Programming language dropdown"
          >
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
          </SelectContent>
        </Select>
        {selectedLanguage && (
          <p
            data-testid="result-language"
            className="text-xs bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-md px-3 py-1.5"
          >
            Selected: <span className="font-semibold capitalize">{selectedLanguage}</span>
            &nbsp;·&nbsp;Options: Python, Java, JavaScript
          </p>
        )}
      </div>

      <hr className="border-gray-100 dark:border-gray-800" />

      {/* Scenario 4 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Scenario 4: Multi-Select (CTRL + Click)
          </span>
          <BookOpen size={15} className="text-gray-400 shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          Hold <kbd className="bg-muted border border-border px-1 rounded text-[11px] font-mono">Ctrl</kbd> and click to select multiple superheroes.
        </p>
        <select
          id="dropdown-heroes"
          name="heroes"
          data-testid="dropdown-heroes"
          multiple
          size={4}
          className="w-full border border-input rounded-md p-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring dark:border-gray-700"
          aria-label="Multi-select superheroes"
          onChange={(e) =>
            setSelectedHeroes(
              Array.from(e.target.selectedOptions, (o) => o.value)
            )
          }
        >
          <option value="ant-man">Ant-Man</option>
          <option value="aquaman">Aquaman</option>
          <option value="avengers">The Avengers</option>
          <option value="batman">Batman</option>
        </select>
        {selectedHeroes.length > 0 && (
          <p
            data-testid="result-heroes"
            className="text-xs bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-md px-3 py-1.5"
          >
            Selected ({selectedHeroes.length}): <span className="font-semibold capitalize">{selectedHeroes.join(", ")}</span>
          </p>
        )}
      </div>

    </div>
  );
};

// ─── Page Component ───────────────────────────────────────────────────────────

const SelectPage = () => {
  const [activeTech, setActiveTech] = useState("selenium");
  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

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
          Dropdown Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Master dropdown interactions in Selenium &amp; Playwright — select by visible text, select by value, retrieve all options, and handle multi-select elements.
        </p>
      </div>

      {/* Main layout: Practice card + What You'll Learn */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* Practice Card */}
        <section
          aria-label="Dropdown practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 text-sm">
              <DropdownPractice />
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
                    <li key={method.name} className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${method.color}`} />
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
          {dropdownTC.map((tc) => (
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

export default SelectPage;
