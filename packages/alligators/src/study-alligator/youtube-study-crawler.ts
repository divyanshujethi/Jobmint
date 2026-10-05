/**
 * RoleNest Study Alligator: Autonomous YouTube Study Curriculum Crawler
 * Zero-API-key, zero-quota-limit, official public YouTube oEmbed + InnerTube ingestion pipeline.
 * Extracts: Title, Creator, Video Count, Video IDs, Duration, Thumbnails,
 * Curriculum Modules, Extracted Tech Skills, Chapters, and Auto-Synthesized Certification Benchmarks.
 */

export interface VideoChapter {
  timestamp: string;
  seconds: number;
  title: string;
  notes: string;
}

export interface CrawledPlaylistVideo {
  index: number;
  videoId: string;
  title: string;
  durationLabel?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
}

export interface CrawledCoursePlaylist {
  id: string;
  title: string;
  creator: string;
  creatorSubscribers: string;
  category: "AI_ML" | "WEB_DEV" | "DSA" | "DEVOPS_CLOUD" | "CYBERSECURITY" | "PYTHON_DATA" | "SYSTEM_DESIGN" | "FREE_TEST" | string;
  subcategory: string;
  youtubeUrl: string;
  embedPlaylistId: string;
  duration: string;
  totalVideos: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Intermediate" | "Beginner to Advanced" | "Intermediate to Advanced" | "All Levels";
  skillsLearned: string[];
  description: string;
  certificateTitle: string;
  projectBenchmark: string;
  curriculumModules: string[];
  recommendedGithubRepos: {
    name: string;
    repoUrl: string;
    stars: string;
    description: string;
  }[];
  relatedProblemCategory?: string;
  videoChapters?: VideoChapter[];
  thumbnailUrl?: string;
  crawledAt: string;
  isDynamic: boolean;
}

/**
 * Extracts YouTube Playlist ID from a URL or raw ID
 */
export function extractYouTubePlaylistId(input: string): string | null {
  if (!input) return null;
  const clean = input.trim();

  // 1. Direct Playlist ID
  if (/^[a-zA-Z0-9_-]{12,}$/.test(clean) && !clean.includes("http")) {
    return clean;
  }

  // 2. URL with ?list= or &list=
  const listMatch = clean.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (listMatch && listMatch[1]) {
    return listMatch[1];
  }

  // 3. /playlist/ID or /embed/videoseries?list=ID
  const pathMatch = clean.match(/\/playlist\/([a-zA-Z0-9_-]+)/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }

  return null;
}

/**
 * Parses duration strings like "5 minutes, 46 seconds" or "1 hour, 20 minutes" into seconds
 */
export function parseDurationLabel(label: string): number {
  if (!label) return 0;
  let total = 0;
  const hourMatch = label.match(/(\d+)\s*hour/i);
  if (hourMatch) total += parseInt(hourMatch[1], 10) * 3600;

  const minMatch = label.match(/(\d+)\s*minute/i);
  if (minMatch) total += parseInt(minMatch[1], 10) * 60;

  const secMatch = label.match(/(\d+)\s*second/i);
  if (secMatch) total += parseInt(secMatch[1], 10);

  // Fallback for mm:ss or hh:mm:ss
  if (total === 0 && label.includes(":")) {
    const parts = label.trim().split(":").map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      total = parts[0] * 60 + parts[1];
    } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      total = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }

  return total;
}

/**
 * Format total seconds into human-readable duration string (e.g. "8.5 Hours" or "45 Mins")
 */
export function formatTotalDuration(seconds: number, videoCount: number): string {
  if (seconds <= 0) {
    if (videoCount > 0) return `${videoCount} Lessons / Self-Paced`;
    return "Self-Paced";
  }
  const hours = seconds / 3600;
  if (hours >= 1) {
    return `${hours.toFixed(1).replace(/\.0$/, "")} Hours (${videoCount} Videos)`;
  }
  const minutes = Math.round(seconds / 60);
  return `${minutes} Mins (${videoCount} Videos)`;
}

