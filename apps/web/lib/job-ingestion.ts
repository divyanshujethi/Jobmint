import { db, jobs, companies, skills, jobSkills, applications, eq, or, and, lt, sql, inArray } from "@repo/database";
import { RawCrawledJob, normalizeIndiaLocation } from "@repo/alligators";
import { JobSource } from "@repo/shared";
import { invalidateJobsCache } from "./db-jobs";
import { publishJobSlugToGoogle } from "./google-indexing";
import crypto from "crypto";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractDomain(urlStr?: string): string | null {
  if (!urlStr) return null;
  try {
    const url = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export interface IngestionResult {
  totalProcessed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

/**
 * Persists crawled jobs directly into PostgreSQL using high-performance batch operations
 * and flushes Redis cache.
 */
export async function persistCrawledJobs(crawledJobs: RawCrawledJob[]): Promise<IngestionResult> {
  const result: IngestionResult = {
    totalProcessed: crawledJobs.length,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  if (!crawledJobs || crawledJobs.length === 0) {
    return result;
  }

  // 1. Cache existing skills for instant O(1) lookup
  const existingSkills = await db.select({ id: skills.id, name: skills.name, slug: skills.slug }).from(skills);
  const skillMap = new Map<string, string>();
  for (const s of existingSkills) {
    skillMap.set(s.slug, s.id);
    skillMap.set(s.name.toLowerCase(), s.id);
  }

  // 2. Cache existing companies for instant O(1) lookup
  const existingCompanies = await db
    .select({ id: companies.id, name: companies.name, slug: companies.slug })
    .from(companies);
  const companyMap = new Map<string, string>();
  for (const c of existingCompanies) {
    companyMap.set(c.slug, c.id);
    companyMap.set(c.name.toLowerCase(), c.id);
  }

  // 3. Batch query only the incoming sourceUrls and externalJobIds for instant O(1) duplicate / update check
  const incomingUrls = crawledJobs.map((j) => j.sourceUrl).filter(Boolean);
  const incomingExtIds = crawledJobs.map((j) => j.externalId).filter(Boolean) as string[];

  const existingJobUrlMap = new Map<string, string>();
  const existingJobExtIdMap = new Map<string, string>();

  for (let i = 0; i < incomingUrls.length; i += 500) {
    const chunk = incomingUrls.slice(i, i + 500);
    const existing = await db
      .select({ id: jobs.id, sourceUrl: jobs.sourceUrl })
      .from(jobs)
      .where(inArray(jobs.sourceUrl, chunk));
    for (const j of existing) {
      if (j.sourceUrl) existingJobUrlMap.set(j.sourceUrl, j.id);
    }
  }

  for (let i = 0; i < incomingExtIds.length; i += 500) {
    const chunk = incomingExtIds.slice(i, i + 500);
    const existing = await db
      .select({ id: jobs.id, externalJobId: jobs.externalJobId })
      .from(jobs)
      .where(inArray(jobs.externalJobId, chunk));
    for (const j of existing) {
      if (j.externalJobId) existingJobExtIdMap.set(j.externalJobId, j.id);
    }
  }

  // 4. Filter valid jobs and pre-collect missing companies & missing skills
  interface ValidJobItem {
    raw: RawCrawledJob;
    companySlug: string;
    companyCleanName: string;
    location: string;
    workMode: string;
  }
  const validItems: ValidJobItem[] = [];
  const missingCompanies = new Map<string, { name: string; slug: string; website: string; domain: string; location: string }>();
  const missingSkills = new Map<string, string>(); // slug -> displayName

  for (const job of crawledJobs) {
    if (!job.sourceUrl || !job.title || !job.companyName) {
      result.skipped++;
      continue;
    }

    const locInfo = normalizeIndiaLocation(job.location);
    if (!locInfo.isIndiaOrRemote) {
      result.skipped++;
      continue;
    }

    const companyCleanName = job.companyName.trim();
    const companySlug = slugify(companyCleanName);
    const domain = extractDomain(job.companyWebsite) || `${companySlug}.com`;
    const loc = locInfo.location || "Remote";

    if (!companyMap.has(companySlug) && !companyMap.has(companyCleanName.toLowerCase())) {
      if (!missingCompanies.has(companySlug)) {
        missingCompanies.set(companySlug, {
          name: companyCleanName,
          slug: companySlug,
          website: job.companyWebsite || `https://${domain}`,
          domain,
          location: loc,
        });
      }
    }

    for (const skillName of job.skills || []) {
      const sSlug = slugify(skillName);
      if (!skillMap.has(sSlug) && !skillMap.has(skillName.toLowerCase())) {
        if (!missingSkills.has(sSlug)) {
          missingSkills.set(sSlug, skillName);
        }
      }
    }

    validItems.push({
      raw: job,
      companySlug,
      companyCleanName,
      location: loc,
      workMode: locInfo.workMode,
    });
  }

  // 5. Bulk insert missing companies
  if (missingCompanies.size > 0) {
    const companiesToInsert = Array.from(missingCompanies.values()).map((c) => ({
      id: crypto.randomUUID(),
      name: c.name,
      slug: c.slug,
      website: c.website,
      domain: c.domain,
      description: "Verified technology hiring organization.",
      location: c.location,
      industry: "Technology",
      isVerified: true,
      totalApplications: "0",
      reviewedApplications: "0",
      medianFirstReviewDays: "2.1",
      lastActiveAt: new Date(),
    }));

    for (let i = 0; i < companiesToInsert.length; i += 200) {
      const chunk = companiesToInsert.slice(i, i + 200);
      try {
        await db.insert(companies).values(chunk).onConflictDoNothing();
      } catch {
        for (const item of chunk) {
          try {
            await db.insert(companies).values(item).onConflictDoNothing();
          } catch {
            // ignore
          }
        }
      }
    }

    const reloadedCompanies = await db
      .select({ id: companies.id, name: companies.name, slug: companies.slug })
      .from(companies);
    for (const c of reloadedCompanies) {
      companyMap.set(c.slug, c.id);
      companyMap.set(c.name.toLowerCase(), c.id);
    }
  }

  // 6. Bulk insert missing skills
  if (missingSkills.size > 0) {
    const skillsToInsert = Array.from(missingSkills.entries()).map(([slug, name]) => ({
      id: crypto.randomUUID(),
      name,
      slug,
      category: "Technology",
    }));

    for (let i = 0; i < skillsToInsert.length; i += 200) {
      const chunk = skillsToInsert.slice(i, i + 200);
      try {
        await db.insert(skills).values(chunk).onConflictDoNothing();
      } catch {
        for (const item of chunk) {
          try {
            await db.insert(skills).values(item).onConflictDoNothing();
          } catch {
            // ignore
          }
        }
      }
    }

    const reloadedSkills = await db.select({ id: skills.id, name: skills.name, slug: skills.slug }).from(skills);
    for (const s of reloadedSkills) {
      skillMap.set(s.slug, s.id);
      skillMap.set(s.name.toLowerCase(), s.id);
    }
  }

  // 7. Partition into jobsToUpdate and jobsToInsert
  const jobIdsToTouch: string[] = [];
  const jobsToInsert: Array<typeof jobs.$inferInsert> = [];
  const jobSkillsToInsert: Array<typeof jobSkills.$inferInsert> = [];
  const seenInsertUrls = new Set<string>();

  for (const item of validItems) {
    const { raw: job, companySlug, companyCleanName, location, workMode } = item;
    const companyId = companyMap.get(companySlug) || companyMap.get(companyCleanName.toLowerCase());
    if (!companyId) {
      result.skipped++;
      continue;
    }

    const existingId =
      (job.sourceUrl && existingJobUrlMap.get(job.sourceUrl)) ||
      (job.externalId && existingJobExtIdMap.get(job.externalId));

    if (existingId) {
      jobIdsToTouch.push(existingId);
      result.updated++;
      continue;
    }

    if (seenInsertUrls.has(job.sourceUrl)) {
      result.skipped++;
      continue;
    }
    seenInsertUrls.add(job.sourceUrl);

    const baseTitleSlug = slugify(job.title).slice(0, 45);
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const jobSlug = `${baseTitleSlug}-${companySlug}-${randomSuffix}`;
    const newJobId = crypto.randomUUID();

    jobsToInsert.push({
      id: newJobId,
      companyId,
      title: job.title,
      slug: jobSlug,
      jobType: job.jobType,
      workMode: workMode as any,
      location,
      salaryOrStipend: job.salaryOrStipend || "Competitive (Official)",
      experienceYears: job.experienceYears ?? 0,
      description: job.description,
      requirements:
        job.rawRequirements ||
        `Strong problem solving foundations, knowledge of modern software engineering practices, and interest in working with ${companyCleanName}'s engineering team.`,
      benefits: "Official mentor support, direct career feedback, verified hiring progression timeline.",
      source: JobSource.EXTERNAL,
      sourceUrl: job.sourceUrl,
      externalJobId: job.externalId,
      isActive: true,
      isFeatured: false,
      firstSeenAt: new Date(),
      lastCheckedAt: new Date(),
    });

    for (const skillName of job.skills || []) {
      const sSlug = slugify(skillName);
      const skillId = skillMap.get(sSlug) || skillMap.get(skillName.toLowerCase());
      if (skillId) {
        jobSkillsToInsert.push({
          id: crypto.randomUUID(),
          jobId: newJobId,
          skillId,
          isRequired: true,
        });
      }
    }
  }

  // 8. Batch touch existing jobs
  if (jobIdsToTouch.length > 0) {
    for (let i = 0; i < jobIdsToTouch.length; i += 500) {
      const chunk = jobIdsToTouch.slice(i, i + 500);
      try {
        await db
          .update(jobs)
          .set({
            isActive: true,
            lastCheckedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(inArray(jobs.id, chunk));
      } catch (err: any) {
        result.errors.push(`Error batch updating jobs: ${err.message}`);
      }
    }
  }

  // 9. Batch insert new jobs
  if (jobsToInsert.length > 0) {
    for (let i = 0; i < jobsToInsert.length; i += 500) {
      const chunk = jobsToInsert.slice(i, i + 500);
      try {
        await db.insert(jobs).values(chunk).onConflictDoNothing();
        result.inserted += chunk.length;
      } catch (err: any) {
        result.errors.push(`Error batch inserting jobs: ${err.message}`);
      }
    }
  }

  // 10. Batch insert jobSkills
  if (jobSkillsToInsert.length > 0) {
    for (let i = 0; i < jobSkillsToInsert.length; i += 500) {
      const chunk = jobSkillsToInsert.slice(i, i + 500);
      try {
        await db.insert(jobSkills).values(chunk).onConflictDoNothing();
      } catch {
        // ignore duplicate skill mapping
      }
    }
  }

  // 11. Invalidate cache so live feeds update immediately
  try {
    await invalidateJobsCache();
  } catch (err: any) {
    console.warn("Failed to invalidate jobs cache:", err.message);
  }

  // 12. Asynchronously notify Google Indexing API for newly inserted jobs
  if (result.inserted > 0 && jobsToInsert.length > 0) {
    const newlyInsertedSlugs = jobsToInsert
      .map((j) => j.slug)
      .filter(Boolean) as string[];

    // Send up to 50 new job slugs to Google Indexing per crawl batch
    const batchToNotify = newlyInsertedSlugs.slice(0, 50);
    Promise.allSettled(
      batchToNotify.map((slug) => publishJobSlugToGoogle(slug))
    ).then((outcomes) => {
      const notified = outcomes.filter(
        (o) => o.status === "fulfilled" && (o.value as any).success
      ).length;
      console.log(
        `[Google Indexing API] Successfully dispatched indexing for ${notified}/${batchToNotify.length} newly inserted jobs`
      );
    }).catch((err) => {
      console.warn("[Google Indexing API] Ingestion notification error:", err?.message || err);
    });
  }

  return result;
}

export interface CleanupResult {
  deactivated: number;
  purged: number;
}

/**
 * Automatically marks un-crawled jobs as inactive and purges dead expired jobs.
 * - If an external job was not refreshed in the last `staleDaysThreshold` (default 14 days, configurable 14-21 days),
 *   it has been taken down / filled on the employer's ATS portal -> set isActive = false.
 * - If an external job has been inactive for >30 days and has 0 applications, purge it completely.
 */
export async function cleanupStaleJobs(staleDaysThreshold = 14): Promise<CleanupResult> {
  const thresholdDate = new Date(Date.now() - staleDaysThreshold * 24 * 60 * 60 * 1000);
  const purgeDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // 1. Deactivate jobs not seen in the ATS crawls for > staleDaysThreshold
  const deactivatedResult = await db
    .update(jobs)
    .set({
      isActive: false,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(jobs.isActive, true),
        eq(jobs.source, JobSource.EXTERNAL),
        lt(jobs.lastCheckedAt, thresholdDate)
      )
    );

  // 2. Permanently delete dead jobs that are inactive, older than 30 days, with 0 applications
  const deadJobs = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(
      and(
        eq(jobs.isActive, false),
        eq(jobs.source, JobSource.EXTERNAL),
        lt(jobs.lastCheckedAt, purgeDate)
      )
    );

  let purgedCount = 0;
  for (const dead of deadJobs) {
    const appsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(eq(applications.jobId, dead.id));

    if (Number(appsCount[0]?.count || 0) === 0) {
      try {
        await db.delete(jobSkills).where(eq(jobSkills.jobId, dead.id));
        await db.delete(jobs).where(eq(jobs.id, dead.id));
        purgedCount++;
      } catch (err: any) {
        console.warn(`Failed to purge dead job ${dead.id}:`, err.message);
      }
    }
  }

  // 3. Invalidate Redis cache so deactivated jobs immediately disappear from all feeds
  try {
    await invalidateJobsCache();
  } catch (err: any) {
    console.warn("Failed to invalidate cache after cleanup:", err.message);
  }

  return {
    deactivated: (deactivatedResult as any)?.rowCount ?? 0,
    purged: purgedCount,
  };
}
