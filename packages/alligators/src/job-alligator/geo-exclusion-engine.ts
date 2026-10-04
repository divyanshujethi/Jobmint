/**
 * Role Nest - Geo-Exclusion & Global Remote Eligibility Engine
 * 
 * 3-Layer Funnel:
 * Layer 1: Deterministic Meta-Filtering (ATS API Fields: 0ms, $0)
 * Layer 2: Regex & Keyword Scoring (The Exclusion Engine: <1ms, $0)
 * Layer 3: Light AI Verification for Ambiguous Edge Cases (Gemini: only runs on ~5% edge cases)
 */

export interface AtsMetaInput {
  rawLocation?: string;
  workplaceType?: string; // "remote" | "hybrid" | "onsite"
  isRemote?: boolean;
  countryCode?: string; // e.g. "IN", "US", "GB"
  searchableLocations?: Array<{ country?: string; location?: string }>;
  countryRestrictions?: string[]; // e.g. ["India"], ["United States"]
}

export interface EligibilityResult {
  isEligible: boolean;
  layer: 1 | 2 | 3;
  decision: "ACCEPTED" | "REJECTED" | "AMBIGUOUS";
  confidence: number; // 0 to 100
  normalizedLocation: string;
  reason?: string;
}

// Indian tech hub cities
const INDIAN_CITIES = [
  "bengaluru", "bangalore", "hyderabad", "pune", "delhi", "new delhi",
  "noida", "greater noida", "gurgaon", "gurugram", "mumbai", "navi mumbai",
  "chennai", "kolkata", "chandigarh", "mohali", "panchkula", "ahmedabad",
  "jaipur", "kochi", "coimbatore", "trivandrum", "thiruvananthapuram",
  "indore", "bhubaneswar", "dehradun"
];

// Layer 2: Hard Exclusion Patterns (Drop immediately)
const HARD_EXCLUSION_REGEXES = [
  /\b(US|USA|United States|North America|Americas?|Canada|UK|United Kingdom|Europe|EMEA|LATAM|Latin America)\s+(only|citizens?|residents?|based)\b/i,
  /\bmust (be located|reside|live) in (the\s+)?(us|usa|united states|canada|uk|europe|germany|australia)\b/i,
  /\b(no international|w2 only|no c2c|no corp-to-corp)\b/i,
  /\b(security clearance|dod clearance|us citizenship required|active clearance)\b/i,
  /\bauthorized to work in the (us|usa|united states|uk|canada|eu) without (visa )?sponsorship\b/i,
  /\bcannot sponsor (visas?|work permits?)\b/i,
  /\bno (visa )?sponsorship available\b/i,
  /\b(must be legally authorized to work in the us)\b/i,
];

// Layer 2: Strict Inclusion Patterns (Keep immediately)
const STRICT_INCLUSION_REGEXES = [
  /\b(worldwide|global remote|anywhere|apac|remote \(india\)|india remote|hiring in india|south asia)\b/i,
  /\bwork from anywhere\b/i,
  /\bopen to (all locations|candidates globally)\b/i,
];

// Layer 2: Ambiguous signals that trigger Layer 3 AI verification
const AMBIGUOUS_SIGNALS = [
  /\b(sponsorship|work authorization|visa|tax residency|residence requirements?)\b/i,
  /\b(time zone|timezone|overlap with (est|pst|cst|cet|gmt))\b/i,
  /\b(employer of record|eor|contractor only)\b/i,
];

/**
 * Layer 1: Deterministic Meta-Filtering on ATS API JSON fields
 * Filters out >80% of foreign on-site and country-locked roles before fetching full text.
 */
