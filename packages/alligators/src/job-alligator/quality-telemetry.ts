/**
 * RoleNest - Quality Monitoring, Deduplication & Telemetry Suite (Phase 4)
 *
 * Implements:
 * 1. Consultancy Contamination Shield:
 *    - Strict regex guards to intercept third-party placement agencies, staffing brokers,
 *      and consultancy re-posters ("Client of...", "Leading MNC Client", "Recruitment Services").
 * 2. Fingerprint Deduplication Engine:
 *    - Normalized canonical hash on (company, normalized_title, city, job_type)
 *      to eliminate re-postings with tracking parameters or UTM codes.
 * 3. Dead-Link Reaper:
 *    - Automated verification of older listings against soft-404s, redirects, and 404/410 codes.
 * 4. Active Job Telemetry & Analytics:
 *    - Real-time aggregation of active jobs per company, role taxonomy breakdown,
 *      and India location distribution.
 */

import crypto from "crypto";

// -------------------------------------------------------------
// 1. CONSULTANCY & STAFFING CONTAMINATION SHIELD
// -------------------------------------------------------------

const CONSULTANCY_PATTERNS: RegExp[] = [
  /\b(client of\s+[a-z0-9_\-\s]+)\b/i,
  /\b(leading mnc client|confidential client|reputed client|top it client)\b/i,
  /\b(placement (?:services|consultancy|consultants?))\b/i,
  /\b(staffing (?:solutions|services|group|partners|agency))\b/i,
  /\b(recruitment (?:solutions|agency|firm|partner|consultancy|services))\b/i,
  /\b(manpower (?:consultancy|services|solutions))\b/i,
  /\b(talent (?:hunters?|pool staffing|acquisition consultants))\b/i,
  /\b(hr (?:solutions|consultancy|services private limited))\b/i,
  /\b(walk-?in\s+(?:interview\s+at|for)\s+consultancy)\b/i,
  /\b(no fees charged|free placement|charges apply)\b/i,
];

const KNOWN_CONSULTANCY_NAMES: string[] = [
  "apex consultancy",
  "adecco",
  "randstad",
  "manpowergroup",
  "michael page",
  "kelly services",
  "allegis group",
  "teamlease",
  "quess corp",
  "genius consultants",
  "abc consultants",
  "careernet",
  "ikya human capital",
  "planman consulting",
  "mount talent consulting",
];

export function checkConsultancyContamination(
  companyName: string,
  title: string,
  description?: string
): { isContaminated: boolean; reason?: string } {
  const compLower = companyName.trim().toLowerCase();
  const titleLower = title.trim().toLowerCase();
  const descLower = (description || "").toLowerCase();

  // 1. Check known consultancy names
  if (KNOWN_CONSULTANCY_NAMES.some((c) => compLower.includes(c))) {
    return {
      isContaminated: true,
      reason: `Company [${companyName}] is identified as a third-party staffing/consultancy agency.`,
    };
  }

  // 2. Check consultancy patterns in company name
  for (const pat of CONSULTANCY_PATTERNS) {
    if (pat.test(compLower)) {
      return {
        isContaminated: true,
        reason: `Company name matches staffing/consultancy pattern: ${pat.source}`,
      };
    }
  }

  // 3. Check consultancy patterns in job title
  for (const pat of CONSULTANCY_PATTERNS) {
    if (pat.test(titleLower)) {
      return {
        isContaminated: true,
        reason: `Job title contains consultancy indicator: ${pat.source}`,
      };
    }
  }

  // 4. Check description header for "Client of" or "Hiring for our client"
  if (descLower.length > 0) {
    const headerSnippet = descLower.slice(0, 1500);
    if (
      headerSnippet.includes("hiring for one of our clients") ||
      headerSnippet.includes("our client is a leading") ||
      headerSnippet.includes("opening with our client")
    ) {
      return {
        isContaminated: true,
        reason: "Job description indicates position is sourced on behalf of an anonymous third-party client.",
      };
    }
  }

  return { isContaminated: false };
}

// -------------------------------------------------------------
// 2. CANONICAL FINGERPRINT DEDUPLICATION
// -------------------------------------------------------------

function cleanStringForHash(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Strips UTM parameters, referral tags, and session IDs from URLs to get canonical form.
 */
export function canonicalizeJobUrl(urlStr: string): string {
  if (!urlStr) return "";
  try {
    const url = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
    // Strip common tracking parameters
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "ref", "referer", "referrer", "source", "gh_jid", "lever-source",
      "sr_share", "token", "fbclid", "gclid", "tracking", "trk"
    ];
    for (const p of trackingParams) {
      url.searchParams.delete(p);
    }
    // Remove trailing slash
    return url.toString().replace(/\/$/, "");
  } catch {
    return urlStr.split("?")[0].replace(/\/$/, "");
  }
}

/**
 * Generates an idempotent fingerprint hash for detecting duplicate postings
 * even if they have slightly varied titles, casing, or query parameters.
 */
export function generateJobFingerprint(
  companyName: string,
  title: string,
  city?: string,
  jobType?: string
): string {
  const normComp = cleanStringForHash(companyName);
  const normTitle = cleanStringForHash(title)
    .replace(/\b(immediate joiner|urgent hiring|hiring for|fresher|batch \d{4})\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const normCity = city ? cleanStringForHash(city) : "any";
  const normType = jobType ? cleanStringForHash(jobType) : "ft";

  const rawKey = `${normComp}::${normTitle}::${normCity}::${normType}`;
  return crypto.createHash("sha256").update(rawKey).digest("hex").slice(0, 32);
}
