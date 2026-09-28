import { MockJob } from "./mock-jobs";
import { WorkMode, JobType } from "@repo/shared";

export interface CandidateIntelProfile {
  skills: string[];
  targetRole: string; // e.g. "All Roles", "Frontend", "Backend", "Full Stack", "AI / ML", "DevOps & Cloud", "Mobile"
  experienceLevel: "FRESHER" | "1-2" | "3-5" | "5+" | "ALL";
  workMode: "ALL" | "REMOTE" | "HYBRID" | "ON_SITE";
  location: string; // "ALL", "bengaluru", "tricity", "delhi_ncr", "remote", etc.
}

export interface JobIntelScore {
  totalScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  roleMatch: boolean;
  expMatch: boolean;
  locationMatch: boolean;
  tier: "TOP" | "HIGH" | "GOOD" | "LOW";
  badgeLabel: string;
  summary: string;
}

export interface CompanyJobGroup {
  companyName: string;
  companySlug: string;
  companyLogoUrl?: string;
  companyLogoInitial: string;
  isVerified: boolean;
  totalRoles: number;
  locations: string[];
  workModes: string[];
  uniqueSkills: string[];
  highestMatch: number;
  jobs: MockJob[];
}

export const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Python",
  "JavaScript",
  "SQL",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "Java",
  "Go",
  "PostgreSQL",
  "MongoDB",
  "FastAPI",
  "Git",
  "Express",
  "C++",
  "GraphQL",
  "Kubernetes",
  "Linux",
  "Rust",
];

export const STACK_PRESETS: { name: string; icon: string; skills: string[]; role: string }[] = [
  {
    name: "Full Stack (MERN)",
    icon: "⚛️",
    skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    role: "Full Stack",
  },
  {
    name: "Python & AI/ML",
    icon: "🐍",
    skills: ["Python", "FastAPI", "SQL", "Docker", "Git"],
    role: "AI / ML",
  },
  {
    name: "Next.js & Frontend",
    icon: "🌐",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript"],
    role: "Frontend",
  },
  {
    name: "Java Enterprise",
    icon: "☕",
    skills: ["Java", "SQL", "AWS", "Docker", "Git"],
    role: "Backend",
  },
  {
    name: "Cloud & DevOps",
    icon: "☁️",
    skills: ["Docker", "Kubernetes", "AWS", "Linux", "Git"],
    role: "DevOps & Cloud",
  },
  {
    name: "Fresher / College",
    icon: "🎓",
    skills: ["Python", "JavaScript", "React", "SQL", "Git"],
    role: "All Roles",
  },
];

export const ROLE_OPTIONS = [
  "All Roles",
  "Frontend",
  "Backend",
  "Full Stack",
  "AI / ML",
  "DevOps & Cloud",
  "Mobile",
  "Data Engineer",
];

export const DEFAULT_INTEL_PROFILE: CandidateIntelProfile = {
  skills: ["React", "TypeScript", "Next.js", "Python", "Node.js"],
  targetRole: "All Roles",
  experienceLevel: "FRESHER",
  workMode: "ALL",
  location: "ALL",
};

const STORAGE_KEY = "rolenest_candidate_intel";

export function loadCandidateIntel(): CandidateIntelProfile {
  if (typeof window === "undefined") {
    return DEFAULT_INTEL_PROFILE;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.skills) && parsed.skills.length > 0) {
        return {
          skills: parsed.skills,
          targetRole: parsed.targetRole || "All Roles",
          experienceLevel: parsed.experienceLevel || "FRESHER",
          workMode: parsed.workMode || "ALL",
          location: parsed.location || "ALL",
        };
      }
    }

    // Check fallback dev score
    const savedDev = localStorage.getItem("jobmint_verified_dev_score");
    if (savedDev) {
      const parsed = JSON.parse(savedDev);
      if (Array.isArray(parsed.verifiedSkills) && parsed.verifiedSkills.length > 0) {
        return {
          ...DEFAULT_INTEL_PROFILE,
          skills: parsed.verifiedSkills,
        };
      }
    }

    // Check candidate skills
    const savedSkills = localStorage.getItem("jobmint_candidate_skills");
    if (savedSkills) {
      const parsed = JSON.parse(savedSkills);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          ...DEFAULT_INTEL_PROFILE,
          skills: parsed,
        };
      }
    }
  } catch {}

  return DEFAULT_INTEL_PROFILE;
}

export function saveCandidateIntel(profile: CandidateIntelProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem("jobmint_candidate_skills", JSON.stringify(profile.skills));
  } catch {}
}

/**
 * Deterministic multi-factor candidate intelligence matching engine.
 * Computes:
 * - Skill match (45% weight)
 * - Role / Title match (25% weight)
 * - Experience match (15% weight)
 * - Location & Work Mode match (15% weight)
 */
