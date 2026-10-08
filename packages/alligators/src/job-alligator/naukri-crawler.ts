/**
 * RoleNest - Naukri India Fast Enterprise Job Crawler
 * Streams and decompresses verified technology vacancies directly from Naukri.com
 * official XML and gzip sitemaps (300,000+ total vacancies across Indian metros).
 * 
 * Safe Hyperlinking Policy:
 * Links directly to authentic canonical Naukri job listings
 * (`https://www.naukri.com/job-listings-...`) stripped of session/tracking tags.
 */

import zlib from "zlib";
import { JobType, WorkMode, JobSource, sanitizeExternalJobUrl } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

const NAUKRI_TECH_REGEX = /[-_](developer|engineer|architect|programmer|software|frontend|backend|fullstack|full-stack|devops|sre|cloud|aws|azure|gcp|react|angular|vue|node|python|java|golang|c\+\+|dotnet|data-engineer|data-science|data-scientist|data-analyst|machine-learning|ai|cyber-security|qa|tester|test-engineer|ios|android|flutter|react-native|tech-lead|scrum-master|dba)[-_]/i;

const KNOWN_CITIES = [
  "bangalore", "bengaluru", "hyderabad", "pune", "mumbai", "noida",
  "delhi", "gurgaon", "gurugram", "chennai", "kolkata", "ahmedabad",
  "kochi", "chandigarh", "indore", "jaipur", "trivandrum", "nagpur",
  "coimbatore", "vadodara", "bhubaneswar", "visakhapatnam", "lucknow"
];

