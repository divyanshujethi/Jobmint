import { getLearningGuideForSkill } from "@repo/shared";

export interface ClientAtsRemediation {
  skill: string;
  roadmapSlug: string;
  title: string;
}

export interface ClientAtsResult {
  matchScore: number; // 0 to 100
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  remediations: ClientAtsRemediation[];
  privacyGuarantee: {
    isClientSideOnly: boolean;
    dpdpCompliant: boolean;
    zeroEgress: boolean;
    executionTimeMs: number;
  };
}

// Canonical tech synonym dictionary for flexible zero-network matching
const SYNONYM_MAP: Record<string, string[]> = {
  react: ["react", "react.js", "reactjs", "next.js", "nextjs", "frontend"],
  "next.js": ["next.js", "nextjs", "react", "react.js"],
  node: ["node", "node.js", "nodejs", "express", "express.js", "backend"],
  "node.js": ["node.js", "nodejs", "node", "express", "express.js", "backend"],
  typescript: ["typescript", "ts"],
  javascript: ["javascript", "js", "ecmascript", "es6"],
  python: ["python", "python3", "django", "fastapi", "flask"],
  postgresql: ["postgresql", "postgres", "psql", "sql", "rdbms"],
  postgres: ["postgres", "postgresql", "psql", "sql", "rdbms"],
  mongodb: ["mongodb", "mongo", "nosql", "documentdb"],
  docker: ["docker", "containerization", "containers", "docker-compose", "kubernetes", "k8s"],
  kubernetes: ["kubernetes", "k8s", "docker", "devops"],
  aws: ["aws", "amazon web services", "cloud", "ec2", "s3", "lambda"],
  git: ["git", "github", "gitlab", "version control"],
  golang: ["golang", "go"],
  "c++": ["c++", "cpp", "c/c++"],
  java: ["java", "spring", "spring boot"],
  graphql: ["graphql", "apollo", "rest apis", "api"],
  tailwind: ["tailwind", "tailwindcss", "css", "css3"],
  redis: ["redis", "caching", "in-memory"],
};

function normalizeSkill(s: string): string {
  return s.toLowerCase().trim().replace(/[\s\-_]+/g, "");
}

function skillMatchesCandidate(targetSkill: string, candidateSkillsSet: Set<string>, candidateText?: string): boolean {
  const normTarget = normalizeSkill(targetSkill);
  if (candidateSkillsSet.has(normTarget)) return true;

  // Check synonym map
  const lowerTarget = targetSkill.toLowerCase().trim();
  const synonyms = SYNONYM_MAP[lowerTarget] || [];
  for (const syn of synonyms) {
    if (candidateSkillsSet.has(normalizeSkill(syn))) return true;
  }

  // If candidate text is provided, perform case-insensitive word boundary check
  if (candidateText) {
    const escaped = targetSkill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(candidateText)) return true;
  }

  return false;
}

/**
 * Privacy-First, Zero-Egress Client-Side ATS Match Engine
 * Compliant with Digital Personal Data Protection (DPDP) Act 2023.
 * Runs 100% in-browser with sub-millisecond execution and zero external telemetry.
 */
export function computeClientAtsMatch(
  candidateSkills: string[],
  requiredSkills: string[],
  options?: {
    resumeText?: string;
    jobTitle?: string;
    experienceYears?: number;
    requiredExperienceYears?: number;
  }
): ClientAtsResult {
  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

  const candidateSkillsSet = new Set(candidateSkills.map(normalizeSkill));
  const candidateText = options?.resumeText || "";

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const remediations: ClientAtsRemediation[] = [];

  for (const reqSkill of requiredSkills) {
    if (skillMatchesCandidate(reqSkill, candidateSkillsSet, candidateText)) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
      const guide = getLearningGuideForSkill(reqSkill.toLowerCase().trim());
      if (guide) {
        remediations.push({
          skill: reqSkill,
          roadmapSlug: guide.roadmapSlug,
          title: guide.resource?.title || guide.roadmapSlug,
        });
      }
    }
  }

  // Calculate Weighted ATS Score (0 - 100)
  let rawScore = 0;
  if (requiredSkills.length === 0) {
    rawScore = candidateSkills.length > 0 ? 85 : 50;
  } else {
    const matchRatio = matchedSkills.length / requiredSkills.length;
    // Base skill match accounts for up to 80 points
    const skillPoints = Math.round(matchRatio * 80);

    // Experience alignment accounts for up to 20 points
    let expPoints = 20;
    const reqExp = options?.requiredExperienceYears ?? 0;
    const candExp = options?.experienceYears ?? 0;
    if (reqExp > 0) {
      if (candExp >= reqExp) {
        expPoints = 20;
      } else {
        expPoints = Math.max(5, Math.round((candExp / reqExp) * 20));
      }
    }

    rawScore = Math.min(100, skillPoints + expPoints);
  }

  const strengths: string[] = [];
  if (matchedSkills.length > 0) {
    strengths.push(`Matches ${matchedSkills.length} core technical requirements (${matchedSkills.slice(0, 3).join(", ")})`);
  }
  if (missingSkills.length === 0 && requiredSkills.length > 0) {
    strengths.push("100% stack coverage across all requested competencies.");
  }
  if (options?.experienceYears && options.experienceYears >= (options.requiredExperienceYears || 0)) {
    strengths.push("Experience tenure meets or exceeds employer target band.");
  }

  const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const executionTimeMs = Math.round((endTime - startTime) * 100) / 100;

  return {
    matchScore: rawScore,
    matchedSkills,
    missingSkills,
    strengths,
    remediations,
    privacyGuarantee: {
      isClientSideOnly: true,
      dpdpCompliant: true,
      zeroEgress: true,
      executionTimeMs,
    },
  };
}
