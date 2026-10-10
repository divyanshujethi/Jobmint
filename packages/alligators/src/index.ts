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

import { crawlViaSearchDorking } from './job-alligator/search-dorker';
import { siphonSitemaps } from './job-alligator/sitemap-siphoner';
import { crawlAdzunaIndia } from './job-alligator/adzuna-crawler';
import { crawlJoobleIndia } from './job-alligator/jooble-crawler';
import { crawlFounditIndia } from './job-alligator/foundit-crawler';
import { crawlLinkedInGuestJobs } from './job-alligator/linkedin-guest-crawler';
import { crawlSmartRecruitersJobs } from './job-alligator/smartrecruiters-crawler';
import { crawlWorkableJobs } from './job-alligator/workable-crawler';
import { crawlWorkdayJobs } from './job-alligator/workday-crawler';
import { crawlBreezyJobs } from './job-alligator/breezy-crawler';
import { crawlRecruiteeJobs } from './job-alligator/recruitee-crawler';
import { crawlPersonioJobs } from './job-alligator/personio-crawler';
import { crawlInternshalaOpportunities } from './job-alligator/internshala-crawler';
import { crawlNaukriIndia } from './job-alligator/naukri-crawler';

export * from './types';
export * from './job-alligator/skill-extractor';
export * from './job-alligator/truth-filter';
export * from './job-alligator/geo-exclusion-engine';
export * from './job-alligator/greenhouse-crawler';
export * from './job-alligator/lever-crawler';
export * from './job-alligator/ashby-crawler';
export * from './job-alligator/workday-crawler';
export * from './job-alligator/breezy-crawler';
export * from './job-alligator/recruitee-crawler';
export * from './job-alligator/personio-crawler';
export * from './job-alligator/himalayas-crawler';
export * from './job-alligator/jobspipe-crawler';
export * from './job-alligator/remotive-crawler';
export * from './job-alligator/remoteok-crawler';
export * from './job-alligator/apify-crawler';
export * from './job-alligator/adzuna-crawler';
export * from './job-alligator/jooble-crawler';
export * from './job-alligator/foundit-crawler';
export * from './job-alligator/linkedin-guest-crawler';
export * from './job-alligator/smartrecruiters-crawler';
export * from './job-alligator/workable-crawler';
export * from './job-alligator/internshala-crawler';
export * from './job-alligator/naukri-crawler';
export * from './job-alligator/search-dorker';
export * from './job-alligator/sitemap-siphoner';
export * from './job-alligator/github-internships';
export * from './job-alligator/early-career-classifier';
export * from './job-alligator/campus-early-career-crawler';
export * from './job-alligator/simplify-crawler';
export * from './job-alligator/india-crawler';
export * from './job-alligator/company-discovery';
export * from './job-alligator/indian-startup-seeds';
export * from './job-alligator/ai-career-scraper';
export * from './job-alligator/expired-job-verifier';
export * from './study-alligator/curated-sources';
export * from './study-alligator/canvas-binder';
export * from './study-alligator/youtube-study-crawler';
export * from './study-alligator/roadmap-crawler';

/**
 * Master Runner for Job Alligator:
 * Aggregates verified tech positions from Indian Unicorns (Greenhouse/Lever/Ashby),
 * Adzuna India (100k+ IT roles), Jooble India, JobsPipe (India & Remote),
 * Global Remote opportunities (Himalayas, Remotive, RemoteOK), Search Engine Dorking,
 * Deep Sitemap Siphoning, and tech internships.
 * Filtered via the 3-Layer Geo-Exclusion Engine.
 */
