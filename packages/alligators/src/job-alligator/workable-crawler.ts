/**
 * RoleNest - Workable Public ATS Fast Crawler
 * Queries public JSON endpoints of tech organizations utilizing Workable.
 * Extracts authentic, verified positions with zero recruiter markup and direct apply links.
 */

import { JobType, WorkMode, JobSource } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export const WORKABLE_COMPANIES = [
  { slug: "skroutz", name: "Skroutz" },
  { slug: "pleo", name: "Pleo" },
  { slug: "personio", name: "Personio" },
  { slug: "taxfix", name: "Taxfix" },
  { slug: "tidal", name: "Tidal Music" },
  { slug: "omio", name: "Omio Travel" },
  { slug: "vinted", name: "Vinted" },
  { slug: "chargebee", name: "Chargebee" },
  { slug: "invideo", name: "InVideo AI" },
  { slug: "browserstack", name: "BrowserStack" },
  { slug: "clevertap", name: "CleverTap" },
];

export async function crawlWorkableJobs(options?: {
  companies?: Array<{ slug: string; name: string }>;
  limit?: number;
}): Promise<RawCrawledJob[]> {
  const companies = options?.companies ?? WORKABLE_COMPANIES;
  const limit = options?.limit ?? 500;
  const results: RawCrawledJob[] = [];

  for (const comp of companies) {
    if (results.length >= limit) break;

    try {
      const url = `https://apply.workable.com/api/v3/accounts/${comp.slug}/jobs`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "RoleNest-Alligator/1.0 (Mozilla/5.0 compatible)",
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) continue;

      const data = await res.json();
      if (!data || !Array.isArray(data.results)) continue;

      for (const item of data.results) {
        if (results.length >= limit) break;

        const title = (item.title || "").trim();
        if (!title || !isTechRole(title)) continue;

        const isRemote = Boolean(item.remote) || item.workplace === "remote";
        const city = item.location?.city || "";
        const region = item.location?.region || "";
        const countryCode = (item.location?.countryCode || "").toUpperCase();

        const isIndia =
          countryCode === "IN" ||
          city.toLowerCase().includes("india") ||
          region.toLowerCase().includes("india") ||
          (item.location?.country || "").toLowerCase().includes("india");

        // We accept roles if located in India or 100% remote open globally
        if (!isIndia && !isRemote) continue;

        const locStr = isIndia
          ? `${city ? city + ", " : ""}${region ? region + ", " : ""}India`
          : "Remote (Worldwide)";

        const geoCheck = await verifyOpportunityEligibility(
          { rawLocation: locStr, countryCode: isIndia ? "IN" : undefined },
          title,
          comp.name,
          title
        );
        if (!geoCheck.isEligible) continue;

        const directApplyUrl = `https://apply.workable.com/${comp.slug}/j/${item.shortcode}/`;
        const expInfo = detectExperienceAndType(title);
        const skills = extractCanonicalSkills(`${title} ${comp.name}`);

        const truth = evaluateJobTruth({
          title,
          companyName: comp.name,
          description: `${title} at ${comp.name}. Direct verified career posting on Workable ATS.`,
          salaryOrStipend: "Competitive (Industry Standard)",
          publishedAt: item.published || new Date().toISOString(),
        });

        results.push({
          title,
          companyName: comp.name,
          location: isRemote ? "Remote, India" : locStr,
          workMode: isRemote ? WorkMode.REMOTE : WorkMode.ON_SITE,
          jobType: expInfo.jobType,
          salaryOrStipend: "Competitive (Industry Standard)",
          experienceYears: expInfo.experienceYears,
          skills,
          description: `${title} role open at ${comp.name}. Direct candidates apply without intermediary agent markup.`,
          source: JobSource.EXTERNAL,
          sourceUrl: directApplyUrl,
          externalId: `workable-${comp.slug}-${item.shortcode}`,
          isGhostRisk: false,
          truthScore: truth.score,
          publishedAt: item.published || new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.warn(`[Workable Crawler] Error fetching ${comp.name}:`, err.message);
    }
  }

  return results;
}
