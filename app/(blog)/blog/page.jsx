import fs from "fs";
import path from "path";
import matter from "gray-matter";
import BlogClientContent from "./_components/BlogClientContent";

export const metadata = {
  title: "QA Automation Blog | Tutorials, Test Cases & Guides — QA Playground",
  description:
    "Practical QA automation tutorials, Selenium & Playwright guides, test case examples, and real-world tips for QA engineers. Updated regularly.",
  keywords:
    "selenium tutorial, playwright guide, test automation blog, QA engineer tips, test cases examples",
  alternates: { canonical: "https://www.qaplayground.com/blog" },
  openGraph: {
    type: "website",
    url: "https://www.qaplayground.com/blog",
    title: "QA Automation Blog — QA Playground",
    description:
      "Practical QA automation tutorials and guides for engineers.",
    images: [
      {
        url: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QA Automation Blog — QA Playground",
    description: "Practical QA automation tutorials and guides for engineers.",
    creator: "@qaplayground",
  },
};

function getAllPosts() {
  const dir = path.join(process.cwd(), "Blog/posts");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
      const { data, content } = matter(raw);
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));
      return { ...data, readingTime };
    })
    .filter((data) => data.draft !== true)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function BlogMainPage() {
  const posts = getAllPosts();
  const postCount = posts.length;

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {/* ── Hero Header ──────────────────────────────────────────── */}
      <section className="pt-16 pb-10 text-center rounded-2xl my-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 border border-blue-100 dark:border-gray-700">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          QA Automation Blog
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-5">
          Tutorials, guides, and lessons from the world of QA automation.
        </p>
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-700">
          {postCount} {postCount === 1 ? "article" : "articles"}
        </span>
      </section>

      {/* ── Blog Content (client: search, filter, grid) ───────── */}
      <BlogClientContent posts={posts} />
    </div>
  );
}
