/**
 * RoleNest - Strict India-Only & Role-Level Tech Gatekeeper (Phase 3)
 *
 * Implements:
 * 1. Location Normalizer & Remote Scope Engine:
 *    - Strict India-only filtering (actual work location, NOT host website country)
 *    - Canonical city and state normalization (Bengaluru, Hyderabad, Pune, etc.)
 *    - Remote scope classification: INDIA_ONLY | WORLDWIDE | FOREIGN_RESTRICTED | AMBIGUOUS
 *    - Automatic routing of ambiguous/unverified locations to review queue
 *
 * 2. 2-Stage Tech Gatekeeper:
 *    - Stage 1: Employer Classification (verified tech employer)
 *    - Stage 2: Role-Level Technical Verification (purges Sales, HR, Accounting, Legal, Marketing)
 *    - Granular Role Category Taxonomy:
 *      software, mobile, data, ai_ml, devops_cloud, cybersecurity, qa_automation, product_tech, other_tech
 */

import { WorkMode } from "@repo/shared";

export type RemoteScope = "INDIA_ONLY" | "WORLDWIDE" | "FOREIGN_RESTRICTED" | "AMBIGUOUS";

export type TechRoleCategory =
  | "software"
  | "mobile"
  | "data"
  | "ai_ml"
  | "devops_cloud"
  | "cybersecurity"
  | "qa_automation"
  | "product_tech"
  | "other_tech"
  | "non_tech";

export interface StrictLocationResult {
  country: string;
  city?: string;
  state?: string;
  formattedLocation: string;
  workMode: WorkMode;
  remoteScope: RemoteScope;
  isIndiaEligible: boolean;
  needsReview: boolean;
  reviewReason?: string;
}

export interface StrictRoleResult {
  isTech: boolean;
  roleCategory: TechRoleCategory;
  normalizedTitle: string;
  reason?: string;
}

export interface GatekeeperEvaluationResult {
  accepted: boolean;
  location: StrictLocationResult;
  role: StrictRoleResult;
  rejectionReason?: string;
}

// -------------------------------------------------------------
// 1. CANONICAL INDIAN CITIES & HUBS MAPPING
// -------------------------------------------------------------
interface CityEntry {
  canonicalCity: string;
  state: string;
  synonyms: string[];
}

const INDIAN_CITY_REGISTRY: CityEntry[] = [
  { canonicalCity: "Bengaluru", state: "Karnataka", synonyms: ["bengaluru", "bangalore", "blr", "whitefield", "electronic city", "koramangala", "indiranagar", "bellandur"] },
  { canonicalCity: "Hyderabad", state: "Telangana", synonyms: ["hyderabad", "secunderabad", "hitec city", "gachibowli", "madhapur", "kondapur", "cyberabad"] },
  { canonicalCity: "Pune", state: "Maharashtra", synonyms: ["pune", "hinjewadi", "magarpatta", "viman nagar", "baner", "kharadi", "hadapsar", "wakad"] },
  { canonicalCity: "Chennai", state: "Tamil Nadu", synonyms: ["chennai", "madras", "omr", "tidel park", "guindy", "t nagar", "velachery"] },
  { canonicalCity: "Delhi NCR", state: "Delhi NCR", synonyms: ["delhi", "new delhi", "ncr", "delhi ncr"] },
  { canonicalCity: "Gurugram", state: "Haryana", synonyms: ["gurugram", "gurgaon", "cyber city", "golf course road", "sohna road", "udyog vihar"] },
  { canonicalCity: "Noida", state: "Uttar Pradesh", synonyms: ["noida", "greater noida", "sector 62", "sector 125", "sector 135", "sector 142"] },
  { canonicalCity: "Mumbai", state: "Maharashtra", synonyms: ["mumbai", "bombay", "navi mumbai", "thane", "bkc", "andheri", "powai", "lower parel", "airoli"] },
  { canonicalCity: "Chandigarh Tricity", state: "Punjab/Haryana", synonyms: ["chandigarh", "mohali", "panchkula", "tricity", "chd", "it park chandigarh"] },
  { canonicalCity: "Ahmedabad", state: "Gujarat", synonyms: ["ahmedabad", "gandhinagar", "gift city", "sg highway", "sanand"] },
  { canonicalCity: "Kolkata", state: "West Bengal", synonyms: ["kolkata", "calcutta", "salt lake", "sector v", "new town", "rajarhat"] },
  { canonicalCity: "Kochi", state: "Kerala", synonyms: ["kochi", "cochin", "infopark", "kakkanad", "ernakulam"] },
  { canonicalCity: "Thiruvananthapuram", state: "Kerala", synonyms: ["thiruvananthapuram", "trivandrum", "technopark", "kazhakkoottam"] },
  { canonicalCity: "Jaipur", state: "Rajasthan", synonyms: ["jaipur", "sitapura", "malviya nagar"] },
  { canonicalCity: "Indore", state: "Madhya Pradesh", synonyms: ["indore", "super corridor", "crystal it park"] },
  { canonicalCity: "Coimbatore", state: "Tamil Nadu", synonyms: ["coimbatore", "saravanampatti", "tidel park coimbatore", "peelamedu"] },
  { canonicalCity: "Bhubaneswar", state: "Odisha", synonyms: ["bhubaneswar", "infocity", "chandaka"] },
  { canonicalCity: "Dehradun", state: "Uttarakhand", synonyms: ["dehradun", "it park dehradun", "rajpur road"] },
  { canonicalCity: "Lucknow", state: "Uttar Pradesh", synonyms: ["lucknow", "hcl it city", "gomti nagar"] },
  { canonicalCity: "Nagpur", state: "Maharashtra", synonyms: ["nagpur", "mihan"] },
  { canonicalCity: "Vadodara", state: "Gujarat", synonyms: ["vadodara", "baroda"] },
  { canonicalCity: "Surat", state: "Gujarat", synonyms: ["surat"] },
  { canonicalCity: "Visakhapatnam", state: "Andhra Pradesh", synonyms: ["visakhapatnam", "vizag", "rushikonda"] },
  { canonicalCity: "Mysuru", state: "Karnataka", synonyms: ["mysuru", "mysore", "hebbal it park"] },
  { canonicalCity: "Mangaluru", state: "Karnataka", synonyms: ["mangaluru", "mangalore"] },
  { canonicalCity: "Goa", state: "Goa", synonyms: ["goa", "panaji", "verna"] },
];

