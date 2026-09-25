import { NextResponse } from "next/server";
import { db, companies, jobs, applications, users, skills, desc, eq } from "@repo/database";
import { auth } from "@/auth";
import { checkDatabase, checkRedis } from "@/lib/health-check";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin = (session?.user as any)?.role === "ADMIN" || (userEmail && adminEmails.includes(userEmail));

    const [allCompanies, allJobs, allApps, allUsers, allSkills, dbHealth, redisHealth] = await Promise.all([
      db.select().from(companies).orderBy(desc(companies.createdAt)),
      db.select().from(jobs).orderBy(desc(jobs.createdAt)),
      db
        .select({
          id: applications.id,
          jobId: applications.jobId,
          status: applications.status,
          appliedAt: applications.appliedAt,
          lastViewedAt: applications.lastViewedAt,
          jobTitle: jobs.title,
          companyName: companies.name,
        })
        .from(applications)
        .innerJoin(jobs, eq(applications.jobId, jobs.id))
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .orderBy(desc(applications.appliedAt)),
      db.select().from(users),
      db.select().from(skills),
      checkDatabase(),
      checkRedis(),
    ]);

    const proUsersCount = allUsers.filter((u) => u.isPro).length;
    const featuredJobsCount = allJobs.filter((j) => (j as any).isFeatured).length;

    return NextResponse.json({
      isAdmin: Boolean(isAdmin),
      currentUser: session?.user || null,
      stats: {
        totalCompanies: allCompanies.length,
        verifiedCompanies: allCompanies.filter((c) => c.isVerified).length,
        totalJobs: allJobs.length,
        activeJobs: allJobs.filter((j) => j.isActive).length,
        featuredJobs: featuredJobsCount,
        totalApplications: allApps.length,
        totalUsers: allUsers.length,
        proUsers: proUsersCount,
        totalSkills: allSkills.length,
      },
      health: {
        database: dbHealth,
        redis: redisHealth,
        uptimeSeconds: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
        backupSchedule: "Daily 02:00 UTC (automated gzip pg_dump to /opt/backups)",
        firewall: "UFW Hardened (Ports 22, 80, 443 public; 5432, 6379, 11434 localhost)",
      },
      companies: allCompanies,
      jobs: allJobs,
      applications: allApps,
    });
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
