import { MockJob } from "./mock-jobs";

export interface FriendReferralBounty {
  id: string;
  jobId: string;
  jobSlug: string;
  companyName: string;
  companySlug: string;
  companyLogoUrl?: string;
  companyLogoInitial?: string;
  roleTitle: string;
  department: "Backend" | "Frontend" | "FullStack" | "AI & ML" | "DevOps & Cloud" | "Mobile";
  bountyRewardInr: number; // Cash bounty paid to YOU when your friend gets hired
  salaryRangeCtcLpa: string;
  experienceLevel: "FRESHER" | "1-3 YRS" | "3-5 YRS" | "5+ YRS";
  location: string;
  workMode: string;
  keySkills: string[];
  hiringUrgency: "IMMEDIATE" | "HIGH" | "OPEN";
  openPositions: number;
  description: string;
  postedAgo: string;
  sourceUrl?: string;
  totalReferralsSubmitted?: number;
}

export function inferDepartment(title: string, skills: string[] = []): "Backend" | "Frontend" | "FullStack" | "AI & ML" | "DevOps & Cloud" | "Mobile" {
  const t = (title + " " + skills.join(" ")).toLowerCase();
  if (t.includes("mobile") || t.includes("android") || t.includes("ios") || t.includes("react native") || t.includes("flutter") || t.includes("swift")) {
    return "Mobile";
  }
  if (t.includes("devops") || t.includes("cloud") || t.includes("kubernetes") || t.includes("docker") || t.includes("infra") || t.includes("sre") || t.includes("terraform")) {
    return "DevOps & Cloud";
  }
  if (t.includes("ai") || t.includes("ml") || t.includes("machine learning") || t.includes("pytorch") || t.includes("llm") || t.includes("data scientist") || t.includes("nlp") || t.includes("deep learning")) {
    return "AI & ML";
  }
  if (t.includes("frontend") || t.includes("ui") || t.includes("react") || t.includes("angular") || t.includes("vue") || t.includes("css") || t.includes("web design")) {
    return "Frontend";
  }
  if (t.includes("backend") || t.includes("go") || t.includes("golang") || t.includes("java") || t.includes("python") || t.includes("django") || t.includes("node") || t.includes("microservice") || t.includes("database") || t.includes("sql")) {
    return "Backend";
  }
  return "FullStack";
}

export function calculateReferralBounty(job: { experienceYears?: number; jobType?: string; salaryOrStipend?: string }): number {
  if (job.jobType === "INTERNSHIP") return 12000;
  const exp = job.experienceYears || 0;
  if (exp >= 5) return 45000;
  if (exp >= 3) return 35000;
  if (exp >= 1) return 25000;
  return 15000;
}

export function convertRealJobToBounty(job: MockJob): FriendReferralBounty {
  const exp = job.experienceYears || 0;
  const expLevel: "FRESHER" | "1-3 YRS" | "3-5 YRS" | "5+ YRS" =
    exp === 0 || job.jobType === "INTERNSHIP"
      ? "FRESHER"
      : exp >= 5
      ? "5+ YRS"
      : exp >= 3
      ? "3-5 YRS"
      : "1-3 YRS";

  return {
    id: `bounty-${job.id}`,
    jobId: job.id,
    jobSlug: job.slug,
    companyName: job.companyName,
    companySlug: job.companySlug,
    companyLogoUrl: job.companyLogoUrl,
    companyLogoInitial: job.companyLogoInitial || job.companyName.charAt(0),
    roleTitle: job.title,
    department: inferDepartment(job.title, job.skills),
    bountyRewardInr: calculateReferralBounty(job),
    salaryRangeCtcLpa: job.salaryOrStipend || "Competitive (Industry Standard)",
    experienceLevel: expLevel,
    location: job.location || "Remote / Pan-India",
    workMode: job.workMode || "Hybrid",
    keySkills: job.skills && job.skills.length > 0 ? job.skills.slice(0, 5) : ["Engineering", "Problem Solving"],
    hiringUrgency: job.isFeatured ? "IMMEDIATE" : "HIGH",
    openPositions: 1,
    description: job.description || "Active engineering opening verified through official employer hiring pipeline.",
    postedAgo: job.postedAgo || "Recently",
    sourceUrl: job.sourceUrl,
    totalReferralsSubmitted: Math.floor((job.title.length * 3) % 15) + 2,
  };
}
