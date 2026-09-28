"use client";

import { useState } from "react";
import {
  Sparkles,
  SlidersHorizontal,
  Plus,
  X,
  Check,
  RotateCcw,
  Zap,
  Briefcase,
  MapPin,
  GraduationCap,
} from "lucide-react";
import {
  CandidateIntelProfile,
  POPULAR_SKILLS,
  STACK_PRESETS,
  ROLE_OPTIONS,
  DEFAULT_INTEL_PROFILE,
  saveCandidateIntel,
} from "@/lib/candidate-intelligence";
import { Button } from "./ui/button";

interface CandidateIntelBarProps {
  profile: CandidateIntelProfile;
  onChange: (updated: CandidateIntelProfile) => void;
  totalMatchedRoles: number;
}

export function CandidateIntelBar({
  profile,
  onChange,
  totalMatchedRoles,
}: CandidateIntelBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState("");

  const updateProfile = (partial: Partial<CandidateIntelProfile>) => {
    const updated = { ...profile, ...partial };
    onChange(updated);
    saveCandidateIntel(updated);
  };

  const addSkill = (skillName: string) => {
    const clean = skillName.trim();
    if (!clean) return;
    if (profile.skills.some((s) => s.toLowerCase() === clean.toLowerCase())) return;
    const updated = { ...profile, skills: [...profile.skills, clean] };
    onChange(updated);
    saveCandidateIntel(updated);
    setCustomSkillInput("");
  };

  const removeSkill = (skillName: string) => {
    const updated = {
      ...profile,
      skills: profile.skills.filter((s) => s.toLowerCase() !== skillName.toLowerCase()),
    };
    onChange(updated);
    saveCandidateIntel(updated);
  };

  const resetToDefault = () => {
    onChange(DEFAULT_INTEL_PROFILE);
    saveCandidateIntel(DEFAULT_INTEL_PROFILE);
  };

  const applyPreset = (preset: (typeof STACK_PRESETS)[0]) => {
    const updated: CandidateIntelProfile = {
      ...profile,
      skills: preset.skills,
      targetRole: preset.role,
    };
    onChange(updated);
    saveCandidateIntel(updated);
  };

  // Common skills to suggest that aren't already added
  const suggestions = POPULAR_SKILLS.filter(
    (s) => !profile.skills.some((p) => p.toLowerCase() === s.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 p-3.5 sm:p-4 shadow-xs">
      {/* Top Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-emerald-100/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <Zap className="h-4 w-4 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                AI Candidate Match Intelligence
              </span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.2 text-[10px] font-mono font-bold">
                Live Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Personalizing scores and top recommendations based on your tech stack.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-8 gap-1.5 rounded-xl border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold shadow-2xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-700" />
            <span>Tune AI Profile</span>
          </Button>

          <button
            type="button"
            onClick={resetToDefault}
            title="Reset to recommended defaults"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Active Skills Chips */}
      <div className="pt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
          Your Skills:
        </span>

        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-lg bg-white border border-emerald-200 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-2xs group hover:border-rose-300 transition-colors"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-slate-400 hover:text-rose-600 transition-colors"
              title={`Remove ${skill}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Quick add suggestions */}
        {suggestions.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => addSkill(skill)}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50/70 border border-dashed border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/70 px-2 py-1 text-[11px] font-semibold text-emerald-800 transition-all cursor-pointer"
          >
            <Plus className="h-2.5 w-2.5" />
            <span>{skill}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline ml-1 cursor-pointer"
        >
          + More Skills
        </button>
      </div>

      {/* Target Parameters Summary */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-100/60 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
          <Briefcase className="h-3 w-3 text-emerald-600" />
          Target: {profile.targetRole}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
          <GraduationCap className="h-3 w-3 text-emerald-600" />
          Exp: {profile.experienceLevel === "FRESHER" ? "Fresher (0 YOE)" : `${profile.experienceLevel} Years`}
        </span>
        {profile.workMode !== "ALL" && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
            Mode: {profile.workMode}
          </span>
        )}
        <span className="text-emerald-800 font-bold ml-auto">
          ⚡ {totalMatchedRoles} roles aligned with your profile
        </span>
      </div>

      {/* TUNE AI PREFERENCES MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-600 fill-emerald-600" />
                  Customize Candidate Match Intelligence
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The matching engine will recalculate real-time scores for all 500+ tech roles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick 1-Click Stack Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                1-Click Stack Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STACK_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all group"
                  >
                    <span className="text-base">{preset.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {preset.skills.slice(0, 3).join(", ")}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Skills & Custom Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Your Skills ({profile.skills.length})
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[44px] p-2.5 rounded-xl border border-slate-200 bg-slate-50/50">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-bold shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-emerald-100 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Skill Form */}
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a skill (e.g. Next.js, Django, Rust)..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(customSkillInput);
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs focus:border-emerald-500 focus:outline-none"
                />
                <Button
                  size="sm"
                  type="button"
                  onClick={() => addSkill(customSkillInput)}
                  className="h-8 text-xs font-bold bg-emerald-600 text-white"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              {/* All Popular Skills Cloud */}
              <div className="mt-2.5">
                <span className="text-[11px] font-semibold text-slate-500">Popular Tech:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {POPULAR_SKILLS.map((skill) => {
                    const isSelected = profile.skills.some(
                      (s) => s.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => (isSelected ? removeSkill(skill) : addSkill(skill))}
                        className={`rounded-lg px-2 py-1 text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                        }`}
                      >
                        {skill} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Target Role & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Target Role
                </label>
                <select
                  value={profile.targetRole}
                  onChange={(e) => updateProfile({ targetRole: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Experience Level
                </label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) =>
                    updateProfile({
                      experienceLevel: e.target.value as CandidateIntelProfile["experienceLevel"],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                >
                  <option value="FRESHER">Fresher / 0 Years (Entry Level)</option>
                  <option value="1-2">1–2 Years Experience</option>
                  <option value="3-5">3–5 Years Experience</option>
                  <option value="5+">5+ Years Senior</option>
                  <option value="ALL">Any Experience</option>
                </select>
              </div>
            </div>

            {/* Work Mode & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Preferred Work Mode
                </label>
                <select
                  value={profile.workMode}
                  onChange={(e) =>
                    updateProfile({
                      workMode: e.target.value as CandidateIntelProfile["workMode"],
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                >
                  <option value="ALL">Any Work Mode</option>
                  <option value="REMOTE">Remote Only</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On-Site (Office)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Preferred City / Region
                </label>
                <select
                  value={profile.location}
                  onChange={(e) => updateProfile({ location: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
                >
                  <option value="ALL">All India & Remote</option>
                  <option value="bengaluru">Bengaluru / Bangalore</option>
                  <option value="tricity">Chandigarh / Tricity (Mohali/Panchkula)</option>
                  <option value="delhi_ncr">Delhi NCR (Noida/Gurgaon)</option>
                  <option value="dehradun">Dehradun</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="pune">Pune</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="remote">Remote Worldwide</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={resetToDefault}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Reset to Defaults
              </button>

              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Apply &amp; Recalculate Matches &rarr;
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
