# CLAUDE.md — QA Playground

> Machine-readable project context for Claude Code. Keep this up-to-date as the project evolves.

---

## Project Overview

**QA Playground** (`qatesting`) is an educational web platform for QA automation engineers to practice browser automation testing. It provides:

- 22 interactive UI elements (inputs, buttons, tables, calendars, drag-drop, alerts, etc.) for Selenium/Playwright/Cypress practice
- A simulated Bank Demo App (login, accounts, dashboard, transactions) for end-to-end automation scenarios
- Markdown-based blog and tutorials focused on QA automation
- JavaScript learning content

**Problem it solves:** QA engineers lack realistic, purpose-built playgrounds to practice automation. Most real apps aren't designed with testability in mind. This one is.

**Target audience:** QA automation engineers learning or practicing Selenium/Playwright/Cypress automation.

**Live URL:** https://www.qaplayground.com
**GitHub:** https://github.com/kundalik5545/qatesting
**Deployment:** Vercel

---

## Tech Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | ^15.1.2 |
| Runtime | React | ^19.2.1 |
| Language | JavaScript/JSX | (no TypeScript) |
| Styling | Tailwind CSS | ^3.4.1 |
| UI Components | shadcn/ui (new-york style) | — |
| UI Primitives | Radix UI | various |
| Icons | lucide-react, react-icons | ^0.468.0, ^5.5.0 |
| Themes | next-themes | ^0.4.4 |
| Toast | sonner | ^1.7.1 |
| Date picker | react-day-picker | ^9.4.4 |
| Drawer | vaul | ^1.1.2 |
| Markdown parsing | unified, remark, rehype pipeline | various |
| Syntax highlighting | shiki, rehype-pretty-code | ^1.29.2, ^0.14.0 |
| SEO | next-sitemap | ^4.2.3 |
| Analytics | @vercel/analytics | ^1.6.1 |
| Bundler | Turbopack (dev) | built-in Next.js |
| Package manager | npm | — |
| Class merging | clsx + tailwind-merge (via `cn()`) | — |

**External Services:**
- Google Analytics: `G-Z4H9RTYGS4`
- Buy Me Coffee widget (in root layout)
- Usercentrics consent management (in root layout)
- ImageKit CDN (`ik.imagekit.io`) for images
- randomuser.me for avatar images

**Path alias:** `@/*` maps to the project root.

---

## File Structure

### Root Level

```
/
├── app/                          Next.js App Router — all pages & layouts
├── components/                   React components (custom + shadcn/ui)
├── data/                         Static config and data arrays
├── lib/                          Utility functions and helpers
├── Blog/                         Markdown content files (blog + element docs)
├── public/                       Static assets (SVGs, images, docs)
├── CLAUDE.md                     This file
├── package.json                  Dependencies and scripts
├── jsconfig.json                 Path alias config (@/*)
├── components.json               shadcn/ui config (new-york, slate base)
├── next.config.mjs               Image domains, server action size limit
├── vercel.json                   Vercel deployment config
├── next-sitemap.config.js        Sitemap generation (qaplayground.com)
├── next-sitemap.config.js        Sitemap: https://www.qaplayground.com
├── .ai-project-config.json       Machine-readable project metadata (do not delete)
└── docs/                         Project documentation
    ├── AI_CODING_GUIDELINES.md   Rules and guidelines for AI agents
    ├── BANK_MIGRATION_NOTES.md   Bank feature migration notes
    └── DEV_QUICK_REFERENCE.md    Quick dev reference
```

### app/ — Routes & Layouts

