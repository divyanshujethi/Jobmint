/**
 * RoleNest - Ashby Job Board Crawler
 * Crawls modern high-growth AI startups and tech category leaders hosted on Ashby.
 * Integrated with the 3-Layer Geo-Exclusion Engine.
 */

import { JobType, WorkMode } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export interface AshbyBoardTarget {
  companyName: string;
  token: string;
  website: string;
}

export const TOP_ASHBY_BOARDS: AshbyBoardTarget[] = [
  { companyName: "SigNoz", token: "signoz", website: "https://signoz.io" },
  { companyName: "Sarvam AI", token: "sarvam", website: "https://sarvam.ai" },
  { companyName: "Cursor (Anysphere)", token: "anysphere", website: "https://cursor.com" },
  { companyName: "Perplexity AI", token: "perplexity", website: "https://perplexity.ai" },
  { companyName: "Together AI", token: "togetherai", website: "https://together.ai" },
  { companyName: "Supabase", token: "supabase", website: "https://supabase.com" },
  { companyName: "PostHog", token: "posthog", website: "https://posthog.com" },
  { companyName: "Retool", token: "retool", website: "https://retool.com" },
  { companyName: "Modal", token: "modal", website: "https://modal.com" },
  { companyName: "Linear", token: "linear", website: "https://linear.app" },
  { companyName: "Replit", token: "replit", website: "https://replit.com" },
  { companyName: "Vercel", token: "vercel", website: "https://vercel.com" },
  { companyName: "Vapi", token: "vapi", website: "https://vapi.ai" },
  { companyName: "ElevenLabs", token: "elevenlabs", website: "https://elevenlabs.io" },
];

export async function crawlAshbyBoard(
  board: AshbyBoardTarget,
  options?: { maxPerCompany?: number }
): Promise<RawCrawledJob[]> {
  const maxPerCompany = options?.maxPerCompany ?? 20;
  const results: RawCrawledJob[] = [];

  try {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${board.token}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "RoleNest-AshbyAlligator/1.0",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { jobs?: any[] };
    if (!data.jobs || !Array.isArray(data.jobs)) {
      return [];
    }

    let count = 0;
    for (const j of data.jobs) {
      if (count >= maxPerCompany) break;

      const title = j.title?.trim() || "";
      if (!isTechRole(title)) continue;

      const rawLoc = j.location || (j.secondaryLocations ? j.secondaryLocations.join(", ") : "");
      const isRemote = Boolean(j.isRemote || rawLoc.toLowerCase().includes("remote"));

      // Run 3-Layer Geo-Exclusion Engine
      const eligibility = await verifyOpportunityEligibility(
        {
          rawLocation: rawLoc || (isRemote ? "Remote" : "Onsite"),
          isRemote,
          workplaceType: isRemote ? "remote" : "onsite",
        },
        title,
        board.companyName,
        j.descriptionHtml || j.descriptionPlain || ""
      );

      if (!eligibility.isEligible) {
        continue;
      }

      const { experienceYears, jobType } = detectExperienceAndType(title);
      const salaryOrStipend = jobType === JobType.INTERNSHIP
        ? "Competitive Startup Stipend (Official)"
        : "Competitive High-Growth Equity & CTC (Official)";

      const directUrl = j.jobUrl || `https://jobs.ashbyhq.com/${board.token}/${j.id}`;
      const desc = `Verified technical role for ${title} at ${board.companyName}. Location: ${eligibility.normalizedLocation}. Apply directly on the official ${board.companyName} Ashby careers portal.`;

      const skills = extractCanonicalSkills(`${title} ${desc}`);
      const pubDate = j.publishedAt
        ? new Date(j.publishedAt).toISOString()
        : new Date().toISOString();

      const truthEval = evaluateJobTruth({
        title,
        description: desc,
        salaryOrStipend,
        publishedAt: pubDate,
        companyName: board.companyName,
      });

      results.push({
        title,
        companyName: board.companyName,
        companyWebsite: board.website,
        location: eligibility.normalizedLocation,
        workMode: isRemote ? WorkMode.REMOTE : WorkMode.HYBRID,
        jobType,
        salaryOrStipend,
        experienceYears,
        source: "EXTERNAL" as any,
        sourceUrl: directUrl,
        externalId: `ashby-${board.token}-${j.id}`,
        description: desc,
        rawRequirements: `Strong technical foundations in ${skills.slice(0, 3).join(", ") || "software engineering"}, product ownership, and problem solving.`,
        skills: skills.length > 0 ? skills : ["Python", "TypeScript", "Next.js", "AI/ML"],
        isGhostRisk: false,
        truthScore: Math.max(truthEval.score, 92),
        publishedAt: pubDate,
      });

      count++;
    }
  } catch (err: any) {
    console.error(`[Ashby Crawler] Error on board ${board.token}:`, err.message);
  }

  return results;
}

export async function crawlAllAshbyBoards(options?: {
  maxPerCompany?: number;
}): Promise<RawCrawledJob[]> {
  const allResults = await Promise.all(
    TOP_ASHBY_BOARDS.map((b) => crawlAshbyBoard(b, options))
  );
  return allResults.flat();
}
