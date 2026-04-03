import { Camera } from "lucide-react";
import { Scissors } from "lucide-react";

const RESOURCE_TYPES = [
  "ARTICLE",
  "VIDEO",
  "COURSE",
  "BOOK",
  "TOOL",
  "DOCUMENTATION",
  "OTHER",
];

const TYPE_LABELS = {
  ARTICLE: "Article",
  VIDEO: "Video",
  COURSE: "Course",
  BOOK: "Book",
  TOOL: "Tool",
  DOCUMENTATION: "Docs",
  OTHER: "Other",
};

const TYPE_COLORS = {
  ARTICLE: { bg: "#eff6ff", color: "#2563eb" },
  VIDEO: { bg: "#fef2f2", color: "#dc2626" },
  COURSE: { bg: "#f0fdf4", color: "#16a34a" },
  BOOK: { bg: "#fffbeb", color: "#d97706" },
  TOOL: { bg: "#faf5ff", color: "#9333ea" },
  DOCUMENTATION: { bg: "#f0f9ff", color: "#0284c7" },
  OTHER: { bg: "#f9fafb", color: "#6b7280" },
};

const EMPTY_FORM = {
  resourceType: "",
  title: "",
  url: "",
  description: "",
  tags: [],
  image: "",
};

// ── Feature flag ──────────────────────────────────────────────────────────────
// Set to false to hide all Chrome extension cards from the DOM entirely.
const SHOW_EXTENSION_CARDS = false;
// ──────────────────────────────────────────────────────────────────────────────

// Each extension injects a DOM element with its domId when installed.
// Update installUrl values once extensions are published to the Chrome Web Store.
const CHROME_EXTENSIONS = [
  {
    id: "ext-qa-clipper",
    domId: "qa-clipper-ext-installed",
    title: "QA Clipper",
    description:
      "Clip and save resources from any webpage directly to your QA Playground resource list.",
    Icon: Scissors,
    installUrl:
      "https://chromewebstore.google.com/detail/jegdkegbomfbmhhimfjgacdblcoodfpd?utm_source=item-share-cb",
  },
  {
    id: "ext-qa-screenshot",
    domId: "qa-screenshot-ext-installed",
    title: "QA Capture",
    description:
      "Capture and annotate screenshots of web elements for your QA reports.",
    Icon: Camera,
    installUrl:
      "https://chromewebstore.google.com/detail/jhgkhnokloeklnagbkgkgcfphafifefg?utm_source=item-share-cb",
  },
];

export {
  RESOURCE_TYPES,
  TYPE_LABELS,
  TYPE_COLORS,
  EMPTY_FORM,
  SHOW_EXTENSION_CARDS,
  CHROME_EXTENSIONS,
};
