/**
 * Role Nest - Search Engine Dorking Engine
 * Crawls DuckDuckGo search queries targeting public Greenhouse, Lever, and Ashby boards
 * without browser rendering overhead. Extracts real company slugs and authentic ATS posting links.
 */

import { RawCrawledJob } from "../types";
import { crawlGreenhouseBoard } from "./greenhouse-crawler";
import { crawlLeverSite } from "./lever-crawler";
import { crawlAshbyBoard } from "./ashby-crawler";

export interface DorkResult {
  atsType: "greenhouse" | "lever" | "ashby";
  companySlug: string;
  jobId?: string;
  sourceUrl: string;
}

const DEFAULT_DORKS = [
  'site:boards.greenhouse.io "software engineer" "india"',
  'site:boards.greenhouse.io "developer" "bengaluru"',
  'site:jobs.lever.co "software engineer" "india"',
  'site:jobs.lever.co "developer" "worldwide"',
  'site:jobs.ashbyhq.com "engineer" "india"',
  'site:jobs.ashbyhq.com "software" "remote"',
];

/**
 * Executes a DuckDuckGo HTML dork search and parses the target ATS URLs.
 */
export async function executeSearchDork(query: string): Promise<DorkResult[]> {
  const results: DorkResult[] = [];
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      console.warn(`[Search Dorker] DDG query returned status ${response.status}`);
      return [];
    }

    const html = await response.text();
    // DuckDuckGo encodes external redirect links in uddg parameter
    const uddgMatches = [...html.matchAll(/uddg=([^&"']+)/g)].map((m) =>
      decodeURIComponent(m[1] || "")
    );

    for (const link of uddgMatches) {
      try {
        const parsed = new URL(link);
        const host = parsed.hostname.toLowerCase();

        // 1. Greenhouse: boards.greenhouse.io/{slug}/jobs/{id}
        if (host.includes("greenhouse.io")) {
          const parts = parsed.pathname.split("/").filter(Boolean);
          const slug = parts[0];
          const jobId = parts[2] || parts[1];
          if (slug && slug !== "embed") {
            results.push({
              atsType: "greenhouse",
              companySlug: slug,
              jobId,
              sourceUrl: link,
            });
          }
        }

        // 2. Lever: jobs.lever.co/{slug}/{id}
        if (host.includes("lever.co")) {
          const parts = parsed.pathname.split("/").filter(Boolean);
          const slug = parts[0];
          const jobId = parts[1];
          if (slug) {
            results.push({
              atsType: "lever",
              companySlug: slug,
              jobId,
              sourceUrl: link,
            });
          }
        }

        // 3. Ashby: jobs.ashbyhq.com/{slug}/{id}
        if (host.includes("ashbyhq.com")) {
          const parts = parsed.pathname.split("/").filter(Boolean);
          const slug = parts[0];
          const jobId = parts[1];
          if (slug) {
            results.push({
              atsType: "ashby",
              companySlug: slug,
              jobId,
              sourceUrl: link,
            });
          }
        }
      } catch {
        // ignore invalid URL
      }
    }
  } catch (err: any) {
    console.error(`[Search Dorker] Failed on query "${query}":`, err.message);
  }

  return results;
}

/**
 * Runs all search dorks, discovers new company board tokens,
 * and fetches the latest verified jobs through their official public ATS APIs.
 */
export async function crawlViaSearchDorking(options?: {
  dorks?: string[];
  maxPerCompany?: number;
}): Promise<RawCrawledJob[]> {
  const dorks = options?.dorks || DEFAULT_DORKS;
  const maxPerCompany = options?.maxPerCompany ?? 10;
  const discoveredBoards = new Map<string, DorkResult>();

  // 1. Run all dorks in parallel with jitter
  const dorkResults = await Promise.all(
    dorks.map(async (d, i) => {
      if (i > 0) {
        await new Promise((resolve) => setTimeout(resolve, i * 200));
      }
      return executeSearchDork(d);
    })
  );

  for (const list of dorkResults) {
    for (const item of list) {
      const key = `${item.atsType}::${item.companySlug}`;
      if (!discoveredBoards.has(key)) {
        discoveredBoards.set(key, item);
      }
    }
  }

  const jobs: RawCrawledJob[] = [];

  // 2. Fetch jobs directly from the official ATS APIs of the discovered companies
  for (const board of discoveredBoards.values()) {
    try {
      const cleanName = board.companySlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      if (board.atsType === "greenhouse") {
        const ghJobs = await crawlGreenhouseBoard(board.companySlug, cleanName);
        jobs.push(...ghJobs.slice(0, maxPerCompany));
      } else if (board.atsType === "lever") {
        const leverJobs = await crawlLeverSite(board.companySlug, cleanName);
        jobs.push(...leverJobs.slice(0, maxPerCompany));
      } else if (board.atsType === "ashby") {
        const ashbyJobs = await crawlAshbyBoard(
          {
            companyName: cleanName,
            token: board.companySlug,
            website: `https://${board.companySlug}.com`,
          },
          { maxPerCompany }
        );
        jobs.push(...ashbyJobs);
      }
    } catch {
      // Continue to next board if one fails
    }
  }

  return jobs;
}
