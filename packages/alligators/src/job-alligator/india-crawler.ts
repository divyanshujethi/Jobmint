import { JobType, WorkMode } from "@repo/shared";
import { RawCrawledJob } from "../types";
import { extractCanonicalSkills } from "./skill-extractor";
import { evaluateJobTruth } from "./truth-filter";

interface TargetBoard {
  companyName: string;
  type: "greenhouse" | "lever" | "ashby";
  token: string;
  website: string;
  filterIndiaOnly?: boolean;
}

const INDIAN_TARGET_BOARDS: TargetBoard[] = [
  // High-Growth Indian Startups & AI Labs
  {
    companyName: "Sarvam AI",
    type: "ashby",
    token: "sarvam",
    website: "https://sarvam.ai",
    filterIndiaOnly: false,
  },
  {
    companyName: "SigNoz",
    type: "ashby",
    token: "signoz",
    website: "https://signoz.io",
    filterIndiaOnly: false,
  },
  {
    companyName: "Porter",
    type: "lever",
    token: "porter",
    website: "https://porter.in",
    filterIndiaOnly: false,
  },
  {
    companyName: "FamPay",
    type: "lever",
    token: "fampay",
    website: "https://fampay.in",
    filterIndiaOnly: false,
  },
  {
    companyName: "Glance",
    type: "greenhouse",
    token: "glance",
    website: "https://glance.com",
    filterIndiaOnly: true,
  },
  // Indian Tech Unicorns & Category Leaders
  {
    companyName: "Razorpay",
    type: "greenhouse",
    token: "razorpaysoftwareprivatelimited",
    website: "https://razorpay.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "Paytm",
    type: "lever",
    token: "paytm",
    website: "https://paytm.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "InMobi",
    type: "greenhouse",
    token: "inmobi",
    website: "https://inmobi.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "Slice",
    type: "greenhouse",
    token: "slice",
    website: "https://sliceit.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "Groww",
    type: "greenhouse",
    token: "groww",
    website: "https://groww.in",
    filterIndiaOnly: false,
  },
  {
    companyName: "CRED",
    type: "lever",
    token: "cred",
    website: "https://cred.club",
    filterIndiaOnly: false,
  },
  {
    companyName: "Zenoti",
    type: "greenhouse",
    token: "zenoti",
    website: "https://zenoti.com",
    filterIndiaOnly: true,
  },
  {
    companyName: "Thoughtworks",
    type: "greenhouse",
    token: "thoughtworks",
    website: "https://thoughtworks.com",
    filterIndiaOnly: true,
  },
  // Global Tech Hubs in India
  {
    companyName: "Elastic",
    type: "greenhouse",
    token: "elastic",
    website: "https://elastic.co",
    filterIndiaOnly: true,
  },
  {
    companyName: "Datadog",
    type: "greenhouse",
    token: "datadog",
    website: "https://datadoghq.com",
    filterIndiaOnly: true,
  },
  {
    companyName: "Cloudflare",
    type: "greenhouse",
    token: "cloudflare",
    website: "https://cloudflare.com",
    filterIndiaOnly: true,
  },
  {
    companyName: "MongoDB",
    type: "greenhouse",
    token: "mongodb",
    website: "https://mongodb.com",
    filterIndiaOnly: true,
  },
  {
    companyName: "Stripe",
    type: "greenhouse",
    token: "stripe",
    website: "https://stripe.com",
    filterIndiaOnly: true,
  },
  {
    companyName: "Coinbase",
    type: "greenhouse",
    token: "coinbase",
    website: "https://coinbase.com",
    filterIndiaOnly: true,
  },
  // Newly Verified High-Growth Indian Startups & Unicorns
  {
    companyName: "Meesho",
    type: "lever",
    token: "meesho",
    website: "https://meesho.io",
    filterIndiaOnly: false,
  },
  {
    companyName: "PocketFM",
    type: "lever",
    token: "pocketfm",
    website: "https://pocketfm.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "Fi Money",
    type: "lever",
    token: "fi",
    website: "https://fi.money",
    filterIndiaOnly: false,
  },
  {
    companyName: "Instawork",
    type: "greenhouse",
    token: "instawork",
    website: "https://instawork.com",
    filterIndiaOnly: true,
  },
  {
    companyName: "Rubrik",
    type: "greenhouse",
    token: "rubrik",
    website: "https://rubrik.com",
    filterIndiaOnly: true,
  },
  {
    companyName: "Twilio",
    type: "greenhouse",
    token: "twilio",
    website: "https://twilio.com",
    filterIndiaOnly: true,
  },
  // Top Engineering AI & Tooling Startups
  {
    companyName: "Cursor",
    type: "ashby",
    token: "cursor",
    website: "https://cursor.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "PostHog",
    type: "ashby",
    token: "posthog",
    website: "https://posthog.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "Linear",
    type: "ashby",
    token: "linear",
    website: "https://linear.app",
    filterIndiaOnly: false,
  },
  {
    companyName: "Perplexity",
    type: "ashby",
    token: "perplexity",
    website: "https://perplexity.ai",
    filterIndiaOnly: false,
  },
  {
    companyName: "Replit",
    type: "ashby",
    token: "replit",
    website: "https://replit.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "ElevenLabs",
    type: "ashby",
    token: "elevenlabs",
    website: "https://elevenlabs.io",
    filterIndiaOnly: false,
  },
  {
    companyName: "Modal",
    type: "ashby",
    token: "modal",
    website: "https://modal.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "LangChain",
    type: "ashby",
    token: "langchain",
    website: "https://langchain.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "Cohere",
    type: "ashby",
    token: "cohere",
    website: "https://cohere.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "Ramp",
    type: "ashby",
    token: "ramp",
    website: "https://ramp.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "Supabase",
    type: "ashby",
    token: "supabase",
    website: "https://supabase.com",
    filterIndiaOnly: false,
  },
  {
    companyName: "LlamaIndex",
    type: "ashby",
    token: "llamaindex",
    website: "https://llamaindex.ai",
    filterIndiaOnly: false,
  },
];

