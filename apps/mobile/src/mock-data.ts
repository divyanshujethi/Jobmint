import { JobType, WorkMode, ApplicationStatus } from "@repo/shared";
import { calculateJobMatch, CandidateMatchProfile } from "@repo/matching";
import { MobileJob, MobileApplication } from "./types";

export const SAMPLE_CANDIDATE: CandidateMatchProfile = {
  id: "cand-1",
  skills: ["React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Git"],
  experienceYears: 0,
  isFresher: true,
  projects: [
    { title: "Student Club Event Portal", skillsUsed: ["React", "TypeScript", "Tailwind CSS"] },
    { title: "Personal Dev Portfolio", skillsUsed: ["Next.js", "React", "CSS3"] }
  ],
  location: "Remote",
  preferredWorkModes: [WorkMode.REMOTE, WorkMode.HYBRID],
  preferredRoles: ["Frontend Developer", "Full Stack Developer"],
  expectedSalaryMin: 15000,
  educationField: "Computer Science"
};

const RAW_JOBS = [
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
    salaryOrStipend: "₹25,000 / month",
    experienceYears: 0,
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    description: "Join our core UI engineering team to build accessible, lightning-fast web applications.",
    responsibilities: [
      "Build modular React & TypeScript UI components",
      "Optimize bundle size and Largest Contentful Paint (LCP)",
      "Collaborate with design teams in Figma"
    ],
    requirements: [
      "Proficiency with modern React (hooks, memoization)",
      "Experience with TypeScript interfaces and strict types",
      "Git and collaborative workflow knowledge"
    ],
    postedAgo: "2 days ago",
    truthTeller: {
      totalApplications: 45,
      reviewedApplications: 40,
      reviewRate: 88,
      medianFirstReviewDays: 2.1,
      lastRecruiterActivity: "Active 2 hours ago"
    }
  },
  {
    id: "job-2",
    slug: "ai-engineer-intern-deepmind-lab",
    title: "AI & ML Research Intern",
    companyName: "Cognitive Labs",
    companySlug: "cognitive-labs",
    companyLogoInitial: "C",
    isVerified: true,
    location: "Bengaluru, India",
    workMode: WorkMode.HYBRID,
    jobType: JobType.INTERNSHIP,
    salaryOrStipend: "₹35,000 / month",
    experienceYears: 0,
    skills: ["Python", "PyTorch", "Hugging Face", "FastAPI"],
    description: "Work on multimodal inference, LLM evaluation pipelines, and fine-tuning open-source models.",
    responsibilities: [
      "Implement prompt eval harnesses for Llama and Mistral",
      "Serve high-throughput low-latency inference endpoints",
      "Analyze model drift and hallucination guardrails"
    ],
    requirements: [
      "Strong Python fundamentals & PyTorch tensors",
      "Understanding of Transformer architectures",
      "Familiarity with Hugging Face transformers"
    ],
    postedAgo: "1 day ago",
    truthTeller: {
      totalApplications: 62,
      reviewedApplications: 58,
      reviewRate: 93,
      medianFirstReviewDays: 1.4,
      lastRecruiterActivity: "Active 45 mins ago"
    }
  },
  {
    id: "job-3",
    slug: "junior-backend-engineer-fintech",
    title: "Junior Backend Engineer",
    companyName: "NovaPay Financial",
    companySlug: "novapay",
    companyLogoInitial: "N",
    isVerified: true,
    location: "Remote",
    workMode: WorkMode.REMOTE,
    jobType: JobType.FULL_TIME,
    salaryOrStipend: "₹6 - 9 LPA",
    experienceYears: 0,
    skills: ["Node.js", "PostgreSQL", "Docker", "TypeScript"],
    description: "Design robust REST/gRPC payment APIs with strict PostgreSQL ACID transaction integrity.",
    responsibilities: [
      "Build resilient transaction processing webhooks",
      "Write SQL migrations with Drizzle ORM",
      "Implement idempotent retry mechanisms"
    ],
    requirements: [
      "Node.js event loop understanding",
      "Relational schema design (foreign keys, indexing)",
      "RESTful API design best practices"
    ],
    postedAgo: "3 days ago",
    truthTeller: {
      totalApplications: 78,
      reviewedApplications: 61,
      reviewRate: 78,
      medianFirstReviewDays: 3.5,
      lastRecruiterActivity: "Active 5 hours ago"
    }
  },
  {
    id: "job-4",
    slug: "mobile-app-developer-intern",
    title: "Mobile App Developer (React Native)",
    companyName: "Pulse Healthcare",
    companySlug: "pulse-healthcare",
    companyLogoInitial: "P",
    isVerified: false,
    location: "Remote",
    workMode: WorkMode.REMOTE,
    jobType: JobType.INTERNSHIP,
    salaryOrStipend: "₹20,000 / month",
    experienceYears: 0,
    skills: ["React Native", "TypeScript", "Expo", "Redux"],
    description: "Help build the patient monitoring mobile app across iOS and Android with offline sync.",
    responsibilities: [
      "Develop responsive mobile screens with Expo and React Native",
      "Implement local SQLite caching for offline mode",
      "Connect Bluetooth health sensor telemetry"
    ],
    requirements: [
      "React Native and TypeScript familiarity",
      "Understanding of mobile navigation and state",
      "Enthusiasm for cross-platform app engineering"
    ],
    postedAgo: "4 days ago",
    truthTeller: {
      totalApplications: 34,
      reviewedApplications: 22,
      reviewRate: 64,
      medianFirstReviewDays: 4.2,
      lastRecruiterActivity: "Active 1 day ago"
    }
  }
];

export const MOCK_MOBILE_JOBS: MobileJob[] = RAW_JOBS.map((job) => {
  const match = calculateJobMatch(SAMPLE_CANDIDATE, {
    id: job.id,
    title: job.title,
    requiredSkills: job.skills,
    experienceYears: job.experienceYears,
    workMode: job.workMode,
    location: job.location,
    jobType: job.jobType
  });

  return {
    ...job,
    matchScore: match.breakdown
  };
});

export const MOCK_MOBILE_APPLICATIONS: MobileApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Frontend Developer Intern",
    companyName: "ABC Technologies",
    appliedDate: "Sep 17, 2026",
    status: ApplicationStatus.RESUME_VIEWED,
    daysSinceLastActivity: 2,
    isGhostingWarning: false,
    timeline: [
      { step: "Application Submitted", date: "Sep 17", completed: true, current: false },
      { step: "Resume Viewed by Lead", date: "Sep 18", completed: true, current: true },
      { step: "Shortlist / Interview", date: "Pending", completed: false, current: false },
      { step: "Offer Decision", date: "Pending", completed: false, current: false }
    ]
  },
  {
    id: "app-2",
    jobId: "job-3",
    jobTitle: "Junior Backend Engineer",
    companyName: "NovaPay Financial",
    appliedDate: "Sep 10, 2026",
    status: ApplicationStatus.APPLIED,
    daysSinceLastActivity: 9,
    isGhostingWarning: true,
    timeline: [
      { step: "Application Submitted", date: "Sep 10", completed: true, current: false },
      { step: "Resume Review", date: "7+ Days Inactive", completed: false, current: true },
      { step: "Ghosting Protection Activated", date: "Sep 17", completed: true, current: false }
    ]
  }
];