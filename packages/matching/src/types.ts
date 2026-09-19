import { WorkMode, JobType } from "@repo/shared";

export interface CandidateMatchProfile {
  id: string;
  skills: string[]; // canonical skill slugs or names
  experienceYears: number; // 0 for fresher
  isFresher: boolean;
  projects: Array<{
    title: string;
    skillsUsed: string[];
  }>;
  location: string;
  preferredWorkModes: string[];
  preferredRoles: string[];
  expectedSalaryMin?: number;
  educationField?: string;
}

export interface JobMatchTarget {
  id: string;
  title: string;
  requiredSkills: string[]; // canonical skill slugs or names
  optionalSkills?: string[];
  experienceYears: number;
  workMode: (typeof WorkMode)[keyof typeof WorkMode];
  location: string;
  jobType: (typeof JobType)[keyof typeof JobType];
  minSalary?: number;
}

export interface MatchScoreBreakdown {
  skills: {
    score: number; // 0 to 35
    max: number; // 35
    matchedSkills: string[];
    missingSkills: string[];
  };
  experience: {
    score: number; // 0 to 20
    max: number; // 20
  };
  projects: {
    score: number; // 0 to 15
    max: number; // 15
    matchingProjectsCount: number;
  };
  location: {
    score: number; // 0 to 10
    max: number; // 10
    isRemote: boolean;
    locationMatch: boolean;
  };
  education: {
    score: number; // 0 to 10
    max: number; // 10
  };
  preferences: {
    score: number; // 0 to 10
    max: number; // 10
  };
}

export interface MatchResult {
  totalScore: number; // 0 to 100
  breakdown: MatchScoreBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}
