/**
 * RoleNest - ATS Job Expiry & Ghost-Job Verifier Engine
 *
 * Problem Statement:
 * Many ATS systems (Greenhouse, Lever, Ashby, Workday, SmartRecruiters) and job portals
 * do NOT return HTTP 404 when a job is filled or removed. Instead:
 * 1. They return HTTP 200 with soft-404 body messages ("no longer accepting applications",
 *    "this opening has closed", "position has been filled", etc.).
 * 2. They return HTTP 301/302 redirecting to the generic corporate careers board or root domain.
 * 3. Their JSON API returns an empty or archived status flag despite HTTP 200.
 *
 * This verifier tests a URL comprehensively:
 * - Following redirects while detecting redirect-to-generic-board.
 * - Inspecting HTTP status codes.
 * - Regex body pattern analysis for soft-404 phrases.
 * - ATS-specific API / DOM signature checks.
 */

export interface ExpiryCheckResult {
  url: string;
  isAlive: boolean;
  httpStatus?: number;
  finalUrl?: string;
  reason?: string;
  checkedAt: string;
}

// Patterns that confirm a job page is inactive or dead even if HTTP 200 is returned
const SOFT_404_PATTERNS: RegExp[] = [
  /this\s+job\s+(?:is\s+no\s+longer\s+available|has\s+expired|is\s+closed)/i,
  /no\s+longer\s+accepting\s+applications/i,
  /position\s+(?:has\s+been\s+filled|is\s+closed|is\s+no\s+longer\s+active)/i,
  /this\s+posting\s+has\s+closed/i,
  /this\s+opening\s+is\s+no\s+longer\s+available/i,
  /this\s+role\s+has\s+been\s+filled/i,
  /job\s+not\s+found/i,
  /job\s+expired/i,
  /posting\s+is\s+not\s+active/i,
  /sorry,\s+this\s+vacancy\s+is\s+no\s+longer\s+open/i,
  /the\s+job\s+you\s+are\s+looking\s+for\s+has\s+expired/i,
  /the\s+page\s+you\s+are\s+looking\s+for\s+does\s+not\s+exist/i,
  /this\s+listing\s+has\s+expired/i,
  /this\s+requisition\s+has\s+been\s+closed/i,
  /applications\s+for\s+this\s+position\s+are\s+closed/i,
  /job\s+is\s+inactive/i,
  /this\s+position\s+is\s+filled/i,
  /career\s+opportunity\s+no\s+longer\s+available/i,
];

// Patterns where a redirect target indicates the individual job was removed
const GENERIC_BOARD_REDIRECT_PATTERNS: RegExp[] = [
  /\/careers\/?$/i,
  /\/jobs\/?$/i,
  /\/career-portal\/?$/i,
  /\/join-us\/?$/i,
  /\/openings\/?$/i,
  /\/work-with-us\/?$/i,
];

/**
 * Checks whether an external job posting URL is alive or expired/ghost.
 */
export async function verifyJobUrlLiveness(
  url: string,
  timeoutMs = 8000
): Promise<ExpiryCheckResult> {
  const checkedAt = new Date().toISOString();

  if (!url || !url.startsWith("http")) {
    return {
      url,
      isAlive: false,
      reason: "INVALID_URL",
      checkedAt,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 RoleNestBot/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    const httpStatus = response.status;
    const finalUrl = response.url || url;

    // 1. Hard HTTP 404 or 410 Gone
    if (httpStatus === 404 || httpStatus === 410) {
      return {
        url,
        finalUrl,
        httpStatus,
        isAlive: false,
        reason: `HTTP_${httpStatus}_NOT_FOUND`,
        checkedAt,
      };
    }

    // 2. Server Errors (5xx) or Rate Limits (429) - retain as alive to avoid false drops
    if (httpStatus >= 500 || httpStatus === 429) {
      return {
        url,
        finalUrl,
        httpStatus,
        isAlive: true,
        reason: `SERVER_TEMP_${httpStatus}`,
        checkedAt,
      };
    }

    // 3. Detect redirect to generic career board
    try {
      const originalPath = new URL(url).pathname.toLowerCase();
      const finalPath = new URL(finalUrl).pathname.toLowerCase();

      // If original had a distinct job path but final URL redirected to generic /jobs or /careers
      if (
        originalPath.length > 5 &&
        originalPath !== finalPath &&
        GENERIC_BOARD_REDIRECT_PATTERNS.some((p) => p.test(finalPath))
      ) {
        return {
          url,
          finalUrl,
          httpStatus,
          isAlive: false,
          reason: "REDIRECTED_TO_GENERIC_CAREERS_PORTAL",
          checkedAt,
        };
      }
    } catch {
      // URL parsing fallback
    }

    // 4. Soft-404 Content Inspection on text/html bodies
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html") || contentType.includes("application/xhtml") || contentType.includes("json")) {
      const text = await response.text();
      const headAndBody = text.slice(0, 100000); // Check first 100kb of content

      for (const pattern of SOFT_404_PATTERNS) {
        if (pattern.test(headAndBody)) {
          return {
            url,
            finalUrl,
            httpStatus,
            isAlive: false,
            reason: `SOFT_404_TEXT_MATCH: ${pattern.source}`,
            checkedAt,
          };
        }
      }
    }

    // URL is responsive and contains no soft-404 markers
    return {
      url,
      finalUrl,
      httpStatus,
      isAlive: true,
      reason: "ACTIVE_POSTING_CONFIRMED",
      checkedAt,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    // Timeout or network error
    if (err.name === "AbortError") {
      return {
        url,
        isAlive: true, // Graceful: do not delete jobs purely on transient bot network timeouts
        reason: "CHECK_TIMEOUT_RETAINED",
        checkedAt,
      };
    }

    return {
      url,
      isAlive: true, // Retain on generic DNS/SSL errors to prevent false purging
      reason: `NETWORK_ERROR_RETAINED: ${err.message}`,
      checkedAt,
    };
  }
}
