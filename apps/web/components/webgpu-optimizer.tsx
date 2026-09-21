"use client";

import { useState, useEffect } from "react";
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export function WebGpuBadge({
  onSelectLocal,
  isSelected,
}: {
  onSelectLocal: (enabled: boolean) => void;
  isSelected: boolean;
}) {
  const [hasWebGpu, setHasWebGpu] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "gpu" in navigator) {
      (navigator as any).gpu
        ?.requestAdapter()
        .then((adapter: any) => {
          setHasWebGpu(Boolean(adapter));
        })
        .catch(() => setHasWebGpu(false));
    } else {
      setHasWebGpu(false);
    }
  }, []);

  return (
    <div
      onClick={() => {
        if (hasWebGpu) {
          onSelectLocal(!isSelected);
        }
      }}
      className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
        isSelected
          ? "border-emerald-500 bg-emerald-950/30 text-emerald-200 ring-1 ring-emerald-500"
          : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              hasWebGpu ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-500"
            }`}
          >
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
              Tier 0: Client WebGPU (Llama 3.2 1B)
              {hasWebGpu && (
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                  Ready
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {hasWebGpu
                ? "Local GPU accelerated • Zero server load • 100% private"
                : "WebGPU not supported on this browser (Auto-Cascade will be used)"}
            </p>
          </div>
        </div>

        {hasWebGpu && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-medium text-emerald-400">
              {isSelected ? "ACTIVE" : "CLICK TO ENABLE"}
            </span>
            <div
              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                isSelected
                  ? "border-emerald-500 bg-emerald-500 text-neutral-950"
                  : "border-neutral-700 bg-neutral-800"
              }`}
            >
              {isSelected && <CheckCircle2 className="h-3 w-3" />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}