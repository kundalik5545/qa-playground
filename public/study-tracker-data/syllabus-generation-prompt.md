# Syllabus Generation Prompt

Use the prompt below to ask any AI model (ChatGPT, Claude, Gemini, etc.) to generate a study syllabus compatible with the QA Study Tracker import format.

---

## Prompt (copy everything inside the box)

```
Generate a study syllabus for the topic: [YOUR TOPIC HERE]

Before the JSON, output exactly one line in this format:
FILENAME: <topic-slug>.json
where <topic-slug> is the lowercase, hyphenated version of the topic name (e.g. "playwright.json", "rest-api-testing.json", "docker-for-qa.json"). This is the file name the user should use when saving the output.

Then output the downloadable valid JSON object only. No explanation, no markdown fences, no extra text — just the downloadable JSON File with FILENAME.

Strictly follow this structure:

{
  "version": 1,
  "type": "qa-tracker-syllabus",
  "exportedAt": "<current ISO timestamp>",
  "syllabus": {
    "id": "<short-lowercase-id>",
    "label": "<Display Name>",
    "icon": "<single emoji>",
    "color": "<hex color code>",
    "sections": [
      {
        "id": "<syllabus-id>-s1",
        "title": "<Section Title>",
        "topics": [
          {
            "id": "<syllabus-id>-t1",
            "title": "<Topic Title>",
            "subtopics": [
              "<Subtopic 1>",
              "<Subtopic 2>",
              "<Subtopic 3>"
            ],
            "resources": []
          }
        ]
      }
    ]
  }
}

Rules to follow strictly:
1. "version" must always be 1.
2. "type" must always be exactly "qa-tracker-syllabus".
3. "exportedAt" must be a valid ISO 8601 timestamp (e.g. "2026-03-20T10:00:00.000Z").
4. "id" inside "syllabus" must be a short, lowercase, hyphenated string (e.g. "cypress", "rest-api", "java-basics").
5. Section IDs must follow the pattern: "<syllabus-id>-s1", "<syllabus-id>-s2", etc.
6. Topic IDs must follow the pattern: "<syllabus-id>-t1", "<syllabus-id>-t2", etc. (numbered sequentially across all sections, not resetting per section).
7. Each topic must have 2–5 subtopics as plain strings.
8. "resources" must always be an empty array [].
9. Organize topics into 3–5 logical sections (e.g. Fundamentals, Core Features, Advanced, CI/CD, Best Practices).
10. Each section should have 2–5 topics.
11. Choose a relevant emoji for the icon.
12. Choose a fitting hex color (avoid #ffffff and #000000).
13. Output must be valid JSON — no trailing commas, no comments.
14. Always begin your response with a FILENAME line (e.g. "FILENAME: playwright.json") before the JSON. The filename must be the topic slug with a .json extension — this is what the user will save the file as.
```

---

## Example Output (Playwright)

```json
{
  "version": 1,
  "type": "qa-tracker-syllabus",
  "exportedAt": "2026-03-20T07:01:01.793Z",
  "syllabus": {
    "id": "playwright",
    "label": "Playwright",
    "icon": "🎭",
    "color": "#dc2626",
    "sections": [
      {
        "id": "pw-s1",
        "title": "Playwright Fundamentals",
        "topics": [
          {
            "id": "pw-t1",
            "title": "Setup & Configuration",
            "subtopics": [
              "Installation",
              "playwright.config.ts",
              "Browsers & Devices"
            ],
            "resources": []
          },
          {
            "id": "pw-t2",
            "title": "Playwright Architecture",
            "subtopics": [
              "Auto-waiting",
              "Selectors",
              "Browser Contexts",
              "Pages"
            ],
            "resources": []
          }
        ]
      },
      {
        "id": "pw-s2",
        "title": "Core Features",
        "topics": [
          {
            "id": "pw-t3",
            "title": "Actions & Assertions",
            "subtopics": [
              "click, fill, check",
              "expect() API",
              "Soft Assertions"
            ],
            "resources": []
          },
          {
            "id": "pw-t4",
            "title": "Fixtures & Hooks",
            "subtopics": [
              "Built-in Fixtures",
              "Custom Fixtures",
              "beforeAll/afterEach"
            ],
            "resources": []
          },
          {
            "id": "pw-t5",
            "title": "Page Object Model",
            "subtopics": ["POM with Playwright", "Component Objects"],
            "resources": []
          },
          {
            "id": "pw-t6",
            "title": "Network Interception",
            "subtopics": ["route.fulfill()", "Mocking APIs", "Request Logging"],
            "resources": []
          }
        ]
      },
      {
        "id": "pw-s3",
        "title": "Advanced Playwright",
        "topics": [
          {
            "id": "pw-t7",
            "title": "Visual Testing",
            "subtopics": [
              "Screenshot Comparison",
              "toHaveScreenshot()",
              "Threshold Config"
            ],
            "resources": []
          },
          {
            "id": "pw-t8",
            "title": "Tracing & Debugging",
            "subtopics": ["Trace Viewer", "UI Mode", "PWDEBUG"],
            "resources": []
          },
          {
            "id": "pw-t9",
            "title": "Parallel Execution",
            "subtopics": ["Workers Config", "Sharding", "Test Grouping"],
            "resources": []
          },
          {
            "id": "pw-t10",
            "title": "CI/CD with Playwright",
            "subtopics": [
              "GitHub Actions",
              "HTML Reporter",
              "Allure Integration"
            ],
            "resources": []
          }
        ]
      }
    ]
  }
}
```

---

## How to Use

1. Copy the prompt above.
2. Replace `[YOUR TOPIC HERE]` with your desired topic (e.g. `Cypress`, `REST API Testing`, `Java for QA`, `Docker`).
3. Paste it into any AI chat (ChatGPT, Claude, Gemini, etc.).
4. Copy the JSON output.
5. Save it as a `.json` file.
6. Import it into the QA Study Tracker via the Syllabus Manager import option.

---

## Example Topics to Try

- `Cypress automation testing`
- `REST API Testing with Postman`
- `Selenium WebDriver with Java`
- `Docker for QA Engineers`
- `Java programming for beginners`
- `Git and GitHub for testers`
- `Performance Testing with k6`
- `SQL for QA Engineers`
