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
import Link from "next/link";
import Script from "next/script";
import { basicDetails } from "@/data/BasicSetting";
import { Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { practiceElementFaqs } from "@/data/practiceElementFaqs";
import PracticeElementFAQ from "../_components/PracticeElementFAQ";

// Practice Components
import ElementsPage from "../_components/ElementsPage";
import InputPage from "../_components/InputPage";
import ButtonPage from "../_components/ButtonPage";
import SelectPage from "../_components/SelectPage";
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

const componentMapping = {
  pom: ElementsPage,
  "input-fields": InputPage,
  buttons: ButtonPage,
  dropdowns: SelectPage,
  links: LinksPage,
  "alerts-dialogs": AlertPage,
  "radio-checkbox": RadioButtonPage,
  "tabs-windows": WindowsPage,
  "dynamic-waits": WaitPage,
  "date-picker": CalendarPage,
  "file-upload": FilePage,
  "data-table": SimpleTablePage,
  "advance-table": AdvanceTablePage,
  "multi-select": MultiSelectPage,
  forms: FormsPage,
};

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "Blog/elements");
  return fs.readdirSync(postsDirectory).map((filename) => ({
    slug: filename.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "Blog/elements", `${slug}.md`);

  if (!fs.existsSync(filePath)) return notFound();

  const { data } = matter(fs.readFileSync(filePath, "utf-8"));
  const pageUrl = `${basicDetails.websiteURL}/practice/${slug}`;

  return {
    title: data.title?.slice(0, 70) || "Practice Element | QA Playground",
    description: data.description?.slice(0, 160) || "Automation practice element",
    keywords: data.keywords || "automation, selenium, playwright",
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "article",
      url: pageUrl,
      title: data.title || "Practice Element | QA Playground",
      description: data.description?.slice(0, 200) || "Practice automation",
      locale: "en_US",
      images: data.image ? [{ url: data.image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title || "Practice Element | QA Playground",
      description: data.description?.slice(0, 160) || "Practice automation",
      images: data.image ? [data.image] : [],
    },
  };
}

// Build JSON-LD for practice (non-blog) pages
function buildJsonLd(slug, data, faqs = []) {
  const pageUrl = `${basicDetails.websiteURL}/practice/${slug}`;
  const elementName = data.title || slug;

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "LearningResource",
      name: elementName,
      description: data.description || "",
      url: pageUrl,
      educationalLevel: data.educationalLevel || "Beginner to Intermediate",
      teaches: data.teaches || [],
      programmingLanguage: data.programmingLanguage || [],
      provider: {
        "@type": "Organization",
        name: "QA Playground",
        url: basicDetails.websiteURL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: basicDetails.websiteURL },
        { "@type": "ListItem", position: 2, name: "Practice", item: `${basicDetails.websiteURL}/practice` },
        { "@type": "ListItem", position: 3, name: elementName, item: pageUrl },
      ],
    },
  ];

  if (faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return schemas;
}

const PracticePage = async ({ params }) => {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "Blog/elements", `${slug}.md`);

  if (!fs.existsSync(filePath)) return notFound();

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(fileContent);

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
    const isPracticePage = data?.isBlog !== "Yes";
    const faqs = practiceElementFaqs[slug] ?? [];

    return (
      <div className="container mx-auto px-4 lg:px-8">
        {/* JSON-LD for practice pages */}
        {isPracticePage && (
          <Script
            id={`practice-${slug}-jsonld`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildJsonLd(slug, data, faqs)),
            }}
          />
        )}

        {data.isBlog === "Yes" ? (
          <>
            {/* Blog Header */}
            <header className="max-w-5xl mx-auto text-start text-foreground bg-background py-6">
              <h1 className="text-3xl sm:text-4xl font-semibold pb-2">
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
          </>
        ) : (
          <>
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 py-3"
            >
              <Link
                href="/"
                prefetch={false}
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <ChevronRight size={12} />
              <Link
                href="/practice"
                prefetch={false}
                className="hover:text-foreground transition-colors"
              >
                Practice
              </Link>
              <ChevronRight size={12} />
              <span className="text-foreground font-medium capitalize">
                {data.title
                  ? data.title.split("—")[0].trim().split("|")[0].trim()
                  : slug}
              </span>
            </nav>

            {/* Practice Component */}
            <section className={cn("pb-20")}>
              {DynamicComponent && <DynamicComponent />}
            </section>
          </>
        )}

        {/* Markdown content */}
        <article className="prose dark:prose-invert max-w-5xl mx-auto">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>

        {/* FAQ section — only for practice pages with FAQ data */}
        {isPracticePage && <PracticeElementFAQ faqs={faqs} />}
      </div>
    );
  } catch (error) {
    console.error("Error reading practice page:", error);
    return notFound();
  }
};

export default PracticePage;
