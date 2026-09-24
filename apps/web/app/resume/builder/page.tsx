"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Cpu,
  Eye,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
  Printer,
  Code,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }[];
  experience: {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    techStack: string;
    liveUrl: string;
    repoUrl: string;
    bullets: string[];
  }[];
  skills: {
    languages: string;
    frameworks: string;
    developerTools: string;
    libraries: string;
  };
  devScore: number;
}

const DEFAULT_RESUME: ResumeData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  githubUrl: "github.com/johndoe",
  linkedinUrl: "linkedin.com/in/johndoe",
  portfolioUrl: "johndoe.dev",
  education: [
    {
      institution: "State University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Engineering",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "2025",
      gpa: "3.9 / 4.0",
    },
  ],
  experience: [
    {
      company: "Acme Cloud Systems",
      role: "Software Engineering Intern",
      location: "Remote",
      startDate: "May 2024",
      endDate: "Aug 2024",
      bullets: [
        "Architected distributed event-driven microservices using Next.js, Node.js, and Redis streams reducing API latency by 42%.",
        "Engineered real-time audit logging pipeline with cryptographic signature verification and automated rollbacks.",
        "Authored CI/CD pipelines deploying containerized Next.js applications on cloud infrastructure with 99.98% uptime.",
      ],
    },
  ],
  projects: [
    {
      title: "Distributed Task Scheduler & Queue",
      techStack: "TypeScript, Node.js, PostgreSQL, Redis, Tailwind CSS, Docker",
      liveUrl: "https://demo.example.com",
      repoUrl: "https://github.com/johndoe/task-scheduler",
      bullets: [
        "Engineered high-throughput distributed task scheduler handling 50,000+ jobs/min with exponential backoff retries.",
        "Implemented DPDP and GDPR compliant data exports, cryptographic deletions, and automated audit reports.",
        "Constructed interactive monitoring dashboard with WebSocket metrics streaming and anomaly alerting.",
      ],
    },
    {
      title: "Micrograd WASM Neural Network",
      techStack: "TypeScript, WebGPU, Rust, WebAssembly",
      liveUrl: "https://demo.example.com/wasm-nn",
      repoUrl: "https://github.com/johndoe/wasm-micrograd",
      bullets: [
        "Implemented tiny scalar-valued autograd engine supporting automatic reverse-mode backpropagation compiled to WebAssembly.",
        "Developed custom browser GPU tensor operations executing matrix multiplication shaders at sub-millisecond speeds.",
      ],
    },
  ],
  skills: {
    languages: "TypeScript, JavaScript, Python, C++, Go, SQL",
    frameworks: "React, Next.js, Node.js, Express, Tailwind CSS, Fastify",
    developerTools: "Git, GitHub Actions, Docker, Linux (Ubuntu), Turborepo, PM2",
    libraries: "Drizzle ORM, WebSockets, Lucide, KaTeX, WebGPU",
  },
  devScore: 920,
};

