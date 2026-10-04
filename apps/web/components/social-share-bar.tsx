"use client";

import { useState } from "react";
import { Share2, Check, Copy, MessageCircle, Linkedin, Twitter } from "lucide-react";
import { Button } from "./ui/button";

interface SocialShareBarProps {
  title: string;
  companyName?: string;
  salaryOrStipend?: string;
  url?: string;
  type?: "job" | "internship" | "potd" | "general";
  className?: string;
}

export function SocialShareBar({
  title,
  companyName,
  salaryOrStipend,
  url,
  type = "job",
  className = "",
}: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined"
    ? url || window.location.href.split("?")[0]
    : url || "https://rolenest.in";

  const getShareText = () => {
    if (type === "potd") {
      return `⚡ Just solved today's coding challenge "${title}" on Role Nest! Test your problem solving skills here:`;
    }
    const compText = companyName ? ` at ${companyName}` : "";
    const salText = salaryOrStipend ? ` (${salaryOrStipend})` : "";
    return `🔥 Found a verified ${title}${compText}${salText} with direct ATS application on Role Nest:`;
  };

  const handleCopyLink = () => {
    const fullUrl = `${shareUrl}?ref=share_copy`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`${getShareText()} ${shareUrl}?ref=share_wa`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const fullUrl = encodeURIComponent(`${shareUrl}?ref=share_li`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${fullUrl}`, "_blank", "noopener,noreferrer");
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const fullUrl = encodeURIComponent(`${shareUrl}?ref=share_x`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${fullUrl}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mr-1">
        <Share2 className="h-3.5 w-3.5 text-slate-400" /> Share opening:
      </span>

      {/* WhatsApp Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={shareOnWhatsApp}
        className="h-8 px-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200/80 gap-1.5 shadow-2xs"
        title="Share to WhatsApp groups or contacts"
      >
        <MessageCircle className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
        <span>WhatsApp</span>
      </Button>

      {/* LinkedIn Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={shareOnLinkedIn}
        className="h-8 px-2.5 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border-blue-200/80 gap-1.5 shadow-2xs"
        title="Share to LinkedIn feed or message"
      >
        <Linkedin className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
        <span>LinkedIn</span>
      </Button>

      {/* X / Twitter Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="h-8 px-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-200 gap-1.5 shadow-2xs"
        title="Post to X / Twitter"
      >
        <Twitter className="h-3.5 w-3.5 text-slate-700 fill-slate-700" />
        <span>X</span>
      </Button>

      {/* Copy Link Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="h-8 px-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border-slate-200 gap-1.5 shadow-2xs"
        title="Copy referral link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-emerald-700">Link Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            <span>Copy Link</span>
          </>
        )}
      </Button>
    </div>
  );
}
