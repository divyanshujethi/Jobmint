import { crawlGreenhouseBoard } from './job-alligator/greenhouse-crawler';
import { crawlLeverSite } from './job-alligator/lever-crawler';
import { crawlGitHubInternships } from './job-alligator/github-internships';

export * from './types';
export * from './job-alligator/skill-extractor';
export * from './job-alligator/truth-filter';
export * from './job-alligator/greenhouse-crawler';
export * from './job-alligator/lever-crawler';
export * from './job-alligator/github-internships';
export * from './study-alligator/curated-sources';
export * from './study-alligator/canvas-binder';

/**
 * Master Runner for Job Alligator
 */
export async function runJobAlligator() {
  const startTime = Date.now();
  const allJobs = [
    ...(await crawlGreenhouseBoard('gitlab', 'GitLab')),
    ...(await crawlGreenhouseBoard('canonical', 'Canonical')),
    ...(await crawlLeverSite('figma', 'Figma')),
    ...(await crawlGitHubInternships()),
  ];

  const acceptedJobs = allJobs.filter((j) => !j.isGhostRisk && j.truthScore >= 50);
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
