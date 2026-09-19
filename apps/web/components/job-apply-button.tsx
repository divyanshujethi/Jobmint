"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ApplyModal } from "./apply-modal";

interface JobApplyButtonProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function JobApplyButton({
  jobId,
  jobTitle,
  companyName,
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
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
