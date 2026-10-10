/**
 * RoleNest - Recruitee Public Careers API Crawler
 *
 * Crawls unauthenticated public JSON endpoints for tech employers
 * using Recruitee ATS.
 * Endpoint: https://{company}.recruitee.com/api/offers/
 */

import { JobType, WorkMode, JobSource } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType, normalizeIndiaLocation } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export interface RecruiteeCompanyTarget {
  identifier: string;
  name: string;
}

export const RECRUITEE_COMPANIES: RecruiteeCompanyTarget[] = [
  // Add verified Recruitee employers here as discovered
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

export async function crawlRecruiteeJobs(options?: {
  companies?: RecruiteeCompanyTarget[];
  limit?: number;
}): Promise<RawCrawledJob[]> {
  const companies = options?.companies ?? RECRUITEE_COMPANIES;
  const limit = options?.limit ?? 500;
  const results: RawCrawledJob[] = [];

  for (const comp of companies) {
    if (results.length >= limit) break;

    try {
      const url = `https://${comp.identifier}.recruitee.com/api/offers/`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "RoleNest-Alligator/1.0 (Mozilla/5.0 compatible)",
          Accept: "application/json",
        },
      });

      if (!res.ok) continue;

      const data = (await res.json()) as { offers?: any[] };
      const offers = data.offers || [];

      for (const item of offers) {
        if (results.length >= limit) break;

        const title = (item.title || "").trim();
        if (!title || !isTechRole(title)) continue;

        const locStr = (item.location || "").toLowerCase();
        const country = (item.country_code || item.country || "").toLowerCase();
        const isRemoteFlag = Boolean(item.remote);
        const isIndia = country === "in" || country === "india" || INDIA_LOC_KEYWORDS.some((kw) => locStr.includes(kw));

        if (!isIndia && !isRemoteFlag) continue;

        const normLoc = normalizeIndiaLocation(locStr);
        const finalLocation = isRemoteFlag
          ? "Remote, India"
          : normLoc.location || `${item.location || "India"}`;

        const geoCheck = await verifyOpportunityEligibility(
          { rawLocation: finalLocation, countryCode: isIndia ? "IN" : undefined },
          title,
          comp.name,
          title
        );
        if (!geoCheck.isEligible) continue;

        const expInfo = detectExperienceAndType(title);
        const skills = extractCanonicalSkills(`${title} ${comp.name}`);
        const directUrl = item.careers_url || `https://${comp.identifier}.recruitee.com/o/${item.slug || item.id}`;

        const truth = evaluateJobTruth({
          title,
          companyName: comp.name,
          description: `${title} role open at ${comp.name}. Direct application on Recruitee ATS.`,
          salaryOrStipend: "Competitive (Industry Standard)",
          publishedAt: item.created_at || new Date().toISOString(),
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
          description: `${title} opportunity at ${comp.name}. Official direct listing on company Recruitee portal.`,
          source: 'EXTERNAL',
          sourceUrl: directUrl,
          externalId: `recruitee-${comp.identifier}-${item.id}`,
          isGhostRisk: false,
          truthScore: truth.score,
          publishedAt: item.created_at || new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.warn(`[Recruitee Crawler] Error crawling ${comp.name}:`, err.message);
    }
  }

  return results;
}