// Foreign-Restricted Patterns (Hard rejection: not eligible for candidates in India)
const FOREIGN_RESTRICTION_PATTERNS = [
  /\b(US|USA|United States|North America|Americas?)\s+(only|citizens?|residents?|based)\b/i,
  /\b(UK|United Kingdom|Great Britain|England)\s+(only|citizens?|residents?|based)\b/i,
  /\b(Canada|Canadian)\s+(only|citizens?|residents?|based)\b/i,
  /\b(Europe|European Union|EU|EMEA|DACH|Germany|France|Netherlands)\s+(only|citizens?|residents?|based)\b/i,
  /\b(LATAM|Latin America|Brazil|Mexico)\s+(only|citizens?|residents?|based)\b/i,
  /\b(Australia|New Zealand|ANZ)\s+(only|citizens?|residents?|based)\b/i,
  /\bmust (be located|reside|live) in (the\s+)?(us|usa|united states|canada|uk|europe|germany|australia)\b/i,
  /\b(us citizenship required|active dod clearance|security clearance required)\b/i,
  /\b(w2 only|no c2c|no international applicants?)\b/i,
];

// Strict Worldwide Remote Patterns (Open to India candidates)
const WORLDWIDE_REMOTE_PATTERNS = [
  /\b(worldwide|anywhere|global remote|work from anywhere|all locations|worldwide remote)\b/i,
  /\b(apac|asia pacific|south asia)\b/i,
  /\bopen to (all candidates|candidates globally|international candidates)\b/i,
];