```
app/
├── layout.js                     ROOT LAYOUT — providers, fonts, analytics, header/footer
├── page.js                       Landing page (/)
├── not-found.jsx                 404 page
├── globals.css                   Global Tailwind + CSS vars + custom utilities
├── robots.js                     SEO: robots.txt generator
├── sitemap.js                    SEO: sitemap.xml generator
├── favicon.ico

├── (bank)/                       Route group: Bank Demo App
│   ├── layout.js                 Hides global header/footer on bank pages (client component)
│   └── bank/
│       ├── page.jsx              Login page (/bank) — creds: admin / admin123
│       ├── dashboard/page.jsx    Dashboard (/bank/dashboard)
│       ├── accounts/page.jsx     Accounts CRUD (/bank/accounts)
│       └── transactions/page.jsx Transaction management (/bank/transactions)

├── (admin)/                      Route group: Static/admin pages
│   ├── layout.js
│   ├── about-me/page.jsx         /about-me
│   ├── about-us/page.jsx         /about-us
│   ├── contact-us/page.jsx       /contact-us
│   └── privacy-policy/page.jsx   /privacy-policy

├── (Practice)/                   Route group: Practice + Learn content
│   ├── layout.js
│   ├── practice/
│   │   ├── page.jsx              Practice hub (/practice) — grid of 22 elements
│   │   ├── layout.js
│   │   ├── [slug]/               Dynamic practice pages (/practice/[slug])
│   │   │   ├── page.jsx          Reads markdown + renders component
│   │   │   └── layout.js
│   │   └── _components/          One component per practice element
│   │       ├── InputPage.jsx
│   │       ├── ButtonPage.jsx
│   │       ├── SelectPage.jsx
│   │       ├── LinkPage.jsx
│   │       ├── AlertPage.jsx
│   │       ├── RadioButton.jsx
│   │       ├── WindowsPage.jsx
│   │       ├── WaitPage.jsx
│   │       ├── FileUploadDownloadPage.jsx
│   │       ├── CalendarPage.jsx
│   │       ├── TablePage.jsx
│   │       ├── AdvanceTablePage.jsx
│   │       ├── ElementsPage.jsx
│   │       └── TextsBoxPage.jsx
│   ├── learn/
│   │   ├── [slug]/page.jsx       Learning content pages (/learn/[slug])
│   │   └── _components/
│   │       ├── CoursesPage.jsx
│   │       └── LogicalPrograms.jsx
│   └── javascript/
│       └── [slug]/page.jsx       JS course pages (/javascript/[slug])

└── (blog)/
    └── blog/page.jsx             Blog index (/blog)
```

### components/

```
components/
├── Header.jsx                    Main site nav with dark mode toggle
├── NavbarSheet.jsx               Mobile slide-out nav (Sheet component)
├── hero.jsx                      Hero section on landing page
├── bank/
│   └── BankNavbar.jsx            Bank app nav — logout clears sessionStorage
├── lib/
│   ├── Footer.jsx                Site footer
│   ├── FooterLinks.jsx           Footer navigation links
│   ├── Mode-toggle.jsx           Dark/light toggle button (DropdownMenu)
│   ├── SocialShare.jsx           Social share utilities
│   └── theme-provider.jsx        next-themes ThemeProvider wrapper
└── ui/                           shadcn/ui base components — DO NOT HAND-EDIT
    ├── accordion.jsx, alert.jsx, alert-dialog.jsx, avatar.jsx
    ├── badge.jsx, button.jsx, calendar.jsx, card.jsx, checkbox.jsx
    ├── dialog.jsx, drawer.jsx, dropdown-menu.jsx, input.jsx, label.jsx
    ├── popover.jsx, progress.jsx, radio-group.jsx, select.jsx, sheet.jsx
    ├── sonner.jsx, switch.jsx, table.jsx, textarea.jsx, tooltip.jsx
```

### data/

```
data/
├── BasicSetting.js               basicDetails, allUrls, socialHandles
├── blogs.js                      Array of 6 blog metadata objects
├── elementsTestCases.js          Test case arrays for each UI element
├── formsTestCases.js             Test case arrays for form elements
├── landingPage.js                statsData, featuresData, howItWorksData, testimonialsData
└── sitemap-links.js              siteMapUrls array for sitemap generation
```

### lib/

```
lib/
├── utils.js                      cn() — clsx + tailwind-merge helper
└── bankStorage.js                localStorage abstraction for Bank Demo
```

### Blog/

```
Blog/
├── AutomationBlog/               Blog markdown posts (7 posts)
├── ElementBlogs/                 Element docs markdown (15 files, one per practice element)
└── JavascriptBlog/               JS syllabus content
```

---

## Architecture & Data Flow

### App Router Structure

Next.js App Router with route groups — `(bank)`, `(admin)`, `(Practice)`, `(blog)` — used purely for layout isolation. Route groups don't affect URL structure.

