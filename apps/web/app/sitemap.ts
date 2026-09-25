import type { MetadataRoute } from "next";
import { db, jobs, companies, eq, desc } from "@repo/database";
import { MOCK_JOBS } from "@/lib/mock-jobs";
import { PSEO_TOPICS } from "@/lib/pseo-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://rolenest.in";

  // 1. Static Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.95 },
    { url: `${baseUrl}/internships`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/companies`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/potd`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/problems`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/roadmaps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/dev-score`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${baseUrl}/resume/builder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/placement-portal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/bounties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/salaries`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/transparency`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/cancellation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // 2. Dynamic Job Slugs from Database
  let jobRoutes: MetadataRoute.Sitemap = [];
  try {
    const liveJobs = await db
      .select({
        slug: jobs.slug,
        updatedAt: jobs.updatedAt,
        createdAt: jobs.createdAt,
      })
      .from(jobs)
      .where(eq(jobs.isActive, true))
      .limit(500);

    if (liveJobs && liveJobs.length > 0) {
      jobRoutes = liveJobs.map((j) => ({
        url: `${baseUrl}/jobs/${j.slug}`,
        lastModified: j.updatedAt || j.createdAt || new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));
    } else {
      jobRoutes = MOCK_JOBS.map((j) => ({
        url: `${baseUrl}/jobs/${j.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.85,
      }));
    }
  } catch {
    jobRoutes = MOCK_JOBS.map((j) => ({
      url: `${baseUrl}/jobs/${j.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    }));
  }

  // 3. Dynamic Companies
  let companyRoutes: MetadataRoute.Sitemap = [];
  try {
    const liveCompanies = await db
      .select({
        slug: companies.slug,
        updatedAt: companies.updatedAt,
      })
      .from(companies)
      .limit(200);

    companyRoutes = liveCompanies.map((c) => ({
      url: `${baseUrl}/companies/${c.slug}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {}

  // 4. Learning Roadmaps
  const roadmapSlugs = [
    "frontend-developer",
    "backend-developer",
    "fullstack-developer",
    "ai-ml-engineer",
    "devops-engineer",
    "cloud-engineer",
    "data-engineer",
    "mobile-engineer",
  ];
  const roadmapRoutes: MetadataRoute.Sitemap = roadmapSlugs.map((slug) => ({
    url: `${baseUrl}/roadmaps/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 5. Programmatic SEO Landing Pages (pSEO)
  const pseoRoutes: MetadataRoute.Sitemap = Object.keys(PSEO_TOPICS).map((slug) => ({
    url: `${baseUrl}/jobs/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...pseoRoutes, ...jobRoutes, ...companyRoutes, ...roadmapRoutes];
}
