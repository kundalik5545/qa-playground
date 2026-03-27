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
- fix/ui-issue-all-pages 🔄 *(current)* — Study Tracker UI fixes: sidebar collapse toggle with auto-collapse on screens <lg, logout dropdown overflow fix (moved scroll to inner div, popup opens right of sidebar when collapsed), daily tracker dark mode removed (CSS var override to force light mode), analytics grid responsive (grid-cols-1 xl:grid-cols-2), HabitMatrix integrated, resolved UI button issues across all study-tracker pages; **Plan 19 in progress** — daily tracker improvements: clear-data button + API, Prisma timeSlot field, GET fetch route, date bar 2xl+ fix, habit form UX simplification (remove repeat/indefinite/2months, add timeSlot input, cancel button), chart filter sync (unified viewMode), progress chart relocation, analytics filter unification (26 tasks — see `docs/tasks/19_DAILY_TRACKER_IMPROVEMENTS_TASKS.md`)

## Fonts used in study-tracker

DM Sans google font

## Questions ans

Q1 - use our inter font instead of dm Sans but create varriable in global.css and commnet it. I will check later which to keep.
Q2 - Use shadcn components inputs, button focus only on shadcn and tailwindcss classes
Q3 - Use bottom center toast. change it in global file for all project
Q4 - Will migrate that in later version
Q5 - Permenant re-direct to `/study-tracker/dashboard` this page also check login signup and other api routes for this correction. ask me if more info needed