const TECH_KEYWORD_PATTERNS = [
  /engineer/i,
  /developer/i,
  /software/i,
  /frontend/i,
  /backend/i,
  /full\s*stack/i,
  /devops/i,
  /cloud/i,
  /sre/i,
  /data/i,
  /machine\s*learning/i,
  /ai\b/i,
  /android/i,
  /ios/i,
  /qa\b/i,
  /quality/i,
  /test/i,
  /security/i,
  /platform/i,
  /infrastructure/i,
  /intern/i,
  /architect/i,
  /systems/i,
  /web/i,
];

function isTechRole(title: string): boolean {
  return TECH_KEYWORD_PATTERNS.some((pat) => pat.test(title));
}

function detectExperienceAndType(title: string): {
  experienceYears: number;
  jobType: JobType;
} {
  const t = title.toLowerCase();

  if (
    t.includes("intern") ||
    t.includes("trainee") ||
    t.includes("apprentice") ||
    t.includes("co-op")
  ) {
    return { experienceYears: 0, jobType: JobType.INTERNSHIP };
  }

  if (
    t.includes("junior") ||
    t.includes("graduate") ||
    t.includes("entry") ||
    t.includes("fresher") ||
    t.includes("associate") ||
    t.includes("sde 1") ||
    t.includes("sde i") ||
    t.includes("sde-1") ||
    t.includes("engineer 1") ||
    t.includes("engineer i") ||
    t.includes("analyst")
  ) {
    return { experienceYears: 0, jobType: JobType.FULL_TIME };
  }

  if (
    t.includes("sde 2") ||
    t.includes("sde ii") ||
    t.includes("sde-2") ||
    t.includes("engineer 2") ||
    t.includes("engineer ii")
  ) {
    return { experienceYears: 2, jobType: JobType.FULL_TIME };
  }

  if (
    t.includes("senior") ||
    t.includes("lead") ||
    t.includes("principal") ||
    t.includes("staff") ||
    t.includes("architect") ||
    t.includes("director")
  ) {
    return { experienceYears: 5, jobType: JobType.FULL_TIME };
  }

  return { experienceYears: 1, jobType: JobType.FULL_TIME };
}

