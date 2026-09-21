import { NextResponse } from "next/server";
import { MOCK_JOBS } from "@/lib/mock-jobs";
import { APP_CONFIG } from "@repo/shared";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://jobmint.dev";
  const now = new Date().toUTCString();

  const itemsXml = MOCK_JOBS.map((job) => {
    const jobUrl = `${baseUrl}/jobs/${job.slug}`;
    const pubDate = new Date(job.postedAt || Date.now()).toUTCString();
    const cleanDesc = job.description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const cleanTitle = `${job.title} at ${job.companyName} (${job.salaryOrStipend})`
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return `    <item>
      <title>${cleanTitle}</title>
      <link>${jobUrl}</link>
      <guid isPermaLink="true">${jobUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${cleanDesc}]]></description>
      <category>${job.jobType}</category>
      <author>noreply@jobmint.dev (${job.companyName})</author>
    </item>`;
  }).join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${APP_CONFIG.name} — Verified Jobs &amp; Paid Internships</title>
    <link>${baseUrl}</link>
    <description>${APP_CONFIG.tagline} • 100% Free &amp; Transparent Placement Syndication</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/api/feed/rss" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate=1200",
    },
  });
}