export async function runJobAlligator(options?: {
  internshipLimit?: number;
  newGradLimit?: number;
  maxPerCompany?: number;
  enableDiscovery?: boolean;
  adzunaPages?: number;
  founditLimit?: number;
  founditStartIndex?: number;
  founditSitemapCount?: number;
  linkedinLimit?: number;
  smartRecruitersLimit?: number;
  workableLimit?: number;
  internshalaLimit?: number;
  naukriLimit?: number;
}) {
  const startTime = Date.now();
  const internshipLimit = options?.internshipLimit ?? 30;
  const newGradLimit = options?.newGradLimit ?? 30;
  const maxPerCompany = options?.maxPerCompany ?? 20;
  const enableDiscovery = options?.enableDiscovery ?? false;
  const adzunaPages = options?.adzunaPages ?? 4;
  const founditLimit = options?.founditLimit ?? 5000;
  const founditStartIndex = options?.founditStartIndex ?? 0;
  const founditSitemapCount = options?.founditSitemapCount ?? 4;
  const linkedinLimit = options?.linkedinLimit ?? 200;
  const smartRecruitersLimit = options?.smartRecruitersLimit ?? 500;
  const workableLimit = options?.workableLimit ?? 300;
  const internshalaLimit = options?.internshalaLimit ?? 1000;
  const naukriLimit = options?.naukriLimit ?? 2000;

  const [
    adzunaJobs,
    joobleJobs,
    linkedInJobs,
    smartRecruitersJobs,
    workableJobs,
    workdayJobs,
    breezyJobs,
    recruiteeJobs,
    personioJobs,
    internshalaJobs,
    indiaJobs,
    jobsPipeJobs,
    ashbyJobs,
    himalayasJobs,
    remotiveJobs,
    remoteOkJobs,
    dorkedJobs,
    sitemapJobs,
    internships,
    newGrads,
    gitlabJobs,
    canonicalJobs,
  ] = await Promise.all([
    crawlAdzunaIndia({ pages: adzunaPages, resultsPerPage: 50 }).catch((err) => {
      console.error("[Job Alligator] Adzuna crawler failed:", err);
      return [];
    }),
    crawlJoobleIndia().catch((err) => {
      console.error("[Job Alligator] Jooble crawler failed:", err);
      return [];
    }),
    crawlLinkedInGuestJobs({ totalLimit: linkedinLimit }).catch((err) => {
      console.error("[Job Alligator] LinkedIn crawler failed:", err);
      return [];
    }),
    crawlSmartRecruitersJobs({ limit: smartRecruitersLimit }).catch((err) => {
      console.error("[Job Alligator] SmartRecruiters crawler failed:", err);
      return [];
    }),
    crawlWorkableJobs({ limit: workableLimit }).catch((err) => {
      console.error("[Job Alligator] Workable crawler failed:", err);
      return [];
    }),
    crawlWorkdayJobs().catch((err) => {
      console.error("[Job Alligator] Workday crawler failed:", err);
      return [];
    }),
    crawlBreezyJobs().catch((err) => {
      console.error("[Job Alligator] Breezy crawler failed:", err);
      return [];
    }),
    crawlRecruiteeJobs().catch((err) => {
      console.error("[Job Alligator] Recruitee crawler failed:", err);
      return [];
    }),
    crawlPersonioJobs().catch((err) => {
      console.error("[Job Alligator] Personio crawler failed:", err);
      return [];
    }),
    crawlInternshalaOpportunities({ limit: internshalaLimit }).catch((err) => {
      console.error("[Job Alligator] Internshala crawler failed:", err);
      return [];
    }),
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
    crawlViaSearchDorking({ maxPerCompany: 5 }).catch(() => []),
    siphonSitemaps({ maxUrlsPerSource: 20 }).catch(() => []),
    crawlSimplifyInternships({ limit: internshipLimit }).catch(() => []),
    crawlSimplifyNewGrad({ limit: newGradLimit }).catch(() => []),
    crawlGreenhouseBoard('gitlab', 'GitLab').catch(() => []),
    crawlGreenhouseBoard('canonical', 'Canonical').catch(() => []),
  ]);

  const allJobs = [
    ...adzunaJobs,
    ...joobleJobs,
    ...linkedInJobs,
    ...smartRecruitersJobs,
    ...workableJobs,
    ...workdayJobs,
    ...breezyJobs,
    ...recruiteeJobs,
    ...personioJobs,
    ...internshalaJobs,
    ...indiaJobs,
    ...jobsPipeJobs,
    ...ashbyJobs,
    ...himalayasJobs,
    ...remotiveJobs,
    ...remoteOkJobs,
    ...dorkedJobs,
    ...sitemapJobs,
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
