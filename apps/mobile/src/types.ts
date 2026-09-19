import { JobType, WorkMode, ApplicationStatus } from "@repo/shared";
import { MatchScoreBreakdown } from "@repo/matching";

export type MobileTab = "jobs" | "internships" | "roadmaps" | "applications" | "assistant";

export interface MobileJob {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companySlug: string;
  companyLogoInitial: string;
  isVerified: boolean;
  location: string;
  workMode: (typeof WorkMode)[keyof typeof WorkMode];
  jobType: (typeof JobType)[keyof typeof JobType];
  salaryOrStipend: string;
  experienceYears: number;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedAgo: string;
  truthTeller: {
    totalApplications: number;
    reviewedApplications: number;
    reviewRate: number;
    medianFirstReviewDays: number;
    lastRecruiterActivity: string;
  };
  matchScore?: MatchScoreBreakdown;
}

export interface MobileApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  appliedDate: string;
  status: (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
  daysSinceLastActivity: number;
  isGhostingWarning: boolean;
  timeline: {
    step: string;
    date: string;
    completed: boolean;
    current: boolean;
  }[];
}