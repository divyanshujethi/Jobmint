"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { WorkMode } from "@repo/shared";

const POPULAR_SKILLS = [
  "React", "TypeScript", "Next.js", "Python", "Node.js", "PyTorch",
  "Tailwind CSS", "PostgreSQL", "SQL", "Machine Learning", "Git", "Docker"
];

export default function CandidateOnboardingPage() {
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "TypeScript"]);
  const [workModes, setWorkModes] = useState<string[]>([WorkMode.REMOTE]);
  const [isFresher, setIsFresher] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleWorkMode = (mode: string) => {
    if (workModes.includes(mode)) {
      if (workModes.length > 1) setWorkModes(workModes.filter((m) => m !== mode));
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Step 1 of 1: Quick Profile
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Set Up Your Candidate Profile
          </CardTitle>
          <CardDescription>
            This enables Role Nest to calculate your exact match % and provide personalized job recommendations.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleComplete}>
          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Professional Headline
              </label>
              <Input
                type="text"
                placeholder="e.g. 3rd Year CS Student • Full Stack & AI Enthusiast"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Current Location
              </label>
              <Input
                type="text"
                placeholder="e.g. Bangalore, Delhi, Mumbai, or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {/* EXPERIENCE LEVEL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Experience Status
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsFresher(true)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-all ${
                    isFresher
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Student / Fresher (0 years)
                </button>
                <button
                  type="button"
                  onClick={() => setIsFresher(false)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-all ${
                    !isFresher
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  1–2 Years Experience
                </button>
              </div>
            </div>

            {/* WORK MODES */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Preferred Work Modes
              </label>
              <div className="flex flex-wrap gap-2">
                {[WorkMode.REMOTE, WorkMode.HYBRID, WorkMode.ON_SITE].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => toggleWorkMode(mode)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                      workModes.includes(mode)
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {mode.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* TOP SKILLS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Select Your Skills ({selectedSkills.length} selected)
                </label>
                <span className="text-[11px] text-slate-400">Tap to toggle</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full font-bold gap-2" disabled={isSaved}>
              {isSaved ? (
                <>
                  <Check className="h-5 w-5" /> Profile Saved! Redirecting...
                </>
              ) : (
                <>
                  Save & Explore Matched Jobs <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
