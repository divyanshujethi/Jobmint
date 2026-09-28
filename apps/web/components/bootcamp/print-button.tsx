"use client";

import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ label = "Print / Download PDF" }: { label?: string }) {
  return (
    <Button
      onClick={() => window.print()}
      size="sm"
      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs h-9 px-4 inline-flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
    >
      <Printer className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}