export function scoreJobForCandidate(
  job: MockJob,
  candidate: CandidateIntelProfile
): JobIntelScore {
  const candidateSkillsSet = new Set(candidate.skills.map((s) => s.toLowerCase().trim()));
  const jobSkillsList = (job.skills || []).map((s) => s.trim());
  const jobTitleLower = (job.title || "").toLowerCase();
  const descLower = (job.description || "").toLowerCase();

  // 1. Skill Overlap (0 - 45 pts)
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const s of jobSkillsList) {
    const sLower = s.toLowerCase();
    if (candidateSkillsSet.has(sLower)) {
      matchedSkills.push(s);
    } else {
      missingSkills.push(s);
    }
  }

  // Also check if candidate skills appear in job description/requirements
  for (const cSkill of candidate.skills) {
    const cLower = cSkill.toLowerCase();
    if (!matchedSkills.some((m) => m.toLowerCase() === cLower)) {
      if (descLower.includes(cLower) || jobTitleLower.includes(cLower)) {
        matchedSkills.push(cSkill);
      }
    }
  }

  let skillsScore = 20; // baseline
  if (jobSkillsList.length > 0) {
    const ratio = Math.min(1, matchedSkills.length / Math.max(1, jobSkillsList.length));
    skillsScore = Math.round(ratio * 45);
    // Bonus for matching multiple candidate skills
    if (matchedSkills.length >= 3) {
      skillsScore = Math.min(45, skillsScore + 5);
    }
  } else if (matchedSkills.length > 0) {
    skillsScore = Math.min(45, matchedSkills.length * 15);
  }

  // 2. Role Alignment (0 - 25 pts)
  let roleMatch = true;
  let roleScore = 20;
  if (candidate.targetRole && candidate.targetRole !== "All Roles") {
    const target = candidate.targetRole.toLowerCase();
    if (target.includes("frontend")) {
      roleMatch = jobTitleLower.includes("front") || jobTitleLower.includes("ui") || jobTitleLower.includes("react");
    } else if (target.includes("backend")) {
      roleMatch = jobTitleLower.includes("back") || jobTitleLower.includes("api") || jobTitleLower.includes("server") || jobTitleLower.includes("node") || jobTitleLower.includes("python") || jobTitleLower.includes("java");
    } else if (target.includes("full stack")) {
      roleMatch = jobTitleLower.includes("full") || jobTitleLower.includes("stack") || jobTitleLower.includes("software engineer");
    } else if (target.includes("ai") || target.includes("ml")) {
      roleMatch = jobTitleLower.includes("ai") || jobTitleLower.includes("machine") || jobTitleLower.includes("data") || jobTitleLower.includes("ml") || jobTitleLower.includes("llm");
    } else if (target.includes("devops") || target.includes("cloud")) {
      roleMatch = jobTitleLower.includes("devops") || jobTitleLower.includes("cloud") || jobTitleLower.includes("sre") || jobTitleLower.includes("infra");
    } else if (target.includes("mobile")) {
      roleMatch = jobTitleLower.includes("mobile") || jobTitleLower.includes("android") || jobTitleLower.includes("ios") || jobTitleLower.includes("flutter");
    } else {
      roleMatch = jobTitleLower.includes(target);
    }
    roleScore = roleMatch ? 25 : 8;
  }

  // 3. Experience Match (0 - 15 pts)
  let expMatch = true;
  let expScore = 15;
  const jobExp = job.experienceYears ?? 0;
  if (candidate.experienceLevel === "FRESHER") {
    if (jobExp === 0 || job.jobType === JobType.INTERNSHIP) {
      expScore = 15;
      expMatch = true;
    } else if (jobExp <= 1) {
      expScore = 12;
      expMatch = true;
    } else {
      expScore = Math.max(4, 15 - jobExp * 3);
      expMatch = false;
    }
  } else if (candidate.experienceLevel === "1-2") {
    expMatch = jobExp <= 2;
    expScore = expMatch ? 15 : 8;
  } else if (candidate.experienceLevel === "3-5") {
    expMatch = jobExp >= 2 && jobExp <= 5;
    expScore = expMatch ? 15 : 10;
  } else if (candidate.experienceLevel === "5+") {
    expMatch = jobExp >= 4;
    expScore = expMatch ? 15 : 10;
  }

  // 4. Location & Work Mode (0 - 15 pts)
  let locationMatch = true;
  let locScore = 15;
  const isRemote = (job.workMode || "").toUpperCase().includes("REMOTE");
  const jobLoc = (job.location || "").toLowerCase();

  if (candidate.workMode && candidate.workMode !== "ALL") {
    const jobMode = (job.workMode || "").toUpperCase();
    if (candidate.workMode === "REMOTE" && !jobMode.includes("REMOTE")) {
      locScore -= 5;
    }
  }

  if (candidate.location && candidate.location !== "ALL") {
    const candLoc = candidate.location.toLowerCase();
    const cityMatch = isRemote || jobLoc.includes(candLoc) || (candLoc === "tricity" && (jobLoc.includes("chandigarh") || jobLoc.includes("mohali")));
    if (!cityMatch) {
      locScore -= 4;
      locationMatch = false;
    }
  }
  locScore = Math.max(5, locScore);

  // Total Score (0 - 100)
  const totalScore = Math.min(100, Math.max(35, skillsScore + roleScore + expScore + locScore));

  let tier: "TOP" | "HIGH" | "GOOD" | "LOW" = "LOW";
  let badgeLabel = `${totalScore}% Match`;

  if (totalScore >= 85) {
    tier = "TOP";
    badgeLabel = `🔥 ${totalScore}% Match`;
  } else if (totalScore >= 70) {
    tier = "HIGH";
    badgeLabel = `⭐ ${totalScore}% Match`;
  } else if (totalScore >= 55) {
    tier = "GOOD";
    badgeLabel = `✨ ${totalScore}% Match`;
  } else {
    tier = "LOW";
    badgeLabel = `${totalScore}% Match`;
  }

  let summaryParts: string[] = [];
  if (matchedSkills.length > 0) {
    summaryParts.push(`Matches ${matchedSkills.slice(0, 3).join(", ")}`);
  }
  if (expMatch && candidate.experienceLevel === "FRESHER") {
    summaryParts.push("Fresher friendly");
  }
  if (isRemote) {
    summaryParts.push("Remote");
  }
  const summary = summaryParts.length > 0 ? summaryParts.join(" • ") : "Tech Stack match";

  return {
    totalScore,
    matchedSkills,
    missingSkills,
    roleMatch,
    expMatch,
    locationMatch,
    tier,
    badgeLabel,
    summary,
  };
}

