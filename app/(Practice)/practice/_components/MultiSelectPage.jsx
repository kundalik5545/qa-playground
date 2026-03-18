"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, X } from "lucide-react";
import Link from "next/link";

const youtubeLink = "";

const MultiSelectPage = () => {
  return (
    <div className="pt-2">
      <h2 className="text-4xl font-semibold pl-1 py-4">Multi-Select</h2>
      <div className="flex flex-col sm:flex-row w-full gap-4">
        {/* Main Card Section */}
        <div className="w-full sm:w-2/3 pb-5 md:pb-0">
          <Card className="w-full shadow-lg rounded-xl dark:bg-gray-800">
            <CardContent className="space-y-6 pt-4 sm:pt-5 text-sm sm:text-base text-gray-900 dark:text-gray-200">
              <QAPlayGround />
            </CardContent>
          </Card>
        </div>

        {/* Insight Card */}
        <div className="w-full sm:w-1/3">
          <Card className="w-full shadow-lg rounded-xl dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between p-4 shadow-md dark:shadow-gray-800">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Insight
              </p>
              <GraduationCap className="text-gray-700 dark:text-teal-300" />
            </CardHeader>
            <CardContent className="p-4 text-center text-gray-800 dark:text-gray-300">
              <p className="font-light py-3 text-base">
                On completion of this exercise, you can learn the following
                concepts:
              </p>
              <LearningInsight />
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-200 dark:border-gray-700 p-4">
              <Link
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="underline text-blue-600 dark:text-teal-200 font-light hover:text-blue-800 dark:hover:text-teal-300">
                  Watch tutorial
                </span>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectPage;

// ─── QA Playground Section ────────────────────────────────────────────────────

const QAPlayGround = () => {
  // 1. Native multi-select — select multiple fruits
  const [selectedFruits, setSelectedFruits] = useState([]);

  // 2. Native multi-select — pre-selected values, deselect specific one
  const [selectedSkills, setSelectedSkills] = useState([
    "selenium",
    "playwright",
    "cypress",
  ]);

  // 3. Select all / deselect all
  const allCountries = ["India", "USA", "UK", "Germany", "Australia", "Japan"];
  const [selectedCountries, setSelectedCountries] = useState([]);

  // 4. Checkbox-based multi-select (common in modern UI apps)
  const techStack = [
    { id: "react", label: "React" },
    { id: "vue", label: "Vue" },
    { id: "angular", label: "Angular" },
    { id: "svelte", label: "Svelte" },
    { id: "nextjs", label: "Next.js" },
  ];
  const [checkedTech, setCheckedTech] = useState([]);

  // 5. Tag/chip-based multi-select
  const availableTags = [
    "automation",
    "selenium",
    "playwright",
    "cypress",
    "jest",
    "testing",
  ];
  const [selectedTags, setSelectedTags] = useState([]);

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleNativeMultiSelect = (e, setter) => {
    setter(Array.from(e.target.selectedOptions, (opt) => opt.value));
  };

  const handleSelectAll = () => setSelectedCountries([...allCountries]);
  const handleDeselectAll = () => setSelectedCountries([]);

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
    <>
      {/* ── 1. Basic native multi-select ───────────────────────────────────── */}
      <div>
        <p className="font-semibold mb-1">
          1. Select multiple fruits (hold Ctrl / Cmd to select more than one)
        </p>
        <select
          id="fruitMultiSelect"
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
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Selected:{" "}
          <span className="font-medium text-blue-600 dark:text-teal-300">
            {selectedFruits.length > 0 ? selectedFruits.join(", ") : "None"}
          </span>
        </p>
      </div>

      {/* ── 2. Pre-selected values — deselect a specific one ───────────────── */}
      <div>
        <p className="font-semibold mb-1">
          2. Deselect &quot;Playwright&quot; from the pre-selected skills
        </p>
        <select
          id="skillsMultiSelect"
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
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Selected:{" "}
          <span className="font-medium text-blue-600 dark:text-teal-300">
            {selectedSkills.length > 0 ? selectedSkills.join(", ") : "None"}
          </span>
        </p>
      </div>

      {/* ── 3. Select all / Deselect all ───────────────────────────────────── */}
      <div>
        <p className="font-semibold mb-1">
          3. Select all countries, then deselect all
        </p>
        <div className="flex gap-3 mb-2">
          <Button
            id="selectAllBtn"
            data-testid="select-all-btn"
            size="sm"
            variant="outline"
            onClick={handleSelectAll}
          >
            Select All
          </Button>
          <Button
            id="deselectAllBtn"
            data-testid="deselect-all-btn"
            size="sm"
            variant="outline"
            onClick={handleDeselectAll}
          >
            Deselect All
          </Button>
        </div>
        <select
          id="countryMultiSelect"
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
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Selected count:{" "}
          <span
            id="countryCount"
            data-testid="country-count"
            className="font-medium text-blue-600 dark:text-teal-300"
          >
            {selectedCountries.length}
          </span>
        </p>
      </div>

      {/* ── 4. Checkbox-based multi-select ─────────────────────────────────── */}
      <div>
        <p className="font-semibold mb-2">
          4. Select all frontend frameworks you know (checkbox multi-select)
        </p>
        <div
          id="techCheckboxGroup"
          data-testid="tech-checkbox-group"
          className="space-y-2 border rounded-md p-3 bg-white dark:bg-gray-700 dark:border-gray-600"
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
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Selected:{" "}
          <span className="font-medium text-blue-600 dark:text-teal-300">
            {checkedTech.length > 0 ? checkedTech.join(", ") : "None"}
          </span>
        </p>
      </div>

      {/* ── 5. Tag/chip-based multi-select ─────────────────────────────────── */}
      <div>
        <p className="font-semibold mb-2">
          5. Add and remove tags (chip/tag-style multi-select)
        </p>

        {/* Selected tags display */}
        <div
          id="tagSelectedArea"
          data-testid="tag-selected-area"
          className="min-h-10 flex flex-wrap gap-2 border rounded-md p-2 mb-3 bg-white dark:bg-gray-700 dark:border-gray-600"
        >
          {selectedTags.length === 0 ? (
            <span className="text-gray-400 text-sm self-center">
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

        {/* Available tags to click */}
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
              className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-blue-600 text-white border-blue-600 dark:bg-teal-600 dark:border-teal-600"
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
          className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        >
          Total tags selected:{" "}
          <span
            id="tagCount"
            data-testid="tag-count"
            className="font-medium text-blue-600 dark:text-teal-300"
          >
            {selectedTags.length}
          </span>
        </p>
      </div>
    </>
  );
};

// ─── Learning Insight Section ─────────────────────────────────────────────────

const LearningInsight = () => {
  return (
    <>
      <ol className="font-light list-decimal pl-6 text-left space-y-1">
        <li>SelectElement — isMultiple()</li>
        <li>selectByVisibleText()</li>
        <li>selectByIndex()</li>
        <li>selectByValue()</li>
        <li>deselectByVisibleText()</li>
        <li>deselectAll()</li>
        <li>getAllSelectedOptions()</li>
        <li>Keys.CONTROL + click</li>
        <li>Checkbox — isSelected()</li>
        <li>findElements() — count</li>
        <li>Tag/chip click interactions</li>
      </ol>
    </>
  );
};
