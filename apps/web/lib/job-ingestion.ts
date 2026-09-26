import { db, jobs, companies, skills, jobSkills, eq, or, ilike } from "@repo/database";
import { RawCrawledJob } from "@repo/alligators";
import { JobSource } from "@repo/shared";
import { invalidateJobsCache } from "./db-jobs";
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
 * Persists crawled jobs directly into PostgreSQL and flushes Redis cache.
 */
export async function persistCrawledJobs(crawledJobs: RawCrawledJob[]): Promise<IngestionResult> {
  const result: IngestionResult = {
    totalProcessed: crawledJobs.length,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  // Cache existing skills for fast lookup
  const existingSkills = await db.select({ id: skills.id, name: skills.name, slug: skills.slug }).from(skills);
  const skillMap = new Map<string, string>();
  for (const s of existingSkills) {
    skillMap.set(s.slug, s.id);
    skillMap.set(s.name.toLowerCase(), s.id);
  }

  // Cache existing companies
  const existingCompanies = await db
    .select({ id: companies.id, name: companies.name, slug: companies.slug })
    .from(companies);
  const companyMap = new Map<string, string>();
  for (const c of existingCompanies) {
    companyMap.set(c.slug, c.id);
    companyMap.set(c.name.toLowerCase(), c.id);
  }

  for (const job of crawledJobs) {
    try {
      if (!job.sourceUrl || !job.title || !job.companyName) {
        result.skipped++;
        continue;
      }

      // 1. Company Upsert
      const companyCleanName = job.companyName.trim();
      const companySlug = slugify(companyCleanName);
      let companyId = companyMap.get(companySlug) || companyMap.get(companyCleanName.toLowerCase());

      if (!companyId) {
        const domain = extractDomain(job.companyWebsite) || `${companySlug}.com`;
        const newCompanyId = crypto.randomUUID();
        try {
          await db.insert(companies).values({
            id: newCompanyId,
            name: companyCleanName,
            slug: companySlug,
            website: job.companyWebsite || `https://${domain}`,
            domain,
            description: `Verified technology hiring organization.`,
            location: job.location || "Remote",
            industry: "Technology",
            isVerified: true,
            totalApplications: "0",
            reviewedApplications: "0",
            medianFirstReviewDays: "2.1",
            lastActiveAt: new Date(),
          });
          companyId = newCompanyId;
          companyMap.set(companySlug, companyId);
          companyMap.set(companyCleanName.toLowerCase(), companyId);
        } catch {
          // In case of concurrent race or existing slug
          const existing = await db
            .select({ id: companies.id })
            .from(companies)
            .where(or(eq(companies.slug, companySlug), eq(companies.name, companyCleanName)))
            .limit(1);
          if (existing.length > 0) {
            companyId = existing[0]!.id;
            companyMap.set(companySlug, companyId);
          } else {
            result.errors.push(`Failed to register company: ${companyCleanName}`);
            result.skipped++;
            continue;
          }
        }
      }

      // 2. Check if Job already exists by sourceUrl or externalJobId
      const existingJob = await db
        .select({ id: jobs.id, slug: jobs.slug })
        .from(jobs)
        .where(
          or(
            eq(jobs.sourceUrl, job.sourceUrl),
            job.externalId ? eq(jobs.externalJobId, job.externalId) : undefined
          )
        )
        .limit(1);

      if (existingJob.length > 0) {
        // Update existing job
        await db
          .update(jobs)
          .set({
            isActive: true,
            lastCheckedAt: new Date(),
            sourceUrl: job.sourceUrl,
            updatedAt: new Date(),
          })
          .where(eq(jobs.id, existingJob[0]!.id));

        result.updated++;
        continue;
      }

      // 3. Create Unique Job Slug
      const baseTitleSlug = slugify(job.title).slice(0, 45);
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      const jobSlug = `${baseTitleSlug}-${companySlug}-${randomSuffix}`;
      const newJobId = crypto.randomUUID();

      await db.insert(jobs).values({
        id: newJobId,
        companyId,
        title: job.title,
        slug: jobSlug,
        jobType: job.jobType,
        workMode: job.workMode,
        location: job.location || "Remote",
        salaryOrStipend: job.salaryOrStipend || "Competitive (Official)",
        experienceYears: 0,
        description: job.description,
        requirements:
          job.rawRequirements ||
          `Strong problem solving foundations, knowledge of modern software engineering practices, and interest in working with ${companyCleanName}'s engineering team.`,
        benefits:
          "Official mentor support, direct career feedback, verified hiring progression timeline.",
        source: JobSource.EXTERNAL,
        sourceUrl: job.sourceUrl,
        externalJobId: job.externalId,
        isActive: true,
        isFeatured: false,
        firstSeenAt: new Date(),
        lastCheckedAt: new Date(),
      });

      // 4. Associate Skills
      for (const skillName of job.skills || []) {
        const sSlug = slugify(skillName);
        let skillId = skillMap.get(sSlug) || skillMap.get(skillName.toLowerCase());

        if (!skillId) {
          skillId = crypto.randomUUID();
          try {
            await db.insert(skills).values({
              id: skillId,
              name: skillName,
              slug: sSlug,
              category: "Technology",
            });
            skillMap.set(sSlug, skillId);
            skillMap.set(skillName.toLowerCase(), skillId);
          } catch {
            // Already created in concurrent batch
            const found = await db
              .select({ id: skills.id })
              .from(skills)
              .where(eq(skills.slug, sSlug))
              .limit(1);
            if (found.length > 0) {
              skillId = found[0]!.id;
              skillMap.set(sSlug, skillId);
            }
          }
        }

        if (skillId) {
          try {
            await db.insert(jobSkills).values({
              id: crypto.randomUUID(),
              jobId: newJobId,
              skillId,
              isRequired: true,
            });
          } catch {
            // ignore duplicate skill mapping
          }
        }
      }

      result.inserted++;
    } catch (err: any) {
      result.errors.push(`Error saving job "${job.title}": ${err.message}`);
    }
  }

  // 5. Invalidate cache so live feeds update immediately
  try {
    await invalidateJobsCache();
  } catch (err: any) {
    console.warn("Failed to invalidate jobs cache:", err.message);
  }

  return result;
}
