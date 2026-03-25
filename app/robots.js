import { basicDetails } from "@/data/BasicSetting";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/auth/"],
      },
      // Explicitly allow major AI crawlers
      { userAgent: "GPTBot", allow: "/" },           // OpenAI / ChatGPT
      { userAgent: "ClaudeBot", allow: "/" },         // Anthropic / Claude
      { userAgent: "PerplexityBot", allow: "/" },     // Perplexity AI
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },   // Google AI training
      { userAgent: "Applebot-Extended", allow: "/" }, // Apple AI
    ],
    sitemap: `${basicDetails.websiteURL}/sitemap.xml`,
  };
}