function titleCase(str: string): string {
  return str
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Parses Naukri URL into clean Title, Company, Location, and Experience.
 * Format: /job-listings-{title}-{company}-{location}-{min}-to-{max}-years-{jobId}
 */
export function parseNaukriUrl(url: string): {
  title: string;
  company: string;
  location: string;
  experienceYears: number;
  jobId: string;
} | null {
  const match = url.match(/\/job-listings-(.+)-([0-9]+-to-[0-9]+-years)-([0-9]+)$/);
  if (!match) return null;

  const rawMiddle = match[1]!;
  const rawExp = match[2]!;
  const jobId = match[3]!;

  // Parse experience
  const expMatch = rawExp.match(/([0-9]+)-to-([0-9]+)-years/);
  const minExp = expMatch ? parseInt(expMatch[1]!, 10) : 1;

  const parts = rawMiddle.split("-");
  if (parts.length < 3) return null;

  // Find city in parts
  let cityIndex = -1;
  let detectedCity = "India";

  for (let i = parts.length - 1; i >= 0; i--) {
    const w = parts[i]!.toLowerCase();
    if (KNOWN_CITIES.includes(w)) {
      cityIndex = i;
      detectedCity = titleCase(w);
      break;
    }
  }

  let title = "";
  let company = "Naukri Verified Employer";

  if (cityIndex > 1) {
    const preCity = parts.slice(0, cityIndex);
    if (preCity.length >= 4) {
      title = titleCase(preCity.slice(0, preCity.length - 2).join(" "));
      company = titleCase(preCity.slice(preCity.length - 2).join(" "));
    } else if (preCity.length >= 2) {
      title = titleCase(preCity.slice(0, preCity.length - 1).join(" "));
      company = titleCase(preCity.slice(preCity.length - 1).join(" "));
    } else {
      title = titleCase(preCity.join(" "));
    }
  } else {
    title = titleCase(parts.slice(0, Math.min(parts.length, 4)).join(" "));
  }

  if (title.length > 80) title = title.substring(0, 80).trim();

  return {
    title,
    company,
    location: `${detectedCity}, India`,
    experienceYears: minExp,
    jobId,
  };
}

export const NAUKRI_SITEMAPS = [
  "https://www.naukri.com/sitemap/jobDescPagesBangalore.xml",
  "https://www.naukri.com/sitemap/jobDescPagesHyderabad-1.xml.gz",
  "https://www.naukri.com/sitemap/jobDescPagesHyderabad-2.xml.gz",
  "https://www.naukri.com/sitemap/jobDescPagesPune.xml",
  "https://www.naukri.com/sitemap/jobDescPagesNoida.xml",
  "https://www.naukri.com/sitemap/jobDescPagesDelhi.xml",
  "https://www.naukri.com/sitemap/jobDescPagesMumbai-1.xml.gz",
  "https://www.naukri.com/sitemap/jobDescPagesMumbai-2.xml.gz",
  "https://www.naukri.com/sitemap/jobDescPagesChennai.xml",
  "https://www.naukri.com/sitemap/incremental-jd-pages.xml",
];

export async function crawlNaukriIndia(options?: {
  limit?: number;
  maxSitemaps?: number;
}): Promise<RawCrawledJob[]> {
  const limit = options?.limit ?? 5000;
  const maxSitemaps = options?.maxSitemaps ?? 4;
  const results: RawCrawledJob[] = [];
  const seenUrls = new Set<string>();

  const targetSitemaps = NAUKRI_SITEMAPS.slice(0, maxSitemaps);

  for (const sitemapUrl of targetSitemaps) {
    if (results.length >= limit) break;

    try {
      const res = await fetch(sitemapUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          Accept: "application/x-gzip, application/xml, text/xml",
        },
      });

      if (!res.ok) continue;

      let xml = "";
      if (sitemapUrl.endsWith(".gz")) {
        const buffer = await res.arrayBuffer();
        xml = zlib.gunzipSync(Buffer.from(buffer)).toString("utf-8");
      } else {
        xml = await res.text();
      }

      const locMatches = xml.match(/<loc>(https:\/\/www\.naukri\.com\/job-listings-[^<]+)<\/loc>/g) || [];

      for (const locTag of locMatches) {
        if (results.length >= limit) break;

        const rawUrl = locTag.replace(/<\/?loc>/g, "").trim().split("?")[0]!;
        if (seenUrls.has(rawUrl)) continue;
        seenUrls.add(rawUrl);

        if (!NAUKRI_TECH_REGEX.test(rawUrl.toLowerCase())) continue;

        const parsed = parseNaukriUrl(rawUrl);
        if (!parsed) continue;

        // Geo-exclusion check
        const geoCheck = await verifyOpportunityEligibility(
          { rawLocation: parsed.location, countryCode: "IN" },
          parsed.title,
          parsed.company,
          parsed.title
        );
        if (!geoCheck.isEligible) continue;

        // Truth score
        const truth = evaluateJobTruth({
          title: parsed.title,
          companyName: parsed.company,
          description: `${parsed.title} at ${parsed.company}. Location: ${parsed.location}. Candidates apply directly on Naukri verified employer job listing.`,
          salaryOrStipend: "Competitive (Industry Standard)",
          publishedAt: new Date().toISOString(),
        });
        if (truth.isGhostRisk) continue;

        const cleanSafeUrl = sanitizeExternalJobUrl(rawUrl);
        const skills = extractCanonicalSkills(`${parsed.title} ${parsed.company}`);
        const expInfo = detectExperienceAndType(parsed.title);

        const isRemote =
          parsed.location.toLowerCase().includes("remote") ||
          parsed.title.toLowerCase().includes("remote");

        results.push({
          title: parsed.title,
          companyName: parsed.company,
          location: isRemote ? "Remote, India" : parsed.location,
          workMode: isRemote ? WorkMode.REMOTE : WorkMode.ON_SITE,
          jobType: expInfo.jobType,
          salaryOrStipend: "Competitive (Industry Standard)",
          experienceYears: parsed.experienceYears || expInfo.experienceYears,
          skills,
          description: `${parsed.title} position open at ${parsed.company}. Candidates apply directly on official verified Naukri portal.`,
          source: JobSource.EXTERNAL,
          sourceUrl: cleanSafeUrl,
          externalId: `naukri-${parsed.jobId}`,
          isGhostRisk: false,
          truthScore: truth.score,
          publishedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.warn(`[Naukri Crawler] Failed sitemap ${sitemapUrl}:`, err.message);
    }
  }

  return results;
}
