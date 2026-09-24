import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface StreakLeader {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  verifiedDevScore: number;
  badgesCount: number;
  recentBadge: string;
  isCurrentUser?: boolean;
}

interface TrendingRepository {
  id: string;
  name: string;
  owner: string;
  avatarUrl: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  starsToday: number;
  devScore: number;
  repoUrl: string;
  demoUrl?: string;
  topics: string[];
}

const SAMPLE_LEADERS: StreakLeader[] = [
  {
    rank: 1,
    userId: "u-1",
    name: "Aarav Sharma",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav",
    currentStreak: 48,
    longestStreak: 48,
    totalXp: 3450,
    verifiedDevScore: 920,
    badgesCount: 6,
    recentBadge: "🔥 30-Day Master",
  },
  {
    rank: 2,
    userId: "u-2",
    name: "Sneha Patel",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sneha",
    currentStreak: 41,
    longestStreak: 41,
    totalXp: 2980,
    verifiedDevScore: 885,
    badgesCount: 5,
    recentBadge: "⚡ Code Prodigy",
  },
  {
    rank: 3,
    userId: "u-3",
    name: "Divyanshu Jethi",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Divyanshu",
    currentStreak: 35,
    longestStreak: 35,
    totalXp: 2750,
    verifiedDevScore: 965,
    badgesCount: 7,
    recentBadge: "🚀 Super Builder",
  },
  {
    rank: 4,
    userId: "u-4",
    name: "Rohan Verma",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Rohan",
    currentStreak: 29,
    longestStreak: 32,
    totalXp: 2150,
    verifiedDevScore: 840,
    badgesCount: 4,
    recentBadge: "🎓 Certified Scholar",
  },
  {
    rank: 5,
    userId: "u-5",
    name: "Ananya Iyer",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Ananya",
    currentStreak: 24,
    longestStreak: 24,
    totalXp: 1820,
    verifiedDevScore: 810,
    badgesCount: 4,
    recentBadge: "🔥 Week Warrior",
  },
  {
    rank: 6,
    userId: "u-6",
    name: "Vikram Malhotra",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Vikram",
    currentStreak: 19,
    longestStreak: 22,
    totalXp: 1450,
    verifiedDevScore: 780,
    badgesCount: 3,
    recentBadge: "💼 Job Hunter",
  },
  {
    rank: 7,
    userId: "u-7",
    name: "Pooja Reddy",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Pooja",
    currentStreak: 16,
    longestStreak: 16,
    totalXp: 1220,
    verifiedDevScore: 760,
    badgesCount: 3,
    recentBadge: "🌱 First Step",
  },
];

// Trendshift.io inspired trending repositories
const TRENDING_REPOSITORIES: TrendingRepository[] = [
  {
    id: "repo-1",
    name: "micrograd-wasm",
    owner: "karpathy",
    avatarUrl: "https://github.com/karpathy.png",
    description: "Tiny Autograd engine and neural network backpropagation implemented in pure TypeScript with WebGPU compute shaders.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 3420,
    forks: 410,
    starsToday: 128,
    devScore: 990,
    repoUrl: "https://github.com/karpathy/micrograd",
    demoUrl: "https://htmlpreview.github.io/?https://github.com/karpathy/micrograd",
    topics: ["ai", "autograd", "neural-networks", "deep-learning"],
  },
  {
    id: "repo-2",
    name: "jobmint-dev-score",
    owner: "divyanshujethi",
    avatarUrl: "https://github.com/divyanshujethi.png",
    description: "Proof-of-Work developer caliber verification algorithm. Parses real GitHub commits, AST language trees, and live web sandboxes.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 840,
    forks: 92,
    starsToday: 45,
    devScore: 965,
    repoUrl: "https://github.com/divyanshujethi/Jobmint",
    demoUrl: "https://jobmint.ritualdev.in/dev-score",
    topics: ["nextjs", "proof-of-work", "github-api", "engineering-score"],
  },
  {
    id: "repo-3",
    name: "perspective-trading-view",
    owner: "fintech-builder",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Fintech",
    description: "Real-time high-throughput streaming canvas for financial stock books powered by JPMorgan Chase's Perspective WebAssembly engine.",
    language: "Rust",
    languageColor: "#dea584",
    stars: 1290,
    forks: 180,
    starsToday: 76,
    devScore: 925,
    repoUrl: "https://github.com/finos/perspective",
    demoUrl: "https://finos.github.io/perspective/",
    topics: ["webassembly", "high-frequency", "financial-charts", "rust"],
  },
  {
    id: "repo-4",
    name: "nano-llama-browser",
    owner: "webgpu-labs",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=WebGpu",
    description: "Zero-server, 100% private in-browser LLM chat powered by WebGPU tensor execution with automatic Potato PC fallback detection.",
    language: "Python",
    languageColor: "#3572A5",
    stars: 2150,
    forks: 310,
    starsToday: 94,
    devScore: 910,
    repoUrl: "https://github.com/mlc-ai/web-llm",
    demoUrl: "https://webllm.mlc.ai/",
    topics: ["webgpu", "local-ai", "llama3", "client-side"],
  },
  {
    id: "repo-5",
    name: "go-distributed-indexer",
    owner: "gopher-sys",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Gopher",
    description: "Ultra-fast distributed full-text inverted index engine built in Go with Raft consensus and sub-10ms query latencies.",
    language: "Go",
    languageColor: "#00ADD8",
    stars: 1780,
    forks: 230,
    starsToday: 58,
    devScore: 895,
    repoUrl: "https://github.com/blevesearch/bleve",
    topics: ["golang", "distributed-systems", "search-engine", "raft"],
  },
  {
    id: "repo-6",
    name: "dpdp-consent-manager",
    owner: "ritualdev-cloud",
    avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=RitualDev",
    description: "India DPDP Act 2023 compliant data governance middleware. Provides automated Section 11 export and Section 12 cryptographic deletion audit trails.",
    language: "TypeScript",
    languageColor: "#3178c6",
    stars: 620,
    forks: 55,
    starsToday: 32,
    devScore: 880,
    repoUrl: "https://github.com/divyanshujethi/Jobmint",
    demoUrl: "https://jobmint.ritualdev.in/privacy",
    topics: ["dpdp-act", "privacy-engineering", "compliance", "audit-logs"],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("language");

  let filteredRepos = TRENDING_REPOSITORIES;
  if (lang && lang !== "ALL") {
    filteredRepos = TRENDING_REPOSITORIES.filter(
      (r) => r.language.toLowerCase() === lang.toLowerCase()
    );
  }

  return NextResponse.json({
    leaders: SAMPLE_LEADERS,
    trendingRepos: filteredRepos,
    totalBuildersActiveToday: 1420,
    activeStreaksCount: 3890,
  });
}
