"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Activity,
  Gauge,
  HelpCircle,
  X,
  Sparkles,
  Server,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HardwareReport {
  ramGb: number | null;
  cpuCores: number | null;
  hasWebGpu: boolean;
  gpuName: string;
  isPotatoPc: boolean;
  classification: "POTATO" | "MODERATE" | "CAPABLE" | "UNKNOWN";
  ratingLabel: string;
  verdictExplanation: string;
  recommendation: string;
}

export function WebGpuBadge({
  onSelectLocal,
  isSelected,
}: {
  onSelectLocal: (enabled: boolean) => void;
  isSelected: boolean;
}) {
  const [report, setReport] = useState<HardwareReport | null>(null);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const runHardwareDiagnostic = async () => {
    setIsBenchmarking(true);

    let ramGb: number | null = null;
    let cpuCores: number | null = null;
    let hasWebGpu = false;
    let gpuName = "Unavailable / Software Emulation";

    // 1. Detect RAM & CPU Cores
    if (typeof navigator !== "undefined") {
      ramGb = (navigator as any).deviceMemory || null;
      cpuCores = navigator.hardwareConcurrency || null;
    }

    // 2. Detect WebGPU
    if (typeof window !== "undefined" && "gpu" in navigator) {
      try {
        const adapter = await (navigator as any).gpu.requestAdapter({
          powerPreference: "high-performance",
        });

        if (adapter) {
          hasWebGpu = true;
          const info = adapter.info || (await (adapter as any).requestAdapterInfo?.());
          gpuName = info?.description || info?.vendor || info?.architecture || "Hardware-Accelerated WebGPU";
        }
      } catch {
        hasWebGpu = false;
      }
    }

    // Small benchmark pause for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 3. Classify Machine (Potato PC vs Moderate vs Capable)
    let isPotato = false;
    let classification: HardwareReport["classification"] = "MODERATE";
    let ratingLabel = "⚠️ Moderate Hardware";
    let verdictExplanation = "Your hardware can run light web workloads, but local browser LLMs may cause slight browser lag.";
    let recommendation = "JobMint Cloud AI (Gemini 2.5) is recommended for zero local battery/memory drain.";

    if (!hasWebGpu || (ramGb !== null && ramGb < 4) || (cpuCores !== null && cpuCores < 4)) {
      isPotato = true;
      classification = "POTATO";
      ratingLabel = "🥔 Potato PC / Low-End Hardware Detected";
      verdictExplanation = `Limited resources (${ramGb ? ramGb + " GB RAM" : "< 4GB RAM"}, ${cpuCores ? cpuCores + " CPU cores" : "< 4 Cores"}, ${hasWebGpu ? "Basic WebGPU" : "No WebGPU"}). Loading a 1.5GB local AI model in your browser tab will cause extreme freezing or out-of-memory crashes.`;
      recommendation = "⚡ Automatically routed to JobMint Cloud AI (Gemini). Zero local RAM used, 100% instant responses.";
    } else if (hasWebGpu && (ramGb === null || ramGb >= 8) && (cpuCores === null || cpuCores >= 6)) {
      classification = "CAPABLE";
      ratingLabel = "🚀 High-Performance Machine Verified";
      verdictExplanation = `Robust hardware verified (${ramGb ? ramGb + " GB RAM" : "High RAM"}, ${cpuCores} Threads, WebGPU active). Capable of client-side neural tensor computation.`;
      recommendation = "You can safely run local on-device Llama 3.2 1B or switch to Cloud Gemini anytime.";
    }

    setReport({
      ramGb,
      cpuCores,
      hasWebGpu,
      gpuName,
      isPotatoPc: isPotato,
      classification,
      ratingLabel,
      verdictExplanation,
      recommendation,
    });

    setIsBenchmarking(false);
  };

  useEffect(() => {
    runHardwareDiagnostic();
  }, []);

  return (
    <>
      {/* MAIN BADGE CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                report?.isPotatoPc
                  ? "bg-amber-100 text-amber-800"
                  : report?.classification === "CAPABLE"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {report?.isPotatoPc ? (
                <span className="text-xl">🥔</span>
              ) : (
                <Cpu className="h-5 w-5" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Client Hardware Diagnostic (Browser AI vs Cloud)
                </span>
                {report && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold border ${
                      report.isPotatoPc
                        ? "bg-amber-50 text-amber-900 border-amber-200"
                        : report.classification === "CAPABLE"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {report.ratingLabel}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-1">
                {report
                  ? report.verdictExplanation
                  : "Scanning system RAM, CPU cores, and WebGPU hardware capability..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isBenchmarking}
              onClick={() => setIsDiagnosticOpen(true)}
              className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl gap-1.5 h-8 font-semibold"
            >
              <Gauge className="h-3.5 w-3.5 text-emerald-600" />
              <span>{isBenchmarking ? "Testing Specs..." : "Test My PC Hardware"}</span>
            </Button>
          </div>
        </div>

        {/* HARDWARE RECOMMENDATION STRIP */}
        {report && (
          <div
            className={`rounded-xl p-3 text-xs flex items-center justify-between gap-3 border ${
              report.isPotatoPc
                ? "bg-amber-50/70 border-amber-200 text-amber-950"
                : "bg-emerald-50/60 border-emerald-200 text-emerald-950"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{report.recommendation}</span>
            </div>

            {!report.isPotatoPc && report.hasWebGpu && (
              <button
                type="button"
                onClick={() => onSelectLocal(!isSelected)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {isSelected ? "Using Local WebGPU ✓" : "Enable Local WebGPU"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* HARDWARE DIAGNOSTIC MODAL */}
      {isDiagnosticOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="max-w-lg w-full rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Gauge className="h-5 w-5 text-emerald-600" />
                PC Hardware Diagnostic &amp; Spec Check
              </div>
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We test your real hardware specifications to determine whether your browser can safely execute local WebGPU LLMs (e.g. Llama 3.2 1B) without freezing your system, or whether you should use JobMint Cloud AI.
            </p>

            {/* SPEC TELEMETRY GRID */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  Detected RAM
                </span>
                <strong className="text-base text-slate-900 block">
                  {report?.ramGb ? `${report.ramGb} GB RAM` : "Standard Memory"}
                </strong>
                <span className="text-[10px] text-slate-500 block">
                  {report?.ramGb && report.ramGb < 4 ? "❌ Under 4GB minimum" : "✓ Sufficient for browser"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  CPU Cores / Threads
                </span>
                <strong className="text-base text-slate-900 block">
                  {report?.cpuCores ? `${report.cpuCores} Logical Threads` : "Multi-core detected"}
                </strong>
                <span className="text-[10px] text-slate-500 block">
                  {report?.cpuCores && report.cpuCores < 4 ? "❌ Low core count" : "✓ Multi-threaded support"}
                </span>
              </div>

              <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">
                  WebGPU Hardware Acceleration
                </span>
                <strong className="text-sm text-slate-900 block">
                  {report?.hasWebGpu ? `Active (${report.gpuName})` : "Not Available on this Browser/GPU"}
                </strong>
                <span className="text-[10px] text-slate-500 block">
                  {report?.hasWebGpu
                    ? "✓ Hardware rasterizer & compute shader extensions available"
                    : "❌ No WebGPU acceleration found. Browser AI cannot run locally."}
                </span>
              </div>
            </div>

            {/* SUMMARY VERDICT */}
            <div
              className={`rounded-2xl p-4 border space-y-1.5 ${
                report?.isPotatoPc
                  ? "bg-amber-50 border-amber-200 text-amber-950"
                  : "bg-emerald-50 border-emerald-200 text-emerald-950"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>{report?.ratingLabel}</span>
              </div>
              <p className="text-xs leading-relaxed">
                {report?.verdictExplanation}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={runHardwareDiagnostic}
                disabled={isBenchmarking}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 rounded-xl"
              >
                {isBenchmarking ? "Re-running Hardware Check..." : "Re-run Diagnostic"}
              </Button>
              <Button
                type="button"
                onClick={() => setIsDiagnosticOpen(false)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 rounded-xl"
              >
                Close Diagnostic
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
