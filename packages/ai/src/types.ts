export type AITask =
  | "IMPROVE_RESUME_BULLET"
  | "INTERVIEW_PREP_QUESTIONS"
  | "EXPLAIN_MISSING_SKILLS"
  | "JOB_DESCRIPTION_IMPROVE";

export interface AIRequestOptions {
  task: AITask;
  input: Record<string, any>;
}

export interface AIResponse {
  success: boolean;
  provider: "gemini" | "groq" | "cloudflare" | "mock";
  result: any;
  cached: boolean;
  quotaWarning?: string;
  error?: string;
}

export interface SystemUsageStats {
  databasePercentage: number; // e.g. 61%
  storagePercentage: number;  // e.g. 32%
  aiPercentage: number;       // e.g. 81%
  emailPercentage: number;    // e.g. 52%
  backgroundJobsPercentage: number; // e.g. 24%
  circuitBreakerStatus: "HEALTHY" | "THROTTLED_85" | "KILLSWITCH_95";
}