const KNOWN_TECH_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Node.js", "Express", "NestJS",
  "Python", "PyTorch", "TensorFlow", "FastAPI", "Django", "Flask", "Pandas", "NumPy", "Scikit-Learn",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "GitHub Actions", "Terraform", "Linux",
  "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "Drizzle", "GraphQL", "REST API",
  "DSA", "Algorithms", "Data Structures", "System Design", "Microservices", "Kafka", "RabbitMQ",
  "Java", "Spring Boot", "C++", "Golang", "Rust", "Swift", "Flutter", "React Native",
  "Git", "GitHub", "Ethical Hacking", "Cybersecurity", "Network Security", "Penetration Testing",
  "LLM", "Generative AI", "LangChain", "LlamaIndex", "HuggingFace", "RAG", "Computer Vision", "NLP"
];

/**
 * Intelligent category & subcategory inference
 */
export function inferCategoryAndSkills(
  title: string,
  description: string,
  videoTitles: string[]
): {
  category: "AI_ML" | "WEB_DEV" | "DSA" | "DEVOPS_CLOUD" | "CYBERSECURITY" | "PYTHON_DATA" | "SYSTEM_DESIGN";
  subcategory: string;
  skills: string[];
} {
  const combined = `${title} ${description} ${videoTitles.join(" ")}`.toLowerCase();

  const foundSkills = KNOWN_TECH_SKILLS.filter((skill) => {
    const rx = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    return rx.test(combined);
  });

  // Category determination
  if (
    combined.includes("pytorch") ||
    combined.includes("deep learning") ||
    combined.includes("generative ai") ||
    combined.includes("llm") ||
    combined.includes("neural network") ||
    combined.includes("machine learning") ||
    combined.includes("langchain") ||
    combined.includes("transformers")
  ) {
    return {
      category: "AI_ML",
      subcategory: "Deep Learning & Generative AI",
      skills: Array.from(new Set(["AI", "Machine Learning", ...foundSkills])),
    };
  }

  if (
    combined.includes("system design") ||
    combined.includes("microservices") ||
    combined.includes("distributed systems") ||
    combined.includes("hld") ||
    combined.includes("lld")
  ) {
    return {
      category: "SYSTEM_DESIGN",
      subcategory: "Distributed Systems & Scalability",
      skills: Array.from(new Set(["System Design", "Architecture", ...foundSkills])),
    };
  }

  if (
    combined.includes("docker") ||
    combined.includes("kubernetes") ||
    combined.includes("devops") ||
    combined.includes("terraform") ||
    combined.includes("ci/cd") ||
    combined.includes("aws") ||
    combined.includes("cloud computing")
  ) {
    return {
      category: "DEVOPS_CLOUD",
      subcategory: "Cloud Infrastructure & Containerization",
      skills: Array.from(new Set(["DevOps", "Cloud", ...foundSkills])),
    };
  }

  if (
    combined.includes("dsa") ||
    combined.includes("data structure") ||
    combined.includes("algorithm") ||
    combined.includes("leetcode") ||
    combined.includes("striver") ||
    combined.includes("neetcode")
  ) {
    return {
      category: "DSA",
      subcategory: "Algorithms & Competitive Problem Solving",
      skills: Array.from(new Set(["DSA", "Algorithms", "Problem Solving", ...foundSkills])),
    };
  }

  if (
    combined.includes("cybersecurity") ||
    combined.includes("ethical hacking") ||
    combined.includes("penetration test") ||
    combined.includes("bug bounty") ||
    combined.includes("kali linux")
  ) {
    return {
      category: "CYBERSECURITY",
      subcategory: "Offensive Security & Network Defense",
      skills: Array.from(new Set(["Cybersecurity", "Network Security", ...foundSkills])),
    };
  }

  if (
    combined.includes("python for data") ||
    combined.includes("data science") ||
    combined.includes("pandas") ||
    combined.includes("numpy") ||
    combined.includes("data analysis")
  ) {
    return {
      category: "PYTHON_DATA",
      subcategory: "Data Engineering & Analytics",
      skills: Array.from(new Set(["Python", "Data Science", ...foundSkills])),
    };
  }

  // Default: Full Stack Web Dev
  return {
    category: "WEB_DEV",
    subcategory: "Modern Full-Stack Development",
    skills: Array.from(new Set(["Web Development", ...(foundSkills.length > 0 ? foundSkills : ["TypeScript", "Full Stack"])])),
  };
}

