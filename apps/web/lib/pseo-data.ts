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
      "Find top Full Stack Developer roles with React, Next.js, Node.js, and cloud deployments. Verified active ATS direct links and smart application tracking.",
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
          "Top product startups including Swiggy, Razorpay, Flipkart, Postman, and Stripe actively list verified engineering roles on RoleNest.",
      },
    ],
  },
  "react-developer-bangalore": {
    slug: "react-developer-bangalore",
    title: "React Developer Bangalore",
    metaTitle: "React Developer Jobs in Bangalore (2026) | RoleNest",
    metaDescription:
      "Find verified React Developer jobs in Bangalore for 2026. Explore frontend and fullstack roles with competitive CTC bands, transparent tech stacks, and direct ATS links.",
    heading: "React Developer Jobs in Bengaluru",
    subheading:
      "Verified frontend and full-stack React opportunities across Koramangala, Indiranagar, and Whitefield with direct ATS links and 7-day follow-up tracking.",
    filterFn: (job) => {
      const loc = job.location.toLowerCase();
      const isBangalore = loc.includes("bangalore") || loc.includes("bengaluru") || job.workMode === "REMOTE";
      const text = `${job.title} ${job.skills.join(" ")} ${job.description}`.toLowerCase();
      const isReact = text.includes("react") || text.includes("frontend") || text.includes("next");
      return isBangalore && isReact;
    },
    relatedSlugs: [
      "golang-hyderabad",
      "python-freshers-pune",
      "remote-frontend-developer",
      "fresher-internships-bangalore",
    ],
    faqs: [
      {
        question: "What is the average salary for a React Developer in Bangalore?",
        answer:
          "React Developers in Bangalore earn between ₹8,00,000 to ₹28,00,000 annually, depending on experience with TypeScript, Next.js, and modern state management systems.",
      },
      {
        question: "Which Bangalore tech companies are actively hiring React developers?",
        answer:
          "Product leaders like Razorpay, Swiggy, Zerodha, Postman, and Flipkart frequently hire React engineers via direct ATS links indexed on RoleNest.",
      },
      {
        question: "Are remote React developer jobs available from Bangalore?",
        answer:
          "Yes, over 40% of React developer roles offer hybrid or fully remote arrangements with competitive compensation.",
      },
    ],
  },
  "python-freshers-pune": {
    slug: "python-freshers-pune",
    title: "Python Freshers Pune",
    metaTitle: "Python Fresher Internships & Jobs in Pune (2026) | RoleNest",
    metaDescription:
      "Apply for verified Python fresher internships and entry-level developer roles in Pune. Verified stipends, mentorship, and direct company applications with no middlemen.",
    heading: "Python Fresher Internships & Jobs in Pune",
    subheading:
      "Top Pune IT hubs (Hinjawadi, Magarpatta, Baner) hiring 2024-2026 freshers for Python, Django, FastAPI, and data engineering internships with verified PPO potential.",
    filterFn: (job) => {
      const loc = job.location.toLowerCase();
      const isPune = loc.includes("pune") || job.workMode === "REMOTE";
      const text = `${job.title} ${job.skills.join(" ")} ${job.description}`.toLowerCase();
      const isPython = text.includes("python") || text.includes("django") || text.includes("fastapi");
      const isFresher =
        job.jobType === "INTERNSHIP" ||
        job.experienceYears <= 1 ||
        text.includes("intern") ||
        text.includes("fresher");
      return isPune && isPython && isFresher;
    },
    relatedSlugs: [
      "react-developer-bangalore",
      "golang-hyderabad",
      "fresher-developer-jobs",
      "python-ai-engineer",
    ],
    faqs: [
      {
        question: "What is the typical stipend for Python interns in Pune?",
        answer:
          "Python interns in Pune typically receive stipends ranging from ₹20,000 to ₹45,000/month, often converting to full-time junior engineer packages of ₹5 - ₹10 LPA upon completion.",
      },
      {
        question: "Can final-year college students apply for Pune Python internships?",
        answer:
          "Yes, pre-final and final-year students (2025-2026 batches) with strong problem-solving fundamentals and basic Python projects can apply directly.",
      },
    ],
  },
  "golang-hyderabad": {
    slug: "golang-hyderabad",
    title: "Golang Jobs Hyderabad",
    metaTitle: "Golang Developer Jobs in Hyderabad (2026) | RoleNest",
    metaDescription:
      "Discover verified Golang backend engineering jobs in Hyderabad (HITEC City / Gachibowli). High-concurrency distributed systems with competitive CTC.",
    heading: "Golang Backend Developer Jobs in Hyderabad",
    subheading:
      "High-performance systems and backend Go roles across Cyberabad tech parks with direct ATS apply links and verified recruiter review times.",
    filterFn: (job) => {
      const loc = job.location.toLowerCase();
      const isHyd = loc.includes("hyderabad") || loc.includes("secunderabad") || job.workMode === "REMOTE";
      const text = `${job.title} ${job.skills.join(" ")} ${job.description}`.toLowerCase();
      const isGo = text.includes("golang") || text.includes("go developer") || text.includes("backend");
      return isHyd && isGo;
    },
    relatedSlugs: [
      "react-developer-bangalore",
      "python-freshers-pune",
      "backend-developer-jobs",
      "full-stack-developer-jobs",
    ],
    faqs: [
      {
        question: "What is the demand for Golang developers in Hyderabad?",
        answer:
          "Hyderabad has seen a massive surge in demand for Go developers for microservices, financial trading platforms, and cloud infrastructure teams in HITEC City and Gachibowli.",
      },
      {
        question: "What CTC can a Golang engineer in Hyderabad expect?",
        answer:
          "Golang developers with 1-4 years of experience in Hyderabad command ₹14,00,000 to ₹32,00,000 annually, depending on concurrency and distributed systems expertise.",
      },
    ],
  },
};

