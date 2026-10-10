/**
 * RoleNest - Breezy HR Public JSON Feed Crawler
 *
 * Crawls unauthenticated public JSON feeds for tech employers
 * using Breezy HR ATS.
 * Endpoint: https://{company}.breezy.hr/json
 */

import { JobType, WorkMode, JobSource } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType, normalizeIndiaLocation } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export interface BreezyCompanyTarget {
  identifier: string;
  name: string;
}

export const BREEZY_COMPANIES: BreezyCompanyTarget[] = [
  // Add verified Breezy HR employers here as discovered
];

const INDIA_LOC_KEYWORDS = [
  "india",
  "bengaluru",
  "bangalore",
  "mumbai",
  "pune",
  "delhi",
  "noida",
  "gurgaon",
  "gurugram",
  "hyderabad",
  "chennai",
  "remote",
];

export async function crawlBreezyJobs(options?: {
  companies?: BreezyCompanyTarget[];
  limit?: number;
}): Promise<RawCrawledJob[]> {
  const companies = options?.companies ?? BREEZY_COMPANIES;
  const limit = options?.limit ?? 500;
  const results: RawCrawledJob[] = [];

  for (const comp of companies) {
    if (results.length >= limit) break;

    try {
      const url = `https://${comp.identifier}.breezy.hr/json`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "RoleNest-Alligator/1.0 (Mozilla/5.0 compatible)",
          Accept: "application/json",
        },
      });

      if (!res.ok) continue;

      const jobs = (await res.json()) as any[];
      if (!Array.isArray(jobs)) continue;

      for (const item of jobs) {
        if (results.length >= limit) break;

        const title = (item.name || "").trim();
        if (!title || !isTechRole(title)) continue;

        const locName = (item.location?.name || "").toLowerCase();
        const isRemoteFlag = Boolean(item.location?.is_remote);
        const isIndia = INDIA_LOC_KEYWORDS.some((kw) => locName.includes(kw));

        if (!isIndia && !isRemoteFlag) continue;

        const normLoc = normalizeIndiaLocation(locName);
        const finalLocation = isRemoteFlag
          ? "Remote, India"
          : normLoc.location || `${locName}, India`;

        const geoCheck = await verifyOpportunityEligibility(
          { rawLocation: finalLocation, countryCode: isIndia ? "IN" : undefined },
          title,
          comp.name,
          title
        );
        if (!geoCheck.isEligible) continue;

        const expInfo = detectExperienceAndType(title);
        const skills = extractCanonicalSkills(`${title} ${comp.name}`);
        const directUrl = item.url || `https://${comp.identifier}.breezy.hr/p/${item.id}`;

        const truth = evaluateJobTruth({
          title,
          companyName: comp.name,
          description: `${title} role open at ${comp.name}. Direct application on Breezy HR ATS.`,
          salaryOrStipend: "Competitive (Industry Standard)",
          publishedAt: item.published_date || new Date().toISOString(),
        });

        results.push({
          title,
          companyName: comp.name,
          location: finalLocation,
          workMode: isRemoteFlag ? WorkMode.REMOTE : WorkMode.ON_SITE,
          jobType: expInfo.jobType,
          salaryOrStipend: "Competitive (Industry Standard)",
          experienceYears: expInfo.experienceYears,
          skills,
          description: `${title} opportunity at ${comp.name}. Official direct listing on company Breezy HR portal.`,
          source: 'EXTERNAL',
          sourceUrl: directUrl,
          externalId: `breezy-${comp.identifier}-${item.id || item._id}`,
          isGhostRisk: false,
          truthScore: truth.score,
          publishedAt: item.published_date || new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.warn(`[Breezy Crawler] Error crawling ${comp.name}:`, err.message);
    }
  }

  return results;
}
