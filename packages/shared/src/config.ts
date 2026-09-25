export const APP_CONFIG = {
  name: "Role Nest",
  tagline: "Find opportunities without being left guessing after you apply.",
  description: "A transparent job and internship discovery platform for students, freshers, and high-growth companies.",
  version: "0.1.0",
  urls: {
    web: process.env.NEXTAUTH_URL || "https://rolenest.in",
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
