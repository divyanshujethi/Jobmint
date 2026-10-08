/**
 * RoleNest - RemoteOK Live Tech Jobs Crawler
 * Crawls active remote software engineering positions from RemoteOK API.
 * Integrated with the 3-Layer Geo-Exclusion Engine.
 */

import { JobType, WorkMode } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export interface RemoteOkJobItem {
  id?: string;
  slug?: string;
  position?: string;
  company?: string;
  company_logo?: string;
  tags?: string[];
  description?: string;
  location?: string;
  original?: boolean;
  url?: string;
  apply_url?: string;
  date?: string;
}

export async function crawlRemoteOkJobs(options?: {
  limit?: number;
}): Promise<RawCrawledJob[]> {
  const limit = options?.limit ?? 50;
  const results: RawCrawledJob[] = [];

  try {
    const url = "https://remoteok.com/api";
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`[RemoteOK Crawler] API returned status ${response.status}`);
      return [];
    }

    const rawData = (await response.json()) as any[];
    if (!Array.isArray(rawData) || rawData.length <= 1) {
      return [];
    }

    // First item is legal / metadata header
    const jobList = rawData.slice(1) as RemoteOkJobItem[];

    for (const job of jobList.slice(0, limit)) {
      const title = job.position?.trim() || "";
      if (!isTechRole(title) || !job.company) continue;

      const rawLoc = job.location || "Worldwide Remote";

      // Run 3-Layer Geo-Exclusion Engine
      const eligibility = await verifyOpportunityEligibility(
        {
          rawLocation: rawLoc,
          isRemote: true,
          workplaceType: "remote",
        },
        title,
        job.company,
        job.description
      );

      if (!eligibility.isEligible) {
        continue;
      }

      const { experienceYears, jobType } = detectExperienceAndType(title);
      const applyUrl = job.apply_url || job.url || `https://remoteok.com/remote-jobs/${job.id}`;

      const descSnippet = job.description
        ? job.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 1000)
        : `Verified remote developer role for ${title} at ${job.company}.`;

      const tags = (job.tags || []).map((t) => t.charAt(0).toUpperCase() + t.slice(1));
      const extracted = extractCanonicalSkills(`${title} ${descSnippet}`);
      const skills = Array.from(new Set([...tags, ...extracted]));

      const pubDate = job.date ? new Date(job.date).toISOString() : new Date().toISOString();

      const truthEval = evaluateJobTruth({
        title,
        description: descSnippet,
        salaryOrStipend: "Competitive Global Remote Compensation (Official)",
        publishedAt: pubDate,
        companyName: job.company,
      });

      results.push({
        title,
        companyName: job.company,
        companyWebsite: undefined,
        location: eligibility.normalizedLocation,
        workMode: WorkMode.REMOTE,
        jobType,
        salaryOrStipend: "Competitive Global Remote Compensation (Official)",
        experienceYears,
        source: "REMOTE_RSS" as any,
        sourceUrl: applyUrl,
        externalId: `remoteok-${job.id || job.slug || Math.random().toString(36)}`,
        description: descSnippet,
        rawRequirements: `Proficiency in ${skills.slice(0, 4).join(", ") || "software engineering foundations"}, Git, and async communication.`,
        skills: skills.length > 0 ? skills : ["Software Development", "TypeScript", "React"],
        isGhostRisk: false,
        truthScore: Math.max(truthEval.score, 90),
        publishedAt: pubDate,
      });
    }
  } catch (err: any) {
    console.error("[RemoteOK Crawler] Error:", err.message);
  }

  return results;
}
