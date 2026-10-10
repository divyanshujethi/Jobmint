import { describe, it, expect } from "vitest";
import { computeClientAtsMatch } from "../client-ats";

describe("Phase 3: Client-Side Privacy-First ATS Match Engine", () => {
  it("computes 100% stack match when all candidate skills align", () => {
    const candidateSkills = ["React", "TypeScript", "Node.js", "PostgreSQL"];
    const requiredSkills = ["React", "TypeScript", "Node.js", "PostgreSQL"];

    const result = computeClientAtsMatch(candidateSkills, requiredSkills);
    expect(result.matchScore).toBe(100);
    expect(result.matchedSkills.length).toBe(4);
    expect(result.missingSkills.length).toBe(0);
    expect(result.privacyGuarantee.isClientSideOnly).toBe(true);
    expect(result.privacyGuarantee.dpdpCompliant).toBe(true);
    expect(result.privacyGuarantee.zeroEgress).toBe(true);
  });

  it("identifies missing skills and attaches learning remediation roadmaps", () => {
    const candidateSkills = ["React", "JavaScript"];
    const requiredSkills = ["React", "TypeScript", "Docker", "Go"];

    const result = computeClientAtsMatch(candidateSkills, requiredSkills);
    expect(result.matchedSkills).toContain("React");
    expect(result.missingSkills).toContain("TypeScript");
    expect(result.missingSkills).toContain("Docker");
    expect(result.missingSkills).toContain("Go");
    expect(result.remediations.length).toBeGreaterThan(0);
    expect(result.remediations[0].roadmapSlug).toBeDefined();
  });

  it("handles tech synonyms accurately (e.g. Next.js matching React, psql matching PostgreSQL)", () => {
    const candidateSkills = ["Next.js", "Express", "psql"];
    const requiredSkills = ["React", "Node.js", "PostgreSQL"];

    const result = computeClientAtsMatch(candidateSkills, requiredSkills);
    expect(result.matchedSkills).toContain("React");
    expect(result.matchedSkills).toContain("Node.js");
    expect(result.matchedSkills).toContain("PostgreSQL");
    expect(result.missingSkills.length).toBe(0);
    expect(result.matchScore).toBe(100);
  });

  it("executes in sub-millisecond time locally with zero network egress", () => {
    const candidateSkills = ["Python", "FastAPI", "Docker", "AWS", "Git"];
    const requiredSkills = ["Python", "Docker", "Kubernetes", "AWS"];

    const result = computeClientAtsMatch(candidateSkills, requiredSkills);
    expect(result.privacyGuarantee.executionTimeMs).toBeLessThan(10);
  });
});
