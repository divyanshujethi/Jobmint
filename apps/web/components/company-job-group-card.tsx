"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sparkles,
  Briefcase,
  Zap,
  ExternalLink,
} from "lucide-react";
import { CompanyJobGroup } from "@/lib/candidate-intelligence";
import { JobCard } from "./job-card";
import { Button } from "./ui/button";

interface CompanyJobGroupCardProps {
  group: CompanyJobGroup;
  defaultExpanded?: boolean;
}

export function CompanyJobGroupCard({
  group,
  defaultExpanded = false,
}: CompanyJobGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:border-slate-300 overflow-hidden">
      {/* COMPANY HEADER ACCORDION TRIGGER */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/50 via-white to-white hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Company Avatar / Logo */}
          {group.companyLogoUrl && !imageError ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 border border-slate-200 shadow-2xs overflow-hidden">
              <img
                src={group.companyLogoUrl}
                alt={`${group.companyName} logo`}
                className="h-full w-full object-contain rounded-lg"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900 text-lg font-extrabold border border-emerald-200">
              {group.companyLogoInitial}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {group.companyName}
              </h3>
              {group.isVerified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Verified Employer
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-extrabold">
                <Briefcase className="h-3 w-3 text-slate-500" />
                {group.totalRoles} Open {group.totalRoles === 1 ? "Role" : "Roles"}
              </span>
              {group.highestMatch > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 text-xs font-extrabold">
                  <Zap className="h-3 w-3 fill-amber-500 text-amber-500" />
                  Up to {group.highestMatch}% Match
                </span>
              )}
            </div>

            {/* Subtitle with locations and tech stack */}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                {group.locations.slice(0, 3).join(", ") || "Remote & India"}
              </span>
              <span>•</span>
              <span className="text-slate-600 font-medium">
                Hiring: {group.uniqueSkills.slice(0, 5).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Toggle Button */}
        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="h-8 gap-1.5 rounded-xl border-slate-300 text-xs font-bold"
          >
            <span>{isExpanded ? "Collapse Roles" : `View ${group.totalRoles} Roles`}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </Button>
        </div>
      </div>

      {/* EXPANDED ROLES LIST */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-3 sm:p-4 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              All current active positions at <strong>{group.companyName}</strong>:
            </span>
            <Link
              href={`/companies/${group.companySlug}`}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 underline"
            >
              Company Profile &amp; Insights &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {group.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