### Data Flow

```
User → Page Component
  → data/*.js files (static arrays)           — landing page content, blog metadata
  → Blog/*.md files (markdown)                — dynamic page content via unified pipeline
  → lib/bankStorage.js (localStorage)         — bank app state persistence
  → sessionStorage                            — bank login session auth
```

**No database.** The `DATABASE_URL` in `vercel.json` is an empty placeholder. All Bank Demo data lives in the browser's `localStorage`.

### State Management

| What | Where |
|---|---|
| Bank login session | `sessionStorage` — key: `bankUser` |
| Bank accounts + transactions | `localStorage` — managed via `lib/bankStorage.js` |
| Theme (dark/light) | `next-themes` — class-based on `<html>` |
| Toast notifications | `sonner` via `<Toaster>` in root layout |
| All other state | Local `useState` in components — no global store |

### Markdown Pipeline (for Blog + Practice pages)

```
.md file (Blog/) → gray-matter (frontmatter) → unified pipeline:
  remark-parse → remark-gfm → remark-rehype
  → rehype-slug → rehype-autolink-headings
  → rehype-pretty-code (shiki highlighting) → rehype-stringify
→ HTML string → dangerouslySetInnerHTML in page component
```

### Dynamic Practice Pages ([slug])

1. `generateStaticParams()` reads all `.md` files from `Blog/ElementBlogs/`
2. Page reads the matching `.md` file, parses frontmatter + content
3. A `componentMap` object maps slug → React component (e.g. `"input"` → `<InputPage />`)
4. Both the markdown content AND the interactive component render on the same page

### Bank App Data Flow

```
lib/bankStorage.js
├── initializeData()       → seeds localStorage with default admin account
├── getAccounts()          → reads from localStorage
├── saveAccount()          → writes to localStorage
├── getTransactions()      → reads from localStorage
├── saveTransaction()      → writes, also calls updateAccountBalance()
└── clearAllData()         → nukes all localStorage keys
```

Bank pages check `sessionStorage` for auth on every load and redirect to `/bank` (login) if not authenticated.

---

## Design System

### Colors & Theme

Uses **CSS variables** defined in `app/globals.css` for light + dark mode, following shadcn/ui's `new-york` style with **slate** as base color.

| Token | Usage |
|---|---|
| `--background` / `--foreground` | Page background and text |
| `--primary` | Primary action color (slate-based) |
| `--muted` | Muted text/backgrounds |
| `--card` | Card backgrounds |
| `--border` | Borders |
| `--ring` | Focus rings |
| `--radius` | 0.5rem default border radius |

### Custom Utilities (globals.css)

```css
.gradient          /* blue-to-purple gradient background */
.gradient-sub      /* red-to-purple gradient background */
.gradient-title    /* gradient text (blue-to-purple) for headings */
.gradient-subTitle /* gradient text (red-to-purple) */
```

### Typography

- **Font:** Inter (Google Fonts, loaded in root layout)
- **Prose:** `@tailwindcss/typography` plugin applied to markdown-rendered content
- **Dark mode:** Class-based (`class` strategy in next-themes)

### CSS Approach

- Tailwind CSS utility classes everywhere — no CSS Modules
- CSS variables for theming (not hardcoded colors)
- Mobile-first responsive: `sm:`, `md:`, `lg:` breakpoint prefixes
- Custom bank-page hiding: `.bank-page header, .bank-page footer { display: none }` in globals.css

---

## Key Features Already Built

### Bank Demo Application (`/bank`)
- Login with hardcoded credentials (`admin` / `admin123`)
- "Remember me" via localStorage
- Dashboard: total balance card, accounts count, transactions count, recent transactions table
- Accounts page: list, create, edit, delete accounts
- Transactions page: create transactions (credit/debit), filter by account/type/date range
- Balance auto-updates when transactions are saved
- All localStorage — no backend, no API calls
- Automation-friendly: elements have `id`, `data-testid`, `data-action` attributes

### Practice Elements (`/practice`)

