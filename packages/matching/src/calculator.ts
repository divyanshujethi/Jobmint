import { APP_CONFIG, WorkMode } from "@repo/shared";
import {
  CandidateMatchProfile,
  JobMatchTarget,
  MatchResult,
  MatchScoreBreakdown,
} from "./types";

/**
 * Pure mathematical deterministic matching calculation.
 * Zero LLM dependency, sub-millisecond execution, 100% explainable.
 */
export function calculateJobMatch(
  candidate: CandidateMatchProfile,
  job: JobMatchTarget
): MatchResult {
  const candidateSkillsSet = new Set(
    candidate.skills.map((s) => s.toLowerCase().trim())
  );
  const jobSkillsClean = job.requiredSkills.map((s) => s.toLowerCase().trim());

  // 1. SKILLS CALCULATION (35 Points Max)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (let i = 0; i < job.requiredSkills.length; i++) {
    const rawSkill = job.requiredSkills[i];
    const cleanSkill = jobSkillsClean[i];
    if (candidateSkillsSet.has(cleanSkill)) {
      matchedSkills.push(rawSkill);
    } else {
      missingSkills.push(rawSkill);
    }
  }

  const skillsMatchRatio =
    job.requiredSkills.length > 0
      ? matchedSkills.length / job.requiredSkills.length
      : 1;
  const skillsScore = Math.round(skillsMatchRatio * 35);

  // 2. EXPERIENCE CALCULATION (20 Points Max)
  let experienceScore = 20;
  if (job.experienceYears > 0) {
    if (candidate.experienceYears >= job.experienceYears) {
      experienceScore = 20;
    } else {
      experienceScore = Math.max(
        5,
        Math.round((candidate.experienceYears / job.experienceYears) * 20)
      );
    }
  } else {
    // Fresher friendly role
    experienceScore = candidate.isFresher ? 20 : 18;
  }

  // 3. PROJECTS CALCULATION (15 Points Max)
  let matchingProjectsCount = 0;
  for (const project of candidate.projects) {
    const hasOverlap = project.skillsUsed.some((s) =>
      jobSkillsClean.includes(s.toLowerCase().trim())
    );
    if (hasOverlap) {
      matchingProjectsCount++;
    }
  }
  const projectsScore = Math.min(15, matchingProjectsCount * 8 || (candidate.projects.length > 0 ? 8 : 4));

  // 4. LOCATION & WORK MODE CALCULATION (10 Points Max)
  const isRemote = job.workMode === WorkMode.REMOTE;
  const locationMatch =
    candidate.location.toLowerCase().includes(job.location.toLowerCase()) ||
    job.location.toLowerCase().includes(candidate.location.toLowerCase());

  let locationScore = 10;
  if (!isRemote && !locationMatch) {
    locationScore = 4;
  }

  // 5. EDUCATION CALCULATION (10 Points Max)
  const educationScore = candidate.educationField ? 10 : 8;

  // 6. PREFERENCES CALCULATION (10 Points Max)
  const modeMatch = candidate.preferredWorkModes.includes(job.workMode);
  const preferencesScore = modeMatch ? 10 : 7;

  // TOTAL SCORE
  const totalScore = Math.min(
    100,
    skillsScore +
      experienceScore +
      projectsScore +
      locationScore +
      educationScore +
      preferencesScore
  );

  const breakdown: MatchScoreBreakdown = {
    skills: {
      score: skillsScore,
      max: 35,
      matchedSkills,
      missingSkills,
    },
    experience: {
      score: experienceScore,
      max: 20,
    },
    projects: {
      score: projectsScore,
      max: 15,
      matchingProjectsCount,
    },
    location: {
      score: locationScore,
      max: 10,
      isRemote,
      locationMatch,
    },
    education: {
      score: educationScore,
      max: 10,
    },
    preferences: {
      score: preferencesScore,
      max: 10,
    },
  };

  const explanation = `Score: ${totalScore}%. Strong match on ${matchedSkills.join(
    ", "
  )}.${
    missingSkills.length > 0
      ? ` Missing ${missingSkills.length} required skill(s): ${missingSkills.join(", ")}.`
      : " You meet all technical prerequisites!"
  }`;

  return {
    totalScore,
    breakdown,
    matchedSkills,
    missingSkills,
    explanation,
  };
}
