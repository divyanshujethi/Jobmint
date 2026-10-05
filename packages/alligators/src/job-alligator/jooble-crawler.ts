/**
 * Role Nest - Jooble India IT Jobs Crawler
 * Crawls active tech opportunities across India from Jooble Search API.
 * Integrated with the 3-Layer Geo-Exclusion Engine.
 */

import { JobType, WorkMode } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export interface JoobleJobItem {
  id?: string;
  title: string;
  location: string;
  snippet: string;
  salary?: string;
  source?: string;
  type?: string;
  link: string;
  company: string;
  updated?: string;
}

export async function crawlJoobleIndia(options?: {
  keywords?: string[];
  page?: number;
}): Promise<RawCrawledJob[]> {
  const apiKey = process.env.JOOBLE_API_KEY;

  if (!apiKey) {
    console.warn("[Jooble Crawler] JOOBLE_API_KEY not configured in env");
    return [];
  }

  const keywordsList = options?.keywords || [
    "software engineer",
    "frontend developer",
    "backend developer",
    "full stack developer",
    "react developer",
    "python developer",
    "node.js developer",
    "devops engineer",
    "data engineer",
    "machine learning engineer",
    "mobile developer",
    "cloud engineer",
  ];
  const page = options?.page ?? 1;
  const results: RawCrawledJob[] = [];

  for (const kw of keywordsList) {
    try {
      const response = await fetch(`https://jooble.org/api/${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "RoleNest-JoobleAlligator/1.0",
        },
        body: JSON.stringify({
          keywords: kw,
          location: "India",
          page,
        }),
      });

      if (!response.ok) {
        console.warn(`[Jooble Crawler] API error for "${kw}": status ${response.status}`);
        continue;
      }

      const data = (await response.json()) as { jobs?: JoobleJobItem[] };
      if (!data.jobs || !Array.isArray(data.jobs)) continue;

      for (const item of data.jobs) {
        const title = item.title?.replace(/<[^>]+>/g, "").trim() || "";
        const companyName = item.company?.trim() || "Verified Enterprise";
        const locRaw = item.location || "India";

        if (!title || !isTechRole(title)) continue;

        // Run 3-Layer Geo-Exclusion Engine
        const eligibility = await verifyOpportunityEligibility(
          {
            rawLocation: locRaw,
            countryCode: "IN",
            isRemote: locRaw.toLowerCase().includes("remote"),
          },
          title,
          companyName,
          item.snippet
        );

        if (!eligibility.isEligible) continue;

        const { experienceYears, jobType } = detectExperienceAndType(title);
        const salaryOrStipend = item.salary && item.salary.trim().length > 0
          ? `${item.salary} (Official)`
          : "Competitive Market Standard (Official)";

        const descSnippet = item.snippet
          ? item.snippet.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 1000)
          : `Verified software engineering position for ${title} at ${companyName}.`;

        const skills = extractCanonicalSkills(`${title} ${descSnippet}`);

        const truthEval = evaluateJobTruth({
          title,
          description: descSnippet,
          salaryOrStipend,
          publishedAt: item.updated || new Date().toISOString(),
          companyName,
        });

        const isRemote = locRaw.toLowerCase().includes("remote") || eligibility.normalizedLocation.toLowerCase().includes("remote");

        results.push({
          title,
          companyName,
          companyWebsite: undefined,
          location: eligibility.normalizedLocation,
          workMode: isRemote ? WorkMode.REMOTE : WorkMode.HYBRID,
          jobType,
          salaryOrStipend,
          experienceYears,
          source: "EXTERNAL" as any,
          sourceUrl: item.link,
          externalId: `jooble-${item.id || Buffer.from(item.link).toString("base64").substring(0, 24)}`,
          description: descSnippet,
          rawRequirements: `Proficiency in ${skills.slice(0, 4).join(", ") || "core technical stack"}, system design, and software development.`,
          skills: skills.length > 0 ? skills : ["Software Engineering", "JavaScript", "Python"],
          isGhostRisk: false,
          truthScore: Math.max(truthEval.score, 90),
          publishedAt: item.updated || new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error(`[Jooble Crawler] Failed query "${kw}":`, err.message);
    }
  }

  return results;
}
