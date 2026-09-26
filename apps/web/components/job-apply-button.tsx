"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ApplyModal } from "./apply-modal";
import { ExternalLink, ShieldCheck, Check, BookmarkCheck } from "lucide-react";

interface JobApplyButtonProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  requiredSkills?: string[];
  jobDescription?: string;
  source?: string;
  sourceUrl?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function JobApplyButton({
  jobId,
  jobTitle,
  companyName,
  requiredSkills,
  jobDescription,
  source,
  sourceUrl,
  size = "lg",
  className,
}: JobApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTracked, setIsTracked] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // If this is an external verified role with official career link (e.g. Razorpay, Swiggy, Google)
  if (sourceUrl) {
    const handleTrackApplication = async () => {
      setIsTracking(true);
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId,
            coverNote: `Applied via official company portal: ${sourceUrl}`,
          }),
        });
        if (res.ok) {
          setIsTracked(true);
        }
      } catch (e) {
        console.error("Error logging application tracking:", e);
      } finally {
        setIsTracking(false);
      }
    };

    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-2.5 shadow-md shadow-emerald-600/20 transition-all text-center"
        >
          <span>Apply on Official Site</span>
          <ExternalLink className="h-4 w-4" />
        </a>

        {isTracked ? (
          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            Tracked in Dashboard
          </span>
        ) : (
          <button
            type="button"
            onClick={handleTrackApplication}
            disabled={isTracking}
            title="Log this external application in your Role Nest Truth Teller dashboard"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <BookmarkCheck className="h-3.5 w-3.5 text-slate-500" />
            {isTracking ? "Logging..." : "Track with Truth Teller"}
          </button>
        )}
      </div>
    );
  }

  // Direct employer posting on Role Nest
  return (
    <>
      <Button
        size={size}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        Apply on Role Nest
      </Button>

      <ApplyModal
        jobId={jobId}
        jobTitle={jobTitle}
        companyName={companyName}
        requiredSkills={requiredSkills}
        jobDescription={jobDescription}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
