export interface CompanyProfile {
  id: string;
  slug: string;
  name: string;
  logoInitial: string;
  website: string;
  location: string;
  industry: string;
  description: string;
  isVerified: boolean;
  truthTeller: {
    totalApplications: number;
    reviewedApplications: number;
    reviewRate: number; // Percentage, e.g. 89%
    medianFirstReviewDays: number; // e.g. 1.8 days
    lastRecruiterActivity: string; // e.g. "Active today"
    isFastReviewer: boolean; // true if medianFirstReviewDays <= 2.5 days
  };
}

export const MOCK_COMPANIES: CompanyProfile[] = [
  {
    id: "comp-1",
    slug: "abc-technologies",
    name: "ABC Technologies",
    logoInitial: "A",
    website: "https://abctechnologies.com",
    location: "Remote / Bangalore",
    industry: "Developer Tools & Cloud",
    description:
      "ABC Technologies builds next-generation developer tooling, cloud deployment platforms, and developer-first web architectures.",
    isVerified: true,
    truthTeller: {
      totalApplications: 1284,
      reviewedApplications: 1142,
      reviewRate: 89,
      medianFirstReviewDays: 1.8,
      lastRecruiterActivity: "Active 45 mins ago",
      isFastReviewer: true,
    },
  },
  {
    id: "comp-2",
    slug: "neuralflow-labs",
    name: "NeuralFlow Labs",
    logoInitial: "N",
    website: "https://neuralflow.ai",
    location: "Bangalore, India",
    industry: "Artificial Intelligence & RAG",
    description:
      "Pioneering Generative AI research, open-weights foundation model optimization, and production-grade RAG infrastructure.",
    isVerified: true,
    truthTeller: {
      totalApplications: 940,
      reviewedApplications: 780,
      reviewRate: 83,
      medianFirstReviewDays: 2.4,
      lastRecruiterActivity: "Active 2 hours ago",
      isFastReviewer: true,
    },
  },
  {
    id: "comp-3",
    slug: "devscale-systems",
    name: "DevScale Systems",
    logoInitial: "D",
    website: "https://devscale.io",
    location: "Bangalore, India",
    industry: "Enterprise SaaS & APIs",
    description:
      "DevScale accelerates enterprise software delivery through automated CI/CD observability and containerized microservices.",
    isVerified: true,
    truthTeller: {
      totalApplications: 1420,
      reviewedApplications: 1192,
      reviewRate: 84,
      medianFirstReviewDays: 2.0,
      lastRecruiterActivity: "Active today",
      isFastReviewer: true,
    },
  },
  {
    id: "comp-4",
    slug: "finpulse-global",
    name: "FinPulse Global",
    logoInitial: "F",
    website: "https://finpulse.com",
    location: "Mumbai, India",
    industry: "Fintech & Analytics",
    description:
      "Real-time transactional fraud detection, automated financial reconciliation, and consumer banking analytics at scale.",
    isVerified: true,
    truthTeller: {
      totalApplications: 620,
      reviewedApplications: 533,
      reviewRate: 86,
      medianFirstReviewDays: 1.5,
      lastRecruiterActivity: "Active yesterday",
      isFastReviewer: true,
    },
  },
  {
    id: "comp-5",
    slug: "pocketbyte-apps",
    name: "PocketByte Apps",
    logoInitial: "P",
    website: "https://pocketbyte.app",
    location: "Remote",
    industry: "Consumer Mobile Apps",
    description:
      "Creating engaging, lightweight mobile applications for millions of global smartphone users across utilities and education.",
    isVerified: false,
    truthTeller: {
      totalApplications: 410,
      reviewedApplications: 275,
      reviewRate: 67,
      medianFirstReviewDays: 3.1,
      lastRecruiterActivity: "Active 2 days ago",
      isFastReviewer: false,
    },
  },
];
