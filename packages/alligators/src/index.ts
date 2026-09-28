import { crawlGreenhouseBoard } from './job-alligator/greenhouse-crawler';
import { crawlLeverSite } from './job-alligator/lever-crawler';
import { crawlGitHubInternships } from './job-alligator/github-internships';
import { crawlSimplifyInternships, crawlSimplifyNewGrad } from './job-alligator/simplify-crawler';
import { crawlIndiaTechBoards, normalizeIndiaLocation } from './job-alligator/india-crawler';

export * from './types';
export * from './job-alligator/skill-extractor';
export * from './job-alligator/truth-filter';
export * from './job-alligator/greenhouse-crawler';
export * from './job-alligator/lever-crawler';
export * from './job-alligator/github-internships';
export * from './job-alligator/simplify-crawler';
export * from './job-alligator/india-crawler';
export * from './study-alligator/curated-sources';
export * from './study-alligator/canvas-binder';

/**
 * Master Runner for Job Alligator:
 * Aggregates verified tech positions from Indian Unicorns (Greenhouse/Lever),
 * Global India engineering hubs, and tech internships.
 */
export async function runJobAlligator(options?: {
  internshipLimit?: number;
  newGradLimit?: number;
  maxPerCompany?: number;
}) {
  const startTime = Date.now();
  const internshipLimit = options?.internshipLimit ?? 20;
  const newGradLimit = options?.newGradLimit ?? 20;
  const maxPerCompany = options?.maxPerCompany ?? 20;

  const [indiaJobs, internships, newGrads, gitlabJobs, canonicalJobs] = await Promise.all([
    crawlIndiaTechBoards({ maxPerCompany }).catch((err) => {
      console.error("[Job Alligator] India crawler failed:", err);
      return [];
    }),
    crawlSimplifyInternships({ limit: internshipLimit }).catch(() => []),
    crawlSimplifyNewGrad({ limit: newGradLimit }).catch(() => []),
    crawlGreenhouseBoard('gitlab', 'GitLab').catch(() => []),
    crawlGreenhouseBoard('canonical', 'Canonical').catch(() => []),
  ]);

  const allJobs = [
    ...indiaJobs,
    ...internships,
    ...newGrads,
    ...gitlabJobs,
    ...canonicalJobs,
  ];

  const acceptedJobs = allJobs.filter((j) => {
    if (j.isGhostRisk || j.truthScore < 50) return false;
    const locInfo = normalizeIndiaLocation(j.location);
    return locInfo.isIndiaOrRemote;
  });
  const rejected = allJobs.length - acceptedJobs.length;

  // Compute skill demand frequency
  const skillCounts: Record<string, number> = {};
  for (const job of acceptedJobs) {
    for (const s of job.skills) {
      skillCounts[s] = (skillCounts[s] || 0) + 1;
    }
  }

  const topDemanded = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));

  return {
    jobs: acceptedJobs,
    stats: {
      totalCrawled: allJobs.length,
      accepted: acceptedJobs.length,
      rejectedGhostJobs: rejected,
      lastCrawlTimestamp: new Date().toISOString(),
      topDemandedSkills: topDemanded,
    },
    durationMs: Date.now() - startTime,
  };
}
