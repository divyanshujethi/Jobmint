export interface TruthEvaluation {
  passes: boolean;
  score: number;
  reasons: string[];
  isGhostRisk: boolean;
}

export function evaluateJobTruth(params: {
  title: string;
  description: string;
  salaryOrStipend: string;
  publishedAt: string;
  companyName: string;
}): TruthEvaluation {
  const reasons: string[] = [];
  let score = 100;
  let isGhostRisk = false;

  const salaryLower = params.salaryOrStipend.toLowerCase();
  if (
    salaryLower.includes("unpaid") ||
    salaryLower.includes("0 stipend") ||
    salaryLower.includes("commission only")
  ) {
    if (params.title.toLowerCase().includes("engineer") || params.title.toLowerCase().includes("developer")) {
      reasons.push("Unpaid engineering role detected (violates jobmint truth policy)");
      score -= 50;
      isGhostRisk = true;
    }
  }

  const daysOld = (new Date().getTime() - new Date(params.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld > 60) {
    reasons.push("Posting is over 60 days old (potential stale/ghost job)");
    score -= 35;
    isGhostRisk = true;
  } else if (daysOld > 30) {
    reasons.push("Posting is between 30-60 days old");
    score -= 15;
  }

  if (params.description.trim().length < 120) {
    reasons.push("Insufficient description length (fly-by-night risk)");
    score -= 25;
  }

  if (!params.companyName || params.companyName.trim().length < 2) {
    reasons.push("Invalid or empty company name");
    score -= 40;
    isGhostRisk = true;
  }

  const finalScore = Math.max(0, score);
  return {
    passes: finalScore >= 50 && !isGhostRisk,
    score: finalScore,
    reasons,
    isGhostRisk,
  };
}