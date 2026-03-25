import { basicDetails } from "@/data/BasicSetting";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import fs from "fs";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import path from "path";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Blog Components
import CoursesPage from "../_components/CoursesPage";
import LogicalProgramsTable from "../_components/LogicalPrograms";

// Blog Slug to Component Mapping
const componentMapping = {
  courses: CoursesPage,
  "logical-programs-list-to-crack-interviews": LogicalProgramsTable,
};

// Fetch all learn slugs dynamically
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "Blog/learn");
  return fs.readdirSync(postsDirectory).map((filename) => ({
    slug: filename.replace(/\.md$/, ""),
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = params;
  const filePath = path.join(
    process.cwd(),
    "Blog/learn",
    `${slug}.md`
  );

  if (!fs.existsSync(filePath)) return notFound();

  const { data } = matter(fs.readFileSync(filePath, "utf-8"));

  return {
    title: data.title ? `${data.title.slice(0, 60)}` : "New Blog Post",
    description: data.description?.slice(0, 160) || "Automation blog",
    keywords: data.keywords || "automation, selenium",
    author: data.author || "Random Coders",
    openGraph: {
      title: data.title || "QA Playground - Practice automation",
      description: data.description?.slice(0, 200) || "Practice automation",
      url: `${basicDetails.websiteURL}/learn/${slug}`,
      images: data.image ? [{ url: data.image }] : [],
    },
    alternates: {
      canonical: `${basicDetails.websiteURL}/learn/${slug}`,
    },
  };
}

// Learn Page Component
const LearnMainPage = async ({ params }) => {
  const { slug } = params;
  const filePath = path.join(process.cwd(), "Blog/learn", `${slug}.md`);

  if (!fs.existsSync(filePath)) return notFound();

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(fileContent);

    // Convert Markdown to HTML
    const htmlContent = (
      await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings)
        .use(rehypePrettyCode, {
          theme: "github-dark",
          transformers: [
            transformerCopyButton({
              visibility: "always",
              feedbackDuration: 3000,
            }),
          ],
        })
        .process(content)
    ).toString();

    const DynamicComponent = componentMapping[slug] || null;

    return (
      <div className="container mx-auto px-4 lg:px-8">
        {/* Interactive component (e.g. CoursesPage, LogicalProgramsTable) */}
        {DynamicComponent && (
          <section className="pb-20">
            <DynamicComponent />
          </section>
        )}

        {/* Markdown content */}
        <article className="prose dark:prose-invert max-w-5xl mx-auto">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>
      </div>
    );
  } catch (error) {
    console.error("Error reading learn page:", error);
    return notFound();
  }
};

export default LearnMainPage;
