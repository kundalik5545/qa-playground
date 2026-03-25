# Blog Migration Tasks

Tracking file for the blog system migration.
Full plan: `docs/BLOG_MIGRATION_PLAN.md`

## Phases

| #   | Phase                                                | Status |
| --- | ---------------------------------------------------- | ------ |
| 1   | Restructure Blog folder (move & rename files)        | [x]    |
| 2   | Standardise frontmatter in Blog/posts/               | [x]    |
| 3   | Create /blog/[slug]/page.jsx (dedicated blog reader) | [x]    |
| 4   | Update /blog listing page to read from files         | [x]    |
| 5   | Update /learn/[slug] to read from Blog/learn/        | [x]    |
| 6   | Update /practice/[slug] to read from Blog/elements/  | [x]    |
| 7   | SEO & AI: robots.js, sitemap.js, llms.txt            | [x]    |
| 8   | Delete data/blogs.js                                 | [x]    |