/**
 * Interleave / Round-Robin Diversification.
 * Solves the issue of seeing 20 consecutive posts from GitLab, then 10 from MongoDB.
 * Distributes jobs across companies so users experience a diverse, rich feed on every scroll.
 */
export function interleaveJobsByCompany(jobs: MockJob[]): MockJob[] {
  if (jobs.length <= 2) return jobs;

  // Separate featured jobs to maintain top prominence
  const featured = jobs.filter((j) => j.isFeatured);
  const standard = jobs.filter((j) => !j.isFeatured);

  const interleave = (list: MockJob[]): MockJob[] => {
    const buckets: Record<string, MockJob[]> = {};
    for (const job of list) {
      const key = (job.companyName || "Other").trim();
      if (!buckets[key]) buckets[key] = [];
      buckets[key].push(job);
    }

    const companyKeys = Object.keys(buckets);
    const result: MockJob[] = [];
    let hasMore = true;
    let round = 0;

    while (hasMore) {
      hasMore = false;
      for (const key of companyKeys) {
        const bucket = buckets[key];
        if (round < bucket.length) {
          result.push(bucket[round]);
          if (round + 1 < bucket.length) {
            hasMore = true;
          }
        }
      }
      round++;
    }

    return result;
  };

  return [...interleave(featured), ...interleave(standard)];
}

/**
 * Group jobs by company for the "Group by Company" view mode.
 * Shows company cards with open role counts, locations, and collapsible roles.
 */
export function groupJobsByCompany(
  jobs: MockJob[],
  candidateIntel?: CandidateIntelProfile
): CompanyJobGroup[] {
  const map = new Map<string, MockJob[]>();

  for (const job of jobs) {
    const name = (job.companyName || "Other").trim();
    if (!map.has(name)) {
      map.set(name, []);
    }
    map.get(name)!.push(job);
  }

  const groups: CompanyJobGroup[] = [];

  for (const [companyName, companyJobs] of map.entries()) {
    const firstJob = companyJobs[0];
    const locations = Array.from(new Set(companyJobs.map((j) => j.location).filter(Boolean)));
    const workModes = Array.from(new Set(companyJobs.map((j) => j.workMode).filter(Boolean)));
    const allSkills = Array.from(
      new Set(companyJobs.flatMap((j) => j.skills || []).filter(Boolean))
    );

    let highestMatch = 0;
    if (candidateIntel) {
      for (const j of companyJobs) {
        const score = scoreJobForCandidate(j, candidateIntel).totalScore;
        if (score > highestMatch) highestMatch = score;
      }
    }

    groups.push({
      companyName,
      companySlug: firstJob.companySlug || companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      companyLogoUrl: firstJob.companyLogoUrl,
      companyLogoInitial: firstJob.companyLogoInitial || companyName[0] || "C",
      isVerified: companyJobs.some((j) => j.isVerified),
      totalRoles: companyJobs.length,
      locations,
      workModes,
      uniqueSkills: allSkills.slice(0, 8),
      highestMatch,
      jobs: companyJobs,
    });
  }

  // Sort companies: highest match first if candidate intel exists, otherwise by open roles count
  return groups.sort((a, b) => {
    if (candidateIntel && b.highestMatch !== a.highestMatch) {
      return b.highestMatch - a.highestMatch;
    }
    return b.totalRoles - a.totalRoles;
  });
}
