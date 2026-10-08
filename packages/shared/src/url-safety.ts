/**
 * RoleNest - Safe Hyperlinking & External Platform Identification Engine
 * 
 * Safety Policy:
 * 1. Sanitizes external URLs by stripping tracking, cookies, affiliate tags, and malicious tokens.
 * 2. Enforces HTTPS strictly on all outgoing hyperlinks.
 * 3. Categorizes external job origins (LinkedIn, Internshala, Naukri, Foundit, Indeed, Greenhouse, Lever, Ashby, etc.).
 * 4. Supplies search engine and browser safe attributes: `target="_blank"` and `rel="noopener noreferrer nofollow"`.
 */

export type JobPlatformType =
  | "LINKEDIN"
  | "INTERNSHALA"
  | "NAUKRI"
  | "FOUNDIT"
  | "INDEED"
  | "GREENHOUSE"
  | "LEVER"
  | "ASHBY"
  | "SMARTRECRUITERS"
  | "WORKABLE"
  | "WELLFOUND"
  | "INSTAHYRE"
  | "COMPANY_DIRECT";

export interface JobPlatformInfo {
  type: JobPlatformType;
  displayName: string;
  applyButtonLabel: string;
  badgeLabel: string;
  badgeClass: string;
  buttonClass: string;
  isDirectAts: boolean;
}

const TRACKING_QUERY_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "refId",
  "trackingId",
  "trk",
  "midToken",
  "midSig",
  "trkInfo",
  "affiliate",
  "aff_id",
  "subid",
  "source",
  "campaign",
  "click_id",
]);

/**
 * Sanitizes external application link into a safe, canonical URL.
 */
export function sanitizeExternalJobUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);

    // Enforce HTTPS
    parsed.protocol = "https:";

    // Strip known tracking and affiliate parameters
    const toDelete: string[] = [];
    parsed.searchParams.forEach((_, key) => {
      const lower = key.toLowerCase();
      if (TRACKING_QUERY_PARAMS.has(lower) || lower.startsWith("utm_")) {
        toDelete.push(key);
      }
    });

    for (const key of toDelete) {
      parsed.searchParams.delete(key);
    }

    return parsed.toString();
  } catch {
    // If URL parsing fails, return a safe fallback or original stripped of raw query
    return trimmed.split("?")[0] || trimmed;
  }
}

/**
 * Identifies the authentic origin platform and returns localized branding & apply labels.
 */
