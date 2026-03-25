import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock5 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

// Category color mapping
const categoryColors = {
  automation: "bg-blue-500",
  testing: "bg-red-500",
  selenium: "bg-orange-500",
  playwright: "bg-purple-500",
  nextjs: "bg-black dark:bg-white dark:text-black",
  general: "bg-gray-500",
  tools: "bg-green-500",
  default: "bg-indigo-500",
};

function getAllPosts() {
  const dir = path.join(process.cwd(), "Blog/posts");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const { data } = matter(
        fs.readFileSync(path.join(dir, filename), "utf-8")
      );
      return data;
    })
    .filter((data) => data.draft !== true)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

const BlogMainPage = () => {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl pt-16">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Latest Blog Posts
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="flex flex-col bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
          >
            {/* Cover image */}
            <div className="relative h-48 md:h-56 w-full">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-t-lg"
                priority
              />
            </div>

            {/* Details */}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {post.description?.slice(0, 120)}...
              </p>

              {/* Meta */}
              <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span>By {post.author || "Kundalik Jadhav"}</span>
                  <span className="flex items-center">
                    <Clock5 size={14} className="mr-1" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-2 flex flex-wrap gap-2">
                {(post.category || []).map((cat) => (
                  <Badge
                    key={cat}
                    className={`px-2 py-1 rounded text-white text-xs capitalize ${
                      categoryColors[cat] || categoryColors.default
                    }`}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Read More */}
              <div className="mt-4">
                <Link href={`/blog/${post.slug}`} prefetch={false}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md">
                    Read More →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogMainPage;
