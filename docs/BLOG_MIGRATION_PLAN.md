# Blog System Migration Plan

**Goal:** Make writing and publishing a blog post a single-step operation — write the `.md` file, it appears on `/blog`. No JS files to update, no separate metadata to maintain.

---

## 1. What is Wrong Right Now

### Dual source of truth

Every blog post requires updating **two places**:

| Place | What it holds |
|---|---|
| `data/blogs.js` | title, description, author, date, category, image, slug, mainPageLink |
| `Blog/AutomationBlog/[slug].md` frontmatter | Same fields — title, description, author, date, slug, image |

If they drift apart the card on `/blog` shows different info than the article page. This has already happened (id:7 has `date: 06 Oct 2025` in the `.md` but `date: 25 March 2026` in `blogs.js`).

### No `/blog/[slug]` route

The `/blog` page cards link to `${blog.mainPageLink}/${blog.slug}`. That resolves to `/learn/[slug]` or `/practice/[slug]` — not to any `/blog/` route. There is no dedicated blog reader URL.

### `/learn/[slug]` serves two unrelated purposes

`app/(Practice)/learn/[slug]/page.jsx` renders both:
- Actual blog articles (when `isBlog: Yes` in frontmatter)
- Interactive learning tools like CoursesPage, LogicalProgramsTable (when `isBlog` is absent)

The `isBlog` flag is a branching condition inside the same page component. Two completely different UIs sharing one route.

### Blog files mixed with non-blog content

`Blog/AutomationBlog/` contains:
- Real blog posts (`how-to-write-effective-test-cases-...md`, `lessons-i-learn-...md`)
- Learning tool content (`courses.md`, `logical-programs-list-...md`, `automation-test-cases.md`)
- Drafts/internal notes (`ideas-to-grow-qa-playground.md`)

`Blog/ElementBlogs/` contains:
- Element docs (correct)
- A stray blog post (`top-10-best-automation-practice-website.md`)
- A scratch file (`test.md`)

### `/practice/[slug]` reads from ElementBlogs

`Blog/ElementBlogs/top-10-best-automation-practice-website.md` is a real blog post but lives in ElementBlogs. `/practice/[slug]` picks it up via `generateStaticParams()` and generates a route at `/practice/top-10-best-automation-practice-website`. That URL makes no sense for a blog post.

---

## 2. Target State — How It Should Work

### Single step to publish a blog post

```
Write Blog/posts/my-new-post.md  →  appears at /blog/my-new-post  →  listed on /blog
```

No `blogs.js` update. No code changes. Done.

### Clean folder structure

```
Blog/
├── posts/                  All public blog posts (currently Blog/AutomationBlog/)
│   ├── how-to-write-effective-test-cases.md
│   ├── top-10-best-chrome-extension.md
│   └── lessons-i-learn-while-creating-qaplayground.md
├── learn/                  Content for /learn/* interactive pages (not blogs)
│   ├── courses.md
│   ├── logical-programs-list-to-crack-interviews.md
│   └── automation-test-cases.md
└── elements/               Element docs for /practice/[slug] (currently Blog/ElementBlogs/)
    ├── input.md
    ├── button.md
    └── ...
```

### Clean URL structure

| Content type | URL | Source folder |
|---|---|---|
| Blog listing | `/blog` | reads frontmatter from `Blog/posts/` |
| Blog article | `/blog/[slug]` | `Blog/posts/[slug].md` |
| Practice element | `/practice/[slug]` | `Blog/elements/[slug].md` |
| Learn tool | `/learn/[slug]` | `Blog/learn/[slug].md` |

### `/blog` listing reads frontmatter directly

No `data/blogs.js`. The listing page scans `Blog/posts/`, reads each file's frontmatter, and renders cards. Adding a new post = add a file.

---

## 3. Frontmatter Standard

Every file in `Blog/posts/` must have this frontmatter. All fields are required unless marked optional.

```md
---
title: "Your Post Title Here"
description: "One paragraph summary shown on the /blog card and used for SEO meta description. Keep under 160 chars."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"       # optional, used in JSON-LD
date: "2026-03-25"
lastModified: "2026-03-25"                               # optional, update when you edit the post
category: ["automation", "testing"]
image: "https://ik.imagekit.io/randomcoder/QAPlayground/your-image.webp"
imageAlt: "Short description of the image"               # optional, improves accessibility + SEO
slug: "your-post-slug-matches-filename"
keywords: "comma, separated, keywords"
draft: false                                             # optional, set true to hide from listing
---

Your content starts here...
```