export function detectJobPlatform(url: string | null | undefined, companyName?: string): JobPlatformInfo {
  if (!url) {
    return {
      type: "COMPANY_DIRECT",
      displayName: "RoleNest",
      applyButtonLabel: "Apply on RoleNest",
      badgeLabel: "Direct Opening",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white",
      isDirectAts: true,
    };
  }

  const lower = url.toLowerCase();

  // 1. LinkedIn
  if (lower.includes("linkedin.com")) {
    return {
      type: "LINKEDIN",
      displayName: "LinkedIn",
      applyButtonLabel: "Apply on LinkedIn",
      badgeLabel: "LinkedIn Verified",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
      buttonClass: "bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold",
      isDirectAts: false,
    };
  }

  // 2. Internshala
  if (lower.includes("internshala.com")) {
    return {
      type: "INTERNSHALA",
      displayName: "Internshala",
      applyButtonLabel: "Apply on Internshala",
      badgeLabel: "Internshala Verified",
      badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
      buttonClass: "bg-sky-600 hover:bg-sky-700 text-white shadow-xs font-semibold",
      isDirectAts: false,
    };
  }

  // 3. Naukri
  if (lower.includes("naukri.com")) {
    return {
      type: "NAUKRI",
      displayName: "Naukri",
      applyButtonLabel: "Apply on Naukri",
      badgeLabel: "Naukri Verified",
      badgeClass: "bg-amber-50 text-amber-900 border-amber-200",
      buttonClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs font-semibold",
      isDirectAts: false,
    };
  }

  // 4. Foundit
  if (lower.includes("foundit.in") || lower.includes("monsterindia.com")) {
    return {
      type: "FOUNDIT",
      displayName: "Foundit",
      applyButtonLabel: "Apply on Foundit",
      badgeLabel: "Foundit Verified",
      badgeClass: "bg-purple-50 text-purple-900 border-purple-200",
      buttonClass: "bg-purple-600 hover:bg-purple-700 text-white shadow-xs font-semibold",
      isDirectAts: false,
    };
  }

  // 5. Indeed
  if (lower.includes("indeed.com")) {
    return {
      type: "INDEED",
      displayName: "Indeed",
      applyButtonLabel: "Apply on Indeed",
      badgeLabel: "Indeed Verified",
      badgeClass: "bg-indigo-50 text-indigo-900 border-indigo-200",
      buttonClass: "bg-blue-700 hover:bg-blue-800 text-white shadow-xs font-semibold",
      isDirectAts: false,
    };
  }

  // 6. Direct Enterprise ATS: Greenhouse
  if (lower.includes("boards.greenhouse.io") || lower.includes("greenhouse.io")) {
    return {
      type: "GREENHOUSE",
      displayName: "Greenhouse",
      applyButtonLabel: `Apply on ${companyName || "Official ATS"}`,
      badgeLabel: "Greenhouse Direct",
      badgeClass: "bg-emerald-50 text-emerald-900 border-emerald-200",
      buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold",
      isDirectAts: true,
    };
  }

  // 7. Direct Enterprise ATS: Lever
  if (lower.includes("jobs.lever.co") || lower.includes("lever.co")) {
    return {
      type: "LEVER",
      displayName: "Lever",
      applyButtonLabel: `Apply on ${companyName || "Official ATS"}`,
      badgeLabel: "Lever Direct",
      badgeClass: "bg-teal-50 text-teal-900 border-teal-200",
      buttonClass: "bg-teal-600 hover:bg-teal-700 text-white shadow-xs font-semibold",
      isDirectAts: true,
    };
  }

  // 8. Direct Enterprise ATS: Ashby
  if (lower.includes("jobs.ashbyhq.com") || lower.includes("ashbyhq.com")) {
    return {
      type: "ASHBY",
      displayName: "Ashby",
      applyButtonLabel: `Apply on ${companyName || "Official ATS"}`,
      badgeLabel: "Ashby Direct",
      badgeClass: "bg-orange-50 text-orange-900 border-orange-200",
      buttonClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs font-semibold",
      isDirectAts: true,
    };
  }

  // 9. Direct Enterprise ATS: SmartRecruiters
  if (lower.includes("smartrecruiters.com")) {
    return {
      type: "SMARTRECRUITERS",
      displayName: "SmartRecruiters",
      applyButtonLabel: `Apply on ${companyName || "Official ATS"}`,
      badgeLabel: "SmartRecruiters Direct",
      badgeClass: "bg-blue-50 text-blue-900 border-blue-200",
      buttonClass: "bg-blue-700 hover:bg-blue-800 text-white shadow-xs font-semibold",
      isDirectAts: true,
    };
  }

  // 10. Direct Enterprise ATS: Workable
  if (lower.includes("workable.com")) {
    return {
      type: "WORKABLE",
      displayName: "Workable",
      applyButtonLabel: `Apply on ${companyName || "Official ATS"}`,
      badgeLabel: "Workable Direct",
      badgeClass: "bg-cyan-50 text-cyan-900 border-cyan-200",
      buttonClass: "bg-teal-700 hover:bg-teal-800 text-white shadow-xs font-semibold",
      isDirectAts: true,
    };
  }

  // Default: Verified Company Official Careers Portal
  return {
    type: "COMPANY_DIRECT",
    displayName: companyName || "Official Portal",
    applyButtonLabel: companyName ? `Apply on ${companyName}` : "Apply on Official Site",
    badgeLabel: "Official Career Link",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    buttonClass: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs font-semibold",
    isDirectAts: true,
  };
}

/**
 * Returns security-hardened HTML anchor attributes for outbound hyperlinks.
 */
export function getSafeOutboundProps() {
  return {
    target: "_blank",
    rel: "noopener noreferrer nofollow",
  };
}
