"use client";

import { useState } from "react";
import { Bell, MessageCircle, Send, CheckCircle2, Sparkles, X, ChevronRight, Smartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLE_OPTIONS = [
  "Frontend Engineer",
  "Backend (Node/Go/Java)",
  "Full Stack Developer",
  "AI & GenAI Engineer",
  "DevOps & Cloud",
  "Internships & Freshers",
];

const LOCATION_OPTIONS = [
  "Remote Only",
  "Bangalore",
  "Delhi NCR",
  "Mumbai",
  "Hyderabad",
  "Pune",
];

export function InstantAlertsBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Eye-catching Banner on /jobs */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-4 sm:p-5 text-white shadow-md my-6">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">
                  Get Instant WhatsApp &amp; Telegram Job Alerts
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  ⚡ 0 Email Delay
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Indian tech hiring moves in minutes. Receive verified job pings directly on WhatsApp or Telegram the moment they drop.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:shrink-0">
            <Button
              onClick={() => setIsOpen(true)}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs gap-1.5 shadow-sm min-h-[44px]"
            >
              <Smartphone className="h-4 w-4" />
              Configure Alerts
            </Button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Modal Dialog */}
      {isOpen && <InstantAlertsModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

export function InstantAlertsModal({ onClose }: { onClose: () => void }) {
  const [channel, setChannel] = useState<"WHATSAPP" | "TELEGRAM">("WHATSAPP");
  const [target, setTarget] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(["Internships & Freshers", "Full Stack Developer"]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(["Remote Only", "Bangalore"]);
  const [isLoading, setIsLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{ message: string; actionUrl: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) {
      setErrorMessage(channel === "WHATSAPP" ? "Please enter your WhatsApp mobile number." : "Please enter your Telegram handle.");
      return;
    }
    if (selectedRoles.length === 0) {
      setErrorMessage("Please select at least one role track.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/alerts/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          target,
          roles: selectedRoles,
          locations: selectedLocations,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe to alerts");
      }

      setSuccessResult({
        message: data.message,
        actionUrl: data.actionUrl,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-900 space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!successResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Bell className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Instant Job Alerts Setup
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Zero spam. Receive instant notifications the second a company posts a matching verified role.
              </p>
            </div>

            {/* CHANNEL SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Choose Notification Channel</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setChannel("WHATSAPP")}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold border transition-all min-h-[44px] ${
                    channel === "WHATSAPP"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  WhatsApp Alerts
                </button>

                <button
                  type="button"
                  onClick={() => setChannel("TELEGRAM")}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold border transition-all min-h-[44px] ${
                    channel === "TELEGRAM"
                      ? "border-sky-600 bg-sky-50 text-sky-900 shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Send className="h-4 w-4 text-sky-600" />
                  Telegram Bot
                </button>
              </div>
            </div>

            {/* TARGET INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                {channel === "WHATSAPP" ? "WhatsApp Number (+91)" : "Telegram Username (@handle)"}
              </label>
              <input
                type="text"
                placeholder={channel === "WHATSAPP" ? "+91 98765 43210" : "@your_telegram_id"}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[44px]"
              />
            </div>

            {/* ROLE TRACKS */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Role Categories (Select multiple)</label>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_OPTIONS.map((role) => {
                  const selected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                        selected
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LOCATIONS */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Locations</label>
              <div className="flex flex-wrap gap-1.5">
                {LOCATION_OPTIONS.map((loc) => {
                  const selected = selectedLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleLocation(loc)}
                      className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                        selected
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm min-h-[44px]"
            >
              {isLoading ? "Saving Preferences..." : "Activate Instant Alerts"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Alerts Activated Successfully!
            </h3>

            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {successResult.message}
            </p>

            <div className="pt-2">
              <a
                href={successResult.actionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 text-xs font-bold shadow-md transition-all w-full min-h-[44px]"
              >
                {channel === "WHATSAPP" ? (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    Open Role Nest WhatsApp Channel
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Start Telegram Alert Bot
                  </>
                )}
                <ChevronRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium pt-2 block mx-auto"
            >
              Close and back to jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
