"use client";

import { useState, useEffect } from "react";
import { Clock, Sparkles, Calendar, Bell } from "lucide-react";

interface AdmissionsCountdownProps {
  targetDate?: string | Date | null;
  cohortName?: string | null;
  announcement?: string | null;
  onJoinWaitlist?: () => void;
}

export function AdmissionsCountdown({
  targetDate,
  cohortName = "Upcoming Industrial Cohort",
  announcement,
  onJoinWaitlist,
}: AdmissionsCountdownProps) {
  // If no date provided, default to a future date (e.g. 7 days from now)
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 7);
  defaultDate.setHours(10, 0, 0, 0);

  const destinationTime = targetDate ? new Date(targetDate).getTime() : defaultDate.getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = destinationTime - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [destinationTime]);

  const formattedTargetDate = targetDate
    ? new Date(targetDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Opening Soon";

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-2xl shadow-amber-500/10 space-y-4">
      {/* HEADER TAG */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-amber-300">
            Admissions Opening Soon
          </span>
        </div>
        {cohortName && (
          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {cohortName}
          </span>
        )}
      </div>

      {/* ANNOUNCEMENT MESSAGE */}
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Priority Access &amp; Cohort Seat Reservations</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {announcement ||
            "Admissions for this specialized industrial track are scheduled to unlock soon. Seats are strictly capped per batch to maintain 1-on-1 code reviews and mentor feedback."}
        </p>
      </div>

      {/* LIVE COUNTDOWN COUNTER */}
      {!timeLeft.isPast ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto pt-1">
          <div className="rounded-xl bg-slate-950/90 border border-amber-500/20 p-2 sm:p-3 text-center shadow-inner">
            <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Days
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/90 border border-amber-500/20 p-2 sm:p-3 text-center shadow-inner">
            <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Hours
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/90 border border-amber-500/20 p-2 sm:p-3 text-center shadow-inner">
            <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Mins
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/90 border border-amber-500/20 p-2 sm:p-3 text-center shadow-inner">
            <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
              Secs
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-center text-xs font-bold text-emerald-300">
          🎉 Admissions have just unlocked! Refresh the page to claim your seat.
        </div>
      )}

      {/* FOOTER TARGET DATE & CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            Scheduled Launch: <strong className="text-white">{formattedTargetDate}</strong>
          </span>
        </div>

        {onJoinWaitlist && (
          <button
            type="button"
            onClick={onJoinWaitlist}
            className="w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all hover:scale-105"
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Join Priority Waitlist</span>
          </button>
        )}
      </div>
    </div>
  );
}
