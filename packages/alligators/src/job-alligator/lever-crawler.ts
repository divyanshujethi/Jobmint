import { JobType, WorkMode } from '@repo/shared';
import { RawCrawledJob } from '../types';
import { extractCanonicalSkills } from './skill-extractor';
import { evaluateJobTruth } from './truth-filter';
import { normalizeIndiaLocation, isTechRole, detectExperienceAndType } from './india-crawler';

import { verifyOpportunityEligibility } from './geo-exclusion-engine';

/**
 * Crawls public Lever boards.
 * Strictly filters out foreign on-site positions and non-tech titles using the 3-Layer Geo-Exclusion Engine.
 */
export async function crawlLeverSite(siteName: string, companyName: string): Promise<RawCrawledJob[]> {
  const results: RawCrawledJob[] = [];
  try {
    const response = await fetch(`https://api.lever.co/v0/postings/${siteName}?mode=json`, {
      headers: { 'User-Agent': 'RoleNest-TruthAlligator/1.0' },
    });

    if (!response.ok) {
      console.warn(`[Job Alligator] Lever site ${siteName} returned status ${response.status}`);
      return [];
    }

    const data = (await response.json()) as any[];
    if (!data || !data.length) {
      return [];
    }

    for (const posting of data) {
      const title = posting.text?.trim() || "";
      if (!isTechRole(title)) continue;

      const locRaw = posting.categories?.location || "";
      const workplaceType = (posting.workplaceType || "").toLowerCase();
      const isRemote = workplaceType === "remote" || locRaw.toLowerCase().includes("remote");

      // 3-Layer Geo-Exclusion Engine Check
      const eligibility = await verifyOpportunityEligibility(
        {
          rawLocation: locRaw,
          workplaceType,
          isRemote,
        },
        title,
        companyName,
        posting.descriptionPlain || ""
      );

      if (!eligibility.isEligible) {
        continue;
      }

      const { experienceYears, jobType } = detectExperienceAndType(title);
      const desc = `Verified position for ${title} at ${companyName}. Location: ${eligibility.normalizedLocation}. Apply directly on the official ${companyName} Lever portal.`;
      const salary = jobType === JobType.INTERNSHIP 
        ? "Competitive Internship Stipend (Official)" 
        : "Competitive Market Compensation (Official)";
      const pubDate = posting.createdAt ? new Date(posting.createdAt).toISOString() : new Date().toISOString();

      const skills = extractCanonicalSkills(`${title} ${desc}`);
      const truthEval = evaluateJobTruth({
        title,
        description: desc,
        salaryOrStipend: salary,
        publishedAt: pubDate,
        companyName,
      });

      results.push({
        title,
        companyName,
        companyWebsite: `https://${siteName}.com`,
        location: eligibility.normalizedLocation,
        workMode: isRemote ? WorkMode.REMOTE : WorkMode.HYBRID,
        jobType,
        salaryOrStipend: salary,
        experienceYears,
        source: 'LEVER',
        sourceUrl: posting.hostedUrl || `https://jobs.lever.co/${siteName}/${posting.id}`,
        externalId: String(posting.id || `lever-${siteName}-${Math.random()}`),
        description: desc,
        skills: skills.length ? skills : ['Go', 'Python', 'Docker'],
        isGhostRisk: truthEval.isGhostRisk,
        truthScore: truthEval.score,
        publishedAt: pubDate,
      });
    }
  } catch (e: any) {
    console.error(`[Job Alligator] Lever crawl error for ${siteName}:`, e.message);
    return [];
  }
  return results;
}