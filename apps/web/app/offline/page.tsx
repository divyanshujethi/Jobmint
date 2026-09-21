"use client";

import Link from "next/link";
import { WifiOff, BookOpen, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-6">
        <WifiOff className="w-8 h-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        You are currently offline
      </h1>
      <p className="mt-2 text-sm text-slate-600 max-w-md">
        Your internet connection seems to be unavailable. Good news: our curated career roadmaps are cached for offline study!
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>

        <Link
          href="/roadmaps"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
        >
          <BookOpen className="w-4 h-4" />
          Browse Cached Roadmaps
        </Link>
      </div>

      <div className="mt-12 p-4 rounded-xl border border-slate-200 bg-white max-w-md text-xs text-slate-500 text-left">
        💡 <strong>Offline Mode:</strong> All 4 core career roadmaps (AI/ML, Web Dev, Data Science, Mobile) remain fully readable even without active cellular or Wi-Fi data.
      </div>
    </div>
  );
}