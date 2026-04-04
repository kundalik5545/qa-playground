---
description: How to save UI templates to project-design-style.md
---

# Updating Project Design Styles

When the user discovers a layout, card, component, or general UI design and asks to "add this to our design style guide" or similar:

1. Identify the name the user wants this template to be referred to as (or ask them for a good name).
2. Extract the complete structural component code (JSX/React markup) alongside its full Tailwind CSS utility string list. Replace the strict variables/text with recognizable blank placeholders like `[Title Text]` or `[URL_HERE]`. Include layout and nested hierarchies.
3. Open `project-design-style.md` from the project root.
4. Go to the bottom of the `## Design Templates` list.
5. Create a new `###` header incrementing the index number (e.g. `### 2. [Template Name]`).
6. Follow the existing template pattern exactly. You must output:
   - `**Name Reference:**` listing the semantic trigger names AI should listen for.
   - `**Description:**` a short sentence on what it is and when it is normally used.
   - `**Code Template:**` the raw JSX wrapped into an explicit Markdown codebase block formatted correctly.
7. After doing this, you've successfully created an abstract UI template the user can ask for by name later. Notify the user what alias they can use to invoke the template.
