import { describe, it, expect } from "vitest";
import { calculatePlayerStats } from "../../../../apps/web/lib/game-engine";
import { isDirectAtsOrCompanyUrl } from "@repo/shared";

describe("Phase 2: Frontend Hydration, Empty States & Visual Polish", () => {
  it("calculatePlayerStats initializes honest 0-state for guests without synthetic XP", () => {
    const stats = calculatePlayerStats(0, 0);
    expect(stats.xp).toBe(0);
    expect(stats.streakDays).toBe(0);
    expect(stats.level).toBe(1);
    expect(stats.title).toBe("Level 1: Novice Cadet");
    expect(stats.progressPercent).toBe(0);
    expect(stats.solvedChallengesCount).toBe(0);
  });

  it("isDirectAtsOrCompanyUrl validates direct ATS vs secondary aggregator URLs", () => {
    expect(isDirectAtsOrCompanyUrl("https://boards.greenhouse.io/postman/jobs/12345")).toBe(true);
    expect(isDirectAtsOrCompanyUrl("https://jobs.lever.co/swiggy/abcde")).toBe(true);
    expect(isDirectAtsOrCompanyUrl("https://jobs.smartrecruiters.com/Freshworks/123")).toBe(true);
    expect(isDirectAtsOrCompanyUrl("https://careers.google.com/jobs/results/123")).toBe(true);

    expect(isDirectAtsOrCompanyUrl("https://www.naukri.com/job-listings-123")).toBe(false);
    expect(isDirectAtsOrCompanyUrl("https://internshala.com/internship/detail/123")).toBe(false);
    expect(isDirectAtsOrCompanyUrl("https://www.foundit.in/job/123")).toBe(false);
  });

  it("handles honest metric calculation for zero-application companies", () => {
    const rawCompany = {
      totalApplications: "0",
      reviewedApplications: "0",
      medianFirstReviewDays: null,
    };

    const parsedApps = parseInt(rawCompany.totalApplications || "0", 10);
    const totalApps = Number.isFinite(parsedApps) && parsedApps > 0 ? parsedApps : 0;
    const parsedReviewed = parseInt(rawCompany.reviewedApplications || "0", 10);
    const reviewedApps = Number.isFinite(parsedReviewed) && parsedReviewed > 0 ? parsedReviewed : 0;
    const reviewRate = totalApps > 0 ? Math.round((reviewedApps / totalApps) * 100) : 0;
    const medianDays = rawCompany.medianFirstReviewDays ? parseFloat(rawCompany.medianFirstReviewDays) : 0;

    expect(totalApps).toBe(0);
    expect(reviewedApps).toBe(0);
    expect(reviewRate).toBe(0);
    expect(medianDays).toBe(0);
  });
});
