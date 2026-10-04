import { crawlGreenhouseBoard } from './job-alligator/greenhouse-crawler';
import { crawlLeverSite } from './job-alligator/lever-crawler';
import { crawlGitHubInternships } from './job-alligator/github-internships';
import { crawlSimplifyInternships, crawlSimplifyNewGrad } from './job-alligator/simplify-crawler';
import { crawlIndiaTechBoards, normalizeIndiaLocation } from './job-alligator/india-crawler';

import { crawlHimalayasJobs } from './job-alligator/himalayas-crawler';
import { crawlAllAshbyBoards } from './job-alligator/ashby-crawler';
import { crawlJobsPipe } from './job-alligator/jobspipe-crawler';
import { crawlRemotiveJobs } from './job-alligator/remotive-crawler';
import { crawlRemoteOkJobs } from './job-alligator/remoteok-crawler';
import { fetchApifyDataset } from './job-alligator/apify-crawler';

export * from './types';
export * from './job-alligator/skill-extractor';
export * from './job-alligator/truth-filter';
export * from './job-alligator/geo-exclusion-engine';
export * from './job-alligator/greenhouse-crawler';
export * from './job-alligator/lever-crawler';
export * from './job-alligator/ashby-crawler';
export * from './job-alligator/himalayas-crawler';
export * from './job-alligator/jobspipe-crawler';
export * from './job-alligator/remotive-crawler';
export * from './job-alligator/remoteok-crawler';
export * from './job-alligator/apify-crawler';
export * from './job-alligator/github-internships';
export * from './job-alligator/simplify-crawler';
export * from './job-alligator/india-crawler';
export * from './job-alligator/company-discovery';
export * from './job-alligator/ai-career-scraper';
export * from './study-alligator/curated-sources';
export * from './study-alligator/canvas-binder';

/**
 * Master Runner for Job Alligator:
 * Aggregates verified tech positions from Indian Unicorns (Greenhouse/Lever/Ashby),
 * JobsPipe (India & Remote), Global Remote opportunities (Himalayas, Remotive, RemoteOK),
 * autonomous startup discovery, and tech internships.
 * Filtered via the 3-Layer Geo-Exclusion Engine.
 */
export async function runJobAlligator(options?: {
  internshipLimit?: number;
  newGradLimit?: number;
  maxPerCompany?: number;
  enableDiscovery?: boolean;
}) {
  const startTime = Date.now();
  const internshipLimit = options?.internshipLimit ?? 30;
  const newGradLimit = options?.newGradLimit ?? 30;
  const maxPerCompany = options?.maxPerCompany ?? 20;
  const enableDiscovery = options?.enableDiscovery ?? false;

  const [
    indiaJobs,
    jobsPipeJobs,
    ashbyJobs,
    himalayasJobs,
    remotiveJobs,
    remoteOkJobs,
    internships,
    newGrads,
    gitlabJobs,
    canonicalJobs,
  ] = await Promise.all([
    crawlIndiaTechBoards({ maxPerCompany, enableDiscovery }).catch((err) => {
      console.error("[Job Alligator] India crawler failed:", err);
      return [];
    }),
    crawlJobsPipe({ limit: 40 }).catch((err) => {
      console.error("[Job Alligator] JobsPipe crawler failed:", err);
      return [];
    }),
    crawlAllAshbyBoards({ maxPerCompany }).catch(() => []),
    crawlHimalayasJobs({ limit: 80 }).catch(() => []),
    crawlRemotiveJobs({ limit: 40 }).catch(() => []),
    crawlRemoteOkJobs({ limit: 40 }).catch(() => []),
    crawlSimplifyInternships({ limit: internshipLimit }).catch(() => []),
    crawlSimplifyNewGrad({ limit: newGradLimit }).catch(() => []),
    crawlGreenhouseBoard('gitlab', 'GitLab').catch(() => []),
    crawlGreenhouseBoard('canonical', 'Canonical').catch(() => []),
  ]);

  const allJobs = [
    ...indiaJobs,
    ...jobsPipeJobs,
    ...ashbyJobs,
    ...himalayasJobs,
    ...remotiveJobs,
    ...remoteOkJobs,
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
