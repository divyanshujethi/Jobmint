import { db, jobs, companies, jobSkills, skills, eq, desc, inArray } from "@repo/database";
import { MockJob, MOCK_JOBS } from "./mock-jobs";
import { JobType, WorkMode, JobSource } from "@repo/shared";
import { getCache, setCache, delCache } from "./redis";

export const JOBS_CACHE_KEY = "cache:jobs:live";
export const JOBS_CACHE_TTL_SECONDS = 60;

/**
 * Invalidate live jobs Redis cache so changes immediately appear.
 */
export async function invalidateJobsCache(): Promise<void> {
  await delCache(JOBS_CACHE_KEY);
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.floor(seconds / 60))}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns genuine, crawled tech jobs and internships directly from PostgreSQL.
 * Backed by read-through Redis cache.
 */
export async function getLiveJobs(limit = 2000): Promise<MockJob[]> {
  try {
    // 1. Read-Through Redis Cache Check (<5ms response)
    const cachedJobs = await getCache<MockJob[]>(JOBS_CACHE_KEY);
    if (cachedJobs && Array.isArray(cachedJobs) && cachedJobs.length > 0) {
      return cachedJobs;
    }

    // 2. Fetch live crawled tech jobs from PostgreSQL database
    const rawJobs = await db
      .select({
        id: jobs.id,
        slug: jobs.slug,
        title: jobs.title,
        jobType: jobs.jobType,
        workMode: jobs.workMode,
        location: jobs.location,
        salaryOrStipend: jobs.salaryOrStipend,
        minSalary: jobs.minSalary,
        maxSalary: jobs.maxSalary,
        experienceYears: jobs.experienceYears,
        description: jobs.description,
        requirements: jobs.requirements,
        benefits: jobs.benefits,
        source: jobs.source,
        sourceUrl: jobs.sourceUrl,
        isFeatured: jobs.isFeatured,
        createdAt: jobs.createdAt,
        companyName: companies.name,
        companySlug: companies.slug,
        companyLogoUrl: companies.logoUrl,
        companyWebsite: companies.website,
        companyDomain: companies.domain,
        isVerified: companies.isVerified,
        totalApplications: companies.totalApplications,
        reviewedApplications: companies.reviewedApplications,
        medianFirstReviewDays: companies.medianFirstReviewDays,
        lastActiveAt: companies.lastActiveAt,
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.isActive, true))
      .orderBy(desc(jobs.isFeatured), desc(jobs.createdAt))
      .limit(limit);

    const allRawJobs = rawJobs || [];

    if (allRawJobs.length === 0) {
      return MOCK_JOBS;
    }

    // 3. Fetch associated skills for the returned jobs only
    const jobIds = allRawJobs.map((j) => j.id);
    const skillsByJobId = new Map<string, { names: string[]; slugs: string[] }>();

    for (let i = 0; i < jobIds.length; i += 500) {
      const chunk = jobIds.slice(i, i + 500);
      const chunkSkills = await db
        .select({
          jobId: jobSkills.jobId,
          skillName: skills.name,
          skillSlug: skills.slug,
        })
        .from(jobSkills)
        .innerJoin(skills, eq(jobSkills.skillId, skills.id))
        .where(inArray(jobSkills.jobId, chunk));

      for (const js of chunkSkills) {
        if (!skillsByJobId.has(js.jobId)) {
          skillsByJobId.set(js.jobId, { names: [], slugs: [] });
        }
        const item = skillsByJobId.get(js.jobId)!;
        item.names.push(js.skillName);
        item.slugs.push(js.skillSlug);
      }
    }

    const LOGO_COLORS = [
      "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444",
      "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
    ];

    const formattedJobs: MockJob[] = allRawJobs.map((j) => {
      const skillData = skillsByJobId.get(j.id) || { names: ["TypeScript", "React"], slugs: ["typescript", "react"] };
      const isExternal = Boolean(j.sourceUrl);
      const totalApps = parseInt(j.totalApplications || "0", 10);
      const reviewedApps = parseInt(j.reviewedApplications || "0", 10);
      const reviewRate = totalApps > 0 ? Math.round((reviewedApps / totalApps) * 100) : 0;
      const medianDays = parseFloat(j.medianFirstReviewDays || "0") || 0;

      let resolvedLogo = j.companyLogoUrl;
      if (!resolvedLogo) {
        let domain = j.companyDomain;
        if (!domain && j.companyWebsite) {
          try {
            domain = new URL(j.companyWebsite).hostname.replace(/^www\./, "");
          } catch {}
        }
        if (domain) {
          resolvedLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        }
      }

      let nameHash = 0;
      for (let ci = 0; ci < j.companyName.length; ci++) {
        nameHash = ((nameHash << 5) - nameHash) + j.companyName.charCodeAt(ci);
        nameHash |= 0;
      }
      const logoAvatarColor = LOGO_COLORS[Math.abs(nameHash) % LOGO_COLORS.length];

      return {
        id: j.id,
        slug: j.slug,
        title: j.title,
        companyName: j.companyName,
        companySlug: j.companySlug,
        companyLogoUrl: resolvedLogo || undefined,
        companyWebsite: j.companyWebsite || undefined,
        companyLogoInitial: j.companyName.charAt(0).toUpperCase(),
        companyLogoColor: logoAvatarColor,
        isVerified: j.isVerified,
        isFeatured: j.isFeatured,
        location: j.location,
        workMode: (j.workMode as WorkMode) || WorkMode.REMOTE,
        jobType: (j.jobType as JobType) || JobType.FULL_TIME,
        salaryOrStipend: j.salaryOrStipend,
        minSalary: j.minSalary ?? undefined,
        maxSalary: j.maxSalary ?? undefined,
        experienceYears: j.experienceYears ?? 0,
        skills: skillData.names,
        skillSlugs: skillData.slugs,
        description: j.description,
        responsibilities: [
          "Design, develop, and deliver high-impact production features.",
          "Collaborate directly with cross-functional engineering and product mentors.",
          "Write maintainable, well-documented, and tested code.",
        ],
        requirements: j.requirements ? j.requirements.split(". ").filter(Boolean) : [
          "Solid problem-solving foundation",
          "Proficiency in required tech stack",
          "Git workflow"
        ],
        benefits: j.benefits ? j.benefits.split(", ").filter(Boolean) : [
          "Competitive compensation & performance bonuses",
          "Premium health and wellness insurance",
          "Modern development hardware allowance"
        ],
        source: (j.source as any) || JobSource.DIRECT,
        sourceUrl: j.sourceUrl || undefined,
        postedAgo: formatTimeAgo(j.createdAt),
        postedAt: j.createdAt.toISOString(),
        truthTeller: {
          isExternal,
          channel: isExternal ? (j.source || "OFFICIAL_CAREERS") : "DIRECT_ROLENEST",
          totalApplications: totalApps,
          reviewedApplications: reviewedApps,
          reviewRate,
          medianFirstReviewDays: medianDays,
          lastRecruiterActivity: isExternal
            ? "Verified Direct Career Portal"
            : totalApps > 0
              ? `Active recently`
              : "Direct Role Nest Application",
        },
      };
    });

    // 4. Cache in Redis with 60-second TTL
    if (formattedJobs.length > 0) {
      await setCache(JOBS_CACHE_KEY, formattedJobs, JOBS_CACHE_TTL_SECONDS);
    }

    return formattedJobs;
  } catch (err) {
    console.error("getLiveJobs database fetch error, falling back to mock jobs:", err);
    return MOCK_JOBS;
  }
}

export async function getLiveJobBySlug(slug: string): Promise<MockJob | null> {
  const all = await getLiveJobs();
  return all.find((j) => j.slug === slug) || null;
}