/**
 * Returns default companion GitHub repos for category
 */
function getCategoryRepos(category: string, title: string) {
  switch (category) {
    case "AI_ML":
      return [
        {
          name: "karpathy/micrograd",
          repoUrl: "https://github.com/karpathy/micrograd",
          stars: "11.2k★",
          description: "A tiny scalar-valued autograd engine and neural net library.",
        },
        {
          name: "huggingface/transformers",
          repoUrl: "https://github.com/huggingface/transformers",
          stars: "135k★",
          description: "State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX.",
        },
      ];
    case "DSA":
      return [
        {
          name: "kdn251/interviews",
          repoUrl: "https://github.com/kdn251/interviews",
          stars: "62.4k★",
          description: "Everything you need to know to pass coding & algorithm interviews.",
        },
        {
          name: "trekhleb/javascript-algorithms",
          repoUrl: "https://github.com/trekhleb/javascript-algorithms",
          stars: "185k★",
          description: "Algorithms and data structures implemented in JavaScript with explanations.",
        },
      ];
    case "DEVOPS_CLOUD":
      return [
        {
          name: "bregman-arie/devops-exercises",
          repoUrl: "https://github.com/bregman-arie/devops-exercises",
          stars: "64k★",
          description: "Linux, Jenkins, AWS, SRE, Prometheus, Docker, Python, Ansible, Git, Kubernetes exercises.",
        },
      ];
    case "SYSTEM_DESIGN":
      return [
        {
          name: "donnemartin/system-design-primer",
          repoUrl: "https://github.com/donnemartin/system-design-primer",
          stars: "275k★",
          description: "Learn how to design large-scale systems. Prep for the system design interview.",
        },
      ];
    case "CYBERSECURITY":
      return [
        {
          name: "swisskyrepo/PayloadsAllTheThings",
          repoUrl: "https://github.com/swisskyrepo/PayloadsAllTheThings",
          stars: "59k★",
          description: "A list of useful payloads and bypasses for Web Application Security.",
        },
      ];
    default:
      return [
        {
          name: "kamranahmedse/developer-roadmap",
          repoUrl: "https://github.com/kamranahmedse/developer-roadmap",
          stars: "310k★",
          description: "Interactive roadmaps, guides and other educational content for developers.",
        },
      ];
  }
}

/**
 * Main Crawler: Ingests any YouTube playlist into the RoleNest Course format
 */
