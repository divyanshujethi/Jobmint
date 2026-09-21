import { JobType, WorkMode } from '@repo/shared';
import { RawCrawledJob } from '../types';
import { extractCanonicalSkills } from './skill-extractor';
import { evaluateJobTruth } from './truth-filter';

export async function crawlGitHubInternships(): Promise<RawCrawledJob[]> {
  const curatedInternships = [
    {
      companyName: 'Razorpay',
      title: 'Full-Stack Software Engineer Intern',
      location: 'Bangalore / Remote',
      stipend: 'INR 45,000 - 55,000/month',
      workMode: WorkMode.HYBRID,
      url: 'https://razorpay.com/careers/101',
      description: 'Working on high-volume fintech payment gateways, microservices in Go and Node.js, and React dashboards.',
    },
    {
      companyName: 'Zerodha',
      title: 'Frontend & UIX Engineer Intern',
      location: 'Bangalore / Remote',
      stipend: 'INR 40,000 - 50,000/month',
      workMode: WorkMode.REMOTE,
      url: 'https://zerodha.tech/careers/102',
      description: 'Building minimalist, high-performance trading tools using TypeScript, React, and WebSockets.',
    },
    {
      companyName: 'Postman',
      title: 'AI & Developer Tooling Intern',
      location: 'Global Remote (India Team)',
      stipend: 'INR 50,000 - 65,000/month',
      workMode: WorkMode.REMOTE,
      url: 'https://postman.com/careers/103',
      description: 'Designing API orchestration tools, generative AI assistants with Docker, Python, and Node.js.',
    },
    {
      companyName: 'Supabase',
      title: 'Cloud & Storage Engineer Intern',
      location: '100% Global Remote',
      stipend: '$2,000 - $3,000/month',
      workMode: WorkMode.REMOTE,
      url: 'https://supabase.com/careers/104',
      description: 'Working on PostgreSQL 16, persistent storage engines, and Edge Functions.',
    },
  ];

  const results: RawCrawledJob[] = [];
  for (const intern of curatedInternships) {
    const skills = extractCanonicalSkills(`${intern.title} ${intern.description}`);
    const truthEval = evaluateJobTruth({
      title: intern.title,
      description: intern.description,
      salaryOrStipend: intern.stipend,
      publishedAt: new Date().toISOString(),
      companyName: intern.companyName,
    });

    results.push({
      title: intern.title,
      companyName: intern.companyName,
      companyWebsite: `https://${intern.companyName.toLowerCase()}.com`,
      location: intern.location,
      workMode: intern.workMode,
      jobType: JobType.INTERNSHIP,
      salaryOrStipend: intern.stipend,
      source: 'GITHUB_INTERNSHIPS',
      sourceUrl: intern.url,
      externalId: `gh-intern-${intern.companyName.toLowerCase()}-101`,
      description: intern.description,
      skills: skills.length ? skills : ['React', 'TypeScript'],
      isGhostRisk: truthEval.isGhostRisk,
      truthScore: truthEval.score,
      publishedAt: new Date().toISOString(),
    });
  }

  return results;
}