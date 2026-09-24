"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Building2,
  Briefcase,
  GraduationCap,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface CertificateProgram {
  id: string;
  title: string;
  provider: string;
  logoInitial: string;
  category: "VIRTUAL_INTERNSHIP" | "GOOGLE_CLOUD" | "DEV_CS" | "CYBERSECURITY";
  isFree: boolean;
  costLabel: string;
  durationHours: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Advanced" | "All Levels";
  skills: string[];
  description: string;
  certificateType: "Official Completion Certificate" | "Industry Professional Credential" | "Verified Skill Badge";
  enrollUrl: string;
  isPopular?: boolean;
}

const CERTIFICATE_PROGRAMS: CertificateProgram[] = [
  // VIRTUAL INTERNSHIPS
  {
    id: "jpmorgan-swe",
    title: "Software Engineering Virtual Experience",
    provider: "JPMorgan Chase & Co. (via Forage)",
    logoInitial: "J",
    category: "VIRTUAL_INTERNSHIP",
    isFree: true,
    costLabel: "100% Free",
    durationHours: "5 Hours",
    difficulty: "Beginner",
    skills: ["Python", "TypeScript", "React", "Financial Data Streaming", "Git"],
    description:
      "Interface with JPMorgan Chase systems, fix broken code, and visualize live equity stock data feeds using perspective charting libraries.",
    certificateType: "Official Completion Certificate",
    enrollUrl: "https://www.theforage.com/simulations/jpmorgan/software-engineering-lite-jpmorgan",
    isPopular: true,
  },
  {
    id: "goldman-sachs-swe",
    title: "Software Engineering Virtual Program",
    provider: "Goldman Sachs (via Forage)",
    logoInitial: "G",
    category: "VIRTUAL_INTERNSHIP",
    isFree: true,
    costLabel: "100% Free",
    durationHours: "4 Hours",
    difficulty: "Intermediate",
    skills: ["Cryptography", "Password Cracking", "Java", "Security Architecture"],
    description:
      "Crack leaked password hashes, evaluate cryptographic algorithms, and propose security architecture fixes for global banking infrastructure.",
    certificateType: "Official Completion Certificate",
    enrollUrl: "https://www.theforage.com/simulations/goldman-sachs/software-engineering-goldman-sachs",
    isPopular: true,
  },
  {
    id: "lyft-backend",
    title: "Back-End Engineering Simulation",
    provider: "Lyft (via Forage)",
    logoInitial: "L",
    category: "VIRTUAL_INTERNSHIP",
    isFree: true,
    costLabel: "100% Free",
    durationHours: "6 Hours",
    difficulty: "Intermediate",
    skills: ["Python", "Clean Architecture", "Unit Testing", "Refactoring", "Git"],
    description:
      "Refactor messy rental fleet service code into modular, production-ready class hierarchies with rigorous test-driven unit suites.",
    certificateType: "Official Completion Certificate",
    enrollUrl: "https://www.theforage.com/simulations/lyft/back-end-engineering-lyft",
  },
  {
    id: "bcg-genai",
    title: "Technology Strategy & GenAI Simulation",
    provider: "Boston Consulting Group (BCG)",
    logoInitial: "B",
    category: "VIRTUAL_INTERNSHIP",
    isFree: true,
    costLabel: "100% Free",
    durationHours: "4 Hours",
    difficulty: "Beginner",
    skills: ["Generative AI", "LLMs", "Cloud Architecture", "Digital Transformation"],
    description:
      "Advise enterprise executives on adopting generative AI models, assessing computational costs, API latency, and data privacy safeguards.",
    certificateType: "Official Completion Certificate",
    enrollUrl: "https://www.theforage.com/simulations/bcg/strategy-consulting-bcg",
  },

  // GOOGLE & CLOUD
  {
    id: "google-cloud-foundations",
    title: "Google Cloud Computing Foundations",
    provider: "Google Cloud Skills Boost",
    logoInitial: "G",
    category: "GOOGLE_CLOUD",
    isFree: true,
    costLabel: "Free Learning Path",
    durationHours: "16 Hours",
    difficulty: "Beginner",
    skills: ["Google Cloud", "Compute Engine", "BigQuery", "Cloud Storage", "IAM"],
    description:
      "Hands-on interactive lab exercises on Google Cloud architecture, virtual machine deployment, SQL big data analysis, and Kubernetes basics.",
    certificateType: "Verified Skill Badge",
    enrollUrl: "https://www.cloudskillsboost.google/course_templates/153",
    isPopular: true,
  },
  {
    id: "aws-educate-badges",
    title: "AWS Educate Cloud Practitioner Badges",
    provider: "Amazon Web Services",
    logoInitial: "A",
    category: "GOOGLE_CLOUD",
    isFree: true,
    costLabel: "100% Free (No CC)",
    durationHours: "12 Hours",
    difficulty: "Beginner",
    skills: ["AWS", "EC2", "S3", "Cloud Security", "Serverless Lambda"],
    description:
      "Official free learning pathways designed specifically for students to gain verified AWS Digital Badges to showcase on LinkedIn and resumes.",
    certificateType: "Verified Skill Badge",
    enrollUrl: "https://aws.amazon.com/education/awseducate/",
  },
  {
    id: "msft-azure-fundamentals",
    title: "Microsoft Azure Fundamentals (AZ-900)",
    provider: "Microsoft Learn",
    logoInitial: "M",
    category: "GOOGLE_CLOUD",
    isFree: true,
    costLabel: "Free Self-Paced Path",
    durationHours: "10 Hours",
    difficulty: "Beginner",
    skills: ["Azure", "Cloud Architecture", "Virtual Networks", "Cost Management"],
    description:
      "Comprehensive Microsoft-curated curriculum covering cloud computing principles, high availability, disaster recovery, and Azure resources.",
    certificateType: "Official Completion Certificate",
    enrollUrl: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/",
  },

  // CS & SOFTWARE FOUNDATIONS
  {
    id: "harvard-cs50",
    title: "CS50: Introduction to Computer Science",
    provider: "Harvard University / edX",
    logoInitial: "H",
    category: "DEV_CS",
    isFree: true,
    costLabel: "Free Course & Certificate",
    durationHours: "40 Hours",
    difficulty: "Intermediate",
    skills: ["C", "Python", "SQL", "Algorithms", "Memory Allocation", "Data Structures"],
    description:
      "The world's most renowned introductory computer science program taught by Prof. David J. Malan. Covers low-level memory up to full-stack web.",
    certificateType: "Official Completion Certificate",
    enrollUrl: "https://cs50.harvard.edu/x/",
    isPopular: true,
  },
  {
    id: "fcc-fullstack",
    title: "freeCodeCamp Responsive Web & JavaScript",
    provider: "freeCodeCamp.org",
    logoInitial: "F",
    category: "DEV_CS",
    isFree: true,
    costLabel: "100% Free Forever",
    durationHours: "300 Hours (Self-paced)",
    difficulty: "Beginner to Advanced",
    skills: ["HTML5", "CSS3", "JavaScript ES6+", "Algorithms", "React", "APIs"],
    description:
      "Project-centric verified certifications built through 5 mandatory capstone applications per tier. Fully verifiable URL verification.",
    certificateType: "Verified Skill Badge",
    enrollUrl: "https://www.freecodecamp.org/learn",
    isPopular: true,
  },
  {
    id: "meta-frontend",
    title: "Meta Front-End Developer Professional",
    provider: "Meta (Coursera Audit Free)",
    logoInitial: "M",
    category: "DEV_CS",
    isFree: true,
    costLabel: "Free Audit / Financial Aid",
    durationHours: "25 Hours",
    difficulty: "Beginner",
    skills: ["React", "JavaScript", "HTML/CSS", "UI/UX", "Jest Testing"],
    description:
      "Built by engineering managers at Meta. Teaches modern component architecture, React hooks, state management, and real interview preparation.",
    certificateType: "Industry Professional Credential",
    enrollUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
  },
];

