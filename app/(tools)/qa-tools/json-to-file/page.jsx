import JsonToFileContent from "./JsonToFileContent";

export const metadata = {
  title: "JSON to Downloadable File | QA Tools",
  description:
    "Paste AI-generated syllabus JSON and download it as a .json file ready to import into the QA Study Tracker. Auto-detects filename from the FILENAME prefix.",
  keywords: [
    "JSON to file download",
    "QA study tracker import",
    "AI syllabus JSON download",
    "syllabus file converter",
    "QA learning syllabus",
    "Playwright syllabus import",
  ],
  openGraph: {
    title: "JSON to Downloadable File | QA Tools",
    description:
      "Paste your AI-generated syllabus JSON and download it instantly as a .json file ready to import into QA Study Tracker.",
    type: "article",
    url: "https://www.qaplayground.com/qa-tools/json-to-file",
    siteName: "QA PlayGround",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to Downloadable File | QA Tools",
    description:
      "Paste AI syllabus JSON, get a downloadable .json file. Import directly into QA Study Tracker.",
    site: "@qaplayground",
  },
  alternates: {
    canonical: "https://www.qaplayground.com/qa-tools/json-to-file",
  },
};

export default function JsonToFilePage() {
  return <JsonToFileContent />;
}
