/**
 * RoleNest - Personio Public XML/JSON Enterprise Crawler
 *
 * Crawls unauthenticated public job feeds for employers
 * hosted on Personio:
 *   GET https://{company}.jobs.personio.de/xml?language=en
 */

import { JobType, WorkMode, JobSource } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { isTechRole, detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

export interface PersonioTarget {
  name: string;
  subdomain: string;
  tld?: string; // "de" | "com"
}

export const PERSONIO_COMPANIES: PersonioTarget[] = [
  { name: "Urban Sports Club", subdomain: "urbansportsclub", tld: "de" },
  { name: "Taxfix", subdomain: "taxfix", tld: "de" },
  { name: "FlixMobility", subdomain: "flixmobility", tld: "de" },
];

export async function crawlPersonioJobs(options?: {
  companies?: PersonioTarget[];
  limit?: number;
}): Promise<RawCrawledJob[]> {
  const targets = options?.companies ?? PERSONIO_COMPANIES;
  const limit = options?.limit ?? 500;
  const results: RawCrawledJob[] = [];

  for (const comp of targets) {
    if (results.length >= limit) break;

    try {
      const tld = comp.tld || "de";
      const url = `https://${comp.subdomain}.jobs.personio.${tld}/xml?language=en`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "RoleNest-PersonioAlligator/1.0 (Mozilla/5.0 compatible)",
          Accept: "application/xml, text/xml, */*",
        },
      });

      if (!res.ok) continue;
      const xml = await res.text();

      // Parse position blocks from XML
      const positionMatches = xml.match(/<position>([\s\S]*?)<\/position>/g) || [];

      for (const posBlock of positionMatches) {
        if (results.length >= limit) break;

        const idMatch = posBlock.match(/<id>([^<]+)<\/id>/);
        const nameMatch = posBlock.match(/<name>([^<]+)<\/name>/);
        const officeMatch = posBlock.match(/<office>([^<]+)<\/office>/);
        const employmentTypeMatch = posBlock.match(/<employmentType>([^<]+)<\/employmentType>/);
        const scheduleMatch = posBlock.match(/<schedule>([^<]+)<\/schedule>/);

        const title = (nameMatch ? nameMatch[1] : "").trim();
        const externalId = idMatch ? idMatch[1].trim() : "";
        const office = (officeMatch ? officeMatch[1] : "Remote").trim();

        if (!title || !externalId) continue;
        if (!isTechRole(title)) continue;

        const officeLower = office.toLowerCase();
        const isIndia = officeLower.includes("india") || officeLower.includes("bangalore") || officeLower.includes("bengaluru") || officeLower.includes("pune") || officeLower.includes("mumbai") || officeLower.includes("delhi") || officeLower.includes("remote");

        const sourceUrl = `https://${comp.subdomain}.jobs.personio.${tld}/job/${externalId}`;
        const description = `${title} role at ${comp.name}. Office: ${office}. Direct official application on Personio.`;

        const truth = evaluateJobTruth({
          title,
          companyName: comp.name,
          description,
          salaryOrStipend: "Competitive (Industry Standard)",
          publishedAt: new Date().toISOString(),
        });

        if (truth.score < 30) continue;

        const geoCheck = await verifyOpportunityEligibility(
          { rawLocation: office, countryCode: isIndia ? "IN" : undefined },
          title,
          comp.name,
          description
        );

        if (!geoCheck.isEligible && !officeLower.includes("remote")) continue;

        const skills = extractCanonicalSkills(`${title} ${description}`);
        const { experienceYears, jobType: detectedType } = detectExperienceAndType(title);

        const empType = (employmentTypeMatch ? employmentTypeMatch[1] : "").toLowerCase();
        const isIntern = empType.includes("intern") || empType.includes("trainee") || detectedType === JobType.INTERNSHIP;

        results.push({
          title,
          companyName: comp.name,
          location: officeLower.includes("remote") ? "Remote, India" : `${office}, India`,
          sourceUrl,
          externalId: `personio-${comp.subdomain}-${externalId}`,
          jobType: isIntern ? JobType.INTERNSHIP : JobType.FULL_TIME,
          workMode: officeLower.includes("remote") ? WorkMode.REMOTE : WorkMode.HYBRID,
          source: 'EXTERNAL',
          salaryOrStipend: "Competitive (Industry Standard)",
          experienceYears,
          skills,
          description,
          isGhostRisk: false,
          truthScore: truth.score,
          publishedAt: new Date().toISOString(),
        });
      }
    } catch {
      continue;
    }
  }

  return results;
}
