/**
 * Role Nest - Job Alligator Master Crawler Script
 * Crawls active tech internships and early career positions from SimplifyJobs,
 * Greenhouse, Lever, and Indian Tech Boards, and persists them into PostgreSQL using high-performance batching.
 * 
 * Usage:
 * npx tsx scripts/crawl-jobs.ts [internshipLimit] [newGradLimit]
 */

import fs from "fs";
import path from "path";

// Auto-load root .env if not loaded
if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [k, ...v] = trimmed.split("=");
        if (k && v && !process.env[k.trim()]) {
          process.env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  }
}

import {
  runJobAlligator,
  evaluateIndiaTechGatekeeper,
  checkConsultancyContamination,
  canonicalizeJobUrl,
  generateJobFingerprint,
  RawCrawledJob,
  TargetBoard,
} from "../packages/alligators/src/index";
import { db, jobs, companies, skills, jobSkills, jobLocationReviewQueue, inArray } from "../packages/database/src/index";
import { JobSource } from "../packages/shared/src/index";
import { sql } from "drizzle-orm";
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
  console.log("🐊 ROLE NEST - JOB ALLIGATOR BATCH CRAWLER & PERSISTER");
  console.log("🐊 =====================================================");

  const internshipLimit = parseInt(process.argv[2] || "500", 10);
  const newGradLimit = parseInt(process.argv[3] || "500", 10);
  const adzunaPages = parseInt(process.argv[4] || "50", 10);
  const founditLimit = parseInt(process.argv[5] || "10000", 10);
  const founditStartIndex = parseInt(process.argv[6] || "0", 10);
  const founditSitemapCount = parseInt(process.argv[7] || "11", 10);

  // Load all verified employer ATS boards from PostgreSQL registry
  let verifiedBoards: TargetBoard[] = [];
  try {
    const dbCompanies = await db
      .select({
        name: companies.name,
        domain: companies.domain,
        atsProvider: companies.atsProvider,
        atsToken: companies.atsToken,
        website: companies.website,
        careersUrl: companies.careersUrl,
        sector: companies.sector,
        tier: companies.tier,
      })
      .from(companies)
      .where(sql`${companies.discoveryStatus} = 'VERIFIED' AND ${companies.atsProvider} IS NOT NULL AND ${companies.atsToken} IS NOT NULL`);

    verifiedBoards = dbCompanies.map((c) => ({
      companyName: c.name,
      type: (c.atsProvider as any) || "custom",
      token: c.atsToken || "",
      website: c.website || `https://${c.domain}`,
      careersUrl: c.careersUrl || undefined,
      sector: c.sector || undefined,
      tier: c.tier || undefined,
    }));
    console.log(`📋 Loaded ${verifiedBoards.length} verified ATS company boards from PostgreSQL registry`);
  } catch (err: any) {
    console.log(`⚠️ Note: Proceeding with built-in startup seeds (${err.message})`);
  }

  console.log(`📡 Fetching live tech opportunities (Internships: ${internshipLimit}, New Grad: ${newGradLimit}, Adzuna Pages: ${adzunaPages}, Foundit Limit: ${founditLimit}, Sitemaps: ${founditStartIndex} to ${founditStartIndex + founditSitemapCount})...`);
  const crawlResult = await runJobAlligator({
    internshipLimit,
    newGradLimit,
    enableDiscovery: true,
    adzunaPages,
    founditLimit,
    founditStartIndex,
    founditSitemapCount,
    additionalBoards: verifiedBoards,
  });

  console.log(`✅ Crawl finished in ${(crawlResult.durationMs / 1000).toFixed(1)}s.`);
  console.log(`📊 Total crawled: ${crawlResult.stats.totalCrawled}, Accepted: ${crawlResult.stats.accepted}`);

  console.log("\n💾 Persisting to PostgreSQL database in batches...");

  // 1. Cache existing skills
  const existingSkills = await db.select({ id: skills.id, name: skills.name, slug: skills.slug }).from(skills);
  const skillMap = new Map<string, string>();
  for (const s of existingSkills) {
    skillMap.set(s.slug, s.id);
    skillMap.set(s.name.toLowerCase(), s.id);
  }

  // 2. Cache existing companies
  const existingCompanies = await db.select({ id: companies.id, name: companies.name, slug: companies.slug }).from(companies);
  const companyMap = new Map<string, string>();
  for (const c of existingCompanies) {
    companyMap.set(c.slug, c.id);
    companyMap.set(c.name.toLowerCase(), c.id);
  }

  // 3. Batch query only the incoming sourceUrls and externalJobIds for instant O(1) duplicate / update check
  const incomingUrls = crawlResult.jobs.map((j) => j.sourceUrl).filter(Boolean);
  const incomingExtIds = crawlResult.jobs.map((j) => j.externalId).filter(Boolean) as string[];

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

  // 4. Filter and collect missing companies & skills
  interface ValidJobItem {
    raw: RawCrawledJob;
    companySlug: string;
    companyCleanName: string;
    location: string;
    workMode: string;
    country: string;
    city?: string;
    remoteScope: string;
    roleCategory: string;
  }
  const validItems: ValidJobItem[] = [];
  const missingCompanies = new Map<string, { name: string; slug: string; website?: string; domain: string; location: string }>();
  const missingSkills = new Map<string, string>();
  const reviewQueueItems: Array<typeof jobLocationReviewQueue.$inferInsert> = [];
  const seenFingerprints = new Set<string>();
  let skipped = 0;
  let consultancyFiltered = 0;
  let duplicatesFiltered = 0;

  for (const job of crawlResult.jobs) {
    if (!job.sourceUrl || !job.title || !job.companyName) {
      skipped++;
      continue;
    }

    // 1. Canonicalize URL (strip tracking params & UTM markers)
    job.sourceUrl = canonicalizeJobUrl(job.sourceUrl);

    // 2. Consultancy & Staffing Broker Contamination Guard
    const consultancyCheck = checkConsultancyContamination(
      job.companyName,
      job.title,
      job.description
    );
    if (consultancyCheck.isContaminated) {
      consultancyFiltered++;
      continue;
    }

    // 3. 2-Stage Strict India-Only & Role-Level Tech Gatekeeper
    const gateEval = evaluateIndiaTechGatekeeper(
      job.title,
      job.location,
      job.workMode,
      undefined
    );

    // Route ambiguous locations to the dedicated review queue
    if (gateEval.location.needsReview) {
      reviewQueueItems.push({
        id: crypto.randomUUID(),
        companyName: job.companyName.trim(),
        title: job.title.trim(),
        sourceUrl: job.sourceUrl,
        rawLocation: job.location || "Unspecified",
        detectedCity: gateEval.location.city || null,
        detectedWorkMode: gateEval.location.workMode || null,
        detectedRemoteScope: gateEval.location.remoteScope || null,
        flagReason: gateEval.location.reviewReason || "Ambiguous remote location or country eligibility",
        status: "PENDING",
        createdAt: new Date(),
      });
      skipped++;
      continue;
    }

    // If rejected by Gatekeeper (non-tech role or outside India), skip
    if (!gateEval.accepted) {
      skipped++;
      continue;
    }

    // 4. Fingerprint-Based Content Deduplication
    const companyCleanName = job.companyName.trim();
    const fingerprint = generateJobFingerprint(
      companyCleanName,
      job.title,
      gateEval.location.city,
      job.jobType
    );
    if (seenFingerprints.has(fingerprint)) {
      duplicatesFiltered++;
      continue;
    }
    seenFingerprints.add(fingerprint);

    const companySlug = slugify(companyCleanName);
    const domain = extractDomain(job.companyWebsite) || `${companySlug}.com`;
    const loc = gateEval.location.formattedLocation || "India";

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
      workMode: gateEval.location.workMode,
      country: gateEval.location.country,
      city: gateEval.location.city,
      remoteScope: gateEval.location.remoteScope,
      roleCategory: gateEval.role.roleCategory,
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

    const reloadedCompanies = await db.select({ id: companies.id, name: companies.name, slug: companies.slug }).from(companies);
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

  // 7. Partition into toTouch and toInsert
  const jobIdsToTouch: string[] = [];
  const jobsToInsert: Array<typeof jobs.$inferInsert> = [];
  const jobSkillsToInsert: Array<typeof jobSkills.$inferInsert> = [];
  const seenInsertUrls = new Set<string>();

  for (const item of validItems) {
    const { raw: job, companySlug, companyCleanName, location, workMode } = item;
    const companyId = companyMap.get(companySlug) || companyMap.get(companyCleanName.toLowerCase());
    if (!companyId) {
      skipped++;
      continue;
    }

    const existingId =
      (job.sourceUrl && existingJobUrlMap.get(job.sourceUrl)) ||
      (job.externalId && existingJobExtIdMap.get(job.externalId));

    if (existingId) {
      jobIdsToTouch.push(existingId);
      continue;
    }

    if (seenInsertUrls.has(job.sourceUrl)) {
      skipped++;
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
      country: item.country,
      city: item.city || null,
      remoteScope: item.remoteScope,
      roleCategory: item.roleCategory,
      salaryOrStipend: job.salaryOrStipend || "Competitive (Official)",
      experienceYears: job.experienceYears ?? 0,
      description: job.description,
      requirements:
        job.rawRequirements ||
        (item.roleCategory === "software"
          ? `Solid technical problem-solving foundation, git workflow, and proficiency in modern software development.`
          : `Demonstrated technical qualifications, domain proficiency, and alignment with ${companyCleanName}'s engineering standards.`),
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
        console.error(`Error updating batch:`, err.message);
      }
    }
  }

  // 9. Batch insert new jobs
  let inserted = 0;
  if (jobsToInsert.length > 0) {
    for (let i = 0; i < jobsToInsert.length; i += 500) {
      const chunk = jobsToInsert.slice(i, i + 500);
      try {
        await db.insert(jobs).values(chunk).onConflictDoNothing();
        inserted += chunk.length;
      } catch (err: any) {
        console.error(`Error inserting job batch:`, err.message);
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

  // 11. Batch insert ambiguous locations into review queue
  if (reviewQueueItems.length > 0) {
    for (let i = 0; i < reviewQueueItems.length; i += 500) {
      const chunk = reviewQueueItems.slice(i, i + 500);
      try {
        await db.insert(jobLocationReviewQueue).values(chunk).onConflictDoNothing();
      } catch (err: any) {
        console.error("Error inserting review queue batch:", err.message);
      }
    }
  }

  // 12. Re-compute and synchronize active_jobs_count in companies table
  try {
    await db.execute(sql`
      UPDATE companies
      SET active_jobs_count = COALESCE(sub.cnt, 0),
          updated_at = NOW()
      FROM (
        SELECT company_id, count(*)::int as cnt
        FROM jobs
        WHERE is_active = true
        GROUP BY company_id
      ) sub
      WHERE companies.id = sub.company_id;
    `);
    console.log(`   🏢 Synchronized active jobs counters across registered employers.`);
  } catch (err: any) {
    console.error("Error updating company active job counts:", err.message);
  }

  console.log(`\n🎉 Ingestion & Quality Telemetry Complete!`);
  console.log(`   ✨ New Tech Jobs Added:        ${inserted}`);
  console.log(`   🔄 Existing Refreshed:         ${jobIdsToTouch.length}`);
  console.log(`   🛡️ Ambiguous in Review Queue:  ${reviewQueueItems.length}`);
  console.log(`   🧹 Duplicates Eliminated:      ${duplicatesFiltered}`);
  console.log(`   🚫 Consultancies Blocked:      ${consultancyFiltered}`);
  console.log(`   ⏭️ Foreign/Non-Tech Filtered:  ${skipped}`);
  console.log(`   Total Candidates Processed:    ${crawlResult.jobs.length}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("FATAL Job Alligator error:", err);
  process.exit(1);
});
