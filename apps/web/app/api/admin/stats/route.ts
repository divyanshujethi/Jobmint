import { NextResponse } from "next/server";
import { db, companies, jobs, applications, users, skills, candidateProfiles, desc, eq, sql } from "@repo/database";
import { auth } from "@/auth";
import { checkDatabase, checkRedis } from "@/lib/health-check";
import { signAccessToken } from "@repo/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin = (session?.user as any)?.role === "ADMIN" || (userEmail && adminEmails.includes(userEmail));

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: SuperAdmin required" }, { status: 403 });
    }

    const [allCompanies, allJobs, allApps, allUsers, allSkills, allResumes, dbHealth, redisHealth] = await Promise.all([
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
      db
        .select({
          id: candidateProfiles.id,
          userId: candidateProfiles.userId,
          userName: users.name,
          userEmail: users.email,
          headline: candidateProfiles.headline,
          location: candidateProfiles.location,
          resumeUrl: candidateProfiles.resumeUrl,
          isFresher: candidateProfiles.isFresher,
          updatedAt: candidateProfiles.updatedAt,
        })
        .from(candidateProfiles)
        .leftJoin(users, eq(candidateProfiles.userId, users.id))
        .where(sql`${candidateProfiles.resumeUrl} IS NOT NULL AND ${candidateProfiles.resumeUrl} != ''`)
        .orderBy(desc(candidateProfiles.updatedAt)),
      checkDatabase(),
      checkRedis(),
    ]);

    const proUsersCount = allUsers.filter((u) => u.isPro).length;
    const featuredJobsCount = allJobs.filter((j) => (j as any).isFeatured).length;

    const formattedResumes = allResumes.map((r) => {
      const rawUrl = r.resumeUrl || "";
      let cleanKey = "";
      if (rawUrl.includes("key=")) {
        try {
          const u = new URL(rawUrl.startsWith("http") ? rawUrl : `https://rolenest.in${rawUrl}`);
          cleanKey = u.searchParams.get("key") || "";
        } catch {}
      } else if (rawUrl.includes("token=")) {
        try {
          const u = new URL(rawUrl.startsWith("http") ? rawUrl : `https://rolenest.in${rawUrl}`);
          cleanKey = u.searchParams.get("token") || "";
        } catch {}
      } else {
        cleanKey = rawUrl.replace(/^.*[\\\/]/, "");
      }

      if (cleanKey && !cleanKey.endsWith(".pdf") && cleanKey.length === 64) {
        cleanKey = `${cleanKey}.pdf`;
      }

      const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 hours
      const token = cleanKey ? signAccessToken(cleanKey, expiresAt) : "";
      const streamUrl = cleanKey
        ? `/api/resumes/stream?key=${encodeURIComponent(cleanKey)}&token=${token}&expires=${expiresAt}`
        : rawUrl;

      return {
        ...r,
        resumeUrl: streamUrl,
        key: cleanKey,
      };
    });

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
        totalResumes: allResumes.length,
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
      resumes: formattedResumes,
    });
  } catch (error: any) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
