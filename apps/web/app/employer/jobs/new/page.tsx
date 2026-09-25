"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building,
  Sparkles,
  ArrowRight,
  Check,
  Plus,
  X,
  Clock,
  Lock,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { JobType, WorkMode, CANONICAL_SKILLS } from "@repo/shared";
import {
  openPaddleCheckout,
  PADDLE_FEATURED_JOB_PRICE_ID,
} from "@/components/paddle-provider";
import { ProUpgradeModal } from "@/components/pro-upgrade-modal";

export default function PostNewJobPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState<string>(JobType.INTERNSHIP);
  const [workMode, setWorkMode] = useState<string>(WorkMode.REMOTE);
  const [location, setLocation] = useState("Remote");
  const [salaryOrStipend, setSalaryOrStipend] = useState("₹25,000 – ₹35,000/month");
  const [experienceYears, setExperienceYears] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "TypeScript"]);
  const [skillSearch, setSkillSearch] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeaturedBoost, setIsFeaturedBoost] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdJobSlug, setCreatedJobSlug] = useState<string | null>(null);
  const [createdJobId, setCreatedJobId] = useState<string | null>(null);

  // AI Assistant State
  const [aiDraftPrompt, setAiDraftPrompt] = useState("");
  const [isDraftingAi, setIsDraftingAi] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [proModalReason, setProModalReason] = useState("");
  const [freeUsesRemaining, setFreeUsesRemaining] = useState<number | null>(null);
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          setSessionUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));

    fetch("/api/user/pro-status")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isPro) {
          setIsProUser(true);
        }
      })
      .catch(() => {});
  }, []);

  const addSkill = (skillName: string) => {
    if (!selectedSkills.includes(skillName)) {
      setSelectedSkills([...selectedSkills, skillName]);
    }
    setSkillSearch("");
  };

  const removeSkill = (skillName: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
  };

  const filteredSkills = CANONICAL_SKILLS.filter(
    (s) =>
      s.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !selectedSkills.includes(s.name)
  ).slice(0, 6);

  const handleAiDraft = async () => {
    if (!aiDraftPrompt.trim()) {
      alert("Please enter a short job title or requirements summary (e.g. 'Junior Full-Stack Engineer, React/Node, ₹12 LPA').");
      return;
    }

    setIsDraftingAi(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/ai/job-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiDraftPrompt }),
      });

      const data = await res.json();
      if (res.status === 403 && data.requiresPro) {
        setProModalReason(data.error || "You have reached your 3 free AI generations limit. Upgrade to Pro for unlimited AI job drafting.");
        setShowProModal(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI job draft");
      }

      if (data.draft) {
        const d = data.draft;
        if (d.title) setTitle(d.title);
        if (d.salaryOrStipend) setSalaryOrStipend(d.salaryOrStipend);
        if (Array.isArray(d.selectedSkills) && d.selectedSkills.length > 0) {
          setSelectedSkills(d.selectedSkills);
        }
        if (d.description) setDescription(d.description);
        if (d.responsibilities) setResponsibilities(d.responsibilities);
        if (d.requirements) {
          const reqsWithInterview = d.interviewExpectations
            ? `${d.requirements}\n\nTechnical Interview & Hiring Expectations:\n${d.interviewExpectations}`
            : d.requirements;
          setRequirements(reqsWithInterview);
        }
      }

      if (data.quota) {
        setIsProUser(data.quota.isPro);
        setFreeUsesRemaining(data.quota.remaining);
      }
    } catch (err: any) {
      alert(err.message || "Failed to draft job with AI");
    } finally {
      setIsDraftingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/employer/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          jobType,
          workMode,
          location,
          salaryOrStipend,
          experienceYears: Number(experienceYears),
          selectedSkills,
          description,
          responsibilities,
          requirements,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create job posting");
      }

      const newJobId = data.job?.id || null;
      setCreatedJobSlug(data.job?.slug || null);
      setCreatedJobId(newJobId);
      setIsSubmitted(true);

      if (isFeaturedBoost && newJobId) {
        setTimeout(() => {
          openPaddleCheckout({
            priceId: PADDLE_FEATURED_JOB_PRICE_ID,
            jobId: newJobId,
            plan: "featured_job",
            userEmail: sessionUser?.email,
          });
        }, 500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center text-sm font-mono text-slate-500">
        Verifying recruiter authorization...
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-sm">
          <Building className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
            Employer Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Sign In to Post Opportunities</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Posting an opportunity on Role Nest creates a verifiable company record with Truth Teller transparency. Please sign in to verify your identity.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <Link href="/login?callbackUrl=/employer/jobs/new">
            <Button size="lg" className="w-full font-bold bg-emerald-600 hover:bg-emerald-500">
              Sign In to Continue
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full text-xs">
              Return to Job Board
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 font-sans">
        <div className="mb-6">
          <Link href="/" className="text-xs text-slate-500 hover:text-emerald-600">
            ← Back to Platform
          </Link>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 bg-slate-50/50 border-b border-slate-100 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Transparent Posting
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md w-fit">
                <Building className="h-3.5 w-3.5 text-blue-600" /> Verified Company Shield
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md w-fit">
                <Clock className="h-3.5 w-3.5 text-indigo-600" /> 7-Day Ghosting Guarantee
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 pt-1">
              Post an Opportunity on Role Nest
            </CardTitle>
            <CardDescription>
              Reach thousands of ambitious students and freshers. Verified corporate postings receive 3.4x more high-fit applicants.
            </CardDescription>
          </CardHeader>

          {isSubmitted ? (
            <CardContent className="py-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Opportunity Posted Successfully!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your posting for <strong>{title}</strong> is now active in PostgreSQL. Candidates with matching verified skills are being notified.
              </p>

              {createdJobId && (
                <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/70 max-w-md mx-auto text-left space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      Boost Listing with 30-Day Featured Placement
                    </div>
                    <span className="text-xs font-black text-amber-900">₹1,499</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Pin your opening to the top of all search results, get a gold badge, and reach 5x more verified applicants.
                  </p>
                  <Button
                    onClick={() =>
                      openPaddleCheckout({
                        priceId: PADDLE_FEATURED_JOB_PRICE_ID,
                        jobId: createdJobId,
                        plan: "featured_job",
                        userEmail: sessionUser?.email,
                      })
                    }
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                  >
                    Pin to Top of Search — ₹1,499 ($19.00)
                  </Button>
                </div>
              )}

              <div className="pt-4 flex justify-center gap-3">
                <Link href={createdJobSlug ? `/jobs/${createdJobSlug}` : "/jobs"}>
                  <Button variant="default">View Live Job Board Listing</Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setTitle("");
                    setCreatedJobSlug(null);
                    setCreatedJobId(null);
                    setIsFeaturedBoost(false);
                  }}
                >
                  Post Another Job
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 p-6 sm:p-8">
                {/* FEATURE 3: AI JOB DESCRIPTION ASSISTANT FOR EMPLOYERS */}
                <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-white p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                          AI Job Description Assistant
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Enter role &amp; tech stack — AI drafts full responsibilities, checklist, and interview expectations in 3 seconds.
                        </p>
                      </div>
                    </div>

                    {isProUser ? (
                      <span className="rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[10px] font-bold px-2 py-0.5 font-mono">
                        PRO UNLIMITED
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {freeUsesRemaining !== null ? `${freeUsesRemaining}/3 Free Tries` : "3 Free Tries"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <Input
                      type="text"
                      placeholder="e.g. Junior Full-Stack Engineer, React/Node, ₹12 LPA"
                      value={aiDraftPrompt}
                      onChange={(e) => setAiDraftPrompt(e.target.value)}
                      className="bg-white border-slate-300 text-xs text-slate-900 h-10"
                    />
                    <Button
                      type="button"
                      onClick={handleAiDraft}
                      disabled={isDraftingAi}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 h-10 px-4 rounded-xl shadow-sm flex items-center gap-1.5 min-h-[40px]"
                    >
                      {isDraftingAi ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Drafting (3s)...
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" /> AI Draft Spec (3s)
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Quick template suggestions */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Quick Prompts:</span>
                    {[
                      "Junior Full-Stack Engineer, React/Node, ₹12 LPA",
                      "Backend Engineer, Go/Rust/PostgreSQL, ₹18 LPA",
                      "AI/ML Engineer, PyTorch/Next.js/RAG, ₹20 LPA",
                    ].map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setAiDraftPrompt(example)}
                        className="rounded-lg bg-white border border-slate-200 hover:border-indigo-400 px-2.5 py-1 text-[10px] text-slate-600 hover:text-indigo-700 transition-colors"
                      >
                        {example.split(",")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TITLE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Opportunity Title
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Frontend Developer Intern, Junior AI Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* TYPE & WORK MODE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Opportunity Type
                    </label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value={JobType.INTERNSHIP}>Internship</option>
                      <option value={JobType.FULL_TIME}>Full-Time (Fresher Entry Level)</option>
                      <option value={JobType.CONTRACT}>Contract / Project</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Work Mode
                    </label>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value={WorkMode.REMOTE}>Remote</option>
                      <option value={WorkMode.HYBRID}>Hybrid</option>
                      <option value={WorkMode.ON_SITE}>On-Site</option>
                    </select>
                  </div>
                </div>

                {/* LOCATION & STIPEND */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Location
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. Remote or Bangalore, India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Stipend / Salary Range (Transparent)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. ₹30,000/mo or ₹8-12 LPA"
                      value={salaryOrStipend}
                      onChange={(e) => setSalaryOrStipend(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* EXPERIENCE YEARS */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Required Years of Experience
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={0}>0 Years (Fresher / College Students / Interns)</option>
                    <option value={1}>1 Year (Early Career)</option>
                    <option value={2}>2 Years</option>
                    <option value={3}>3+ Years</option>
                  </select>
                </div>

                {/* SKILLS MULTI-SELECT */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Required Tech Stack &amp; Skills
                  </label>

                  <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search to add skills (e.g. Next.js, Docker, PyTorch)..."
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                    />
                    {skillSearch && filteredSkills.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
                        {filteredSkills.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => addSkill(s.name)}
                            className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                          >
                            <span>{s.name}</span>
                            <Plus className="h-3.5 w-3.5 text-emerald-600" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Role Description &amp; About the Team
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your engineering team, culture, and high-impact mission..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* RESPONSIBILITIES */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Key Responsibilities
                  </label>
                  <textarea
                    rows={4}
                    placeholder="• Build and maintain customer-facing web apps&#10;• Write performant TypeScript code&#10;• Collaborate directly with senior architects"
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* REQUIREMENTS & INTERVIEW EXPECTATIONS */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Qualifications Checklist &amp; Interview Expectations
                  </label>
                  <textarea
                    rows={4}
                    placeholder="• Experience with React, Node.js, and SQL&#10;• Active GitHub proof-of-work or projects&#10;• Hiring process: 1 live coding challenge + culture fit"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* FEATURED BOOST TOGGLE */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="featured-boost"
                    checked={isFeaturedBoost}
                    onChange={(e) => setIsFeaturedBoost(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="featured-boost" className="text-xs space-y-0.5 cursor-pointer">
                    <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      Feature this Job on Role Nest (+₹1,499)
                    </span>
                    <span className="text-slate-600 block">
                      Pin to the top of all candidate searches, get a highlighted gold badge, and reach 5x more verified applicants.
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white min-h-[46px] rounded-xl shadow-md"
                >
                  {isSubmitting ? "Publishing Opportunity..." : "Publish Opportunity (Zero-Ghosting)"}
                </Button>
              </CardContent>
            </form>
          )}
        </Card>
      </div>

      {/* PRO UPGRADE MODAL */}
      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        reason={proModalReason}
      />
    </>
  );
}
