import { ApplicationStatus } from "@repo/shared";

export interface ApplicationEvent {
  id: string;
  eventType: (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
  timestamp: string;
  displayDate: string;
  actor: string; // e.g. "Candidate", "Recruiter", "System"
  note?: string;
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companySlug: string;
  companyLogoInitial: string;
  location: string;
  workMode: string;
  salaryOrStipend: string;
  resumeUrl: string;
  status: (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
  appliedDate: string;
  appliedDateFormatted?: string;
  appliedDaysAgo: number;
  jobSlug?: string;
  isVerifiedCompany?: boolean;
  lastViewedDate?: string;
  isGhosted: boolean; // True if applied > 7 days ago and status === APPLIED (Not viewed)
  events: ApplicationEvent[];
}

export interface EmployerApplicant {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: string;
  jobTitle: string;
  headline: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  resumeUrl: string;
  status: (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
  appliedDate: string;
  coverNote?: string;
}

export const INITIAL_CANDIDATE_APPLICATIONS: CandidateApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Frontend Developer Intern",
    companyName: "ABC Technologies",
    companySlug: "abc-technologies",
    companyLogoInitial: "A",
    location: "Remote",
    workMode: "Remote",
    salaryOrStipend: "₹25,000 – ₹35,000/month",
    resumeUrl: "/mock-resume.pdf",
    status: ApplicationStatus.SHORTLISTED,
    appliedDate: "Sep 14, 2026",
    appliedDaysAgo: 5,
    lastViewedDate: "Sep 15, 2026",
    isGhosted: false,
    events: [
      {
        id: "ev-1",
        eventType: ApplicationStatus.APPLIED,
        timestamp: "2026-09-14T10:14:00Z",
        displayDate: "Sep 14, 10:14 AM",
        actor: "Candidate",
        note: "Application submitted via Role Nest",
      },
      {
        id: "ev-2",
        eventType: ApplicationStatus.RESUME_VIEWED,
        timestamp: "2026-09-15T14:32:00Z",
        displayDate: "Sep 15, 02:32 PM",
        actor: "Recruiter (Priya S.)",
        note: "Resume opened and reviewed for 2m 45s",
      },
      {
        id: "ev-3",
        eventType: ApplicationStatus.SHORTLISTED,
        timestamp: "2026-09-17T11:00:00Z",
        displayDate: "Sep 17, 11:00 AM",
        actor: "Engineering Lead",
        note: "Advanced to Technical Interview round",
      },
    ],
  },
  {
    id: "app-2",
    jobId: "job-2",
    jobTitle: "AI & Deep Learning Intern",
    companyName: "NeuralFlow Labs",
    companySlug: "neuralflow-labs",
    companyLogoInitial: "N",
    location: "Remote",
    workMode: "Remote",
    salaryOrStipend: "₹30,000 – ₹45,000/month",
    resumeUrl: "/mock-resume.pdf",
    status: ApplicationStatus.RESUME_VIEWED,
    appliedDate: "Sep 16, 2026",
    appliedDaysAgo: 3,
    lastViewedDate: "Sep 17, 2026",
    isGhosted: false,
    events: [
      {
        id: "ev-4",
        eventType: ApplicationStatus.APPLIED,
        timestamp: "2026-09-16T09:00:00Z",
        displayDate: "Sep 16, 09:00 AM",
        actor: "Candidate",
      },
      {
        id: "ev-5",
        eventType: ApplicationStatus.RESUME_VIEWED,
        timestamp: "2026-09-17T16:20:00Z",
        displayDate: "Sep 17, 04:20 PM",
        actor: "Recruiter",
      },
    ],
  },
  {
    id: "app-3",
    jobId: "job-5",
    jobTitle: "Mobile App Developer Intern",
    companyName: "PocketByte Apps",
    companySlug: "pocketbyte-apps",
    companyLogoInitial: "P",
    location: "Remote",
    workMode: "Remote",
    salaryOrStipend: "₹22,000 – ₹32,000/month",
    resumeUrl: "/mock-resume.pdf",
    status: ApplicationStatus.APPLIED,
    appliedDate: "Sep 10, 2026",
    appliedDaysAgo: 9,
    isGhosted: true, // 9 days without being viewed!
    events: [
      {
        id: "ev-6",
        eventType: ApplicationStatus.APPLIED,
        timestamp: "2026-09-10T12:00:00Z",
        displayDate: "Sep 10, 12:00 PM",
        actor: "Candidate",
        note: "Application submitted",
      },
    ],
  },
];

export const INITIAL_EMPLOYER_APPLICANTS: EmployerApplicant[] = [
  {
    id: "applicant-1",
    candidateName: "Aman Sharma",
    candidateEmail: "aman.sharma@college.edu",
    candidatePhone: "+91 98765 43210",
    jobId: "job-1",
    jobTitle: "Frontend Developer Intern",
    headline: "Pre-final Year CSE @ NIT • React 19 & Next.js Enthusiast",
    matchScore: 94,
    matchedSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    missingSkills: [],
    resumeUrl: "/mock-resume.pdf",
    status: ApplicationStatus.SHORTLISTED,
    appliedDate: "Sep 14, 2026",
    coverNote: "I have built 3 open-source web apps using Next.js 15 App Router and would love to contribute to ABC Tech's frontend!",
  },
  {
    id: "applicant-2",
    candidateName: "Riya Patel",
    candidateEmail: "riya.patel@gmail.com",
    candidatePhone: "+91 98234 56789",
    jobId: "job-1",
    jobTitle: "Frontend Developer Intern",
    headline: "Frontend Developer • UI/UX focused",
    matchScore: 88,
    matchedSkills: ["React", "TypeScript", "Tailwind CSS"],
    missingSkills: ["Next.js"],
    resumeUrl: "/mock-resume.pdf",
    status: ApplicationStatus.RESUME_VIEWED,
    appliedDate: "Sep 15, 2026",
    coverNote: "Passionate about building fluid, accessible user experiences. High attention to responsive micro-interactions.",
  },
  {
    id: "applicant-3",
    candidateName: "Karan Verma",
    candidateEmail: "karan.v@iitb.ac.in",
    candidatePhone: "+91 91234 56780",
    jobId: "job-2",
    jobTitle: "AI & Deep Learning Intern",
    headline: "Dual Degree Student @ IIT • PyTorch & Transformers researcher",
    matchScore: 92,
    matchedSkills: ["Python", "PyTorch", "Hugging Face", "Vector Databases"],
    missingSkills: ["LangChain"],
    resumeUrl: "/mock-resume.pdf",
    status: ApplicationStatus.APPLIED,
    appliedDate: "Sep 17, 2026",
    coverNote: "Completed Karpathy's Zero-to-Hero series and trained an LLM tokenizer from scratch on GitHub.",
  },
];