**Rules:**
- `slug` must match the filename exactly (minus `.md`). This avoids any mismatch.
- `date` must be ISO format `YYYY-MM-DD` — the JS `Date` constructor is reliable with this.
- `lastModified` — update this every time you significantly edit the post. Google uses it for freshness scoring.
- `image` should use ImageKit CDN URL for production images.
- `draft: true` posts are skipped by the listing page — safe to commit WIP posts.
- **Do NOT add `isBlog: Yes`** — that field is being removed. All files in `Blog/posts/` are blogs by definition.

---

## 4. Migration Steps

### Phase 1 — Create the new folder structure

Move/rename content folders:

```
Blog/AutomationBlog/  →  Blog/posts/      (public blog posts only)
Blog/ElementBlogs/    →  Blog/elements/   (practice element docs)
```

Create `Blog/learn/` for interactive learn content.

**Files to move into `Blog/posts/`** (real blog posts):
- `how-to-write-effective-test-cases-with-real-world-examples.md`
- `top-10-best-chrome-extension-for-automation-tester.md`
- `lessons-i-learn-while-creating-qaplayground.md`
- `top-10-best-automation-practice-website.md` ← move from `Blog/ElementBlogs/`

**Files to move into `Blog/learn/`** (learning tool content, not blog posts):
- `courses.md`
- `logical-programs-list-to-crack-interviews.md`
- `automation-test-cases.md`
- `javascript-syllabus.md`

**Files to delete:**
- `Blog/AutomationBlog/ideas-to-grow-qa-playground.md` — internal notes, not a blog post
- `Blog/ElementBlogs/test.md` — scratch file

### Phase 2 — Standardise frontmatter in Blog/posts/

For each `.md` in `Blog/posts/`:
1. Set `date` to ISO format (`YYYY-MM-DD`)
2. Add `category` array if missing
3. Add `draft: false`
4. Remove `isBlog: Yes` — no longer needed
5. Ensure `slug` matches filename

### Phase 3 — Add `/blog/[slug]` route

Create `app/(blog)/blog/[slug]/page.jsx`:

```jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { basicDetails } from "@/data/BasicSetting";

const POSTS_DIR = path.join(process.cwd(), "Blog/posts");

export async function generateStaticParams() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();
  const { data } = matter(fs.readFileSync(filePath, "utf-8"));
  return {
    title: data.title?.slice(0, 60) || "Blog Post",
    description: data.description?.slice(0, 160) || "",
    keywords: data.keywords || "",
    openGraph: {
      title: data.title,
      description: data.description?.slice(0, 200),
      url: `${basicDetails.websiteURL}/blog/${slug}`,
      images: data.image ? [{ url: data.image }] : [],
    },
    alternates: { canonical: `${basicDetails.websiteURL}/blog/${slug}` },
  };
}

const BlogPostPage = async ({ params }) => {
  const { slug } = await params;
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();

  const { content, data } = matter(fs.readFileSync(filePath, "utf-8"));
  if (data.draft === true) return notFound();

  const htmlContent = (
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .use(rehypePrettyCode, {
        theme: "github-dark",
        transformers: [transformerCopyButton({ visibility: "always", feedbackDuration: 3000 })],
      })
      .use(rehypeStringify)
      .process(content)
  ).toString();

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <header className="max-w-5xl mx-auto py-6">
        <h1 className="text-3xl sm:text-4xl font-semibold pb-2">{data.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm mt-2 pb-2">
          <Badge className="px-2 py-1">By {data.author || "Admin"}</Badge>
          <p className="flex items-center gap-1">
            <Calendar size={18} />
            {new Date(data.date).toLocaleDateString("en-GB", {
              day: "2-digit", month: "long", year: "numeric",
            })}
          </p>
          {data.category?.map((cat) => (
            <Badge key={cat} variant="outline">{cat}</Badge>
          ))}
        </div>
        <hr />
      </header>

      {data.image && (
        <div className="flex justify-center mb-6">
          <Image
            src={data.image}
            alt={data.title}
            width={800}
            height={400}
            className="rounded-lg shadow-lg w-full max-w-2xl object-cover"
            priority
          />
        </div>
      )}

      <article className="prose dark:prose-invert max-w-5xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>
    </div>
  );
};

export default BlogPostPage;
```

