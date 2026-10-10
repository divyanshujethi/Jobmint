import { NextResponse } from "next/server";
import { db, users, jobs, candidateProfiles, eq, and, desc, sql } from "@repo/database";
import { sendEmail, dailyMatchesDigestTemplate } from "@repo/email";

import { verifyCronOrAdminSecret } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily Verified Matches Digest Cron Handler
 * Selects active candidates and emails a free curated daily digest of new verified jobs.
 * High-retention mechanism that delivers value without paywalling basic notifications.
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (!verifyCronOrAdminSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch top 5 recent verified active jobs
    const recentJobs = await db
      .select({
        title: jobs.title,
        slug: jobs.slug,
        salaryOrStipend: jobs.salaryOrStipend,
        location: jobs.location,
        companyName: sql<string>`(SELECT name FROM companies WHERE companies.id = jobs.company_id LIMIT 1)`,
      })
      .from(jobs)
      .where(eq(jobs.isActive, true))
      .orderBy(desc(jobs.createdAt))
      .limit(5);

    if (recentJobs.length === 0) {
      return NextResponse.json({ success: true, message: "No active jobs found for digest" });
    }

    // 2. Fetch active candidates (sample batch up to 25 to respect free tier SMTP limits)
    const candidates = await db
      .select({
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.role, "CANDIDATE"))
      .limit(25);

    let sentCount = 0;
    for (const c of candidates) {
      if (!c.email) continue;
      const tpl = dailyMatchesDigestTemplate(
        c.name || "Engineer",
        recentJobs.map((j) => ({
          title: j.title,
          companyName: j.companyName || "Verified Employer",
          location: j.location,
          salaryOrStipend: j.salaryOrStipend,
          slug: j.slug,
        }))
      );

      try {
        await sendEmail({
          to: c.email,
          subject: tpl.subject,
          html: tpl.html,
        });
        sentCount++;
      } catch (err: any) {
        console.warn(`[Daily Digest] Failed to send to ${c.email}:`, err.message);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        candidatesSampled: candidates.length,
        digestsDispatched: sentCount,
        jobsIncluded: recentJobs.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[Daily Digest] Execution error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  return GET(request);
}
