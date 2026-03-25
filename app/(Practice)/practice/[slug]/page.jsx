import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { transformerCopyButton } from "@rehype-pretty/transformers";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Image from "next/image";
import { basicDetails } from "@/data/BasicSetting";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Blog Components
import ElementsPage from "../_components/ElementsPage";
import InputPage from "../_components/InputPage";
import ButtonPage from "../_components/ButtonPage";
import SelectPage from "../_components/SelectPage";
// import LinksPage from "../_components/LinksPage";
import LinksPage from "../_components/LinkPage";
import AlertPage from "../_components/AlertPage";
import RadioButtonPage from "../_components/RadioButton";
import WindowsPage from "../_components/WindowsPage";
import WaitPage from "../_components/WaitPage";
import FilePage from "../_components/FileUploadDownloadPage";
import CalendarPage from "../_components/CalendarPage";
import SimpleTablePage from "../_components/TablePage";
import AdvanceTablePage from "../_components/AdvanceTablePage";
import MultiSelectPage from "../_components/MultiSelectPage";
import FormsPage from "../_components/FormsPage";

// Blog Slug to Component Mapping
const componentMapping = {
  pom: ElementsPage,
  input: InputPage,
  button: ButtonPage,
  select: SelectPage,
  links: LinksPage,
  alert: AlertPage,
  radio: RadioButtonPage,
  window: WindowsPage,
  waits: WaitPage,
  calendar: CalendarPage,
  "upload-download": FilePage,
  "simple-table": SimpleTablePage,
  "advance-table": AdvanceTablePage,
  "multi-select": MultiSelectPage,
  forms: FormsPage,
};

// Fetch all blog slugs dynamically
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "Blog/elements");
  return fs.readdirSync(postsDirectory).map((filename) => ({
    slug: filename.replace(/\.md$/, ""),
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "Blog/elements", `${slug}.md`);

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
      url: `${basicDetails.websiteURL}/practice/${slug}`,
      images: data.image ? [{ url: data.image }] : [],
    },
    alternates: {
      canonical: `${basicDetails.websiteURL}/practice/${slug}`,
    },
  };
}

// Blog Post Component
const PracticePage = async ({ params }) => {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "Blog/elements", `${slug}.md`);

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
        {data.isBlog === "Yes" ? (
          <>
            {/* Blog Header */}
            <header className="max-w-5xl mx-auto text-start text-foreground bg-background py-6">
              <h1 className="text-3xl sm:text-4xl font-semibold  pb-2">
                {data.title}
              </h1>
              <div className="flex flex-wrap justify-start items-center gap-3 text-sm mt-2 pb-2">
                <Badge className="px-2 py-1">By {data.author || "Admin"}</Badge>
                <p className="flex items-center gap-1">
                  <Calendar size={18} />
                  {new Date(data.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <hr className="" />
            </header>

            {/* Blog Image */}
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
          </>
        ) : (
          <>
            {/* Main Playground */}
            <section
              className={cn("pb-20", data?.isBlog === "Yes" && "hidden")}
            >
              {DynamicComponent && <DynamicComponent />}
            </section>
          </>
        )}

        {/* Blog Content */}
        <article className="prose dark:prose-invert max-w-5xl mx-auto">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>
      </div>
    );
  } catch (error) {
    console.error("Error reading blog post:", error);
    return notFound();
  }
};

export default PracticePage;
