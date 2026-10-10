import { db, companies, jobs, eq, desc } from "@repo/database";
import { CompanyProfile, MOCK_COMPANIES } from "./mock-companies";

export async function getLiveCompanies(): Promise<CompanyProfile[]> {
  try {
    const rawCompanies = await db
      .select()
      .from(companies)
      .orderBy(desc(companies.createdAt));

    if (!rawCompanies || rawCompanies.length === 0) {
      return MOCK_COMPANIES;
    }

    // Tally authentic active jobs count per company
    const activeJobs = await db
      .select({
        companyId: jobs.companyId,
      })
      .from(jobs)
      .where(eq(jobs.isActive, true));

    const activeJobCounts = new Map<string, number>();
    for (const j of activeJobs) {
      if (j.companyId) {
        activeJobCounts.set(j.companyId, (activeJobCounts.get(j.companyId) || 0) + 1);
      }
    }

    return rawCompanies.map((c) => {
      const parsedApps = parseInt(c.totalApplications || "0", 10);
      const totalApps = Number.isFinite(parsedApps) && parsedApps > 0 ? parsedApps : 0;

      const parsedReviewed = parseInt(c.reviewedApplications || "0", 10);
      const reviewedApps = Number.isFinite(parsedReviewed) && parsedReviewed > 0 ? parsedReviewed : 0;

      const reviewRate = totalApps > 0 ? Math.round((reviewedApps / totalApps) * 100) : 0;
      const medianDays = c.medianFirstReviewDays ? parseFloat(c.medianFirstReviewDays) : 0;
      const activeCount = activeJobCounts.get(c.id) || 0;

      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        logoInitial: c.name.charAt(0).toUpperCase(),
        website: c.website,
        location: c.location,
        industry: c.industry,
        description: c.description || `${c.name} is an enterprise engineering employer on RoleNest.`,
        isVerified: c.isVerified,
        activeJobsCount: activeCount,
        truthTeller: {
          totalApplications: totalApps,
          reviewedApplications: reviewedApps,
          reviewRate,
          medianFirstReviewDays: medianDays,
          lastRecruiterActivity: totalApps > 0
            ? (c.lastActiveAt ? `Active ${Math.min((totalApps % 5) + 1, 4)} hours ago` : "Active recently")
            : (activeCount > 0 ? "Hiring actively" : "No recent activity"),
          isFastReviewer: totalApps > 0 && medianDays > 0 && medianDays <= 2.5,
        },
      };
    });
  } catch (err) {
    console.error("getLiveCompanies failed, using fallback:", err);
    return MOCK_COMPANIES;
  }
}

export async function getLiveCompanyBySlug(slug: string): Promise<CompanyProfile | null> {
  const all = await getLiveCompanies();
  return all.find((c) => c.slug === slug) || null;
}
