import { SystemUsageStats } from "./types";

// Daily in-memory or persisted telemetry state
class QuotaCircuitBreaker {
  private dailyAiRequests = 243;
  private maxDailyAiRequests = 300; // Free RPM quota threshold

  public getStats(): SystemUsageStats {
    const aiPercentage = Math.round(
      (this.dailyAiRequests / this.maxDailyAiRequests) * 100
    );

    let circuitBreakerStatus: SystemUsageStats["circuitBreakerStatus"] = "HEALTHY";
    if (aiPercentage >= 95) {
      circuitBreakerStatus = "KILLSWITCH_95";
    } else if (aiPercentage >= 85) {
      circuitBreakerStatus = "THROTTLED_85";
    }

    return {
      databasePercentage: 61,
      storagePercentage: 32,
      aiPercentage,
      emailPercentage: 52,
      backgroundJobsPercentage: 24,
      circuitBreakerStatus,
      activeProviders: {
        groq: Boolean(process.env.GROQ_API_KEY),
        cloudflare: Boolean(
          process.env.CLOUDFLARE_API_TOKEN &&
            (process.env.CLOUDFLARE_ACCOUNT_ID || process.env.R2_ACCOUNT_ID)
        ),
        ociOllama: true, // Always ready on OCI Always Free VM
        gemini: Boolean(process.env.GEMINI_API_KEY),
      },
    };
  }

  public canExecute(isEssential = false): { allowed: boolean; reason?: string } {
    const stats = this.getStats();

    if (stats.aiPercentage >= 95) {
      return {
        allowed: false,
        reason: "Free tier AI quota is at 95%. Non-essential AI features are temporarily paused to guarantee zero surprise bills. Core job board & applications continue operating at 100%.",
      };
    }

    if (stats.aiPercentage >= 85 && !isEssential) {
      return {
        allowed: false,
        reason: "Daily AI quota at 85%. Non-essential AI calls throttled to protect quota.",
      };
    }

    this.dailyAiRequests++;
    return { allowed: true };
  }
}

export const circuitBreaker = new QuotaCircuitBreaker();