22 elements available:
1. POM (Page Object Model demonstration)
2. Input (text, password, email, number, textarea)
3. Button (click, double-click, right-click, disabled)
4. Select (single, multi-select dropdowns)
5. Links
6. Alert (alert, confirm, prompt dialogs)
7. Frame (iFrame handling)
8. Radio buttons & checkboxes
9. Window (new tab/window switching)
10. Elements (visibility, enabled state)
11. Drag & Drop
12. Drop Zone
13. Sort
14. Multi-Select
15. Slider
16. Waits (explicit/implicit wait scenarios)
17. Simple Table
18. Advanced Table
19. Calendar (date picker)
20. Forms
21. File Upload/Download
22. Shadow DOM

### Blog System (`/blog`, `/learn/[slug]`, `/javascript/[slug]`)
- Markdown-based content in `Blog/` directory
- Frontmatter metadata: title, description, date, author, image, tags, slug
- Syntax-highlighted code blocks (shiki)
- Prose-styled HTML output

### SEO
- `app/sitemap.js` — dynamic sitemap generation
- `app/robots.js` — robots.txt generation
- `next-sitemap` — post-build sitemap (configured for qaplayground.com)
- Per-page `generateMetadata()` for dynamic OG/Twitter tags
- Google Analytics (`G-Z4H9RTYGS4`)

### Landing Page (`/`)
- Hero section
- Stats cards
- Feature cards (from `data/landingPage.js`)
- How it works steps
- Testimonials
- Links to practice, tutorials, logic, and external products

---

## Conventions & Rules

### Naming

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase + `.jsx` | `InputPage.jsx`, `BankNavbar.jsx` |
| Pages | lowercase `page.jsx` or `page.js` | `page.jsx` |
| Layouts | lowercase `layout.js` | `layout.js` |
| Data files | camelCase `.js` | `basicSetting.js`, `landingPage.js` |
| Utilities | camelCase `.js` | `bankStorage.js`, `utils.js` |
| Slugs | kebab-case | `file-upload-download`, `advance-table` |

### Import Paths

Always use the `@/` alias — no relative paths:
```js
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { basicDetails } from "@/data/BasicSetting"
```

### Styling Rules

- **Tailwind only** — no inline styles, no CSS Modules, no styled-components
- Use `cn()` from `@/lib/utils` for conditional classes
- Dark mode variants via `dark:` prefix — do not break dark mode on any component
- Responsive via `sm:`, `md:`, `lg:` — never hardcode widths

### Practice Component Structure

Each practice component in `app/(Practice)/practice/_components/` follows this pattern:
1. `QAPlayGround` section — the interactive elements for automation testing
2. `LearningInsight` section — explanatory content for the learner

Both sections must be present in every practice component.

### Bank App Rules

- All bank data must go through `lib/bankStorage.js` — never read/write localStorage directly in components
- Auth check must happen at the top of every bank page (check `sessionStorage`, redirect if not found)
- Preserve all `id`, `data-testid`, and `data-action` attributes — these are the automation testing hooks

### Do NOT Touch

- `components/ui/` — these are shadcn/ui generated files. Use the shadcn CLI to update them, not manual edits
- `public/mainicons/` — SVG icons referenced by name from data files
- `.ai-project-config.json` — machine-readable metadata, update only when project structure changes significantly
- Google Analytics ID `G-Z4H9RTYGS4` in `app/layout.js` — do not change
- `next-sitemap.config.js` site URL — must remain `https://www.qaplayground.com/`

### No TypeScript

This project uses plain JavaScript/JSX. Do not add `.ts` or `.tsx` files. Do not add type annotations.

---

## Known Issues / TODOs

- **No TODO/FIXME comments** found in any source file at time of analysis.
- `DATABASE_URL` in `vercel.json` is empty — the bank app is fully client-side (localStorage). If a real database is ever added, this needs proper env setup.
- Several practice elements listed on the hub page (`/practice`) may not have corresponding `_components/` files yet (Drag, Drop, Sort, Multi-Select, Slider, Shadow DOM, Frame were listed in the hub but not all confirmed in `_components/`).
- `Blog/ElementBlogs/test.md` appears to be a test/scratch file — review whether it should be kept.

---

## My Preferences

- Be direct and blunt — no flattery
- Prefer targeted edits over full rewrites
- Always mention the file name before showing code
- Ask one clarifying question at a time, not five
- Flag bad approaches immediately before implementing
- No unnecessary dependencies — prefer native solutions
