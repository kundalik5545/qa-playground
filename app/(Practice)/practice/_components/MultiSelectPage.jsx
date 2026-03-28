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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, ListChecks, Video, X } from "lucide-react";
import Link from "next/link";
import { multiSelectTC } from "@/data/elementsTestCases";
import NextElementCard from "./NextElementCard";
import { practiceResources, difficultyStyles } from "@/data/practiceResources";

const techMethods = {
  selenium: [
    { name: "Select.selectByVisibleText()", color: "bg-purple-500" },
    { name: "Actions.keyDown(Keys.CONTROL)", color: "bg-blue-500" },
    { name: "Select.getAllSelectedOptions()", color: "bg-emerald-500" },
    { name: "Select.deselectByVisibleText()", color: "bg-orange-400" },
    { name: "Select.isMultiple()", color: "bg-slate-500" },
  ],
  playwright: [
    { name: "selectOption([...])", color: "bg-blue-500" },
    { name: "toHaveValues()", color: "bg-purple-500" },
    { name: "locator.evaluate()", color: "bg-orange-400" },
    { name: "locator.allInnerTexts()", color: "bg-emerald-500" },
    { name: "check() / isChecked()", color: "bg-red-500" },
  ],
};

const SLUG = "multi-select";

const MultiSelectPage = () => {
  const [activeTech, setActiveTech] = useState("selenium");

  // Scenario 1 — native multi-select fruits
  const [selectedFruits, setSelectedFruits] = useState([]);

  // Scenario 2 — pre-selected skills, deselect one
  const [selectedSkills, setSelectedSkills] = useState([
    "selenium",
    "playwright",
    "cypress",
  ]);

  // Scenario 3 — select all / deselect all
  const allCountries = ["India", "USA", "UK", "Germany", "Australia", "Japan"];
  const [selectedCountries, setSelectedCountries] = useState([]);

  // Scenario 4 — checkbox-based multi-select
  const techStack = [
    { id: "react", label: "React" },
    { id: "vue", label: "Vue" },
    { id: "angular", label: "Angular" },
    { id: "svelte", label: "Svelte" },
    { id: "nextjs", label: "Next.js" },
  ];
  const [checkedTech, setCheckedTech] = useState([]);

  // Scenario 5 — tag/chip multi-select
  const availableTags = [
    "automation",
    "selenium",
    "playwright",
    "cypress",
    "jest",
    "testing",
  ];
  const [selectedTags, setSelectedTags] = useState([]);

  const res = practiceResources[SLUG];
  const badgeClass =
    difficultyStyles[res.difficultyColor]?.badge ?? difficultyStyles.green.badge;

  const handleNativeMultiSelect = (e, setter) => {
    setter(Array.from(e.target.selectedOptions, (opt) => opt.value));
  };

  const toggleCheckbox = (id) => {
    setCheckedTech((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

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
          Multi-Select Automation Practice
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
          Practice selecting multiple options from native dropdowns, checkboxes,
          and chip-based selects — covering Ctrl+click, select/deselect all, and
          tag removal in Selenium &amp; Playwright.
        </p>
      </div>

      {/* B. Main Layout Row */}
      <div className="flex md:flex-row flex-col items-start gap-5">

        {/* B1. Practice Card */}
        <section
          aria-label="Multi-select practice exercises"
          className="flex-1 min-w-0"
        >
          <Card className="w-full shadow-md rounded-lg">
            <CardContent className="pt-5 pb-4 px-5 space-y-5 text-sm">

              {/* Scenario 1: Native multi-select */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 1: Select multiple fruits (hold Ctrl / Cmd)
                </span>
                <select
                  id="fruitMultiSelect"
                  name="fruitMultiSelect"
                  data-testid="fruit-multi-select"
                  multiple
                  size={5}
                  className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => handleNativeMultiSelect(e, setSelectedFruits)}
                  value={selectedFruits}
                >
                  <option value="apple">Apple</option>
                  <option value="banana">Banana</option>
                  <option value="grapes">Grapes</option>
                  <option value="mango">Mango</option>
                  <option value="orange">Orange</option>
                </select>
                <p
                  id="fruitSelectedOutput"
                  data-testid="fruit-selected-output"
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  Selected:{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {selectedFruits.length > 0 ? selectedFruits.join(", ") : "None"}
                  </span>
                </p>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 2: Deselect specific option */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 2: Deselect &quot;Playwright&quot; from pre-selected skills
                </span>
                <select
                  id="skillsMultiSelect"
                  name="skillsMultiSelect"
                  data-testid="skills-multi-select"
                  multiple
                  size={4}
                  className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) => handleNativeMultiSelect(e, setSelectedSkills)}
                  value={selectedSkills}
                >
                  <option value="selenium">Selenium</option>
                  <option value="playwright">Playwright</option>
                  <option value="cypress">Cypress</option>
                  <option value="appium">Appium</option>
                </select>
                <p
                  id="skillsSelectedOutput"
                  data-testid="skills-selected-output"
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  Selected:{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {selectedSkills.length > 0 ? selectedSkills.join(", ") : "None"}
                  </span>
                </p>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 3: Select all / deselect all */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 3: Select all countries, then deselect all
                </span>
                <div className="flex gap-2">
                  <Button
                    id="selectAllBtn"
                    name="selectAllBtn"
                    data-testid="select-all-btn"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCountries([...allCountries])}
                  >
                    Select All
                  </Button>
                  <Button
                    id="deselectAllBtn"
                    name="deselectAllBtn"
                    data-testid="deselect-all-btn"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCountries([])}
                  >
                    Deselect All
                  </Button>
                </div>
                <select
                  id="countryMultiSelect"
                  name="countryMultiSelect"
                  data-testid="country-multi-select"
                  multiple
                  size={5}
                  className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onChange={(e) =>
                    setSelectedCountries(
                      Array.from(e.target.selectedOptions, (o) => o.value)
                    )
                  }
                  value={selectedCountries}
                >
                  {allCountries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p
                  id="countrySelectedCount"
                  data-testid="country-selected-count"
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  Selected count:{" "}
                  <span
                    id="countryCount"
                    data-testid="country-count"
                    className="font-medium text-blue-600 dark:text-blue-400"
                  >
                    {selectedCountries.length}
                  </span>
                </p>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 4: Checkbox multi-select */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 4: Select frontend frameworks (checkbox multi-select)
                </span>
                <div
                  id="techCheckboxGroup"
                  data-testid="tech-checkbox-group"
                  className="space-y-1.5 border rounded-md p-3 bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  {techStack.map((tech) => (
                    <label
                      key={tech.id}
                      htmlFor={`tech-${tech.id}`}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 px-2 py-1 rounded"
                    >
                      <input
                        type="checkbox"
                        id={`tech-${tech.id}`}
                        name={`tech-${tech.id}`}
                        data-testid={`tech-checkbox-${tech.id}`}
                        value={tech.id}
                        checked={checkedTech.includes(tech.id)}
                        onChange={() => toggleCheckbox(tech.id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>{tech.label}</span>
                    </label>
                  ))}
                </div>
                <p
                  id="techSelectedOutput"
                  data-testid="tech-selected-output"
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  Selected:{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {checkedTech.length > 0 ? checkedTech.join(", ") : "None"}
                  </span>
                </p>
              </div>

              <hr className="border-gray-100 dark:border-gray-800" />

              {/* Scenario 5: Tag/chip multi-select */}
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Scenario 5: Add and remove tags (chip-style multi-select)
                </span>
                <div
                  id="tagSelectedArea"
                  data-testid="tag-selected-area"
                  className="min-h-10 flex flex-wrap gap-2 border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                >
                  {selectedTags.length === 0 ? (
                    <span className="text-gray-400 text-xs self-center">
                      No tags selected
                    </span>
                  ) : (
                    selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        id={`tag-badge-${tag}`}
                        data-testid={`tag-badge-${tag}`}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {tag}
                        <button
                          data-testid={`remove-tag-${tag}`}
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                          aria-label={`Remove ${tag}`}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
                <div
                  id="tagOptions"
                  data-testid="tag-options"
                  className="flex flex-wrap gap-2"
                >
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      id={`tag-option-${tag}`}
                      data-testid={`tag-option-${tag}`}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full border text-xs transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <p
                  id="tagCountOutput"
                  data-testid="tag-count-output"
                  className="text-xs text-gray-600 dark:text-gray-400"
                >
                  Total tags selected:{" "}
                  <span
                    id="tagCount"
                    data-testid="tag-count"
                    className="font-medium text-blue-600 dark:text-blue-400"
                  >
                    {selectedTags.length}
                  </span>
                </p>
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
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
                  {activeTech === "selenium" ? "Selenium (Java)" : "Playwright (JS / Python)"}
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

      {/* C. Test Cases */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Test Cases</h2>
        <Accordion type="multiple" className="space-y-2">
          {multiSelectTC.map((tc) => (
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

export default MultiSelectPage;
