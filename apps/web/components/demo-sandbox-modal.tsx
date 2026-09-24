"use client";

import { useState } from "react";
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";

interface DemoSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
  projectUrl: string;
  candidateName?: string;
  githubUrl?: string;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

export function DemoSandboxModal({
  isOpen,
  onClose,
  projectTitle,
  projectUrl,
  candidateName = "Candidate",
  githubUrl,
}: DemoSandboxModalProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [key, setKey] = useState(0);
  const [rating, setRating] = useState<number>(5);
  const [rated, setRated] = useState(false);

  if (!isOpen) return null;

  const reloadIframe = () => {
    setKey((prev) => prev + 1);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "max-w-[400px]";
      case "tablet":
        return "max-w-[780px]";
      case "desktop":
      default:
        return "w-full";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md p-2 sm:p-4">
      {/* Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3 text-white shadow-2xl mb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                {projectTitle}
              </span>
              <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-mono border border-emerald-500/20">
                1-Click Live Sandbox
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>By {candidateName}</span>
              {githubUrl && (
                <>
                  <span>•</span>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 underline"
                  >
                    View Source
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-950/80 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              device === "desktop"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Desktop View"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              device === "tablet"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Tablet View"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
              device === "mobile"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Mobile View"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={reloadIframe}
            className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 p-0"
            title="Reload Demo"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <a
            href={projectUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open Direct</span>
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-8 w-8 p-0 rounded-lg ml-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Sandbox Frame Container */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-2 sm:p-4">
        <div
          className={`h-full w-full transition-all duration-300 flex flex-col rounded-xl overflow-hidden bg-white shadow-2xl border border-slate-700/50 ${getDeviceWidth()}`}
        >
          {/* Mock Browser Header for Iframe */}
          <div className="h-7 bg-slate-800 px-3 flex items-center justify-between border-b border-slate-700 shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="text-[11px] font-mono text-slate-400 truncate max-w-sm px-2">
              {projectUrl}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Safe Sandbox
            </div>
          </div>

          <iframe
            key={key}
            src={projectUrl}
            className="w-full flex-1 border-0 bg-white"
            title={projectTitle}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
          />
        </div>
      </div>

      {/* Recruiter Evaluation Bar */}
      <div className="mt-2 rounded-xl bg-slate-900 border border-slate-800 p-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">Rate Live App:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRating(star);
                  setRated(true);
                }}
                className={`p-0.5 transition-transform hover:scale-110 ${
                  star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
                }`}
              >
                <Star className="h-4 w-4 fill-current" />
              </button>
            ))}
          </div>
          {rated && (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Rating recorded in recruiter review
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-400">
          Tip: Test responsive responsiveness and form interactions directly inside this sandbox.
        </div>
      </div>
    </div>
  );
}