/**
 * RoleNest - Indian Tech Startup Registry & Discovery Engine Runner
 *
 * Discovers and verifies official career pages & ATS endpoints across
 * top Indian tech companies (Fintech, SaaS, AI/ML, DevTools, E-Commerce, Cyber).
 * Upserts verified records into PostgreSQL `companies` table.
 *
 * Usage:
 *   npx tsx scripts/discover-indian-startups.ts [--pilot]
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
  INDIAN_STARTUP_SEEDS,
  StartupSeed,
  probeCompanyCareers,
  verifyAtsBoard,
  TargetBoard
} from "../packages/alligators/src/index";
import { db, companies } from "../packages/database/src/index";
import { sql } from "drizzle-orm";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const args = process.argv.slice(2);
  const isPilotOnly = args.includes("--pilot");

  console.log("🇮🇳 ====================================================================");
  console.log("🇮🇳 ROLENEST - INDIAN TECH STARTUP REGISTRY & ATS DISCOVERY RUNNER");
  console.log("🇮🇳 ====================================================================");

  const targetSeeds = isPilotOnly
    ? INDIAN_STARTUP_SEEDS.slice(0, 9) // Flagship cohort
    : INDIAN_STARTUP_SEEDS;

  console.log(`📋 Loaded ${targetSeeds.length} startup seeds to evaluate (Pilot mode: ${isPilotOnly})\n`);

  const results: Array<{
    name: string;
    domain: string;
    sector: string;
    atsProvider: string;
    atsToken: string;
    status: string;
    jobsFound: number;
    careersUrl: string;
  }> = [];

  for (const seed of targetSeeds) {
    process.stdout.write(`🔍 Probing [${seed.name}] (${seed.domain})... `);
    try {
      const board = await probeCompanyCareers(seed.domain, seed.name, seed);

      if (board) {
        const verification = await verifyAtsBoard(board);
        const slug = slugify(seed.name);
        const careersUrl = board.careersUrl || seed.careersUrl || `https://${seed.domain}/careers`;

        // Upsert into PostgreSQL if DB is available
        if (db) {
          try {
            await db
              .insert(companies)
              .values({
                name: seed.name,
                slug,
                website: `https://${seed.domain}`,
                domain: seed.domain,
                location: seed.location,
                industry: seed.sector,
                sector: seed.sector,
                tier: seed.tier,
                careersUrl,
                atsProvider: board.type,
                atsToken: board.token,
                discoveryStatus: verification.isValid ? "VERIFIED" : "MANUAL_REVIEW",
                discoveryMethod: board.discoveryMethod || "REDIRECT",
                activeJobsCount: verification.activeJobsCount,
                lastProbedAt: new Date(),
                isVerified: true,
              })
              .onConflictDoUpdate({
                target: companies.slug,
                set: {
                  careersUrl,
                  atsProvider: board.type,
                  atsToken: board.token,
                  discoveryStatus: verification.isValid ? "VERIFIED" : "MANUAL_REVIEW",
                  discoveryMethod: board.discoveryMethod || "REDIRECT",
                  sector: seed.sector,
                  tier: seed.tier,
                  activeJobsCount: verification.activeJobsCount,
                  lastProbedAt: new Date(),
                  updatedAt: new Date(),
                },
              });
          } catch (dbErr: any) {
            console.error(`\n   ❌ DB upsert error for ${seed.name}:`, dbErr.message);
          }
        }

        console.log(`✅ ${board.type.toUpperCase()} [${board.token}] (${verification.activeJobsCount} roles)`);
        results.push({
          name: seed.name,
          domain: seed.domain,
          sector: seed.sector,
          atsProvider: board.type,
          atsToken: board.token,
          status: verification.isValid ? "VERIFIED" : "MANUAL_REVIEW",
          jobsFound: verification.activeJobsCount,
          careersUrl,
        });
      } else {
        console.log(`⚠️ Unresolved (Custom career portal)`);
        results.push({
          name: seed.name,
          domain: seed.domain,
          sector: seed.sector,
          atsProvider: "unresolved",
          atsToken: "none",
          status: "MANUAL_REVIEW",
          jobsFound: 0,
          careersUrl: seed.careersUrl || `https://${seed.domain}/careers`,
        });
      }
    } catch (err: any) {
      console.log(`❌ Error: ${err.message}`);
    }
  }

  console.log("\n🇮🇳 ====================================================================");
  console.log("🇮🇳 DISCOVERY RUN COMPLETE! SUMMARY MATRIX:");
  console.log("🇮🇳 ====================================================================");

  console.table(
    results.map((r) => ({
      Company: r.name,
      Sector: r.sector,
      "ATS System": r.atsProvider.toUpperCase(),
      "ATS Token/ID": r.atsToken,
      Status: r.status,
      "Jobs Probed": r.jobsFound,
    }))
  );

  const verifiedCount = results.filter((r) => r.status === "VERIFIED").length;
  console.log(`\n🎉 Total Companies Evaluated: ${results.length}`);
  console.log(`✅ Successfully Discovered & Verified: ${verifiedCount} (${Math.round((verifiedCount / results.length) * 100)}%)`);
  console.log(`🛠️ Custom Portals Requiring Scraper/Adapter: ${results.length - verifiedCount}`);
  
  process.exit(0);
}

main().catch((err) => {
  console.error("Discovery run failed:", err);
  process.exit(1);
});
