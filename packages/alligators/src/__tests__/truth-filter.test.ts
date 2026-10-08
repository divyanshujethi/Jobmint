import { describe, it, expect } from "vitest";
import { evaluateJobTruth } from "../job-alligator/truth-filter";

describe("Truth Filter Anti-Ghosting Engine (evaluateJobTruth)", () => {
  const legitimateJob = {
    title: "Junior Frontend Engineer",
    description:
      "We are looking for a motivated Frontend Engineer to join our team in Bengaluru. You will work with React, TypeScript, and modern design systems to build high-performance web applications. Mentorship provided by senior staff engineers.",
    salaryOrStipend: "₹35,000 / month",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    companyName: "Acme Tech Labs",
  };

  it("passes authentic jobs with high confidence score", () => {
    const result = evaluateJobTruth(legitimateJob);

    expect(result.passes).toBe(true);
    expect(result.isGhostRisk).toBe(false);
    expect(result.score).toBe(100);
    expect(result.reasons).toEqual([]);
  });

  it("flags and fails unpaid software engineering roles", () => {
    const unpaidDevJob = {
      ...legitimateJob,
      title: "Fullstack Developer Intern",
      salaryOrStipend: "Unpaid / College Credit",
    };

    const result = evaluateJobTruth(unpaidDevJob);

    expect(result.passes).toBe(false);
    expect(result.isGhostRisk).toBe(true);
    expect(result.reasons).toContain(
      "Unpaid engineering role detected (violates RoleNest truth policy)"
    );
  });

  it("flags stale jobs published more than 60 days ago", () => {
    const staleJob = {
      ...legitimateJob,
      publishedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), // 75 days ago
    };

    const result = evaluateJobTruth(staleJob);

    expect(result.isGhostRisk).toBe(true);
    expect(result.passes).toBe(false);
    expect(result.reasons).toContain(
      "Posting is over 60 days old (potential stale/ghost job)"
    );
  });

  it("penalizes sparse/fly-by-night descriptions under 120 characters", () => {
    const lowQualityJob = {
      ...legitimateJob,
      description: "Need React dev urgently. DM resume.", // 35 chars
    };

    const result = evaluateJobTruth(lowQualityJob);

    expect(result.reasons).toContain(
      "Insufficient description length (fly-by-night risk)"
    );
    expect(result.score).toBeLessThanOrEqual(75);
  });

  it("flags missing or invalid company names as ghost risks", () => {
    const anonJob = {
      ...legitimateJob,
      companyName: " ",
    };

    const result = evaluateJobTruth(anonJob);

    expect(result.isGhostRisk).toBe(true);
    expect(result.passes).toBe(false);
    expect(result.reasons).toContain("Invalid or empty company name");
  });
});
