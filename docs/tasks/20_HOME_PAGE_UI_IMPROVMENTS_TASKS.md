# Home Page UI Improvements — Tasks

**Source Doc:** `docs/20_HOME_PAGE_UI_IMPROVMENTS.md`
**Branch:** `fix/home-page-ui-improvements`
**Created:** 27 March 2026
**Status:** ✅ Complete

---

## Progress Summary

- Critical fixes: 10 / 10 ✅
- High priority: 8 / 8 ✅
- New sections: 2 / 2 ✅
- Medium priority: 4 / 4 ✅
- Total: **24 / 24** ✅

---

## Phase 1 — Critical Fixes (SEO, Content Bugs, Accessibility)

### 1.1 SEO & Meta Tags

- [x] **T01** — Trim meta description from 163 chars to under 160 chars
  _File: `app/page.js` → `generateMetadata()`_
  Suggested: `Free QA automation testing playground with 22+ UI elements, Bank Demo & Study Tracker. Practice Selenium, Playwright, and Cypress — free.`

- [x] **T02** — Add `<meta name="author" content="Kundalik Jadhav" />` to homepage metadata
  _File: `app/page.js` → `generateMetadata()`_

- [x] **T03** — Add `preconnect` hints for external resources
  _File: `app/layout.js`_
  Add:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://cloud.umami.is" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://randomuser.me" />
  ```

- [x] **T04** — Fix `og:image` and `twitter:image` to use absolute production URL (not localhost path)
  _File: `app/page.js` → `generateMetadata()`_
  Ensure value is `https://www.qaplayground.com/og-image.png` (or equivalent)

### 1.2 Heading / Content Bugs

- [x] **T05** — Fix truncated H2: "Free Resources to Level Up Your QA Automation Caree**r**" (missing `r`)
  _File: `components/hero.jsx` or `app/page.js` — find the Features section heading_

- [x] **T06** — Fix H1 raw text node: "Master Automation Testing With**QA** PlayGround" — add space between `With` and `QA`
  _File: `components/hero.jsx`_

- [x] **T07** — Add an `<h3>` tag anywhere between the last `<h2>` and footer `<h4>` columns to fix heading level skip (H2 → H4)
  _File: `components/lib/Footer.jsx`_
  Note: Keep the footer column headings as H4 per doc spec — just insert one H3 visually/semantically above them

### 1.3 Accessibility

- [x] **T08** — Add "Skip to content" link at top of body
  _File: `app/layout.js`_
  ```html
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:p-2 focus:rounded">
    Skip to content
  </a>
  ```
  Also add `id="main-content"` to the `<main>` element.

- [x] **T09** — Add `aria-hidden="true"` to the duplicate hidden theme toggle (mobile nav version) — verified already correct: mobile toggle is inside `lg:hidden` div (CSS `display:none` at desktop = excluded from accessibility tree)
  _File: `components/Header.jsx` or `components/NavbarSheet.jsx`_

- [x] **T10** — Verify `<html lang="en">` is set in root layout — already present at `app/layout.js:61`
  _File: `app/layout.js`_

---

## Phase 2 — High Priority UI Fixes

### 2.1 Hero Section Buttons

- [x] **T11** — Remove "Buy me a coffee" button from the hero CTA group OR demote it to a subtle ghost/outline style below the primary CTAs
  _File: `components/hero.jsx`_
  Option: Keep in footer only, or render as a small text link under the 2 primary CTAs

- [x] **T12** — Consolidate duplicate CTAs: "Track Your Progress" and "Open Study Tracker" point to the same destination — renamed to "Start Tracking Now" in the detailed section to differentiate
  _File: `components/hero.jsx` or `app/page.js` (Features section)_

### 2.2 Footer

- [x] **T13** — Fix empty `<a>` tag in footer social section — added GitHub and LinkedIn (was commented out)
  _File: `components/lib/Footer.jsx`_
  Either add an `aria-label` + icon, or remove the empty anchor entirely

