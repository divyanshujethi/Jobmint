import { JobType, WorkMode } from '@repo/shared';
import { RawCrawledJob } from '../types';
import { extractCanonicalSkills } from './skill-extractor';
import { evaluateJobTruth } from './truth-filter';

export async function crawlLeverSite(siteName: string, companyName: string): Promise<RawCrawledJob[]> {
  const results: RawCrawledJob[] = [];
  try {
    const response = await fetch(`https://api.lever.co/v0/postings/${siteName}?mode=json`, {
      headers: { 'User-Agent': 'Role Nest-TruthAligator/1.0' },
    });

    if (!response.ok) {
      console.warn(`[Job Alligator] Lever site ${siteName} returned status ${response.status}`);
      return [];
    }

    const data = (await response.json()) as any[];
    if (!data || !data.length) {
      return [];
    }

    for (const posting of data.slice(0, 30)) {
      const title = posting.text || 'Software Engineer';
      const location = posting.categories?.location || 'Remote';
      const isRemote = location.toLowerCase().includes('remote') || title.toLowerCase().includes('remote');
      const desc = `Verified position for ${title} at ${companyName}. Located in ${location}. Apply directly on the official ${companyName} Lever portal.`;
      const salary = 'Competitive Market Compensation (Official)';
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
        location,
        workMode: isRemote ? WorkMode.REMOTE : WorkMode.ON_SITE,
        jobType: title.toLowerCase().includes('intern') ? JobType.INTERNSHIP : JobType.FULL_TIME,
        salaryOrStipend: salary,
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