import { describe, it, expect } from "vitest";
import { calculateJobMatch } from "../calculator";
import { WorkMode, JobType } from "@repo/shared";
import { CandidateMatchProfile, JobMatchTarget } from "../types";

describe("Job Matching Algorithm (calculateJobMatch)", () => {
  const baseCandidate: CandidateMatchProfile = {
    id: "cand-1",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"],
    experienceYears: 1,
    isFresher: false,
    projects: [
      {
        title: "Fullstack SaaS Platform",
        skillsUsed: ["TypeScript", "React", "Next.js", "PostgreSQL"],
      },
    ],
    location: "Bengaluru, Karnataka, India",
    preferredWorkModes: [WorkMode.REMOTE, WorkMode.HYBRID],
    preferredRoles: ["Full Stack Developer"],
    educationField: "Computer Science",
  };

  const baseJob: JobMatchTarget = {
    id: "job-101",
    title: "Junior Full Stack Developer",
    requiredSkills: ["TypeScript", "React", "Next.js"],
    experienceYears: 1,
    location: "Bengaluru, India",
    workMode: WorkMode.REMOTE,
    jobType: JobType.FULL_TIME,
  };

  it("calculates a high match score for fully aligned candidate and job", () => {
    const result = calculateJobMatch(baseCandidate, baseJob);

    expect(result.totalScore).toBeGreaterThanOrEqual(90);
    expect(result.matchedSkills).toEqual(["TypeScript", "React", "Next.js"]);
    expect(result.missingSkills).toEqual([]);
    expect(result.breakdown.skills.matchedSkills).toEqual(["TypeScript", "React", "Next.js"]);
    expect(result.breakdown.skills.missingSkills).toEqual([]);
    expect(result.breakdown.skills.score).toBe(35); // 100% of 35 max points
    expect(result.breakdown.experience.score).toBe(20);
    expect(result.breakdown.location.score).toBe(10);
    expect(result.explanation).toContain("Score: ");
  });

  it("accurately handles missing skills and reflects in breakdown", () => {
    const jobWithMissingSkills: JobMatchTarget = {
      ...baseJob,
      requiredSkills: ["TypeScript", "Rust", "Solidity", "Docker"],
    };

    const result = calculateJobMatch(baseCandidate, jobWithMissingSkills);

    expect(result.matchedSkills).toEqual(["TypeScript"]);
    expect(result.missingSkills).toEqual(["Rust", "Solidity", "Docker"]);
    expect(result.breakdown.skills.matchedSkills).toEqual(["TypeScript"]);
    expect(result.breakdown.skills.missingSkills).toEqual(["Rust", "Solidity", "Docker"]);
    // 1 of 4 matched = 25% of 35 = 9
    expect(result.breakdown.skills.score).toBe(9);
    expect(result.totalScore).toBeLessThan(80);
    expect(result.explanation).toContain("Missing 3 required skill(s)");
  });

  it("awards full experience points to freshers applying for 0-exp roles", () => {
    const fresherCandidate: CandidateMatchProfile = {
      ...baseCandidate,
      experienceYears: 0,
      isFresher: true,
      skills: ["Python", "Flask"],
      projects: [{ title: "Mini Project", skillsUsed: ["Python"] }],
    };

    const fresherJob: JobMatchTarget = {
      id: "intern-1",
      title: "Python Intern",
      requiredSkills: ["Python"],
      experienceYears: 0,
      location: "Remote",
      workMode: WorkMode.REMOTE,
      jobType: JobType.INTERNSHIP,
    };

    const result = calculateJobMatch(fresherCandidate, fresherJob);

    expect(result.breakdown.experience.score).toBe(20);
    expect(result.totalScore).toBeGreaterThanOrEqual(75);
  });

  it("penalizes on-site location mismatch", () => {
    const onsiteJobDifferentCity: JobMatchTarget = {
      ...baseJob,
      workMode: WorkMode.ON_SITE,
      location: "Chennai, Tamil Nadu, India",
    };

    const result = calculateJobMatch(baseCandidate, onsiteJobDifferentCity);

    // Candidate is in Bengaluru, job is Onsite in Chennai
    expect(result.breakdown.location.score).toBe(4);
  });

  it("bounds score strictly between 0 and 100", () => {
    const emptyCandidate: CandidateMatchProfile = {
      id: "empty-cand",
      skills: [],
      experienceYears: 0,
      isFresher: false,
      projects: [],
      location: "Tokyo, Japan",
      preferredWorkModes: [],
      preferredRoles: [],
      educationField: undefined,
    };

    const demandingJob: JobMatchTarget = {
      id: "staff-eng",
      title: "Staff Systems Engineer",
      requiredSkills: ["C++", "Kernel Dev", "Assembly"],
      experienceYears: 10,
      location: "Bengaluru, India",
      workMode: WorkMode.ON_SITE,
      jobType: JobType.FULL_TIME,
    };

    const result = calculateJobMatch(emptyCandidate, demandingJob);

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
  });
});