export default function ResumeBuilderPage() {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [activeTab, setActiveTab] = useState<"CONTACT" | "EDUCATION" | "EXPERIENCE" | "PROJECTS" | "SKILLS">("CONTACT");
  const [copiedLatex, setCopiedLatex] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("jobmint_harvard_resume");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName && (parsed.fullName.includes("Divyanshu") || parsed.email?.includes("divyanshu"))) {
          localStorage.removeItem("jobmint_harvard_resume");
          setData(DEFAULT_RESUME);
        } else {
          setData(parsed);
        }
      }
    } catch (e) {}
  }, []);

  // Generate clean LaTeX code (Jake's Resume / Harvard Standard format)
  const generateLatex = () => {
    return `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${data.fullName}} \\\\ \\vspace{1pt}
    \\small ${data.phone} $|$ \\href{mailto:${data.email}}{\\underline{${data.email}}} $|$ 
    \\href{https://${data.linkedinUrl}}{\\underline{${data.linkedinUrl}}} $|$
    \\href{https://${data.githubUrl}}{\\underline{${data.githubUrl}}} $|$
    ${data.location}
\\end{center}

\\section{Education}
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.education
  .map(
    (e) => `  \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{${e.institution}} & ${e.location} \\\\
      \\textit{\\small ${e.degree} in ${e.fieldOfStudy} (GPA: ${e.gpa})} & \\textit{\\small ${e.startDate} -- ${e.endDate}} \\\\
    \\end{tabular*}\\vspace{-5pt}`
  )
  .join("\n")}
\\end{itemize}

\\section{Experience}
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.experience
  .map(
    (exp) => `  \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{${exp.role}} & ${exp.startDate} -- ${exp.endDate} \\\\
      \\textit{\\small ${exp.company}} & \\textit{\\small ${exp.location}} \\\\
    \\end{tabular*}\\vspace{-3pt}
    \\begin{itemize}[leftmargin=0.2in]
${exp.bullets.map((b) => `      \\item \\small{${b}}`).join("\n")}
    \\end{itemize}`
  )
  .join("\n")}
\\end{itemize}

\\section{Projects}
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.projects
  .map(
    (p) => `  \\item
    \\textbf{${p.title}} $|$ \\textit{\\small{${p.techStack}}} \\\\
    \\begin{itemize}[leftmargin=0.2in]
${p.bullets.map((b) => `      \\item \\small{${b}}`).join("\n")}
    \\end{itemize}`
  )
  .join("\n")}
\\end{itemize}

\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\item \\small{
    \\textbf{Languages}{: ${data.skills.languages}} \\\\
    \\textbf{Frameworks}{: ${data.skills.frameworks}} \\\\
    \\textbf{Developer Tools}{: ${data.skills.developerTools}} \\\\
    \\textbf{Libraries}{: ${data.skills.libraries}} \\\\
    \\textbf{Verified Dev Caliber}{: JobMint Dev Score ${data.devScore}/1000 (Proof-of-Work Verified)}
  }
\\end{itemize}

\\end{document}`;
  };

  const copyLatex = () => {
    navigator.clipboard.writeText(generateLatex());
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2500);
  };

  const handlePrint = () => {
    let printFrame = document.getElementById("resume-print-frame") as HTMLIFrameElement;
    if (!printFrame) {
      printFrame = document.createElement("iframe");
      printFrame.id = "resume-print-frame";
      printFrame.style.position = "fixed";
      printFrame.style.right = "0";
      printFrame.style.bottom = "0";
      printFrame.style.width = "0";
      printFrame.style.height = "0";
      printFrame.style.border = "0";
      document.body.appendChild(printFrame);
    }

    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (!frameDoc) {
      window.print();
      return;
    }

    frameDoc.open();
    frameDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${data.fullName || "Resume"} - Harvard ATS Resume</title>
  <style>
    @page {
      size: letter portrait;
      margin: 0.4in 0.45in 0.4in 0.45in;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Times New Roman', Times, 'Nimbus Roman No9 L', serif;
      color: #000000;
      background: #ffffff;
      font-size: 10pt;
      line-height: 1.25;
      padding: 0;
      margin: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 7pt;
    }
    .name {
      font-size: 19pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      margin-bottom: 2pt;
    }
    .contact {
      font-size: 9.5pt;
      color: #111111;
    }
    .contact a {
      color: #000000;
      text-decoration: none;
    }
    .sep {
      margin: 0 4pt;
      color: #555555;
    }
    .section-title {
      font-size: 10.5pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      border-bottom: 1pt solid #000000;
      padding-bottom: 1pt;
      margin-top: 6pt;
      margin-bottom: 3.5pt;
    }
    .row-split {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 10pt;
    }
    .sub-split {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 9.5pt;
      font-style: italic;
      margin-bottom: 1.5pt;
    }
    .bold { font-weight: bold; }
    ul {
      margin: 1.5pt 0 4pt 0;
      padding-left: 16pt;
    }
    li {
      font-size: 9.5pt;
      line-height: 1.25;
      margin-bottom: 1pt;
    }
    .skills-line {
      font-size: 9.5pt;
      line-height: 1.32;
      margin-bottom: 1.5pt;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${data.fullName}</div>
    <div class="contact">
      <span>${data.phone}</span>
      <span class="sep">|</span>
      <a href="mailto:${data.email}">${data.email}</a>
      <span class="sep">|</span>
      <a href="https://${data.linkedinUrl}">${data.linkedinUrl}</a>
      <span class="sep">|</span>
      <a href="https://${data.githubUrl}">${data.githubUrl}</a>
      <span class="sep">|</span>
      <span>${data.location}</span>
    </div>
  </div>

  <div class="section-title">Education</div>
  ${data.education.map(e => `
    <div style="margin-bottom: 3pt;">
      <div class="row-split">
        <span class="bold">${e.institution}</span>
        <span>${e.location}</span>
      </div>
      <div class="sub-split">
        <span>${e.degree} in ${e.fieldOfStudy} (GPA: ${e.gpa})</span>
        <span style="font-style: normal;">${e.startDate} – ${e.endDate}</span>
      </div>
    </div>
  `).join('')}

  <div class="section-title">Experience</div>
  ${data.experience.map(exp => `
    <div style="margin-bottom: 4pt;">
      <div class="row-split">
        <span class="bold">${exp.role}</span>
        <span>${exp.startDate} – ${exp.endDate}</span>
      </div>
      <div class="sub-split">
        <span>${exp.company}</span>
        <span style="font-style: normal;">${exp.location}</span>
      </div>
      <ul>
        ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <div class="section-title">Technical Projects</div>
  ${data.projects.map(p => `
    <div style="margin-bottom: 4pt;">
      <div class="row-split">
        <span class="bold">${p.title} <span style="font-weight: normal; font-style: italic; font-size: 9pt;">| ${p.techStack}</span></span>
      </div>
      <ul>
        ${p.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <div class="section-title">Technical Skills</div>
  <div style="padding-top: 1pt;">
    <div class="skills-line"><span class="bold">Languages:</span> ${data.skills.languages}</div>
    <div class="skills-line"><span class="bold">Frameworks:</span> ${data.skills.frameworks}</div>
    <div class="skills-line"><span class="bold">Developer Tools:</span> ${data.skills.developerTools}</div>
    <div class="skills-line"><span class="bold">Libraries & Cloud:</span> ${data.skills.libraries}</div>
    <div class="skills-line"><span class="bold">Verified Caliber:</span> JobMint Dev Score ${data.devScore}/1000 (Proof-of-Work GitHub Verified)</div>
  </div>
</body>
</html>`);
    frameDoc.close();

    setTimeout(() => {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
    }, 250);
  };

  const resetToDefault = () => {
    setData(DEFAULT_RESUME);
    try {
      localStorage.removeItem("jobmint_harvard_resume");
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 resume-builder-container print:p-0 print:m-0 print:bg-white">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
          <div className="flex items-center gap-3">
            <Link
              href="/profile/resume"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Resume Hub</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                1-Click Harvard / Stanford ATS Resume Builder
              </h1>
              <p className="text-xs text-slate-500">
                Guaranteed 100% ATS parser pass rate. Single-column, zero-bloat formatting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              title="Reset all fields to standard John Doe template"
              className="gap-1.5 text-xs font-bold border-slate-300 text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Template</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={copyLatex}
              className="gap-1.5 text-xs font-bold border-slate-300"
            >
              {copiedLatex ? <Check className="h-4 w-4 text-emerald-600" /> : <Code className="h-4 w-4" />}
              <span>{copiedLatex ? "LaTeX Copied!" : "Copy LaTeX Source"}</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </Button>
          </div>
        </div>

        {/* WORKSPACE DUAL PANE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANE: EDITABLE FORM CONTROLS */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab("CONTACT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "CONTACT" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Contact
              </button>
              <button
                onClick={() => setActiveTab("EDUCATION")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "EDUCATION" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab("EXPERIENCE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "EXPERIENCE" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => setActiveTab("PROJECTS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "PROJECTS" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab("SKILLS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "SKILLS" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Skills
              </button>
            </div>

            <Card className="border-slate-200 shadow-xs bg-white">
              <CardContent className="p-5 space-y-4">
                {activeTab === "CONTACT" && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">Personal &amp; Contact Info</h3>
                    <div>
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => setData({ ...data, fullName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-500 font-semibold block mb-1">Email</label>
                        <input
                          type="email"
                          value={data.email}
                          onChange={(e) => setData({ ...data, email: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-semibold block mb-1">Phone</label>
                        <input
                          type="text"
                          value={data.phone}
                          onChange={(e) => setData({ ...data, phone: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Location</label>
                      <input
                        type="text"
                        value={data.location}
                        onChange={(e) => setData({ ...data, location: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-500 font-semibold block mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={data.githubUrl}
                          onChange={(e) => setData({ ...data, githubUrl: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-semibold block mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={data.linkedinUrl}
                          onChange={(e) => setData({ ...data, linkedinUrl: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "EDUCATION" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">Education</h3>
                    {data.education.map((edu, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...data.education];
                              updated[idx].institution = e.target.value;
                              setData({ ...data, education: updated });
                            }}
                            className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...data.education];
                                updated[idx].degree = e.target.value;
                                setData({ ...data, education: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">Major / Field</label>
                            <input
                              type="text"
                              value={edu.fieldOfStudy}
                              onChange={(e) => {
                                const updated = [...data.education];
                                updated[idx].fieldOfStudy = e.target.value;
                                setData({ ...data, education: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">Dates</label>
                            <input
                              type="text"
                              value={`${edu.startDate} - ${edu.endDate}`}
                              onChange={(e) => {
                                const [start, end] = e.target.value.split("-");
                                const updated = [...data.education];
                                updated[idx].startDate = start?.trim() || "";
                                updated[idx].endDate = end?.trim() || "";
                                setData({ ...data, education: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">GPA / Score</label>
                            <input
                              type="text"
                              value={edu.gpa}
                              onChange={(e) => {
                                const updated = [...data.education];
                                updated[idx].gpa = e.target.value;
                                setData({ ...data, education: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "EXPERIENCE" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">Experience &amp; Internships</h3>
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...data.experience];
                                updated[idx].company = e.target.value;
                                setData({ ...data, experience: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => {
                                const updated = [...data.experience];
                                updated[idx].role = e.target.value;
                                setData({ ...data, experience: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block">
                            Key Accomplishments (STAR Method)
                          </label>
                          {exp.bullets.map((b, bIdx) => (
                            <textarea
                              key={bIdx}
                              rows={2}
                              value={b}
                              onChange={(e) => {
                                const updated = [...data.experience];
                                updated[idx].bullets[bIdx] = e.target.value;
                                setData({ ...data, experience: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 p-1.5 text-xs mt-1"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "PROJECTS" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">Technical Projects</h3>
                    {data.projects.map((p, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block">Project Title</label>
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[idx].title = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block">Tech Stack</label>
                          <input
                            type="text"
                            value={p.techStack}
                            onChange={(e) => {
                              const updated = [...data.projects];
                              updated[idx].techStack = e.target.value;
                              setData({ ...data, projects: updated });
                            }}
                            className="w-full rounded-lg border border-slate-200 p-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-500 font-semibold block">Bullet Points</label>
                          {p.bullets.map((b, bIdx) => (
                            <textarea
                              key={bIdx}
                              rows={2}
                              value={b}
                              onChange={(e) => {
                                const updated = [...data.projects];
                                updated[idx].bullets[bIdx] = e.target.value;
                                setData({ ...data, projects: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 p-1.5 text-xs mt-1"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "SKILLS" && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">Technical Skills</h3>
                    <div>
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Programming Languages</label>
                      <input
                        type="text"
                        value={data.skills.languages}
                        onChange={(e) => setData({ ...data, skills: { ...data.skills, languages: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Frameworks</label>
                      <input
                        type="text"
                        value={data.skills.frameworks}
                        onChange={(e) => setData({ ...data, skills: { ...data.skills, frameworks: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Developer Tools</label>
                      <input
                        type="text"
                        value={data.skills.developerTools}
                        onChange={(e) => setData({ ...data, skills: { ...data.skills, developerTools: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Libraries &amp; Cloud</label>
                      <input
                        type="text"
                        value={data.skills.libraries}
                        onChange={(e) => setData({ ...data, skills: { ...data.skills, libraries: e.target.value } })}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANE: REAL-TIME HARVARD ATS RESUME PREVIEW */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              ref={printRef}
              id="resume-canvas"
              className="w-full max-w-[800px] bg-white p-8 sm:p-12 border border-slate-300 shadow-xl rounded-sm print:border-none print:shadow-none print:p-0 print:m-0 font-serif text-[13px] leading-snug text-black"
              style={{ minHeight: "1050px", fontFamily: "'Times New Roman', Times, serif" }}
            >
              {/* HEADER */}
              <div className="text-center pb-3">
                <h1 className="text-2xl font-bold uppercase tracking-wide">{data.fullName}</h1>
                <div className="text-[12px] pt-1 flex flex-wrap items-center justify-center gap-1.5 text-slate-800">
                  <span>{data.phone}</span>
                  <span>|</span>
                  <a href={`mailto:${data.email}`} className="hover:underline text-black font-medium">{data.email}</a>
                  <span>|</span>
                  <a href={`https://${data.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black font-medium">{data.linkedinUrl}</a>
                  <span>|</span>
                  <a href={`https://${data.githubUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black font-medium">{data.githubUrl}</a>
                  <span>|</span>
                  <span>{data.location}</span>
                </div>
              </div>

              {/* EDUCATION */}
              <div className="pt-2">
                <div className="border-b border-black font-bold uppercase text-[13px] tracking-wider pb-0.5 mb-1.5">
                  Education
                </div>
                {data.education.map((e, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between items-baseline font-bold text-[13px]">
                      <span>{e.institution}</span>
                      <span className="font-normal text-[12px]">{e.location}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-[12px]">
                      <span>{e.degree} in {e.fieldOfStudy} (GPA: {e.gpa})</span>
                      <span>{e.startDate} – {e.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* EXPERIENCE */}
              <div className="pt-2">
                <div className="border-b border-black font-bold uppercase text-[13px] tracking-wider pb-0.5 mb-1.5">
                  Experience
                </div>
                {data.experience.map((exp, i) => (
                  <div key={i} className="mb-2.5">
                    <div className="flex justify-between items-baseline font-bold text-[13px]">
                      <span>{exp.role}</span>
                      <span className="font-normal text-[12px]">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <div className="flex justify-between items-baseline italic text-[12px] mb-1">
                      <span>{exp.company}</span>
                      <span>{exp.location}</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-0.5 text-[12px] leading-relaxed">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* PROJECTS */}
              <div className="pt-2">
                <div className="border-b border-black font-bold uppercase text-[13px] tracking-wider pb-0.5 mb-1.5">
                  Projects
                </div>
                {data.projects.map((p, i) => (
                  <div key={i} className="mb-2.5">
                    <div className="flex justify-between items-baseline text-[13px]">
                      <span className="font-bold">
                        {p.title} <span className="font-normal italic text-[12px]">| {p.techStack}</span>
                      </span>
                    </div>
                    <ul className="list-disc pl-5 space-y-0.5 text-[12px] leading-relaxed mt-1">
                      {p.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* TECHNICAL SKILLS */}
              <div className="pt-2">
                <div className="border-b border-black font-bold uppercase text-[13px] tracking-wider pb-0.5 mb-1.5">
                  Technical Skills
                </div>
                <div className="space-y-1 text-[12px] leading-relaxed pt-1">
                  <div>
                    <strong className="font-bold">Languages:</strong> {data.skills.languages}
                  </div>
                  <div>
                    <strong className="font-bold">Frameworks:</strong> {data.skills.frameworks}
                  </div>
                  <div>
                    <strong className="font-bold">Developer Tools:</strong> {data.skills.developerTools}
                  </div>
                  <div>
                    <strong className="font-bold">Libraries:</strong> {data.skills.libraries}
                  </div>
                  <div>
                    <strong className="font-bold">Verified Caliber:</strong> JobMint Dev Score {data.devScore}/1000 (Proof-of-Work GitHub Verified)
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
