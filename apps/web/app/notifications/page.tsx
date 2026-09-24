"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { InAppNotification } from "@/lib/mock-notifications";
import {
  Bell,
  Eye,
  Sparkles,
  AlertCircle,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationsCenterPage() {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      })
      .catch((err) => console.error("Error loading live notifications:", err))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "TRUTH_TELLER")
      return n.type === "VIEWED" || n.type === "GHOSTING";
    return true;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md mb-2">
            <Bell className="h-3.5 w-3.5 text-emerald-600" /> Real-Time Telemetry Feed
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Notifications Center
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Real recruiter read receipts, application tracking, and verified certificates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="text-xs font-semibold self-start sm:self-auto"
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* FILTER BUTTONS */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filter === "ALL"
              ? "bg-slate-900 text-white shadow-2xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Notifications ({notifications.length})
        </button>

        <button
          onClick={() => setFilter("UNREAD")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filter === "UNREAD"
              ? "bg-emerald-600 text-white shadow-2xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Unread ({unreadCount})
        </button>

        <button
          onClick={() => setFilter("TRUTH_TELLER")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filter === "TRUTH_TELLER"
              ? "bg-purple-600 text-white shadow-2xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Truth Teller Alerts
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-slate-400">
            Checking telemetry feed...
          </div>
        ) : filteredNotifs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-base font-bold text-slate-800">
              You're all caught up!
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              No new alerts or read receipts. Real-time notifications will appear here as soon as recruiters review your applications.
            </p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markSingleRead(notif.id)}
              className={`rounded-2xl border p-5 transition-all ${
                !notif.isRead
                  ? "border-emerald-200 bg-emerald-50/20 shadow-2xs"
                  : "border-slate-200 bg-white shadow-2xs"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
                    {notif.type === "VIEWED" ? (
                      <Eye className="h-5 w-5 text-emerald-600" />
                    ) : notif.type === "SHORTLISTED" ? (
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                    ) : notif.type === "GHOSTING" ? (
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    ) : (
                      <Zap className="h-5 w-5 text-blue-600" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {notif.message}
                    </p>
                    <span className="text-[11px] font-medium text-slate-400 block pt-1">
                      {notif.timestampAgo}
                    </span>
                  </div>
                </div>

                <Link href={notif.linkUrl}>
                  <Button size="sm" variant="outline" className="text-xs font-semibold gap-1 shrink-0">
                    View <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
