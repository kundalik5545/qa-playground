# 21-UI-ISSUES-BANK Test execution tasks

## P1 — Critical (Fix Immediately)

- [x] Add page-specific `<title>` per route via `generateMetadata()` in Next.js for all `/bank/*` pages
- [x] Add page-specific `<meta name="description">` per route for all `/bank/*` pages
- [x] Add `<link rel="canonical">` pointing to the page's own URL on all bank pages
- [x] Set `og:url` to each page's own URL on all bank pages
- [x] Add entries to sitemap for `/bank/dashboard`, `/bank/accounts`, `/bank/transactions` with appropriate priority
- [x] Add server-side redirect to `/login` or `/bank/dashboard` for `/bank/login` (currently 404)

## P2 — Important (Fix Within Sprint)

- [x] Include "Bank Demo", "SecureBank", or "QA Playground" in H1 for all `/bank/*` pages
- [x] Add JSON-LD structured data (BreadcrumbList + WebApplication or LearningResource schema) on all `/bank/*` pages
- [x] Set page-specific OG/Twitter titles on all `/bank/*` pages
- [x] Replace heading tags (`H3`/`H4`) in footer nav with styled `<p>` or `aria-label` on `<nav>` across pages
- [x] Add visual breadcrumb component + `BreadcrumbList` JSON-LD on all `/bank/*` pages
- [x] Add `og:locale` and `og:site_name` standard OG properties to all `/bank/*` pages

## P3 — Enhancements (Backlog)

- [x] Add contextual links from bank test-case sections to relevant blog articles
- [x] Update "Help & Docs" link in bank nav to point to a dedicated docs/help page
- [x] Add `<meta name="theme-color" content="#7c3aed">`
- [x] Add `manifest.json` with bank/playground icons
- [x] Ensure query strings `?action=add` / `?action=new` resolve to parent URL canonical or are noindexed
