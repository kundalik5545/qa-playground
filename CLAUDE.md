# CLAUDE.md — QA Playground

> Machine-readable project context for Claude Code. Keep this up-to-date as the project evolves.
> Last updated: 2026-03-24

---

## Project Overview

**QA Playground** (`qatesting`) is an educational web platform for QA automation engineers to practice browser automation testing. It provides:

- 22+ interactive UI elements (inputs, buttons, tables, calendars, drag-drop, alerts, etc.) for Selenium/Playwright/Cypress practice
- A simulated Bank Demo App (login, accounts, dashboard, transactions) for end-to-end automation scenarios
- A Study Tracker App for tracking QA learning progress (syllabus, daily habits, progress)
- QA Tools section (JSON to file converter, more planned)
- A protected Admin Panel (site alerts management, response analytics)
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
| Framework | Next.js (App Router) | ^16.1.7 |
| Runtime | React | ^19.2.4 |
| Language | JavaScript/JSX | (no TypeScript) |
| Styling | Tailwind CSS | ^3.4.19 |
| UI Components | shadcn/ui (new-york style) | — |
| UI Primitives | Radix UI | various |
| Icons | lucide-react, react-icons | ^0.577.0, ^5.6.0 |
| Themes | next-themes | ^0.4.6 |
| Toast | sonner | ^2.0.7 |
| Date picker | react-day-picker | ^9.14.0 |
| Drawer | vaul | ^1.1.2 |
| Charts | recharts | ^2.15.4 |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities | ^6.3.1, ^10.0.0, ^3.2.2 |
| Auth | better-auth | ^1.5.6 |
| ORM | Prisma + @prisma/client | ^7.5.0 |
| DB adapter | @prisma/adapter-pg + pg | ^7.5.0, ^8.20.0 |
| Markdown parsing | unified, remark, rehype pipeline | various |
| Syntax highlighting | shiki, rehype-pretty-code | ^4.0.2, ^0.14.3 |
| SEO | next-sitemap | ^4.2.3 |
| Analytics | @vercel/analytics | ^2.0.1 |
| Bundler | Turbopack (dev) | built-in Next.js |
| Package manager | npm | — |
| Class merging | clsx + tailwind-merge (via `cn()`) | — |

