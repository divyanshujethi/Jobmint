"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  Award,
  BookOpen,
  ExternalLink,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sparkles,
  Clock,
  Coins,
  Briefcase,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Check,
  ChevronRight
} from "lucide-react";

interface GovJob {
  id: string;
  orgName: string;
  orgCategory: "Research" | "Ministry" | "PSU";
  title: string;
  payLevel: string;
  approxMonthlySalary: string;
  qualification: string;
  selectionProcess: "GATE Score + Interview" | "Written Exam (CBT) + Interview" | "Direct Interview / Project Assessment";
  officialPortalUrl: string;
  notificationUrl: string;
  applicationDeadline: string;
  tags: string[];
  status: "Active / Ongoing" | "Upcoming Annual Drive" | "Rolling Recruitment";
  description: string;
  vacancies: string;
}

const GOV_TECH_JOBS: GovJob[] = [
  {
    id: "nic-scientist-b",
    orgName: "National Informatics Centre (NIC / NIELIT)",
    orgCategory: "Ministry",
    title: "Scientist 'B' & Scientific/Technical Assistant 'A'",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,12,000 / month (Gross)",
    qualification: "B.E. / B.Tech (CS / IT / ECE) or MCA / M.Sc (CS/IT)",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://recruitment.nic.in",
    notificationUrl: "https://www.calicut.nielit.in/nic23/",
    applicationDeadline: "Annual National Recruitment Cycle",
    tags: ["Central Govt", "Group A Gazetted", "National Informatics", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Architect and scale India's digital public infrastructure including DigiLocker, Aadhaar integrations, PM-Kisan, and state cloud data centers.",
    vacancies: "598+ Posts (Typical Annual Intake)"
  },
  {
    id: "isro-scientist-sc",
    orgName: "Indian Space Research Organisation (ISRO / ICRB)",
    orgCategory: "Research",
    title: "Scientist / Engineer 'SC' (Computer Science & Software)",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,15,000 / month (Gross + Space Allowance)",
    qualification: "B.Tech in CS/IT with min 65% aggregate or 6.84 CGPA",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://www.isro.gov.in/Careers.html",
    notificationUrl: "https://www.isro.gov.in/Careers.html",
    applicationDeadline: "ICRB National Examination Drive",
    tags: ["Space Tech", "ISRO", "Satellite Mission Systems", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Develop real-time flight software, telemetry processing engines, satellite image analysis pipelines, and mission control systems.",
    vacancies: "80+ Tech Positions"
  },
  {
    id: "drdo-scientist-b",
    orgName: "Defence Research & Development Organisation (DRDO / RAC)",
    orgCategory: "Research",
    title: "Scientist 'B' (Computer Science & Cybersecurity)",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,12,000 / month (Gross + Defence Perks)",
    qualification: "First Class B.E./B.Tech in CS/IT + Valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://rac.gov.in",
    notificationUrl: "https://rac.gov.in/index.php?lang=en&id=0",
    applicationDeadline: "Rolling / Annual GATE Shortlist",
    tags: ["Defence", "Cybersecurity", "Cryptanalysis", "AI/ML Systems"],
    status: "Active / Ongoing",
    description: "Build secure operating kernels, military-grade cryptosystems, tactical edge AI models, and electronic warfare software suites at CAIR and SAG.",
    vacancies: "150+ Scientist Posts"
  },
  {
    id: "cdac-project-engineer",
    orgName: "Centre for Development of Advanced Computing (C-DAC)",
    orgCategory: "PSU",
    title: "Project Engineer / Senior Project Engineer (AI & HPC)",
    payLevel: "Consolidated ₹4.5 - ₹14.5 Lakhs per Annum",
    approxMonthlySalary: "₹65,000 - ₹1,20,000 / month",
    qualification: "B.E. / B.Tech / MCA in CS / IT / Electronics",
    selectionProcess: "Direct Interview / Project Assessment",
    officialPortalUrl: "https://www.cdac.in/index.aspx?id=current_jobs",
    notificationUrl: "https://www.cdac.in/index.aspx?id=current_jobs",
    applicationDeadline: "Continuous / Rolling Recruitment",
    tags: ["High Performance Computing", "PARAM Supercomputer", "AI Research", "National Mission"],
    status: "Active / Ongoing",
    description: "Lead development on India's National Supercomputing Mission (NSM), distributed parallel algorithms, and indigenous microprocessor software ecosystems.",
    vacancies: "250+ Multi-Centre Openings"
  },
  {
    id: "npci-tech",
    orgName: "National Payments Corporation of India (NPCI)",
    orgCategory: "PSU",
    title: "Core Software Engineer / Blockchain Specialist",
    payLevel: "Competitive Market CTC (₹8 - ₹24 Lakhs/yr)",
    approxMonthlySalary: "₹85,000 - ₹1,80,000 / month",
    qualification: "B.Tech/M.Tech (CS/IT) with strong Distributed Systems foundation",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://www.npci.org.in/who-we-are/careers",
    notificationUrl: "https://www.npci.org.in/who-we-are/careers",
    applicationDeadline: "Active Lateral & Graduate Hiring",
    tags: ["Fintech", "UPI Platform", "High Throughput", "Real-Time Settlement"],
    status: "Active / Ongoing",
    description: "Design and maintain high-concurrency payment architectures powering billions of UPI, IMPS, NETC FASTag, and RuPay transactions each month.",
    vacancies: "45+ Openings"
  },
  {
    id: "cris-software-engineer",
    orgName: "Centre for Railway Information Systems (CRIS / Indian Railways)",
    orgCategory: "PSU",
    title: "Assistant Software Engineer (ASE) & Data Analyst",
    payLevel: "7th CPC Level 7/8 (₹44,900 - ₹1,42,400 + Railway Perks)",
    approxMonthlySalary: "₹92,000 / month (Gross)",
    qualification: "B.E./B.Tech in CS/IT/MCA with valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://cris.org.in/crisweb/design1/careers.jsp",
    notificationUrl: "https://cris.org.in/crisweb/design1/careers.jsp",
    applicationDeadline: "Annual Post-GATE Drive",
    tags: ["Railways", "IRCTC Engine", "Distributed DB", "GATE Mandatory"],
    status: "Upcoming Annual Drive",
    description: "Build mission-critical ticketing systems (PRS), National Train Enquiry System (NTES), and high-availability freight operations management databases.",
    vacancies: "150+ Posts"
  },
  {
    id: "barc-scientific-officer",
    orgName: "Bhabha Atomic Research Centre (BARC / DAE)",
    orgCategory: "Research",
    title: "Scientific Officer 'C' (Computer Science / Cybernetics)",
    payLevel: "7th CPC Level 10 (₹56,100 - ₹1,77,500)",
    approxMonthlySalary: "₹1,18,000 / month (Gross + Nuclear Allowance)",
    qualification: "B.E./B.Tech in CS with min 60% or valid GATE Score",
    selectionProcess: "GATE Score + Interview",
    officialPortalUrl: "https://barcocesexam.in",
    notificationUrl: "https://barcocesexam.in",
    applicationDeadline: "OCES / DGFS Annual Selection",
    tags: ["Nuclear Research", "Scientific Computing", "Cybernetics", "Permanent"],
    status: "Upcoming Annual Drive",
    description: "Develop SCADA reactor safety telemetry systems, embedded real-time software, and nuclear computational models in Trombay and Kalpakkam.",
    vacancies: "40+ Specialist Posts"
  },
  {
    id: "cert-in-security-analyst",
    orgName: "Indian Computer Emergency Response Team (CERT-In / MeitY)",
    orgCategory: "Ministry",
    title: "Cyber Security Analyst & Threat Intelligence Engineer",
    payLevel: "7th CPC Level 10 / Contract ₹85k-₹1.6L/mo",
    approxMonthlySalary: "₹1,10,000 / month",
    qualification: "B.E./B.Tech (CS/IT/InfoSec) or M.Tech (Cyber Security)",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://www.cert-in.org.in",
    notificationUrl: "https://www.meity.gov.in/vacancies",
    applicationDeadline: "MeitY Regular Recruitment",
    tags: ["Cyber Defense", "Incident Response", "Malware Analysis", "National Security"],
    status: "Active / Ongoing",
    description: "Guard India's critical information infrastructure from advanced persistent threats (APTs), zero-day exploits, and foreign state cyber intrusions.",
    vacancies: "25+ Security Roles"
  },
  {
    id: "bel-software-engineer",
    orgName: "Bharat Electronics Limited (BEL - Navratna PSU)",
    orgCategory: "PSU",
    title: "Project Engineer / Trainee Engineer (Software Systems)",
    payLevel: "Consolidated ₹40,000 - ₹55,000 / month + Incentives",
    approxMonthlySalary: "₹52,000 / month",
    qualification: "B.E. / B.Tech in CS / IT / Electronics (First Class)",
    selectionProcess: "Written Exam (CBT) + Interview",
    officialPortalUrl: "https://bel-india.in/Careers/",
    notificationUrl: "https://bel-india.in/Careers/",
    applicationDeadline: "Rolling Unit Notifications",
    tags: ["Defence Electronics", "Radar Systems", "Avionics Software", "Navratna"],
    status: "Active / Ongoing",
    description: "Develop software for defence radars, naval sonars, electronic voting machines (EVMs), and secure military communication transceivers.",
    vacancies: "110+ Posts across Bangalore/Ghaziabad"
  },
  {
    id: "ecil-technical-officer",
    orgName: "Electronics Corporation of India Limited (ECIL)",
    orgCategory: "PSU",
    title: "Technical Officer (Software & Embedded Applications)",
    payLevel: "Consolidated ₹25,000 - ₹35,000 / month",
    approxMonthlySalary: "₹35,000 / month",
    qualification: "Engineering Graduate in CS / IT / ECE with 60% marks",
    selectionProcess: "Direct Interview / Project Assessment",
    officialPortalUrl: "https://www.ecil.co.in/jobs.html",
    notificationUrl: "https://www.ecil.co.in/jobs.html",
    applicationDeadline: "Walk-in & Online Application",
    tags: ["Embedded Tech", "Hardware Interface", "Hyderabad Base"],
    status: "Active / Ongoing",
    description: "Work on control instrumentation software, communication hardware interfaces, and security equipment deployment.",
    vacancies: "60+ Openings"
  }
];

export default function GovTechPage() {
  const [activeTab, setActiveTab] = useState<"openings" | "howToApply" | "payScale" | "syllabus">("openings");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredJobs = useMemo(() => {
    return GOV_TECH_JOBS.filter((job) => {
      if (selectedCategory !== "ALL" && job.orgCategory !== selectedCategory) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesOrg = job.orgName.toLowerCase().includes(q);
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesTags = job.tags.some((t) => t.toLowerCase().includes(q));
        const matchesQual = job.qualification.toLowerCase().includes(q);
        if (!matchesOrg && !matchesTitle && !matchesTags && !matchesQual) return false;
      }
      return true;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ANTI-SCAM VERIFICATION BANNER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 text-emerald-200 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                100% Verified Government Recruitment
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                No 3rd-Party Scam Links
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              RoleNest indexes solely verified official portals (<span className="font-mono text-emerald-400">.gov.in</span>, <span className="font-mono text-emerald-400">.nic.in</span>). No ad popups, no registration fees, no fake notifications.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/jobs"
            className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            Switch to Startup & Corporate Jobs &rarr;
          </Link>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
              <Building2 className="h-3.5 w-3.5 text-emerald-600" /> Ministry of Electronics & IT (MeitY) & PSU Careers
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl flex items-center gap-3">
              <span>🇮🇳 Indian Government Tech Jobs Guide</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl">
              Complete blueprint for software engineers, cybersecurity specialists, and researchers targeting Scientist & Engineer roles in ISRO, DRDO, NIC, C-DAC, and top Indian PSUs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              <Coins className="h-4 w-4 text-emerald-600" /> 7th CPC Level 10: ₹1.12L/mo
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              <Award className="h-4 w-4 text-teal-600" /> Group 'A' Gazetted
            </span>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {[
            { id: "openings", label: "Live & Upcoming Tech Openings", icon: Briefcase },
            { id: "howToApply", label: "Step-by-Step 'How to Apply' Guide", icon: FileText },
            { id: "payScale", label: "7th CPC Pay Scale & Perks Breakdown", icon: Coins },
            { id: "syllabus", label: "Exam Pattern & Technical Syllabus", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: LIVE & UPCOMING TECH OPENINGS */}
      {activeTab === "openings" && (
        <div className="mt-6 space-y-6">
          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by organisation, role, or qualification (e.g. NIC, ISRO, GATE, B.Tech)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: "All Sectors", value: "ALL" },
                { label: "Research Labs (ISRO/DRDO)", value: "Research" },
                { label: "Ministries (NIC/MeitY)", value: "Ministry" },
                { label: "PSUs (C-DAC/NPCI/CRIS)", value: "PSU" },
              ].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setSelectedCategory(c.value)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === c.value
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* JOB LISTINGS */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200/60">
                        {job.orgName}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        job.status === "Active / Ongoing"
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {job.vacancies}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {job.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Coins className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Salary:</strong> {job.approxMonthlySalary}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                        <span><strong>Eligibility:</strong> {job.qualification}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        <span><strong>Selection:</strong> {job.selectionProcess}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* ACTION LINKS */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                    <a
                      href={job.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-500 transition-colors"
                    >
                      Official Apply Portal
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <a
                      href={job.notificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      View Notification
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: STEP-BY-STEP HOW TO APPLY GUIDE */}
      {activeTab === "howToApply" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Master Guide: How & Where to Apply for Indian Government Tech Roles
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Follow this step-by-step roadmap to apply smoothly without getting caught in fake scam websites or rejected for improper documentation.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  step: "01",
                  title: "Identify Verified Official Notification Portals",
                  desc: "NEVER register on third-party domains (like .com, .org.in clones) that ask for UPI processing charges. Legitimate central recruitment only occurs on official .gov.in or .nic.in subdomains.",
                  links: [
                    { name: "NIC Recruitment Portal", url: "https://recruitment.nic.in" },
                    { name: "DRDO RAC Portal", url: "https://rac.gov.in" },
                    { name: "ISRO Careers", url: "https://www.isro.gov.in/Careers.html" },
                    { name: "C-DAC Careers", url: "https://www.cdac.in/index.aspx?id=current_jobs" },
                  ]
                },
                {
                  step: "02",
                  title: "Choose Your Examination Pathway: GATE vs Non-GATE",
                  desc: "Government tech positions fall into two distinct pathways:",
                  details: [
                    "GATE Pathway (DRDO RAC, CRIS, BARC, NPCI): Requires a valid GATE Score in CS/IT within the last 3 years. Candidates are shortlisted directly for Tier-2 Technical Interviews based on their GATE normalized score.",
                    "Direct Exam Pathway (NIC / NIELIT, ISRO ICRB, BEL): Conducts their own 120-150 question Computer-Based Test (CBT). No GATE score is required. Anyone with a recognized B.Tech/MCA can sit for the exam."
                  ]
                },
                {
                  step: "03",
                  title: "Document Preparation Checklist (Crucial for Verification)",
                  desc: "Before opening the application form, prepare digital scans according to precise government upload specifications:",
                  checklist: [
                    "Degree Certificate or Provisional Degree (B.E./B.Tech/MCA/M.Sc in CS or IT) with minimum 60% or 6.5 CGPA.",
                    "Valid Category Certificate (OBC-NCL / EWS must be issued within the current financial year in Government of India format; state certificates are often rejected).",
                    "GATE Scorecard (for DRDO/CRIS/BARC positions) with clear registration number.",
                    "Passport Photo (White background, 20 KB - 50 KB, JPEG) and Signature (Black ink on white paper, 10 KB - 20 KB).",
                    "Government Photo Identity Card (Aadhaar, Voter ID, or Passport)."
                  ]
                },
                {
                  step: "04",
                  title: "Fee Payment & Exemption Norms",
                  desc: "Central Government norms provide extensive fee exemptions:",
                  feeRules: [
                    "General & OBC Male Candidates: Typical examination fee is ₹100 - ₹1,000 depending on the ministry.",
                    "Exempted Categories: Female candidates of all categories, SC, ST, and Persons with Benchmark Disabilities (PwD) are 100% exempt from application fees under Central Govt rules.",
                    "Always pay via official SBI ePay or Treasury BharatKosh gateways."
                  ]
                },
                {
                  step: "05",
                  title: "Technical Interview & Document Verification",
                  desc: "Shortlisted candidates are invited for technical panel interviews. For Scientist 'B' (Level 10), the interview carries 15-20% weightage, focusing heavily on B.Tech final-year projects, core algorithms, and distributed systems."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-sm shadow-xs">
                    {item.step}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600">{item.desc}</p>

                    {item.links && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.links.map((l) => (
                          <a
                            key={l.name}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                          >
                            {l.name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    )}

                    {item.details && (
                      <ul className="space-y-1.5 pt-1">
                        {item.details.map((d, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <ChevronRight className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.checklist && (
                      <ul className="space-y-1 pt-1">
                        {item.checklist.map((c, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.feeRules && (
                      <ul className="space-y-1 pt-1">
                        {item.feeRules.map((f, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 7TH PAY COMMISSION CALCULATOR & PERKS */}
      {activeTab === "payScale" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Coins className="h-5 w-5 text-emerald-600" />
              7th Central Pay Commission (7th CPC) Salary Breakdown: Scientist 'B'
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Accurate calculation for entry-level Scientist 'B' / Scientist 'SC' (Pay Matrix Level 10, Index 1) in Class X Cities (Delhi, Bengaluru, Mumbai).
            </p>

            {/* SALARY TABLE */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-semibold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Salary Component</th>
                    <th className="px-4 py-3">Formula / Percentage</th>
                    <th className="px-4 py-3">Amount (₹ Monthly)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-900">Basic Pay</td>
                    <td className="px-4 py-2.5">Level 10 Cell 1 (7th CPC)</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">₹56,100</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-900">Dearness Allowance (DA)</td>
                    <td className="px-4 py-2.5">Current Rate: 50% of Basic Pay</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">₹28,050</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-900">House Rent Allowance (HRA)</td>
                    <td className="px-4 py-2.5">Class X City (30% of Basic Pay)</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">₹16,830</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-900">Transport Allowance (TA)</td>
                    <td className="px-4 py-2.5">Higher TPTA City (₹7,200 + 50% DA)</td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-900">₹10,800</td>
                  </tr>
                  <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                    <td className="px-4 py-3">Gross Total Monthly Emoluments</td>
                    <td className="px-4 py-3">Basic + DA + HRA + TA</td>
                    <td className="px-4 py-3 font-mono text-sm text-emerald-700">₹1,11,780 / month</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-500">Government NPS Contribution (14%)</td>
                    <td className="px-4 py-2.5 text-slate-500">14% of (Basic + DA)</td>
                    <td className="px-4 py-2.5 font-mono text-slate-500">+₹11,781 / month</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ADDITIONAL PERKS */}
            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Exclusive Government Tech Perks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    title: "CGHS Comprehensive Health",
                    desc: "100% cashless medical coverage for self, spouse, children, and dependent parents in empanelled super-specialty hospitals."
                  },
                  {
                    title: "Quarter Allotment / HRA",
                    desc: "Eligibility for Type-IV / Type-V central government housing accommodation in prime metro locations."
                  },
                  {
                    title: "Leave Travel Concession (LTC)",
                    desc: "Annual paid airfare for family to home town and Bharat Darshan destinations across India."
                  },
                  {
                    title: "Professional Update Allowance",
                    desc: "Annual grant for purchasing technical books, laptop allowances, and attending IEEE/ACM international conferences."
                  },
                  {
                    title: "National Pension System (NPS)",
                    desc: "Government contributes 14% matching towards your pension corpus with complete tax exemption."
                  },
                  {
                    title: "Job Stability & Tenure",
                    desc: "Zero private-sector layoff volatility. Full statutory protections and guaranteed annual increments (3%)."
                  }
                ].map((p) => (
                  <div key={p.title} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                    <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYLLABUS & EXAM PATTERN */}
      {activeTab === "syllabus" && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Scientist 'B' & CS Technical Exam Pattern & Detailed Syllabus
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Comprehensive topic breakdown used by NIC, NIELIT, ISRO ICRB, and DRDO Scientist examinations.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  section: "Section A: Core Computer Science (65% Weightage)",
                  topics: [
                    "Data Structures & Algorithms: Asymptotic analysis, Trees, Graphs, Sorting, Dynamic Programming.",
                    "Operating Systems: Process synchronization, Semaphores, Deadlocks, Memory Management, Virtual Memory, File Systems.",
                    "DBMS: Relational Algebra, SQL, Normalization (1NF to BCNF), ACID Properties, Concurrency Control, Indexing.",
                    "Computer Networks: OSI & TCP/IP stack, Routing protocols (OSPF, BGP), TCP Flow/Congestion control, IP addressing & Subnetting, Cryptography basics (RSA, AES, SSL/TLS).",
                    "Theory of Computation & Compilers: Regular expressions, Finite Automata, Context-Free Grammars, Lexical & Syntax analysis, Code generation.",
                    "Computer Architecture: Instruction pipelining, Cache memory hierarchies, Addressing modes, Interrupts."
                  ]
                },
                {
                  section: "Section B: Generic / Analytical Reasoning (35% Weightage)",
                  topics: [
                    "Logical Reasoning: Syllogisms, Direction sense, Seating arrangements, Blood relations.",
                    "Quantitative Aptitude: Number theory, Probability, Permutations & Combinations, Time and Work, Percentages.",
                    "General Mental Ability: Pattern recognition, Series completion, Data interpretation (Charts & Graphs).",
                    "Cyber Law & IT Act Basics: Information Technology Act 2000, DPDP Act 2023 fundamentals, Intellectual Property in software."
                  ]
                }
              ].map((s) => (
                <div key={s.section} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                    {s.section}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {s.topics.map((t, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* PREVIOUS YEAR CUTOFF INSIGHTS */}
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-950">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                GATE Cutoff Tracker & Interview Thresholds (Past Trends)
              </div>
              <p className="mt-1 leading-relaxed text-slate-700">
                For DRDO RAC Scientist 'B' (Computer Science), the typical shortlisting cutoff score for General Category candidates ranges between <strong>720 - 780 GATE Score</strong> (Rank ~300 - 800). For NIC Scientist 'B' direct CBT exam, scoring <strong>75% or higher in Section A</strong> reliably guarantees an interview call.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
