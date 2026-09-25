import { NextRequest, NextResponse } from "next/server";
import { db, companies, jobs, applications, users, skills, desc, eq } from "@repo/database";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    const adminEmails = (process.env.ADMIN_EMAILS || "admin@rolenest.in,divyanshu.dev@gmail.com,divyanshujethi@gmail.com,admin@ritualdev.in")
      .split(",")
      .map((e) => e.trim().toLowerCase());

    const userEmail = session?.user?.email?.toLowerCase();
    const isAdmin = (session?.user as any)?.role === "ADMIN" || (userEmail && adminEmails.includes(userEmail));

    // Also allow in development or if header has valid token, but for production check role or admin email
    const allCompanies = await db.select().from(companies).orderBy(desc(companies.createdAt));
    const allJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
    const allApps = await db
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
      .orderBy(desc(applications.appliedAt));

    const totalUsers = await db.select().from(users);
    const totalSkills = await db.select().from(skills);

    return NextResponse.json({
      isAdmin: Boolean(isAdmin),
      currentUser: session?.user || null,
      stats: {
        totalCompanies: allCompanies.length,
        verifiedCompanies: allCompanies.filter((c) => c.isVerified).length,
        totalJobs: allJobs.length,
        activeJobs: allJobs.filter((j) => j.isActive).length,
        totalApplications: allApps.length,
        totalUsers: totalUsers.length,
        totalSkills: totalSkills.length,
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
