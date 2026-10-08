/**
 * RoleNest - SmartRecruiters & Enterprise ATS Fast Crawler
 * Crawls unauthenticated JSON endpoints of major global and Indian tech employers
 * using SmartRecruiters ATS infrastructure.
 */

import { JobType, WorkMode, JobSource } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export const SMARTRECRUITERS_COMPANIES = [
  { identifier: "BoschGroup", name: "Bosch Global Software Technologies" },
  { identifier: "publicissapient", name: "Publicis Sapient" },
  { identifier: "ubisoft", name: "Ubisoft India" },
  { identifier: "visa", name: "Visa" },
  { identifier: "wolt", name: "Wolt Technologies" },
  { identifier: "datadoghq", name: "Datadog" },
  { identifier: "bazaarvoice", name: "Bazaarvoice" },
  { identifier: "colt", name: "Colt Technology Services" },
  { identifier: "alstom", name: "Alstom Transportation" },
  { identifier: "atos", name: "Atos Syntel" },
  { identifier: "informa", name: "Informa Tech" },
  { identifier: "averydennison", name: "Avery Dennison Digital" },
  { identifier: "SGS", name: "SGS Digital Innovation" },
];

export async function crawlSmartRecruitersJobs(options?: {
  companies?: Array<{ identifier: string; name: string }>;
  limit?: number;
}): Promise<RawCrawledJob[]> {
  const companies = options?.companies ?? SMARTRECRUITERS_COMPANIES;
  const limit = options?.limit ?? 1000;
  const results: RawCrawledJob[] = [];

  for (const comp of companies) {
    if (results.length >= limit) break;

    try {
      const url = `https://api.smartrecruiters.com/v1/companies/${comp.identifier}/postings?limit=100`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "RoleNest-Alligator/1.0 (Mozilla/5.0 compatible)",
          Accept: "application/json",
        },
      });

      if (!res.ok) continue;

      const data = await res.json();
      if (!data || !Array.isArray(data.content)) continue;

      for (const item of data.content) {
        if (results.length >= limit) break;

        const title = (item.name || "").trim();
        if (!title || !isTechRole(title)) continue;

        const city = item.location?.city || "";
        const region = item.location?.region || "";
        const country = (item.location?.country || "").toUpperCase();
        const isRemoteFlag = Boolean(item.location?.remote);

        // Check if role is in India or open to global remote
        const isIndia = country === "IN" || country === "INDIA" || city.toLowerCase().includes("india") || region.toLowerCase().includes("india");
        if (!isIndia && !isRemoteFlag) continue;

        const locStr = isIndia
          ? `${city ? city + ", " : ""}${region ? region + ", " : ""}India`
          : "Remote (Worldwide)";

        // Geo check
        const geoCheck = await verifyOpportunityEligibility(
          { rawLocation: locStr, countryCode: isIndia ? "IN" : undefined },
          title,
          comp.name,
          title
        );
        if (!geoCheck.isEligible) continue;

        const directApplyUrl = `https://jobs.smartrecruiters.com/${comp.identifier}/${item.id}`;
        const expInfo = detectExperienceAndType(title);
        const skills = extractCanonicalSkills(`${title} ${comp.name}`);

        const truth = evaluateJobTruth({
          title,
          companyName: comp.name,
          description: `${title} at ${comp.name}. Official direct posting on SmartRecruiters enterprise talent network.`,
          salaryOrStipend: "Competitive (Industry Standard)",
          publishedAt: item.releasedDate || new Date().toISOString(),
        });

        results.push({
          title,
          companyName: comp.name,
          location: isRemoteFlag ? "Remote, India" : locStr,
          workMode: isRemoteFlag ? WorkMode.REMOTE : WorkMode.ON_SITE,
          jobType: expInfo.jobType,
          salaryOrStipend: "Competitive (Industry Standard)",
          experienceYears: expInfo.experienceYears,
          skills,
          description: `${title} role open at ${comp.name}. Direct application on official company ATS. Verified zero recruiter markup.`,
          source: JobSource.EXTERNAL,
          sourceUrl: directApplyUrl,
          externalId: `sr-${comp.identifier}-${item.id}`,
          isGhostRisk: false,
          truthScore: truth.score,
          publishedAt: item.releasedDate || new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.warn(`[SmartRecruiters Crawler] Error fetching ${comp.name}:`, err.message);
    }
  }

  return results;
}
