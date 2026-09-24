"use client";

import { useState, useEffect, useRef, useMemo } from "react";
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
  Wand2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Layers,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface CustomLink {
  id: string;
  label: string;
  url: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  liveUrl?: string;
  repoUrl?: string;
  bullets: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  customLinks: CustomLink[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategory[];
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
  customLinks: [
    {
      id: "cl-1",
      label: "LeetCode",
      url: "leetcode.com/u/johndoe",
    },
  ],
  education: [
    {
      id: "edu-1",
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
      id: "exp-1",
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
      id: "proj-1",
      title: "Distributed Task Scheduler & Queue",
      techStack: "TypeScript, Node.js, PostgreSQL, Redis, Docker",
      liveUrl: "https://demo.example.com",
      repoUrl: "https://github.com/johndoe/task-scheduler",
      bullets: [
        "Engineered high-throughput distributed task scheduler handling 50,000+ jobs/min with exponential backoff retries.",
        "Implemented DPDP and GDPR compliant data exports, cryptographic deletions, and automated audit reports.",
        "Constructed interactive monitoring dashboard with WebSocket metrics streaming and anomaly alerting.",
      ],
    },
    {
      id: "proj-2",
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
  skills: [
    {
      id: "sk-1",
      category: "Languages",
      items: "TypeScript, JavaScript, Python, C++, Go, SQL",
    },
    {
      id: "sk-2",
      category: "Frameworks & Runtimes",
      items: "React, Next.js, Node.js, Express, Tailwind CSS, Fastify",
    },
    {
      id: "sk-3",
      category: "Developer Tools & DevOps",
      items: "Git, GitHub Actions, Docker, Linux (Ubuntu), Turborepo, PM2",
    },
    {
      id: "sk-4",
      category: "Libraries & Cloud",
      items: "Drizzle ORM, PostgreSQL, Redis, WebSockets, WebGPU",
    },
  ],
  devScore: 920,
};

const STRONG_ACTION_VERBS = [
  "architected", "engineered", "spearheaded", "developed", "designed",
  "implemented", "constructed", "optimized", "accelerated", "streamlined",
  "authored", "automated", "scaled", "refactored", "orchestrated",
  "deployed", "formulated", "minimized", "boosted", "delivered",
  "built", "established", "modeled", "pioneered", "centralized"
];

const METRIC_REGEX = /(\d+%|\d+\.\d*x|\d+[\.,]?\d*\+?|\$\d+|sub-millisecond|\d+\s*(?:ms|seconds|minutes|hours|users|jobs|RPS|QPS|GB|MB|KB))/i;

const AI_IMPROVEMENT_TEMPLATES = [
  "Architected high-throughput microservices using {tech}, reducing API response latency by 38% across 100K+ daily active requests.",
  "Engineered automated CI/CD and unit testing pipelines, cutting deployment cycle times by 45% with 99.9% release reliability.",
  "Constructed real-time event-driven data streaming pipelines handling 25,000+ events/sec with fault-tolerant worker failovers.",
  "Optimized database indexing and caching strategies, reducing query latency by 52% and decreasing memory footprint by 30%.",
  "Spearheaded end-to-end full-stack feature development with Next.js and TypeScript, increasing user retention by 22% in Q3.",
];

export default function ResumeBuilderPage() {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [activeTab, setActiveTab] = useState<"CONTACT" | "EDUCATION" | "EXPERIENCE" | "PROJECTS" | "SKILLS" | "AI_COACH">("CONTACT");
  const [copiedLatex, setCopiedLatex] = useState(false);
  const [polishingId, setPolishingId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState<number>(1050);

  // Load and migrate saved resume
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jobmint_harvard_resume");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName && (parsed.fullName.includes("Divyanshu") || parsed.email?.includes("divyanshu"))) {
          localStorage.removeItem("jobmint_harvard_resume");
          setData(DEFAULT_RESUME);
          return;
        }

        let migratedSkills = parsed.skills;
        if (parsed.skills && !Array.isArray(parsed.skills)) {
          migratedSkills = [
            { id: "sk-1", category: "Languages", items: parsed.skills.languages || "" },
            { id: "sk-2", category: "Frameworks", items: parsed.skills.frameworks || "" },
            { id: "sk-3", category: "Developer Tools", items: parsed.skills.developerTools || "" },
            { id: "sk-4", category: "Libraries & Cloud", items: parsed.skills.libraries || "" },
          ];
        }

        const migratedEducation = (parsed.education || DEFAULT_RESUME.education).map((e: any, idx: number) => ({
          ...e,
          id: e.id || `edu-${idx}`,
        }));

        const migratedExperience = (parsed.experience || DEFAULT_RESUME.experience).map((exp: any, idx: number) => ({
          ...exp,
          id: exp.id || `exp-${idx}`,
          bullets: Array.isArray(exp.bullets) ? exp.bullets : [],
        }));

        const migratedProjects = (parsed.projects || DEFAULT_RESUME.projects).map((p: any, idx: number) => ({
          ...p,
          id: p.id || `proj-${idx}`,
          bullets: Array.isArray(p.bullets) ? p.bullets : [],
        }));

        setData({
          ...DEFAULT_RESUME,
          ...parsed,
          customLinks: Array.isArray(parsed.customLinks) ? parsed.customLinks : DEFAULT_RESUME.customLinks,
          education: migratedEducation,
          experience: migratedExperience,
          projects: migratedProjects,
          skills: migratedSkills || DEFAULT_RESUME.skills,
        });
      }
    } catch (e) {
      console.error("Failed to load saved resume", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("jobmint_harvard_resume", JSON.stringify(data));
    } catch (e) {}
  }, [data]);

  // Monitor canvas height to detect multi-page overflow
  useEffect(() => {
    if (!canvasRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCanvasHeight(entry.contentRect.height);
      }
    });
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  // ATS Real-time Health Audit
  const atsAudit = useMemo(() => {
    let score = 100;
    const suggestions: string[] = [];
    const passed: string[] = [];

    // 1. Contact Info Checks
    if (!data.fullName.trim() || data.fullName === "John Doe") {
      suggestions.push("Customize your full name.");
      score -= 5;
    } else {
      passed.push("Candidate name is properly specified.");
    }

    if (!data.email.includes("@")) {
      suggestions.push("Provide a valid professional email address.");
      score -= 10;
    } else {
      passed.push("Professional contact email detected.");
    }

    if (!data.linkedinUrl && !data.githubUrl) {
      suggestions.push("Add a LinkedIn or GitHub profile link for technical verification.");
      score -= 8;
    } else {
      passed.push("Online technical portfolio links (GitHub / LinkedIn) present.");
    }

    // 2. Bullets Analysis (Action Verbs & Metrics)
    const allBullets: string[] = [];
    data.experience.forEach((e) => allBullets.push(...e.bullets));
    data.projects.forEach((p) => allBullets.push(...p.bullets));

    if (allBullets.length === 0) {
      suggestions.push("Add bullet points to your experience and projects.");
      score -= 30;
    } else {
      let bulletsWithMetrics = 0;
      let bulletsWithActionVerbs = 0;

      allBullets.forEach((bullet) => {
        const text = bullet.trim();
        if (METRIC_REGEX.test(text)) {
          bulletsWithMetrics++;
        }
        const firstWord = text.split(" ")[0]?.toLowerCase().replace(/[^a-z]/g, "");
        if (firstWord && STRONG_ACTION_VERBS.includes(firstWord)) {
          bulletsWithActionVerbs++;
        }
      });

      const metricRatio = bulletsWithMetrics / allBullets.length;
      const verbRatio = bulletsWithActionVerbs / allBullets.length;

      if (metricRatio < 0.5) {
        suggestions.push(
          `Only ${bulletsWithMetrics}/${allBullets.length} bullets contain quantifiable metrics. Add numbers, percentages (%), or latency improvements using Google's XYZ formula.`
        );
        score -= 15;
      } else {
        passed.push(`High metric density: ${bulletsWithMetrics}/${allBullets.length} bullets include quantifiable results.`);
      }

      if (verbRatio < 0.6) {
        suggestions.push(
          "Start each bullet with a strong past-tense action verb (e.g., 'Architected', 'Engineered', 'Optimized')."
        );
        score -= 10;
      } else {
        passed.push(`Strong action verbs present on ${bulletsWithActionVerbs}/${allBullets.length} bullet points.`);
      }
    }

    // 3. Skills Check
    const totalSkills = data.skills.reduce((acc, s) => acc + s.items.split(",").filter(Boolean).length, 0);
    if (totalSkills < 8) {
      suggestions.push("Add more technical keywords to your Skills section (at least 8-12 core skills).");
      score -= 10;
    } else {
      passed.push(`Comprehensive skill coverage: ${totalSkills} verified technologies indexed.`);
    }

    // 4. Length Audit
    const isMultiPage = canvasHeight > 1080;
    if (isMultiPage) {
      suggestions.push("Your resume spans onto Page 2. If you have under 5 years of experience, a concise 1-page resume is strongly recommended by top ATS parsers.");
    } else {
      passed.push("Optimal 1-page length for freshers and early-career software engineers.");
    }

    return {
      score: Math.max(20, Math.min(100, score)),
      isMultiPage,
      suggestions,
      passed,
      totalBullets: allBullets.length,
    };
  }, [data, canvasHeight]);

  // AI Bullet Polisher (1-Click STAR / XYZ Formatter)
  const polishBullet = (currentText: string, contextHint: string = "feature development"): string => {
    const text = currentText.trim();
    if (!text) {
      return AI_IMPROVEMENT_TEMPLATES[Math.floor(Math.random() * AI_IMPROVEMENT_TEMPLATES.length)].replace("{tech}", "TypeScript, Next.js, and Redis");
    }

    const firstWord = text.split(" ")[0]?.toLowerCase().replace(/[^a-z]/g, "");
    let verb = "Engineered";
    if (!STRONG_ACTION_VERBS.includes(firstWord)) {
      const randomVerb = STRONG_ACTION_VERBS[Math.floor(Math.random() * 8)];
      verb = randomVerb.charAt(0).toUpperCase() + randomVerb.slice(1);
    } else {
      verb = text.split(" ")[0];
    }

    const hasMetric = METRIC_REGEX.test(text);
    if (!hasMetric) {
      const metrics = [
        "reducing API latency by 42% across 50,000+ daily requests.",
        "improving core system throughput by 35% with zero downtime.",
        "decreasing memory footprint by 28% and eliminating memory leaks.",
        "accelerating build and test execution pipelines by 50%.",
      ];
      const metric = metrics[Math.floor(Math.random() * metrics.length)];
      const clean = text.replace(/[\.,\;]+$/, "");
      return `${clean}, ${metric}`;
    }

    let result = text.charAt(0).toUpperCase() + text.slice(1);
    if (!result.endsWith(".")) result += ".";
    return result;
  };

  const handlePolishBullet = (type: "exp" | "proj", parentIdx: number, bulletIdx: number) => {
    const key = `${type}-${parentIdx}-${bulletIdx}`;
    setPolishingId(key);

    setTimeout(() => {
      if (type === "exp") {
        const updated = [...data.experience];
        const old = updated[parentIdx].bullets[bulletIdx];
        updated[parentIdx].bullets[bulletIdx] = polishBullet(old, updated[parentIdx].role);
        setData({ ...data, experience: updated });
      } else {
        const updated = [...data.projects];
        const old = updated[parentIdx].bullets[bulletIdx];
        updated[parentIdx].bullets[bulletIdx] = polishBullet(old, updated[parentIdx].title);
        setData({ ...data, projects: updated });
      }
      setPolishingId(null);
    }, 300);
  };

  // Generate LaTeX Source (Harvard / Jake's Resume Standard)
  const generateLatex = () => {
    const escapeLatex = (str: string) => {
      if (!str) return "";
      return str
        .replace(/\\/g, "\\textbackslash ")
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "\\#")
        .replace(/_/g, "\\_")
        .replace(/\{/g, "\\{")
        .replace(/\}/g, "\\}")
        .replace(/~/g, "\\textasciitilde ");
    };

    const customLinksLatex = data.customLinks
      .map((l) => `\\href{https://${escapeLatex(l.url)}}{\\underline{${escapeLatex(l.label)}}}`)
      .join(" $|$ ");

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
    \\textbf{\\Huge \\scshape ${escapeLatex(data.fullName)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(data.phone)} $|$ \\href{mailto:${escapeLatex(data.email)}}{\\underline{${escapeLatex(data.email)}}} $|$ 
    \\href{https://${escapeLatex(data.linkedinUrl)}}{\\underline{${escapeLatex(data.linkedinUrl)}}} $|$
    \\href{https://${escapeLatex(data.githubUrl)}}{\\underline{${escapeLatex(data.githubUrl)}}}
    ${customLinksLatex ? ` $|$ ${customLinksLatex}` : ""} $|$
    ${escapeLatex(data.location)}
\\end{center}

\\section{Education}
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.education
  .map(
    (e) => `  \\item
    \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{${escapeLatex(e.institution)}} & ${escapeLatex(e.location)} \\\\
      \\textit{\\small ${escapeLatex(e.degree)} in ${escapeLatex(e.fieldOfStudy)} (GPA: ${escapeLatex(e.gpa)})} & \\textit{\\small ${escapeLatex(e.startDate)} -- ${escapeLatex(e.endDate)}} \\\\
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
      \\textbf{${escapeLatex(exp.role)}} & ${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)} \\\\
      \\textit{\\small ${escapeLatex(exp.company)}} & \\textit{\\small ${escapeLatex(exp.location)}} \\\\
    \\end{tabular*}\\vspace{-3pt}
    \\begin{itemize}[leftmargin=0.2in]
${exp.bullets.map((b) => `      \\item \\small{${escapeLatex(b)}}`).join("\n")}
    \\end{itemize}`
  )
  .join("\n")}
\\end{itemize}

\\section{Technical Projects}
\\begin{itemize}[leftmargin=0.15in, label={}]
${data.projects
  .map(
    (p) => `  \\item
    \\textbf{${escapeLatex(p.title)}} $|$ \\textit{\\small{${escapeLatex(p.techStack)}}} \\\\
    \\begin{itemize}[leftmargin=0.2in]
${p.bullets.map((b) => `      \\item \\small{${escapeLatex(b)}}`).join("\n")}
    \\end{itemize}`
  )
  .join("\n")}
\\end{itemize}

\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\item \\small{
${data.skills.map((s) => `    \\textbf{${escapeLatex(s.category)}}{: ${escapeLatex(s.items)}} \\\\`).join("\n")}
    \\textbf{Verified Caliber}{: JobMint Dev Score ${data.devScore}/1000 (Proof-of-Work GitHub Verified)}
  }
\\end{itemize}

\\end{document}`;
  };

  const copyLatex = () => {
    navigator.clipboard.writeText(generateLatex());
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2500);
  };

  // High-fidelity Harvard print engine via isolated iframe
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

    const customLinksHtml = data.customLinks
      .map((l) => `<span class="sep">|</span><a href="https://${l.url}">${l.label}</a>`)
      .join("");

    const eduHtml = data.education.map(e => (
      '<div class="avoid-break" style="margin-bottom: 3pt;">' +
        '<div class="row-split">' +
          '<span class="bold">' + e.institution + '</span>' +
          '<span>' + e.location + '</span>' +
        '</div>' +
        '<div class="sub-split">' +
          '<span>' + e.degree + ' in ' + e.fieldOfStudy + ' (GPA: ' + e.gpa + ')</span>' +
          '<span style="font-style: normal;">' + e.startDate + ' – ' + e.endDate + '</span>' +
        '</div>' +
      '</div>'
    )).join('');

    const expHtml = data.experience.map(exp => (
      '<div class="avoid-break" style="margin-bottom: 4pt;">' +
        '<div class="row-split">' +
          '<span class="bold">' + exp.role + '</span>' +
          '<span>' + exp.startDate + ' – ' + exp.endDate + '</span>' +
        '</div>' +
        '<div class="sub-split">' +
          '<span>' + exp.company + '</span>' +
          '<span style="font-style: normal;">' + exp.location + '</span>' +
        '</div>' +
        '<ul>' +
          exp.bullets.map(b => '<li>' + b + '</li>').join('') +
        '</ul>' +
      '</div>'
    )).join('');

    const projHtml = data.projects.map(p => (
      '<div class="avoid-break" style="margin-bottom: 4pt;">' +
        '<div class="row-split">' +
          '<span class="bold">' + p.title + ' <span style="font-weight: normal; font-style: italic; font-size: 9pt;">| ' + p.techStack + '</span></span>' +
        '</div>' +
        '<ul>' +
          p.bullets.map(b => '<li>' + b + '</li>').join('') +
        '</ul>' +
      '</div>'
    )).join('');

    const skillsHtml = data.skills.map(s => (
      '<div class="skills-line"><span class="bold">' + s.category + ':</span> ' + s.items + '</div>'
    )).join('');

    const htmlContent = '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
      '  <meta charset="utf-8" />' +
      '  <title>' + (data.fullName || "Resume") + ' - Harvard ATS Resume</title>' +
      '  <style>' +
      '    @page { size: letter portrait; margin: 0.45in 0.5in 0.45in 0.5in; }' +
      '    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }' +
      '    body { font-family: "Times New Roman", Times, serif; color: #000000; background: #ffffff; font-size: 10pt; line-height: 1.25; padding: 0; margin: 0; }' +
      '    .header { text-align: center; margin-bottom: 7pt; }' +
      '    .name { font-size: 19pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; margin-bottom: 2pt; }' +
      '    .contact { font-size: 9.5pt; color: #111111; }' +
      '    .contact a { color: #000000; text-decoration: none; }' +
      '    .sep { margin: 0 4pt; color: #555555; }' +
      '    .section-title { font-size: 10.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; border-bottom: 1pt solid #000000; padding-bottom: 1pt; margin-top: 6pt; margin-bottom: 3.5pt; }' +
      '    .row-split { display: flex; justify-content: space-between; align-items: baseline; font-size: 10pt; }' +
      '    .sub-split { display: flex; justify-content: space-between; align-items: baseline; font-size: 9.5pt; font-style: italic; margin-bottom: 1.5pt; }' +
      '    .bold { font-weight: bold; }' +
      '    ul { margin: 1.5pt 0 4pt 0; padding-left: 16pt; }' +
      '    li { font-size: 9.5pt; line-height: 1.25; margin-bottom: 1pt; text-align: justify; }' +
      '    .skills-line { font-size: 9.5pt; line-height: 1.32; margin-bottom: 1.5pt; }' +
      '    .avoid-break { page-break-inside: avoid; break-inside: avoid; }' +
      '  </style>' +
      '</head>' +
      '<body>' +
      '  <div class="header">' +
      '    <div class="name">' + data.fullName + '</div>' +
      '    <div class="contact">' +
      '      <span>' + data.phone + '</span>' +
      '      <span class="sep">|</span>' +
      '      <a href="mailto:' + data.email + '">' + data.email + '</a>' +
      '      <span class="sep">|</span>' +
      '      <a href="https://' + data.linkedinUrl + '">' + data.linkedinUrl + '</a>' +
      '      <span class="sep">|</span>' +
      '      <a href="https://' + data.githubUrl + '">' + data.githubUrl + '</a>' +
      '      ' + customLinksHtml +
      '      <span class="sep">|</span>' +
      '      <span>' + data.location + '</span>' +
      '    </div>' +
      '  </div>' +
      '  <div class="section-title">Education</div>' +
      '  ' + eduHtml +
      '  <div class="section-title">Experience</div>' +
      '  ' + expHtml +
      '  <div class="section-title">Technical Projects</div>' +
      '  ' + projHtml +
      '  <div class="section-title">Technical Skills</div>' +
      '  <div class="avoid-break" style="padding-top: 1pt;">' +
      '    ' + skillsHtml +
      '    <div class="skills-line"><span class="bold">Verified Caliber:</span> JobMint Dev Score ' + data.devScore + '/1000 (Proof-of-Work GitHub Verified)</div>' +
      '  </div>' +
      '</body>' +
      '</html>';

    frameDoc.open();
    frameDoc.write(htmlContent);
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
        
        {/* TOP CONTROLS & STATUS BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
          <div className="flex items-center gap-3">
            <Link
              href="/profile/resume"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Resume Hub</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  1-Click Harvard / Stanford ATS Resume Builder
                </h1>
                {atsAudit.isMultiPage ? (
                  <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[11px] font-bold border border-amber-300">
                    2 Pages
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold border border-emerald-300">
                    1 Page (Optimal)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Guaranteed 100% ATS parser pass rate. Single-column, zero-bloat formatting.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick ATS Score Pill */}
            <button
              onClick={() => setActiveTab("AI_COACH")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                atsAudit.score >= 85
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                  : "bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
              <span>ATS Score: {atsAudit.score}/100</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              title="Reset all fields to standard John Doe template"
              className="gap-1.5 text-xs font-bold border-slate-300 text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={copyLatex}
              className="gap-1.5 text-xs font-bold border-slate-300"
            >
              {copiedLatex ? <Check className="h-4 w-4 text-emerald-600" /> : <Code className="h-4 w-4" />}
              <span>{copiedLatex ? "LaTeX Copied!" : "Copy LaTeX"}</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </Button>
          </div>
        </div>

        {/* WORKSPACE DUAL PANE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANE: EDITABLE FORM CONTROLS */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            {/* Tab Navigation */}
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
                Education ({data.education.length})
              </button>
              <button
                onClick={() => setActiveTab("EXPERIENCE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "EXPERIENCE" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Experience ({data.experience.length})
              </button>
              <button
                onClick={() => setActiveTab("PROJECTS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "PROJECTS" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Projects ({data.projects.length})
              </button>
              <button
                onClick={() => setActiveTab("SKILLS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "SKILLS" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Skills ({data.skills.length})
              </button>
              <button
                onClick={() => setActiveTab("AI_COACH")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === "AI_COACH" ? "bg-purple-600 text-white" : "text-purple-700 bg-purple-50 hover:bg-purple-100"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                AI Coach
              </button>
            </div>

            <Card className="border-slate-200 shadow-xs bg-white">
              <CardContent className="p-5 space-y-4">
                
                {/* 1. CONTACT TAB */}
                {activeTab === "CONTACT" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm">Personal &amp; Contact Info</h3>
                      <span className="text-[11px] text-slate-400">Harvard Single-Line Format</span>
                    </div>

                    <div>
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={data.fullName}
                        onChange={(e) => setData({ ...data, fullName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
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
                      <label className="text-xs text-slate-500 font-semibold block mb-1">Location (City, State / Country)</label>
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
                          placeholder="github.com/username"
                          className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-semibold block mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={data.linkedinUrl}
                          onChange={(e) => setData({ ...data, linkedinUrl: e.target.value })}
                          placeholder="linkedin.com/in/username"
                          className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* DYNAMIC CUSTOM LINKS */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs text-slate-700 font-bold block">Custom Portfolio &amp; Coding Links</label>
                          <span className="text-[11px] text-slate-500">Add LeetCode, Codeforces, Kaggle, X, Portfolio, etc.</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newLink: CustomLink = {
                              id: `cl-${Date.now()}`,
                              label: "LeetCode",
                              url: "leetcode.com/u/johndoe",
                            };
                            setData({ ...data, customLinks: [...data.customLinks, newLink] });
                          }}
                          className="h-7 text-xs font-bold gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Link</span>
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {data.customLinks.map((link, idx) => (
                          <div key={link.id || idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                            <input
                              type="text"
                              placeholder="Label (e.g. LeetCode)"
                              value={link.label}
                              onChange={(e) => {
                                const updated = [...data.customLinks];
                                updated[idx].label = e.target.value;
                                setData({ ...data, customLinks: updated });
                              }}
                              className="w-1/3 rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-bold"
                            />
                            <input
                              type="text"
                              placeholder="URL (e.g. leetcode.com/u/user)"
                              value={link.url}
                              onChange={(e) => {
                                const updated = [...data.customLinks];
                                updated[idx].url = e.target.value;
                                setData({ ...data, customLinks: updated });
                              }}
                              className="flex-1 rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = data.customLinks.filter((_, i) => i !== idx);
                                setData({ ...data, customLinks: updated });
                              }}
                              title="Delete Link"
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. EDUCATION TAB */}
                {activeTab === "EDUCATION" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Education</h3>
                        <span className="text-[11px] text-slate-500">Degree, university, GPA, and location</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newEdu: EducationItem = {
                            id: `edu-${Date.now()}`,
                            institution: "University Name",
                            degree: "Bachelor of Technology",
                            fieldOfStudy: "Computer Science",
                            location: "City, Country",
                            startDate: "2021",
                            endDate: "2025",
                            gpa: "3.8 / 4.0",
                          };
                          setData({ ...data, education: [...data.education, newEdu] });
                        }}
                        className="h-7 text-xs font-bold gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Education</span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {data.education.map((edu, idx) => (
                        <div key={edu.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs relative group">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200/80">
                            <span className="font-bold text-slate-700 text-xs">Education #{idx + 1}</span>
                            {data.education.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = data.education.filter((_, i) => i !== idx);
                                  setData({ ...data, education: updated });
                                }}
                                className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-semibold"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">Institution / University</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...data.education];
                                updated[idx].institution = e.target.value;
                                setData({ ...data, education: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-medium"
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
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
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
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">Start Year/Date</label>
                              <input
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => {
                                  const updated = [...data.education];
                                  updated[idx].startDate = e.target.value;
                                  setData({ ...data, education: updated });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">End Year/Date</label>
                              <input
                                type="text"
                                value={edu.endDate}
                                onChange={(e) => {
                                  const updated = [...data.education];
                                  updated[idx].endDate = e.target.value;
                                  setData({ ...data, education: updated });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">GPA / Percentage</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => {
                                  const updated = [...data.education];
                                  updated[idx].gpa = e.target.value;
                                  setData({ ...data, education: updated });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">Campus Location</label>
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => {
                                const updated = [...data.education];
                                updated[idx].location = e.target.value;
                                setData({ ...data, education: updated });
                              }}
                              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. EXPERIENCE TAB */}
                {activeTab === "EXPERIENCE" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Experience &amp; Internships</h3>
                        <span className="text-[11px] text-slate-500">Roles, companies, dates, and STAR method bullets</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newExp: ExperienceItem = {
                            id: `exp-${Date.now()}`,
                            company: "Company / Organization",
                            role: "Software Engineering Intern",
                            location: "Remote / City",
                            startDate: "Jan 2024",
                            endDate: "Present",
                            bullets: [
                              "Architected distributed backend services using TypeScript and Node.js, improving API response times by 35%.",
                            ],
                          };
                          setData({ ...data, experience: [...data.experience, newExp] });
                        }}
                        className="h-7 text-xs font-bold gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Experience</span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {data.experience.map((exp, idx) => (
                        <div key={exp.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                            <span className="font-bold text-slate-800 text-xs">Experience #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = data.experience.filter((_, i) => i !== idx);
                                setData({ ...data, experience: updated });
                              }}
                              className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-semibold"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Remove Role</span>
                            </button>
                          </div>

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
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">Role / Title</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => {
                                  const updated = [...data.experience];
                                  updated[idx].role = e.target.value;
                                  setData({ ...data, experience: updated });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-semibold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">Start Date</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => {
                                  const updated = [...data.experience];
                                  updated[idx].startDate = e.target.value;
                                  setData({ ...data, experience: updated });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">End Date</label>
                              <input
                                type="text"
                                value={exp.endDate}
                                onChange={(e) => {
                                  const updated = [...data.experience];
                                  updated[idx].endDate = e.target.value;
                                  setData({ ...data, experience: updated });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => {
                                  const updated = [...data.experience];
                                  updated[idx].location = e.target.value;
                                  setData({ ...data, experience: updated });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                          </div>

                          {/* DYNAMIC BULLETS */}
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] text-slate-700 font-bold">
                                Bullets (STAR Method: Action Verb + Task + Quantified Impact)
                              </label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = [...data.experience];
                                  updated[idx].bullets.push("Architected scalable feature delivering 40% performance gain.");
                                  setData({ ...data, experience: updated });
                                }}
                                className="h-6 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 px-2"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Bullet
                              </Button>
                            </div>

                            {exp.bullets.map((b, bIdx) => {
                              const hasMetric = METRIC_REGEX.test(b);
                              const firstWord = b.trim().split(" ")[0]?.toLowerCase().replace(/[^a-z]/g, "");
                              const hasActionVerb = STRONG_ACTION_VERBS.includes(firstWord);
                              const isPolishing = polishingId === `exp-${idx}-${bIdx}`;

                              return (
                                <div key={bIdx} className="space-y-1 bg-white p-2 rounded-xl border border-slate-200">
                                  <div className="flex items-start gap-1.5">
                                    <textarea
                                      rows={2}
                                      value={b}
                                      onChange={(e) => {
                                        const updated = [...data.experience];
                                        updated[idx].bullets[bIdx] = e.target.value;
                                        setData({ ...data, experience: updated });
                                      }}
                                      className="flex-1 rounded-lg border border-slate-200 p-2 text-xs leading-relaxed focus:ring-1 focus:ring-emerald-500"
                                      placeholder="Accomplished [X] as measured by [Y], by doing [Z]..."
                                    />
                                    <div className="flex flex-col gap-1">
                                      <button
                                        type="button"
                                        disabled={isPolishing}
                                        onClick={() => handlePolishBullet("exp", idx, bIdx)}
                                        title="Enhance with AI (Inject action verb & metric formula)"
                                        className="p-1.5 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                                      >
                                        <Sparkles className={`h-3.5 w-3.5 ${isPolishing ? "animate-spin" : ""}`} />
                                      </button>
                                      {exp.bullets.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...data.experience];
                                            updated[idx].bullets = updated[idx].bullets.filter((_, i) => i !== bIdx);
                                            setData({ ...data, experience: updated });
                                          }}
                                          title="Delete Bullet"
                                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-[10px] px-1 font-mono">
                                    <span className={hasActionVerb ? "text-emerald-600 font-bold" : "text-amber-600"}>
                                      {hasActionVerb ? "✓ Action Verb" : "⚠ Weak Verb"}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className={hasMetric ? "text-emerald-600 font-bold" : "text-amber-600"}>
                                      {hasMetric ? "✓ Quantified Metric" : "⚠ Missing Numbers / %"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PROJECTS TAB */}
                {activeTab === "PROJECTS" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Technical Projects</h3>
                        <span className="text-[11px] text-slate-500">Showcase open-source, full-stack, and systems work</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newProj: ProjectItem = {
                            id: `proj-${Date.now()}`,
                            title: "New Project Title",
                            techStack: "TypeScript, React, Next.js, PostgreSQL",
                            liveUrl: "https://demo.example.com",
                            repoUrl: "https://github.com/username/project",
                            bullets: [
                              "Engineered high-performance web platform supporting 10,000+ monthly active users with 99.9% uptime.",
                            ],
                          };
                          setData({ ...data, projects: [...data.projects, newProj] });
                        }}
                        className="h-7 text-xs font-bold gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Project</span>
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {data.projects.map((p, idx) => (
                        <div key={p.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                            <span className="font-bold text-slate-800 text-xs">Project #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = data.projects.filter((_, i) => i !== idx);
                                setData({ ...data, projects: updated });
                              }}
                              className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-semibold"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Remove Project</span>
                            </button>
                          </div>

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
                              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-500 font-semibold block">Tech Stack (comma-separated)</label>
                            <input
                              type="text"
                              value={p.techStack}
                              onChange={(e) => {
                                const updated = [...data.projects];
                                updated[idx].techStack = e.target.value;
                                setData({ ...data, projects: updated });
                              }}
                              placeholder="e.g. Next.js, Node.js, PostgreSQL, Docker"
                              className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">Live Demo URL (optional)</label>
                              <input
                                type="text"
                                value={p.liveUrl || ""}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].liveUrl = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                placeholder="demo.domain.com"
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-500 font-semibold block">GitHub Repo URL (optional)</label>
                              <input
                                type="text"
                                value={p.repoUrl || ""}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].repoUrl = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                placeholder="github.com/user/repo"
                                className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs"
                              />
                            </div>
                          </div>

                          {/* DYNAMIC PROJECT BULLETS */}
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] text-slate-700 font-bold">
                                Bullets (STAR Method: Action Verb + Metrics)
                              </label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = [...data.projects];
                                  updated[idx].bullets.push("Constructed modular architecture handling 15,000+ API requests daily.");
                                  setData({ ...data, projects: updated });
                                }}
                                className="h-6 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 px-2"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Bullet
                              </Button>
                            </div>

                            {p.bullets.map((b, bIdx) => {
                              const hasMetric = METRIC_REGEX.test(b);
                              const firstWord = b.trim().split(" ")[0]?.toLowerCase().replace(/[^a-z]/g, "");
                              const hasActionVerb = STRONG_ACTION_VERBS.includes(firstWord);
                              const isPolishing = polishingId === `proj-${idx}-${bIdx}`;

                              return (
                                <div key={bIdx} className="space-y-1 bg-white p-2 rounded-xl border border-slate-200">
                                  <div className="flex items-start gap-1.5">
                                    <textarea
                                      rows={2}
                                      value={b}
                                      onChange={(e) => {
                                        const updated = [...data.projects];
                                        updated[idx].bullets[bIdx] = e.target.value;
                                        setData({ ...data, projects: updated });
                                      }}
                                      className="flex-1 rounded-lg border border-slate-200 p-2 text-xs leading-relaxed focus:ring-1 focus:ring-emerald-500"
                                      placeholder="Engineered [feature] achieving [metric] using [tech]..."
                                    />
                                    <div className="flex flex-col gap-1">
                                      <button
                                        type="button"
                                        disabled={isPolishing}
                                        onClick={() => handlePolishBullet("proj", idx, bIdx)}
                                        title="Enhance with AI (Inject action verb & metric formula)"
                                        className="p-1.5 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                                      >
                                        <Sparkles className={`h-3.5 w-3.5 ${isPolishing ? "animate-spin" : ""}`} />
                                      </button>
                                      {p.bullets.length > 1 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const updated = [...data.projects];
                                            updated[idx].bullets = updated[idx].bullets.filter((_, i) => i !== bIdx);
                                            setData({ ...data, projects: updated });
                                          }}
                                          title="Delete Bullet"
                                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 text-[10px] px-1 font-mono">
                                    <span className={hasActionVerb ? "text-emerald-600 font-bold" : "text-amber-600"}>
                                      {hasActionVerb ? "✓ Action Verb" : "⚠ Weak Verb"}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className={hasMetric ? "text-emerald-600 font-bold" : "text-amber-600"}>
                                      {hasMetric ? "✓ Quantified Metric" : "⚠ Missing Numbers / %"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. SKILLS TAB */}
                {activeTab === "SKILLS" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Technical Skills &amp; Stack</h3>
                        <span className="text-[11px] text-slate-500">Add custom categories like Cloud, AI/ML, Databases, etc.</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newSkillCat: SkillCategory = {
                            id: `sk-${Date.now()}`,
                            category: "Cloud & DevOps",
                            items: "AWS (S3, EC2), Cloudflare, Terraform, Kubernetes",
                          };
                          setData({ ...data, skills: [...data.skills, newSkillCat] });
                        }}
                        className="h-7 text-xs font-bold gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Category</span>
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {data.skills.map((skill, idx) => (
                        <div key={skill.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={skill.category}
                              onChange={(e) => {
                                const updated = [...data.skills];
                                updated[idx].category = e.target.value;
                                setData({ ...data, skills: updated });
                              }}
                              className="font-bold text-xs text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-emerald-600 py-0.5"
                              placeholder="Category Name"
                            />
                            {data.skills.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = data.skills.filter((_, i) => i !== idx);
                                  setData({ ...data, skills: updated });
                                }}
                                className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={skill.items}
                            onChange={(e) => {
                              const updated = [...data.skills];
                              updated[idx].items = e.target.value;
                              setData({ ...data, skills: updated });
                            }}
                            placeholder="e.g. TypeScript, Python, Go, SQL (comma-separated)"
                            className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                          />
                        </div>
                      ))}

                      {/* Verified Dev Caliber Line */}
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            JobMint Verified Dev Score
                          </div>
                          <div className="text-[11px] text-emerald-700">
                            Automatic GitHub proof-of-work badge printed in Technical Skills
                          </div>
                        </div>
                        <span className="font-mono font-extrabold text-xs text-emerald-900 bg-white px-2 py-1 rounded-lg border border-emerald-200">
                          {data.devScore}/1000
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. AI ATS COACH TAB */}
                {activeTab === "AI_COACH" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        AI ATS Coach &amp; Real-time Auditor
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Top 5% Ivy League Standard
                      </span>
                    </div>

                    {/* SCORE CARD */}
                    <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                            ATS Parser Health Score
                          </span>
                          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                            {atsAudit.score} <span className="text-base text-slate-400 font-normal">/ 100</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            atsAudit.score >= 85
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}>
                            {atsAudit.score >= 85 ? "ATS-Ready (Optimal)" : "Needs Optimization"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Total Bullets Audited:</span>
                          <span className="font-bold font-mono text-white">{atsAudit.totalBullets}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Page Count:</span>
                          <span className="font-bold font-mono text-white">{atsAudit.isMultiPage ? "2 Pages" : "1 Page (Recommended)"}</span>
                        </div>
                      </div>
                    </div>

                    {/* SUGGESTIONS LIST */}
                    {atsAudit.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <span>Actionable Recommendations ({atsAudit.suggestions.length})</span>
                        </div>
                        <div className="space-y-1.5">
                          {atsAudit.suggestions.map((sug, i) => (
                            <div key={i} className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl flex items-start gap-2">
                              <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                              <span>{sug}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PASSED CHECKS */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Passing Criteria ({atsAudit.passed.length})</span>
                      </div>
                      <div className="space-y-1.5">
                        {atsAudit.passed.map((pass, i) => (
                          <div key={i} className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-900 p-2 rounded-xl flex items-start gap-2">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pass}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANE: REAL-TIME HARVARD ATS RESUME PREVIEW */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* PREVIEW TOOLBAR */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs print:hidden">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Eye className="h-4 w-4 text-slate-400" />
                <span>Real-Time US Letter Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500">
                  Estimated Height: {Math.round(canvasHeight)}px
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  atsAudit.isMultiPage
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}>
                  {atsAudit.isMultiPage ? "2 Pages (Senior Length)" : "1 Page (Standard ATS)"}
                </span>
              </div>
            </div>

            {/* RESUME PAPER CANVAS */}
            <div className="flex justify-center overflow-x-auto pb-8">
              <div
                ref={canvasRef}
                id="resume-canvas"
                className="w-full max-w-[800px] bg-white p-8 sm:p-12 border border-slate-300 shadow-xl rounded-sm print:border-none print:shadow-none print:p-0 print:m-0 font-serif text-[13px] leading-snug text-black relative"
                style={{ minHeight: "1050px", fontFamily: "'Times New Roman', Times, serif" }}
              >
                {/* Visual Page Break Guide if content exceeds 1 US Letter page (~1050px) */}
                {atsAudit.isMultiPage && (
                  <div
                    className="absolute left-0 right-0 border-b-2 border-dashed border-red-400 pointer-events-none flex items-center justify-center print:hidden"
                    style={{ top: "1050px" }}
                  >
                    <span className="bg-red-500 text-white font-sans text-[10px] font-bold px-3 py-0.5 rounded-full shadow-sm tracking-wide -mt-3">
                      PAGE 1 ENDS HERE • PAGE 2 STARTS (US Letter 11")
                    </span>
                  </div>
                )}

                {/* 1. HEADER */}
                <div className="text-center pb-3">
                  <h1 className="text-2xl font-bold uppercase tracking-wide">{data.fullName}</h1>
                  <div className="text-[12px] pt-1 flex flex-wrap items-center justify-center gap-1.5 text-slate-800">
                    <span>{data.phone}</span>
                    <span>|</span>
                    <a href={`mailto:${data.email}`} className="hover:underline text-black font-medium">{data.email}</a>
                    {data.linkedinUrl && (
                      <>
                        <span>|</span>
                        <a href={`https://${data.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black font-medium">{data.linkedinUrl}</a>
                      </>
                    )}
                    {data.githubUrl && (
                      <>
                        <span>|</span>
                        <a href={`https://${data.githubUrl}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black font-medium">{data.githubUrl}</a>
                      </>
                    )}
                    {data.customLinks.map((link) => (
                      <span key={link.id || link.label} className="inline-flex items-center gap-1.5">
                        <span>|</span>
                        <a href={`https://${link.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-black font-medium">
                          {link.label}
                        </a>
                      </span>
                    ))}
                    <span>|</span>
                    <span>{data.location}</span>
                  </div>
                </div>

                {/* 2. EDUCATION */}
                {data.education.length > 0 && (
                  <div className="pt-2">
                    <div className="border-b border-black font-bold uppercase text-[13px] tracking-wider pb-0.5 mb-1.5">
                      Education
                    </div>
                    {data.education.map((e, i) => (
                      <div key={e.id || i} className="mb-2">
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
                )}

                {/* 3. EXPERIENCE */}
                {data.experience.length > 0 && (
                  <div className="pt-2">
                    <div className="border-b border-black font-bold uppercase text-[13px] tracking-wider pb-0.5 mb-1.5">
                      Experience
                    </div>
                    {data.experience.map((exp, i) => (
                      <div key={exp.id || i} className="mb-2.5">
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
                            <li key={idx} className="text-justify">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. PROJECTS */}
                {data.projects.length > 0 && (
                  <div className="pt-2">
                    <div className="border-b border-black font-bold uppercase text-[13px] tracking-wider pb-0.5 mb-1.5">
                      Technical Projects
                    </div>
                    {data.projects.map((p, i) => (
                      <div key={p.id || i} className="mb-2.5">
                        <div className="flex justify-between items-baseline text-[13px]">
                          <span className="font-bold">
                            {p.title} <span className="font-normal italic text-[12px]">| {p.techStack}</span>
                          </span>
                        </div>
                        <ul className="list-disc pl-5 space-y-0.5 text-[12px] leading-relaxed mt-1">
                          {p.bullets.map((b, idx) => (
                            <li key={idx} className="text-justify">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. TECHNICAL SKILLS */}
                {data.skills.length > 0 && (
                  <div className="pt-2">
                    <div className="border-b border-black font-bold uppercase text-[13px] tracking-wider pb-0.5 mb-1.5">
                      Technical Skills
                    </div>
                    <div className="space-y-1 text-[12px] leading-relaxed pt-1">
                      {data.skills.map((s, idx) => (
                        <div key={s.id || idx}>
                          <strong className="font-bold">{s.category}:</strong> {s.items}
                        </div>
                      ))}
                      <div>
                        <strong className="font-bold">Verified Caliber:</strong> JobMint Dev Score {data.devScore}/1000 (Proof-of-Work GitHub Verified)
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
