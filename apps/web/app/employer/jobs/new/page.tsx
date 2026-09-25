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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { JobType, WorkMode, CANONICAL_SKILLS } from "@repo/shared";
import {
  openPaddleCheckout,
  PADDLE_FEATURED_JOB_PRICE_ID,
} from "@/components/paddle-provider";

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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/" className="text-xs text-slate-500 hover:text-emerald-600">
          ← Back to Platform
        </Link>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
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
          <CardTitle className="text-2xl font-bold text-slate-900">
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
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
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
            <CardContent className="space-y-6">
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
                    placeholder="e.g. ₹25,000 – ₹35,000/month or ₹8-12 LPA"
                    value={salaryOrStipend}
                    onChange={(e) => setSalaryOrStipend(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* SKILLS SELECTOR (CANONICAL TAXONOMY) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Required Skills (Canonical Taxonomy)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Enables deterministic candidate matching
                  </span>
                </div>

                {/* Selected chips */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg border border-slate-200 bg-slate-50/50">
                  {selectedSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedSkills.length === 0 && (
                    <span className="text-xs text-slate-400">No skills selected yet.</span>
                  )}
                </div>

                {/* Search & Suggestions */}
                <div className="relative pt-1">
                  <Input
                    type="text"
                    placeholder="Type to search skill (e.g. React, PyTorch, Docker)..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                  />
                  {skillSearch && filteredSkills.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                      {filteredSkills.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => addSkill(s.name)}
                          className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-md flex items-center justify-between"
                        >
                          <span>{s.name}</span>
                          <span className="text-[10px] text-slate-400">{s.category}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* DESCRIPTION & RESPONSIBILITIES */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Role Description
                </label>
                <textarea
                  className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[90px]"
                  placeholder="Describe the opportunity, the team culture, and what problems the intern will work on..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Key Requirements (One per line)
                </label>
                <textarea
                  className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[80px]"
                  placeholder="e.g.&#10;Proficiency with React and modern JavaScript&#10;Prior personal or academic software projects&#10;Good communication skills"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  required
                />
              </div>

              {/* TRANSPARENCY PLEDGE BANNER */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Truth Teller Employer Acknowledgment
                </div>
                <p className="text-emerald-800">
                  Role Nest displays your company&apos;s real review rate and median response time. Unreviewed applications after 7 days will be flagged to candidates with similar recommendations.
                </p>
              </div>

              {/* FEATURED BOOST PROMOTION */}
              <div
                onClick={() => setIsFeaturedBoost(!isFeaturedBoost)}
                className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                  isFeaturedBoost
                    ? "border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isFeaturedBoost}
                      onChange={(e) => setIsFeaturedBoost(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          Promote with 30-Day Featured Placement Boost
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pin to the top of all search results, get a gold badge, and reach 5x more verified applicants.
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-slate-900">₹1,499</div>
                    <div className="text-[10px] text-slate-400">($19.00 USD)</div>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full font-bold">
                {isSubmitting
                  ? "Publishing to PostgreSQL..."
                  : isFeaturedBoost
                    ? "Publish & Launch Paddle Checkout (₹1,499)"
                    : "Publish Opportunity"}
              </Button>
            </CardContent>
          </form>
        )}
      </Card>
    </div>
  );
}
