import { RawCrawledJob } from "../types";
import { crawlSimplifyInternships } from "./simplify-crawler";

/**
 * Backwards compatible alias for GitHub tech internships crawler
 */
export async function crawlGitHubInternships(limit = 50): Promise<RawCrawledJob[]> {
  return crawlSimplifyInternships({ limit });
}