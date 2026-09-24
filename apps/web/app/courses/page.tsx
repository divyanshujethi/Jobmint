"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Youtube,
  Github,
  BookOpen,
  Sparkles,
  Search,
  ExternalLink,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Layers,
  Code2,
  Cpu,
  Globe,
  Terminal,
  Shield,
  Smartphone,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface CoursePlaylist {
  id: string;
  title: string;
  creator: string;
  creatorSubscribers: string;
  category: "AI_ML" | "WEB_DEV" | "DSA" | "DEVOPS_CLOUD" | "CYBERSECURITY";
  subcategory: string;
  youtubeUrl: string;
  duration: string;
  totalVideos: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Intermediate" | "Beginner to Advanced" | "All Levels";
  skillsLearned: string[];
  description: string;
  recommendedGithubRepos: {
    name: string;
    repoUrl: string;
    stars: string;
    description: string;
  }[];
}

const CURATED_COURSES: CoursePlaylist[] = [
  // AI & MACHINE LEARNING
  {
    id: "karpathy-nn",
    title: "Neural Networks: Zero to Hero",
    creator: "Andrej Karpathy",
    creatorSubscribers: "680K+",
    category: "AI_ML",
    subcategory: "Deep Learning & Transformer Architectures",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ",
    duration: "20+ Hours",
    totalVideos: 8,
    difficulty: "Intermediate",
    skillsLearned: ["Backpropagation", "Micrograd", "Makemore (Language Models)", "GPT from Scratch", "Tokenizer"],
    description:
      "World-class, hands-on deep learning lecture series from former Tesla AI Director & OpenAI founding member Andrej Karpathy. Builds GPT-2 completely from raw Python.",
    recommendedGithubRepos: [
      {
        name: "karpathy/nanoGPT",
        repoUrl: "https://github.com/karpathy/nanoGPT",
        stars: "34k ⭐",
        description: "The simplest, fastest repository for training/finetuning medium-sized GPTs in PyTorch.",
      },
      {
        name: "karpathy/micrograd",
        repoUrl: "https://github.com/karpathy/micrograd",
        stars: "11k ⭐",
        description: "A tiny scalar-valued autograd engine with a small PyTorch-like neural net library.",
      },
    ],
  },
  {
    id: "krish-genai",
    title: "Complete Generative AI & LangChain Playlist",
    creator: "Krish Naik",
    creatorSubscribers: "1M+",
    category: "AI_ML",
    subcategory: "Generative AI & LLMs",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLZoTAELRMXVORE4VDCg1h34W889kCgnQU",
    duration: "35+ Hours",
    totalVideos: 42,
    difficulty: "Beginner to Intermediate",
    skillsLearned: ["OpenAI API", "Hugging Face", "LangChain", "Llama 3", "Vector Databases (Chroma/FAISS)", "RAG Systems"],
    description:
      "End-to-end practical Generative AI roadmap covering RAG pipelines, agents, fine-tuning open-weights models, and deploying production conversational AI apps.",
    recommendedGithubRepos: [
      {
        name: "langchain-ai/langchain",
        repoUrl: "https://github.com/langchain-ai/langchain",
        stars: "96k ⭐",
        description: "Building applications with LLMs through composability and RAG pipelines.",
      },
      {
        name: "vllm-project/vllm",
        repoUrl: "https://github.com/vllm-project/vllm",
        stars: "32k ⭐",
        description: "A high-throughput and memory-efficient inference and serving engine for LLMs.",
      },
    ],
  },
  {
    id: "3b1b-dl",
    title: "Essence of Neural Networks & Calculus",
    creator: "3Blue1Brown",
    creatorSubscribers: "6.2M+",
    category: "AI_ML",
    subcategory: "Mathematical Foundations",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi",
    duration: "4 Hours",
    totalVideos: 5,
    difficulty: "Beginner",
    skillsLearned: ["Gradient Descent", "Loss Functions", "Matrix Transformations", "Backpropagation Intuition"],
    description:
      "The undisputed gold standard visual explanation of neural network mathematics, weights, biases, and high-dimensional loss geometry.",
    recommendedGithubRepos: [
      {
        name: "3b1b/manim",
        repoUrl: "https://github.com/3b1b/manim",
        stars: "66k ⭐",
        description: "Animation engine for explanatory math and machine learning videos.",
      },
    ],
  },

  // FULL-STACK & WEB DEVELOPMENT
  {
    id: "hitesh-chai-fullstack",
    title: "Chai aur Full Stack Next.js & Node.js",
    creator: "Hitesh Choudhary (Chai aur Code)",
    creatorSubscribers: "1.2M+",
    category: "WEB_DEV",
    subcategory: "Full-Stack React & Next.js",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBAaWGtn9GA2PTw0HO0tXzq",
    duration: "28+ Hours",
    totalVideos: 30,
    difficulty: "Beginner to Intermediate",
    skillsLearned: ["React 19", "Next.js App Router", "Server Actions", "PostgreSQL", "Prisma/Drizzle", "Auth.js"],
    description:
      "Production-focused Hindi/Hinglish comprehensive guide to building modern full-stack web applications with authentication, serverless backends, and deployment.",
    recommendedGithubRepos: [
      {
        name: "shadcn/ui",
        repoUrl: "https://github.com/shadcn/ui",
        stars: "76k ⭐",
        description: "Beautifully designed components that you can copy and paste into your apps.",
      },
      {
        name: "drizzle-team/drizzle-orm",
        repoUrl: "https://github.com/drizzle-team/drizzle-orm",
        stars: "38k ⭐",
        description: "TypeScript ORM for SQL databases with maximum performance and zero overhead.",
      },
    ],
  },
  {
    id: "traversy-modern-web",
    title: "Traversy Media Full-Stack Crash Courses",
    creator: "Traversy Media (Brad Traversy)",
    creatorSubscribers: "2.2M+",
    category: "WEB_DEV",
    subcategory: "Modern Web Foundations & APIs",
    youtubeUrl: "https://www.youtube.com/c/TraversyMedia/playlists",
    duration: "40+ Hours",
    totalVideos: 25,
    difficulty: "Beginner",
    skillsLearned: ["Modern JavaScript", "REST APIs", "Node.js", "Express", "Docker for Web Developers"],
    description:
      "Crystal-clear, no-nonsense practical project tutorials by veteran educator Brad Traversy. Learn how real backends and frontends glue together.",
    recommendedGithubRepos: [
      {
        name: "goldbergyoni/nodebestpractices",
        repoUrl: "https://github.com/goldbergyoni/nodebestpractices",
        stars: "98k ⭐",
        description: "The largest compilation of Node.js best practices, security guidelines, and architectural rules.",
      },
    ],
  },

  // DATA STRUCTURES & ALGORITHMS (DSA)
  {
    id: "striver-a2z-dsa",
    title: "A2Z DSA Course / Sheet Playlist",
    creator: "Striver (takeUforward)",
    creatorSubscribers: "800K+",
    category: "DSA",
    subcategory: "Complete Coding Interview Prep",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
    duration: "80+ Hours",
    totalVideos: 120,
    difficulty: "Beginner to Advanced",
    skillsLearned: ["Arrays", "Sliding Window", "Trees & Graphs", "Dynamic Programming", "Bit Manipulation", "Recursion"],
    description:
      "The #1 coding interview preparation syllabus for Indian and global tech placements (FAANG/MAANG, Unicorns). Step-by-step intuition, brute to optimal approaches.",
    recommendedGithubRepos: [
      {
        name: "kamyu104/LeetCode-Solutions",
        repoUrl: "https://github.com/kamyu104/LeetCode-Solutions",
        stars: "45k ⭐",
        description: "Python and C++ clean optimal solutions to all LeetCode algorithm problems.",
      },
      {
        name: "jwasham/coding-interview-university",
        repoUrl: "https://github.com/jwasham/coding-interview-university",
        stars: "310k ⭐",
        description: "A complete multi-month study plan to become a software engineer for large tech companies.",
      },
    ],
  },
  {
    id: "neetcode-blind75",
    title: "NeetCode Blind 75 / Roadmap Playlist",
    creator: "NeetCode",
    creatorSubscribers: "850K+",
    category: "DSA",
    subcategory: "Pattern Recognition & LeetCode",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLot-Xpze53ldVwtstag2TL4HQhAnC8ATf",
    duration: "30+ Hours",
    totalVideos: 75,
    difficulty: "Intermediate",
    skillsLearned: ["Two Pointers", "Binary Search", "Heap / Priority Queue", "Trie", "Backtracking", "Graph DFS/BFS"],
    description:
      "Taught by an ex-Google software engineer. Visual whiteboard code walkthroughs categorizing interview questions by fundamental algorithmic patterns.",
    recommendedGithubRepos: [
      {
        name: "donnemartin/system-design-primer",
        repoUrl: "https://github.com/donnemartin/system-design-primer",
        stars: "275k ⭐",
        description: "Learn how to design large-scale systems and prepare for the system design interview.",
      },
    ],
  },

  // DEVOPS, CLOUD & LINUX
  {
    id: "nana-devops-bootcamp",
    title: "DevOps Full Course & Kubernetes Mastery",
    creator: "TechWorld with Nana",
    creatorSubscribers: "1.1M+",
    category: "DEVOPS_CLOUD",
    subcategory: "Containers & Orchestration",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLy7NrLnytVU7YfU7pX9K_n2ZzG_Jq76K_",
    duration: "24+ Hours",
    totalVideos: 18,
    difficulty: "Beginner to Intermediate",
    skillsLearned: ["Docker", "Kubernetes", "YAML Configs", "CI/CD Pipelines", "Helm Charts", "Prometheus"],
    description:
      "Visual, crystal-clear explanation of modern cloud infrastructure. From running your first Docker container to deploying microservices on Kubernetes.",
    recommendedGithubRepos: [
      {
        name: "bregman-arie/devops-exercises",
        repoUrl: "https://github.com/bregman-arie/devops-exercises",
        stars: "64k ⭐",
        description: "Linux, Jenkins, AWS, SRE, Prometheus, Docker, Python, Ansible interview questions and practical tasks.",
      },
    ],
  },
  {
    id: "networkchuck-linux",
    title: "Linux for Hackers & Cloud Engineers",
    creator: "NetworkChuck",
    creatorSubscribers: "3.5M+",
    category: "DEVOPS_CLOUD",
    subcategory: "Linux CLI & Networking",
    youtubeUrl: "https://www.youtube.com/playlist?list=PLS1QulWo1RIZqA0q9XQoVb1vG2rB_x6qC",
    duration: "15+ Hours",
    totalVideos: 15,
    difficulty: "Beginner",
    skillsLearned: ["Bash Scripting", "SSH Keys", "Permissions (chmod/chown)", "Networking (DNS/TCP)", "Firewalls (ufw)"],
    description:
      "Energetic, engaging terminal mastery for developers. Learn the core Linux command line skills needed for cloud computing, AWS, and server management.",
    recommendedGithubRepos: [
      {
        name: "awesome-selfhosted/awesome-selfhosted",
        repoUrl: "https://github.com/awesome-selfhosted/awesome-selfhosted",
        stars: "215k ⭐",
        description: "A list of Free Software network services and web applications which can be hosted locally on Linux servers.",
      },
    ],
  },
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = CURATED_COURSES.filter((course) => {
    if (selectedCategory !== "ALL" && course.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        course.title.toLowerCase().includes(q) ||
        course.creator.toLowerCase().includes(q) ||
        course.subcategory.toLowerCase().includes(q) ||
        course.skillsLearned.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-mono font-semibold text-emerald-400">
            <BookOpen className="h-4 w-4" />
            Curated Free Developer Curricula
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Interactive Courses & Best YouTube Playlists
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            Hand-picked video curricula from the world&apos;s best tech educators (Andrej Karpathy, Striver, Hitesh Choudhary, Nana, NeetCode) paired with essential open-source GitHub libraries.
          </p>
        </div>

        {/* TABS & SEARCH BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "ALL" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Subjects ({CURATED_COURSES.length})
            </button>

            <button
              onClick={() => setSelectedCategory("AI_ML")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "AI_ML" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🤖 AI & GenAI
            </button>

            <button
              onClick={() => setSelectedCategory("WEB_DEV")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "WEB_DEV" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              💻 Full-Stack Web
            </button>

            <button
              onClick={() => setSelectedCategory("DSA")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DSA" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ⚡ DSA & LeetCode
            </button>

            <button
              onClick={() => setSelectedCategory("DEVOPS_CLOUD")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DEVOPS_CLOUD" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ☁️ Cloud & DevOps
            </button>
          </div>

          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search subject or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-800 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* COURSES & PLAYLISTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((course) => (
            <Card
              key={course.id}
              className="border-slate-800 bg-slate-900/90 text-white flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold">
                        {course.subcategory}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{course.difficulty}</span>
                    </div>

                    <CardTitle className="text-lg font-bold text-white leading-snug">
                      {course.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">{course.creator}</span>
                      <span>({course.creatorSubscribers})</span>
                    </div>
                  </div>

                  <a
                    href={course.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    title="Watch Playlist on YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {course.description}
                </p>

                {/* METRICS */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950/60 border border-slate-800 p-2.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Duration: <strong className="text-white">{course.duration}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Play className="h-3.5 w-3.5 text-blue-400" />
                    <span>{course.totalVideos} Videos in Series</span>
                  </div>
                </div>

                {/* SKILLS */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    Core Skills Covered
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {course.skillsLearned.map((sk) => (
                      <span
                        key={sk}
                        className="rounded bg-slate-800 border border-slate-700/60 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* RECOMMENDED GITHUB LIBRARIES */}
                {course.recommendedGithubRepos.length > 0 && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                      <Github className="h-3.5 w-3.5 text-slate-200" />
                      Must-Star GitHub Libraries for this Subject
                    </div>
                    <div className="space-y-2">
                      {course.recommendedGithubRepos.map((repo) => (
                        <div
                          key={repo.name}
                          className="flex items-start justify-between gap-2 text-xs border-t border-slate-800/80 pt-1.5 first:border-0 first:pt-0"
                        >
                          <div>
                            <a
                              href={repo.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              {repo.name}
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {repo.description}
                            </p>
                          </div>
                          <span className="font-mono text-[10px] text-amber-400 font-semibold shrink-0">
                            {repo.stars}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/roadmaps`}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <span>View Full Career Roadmap</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  <a
                    href={course.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Start Playlist on YouTube</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}