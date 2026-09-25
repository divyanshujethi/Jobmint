"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Flame, Layers, Crown, User, ShieldCheck } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Jobs",
      href: "/jobs",
      icon: Briefcase,
      isActive: pathname === "/jobs" || pathname.startsWith("/jobs/"),
    },
    {
      name: "POTD",
      href: "/potd",
      icon: Flame,
      isActive: pathname === "/potd" || pathname.startsWith("/problems"),
    },
    {
      name: "Track",
      href: "/applications",
      icon: Layers,
      isActive: pathname === "/applications",
    },
    {
      name: "Pro",
      href: "/pricing",
      icon: Crown,
      isActive: pathname === "/pricing",
      highlight: true,
    },
    {
      name: "Truth",
      href: "/transparency",
      icon: ShieldCheck,
      isActive: pathname === "/transparency",
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 transition-transform duration-200"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-150 touch-manipulation min-h-[44px] ${
                active
                  ? item.highlight
                    ? "text-amber-400 font-bold"
                    : "text-emerald-400 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div
                className={`relative flex items-center justify-center p-1 rounded-lg transition-transform ${
                  active ? "scale-110" : ""
                } ${item.highlight && !active ? "text-amber-400/90" : ""}`}
              >
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  active ? "font-bold" : "font-medium"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