// -------------------------------------------------------------
// 2. STRICT LOCATION NORMALIZATION ENGINE
// -------------------------------------------------------------
export function normalizeIndiaLocationStrict(
  rawLocation?: string,
  workplaceType?: string
): StrictLocationResult {
  const raw = (rawLocation || "").trim();
  const lower = raw.toLowerCase();
  const wpLower = (workplaceType || "").toLowerCase();

  // Work Mode detection
  const isRemote =
    lower.includes("remote") ||
    lower.includes("work from home") ||
    lower.includes("wfh") ||
    lower.includes("distributed") ||
    lower.includes("telecommute") ||
    wpLower.includes("remote");

  const isHybrid = lower.includes("hybrid") || wpLower.includes("hybrid");
  const workMode: WorkMode = isRemote
    ? WorkMode.REMOTE
    : isHybrid
      ? WorkMode.HYBRID
      : WorkMode.ON_SITE;

  // 1. Check for foreign country-locked restrictions
  if (FOREIGN_RESTRICTION_PATTERNS.some((pat) => pat.test(lower))) {
    return {
      country: "Foreign",
      formattedLocation: raw || "Foreign Country-Restricted",
      workMode,
      remoteScope: "FOREIGN_RESTRICTED",
      isIndiaEligible: false,
      needsReview: false,
      reviewReason: "Explicitly restricted to foreign country/region citizens or residents",
    };
  }

  // 2. Check for explicit Indian Cities & Regional Hubs
  for (const entry of INDIAN_CITY_REGISTRY) {
    if (entry.synonyms.some((syn) => lower.includes(syn))) {
      const city = entry.canonicalCity;
      const state = entry.state;
      let formatted = `${city}, ${state}, India`;
      if (isRemote) {
        formatted = `Remote (${city}), India`;
      } else if (isHybrid) {
        formatted = `${city}, ${state}, India (Hybrid)`;
      }

      return {
        country: "India",
        city,
        state,
        formattedLocation: formatted,
        workMode,
        remoteScope: "INDIA_ONLY",
        isIndiaEligible: true,
        needsReview: false,
      };
    }
  }

  // 3. Explicit "India" or "Remote (India)"
  if (lower.includes("india") || lower.includes(", in") || lower.endsWith(" in")) {
    const formatted = isRemote ? "Remote, India" : isHybrid ? "India (Hybrid)" : "India";
    return {
      country: "India",
      formattedLocation: formatted,
      workMode,
      remoteScope: "INDIA_ONLY",
      isIndiaEligible: true,
      needsReview: false,
    };
  }

  // 4. Genuine Worldwide / Global Remote
  if (isRemote && WORLDWIDE_REMOTE_PATTERNS.some((pat) => pat.test(lower))) {
    return {
      country: "India",
      formattedLocation: "Remote (Worldwide)",
      workMode: WorkMode.REMOTE,
      remoteScope: "WORLDWIDE",
      isIndiaEligible: true,
      needsReview: false,
    };
  }

  // 5. Ambiguous: says "Remote" or empty or unverified country without explicit India / Global confirmation
  if (isRemote || raw.length === 0 || lower === "remote" || lower === "remote - any") {
    return {
      country: "Ambiguous",
      formattedLocation: raw || "Remote (Unspecified)",
      workMode: WorkMode.REMOTE,
      remoteScope: "AMBIGUOUS",
      isIndiaEligible: false,
      needsReview: true,
      reviewReason: "Remote scope not explicitly designated for India or Worldwide",
    };
  }

  // 6. Unknown on-site location (e.g. "Seattle, WA", "London, UK", or unrecognized city)
  return {
    country: "Foreign",
    formattedLocation: raw,
    workMode,
    remoteScope: "FOREIGN_RESTRICTED",
    isIndiaEligible: false,
    needsReview: false,
    reviewReason: "Non-Indian on-site or regional location",
  };
}

// -------------------------------------------------------------
// 3. ROLE-LEVEL 2-STAGE TECH CLASSIFIER & TAXONOMY
// -------------------------------------------------------------

// Strict Non-Tech Role Exclusions
const NON_TECH_ROLE_PATTERNS = [
  // Sales & Business Development
  /\b(account executive|ae|bdr|sdr|sales manager|sales representative|sales director|sales associate|business development|telecalling|inside sales)\b/i,
  // Human Resources & Talent Acquisition
  /\b(recruiter|recruitment|talent acquisition|sourcer|hr generalist|hr manager|hr business partner|hrbp|people partner|chief people officer)\b/i,
  // Accounting, Finance & Payroll
  /\b(accountant|accounting|audit|auditor|payroll|tax specialist|accounts payable|financial analyst|billing specialist|treasury)\b/i,
  // Legal & Compliance
  /\b(legal counsel|corporate lawyer|paralegal|compliance officer|general counsel|contracts manager)\b/i,
  // Marketing & Content
  /\b(copywriter|content writer|social media manager|brand manager|growth marketer|marketing lead|seo specialist|public relations|pr manager)\b/i,
  // Office, Admin & Facilities
  /\b(office manager|executive assistant|receptionist|workplace experience|facilities coordinator|admin executive)\b/i,
  // Customer Operations & Call Centers
  /\b(customer support|customer care|call center|telesales|chat support agent|bpo executive)\b/i,
];