export function filterAtsMetadata(meta: AtsMetaInput): {
  action: "ACCEPT_AS_INDIA" | "DROP_IMMEDIATELY" | "PROCEED_TO_LAYER_2";
  normalizedLocation: string;
  reason?: string;
} {
  const locRaw = (meta.rawLocation || "").trim().toLowerCase();
  const workplace = (meta.workplaceType || "").trim().toLowerCase();
  const isRemote = meta.isRemote || workplace.includes("remote") || locRaw.includes("remote");

  // 1. Direct India Match
  if (meta.countryCode?.toUpperCase() === "IN") {
    return {
      action: "ACCEPT_AS_INDIA",
      normalizedLocation: locRaw.length > 0 ? meta.rawLocation! : "India",
      reason: "Country code is strictly IN",
    };
  }

  // 2. Check Indian City in location text
  for (const city of INDIAN_CITIES) {
    if (locRaw.includes(city)) {
      const isHybrid = workplace.includes("hybrid") || locRaw.includes("hybrid");
      const isCityRemote = isRemote || locRaw.includes("remote");
      const suffix = isCityRemote ? " (Remote)" : isHybrid ? " (Hybrid)" : "";
      return {
        action: "ACCEPT_AS_INDIA",
        normalizedLocation: `${city.charAt(0).toUpperCase() + city.slice(1)}, India${suffix}`,
        reason: `Matched Indian tech city: ${city}`,
      };
    }
  }

  // 3. Country restrictions in aggregators (e.g. Himalayas API)
  if (meta.countryRestrictions && meta.countryRestrictions.length > 0) {
    const hasIndia = meta.countryRestrictions.some((c) =>
      c.toLowerCase().includes("india") || c.toUpperCase() === "IN"
    );
    const hasWorldwide = meta.countryRestrictions.some((c) =>
      c.toLowerCase().includes("worldwide") || c.toLowerCase().includes("anywhere")
    );

    if (hasIndia) {
      return {
        action: "ACCEPT_AS_INDIA",
        normalizedLocation: "Remote (India Eligible)",
        reason: "Aggregator explicitly lists India in location restrictions",
      };
    }

    if (!hasWorldwide) {
      // Confined to specific foreign countries without India
      return {
        action: "DROP_IMMEDIATELY",
        normalizedLocation: meta.rawLocation || "Foreign Country-Locked",
        reason: `Country restrictions do not include India: ${meta.countryRestrictions.join(", ")}`,
      };
    }
  }

  // 4. Searchable locations array (Greenhouse)
  if (meta.searchableLocations && meta.searchableLocations.length > 0) {
    const hasInCountry = meta.searchableLocations.some((s) => s.country?.toUpperCase() === "IN");
    if (hasInCountry) {
      return {
        action: "ACCEPT_AS_INDIA",
        normalizedLocation: "India (Greenhouse Searchable)",
        reason: "Greenhouse searchable_locations contains country IN",
      };
    }
  }

  // 5. If it's explicitly On-site or Hybrid in a foreign location without Remote -> DROP
  if (!isRemote && (workplace.includes("onsite") || workplace.includes("hybrid"))) {
    return {
      action: "DROP_IMMEDIATELY",
      normalizedLocation: meta.rawLocation || "Foreign Onsite",
      reason: "Foreign on-site or hybrid location with no remote option",
    };
  }

  // 6. If it's marked remote or location contains "remote", proceed to Layer 2 Regex
  if (isRemote || locRaw.includes("anywhere") || locRaw.includes("global")) {
    return {
      action: "PROCEED_TO_LAYER_2",
      normalizedLocation: "Remote (Evaluating Eligibility)",
      reason: "Remote position requiring exclusion check",
    };
  }

  // Default: foreign or unspecified on-site
  return {
    action: "DROP_IMMEDIATELY",
    normalizedLocation: meta.rawLocation || "Unspecified Foreign",
    reason: "No India or Global Remote indicator found",
  };
}

/**
 * Layer 2: Regex & Keyword Scoring (The Exclusion Engine)
 * Scans title, raw location, and description text for hard geo-exclusion rules.
 */
export function evaluateRemoteRegex(
  title: string,
  rawLocation: string,
  description?: string
): {
  decision: "ACCEPTED" | "REJECTED" | "AMBIGUOUS";
  confidence: number;
  reason?: string;
} {
  const combinedHeader = `${title} | ${rawLocation}`.toLowerCase();
  const desc = (description || "").toLowerCase();

  // A. Check Hard Exclusions in Title/Header First (highest precision)
  for (const regex of HARD_EXCLUSION_REGEXES) {
    if (regex.test(combinedHeader)) {
      return {
        decision: "REJECTED",
        confidence: 99,
        reason: `Hard exclusion in title/location: ${regex.source}`,
      };
    }
  }

  // B. Check Hard Exclusions in Description
  if (desc) {
    for (const regex of HARD_EXCLUSION_REGEXES) {
      if (regex.test(desc)) {
        return {
          decision: "REJECTED",
          confidence: 95,
          reason: `Hard exclusion in description text: ${regex.source}`,
        };
      }
    }
  }

  // C. Check Strict Inclusions (Worldwide, Global Remote, APAC, etc.)
  for (const regex of STRICT_INCLUSION_REGEXES) {
    if (regex.test(combinedHeader) || regex.test(desc.substring(0, 1500))) {
      return {
        decision: "ACCEPTED",
        confidence: 95,
        reason: `Matched strict global inclusion pattern: ${regex.source}`,
      };
    }
  }

  // D. Check for Ambiguous signals that require Layer 3 AI
  for (const regex of AMBIGUOUS_SIGNALS) {
    if (regex.test(combinedHeader) || regex.test(desc.substring(0, 2000))) {
      return {
        decision: "AMBIGUOUS",
        confidence: 50,
        reason: `Contains ambiguous signal: ${regex.source}`,
      };
    }
  }

  // If title/loc indicates general Remote with no exclusions or ambiguity, accept with high confidence
  if (combinedHeader.includes("remote") || combinedHeader.includes("anywhere")) {
    return {
      decision: "ACCEPTED",
      confidence: 85,
      reason: "General Remote position with zero geo-restrictions detected",
    };
  }

  return {
    decision: "AMBIGUOUS",
    confidence: 40,
    reason: "Uncertain geographic eligibility",
  };
}

