declare const process: { env?: Record<string, string | undefined> } | undefined;

export const APP_CONFIG = {
  name: "RoleNest",
  tagline: "Find opportunities without being left guessing.",
  description: "A transparent job and internship discovery platform for students, freshers, and high-growth companies.",
  version: "0.1.0",
  urls: {
    web: (typeof process !== "undefined" && process?.env?.NEXTAUTH_URL) || "https://rolenest.in",
    docs: "/docs",
    terms: "/terms",
    privacy: "/privacy",
  },
  truthTeller: {
    inactivityThresholdDays: 7,
  },
  matchingWeights: {
    skills: 0.35,
    experience: 0.20,
    projects: 0.15,
    location: 0.10,
    education: 0.10,
    preferences: 0.10,
  }
} as const;
