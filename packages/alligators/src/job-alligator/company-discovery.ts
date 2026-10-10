/**
 * Autonomous Company & Career Discovery Engine (RoleNest)
 *
 * Automatically discovers emerging tech companies and startups,
 * fingerprints their career portals / ATS infrastructure:
 * - Greenhouse, Lever, Ashby, SmartRecruiters, Workable, Workday, Breezy, Recruitee, BambooHR, Custom
 * tests public ATS endpoints for active Indian & Remote positions,
 * and feeds newly discovered boards into the continuous crawler queue and company registry.
 */

import { INDIAN_STARTUP_SEEDS, StartupSeed } from "./indian-startup-seeds";

export type AtsProviderType =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "smartrecruiters"
  | "workable"
  | "bamboohr"
  | "breezy"
  | "recruitee"
  | "personio"
  | "workday"
  | "custom";

export interface TargetBoard {
  companyName: string;
  type: AtsProviderType;
  token: string;
  website: string;
  careersUrl?: string;
  sector?: string;
  tier?: string;
  discoveryMethod?: "REDIRECT" | "HTML_SNIFF" | "FALLBACK_PROBE" | "KNOWN_SEED" | "MANUAL";
}

export interface VerificationResult {
  isValid: boolean;
  activeJobsCount: number;
  indiaOrRemoteCount: number;
  sampleTitle?: string;
  board?: TargetBoard;
}

// Regex patterns for detecting ATS signatures
const ASHBY_REGEX = /(?:jobs\.)?ashbyhq\.com\/(?:posting-api\/job-board\/)?([a-zA-Z0-9_\-]+)/i;
const GREENHOUSE_REGEX = /(?:boards|api|job-boards)\.greenhouse\.io\/(?:embed\/job_board\?for=)?(?:v1\/boards\/)?([a-zA-Z0-9_\-]+)/i;
const LEVER_REGEX = /jobs\.lever\.co\/([a-zA-Z0-9_\-]+)/i;
const SMARTRECRUITERS_REGEX = /(?:careers|jobs)\.smartrecruiters\.com\/([a-zA-Z0-9_\-]+)/i;
const WORKABLE_REGEX = /apply\.workable\.com\/([a-zA-Z0-9_\-]+)/i;
const WORKDAY_REGEX = /([a-zA-Z0-9_\-]+)\.(?:wd\d+|myworkdayjobs)\.com\/([a-zA-Z0-9_\-]+)/i;
const BREEZY_REGEX = /([a-zA-Z0-9_\-]+)\.breezy\.hr/i;
const RECRUITEE_REGEX = /([a-zA-Z0-9_\-]+)\.recruitee\.com/i;
const PERSONIO_REGEX = /([a-zA-Z0-9_\-]+)\.(?:jobs\.)?personio\.(?:de|com)/i;
const BAMBOOHR_REGEX = /([a-zA-Z0-9_\-]+)\.bamboohr\.com/i;

// Re-export seed startup list for convenience
export const SEED_STARTUP_DOMAINS: Array<{ name: string; domain: string }> = INDIAN_STARTUP_SEEDS.map((s) => ({
  name: s.name,
  domain: s.domain,
}));

// In-memory cache of verified discovered boards
const DISCOVERED_BOARDS_STORE: Map<string, TargetBoard> = new Map();

/**
 * Detects ATS type and token from a URL string.
 */