### Phase 4 — Update `/blog` listing page to read from files

Replace `data/blogs.js` import in `app/(blog)/blog/page.jsx` with file-system reads:

```jsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Replace the static blogs import with this function
function getAllPosts() {
  const dir = path.join(process.cwd(), "Blog/posts");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const { data } = matter(fs.readFileSync(path.join(dir, filename), "utf-8"));
      return data;
    })
    .filter((data) => data.draft !== true)   // exclude drafts
    .sort((a, b) => new Date(b.date) - new Date(a.date));  // newest first
}
```

Update the "Read More" link in the card from:
```jsx
<Link href={`${blog.mainPageLink}/${blog.slug}`} prefetch={false}>
```
to:
```jsx
<Link href={`/blog/${post.slug}`} prefetch={false}>
```

### Phase 5 — Update `/learn/[slug]` to read from Blog/learn/

Change the `generateStaticParams` and file path in `app/(Practice)/learn/[slug]/page.jsx`:

```js
// Before
const postsDirectory = path.join(process.cwd(), "Blog/AutomationBlog");

// After
const postsDirectory = path.join(process.cwd(), "Blog/learn");
```

Remove the `isBlog` branch — everything in `/learn/[slug]` renders the DynamicComponent + markdown content without the blog header (it's not a blog route).

### Phase 6 — Update `/practice/[slug]` to read from Blog/elements/

Change the file path:

```js
// Before
path.join(process.cwd(), "Blog/ElementBlogs", `${slug}.md`)

// After
path.join(process.cwd(), "Blog/elements", `${slug}.md`)
```

### Phase 7 — Remove data/blogs.js (or keep as legacy)

Once the `/blog` listing reads from files and all links point to `/blog/[slug]`, `data/blogs.js` is no longer needed for blog listing. It can be deleted.

If any other part of the codebase imports `blogs` from `data/blogs.js` (e.g. landing page), replace those usages with the `getAllPosts()` function or inline static data before deleting the file.

---

## 5. After Migration — How to Write a Blog Post

1. Create `Blog/posts/my-post-slug.md`
2. Add frontmatter at the top (copy template from Section 3)
3. Write content in Markdown below the `---`
4. Done — post appears at `/blog/my-post-slug` and is listed on `/blog`

No code files to touch. No JS arrays to update.

---

## 6. Files Changed Summary

| File | Action |
|---|---|
| `Blog/AutomationBlog/` | Rename to `Blog/posts/` |
| `Blog/ElementBlogs/` | Rename to `Blog/elements/` |
| `Blog/learn/` | Create new folder |
| `Blog/posts/ideas-to-grow-qa-playground.md` | Delete (internal notes) |
| `Blog/elements/test.md` | Delete (scratch file) |
| `Blog/elements/top-10-best-automation-practice-website.md` | Move to `Blog/posts/` |
| `app/(blog)/blog/page.jsx` | Replace `blogs.js` import with `getAllPosts()` |
| `app/(blog)/blog/[slug]/page.jsx` | **Create new** — dedicated blog reader |
| `app/(Practice)/learn/[slug]/page.jsx` | Point to `Blog/learn/`, remove `isBlog` branch |
| `app/(Practice)/practice/[slug]/page.jsx` | Point to `Blog/elements/` |
| `data/blogs.js` | Delete after Phase 7 verification |

---

## 7. What Does NOT Change

- The markdown rendering pipeline (unified + remark + rehype) — keep exactly as is
- `Blog/elements/` content — element docs are untouched
- `/practice/[slug]` overall behavior — only the source folder path changes
- `/learn/[slug]` overall behavior — only the source folder path changes
- SEO metadata generation pattern — same approach, different source folder

---

## 8. SEO — Full Implementation for Blog Posts

### 8.1 generateMetadata — Complete version for `/blog/[slug]`

Replace the minimal `generateMetadata` stub in Phase 3 with this full version. It covers Google ranking signals, Open Graph (social sharing), Twitter Card, and geo targeting.

```jsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return notFound();

  const { data } = matter(fs.readFileSync(filePath, "utf-8"));
  const postUrl = `${basicDetails.websiteURL}/blog/${slug}`;

  return {
    // ── Core ──────────────────────────────────────────────────────────────
    title: `${data.title?.slice(0, 55)} | QA Playground`,
    description: data.description?.slice(0, 160),
    keywords: data.keywords || "",

    // ── Canonical ─────────────────────────────────────────────────────────
    // Tells Google which URL is the definitive version. Prevents duplicate
    // content penalties if the post is ever shared with query params.
    alternates: {
      canonical: postUrl,
    },

    // ── Open Graph (Facebook, LinkedIn, WhatsApp previews) ────────────────
    openGraph: {
      type: "article",                        // marks this as an article, not a website
      url: postUrl,
      title: data.title,
      description: data.description?.slice(0, 200),
      images: data.image
        ? [{ url: data.image, width: 1200, height: 630, alt: data.imageAlt || data.title }]
        : [],
      locale: "en_US",
      siteName: "QA Playground",
      publishedTime: data.date,              // used by Google and social crawlers
      modifiedTime: data.lastModified || data.date,
      authors: [data.authorUrl || basicDetails.websiteURL],
      tags: data.category || [],
    },

    // ── Twitter / X Card ─────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description?.slice(0, 160),
      images: data.image ? [data.image] : [],
      creator: "@qaplayground",
      site: "@qaplayground",
    },

    // ── Robots ───────────────────────────────────────────────────────────
    // Drafts return notFound() before this runs, so all published posts are indexable.
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },

    // ── Author ───────────────────────────────────────────────────────────
    authors: [{ name: data.author || "Kundalik Jadhav", url: data.authorUrl }],
  };
}
```

### 8.2 JSON-LD Structured Data (Article Schema)

JSON-LD is the most important SEO addition for blog posts. Google uses it for rich results. AI search engines (Perplexity, ChatGPT with search, Google SGE) use it to understand content type, author, and date — which is how they decide to cite or reference an article.

Add this inside `BlogPostPage` component, just before the closing `</div>`:

```jsx
{/* JSON-LD — Article structured data for Google + AI crawlers */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: data.image ? [data.image] : [],
      datePublished: data.date,
      dateModified: data.lastModified || data.date,
      author: {
        "@type": "Person",
        name: data.author || "Kundalik Jadhav",
        url: data.authorUrl || `${basicDetails.websiteURL}/about-me`,
      },
      publisher: {
        "@type": "Organization",
        name: "QA Playground",
        url: basicDetails.websiteURL,
        logo: {
          "@type": "ImageObject",
          url: `${basicDetails.websiteURL}/mainicons/logo.svg`,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${basicDetails.websiteURL}/blog/${slug}`,
      },
      url: `${basicDetails.websiteURL}/blog/${slug}`,
      keywords: data.keywords || "",
      articleSection: data.category?.[0] || "QA Automation",
      inLanguage: "en-US",
    }),
  }}
