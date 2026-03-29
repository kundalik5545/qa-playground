# GitHub Branch Progress

**Repo:** [kundalik5545/qatesting](https://github.com/kundalik5545/qatesting)

## Sequence and purpose of branches

- feat/prisma-setup
- feat/site-alert
- feat/localstorage-sync
- feat/css-migration-to-tailwindcss
- feat/user-activity-track
- fix/login-issues
- fix/network-issues
- fix/blog-page-ui-issues — blog card UI fixes, posts-per-page variable, Tailwind dynamic class lookup map
- fix/practice-page-ui-issues — SEO metadata, JSON-LD, canonical/og:url, H1 fix, card accessibility (aria-label, aria-hidden), invalid Link>Button nesting removed, nav aria-label, card hover effects, CTA labels standardized, 5 descriptions rewritten, POM Bank Demo badge; search bar + card reorder/rename; InputPage bugs fixed (label/id mismatch, name attrs, data-testid), hero section, disabled/readonly badges, insight card expanded, Playwright append code fix, [slug] breadcrumb + JSON-LD LearningResource, footer h3→h4; 10 slugs renamed + 301 redirects; created data/practiceResources.js (central registry for difficulty/time/youtubeUrl per element), refactored elementsTestCases.js (added steps to all TCs, fixed linksTC wrong data, removed unused text_boxTC), wired InputPage.jsx to practiceResources
- fix/login-ui-improvement ✅ — Login & Signup UI/UX + security overhaul (22/22 tasks)
- feat/habit-matrix ✅ — Recurring Habits tab redesign (20/20 tasks): removed Chart.js bar charts from HabitsView; added HabitMatrix component — interactive date-grid with Day/Week/Month view modes, per-habit checkbox rows using habitAppliesOnDate, clickable past/today cells, non-clickable future cells, blue ring on today, per-row 5px progress bar (purple → green at 100%), horizontal scroll for month view (28–31 cols), empty state
- fix/ui-issue-all-pages ✅ — Study Tracker UI fixes: sidebar collapse toggle with auto-collapse on screens <lg, logout dropdown overflow fix (moved scroll to inner div, popup opens right of sidebar when collapsed), daily tracker dark mode removed (CSS var override to force light mode), analytics grid responsive (grid-cols-1 xl:grid-cols-2), HabitMatrix integrated, resolved UI button issues across all study-tracker pages; **Plan 19 in progress** — daily tracker improvements: clear-data button + API, Prisma timeSlot field, GET fetch route, date bar 2xl+ fix, habit form UX simplification (remove repeat/indefinite/2months, add timeSlot input, cancel button), chart filter sync (unified viewMode), progress chart relocation, analytics filter unification (26 tasks — see `docs/tasks/19_DAILY_TRACKER_IMPROVEMENTS_TASKS.md`)
- fix/home-page-ui-improvements ✅ — Homepage audit fixes (24/24 tasks): meta description trim, author tag, preconnect hints, og:image prod URL, truncated H2 fix ("Caree"→"Career"), H1 space fix, sr-only H3 for heading level gap, skip-to-content link, hero coffee button demoted to text link, Study Tracker CTA renamed to "Start Tracking Now", footer empty anchor fixed + LinkedIn/GitHub added, QA Capture & Clipper in footer Platform column, practice cards hover CTA + equal height + difficulty/count badges, Browser Extensions section, FAQ accordion + FAQPage JSON-LD, schema @graph restructure + reviewCount fix (10000→127) + Organization schema, prefetch /practice /bank, testimonial images moved to local SVG avatars (see `docs/tasks/20_HOME_PAGE_UI_IMPROVMENTS_TASKS.md`)
- fix/small-bug-fix — Practice component standard UI migration (doc 15): ButtonPage ✅, RadioButton ✅, FormsPage ✅, SelectPage ✅, LinkPage ✅, AlertPage ✅, TablePage ✅ (12/12 tasks) — converted async QAPlayGround to useEffect client fetch, added Hero/tech-toggle/test-cases accordion, dataTableTC + data-table FAQ added (see `docs/tasks/15-10_DATA_TABLE_PAGE_UPGRADE_TASKS.md`)
- fix/recurring-task-sync-issue 🔄 — API security & sync bug fixes (0/9 tasks): fix deleted daily tasks reappearing for logged-in users (sync-only delete gap), email verification + forgot password via Resend, ApiKey expiry field, rate limiting on auth endpoints, sync endpoint validation, pagination on state endpoint (see `docs/tasks/API_OVERVIEW_TASKS.md`)

## Fonts used in study-tracker

DM Sans google font

## Questions ans

Q1 - use our inter font instead of dm Sans but create varriable in global.css and commnet it. I will check later which to keep.
Q2 - Use shadcn components inputs, button focus only on shadcn and tailwindcss classes
Q3 - Use bottom center toast. change it in global file for all project
Q4 - Will migrate that in later version
Q5 - Permenant re-direct to `/study-tracker/dashboard` this page also check login signup and other api routes for this correction. ask me if more info needed
