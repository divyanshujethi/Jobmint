/**
 * Role Nest - Job Alligator Master Crawler Script
 * Crawls active tech internships and early career positions from SimplifyJobs,
 * Greenhouse, and Lever, and persists them into the PostgreSQL database.
 * 
 * Usage:
 * npx tsx scripts/crawl-jobs.ts [internshipLimit] [newGradLimit]
 */

import { runJobAlligator } from "../packages/alligators/src/index";
import { db, jobs, companies, skills, jobSkills, eq, or } from "../packages/database/src/index";
import { JobSource } from "../packages/shared/src/index";
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

async function main() {
  console.log("🐊 =====================================================");
  console.log("🐊 ROLE NEST - JOB ALLIGATOR LIVE CRAWLER & PERSISTER");
  console.log("🐊 =====================================================");

  const internshipLimit = parseInt(process.argv[2] || "60", 10);
  const newGradLimit = parseInt(process.argv[3] || "60", 10);

  console.log(`📡 Fetching live tech opportunities (Internships limit: ${internshipLimit}, New Grad limit: ${newGradLimit})...`);
  const crawlResult = await runJobAlligator({ internshipLimit, newGradLimit });

  console.log(`✅ Crawl finished in ${(crawlResult.durationMs / 1000).toFixed(1)}s.`);
  console.log(`📊 Total crawled: ${crawlResult.stats.totalCrawled}, Accepted: ${crawlResult.stats.accepted}`);

  console.log("\n💾 Persisting to PostgreSQL database...");

  // Cache existing skills
  const existingSkills = await db.select({ id: skills.id, name: skills.name, slug: skills.slug }).from(skills);
  const skillMap = new Map<string, string>();
  for (const s of existingSkills) {
    skillMap.set(s.slug, s.id);
    skillMap.set(s.name.toLowerCase(), s.id);
  }

  // Cache existing companies
  const existingCompanies = await db.select({ id: companies.id, name: companies.name, slug: companies.slug }).from(companies);
  const companyMap = new Map<string, string>();
  for (const c of existingCompanies) {
    companyMap.set(c.slug, c.id);
    companyMap.set(c.name.toLowerCase(), c.id);
  }

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const job of crawlResult.jobs) {
    try {
      if (!job.sourceUrl || !job.title || !job.companyName) {
        skipped++;
        continue;
      }

      // 1. Company
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
          const found = await db
            .select({ id: companies.id })
            .from(companies)
            .where(or(eq(companies.slug, companySlug), eq(companies.name, companyCleanName)))
            .limit(1);
          if (found.length > 0) {
            companyId = found[0]!.id;
            companyMap.set(companySlug, companyId);
          } else {
            skipped++;
            continue;
          }
        }
      }

      // 2. Check if job exists
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
        await db
          .update(jobs)
          .set({
            isActive: true,
            lastCheckedAt: new Date(),
            sourceUrl: job.sourceUrl,
            updatedAt: new Date(),
          })
          .where(eq(jobs.id, existingJob[0]!.id));
        updated++;
        continue;
      }

      // 3. Insert new job
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

      // 4. Skills
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

      inserted++;
    } catch (err: any) {
      console.error(`Failed to ingest "${job.title}":`, err.message);
    }
  }

  console.log(`\n🎉 Ingestion Complete!`);
  console.log(`   ✨ New Jobs Added:     ${inserted}`);
  console.log(`   🔄 Existing Updated:   ${updated}`);
  console.log(`   ⏭️ Skipped/Duplicates: ${skipped}`);
  console.log(`   Total Processed:       ${crawlResult.jobs.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("FATAL Job Alligator error:", err);
  process.exit(1);
});
