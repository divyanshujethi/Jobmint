import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://rolenest.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/settings/",
          "/account/",
          "/canvas",
          "/employer/applicants",
        ],
      },
      // AI Search Engine Crawlers (Allow full indexing for AI discoverability: Perplexity, ChatGPT Search, Gemini)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "PerplexityBot",
          "Claude-Web",
          "anthropic-ai",
          "Applebot-Extended",
          "Bytespider",
          "CCBot",
          "cohere-ai",
        ],
        allow: [
          "/",
          "/jobs",
          "/jobs/",
          "/internships",
          "/companies",
          "/companies/",
          "/courses",
          "/courses/",
          "/roadmaps",
          "/roadmaps/",
          "/problems",
          "/problems/",
          "/potd",
          "/dev-score",
          "/placement-portal",
          "/transparency",
          "/resume/builder",
        ],
        disallow: ["/admin/", "/api/", "/settings/", "/account/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