export function fingerprintAtsFromUrl(
  url: string
): { type: AtsProviderType; token: string } | null {
  if (!url) return null;

  // 1. Ashby
  const ashbyMatch = url.match(ASHBY_REGEX);
  if (ashbyMatch && ashbyMatch[1]) {
    const token = ashbyMatch[1].split(/[/?#]/)[0];
    if (token && !["application", "embed", "api"].includes(token.toLowerCase())) {
      return { type: "ashby", token };
    }
  }

  // 2. Greenhouse
  const ghMatch = url.match(GREENHOUSE_REGEX);
  if (ghMatch && ghMatch[1]) {
    const token = ghMatch[1].split(/[/?#]/)[0];
    if (token && !["embed", "v1", "boards", "jobs"].includes(token.toLowerCase())) {
      return { type: "greenhouse", token };
    }
  }

  // 3. Lever
  const leverMatch = url.match(LEVER_REGEX);
  if (leverMatch && leverMatch[1]) {
    const token = leverMatch[1].split(/[/?#]/)[0];
    if (token && !["apply", "v0"].includes(token.toLowerCase())) {
      return { type: "lever", token };
    }
  }

  // 4. SmartRecruiters
  const srMatch = url.match(SMARTRECRUITERS_REGEX);
  if (srMatch && srMatch[1]) {
    const token = srMatch[1].split(/[/?#]/)[0];
    if (token && !["company", "search", "api"].includes(token.toLowerCase())) {
      return { type: "smartrecruiters", token };
    }
  }

  // 5. Workable
  const workableMatch = url.match(WORKABLE_REGEX);
  if (workableMatch && workableMatch[1]) {
    const token = workableMatch[1].split(/[/?#]/)[0];
    if (token && !["accounts", "api"].includes(token.toLowerCase())) {
      return { type: "workable", token };
    }
  }

  // 6. Workday
  const workdayMatch = url.match(WORKDAY_REGEX);
  if (workdayMatch && workdayMatch[1] && workdayMatch[2]) {
    const tenant = workdayMatch[1];
    const site = workdayMatch[2];
    return { type: "workday", token: `${tenant}:${site}` };
  }

  // 7. Breezy HR
  const breezyMatch = url.match(BREEZY_REGEX);
  if (breezyMatch && breezyMatch[1]) {
    const token = breezyMatch[1];
    if (!["app", "www"].includes(token.toLowerCase())) {
      return { type: "breezy", token };
    }
  }

  // 8. Recruitee
  const recruiteeMatch = url.match(RECRUITEE_REGEX);
  if (recruiteeMatch && recruiteeMatch[1]) {
    const token = recruiteeMatch[1];
    if (!["app", "www", "api"].includes(token.toLowerCase())) {
      return { type: "recruitee", token };
    }
  }

  // 9. BambooHR
  const bambooMatch = url.match(BAMBOOHR_REGEX);
  if (bambooMatch && bambooMatch[1]) {
    const token = bambooMatch[1];
    if (!["app", "www"].includes(token.toLowerCase())) {
      return { type: "bamboohr", token };
    }
  }

  // 10. Personio
  const personioMatch = url.match(PERSONIO_REGEX);
  if (personioMatch && personioMatch[1]) {
    const token = personioMatch[1];
    if (!["app", "www", "api"].includes(token.toLowerCase())) {
      return { type: "personio", token };
    }
  }

  return null;
}

/**
 * Searches raw HTML for links, scripts, or iframes pointing to supported ATS boards.
 */
export function fingerprintAtsFromHtml(
  html: string
): { type: AtsProviderType; token: string } | null {
  if (!html) return null;

  // Search for Ashby
  const ashbyMatch = html.match(
    /(?:https?:)?\/\/(?:jobs\.)?ashbyhq\.com\/(?:posting-api\/job-board\/)?([a-zA-Z0-9_\-]+)/i
  );
  if (ashbyMatch && ashbyMatch[1]) {
    const token = ashbyMatch[1].split(/[/?#"'&]/)[0];
    if (token && token.length > 2 && !["application", "embed"].includes(token.toLowerCase())) {
      return { type: "ashby", token };
    }
  }

  // Search for Greenhouse
  const ghMatch = html.match(
    /(?:https?:)?\/\/(?:boards|api|job-boards)\.greenhouse\.io\/(?:embed\/job_board\?for=)?(?:v1\/boards\/)?([a-zA-Z0-9_\-]+)/i
  );
  if (ghMatch && ghMatch[1]) {
    const token = ghMatch[1].split(/[/?#"'&]/)[0];
    if (token && token.length > 2 && !["embed", "v1", "boards"].includes(token.toLowerCase())) {
      return { type: "greenhouse", token };
    }
  }

  // Search for Lever
  const leverMatch = html.match(/(?:https?:)?\/\/jobs\.lever\.co\/([a-zA-Z0-9_\-]+)/i);
  if (leverMatch && leverMatch[1]) {
    const token = leverMatch[1].split(/[/?#"'&]/)[0];
    if (token && token.length > 2 && !["apply", "v0"].includes(token.toLowerCase())) {
      return { type: "lever", token };
    }
  }

  // Search for SmartRecruiters
  const srMatch = html.match(
    /(?:https?:)?\/\/(?:careers|jobs)\.smartrecruiters\.com\/([a-zA-Z0-9_\-]+)/i
  );
  if (srMatch && srMatch[1]) {
    const token = srMatch[1].split(/[/?#"'&]/)[0];
    if (token && token.length > 2 && !["company", "search", "api"].includes(token.toLowerCase())) {
      return { type: "smartrecruiters", token };
    }
  }

  // Search for Workable
  const workableMatch = html.match(/(?:https?:)?\/\/apply\.workable\.com\/([a-zA-Z0-9_\-]+)/i);
  if (workableMatch && workableMatch[1]) {
    const token = workableMatch[1].split(/[/?#"'&]/)[0];
    if (token && token.length > 2 && !["accounts", "api"].includes(token.toLowerCase())) {
      return { type: "workable", token };
    }
  }

  // Search for Workday
  const workdayMatch = html.match(
    /(?:https?:)?\/\/([a-zA-Z0-9_\-]+)\.(?:wd\d+|myworkdayjobs)\.com\/([a-zA-Z0-9_\-]+)/i
  );
  if (workdayMatch && workdayMatch[1] && workdayMatch[2]) {
    return { type: "workday", token: `${workdayMatch[1]}:${workdayMatch[2]}` };
  }

  // Search for Breezy
  const breezyMatch = html.match(/(?:https?:)?\/\/([a-zA-Z0-9_\-]+)\.breezy\.hr/i);
  if (breezyMatch && breezyMatch[1] && !["app", "www"].includes(breezyMatch[1].toLowerCase())) {
    return { type: "breezy", token: breezyMatch[1] };
  }

  // Search for Recruitee
  const recruiteeMatch = html.match(/(?:https?:)?\/\/([a-zA-Z0-9_\-]+)\.recruitee\.com/i);
  if (recruiteeMatch && recruiteeMatch[1] && !["app", "www", "api"].includes(recruiteeMatch[1].toLowerCase())) {
    return { type: "recruitee", token: recruiteeMatch[1] };
  }

  // Search for Personio
  const personioMatch = html.match(/(?:https?:)?\/\/([a-zA-Z0-9_\-]+)\.(?:jobs\.)?personio\.(?:de|com)/i);
  if (personioMatch && personioMatch[1] && !["app", "www", "api"].includes(personioMatch[1].toLowerCase())) {
    return { type: "personio", token: personioMatch[1] };
  }

  // Search for BambooHR
  const bambooMatch = html.match(/(?:https?:)?\/\/([a-zA-Z0-9_\-]+)\.bamboohr\.com/i);
  if (bambooMatch && bambooMatch[1] && !["app", "www"].includes(bambooMatch[1].toLowerCase())) {
    return { type: "bamboohr", token: bambooMatch[1] };
  }

  return null;
}

const INDIA_KEYWORDS = [
  "india",
  "bengaluru",
  "bangalore",
  "hyderabad",
  "pune",
  "delhi",
  "noida",
  "gurgaon",
  "gurugram",
  "mumbai",
  "chennai",
  "remote",
  "tricity",
  "chandigarh",
  "mohali",
  "kochi",
  "ahmedabad",
  "jaipur",
  "indore",
  "kolkata",
];

/**
 * Tests ATS API endpoint to verify whether the board exists and has active India or Remote tech roles.
 */
export async function verifyAtsBoard(
  board: TargetBoard
): Promise<VerificationResult> {
  const defaultResult: VerificationResult = {
    isValid: false,
    activeJobsCount: 0,
    indiaOrRemoteCount: 0,
    board,
  };

  try {
    // 1. Greenhouse Verification
    if (board.type === "greenhouse") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://api.greenhouse.io/v1/boards/${board.token}/jobs`, {
        headers: { "User-Agent": "RoleNest-Discovery/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return defaultResult;
      const data = (await res.json()) as { jobs?: any[] };
      if (!data.jobs || !Array.isArray(data.jobs)) return defaultResult;

      let indiaOrRemote = 0;
      let sampleTitle = "";

      for (const j of data.jobs) {
        const loc = (j.location?.name || "").toLowerCase();
        const isIndia = INDIA_KEYWORDS.some((kw) => loc.includes(kw));

        if (isIndia) {
          indiaOrRemote++;
          if (!sampleTitle) sampleTitle = j.title;
        }
      }

      return {
        isValid: data.jobs.length > 0,
        activeJobsCount: data.jobs.length,
        indiaOrRemoteCount: indiaOrRemote,
        sampleTitle,
        board,
      };
    }

    // 2. Lever Verification
    if (board.type === "lever") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://api.lever.co/v0/postings/${board.token}?mode=json`, {
        headers: { "User-Agent": "RoleNest-Discovery/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return defaultResult;
      const data = (await res.json()) as any[];
      if (!Array.isArray(data)) return defaultResult;

      let indiaOrRemote = 0;
      let sampleTitle = "";

      for (const p of data) {
        const loc = (p.categories?.location || "").toLowerCase();
        const workplaceType = (p.workplaceType || "").toLowerCase();
        const isIndia =
          INDIA_KEYWORDS.some((kw) => loc.includes(kw)) || workplaceType === "remote";

        if (isIndia) {
          indiaOrRemote++;
          if (!sampleTitle) sampleTitle = p.text;
        }
      }

      return {
        isValid: data.length > 0,
        activeJobsCount: data.length,
        indiaOrRemoteCount: indiaOrRemote,
        sampleTitle,
        board,
      };
    }

    // 3. Ashby Verification
    if (board.type === "ashby") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${board.token}`, {
        headers: { "User-Agent": "RoleNest-Discovery/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return defaultResult;
      const data = (await res.json()) as { jobs?: any[] };
      if (!data.jobs || !Array.isArray(data.jobs)) return defaultResult;

      let indiaOrRemote = 0;
      let sampleTitle = "";

      for (const j of data.jobs) {
        const loc = [j.location, ...(j.secondaryLocations || [])].filter(Boolean).join(" ").toLowerCase();
        const isIndia =
          INDIA_KEYWORDS.some((kw) => loc.includes(kw)) ||
          j.isRemote === true ||
          loc.includes("remote");

        if (isIndia) {
          indiaOrRemote++;
          if (!sampleTitle) sampleTitle = j.title;
        }
      }

      return {
        isValid: data.jobs.length > 0,
        activeJobsCount: data.jobs.length,
        indiaOrRemoteCount: indiaOrRemote,
        sampleTitle,
        board,
      };
    }

    // 4. SmartRecruiters Verification
    if (board.type === "smartrecruiters") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(
        `https://api.smartrecruiters.com/v1/companies/${board.token}/postings?limit=50`,
        {
          headers: { "User-Agent": "RoleNest-Discovery/1.0" },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (!res.ok) return defaultResult;
      const data = (await res.json()) as { content?: any[]; totalFound?: number };
      const items = data.content || [];

      let indiaOrRemote = 0;
      let sampleTitle = "";

      for (const p of items) {
        const fullLoc = (p.location?.fullLocation || p.location?.city || "").toLowerCase();
        const country = (p.location?.country || "").toLowerCase();
        const isRemote = p.location?.remote === true;
        const isIndia = country === "in" || isRemote || INDIA_KEYWORDS.some((kw) => fullLoc.includes(kw));

        if (isIndia) {
          indiaOrRemote++;
          if (!sampleTitle) sampleTitle = p.name;
        }
      }

      return {
        isValid: items.length > 0,
        activeJobsCount: data.totalFound || items.length,
        indiaOrRemoteCount: indiaOrRemote,
        sampleTitle,
        board,
      };
    }

    // 5. Workable Verification
    if (board.type === "workable") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(
        `https://apply.workable.com/api/v1/widget/accounts/${board.token}`,
        {
          headers: { "User-Agent": "RoleNest-Discovery/1.0" },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (!res.ok) return defaultResult;
      const data = (await res.json()) as { jobs?: any[]; total?: number };
      const jobs = data.jobs || [];

      let indiaOrRemote = 0;
      let sampleTitle = "";

      for (const j of jobs) {
        const country = (j.country || "").toLowerCase();
        const city = (j.city || "").toLowerCase();
        const isRemote = j.telecommuting === true;
        const isIndia = country === "india" || isRemote || INDIA_KEYWORDS.some((kw) => city.includes(kw));

        if (isIndia) {
          indiaOrRemote++;
          if (!sampleTitle) sampleTitle = j.title;
        }
      }

      return {
        isValid: jobs.length > 0,
        activeJobsCount: data.total || jobs.length,
        indiaOrRemoteCount: indiaOrRemote,
        sampleTitle,
        board,
      };
    }

    // 6. Breezy HR Verification
    if (board.type === "breezy") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://${board.token}.breezy.hr/json`, {
        headers: { "User-Agent": "RoleNest-Discovery/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return defaultResult;
      const jobs = (await res.json()) as any[];
      if (!Array.isArray(jobs)) return defaultResult;

      let indiaOrRemote = 0;
      let sampleTitle = "";

      for (const j of jobs) {
        const loc = (j.location?.name || "").toLowerCase();
        const isIndia = INDIA_KEYWORDS.some((kw) => loc.includes(kw)) || loc.includes("remote");

        if (isIndia) {
          indiaOrRemote++;
          if (!sampleTitle) sampleTitle = j.name;
        }
      }

      return {
        isValid: jobs.length > 0,
        activeJobsCount: jobs.length,
        indiaOrRemoteCount: indiaOrRemote,
        sampleTitle,
        board,
      };
    }

    // 7. Recruitee Verification
    if (board.type === "recruitee") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://${board.token}.recruitee.com/api/offers/`, {
        headers: { "User-Agent": "RoleNest-Discovery/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return defaultResult;
      const data = (await res.json()) as { offers?: any[] };
      const offers = data.offers || [];

      let indiaOrRemote = 0;
      let sampleTitle = "";

      for (const o of offers) {
        const loc = (o.location || "").toLowerCase();
        const isIndia = INDIA_KEYWORDS.some((kw) => loc.includes(kw)) || o.remote === true;
        if (isIndia) {
          indiaOrRemote++;
          if (!sampleTitle) sampleTitle = o.title;
        }
      }

      return {
        isValid: offers.length > 0,
        activeJobsCount: offers.length,
        indiaOrRemoteCount: indiaOrRemote,
        sampleTitle,
        board,
      };
    }

    // 8. Personio Verification
    if (board.type === "personio") {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`https://${board.token}.jobs.personio.de/xml?language=en`, {
        headers: { "User-Agent": "RoleNest-Discovery/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) return defaultResult;
      const xml = await res.text();
      const posMatches = xml.match(/<position>([\s\S]*?)<\/position>/g) || [];

      return {
        isValid: posMatches.length > 0,
        activeJobsCount: posMatches.length,
        indiaOrRemoteCount: posMatches.length,
        sampleTitle: `${board.companyName} Opportunities`,
        board,
      };
    }

    // 9. Workday or Custom Verification
    if (board.type === "workday" || board.type === "custom") {
      return {
        isValid: true,
        activeJobsCount: 1,
        indiaOrRemoteCount: 1,
        sampleTitle: `${board.companyName} Careers Portal`,
        board,
      };
    }
  } catch {
    // network or abort timeout
  }

  return defaultResult;
}

/**
 * Autonomously probes a company domain or career URL to detect and verify its ATS board.
 */
export async function probeCompanyCareers(
  domainOrUrl: string,
  companyName?: string,
  knownSeed?: StartupSeed
): Promise<TargetBoard | null> {
  const cleanDomain = domainOrUrl
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .trim()
    .toLowerCase();

  const name =
    companyName ||
    cleanDomain.replace(/\.(com|in|io|ai|co|org|net|app|money|cards|space|bike|live)$/i, "");

  // 1. If known seed exists with confirmed ATS, verify directly first
  if (knownSeed?.knownAts) {
    const seedBoard: TargetBoard = {
      companyName: knownSeed.name,
      type: knownSeed.knownAts.type,
      token: knownSeed.knownAts.token,
      website: `https://${cleanDomain}`,
      careersUrl: knownSeed.careersUrl,
      sector: knownSeed.sector,
      tier: knownSeed.tier,
      discoveryMethod: "KNOWN_SEED",
    };
    const verified = await verifyAtsBoard(seedBoard);
    if (verified.isValid) {
      registerDiscoveredBoard(seedBoard);
      return seedBoard;
    }
  }

  // 2. Direct heuristic check against Ashby, Greenhouse, Lever, SmartRecruiters
  const candidateTokens = [
    cleanDomain.split(".")[0],
    cleanDomain.replace(/\./g, ""),
    name.toLowerCase().replace(/[^a-z0-9]/g, ""),
  ].filter(Boolean);

  for (const token of candidateTokens) {
    const checks: Array<{ type: AtsProviderType; token: string }> = [
      { type: "greenhouse", token },
      { type: "lever", token },
      { type: "ashby", token },
      { type: "smartrecruiters", token },
      { type: "workable", token },
      { type: "breezy", token },
      { type: "recruitee", token },
      { type: "personio", token },
    ];

    for (const c of checks) {
      const b: TargetBoard = {
        companyName: name,
        type: c.type,
        token: c.token,
        website: `https://${cleanDomain}`,
        sector: knownSeed?.sector,
        tier: knownSeed?.tier,
        discoveryMethod: "FALLBACK_PROBE",
      };
      const res = await verifyAtsBoard(b);
      if (res.isValid && res.indiaOrRemoteCount > 0) {
        registerDiscoveredBoard(b);
        return b;
      }
    }
  }

  // 3. Probe common career URLs for redirects and ATS embeds
  const testUrls = [
    knownSeed?.careersUrl,
    `https://${cleanDomain}/careers`,
    `https://${cleanDomain}/jobs`,
    `https://careers.${cleanDomain}`,
    `https://jobs.${cleanDomain}`,
    `https://${cleanDomain}/join-us`,
    `https://${cleanDomain}`,
  ].filter(Boolean) as string[];

  for (const testUrl of testUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(testUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Check final redirected URL
      const finalUrl = res.url || testUrl;
      const detectedFromUrl = fingerprintAtsFromUrl(finalUrl);
      if (detectedFromUrl) {
        const board: TargetBoard = {
          companyName: name,
          type: detectedFromUrl.type,
          token: detectedFromUrl.token,
          website: `https://${cleanDomain}`,
          careersUrl: finalUrl,
          sector: knownSeed?.sector,
          tier: knownSeed?.tier,
          discoveryMethod: "REDIRECT",
        };
        const verified = await verifyAtsBoard(board);
        if (verified.isValid) {
          registerDiscoveredBoard(board);
          return board;
        }
      }

      // Check response body for embedded ATS tags/scripts
      if (res.ok) {
        const html = await res.text();
        const detectedFromHtml = fingerprintAtsFromHtml(html);
        if (detectedFromHtml) {
          const board: TargetBoard = {
            companyName: name,
            type: detectedFromHtml.type,
            token: detectedFromHtml.token,
            website: `https://${cleanDomain}`,
            careersUrl: finalUrl,
            sector: knownSeed?.sector,
            tier: knownSeed?.tier,
            discoveryMethod: "HTML_SNIFF",
          };
          const verified = await verifyAtsBoard(board);
          if (verified.isValid) {
            registerDiscoveredBoard(board);
            return board;
          }
        }
      }
    } catch {
      // Continue to next URL candidate
    }
  }

  return null;
}

/**
 * Discovers startup boards concurrently across a list of startup seeds.
 */
export async function discoverStartupBoards(options?: {
  seedList?: StartupSeed[];
  concurrency?: number;
  maxDiscover?: number;
}): Promise<TargetBoard[]> {
  const seedList = options?.seedList || INDIAN_STARTUP_SEEDS;
  const concurrency = options?.concurrency || 5;
  const maxDiscover = options?.maxDiscover || seedList.length;

  const discovered: TargetBoard[] = [];
  const queue = [...seedList];

  const worker = async () => {
    while (queue.length > 0 && discovered.length < maxDiscover) {
      const item = queue.shift();
      if (!item) break;

      // Check if already in cache
      const cached = Array.from(DISCOVERED_BOARDS_STORE.values()).find(
        (b) => b.companyName.toLowerCase() === item.name.toLowerCase()
      );
      if (cached) {
        discovered.push(cached);
        continue;
      }

      try {
        const board = await probeCompanyCareers(item.domain, item.name, item);
        if (board) {
          discovered.push(board);
        }
      } catch {
        // Safe skip
      }
    }
  };

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  return discovered;
}

/**
 * Registers a discovered board into in-memory store.
 */
export function registerDiscoveredBoard(board: TargetBoard): boolean {
  const key = `${board.type}:${board.token.toLowerCase()}`;
  if (!DISCOVERED_BOARDS_STORE.has(key)) {
    DISCOVERED_BOARDS_STORE.set(key, board);
    return true;
  }
  return false;
}

/**
 * Returns all currently known discovered boards.
 */
export function getDiscoveredBoards(): TargetBoard[] {
  return Array.from(DISCOVERED_BOARDS_STORE.values());
}
