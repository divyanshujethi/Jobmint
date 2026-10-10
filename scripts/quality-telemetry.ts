/**
 * RoleNest - Quality Monitoring, Telemetry Dashboard & Dead-Link Reaper
 *
 * Runs full telemetry analytics across the PostgreSQL jobs inventory:
 * - Active jobs per company & top employer volume
 * - Role taxonomy breakdown (software, ai_ml, data, devops, security, etc.)
 * - Indian city distribution & remote scope
 * - Location Review Queue status
 * - Dead-link reaper (probes oldest listings and deactivates expired roles)
 * - Synchronizes active_jobs_count in companies table
 *
 * Usage:
 *   npx tsx scripts/quality-telemetry.ts [--reap]
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

import { db, jobs, companies, jobLocationReviewQueue } from "../packages/database/src/index";
import { sql, eq, desc, asc } from "drizzle-orm";
import { verifyJobUrlLiveness } from "../packages/alligators/src/index";

async function main() {
  const args = process.argv.slice(2);
  const shouldReap = args.includes("--reap");

  console.log("📊 ====================================================================");
  console.log("📊 ROLENEST - QUALITY MONITORING, DEDUPLICATION & TELEMETRY SUITE");
  console.log("📊 ====================================================================\n");

  if (!db) {
    console.error("❌ Database connection unavailable. Exiting.");
    process.exit(1);
  }

  // 1. Overall Inventory Metrics
  const [totalRow] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) FILTER (WHERE ${jobs.isActive} = true)::int`,
      inactive: sql<number>`count(*) FILTER (WHERE ${jobs.isActive} = false)::int`,
      internships: sql<number>`count(*) FILTER (WHERE ${jobs.jobType} = 'internship' AND ${jobs.isActive} = true)::int`,
      fullTime: sql<number>`count(*) FILTER (WHERE ${jobs.jobType} = 'full_time' AND ${jobs.isActive} = true)::int`,
    })
    .from(jobs);

  console.log("📈 INVENTORY HEALTH SCORECARD:");
  console.log(`   • Total Jobs Indexed:        ${totalRow?.total ?? 0}`);
  console.log(`   • Active Live Listings:      ${totalRow?.active ?? 0} (${(((totalRow?.active ?? 0) / (totalRow?.total || 1)) * 100).toFixed(1)}%)`);
  console.log(`   • Inactive / Reaped Roles:   ${totalRow?.inactive ?? 0}`);
  console.log(`   • Active Full-Time Roles:    ${totalRow?.fullTime ?? 0}`);
  console.log(`   • Active Internships:        ${totalRow?.internships ?? 0}`);

  // 2. Role Taxonomy Breakdown
  const rolesByCategory = await db
    .select({
      category: sql<string>`COALESCE(${jobs.roleCategory}, 'uncategorized_tech')`,
      count: sql<number>`count(*)::int`,
    })
    .from(jobs)
    .where(eq(jobs.isActive, true))
    .groupBy(sql`COALESCE(${jobs.roleCategory}, 'uncategorized_tech')`)
    .orderBy(desc(sql`count(*)`));

  console.log("\n🧬 TECH ROLE TAXONOMY BREAKDOWN (Active):");
  for (const r of rolesByCategory) {
    console.log(`   • ${(r.category || "").padEnd(20)}: ${r.count} roles`);
  }

  // 3. Indian Tech Hub City Distribution
  const jobsByCity = await db
    .select({
      city: sql<string>`COALESCE(${jobs.city}, 'All India / Remote')`,
      count: sql<number>`count(*)::int`,
    })
    .from(jobs)
    .where(eq(jobs.isActive, true))
    .groupBy(sql`COALESCE(${jobs.city}, 'All India / Remote')`)
    .orderBy(desc(sql`count(*)`))
    .limit(10);

  console.log("\n🇮🇳 TOP TECH CITIES & REGIONAL HUBS (Active):");
  for (const c of jobsByCity) {
    console.log(`   • ${(c.city || "").padEnd(25)}: ${c.count} roles`);
  }

  // 4. Remote Scope Distribution
  const jobsByScope = await db
    .select({
      scope: sql<string>`COALESCE(${jobs.remoteScope}, 'INDIA_ONLY')`,
      count: sql<number>`count(*)::int`,
    })
    .from(jobs)
    .where(eq(jobs.isActive, true))
    .groupBy(sql`COALESCE(${jobs.remoteScope}, 'INDIA_ONLY')`)
    .orderBy(desc(sql`count(*)`));

  console.log("\n🌐 REMOTE SCOPE DISTRIBUTION (Active):");
  for (const s of jobsByScope) {
    console.log(`   • ${(s.scope || "").padEnd(20)}: ${s.count} roles`);
  }

  // 5. Location Review Queue Backlog
  const [queueCount] = await db
    .select({
      pending: sql<number>`count(*) FILTER (WHERE ${jobLocationReviewQueue.status} = 'PENDING')::int`,
      approved: sql<number>`count(*) FILTER (WHERE ${jobLocationReviewQueue.status} = 'APPROVED')::int`,
      rejected: sql<number>`count(*) FILTER (WHERE ${jobLocationReviewQueue.status} = 'REJECTED')::int`,
    })
    .from(jobLocationReviewQueue);

  console.log("\n🛡️ LOCATION REVIEW QUEUE BACKLOG:");
  console.log(`   • Pending Ambiguous Roles:   ${queueCount?.pending ?? 0}`);
  console.log(`   • Manually Approved:         ${queueCount?.approved ?? 0}`);
  console.log(`   • Rejected Non-India:        ${queueCount?.rejected ?? 0}`);

  // 6. Top Direct Employers by Live Volume
  const topEmployers = await db
    .select({
      name: companies.name,
      ats: companies.atsProvider,
      activeCount: companies.activeJobsCount,
    })
    .from(companies)
    .where(sql`${companies.activeJobsCount} > 0`)
    .orderBy(desc(companies.activeJobsCount))
    .limit(10);

  console.log("\n🏢 TOP DIRECT EMPLOYERS BY LIVE ATS OPENINGS:");
  for (const emp of topEmployers) {
    console.log(`   • ${emp.name.padEnd(25)} [${(emp.ats || "Direct").toUpperCase().padEnd(14)}]: ${emp.activeCount} live jobs`);
  }

  // 7. Synchronize active jobs counts across all companies
  console.log("\n🔄 Synchronizing active jobs counters in companies registry...");
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
  console.log("   ✅ Synchronized successfully!");

  // 8. Dead-Link Reaper (If --reap flag passed)
  if (shouldReap) {
    console.log("\n💀 DEAD-LINK REAPER: Probing oldest checked jobs for soft-404 / expiry...");
    const sampleToReap = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        sourceUrl: jobs.sourceUrl,
      })
      .from(jobs)
      .where(eq(jobs.isActive, true))
      .orderBy(asc(jobs.lastCheckedAt))
      .limit(30);

    let reaped = 0;
    for (const j of sampleToReap) {
      if (!j.sourceUrl) continue;
      process.stdout.write(`   🔍 Checking [${j.title.slice(0, 30)}...] `);
      const res = await verifyJobUrlLiveness(j.sourceUrl, 6000);
      if (!res.isAlive) {
        console.log(`❌ EXPIRED (${res.reason}) -> Deactivating`);
        await db
          .update(jobs)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(jobs.id, j.id));
        reaped++;
      } else {
        console.log(`✅ Alive`);
        await db
          .update(jobs)
          .set({ lastCheckedAt: new Date() })
          .where(eq(jobs.id, j.id));
      }
    }
    console.log(`   💀 Reaper finished! Deactivated ${reaped} dead/expired roles.`);
  }

  console.log("\n✨ Quality Telemetry Run Finished Successfully!");
  process.exit(0);
}

main().catch(console.error);