**External Services:**
- Google Analytics: `G-Z4H9RTYGS4`
- Buy Me Coffee widget (in root layout)
- Usercentrics consent management (in root layout)
- ImageKit CDN (`ik.imagekit.io`) for images
- randomuser.me for avatar images
- PostgreSQL database (via `DATABASE_URL` env var) — used for admin auth and AlertResponse model

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
├── prisma/                       Prisma schema and migrations
├── Blog/                         Markdown content files (blog + element docs)
├── public/                       Static assets (SVGs, images, docs)
├── CLAUDE.md                     This file
├── package.json                  Dependencies and scripts
├── jsconfig.json                 Path alias config (@/*)
├── components.json               shadcn/ui config (new-york, slate base)
├── next.config.mjs               Image domains, server action size limit
├── vercel.json                   Vercel deployment config
├── next-sitemap.config.js        Sitemap generation (qaplayground.com)
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
│
├── api/
│   └── auth/[...all]/route.js    better-auth API handler (all auth endpoints)
│
├── actions/
│   └── alertActions.js           Server actions for site alert responses
│
├── (bank)/                       Route group: Bank Demo App
│   ├── layout.js                 Hides global header/footer on bank pages (client component)
│   └── bank/
│       ├── page.jsx              Login page (/bank) — creds: admin / admin123
│       ├── dashboard/page.jsx    Dashboard (/bank/dashboard)
│       ├── accounts/page.jsx     Accounts CRUD (/bank/accounts)
│       └── transactions/page.jsx Transaction management (/bank/transactions)
│
├── (admin)/                      Route group: Static/public pages
│   ├── layout.js
│   ├── about-me/page.jsx         /about-me
│   ├── about-us/page.jsx         /about-us
│   ├── contact-us/page.jsx       /contact-us
│   └── privacy-policy/page.jsx   /privacy-policy
│
├── (admin-public)/               Route group: Admin auth pages (no auth required)
│   └── admin/login/
│       ├── layout.js
│       └── page.jsx              Admin login page (/admin/login) — uses better-auth
│
├── (admin-protected)/            Route group: Protected admin panel (auth required)
│   └── admin/
│       ├── layout.js             Hides global header/footer, auth guard
│       ├── page.jsx              Redirects to /admin/site-alerts
│       ├── _components/
│       │   ├── SignOutButton.jsx  Sign out via better-auth
│       │   └── BodyClassSetter.jsx Sets body class for admin layout hiding
│       ├── site-alerts/page.jsx  Site alerts config management (/admin/site-alerts)
│       └── responses/
│           ├── page.jsx          Alert response analytics (/admin/responses) — reads Prisma
│           └── _components/
│               └── ResponseCharts.jsx  recharts bar + pie charts for responses
│
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
│   │       ├── TextsBoxPage.jsx
│   │       ├── MultiSelectPage.jsx
│   │       └── FormsPage.jsx
│   ├── learn/
│   │   ├── [slug]/page.jsx       Learning content pages (/learn/[slug])
│   │   └── _components/
│   │       ├── CoursesPage.jsx
│   │       └── LogicalPrograms.jsx
│   └── javascript/
│       └── [slug]/page.jsx       JS course pages (/javascript/[slug])
│
├── (tools)/                      Route group: QA Tools
│   ├── layout.js
│   └── qa-tools/
│       ├── page.jsx              QA Tools hub (/qa-tools)
│       ├── ToolCard.jsx          Tool card component
│       └── json-to-file/
│           ├── page.jsx          JSON to file converter (/qa-tools/json-to-file)
│           ├── JsonToFileContent.jsx  Main content component
│           └── _components/
│               ├── PageBreadcrumb.jsx
│               ├── PasteEditor.jsx
│               ├── JsonStatusBar.jsx
│               ├── FilenameDownload.jsx
│               ├── SuccessBanner.jsx
│               ├── HowItWorksSection.jsx
│               └── RelatedToolsBar.jsx
│
├── (blog)/
│   └── blog/page.jsx             Blog index (/blog)
│
└── study-tracker/                Study Tracker feature (NOT in a route group)
    ├── layout.js
    ├── page.jsx                  Study Tracker main page (/study-tracker)
    ├── study-tracker.css         Study Tracker specific styles
    ├── _components/
    │   ├── StudyTrackerApp.jsx   Main app shell — loads state, manages tabs
    │   ├── StudyTrackerLayout.jsx Layout wrapper with sidebar
    │   ├── StudySidebar.jsx      Navigation sidebar
    │   ├── DashboardView.jsx     Overview stats + charts
    │   ├── SyllabusView.jsx      Browse & track syllabus topics
    │   ├── DailyTrackerView.jsx  Daily study habits/log
    │   └── SyllabusManagerView.jsx Manage syllabi (create/edit/delete)
    ├── daily-tracker/page.jsx    /study-tracker/daily-tracker
    ├── syllabus-manager/
    │   ├── page.jsx              /study-tracker/syllabus-manager
    │   └── _components/
    │       ├── SyllabusManagerContent.jsx
    │       ├── SyllabusCard.jsx
    │       ├── NewSyllabusDialog.jsx
    │       ├── AiPromptDialog.jsx
    │       └── EditSyllabusPanel.jsx
    └── syllabus/[slug]/
        ├── page.jsx              /study-tracker/syllabus/[slug]
        └── _components/
            └── SyllabusDetailContent.jsx
```

### components/

```
components/
├── Header.jsx                    Main site nav with dark mode toggle
├── NavbarSheet.jsx               Mobile slide-out nav (Sheet component)
├── hero.jsx                      Hero section on landing page
├── app-sidebar.jsx               shadcn/ui Sidebar component instance
├── SiteAlertPopup.jsx            Site-wide alert popup (reads alertStorage config)
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
    ├── badge.jsx, button.jsx, calendar.jsx, card.jsx, chart.jsx, checkbox.jsx
    ├── dialog.jsx, drawer.jsx, dropdown-menu.jsx, input.jsx, label.jsx
    ├── popover.jsx, progress.jsx, radio-group.jsx, select.jsx, separator.jsx
    ├── sheet.jsx, sidebar.jsx, skeleton.jsx
    ├── sonner.jsx, switch.jsx, table.jsx, textarea.jsx, tooltip.jsx
```

### data/

```
data/
├── BasicSetting.js               basicDetails, allUrls, socialHandles
├── blogs.js                      Array of blog metadata objects
├── elementsTestCases.js          Test case arrays for each UI element
├── formsTestCases.js             Test case arrays for form elements
├── landingPage.js                statsData, featuresData, howItWorksData, testimonialsData
├── sitemap-links.js              siteMapUrls array for sitemap generation
└── studyTrackerSyllabi.js        Default syllabus data for Study Tracker
```

### lib/

```
lib/
├── utils.js                      cn() — clsx + tailwind-merge helper
├── bankStorage.js                localStorage abstraction for Bank Demo
├── studyTrackerStorage.js        Study Tracker persistence layer (IndexedDB + localStorage)
├── indexedDb.js                  Raw IndexedDB helpers (getIdbItem, setIdbItem, clearDb)
├── syllabusManagerDb.js          Syllabus manager DB helpers
├── alertStorage.js               Site alert config read/write (localStorage)
├── auth.js                       better-auth server config (email+password, Prisma adapter)
├── auth-client.js                better-auth client (createAuthClient)
└── prisma.js                     Prisma client singleton
```

### prisma/

```
prisma/
├── schema.prisma                 DB schema — User/Session/Account/Verification (better-auth) + AlertResponse
└── migrations/
    └── 20260323192247_init/      Initial migration SQL
```

### Blog/

```
Blog/
├── AutomationBlog/               Blog markdown posts
├── ElementBlogs/                 Element docs markdown (one per practice element)
└── JavascriptBlog/               JS syllabus content
```

---

## Architecture & Data Flow

### App Router Structure

Next.js App Router with route groups — `(bank)`, `(admin)`, `(admin-public)`, `(admin-protected)`, `(Practice)`, `(blog)`, `(tools)` — used for layout isolation. Route groups don't affect URL structure. `study-tracker/` is a real segment (not a route group).

### Data Flow

```
User → Page Component
  → data/*.js files (static arrays)            — landing page content, blog metadata
  → Blog/*.md files (markdown)                 — dynamic page content via unified pipeline
  → lib/bankStorage.js (localStorage)          — bank app state persistence
  → sessionStorage                             — bank login session auth
  → lib/studyTrackerStorage.js (IndexedDB)     — study tracker state (IndexedDB primary, localStorage fallback)
  → lib/alertStorage.js (localStorage)         — site alert config
  → Prisma → PostgreSQL                        — admin auth sessions, AlertResponse records
```

### State Management

| What | Where |
|---|---|
| Bank login session | `sessionStorage` — key: `bankUser` |
| Bank accounts + transactions | `localStorage` — managed via `lib/bankStorage.js` |
| Study Tracker state | `IndexedDB` (primary) → `localStorage` (fallback) via `lib/studyTrackerStorage.js` |
| Site alert config | `localStorage` — managed via `lib/alertStorage.js` |
| Admin auth sessions | PostgreSQL via Prisma + better-auth |
| Alert survey responses | PostgreSQL `alert_responses` table via Prisma |
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

### Study Tracker Data Flow

```
lib/studyTrackerStorage.js
├── loadStateFromIdb()     → async, reads all keys from IndexedDB
├── loadAllState()         → sync fallback, reads from localStorage
├── saveKey(key, value)    → writes to both IndexedDB and localStorage
├── clearAllData()         → clears IndexedDB and localStorage
├── getSyllabusStats()     → computes progress stats for a syllabus
└── getAllStats()           → aggregate stats across all syllabi

lib/indexedDb.js
├── getIdbItem(key)        → async IndexedDB get
├── setIdbItem(key, val)   → async IndexedDB set
└── clearDb()              → clears entire IndexedDB store

data/studyTrackerSyllabi.js → DEFAULT_SYLLABUS_DATA (seeded on first load)
```

### Admin Panel Data Flow

```
better-auth (lib/auth.js)
├── emailAndPassword enabled
├── Prisma adapter → PostgreSQL
└── API handler: app/api/auth/[...all]/route.js

Admin routes protected via (admin-protected) layout auth check.
Login at /admin/login via better-auth email+password.

lib/alertStorage.js → localStorage (client-side alert config)
app/actions/alertActions.js → Server Actions for saving alert survey responses to Prisma

Prisma models:
├── User, Session, Account, Verification  → better-auth standard models
└── AlertResponse                         → stores survey response JSON, userAgent, country
```

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

- Tailwind CSS utility classes everywhere — no CSS Modules (except `study-tracker.css` for study tracker specific styles)
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

22+ elements available:
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
14. Multi-Select (`MultiSelectPage.jsx`)
15. Slider
16. Waits (explicit/implicit wait scenarios)
17. Simple Table
18. Advanced Table
19. Calendar (date picker)
20. Forms (`FormsPage.jsx`)
21. File Upload/Download
22. Shadow DOM

### Study Tracker (`/study-tracker`)
- Dashboard: overall progress stats, streak tracking
- Syllabus View: browse topics, mark as complete/in-progress
- Daily Tracker: log daily study sessions and habits
- Syllabus Manager: create, edit, delete syllabi; AI prompt dialog for generating syllabus via AI
- State persisted in IndexedDB (primary) with localStorage fallback
- Default seed data from `data/studyTrackerSyllabi.js`
- Export/import state as JSON
- Routes: `/study-tracker`, `/study-tracker/daily-tracker`, `/study-tracker/syllabus-manager`, `/study-tracker/syllabus/[slug]`

### QA Tools (`/qa-tools`)
- Tool hub page listing available tools
- **JSON to File** (`/qa-tools/json-to-file`): paste JSON, validate, download as `.json` file

### Admin Panel (`/admin`)
- Login at `/admin/login` — email + password via better-auth
- Protected by `(admin-protected)` layout — redirects to login if not authenticated
- **Site Alerts** (`/admin/site-alerts`): configure site-wide popup alerts (type, message, enabled toggle, expiry)
- **Responses** (`/admin/responses`): view alert survey response analytics — bar chart (daily) + pie chart (answer distribution) using recharts; reads from PostgreSQL via Prisma

### Site Alert Popup
- `components/SiteAlertPopup.jsx` — shown site-wide based on config from `lib/alertStorage.js`
- Users can respond to a survey question in the popup
- Responses saved to PostgreSQL `alert_responses` table via server action in `app/actions/alertActions.js`

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

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string — required for Prisma/better-auth/AlertResponse |
| `BETTER_AUTH_URL` | Base URL for better-auth (defaults to `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Secret key for better-auth session signing |

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
- Exception: `app/study-tracker/study-tracker.css` for study tracker specific styles
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

### Study Tracker Rules

- All study tracker state must go through `lib/studyTrackerStorage.js` — never access IndexedDB or localStorage directly in components
- IndexedDB is primary storage; localStorage is fallback — `loadStateFromIdb()` is async, always await it on mount

### Admin Panel Rules

- Admin auth is handled by better-auth via `lib/auth.js` (server) and `lib/auth-client.js` (client)
- Never bypass the `(admin-protected)` layout auth check
- Alert responses must be saved via the server action in `app/actions/alertActions.js`, not direct Prisma calls from client

### Do NOT Touch

- `components/ui/` — these are shadcn/ui generated files. Use the shadcn CLI to update them, not manual edits
- `public/mainicons/` — SVG icons referenced by name from data files
- `.ai-project-config.json` — machine-readable metadata, update only when project structure changes significantly
- Google Analytics ID `G-Z4H9RTYGS4` in `app/layout.js` — do not change
- `next-sitemap.config.js` site URL — must remain `https://www.qaplayground.com/`
- `prisma/schema.prisma` better-auth models (User, Session, Account, Verification) — managed by better-auth, do not alter

### No TypeScript

This project uses plain JavaScript/JSX. Do not add `.ts` or `.tsx` files. Do not add type annotations.

---

## Known Issues / TODOs

- Several practice elements listed on the hub page (`/practice`) may not have corresponding `_components/` files yet (Drag, Drop, Sort, Slider, Shadow DOM, Frame).
- `Blog/ElementBlogs/test.md` appears to be a test/scratch file — review whether it should be kept.
- More QA Tools are planned beyond JSON to file (JWT decoder, Base64 encoder, regex tester, etc.).
- `DATABASE_URL` must be set in Vercel env vars for the admin panel and alert responses to work in production.

---

## My Preferences

- Be direct and blunt — no flattery
- Prefer targeted edits over full rewrites
- Always mention the file name before showing code
- Ask one clarifying question at a time, not five
- Flag bad approaches immediately before implementing
- No unnecessary dependencies — prefer native solutions