export default function CertificatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = CERTIFICATE_PROGRAMS.filter((prog) => {
    if (selectedCategory !== "ALL" && prog.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        prog.title.toLowerCase().includes(q) ||
        prog.provider.toLowerCase().includes(q) ||
        prog.skills.some((s) => s.toLowerCase().includes(q))
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
            <Award className="h-4 w-4" />
            Verified Student Credentials & Experience
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Free Virtual Internships & Certifications
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400">
            Boost your resume and JobMint Dev Score with official virtual work experience from JPMorgan, Goldman Sachs, Google Cloud, Harvard, and Meta.
          </p>
        </div>

        {/* VALUE PILLARS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              100% Free for Students
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No hidden fees or paywalls. Every program listed offers free enrollment and verified credentials upon completion.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-teal-400 text-sm">
              <Briefcase className="h-4 w-4" />
              Real Corporate Simulations
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Solve actual engineering tickets from Fortune 500 tech teams (JPMorgan, Lyft, BCG) and add real proof-of-work to your profile.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-cyan-400 text-sm">
              <Sparkles className="h-4 w-4" />
              Boosts JobMint Dev Score
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Completed projects and credentials automatically sync with your verified profile, boosting your ranking on recruiter dashboards.
            </p>
          </div>
        </div>

        {/* TABS & SEARCH */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "ALL" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Programs ({CERTIFICATE_PROGRAMS.length})
            </button>

            <button
              onClick={() => setSelectedCategory("VIRTUAL_INTERNSHIP")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "VIRTUAL_INTERNSHIP" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Virtual Internships (Forage)
            </button>

            <button
              onClick={() => setSelectedCategory("GOOGLE_CLOUD")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "GOOGLE_CLOUD" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Google & Cloud Badges
            </button>

            <button
              onClick={() => setSelectedCategory("DEV_CS")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === "DEV_CS" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              CS & Full-Stack
            </button>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search program or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-900 border-slate-800 text-xs text-white placeholder:text-slate-500 h-9 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="border-slate-800 bg-slate-900/90 text-white flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-xl"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-lg">
                      {item.logoInitial}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base font-bold text-white">
                          {item.title}
                        </CardTitle>
                        {item.isPopular && (
                          <span className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 fill-current" /> Popular
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-xs text-slate-400 mt-0.5">
                        {item.provider}
                      </CardDescription>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-xs font-mono font-bold shrink-0">
                    {item.costLabel}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* SKILLS */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                    Skills Covered
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.skills.map((sk) => (
                      <span
                        key={sk}
                        className="rounded bg-slate-800 border border-slate-700/60 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* METRICS & CREDENTIAL */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950/60 border border-slate-800 p-2.5 text-xs text-slate-400">
                  <div>
                    <span className="text-[10px] block text-slate-500">Duration</span>
                    <span className="font-semibold text-slate-200">{item.durationHours}</span>
                  </div>
                  <div>
                    <span className="text-[10px] block text-slate-500">Credential</span>
                    <span className="font-semibold text-emerald-400 truncate block">
                      {item.certificateType}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Verified Official Issuer
                  </span>

                  <a
                    href={item.enrollUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md"
                    >
                      <span>Enroll & Earn Free</span>
                      <ExternalLink className="h-3.5 w-3.5" />
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