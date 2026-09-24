"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  INITIAL_NOTIFICATIONS,
  InAppNotification,
} from "@/lib/mock-notifications";
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
  const [notifications, setNotifications] = useState<InAppNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
      })
      .catch((err) => console.error("Error loading live notifications:", err));
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
            <Bell className="h-3.5 w-3.5 text-emerald-600" /> Notifications & Activity
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Notification Center
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Real-time updates on your applications, recruiter resume views, and ghosting alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllRead}
              className="text-xs font-semibold"
            >
              Mark all read
            </Button>
          )}
          <Link href="/settings/notifications">
            <Button variant="ghost" size="sm" className="text-xs text-slate-600 gap-1">
              <Settings className="h-3.5 w-3.5" /> Preferences
            </Button>
          </Link>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "ALL", label: `All Alerts (${notifications.length})` },
          { id: "UNREAD", label: `Unread (${unreadCount})` },
          { id: "TRUTH_TELLER", label: `Truth Teller Only` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              filter === tab.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="mt-6 space-y-3">
        {filteredNotifs.map((notif) => (
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
        ))}
      </div>
    </div>
  );
}
