"use client";

import { useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  Mail,
  Phone,
  Linkedin,
  Github,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
} from "lucide-react";
import { matchCanonicalSkill } from "@repo/shared";

interface ParsedResumeData {
  candidateName: string;
  email: string | null;
  phone: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  detectedSkills: string[];
  educationSnippet: string | null;
  projectsSnippet: string | null;
  charCount: number;
}

const SAMPLE_RESUME_TEXT = `Divyanshu Sharma
Email: divyanshu.dev@gmail.com | Phone: +91 9876543210
GitHub: https://github.com/divyanshu-dev | LinkedIn: https://linkedin.com/in/divyanshu-sharma

EDUCATION
B.Tech in Computer Science & Engineering (2022 - 2026)
ABC Institute of Technology, CGPA: 8.7/10

TECHNICAL SKILLS
Languages & Frameworks: React, Next.js, TypeScript, JavaScript, Node.js, Python, Tailwind CSS, HTML5, CSS3
Databases & Cloud: PostgreSQL, SQLite, Cloudflare R2, Docker, Git, REST APIs

PROJECTS
1. JobMint Portal (React, Next.js, TypeScript, PostgreSQL)
- Developed an open-source recruitment platform with deterministic matching algorithms.
- Built responsive mobile & web interfaces adhering to WCAG accessibility guidelines.
- Integrated Cloudflare R2 presigned URLs for zero-egress document storage.

2. AI Text Summarizer (Python, PyTorch, FastAPI)
- Built an extractive text summarizer serving real-time requests with sub-100ms latency.
`;

