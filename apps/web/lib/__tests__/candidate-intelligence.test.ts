import { describe, it, expect } from "vitest";
import { scoreJobForCandidate, CandidateIntelProfile } from "../candidate-intelligence";
import { MockJob } from "../mock-jobs";
import { JobType, WorkMode, JobSource } from "@repo/shared";

describe("Candidate Intelligence Scorer (scoreJobForCandidate)", () => {
  const profile: CandidateIntelProfile = {
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS"],
    targetRole: "Frontend",
    experienceLevel: "FRESHER",
    workMode: "REMOTE",
    location: "bengaluru",
  };

  const matchingJob: MockJob = {
    id: "test-1",
    title: "Frontend Engineer (React / TypeScript)",
    slug: "frontend-engineer-c1",
    jobType: JobType.FULL_TIME,
    workMode: WorkMode.REMOTE,
    location: "Bengaluru, Karnataka, India",
    salaryOrStipend: "₹8,00,000 / year",
    experienceYears: 0,
    description: "Build modern React and TypeScript web applications.",
    requirements: ["Experience with React, TypeScript, and modern CSS."],
    benefits: ["Remote flexibility"],
    source: JobSource.DIRECT,
    companyName: "Acme Labs",
    companySlug: "acme-labs",
    companyLogoInitial: "A",
    isVerified: true,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    skillSlugs: ["react", "typescript", "tailwind-css"],
    postedAgo: "1d ago",
    postedAt: new Date().toISOString(),
    truthTeller: {
      totalApplications: 12,
      reviewedApplications: 10,
      reviewRate: 83,
      medianFirstReviewDays: 1.5,
      lastRecruiterActivity: "Active 2h ago",
    },
  };

  it("yields TOP tier score for fully aligned candidate profile", () => {
    const intel = scoreJobForCandidate(matchingJob, profile);

    expect(intel.totalScore).toBeGreaterThanOrEqual(85);
    expect(intel.tier).toBe("TOP");
    expect(intel.roleMatch).toBe(true);
    expect(intel.expMatch).toBe(true);
    expect(intel.locationMatch).toBe(true);
    expect(intel.matchedSkills).toContain("React");
    expect(intel.matchedSkills).toContain("TypeScript");
  });

  it("penalizes mismatched target role and experience", () => {
    const mismatchedJob: MockJob = {
      ...matchingJob,
      title: "Senior DevOps Infrastructure Lead",
      skills: ["Kubernetes", "Terraform", "AWS", "Ansible"],
      experienceYears: 6,
    };

    const intel = scoreJobForCandidate(mismatchedJob, profile);

    expect(intel.totalScore).toBeLessThanOrEqual(50);
    expect(intel.tier).toBe("LOW");
    expect(intel.roleMatch).toBe(false);
    expect(intel.expMatch).toBe(false);
  });
});
