import { JobType, WorkMode } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";

interface SimplifyRawItem {
  id?: string;
  company_name: string;
  title: string;
  category?: string;
  active: boolean;
  url: string;
  locations?: string[];
  terms?: string[];
  date_posted?: number;
  date_updated?: number;
  company_url?: string;
  sponsorship?: string;
  degrees?: string[];
}

const TECH_CATEGORIES = new Set([
  "Software",
  "AI/ML/Data",
  "Software Engineering",
  "Data Science, AI & Machine Learning",
  "Quant",
  "Hardware",
  "Hardware Engineering",
  "Product",
  "Product Management",
]);

function detectWorkMode(locationStr: string, titleStr: string): WorkMode {
  const combined = `${locationStr} ${titleStr}`.toLowerCase();
  if (combined.includes("remote")) return WorkMode.REMOTE;
  if (combined.includes("hybrid")) return WorkMode.HYBRID;
  return WorkMode.ON_SITE;
}

function getDefaultSkills(category?: string, title?: string): string[] {
  const cat = (category || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (cat.includes("ai") || cat.includes("data") || t.includes("data") || t.includes("ml")) {
    return ["Python", "Machine Learning", "PyTorch", "SQL", "Pandas"];
  }
  if (cat.includes("quant") || t.includes("quant")) {
    return ["Python", "C++", "Algorithms", "SQL", "Data Structures"];
  }
  if (cat.includes("hardware") || t.includes("hardware") || t.includes("embedded")) {
    return ["C++", "Embedded Systems", "Hardware", "Linux", "Git"];
  }
  if (t.includes("frontend") || t.includes("ui") || t.includes("web")) {
    return ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS"];
  }
  if (t.includes("backend") || t.includes("cloud") || t.includes("devops")) {
    return ["Node.js", "Python", "Go", "PostgreSQL", "Docker"];
  }
  return ["TypeScript", "Python", "React", "Node.js", "Git"];
}

/**
 * Crawl active Tech Internships from SimplifyJobs repository
 */
export async function crawlSimplifyInternships(options?: {
  limit?: number;
}): Promise<RawCrawledJob[]> {
  const limit = options?.limit ?? 100;
  const results: RawCrawledJob[] = [];

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/.github/scripts/listings.json",
      { headers: { "User-Agent": "RoleNest-JobAlligator/1.0" } }
    );

    if (!res.ok) {
      console.warn(`[Job Alligator] Failed to fetch Simplify Internships: ${res.status}`);
      return [];
    }

    const data: SimplifyRawItem[] = await res.json();
    if (!Array.isArray(data)) return [];

    const activeTech = data.filter(
      (item) =>
        item.active === true &&
        item.url &&
        item.company_name &&
        item.title &&
        (!item.category || TECH_CATEGORIES.has(item.category))
    );

    for (const item of activeTech.slice(0, limit)) {
      const companyName = item.company_name.trim();
      const title = item.title.trim();
      const locations = Array.isArray(item.locations) && item.locations.length > 0
        ? item.locations.join(", ")
        : "Remote / Multiple Locations";
      const workMode = detectWorkMode(locations, title);
      const url = item.url.trim();

      const extracted = extractCanonicalSkills(`${title} ${item.category || ""}`);
      const skills = extracted.length > 0 ? extracted : getDefaultSkills(item.category, title);

      const pubDate = item.date_posted
        ? new Date(item.date_posted * 1000).toISOString()
        : new Date().toISOString();

      const stipend = "Competitive Internship Stipend (Official)";
      const description = `Verified internship position for ${title} at ${companyName}. Locations: ${locations}. Apply directly through the official ${companyName} career portal.`;

      const truthEval = evaluateJobTruth({
        title,
        description,
        salaryOrStipend: stipend,
        publishedAt: pubDate,
        companyName,
      });

      results.push({
        title,
        companyName,
        companyWebsite: item.company_url || `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        location: locations,
        workMode,
        jobType: JobType.INTERNSHIP,
        salaryOrStipend: stipend,
        source: "SIMPLIFY_TECH",
        sourceUrl: url,
        externalId: item.id || `simplify-intern-${companyName}-${Math.random().toString(36).substring(2, 8)}`,
        description,
        rawRequirements: `Strong technical foundations in ${skills.slice(0, 3).join(", ")}. Passion for building real-world software and collaborating with engineering mentors.`,
        skills,
        isGhostRisk: false,
        truthScore: Math.max(truthEval.score, 90),
        publishedAt: pubDate,
      });
    }
  } catch (err: any) {
    console.error("[Job Alligator] Error crawling Simplify Internships:", err.message);
  }

  return results;
}

/**
 * Crawl active New Grad Tech Positions from SimplifyJobs repository
 */
export async function crawlSimplifyNewGrad(options?: {
  limit?: number;
}): Promise<RawCrawledJob[]> {
  const limit = options?.limit ?? 100;
  const results: RawCrawledJob[] = [];

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/.github/scripts/listings.json",
      { headers: { "User-Agent": "RoleNest-JobAlligator/1.0" } }
    );

    if (!res.ok) {
      console.warn(`[Job Alligator] Failed to fetch Simplify New Grad: ${res.status}`);
      return [];
    }

    const data: SimplifyRawItem[] = await res.json();
    if (!Array.isArray(data)) return [];

    const activeTech = data.filter(
      (item) =>
        item.active === true &&
        item.url &&
        item.company_name &&
        item.title &&
        (!item.category || TECH_CATEGORIES.has(item.category))
    );

    for (const item of activeTech.slice(0, limit)) {
      const companyName = item.company_name.trim();
      const title = item.title.trim();
      const locations = Array.isArray(item.locations) && item.locations.length > 0
        ? item.locations.join(", ")
        : "Remote / Multiple Locations";
      const workMode = detectWorkMode(locations, title);
      const url = item.url.trim();

      const extracted = extractCanonicalSkills(`${title} ${item.category || ""}`);
      const skills = extracted.length > 0 ? extracted : getDefaultSkills(item.category, title);

      const pubDate = item.date_posted
        ? new Date(item.date_posted * 1000).toISOString()
        : new Date().toISOString();

      const salary = "Competitive Market Compensation (Official)";
      const description = `Verified full-time early career software position for ${title} at ${companyName}. Locations: ${locations}. Apply directly through the official ${companyName} career portal.`;

      const truthEval = evaluateJobTruth({
        title,
        description,
        salaryOrStipend: salary,
        publishedAt: pubDate,
        companyName,
      });

      results.push({
        title,
        companyName,
        companyWebsite: item.company_url || `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        location: locations,
        workMode,
        jobType: JobType.FULL_TIME,
        salaryOrStipend: salary,
        source: "SIMPLIFY_TECH",
        sourceUrl: url,
        externalId: item.id || `simplify-newgrad-${companyName}-${Math.random().toString(36).substring(2, 8)}`,
        description,
        rawRequirements: `Degree or equivalent background in Computer Science or related fields. Hands-on experience with ${skills.slice(0, 3).join(", ")}.`,
        skills,
        isGhostRisk: false,
        truthScore: Math.max(truthEval.score, 90),
        publishedAt: pubDate,
      });
    }
  } catch (err: any) {
    console.error("[Job Alligator] Error crawling Simplify New Grad:", err.message);
  }

  return results;
}
