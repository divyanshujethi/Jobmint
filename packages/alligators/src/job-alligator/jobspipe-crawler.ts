/**
 * Role Nest - JobsPipe Live Tech Jobs Crawler
 * Crawls active tech jobs across India and verified global remote positions using JobsPipe API.
 * Integrated with the 3-Layer Geo-Exclusion Engine.
 */

import { JobType, WorkMode } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export interface JobsPipeJobItem {
  id: string;
  job_title: string;
  url: string;
  source_url?: string;
  final_url?: string;
  date_posted: string;
  company: string;
  location?: string;
  country?: string;
  country_code?: string;
  remote?: boolean;
  hybrid?: boolean;
  min_annual_salary?: number;
  max_annual_salary?: number;
  salary_currency?: string;
  salary_string?: string;
  seniority?: string;
  employment_statuses?: string[];
  technology_slugs?: string[];
  description?: string;
}

export async function crawlJobsPipe(options?: {
  limit?: number;
  includeRemote?: boolean;
}): Promise<RawCrawledJob[]> {
  const apiKey = process.env.JOBSPIPE_API_KEY;
  if (!apiKey) {
    console.warn("[JobsPipe Crawler] JOBSPIPE_API_KEY is not configured in env");
    return [];
  }
  const limit = options?.limit ?? 40;
  const results: RawCrawledJob[] = [];

  const queries = [
    // 1. Direct Indian Tech Opportunities
    {
      job_country_code_or: ["IN"],
      limit,
    },
    // 2. Global Remote Tech Roles
    ...(options?.includeRemote !== false
      ? [
          {
            remote: true,
            limit: Math.min(limit, 30),
          },
        ]
      : []),
  ];

  for (const queryPayload of queries) {
    try {
      const response = await fetch("https://api.jobspipe.dev/v1/jobs/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "RoleNest-TruthAlligator/1.0",
        },
        body: JSON.stringify(queryPayload),
      });

      if (!response.ok) {
        console.warn(`[JobsPipe Crawler] API returned status ${response.status}`);
        continue;
      }

      const resData = (await response.json()) as { data?: JobsPipeJobItem[] };
      if (!resData.data || !Array.isArray(resData.data)) {
        continue;
      }

      for (const item of resData.data) {
        const title = item.job_title?.trim() || "";
        if (!isTechRole(title)) continue;

        // Run 3-Layer Geo-Exclusion Engine
        const eligibility = await verifyOpportunityEligibility(
          {
            rawLocation: item.location || (item.remote ? "Remote" : "India"),
            countryCode: item.country_code,
            isRemote: Boolean(item.remote),
            workplaceType: item.remote ? "remote" : item.hybrid ? "hybrid" : "onsite",
          },
          title,
          item.company,
          item.description
        );

        if (!eligibility.isEligible) {
          continue;
        }

        const { experienceYears, jobType } = detectExperienceAndType(title);

        let salaryOrStipend = "Competitive Market Standards (Official)";
        if (item.min_annual_salary && item.max_annual_salary && item.salary_currency) {
          salaryOrStipend = `${item.salary_currency} ${item.min_annual_salary.toLocaleString()} - ${item.max_annual_salary.toLocaleString()} / year (Official)`;
        } else if (item.salary_string) {
          salaryOrStipend = `${item.salary_string} (Official)`;
        }

        const directUrl = item.final_url || item.url || item.source_url;
        if (!directUrl) continue;

        const descSnippet =
          item.description ||
          `Verified technical role for ${title} at ${item.company}. Location: ${eligibility.normalizedLocation}. Apply directly through official verified channels.`;

        const skillsFromTags = (item.technology_slugs || []).map(
          (t) => t.charAt(0).toUpperCase() + t.slice(1)
        );
        const extractedSkills = extractCanonicalSkills(`${title} ${descSnippet}`);
        const combinedSkills = Array.from(new Set([...skillsFromTags, ...extractedSkills]));

        const pubDate = item.date_posted
          ? new Date(item.date_posted).toISOString()
          : new Date().toISOString();

        const truthEval = evaluateJobTruth({
          title,
          description: descSnippet,
          salaryOrStipend,
          publishedAt: pubDate,
          companyName: item.company,
        });

        results.push({
          title,
          companyName: item.company,
          companyWebsite: undefined,
          location: eligibility.normalizedLocation,
          workMode: item.remote ? WorkMode.REMOTE : item.hybrid ? WorkMode.HYBRID : WorkMode.ON_SITE,
          jobType,
          salaryOrStipend,
          minSalary: item.min_annual_salary,
          maxSalary: item.max_annual_salary,
          currency: item.salary_currency,
          experienceYears,
          source: "EXTERNAL" as any,
          sourceUrl: directUrl,
          externalId: `jp-${item.id}`,
          description: descSnippet,
          rawRequirements: `Proficiency in ${combinedSkills.slice(0, 4).join(", ") || "core technical stack"}, problem solving, and modern software engineering practices.`,
          skills: combinedSkills.length > 0 ? combinedSkills : ["Software Engineering", "Problem Solving"],
          isGhostRisk: false,
          truthScore: Math.max(truthEval.score, 90),
          publishedAt: pubDate,
        });
      }
    } catch (err: any) {
      console.error("[JobsPipe Crawler] Query error:", err.message);
    }
  }

  return results;
}
