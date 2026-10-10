/**
 * RoleNest - Phase 2 Multi-ATS Expansion Test Runner
 * Tests direct ingestion across Greenhouse, Lever, Ashby, SmartRecruiters, Workday, etc.
 */

import { crawlIndiaTechBoards } from "../packages/alligators/src/index";

async function main() {
  console.log("🚀 Testing Phase 2 Multi-ATS Direct Ingestion Engine...");
  
  const testBoards = [
    { companyName: "Sarvam AI", type: "ashby" as const, token: "sarvam", website: "https://sarvam.ai" },
    { companyName: "Freshworks", type: "smartrecruiters" as const, token: "Freshworks", website: "https://freshworks.com" },
    { companyName: "CRED", type: "lever" as const, token: "cred", website: "https://cred.club" },
    { companyName: "Razorpay", type: "greenhouse" as const, token: "razorpaysoftwareprivatelimited", website: "https://razorpay.com" },
    { companyName: "BrowserStack", type: "workday" as const, token: "browserstack.wd3.myworkdayjobs.com/External", website: "https://browserstack.com" },
  ];

  const jobs = await crawlIndiaTechBoards({
    maxPerCompany: 5,
    enableDiscovery: false,
    additionalBoards: testBoards,
  });

  console.log(`\n✅ Ingestion complete! Total extracted jobs: ${jobs.length}`);
  
  const bySource = new Map<string, number>();
  for (const j of jobs) {
    const s = j.source || "UNKNOWN";
    bySource.set(s, (bySource.get(s) || 0) + 1);
  }

  console.log("\n📊 Breakdown by ATS Provider / Source:");
  for (const [source, count] of bySource.entries()) {
    console.log(`   - ${source}: ${count} jobs`);
  }

  console.log("\n📋 Sample Extracted Roles:");
  for (const j of jobs.slice(0, 5)) {
    console.log(`   • [${j.companyName}] (${j.source}) ${j.title} -> ${j.location} (${j.sourceUrl})`);
  }
}

main().catch(console.error);
