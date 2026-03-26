# Guthub branch progress

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
- fix/login-ui-improvement ✅ — Login & Signup UI/UX + security overhaul (22/22 tasks): page bg gradient, soft card shadow, purple border, 44px inputs (dark mode styled), h1 semantic heading, subtitle contrast, button transitions + ArrowRight, icon glow ring, spacing rhythm, "Forgot Password?" link, "Remember Me" checkbox, confirm password field, password strength bar (4-level), show/hide password toggles, aria-describedby + aria-invalid, generic error messages (SEC-10), autocomplete="username", security headers in next.config.mjs (X-Frame-Options, HSTS, nosniff, Referrer-Policy, Permissions-Policy), page-specific metadata layouts, dark mode card + input refinements

## Fonts used in study-tracker

DM Sans google font

## Questions ans

Q1 - use our inter font instead of dm Sans but create varriable in global.css and commnet it. I will check later which to keep.
Q2 - Use shadcn components inputs, button focus only on shadcn and tailwindcss classes
Q3 - Use bottom center toast. change it in global file for all project
Q4 - Will migrate that in later version
Q5 - Permenant re-direct to `/study-tracker/dashboard` this page also check login signup and other api routes for this correction. ask me if more info needed
