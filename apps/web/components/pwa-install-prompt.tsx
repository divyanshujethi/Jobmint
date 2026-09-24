"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone, CheckCircle2 } from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [manualInstructions, setManualInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    // Register Service Worker in production
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("[PWA] Service Worker registered"))
        .catch((err) => console.warn("[PWA] Service Worker registration failed:", err));
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Only auto-show banner if user has NOT previously dismissed it
      try {
        const dismissed = localStorage.getItem("jobmint_pwa_dismissed");
        if (!dismissed) {
          setShowBanner(true);
        }
      } catch {}
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      try {
        localStorage.setItem("jobmint_pwa_dismissed", "true");
      } catch {}
    });

    // Listen for manual trigger from footer or settings
    const manualTriggerHandler = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice: any) => {
          if (choice.outcome === "accepted") {
            setInstalled(true);
          }
          setDeferredPrompt(null);
        });
      } else {
        setManualInstructions(true);
      }
    };

    window.addEventListener("trigger-pwa-install", manualTriggerHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("trigger-pwa-install", manualTriggerHandler);
    };
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem("jobmint_pwa_dismissed", "true");
    } catch {}
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setManualInstructions(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setInstalled(true);
    }
    setDeferredPrompt(null);
    try {
      localStorage.setItem("jobmint_pwa_dismissed", "true");
    } catch {}
  };

  if (installed) return null;

  return (
    <>
      {/* 1. ONE-TIME FLOATING BANNER (White / Emerald theme) */}
      {showBanner && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-extrabold text-lg shadow-sm">
                J
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Install JobMint App</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  100% Free • Fast Offline Roadmaps &amp; Live Job Alerts
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              title="Don't show again"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-xs font-bold text-white transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Install on Device
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Don&apos;t ask again
            </button>
          </div>
        </div>
      )}

      {/* 2. MANUAL INSTRUCTION MODAL IF BROWSER DOES NOT SUPPORT AUTOMATIC PROMPT */}
      {manualInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Smartphone className="h-5 w-5 text-emerald-600" />
                How to Install JobMint App
              </div>
              <button
                onClick={() => setManualInstructions(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              JobMint is a Progressive Web App (PWA) with full offline support and instant loading. You can install it directly from your browser:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <div>
                <strong className="text-slate-900 block mb-0.5">Desktop Chrome / Edge / Brave:</strong>
                Look for the <strong>Install App icon (⊕ or 💻)</strong> on the right side of your browser URL bar and click &quot;Install&quot;.
              </div>
              <div className="border-t border-slate-200 pt-2">
                <strong className="text-slate-900 block mb-0.5">iPhone / iPad (Safari):</strong>
                Tap the <strong>Share button (⎋)</strong> at the bottom of the screen, scroll down, and tap <strong>&quot;Add to Home Screen&quot;</strong>.
              </div>
              <div className="border-t border-slate-200 pt-2">
                <strong className="text-slate-900 block mb-0.5">Android (Chrome):</strong>
                Tap the <strong>Three dots (⋮)</strong> menu in the top right corner and tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.
              </div>
            </div>

            <button
              onClick={() => setManualInstructions(false)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
