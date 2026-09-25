import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { notifyGoogleIndexing, publishJobSlugToGoogle } from "@/lib/google-indexing";
import { db, jobs, eq } from "@repo/database";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin = (session?.user as any)?.role === "ADMIN" || (userEmail && adminEmails.includes(userEmail));

    const authHeader = req.headers.get("authorization");
    const isCronAuthorized =
      authHeader && process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isAdmin && !isCronAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required to publish to Google Indexing API" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { url, slug, publishAll } = body;

    // 1. Bulk publish all active live jobs
    if (publishAll) {
      const liveJobs = await db
        .select({ slug: jobs.slug })
        .from(jobs)
        .where(eq(jobs.isActive, true))
        .limit(100);

      const results = [];
      for (const j of liveJobs) {
        const res = await publishJobSlugToGoogle(j.slug, "URL_UPDATED");
        results.push(res);
      }

      return NextResponse.json({
        success: true,
        totalQueued: liveJobs.length,
        results,
      });
    }

    // 2. Publish single job slug
    if (slug) {
      const result = await publishJobSlugToGoogle(slug, "URL_UPDATED");
      return NextResponse.json(result);
    }

    // 3. Publish arbitrary URL
    if (url) {
      const result = await notifyGoogleIndexing(url, "URL_UPDATED");
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Provide either { slug: string }, { url: string }, or { publishAll: true }" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Google Indexing API route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