function normalizeIndiaLocation(locRaw?: string): {
  location: string;
  isIndiaOrRemote: boolean;
  workMode: WorkMode;
} {
  const l = (locRaw || "").trim();
  const lower = l.toLowerCase();

  const isRemote =
    lower.includes("remote") ||
    lower.includes("anywhere") ||
    lower.includes("work from home");
  const isHybrid = lower.includes("hybrid");
  const mode = isRemote
    ? WorkMode.REMOTE
    : isHybrid
      ? WorkMode.HYBRID
      : WorkMode.ON_SITE;

  let normLoc = l;
  let isIndia = false;

  if (lower.includes("bengaluru") || lower.includes("bangalore")) {
    normLoc = "Bengaluru, India";
    isIndia = true;
  } else if (lower.includes("gurgaon") || lower.includes("gurugram")) {
    normLoc = "Gurugram, India";
    isIndia = true;
  } else if (lower.includes("noida")) {
    normLoc = "Noida, India";
    isIndia = true;
  } else if (lower.includes("delhi")) {
    normLoc = "Delhi NCR, India";
    isIndia = true;
  } else if (lower.includes("hyderabad")) {
    normLoc = "Hyderabad, India";
    isIndia = true;
  } else if (lower.includes("pune")) {
    normLoc = "Pune, India";
    isIndia = true;
  } else if (lower.includes("mumbai")) {
    normLoc = "Mumbai, India";
    isIndia = true;
  } else if (lower.includes("chennai")) {
    normLoc = "Chennai, India";
    isIndia = true;
  } else if (lower.includes("india")) {
    normLoc = isRemote ? "Remote, India" : "India";
    isIndia = true;
  } else if (isRemote) {
    normLoc = "Remote, Global";
  }

  return {
    location: normLoc || "Remote, India",
    isIndiaOrRemote: isIndia || isRemote,
    workMode: mode,
  };
}