const INDIAN_TECH_CITIES: Record<string, string> = {
  bangalore: "Bengaluru",
  bengaluru: "Bengaluru",
  hyderabad: "Hyderabad",
  pune: "Pune",
  delhi: "Delhi-NCR",
  noida: "Noida",
  gurgaon: "Gurugram",
  gurugram: "Gurugram",
  mumbai: "Mumbai",
  chennai: "Chennai",
  kolkata: "Kolkata",
  ahmedabad: "Ahmedabad",
  jaipur: "Jaipur",
  chandigarh: "Chandigarh",
  mohali: "Mohali",
  panchkula: "Panchkula",
  indore: "Indore",
  bhopal: "Bhopal",
  kochi: "Kochi",
  coimbatore: "Coimbatore",
  nagpur: "Nagpur",
  lucknow: "Lucknow",
  bhubaneswar: "Bhubaneswar",
  goa: "Goa",
  dehradun: "Dehradun",
};

const KNOWN_TECH_SKILLS: Record<string, string> = {
  react: "React",
  python: "Python",
  golang: "Golang",
  go: "Go",
  java: "Java",
  typescript: "TypeScript",
  javascript: "JavaScript",
  node: "Node.js",
  nodejs: "Node.js",
  nextjs: "Next.js",
  vue: "Vue.js",
  angular: "Angular",
  rust: "Rust",
  devops: "DevOps",
  cloud: "Cloud",
  aws: "AWS",
  docker: "Docker",
  kubernetes: "Kubernetes",
  ai: "AI & ML",
  ml: "Machine Learning",
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Full Stack",
  android: "Android",
  flutter: "Flutter",
  ios: "iOS",
};

/**
 * Resolves a slug to either a defined preset or dynamic keyword-based pSEO topic
 */
