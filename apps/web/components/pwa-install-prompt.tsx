"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("[PWA] Service Worker registered"))
        .catch((err) => console.warn("[PWA] Service Worker registration failed:", err));
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner || installed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-emerald-500/30 bg-neutral-950 p-4 text-neutral-100 shadow-2xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-neutral-950 font-bold text-lg">
            J
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Install JobMint App</h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              100% Free • Fast Offline Roadmaps & Live Job Alerts
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3.5 flex gap-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-neutral-950 hover:bg-emerald-400 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Install on Device
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}