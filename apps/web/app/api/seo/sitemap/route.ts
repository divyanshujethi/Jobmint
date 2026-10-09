import { NextRequest, NextResponse } from "next/server";
import { LEETCODE_PROBLEMS } from "@/lib/problems-data";
import { CAREER_ROADMAPS } from "@repo/shared";
import { db, jobs, companies, eq } from "@repo/database";
import { PSEO_TOPICS } from "@/lib/pseo-data";

function formatUrlEntry(url: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function GET(req: NextRequest) {
  const host = (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    ""
  ).toLowerCase();

  const now = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  if (host.includes("problem.") || host.includes("arena.") || host.includes("code.")) {
    // ProblemNest Arena Subdomain Sitemap
    urls.push(formatUrlEntry("https://problem.rolenest.in/potd", now, "daily", "1.0"));
    urls.push(formatUrlEntry("https://problem.rolenest.in/problems", now, "daily", "0.9"));

    for (const p of LEETCODE_PROBLEMS) {
      urls.push(
        formatUrlEntry(
          `https://problem.rolenest.in/potd?problem=${p.slug}`,
          now,
          "weekly",
          "0.8"
        )
      );
    }
  } else if (host.includes("study.") || host.includes("learn.")) {
    // StudyNest Academy Subdomain Sitemap
    urls.push(formatUrlEntry("https://study.rolenest.in", now, "daily", "1.0"));
    urls.push(formatUrlEntry("https://study.rolenest.in/courses", now, "weekly", "0.9"));
    urls.push(formatUrlEntry("https://study.rolenest.in/roadmaps", now, "weekly", "0.9"));
    urls.push(formatUrlEntry("https://study.rolenest.in/playlists", now, "weekly", "0.8"));
    urls.push(formatUrlEntry("https://study.rolenest.in/certificates", now, "monthly", "0.8"));

    const roadmapSlugs = [
      "ai-engineer",
      "fullstack-developer",
      "data-analyst",
      "backend-systems",
      "devops-cloud",
      "data-engineer",
      "cybersecurity",
      "mobile-engineer",
    ];

    for (const slug of roadmapSlugs) {
      urls.push(
        formatUrlEntry(
          `https://study.rolenest.in/roadmaps/${slug}`,
          now,
          "monthly",
          "0.85"
        )
      );
    }
  } else if (host.includes("internship.")) {
    // Internship Subdomain Sitemap
    urls.push(formatUrlEntry("https://internship.rolenest.in", now, "daily", "1.0"));
    urls.push(formatUrlEntry("https://internship.rolenest.in/portal", now, "daily", "0.9"));
    urls.push(formatUrlEntry("https://internship.rolenest.in/ai-ml", now, "weekly", "0.85"));
    urls.push(formatUrlEntry("https://internship.rolenest.in/full-stack-web-dev", now, "weekly", "0.85"));
    urls.push(formatUrlEntry("https://internship.rolenest.in/data-science-analytics", now, "weekly", "0.85"));
  } else {
    // Main Domain Sitemap (rolenest.in)
    urls.push(formatUrlEntry("https://rolenest.in", now, "daily", "1.0"));
    urls.push(formatUrlEntry("https://rolenest.in/jobs", now, "hourly", "0.95"));
    urls.push(formatUrlEntry("https://rolenest.in/internships", now, "daily", "0.9"));
    urls.push(formatUrlEntry("https://rolenest.in/companies", now, "daily", "0.85"));
    urls.push(formatUrlEntry("https://rolenest.in/pricing", now, "weekly", "0.85"));
    urls.push(formatUrlEntry("https://rolenest.in/dev-score", now, "weekly", "0.8"));
    urls.push(formatUrlEntry("https://rolenest.in/resume/builder", now, "monthly", "0.8"));
    urls.push(formatUrlEntry("https://rolenest.in/placement-portal", now, "weekly", "0.8"));
    urls.push(formatUrlEntry("https://rolenest.in/extension", now, "weekly", "0.75"));
    urls.push(formatUrlEntry("https://rolenest.in/transparency", now, "monthly", "0.6"));
    urls.push(formatUrlEntry("https://rolenest.in/terms", now, "monthly", "0.4"));
    urls.push(formatUrlEntry("https://rolenest.in/privacy", now, "monthly", "0.4"));

    // pSEO Pages
    for (const slug of Object.keys(PSEO_TOPICS)) {
      urls.push(formatUrlEntry(`https://rolenest.in/jobs/${slug}`, now, "daily", "0.85"));
    }

    // Top active jobs
    try {
      const liveJobs = await db
        .select({ slug: jobs.slug, updatedAt: jobs.updatedAt, createdAt: jobs.createdAt })
        .from(jobs)
        .where(eq(jobs.isActive, true))
        .limit(3000);

      for (const j of liveJobs) {
        const d = (j.updatedAt || j.createdAt || new Date()).toISOString().split("T")[0];
        urls.push(formatUrlEntry(`https://rolenest.in/jobs/${j.slug}`, d, "daily", "0.8"));
      }
    } catch {}
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
