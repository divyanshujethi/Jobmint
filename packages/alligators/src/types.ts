import { JobType, WorkMode } from '@repo/shared';

export interface RawCrawledJob {
  title: string;
  companyName: string;
  companyWebsite?: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  salaryOrStipend: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  source: 'GREENHOUSE' | 'LEVER' | 'GITHUB_INTERNSHIPS' | 'REMOTE_RSS' | 'SIMPLIFY_TECH' | 'EXTERNAL';
  sourceUrl: string;
  externalId: string;
  description: string;
  rawRequirements?: string;
  skills: string[];
  isGhostRisk: boolean;
  truthScore: number;
  publishedAt: string;
}

export interface IngestedJobResult {
  accepted: boolean;
  job?: RawCrawledJob;
  rejectionReason?: string;
}

export interface StudyResourceItem {
  id: string;
  title: string;
  provider: string;
  url: string;
  type: 'video_course' | 'interactive_doc' | 'github_repo' | 'official_guide';
  estimatedHours: number;
  cost: 'FREE';
  qualityRating: number;
  matchedSkills: string[];
  canvasNodeIds: string[];
  summary: string;
}

export interface CanvasTrackMapping {
  trackId: string;
  nodeId: string;
  resources: StudyResourceItem[];
  projectBrief: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
    suggestedTech: string[];
  };
}

export interface JobAlligatorStats {
  totalCrawled: number;
  accepted: number;
  rejectedGhostJobs: number;
  lastCrawlTimestamp: string;
  topDemandedSkills: { skill: string; count: number }[];
}

export interface StudyAlligatorStats {
  totalResourcesIndexed: number;
  totalCanvasNodesMapped: number;
  freeCourseCount: number;
  lastSyncTimestamp: string;
}

export interface EmployerVerificationRecord {
  companyId: string;
  companyName: string;
  domain: string;
  workEmail: string;
  gstin?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verificationMethod: 'DNS_TXT' | 'WORK_EMAIL' | 'GSTIN' | 'MANUAL';
  verifiedAt?: string;
  checks: {
    domainMatchesEmail: boolean;
    dnsTxtRecordValid: boolean;
    gstinPatternValid: boolean;
    noGhostJobReports: boolean;
  };
}