export async function crawlYouTubePlaylist(
  playlistIdOrUrl: string,
  options?: {
    category?: "AI_ML" | "WEB_DEV" | "DSA" | "DEVOPS_CLOUD" | "CYBERSECURITY" | "PYTHON_DATA" | "SYSTEM_DESIGN";
    subcategory?: string;
    difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Intermediate" | "Beginner to Advanced" | "Intermediate to Advanced" | "All Levels";
  }
): Promise<CrawledCoursePlaylist> {
  const playlistId = extractYouTubePlaylistId(playlistIdOrUrl);
  if (!playlistId) {
    throw new Error(`Invalid YouTube playlist URL or ID: "${playlistIdOrUrl}"`);
  }

  // 1. Fetch Official oEmbed (Fast & High-Fidelity)
  let oembedData: any = null;
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/playlist?list=${playlistId}&format=json`,
      {
        headers: { "User-Agent": "RoleNest-Study-Crawler/1.0" },
      }
    );
    if (oembedRes.ok) {
      oembedData = await oembedRes.json();
    }
  } catch (err) {
    console.warn(`[Study Alligator] oEmbed warning for ${playlistId}:`, err);
  }

  // 2. Fetch Playlist Webpage HTML to extract InnerTube data
  const pageRes = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!pageRes.ok) {
    throw new Error(`YouTube responded with HTTP ${pageRes.status} for playlist ${playlistId}`);
  }

  const html = await pageRes.text();

  // Extract ytInitialData JSON
  let ytInitialData: any = null;
  const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
  if (match) {
    try {
      ytInitialData = JSON.parse(match[1]);
    } catch (e) {
      console.warn(`[Study Alligator] Could not parse ytInitialData for ${playlistId}`);
    }
  }

  // Extract Title
  let title =
    ytInitialData?.metadata?.playlistMetadataRenderer?.title ||
    oembedData?.title ||
    "Mastering Modern Software Engineering";

  // Clean title if ends with " - YouTube"
  title = title.replace(/\s*-\s*YouTube$/i, "").trim();

  // Extract Creator / Owner
  const sec = ytInitialData?.sidebar?.playlistSidebarRenderer?.items?.[1]?.playlistSidebarSecondaryInfoRenderer;
  const creator =
    sec?.videoOwner?.videoOwnerRenderer?.title?.runs?.[0]?.text ||
    oembedData?.author_name ||
    "Verified Tech Instructor";

  // Extract Description
  const description =
    ytInitialData?.metadata?.playlistMetadataRenderer?.description ||
    `Complete step-by-step masterclass on ${title}. Verified curriculum with hands-on code examples and modular real-world architectures.`;

  // Extract Videos from ytInitialData
  const parsedVideos: CrawledPlaylistVideo[] = [];
  const items =
    ytInitialData?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer
      ?.contents?.[0]?.itemSectionRenderer?.contents || [];

  let accumulatedDurationSeconds = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const vm = item.lockupViewModel;
    if (vm) {
      const videoId = vm?.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint?.videoId;
      const titleText = vm?.metadata?.lockupMetadataViewModel?.title?.content;
      const label = vm?.rendererContext?.accessibilityContext?.label || "";
      const durSec = parseDurationLabel(label);

      if (videoId && titleText) {
        accumulatedDurationSeconds += durSec;
        parsedVideos.push({
          index: i + 1,
          videoId,
          title: titleText,
          durationLabel: label,
          durationSeconds: durSec,
        });
      }
    }
  }

  // Extract video count
  const primStats =
    ytInitialData?.sidebar?.playlistSidebarRenderer?.items?.[0]?.playlistSidebarPrimaryInfoRenderer?.stats;
  let videoCount = parsedVideos.length;
  if (primStats && primStats[0]?.runs?.[0]?.text) {
    const parsedCount = parseInt(primStats[0].runs[0].text.replace(/,/g, ""), 10);
    if (!isNaN(parsedCount) && parsedCount > videoCount) {
      videoCount = parsedCount;
    }
  }

  // Extract thumbnail
  const thumbnailUrl =
    oembedData?.thumbnail_url ||
    ytInitialData?.microformat?.microformatDataRenderer?.thumbnail?.thumbnails?.[0]?.url ||
    (parsedVideos[0] ? `https://i.ytimg.com/vi/${parsedVideos[0].videoId}/hqdefault.jpg` : undefined);

  // Infer Category, Subcategory, Skills
  const videoTitleList = parsedVideos.map((v) => v.title);
  const inferred = inferCategoryAndSkills(title, description, videoTitleList);

  const category = options?.category || inferred.category;
  const subcategory = options?.subcategory || inferred.subcategory;
  const skills = inferred.skills;

  // Build Curriculum Modules from video titles
  const curriculumModules: string[] = [];
  if (parsedVideos.length > 0) {
    parsedVideos.slice(0, 10).forEach((v, idx) => {
      // Clean up common prefix clutter
      let cleanTitle = v.title
        .replace(/^#?\d+[\s:.-]+/, "")
        .replace(/^Tutorial\s+\d+[\s:.-]+/i, "")
        .trim();
      curriculumModules.push(`Module ${idx + 1}: ${cleanTitle}`);
    });
    if (videoCount > 10) {
      curriculumModules.push(`Module 11: Production Synthesis, Capstone Exam & Deployment`);
    }
  } else {
    curriculumModules.push(
      `Module 1: Architecture Foundations & Core Concepts`,
      `Module 2: Practical Implementation & Best Practices`,
      `Module 3: Hands-On Project Milestone & Verification`
    );
  }

  // Build Video Chapters
  const videoChapters: VideoChapter[] = parsedVideos.map((v, idx) => {
    let secOffset = 0;
    for (let j = 0; j < idx; j++) {
      secOffset += parsedVideos[j].durationSeconds || 600;
    }
    const mins = Math.floor(secOffset / 60);
    const secs = secOffset % 60;
    const timeStr = `${Math.floor(mins / 60)}:${(mins % 60).toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

    return {
      timestamp: timeStr,
      seconds: secOffset,
      title: v.title,
      notes: `Video ${v.index} in verified playlist curriculum.`,
    };
  });

  const duration = formatTotalDuration(accumulatedDurationSeconds, videoCount);
  const difficulty = options?.difficulty || "All Levels";

  // Slug ID
  const slugId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || `playlist-${playlistId}`;

  const certificateTitle = `Certified ${title.replace(/tutorial|course|playlist|masterclass/gi, "").trim()} Specialist`;
  const projectBenchmark = `Architect and deploy an enterprise-grade milestone verifying comprehensive ${skills.slice(0, 3).join(", ")} mastery.`;

  return {
    id: slugId,
    title,
    creator,
    creatorSubscribers: "Curated Instructor",
    category,
    subcategory,
    youtubeUrl: `https://www.youtube.com/playlist?list=${playlistId}`,
    embedPlaylistId: playlistId,
    duration,
    totalVideos: videoCount,
    difficulty,
    skillsLearned: skills.slice(0, 8),
    description,
    certificateTitle,
    projectBenchmark,
    curriculumModules,
    recommendedGithubRepos: getCategoryRepos(category, title),
    relatedProblemCategory: category === "DSA" ? "Algorithms" : undefined,
    videoChapters: videoChapters.length > 0 ? videoChapters : undefined,
    thumbnailUrl,
    crawledAt: new Date().toISOString(),
    isDynamic: true,
  };
}

/**
 * Top Recommended Seed Playlists for batch verification and auto-refresh
 */
export const SEED_STUDY_PLAYLISTS = [
  {
    name: "Neural Networks: Zero to Hero (Andrej Karpathy)",
    url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
    category: "AI_ML" as const,
  },
  {
    name: "Git & GitHub Tutorial for Beginners (Net Ninja)",
    url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR",
    category: "WEB_DEV" as const,
  },
  {
    name: "Chai aur Full Stack Next.js (Chai aur Code)",
    url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq",
    category: "WEB_DEV" as const,
  },
  {
    name: "Strivers A2Z-DSA Course (take U forward)",
    url: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    category: "DSA" as const,
  },
  {
    name: "LeetCode Blind 75 Solutions (NeetCode)",
    url: "https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf",
    category: "DSA" as const,
  },
  {
    name: "Java + DSA + Interview Preparation (Kunal Kushwaha)",
    url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
    category: "DSA" as const,
  },
  {
    name: "Linux for Hackers // Free Course (NetworkChuck)",
    url: "https://www.youtube.com/playlist?list=PLIhvC56v63IJIujb5cyE13oLuyORZpdkL",
    category: "CYBERSECURITY" as const,
  },
  {
    name: "Neural Networks & Deep Learning (3Blue1Brown)",
    url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
    category: "AI_ML" as const,
  },
];