/>
```

**Why this matters:**
- `datePublished` + `dateModified` — Google uses these for freshness ranking. Keep `lastModified` updated in frontmatter when you edit posts.
- `author` with a `url` — establishes authorship signal (E-E-A-T: Experience, Expertise, Authority, Trust).
- `publisher` with logo — required for Google News eligibility.
- `inLanguage` — helps search engines target the right regional audience.

### 8.3 Geo Targeting Meta Tags

Geo meta tags signal to search engines which country/region the content is primarily for. Not a strong ranking signal on their own, but they reinforce other geo signals (server location, domain, content language).

Add these inside `generateMetadata` return, in the `other` field:

```jsx
// Inside generateMetadata return object
other: {
  // Geo targeting — India-based audience (primary market for QA engineers)
  "geo.region": "IN",                     // ISO 3166-1 country code
  "geo.placename": "India",
  "content-language": "en-IN",            // English as spoken in India

  // Geo position (optional — use your city coordinates)
  // "geo.position": "18.5204;73.8567",   // Pune, Maharashtra
  // "ICBM": "18.5204, 73.8567",

  // Revisit hint — tells crawlers to come back after N days
  "revisit-after": "7 days",

  // Article-specific
  "article:published_time": data.date,
  "article:modified_time": data.lastModified || data.date,
  "article:author": data.author || "Kundalik Jadhav",
  "article:section": data.category?.[0] || "QA Automation",
  "article:tag": (data.category || []).join(", "),
},
```

**Geo strategy:** The primary QA automation job market is India, US, and UK. `geo.region: "IN"` targets India. If you want global reach, keep it at `IN` (your origin) and let content quality handle the rest — Google's international ranking is content-driven, not geo-tag-driven.

### 8.4 `/blog` Listing Page SEO

The listing page at `/blog` also needs proper metadata. Add this to `app/(blog)/blog/page.jsx`:

```jsx
export async function generateMetadata() {
  return {
    title: "QA Automation Blog | Tutorials, Test Cases & Guides — QA Playground",
    description:
      "Practical QA automation tutorials, Selenium & Playwright guides, test case examples, and real-world tips for QA engineers. Updated regularly.",
    keywords: "selenium tutorial, playwright guide, test automation blog, QA engineer tips, test cases examples",
    alternates: { canonical: "https://www.qaplayground.com/blog" },
    openGraph: {
      type: "website",
      url: "https://www.qaplayground.com/blog",
      title: "QA Automation Blog — QA Playground",
      description: "Practical QA automation tutorials and guides for engineers.",
      images: [{ url: "https://ik.imagekit.io/randomcoder/QAPlayground/og-blog.webp", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "QA Automation Blog — QA Playground",
      description: "Practical QA automation tutorials and guides for engineers.",
      creator: "@qaplayground",
    },
  };
}
```

---

## 9. AI Discoverability

AI search engines (Perplexity, ChatGPT with search, Google AI Overviews, Claude) crawl and cite content the same way Google does — but they place extra weight on clear structure, authorship, and the `llms.txt` file.

### 9.1 Update robots.js — Allow AI Crawlers

The current `robots.js` allows all bots (`userAgent: "*"`). That's correct. Do NOT block AI crawlers if you want AI tools to reference your content. Make it explicit:

```js
// app/robots.js
import { basicDetails } from "@/data/BasicSetting";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",         // all bots including Googlebot
        allow: "/",
        disallow: ["/admin/", "/api/auth/"],   // block auth and admin only
      },
      // Explicitly allow major AI crawlers (some check their specific entry)
      { userAgent: "GPTBot", allow: "/" },          // OpenAI / ChatGPT
      { userAgent: "ClaudeBot", allow: "/" },        // Anthropic / Claude
      { userAgent: "PerplexityBot", allow: "/" },    // Perplexity AI
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },  // Google AI training
      { userAgent: "Applebot-Extended", allow: "/" },// Apple AI
    ],
    sitemap: `${basicDetails.websiteURL}/sitemap.xml`,
  };
}
```

### 9.2 Create `llms.txt`

`llms.txt` is an emerging standard (analogous to `robots.txt`) that tells AI systems what your site is about and what content is most valuable to reference. Perplexity, ChatGPT, and other AI tools are beginning to read this file.

Create `public/llms.txt`:

```txt
# QA Playground — llms.txt
# https://www.qaplayground.com

