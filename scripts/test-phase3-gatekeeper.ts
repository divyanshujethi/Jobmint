/**
 * RoleNest - Phase 3 Gatekeeper Test Suite
 * Tests Strict India-Only Location Normalization & Role-Level Tech Filtering
 */

import {
  evaluateIndiaTechGatekeeper,
  normalizeIndiaLocationStrict,
  classifyTechRole,
} from "../packages/alligators/src/index";

function runTests() {
  console.log("🇮🇳 ====================================================================");
  console.log("🇮🇳 ROLENEST - PHASE 3 STRICT INDIA & TECH GATEKEEPER TEST SUITE");
  console.log("🇮🇳 ====================================================================\n");

  const testCases = [
    // 1. Explicit Indian Cities & Tech roles (Should ACCEPT)
    {
      title: "Senior Full Stack Engineer (React/Go)",
      location: "Bengaluru, Karnataka",
      expectedAccept: true,
      expectedCategory: "software",
      expectedCity: "Bengaluru",
      expectedScope: "INDIA_ONLY",
    },
    {
      title: "Machine Learning / GenAI Research Engineer",
      location: "Hyderabad, Telangana",
      expectedAccept: true,
      expectedCategory: "ai_ml",
      expectedCity: "Hyderabad",
      expectedScope: "INDIA_ONLY",
    },
    {
      title: "Cloud & DevOps SRE",
      location: "Pune, India (Hybrid)",
      expectedAccept: true,
      expectedCategory: "devops_cloud",
      expectedCity: "Pune",
      expectedScope: "INDIA_ONLY",
    },
    {
      title: "Software Development Engineer in Test (SDET)",
      location: "Cyber City, Gurugram",
      expectedAccept: true,
      expectedCategory: "qa_automation",
      expectedCity: "Gurugram",
      expectedScope: "INDIA_ONLY",
    },
    // 2. Global / Worldwide Remote (Should ACCEPT for India candidates)
    {
      title: "Principal Security Engineer",
      location: "Remote (Worldwide)",
      expectedAccept: true,
      expectedCategory: "cybersecurity",
      expectedScope: "WORLDWIDE",
    },
    // 3. Ambiguous Location (Should route to REVIEW QUEUE)
    {
      title: "Senior Backend Developer",
      location: "Remote",
      expectedAccept: false,
      expectedReview: true,
      expectedCategory: "software",
    },
    // 4. Foreign Country-Restricted (Should REJECT)
    {
      title: "Staff Software Engineer",
      location: "San Francisco, CA (US Citizens Only)",
      expectedAccept: false,
      expectedReview: false,
      rejectionKeyword: "foreign",
    },
    {
      title: "Frontend Developer",
      location: "London, UK",
      expectedAccept: false,
      expectedReview: false,
      rejectionKeyword: "foreign",
    },
    // 5. Non-Tech Roles from Tech Companies (Should REJECT)
    {
      title: "Senior Enterprise Account Executive (Sales)",
      location: "Bengaluru, India",
      expectedAccept: false,
      rejectionKeyword: "non-technical",
    },
    {
      title: "Technical Recruiter & Talent Acquisition Partner",
      location: "Mumbai, India",
      expectedAccept: false,
      rejectionKeyword: "non-technical",
    },
    {
      title: "Senior Financial Analyst & Payroll Accountant",
      location: "Noida, India",
      expectedAccept: false,
      rejectionKeyword: "non-technical",
    },
  ];

  let passed = 0;
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const res = evaluateIndiaTechGatekeeper(tc.title, tc.location);

    let ok = true;
    if (res.accepted !== tc.expectedAccept) ok = false;
    if (tc.expectedCategory && res.role.roleCategory !== tc.expectedCategory) ok = false;
    if (tc.expectedCity && res.location.city !== tc.expectedCity) ok = false;
    if (tc.expectedScope && res.location.remoteScope !== tc.expectedScope) ok = false;
    if (tc.expectedReview !== undefined && res.location.needsReview !== tc.expectedReview) ok = false;

    if (ok) {
      console.log(`✅ [PASS] Case #${i + 1}: "${tc.title}" @ "${tc.location}"`);
      console.log(`        Status: ${res.accepted ? "ACCEPTED" : "REJECTED"} | Cat: ${res.role.roleCategory} | Scope: ${res.location.remoteScope} | Review: ${res.location.needsReview}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] Case #${i + 1}: "${tc.title}" @ "${tc.location}"`);
      console.error(`        Got: accepted=${res.accepted}, cat=${res.role.roleCategory}, city=${res.location.city}, scope=${res.location.remoteScope}, review=${res.location.needsReview}`);
      console.error(`        Expected: accepted=${tc.expectedAccept}, cat=${tc.expectedCategory}, city=${tc.expectedCity}, scope=${tc.expectedScope}, review=${tc.expectedReview}`);
    }
  }

  console.log(`\n🎉 Results: ${passed} / ${testCases.length} Tests Passed!`);
  if (passed === testCases.length) {
    console.log("🚀 All Phase 3 Gatekeeper Verification Tests Passed Successfully!");
  } else {
    process.exit(1);
  }
}

runTests();
