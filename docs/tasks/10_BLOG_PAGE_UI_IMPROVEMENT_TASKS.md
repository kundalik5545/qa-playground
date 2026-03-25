# Blog Page UI Improvement Tasks

Source: `docs/10_BLOG_PAGE_UI_IMPROVMENT.md`
Page: `/blog` — `app/(blog)/blog/page.jsx`

---

## Task 1 — Improve Hero / Page Header [Low effort, Medium impact]
- Add sub-heading: "Tutorials, guides, and lessons from the world of QA automation."
- Add gradient background block behind title area
- Increase top padding to `pt-16`
- Add article count badge (e.g. "4 articles")

## Task 2 — Add Search, Tag Filter & Sort [Medium effort, High impact]
- Extract post grid into a `BlogClientContent` client component (receives posts as props from the RSC)
- Add full-width search input (filters by title + description)
- Add tag filter pills (All · Automation · Testing · Tools · Selenium · Playwright · General · Nextjs)
- Active filter pill: filled background vs outlined inactive
- Add Sort dropdown: Newest · Oldest (skip "Most Popular" — no view count data)

## Task 3 — Magazine Grid Layout + Consistent Images [Low effort, High impact]
- Feature latest post as a wide hero card spanning full width or 2 columns
- Remaining posts in 2-column grid below
- Enforce 16:9 aspect ratio with `object-fit: cover` on all thumbnails
- Fix orphan card issue: use `auto-fill` grid or 2-col fallback

## Task 4 — Fix Card Content Hierarchy [Low effort, High impact]
- Move tags directly below the title (before excerpt)
- Excerpt: use CSS `-webkit-line-clamp: 3` instead of JS `.slice(0, 120)`
- Style author/date subtly: smaller, muted, below excerpt

## Task 5 — Standardize Tag Colors + Make Clickable [Medium effort, Medium impact]
- Define consistent palette: automation=blue, testing=indigo, selenium=amber, playwright=violet, tools=teal, nextjs=slate, general=gray
- Make tags clickable — clicking a tag sets the active filter (wired to Task 2 filter state)
- Add hover state (darker bg, pointer cursor)
- Pill shape: `rounded-full`, `text-xs`

## Task 6 — Replace Read More Button with Text Link [Low effort, Medium impact]
- Replace full-width solid blue Button with inline text link `Read More →`
- `w-auto`, left-aligned, underline on hover
- Make entire card clickable (wrap card in `<Link>`)

## Task 7 — Add Reading Time Estimate [Low effort, Medium impact]
- Read full post body content in `getAllPosts()` (already has access to markdown file)
- Calculate words ÷ 200 = minutes (standard reading speed)
- Display next to date: `5 min read`

## Task 8 — Pagination / Load More [Medium effort, High impact]
- With 4 posts currently, implement a "Load More" button (progressive disclosure)
- Show 6 posts per page by default; "Load More" reveals next batch
- Show "Showing X of Y posts" count

## Task 9 — Fix Empty State / Orphan Card [Low effort, Low impact]
- Change grid to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `auto-fill`
- Last card stretches to fill or aligns left naturally
- (Covered by Task 3 magazine layout — verify no orphan after Task 3)

## Task 10 — Newsletter Subscribe CTA [PENDING USER INPUT]
- Waiting on decision: static placeholder UI / skip / external service
- If placeholder: add banner between grid and footer with email input + "Subscribe" button (no backend)

## Task 11 — Accessibility Fixes [Low effort, High impact]
- Wrap card images with meaningful `alt` (already good — keep)
- Add `aria-label` to Read More links: `aria-label="Read more about {post.title}"`
- Use `<ul>` / `<li>` for post grid: `role="list"` on grid, `role="listitem"` on cards
- Tag badges: use `<button>` or `<a>` so they're keyboard-navigable

## Task 12 — Dark Mode Audit [Low effort, Medium impact]
- Audit all card, tag, and text colors for `dark:` variants
- Fix tag colors to use `dark:` variants with sufficient contrast (WCAG AA)
- Ensure hero section, search bar, and filter pills all have dark mode styles

## Task 13 — Mobile Responsiveness [Medium effort, High impact]
- Verify grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Hero heading scales down on small screens
- Tag pills wrap cleanly within card boundaries
- Touch targets ≥ 44px (Read More, filter pills)

---

## Execution Order (by priority + dependencies)
1. Task 7 — Reading time (data layer change, needed before card redesign)
2. Task 3 — Magazine grid layout (structural foundation)
3. Task 4 — Card content hierarchy (depends on card structure)
4. Task 6 — Read More → text link (part of card redesign)
5. Task 5 — Tag colors + clickable (wired to filter)
6. Task 2 — Search + filter bar (client component wrapping)
7. Task 1 — Hero header
8. Task 8 — Load More pagination
9. Task 11 — Accessibility
10. Task 12 — Dark mode audit
11. Task 13 — Mobile responsiveness
12. Task 9 — Orphan card (should be resolved by Task 3)
13. Task 10 — Newsletter (pending)
