/**
 * Autonomous Company & Career Discovery Engine (RoleNest)
 *
 * Automatically discovers emerging tech companies and startups,
 * fingerprints their career portals / ATS infrastructure (Ashby, Greenhouse, Lever),
 * tests the public ATS endpoints for active Indian & Remote positions,
 * and feeds newly discovered boards into the continuous crawler queue.
 */

export interface TargetBoard {
  companyName: string;
  type: "greenhouse" | "lever" | "ashby";
  token: string;
  website: string;
}

export interface VerificationResult {
  isValid: boolean;
  activeJobsCount: number;
  indiaOrRemoteCount: number;
  sampleTitle?: string;
  board?: TargetBoard;
}

const ASHBY_REGEX = /(?:jobs\.)?ashbyhq\.com\/(?:posting-api\/job-board\/)?([a-zA-Z0-9_\-]+)/i;
const GREENHOUSE_REGEX = /(?:boards|api|job-boards)\.greenhouse\.io\/(?:embed\/job_board\?for=)?(?:v1\/boards\/)?([a-zA-Z0-9_\-]+)/i;
const LEVER_REGEX = /jobs\.lever\.co\/([a-zA-Z0-9_\-]+)/i;

/**
 * High-potential seed domains for Indian tech startups and scale-ups across:
 * - FinTech, AI / GenAI labs, SaaS / DevTools
 * - Quick Commerce, Logistics, HealthTech, EdTech
 * - SpaceTech, EV / Mobility, Gaming & Media
 */