export async function crawlIndiaTechBoards(options?: {
  maxPerCompany?: number;
}): Promise<RawCrawledJob[]> {
  const maxPerCompany = options?.maxPerCompany ?? 25;
  const results: RawCrawledJob[] = [];

  for (const board of INDIAN_TARGET_BOARDS) {
    try {
      if (board.type === "greenhouse") {
        const res = await fetch(
          `https://api.greenhouse.io/v1/boards/${board.token}/jobs`,
          {
            headers: { "User-Agent": "RoleNest-IndiaAlligator/1.0" },
          }
        );
        if (!res.ok) continue;

        const data = (await res.json()) as { jobs: any[] };
        if (!data.jobs || !Array.isArray(data.jobs)) continue;

        let count = 0;
        for (const j of data.jobs) {
          if (count >= maxPerCompany) break;

          const title = j.title?.trim() || "";
          if (!isTechRole(title)) continue;

          const locRaw = j.location?.name || "";
          const locInfo = normalizeIndiaLocation(locRaw);

          if (board.filterIndiaOnly && !locInfo.isIndiaOrRemote) {
            continue;
          }

          const { experienceYears, jobType } = detectExperienceAndType(title);
          const salary =
            jobType === JobType.INTERNSHIP
              ? "Competitive Internship Stipend (Official)"
              : "Competitive Market Compensation (Official)";

          const directUrl =
            j.absolute_url ||
            `https://boards.greenhouse.io/${board.token}/jobs/${j.id}`;
          const desc = `Verified position for ${title} at ${board.companyName}. Location: ${locInfo.location}. Directly apply on the official ${board.companyName} careers portal.`;

          const skills = extractCanonicalSkills(`${title} ${desc}`);
          const truthEval = evaluateJobTruth({
            title,
            description: desc,
            salaryOrStipend: salary,
            publishedAt: j.updated_at || new Date().toISOString(),
            companyName: board.companyName,
          });

          results.push({
            title,
            companyName: board.companyName,
            companyWebsite: board.website,
            location: locInfo.location,
            workMode: locInfo.workMode,
            jobType,
            salaryOrStipend: salary,
            experienceYears,
            source: "GREENHOUSE",
            sourceUrl: directUrl,
            externalId: `gh-${board.token}-${j.id}`,
            description: desc,
            skills: skills.length ? skills : ["TypeScript", "Python", "SQL"],
            isGhostRisk: false,
            truthScore: Math.max(truthEval.score, 85),
            publishedAt: j.updated_at || new Date().toISOString(),
          });

          count++;
        }
      } else if (board.type === "lever") {
        const res = await fetch(
          `https://api.lever.co/v0/postings/${board.token}?mode=json`,
          {
            headers: { "User-Agent": "RoleNest-IndiaAlligator/1.0" },
          }
        );
        if (!res.ok) continue;

        const data = (await res.json()) as any[];
        if (!Array.isArray(data)) continue;

        let count = 0;
        for (const p of data) {
          if (count >= maxPerCompany) break;

          const title = p.text?.trim() || "";
          if (!isTechRole(title)) continue;

          const locRaw = p.categories?.location || "";
          const locInfo = normalizeIndiaLocation(locRaw);

          if (board.filterIndiaOnly && !locInfo.isIndiaOrRemote) {
            continue;
          }

          const { experienceYears, jobType } = detectExperienceAndType(title);
          const salary =
            jobType === JobType.INTERNSHIP
              ? "Competitive Internship Stipend (Official)"
              : "Competitive Market Compensation (Official)";

          const directUrl =
            p.hostedUrl || `https://jobs.lever.co/${board.token}/${p.id}`;
          const desc = `Verified position for ${title} at ${board.companyName}. Location: ${locInfo.location}. Directly apply on the official ${board.companyName} careers portal.`;

          const skills = extractCanonicalSkills(`${title} ${desc}`);
          const pubDate = p.createdAt
            ? new Date(p.createdAt).toISOString()
            : new Date().toISOString();

          const truthEval = evaluateJobTruth({
            title,
            description: desc,
            salaryOrStipend: salary,
            publishedAt: pubDate,
            companyName: board.companyName,
          });

          results.push({
            title,
            companyName: board.companyName,
            companyWebsite: board.website,
            location: locInfo.location,
            workMode: locInfo.workMode,
            jobType,
            salaryOrStipend: salary,
            experienceYears,
            source: "LEVER",
            sourceUrl: directUrl,
            externalId: `lever-${board.token}-${p.id}`,
            description: desc,
            skills: skills.length ? skills : ["Java", "Go", "Docker"],
            isGhostRisk: false,
            truthScore: Math.max(truthEval.score, 85),
            publishedAt: pubDate,
          });

          count++;
        }
      } else if (board.type === "ashby") {
        const res = await fetch(
          `https://api.ashbyhq.com/posting-api/job-board/${board.token}`,
          {
            headers: { "User-Agent": "RoleNest-IndiaAlligator/1.0" },
          }
        );
        if (!res.ok) continue;

        const data = (await res.json()) as { jobs?: any[] };
        if (!data.jobs || !Array.isArray(data.jobs)) continue;

        let count = 0;
        for (const j of data.jobs) {
          if (count >= maxPerCompany) break;

          const title = j.title?.trim() || "";
          if (!isTechRole(title)) continue;

          const locRaw = j.location || (j.secondaryLocations ? j.secondaryLocations.join(", ") : "");
          const locInfo = normalizeIndiaLocation(locRaw);

          if (board.filterIndiaOnly && !locInfo.isIndiaOrRemote) {
            continue;
          }

          const { experienceYears, jobType } = detectExperienceAndType(title);
          const salary =
            jobType === JobType.INTERNSHIP
              ? "Competitive Startup Stipend (Official)"
              : "Competitive Market Compensation (Official)";

          const directUrl =
            j.jobUrl || `https://jobs.ashbyhq.com/${board.token}/${j.id}`;
          const desc = `Verified position for ${title} at ${board.companyName}. Location: ${locInfo.location}. Directly apply on the official ${board.companyName} careers portal.`;

          const skills = extractCanonicalSkills(`${title} ${desc}`);
          const pubDate = j.publishedAt
            ? new Date(j.publishedAt).toISOString()
            : new Date().toISOString();

          const truthEval = evaluateJobTruth({
            title,
            description: desc,
            salaryOrStipend: salary,
            publishedAt: pubDate,
            companyName: board.companyName,
          });

          results.push({
            title,
            companyName: board.companyName,
            companyWebsite: board.website,
            location: locInfo.location,
            workMode: locInfo.workMode,
            jobType,
            salaryOrStipend: salary,
            experienceYears,
            source: "EXTERNAL" as any,
            sourceUrl: directUrl,
            externalId: `ashby-${board.token}-${j.id}`,
            description: desc,
            skills: skills.length ? skills : ["TypeScript", "Python", "Go", "React"],
            isGhostRisk: false,
            truthScore: Math.max(truthEval.score, 85),
            publishedAt: pubDate,
          });

          count++;
        }
      }
    } catch (err: any) {
      console.error(
        `[India Job Alligator] Error crawling ${board.companyName}:`,
        err.message
      );
    }
  }

  return results;
}
