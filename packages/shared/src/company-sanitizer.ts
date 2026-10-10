/**
 * RoleNest - Company Entity Resolution & Sanitization Engine
 *
 * Guarantees that company names ingested into RoleNest:
 * 1. Have all scraper artifacts ("at Foundit Verified Employer", "Naukri Verified Employer") stripped.
 * 2. Have accidental location suffix bleeding ("Amazon India Bengaluru" -> "Amazon") stripped.
 * 3. Reject fake, generic, or corrupt entity names.
 */

const AGGREGATOR_ARTIFACT_PATTERNS = [
  /\s*at\s+Foundit\s+Verified\s+Employer/gi,
  /\s*Foundit\s+Verified\s+Employer/gi,
  /\s*at\s+Naukri\s+Verified\s+Employer/gi,
  /\s*Naukri\s+Verified\s+Employer/gi,
  /\s*at\s+Internshala\b/gi,
  /\s*Internshala\s+Verified\b/gi,
  /\s*at\s+Indeed\b/gi,
  /\s*Verified\s+Employer\b/gi,
];

const LEADING_ROLE_PREFIXES = /^(Manager|Lead|Senior|Director|Staff|Principal|Head\s+of|Architect)\s+/i;

const TRAILING_LOCATION_SUFFIXES = /\s+[-–—,]?\s*(?:India\s+)?(?:Bengaluru|Bangalore|Hyderabad|Pune|Mumbai|Delhi|New\s+Delhi|Noida|Greater\s+Noida|Gurgaon|Gurugram|Chennai|Kolkata|Ahmedabad|Chandigarh|Mohali|Panchkula|Kochi|Cochin|Thiruvananthapuram|Trivandrum|Coimbatore|Indore|Jaipur|Nagpur|Vadodara|Surat|Bhubaneswar|Lucknow|Dehradun|Mysuru|Goa)(?:\s+India)?$/i;

const DISALLOWED_COMPANY_NAMES = new Set([
  "foundit verified employer",
  "naukri verified employer",
  "internshala verified employer",
  "internshala",
  "foundit",
  "naukri",
  "indeed",
  "verified employer",
  "confidential",
  "anonymous",
  "india",
  "unknown",
  "remote",
  "hiring company",
  "company",
]);

/**
 * Clean and resolve authentic company entity name.
 */
export function cleanCompanyName(rawName: string | null | undefined): string {
  if (!rawName || typeof rawName !== "string") return "";

  let cleaned = rawName.trim();

  // 1. Remove scraper artifact tokens
  for (const pat of AGGREGATOR_ARTIFACT_PATTERNS) {
    cleaned = cleaned.replace(pat, "");
  }

  // 2. Remove trailing accidental location bleed (e.g. "Amazon India Bengaluru" -> "Amazon")
  cleaned = cleaned.replace(TRAILING_LOCATION_SUFFIXES, "");

  // 3. Remove accidental role prefixes captured as company name
  cleaned = cleaned.replace(LEADING_ROLE_PREFIXES, "");

  // 4. Clean stray punctuation and whitespace
  cleaned = cleaned
    .replace(/^[-–—:,.\s]+|[-–—:,.\s]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned;
}

/**
 * Validates if the resolved company name is authentic and usable.
 */
export function isValidCompanyName(name: string | null | undefined): boolean {
  if (!name || typeof name !== "string") return false;
  const clean = cleanCompanyName(name);
  if (clean.length < 2 || clean.length > 100) return false;
  if (DISALLOWED_COMPANY_NAMES.has(clean.toLowerCase())) return false;
  if (/^engineers\s+llp$/i.test(clean)) return false;
  if (/^verified\s+/i.test(clean)) return false;
  return true;
}