export const SEED_STARTUP_DOMAINS: Array<{ name: string; domain: string }> = [
  // AI & GenAI Labs
  { name: "Sarvam AI", domain: "sarvam.ai" },
  { name: "Krutrim", domain: "krutrim.com" },
  { name: "SigNoz", domain: "signoz.io" },
  { name: "Yellow.ai", domain: "yellow.ai" },
  { name: "Haptik", domain: "haptik.ai" },
  { name: "DevRev", domain: "devrev.ai" },
  { name: "Observe.ai", domain: "observe.ai" },
  { name: "Gupshup", domain: "gupshup.io" },
  { name: "Leena AI", domain: "leena.ai" },
  { name: "Inkers", domain: "inkers.ai" },
  { name: "CoRover", domain: "corover.ai" },
  { name: "Sprinto", domain: "sprinto.com" },
  { name: "Privado", domain: "privado.ai" },
  { name: "Acceldata", domain: "acceldata.io" },

  // FinTech & WealthTech
  { name: "Razorpay", domain: "razorpay.com" },
  { name: "CRED", domain: "cred.club" },
  { name: "Groww", domain: "groww.in" },
  { name: "Zerodha", domain: "zerodha.com" },
  { name: "Paytm", domain: "paytm.com" },
  { name: "Slice", domain: "sliceit.com" },
  { name: "Jupiter", domain: "jupiter.money" },
  { name: "Fi Money", domain: "fi.money" },
  { name: "Jar", domain: "jar.app" },
  { name: "Uni Cards", domain: "uni.cards" },
  { name: "INDmoney", domain: "indmoney.com" },
  { name: "Cashfree Payments", domain: "cashfree.com" },
  { name: "Navi", domain: "navi.com" },
  { name: "FamPay", domain: "fampay.in" },
  { name: "Decentro", domain: "decentro.tech" },
  { name: "Falcon", domain: "falcon.money" },

  // SaaS, Cloud & DevTools
  { name: "Postman", domain: "postman.com" },
  { name: "BrowserStack", domain: "browserstack.com" },
  { name: "Hasura", domain: "hasura.io" },
  { name: "Appsmith", domain: "appsmith.com" },
  { name: "Hoppscotch", domain: "hoppscotch.com" },
  { name: "Chargebee", domain: "chargebee.com" },
  { name: "Freshworks", domain: "freshworks.com" },
  { name: "Kissflow", domain: "kissflow.com" },
  { name: "Darwinbox", domain: "darwinbox.com" },
  { name: "Zenoti", domain: "zenoti.com" },
  { name: "HighRadius", domain: "highradius.com" },
  { name: "Innovaccer", domain: "innovaccer.com" },
  { name: "Mindtickle", domain: "mindtickle.com" },
  { name: "Wingify", domain: "wingify.com" },
  { name: "HackerRank", domain: "hackerrank.com" },
  { name: "Druva", domain: "druva.com" },
  { name: "Icertis", domain: "icertis.com" },

  // E-Commerce, Quick-Commerce & Logistics
  { name: "Zepto", domain: "zeptonow.com" },
  { name: "Swiggy", domain: "swiggy.com" },
  { name: "Zomato", domain: "zomato.com" },
  { name: "Blinkit", domain: "blinkit.com" },
  { name: "Porter", domain: "porter.in" },
  { name: "Delhivery", domain: "delhivery.com" },
  { name: "Shadowfax", domain: "shadowfax.in" },
  { name: "Shiprocket", domain: "shiprocket.in" },
  { name: "Meesho", domain: "meesho.com" },
  { name: "Urban Company", domain: "urbancompany.com" },
  { name: "Spinny", domain: "spinny.com" },
  { name: "Cars24", domain: "cars24.com" },
  { name: "Licious", domain: "licious.in" },
  { name: "Country Delight", domain: "countrydelight.in" },
  { name: "Curefoods", domain: "curefoods.in" },

  // Mobility, EV & CleanTech
  { name: "Ola", domain: "olacabs.com" },
  { name: "Ola Electric", domain: "olaelectric.com" },
  { name: "Ather Energy", domain: "atherenergy.com" },
  { name: "BluSmart", domain: "blu-smart.com" },
  { name: "Rapido", domain: "rapido.bike" },
  { name: "Bounce", domain: "bounceinfinity.com" },
  { name: "Simple Energy", domain: "simpleenergy.in" },
  { name: "Euler Motors", domain: "eulermotors.com" },

  // SpaceTech & DeepTech
  { name: "AgniKul Cosmos", domain: "agnikul.in" },
  { name: "Skyroot Aerospace", domain: "skyroot.in" },
  { name: "Pixxel", domain: "pixxel.space" },
  { name: "Bellatrix Aerospace", domain: "bellatrix.aero" },
  { name: "GalaxEye", domain: "galaxeye.space" },
  { name: "IdeaForge", domain: "ideaforge.co.in" },
  { name: "Garuda Aerospace", domain: "garudaaerospace.com" },

  // EdTech & Upskilling
  { name: "Scaler", domain: "scaler.com" },
  { name: "PhysicsWallah", domain: "pw.live" },
  { name: "Unacademy", domain: "unacademy.com" },
  { name: "Simplilearn", domain: "simplilearn.com" },
  { name: "Eruditus", domain: "eruditus.com" },
  { name: "Classplus", domain: "classplus.co" },
  { name: "Masai School", domain: "masaischool.com" },
  { name: "Newton School", domain: "newtonschool.co" },

  // Media, Gaming & Social
  { name: "Dream11", domain: "dream11.com" },
  { name: "MPL", domain: "mpl.live" },
  { name: "Games24x7", domain: "games24x7.com" },
  { name: "WinZO", domain: "winzogames.com" },
  { name: "Pocket FM", domain: "pocketfm.com" },
  { name: "Kuku FM", domain: "kukufm.com" },
  { name: "ShareChat", domain: "sharechat.com" },
  { name: "Pratilipi", domain: "pratilipi.com" },
  { name: "Stage", domain: "stage.in" },
  { name: "Nazara", domain: "nazara.com" },
];

// In-memory cache of verified discovered boards
const DISCOVERED_BOARDS_STORE: Map<string, TargetBoard> = new Map();

/**
 * Detects ATS type and token from a URL string.
 */
export function fingerprintAtsFromUrl(
  url: string
): { type: "greenhouse" | "lever" | "ashby"; token: string } | null {
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

  return null;
}

/**
 * Searches raw HTML for links, scripts, or iframes pointing to Ashby, Greenhouse, or Lever boards.
 */