export function resolvePseoCategory(slug: string): PseoTopic | null {
  const normalized = slug.toLowerCase().trim();
  if (PSEO_TOPICS[normalized]) {
    return PSEO_TOPICS[normalized];
  }

  const tokens = normalized.split("-").filter(Boolean);
  if (tokens.length < 2) return null;

  // Detect city, skill, and intent from tokens
  let detectedCity: string | null = null;
  let cityDisplayName = "";
  for (const [key, val] of Object.entries(INDIAN_TECH_CITIES)) {
    if (tokens.includes(key)) {
      detectedCity = key;
      cityDisplayName = val;
      break;
    }
  }

  let detectedSkill: string | null = null;
  let skillDisplayName = "";
  for (const [key, val] of Object.entries(KNOWN_TECH_SKILLS)) {
    if (tokens.includes(key)) {
      detectedSkill = key;
      skillDisplayName = val;
      break;
    }
  }

  const isInternship =
    tokens.includes("intern") ||
    tokens.includes("internship") ||
    tokens.includes("internships");

  const isFresher =
    tokens.includes("fresher") ||
    tokens.includes("freshers") ||
    tokens.includes("junior");

  const isJobSearch =
    isInternship ||
    isFresher ||
    tokens.includes("jobs") ||
    tokens.includes("job") ||
    tokens.includes("engineer") ||
    tokens.includes("developer") ||
    tokens.includes("remote") ||
    (detectedCity !== null && detectedSkill !== null);

  if (!isJobSearch) {
    return null;
  }

  const titleWords = tokens.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
  const headingText = detectedCity
    ? `${skillDisplayName || "Software"} ${isInternship ? "Internships" : isFresher ? "Fresher Roles" : "Jobs"} in ${cityDisplayName}`
    : `${titleWords}`;

  const metaTitleText = detectedCity
    ? `${skillDisplayName || "Tech"} ${isInternship ? "Internships" : "Jobs"} in ${cityDisplayName} (2026) | RoleNest`
    : `${titleWords} (2026) | RoleNest`;

  const metaDescText = detectedCity
    ? `Discover verified ${skillDisplayName || "software"} ${isInternship ? "internships" : "jobs"} in ${cityDisplayName}. Direct ATS application links, transparent compensation, and verified recruiter review times.`
    : `Discover verified ${titleWords} with transparent salaries, recruiter response telemetry, and verified tech teams on RoleNest.`;

  return {
    slug: normalized,
    title: headingText,
    metaTitle: metaTitleText,
    metaDescription: metaDescText,
    heading: headingText,
    subheading: `Verified tech opportunities in ${cityDisplayName || "India"}. Direct ATS application links with Truth Teller anti-ghosting follow-up tracking.`,
    filterFn: (job) => {
      const haystack = `${job.title} ${job.skills.join(" ")} ${job.location} ${job.workMode} ${job.description}`.toLowerCase();
      
      // City check
      if (detectedCity) {
        const isLocMatch =
          job.location.toLowerCase().includes(detectedCity) ||
          job.workMode === "REMOTE" ||
          job.location.toLowerCase().includes("remote");
        if (!isLocMatch) return false;
      }

      // Skill check
      if (detectedSkill) {
        const isSkillMatch =
          job.skills.some((s) => s.toLowerCase().includes(detectedSkill!)) ||
          haystack.includes(detectedSkill);
        if (!isSkillMatch) return false;
      }

      // Internship / Fresher check
      if (isInternship || isFresher) {
        const isEntry =
          job.jobType === "INTERNSHIP" ||
          job.experienceYears <= 1 ||
          job.title.toLowerCase().includes("intern") ||
          job.title.toLowerCase().includes("fresher");
        if (!isEntry) return false;
      }

      // General fallback if no specific city/skill detected
      if (!detectedCity && !detectedSkill) {
        return tokens.some((token) => haystack.includes(token));
      }

      return true;
    },
    relatedSlugs: [
      "react-developer-bangalore",
      "python-freshers-pune",
      "golang-hyderabad",
      "remote-frontend-developer",
      "fresher-internships-bangalore",
    ],
    faqs: [
      {
        question: `What are the typical requirements for ${titleWords}?`,
        answer: `Employers look for solid data structures and algorithm foundations, proficiency in ${skillDisplayName || "modern frameworks"}, and clean GitHub proof-of-work.`,
      },
      {
        question: `How does RoleNest guarantee recruiter review for ${titleWords}?`,
        answer: `Every opening on RoleNest features direct ATS links without middleman portals. Our Truth Teller telemetry nudges you for follow-ups if an employer takes more than 7 days to review.`,
      },
      {
        question: `Are freshers eligible for roles in ${cityDisplayName || "top tech hubs"}?`,
        answer: `Yes, verified companies on RoleNest welcome early-career talent and final-year students with verified skill proof-of-work and DevScore ratings.`,
      },
    ],
  };
}

/**
 * Returns all top preset city and role slugs for Next.js generateStaticParams
 */
export function getAllPseoSlugs(): string[] {
  return Object.keys(PSEO_TOPICS);
}

