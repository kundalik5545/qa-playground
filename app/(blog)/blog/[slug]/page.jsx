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
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
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
  const postUrl = `${basicDetails.websiteURL}/blog/${slug}`;

  return {
    title: `${data.title?.slice(0, 55)} | QA Playground`,
    description: data.description?.slice(0, 160),
    keywords: data.keywords || "",
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title: data.title,
      description: data.description?.slice(0, 200),
      images: data.image
        ? [{ url: data.image, width: 1200, height: 630, alt: data.imageAlt || data.title }]
        : [],
      locale: "en_US",
      siteName: "QA Playground",
      publishedTime: data.date,
      modifiedTime: data.lastModified || data.date,
      authors: [data.authorUrl || basicDetails.websiteURL],
      tags: data.category || [],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description?.slice(0, 160),
      images: data.image ? [data.image] : [],
      creator: "@qaplayground",
      site: "@qaplayground",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    authors: [{ name: data.author || "Kundalik Jadhav", url: data.authorUrl }],
    other: {
      "geo.region": "IN",
      "geo.placename": "India",
      "content-language": "en-IN",
      "revisit-after": "7 days",
      "article:published_time": data.date,
      "article:modified_time": data.lastModified || data.date,
      "article:author": data.author || "Kundalik Jadhav",
      "article:section": data.category?.[0] || "QA Automation",
      "article:tag": (data.category || []).join(", "),
    },
  };
}

const BlogPostPage = async ({ params }) => {
  const { slug } = await params;
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) return notFound();

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);

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
        transformers: [
          transformerCopyButton({ visibility: "always", feedbackDuration: 3000 }),
        ],
      })
      .use(rehypeStringify)
      .process(content)
  ).toString();

  const postUrl = `${basicDetails.websiteURL}/blog/${slug}`;

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-6 pb-20">
      {/* Back link */}
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          href="/blog"
          prefetch={false}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          All posts
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-5xl mx-auto text-start text-foreground bg-background py-4">
        <h1 className="text-3xl sm:text-4xl font-semibold pb-2">{data.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm mt-2 pb-2">
          <Badge className="px-2 py-1">By {data.author || "Kundalik Jadhav"}</Badge>
          <p className="flex items-center gap-1 text-muted-foreground">
            <Calendar size={14} />
            {new Date(data.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          {data.category?.map((cat) => (
            <Badge key={cat} variant="outline" className="capitalize">
              {cat}
            </Badge>
          ))}
        </div>
        <hr />
      </header>

      {/* Cover image */}
      {data.image && (
        <div className="flex justify-center mb-8">
          <Image
            src={data.image}
            alt={data.imageAlt || data.title}
            width={800}
            height={400}
            className="rounded-lg shadow-lg w-full max-w-2xl object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article className="prose dark:prose-invert max-w-5xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </article>

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
              "@id": postUrl,
            },
            url: postUrl,
            keywords: data.keywords || "",
            articleSection: data.category?.[0] || "QA Automation",
            inLanguage: "en-US",
          }),
        }}
      />
    </div>
  );
};

export default BlogPostPage;