> QA Playground is a free educational platform for QA automation engineers to learn and practice browser automation testing using Selenium, Playwright, and Cypress.

## What this site is

- 22+ interactive UI elements for automation practice (inputs, tables, modals, drag-drop, etc.)
- A simulated Bank Demo App for end-to-end automation scenarios
- A QA Study Tracker for tracking learning progress
- Blog and tutorials focused on QA automation testing
- Free QA tools for testers

## Primary audience

QA automation engineers, manual testers learning automation, developers writing tests.

## Blog posts (most useful for reference)

- https://www.qaplayground.com/blog/how-to-write-effective-test-cases-with-real-world-examples
- https://www.qaplayground.com/blog/top-10-best-automation-practice-website
- https://www.qaplayground.com/blog/top-10-best-chrome-extension-for-automation-tester
- https://www.qaplayground.com/blog/lessons-i-learn-while-creating-qaplayground

## Practice pages (interactive automation testing elements)

- https://www.qaplayground.com/practice/input
- https://www.qaplayground.com/practice/button
- https://www.qaplayground.com/practice/simple-table
- https://www.qaplayground.com/practice/advance-table
- https://www.qaplayground.com/practice/calendar
- https://www.qaplayground.com/practice/alert
- https://www.qaplayground.com/practice/waits
- https://www.qaplayground.com/practice/upload-download

## Do not index