export function fingerprintAtsFromHtml(
  html: string
): { type: "greenhouse" | "lever" | "ashby"; token: string } | null {
  if (!html) return null;

  // Search for Ashby links or embeds
  const ashbyMatch = html.match(
    /(?:https?:)?\/\/(?:jobs\.)?ashbyhq\.com\/(?:posting-api\/job-board\/)?([a-zA-Z0-9_\-]+)/i
  );
  if (ashbyMatch && ashbyMatch[1]) {
    const token = ashbyMatch[1].split(/[/?#"'&]/)[0];
    if (token && token.length > 2 && !["application", "embed"].includes(token.toLowerCase())) {
      return { type: "ashby", token };
    }
  }

  // Search for Greenhouse links or embed scripts
  const ghMatch = html.match(
    /(?:https?:)?\/\/(?:boards|api|job-boards)\.greenhouse\.io\/(?:embed\/job_board\?for=)?(?:v1\/boards\/)?([a-zA-Z0-9_\-]+)/i
  );
  if (ghMatch && ghMatch[1]) {
    const token = ghMatch[1].split(/[/?#"'&]/)[0];
    if (token && token.length > 2 && !["embed", "v1", "boards"].includes(token.toLowerCase())) {
      return { type: "greenhouse", token };
    }
  }

  // Search for Lever links or embed scripts
  const leverMatch = html.match(/(?:https?:)?\/\/jobs\.lever\.co\/([a-zA-Z0-9_\-]+)/i);
  if (leverMatch && leverMatch[1]) {
    const token = leverMatch[1].split(/[/?#"'&]/)[0];
    if (token && token.length > 2 && !["apply", "v0"].includes(token.toLowerCase())) {
      return { type: "lever", token };
    }
  }

  return null;
}

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

  try {
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
        const title = (j.title || "").toLowerCase();
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
  companyName?: string
): Promise<TargetBoard | null> {
  const cleanDomain = domainOrUrl
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .trim()
    .toLowerCase();

  const name =
    companyName ||
    cleanDomain.replace(/\.(com|in|io|ai|co|org|net|app|money|cards|space|bike|live)$/i, "");

  // Heuristic token candidates based on domain name
  const candidateTokens = [
    cleanDomain.split(".")[0],
    cleanDomain.replace(/\./g, ""),
    name.toLowerCase().replace(/[^a-z0-9]/g, ""),
  ].filter(Boolean);

  // 1. Direct heuristic check against Ashby, Greenhouse, Lever
  for (const token of candidateTokens) {
    // Check Ashby
    const ashbyBoard: TargetBoard = {
      companyName: name,
      type: "ashby",
      token,
      website: `https://${cleanDomain}`,
    };
    const ashbyRes = await verifyAtsBoard(ashbyBoard);
    if (ashbyRes.isValid && ashbyRes.indiaOrRemoteCount > 0) {
      registerDiscoveredBoard(ashbyBoard);
      return ashbyBoard;
    }

    // Check Greenhouse
    const ghBoard: TargetBoard = {
      companyName: name,
      type: "greenhouse",
      token,
      website: `https://${cleanDomain}`,
    };
    const ghRes = await verifyAtsBoard(ghBoard);
    if (ghRes.isValid && ghRes.indiaOrRemoteCount > 0) {
      registerDiscoveredBoard(ghBoard);
      return ghBoard;
    }

    // Check Lever
    const leverBoard: TargetBoard = {
      companyName: name,
      type: "lever",
      token,
      website: `https://${cleanDomain}`,
    };
    const leverRes = await verifyAtsBoard(leverBoard);
    if (leverRes.isValid && leverRes.indiaOrRemoteCount > 0) {
      registerDiscoveredBoard(leverBoard);
      return leverBoard;
    }
  }

  // 2. Probe common career URLs for redirects and ATS embeds
  const testUrls = [
    `https://${cleanDomain}/careers`,
    `https://${cleanDomain}/jobs`,
    `https://careers.${cleanDomain}`,
    `https://jobs.${cleanDomain}`,
    `https://${cleanDomain}/join-us`,
    `https://${cleanDomain}`,
  ];

  for (const testUrl of testUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

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
 * Discovers startup boards concurrently across a list of domains.
 */
export async function discoverStartupBoards(options?: {
  seedList?: Array<{ name: string; domain: string }>;
  concurrency?: number;
  maxDiscover?: number;
}): Promise<TargetBoard[]> {
  const seedList = options?.seedList || SEED_STARTUP_DOMAINS;
  const concurrency = options?.concurrency || 5;
  const maxDiscover = options?.maxDiscover || 30;

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
        const board = await probeCompanyCareers(item.domain, item.name);
        if (board) {
          discovered.push(board);
        }
      } catch (err: any) {
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
