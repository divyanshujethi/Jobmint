import { JobType, WorkMode, JobSource } from "@repo/shared";

export interface MockJob {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companySlug: string;
  companyLogoInitial: string;
  isVerified: boolean;
  location: string;
  workMode: (typeof WorkMode)[keyof typeof WorkMode];
  jobType: (typeof JobType)[keyof typeof JobType];
  salaryOrStipend: string;
  minSalary?: number;
  maxSalary?: number;
  experienceYears: number; // 0 for fresher
  skills: string[]; // canonical skill names
  skillSlugs: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  source: (typeof JobSource)[keyof typeof JobSource];
  postedAgo: string;
  postedAt: string;
  truthTeller: {
    totalApplications: number;
    reviewedApplications: number;
    reviewRate: number; // e.g. 88%
    medianFirstReviewDays: number; // e.g. 2.1 days
    lastRecruiterActivity: string; // e.g. "Active 2 hours ago"
  };
}

export const MOCK_JOBS: MockJob[] = [
  {
    id: "job-1",
    slug: "frontend-developer-intern-abc-tech",
    title: "Frontend Developer Intern",
    companyName: "ABC Technologies",
    companySlug: "abc-technologies",
    companyLogoInitial: "A",
    isVerified: true,
    location: "Remote",
    workMode: WorkMode.REMOTE,
    jobType: JobType.INTERNSHIP,
    salaryOrStipend: "₹25,000 – ₹35,000/month",
    minSalary: 25000,
    maxSalary: 35000,
    experienceYears: 0,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    skillSlugs: ["react", "nextjs", "typescript", "tailwind"],
    description:
      "We are looking for an ambitious Frontend Intern passionate about clean UI, React 19, and accessible web performance. You will build user-facing interfaces used by thousands of active developers.",
    responsibilities: [
      "Develop responsive client and server components using Next.js App Router and Tailwind CSS",
      "Collaborate with backend engineers to integrate typed REST and GraphQL APIs",
      "Write unit tests with Vitest and participate in code reviews",
      "Optimize web vital metrics (LCP, CLS, INP) for mobile viewports",
    ],
    requirements: [
      "Strong grasp of JavaScript ES6+, React Hooks, and TypeScript interfaces",
      "Demonstrated personal or open-source projects built with React or Next.js",
      "Understanding of Git workflow and responsive CSS layouts",
      "Hunger to learn fast and communicate transparently",
    ],
    benefits: [
      "100% Remote flexibility",
      "Mentorship from ex-BigTech engineering leads",
      "Pre-Placement Offer (PPO) opportunity upon internship completion",
      "Stipend credited on the 1st of every month without delay",
    ],
    source: JobSource.DIRECT,
    postedAgo: "3 hours ago",
    postedAt: "2026-09-18T10:00:00Z",
    truthTeller: {
      totalApplications: 412,
      reviewedApplications: 368,
      reviewRate: 89,
      medianFirstReviewDays: 1.8,
      lastRecruiterActivity: "Active 45 mins ago",
    },
  },
  {
    id: "job-2",
    slug: "ai-research-engineer-intern-neuralflow",
    title: "AI & Deep Learning Intern",
    companyName: "NeuralFlow Labs",
    companySlug: "neuralflow-labs",
    companyLogoInitial: "N",
    isVerified: true,
    location: "Bangalore / Remote",
    workMode: WorkMode.REMOTE,
    jobType: JobType.INTERNSHIP,
    salaryOrStipend: "₹30,000 – ₹45,000/month",
    minSalary: 30000,
    maxSalary: 45000,
    experienceYears: 0,
    skills: ["Python", "PyTorch", "Hugging Face", "Vector Databases", "LangChain"],
    skillSlugs: ["python", "pytorch", "huggingface", "vectordb", "langchain"],
    description:
      "Join our Generative AI research team to build cutting-edge RAG pipelines, fine-tune open-weights models (Llama 3, Mistral), and optimize inference latency on modern GPUs.",
    responsibilities: [
      "Implement document chunking, hybrid retrieval, and embedding pipelines using Chroma/Qdrant",
      "Evaluate prompt engineering techniques and agentic workflows with LangChain/LlamaIndex",
      "Benchmark model accuracy and hallucination rates across customer datasets",
      "Help write technical documentation and reproducible benchmark scripts",
    ],
    requirements: [
      "Proficiency in Python and basic neural network concepts (loss functions, backpropagation)",
      "Hands-on experience with PyTorch or Hugging Face transformers",
      "Completed courses such as Karpathy's Zero-to-Hero or Fast.ai is a major plus",
      "Enthusiasm for reading AI research papers and experimenting with new architectures",
    ],
    benefits: [
      "Access to high-end GPU compute clusters (H100 / A100s)",
      "Co-authorship on technical research publications & blog posts",
      "Flexible working hours and certificate of completion",
    ],
    source: JobSource.DIRECT,
    postedAgo: "6 hours ago",
    postedAt: "2026-09-18T07:00:00Z",
    truthTeller: {
      totalApplications: 624,
      reviewedApplications: 520,
      reviewRate: 83,
      medianFirstReviewDays: 2.4,
      lastRecruiterActivity: "Active 2 hours ago",
    },
  },
  {
    id: "job-3",
    slug: "full-stack-fresher-engineer-devscale",
    title: "Junior Full-Stack Engineer",
    companyName: "DevScale Systems",
    companySlug: "devscale-systems",
    companyLogoInitial: "D",
    isVerified: true,
    location: "Bangalore, India",
    workMode: WorkMode.HYBRID,
    jobType: JobType.FULL_TIME,
    salaryOrStipend: "₹8,00,000 – ₹12,00,000/year",
    minSalary: 800000,
    maxSalary: 1200000,
    experienceYears: 0,
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
    skillSlugs: ["typescript", "react", "nodejs", "postgresql", "docker"],
    description:
      "DevScale is hiring fresh college graduates (Batch of 2024-2026) for our core engineering team. You will write backend services and rich web applications powering developer infrastructure.",
    responsibilities: [
      "Architect and maintain REST/gRPC endpoints using Node.js and TypeScript",
      "Design PostgreSQL relational tables, indexes, and queries using Drizzle/Prisma",
      "Ship high-fidelity web dashboards with React and Tailwind CSS",
      "Containerize services with Docker and participate in on-call rotation after onboarding",
    ],
    requirements: [
      "Strong computer science fundamentals: Data Structures, Algorithms, OS, and Databases",
      "Comfortable with TypeScript or modern JavaScript",
      "Prior internship experience or substantial personal software projects",
      "Strong problem-solving mindset and passion for craftsmanship",
    ],
    benefits: [
      "Competitive entry-level salary + health insurance for family",
      "MacBook Pro M3 provided on Day 1",
      "Learning allowance for technical books and cloud certifications",
      "Annual team offsites",
    ],
    source: JobSource.DIRECT,
    postedAgo: "1 day ago",
    postedAt: "2026-09-17T12:00:00Z",
    truthTeller: {
      totalApplications: 930,
      reviewedApplications: 780,
      reviewRate: 84,
      medianFirstReviewDays: 2.0,
      lastRecruiterActivity: "Active today",
    },
  },
  {
    id: "job-4",
    slug: "data-analyst-intern-finpulse",
    title: "Data Analyst Intern",
    companyName: "FinPulse Global",
    companySlug: "finpulse-global",
    companyLogoInitial: "F",
    isVerified: true,
    location: "Mumbai, India",
    workMode: WorkMode.HYBRID,
    jobType: JobType.INTERNSHIP,
    salaryOrStipend: "₹20,000 – ₹30,000/month",
    minSalary: 20000,
    maxSalary: 30000,
    experienceYears: 0,
    skills: ["SQL", "Python", "Pandas & NumPy", "Tableau"],
    skillSlugs: ["sql", "python", "pandas-numpy"],
    description:
      "FinPulse is seeking a detail-oriented Data Analyst intern to analyze transactional trends, build automated reporting dashboards, and extract insights for product managers.",
    responsibilities: [
      "Write complex SQL queries (Window functions, CTEs) to pull metrics from data warehouses",
      "Clean and preprocess financial datasets using Python and Pandas",
      "Build visual Tableau / Metabase dashboards monitoring customer onboarding metrics",
      "Present weekly quantitative findings to product and business teams",
    ],
    requirements: [
      "Proficient in writing SQL queries and data manipulation in Python/Pandas",
      "Familiarity with data visualization tools (Tableau, PowerBI, or Matplotlib)",
      "Strong logical thinking and attention to data integrity",
    ],
    benefits: [
      "Hands-on experience with real-world financial data pipelines",
      "Letter of recommendation and PPO opportunity",
      "Hybrid setup (2 days office, 3 days remote)",
    ],
    source: JobSource.DIRECT,
    postedAgo: "1 day ago",
    postedAt: "2026-09-17T09:00:00Z",
    truthTeller: {
      totalApplications: 280,
      reviewedApplications: 240,
      reviewRate: 86,
      medianFirstReviewDays: 1.5,
      lastRecruiterActivity: "Active yesterday",
    },
  },
  {
    id: "job-5",
    slug: "react-native-intern-pocketbyte",
    title: "Mobile App Developer Intern (React Native)",
    companyName: "PocketByte Apps",
    companySlug: "pocketbyte-apps",
    companyLogoInitial: "P",
    isVerified: false,
    location: "Remote",
    workMode: WorkMode.REMOTE,
    jobType: JobType.INTERNSHIP,
    salaryOrStipend: "₹22,000 – ₹32,000/month",
    minSalary: 22000,
    maxSalary: 32000,
    experienceYears: 0,
    skills: ["React Native", "TypeScript", "React"],
    skillSlugs: ["react-native", "typescript", "react"],
    description:
      "Help build modern cross-platform mobile apps for Android and iOS using Expo and React Native. Ideal for students who have published even a single hobby app or demo.",
    responsibilities: [
      "Implement smooth 60fps mobile UI screens with React Native and Expo",
      "Integrate native device sensors, push notifications, and offline SQLite storage",
      "Debug mobile layout quirks across various Android screen densities",
    ],
    requirements: [
      "Familiarity with React, React Hooks, and TypeScript",
      "Basic understanding of Expo / React Native architecture",
      "Curiosity about mobile UX, gesture animations, and performance",
    ],
    benefits: [
      "100% Remote work from anywhere",
      "Flexible schedule for college exam periods",
      "Direct guidance from experienced mobile architects",
    ],
    source: JobSource.DIRECT,
    postedAgo: "2 days ago",
    postedAt: "2026-09-16T14:00:00Z",
    truthTeller: {
      totalApplications: 195,
      reviewedApplications: 130,
      reviewRate: 67,
      medianFirstReviewDays: 3.1,
      lastRecruiterActivity: "Active 2 days ago",
    },
  },
];
