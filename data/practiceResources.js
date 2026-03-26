/**
 * practiceResources.js
 *
 * Central registry for all practice element metadata.
 * Keys match the URL slugs in /practice/[slug].
 *
 * To add a YouTube tutorial link: set youtubeUrl to the full URL string.
 * To add a related element: add its slug to relatedElements[].
 */

export const practiceResources = {
  "input-fields": {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 15,
    scenarioCount: 6,
    youtubeUrl: "",
    relatedElements: ["dropdowns", "forms", "radio-checkbox"],
  },
  buttons: {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 10,
    scenarioCount: 8,
    youtubeUrl: "",
    relatedElements: ["forms", "links"],
  },
  forms: {
    difficulty: "Intermediate",
    difficultyColor: "yellow",
    timeMin: 20,
    scenarioCount: 8,
    youtubeUrl: "",
    relatedElements: ["input-fields", "dropdowns", "radio-checkbox"],
  },
  dropdowns: {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 12,
    scenarioCount: 4,
    youtubeUrl: "",
    relatedElements: ["input-fields", "multi-select"],
  },
  "data-table": {
    difficulty: "Intermediate",
    difficultyColor: "yellow",
    timeMin: 20,
    scenarioCount: 6,
    youtubeUrl: "",
    relatedElements: ["dynamic-waits"],
  },
  "alerts-dialogs": {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 10,
    scenarioCount: 3,
    youtubeUrl: "",
    relatedElements: ["tabs-windows"],
  },
  "radio-checkbox": {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 10,
    scenarioCount: 7,
    youtubeUrl: "",
    relatedElements: ["input-fields", "forms"],
  },
  "date-picker": {
    difficulty: "Intermediate",
    difficultyColor: "yellow",
    timeMin: 15,
    scenarioCount: 4,
    youtubeUrl: "",
    relatedElements: ["input-fields", "forms"],
  },
  links: {
    difficulty: "Beginner",
    difficultyColor: "green",
    timeMin: 8,
    scenarioCount: 4,
    youtubeUrl: "",
    relatedElements: ["tabs-windows"],
  },
  "tabs-windows": {
    difficulty: "Intermediate",
    difficultyColor: "yellow",
    timeMin: 15,
    scenarioCount: 4,
    youtubeUrl: "",
    relatedElements: ["links", "alerts-dialogs"],
  },
  "dynamic-waits": {
    difficulty: "Intermediate",
    difficultyColor: "yellow",
    timeMin: 20,
    scenarioCount: 5,
    youtubeUrl: "",
    relatedElements: ["data-table"],
  },
  "multi-select": {
    difficulty: "Intermediate",
    difficultyColor: "yellow",
    timeMin: 12,
    scenarioCount: 3,
    youtubeUrl: "",
    relatedElements: ["dropdowns"],
  },
  "file-upload": {
    difficulty: "Intermediate",
    difficultyColor: "yellow",
    timeMin: 15,
    scenarioCount: 5,
    youtubeUrl: "",
    relatedElements: ["forms"],
  },
};

/**
 * Difficulty badge Tailwind classes keyed by difficultyColor.
 * Full strings required — Tailwind purges dynamic class strings.
 */
export const difficultyStyles = {
  green: {
    badge:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400",
  },
  yellow: {
    badge:
      "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400",
  },
  red: {
    badge:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400",
  },
};
