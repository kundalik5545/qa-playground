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
- fix/practice-page-ui-issues — SEO metadata, JSON-LD, canonical/og:url, H1 fix, card accessibility (aria-label, aria-hidden), invalid Link>Button nesting removed, nav aria-label, card hover effects, CTA labels standardized, 5 descriptions rewritten, POM Bank Demo badge; search bar + card reorder/rename; InputPage bugs fixed (label/id mismatch, name attrs, data-testid), hero section, disabled/readonly badges, insight card expanded, Playwright append code fix, [slug] breadcrumb + JSON-LD LearningResource, footer h3→h4; 10 slugs renamed to match card titles (input→input-fields, button→buttons, select→dropdowns, alert→alerts-dialogs, radio→radio-checkbox, calendar→date-picker, window→tabs-windows, waits→dynamic-waits, simple-table→data-table, upload-download→file-upload) + 301 redirects for all old URLs

## Fonts used in study-tracker

DM Sans google font

## Questions ans

Q1 - use our inter font instead of dm Sans but create varriable in global.css and commnet it. I will check later which to keep.
Q2 - Use shadcn components inputs, button focus only on shadcn and tailwindcss classes
Q3 - Use bottom center toast. change it in global file for all project
Q4 - Will migrate that in later version
Q5 - Permenant re-direct to `/study-tracker/dashboard` this page also check login signup and other api routes for this correction. ask me if more info needed