/admin/*
/api/*
```

Update this file every time you publish a new blog post — add the URL to the Blog posts section.

### 9.3 Update sitemap.js — Include Blog Posts Dynamically

The current `sitemap.js` reads from `data/sitemap-links.js` (a static array). After migration, blog posts need to be in the sitemap with correct `lastModified` and `priority` values. Google uses `lastModified` to decide how often to re-crawl.

```js
// app/sitemap.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { basicDetails } from "@/data/BasicSetting";
import { siteMapUrls } from "@/data/sitemap-links";

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { url: `${basicDetails.websiteURL}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${basicDetails.websiteURL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${basicDetails.websiteURL}/practice`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${basicDetails.websiteURL}/about-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${basicDetails.websiteURL}/contact-us`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${basicDetails.websiteURL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Practice element pages from siteMapUrls
  const practicePosts = siteMapUrls.map((link) => ({
    url: `${basicDetails.websiteURL}/${link.url}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Blog posts — read directly from Blog/posts/ folder
  const postsDir = path.join(process.cwd(), "Blog/posts");
  const blogPosts = fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const { data } = matter(fs.readFileSync(path.join(postsDir, filename), "utf-8"));
      if (data.draft === true) return null;
      return {
        url: `${basicDetails.websiteURL}/blog/${data.slug}`,
        lastModified: new Date(data.lastModified || data.date),
        changeFrequency: "weekly",
        priority: 0.8,
      };
    })
    .filter(Boolean);

  return [...staticPages, ...practicePosts, ...blogPosts];
}
```

**Why `priority` matters:**
- `1.0` — homepage, crawl first
- `0.9` — blog listing, changes often
- `0.8` — individual blog posts and practice pages
- `0.7` and below — supporting pages

### 9.4 Content Writing Guidelines for AI Referral

AI systems (Perplexity, ChatGPT) cite content that is:
1. **Definitive and specific** — answers a question directly in the first paragraph
2. **Well-structured** — uses H2/H3 headings that match search queries
3. **Fresh** — `lastModified` date is recent (update it when you revise content)
4. **Authoritative** — author name is consistent and links to an about page

**Rules to follow when writing blog posts:**

```
DO:
- Start with a direct answer or summary in the first 2-3 sentences
- Use question-style H2 headings: "## How do you write a test case for login?"
- Include code examples with proper syntax highlighting (the rehype pipeline handles this)
- Add a "Key Takeaways" or "Summary" section at the end — AI tools often quote these
- Keep paragraphs short (2-4 sentences) — easier for AI to extract and cite
- Use numbered lists for step-by-step content — AI tools prefer structured formats
- Update lastModified in frontmatter whenever you edit the post

DON'T:
- Bury the main answer deep in the post
- Use vague headings like "## Introduction" — use "## What is X" instead
- Write walls of text without headings
- Leave lastModified as the original publish date after editing
```

**Title format that ranks:**

```
Good:  "How to Write Effective Test Cases (With Real Examples)"
Good:  "Top 10 Selenium Practice Websites for Beginners"
Bad:   "My Thoughts on Testing"
Bad:   "Blog Post 4"
```

Use the primary keyword in the title and in the first H2 heading. Keep titles under 60 characters.

---

## 10. Updated Files Changed Summary

| File | Action |
|---|---|
| `Blog/AutomationBlog/` | Rename to `Blog/posts/` |
| `Blog/ElementBlogs/` | Rename to `Blog/elements/` |
| `Blog/learn/` | Create new folder |
| `Blog/posts/ideas-to-grow-qa-playground.md` | Delete (internal notes) |
| `Blog/elements/test.md` | Delete (scratch file) |
| `Blog/elements/top-10-best-automation-practice-website.md` | Move to `Blog/posts/` |
| `app/(blog)/blog/page.jsx` | Replace `blogs.js` import with `getAllPosts()` + add full `generateMetadata` |
| `app/(blog)/blog/[slug]/page.jsx` | **Create new** — blog reader with JSON-LD + full SEO metadata |
| `app/(Practice)/learn/[slug]/page.jsx` | Point to `Blog/learn/`, remove `isBlog` branch |
| `app/(Practice)/practice/[slug]/page.jsx` | Point to `Blog/elements/` |
| `app/robots.js` | Explicitly allow AI crawlers |
| `app/sitemap.js` | Read blog posts from `Blog/posts/` dynamically |
| `public/llms.txt` | **Create new** — AI discoverability file |
| `data/blogs.js` | Delete after Phase 7 verification |
