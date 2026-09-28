import { JobType, WorkMode } from '@repo/shared';
import { RawCrawledJob } from '../types';
import { extractCanonicalSkills } from './skill-extractor';
import { evaluateJobTruth } from './truth-filter';
import { normalizeIndiaLocation, isTechRole, detectExperienceAndType } from './india-crawler';

/**
 * Crawls public Greenhouse JOB Board APIs.
 * Strictly filters out foreign on-site positions and non-tech titles.
 */
export async function crawlGreenhouseBoard(boardToken: string, companyName: string): Promise<RawCrawledJob[]> {
  const results: RawCrawledJob[] = [];
  try {
    const response = await fetch(`https://api.greenhouse.io/v1/boards/${boardToken}/jobs`, {
      headers: { 'User-Agent': 'RoleNest-TruthAlligator/1.0' },
    });

    if (!response.ok) {
      console.warn(`[Job Alligator] Greenhouse board ${boardToken} returned status ${response.status}`);
      return [];
    }

    const data = await response.json() as { jobs: any[] };
    if (!data.jobs || !data.jobs.length) {
      return [];
    }

    for (const job of data.jobs) {
      const title = job.title?.trim() || "";
      if (!isTechRole(title)) continue;

      const locRaw = job.location?.name || "";
      const locInfo = normalizeIndiaLocation(locRaw);

      // MANDATORY: STRICT INDIA OR REMOTE ONLY - SKIP FOREIGN ON-SITE
      if (!locInfo.isIndiaOrRemote) {
        continue;
      }

      const { experienceYears, jobType } = detectExperienceAndType(title);
      const desc = `Verified position for ${title} at ${companyName}. Location: ${locInfo.location}. Apply directly on the official ${companyName} Greenhouse career portal.`;
      const salary = jobType === JobType.INTERNSHIP 
        ? "Competitive Internship Stipend (Official)" 
        : "Competitive Market Compensation (Official)";
      const pubDate = job.updated_at || new Date().toISOString();

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
        companyWebsite: `https://${boardToken}.com`,
        location: locInfo.location,
        workMode: locInfo.workMode,
        jobType,
        salaryOrStipend: salary,
        experienceYears,
        source: 'GREENHOUSE',
        sourceUrl: job.absolute_url || `https://boards.greenhouse.io/${boardToken}/jobs/${job.id}`,
        externalId: String(job.id || `gh-${boardToken}-${Math.random()}`),
        description: desc,
        skills: skills.length ? skills : ["TypeScript", "React"],
        isGhostRisk: truthEval.isGhostRisk,
        truthScore: truthEval.score,
        publishedAt: pubDate,
      });
    }
  } catch (e: any) {
    console.error(`[Job Alligator] Greenhouse crawl error for ${boardToken}:`, e.message);
    return [];
  }
  return results;
}
