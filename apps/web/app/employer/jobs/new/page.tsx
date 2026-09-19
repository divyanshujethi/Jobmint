"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { JobType, WorkMode, CANONICAL_SKILLS } from "@repo/shared";

export default function PostNewJobPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/" className="text-xs text-slate-500 hover:text-emerald-600">
          ← Back to Platform
        </Link>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Transparent Posting
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Post an Opportunity on JobMint
          </CardTitle>
          <CardDescription>
            Reach thousands of ambitious students and freshers. No spam, no ghosting.
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
              Your posting for <strong>{title}</strong> is now active. Candidates with matching verified skills are being notified.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/jobs">
                <Button variant="default">View on Job Board</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setTitle("");
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
                  JobMint displays your company&apos;s real review rate and median response time. Unreviewed applications after 7 days will be flagged to candidates with similar recommendations.
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full font-bold">
                Publish Opportunity
              </Button>
            </CardContent>
          </form>
        )}
      </Card>
    </div>
  );
}
