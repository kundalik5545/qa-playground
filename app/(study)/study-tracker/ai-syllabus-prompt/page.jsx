import "../study-tracker.css";
import PromptPageContent from "./PromptPageContent";

export const metadata = {
  title: "AI Syllabus Generator Prompt | QA Study Tracker",
  description:
    "Use this ready-made prompt with any AI model — ChatGPT, Claude, Gemini — to generate study syllabi in the exact format the QA Study Tracker can import. No manual JSON required.",
  keywords: [
    "AI syllabus generator",
    "QA study tracker",
    "QA learning syllabus",
    "ChatGPT study plan",
    "Claude syllabus generator",
    "Gemini QA syllabus",
    "QA automation learning path",
    "Playwright syllabus",
    "Cypress syllabus",
    "Selenium study plan",
    "import syllabus JSON",
  ],
  openGraph: {
    title: "AI Syllabus Generator Prompt | QA Study Tracker",
    description:
      "Generate a custom QA study syllabus with any AI model and import it directly into the QA Study Tracker — no manual editing required.",
    type: "article",
    url: "https://www.qaplayground.com/study-tracker/ai-syllabus-prompt",
    siteName: "QA PlayGround",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Syllabus Generator Prompt | QA Study Tracker",
    description:
      "Generate a custom QA study syllabus with ChatGPT, Claude, or Gemini and import it into QA Study Tracker in seconds.",
    site: "@qaplayground",
  },
  alternates: {
    canonical: "https://www.qaplayground.com/study-tracker/ai-syllabus-prompt",
  },
};

export default function AiSyllabusPromptPage() {
  return <PromptPageContent />;
}
