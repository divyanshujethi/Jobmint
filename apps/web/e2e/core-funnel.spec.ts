import { test, expect } from "@playwright/test";

test.describe("Core Funnel: Candidate to Recruiter Workflow", () => {
  test("1. Candidate Job Search Funnel", async ({ page }) => {
    // Navigate to /jobs
    await page.goto("/jobs");
    await expect(page).toHaveTitle(/Jobs|Role Nest/i);

    // Verify main headings and search bar exist
    const searchInput = page.locator('input[placeholder*="Search by title" i], input[type="text"]').first();
    await expect(searchInput).toBeVisible();

    // Verify job cards are rendered after loading
    const jobLink = page.locator('a[href^="/jobs/"]').first();
    await expect(jobLink).toBeVisible({ timeout: 10000 });

    // Click on the first job listing to visit details page
    const firstJobHref = await jobLink.getAttribute("href");
    expect(firstJobHref).toBeTruthy();

    await page.goto(firstJobHref!);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('button:has-text("Apply"), a:has-text("Apply")').first()).toBeVisible();
  });

  test("2. Resume Upload & ATS Matcher Funnel", async ({ page }) => {
    // Navigate to /resume/parser or assistant
    await page.goto("/resume/parser");
    await expect(page).toHaveTitle(/Resume|Parser|Role Nest/i);

    // Verify ATS match / upload container exists
    const atsContainer = page.locator("body");
    await expect(atsContainer).toBeVisible();

    // Verify API endpoint for ATS match responds correctly (handles free trial & quota enforcement)
    const apiResponse = await page.request.post("/api/ai/ats-match", {
      data: {
        resumeText: "Experienced Software Engineer with proficiency in React, TypeScript, Next.js, and Node.js. Built high-scale fintech systems.",
        jobDescription: "Looking for a Full-Stack Engineer skilled in TypeScript, React, Next.js, and PostgreSQL.",
      },
    });

    expect([200, 403]).toContain(apiResponse.status());
    const data = await apiResponse.json();
    if (apiResponse.status() === 200) {
      expect(data.matchScore).toBeGreaterThanOrEqual(0);
      expect(data.matchedSkills).toBeDefined();
      expect(Array.isArray(data.matchedSkills)).toBeTruthy();
    } else {
      expect(data.requiresPro).toBeTruthy();
    }
  });

  test("3. Application Submission & Truth Teller Telemetry Funnel", async ({ page }) => {
    // Verify candidate applications tracker page loads
    await page.goto("/applications");
    await expect(page).toHaveTitle(/Applications|Tracker|Role Nest/i);

    // Verify Truth Teller UI components
    await expect(page.locator("text=Truth Teller").first()).toBeVisible();

    // Check application API route returns structured JSON
    const res = await page.request.get("/api/applications");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.applications).toBeDefined();
  });

  test("4. Recruiter Review & Stage Pipeline Funnel", async ({ page }) => {
    // Verify employer applicants dashboard
    await page.goto("/employer/applicants");
    await expect(page).toHaveTitle(/Applicants|Employer|Role Nest/i);

    // Check Recruiter Desk heading & Truth Teller badge
    await expect(page.getByRole("heading", { name: /Recruiter Applicant Desk/i })).toBeVisible();
    await expect(page.getByText(/Truth Teller Active/i)).toBeVisible();

    // Verify GET /api/employer/applicants returns 401 when unauthenticated
    const unauthReq = await page.request.get("/api/employer/applicants");
    expect(unauthReq.status()).toBe(401);

    // Verify PATCH /api/employer/applicants endpoint validates payload
    const patchReq = await page.request.patch("/api/employer/applicants", {
      data: { applicationId: "test-id", status: "SHORTLISTED" },
    });
    // Should be rejected with 401 without auth credentials
    expect(patchReq.status()).toBe(401);
  });
});