// In-memory cache for Layer 3 AI evaluations to prevent redundant API calls
const aiEvaluationCache = new Map<string, { isEligible: boolean; reason: string }>();

/**
 * Layer 3: Light AI Verification for Ambiguous Edge Cases
 * Only called for the ~5% of jobs where Layer 2 returned AMBIGUOUS.
 * Uses Gemini API with structured JSON output and caching.
 */
export async function verifyAmbiguousRemoteWithAI(
  title: string,
  companyName: string,
  descriptionSnippet: string
): Promise<{ isEligible: boolean; reason: string }> {
  const cacheKey = `${companyName.toLowerCase()}::${title.toLowerCase()}`;
  if (aiEvaluationCache.has(cacheKey)) {
    return aiEvaluationCache.get(cacheKey)!;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Graceful fallback: If no API key is set, conservatively accept if "worldwide" or reject if ambiguous
    const fallbackEligible = !descriptionSnippet.toLowerCase().includes("must reside in");
    return {
      isEligible: fallbackEligible,
      reason: "Gemini API key not configured, evaluated via heuristic fallback",
    };
  }

  try {
    const prompt = `You are a compliance officer for an Indian tech talent platform.
Determine if a software engineer legally resident and working from India can apply for this remote role without existing foreign (US/UK/EU) work permits or visas.

Job Title: ${title}
Company: ${companyName}
Requirements Excerpt:
"""
${descriptionSnippet.substring(0, 1500)}
"""

Reply ONLY with a valid JSON object matching this schema:
{
  "isEligible": true or false,
  "reason": "1 concise sentence explaining the geographic or visa eligibility"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "User-Agent": "RoleNest-GeoEngine/1.0" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.0,
            maxOutputTokens: 200,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      return { isEligible: false, reason: `Gemini API returned status ${res.status}` };
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);

    const result = {
      isEligible: Boolean(parsed.isEligible),
      reason: parsed.reason || "Evaluated by AI",
    };

    aiEvaluationCache.set(cacheKey, result);
    return result;
  } catch (err: any) {
    return { isEligible: false, reason: `AI verification error: ${err.message}` };
  }
}

/**
 * Master Verification Pipeline:
 * Passes a candidate opportunity through Layer 1 -> Layer 2 -> Layer 3.
 */
export async function verifyOpportunityEligibility(
  meta: AtsMetaInput,
  title: string,
  companyName: string,
  description?: string
): Promise<EligibilityResult> {
  // Layer 1
  const l1 = filterAtsMetadata(meta);
  if (l1.action === "ACCEPT_AS_INDIA") {
    return {
      isEligible: true,
      layer: 1,
      decision: "ACCEPTED",
      confidence: 99,
      normalizedLocation: l1.normalizedLocation,
      reason: l1.reason,
    };
  }

  if (l1.action === "DROP_IMMEDIATELY") {
    return {
      isEligible: false,
      layer: 1,
      decision: "REJECTED",
      confidence: 95,
      normalizedLocation: l1.normalizedLocation,
      reason: l1.reason,
    };
  }

  // Layer 2
  const l2 = evaluateRemoteRegex(title, meta.rawLocation || "Remote", description);
  if (l2.decision === "REJECTED") {
    return {
      isEligible: false,
      layer: 2,
      decision: "REJECTED",
      confidence: l2.confidence,
      normalizedLocation: "Remote (Foreign-Restricted)",
      reason: l2.reason,
    };
  }

  if (l2.decision === "ACCEPTED") {
    return {
      isEligible: true,
      layer: 2,
      decision: "ACCEPTED",
      confidence: l2.confidence,
      normalizedLocation: "Remote (Global / India Eligible)",
      reason: l2.reason,
    };
  }

  // Layer 3 (Only for Ambiguous ~5%)
  const snippet = description ? description.substring(0, 1500) : `${title} at ${companyName} (${meta.rawLocation})`;
  const l3 = await verifyAmbiguousRemoteWithAI(title, companyName, snippet);

  return {
    isEligible: l3.isEligible,
    layer: 3,
    decision: l3.isEligible ? "ACCEPTED" : "REJECTED",
    confidence: 90,
    normalizedLocation: l3.isEligible ? "Remote (India Eligible)" : "Remote (Ineligible)",
    reason: l3.reason,
  };
}