export function ResumePdfParser() {
  const [inputText, setInputText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [appliedToProfile, setAppliedToProfile] = useState(false);

  const parseRawText = (text: string) => {
    setParsing(true);
    setTimeout(() => {
      // 1. Email Extraction
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      const email = emailMatch ? emailMatch[0] : null;

      // 2. Phone Extraction
      const phoneMatch = text.match(/(?:\+91[\s-]?)?[6789]\d{9}|\+?\d{1,3}[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
      const phone = phoneMatch ? phoneMatch[0] : null;

      // 3. GitHub & LinkedIn URLs
      const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/);
      const githubUrl = githubMatch ? `https://${githubMatch[0]}` : null;

      const linkedinMatch = text.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/);
      const linkedinUrl = linkedinMatch ? `https://${linkedinMatch[0]}` : null;

      // 4. Candidate Name (Guess from first non-empty line)
      const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
      const candidateName = lines[0] ? lines[0].replace(/^(resume|curriculum vitae|cv)\s*:?\s*/i, "") : "Candidate";

      // 5. Skills extraction against Canonical Skills Taxonomy
      const detectedSkillsSet = new Set<string>();
      const words = text.split(/[\s,;|/()•\-]+/).map((w) => w.trim());

      // Check single words and 2-word combinations (e.g. Tailwind CSS, Next.js)
      for (let i = 0; i < words.length; i++) {
        const single = matchCanonicalSkill(words[i]);
        if (single) detectedSkillsSet.add(single.name);

        if (i < words.length - 1) {
          const double = matchCanonicalSkill(`${words[i]} ${words[i + 1]}`);
          if (double) detectedSkillsSet.add(double.name);
        }
      }

      // 6. Education snippet
      const educationIdx = text.search(/education|academics|degree|b\.?tech|b\.?e/i);
      let educationSnippet: string | null = null;
      if (educationIdx !== -1) {
        educationSnippet = text.substring(educationIdx, educationIdx + 150).split("\n").slice(0, 3).join(" • ");
      }

      // 7. Projects snippet
      const projectsIdx = text.search(/projects|personal projects|technical projects/i);
      let projectsSnippet: string | null = null;
      if (projectsIdx !== -1) {
        projectsSnippet = text.substring(projectsIdx, projectsIdx + 200).split("\n").slice(1, 4).join(" \n ");
      }

      setParsedData({
        candidateName,
        email,
        phone,
        githubUrl,
        linkedinUrl,
        detectedSkills: Array.from(detectedSkillsSet),
        educationSnippet,
        projectsSnippet,
        charCount: text.length,
      });

      setParsing(false);
    }, 200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read as plain text or binary text stream
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      parseRawText(content);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_RESUME_TEXT);
    parseRawText(SAMPLE_RESUME_TEXT);
  };

  const handleApplyToProfile = () => {
    setAppliedToProfile(true);
    setTimeout(() => setAppliedToProfile(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Zero Cost Alert */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex items-start gap-3 text-sm text-emerald-200">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-300">100% Client-Side & Private: </span>
          Resume parsing runs locally in your browser via Web FileReader. Your personal contact info and resume never hit a remote parser or incur server LLM costs.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload / Paste Area */}
        <div className="space-y-4 bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Upload or Paste Resume</h3>
            <button
              onClick={handleLoadSample}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
            >
              Load Sample Resume
            </button>
          </div>

          {/* File input drag drop container */}
          <label className="border-2 border-dashed border-neutral-700 hover:border-emerald-500/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-950/50">
            <Upload className="w-8 h-8 text-neutral-400 mb-2" />
            <span className="text-xs font-semibold text-neutral-200">
              Select Resume File (.txt, .md, or text PDF)
            </span>
            <span className="text-[11px] text-neutral-500 mt-1">Processed 100% in your browser</span>
            <input
              type="file"
              accept=".txt,.md,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
            <div className="flex-1 border-t border-neutral-800" />
            <span>OR PASTE RAW TEXT</span>
            <div className="flex-1 border-t border-neutral-800" />
          </div>

          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw resume text here..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
          />

          <button
            onClick={() => parseRawText(inputText)}
            disabled={parsing || !inputText.trim()}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-lg shadow-emerald-500/10"
          >
            {parsing ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                <span>Extracting Skills & Info...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract Info & Match Skills</span>
              </>
            )}
          </button>
        </div>

        {/* Results Column */}
        <div className="space-y-4 bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-semibold text-white">Extracted Candidate Data</h3>
              {parsedData && (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  {parsedData.detectedSkills.length} Skills Matched
                </span>
              )}
            </div>

            {parsedData ? (
              <div className="mt-4 space-y-4 text-xs font-mono">
                {/* Contact details */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
                  <div className="text-sm font-bold text-white font-sans">
                    {parsedData.candidateName}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300 pt-1">
                    {parsedData.email && (
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{parsedData.email}</span>
                      </div>
                    )}
                    {parsedData.phone && (
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{parsedData.phone}</span>
                      </div>
                    )}
                    {parsedData.githubUrl && (
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Github className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span className="truncate">{parsedData.githubUrl.replace("https://", "")}</span>
                      </div>
                    )}
                    {parsedData.linkedinUrl && (
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{parsedData.linkedinUrl.replace("https://", "")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detected canonical skills */}
                <div className="space-y-2">
                  <div className="text-neutral-400 text-[11px] uppercase tracking-wider font-semibold font-sans">
                    Canonical Skills Detected ({parsedData.detectedSkills.length}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.detectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education snippet */}
                {parsedData.educationSnippet && (
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-1">
                    <div className="text-neutral-400 flex items-center gap-1.5 font-sans font-semibold text-[11px]">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      Detected Education
                    </div>
                    <p className="text-neutral-300 line-clamp-2 text-[11px]">
                      {parsedData.educationSnippet}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-neutral-500 text-xs flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-neutral-700 mb-2" />
                <p>Upload a resume file or load a sample to inspect extracted skills.</p>
              </div>
            )}
          </div>

          {parsedData && (
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
              <button
                onClick={handleApplyToProfile}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                {appliedToProfile ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Applied to Candidate Profile!</span>
                  </>
                ) : (
                  <>
                    <span>Auto-Fill My Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}