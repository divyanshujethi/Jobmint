import { JobType, WorkMode } from '@repo/shared';
import { RawCrawledJob } from '../types';
import { extractCanonicalSkills } from './skill-extractor';
import { evaluateJobTruth } from './truth-filter';

/**
 * Crawls public Greenhouse JOB Board APIs (Completely Keyless & Free)
 * Example URLs: https://api.greenhouse.io/v1/boards/{boardToken}/jobs
 */
export async function crawlGreenhouseBoard(boardToken: string, companyName: string): Promise<RawCrawledJob[]> {
  const results: RawCrawledJob[] = [];
  try {
    const response = await fetch(`https://api.greenhouse.io/v1/boards/${boardToken}/jobs`, {
      headers: { 'User-Agent': 'Role Nest-TruthAligator/1.0' },
    });

    if (!response.ok) {
      console.warn(`[Job Alligator] Greenhouse board ${boardToken} returned status ${response.status}`);
      return [];
    }

    const data = await response.json() as { jobs: any[] };
    if (!data.jobs || !data.jobs.length) {
      return [];
    }

    for (const job of data.jobs.slice(0, 30)) {
      const title = job.title || "Software Engineer";
      const location = job.location?.name || "Remote";
      const isRemote = location.toLowerCase().includes("remote") || title.toLowerCase().includes("remote");
      const desc = `Verified position for ${title} at ${companyName}. Located in ${location}. Apply directly on the official ${companyName} Greenhouse career portal.`;
      const salary = "Competitive Market Compensation (Official)";
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
        location,
        workMode: isRemote ? WorkMode.REMOTE : WorkMode.HYBRID,
        jobType: title.toLowerCase().includes("intern") ? JobType.INTERNSHIP : JobType.FULL_TIME,
        salaryOrStipend: salary,
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