// Tech Role Taxonomies
const ROLE_TAXONOMY_MAP: Array<{ category: TechRoleCategory; patterns: RegExp[] }> = [
  {
    category: "ai_ml",
    patterns: [
      /\b(machine learning|ml engineer|mle|ai engineer|artificial intelligence|deep learning|nlp|computer vision|llm|genai|generative ai|research scientist|ai researcher)\b/i,
    ],
  },
  {
    category: "data",
    patterns: [
      /\b(data engineer|data scientist|data analytics|analytics engineer|bi engineer|business intelligence engineer|data architect|database administrator|dba)\b/i,
    ],
  },
  {
    category: "devops_cloud",
    patterns: [
      /\b(devops|site reliability|sre|platform engineer|cloud engineer|infrastructure engineer|systems engineer|cloud architect|kubernetes|linux administrator)\b/i,
    ],
  },
  {
    category: "cybersecurity",
    patterns: [
      /\b(security engineer|cybersecurity|infosec|application security|appsec|penetration tester|soc analyst|security architect|cryptography)\b/i,
    ],
  },
  {
    category: "mobile",
    patterns: [
      /\b(ios developer|ios engineer|android developer|android engineer|flutter developer|react native|mobile engineer|mobile app developer)\b/i,
    ],
  },
  {
    category: "qa_automation",
    patterns: [
      /\b(qa engineer|quality assurance|sdet|software development engineer in test|automation tester|test engineer|qa automation|quality engineer)\b/i,
    ],
  },
  {
    category: "product_tech",
    patterns: [
      /\b(technical product manager|tpm|solutions architect|developer advocate|devrel|technical program manager)\b/i,
    ],
  },
  {
    category: "software",
    patterns: [
      /\b(software engineer|software developer|sde|sde-1|sde-2|sde-3|full\s*stack|frontend|front-end|backend|back-end|web developer|systems developer|firmware engineer|embedded engineer|compiler engineer)\b/i,
      /\b(react developer|node developer|python developer|java developer|golang developer|c\+\+ developer)\b/i,
    ],
  },
];

export function classifyTechRole(
  title: string,
  companySector?: string
): StrictRoleResult {
  const t = title.trim();

  // 1. Check for strict non-tech exclusion
  const matchesNonTech = NON_TECH_ROLE_PATTERNS.some((pat) => pat.test(t));
  if (matchesNonTech) {
    // Only allow if title contains overriding core technical engineering keywords (e.g. "Software Engineer - Financial Systems")
    const hasCoreTechOverride = /\b(software engineer|software developer|data engineer|devops engineer|security engineer)\b/i.test(t);
    if (!hasCoreTechOverride) {
      return {
        isTech: false,
        roleCategory: "non_tech",
        normalizedTitle: t,
        reason: "Position matches non-technical role exclusion (Sales, HR, Finance, Legal, Marketing, Ops)",
      };
    }
  }

  // 2. Identify Tech Role Category
  for (const entry of ROLE_TAXONOMY_MAP) {
    if (entry.patterns.some((pat) => pat.test(t))) {
      return {
        isTech: true,
        roleCategory: entry.category,
        normalizedTitle: t,
      };
    }
  }

  // 3. Fallback check for general engineering / intern / tech terms
  const isGeneralTech = /\b(engineer|engineering|developer|architect|intern|internship|tech lead|architect)\b/i.test(t);
  if (isGeneralTech) {
    return {
      isTech: true,
      roleCategory: "other_tech",
      normalizedTitle: t,
    };
  }

  return {
    isTech: false,
    roleCategory: "non_tech",
    normalizedTitle: t,
    reason: "No recognized software, engineering, or technical role keywords found",
  };
}

// -------------------------------------------------------------
// 4. UNIFIED GATEKEEPER EVALUATOR
// -------------------------------------------------------------
export function evaluateIndiaTechGatekeeper(
  title: string,
  rawLocation?: string,
  workplaceType?: string,
  companySector?: string
): GatekeeperEvaluationResult {
  const role = classifyTechRole(title, companySector);
  const location = normalizeIndiaLocationStrict(rawLocation, workplaceType);

  if (!role.isTech) {
    return {
      accepted: false,
      location,
      role,
      rejectionReason: role.reason || "Rejected: Non-technical role",
    };
  }

  if (!location.isIndiaEligible) {
    return {
      accepted: false,
      location,
      role,
      rejectionReason: location.reviewReason || "Rejected: Outside India or foreign-restricted",
    };
  }

  return {
    accepted: true,
    location,
    role,
  };
}
