import { MockJob } from "./mock-jobs";

export interface PseoTopic {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  filterFn: (job: MockJob) => boolean;
  relatedSlugs: string[];
  faqs: { question: string; answer: string }[];
}

export const PSEO_TOPICS: Record<string, PseoTopic> = {
  "remote-frontend-developer": {
    slug: "remote-frontend-developer",
    title: "Remote Frontend Developer",
    metaTitle: "Remote Frontend Developer Jobs in India (2026) | Role Nest",
    metaDescription:
      "Explore verified remote Frontend Developer jobs. React, Next.js, TypeScript & Vue roles with transparent salaries and active Truth Teller hiring telemetry.",
    heading: "Remote Frontend Developer Jobs",
    subheading:
      "Hand-verified remote frontend opportunities at high-growth startups and tech leaders. Direct applications with verified recruiter review times.",
    filterFn: (job) => {
      const text = `${job.title} ${job.skills.join(" ")} ${job.description}`.toLowerCase();
      const isFrontend =
        text.includes("frontend") ||
        text.includes("react") ||
        text.includes("next.js") ||
        text.includes("vue") ||
        text.includes("ui");
      const isRemote = job.workMode === "REMOTE" || job.location.toLowerCase().includes("remote");
      return isFrontend && (isRemote || job.workMode === "HYBRID");
    },
    relatedSlugs: [
      "python-ai-engineer",
      "backend-developer-jobs",
      "full-stack-developer-jobs",
      "fresher-internships-bangalore",
    ],
    faqs: [
      {
        question: "What is the average salary for Remote Frontend Developers in India?",
        answer:
          "Based on verified Role Nest listings, Remote Frontend Developers earn between ₹12,00,000 to ₹35,00,000 annually, depending on experience with React, TypeScript, and modern state architectures.",
      },
      {
        question: "How does Role Nest guarantee recruiter review for remote roles?",
        answer:
          "Role Nest Truth Teller monitors recruiter activity. Companies on our verified board maintain a median review time under 3 days, eliminating application ghosting.",
      },
      {
        question: "What key skills are required for remote frontend developer jobs in 2026?",
        answer:
          "High-intent employers look for TypeScript, Next.js (App Router), React 19, Tailwind CSS, performance profiling (Core Web Vitals), and end-to-end testing.",
      },
    ],
  },
  "fresher-internships-bangalore": {
    slug: "fresher-internships-bangalore",
    title: "Fresher Internships Bangalore",
    metaTitle: "Fresher Tech Internships in Bangalore (2026) | Role Nest",
    metaDescription:
      "Find high-stipend software engineering internships in Bangalore for 2024-2026 graduates. Verified ₹40,000 - ₹80,000/mo stipends with PPO opportunities.",
    heading: "Fresher & Tech Internships in Bengaluru",
    subheading:
      "Kickstart your career at top Bangalore tech hubs. Direct mentorship, verified stipends, and clear conversion paths to full-time roles.",
    filterFn: (job) => {
      const loc = job.location.toLowerCase();
      const isBangalore = loc.includes("bangalore") || loc.includes("bengaluru") || job.workMode === "REMOTE";
      const isFresher =
        job.jobType === "INTERNSHIP" ||
        job.experienceYears <= 1 ||
        job.title.toLowerCase().includes("intern") ||
        job.title.toLowerCase().includes("fresher");
      return isBangalore && isFresher;
    },
    relatedSlugs: [
      "remote-frontend-developer",
      "python-ai-engineer",
      "fresher-developer-jobs",
      "jobs-in-bangalore",
    ],
    faqs: [
      {
        question: "What is the typical stipend for tech internships in Bangalore?",
        answer:
          "Engineering interns at top Bangalore product companies and startups earn between ₹30,000 to ₹1,00,000 per month, often with full-time pre-placement offers (PPOs).",
      },
      {
        question: "Can 2025 and 2026 batch college students apply for these internships?",
        answer:
          "Yes! Most internship roles on Role Nest welcome pre-final and final year computer science students with active GitHub projects or competitive problem-solving records.",
      },
    ],
  },
  "python-ai-engineer": {
    slug: "python-ai-engineer",
    title: "Python AI & LLM Engineer",
    metaTitle: "Python AI & Machine Learning Engineer Jobs (2026) | Role Nest",
    metaDescription:
      "Discover verified Python AI Engineer and LLM Agent roles. Work on RAG pipelines, fine-tuning, and production generative AI systems with competitive compensation.",
    heading: "Python AI & LLM Engineering Jobs",
    subheading:
      "Build generative AI agents, vector retrieval pipelines, and high-throughput Python inference microservices with leading AI teams.",
    filterFn: (job) => {
      const text = `${job.title} ${job.skills.join(" ")} ${job.description}`.toLowerCase();
      return (
        text.includes("ai") ||
        text.includes("python") ||
        text.includes("machine learning") ||
        text.includes("llm") ||
        text.includes("rag")
      );
    },
    relatedSlugs: [
      "remote-frontend-developer",
      "backend-developer-jobs",
      "fresher-internships-bangalore",
      "full-stack-developer-jobs",
    ],
    faqs: [
      {
        question: "What skills are hiring managers looking for in Python AI Engineers?",
        answer:
          "Modern AI roles prioritize Python, PyTorch/TensorFlow, LangChain/LangGraph, vector databases (Chroma, Pinecone, pgvector), function calling, and LLM fine-tuning techniques.",
      },
      {
        question: "Are remote Python AI jobs available for Indian engineers?",
        answer:
          "Yes! More than 60% of AI engineering listings on Role Nest offer flexible remote or hybrid work arrangements with global teams.",
      },
    ],
  },
  "backend-developer-jobs": {
    slug: "backend-developer-jobs",
    title: "Backend Developer Jobs",
    metaTitle: "Backend Developer Jobs in India (2026) | Role Nest",
    metaDescription:
      "Browse verified Backend Developer jobs. Distributed systems, PostgreSQL, Node.js, Go, and Java careers with transparent salary bands.",
    heading: "Backend Engineering Jobs",
    subheading:
      "Architect scalable microservices, low-latency APIs, and mission-critical databases at verified tech enterprises.",
    filterFn: (job) => {
      const text = `${job.title} ${job.skills.join(" ")} ${job.description}`.toLowerCase();
      return (
        text.includes("backend") ||
        text.includes("node") ||
        text.includes("golang") ||
        text.includes("python") ||
        text.includes("java") ||
        text.includes("database")
      );
    },
    relatedSlugs: [
      "python-ai-engineer",
      "remote-frontend-developer",
      "full-stack-developer-jobs",
      "jobs-in-bangalore",
    ],
    faqs: [
      {
        question: "What is the typical tech stack for backend jobs on Role Nest?",
        answer:
          "Companies commonly hire for Node.js/TypeScript, Go, Python (FastAPI), Java (Spring Boot), PostgreSQL, Kafka, and Redis.",
      },
    ],
  },
  "full-stack-developer-jobs": {
    slug: "full-stack-developer-jobs",
    title: "Full Stack Developer Jobs",
    metaTitle: "Full Stack Developer Jobs in India (2026) | Role Nest",
    metaDescription:
      "Find top Full Stack Developer roles with React, Next.js, Node.js, and cloud deployments. Verified hiring transparency and zero ghosting.",
    heading: "Full Stack Developer Jobs",
    subheading:
      "End-to-end product development roles combining modern frontend user interfaces with robust backend architectures.",
    filterFn: (job) => {
      const text = `${job.title} ${job.skills.join(" ")} ${job.description}`.toLowerCase();
      return text.includes("full stack") || text.includes("fullstack") || (text.includes("frontend") && text.includes("backend"));
    },
    relatedSlugs: [
      "remote-frontend-developer",
      "backend-developer-jobs",
      "python-ai-engineer",
      "fresher-internships-bangalore",
    ],
    faqs: [
      {
        question: "Why apply for Full Stack roles through Role Nest?",
        answer:
          "Role Nest verifies each listing and tracks application milestones in real-time, giving candidates honest feedback on resume views and shortlist status.",
      },
    ],
  },
  "fresher-developer-jobs": {
    slug: "fresher-developer-jobs",
    title: "Fresher Developer Jobs",
    metaTitle: "Fresher Software Engineer Jobs (2024-2026 Batches) | Role Nest",
    metaDescription:
      "Apply for junior software engineer and fresher developer jobs in India. Verified entry-level roles with genuine mentorship and competitive pay.",
    heading: "Fresher Software Engineer Jobs",
    subheading:
      "Start your engineering career at top product teams. Zero experience requirements, evaluated purely on real coding skill and problem solving.",
    filterFn: (job) => {
      return job.experienceYears === 0 || job.title.toLowerCase().includes("fresher") || job.title.toLowerCase().includes("junior");
    },
    relatedSlugs: [
      "fresher-internships-bangalore",
      "remote-frontend-developer",
      "backend-developer-jobs",
      "python-ai-engineer",
    ],
    faqs: [
      {
        question: "How can freshers stand out when applying?",
        answer:
          "Include a verified Role Nest Dev Score, solved problems on our POTD platform, and active GitHub repositories demonstrating clean code.",
      },
    ],
  },
  "jobs-in-bangalore": {
    slug: "jobs-in-bangalore",
    title: "Tech Jobs in Bangalore",
    metaTitle: "Top Tech & Software Engineer Jobs in Bangalore (2026) | Role Nest",
    metaDescription:
      "Explore software engineer, AI, and developer job openings in Bangalore. Verified tech startups and unicorn employers with transparent pay.",
    heading: "Tech Jobs in Bengaluru",
    subheading:
      "Join the Silicon Valley of India. Explore verified software engineer jobs across Koramangala, Indiranagar, Bellandur, and Whitefield.",
    filterFn: (job) => {
      const loc = job.location.toLowerCase();
      return loc.includes("bangalore") || loc.includes("bengaluru");
    },
    relatedSlugs: [
      "fresher-internships-bangalore",
      "remote-frontend-developer",
      "backend-developer-jobs",
      "python-ai-engineer",
    ],
    faqs: [
      {
        question: "Which companies are actively hiring in Bangalore?",
        answer:
          "Top product startups including Swiggy, Razorpay, Flipkart, Postman, and Stripe actively list verified engineering roles on Role Nest.",
      },
    ],
  },
};

