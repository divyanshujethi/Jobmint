"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Eye,
  Sparkles,
  AlertCircle,
  Zap,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  INITIAL_NOTIFICATIONS,
  InAppNotification,
} from "@/lib/mock-notifications";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<InAppNotification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
      })
      .catch((err) => console.error("Error in bell:", err));
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-2xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN POPOVER */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-emerald-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <Link
                key={notif.id}
                href={notif.linkUrl}
                onClick={() => {
                  markSingleRead(notif.id);
                  setIsOpen(false);
                }}
                className={`block rounded-xl border p-3 transition-all hover:bg-slate-50 ${
                  !notif.isRead
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {notif.type === "VIEWED" ? (
                      <Eye className="h-4 w-4 text-emerald-600" />
                    ) : notif.type === "SHORTLISTED" ? (
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                    ) : notif.type === "GHOSTING" ? (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    ) : (
                      <Zap className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 leading-snug">
                      {notif.title}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 block pt-0.5">
                      {notif.timestampAgo}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-3 border-t border-slate-100 pt-2 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
            >
              View all notifications <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
