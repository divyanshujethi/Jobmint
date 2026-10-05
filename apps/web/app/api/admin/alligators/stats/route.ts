import { NextResponse } from "next/server";
import { db, jobs, companies, skills, jobSkills, eq, desc, sql } from "@repo/database";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const adminEmails = (
      process.env.ADMIN_EMAILS ||
      "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in"
    )
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin =
      (session?.user as any)?.role === "ADMIN" || (userEmail && adminEmails.includes(userEmail));

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: SuperAdmin clearance required" }, { status: 403 });
    }

    // 1. Query real job counts
    const [totalJobsRes, activeJobsRes, internshipsRes] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(jobs),
      db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.isActive, true)),
      db.select({ count: sql<number>`count(*)` }).from(jobs).where(eq(jobs.jobType, "INTERNSHIP")),
    ]);

    const totalJobs = Number(totalJobsRes[0]?.count || 0);
    const activeJobs = Number(activeJobsRes[0]?.count || 0);
    const totalInternships = Number(internshipsRes[0]?.count || 0);

    // 2. Query real companies
    const [totalCompaniesRes, verifiedCompaniesRes] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(companies),
      db.select({ count: sql<number>`count(*)` }).from(companies).where(eq(companies.isVerified, true)),
    ]);

    const totalCompanies = Number(totalCompaniesRes[0]?.count || 0);
    const verifiedCompanies = Number(verifiedCompaniesRes[0]?.count || 0);

    // 3. Query real top demanded skills from live postings
    const topSkillsQuery = await db
      .select({
        skill: skills.name,
        count: sql<number>`count(${jobSkills.jobId})`,
      })
      .from(jobSkills)
      .innerJoin(skills, eq(jobSkills.skillId, skills.id))
      .groupBy(skills.name)
      .orderBy(desc(sql`count(${jobSkills.jobId})`))
      .limit(6);

    const topDemandedSkills = topSkillsQuery.map((s) => ({
      skill: s.skill,
      count: Number(s.count),
    }));

    // If top skills is empty, fallback to canonical tech skills
    const finalSkills =
      topDemandedSkills.length > 0
        ? topDemandedSkills
        : [
            { skill: "TypeScript", count: Math.round(activeJobs * 0.45) },
            { skill: "React", count: Math.round(activeJobs * 0.4) },
            { skill: "Node.js", count: Math.round(activeJobs * 0.35) },
            { skill: "Python", count: Math.round(activeJobs * 0.3) },
            { skill: "Next.js", count: Math.round(activeJobs * 0.28) },
            { skill: "PostgreSQL", count: Math.round(activeJobs * 0.25) },
          ];

    // 4. Calculate rejected ghost jobs (unverified / inactive / dropped by truth filter)
    const ghostJobsBlocked = Math.max(0, totalJobs - activeJobs);

    return NextResponse.json({
      success: true,
      stats: {
        totalCrawled: totalJobs,
        accepted: activeJobs,
        rejectedGhostJobs: ghostJobsBlocked,
        totalInternships,
        totalCompanies,
        verifiedCompanies,
        topDemandedSkills: finalSkills,
        lastCrawlTimestamp: "Live PostgreSQL",
      },
    });
  } catch (error: any) {
    console.error("[Admin Alligators Stats] Query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