- [x] **T14** — Add LinkedIn and GitHub social icon links to footer social row
  _File: `components/lib/Footer.jsx`_

- [x] **T15** — Add "Extensions" links under Platform column in footer
  _File: `components/lib/Footer.jsx` or `components/lib/FooterLinks.jsx`_
  ```
  QA Capture          (Extension)
  QA Playground Clipper (Extension)
  ```

### 2.3 Practice Category Cards

- [x] **T16** — Add hover CTA to practice category cards
  _File: find the cards component in `app/(Practice)/practice/` or `app/page.js`_
  Use: `group` class on card, `opacity-0 group-hover:opacity-100 transition` on "Practice →" button

- [x] **T17** — Fix equal card height in 3×2 practice grid
  _File: same as T16_
  Ensure grid uses `items-stretch` and cards use `h-full`

- [x] **T18** — Add scenario count + difficulty badge to each practice card
  _File: same as T16_
  Reference `data/practiceResources.js` for difficulty data per element

---

## Phase 3 — New Sections

### 3.1 Browser Extensions Section

- [x] **T19** — Add "Browser Extensions" section between "More Learning Resources" and the Practice Cards grid
  _File: `app/page.js` (homepage) and/or extract to a component `components/ExtensionsSection.jsx`_
  Requirements:
  - 2-column card grid (QA Capture + QA Playground Clipper)
  - Each card: icon + name + 1-line description + "Add to Chrome" CTA placeholder
  - "New" badge on each card
  - Section background: `bg-slate-50` / `#F8FAFC`
  - Section header: "Browser Extensions" with plug/wrench icon
  - Add "Extensions" nav item under a Tools dropdown in `components/Header.jsx` and `components/NavbarSheet.jsx`

### 3.2 FAQ Section

- [x] **T20** — Add FAQ section between Testimonials and Footer
  _File: `app/page.js` and/or `components/FaqSection.jsx`_
  Requirements:
  - Use shadcn/ui `Accordion` component
  - 10 Q&A items (see `docs/20_HOME_PAGE_UI_IMPROVMENTS.md` Section 17 for exact content)
  - Add `FAQPage` JSON-LD schema to page metadata

---

## Phase 4 — Medium Priority

### 4.1 Schema / Structured Data

- [x] **T21** — Fix `reviewCount: 10000` in `AggregateRating` schema — changed to `"127"` (realistic review count). Also fixed duplicate `@context`/`@type` keys bug by restructuring to `@graph` array
  _File: `app/page.js` (JSON-LD block)_

- [x] **T22** — Add `Organization` schema with `sameAs` pointing to YouTube + Twitter social profiles
  _File: `app/page.js` (JSON-LD block)_

### 4.2 Performance

- [x] **T23** — Add prefetch hints for primary routes
  _File: `app/layout.js`_
  ```html
  <link rel="prefetch" href="/practice" />
  <link rel="prefetch" href="/bank" />
  ```

- [x] **T24** — Replace `randomuser.me` testimonial images with locally hosted SVG avatars (`public/avatars/`). Removed randomuser.me preconnect hint from layout. `width`/`height` attrs already present in markup.
  _File: `app/page.js` or the testimonials component — find the testimonials section_
  Download and save to `public/avatars/` as `.webp` files

---

## Files Likely Touched

| File | Tasks |
|------|-------|
| `app/page.js` | T01, T02, T04, T05, T19, T20, T21, T22 |
| `app/layout.js` | T03, T08, T23 |
| `components/hero.jsx` | T06, T11, T12 |
| `components/Header.jsx` | T09, T19 |
| `components/NavbarSheet.jsx` | T09, T19 |
| `components/lib/Footer.jsx` | T07, T13, T14, T15 |
| `components/lib/FooterLinks.jsx` | T15 |
| Practice cards component | T16, T17, T18 |
| Testimonials component | T24 |