/**
 * Resolves a slug to either a defined preset or dynamic keyword-based pSEO topic
 */
export function resolvePseoCategory(slug: string): PseoTopic | null {
  const normalized = slug.toLowerCase().trim();
  if (PSEO_TOPICS[normalized]) {
    return PSEO_TOPICS[normalized];
  }

  // Fallback pattern matching: e.g. "react-jobs", "remote-devops", "internships-in-delhi"
  const tokens = normalized.split("-").filter(Boolean);
  if (tokens.length >= 2) {
    const isJobSearch =
      tokens.includes("jobs") ||
      tokens.includes("engineer") ||
      tokens.includes("developer") ||
      tokens.includes("internship") ||
      tokens.includes("internships") ||
      tokens.includes("remote") ||
      tokens.includes("fresher");

    if (isJobSearch) {
      const titleWords = tokens.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
      return {
        slug: normalized,
        title: titleWords,
        metaTitle: `${titleWords} (2026) | Role Nest`,
        metaDescription: `Discover verified ${titleWords} with transparent salaries, recruiter response telemetry, and verified tech teams on Role Nest.`,
        heading: `${titleWords}`,
        subheading: `Verified opportunities curated by Role Nest Truth Teller. Transparent hiring telemetry with zero ghosting.`,
        filterFn: (job) => {
          const haystack = `${job.title} ${job.skills.join(" ")} ${job.location} ${job.workMode} ${job.description}`.toLowerCase();
          return tokens.some((token) => haystack.includes(token));
        },
        relatedSlugs: [
          "remote-frontend-developer",
          "fresher-internships-bangalore",
          "python-ai-engineer",
          "backend-developer-jobs",
        ],
        faqs: [
          {
            question: `How are ${titleWords} verified on Role Nest?`,
            answer: `Every role is validated for compensation transparency, active recruiter participation, and zero ghosting via our Truth Teller tracking engine.`,
          },
        ],
      };
    }
  }

  return null;
}
