export type AITask =
  | "IMPROVE_RESUME_BULLET"
  | "INTERVIEW_PREP_QUESTIONS"
  | "EXPLAIN_MISSING_SKILLS"
  | "JOB_DESCRIPTION_IMPROVE"
  | "ANALYZE_FULL_RESUME";

export type AIProviderName =
  | "webgpu"
  | "groq-llama-3.3"
  | "cloudflare-llama-3.2"
  | "oci-ollama-llama-3.2"
  | "gemini-flash"
  | "deterministic";

export interface AIRequestOptions {
  task: AITask;
  input: Record<string, any>;
  preferredProvider?: AIProviderName;
}

export interface AIResponse {
  success: boolean;
  provider: AIProviderName;
  modelUsed: string;
  tier: number; // 0: WebGPU, 1: Groq, 2: Cloudflare, 3: OCI Ollama, 4: Gemini/Deterministic
  latencyMs: number;
  result: any;
  cached: boolean;
  quotaWarning?: string;
  error?: string;
  providerChainAttempted?: string[];
}

export interface SystemUsageStats {
  databasePercentage: number;
  storagePercentage: number;
  aiPercentage: number;
  emailPercentage: number;
  backgroundJobsPercentage: number;
  circuitBreakerStatus: "HEALTHY" | "THROTTLED_85" | "KILLSWITCH_95";
  activeProviders: {
    groq: boolean;
    cloudflare: boolean;
    ociOllama: boolean;
    gemini: boolean;
  };
}