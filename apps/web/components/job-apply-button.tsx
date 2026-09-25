"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ApplyModal } from "./apply-modal";

interface JobApplyButtonProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  requiredSkills?: string[];
  jobDescription?: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function JobApplyButton({
  jobId,
  jobTitle,
  companyName,
  requiredSkills,
  jobDescription,
  size = "lg",
  className,
}: JobApplyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size={size}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        Apply Now
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
