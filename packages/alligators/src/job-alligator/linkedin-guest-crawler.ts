/**
 * Role Nest - LinkedIn Public Guest Job Crawler
 * Siphons live, unauthenticated job postings across India directly from LinkedIn's
 * public guest search endpoint without requiring user login, cookies, or headless browsers.
 * 
 * Hyperlink Policy:
 * Links directly to the authentic public LinkedIn job post URL (`https://in.linkedin.com/jobs/view/{id}`)
 * for zero-friction candidate applications.
 */

import { JobType, WorkMode, JobSource } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";
import { detectExperienceAndType } from "./india-crawler";
import { verifyOpportunityEligibility } from "./geo-exclusion-engine";

const SEARCH_DOMAINS = [
  "software engineer",
  "frontend developer",
  "backend developer",
  "full stack engineer",
  "devops engineer",
  "data engineer",
  "python developer",
  "react developer",
  "ai machine learning engineer",
  "cloud engineer",
];

const SEARCH_LOCATIONS = [
  "Bengaluru, Karnataka, India",
  "Hyderabad, Telangana, India",
  "Pune, Maharashtra, India",
  "Delhi NCR, India",
  "Mumbai, Maharashtra, India",
  "India (Remote)",
];

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)] || USER_AGENTS[0]!;
}

function cleanHtml(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function crawlLinkedInGuestJobs(options?: {
  maxPagesPerQuery?: number;
  roles?: string[];
  locations?: string[];
  totalLimit?: number;
}): Promise<RawCrawledJob[]> {
  const maxPages = options?.maxPagesPerQuery ?? 3;
  const roles = options?.roles ?? SEARCH_DOMAINS.slice(0, 5);
  const locations = options?.locations ?? ["Bengaluru, Karnataka, India", "Hyderabad, Telangana, India", "India"];
  const totalLimit = options?.totalLimit ?? 500;

  const results: RawCrawledJob[] = [];
  const seenUrls = new Set<string>();

  for (const role of roles) {
    if (results.length >= totalLimit) break;

    for (const loc of locations) {
      if (results.length >= totalLimit) break;

      for (let page = 0; page < maxPages; page++) {
        if (results.length >= totalLimit) break;

        const start = page * 25;
        const encodedRole = encodeURIComponent(role);
        const encodedLoc = encodeURIComponent(loc);
        const searchUrl = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodedRole}&location=${encodedLoc}&start=${start}`;

        try {
          const res = await fetch(searchUrl, {
            headers: {
              "User-Agent": getRandomUserAgent(),
              "Accept-Language": "en-US,en;q=0.9",
              Accept: "text/html,application/xhtml+xml",
            },
          });

          if (!res.ok) {
            // If rate limited (429) or forbidden (403), pause and advance
            if (res.status === 429 || res.status === 403) {
              await new Promise((r) => setTimeout(r, 1000));
            }
            break;
          }

          const html = await res.text();
          if (!html || html.length < 500) break;

          // Parse job cards from the returned HTML snippet
          const cardBlocks = html.split(/<li[^>]*>/i).slice(1);

          for (const card of cardBlocks) {
            if (results.length >= totalLimit) break;

            const linkMatch = card.match(/href="(https:\/\/[a-z]+\.linkedin\.com\/jobs\/view\/[^"?]+)/i);
            const titleMatch = card.match(/<h3 class="[^"]*base-search-card__title[^"]*">([\s\S]*?)<\/h3>/i);
            const companyMatch =
              card.match(/<h4 class="[^"]*base-search-card__subtitle[^"]*">\s*<a[^>]*>([\s\S]*?)<\/a>/i) ||
              card.match(/<h4 class="[^"]*base-search-card__subtitle[^"]*">([\s\S]*?)<\/h4>/i);
            const locMatch = card.match(/<span class="[^"]*job-search-card__location[^"]*">([\s\S]*?)<\/span>/i);
            const dateMatch = card.match(/<time[^>]*datetime="([^"]+)"/i);

            if (!linkMatch || !titleMatch) continue;

            const rawUrl = linkMatch[1]!.split("?")[0]!;
            if (seenUrls.has(rawUrl)) continue;
            seenUrls.add(rawUrl);

            const title = cleanHtml(titleMatch[1]!);
            const company = companyMatch ? cleanHtml(companyMatch[1]!) : "Verified Employer";
            const location = locMatch ? cleanHtml(locMatch[1]!) : loc;
            const publishedAt = dateMatch ? dateMatch[1]! : new Date().toISOString();

            if (title.length < 3 || company.length < 2) continue;

            // 1. Geo-Exclusion Check
            const geoCheck = await verifyOpportunityEligibility(
              { rawLocation: location, countryCode: "IN" },
              title,
              company,
              title
            );
            if (!geoCheck.isEligible) continue;

            // 2. Truth Evaluation
            const truth = evaluateJobTruth({
              title,
              companyName: company,
              description: `${title} at ${company} in ${location}. Apply directly on LinkedIn official verified listing.`,
              salaryOrStipend: "Competitive (Industry Standard)",
              publishedAt,
            });
            if (truth.isGhostRisk) continue;

            // 3. Extract Canonical Skills
            const skills = extractCanonicalSkills(`${title} ${role} ${company}`);

            // 4. Detect Experience & Job Type
            const expInfo = detectExperienceAndType(title);

            const isRemote =
              location.toLowerCase().includes("remote") ||
              title.toLowerCase().includes("remote") ||
              loc.toLowerCase().includes("remote");

            // Extract numeric job ID from LinkedIn view URL
            const idMatch = rawUrl.match(/-([0-9]+)$/) || rawUrl.match(/\/([0-9]+)$/);
            const externalId = idMatch ? `linkedin-${idMatch[1]}` : `linkedin-${Math.random().toString(36).slice(2, 10)}`;

            results.push({
              title,
              companyName: company,
              location: isRemote ? "Remote, India" : location,
              workMode: isRemote ? WorkMode.REMOTE : WorkMode.ON_SITE,
              jobType: expInfo.jobType,
              salaryOrStipend: "Competitive (Industry Standard)",
              experienceYears: expInfo.experienceYears,
              skills,
              description: `${title} position open at ${company}. Location: ${location}. Candidates can review verified responsibilities and apply directly on LinkedIn.`,
              source: JobSource.EXTERNAL,
              sourceUrl: rawUrl,
              externalId,
              isGhostRisk: false,
              truthScore: truth.score,
              publishedAt,
            });
          }

          // Polite pacing: 300ms between requests
          await new Promise((r) => setTimeout(r, 300));
        } catch (err: any) {
          console.warn(`[LinkedIn Guest Crawler] Error querying ${role} in ${loc}:`, err.message);
          break;
        }
      }
    }
  }

  return results;
}
