# Project Design Style Guide

This file acts as a single source of truth for standard UI templates, design configurations, and component snippets used across the QA Playground project (such as specific cards, banners, and layouts).

**How to use (For AI Assistants):**
- When the user asks you to "create a card using the [Name] design", look up the design pattern here and copy the CSS/Tailwind structure exactly as documented.
- When the user says they like a design and asks you to add it here, append a new section following the template format below.

---

## Design Templates

### 1. QA/Related Tools Gradient Callout Card
**Name Reference:** `Related Tools Card`, `Tool Idea Card`, `Gradient Callout`
**Description:** A horizontally aligned callout block with a subtle background gradient (`from-blue-600/10 via-violet-600/10...`), rounded corners, and a border. It splits content neatly between a textual left side (Title & Subtitle) and an actionable right side (flex wrap buttons). Commonly used at the bottom of pages for upselling / secondary navigation.

**Code Template:**
```jsx
// Requires Link from next/link (and optionally lucide-react icons)
<div className="bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10 dark:from-blue-600/20 dark:via-violet-600/20 dark:to-blue-600/20 border border-blue-200 dark:border-blue-800 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
  <div>
    <p className="text-base font-bold text-foreground mb-1">
      {/* Title Text */}
    </p>
    <p className="text-sm text-muted-foreground">
      {/* Subtitle / Description Text */}
    </p>
  </div>
  <div className="flex gap-3 flex-wrap">
    {/* Secondary Action Link / Button */}
    <Link
      href="[URL_HERE]"
      prefetch={false}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-background border border-border hover:bg-muted text-foreground text-sm font-semibold transition-colors no-underline"
    >
      ← Secondary Action
    </Link>
    
    {/* Primary Action Link / Button */}
    <Link
      href="[URL_HERE]"
      prefetch={false}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors no-underline shadow-sm shadow-blue-500/20"
    >
      Primary Action →
    </Link>
  </div>
</div>
```
